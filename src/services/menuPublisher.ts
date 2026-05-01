import { applyFilters } from "../core/pluginRegistry";
import { resolveMenuItems, type ResolvedMenuItem } from "../core/menuResolver";
import type { Post, SiteSettings, Term } from "../core/types";
import { uploadFile } from "./flexwegApi";

// Path on Flexweg where the dynamic menu blob lives. Always at the public
// site root because every page (regardless of folder depth) fetches it
// with an absolute path.
export const MENU_JSON_PATH = "menu.json";

export interface MenuJson {
  header: ResolvedMenuItem[];
  footer: ResolvedMenuItem[];
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
