## Marketplace Core — official Flexweg listings content

9 marketplace listings covering every first-party Flexweg theme and plugin, plus 3 static pages, ready to import via the **Flexweg Import** plugin into a CMS site running the **Marketplace Core** theme.

Every listing points at the canonical download URL on [github.com/fleweg/flexweg-cms](https://github.com/fleweg/flexweg-cms/releases) and credits **Flexweg** as the creator.

## What's in it

```
demo-content/marketplace-core/
├── README.md
├── images/                                  9 illustration images
├── 01-corporate.md          ↘
├── 02-magazine.md            │  4 first-party themes
├── 03-portfolio.md           │
├── 04-storefront.md         ↗
├── 05-core-seo.md           ↘
├── 06-flexweg-archives.md    │
├── 07-flexweg-rss.md         │  5 first-party plugins
├── 08-flexweg-search.md      │
├── 09-flexweg-sitemaps.md   ↗
├── page-about.md
├── page-guidelines.md
└── page-contact.md
```

### 9 listings across 2 categories

| Category | Items |
|---|---|
| **Themes** | Corporate, Magazine, Portfolio, Storefront |
| **Plugins** | Core SEO, Flexweg Archives, Flexweg RSS, Flexweg Search, Flexweg Sitemaps |

Each listing ships with 4 pre-filled marketplace-core blocks in its body:
- `marketplace-core/header-buttons` — Free badge + Download + Live Preview URLs + creator byline
- `marketplace-core/gallery` — single-image gallery (extend by editing the base64 attrs)
- `marketplace-core/specs` — Version / License / Last Updated / Requires Flexweg
- `marketplace-core/features` — 4 key features each with icon + title

## How to use

1. **Install the theme**:
   - `cd external/themes/marketplace-core && npm install --legacy-peer-deps && npm run build`
   - Upload `external/themes/marketplace-core/marketplace-core.zip` via `/admin/#/themes` → Install theme
   - Activate it in the Themes page
2. **Install the import plugin**:
   - Enable **Flexweg Import** in `/admin/#/plugins`
3. **Import this bundle**:
   - Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
   - Drag the whole `demo-content/marketplace-core/` folder (including `images/`)
   - Click **Scan** → 9 posts + 3 pages, 2 categories (Themes / Plugins), ~25 tags, 9 images
   - Click **Confirm import**
4. **Publish**:
   - Bulk-publish the 9 listings from the posts list
   - Wire menu entries in `/admin/#/menus` — suggested: HOME, THEMES, PLUGINS, ABOUT
5. **Configure** the theme via `/admin/#/theme-settings`:
   - **Home** tab: set featured/new category slugs to `plugins` / `themes`, edit the hero text
   - **Sidebar** tab: edit the Discover items + Categories list
   - **Style** tab: optional palette overrides

## Customizing the placeholder URLs

Every listing carries fake demo URLs that you'll want to replace before publishing:

- **Download URL** — points at `https://github.com/fleweg/flexweg-cms/releases/download/<id>-v1.0.0/<id>.zip`. Update to the real release tag once you cut one.
- **Live Preview URL** — points at `https://<id>.demo.flexweg.com`. Replace with your actual hosted demo URLs (or delete the preview button by clearing the field in the block inspector).

Edit each listing's **Download buttons** block via the post editor's inspector — no markdown surgery needed.

## Image credits

9 Pexels photos under the [Pexels License](https://www.pexels.com/license/) — free commercial use, no attribution required. Each image is named after the listing it illustrates (e.g. `01-corporate.jpg`, `08-search.jpg`).
