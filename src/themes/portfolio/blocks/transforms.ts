import { transformProjectMeta } from "./projectMeta/render";
import { transformStorytelling } from "./storytelling/render";
import { transformBentoGallery } from "./bentoGallery/render";
import { transformNextProject } from "./nextProject/render";

// Applies every portfolio/* block transformer to a rendered post
// body. Registered as a `post.html.body` filter in manifest.register
// so it runs after marked's parse + DOMPurify's sanitize.
//
// Markers from other themes (storefront/*, magazine/*, corporate/*)
// pass through untouched — each theme's transformer is scoped to its
// own namespace regex, so they never collide.
export function transformBodyHtml(bodyHtml: string): string {
  let out = bodyHtml;
  out = transformProjectMeta(out);
  out = transformStorytelling(out);
  out = transformBentoGallery(out);
  out = transformNextProject(out);
  return out;
}
