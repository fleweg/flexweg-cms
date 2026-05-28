// Generator: produces every file under /archives/ on the public
// site. Two entry points:
//
//   • regenerateForPost(args) — incremental, called on
//     publish.complete / post.unpublished / post.deleted. Recomputes
//     the touched post's periods and rebuilds only those plus the
//     top-level index. Empty periods get deleted from Flexweg so the
//     index never references stale files.
//
//   • forceRegenerate(args) — wipes /archives/ folder and rebuilds
//     everything from scratch using all currently-online posts.
//
// Both go through `uploadFile` / `deleteFile` from flexwegApi, so
// they inherit the standard error funnel + toast behaviour.
//
// API takes `{ posts, pages, terms, settings }` rather than a full
// PublishContext so the SettingsPage can call forceRegenerate from
// useCmsData() (which lacks the media Map and user records the
// lifecycle hooks have). The small handful of fields actually used —
// settings + posts/pages/terms for menu resolution — is the same
// information the rest of the publisher exposes.

import type { ComponentType } from "react";
import {
  i18n as i18nInstance,
  pickPublicLocale,
  renderPageToHtml,
  getActiveTheme,
  buildSiteContext,
  deleteFile,
  deleteFolder,
  uploadFile,
  type Post,
  type SiteSettings,
  type Term,
  type BaseLayoutProps,
  type SiteContext,
  type PublishContext,
} from "@flexweg/cms-runtime";
import {
  type ArchivePeriod,
  type DrillDown,
  type MonthPeriod,
  type WeekPeriod,
  type YearPeriod,
  ARCHIVES_INDEX_PATH,
  archivesIndexHrefFor,
  archivesIndexPathFor,
  archivesRootFor,
  comparePeriodsDesc,
  monthIndexPath,
  periodKey,
  postPeriods,
  weekIndexPath,
  yearIndexPath,
  ARCHIVES_ROOT,
} from "./periods";
import {
  ArchiveIndexTemplate,
  ArchivePeriodTemplate,
  buildArchivePageMeta,
} from "./render";

export interface ArchivesConfig {
  drillDown: DrillDown;
  // Include static pages in the archive listings. Off by default —
  // pages are rarely chronological.
  includePages: boolean;
  // Render a "See full archives →" link below home / category
  // listings. Resolved by the publisher when emitting those pages —
  // see resolveArchivesLink() below.
  addArchivesLinkToHome: boolean;
  addArchivesLinkToCategory: boolean;
  // Cosmetic: append `(N)` next to each period.
  showCounts: boolean;
}

export const DEFAULT_ARCHIVES_CONFIG: ArchivesConfig = {
  drillDown: "month",
  includePages: false,
  addArchivesLinkToHome: true,
  addArchivesLinkToCategory: true,
  showCounts: true,
};

export const PLUGIN_ID = "flexweg-archives";

// Reads the live config from settings, merged with defaults so a
// fresh install (or a partial save) behaves predictably.
export function readConfig(settings: SiteSettings): ArchivesConfig {
  const stored = (settings.pluginConfigs as Record<string, unknown> | undefined)?.[
    PLUGIN_ID
  ] as Partial<ArchivesConfig> | undefined;
  return { ...DEFAULT_ARCHIVES_CONFIG, ...(stored ?? {}) };
}

// Minimal data shape the generator consumes. SettingsPage passes
// these from useCmsData(); lifecycle hooks pass them from
// PublishContext fields. Avoids forcing the SettingsPage to
// construct media/users/authorLookup which it doesn't have.
export interface ArchiveData {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  settings: SiteSettings;
}

// Builds a stub PublishContext for buildSiteContext / theme
// rendering. media + users + authorLookup aren't read by the archive
// rendering path (we only list post titles + dates), so empty values
// are safe. Keeps a single SiteContext-building code path between
// the publisher and this plugin.
function buildStubCtx(data: ArchiveData): PublishContext {
  return {
    posts: data.posts,
    pages: data.pages,
    terms: data.terms,
    media: new Map(),
    settings: data.settings,
    users: [],
    authorLookup: () => undefined,
  };
}

