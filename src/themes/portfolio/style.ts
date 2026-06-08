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

// Curated graphic presets — pick one to fill every Style field in a
// single action; the admin can then fine-tune individual fields. The
// `vars` map can be partial: missing keys fall back to the spec
// defaults via `resolveVar`. "minimal" is the baseline (matches
// DEFAULT_STYLE with empty vars).
export interface StylePreset {
  id: string;
  swatch: [string, string, string, string];
  vars: Record<string, string>;
  fontSerif: string;
  fontSans: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "minimal",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-error"],
    vars: {},
    fontSerif: DEFAULT_FONT_SERIF,
    fontSans: DEFAULT_FONT_SANS,
  },
  {
    id: "earth",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-error"],
    vars: {
      "--color-background": "#f9f3ec",
      "--color-surface": "#f9f3ec",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f0e9de",
      "--color-surface-container": "#e6ddcd",
      "--color-on-surface": "#2a1f17",
      "--color-on-surface-variant": "#5c4a3a",
      "--color-outline": "#8c8276",
      "--color-outline-variant": "#cfc8bd",
      "--color-primary": "#6b3018",
      "--color-on-primary": "#ffffff",
      "--color-secondary": "#a86b3c",
      "--color-error": "#d4691f",
    },
    fontSerif: "Cormorant Garamond",
    fontSans: "Work Sans",
  },
  {
    id: "electric",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-error"],
    vars: {
      "--color-background": "#ffffff",
      "--color-surface": "#ffffff",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f5f5f5",
      "--color-surface-container": "#ebebeb",
      "--color-on-surface": "#0a0a0a",
      "--color-on-surface-variant": "#2c2c2c",
      "--color-outline": "#5a5a5a",
      "--color-outline-variant": "#b8b8b8",
      "--color-primary": "#0a0a0a",
      "--color-on-primary": "#ffffff",
      "--color-secondary": "#3a3a3a",
      "--color-error": "#ff2d2d",
    },
    fontSerif: "DM Serif Display",
    fontSans: "Space Grotesk",
  },
  {
    id: "museum",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-error"],
    vars: {
      "--color-background": "#faf7f0",
      "--color-surface": "#faf7f0",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f1ede2",
      "--color-surface-container": "#e7e2d3",
      "--color-on-surface": "#1a1f1a",
      "--color-on-surface-variant": "#3a443a",
      "--color-outline": "#7a857a",
      "--color-outline-variant": "#c2cdc2",
      "--color-primary": "#2d4030",
      "--color-on-primary": "#faf7f0",
      "--color-secondary": "#5a7a5d",
      "--color-error": "#8a3a2a",
    },
    fontSerif: "Newsreader",
    fontSans: "Inter",
  },
  {
    id: "midnight",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-error"],
    vars: {
      "--color-background": "#f3f5fa",
      "--color-surface": "#f3f5fa",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#e8ecf3",
      "--color-surface-container": "#dce1ec",
      "--color-on-surface": "#0a1428",
      "--color-on-surface-variant": "#283045",
      "--color-outline": "#5e6783",
      "--color-outline-variant": "#b8bfd1",
      "--color-primary": "#0f1f4a",
      "--color-on-primary": "#ffffff",
      "--color-secondary": "#3e5495",
      "--color-error": "#d4a02a",
    },
    fontSerif: "Spectral",
    fontSans: "Bricolage Grotesque",
  },
];

export function resolveVar(style: StyleOverrides, name: string): string {
  const v = style.vars?.[name];
  if (v && v.trim()) return v.trim();
  const spec = THEME_VAR_SPECS.find((s) => s.name === name);
  return spec ? spec.defaultValue : "";
}

export function detectActivePreset(style: StyleOverrides): string | null {
  for (const preset of STYLE_PRESETS) {
    if (preset.fontSerif !== style.fontSerif) continue;
    if (preset.fontSans !== style.fontSans) continue;
    let allMatch = true;
    for (const spec of THEME_VAR_SPECS) {
      const presetEffective = preset.vars[spec.name]?.trim() || spec.defaultValue;
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
