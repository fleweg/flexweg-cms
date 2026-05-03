import type { Post } from "../../../../core/types";
import type { PublishContext } from "../../../../services/publisher";
import { renderPostItemHtml, wrapList, type ListVariant } from "../postCardHtml";
import { escapeAttr, escapeText } from "../util";

export interface PostsListAttrs {
  title?: string;
  query?: "latest" | "by-tag" | "by-author";
  tagId?: string;
  authorId?: string;
  count?: number;
  variant?: ListVariant;
  columns?: number;
  seeMoreLabel?: string;
  seeMoreUrl?: string;
  // When true (default), exclude posts already pinned/used by an
  // earlier block on the page so the same post never appears twice.
  excludeUsed?: boolean;
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
  used: Set<string>;
}

export interface PostsListRenderResult {
  html: string;
  consumedPostIds: string[];
}

function applyQuery(attrs: PostsListAttrs, env: RenderEnv): Post[] {
  const all = env.ctx.posts.filter((p) => p.status === "online" && p.id !== env.current.id);
  let filtered = all;
  switch (attrs.query) {
    case "by-tag":
      if (attrs.tagId) {
        filtered = all.filter((p) => p.termIds.includes(attrs.tagId!));
      }
      break;
    case "by-author":
      if (attrs.authorId) {
        filtered = all.filter((p) => p.authorId === attrs.authorId);
      }
      break;
    case "latest":
    default:
      // No additional filter — newest-first sort below.
      break;
  }
  return filtered.sort(
    (a, b) => (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0),
  );
}

export function renderPostsList(attrs: PostsListAttrs, env: RenderEnv): PostsListRenderResult {
  const variant = attrs.variant ?? "cards";
  const count = Math.max(1, Math.min(24, attrs.count ?? 6));
  const columns = attrs.columns ?? (variant === "cards" ? 2 : 1);
  const excludeUsed = attrs.excludeUsed ?? true;

  const candidates = applyQuery(attrs, env);
  const filtered = excludeUsed ? candidates.filter((p) => !env.used.has(p.id)) : candidates;
  const picked = filtered.slice(0, count);
  if (picked.length === 0) {
    return { html: "", consumedPostIds: [] };
  }

  const items = picked.map((post, index) =>
    renderPostItemHtml({ post, ctx: env.ctx, variant, index }),
  );
  const list = wrapList(items, variant, columns);

  const headerParts: string[] = [];
  if (attrs.title) {
    headerParts.push(`<h3 class="cms-list-title">${escapeText(attrs.title)}</h3>`);
  }
  if (attrs.seeMoreUrl && attrs.seeMoreLabel) {
    headerParts.push(
      `<a class="cms-list-see-more" href="${escapeAttr(attrs.seeMoreUrl)}">${escapeText(attrs.seeMoreLabel)}</a>`,
    );
  }
  const header = headerParts.length
    ? `<div class="cms-list-header">${headerParts.join("")}</div>`
    : "";

  return {
    html: `<section class="cms-list-block">${header}${list}</section>`,
    consumedPostIds: picked.map((p) => p.id),
  };
}
