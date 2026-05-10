import { escapeAttr, escapeText } from "../util";

export interface ReviewItem {
  authorName: string;
  authorRole: string;
  // Initials shown in the round avatar circle when no image URL.
  authorInitials: string;
  authorAvatarUrl: string;
  rating: number; // 0-5, decimals allowed
  text: string;
  dateLabel: string;
}

export interface ReviewsListAttrs {
  eyebrow: string;
  title: string;
  // Optional "Write a review" CTA — visible link in the section
  // header. Empty hides the link.
  writeReviewLabel: string;
  writeReviewHref: string;
  reviews: ReviewItem[];
}

export interface ReviewsListRenderResult {
  html: string;
}

function starsHtml(rating: number): string {
  const fullStars = Math.max(0, Math.floor(rating));
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
  const out: string[] = [];
  for (let i = 0; i < fullStars; i++) {
    out.push(
      `<span class="material-symbols-outlined text-base text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>`,
    );
  }
  if (halfStar) {
    out.push(
      `<span class="material-symbols-outlined text-base text-secondary" style="font-variation-settings: 'FILL' 1;">star_half</span>`,
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    out.push(
      `<span class="material-symbols-outlined text-base text-on-surface-variant">star</span>`,
    );
  }
  return out.join("");
}

// Inline reviews section — full-width, max-w-container-max, soft
// surface cards with avatar + name + stars + body text. Skip
// silently when no reviews are configured.
export function renderReviewsList(attrs: ReviewsListAttrs): ReviewsListRenderResult {
  const reviews = Array.isArray(attrs.reviews)
    ? attrs.reviews.filter((r) => r.text || r.authorName)
    : [];
  if (reviews.length === 0) return { html: "" };

  const headerHtml = `<div class="flex flex-col md:flex-row md:items-end md:justify-between mb-stack-lg gap-stack-md border-b border-outline-variant/30 pb-stack-md">
<div>${
    attrs.eyebrow
      ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${escapeText(attrs.eyebrow)}</p>`
      : ""
  }${
    attrs.title
      ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface">${escapeText(attrs.title)}</h2>`
      : ""
  }</div>${
    attrs.writeReviewLabel && attrs.writeReviewHref
      ? `<a href="${escapeAttr(attrs.writeReviewHref)}" class="text-primary font-label-caps text-label-caps uppercase tracking-widest underline hover:text-primary-container transition-colors">${escapeText(attrs.writeReviewLabel)}</a>`
      : ""
  }</div>`;

  const cardsHtml = reviews
    .map((r) => {
      const avatarHtml = r.authorAvatarUrl
        ? `<img src="${escapeAttr(r.authorAvatarUrl)}" alt="${escapeAttr(r.authorName)}" class="w-12 h-12 rounded-full object-cover" loading="lazy" />`
        : `<span class="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed-variant inline-flex items-center justify-center font-bold">${escapeText(r.authorInitials || (r.authorName ? r.authorName.slice(0, 2).toUpperCase() : "?"))}</span>`;
      return `<article class="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30">
<div class="flex items-center justify-between mb-stack-md">
<div class="flex items-center gap-stack-sm">${avatarHtml}<div>${
        r.authorName
          ? `<p class="font-body-md text-body-md font-semibold text-on-surface">${escapeText(r.authorName)}</p>`
          : ""
      }${
        r.authorRole
          ? `<p class="text-[12px] text-on-surface-variant">${escapeText(r.authorRole)}</p>`
          : ""
      }</div></div>
<div class="flex">${starsHtml(r.rating)}</div>
</div>${
        r.text
          ? `<p class="font-body-md text-on-surface-variant italic leading-relaxed">"${escapeText(r.text)}"</p>`
          : ""
      }${
        r.dateLabel
          ? `<p class="text-[12px] text-on-surface-variant mt-stack-sm">${escapeText(r.dateLabel)}</p>`
          : ""
      }</article>`;
    })
    .join("");

  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${headerHtml}<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md md:gap-stack-lg">${cardsHtml}</div></section>`,
  };
}
