# Flexweg Archives

Static archive pages — a search-engine-friendly, static-hosting-friendly alternative to pagination.

## What it does

When enabled, this plugin produces a tree of HTML pages under `/archives/` on your public site:

```
/archives/                       → top-level table of contents
/archives/2026/                  → all posts published in 2026
/archives/2026/01/   (optional)  → posts of January 2026
/archives/2026/W23/  (optional)  → posts of ISO week 23, 2026
```

Each page lists post titles + dates, all linking to the live post URL. The pages live in the active theme's `BaseLayout`, so header / footer / branding stay consistent with the rest of the site.

It also injects a **"See full archives →"** link below the home page and category archive listings (toggleable per destination), letting visitors browse older posts without paginating — the entire archive is one click away from any landing page.

## Why archives, not pagination

Static hosting (no server, no JS reads) makes pagination expensive: every paginated page must be pre-generated, every link must be a real file, and any post added forces every page after that to shift. Archives are O(1) per write — adding a post touches at most three files (the year page, the optional drill-down page, the index) regardless of how many posts exist on the site.

## Settings

Reachable from **Plugins → Configure** or directly at `/admin/#/settings/plugin/flexweg-archives`.

| Setting | Default | Effect |
|---|---|---|
| Drill-down | `Year → month` | Sub-grouping inside each year. Years are always the top level. Pick `none` for one big year-list page, `month` for `/archives/2026/01/` sub-pages, or `week` for `/archives/2026/W23/` sub-pages. |
| Include static pages | Off | When on, static pages (type `page`) appear in the archives alongside posts. Most sites keep this off — pages are rarely chronological. |
| Show counts | On | Whether to append `(N)` to each period entry in the index. |
| Show "See full archives" on home | On | Renders a footer link below the home page listing. Hidden when no posts exist yet. |
| Show "See full archives" on category | On | Same, on category archive pages. |

There's also a **Force regenerate** button that wipes `/archives/` on Flexweg and rebuilds every file from scratch using the currently-online post set. Use it after switching drill-down (so old `/2025/01/` pages stop existing if you switched to weekly) or after a bulk import.

## How regeneration works

The plugin subscribes to three lifecycle hooks: `publish.complete`, `post.unpublished`, `post.deleted`. On every event:

1. It computes the periods the touched post belongs to (year + drill-down).
2. For each, it re-renders the corresponding archive page if any post still belongs there, or **deletes** the file if the period just emptied out.
3. It always re-renders `/archives/index.html` to keep the counts and period list honest.

So changing a post's status or deleting it never leaves a dangling reference, and never regenerates files that didn't change.

## URL strategy

| Period | Path | Example |
|---|---|---|
| Index | `/archives/` | `/archives/` |
| Year | `/archives/<YYYY>/` | `/archives/2026/` |
| Month | `/archives/<YYYY>/<MM>/` | `/archives/2026/01/` |
| Week | `/archives/<YYYY>/W<NN>/` | `/archives/2026/W23/` |

ISO 8601 weeks are used for the week drill-down, so dates near year boundaries (e.g. Dec 31 2024 → ISO 2025-W01) land in the correct week. The year shown for a week page is the **ISO week-numbering year**, not the calendar year of the underlying date.

## Date used to bucket a post

`publishedAt` is the source of truth. When missing (rare — predates the field, or the post was online before `publishedAt` was tracked), the plugin falls back to `updatedAt`, then `createdAt`. The same chain RSS and sitemaps use, so a post lands in the same period across all three plugins.

## Customising the look

The plugin renders archive HTML wrapped in the active theme's `BaseLayout`, with the inner content using these BEM-style classes:

```
.archives                 wrapper
.archives__header         page heading + subtitle
.archives__title
.archives__subtitle
.archives__back           "← All archives" / "← <year>" link
.archives__empty          empty-state message

.archives__years          <ul> of years on the index
.archives__year           one year on the index
.archives__year-heading
.archives__year-link
.archives__drilldown      <ul> of months/weeks under a year (drill-down on)
.archives__drilldown-item
.archives__drilldown-link
.archives__count          "(12)" after period names

.archives__list           <ul> of posts on a period page
.archives__item           single post entry
.archives__item-link
.archives__item-date

.archives__groups         year page split by month/week (drill-down on)
.archives__group
.archives__group-heading
.archives__group-link

.archives-link            the "See full archives →" link inserted on home/cat
```

The default theme ships baseline styles in `themes/default/theme.scss` (under `// Archives plugin styles`). Custom themes override or replace as needed — the markup stays the same, only CSS changes.

## Translations

Bundled translations cover all seven admin locales (`en`, `fr`, `de`, `es`, `nl`, `pt`, `ko`). The settings page is rendered in the admin's locale (via `useTranslation("flexweg-archives")`); the public-facing strings (page titles, "See full archives →", month names) are baked into HTML at publish time, resolved against the **public site language** (`settings.language`) via prefix match — so a site with `language: "fr-CA"` gets French archives pages.

For a locale outside the supported set, the plugin falls back to English on the public side. The `<html lang>` attribute keeps the original BCP-47 tag intact.

## Overriding the markup

The current implementation does not expose the archive templates as a hook surface — if you want a fundamentally different layout (e.g. a calendar grid instead of a list), the practical path is to fork `src/plugins/flexweg-archives/render.tsx` in your project. The data shape (`ArchivePeriod`, `Post[]`, `t` function for translations) is stable enough to swap the inner JSX without touching the generator.

## Disabling the plugin

Toggling the plugin off in **Plugins** stops:

- The lifecycle hooks (existing archive files stay where they are — they just no longer auto-update).
- The `addArchivesLinkToHome` / `addArchivesLinkToCategory` link injection on the next home / category re-publish.

To clean up the stale archive files after disabling, click **Force regenerate** once **before** disabling (it'll wipe and rebuild — leaving an up-to-date snapshot), or manually delete the `/archives/` folder on Flexweg via the dashboard.
