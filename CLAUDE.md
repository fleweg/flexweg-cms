# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start admin SPA at http://localhost:5173
npm run typecheck    # tsc --noEmit (runs automatically before `build`)
npm test             # Vitest, single run
npm run test:watch   # Vitest, watch mode
npx vitest run src/core/slug.test.ts    # Run a single test file
npm run build        # Vite build → dist/admin/, then compiles each theme's SCSS into dist/theme-assets/<id>.css
```

`.env` is required (copy `.env.example`); without `VITE_FIREBASE_*` and `VITE_ADMIN_EMAIL` the admin renders a configuration error screen instead of mounting.

`npm install` requires `--legacy-peer-deps` because `react-i18next` declares an optional peer on TypeScript 5 while this project pins TypeScript 6 (matches the `kanban` sibling project). The peer is optional, the install is safe.

## What this app actually is

The admin SPA is the *only* runtime. Flexweg hosts static files only — there is no server. When an admin clicks **Publish** on a post:

1. The admin reads everything from Firestore (posts, terms, media, settings).
2. It runs the active theme's React components through `react-dom/server.renderToStaticMarkup` *inside the browser*.
3. The resulting HTML is POSTed to Flexweg's Files API at the post's target path.

The "public site" is just whatever HTML/CSS/asset files the admin has uploaded. There is no SSR server, no edge function, no build step that touches the public site — every public file is the result of an explicit admin action.

The admin SPA itself is deployed once to `/admin/` on Flexweg; per-content-change uploads go to other paths via the API.

## Architecture

### Two parallel worlds

- **Admin world** (`src/components/`, `src/pages/`, `src/context/`, most of `src/services/`): React + Tailwind UI that talks to Firestore. Uses `HashRouter` so deploying under `/admin/` requires no rewrite rules. Tailwind-only styling; the admin never imports theme SCSS.
- **Public world** (`src/themes/`): React components rendered to a string at publish time. **Theme components must only accept serializable props** — no Firestore hooks, no admin context. The `publisher.ts` resolver builds plain props (URLs, MediaView shapes, ResolvedMenuItems) before handing them to templates.

These worlds share `src/core/` (types, slug, markdown, render, plugin registry).

### The publish pipeline

`services/publisher.ts` is the orchestrator. The main entry points are `publishPost`, `unpublishPost`, `regenerateListings`, `regenerateAll`. The publisher:

- Loads everything via `buildPublishContext` (posts, pages, terms, media — media is fetched ad-hoc via `listAllMedia` rather than carried in `CmsDataContext` because it can be large).
- Resolves URLs through `core/slug.ts` (`buildPostUrl`, `buildTermUrl`). URL strategy is locked: `<category>/<post>.html`, `<page>.html`, `<category>/index.html`. Tags are never URL prefixes.
- Renders Markdown via `core/markdown.ts` (DOMPurify-sanitized `marked` output).
- Wraps the rendered body in the theme template via `core/render.tsx`.
- Hashes the result (`sha256Hex`); skips upload if `lastPublishedHash` already matches.
- On slug/category change, deletes every known stale path before uploading the new one (see Stale path cleanup below).
- Cascades: every publish/unpublish also re-renders the home page and every category archive (so listings stay in sync). `regenerateAll` adds throttling (75 ms between uploads) to avoid hammering the API.

`Post.lastPublishedPath` and `Post.lastPublishedHash` are the source of truth for "where is this post live right now?" and "did anything change since last publish?". `Post.previousPublishedPaths[]` holds paths whose deletion failed on a previous publish — they get retried automatically. All three are written through `markPostOnline` / `markPostDraft`.

### Slug uniqueness & stale path cleanup

Two pieces work in concert to keep the public site coherent under edits:

1. **Slug uniqueness** — `core/slug.ts` exposes `detectPathCollision` (cross-checks a candidate path against every post / page / category) and `findAvailableSlug` (appends `-2`, `-3`, … until free). Auto-slug for new entities deduplicates silently; user-edited slugs surface an inline error and disable the Save button. Always compare on the **final URL path**, never the raw slug — two slugs may match without colliding (a post slug and a category slug can be identical because their URLs differ).

2. **Stale path cleanup** (`cleanupStalePaths` in `publisher.ts`) — before uploading the new file, the publisher iterates `[lastPublishedPath, ...previousPublishedPaths]`, attempts `deleteFile` on each that isn't the new path (404 silent), and persists any non-404 failures back into `previousPublishedPaths` so the next publish retries them. `unpublishPost` uses the same helper with `keepPath: ""` to wipe everything.

When adding a new code path that moves a post's URL, route through `publishPost` rather than calling the upload primitives directly — `publishPost` ensures the cleanup pass runs.

### Toast notifications

`lib/toast.ts` is a tiny module-level event emitter. Anywhere in the codebase (including services, which can't reach React contexts), calling `toast.error("…")` / `toast.success(…)` / etc. dispatches to whichever subscribers are mounted. The `<ToastContainer>` (in `components/ui/`) is rendered once near the App root and renders the live stack of toasts in the top-right corner with auto-dismiss.

`services/flexwegApi.ts` wraps every fetch through a single `performRequest(action, fetcher)` helper that funnels HTTP non-2xx results and network/CORS failures into both a thrown `FlexwegApiError` and a translated toast. Status-specific messaging (401/403/404/413/429/5xx) lives in `flexweg.errors.*` of the i18n bundles. Two suppressions are intentional: 404 on `deleteFile` / `deleteFolder` (already-gone == desired state), and `AbortError` (user cancellation).

Keep this in mind when adding new Flexweg endpoints: route them through `performRequest` so error UX stays consistent. Do NOT call `fetch` against Flexweg directly from feature code — pipe through this module.

### Dynamic menus

Header / footer menus are **not** rendered into the HTML at publish time. The publisher does still resolve them (for completeness on the `SiteContext`) but the public-facing flow is:

1. Whenever menus change in admin (or a referenced post / term changes slug or category), `services/menuPublisher.ts.publishMenuJson` re-uploads `/menu.json` to the public site root with the resolved tree.
2. The active theme ships a runtime loader (e.g. `themes/default/menu-loader.js`) embedded in the bundle via `import jsText from "./menu-loader.js?raw"`. The build pipeline writes it to `dist/theme-assets/<id>-menu.js` and `BaseLayout` references it via `<script defer>`.
3. The loader reads `[data-cms-menu="header|footer"]` containers, fills their inner `<ul>` from `menu.json`, sets `aria-current="page"` on path matches, and (in the default theme) wires the burger toggle.

Cascade points that re-publish `menu.json`: `MenusPage` save, `publishPost`, `unpublishPost`, `deletePostAndUnpublish`, `regenerateAll`. All call into the same `republishMenu(ctx, log)` helper inside `publisher.ts`. Failures are best-effort: logged + toasted (via flexwegApi's funnel) but never abort the parent operation.

When adding a new theme that wants its own menu UX: declare `jsText` on the manifest (with a `?raw` import), drop empty `[data-cms-menu]` containers in your `Header.tsx` / `Footer.tsx`, and the dynamic behavior comes for free. The shared resolver in `core/menuResolver.ts` is the single source of truth — both the static publish path and the JSON publisher call it, so they can never disagree.

### Image pipeline

Uploads go through a browser-only multi-variant pipeline (`services/imageProcessing.ts` + `services/media.ts`). Per asset, the canvas API resizes to every format declared by the active theme **plus** two admin-only formats (`admin-thumb`, `admin-preview` from `services/imageFormats.ts`). All variants are encoded as WebP (or whatever `outputFormat` the theme chose), uploaded under `media/<yyyy>/<mm>/<slug>-<hex>/<variant>.<ext>`, and recorded under a single `media/{id}` Firestore doc with a `formats` map.

The original file is never stored. Implications:

- Switching to a theme that asks for a larger format than was generated cannot regenerate from the original. The `pickFormat(view, name)` helper in `core/media.ts` falls back through requested → default → largest available → empty string, so templates stay safe.
- The slug normaliser (`normalizeMediaSlug` in `core/slug.ts`) appends a 6-char random hex suffix to every upload — collisions are impossible by construction, so we never overwrite another asset's variant folder.
- Deletion uses `DELETE /files/delete-folder` (the whole asset folder) instead of per-file calls.

Old media uploaded before this pipeline existed keeps the legacy `{ url, storagePath }` shape. `mediaToView` and `pickMediaUrl` synthesise a `legacy` format on the fly so admin UI and theme code never branch on the shape — they just call the helpers.

### Theme system

Each theme exports a `manifest.ts` with `id`, `version`, `scssEntry`, and a `templates` map (`base | home | single | category | author | notFound`). Themes are registered statically in `src/themes/index.ts` so they're all bundled into the admin (enables instant preview switching).

The SCSS pipeline is split deliberately:

- **Inside the admin bundle**: each theme manifest imports its SCSS via Vite's `?inline` suffix (e.g. `import cssText from "./theme.scss?inline"`). Vite compiles the SCSS at build time and exposes the resulting CSS as a string on `manifest.cssText`. This is what the **Themes → Sync theme assets** button uploads to Flexweg via the Files API — so the admin always pushes the CSS that was built alongside its current code, regardless of what's currently sitting in `/theme-assets/` on the public site.
- **Standalone files**: `scripts/build-themes.mjs` runs after `vite build` and writes the same compiled CSS into `dist/theme-assets/<id>.css`. This folder is intended for the *first* deployment (drop it onto Flexweg's site root once), or for environments where the user wants to bypass the admin's sync button.

Vite outputs the admin into `dist/admin/` (set via `build.outDir` in `vite.config.ts`). Public theme CSS lives at `dist/theme-assets/`, which mirrors its target Flexweg path `/theme-assets/<id>.css` — exactly where every published page's `<link rel="stylesheet">` points. **Never** put theme CSS under `/admin/...` on the public site: published pages do not reference that path.

#### The head-extra sentinel

Plugins can inject `<head>` markup via the `page.head.extra` filter. React can't represent raw HTML inside `<head>` cleanly via JSX, so themes' `BaseLayout` emits a sentinel `<meta name="x-cms-head-extra" />` and `core/render.tsx` does a string replace post-render. **Any custom theme's BaseLayout must include this sentinel** or plugins like `core-seo` will silently no-op.

#### Theme settings page

Each theme can declare an optional settings page via `ThemeManifest.settings = { navLabelKey, defaultConfig, component }`. The infrastructure mirrors the plugin settings convention:

- **Storage**: `settings.themeConfigs[themeId]` (helper: `updateThemeConfig` in `services/settings.ts`). Survives theme switches so re-activating a previously-configured theme keeps its settings intact.
- **Route**: `/theme-settings` (top-level, not nested under `/settings`). `pages/ThemeSettingsRoute.tsx` resolves the active theme's manifest, merges `defaultConfig` with the stored value, and hands the component `{ config, save }`.
- **Sidebar entry**: rendered conditionally in `Sidebar.tsx` based on `getActiveTheme(activeThemeId).settings`. Switching themes hides/shows it automatically.
- **i18n**: bundles declared via `ThemeManifest.i18n` are loaded by `themes/index.ts.loadThemeTranslations()` into the namespace `theme-<id>` so theme settings pages call `useTranslation("theme-<id>")`.
- **Publish-time access**: the resolved config is exposed as `site.themeConfig` on `SiteContext`, so theme templates can react to user settings without lookups.
- **Tabs**: a theme concern, not the CMS's. The default theme's settings page renders its own tab strip.

Logo branding pattern (default theme): the theme's settings page uploads a resized WebP to `theme-assets/<id>-logo.webp` and stores `{ logoEnabled, logoUpdatedAt }`. The publisher resolves these into `MenuJson.branding.logoUrl` (cache-busted via `?v=<logoUpdatedAt>`); `menu-loader.js` swaps the static text wordmark inside `[data-cms-brand]` with an `<img>`. So updating the logo writes only one small JSON (`data/menu.json`) plus the logo binary — no post-HTML rewrites needed.

### Plugin system

`core/pluginRegistry.ts` is a WordPress-style filter/action registry. Filters mutate values in priority order; actions are side effects that all run. Plugins live in `src/plugins/<id>/`, register through a `manifest.register(api)` callback, and are listed in `src/plugins/index.ts`.

`applyPluginRegistration(enabledFlags)` runs in `CmsDataContext` every time settings change. It calls `resetRegistry()` first, so toggling a plugin off/on is enough to live-reapply registrations without a reload.

Hooks currently exposed by core: `post.markdown.before`, `post.html.body`, `post.template.props`, `page.head.extra` (sync only), `menu.json.resolved`, `publish.before`, `publish.after`, `publish.complete`, `post.unpublished`, `post.deleted`. The three lifecycle actions (`publish.complete`, `post.unpublished`, `post.deleted`) all receive `(post, ctx)` where `ctx` is the exported `PublishContext` from `services/publisher.ts`, **already patched** by `applyPostStatusInCtx` to reflect the just-completed transition. Plugins reading `ctx.posts` / `ctx.pages` see what the public site looks like *after* the action, never the pre-state.

`menu.json.resolved` runs inside `services/menuPublisher.ts.publishMenuJson` just before the upload, with payload `(menu: MenuJson, ctx: MenuFilterContext)` where `MenuFilterContext = { settings, posts, pages, terms }`. Plugins can append, replace, or reorder header/footer entries — everything that ends up in `/menu.json` flows through this filter. The flexweg-rss plugin uses it to inject footer entries for each RSS feed where `addToFooter === true` (no MenusPage edit required).

Add more hooks by calling `applyFilters` / `doAction` in publisher or render. When extending, mirror the existing pattern: actions take `(payload, ctx)` so handlers don't need ad-hoc data fetching.

#### Plugin settings pages and i18n

`PluginManifest` has two optional fields beyond `register`:

- `settings: { navLabelKey, defaultConfig, component }` — declares a config page rendered at `/settings/plugin/<id>`. The `SettingsLayout` renders a tab strip with one entry per enabled-plugin-with-settings; `PluginSettingsRoute` resolves the `:pluginId` param to a manifest, merges `defaultConfig` with whatever's in `settings.pluginConfigs.<id>`, and hands the result to the component along with a `save(next)` helper. Storage path: nested-map merge into `settings/site.pluginConfigs.<id>` via `updatePluginConfig` — the same Firestore subscription that drives `CmsDataContext` reaches plugin configs, no extra listeners.
- `i18n: { en, fr }` — bundled translations loaded by `loadPluginTranslations()` at module import time into a dedicated i18next namespace named after the plugin id. Plugin UI calls `useTranslation('<plugin-id>')` to scope its keys. Bundles are loaded once regardless of plugin enable state (cheap, orthogonal to the runtime registration).

Inside an action-hook handler, the live config is at `ctx.settings.pluginConfigs?.[<plugin-id>]` — already up-to-date because `ctx` is built fresh per publish action via `buildPublishContext`.

#### Built-in plugins

- **`core-seo`** — minimal: Twitter Card meta tags + a `<meta name="generator">` hint via `page.head.extra`. No config.
- **`flexweg-sitemaps`** — owns `sitemap-<year>.xml`, `sitemap-index.xml`, optional `sitemap-news.xml`, `robots.txt`, plus two XSL stylesheets (`sitemap.xsl`, `sitemap-news.xsl`). Subscribes to `publish.complete`, `post.unpublished`, `post.deleted` to incrementally regenerate the year sitemap that contains the touched post (computed from `post.createdAt`, fallback to `publishedAt` then `updatedAt`) plus the index plus News. Years that empty out get their sitemap deleted from the public site so the index never references stale files. The settings page (`/settings/plugin/flexweg-sitemaps`) exposes content-type filter (posts vs posts+pages), News toggle + window in days (default 2), an editable `robots.txt` with **Insert default**, **Upload stylesheets**, and a **Force regenerate** button that rebuilds everything (XSL + sitemaps + robots). Generator code in `src/plugins/flexweg-sitemaps/generator.ts` uploads through `flexwegApi.uploadFile` / `deleteFile` so all error handling and toasts flow through the standard funnel. **Skip silently when `settings.baseUrl` is empty** — sitemap URLs need an absolute origin and we'd rather noop than upload garbage.

  XSL handling: each sitemap file emits an `<?xml-stylesheet type="text/xsl" href="<baseUrl>/sitemap{,-news}.xsl"?>` PI just below the XML declaration. The PI is invisible to crawlers but transforms the file into a styled HTML table when a browser opens the URL directly. The XSL strings are built in `src/plugins/flexweg-sitemaps/xsl.ts` with EN/FR labels picked from `settings.language` (prefix match — `fr-CA` resolves to FR, anything else to EN). Lifecycle hooks **never** re-upload the XSL files (they change rarely; saving 2 uploads per publish is worth it). Refresh them via **Upload stylesheets** or **Force regenerate** — both also delete `sitemap-news.xsl` when News is disabled so the public site stays clean.

- **`flexweg-rss`** — RSS 2.0 feeds at `/rss.xml` (site-wide) and `/<slug>/<slug>.xml` (per category). Subscribes to `publish.complete`, `post.unpublished`, `post.deleted` and only regenerates the impacted feeds — the site feed (skipped when `post.primaryTermId` is in `excludedTermIds`) and the matching category feed (when one exists for the post's `primaryTermId`). Persists `lastPublishedPath` after each upload through `updatePluginConfig` so a later category-slug rename deletes the old file before uploading at the new path. Item descriptions use `post.excerpt` when non-empty, otherwise `markdownToPlainText(content, 300)`. Sort: `publishedAt DESC` with `updatedAt`/`createdAt` fallbacks. Posts with a `heroMediaId` get an `<enclosure>` element (variant `large` → `defaultFormat` → first available, same chain as `og:image`); legacy single-URL media is handled by the same helper. Generator in `src/plugins/flexweg-rss/generator.ts` accepts `media` as either `Media[]` (from `useCmsData`) or `Map<string, Media>` (from `PublishContext`) and normalizes internally. XSL in `xsl.ts` (one stylesheet shared across site + category feeds, rendered via `<?xml-stylesheet?>`).

  Footer integration: registers a handler on the `menu.json.resolved` filter that appends one `ResolvedMenuItem` per feed where `addToFooter === true`. Labels come from the plugin's i18n bundle (`footerLabels.site` = "RSS", `footerLabels.category` = "RSS — {{name}}", interpolated manually since the filter runs without a `t()` instance). Items append at the **end** of the existing footer — there's no reordering UI; users wanting custom placement should leave the checkbox off and add the URL by hand in MenusPage.

  The settings page Save handler patches `settings.pluginConfigs["flexweg-rss"]` and immediately re-runs `publishMenuJson(patchedSettings, posts, pages, terms)` so the footer reflects the new state without waiting for the Firestore subscription to echo back. The same pattern is used by Force regenerate. **Skip silently when `settings.baseUrl` is empty** — feed URLs need an absolute origin.

### Firestore data model

Collections: `posts` (both posts and pages, distinguished by `type`), `terms` (categories + tags), `media`, `users`, `settings/site` (singleton), `config/flexweg` (singleton with API key, separate from settings so the rules can be stricter on it).

`users/{uid}.preferences.adminLocale` holds each user's admin language preference. New users are created with `role: "editor"`, `adminLocale: "en"` by `ensureSelfUserRecord`. The bootstrap admin (matching `VITE_ADMIN_EMAIL`) is treated as admin without needing the role field — Firestore rules must mirror this.

Subscriptions in `services/posts.ts` filter by `type` server-side, so `CmsDataContext` runs two listeners (posts, pages). Composite indexes on `(type, updatedAt desc)` are required in production.

### Two languages, two scopes

- **Admin UI language** (`src/i18n/`): per-user, EN/FR. Resolution order: `users.preferences.adminLocale` → `localStorage.adminLocale` → `navigator.language` → `"en"`. Changes flow through `setActiveLocale` (updates i18next + localStorage) plus `setUserPreferences` (Firestore). All translation keys are in English; `en.json` is the source of truth.
- **Public site language** (`settings.language`): per-site, BCP-47 string injected into `<html lang>` of every published page by `BaseLayout`. Independent from the admin UI language.

## Conventions

- Slugs everywhere: lower-case ASCII, dash-separated. `core/slug.ts.slugify` enforces this; `isValidSlug` is the validator. Flexweg is case-sensitive — uppercase slugs cause real 404s in production.
- All comments and the README are in English. UI strings in user-facing components must go through `t()`.
- Theme components import from `../../types` (relative to `src/themes/`), not from `../../core/types` directly. The `types.ts` re-exports core types and adds theme-specific view shapes (`MediaView`, `AuthorView`, `ResolvedMenuItem`).
- Don't add Firestore reads to theme code. The publisher's job is to resolve everything into plain props before rendering.
- The Flexweg API key sits in Firestore (`config/flexweg`). Any signed-in admin can read it via devtools — acceptable for an internal tool, not for a multi-tenant deployment.

## Patterns intentionally reused from the sibling `kanban` project

`services/firebase.ts`, `services/auth.ts`, `services/flexwegConfig.ts`, `context/AuthContext.tsx`, `<RequireAdmin>` guard, dark-mode anti-FOUC inline script in `index.html`, `vite.config.ts` (`base: "./"`), Tailwind config — all near-verbatim from `/Users/fredleaux/Sites/flexweg/kanban/`. When extending auth/users patterns, look there first; when changing them, consider the impact on consistency between projects.

The CMS adds the `users.preferences.adminLocale` field that kanban doesn't have, so the user record schema is a strict superset.
