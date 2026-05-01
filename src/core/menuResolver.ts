import { buildPostUrl, buildTermUrl } from "./slug";
import type { MenuItem, Post, Term } from "./types";

// Pure shape produced by `resolveMenuItems` — each entry already carries
// its computed public href so callers (theme components AND the dynamic
// menu.json publisher) don't have to know about post / term lookups.
export interface ResolvedMenuItem {
  id: string;
  label: string;
  href: string;
  children?: ResolvedMenuItem[];
}

// Minimal "context" the resolver needs. Not the full PublishContext so
// this module can be used both at publish time (with a freshly built
// context) and at menu-only-update time (with whatever data was current
// at the moment of the menu save).
export interface MenuResolveContext {
  posts: Pick<Post, "id" | "type" | "slug" | "primaryTermId">[];
  pages: Pick<Post, "id" | "type" | "slug">[];
  terms: Pick<Term, "id" | "type" | "slug">[];
}

// Recursively resolves a tree of MenuItem (with internal refs) into the
// flat-but-tree-shaped ResolvedMenuItem[]. Items that point to a missing
// or unpublishable target collapse to `href: "#"` rather than vanish, so
// the menu shape stays predictable for theme code / the JSON loader.
export function resolveMenuItems(
  items: MenuItem[],
  ctx: MenuResolveContext,
): ResolvedMenuItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    href: resolveMenuHref(item, ctx),
    children: item.children ? resolveMenuItems(item.children, ctx) : undefined,
  }));
}

function resolveMenuHref(item: MenuItem, ctx: MenuResolveContext): string {
  if (item.externalUrl) return item.externalUrl;
  if (!item.ref) return "#";
  if (item.ref.kind === "home") return "/index.html";
  if (item.ref.kind === "post") {
    const post = [...ctx.posts, ...ctx.pages].find((p) => p.id === item.ref?.id);
    if (!post) return "#";
    const primaryTermId = "primaryTermId" in post ? post.primaryTermId : undefined;
    const term = primaryTermId ? ctx.terms.find((t) => t.id === primaryTermId) : undefined;
    return `/${buildPostUrl({ post, primaryTerm: term })}`;
  }
  if (item.ref.kind === "term") {
    const term = ctx.terms.find((t) => t.id === item.ref?.id);
    if (!term || term.type !== "category") return "#";
    return `/${buildTermUrl(term)}`;
  }
  return "#";
}
