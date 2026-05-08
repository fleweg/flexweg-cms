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
import { manifest as flexwegArchivesManifest } from "./flexweg-archives/manifest";
import { manifest as flexwegSearchManifest } from "./flexweg-search/manifest";
import i18n from "../i18n";
import type { AdminLocale } from "../core/types";
import { pluginApi, resetRegistry } from "../core/pluginRegistry";
import { resetBlocks } from "../core/blockRegistry";
import { resetDashboardCards } from "../core/dashboardCardRegistry";
import { resetRegenerationTargets } from "../core/regenerationTargetRegistry";
import { MU_PLUGINS } from "../mu-plugins";
import { listExternalPlugins } from "../services/externalRegistry";

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
  // Plugin author / vendor — surfaced in /admin/#/plugins next to
  // the version. Free-form string ("Flexweg", company name, GitHub
  // handle, …) — the admin renders it verbatim.
  author?: string;
  // Long-form documentation, typically the plugin's README.md. When
  // present, the plugins list shows a "Learn more" button that opens
  // a modal with the rendered Markdown. Imported via Vite's `?raw`
  // suffix so the file content ships as a string in the bundle.
  readme?: string;
  register: (api: typeof pluginApi) => void;
  // Optional configuration page for /settings/plugin/<id>.
  settings?: PluginSettingsPageDef<TConfig>;
  // Optional bundled translations. Merged into a dedicated i18next
  // namespace named after the plugin id, so plugin UI can call
  // `useTranslation(<plugin-id>)` without colliding with admin keys.
  i18n?: Partial<Record<AdminLocale, Record<string, unknown>>>;
}

// In dev (`npm run dev`), plugins are bundled into the admin SPA via
// the static imports above and listed here. In prod (`npm run build`),
// each plugin is emitted as a separate ESM bundle under
// `dist/admin/plugins/<id>/` by scripts/build-bundled-externals.mjs,
// listed in `dist/admin/external.json`, and loaded at runtime through
// services/externalLoader.ts — same path as user-installed externals.
// PLUGINS is therefore empty in prod, so plugin lifecycle and i18n
// flow exclusively through the external mechanism in deployed admins.
//
// Vite replaces `import.meta.env.DEV` with `false` at prod build time;
// Rollup tree-shakes the unused manifest imports above, keeping the
// admin bundle free of plugin code that's already in the externals.
const BUILTINS_DEV: PluginManifest[] = [
  coreSeoManifest,
  flexwegSitemapsManifest as PluginManifest,
  flexwegRssManifest as PluginManifest,
  flexwegArchivesManifest as PluginManifest,
  flexwegSearchManifest as PluginManifest,
];
export const PLUGINS: PluginManifest[] = import.meta.env.DEV
  ? BUILTINS_DEV
  : [];

// Returns built-in plugins + any externally-loaded ones. The admin's
// /plugins page, settings tabs and config-resolver all read through
// this so external entries show up everywhere a built-in does.
export function listPlugins(): PluginManifest[] {
  const externals = listExternalPlugins();
  if (externals.length === 0) return PLUGINS;
  return [...PLUGINS, ...externals];
}

// Resolves a manifest by id across all registries: regular built-ins,
// must-use, and externals. Used by routes (settings page, README modal
// lookups) that don't care where a plugin lives.
export function getPluginManifest(id: string): PluginManifest | undefined {
  return (
    PLUGINS.find((p) => p.id === id) ??
    MU_PLUGINS.find((p) => p.id === id) ??
    listExternalPlugins().find((p) => p.id === id)
  );
}

// Translation bundles ship inline in each manifest. Loading them at module
// load (rather than inside applyPluginRegistration) means the bundles are
// always available — even for disabled plugins, which is fine because the
// config UI for a disabled plugin is unreachable but the keys themselves
// are harmless if present. MU plugins go through the same path so their
// settings pages can resolve translations exactly like regular plugins.
function loadPluginTranslations(): void {
  for (const plugin of [...MU_PLUGINS, ...PLUGINS]) {
    if (!plugin.i18n) continue;
    for (const [locale, resources] of Object.entries(plugin.i18n)) {
      if (!resources) continue;
      i18n.addResourceBundle(locale, plugin.id, resources, true, true);
    }
  }
}

loadPluginTranslations();

// Same as loadPluginTranslations() but for externally-loaded plugins.
// Called by the external loader after each successful import so a
// freshly-loaded plugin's i18n is available before its settings page
// or any t() call referencing the namespace.
export function loadExternalPluginTranslations(plugin: PluginManifest): void {
  if (!plugin.i18n) return;
  for (const [locale, resources] of Object.entries(plugin.i18n)) {
    if (!resources) continue;
    i18n.addResourceBundle(locale, plugin.id, resources, true, true);
  }
}

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
  resetDashboardCards();
  resetRegenerationTargets();
  // MU plugins always register, regardless of `enabled`. They run
  // first so their filters / actions sit at the bottom of priority
  // chains — regular plugins added on top can override or layer on
  // their behaviour the same way they would for any other plugin.
  for (const plugin of MU_PLUGINS) {
    try {
      plugin.register(pluginApi);
    } catch (err) {
      console.error(`MU plugin "${plugin.id}" failed to register:`, err);
    }
  }
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
  // Externals come last so any filter they add layers on top of the
  // built-ins. Same enable-flag check applies — an external plugin
  // can be disabled from the same UI.
  for (const plugin of listExternalPlugins()) {
    if (enabled[plugin.id] === false) continue;
    try {
      plugin.register(pluginApi);
    } catch (err) {
      console.error(`External plugin "${plugin.id}" failed to register:`, err);
    }
  }
}
