import type { Post } from "../../../core/types";
import { getCurrentPublishContext } from "../../../services/publishContext";
import type { PublishContext } from "../../../services/publisher";
import { decodeAttrs } from "./util";
import { renderHero, type HeroAttrs } from "./hero/render";
import { renderPostsList, type PostsListAttrs } from "./postsList/render";
import { renderCategoryPosts, type CategoryPostsAttrs } from "./categoryPosts/render";
import { renderCta, type CtaAttrs } from "./cta/render";
import { renderCategoriesPills, type CategoriesPillsAttrs } from "./categoriesPills/render";
import { renderSpacer, type SpacerAttrs } from "./spacer/render";

// Two-pass scan + replace for every theme block in a post body.
//
// Pass A — collect: walk markers in document order, for each one
//   record the post ids it pins (Hero's featuredPostId, the page's
//   own id when the block lives on a single post). Builds a `used`
//   set the renderers below consume.
//
// Pass B — render: each block resolves its query against the current
//   PublishContext, excluding `used` ids, and replaces the marker
//   inline. The set is mutated as it goes so the next block's query
//   excludes everything seen so far — order matches the page's DOM,
//   so a block higher up on the page reserves posts against blocks
//   lower down.
//
// The whole pipeline is sequential per page (set up by
// services/publisher.ts via setCurrentPublishContext) so we can
// safely keep the `used` set as a local on the function call.

const MARKER_REGEX = /<div\s+([^>]*data-cms-block="default\/([\w-]+)"[^>]*)>\s*<\/div>/g;

interface ParsedMarker {
  match: string;
  blockId: string;
  attrsRaw: string;
  index: number;
}

function pickAttr(attrsHtml: string, name: string): string {
  const match = attrsHtml.match(
    new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`),
  );
  if (!match) return "";
  return match[1] ?? match[2] ?? match[3] ?? "";
}

function parseMarkers(html: string): ParsedMarker[] {
  const markers: ParsedMarker[] = [];
  // Reset lastIndex on every call — the regex is module-level (with /g)
  // so successive calls would otherwise pick up where the previous left
  // off and miss markers near the start of a new input.
  MARKER_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MARKER_REGEX.exec(html)) !== null) {
    markers.push({
      match: m[0],
      blockId: m[2],
      attrsRaw: pickAttr(m[1], "data-attrs"),
      index: m.index,
    });
  }
  return markers;
}

interface RenderEnv {
  ctx: PublishContext;
  // Page-or-post being rendered. Used by blocks that should not
  // pin themselves (e.g. a Hero on a single-post body would never
  // want to feature the post being viewed) and by blocks that exclude
  // the current post from query results.
  current: Post;
  used: Set<string>;
}

// Renders a single marker's HTML and adds whatever post ids it
// committed to `env.used`. Returns the replacement HTML string. An
// unknown blockId becomes an empty string — drops the marker so the
// page doesn't render a literal `<div data-cms-block=…>`.
function renderMarker(marker: ParsedMarker, env: RenderEnv): string {
  switch (marker.blockId) {
    case "hero": {
      const attrs = decodeAttrs<HeroAttrs>(marker.attrsRaw, {});
      const result = renderHero(attrs, env);
      if (result.consumedPostId) env.used.add(result.consumedPostId);
      return result.html;
    }
    case "posts-list": {
      const attrs = decodeAttrs<PostsListAttrs>(marker.attrsRaw, {});
      const result = renderPostsList(attrs, env);
      for (const id of result.consumedPostIds) env.used.add(id);
      return result.html;
    }
    case "category-posts": {
      const attrs = decodeAttrs<CategoryPostsAttrs>(marker.attrsRaw, {});
      const result = renderCategoryPosts(attrs, env);
      for (const id of result.consumedPostIds) env.used.add(id);
      return result.html;
    }
    case "cta": {
      const attrs = decodeAttrs<CtaAttrs>(marker.attrsRaw, {});
      return renderCta(attrs);
    }
    case "categories-pills": {
      const attrs = decodeAttrs<CategoriesPillsAttrs>(marker.attrsRaw, {});
      return renderCategoriesPills(attrs, env);
    }
    case "spacer": {
      const attrs = decodeAttrs<SpacerAttrs>(marker.attrsRaw, {});
      return renderSpacer(attrs);
    }
    default:
      return "";
  }
}

// Pre-pass: walk every Hero marker and seed `used` with its featured
// post id BEFORE the main render pass. That way a Posts list block
// rendered above a Hero (rare but possible) still excludes the
// featured post — Hero's intent is "this post is the centerpiece",
// regardless of where it ends up in the DOM. For other blocks, DOM
// order is the natural reservation ordering.
function preReserveHeroes(markers: ParsedMarker[], env: RenderEnv): void {
  for (const marker of markers) {
    if (marker.blockId !== "hero") continue;
    const attrs = decodeAttrs<HeroAttrs>(marker.attrsRaw, {});
    const id = resolveHeroPostId(attrs, env);
    if (id) env.used.add(id);
  }
}

// Resolves the Hero's effective post id (sentinel "latest" → newest
// online post, otherwise the explicit id). Lives here because
// preReserveHeroes needs it without invoking the full renderer.
function resolveHeroPostId(attrs: HeroAttrs, env: RenderEnv): string | null {
  if (attrs.featuredPostId && attrs.featuredPostId !== "latest") {
    return attrs.featuredPostId;
  }
  // "latest" sentinel — first online post that isn't the page being
  // rendered (so a Hero on a single post never points back at itself).
  const candidates = env.ctx.posts
    .filter((p) => p.status === "online" && p.id !== env.current.id)
    .sort((a, b) => (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0));
  return candidates[0]?.id ?? null;
}

// Public entry point — registered by the theme on `post.html.body`.
// Returns the body with every theme-block marker replaced. When no
// PublishContext is set (e.g. running outside the publisher), every
// marker is dropped silently.
export function transformBodyHtml(html: string, post: Post): string {
  if (!html.includes('data-cms-block="default/')) return html;
  const ctx = getCurrentPublishContext();
  if (!ctx) {
    // No ctx means we can't resolve queries — strip markers so the
    // public site doesn't show literal block markup.
    return html.replace(MARKER_REGEX, "");
  }

  const markers = parseMarkers(html);
  if (markers.length === 0) return html;

  const env: RenderEnv = { ctx, current: post, used: new Set<string>() };
  preReserveHeroes(markers, env);

  // Render in DOM order so subsequent list/category blocks see the
  // posts the previous ones consumed.
  const replacements = new Map<number, string>();
  for (const marker of markers) {
    replacements.set(marker.index, renderMarker(marker, env));
  }

  // Replace each marker by index. Walking once with a re-execed
  // regex keeps positions consistent — string.replace would re-evaluate
  // lastIndex against the mutated input.
  let out = "";
  let cursor = 0;
  MARKER_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MARKER_REGEX.exec(html)) !== null) {
    out += html.slice(cursor, m.index);
    out += replacements.get(m.index) ?? "";
    cursor = m.index + m[0].length;
  }
  out += html.slice(cursor);
  return out;
}
