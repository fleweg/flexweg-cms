// React templates rendered into the archive HTML files at publish
// time. They use the active theme's BaseLayout so header / footer /
// branding stay consistent with the rest of the site, and only the
// inner content is plugin-owned.
//
// All public-facing strings come from the plugin's i18n bundle,
// resolved against the *public* site language via i18n.getFixedT(
// pickPublicLocale(settings.language), "flexweg-archives") — NOT the
// admin's UI language.

import type { Post } from "../../core/types";
import type { TFunction } from "i18next";
import {
  type ArchivePeriod,
  type DrillDown,
  type MonthPeriod,
  type WeekPeriod,
  type YearPeriod,
  ARCHIVES_INDEX_HREF,
  comparePeriodsDesc,
  pickPostDate,
  postPeriods,
  periodHref,
  periodKey,
} from "./periods";
import { buildPostUrl } from "../../core/slug";

// Group a flat list of posts into the periods they belong to. Used by
// the year page when drill-down is enabled (groups posts by month or
// week within the year) and by the index page (groups by year).
function groupPostsByPeriod(
  posts: Post[],
  drillDown: DrillDown,
  pickKind: "year" | "drill",
): Map<string, { period: ArchivePeriod; posts: Post[] }> {
  const groups = new Map<string, { period: ArchivePeriod; posts: Post[] }>();
  for (const post of posts) {
    const periods = postPeriods(post, drillDown);
    if (!periods) continue;
    const period = pickKind === "year" ? periods.year : periods.drill ?? periods.year;
    const key = periodKey(period);
    let entry = groups.get(key);
    if (!entry) {
      entry = { period, posts: [] };
      groups.set(key, entry);
    }
    entry.posts.push(post);
  }
  return groups;
}

// Sort posts by date, newest first. Stable for posts on the same day
// via id fallback so output is deterministic.
function sortPostsDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const ta = pickPostDate(a)?.getTime() ?? 0;
    const tb = pickPostDate(b)?.getTime() ?? 0;
    if (tb !== ta) return tb - ta;
    return a.id < b.id ? 1 : -1;
  });
}

// Resolves a post's public URL. Mirrors the publisher's logic so
// archive entries link to the live HTML file. The post's primaryTerm
// (when one exists) is looked up from the trimmed term list passed in
// — buildPostUrl needs the slug to compose the `/<category>/<slug>.html`
// form.
function postPublicHref(
  post: Post,
  terms: { id: string; slug: string }[],
): string {
  const primaryTerm = post.primaryTermId
    ? terms.find((t) => t.id === post.primaryTermId)
    : undefined;
  // Cast: buildPostUrl reads only `slug` and `type` off primaryTerm; we
  // synthesise a `type: "category"` because only category terms produce
  // a URL prefix. Tags are never the primaryTerm in this codebase.
  return `/${buildPostUrl({
    post,
    primaryTerm: primaryTerm
      ? ({ ...primaryTerm, type: "category" } as never)
      : undefined,
  })}`;
}

interface PostListItemProps {
  post: Post;
  language: string;
  terms: { id: string; slug: string }[];
}

