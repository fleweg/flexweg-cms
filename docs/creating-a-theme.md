# Creating an external theme

This guide walks through authoring a Flexweg CMS theme distributed as a `.zip` and loaded at runtime — no rebuild of the admin required.

## Theme vs. plugin

Themes own the **public-facing rendering**: every published HTML page on the site goes through the active theme's templates (`base`, `home`, `single`, `category`, `author`, `notFound`). Plugins layer on top — they hook filters / actions and contribute editor blocks, dashboard cards, settings pages — but they don't decide what the published HTML looks like.

External themes use the same manifest shape as in-tree themes. The difference is purely how the bundle reaches the admin (a zipped package vs. code committed to the repo).

## Anatomy of an external theme

```
my-theme/
├── manifest.json          ← installation metadata
├── package.json
├── tsconfig.json
├── vite.config.ts
├── scripts/pack.mjs
├── src/
│   ├── manifest.tsx       ← entry — default-exports a ThemeManifest
│   ├── theme.css          ← compiled CSS imported via ?raw
│   ├── templates/
│   │   ├── BaseLayout.tsx
│   │   ├── HomeTemplate.tsx
│   │   ├── SingleTemplate.tsx
│   │   ├── CategoryTemplate.tsx
│   │   ├── AuthorTemplate.tsx
│   │   └── NotFoundTemplate.tsx
│   └── types/
│       └── cms-runtime.d.ts ← type stubs for externalised imports
└── README.md
```

The `.zip` artifact contains `manifest.json`, `bundle.js`, `theme.css`, and optionally `README.md`. Anything else in the ZIP is uploaded to `/admin/themes/<id>/` on Flexweg too.

## manifest.json

```json
{
  "id": "minimal-theme",
  "name": "Minimal Theme",
  "version": "1.0.0",
  "apiVersion": "1.0.0",
  "entry": "bundle.js"
}
```

Same fields as the plugin manifest. `id` is the folder name on Flexweg; lower-case ASCII + dash.

## bundle.js (the runtime payload)

`src/manifest.tsx` default-exports a `ThemeManifest`:

```tsx
import cssText from "./theme.css?raw";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
// ...

const manifest = {
  id: "minimal-theme",
  name: "Minimal Theme",
  version: "1.0.0",
  description: "Minimal theme — single column, system fonts.",
  scssEntry: "theme.css",
  cssText,
  templates: {
    base: BaseLayout,
    home: HomeTemplate,
    single: SingleTemplate,
    category: CategoryTemplate,
    author: AuthorTemplate,
    notFound: NotFoundTemplate,
  },
};

export default manifest;
```

| Field | Required | Description |
|---|---|---|
| `id`, `name`, `version` | yes | Same as plugins. |
| `description` | no | Surfaced on the theme card. |
| `scssEntry` | yes | Original entry path. Mostly informational for external themes. |
| `cssText` | yes | The compiled CSS as a string — uploaded verbatim to `/theme-assets/<id>.css` by the **Sync theme assets** button. Import via `?raw` from your bundled CSS. |
| `templates.{base, home, single, category, author, notFound}` | yes | React components used by the publisher to render the public site. |
| `imageFormats` | no | Variant catalog for the media pipeline (sizes / quality / format). |
| `jsText`, `jsTextPosts` | no | Optional companion runtime JS — uploaded as `/theme-assets/<id>-menu.js` and `/theme-assets/<id>-posts.js`. Useful for dynamic menus, related posts widgets, etc. |
| `settings` | no | Per-theme settings page (`navLabelKey`, `defaultConfig`, `component`). |
| `i18n` | no | Translation bundles loaded into a `theme-<id>` namespace. |
| `compileCss` | no | Hook called every time `theme-assets/<id>.css` is uploaded; receives the resolved theme config and returns the CSS to upload. Use this to bake user style overrides (color palette, fonts) into the published CSS. |
| `blocks` | no | Editor blocks registered when the theme becomes active. |
| `register` | no | Optional callback invoked on activation; same pluginApi. |

## Templates

Theme components must be **pure / serialisable-prop consumers** — no Firestore hooks, no admin context. The publisher resolves everything (URLs, MediaView shapes, ResolvedMenuItems) before rendering.

### BaseLayout

Wraps every page. Receives `site` (settings + resolved menus + `themeConfig`), `pageTitle`, `pageDescription`, `ogImage`, `currentPath`, and `children`.

**Two sentinels are required**, both consumed by `core/render.tsx` after `renderToStaticMarkup`:

