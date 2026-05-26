// Firebase backend storage for the external (plugins / themes) registry.
// Persists the manifest as a single Firestore document at
// `settings/externalRegistry`. Read by the dispatcher in the top-level
// services/externalRegistryStore.ts.

import { doc, getDoc, setDoc } from "firebase/firestore";
import { collections, getDb } from "../firebaseClient";
import type { ExternalManifest } from "../externalRegistry";

// Firestore doc id under `settings/`. Living next to settings/site
// keeps the Firestore rules trivial — `match /settings/{docId}` already
// allows editor read+write.
export const EXTERNAL_REGISTRY_DOC_ID = "externalRegistry";

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
export async function readBackendRegistry(): Promise<ExternalManifest | null> {
  const snap = await getDoc(registryDocRef());
  if (!snap.exists()) return null;
  return normaliseManifest(snap.data());
}

export async function writeBackendRegistry(
  manifest: ExternalManifest,
): Promise<void> {
  await setDoc(registryDocRef(), {
    plugins: manifest.plugins,
    themes: manifest.themes,
  });
}
