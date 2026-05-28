# Frenchies Blog — bilingual EN+FR demo content bundle

A self-contained set of 9 blog posts + 2 static pages about French bulldogs, available in **English and French**, ready to import via the **Flexweg Import** plugin into a Flexweg CMS site running the **default** theme (or any theme that renders standard markdown posts — no theme-specific blocks are used).

Bilingual format demonstrates how to ship a single bundle that auto-installs both languages when the **Flexweg Multi-language** plugin is enabled. Sites without the multilang plugin still import cleanly — the FR sidecars become opaque `Post.translations` data on each post (no UI impact, no public-side impact), and the `_terms.json` translation map is stored on each `Term` but never used.

## What's in it

```
demo-content/frenchies-blog/
├── README.md
├── _terms.json                                ← per-language category + tag translations
├── images/                                    9 hero images
│
├── 01-welcome-frenchies-files.md             ↘
├── 01-welcome-frenchies-files.fr.md           │
├── 02-feeding-your-french-bulldog.md          │
├── 02-feeding-your-french-bulldog.fr.md       │
├── 03-top-health-conditions.md                │
├── 03-top-health-conditions.fr.md             │  9 posts × 2 languages (EN primary + FR sidecar)
├── ...                                        │
├── 09-choosing-the-right-harness.md           │
├── 09-choosing-the-right-harness.fr.md       ↗
│
├── page-about.md                              ↘
├── page-about.fr.md                            │  2 static pages × 2 languages
├── page-contact.md                             │
└── page-contact.fr.md                         ↗
```

### Bilingual file convention

Every primary file (`<name>.md`) can have a sidecar (`<name>.<lang>.md`) carrying the same content in another language. The importer detects sidecars by filename pattern:

- `02-feeding-your-french-bulldog.md` → primary EN file (full frontmatter)
- `02-feeding-your-french-bulldog.fr.md` → FR translation (lightweight frontmatter)

The sidecar's frontmatter only needs:
- `title` — translated title
- `slug` — translated slug
- `excerpt` — translated excerpt (optional)
- `seoTitle` / `seoDescription` — translated SEO (optional)

Category, tags, hero image, author and publish date come from the primary file and apply to all languages. Each language gets its own slug; the multilang plugin pieces the URLs together as `/<lang>/<term-slug-translated>/<post-slug-translated>.html`.

### Term translations (`_terms.json`)

A single `_terms.json` at the bundle root carries category + tag translations:

```json
{
  "categories": {
    "Care":   { "fr": { "name": "Soins",       "slug": "soins" } },
    "Health": { "fr": { "name": "Santé",       "slug": "sante" } },
    "...":    { "...": "..." }
  },
  "tags": {
    "food":   { "fr": { "name": "alimentation", "slug": "alimentation" } },
    "...":    { "...": "..." }
  }
}
```

The importer applies these after creating each term. Only terms actually referenced by an imported post get created; unused entries in `_terms.json` produce a non-blocking warning.

### Categories + tag set

| Category (EN) | Category (FR) | Posts |
|---|---|---|
| **Care** | Soins | Feeding · Exercise · Summer heat · Harness guide |
| **Health** | Santé | Top health conditions · Snoring |
| **Training** | Dressage | Crate training |
| **Lifestyle** | Mode de vie | Welcome (intro) · Best toys |

Tags cover (EN / FR): `intro` · `lifestyle`/`mode de vie` · `food`/`alimentation` · `nutrition` · `adult`/`adulte` · `puppy`/`chiot` · `health`/`santé` · `vet`/`vétérinaire` · `boas` · `allergies` · `exercise`/`exercice` · `walks`/`balades` · `training`/`dressage` · `crate`/`caisse` · `toys`/`jouets` · `play`/`jeu` · `chew`/`mastication` · `summer`/`été` · `heat`/`chaleur` · `safety`/`sécurité` · `snoring`/`ronflement` · `sleep`/`sommeil` · `harness`/`harnais` · `gear`/`équipement`

### Author

All posts are signed by `sophie@frenchies-blog.example` (a fake email). The about page contains a short bio of the fictional author in both languages. Replace as needed.

## How to use

### Option 1 — Bilingual site with the multilang plugin (recommended)

