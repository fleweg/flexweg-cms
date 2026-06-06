// Marketplace Core theme — config shape stored at
// `settings.themeConfigs["marketplace-core"]` in Firestore.

export interface MarketplaceHomeConfig {
  heroEyebrow: string;
  heroHeadline: string;
  heroIntro: string;
  // Posts from this category slug feed the "Featured Plugins" section.
  featuredCategorySlug: string;
  featuredHeading: string;
  featuredCount: number;
  // Posts from this category slug feed the "New Themes" section.
  newCategorySlug: string;
  newHeading: string;
  newCount: number;
  // Recently updated section toggle — surfaces the most recently
  // updated posts across all categories.
  showRecentlyUpdated: boolean;
  recentlyUpdatedHeading: string;
  recentlyUpdatedCount: number;
}

export const DEFAULT_MARKETPLACE_HOME: MarketplaceHomeConfig = {
  heroEyebrow: "FLEXWEG MARKETPLACE",
  heroHeadline: "Modern assets for professional creators.",
  heroIntro:
    "Curated themes and plugins for your Flexweg CMS site. Free, open-source, and ready to install.",
  featuredCategorySlug: "plugins",
  featuredHeading: "Featured Plugins",
  featuredCount: 2,
  newCategorySlug: "themes",
  newHeading: "New Themes",
  newCount: 6,
  showRecentlyUpdated: false,
  recentlyUpdatedHeading: "Recently Updated",
  recentlyUpdatedCount: 6,
};

export interface MarketplaceSingleConfig {
  // Section labels — editable so admins can localize without
  // touching i18n bundles.
  descriptionLabel: string;
  specificationsLabel: string;
  featuresLabel: string;
  downloadLabel: string;
  previewLabel: string;
  freeBadgeLabel: string;
  // Toggle Specs / Features blocks default visibility when post
  // body contains the markers. Off = strip from render.
  showSpecs: boolean;
  showFeatures: boolean;
}

export const DEFAULT_MARKETPLACE_SINGLE: MarketplaceSingleConfig = {
  descriptionLabel: "Description",
  specificationsLabel: "Specifications",
  featuresLabel: "Key Features",
  downloadLabel: "Download",
  previewLabel: "Live Preview",
  freeBadgeLabel: "Free",
  showSpecs: true,
  showFeatures: true,
};

export interface MarketplaceSidebarItem {
  // Material Symbols icon name. Optional — leave empty for no icon.
  icon: string;
  label: string;
  href: string;
  // Optional per-language overrides. Keys are 2-letter ISO codes
  // matching `flexweg-multilang`'s `enabledLanguages` entries (e.g.
  // "fr", "de"). When the current rendering locale matches a key,
  // the override label and/or href take over before the locale-prefix
  // step. Missing entries fall back to the primary `label` / `href`.
  //
  // Why we need this for href too (not just label): docs categories
  // have DIFFERENT slugs per language (`/get-started/` ↔ `/demarrer/`,
  // `/install/` ↔ `/installer/`, …). Without the override, the FR
  // sidebar would point at `/fr/get-started/` which 404s. Categories
  // whose slug is identical across languages (e.g. Themes / Plugins)
  // can omit the `href` override and only carry a translated `label`.
  translations?: Record<string, { label?: string; href?: string }>;
}

export interface MarketplaceSidebarConfig {
  heading: string;
  // Top section ("Discover" by default) — Featured / New / Top Rated.
  topItems: MarketplaceSidebarItem[];
  // Categories section heading + items.
  categoriesHeading: string;
  categoriesItems: MarketplaceSidebarItem[];
  // Documentation section heading + items. Optional — leave the items
  // array empty to hide the group entirely.
  docsHeading: string;
  docsItems: MarketplaceSidebarItem[];
  // Per-language overrides for the three group headings. Same shape
  // as MarketplaceSidebarItem.translations but only carrying labels
  // (no href on a heading).
  headingTranslations?: Record<
    string,
    { heading?: string; categoriesHeading?: string; docsHeading?: string }
  >;
}

