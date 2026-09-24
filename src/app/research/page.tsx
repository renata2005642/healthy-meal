"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { type ResearchOutputRow } from "@/lib/research";

const globalExamples = [
  {
    name: "HelloFresh",
    description: "Global leader in meal kits, pre-portioned ingredients with a recipe.",
  },
  {
    name: "Blue Apron",
    description: "Pioneer of the subscription meal-kit model in the US.",
  },
  {
    name: "EveryPlate",
    description: "Budget-friendly version of HelloFresh, focused on tight budgets.",
  },
  {
    name: "Home Chef",
    description: "Meal kits also sold in physical stores.",
  },
  {
    name: "Green Chef",
    description: "Meal kits focused on specific diets (keto, vegan, etc.).",
  },
];

const mexicanPlayers = [
  {
    name: "Los Foodistas",
    type: "Direct competitor",
    offering: "Meal kits ready to cook at home.",
  },
  {
    name: "Petramora",
    type: "Direct competitor",
    offering: "Sells food kits delivered to your door.",
  },
  {
    name: "Slim Food Factory",
    type: "Substitute",
    offering: "Healthy pre-made meals by subscription.",
  },
  {
    name: "Habeats",
    type: "Substitute",
    offering: "Meal plans (“smart eating”).",
  },
  {
    name: "Myfitnesschef",
    type: "Substitute",
    offering: "Balanced gourmet meals delivered to your door.",
  },
  {
    name: "Come Bien",
    type: "Substitute",
    offering: "Prepared meals delivered to your door.",
  },
  {
    name: "No Sugar",
    type: "Substitute",
    offering: "Healthy food delivered to your door.",
  },
  {
    name: "Rappi/Cornershop",
    type: "Broad substitute",
    offering:
      "Grocery/food delivery apps, an alternative to using a specialized service.",
  },
];

const risks = [
  {
    title: "Price/cost risk",
    level: "High",
    width: "w-[90%]",
    reason:
      "Fresh ingredients and cold-chain logistics make each kit more expensive than cooking with regular groceries.",
  },
  {
    title: "Execution risk",
    level: "Medium-high",
    width: "w-[70%]",
    reason:
      "Assembling, packing, and delivering kits on time requires an operation we haven't proven yet.",
  },
  {
    title: "Regulatory risk",
    level: "Low",
    width: "w-[25%]",
    reason:
      "Selling raw ingredients with a recipe requires standard health permits, nothing specialized.",
  },
];

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [recent, setRecent] = useState<ResearchOutputRow[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  const [filter, setFilter] = useState("");

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function loadRecent() {
      const { data, error } = await supabase
        .from("research_outputs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (cancelledRef.current) return;

      if (!error && data) {
        setRecent(data as ResearchOutputRow[]);
      }
      setRecentLoading(false);
    }

    loadRecent();

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/save-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Something went wrong saving your research.");
      }

      setSaved(true);
      setQuery("");
      setNotes("");
      setRecent((current) => [data as ResearchOutputRow, ...current].slice(0, 5));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const normalizedFilter = filter.trim().toLowerCase();
  const filteredPlayers = mexicanPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(normalizedFilter) ||
      player.type.toLowerCase().includes(normalizedFilter)
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Research
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          The competitive landscape for meal kits, and a place to save what we&apos;re learning.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/10"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="query"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              What are you researching?
            </label>
            <input
              id="query"
              type="text"
              required
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="E.g. meal kit pricing in Mexico"
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Notes / insight
            </label>
            <textarea
              id="notes"
              required
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="E.g. almost no one sells raw ingredients with a recipe, everyone sells ready meals"
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save research"}
          </button>

          {saved && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              Research saved.
            </p>
          )}

          {saveError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
              {saveError}
            </p>
          )}
        </form>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Saved research
          </h2>

          {recentLoading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No saved research yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {recent.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/10"
                >
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {row.query_input}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {row.notes_input}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          5 global examples
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {globalExamples.map((example) => (
            <div
              key={example.name}
              className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {example.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {example.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Mexico localization
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          In Mexico there&rsquo;s almost no direct &ldquo;cook-it-yourself kit&rdquo; competition. Most
          local competitors sell food that&rsquo;s already prepared and ready to heat up, not
          raw ingredients with a recipe. That leaves the space open for people who want to
          cook at home without planning or going to the grocery store.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Competitors and substitutes in Mexico
        </h2>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Search by name or type
          </label>
          <input
            id="filter"
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="E.g. substitute"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-black/10 text-zinc-900 dark:border-white/10 dark:text-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">What it offers</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-zinc-600 dark:text-zinc-400"
                  >
                    No results for that search.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player) => (
                  <tr
                    key={player.name}
                    className="border-b border-black/10 last:border-b-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                      {player.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {player.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {player.offering}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Risk map
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {risks.map((risk) => (
            <div
              key={risk.title}
              className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {risk.title}
                </h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {risk.level}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className={`h-full rounded-full bg-emerald-700 ${risk.width}`} />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{risk.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
