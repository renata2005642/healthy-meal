import Link from "next/link";
import { mealKits } from "@/data/meal-kits";

const steps = [
  {
    title: "Add your ingredients",
    description: "Tell us what's already in your fridge and pantry.",
  },
  {
    title: "Choose your time & budget",
    description: "Pick how much time and money you want to spend on your next meal.",
  },
  {
    title: "Get meal ideas",
    description: "Get simple, ready-to-cook meal kits that match what you gave us.",
  },
];

const badges = [
  { label: "Affordable", description: "Meals that fit a student budget." },
  { label: "Save Time", description: "No more staring at an empty fridge." },
  { label: "Eat Better", description: "Skip the takeout, eat real food." },
  { label: "For Students", description: "Built for dorm and apartment kitchens." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Eat better. Cook easier.
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Living alone shouldn&apos;t mean choosing between cooking from scratch or ordering
          takeout every night. Healthy Meals shows you simple, accessible meal kits so you can
          eat well without the hassle.
        </p>
        <Link
          href="/catalog"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          Explore the Catalog
        </Link>
      </section>

      <section className="border-t border-black/10 bg-zinc-50 px-6 py-20 dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Meal Kits You&apos;ll Actually Cook
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mealKits.map((kit) => (
              <div
                key={kit.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
              >
                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {kit.category}
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {kit.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{kit.description}</p>
                <p className="mt-auto text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Prep time: {kit.prepTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-zinc-50 px-6 py-20 dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <div key={badge.label} className="rounded-2xl bg-white p-6 text-center dark:bg-black">
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {badge.label}
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
