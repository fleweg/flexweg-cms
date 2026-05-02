import { uploadFile } from "../../services/flexwegApi";

// Default theme — runtime style customization. The Style tab in the
// theme settings page lets admins override CSS custom properties and
// pick from a curated list of Google Fonts. We don't recompile SCSS
// here: the original compiled CSS lives in `manifest.cssText` (Vite
// `?inline` import), and we produce the customized variant by:
//   1. replacing the `@import url(...)` Google Fonts line at the top
//      so the right font files are loaded, and
//   2. appending an additional `:root { ... }` block at the end so
//      the cascade picks up the user's overrides over the defaults.
// The resulting string gets uploaded over `theme-assets/default.css`
// — same path as the baseline CSS, so every published page picks up
// the new look on its next load (modulo browser cache).

// One editable variable's metadata. Used both by the form (rendering
// the right input + label) and by the regenerator (knowing the
// default value to emit when a slot is empty).
export interface ThemeVarSpec {
  // CSS custom property name including the leading `--`.
  name: string;
  type: "color" | "length";
  // Section label key the form groups by.
  group: ThemeVarGroup;
  // i18n key resolved against the theme-default namespace.
  labelKey: string;
  // Built-in value; matches what `theme.scss` declares.
  defaultValue: string;
}

export type ThemeVarGroup =
  | "surfaces"
  | "foreground"
  | "outlines"
  | "accent"
  | "spacing"
  | "radius";

