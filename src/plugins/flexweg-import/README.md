# Flexweg Import

Bulk-imports posts and pages into Flexweg CMS from two source formats:

- **Markdown** files with YAML frontmatter (Hugo, Eleventy, Astro, Jekyll, custom scripts)
- **WordPress** XML exports (Tools → Export → All content)

It auto-creates missing categories and tags (with hierarchy preserved), uploads referenced images through the standard media pipeline (multi-variant WebP), rewrites image URLs in the markdown body, and resolves authors against existing CMS users when emails match.

## Two ways to feed files in

### Folder on Flexweg (`_cms-import/`)

1. Click **Initialize import folder** in the plugin settings — creates `_cms-import/` on your Flexweg site with a small README.
2. Upload your files there via the Flexweg dashboard or the API:
   - `_cms-import/post-1.md`
   - `_cms-import/wp-export.xml`
   - `_cms-import/images/cover.jpg`
   - `_cms-import/images/photo.png`
3. Back in the plugin settings, click **Refresh listing** then **Scan**.

After a successful import, processed files are archived to `_cms-import/processed-<timestamp>/` (toggleable). Re-running the import won't re-process the same files unless you move them back.

### Drag-and-drop in the admin

Switch the **Source** radio to **Drag and drop**. Files dropped into the zone (or picked via the file dialog) live in browser memory only — nothing is uploaded to Flexweg until you click **Confirm import**. Folders are walked recursively where the browser supports the File System Access API (Chrome / Edge / Firefox / Safari ≥ 18).

This mode skips the `processed-<timestamp>/` archive step (the source files are already on your disk).

## Markdown frontmatter spec

```markdown
---
title: My first article            # required
slug: my-first-article             # optional — derived from title via slugify if absent
type: post                          # post (default) | page
status: draft                       # draft (default) | online — honored only when status mode = "from source"
publishedAt: 2026-01-15             # ISO date or datetime; current time if absent
excerpt: One-line summary
category: News                      # category name (created if missing)
parentCategory: World               # optional — creates "World > News" hierarchy
tags: [breaking, headline]          # auto-created if missing
author: jane@example.com            # matches by email or display name; falls back to importer
heroImage: cover.jpg                # filename in the images bundle
seoTitle: Custom SEO title          # optional
seoDescription: Custom description  # optional
---

# Body markdown

Paragraphs work normally. **Bold**, *italic*, [links](https://example.com).

Inline images: ![Alt text](photo.jpg)
Filenames matching files in the images bundle get rewritten to the new
media URLs. External `https://` URLs stay as-is.
```

### Frontmatter rules

- Strings can be unquoted, single-quoted or double-quoted.
- Booleans: `true` / `false`.
- Arrays: inline `[a, b, c]` or YAML block form on subsequent lines:
  ```yaml
  tags:
    - first
    - second
  ```
- Comments (`#`) outside quoted strings are stripped.
- No support for nested objects, anchors, aliases. The format covers exactly what blog exports use; pulling in a full YAML library (~200 KB gzipped) would dwarf the plugin.

## WordPress import behaviour

The plugin parses the export's XML directly via the browser's native `DOMParser` — no upload of the file to a server.

### What's imported

