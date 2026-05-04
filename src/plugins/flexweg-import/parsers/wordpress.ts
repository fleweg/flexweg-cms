// WordPress eXtended RSS (WXR) parser. Consumes the .xml a
// WordPress site produces from Tools → Export → All content,
// converts each <item> into a normalised ParsedEntry, and emits
// the categories / tags / attachments encountered along the way.
//
// Parsing strategy: native DOMParser (no dep) on the full XML
// string. Memory profile is fine for typical exports (a 50 MB WXR
// is ~100 MB parsed — well within browser limits). For very large
// sites the user would split their export upstream.
//
// HTML-to-Markdown conversion: turndown, called per-item on the
// `<content:encoded>` text. Imported lazily here so the bundle
// pays for the dep only when an .xml is actually present in the
// sources.

import TurndownService from "turndown";
import type {
  ParsedEntry,
  ParsedTerm,
  ParseResult,
  ParseWarning,
  WordPressAttachment,
} from "./index";

// One Turndown instance reused across all items. Configured to
// preserve fenced code blocks, ATX headings (`#`), and standard
// asterisks for emphasis — the same flavour our tiptap-markdown
// editor produces, so a round-trip post→edit→republish stays
// stable.
function buildTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
    strongDelimiter: "**",
  });
  // Strip empty paragraphs the Gutenberg editor sometimes emits
  // (`<p>&nbsp;</p>`). They produce ugly blank `\n\n\n` runs.
  td.addRule("emptyParagraphs", {
    filter: (node) => node.nodeName === "P" && (node.textContent ?? "").trim().length === 0,
    replacement: () => "",
  });
  // Preserve <iframe> blocks verbatim — the flexweg-embeds plugin's
  // post.html.body filter recognises iframes as legitimate embed
  // markup at publish time.
  td.keep(["iframe"]);
  return td;
}

// XML namespace lookup: WP exports declare these in the root <rss>
// element. Browsers' getElementsByTagNameNS handles the resolution
// when we pass the namespace URI. Keeping these as constants makes
// the parsing readable.
const NS = {
  wp: "http://wordpress.org/export/1.2/",
  content: "http://purl.org/rss/1.0/modules/content/",
  excerpt: "http://wordpress.org/export/1.2/excerpt/",
  dc: "http://purl.org/dc/elements/1.1/",
};

// Reads the text content of the first child element matching `tag`
// in the given namespace. Returns "" if absent — WP exports are
// notoriously inconsistent with optional fields.
function readNs(parent: Element, namespace: string, tag: string): string {
  const nodes = parent.getElementsByTagNameNS(namespace, tag);
  if (nodes.length === 0) return "";
  return (nodes[0].textContent ?? "").trim();
}

function readText(parent: Element, tag: string): string {
  const nodes = parent.getElementsByTagName(tag);
  if (nodes.length === 0) return "";
  return (nodes[0].textContent ?? "").trim();
}

// Maps WP's status values to the CMS's two states. `pending`,
// `private` and `trash` all become draft so the user can review
// in the admin before publishing publicly. Surfaces a warning so
// they aren't silently re-classified.
function mapStatus(wpStatus: string): {
  status: "draft" | "online";
  warning?: string;
} {
  if (wpStatus === "publish") return { status: "online" };
  if (wpStatus === "draft") return { status: "draft" };
  if (wpStatus === "pending" || wpStatus === "private" || wpStatus === "trash") {
    return {
      status: "draft",
      warning: `Status "${wpStatus}" mapped to draft.`,
    };
  }
  if (wpStatus === "inherit" || wpStatus === "auto-draft") {
    return { status: "draft" };
  }
  return { status: "draft", warning: `Unknown WP status "${wpStatus}" — defaulting to draft.` };
}

