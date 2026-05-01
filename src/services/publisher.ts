import { renderMarkdown, markdownToPlainText } from "../core/markdown";
import { applyFilters, doAction } from "../core/pluginRegistry";
import { renderPageToHtml } from "../core/render";
import {
  buildPostUrl,
  buildTermUrl,
  HOME_PATH,
  NOT_FOUND_PATH,
} from "../core/slug";
import { sha256Hex } from "../lib/utils";
import { getActiveTheme } from "../themes";
import type {
  AuthorView,
  BaseLayoutProps,
  CategoryTemplateProps,
  HomeTemplateProps,
  MediaView,
  ResolvedMenuItem,
  SingleTemplateProps,
  SiteContext,
} from "../themes/types";
import type { Media, MenuItem, Post, SiteSettings, Term } from "../core/types";
import { deleteFile, uploadFile } from "./flexwegApi";
import { listAllMedia } from "./media";
import { markPostDraft, markPostOnline } from "./posts";

export interface PublishLogEntry {
  level: "info" | "success" | "warn" | "error";
  message: string;
}

export type PublishLogger = (entry: PublishLogEntry) => void;

interface PublishContext {
  posts: Post[]; // all posts
  pages: Post[]; // all static pages
  terms: Term[]; // all terms (categories + tags)
  media: Map<string, Media>;
  settings: SiteSettings;
  // Author lookup is best-effort: we don't fetch every user when publishing,
  // we only know about the current authenticated user. Pass them in.
  authorLookup: (id: string) => AuthorView | undefined;
}

// THEME CSS PATH on Flexweg, mirrors what the build script produces.
const THEME_CSS_PREFIX = "theme-assets";

function themeCssPath(themeId: string): string {
  return `${THEME_CSS_PREFIX}/${themeId}.css`;
}

function resolveMedia(id: string | undefined, media: Map<string, Media>): MediaView | undefined {
  if (!id) return undefined;
  const m = media.get(id);
  if (!m) return undefined;
  return { url: m.url, alt: m.alt, caption: m.caption };
}

function resolveMenu(items: MenuItem[], ctx: PublishContext): ResolvedMenuItem[] {
  return items.map((item) => {
    const href = resolveMenuHref(item, ctx);
    return {
      id: item.id,
      label: item.label,
      href,
      children: item.children ? resolveMenu(item.children, ctx) : undefined,
    };
  });
}

function resolveMenuHref(item: MenuItem, ctx: PublishContext): string {
  if (item.externalUrl) return item.externalUrl;
  if (!item.ref) return "#";
  if (item.ref.kind === "home") return "/index.html";
  if (item.ref.kind === "post") {
    const post = [...ctx.posts, ...ctx.pages].find((p) => p.id === item.ref?.id);
    if (!post) return "#";
    const term = post.primaryTermId ? ctx.terms.find((t) => t.id === post.primaryTermId) : undefined;
    return `/${buildPostUrl({ post, primaryTerm: term })}`;
  }
  if (item.ref.kind === "term") {
    const term = ctx.terms.find((t) => t.id === item.ref?.id);
    if (!term || term.type !== "category") return "#";
    return `/${buildTermUrl(term)}`;
  }
  return "#";
}

function buildSiteContext(ctx: PublishContext): SiteContext {
  return {
    settings: ctx.settings,
    resolvedMenus: {
      header: resolveMenu(ctx.settings.menus.header ?? [], ctx),
      footer: resolveMenu(ctx.settings.menus.footer ?? [], ctx),
    },
    themeCssPath: themeCssPath(ctx.settings.activeThemeId),
  };
}

function postToCardData(post: Post, ctx: PublishContext): Post & { url: string; hero?: MediaView } {
  const term = post.primaryTermId ? ctx.terms.find((t) => t.id === post.primaryTermId) : undefined;
  const url = buildPostUrl({ post, primaryTerm: term });
  return { ...post, url, hero: resolveMedia(post.heroMediaId, ctx.media) };
}

