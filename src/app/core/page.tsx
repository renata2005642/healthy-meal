"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import {
  BUDGET_LABELS,
  TIME_LABELS,
  type CoreOutputRow,
  type MealIdea,
} from "@/lib/meal";

export default function CorePage() {
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("10");
  const [budget, setBudget] = useState("low");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meal, setMeal] = useState<MealIdea | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [recent, setRecent] = useState<CoreOutputRow[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function loadRecent() {
      const { data, error } = await supabase
        .from("core_outputs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (cancelledRef.current) return;

      if (!error && data) {
        setRecent(data as CoreOutputRow[]);
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
    setLoading(true);
    setError(null);
    setMeal(null);
    setSaved(false);
    setSaveError(null);

    try {
      const response = await fetch("/api/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, time, budget }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Something went wrong generating your meal idea.");
      }

      setMeal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!meal) return;
    setSaving(true);
    setSaveError(null);

    const { data, error } = await supabase
      .from("core_outputs")
      .insert({
        ingredients_input: ingredients,
        time_input: time,
        budget_input: budget,
        meal_name: meal.name,
        estimated_time: meal.estimated_time,
        meal_description: meal.description,
      })
      .select()
      .single();

    if (error) {
      setSaveError(error.message);
    } else if (data) {
      setSaved(true);
      setRecent((current) => [data as CoreOutputRow, ...current].slice(0, 5));
    }

    setSaving(false);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Core
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Tell us what you have, and we&apos;ll generate a meal idea for you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/10"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="ingredients"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Ingredientes disponibles
          </label>
          <textarea
            id="ingredients"
            required
            rows={3}
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            placeholder="Ej. arroz, huevo, espinaca, pechuga de pollo"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="time" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Tiempo disponible
            </label>
            <select
              id="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
            >
              <option value="10">10 min</option>
              <option value="20">20 min</option>
              <option value="30">30+ min</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="budget"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Presupuesto
            </label>
            <select
              id="budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
            >
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate meal idea"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      {meal && (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              {meal.estimated_time}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || saved}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-emerald-700 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            >
              {saved ? "Saved" : saving ? "Saving..." : "Save"}
            </button>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {meal.name}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{meal.description}</p>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Ingredientes usados
            </h3>
            <ul className="flex flex-wrap gap-2">
              {meal.ingredients_used.map((ingredient) => (
                <li
                  key={ingredient}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-400"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          {saveError && (
            <p className="text-sm text-red-700 dark:text-red-400">{saveError}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recently saved
        </h2>

        {recentLoading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No saved meals yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recent.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {row.meal_name}
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {row.estimated_time}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {row.meal_description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <span>{TIME_LABELS[row.time_input] ?? row.time_input}</span>
                  <span>&middot;</span>
                  <span>{BUDGET_LABELS[row.budget_input] ?? row.budget_input}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
