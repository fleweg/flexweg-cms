## Marketplace Core — official Flexweg listings content (EN + FR)

10 marketplace listings covering every first-party Flexweg theme and plugin, plus 3 static pages, ready to import via the **Flexweg Import** plugin into a CMS site running the **Marketplace Core** theme.

Every listing ships with a French translation sidecar (`.fr.md`) so the imported site is fully bilingual from day one. The taxonomy (Themes / Plugins + per-product tags) carries French translations in `_terms.json` — the importer applies them after each term is created.

Every listing points at the canonical download URL on [github.com/fleweg/flexweg-cms](https://github.com/fleweg/flexweg-cms/releases) and credits **Flexweg** as the creator.

## What's in it

```
demo-content/marketplace-core/
├── README.md
├── _generate.py                            ← regenerator (markdown + _terms.json)
├── _terms.json                             ← EN→FR category + tag translations
├── images/                                 ← 9 illustration JPGs (Pexels) + 1 placeholder for multilang
│
├── 01-corporate.md          + .fr.md       ↘
├── 02-magazine.md           + .fr.md        │  4 first-party themes
├── 03-portfolio.md          + .fr.md        │
├── 04-storefront.md         + .fr.md       ↗
├── 05-core-seo.md           + .fr.md       ↘
├── 06-flexweg-archives.md   + .fr.md        │
├── 07-flexweg-rss.md        + .fr.md        │  6 first-party plugins
├── 08-flexweg-search.md     + .fr.md        │  (incl. new Flexweg Multilang)
├── 09-flexweg-sitemaps.md   + .fr.md        │
├── 10-flexweg-multilang.md  + .fr.md       ↗
│
├── page-home.md             + .fr.md      ← strapi-style landing (wire as static home)
├── page-about.md            + .fr.md
├── page-guidelines.md       + .fr.md
└── page-contact.md          + .fr.md
```

### 10 listings across 2 categories

| Category | Items |
|---|---|
| **Themes** | Corporate, Magazine, Portfolio, Storefront |
| **Plugins** | Core SEO, Flexweg Archives, Flexweg RSS, Flexweg Search, Flexweg Sitemaps, Flexweg Multilang |

Each listing ships with 4 pre-filled marketplace-core blocks in its body:
- `marketplace-core/header-buttons` — Free badge + Download + Live Preview URLs + creator byline
- `marketplace-core/gallery` — single-image gallery (extend by editing the base64 attrs)
- `marketplace-core/specs` — Version / License / Last Updated / Requires Flexweg
- `marketplace-core/features` — 4 key features each with icon + title

The French sidecars re-encode each block with French labels ("Télécharger" / "Démo en ligne" / "Gratuit" / "par" / "Spécifications" / "Fonctionnalités clés") so the localized product pages stay coherent end-to-end.

## How to use

1. **Install the theme**:
   - `cd external/themes/marketplace-core && npm install --legacy-peer-deps && npm run build`
   - Upload `external/themes/marketplace-core/marketplace-core.zip` via `/admin/#/themes` → Install theme
   - Activate it in the Themes page
2. **Install the Multilang plugin** (required if you want the FR sidecars to land):
   - Enable **Flexweg Multilang** in `/admin/#/plugins`
   - In its settings, set the primary language to `en` and enable `fr` as a secondary language
3. **Install the import plugin**:
   - Enable **Flexweg Import** in `/admin/#/plugins`
4. **Import this bundle**:
   - Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
   - Drag the whole `demo-content/marketplace-core/` folder (including `images/`)
   - Click **Scan** → 10 posts + 3 pages, 2 categories (Themes / Plugins), ~30 tags, 9 images, EN + FR translations bundled
   - Click **Confirm import**
5. **Wire the landing home** (Marketplace Core ≥ v1.3.0):
   - Open `/admin/#/settings/general` → **Home** section → set **Home mode** to **Static page**
   - In **Home page**, pick the imported page titled *"Flexweg CMS — A modern static-host CMS"* (slug `home`)
   - This swaps the default category-grid home for the new 7-section landing built from the marketplace-core landing blocks (hero, stats, feature-grid, three feature-rows, CTA banner)
   - The FR locale automatically uses the `home.fr` translation — no extra config needed
6. **Publish**:
   - Bulk-publish the 10 listings + the 4 pages (home, about, guidelines, contact) from the posts/pages list — both `/` (EN) and `/fr/` (FR) URLs are emitted automatically by the multilang plugin
   - Wire menu entries in `/admin/#/menus` — suggested: HOME, THEMES, PLUGINS, ABOUT, GITHUB, and a per-language label on each item ("Accueil" / "Thèmes" / "Plugins" / "À propos")
7. **Configure** the theme via `/admin/#/theme-settings`:
   - **Sidebar** tab: edit the Discover items + Categories list
   - **Style** tab: optional palette overrides
   - **Home** tab settings are bypassed when **Home mode = Static page** (the landing page's blocks drive the layout instead)

## Regenerating the markdown files

Edit the structured catalog at the top of [`_generate.py`](_generate.py) (Product entries, page bodies, term translations) and re-run:

```bash
python3 _generate.py
```

The script rewrites every product `.md` + `.fr.md` pair plus `_terms.json` in one pass. It never touches `images/`, the README, or page-content authored by hand outside the script.

## Customizing the placeholder URLs

Every listing carries fake demo URLs that you'll want to replace before publishing:

- **Download URL** — points at `https://github.com/fleweg/flexweg-cms/releases/download/<id>-v1.0.0/<id>.zip`. Update to the real release tag once you cut one.
- **Live Preview URL** — points at `https://<id>.demo.flexweg.com`. Replace with your actual hosted demo URLs (or delete the preview button by clearing the field in the block inspector).

Edit each listing's **Download buttons** block via the post editor's inspector — no markdown surgery needed.

## Image credits

10 illustrations generated with Google Gemini following a single style guide (modern minimalist tech illustration, soft gradient backgrounds, floating geometric accents, no text, 3:2 landscape). Each image is named after the listing it illustrates (`01-corporate.jpg` … `10-multilang.jpg`) and ships at exactly 1600×1067 px.

Re-running the visual system: paste the master style guide from the marketplace-core authoring docs + the per-listing prompt in a fresh Gemini chat, then drop the resulting PNG into `images/` (the import scan auto-detects it). The naming convention is the only requirement — the importer matches files by `heroImage` in each post's frontmatter.