- `<meta name="x-cms-head-extra" />` inside `<head>` — replaced with the result of `applyFiltersSync("page.head.extra", "", baseProps)`. Plugins like `flexweg-favicon`, `core-seo` and `flexweg-rss` inject their `<link>` / `<meta>` tags here.
- `<script type="application/x-cms-body-end" />` just before `</body>` — replaced with the result of `applyFiltersSync("page.body.end", "", baseProps)`. Plugins inject deferred runtime scripts there.

Without those sentinels, the corresponding plugin output silently no-ops on your theme.

### Other templates

`HomeTemplate`, `SingleTemplate`, `CategoryTemplate`, `AuthorTemplate`, `NotFoundTemplate` each receive a typed props object. See the in-tree themes (`src/themes/default/templates/*.tsx`) for full-featured examples — they handle hero images, sidebars, primary terms, tag chips, share buttons, etc.

## CSS / styling

The admin uploads `manifest.cssText` verbatim to `/theme-assets/<id>.css`. Every published page references that exact path.

**You can ship whatever CSS pipeline you like** as long as the final output is a single CSS string at build time:

- **Hand-written CSS / vanilla CSS** — easiest. Author `theme.css`, import via `?raw` (the example does this).
- **Tailwind** — set up a Tailwind config + entry CSS file, run `tailwindcss -i src/theme.css -o dist/theme.css` before `vite build`, then `import cssText from "../dist/theme.css?raw"`.
- **SCSS** — Vite supports `import cssText from "./theme.scss?raw"` directly; Sass is bundled.

Whichever you pick, **scope your CSS to your theme**. A unique class prefix (e.g. `.mt-` for `minimal-theme`) avoids collisions if a user switches themes without purging the previous theme's CSS.

### Live customisation: `compileCss`

If your theme's settings expose user-editable colors / fonts / spacing, bake them into the uploaded CSS via `compileCss`:

```ts
manifest.compileCss = (config: MyThemeConfig) => {
  const overrides = `:root {\n  --my-primary: ${config.primaryColor};\n}\n`;
  return cssText + "\n\n" + overrides;
};
```

The admin calls this every time it uploads `/theme-assets/<id>.css` (the **Sync theme assets** button + the theme settings page's save action). Without `compileCss`, the user's customisations would be wiped on every sync because the bundled `cssText` baseline gets pushed instead.

## Build configuration

`package.json`:

```json
{
  "name": "my-theme",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build && node scripts/pack.mjs",
    "pack": "node scripts/pack.mjs"
  },
  "devDependencies": {
    "@types/react": "^18.3.28",
    "@vitejs/plugin-react": "^4.3.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^6.0.3",
    "vite": "^5.4.10"
  }
}
```

`vite.config.ts` — same shape as the plugin example. Externalise `react`, `react/jsx-runtime`, `react-dom`, `react-dom/client`, `react-i18next` (only if you use translations) and `@flexweg/cms-runtime`.

`scripts/pack.mjs` — same idea as the plugin example, but also include `theme.css` from `src/`:

```js
zip.file("theme.css", readFileSync(resolve(root, "src/theme.css")));
```

## Build + install

```bash
npm install
npm run build
```

Outputs `<id>.zip`. In the admin: **Themes** → **Install theme** → pick the zip. After upload + reload, your theme appears alongside the built-ins. Click **Activate** to switch to it — the admin runs the standard switch-theme flow (sync assets + regenerate every published page).

## Manual install (without the upload UI)

1. Unzip into `<id>/`.
2. Upload to Flexweg under `/admin/themes/<id>/`.
3. Append an entry to `/admin/external.json`:
   ```json
   {
     "id": "<id>",
     "version": "1.0.0",
     "apiVersion": "1.0.0",
     "entryPath": "themes/<id>/bundle.js"
   }
   ```
4. Reload the admin.

## Uninstall

**Themes** → **Install theme** → modal lists installed external themes with an **Uninstall** button. Clicking removes the folder + the entry from `external.json`. If the uninstalled theme was active, the admin falls back to the first available theme — switch to a different theme first if you want to control which one becomes active.

## Troubleshooting

- **The theme renders but pages have no styling** — confirm `cssText` is non-empty and that BaseLayout's `<link rel="stylesheet" href="/theme-assets/<id>.css">` matches your theme id.
- **Plugin head tags missing** — your BaseLayout doesn't emit `<meta name="x-cms-head-extra" />`. Add it.
- **Hooks crash** — same as for plugins: a duplicate React. Check `external` in vite.config.ts.
- **Switching to my theme breaks every published page** — make sure your templates accept the props the publisher sends. Compare against `src/themes/types.ts` (canonical types) and the in-tree default theme.
