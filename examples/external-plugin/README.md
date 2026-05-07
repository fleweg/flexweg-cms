# Hello Plugin — Flexweg CMS external plugin example

Demonstrates how to author a plugin that gets compiled into a single ESM bundle and dropped into a Flexweg CMS admin via the "Install plugin" upload flow.

## What it does

- Filters `page.head.extra` to inject `<meta name="x-hello-plugin" content="external" />` on every published page.
- Subscribes to the `publish.complete` action and `console.log`s the post id.
- Registers a small dashboard card showing live updating state (proves React hooks work in external bundles).

## Build

```bash
npm install
npm run build
```

Outputs `./dist/bundle.js` and packs `./hello-plugin.zip` next to it.

## Install

1. In Flexweg CMS admin → **Plugins** → click **Install plugin**.
2. Pick `hello-plugin.zip`.
3. After the upload completes the admin reloads. The new card appears on the dashboard, and "View source" on any published page will show the meta tag.

## File layout

```
hello-plugin.zip
├── manifest.json   ← id, name, version, apiVersion, entry
├── bundle.js       ← ESM, default-exports the PluginManifest
└── README.md       ← shown via "Learn more" in the plugins list
```

`manifest.json` controls metadata; `bundle.js` is the single ESM artifact the admin imports at boot. The bundle externalises `react`, `react/jsx-runtime`, `react-dom`, `react-dom/client`, `react-i18next` and `@flexweg/cms-runtime` — the admin's import-map redirects these to live runtime stubs so there is exactly one React instance in the page (required for hooks integrity).

See `docs/creating-a-plugin.md` in the main repo for the full reference.