// Curated list of editable variables. Mirrors the `:root` block in
// `theme.scss` — keep the two in sync when changing the design tokens.
export const THEME_VAR_SPECS: ThemeVarSpec[] = [
  // Surfaces
  { name: "--color-bg", type: "color", group: "surfaces", labelKey: "vars.bg", defaultValue: "#fbf9f9" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#ffffff" },
  { name: "--color-surface-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f5f3f3" },
  { name: "--color-surface-mid", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#efeded" },
  { name: "--color-surface-high", type: "color", group: "surfaces", labelKey: "vars.surfaceHigh", defaultValue: "#e9e8e7" },
  { name: "--color-surface-highest", type: "color", group: "surfaces", labelKey: "vars.surfaceHighest", defaultValue: "#e3e2e2" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#1b1c1c" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#444748" },
  { name: "--color-on-surface-muted", type: "color", group: "foreground", labelKey: "vars.onSurfaceMuted", defaultValue: "#868382" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#747878" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c4c7c7" },
  // Accent
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#000000" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#476558" },
  { name: "--color-secondary-container", type: "color", group: "accent", labelKey: "vars.secondaryContainer", defaultValue: "#c9ead9" },
  { name: "--color-on-secondary-container", type: "color", group: "accent", labelKey: "vars.onSecondaryContainer", defaultValue: "#4d6b5d" },
  // Spacing
  { name: "--container-max", type: "length", group: "spacing", labelKey: "vars.containerMax", defaultValue: "1120px" },
  { name: "--gutter", type: "length", group: "spacing", labelKey: "vars.gutter", defaultValue: "24px" },
  { name: "--section-gap", type: "length", group: "spacing", labelKey: "vars.sectionGap", defaultValue: "80px" },
  // Radius
  { name: "--radius-sm", type: "length", group: "radius", labelKey: "vars.radiusSm", defaultValue: "0.125rem" },
  { name: "--radius", type: "length", group: "radius", labelKey: "vars.radius", defaultValue: "0.25rem" },
  { name: "--radius-lg", type: "length", group: "radius", labelKey: "vars.radiusLg", defaultValue: "0.5rem" },
  { name: "--radius-xl", type: "length", group: "radius", labelKey: "vars.radiusXl", defaultValue: "0.75rem" },
];

export const THEME_VAR_GROUPS: ThemeVarGroup[] = [
  "surfaces",
  "foreground",
  "outlines",
  "accent",
  "spacing",
  "radius",
];

// Curated Google Fonts. Each entry maps a display name to the
// `family=...` segment used in a Google Fonts CSS2 URL (already
// URL-encoded so plus signs survive the join). Weights cover the
// admin's typical body/display use cases — adjust per font when a
// face has limited weight coverage.
export const FONT_PRESETS = {
  serif: {
    Newsreader: "Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Source Serif 4": "Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
  },
  sans: {
    Inter: "Inter:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Outfit: "Outfit:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
  },
} as const;

export const DEFAULT_FONT_SERIF = "Newsreader";
export const DEFAULT_FONT_SANS = "Inter";

// Style overrides persisted under settings.themeConfigs.default.style.
// Empty `vars` + default fonts means "use the built-in look" — the
// regenerator emits the original CSS unchanged in that case.
export interface StyleOverrides {
  // CSS custom property name → value. Empty / missing slots fall
  // back to the manifest defaults (the original `:root` block).
  vars: Record<string, string>;
  // Display name as used in FONT_PRESETS.{serif,sans}. Custom names
  // that aren't in the preset map fall back to the defaults.
  fontSerif: string;
  fontSans: string;
}

export const DEFAULT_STYLE: StyleOverrides = {
  vars: {},
  fontSerif: DEFAULT_FONT_SERIF,
  fontSans: DEFAULT_FONT_SANS,
};

// Builds the Google Fonts CSS2 URL for the chosen pair. Sans family
// listed first so its glyphs preload before the serif (the reading
// surface uses sans for metadata, which is more frequently visible).
export function buildGoogleFontsUrl(serif: string, sans: string): string {
  const sansFamily =
    (FONT_PRESETS.sans as Record<string, string>)[sans] ??
    FONT_PRESETS.sans[DEFAULT_FONT_SANS];
  const serifFamily =
    (FONT_PRESETS.serif as Record<string, string>)[serif] ??
    FONT_PRESETS.serif[DEFAULT_FONT_SERIF];
  return `https://fonts.googleapis.com/css2?family=${sansFamily}&family=${serifFamily}&display=swap`;
}

// Returns the default-fonts URL (used to detect whether the @import
// line is already in the desired state). Cheaper than running the
// regen pipeline when nothing changed.
export function defaultGoogleFontsUrl(): string {
  return buildGoogleFontsUrl(DEFAULT_FONT_SERIF, DEFAULT_FONT_SANS);
}

// CSS-safe quoting for a font family name. Inside the CSS variable
// declaration we want `"Lora"` (quoted), since names like `Plus
// Jakarta Sans` contain spaces. The fallback chain stays unquoted.
function quoteFontName(name: string): string {
  return `"${name.replace(/"/g, '\\"')}"`;
}

// Produces the customized CSS string. When `style` matches the
// defaults exactly, we return `baseCssText` untouched — `Sync theme
// assets` then pushes the bundled CSS verbatim.
export function buildCustomCss(baseCssText: string, style: StyleOverrides): string {
  // Filter out empty / whitespace-only var values so a user clearing
  // a field reverts to the manifest default rather than emitting an
  // empty CSS declaration.
  const filteredVars: Record<string, string> = {};
  for (const [key, value] of Object.entries(style.vars ?? {})) {
    if (value && value.trim()) filteredVars[key] = value.trim();
  }
  const fontSerif = style.fontSerif || DEFAULT_FONT_SERIF;
  const fontSans = style.fontSans || DEFAULT_FONT_SANS;
  const fontsChanged = fontSerif !== DEFAULT_FONT_SERIF || fontSans !== DEFAULT_FONT_SANS;
  const hasOverrides = Object.keys(filteredVars).length > 0;

  // Fast path: no overrides, no font change → emit the baseline as-is.
  if (!fontsChanged && !hasOverrides) return baseCssText;

  // 1. Swap the Google Fonts `@import` line at the top of the file.
  // Sass's "compressed" output drops the `url(...)` wrapper and emits
  // `@import "https://..."` (no spaces). The regex accepts both
  // forms — `@import url("...")` and the bare-string variant — so
  // the replacement works regardless of the SCSS compile mode.
  let output = baseCssText;
  if (fontsChanged) {
    const newUrl = buildGoogleFontsUrl(fontSerif, fontSans);
    output = output.replace(
      /@import\s*(?:url\(\s*)?"https:\/\/fonts\.googleapis\.com[^"]*"(?:\s*\))?\s*;/,
      `@import url("${newUrl}");`,
    );
  }

  // 2. Append a `:root` override block. The cascade resolves later
  // declarations as winners on equal specificity, so values here
  // beat the original `:root` declarations earlier in the file.
  const fontDecls = fontsChanged
    ? `--font-serif:${quoteFontName(fontSerif)},Georgia,"Times New Roman",serif;` +
      `--font-sans:${quoteFontName(fontSans)},-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;`
    : "";
  const varDecls = Object.entries(filteredVars)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  output += `\n:root{${fontDecls}${varDecls}}\n`;
  return output;
}

// Uploads the customized theme CSS to Flexweg. Path is the same as
// the baseline (`theme-assets/<themeId>.css`) so every published page
// picks up the new look on its next load — no per-page republish
// needed. Browser cache may serve the old version once; users
// hard-refresh to see the change immediately.
export async function applyAndUploadCustomCss(args: {
  themeId: string;
  baseCssText: string;
  style: StyleOverrides;
}): Promise<void> {
  const css = buildCustomCss(args.baseCssText, args.style);
  await uploadFile({
    path: `theme-assets/${args.themeId}.css`,
    content: css,
    encoding: "utf-8",
  });
}
