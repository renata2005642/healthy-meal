export const TIME_LABELS: Record<string, string> = {
  "10": "10 min",
  "20": "20 min",
  "30": "30+ min",
};

export const BUDGET_LABELS: Record<string, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export type MealIdea = {
  name: string;
  ingredients_used: string[];
  estimated_time: string;
  description: string;
};

export type CoreOutputRow = {
  id: number;
  created_at: string;
  ingredients_input: string;
  time_input: string;
  budget_input: string;
  meal_name: string;
  estimated_time: string;
  meal_description: string;
};
