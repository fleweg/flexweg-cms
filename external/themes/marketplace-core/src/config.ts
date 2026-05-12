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
}

export interface MarketplaceSidebarConfig {
  heading: string;
  // Top section ("Discover" by default) — Featured / New / Top Rated.
  topItems: MarketplaceSidebarItem[];
  // Categories section heading + items.
  categoriesHeading: string;
  categoriesItems: MarketplaceSidebarItem[];
}

export const DEFAULT_MARKETPLACE_SIDEBAR: MarketplaceSidebarConfig = {
  heading: "Discover",
  topItems: [
    { icon: "auto_awesome", label: "Featured", href: "/index.html" },
    { icon: "fiber_new", label: "New", href: "/new.html" },
    { icon: "trending_up", label: "Top Rated", href: "/top.html" },
  ],
  categoriesHeading: "Categories",
  categoriesItems: [
    { icon: "palette", label: "Themes", href: "/themes/index.html" },
    { icon: "extension", label: "Plugins", href: "/plugins/index.html" },
    { icon: "shopping_bag", label: "E-commerce", href: "/e-commerce/index.html" },
    { icon: "analytics", label: "Analytics", href: "/analytics/index.html" },
    { icon: "lock", label: "Authentication", href: "/authentication/index.html" },
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
