// Multi-language helpers shared across the marketplace-core theme.
//
// Marketplace Core is a static-rendered theme (no runtime menu loader)
// so per-locale links + labels have to be resolved at publish time.
// The helpers in this file derive the locale prefix from
// `SiteContext.homePath` (which the publisher sets per render — e.g.
// `/index.html` for primary, `/fr/index.html` for secondary) and pick
// the right per-language menu label from `ResolvedMenuItem.labels`.

import type { ResolvedMenuItem } from "@flexweg/cms-runtime";

// Returns "" on the primary-language page, or "/<lang>" on a
// secondary-language page. Drives every hardcoded link in the theme
// (sidebar items, bottom nav, breadcrumb "Home", "See all" links on
// the home page, 404 back-home) so they stay inside the current
// locale.
export function localePrefix(homePath?: string): string {
  if (!homePath) return "";
  const cleaned = homePath
    .replace(/^\/+/, "")
    .replace(/\/?index\.html?$/i, "");
  return cleaned ? `/${cleaned}` : "";
}

// Resolves the active page locale: explicit `currentLocale` wins, then
// falls back to the site-wide language, then "en". Used to feed the
// theme's i18n bundle so per-page strings ("Description", "See all",
// "Free", …) render in the right language on localized homes /
// archives / single pages.
export function resolveLocale(
  currentLocale: string | undefined,
  siteLanguage: string | undefined,
): string {
  return currentLocale || siteLanguage || "en";
}

// Picks the per-language label set by the admin on each menu item
// (`MenuItem.translations[lang].label` → projected onto
// `ResolvedMenuItem.labels[lang]` by the core resolver). Falls back to
// the region-stripped code (`fr-CA` → `fr`), then to the primary
// `item.label` for any locale without an override. Mirrors the
// `pickLabel()` helper baked into the runtime menu-loaders of the
// other in-tree themes — kept consistent so site-wide menu authoring
// behaves identically across themes.
export function pickItemLabel(item: ResolvedMenuItem, locale?: string): string {
  if (!locale || !item.labels) return item.label;
  if (item.labels[locale]) return item.labels[locale];
  const base = locale.includes("-") ? locale.split("-")[0] : null;
  if (base && item.labels[base]) return item.labels[base];
  return item.label;
}
