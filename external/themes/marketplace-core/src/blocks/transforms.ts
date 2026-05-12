import { transformHeaderButtons } from "./headerButtons/render";
import { transformGallery } from "./gallery/render";
import { transformSpecs } from "./specs/render";
import { transformFeatures } from "./features/render";

// Applies every marketplace-core/* block transformer in sequence.
// Registered as a `post.html.body` filter so it runs after marked +
// DOMPurify but before the publisher hands the HTML to the template.
//
// Markers from other themes pass through untouched — each block's
// regex is namespaced to `marketplace-core/<sub-id>`.
export function transformBodyHtml(bodyHtml: string): string {
  let out = bodyHtml;
  out = transformHeaderButtons(out);
  out = transformGallery(out);
  out = transformSpecs(out);
  out = transformFeatures(out);
  return out;
}
