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

// Renders the hero section. Markup pattern (every variant):
//
//   <section class="cms-hero cms-hero-<variant>">
//     [<div class="cms-hero-image-wrap">
//        <a href="<post>" tabindex="-1" aria-hidden="true">
//          <img class="cms-hero-image" />
//        </a>
//      </div>]
//     <div class="cms-hero-content">
//       <a class="cms-hero-category" href="<term>">…</a>
//       <h2 class="cms-hero-title"><a href="<post>">…</a></h2>
//       <p class="cms-hero-excerpt">…</p>
//       <div class="cms-hero-author">…</div>
//     </div>
//   </section>
//
// Title and image both link to the post; the image link is hidden
// from assistive tech (`tabindex=-1` + `aria-hidden`) so the title
// stays the canonical entry — avoids two adjacent screen-reader
// announcements for the same destination. Category links to its
// archive. The minimal variant skips the image wrap entirely.
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
  // Largest available variant for hero use; pickFormat falls through
  // its chain so even legacy single-URL media renders.
  const imageUrl = pickFormat(heroMedia, "large");
  const author = post.authorId ? env.ctx.authorLookup(post.authorId) : undefined;

  const categoryHtml =
    showCategory && term
      ? `<a href="/${escapeAttr(buildTermUrl(term))}" class="cms-hero-category">${escapeText(term.name)}</a>`
      : "";

  const titleHtml = `<h2 class="cms-hero-title"><a href="${escapeAttr(url)}">${escapeText(post.title)}</a></h2>`;
  const excerptHtml = post.excerpt
    ? `<p class="cms-hero-excerpt">${escapeText(post.excerpt)}</p>`
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

  const imageHtml = imageUrl
    ? `<div class="cms-hero-image-wrap"><a href="${escapeAttr(url)}" tabindex="-1" aria-hidden="true"><img class="cms-hero-image" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="lazy" /></a></div>`
    : "";

  const contentHtml = `<div class="cms-hero-content">${categoryHtml}${titleHtml}${excerptHtml}${authorHtml}</div>`;

  const variantClass = `cms-hero cms-hero-${variant}`;
  if (variant === "minimal") {
    return {
      html: `<section class="${variantClass}">${contentHtml}</section>`,
      consumedPostId: post.id,
    };
  }
  return {
    html: `<section class="${variantClass}">${imageHtml}${contentHtml}</section>`,
    consumedPostId: post.id,
  };
}
