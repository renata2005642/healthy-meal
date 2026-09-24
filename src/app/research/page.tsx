"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { type ResearchOutputRow } from "@/lib/research";

const globalExamples = [
  {
    name: "HelloFresh",
    description: "Líder global de meal kits, ingredientes pre-porcionados con receta.",
  },
  {
    name: "Blue Apron",
    description: "Pionero en EE.UU. en el modelo de meal kits por suscripción.",
  },
  {
    name: "EveryPlate",
    description: "Versión económica de HelloFresh, enfocada en presupuesto ajustado.",
  },
  {
    name: "Home Chef",
    description: "Meal kits con venta también en tiendas físicas.",
  },
  {
    name: "Green Chef",
    description: "Meal kits enfocados en dietas específicas (keto, vegano, etc.).",
  },
];

const mexicanPlayers = [
  {
    name: "Los Foodistas",
    type: "Competidor directo",
    offering: "Meal kits listos para cocinar en casa.",
  },
  {
    name: "Petramora",
    type: "Competidor directo",
    offering: "Venta de kits de comida a domicilio.",
  },
  {
    name: "Slim Food Factory",
    type: "Sustituto",
    offering: "Viandas saludables ya preparadas por suscripción.",
  },
  {
    name: "Habeats",
    type: "Sustituto",
    offering: "Planes de comida (“alimentación inteligente”).",
  },
  {
    name: "Myfitnesschef",
    type: "Sustituto",
    offering: "Comidas balanceadas gourmet a domicilio.",
  },
  {
    name: "Come Bien",
    type: "Sustituto",
    offering: "Comidas preparadas a domicilio.",
  },
  {
    name: "No Sugar",
    type: "Sustituto",
    offering: "Comida saludable a domicilio.",
  },
  {
    name: "Rappi/Cornershop",
    type: "Sustituto amplio",
    offering:
      "Apps de entrega de súper o comida, alternativa a usar un servicio especializado.",
  },
];

const risks = [
  {
    title: "Riesgo de precio/costo",
    level: "Alto",
    width: "w-[90%]",
    reason:
      "Los ingredientes frescos y la logística en frío encarecen cada kit frente a cocinar con súper normal.",
  },
  {
    title: "Riesgo de ejecución",
    level: "Medio-alto",
    width: "w-[70%]",
    reason:
      "Armar, empacar y entregar kits a tiempo exige una operación que todavía no tenemos probada.",
  },
  {
    title: "Riesgo regulatorio",
    level: "Bajo",
    width: "w-[25%]",
    reason:
      "Vender ingredientes crudos con receta requiere permisos sanitarios estándar, nada especializado.",
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
          El panorama competitivo de los meal kits, y un lugar para guardar lo que vamos
          aprendiendo.
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
              ¿Qué estás investigando?
            </label>
            <input
              id="query"
              type="text"
              required
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. precios de meal kits en México"
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Notas / insight
            </label>
            <textarea
              id="notes"
              required
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Ej. casi nadie vende ingredientes crudos con receta, todos venden comida lista"
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar investigación"}
          </button>

          {saved && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              Investigación guardada.
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
            Investigaciones guardadas
          </h2>

          {recentLoading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Todavía no hay investigaciones guardadas.
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
          5 ejemplos globales
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
          Localización a México
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          En México casi no hay competencia directa de &ldquo;kit para cocinar&rdquo;. La
          mayoría de los competidores locales venden comida ya preparada y lista para
          calentar, no ingredientes crudos con receta. Eso deja abierto el espacio de quien
          quiere cocinar en casa sin planear ni ir al súper.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Competidores y sustitutos en México
        </h2>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Buscar por nombre o tipo
          </label>
          <input
            id="filter"
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Ej. sustituto"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-black/10 text-zinc-900 dark:border-white/10 dark:text-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Qué ofrece</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-zinc-600 dark:text-zinc-400"
                  >
                    No hay resultados para esa búsqueda.
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
          Mapa de riesgo
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
