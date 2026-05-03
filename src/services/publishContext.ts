import type { PublishContext } from "./publisher";

// Module-level handle on the PublishContext currently being rendered.
// The publisher pipeline is sequential per-page (renderMarkdown →
// post.html.body filter → renderPageToHtml → page.head.extra +
// page.body.end filters → render), all in the same JS turn, so a
// single mutable slot is safe.
//
// Why exists: the post.html.body filter signature is `(html, post)` —
// no full ctx. Theme blocks (Hero, Posts list, …) need to resolve
// posts/terms/media/users beyond the current post to render their
// queries. Reading from this slot inside the filter avoids changing
// the public hook signature and keeps plugin code isolated from the
// publisher's internals.
//
// Set by the publisher before calling each page's render and cleared
// after, so a stale ctx never bleeds across pages.

let current: PublishContext | null = null;

export function setCurrentPublishContext(ctx: PublishContext | null): void {
  current = ctx;
}

export function getCurrentPublishContext(): PublishContext | null {
  return current;
}
