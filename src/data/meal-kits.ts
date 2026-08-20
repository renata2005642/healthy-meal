export type MealKit = {
  id: string;
  name: string;
  prepTime: string;
  category: string;
  description: string;
};

export const mealKits: MealKit[] = [
  {
    id: "veggie-stir-fry",
    name: "Veggie Stir Fry",
    prepTime: "15 min",
    category: "Vegetarian",
    description: "Crisp vegetables and rice noodles tossed in a savory soy-ginger sauce.",
  },
  {
    id: "chicken-burrito-bowl",
    name: "Chicken Burrito Bowl",
    prepTime: "20 min",
    category: "High Protein",
    description: "Grilled chicken, black beans, and rice with a squeeze of lime.",
  },
  {
    id: "budget-pasta",
    name: "Budget Pasta",
    prepTime: "10 min",
    category: "Budget-Friendly",
    description: "A simple tomato-basil pasta that costs less than a coffee run.",
  },
  {
    id: "protein-power-bowl",
    name: "Protein Power Bowl",
    prepTime: "12 min",
    category: "High Protein",
    description: "Quinoa, chickpeas, and roasted veggies for a filling, balanced meal.",
  },
];
