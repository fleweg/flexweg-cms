import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked to produce GitHub-flavored markdown output. We keep things
// strict enough that injected HTML still goes through DOMPurify afterwards —
// markdown-it would also work, marked is just a smaller dep tree.
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Classifies a markdown line by its block kind. Returns null for plain
// paragraph text. Used by `normalizeBlockBreaks` to decide where to
// insert blank-line separators.
function blockKind(line: string): string | null {
  if (/^#{1,6}\s/.test(line)) return "heading";
  if (/^>/.test(line)) return "blockquote";
  if (/^[*\-+]\s/.test(line)) return "ul";
  if (/^\d+\.\s/.test(line)) return "ol";
  if (/^!\[/.test(line)) return "image";
  if (/^<\w/.test(line)) return "html";
  if (/^---+\s*$/.test(line)) return "hr";
  if (/^```/.test(line)) return "fence";
  return null;
}

// Inserts blank lines between consecutive markdown lines whose block
// kinds differ — fixes the Tiptap-markdown serialization quirk where
// an image / HTML block / heading runs straight into the next block
// with a single `\n`, which marked treats as lazy paragraph
// continuation. Idempotent: pre-normalised input passes through
// unchanged. Skips work inside fenced code blocks so triple-backtick
// content stays intact.
function normalizeBlockBreaks(md: string): string {
  // First: split block-level patterns that ended up on a single line
  // because the editor concatenated them without any newline. Common
  // cases observed in the wild:
  //   - `![alt](url)# Heading`
  //   - `</div>![alt](url)`
  //   - `</div># Heading`
  // We only re-insert a newline; the line-by-line pass below then
  // promotes that single newline to a blank-line block boundary.
  const split = md
    // image immediately followed by a heading marker
    .replace(/(!\[[^\]]*\]\([^)]*\))(#{1,6}\s)/g, "$1\n$2")
    // closing HTML tag immediately followed by an image
    .replace(/(<\/\w+>)(!\[)/g, "$1\n$2")
    // closing HTML tag immediately followed by a heading marker
    .replace(/(<\/\w+>)(#{1,6}\s)/g, "$1\n$2");

  const lines = split.split("\n");
  const out: string[] = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    const isFenceMarker = /^```/.test(cur);
    if (!inFence && cur && out.length > 0) {
      const prev = out[out.length - 1];
      if (prev) {
        const curKind = blockKind(cur);
        const prevKind = blockKind(prev);
        if (curKind !== prevKind) out.push("");
      }
    }
    out.push(cur);
    if (isFenceMarker) inFence = !inFence;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

// Renders Markdown to safe HTML for inclusion in a static page. Sanitization
// is mandatory because the input is user-controlled (post body) and ends up
// in the public site without React's escape rules.
export function renderMarkdown(input: string): string {
  if (!input) return "";
  const rawHtml = marked.parse(normalizeBlockBreaks(input), { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });
}

// Strips markdown to plain text for excerpts. Naive but good enough — meant
// for SEO descriptions and listing previews where layout would break with
// rich content.
export function markdownToPlainText(input: string, maxLength = 200): string {
  if (!input) return "";
  const noHtml = renderMarkdown(input).replace(/<[^>]*>/g, "");
  const collapsed = noHtml.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLength) return collapsed;
  return collapsed.slice(0, maxLength).trimEnd() + "…";
}
