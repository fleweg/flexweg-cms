// Firestore-backed registry of installed external plugins / themes.
//
// This used to live in /admin/external.json on Flexweg, which made
// re-deploys risky — overwriting the file would wipe the admin's
// uninstall state. By moving the runtime registry to Firestore, the
// dist/admin/ folder becomes fully re-deployable; only Firestore holds
// what's actually loaded.
//
// Storage layout:
//   /settings/externalRegistry        ← Firestore doc (mutable, user state)
//   /admin/external.default.json       ← Flexweg file (immutable, built-in baseline)
//   /admin/external.json (legacy)      ← Flexweg file (one-time migration source)
//
// Read precedence on a cold boot: Firestore → legacy file → defaults.
// The first read materialises the result back into Firestore so future
// boots short-circuit there.

import { doc, getDoc, setDoc } from "firebase/firestore";
import { collections, getDb } from "./firebase";
import {
  EMPTY_EXTERNAL_MANIFEST,
  type ExternalManifest,
} from "./externalRegistry";

// Firestore doc id under `settings/`. Living next to settings/site
// keeps the Firestore rules trivial — `match /settings/{docId}` already
// allows editor read+write.
export const EXTERNAL_REGISTRY_DOC_ID = "externalRegistry";

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

function registryDocRef() {
  return doc(getDb(), collections.settings, EXTERNAL_REGISTRY_DOC_ID);
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

// Reads the Firestore registry doc. Returns null when absent —
// callers fall back to legacy / defaults. Errors propagate so the
// loader can decide whether to retry or proceed with empty.
async function readFirestoreRegistry(): Promise<ExternalManifest | null> {
  const snap = await getDoc(registryDocRef());
  if (!snap.exists()) return null;
  return normaliseManifest(snap.data());
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
// Returns the live registry, materialising into Firestore when a
// legacy file or default-file fallback is taken so subsequent boots
// short-circuit at the Firestore step.
export async function readRegistry(): Promise<ExternalManifest> {
  // 1. Firestore first — happy path on warm boot.
  let firestore: ExternalManifest | null = null;
  try {
    firestore = await readFirestoreRegistry();
  } catch (err) {
    // Permission denied / network error — log and continue to
    // fallback paths so the admin can still bootstrap from the file.
    console.warn("[external-registry] Firestore read failed:", err);
  }
  if (firestore) return firestore;

  // 2. Legacy on-disk registry. Pre-Firestore deployments wrote here.
  // Migrate transparently — the read materialises into Firestore.
  const legacy = await fetchManifestFile(LEGACY_MANIFEST_BROWSER_PATH);
  if (legacy) {
    await writeRegistry(legacy).catch((err) => {
      console.warn(
        "[external-registry] could not migrate legacy file to Firestore:",
        err,
      );
    });
    return legacy;
  }

  // 3. Build-time default — fresh install / never-customised admin.
  const defaults = await fetchManifestFile(DEFAULT_MANIFEST_BROWSER_PATH);
  if (defaults) {
    await writeRegistry(defaults).catch((err) => {
      console.warn(
        "[external-registry] could not seed Firestore from defaults:",
        err,
      );
    });
    return defaults;
  }

  // 4. Nothing found — neither a Firestore doc, a legacy file nor a
  // defaults file exists. Return empty; the admin boots without any
  // external entries (still valid — only mu-plugins + the bundled
  // default theme are registered).
  return { ...EMPTY_EXTERNAL_MANIFEST };
}

// Writes the manifest to Firestore. Single source of truth for
// runtime state. Called by install / uninstall / reinstall flows.
export async function writeRegistry(manifest: ExternalManifest): Promise<void> {
  await setDoc(registryDocRef(), {
    plugins: manifest.plugins,
    themes: manifest.themes,
  });
}

// Build-time defaults baseline — read directly from the on-disk file,
// NEVER from Firestore. Used by the "Reinstall bundled defaults" UI
// to compute what was originally shipped vs what's currently registered.
export async function readDefaults(): Promise<ExternalManifest> {
  const defaults = await fetchManifestFile(DEFAULT_MANIFEST_BROWSER_PATH);
  return defaults ?? { ...EMPTY_EXTERNAL_MANIFEST };
}
