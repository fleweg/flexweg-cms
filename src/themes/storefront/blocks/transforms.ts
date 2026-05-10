import type { Post } from "@flexweg/cms-runtime";
import { decodeAttrs } from "./util";
import { renderHeroOverlay, type HeroOverlayAttrs } from "./heroOverlay/render";
import {
  renderCategoriesBento,
  type CategoriesBentoAttrs,
} from "./categoriesBento/render";
import {
  renderJournalFeature,
  type JournalFeatureAttrs,
} from "./journalFeature/render";
import { renderNewsletter, type NewsletterAttrs } from "./newsletter/render";
import {
  renderProductGallery,
  type ProductGalleryAttrs,
} from "./productGallery/render";
import {
  renderProductFeatures,
  type ProductFeaturesAttrs,
} from "./productFeatures/render";
import { renderReviewsList, type ReviewsListAttrs } from "./reviewsList/render";

// Storefront body-marker pipeline. Phase 2 wires four user-insertable
// home blocks (hero-overlay, categories-bento, journal-feature,
// newsletter). Phase 4 will append the commerce blocks (product-info,
// product-gallery, product-features, reviews-list). All blocks are
// pure functions of their attrs — no publish context needed.

const MARKER_REGEX = /<div\s+([^>]*data-cms-block="storefront\/([\w-]+)"[^>]*)>\s*<\/div>/g;

interface ParsedMarker {
  match: string;
  blockId: string;
  attrsRaw: string;
  index: number;
}

function pickAttr(attrsHtml: string, name: string): string {
  const match = attrsHtml.match(
    new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`),
  );
  if (!match) return "";
  return match[1] ?? match[2] ?? match[3] ?? "";
}

function parseMarkers(html: string): ParsedMarker[] {
  const markers: ParsedMarker[] = [];
  MARKER_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MARKER_REGEX.exec(html)) !== null) {
    markers.push({
      match: m[0],
      blockId: m[2],
      attrsRaw: pickAttr(m[1], "data-attrs"),
      index: m.index,
    });
  }
  return markers;
}

function renderMarker(marker: ParsedMarker): string {
  switch (marker.blockId) {
    case "hero-overlay": {
      const attrs = decodeAttrs<HeroOverlayAttrs>(marker.attrsRaw, {});
      return renderHeroOverlay(attrs).html;
    }
    case "categories-bento": {
      const attrs = decodeAttrs<CategoriesBentoAttrs>(marker.attrsRaw, {});
      return renderCategoriesBento(attrs).html;
    }
    case "journal-feature": {
      const attrs = decodeAttrs<JournalFeatureAttrs>(marker.attrsRaw, {});
      return renderJournalFeature(attrs).html;
    }
    case "newsletter": {
      const attrs = decodeAttrs<NewsletterAttrs>(marker.attrsRaw, {});
      return renderNewsletter(attrs).html;
    }
    case "product-info": {
      // Preserve the marker verbatim. SingleTemplate calls
      // `extractProductInfo` on the post-filter bodyHtml to lift the
      // attrs into the hero right-column card, then strips the
      // marker via `stripProductInfoMarker`. If we replaced with
      // "" here, the extractor would find nothing and the price
      // card would silently disappear.
      return marker.match;
    }
    case "product-gallery": {
      const attrs = decodeAttrs<ProductGalleryAttrs>(marker.attrsRaw, {
        images: [],
        primaryFeatured: true,
      });
      return renderProductGallery(attrs).html;
    }
    case "product-features": {
      const attrs = decodeAttrs<ProductFeaturesAttrs>(marker.attrsRaw, { features: [] });
      return renderProductFeatures(attrs).html;
    }
    case "reviews-list": {
      const attrs = decodeAttrs<ReviewsListAttrs>(marker.attrsRaw, {
        eyebrow: "",
        title: "",
        writeReviewLabel: "",
        writeReviewHref: "",
        reviews: [],
      });
      return renderReviewsList(attrs).html;
    }
    default:
      return "";
  }
}

export function transformBodyHtml(html: string, _post: Post): string {
  if (!html.includes('data-cms-block="storefront/')) return html;

  const markers = parseMarkers(html);
  if (markers.length === 0) return html;

  const replacements = new Map<number, string>();
  for (const marker of markers) {
    replacements.set(marker.index, renderMarker(marker));
  }

  let out = "";
  let cursor = 0;
  MARKER_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MARKER_REGEX.exec(html)) !== null) {
    out += html.slice(cursor, m.index);
    out += replacements.get(m.index) ?? "";
    cursor = m.index + m[0].length;
  }
  out += html.slice(cursor);
  return out;
}
