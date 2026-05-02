import { buildPostUrl, buildTermUrl } from "../core/slug";
import { mediaToView, pickFormat } from "../core/media";
import { markdownToPlainText } from "../core/markdown";
import type { Media, Post, SiteSettings, Term } from "../core/types";
import { uploadFile } from "./flexwegApi";

// Path on Flexweg of the public-side posts feed. Same site-root strategy
// as `menu.json` so absolute fetches work from any folder depth.
export const POSTS_JSON_PATH = "posts.json";

// How many most-recent online posts/pages get included in the snapshot.
// Larger sites lose access to older content from sidebar widgets. 100 is
// a generous cap that keeps the file under ~50 KB raw / ~12 KB gzip in
// realistic use; bump if needed.
const MAX_ENTRIES = 100;

// Maximum length of the excerpt embedded in the JSON. Trims at word
// boundaries via markdownToPlainText to avoid mid-word cuts.
const EXCERPT_MAX_CHARS = 200;

// One row in posts.json. Fields are intentionally pre-resolved (URL
// computed, hero variant URL picked, date pre-formatted, category
// denormalised) so the public-side loader never needs to look anything
// up — same philosophy as `menu.json`.
export interface PostsJsonEntry {
  id: string;
  type: "post" | "page";
  title: string;
  // Publishable URL relative to baseUrl, no leading slash. Loaders
  // prefix with `/` when wiring `<a href>`.
  url: string;
  excerpt: string;
  // Milliseconds since epoch. Loader uses it for client-side sorting.
  publishedAt: number;
  // Pre-formatted in `settings.language`. Spares the loader Intl
  // initialisation cost on every page.
  dateLabel: string;
  // Term id of the post's primary category (when set). Loaders filter
  // related lists by this id.
  primaryTermId?: string;
  // Category metadata, only present when primaryTermId resolves to an
  // existing category. Skipped for tags or missing terms.
  category?: { name: string; url: string };
  // Medium-variant URL of the hero image, when one is set. Useful for
  // future widgets (latest with thumbnails) — opt-in for the loader.
  hero?: string;
}

export interface PostsJson {
  generatedAt: string;
  posts: PostsJsonEntry[];
}

// Pure builder. Caller passes whatever data is currently authoritative;
// no Firestore access happens here. Combines posts + pages into a
// single list ordered by publishedAt DESC, capped at MAX_ENTRIES.
export function buildPostsJson(
  settings: SiteSettings,
  posts: Post[],
  pages: Post[],
  terms: Term[],
  media: Map<string, Media> | Media[],
): PostsJson {
  const mediaMap =
    media instanceof Map ? media : new Map(media.map((m) => [m.id, m]));
  const language = settings.language || "en";
  const dateFormatter = (() => {
    try {
      return new Intl.DateTimeFormat(language, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  })();

  function formatDate(ms: number): string {
    if (dateFormatter) return dateFormatter.format(new Date(ms));
    return new Date(ms).toDateString();
  }

  const all = [...posts, ...pages]
    .filter((p) => p.status === "online")
    .sort(
      (a, b) =>
        (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0),
    )
    .slice(0, MAX_ENTRIES);

  const entries: PostsJsonEntry[] = [];
  for (const post of all) {
    const term = post.primaryTermId
      ? terms.find((t) => t.id === post.primaryTermId)
      : undefined;
    let url: string;
    try {
      url = buildPostUrl({ post, primaryTerm: term });
    } catch {
      // Missing slug — skip rather than emit a malformed entry.
      continue;
    }

    const excerpt =
      post.excerpt && post.excerpt.trim().length > 0
        ? post.excerpt.trim().slice(0, EXCERPT_MAX_CHARS)
        : markdownToPlainText(post.contentMarkdown, EXCERPT_MAX_CHARS);

    const publishedAt =
      post.publishedAt?.toMillis?.() ??
      post.updatedAt?.toMillis?.() ??
      post.createdAt?.toMillis?.() ??
      Date.now();

    const heroView = mediaToView(
      post.heroMediaId ? mediaMap.get(post.heroMediaId) : undefined,
    );
    const hero = heroView ? pickFormat(heroView, "medium") : "";

    const category =
      term && term.type === "category"
        ? { name: term.name, url: `/${buildTermUrl(term)}` }
        : undefined;

    entries.push({
      id: post.id,
      type: post.type,
      title: post.title || post.slug,
      url,
      excerpt,
      publishedAt,
      dateLabel: formatDate(publishedAt),
      primaryTermId: post.primaryTermId,
      category,
      hero: hero || undefined,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    posts: entries,
  };
}

// Resolves the current state into a JSON file uploaded at /posts.json.
// Called as a tail-step of every publish/unpublish/delete by
// `publisher.republishPostsJson`. Best-effort: failures are swallowed
// (the underlying flexwegApi call already toasts the user-facing
// error) to avoid aborting the surrounding publish flow.
export async function publishPostsJson(
  settings: SiteSettings,
  posts: Post[],
  pages: Post[],
  terms: Term[],
  media: Map<string, Media> | Media[],
): Promise<void> {
  const blob = buildPostsJson(settings, posts, pages, terms, media);
  await uploadFile({
    path: POSTS_JSON_PATH,
    content: JSON.stringify(blob),
    encoding: "utf-8",
  });
}