function PostListItem({ post, language, terms }: PostListItemProps) {
  const date = pickPostDate(post);
  const dateLabel = date
    ? new Intl.DateTimeFormat(language || "en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    : "";
  return (
    <li className="archives__item">
      <a className="archives__item-link" href={postPublicHref(post, terms)}>
        {post.title}
      </a>
      {dateLabel && (
        <time className="archives__item-date" dateTime={date?.toISOString()}>
          {dateLabel}
        </time>
      )}
    </li>
  );
}

// Localised label for a period (e.g. "January 2025", "Week 23, 2025"). Used
// inside both the index page and as the heading of period pages.
function formatPeriodLabel(period: ArchivePeriod, t: TFunction): string {
  if (period.kind === "year") return String(period.year);
  if (period.kind === "month") {
    const monthName = t(`page.months.${period.month}`);
    return `${monthName} ${period.year}`;
  }
  return t("page.weekTitle", { week: period.week, year: period.year });
}

// ─── Top-level index page (/archives/index.html) ──────────────────
//
// Layout:
//   <h1>Archives</h1>
//   <p>N articles published.</p>
//   <ul>
//     <li><a href="/archives/2026/">2026</a> (12)
//       <ul>  ← only when drill-down is on
//         <li><a href="/archives/2026/01/">January</a> (3)
//         …
//       </ul>
//     </li>
//     …
//   </ul>

interface IndexTemplateProps {
  posts: Post[];
  drillDown: DrillDown;
  showCounts: boolean;
  t: TFunction;
}

export function ArchiveIndexTemplate({
  posts,
  drillDown,
  showCounts,
  t,
}: IndexTemplateProps) {
  const yearGroups = [...groupPostsByPeriod(posts, drillDown, "year").values()].sort(
    (a, b) => comparePeriodsDesc(a.period, b.period),
  );
  const total = posts.length;

  return (
    <main className="archives archives--index">
      <header className="archives__header">
        <h1 className="archives__title">{t("page.indexTitle")}</h1>
        {total > 0 && (
          <p className="archives__subtitle">
            {t("page.indexSubtitle", { count: total })}
          </p>
        )}
      </header>

      {total === 0 && <p className="archives__empty">{t("page.empty")}</p>}

      {yearGroups.length > 0 && (
        <ul className="archives__years">
          {yearGroups.map(({ period, posts: yearPosts }) => {
            const year = period as YearPeriod;
            const drillGroups =
              drillDown === "none"
                ? null
                : [
                    ...groupPostsByPeriod(yearPosts, drillDown, "drill").values(),
                  ].sort((a, b) => comparePeriodsDesc(a.period, b.period));
            return (
              <li key={year.year} className="archives__year">
                <h2 className="archives__year-heading">
                  <a className="archives__year-link" href={periodHref(year)}>
                    {year.year}
                  </a>
                  {showCounts && (
                    <span className="archives__count">({yearPosts.length})</span>
                  )}
                </h2>
                {drillGroups && drillGroups.length > 0 && (
                  <ul className="archives__drilldown">
                    {drillGroups.map(({ period: drillPeriod, posts: drillPosts }) => (
                      <li
                        key={periodKey(drillPeriod)}
                        className="archives__drilldown-item"
                      >
                        <a
                          className="archives__drilldown-link"
                          href={periodHref(drillPeriod)}
                        >
                          {formatPeriodLabel(drillPeriod, t)}
                        </a>
                        {showCounts && (
                          <span className="archives__count">({drillPosts.length})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

// ─── Period page (year / month / week) ────────────────────────────
//
// Year page (drill-down active): groups posts by month or week,
// each group's heading links to the month/week page, and each post
// is a flat list item under it.
//
// Month / week page: flat list of posts, no further grouping.
//
// All pages link back to /archives/ (and year pages, when shown from
// inside a month/week, link back to the year).

interface PeriodTemplateProps {
  period: ArchivePeriod;
  posts: Post[];
  drillDown: DrillDown;
  showCounts: boolean;
  language: string;
  t: TFunction;
  terms: { id: string; slug: string }[];
}

export function ArchivePeriodTemplate({
  period,
  posts,
  drillDown,
  showCounts,
  language,
  t,
  terms,
}: PeriodTemplateProps) {
  const sorted = sortPostsDesc(posts);

  // Heading + subtitle copy varies by period kind.
  let title: string;
  let subtitle: string;
  if (period.kind === "year") {
    title = t("page.yearTitle", { year: period.year });
    subtitle = t("page.yearSubtitle", { count: posts.length, year: period.year });
  } else if (period.kind === "month") {
    const monthName = t(`page.months.${period.month}`);
    title = t("page.monthTitle", { month: monthName, year: period.year });
    subtitle = t("page.monthSubtitle", {
      count: posts.length,
      month: monthName,
      year: period.year,
    });
  } else {
    title = t("page.weekTitle", { week: period.week, year: period.year });
    subtitle = t("page.weekSubtitle", {
      count: posts.length,
      week: period.week,
      year: period.year,
    });
  }

  // Year-page drill-down: split posts into sub-groups so the page
  // shows "January (5) ─ post, post, post / February (3) …".
  const showSubGroups = period.kind === "year" && drillDown !== "none";
  const subGroups = showSubGroups
    ? [...groupPostsByPeriod(sorted, drillDown, "drill").values()].sort((a, b) =>
        comparePeriodsDesc(a.period, b.period),
      )
    : null;

  // Back-link target: month/week pages link to their year; year pages
  // link to the index.
  const backHref =
    period.kind === "year"
      ? ARCHIVES_INDEX_HREF
      : periodHref({ kind: "year", year: period.year });
  const backLabel =
    period.kind === "year"
      ? t("page.backToIndex")
      : t("page.backToYear", { year: period.year });

  return (
    <main className="archives archives--period">
      <header className="archives__header">
        <p className="archives__back">
          <a href={backHref}>{backLabel}</a>
        </p>
        <h1 className="archives__title">{title}</h1>
        {posts.length > 0 && <p className="archives__subtitle">{subtitle}</p>}
      </header>

      {posts.length === 0 && <p className="archives__empty">{t("page.empty")}</p>}

      {!showSubGroups && posts.length > 0 && (
        <ul className="archives__list">
          {sorted.map((post) => (
            <PostListItem
              key={post.id}
              post={post}
              language={language}
              terms={terms}
            />
          ))}
        </ul>
      )}

      {showSubGroups && subGroups && (
        <div className="archives__groups">
          {subGroups.map(({ period: subPeriod, posts: subPosts }) => (
            <section key={periodKey(subPeriod)} className="archives__group">
              <h2 className="archives__group-heading">
                <a
                  className="archives__group-link"
                  href={periodHref(subPeriod)}
                >
                  {formatPeriodLabel(subPeriod, t)}
                </a>
                {showCounts && (
                  <span className="archives__count">({subPosts.length})</span>
                )}
              </h2>
              <ul className="archives__list">
                {sortPostsDesc(subPosts).map((post) => (
                  <PostListItem
                    key={post.id}
                    post={post}
                    language={language}
                    terms={terms}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

// Re-export the prop interfaces so the generator can type the data
// flowing into renderPageToHtml without re-declaring them.
export type { IndexTemplateProps, PeriodTemplateProps };

// Helper that builds the BaseLayoutProps fragment for archive pages.
// Caller still has to supply `site` and `currentPath`. `pageTitle`
// is what shows in the browser tab + <h1> via the BaseLayout.
export function buildArchivePageMeta(
  period: ArchivePeriod | "index",
  posts: number,
  t: TFunction,
): { pageTitle: string; pageDescription: string } {
  if (period === "index") {
    return {
      pageTitle: t("page.indexTitle"),
      pageDescription: t("page.indexSubtitle", { count: posts }),
    };
  }
  if (period.kind === "year") {
    return {
      pageTitle: t("page.yearTitle", { year: period.year }),
      pageDescription: t("page.yearSubtitle", { count: posts, year: period.year }),
    };
  }
  if (period.kind === "month") {
    const monthName = t(`page.months.${period.month}`);
    return {
      pageTitle: t("page.monthTitle", { month: monthName, year: period.year }),
      pageDescription: t("page.monthSubtitle", {
        count: posts,
        month: monthName,
        year: period.year,
      }),
    };
  }
  const weekP = period as WeekPeriod | MonthPeriod;
  if (weekP.kind === "week") {
    return {
      pageTitle: t("page.weekTitle", { week: weekP.week, year: weekP.year }),
      pageDescription: t("page.weekSubtitle", {
        count: posts,
        week: weekP.week,
        year: weekP.year,
      }),
    };
  }
  // Exhaustiveness guard — should never hit.
  return { pageTitle: t("page.indexTitle"), pageDescription: "" };
}
