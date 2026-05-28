// Shared types and the top-level dispatcher. Both parsers
// (markdown frontmatter, WordPress WXR) converge on the same
// `ParsedEntry` shape, which is then resolved by the importer
// against existing CMS state (terms, users, media) before being
// fed to the dry-run summary.

import { parseMarkdownFile } from "./markdown";
import { parseWordPressXml } from "./wordpress";

// One importable post or page. The remote / source format has been
// normalised away — the importer doesn't care whether this came
// from a .md frontmatter or a <wp:item>.
export interface ParsedEntry {
  // For dry-run summary + warning attribution.
  sourceName: string;
  sourceFormat: "markdown" | "wordpress";

  type: "post" | "page";
  title: string;
  // Empty string means "derive from title" — the importer applies
  // findAvailableSlug() against the existing corpus + sibling batch
  // entries so collisions resolve deterministically.
  slug: string;
  // Original status from the source file. Whether this is honored
  // depends on the user's chosen ImportStatusMode.
  status: "draft" | "online";
  // Markdown body. WordPress entries went through turndown so
  // they're already markdown by the time they reach this struct.
  contentBody: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;

  // Image references. heroImage is a filename (markdown) or a URL
  // (WordPress). The importer resolves both via the imageMap built
  // during the upload phase.
  heroImage?: string;

  // Single primary category (the CMS model accepts one
  // primaryTermId). Resolved by name; auto-created if missing.
  categoryName?: string;
  // Optional parent for category creation — markdown's
  // `parentCategory:` or WP's `<wp:category_parent>`.
  parentCategoryName?: string;

  tags: string[];

  // Source author identifier — email (markdown frontmatter), display
  // name, or username (WordPress). Resolved against the users
  // collection by email first, then by displayName.
  authorRef?: string;

  // Real publication date. WP uses <wp:post_date>; markdown uses the
  // `publishedAt:` frontmatter field. Optional — if absent, the
  // importer uses the run timestamp.
  publishedAt?: Date;

  // Inline image references discovered in the body, keyed for the
  // rewrite pass. Markdown filenames (relative paths) are resolved
  // via the local imageMap; WP URLs are resolved via the wpUrlMap
  // built during the attachment-upload phase.
  inlineImages?: string[];

  // Original public URL of the post on the source system. WordPress
  // exports include this; markdown imports leave it undefined.
  // Stored on Post.legacyUrl so a future plugin can build redirect
  // tables — the importer doesn't read it itself.
  legacyUrl?: string;

  // Optional per-locale translations harvested from sibling
  // `<name>.<lang>.md` files. Keyed by language code (e.g. "fr").
  // Each entry carries the localised title, slug, contentBody,
  // excerpt and SEO fields. Categories + tags are shared (not
  // duplicated per language — see ParseResult.termTranslations for
  // those). Stored on `Post.translations` at import time and
  // consumed by the multilang plugin when installed. Plugin-free
  // sites can ignore the field; it stays opaque on the post.
  translations?: Record<string, ParsedPostTranslation>;
}

