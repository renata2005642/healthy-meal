"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BUDGET_LABELS, TIME_LABELS } from "@/lib/meal";
import { SCENARIOS } from "@/lib/pricing";

const LATEST_LIMIT = 5;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

type Row = Record<string, unknown> & { id: string | number; created_at: string };

type Field = { label: string; value: string };

type TableConfig = {
  table: string;
  title: string;
  // Explicit column list: only these columns are ever requested.
  columns: string;
  heading: (row: Row) => string;
  fields: (row: Row) => Field[];
};

function text(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function money(value: unknown): string {
  return typeof value === "number" ? `${mxn.format(value)} MXN` : text(value);
}

function rating(value: unknown): string {
  if (value === "up") return "Helpful";
  if (value === "down") return "Not helpful";
  return "Not rated";
}

const TABLES: TableConfig[] = [
  {
    table: "core_outputs",
    title: "Meal ideas",
    columns:
      "id, created_at, ingredients_input, time_input, budget_input, meal_name, estimated_time, meal_description",
    heading: (row) => text(row.meal_name),
    fields: (row) => [
      { label: "Ingredients", value: text(row.ingredients_input) },
      { label: "Time", value: TIME_LABELS[String(row.time_input)] ?? text(row.time_input) },
      { label: "Budget", value: BUDGET_LABELS[String(row.budget_input)] ?? text(row.budget_input) },
      { label: "Estimated time", value: text(row.estimated_time) },
    ],
  },
  {
    table: "research_outputs",
    title: "Research",
    columns: "id, created_at, query_input, notes_input",
    heading: (row) => text(row.query_input),
    fields: (row) => [{ label: "Notes", value: text(row.notes_input) }],
  },
  {
    table: "pricing_scenarios",
    title: "Pricing scenarios",
    columns:
      "id, created_at, scenario_name, scenario_type, solo_customers, roommate_customers, monthly_revenue, annual_revenue",
    heading: (row) => text(row.scenario_name),
    fields: (row) => [
      {
        label: "Scenario",
        value: SCENARIOS.find((s) => s.id === row.scenario_type)?.name ?? text(row.scenario_type),
      },
      { label: "Solo customers", value: text(row.solo_customers) },
      { label: "Roommate customers", value: text(row.roommate_customers) },
      { label: "Monthly revenue", value: money(row.monthly_revenue) },
      { label: "Annual revenue", value: money(row.annual_revenue) },
    ],
  },
  {
    table: "marketing_assets",
    title: "Marketing assets",
    columns: "id, created_at, asset_type, asset_title, asset_content",
    heading: (row) => text(row.asset_title),
    fields: (row) => [
      { label: "Type", value: text(row.asset_type) },
      { label: "Content", value: text(row.asset_content) },
    ],
  },
  {
    table: "chat_sessions",
    title: "Chat sessions",
    // Never select user_message or needs_human_review here.
    columns:
      "id, created_at, intake_people, intake_time, intake_craving, recommended_kit, rating, summary",
    heading: (row) => text(row.recommended_kit),
    fields: (row) => [
      { label: "Cooking for", value: text(row.intake_people) },
      { label: "Time", value: text(row.intake_time) },
      { label: "Craving", value: text(row.intake_craving) },
      { label: "Rating", value: rating(row.rating) },
      { label: "Summary", value: text(row.summary) },
    ],
  },
];

type CardState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; count: number; rows: Row[] };

export default function DashboardPage() {
  const [cards, setCards] = useState<Record<string, CardState>>({});

  useEffect(() => {
    let cancelled = false;

    // Each table loads on its own, so one failure never affects the others.
    for (const config of TABLES) {
      (async () => {
        let state: CardState;
        try {
          const { data, count, error } = await supabase
            .from(config.table)
            .select(config.columns, { count: "exact" })
            .order("created_at", { ascending: false })
            .limit(LATEST_LIMIT);

          state =
            error || !data
              ? { status: "error" }
              : {
                  status: "ready",
                  count: count ?? data.length,
                  rows: data as unknown as Row[],
                };
        } catch {
          state = { status: "error" };
        }

        if (!cancelled) {
          setCards((current) => ({ ...current, [config.table]: state }));
        }
      })();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Read-only view of saved records
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {TABLES.map((config) => {
          const state = cards[config.table] ?? { status: "loading" };

          return (
            <section
              key={config.table}
              className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {config.title}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {state.status === "ready" ? `${state.count} total` : config.table}
                </span>
              </div>

              {state.status === "loading" ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
              ) : state.status === "error" ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Not available</p>
              ) : state.rows.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">No saved records yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {state.rows.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/10"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold break-words text-zinc-900 dark:text-zinc-50">
                          {config.heading(row)}
                        </h3>
                        <span className="text-xs text-zinc-500">
                          {dateFormat.format(new Date(row.created_at))}
                        </span>
                      </div>
                      <dl className="grid gap-1 text-sm sm:grid-cols-[10rem_1fr]">
                        {config.fields(row).map((field) => (
                          <div key={field.label} className="contents">
                            <dt className="text-zinc-500">{field.label}</dt>
                            <dd className="line-clamp-3 break-words whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                              {field.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
