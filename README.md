# Flexweg CMS

A WordPress-style content management system that publishes a 100% static site to [Flexweg](https://www.flexweg.com) hosting via the Flexweg Files API. The admin is a React + TypeScript single-page app backed by Firebase (Auth + Firestore); on publish it renders pages with the active theme and uploads the resulting HTML files directly to Flexweg.

No Node.js, PHP, or database runs on the public site — only the static HTML/CSS/JS the admin pushes there.

## How it works

```
              ┌───────────────────────────┐
              │  Admin SPA at /admin/     │
              │  (React + Firebase + TS)  │
              └─────┬───────────┬─────────┘
                    │           │
        Firebase Auth + Firestore   Flexweg Files API
        (posts, pages, terms,       (HTML, CSS, images)
         media metadata, settings)
                    │           │
                    ▼           ▼
              ┌──────────────────────────┐
              │  Public static site at / │
              │  index.html              │
              │  category/article.html   │
              │  theme-assets/*.css      │
              │  media/yyyy/mm/*.jpg     │
              └──────────────────────────┘
```

Posts are stored as Markdown in Firestore. When an admin clicks **Publish**, the SPA:

1. Loads the active theme (React components + a pre-compiled CSS bundle).
2. Converts Markdown to safe HTML.
3. Renders the active template tree to a static HTML string (`react-dom/server.renderToStaticMarkup`).
4. Uploads the file to its target path on Flexweg via `POST /api/v1/files/upload`.
5. Re-uploads any pages whose listing depends on the change (home, category archive).

## Project layout

```
flexweg-cms/
├── src/
│   ├── core/            CMS-wide infrastructure (types, slug, render, markdown, plugin registry)
│   ├── services/        Firebase + Flexweg API clients, publisher
│   ├── context/         React contexts (auth, data, theme)
│   ├── components/      Admin UI building blocks
│   ├── pages/           Admin pages (one file per route)
│   ├── themes/          Public-site themes (one folder per theme)
│   │   └── default/     Default theme — base/home/single/category/author/404 + components + SCSS
│   ├── plugins/         WordPress-style plugins, registered via filters/actions
│   │   ├── core-seo/         Built-in SEO plugin (Twitter cards + generator hint)
│   │   ├── flexweg-sitemaps/ Built-in plugin: yearly sitemaps, sitemap-index, optional News, robots.txt
│   │   └── flexweg-rss/      Built-in plugin: RSS feed at /rss.xml + per-category feeds
│   ├── i18n/            Admin UI translations (en + fr)
│   └── lib/             Small utilities (date format, hashing, classnames)
├── scripts/
│   └── build-themes.mjs Compiles each theme's SCSS into dist/theme-assets/<id>.css
└── public/
```

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy the env template and fill in your Firebase project credentials:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL` — email of the bootstrap administrator. Anyone signing in with this address is treated as admin without needing a record in the `users` collection. Mirror this value in your Firestore security rules.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The admin runs on `http://localhost:5173`.

4. Configure Firestore security rules (see [Firestore security rules](#firestore-security-rules) below).

5. Sign in with the bootstrap admin email/password (created in Firebase Auth), open **Settings**, fill in:

   - Site title, language (BCP-47, e.g. `en` or `fr-FR`), public site URL.
   - Flexweg API key + site URL. The API key is stored in `config/flexweg` in Firestore.

## Firestore security rules

Paste the following into **Firebase Console → Firestore → Rules** and replace `you@example.com` with the same value you set in `VITE_ADMIN_EMAIL` (rules cannot read env vars, the email must be duplicated):

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ─── Helpers ──────────────────────────────────────────────────────────
    // Bootstrap admin: email pinned here. MUST match VITE_ADMIN_EMAIL in .env.
    function bootstrapAdminEmail() {
      return "you@example.com";
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isBootstrapAdmin() {
      return isSignedIn()
        && request.auth.token.email != null
        && request.auth.token.email.lower() == bootstrapAdminEmail();
    }

    // Reads /users/{uid} for the caller. Returns null if no record yet.
    function selfRecord() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid))
        ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data
        : null;
    }

    function isDisabled() {
      let rec = selfRecord();
      return !isBootstrapAdmin() && rec != null && rec.disabled == true;
    }

    function isAdmin() {
      let rec = selfRecord();
      return isBootstrapAdmin() || (rec != null && rec.role == "admin" && rec.disabled != true);
    }

    function isEditor() {
      let rec = selfRecord();
      return isBootstrapAdmin()
        || (rec != null && (rec.role == "admin" || rec.role == "editor") && rec.disabled != true);
    }

    // ─── users/{uid} ──────────────────────────────────────────────────────
    // - Any signed-in editor can read the list (Users page + author lookup).
    // - First login: self-create allowed if uid matches and role is "editor".
    // - Self update: only `preferences.adminLocale` may change.
    // - Role/disabled changes: admin only.
    match /users/{uid} {
      allow read: if isEditor();

      allow create: if isSignedIn()
        && request.auth.uid == uid
        && request.resource.data.email == request.auth.token.email.lower()
        && request.resource.data.role == "editor"
        && request.resource.data.disabled == false;

      allow update: if isAdmin()
        || (
          isSignedIn()
          && request.auth.uid == uid
          && !isDisabled()
          && request.resource.data.diff(resource.data).affectedKeys()
              .hasOnly(["preferences", "firstName", "lastName", "bio", "avatarMediaId"])
          && (
            !("preferences" in request.resource.data.diff(resource.data).affectedKeys())
            || request.resource.data.preferences.adminLocale in ["en", "fr"]
          )
        );

      allow delete: if isAdmin();
    }

    // ─── posts/{id} (posts + pages) ───────────────────────────────────────
    match /posts/{id} {
      allow read, write: if isEditor();
    }

    // ─── terms/{id} (categories + tags) ───────────────────────────────────
    match /terms/{id} {
      allow read, write: if isEditor();
    }

    // ─── media/{id} ───────────────────────────────────────────────────────
    match /media/{id} {
      allow read, write: if isEditor();
    }

    // ─── settings/site ────────────────────────────────────────────────────
    match /settings/{docId} {
      allow read: if isEditor();
      allow write: if isEditor();
    }

    // ─── config/flexweg ───────────────────────────────────────────────────
    // API key — read by every editor (publisher needs it), write admin-only.
    match /config/{docId} {
      allow read: if isEditor();
      allow write: if isAdmin();
    }

    // ─── Default deny ─────────────────────────────────────────────────────
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### How the rules work

- **Bootstrap admin**: a user whose email matches `bootstrapAdminEmail()` is treated as admin even without a `users/{uid}` document. This solves the chicken-and-egg problem of the first login (no record exists yet to grant the admin role).
- **Self-create on first login**: any signed-in user can create their own `users/{uid}` document, but only with `role: "editor"` and `disabled: false` — this prevents privilege escalation. The admin promotes editors via the Users page afterwards.
- **Self update is restricted to profile fields**: a regular user can change their own `preferences` (admin language), `firstName`, `lastName`, `bio`, and `avatarMediaId` — the editable surface of the **Settings → Profile** form. They cannot touch their own role or disabled flag. Admins can update any field on any record.
- **`config/flexweg` requires admin to write**: editors can read the API key (the publisher needs it), but only admins can rotate it.
- **Each rule call performs one extra read** via `selfRecord()`. Acceptable for an internal tool; if you need to optimize later, switch to [Firebase Auth custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) (requires an admin SDK backend to set them).

If you want only admins to manage themes/plugins/menus, change `allow write: if isEditor();` to `allow write: if isAdmin();` on `match /settings/{docId}`.

## Building & deploying

```bash
npm run build
```

This produces two folders inside `dist/`, each mapping 1:1 to a Flexweg path:

```
dist/
├── admin/                  → upload to /admin/ on Flexweg
│   ├── index.html
│   └── assets/
└── theme-assets/           → upload to /theme-assets/ on Flexweg (site root)
    └── <theme-id>.css      one CSS file per theme directory
```

The split mirrors the public site layout: every published page contains a `<link rel="stylesheet" href="/theme-assets/<id>.css">` pointing to the site root, **never** to `/admin/...`. Keeping `theme-assets/` at the top level of `dist/` makes the deployment story obvious: drop each folder where its name says it belongs.

**First deploy** — upload both folders to your Flexweg site (zip and drop via the dashboard, or use the Files API).

**Subsequent deploys** — re-upload `dist/admin/` whenever you ship admin code changes, then open **Themes → Sync theme assets** to push the new theme CSS to the public root. The CSS is embedded inside the admin bundle (Vite `?inline`), so the sync button always uploads the version that shipped with the current admin — no need to manually re-upload `dist/theme-assets/`.

After that, every publish action from the admin uploads HTML/asset files directly to your public Flexweg site — no further deploys required for content updates.

## Internationalisation

The admin UI is fully translated to English (default) and French. Each user picks their preferred admin language from the **Topbar** language selector or in **Settings → Profile**. The choice is saved on the user's Firestore profile (so it follows them across devices) and in `localStorage` (so reloads don't flash the wrong language).

