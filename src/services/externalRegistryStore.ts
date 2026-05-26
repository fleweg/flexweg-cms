// Backend-agnostic registry of installed external plugins / themes.
//
// This used to live in /admin/external.json on Flexweg, which made
// re-deploys risky — overwriting the file would wipe the admin's
// uninstall state. Moving the runtime registry to the active backend's
// data store (Firestore in Firebase mode, SQLite `config` table in
// SQLite mode) makes the dist/admin/ folder fully re-deployable; only
// the backend holds what's actually loaded.
//
// Storage layout:
//   Backend (Firestore doc OR SQLite config row)  ← mutable, user state
//   /admin/external.default.json                  ← Flexweg file (immutable, built-in baseline)
//   /admin/external.json (legacy)                  ← Flexweg file (one-time migration source)
//
// Read precedence on a cold boot:
//   1. Backend (Firestore/SQLite) — happy path
//   2. Legacy file (pre-Firestore deployments only) — migrates on read
//   3. Defaults file (fresh install) — seeds the backend
// On a fallback to (2) or (3), the result is materialised back into
// the backend so subsequent boots short-circuit at step 1.
//
// IMPORTANT: the backend read/write primitives go through a lazy
// dispatcher (hoisted function wrappers + cached impl). Same pattern
// as services/posts.ts and the other 7 dispatchers — avoids TDZ from
// circular imports via themes/index.ts.

import { getBackendKind } from "../lib/runtimeConfig";
import * as firebaseStore from "./firebase/externalRegistryStore";
import * as sqliteStore from "./flexweg-sqlite/externalRegistryStore";
import {
  EMPTY_EXTERNAL_MANIFEST,
  type ExternalManifest,
} from "./externalRegistry";

// Flexweg paths still relevant to the registry layer:
// - external.default.json: build-time baseline shipped with the admin
//   (used by the "Reinstall bundled defaults" UI and the fresh-install
//   bootstrap path).
// - external.json: legacy registry on Flexweg, used as a one-time
//   migration source for installs that pre-date the Firestore move.
export const DEFAULT_MANIFEST_PATH = "admin/external.default.json";
export const LEGACY_MANIFEST_PATH = "admin/external.json";

// Browser-relative paths for fetching from the document. The loader
// hits these via `fetch()` so it doesn't need the Flexweg API key (the
// files are public). Used in the read fallback chain.
const DEFAULT_MANIFEST_BROWSER_PATH = "external.default.json";
const LEGACY_MANIFEST_BROWSER_PATH = "external.json";

// ─── Backend dispatcher (storage primitives) ─────────────────────────

let _impl: typeof firebaseStore | typeof sqliteStore | null = null;
function impl(): typeof firebaseStore {
  if (!_impl) _impl = getBackendKind() === "flexweg-sqlite" ? sqliteStore : firebaseStore;
  return _impl as typeof firebaseStore;
}

function readBackendRegistry(): Promise<ExternalManifest | null> {
  return impl().readBackendRegistry();
}

function writeBackendRegistry(manifest: ExternalManifest): Promise<void> {
  return impl().writeBackendRegistry(manifest);
}

function normaliseManifest(value: unknown): ExternalManifest | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<ExternalManifest>;
  if (!Array.isArray(v.plugins) && !Array.isArray(v.themes)) return null;
  return {
    plugins: Array.isArray(v.plugins) ? v.plugins : [],
    themes: Array.isArray(v.themes) ? v.themes : [],
  };
}

// Same fetch pattern as externalLoader's old fetchExternalManifest:
// relative URL, no-store, JSON parse. Used to read the legacy and
// default JSON files on Flexweg via the document base URL.
async function fetchManifestFile(
  relativePath: string,
): Promise<ExternalManifest | null> {
  try {
    const res = await fetch(`./${relativePath}?_t=${Date.now()}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    return normaliseManifest(data);
  } catch {
    return null;
  }
}

// Top-level read — the loader and upload UI both go through this.
// Returns the live registry, materialising into the backend when a
// legacy file or default-file fallback is taken so subsequent boots
// short-circuit at the backend step.
export async function readRegistry(): Promise<ExternalManifest> {
  // 1. Backend first — happy path on warm boot.
  let backend: ExternalManifest | null = null;
  try {
    backend = await readBackendRegistry();
  } catch (err) {
    // Permission denied / network error / SQLite token rejected — log
    // and continue to fallback paths so the admin can still bootstrap
    // from the file.
    console.warn("[external-registry] backend read failed:", err);
  }
  if (backend) return backend;

  // 2. Legacy on-disk registry. Pre-Firestore deployments wrote here.
  // Migrate transparently — the read materialises into the backend.
  const legacy = await fetchManifestFile(LEGACY_MANIFEST_BROWSER_PATH);
  if (legacy) {
    await writeBackendRegistry(legacy).catch((err) => {
      console.warn(
        "[external-registry] could not migrate legacy file to backend:",
        err,
      );
    });
    return legacy;
  }

  // 3. Build-time default — fresh install / never-customised admin.
  const defaults = await fetchManifestFile(DEFAULT_MANIFEST_BROWSER_PATH);
  if (defaults) {
    await writeBackendRegistry(defaults).catch((err) => {
      console.warn(
        "[external-registry] could not seed backend from defaults:",
        err,
      );
    });
    return defaults;
  }

  // 4. Nothing found — neither a backend entry, a legacy file nor a
  // defaults file exists. Return empty; the admin boots without any
  // external entries (still valid — only mu-plugins + the bundled
  // default theme are registered).
  return { ...EMPTY_EXTERNAL_MANIFEST };
}

// Writes the manifest to the active backend. Single source of truth
// for runtime state. Called by install / uninstall / reinstall flows.
export async function writeRegistry(manifest: ExternalManifest): Promise<void> {
  await writeBackendRegistry(manifest);
}

// Build-time defaults baseline — read directly from the on-disk file,
// NEVER from the backend. Used by the "Reinstall bundled defaults" UI
// to compute what was originally shipped vs what's currently registered.
export async function readDefaults(): Promise<ExternalManifest> {
  const defaults = await fetchManifestFile(DEFAULT_MANIFEST_BROWSER_PATH);
  return defaults ?? { ...EMPTY_EXTERNAL_MANIFEST };
}
