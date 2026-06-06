import { transformHeaderButtons } from "./headerButtons/render";
import { transformGallery } from "./gallery/render";
import { transformSpecs } from "./specs/render";
import { transformFeatures } from "./features/render";
import { transformLandingHero } from "./landingHero/render";
import { transformFeatureGrid } from "./featureGrid/render";
import { transformFeatureRow } from "./featureRow/render";
import { transformStatsBar } from "./statsBar/render";
import { transformCtaBanner } from "./ctaBanner/render";
import { transformDocHtml } from "../lib/docTransforms";

// Applies every marketplace-core/* block transformer in sequence.
// Registered as a `post.html.body` filter so it runs after marked +
// DOMPurify but before the publisher hands the HTML to the template.
//
// Markers from other themes pass through untouched — each block's
// regex is namespaced to `marketplace-core/<sub-id>`.
//
// Order: product blocks first (legacy 4 used on single product
// pages), then landing blocks (added in v1.3.0 for the marketplace
// home / about / marketing pages). Transforms are independent, so
// the order is a matter of consistency, not correctness.
export function transformBodyHtml(
  bodyHtml: string,
  copyLabel?: string,
  copiedLabel?: string,
): string {
  let out = bodyHtml;
  out = transformHeaderButtons(out);
  out = transformGallery(out);
  out = transformSpecs(out);
  out = transformFeatures(out);
  out = transformLandingHero(out);
  out = transformFeatureGrid(out);
  out = transformFeatureRow(out);
  out = transformStatsBar(out);
  out = transformCtaBanner(out);
  // Doc-specific transforms (admonitions, code blocks). Idempotent
  // and namespaced to mp- classes so non-doc posts pay only the regex
  // scan cost — if a post doesn't contain admonitions or fenced code
  // blocks, the transformer is a no-op.
  out = transformDocHtml(out, copyLabel, copiedLabel);
  return out;
}
