---
title: Pasta carbonara — the real recipe
slug: pasta-carbonara
category: Recipes
tags: [easy, cooking, pasta]
heroImage: cover.png
excerpt: A no-cream, four-ingredient pasta carbonara with a story about why cream-loving versions miss the point.
---

# Pasta carbonara

![A wooden table with pasta ingredients laid out](photo.png)

The original recipe has four ingredients. **No cream. No mushrooms. No peas.**

## Ingredients

- 400 g spaghetti
- 200 g guanciale (or pancetta as a fallback)
- 4 large egg yolks + 1 whole egg
- 80 g Pecorino Romano, finely grated

That's it. Black pepper to finish.

## Image references in this file

This post references two images that should sit in the `images/` folder of the import bundle:

- `cover.png` — used as the hero image (`heroImage` frontmatter)
- `photo.png` — used inline via `![...](photo.png)` syntax

The importer:

1. Uploads each image through the standard media pipeline (multi-variant WebP + admin thumbs).
2. Maps `cover.png` → the new media doc's id, sets it as `heroMediaId`.
3. Rewrites the inline `![...](photo.png)` reference in the body to point at the new media's URL — no manual link fixing.

After import, the inline image's markdown will look something like:

```markdown
![A wooden table with pasta ingredients laid out](https://your-site.flexweg.com/media/2026/01/photo-abc123/medium.webp)
```

External `https://` URLs are left alone — only filenames matching files in the bundle get rewritten.
