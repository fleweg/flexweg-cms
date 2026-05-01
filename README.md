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
│   │   └── core-seo/    Built-in SEO plugin
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
              .hasOnly(["preferences"])
          && request.resource.data.preferences.adminLocale in ["en", "fr"]
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
- **Self update is restricted to language preference**: a regular user can change `preferences.adminLocale` (used by the in-admin language switcher) but cannot touch their own role or disabled flag. Admins can update any field.
- **`config/flexweg` requires admin to write**: editors can read the API key (the publisher needs it), but only admins can rotate it.
- **Each rule call performs one extra read** via `selfRecord()`. Acceptable for an internal tool; if you need to optimize later, switch to [Firebase Auth custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) (requires an admin SDK backend to set them).

If you want only admins to manage themes/plugins/menus, change `allow write: if isEditor();` to `allow write: if isAdmin();` on `match /settings/{docId}`.

## Building & deploying

```bash
npm run build
```

This produces `dist/` containing:

- `index.html` + admin SPA assets (deploy to `/admin/` on your Flexweg site).
- `theme-assets/<theme-id>.css` per theme (one file per theme directory).

Deploy `dist/` to `/admin/` on your Flexweg site (zip it and upload via the Flexweg dashboard, or use the Files API). Then, from the admin, open **Themes → Sync theme assets** to push the CSS bundles to your public site.

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

## Creating a new theme

1. Copy `src/themes/default/` to `src/themes/<your-theme-id>/`.
2. Update `manifest.ts` with a unique `id`, `name`, `version`.
3. Edit `templates/*.tsx` and `theme.scss` as needed. Components receive only serialisable props — don't import Firestore hooks from theme code.
4. Register the theme by appending `<your-theme-id>Manifest` to `THEMES` in `src/themes/index.ts`.
5. Run `npm run build` to compile the SCSS, then sync theme assets from the admin.

The active theme is selected per-site in **Themes**. Switching activates a "Regenerate site" workflow that re-publishes every online post.

## Creating a plugin

Plugins are bundled into the admin and toggled on/off per site in **Plugins**. Each plugin exports a manifest with a `register(api)` function that hooks into the registry:

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
    api.addAction("publish.complete", (post) => {
      console.log("published", post);
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
| `publish.before` | action | `(post)` |
| `publish.after` | action | `(post)` |
| `publish.complete` | action | `(post)` |

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
