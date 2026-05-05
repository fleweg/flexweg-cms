import i18n, { pickPublicLocale } from "../../../../i18n";
import type { Post } from "../../../../core/types";
import type { PublishContext } from "../../../../services/publisher";
import { mediaToView, pickFormat } from "../../../../core/media";
import { buildPostUrl, buildTermUrl } from "../../../../core/slug";
import { escapeAttr, escapeText } from "../util";

export interface MagazineHeroAttrs {
  // Featured (8-col) post. "latest" sentinel = newest online post.
  featuredPostId?: string;
  // Right-column secondary slots. "auto" sentinel = newest online
  // posts excluding the featured one. Slot 1 carries an image, slot 2
  // is text-only with author byline (matches the editorial mockup —
  // a deliberate descending visual weight).
  secondary1PostId?: string;
  secondary2PostId?: string;
  showCategory?: boolean;
  showAuthor?: boolean;
  // Whether to overlay a "FEATURED" badge on the big article image.
  showFeaturedBadge?: boolean;
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
}

export interface MagazineHeroRenderResult {
  html: string;
  consumedPostIds: string[];
}

// Sorts posts by publish date desc — same ordering used by every
// other "latest" resolver in the codebase, so block resolution is
// consistent across themes/blocks.
function sortByLatest(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0),
  );
}

function resolveExplicit(id: string | undefined, env: RenderEnv): Post | null {
  if (!id || id === "latest" || id === "auto") return null;
  const post = env.ctx.posts.find((p) => p.id === id && p.status === "online");
  return post ?? null;
}

// Picks the next online post not in `taken`, excluding the page being
// rendered. Returns null when the corpus is exhausted — the caller
// renders fewer slots in that case.
function pickNext(env: RenderEnv, taken: Set<string>): Post | null {
  const candidates = sortByLatest(
    env.ctx.posts.filter((p) => p.status === "online" && p.id !== env.current.id && !taken.has(p.id)),
  );
  return candidates[0] ?? null;
}

interface RenderSlotEnv {
  ctx: PublishContext;
  showCategory: boolean;
  showAuthor: boolean;
}

// Featured (left, 8-col) — big image + display title + lede.
function renderFeatured(post: Post, env: RenderSlotEnv, opts: { showBadge: boolean; badgeLabel: string }): string {
  const term = post.primaryTermId
    ? env.ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
  const heroMedia = mediaToView(env.ctx.media.get(post.heroMediaId ?? ""));
  const imageUrl = pickFormat(heroMedia, "large");

  const categoryHtml =
    env.showCategory && term
      ? `<a href="/${escapeAttr(buildTermUrl(term))}" class="block text-secondary uppercase tracking-widest text-xs font-semibold">${escapeText(term.name)}</a>`
      : "";

  const titleHtml = `<h2 class="font-serif text-4xl md:text-5xl font-semibold text-on-surface leading-tight"><a href="${escapeAttr(url)}" class="hover:text-on-surface-variant transition-colors">${escapeText(post.title)}</a></h2>`;
  const excerptHtml = post.excerpt
    ? `<p class="text-lg text-on-surface-variant max-w-2xl leading-relaxed">${escapeText(post.excerpt)}</p>`
    : "";

  const badgeHtml =
    opts.showBadge && imageUrl
      ? `<span class="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 text-xs uppercase tracking-widest font-semibold">${escapeText(opts.badgeLabel)}</span>`
      : "";

  const imageHtml = imageUrl
    ? `<div class="relative overflow-hidden mb-stack-md aspect-[16/9]"><a href="${escapeAttr(url)}" tabindex="-1" aria-hidden="true" class="block group"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="eager" fetchpriority="high" />${badgeHtml}</a></div>`
    : "";

  return `<div class="lg:col-span-8">${imageHtml}<div class="space-y-stack-sm">${categoryHtml}${titleHtml}${excerptHtml}</div></div>`;
}

