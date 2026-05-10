---
title: Building static archives — a deep dive
slug: static-archives-deep-dive
category: Tech
parentCategory: News
tags: [breaking, migration]
excerpt: An exploration of why static-site archives outperform pagination for content-heavy blogs running on file-only hosting.
---

## Hierarchy via `parentCategory`

This file's frontmatter declares both a category (`Tech`) and a parent category (`News`). The importer treats this as: "create the term `News` if it doesn't exist, then create `Tech` with `parentId` pointing at `News`."

If `News` already exists in your site, the importer reuses the existing term and just attaches `Tech` underneath. No duplicates.

## What gets created

For this single import:

| Term | parentId |
|---|---|
| `News` (if new) | — |
| `Tech` (if new) | id of `News` |

The post itself uses `Tech` as its `primaryTermId`. Its public URL stays flat (`/tech/static-archives-deep-dive.html`), not hierarchical (`/news/tech/...`) — see the README's URL strategy section for why.

## Cycle detection

If you accidentally produce a cycle (Tech's parent is News, News's parent is Tech), the dry-run catches it and flattens the deeper one to top level with a warning. Test this by editing one of the import fixtures to create a loop and re-scanning.
