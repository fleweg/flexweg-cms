import type { Post } from "../../../../core/types";
import type { PublishContext } from "../../../../services/publisher";
import { mediaToView, pickFormat } from "../../../../core/media";
import { buildPostUrl, buildTermUrl } from "../../../../core/slug";
import { escapeAttr, escapeText } from "../util";

export interface LatestListAttrs {
  // Number of items to render. Cards alternate image-left / image-right
  // for visual rhythm (matches the editorial mockup).
  count?: number;
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
  used: Set<string>;
}

export interface LatestListRenderResult {
  html: string;
  consumedPostIds: string[];
}

// Renders one article as a 2-col image+text card. `alternate` flips
// the image to the right column on every other card — matches the
// mockup's editorial rhythm.
function renderArticleCard(post: Post, env: RenderEnv, alternate: boolean): string {
  const term = post.primaryTermId
    ? env.ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
  const heroMedia = mediaToView(env.ctx.media.get(post.heroMediaId ?? ""));
  const imageUrl = pickFormat(heroMedia, "medium");
  const author = post.authorId ? env.ctx.authorLookup(post.authorId) : undefined;

  const imageOrder = alternate ? "md:order-2" : "";
  const textOrder = alternate ? "md:order-1" : "";

  const categoryHtml = term
    ? `<a href="/${escapeAttr(buildTermUrl(term))}" class="block text-secondary uppercase tracking-widest text-xs font-semibold">${escapeText(term.name)}</a>`
    : "";

  const titleHtml = `<h3 class="font-serif text-2xl font-medium text-on-surface group-hover:underline decoration-1"><a href="${escapeAttr(url)}">${escapeText(post.title)}</a></h3>`;
  const excerptHtml = post.excerpt
    ? `<p class="text-base text-on-surface-variant">${escapeText(post.excerpt)}</p>`
    : "";

  const authorAvatar = author?.avatar ? pickFormat(author.avatar, "small") : "";
  const authorHtml = author
    ? `<div class="flex items-center gap-stack-sm pt-stack-sm">`
      + (authorAvatar
        ? `<img class="w-8 h-8 rounded-full bg-surface-container object-cover" src="${escapeAttr(authorAvatar)}" alt="${escapeAttr(author.displayName)}" loading="lazy" />`
        : `<div class="w-8 h-8 rounded-full bg-surface-container"></div>`)
      + `<span class="text-sm text-on-surface">${escapeText(author.displayName)}</span>`
      + `</div>`
    : "";

  // Aspect ratio is responsive: 16:9 on mobile (1-col layout, image
  // sits above the text) and 1:1 from `md:` up where the image is
  // placed side-by-side with the text in a 2-col grid. Matches the
  // editorial mockup's mobile/desktop split.
  const imageHtml = imageUrl
    ? `<div class="aspect-video md:aspect-square overflow-hidden bg-surface-container ${imageOrder}"><a href="${escapeAttr(url)}" tabindex="-1" aria-hidden="true" class="block group"><img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="lazy" /></a></div>`
    : `<div class="${imageOrder}"></div>`;

  return `<article class="grid md:grid-cols-2 gap-stack-md items-start group">${imageHtml}<div class="flex flex-col justify-center h-full space-y-stack-sm ${textOrder}">${categoryHtml}${titleHtml}${excerptHtml}${authorHtml}</div></article>`;
}

// Public-side "Latest Intelligence" list. Used by the magazine home —
// the publisher reserves the magazine-hero's posts in `env.used` first,
// so this list never duplicates those items.
export function renderLatestList(attrs: LatestListAttrs, env: RenderEnv): LatestListRenderResult {
  const count = Math.max(1, Math.min(24, attrs.count ?? 6));
  const candidates = env.ctx.posts
    .filter((p) => p.status === "online" && p.id !== env.current.id && !env.used.has(p.id))
    .sort(
      (a, b) =>
        (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0),
    )
    .slice(0, count);

  if (!candidates.length) return { html: "", consumedPostIds: [] };

  const articlesHtml = candidates
    .map((post, idx) => renderArticleCard(post, env, idx % 2 === 1))
    .join("");

  return {
    html: `<div class="space-y-stack-lg">${articlesHtml}</div>`,
    consumedPostIds: candidates.map((p) => p.id),
  };
}
