# Frenchies Blog — demo content bundle

A self-contained set of 9 blog posts + 2 static pages about French bulldogs, written in English, ready to import via the **Flexweg Import** plugin into a Flexweg CMS site running the **default** theme (or any theme that renders standard markdown posts — no theme-specific blocks are used).

Useful as a quickstart for testing the default theme end-to-end, or as a starting skeleton for any personal / hobby blog.

## What's in it

```
demo-content/frenchies-blog/
├── README.md
├── images/                                 9 hero images (placeholders, see below)
├── 01-welcome-frenchies-files.md          ↘
├── 02-feeding-your-french-bulldog.md       │
├── 03-top-health-conditions.md             │
├── 04-how-much-exercise.md                 │
├── 05-crate-training-frenchie-puppy.md     │  9 blog posts (~400–700 words each)
├── 06-best-toys-for-frenchies.md           │
├── 07-summer-heat-and-your-frenchie.md     │
├── 08-why-frenchies-snore.md               │
├── 09-choosing-the-right-harness.md       ↗
├── page-about.md
└── page-contact.md
```

### Categories + tag set

| Category | Posts |
|---|---|
| **Care** | Feeding · Exercise · Summer heat · Harness guide |
| **Health** | Top health conditions · Snoring |
| **Training** | Crate training |
| **Lifestyle** | Welcome (intro) · Best toys |

Tags cover: `intro`, `lifestyle`, `food`, `nutrition`, `adult`, `puppy`, `health`, `vet`, `boas`, `allergies`, `exercise`, `walks`, `training`, `crate`, `toys`, `play`, `chew`, `summer`, `heat`, `safety`, `snoring`, `sleep`, `harness`, `gear`.

### Author

All posts are signed by `sophie@frenchies-blog.example` (a fake email). The about page contains a short bio of the fictional author. Replace as needed.

## How to use

1. **Make sure the default theme is active** at `/admin/#/themes`
2. **Enable Flexweg Import** in `/admin/#/plugins`
3. Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
4. Drag the whole `frenchies-blog/` folder (including `images/`) into the drop zone
5. Click **Scan** → 9 posts + 2 pages, 4 categories (Care / Health / Training / Lifestyle), ~24 tags, 9 images
6. Pick a status mode (recommended: **Always import as draft** so you can review before going live)
7. Click **Confirm import**
8. Review posts in `/admin/#/posts`, then bulk-publish when ready

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

If you'd rather use different photography, replace any file with one of your own at the same filename. Free sources:

- [Unsplash](https://unsplash.com/s/photos/french-bulldog) — Unsplash License (free for any use)
- [Pexels](https://www.pexels.com/search/french%20bulldog/) — Pexels License (free for commercial use, no attribution)
- [Pixabay](https://pixabay.com/images/search/french%20bulldog/) — Pixabay Content License (free for any use)

Aim for landscape orientation (1600×1000 or wider) for best results on the default theme's hero crops. The bundled photos are 1600 px wide.

## A note on the content

The posts read like a real personal blog because that's what makes a good demo. The author "Sophie Martin", her dogs "Olive" and "Pépin", and all anecdotes are fictional. The general factual content (BOAS, BoasGrading, IVDD risks, feeding ranges) is broadly accurate as of the writing date but **is not veterinary advice** — replace, vet, or remove before going live if you intend to publish this content for a real audience.

## Customising before import

The fastest way to make this content your own:

- **Swap the author email** — find/replace `sophie@frenchies-blog.example` across the bundle and replace with a real account from your CMS users
- **Swap the blog name** — find/replace `The Frenchies Files` in `page-about.md` and `page-contact.md`
- **Adjust the publish dates** — every post has a `publishedAt` in the frontmatter (currently April–May 2026). The importer respects these for the post's createdAt + publishedAt fields.
- **Pick your status mode** at import time. "Always import as draft" lets you review one post at a time. "Honor source status" honors the `status:` frontmatter (every post here is `draft`).
