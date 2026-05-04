import { useEffect, useMemo, useState } from "react";
import { FileCode2, Loader2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../../context/CmsDataContext";
import { EntityCombobox, type ComboboxOption } from "../../components/ui/EntityCombobox";
import { toast } from "../../lib/toast";
import { categoryFeedPath } from "./generator";
import {
  cleanupRemovedFeeds,
  regenerateAllFeeds,
  regenerateStylesheet,
  type CategoryFeedConfig,
  type RssConfig,
} from "./generator";
import { publishMenuJson } from "../../services/menuPublisher";
import { fetchAllPosts } from "../../services/posts";
import type { PluginSettingsPageProps } from "../index";

// Settings page rendered at /settings/plugin/flexweg-rss. The wrapping
// PluginSettingsRoute already merges the manifest's defaultConfig with
// the stored value, so `props.config` is always a complete RssConfig.
export function FlexwegRssSettingsPage({ config, save }: PluginSettingsPageProps<RssConfig>) {
  const { t } = useTranslation("flexweg-rss");
  const { settings, terms, categories, media } = useCmsData();

  // Local draft kept in sync with Firestore — same pattern as the other
  // plugin settings pages. External updates (a co-admin tweaks something)
  // re-hydrate cleanly.
  const [draft, setDraft] = useState<RssConfig>(config);
  useEffect(() => setDraft(config), [config]);

  const [saving, setSaving] = useState(false);
  const [uploadingXsl, setUploadingXsl] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Categories not yet picked as a per-feed entry — fed into the
  // EntityCombobox so the user can't accidentally add the same feed twice.
  const availableCategoryOptions = useMemo<ComboboxOption[]>(() => {
    const taken = new Set(draft.categoryFeeds.map((f) => f.termId));
    return categories
      .filter((c) => !taken.has(c.id))
      .map((c) => ({ id: c.id, label: c.name, subtitle: `/${c.slug}` }));
  }, [categories, draft.categoryFeeds]);

  function patchSite(p: Partial<RssConfig["site"]>) {
    setDraft((d) => ({ ...d, site: { ...d.site, ...p } }));
  }

  function patchCategoryFeed(termId: string, p: Partial<CategoryFeedConfig>) {
    setDraft((d) => ({
      ...d,
      categoryFeeds: d.categoryFeeds.map((f) => (f.termId === termId ? { ...f, ...p } : f)),
    }));
  }

  function removeCategoryFeed(termId: string) {
    setDraft((d) => ({
      ...d,
      categoryFeeds: d.categoryFeeds.filter((f) => f.termId !== termId),
    }));
  }

  function addCategoryFeed(termId: string) {
    if (!termId) return;
    if (draft.categoryFeeds.some((f) => f.termId === termId)) return;
    setDraft((d) => ({
      ...d,
      categoryFeeds: [...d.categoryFeeds, { termId, itemCount: 20, addToFooter: false }],
    }));
  }

  function toggleExcluded(termId: string) {
    const set = new Set(draft.site.excludedTermIds);
    if (set.has(termId)) set.delete(termId);
    else set.add(termId);
    patchSite({ excludedTermIds: [...set] });
  }

  // Save handler: persists the new config, deletes stale files (site RSS
  // disabled, removed category feeds), and republishes menu.json so the
  // footer reflects the new addToFooter checkboxes.
  async function saveSettings() {
    setSaving(true);
    try {
      const cleanup = await cleanupRemovedFeeds({ prevConfig: config, nextConfig: draft });
      // cleanup may have nulled lastPublishedPath; use its updated config
      // as the source of truth.
      await save(cleanup.nextConfig);
      // Republish menu.json with the patched settings so the footer
      // toggles take effect immediately. We pass a patched settings
      // object because the Firestore subscription hasn't echoed back the
      // new pluginConfigs yet.
      const patchedSettings = {
        ...settings,
        pluginConfigs: { ...settings.pluginConfigs, "flexweg-rss": cleanup.nextConfig },
      };
      try {
        // Fetch the corpus on demand — the global subscription is
        // gone. fetchAllPosts caches for 30 s.
        const [posts, pages] = await Promise.all([
          fetchAllPosts({ type: "post" }),
          fetchAllPosts({ type: "page" }),
        ]);
        await publishMenuJson(patchedSettings, posts, pages, terms);
      } catch (err) {
        console.error("[flexweg-rss] menu.json republish failed:", err);
      }
      toast.success(t("actions.saved"));
    } finally {
      setSaving(false);
    }
  }

  async function uploadStylesheet() {
    if (!settings.baseUrl) {
      toast.error(t("baseUrlMissing"));
      return;
    }
    setUploadingXsl(true);
    try {
      await regenerateStylesheet({ settings });
      toast.success(t("actions.xslUploaded"));
    } catch (err) {
      console.error("[flexweg-rss] xsl upload failed:", err);
      toast.error(t("actions.xslFailed"));
    } finally {
      setUploadingXsl(false);
    }
  }

  async function forceRegenerate() {
    if (!settings.baseUrl) {
      toast.error(t("baseUrlMissing"));
      return;
    }
    setRegenerating(true);
    try {
      // Persist the draft first so the regenerator sees the user's
      // latest edits. cleanupRemovedFeeds also runs to wipe files for
      // feeds the user just removed in this same session.
      const cleanup = await cleanupRemovedFeeds({ prevConfig: config, nextConfig: draft });
      await save(cleanup.nextConfig);

      await regenerateStylesheet({ settings });

      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const out = await regenerateAllFeeds({
        posts,
        terms,
        media,
        settings,
        config: cleanup.nextConfig,
      });
      // Persist the regenerator's mutations (lastPublishedPath updates,
      // dropped category feeds when terms were deleted).
      await save(out.nextConfig);

      // Refresh menu.json with the post-regen config so footer items
      // reference the correct paths.
      const patchedSettings = {
        ...settings,
        pluginConfigs: { ...settings.pluginConfigs, "flexweg-rss": out.nextConfig },
      };
      try {
        // Re-use the posts / pages fetched a few lines above —
        // the cache is still warm.
        await publishMenuJson(patchedSettings, posts, pages, terms);
      } catch (err) {
        console.error("[flexweg-rss] menu.json republish failed:", err);
      }
      toast.success(
        t("actions.regenerated", { count: out.result.uploaded.length + 1 }),
      );
    } catch (err) {
      console.error("[flexweg-rss] regeneration failed:", err);
      toast.error(t("actions.regenerateFailed"));
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">{t("description")}</p>

      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("sections.site")}</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.site.enabled}
            onChange={(e) => patchSite({ enabled: e.target.checked })}
          />
          <span className="text-sm font-medium">{t("site.enabled")}</span>
        </label>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("site.enabledHelp")}
        </p>

        {draft.site.enabled && (
          <>
            <div>
              <label className="label">{t("site.itemCount")}</label>
              <input
                type="number"
                className="input max-w-xs"
                min={1}
                max={100}
                value={draft.site.itemCount}
                onChange={(e) =>
                  patchSite({
                    itemCount: Math.max(1, Math.min(100, Number.parseInt(e.target.value, 10) || 20)),
                  })
                }
              />
              <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
                {t("site.itemCountHelp")}
              </p>
            </div>

            <div>
              <p className="label">{t("site.excluded")}</p>
              <p className="text-xs text-surface-500 mb-2 dark:text-surface-400">
                {t("site.excludedHelp")}
              </p>
              {categories.length === 0 ? (
                <p className="text-xs italic text-surface-500 dark:text-surface-400">
                  {t("category.none")}
                </p>
              ) : (
                <ul className="space-y-1">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={draft.site.excludedTermIds.includes(c.id)}
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

            <label className="flex items-center gap-2 pt-2 border-t border-surface-200 dark:border-surface-700">
              <input
                type="checkbox"
                checked={draft.site.addToFooter}
                onChange={(e) => patchSite({ addToFooter: e.target.checked })}
              />
              <span className="text-sm font-medium">{t("site.addToFooter")}</span>
            </label>
          </>
        )}
      </section>

      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("sections.categoryFeeds")}</h2>

        {draft.categoryFeeds.length === 0 ? (
          <p className="text-sm italic text-surface-500 dark:text-surface-400">
            {t("category.none")}
          </p>
        ) : (
          <ul className="space-y-3">
            {draft.categoryFeeds.map((feed) => {
              const term = categories.find((c) => c.id === feed.termId);
              const path = term ? categoryFeedPath(term.slug) : feed.lastPublishedPath ?? "";
              return (
                <li
                  key={feed.termId}
                  className="border border-surface-200 dark:border-surface-700 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {term ? term.name : `(missing: ${feed.termId})`}
                      </p>
                      {path && (
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {t("category.pathHint", { path })}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => removeCategoryFeed(feed.termId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("category.remove")}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <span>{t("category.itemCount")}</span>
                      <input
                        type="number"
                        className="input w-24"
                        min={1}
                        max={100}
                        value={feed.itemCount}
                        onChange={(e) =>
                          patchCategoryFeed(feed.termId, {
                            itemCount: Math.max(
                              1,
                              Math.min(100, Number.parseInt(e.target.value, 10) || 20),
                            ),
                          })
                        }
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={feed.addToFooter}
                        onChange={(e) =>
                          patchCategoryFeed(feed.termId, { addToFooter: e.target.checked })
                        }
                      />
                      <span>{t("category.addToFooter")}</span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="pt-2 border-t border-surface-200 dark:border-surface-700">
          <p className="label">{t("category.addLabel")}</p>
          <CategoryFeedAdder
            options={availableCategoryOptions}
            placeholder={t("category.placeholder")}
            addLabel={t("category.add")}
            onAdd={addCategoryFeed}
          />
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("sections.actions")}</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={saveSettings} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? t("actions.saving") : t("actions.save")}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={uploadStylesheet}
            disabled={uploadingXsl}
          >
            {uploadingXsl ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileCode2 className="h-4 w-4" />
            )}
            {uploadingXsl ? t("actions.uploadingXsl") : t("actions.uploadXsl")}
          </button>
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
            {regenerating ? t("actions.forceRegenerating") : t("actions.forceRegenerate")}
          </button>
        </div>
      </section>
    </div>
  );
}

// Small wrapper around EntityCombobox + Add button. Keeps the selected
// id local so the parent's draft state only updates on the explicit Add
// click, not on every keystroke inside the combobox.
function CategoryFeedAdder({
  options,
  placeholder,
  addLabel,
  onAdd,
}: {
  options: ComboboxOption[];
  placeholder: string;
  addLabel: string;
  onAdd: (id: string) => void;
}) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap items-start gap-2">
      <EntityCombobox
        className="flex-1 min-w-[260px]"
        options={options}
        value={value}
        onSelect={setValue}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="btn-secondary"
        disabled={!value}
        onClick={() => {
          if (!value) return;
          onAdd(value);
          setValue(null);
        }}
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}
