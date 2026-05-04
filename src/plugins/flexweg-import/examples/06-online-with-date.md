---
title: Pre-published — backdated content
slug: backdated-launch-recap
status: online
publishedAt: 2025-12-20T14:30:00Z
category: News
tags: [2026, intro]
excerpt: A post that should land already published with a December 2025 date — useful for migrations where you want the original publication timeline preserved.
---

## Status mode interaction

This file has `status: online` in its frontmatter. Whether the import respects that depends on the **Status mode** setting:

| Status mode | Result |
|---|---|
| **Always import as draft** (default) | Created as draft, the `online` status is ignored. |
| **Honor source status** | Created as draft, then immediately published — runs the full publish pipeline (renders HTML, uploads to Flexweg, regenerates listings). |
| **Always publish** | Same as "Honor source status" for this file. Other files (with `status: draft` or no status) also get published. |

## `publishedAt` use

The ISO-8601 datetime above is preserved on `Post.publishedAt`. The CMS uses this for:

- Sort order in chronological listings (home, category archives, archives plugin)
- The `<time datetime="...">` element in single-post layouts
- RSS / sitemap timestamps
- The "year / month / week" bucket in the archives plugin

So this post would land in the **December 2025** bucket (and ISO week 51) of the archives, not whatever date you happen to run the import.

## Body

Put your actual content here — this fixture exists for the date and status, not the prose.
