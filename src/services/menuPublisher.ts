import { applyFilters } from "../core/pluginRegistry";
import { resolveMenuItems, type ResolvedMenuItem } from "../core/menuResolver";
import type { Post, SiteSettings, Term } from "../core/types";
import { uploadFile } from "./flexwegApi";

// Path on Flexweg where the dynamic menu blob lives. Grouped under
// `data/` alongside the other content snapshots (posts.json,
// authors.json) so the public-site root stays uncluttered. Loaders
// fetch absolute URLs (`/data/menu.json`), so folder depth has no
// effect on resolution.
export const MENU_JSON_PATH = "data/menu.json";

export interface MenuJsonBranding {
  // Absolute URL of the active theme's logo, including a cache-bust
  // query (`?v=<logoUpdatedAt>`). Set when the active theme has a
  // logo upload feature enabled in its settings; absent otherwise.
  // The runtime menu loader replaces the static text wordmark with an
  // <img> when this is present — so admins can swap the logo without
  // re-publishing every post HTML.
  logoUrl?: string;
}

export interface MenuJson {
  header: ResolvedMenuItem[];
  footer: ResolvedMenuItem[];
  branding?: MenuJsonBranding;
}

// Resolves the branding block from the active theme's stored config.
// Convention: a theme that wants to expose a logo uploads it to
// `theme-assets/<id>-logo.webp` and stores `{ logoEnabled, logoUpdatedAt }`
// in its theme config. We don't enforce the shape — themes that opt
// out simply leave `logoEnabled` falsy and get no branding object.
function resolveBranding(settings: SiteSettings): MenuJsonBranding | undefined {
  const themeId = settings.activeThemeId;
  const config = (settings.themeConfigs as Record<string, unknown> | undefined)?.[themeId] as
    | { logoEnabled?: boolean; logoUpdatedAt?: number }
    | undefined;
  if (!config?.logoEnabled) return undefined;
  const v = config.logoUpdatedAt ?? 0;
  return {
    logoUrl: `/theme-assets/${themeId}-logo.webp?v=${v}`,
  };
}

// Context handed to plugins via the `menu.json.resolved` filter hook.
// Lets handlers compute additional menu items from arbitrary site data
// (e.g. flexweg-rss appends one footer entry per enabled RSS feed).
export interface MenuFilterContext {
  settings: SiteSettings;
  posts: Post[];
  pages: Post[];
  terms: Term[];
}

// Builds the JSON shape uploaded to Flexweg. Pure function — no API
// access — so callers can pre-compute and reuse / cache it. The shape is
// deliberately minimal: only fields the public-side menu loader actually
// reads. Adding more (icons, descriptions) is a non-breaking change.
export function buildMenuJson(
  settings: SiteSettings,
  posts: Post[],
  pages: Post[],
  terms: Term[],
): MenuJson {
  const ctx = { posts, pages, terms };
  return {
    header: resolveMenuItems(settings.menus.header ?? [], ctx),
    footer: resolveMenuItems(settings.menus.footer ?? [], ctx),
    branding: resolveBranding(settings),
  };
}

// Resolves the current menus and uploads the result as `/menu.json` on
// Flexweg. Called whenever the menu, a referenced post slug, or a
// referenced category slug changes — far cheaper than re-rendering every
// HTML page that embeds the menu, and the public-side loader picks up
// the change on the next page load.
//
// Before upload, the resolved shape passes through the `menu.json.resolved`
// filter so plugins can append their own entries (e.g. RSS feed links).
//
// We deliberately don't track a "lastPublishedHash" here: the file is
// tiny (~1-5 KB) and the Flexweg upload deduplicates server-side, so the
// extra round-trip on a no-op write isn't worth the bookkeeping. If perf
// ever matters, hash + skip pattern from publisher.uploadIfChanged is
// trivially portable here.
export async function publishMenuJson(
  settings: SiteSettings,
  posts: Post[],
  pages: Post[],
  terms: Term[],
): Promise<void> {
  const menu = buildMenuJson(settings, posts, pages, terms);
  const filterCtx: MenuFilterContext = { settings, posts, pages, terms };
  const final = await applyFilters<MenuJson>("menu.json.resolved", menu, filterCtx);
  await uploadFile({
    path: MENU_JSON_PATH,
    content: JSON.stringify(final),
    encoding: "utf-8",
  });
}
