# Atlas Journal — demo content bundle

A self-contained set of 9 long-form travel essays + 2 static pages, written in English, designed for the **magazine** theme (editorial typography, long-form journalism layouts). Works in any theme that renders standard markdown — no theme-specific blocks used.

A ready-made skeleton for an independent slow-travel publication, or just for testing what the magazine theme looks like with real editorial content rather than placeholder text.

## What's in it

```
demo-content/atlas-journal/
├── README.md
├── images/                                       9 topic-matched hero photos
├── 01-welcome-to-atlas-journal.md               ↘  editorial intro
├── 02-winter-in-reykjavik.md                     │  destination essay
├── 03-yanaka-tokyos-old-heart.md                 │  neighborhood profile
├── 04-the-case-for-slow-travel.md                │  philosophy essay
├── 05-crossing-the-alps-by-train.md              │  journey piece     9 essays
├── 06-lisbon-at-dusk.md                          │  city portrait     (1500–
├── 07-week-in-italian-lakes.md                   │  region piece       2500
├── 08-patagonia-walking-the-edge.md              │  adventure essay   words)
├── 09-art-of-packing-light.md                   ↗  practical guide
├── page-about.md
└── page-contact.md
```

### Categories + tag set

| Category | Posts |
|---|---|
| **Destinations** | Reykjavík · Yanaka (Tokyo) · Lisbon · Italian Lakes |
| **Journeys** | Crossing the Alps by train · Patagonia |
| **Essays** | Welcome · The case for slow travel |
| **Guides** | The art of packing light |

Tags cover: `intro`, `editorial`, `iceland`, `winter`, `reykjavik`, `city`, `tokyo`, `japan`, `neighborhood`, `walking`, `essay`, `philosophy`, `slow-travel`, `train`, `alps`, `switzerland`, `journey`, `europe`, `lisbon`, `portugal`, `dusk`, `italy`, `lakes`, `como`, `shoulder-season`, `patagonia`, `argentina`, `hiking`, `wilderness`, `packing`, `minimal`, `travel`, `guide`, `carry-on`.

### Author

All posts signed by `marco@atlas-journal.example` (fictional). The about page contains a short bio (Marco Renaldi, Lisbon-based, started the publication in 2026 as a deliberate alternative to ad-funded travel writing).

## How to use

1. **Make sure the magazine theme is active** at `/admin/#/themes`
2. **Enable Flexweg Import** in `/admin/#/plugins`
3. Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
4. Drag the whole `atlas-journal/` folder (including `images/`) into the drop zone
5. Click **Scan** → 9 posts + 2 pages, 4 categories (Destinations / Journeys / Essays / Guides), ~33 tags, 9 images
6. Pick a status mode (recommended: **Always import as draft** so you can review before going live)
7. Click **Confirm import**
8. Review posts in `/admin/#/posts`, then bulk-publish when ready

## Images

The 9 images in `images/` are **actual travel photos** sourced from [Unsplash](https://unsplash.com/) under the [Unsplash License](https://unsplash.com/license) (free for commercial and non-commercial use, no attribution required). Each photo was hand-picked and verified to match its article's subject — a world map for the editorial welcome, Hallgrímskirkja over snow-covered Reykjavík for the Iceland piece, Fitz Roy at pink dawn for Patagonia, the iconic yellow tram for Lisbon, etc.

```
01-welcome-atlas.jpg         editorial intro (world map with travel pins)
02-reykjavik-winter.jpg      Reykjavík piece (aerial of city + Hallgrímskirkja in snow)
03-tokyo-yanaka.jpg          Yanaka piece (red paper lanterns at dusk)
04-slow-travel.jpg           slow travel essay (overgrown public footpath sign)
05-alps-train.jpg            Alps train journey (red train + snowy peaks)
06-lisbon.jpg                Lisbon piece (yellow tram, classic city street)
07-italian-lakes.jpg         Italian Lakes piece (Lake Como with boat + flowers)
08-patagonia.jpg             Patagonia piece (Fitz Roy massif at pink sunset)
09-packing-light.jpg         packing guide (two travel backpacks in profile)
```

To swap any image, drop a replacement at the same filename. Magazine theme favors landscape orientation; aim for 1600×1000 or wider. The bundled photos are 1600 px wide.

## A note on the content

The essays read like a real publication because that's what makes a useful demo. Marco Renaldi, the byline, is fictional, as is Atlas Journal as a brand. The factual content (the train route over the Gotthard, the temples in Yanaka, the Torres del Paine permit system, etc.) is broadly accurate as of writing but **has not been individually fact-checked for this demo**. If you intend to publish this content for a real audience, give each piece a fact-check pass first.

## Customising before import

Quick search-and-replace targets to make this content your own:

- Author email: `marco@atlas-journal.example` → your real CMS user email
- Publication name: `Atlas Journal` (appears in `page-about.md`, `page-contact.md`, and several posts)
- Publish dates: every post has a `publishedAt` in the frontmatter (currently April–May 2026). The importer respects these for the post's createdAt + publishedAt.
- Default status: every post ships as `status: draft`. Combined with "Honor source status" at import time, that lets you review one post at a time before going live.
