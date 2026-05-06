# Corporate theme

Modern corporate / SaaS showcase theme for Flexweg CMS — Tailwind-based,
Material 3 navy + indigo + sky-blue palette, single-font system
(Inter by default). Built for vitrine sites, lead-gen, and content
marketing.

## What's different from the magazine theme

- **Single sans font.** The DESIGN.md anchors Inter exclusively for a
  systematic SaaS aesthetic. The Style tab still lets admins swap to
  Manrope, IBM Plex Sans, Plus Jakarta, DM Sans, or Work Sans — all
  utilitarian sans options.
- **Lead-gen oriented.** The header carries a permanent `Get Started`
  CTA pointing at `/contact.html`. The block library leans heavily on
  composable marketing primitives (services, testimonials, stats,
  feature stacks, CTAs).
- **Static-page home.** Unlike magazine, corporate's home is intended
  to be a regular `page` whose body is composed of theme blocks
  (`hero-overlay` + `services-grid` + `testimonials` + `cta-banner`,
  in any order). Set `homeMode: "static-page"` in `/settings/general`
  and point the home at that page. A graceful fallback latest-posts
  grid still renders when no static page is configured.
- **Larger block library.** 10 blocks under the `corporate/`
  namespace (vs. magazine's 3) covering both marketing surfaces and
  the contact page composition.

## Block library

Layout / hero blocks:

- `corporate/hero-overlay` — full-width image with navy gradient
  overlay, eyebrow + headline + lede + 2 CTAs. Big home hero.
- `corporate/hero-split` — light text-left, decorative image-right.
  Internal page tops where the overlay variant feels too heavy.

Marketing primitives:

- `corporate/services-grid` — 3-card bento with one accent dark card
  in the middle. Repeatable services list with icon, title,
  description, CTA, accent toggle.
- `corporate/testimonials` — 3-col testimonials grid with star
  rating, quote, avatar, author + title. Two variants: `glass` (light
  surface) or `navy` (primary background).
- `corporate/trust-bar` — desaturated logos row anchored under the
  hero or contact form. Hover restores full color.
- `corporate/stats-grid` — large secondary-colored numerals over
  label-caps tags. 1 / 2 / 3 / 4-col layouts auto-select.
- `corporate/feature-stack` — alternating image+text rows for
  "How it works" / "Why us" sections. Per-row image-side override.
- `corporate/cta-banner` — final CTA banner. Two variants: `navy`
  (primary background with secondary glows) or `indigo` (solid
  secondary background).

Contact page composition:

- `corporate/contact-info` — three info rows (address / phone /
  email) plus optional socials strip. Card chrome handled internally.
- `corporate/contact-form` — full lead-gen form with floating-label
  fields. Two submit modes:
  - **Endpoint** (default) — POST a urlencoded body to a third-party
    form service (Formspree, Web3Forms, Getform, Basin). Success /
    error states managed by the runtime loader.
  - **Mailto** — opens the visitor's mail client with a preformatted
    `mailto:` URL. No backend dependency.

Every block carries an inspector with admin-controlled fields,
including labels, CTAs, optional consent line, and feedback messages
— so the same block ships in any locale without code changes.

## Build pipeline

Same as magazine: Tailwind compilation runs before Vite via
`scripts/build-theme-tailwind.mjs`. The local `tailwind.config.cjs`
scopes the content scan to this theme directory only and includes
`.js` (the runtime loaders contribute class names that wouldn't
otherwise be discoverable). The output is bundled into the manifest
as a string via Vite's `?inline` import.

For iterative theme development:

```bash
npx tailwindcss -c src/themes/corporate/tailwind.config.cjs \
  -i src/themes/corporate/theme.css \
  -o src/themes/corporate/theme.compiled.css \
  --watch
```

## Templates

- **`HomeTemplate`** — renders `staticPage.bodyHtml` directly when a
  static page is wired (the canonical path), or falls back to a
  3-col latest-posts grid.
- **`SingleTemplate`** — breadcrumb + h1 + author meta + 21:9 hero
  (16:9 mobile). Body uses `corporate-prose` typography. lg:8/4
  sidebar with author bio (runtime), popular articles (runtime),
  and a sticky CTA card pointing at `/contact.html`.
  Pages (`type === "page"`) skip the breadcrumb / sidebar so they
  can host free-form block compositions (e.g. the Contact page).
- **`CategoryTemplate`** — dark navy primary hero band with
  breadcrumb + h1 + description. 3-col card grid (aspect-video image
  with badge overlay), sticky sidebar listing every category.
- **`AuthorTemplate`** — surface-low header band with 192px square
  avatar, name + role badge, bio, social row, plus a stats card.
  2-col grid of articles below.
- **`NotFoundTemplate`** — minimal 404 with secondary CTA back home.

## Settings page

Reachable at `/theme-settings` when the corporate theme is active.
Stores everything under `settings.themeConfigs.corporate` in Firestore.

- **Logo** — upload a JPG/PNG/WebP logo (resized to 480×144 contain,
  saved as WebP at `theme-assets/corporate-logo.webp`). Toggles
  `logoEnabled` + `logoUpdatedAt`. Re-publishes `/data/menu.json` so
  the change reaches the public site without per-page republish.
- **Style** — pick a sans font (curated Google Fonts list) and
  override 18 Material 3 color tokens (surfaces, foreground, outlines,
  brand & accent). Save & apply uploads a regenerated CSS to
  `theme-assets/corporate.css`.

## Runtime helpers

`menu-loader.js` populates two menu hosts from `/data/menu.json`:
- the inline horizontal nav (visible md+, `data-cms-menu-inline`),
- the off-canvas burger overlay (every viewport, `[data-cms-menu]`).

`posts-loader.js` does four things:
- Populates the author bio sidebar card from `/data/authors.json`.
- Populates the popular articles sidebar card from `/data/posts.json`.
- Wires `[data-cms-share]` buttons (Web Share API + clipboard fallback).
- Wires `[data-cms-form]` contact forms (endpoint POST + mailto
  fallback + floating-label sync for autofill / back-button restore).

## Search

The header has a `[data-cms-search]` button (the burger overlay can
hide it via CSS when needed) and the BaseLayout renders a circular
search FAB at the bottom-right. The optional **flexweg-search**
plugin wires both at runtime when enabled. They render inert when
the plugin is off.

## Customization without touching this code

For most needs, the Settings page is sufficient. Edit colors / font /
logo from there; the regenerated CSS picks up your overrides on the
next page load.

To go further (custom layouts, new blocks, alternate typographic
rhythm), copy this directory to `src/themes/<your-id>/` and adapt:

1. Change `id`, `name`, `version` in `manifest.ts`.
2. Replace `theme.css` and `tailwind.config.cjs` with your own rules.
3. Edit / replace templates in `templates/`.
4. Add or remove blocks in `blocks/`.
5. Register the new manifest in `src/themes/index.ts`.

The build pipeline picks up new themes automatically.

## Recommended starter content

A blank install of this theme makes most sense with one each of:

- **Home page** (`type: "page"`, slug `home`) wired as
  `homeMode: "static-page"` in `/settings/general`. Compose with
  `hero-overlay` → `services-grid` → `testimonials` → `cta-banner`.
- **Contact page** (`type: "page"`, slug `contact`) composed with
  `hero-split` → `contact-info` + `contact-form` (in a 2-col layout
  using core columns block) → optional `trust-bar` underneath.
- **About page** (`type: "page"`, slug `about`) using `hero-split` +
  `feature-stack` + `stats-grid` + `cta-banner`.

The `Get Started` CTA in the header is hardcoded to `/contact.html`,
so the contact page should always exist at that path.
