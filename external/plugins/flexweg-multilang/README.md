# flexweg-multilang

Multi-language support for Flexweg CMS — translated posts/pages/terms, hreflang SEO, per-language sitemap entries, per-language RSS feeds.

## What it does

- **Translations editor**: adds a **Translations** tab in the post / page editor's right-side Inspector. Each enabled language gets its own slug + title + Markdown content + excerpt + SEO fields.
- **Term translations**: an expandable row in the Categories / Tags page exposes per-language `name` + `slug` for each term.
- **URL strategy**: the primary language lives at the site root (`site.com/news/hello.html`). Every other enabled language lives under its own prefix (`site.com/fr/actualites/bonjour.html`).
- **SEO**: emits the full `<link rel="canonical">`, `<link rel="alternate" hreflang="">` (one per language plus `x-default`), `<meta property="og:locale">` and `<meta property="og:locale:alternate">` set on every published page — Google international SEO best practices.
- **Sitemap**: augments `flexweg-sitemaps`'s output with `<xhtml:link rel="alternate" hreflang="">` entries inside each `<url>` element AND adds the translated URLs themselves to the yearly sitemaps. Adds per-language news sitemap references to `sitemap-index.xml`.
- **RSS**: generates one `/<lang>/feed.xml` per enabled language plus per-category feeds at `/<lang>/<slug>/<slug>.xml`.
- **`<html lang>`** set per page server-side via the new `BaseLayoutProps.currentLocale` (no JS hack).

## Requirements

- Flexweg CMS admin built from `apiVersion >= 1.2.0`. The plugin uses the inspector-tab + term-editor-section APIs and the publisher's `publish.additional` filter, all introduced in 1.2.

## Installation

1. `npm install --legacy-peer-deps`
2. `npm run build` — produces `dist/bundle.js` + `flexweg-multilang.zip`
3. In the admin, **Plugins** → **Install plugin** → drag the ZIP.
4. Open **Plugins → Multi-language → Settings** and pick the primary language + enabled secondaries.
5. Edit a post → **Translations** tab in the right inspector → fill the translation for each language and Save.

## Workflow

1. Edit the post in the primary language using the standard editor (title, slug, content, SEO).
2. Open the **Translations** tab on the right.
3. Switch language tab → fill title, slug, content, excerpt, SEO. Optionally click **Duplicate from primary** as a starting point.
4. Click **Save translations**. Translations live on `Post.translations` in the database.
5. Click **Publish**. The publisher renders the primary version + every translation in one pass. Each is uploaded to its own path.

## Storage

- Per-post translations live on `Post.translations` (JSON / Firestore Map column) keyed by language code.
- Per-term translations live on `Term.translations` (same shape, keyed by language).
- Plugin config (enabled languages, primary, per-language home page) lives in `settings.pluginConfigs["flexweg-multilang"]`.

All storage flows through the standard backend dispatcher — works identically on the Firebase and Flexweg-SQLite backends.

## Theme compatibility

The plugin renders translated pages through the **active theme exactly as the primary publisher would** — same templates, same BaseLayout, same CSS. No theme changes required for content + SEO to work.

For a visual **language switcher**, themes can opt in by:

1. Putting a `<div data-cms-langswitch></div>` somewhere in their `Header` template.
2. The runtime script `lang-switcher.js` (loaded via `page.body.end`, future enhancement) will populate it with anchor tags pointing at the current page's alternates.

Themes that don't add the container still get URL prefixes, hreflang, sitemap entries and RSS feeds; only the visual switcher is missing.

## Known limitations

- Theme-specific rich homes (e.g. magazine's hero/sidebar widgets) are not replicated in non-primary languages. Configure a **static page** as the home per language for full control.
- Markdown editor blocks (Hero, embeds, etc.) embedded in the primary content are NOT auto-replicated in translations — paste your translated Markdown in the Translations tab manually.
- Concurrent edits to a single post's translations follow last-write-wins (one Firestore document / one SQLite row).