// Secondary slot 1 (top right, 4-col) — image card with category +
// h3 title.
function renderSecondaryWithImage(post: Post, env: RenderSlotEnv): string {
  const term = post.primaryTermId
    ? env.ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
  const heroMedia = mediaToView(env.ctx.media.get(post.heroMediaId ?? ""));
  const imageUrl = pickFormat(heroMedia, "medium");

  const categoryHtml =
    env.showCategory && term
      ? `<span class="block text-secondary uppercase tracking-widest text-xs font-semibold">${escapeText(term.name)}</span>`
      : "";
  const titleHtml = `<h3 class="font-serif text-xl font-medium text-on-surface"><a href="${escapeAttr(url)}" class="hover:text-on-surface-variant transition-colors">${escapeText(post.title)}</a></h3>`;
  // Aspect ratio is responsive: 16:9 on mobile (where the layout
  // collapses to 1-col and the secondary card becomes full-width
  // beneath the featured 16/9, matching its proportion), 4:3 from
  // `md:` up where the secondary card sits in the right 4-col next
  // to the featured 8-col — the slightly squarer ratio reads better
  // there.
  const imageHtml = imageUrl
    ? `<div class="aspect-[16/9] md:aspect-[4/3] overflow-hidden mb-stack-sm"><a href="${escapeAttr(url)}" tabindex="-1" aria-hidden="true" class="block group"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(heroMedia?.alt ?? post.title)}" loading="lazy" /></a></div>`
    : "";

  return `<div>${imageHtml}<div class="space-y-1">${categoryHtml}${titleHtml}</div></div>`;
}

// Secondary slot 2 (bottom right, 4-col) — text-only card with author
// byline. Sits below a 1px divider.
function renderSecondaryTextOnly(post: Post, env: RenderSlotEnv): string {
  const term = post.primaryTermId
    ? env.ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
  const author = post.authorId ? env.ctx.authorLookup(post.authorId) : undefined;

  const categoryHtml =
    env.showCategory && term
      ? `<span class="block text-secondary uppercase tracking-widest text-xs font-semibold">${escapeText(term.name)}</span>`
      : "";
  const titleHtml = `<h3 class="font-serif text-xl font-medium text-on-surface"><a href="${escapeAttr(url)}" class="hover:text-on-surface-variant transition-colors">${escapeText(post.title)}</a></h3>`;
  const bylineHtml =
    env.showAuthor && author
      ? `<p class="text-sm text-on-surface-variant mt-2">${escapeText(author.displayName)}</p>`
      : "";

  return `<div class="border-t border-outline-variant pt-stack-md space-y-1">${categoryHtml}${titleHtml}${bylineHtml}</div>`;
}

// Renders the magazine 8/4 hero grid. Returns empty string when no
// posts are available (the home template will then show its empty
// state). A partial corpus (only 1 or 2 posts) renders fewer slots —
// the layout collapses gracefully.
export function renderMagazineHero(
  attrs: MagazineHeroAttrs,
  env: RenderEnv,
): MagazineHeroRenderResult {
  const taken = new Set<string>([env.current.id].filter((id) => id !== "__home__"));

  const featured = resolveExplicit(attrs.featuredPostId, env)
    ?? sortByLatest(
      env.ctx.posts.filter((p) => p.status === "online" && !taken.has(p.id)),
    )[0]
    ?? null;
  if (!featured) return { html: "", consumedPostIds: [] };
  taken.add(featured.id);

  const secondary1 = resolveExplicit(attrs.secondary1PostId, env)
    ?? pickNext(env, taken);
  if (secondary1) taken.add(secondary1.id);

  const secondary2 = resolveExplicit(attrs.secondary2PostId, env)
    ?? pickNext(env, taken);
  if (secondary2) taken.add(secondary2.id);

  const slotEnv: RenderSlotEnv = {
    ctx: env.ctx,
    showCategory: attrs.showCategory ?? true,
    showAuthor: attrs.showAuthor ?? true,
  };

  // The "FEATURED" badge label comes from the public-side i18n bundle
  // so a French-language site reads "À LA UNE", a Korean one reads
  // "추천", etc. Direct getResource (no React context here).
  const locale = pickPublicLocale(env.ctx.settings.language);
  const badgeLabel =
    (i18n.getResource(locale, "theme-magazine", "blocks.magazineHero.featuredLabel") as
      | string
      | undefined) ?? "FEATURED";

  const featuredHtml = renderFeatured(featured, slotEnv, {
    showBadge: attrs.showFeaturedBadge ?? true,
    badgeLabel,
  });
  const slot1Html = secondary1 ? renderSecondaryWithImage(secondary1, slotEnv) : "";
  const slot2Html = secondary2 ? renderSecondaryTextOnly(secondary2, slotEnv) : "";
  const rightHtml = (slot1Html || slot2Html)
    ? `<div class="lg:col-span-4 flex flex-col gap-stack-md">${slot1Html}${slot2Html}</div>`
    : "";

  const consumedPostIds = [featured.id];
  if (secondary1) consumedPostIds.push(secondary1.id);
  if (secondary2) consumedPostIds.push(secondary2.id);

  return {
    html: `<section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-stack-lg">${featuredHtml}${rightHtml}</section>`,
    consumedPostIds,
  };
}
