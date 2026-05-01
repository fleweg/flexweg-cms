import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "./PageHeader";
import { useCmsData } from "../../context/CmsDataContext";
import { listPlugins, type PluginManifest } from "../../plugins";
import { cn } from "../../lib/utils";

// Resolves the label of a plugin's settings tab from its own i18n namespace.
// Falls back to the plugin name if the key isn't translated yet.
function PluginTabLabel({ plugin }: { plugin: PluginManifest }) {
  const { t } = useTranslation(plugin.id);
  const labelKey = plugin.settings?.navLabelKey;
  if (!labelKey) return <>{plugin.name}</>;
  const translated = t(labelKey);
  return <>{translated === labelKey ? plugin.name : translated}</>;
}

// Wraps every /settings/* route. Renders the page title, a horizontal tab
// strip with one entry per enabled-plugin-with-settings, and the matched
// child route's content via <Outlet />.
export function SettingsLayout() {
  const { t } = useTranslation();
  const { settings } = useCmsData();
  const pluginTabs = listPlugins().filter(
    (p) => p.settings && settings.enabledPlugins[p.id] !== false,
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title={t("settings.title")} />
      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label={t("settings.title")}
      >
        <SettingsTab to="/settings/general" label={t("settings.tabs.general")} />
        {pluginTabs.map((plugin) => (
          <SettingsTab
            key={plugin.id}
            to={`/settings/plugin/${plugin.id}`}
            label={<PluginTabLabel plugin={plugin} />}
          />
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

function SettingsTab({ to, label }: { to: string; label: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors",
          isActive
            ? "border-blue-600 text-surface-900 dark:text-surface-50"
            : "border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
        )
      }
    >
      {label}
    </NavLink>
  );
}
