import type { Post } from "@flexweg/cms-runtime";
import { decodeAttrs } from "./util";
import { renderHeroOverlay, type HeroOverlayAttrs } from "./heroOverlay/render";
import { renderHeroSplit, type HeroSplitAttrs } from "./heroSplit/render";
import { renderServicesGrid, type ServicesGridAttrs } from "./servicesGrid/render";
import { renderCtaBanner, type CtaBannerAttrs } from "./ctaBanner/render";
import { renderTestimonials, type TestimonialsAttrs } from "./testimonials/render";
import { renderTrustBar, type TrustBarAttrs } from "./trustBar/render";
import { renderStatsGrid, type StatsGridAttrs } from "./statsGrid/render";
import { renderFeatureStack, type FeatureStackAttrs } from "./featureStack/render";
import { renderContactInfo, type ContactInfoAttrs } from "./contactInfo/render";
import { renderContactForm, type ContactFormAttrs } from "./contactForm/render";

// Corporate theme's body-marker pipeline. Identical structure to the
// magazine + default themes' transforms.ts — different namespace and
// different block set.
//
// All four Phase 2 blocks are pure functions of their attrs (they
// never reach into the publish context for posts / terms / media), so
// the env passed to render functions stays minimal. Future blocks
// that DO need the corpus (e.g. a "latest insights" or "team grid"
// CPT block) will follow the magazine pattern: take a `RenderEnv`
// argument carrying `ctx`, `current`, and a `used: Set<string>` for
// dedup with hero blocks.

const MARKER_REGEX = /<div\s+([^>]*data-cms-block="corporate\/([\w-]+)"[^>]*)>\s*<\/div>/g;

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
    case "hero-split": {
      const attrs = decodeAttrs<HeroSplitAttrs>(marker.attrsRaw, {});
      return renderHeroSplit(attrs).html;
    }
    case "services-grid": {
      const attrs = decodeAttrs<ServicesGridAttrs>(marker.attrsRaw, {});
      return renderServicesGrid(attrs).html;
    }
    case "cta-banner": {
      const attrs = decodeAttrs<CtaBannerAttrs>(marker.attrsRaw, {});
      return renderCtaBanner(attrs).html;
    }
    case "testimonials": {
      const attrs = decodeAttrs<TestimonialsAttrs>(marker.attrsRaw, {});
      return renderTestimonials(attrs).html;
    }
    case "trust-bar": {
      const attrs = decodeAttrs<TrustBarAttrs>(marker.attrsRaw, {});
      return renderTrustBar(attrs).html;
    }
    case "stats-grid": {
      const attrs = decodeAttrs<StatsGridAttrs>(marker.attrsRaw, {});
      return renderStatsGrid(attrs).html;
    }
    case "feature-stack": {
      const attrs = decodeAttrs<FeatureStackAttrs>(marker.attrsRaw, {});
      return renderFeatureStack(attrs).html;
    }
    case "contact-info": {
      const attrs = decodeAttrs<ContactInfoAttrs>(marker.attrsRaw, {});
      return renderContactInfo(attrs).html;
    }
    case "contact-form": {
      const attrs = decodeAttrs<ContactFormAttrs>(marker.attrsRaw, {});
      return renderContactForm(attrs).html;
    }
    default:
      return "";
  }
}

// Replaces every `data-cms-block="corporate/*"` marker in the
// rendered post body with the corresponding HTML. Markers from other
// themes (magazine, default, etc.) pass through untouched — each
// theme owns its own namespace and its own filter pass.
//
// `_post` is unused for now (corporate's Phase 2 blocks don't need
// the current post id) but kept on the signature so the function
// shape mirrors the magazine + default themes; later phases that
// reference the active post (e.g. "see related from this category")
// will fill it in without changing the call sites.
export function transformBodyHtml(html: string, _post: Post): string {
  if (!html.includes('data-cms-block="corporate/')) return html;

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
