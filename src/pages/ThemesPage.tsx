import { useEffect, useState } from "react";
import { Check, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { PublishLog } from "../components/publishing/PublishLog";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { ExternalInstallModal } from "../components/plugins/ExternalInstallModal";
import { useCmsData } from "../context/CmsDataContext";
import { listThemes } from "../themes";
import { listExternalThemes } from "../services/externalRegistry";
import { uninstallExternal } from "../services/externalUpload";
import { updateSettings } from "../services/settings";
import { syncThemeAssets } from "../services/themeSync";
import { toast } from "../lib/toast";
import {
  buildPublishContext,
  regenerateAll,
  type PublishLogEntry,
  type PublishLogger,
} from "../services/publisher";
import { buildAuthorLookup } from "../services/users";
import {
  listRegenerationTargets,
  subscribeRegenerationTargets,
  type RegenerationTarget,
} from "../core/regenerationTargetRegistry";

export function ThemesPage() {
  const { t } = useTranslation();
  const { settings, terms, users, media } = useCmsData();
  const [busy, setBusy] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const themes = listThemes();

  // Plugin regeneration targets are still consumed by the local
  // theme-switch flow (a switch needs to re-run every plugin so the
  // public site is consistent against the new theme). The global
  // Regenerate menu in the Topbar maintains its own subscription
  // independently.
  const [pluginTargets, setPluginTargets] = useState<RegenerationTarget[]>(
    () => listRegenerationTargets(),
  );
  useEffect(() => {
    return subscribeRegenerationTargets(() => {
      setPluginTargets(listRegenerationTargets());
    });
  }, []);

  // Pending theme switch — set when the user clicks an inactive
  // card. Drives the confirmation modal. `null` = no pending switch.
  // Switching theme requires a full regenerate (assets + every HTML
  // page + plugin outputs) so the new look propagates everywhere
  // without leaving stale published HTML referencing the old CSS.
  const [pendingThemeId, setPendingThemeId] = useState<string | null>(null);
  // Drives the install/uninstall modal for external (uploaded) themes.
  const [installModalOpen, setInstallModalOpen] = useState(false);
  // id of the theme currently being uninstalled (drives per-card spinner).
  const [uninstallingId, setUninstallingId] = useState<string | null>(null);
  const externalThemes = listExternalThemes();
  const externalThemeIds = new Set(externalThemes.map((th) => th.id));

  async function handleUninstallTheme(id: string) {
    if (uninstallingId) return;
    if (!window.confirm(t("externalInstall.confirmUninstall", { id }))) return;
    setUninstallingId(id);
    try {
      await uninstallExternal("themes", id);
      toast.success(t("externalInstall.uninstallSuccess", { id }));
      window.setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error((err as Error).message);
      setUninstallingId(null);
    }
  }

  function handleActivate(themeId: string) {
    if (themeId === settings.activeThemeId) return;
    if (busy) return;
    setPendingThemeId(themeId);
  }

  // Helper that wraps a regen runner with the standard busy/log flow.
  // All dropdown items go through this so success / failure UX is
  // consistent.
  async function runWithLog(work: (log: PublishLogger) => Promise<void>) {
    setBusy(true);
    setLogEntries([]);
    const log: PublishLogger = (entry) => setLogEntries((prev) => [...prev, entry]);
    try {
      await work(log);
    } catch (err) {
      log({ level: "error", message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  // Standalone "Sync theme assets" button — kept as a top-level
  // primary action (frequent enough to warrant direct access) AND
  // duplicated as a dropdown entry for consistency with the other
  // regeneration targets.
  async function handleSyncAssets() {
    await runWithLog(async (log) => {
      await syncThemeAssets(themes, settings.themeConfigs, log);
    });
  }

  // Confirm path of the theme-switch modal. Persists the new theme
  // and runs the full Everything regen — assets + all HTML +
  // plugins. Settings is patched optimistically (we don't wait for
  // the Firestore subscription echo) so buildPublishContext sees the
  // new theme on the very first regen pass.
  async function handleConfirmThemeChange() {
    if (!pendingThemeId) return;
    const targetId = pendingThemeId;
    // Close the modal as soon as the work starts so the user sees
    // the live PublishLog instead of a frozen confirm UI.
    setPendingThemeId(null);
    await runWithLog(async (log) => {
      await updateSettings({ activeThemeId: targetId });
      const patchedSettings = { ...settings, activeThemeId: targetId };
      await syncThemeAssets(themes, patchedSettings.themeConfigs, log);
      const ctx = await buildPublishContext({
        terms,
        settings: patchedSettings,
        users,
        authorLookup: buildAuthorLookup(users, media),
      });
      await regenerateAll(ctx, log);
      // Plugins that depend on the theme (archives renders through
      // the active theme's templates) MUST be re-run. The others
      // (sitemap / RSS / search / favicon manifest) are theme-
      // independent but cheap to regenerate, and a consistent
      // "Switch & regenerate" guarantees no half-state.
      for (const target of pluginTargets) {
        try {
          await target.run(ctx, log);
        } catch (err) {
          log({
            level: "error",
            message: `Plugin "${target.id}" regen failed: ${(err as Error).message}`,
          });
        }
      }
      log({ level: "success", message: "Theme switched and site regenerated." });
    });
  }

  function handleCancelThemeChange() {
    setPendingThemeId(null);
  }

  // Active theme manifest used by the modal copy ("Switch to ...?").
  const pendingTheme = pendingThemeId
    ? themes.find((t) => t.id === pendingThemeId)
    : undefined;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader
        title={t("themes.title")}
        actions={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setInstallModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              {t("themes.installExternal")}
            </button>
            <button type="button" className="btn-secondary" onClick={handleSyncAssets} disabled={busy}>
              <RefreshCw className="h-4 w-4" />
              {t("themes.syncAssets")}
            </button>
          </>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {themes.map((theme) => {
          const active = theme.id === settings.activeThemeId;
          const isExternal = externalThemeIds.has(theme.id);
          return (
            <div
              key={theme.id}
              className={
                "card p-4 ring-2 transition-colors flex flex-col " +
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
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!active && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleActivate(theme.id)}
                    disabled={busy}
                  >
                    {t("themes.activate")}
                  </button>
                )}
                {/* Uninstall on external themes only — built-ins live in
                    the bundle. Disabled when the theme is active so a
                    user can't pull the rug out from under the public
                    site without switching to a different theme first. */}
                {isExternal && (
                  <button
                    type="button"
                    className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                    onClick={() => handleUninstallTheme(theme.id)}
                    disabled={
                      busy || active || uninstallingId === theme.id
                    }
                    title={
                      active ? t("themes.uninstallDisabledTitle") : undefined
                    }
                  >
                    {uninstallingId === theme.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {t("externalInstall.uninstall")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <PublishLog entries={logEntries} />
      {pendingTheme && (
        <ConfirmModal
          title={t("themes.confirmSwitch.title", { theme: pendingTheme.name })}
          description={t("themes.confirmSwitch.body")}
          confirmLabel={t("themes.confirmSwitch.confirm")}
          cancelLabel={t("themes.confirmSwitch.cancel")}
          onConfirm={handleConfirmThemeChange}
          onCancel={handleCancelThemeChange}
        />
      )}
      <ExternalInstallModal
        kind="themes"
        open={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        existing={externalThemes.map((th) => ({
          id: th.id,
          name: th.name,
          version: th.version,
        }))}
      />
    </div>
  );
}
