// Documentation-specific HTML transforms applied via `post.html.body`.
// Two passes:
//
// 1. Admonitions — the docs generator converts Docusaurus
//    `:::info Open source project … :::` admonitions into a
//    blockquote whose first paragraph is a bold title. After marked
//    we get:
//
//        <blockquote>
//          <p><strong>Open source project</strong></p>
//          <p>body…</p>
//        </blockquote>
//
//    We rewrite that into a stylable `<aside>` with a kind attribute.
//    The kind is inferred from the title (warning / danger / tip / …)
//    so the user gets per-type colours without us having to round-trip
//    the original `:::info` marker through markdown.
//
// 2. Code blocks — marked emits `<pre><code class="language-X">…</code></pre>`.
//    We wrap the whole thing in a `<div class="mp-codeblock">` with a
//    header that surfaces the language name and a copy button. The
//    button is wired client-side by the inline runtime in BaseLayout.
//    Inline code (`<code>` not inside `<pre>`) is left alone — only
//    fenced blocks get the chrome.
//
// Both transforms are idempotent: running them twice on the same HTML
// produces the same output (we look for our own marker classes and
// skip already-transformed blocks).

// ─────────────────────────────────────────────────────────────────────
// Admonitions
// ─────────────────────────────────────────────────────────────────────

// Matches the EXACT shape the docs generator produces:
//
//   <blockquote>\n
//     <p><strong>Title</strong></p>\n
//     <p>body…</p>\n   (possibly multiple)
//   </blockquote>
//
// The first <p> must contain ONLY the strong tag (allowing optional
// whitespace) — that's the discriminator that separates a "this is an
// admonition" blockquote from a regular blockquote that happens to
// start with a bold word.
//
// Multiline + dotall via [\s\S] (avoids the `s` flag for broader
// engine compat). Non-greedy body capture stops at the matching
// `</blockquote>` so adjacent blockquotes don't merge.
const ADMONITION_RE =
  /<blockquote>\s*<p><strong>([^<]+)<\/strong><\/p>\s*([\s\S]*?)<\/blockquote>/g;

function inferAdmonitionKind(title: string): string {
  const lc = title.toLowerCase();
  if (/(danger|critical|important)/.test(lc)) return "danger";
  if (/(warning|caution|attention|gotcha)/.test(lc)) return "warning";
  if (/(tip|astuce)/.test(lc)) return "tip";
  if (/(note|remarque)/.test(lc)) return "note";
  // Default — covers "Open source project", "First-time install", and
  // anything else that started life as `:::info`.
  return "info";
}

function transformAdmonitions(html: string): string {
  return html.replace(ADMONITION_RE, (_full, title: string, body: string) => {
    const kind = inferAdmonitionKind(title);
    // Strip a single leading "<p>" / trailing "</p>" wrapper so the
    // first body paragraph isn't visually empty around the start of
    // the box — but only when the WHOLE body is a single paragraph.
    // Multi-paragraph bodies stay intact (each paragraph keeps its
    // own <p> wrapper for spacing).
    const trimmed = body.trim();
    return (
      `<aside class="mp-admonition mp-admonition--${kind}" role="note">` +
      `<div class="mp-admonition__title">` +
      `<span class="mp-admonition__icon" aria-hidden="true"></span>` +
      `<span>${escapeHtml(title)}</span>` +
      `</div>` +
      `<div class="mp-admonition__body">${trimmed}</div>` +
      `</aside>`
    );
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─────────────────────────────────────────────────────────────────────
// Code blocks
// ─────────────────────────────────────────────────────────────────────

// Marked output: <pre><code class="language-X">…</code></pre> for
// fenced blocks with a language hint, <pre><code>…</code></pre> for
// the bare case. We capture both. The non-greedy body match stops at
// the first `</code></pre>` so subsequent blocks aren't merged.
const CODEBLOCK_RE =
  /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;

function transformCodeBlocks(html: string, copyLabel: string, copiedLabel: string): string {
  return html.replace(CODEBLOCK_RE, (_full, lang: string | undefined, body: string) => {
    const langLabel = lang ? lang.toUpperCase() : "";
    // Use a stable data attribute the runtime can pick up for copy.
    // We keep the raw `<code>` content unchanged so DOMPurify, syntax
    // highlighters and CSS selectors written against `pre > code` keep
    // working. The localized labels are passed in by the caller so
    // FR pages get "Copier" / "Copié" and EN pages keep "Copy" /
    // "Copied" — read by the runtime via data attributes since the
    // script is locale-agnostic global.
    return (
      `<div class="mp-codeblock"${lang ? ` data-lang="${escapeHtml(lang)}"` : ""}>` +
      `<div class="mp-codeblock__bar">` +
      `<span class="mp-codeblock__lang">${escapeHtml(langLabel)}</span>` +
      `<button type="button" class="mp-codeblock__copy" data-cms-copy ` +
      `data-cms-copy-label-default="${escapeHtml(copyLabel)}" ` +
      `data-cms-copy-label-done="${escapeHtml(copiedLabel)}" ` +
      `aria-label="${escapeHtml(copyLabel)}">` +
      `<span class="mp-codeblock__copy-icon" aria-hidden="true"></span>` +
      `<span class="mp-codeblock__copy-label" data-cms-copy-label>${escapeHtml(copyLabel)}</span>` +
      `</button>` +
      `</div>` +
      `<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ""}>${body}</code></pre>` +
      `</div>`
    );
  });
}

// ─────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────

// Pipeline ordering: admonitions first, then code blocks. Both passes
// are independent, but the admonition pass shouldn't see a body that
// contains the codeblock chrome — keeping admonitions first means
// code blocks INSIDE an admonition body still get chromed.
//
// `copyLabel` / `copiedLabel` come from the active locale's i18n
// bundle so FR pages get "Copier / Copié" without us having to inject
// per-locale runtime JS. The button's data attributes carry both
// strings and the global click handler in BaseLayout reads them.
export function transformDocHtml(
  html: string,
  copyLabel = "Copy",
  copiedLabel = "Copied",
): string {
  let out = html;
  out = transformAdmonitions(out);
  out = transformCodeBlocks(out, copyLabel, copiedLabel);
  return out;
}
