// Pure, rule-based logic for the /chat guided assistant (no React, no AI, no Supabase).

import { mealKits, type Ingredient, type MealKit } from "@/data/meal-kits";

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
  // How many people the kits are for, from the first intake answer.
  people: number;
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

export const PEOPLE_COUNT: Record<CookingFor, number> = {
  "Just me": 1,
  "Me and a roommate": 2,
};

// Our call, not kit data: bowls and pasta scale in one pot, but a doubled
// stir fry overcrowds a home pan.
const HARD_TO_DOUBLE_KIT_IDS = new Set(["veggie-stir-fry"]);

export function isEasyToDouble(kit: MealKit): boolean {
  return !HARD_TO_DOUBLE_KIT_IDS.has(kit.id);
}

// Ranks every kit: category first, then time, then (for more than one person)
// easy to double, then fastest first. Expects at least two kits in `kits`.
export function pickKits(answers: ChatAnswers, kits: MealKit[] = mealKits): KitPick {
  const people = PEOPLE_COUNT[answers.cookingFor] ?? 1;

  function score(kit: MealKit): number {
    const fitsCategory = kit.category === answers.category;
    const fitsTime = prepMinutes(kit) <= answers.maxMinutes;
    const doubles = people > 1 && isEasyToDouble(kit);
    return (fitsCategory ? 4 : 0) + (fitsTime ? 2 : 0) + (doubles ? 1 : 0);
  }

  const ranked = [...kits].sort(
    (a, b) => score(b) - score(a) || prepMinutes(a) - prepMinutes(b)
  );
  const main = ranked[0];

  return {
    main,
    alternative: ranked[1],
    exactMatch: main.category === answers.category && prepMinutes(main) <= answers.maxMinutes,
    people,
  };
}

const FRACTIONS: Record<number, string> = { 0.25: "1/4", 0.5: "1/2", 0.75: "3/4" };

// 0.5 → "1/2", 1.5 → "1 1/2", 2 → "2"; other values round to one decimal.
function formatQuantity(quantity: number): string {
  const whole = Math.floor(quantity);
  const fraction = FRACTIONS[quantity - whole];
  if (quantity === whole) return String(whole);
  if (fraction) return whole > 0 ? `${whole} ${fraction}` : fraction;
  return String(Math.round(quantity * 10) / 10);
}

// e.g. "Garlic: 2 cloves" for 2 people. Quantities in the kit data are per serving.
export function formatIngredient(ingredient: Ingredient, people: number): string {
  const quantity = ingredient.quantity * people;
  const unit = quantity > 1 ? (ingredient.unitPlural ?? ingredient.unit) : ingredient.unit;
  return `${ingredient.name}: ${[formatQuantity(quantity), unit].filter(Boolean).join(" ")}`;
}

// Extra lines for the result message when cooking for more than one person.
export function groupCookingTips(pick: KitPick): string[] {
  if (pick.people <= 1) return [];

  const tips = [
    `You're cooking for ${pick.people} people, so multiply the ingredients by ${pick.people}.`,
  ];
  const hardToDouble = [pick.main, pick.alternative].filter((kit) => !isEasyToDouble(kit));
  if (hardToDouble.length === 0) {
    tips.push("Both kits are easy to double.");
  } else {
    for (const kit of hardToDouble) {
      tips.push(
        `${kit.name} is harder to double: cook it in ${pick.people} batches so the pan doesn't get crowded.`
      );
    }
  }
  return tips;
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
  // Pregnancy and breastfeeding
  /\b(pregnan|embaraz|gestacion|breastfeed|lactancia|amamant)/,
];

// Returns null only for blank messages: any typed text is either medical or off topic.
export function detectGuardrail(message: string): Guardrail | null {
  const text = normalize(message).trim();
  if (!text) return null;
  return MEDICAL_PATTERNS.some((pattern) => pattern.test(text)) ? "medical" : "off_topic";
}
