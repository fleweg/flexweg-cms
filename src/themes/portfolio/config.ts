// Portfolio theme — config shape stored at
// `settings.themeConfigs.portfolio` in Firestore. Defaults are merged
// in by ThemeSettingsRoute before handing to the settings page.

import { DEFAULT_STYLE, type StyleOverrides } from "./style";

// Home grid variant. The 3 mockup variants from DESIGN.md:
//  - "staggered": 4-col grid with vertical offsets (the marquee home_desktop look)
//  - "masonry": 12-col masonry, cards span 3 or 6 (home_masonry_grid_desktop)
//  - "standard": uniform 4-col grid, no offsets, no masonry
export type PortfolioHomeVariant = "staggered" | "masonry" | "standard";

export interface PortfolioHomeConfig {
  // Hero text section — large display headline + intro paragraph.
  // Visible above the project grid. Both empty → block hidden.
  heroHeadline: string;
  heroIntro: string;

  // Project grid behavior.
  variant: PortfolioHomeVariant;
  // Max cards on the home grid. 0 = no cap (all online posts).
  cardLimit: number;

  // Filter chips above the grid — sourced from `terms` (categories).
  // When on, the client-side `filters-loader.js` toggles card
  // visibility by `data-cms-category`.
  showFilters: boolean;
}

export const DEFAULT_PORTFOLIO_HOME: PortfolioHomeConfig = {
  heroHeadline: "Curated space for architectural photography and experimental design.",
  heroIntro:
    "A boutique studio specializing in the intersection of physical space and digital identity. Quiet, confident experiences for brands that value structural integrity and timeless aesthetics.",
  variant: "staggered",
  cardLimit: 12,
  showFilters: false,
};

export interface PortfolioSingleConfig {
  // Toggle the full-bleed grayscale hero. When off, the hero collapses
  // to a contained image at the top of the body.
  showHero: boolean;
  // Toggle the next-project teaser at the bottom of every single page.
  showNextProject: boolean;
  // Default "services" labels shown on every project's left meta col
  // when the post doesn't carry its own portfolio/project-meta block.
  defaultServicesLabel: string;
  defaultYearLabel: string;
  defaultAwardsLabel: string;
}

export const DEFAULT_PORTFOLIO_SINGLE: PortfolioSingleConfig = {
  showHero: true,
  showNextProject: true,
  defaultServicesLabel: "SERVICES",
  defaultYearLabel: "YEAR",
  defaultAwardsLabel: "AWARDS",
};

export interface PortfolioAuthorConfig {
  // Toggle the Select Experience list block on author archives. Off
  // hides the section entirely.
  showExperience: boolean;
  // Toggle the Recognition list block.
  showRecognition: boolean;
}

export const DEFAULT_PORTFOLIO_AUTHOR: PortfolioAuthorConfig = {
  showExperience: true,
  showRecognition: true,
};

export interface PortfolioFooterConfig {
  // Copyright line. Empty → falls back to `© <year> <site title>.`.
  copyright: string;
}

export const DEFAULT_PORTFOLIO_FOOTER: PortfolioFooterConfig = {
  copyright: "",
};

// Wordmark for the header + footer. Default falls back to
// `settings.title.toUpperCase()` at render time when empty here.
export interface PortfolioBrandConfig {
  wordmark: string;
  // Optional logo image to replace the wordmark text. When uploaded,
  // the header swaps from text to <img>. Same pattern as the default
  // theme's logo upload.
  logoEnabled: boolean;
  logoUpdatedAt: number;
}

export const DEFAULT_PORTFOLIO_BRAND: PortfolioBrandConfig = {
  wordmark: "",
  logoEnabled: false,
  logoUpdatedAt: 0,
};

export interface PortfolioThemeConfig {
  home: PortfolioHomeConfig;
  single: PortfolioSingleConfig;
  author: PortfolioAuthorConfig;
  footer: PortfolioFooterConfig;
  brand: PortfolioBrandConfig;
  style: StyleOverrides;
}

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioThemeConfig = {
  home: DEFAULT_PORTFOLIO_HOME,
  single: DEFAULT_PORTFOLIO_SINGLE,
  author: DEFAULT_PORTFOLIO_AUTHOR,
  footer: DEFAULT_PORTFOLIO_FOOTER,
  brand: DEFAULT_PORTFOLIO_BRAND,
  style: DEFAULT_STYLE,
};
