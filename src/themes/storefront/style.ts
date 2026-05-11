import { uploadFile } from "@flexweg/cms-runtime";

// Storefront theme — runtime style customization. Mirrors the magazine
// theme's style.ts: editorial serif heading + sans body pair (the
// catalog mockups use Playfair Display + Inter). Colors stored as RGB
// triplets so Tailwind's `rgb(var(--color-X) / <alpha-value>)` formula
// keeps working for alpha-modifier syntax (`bg-primary/50`).

export type ThemeVarGroup = "surfaces" | "foreground" | "outlines" | "accent";

export interface ThemeVarSpec {
  // CSS custom property name including the leading `--`.
  name: string;
  type: "color" | "length";
  group: ThemeVarGroup;
  // i18n key resolved against the theme-storefront namespace.
  labelKey: string;
  // Built-in value as exposed to the form. Colors are stored as hex
  // even though the underlying CSS uses RGB triplets — `<input
  // type="color">` only emits hex, and `compileCss` converts on the
  // way to the published CSS.
  defaultValue: string;
}

// Material 3 token list editable through the Style tab. Keep in sync
// with the `:root` block in theme.css.
export const THEME_VAR_SPECS: ThemeVarSpec[] = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#fcf9f8" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#fcf9f8" },
  { name: "--color-surface-container-lowest", type: "color", group: "surfaces", labelKey: "vars.surfaceLowest", defaultValue: "#ffffff" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f6f3f2" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#f0eded" },
  { name: "--color-surface-container-high", type: "color", group: "surfaces", labelKey: "vars.surfaceHigh", defaultValue: "#eae7e7" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#1b1c1c" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#444840" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#75786f" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c5c8bd" },
  // Accent — sage primary + terracotta secondary. Defaults match the
  // catalog DESIGN.md exactly.
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#47573b" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-primary-container", type: "color", group: "accent", labelKey: "vars.primaryContainer", defaultValue: "#5f6f52" },
  { name: "--color-on-primary-container", type: "color", group: "accent", labelKey: "vars.onPrimaryContainer", defaultValue: "#dff1cd" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#914a36" },
  { name: "--color-on-secondary", type: "color", group: "accent", labelKey: "vars.onSecondary", defaultValue: "#ffffff" },
  { name: "--color-secondary-container", type: "color", group: "accent", labelKey: "vars.secondaryContainer", defaultValue: "#fda288" },
  { name: "--color-on-secondary-container", type: "color", group: "accent", labelKey: "vars.onSecondaryContainer", defaultValue: "#773623" },
];

export const THEME_VAR_GROUPS: ThemeVarGroup[] = [
  "surfaces",
  "foreground",
  "outlines",
  "accent",
];

// Curated Google Fonts pairs. Mirrors the `default` theme's font list
// so the two themes feel consistent — same families, same italic +
// weight axes loaded — plus a couple of storefront-only extras that
// suit the boutique aesthetic (DM Serif Display, DM Sans, Work Sans).
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
    "DM Serif Display": "DM+Serif+Display:ital,wght@0,400;1,400",
  },
  sans: {
    // Humanist / neutral
    Inter: "Inter:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
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
// buckets — users can put a sans face in the serif slot or vice
// versa, so we don't constrain the lookup to one bucket.
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
  // Same font picked twice → only request it once. Avoids `&family=X&family=X`
  // which Google Fonts handles fine but inflates the URL.
  if (serifSeg === sansSeg) {
    return `https://fonts.googleapis.com/css2?family=${serifSeg}&display=swap`;
  }
  return `https://fonts.googleapis.com/css2?family=${serifSeg}&family=${sansSeg}&display=swap`;
}

export function defaultGoogleFontsUrl(): string {
  return buildGoogleFontsUrl(DEFAULT_FONT_SERIF, DEFAULT_FONT_SANS);
}

export function buildAllFontsPreviewUrl(): string {
  const families = [
    ...Object.keys(FONT_PRESETS.serif),
    ...Object.keys(FONT_PRESETS.sans),
  ];
  const segments = families.map((name) => `family=${name.replace(/ /g, "+")}`);
  return `https://fonts.googleapis.com/css2?${segments.join("&")}&display=swap`;
}

// Hex (`#RRGGBB` or `#RGB`) → space-separated RGB triplet ("r g b").
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
// defaults exactly, returns `baseCssText` untouched.
export function buildCustomCss(baseCssText: string, style: StyleOverrides): string {
  const filteredVars: Record<string, string> = {};
  for (const [key, value] of Object.entries(style.vars ?? {})) {
    if (value && value.trim()) filteredVars[key] = value.trim();
  }
  const fontSerif = style.fontSerif || DEFAULT_FONT_SERIF;
  const fontSans = style.fontSans || DEFAULT_FONT_SANS;
  const fontChanged =
    fontSerif !== DEFAULT_FONT_SERIF || fontSans !== DEFAULT_FONT_SANS;
  const hasOverrides = Object.keys(filteredVars).length > 0;

  if (!fontChanged && !hasOverrides) return baseCssText;

  let output = baseCssText;
  if (fontChanged) {
    const newUrl = buildGoogleFontsUrl(fontSerif, fontSans);
    // Non-global replace: only the FIRST @import is touched (the
    // editable Google Fonts pair). Material Symbols stays put.
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

  const fontDecls = fontChanged
    ? `--font-serif:${quoteFontName(fontSerif)};--font-sans:${quoteFontName(fontSans)};`
    : "";

  output += `\n:root{${fontDecls}${decls}}\n`;
  return output;
}

// Uploads the customized theme CSS to Flexweg.
export async function applyAndUploadCustomCss(args: {
  baseCssText: string;
  style: StyleOverrides;
}): Promise<void> {
  const css = buildCustomCss(args.baseCssText, args.style);
  await uploadFile({
    path: `theme-assets/storefront.css`,
    content: css,
    encoding: "utf-8",
  });
}
