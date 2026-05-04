// In-house YAML frontmatter parser. Covers exactly the subset the
// import format needs:
//
//   • scalar strings (with or without quotes)
//   • numbers (parsed as numbers)
//   • booleans (true / false)
//   • inline arrays: `tags: [a, b, c]`
//   • block arrays:
//       tags:
//         - a
//         - b
//   • dates (kept as strings; converted by the importer)
//
// No nested objects, no anchors, no aliases — those don't appear in
// any blog-export format we target. Pulling in a full YAML library
// (~200 KB gzipped) would dwarf the rest of the plugin and the user
// can always pre-process exotic frontmatter into our subset.
//
// Errors are surfaced as throws so callers can attach the file path
// before bubbling up to the dry-run summary.

import type { ParsedEntry, ParseWarning } from "./index";

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>;
  body: string;
}

const FENCE = /^---\s*\r?\n/;
const FENCE_END = /\r?\n---\s*(?:\r?\n|$)/;

// Splits a markdown file into its frontmatter object + body string.
// Returns body-only when no frontmatter fence is present (the user
// can still import a plain .md as a draft titled by the filename).
export function splitFrontmatter(text: string): ParsedMarkdown {
  if (!FENCE.test(text)) return { frontmatter: {}, body: text };
  const afterOpen = text.replace(FENCE, "");
  const match = FENCE_END.exec(afterOpen);
  if (!match) {
    // Open fence with no close — treat the whole file as body and
    // record the missing close as a warning at the caller layer.
    return { frontmatter: {}, body: text };
  }
  const yamlText = afterOpen.slice(0, match.index);
  const body = afterOpen.slice(match.index + match[0].length);
  return { frontmatter: parseYamlSubset(yamlText), body };
}

// Tiny YAML parser. Walks the text line by line, stripping `#`
// comments, and dispatches based on the line shape.
function parseYamlSubset(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = stripComment(raw).trimEnd();
    if (!line.trim()) {
      i++;
      continue;
    }
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      throw new Error(`Invalid frontmatter line: "${raw}"`);
    }
    const key = line.slice(0, colonIdx).trim();
    const valuePart = line.slice(colonIdx + 1).trim();
    if (valuePart.length === 0) {
      // Block array on the next lines: `key:\n  - a\n  - b`.
      const items: unknown[] = [];
      i++;
      while (i < lines.length) {
        const peek = stripComment(lines[i]).trim();
        if (!peek.startsWith("- ")) break;
        items.push(decodeScalar(peek.slice(2).trim()));
        i++;
      }
      result[key] = items;
      continue;
    }
    if (valuePart.startsWith("[") && valuePart.endsWith("]")) {
      // Inline array: `tags: [a, "b c", 'd']`.
      result[key] = parseInlineArray(valuePart);
    } else {
      result[key] = decodeScalar(valuePart);
    }
    i++;
  }
  return result;
}

// `# comment` strips everything after, but NOT inside a quoted string.
// Frontmatter strings rarely contain `#` so the simple version
// (split on first un-escaped `#`) is fine.
function stripComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble) return line.slice(0, i);
  }
  return line;
}

function decodeScalar(value: string): unknown {
  if (!value) return "";
  // Quoted strings — strip the wrapper, no escape processing
  // (frontmatter content shouldn't need it for our use case).
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;
  // Numeric? Accept negative + decimals. Reject leading zeros (those
  // are typically slugs like "01-name", not numbers).
  if (/^-?\d+(?:\.\d+)?$/.test(value) && !/^0\d/.test(value)) {
    return Number(value);
  }
  return value;
}

function parseInlineArray(text: string): unknown[] {
  const inner = text.slice(1, -1).trim();
  if (!inner) return [];
  const items: string[] = [];
  let buf = "";
  let inSingle = false;
  let inDouble = false;
  for (const ch of inner) {
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    if (ch === "," && !inSingle && !inDouble) {
      items.push(buf.trim());
      buf = "";
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) items.push(buf.trim());
  return items.map(decodeScalar);
}

// ─── Higher-level: file → ParsedEntry ──────────────────────────────

export interface MarkdownParseResult {
  entry: ParsedEntry | null; // null when the file is too broken to import
  warnings: ParseWarning[];
}

// Builds a ParsedEntry from a single .md file. Returns null + an
// error-level warning when the file is fatally malformed (no title).
// Anything else (missing optional fields, weird dates, unknown
// frontmatter keys) becomes a non-blocking warning.
export function parseMarkdownFile(text: string, sourceName: string): MarkdownParseResult {
  const warnings: ParseWarning[] = [];
  let split: ParsedMarkdown;
  try {
    split = splitFrontmatter(text);
  } catch (err) {
    return {
      entry: null,
      warnings: [
        {
          level: "error",
          source: sourceName,
          message: `Invalid frontmatter: ${(err as Error).message}`,
        },
      ],
    };
  }

  const fm = split.frontmatter;
  const title = readString(fm.title);
  if (!title) {
    return {
      entry: null,
      warnings: [
        { level: "error", source: sourceName, message: "Missing required field: title" },
      ],
    };
  }

  const type = readString(fm.type) === "page" ? "page" : "post";
  const status = readString(fm.status) === "online" ? "online" : "draft";
  const slug = readString(fm.slug) || ""; // empty → importer slugifies the title
  const excerpt = readString(fm.excerpt);
  const seoTitle = readString(fm.seoTitle);
  const seoDescription = readString(fm.seoDescription);
  const heroImage = readString(fm.heroImage);
  const category = readString(fm.category);
  const parentCategory = readString(fm.parentCategory);
  const authorRef = readString(fm.author);
  const tags = readStringArray(fm.tags);

  const publishedAtRaw = readString(fm.publishedAt);
  let publishedAt: Date | undefined;
  if (publishedAtRaw) {
    const parsed = new Date(publishedAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      warnings.push({
        level: "warning",
        source: sourceName,
        message: `Invalid publishedAt: "${publishedAtRaw}" — using import time instead.`,
      });
    } else {
      publishedAt = parsed;
    }
  }

  return {
    entry: {
      sourceName,
      sourceFormat: "markdown",
      type,
      title,
      slug,
      status,
      contentBody: split.body,
      excerpt: excerpt || undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      heroImage: heroImage || undefined,
      categoryName: category || undefined,
      parentCategoryName: parentCategory || undefined,
      tags,
      authorRef: authorRef || undefined,
      publishedAt,
    },
    warnings,
  };
}

function readString(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  return "";
}

function readStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim());
}
