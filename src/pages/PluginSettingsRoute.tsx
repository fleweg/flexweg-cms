import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../context/CmsDataContext";
import { getPluginManifest } from "../plugins";
import { updatePluginConfig } from "../services/settings";

// Renders the settings page declared by a plugin's manifest. Resolves the
// :pluginId param to a manifest, hands its component the merged config (
// stored value + defaults) and a save helper that persists the whole blob
// back to settings/site.pluginConfigs.<id>. If the plugin doesn't exist or
// has no settings page, redirects to the General tab.
export function PluginSettingsRoute() {
  const { t } = useTranslation();
  const { pluginId } = useParams<{ pluginId: string }>();
  const { settings } = useCmsData();
  const plugin = pluginId ? getPluginManifest(pluginId) : undefined;

  // Compute the resolved config once per render. Plugins receive whatever
  // is in Firestore overlaid on their manifest defaults — fields the user
  // hasn't customized stay at their default value.
  const config = useMemo(() => {
    if (!plugin?.settings) return null;
    const stored = (settings.pluginConfigs as Record<string, unknown> | undefined)?.[plugin.id];
    return { ...(plugin.settings.defaultConfig as object), ...((stored as object) ?? {}) };
  }, [plugin, settings.pluginConfigs]);

  if (!plugin || !plugin.settings) return <Navigate to="/settings/general" replace />;
  if (settings.enabledPlugins[plugin.id] === false) {
    // Disabled plugin: silently bounce — admin can re-enable from /plugins.
    return <Navigate to="/settings/general" replace />;
  }
  if (!config) return null;

  const Component = plugin.settings.component;
  return (
    <section aria-label={t(plugin.settings.navLabelKey, { defaultValue: plugin.name })}>
      <Component
        config={config}
        save={(next) => updatePluginConfig(plugin.id, next)}
      />
    </section>
  );
}