1. **Make sure the default theme is active** at `/admin/#/themes`
2. **Install + enable Flexweg Multi-language** at `/admin/#/plugins`
3. Open `/admin/#/settings/plugin/flexweg-multilang` → set the primary language to `en`, enable `fr`
4. **Enable Flexweg Import** in `/admin/#/plugins`
5. Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
6. Drag the whole `frenchies-blog/` folder (including `images/` AND `_terms.json`) into the drop zone
7. Click **Scan** → 9 posts + 2 pages with FR translations, 4 categories with FR slugs/names, ~24 tags, 9 images
8. Pick a status mode (recommended: **Always import as draft** so you can review before going live)
9. Click **Confirm import**
10. Review posts in `/admin/#/posts`. The **Translations** tab in the editor's right inspector shows the FR variant of each post.
11. Bulk-publish when ready. The publisher writes `/news/<slug>.html` AND `/fr/actualites/<slug>.html` (etc.) in one pass.

### Option 2 — English-only site without the multilang plugin

Identical to Option 1 minus steps 2 and 3. The `_terms.json` and `.fr.md` sidecars are imported silently as opaque data — they don't appear in the public site, they don't pollute the UI. Install the multilang plugin later and the FR content "lights up" without re-importing.

## Images

The 9 images in `images/` are **actual French bulldog photos** sourced from [Unsplash](https://unsplash.com/s/photos/french-bulldog) under the [Unsplash License](https://unsplash.com/license) (free for commercial and non-commercial use, no attribution required). Each photo was picked to roughly suit its post topic — a puppy with a green ball for the toys article, a chocolate frenchie on a rock for the exercise article, etc. — though the matching isn't perfect.

```
01-frenchie-portrait.jpg     welcome post / about page (alert brindle in a garden)
02-feeding-bowl.jpg          feeding article (fawn studio portrait)
03-vet-checkup.jpg           health conditions article (pied looking up)
04-frenchie-walk.jpg         exercise article (chocolate frenchie outdoors on a rock)
05-crate-training.jpg        crate training article (puppy in yellow hoodie)
06-toys.jpg                  toys article (puppy playing with green ball)
07-summer-heat.jpg           summer safety article (brindle puppy indoor portrait)
08-sleeping.jpg              snoring article (relaxed adult on a white rug)
09-harness.jpg               harness article (puppy walking on grass)
```

Images are shared across both languages — the same `heroImage` is used for the EN and FR variant of each post.

If you'd rather use different photography, replace any file with one of your own at the same filename. Free sources:

- [Unsplash](https://unsplash.com/s/photos/french-bulldog) — Unsplash License (free for any use)
- [Pexels](https://www.pexels.com/search/french%20bulldog/) — Pexels License (free for commercial use, no attribution)
- [Pixabay](https://pixabay.com/images/search/french%20bulldog/) — Pixabay Content License (free for any use)

Aim for landscape orientation (1600×1000 or wider) for best results on the default theme's hero crops. The bundled photos are 1600 px wide.

## A note on the content

The posts read like a real personal blog because that's what makes a good demo. The author "Sophie Martin", her dogs "Olive" and "Pépin", and all anecdotes are fictional. The general factual content (BOAS, BoasGrading, IVDD risks, feeding ranges) is broadly accurate as of the writing date but **is not veterinary advice** — replace, vet, or remove before going live if you intend to publish this content for a real audience.

The French translations aim to read naturally rather than being literal, with localised conversions (pounds → kg, Fahrenheit → Celsius) and France-specific rescue resources. Re-check for your target audience before going live.

## Customising before import

The fastest way to make this content your own:

- **Swap the author email** — find/replace `sophie@frenchies-blog.example` across the bundle and replace with a real account from your CMS users (only the primary `.md` files declare the author; sidecars inherit it)
- **Swap the blog name** — find/replace `The Frenchies Files` in `page-about.md` and `page-contact.md` AND their `.fr.md` sidecars
- **Adjust the publish dates** — every primary post has a `publishedAt` in the frontmatter (currently April–May 2026). The importer respects these for the post's `createdAt` + `publishedAt` fields. Sidecars don't carry dates — they inherit from the primary.
- **Pick your status mode** at import time. "Always import as draft" lets you review one post at a time. "Honor source status" honors the `status:` frontmatter (every post here is `draft`).

## Adding more languages

To add a third language (e.g. Spanish):

1. Create `<name>.es.md` sidecars next to each primary file with `title`, `slug`, `excerpt` and translated body
2. Add an `es` entry per category and tag in `_terms.json`
3. Enable `es` in the multilang plugin settings before importing
4. The importer + publisher do the rest

No other configuration needed.
