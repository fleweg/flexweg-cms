---
name: flexweg
description: Build external plugins, themes, and demo content for Flexweg CMS — a static-host CMS where the admin SPA renders React themes server-side in the browser and uploads HTML via Flexweg's Files API. Invoke when the user wants to scaffold a Flexweg extension, add an editor block, write a hook, configure a settings page, or prepare demo content for the Flexweg Import plugin.
---

# Flexweg CMS — extension authoring skill

You are helping a developer build something that runs on **Flexweg CMS**. Stay in this skill until the user's task is complete; if the question is unrelated to Flexweg, exit cleanly.

## How Flexweg works (you must internalize this before scaffolding anything)

Flexweg is a **static-host CMS**: there is no server. The admin SPA (React + Tailwind) runs in the browser and is the *only* runtime. The admin can use one of **two data backends**, picked by the site owner at install time and invisible to extension code:

- **Firebase** — Firestore for data + Firebase Auth for login.
- **Flexweg SQLite** — `/api/v1/sqlite/*` for data + `/api/v1/sqlite/auth/*` for login. Zero external services, hosted on the same Flexweg site as the admin.

When an admin clicks **Publish** on a post, the admin (regardless of backend):

1. Reads everything from the active backend (posts, terms, media, settings) through a dispatcher layer
2. Runs the active theme's React components through `react-dom/server.renderToStaticMarkup` **inside the browser**
3. POSTs the resulting HTML to Flexweg's Files API at the post's target path (e.g. `/<category>/<slug>.html`)

The "public site" is just whatever HTML files the admin has uploaded. There is no SSR server, no edge function, no build step that touches the public site — every public file is the result of an explicit admin action.

**For extension authors this means**: your plugin / theme code must stay **backend-agnostic**. Never import `firebase/firestore` or `services/flexweg-sqlite/*` directly — consume the dispatcher-routed exports from `@flexweg/cms-runtime` (see §A and the hook reference below). The same plugin .zip works on both backends without modification.

Extensions (plugins + themes) come in **two flavors**:

| | In-tree | External |
|---|---|---|
| Where | `src/plugins/<id>/` or `src/themes/<id>/` in the admin repo | A `.zip` package, uploaded via the admin's **Install** UI |
| Build | Rebuilt with the admin (`npm run build`) | The author builds independently with Vite |
| Distribution | Source code committed to the admin repo | A `.zip` distributed separately |
| Hot install | Requires rebuild + redeploy | One-click install at runtime |

The hook API (`addFilter`, `addAction`, `registerBlock`, `registerDashboardCard`) and the manifest shapes are **identical** across both. Pick **external** when:

- Shipping to admins you don't control (clients, customers, marketplace)
- You don't want to rebuild + redeploy the admin SPA on every change
- You want admins to install / remove with one click

Pick **in-tree** when the plugin/theme only ships with your own admin and you'd rather skip the install UX.

## Step 1: Figure out what the user wants

Before writing any code, identify which path applies:

- **"Build a plugin"** → §A
- **"Build a theme"** → §B
- **"Add an editor block"** to an existing plugin/theme → §C
- **"Add a dashboard card"** → §D
- **"Prepare demo content for import"** → §E
- **"My publish is broken / URLs are wrong"** → §F (debug)
- **"Extend the post / page editor or the taxonomies UI"** (custom tab, term section, per-variant editing) → §G
- **"Build multi-language / multi-variant publishing"** (per-locale URLs, hreflang, sitemap alternates, per-language sidebars) → §H

Ask the user one clarifying question if it's not obvious. Don't guess.

---

## §A — External plugin recipe

### File layout

```
my-plugin/
├── manifest.json          ← installation metadata (read by admin BEFORE the bundle)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── scripts/pack.mjs       ← zips dist/ + manifest into <id>.zip
├── src/
│   ├── manifest.tsx       ← entry — default-exports a PluginManifest
│   └── types/
│       └── cms-runtime.d.ts ← type stubs for the externalised @flexweg/cms-runtime
└── README.md
```

### `manifest.json` (installation metadata)

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "apiVersion": "1.0.0",
  "entry": "bundle.js"
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Lower-case ASCII + dash. Used as folder name on Flexweg. **Immutable** after install. |
| `name` | yes | Display name shown during install. |
| `version` | yes | Semver of the plugin itself. |
| `apiVersion` | yes | Runtime API version this bundle was built against. Admin refuses to load if outside `[FLEXWEG_API_MIN_VERSION, FLEXWEG_API_VERSION]`. Current is `1.3.x` (min `1.0.0`). |
| `entry` | no | Defaults to `bundle.js`. |

### `src/manifest.tsx` (the runtime payload — default-export a `PluginManifest`)

```tsx
import type { PluginManifest } from "@flexweg/cms-runtime";

const manifest: PluginManifest = {
  id: "my-plugin",                // MUST match manifest.json id
  name: "My Plugin",
  version: "1.0.0",
  description: "What this plugin does in one sentence.",
  author: "Your Name",
  register(api) {
    api.addFilter<string>("page.head.extra", (head) => {
      return head + '<meta name="x-my-plugin" content="active" />\n';
    });
    api.addAction("publish.complete", (post, ctx) => {
      console.log("[my-plugin] published:", post.slug);
    });
  },
};

export default manifest;
```

