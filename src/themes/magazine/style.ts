import { uploadFile } from "@flexweg/cms-runtime";

// Magazine theme — runtime style customization. Mirrors the default
// theme's style.ts but adapted to Tailwind: colors are stored as RGB
// triplets in the CSS (so `rgb(var(--color-X) / <alpha-value>)` works
// for the Tailwind utility classes), and the override block has to
// rewrite triplets, not hex strings. The form still surfaces colors
// as hex (the only format `<input type="color">` supports) — we
// convert hex → "r g b" at compile time.

export type ThemeVarGroup = "surfaces" | "foreground" | "outlines" | "accent" | "spacing" | "radius";

export interface ThemeVarSpec {
  // CSS custom property name including the leading `--`.
  name: string;
  type: "color" | "length";
  group: ThemeVarGroup;
  // i18n key resolved against the theme-magazine namespace.
  labelKey: string;
  // Built-in value as exposed to the form. Colors are stored as
  // hex even though the underlying CSS uses RGB triplets — the
  // form's `<input type="color">` only emits hex, and `compileCss`
  // converts on the way to the published CSS.
  defaultValue: string;
}

// Material 3 token list editable through the Style tab. Keep in sync
// with the `:root` block in theme.css (those values are the same
// hex codes converted to RGB triplets).
export const THEME_VAR_SPECS: ThemeVarSpec[] = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#f8f9fa" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#f8f9fa" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f3f4f5" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#edeeef" },
  { name: "--color-surface-container-high", type: "color", group: "surfaces", labelKey: "vars.surfaceHigh", defaultValue: "#e7e8e9" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#191c1d" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#444748" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#747878" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c4c7c7" },
  // Accent
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#000000" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-primary-container", type: "color", group: "accent", labelKey: "vars.primaryContainer", defaultValue: "#1c1b1b" },
  { name: "--color-on-primary-container", type: "color", group: "accent", labelKey: "vars.onPrimaryContainer", defaultValue: "#858383" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#43617c" },
];

export const THEME_VAR_GROUPS: ThemeVarGroup[] = [
  "surfaces",
  "foreground",
  "outlines",
  "accent",
];

// Curated Google Fonts pairs. Each entry maps a display name to the
// `family=...` segment used in a CSS2 URL (URL-encoded plus signs for
// multi-word names). Mix of serif / sans deliberately to give admins
// stylistic options that all stay editorial in spirit.
export const FONT_PRESETS = {
  serif: {
    Newsreader: "Newsreader:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400",
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400",
    "IBM Plex Serif": "IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400",
    Spectral: "Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400",
  },
  sans: {
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    Inter: "Inter:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Outfit: "Outfit:wght@400;500;600;700",
  },
} as const;

export const DEFAULT_FONT_SERIF = "Newsreader";
export const DEFAULT_FONT_SANS = "Work Sans";

export interface StyleOverrides {
  vars: Record<string, string>;
  fontSerif: string;
  fontSans: string;
}

export const DEFAULT_STYLE: StyleOverrides = {
  vars: {},
  fontSerif: DEFAULT_FONT_SERIF,
  fontSans: DEFAULT_FONT_SANS,
};

// Builds the Google Fonts URL used at the top of theme.css. Order:
// serif first (matches the bundled stylesheet's @import line), then
// sans. compileCss feeds the result back into the CSS as a single
// `@import url(...)`.
export function buildGoogleFontsUrl(serif: string, sans: string): string {
  const serifSeg =
    (FONT_PRESETS.serif as Record<string, string>)[serif] ??
    FONT_PRESETS.serif[DEFAULT_FONT_SERIF];
  const sansSeg =
    (FONT_PRESETS.sans as Record<string, string>)[sans] ??
    FONT_PRESETS.sans[DEFAULT_FONT_SANS];
  return `https://fonts.googleapis.com/css2?family=${serifSeg}&family=${sansSeg}&display=swap`;
}

export function defaultGoogleFontsUrl(): string {
  return buildGoogleFontsUrl(DEFAULT_FONT_SERIF, DEFAULT_FONT_SANS);
}

// Used by the FontSelect component to render each option in its own
// face. Loads weight 400 of every curated font so previews show the
// right typography without bloating with heavier weights.
export function buildAllFontsPreviewUrl(): string {
  const families = [
    ...Object.keys(FONT_PRESETS.serif),
    ...Object.keys(FONT_PRESETS.sans),
  ];
  const segments = families.map((name) => `family=${name.replace(/ /g, "+")}`);
  return `https://fonts.googleapis.com/css2?${segments.join("&")}&display=swap`;
}

export function fontGenericFallback(name: string): "serif" | "sans-serif" {
  return (FONT_PRESETS.serif as Record<string, string>)[name] !== undefined
    ? "serif"
    : "sans-serif";
}

// Hex (`#RRGGBB` or `#RGB`) → space-separated RGB triplet ("r g b")
// — the format the magazine theme's `:root` block expects so Tailwind's
// `rgb(var(--color-X) / <alpha-value>)` formula keeps working.
// Non-hex values (already a triplet, or any other format) pass
// through unchanged so power users can paste arbitrary CSS.
function normalizeColor(value: string): string {
  const v = value.trim();
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(v);
  if (!match) return v;
  const hex = match[1];
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `${r} ${g} ${b}`;
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function quoteFontName(name: string): string {
  return `"${name.replace(/"/g, '\\"')}"`;
}

// Produces the customized CSS string. When `style` matches the
// defaults exactly (no var overrides, default fonts), we return
// `baseCssText` untouched — `Sync theme assets` then pushes the
// bundled CSS verbatim.
//
// Two transformations:
//   1. Replace the first `@import url(...)` (Newsreader / Work Sans)
//      with the user's chosen pair. The Material Symbols @import
//      sits second in the file so it stays untouched (non-global
//      replace = first match only).
//   2. Append a `:root { ... }` block with normalized values. The
//      cascade resolves later declarations as winners on equal
//      specificity, so this beats the original `:root` block.
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

  if (!fontsChanged && !hasOverrides) return baseCssText;

  let output = baseCssText;
  if (fontsChanged) {
    const newUrl = buildGoogleFontsUrl(fontSerif, fontSans);
    // Tailwind's "compressed" output keeps `@import url("...")` with
    // straight quotes. The regex tolerates both `@import url("...")`
    // and the bare `@import "..."` form just in case.
    output = output.replace(
      /@import\s*(?:url\(\s*)?"https:\/\/fonts\.googleapis\.com[^"]*"(?:\s*\))?\s*;/,
      `@import url("${newUrl}");`,
    );
  }

  // Build the override `:root` block. Color values get hex→RGB-triplet
  // normalization; lengths pass through verbatim.
  const specByName = new Map(THEME_VAR_SPECS.map((s) => [s.name, s] as const));
  const decls = Object.entries(filteredVars)
    .map(([k, v]) => {
      const spec = specByName.get(k);
      const normalized = spec?.type === "color" ? normalizeColor(v) : v;
      return `${k}:${normalized};`;
    })
    .join("");

  const fontDecls = fontsChanged
    ? `--font-serif:${quoteFontName(fontSerif)};--font-sans:${quoteFontName(fontSans)};`
    : "";

  output += `\n:root{${fontDecls}${decls}}\n`;
  return output;
}

// Uploads the customized theme CSS to Flexweg. Path is the same as
// the baseline (`theme-assets/magazine.css`) so every published page
// picks up the new look on its next load — no per-page republish
// needed.
export async function applyAndUploadCustomCss(args: {
  baseCssText: string;
  style: StyleOverrides;
}): Promise<void> {
  const css = buildCustomCss(args.baseCssText, args.style);
  await uploadFile({
    path: `theme-assets/magazine.css`,
    content: css,
    encoding: "utf-8",
  });
}
