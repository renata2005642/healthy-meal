import { AGENTS, type Agent, type AgentKind } from "@/lib/venture-content";

const KIND_CLASSES: Record<AgentKind, string> = {
  ai: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  rules: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  "hand-written": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  human: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

function FlowBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-black/15 px-3 py-2 dark:border-white/15">
      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">{label}</p>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-black/10 p-4 dark:border-white/10">
      <FlowBox label="In" text={agent.input} />
      <p aria-hidden="true" className="text-center text-zinc-400">
        ↓
      </p>
      <div className="flex flex-col gap-1.5 rounded-xl bg-zinc-100 px-3 py-3 dark:bg-zinc-800/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{agent.name}</h3>
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-300">
            {agent.where}
          </code>
        </div>
        <span
          className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${KIND_CLASSES[agent.kind]}`}
        >
          {agent.kindLabel}
        </span>
      </div>
      <p aria-hidden="true" className="text-center text-zinc-400">
        ↓
      </p>
      <FlowBox label="Out" text={agent.output} />
    </li>
  );
}

// Diagram of the agents behind Healthy Meals: what goes in and what comes out of each.
// Reusable on any page (e.g. /demo and /docs).
export default function AgentMap({ agents = AGENTS }: { agents?: Agent[] }) {
  return (
    <ul aria-label="Agent map" className="grid gap-4 sm:grid-cols-2">
      {agents.map((agent) => (
        <AgentCard key={agent.name} agent={agent} />
      ))}
    </ul>
  );
}
