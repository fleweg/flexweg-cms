// SQLite backend storage for the external (plugins / themes) registry.
// Persists the manifest as a single row in the local SQLite `config`
// table (key="externalRegistry", value=JSON-encoded manifest). Read
// by the dispatcher in the top-level services/externalRegistryStore.ts.
//
// Reuses the existing `config` table introduced by the SQLite schema
// (see services/flexweg-sqlite/schema.ts). No new table needed — the
// table is already meant for arbitrary key/value config (Flexweg API
// key, etc.); the registry is one more such entry.

import { sqlExec, sqlQuery } from "./client";
import type { ExternalManifest } from "../externalRegistry";

// SQLite config-table key under which the manifest is stored. Picked
// the same name as Firestore's doc id for symmetry; the keyspace is
// separate from Firestore so collisions are impossible.
const CONFIG_KEY = "externalRegistry";

function normaliseManifest(value: unknown): ExternalManifest | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<ExternalManifest>;
  if (!Array.isArray(v.plugins) && !Array.isArray(v.themes)) return null;
  return {
    plugins: Array.isArray(v.plugins) ? v.plugins : [],
    themes: Array.isArray(v.themes) ? v.themes : [],
  };
}

// Reads the SQLite registry row. Returns null when absent (fresh
// install — never written yet) so the dispatcher's orchestration
// falls through to the legacy file / defaults file paths. Bad JSON
// in the row also yields null + a warning, treated as absent.
export async function readBackendRegistry(): Promise<ExternalManifest | null> {
  const { rows } = await sqlQuery<{ value: string }>(
    "SELECT value FROM config WHERE key = ?",
    [CONFIG_KEY],
  );
  if (rows.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rows[0].value);
  } catch (err) {
    console.warn(
      "[external-registry] SQLite row had invalid JSON — treating as empty:",
      err,
    );
    return null;
  }
  return normaliseManifest(parsed);
}

export async function writeBackendRegistry(
  manifest: ExternalManifest,
): Promise<void> {
  const payload = JSON.stringify({
    plugins: manifest.plugins,
    themes: manifest.themes,
  });
  await sqlExec(
    `INSERT INTO config (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [CONFIG_KEY, payload],
  );
}
