import { useEffect, useState } from "react";
import { FileCode2, Loader2, RefreshCw, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../../context/CmsDataContext";
import { fetchAllPosts } from "../../services/posts";
import { toast } from "../../lib/toast";
import {
  defaultRobotsTxt,
  regenerateRobotsTxt,
  regenerateSitemaps,
  regenerateStylesheets,
  type SitemapsConfig,
} from "./generator";
import type { PluginSettingsPageProps } from "../index";

// Settings page rendered at /settings/plugin/flexweg-sitemaps. The wrapping
// PluginSettingsRoute already merges the manifest's defaultConfig with the
// stored value, so `props.config` is always a complete SitemapsConfig.
export function SitemapsSettingsPage({ config, save }: PluginSettingsPageProps<SitemapsConfig>) {
  const { t } = useTranslation("flexweg-sitemaps");
  const { settings, terms } = useCmsData();

  const [draft, setDraft] = useState<SitemapsConfig>(config);
  // External settings updates re-hydrate the draft so toggling another
  // setting elsewhere doesn't leave this form out of sync.
  useEffect(() => setDraft(config), [config]);

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingRobots, setSavingRobots] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [uploadingXsl, setUploadingXsl] = useState(false);

  function patch(p: Partial<SitemapsConfig>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  async function saveSettings() {
    setSavingSettings(true);
    try {
      await save(draft);
      toast.success(t("saved"));
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveAndRegenerateRobots() {
    if (!settings.baseUrl) {
      toast.error(t("baseUrlMissing"));
      return;
    }
    setSavingRobots(true);
    try {
      await save(draft);
      await regenerateRobotsTxt({ config: draft, baseUrl: settings.baseUrl });
      toast.success(t("robots.saved"));
    } finally {
      setSavingRobots(false);
    }
  }

  async function forceRegenerate() {
    if (!settings.baseUrl) {
      toast.error(t("baseUrlMissing"));
      return;
    }
    setRegenerating(true);
    try {
      await save(draft);
      // Stylesheets first so any newly uploaded sitemap immediately
      // resolves its xml-stylesheet PI to a fresh XSL on the public site.
      const xslResult = await regenerateStylesheets({ settings, config: draft });
      // Fetch corpus on demand — global subscription is gone.
      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const result = await regenerateSitemaps({
        posts,
        pages,
        terms,
        settings,
        config: draft,
      });
      // robots.txt is regenerated alongside on this button — the user
      // expectation per the plugin spec is "force regenerate everything".
      await regenerateRobotsTxt({ config: draft, baseUrl: settings.baseUrl });
      toast.success(
        t("uploaded", { count: xslResult.uploaded.length + result.uploaded.length + 1 }),
      );
    } catch (err) {
      // flexwegApi already toasted the underlying HTTP error; we add a
      // plugin-level summary so the user sees a clear "regeneration failed"
      // even when the toast above said something more specific.
      console.error("[flexweg-sitemaps] regeneration failed:", err);
      toast.error(t("regenerateFailed"));
    } finally {
      setRegenerating(false);
    }
  }

  async function uploadStylesheets() {
    if (!settings.baseUrl) {
      toast.error(t("baseUrlMissing"));
      return;
    }
    setUploadingXsl(true);
    try {
      // Save the draft first so toggling News + clicking this button in one
      // shot still reflects the user's intent (news XSL uploaded vs deleted).
      await save(draft);
      const result = await regenerateStylesheets({ settings, config: draft });
      toast.success(t("xsl.uploaded", { count: result.uploaded.length }));
    } catch (err) {
      console.error("[flexweg-sitemaps] xsl upload failed:", err);
      toast.error(t("xsl.failed"));
    } finally {
      setUploadingXsl(false);
    }
  }

  function insertDefaultRobots() {
    patch({ robotsTxt: defaultRobotsTxt(settings.baseUrl, draft.newsEnabled) });
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">{t("description")}</p>

      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("sections.general")}</h2>

        <div>
          <label className="label">{t("contentTypes.label")}</label>
          <select
            className="input max-w-xs"
            value={draft.contentTypes}
            onChange={(e) => patch({ contentTypes: e.target.value as SitemapsConfig["contentTypes"] })}
          >
            <option value="posts">{t("contentTypes.posts")}</option>
            <option value="posts-pages">{t("contentTypes.postsPages")}</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.newsEnabled}
              onChange={(e) => patch({ newsEnabled: e.target.checked })}
            />
            <span className="text-sm font-medium">{t("news.enabled")}</span>
          </label>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("news.enabledHelp")}
          </p>
        </div>

        {draft.newsEnabled && (
          <div>
            <label className="label">{t("news.windowDays")}</label>
            <input
              className="input max-w-xs"
              type="number"
              min={1}
              max={30}
              value={draft.newsWindowDays}
              onChange={(e) =>
                patch({
                  newsWindowDays: Math.max(1, Math.min(30, Number.parseInt(e.target.value, 10) || 2)),
                })
              }
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("news.windowDaysHelp")}
            </p>
          </div>
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={saveSettings}
          disabled={savingSettings}
        >
          {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {savingSettings ? t("robots.saving") : t("saveSettings")}
        </button>
      </section>

      <section className="card p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{t("sections.robots")}</h2>
          <button type="button" className="btn-ghost" onClick={insertDefaultRobots}>
            {t("robots.resetDefault")}
          </button>
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400">{t("robots.help")}</p>
        <textarea
          className="input font-mono text-xs min-h-[180px]"
          value={draft.robotsTxt}
          onChange={(e) => patch({ robotsTxt: e.target.value })}
          placeholder={defaultRobotsTxt(settings.baseUrl, draft.newsEnabled)}
        />
        <button
          type="button"
          className="btn-primary"
          onClick={saveAndRegenerateRobots}
          disabled={savingRobots}
        >
          {savingRobots ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {savingRobots ? t("robots.saving") : t("robots.saveAndRegenerate")}
        </button>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("sections.actions")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("xsl.help")}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={uploadStylesheets}
            disabled={uploadingXsl}
          >
            {uploadingXsl ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileCode2 className="h-4 w-4" />
            )}
            {uploadingXsl ? t("xsl.uploading") : t("xsl.upload")}
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
            {regenerating ? t("forceRegenerating") : t("forceRegenerate")}
          </button>
        </div>
      </section>
    </div>
  );
}