// Renders a single post or page to HTML, ready to upload.
async function renderSingle(post: Post, ctx: PublishContext): Promise<string> {
  const theme = getActiveTheme(ctx.settings.activeThemeId);
  const site = buildSiteContext(ctx);

  const filteredMd = await applyFilters<string>("post.markdown.before", post.contentMarkdown, post);
  let bodyHtml = renderMarkdown(filteredMd);
  bodyHtml = await applyFilters<string>("post.html.body", bodyHtml, post);

  const tags = ctx.terms.filter((t) => post.termIds.includes(t.id) && t.type === "tag");
  const primaryTerm = post.primaryTermId
    ? ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const author = ctx.authorLookup(post.authorId);
  const hero = resolveMedia(post.heroMediaId, ctx.media);
  const term = post.primaryTermId ? ctx.terms.find((t) => t.id === post.primaryTermId) : undefined;
  const currentPath = buildPostUrl({ post, primaryTerm: term });
  const description = post.seo?.description ?? markdownToPlainText(post.contentMarkdown, 160);

  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site,
    pageTitle: post.seo?.title ?? post.title,
    pageDescription: description || undefined,
    ogImage: post.seo?.ogImage ?? hero?.url,
    currentPath,
  };
  const templateProps: SingleTemplateProps & { site: SiteContext } = {
    site,
    post,
    bodyHtml,
    author,
    hero,
    primaryTerm,
    tags,
  };
  const finalProps = await applyFilters("post.template.props", templateProps, post);

  return renderPageToHtml({
    base: theme.templates.base,
    baseProps,
    template: theme.templates.single,
    templateProps: finalProps as SingleTemplateProps & { site: SiteContext },
  });
}

async function renderHome(ctx: PublishContext): Promise<string> {
  const theme = getActiveTheme(ctx.settings.activeThemeId);
  const site = buildSiteContext(ctx);
  const onlinePosts = ctx.posts
    .filter((p) => p.status === "online")
    .sort((a, b) => (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0))
    .slice(0, ctx.settings.postsPerPage)
    .map((p) => postToCardData(p, ctx));

  let templateProps: HomeTemplateProps & { site: SiteContext };
  if (ctx.settings.homeMode === "static-page" && ctx.settings.homePageId) {
    const page = ctx.pages.find((p) => p.id === ctx.settings.homePageId && p.status === "online");
    if (page) {
      const md = await applyFilters<string>("post.markdown.before", page.contentMarkdown, page);
      let bodyHtml = renderMarkdown(md);
      bodyHtml = await applyFilters<string>("post.html.body", bodyHtml, page);
      templateProps = { site, posts: onlinePosts, staticPage: { post: page, bodyHtml } };
    } else {
      templateProps = { site, posts: onlinePosts };
    }
  } else {
    templateProps = { site, posts: onlinePosts };
  }

  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site,
    pageTitle: "",
    pageDescription: ctx.settings.description,
    currentPath: HOME_PATH,
  };

  return renderPageToHtml({
    base: theme.templates.base,
    baseProps,
    template: theme.templates.home,
    templateProps,
  });
}

async function renderCategory(term: Term, ctx: PublishContext): Promise<string> {
  const theme = getActiveTheme(ctx.settings.activeThemeId);
  const site = buildSiteContext(ctx);
  const posts = ctx.posts
    .filter((p) => p.status === "online" && p.primaryTermId === term.id)
    .sort((a, b) => (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0))
    .map((p) => postToCardData(p, ctx));

  const templateProps: CategoryTemplateProps & { site: SiteContext } = { site, term, posts };
  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site,
    pageTitle: term.name,
    pageDescription: term.description,
    currentPath: buildTermUrl(term),
  };

  return renderPageToHtml({
    base: theme.templates.base,
    baseProps,
    template: theme.templates.category,
    templateProps,
  });
}

