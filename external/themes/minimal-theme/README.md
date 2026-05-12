# Minimal Theme — Flexweg CMS external theme example

Demonstrates how to author a theme that gets compiled into a single ESM bundle and dropped into a Flexweg CMS admin via the "Install theme" upload flow.

## What it provides

- The six required templates: base, home, single, category, author, notFound.
- A small hand-written stylesheet (`src/theme.css`) — no Tailwind / SCSS pipeline so the example stays minimal.
- The required head-extra and body-end sentinels in BaseLayout, so plugins like `flexweg-favicon` and `flexweg-rss` can inject their tags into your theme's pages.

## Build

```bash
npm install
npm run build
```

Outputs:

- `./dist/bundle.js` — the ESM bundle imported by the admin at boot.
- `./minimal-theme.zip` — the install-ready package.

## Install

1. In Flexweg CMS admin → **Themes** → click **Install theme**.
2. Pick `minimal-theme.zip`.
3. After upload + reload the theme appears alongside the built-ins. Click **Activate** to switch the site to it.

## File layout

```
minimal-theme.zip
├── manifest.json   ← id, name, version, apiVersion, entry
├── bundle.js       ← ESM, default-exports the ThemeManifest
├── theme.css       ← uploaded as /theme-assets/minimal-theme.css
└── README.md
```

The bundle imports `theme.css` via `?raw` so the CSS is embedded as `manifest.cssText`. The admin's "Sync theme assets" path uploads that string verbatim.

See `docs/creating-a-theme.md` in the main repo for the full reference.
