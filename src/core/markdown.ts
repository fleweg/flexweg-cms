import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked to produce GitHub-flavored markdown output. We keep things
// strict enough that injected HTML still goes through DOMPurify afterwards —
// markdown-it would also work, marked is just a smaller dep tree.
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Renders Markdown to safe HTML for inclusion in a static page. Sanitization
// is mandatory because the input is user-controlled (post body) and ends up
// in the public site without React's escape rules.
export function renderMarkdown(input: string): string {
  if (!input) return "";
  const rawHtml = marked.parse(input, { async: false }) as string;
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