async function renderNotFound(ctx: PublishContext): Promise<string> {
  const theme = getActiveTheme(ctx.settings.activeThemeId);
  const site = buildSiteContext(ctx);
  return renderPageToHtml({
    base: theme.templates.base,
    baseProps: {
      site,
      pageTitle: "Page not found",
      currentPath: NOT_FOUND_PATH,
    },
    template: theme.templates.notFound,
    templateProps: { site },
  });
}

async function uploadIfChanged(
  path: string,
  html: string,
  knownHash: string | undefined,
  log: PublishLogger,
): Promise<{ uploaded: boolean; hash: string }> {
  const hash = await sha256Hex(html);
  if (knownHash && knownHash === hash) {
    log({ level: "info", message: `Skipped ${path} (no changes)` });
    return { uploaded: false, hash };
  }
  log({ level: "info", message: `Uploading ${path}…` });
  await uploadFile({ path, content: html });
  return { uploaded: true, hash };
}

// Loads everything the publisher needs from the data context. Caller should
// pass already-subscribed arrays so we avoid double fetching.
export async function buildPublishContext(args: {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  settings: SiteSettings;
  authorLookup: (id: string) => AuthorView | undefined;
}): Promise<PublishContext> {
  // Media library can be large; we fetch it once via getDocs rather than
  // lugging it through the context. Cached by the function caller.
  const mediaList = await listAllMedia();
  const media = new Map(mediaList.map((m) => [m.id, m]));
  return { ...args, media };
}

// Patches the post inside the publish context's `posts`/`pages` arrays. The
// Firestore subscription in CmsDataContext is the eventual source of truth,
// but it lands on a future render — too late for `regenerateListings(ctx)`
// running synchronously after `markPostOnline`/`markPostDraft`. Without this
// patch, the home/category listings would render the pre-transition state
// and miss (or stubbornly include) the post we just toggled.
function applyPostStatusInCtx(ctx: PublishContext, postId: string, patch: Partial<Post>): void {
  const update = (list: Post[]): Post[] =>
    list.map((p) => (p.id === postId ? { ...p, ...patch } : p));
  ctx.posts = update(ctx.posts);
  ctx.pages = update(ctx.pages);
}

// Publish a single post: renders, uploads, deletes the previous path on
// move, then refreshes home + the category archive that owns it. Keeps
// going on partial failure so the user can retry.
export async function publishPost(
  postId: string,
  ctx: PublishContext,
  log: PublishLogger,
): Promise<void> {
  const post = ctx.posts.find((p) => p.id === postId) ?? ctx.pages.find((p) => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found.`);

  await doAction("publish.before", post);

  const term = post.primaryTermId ? ctx.terms.find((t) => t.id === post.primaryTermId) : undefined;
  const newPath = buildPostUrl({ post, primaryTerm: term });

  log({ level: "info", message: "Rendering page…" });
  const html = await renderSingle(post, ctx);

  // If the post moved (slug or category changed), drop the old file first.
  if (post.lastPublishedPath && post.lastPublishedPath !== newPath) {
    log({ level: "info", message: `Deleting ${post.lastPublishedPath}…` });
    try {
      await deleteFile(post.lastPublishedPath);
    } catch (err) {
      log({ level: "warn", message: `Could not delete old path: ${(err as Error).message}` });
    }
  }

  const { hash } = await uploadIfChanged(newPath, html, post.lastPublishedHash, log);
  await markPostOnline(post.id, { lastPublishedPath: newPath, lastPublishedHash: hash });
  // Reflect the transition locally so the listings regenerated below
  // include this post. Without this, renderHome would still see status
  // "draft" and silently skip it until the next publish action.
  applyPostStatusInCtx(ctx, post.id, {
    status: "online",
    lastPublishedPath: newPath,
    lastPublishedHash: hash,
  });

  log({ level: "info", message: "Regenerating listings…" });
  await regenerateListings(ctx, log);

  log({ level: "success", message: `Published to /${newPath}` });
  await doAction("publish.after", post);
  await doAction("publish.complete", post);
}

export async function unpublishPost(
  postId: string,
  ctx: PublishContext,
  log: PublishLogger,
): Promise<void> {
  const post = ctx.posts.find((p) => p.id === postId) ?? ctx.pages.find((p) => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found.`);
  if (post.lastPublishedPath) {
    log({ level: "info", message: `Deleting ${post.lastPublishedPath}…` });
    try {
      await deleteFile(post.lastPublishedPath);
    } catch (err) {
      log({ level: "warn", message: `Delete failed: ${(err as Error).message}` });
    }
  }
  await markPostDraft(post.id);
  // Mirror of the publish path: drop the post from the in-memory online set
  // so renderHome / renderCategory exclude it on the very next regeneration.
  applyPostStatusInCtx(ctx, post.id, {
    status: "draft",
    lastPublishedPath: undefined,
    lastPublishedHash: undefined,
  });
  await regenerateListings(ctx, log);
  log({ level: "success", message: "Unpublished." });
}

