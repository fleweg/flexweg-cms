import type { Post } from "@flexweg/cms-runtime";
import { postSortMillis } from "@flexweg/cms-runtime";
import { getCurrentPublishContext } from "@flexweg/cms-runtime";
import type { PublishContext } from "@flexweg/cms-runtime";
import { decodeAttrs } from "./util";
import { renderMagazineHero, type MagazineHeroAttrs } from "./magazineHero/render";
import { renderMostRead, type MostReadAttrs } from "./mostRead/render";
import { renderPromoCard, type PromoCardAttrs } from "./promoCard/render";

// Magazine theme's body-marker pipeline. Identical structure to the
// default theme's transforms.ts — different namespace + different
// block set. See default's transforms.ts for the design rationale
// behind two-pass scan + DOM-order resolution.

const MARKER_REGEX = /<div\s+([^>]*data-cms-block="magazine\/([\w-]+)"[^>]*)>\s*<\/div>/g;

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
  current: Post;
  used: Set<string>;
}

function renderMarker(marker: ParsedMarker, env: RenderEnv): string {
  switch (marker.blockId) {
    case "hero-split": {
      const attrs = decodeAttrs<MagazineHeroAttrs>(marker.attrsRaw, {});
      const result = renderMagazineHero(attrs, env);
      for (const id of result.consumedPostIds) env.used.add(id);
      return result.html;
    }
    case "most-read": {
      const attrs = decodeAttrs<MostReadAttrs>(marker.attrsRaw, {});
      const result = renderMostRead(attrs, env);
      return result.html;
    }
    case "promo-card": {
      const attrs = decodeAttrs<PromoCardAttrs>(marker.attrsRaw, {});
      const result = renderPromoCard(attrs, { ctx: env.ctx });
      return result.html;
    }
    default:
      return "";
  }
}

// Pre-pass mirrors default's: walk every magazine-hero marker and
// reserve its featured post id BEFORE the main render pass. That way
// blocks rendered above the hero don't end up referencing the same
// featured post.
function preReserveHeroes(markers: ParsedMarker[], env: RenderEnv): void {
  for (const marker of markers) {
    if (marker.blockId !== "hero-split") continue;
    const attrs = decodeAttrs<MagazineHeroAttrs>(marker.attrsRaw, {});
    const id = resolveHeroPostId(attrs, env);
    if (id) env.used.add(id);
  }
}

function resolveHeroPostId(attrs: MagazineHeroAttrs, env: RenderEnv): string | null {
  if (attrs.featuredPostId && attrs.featuredPostId !== "latest" && attrs.featuredPostId !== "auto") {
    return attrs.featuredPostId;
  }
  const candidates = env.ctx.posts
    .filter((p) => p.status === "online" && p.id !== env.current.id)
    .sort((a, b) => postSortMillis(b) - postSortMillis(a));
  return candidates[0]?.id ?? null;
}

export function transformBodyHtml(html: string, post: Post): string {
  if (!html.includes('data-cms-block="magazine/')) return html;
  const ctx = getCurrentPublishContext();
  if (!ctx) {
    return html.replace(MARKER_REGEX, "");
  }

  const markers = parseMarkers(html);
  if (markers.length === 0) return html;

  const env: RenderEnv = { ctx, current: post, used: new Set<string>() };
  preReserveHeroes(markers, env);

  const replacements = new Map<number, string>();
  for (const marker of markers) {
    replacements.set(marker.index, renderMarker(marker, env));
  }

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