// Returns the set of posts (and optionally pages) that should appear
// in the archives, filtered to `online` only.
function eligibleEntities(data: ArchiveData, config: ArchivesConfig): Post[] {
  const posts = data.posts.filter((p) => p.status === "online");
  if (!config.includePages) return posts;
  const pages = data.pages.filter((p) => p.status === "online");
  return [...posts, ...pages];
}

// Term shape used by the render templates to compute post hrefs.
function termsForLinks(data: ArchiveData): { id: string; slug: string }[] {
  return data.terms.map((t) => ({ id: t.id, slug: t.slug }));
}

// ─── Single-page rendering ─────────────────────────────────────────

interface RenderArgs {
  data: ArchiveData;
  config: ArchivesConfig;
  site: SiteContext;
}

// Wraps the inner template in the active theme's BaseLayout. Same
// pattern as publisher.renderHome / renderCategory — we go through
// renderPageToHtml so plugin filters (page.head.extra, etc.) still
// fire on archive pages.
function renderArchivePage<TInner extends object>(
  args: RenderArgs & {
    inner: ComponentType<TInner>;
    innerProps: TInner;
    pageTitle: string;
    pageDescription: string;
    currentPath: string;
    // Set to the target language on localised renders so the theme
    // emits `<html lang="fr">` for FR archive pages. Undefined falls
    // back to `site.settings.language` per the theme convention.
    currentLocale?: string;
  },
): string {
  const theme = getActiveTheme(args.data.settings.activeThemeId);
  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site: args.site,
    pageTitle: args.pageTitle,
    pageDescription: args.pageDescription,
    currentPath: args.currentPath,
    currentLocale: args.currentLocale,
  };
  return renderPageToHtml({
    base: theme.templates.base,
    baseProps,
    template: args.inner,
    templateProps: args.innerProps,
  });
}

// ─── Public entry: incremental regeneration ────────────────────────

interface RegenerateForPostArgs extends ArchiveData {
  // The post that just changed. May be in any status — caller's job
  // is the publish.complete/unpublished/deleted hook.
  post: Post;
}

interface RegenerateResult {
  uploaded: string[];
  deleted: string[];
}

// Computes the periods affected by `post` and the periods that are
// still populated after the change. Then uploads every affected
// period's page (if non-empty) or deletes it (if empty), plus the
// top-level index. Repeats per language when the multilang plugin is
// active so localised archives stay in sync without a forced regen.
export async function regenerateForPost(
  args: RegenerateForPostArgs,
): Promise<RegenerateResult> {
  const { post, ...data } = args;
  const config = readConfig(data.settings);
  const aggregate: RegenerateResult = { uploaded: [], deleted: [] };

  for (const { language, isPrimary } of archiveLanguages(data)) {
    const localData = buildLocalizedData(data, language, isPrimary);
    if (!localData) continue;
    const root = archivesRootFor(language, isPrimary ? language : "__primary__");
    const indexPath = archivesIndexPathFor(language, isPrimary ? language : "__primary__");
    const indexHref = archivesIndexHrefFor(language, isPrimary ? language : "__primary__");

    // The touched post might exist in this locale only if a
    // translation exists (for non-primary). When the localised data
    // doesn't include the post at all, the localised archive's
    // existing pages are still re-rendered (post counts change),
    // but the touched post itself doesn't contribute. For incremental
    // regen we pass the touched post as-is — its date is unchanged
    // by locale anyway.
    const result = await regenerateAffected({
      data: localData,
      config,
      touchedPost: post,
      root,
      indexPath,
      indexHref,
      currentLocale: isPrimary ? undefined : language,
    });
    aggregate.uploaded.push(...result.uploaded);
    aggregate.deleted.push(...result.deleted);
  }

  return aggregate;
}

// ─── Multi-language helpers ────────────────────────────────────────
//
// The flexweg-multilang plugin stores its config under
// `settings.pluginConfigs["flexweg-multilang"]` with the shape
// `{ primaryLanguage: string; enabledLanguages: string[] }`. We read
// it generically here — no import dependency on the multilang
// plugin's types, which would cross the in-tree / external boundary.
//
// `Post.translations` and `Term.translations` carry the localised
// payloads as opaque `Record<string, unknown>` per the core types.
// We narrow them inline below.

