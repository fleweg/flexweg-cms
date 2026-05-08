import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useCmsData,
  toast,
  fetchAllPosts,
  formatDateTime,
  type PluginSettingsPageProps,
} from "@flexweg/cms-runtime";
import { regenerateAll, type RegenerateIndexInput } from "./generator";
import type { SearchConfig } from "./config";

// Settings page rendered at /settings/plugin/flexweg-search. The
// wrapping PluginSettingsRoute already merges the manifest's
// defaultConfig with the stored value, so `props.config` is always a
// complete SearchConfig.
//
// Layout: two stacked sections (Index / Behavior) plus a footer with
// status, Save, and Force regenerate. Mirrors flexweg-rss' card
// pattern — no tab strip, just sections in vertical flow.
export function FlexwegSearchSettingsPage({
  config,
  save,
}: PluginSettingsPageProps<SearchConfig>) {
  const { t, i18n: i18nClient } = useTranslation("flexweg-search");
  const { settings, terms, categories } = useCmsData();
  const locale = i18nClient.resolvedLanguage ?? i18nClient.language;

  const [draft, setDraft] = useState<SearchConfig>(config);
  useEffect(() => setDraft(config), [config]);

  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  function patch(p: Partial<SearchConfig>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function toggleExcluded(termId: string) {
    const set = new Set(draft.excludedTermIds);
    if (set.has(termId)) set.delete(termId);
    else set.add(termId);
    patch({ excludedTermIds: [...set] });
  }

  async function saveSettings() {
    setSaving(true);
    try {
      await save(draft);
      toast.success(t("actions.saved"));
    } catch (err) {
      console.error("[flexweg-search] save failed:", err);
      toast.error(t("actions.failed"));
    } finally {
      setSaving(false);
    }
  }

  async function forceRegenerate() {
    if (!settings.baseUrl) {
      toast.error(t("baseUrlMissing"));
      return;
    }
    setRegenerating(true);
    try {
      // Fetch the corpus on demand — no global posts subscription
      // anymore. fetchAllPosts caches for 30 s.
      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const input: RegenerateIndexInput = {
        posts,
        pages,
        terms,
        settings,
        config: draft,
      };
      const result = await regenerateAll(input);
      // Persist the bookkeeping fields (hashes + timestamp) so the
      // "Last indexed" line updates and subsequent publishes don't
      // re-upload identical files.
      await save(result.nextConfig);
      setDraft(result.nextConfig);
      toast.success(t("actions.regenerated"));
    } catch (err) {
      console.error("[flexweg-search] regeneration failed:", err);
      toast.error(t("actions.failed"));
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">{t("description")}</p>

      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("index.title")}</h2>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.indexExcerpt}
            onChange={(e) => patch({ indexExcerpt: e.target.checked })}
          />
          <span>
            <span className="text-sm font-medium block">{t("index.indexExcerpt")}</span>
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {t("index.indexExcerptHelp")}
            </span>
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.indexCategory}
            onChange={(e) => patch({ indexCategory: e.target.checked })}
          />
          <span className="text-sm font-medium">{t("index.indexCategory")}</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.indexTags}
            onChange={(e) => patch({ indexTags: e.target.checked })}
          />
          <span className="text-sm font-medium">{t("index.indexTags")}</span>
        </label>

        <label className="flex items-center gap-2 pt-2 border-t border-surface-200 dark:border-surface-700">
          <input
            type="checkbox"
            checked={draft.includePages}
            onChange={(e) => patch({ includePages: e.target.checked })}
          />
          <span className="text-sm font-medium">{t("index.includePages")}</span>
        </label>

        <div>
          <p className="label">{t("index.excludedTerms")}</p>
          <p className="text-xs text-surface-500 mb-2 dark:text-surface-400">
            {t("index.excludedTermsHelp")}
          </p>
          {categories.length === 0 ? (
            <p className="text-xs italic text-surface-500 dark:text-surface-400">
              {t("index.none")}
            </p>
          ) : (
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.excludedTermIds.includes(c.id)}
                      onChange={() => toggleExcluded(c.id)}
                    />
                    <span className="text-sm">{c.name}</span>
                    <span className="text-xs text-surface-400">/{c.slug}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("behavior.title")}</h2>

        <div>
          <label className="label">{t("behavior.minQueryLength")}</label>
          <input
            type="number"
            className="input max-w-xs"
            min={1}
            max={10}
            value={draft.minQueryLength}
            onChange={(e) =>
              patch({
                minQueryLength: Math.max(
                  1,
                  Math.min(10, Number.parseInt(e.target.value, 10) || 2),
                ),
              })
            }
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("behavior.minQueryLengthHelp")}
          </p>
        </div>

        <div>
          <label className="label">{t("behavior.maxResults")}</label>
          <input
            type="number"
            className="input max-w-xs"
            min={1}
            max={100}
            value={draft.maxResults}
            onChange={(e) =>
              patch({
                maxResults: Math.max(
                  1,
                  Math.min(100, Number.parseInt(e.target.value, 10) || 20),
                ),
              })
            }
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("behavior.maxResultsHelp")}
          </p>
        </div>
      </section>

      <section className="card p-4 flex flex-wrap items-center gap-3">
        <p className="text-xs text-surface-500 dark:text-surface-400 flex-1 min-w-0">
          {draft.lastIndexedAt
            ? t("status.lastIndexed", { date: formatDateTime(draft.lastIndexedAt, locale) })
            : t("status.notIndexed")}
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={forceRegenerate}
          disabled={regenerating || saving}
        >
          {regenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {regenerating ? t("actions.regenerating") : t("actions.forceRegenerate")}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveSettings}
          disabled={saving || regenerating}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? t("actions.saving") : t("actions.save")}
        </button>
      </section>
    </div>
  );
}
