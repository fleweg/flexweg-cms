---
title: Multi-tag post with author resolution
slug: tags-and-author-demo
category: Sports
tags:
  - football
  - world-cup
  - 2026
  - breaking
author: jane@example.com
---

## Block-form arrays

Notice the YAML block syntax for tags above:

```yaml
tags:
  - football
  - world-cup
  - 2026
  - breaking
```

Both inline (`tags: [a, b, c]`) and block syntax work — pick whichever you find more readable. Mixing them in the same file is fine too.

## Author resolution

The `author: jane@example.com` line tells the importer to attribute this post to a user whose email matches. Lookup order:

1. Match by **email** (case-insensitive).
2. Match by **display name** (case-insensitive).
3. Fall back to the importer (whoever clicked Confirm).

If nobody matches `jane@example.com` in your `users` collection, the dry-run flags it as a warning and the post lands under your own user. **Add a Jane Doe user with email `jane@example.com` before importing if you want a clean test.**

## Tag auto-creation

All four tags above get created on the first import. Re-running the import (after a wipe) reuses the existing tag terms — no duplicates.

The post ends up with `primaryTermId` = id of `Sports` and `termIds` = `[id-of-sports, id-of-football, id-of-world-cup, id-of-2026, id-of-breaking]`.