export const DEFAULT_MARKETPLACE_SIDEBAR: MarketplaceSidebarConfig = {
  heading: "Discover",
  headingTranslations: {
    fr: {
      heading: "Découvrir",
      categoriesHeading: "Catégories",
      docsHeading: "Documentation",
    },
  },
  topItems: [
    { icon: "auto_awesome", label: "Featured", href: "/index.html" },
    { icon: "fiber_new", label: "New", href: "/new.html" },
    { icon: "trending_up", label: "Top Rated", href: "/top.html" },
  ],
  categoriesHeading: "Categories",
  categoriesItems: [
    {
      icon: "palette",
      label: "Themes",
      href: "/themes/index.html",
      translations: { fr: { label: "Thèmes" } },
    },
    { icon: "extension", label: "Plugins", href: "/plugins/index.html" },
    { icon: "shopping_bag", label: "E-commerce", href: "/e-commerce/index.html" },
    { icon: "analytics", label: "Analytics", href: "/analytics/index.html" },
    { icon: "lock", label: "Authentication", href: "/authentication/index.html" },
  ],
  docsHeading: "Documentation",
  docsItems: [
    {
      icon: "rocket_launch",
      label: "Get Started",
      href: "/get-started/index.html",
      translations: { fr: { label: "Démarrer", href: "/demarrer/index.html" } },
    },
    {
      icon: "download",
      label: "Install",
      href: "/install/index.html",
      translations: { fr: { label: "Installer", href: "/installer/index.html" } },
    },
    {
      icon: "edit_note",
      label: "Use",
      href: "/use/index.html",
      translations: { fr: { label: "Utiliser", href: "/utiliser/index.html" } },
    },
    {
      icon: "code",
      label: "Develop",
      href: "/develop/index.html",
      translations: { fr: { label: "Développer", href: "/developper/index.html" } },
    },
    {
      icon: "extension",
      label: "Extend",
      href: "/extend/index.html",
      translations: { fr: { label: "Étendre", href: "/etendre/index.html" } },
    },
  ],
};

export interface MarketplaceFooterConfig {
  // Copyright line. Empty falls back to `© <year> <site title>.`.
  copyright: string;
}

export const DEFAULT_MARKETPLACE_FOOTER: MarketplaceFooterConfig = {
  copyright: "",
};

export interface MarketplaceBrandConfig {
  // Wordmark text for the header / footer brand spot. Default
  // resolves to `settings.title` at render time when empty.
  wordmark: string;
}

export const DEFAULT_MARKETPLACE_BRAND: MarketplaceBrandConfig = {
  wordmark: "",
};

export interface MarketplaceStyleOverrides {
  // Palette overrides — keyed by CSS variable name (e.g.
  // "--color-primary"). Empty map = ship the bundled CSS verbatim.
  vars: Record<string, string>;
  fontHeadline: string;
  fontBody: string;
}

export const DEFAULT_MARKETPLACE_STYLE: MarketplaceStyleOverrides = {
  vars: {},
  fontHeadline: "Hanken Grotesk",
  fontBody: "Inter",
};

export interface MarketplaceThemeConfig {
  home: MarketplaceHomeConfig;
  single: MarketplaceSingleConfig;
  sidebar: MarketplaceSidebarConfig;
  footer: MarketplaceFooterConfig;
  brand: MarketplaceBrandConfig;
  style: MarketplaceStyleOverrides;
}

export const DEFAULT_MARKETPLACE_CONFIG: MarketplaceThemeConfig = {
  home: DEFAULT_MARKETPLACE_HOME,
  single: DEFAULT_MARKETPLACE_SINGLE,
  sidebar: DEFAULT_MARKETPLACE_SIDEBAR,
  footer: DEFAULT_MARKETPLACE_FOOTER,
  brand: DEFAULT_MARKETPLACE_BRAND,
  style: DEFAULT_MARKETPLACE_STYLE,
};
