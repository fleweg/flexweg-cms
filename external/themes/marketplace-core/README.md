# Marketplace Core — Flexweg CMS theme

App-store style theme for listing **themes and plugins** for the Flexweg CMS. Modern Corporate aesthetic with ambient shadows, rounded XL corners, blue primary, and Hanken Grotesk + Inter typography.

## Build & install

```bash
cd external/themes/marketplace-core
npm install --legacy-peer-deps
npm run build
```

This produces `marketplace-core.zip` at the project root, containing:
- `manifest.json` — entry metadata read by the admin's external loader
- `bundle.js` — ESM module that default-exports the `ThemeManifest`
- `theme.css` — verbatim stylesheet uploaded to `/theme-assets/marketplace-core.css`
- `README.md` — this file

Install on your CMS:

1. Open `/admin/#/themes` on your Flexweg CMS site
2. Click **Install theme** (top right)
3. Drag and drop `marketplace-core.zip`
4. Activate the theme on the Themes page once installed
5. Open `/admin/#/theme-settings` to configure the 5 tabs (Home / Single / Sidebar / Footer / Style)

## Content model

Each marketplace listing (theme or plugin) is a regular CMS post:

| Post field | Marketplace meaning |
|---|---|
| `title` | Product name (e.g. "Modernist CRM Interface") |
| `excerpt` | One-line tagline |
| `heroMediaId` | Main preview screenshot |
| `primaryTermId` | Category — Themes / Plugins / E-commerce / Analytics / Auth / etc. |
| `tags` | Topical tags |
| `authorId` | Creator (Flexweg admin user) |
| `contentMarkdown` | Description + 4 optional theme blocks |

### 4 theme blocks (embed in post body)

Each block is a `<div data-cms-block="marketplace-core/<id>" data-attrs="<base64 JSON>"></div>` marker — the theme's `post.html.body` filter expands it at publish time.

- **`marketplace-core/header-buttons`** — Free badge + Download URL + Live Preview URL (right column of the single page hero)
- **`marketplace-core/gallery`** — Thumbnail strip below the hero image, click to swap the main image
- **`marketplace-core/specs`** — 2-column spec table (Version / License / Last Updated / Requires Flexweg ≥ …)
- **`marketplace-core/features`** — Bento of "Key Features" with icon + title + description per item

Authoring tip: the easiest way to populate these is to import the companion content bundle (`demo-content/marketplace-core/`) and edit from the admin afterwards.

## Layout map

### Home
- Hero gradient banner (primary → tertiary)
- Featured Plugins section (2 wide cards, sourced from the configured category)
- New Themes section (3-col grid, sourced from the configured category)
- Recently Updated section (optional, 3-col grid of newest posts across all categories)

### Single product
- Left: hero image (16:10) + thumbnail strip
- Right: category + title + author + excerpt + Free badge + Download/Preview buttons
- Below: Description prose + Specifications table + Key Features bento

### Category archive
- Breadcrumb + title + description + 3-col grid

### Author page
- Profile card (avatar + name + title + bio)
- Filter tabs (All / per-category) — inline JS, no external loader
- 3-col grid of the author's products

### Mobile
- Sidebar collapses to a bottom-nav bar (Home / Themes / Plugins / Authors)
- Cards stack to single column
- Hero section keeps the gradient

## Brand customisation

Theme Settings → **Style & branding** tab:
- Palette: 5 color tokens editable via `<input type="color">` (Primary / Secondary / Tertiary / Background / Text)
- Typography: Headline font + Body font, free text input (any Google Fonts family that matches the bundled `@import` will load)
- Wordmark text (header + footer)

## License

Use freely — no attribution required.
