import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, RefreshCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useCmsData } from "../../context/CmsDataContext";
import { Dropdown, type DropdownItem, type DropdownSection } from "../ui/Dropdown";
import { PublishLog } from "../publishing/PublishLog";
import { listThemes } from "../../themes";
import {
  buildPublishContext,
  regenerateAll,
  regenerateHomeOnly,
  type PublishContext,
  type PublishLogEntry,
  type PublishLogger,
} from "../../services/publisher";
import { syncThemeAssets } from "../../services/themeSync";
import { buildAuthorLookup } from "../../services/users";
import {
  listRegenerationTargets,
  subscribeRegenerationTargets,
  type RegenerationTarget,
} from "../../core/regenerationTargetRegistry";

// Globally-available Regenerate menu — mounted in the Topbar so any
// admin page exposes the same site-wide regen actions. The action
// picker is a standard anchored Dropdown; the live PublishLog (file
// list streamed during a run) is rendered as a centered MODAL so it
// reads cleanly regardless of the page underneath, instead of a
// floating panel that competed with the page's own UI.
export function RegenerateMenu() {
  const { t } = useTranslation();
  const { settings, terms, users, media } = useCmsData();
  const themes = listThemes();
  const [busy, setBusy] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);

  const [pluginTargets, setPluginTargets] = useState<RegenerationTarget[]>(
    () => listRegenerationTargets(),
  );
  useEffect(() => {
    return subscribeRegenerationTargets(() => {
      setPluginTargets(listRegenerationTargets());
    });
  }, []);

  // Esc clears the log modal — but only when the run has finished.
  // Mid-regen we leave the modal pinned so a stray keypress doesn't
  // hide live progress.
  useEffect(() => {
    if (busy) return;
    if (logEntries.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLogEntries([]);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, logEntries.length]);

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

  function pluginLabel(target: RegenerationTarget, key: string | undefined): string {
    if (!key) return "";
    const ns = target.i18nNamespace ?? target.id;
    const resolved = i18n.t(key, { ns });
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
      { id: "site", label: t("themes.regenerate.groupBuiltins"), items: builtins },
    ];
    if (pluginItems.length > 0) {
      out.push({ id: "plugins", label: t("themes.regenerate.groupPlugins"), items: pluginItems });
    }
    out.push({ id: "everything", items: [everything] });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t() identity is stable; settings.themeConfigs is the actual data dep
  }, [pluginTargets, settings.themeConfigs, t]);

  const showLog = busy || logEntries.length > 0;

  return (
    <>
      <Dropdown
        triggerLabel={
          <>
            <Loader2 className={busy ? "h-4 w-4 animate-spin" : "hidden"} />
            <RefreshCw className={busy ? "hidden" : "h-4 w-4"} />
            <span>{busy ? t("themes.regenerate.running") : t("themes.regenerate.button")}</span>
          </>
        }
        triggerClassName="btn-secondary"
        disabled={busy}
        sections={sections}
      />

      {showLog &&
        // Portal the modal to <body> so its `position: fixed` resolves
        // against the viewport. The Topbar uses `backdrop-blur`
        // (CSS `backdrop-filter`), which per spec creates a new
        // containing block for fixed descendants — without the portal
        // the modal would center against the header, not the page.
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="regenerate-log-title"
            onClick={(e) => {
              // Backdrop click clears the log only after the run is
              // finished — mid-regen we ignore so the user can't
              // accidentally hide progress.
              if (busy) return;
              if (e.target === e.currentTarget) setLogEntries([]);
            }}
          >
            <div className="card w-full max-w-lg max-h-[80vh] flex flex-col animate-scale-in">
              <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3 dark:border-surface-700">
                <h2
                  id="regenerate-log-title"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4 text-surface-500" />
                  )}
                  {busy ? t("themes.regenerate.running") : t("themes.regenerate.button")}
                </h2>
                {!busy && (
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
                    onClick={() => setLogEntries([])}
                    aria-label={t("common.close")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="overflow-y-auto p-3">
                <PublishLog entries={logEntries} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
