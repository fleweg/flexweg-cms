// Plugin loader. Each plugin lives in its own folder under src/plugins/ and
// exports a manifest with a `register(api)` function. The settings document
// stores a per-plugin enable flag; this loader runs through every known
// plugin, resets the registry first, and re-registers the enabled ones.
//
// Adding a new plugin:
//   1. Create src/plugins/<id>/manifest.ts and export `manifest`.
//   2. Import it here and append to PLUGINS.
//   3. Bundling is automatic; the user toggles activation in /plugins.

import type { ComponentType } from "react";
import { manifest as coreSeoManifest } from "./core-seo/manifest";
import { manifest as flexwegSitemapsManifest } from "./flexweg-sitemaps/manifest";
import { manifest as flexwegRssManifest } from "./flexweg-rss/manifest";
import { manifest as flexwegFaviconManifest } from "./flexweg-favicon/manifest";
import i18n from "../i18n";
import type { AdminLocale } from "../core/types";
import { pluginApi, resetRegistry } from "../core/pluginRegistry";
import { resetBlocks } from "../core/blockRegistry";

// Plugins can optionally expose a settings page. When present, a navigation
// entry appears under /settings/plugin/<id> and the plugins list shows a
// "Configure" link on the matching card.
export interface PluginSettingsPageDef<TConfig = unknown> {
  // i18n key used as the tab label. Looked up against the plugin's own
  // namespace if `i18n` is set, otherwise the global namespace.
  navLabelKey: string;
  // Default config used when no value is stored yet. The settings UI is
  // expected to merge this with whatever is in Firestore.
  defaultConfig: TConfig;
  // The page is rendered inside the settings layout via <Outlet />. It
  // receives the resolved config and a `save` helper from the wrapping
  // route component (PluginSettingsRoute).
  component: ComponentType<PluginSettingsPageProps<TConfig>>;
}

export interface PluginSettingsPageProps<TConfig = unknown> {
  config: TConfig;
  save: (next: TConfig) => Promise<void>;
}

export interface PluginManifest<TConfig = unknown> {
  id: string;
  name: string;
  version: string;
  description?: string;
  register: (api: typeof pluginApi) => void;
  // Optional configuration page for /settings/plugin/<id>.
  settings?: PluginSettingsPageDef<TConfig>;
  // Optional bundled translations. Merged into a dedicated i18next
  // namespace named after the plugin id, so plugin UI can call
  // `useTranslation(<plugin-id>)` without colliding with admin keys.
  i18n?: Partial<Record<AdminLocale, Record<string, unknown>>>;
}

export const PLUGINS: PluginManifest[] = [
  coreSeoManifest,
  flexwegSitemapsManifest as PluginManifest,
  flexwegRssManifest as PluginManifest,
  flexwegFaviconManifest as PluginManifest,
];

export function listPlugins(): PluginManifest[] {
  return PLUGINS;
}

export function getPluginManifest(id: string): PluginManifest | undefined {
  return PLUGINS.find((p) => p.id === id);
}

// Translation bundles ship inline in each manifest. Loading them at module
// load (rather than inside applyPluginRegistration) means the bundles are
// always available — even for disabled plugins, which is fine because the
// config UI for a disabled plugin is unreachable but the keys themselves
// are harmless if present.
function loadPluginTranslations(): void {
  for (const plugin of PLUGINS) {
    if (!plugin.i18n) continue;
    for (const [locale, resources] of Object.entries(plugin.i18n)) {
      if (!resources) continue;
      i18n.addResourceBundle(locale, plugin.id, resources, true, true);
    }
  }
}

loadPluginTranslations();

// Re-evaluates the registry against the given enabled flags. Call this on
// app boot (after settings load) and any time the user toggles a plugin.
//
// Resets every plugin-controlled registry first (filters/actions and
// plugin-registered blocks) so the post-call state always reflects the
// current enabled set. Core blocks survive because resetBlocks() spares
// them — see core/blockRegistry.ts.
export function applyPluginRegistration(enabled: Record<string, boolean>): void {
  resetRegistry();
  resetBlocks();
  for (const plugin of PLUGINS) {
    if (enabled[plugin.id] === false) continue;
    try {
      plugin.register(pluginApi);
    } catch (err) {
      // A plugin failing to register shouldn't take down the whole admin —
      // log and skip. Re-throwing during a re-toggle would leave the
      // registry in an inconsistent state.
      console.error(`Plugin "${plugin.id}" failed to register:`, err);
    }
  }
}