The site language for the public output is configured separately in **Settings → Site → Site language** (BCP-47), and is injected as `<html lang="…">` on every published page.

## URL strategy

- Top-level pages: `/<page-slug>.html`
- Posts without a category: `/<post-slug>.html`
- Posts with a category: `/<category-slug>/<post-slug>.html`
- Category archives: `/<category-slug>/index.html`
- Home: `/index.html`
- 404 fallback: `/404.html`

Tags do not appear in URLs. All slugs are lower-case ASCII, dash-separated.

## Slug uniqueness

Two posts / pages / categories must never share the same public URL — Flexweg paths are case-sensitive and a duplicate would silently overwrite the other on the next publish.

- **Auto-generated slugs (new entities)**: when the title produces a slug already in use, the admin appends `-2`, `-3`, … until the resulting path is free. You never think about it for the common case.
- **User-edited slugs**: validated live against existing entities. If you type a slug that collides, an inline error appears under the field naming the conflicting entity, and the **Save** button is disabled.

Collision is computed against the **final URL path**, not just the raw slug:

| Entity A | Entity B | Same slug? | Same path? | Collision? |
|---|---|---|---|---|
| Post `news` (no category) | Page `news` | yes | both `/news.html` | **yes** |
| Post `2026` in `news` | Post `2026` in `events` | yes | `/news/2026.html` vs `/events/2026.html` | no |
| Post `news` (no category) | Category `news` | yes | `/news.html` vs `/news/index.html` | no |
| Tag `news` | Category `news` | yes | tag has no public URL | no |

