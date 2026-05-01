import { useState } from "react";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { PublishLog } from "../components/publishing/PublishLog";
import { useCmsData } from "../context/CmsDataContext";
import { listThemes } from "../themes";
import { updateSettings } from "../services/settings";
import { uploadFile } from "../services/flexwegApi";
import { buildPublishContext, regenerateAll, type PublishLogEntry } from "../services/publisher";

export function ThemesPage() {
  const { t } = useTranslation();
  const { settings, posts, pages, terms } = useCmsData();
  const [busy, setBusy] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const themes = listThemes();

  async function handleActivate(themeId: string) {
    if (themeId === settings.activeThemeId) return;
    await updateSettings({ activeThemeId: themeId });
  }

  // Pushes the theme's compiled CSS (built locally to dist/theme-assets/...)
  // up to Flexweg. The CSS for the active theme is fetched from the admin's
  // own deployed assets — relies on the admin SPA being deployed with the
  // theme bundles next to it.
  async function handleSyncAssets() {
    setBusy(true);
    setLogEntries([]);
    const log = (entry: PublishLogEntry) => setLogEntries((prev) => [...prev, entry]);
    try {
      for (const theme of themes) {
        const cssPath = `theme-assets/${theme.id}.css`;
        const adminAssetUrl = `/admin/${cssPath}`;
        log({ level: "info", message: `Fetching ${adminAssetUrl}…` });
        const res = await fetch(adminAssetUrl);
        if (!res.ok) {
          log({
            level: "warn",
            message: `Could not fetch ${adminAssetUrl} — run \`npm run build\` and deploy /admin first.`,
          });
          continue;
        }
        const css = await res.text();
        log({ level: "info", message: `Uploading ${cssPath}…` });
        await uploadFile({ path: cssPath, content: css });
      }
      log({ level: "success", message: "Theme assets synced." });
    } catch (err) {
      log({ level: "error", message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function handleRegenerate() {
    setBusy(true);
    setLogEntries([]);
    const log = (entry: PublishLogEntry) => setLogEntries((prev) => [...prev, entry]);
    try {
      const ctx = await buildPublishContext({
        posts,
        pages,
        terms,
        settings,
        authorLookup: () => undefined,
      });
      await regenerateAll(ctx, log);
    } catch (err) {
      log({ level: "error", message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader
        title={t("themes.title")}
        actions={
          <>
            <button type="button" className="btn-secondary" onClick={handleSyncAssets} disabled={busy}>
              <RefreshCw className="h-4 w-4" />
              {t("themes.syncAssets")}
            </button>
            <button type="button" className="btn-primary" onClick={handleRegenerate} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {busy ? t("themes.regenerating") : t("themes.regenerateSite")}
            </button>
          </>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {themes.map((theme) => {
          const active = theme.id === settings.activeThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleActivate(theme.id)}
              className={
                "card p-4 text-left ring-2 transition-colors " +
                (active
                  ? "ring-blue-500"
                  : "ring-transparent hover:ring-surface-300 dark:hover:ring-surface-600")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{theme.name}</h3>
                {active && (
                  <span className="badge-online">
                    <Check className="h-3 w-3" /> {t("themes.active")}
                  </span>
                )}
              </div>
              <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">v{theme.version}</p>
              {theme.description && (
                <p className="text-sm text-surface-600 mt-2 dark:text-surface-300">
                  {theme.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
      <PublishLog entries={logEntries} />
    </div>
  );
}
