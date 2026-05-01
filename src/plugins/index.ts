// Plugin loader. Each plugin lives in its own folder under src/plugins/ and
// exports a manifest with a `register(api)` function. The settings document
// stores a per-plugin enable flag; this loader runs through every known
// plugin, resets the registry first, and re-registers the enabled ones.
//
// Adding a new plugin:
//   1. Create src/plugins/<id>/manifest.ts and export `manifest`.
//   2. Import it here and append to PLUGINS.
//   3. Bundling is automatic; the user toggles activation in /plugins.

import { manifest as coreSeoManifest } from "./core-seo/manifest";
import { pluginApi, resetRegistry } from "../core/pluginRegistry";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  register: (api: typeof pluginApi) => void;
}

export const PLUGINS: PluginManifest[] = [coreSeoManifest];

export function listPlugins(): PluginManifest[] {
  return PLUGINS;
}

// Re-evaluates the registry against the given enabled flags. Call this on
// app boot (after settings load) and any time the user toggles a plugin.
export function applyPluginRegistration(enabled: Record<string, boolean>): void {
  resetRegistry();
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
