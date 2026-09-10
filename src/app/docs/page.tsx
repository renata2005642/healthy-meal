import { MEAL_PROMPT_TEMPLATE } from "@/lib/prompts";

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Docs
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Coming soon.</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Prompt Library
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is the exact prompt template the{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs dark:bg-white/10">
            /core
          </code>{" "}
          Generative Core Agent sends to Gemini (
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs dark:bg-white/10">
            app/api/generate-meal/route.ts
          </code>
          ). <code>{"{ingredients}"}</code>, <code>{"{timeLabel}"}</code> and{" "}
          <code>{"{budgetLabel}"}</code> are substituted with the values from the
          intake form before the request is sent.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-black/10 bg-black/5 p-4 text-sm text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
          {MEAL_PROMPT_TEMPLATE}
        </pre>
      </section>
    </div>
  );
}
