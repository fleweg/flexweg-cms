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

`.env` is **optional**: the admin can also be configured at runtime through the in-app first-run **SetupForm** (see "Runtime config & first-run setup" below). If the developer has `VITE_FIREBASE_*` + `VITE_ADMIN_EMAIL` filled in `.env`, Vite bakes them into the bundle and the SetupForm never shows. If `.env` is empty (typical for a fresh `dist/admin/` dropped on Flexweg by a non-developer), the admin renders the SetupForm on first load and writes a populated `/admin/config.js` to Flexweg on success.

`npm install` requires `--legacy-peer-deps` because `react-i18next` declares an optional peer on TypeScript 5 while this project pins TypeScript 6 (matches the `kanban` sibling project). The peer is optional, the install is safe.

## Runtime config & first-run setup

The admin reads its Firebase config + admin email through one resolver that converges two sources of truth:

1. **`window.__FLEXWEG_CONFIG__`** — set synchronously by `/admin/config.js` (loaded via a plain `<script>` in `index.html` *before* the main bundle). The bundled `public/config.js` ships as `window.__FLEXWEG_CONFIG__ = null;` — the SetupForm rewrites it on Flexweg with real values once the user fills the form.
2. **`import.meta.env.VITE_FIREBASE_*`** — Vite-injected from `.env` at build time (or served live during `npm run dev`).

`src/lib/runtimeConfig.ts.getRuntimeConfig()` checks (1), then (2), and caches the result. `src/services/firebase.ts` reads exclusively through this resolver — no direct `import.meta.env` access remains. `App.tsx` short-circuits to `<SetupForm />` (skipping `<AuthProvider>` etc.) when the resolver returns `null`.

The SetupForm flow ([src/pages/SetupForm.tsx](src/pages/SetupForm.tsx)):