interface MultilangConfigSlice {
  primaryLanguage: string;
  enabledLanguages: string[];
}

interface PostTranslationSlice {
  title: string;
  slug: string;
}

interface TermTranslationSlice {
  name: string;
  slug: string;
}

function readMultilangConfig(settings: SiteSettings): MultilangConfigSlice | null {
  if (settings.enabledPlugins?.["flexweg-multilang"] === false) return null;
  const raw = settings.pluginConfigs?.["flexweg-multilang"] as
    | Partial<MultilangConfigSlice>
    | undefined;
  if (!raw) return null;
  const primary = raw.primaryLanguage || (settings.language || "en").split("-")[0]!;
  const enabled = Array.isArray(raw.enabledLanguages) ? raw.enabledLanguages : [];
  if (enabled.length === 0) return null;
  return { primaryLanguage: primary, enabledLanguages: enabled };
}

function getPostTranslation(post: Post, language: string): PostTranslationSlice | null {
  const map = post.translations as Record<string, PostTranslationSlice> | undefined;
  const t = map?.[language];
  if (!t || !t.slug || !t.title) return null;
  return t;
}

function getTermTranslation(term: Term, language: string): TermTranslationSlice | null {
  const map = term.translations as Record<string, TermTranslationSlice> | undefined;
  const t = map?.[language];
  if (!t || !t.slug || !t.name) return null;
  return t;
}

// Builds shadow data for a target language. Same trick as the
// multilang plugin's `buildLocalizedShadowCtx`: pre-prefix the
// category term slug with `<lang>/` so the standard `buildPostUrl`
// produces correctly-prefixed post URLs in the archive listings.
// Pages without a category get the prefix on their own slug.
//
// Returns null when no enabled-language translation exists at all
// (the archive index for that language would be empty — skip it).
function buildLocalizedData(
  data: ArchiveData,
  language: string,
  isPrimary: boolean,
): ArchiveData | null {
  if (isPrimary) {
    // Primary language uses the entity's native fields. Override
    // settings.language to the target locale (which for primary
    // matches `settings.language` already — but the importer may
    // store something like "fr-CA" while the multilang plugin
    // expects just "fr"; the override normalises).
    return { ...data, settings: { ...data.settings, language } };
  }

  const langPrefix = `${language}/`;
  const shadowTerms: Term[] = data.terms.map((term) => {
    if (term.type !== "category") return term;
    const trans = getTermTranslation(term, language);
    if (!trans) return term;
    return { ...term, name: trans.name, slug: `${langPrefix}${trans.slug}` };
  });

  const transformPost = (p: Post): Post | null => {
    const trans = getPostTranslation(p, language);
    if (!trans) return null;
    const isUncategorized = p.type !== "post" || !p.primaryTermId;
    return {
      ...p,
      title: trans.title,
      slug: isUncategorized ? `${langPrefix}${trans.slug}` : trans.slug,
    };
  };

  const shadowPosts = data.posts.map(transformPost).filter((p): p is Post => p !== null);
  const shadowPages = data.pages.map(transformPost).filter((p): p is Post => p !== null);

  if (shadowPosts.length === 0 && shadowPages.length === 0) return null;

  return {
    posts: shadowPosts,
    pages: shadowPages,
    terms: shadowTerms,
    settings: { ...data.settings, language },
  };
}

// Returns the list of languages to generate archives for. Always
// includes the primary; extends with each enabled-language that has
// at least one translated entry.
function archiveLanguages(data: ArchiveData): { language: string; isPrimary: boolean }[] {
  const config = readMultilangConfig(data.settings);
  if (!config) return [{ language: data.settings.language || "en", isPrimary: true }];
  const out: { language: string; isPrimary: boolean }[] = [
    { language: config.primaryLanguage, isPrimary: true },
  ];
  for (const lang of config.enabledLanguages) {
    if (lang === config.primaryLanguage) continue;
    out.push({ language: lang, isPrimary: false });
  }
  return out;
}

