import { decodeAttrs, escapeAttr, escapeText } from "../util";

// Bento gallery — 12-col grid:
//   - col-span-8 large image, 600px tall
//   - col-span-4 stacked: sub image top (300px), sub image bottom (300px)
//   - col-span-12 full-width wide image (800px)
export interface BentoGalleryAttrs {
  mainImageUrl: string;
  mainImageAlt: string;
  subTopImageUrl: string;
  subTopImageAlt: string;
  // Apply grayscale filter to sub-top (matches the mockup).
  subTopGrayscale: boolean;
  subBottomImageUrl: string;
  subBottomImageAlt: string;
  wideImageUrl: string;
  wideImageAlt: string;
}

export interface BentoGalleryRenderResult {
  html: string;
}

export const DEFAULT_BENTO_GALLERY_ATTRS: BentoGalleryAttrs = {
  mainImageUrl: "",
  mainImageAlt: "",
  subTopImageUrl: "",
  subTopImageAlt: "",
  subTopGrayscale: true,
  subBottomImageUrl: "",
  subBottomImageAlt: "",
  wideImageUrl: "",
  wideImageAlt: "",
};

function img(url: string, alt: string, classes: string, grayscale = false): string {
  if (!url) return `<div class="${classes} bg-surface-container"></div>`;
  return `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" class="${classes}${grayscale ? " grayscale" : ""}" loading="lazy"/>`;
}

export function renderBentoGallery(attrs: BentoGalleryAttrs): BentoGalleryRenderResult {
  const hasAny =
    attrs.mainImageUrl ||
    attrs.subTopImageUrl ||
    attrs.subBottomImageUrl ||
    attrs.wideImageUrl;
  if (!hasAny) return { html: "" };

  const mainCol = `<div class="md:col-span-8 h-[600px]">${img(attrs.mainImageUrl, attrs.mainImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]")}</div>`;
  const subCol = `<div class="md:col-span-4 h-[600px] flex flex-col gap-8"><div class="h-1/2">${img(attrs.subTopImageUrl, attrs.subTopImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]", attrs.subTopGrayscale)}</div><div class="h-1/2">${img(attrs.subBottomImageUrl, attrs.subBottomImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]")}</div></div>`;
  const wideCol = attrs.wideImageUrl
    ? `<div class="md:col-span-12 h-[600px] md:h-[800px]">${img(attrs.wideImageUrl, attrs.wideImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]")}</div>`
    : "";

  return {
    html: `<section class="portfolio-bento px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap bg-surface-container-lowest"><div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">${mainCol}${subCol}${wideCol}</div></section>`,
  };
}

const BENTO_GALLERY_MARKER_REGEX =
  /<div\s+([^>]*data-cms-block="portfolio\/bento-gallery"[^>]*)>\s*<\/div>/g;

export function transformBentoGallery(bodyHtml: string): string {
  return bodyHtml.replace(BENTO_GALLERY_MARKER_REGEX, (full, raw) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? m[1] ?? m[2] ?? m[3] ?? "" : "";
    const attrs = decodeAttrs<BentoGalleryAttrs>(enc, DEFAULT_BENTO_GALLERY_ATTRS);
    return renderBentoGallery(attrs).html || full;
  });
}

// Trivial escape suppression — included so the file uses both
// escape helpers and stays consistent with sibling render files.
escapeText;