1. **Init Firebase + sign in** — `initFirebaseFromSetup` from `firebase.ts` initialises the SDK with the form's values *and* sets `window.__FLEXWEG_CONFIG__` so the resolver stays consistent for the rest of the session. Then `signInWithEmailAndPassword` validates Firebase config + admin credentials in one go.
2. **Verify admin email** — checks `auth.currentUser.email === form.adminEmail` to catch typos.
2b. **Require email verification** — checks `auth.currentUser.emailVerified`. If false, calls `sendEmailVerification(currentUser)` and surfaces the `emailNotVerified` error kind asking the user to click the Firebase verification link before re-submitting. Required because the Firestore rules pin `email_verified == true` on `isBootstrapAdmin()` — an unverified token cannot pass the bootstrap probe nor self-create a user record with `role: "admin"`.
3. **Test Flexweg API** — `testFlexwegConnection` in [src/lib/setupApi.ts](src/lib/setupApi.ts) hits `/files/storage-limits` directly (bypassing the standard `flexwegApi.ts` because that one resolves credentials from Firestore, which doesn't yet have them).
4. **Write `config/flexweg`** to Firestore. `permission-denied` here surfaces a specific error pointing to the Firestore-rules section of the README with the admin email pinned in.
5. **Upload populated `config.js`** via `uploadConfigJs` (also in `setupApi.ts`). The serialised content comes from `buildConfigJsSource(config)` in `runtimeConfig.ts`.
6. Force a `window.location.reload()` so the next boot fetches the freshly-uploaded `config.js` from Flexweg, the resolver picks up the values, and the admin boots through the normal authenticated path. The SetupForm never shows again.

The setup helpers in `src/lib/setupApi.ts` are intentionally separate from `services/flexwegApi.ts`: the latter funnels through `requireConfig()` which reads from Firestore, and Firestore doesn't yet have the Flexweg config when SetupForm runs. Setup helpers accept the credentials as explicit arguments and call `fetch` directly. After setup completes and the admin reloads, every Flexweg call goes through `flexwegApi.ts` again — `setupApi.ts` is dormant for the lifetime of the deployment.

A single `npm run build` covers both deployment paths — there is no portable / non-portable distinction. `public/config.js` is copied verbatim into `dist/admin/config.js` by Vite's static-assets pipeline. Developers with `.env` filled never see the SetupForm because `import.meta.env` resolution wins; deployers without `.env` see it on first load and convert their bundle to a fully-configured one with one form submission.

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

Uploads go through a browser-only multi-variant pipeline (`services/imageProcessing.ts` + `services/media.ts`). Per asset, the canvas API resizes to every format declared by the active theme **plus** three admin-only formats (`admin-thumb`, `admin-preview`, `admin-original` from `services/imageFormats.ts`). All variants are encoded as WebP (or whatever `outputFormat` the theme chose), uploaded under `media/<yyyy>/<mm>/<slug>-<hex>/<variant>.<ext>`, and recorded under a single `media/{id}` Firestore doc with a `formats` map.

The uploaded source file is **not stored** — what we keep instead is `admin-original`, a high-fidelity preserved-ratio variant: 2000×2000 `contain` fit (so the long axis is capped at 2000 px, ratio preserved, never upscaled, never cropped) encoded at quality 90. Its purpose isn't display — it's a re-crop source for any theme variant that gets added later. `pickFormat`'s "largest by area" fallback also picks it up automatically when a requested format doesn't exist, so templates degrade gracefully.

`ImageFormat` supports an optional per-format `quality` override on the same 0..100 scale — used by `admin-original` to bump from the global default (80) to 90 without affecting display variants. `processImage` reads `format.quality ?? opts.quality` per variant.

Implications:

- Switching to a theme whose largest format is **smaller than 2000 px** cannot lose source — `admin-original` covers the gap. A theme asking for something **larger than 2000 px** still cannot regenerate at full source resolution; document that 2000 px is the upper bound for re-crops.
- Old media uploaded before `admin-original` shipped do not have it; the existing fallback chain in `pickFormat` (requested → default → largest available → empty) keeps them working but they cannot be re-cropped.
- The slug normaliser (`normalizeMediaSlug` in `core/slug.ts`) appends a 6-char random hex suffix to every upload — collisions are impossible by construction, so we never overwrite another asset's variant folder.
- Deletion uses `DELETE /files/delete-folder` (the whole asset folder) instead of per-file calls.

Old media uploaded before this pipeline existed keeps the legacy `{ url, storagePath }` shape. `mediaToView` and `pickMediaUrl` synthesise a `legacy` format on the fly so admin UI and theme code never branch on the shape — they just call the helpers.

### Theme system

Each theme exports a `manifest.ts` with `id`, `version`, `scssEntry`, and a `templates` map (`base | home | single | category | author | notFound`). Themes are registered statically in `src/themes/index.ts` so they're all bundled into the admin (enables instant preview switching).

Two CSS pipelines coexist, picked per-theme by file presence (`theme.scss` → SCSS, `tailwind.config.cjs` → Tailwind):

- **SCSS pipeline (default theme)**: each theme manifest imports its SCSS via Vite's `?inline` suffix (e.g. `import cssText from "./theme.scss?inline"`). Vite compiles the SCSS at build time and exposes the resulting CSS as a string on `manifest.cssText`. After `vite build`, `scripts/build-themes.mjs` writes the same compiled CSS into `dist/theme-assets/<id>.css`.
- **Tailwind pipeline (magazine theme)**: `scripts/build-theme-tailwind.mjs` runs **before** Vite (wired into `prebuild` and `predev` in `package.json`). For each theme with a `tailwind.config.cjs`, it invokes the Tailwind CLI on `theme.css` and writes `theme.compiled.css`. The manifest then `?inline`-imports that file, and `build-themes.mjs` copies it verbatim to `dist/theme-assets/<id>.css`. The local `tailwind.config.cjs` scopes the content scan to the theme directory only, so admin-bundle utility classes don't leak in. Iterative dev workflow: run `npx tailwindcss -c <config> -i <input> -o <output> --watch` in a separate terminal — Vite HMR picks up the rewritten file.

`manifest.cssText` is what the **Themes → Sync theme assets** button uploads to Flexweg via the Files API — so the admin always pushes the CSS that was built alongside its current code, regardless of what's currently sitting in `/theme-assets/` on the public site.

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

#### Theme CSS regeneration (compileCss hook)

`ThemeManifest.compileCss?(config) => string` is an optional CSS transformer called whenever `theme-assets/<id>.css` gets uploaded — `Sync theme assets` in `ThemesPage` and the theme's own settings page both go through it. The bundled `manifest.cssText` (Vite `?inline` of `theme.scss`) is the **baseline**; the hook bakes the user's persisted style overrides into the **live** CSS. Without `compileCss`, syncing would push the baseline and erase customizations.

Default theme implementation in `src/themes/default/style.ts`:

- **Font loading lives inside the SCSS** as `@import url(...)` at the top, NOT in `BaseLayout.tsx` `<link>`. So changing fonts means rewriting a single line in the CSS — no HTML republish. BaseLayout keeps the `preconnect` to fonts.googleapis.com / fonts.gstatic.com to warm the DNS.
- `buildCustomCss(baseCssText, style)`:
  1. Regex-swaps the Google Fonts `@import` line with the URL for the chosen `(serif, sans)` pair from `FONT_PRESETS`. The regex tolerates Sass's compressed `@import"..."` form *and* the expanded `@import url("...")` form so the same code works in dev and prod.
  2. Appends a `:root { … }` block at the end of the file with the user's variable overrides + font-family declarations. CSS cascade picks the later declarations on equal specificity, so this beats the original `:root` declarations earlier in the file.
  3. **Fast path**: when `style` matches defaults exactly (no var overrides, default fonts), returns `baseCssText` untouched.
- `THEME_VAR_SPECS` lists all 22 editable variables (colors / spacing / radius) with their group, type (`color` | `length`), labelKey and defaultValue. The Style tab renders fields by group with `<input type="color">` for colors and a free-form text input for length values. An empty value falls back to the default; a small ↺ button on each field clears the override.
- `applyAndUploadCustomCss({ themeId, baseCssText, style })` produces the CSS and uploads to `theme-assets/<themeId>.css`. Same path as the baseline, so browsers may serve a stale copy until hard-refresh — documented in the success toast.

`DefaultThemeConfig.style: StyleOverrides` carries `{ vars: Record<string, string>, fontSerif, fontSans }`. Stored in `settings.themeConfigs.default.style` like any other theme config — same Firestore subscription drives both the form rehydration and the runtime regenerator.

#### Magazine theme specifics

The **magazine** theme uses the Tailwind pipeline above plus a Material 3 token system. Differences from default's `compileCss` worth knowing:

- Colors are stored as **RGB triplets** (`--color-primary: 0 0 0`), not hex, because Tailwind 3's `rgb(var(--color-X) / <alpha-value>)` formula needs space-separated channels for alpha-modifier syntax (`bg-primary/50`) to work. The Style settings tab still surfaces hex via `<input type="color">` — `compileCss` converts hex → triplet at upload time.
- The override `:root` block is appended to `manifest.cssText` as-is; only `:type === "color"` specs get the hex→triplet normalization step. Length values pass through verbatim.
- Two `@import url(...)` lines coexist in `theme.css` — Newsreader/Work Sans (the user-editable pair) and Material Symbols Outlined (the icon font, hardcoded). The font-swap regex in `compileCss` is non-global and matches the **first** `@import` only, so changing the font pair never touches Material Symbols.
- The publisher has a per-theme branch in `renderHome` for magazine (alongside the existing default branch) that resolves four pre-rendered HTML strings — `heroHtml` (magazineHero block), `listHtml` (latestList helper), `mostReadHtml` and `promoCardHtml` (sidebar widgets driven by `MagazineThemeConfig.home.sidebarTop` / `sidebarBottom`).
- Magazine's blocks live under the `magazine/` namespace (`magazine/hero-split`, `magazine/most-read`, `magazine/promo-card`); the marker regex in `themes/magazine/blocks/transforms.ts` hardcodes that namespace. Other themes' bodies pass through untouched.
- **Tailwind content scan must include `.js`**. Magazine's runtime loaders (`menu-loader.js`, `posts-loader.js`) inject DOM whose class names are **only** referenced from those JS files. If `tailwind.config.cjs`'s `content` glob is limited to `{ts,tsx,html}`, Tailwind's purge step strips the matching `@layer components` rules in `theme.css` and the runtime-injected widgets (sidebar related/bio, burger logo swap) render unstyled. The fix is `content: [".../**/*.{ts,tsx,html,js}"]` — already set in the magazine config. Mirror this for any theme that ships a runtime loader contributing class names that aren't otherwise referenced from TS/TSX. The safelist is an alternative for one-off classes but doesn't scale to a whole loader's DOM.

#### Corporate theme specifics

The **corporate** theme follows the same Tailwind + M3 pipeline as magazine but is shaped around vitrine / lead-gen sites rather than long-form journalism:

- **Single-font system.** One sans family (Inter by default) replaces the editorial serif/sans pair. The Style tab exposes only one font slot. The font swap regex in `compileCss` still touches just the first `@import` line so Material Symbols Outlined (loaded second) stays put.
- **Lead-gen oriented home.** Unlike magazine, corporate's home is a regular `page` whose body is composed of theme blocks (`hero-overlay` + `services-grid` + `testimonials` + `cta-banner`). Set `homeMode: "static-page"` in `/settings/general` and point at that page. There is no per-theme home layout config — the editor is the layout. A graceful fallback latest-posts grid renders when no static page is wired.
- **10 blocks under `corporate/`** (vs. magazine's 3). Marker regex in `themes/corporate/blocks/transforms.ts` hardcodes the corporate namespace; bodies from other themes pass through untouched. The block set: `hero-overlay`, `hero-split`, `services-grid`, `cta-banner`, `testimonials`, `trust-bar`, `stats-grid`, `feature-stack`, `contact-info`, `contact-form`. None of them reference posts / terms / media — they're pure attr renderers — so the publisher's `RenderEnv` stays minimal (no `used: Set<string>` dedup pass needed).
- **Contact form runtime.** `contact-form` block emits `[data-cms-form]` / `[data-cms-form-endpoint]` / `[data-cms-form-mailto]` hooks; `posts-loader.js`'s `wireContactForms()` intercepts submit and either POSTs urlencoded data to the configured endpoint (Formspree-compatible — JSON Accept header, success/error message toggle via `[data-cms-form-success]` / `[data-cms-form-error]` siblings) or builds a `mailto:` URL with the form values pre-filled. Floating-label CSS sync (`.is-filled`) is also wired so autofill / back-button restore keep labels raised.
- **Header has 2 menu hosts.** The corporate header includes both an inline horizontal nav (`data-cms-menu-inline`, visible md+) and the standard burger overlay (`[data-cms-menu="header"]`, every viewport). The shared `menu-loader.js` reads the `data-cms-menu-inline` flag and emits flat `<a>` links instead of `<ul>/<li>` for that host — same `/menu.json`, two visual presentations.
- **Hardcoded `/contact.html` CTA.** The header's `Get Started` button always points at `/contact.html`. Document this in onboarding or replace via theme code if a site doesn't want a contact page.

### Admin folder name auto-detection

The admin SPA is conventionally deployed to `/admin/` on Flexweg, but the folder name is not hardcoded — users can rename it (e.g. to a random `/erf34f654GH3/` for obscurity). The admin auto-detects its current folder from `window.location.pathname` via [src/lib/adminBase.ts](src/lib/adminBase.ts):

- `getAdminFolder()` returns the path segments up to (but excluding) `index.html` — e.g. `/erf34f654GH3/index.html` → `"erf34f654GH3"`. Returns `""` when the admin is at the site root.
- `withAdminBase(relativePath)` prepends the detected folder to a Flexweg API upload path. Used by every site that writes admin assets to Flexweg:
  - [src/lib/setupApi.ts](src/lib/setupApi.ts) — `config.js` upload during SetupForm
  - [src/services/externalUpload.ts](src/services/externalUpload.ts) — `external.json` + plugin / theme folders
- `isRootDeployment()` returns true when `getAdminFolder() === ""`. The SetupForm checks this and refuses to submit, surfacing a translated error pointing the user to put the admin in a subfolder. Without this guard, uploads would land at the site root and pollute the public HTML pages.

The runtime loader ([src/services/externalLoader.ts](src/services/externalLoader.ts)) does NOT use `withAdminBase` — it uses URLs relative to `document.baseURI` (`fetch("./external.json")`, `new URL(relative, document.baseURI).href`) which auto-resolve against whatever folder served the admin. Only the upload side needs the explicit prefix because Flexweg API paths are absolute from the site root.

When extending: any new code path that uploads admin assets via the Flexweg API MUST go through `withAdminBase()`. Any new code path that fetches admin assets via the browser (`fetch`, dynamic `import`) should use a relative URL — no helper needed.

### In-tree plugins / themes are built as externals

Every in-tree plugin (under `src/plugins/`) and every non-`default` theme (under `src/themes/`) is compiled at `npm run build` time into a SEPARATE ESM bundle under `dist/admin/{plugins,themes}/<id>/` and listed in `dist/admin/external.json` — same loading path as user-uploaded externals. Their source code is **not** part of the main admin bundle in prod.

Mechanism:

- `src/plugins/index.ts` and `src/themes/index.ts` keep static imports of every in-tree manifest, but the resulting `PLUGINS` / `THEMES` arrays are gated on `import.meta.env.DEV`. In dev (`npm run dev`), the static imports populate the array — no external loading needed, HMR works as usual. In prod, the array is empty and Rollup tree-shakes the unused manifests; the admin relies entirely on the external loader for plugin/theme registration.
- `default` theme is the exception — it always stays in the THEMES array as the fallback when a user uninstalls every external theme.
- Each in-tree plugin/theme imports admin internals through `@flexweg/cms-runtime` (TS path alias to [src/core/flexwegRuntime.ts](src/core/flexwegRuntime.ts)). The build script externalises this specifier per bundle, so at runtime the import-map redirects to `/admin/runtime/cms-runtime.js` which reads from `window.__FLEXWEG_RUNTIME__` — same instances as the admin.

The full set of admin internals exposed via `@flexweg/cms-runtime`:

- React + family (already there)
- Plugin API + registries: `pluginApi`, `registerBlock`, `registerDashboardCard`, `registerExternalPlugin`, `registerExternalTheme`
- core helpers: `slugify`, `isValidSlug`, `findAvailableSlug`, `buildPostUrl`, `buildTermUrl`, `pathToPublicUrl`, `detectPathCollision`, `detectTermSlugCollision`, `normalizeMediaSlug`, `mediaToView`, `pickFormat`, `pickMediaUrl`, `markdownToPlainText`, `renderMarkdown`, `SocialIcon`, `socialLabel`, `postSortMillis`, `renderPageToHtml`
- Flexweg Files API: `uploadFile`, `deleteFile`, `deleteFolder`, `renameFile`, `renameFolder`, `createFolder`, `getFile`, `listFiles`, `publicUrlFor`, `fileToBase64`, `getStorageLimits`, `FlexwegApiError`
- Firestore CRUD: `fetchAllPosts`, `createPost`, `updatePost`, `uploadMedia`, `createTerm`, `buildAuthorLookup`
- Publisher: `publishPost`, `buildPublishContext`, `buildSiteContext`, `publishMenuJson`
- Settings: `updatePluginConfig`, `updateThemeConfig`
- Lib: `toast`, `sha256Hex`, `formatDateTime`, `cn`
- Hooks + contexts: `useCmsData`, `useAuth`, `useAllPosts`
- i18n: `i18n` (instance), `pickPublicLocale`, `setActiveLocale`
- UI components: `EntityCombobox`, `FontSelect`, `MediaPicker`
- Theme support: `getActiveTheme`, `getCurrentPublishContext`, `logoPath`, `uploadThemeLogo`, `removeThemeLogo`

When adding new admin internals that plugins/themes consume, add them here AND to [public/runtime/cms-runtime.js](public/runtime/cms-runtime.js) so the runtime stub re-exports them.

**Runtime registry storage** ([src/services/externalRegistryStore.ts](src/services/externalRegistryStore.ts)): the live list of installed externals lives in Firestore at `settings/externalRegistry`, NOT as a file on Flexweg. The on-disk `dist/admin/external.default.json` is the immutable build-time baseline used by the "Reinstall bundled defaults" UI and as the seed for fresh installs. There's no longer a mutable `dist/admin/external.json`.

`readRegistry()` resolves in this order: Firestore → legacy `external.json` (one-time migration source for pre-Firestore deployments) → `external.default.json` (fresh install). The first non-null result is materialised back into Firestore so subsequent boots hit the Firestore branch directly.

`writeRegistry()` only writes to Firestore. Install / uninstall / reinstall flows in `services/externalUpload.ts` all funnel through this. Bundle files themselves (the `bundle.js` / `manifest.json` / `theme.css` per entry) still live under `/admin/<kind>/<id>/` on Flexweg — they're written by `installFromZip` and deleted by `uninstallExternal` via the regular `flexwegApi`. Only the manifest moved.

**Reinstalling bundled defaults**: the Plugins / Themes install modal exposes a **Restore** button when there's a delta between `external.default.json` and the live Firestore registry. Clicking merges the missing entries back. The bundle files don't move; they're already on Flexweg from the latest admin deploy.

**Deploy semantics**: `dist/admin/` is fully re-deployable now. Re-uploading the entire folder is safe — the registry lives in Firestore so admin upgrades never overwrite the user's uninstall state. Only the bundle files (in `plugins/<id>/`, `themes/<id>/`) and `external.default.json` are intended to be refreshed by deploys.

### External plugins / themes (runtime-loaded packages)

Beyond the in-tree plugins/themes (under `src/plugins/`, `src/mu-plugins/`, `src/themes/`), the admin supports **externally-installed** plugins and themes that ship as a `.zip`, get uploaded into Flexweg, and load at runtime via dynamic `import()` — no admin rebuild required. The runtime layer is additive: in-tree entries keep working unchanged, externals augment the same registries.

**Architecture pieces** (read these together to understand the boot flow):

- [src/core/flexwegRuntime.ts](src/core/flexwegRuntime.ts) — populates `window.__FLEXWEG_RUNTIME__` with React + family + the `pluginApi`. Side-effect imported by [main.tsx](src/main.tsx) **before any other code**.
- [public/runtime/](public/runtime/) — six static stub files (`react.js`, `react-dom.js`, `react-dom-client.js`, `react-jsx-runtime.js`, `react-i18next.js`, `cms-runtime.js`) that re-export from `window.__FLEXWEG_RUNTIME__`. Served at stable URLs (no Vite hashing) so the import-map in `index.html` can target them by relative path.
- [index.html](index.html) — declares the `<script type="importmap">` redirecting bare specifiers (`react`, `react/jsx-runtime`, `react-dom`, `react-dom/client`, `react-i18next`, `@flexweg/cms-runtime`) to `./runtime/*.js`. Plugin/theme bundles externalise these at build time; the import-map resolves them to the admin's live instances at runtime → one React copy in the page (required for hook integrity).
- [src/services/externalRegistry.ts](src/services/externalRegistry.ts) — in-memory list of imported external manifests. Mutable: bundles call `registerExternalPlugin` / `registerExternalTheme` on import; the upload flow calls `unregister*` on uninstall. Subscribers (e.g. theme/plugin pages) get notified.
- [src/services/externalLoader.ts](src/services/externalLoader.ts) — at boot, fetches `/admin/external.json` (the runtime manifest of installed externals). For each entry, validates `apiVersion` against `[FLEXWEG_API_MIN_VERSION, FLEXWEG_API_VERSION]`, dynamic-imports the bundle's `bundle.js`, and registers the default export. Per-entry errors are caught + logged + grouped into a single toast — never abort boot.
- [src/services/externalUpload.ts](src/services/externalUpload.ts) — handles install/uninstall via the upload UI. `installFromZip(kind, file)` extracts via JSZip (handles macOS-style wrapping folders), validates `manifest.json` (id sanitised + apiVersion + entry presence), uploads every file under `/admin/<kind>/<id>/` via `flexwegApi`, then writes the new entry to the Firestore registry. **In-place upgrade** is the default: if an entry with the same id already exists, the service pre-cleans the old folder via `deleteFolder` then proceeds with the upload + registry replace-in-place (not append), returning `mode: "upgrade"` + `previousVersion` so the modal can show `v1.0.0 → v1.1.0`. Users never need to uninstall before re-uploading a newer ZIP. `uninstallExternal(kind, id)` removes the entry from the registry first (so a partial cleanup never leaves the admin trying to load a deleted folder), then `deleteFolder` on Flexweg, then `unregister*` in-memory.
- [src/components/plugins/ExternalInstallModal.tsx](src/components/plugins/ExternalInstallModal.tsx) — shared modal mounted by both `PluginsPage` and `ThemesPage`. ZIP picker + install button + uninstall list of currently-installed externals.

**Boot order** (the contract `loadAllExternalEntries` depends on):

1. `main.tsx` runs — first import is `./core/flexwegRuntime` which sets `window.__FLEXWEG_RUNTIME__`.
2. React mounts; `<App />` renders — if no Firebase config, branches to SetupForm; otherwise mounts `<AuthProvider>` + `<CmsDataProvider>`.
3. `CmsDataProvider`'s first `useEffect` calls `loadAllExternalEntries()`, sets `externalsLoaded = true` regardless of success.
4. The Firestore subscription `useEffect` is gated on `externalsLoaded` — so `applyPluginRegistration` runs ONCE with the complete plugin set (built-ins + externals). Otherwise external entries would register late, after `applyPluginRegistration`'s `resetRegistry()` already executed without them.

**Registry integration**: [`listPlugins()`](src/plugins/index.ts) returns `[...PLUGINS, ...listExternalPlugins()]`; [`listThemes()`](src/themes/index.ts) does the same. Every consumer (PluginsPage, ThemesPage, publisher's theme resolver, `getPluginManifest`, `getActiveTheme`) goes through these so externals appear identically to built-ins. `applyPluginRegistration` iterates externals after built-ins so any external filter layers on top.

**Storage layout** (on Flexweg):

```
/admin/
├── external.json                  # { plugins: [...], themes: [...] } — runtime manifest
├── plugins/<id>/manifest.json     # installation metadata (read at install + at boot)
├── plugins/<id>/bundle.js         # ESM, default-exports the PluginManifest
├── themes/<id>/manifest.json
├── themes/<id>/bundle.js          # ESM, default-exports the ThemeManifest
├── themes/<id>/theme.css          # uploaded as /theme-assets/<id>.css via Sync theme assets
├── runtime/{react,react-dom,...}.js  # stable runtime stubs (Vite copies from public/runtime/)
```

**Authoring** lives outside this repo:

External themes live under `external/themes/<id>/` and external plugins under `external/plugins/<id>/`, where `<id>` matches each bundle's `manifest.id`. The scaffolds bundled in the repo:

- [external/plugins/hello-plugin/](external/plugins/hello-plugin/) — minimal plugin scaffold with `vite.config.ts` showing the externalised dependencies and the `inlineDynamicImports: true` that's required (the admin only loads `bundle.js`; separate chunks would 404).
- [external/themes/minimal-theme/](external/themes/minimal-theme/) — minimal theme scaffold with six templates + hand-written CSS imported via `?raw`.
- [external/themes/marketplace-core/](external/themes/marketplace-core/) — full theme example (app-store style marketplace) with custom blocks, settings page, font/palette overrides; demo content lives in [demo-content/marketplace-core/](demo-content/marketplace-core/).

Sample content sets ship under `demo-content/<use-case>/`, separate from the theme/plugin source code under `external/`. Each one is a folder of `.md` listings + `images/` ready to drag into the **Flexweg Import** plugin's drop zone (drag the inner folder, including `images/`). New content sets go alongside `demo-content/marketplace-core/`.
- [docs/creating-a-plugin.md](docs/creating-a-plugin.md), [docs/creating-a-theme.md](docs/creating-a-theme.md), [docs/runtime-api-reference.md](docs/runtime-api-reference.md) — full authoring guides in English.

**Common gotchas** when extending the runtime:

- New built-in modules that external bundles want to consume need: (1) added to `flexwegRuntime`, (2) a stub in `public/runtime/`, (3) added to the import-map in `index.html`, (4) added to the example bundles' `external` Vite list.
- The example scaffolds keep a local `src/types/cms-runtime.d.ts` — they don't depend on a published `@flexweg/cms-runtime` npm package. If we ever publish one, examples should switch to the public types and drop the local stub.
- Theme bundle.js MUST default-export an object whose `id` matches `manifest.json`'s `id`. The loader cross-checks; mismatched bundles are rejected to prevent slot hijacking.
- The boot blocks on external loading. If a remote `external.json` fetch hangs (very unlikely), the admin spinner would too. Acceptable for now — the fetch has `cache: no-store` but no explicit timeout.

### Plugin system

`core/pluginRegistry.ts` is a WordPress-style filter/action registry. Filters mutate values in priority order; actions are side effects that all run. Plugins live in `src/plugins/<id>/`, register through a `manifest.register(api)` callback, and are listed in `src/plugins/index.ts`.

`applyPluginRegistration(enabledFlags)` runs in `CmsDataContext` every time settings change. It calls `resetRegistry()` first, so toggling a plugin off/on is enough to live-reapply registrations without a reload.

#### Must-use plugins (`src/mu-plugins/`)

Same manifest shape and hook API as regular plugins, but **always registered** — the loader iterates `MU_PLUGINS` first on every `applyPluginRegistration()` pass without consulting `enabled`. There is no UI toggle and no entry in `settings.enabledPlugins`. The admin's `/plugins` page splits regular vs. MU into two tabs (regular plugins show the standard Enable/Disable button; MU cards show a **Must-use** badge and no toggle). `getPluginManifest(id)` searches both registries so settings routes (`/settings/plugin/<id>`) resolve transparently regardless of where the manifest lives. `loadPluginTranslations()` bundles MU plugin i18n the same way as regular ones.

Currently must-use: `flexweg-favicon` (every public site benefits from favicons), `flexweg-blocks` (first-party editor blocks the post / page editor relies on — disabling would silently strip blocks from existing posts on the next render), `flexweg-custom-code` (site-wide head / body-end injection — once an admin has wired analytics or a chat widget through it, disabling the plugin would yank the script tags from every published page on the next regeneration), `flexweg-embeds` (editor blocks for YouTube / Vimeo / Twitter / Spotify — same footgun as `flexweg-blocks`: disabling would silently strip embeds from existing posts on the next render), `flexweg-metrics` (dashboard cards for Flexweg storage usage + Firestore document counts; the storage card is the only proactive nudge to upgrade the plan before hitting the wall mid-publish). Demoting any of them to optional opens a footgun for users.

Hooks currently exposed by core: `post.markdown.before`, `post.html.body`, `post.template.props`, `page.head.extra` (sync only), `page.body.end` (sync only), `menu.json.resolved`, `publish.before`, `publish.after`, `publish.complete`, `post.unpublished`, `post.deleted`. The three lifecycle actions (`publish.complete`, `post.unpublished`, `post.deleted`) all receive `(post, ctx)` where `ctx` is the exported `PublishContext` from `services/publisher.ts`, **already patched** by `applyPostStatusInCtx` to reflect the just-completed transition. Plugins reading `ctx.posts` / `ctx.pages` see what the public site looks like *after* the action, never the pre-state.

The `page.head.extra` and `page.body.end` filters both work via sentinel replacement in `core/render.tsx` — themes' `BaseLayout` emits a `<meta name="x-cms-head-extra" />` for head and a `<script type="application/x-cms-body-end" />` for body. After `renderToStaticMarkup`, render.tsx string-replaces each sentinel with the result of `applyFiltersSync(hook, "", baseProps)`. The body-end sentinel is always removed even when no plugin filters in (keeps the published HTML clean of internal markers).

`menu.json.resolved` runs inside `services/menuPublisher.ts.publishMenuJson` just before the upload, with payload `(menu: MenuJson, ctx: MenuFilterContext)` where `MenuFilterContext = { settings, posts, pages, terms }`. Plugins can append, replace, or reorder header/footer entries — everything that ends up in `/menu.json` flows through this filter. The flexweg-rss plugin uses it to inject footer entries for each RSS feed where `addToFooter === true` (no MenusPage edit required).

Add more hooks by calling `applyFilters` / `doAction` in publisher or render. When extending, mirror the existing pattern: actions take `(payload, ctx)` so handlers don't need ad-hoc data fetching.

#### Dashboard cards (`pluginApi.registerDashboardCard`)

Plugins can contribute self-contained cards to the admin dashboard. The registry lives in [src/core/dashboardCardRegistry.ts](src/core/dashboardCardRegistry.ts) and follows the same lifecycle as plugin-registered blocks: cleared on every `applyPluginRegistration()` reset, then re-registered. `DashboardPage` snapshots the list once on mount via `listDashboardCards()` and renders the result under the four built-in stat cards in a 1 / 2 / 3-column responsive grid (mobile / `md` / `lg`). When no plugin registers a card, the second grid is omitted entirely.

Manifest shape:
```ts
api.registerDashboardCard({
  id: "<plugin-id>/<card>",
  priority: 50,        // lower runs first; default 100
  component: MyCard,   // takes no props
});
```

Cards take **no props**. Each card fetches its own data (Firestore queries, Flexweg API calls, etc.) and manages its own loading / error / empty states. The flexweg-metrics MU plugin demonstrates two flavours: `StorageCard` (one-shot fetch with manual refresh button) and `FirestoreCard` (parallel `getCountFromServer` aggregation queries against admin collections). Neither polls — the dashboard re-mounts on navigation away/back, which is the expected refresh trigger.

#### Plugin settings pages and i18n

`PluginManifest` has two optional fields beyond `register`:

- `settings: { navLabelKey, defaultConfig, component }` — declares a config page rendered at `/settings/plugin/<id>`. The `SettingsLayout` renders a tab strip with one entry per enabled-plugin-with-settings; `PluginSettingsRoute` resolves the `:pluginId` param to a manifest, merges `defaultConfig` with whatever's in `settings.pluginConfigs.<id>`, and hands the result to the component along with a `save(next)` helper. Storage path: nested-map merge into `settings/site.pluginConfigs.<id>` via `updatePluginConfig` — the same Firestore subscription that drives `CmsDataContext` reaches plugin configs, no extra listeners.
- `i18n: { en, fr }` — bundled translations loaded by `loadPluginTranslations()` at module import time into a dedicated i18next namespace named after the plugin id. Plugin UI calls `useTranslation('<plugin-id>')` to scope its keys. Bundles are loaded once regardless of plugin enable state (cheap, orthogonal to the runtime registration).

Inside an action-hook handler, the live config is at `ctx.settings.pluginConfigs?.[<plugin-id>]` — already up-to-date because `ctx` is built fresh per publish action via `buildPublishContext`.

#### Built-in plugins

- **`core-seo`** — minimal: Twitter Card meta tags + a `<meta name="generator">` hint via `page.head.extra`. No config.
- **`flexweg-sitemaps`** — owns `sitemaps/sitemap-<year>.xml`, `sitemaps/sitemap-index.xml`, optional `sitemaps/sitemap-news.xml`, `robots.txt` (at site root), plus two XSL stylesheets (`sitemaps/sitemap.xsl`, `sitemaps/sitemap-news.xsl`). Every sitemap file lives under `/sitemaps/` for tidiness; `robots.txt` stays at the root because that's where crawlers expect it (`pathToPublicUrl(baseUrl, SITEMAP_INDEX_PATH)` automatically writes the right absolute URLs into robots.txt and the inter-sitemap `<loc>` references). Subscribes to `publish.complete`, `post.unpublished`, `post.deleted` to incrementally regenerate the year sitemap that contains the touched post (computed from `post.createdAt`, fallback to `publishedAt` then `updatedAt`) plus the index plus News. Years that empty out get their sitemap deleted from the public site so the index never references stale files. The settings page (`/settings/plugin/flexweg-sitemaps`) exposes content-type filter (posts vs posts+pages), News toggle + window in days (default 2), an editable `robots.txt` with **Insert default**, **Upload stylesheets**, and a **Force regenerate** button that rebuilds everything (XSL + sitemaps + robots). Generator code in `src/plugins/flexweg-sitemaps/generator.ts` uploads through `flexwegApi.uploadFile` / `deleteFile` so all error handling and toasts flow through the standard funnel. **Skip silently when `settings.baseUrl` is empty** — sitemap URLs need an absolute origin and we'd rather noop than upload garbage.

  Legacy-root migration: an earlier version uploaded sitemaps at the site root. Both `regenerateSitemaps` (full pass — `scope` undefined) and `regenerateStylesheets` run an idempotent sweep that `deleteFile`s the legacy root paths (`sitemap-index.xml`, `sitemap-news.xml`, `sitemap.xsl`, `sitemap-news.xsl`, plus `sitemap-<year>.xml` for every year present in the corpus). 404s are silent so the sweep is free to run on every full regen — first invocation cleans up, subsequent ones noop. Per-post incremental regens (`scope.years` set) skip the sweep to keep the lifecycle hooks fast.

  XSL handling: each sitemap file emits an `<?xml-stylesheet type="text/xsl" href="<baseUrl>/sitemaps/sitemap{,-news}.xsl"?>` PI just below the XML declaration. The PI is invisible to crawlers but transforms the file into a styled HTML table when a browser opens the URL directly. The XSL strings are built in `src/plugins/flexweg-sitemaps/xsl.ts` with localised labels picked from `settings.language` (prefix match across the 7 supported admin locales — `fr-CA` resolves to FR, `pt-BR` to PT, etc.; anything not matched falls back to EN). Lifecycle hooks **never** re-upload the XSL files (they change rarely; saving 2 uploads per publish is worth it). Refresh them via **Upload stylesheets** or **Force regenerate** — both also delete `sitemaps/sitemap-news.xsl` when News is disabled so the public site stays clean.

- **`flexweg-favicon`** (lives under `src/mu-plugins/` — must-use, always active) — full favicon + PWA manifest generator. Source: one user-uploaded image (PNG/JPG/WebP/SVG). Outputs under `/favicon/`: `favicon-96x96.png`, `apple-touch-icon.png` (180, white bg for Safari), `web-app-manifest-{192,512}x{192,512}.png` (maskable purpose), `favicon.ico` (multi-size 16/32/48 packed via pure-JS encoder in `icoEncoder.ts`), `favicon.svg` (passthrough only when source is SVG), `site.webmanifest`. Resize via `createImageBitmap` + canvas cover-crop in `generator.ts`. Per-format flags (`hasIco`, `hasSvg`, `hasPng96`, ...) tracked in plugin config so the head injection only emits `<link>` tags for files actually present. Manifest-only re-upload via the PWA tab (just `site.webmanifest`) avoids re-processing the source. Head injection registered on `page.head.extra` reads `props.site.settings.pluginConfigs["flexweg-favicon"]` directly so it flows through the standard sync filter chain. Cache-busting via `?v=<uploadedAt>` on every URL.

- **`flexweg-embeds`** (lives under `src/mu-plugins/` — must-use, always active) — Editor blocks for YouTube, Vimeo, Twitter/X and Spotify. Each provider is one entry in [src/mu-plugins/flexweg-embeds/providers.ts](src/mu-plugins/flexweg-embeds/providers.ts) with a URL parser, a `renderHtml(id)` that returns the published-page iframe/blockquote, an editor preview, and an optional `bodyScript`. The Tiptap node factory in `nodes.tsx` builds one atom node per provider whose `parseHTML`/`renderHTML` round-trips through markdown as `<div data-cms-embed="<id>" data-id="<x>" data-url="<y>"></div>`. The post editor's tiptap-markdown is set to `html: true` specifically to make this round-trip work — DOMPurify still strips dangerous tags at publish, so the relaxed config is safe.
  
  Per-page detection: `transforms.ts` keeps a module-level `Set<providerId>` populated by the `post.html.body` filter as it replaces markers with real embeds. The publisher's pipeline runs sequentially per page (`post.html.body` → `page.head.extra` → `page.body.end` → render), so the same Set is read by `getDetectedHeadStyles()` (baseline CSS, single `<style>`) and `getDetectedBodyScripts()` (one `<script>` tag per provider that needs JS — YouTube/Vimeo/Spotify are iframe-only, only Twitter ships `widgets.js`). The Set is reset at the start of every `transformBodyHtml` so a previously-rendered page doesn't bleed scripts into the next one. Adding a new embed provider = one entry in `providers.ts` + one i18n key pair.

- **`flexweg-rss`** — RSS 2.0 feeds at `/rss.xml` (site-wide) and `/<slug>/<slug>.xml` (per category). Subscribes to `publish.complete`, `post.unpublished`, `post.deleted` and only regenerates the impacted feeds — the site feed (skipped when `post.primaryTermId` is in `excludedTermIds`) and the matching category feed (when one exists for the post's `primaryTermId`). Persists `lastPublishedPath` after each upload through `updatePluginConfig` so a later category-slug rename deletes the old file before uploading at the new path. Item descriptions use `post.excerpt` when non-empty, otherwise `markdownToPlainText(content, 300)`. Sort: `publishedAt DESC` with `updatedAt`/`createdAt` fallbacks. Posts with a `heroMediaId` get an `<enclosure>` element (variant `large` → `defaultFormat` → first available, same chain as `og:image`); legacy single-URL media is handled by the same helper. Generator in `src/plugins/flexweg-rss/generator.ts` accepts `media` as either `Media[]` (from `useCmsData`) or `Map<string, Media>` (from `PublishContext`) and normalizes internally. XSL in `xsl.ts` (one stylesheet shared across site + category feeds, rendered via `<?xml-stylesheet?>`).

  Footer integration: registers a handler on the `menu.json.resolved` filter that appends one `ResolvedMenuItem` per feed where `addToFooter === true`. Labels come from the plugin's i18n bundle (`footerLabels.site` = "RSS", `footerLabels.category` = "RSS — {{name}}", interpolated manually since the filter runs without a `t()` instance). Items append at the **end** of the existing footer — there's no reordering UI; users wanting custom placement should leave the checkbox off and add the URL by hand in MenusPage.

  The settings page Save handler patches `settings.pluginConfigs["flexweg-rss"]` and immediately re-runs `publishMenuJson(patchedSettings, posts, pages, terms)` so the footer reflects the new state without waiting for the Firestore subscription to echo back. The same pattern is used by Force regenerate. **Skip silently when `settings.baseUrl` is empty** — feed URLs need an absolute origin.

### Editor and block system

`src/components/editor/MarkdownEditor.tsx` is a Tiptap-based WYSIWYG that reads/writes Markdown via `tiptap-markdown`. The chrome is intentionally Gutenberg-style: no fixed top toolbar, a `BubbleMenu` for inline marks on selection, and a `FloatingMenu` "+" inserter that opens a popover on empty paragraphs.

A `BlockToolbar` floats at the top-right of the active top-level block (Gutenberg-style) with **move up / move down / duplicate / delete** actions. The toolbar position is recomputed on every `selectionUpdate` / `transaction` and offset against the editor's relative wrapper, so page scroll stays aligned. The four commands operate on the depth-1 ancestor of the cursor (a TextSelection inside a `listItem` reorders the entire `bulletList`, not individual items — per-item reordering is a future refinement). `mousedown.preventDefault()` on the toolbar prevents the editor from blurring before the command dispatches.

The post/page edit page wraps the editor in a `EditorTopbar` (sticky command bar with status / save / publish / delete) and an `EditorInspector` (right-hand panel with **Document** and **Block** tabs). The Tiptap editor instance is lifted from `MarkdownEditor` to the page via the `onEditorReady` callback so the inspector's Block tab can subscribe to selection changes.

`src/core/blockRegistry.ts` is the source of truth for every block the user can insert. Two registration channels exist:

- **Core blocks** (`src/core/coreBlocks.ts`, side-effect imported from `main.tsx`) — registered once via `registerCoreBlock(...)`. Persistent: `resetBlocks()` spares them, so toggling a plugin can never strip the basics.
- **Plugin blocks** — registered through `pluginApi.registerBlock(...)` from a plugin's `manifest.register()`. Cleared on every `applyPluginRegistration()` call alongside filters/actions, so the active set always matches the current enabled-plugin list.

Each `BlockManifest` has:
- `id` — namespaced (`core/paragraph`, `<plugin-id>/<block>`)
- `titleKey` + optional `namespace` — i18n lookup; plugin blocks use their plugin id namespace
- `icon` — Lucide-style component
- `category` — `"text" | "media" | "layout" | "embed" | "advanced"` (drives inserter grouping)
- `insert(chain, ctx)` — inserts the block; `ctx.pickMedia` is provided by the host page so blocks like `core/image` can await a media-picker promise
- `extensions?` — Tiptap Node/Mark/Extension list, picked up at editor mount; toggling a plugin requires reopening the editor for new extensions to take effect (the inserter list refreshes immediately though)
- `isActive?(editor)` — predicate driving the inspector's Block tab; first manifest whose predicate returns true wins
- `inspector?` — React component rendered in the Block tab when this block is active; receives `{ attrs, updateAttrs, editor }` and writes attribute changes back via Tiptap's `updateAttributes`

The `EditorInspector` auto-switches to the Block tab when the active block has its own inspector, but never away from it (so the user keeps control of the tab state). Active-block resolution reads attrs by stripping the `core/` prefix and removing dashes (e.g. `core/heading-2` → `heading2`); plugin blocks should match their Tiptap node name to their manifest id.

### Firestore data model

Collections: `posts` (both posts and pages, distinguished by `type`), `terms` (categories + tags), `media`, `users`, `settings/site` (singleton), `config/flexweg` (singleton with API key, separate from settings so the rules can be stricter on it).

`users/{uid}.preferences.adminLocale` holds each user's admin language preference. `ensureSelfUserRecord` is **try-admin-first**: it attempts to write `role: "admin"` and falls back to `role: "editor"` on `permission-denied`. The Firestore rules let the admin-write through only for the bootstrap admin (verified email + matching pinned address), so editors land on the fallback automatically. This way the bootstrap admin's record reflects `role: "admin"` from first login, the rules are the single source of truth, and the admin email never needs to live in client config.

Bootstrap-admin detection at runtime is **rules-driven**: [src/services/auth.ts](src/services/auth.ts) exposes `probeBootstrapAdmin()` which attempts a `getDoc("config/admin")`. The rules grant read on that doc only when `isBootstrapAdmin()` is true (signed-in + email-verified + matching pinned address), so the boolean result of the probe IS the answer. [src/context/AuthContext.tsx](src/context/AuthContext.tsx) caches the probe per session and merges it with a legacy email-comparison fallback (only kicks in when an old `adminEmail` is still present in `window.__FLEXWEG_CONFIG__` from a pre-migration `config.js`). New SetupForm runs strip the email from the uploaded `config.js` so fresh deployments are entirely probe-driven.

### Post / page query architecture

The admin runs in **two modes**, picked via `settings.paginationMode` in the admin's `/settings/general` → Performance section:

- **`"global"` (default)** — single live subscription on the entire `posts` collection (`subscribeToPosts`, `orderBy(createdAt)` on a single field, covered by Firestore's automatic single-field index). `CmsDataContext` exposes `posts: Post[]` and `pages: Post[]` populated from this subscription. Hooks read from the context and do filter / slice / count in memory. **No composite indexes required** — works on a fresh Firestore project. Best for sites under ~5 000 entries.
- **`"paginated"` (opt-in)** — cursor-paginated subscriptions (`subscribeToPostsPaginated`), one page at a time. `countPosts` falls back to Firestore aggregation queries. Requires composite indexes (`(type, createdAt)` and `(type, status, createdAt)`). Recommended for very large sites.

`fetchAllPosts({ type })` works in **both** modes. It is intentionally index-free: the Firestore query has no `where` and no `orderBy`, fetching the entire `posts` collection in one shot. Filtering by type and sorting by `createdAt desc` happen in memory (`filterFromCorpus`). Cached for 30 s with in-flight promise dedup; invalidated on every write through `createPost` / `updatePost` / `markPostOnline` / `markPostDraft` / `deletePost`. In global mode the `subscribeToPosts` listener primes this cache (`primeAllPostsCache`) on every snapshot, so non-React consumers (publisher, plugin generators) read fresh data without an extra fetch.

The hook layer dispatches on `settings.paginationMode`:

- [`usePostsPage(opts)`](src/hooks/usePostsPage.ts) — both branches return the same `UsePostsPageResult` shape so the consuming page components don't change. Global branch reads from the context and slices in memory; paginated branch keeps a cursor stack indexed by page number.
- [`useAllPosts(type)`](src/hooks/useAllPosts.ts) — global branch returns the context's `posts` / `pages` directly (live); paginated branch calls `fetchAllPosts` (snapshot at mount). Both branches' hooks are invoked unconditionally to keep React's hook order stable across mode flips.
- [`useCountPosts({ type, status? })`](src/hooks/useCountPosts.ts) — global branch counts the in-memory list (free, live). Paginated branch issues a single-read `getCountFromServer` aggregation query.

`buildPublishContext()` in [services/publisher.ts](src/services/publisher.ts) **calls `fetchAllPosts` internally** for both posts and pages — callers don't pass them. Optional `posts` / `pages` overrides exist for the rare case of needing a pre-patched list immediately after a write.

#### Composite indexes (only required in `paginated` mode)

In `paginated` mode, two composite indexes on the `posts` collection are mandatory; without them the paginated queries fail with `failed-precondition`:

- `(type ASC, createdAt DESC)` — covers the "all" tab
- `(type ASC, status ASC, createdAt DESC)` — covers the "draft" / "online" tabs

Three creation paths documented in the README under "Firestore indexes": gcloud CLI commands, `firestore.indexes.json` for `firebase deploy`, OR the in-app **`FirestoreSetupGate`** which detects missing indexes on first login and surfaces one-click links to the Firebase Console.

Single-field auto-indexes (the "Automatic index settings" panel in the Firebase Console) do NOT cover composite queries — Firestore explicitly reserves composite-index creation for project admins.

#### `FirestoreSetupGate`

Lives at [src/components/FirestoreSetupGate.tsx](src/components/FirestoreSetupGate.tsx) and is rendered **inside** `<CmsDataProvider>` in [App.tsx](src/App.tsx) so it can read `settings.paginationMode` via `useCmsData()`. The gate is a **pure pass-through in `global` mode** (no ping, no setup screen). In `paginated` mode, it pings the two composite-index queries with `limit(1)`, caches success in `localStorage.flexweg.firestoreIndexesReady = "1"`, and renders a setup screen with one-click create links when either query returns `failed-precondition`. The Performance section in `/settings/general` invalidates the cache on every save (`invalidateCachedReady()`) so flipping from global → paginated re-pings against fresh truth.

Cache invalidation hook: `invalidateCachedReady()` for tests / manual reset.

#### Selection model with paginated lists

Bulk actions in PostsListPage / PagesListPage operate on a `Set<string>` of post ids. With server-side pagination (paginated mode), the selected items aren't all in memory at once — to resolve them to `Post[]` for `publishPost` / `unpublishPost` / `deletePostAndUnpublish`, the components keep a `loadedPostsRef = useRef(new Map<string, Post>())` that grows as the user paginates / searches. Misses fall through to a `fetchAllPosts` fetch (rare). In global mode the in-memory list is already complete, so the fallback never fires.

The "select all matching" Gmail-style banner (visible when the master checkbox of the current page is ticked AND there are more matching posts elsewhere) calls `fetchAllPosts` to resolve the full filtered set into a single Set of ids.

#### Search mode

PostsListPage / PagesListPage have a dual-mode list (orthogonal to `paginationMode`):

- **Browse mode** (search input empty): real-time subscription via `usePostsPage`. In global mode that's an in-memory slice of the context's posts; in paginated mode that's a cursor subscription.
- **Search mode** (search non-empty): one-shot `fetchAllPosts` of the full corpus, then **client-side** substring filter on `title + slug + excerpt` (multi-token, every token must appear, case-insensitive) + client-side pagination over the matching set. The cached corpus is reused across keystrokes. Returning to an empty search reverts to the browse subscription.

Search does NOT scan `contentMarkdown` — too heavy client-side and the typical admin search-by-title use case is well covered by the three smaller fields.

### Two languages, two scopes

- **Admin UI language** (`src/i18n/`): per-user, 7 locales — `en` (default), `fr`, `de`, `es`, `nl`, `pt`, `ko`. Resolution order: `users.preferences.adminLocale` → `localStorage.adminLocale` → `navigator.language` (two-letter prefix match) → `"en"`. Changes flow through `setActiveLocale` (updates i18next + localStorage) plus `setUserPreferences` (Firestore). All translation keys are in English; `en.json` is the source of truth and i18next falls back to it for any missing key. Adding a new locale = create `src/i18n/<code>.json`, register it in `src/i18n/index.ts`, extend `AdminLocale` in `core/types.ts`, add a label entry in `LocaleSwitcher.tsx`, extend the 7 plugin/theme i18n bundles + the sitemap XSL labels, and widen the Firestore rules locale whitelist.
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
