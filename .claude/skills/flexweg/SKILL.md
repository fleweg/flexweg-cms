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
| `apiVersion` | yes | Runtime API version this bundle was built against. Admin refuses to load if outside `[FLEXWEG_API_MIN_VERSION, FLEXWEG_API_VERSION]`. Current is `1.0.0`. |
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
  };
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
import type { BaseLayoutProps } from "../types/cms-runtime";

export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  currentPath,
  children,
}: BaseLayoutProps) {
  const lang = site.settings.language ?? "en";
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <link rel="stylesheet" href={`/theme-assets/${"my-theme"}.css`} />
        {/* MANDATORY sentinel — plugins inject head tags here */}
        <meta name="x-cms-head-extra" />
      </head>
      <body>
        {children}
        {/* MANDATORY sentinel — plugins inject body-end scripts here */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
```

Replace `"my-theme"` with your actual theme id (or read it from props if you want it dynamic).

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

### Actions (side effects, fire-and-forget)

| Hook | Payload | When |
|---|---|---|
| `publish.before` | `(post, ctx)` | Before any work starts |
| `publish.after` | `(post, ctx)` | After upload, before listings refresh |
| `publish.complete` | `(post, ctx)` | After upload + listings + menu.json all updated |
| `post.unpublished` | `(post, ctx)` | After `unpublishPost` wipes the post's files |
| `post.deleted` | `(post, ctx)` | After `deletePostAndUnpublish` removes the post |

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

Three ready-to-copy scaffolds live under `external/` in the admin repo:

- `external/plugins/hello-plugin/` — minimal plugin (head meta + dashboard card)
- `external/themes/minimal-theme/` — minimal theme (six templates + hand-written CSS)
- `external/themes/marketplace-core/` — full theme with custom blocks, settings page, font + palette overrides, runtime CSS regeneration via `compileCss`

Full authoring docs: `docs/creating-a-plugin.md`, `docs/creating-a-theme.md`, `docs/runtime-api-reference.md`.

---

## When to stop using this skill

This skill is for **authoring external plugins, themes, and demo content for Flexweg CMS**. Exit cleanly if the user asks about:

- Configuring an existing Flexweg site (use the admin UI directly)
- Internal admin development (in-tree work — refer to the admin's `CLAUDE.md`)
- Firebase / Firestore / Flexweg API authentication (covered by the admin's own setup flow)
- General React / Vite / Tailwind questions unrelated to Flexweg constraints