// Force regenerate. Wipes the folder, then rebuilds every page from
// scratch using all currently-eligible entities. Throttled at 75 ms
// between uploads to mirror the rest of the publisher's bulk pace.
export async function forceRegenerate(args: ArchiveData): Promise<RegenerateResult> {
  const config = readConfig(args.settings);
  const aggregate: RegenerateResult = { uploaded: [], deleted: [] };

  const langs = archiveLanguages(args);
  for (const { language, isPrimary } of langs) {
    const localData = buildLocalizedData(args, language, isPrimary);
    if (!localData) continue;
    const root = archivesRootFor(language, isPrimary ? language : "__primary__");
    const indexPath = archivesIndexPathFor(language, isPrimary ? language : "__primary__");
    const indexHref = archivesIndexHrefFor(language, isPrimary ? language : "__primary__");

    // Wipe the per-language root. For the primary that's `archives/`;
    // for FR it's `fr/archives/`. Best-effort — 404 is swallowed
    // inside deleteFolder.
    await deleteFolder(root);
    aggregate.deleted.push(`${root}/`);

    const result = await forceRegenerateOneLocale({
      data: localData,
      config,
      root,
      indexPath,
      indexHref,
      currentLocale: isPrimary ? undefined : language,
    });
    aggregate.uploaded.push(...result.uploaded);
    aggregate.deleted.push(...result.deleted);
  }

  return aggregate;
}

// Per-language force regenerate. Same logic as the previous
// monolithic implementation, scoped to a single root.
async function forceRegenerateOneLocale(args: {
  data: ArchiveData;
  config: ArchivesConfig;
  root: string;
  indexPath: string;
  indexHref: string;
  currentLocale?: string;
}): Promise<RegenerateResult> {
  const { data, config, root, indexPath, indexHref, currentLocale } = args;
  const result: RegenerateResult = { uploaded: [], deleted: [] };
  const entities = eligibleEntities(data, config);
  const ctx = buildStubCtx(data);
  const site = buildSiteContextWithHome(ctx, currentLocale);
  const allPeriods = computePopulatedPeriods(entities, config.drillDown);

  const ordered: ArchivePeriod[] = [];
  for (const p of allPeriods.years) ordered.push(p);
  for (const p of allPeriods.drills) ordered.push(p);
  for (const period of ordered) {
    const path = pathFor(period, root);
    const html = renderPeriodHtml({
      data,
      config,
      site,
      period,
      entities,
      root,
      indexHref,
      currentLocale,
    });
    await uploadFile({ path, content: html });
    result.uploaded.push(path);
    await sleep(75);
  }

  // Index goes last so it always reflects the freshly-uploaded set.
  const indexHtml = renderIndexHtml({
    data,
    config,
    site,
    entities,
    root,
    indexPath,
    currentLocale,
  });
  await uploadFile({ path: indexPath, content: indexHtml });
  result.uploaded.push(indexPath);

  return result;
}

// Wraps `buildSiteContext` so the resulting SiteContext also carries
// the `homePath` override for localised renders. The base helper
// doesn't know about multilang, so we patch it post-call.
function buildSiteContextWithHome(ctx: PublishContext, currentLocale: string | undefined): SiteContext {
  const site = buildSiteContext(ctx);
  if (!currentLocale) return site;
  return { ...site, homePath: `/${currentLocale}/index.html` };
}

// ─── Helpers ───────────────────────────────────────────────────────

