# Magazine theme

Editorial magazine theme for Flexweg CMS — Tailwind-based, with an
editable Material 3 palette and a sober editorial type system
(Newsreader serif + Work Sans). Inspired by long-form journalism layouts.

## What's different from the default theme

- **Tailwind, not SCSS.** Theme styles are written as `theme.css` with
  `@tailwind` directives + `@layer base/components` blocks. A
  `tailwind.config.cjs` next to it scopes the content scan to this
  theme directory only, so the compiled CSS stays free of admin-bundle
  utility classes.
- **Material 3 tokens as RGB triplets.** Colors live in CSS variables
  in the form `--color-primary: 0 0 0` (space-separated RGB), so
  Tailwind's `rgb(var(--color-X) / <alpha-value>)` formula keeps
  alpha-modifier syntax (`bg-primary/50`) working. The Style settings
  tab presents a hex `<input type="color">` to admins; `compileCss`
  converts hex → triplet at upload time.
- **Magazine-specific blocks.** Three new blocks under the
  `magazine/` namespace, complementing the core blocks:
  - `magazine/hero-split` — 8/4 grid with one big featured post + 2
    secondary mini-cards (slot 1 image-card, slot 2 text-only with
    author byline).
  - `magazine/most-read` — sidebar widget with oversized 01..04
    numerals.
  - `magazine/promo-card` — sponsored card with image + overlay.

## Build pipeline

`scripts/build-theme-tailwind.mjs` runs **before** `vite build` (wired
into `prebuild` and `predev` in `package.json`). For each theme that
has a `tailwind.config.cjs`, it invokes the Tailwind CLI with the
local config and writes `theme.compiled.css` next to the source. Vite
then `?inline`-imports that file into the manifest's `cssText`.

After Vite finishes, `scripts/build-themes.mjs` copies
`theme.compiled.css` (or compiles `theme.scss` for legacy themes) into
`dist/theme-assets/<id>.css` — the path published pages link to.

For iterative theme development:

```bash
npx tailwindcss -c src/themes/magazine/tailwind.config.cjs \
  -i src/themes/magazine/theme.css \
  -o src/themes/magazine/theme.compiled.css \
  --watch
```

Vite picks up the rewritten file via the `?inline` import and HMR
reflects the change in the admin preview.

## Templates

- **`HomeTemplate`** — fully publisher-driven. Reads `heroHtml`,
  `listHtml`, `mostReadHtml`, `promoCardHtml` from the publisher's
  per-theme rendering branch. Layout: hero on top, then 8/4 grid with
  a Latest list and an optional sidebar (Most Read + Promo).
- **`SingleTemplate`** — centered title (`max-w-3xl`), italic lede,
  metadata strip, 21:9 hero. Body in `max-w-2xl` with an automatic
  drop-cap on the first paragraph (CSS-only, via
  `.magazine-prose-drop-cap > p:first-of-type::first-letter`). 4-col
  sidebar holds runtime widgets (author bio + related posts) populated
  by `posts-loader.js` once added.
- **`CategoryTemplate`** — breadcrumb, header card with `border-l-4`
  primary accent, 3/9 grid (sticky sidebar with all categories +
  popular tags / 3-col card grid).
- **`AuthorTemplate`** — bento profile (8 col bio + 4 col stats grid)
  + bento articles grid (1 large col-span-2 + 2 smalls + grid for the
  rest).
- **`NotFoundTemplate`** — sober editorial 404.

## Settings page

Reachable at `/theme-settings` when the magazine theme is active.
Stores everything under `settings.themeConfigs.magazine` in Firestore.

- **Logo** — upload a JPG/PNG/WebP logo (resized to 480×144 contain,
  saved as WebP at `theme-assets/magazine-logo.webp`). Toggles
  `logoEnabled` + `logoUpdatedAt`. Re-publishes `/data/menu.json` so
  the change reaches the public site without per-page republish.
- **Style** — pick fonts (serif + sans pairs from a curated Google
  Fonts list) and override 14 Material 3 color tokens. Save & apply
  uploads a regenerated CSS to `theme-assets/magazine.css`.
- **Home** — Most Read item count + sidebar slot variants
  (most-read / promo / none) + promo card fields.
- **Header** — wordmark position (centered / left) + show search trigger.

## Search

The header includes a `[data-cms-search]` button. The optional
**flexweg-search** plugin (regular plugin, not MU) wires it up at
runtime when enabled. The button is inert when the plugin is off.

To hide the trigger entirely, toggle `Show search trigger` off in the
Header tab.

## Customization without touching this code

For most needs, the Settings page is sufficient. Edit colors / fonts
/ layout from there; the regenerated CSS picks up your overrides.

To go further (custom layouts, new blocks, alternate typographic
rhythm), copy this directory to `src/themes/<your-id>/` and adapt:

1. Change `id`, `name`, `version` in `manifest.ts`.
2. Replace `theme.css` and `tailwind.config.cjs` with your own rules.
3. Edit / replace templates in `templates/`.
4. Add or remove blocks in `blocks/`.
5. Register the new manifest in `src/themes/index.ts`.

The build pipeline picks up new themes automatically.
