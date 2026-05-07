// Runtime registry of externally-loaded plugins and themes.
//
// In-tree plugins/themes (under src/plugins/, src/mu-plugins/, src/themes/)
// stay bundled in the admin SPA — same as before. External entries live
// in /admin/plugins/<id>/ and /admin/themes/<id>/ on Flexweg, are
// described by a /admin/external.json manifest, and get dynamically
// imported at boot. This module owns the in-memory list of those
// imported entries and exposes them to the rest of the admin.
//
// Why not Firestore? The list of external bundles is tightly coupled to
// what files actually exist on Flexweg. Storing it in a static JSON next
// to the bundles keeps the source of truth in one place and removes the
// chicken-and-egg of needing Firestore to even know what to load.

import type { PluginManifest } from "../plugins";
import type { ThemeManifest } from "../themes/types";

// In-memory store. Populated by registerExternalPlugin/Theme during
// the boot-time load pass, consumed by the regular registries via
// listExternalPlugins / listExternalThemes.
const externalPlugins: PluginManifest[] = [];
const externalThemes: ThemeManifest[] = [];

// Listeners notified when the list mutates (e.g. after upload removes
// or adds entries at runtime). Used by ThemesPage / PluginsPage to
// refresh their lists without a full reload.
type Listener = () => void;
const listeners = new Set<Listener>();
function notify(): void {
  for (const fn of listeners) fn();
}

export function subscribeToExternalRegistry(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Called by the loader (or by an external bundle's bootstrap code) to
// declare a freshly-imported plugin manifest. Idempotent: a second call
// with the same id replaces the first entry, which makes hot-replace
// possible during the upload flow.
export function registerExternalPlugin(manifest: PluginManifest): void {
  const idx = externalPlugins.findIndex((m) => m.id === manifest.id);
  if (idx >= 0) externalPlugins[idx] = manifest;
  else externalPlugins.push(manifest);
  notify();
}

export function registerExternalTheme(manifest: ThemeManifest): void {
  const idx = externalThemes.findIndex((m) => m.id === manifest.id);
  if (idx >= 0) externalThemes[idx] = manifest;
  else externalThemes.push(manifest);
  notify();
}

// Removes an entry by id. Used by the upload UI when the user clicks
// "uninstall" — combined with deleting the files from Flexweg and
// updating /admin/external.json, this reclaims the slot.
export function unregisterExternalPlugin(id: string): void {
  const idx = externalPlugins.findIndex((m) => m.id === id);
  if (idx >= 0) {
    externalPlugins.splice(idx, 1);
    notify();
  }
}

export function unregisterExternalTheme(id: string): void {
  const idx = externalThemes.findIndex((m) => m.id === id);
  if (idx >= 0) {
    externalThemes.splice(idx, 1);
    notify();
  }
}

export function listExternalPlugins(): PluginManifest[] {
  return externalPlugins;
}

export function listExternalThemes(): ThemeManifest[] {
  return externalThemes;
}

// Reset helpers — wipe the in-memory lists and notify subscribers. Used
// by tests and by the loader's "rescan" path so a fresh load run does
// not double-register the same id.
export function clearExternalPlugins(): void {
  if (externalPlugins.length === 0) return;
  externalPlugins.length = 0;
  notify();
}

export function clearExternalThemes(): void {
  if (externalThemes.length === 0) return;
  externalThemes.length = 0;
  notify();
}

// Shape of the /admin/external.json manifest file. Maintained by the
// upload UI and (optionally) hand-edited by users who drop bundles via
// Flexweg's file manager.
export interface ExternalEntry {
  id: string;
  // Semver of the bundle itself. Surfaced in the admin's plugin/theme
  // list next to the entry. Free-form; not validated.
  version: string;
  // Semver of the FLEXWEG runtime API the bundle was built against.
  // Compared at load time to FLEXWEG_API_VERSION / FLEXWEG_API_MIN_VERSION
  // — incompatible entries are skipped with a console warning.
  apiVersion: string;
  // Path to the bundle's entry JS, relative to the admin root (so the
  // file at /admin/<entryPath> is what the loader dynamically imports).
  // Defaults to `<type>/<id>/bundle.js` when omitted.
  entryPath?: string;
}

export interface ExternalManifest {
  plugins: ExternalEntry[];
  themes: ExternalEntry[];
}

export const EMPTY_EXTERNAL_MANIFEST: ExternalManifest = {
  plugins: [],
  themes: [],
};
