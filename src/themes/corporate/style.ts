import { uploadFile } from "@flexweg/cms-runtime";

// Corporate theme — runtime style customization. Mirrors the magazine
// theme's style.ts but tailored for a single-font system: the
// corporate aesthetic is monotype Inter per DESIGN.md, so we only
// expose one font slot (sans) instead of the editorial pair. Colors
// remain stored as RGB triplets so the `rgb(var(--color-X) / <alpha-value>)`
// formula keeps working for Tailwind's alpha-modifier syntax
// (`bg-primary/50`).

export type ThemeVarGroup = "surfaces" | "foreground" | "outlines" | "accent";

export interface ThemeVarSpec {
  // CSS custom property name including the leading `--`.
  name: string;
  type: "color" | "length";
  group: ThemeVarGroup;
  // i18n key resolved against the theme-corporate namespace.
  labelKey: string;
  // Built-in value as exposed to the form. Colors are stored as hex
  // even though the underlying CSS uses RGB triplets — `<input
  // type="color">` only emits hex, and `compileCss` converts on the
  // way to the published CSS.
  defaultValue: string;
}

// Material 3 token list editable through the Style tab. Keep in sync
// with the `:root` block in theme.css (those values are the same hex
// codes converted to RGB triplets at compile time).
export const THEME_VAR_SPECS: ThemeVarSpec[] = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#f7f9fb" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#f7f9fb" },
  { name: "--color-surface-container-lowest", type: "color", group: "surfaces", labelKey: "vars.surfaceLowest", defaultValue: "#ffffff" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f2f4f6" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#eceef0" },
  { name: "--color-surface-container-high", type: "color", group: "surfaces", labelKey: "vars.surfaceHigh", defaultValue: "#e6e8ea" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#191c1e" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#45474c" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#75777d" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c5c6cd" },
  // Accent — the navy primary + indigo secondary + sky tertiary triple
  // is the heart of the corporate identity. Defaults match
  // DESIGN.md / Stitch mockup exactly.
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#091426" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-primary-container", type: "color", group: "accent", labelKey: "vars.primaryContainer", defaultValue: "#1e293b" },
  { name: "--color-on-primary-container", type: "color", group: "accent", labelKey: "vars.onPrimaryContainer", defaultValue: "#8590a6" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#4b41e1" },
  { name: "--color-on-secondary", type: "color", group: "accent", labelKey: "vars.onSecondary", defaultValue: "#ffffff" },
  { name: "--color-tertiary", type: "color", group: "accent", labelKey: "vars.tertiary", defaultValue: "#001624" },
  { name: "--color-tertiary-container", type: "color", group: "accent", labelKey: "vars.tertiaryContainer", defaultValue: "#002c42" },
];

export const THEME_VAR_GROUPS: ThemeVarGroup[] = [
  "surfaces",
  "foreground",
  "outlines",
  "accent",
];

// Curated single-font choices. Inter is the default — DESIGN.md
// specifies it explicitly as the SaaS / corporate aesthetic. The
// alternatives are similarly utilitarian and well-suited for both
// long-form copy and dense UI surfaces.
export const FONT_PRESETS = {
  sans: {
    Inter: "Inter:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
  },
} as const;

export const DEFAULT_FONT_SANS = "Inter";

export interface StyleOverrides {
  vars: Record<string, string>;
  fontSans: string;
}

export const DEFAULT_STYLE: StyleOverrides = {
  vars: {},
  fontSans: DEFAULT_FONT_SANS,
};

// Curated graphic presets — pick one to fill every Style field in a
// single action; the admin can then fine-tune individual fields. The
// `vars` map can be partial: missing keys fall back to the spec
// defaults via `resolveVar`. "classic" is the baseline (matches
// DEFAULT_STYLE with empty vars). Note: single-font system (Inter +
// alternatives) — no fontSerif slot.
export interface StylePreset {
  id: string;
  swatch: [string, string, string, string];
  vars: Record<string, string>;
  fontSans: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "classic",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {},
    fontSans: DEFAULT_FONT_SANS,
  },
  {
    id: "tech",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fafafa",
      "--color-surface": "#fafafa",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f4f4f5",
      "--color-surface-container": "#e9e9eb",
      "--color-surface-container-high": "#dededf",
      "--color-on-surface": "#0a0a0a",
      "--color-on-surface-variant": "#3f3f46",
      "--color-outline": "#71717a",
      "--color-outline-variant": "#d4d4d8",
      "--color-primary": "#0a0a0a",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#262626",
      "--color-on-primary-container": "#a1a1aa",
      "--color-secondary": "#06b6d4",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#000000",
      "--color-tertiary-container": "#1a1a1a",
    },
    fontSans: "Plus Jakarta Sans",
  },
  {
    id: "trust",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#f7f4ed",
      "--color-surface": "#f7f4ed",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#efebe1",
      "--color-surface-container": "#e6e1d4",
      "--color-surface-container-high": "#ddd7c8",
      "--color-on-surface": "#1a1612",
      "--color-on-surface-variant": "#46403a",
      "--color-outline": "#8a8478",
      "--color-outline-variant": "#cfc8b8",
      "--color-primary": "#1e3a5f",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#2d4d7a",
      "--color-on-primary-container": "#a8bcd4",
      "--color-secondary": "#c4882d",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#172a45",
      "--color-tertiary-container": "#1e3a5f",
    },
    fontSans: "IBM Plex Sans",
  },
  {
    id: "vibrant",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fdfcfb",
      "--color-surface": "#fdfcfb",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f7f3f1",
      "--color-surface-container": "#f0eae7",
      "--color-surface-container-high": "#e8e0dc",
      "--color-on-surface": "#1a0a0a",
      "--color-on-surface-variant": "#3a2828",
      "--color-outline": "#7a5a5a",
      "--color-outline-variant": "#cdb5b5",
      "--color-primary": "#e91e63",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#c2185b",
      "--color-on-primary-container": "#ffd4e3",
      "--color-secondary": "#f97316",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#9c1a4a",
      "--color-tertiary-container": "#c2185b",
    },
    fontSans: "DM Sans",
  },
  {
    id: "executive",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fbf9f6",
      "--color-surface": "#fbf9f6",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f3f0ea",
      "--color-surface-container": "#ebe7df",
      "--color-surface-container-high": "#e3ddd3",
      "--color-on-surface": "#1c1626",
      "--color-on-surface-variant": "#3f3a4d",
      "--color-outline": "#7c7790",
      "--color-outline-variant": "#cac4d8",
      "--color-primary": "#3b1f5b",
      "--color-on-primary": "#fbf9f6",
      "--color-primary-container": "#5a3b87",
      "--color-on-primary-container": "#d4c4ec",
      "--color-secondary": "#a87c2c",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#2a1846",
      "--color-tertiary-container": "#3b1f5b",
    },
    fontSans: "Manrope",
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

