import { decodeAttrs, escapeAttr, escapeText } from "../util";

// Hero block — the top section of the marketplace landing page.
// Two-column split on desktop (text left, screenshot right) that
// collapses to stacked on mobile. Up to two CTAs render as primary
// (filled) + secondary (outlined) buttons; missing CTAs are hidden.
//
// Image URL accepts either a media filename (resolved by the
// importer's `rewriteBlockMarkerImages` pass) or an absolute /media/
// URL. SEO: emits an h1 + a meaningful eyebrow, so the page works as
// a landing surface that ranks for the site's main brand term.
export interface LandingHeroAttrs {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
}

export const DEFAULT_LANDING_HERO: LandingHeroAttrs = {
  eyebrow: "",
  headline: "",
  subhead: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  imageUrl: "",
  imageAlt: "",
};

export function renderLandingHero(attrs: LandingHeroAttrs): string {
  if (!attrs.headline?.trim()) return "";
  const eyebrow = attrs.eyebrow?.trim()
    ? `<p class="mp-hero-x__eyebrow">${escapeText(attrs.eyebrow)}</p>`
    : "";
  const sub = attrs.subhead?.trim()
    ? `<p class="mp-hero-x__sub">${escapeText(attrs.subhead)}</p>`
    : "";
  const ctas = [
    attrs.primaryCta?.label && attrs.primaryCta?.href
      ? `<a class="mp-btn mp-btn--primary" href="${escapeAttr(attrs.primaryCta.href)}">${escapeText(attrs.primaryCta.label)}</a>`
      : "",
    attrs.secondaryCta?.label && attrs.secondaryCta?.href
      ? `<a class="mp-btn mp-btn--secondary" href="${escapeAttr(attrs.secondaryCta.href)}">${escapeText(attrs.secondaryCta.label)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");
  const ctaWrap = ctas ? `<div class="mp-hero-x__ctas">${ctas}</div>` : "";
  const image = attrs.imageUrl?.trim()
    ? `<div class="mp-hero-x__visual"><img src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt || attrs.headline)}" loading="eager"/></div>`
    : "";
  return `<section class="mp-hero-x">
  <div class="mp-hero-x__copy">
    ${eyebrow}
    <h1 class="mp-hero-x__headline">${escapeText(attrs.headline)}</h1>
    ${sub}
    ${ctaWrap}
  </div>
  ${image}
</section>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/landing-hero"[^>]*)>\s*<\/div>/g;

export function transformLandingHero(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<LandingHeroAttrs>(enc, DEFAULT_LANDING_HERO);
    return renderLandingHero(attrs) || "";
  });
}
