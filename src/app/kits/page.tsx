import MealKitGrid from "@/components/MealKitGrid";

export default function KitsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Meal kits
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          A preview of the kits we&apos;re planning. Ordering isn&apos;t open yet.
        </p>
      </div>
      <MealKitGrid />
    </div>
  );
}