// Builds the Google Fonts URL used at the top of theme.css.
// `compileCss` feeds the result back into the CSS as a single
// `@import url(...)`.
export function buildGoogleFontsUrl(sans: string): string {
  const sansSeg =
    (FONT_PRESETS.sans as Record<string, string>)[sans] ??
    FONT_PRESETS.sans[DEFAULT_FONT_SANS];
  return `https://fonts.googleapis.com/css2?family=${sansSeg}&display=swap`;
}

export function defaultGoogleFontsUrl(): string {
  return buildGoogleFontsUrl(DEFAULT_FONT_SANS);
}

// Used by the FontSelect component to render each option in its own
// face. Loads weight 400 of every curated font so previews show the
// right typography without bloating with heavier weights.
export function buildAllFontsPreviewUrl(): string {
  const families = Object.keys(FONT_PRESETS.sans);
  const segments = families.map((name) => `family=${name.replace(/ /g, "+")}`);
  return `https://fonts.googleapis.com/css2?${segments.join("&")}&display=swap`;
}

// Hex (`#RRGGBB` or `#RGB`) → space-separated RGB triplet ("r g b") —
// the format the corporate theme's `:root` block expects so Tailwind's
// `rgb(var(--color-X) / <alpha-value>)` formula keeps working.
// Non-hex values pass through unchanged so power users can paste
// arbitrary CSS.
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
// defaults exactly (no var overrides, default font), we return
// `baseCssText` untouched — `Sync theme assets` then pushes the
// bundled CSS verbatim.
//
// Two transformations:
//   1. Replace the first `@import url(...)` (Inter) with the user's
//      chosen font. The Material Symbols @import sits second in the
//      file so it stays untouched (non-global replace = first match
//      only).
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
  const fontSans = style.fontSans || DEFAULT_FONT_SANS;
  const fontChanged = fontSans !== DEFAULT_FONT_SANS;
  const hasOverrides = Object.keys(filteredVars).length > 0;

  if (!fontChanged && !hasOverrides) return baseCssText;

  let output = baseCssText;
  if (fontChanged) {
    const newUrl = buildGoogleFontsUrl(fontSans);
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

  const fontDecls = fontChanged ? `--font-sans:${quoteFontName(fontSans)};` : "";

  output += `\n:root{${fontDecls}${decls}}\n`;
  return output;
}

// Uploads the customized theme CSS to Flexweg. Path is the same as the
// baseline (`theme-assets/corporate.css`) so every published page
// picks up the new look on its next load — no per-page republish
// needed.
export async function applyAndUploadCustomCss(args: {
  baseCssText: string;
  style: StyleOverrides;
}): Promise<void> {
  const css = buildCustomCss(args.baseCssText, args.style);
  await uploadFile({
    path: `theme-assets/corporate.css`,
    content: css,
    encoding: "utf-8",
  });
}
