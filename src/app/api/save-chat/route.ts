import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  CATEGORY_OPTIONS,
  COOKING_FOR_OPTIONS,
  MAX_RECOMMENDED_KIT_LENGTH,
  MAX_USER_MESSAGE_LENGTH,
  TIME_OPTIONS,
  detectGuardrail,
} from "@/lib/chat-logic";

type Parsed = { ok: true; value: string | null } | { ok: false; error: string };

// null/undefined → null; otherwise it must be one of the allowed answers.
function parseChoice(value: unknown, allowed: string[], field: string): Parsed {
  if (value === null || value === undefined) return { ok: true, value: null };
  if (typeof value === "string" && allowed.includes(value)) return { ok: true, value };
  return { ok: false, error: `${field} must be one of: ${allowed.join(", ")}.` };
}

// null/undefined/blank → null; otherwise a string of at most `max` characters.
function parseText(value: unknown, max: number, field: string): Parsed {
  if (value === null || value === undefined) return { ok: true, value: null };
  if (typeof value !== "string" || value.trim().length > max) {
    return { ok: false, error: `${field} must be text of at most ${max} characters.` };
  }
  return { ok: true, value: value.trim() || null };
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }
  if (typeof body !== "object" || body === null) {
    return badRequest("Body must be a JSON object.");
  }
  const input = body as Record<string, unknown>;

  const fields = [
    parseChoice(input.intake_people, COOKING_FOR_OPTIONS, "intake_people"),
    parseChoice(input.intake_time, TIME_OPTIONS.map((option) => option.label), "intake_time"),
    parseChoice(input.intake_craving, CATEGORY_OPTIONS, "intake_craving"),
    parseText(input.recommended_kit, MAX_RECOMMENDED_KIT_LENGTH, "recommended_kit"),
    parseText(input.user_message, MAX_USER_MESSAGE_LENGTH, "user_message"),
  ];
  for (const field of fields) {
    if (!field.ok) return badRequest(field.error);
  }
  const [people, time, craving, recommendedKit, userMessage] = fields.map((field) =>
    field.ok ? field.value : null
  );

  const rating = input.rating ?? null;
  if (rating !== null && rating !== "up" && rating !== "down") {
    return badRequest("rating must be up, down, or null.");
  }

  // Recomputed here so a browser can't skip or fake the guardrail.
  const guardrail = userMessage ? detectGuardrail(userMessage) : null;

  // Without a guardrail, this is a finished chat being rated: everything is required.
  if (!guardrail && (!people || !time || !craving || !recommendedKit)) {
    return badRequest(
      "intake_people, intake_time, intake_craving, and recommended_kit are required."
    );
  }

  const { error } = await supabase.from("chat_sessions").insert({
    intake_people: people,
    intake_time: time,
    intake_craving: craving,
    recommended_kit: recommendedKit,
    rating,
    // Typed text is only kept for chats that hit a guardrail.
    user_message: guardrail ? userMessage : null,
    guardrail_triggered: guardrail !== null,
    needs_human_review: guardrail !== null,
  });

  if (error) {
    console.error("save-chat insert failed:", error.message);
    return NextResponse.json({ error: "Couldn't save the chat. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ saved: true }, { status: 201 });
}
