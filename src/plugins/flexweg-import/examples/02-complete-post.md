---
title: Every frontmatter field at once
slug: full-frontmatter-demo
type: post
status: draft
publishedAt: 2026-01-10
excerpt: A demo post that exercises every supported frontmatter key — useful for sanity-checking how the importer maps each field onto the CMS schema.
category: News
tags: [welcome, intro, demo]
author: editor@example.com
seoTitle: All frontmatter fields demo — Flexweg Import
seoDescription: A reference post showing how every supported frontmatter key flows through the import pipeline.
---

## What this post demonstrates

Each frontmatter key above maps to a specific Post field:

- **title** → `Post.title` (required)
- **slug** → `Post.slug` (suffixed `-2`, `-3` if it collides with an existing post)
- **type** → `Post.type` (`post` or `page`)
- **status** → `Post.status` (subject to the import status mode)
- **publishedAt** → `Post.publishedAt` (used when the post goes online)
- **excerpt** → `Post.excerpt`
- **category** → resolved against `Term.name`; auto-created if missing
- **tags** → array of tags; auto-created
- **author** → matched against `users` by email or display name; falls back to importer
- **seoTitle / seoDescription** → `Post.seo`

## Body content

This body is written in standard CommonMark. The importer doesn't transform it — it lands in `Post.contentMarkdown` verbatim. Headings, **bold**, *italic*, `inline code`, [links](https://example.com), and code blocks all round-trip cleanly.

```ts
// fenced code blocks are preserved
function hello(name: string): string {
  return `Hello, ${name}`;
}
```

> Block quotes work too. The default theme renders them as the lede of the article when used immediately after the H1.