// Sidecar translation payload — the importer applies this to the
// final Post.translations[<lang>] entry after image refs are
// resolved + body rewritten (so localised inline images get the
// same media URL substitution as the primary body).
export interface ParsedPostTranslation {
  title: string;
  slug: string;
  contentBody: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ParseWarning {
  level: "warning" | "error";
  // File name (markdown) or the XML filename + post id (WordPress).
  source: string;
  message: string;
}

// Categories discovered during parse. WordPress gives us a flat list
// upfront; markdown frontmatter discovers them as it walks entries.
// Keyed by slug (lower-case ASCII, dash-separated).
export interface ParsedTerm {
  slug: string;
  name: string;
  // Slug of the parent term, when known. WordPress provides this
  // in `<wp:category_parent>` (also a slug). Markdown uses
  // `parentCategory:` which is a name — the parser slugifies it
  // before storing here.
  parentSlug?: string;
  type: "category" | "tag";
}

export interface ParseResult {
  entries: ParsedEntry[];
  // Categories + tags collected across all files.  May contain
  // duplicates between files; the importer dedupes by slug.
  terms: ParsedTerm[];
  // Optional term translations loaded from a bundle-root
  // `_terms.json` file. Keyed by source term identifier ({type, name}
  // or {type, slug}) so the importer can apply them after the term
  // is created. Plugin-free sites ignore these.
  termTranslations: ParsedTermTranslations[];
  // WordPress attachments — each has a remote URL the importer
  // fetches during the upload phase. Empty for markdown imports
  // (those use local images uploaded via the dropzone or fetched
  // from the Flexweg `_cms-import/images/` folder).
  attachments: WordPressAttachment[];
  warnings: ParseWarning[];
}

// One row in `_terms.json`. Identifies a term by its primary-language
// name OR slug, then declares per-language { name, slug, description? }
// payloads stored on `Term.translations` after the term is created
// (or matched against an existing term).
export interface ParsedTermTranslations {
  type: "category" | "tag";
  // Primary-language name (matches the markdown frontmatter `category:`
  // field). Used to pair this translation set with the term created
  // by the entry that referenced it. The importer also matches by
  // slug as a fallback.
  name: string;
  translations: Record<string, { name: string; slug: string; description?: string }>;
}

export interface WordPressAttachment {
  // WordPress' internal id (used by `_thumbnail_id` postmeta to
  // reference attachments from posts).
  wpId: string;
  // Remote URL on the source WordPress site. Importer fetches
  // these during the upload pass.
  url: string;
  // Original filename (last path segment) — used as the seed name
  // for the new media doc.
  filename: string;
  // Post id this attachment was uploaded for, when known. The
  // importer uses this only for diagnostics.
  parentWpId?: string;
}

// Pairs translation sidecar files with their primary. A file named
// `welcome.fr.md` carries the FR translation of `welcome.md`. The
// pattern is `<base>.<2-letter-code>.md` — anything else is treated
// as a primary file.
//
// Returns the base name + language for a sidecar, or null when the
// file is a primary.
function detectSidecar(filename: string): { base: string; language: string } | null {
  const match = /^(.+)\.([a-z]{2}(?:-[a-z]{2})?)\.md$/i.exec(filename);
  if (!match) return null;
  return { base: match[1]!, language: match[2]!.toLowerCase() };
}

// Top-level dispatcher. Detects the format and routes to the right
// parser. Each .md file becomes one entry; an .xml file may produce
// many entries + many attachments. Markdown sidecars (e.g.
// `welcome.fr.md`) are paired with their primary file and stored on
// `entry.translations[<lang>]` so the importer surfaces the multilang
// payload through the standard Post.translations channel.
export function parseSources(sources: SourceFile[]): ParseResult {
  const entries: ParsedEntry[] = [];
  const terms: ParsedTerm[] = [];
  const termTranslations: ParsedTermTranslations[] = [];
  const attachments: WordPressAttachment[] = [];
  const warnings: ParseWarning[] = [];

  // Stage 1: detect optional `_terms.json` at the bundle root. The
  // file declares per-term translations to apply after the importer
  // creates each term. Format documented in docs/multilang-import.md
  // (and the demo-content/frenchies-blog bundle's README).
  for (const file of sources) {
    if (file.kind === "markdown" && /^_terms\.json$/i.test(file.name)) {
      try {
        const parsed = JSON.parse(file.content) as unknown;
        const list = extractTermTranslations(parsed);
        termTranslations.push(...list);
      } catch (err) {
        warnings.push({
          level: "warning",
          source: file.name,
          message: `_terms.json is not valid JSON: ${(err as Error).message}`,
        });
      }
    }
  }

  // Stage 2: split markdown files into primaries vs sidecars.
  const primaries: SourceFile[] = [];
  const sidecars: Array<{ base: string; language: string; file: SourceFile }> = [];
  for (const file of sources) {
    if (file.kind !== "markdown") continue;
    if (/^_/.test(file.name)) continue; // skip metadata files (_terms.json etc.)
    const sc = detectSidecar(file.name);
    if (sc) {
      sidecars.push({ base: sc.base, language: sc.language, file });
    } else {
      primaries.push(file);
    }
  }

  // Stage 3: parse primaries. Each becomes one ParsedEntry.
  const primaryByBase = new Map<string, ParsedEntry>();
  for (const file of primaries) {
    const result = parseMarkdownFile(file.content, file.name);
    if (result.entry) {
      entries.push(result.entry);
      const base = file.name.replace(/\.md$/i, "");
      primaryByBase.set(base, result.entry);
    }
    warnings.push(...result.warnings);
  }

  // Stage 4: parse sidecars + attach to their primary. A sidecar
  // without a matching primary is reported as a warning and skipped.
  for (const sc of sidecars) {
    const primary = primaryByBase.get(sc.base);
    if (!primary) {
      warnings.push({
        level: "warning",
        source: sc.file.name,
        message: `Sidecar translation has no matching primary file "${sc.base}.md" — skipped.`,
      });
      continue;
    }
    const result = parseMarkdownFile(sc.file.content, sc.file.name);
    warnings.push(...result.warnings);
    if (!result.entry) continue;
    primary.translations = primary.translations ?? {};
    primary.translations[sc.language] = {
      title: result.entry.title,
      // Fall back to a slugified title when the sidecar omits an
      // explicit slug — the multilang plugin requires a non-empty
      // slug to register the translation as "filled".
      slug: result.entry.slug || result.entry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      contentBody: result.entry.contentBody,
      excerpt: result.entry.excerpt,
      seoTitle: result.entry.seoTitle,
      seoDescription: result.entry.seoDescription,
    };
  }

  // Stage 5: WordPress files (unchanged).
  for (const file of sources) {
    if (file.kind !== "wordpress") continue;
    const result = parseWordPressXml(file.content, file.name);
    entries.push(...result.entries);
    terms.push(...result.terms);
    attachments.push(...result.attachments);
    warnings.push(...result.warnings);
  }

  return { entries, terms, termTranslations, attachments, warnings };
}

// Walks the JSON shape declared in `_terms.json`. Accepts either an
// array of entries OR an object keyed by primary name. Both shapes
// survive a few common author typos.
function extractTermTranslations(input: unknown): ParsedTermTranslations[] {
  if (!input || typeof input !== "object") return [];
  const out: ParsedTermTranslations[] = [];
  // Object shape: { "Care": { fr: {name,slug}, … }, … } scoped
  // under top-level "categories" / "tags" keys.
  const obj = input as Record<string, unknown>;
  for (const type of ["categories", "tags"] as const) {
    const group = obj[type];
    if (!group || typeof group !== "object") continue;
    const termType = type === "categories" ? "category" : "tag";
    for (const [name, raw] of Object.entries(group as Record<string, unknown>)) {
      if (!raw || typeof raw !== "object") continue;
      const translations: ParsedTermTranslations["translations"] = {};
      for (const [lang, payload] of Object.entries(raw as Record<string, unknown>)) {
        if (!payload || typeof payload !== "object") continue;
        const p = payload as Record<string, unknown>;
        if (typeof p.name !== "string" || typeof p.slug !== "string") continue;
        // Build the translation entry WITHOUT undefined fields —
        // Firestore rejects nested undefined values and would fail
        // the entire updateTerm call. The `description` key is only
        // included when explicitly provided as a string.
        const entry: { name: string; slug: string; description?: string } = {
          name: p.name,
          slug: p.slug,
        };
        if (typeof p.description === "string") entry.description = p.description;
        translations[lang] = entry;
      }
      if (Object.keys(translations).length > 0) {
        out.push({ type: termType, name, translations });
      }
    }
  }
  return out;
}

export interface SourceFile {
  kind: "markdown" | "wordpress";
  // Display name (file basename) for warnings + dry-run table.
  name: string;
  content: string;
}
