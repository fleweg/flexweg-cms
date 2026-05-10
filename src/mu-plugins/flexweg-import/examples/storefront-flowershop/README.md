# Storefront flower-shop import bundle

A 30-product import fixture for testing the **Storefront** theme in a flower-shop context. Each product is a `post` with a hero image, a `storefront/product-info` block (price, currency, stock, badges, variants, CTAs) and a structured body (intro, ingredients, care notes).

Designed to populate a freshly-installed Flexweg CMS site running the Storefront theme so home / category / product / catalog pages render with realistic content. All copy is in English.

## What's inside

```
storefront-flowershop/
├── README.md                          (this file)
├── images/                            (30 Pexels photos, ~7.5 MB total)
│   ├── 01-spring-romance.jpg
│   ├── 02-garden-mix.jpg
│   └── ...
├── 01-spring-romance.md
├── 02-garden-mix.md
└── ... 30 .md files total
```

### 30 products across 5 categories

| Category | Count | Examples |
|---|---|---|
| **Bouquets** | 10 | Spring Romance, Garden Mix, Wildflower Meadow, Pink Peony, Sunflower Burst, Tropical Dream, Pastel Joy, Country Charm, English Garden, Modern Minimalist |
| **Wedding** | 6 | Bridal Cascade, White Elegance, Boho Flower Crown, Reception Centerpiece, Ceremony Arch, Bridesmaid Posy |
| **Funeral** | 5 | White Lily Tribute, Eternal Peace, Memorial Spray, Standing Spray, Garden Sympathy |
| **Plants** | 6 | Monstera Deliciosa, Phalaenopsis Orchid, Snake Plant, Fiddle-Leaf Fig, Succulent Trio, ZZ Plant |
| **Subscriptions** | 3 | Weekly, Monthly Specials, Bi-monthly Garden |

The five categories are auto-created by the importer if they don't already exist.

### Product-info block

Each `.md` file embeds a `storefront/product-info` marker as the first line of the body:

```html
<div data-cms-block="storefront/product-info" data-attrs="<base64-encoded-JSON>"></div>
```

The base64 payload decodes to a JSON object matching `ProductInfoAttrs` from the Storefront theme:

```json
{
  "priceHT": 91.67,
  "priceTTC": 110,
  "promoTTC": 0,
  "currency": "GBP",
  "stockStatus": "low-stock",
  "variants": [{ "label": "Size", "options": ["Small", "Medium (+ £15)", "Large (+ £30)"] }],
  "ctaPrimaryLabel": "Reserve this bouquet",
  "ctaPrimaryHref": "/contact.html",
  "ctaSecondaryLabel": "Ask a question",
  "ctaSecondaryHref": "mailto:hello@example.com",
  "badges": ["Limited", "Seasonal"]
}
```

After import, the Tiptap editor decodes the marker into a live `product-info` block — open any product in the admin editor and you'll see the product card render in the inspector, ready to edit.

### Pricing & currency

All prices are in **GBP**. Mix of price points:

- **Affordable** (£35–£60): everyday bouquets, succulent trio, snake plant
- **Mid** (£75–£170): garden roses, plants, funeral arrangements
- **Statement** (£200–£1000): wedding centerpieces, ceremony arch, bridal cascade

Some products carry promo prices to test the strike-through display:

| Product | Regular | Promo |
|---|---|---|
| Garden Mix | £60 | £48 |
| Pastel Joy | £65 | £52 |
| Phalaenopsis Orchid | £65 | £52 |
| Monthly Specials Subscription | £320 | £256 |

### Stock states

- 25 in stock
- 1 low-stock (Pink Peony — limited season)
- 4 on-order (the bigger wedding services)

### Badges

A mix of `New`, `Bestseller`, `Limited`, `Seasonal`, `Made to order`, `Per table`, `Per posy`, `Same-day`, `Best value`, `Hard to kill`, `Statement`. Used to test badge layout on listings + single-product pages.

### Variants

Most products carry one or two variants — Size, Wrapping, Vase, Pot, Colour, etc. Variant options include `+ £X` upcharge hints (purely informational; the theme doesn't compute totals).

### CTAs

All primary CTAs point at `/contact.html` (the conventional contact form on a static Flexweg site). Secondary CTAs use `mailto:hello@example.com` — replace with your real address before going live.

### Tags

Tags are auto-created by the importer (`spring`, `pink`, `romantic`, `seasonal`, `wedding`, `funeral`, `tropical`, `boho`, etc.). They show up on the public site under each post's metadata strip.

## Running the import

### Drag-and-drop mode (recommended for a one-off seed)

1. Activate the **Storefront** theme in `/admin/#/themes`.
2. Enable **Flexweg Import** in `/admin/#/plugins` (regular plugins tab).
3. Open `/admin/#/settings/plugin/flexweg-import`.
4. Switch source to **Drag and drop**.
5. Drag the entire `storefront-flowershop/` folder (including `images/`) into the drop zone.
6. Click **Scan** → the dry-run shows: 30 posts, 5 categories, ~25 tags, 30 images.
7. Click **Confirm import** → posts created as drafts, images uploaded through the multi-variant pipeline.
8. Open any product → click **Publish**.
9. Repeat for whatever subset you want online — or use the bulk-publish action from the posts list (filter by category to publish whole categories at once).

### Folder mode

1. Click **Initialize import folder** to create `_cms-import/` on your Flexweg site.
2. Upload the `.md` files to `_cms-import/`.
3. Upload the `images/` contents to `_cms-import/images/`.
4. **Refresh listing** → **Scan** → **Confirm import**.

## Image credits

All 30 images are from [Pexels](https://www.pexels.com/) under the [Pexels License](https://www.pexels.com/license/) (free for commercial use, no attribution required, no modification restrictions). The bundle hot-references the Pexels CDN at download time but stores the files locally — once imported, they live entirely on your Flexweg site through the standard media pipeline (multi-variant WebP, including the new `admin-original` 2000-px source variant).

## Customising before import

Each `.md` file is a regular CommonMark document with YAML frontmatter — open it in any editor to tweak:

- **Frontmatter**: `title`, `slug`, `category`, `tags`, `heroImage`, `excerpt`.
- **Product-info marker**: harder to edit by hand because the attrs are base64-encoded JSON. Easier path: import as-is, then edit prices / badges / CTAs from the admin's Tiptap inspector. Each marker survives the round-trip.
- **Body**: standard markdown after the marker — intro paragraph, "What's in it" list, "Care" paragraph. Edit freely.

If you want to regenerate the markers in bulk (e.g. switch all prices from GBP to EUR), the simplest path is a small script that:
1. Reads each `.md`
2. Locates the `data-attrs="..."` value, base64-decodes it, parses the JSON
3. Mutates the fields you care about
4. Re-encodes back to base64
5. Writes the file back

Same shape as the original generator — there's no special encoding beyond standard JSON + base64.

## Resetting between runs

- **Drag-drop mode**: just drop the folder again — nothing was archived locally, nothing tracks what's been imported.
- **Folder mode**: move the `.md` files back from `_cms-import/processed-<timestamp>/` to `_cms-import/`, or untoggle **Move processed files** in Defaults before importing.
- **Wipe imported content**: delete the 30 posts, 5 categories, ~25 tags, and 30 media files manually in the admin. The importer doesn't track what it created — it's a one-way pipeline.
