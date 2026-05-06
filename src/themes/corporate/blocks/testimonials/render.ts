import { escapeAttr, escapeText } from "../util";

export interface Testimonial {
  // 1–5 star rating, defaults to 5 when undefined.
  rating?: number;
  // Quote body (no quote marks — the layout adds the giant quote glyph).
  quote: string;
  authorName: string;
  // Title / company line shown under the name in label-caps.
  authorTitle?: string;
  // Optional avatar URL. Falls back to a tinted initials box when
  // empty — keeps the card balanced even without artwork.
  authorAvatarUrl?: string;
  authorAvatarAlt?: string;
}

export type TestimonialsVariant = "glass" | "navy";

export interface TestimonialsAttrs {
  // Section heading + lede.
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  // Variant. "glass" is the home_desktop mockup (light surface
  // background, frosted cards with quotation glyph). "navy" is the
  // home_mobile testimonials section (primary background, lighter
  // cards over it).
  variant?: TestimonialsVariant;
  testimonials?: Testimonial[];
}

export interface TestimonialsRenderResult {
  html: string;
}

const DEFAULT_TESTIMONIAL: Testimonial = {
  rating: 5,
  quote: "",
  authorName: "",
  authorTitle: "",
  authorAvatarUrl: "",
  authorAvatarAlt: "",
};

function renderStars(rating: number, isNavy: boolean): string {
  const count = Math.max(0, Math.min(5, Math.round(rating)));
  const colorClass = isNavy ? "text-secondary-fixed" : "text-secondary";
  let stars = "";
  for (let i = 0; i < 5; i++) {
    const filled = i < count;
    stars += `<span class="material-symbols-outlined text-[18px] ${colorClass}" style="font-variation-settings: 'FILL' ${filled ? 1 : 0};">star</span>`;
  }
  return `<div class="flex gap-1 mb-stack-md">${stars}</div>`;
}

function authorInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function renderCard(t: Testimonial, isNavy: boolean): string {
  const merged = { ...DEFAULT_TESTIMONIAL, ...t };
  if (!merged.quote && !merged.authorName) return "";

  const cardClass = isNavy
    ? "bg-primary-container p-8 rounded-xl border border-on-primary-fixed-variant/20"
    : "glass-card p-8 rounded-xl shadow-sm relative";

  const quoteGlyphClass = isNavy
    ? "material-symbols-outlined text-secondary-fixed text-4xl mb-stack-md"
    : "material-symbols-outlined text-secondary/20 text-[64px] absolute top-4 right-4";

  const quoteTextClass = isNavy
    ? "text-body-lg mb-stack-lg italic"
    : "text-on-surface mb-stack-lg italic";

  const nameClass = isNavy ? "font-bold text-on-primary" : "font-bold text-primary";
  const titleClass = isNavy
    ? "text-label-caps font-semibold text-on-primary-container uppercase tracking-wider"
    : "text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider";

  const avatarHtml = merged.authorAvatarUrl
    ? `<img class="w-12 h-12 rounded-full object-cover" src="${escapeAttr(merged.authorAvatarUrl)}" alt="${escapeAttr(merged.authorAvatarAlt ?? merged.authorName)}" loading="lazy" />`
    : `<span class="w-12 h-12 rounded-full inline-flex items-center justify-center bg-secondary-fixed text-secondary font-bold" aria-hidden="true">${escapeText(authorInitials(merged.authorName))}</span>`;

  return `<div class="${cardClass}">
<span class="${quoteGlyphClass}" style="font-variation-settings: 'FILL' 1;">format_quote</span>
${renderStars(merged.rating ?? 5, isNavy)}
<p class="${quoteTextClass}">${escapeText(merged.quote)}</p>
<div class="flex items-center gap-stack-md">${avatarHtml}<div><p class="${nameClass}">${escapeText(merged.authorName)}</p>${merged.authorTitle ? `<p class="${titleClass}">${escapeText(merged.authorTitle)}</p>` : ""}</div></div>
</div>`;
}

// Testimonials section. Two visual variants pulled directly from the
// home_desktop ("glass" — light surface) and home_mobile ("navy" —
// primary background) mockups.
export function renderTestimonials(attrs: TestimonialsAttrs): TestimonialsRenderResult {
  const items = (attrs.testimonials ?? []).filter((t) => t && (t.quote || t.authorName));
  if (items.length === 0 && !attrs.title) return { html: "" };

  const isNavy = attrs.variant === "navy";
  const sectionClass = isNavy
    ? "px-gutter py-section-padding bg-primary text-on-primary overflow-hidden relative"
    : "bg-surface-container-low py-section-padding overflow-hidden";

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block ${isNavy ? "text-secondary-fixed" : "text-secondary"}">${escapeText(attrs.eyebrow)}</span>`
    : "";
  const headingClass = isNavy ? "text-h2 font-bold mb-4" : "text-h2 font-bold text-primary";
  const subtitleClass = isNavy
    ? "text-on-primary-container text-body-lg mt-4"
    : "text-on-surface-variant text-body-md mt-4";

  const titleHtml = attrs.title ? `<h2 class="${headingClass}">${escapeText(attrs.title)}</h2>` : "";
  const subtitleHtml = attrs.subtitle
    ? `<p class="${subtitleClass}">${escapeText(attrs.subtitle)}</p>`
    : "";

  const headerHtml =
    eyebrowHtml || titleHtml || subtitleHtml
      ? `<div class="text-center mb-section-padding max-w-2xl mx-auto">${eyebrowHtml}${titleHtml}${subtitleHtml}</div>`
      : "";

  const gridCols =
    items.length >= 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : items.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1";

  const cardsHtml = items.map((t) => renderCard(t, isNavy)).join("");

  // Optional decorative blur for the navy variant — matches the
  // mockup's bottom-right glow.
  const decoration = isNavy
    ? `<div class="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>`
    : "";

  return {
    html: `<section class="${sectionClass}">
<div class="px-gutter max-w-container-max mx-auto relative z-10">
${headerHtml}
<div class="grid ${gridCols} gap-stack-lg">${cardsHtml}</div>
</div>
${decoration}
</section>`,
  };
}