Helpers live in [src/core/slug.ts](src/core/slug.ts): `findAvailableSlug`, `detectPathCollision`, `detectTermSlugCollision`.

## Stale path cleanup

Each `Post` carries two fields used by the publisher to keep the public site free of orphaned files:

- `lastPublishedPath` — the path the post is currently live at on Flexweg.
- `previousPublishedPaths[]` — paths the publisher tried but **failed** to delete during a previous publish (e.g. a transient API error).

On every publish, before uploading the new file, the publisher attempts to delete every entry in `[lastPublishedPath, ...previousPublishedPaths]` that isn't the new path. Failed deletions (non-404) are persisted back into `previousPublishedPaths` and retried on the next publish.

This guarantees:
- Changing a post's slug or primary category never leaves the old URL accessible.
- A transient Flexweg API hiccup is recovered automatically next publish.
- Unpublishing wipes every known historical path, not just the most recent one.

## Error handling & toasts

Every Flexweg API call goes through a single error funnel that surfaces failures both as thrown `FlexwegApiError`s (so calling code can react locally — e.g. retry buttons on the upload card) **and** as flash toasts in the top-right corner of the admin. Toasts include translated, status-aware messages:

| Status | Toast message |
|---|---|
| 401 / 403 | "Authentication failed. Check your Flexweg API key in Settings." |
| 404 | "Target not found on Flexweg." (suppressed for delete calls — 404 is treated as success) |
| 413 | "File too large for your Flexweg plan." |
| 429 | "Too many requests, please retry in a moment." |
| 5xx | "Flexweg server error ({{status}}). Please retry." |
| Network / CORS | "Network error or CORS blocked. Check your connection." |
| Other | Generic message including the status and any error payload returned by Flexweg. |

To emit a toast from anywhere in the codebase:

```ts
import { toast } from "../lib/toast";

toast.success("Saved.");
toast.error("Something broke.");
toast.warn("Heads up.");
toast.info("FYI.");
```

Toasts auto-dismiss after 3.5 s (info / success), 5 s (warn) or 6 s (error). Pass a custom `durationMs` (or `0` for sticky) when needed: `showToast({ level: "error", message, durationMs: 0 })`.

## Dynamic menus

The header / footer menus configured under **Menus** in the admin are loaded **at runtime** by every published page, not baked into the HTML. This means changing a menu item, adding a new page to the menu, or moving a category around does **not** require regenerating every page on the site — the change becomes visible on the next page load anywhere.

### How it works

