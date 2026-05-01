import { Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { listPlugins } from "../plugins";
import { updateSettings } from "../services/settings";

export function PluginsPage() {
  const { t } = useTranslation();
  const { settings } = useCmsData();
  const plugins = listPlugins();

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
          return (
            <li key={plugin.id} className="card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{plugin.name}</p>
                <p className="text-xs text-surface-500 mt-0.5 dark:text-surface-400">
                  v{plugin.version} · {plugin.id}
                </p>
                {plugin.description && (
                  <p className="text-sm text-surface-600 mt-1 dark:text-surface-300">
                    {plugin.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasSettings && enabled && (
                  <Link
                    to={`/settings/plugin/${plugin.id}`}
                    className="btn-ghost"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    {t("plugins.configure")}
                  </Link>
                )}
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
    </div>
  );
}
