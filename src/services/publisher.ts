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
import { mediaToView, pickFormat } from "../core/media";
import { resolveMenuItems } from "../core/menuResolver";
import { getActiveTheme } from "../themes";
import type {
  AuthorView,
  BaseLayoutProps,
  CategoryTemplateProps,
  HomeTemplateProps,
  MediaView,
  SingleTemplateProps,
  SiteContext,
} from "../themes/types";
import type { Media, Post, SiteSettings, Term } from "../core/types";
import { deleteFile, uploadFile } from "./flexwegApi";
import { listAllMedia } from "./media";
import { publishMenuJson } from "./menuPublisher";
import { markPostDraft, markPostOnline } from "./posts";

export interface PublishLogEntry {
  level: "info" | "success" | "warn" | "error";
  message: string;
}

export type PublishLogger = (entry: PublishLogEntry) => void;

// Exported so plugins receiving action-hook callbacks (publish.complete,
// post.unpublished, post.deleted) can type their handlers without
// re-declaring the shape.
export interface PublishContext {
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
  return mediaToView(media.get(id));
}

function buildSiteContext(ctx: PublishContext): SiteContext {
  // Menus are also resolved by the dynamic menu.json publisher; the shared
  // helper in core/menuResolver.ts is the single source of truth so static
  // header rendering and the runtime JSON stay in lockstep.
  return {
    settings: ctx.settings,
    resolvedMenus: {
      header: resolveMenuItems(ctx.settings.menus.header ?? [], ctx),
      footer: resolveMenuItems(ctx.settings.menus.footer ?? [], ctx),
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
    ogImage: post.seo?.ogImage ?? pickFormat(hero, "large"),
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

// Removes every stale historical path attached to a post (lastPublishedPath
// + previousPublishedPaths) except for `keepPath`. Returns the list of
// paths whose deletion *failed* with a non-404 error so the caller can
// re-persist them for retry on the next publish. 404 is silent — the file
// was already gone.
async function cleanupStalePaths(
  paths: Iterable<string>,
  keepPath: string,
  log: PublishLogger,
): Promise<string[]> {
  const stale = new Set<string>();
  for (const p of paths) {
    if (p && p !== keepPath) stale.add(p);
  }
  const failed: string[] = [];
  for (const path of stale) {
    log({ level: "info", message: `Deleting ${path}…` });
    try {
      await deleteFile(path);
    } catch (err) {
      log({ level: "warn", message: `Could not delete ${path}: ${(err as Error).message}` });
      failed.push(path);
    }
  }
  return failed;
}

// Publish a single post: renders, uploads, deletes every known stale path
// (current `lastPublishedPath` + any `previousPublishedPaths` left over
// from a partially-failed previous publish), then refreshes home + the
// category archive that owns it. Failed deletions are persisted back into
// `previousPublishedPaths` so the next publish retries them.
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

  // Wipe every known stale path before re-uploading. If a previous publish
  // failed to clean a path, it lives in previousPublishedPaths and is
  // retried here. Deletion happens BEFORE upload so a same-path republish
  // only ever transitions the file (delete-then-upload), and a path-change
  // never leaves the old file orphaned.
  const failedDeletions = await cleanupStalePaths(
    [post.lastPublishedPath ?? "", ...(post.previousPublishedPaths ?? [])],
    newPath,
    log,
  );

  const { hash } = await uploadIfChanged(newPath, html, post.lastPublishedHash, log);
  await markPostOnline(post.id, {
    lastPublishedPath: newPath,
    lastPublishedHash: hash,
    previousPublishedPaths: failedDeletions,
  });
  // Reflect the transition locally so the listings regenerated below
  // include this post. Without this, renderHome would still see status
  // "draft" and silently skip it until the next publish action.
  applyPostStatusInCtx(ctx, post.id, {
    status: "online",
    lastPublishedPath: newPath,
    lastPublishedHash: hash,
    previousPublishedPaths: failedDeletions,
  });

  log({ level: "info", message: "Regenerating listings…" });
  await regenerateListings(ctx, log);
  await republishMenu(ctx, log);

  log({ level: "success", message: `Published to /${newPath}` });
  await doAction("publish.after", post, ctx);
  await doAction("publish.complete", post, ctx);
}

export async function unpublishPost(
  postId: string,
  ctx: PublishContext,
  log: PublishLogger,
): Promise<void> {
  const post = ctx.posts.find((p) => p.id === postId) ?? ctx.pages.find((p) => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found.`);
  // Wipe every known historical path so unpublishing never leaves a
  // visible file on the public site. `keepPath: ""` makes cleanupStalePaths
  // attempt every path it sees (the empty string is filtered out by the
  // truthy check inside).
  await cleanupStalePaths(
    [post.lastPublishedPath ?? "", ...(post.previousPublishedPaths ?? [])],
    "",
    log,
  );
  await markPostDraft(post.id);
  // Mirror of the publish path: drop the post from the in-memory online set
  // so renderHome / renderCategory exclude it on the very next regeneration.
  applyPostStatusInCtx(ctx, post.id, {
    status: "draft",
    lastPublishedPath: undefined,
    lastPublishedHash: undefined,
  });
  await regenerateListings(ctx, log);
  await republishMenu(ctx, log);
  log({ level: "success", message: "Unpublished." });
  await doAction("post.unpublished", post, ctx);
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

// Re-publish the dynamic /menu.json blob the public-side burger loader
// reads. Called as a tail-step of every publish/unpublish/delete so menu
// items stay in sync with post slugs / category slugs even though we
// don't re-render every HTML page. Best-effort: a failure here gets
// logged + already-toasted by flexwegApi but never aborts the publish.
async function republishMenu(ctx: PublishContext, log: PublishLogger): Promise<void> {
  try {
    await publishMenuJson(ctx.settings, ctx.posts, ctx.pages, ctx.terms);
  } catch (err) {
    log({ level: "warn", message: `Menu JSON republish failed: ${(err as Error).message}` });
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
    // Same multi-path cleanup as a single publish — keeps the public site
    // in a consistent state if regenerateAll is invoked after a series of
    // path changes that left orphans.
    const failedDeletions = await cleanupStalePaths(
      [post.lastPublishedPath ?? "", ...(post.previousPublishedPaths ?? [])],
      path,
      log,
    );
    const { hash } = await uploadIfChanged(path, html, undefined, log);
    await markPostOnline(post.id, {
      lastPublishedPath: path,
      lastPublishedHash: hash,
      previousPublishedPaths: failedDeletions,
    });
    // Soft throttle: avoid bursting the API with hundreds of uploads in a tight loop.
    await new Promise((r) => setTimeout(r, 75));
  }

  await regenerateListings(ctx, log);

  const notFoundHtml = await renderNotFound(ctx);
  await uploadIfChanged(NOT_FOUND_PATH, notFoundHtml, undefined, log);
  await republishMenu(ctx, log);

  log({ level: "success", message: "Regeneration complete." });
}

export async function deletePostAndUnpublish(
  postId: string,
  ctx: PublishContext,
  log: PublishLogger,
): Promise<void> {
  const post = ctx.posts.find((p) => p.id === postId) ?? ctx.pages.find((p) => p.id === postId);
  if (!post) return;
  // Wipe every recorded historical path. The Firestore doc is about to
  // be removed by the caller, so even paths whose deletion still fails
  // become unrecoverable orphans — best-effort is the right policy here.
  await cleanupStalePaths(
    [post.lastPublishedPath ?? "", ...(post.previousPublishedPaths ?? [])],
    "",
    log,
  );
  // Drop the post from the in-memory listings so the regeneration below
  // doesn't keep referencing it. Caller still handles Firestore deletion
  // afterwards (services/posts.ts).
  ctx.posts = ctx.posts.filter((p) => p.id !== postId);
  ctx.pages = ctx.pages.filter((p) => p.id !== postId);
  if (post.status === "online") {
    log({ level: "info", message: "Regenerating listings…" });
    await regenerateListings(ctx, log);
    await republishMenu(ctx, log);
  }
  await doAction("post.deleted", post, ctx);
}
