import type { Post } from "../../../../core/types";
import type { PublishContext } from "../../../../services/publisher";
import { buildTermUrl } from "../../../../core/slug";
import { escapeAttr, escapeText } from "../util";

export interface CategoriesPillsAttrs {
  title?: string;
  style?: "pills" | "list";
}

interface RenderEnv {
  ctx: PublishContext;
  current: Post;
  used: Set<string>;
}

export function renderCategoriesPills(
  attrs: CategoriesPillsAttrs,
  env: RenderEnv,
): string {
  // Only categories — tags are excluded from this block per the
  // Stitch maquette where the "Explore Topics" panel surfaces top-
  // level taxonomy. Tag-discovery would warrant its own block later.
  const categories = env.ctx.terms
    .filter((t) => t.type === "category")
    .sort((a, b) => a.name.localeCompare(b.name));
  if (categories.length === 0) return "";

  const style = attrs.style ?? "pills";
  const titleHtml = attrs.title
    ? `<h3 class="cms-categories-title">${escapeText(attrs.title)}</h3>`
    : "";
  const items = categories
    .map(
      (term) =>
        `<a class="cms-categories-pill" href="/${escapeAttr(buildTermUrl(term))}">${escapeText(term.name)}</a>`,
    )
    .join("");
  return `<section class="cms-categories cms-categories-${style}">${titleHtml}<div class="cms-categories-items">${items}</div></section>`;
}
