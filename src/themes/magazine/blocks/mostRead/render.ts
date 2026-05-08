import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { Post } from "@flexweg/cms-runtime";
import { postSortMillis } from "@flexweg/cms-runtime";
import type { PublishContext } from "@flexweg/cms-runtime";
import { buildPostUrl } from "@flexweg/cms-runtime";
import { escapeAttr, escapeText } from "../util";

export interface MostReadAttrs {
  // Number of items to display. Clamped to [1, 10] at render time.
  count?: number;
  // For now the only source is "latest" (newest online posts). We keep
  // the field on the attrs shape to make a "manual" curated list a
  // straightforward future extension.
  source?: "latest";
  // Whether to render the section heading. The home page lays this
  // out itself (with its own heading) so we keep the renderer
  // header-less by default; standalone uses (e.g. inside a post body)
  // can flip the flag on.
  showHeading?: boolean;
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
}

export interface MostReadRenderResult {
  html: string;
  consumedPostIds: string[];
}

// Two-digit zero-padded numeral — "01", "02", ... — used as the
// oversized neutral numeral on each list item.
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function renderMostRead(attrs: MostReadAttrs, env: RenderEnv): MostReadRenderResult {
  const count = Math.max(1, Math.min(10, attrs.count ?? 4));
  const candidates = env.ctx.posts
    .filter((p) => p.status === "online" && p.id !== env.current.id)
    .sort(
      (a, b) => postSortMillis(b) - postSortMillis(a),
    )
    .slice(0, count);

  if (!candidates.length) return { html: "", consumedPostIds: [] };

  const locale = pickPublicLocale(env.ctx.settings.language);
  const headingLabel =
    (i18n.getResource(locale, "theme-magazine", "blocks.mostRead.heading") as
      | string
      | undefined) ?? "Most Read";

  const items = candidates.map((post, idx) => {
    const term = post.primaryTermId
      ? env.ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
      : undefined;
    const url = `/${buildPostUrl({ post, primaryTerm: term })}`;
    const metaParts: string[] = [];
    if (term) metaParts.push(escapeText(term.name));
    return `<li class="flex gap-stack-md group">`
      + `<span class="font-serif text-4xl text-outline-variant leading-none shrink-0">${pad2(idx + 1)}</span>`
      + `<div class="min-w-0">`
      + `<h4 class="font-serif text-base font-medium text-on-surface group-hover:text-secondary transition-colors leading-tight"><a href="${escapeAttr(url)}">${escapeText(post.title)}</a></h4>`
      + (metaParts.length ? `<span class="text-xs text-on-surface-variant uppercase tracking-wider mt-1 block">${metaParts.join(" • ")}</span>` : "")
      + `</div>`
      + `</li>`;
  }).join("");

  const heading = (attrs.showHeading ?? false)
    ? `<h3 class="text-xs uppercase tracking-widest font-semibold pb-2 mb-stack-md border-b border-on-surface">${escapeText(headingLabel)}</h3>`
    : "";

  return {
    html: `<div class="cms-magazine-most-read">${heading}<ul class="space-y-stack-md">${items}</ul></div>`,
    consumedPostIds: [],
  };
}
