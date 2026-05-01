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
- On slug/category change, deletes the old Flexweg path before uploading the new one.
- Cascades: every publish/unpublish also re-renders the home page and every category archive (so listings stay in sync). `regenerateAll` adds throttling (75 ms between uploads) to avoid hammering the API.

`Post.lastPublishedPath` and `Post.lastPublishedHash` are the source of truth for "where is this post live right now?" and "did anything change since last publish?". The publisher reads/writes them through `markPostOnline` / `markPostDraft`.

### Theme system

Each theme exports a `manifest.ts` with `id`, `version`, `scssEntry`, and a `templates` map (`base | home | single | category | author | notFound`). Themes are registered statically in `src/themes/index.ts` so they're all bundled into the admin (enables instant preview switching).

The SCSS pipeline is split deliberately:

- **Inside the admin bundle**: each theme manifest imports its SCSS via Vite's `?inline` suffix (e.g. `import cssText from "./theme.scss?inline"`). Vite compiles the SCSS at build time and exposes the resulting CSS as a string on `manifest.cssText`. This is what the **Themes → Sync theme assets** button uploads to Flexweg via the Files API — so the admin always pushes the CSS that was built alongside its current code, regardless of what's currently sitting in `/theme-assets/` on the public site.
- **Standalone files**: `scripts/build-themes.mjs` runs after `vite build` and writes the same compiled CSS into `dist/theme-assets/<id>.css`. This folder is intended for the *first* deployment (drop it onto Flexweg's site root once), or for environments where the user wants to bypass the admin's sync button.

Vite outputs the admin into `dist/admin/` (set via `build.outDir` in `vite.config.ts`). Public theme CSS lives at `dist/theme-assets/`, which mirrors its target Flexweg path `/theme-assets/<id>.css` — exactly where every published page's `<link rel="stylesheet">` points. **Never** put theme CSS under `/admin/...` on the public site: published pages do not reference that path.

#### The head-extra sentinel

Plugins can inject `<head>` markup via the `page.head.extra` filter. React can't represent raw HTML inside `<head>` cleanly via JSX, so themes' `BaseLayout` emits a sentinel `<meta name="x-cms-head-extra" />` and `core/render.tsx` does a string replace post-render. **Any custom theme's BaseLayout must include this sentinel** or plugins like `core-seo` will silently no-op.

### Plugin system

`core/pluginRegistry.ts` is a WordPress-style filter/action registry. Filters mutate values in priority order; actions are side effects that all run. Plugins live in `src/plugins/<id>/`, register through a `manifest.register(api)` callback, and are listed in `src/plugins/index.ts`.

`applyPluginRegistration(enabledFlags)` runs in `CmsDataContext` every time settings change. It calls `resetRegistry()` first, so toggling a plugin off/on is enough to live-reapply registrations without a reload.

Hooks currently exposed by core: `post.markdown.before`, `post.html.body`, `post.template.props`, `page.head.extra` (sync only), `publish.before`, `publish.after`, `publish.complete`. Add more by calling `applyFilters` / `doAction` in publisher or render.

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
