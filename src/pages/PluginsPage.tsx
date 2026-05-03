import { useState } from "react";
import { Info, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { ReadmeModal } from "../components/plugins/ReadmeModal";
import { useCmsData } from "../context/CmsDataContext";
import { listPlugins, type PluginManifest } from "../plugins";
import { updateSettings } from "../services/settings";

export function PluginsPage() {
  const { t } = useTranslation();
  const { settings } = useCmsData();
  const plugins = listPlugins();
  // Manifest of the plugin whose README modal is open. null → no
  // modal mounted. Storing the whole manifest (vs an id) means the
  // modal can render even when the plugin gets re-listed under a
  // different id later.
  const [readmePlugin, setReadmePlugin] = useState<PluginManifest | null>(null);

  async function toggle(id: string, current: boolean) {
    await updateSettings({
      enabledPlugins: { ...settings.enabledPlugins, [id]: !current },
    });
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title={t("plugins.title")} />
      <ul className="space-y-3">
        {plugins.map((plugin) => {
          const enabled = settings.enabledPlugins[plugin.id] !== false;
          const hasSettings = !!plugin.settings;
          const hasReadme = !!plugin.readme;
          return (
            <li key={plugin.id} className="card p-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3 sm:block">
                  <div className="min-w-0">
                    <p className="font-semibold">{plugin.name}</p>
                    <p className="text-xs text-surface-500 mt-0.5 dark:text-surface-400">
                      v{plugin.version} · {plugin.id}
                      {plugin.author ? ` — ${t("plugins.author")} : ${plugin.author}` : ""}
                    </p>
                  </div>
                  {/* Enable / Disable lives top-right on mobile so the
                      header row reads "name + status toggle" at a glance.
                      On sm+ the toggle moves into the right-aligned slot
                      below alongside the description and secondary
                      actions. */}
                  <button
                    type="button"
                    className={
                      "shrink-0 sm:hidden " + (enabled ? "btn-secondary" : "btn-primary")
                    }
                    onClick={() => toggle(plugin.id, enabled)}
                  >
                    {enabled ? t("plugins.disable") : t("plugins.enable")}
                  </button>
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
                </div>
              </div>
              {/* Toggle on the right edge for sm+. Hidden on mobile —
                  the duplicate at the top-right takes over there. */}
              <div className="hidden sm:flex shrink-0 items-start">
                <button
                  type="button"
                  className={enabled ? "btn-secondary" : "btn-primary"}
                  onClick={() => toggle(plugin.id, enabled)}
                >
                  {enabled ? t("plugins.disable") : t("plugins.enable")}
                </button>
              </div>
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
    </div>
  );
}
