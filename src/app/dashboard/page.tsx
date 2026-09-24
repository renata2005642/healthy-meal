"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { type ResearchOutputRow } from "@/lib/research";

export default function DashboardPage() {
  const [latest, setLatest] = useState<ResearchOutputRow | null>(null);
  const [latestLoading, setLatestLoading] = useState(true);

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function loadLatest() {
      const { data, error } = await supabase
        .from("research_outputs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (cancelledRef.current) return;

      if (!error && data && data.length > 0) {
        setLatest(data[0] as ResearchOutputRow);
      }
      setLatestLoading(false);
    }

    loadLatest();

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Lo último que hemos guardado en Healthy Meals.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Última investigación
          </h2>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Research
          </span>
        </div>

        {latestLoading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
        ) : !latest ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Todavía no hay investigaciones guardadas.
          </p>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {latest.query_input}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {latest.notes_input}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
