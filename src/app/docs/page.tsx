import AgentMap from "@/components/AgentMap";
import { CopyButton } from "@/components/MarketingActions";
import { BUILD_LOGS, PROMPT_LIBRARY, type PromptKind } from "@/lib/docs-content";

const codeClasses =
  "rounded bg-black/5 px-1.5 py-0.5 text-xs dark:bg-white/10";

function KindBadge({ kind }: { kind: PromptKind }) {
  return kind === "exact" ? (
    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
      exact
    </span>
  ) : (
    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      summary
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Docs
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          The prompts behind Healthy Meals and a week-by-week log of how it was built.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Agent Map</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The four agents behind Healthy Meals and what goes in and out of each one.
          </p>
        </div>
        <AgentMap />
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Prompt Library
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Prompts marked <strong>exact</strong> are copied from the repo. Prompts marked{" "}
            <strong>summary</strong> are short, accurate descriptions of prompts whose original
            text is not stored in the repo.
          </p>
        </div>

        {PROMPT_LIBRARY.map((week) => (
          <div key={week.week} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Week {week.week} <span className="text-zinc-500">·</span>{" "}
              <code className={codeClasses}>{week.page}</code>
            </h3>

            {week.prompts.map((entry) => (
              <article
                key={entry.title}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {entry.title}
                  </h4>
                  <KindBadge kind={entry.kind} />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{entry.whatItDid}</p>
                {entry.source && (
                  <p className="text-xs text-zinc-500">
                    Source: <code className={codeClasses}>{entry.source}</code>
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-end">
                    <CopyButton text={entry.prompt} label={`${entry.title} prompt`} />
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-sm whitespace-pre-wrap text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <code>{entry.prompt}</code>
                  </pre>
                </div>
              </article>
            ))}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Build Logs</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            One entry per week: the page built, what was tested and the main commits.
          </p>
        </div>

        {BUILD_LOGS.map((log) => (
          <article
            key={log.week}
            className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Week {log.week} <span className="text-zinc-500">·</span>{" "}
                <code className={codeClasses}>{log.page}</code>
              </h3>
              <span className="text-xs text-zinc-500">{log.dates}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Built</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{log.built}</p>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Tested</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {log.tested.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Main commits and fixes
              </h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                {log.commits.map((commit) => (
                  <li key={commit.hash} className="flex gap-3">
                    <code className={`${codeClasses} h-fit shrink-0 font-mono`}>{commit.hash}</code>
                    <span className="break-words text-zinc-600 dark:text-zinc-400">
                      {commit.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
