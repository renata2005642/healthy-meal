import { NextResponse } from "next/server";
import { buildMealPrompt } from "@/lib/prompts";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_TIMEOUT_MS = 20_000;

// Two 20s attempts must fit in one function run on Vercel.
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

  // One automatic retry: worst case is two full timeouts (2 x 20s = 40s).
  let result = await callGemini(apiKey, prompt);
  if (!result.ok && result.retryable) {
    console.error(`Gemini attempt 1 failed (${result.reason}); retrying once.`);
    result = await callGemini(apiKey, prompt);
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
  retryable = true
): GeminiResult {
  return { ok: false, status, error, reason, retryable };
}

// A single Gemini attempt with its own 20s timeout.
async function callGemini(apiKey: string, prompt: string): Promise<GeminiResult> {
  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(GEMINI_URL, {
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
      console.error(`Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms`);
      return failure(
        504,
        "The meal generator took too long to respond. Please try again.",
        "timeout"
      );
    }
    console.error("Failed to reach the Gemini API:", err instanceof Error ? err.name : err);
    return failure(502, "Failed to reach the meal generator. Please try again.", "network error");
  }

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text().catch(() => "");
    console.error(`Gemini API error ${geminiResponse.status}: ${errorText.slice(0, 500)}`);
    // 429 and 5xx are usually temporary; other 4xx (bad key, bad model) would fail again.
    const retryable = geminiResponse.status === 429 || geminiResponse.status >= 500;
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
