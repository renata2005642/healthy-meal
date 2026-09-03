const generateMealPrompt = `You are a meal-idea generator for a healthy meal kit service aimed at students who live alone.
Given the following constraints, propose ONE simple meal idea.

Available ingredients: \${ingredients}
Available time: \${timeLabel}
Budget: \${budgetLabel}

Respond with a single meal idea that realistically fits the time and budget given.`;

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Docs
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Reference material for how Healthy Meals is built.
        </p>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Prompt Library
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The exact prompt sent to Gemini by{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              /api/generate-meal
            </code>{" "}
            to generate a meal idea.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Generate meal idea
          </h3>
          <pre className="overflow-x-auto rounded-lg border border-black/10 bg-zinc-50 p-4 font-mono text-xs text-zinc-800 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
            {generateMealPrompt}
          </pre>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            <code className="font-mono">{"${ingredients}"}</code>,{" "}
            <code className="font-mono">{"${timeLabel}"}</code>, and{" "}
            <code className="font-mono">{"${budgetLabel}"}</code> are filled in from the
            intake form on <code className="font-mono">/core</code> before the request is sent.
          </p>
        </div>
      </section>
    </div>
  );
}
