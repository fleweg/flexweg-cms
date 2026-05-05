import i18n, { pickPublicLocale } from "../../../../i18n";
import type { PublishContext } from "../../../../services/publisher";
import { escapeAttr, escapeText } from "../util";

export interface PromoCardAttrs {
  // All fields are user-edited free-text — the block doesn't reference
  // any post / term, so it works on every site regardless of corpus.
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  // Free-form eyebrow above the title. Defaults to a localised
  // "Promoted" / "Sponsored" label when omitted.
  eyebrow?: string;
  // Click target. Empty = the card is non-interactive (no <a> wrapper).
  href?: string;
}

interface RenderEnv {
  ctx: PublishContext;
}

export interface PromoCardRenderResult {
  html: string;
}

export function renderPromoCard(attrs: PromoCardAttrs, env: RenderEnv): PromoCardRenderResult {
  // Without an image AND without a title, there's nothing to show.
  if (!attrs.imageUrl && !attrs.title) return { html: "" };

  const locale = pickPublicLocale(env.ctx.settings.language);
  const defaultEyebrow =
    (i18n.getResource(locale, "theme-magazine", "blocks.promoCard.defaultEyebrow") as
      | string
      | undefined) ?? "Promoted";
  const eyebrow = attrs.eyebrow ?? defaultEyebrow;

  const eyebrowHtml = eyebrow
    ? `<span class="block text-on-primary/70 uppercase tracking-widest text-xs font-semibold mb-2">${escapeText(eyebrow)}</span>`
    : "";
  const titleHtml = attrs.title
    ? `<h3 class="font-serif text-xl font-medium text-on-primary leading-tight">${escapeText(attrs.title)}</h3>`
    : "";
  const imageHtml = attrs.imageUrl
    ? `<img class="w-full h-full object-cover" src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt ?? attrs.title ?? "")}" loading="lazy" />`
    : "";

  // Inner card markup — used as-is when there's no link, wrapped in
  // an <a> when href is set.
  const inner = `<div class="relative aspect-square overflow-hidden">${imageHtml}<div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent flex flex-col justify-end p-stack-md">${eyebrowHtml}${titleHtml}</div></div>`;

  const wrappedInner = attrs.href
    ? `<a href="${escapeAttr(attrs.href)}" class="block group">${inner}</a>`
    : inner;

  return {
    html: `<div class="cms-magazine-promo-card border border-outline-variant">${wrappedInner}</div>`,
  };
}
