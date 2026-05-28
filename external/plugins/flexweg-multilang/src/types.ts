// Plugin-specific types. Kept in one file so the multilang code reads
// cleanly without cross-file type chasing.

export interface PostTranslation {
  slug: string;
  title: string;
  contentMarkdown: string;
  excerpt?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

export interface TermTranslation {
  slug: string;
  name: string;
  description?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

// Per-site configuration stored in settings.pluginConfigs["flexweg-multilang"].
export interface MultilangConfig {
  // The site's primary language. Pages in this language live at the
  // root (e.g. `news/hello.html`). Defaults to settings.language on
  // first install and may be reassigned by the admin.
  primaryLanguage: string;
  // Additional languages the site publishes. Listed in display order.
  // Each language must be a BCP-47-ish code ("en", "fr", "es-MX").
  enabledLanguages: string[];
  // Per-language home page id. When set + the corresponding post has
  // status "online", the home page in this language renders the
  // page's content (same mechanism as homeMode === "static-page").
  // Optional — missing entry falls back to a basic latest-posts list.
  homePages?: Record<string, string>;
  // Per-language label overrides for menu items. Keyed by menu item
  // id then by language. Items without an override fall back to the
  // primary-language label from settings.menus.
  menuTranslations?: Record<string, Record<string, { label: string }>>;
  // Language-switcher controls. Both default to header-on + footer-
  // off; admins can toggle in the settings page. Switchers render
  // ONLY when at least one secondary language is enabled — there's
  // nothing to switch to on a mono-lingual site, so the controls
  // are hidden entirely in that case regardless of these flags.
  showHeaderSwitcher?: boolean;
  showFooterSwitcher?: boolean;
}

export const DEFAULT_MULTILANG_CONFIG: MultilangConfig = {
  primaryLanguage: "en",
  enabledLanguages: [],
  homePages: {},
  menuTranslations: {},
  showHeaderSwitcher: true,
  showFooterSwitcher: false,
};

export const PLUGIN_ID = "flexweg-multilang";
