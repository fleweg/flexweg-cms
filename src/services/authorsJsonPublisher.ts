import { mediaToView, pickFormat } from "../core/media";
import { buildAuthorUrl } from "../core/slug";
import type { Media, Post, UserRecord } from "../core/types";
import { uploadFile } from "./flexwegApi";
import { resolveDisplayName } from "./users";

// Path on Flexweg of the public-side authors snapshot. Grouped under
// `data/` alongside menu.json + posts.json so the public-site root
// stays uncluttered. Absolute fetches still work from any folder depth.
export const AUTHORS_JSON_PATH = "data/authors.json";

// One row in authors.json. Pre-resolved (display name computed,
// avatar variant URL picked) so the public-side loader never needs a
// lookup — same philosophy as the other dynamic JSON blobs.
export interface AuthorsJsonEntry {
  id: string;
  displayName: string;
  email?: string;
  bio?: string;
  // Medium-variant URL of the profile picture, when one is set.
  avatar?: string;
  // Path of the author's archive page on the public site, no leading
  // slash. Loaders prefix with `/` when wiring `<a href>`. Stable
  // unless the user's display name (and therefore the slug) changes.
  url: string;
}

export interface AuthorsJson {
  generatedAt: string;
  // Keyed by user id for O(1) lookup from the public-side loader.
  authors: Record<string, AuthorsJsonEntry>;
}

// Pure builder. Includes only users who are referenced as `authorId`
// on at least one online post or page — keeps emails out of the
// public file for users who haven't published anything yet.
export function buildAuthorsJson(
  users: UserRecord[],
  media: Map<string, Media> | Media[],
  posts: Post[],
  pages: Post[],
): AuthorsJson {
  const mediaMap =
    media instanceof Map ? media : new Map(media.map((m) => [m.id, m]));

  const referenced = new Set<string>();
  for (const post of [...posts, ...pages]) {
    if (post.status !== "online") continue;
    if (post.authorId) referenced.add(post.authorId);
  }

  const authors: Record<string, AuthorsJsonEntry> = {};
  for (const user of users) {
    if (!referenced.has(user.id)) continue;
    const heroView = user.avatarMediaId
      ? mediaToView(mediaMap.get(user.avatarMediaId))
      : undefined;
    const avatar = heroView ? pickFormat(heroView, "medium") : "";
    authors[user.id] = {
      id: user.id,
      displayName: resolveDisplayName(user),
      email: user.email,
      bio: user.bio,
      avatar: avatar || undefined,
      url: buildAuthorUrl(user, users),
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    authors,
  };
}

// Resolves the current state into a JSON file uploaded at /authors.json.
// Called as a tail-step of every publish/unpublish/delete by
// `publisher.republishAuthorsJson`, AND directly from the user-profile
// edit modal in /users so a bio/avatar/name change reflects on the
// public site without re-publishing every post that author wrote.
export async function publishAuthorsJson(
  users: UserRecord[],
  media: Map<string, Media> | Media[],
  posts: Post[],
  pages: Post[],
): Promise<void> {
  const blob = buildAuthorsJson(users, media, posts, pages);
  await uploadFile({
    path: AUTHORS_JSON_PATH,
    content: JSON.stringify(blob),
    encoding: "utf-8",
  });
}
