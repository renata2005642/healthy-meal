// Pure, rule-based logic for the /chat guided assistant (no React, no AI, no Supabase).

import { mealKits, type MealKit } from "@/data/meal-kits";

export type CookingFor = "Just me" | "Me and a roommate";
export type MaxMinutes = 10 | 20;

export type ChatAnswers = {
  cookingFor: CookingFor;
  maxMinutes: MaxMinutes;
  category: string;
};

export type KitPick = {
  main: MealKit;
  alternative: MealKit;
  // False when no kit fits both the time and the category, so `main` is the closest fit.
  exactMatch: boolean;
};

export type Guardrail = "medical" | "off_topic";

export type ChatRating = "up" | "down";

// Body of POST /api/save-chat. Intake answers are the quick-reply labels.
export type SaveChatPayload = {
  intake_people: string | null;
  intake_time: string | null;
  intake_craving: string | null;
  recommended_kit: string | null;
  rating: ChatRating | null;
  user_message: string | null;
};

export const MAX_RECOMMENDED_KIT_LENGTH = 100;
export const MAX_USER_MESSAGE_LENGTH = 200;

export const COOKING_FOR_OPTIONS: CookingFor[] = ["Just me", "Me and a roommate"];

export const TIME_OPTIONS: { label: string; minutes: MaxMinutes }[] = [
  { label: "Up to 10 min", minutes: 10 },
  { label: "Up to 20 min", minutes: 20 },
];

export const CATEGORY_OPTIONS: string[] = [...new Set(mealKits.map((kit) => kit.category))];

// "15 min" → 15. Unparseable prep times sort last and never fit a time limit.
export function prepMinutes(kit: MealKit): number {
  const minutes = parseInt(kit.prepTime, 10);
  return Number.isFinite(minutes) ? minutes : Infinity;
}

// Ranks every kit: time and category > category only > time only > neither,
// then fastest first. Expects at least two kits in `kits`.
export function pickKits(answers: ChatAnswers, kits: MealKit[] = mealKits): KitPick {
  function score(kit: MealKit): number {
    const fitsTime = prepMinutes(kit) <= answers.maxMinutes;
    const fitsCategory = kit.category === answers.category;
    return (fitsCategory ? 2 : 0) + (fitsTime ? 1 : 0);
  }

  const ranked = [...kits].sort(
    (a, b) => score(b) - score(a) || prepMinutes(a) - prepMinutes(b)
  );

  return {
    main: ranked[0],
    alternative: ranked[1],
    exactMatch: score(ranked[0]) === 3,
  };
}

// Lowercase and strip accents so "alérgico" matches "alergico".
function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Word starts (prefixes) or whole phrases, in English and Spanish.
// Bare "peso" and "calor" are left out because they also mean money and heat.
const MEDICAL_PATTERNS: RegExp[] = [
  // Allergies and intolerances
  /\b(allerg|alergi|intoleran|celiac|gluten|lactos|anaphyla)/,
  // Diets
  /\b(diet|keto)/,
  // Calories
  /\b(calori|kcal)/,
  // Weight
  /\b(weigh|overweight|obes|sobrepeso|adelgaz|engord)/,
  /\b(de|mi|el|perder|bajar|subir|ganar)\s+peso\b/,
  // Diabetes
  /\b(diabet|insulin|blood sugar|glucos|azucar en la sangre)/,
  // Medication
  /\b(medic|meds\b|pill|prescription|receta medica|pastilla|farmac|pharma)/,
  // Illness
  /\b(ill\b|illness|sick|disease|enferm|condition\b|padecimiento)/,
];

// Returns null only for blank messages: any typed text is either medical or off topic.
export function detectGuardrail(message: string): Guardrail | null {
  const text = normalize(message).trim();
  if (!text) return null;
  return MEDICAL_PATTERNS.some((pattern) => pattern.test(text)) ? "medical" : "off_topic";
}