1. Saving in `MenusPage` (or any publish/unpublish that may have moved a referenced post / term) triggers `publishMenuJson`, which writes a small `/menu.json` file to the public site root with the resolved menu structure.
2. The active theme's `BaseLayout` ships a `<script src="/theme-assets/<id>-menu.js" defer>`. That loader fetches `/menu.json` on `DOMContentLoaded` and populates every `[data-cms-menu="header|footer"]` container present on the page.
3. The default theme's loader also wires the burger toggle (`aria-expanded` flip + class toggle for the off-canvas overlay) and sets `aria-current="page"` on the link whose href matches the current URL (so themes can style the active item via CSS).

### DOM contract for new themes

Any theme that wants dynamic menus exposes empty containers and a companion JS file (declared via `jsText` on the manifest):

```html
<nav class="…" data-cms-menu="header"><ul></ul></nav>
<nav class="…" data-cms-menu="footer"><ul></ul></nav>
```

The loader fills the inner `<ul>`. If `/menu.json` is unreachable, the containers stay empty and the loader hides them via the `hidden` attribute — no error UI, no empty space.

### Failure mode

A failed menu.json publish toasts an error (the same Flexweg error funnel as everything else) but **does not** abort the surrounding action (post publish / save). The Firestore state remains the source of truth; the next successful publish retries the menu upload.

## Image handling

When a user uploads an image, the admin runs the file entirely through a browser-side pipeline (no server, no original kept):

1. Validates the extension against the active theme's `inputFormats`.
2. Decodes the file via `createImageBitmap`.
3. For each variant declared by the active theme **plus** two admin-only formats (`admin-thumb`, `admin-preview`), renders a resized canvas and re-encodes it as WebP (or whatever `outputFormat` the theme picked).
4. Uploads each variant to Flexweg under `media/<yyyy>/<mm>/<slug>-<hex>/<variant>.webp`.
5. Persists a single `media/{id}` Firestore document referencing every variant by name.

The original file is **never stored** — disk and bandwidth are saved at the cost of being unable to regenerate a perfect copy after a theme switch.

### Declaring image formats in a theme

Themes export an `imageFormats` field on their manifest:

```ts
// src/themes/<id>/manifest.ts
export const manifest: ThemeManifest = {
  id: "my-theme",
  // …
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      small:  { width: 480,  height: 480, fit: "cover" },
      medium: { width: 800,  height: 800, fit: "cover" },
      large:  { width: 1600, height: 900, fit: "cover" },
    },
    defaultFormat: "medium",
  },
};
```

`fit: "cover"` crops the source to fill the box; `fit: "contain"` shrinks the source to fit inside without cropping (no upscaling).

### Using formats in templates

Theme code receives `MediaView` objects from the publisher. Pick a format with the helper:

```tsx
import { pickFormat } from "../../../core/media";

<img src={pickFormat(hero, "large")} alt={hero.alt ?? ""} />
<img src={pickFormat(hero)} />          // uses defaultFormat (e.g. "medium")
```

`pickFormat` falls back through a chain: requested format → `defaultFormat` → largest available → empty string. This means switching to a theme that asks for a format an old upload doesn't have still renders the image at the next-best size, never broken.

### Storage layout & cleanup

```
media/
  2026/
    05/
      photo-de-vacances-a3f7b2/
        admin-thumb.webp
        admin-preview.webp
        small.webp
        medium.webp
        large.webp
```

Filenames are normalised (lower-case ASCII, dash-separated) and suffixed with a 6-character random hex string to guarantee uniqueness across uploads. Deleting a media item triggers a single `DELETE /files/delete-folder` call that wipes the whole asset folder atomically.

### Backward compatibility

Media uploaded before the multi-variant pipeline keeps its original `{ url, storagePath }` shape. The helpers (`pickFormat`, `pickMediaUrl`, `mediaToView`) read either shape transparently — no migration step required.

## Creating a new theme

1. Copy `src/themes/default/` to `src/themes/<your-theme-id>/`.
2. Update `manifest.ts` with a unique `id`, `name`, `version`.
3. Edit `templates/*.tsx` and `theme.scss` as needed. Components receive only serialisable props — don't import Firestore hooks from theme code.
4. Register the theme by appending `<your-theme-id>Manifest` to `THEMES` in `src/themes/index.ts`.
5. Run `npm run build` to compile the SCSS, then sync theme assets from the admin.

