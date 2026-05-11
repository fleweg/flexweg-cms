import { uploadFile } from "@flexweg/cms-runtime";

// Portfolio theme — runtime style customization. Mirrors the magazine
// theme's style.ts adapted for the minimalist palette: colors stored
// as RGB triplets (so `rgb(var(--color-X) / <alpha-value>)` keeps
// working with Tailwind alpha modifiers), `compileCss` rewrites the
// @import font line + appends a :root override block.

export type ThemeVarGroup = "surfaces" | "foreground" | "outlines" | "accent";

export interface ThemeVarSpec {
  name: string;
  type: "color" | "length";
  group: ThemeVarGroup;
  // i18n key resolved against the theme-portfolio namespace.
  labelKey: string;
  // Hex default. The form's <input type="color"> emits hex; compileCss
  // converts to RGB triplet on the way to the published CSS.
  defaultValue: string;
}

// Material 3 tokens editable through the Style tab. Keep in sync with
// the `:root` block in theme.css.
export const THEME_VAR_SPECS: ThemeVarSpec[] = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#fdf8f8" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#fdf8f8" },
  { name: "--color-surface-container-lowest", type: "color", group: "surfaces", labelKey: "vars.surfaceLowest", defaultValue: "#ffffff" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f7f3f2" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#f1edec" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#1c1b1b" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#444748" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#747878" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c4c7c7" },
  // Accent
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#000000" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#5d5f5f" },
  { name: "--color-error", type: "color", group: "accent", labelKey: "vars.accent", defaultValue: "#e11d48" },
];

export const THEME_VAR_GROUPS: ThemeVarGroup[] = [
  "surfaces",
  "foreground",
  "outlines",
  "accent",
];

// Curated Google Fonts pairs — same superset as storefront/default so
// a site switching themes doesn't lose its current pair. The portfolio
// default pair (Playfair Display + Inter) is the strong-minimalism
// canonical pairing from the design system.
export const FONT_PRESETS = {
  serif: {
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Newsreader: "Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Source Serif 4": "Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Crimson Pro": "Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Spectral: "Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "DM Serif Display": "DM+Serif+Display:ital,wght@0,400;1,400",
  },
  sans: {
    Inter: "Inter:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    Outfit: "Outfit:wght@400;500;600;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700",
  },
} as const;

export const DEFAULT_FONT_SERIF = "Playfair Display";
export const DEFAULT_FONT_SANS = "Inter";

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

// Looks up a font's Google Fonts CSS2 spec across BOTH FONT_PRESETS
// buckets — users can put a sans face in the serif slot or vice versa.
function fontSpec(name: string, fallback: string): string {
  const all = {
    ...(FONT_PRESETS.serif as Record<string, string>),
    ...(FONT_PRESETS.sans as Record<string, string>),
  };
  return all[name] ?? all[fallback];
}

export function buildGoogleFontsUrl(serif: string, sans: string): string {
  const serifSeg = fontSpec(serif, DEFAULT_FONT_SERIF);
  const sansSeg = fontSpec(sans, DEFAULT_FONT_SANS);
  if (serifSeg === sansSeg) {
    return `https://fonts.googleapis.com/css2?family=${serifSeg}&display=swap`;
  }
  return `https://fonts.googleapis.com/css2?family=${serifSeg}&family=${sansSeg}&display=swap`;
}

export function defaultGoogleFontsUrl(): string {
  return buildGoogleFontsUrl(DEFAULT_FONT_SERIF, DEFAULT_FONT_SANS);
}

// All FONT_PRESETS in a single URL for the dropdown's per-row font
// preview. Loads weight 400 only — enough for a readable preview.
export function buildAllFontsPreviewUrl(): string {
  const families = [
    ...Object.keys(FONT_PRESETS.serif),
    ...Object.keys(FONT_PRESETS.sans),
  ];
  const segments = families.map((name) => `family=${name.replace(/ /g, "+")}`);
  return `https://fonts.googleapis.com/css2?${segments.join("&")}&display=swap`;
}

// Hex → "r g b" so Tailwind's `rgb(var(--color-X) / <alpha-value>)`
// keeps working when admins change colors via the picker.
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

// Same shape as magazine's compileCss — rewrites the first @import
// (Google Fonts) with the user's chosen pair, then appends a `:root`
// override block. The Material Symbols @import sits second in the
// file so it stays untouched (non-global replace).
export function buildCustomCss(baseCssText: string, style: StyleOverrides): string {
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
    output = output.replace(
      /@import\s*(?:url\(\s*)?"https:\/\/fonts\.googleapis\.com[^"]*"(?:\s*\))?\s*;/,
      `@import url("${newUrl}");`,
    );
  }

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

export async function applyAndUploadCustomCss(args: {
  baseCssText: string;
  style: StyleOverrides;
}): Promise<void> {
  const css = buildCustomCss(args.baseCssText, args.style);
  await uploadFile({
    path: `theme-assets/portfolio.css`,
    content: css,
    encoding: "utf-8",
  });
}