- **Posts and pages** with their HTML bodies (converted to Markdown via [turndown](https://github.com/mixmark-io/turndown))
- **Categories and tags** with their hierarchy (`<wp:category_parent>` → `Term.parentId`)
- **Attachments** referenced by `_thumbnail_id` (hero images) or inline `<img>` tags
- **Authors** (`<dc:creator>`) — matched against existing CMS users by email or display name
- **Publication dates** (`<wp:post_date_gmt>` preferred, fallback `<wp:post_date>`)
- **Original URL** (`<link>`) stored on `Post.legacyUrl` for future redirect generators

### Mapping rules

| WordPress | Flexweg CMS | Notes |
|---|---|---|
| `<wp:post_type>post</wp:post_type>` | `Post.type = "post"` | |
| `<wp:post_type>page</wp:post_type>` | `Post.type = "page"` | |
| `<wp:post_type>attachment</wp:post_type>` | `Media` doc | URL fetched + processed through media pipeline |
| `<wp:status>publish</wp:status>` | `status: "online"` | Subject to import status mode |
| `<wp:status>draft\|pending\|private\|trash</wp:status>` | `status: "draft"` | With warning |
| First `<category domain="category">` | `Post.primaryTermId` | |
| Additional `<category domain="category">` | `Post.termIds` (as tags) | With warning — Flexweg model is 1 primary + N tags |
| `<category domain="post_tag">` | `Post.termIds` | |
| `<wp:postmeta>` `_thumbnail_id` | `Post.heroMediaId` | Resolved against attachment list |
| `<dc:creator>` | `Post.authorId` | Match by email / display name; fallback to importer |
| `<link>` | `Post.legacyUrl` | Preserved as opaque metadata |
| `<wp:post_date_gmt>` | `Post.publishedAt` | UTC; falls back to `<wp:post_date>` |

### What's lossy

- **Gutenberg blocks**: complex blocks (group, columns, navigation, query loops, …) become HTML in the markdown body. They render correctly when published — DOMPurify keeps the HTML intact at publish time — but the editor sees them as opaque blocks.
- **Shortcodes**: `[caption]`, `[gallery]`, `[embed]`, custom plugin shortcodes are preserved verbatim. They render as plain text on the public site unless you handle them post-import.
- **Comments**: ignored — Flexweg CMS has no comments.
- **Custom post types** (`wp_block`, `wp_template`, `nav_menu_item`, `oembed_cache`): ignored.
- **Custom fields** (postmeta beyond `_thumbnail_id`): ignored.

### Source site must stay online

WordPress XML exports include image URLs but not the image bytes themselves. The importer fetches each `<wp:attachment_url>` over HTTP to ingest it. **Keep the source WordPress site online during the import.** Failed fetches are listed as warnings — the post is created without the affected images, and you can manually attach them later through the media library.

## Status modes

| Mode | What it does |
|---|---|
| **Always import as draft** (default) | Every imported entry is created as `draft`, regardless of source status. Safer for review-before-publish workflows. |
| **Honor source status** | Markdown's `status:` and WordPress's `<wp:status>publish</wp:status>` mark the entry online; everything else is draft. Online entries go through the full publish pipeline (renders HTML, uploads to Flexweg, regenerates listings). |
| **Always publish** | Forces every imported entry to be published immediately. Heaviest mode — runs the full publish pipeline per entry. Use for migrations where the goal is "old site goes dark, new site goes live in one step". |

## Slug collisions

A slug already taken (by an existing post / page or by an earlier entry in the same batch) gets suffixed: `foo` → `foo-2` → `foo-3`. The dry-run summary lists the rewrites so the user knows what URLs to expect. If you want to keep the exact original slugs, deal with collisions upstream before importing.

## Image deduplication

Before uploading, each image is matched against existing `media/` docs by **filename + size** (within 1 KB). A match means the importer reuses the existing media doc — no double upload. This makes re-imports of the same set of files quick and cheap.

## Hierarchy

Categories support `Term.parentId` natively. The dry-run shows the new hierarchy that will be created (e.g. "5 categories with parents"). Cycles in the source data — rare but possible if you've hand-edited a WP export — are detected and the offending category is flattened to top level with a warning.

URLs are NOT hierarchical: a post in `Sports` (whose parent is `News`) lives at `/sports/post-slug.html`, not `/news/sports/post-slug.html`. Switching to hierarchical URLs is a separate decision (touches `core/slug.ts`) — not done here to keep imported URLs predictable.

## Defaults

The settings page persists these for next time:

- **Status mode** (default: `Always import as draft`)
- **Default category** — used when an entry has no category. Empty (default) means the entry is created without a category.
- **Move processed files** (default: on, folder mode only)
- **Image fetch concurrency** (default: 4) — caps the parallel fetches against a remote WordPress site to avoid rate-limiting

## Edge cases

- **Empty markdown body**: imported as a post with no content. Title-only posts work, just look weird.
- **Frontmatter without title**: blocked at scan time (error, not warning).
- **Multiple categories on a WP post**: first one becomes the primary, the rest are demoted to tags. Documented in the warning list.
- **Attachment URL on a private host**: the importer's `fetch` will fail with a CORS or auth error. Whitelist your origin or pre-mirror the images publicly before importing.
- **`<wp:status>auto-draft</wp:status>` and `inherit`**: ignored as drafts (these are revisions and unpublished placeholders).
- **Filename clash inside `images/`**: the bundle uses the filename as the lookup key, so two files with the same name shadow each other. Rename upstream.

## Activation

The plugin is **disabled by default**. Enable it in **Plugins** when you're about to migrate a site, then disable again afterward — the lifecycle is one-shot, not ongoing.

When disabled, the settings page is unreachable but `_cms-import/` and any imported posts stay where they are.

## Limitations & out of scope (phase 1)

- **No backup / round-trip**: this is import-only. Exporting Flexweg content back to markdown is a separate plugin.
- **No `_redirects` generation** from `legacyUrl`: the data is stored, but turning it into Flexweg redirects is phase 2.
- **No streaming XML parser**: very large WordPress exports (>100 MB) tie up browser memory. If your export is that big, split it via the WP "Export Media Library" plugin or by date ranges.
- **No drag-drop progress**: large drops (hundreds of files) take a moment to enumerate. Browser may appear frozen — wait it out.
- **No multi-language content**: each entry is one language. Multi-locale content remains the next-major-version conversation.
- **WordPress.com sites**: exports work, but media URLs may need OAuth depending on the privacy setting. Make the source site public before importing.
