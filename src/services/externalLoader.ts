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
  type ExternalManifest,
} from "./externalRegistry";
import { readRegistry, writeRegistry } from "./externalRegistryStore";
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
  const base = new URL(relative, document.baseURI);
  // Cache-bust via the entry version so an in-place upgrade (same URL,
  // new content) doesn't get served the HTTP-cached older bundle. The
  // browser's module cache is keyed by full URL, so different `?v=`
  // produces a fresh import + a fresh manifest.cssText for Sync.
  if (entry.version) base.searchParams.set("v", entry.version);
  return base.href;
}

// Read the registry through services/externalRegistryStore. The store
// transparently handles the Firestore → legacy file → defaults file
// fallback chain and migrates older deployments on first read.

// Outcome of a single bundle load attempt. `missing` distinguishes
// "file not on Flexweg" (HTTP 404 or non-JS content-type — typically the
// SPA fallback returning HTML) from "bundle present but broken". Only
// `missing` failures auto-prune the registry; transient or evaluation
// errors keep the entry so a later boot or a fix can recover.
type LoadOutcome =
  | { ok: true }
  | { ok: false; missing: boolean };

// Probes whether the bundle URL actually serves a JS module. Flexweg's
// static host falls back to index.html for unknown paths, so a "missing"
// bundle returns 200 with text/html — that's the classic MIME error the
// dynamic import surfaces. We treat 404 OR a non-JS content-type as
// "missing on Flexweg".
async function probeBundleMissing(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (res.status === 404) return true;
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") ?? "";
    if (/javascript|ecmascript|module/i.test(ct)) return false;
    return true;
  } catch {
    return false;
  }
}

// Imports a single external bundle and registers its default-exported
// manifest.
async function loadOneEntry(
  type: "plugins" | "themes",
  entry: ExternalEntry,
): Promise<LoadOutcome> {
  if (!isCompatibleApi(entry.apiVersion)) {
    console.warn(
      `[external] skipping ${type}/${entry.id}: apiVersion ${entry.apiVersion} ` +
        `outside [${FLEXWEG_API_MIN_VERSION}, ${FLEXWEG_API_VERSION}]`,
    );
    return { ok: false, missing: false };
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
    const missing = await probeBundleMissing(url);
    return { ok: false, missing };
  }
  // Accept both `export default manifest` (the convention for
  // user-authored external bundles, see external/plugins/hello-plugin/) AND
  // `export const manifest = ...` (the in-tree convention used by
  // plugins/themes that get packaged as externals at build time —
  // changing every in-tree manifest.ts to `export default` would be
  // churn for no gain). The first non-null lookup wins.
  const manifest = mod.default ?? mod.manifest;
  if (!manifest || typeof manifest !== "object" || !("id" in manifest)) {
    console.error(
      `[external] ${type}/${entry.id} bundle did not export a valid manifest (default or named "manifest")`,
    );
    return { ok: false, missing: false };
  }
  // Cross-check: the manifest's id must match the entry id. Mismatch
  // would let a swapped bundle hijack a different entry slot.
  if ((manifest as { id: string }).id !== entry.id) {
    console.error(
      `[external] ${type}/${entry.id} manifest.id mismatch: got "${(manifest as { id: string }).id}"`,
    );
    return { ok: false, missing: false };
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
    return { ok: false, missing: false };
  }
  return { ok: true };
}

// Loads every external entry declared in the manifest. Resets the
// in-memory list first so a re-run (after uninstall/reinstall) reflects
// the current state. Resolves once every entry has been processed.
//
// Self-healing: any entry whose bundle is genuinely missing on Flexweg
// (404 or HTML fallback served instead of JS) gets pruned from the
// Firestore registry automatically. This unsticks the common "I renamed
// a theme but the old id is still referenced" scenario without forcing
// the user into devtools. Entries that fail for other reasons (network
// blip, broken bundle code) are left in place — they may recover later
// or need explicit user action.
export async function loadAllExternalEntries(): Promise<{
  loaded: number;
  failed: number;
  pruned: number;
}> {
  const manifest = await readRegistry();
  clearExternalPlugins();
  clearExternalThemes();
  let loaded = 0;
  let failed = 0;
  const missingPlugins = new Set<string>();
  const missingThemes = new Set<string>();
  for (const entry of manifest.plugins) {
    const outcome = await loadOneEntry("plugins", entry);
    if (outcome.ok) loaded++;
    else {
      failed++;
      if (outcome.missing) missingPlugins.add(entry.id);
    }
  }
  for (const entry of manifest.themes) {
    const outcome = await loadOneEntry("themes", entry);
    if (outcome.ok) loaded++;
    else {
      failed++;
      if (outcome.missing) missingThemes.add(entry.id);
    }
  }

  let pruned = 0;
  if (missingPlugins.size > 0 || missingThemes.size > 0) {
    const cleaned: ExternalManifest = {
      plugins: manifest.plugins.filter((e) => !missingPlugins.has(e.id)),
      themes: manifest.themes.filter((e) => !missingThemes.has(e.id)),
    };
    pruned = missingPlugins.size + missingThemes.size;
    try {
      await writeRegistry(cleaned);
      const ids = [...missingPlugins, ...missingThemes].join(", ");
      console.warn(
        `[external] auto-pruned ${pruned} stale registry entr${pruned === 1 ? "y" : "ies"}: ${ids}`,
      );
      toast.info(
        i18n.t("externalLoader.autoPruned", {
          count: pruned,
          ids,
          defaultValue: `${pruned} stale external entr${pruned === 1 ? "y" : "ies"} removed from registry: ${ids}`,
        }),
      );
      // Pruned entries are no longer "failures" the user should worry
      // about — collapse them out of the failed count.
      failed -= pruned;
    } catch (err) {
      console.warn("[external] auto-prune failed to write registry:", err);
    }
  }

  if (failed > 0) {
    // Surface a single grouped toast so the user knows something went
    // wrong without us spamming one toast per failure. Specifics live
    // in the console.
    toast.warn(
      i18n.t("externalLoader.someFailed", { count: failed, defaultValue: `${failed} external bundle(s) failed to load. Check the browser console.` }),
    );
  }
  return { loaded, failed, pruned };
}
