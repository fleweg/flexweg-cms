import { deleteField, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { collections, getDb, settingsDocs } from "./firebase";
import type { SiteSettings } from "../core/types";

const siteSettingsRef = () => doc(getDb(), collections.settings, settingsDocs.site);

// Defaults applied on first read. Stored back to Firestore as soon as an
// admin opens the Settings page so the settings doc exists for rules.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  title: "My site",
  description: "",
  language: "en",
  baseUrl: "",
  activeThemeId: "default",
  enabledPlugins: { "core-seo": true },
  homeMode: "latest-posts",
  postsPerPage: 10,
  menus: { header: [], footer: [] },
};

export function subscribeToSettings(
  onChange: (settings: SiteSettings) => void,
  onError?: (err: Error) => void,
): () => void {
  return onSnapshot(
    siteSettingsRef(),
    (snap) => {
      const data = snap.data() as Partial<SiteSettings> | undefined;
      onChange({ ...DEFAULT_SITE_SETTINGS, ...(data ?? {}) });
    },
    onError,
  );
}

export async function getSettings(): Promise<SiteSettings> {
  const snap = await getDoc(siteSettingsRef());
  const data = snap.exists() ? (snap.data() as Partial<SiteSettings>) : {};
  return { ...DEFAULT_SITE_SETTINGS, ...data };
}

export async function updateSettings(patch: Partial<SiteSettings>): Promise<void> {
  // Firestore rejects `undefined` values. Callers commonly pass an
  // optional field set to `undefined` to mean "clear this field" — translate
  // that into deleteField() so setDoc({ merge: true }) actually removes the
  // key instead of throwing.
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    sanitized[key] = value === undefined ? deleteField() : value;
  }
  await setDoc(siteSettingsRef(), sanitized, { merge: true });
}
