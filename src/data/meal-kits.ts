// Quantities are for one serving. `unitPlural` is used when the quantity is more than 1.
export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  unitPlural?: string;
};

export type MealKit = {
  id: string;
  name: string;
  prepTime: string;
  category: string;
  description: string;
  ingredients: Ingredient[];
};

export const mealKits: MealKit[] = [
  {
    id: "veggie-stir-fry",
    name: "Veggie Stir Fry",
    prepTime: "15 min",
    category: "Vegetarian",
    description: "Crisp vegetables and rice noodles tossed in a savory soy-ginger sauce.",
    ingredients: [
      { name: "Rice noodles", quantity: 100, unit: "g" },
      { name: "Mixed vegetables (bell pepper, broccoli, carrot)", quantity: 150, unit: "g" },
      { name: "Soy sauce", quantity: 2, unit: "tbsp" },
      { name: "Fresh ginger, grated", quantity: 1, unit: "tsp" },
      { name: "Garlic", quantity: 1, unit: "clove", unitPlural: "cloves" },
      { name: "Vegetable oil", quantity: 1, unit: "tbsp" },
    ],
  },
  {
    id: "chicken-burrito-bowl",
    name: "Chicken Burrito Bowl",
    prepTime: "20 min",
    category: "High Protein",
    description: "Grilled chicken, black beans, and rice with a squeeze of lime.",
    ingredients: [
      { name: "Chicken breast", quantity: 150, unit: "g" },
      { name: "White rice, uncooked", quantity: 0.5, unit: "cup", unitPlural: "cups" },
      { name: "Black beans, cooked", quantity: 0.5, unit: "cup", unitPlural: "cups" },
      { name: "Lime", quantity: 0.5, unit: "" },
      { name: "Ground cumin", quantity: 0.5, unit: "tsp" },
    ],
  },
  {
    id: "budget-pasta",
    name: "Budget Pasta",
    prepTime: "10 min",
    category: "Budget-Friendly",
    description: "A simple tomato-basil pasta that costs less than a coffee run.",
    ingredients: [
      { name: "Spaghetti", quantity: 100, unit: "g" },
      { name: "Crushed tomatoes", quantity: 200, unit: "g" },
      { name: "Garlic", quantity: 1, unit: "clove", unitPlural: "cloves" },
      { name: "Fresh basil", quantity: 4, unit: "leaf", unitPlural: "leaves" },
      { name: "Olive oil", quantity: 1, unit: "tbsp" },
    ],
  },
  {
    id: "protein-power-bowl",
    name: "Protein Power Bowl",
    prepTime: "12 min",
    category: "High Protein",
    description: "Quinoa, chickpeas, and roasted veggies for a filling, balanced meal.",
    ingredients: [
      { name: "Quinoa, cooked", quantity: 1, unit: "cup", unitPlural: "cups" },
      { name: "Chickpeas, drained", quantity: 0.5, unit: "cup", unitPlural: "cups" },
      { name: "Zucchini", quantity: 0.5, unit: "" },
      { name: "Red bell pepper", quantity: 0.5, unit: "" },
      { name: "Olive oil", quantity: 1, unit: "tbsp" },
      { name: "Lemon", quantity: 0.5, unit: "" },
    ],
  },
];
