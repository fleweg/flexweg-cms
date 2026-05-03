# Core SEO

Adds the basic SEO meta tags every published page needs to look right when shared on social platforms and identified by crawlers.

## What it does

Injects the following into every page's `<head>` at publish time:

- **Twitter Card** meta tags — large summary card with image when the post has a hero, plain summary card otherwise.
- **`<meta name="generator">`** — identifies pages as built with Flexweg CMS. Helpful for analytics; harmless for SEO.

The page's primary `<title>`, `<meta name="description">`, Open Graph tags and canonical URL are emitted by the active theme's BaseLayout — Core SEO complements them, it doesn't replace them.

## Configuration

None. The plugin is intentionally zero-config. Per-post SEO overrides (title, description, OG image) live on the post itself in the editor's **Document** sidebar — they propagate to both the theme's tags and the Core SEO tags automatically.

## When to disable it

Disable Core SEO if your theme already emits Twitter Card tags itself, or if you want to handle social meta entirely through a different plugin (e.g. a future Yoast-style SEO plugin). Disabling has no impact on the rest of the publish pipeline — page titles, descriptions and Open Graph tags survive because they come from the theme.
