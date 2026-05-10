import { escapeAttr, escapeText } from "../util";

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface ProductGalleryAttrs {
  images: GalleryImage[];
  // When true, the first image renders large (aspect-[4/5]) and the
  // rest render as a 4-col thumbnail strip below. When false, all
  // images render in a uniform 2x2 / 3-col grid.
  primaryFeatured: boolean;
}

export interface ProductGalleryRenderResult {
  html: string;
}

// Inline gallery section — full-width, centered, max-w-container-max.
// Used for additional product photos beyond the post hero. Each image
// has rounded corners and a subtle shadow.
export function renderProductGallery(
  attrs: ProductGalleryAttrs,
): ProductGalleryRenderResult {
  const images = Array.isArray(attrs.images) ? attrs.images.filter((i) => i.url) : [];
  if (images.length === 0) return { html: "" };

  if (attrs.primaryFeatured && images.length > 1) {
    const [first, ...rest] = images;
    return {
      html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="aspect-[4/5] md:aspect-[16/10] rounded-3xl overflow-hidden bg-surface-container-low mb-stack-md shadow-sm">
<img src="${escapeAttr(first.url)}" alt="${escapeAttr(first.alt)}" class="w-full h-full object-cover" loading="lazy" />
</div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-stack-md">${rest
        .map(
          (img) =>
            `<div class="aspect-square rounded-2xl overflow-hidden bg-surface-container-low"><img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.alt)}" class="w-full h-full object-cover" loading="lazy" /></div>`,
        )
        .join("")}</div>
</section>`,
    };
  }

  // Uniform grid mode — 2 cols mobile, 3 cols desktop.
  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="grid grid-cols-2 md:grid-cols-3 gap-stack-md">${images
      .map(
        (img) =>
          `<div class="aspect-square rounded-2xl overflow-hidden bg-surface-container-low"><img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.alt)}" class="w-full h-full object-cover" loading="lazy" /></div>`,
      )
      .join("")}</div>
</section>`,
  };
  // Note: caller can suppress empty images via the inspector.
  void escapeText;
}
