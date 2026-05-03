import type { Post } from "../../../core/types";
import type { PublishContext } from "../../../services/publisher";
import { mediaToView, pickFormat } from "../../../core/media";
import { buildPostUrl } from "../../../core/slug";
import { escapeAttr, escapeText } from "./util";

export type ListVariant = "cards" | "list" | "compact" | "numbered" | "slider";

interface RenderPostItemOptions {
  post: Post;
  ctx: PublishContext;
  variant: ListVariant;
  // 0-based index inside the list — used by the `numbered` variant
  // to render "01", "02", … on the side. Ignored by other variants.
  index: number;
  // When false, suppresses the excerpt for variants that would
  // otherwise show it (cards default + list). When true (default),
  // shows the excerpt only if the post has one. The numbered and
  // compact variants never display an excerpt regardless of this
  // flag — too cramped.
  showExcerpt?: boolean;
}

// Date formatter — uses the site language for locale-aware short
// format. Mirrors what postToCardData does for category cards in
// publisher.ts; we keep a local implementation here to avoid pulling
// the larger CardPost shape into block code.
function formatDate(post: Post, ctx: PublishContext): string {
  const ms =
    post.publishedAt?.toMillis?.() ??
    post.updatedAt?.toMillis?.() ??
    post.createdAt?.toMillis?.();
  if (!ms) return "";
  try {
    return new Intl.DateTimeFormat(ctx.settings.language || "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toDateString();
  }
}

// Renders one post as a list item in the requested variant. Returned
// HTML is meant to be injected into the parent grid/ul that the
// caller renders — see renderPostsList / renderCategoryPosts.
export function renderPostItemHtml({
  post,
  ctx,
  variant,
  index,
  showExcerpt = true,
}: RenderPostItemOptions): string {
  const term = post.primaryTermId
    ? ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
  const heroMedia = mediaToView(ctx.media.get(post.heroMediaId ?? ""));
  // medium size is a sensible default for cards; the publisher's
  // pickFormat falls back through the chain when "medium" isn't in
  // the asset's format map.
  const imageUrl = pickFormat(heroMedia, "medium");
  const dateLabel = formatDate(post, ctx);

  const categoryLabel =
    term && variant !== "compact"
      ? `<span class="cms-card-category">${escapeText(term.name)}</span>`
      : "";

  const meta =
    variant === "compact"
      ? dateLabel
        ? `<span class="cms-card-meta">${escapeText(dateLabel)}</span>`
        : ""
      : dateLabel
        ? `<span class="cms-card-meta">${escapeText(dateLabel)}</span>`
        : "";

  if (variant === "numbered") {
    const num = String(index + 1).padStart(2, "0");
    return `<a href="${escapeAttr(url)}" class="cms-card cms-card-numbered"><span class="cms-card-number">${num}</span><span class="cms-card-title">${escapeText(post.title)}</span>${meta ? `<span class="cms-card-meta">${escapeText(dateLabel)}</span>` : ""}</a>`;
  }

  if (variant === "compact") {
    return `<a href="${escapeAttr(url)}" class="cms-card cms-card-compact"><span class="cms-card-title">${escapeText(post.title)}</span>${meta}</a>`;
  }

  if (variant === "list") {
    const excerpt =
      showExcerpt && post.excerpt
        ? `<p class="cms-card-excerpt">${escapeText(post.excerpt)}</p>`
        : "";
    // List rows display the hero on the left in a fixed-size square
    // (~120px). The "small" variant (480²) is roughly a 2x match for
    // that footprint — picks `small` first, falls back through the
    // pickFormat chain to whatever's available. Omitted entirely when
    // the post has no hero so the row collapses to text-only.
    const listImageUrl = pickFormat(heroMedia, "small");
    const listImage = listImageUrl
      ? `<div class="cms-card-list-image-wrap"><img class="cms-card-list-image" src="${escapeAttr(listImageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="lazy" /></div>`
      : "";
    // List variant intentionally drops the category label — the
    // dense list layout (especially with an image) crowds badly with
    // an extra row of meta. The category remains visible on cards
    // and numbered variants.
    return `<a href="${escapeAttr(url)}" class="cms-card cms-card-list${listImage ? " cms-card-list-with-image" : ""}">${listImage}<div class="cms-card-list-body"><h4 class="cms-card-title">${escapeText(post.title)}</h4>${excerpt}${meta}</div></a>`;
  }

  // cards (default) and slider share the same item shape — the
  // parent container's CSS class controls layout (grid vs scroller).
  // Text content lives inside .cms-card-body so the card chrome
  // (background + border) can pad it consistently. Image stays flush
  // to the top.
  const image = imageUrl
    ? `<div class="cms-card-image-wrap"><img class="cms-card-image" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="lazy" /></div>`
    : "";
  const excerpt =
    showExcerpt && post.excerpt
      ? `<p class="cms-card-excerpt">${escapeText(post.excerpt)}</p>`
      : "";
  return `<a href="${escapeAttr(url)}" class="cms-card cms-card-default">${image}<div class="cms-card-body">${categoryLabel}<h4 class="cms-card-title">${escapeText(post.title)}</h4>${excerpt}${meta}</div></a>`;
}

// Wraps an array of pre-rendered item HTML in the variant-appropriate
// container. Keeps the caller (Posts list / Category renderers) free
// of layout concerns.
export function wrapList(itemsHtml: string[], variant: ListVariant, columns: number): string {
  const safeColumns = Math.max(1, Math.min(4, Math.floor(columns) || 1));
  if (variant === "slider") {
    return `<div class="cms-list cms-list-slider">${itemsHtml.join("")}</div>`;
  }
  if (variant === "list") {
    return `<div class="cms-list cms-list-list">${itemsHtml.join("")}</div>`;
  }
  if (variant === "compact") {
    return `<div class="cms-list cms-list-compact">${itemsHtml.join("")}</div>`;
  }
  if (variant === "numbered") {
    return `<div class="cms-list cms-list-numbered">${itemsHtml.join("")}</div>`;
  }
  // cards
  return `<div class="cms-list cms-list-cards cms-list-cols-${safeColumns}">${itemsHtml.join("")}</div>`;
}
