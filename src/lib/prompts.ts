import { BUDGET_LABELS, TIME_LABELS } from "./meal";

// Kept as a single template string so /docs can render exactly what
// gets sent to Gemini (see buildMealPrompt below).
export const MEAL_PROMPT_TEMPLATE = `You are a meal-idea generator for a healthy meal kit service aimed at students who live alone.
Given the following constraints, propose ONE simple meal idea.

Available ingredients: {ingredients}
Available time: {timeLabel}
Budget: {budgetLabel}

Respond with a single meal idea that realistically fits the time and budget given.`;

export function buildMealPrompt(
  ingredients: string,
  time: string,
  budget: string
): string {
  const timeLabel = TIME_LABELS[time] ?? time;
  const budgetLabel = BUDGET_LABELS[budget] ?? budget;

  return MEAL_PROMPT_TEMPLATE.replace("{ingredients}", ingredients)
    .replace("{timeLabel}", timeLabel)
    .replace("{budgetLabel}", budgetLabel);
}
