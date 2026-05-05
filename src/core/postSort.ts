import type { Post } from "./types";

// Single source of truth for post ordering on the public site.
//
// Returns the millisecond epoch the publisher uses to decide which
// post sits "first" in any "newest first" listing — home grid,
// category archive, author archive, magazine hero / Latest, etc.
//
// Why createdAt and not publishedAt: editorial workflow. `createdAt`
// captures when the writer started the article. `publishedAt` only
// updates when the post goes online — so a piece written months ago
// and just published would otherwise jump to the top of the home,
// which doesn't match the editorial expectation of "the article I
// wrote most recently surfaces first".
//
// Fallback chain handles posts that pre-date one or another field:
// older imports may carry only `publishedAt`; freshly created
// drafts may have only `createdAt`. Returning 0 (epoch) for posts
// missing all three fields parks them at the bottom — better than a
// runtime error.
export function postSortMillis(
  post: Pick<Post, "createdAt" | "publishedAt" | "updatedAt">,
): number {
  return (
    post.createdAt?.toMillis?.() ??
    post.publishedAt?.toMillis?.() ??
    post.updatedAt?.toMillis?.() ??
    0
  );
}
