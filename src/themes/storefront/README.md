# Storefront theme

E-commerce / boutique theme for Flexweg CMS. Designed for product
catalog sites — florists, artisanal goods, slow-fashion, gift shops —
where every post is a product with prices, stock, variants, and a
"reservation inquiry" CTA flow.

Static-host friendly: there is no real cart server. Buttons either
hand off to a third-party checkout (Stripe Payment Link, Shopify URL,
Lemonsqueezy, etc.) or open a `mailto:` for inquiry-style sales.

## Aesthetic

Organic minimalism — sage-green primary, terracotta accent, off-white
background. Editorial Playfair Display headings paired with utility
Inter body. Mobile-first with a generous "quiet luxury" white-space
language. See `style.ts` for the full Material 3 color token list and
font preset list.

## Templates

- **Home** — composes the hero, curated-collections bento, trending
  products grid, and journal feature, all configurable from
  `/theme-settings → Home`.
- **Single (product page)** — full-bleed hero image left, breadcrumb
  + title + extracted product-info card right (price / promo / stock
  / variants / CTAs), then body markdown with care-kit sidebar +
  related products row.
- **Category** — clickable category sidebar (replaces the static
  facet filters from the mockup since static hosts can't run
  server-side filtering — the catalog page handles facets via
  client-side JS instead) + 3-col product grid.
- **Author** — portrait + bio + signature collection grid.
- **Catalog** — system page published at `catalog.html` (slug
  configurable). Lists every online product with search / category /
  tag / price / stock / sort filters, all client-side via FLIP-
  animated reorder. See "Catalog feature" below.
- **NotFound** — minimal centered 404.

## Editor blocks

Eight user-insertable blocks across two phases:

**Home blocks (Phase 2)**

- `storefront/hero-overlay` — full-width hero with frosted card
- `storefront/categories-bento` — 4-card bento grid of collections
- `storefront/journal-feature` — image + serif headline + CTA
- `storefront/newsletter` — email signup, two visual variants

**Commerce blocks (Phase 4)**

- `storefront/product-info` — invisible data block carrying prices,
  stock, variants, badges, CTAs. Extracted by SingleTemplate and
  rendered in the hero right column. Also feeds `/data/products.json`
  for the catalog feature.
- `storefront/product-gallery` — additional product photos
- `storefront/product-features` — 3-icon feature row
- `storefront/reviews-list` — testimonials section

## Catalog feature

Toggle in `/theme-settings → Catalog` (on by default).

When enabled, every publish / unpublish / delete cascades into:

1. Re-extracting `product-info` data from every online post's
   markdown.
2. Building `/data/products.json` with the resolved product set
   (URL, title, image, category, tags, prices, stock, badges,
   created-at).
3. Rendering `CatalogTemplate` to the configured slug
   (`catalog.html` by default) and uploading.
4. Auto-injecting a "Catalog" entry into the header menu via
   `menu.json.resolved` filter.

The catalog page itself ships with no products in its initial HTML —
`/theme-assets/storefront-catalog.js` fetches the JSON, renders the
cards, wires up filter widgets (search, categories, tags, price
range, stock, sort), and animates reorder via FLIP on filter change.

Force regenerate from `/theme-settings → Catalog → Force regenerate`.

## Theme settings (7 tabs)

1. **Home** — hero / bento / trending / journal / reviews
2. **Product page** — sidebar toggles, care-kit content
3. **Product defaults** — currency, tax rate, shipping, delivery
   label, default CTA, inquiry-only mode
4. **Catalog** — enabled toggle, slug, page copy, menu auto-link,
   filter visibility, default columns, force regenerate
5. **Footer** — newsletter form (Mailchimp / Buttondown / Formspree
   compatible POST endpoint OR mailto fallback), tagline, socials
6. **Logo & branding** — upload / replace / remove. Pushed to
   `/theme-assets/storefront-logo.webp` and referenced via the menu
   JSON's branding block.
7. **Style** — Material 3 palette (18 editable variables), font pair
   (Playfair Display + Inter by default — six curated alternatives
   each)

## CSS pipeline

Tailwind 3 + `theme.css` Material 3 token baseline. Compiled by
`scripts/build-theme-tailwind.mjs` (wired into `prebuild` and
`predev`) into `theme.compiled.css`, then imported as a string via
Vite's `?inline` suffix and uploaded to `/theme-assets/storefront.css`
on every save. The `compileCss(config)` hook on the manifest bakes
the user's Style overrides (color vars + Google Fonts URL swap) into
the uploaded CSS without touching any HTML.

## Static-host implications

- No real cart, payment, or wishlist persistence — the corresponding
  buttons are decorative or hand off to external services.
- Search / filter on the catalog is 100% client-side. Works fine for
  catalogs up to a few hundred products; beyond that the JSON blob
  size and filter latency are the bottlenecks.
- Reviews are author-curated via the `reviews-list` block — there's
  no submission flow.

## Default images

Out of the box, the home pulls hero / bento / journal images from
Unsplash via stable public URLs so a fresh install renders a
credible-looking storefront before the editor uploads anything.
Replace from `/theme-settings → Home`.
