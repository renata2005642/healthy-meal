import Link from "next/link";
import { TIERS, type TierId } from "@/lib/pricing";

type FeatureStatus = "Live" | "Planned";

const featureGroups: {
  name: string;
  features: { name: string; description: string; status: FeatureStatus }[];
}[] = [
  {
    name: "Discover",
    features: [
      {
        name: "AI meal ideas",
        description: "Get a meal idea from the ingredients, time, and budget you have.",
        status: "Live",
      },
      {
        name: "Save meal ideas",
        description: "Keep the ideas you like so you can come back to them.",
        status: "Live",
      },
    ],
  },
  {
    name: "Learn",
    features: [
      {
        name: "Market research and competitor benchmark",
        description: "How meal kits work globally and who we compete with in Mexico.",
        status: "Live",
      },
      {
        name: "Risk map",
        description: "The main price, execution, and regulatory risks of the business.",
        status: "Live",
      },
    ],
  },
  {
    name: "Cook",
    features: [
      {
        name: "Weekly meal-kit box",
        description: "Pre-portioned ingredients and recipes delivered every week.",
        status: "Planned",
      },
      {
        name: "Pantry-aware menus",
        description: "Weekly menus that build on what you already have at home.",
        status: "Planned",
      },
      {
        name: "Delivery windows",
        description: "Choose when your box arrives so it fits your class schedule.",
        status: "Planned",
      },
    ],
  },
];

const planFeatures: {
  name: string;
  planned: boolean;
  includedIn: TierId[];
}[] = [
  {
    name: "AI meal ideas",
    planned: false,
    includedIn: ["starter", "standard", "plus"],
  },
  {
    name: "Save meal ideas",
    planned: false,
    includedIn: ["starter", "standard", "plus"],
  },
  {
    name: "Weekly menu planning",
    planned: true,
    includedIn: ["standard", "plus"],
  },
  {
    name: "Priority delivery windows",
    planned: true,
    includedIn: ["plus"],
  },
];

const statusBadgeClasses: Record<FeatureStatus, string> = {
  Live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Planned: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function ProductPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Product
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Healthy Meals helps students eat well without the hassle. Here&apos;s what the
          product does today, what&apos;s coming next, and how the plans are structured.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Feature map
        </h2>
        {featureGroups.map((group) => (
          <div key={group.name} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {group.name}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {feature.name}
                    </h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses[feature.status]}`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          What each plan includes
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-black/10 text-zinc-900 dark:border-white/10 dark:text-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                {TIERS.map((tier) => (
                  <th key={tier.id} className="px-4 py-3 text-center font-semibold">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/10 dark:border-white/10">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                  Kits per month
                </td>
                {TIERS.map((tier) => (
                  <td
                    key={tier.id}
                    className="px-4 py-3 text-center text-zinc-900 dark:text-zinc-50"
                  >
                    {tier.kitsPerMonth}
                  </td>
                ))}
              </tr>
              {planFeatures.map((feature) => (
                <tr
                  key={feature.name}
                  className="border-b border-black/10 last:border-b-0 dark:border-white/10"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    <span className="flex flex-wrap items-center gap-2">
                      {feature.name}
                      {feature.planned && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses.Planned}`}
                        >
                          Planned
                        </span>
                      )}
                    </span>
                  </td>
                  {TIERS.map((tier) => {
                    const included = feature.includedIn.includes(tier.id);
                    return (
                      <td
                        key={tier.id}
                        className={`px-4 py-3 text-center ${
                          included
                            ? "font-semibold text-emerald-700 dark:text-emerald-400"
                            : "text-zinc-400 dark:text-zinc-600"
                        }`}
                      >
                        {included ? "✓" : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Plan allocation is an assumption, not validated pricing.
        </p>
      </section>

      <div className="flex justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          See pricing
        </Link>
      </div>
    </div>
  );
}
