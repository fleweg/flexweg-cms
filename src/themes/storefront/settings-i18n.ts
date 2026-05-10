// Storefront theme — settings page strings.
//
// Phase 1 ships English only with stubs covering every tab planned
// across phases 2-7. Phase 8 will translate to fr / de / es / nl /
// pt / ko in matching shape. Keeping the keys exhaustive from the
// start avoids retroactive shape churn.

export const settingsEn = {
  description:
    "Storefront theme settings — manage your storefront appearance, home composition, single-post layout, product defaults, and catalog feature.",
  tabs: {
    home: "Home",
    single: "Product page",
    productDefaults: "Product defaults",
    catalog: "Catalog",
    footer: "Footer",
    logo: "Logo & branding",
    style: "Style",
  },
  buttons: {
    save: "Save & apply",
    saving: "Saving…",
    saved: "Saved",
    forceRegenerate: "Force regenerate",
    regenerating: "Regenerating…",
  },
  vars: {
    background: "Background",
    surface: "Surface",
    surfaceLowest: "Surface — lowest",
    surfaceLow: "Surface — low",
    surfaceMid: "Surface — mid",
    surfaceHigh: "Surface — high",
    onSurface: "Foreground",
    onSurfaceVariant: "Foreground variant",
    outline: "Outline",
    outlineVariant: "Outline variant",
    primary: "Primary",
    onPrimary: "On primary",
    primaryContainer: "Primary container",
    onPrimaryContainer: "On primary container",
    secondary: "Secondary",
    onSecondary: "On secondary",
    secondaryContainer: "Secondary container",
    onSecondaryContainer: "On secondary container",
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Text",
    outlines: "Outlines",
    accent: "Accent",
  },
  font: {
    serif: "Heading font (serif)",
    sans: "Body font (sans)",
  },
  logo: {
    description:
      "Upload a logo to replace the wordmark in the header. Recommended ratio 4:1, transparent PNG / WebP.",
    upload: "Upload logo",
    replace: "Replace logo",
    remove: "Remove logo",
    saved: "Logo updated",
    failed: "Logo upload failed",
    invalidType: "Unsupported file type. Use JPG, PNG, or WebP.",
    removed: "Logo removed",
  },
  catalog: {
    description:
      "When enabled, a public catalog page is automatically published with all your online products. The page lists every product and ships with client-side filtering.",
    enabled: "Enable catalog",
    enabledHelp:
      "When on, the catalog page is regenerated on every publish and a link is added to the menu (configurable below).",
    slug: "Page slug",
    slugHelp:
      "Path on your public site, relative to the root. Example: catalog.html or shop/catalog.html.",
    pageTitle: "Page title",
    pageHeading: "Page heading",
    pageSubtitle: "Page subtitle",
    addToMenu: "Add to header menu",
    menuLabel: "Menu label",
    filtersHeading: "Filters",
    showSearch: "Show search bar",
    showCategoryFilter: "Show category filter",
    showTagFilter: "Show tag filter",
    showPriceRange: "Show price range",
    showStockFilter: "Show stock filter",
    showSortBy: "Show sort dropdown",
    initialColumns: "Default columns",
    forceRegenerate: "Force regenerate catalog & JSON",
    forceRegenerateHelp:
      "Re-renders the catalog page and the products.json blob. Use after large content changes if anything looks stale.",
    lastGenerated: "Last regenerated",
    never: "Never",
  },
  productDefaults: {
    description:
      "Site-wide defaults used when a product page doesn't specify its own values. Lets you change currency and CTA once for all products.",
    currency: "Currency code (ISO 4217)",
    ctaLabel: "CTA label",
    ctaHref: "CTA target",
    inquiryOnly: "Inquiry-only mode (hide prices)",
  },
  home: {
    description:
      "The storefront home page composes the hero, curated collections, trending products, and the journal feature. Each section can be toggled independently.",
    showHero: "Show hero",
    bento: {
      heading: "Curated collections (bento)",
      enabled: "Show curated collections",
      eyebrow: "Eyebrow",
      title: "Title",
      subtitle: "Subtitle",
      viewAllLabel: "View-all label",
      viewAllHref: "View-all link",
      cardsHeading: "Bento cards",
    },
    trending: {
      heading: "Trending products",
      enabled: "Show trending products",
      eyebrow: "Eyebrow",
      title: "Title",
      mode: "Source",
      modeAll: "All products (newest first)",
      modeCategory: "Single category",
      categoryId: "Category",
      count: "Number of products",
    },
    categoryRows: {
      heading: "Category rows",
      description:
        "Add as many per-category product rows as you want. Each surfaces N products from a single category, in a 4-col grid or a horizontal slider. Rows render in order under the trending row.",
      add: "Add row",
      remove: "Remove",
      moveUp: "Move up",
      moveDown: "Move down",
      count: "{{count}} rows",
      row: "Row {{index}}",
      enabled: "Show this row",
      eyebrow: "Eyebrow",
      title: "Title",
      allProducts: "All categories",
      layoutGrid: "Grid (4 cols)",
      layoutSlider: "Horizontal slider",
      viewAllLabel: "View-all label (optional)",
      viewAllHref: "View-all link (auto from category if empty)",
    },
    journal: {
      heading: "Journal feature",
      enabled: "Show journal feature",
      imageUrl: "Image URL",
      imageAlt: "Image alt",
      eyebrow: "Eyebrow",
      title: "Title",
      titleItalicTail: "Italic tail",
      subtitle: "Subtitle",
      ctaLabel: "CTA label",
      ctaHref: "CTA link",
    },
    storeInfo: {
      heading: "Our shop",
      enabled: "Show shop info section",
      eyebrow: "Eyebrow",
      title: "Title",
      imageUrl: "Photo URL",
      imageHelp:
        "Photo of your shop interior or storefront. Empty renders a stylized map placeholder.",
      imageAlt: "Image alt",
      addressLabel: "Address heading",
      address: "Address",
      addressHelp: "One line per row — line breaks render as <br>.",
      hoursLabel: "Hours heading",
      hours: "Hours",
      hoursHelp: "One opening row per line.",
      ctaLabel: "CTA label",
      ctaHref: "CTA link",
      ctaHelp: "Typically a Google Maps directions URL.",
    },
    reviews: {
      heading: "Customer reviews",
      enabled: "Show reviews carousel",
    },
  },
  single: {
    description:
      "Single-product page layout. Toggle the related-products row, the author bio, and the care-kit sidebar.",
    showAuthorBio: "Show author bio",
    showRelatedProducts: "Show related products",
    relatedTitle: "Related products heading",
    showCareKit: "Show care kit",
    careKitTitle: "Care-kit title",
    careKitDescription: "Care-kit description",
    careKitItems: "Care-kit items",
  },
  footer: {
    description: "Footer composition.",
    showSocials: "Show socials row",
    tagline: "Brand tagline",
    taglineHelp:
      "Displayed under the wordmark. Empty falls back to the site description from /settings/general.",
  },
  bottomNav: {
    description: "Mobile bottom navigation bar (visible only on small viewports).",
    enabled: "Show bottom nav",
    items: "Items",
  },
};

export const settingsFr = settingsEn;
export const settingsDe = settingsEn;
export const settingsEs = settingsEn;
export const settingsNl = settingsEn;
export const settingsPt = settingsEn;
export const settingsKo = settingsEn;