The active theme is selected per-site in **Themes**. Switching activates a "Regenerate site" workflow that re-publishes every online post.

### Theme settings page

Each theme can ship its own configuration page reachable at `/admin/#/theme-settings`. The sidebar entry **Theme settings** appears automatically when the active theme declares one — switch themes and the entry follows.

```ts
import type { ThemeManifest, ThemeSettingsPageProps } from "../types";

interface MyThemeConfig {
  accentColor: string;
}

const DEFAULT_CONFIG: MyThemeConfig = { accentColor: "#476558" };

function MyThemeSettingsPage({ config, save }: ThemeSettingsPageProps<MyThemeConfig>) {
  // `config` is already merged with defaultConfig.
  // `save(next)` writes the whole blob to settings/site.themeConfigs.<id>.
  return (
    <input
      value={config.accentColor}
      onChange={(e) => save({ ...config, accentColor: e.target.value })}
    />
  );
}

export const manifest: ThemeManifest<MyThemeConfig> = {
  id: "my-theme",
  // …
  settings: {
    navLabelKey: "title",        // i18n key in the theme's namespace
    defaultConfig: DEFAULT_CONFIG,
    component: MyThemeSettingsPage,
  },
  i18n: {
    en: { title: "My theme settings", colorLabel: "Accent color" },
    fr: { title: "Réglages du thème", colorLabel: "Couleur d'accent" },
  },
};
```

Storage lives at `settings/site.themeConfigs.<theme-id>` in Firestore — same real-time subscription as the rest of the admin. Inside theme components rendered at publish time, the resolved config is exposed as `site.themeConfig` on `SiteContext`.

Translations are loaded into a dedicated i18next namespace named `theme-<id>` so settings pages call `useTranslation("theme-<id>")` without colliding with admin keys.

Tabs inside the settings page are a theme concern — render a tab strip in your component the way the default theme does (single `useState` for the active tab + conditional sections).

### Default theme — Logo upload

The default theme exposes a **General** tab with a logo upload. Workflow:

1. Admin opens **Theme settings → General** and uploads a JPG / PNG / WebP image.
2. The image is resized client-side (canvas, no server) into a 480 × 144 WebP and pushed to `theme-assets/default-logo.webp` on Flexweg.
3. The theme config saves `{ logoEnabled: true, logoUpdatedAt: <ms> }` and the admin re-publishes `data/menu.json` with a new `branding.logoUrl` (the URL is cache-busted via `?v=<logoUpdatedAt>`).
4. The runtime `menu-loader.js` already loaded on every published page picks up the branding block on the next page load and replaces the text wordmark inside `[data-cms-brand]` with an `<img>`.

So a logo change pushes only **one** small JSON file (`menu.json`) plus the logo binary — no need to re-publish every post HTML. Removing the logo runs the same flow with `logoEnabled: false` and best-effort deletes the WebP file.

## Creating a plugin

Plugins are bundled into the admin and toggled on/off per site in **Plugins**. Each plugin exports a manifest with a `register(api)` function that hooks into the registry. Optionally, a plugin can also ship its own settings page and translations.

```ts
// src/plugins/my-plugin/manifest.ts
import type { PluginManifest } from "../index";

export const manifest: PluginManifest = {
  id: "my-plugin",
  name: "My plugin",
  version: "1.0.0",
  description: "What it does.",
  register(api) {
    api.addFilter<string>("page.head.extra", (head) => head + "<meta name=\"x\" />");
    api.addAction("publish.complete", (post, ctx) => {
      console.log("published", post, "site has", ctx.posts.length, "posts");
    });
  },
};
```

Then add it to `PLUGINS` in `src/plugins/index.ts`.

### Available hooks

| Hook | Type | Payload |
|---|---|---|
| `post.markdown.before` | filter | `(markdown, post)` — modify Markdown before rendering. |
| `post.html.body` | filter | `(html, post)` — modify rendered post HTML. |
| `post.template.props` | filter | `(props, post)` — modify the props passed to the active template. |
| `page.head.extra` | filter (sync) | `(html, baseProps)` — inject extra `<head>` markup. |
| `menu.json.resolved` | filter | `(menu, ctx)` — mutate the resolved `{ header, footer }` shape just before `/menu.json` is uploaded. `ctx` exposes `settings`, `posts`, `pages`, `terms`. |
| `publish.before` | action | `(post, ctx)` |
| `publish.after` | action | `(post, ctx)` |
| `publish.complete` | action | `(post, ctx)` — fires after the post is uploaded and listings refreshed. |
| `post.unpublished` | action | `(post, ctx)` — fires after `unpublishPost` wipes the post's files. |
| `post.deleted` | action | `(post, ctx)` — fires after `deletePostAndUnpublish` removes the post. |

