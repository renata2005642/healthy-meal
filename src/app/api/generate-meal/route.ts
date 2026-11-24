import { NextResponse } from "next/server";
import { buildMealPrompt } from "@/lib/prompts";

// Gemini models: the primary is tried first; if it is overloaded (503),
// rate-limited (429) or times out, the fallback (a different model) is tried once.
const GEMINI_PRIMARY_MODEL = "gemini-3.5-flash-lite";
const GEMINI_FALLBACK_MODEL = "gemini-3.6-flash";
const GEMINI_TIMEOUT_MS = 20_000;

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

// Two 20s attempts (40s worst case) must fit in one function run on Vercel.
export const maxDuration = 60;

type GenerateMealRequestBody = {
  ingredients?: string;
  time?: string;
  budget?: string;
};

type MealIdea = {
  name: string;
  ingredients_used: string[];
  estimated_time: string;
  description: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: GenerateMealRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const ingredients = body.ingredients?.trim();
  const time = body.time?.trim();
  const budget = body.budget?.trim();

  if (!ingredients || !time || !budget) {
    return NextResponse.json(
      { error: "ingredients, time, and budget are all required." },
      { status: 400 }
    );
  }

  const prompt = buildMealPrompt(ingredients, time, budget);

  // Primary model first; on 503/429/timeout, one attempt with the fallback model.
  // Worst case is two full timeouts (2 x 20s = 40s).
  let result = await callGemini(GEMINI_PRIMARY_MODEL, apiKey, prompt);
  if (!result.ok && result.retryable) {
    console.error(
      `Gemini ${GEMINI_PRIMARY_MODEL} failed (${result.reason}); trying ${GEMINI_FALLBACK_MODEL}.`
    );
    result = await callGemini(GEMINI_FALLBACK_MODEL, apiKey, prompt);
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.meal);
}

type GeminiResult =
  | { ok: true; meal: MealIdea }
  | { ok: false; status: number; error: string; reason: string; retryable: boolean };

function failure(
  status: number,
  error: string,
  reason: string,
  retryable = false
): GeminiResult {
  return { ok: false, status, error, reason, retryable };
}

// A single Gemini attempt with its own 20s timeout.
async function callGemini(
  model: string,
  apiKey: string,
  prompt: string
): Promise<GeminiResult> {
  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(geminiUrl(model), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              name: { type: "string" },
              ingredients_used: { type: "array", items: { type: "string" } },
              estimated_time: { type: "string" },
              description: { type: "string" },
            },
            required: ["name", "ingredients_used", "estimated_time", "description"],
          },
        },
      }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`Gemini ${model} timed out after ${GEMINI_TIMEOUT_MS}ms`);
      return failure(
        504,
        "The meal generator took too long to respond. Please try again.",
        "timeout",
        true
      );
    }
    console.error(`Failed to reach Gemini ${model}:`, err instanceof Error ? err.name : err);
    return failure(
      502,
      "Failed to reach the meal generator. Please try again.",
      "network error"
    );
  }

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text().catch(() => "");
    console.error(`Gemini ${model} error ${geminiResponse.status}: ${errorText.slice(0, 500)}`);
    // Only overload (503) and rate limits (429) switch to the fallback model.
    const retryable = geminiResponse.status === 503 || geminiResponse.status === 429;
    return failure(
      502,
      `The meal generator returned an error (status ${geminiResponse.status}). Please try again.`,
      `status ${geminiResponse.status}`,
      retryable
    );
  }

  let text: string | undefined;
  try {
    const data = await geminiResponse.json();
    text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch {
    return failure(502, "Gemini API returned an unreadable response.", "unreadable response");
  }

  if (!text) {
    return failure(502, "Gemini API returned an empty response.", "empty response");
  }

  try {
    return { ok: true, meal: JSON.parse(text) as MealIdea };
  } catch {
    return failure(502, "Gemini API returned invalid JSON.", "invalid JSON");
  }
}