function pathFor(period: ArchivePeriod, root: string = ARCHIVES_ROOT): string {
  if (period.kind === "year") return yearIndexPath(period, root);
  if (period.kind === "month") return monthIndexPath(period, root);
  return weekIndexPath(period, root);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Walks the entity list and returns the set of populated periods
// (years + drill-downs). Used both by the index renderer and by the
// regeneration logic to know which files should currently exist on
// the public site.
function computePopulatedPeriods(
  entities: Post[],
  drillDown: DrillDown,
): { years: YearPeriod[]; drills: (MonthPeriod | WeekPeriod)[] } {
  const yearMap = new Map<string, YearPeriod>();
  const drillMap = new Map<string, MonthPeriod | WeekPeriod>();
  for (const post of entities) {
    const periods = postPeriods(post, drillDown);
    if (!periods) continue;
    yearMap.set(periodKey(periods.year), periods.year);
    if (periods.drill) drillMap.set(periodKey(periods.drill), periods.drill);
  }
  const years = [...yearMap.values()].sort(comparePeriodsDesc) as YearPeriod[];
  const drills = [...drillMap.values()].sort(comparePeriodsDesc) as (
    | MonthPeriod
    | WeekPeriod
  )[];
  return { years, drills };
}

// Filters entities to those that belong to a given period.
function entitiesForPeriod(
  entities: Post[],
  period: ArchivePeriod,
  drillDown: DrillDown,
): Post[] {
  return entities.filter((post) => {
    const periods = postPeriods(post, drillDown);
    if (!periods) return false;
    if (period.kind === "year") return periods.year.year === period.year;
    if (period.kind === "month") {
      return (
        periods.drill?.kind === "month" &&
        periods.drill.year === period.year &&
        periods.drill.month === period.month
      );
    }
    return (
      periods.drill?.kind === "week" &&
      periods.drill.year === period.year &&
      periods.drill.week === period.week
    );
  });
}

// Renders the inner HTML for a period page.
function renderPeriodHtml(args: {
  data: ArchiveData;
  config: ArchivesConfig;
  site: SiteContext;
  period: ArchivePeriod;
  entities: Post[];
  // Locale-specific overrides — all default to the primary tree
  // behaviour when undefined.
  root?: string;
  indexHref?: string;
  currentLocale?: string;
}): string {
  const t = i18nInstance.getFixedT(
    pickPublicLocale(args.data.settings.language),
    PLUGIN_ID,
  );
  const periodPosts = entitiesForPeriod(args.entities, args.period, args.config.drillDown);
  const meta = buildArchivePageMeta(args.period, periodPosts.length, t);
  const root = args.root ?? ARCHIVES_ROOT;
  return renderArchivePage({
    data: args.data,
    config: args.config,
    site: args.site,
    inner: ArchivePeriodTemplate,
    innerProps: {
      period: args.period,
      posts: periodPosts,
      drillDown: args.config.drillDown,
      showCounts: args.config.showCounts,
      language: args.data.settings.language,
      t,
      terms: termsForLinks(args.data),
      root,
      indexHref: args.indexHref,
    },
    pageTitle: meta.pageTitle,
    pageDescription: meta.pageDescription,
    currentPath: pathFor(args.period, root),
    currentLocale: args.currentLocale,
  });
}

// Renders the top-level /archives/index.html (or /<lang>/archives/index.html).
function renderIndexHtml(args: {
  data: ArchiveData;
  config: ArchivesConfig;
  site: SiteContext;
  entities: Post[];
  root?: string;
  indexPath?: string;
  currentLocale?: string;
}): string {
  const t = i18nInstance.getFixedT(
    pickPublicLocale(args.data.settings.language),
    PLUGIN_ID,
  );
  const meta = buildArchivePageMeta("index", args.entities.length, t);
  return renderArchivePage({
    data: args.data,
    config: args.config,
    site: args.site,
    inner: ArchiveIndexTemplate,
    innerProps: {
      posts: args.entities,
      drillDown: args.config.drillDown,
      showCounts: args.config.showCounts,
      t,
      root: args.root ?? ARCHIVES_ROOT,
    },
    pageTitle: meta.pageTitle,
    pageDescription: meta.pageDescription,
    currentPath: args.indexPath ?? ARCHIVES_INDEX_PATH,
    currentLocale: args.currentLocale,
  });
}

// ─── Incremental regeneration core ─────────────────────────────────

interface AffectedRegenerationArgs {
  data: ArchiveData;
  config: ArchivesConfig;
  touchedPost: Post;
  // Locale-specific overrides — see forceRegenerateOneLocale for
  // the rationale. Default to the primary tree behaviour.
  root?: string;
  indexPath?: string;
  indexHref?: string;
  currentLocale?: string;
}

// Workhorse called from regenerateForPost. Strategy:
//
// 1. Compute the set of populated periods AFTER the change (read
//    data.posts/pages — the publisher patches these to reflect the
//    just-completed action via applyPostStatusInCtx).
//
// 2. Compute the periods the touched post used to belong to (its
//    publishedAt/updatedAt date is unchanged by the action — what
//    changed is its status). These are the periods to inspect.
//
// 3. For each touched period: if still populated, re-render the file.
//    If empty (last post of that period left), delete the file.
//
// 4. Always re-render the index (counts may have changed even if no
//    period appeared/disappeared).
async function regenerateAffected(
  args: AffectedRegenerationArgs,
): Promise<RegenerateResult> {
  const { data, config, touchedPost, currentLocale } = args;
  const root = args.root ?? ARCHIVES_ROOT;
  const indexPath = args.indexPath ?? ARCHIVES_INDEX_PATH;
  const indexHref = args.indexHref;
  const result: RegenerateResult = { uploaded: [], deleted: [] };
  const entities = eligibleEntities(data, config);
  const ctx = buildStubCtx(data);
  const site = buildSiteContextWithHome(ctx, currentLocale);

  // Periods the touched post is/was in (from its date — unchanged).
  const touchedPeriods = postPeriods(touchedPost, config.drillDown);
  const periodsToCheck: ArchivePeriod[] = [];
  if (touchedPeriods) {
    periodsToCheck.push(touchedPeriods.year);
    if (touchedPeriods.drill) periodsToCheck.push(touchedPeriods.drill);
  }

  // For each affected period: render or delete.
  for (const period of periodsToCheck) {
    const periodPosts = entitiesForPeriod(entities, period, config.drillDown);
    const path = pathFor(period, root);
    if (periodPosts.length === 0) {
      try {
        await deleteFile(path);
        result.deleted.push(path);
      } catch {
        // Already-gone is fine — deleteFile already swallows 404.
      }
      continue;
    }
    const html = renderPeriodHtml({
      data,
      config,
      site,
      period,
      entities,
      root,
      indexHref,
      currentLocale,
    });
    await uploadFile({ path, content: html });
    result.uploaded.push(path);
  }

  // Index always re-rendered; cheap and keeps counts honest.
  const indexHtml = renderIndexHtml({
    data,
    config,
    site,
    entities,
    root,
    indexPath,
    currentLocale,
  });
  await uploadFile({ path: indexPath, content: indexHtml });
  result.uploaded.push(indexPath);

  return result;
}

// ─── Archives link helper (consumed by publisher) ──────────────────

// Resolves the "See full archives →" link for a given destination
// (home or category page). Returns undefined when the plugin is
// disabled, the per-page toggle is off, or no posts exist yet (so
// the link wouldn't lead anywhere useful).
//
// Lives here (rather than in the publisher) so the resolution rules
// stay co-located with the plugin owning them.
export function resolveArchivesLink(
  settings: SiteSettings,
  posts: Post[],
  destination: "home" | "category",
): { href: string; label: string } | undefined {
  // Plugin-enabled gate. The publisher could call this regardless,
  // so we re-check here for defence in depth.
  if (settings.enabledPlugins?.[PLUGIN_ID] === false) return undefined;
  const config = readConfig(settings);
  if (destination === "home" && !config.addArchivesLinkToHome) return undefined;
  if (destination === "category" && !config.addArchivesLinkToCategory) return undefined;

  // No posts => no archives => no point linking.
  const hasPosts = posts.some((p) => p.status === "online");
  if (!hasPosts) return undefined;

  // When multilang is active and `settings.language` here represents
  // a non-primary locale (the publisher overrides it in the shadow
  // ctx before rendering localised home / category pages), point at
  // the matching archive tree. The link otherwise targets the
  // primary `/archives/` as before.
  const multilang = readMultilangConfig(settings);
  const lang = (settings.language || "").split("-")[0];
  const href =
    multilang && lang && lang !== multilang.primaryLanguage
      ? archivesIndexHrefFor(lang, multilang.primaryLanguage)
      : "/archives/";

  const t = i18nInstance.getFixedT(pickPublicLocale(settings.language), PLUGIN_ID);
  return {
    href,
    label: t("page.seeFullArchives"),
  };
}