`ctx` is a `PublishContext` (exported from `src/services/publisher.ts`) containing the up-to-date `posts`, `pages`, `terms`, `media`, and `settings` snapshots — already patched to reflect the just-completed transition. Plugins can read it to recompute derived files (sitemaps, search indexes, RSS feeds, …).

### Plugin settings pages

A plugin can expose a config page reachable at `/admin/#/settings/plugin/<plugin-id>`. The plugins list shows a **Configure** link on the matching card, and a tab is added to the Settings layout's tab strip for every enabled plugin that declares one.

```ts
import type { PluginManifest, PluginSettingsPageProps } from "../index";

interface MyConfig {
  greeting: string;
}

const DEFAULT_CONFIG: MyConfig = { greeting: "hello" };

function MySettingsPage({ config, save }: PluginSettingsPageProps<MyConfig>) {
  // `config` is already merged with `defaultConfig` — every field is set.
  // `save(next)` writes the whole blob to settings/site.pluginConfigs.<id>.
  return (
    <input
      value={config.greeting}
      onChange={(e) => save({ ...config, greeting: e.target.value })}
    />
  );
}

export const manifest: PluginManifest<MyConfig> = {
  id: "my-plugin",
  // …
  settings: {
    navLabelKey: "title",   // i18n key in the plugin's namespace
    defaultConfig: DEFAULT_CONFIG,
    component: MySettingsPage,
  },
};
```

The config blob is stored under `settings/site.pluginConfigs.<plugin-id>` in Firestore, so the same real-time subscription that drives the rest of the admin reaches plugin settings — no extra listeners. Inside an action-hook handler, read the live config from `ctx.settings.pluginConfigs?.[<plugin-id>]`.

### Plugin translations

Plugins ship their own translations as a manifest field. They land in a dedicated i18next namespace named after the plugin id, so plugin UI uses `useTranslation('<plugin-id>')` without colliding with admin keys:

```ts
// src/plugins/my-plugin/manifest.ts
export const manifest: PluginManifest = {
  // …
  i18n: {
    en: { title: "My plugin", help: "Does something useful." },
    fr: { title: "Mon plugin", help: "Fait quelque chose d'utile." },
  },
};

// inside the settings page component
const { t } = useTranslation("my-plugin");
return <h2>{t("title")}</h2>;
```

Bundles are loaded once at module import and persist regardless of plugin enable state — translations are cheap and orthogonal to the runtime hook registration.

## Built-in plugins

### `core-seo`

Adds Twitter Card meta tags and a `<meta name="generator">` hint to every published page. Hooks into `page.head.extra`. No settings — toggle it off in **Plugins** if you don't want the extra markup.

### `flexweg-sitemaps`

Generates and maintains the public site's sitemaps and `robots.txt`. Configure under **Settings → Sitemaps** (tab visible only when the plugin is enabled).

Files produced on the public site (relative to your `baseUrl`):

- `sitemap-<year>.xml` — one per year that has at least one online post (and page, when configured). Built from `createdAt`; `<lastmod>` reflects `updatedAt`.
- `sitemap-index.xml` — index referencing every yearly sitemap that's currently populated, plus the News sitemap when enabled.
- `sitemap-news.xml` — Google News urlset of articles modified within the configured window (default 2 days, range 1–30). Optional.
- `robots.txt` — user-supplied; defaults to `User-agent: *` + `Allow: /` + a `Sitemap:` line per generated sitemap.
- `sitemap.xsl` and `sitemap-news.xsl` — XSL stylesheets referenced by every sitemap file via an `<?xml-stylesheet?>` processing instruction. When a browser opens a sitemap URL, these transform the raw XML into a styled HTML table for human inspection. Crawlers ignore the PI entirely. Labels honor `settings.language` (English / French baked in).

Configuration options:

