// Boot-time loader for externally-installed plugins and themes.
//
// Reads the registry from Firestore (settings/externalRegistry) via
// services/externalRegistryStore, dynamically imports each declared
// bundle, validates its apiVersion, and registers the resolved
// manifest into the in-memory external registry. Errors per entry are
// caught + logged + toasted but never abort the loop — a single bad
// bundle cannot crash the admin.
//
// Called once during boot from CmsDataContext, before plugin/theme
// registration kicks in. The await means any external entries are
// available by the time `applyPluginRegistration` runs.

import i18n from "../i18n";
import { toast } from "../lib/toast";
import {
  FLEXWEG_API_MIN_VERSION,
  FLEXWEG_API_VERSION,
} from "../core/flexwegRuntime";
import {
  clearExternalPlugins,
  clearExternalThemes,
  registerExternalPlugin,
  registerExternalTheme,
  type ExternalEntry,
} from "./externalRegistry";
import { readRegistry } from "./externalRegistryStore";
import {
  loadExternalPluginTranslations,
  type PluginManifest,
} from "../plugins";
import {
  loadExternalThemeTranslations,
} from "../themes";
import type { ThemeManifest } from "../themes/types";

// Compares two semver-like strings ("1.2.3" → [1,2,3]). Returns -1, 0, 1
// the way Array.sort expects. Tolerant of missing components: "1.2"
// compares equal to "1.2.0".
function compareVersions(a: string, b: string): number {
  const parse = (s: string) =>
    s
      .split(".")
      .slice(0, 3)
      .map((p) => Number.parseInt(p, 10) || 0);
  const av = parse(a);
  const bv = parse(b);
  for (let i = 0; i < 3; i++) {
    const x = av[i] ?? 0;
    const y = bv[i] ?? 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

function isCompatibleApi(version: string): boolean {
  if (!version) return false;
  return (
    compareVersions(version, FLEXWEG_API_MIN_VERSION) >= 0 &&
    compareVersions(version, FLEXWEG_API_VERSION) <= 0
  );
}

// Default entry path convention when an entry omits `entryPath`. We use
// the same shape both for plugins and themes so authors can ship the
// same folder layout regardless of which type they're packaging.
function defaultEntryPath(type: "plugins" | "themes", id: string): string {
  return `${type}/${id}/bundle.js`;
}

// Builds the absolute URL to the bundle for dynamic import.
//
// Subtlety: dynamic `import()` resolves relative paths against the
// CALLING MODULE's URL, not against the document. The admin loader is
// bundled into /admin/assets/index-<hash>.js, so a relative URL like
// "./plugins/foo/bundle.js" would resolve to
// /admin/assets/plugins/foo/bundle.js — the wrong place.
//
// We force resolution against `document.baseURI` (the index.html URL,
// e.g. /admin/index.html) so the result is /admin/plugins/foo/bundle.js
// regardless of where the calling module lives in the bundle output.
function resolveBundleUrl(
  type: "plugins" | "themes",
  entry: ExternalEntry,
): string {
  const path = entry.entryPath ?? defaultEntryPath(type, entry.id);
  // Strip any leading slash so URL() interprets the path as relative.
  const relative = path.replace(/^\/+/, "");
  return new URL(relative, document.baseURI).href;
}

// Read the registry through services/externalRegistryStore. The store
// transparently handles the Firestore → legacy file → defaults file
// fallback chain and migrates older deployments on first read.

// Imports a single external bundle and registers its default-exported
// manifest. Returns true on success, false on any failure (logged).
async function loadOneEntry(
  type: "plugins" | "themes",
  entry: ExternalEntry,
): Promise<boolean> {
  if (!isCompatibleApi(entry.apiVersion)) {
    console.warn(
      `[external] skipping ${type}/${entry.id}: apiVersion ${entry.apiVersion} ` +
        `outside [${FLEXWEG_API_MIN_VERSION}, ${FLEXWEG_API_VERSION}]`,
    );
    return false;
  }
  const url = resolveBundleUrl(type, entry);
  let mod: {
    default?: PluginManifest | ThemeManifest;
    manifest?: PluginManifest | ThemeManifest;
  };
  try {
    // The /* @vite-ignore */ comment tells Vite not to try to analyse
    // this URL at build time — we genuinely don't know it ahead of
    // time. The bundle is fetched and evaluated by the browser.
    mod = (await import(/* @vite-ignore */ url)) as {
      default?: PluginManifest | ThemeManifest;
      manifest?: PluginManifest | ThemeManifest;
    };
  } catch (err) {
    console.error(`[external] failed to import ${url}:`, err);
    return false;
  }
  // Accept both `export default manifest` (the convention for
  // user-authored external bundles, see examples/external-plugin/) AND
  // `export const manifest = ...` (the in-tree convention used by
  // plugins/themes that get packaged as externals at build time —
  // changing every in-tree manifest.ts to `export default` would be
  // churn for no gain). The first non-null lookup wins.
  const manifest = mod.default ?? mod.manifest;
  if (!manifest || typeof manifest !== "object" || !("id" in manifest)) {
    console.error(
      `[external] ${type}/${entry.id} bundle did not export a valid manifest (default or named "manifest")`,
    );
    return false;
  }
  // Cross-check: the manifest's id must match the entry id. Mismatch
  // would let a swapped bundle hijack a different entry slot.
  if ((manifest as { id: string }).id !== entry.id) {
    console.error(
      `[external] ${type}/${entry.id} manifest.id mismatch: got "${(manifest as { id: string }).id}"`,
    );
    return false;
  }
  try {
    if (type === "plugins") {
      const pm = manifest as PluginManifest;
      loadExternalPluginTranslations(pm);
      registerExternalPlugin(pm);
    } else {
      const tm = manifest as ThemeManifest;
      loadExternalThemeTranslations(tm);
      registerExternalTheme(tm);
    }
  } catch (err) {
    console.error(`[external] register failed for ${type}/${entry.id}:`, err);
    return false;
  }
  return true;
}

// Loads every external entry declared in the manifest. Resets the
// in-memory list first so a re-run (after uninstall/reinstall) reflects
// the current state. Resolves once every entry has been processed.
export async function loadAllExternalEntries(): Promise<{
  loaded: number;
  failed: number;
}> {
  const manifest = await readRegistry();
  clearExternalPlugins();
  clearExternalThemes();
  let loaded = 0;
  let failed = 0;
  // Plugins first, then themes — order is incidental but stable.
  for (const entry of manifest.plugins) {
    const ok = await loadOneEntry("plugins", entry);
    if (ok) loaded++;
    else failed++;
  }
  for (const entry of manifest.themes) {
    const ok = await loadOneEntry("themes", entry);
    if (ok) loaded++;
    else failed++;
  }
  if (failed > 0) {
    // Surface a single grouped toast so the user knows something went
    // wrong without us spamming one toast per failure. Specifics live
    // in the console.
    toast.warn(
      i18n.t("externalLoader.someFailed", { count: failed, defaultValue: `${failed} external bundle(s) failed to load. Check the browser console.` }),
    );
  }
  return { loaded, failed };
}
