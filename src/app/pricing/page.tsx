"use client";

import { useState, type FormEvent } from "react";
import {
  ASSUMPTIONS,
  SCENARIOS,
  TIERS,
  calculateRevenue,
  type ScenarioId,
} from "@/lib/pricing";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

function formatMxn(amount: number): string {
  return `${mxn.format(amount)} MXN`;
}

const inputClasses =
  "rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50";

export default function PricingPage() {
  // Kept as strings so the inputs can be cleared while typing;
  // calculateRevenue treats empty or invalid values as 0.
  const [soloCustomers, setSoloCustomers] = useState("100");
  const [roommateCustomers, setRoommateCustomers] = useState("0");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("base");

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
  const revenue = calculateRevenue({
    soloCustomers: Number(soloCustomers),
    roommateCustomers: Number(roommateCustomers),
    scenario: scenarioId,
  });

  const [scenarioName, setScenarioName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/save-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioName,
          scenarioType: scenarioId,
          soloCustomers: Number(soloCustomers),
          roommateCustomers: Number(roommateCustomers),
          monthlyRevenue: revenue.monthlyRevenue,
          annualRevenue: revenue.annualRevenue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Something went wrong saving your scenario.");
      }

      setSaved(true);
      setScenarioName("");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pricing simulator
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Estimate monthly and annual revenue from customer counts and plan mix.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Plans</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {tier.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {tier.kitsPerMonth} kits per month
              </p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {formatMxn(tier.priceMxn)}
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {" "}
                  / month
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Simulator
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="solo"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Solo students
            </label>
            <input
              id="solo"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={soloCustomers}
              onChange={(event) => setSoloCustomers(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="roommates"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Roommate households
            </label>
            <input
              id="roommates"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={roommateCustomers}
              onChange={(event) => setRoommateCustomers(event.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Scenario
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario">
            {SCENARIOS.map((s) => {
              const selected = s.id === scenarioId;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setScenarioId(s.id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "border border-black/10 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {TIERS.map((tier) => (
              <span
                key={tier.id}
                className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                {tier.name} {scenario.mix[tier.id]}%
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2" aria-live="polite">
          <div className="flex flex-col gap-2 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950/40">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Monthly revenue
            </span>
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatMxn(revenue.monthlyRevenue)}
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950/40">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Annual revenue
            </span>
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatMxn(revenue.annualRevenue)}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/10"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="scenario-name"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Scenario name
            </label>
            <input
              id="scenario-name"
              type="text"
              required
              value={scenarioName}
              onChange={(event) => setScenarioName(event.target.value)}
              placeholder="E.g. First semester launch"
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save scenario"}
          </button>

          {saved && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              Scenario saved.
            </p>
          )}

          {saveError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
              {saveError}
            </p>
          )}
        </form>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Assumptions
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-black/10 text-zinc-900 dark:border-white/10 dark:text-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Assumption</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {ASSUMPTIONS.map((assumption) => (
                <tr
                  key={assumption.label}
                  className="border-b border-black/10 last:border-b-0 dark:border-white/10"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    {assumption.label}
                  </td>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                    {assumption.value}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {assumption.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
