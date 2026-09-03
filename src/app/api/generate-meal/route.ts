import { NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const TIME_LABELS: Record<string, string> = {
  "10": "10 min",
  "20": "20 min",
  "30": "30+ min",
};

const BUDGET_LABELS: Record<string, string> = {
  low: "bajo",
  medium: "medio",
  high: "alto",
};

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

  const timeLabel = TIME_LABELS[time] ?? time;
  const budgetLabel = BUDGET_LABELS[budget] ?? budget;

  const prompt = `You are a meal-idea generator for a healthy meal kit service aimed at students who live alone.
Given the following constraints, propose ONE simple meal idea.

Available ingredients: ${ingredients}
Available time: ${timeLabel}
Budget: ${budgetLabel}

Respond with a single meal idea that realistically fits the time and budget given.`;

  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the Gemini API." },
      { status: 502 }
    );
  }

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    return NextResponse.json(
      { error: `Gemini API error: ${errorText}` },
      { status: 502 }
    );
  }

  const data = await geminiResponse.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return NextResponse.json(
      { error: "Gemini API returned an empty response." },
      { status: 502 }
    );
  }

  let meal: MealIdea;
  try {
    meal = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Gemini API returned invalid JSON." },
      { status: 502 }
    );
  }

  return NextResponse.json(meal);
}
