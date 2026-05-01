import { describe, expect, it } from "vitest";
import { resolveMenuItems, type MenuResolveContext } from "./menuResolver";
import type { MenuItem } from "./types";

const ctx: MenuResolveContext = {
  posts: [
    { id: "p1", type: "post", slug: "hello", primaryTermId: undefined },
    { id: "p2", type: "post", slug: "recap", primaryTermId: "cat-news" },
  ],
  pages: [{ id: "pg1", type: "page", slug: "about" }],
  terms: [
    { id: "cat-news", type: "category", slug: "news" },
    { id: "tag-feat", type: "tag", slug: "featured" },
  ],
};

describe("resolveMenuItems", () => {
  it("resolves home refs to /index.html", () => {
    const items: MenuItem[] = [{ id: "i1", label: "Home", ref: { kind: "home" } }];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("/index.html");
  });

  it("resolves a post without category to root url", () => {
    const items: MenuItem[] = [
      { id: "i1", label: "Hello", ref: { kind: "post", id: "p1" } },
    ];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("/hello.html");
  });

  it("resolves a post with category to nested url", () => {
    const items: MenuItem[] = [
      { id: "i1", label: "Recap", ref: { kind: "post", id: "p2" } },
    ];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("/news/recap.html");
  });

  it("resolves a category term to its archive index", () => {
    const items: MenuItem[] = [
      { id: "i1", label: "News", ref: { kind: "term", id: "cat-news" } },
    ];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("/news/index.html");
  });

  it("collapses to # when a tag is referenced (tags have no archive)", () => {
    const items: MenuItem[] = [
      { id: "i1", label: "Featured", ref: { kind: "term", id: "tag-feat" } },
    ];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("#");
  });

  it("collapses to # when a referenced entity is missing", () => {
    const items: MenuItem[] = [
      { id: "i1", label: "Ghost", ref: { kind: "post", id: "missing" } },
    ];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("#");
  });

  it("preserves external URLs verbatim", () => {
    const items: MenuItem[] = [
      { id: "i1", label: "Site", externalUrl: "https://example.com" },
    ];
    expect(resolveMenuItems(items, ctx)[0].href).toBe("https://example.com");
  });

  it("recurses into children", () => {
    const items: MenuItem[] = [
      {
        id: "parent",
        label: "Parent",
        ref: { kind: "home" },
        children: [{ id: "c1", label: "About", ref: { kind: "post", id: "pg1" } }],
      },
    ];
    const resolved = resolveMenuItems(items, ctx);
    expect(resolved[0].children?.[0].href).toBe("/about.html");
  });
});
