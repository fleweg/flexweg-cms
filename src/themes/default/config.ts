import { DEFAULT_STYLE, type StyleOverrides } from "./style";
import type { ListVariant } from "./blocks/postCardHtml";

export type HomeHeroVariant = "image-overlay" | "split-left" | "split-right" | "minimal";

// Layout choices for the home page. The HomeTemplate delegates the
// featured slot to renderHero() and the posts grid to renderPostsList(),
// so the same variants the editor exposes via the Hero / Posts list
// blocks are available here. Defaults preserve a sensible look on a
// fresh install: image-overlay hero + 3-column cards grid.
export interface HomeLayoutConfig {
  heroVariant: HomeHeroVariant;
  listVariant: ListVariant;
  // Number of columns for the cards variant of the posts list.
  // Range 1–4 (clamped by the block's wrapList); ignored by every
  // other variant (list / compact / numbered / slider have their
  // own layout that doesn't grid-out by column count).
  listColumns: number;
}

export const DEFAULT_HOME_LAYOUT: HomeLayoutConfig = {
  heroVariant: "image-overlay",
  listVariant: "cards",
  listColumns: 3,
};

// Default theme config shape. Stored at
// settings.themeConfigs["default"]; merged with these defaults by
// ThemeSettingsRoute before being handed to the settings page.
export interface DefaultThemeConfig {
  // Whether a logo has been uploaded. The header swaps the text
  // wordmark for the image when this is true.
  logoEnabled: boolean;
  // Milliseconds since epoch of the last logo upload — used as a
  // cache-bust query in the public-side logo URL so the new logo
  // shows up immediately after re-publishing /data/menu.json.
  logoUpdatedAt: number;
  // CSS variable overrides + chosen Google Fonts. Empty / defaults
  // leave the baseline CSS untouched; custom values produce a
  // regenerated `theme-assets/default.css` with an override `:root`
  // block appended and the right Google Fonts URL imported.
  style: StyleOverrides;
  // Layout of the home page when not using a static page. Drives the
  // Hero variant for the featured slot and the PostsList variant for
  // the latest-articles grid below.
  home: HomeLayoutConfig;
}

export const DEFAULT_THEME_CONFIG: DefaultThemeConfig = {
  logoEnabled: false,
  logoUpdatedAt: 0,
  style: DEFAULT_STYLE,
  home: DEFAULT_HOME_LAYOUT,
};
