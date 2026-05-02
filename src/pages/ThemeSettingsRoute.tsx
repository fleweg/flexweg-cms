import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { getActiveTheme } from "../themes";
import { updateThemeConfig } from "../services/settings";

// Renders the active theme's settings page (declared via
// ThemeManifest.settings). Resolves the manifest, merges the stored
// config with manifest defaults, and hands the component a `save`
// helper that persists the whole blob back to
// settings/site.themeConfigs.<themeId>.
//
// Themes that don't declare a `settings` field redirect away — the
// sidebar entry is hidden for them too, so this is just a defensive
// guard against direct URL navigation.
export function ThemeSettingsRoute() {
  const { t } = useTranslation();
  const { settings } = useCmsData();
  const theme = getActiveTheme(settings.activeThemeId);

  // Merge defaults + stored config once per render so the component
  // sees a complete blob even on a fresh install.
  const config = useMemo(() => {
    if (!theme.settings) return null;
    const stored = (settings.themeConfigs as Record<string, unknown> | undefined)?.[theme.id];
    return {
      ...(theme.settings.defaultConfig as object),
      ...((stored as object) ?? {}),
    };
  }, [theme, settings.themeConfigs]);

  if (!theme.settings) {
    return <Navigate to="/dashboard" replace />;
  }
  if (!config) return null;

  const Component = theme.settings.component;
  const ns = `theme-${theme.id}`;
  // Resolve the page heading via the theme's own i18n namespace; falls
  // back to the manifest name when the key isn't translated.
  const headingKey = theme.settings.navLabelKey;
  const heading = t(`${ns}:${headingKey}`, { defaultValue: theme.name });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title={heading} />
      <Component
        config={config}
        save={(next) => updateThemeConfig(theme.id, next)}
      />
    </div>
  );
}
