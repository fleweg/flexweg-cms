# Flexweg Sitemaps

Generates and maintains XML sitemaps for search engine discovery. Also produces a customizable `robots.txt` so crawlers know what they can index.

## What it does

Every time a post or page is published, unpublished or deleted, the plugin **incrementally** regenerates only the sitemap files affected by the change — never the whole catalog. Output files (uploaded to your Flexweg site root):

- **`sitemap-<year>.xml`** — one per year, listing every published URL whose `createdAt` falls in that year.
- **`sitemap-index.xml`** — top-level index referencing every yearly sitemap. This is the URL you submit to Google Search Console.
- **`sitemap-news.xml`** — optional Google News sitemap, scoped to posts published in a configurable rolling window (default: last 2 days).
- **`robots.txt`** — editable text file pointing crawlers at the sitemap index.
- **`sitemap.xsl` / `sitemap-news.xsl`** — XSLT stylesheets that turn the raw XML into a styled HTML table when a human opens the URL directly. Invisible to crawlers.

When a yearly sitemap empties out (every post in that year gets deleted or unpublished), the file is removed from your Flexweg site so the index never points at a 404.

## Settings

Reachable via **Plugins → Configure** when the plugin is enabled.

- **Content scope** — choose between *Posts only* (default) or *Posts and pages*. Pages-as-content sites usually want both; blogs typically just posts.
- **News sitemap** — enable / disable. When enabled, set the rolling window (in days). A 2–3 day window matches Google News' own crawl horizon.
- **`robots.txt`** — free-form text editor with an *Insert default* button that generates a sensible starting point referencing your sitemap index.
- **Upload stylesheets** — manual button to push the XSL files. Run this once per site setup; the lifecycle hooks deliberately don't re-upload XSL on every publish to save bandwidth.
- **Force regenerate** — rebuilds every sitemap, the index and the robots.txt from scratch. Useful after a bulk content move, a base URL change, or when the auto-incremental state drifts.

## Requirements

The plugin needs `Settings → Site → Public site URL` to be set — sitemap entries require an absolute origin. With the field empty, the plugin no-ops silently rather than upload sitemaps with relative URLs.

## When to disable it

Disable if you maintain sitemaps externally (e.g. a separate static-site generator running alongside Flexweg) or if your site is private and you don't want it indexed. Disabling stops new generation but does **not** delete already-uploaded sitemap files — clean those up by hand on Flexweg if needed.
