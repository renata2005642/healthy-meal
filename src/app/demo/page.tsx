"use client";

import Link from "next/link";
import { useState } from "react";
import AgentMap from "@/components/AgentMap";
import { DEMO_STEPS } from "@/lib/venture-content";

const primaryButton =
  "inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-700";
const secondaryButton =
  "inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800";

export default function DemoPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const total = DEMO_STEPS.length;
  const step = DEMO_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Demo
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          A guided walkthrough of Healthy Meals in {total} steps.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300" aria-live="polite">
          Step {stepIndex + 1} of {total}
        </p>
        <ol className="flex gap-2" aria-label="Progress">
          {DEMO_STEPS.map((s, index) => (
            <li
              key={s.title}
              aria-current={index === stepIndex ? "step" : undefined}
              title={s.title}
              className={`h-2 w-8 rounded-full ${
                index <= stepIndex ? "bg-emerald-700" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              <span className="sr-only">{s.title}</span>
            </li>
          ))}
        </ol>
      </div>

      <section className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/10 sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300">{step.intro}</p>
          {step.body?.map((paragraph) => (
            <p key={paragraph} className="text-sm text-zinc-600 dark:text-zinc-400">
              {paragraph}
            </p>
          ))}
        </div>

        {step.showAgentMap && <AgentMap />}

        {step.links && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {step.links.map((link) => (
              <li
                key={link.href}
                className="flex flex-col gap-3 rounded-xl border border-black/10 p-4 dark:border-white/10"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{link.description}</p>
                <Link href={link.href} className={`${primaryButton} mt-auto`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {step.impactCheck && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {step.impactCheck.heading}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {step.impactCheck.groups.map((group) => (
                <div
                  key={group.title}
                  className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/10"
                >
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {group.title}
                  </h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {step.roadmap && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {step.roadmap.heading}
            </h3>
            <ol className="flex flex-col gap-3">
              {step.roadmap.items.map((item, index) => (
                <li
                  key={item.goal}
                  className="flex gap-3 rounded-xl border border-black/10 p-4 dark:border-white/10"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {item.goal}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Why: </span>
                      {item.reason}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {step.placeholder && (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-black/15 p-5 dark:border-white/15">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {step.placeholder.heading}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.placeholder.note}</p>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className={secondaryButton}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.min(total - 1, i + 1))}
          disabled={isLast}
          className={primaryButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
