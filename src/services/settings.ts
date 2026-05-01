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
  enabledPlugins: { "core-seo": true, "flexweg-sitemaps": true, "flexweg-rss": true },
  homeMode: "latest-posts",
  postsPerPage: 10,
  menus: { header: [], footer: [] },
  pluginConfigs: {},
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

// Writes a plugin's config blob. Uses Firestore's nested-map merge so other
// plugins' configs aren't touched. The plugin's own config is replaced
// wholesale by the value passed in — plugins that want to do partial
// updates should read the current value first and merge themselves.
export async function updatePluginConfig<T>(pluginId: string, config: T): Promise<void> {
  await setDoc(
    siteSettingsRef(),
    { pluginConfigs: { [pluginId]: config } },
    { merge: true },
  );
}
