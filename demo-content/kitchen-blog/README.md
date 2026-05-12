# Kitchen Stories — demo content bundle

A self-contained set of 9 home-cooking blog posts + 2 static pages, written in English, ready to import via the **Flexweg Import** plugin into a Flexweg CMS site running the **default** theme (or any theme that renders standard markdown posts — no theme-specific blocks used).

Useful as a quickstart for testing the default theme end-to-end, or as a ready-made skeleton for a personal cooking blog.

## What's in it

```
demo-content/kitchen-blog/
├── README.md
├── images/                                       9 hero images, all topically matched
├── 01-welcome-kitchen-stories.md                ↘
├── 02-foolproof-roast-chicken.md                 │
├── 03-sourdough-starter-from-scratch.md          │
├── 04-five-knife-skills.md                       │
├── 05-weeknight-pasta.md                         │  9 recipes / technique posts
├── 06-salads-that-arent-sad.md                   │  (600–1000 words each)
├── 07-chocolate-cake-youll-remember.md           │
├── 08-soup-for-every-season.md                   │
├── 09-pizza-from-scratch.md                     ↗
├── page-about.md
└── page-contact.md
```

### Categories + tag set

| Category | Posts |
|---|---|
| **Recipes** | Roast chicken · Weeknight pasta · Salads · Soup for every season |
| **Techniques** | Sourdough starter · Five knife skills |
| **Baking** | Chocolate cake · Pizza from scratch |
| **Lifestyle** | Welcome (intro) |

Tags cover: `intro`, `lifestyle`, `chicken`, `roast`, `dinner`, `weekend`, `sourdough`, `bread`, `fermentation`, `baking`, `knife`, `technique`, `basics`, `beginner`, `pasta`, `italian`, `weeknight`, `quick`, `salad`, `lunch`, `vegetables`, `healthy`, `cake`, `chocolate`, `dessert`, `soup`, `comfort`, `pizza`, `dough`.

### Author

All posts are signed by `anna@kitchen-stories.example` (a fake email). The about page contains a short bio of the fictional author (Anna Bianchi, Milan-based, started the blog in 2024). Replace as needed.

## How to use

1. **Make sure the default theme is active** at `/admin/#/themes`
2. **Enable Flexweg Import** in `/admin/#/plugins`
3. Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
4. Drag the whole `kitchen-blog/` folder (including `images/`) into the drop zone
5. Click **Scan** → 9 posts + 2 pages, 4 categories (Recipes / Techniques / Baking / Lifestyle), ~29 tags, 9 images
6. Pick a status mode (recommended: **Always import as draft** so you can review before going live)
7. Click **Confirm import**
8. Review posts in `/admin/#/posts`, then bulk-publish when ready

## Images

The 9 images in `images/` are **actual cooking photos** sourced from [Unsplash](https://unsplash.com/) under the [Unsplash License](https://unsplash.com/license) (free for commercial and non-commercial use, no attribution required). Each photo was hand-picked to match its article's subject — a chocolate cake slice for the cake post, a chef knife with herbs for the knife skills post, etc.

```
01-welcome-kitchen.jpg       welcome post / about page (cooking in a home kitchen)
02-roast-chicken.jpg         roast chicken article (golden whole bird)
03-sourdough.jpg             sourdough starter article (sliced rustic loaf)
04-knife-skills.jpg          knife skills article (chef knife with herbs + veg)
05-pasta.jpg                 weeknight pasta article (penne in tomato sauce)
06-salad.jpg                 salads article (colorful grain bowls)
07-chocolate-cake.jpg        chocolate cake article (layered slice)
08-soup.jpg                  soup article (rustic tomato soup with veg)
09-pizza.jpg                 pizza article (margherita-style on wood)
```

If you'd rather use your own photography, drop in replacement files at the same filenames. The default theme handles landscape orientation best — aim for 1600×1000 or wider. The bundled photos are 1600 px wide.

## A note on the content

The posts read like a real personal cooking blog because that's what makes a good demo. The author "Anna Bianchi" is fictional, as is "Kitchen Stories". The recipes themselves are based on standard, broadly-tested home cooking methods — they should work as written, but **none of them have been tested in this exact form by the author of this README**. If you intend to publish this content for a real audience, give each recipe a kitchen pass first.

## Customising before import

Quick search-and-replace targets to make this content your own:

- Author email: `anna@kitchen-stories.example` → your real CMS user email
- Blog name: `Kitchen Stories` (appears in `page-about.md` and `page-contact.md`)
- Publish dates: every post has a `publishedAt` in the frontmatter (currently April–May 2026). The importer respects these for the post's createdAt + publishedAt.
- Default status: every post ships as `status: draft`. Combined with "Honor source status" at import time, that lets you review one post at a time before going live.
