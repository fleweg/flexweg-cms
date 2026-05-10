import { buildPostUrl } from "../core/slug";
import { mediaToView, pickFormat } from "../core/media";
import { postSortMillis } from "../core/postSort";
import type { Media, Post, SiteSettings, Term } from "../core/types";
import { deleteFile, uploadFile } from "./flexwegApi";

// Path on Flexweg of the public-side products feed. Grouped under
// `data/` alongside menu.json + posts.json + authors.json so the
// public-site root stays uncluttered.
export const PRODUCTS_JSON_PATH = "data/products.json";

// Minimal duck-typed shape of the storefront/product-info block's
// attrs. Defined here (rather than imported from the theme) because
// the theme is loaded as an external in prod and isn't in the same
// bundle as services/. The shape is the JSON contract — adding fields
// to either side without touching the other won't break decode.
interface ProductInfoAttrs {
  priceTTC?: number;
  promoTTC?: number;
  currency?: string;
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock" | "on-order" | "";
  badges?: string[];
}

// One product row in products.json. Fields are pre-resolved so the
// public-side catalog loader never needs to look anything up — same
// philosophy as menu.json / posts.json.
export interface CatalogProductEntry {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  // Resolved category metadata (only present when primaryTermId
  // resolves to an existing category).
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  // Tags by id + slug + name, denormalised for filter chips.
  tags: { id: string; slug: string; name: string }[];
  // Commerce fields — extracted from the product-info marker in the
  // post's markdown. Empty when the post has no product-info block.
  priceTTC: number;
  promoTTC: number;
  effectivePrice: number; // promo if set, else TTC, else 0
  currency: string;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "on-order" | "";
  badges: string[];
  // Sort key — milliseconds since epoch. Mirrors postSortMillis so
  // "newest first" matches the rest of the site.
  createdAt: number;
}

export interface CatalogProductsJson {
  generatedAt: number;
  currency: string;
  products: CatalogProductEntry[];
  facets: {
    categories: { id: string; slug: string; name: string; count: number }[];
    tags: { id: string; slug: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
    stockStatuses: string[];
    badges: string[];
  };
}

const PRODUCT_INFO_MARKER_RE =
  /<div\s+([^>]*data-cms-block="storefront\/product-info"[^>]*)>\s*<\/div>/;

// Extracts the FIRST product-info marker's attrs from a markdown
// string. The marker survives `tiptap-markdown`'s round-trip with
// `html: true` (which storefront blocks rely on) so this is safe to
// run on `post.contentMarkdown`.
function extractProductInfoFromMarkdown(markdown: string): ProductInfoAttrs | null {
  const m = markdown.match(PRODUCT_INFO_MARKER_RE);
  if (!m) return null;
  const attrsHtmlMatch = m[1].match(
    /data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/,
  );
  const attrsRaw = attrsHtmlMatch
    ? (attrsHtmlMatch[1] ?? attrsHtmlMatch[2] ?? attrsHtmlMatch[3] ?? "")
    : "";
  if (!attrsRaw) return null;
  try {
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(attrsRaw, "base64").toString("utf-8");
    } else {
      json = decodeURIComponent(escape(window.atob(attrsRaw)));
    }
    return JSON.parse(json) as ProductInfoAttrs;
  } catch {
    return null;
  }
}

function priceRange(products: CatalogProductEntry[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of products) {
    if (p.effectivePrice <= 0) continue;
    if (p.effectivePrice < min) min = p.effectivePrice;
    if (p.effectivePrice > max) max = p.effectivePrice;
  }
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max)) max = 0;
  return { min, max };
}