// Builds the inline-image list by scraping <img src> from the raw
// HTML before turndown rewrites it to markdown. We need the full
// list so the importer can match against the WP attachment URLs
// when rewriting bodies.
function extractInlineImages(html: string): string[] {
  const matches = [...html.matchAll(/<img[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)];
  return matches.map((m) => m[1]);
}

export function parseWordPressXml(xml: string, sourceName: string): ParseResult {
  const warnings: ParseWarning[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror");
  if (parserError.length > 0) {
    return {
      entries: [],
      terms: [],
      attachments: [],
      warnings: [
        {
          level: "error",
          source: sourceName,
          message: `Malformed WordPress XML: ${parserError[0].textContent ?? "unknown error"}`,
        },
      ],
    };
  }

  // ─── Categories + tags (declared upfront in the channel) ────────
  const terms: ParsedTerm[] = [];
  const channel = doc.querySelector("rss > channel") ?? doc.querySelector("channel");
  if (channel) {
    const wpCategories = channel.getElementsByTagNameNS(NS.wp, "category");
    for (const cat of Array.from(wpCategories)) {
      const slug = readNs(cat, NS.wp, "category_nicename");
      const name = readNs(cat, NS.wp, "cat_name");
      const parentSlug = readNs(cat, NS.wp, "category_parent");
      if (!slug || !name) continue;
      terms.push({
        slug,
        name,
        parentSlug: parentSlug || undefined,
        type: "category",
      });
    }
    const wpTags = channel.getElementsByTagNameNS(NS.wp, "tag");
    for (const tag of Array.from(wpTags)) {
      const slug = readNs(tag, NS.wp, "tag_slug");
      const name = readNs(tag, NS.wp, "tag_name");
      if (!slug || !name) continue;
      terms.push({ slug, name, type: "tag" });
    }
  }

  // ─── Items: posts, pages, attachments ───────────────────────────
  const entries: ParsedEntry[] = [];
  const attachments: WordPressAttachment[] = [];
  // Lazy thumbnail map: built as we iterate. WP postmeta references
  // attachments by wpId, so we need both before we can resolve
  // hero images. We store wpId → ParsedEntry index now and patch
  // hero images in a second pass.
  const thumbnailRefs: { entryIndex: number; thumbnailWpId: string }[] = [];
  const attachmentByWpId = new Map<string, WordPressAttachment>();

  const td = buildTurndown();
  const items = doc.getElementsByTagName("item");
  for (const item of Array.from(items)) {
    const postType = readNs(item, NS.wp, "post_type");
    const wpId = readNs(item, NS.wp, "post_id");

    if (postType === "attachment") {
      const url = readNs(item, NS.wp, "attachment_url");
      const filename = url.split("/").pop() ?? `attachment-${wpId}`;
      const parentWpId = readNs(item, NS.wp, "post_parent");
      if (url) {
        const att: WordPressAttachment = {
          wpId,
          url,
          filename,
          parentWpId: parentWpId || undefined,
        };
        attachments.push(att);
        attachmentByWpId.set(wpId, att);
      }
      continue;
    }

    if (postType !== "post" && postType !== "page") continue;
    // Skip auto-draft / revision / oembed_cache / nav_menu_item / wp_block /
    // wp_template — anything not a real post/page/attachment.

    const wpStatus = readNs(item, NS.wp, "status");
    // WordPress creates `auto-draft` placeholder posts when a user
    // clicks "Add New Post" without saving. They have no real
    // content and WP cleans them up itself — but they leak into
    // exports anyway. Skip silently.
    if (wpStatus === "auto-draft") continue;

    const title = readText(item, "title");
    if (!title) {
      warnings.push({
        level: "warning",
        source: `${sourceName}#${wpId}`,
        message: "Item has no title — skipping.",
      });
      continue;
    }

    const slug = readNs(item, NS.wp, "post_name");
    const statusMapping = mapStatus(wpStatus);
    if (statusMapping.warning) {
      warnings.push({
        level: "warning",
        source: `${sourceName}#${title}`,
        message: statusMapping.warning,
      });
    }

    const rawHtml = readNs(item, NS.content, "encoded");
    // Turndown can throw on extremely malformed HTML (rare). Wrap
    // so a single bad item doesn't kill the whole batch.
    let body: string;
    try {
      body = rawHtml ? td.turndown(rawHtml) : "";
    } catch (err) {
      body = "";
      warnings.push({
        level: "warning",
        source: `${sourceName}#${title}`,
        message: `HTML to markdown conversion failed (${(err as Error).message}); body left empty.`,
      });
    }
    const excerpt = readNs(item, NS.excerpt, "encoded");

    const wpDate = readNs(item, NS.wp, "post_date_gmt") || readNs(item, NS.wp, "post_date");
    let publishedAt: Date | undefined;
    if (wpDate && wpDate !== "0000-00-00 00:00:00") {
      // WP `post_date` format: "2026-01-15 10:30:00" (no T, no Z).
      // Treat post_date_gmt as UTC; post_date as local of the
      // exporting site (we just trust it). Date constructor handles
      // both via permissive parsing.
      const d = new Date(wpDate.replace(" ", "T") + "Z");
      if (!Number.isNaN(d.getTime())) publishedAt = d;
    }

    // Categories + tags from the <category> elements inside the item.
    // <category domain="category" nicename="..."> → primary candidate
    // <category domain="post_tag" nicename="..."> → tag.
    let primaryCategoryName: string | undefined;
    let parentCategoryName: string | undefined;
    const extraCategoryTags: string[] = [];
    const tagNames: string[] = [];
    const itemCats = item.getElementsByTagName("category");
    for (const cat of Array.from(itemCats)) {
      const domain = cat.getAttribute("domain");
      const nicename = cat.getAttribute("nicename") ?? "";
      const text = (cat.textContent ?? "").trim();
      if (!text) continue;
      if (domain === "category") {
        if (!primaryCategoryName) {
          primaryCategoryName = text;
          // Look up the term we registered earlier to retrieve the
          // parent slug (so the importer can build the hierarchy).
          const term = terms.find(
            (t) => t.type === "category" && t.slug === nicename,
          );
          if (term?.parentSlug) {
            const parent = terms.find(
              (t) => t.type === "category" && t.slug === term.parentSlug,
            );
            if (parent) parentCategoryName = parent.name;
          }
        } else {
          // WP allows multiple categories per post; our model is
          // 1 primary + N tags. Demote the rest to tags.
          extraCategoryTags.push(text);
        }
      } else if (domain === "post_tag") {
        tagNames.push(text);
      }
    }
    if (extraCategoryTags.length > 0) {
      warnings.push({
        level: "warning",
        source: `${sourceName}#${title}`,
        message: `Multiple categories — keeping "${primaryCategoryName}" as primary, demoting [${extraCategoryTags.join(", ")}] to tags.`,
      });
      tagNames.push(...extraCategoryTags);
    }

    const authorRef = readNs(item, NS.dc, "creator");
    const legacyUrl = readText(item, "link");

    // Hero image is referenced via postmeta `_thumbnail_id` whose
    // value is the attachment's wpId. We resolve it in a second
    // pass after every <item> has been read.
    const postMetas = item.getElementsByTagNameNS(NS.wp, "postmeta");
    let thumbnailId: string | undefined;
    for (const meta of Array.from(postMetas)) {
      const key = readNs(meta, NS.wp, "meta_key");
      if (key === "_thumbnail_id") {
        thumbnailId = readNs(meta, NS.wp, "meta_value");
        break;
      }
    }

    const inlineImages = extractInlineImages(rawHtml);

    const entry: ParsedEntry = {
      sourceName: `${sourceName}#${title}`,
      sourceFormat: "wordpress",
      type: postType as "post" | "page",
      title,
      slug,
      status: statusMapping.status,
      contentBody: body,
      excerpt: excerpt || undefined,
      heroImage: undefined, // filled by the second pass below
      categoryName: primaryCategoryName,
      parentCategoryName,
      tags: tagNames,
      authorRef: authorRef || undefined,
      publishedAt,
      inlineImages: inlineImages.length > 0 ? inlineImages : undefined,
      legacyUrl: legacyUrl || undefined,
    };
    entries.push(entry);
    if (thumbnailId) {
      thumbnailRefs.push({ entryIndex: entries.length - 1, thumbnailWpId: thumbnailId });
    }
  }

  // ─── Resolve hero images via thumbnail postmeta ─────────────────
  for (const ref of thumbnailRefs) {
    const att = attachmentByWpId.get(ref.thumbnailWpId);
    if (att) {
      entries[ref.entryIndex].heroImage = att.url;
    } else {
      warnings.push({
        level: "warning",
        source: entries[ref.entryIndex].sourceName,
        message: `Hero image attachment #${ref.thumbnailWpId} not found in export — post will have no hero image.`,
      });
    }
  }

  return { entries, terms, attachments, warnings };
}
