# Portfolio archive — example import bundle

A 6-project / 3-page fixture for testing the **Portfolio** theme. Each project ships with a full body composed of the four portfolio blocks (project-meta, bento-gallery, storytelling, next-project) so the theme exercises its full stack.

## Contents

```
portfolio-archive/
├── README.md
├── images/                            8 Pexels photos, ~1 MB total
│   ├── 01-monolith.jpg
│   └── ...
├── 01-monolith-no-1.md … 06-ghost-pillar.md   6 projects
├── page-about.md                      Studio bio
├── page-journal.md                    Journal landing
└── page-contact.md                    Contact info
```

## 6 projects across 6 categories

| Slug | Category |
|---|---|
| `monolith-no-1` | Architecture |
| `urban-symmetry` | Architecture |
| `void-house` | Interior |
| `retreat-a2` | Landscape |
| `white-space` | Exhibition |
| `ghost-pillar` | Installation |

Each project's body contains:
- **bento-gallery** — 4-image bento grid (1 main, 2 sub, 1 wide)
- **storytelling** — quote-driven section with 2 numbered process steps
- **project-meta** — SERVICES / YEAR / CLIENT 3-up grid
- **next-project** — full-width hover-invert teaser to the next slug

The blocks decode at publish time via the `post.html.body` filter (transforms.ts in the theme).

## Running the import

1. Activate the **Portfolio** theme in `/admin/#/themes`
2. Enable **Flexweg Import** in `/admin/#/plugins`
3. `/admin/#/settings/plugin/flexweg-import` → mode **Drag and drop**
4. Drop the entire `portfolio-archive/` folder (with `images/`)
5. **Scan** → 6 posts + 3 pages, 6 categories, ~12 tags, 8 images
6. **Confirm import** — posts created as drafts

Once imported, bulk-publish the projects from the posts list and wire menu entries in `/admin/#/menus` (suggested: WORK → `/`, ABOUT → `/about.html`, JOURNAL → `/journal.html`, CONTACT → `/contact.html`).

## Image credits

All 8 images from [Pexels](https://www.pexels.com/) under the [Pexels License](https://www.pexels.com/license/) — free for commercial use, no attribution required.
