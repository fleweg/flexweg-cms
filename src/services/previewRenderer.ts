import type { AuthorView } from "../themes/types";
import type { Media, Post, SiteSettings, Term, UserRecord } from "../core/types";
import type { PublishContext } from "./publisher";
import { renderPreviewHtml } from "./publisher";
import { getActiveTheme } from "../themes";
import { buildMenuJson } from "./menuPublisher";
import { buildPostsJson } from "./postsJsonPublisher";
import { buildAuthorsJson } from "./authorsJsonPublisher";

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
// publisher, with three preview-specific tweaks applied to the
// result before it ships to the iframe:
//
//   1. The /theme-assets/<id>.css stylesheet link is replaced by an
//      inline <style> tag carrying the theme's locally-bundled CSS
//      (compiled via theme.compileCss when present, otherwise the
//      bundled cssText). Lets the preview reflect Theme Settings
//      changes the user hasn't synced yet.
//
//   2. <script src="/theme-assets/<id>-*.js"> tags are replaced by
//      inline <script> blocks carrying the manifest's jsText /
//      jsTextPosts. Same reason as the CSS swap — preview should
//      reflect un-synced theme JS. The loaders run as-is.
//
//   3. A bootstrap <script> is injected into <head> ahead of the
//      loaders. It pre-computes /data/{menu,posts,authors}.json from
//      the same builders the publisher uses and patches window.fetch
//      so the loaders see them on their normal fetch paths. Means
//      burger menu, branding, related-posts and author bio all
//      render live in the preview — without touching the loaders.
export async function renderPostPreview(opts: RenderPostPreviewOpts): Promise<string> {
  const ctx = buildPreviewContext(opts);
  const html = await renderPreviewHtml(opts.draft, ctx);
  return postProcessForIframe(html, ctx, opts.settings);
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

// Replaces /theme-assets/<id>.css link with bundled CSS, replaces
// the theme JS <script src> tags with inline <script> blocks, and
// injects a small bootstrap that pre-fills the data the loaders
// would normally fetch.
function postProcessForIframe(
  html: string,
  ctx: PublishContext,
  settings: SiteSettings,
): string {
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

  // Inline the theme JS instead of stripping. Order:
  //   1. fetch-mock bootstrap (sets window.fetch to return our
  //      pre-built JSON for the loader paths)
  //   2. menu-loader (uses fetch internally — picks up our mock)
  //   3. posts-loader (same)
  // Bootstrap runs before the loaders thanks to head-injection
  // before the </head> tag and the loaders living at the bottom of
  // body — but to be safe we wrap the bootstrap to set up the
  // override synchronously regardless of insertion point.
  const bootstrap = buildPreviewBootstrap(ctx, settings);

  // Replace the menu / posts loader <script src> tags with their
  // inline equivalents. We match by data-attribute or by suffix.
  if (theme.jsText) {
    out = out.replace(
      /<script[^>]+src="[^"]*theme-assets\/[^"]+-menu\.js"[^>]*><\/script>/g,
      `<script>${theme.jsText}</script>`,
    );
  }
  if (theme.jsTextPosts) {
    out = out.replace(
      /<script[^>]+src="[^"]*theme-assets\/[^"]+-posts\.js"[^>]*><\/script>/g,
      `<script>${theme.jsTextPosts}</script>`,
    );
  }
  // Drop any remaining theme-assets JS tag — defensive net so a
  // newly added theme script doesn't 404 in the iframe.
  out = out.replace(
    /<script[^>]+src="[^"]*theme-assets\/[^"]+\.js"[^>]*><\/script>/g,
    "",
  );

  // Inject the bootstrap right after the <head> open tag so it runs
  // before any other script. Falls back to prepending into <html>
  // if no <head> match (defensive — every theme template has one).
  if (out.includes("<head>")) {
    out = out.replace("<head>", `<head>${bootstrap}`);
  } else {
    out = bootstrap + out;
  }
  return out;
}

// Builds the inline bootstrap script that pre-populates JSON data
// for the theme's loaders. Three datasets:
//   - /data/menu.json (used by menu-loader to paint header / drawer)
//   - /data/posts.json (used by posts-loader for related / latest)
//   - /data/authors.json (same loader, fills AuthorBio sidebar)
//
// We patch window.fetch instead of pre-setting globals because the
// loaders use plain fetch — leaving the loader source unchanged
// means they keep working identically on the public site.
function buildPreviewBootstrap(ctx: PublishContext, settings: SiteSettings): string {
  const menuJson = buildMenuJson(settings, ctx.posts, ctx.pages, ctx.terms);
  const postsJson = buildPostsJson(
    settings,
    ctx.posts,
    ctx.pages,
    ctx.terms,
    ctx.media,
  );
  const authorsJson = buildAuthorsJson(ctx.users, ctx.media, ctx.posts, ctx.pages);

  const payload = {
    menu: menuJson,
    posts: postsJson,
    authors: authorsJson,
  };
  // Encode as JSON string and embed inside a <script>. Closing
  // </script> sequences inside the data would prematurely terminate
  // the tag — escape the / so the payload stays inert. Same gotcha
  // as inline <script type="application/json">.
  const json = JSON.stringify(payload).replace(/<\/script>/g, "<\\/script>");

  return `<script data-cms-preview-bootstrap>(function(){
var data=${json};
var origFetch=window.fetch;
window.fetch=function(input,init){
  var url=typeof input==='string'?input:(input&&input.url)||'';
  if(url.indexOf('/data/menu.json')!==-1){
    return Promise.resolve(new Response(JSON.stringify(data.menu),{headers:{'Content-Type':'application/json'}}));
  }
  if(url.indexOf('/data/posts.json')!==-1){
    return Promise.resolve(new Response(JSON.stringify(data.posts),{headers:{'Content-Type':'application/json'}}));
  }
  if(url.indexOf('/data/authors.json')!==-1){
    return Promise.resolve(new Response(JSON.stringify(data.authors),{headers:{'Content-Type':'application/json'}}));
  }
  return origFetch.apply(this,arguments);
};
})();</script>`;
}
