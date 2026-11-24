import { NextResponse } from "next/server";
import { buildMealPrompt } from "@/lib/prompts";

// Gemini models: the primary is tried twice, then the fallback once. The next
// attempt only runs if the previous one was overloaded (503), rate-limited (429)
// or timed out.
const GEMINI_PRIMARY_MODEL = "gemini-3.5-flash-lite";
const GEMINI_FALLBACK_MODEL = "gemini-3.6-flash";

type GeminiAttempt = { model: string; timeoutMs: number; delayBeforeMs: number };

const GEMINI_ATTEMPTS: GeminiAttempt[] = [
  { model: GEMINI_PRIMARY_MODEL, timeoutMs: 12_000, delayBeforeMs: 0 },
  { model: GEMINI_PRIMARY_MODEL, timeoutMs: 12_000, delayBeforeMs: 1_000 },
  { model: GEMINI_FALLBACK_MODEL, timeoutMs: 15_000, delayBeforeMs: 0 },
];

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

// Worst case is 12s + 1s pause + 12s + 15s = 40s, inside one function run on Vercel.
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

  let result: GeminiResult | undefined;
  for (const [i, attempt] of GEMINI_ATTEMPTS.entries()) {
    if (attempt.delayBeforeMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, attempt.delayBeforeMs));
    }
    result = await callGemini(attempt.model, attempt.timeoutMs, apiKey, prompt);
    if (result.ok || !result.retryable) break;
    const next = GEMINI_ATTEMPTS[i + 1];
    if (next) {
      console.error(
        `Gemini attempt ${i + 1} (${attempt.model}) failed (${result.reason}); trying ${next.model}.`
      );
    }
  }

  if (!result) {
    return NextResponse.json(
      { error: "Failed to reach the meal generator. Please try again." },
      { status: 502 }
    );
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

// A single Gemini attempt with its own timeout.
async function callGemini(
  model: string,
  timeoutMs: number,
  apiKey: string,
  prompt: string
): Promise<GeminiResult> {
  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(geminiUrl(model), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(timeoutMs),
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
      console.error(`Gemini ${model} timed out after ${timeoutMs}ms`);
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
