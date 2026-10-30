"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buttonClasses } from "@/components/MarketingActions";
import type { AssetType, MarketingAssetRow } from "@/lib/marketing-assets";
import { supabase } from "@/lib/supabase";

const LATEST_LIMIT = 10;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type SavedAssetsContextValue = {
  assets: MarketingAssetRow[];
  loading: boolean;
  loadError: string | null;
  addAsset: (asset: MarketingAssetRow) => void;
};

const SavedAssetsContext = createContext<SavedAssetsContextValue | null>(null);

function useSavedAssets(): SavedAssetsContextValue {
  const value = useContext(SavedAssetsContext);
  if (!value) throw new Error("useSavedAssets must be used inside SavedAssetsProvider.");
  return value;
}

export function SavedAssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<MarketingAssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      const { data, error } = await supabase
        .from("marketing_assets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(LATEST_LIMIT);

      if (cancelled) return;

      if (error) {
        setLoadError(error.message);
      } else if (data) {
        // Keep anything saved while this request was in flight on top.
        setAssets((current) => {
          const savedIds = new Set(current.map((asset) => asset.id));
          const loaded = (data as MarketingAssetRow[]).filter((row) => !savedIds.has(row.id));
          return [...current, ...loaded].slice(0, LATEST_LIMIT);
        });
      }
      setLoading(false);
    }

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  const addAsset = useCallback((asset: MarketingAssetRow) => {
    setAssets((current) => [asset, ...current].slice(0, LATEST_LIMIT));
  }, []);

  const value = useMemo(
    () => ({ assets, loading, loadError, addAsset }),
    [assets, loading, loadError, addAsset]
  );

  return <SavedAssetsContext.Provider value={value}>{children}</SavedAssetsContext.Provider>;
}

export function SaveButton({
  assetType,
  title,
  content,
}: {
  assetType: AssetType;
  title: string;
  content: string;
}) {
  const { addAsset } = useSavedAssets();
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function handleSave() {
    clearTimeout(resetTimer.current);
    setStatus("saving");
    setError(null);

    try {
      const response = await fetch("/api/save-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_type: assetType,
          asset_title: title,
          asset_content: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Something went wrong saving this asset.");
      }

      addAsset(data as MarketingAssetRow);
      setStatus("saved");
      resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        disabled={status === "saving"}
        aria-label={status === "idle" ? `Save ${title}` : undefined}
        className={`${buttonClasses} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span aria-live="polite">
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save"}
        </span>
      </button>
      {error && (
        <p role="alert" className="w-full text-right text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </>
  );
}

export function SavedAssetsSection() {
  const { assets, loading, loadError } = useSavedAssets();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Saved assets</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The {LATEST_LIMIT} most recent saves, newest first.
        </p>
      </div>

      {loading && assets.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
      ) : loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
          Couldn&apos;t load saved assets: {loadError}
        </p>
      ) : assets.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No saved assets yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {asset.asset_title}
                </h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {asset.asset_type}
                </span>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm text-zinc-600 dark:text-zinc-400">
                {asset.asset_content}
              </p>
              <p className="mt-auto text-xs text-zinc-500 dark:text-zinc-500">
                {dateFormat.format(new Date(asset.created_at))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