- **Content types** — sitemaps include posts only, or posts and pages.
- **Generate sitemap-news.xml** — toggle. When enabled, sets the News window in days.
- **robots.txt content** — full editable textarea. **Insert default** repopulates with the auto-generated body. **Save & regenerate robots.txt** persists the config and re-uploads `robots.txt` in one click.
- **Upload stylesheets** — uploads `sitemap.xsl` (and `sitemap-news.xsl` when News is enabled) to the public site root. Run this once after installing the plugin, and again whenever the public site language changes.
- **Force regenerate sitemaps** — re-derives every yearly sitemap, the index, the News sitemap, the XSL stylesheets, and `robots.txt` from the current corpus. Use after toggling content types or after a bulk import.

Incremental regeneration is automatic: every `publish.complete`, `post.unpublished`, and `post.deleted` rebuilds the year sitemap that contains the touched post, plus the index, plus News. Years that empty out have their sitemap deleted from the public site so the index never points to a stale file.

The lifecycle hooks **do not** re-upload the XSL stylesheets — those change rarely. After installing the plugin or changing `settings.language`, click **Upload stylesheets** (or **Force regenerate**) once to refresh them; subsequent content publishes don't pay that cost.

### `flexweg-rss`

Generates RSS 2.0 feeds for the site and optionally per category. Configure under **Settings → RSS feeds**.

Files produced on the public site (relative to your `baseUrl`):

- `rss.xml` — site-wide feed of the latest online posts (count configurable, default 20). Categories can be excluded individually.
- `<category-slug>/<category-slug>.xml` — one per category feed enabled via the settings page. Slugs match the category archive folder so a reader can guess the URL from `/<category>/`.
- `rss.xsl` — shared stylesheet referenced by every feed file via an `<?xml-stylesheet?>` PI. Renders feeds as a styled HTML table when a human opens the URL in a browser; RSS readers ignore the PI and parse XML directly.

Configuration options:

- **Site feed** — toggle on/off, item count (1–100), excluded categories (multi-select), "Show in footer" checkbox.
- **Category feeds** — pick a category from an autocomplete combobox to add a new feed; per-feed item count + footer toggle. Removing a feed deletes its file on the next save.
- **Save settings** — persists the config, deletes files for disabled or removed feeds, and re-publishes `/menu.json` so the footer toggles take effect immediately.
- **Upload stylesheet** — uploads `rss.xsl` only. Run after a public-language change.
- **Force regenerate all feeds** — saves config + uploads XSL + regenerates every enabled feed + re-publishes the menu.

Incremental regeneration is automatic on every `publish.complete`, `post.unpublished`, and `post.deleted`: only the impacted feeds are rebuilt — the site feed (when the post's category isn't excluded) and the matching category feed (when one exists for `post.primaryTermId`). The plugin persists `lastPublishedPath` after each upload so a later category-slug rename can clean up the old file. The XSL is **not** re-uploaded by lifecycle hooks; refresh it via **Upload stylesheet** or **Force regenerate**.

Item descriptions use `post.excerpt` when set, otherwise the first ~300 characters of the markdown rendered to plaintext. Sort order is `publishedAt DESC` (with `updatedAt` / `createdAt` fallbacks).

Cover images: when a post has a `heroMediaId`, the item gets an RSS 2.0 `<enclosure url="..." length="..." type="..."/>` element. Most modern readers (Feedly, Inoreader, NetNewsWire, Reeder) display this as the article thumbnail. Variant selection prefers `large`, falls back to the asset's `defaultFormat`, then any available variant — same chain as the publisher's `og:image`. Legacy single-URL media is supported transparently. `length` is the variant's stored byte count (`0` when unknown, which readers tolerate); `type` is the asset's `contentType` or guessed from the URL extension.

Footer items injected by this plugin appear at the **end** of the resolved footer in `/menu.json`. Labels are auto-generated: `RSS` for the site feed, `RSS — <category name>` for per-category feeds. To control placement or labels manually, leave the addToFooter checkboxes off and add custom items via **Menus** with the feed URL as an external link.

## Tests

```bash
npm test          # runs the Vitest suite once
npm run typecheck # TypeScript strict mode
```

Critical units have unit tests:

- `core/slug` — URL building, slugification, validation.
- `core/pluginRegistry` — filter/action ordering, sync vs. async semantics.

## Limitations

- The Flexweg API key sits in Firestore. Any signed-in admin can read it via devtools — fine for an internal tool, do not deploy this pattern to a multi-tenant or public-facing app.
- The publisher serialises uploads to avoid hitting API rate limits; very large sites (hundreds of pages) take a while when "Regenerate site" runs.
- Content is single-language per site (the public language). Admins choose their own UI language separately. Multi-language content can be added later as a plugin.
