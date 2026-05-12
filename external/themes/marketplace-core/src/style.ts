import type { MarketplaceStyleOverrides } from "./config";
import { DEFAULT_MARKETPLACE_STYLE } from "./config";

// Hex → "r g b" triplet (the format the theme's `:root` block expects
// so `rgb(var(--color-X))` keeps working).
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

function quoteFont(name: string): string {
  return `"${name.replace(/"/g, '\\"')}"`;
}

// Curated font pool — both buckets are usable for either slot since
// nothing in the theme prevents mixing. Marketplace leans geometric /
// sans but a serif headline can work for premium / editorial themes,
// so both families are offered for both slots.
export const FONT_PRESETS = {
  sans: {
    "Hanken Grotesk": "Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400",
    Inter: "Inter:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Outfit: "Outfit:wght@400;500;600;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700",
    Oswald: "Oswald:wght@400;500;600;700",
    "Barlow Condensed": "Barlow+Condensed:wght@400;500;600;700",
    "Big Shoulders Display": "Big+Shoulders+Display:wght@400;500;600;700",
    Anton: "Anton",
    "Archivo Black": "Archivo+Black",
    "Bowlby One": "Bowlby+One",
    Unbounded: "Unbounded:wght@400;500;600;700",
  },
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
} as const;

// Resolve a font name to its Google Fonts CSS2 spec across both
// buckets. Either slot can hold any name.
function fontSpec(name: string, fallback: string): string {
  const all: Record<string, string> = {
    ...(FONT_PRESETS.sans as Record<string, string>),
    ...(FONT_PRESETS.serif as Record<string, string>),
  };
  return all[name] ?? all[fallback];
}

export function buildGoogleFontsUrl(headline: string, body: string): string {
  const headlineSeg = fontSpec(headline, "Hanken Grotesk");
  const bodySeg = fontSpec(body, "Inter");
  if (headlineSeg === bodySeg) {
    return `https://fonts.googleapis.com/css2?family=${headlineSeg}&display=swap`;
  }
  return `https://fonts.googleapis.com/css2?family=${headlineSeg}&family=${bodySeg}&display=swap`;
}

// URL that loads every preset font at minimal weight — used by the
// settings page so the FontSelect dropdown rows preview in their own
// face before the user even picks one.
export function buildAllFontsPreviewUrl(): string {
  const families = [
    ...Object.keys(FONT_PRESETS.sans),
    ...Object.keys(FONT_PRESETS.serif),
  ];
  const segments = families.map((name) => `family=${name.replace(/ /g, "+")}`);
  return `https://fonts.googleapis.com/css2?${segments.join("&")}&display=swap`;
}

// Compose the final CSS shipped to /theme-assets/marketplace-core.css.
// If there are no overrides we return the bundled CSS verbatim.
export function buildCustomCss(baseCssText: string, style: MarketplaceStyleOverrides): string {
  const merged: MarketplaceStyleOverrides = {
    vars: { ...DEFAULT_MARKETPLACE_STYLE.vars, ...style.vars },
    fontHeadline: style.fontHeadline || DEFAULT_MARKETPLACE_STYLE.fontHeadline,
    fontBody: style.fontBody || DEFAULT_MARKETPLACE_STYLE.fontBody,
  };
  const fontsChanged =
    merged.fontHeadline !== DEFAULT_MARKETPLACE_STYLE.fontHeadline ||
    merged.fontBody !== DEFAULT_MARKETPLACE_STYLE.fontBody;
  const varEntries = Object.entries(merged.vars).filter(([, v]) => v && v.trim());
  if (!fontsChanged && varEntries.length === 0) return baseCssText;

  let output = baseCssText;

  if (fontsChanged) {
    const newUrl = buildGoogleFontsUrl(merged.fontHeadline, merged.fontBody);
    output = output.replace(
      /@import\s+url\(\s*"https:\/\/fonts\.googleapis\.com\/css2[^"]*"\s*\)\s*;/,
      `@import url("${newUrl}");`,
    );
  }

  const decls = varEntries
    .map(([k, v]) => {
      const isColor = k.startsWith("--color-");
      return `${k}:${isColor ? normalizeColor(v) : v};`;
    })
    .join("");
  const fontDecls = fontsChanged
    ? `--font-headline:${quoteFont(merged.fontHeadline)};--font-body:${quoteFont(merged.fontBody)};`
    : "";
  output += `\n:root{${fontDecls}${decls}}\n`;
  return output;
}
