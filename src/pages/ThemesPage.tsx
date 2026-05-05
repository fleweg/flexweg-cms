import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { PageHeader } from "../components/layout/PageHeader";
import { PublishLog } from "../components/publishing/PublishLog";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { Dropdown, type DropdownItem, type DropdownSection } from "../components/ui/Dropdown";
import { useCmsData } from "../context/CmsDataContext";
import { listThemes } from "../themes";
import type { ThemeManifest } from "../themes/types";
import { updateSettings } from "../services/settings";
import { uploadFile } from "../services/flexwegApi";
import {
  buildPublishContext,
  regenerateAll,
  regenerateHomeOnly,
  type PublishContext,
  type PublishLogEntry,
  type PublishLogger,
} from "../services/publisher";
import { buildAuthorLookup } from "../services/users";
import {
  listRegenerationTargets,
  subscribeRegenerationTargets,
  type RegenerationTarget,
} from "../core/regenerationTargetRegistry";

// Pure helper — uploads the active theme's CSS (with `compileCss`
// hook) plus any companion JS scripts to /theme-assets/. Extracted so
// both the standalone "Sync theme assets" button and the dropdown's
// "Theme assets" entry call into the same logic.
async function syncThemeAssets(
  themes: ThemeManifest[],
  themeConfigs: Record<string, unknown> | undefined,
  log: PublishLogger,
): Promise<void> {
  for (const theme of themes) {
    if (!theme.cssText) {
      log({ level: "warn", message: `Theme "${theme.id}" has no embedded CSS, skipping.` });
    } else {
      const cssPath = `theme-assets/${theme.id}.css`;
      let cssContent = theme.cssText;
      if (theme.compileCss && theme.settings) {
        const stored = themeConfigs?.[theme.id];
        const resolvedConfig = {
          ...(theme.settings.defaultConfig as object),
          ...((stored as object) ?? {}),
        };
        try {
          cssContent = theme.compileCss(resolvedConfig);
        } catch (err) {
          console.error(`[themes] compileCss for "${theme.id}" failed:`, err);
        }
      }
      log({ level: "info", message: `Uploading ${cssPath}…` });
      await uploadFile({ path: cssPath, content: cssContent });
    }
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
}

export function ThemesPage() {
  const { t } = useTranslation();
  const { settings, terms, users, media } = useCmsData();
  const [busy, setBusy] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const themes = listThemes();

  // Subscribe to the plugin regeneration target registry — the
  // dropdown entries change when plugins toggle on/off, so a
  // one-shot read at mount would miss late registrations.
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

  // Resolves a plugin target's labelKey / descriptionKey against the
  // plugin's own i18n namespace. Falls back to the raw key when the
  // bundle is missing (e.g. plugin disabled before label was loaded).
  function pluginLabel(target: RegenerationTarget, key: string | undefined): string {
    if (!key) return "";
    const resolved = i18n.t(key, { ns: target.id });
    return resolved === key ? "" : resolved;
  }

  async function buildCtx(): Promise<PublishContext> {
    return buildPublishContext({
      terms,
      settings,
      users,
      authorLookup: buildAuthorLookup(users, media),
    });
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

  // Dropdown sections — built from the static built-in targets plus
  // whatever plugins have registered. Each item resolves into the
  // same `runWithLog` helper so the busy state + log reset is shared.
  const sections: DropdownSection[] = useMemo(() => {
    const builtins: DropdownItem[] = [
      {
        id: "home",
        label: t("themes.regenerate.home"),
        description: t("themes.regenerate.homeHelp"),
        onSelect: () =>
          runWithLog(async (log) => {
            const ctx = await buildCtx();
            await regenerateHomeOnly(ctx, log);
          }),
      },
      {
        id: "allHtml",
        label: t("themes.regenerate.allHtml"),
        description: t("themes.regenerate.allHtmlHelp"),
        onSelect: () =>
          runWithLog(async (log) => {
            const ctx = await buildCtx();
            await regenerateAll(ctx, log);
          }),
      },
      {
        id: "assets",
        label: t("themes.regenerate.assets"),
        description: t("themes.regenerate.assetsHelp"),
        onSelect: () =>
          runWithLog(async (log) => {
            await syncThemeAssets(themes, settings.themeConfigs, log);
          }),
      },
    ];

    const pluginItems: DropdownItem[] = pluginTargets.map((target) => ({
      id: target.id,
      label: pluginLabel(target, target.labelKey) || target.id,
      description: pluginLabel(target, target.descriptionKey) || undefined,
      onSelect: () =>
        runWithLog(async (log) => {
          const ctx = await buildCtx();
          await target.run(ctx, log);
        }),
    }));

    const everything: DropdownItem = {
      id: "everything",
      label: t("themes.regenerate.everything"),
      description: t("themes.regenerate.everythingHelp"),
      onSelect: () =>
        runWithLog(async (log) => {
          // Sequential: theme assets first (so any newly published
          // HTML can reference a fresh CSS), then full HTML pass,
          // then every plugin in priority order.
          await syncThemeAssets(themes, settings.themeConfigs, log);
          const ctx = await buildCtx();
          await regenerateAll(ctx, log);
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
          log({ level: "success", message: "Everything regenerated." });
        }),
    };

    const out: DropdownSection[] = [
      {
        id: "site",
        label: t("themes.regenerate.groupBuiltins"),
        items: builtins,
      },
    ];
    if (pluginItems.length > 0) {
      out.push({
        id: "plugins",
        label: t("themes.regenerate.groupPlugins"),
        items: pluginItems,
      });
    }
    out.push({
      id: "everything",
      items: [everything],
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t() identity is stable per render; settings.themeConfigs is the actual data dep
  }, [pluginTargets, settings.themeConfigs, t]);

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
            <Dropdown
              triggerLabel={
                <>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {busy ? t("themes.regenerate.running") : t("themes.regenerate.button")}
                </>
              }
              disabled={busy}
              sections={sections}
            />
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
              disabled={busy}
              className={
                "card p-4 text-left ring-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed " +
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
    </div>
  );
}
