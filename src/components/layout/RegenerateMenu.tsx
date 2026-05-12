import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useCmsData } from "../../context/CmsDataContext";
import { Dropdown, type DropdownItem, type DropdownSection } from "../ui/Dropdown";
import { PublishLogModal } from "../publishing/PublishLogModal";
import { listThemes } from "../../themes";
import {
  buildPublishContext,
  regenerateAll,
  regenerateHomeOnly,
  repairPublishPaths,
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

  async function buildCtx(opts?: { refreshTerms?: boolean }): Promise<PublishContext> {
    return buildPublishContext({
      terms,
      settings,
      users,
      authorLookup: buildAuthorLookup(users, media),
      refreshTerms: opts?.refreshTerms,
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
        id: "repair",
        label: t("themes.regenerate.repair"),
        description: t("themes.regenerate.repairHelp"),
        // The whole point of this action is to recover from a publish
        // that ran with stale terms — so force a Firestore refresh of
        // terms before checking path drift, otherwise we'd be using
        // the same potentially-stale React state that may have caused
        // the drift in the first place.
        onSelect: () =>
          runWithLog(async (log) => {
            const ctx = await buildCtx({ refreshTerms: true });
            await repairPublishPaths(ctx, log);
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

      <PublishLogModal
        entries={logEntries}
        busy={busy}
        onClear={() => setLogEntries([])}
      />
    </>
  );
}
