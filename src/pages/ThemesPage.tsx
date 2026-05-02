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
import { buildAuthorLookup } from "../services/users";

export function ThemesPage() {
  const { t } = useTranslation();
  const { settings, posts, pages, terms, users, media } = useCmsData();
  const [busy, setBusy] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const themes = listThemes();

  async function handleActivate(themeId: string) {
    if (themeId === settings.activeThemeId) return;
    await updateSettings({ activeThemeId: themeId });
  }

  // Pushes every theme's compiled CSS to Flexweg's public root at
  // /theme-assets/<id>.css. The CSS bytes come from the manifest's `cssText`
  // (embedded at build time via Vite `?inline`), so this always uploads the
  // version that was built alongside the currently deployed admin SPA — no
  // dependency on the public /theme-assets/ folder being uploaded first.
  async function handleSyncAssets() {
    setBusy(true);
    setLogEntries([]);
    const log = (entry: PublishLogEntry) => setLogEntries((prev) => [...prev, entry]);
    try {
      for (const theme of themes) {
        if (!theme.cssText) {
          log({ level: "warn", message: `Theme "${theme.id}" has no embedded CSS, skipping.` });
        } else {
          const cssPath = `theme-assets/${theme.id}.css`;
          log({ level: "info", message: `Uploading ${cssPath}…` });
          await uploadFile({ path: cssPath, content: theme.cssText });
        }
        // Optional companion JS files — themes that opted in get their
        // loaders pushed alongside the CSS at the same /theme-assets/
        // root. We support two slots: -menu.js (header / burger) and
        // -posts.js (sidebar widgets fed by /posts.json). Themes that
        // don't ship one or both simply leave the corresponding
        // manifest field undefined.
        if (theme.jsText) {
          const jsPath = `theme-assets/${theme.id}-menu.js`;
          log({ level: "info", message: `Uploading ${jsPath}…` });
          await uploadFile({ path: jsPath, content: theme.jsText });
        }
        if (theme.jsTextPosts) {
          const jsPath = `theme-assets/${theme.id}-posts.js`;
          log({ level: "info", message: `Uploading ${jsPath}…` });
          await uploadFile({ path: jsPath, content: theme.jsTextPosts });
        }
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
        users,
        authorLookup: buildAuthorLookup(users, media),
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
