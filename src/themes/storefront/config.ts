// Storefront theme config shape. Stored at
// `settings.themeConfigs.storefront` in Firestore; merged with these
// defaults by ThemeSettingsRoute before being handed to the settings
// page.
//
// Two home composition modes coexist (same as corporate):
//
//   1. Static-page mode (advanced) — `settings.homeMode = "static-page"`
//      points at a `page` whose markdown body is composed of theme
//      blocks. The HomeTemplate dumps the rendered body verbatim.
//
//   2. Default mode — the home renders the configured hero +
//      categories bento + trending products grid + journal feature.
//      Editable from the Home tab. Defaults seed credible placeholder
//      content so a fresh install reads as a credible storefront on
//      the first publish.

import { DEFAULT_STYLE, type StyleOverrides } from "./style";

// ─── Hero (home) ─────────────────────────────────────────────────
// Same shape the storefront/hero-overlay block consumes — HomeTemplate
// passes this verbatim to renderHeroOverlay() at publish time.
export interface StorefrontHeroAttrs {
  imageUrl?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  titleItalicTail?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

// ─── Categories bento (home) ─────────────────────────────────────
// Editable bento grid of "curated collections" — 4 cards in a 2x2
// layout (8/4 + 4/8 split) on desktop, stacked on mobile.
export interface StorefrontBentoCard {
  imageUrl: string;
  imageAlt: string;
  label: string;
  ctaLabel: string;
  ctaHref: string;
  // Visual span — large cards take 8 cols, small ones 4 cols. Two of
  // each per row delivers the bento rhythm from the mockup.
  size: "large" | "small";
}

export interface StorefrontBentoConfig {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  viewAllLabel: string;
  viewAllHref: string;
  cards: StorefrontBentoCard[];
}

// ─── Trending products (home) ────────────────────────────────────
// 4-column grid of latest product cards. Source: either the entire
// post corpus (newest first) or a single category.
export type TrendingProductsMode = "all" | "category";

export interface StorefrontTrendingProductsConfig {
  enabled: boolean;
  eyebrow: string;
  title: string;
  mode: TrendingProductsMode;
  categoryId: string;
  count: number;
}

// ─── Per-category product rows (home) ────────────────────────────
// Stacked sections under the trending row. Each row surfaces N
// products from a single category, in either a 4-col grid or a
// horizontal slider with chevron arrows. Admins add as many rows as
// they want from /theme-settings → Home → Category rows.
export type CategoryRowLayout = "grid" | "slider";

export interface StorefrontCategoryRow {
  enabled: boolean;
  eyebrow: string;
  title: string;
  // Required — empty falls back to "all online posts" (acts as a
  // generic "latest products" row).
  categoryId: string;
  count: number;
  layout: CategoryRowLayout;
  // "View all" link rendered next to the title. Empty href falls
  // back to the resolved category URL when categoryId is set.
  viewAllLabel: string;
  viewAllHref: string;
}

// ─── Journal feature (home) ──────────────────────────────────────
// Image + copy + CTA pair below the trending grid. Same shape and
// editor convention as the hero.
export interface StorefrontJournalConfig {
  enabled: boolean;
  imageUrl: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleItalicTail: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

// ─── Store info (home — physical shop info) ─────────────────────
// 2-column section near the bottom of the home: a photo / map
// placeholder on one side and address + hours + directions CTA on
// the other. Useful for sites tied to a physical location.
export interface StorefrontStoreInfoConfig {
  enabled: boolean;
  eyebrow: string;
  title: string;
  // Photo of the shop. Empty = renders a stylized "View map"
  // placeholder card with a location pin (matches the mockup).
  imageUrl: string;
  imageAlt: string;
  addressLabel: string;
  // Multi-line address. \n in the value renders as <br>.
  address: string;
  hoursLabel: string;
  // One line per row, e.g. "Mon - Fri: 9:00 - 19:00".
  hours: string[];
  // CTA — typically a Google Maps directions URL. Empty hides the
  // button.
  ctaLabel: string;
  ctaHref: string;
}

// ─── Reviews (home — optional carousel) ──────────────────────────
export interface StorefrontReview {
  authorInitials: string;
  authorName: string;
  authorRole: string;
  rating: number;
  text: string;
  dateLabel: string;
}

export interface StorefrontReviewsHomeConfig {
  enabled: boolean;
  eyebrow: string;
  title: string;
  items: StorefrontReview[];
}

export interface StorefrontHomeConfig {
  showHero: boolean;
  hero: StorefrontHeroAttrs;
  bento: StorefrontBentoConfig;
  trending: StorefrontTrendingProductsConfig;
  // Additional per-category product rows rendered below trending.
  // Stack as many as you need — each surfaces N products from a
  // single category, grid or slider layout.
  categoryRows: StorefrontCategoryRow[];
  storeInfo: StorefrontStoreInfoConfig;
  journal: StorefrontJournalConfig;
  reviews: StorefrontReviewsHomeConfig;
}

// ─── Single (product) ────────────────────────────────────────────
export interface StorefrontSingleConfig {
  showAuthorBio: boolean;
  showRelatedProducts: boolean;
  relatedTitle: string;
  showCareKit: boolean;
  careKitTitle: string;
  careKitDescription: string;
  careKitItems: string[];
}

// ─── Product defaults ────────────────────────────────────────────
// Values used when the product-info block is missing fields. Lets
// admins set a site-wide currency / delivery default once.
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "on-order";

export interface StorefrontProductDefaults {
  currency: string;
  ctaLabel: string;
  ctaHref: string;
  // Toggle the inquiry-only mode (no prices shown anywhere) for
  // sites that prefer "request a quote" UX. Useful for high-end
  // bespoke arrangements where the price isn't fixed.
  inquiryOnly: boolean;
}

// ─── Catalog feature (Phase 6) ───────────────────────────────────
export interface StorefrontCatalogFilters {
  showSearch: boolean;
  showCategoryFilter: boolean;
  showTagFilter: boolean;
  showPriceRange: boolean;
  showStockFilter: boolean;
  showSortBy: boolean;
}

export interface StorefrontCatalogConfig {
  enabled: boolean;
  // Slug — relative to the site root, sans leading "/". Default
  // "catalog.html". Validated by the settings page (no leading
  // slash, no spaces, must end in `.html`).
  slug: string;
  pageTitle: string;
  pageHeading: string;
  pageSubtitle: string;
  // When true, the storefront theme's menu.json.resolved filter
  // appends an entry pointing at the catalog page so admins don't
  // have to wire it up in MenusPage.
  addToMenu: boolean;
  menuLabel: string;
  filters: StorefrontCatalogFilters;
  initialColumns: 2 | 3 | 4;
  // Tracking — last successful path the catalog was uploaded to.
  // Used by the catalog publisher to delete the old file when the
  // user changes the slug. Same pattern as Post.lastPublishedPath.
  lastPublishedPath: string;
  // Milliseconds since epoch — last time products.json was
  // regenerated. Surface in the settings page for transparency.
  jsonLastGeneratedAt: number;
}

// ─── Footer ──────────────────────────────────────────────────────
export interface StorefrontFooterConfig {
  showSocials: boolean;
  // Brand tagline displayed under the wordmark in the footer's
  // first column. Empty = falls back to settings.description.
  tagline: string;
}

// ─── Master config ───────────────────────────────────────────────
export interface StorefrontThemeConfig {
  // Logo upload tracking — same convention as corporate / magazine.
  logoEnabled: boolean;
  logoUpdatedAt: number;
  style: StyleOverrides;
  home: StorefrontHomeConfig;
  single: StorefrontSingleConfig;
  productDefaults: StorefrontProductDefaults;
  catalog: StorefrontCatalogConfig;
  footer: StorefrontFooterConfig;
}

// ─── Default Unsplash images ─────────────────────────────────────
// Stable URLs hosted by Unsplash — admins almost certainly want to
// swap these for their own. Keeps the first publish credible.
const DEFAULT_HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1920&q=80";
const DEFAULT_BENTO_IMAGE_1 =
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_BENTO_IMAGE_2 =
  "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=800&q=80";
const DEFAULT_BENTO_IMAGE_3 =
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80";
const DEFAULT_BENTO_IMAGE_4 =
  "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_JOURNAL_IMAGE_URL =
  "https://images.unsplash.com/photo-1490598000245-075175152d25?auto=format&fit=crop&w=1200&q=80";

export const DEFAULT_STOREFRONT_HERO: StorefrontHeroAttrs = {
  imageUrl: DEFAULT_HERO_IMAGE_URL,
  imageAlt: "Curated bouquet on a soft cream backdrop",
  eyebrow: "Sustainable & seasonal",
  title: "Artistry in every",
  titleItalicTail: "living stem.",
  subtitle:
    "Curated seasonal arrangements and rare botanicals delivered from the garden directly to your sanctuary.",
  primaryCtaLabel: "Explore the collection",
  primaryCtaHref: "/catalog.html",
  secondaryCtaLabel: "Our story",
  secondaryCtaHref: "/about.html",
};

export const DEFAULT_STOREFRONT_BENTO: StorefrontBentoConfig = {
  enabled: true,
  eyebrow: "",
  title: "Curated collections",
  subtitle: "Selected by our master florists for every occasion.",
  viewAllLabel: "View all categories",
  viewAllHref: "/catalog.html",
  cards: [
    {
      imageUrl: DEFAULT_BENTO_IMAGE_1,
      imageAlt: "Seasonal bouquet on a marble surface",
      label: "Seasonal blooms",
      ctaLabel: "Shop now",
      ctaHref: "/seasonal/index.html",
      size: "large",
    },
    {
      imageUrl: DEFAULT_BENTO_IMAGE_2,
      imageAlt: "Dried pampas grass in a terracotta vessel",
      label: "Everlasting",
      ctaLabel: "Shop now",
      ctaHref: "/dried/index.html",
      size: "small",
    },
    {
      imageUrl: DEFAULT_BENTO_IMAGE_3,
      imageAlt: "Cut flowers on linen",
      label: "Floral rituals",
      ctaLabel: "Subscribe",
      ctaHref: "/subscriptions/index.html",
      size: "small",
    },
    {
      imageUrl: DEFAULT_BENTO_IMAGE_4,
      imageAlt: "Rare architectural botanicals",
      label: "Rare & unusual",
      ctaLabel: "Explore",
      ctaHref: "/rare/index.html",
      size: "large",
    },
  ],
};

export const DEFAULT_STOREFRONT_TRENDING: StorefrontTrendingProductsConfig = {
  enabled: true,
  eyebrow: "Trending now",
  title: "Staff favorites for the season",
  mode: "all",
  categoryId: "",
  count: 4,
};

export const DEFAULT_STOREFRONT_JOURNAL: StorefrontJournalConfig = {
  enabled: true,
  imageUrl: DEFAULT_JOURNAL_IMAGE_URL,
  imageAlt: "Open botanical journal on a wooden table",
  eyebrow: "The journal",
  title: "Cultivating a",
  titleItalicTail: "meaningful life",
  subtitle:
    "From care tips for your rare botanicals to the history of floral language, our journal explores the deep connection between people and plants.",
  ctaLabel: "Read the journal",
  ctaHref: "/journal.html",
};

// Pre-filled with placeholder values so a fresh install reads as a
// credible shop info card on first publish — the editor replaces
// each field from /theme-settings → Home → Our shop. Image stays
// empty by default so the on-brand sage placeholder renders.
export const DEFAULT_STOREFRONT_STORE_INFO: StorefrontStoreInfoConfig = {
  enabled: true,
  eyebrow: "Visit us",
  title: "Our shop",
  imageUrl: "",
  imageAlt: "",
  addressLabel: "Address",
  address: "12 rue de l'Exemple\n75001 Paris, France",
  hoursLabel: "Hours",
  hours: [
    "Mon – Fri: 9:00 – 19:00",
    "Sat: 10:00 – 18:00",
    "Sun: Closed",
  ],
  ctaLabel: "Get directions",
  ctaHref: "https://maps.google.com/?q=12+rue+de+l%27Exemple+75001+Paris",
};

export const DEFAULT_STOREFRONT_REVIEWS: StorefrontReviewsHomeConfig = {
  enabled: false,
  eyebrow: "",
  title: "What our clients say",
  items: [
    {
      authorInitials: "ES",
      authorName: "Eleanor S.",
      authorRole: "Verified collector",
      rating: 5,
      text: "The bouquet arrived perfectly hydrated and lasted nearly two weeks. A true sensory experience.",
      dateLabel: "",
    },
    {
      authorInitials: "JM",
      authorName: "Julian M.",
      authorRole: "Verified collector",
      rating: 5,
      text: "Stunning arrangement. The eucalyptus smells divine. It felt like a piece of high-end art for my dining room.",
      dateLabel: "",
    },
  ],
};

// Default per-category rows — empty out of the box. Admins add
// rows from /theme-settings → Home → "Category rows".
export const DEFAULT_STOREFRONT_CATEGORY_ROWS: StorefrontCategoryRow[] = [];

export const DEFAULT_STOREFRONT_HOME: StorefrontHomeConfig = {
  showHero: true,
  hero: DEFAULT_STOREFRONT_HERO,
  bento: DEFAULT_STOREFRONT_BENTO,
  trending: DEFAULT_STOREFRONT_TRENDING,
  categoryRows: DEFAULT_STOREFRONT_CATEGORY_ROWS,
  storeInfo: DEFAULT_STOREFRONT_STORE_INFO,
  journal: DEFAULT_STOREFRONT_JOURNAL,
  reviews: DEFAULT_STOREFRONT_REVIEWS,
};

export const DEFAULT_STOREFRONT_SINGLE: StorefrontSingleConfig = {
  showAuthorBio: false,
  showRelatedProducts: true,
  relatedTitle: "",
  showCareKit: true,
  careKitTitle: "Care kit",
  careKitDescription:
    "Every order includes our signature preservation packet and a curated care guide so your arrangement thrives.",
  careKitItems: [
    "Trimming guide",
    "Organic nutrient food",
    "Cold-chain transport guarantee",
  ],
};

export const DEFAULT_STOREFRONT_PRODUCT_DEFAULTS: StorefrontProductDefaults = {
  currency: "EUR",
  ctaLabel: "Add to basket",
  ctaHref: "/contact.html",
  inquiryOnly: false,
};

export const DEFAULT_STOREFRONT_CATALOG: StorefrontCatalogConfig = {
  enabled: true,
  slug: "catalog.html",
  pageTitle: "Catalog",
  pageHeading: "Our complete catalog",
  pageSubtitle:
    "Browse every arrangement, filter by category or stock status, and find the right botanical for your space.",
  addToMenu: true,
  menuLabel: "Catalog",
  filters: {
    showSearch: true,
    showCategoryFilter: true,
    showTagFilter: true,
    showPriceRange: true,
    showStockFilter: true,
    showSortBy: true,
  },
  initialColumns: 3,
  lastPublishedPath: "",
  jsonLastGeneratedAt: 0,
};

export const DEFAULT_STOREFRONT_FOOTER: StorefrontFooterConfig = {
  showSocials: true,
  tagline: "",
};

export const DEFAULT_STOREFRONT_CONFIG: StorefrontThemeConfig = {
  logoEnabled: false,
  logoUpdatedAt: 0,
  style: DEFAULT_STYLE,
  home: DEFAULT_STOREFRONT_HOME,
  single: DEFAULT_STOREFRONT_SINGLE,
  productDefaults: DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
  catalog: DEFAULT_STOREFRONT_CATALOG,
  footer: DEFAULT_STOREFRONT_FOOTER,
};
