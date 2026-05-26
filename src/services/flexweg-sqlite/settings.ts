// SQLite implementation of the site settings service. Settings live
// as a single JSON blob in the `settings` table under key="site".
// Mirrors the function signatures of services/firebase/settings.ts so
// the top-level dispatcher can swap impls based on backend.
//
// Plugin / theme configs are nested maps inside the settings JSON
// (pluginConfigs[pluginId], themeConfigs[themeId]); updates use a
// read-merge-write semantic — equivalent to Firestore's nested-map
// merge.

import { sqlExec, sqlQuery } from "./client";
import { notifyPotentialChange, subscribeWithPolling } from "./subscriptions";
import { DEFAULT_SITE_SETTINGS } from "../firebase/settings";
import type { SiteSettings } from "../../core/types";

// Re-export for dispatcher transparency.
export { DEFAULT_SITE_SETTINGS };

const SETTINGS_KEY = "site";

function readBlob(value: string | null): Partial<SiteSettings> {
  if (!value) return {};
  try {
    const v = JSON.parse(value);
    return v && typeof v === "object" ? (v as Partial<SiteSettings>) : {};
  } catch {
    return {};
  }
}

async function readRow(): Promise<Partial<SiteSettings>> {
  const { rows } = await sqlQuery<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    [SETTINGS_KEY],
  );
  if (rows.length === 0) return {};
  return readBlob(rows[0].value);
}

async function writeRow(data: Partial<SiteSettings>): Promise<void> {
  await sqlExec(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [SETTINGS_KEY, JSON.stringify(data)],
  );
}

export function subscribeToSettings(
  onChange: (settings: SiteSettings) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    async () => {
      const data = await readRow();
      return { ...DEFAULT_SITE_SETTINGS, ...data };
    },
    onChange,
    onError,
  );
}

export async function getSettings(): Promise<SiteSettings> {
  const data = await readRow();
  return { ...DEFAULT_SITE_SETTINGS, ...data };
}

// Top-level merge — mirrors Firestore's setDoc({...}, { merge: true })
// at the document-root level. Nested maps (pluginConfigs, themeConfigs,
// menus) get overwritten wholesale when present in the patch; callers
// that want to merge inside them must read-merge-write themselves.
//
// Firestore-specific shape: `undefined` was translated to deleteField()
// (i.e. "clear this field"). Here we translate the same to "drop the
// key from the merged blob" since SQLite has no per-field deletion.
export async function updateSettings(patch: Partial<SiteSettings>): Promise<void> {
  const current = await readRow();
  const next: Record<string, unknown> = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      delete next[key];
    } else {
      next[key] = value;
    }
  }
  await writeRow(next as Partial<SiteSettings>);
  notifyPotentialChange();
}

// Mirrors Firestore's nested-map merge on { pluginConfigs: { [id]: cfg } }:
// other plugins' configs are untouched, the named plugin's config is
// replaced wholesale.
export async function updatePluginConfig<T>(pluginId: string, config: T): Promise<void> {
  const current = await readRow();
  const pluginConfigs = { ...(current.pluginConfigs ?? {}) } as Record<string, unknown>;
  pluginConfigs[pluginId] = config;
  await writeRow({ ...current, pluginConfigs });
  notifyPotentialChange();
}

export async function updateThemeConfig<T>(themeId: string, config: T): Promise<void> {
  const current = await readRow();
  const themeConfigs = { ...(current.themeConfigs ?? {}) } as Record<string, unknown>;
  themeConfigs[themeId] = config;
  await writeRow({ ...current, themeConfigs });
  notifyPotentialChange();
}
