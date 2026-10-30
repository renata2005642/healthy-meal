"use client";

import { useState } from "react";
import {
  AB_TESTS,
  summarizeVotes,
  type ABSummary,
  type ABTest,
  type ABVotes,
} from "@/lib/marketing-content";

const NO_VOTES: ABVotes = { A: 0, B: 0 };

function winnerLabel(winner: ABSummary["winner"]): string {
  if (winner === null) return "No votes yet";
  if (winner === "tie") return "Tied";
  return `Current winner: Option ${winner}`;
}

function ABTestCard({ test }: { test: ABTest }) {
  const [votes, setVotes] = useState<ABVotes>(NO_VOTES);
  const summary = summarizeVotes(votes);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{test.title}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {test.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setVotes((current) => ({ ...current, [option.id]: current[option.id] + 1 }))}
            aria-label={`Vote for option ${option.id}: ${option.text}`}
            className={`flex flex-col gap-3 rounded-2xl border p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
              summary.winner === option.id
                ? "border-emerald-700 dark:border-emerald-400"
                : "border-black/10 dark:border-white/10"
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Option {option.id}
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{option.text}</span>
            <span className="mt-auto text-sm text-zinc-600 dark:text-zinc-400">
              {votes[option.id]} {votes[option.id] === 1 ? "vote" : "votes"} ·{" "}
              {summary.percent[option.id]}%
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {winnerLabel(summary.winner)}
        </p>
        <button
          type="button"
          onClick={() => setVotes(NO_VOTES)}
          className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>
    </article>
  );
}

export default function ABTester() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">A/B Tester</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Click an option to vote. Votes reset when you reload the page.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {AB_TESTS.map((test) => (
          <ABTestCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  );
}
