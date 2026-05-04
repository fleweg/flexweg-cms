import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ExternalLink, HardDrive, Loader2, RefreshCw, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { getStorageLimits, type StorageLimitsResponse } from "../../services/flexwegApi";
import { getFlexwegConfig } from "../../services/flexwegConfig";
import { cn } from "../../lib/utils";

const UPGRADE_URL = "https://www.flexweg.com/pricing";

type LoadState =
  | { kind: "loading" }
  | { kind: "not-configured" }
  | { kind: "ok"; data: StorageLimitsResponse }
  | { kind: "error"; message: string };

export function StorageCard() {
  const { t } = useTranslation("flexweg-metrics");
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    void (async () => {
      // Probe the config first so we can surface a "not configured"
      // CTA without firing the configMissing toast that requireConfig
      // would emit. Once configured, getStorageLimits() handles the
      // network failure path itself (toasts via the standard funnel).
      const config = await getFlexwegConfig();
      if (cancelled) return;
      if (!config) {
        setState({ kind: "not-configured" });
        return;
      }
      try {
        const data = await getStorageLimits();
        if (!cancelled) setState({ kind: "ok", data });
      } catch (err) {
        if (cancelled) return;
        setState({ kind: "error", message: (err as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-surface-50">
          <HardDrive className="h-4 w-4 text-surface-500" />
          {t("storage.title")}
        </h3>
        {state.kind === "ok" && (
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => setReloadKey((k) => k + 1)}
            aria-label={t("common.refresh")}
            title={t("common.refresh")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {state.kind === "loading" && (
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t("common.loading")}
        </div>
      )}

      {state.kind === "not-configured" && (
        <div className="space-y-3">
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t("storage.notConfigured")}
          </p>
          <Link
            to="/settings/general"
            className="btn-secondary inline-flex items-center gap-1 text-xs"
          >
            <Settings className="h-3.5 w-3.5" />
            {t("storage.notConfiguredCta")}
          </Link>
        </div>
      )}

      {state.kind === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{t("storage.error")}</p>
      )}

      {state.kind === "ok" && <StorageDetails data={state.data} t={t} />}
    </div>
  );
}

function StorageDetails({
  data,
  t,
}: {
  data: StorageLimitsResponse;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const nearLimit = data.warnings.storage_near_limit || data.warnings.files_near_limit;
  return (
    <div className="space-y-3">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("storage.plan", { name: data.plan.name })}
      </p>

      <Meter
        label={t("storage.storageLabel")}
        line={t("storage.usageLine", {
          current: data.usage.storage.current_formatted,
          limit: data.usage.storage.limit_formatted,
        })}
        percentage={data.usage.storage.percentage}
        warn={data.warnings.storage_near_limit}
      />

      <Meter
        label={t("storage.filesLabel")}
        line={t("storage.filesLine", {
          current: data.usage.files.current,
          limit: data.usage.files.limit,
        })}
        percentage={data.usage.files.percentage}
        warn={data.warnings.files_near_limit}
      />

      {nearLimit && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 p-2 space-y-1.5">
          <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t("storage.upgradeHint")}
          </p>
          <a
            href={UPGRADE_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex items-center gap-1 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("storage.upgrade")}
          </a>
        </div>
      )}
    </div>
  );
}

function Meter({
  label,
  line,
  percentage,
  warn,
}: {
  label: string;
  line: string;
  percentage: number;
  warn: boolean;
}) {
  // Cap visual fill at 100 % even though the API can technically
  // return >100 if a quota is exceeded (graceful overflow).
  const width = Math.min(100, Math.max(0, percentage));
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-surface-700 dark:text-surface-200">
          {label}
        </span>
        <span className="text-xs tabular-nums text-surface-500 dark:text-surface-400">
          {percentage.toFixed(percentage < 10 ? 1 : 0)} %
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all",
            warn ? "bg-amber-500" : "bg-surface-900 dark:bg-surface-200",
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="text-xs text-surface-500 dark:text-surface-400">{line}</p>
    </div>
  );
}
