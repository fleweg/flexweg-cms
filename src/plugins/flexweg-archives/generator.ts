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
  },
): string {
  const theme = getActiveTheme(args.data.settings.activeThemeId);
  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site: args.site,
    pageTitle: args.pageTitle,
    pageDescription: args.pageDescription,
    currentPath: args.currentPath,
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
// top-level index.
export async function regenerateForPost(
  args: RegenerateForPostArgs,
): Promise<RegenerateResult> {
  const { post, ...data } = args;
  const config = readConfig(data.settings);
  return regenerateAffected({ data, config, touchedPost: post });
}

// Force regenerate. Wipes the folder, then rebuilds every page from
// scratch using all currently-eligible entities. Throttled at 75 ms
// between uploads to mirror the rest of the publisher's bulk pace.
export async function forceRegenerate(args: ArchiveData): Promise<RegenerateResult> {
  const config = readConfig(args.settings);
  const result: RegenerateResult = { uploaded: [], deleted: [] };

  // Best-effort wipe. deleteFolder swallows 404 (already gone) and
  // anything else surfaces as a thrown FlexwegApiError + toast via
  // the SettingsPage caller.
  await deleteFolder(ARCHIVES_ROOT);
  result.deleted.push(`${ARCHIVES_ROOT}/`);

  const entities = eligibleEntities(args, config);
  const ctx = buildStubCtx(args);
  const site = buildSiteContext(ctx);
  const allPeriods = computePopulatedPeriods(entities, config.drillDown);

  // Upload every period's page in priority order: years first
  // (visible from the index), then drill-downs.
  const ordered: ArchivePeriod[] = [];
  for (const p of allPeriods.years) ordered.push(p);
  for (const p of allPeriods.drills) ordered.push(p);
  for (const period of ordered) {
    const path = pathFor(period);
    const html = renderPeriodHtml({ data: args, config, site, period, entities });
    await uploadFile({ path, content: html });
    result.uploaded.push(path);
    await sleep(75);
  }

  // Index goes last so it always reflects the freshly-uploaded set.
  const indexHtml = renderIndexHtml({ data: args, config, site, entities });
  await uploadFile({ path: ARCHIVES_INDEX_PATH, content: indexHtml });
  result.uploaded.push(ARCHIVES_INDEX_PATH);

  return result;
}

// ─── Helpers ───────────────────────────────────────────────────────

function pathFor(period: ArchivePeriod): string {
  if (period.kind === "year") return yearIndexPath(period);
  if (period.kind === "month") return monthIndexPath(period);
  return weekIndexPath(period);
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
}): string {
  const t = i18nInstance.getFixedT(
    pickPublicLocale(args.data.settings.language),
    PLUGIN_ID,
  );
  const periodPosts = entitiesForPeriod(args.entities, args.period, args.config.drillDown);
  const meta = buildArchivePageMeta(args.period, periodPosts.length, t);
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
    },
    pageTitle: meta.pageTitle,
    pageDescription: meta.pageDescription,
    currentPath: pathFor(args.period),
  });
}

// Renders the top-level /archives/index.html.
function renderIndexHtml(args: {
  data: ArchiveData;
  config: ArchivesConfig;
  site: SiteContext;
  entities: Post[];
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
    },
    pageTitle: meta.pageTitle,
    pageDescription: meta.pageDescription,
    currentPath: ARCHIVES_INDEX_PATH,
  });
}

// ─── Incremental regeneration core ─────────────────────────────────

interface AffectedRegenerationArgs {
  data: ArchiveData;
  config: ArchivesConfig;
  touchedPost: Post;
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
  const { data, config, touchedPost } = args;
  const result: RegenerateResult = { uploaded: [], deleted: [] };
  const entities = eligibleEntities(data, config);
  const ctx = buildStubCtx(data);
  const site = buildSiteContext(ctx);

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
    const path = pathFor(period);
    if (periodPosts.length === 0) {
      try {
        await deleteFile(path);
        result.deleted.push(path);
      } catch {
        // Already-gone is fine — deleteFile already swallows 404.
      }
      continue;
    }
    const html = renderPeriodHtml({ data, config, site, period, entities });
    await uploadFile({ path, content: html });
    result.uploaded.push(path);
  }

  // Index always re-rendered; cheap and keeps counts honest.
  const indexHtml = renderIndexHtml({ data, config, site, entities });
  await uploadFile({ path: ARCHIVES_INDEX_PATH, content: indexHtml });
  result.uploaded.push(ARCHIVES_INDEX_PATH);

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

  const t = i18nInstance.getFixedT(pickPublicLocale(settings.language), PLUGIN_ID);
  return {
    href: "/archives/",
    label: t("page.seeFullArchives"),
  };
}
