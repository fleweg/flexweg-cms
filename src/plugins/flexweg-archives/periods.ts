// Period helpers for the archives plugin. Pure functions — no
// Firestore, no React — so easy to unit-test in isolation.
//
// A post's period is derived from `publishedAt` (real go-live time).
// When a post has no `publishedAt` yet (rare — happens for online
// posts created before this field landed) we fall back to
// `updatedAt` then `createdAt`. The same chain RSS and sitemaps use.

import type { Post } from "@flexweg/cms-runtime";

export type DrillDown = "none" | "month" | "week";

export interface YearPeriod {
  kind: "year";
  year: number;
}

export interface MonthPeriod {
  kind: "month";
  year: number;
  month: number; // 1-12
}

export interface WeekPeriod {
  kind: "week";
  year: number;
  week: number; // ISO 1-53
}

export type ArchivePeriod = YearPeriod | MonthPeriod | WeekPeriod;

// Resolves a Firestore Timestamp / FieldValue safely. Returns null when
// the field is missing or unreadable — caller decides the fallback.
function timestampToDate(ts: unknown): Date | null {
  if (!ts || typeof ts !== "object") return null;
  const t = ts as { toDate?: () => Date; toMillis?: () => number };
  if (typeof t.toDate === "function") {
    try {
      return t.toDate();
    } catch {
      return null;
    }
  }
  if (typeof t.toMillis === "function") {
    return new Date(t.toMillis());
  }
  return null;
}

// Picks the date that drives a post's archive bucket. Mirrors the
// chain used elsewhere in the codebase so the post lands in the same
// year / month / week the rest of the system thinks it does (RSS,
// sitemaps).
export function pickPostDate(post: Post): Date | null {
  return (
    timestampToDate(post.publishedAt) ??
    timestampToDate(post.updatedAt) ??
    timestampToDate(post.createdAt)
  );
}

// ─── ISO 8601 week ──────────────────────────────────────────────────
// Standard algorithm (Wikipedia "ISO week date"). The week-numbering
// year is NOT always the same as the calendar year — e.g. Dec 31 2024
// belongs to ISO week 2025-W01. Templates must use the year RETURNED
// by this function, not the calendar year of the input date, when
// composing URLs.
export function getISOWeek(d: Date): { year: number; week: number } {
  // UTC copy so DST never shifts the day.
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // Thursday of this ISO week determines the year.
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const year = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year, week };
}

// Computes the period a post belongs to given the drill-down setting.
// "year" is always returned (top-level grouping). When drill-down is
// active the post belongs additionally to a month or week period.
export function postPeriods(post: Post, drillDown: DrillDown): {
  year: YearPeriod;
  drill: MonthPeriod | WeekPeriod | null;
} | null {
  const date = pickPostDate(post);
  if (!date) return null;
  const year: YearPeriod = { kind: "year", year: date.getUTCFullYear() };
  if (drillDown === "month") {
    return {
      year,
      drill: { kind: "month", year: year.year, month: date.getUTCMonth() + 1 },
    };
  }
  if (drillDown === "week") {
    const iso = getISOWeek(date);
    return { year, drill: { kind: "week", year: iso.year, week: iso.week } };
  }
  return { year, drill: null };
}

// ─── Path / URL formatters ─────────────────────────────────────────
// Public-site path strategy: every archive page is an `index.html`
// inside its own folder, so URLs stay clean (no `.html` suffix in the
// URL bar) — same convention as category archives.

export const ARCHIVES_ROOT = "archives";
export const ARCHIVES_INDEX_PATH = `${ARCHIVES_ROOT}/index.html`;

// All path / href helpers accept an optional `root` so the multilang
// generator can produce `<lang>/archives/...` URLs without rewriting
// the formatting logic. Defaults to the canonical `archives` root so
// non-multilang sites stay unchanged.
export function yearIndexPath(p: YearPeriod, root: string = ARCHIVES_ROOT): string {
  return `${root}/${p.year}/index.html`;
}

export function monthIndexPath(p: MonthPeriod, root: string = ARCHIVES_ROOT): string {
  const m = String(p.month).padStart(2, "0");
  return `${root}/${p.year}/${m}/index.html`;
}

export function weekIndexPath(p: WeekPeriod, root: string = ARCHIVES_ROOT): string {
  const w = String(p.week).padStart(2, "0");
  return `${root}/${p.year}/W${w}/index.html`;
}

export function periodIndexPath(p: ArchivePeriod, root: string = ARCHIVES_ROOT): string {
  if (p.kind === "year") return yearIndexPath(p, root);
  if (p.kind === "month") return monthIndexPath(p, root);
  return weekIndexPath(p, root);
}

// HREFs used inside the rendered HTML — relative root paths so the
// site works regardless of `baseUrl` being set.
export function periodHref(p: ArchivePeriod, root: string = ARCHIVES_ROOT): string {
  const path = periodIndexPath(p, root).replace(/index\.html$/, "");
  return `/${path}`;
}

export const ARCHIVES_INDEX_HREF = `/${ARCHIVES_ROOT}/`;

// Returns the root for a given locale: `<lang>/archives` for non-
// primary languages, `archives` for the primary. Used by the
// multilang generator pass.
export function archivesRootFor(language: string | undefined, primaryLanguage: string): string {
  if (!language || language === primaryLanguage) return ARCHIVES_ROOT;
  return `${language}/${ARCHIVES_ROOT}`;
}

export function archivesIndexPathFor(language: string | undefined, primaryLanguage: string): string {
  return `${archivesRootFor(language, primaryLanguage)}/index.html`;
}

export function archivesIndexHrefFor(language: string | undefined, primaryLanguage: string): string {
  return `/${archivesRootFor(language, primaryLanguage)}/`;
}

// Stable string key used as a Map key (e.g. group posts by period).
export function periodKey(p: ArchivePeriod): string {
  if (p.kind === "year") return `Y${p.year}`;
  if (p.kind === "month") return `M${p.year}-${String(p.month).padStart(2, "0")}`;
  return `W${p.year}-${String(p.week).padStart(2, "0")}`;
}

// Sort comparator (most recent first). Year/month/week comparisons
// fall through naturally because we go year → drill-down.
export function comparePeriodsDesc(a: ArchivePeriod, b: ArchivePeriod): number {
  if (a.year !== b.year) return b.year - a.year;
  if (a.kind === "month" && b.kind === "month") return b.month - a.month;
  if (a.kind === "week" && b.kind === "week") return b.week - a.week;
  return 0;
}
