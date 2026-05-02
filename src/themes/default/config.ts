import { DEFAULT_STYLE, type StyleOverrides } from "./style";

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
}

export const DEFAULT_THEME_CONFIG: DefaultThemeConfig = {
  logoEnabled: false,
  logoUpdatedAt: 0,
  style: DEFAULT_STYLE,
};
