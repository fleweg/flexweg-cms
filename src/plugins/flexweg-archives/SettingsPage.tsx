import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useCmsData,
  fetchAllPosts,
  toast,
  type PluginSettingsPageProps,
} from "@flexweg/cms-runtime";
import {
  type ArchivesConfig,
  forceRegenerate as runForceRegenerate,
} from "./generator";
import type { DrillDown } from "./periods";

// Settings page rendered at /settings/plugin/flexweg-archives. The
// wrapping PluginSettingsRoute already merges the manifest's
// defaultConfig with the stored value, so `props.config` is always a
// complete ArchivesConfig.
export function ArchivesSettingsPage({
  config,
  save,
}: PluginSettingsPageProps<ArchivesConfig>) {
  const { t } = useTranslation("flexweg-archives");
  const { terms, settings } = useCmsData();

  const [draft, setDraft] = useState<ArchivesConfig>(config);
  // Re-hydrate the draft if the stored config changes externally
  // (e.g. another tab toggling something) so the form stays honest.
  useEffect(() => setDraft(config), [config]);

  const [savingSettings, setSavingSettings] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  function patch(p: Partial<ArchivesConfig>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  async function saveSettings() {
    setSavingSettings(true);
    try {
      await save(draft);
      toast.success(t("settings.saved"));
    } finally {
      setSavingSettings(false);
    }
  }

  async function forceRegenerate() {
    setRegenerating(true);
    try {
      // Persist the draft first so the regenerator picks up any
      // unsaved changes (e.g. drill-down switched moments before
      // clicking Force regenerate).
      await save(draft);
      // Fetch full corpus on demand (cached for 30 s in
      // services/posts.ts) — the global subscription is gone.
      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const result = await runForceRegenerate({ posts, pages, terms, settings });
      toast.success(t("settings.regenerated", { count: result.uploaded.length }));
    } catch (err) {
      // flexwegApi already toasted the underlying HTTP error; this
      // adds a plugin-level summary so the user sees a clear
      // "regeneration failed" even when the toast above said
      // something more specific.
      console.error("[flexweg-archives] regeneration failed:", err);
      toast.error(t("settings.regenerateFailed"));
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="card p-4 space-y-4">
        <header className="space-y-1">
          <h2 className="font-semibold">{t("title")}</h2>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t("description")}
          </p>
        </header>

        {/* Drill-down */}
        <div className="space-y-2">
          <label className="label">{t("settings.drillDown")}</label>
          <div className="flex flex-col gap-1">
            {(["none", "month", "week"] as DrillDown[]).map((value) => (
              <label key={value} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="drillDown"
                  value={value}
                  checked={draft.drillDown === value}
                  onChange={() => patch({ drillDown: value })}
                />
                <span>
                  {t(
                    value === "none"
                      ? "settings.drillDownNone"
                      : value === "month"
                        ? "settings.drillDownMonth"
                        : "settings.drillDownWeek",
                  )}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("settings.drillDownHelp")}
          </p>
        </div>

        {/* Include pages */}
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.includePages}
              onChange={(e) => patch({ includePages: e.target.checked })}
            />
            <span>{t("settings.includePages")}</span>
          </label>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.includePagesHelp")}
          </p>
        </div>

        {/* Show counts */}
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.showCounts}
              onChange={(e) => patch({ showCounts: e.target.checked })}
            />
            <span>{t("settings.showCounts")}</span>
          </label>
        </div>

        {/* Archives link toggles */}
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.addArchivesLinkToHome}
              onChange={(e) => patch({ addArchivesLinkToHome: e.target.checked })}
            />
            <span>{t("settings.addArchivesLinkToHome")}</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.addArchivesLinkToCategory}
              onChange={(e) => patch({ addArchivesLinkToCategory: e.target.checked })}
            />
            <span>{t("settings.addArchivesLinkToCategory")}</span>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="btn-primary"
            onClick={saveSettings}
            disabled={savingSettings}
          >
            {savingSettings ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {savingSettings ? t("settings.saving") : t("settings.save")}
          </button>
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <header>
          <h2 className="font-semibold">{t("settings.forceRegenerate")}</h2>
          <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
            {t("settings.forceRegenerateHelp")}
          </p>
        </header>
        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={forceRegenerate}
            disabled={regenerating}
          >
            {regenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {regenerating
              ? t("settings.forceRegenerating")
              : t("settings.forceRegenerate")}
          </button>
        </div>
      </section>
    </div>
  );
}
