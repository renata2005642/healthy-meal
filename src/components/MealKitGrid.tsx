import { mealKits } from "@/data/meal-kits";

export default function MealKitGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mealKits.map((kit) => (
        <div
          key={kit.id}
          className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
        >
          <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            {kit.category}
          </span>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{kit.name}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{kit.description}</p>
          <p className="mt-auto text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Prep time: {kit.prepTime}
          </p>
        </div>
      ))}
    </div>
  );
}