// Pure builder. No Firestore / API access happens here.
export function buildCatalogProductsJson(
  _settings: SiteSettings,
  posts: Post[],
  pages: Post[],
  terms: Term[],
  media: Map<string, Media> | Media[],
  productDefaults: { currency: string },
): CatalogProductsJson {
  const mediaMap =
    media instanceof Map ? media : new Map(media.map((m) => [m.id, m]));
  const termMap = new Map(terms.map((tt) => [tt.id, tt] as const));

  const onlinePosts = [...posts, ...pages].filter((p) => p.status === "online");

  const allProducts: CatalogProductEntry[] = [];
  const categoryCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  const stockStatuses = new Set<string>();
  const allBadges = new Set<string>();

  for (const post of onlinePosts) {
    const extracted = extractProductInfoFromMarkdown(post.contentMarkdown ?? "");
    if (!extracted) continue;

    const primaryTerm = post.primaryTermId ? termMap.get(post.primaryTermId) : undefined;
    const tagsResolved = (post.termIds ?? [])
      .map((id) => termMap.get(id))
      .filter((tt): tt is Term => !!tt && tt.type === "tag")
      .map((tt) => ({ id: tt.id, slug: tt.slug, name: tt.name }));

    let imageUrl = "";
    let imageAlt = post.title;
    if (post.heroMediaId) {
      const m = mediaMap.get(post.heroMediaId);
      if (m) {
        const view = mediaToView(m);
        if (view) {
          imageUrl = pickFormat(view, "medium");
          imageAlt = view.alt ?? post.title;
        }
      }
    }

    const url = buildPostUrl({ post, primaryTerm });
    const priceTTC = extracted.priceTTC ?? 0;
    const promoTTC = extracted.promoTTC ?? 0;
    const effectivePrice =
      promoTTC > 0 && promoTTC < priceTTC ? promoTTC : priceTTC;

    allProducts.push({
      id: post.id,
      url,
      title: post.title,
      excerpt: post.excerpt ?? "",
      imageUrl,
      imageAlt,
      categoryId: primaryTerm?.id ?? "",
      categorySlug: primaryTerm?.slug ?? "",
      categoryName: primaryTerm?.name ?? "",
      tags: tagsResolved,
      priceTTC,
      promoTTC,
      effectivePrice,
      currency: extracted.currency || productDefaults.currency,
      stockStatus: extracted.stockStatus ?? "",
      badges: Array.isArray(extracted.badges) ? extracted.badges : [],
      createdAt: postSortMillis(post),
    });

    if (primaryTerm) {
      categoryCounts.set(primaryTerm.id, (categoryCounts.get(primaryTerm.id) ?? 0) + 1);
    }
    for (const tag of tagsResolved) {
      tagCounts.set(tag.id, (tagCounts.get(tag.id) ?? 0) + 1);
    }
    if (extracted.stockStatus) stockStatuses.add(extracted.stockStatus);
    for (const b of allProducts[allProducts.length - 1].badges) allBadges.add(b);
  }

  allProducts.sort((a, b) => b.createdAt - a.createdAt);

  const categoryFacets = Array.from(categoryCounts.entries())
    .map(([id, count]) => {
      const term = termMap.get(id);
      if (!term) return null;
      return { id, slug: term.slug, name: term.name, count };
    })
    .filter((x): x is { id: string; slug: string; name: string; count: number } => !!x)
    .sort((a, b) => a.name.localeCompare(b.name));

  const tagFacets = Array.from(tagCounts.entries())
    .map(([id, count]) => {
      const term = termMap.get(id);
      if (!term) return null;
      return { id, slug: term.slug, name: term.name, count };
    })
    .filter((x): x is { id: string; slug: string; name: string; count: number } => !!x)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    generatedAt: Date.now(),
    currency: productDefaults.currency,
    products: allProducts,
    facets: {
      categories: categoryFacets,
      tags: tagFacets,
      priceRange: priceRange(allProducts),
      stockStatuses: Array.from(stockStatuses).sort(),
      badges: Array.from(allBadges).sort(),
    },
  };
}

// Uploads /data/products.json with the resolved product set.
export async function publishProductsJson(
  settings: SiteSettings,
  posts: Post[],
  pages: Post[],
  terms: Term[],
  media: Map<string, Media> | Media[],
  productDefaults: { currency: string },
): Promise<CatalogProductsJson> {
  const blob = buildCatalogProductsJson(
    settings,
    posts,
    pages,
    terms,
    media,
    productDefaults,
  );
  await uploadFile({
    path: PRODUCTS_JSON_PATH,
    content: JSON.stringify(blob),
    encoding: "utf-8",
  });
  return blob;
}

export async function deleteProductsJson(): Promise<void> {
  try {
    await deleteFile(PRODUCTS_JSON_PATH);
  } catch {
    /* swallow — already absent */
  }
}

// Validates a slug — relative path, no leading slash, must end in
// .html or be empty. Returns the cleaned slug or the default.
export function validateCatalogSlug(slug: string): string {
  const trimmed = (slug ?? "").trim().replace(/^\/+/, "");
  if (!trimmed) return "catalog.html";
  return trimmed;
}
