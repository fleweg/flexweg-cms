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
  // WordPress attachments — each has a remote URL the importer
  // fetches during the upload phase. Empty for markdown imports
  // (those use local images uploaded via the dropzone or fetched
  // from the Flexweg `_cms-import/images/` folder).
  attachments: WordPressAttachment[];
  warnings: ParseWarning[];
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

// Top-level dispatcher. Detects the format and routes to the right
// parser. Each .md file becomes one entry; an .xml file may produce
// many entries + many attachments.
export function parseSources(sources: SourceFile[]): ParseResult {
  const entries: ParsedEntry[] = [];
  const terms: ParsedTerm[] = [];
  const attachments: WordPressAttachment[] = [];
  const warnings: ParseWarning[] = [];

  for (const file of sources) {
    if (file.kind === "markdown") {
      const result = parseMarkdownFile(file.content, file.name);
      if (result.entry) entries.push(result.entry);
      warnings.push(...result.warnings);
    } else {
      const result = parseWordPressXml(file.content, file.name);
      entries.push(...result.entries);
      terms.push(...result.terms);
      attachments.push(...result.attachments);
      warnings.push(...result.warnings);
    }
  }

  return { entries, terms, attachments, warnings };
}

export interface SourceFile {
  kind: "markdown" | "wordpress";
  // Display name (file basename) for warnings + dry-run table.
  name: string;
  content: string;
}