### `vite.config.ts` (CRITICAL — wrong config = hooks crash)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vite's lib mode does NOT replace process.env.NODE_ENV like app mode.
  // React's prod shim, react-i18next, several Tiptap deps reference it.
  // Without this, the bundle crashes the moment it imports.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: "src/manifest.tsx",
      formats: ["es"],
      fileName: () => "bundle.js",
    },
    outDir: "dist",
    rollupOptions: {
      // EVERY bare specifier the admin's import-map covers MUST be external.
      // Otherwise Rollup ships a second React → "Invalid hook call" crash.
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "react-i18next",
        "@flexweg/cms-runtime",
      ],
      output: {
        // The admin only loads bundle.js. Code-split chunks would 404.
        inlineDynamicImports: true,
      },
    },
  },
});
```

### `package.json`

```json
{
  "name": "my-plugin",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build && node scripts/pack.mjs"
  },
  "devDependencies": {
    "@types/react": "^18.3.28",
    "@vitejs/plugin-react": "^4.3.3",
    "jszip": "^3.10.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^15.2.0",
    "typescript": "^6.0.3",
    "vite": "^5.4.10"
  }
}
```

Install with `npm install --legacy-peer-deps` (the project pins TypeScript 6 while react-i18next declares an optional peer on TS 5 — the install is safe).

### `scripts/pack.mjs`

```js
import { createWriteStream, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf-8"));

const zip = new JSZip();
zip.file("manifest.json", readFileSync(resolve(root, "manifest.json")));
zip.file("bundle.js", readFileSync(resolve(root, "dist/bundle.js")));
const readme = resolve(root, "README.md");
if (existsSync(readme)) zip.file("README.md", readFileSync(readme));

zip
  .generateNodeStream({ type: "nodebuffer", streamFiles: true })
  .pipe(createWriteStream(resolve(root, `${manifest.id}.zip`)))
  .on("finish", () => console.log(`Packed: ${manifest.id}.zip`));
```

### `src/types/cms-runtime.d.ts` (minimal stubs so TS compiles)

```ts
declare module "@flexweg/cms-runtime" {
  export const FLEXWEG_API_VERSION: string;
  export const FLEXWEG_API_MIN_VERSION: string;
  export const pluginApi: {
    addFilter<T>(hook: string, fn: (value: T, ...args: unknown[]) => T | Promise<T>, priority?: number): void;
    addAction(hook: string, fn: (...args: unknown[]) => void | Promise<void>, priority?: number): void;
    registerBlock(manifest: unknown): void;
    registerDashboardCard(manifest: { id: string; priority?: number; component: React.ComponentType }): void;
    // NEW (API 1.2): editor / taxonomies extensibility points — see §G.
    registerInspectorTab(manifest: unknown): void;
    registerTermEditorSection(manifest: unknown): void;
    // NEW (API 1.3): full per-variant editor replacement — see §H.
    registerEditorVariantProvider(manifest: unknown): void;
  };
  // Also exposed at top level for direct invocation from your handlers.
  export function applyFilters<T>(hook: string, value: T, ...args: unknown[]): Promise<T>;
  export function applyFiltersSync<T>(hook: string, value: T, ...args: unknown[]): T;
  export function doAction(hook: string, ...args: unknown[]): Promise<void>;
  export interface PluginManifest<TConfig = unknown> {
    id: string;
    name: string;
    version: string;
    description?: string;
    author?: string;
    readme?: string;
    register: (api: typeof pluginApi) => void;
    settings?: {
      navLabelKey: string;
      defaultConfig: TConfig;
      component: React.ComponentType<PluginSettingsPageProps<TConfig>>;
    };
    i18n?: Record<string, Record<string, unknown>>;
  }
  export interface PluginSettingsPageProps<T> {
    config: T;
    save: (next: T) => void | Promise<void>;
  }
  // Add Post, PublishContext, etc. as needed.
}
```

The full set of runtime exports (call from your handlers, no admin import needed) includes the entries above plus:
- Slug helpers: `slugify`, `isValidSlug`, `findAvailableSlug`, `buildPostUrl`, `buildTermUrl`, `pathToPublicUrl`, `canonicalPath`, `canonicalUrl`, `detectPathCollision`, `detectTermSlugCollision`
- Files API: `uploadFile`, `deleteFile`, `deleteFolder`, `getFile`, `listFiles`, `publicUrlFor`, `FlexwegApiError`
- CRUD: `fetchAllPosts`, `createPost`, `updatePost`, `createTerm`, `updateTerm`, `deleteTerm`, `uploadMedia`
- Publisher: `publishPost`, `buildPublishContext`, `buildSiteContext`, `renderHome`, `publishMenuJson`, `publishPostsJson`, `publishAuthorsJson` (the latter three accept an optional `pathOverride` so plugins can write per-locale variants)
- Settings: `updatePluginConfig`, `updateThemeConfig`
- Rendering: `renderPageToHtml`, `getActiveTheme`, `renderMarkdown`, `markdownToPlainText`
- RSS helper: `buildRssFeedXml` (shared with the flexweg-rss plugin)
- Hooks: `useCmsData`, `useAuth`, `useAllPosts`
- i18n: `i18n` (instance), `pickPublicLocale`, `setActiveLocale`

### Install + uninstall

Build: `npm run build` → outputs `<id>.zip`.

Install: in the admin, **Plugins** → **Install plugin** → drag the ZIP. The admin uploads files to `/admin/plugins/<id>/` on Flexweg, appends an entry to `/admin/external.json`, and reloads.

Uninstall: same modal lists installed externals with an **Uninstall** button.

---

## §B — External theme recipe

Themes own the **public-facing rendering**: every published HTML page goes through the active theme's six templates. Plugins layer on top; themes decide what the published HTML looks like.

### File layout

```
my-theme/
├── manifest.json
├── package.json
├── tsconfig.json
├── vite.config.ts          ← same as plugin (externalize React etc.)
├── scripts/pack.mjs        ← also zips theme.css
├── src/
│   ├── manifest.tsx
│   ├── theme.css           ← compiled CSS imported via ?raw
│   ├── templates/
│   │   ├── BaseLayout.tsx       ← CRITICAL: contains sentinels (see below)
│   │   ├── HomeTemplate.tsx
│   │   ├── SingleTemplate.tsx
│   │   ├── CategoryTemplate.tsx
│   │   ├── AuthorTemplate.tsx
│   │   └── NotFoundTemplate.tsx
│   └── types/
│       └── cms-runtime.d.ts
└── README.md
```

### `src/manifest.tsx`

```tsx
import cssText from "./theme.css?raw";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";

const manifest = {
  id: "my-theme",
  name: "My Theme",
  version: "1.0.0",
  description: "What this theme is for in one sentence.",
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

### `src/templates/BaseLayout.tsx` (the CRITICAL part — two mandatory sentinels)

Without these two HTML comments in your `<head>` and just before `</body>`, plugins like `flexweg-favicon`, `flexweg-rss`, `core-seo`, and `flexweg-custom-code` **silently no-op** on your theme. The admin's renderer does a post-`renderToStaticMarkup` string replace on these sentinels.

```tsx
import { canonicalUrl, type BaseLayoutProps } from "@flexweg/cms-runtime";

export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  currentPath,
  currentLocale,          // ← API ≥ 1.2: per-page locale override
  children,
}: BaseLayoutProps) {
  // currentLocale wins over the site-wide language. Multilang plugins
  // set it per page so <html lang> is correct on /fr/ pages without
  // having to override the global setting.
  const lang = currentLocale || site.settings.language || "en";
  // SiteContext.homePath (API ≥ 1.3) is plugin-provided. Multilang
  // sets it to "/fr/index.html" on FR pages so the brand link points
  // at the right home. Falls back to the global home. Use the same
  // value for any breadcrumb's "Home" entry in your other templates.
  const homeHref = site.homePath ?? "/index.html";
  // ALWAYS emit a canonical from the BaseLayout — every theme owns
  // this. The publisher passes a localised `currentPath` (e.g.
  // "fr/news/hello.html") so this naturally points at the right
  // per-locale URL. The multilang plugin intentionally does NOT
  // emit a canonical of its own; if your theme skips this, the
  // page ends up canonical-less.
  //
  // Use `canonicalUrl()` (NOT a raw string concat) so directory
  // landings (home, /<lang>/, category archives) emit the clean
  // form ending in `/` rather than `/index.html`. Both files
  // resolve to the same content on Flexweg but the trailing-slash
  // form is the SEO-preferred canonical and matches what
  // multilang's hreflang link tags use, keeping the two in sync.
  const canonical =
    site.settings.baseUrl && currentPath
      ? canonicalUrl(site.settings.baseUrl, currentPath)
      : undefined;
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonical && <link rel="canonical" href={canonical} />}
        <link rel="stylesheet" href={`/theme-assets/${"my-theme"}.css`} />
        {/* MANDATORY sentinel — plugins inject head tags here */}
        <meta name="x-cms-head-extra" />
      </head>
      <body>
        {/* Use homeHref (NOT hard-coded "/") in your Header so the
            multilang plugin can localise the brand link. */}
        <header><a href={homeHref}>{site.settings.title}</a></header>
        {children}
        {/* MANDATORY sentinel — plugins inject body-end scripts here */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
```

Replace `"my-theme"` with your actual theme id (or read it from props if you want it dynamic).

### Optional BaseLayout polish patterns

Two small UX patterns that meaningfully improve a theme without compromising the static-publishing model — both implemented in `marketplace-core` v1.3.x as reference:

**Brand-suffix dedup** — when an author bakes the site name into `seo.title` (e.g. "Brand — descriptor" or "descriptor — Brand"), the default `${pageTitle} — ${site.settings.title}` pattern produces a duplicate. Guard with a simple `includes()` check before appending:

```tsx
const siteTitle = site.settings.title || "";
const alreadyBranded =
  !!pageTitle && !!siteTitle && pageTitle.includes(siteTitle);
const fullTitle = pageTitle
  ? alreadyBranded ? pageTitle : `${pageTitle} — ${siteTitle}`
  : siteTitle;
```

**Hide-on-scroll header (+ mobile bottom-nav)** — slide the header up when the user scrolls down, slide it back when they reverse or land near the top. Implementation: CSS `transition: transform 0.28s` + `will-change: transform` on the header; an inline `<script>` near the body-end sentinel toggles a `.is-hidden` class via rAF-throttled scroll listener. Threshold ~6px (avoid jitter), always-show region ~80px (so it doesn't disappear at the top of the page). Same script pattern works for a fixed-position bottom-nav with the inverse `translateY(100%)`. Reference: marketplace-core's BaseLayout.tsx + theme.css.


### Templates receive serializable props only

Theme components must be **pure / serializable-prop consumers** — no Firestore hooks, no admin context. The publisher resolves URLs, MediaView shapes, ResolvedMenuItems, etc. before rendering. Copy the canonical types from the in-tree `src/themes/types.ts` into your own `src/types/cms-runtime.d.ts` so the bundle is self-contained.

### CSS pipeline (your choice)

The admin uploads `manifest.cssText` verbatim to `/theme-assets/<id>.css`. Your CSS pipeline just has to produce a single string at build time:

- **Vanilla CSS**: author `theme.css`, `import cssText from "./theme.css?raw"`. Simplest.
- **Tailwind**: pre-build with `tailwindcss -i src/theme.css -o dist/theme.css` before `vite build`, then import the dist file.
- **SCSS**: `import cssText from "./theme.scss?raw"` — Vite supports Sass inline.

**Scope your CSS with a unique class prefix** (e.g. `.mt-` for `my-theme`) to avoid collisions when users switch themes.

### Live customization with `compileCss`

If your theme's settings expose editable colors / fonts / spacing, bake them into the uploaded CSS via `compileCss`:

```ts
manifest.compileCss = (config: MyThemeConfig) => {
  const overrides = `:root {\n  --my-primary: ${config.primaryColor};\n}\n`;
  return cssText + "\n\n" + overrides;
};
```

The admin calls this every time `theme-assets/<id>.css` gets uploaded (the **Sync theme assets** button + the theme settings page's save). Without `compileCss`, every sync wipes the user's overrides because the baseline `cssText` gets pushed unchanged.

---

## §C — Adding an editor block

Blocks are Tiptap-based nodes the user can insert in the post editor via the `/` slash inserter. They're registered through `pluginApi.registerBlock`.

### Pattern (works for both plugins and themes)

```tsx
import { MyIcon } from "lucide-react";
import type { BlockManifest } from "@flexweg/cms-runtime";

const calloutBlock: BlockManifest = {
  id: "my-plugin/callout",      // namespaced
  titleKey: "callout.title",
  namespace: "my-plugin",       // i18n namespace
  icon: MyIcon,
  category: "text",             // text | media | layout | embed | advanced
  insert: (chain) =>
    chain.focus().insertContent({
      type: "myPluginCallout",
      attrs: { variant: "info" },
    }).run(),
  extensions: [/* Tiptap Node / Mark / Extension list */],
  isActive: (editor) => editor.isActive("myPluginCallout"),
  inspector: (props) => <CalloutInspector {...props} />,  // optional Block tab UI
};

// Register inside the plugin's register() callback:
manifest.register = (api) => {
  api.registerBlock(calloutBlock);
};
```

### Server-side rendering: the marker pattern

Blocks emit a `<div data-cms-block="<namespace>/<id>" data-attrs="<base64-json>"></div>` marker in the markdown body. Your plugin/theme then hooks the `post.html.body` filter to replace each marker with rendered HTML at publish time:

```ts
const MARKER_RE = /<div\s+([^>]*data-cms-block="my-plugin\/callout"[^>]*)>\s*<\/div>/g;

api.addFilter<string>("post.html.body", (html) => {
  return html.replace(MARKER_RE, (full, raw) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<CalloutAttrs>(enc, DEFAULT_ATTRS);
    return renderCallout(attrs);
  });
});
```

Where `decodeAttrs` is `JSON.parse(atob(encoded))` with a fallback to defaults.

### Composing landing pages with blocks

For marketing surfaces (home, about, lead-gen pages), don't try to express the layout in plain Markdown — author it as a stack of theme block markers. `marketplace-core` v1.3.0 added five landing blocks designed to be combined in any order:

- `marketplace-core/landing-hero` — eyebrow + headline + subhead + 2 CTAs + product visual
- `marketplace-core/stats-bar` — 4-cell numerical strip (e.g. "1-click · 10+ · MIT · 0 servers")
- `marketplace-core/feature-grid` — 3-column card grid with Material Symbol icons
- `marketplace-core/feature-row` — alternating image/text section with bullets + CTA
- `marketplace-core/cta-banner` — full-width final-push banner

Pattern: one `data-cms-block` marker per section, blank line between markers, importer rewrites image filenames inside the base64 attrs through `rewriteBlockMarkerImages` (so frontmatter-less paths like `home-hero.jpg` resolve to the media variant URL after import). See `external/themes/marketplace-core/src/blocks/` for the canonical implementations and `demo-content/marketplace-core/_generate.py`'s `HOME_LANDING` for a composed example.

Each block is rendered server-side at publish time via `transformBodyHtml` (registered on `post.html.body`) — the marker becomes the section's HTML in place. Themes that want their own landing blocks should follow the same pattern: per-block `render.ts` (interface + DEFAULT + render + transform-marker), per-block `manifest.tsx` (Tiptap node + inspector), all `transform<Block>` calls funneled through one `transformBodyHtml` registered as `post.html.body`.

---

## §D — Dashboard cards

```tsx
import type { ComponentType } from "react";

function MyCard() {
  // Fetch your own data. No props passed in.
  return <div className="card p-4">Stats: …</div>;
}

manifest.register = (api) => {
  api.registerDashboardCard({
    id: "my-plugin/card",
    priority: 50,         // lower runs first; default 100
    component: MyCard,
  });
};
```

The card renders below the four built-in stats cards on the admin dashboard. The component fetches its own data and manages its own loading / error / empty states.

**Data fetching — stay backend-agnostic**: use `useCmsData()` from `@flexweg/cms-runtime` (returns the same shape regardless of the active backend), or call the dispatcher-routed services (`fetchAllPosts`, `subscribeToTerms`, etc.) exposed by the runtime. Never `import { getFirestore } from "firebase/firestore"` directly — that crashes on SQLite-backend sites. The Flexweg Files API (`uploadFile`, `deleteFile`, etc. via the runtime) is always available regardless of backend.

---

## §E — Demo content for the Flexweg Import plugin

A "demo content" bundle is a folder of markdown files + images that an admin drags into the **Flexweg Import** plugin's drop zone. The plugin scans, creates posts/pages/terms/media in Firestore, and optionally auto-publishes.

### Folder layout

```
my-demo-content/
├── README.md
├── images/
│   ├── 01-hero.jpg
│   └── 02-something.jpg
├── 01-first-post.md
├── 02-second-post.md
├── page-about.md
└── page-contact.md
```

### Markdown frontmatter schema

```markdown
---
title: A Good Headline
slug: a-good-headline
type: post                      # or "page"
status: draft                   # or "online"
category: Recipes               # auto-created if missing
tags: [pasta, italian, weeknight]
heroImage: 01-hero.jpg          # filename in images/
author: anna@example.com        # matched against existing CMS users; fallback to importer
publishedAt: 2026-05-01
excerpt: "One-line summary used by listings."
seoTitle: Custom SEO title
seoDescription: Custom SEO description
---

Body markdown here. Headings, lists, links, images — anything `marked` supports.
```

### Embedding theme blocks in the body

Themes that ship custom blocks (corporate, magazine, marketplace-core, storefront) accept base64-encoded block markers in the body:

```markdown
<div data-cms-block="corporate/hero-overlay" data-attrs="eyJ0aXRsZSI6Ikhpr..."></div>

## Description

Regular markdown content here.

<div data-cms-block="corporate/services-grid" data-attrs="eyJlecQ...."></div>
```

To generate the base64: `Buffer.from(JSON.stringify(attrs)).toString("base64")`.

### Import workflow

1. Admin enables **Flexweg Import** plugin
2. Opens `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
3. Drags the whole folder (with `images/` inside) into the drop zone
4. Clicks **Scan** → sees a preview (posts, pages, categories, tags, images)
5. Picks status mode (recommended: **Always import as draft**)
6. Clicks **Confirm import**

### Common gotcha: stale terms during in-import publish

If you set status mode to **Always online**, the importer auto-publishes each post inside the import loop. The publish may run with a stale `ctx.terms` snapshot (captured before new categories were created), causing posts to publish at the root path instead of `<category>/<slug>.html`. The admin offers a **Repair URLs** action under the Regenerate menu to fix this after the fact, but the safer default is to import as draft and bulk-publish afterwards.

---

## §F — Debugging recipes

### URLs landed at the wrong path after import / publish

Symptom: posts show up at `/<slug>.html` (root) instead of `/<category>/<slug>.html`.

Cause: the publish ran with a stale terms list. The post has `primaryTermId` set correctly in Firestore, but the URL resolution couldn't find the term in the cached `ctx.terms`.

Fix: Regenerate menu → **Repair URLs** (in `/admin/`). It recomputes the canonical path for every online post and migrates files that drifted.

### Theme assets don't update after upgrading a theme

Symptom: re-installed the theme ZIP but the public site shows old CSS.

Cause: `Install theme` uploads to `/admin/themes/<id>/` only. The public CSS at `/theme-assets/<id>.css` is only updated by the **Sync theme assets** button on the theme card.

Fix: `/admin/#/themes` → Sync theme assets. Then hard-refresh the public page (Cmd+Shift+R) to bypass the browser HTTP cache.

### "Invalid hook call" after installing a plugin

Symptom: the admin crashes the moment the plugin loads.

Cause: the plugin bundled its own copy of React. There are now two React instances in the page, and React's hook dispatcher can't share state across them.

Fix: in your `vite.config.ts`, verify `external` includes ALL of `react`, `react/jsx-runtime`, `react-dom`, `react-dom/client`, `react-i18next`, `@flexweg/cms-runtime`. Rebuild.

### "process is not defined" after installing a plugin

Cause: Vite lib mode doesn't replace `process.env.NODE_ENV` like app mode does. React's prod shim references it.

Fix: in `vite.config.ts`, add:
```ts
define: { "process.env.NODE_ENV": JSON.stringify("production") }
```

### Plugin head meta tags don't appear

Cause: the active theme's `BaseLayout` is missing the `<meta name="x-cms-head-extra" />` sentinel.

Fix: add the sentinel inside `<head>`. The renderer does a post-render string replace on it.

### Old bundle stays cached after upgrade

Symptom: re-installed the plugin/theme but the admin runs the old code.

Cause: the browser's HTTP cache serves the old `bundle.js` even though the file on Flexweg is new (same URL, same headers, no version bump).

Fix: hard-refresh the admin (Cmd+Shift+R). Long-term: bump `version` in `manifest.json` before each release — the admin's external loader appends `?v=<version>` to the import URL, forcing a fresh fetch.

### Slug collision

The admin validates slugs against the FULL URL path, not the raw slug. A post slug and a category slug can be identical because their published URLs differ (`/posts/hello.html` vs `/hello/index.html`). Use `findAvailableSlug()` from `@flexweg/cms-runtime` to generate non-colliding slugs programmatically.

### Plugin crashes on a SQLite-backend site

Symptom: the plugin works on a Firebase site but throws `Firebase service called while active backend is "flexweg-sqlite". Dispatcher bug.` (or similar) on a SQLite-backend site.

Cause: the plugin code directly imports `firebase/firestore`, `firebase/auth`, or reaches into the admin's `services/firebase/*` modules instead of going through the dispatcher-routed exports in `@flexweg/cms-runtime`.

Fix: replace direct Firestore / Firebase Auth calls with the runtime equivalents. Examples:

- `getFirestore(...).collection("posts").onSnapshot(...)` → `subscribeToPosts(...)` from the runtime
- `getDoc(doc(db, "settings", "site"))` → `getSiteSettings()` or `useCmsData()` for live data
- Custom Firestore queries that have no runtime equivalent → file a request to add the wrapper; in the meantime use `useCmsData()` + filter client-side

The same plugin .zip then works on both backends without modification.

### Author info / email missing on the public site

Symptom: an author's name shows up as an obfuscated `[email&nbsp;protected]` (Cloudflare) on the published site, or doesn't show at all where you expected it.

Cause: the publisher's `authorLookup` resolver only emits a public-facing `AuthorView` when the user has set `firstName + lastName` (or the legacy `displayName` field). Without those, the lookup returns `undefined` and templates that check `if (author)` hide the author block. **Email is never exposed publicly** — that's a deliberate design choice.

Fix: in the admin's Users page, edit the user record and set `firstName + lastName`. Republish the post (or wait for the next regen). The author block reappears with the proper name.

If your THEME relies on the author block being there even for nameless users, your template logic needs to handle the `undefined` case — show an empty section, fall back to "Unknown author", whatever. Email is off-limits.

### `bundle.js?v=X.Y.Z` served from cache after a reinstall

Symptom: the bundle was rebuilt + re-uploaded but the admin still runs the old code. Hard refresh doesn't always help because the URL is the same.

Cause: the external loader appends `?v=<entry.version>` to invalidate the cache. If you didn't bump `version` in `manifest.json`, the URL stays identical and the browser HTTP cache serves the stale bytes.

Fix: bump the plugin's `version` in BOTH `manifest.json` AND `package.json` (and in `scripts/build-bundled-externals.mjs` if the plugin is also bundled there), rebuild, redeploy, then reinstall (or click "Restore bundled defaults" in `/plugins`).

### Two ZIPs out of sync after a code change

Symptom: I see one ZIP at `external/plugins/<id>/<id>.zip` and another at `dist/packs/plugins/<id>.zip` with different sizes / contents.

Cause: there are two build pipelines for each plugin. `npm run build` at the CMS root rebuilds the ZIP at `dist/packs/plugins/<id>.zip` (this is the authoritative one — built from the latest source). The ZIP inside the plugin's own folder is only rebuilt when you run `npm run build` **inside** that folder.

Fix: always rebuild from the CMS root. The `dist/packs/plugins/<id>.zip` artifact is the one to upload in production.

### Multilang tabs not appearing after reinstall

Symptom: the multilang plugin is installed but no language tabs show above the editor.

Causes (in order of likelihood):
1. The plugin's `apiVersion` is below the API the admin is shipping. Plugin needs `apiVersion >= 1.3.0` for the variant tabs.
2. The browser cached an older `bundle.js`. Bump `version` in `manifest.json` to force a fresh fetch.
3. The admin you deployed is older than the plugin expects. Verify `window.__FLEXWEG_RUNTIME__.apiVersion` in devtools — should be `1.3.0` or higher.
4. No secondary languages enabled. Open `/settings/plugin/flexweg-multilang` and toggle at least one language on.

### Localised home is empty / shows "No posts yet"

Cause: themes that delegate home rendering to pre-rendered `heroHtml` + `listHtml` strings (default theme) end up with empty home pages if the localised render passes `posts: [...]` but not those HTML strings.

Fix: the multilang plugin reuses the publisher's exported `renderHome(ctx, options)` with a shadow ctx (term slugs prefixed with `<lang>/`, post fields swapped to translations). The theme renders the home exactly as for primary, just with translated content. If you wrote a custom multilang renderer, port it to the same shadow-ctx + `renderHome` pattern instead of building your own template props.

### Primary-language page has no hreflang tags while FR variant does

Symptom: opening the FR variant shows the full hreflang alternates block in `<head>`. Opening the primary EN variant shows nothing → Google reports a hreflang cluster broken by missing reciprocity → the entire cluster is ignored.

Cause: the multilang plugin's `pathRegistry` (consumed by the sync `page.head.extra` filter) gets refreshed inside `publish.additional` — too late for the primary page, which was already rendered. The localised variants come out fine because the same handler refreshes BEFORE rendering them.

Fix: refresh the registry from `publish.before` (per-post hook fired BEFORE `renderSingle` in `publishPost`, `regenerateAll`, `repairPublishPaths`) AND from `regenerate.listings.before` (fired before `renderHome` / `renderCategory` in `regenerateListings` and `regenerateHomeOnly`). Both hooks land in API 1.3.3+. Older multilang plugin versions only registered on `publish.complete` and missed this completely.

### Duplicate `<link rel="canonical">` in published HTML

Symptom: viewing the source of any published page shows two canonical link tags with the same URL.

Cause: the theme's `BaseLayout` emits one (always), and a multilang plugin earlier than 1.3.2 also emitted one in its `page.head.extra` block.

Fix: upgrade multilang to ≥ 1.3.2 — it no longer emits a canonical. The theme's canonical is the single source of truth and already points at the localised path because the publisher passes a localised `currentPath`.

### Localised single posts render raw `<div data-cms-block="…">` markers (block transforms don't fire)

Symptom: on `/fr/<post>.html` the body shows literal HTML markers like `<div data-cms-block="marketplace-core/header-buttons" data-attrs="…"></div>` while the same post at `/<slug>.html` renders the expanded buttons / specs / features. Theme-side block transforms (the `post.html.body` filter chain) are skipped on localised variants.

Cause: a plugin's `renderLocalizedSingle` calls `renderMarkdown(trans.contentMarkdown)` directly and forgets to apply the `post.html.body` filter chain — that's where every theme's `transformBodyHtml` runs to swap `data-cms-block` markers for rendered HTML.

Fix: mirror the core publisher's `renderSingle` body pipeline exactly:

```ts
import { applyFilters, renderMarkdown } from "@flexweg/cms-runtime";

let bodyHtml = renderMarkdown(trans.contentMarkdown);
bodyHtml = await applyFilters<string>("post.html.body", bodyHtml, post);
```

Make the render function `async` since `applyFilters` is awaitable. The function's caller (typically a `publish.additional` handler) already awaits async filters so propagating `Promise<string>` is free. Reference: flexweg-multilang v1.5.2 fixed this exact bug.

### Home `<title>` ignores `page.seo.title` when the home is a wired static page

Symptom: a static page with explicit `seoTitle` / `seoDescription` is set as the home (Settings → General → Home → Static page), but the published `/index.html` shows just `<site title>` with no meta description.

Cause: pre-fix versions of `renderHome` hard-coded `pageTitle: ""` + `pageDescription: ctx.settings.description` regardless of what the wired page carried. The fix flows `page.seo?.title || page.title`, `page.seo?.description || page.excerpt || ctx.settings.description`, and `page.seo?.ogImage` into baseProps. Automatic on every static-page home + every locale rendered via multilang's shadow ctx (which delegates to the same `renderHome`).

Theme-side concern: if the user bakes the site name into `page.seo.title` (common: "Brand — descriptor"), BaseLayout's default `${pageTitle} — ${site.title}` produces a duplicate brand suffix. Add a small "includes-brand" check before appending — `marketplace-core` v1.3.2's BaseLayout shows the canonical guard:

```tsx
const alreadyBranded =
  !!pageTitle && !!siteTitle && pageTitle.includes(siteTitle);
const fullTitle = pageTitle
  ? alreadyBranded ? pageTitle : `${pageTitle} — ${siteTitle}`
  : siteTitle;
```

### "Continue reading" sidebar shows EN content on FR pages

Cause: the default theme's `posts-loader.js` fetches `/data/posts.json` (primary content). Localised pages need `/<lang>/data/posts.json` with translated entries.

Fix: the multilang plugin publishes per-language data files (`/fr/data/posts.json`, `/fr/data/authors.json`) on every publish, and the updated default theme's `posts-loader.js` detects the locale prefix from `window.location.pathname` and fetches the localised file first (falling back to root on 404). If you ship a custom theme, mirror this pattern: detect the leading 2-letter URL segment and prefix your data fetches.

---

## §G — Editor & taxonomies extensibility (API ≥ 1.2)

Three registries let plugins inject UI into the admin without touching the in-tree pages. All are cleared on every `applyPluginRegistration()` pass and re-registered by each enabled plugin's `register()` callback (same lifecycle as blocks / dashboard cards).

### `registerInspectorTab` — extra tab in the post / page editor's right inspector

Use when you want to surface PER-POST settings or metadata that don't belong in the Document tab and aren't tied to a specific block. The tab gets the live `entity` (Post), an `updateEntity(patch)` helper (writes to the host's in-memory draft) and a `save()` helper that resolves once `updatePost` returns.

```ts
api.registerInspectorTab({
  id: "my-plugin/audit",
  labelKey: "audit.tabLabel",
  namespace: "my-plugin",     // i18n namespace for the label
  forKind: "all",             // "post" | "page" | "all"
  badge: (entity) => entity.translations ? "● checked" : undefined,
  priority: 50,               // lower runs first; default 100
  component: AuditTabBody,    // ({ entity, updateEntity, save }) => ReactNode
});
```

The host doesn't merge per-tab patches into the standard save flow automatically — your tab is responsible for writing its data via `updatePost(entity.id, {...})` directly (or by hooking into the host's save via the `save` callback when applicable).

### `registerTermEditorSection` — extra fields in the categories / tags edit modal

Use for per-term metadata (e.g. per-language slug + name + SEO meta, term-specific config). The host renders your section in a collapsible row under the standard name + slug inputs (chevron on the row toggles it). Patches accumulate into a per-row plugin state; the row's Save button commits everything atomically via `updateTerm`.

The row already exposes a primary-language **SEO** button (between the slug input and Save) that opens a modal letting the admin set `Term.seo = { title, description, ogImage }` for the archive page's `<title>` + `<meta name="description">`. Plugins extending the term editor can layer **per-language** SEO on top by carrying a `seo` sub-object inside their translations map (see flexweg-multilang's `TermTranslation.seo`). The publisher's category render reads `term.seo` for the primary language; per-locale renders read `termTrans.seo` from the plugin's translations.

```ts
api.registerTermEditorSection({
  id: "my-plugin/term-extras",
  termType: "all",            // "category" | "tag" | "all"
  priority: 50,
  component: TermExtrasSection, // ({ term, updateTerm }) => ReactNode
});
```

Inside the component, call `updateTerm({ ...patch })` on each keystroke — the host accumulates patches in local state and writes them on Save. Don't filter / clean up partial entries on every keystroke; if you do, typing the first character of `name` while `slug` is empty would drop the entry from the map and look like the input is ignoring input. Tidy up at save time, not per keystroke.

### `registerEditorVariantProvider` — swap the WHOLE editor content per variant (API ≥ 1.3)

Use when each "variant" of a post needs the full editor (title + slug + WYSIWYG + blocks + drag-and-drop + excerpt + SEO), not just a side-panel form. The host renders a tab strip above the editor; switching tabs swaps the editor state for the new variant while preserving the same Tiptap instance (so blocks + extensions + scroll stay alive).

At most ONE provider should return more than one variant for a given entity. Multiple providers race for the same tab strip; the lower-priority one wins.

```ts
api.registerEditorVariantProvider({
  id: "my-plugin/variants",
  priority: 50,
  listVariants(entity, ctx) {
    // ctx = { settings, terms } — pulled from useCmsData() by the host.
    // Return [{id, label, badge, primary}]. Exactly one must be primary.
    // The primary uses the entity's native fields (host saves through
    // its normal updatePost path). Non-primary variants save via your
    // saveFields handler.
    return [
      { id: "en", label: "EN", badge: "★", primary: true },
      { id: "fr", label: "FR", badge: "○", primary: false },
    ];
  },
  loadFields(entity, variantId, ctx) {
    // Return { title, slug, contentMarkdown, excerpt?, seo? } for the
    // given variant. Return null for an empty draft.
    if (variantId === "en") return null; // primary uses entity directly
    return readFromTranslationsMap(entity, variantId);
  },
  async saveFields(entity, variantId, fields, ctx) {
    // Called when the user clicks Save with a non-primary variant
    // active. Strip undefined values before writing — Firestore
    // rejects `undefined` field values.
    await updatePost(entity.id, {
      translations: {
        ...((entity.translations as Record<string, unknown>) ?? {}),
        [variantId]: stripUndefined(fields),
      },
    });
  },
  validate(entity, variantId, fields, ctx) {
    if (!isValidSlug(fields.slug)) return "Invalid slug.";
    return null;
  },
  getSlugPathPrefix(entity, variantId, fields, ctx) {
    // Optional. Lets your tab show "fr/news/" before the slug input
    // so the user sees the full localised URL.
    return `${variantId}/${categorySlugFor(entity, ctx)}/`;
  },
});
```

The host:
- Pre-empts auto-slug-from-title when switching to a variant that has a saved slug, but RE-ENABLES it for empty variants so the user gets the same UX as when creating a new post.
- For non-primary variants, skips the global slug-collision detection (uniqueness is per-variant — your `validate` handles it).
- On Save with a non-primary variant active on an online post, also triggers `publishPost` so the new variant goes live alongside the others.

---

## §H — Multi-language plugins

This section covers the patterns the `flexweg-multilang` plugin uses. Apply the same recipes whenever you need per-locale URLs, hreflang SEO, sitemap alternates, per-language sidebar data, or per-language `<html lang>`. The same techniques generalize to "draft variants", A/B variants, version snapshots, etc. — the variant API is intentionally generic.

### Storage model

Per-post translations live on `Post.translations` (opaque `Record<string, unknown>` keyed by language code) — added by the variant provider's `saveFields`. Per-term translations live on `Term.translations` (same shape). Both are JSON columns in SQLite + Firestore Maps natively. Old posts without translations keep working unchanged.

Bookkeeping for cleanup: `Post.lastPublishedPathsByLocale` (`Record<lang, string>`) records where each variant was published last. The publisher's `publish.additional` flow auto-diffs this against the new set of paths and cleans up orphans (slug renames, removed languages) without you doing manual cleanup.

Plugin config (which languages are enabled, primary language, per-language home page id, menu label translations) lives in `settings.pluginConfigs["flexweg-multilang"]` — the standard Plugin Settings storage.

### URL strategy

Primary language at root (`site.com/news/hello.html`). Other languages prefixed: `site.com/fr/actualites/bonjour.html`. The plugin builds localised URLs by:
1. Pre-prefixing the **term slug** with `<lang>/` in a shadow ctx (e.g. `actualites` → `fr/actualites`).
2. Letting the publisher's standard `buildPostUrl({ post, primaryTerm })` produce the right URL with zero changes to the URL-building logic.
3. For pages (no category), prefixing the **post slug** itself (since pages live at root).

This trick lets the plugin reuse `publisher.renderHome(shadowCtx, options)` for the localised home — the active theme renders exactly as for primary, just with translated content.

### The render flow

Localised single posts (one per language) are returned from the `publish.additional` filter. The publisher uploads them alongside the primary file and tracks paths via `Post.lastPublishedPathsByLocale` for orphan cleanup.

Localised homes + category archives are returned from `publish.extraListings` (fires inside `regenerateListings`, `regenerateHomeOnly`, and `regenerateAll`). Each enabled language gets its `/<lang>/index.html` and `/<lang>/<cat>/index.html`.

**Critical**: refresh your `pathRegistry` (hreflang lookup) AT THE START of your `publish.additional` / `publish.extraListings` handlers. The `page.head.extra` filter that injects `<link rel="alternate" hreflang>` runs DURING the render — if the registry isn't refreshed before render, the very first publish of a new translation produces a page without hreflang.

### Per-page `<html lang>` (API ≥ 1.2)

Set `currentLocale` in `BaseLayoutProps` when rendering a localised page. The theme's BaseLayout uses it instead of `site.settings.language`. The publisher's `renderHome` accepts a `currentLocale` option that propagates.

### Per-page brand link (API ≥ 1.3)

Set `site.homePath` to `/<lang>/index.html` when rendering a localised page. Themes that use `site.homePath ?? "/index.html"` (recommended pattern in the BaseLayout sample above) get the right link automatically.

### hreflang + canonical + og:locale (Google best practices)

Hook `page.head.extra` (sync). Inject:
```html
<link rel="alternate" hreflang="en" href="https://site.com/news/hello.html" />
<link rel="alternate" hreflang="fr" href="https://site.com/fr/actualites/bonjour.html" />
<link rel="alternate" hreflang="x-default" href="https://site.com/news/hello.html" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:locale:alternate" content="en_US" />
```

Rules: symmetric (each page lists ALL alternates including itself); `x-default` points at the primary language; missing translations are absent (no broken links).

**Do NOT emit a `<link rel="canonical">` from the plugin** — the active theme's `BaseLayout` already emits one (`canonicalUrl(baseUrl, currentPath)`), and the publisher passes the localised `currentPath` (e.g. `fr/soins/bonjour.html`), so the theme's canonical already points at the right per-locale URL. Emitting a second canonical produces a duplicate that Google flags as a soft SEO issue.

**Build hreflang `href`s with `canonicalUrl(baseUrl, path)`, not `pathToPublicUrl(...)`**. `canonicalUrl` strips trailing `index.html`, producing the same clean form (`https://site.com/fr/`) the theme's canonical uses. If your hreflang `href` ends in `/index.html` and the theme's canonical doesn't, Google may treat the pair as a mismatch and ignore the cluster. The same applies to sitemap `<xhtml:link>` alternates and `<loc>` entries — keep every Google-facing URL in the clean form.

**Reciprocity is non-negotiable**: Google ignores the entire hreflang cluster if pages don't symmetrically link back. The plugin's path registry must be refreshed BEFORE rendering — for the primary page, that means using `publish.before` (per-post hook, fires before `renderSingle`) and `regenerate.listings.before` (per-listing-pass hook, fires before `renderHome` / `renderCategory`). The `publish.additional` filter alone is not enough because it fires AFTER the primary is rendered. The publisher fires both hooks consistently across `publishPost`, `regenerateAll`, `repairPublishPaths`, `regenerateListings`, and `regenerateHomeOnly`.

### Sitemap with hreflang alternates

Hook the five sitemap filters in `flexweg-sitemaps`:
- `sitemap.urlset.namespaces` → add `xmlns:xhtml="http://www.w3.org/1999/xhtml"`
- `sitemap.url.entry` → inject `<xhtml:link rel="alternate" hreflang="..." href="..."/>` for each language inside every `<url>`
- `sitemap.urls.extra` → add `<url>` entries for translated paths (each with its own `<xhtml:link>` block)
- `sitemap.index.extra` → add per-language news sitemap references (Google News doesn't support xhtml:link in news sitemaps, so the pattern is one news sitemap per language). **MUST gate on `settings.pluginConfigs["flexweg-sitemaps"]?.newsEnabled === true`** — referencing files that aren't generated produces 404s in the index. flexweg-multilang's handler shows the canonical guard.
- `sitemap.news.locales` (async, API ≥ 1.3.5) → return one `NewsLocaleEntry { language, path, entities: SitemapEntity[] }` per enabled secondary language. `flexweg-sitemaps` applies this when `newsEnabled === true`, builds + uploads each as `sitemap-news-<lang>.xml`. The plugin handles the actual XML — your handler just computes the per-locale entity list (filter posts to the News window, pick the localized URL via `buildLocalizedPostUrl`, skip posts without a translation in the target locale). Pair it with `sitemap.index.extra` so the file references and the file payloads stay in lock-step.

**Per-locale news sitemap caveat — orphan cleanup**: when a user removes a secondary locale from your plugin's config while News stays enabled, the previously-uploaded `sitemap-news-<oldlang>.xml` stays on Flexweg (no longer referenced in the index, no longer regenerated). The current implementation is stateless and doesn't track per-locale paths in plugin config — accept this corner case or persist a `lastNewsLocalePaths: string[]` state field and diff on each regen.

### RSS per language

Generate `/<lang>/feed.xml` + `/<lang>/<cat>/<cat>.xml` per enabled language using `buildRssFeedXml` (exposed via runtime). No need to hook into flexweg-rss — it owns the primary feed; your plugin generates the localised ones at sibling URLs.

### Per-language sidebar data (posts.json / authors.json)

The default theme's `posts-loader.js` fetches `/data/posts.json` + `/data/authors.json` to fill `[data-cms-related]` and `[data-cms-author-bio]` widgets. For localised pages, generate `/<lang>/data/posts.json` + `/<lang>/data/authors.json` with translated entries.

`publishPostsJson` and `publishAuthorsJson` (both exposed via runtime since API 1.3) accept an optional `pathOverride` so you can publish to `<lang>/data/posts.json` without re-implementing the data shape:

```ts
import { publishPostsJson, publishAuthorsJson } from "@flexweg/cms-runtime";

await publishPostsJson(
  { ...ctx.settings, language: "fr" },   // overrides used for date formatting
  shadowPosts,                            // translated posts
  shadowPages,
  shadowTerms,                            // terms with prefixed slugs
  ctx.media,
  "fr/data/posts.json",                   // pathOverride
);
```

The default theme's `posts-loader.js` detects the URL's leading 2-letter segment and fetches the localised file first, falling back to the root file on 404. Custom themes should mirror this pattern.

### Inputs validation: strip `undefined` before writing to Firestore

Firestore rejects `undefined` field values. When building a translation object to persist, ONLY include keys that have a value:

```ts
const entry: PostTranslation = { title, slug, contentMarkdown };
if (excerpt) entry.excerpt = excerpt;
if (seo) {
  const cleanedSeo: PostTranslation["seo"] = {};
  if (seo.title) cleanedSeo.title = seo.title;
  if (seo.description) cleanedSeo.description = seo.description;
  if (Object.keys(cleanedSeo).length) entry.seo = cleanedSeo;
}
```

Same constraint applies anywhere you write nested data via `updatePost` / `updateTerm` — top-level `undefined` is filtered by the dispatcher but nested `undefined` slips through and Firestore rejects the write.

### Regenerate paths that need locale awareness

If you're contributing to the publisher / a plugin that already integrates with multilang, three regenerate entry points fire the relevant hooks:
- `regenerateListings` → fires `publish.extraListings` (localised homes + archives)
- `regenerateHomeOnly` → fires `publish.extraListings`
- `regenerateAll` → fires `publish.additional` per post + `publish.extraListings` for listings

`publishPost` / `unpublishPost` / `deletePostAndUnpublish` all fire the relevant hooks already. Plugin authors don't need to invoke these directly.

### Importer hooks for multilingual bundles

The built-in **Flexweg Import** plugin (`src/mu-plugins/flexweg-import/`) ships native multilang support so demo content + WP imports populate `Post.translations` / `Term.translations` automatically when the multilang plugin is installed (and harmlessly when it isn't). The conventions:

- **Post / page sidecars**: `<name>.<lang>.md` next to `<name>.md`. The sidecar's frontmatter only needs `title`, `slug`, `excerpt`, `seoTitle`, `seoDescription` — category, tags, hero image, author + dates are shared with the primary. The importer pairs by filename prefix and writes `Post.translations[<lang>] = { title, slug, contentMarkdown, excerpt?, seo? }`.
- **Term translations**: optional `_terms.json` at the bundle root. Top-level keys group by `categories` / `tags`, nested keys match the primary-language name from each entry's frontmatter, and each language carries `{ name, slug, description? }`. The importer applies these via `updateTerm` AFTER creating each term. Only terms actually referenced by an imported post get an attempt; unused entries produce a non-blocking warning.
- **Firestore safety**: the parser writes the translation entry WITHOUT undefined fields. `description` is only included when explicitly provided. Otherwise Firestore rejects the nested `undefined` and the whole `updateTerm` call fails silently (warning surfaces but no translation lands).
- **CreatePostInput** accepts an optional `translations: Record<string, unknown>` so the import path doesn't need a second pass. The dispatcher serialises it on Firestore + SQLite alike.

When authoring a demo bundle, ship the sidecars + `_terms.json` even if you don't expect every install to enable multilang — the data lays dormant until the plugin is activated.

### Theme multilang compatibility checklist

Multi-language sites work out of the box for content + SEO with any theme that uses the standard `BaseLayoutProps` shape. But for the FULL experience (right brand link, breadcrumb, sidebar widgets) themes need to opt into three small contracts:

| Contract | What to do | Where in the default theme |
|---|---|---|
| **`<html lang>` per page** | Use `currentLocale ?? site.settings.language` in `BaseLayout` | `templates/BaseLayout.tsx` |
| **Brand link respects locale** | Use `site.homePath ?? "/index.html"` for the logo / brand anchor in Header (and Footer if it has one) | `components/Header.tsx` |
| **Breadcrumb's "Home" entry** | Use `site.homePath ?? "/index.html"` for any link labelled Home / Accueil / etc. in Single + Category + Catalog + Catalog-style templates | `templates/SingleTemplate.tsx` line ~33 |
| **Translated "Home" label** | Look up the label via `publicT("breadcrumb.home", { defaultValue: "Home" })` (or `t("publicBaked.home")` in themes that already use that namespace) — the theme's i18n bundle defines the per-locale strings | `i18n.ts` (each locale's `breadcrumb.home`) |
| **Sidebar widget data file** | The `posts-loader.js` script that fetches `/data/posts.json` + `/data/authors.json` must detect a leading `/<2-letter>/...` URL segment and prefer `/<lang>/data/<file>.json` first (falling back to root on 404). The multilang plugin generates the localised files on every publish. | `posts-loader.js` — `detectLocalePrefix()` + `fetchWithLocaleFallback()` |
| **Per-language menu labels** | `menu-loader.js` reads `document.documentElement.lang` and prefers `item.labels[lang]` over `item.label` for each `ResolvedMenuItem`. Region-stripped fallback (`fr-CA` → `fr`). The admin edits these inline on the Menus page when secondary languages are enabled; the resolver projects them into `menu.json`. Mono-lingual sites get no `labels` field and the loader falls through to the primary `label` — no breaking change. | `menu-loader.js` — `pickLabel(item)` helper |

All five in-tree themes (default, magazine, corporate, storefront, portfolio) are now multilang-aware. Copy these patterns when authoring a new theme.

The publisher passes `currentLocale` and `homePath` automatically — themes that follow the checklist need NO multilang-specific code. The plugin stays generic; themes stay generic; the publisher wires them together at render time.

### Reference implementation

`external/plugins/flexweg-multilang/` ships with:
- `src/editor/variantProvider.ts` — `registerEditorVariantProvider` setup
- `src/editor/TermTranslationsSection.tsx` — `registerTermEditorSection` setup
- `src/publisher/computeAdditional.ts` — `publish.additional` handler
- `src/publisher/computeExtraListings.ts` — `publish.extraListings` handler
- `src/publisher/render.ts` — shadow ctx + `renderHome` delegation trick
- `src/publisher/sitemap.ts` — 4 sitemap handlers
- `src/publisher/feeds.ts` — per-language RSS
- `src/publisher/localizedJson.ts` — per-language `data/posts.json` + `data/authors.json`
- `src/core/hreflang.ts` — hreflang HTML + sitemap alternates XML builders
- `src/core/pathRegistry.ts` — module-level cache for `page.head.extra`

Copy these patterns when you build per-locale or per-variant features.

---

## Hook reference (the public surface)

### Filters (transform a value)

| Hook | Sync/Async | Payload |
|---|---|---|
| `post.markdown.before` | async | `(markdown: string, post: Post) => string` |
| `post.html.body` | async | `(html: string, post: Post) => string` — themes use this to expand block markers |
| `post.template.props` | async | `(props, post) => props` |
| `page.head.extra` | sync | `(html: string, baseProps) => string` — replaces the head sentinel |
| `page.body.end` | sync | `(html: string, baseProps) => string` — replaces the body-end sentinel |
| `menu.json.resolved` | async | `(menu, ctx) => menu` — mutate the resolved `{ header, footer }` before upload |
| `publish.additional` | async (API ≥ 1.2) | `(extra: AdditionalRender[], post, ctx) => AdditionalRender[]` — return extra `{path, html}` pairs the publisher uploads alongside the primary file. Used by multilang to publish translated variants in the same publish pass. Cleanup of paths the plugin no longer returns goes through `Post.lastPublishedPathsByLocale` + the publisher's standard orphan logic. |
| `publish.extraListings` | async (API ≥ 1.2) | `(extra: AdditionalListingRender[], ctx) => AdditionalListingRender[]` — same idea but for listing files (home / category archives). Fires inside `regenerateListings`, `regenerateHomeOnly`, and `regenerateAll`. |
| `sitemap.urlset.namespaces` | sync (API ≥ 1.2) | `(ns: Record<string,string>, ctx) => Record<string,string>` — add XML namespace attrs to the `<urlset>` element (e.g. `xmlns:xhtml`). |
| `sitemap.url.entry` | sync (API ≥ 1.2) | `(innerXml: string, ctx: { entity, baseUrl, path, lastmodMs }) => string` — return extra XML to inject INSIDE each `<url>` (e.g. `<xhtml:link rel="alternate" hreflang="...">` blocks). |
| `sitemap.urls.extra` | sync (API ≥ 1.2) | `(extra: SitemapExtraUrl[], ctx: { posts, pages, terms, settings, year, scope }) => SitemapExtraUrl[]` — add extra `<url>` entries to the yearly sitemap (e.g. translated paths). |
| `sitemap.index.extra` | sync (API ≥ 1.2) | `(extra: SitemapIndexExtraEntry[], ctx: { settings }) => SitemapIndexExtraEntry[]` — add extra `<sitemap>` references to sitemap-index.xml (e.g. per-language news sitemaps). Gate per-locale news refs on `settings.pluginConfigs["flexweg-sitemaps"]?.newsEnabled === true` so the index never advertises files that won't be generated. |
| `sitemap.news.locales` | async (API ≥ 1.3.5) | `(extra: NewsLocaleEntry[], ctx: { posts, pages, terms, settings, config: SitemapsConfig }) => NewsLocaleEntry[]` — return one `{ language, path: "sitemaps/sitemap-news-<lang>.xml", entities: SitemapEntity[] }` per enabled secondary language. flexweg-sitemaps applies this when `newsEnabled === true` and uploads one news sitemap per entry. Pair with `sitemap.index.extra` so file payloads + index refs stay in lock-step. |

### Actions (side effects, fire-and-forget)

| Hook | Payload | When |
|---|---|---|
| `publish.before` | `(post, ctx)` (API ≥ 1.3.3 — older fired with just `post`) | Fires BEFORE `renderSingle`. Use this when your plugin needs to seed a module-level cache that `page.head.extra` will read during the same publish (e.g. multilang's `pathRegistry` for hreflang). Also fires per-post inside `regenerateAll` and `repairPublishPaths`. |
| `publish.after` | `(post, ctx)` | After upload, before listings refresh |
| `publish.complete` | `(post, ctx)` | After upload + listings + menu.json all updated |
| `post.unpublished` | `(post, ctx)` | After `unpublishPost` wipes the post's files |
| `post.deleted` | `(post, ctx)` | After `deletePostAndUnpublish` removes the post |
| `regenerate.listings.before` | `(ctx)` (API ≥ 1.3.3) | Fires BEFORE `renderHome` / `renderCategory` inside `regenerateListings` AND `regenerateHomeOnly`. Same use case as `publish.before` but for listing-only regeneration paths invoked from the theme's Regenerate menu (no specific post in scope). |

`ctx` is a `PublishContext` with `posts`, `pages`, `terms`, `media`, `settings` — already patched to reflect the just-completed transition. Plugins use it to recompute derived files (sitemaps, search indexes, RSS feeds).

---

## Project conventions you should respect

- **Slugs** are lower-case ASCII, dash-separated. Flexweg is case-sensitive — uppercase slugs cause real 404s.
- **Backend-agnostic** — never import `firebase/firestore`, `firebase/auth`, or anything under `services/firebase/` / `services/flexweg-sqlite/` directly. Consume the dispatcher-routed exports from `@flexweg/cms-runtime` (`useCmsData`, `fetchAllPosts`, `subscribeToTerms`, `uploadFile`, etc.) so the same .zip works on Firebase + SQLite sites. The runtime exposes `getBackendKind()` if you genuinely need to branch (rare).
- **No data reads in theme code**. The publisher resolves everything into plain props before rendering — themes get serialized data, not subscriptions.
- **Comments and READMEs in English** (the project convention).
- **UI strings go through `t()`** with the `useTranslation('<plugin-id>')` namespace.
- **Stable-DOM submit buttons** — if your settings page has a `<form>` with a save button that toggles a `<Loader2>` spinner, use the always-rendered-with-`className="hidden"`-toggle pattern (not conditional mount). Add `data-form-type="other"` on the form. Without this, browser extensions (1Password, Grammarly, etc.) that inject DOM into the form crash the admin with `Node.insertBefore: Child to insert before is not a child of this node` on save. See any CMS settings page for the canonical shape.

## Working examples (when the user has the repo checked out locally)

Ready-to-copy scaffolds live under `external/` in the admin repo:

- `external/plugins/hello-plugin/` — minimal plugin (head meta + dashboard card)
- `external/plugins/flexweg-multilang/` — **reference multi-language plugin**: variant provider for the editor, per-locale URLs, hreflang SEO, sitemap alternates, per-language RSS feeds, per-language sidebar data. Read its `src/publisher/` modules for the canonical patterns.
- `external/themes/minimal-theme/` — minimal theme (six templates + hand-written CSS)
- `external/themes/marketplace-core/` — full theme with custom blocks, settings page, font + palette overrides, runtime CSS regeneration via `compileCss`

Full authoring docs: `docs/creating-a-plugin.md`, `docs/creating-a-theme.md`, `docs/runtime-api-reference.md`.

## Build pipelines — which ZIP to upload

Plugins shipped under `external/plugins/<id>/` have TWO build pipelines that can drift if you're not careful:

1. **Root `npm run build`** (recommended) — produces `dist/packs/plugins/<id>.zip` AND copies the bundle into `dist/admin/plugins/<id>/` for the bundled-defaults registry. This is the authoritative artifact: it's built from the latest source whenever the CMS is rebuilt.
2. **Per-plugin `npm run build`** (inside `external/plugins/<id>/`) — produces a standalone `external/plugins/<id>/<id>.zip`. Only rebuilt when you run the per-plugin script.

If you change the plugin's source code, run the ROOT build to get the up-to-date ZIP. The per-plugin script is mainly useful for shipping the ZIP independently of a CMS deploy.

When in doubt: `unzip -p <zip> manifest.json` to verify the version inside matches your latest source.

---

## When to stop using this skill

This skill is for **authoring external plugins, themes, and demo content for Flexweg CMS**. Exit cleanly if the user asks about:

- Configuring an existing Flexweg site (use the admin UI directly)
- Internal admin development (in-tree work — refer to the admin's `CLAUDE.md`)
- Firebase / Firestore / Flexweg API authentication (covered by the admin's own setup flow)
- General React / Vite / Tailwind questions unrelated to Flexweg constraints
