# Examples — WordPress import fixture

A hand-crafted WordPress eXtended RSS (WXR) file that exercises every WordPress-specific path of the importer, plus a few of the shared paths (slug collision detection, author resolution, etc.).

## File

| File | What it tests |
|---|---|
| `sample-wp-export.xml` | A self-contained WXR with 5 posts, 2 pages, 3 attachments, hierarchical categories, multi-category demotion, status mapping, and ignored item types. |

## Running it

### Drag-and-drop mode (recommended for this fixture)

1. Enable **Flexweg Import** in `/admin/#/plugins`.
2. Open `/admin/#/settings/plugin/flexweg-import`.
3. Switch source to **Drag and drop**.
4. Drag `sample-wp-export.xml` (or the entire `examples-wordpress/` folder — the README is filtered out automatically) into the drop zone.
5. Click **Scan** → review the dry-run summary.
6. Click **Confirm import**.

### Folder mode

1. Click **Initialize import folder** (creates `_cms-import/` on Flexweg).
2. Upload `sample-wp-export.xml` to `_cms-import/`.
3. **Refresh listing** → **Scan** → **Confirm import**.

## Expected dry-run output

With the default settings (status mode = `Always import as draft`):

```
✓ 5 posts to create
✓ 2 pages to create
✓ 4 new categories (2 with parents)   ← News, Tech (under News), Sports (under News), Recipes
✓ 5 new tags                            ← migration, 2026, breaking, football, pasta
i 3 remote images to fetch + upload     ← cover-tech.jpg, cover-sports.jpg, cover-recipes.jpg
⚠ 2 warnings
```

The two warnings:
- **`pending` status** on "Submitted for review" → mapped to `draft`.
- **Multiple categories** on "World cup final — three takeaways" → keeps Sports as primary, demotes News to a tag.

## What gets created

### Categories (4)

```
News
├── Tech         ← parent: News
└── Sports       ← parent: News
Recipes          (top-level)
```

The hierarchy is preserved in `Term.parentId`. URLs stay flat — `/sports/world-cup-final-takeaways.html`, not `/news/sports/...` — by design (see plugin README).

### Tags (5)

`migration`, `2026`, `breaking`, `football`, `pasta` — plus `News` gets *re-added* as a tag on post 101 because it had two `<category domain="category">` entries.

### Posts (5)

| Title | Slug | Category | Status | Hero |
|---|---|---|---|---|
| Welcome to our new tech blog | `welcome-tech-blog` | Tech | draft (was: publish) | ✓ |
| World cup final — three takeaways | `world-cup-final-takeaways` | Sports | draft (was: publish) | ✓ |
| Pasta carbonara — the truth | `pasta-carbonara-truth` | Recipes | draft (was: publish) | ✓ |
| Working title — half-finished thoughts | `working-title-half-finished` | Tech | draft | — |
| Submitted for review | `submitted-for-review` | Tech | draft (was: pending, with warning) | — |

With status mode `Honor source status`, the three `publish` ones go online (full publish pipeline runs per item). The two drafts and the `pending` one stay draft.

### Pages (2)

- **About this site** — `about`, status `publish`
- **Contact** — `contact`, status `draft`

### Media (3)

Three images uploaded from `picsum.photos`. Each goes through the full multi-variant pipeline (admin thumbs + the active theme's image formats) and shows up in your media library.

If your network blocks `picsum.photos`, the dry-run still reports them as remote images to fetch, but the run-time fetch fails — posts get created without hero images, with a warning per failed fetch.

### Author resolution

The XML references three authors:

- `admin@example.com` — used by 4 items
- `jane@example.com` — used by 2 items
- `contributor@example.com` — used by 1 item

If none of those emails / display names match users in your site, the dry-run flags 3 author warnings and every post gets attributed to whoever clicked Import. To test the resolution path: create users with one of those emails before running the import.

### Ignored items (silent)

The XML includes one of each:
- `wp:post_type=auto-draft` (revision-y)
- `wp:post_type=nav_menu_item`
- `wp:post_type=wp_block` (Gutenberg reusable block)

These do **not** appear anywhere in the summary or warnings — the parser silently skips them, mirroring how WordPress sites typically have hundreds of these in any export.

## Resetting between runs

After an import, delete the created posts / pages / terms / media manually in the admin if you want to re-test. The importer is fire-and-forget — it doesn't track what it produced for rollback. Tip: filter posts by category (e.g. `Tech`) to bulk-delete the imported set without touching your real content.
