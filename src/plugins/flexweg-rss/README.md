# Flexweg RSS

Publishes RSS 2.0 feeds so readers can follow your site in any feed reader (Feedly, NetNewsWire, Inoreader, …).

## What it does

Generates and maintains:

- **A site-wide feed** at `/rss.xml` — every published post in reverse chronological order, capped at the most recent 50 entries.
- **Optional per-category feeds** at `/<category-slug>/<category-slug>.xml` — each contains only posts whose primary category matches.

Each feed is served alongside an XSL stylesheet so opening the URL in a browser shows a friendly preview rather than raw XML. Posts with a hero image get an `<enclosure>` element so feed readers display the artwork.

Item descriptions use the post's excerpt when set, otherwise an automatic plain-text summary truncated to ~300 characters.

The feeds re-publish only when an affected post changes — not on every publish action elsewhere on the site. A category feed only regenerates when one of its own posts is added/removed/edited.

## Settings

Reachable via **Plugins → Configure**.

- **Excluded categories** — pick categories whose posts shouldn't appear in the **site-wide** feed (they still appear in their own category feed). Useful for "drafts in public" or admin-only categories.
- **Per-category feeds** — pick which categories get their own feed. Each entry has an *Add to footer menu* checkbox: when enabled, the footer auto-grows a link to the feed (no MenusPage edit needed).
- **Force regenerate** — rebuilds every active feed from scratch. Run this after a bulk content reorganization or when a feed seems out of sync.

## Footer integration

Feeds with *Add to footer* checked appear at the end of the existing footer menu items. Each entry's label comes from the plugin (RSS for the site feed, "RSS — &lt;category&gt;" for category feeds). To use a custom label or a different position, leave the checkbox unchecked and add the URL by hand in **Menus** → Footer.

## Requirements

`Settings → Site → Public site URL` must be set — RSS feed URLs require an absolute origin. Empty base URL = silent no-op, same as the sitemap plugin.

## When to disable it

Disable if your site doesn't have a blog cadence (RSS only makes sense for chronologically updated content), or if you're publishing through a separate platform (Substack, Medium, …) that already provides feeds.
