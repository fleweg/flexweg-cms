// Magazine theme config shape. Stored at
// `settings.themeConfigs.magazine` in Firestore; merged with these
// defaults by ThemeSettingsRoute before being handed to the settings
// page.

import { DEFAULT_STYLE, type StyleOverrides } from "./style";

export type MagazineSidebarVariant = "most-read" | "promo" | "none";

// Layout choices for the home page. The publisher reads this and
// renders the matching block render functions, which the home template
// then arranges into the magazine 8/4 grid layout.
export interface MagazineHomeLayoutConfig {
  // Number of items in the Most Read sidebar widget. Range 1–10.
  mostReadCount: number;
  // Which sidebar widget(s) to render. "promo" requires the four
  // promoCard fields below to be filled; otherwise the slot is hidden.
  sidebarTop: MagazineSidebarVariant;
  sidebarBottom: MagazineSidebarVariant;
  // Promo card fields, used when either sidebar slot is set to "promo".
  // Manual entry — kept on the theme config rather than as a block on
  // the home page because the home page on the magazine theme has no
  // editable Markdown body to host blocks.
  promoImageUrl: string;
  promoImageAlt: string;
  promoEyebrow: string;
  promoTitle: string;
  promoHref: string;
}

export const DEFAULT_MAGAZINE_HOME_LAYOUT: MagazineHomeLayoutConfig = {
  mostReadCount: 4,
  sidebarTop: "most-read",
  sidebarBottom: "promo",
  promoImageUrl: "",
  promoImageAlt: "",
  promoEyebrow: "",
  promoTitle: "",
  promoHref: "",
};

// Header silhouette. The mockup default is "centered" (wordmark
// absolutely centered in the header bar, burger left, search right).
// "left" stacks burger + brand inline on the left, search on the
// right — useful for sites with a longer publication name.
export type MagazineBrandPosition = "centered" | "left";

export interface MagazineHeaderConfig {
  brandPosition: MagazineBrandPosition;
  // Whether to show the search trigger button. Hidden when the
  // flexweg-search plugin is disabled — though the trigger stays
  // inert without the plugin, hiding it removes a non-functional
  // affordance from the UI.
  showSearch: boolean;
}

export const DEFAULT_MAGAZINE_HEADER: MagazineHeaderConfig = {
  brandPosition: "centered",
  showSearch: true,
};

export interface MagazineThemeConfig {
  // Whether a logo has been uploaded. The header swaps the text
  // wordmark for the image when this is true.
  logoEnabled: boolean;
  // Milliseconds since epoch of the last logo upload — used as a
  // cache-bust query in the public-side logo URL.
  logoUpdatedAt: number;
  // CSS variable overrides + chosen Google Fonts. Empty / defaults
  // leave the baseline CSS untouched; custom values produce a
  // regenerated `theme-assets/magazine.css` with an override `:root`
  // block appended and the right Google Fonts URL imported.
  style: StyleOverrides;
  // Home page layout. Drives the publisher's per-theme home rendering
  // branch (services/publisher.ts).
  home: MagazineHomeLayoutConfig;
  // Header silhouette tweaks (logo position, search visibility).
  header: MagazineHeaderConfig;
}

export const DEFAULT_MAGAZINE_CONFIG: MagazineThemeConfig = {
  logoEnabled: false,
  logoUpdatedAt: 0,
  style: DEFAULT_STYLE,
  home: DEFAULT_MAGAZINE_HOME_LAYOUT,
  header: DEFAULT_MAGAZINE_HEADER,
};
