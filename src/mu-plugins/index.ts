// Must-use plugins (MU plugins). Same shape as regular plugins under
// src/plugins/, but always registered — there is no enable / disable
// toggle in the admin and no entry in settings.enabledPlugins. Use this
// folder for plugins that the site cannot meaningfully run without
// (favicon, future core features that ship as plugins for code
// organization but aren't optional for users).
//
// Adding a new MU plugin:
//   1. Create src/mu-plugins/<id>/manifest.ts and export `manifest`.
//   2. Import it here and append to MU_PLUGINS.
//   3. The plugin loader (src/plugins/index.ts) registers MU plugins
//      first on every applyPluginRegistration() pass, regardless of
//      the enabled-flags map.

import type { PluginManifest } from "../plugins";
import { manifest as flexwegFaviconManifest } from "./flexweg-favicon/manifest";
import { manifest as flexwegBlocksManifest } from "./flexweg-blocks/manifest";
import { manifest as flexwegCustomCodeManifest } from "./flexweg-custom-code/manifest";
import { manifest as flexwegEmbedsManifest } from "./flexweg-embeds/manifest";
import { manifest as flexwegMetricsManifest } from "./flexweg-metrics/manifest";

export const MU_PLUGINS: PluginManifest[] = [
  flexwegFaviconManifest as PluginManifest,
  flexwegBlocksManifest,
  flexwegCustomCodeManifest as PluginManifest,
  flexwegEmbedsManifest,
  flexwegMetricsManifest,
];

export function listMuPlugins(): PluginManifest[] {
  return MU_PLUGINS;
}

export function getMuPluginManifest(id: string): PluginManifest | undefined {
  return MU_PLUGINS.find((p) => p.id === id);
}

export function isMuPlugin(id: string): boolean {
  return MU_PLUGINS.some((p) => p.id === id);
}