// Regenerates the home page and every category archive. Doesn't touch
// individual posts. Called on every publish/unpublish so listings stay in
// sync with the latest state.
export async function regenerateListings(ctx: PublishContext, log: PublishLogger): Promise<void> {
  const homeHtml = await renderHome(ctx);
  await uploadIfChanged(HOME_PATH, homeHtml, undefined, log);

  for (const term of ctx.terms.filter((t) => t.type === "category")) {
    const html = await renderCategory(term, ctx);
    await uploadIfChanged(buildTermUrl(term), html, undefined, log);
  }
}

// Full regeneration: every online post, every category, the home, the 404.
// Used after a theme switch or a settings change that affects every page.
// Throttled to avoid hammering the Flexweg API.
export async function regenerateAll(ctx: PublishContext, log: PublishLogger): Promise<void> {
  const onlinePosts = [...ctx.posts, ...ctx.pages].filter((p) => p.status === "online");
  log({ level: "info", message: `Regenerating ${onlinePosts.length + ctx.terms.length + 2} files…` });

  for (const post of onlinePosts) {
    const term = post.primaryTermId ? ctx.terms.find((t) => t.id === post.primaryTermId) : undefined;
    const path = buildPostUrl({ post, primaryTerm: term });
    const html = await renderSingle(post, ctx);
    const { hash } = await uploadIfChanged(path, html, undefined, log);
    await markPostOnline(post.id, { lastPublishedPath: path, lastPublishedHash: hash });
    // Soft throttle: avoid bursting the API with hundreds of uploads in a tight loop.
    await new Promise((r) => setTimeout(r, 75));
  }

  await regenerateListings(ctx, log);

  const notFoundHtml = await renderNotFound(ctx);
  await uploadIfChanged(NOT_FOUND_PATH, notFoundHtml, undefined, log);

  log({ level: "success", message: "Regeneration complete." });
}

export async function deletePostAndUnpublish(
  postId: string,
  ctx: PublishContext,
  log: PublishLogger,
): Promise<void> {
  const post = ctx.posts.find((p) => p.id === postId) ?? ctx.pages.find((p) => p.id === postId);
  if (!post) return;
  if (post.lastPublishedPath) {
    try {
      await deleteFile(post.lastPublishedPath);
      log({ level: "info", message: `Deleted ${post.lastPublishedPath}` });
    } catch (err) {
      log({ level: "warn", message: `Delete failed: ${(err as Error).message}` });
    }
  }
  // Drop the post from the in-memory listings so the regeneration below
  // doesn't keep referencing it. Caller still handles Firestore deletion
  // afterwards (services/posts.ts).
  ctx.posts = ctx.posts.filter((p) => p.id !== postId);
  ctx.pages = ctx.pages.filter((p) => p.id !== postId);
  if (post.status === "online") {
    log({ level: "info", message: "Regenerating listings…" });
    await regenerateListings(ctx, log);
  }
}
