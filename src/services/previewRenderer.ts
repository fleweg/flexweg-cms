import type { AuthorView } from "../themes/types";
import type { Media, Post, SiteSettings, Term, UserRecord } from "../core/types";
import type { PublishContext } from "./publisher";
import { renderPreviewHtml } from "./publisher";
import { getActiveTheme } from "../themes";

interface RenderPostPreviewOpts {
  // The current editor draft. Required fields: id, type, title, slug,
  // contentMarkdown. Other fields fall through to defaults / undefined.
  // For an unsaved post the caller should mint a synthetic id (any
  // string that doesn't collide with real ones) so the patched ctx is
  // self-consistent.
  draft: Post;
  // Same shape as PublishContext fields — passed straight from
  // useCmsData by the editor page. We avoid calling
  // buildPublishContext to skip its listAllMedia fetch (the editor
  // already has the media subscription warm).
  posts: Post[];
  pages: Post[];
  terms: Term[];
  media: Media[];
  settings: SiteSettings;
  users: UserRecord[];
  authorLookup: (id: string) => AuthorView | undefined;
}

// Renders a post's preview HTML using the same pipeline as the
// publisher, with two preview-specific tweaks applied to the result:
//
//   1. The /theme-assets/<id>.css stylesheet link is replaced by an
//      inline <style> tag carrying the theme's locally-bundled CSS
//      (compiled via theme.compileCss when present, otherwise the
//      bundled cssText). Lets the preview reflect Theme Settings
//      changes the user hasn't synced yet.
//
//   2. <script src="/theme-assets/<id>-*.js"> tags are stripped.
//      Their loaders fetch /menu.json and /posts.json from the
//      published origin which the iframe doesn't have a base for —
//      stripping is preferable to broken JS errors in the preview's
//      console. Header / related-posts widgets render empty in V1;
//      good enough for body / hero / blocks visual review.
export async function renderPostPreview(opts: RenderPostPreviewOpts): Promise<string> {
  const ctx = buildPreviewContext(opts);
  const html = await renderPreviewHtml(opts.draft, ctx);
  return postProcessForIframe(html, opts.settings);
}

// Builds the in-memory PublishContext used by the preview pipeline.
// Patches the draft into both posts and pages arrays (replacing any
// existing record with the same id) so renderSingle / renderHome
// resolve the latest editor state. Also forces the draft to status
// "online" so renderHome's `find(p => …status === "online")` pick
// includes it when previewing a draft page that's bound to the home.
function buildPreviewContext(opts: RenderPostPreviewOpts): PublishContext {
  const mediaMap = new Map<string, Media>();
  for (const m of opts.media) mediaMap.set(m.id, m);

  const draftAsOnline: Post = {
    ...opts.draft,
    status: "online",
  };

  const patchedPosts =
    opts.draft.type === "post"
      ? upsert(opts.posts, draftAsOnline)
      : opts.posts;
  const patchedPages =
    opts.draft.type === "page"
      ? upsert(opts.pages, draftAsOnline)
      : opts.pages;

  return {
    posts: patchedPosts,
    pages: patchedPages,
    terms: opts.terms,
    media: mediaMap,
    settings: opts.settings,
    users: opts.users,
    authorLookup: opts.authorLookup,
  };
}

function upsert(list: Post[], item: Post): Post[] {
  const idx = list.findIndex((p) => p.id === item.id);
  if (idx === -1) return [item, ...list];
  const next = list.slice();
  next[idx] = item;
  return next;
}

// Replaces /theme-assets/<id>.css link with the bundled CSS (resolved
// through compileCss when the theme provides one). Removes any
// /theme-assets/<id>-*.js script tag — see top-of-file comment.
function postProcessForIframe(html: string, settings: SiteSettings): string {
  const theme = getActiveTheme(settings.activeThemeId);
  // Same resolution path as the Sync flow: defaults merged with the
  // user's stored theme config, then handed to compileCss when the
  // theme provides one. Falls back to the raw cssText otherwise.
  let css = theme.cssText;
  if (theme.compileCss && theme.settings) {
    const stored = (settings.themeConfigs as Record<string, unknown> | undefined)?.[theme.id];
    const config = {
      ...(theme.settings.defaultConfig as object),
      ...((stored as object) ?? {}),
    };
    try {
      // The compileCss generic parameter is `unknown` in the public
      // API; the cast here is the same widening the Sync flow does.
      css = (theme.compileCss as (c: unknown) => string)(config);
    } catch {
      // Fall back to the bundled cssText on any error inside the
      // theme's compileCss — preserves preview availability.
    }
  }

  let out = html;
  // Replace the theme stylesheet link with an inline <style>.
  out = out.replace(
    /<link\s+rel="stylesheet"\s+href="[^"]*theme-assets\/[^"]*\.css[^"]*"[^>]*>/g,
    `<style data-cms-preview-css>${css}</style>`,
  );
  // Strip theme-bundled JS (menu loader, posts loader). These need
  // /menu.json / /posts.json which aren't reachable from the iframe.
  out = out.replace(
    /<script[^>]+src="[^"]*theme-assets\/[^"]+\.js"[^>]*><\/script>/g,
    "",
  );
  return out;
}
