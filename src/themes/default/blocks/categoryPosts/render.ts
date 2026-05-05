import type { Post } from "../../../../core/types";
import { postSortMillis } from "../../../../core/postSort";
import type { PublishContext } from "../../../../services/publisher";
import { buildTermUrl } from "../../../../core/slug";
import { renderPostItemHtml, wrapList, type ListVariant } from "../postCardHtml";
import { escapeAttr, escapeText } from "../util";

export interface CategoryPostsAttrs {
  categoryId?: string;
  // Optional title override — defaults to the category's name.
  title?: string;
  count?: number;
  variant?: ListVariant;
  columns?: number;
  // Optional explicit "see more" — defaults to the category archive
  // URL when omitted.
  seeMoreLabel?: string;
  seeMoreUrl?: string;
  excludeUsed?: boolean;
  // When false, hides the excerpt across every variant that would
  // otherwise show it (cards, list). Default true.
  showExcerpt?: boolean;
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
  used: Set<string>;
}

export interface CategoryPostsRenderResult {
  html: string;
  consumedPostIds: string[];
}

export function renderCategoryPosts(
  attrs: CategoryPostsAttrs,
  env: RenderEnv,
): CategoryPostsRenderResult {
  if (!attrs.categoryId) return { html: "", consumedPostIds: [] };
  const term = env.ctx.terms.find((t) => t.id === attrs.categoryId && t.type === "category");
  if (!term) return { html: "", consumedPostIds: [] };

  const variant = attrs.variant ?? "cards";
  const count = Math.max(1, Math.min(24, attrs.count ?? 4));
  const columns = attrs.columns ?? (variant === "cards" ? 2 : 1);
  const excludeUsed = attrs.excludeUsed ?? true;

  const candidates = env.ctx.posts
    .filter(
      (p) =>
        p.status === "online" && p.id !== env.current.id && p.primaryTermId === attrs.categoryId,
    )
    .sort(
      (a, b) => postSortMillis(b) - postSortMillis(a),
    );
  const filtered = excludeUsed ? candidates.filter((p) => !env.used.has(p.id)) : candidates;
  const picked = filtered.slice(0, count);
  if (picked.length === 0) return { html: "", consumedPostIds: [] };

  const showExcerpt = attrs.showExcerpt ?? true;
  const items = picked.map((post, index) =>
    renderPostItemHtml({ post, ctx: env.ctx, variant, index, showExcerpt }),
  );
  const list = wrapList(items, variant, columns);

  const titleLabel = attrs.title?.trim() || term.name;
  const seeMoreUrl = attrs.seeMoreUrl?.trim() || `/${buildTermUrl(term)}`;
  const seeMoreLabel = attrs.seeMoreLabel?.trim();

  const headerParts: string[] = [];
  if (titleLabel) {
    headerParts.push(`<h3 class="cms-list-title">${escapeText(titleLabel)}</h3>`);
  }
  if (seeMoreLabel) {
    headerParts.push(
      `<a class="cms-list-see-more" href="${escapeAttr(seeMoreUrl)}">${escapeText(seeMoreLabel)}</a>`,
    );
  }
  const header = headerParts.length
    ? `<div class="cms-list-header">${headerParts.join("")}</div>`
    : "";

  return {
    html: `<section class="cms-list-block cms-list-block-category">${header}${list}</section>`,
    consumedPostIds: picked.map((p) => p.id),
  };
}
