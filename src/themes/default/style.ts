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
//
// Field types:
//   color  — `<input type="color">` + free-form hex/rgb input
//   length — free-form text input (any CSS length: px, rem, %)
//   weight — `<select>` with the 9 numeric font-weight steps 100–900
export interface ThemeVarSpec {
  // CSS custom property name including the leading `--`.
  name: string;
  type: "color" | "length" | "weight";
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
  | "weights"
  | "spacing"
  | "radius";

// Numeric font-weight steps offered by the weight picker. Maps the
// CSS value to the typographic name used as a localized hint in the
// dropdown ("400 — Regular"). Names are static here (English-only)
// because they're typographic terms admins recognize regardless of
// locale; the surrounding labels (group title, field label) are i18n.
export const FONT_WEIGHT_STEPS: { value: string; name: string }[] = [
  { value: "100", name: "Thin" },
  { value: "200", name: "Extra Light" },
  { value: "300", name: "Light" },
  { value: "400", name: "Regular" },
  { value: "500", name: "Medium" },
  { value: "600", name: "Semibold" },
  { value: "700", name: "Bold" },
  { value: "800", name: "Extra Bold" },
  { value: "900", name: "Black" },
];

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
  // Font weight tokens, role-based so admins can dial each design
  // intent independently (e.g. bump display titles to 700 with a
  // thin body face without making meta labels heavier). Selected
  // font may not ship every step — the browser then falls back to
  // the closest available face.
  { name: "--weight-display", type: "weight", group: "weights", labelKey: "vars.weightDisplay", defaultValue: "600" },
  { name: "--weight-heading", type: "weight", group: "weights", labelKey: "vars.weightHeading", defaultValue: "500" },
  { name: "--weight-body", type: "weight", group: "weights", labelKey: "vars.weightBody", defaultValue: "400" },
  { name: "--weight-meta", type: "weight", group: "weights", labelKey: "vars.weightMeta", defaultValue: "600" },
  { name: "--weight-emphasis", type: "weight", group: "weights", labelKey: "vars.weightEmphasis", defaultValue: "700" },
  { name: "--weight-lede", type: "weight", group: "weights", labelKey: "vars.weightLede", defaultValue: "300" },
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

// Section order in the Style tab. `weights` sits at the end so the
// Typography section (rendered separately, since it owns its own
// FontSelect components) can be injected just above it — the two
// share the same typographic concern and read more naturally as a
// pair than scattered across the page.
export const THEME_VAR_GROUPS: ThemeVarGroup[] = [
  "surfaces",
  "foreground",
  "outlines",
  "accent",
  "spacing",
  "radius",
  "weights",
];

// Curated Google Fonts. Each entry maps a display name to the
// `family=...` segment used in a Google Fonts CSS2 URL (already
// URL-encoded so plus signs survive the join). Mix of styles is
// deliberate so admins have visual options across categories.
//
// Some display faces are single-weight on Google Fonts (Anton,
// Archivo Black, Bowlby One) — their segment omits `:wght@...` so
// the only available weight is loaded. Body text on those will
// stay at the same weight regardless of CSS `font-weight: 700`,
// which is the right behavior for a deliberately heavy display
// font.
export const FONT_PRESETS = {
  serif: {
    Newsreader: "Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Source Serif 4": "Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Crimson Pro": "Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Spectral: "Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
  },
  sans: {
    // Humanist / neutral
    Inter: "Inter:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    // Geometric / modern grotesque
    Outfit: "Outfit:wght@400;500;600;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700",
    // Condensed / narrow
    Oswald: "Oswald:wght@400;500;600;700",
    "Barlow Condensed": "Barlow+Condensed:wght@400;500;600;700",
    "Big Shoulders Display": "Big+Shoulders+Display:wght@400;500;600;700",
    // Heavy display (single weight on Google Fonts — already maximally heavy)
    Anton: "Anton",
    "Archivo Black": "Archivo+Black",
    "Bowlby One": "Bowlby+One",
    // Expressive / sci-fi geometric
    Unbounded: "Unbounded:wght@400;500;600;700",
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

// Curated graphic presets. Selecting one fills the whole Style tab
// (vars + fontSerif + fontSans) in a single action; the user can then
// fine-tune individual fields. The `vars` field of "classic" is empty
// by design — it represents the baseline look (matches DEFAULT_STYLE
// exactly), so `buildCustomCss` returns the bundled CSS untouched.
//
// Adding a new preset = append an entry below + add a `presets.<id>`
// pair in every locale of i18n.ts. No migration needed — presets are
// matched by value, never persisted by id.
export interface StylePreset {
  id: string;
  // Colors picked for the 4-dot swatch in the picker UI. Each one is
  // a CSS variable name resolved against `vars` + the spec defaults.
  // Order: bg, surface, primary, secondary.
  swatch: [string, string, string, string];
  vars: Record<string, string>;
  fontSerif: string;
  fontSans: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "classic",
    swatch: ["--color-bg", "--color-surface", "--color-primary", "--color-secondary"],
    vars: {},
    fontSerif: DEFAULT_FONT_SERIF,
    fontSans: DEFAULT_FONT_SANS,
  },
  {
    id: "modern",
    swatch: ["--color-bg", "--color-surface", "--color-primary", "--color-secondary"],
    vars: {
      "--color-bg": "#fcfcfc",
      "--color-surface": "#ffffff",
      "--color-surface-low": "#f7f7f8",
      "--color-surface-mid": "#efeff1",
      "--color-surface-high": "#e7e7ea",
      "--color-surface-highest": "#dfdfe3",
      "--color-on-surface": "#0f172a",
      "--color-on-surface-variant": "#475569",
      "--color-on-surface-muted": "#94a3b8",
      "--color-outline": "#94a3b8",
      "--color-outline-variant": "#e2e8f0",
      "--color-primary": "#0f172a",
      "--color-on-primary": "#ffffff",
      "--color-secondary": "#0d9488",
      "--color-secondary-container": "#ccfbf1",
      "--color-on-secondary-container": "#115e59",
      "--container-max": "1200px",
      "--gutter": "32px",
      "--section-gap": "96px",
      "--radius-sm": "0.375rem",
      "--radius": "0.625rem",
      "--radius-lg": "1rem",
      "--radius-xl": "1.5rem",
    },
    fontSerif: "Source Serif 4",
    fontSans: "Space Grotesk",
  },
  {
    id: "editorial",
    swatch: ["--color-bg", "--color-surface", "--color-primary", "--color-secondary"],
    vars: {
      "--color-bg": "#f9f6f1",
      "--color-surface": "#ffffff",
      "--color-surface-low": "#f3eee5",
      "--color-surface-mid": "#ebe4d7",
      "--color-surface-high": "#e2d9c8",
      "--color-surface-highest": "#d9cfb9",
      "--color-on-surface": "#2a1f17",
      "--color-on-surface-variant": "#5c4a3a",
      "--color-on-surface-muted": "#998774",
      "--color-outline": "#998774",
      "--color-outline-variant": "#d9cfb9",
      "--color-primary": "#6b1f24",
      "--color-on-primary": "#fff8ec",
      "--color-secondary": "#8b0d23",
      "--color-secondary-container": "#f4d5d8",
      "--color-on-secondary-container": "#5a0e1a",
      "--radius-sm": "0.0625rem",
      "--radius": "0.125rem",
      "--radius-lg": "0.25rem",
      "--radius-xl": "0.375rem",
    },
    fontSerif: "Playfair Display",
    fontSans: "Manrope",
  },
  {
    id: "bold",
    swatch: ["--color-bg", "--color-surface", "--color-primary", "--color-secondary"],
    vars: {
      "--color-bg": "#ffffff",
      "--color-surface": "#ffffff",
      "--color-surface-low": "#f5f4f3",
      "--color-surface-mid": "#ebe9e7",
      "--color-surface-high": "#dfdcd9",
      "--color-surface-highest": "#d2cecb",
      "--color-on-surface": "#0a0a0a",
      "--color-on-surface-variant": "#383634",
      "--color-on-surface-muted": "#7c7976",
      "--color-outline": "#7c7976",
      "--color-outline-variant": "#dfdcd9",
      "--color-primary": "#e63946",
      "--color-on-primary": "#ffffff",
      "--color-secondary": "#3a3df3",
      "--color-secondary-container": "#e0e1ff",
      "--color-on-secondary-container": "#1a1d8a",
      "--radius-sm": "0.5rem",
      "--radius": "0.875rem",
      "--radius-lg": "1.25rem",
      "--radius-xl": "1.75rem",
    },
    fontSerif: "Bricolage Grotesque",
    fontSans: "Outfit",
  },
  {
    id: "minimal",
    swatch: ["--color-bg", "--color-surface", "--color-primary", "--color-secondary"],
    vars: {
      "--color-bg": "#fafafa",
      "--color-surface": "#ffffff",
      "--color-surface-low": "#f4f4f5",
      "--color-surface-mid": "#e4e4e7",
      "--color-surface-high": "#d4d4d8",
      "--color-surface-highest": "#a1a1aa",
      "--color-on-surface": "#18181b",
      "--color-on-surface-variant": "#52525b",
      "--color-on-surface-muted": "#a1a1aa",
      "--color-outline": "#a1a1aa",
      "--color-outline-variant": "#e4e4e7",
      "--color-primary": "#27272a",
      "--color-on-primary": "#fafafa",
      "--color-secondary": "#52525b",
      "--color-secondary-container": "#e4e4e7",
      "--color-on-secondary-container": "#27272a",
      "--container-max": "960px",
      "--gutter": "20px",
      "--section-gap": "64px",
      "--radius-sm": "0",
      "--radius": "0",
      "--radius-lg": "0.125rem",
      "--radius-xl": "0.25rem",
    },
    fontSerif: "Source Serif 4",
    fontSans: "Inter",
  },
];

// Returns the resolved value of a CSS variable in a given style, falling
// back to the spec default when the var isn't overridden. Used by the
// swatch renderer (to show the right dot color for "classic" which has
// empty vars) and by detectActivePreset (so an explicit override that
// matches the default still counts as "no override").
export function resolveVar(style: StyleOverrides, name: string): string {
  const v = style.vars?.[name];
  if (v && v.trim()) return v.trim();
  const spec = THEME_VAR_SPECS.find((s) => s.name === name);
  return spec ? spec.defaultValue : "";
}

// Returns the id of the preset whose effective values match `style`
// exactly, or null when the style doesn't fully match any preset
// (= the user has fine-tuned). Compares against EFFECTIVE values so a
// var explicitly set to its default still matches a preset that omits
// it.
export function detectActivePreset(style: StyleOverrides): string | null {
  for (const preset of STYLE_PRESETS) {
    if (preset.fontSerif !== style.fontSerif) continue;
    if (preset.fontSans !== style.fontSans) continue;
    // Compare effective values for every spec — covers both the
    // var-set-in-preset and var-set-in-style cases consistently.
    let allMatch = true;
    for (const spec of THEME_VAR_SPECS) {
      const presetEffective =
        preset.vars[spec.name]?.trim() || spec.defaultValue;
      const styleEffective = resolveVar(style, spec.name);
      if (presetEffective !== styleEffective) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return preset.id;
  }
  return null;
}

// Looks up a font's Google Fonts CSS2 spec in BOTH FONT_PRESETS
// buckets — the picker now allows any font in either slot, so the
// URL builder can't constrain the lookup to one family bucket.
function fontSpec(name: string, fallback: string): string {
  const all = {
    ...(FONT_PRESETS.serif as Record<string, string>),
    ...(FONT_PRESETS.sans as Record<string, string>),
  };
  return all[name] ?? all[fallback];
}

// Builds the Google Fonts CSS2 URL for the chosen pair. Sans family
// listed first so its glyphs preload before the serif (the reading
// surface uses sans for metadata, which is more frequently visible).
export function buildGoogleFontsUrl(serif: string, sans: string): string {
  const sansFamily = fontSpec(sans, DEFAULT_FONT_SANS);
  const serifFamily = fontSpec(serif, DEFAULT_FONT_SERIF);
  // Same font picked twice → request once. Avoids `&family=X&family=X`
  // which Google handles fine but inflates the URL.
  if (sansFamily === serifFamily) {
    return `https://fonts.googleapis.com/css2?family=${sansFamily}&display=swap`;
  }
  return `https://fonts.googleapis.com/css2?family=${sansFamily}&family=${serifFamily}&display=swap`;
}

// Returns the default-fonts URL (used to detect whether the @import
// line is already in the desired state). Cheaper than running the
// regen pipeline when nothing changed.
export function defaultGoogleFontsUrl(): string {
  return buildGoogleFontsUrl(DEFAULT_FONT_SERIF, DEFAULT_FONT_SANS);
}

// Lightweight preview URL — loads weight 400 of every curated font.
// Used by the Style tab to render font picker options in their own
// face, so admins can see what they're choosing. Heavier weights
// aren't needed because the preview text is just the font name.
export function buildAllFontsPreviewUrl(): string {
  const families = [
    ...Object.keys(FONT_PRESETS.serif),
    ...Object.keys(FONT_PRESETS.sans),
  ];
  const segments = families.map((name) => `family=${name.replace(/ /g, "+")}`);
  return `https://fonts.googleapis.com/css2?${segments.join("&")}&display=swap`;
}

// CSS-safe quoting for a font family name. Inside the CSS variable
// declaration we want `"Lora"` (quoted), since names like `Plus
// Jakarta Sans` contain spaces. The fallback chain stays unquoted.
function quoteFontName(name: string): string {
  return `"${name.replace(/"/g, '\\"')}"`;
}

// Returns the appropriate generic-family fallback chain for a given
// font, regardless of which "slot" (--font-serif vs --font-sans) it
// ends up in. Lets users mix styles freely (sans for headings, serif
// for body) while keeping FOUC visually consistent.
export function fontFallbackChain(name: string): string {
  const isSerif = (FONT_PRESETS.serif as Record<string, string>)[name] !== undefined;
  return isSerif
    ? `Georgia, "Times New Roman", serif`
    : `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
}

// Generic-family classifier exposed for the Style tab so the FontSelect
// can render each option against the right fallback.
export function fontGenericFallback(name: string): "serif" | "sans-serif" {
  return (FONT_PRESETS.serif as Record<string, string>)[name] !== undefined
    ? "serif"
    : "sans-serif";
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
  // Fallback chain follows each chosen font's actual category — so
  // a sans font picked for the "serif" slot still gets a sans-serif
  // fallback chain, keeping FOUC visually consistent.
  const fontDecls = fontsChanged
    ? `--font-serif:${quoteFontName(fontSerif)},${fontFallbackChain(fontSerif)};` +
      `--font-sans:${quoteFontName(fontSans)},${fontFallbackChain(fontSans)};`
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
