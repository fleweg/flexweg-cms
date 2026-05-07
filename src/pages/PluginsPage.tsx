import { useState } from "react";
import { Info, Loader2, Lock, Plus, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { ReadmeModal } from "../components/plugins/ReadmeModal";
import { ExternalInstallModal } from "../components/plugins/ExternalInstallModal";
import { useCmsData } from "../context/CmsDataContext";
import { listPlugins, type PluginManifest } from "../plugins";
import { listMuPlugins } from "../mu-plugins";
import { listExternalPlugins } from "../services/externalRegistry";
import { uninstallExternal } from "../services/externalUpload";
import { updateSettings } from "../services/settings";
import { cn } from "../lib/utils";
import { toast } from "../lib/toast";

type Tab = "regular" | "mustUse";

export function PluginsPage() {
  const { t } = useTranslation();
  const { settings } = useCmsData();
  const [tab, setTab] = useState<Tab>("regular");
  // Manifest of the plugin whose README modal is open. null → no
  // modal mounted. Storing the whole manifest (vs an id) means the
  // modal can render even when the plugin gets re-listed under a
  // different id later.
  const [readmePlugin, setReadmePlugin] = useState<PluginManifest | null>(null);
  // Drives the install/uninstall modal for external (uploaded) plugins.
  const [installModalOpen, setInstallModalOpen] = useState(false);
  // Tracks the id of the plugin currently being uninstalled (drives
  // the per-card spinner + disables the trash button).
  const [uninstallingId, setUninstallingId] = useState<string | null>(null);

  const visiblePlugins = tab === "regular" ? listPlugins() : listMuPlugins();
  const externals = listExternalPlugins();
  const externalIds = new Set(externals.map((p) => p.id));

  async function handleUninstall(id: string) {
    if (uninstallingId) return;
    if (!window.confirm(t("externalInstall.confirmUninstall", { id }))) return;
    setUninstallingId(id);
    try {
      await uninstallExternal("plugins", id);
      toast.success(t("externalInstall.uninstallSuccess", { id }));
      window.setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error((err as Error).message);
      setUninstallingId(null);
    }
  }

  async function toggle(id: string, current: boolean) {
    await updateSettings({
      enabledPlugins: { ...settings.enabledPlugins, [id]: !current },
    });
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader
        title={t("plugins.title")}
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setInstallModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t("plugins.installExternal")}
          </button>
        }
      />
      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label={t("plugins.title")}
      >
        <TabButton
          active={tab === "regular"}
          onClick={() => setTab("regular")}
          label={t("plugins.tabs.regular")}
        />
        <TabButton
          active={tab === "mustUse"}
          onClick={() => setTab("mustUse")}
          label={t("plugins.tabs.mustUse")}
        />
      </nav>
      <ul className="space-y-3">
        {visiblePlugins.map((plugin) => {
          const isMustUse = tab === "mustUse";
          const enabled = isMustUse || settings.enabledPlugins[plugin.id] !== false;
          const hasSettings = !!plugin.settings;
          const hasReadme = !!plugin.readme;
          return (
            <li key={plugin.id} className="card p-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3 sm:block">
                  <div className="min-w-0">
                    <p className="font-semibold flex items-center gap-2">
                      <span>{plugin.name}</span>
                      {isMustUse && <MustUseBadge label={t("plugins.mustUseBadge")} />}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5 dark:text-surface-400">
                      v{plugin.version} · {plugin.id}
                      {plugin.author ? ` — ${t("plugins.author")} : ${plugin.author}` : ""}
                    </p>
                  </div>
                  {/* Enable / Disable lives top-right on mobile so the
                      header row reads "name + status toggle" at a glance.
                      On sm+ the toggle moves into the right-aligned slot
                      below alongside the description and secondary
                      actions. Hidden entirely for must-use plugins —
                      they have no toggle. */}
                  {!isMustUse && (
                    <button
                      type="button"
                      className={
                        "shrink-0 sm:hidden " + (enabled ? "btn-secondary" : "btn-primary")
                      }
                      onClick={() => toggle(plugin.id, enabled)}
                    >
                      {enabled ? t("plugins.disable") : t("plugins.enable")}
                    </button>
                  )}
                </div>
                {plugin.description && (
                  <p className="text-sm text-surface-600 mt-2 dark:text-surface-300">
                    {plugin.description}
                  </p>
                )}
                {/* Secondary actions sit under the description on every
                    breakpoint so the card stays readable on narrow
                    viewports. flex-wrap lets the row break if both
                    Learn more and Configure end up at narrower widths. */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {hasReadme && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setReadmePlugin(plugin)}
                    >
                      <Info className="h-4 w-4" />
                      {t("plugins.learnMore")}
                    </button>
                  )}
                  {hasSettings && enabled && (
                    <Link
                      to={`/settings/plugin/${plugin.id}`}
                      className="btn-ghost"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      {t("plugins.configure")}
                    </Link>
                  )}
                  {/* Uninstall is only offered on externally-installed
                      plugins — built-ins live in the bundle and can't
                      be removed at runtime. */}
                  {!isMustUse && externalIds.has(plugin.id) && (
                    <button
                      type="button"
                      className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                      onClick={() => handleUninstall(plugin.id)}
                      disabled={uninstallingId === plugin.id}
                    >
                      {uninstallingId === plugin.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {t("externalInstall.uninstall")}
                    </button>
                  )}
                </div>
              </div>
              {/* Toggle on the right edge for sm+. Hidden on mobile —
                  the duplicate at the top-right takes over there.
                  Must-use plugins have no toggle. */}
              {!isMustUse && (
                <div className="hidden sm:flex shrink-0 items-start">
                  <button
                    type="button"
                    className={enabled ? "btn-secondary" : "btn-primary"}
                    onClick={() => toggle(plugin.id, enabled)}
                  >
                    {enabled ? t("plugins.disable") : t("plugins.enable")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {readmePlugin && readmePlugin.readme && (
        <ReadmeModal
          title={readmePlugin.name}
          markdown={readmePlugin.readme}
          onClose={() => setReadmePlugin(null)}
        />
      )}
      <ExternalInstallModal
        kind="plugins"
        open={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        existing={externals.map((p) => ({
          id: p.id,
          name: p.name,
          version: p.version,
        }))}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors",
        active
          ? "border-blue-600 text-surface-900 dark:text-surface-50"
          : "border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
      )}
    >
      {label}
    </button>
  );
}

function MustUseBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300"
      title={label}
    >
      <Lock className="h-3 w-3" />
      {label}
    </span>
  );
}
