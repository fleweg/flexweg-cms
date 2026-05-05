# Flexweg Search

A theme-agnostic search plugin for Flexweg CMS. Builds a static
`/search-index.json` over your published content and ships a tiny
runtime (`/search.js`) that opens a search modal anywhere a
`[data-cms-search]` trigger is present in your theme.

No backend, no dependencies, no third-party search service — pure
client-side substring matching against a static JSON.

## How it integrates with a theme

Themes expose a search trigger as plain HTML:

```html
<button type="button" data-cms-search aria-label="Search">…</button>
```

The plugin's runtime attaches click handlers to every such element on
`DOMContentLoaded` and opens its modal when the user clicks. Themes
don't need to know anything about the plugin's API.

If the plugin is disabled, the trigger stays inert (the runtime never
loads). The theme keeps a working button shape — just no behavior.

## What gets indexed

- **Title** — always.
- **Excerpt** — opt-in. When the post has no explicit excerpt, falls
  back to a 200-character plain-text rendering of the body.
- **Category name** — opt-in.
- **Tag names** — opt-in.

The body is **never** indexed in full — too heavy for client-side
fetch, and the title + excerpt path covers most search-by-title use
cases. If you need true full-text search, plug in an external service.

## Performance

- Index file is a single JSON, fetched **once** on the first modal
  open per page load and cached in memory.
- Token search runs in linear time (substring `indexOf`); fine up to
  a few thousand items.
- Title hits are weighted higher than excerpt / category / tag hits, so
  matching titles rise to the top.

## Lifecycle

The index is regenerated on every publish action that mutates the
corpus:

- `publish.complete` — a post just went online (or was edited).
- `post.unpublished` — a post moved back to draft.
- `post.deleted` — a post was removed entirely.

`/search.js` itself is uploaded once on first run, then again only
when its bundle hash changes (i.e. the admin was redeployed with a new
runtime). Subsequent publishes only rewrite the JSON.

A **Force regenerate** button in the settings page rebuilds and
re-uploads both files unconditionally — useful after switching
`settings.language` (the runtime UI strings come from there) or when
you suspect the public site is out of sync.

## Settings

- **Index** — toggles for excerpt / category / tags / static-pages
  inclusion + a checklist of categories to exclude.
- **Behavior** — minimum query length (default 2) and maximum results
  (default 20). These are baked into the index file's `meta` block, so
  a change requires a regeneration to take effect.

## Customizing the modal styles

The runtime injects its own minimal `<style>` block on first open
(`.cms-search-modal`, `.cms-search-panel`, `.cms-search-result`, …).
Themes override anything by writing rules with higher specificity, or
by wrapping their own rules in `:where()`.

## Files written to your site

- `/search-index.json` — the index. Re-uploaded on every corpus change.
- `/search.js` — the runtime. Re-uploaded only when its hash changes.

Both live at the site root. The plugin auto-injects
`<script src="/search.js" defer></script>` on every page through the
`page.body.end` hook, so themes never have to add the script tag
themselves.

## Limitations / known trade-offs

- **First-publish race window** — the page being published is uploaded
  before `/search.js`. A visitor opening the page during that brief
  window (typically <1s) gets a 404 on the script. Subsequent loads
  work fine.
- **No fuzzy match** — token-by-token substring only. Typos = no
  results. Acceptable for a CMS search; consider a hosted service if
  you need typo tolerance.
- **Single index per site** — no per-language splits. The runtime UI
  strings respect `settings.language`, but the index itself is one
  flat list; multilingual content sites should use one language per
  site for now.
