import type { Post } from "../../../../core/types";
import type { PublishContext } from "../../../../services/publisher";
import { mediaToView, pickFormat } from "../../../../core/media";
import { buildPostUrl, buildTermUrl } from "../../../../core/slug";
import { escapeAttr, escapeText } from "../util";

export interface HeroAttrs {
  featuredPostId?: string;
  variant?: "image-overlay" | "split-left" | "split-right" | "minimal";
  showCategory?: boolean;
  showAuthor?: boolean;
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
}

export interface HeroRenderResult {
  html: string;
  // The post id this hero pinned, if any. Caller adds it to the
  // page-wide `used` set so subsequent list blocks exclude it.
  consumedPostId: string | null;
}

function resolveFeatured(attrs: HeroAttrs, env: RenderEnv): Post | null {
  // Explicit id wins, except when it points at a draft / deleted post
  // — fall through to the latest fallback so the block stays useful
  // after content is removed.
  if (attrs.featuredPostId && attrs.featuredPostId !== "latest") {
    const explicit = env.ctx.posts.find(
      (p) => p.id === attrs.featuredPostId && p.status === "online",
    );
    if (explicit) return explicit;
  }
  // "latest" sentinel — newest online post, excluding the page being
  // rendered so a Hero on a single post never points back to itself.
  const candidates = env.ctx.posts
    .filter((p) => p.status === "online" && p.id !== env.current.id)
    .sort((a, b) => (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0));
  return candidates[0] ?? null;
}

export function renderHero(attrs: HeroAttrs, env: RenderEnv): HeroRenderResult {
  const post = resolveFeatured(attrs, env);
  if (!post) {
    return { html: "", consumedPostId: null };
  }

  const variant = attrs.variant ?? "image-overlay";
  const showCategory = attrs.showCategory ?? true;
  const showAuthor = attrs.showAuthor ?? true;

  const term = post.primaryTermId
    ? env.ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
  const heroMedia = mediaToView(env.ctx.media.get(post.heroMediaId ?? ""));
  // Pick the largest available variant for hero use — falls through
  // pickFormat's chain so even legacy single-URL media renders.
  const imageUrl = pickFormat(heroMedia, "large");
  const author = post.authorId ? env.ctx.authorLookup(post.authorId) : undefined;

  const categoryHtml =
    showCategory && term
      ? `<a href="/${escapeAttr(buildTermUrl(term))}" class="cms-hero-category">${escapeText(term.name)}</a>`
      : "";

  // Avatar runs through the same pickFormat chain as hero images —
  // falls back gracefully to the avatar's first available variant
  // (or its legacy single-url for old uploads).
  const avatarUrl = author?.avatar ? pickFormat(author.avatar, "thumbnail") : "";
  const authorHtml =
    showAuthor && author
      ? `<div class="cms-hero-author">${
          avatarUrl
            ? `<img class="cms-hero-author-avatar" src="${escapeAttr(avatarUrl)}" alt="${escapeAttr(author.displayName)}" loading="lazy" />`
            : ""
        }<span class="cms-hero-author-name">${escapeText(author.displayName)}</span></div>`
      : "";

  const titleHtml = `<h2 class="cms-hero-title">${escapeText(post.title)}</h2>`;
  const excerptHtml = post.excerpt
    ? `<p class="cms-hero-excerpt">${escapeText(post.excerpt)}</p>`
    : "";

  const imageHtml = imageUrl
    ? `<div class="cms-hero-image-wrap"><img class="cms-hero-image" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="lazy" /></div>`
    : "";

  const variantClass = `cms-hero cms-hero-${variant}`;
  // image-overlay puts everything on top of the image; split layouts
  // sit image and text in side-by-side cells; minimal drops the image
  // entirely. Markup is the same — only CSS reorganizes via the
  // variant class.
  if (variant === "minimal") {
    return {
      html: `<section class="${variantClass}"><a href="${escapeAttr(url)}" class="cms-hero-link">${categoryHtml}${titleHtml}${excerptHtml}${authorHtml}</a></section>`,
      consumedPostId: post.id,
    };
  }
  if (variant === "image-overlay") {
    return {
      html: `<section class="${variantClass}"><a href="${escapeAttr(url)}" class="cms-hero-link">${imageHtml}<div class="cms-hero-overlay">${categoryHtml}${titleHtml}${excerptHtml}${authorHtml}</div></a></section>`,
      consumedPostId: post.id,
    };
  }
  // split-left / split-right
  return {
    html: `<section class="${variantClass}"><a href="${escapeAttr(url)}" class="cms-hero-link">${imageHtml}<div class="cms-hero-text">${categoryHtml}${titleHtml}${excerptHtml}${authorHtml}</div></a></section>`,
    consumedPostId: post.id,
  };
}
