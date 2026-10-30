"use client";

import { useEffect, useRef, useState } from "react";

export const buttonClasses =
  "shrink-0 rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800";

const COPY_LABELS = { idle: "Copy", copied: "Copied", failed: "Copy failed" };

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<keyof typeof COPY_LABELS>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      // Clipboard access is blocked by permissions or on non-HTTPS origins.
      setStatus("failed");
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={status === "idle" ? `Copy ${label}` : COPY_LABELS[status]}
      className={buttonClasses}
    >
      <span aria-live="polite">{COPY_LABELS[status]}</span>
    </button>
  );
}

export function ExportButton({ text, filename }: { text: string; filename: string }) {
  function handleExport() {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
    >
      Export .txt
    </button>
  );
}
