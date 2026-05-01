import { describe, expect, it } from "vitest";
import {
  buildPostUrl,
  buildTermUrl,
  detectPathCollision,
  detectTermSlugCollision,
  findAvailableSlug,
  HOME_PATH,
  isValidSlug,
  normalizeMediaSlug,
  pathToPublicUrl,
  slugify,
} from "./slug";

describe("slugify", () => {
  it("lower-cases and strips diacritics", () => {
    expect(slugify("Bonjour à tous, été 2026 !")).toBe("bonjour-a-tous-ete-2026");
  });
  it("collapses non-alphanumeric runs to a single dash", () => {
    expect(slugify("Hello___world!!!")).toBe("hello-world");
  });
  it("trims leading/trailing dashes", () => {
    expect(slugify("---hello---")).toBe("hello");
  });
  it("handles empty / pure-symbol input", () => {
    expect(slugify("!!!")).toBe("");
    expect(slugify("")).toBe("");
  });
});

describe("isValidSlug", () => {
  it("accepts canonical slugs", () => {
    expect(isValidSlug("hello")).toBe(true);
    expect(isValidSlug("hello-world")).toBe(true);
    expect(isValidSlug("a1-b2")).toBe(true);
  });
  it("rejects malformed slugs", () => {
    expect(isValidSlug("Hello")).toBe(false);
    expect(isValidSlug("hello world")).toBe(false);
    expect(isValidSlug("-hello")).toBe(false);
    expect(isValidSlug("hello-")).toBe(false);
    expect(isValidSlug("hello--world")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("buildPostUrl", () => {
  it("builds top-level page URLs", () => {
    expect(
      buildPostUrl({ post: { type: "page", slug: "about" } }),
    ).toBe("about.html");
  });
  it("builds top-level post URLs without category", () => {
    expect(
      buildPostUrl({ post: { type: "post", slug: "hello-world" } }),
    ).toBe("hello-world.html");
  });
  it("builds nested post URLs under a category", () => {
    expect(
      buildPostUrl({
        post: { type: "post", slug: "hello-world" },
        primaryTerm: { type: "category", slug: "actualites" },
      }),
    ).toBe("actualites/hello-world.html");
  });
  it("ignores tags as URL prefix", () => {
    expect(
      buildPostUrl({
        post: { type: "post", slug: "hello-world" },
        primaryTerm: { type: "tag", slug: "featured" },
      }),
    ).toBe("hello-world.html");
  });
  it("throws when slug is empty", () => {
    expect(() => buildPostUrl({ post: { type: "post", slug: "" } })).toThrow();
  });
});

describe("buildTermUrl", () => {
  it("builds archive URLs for categories", () => {
    expect(buildTermUrl({ type: "category", slug: "news" })).toBe("news/index.html");
  });
  it("rejects tags", () => {
    expect(() => buildTermUrl({ type: "tag", slug: "x" })).toThrow();
  });
});

describe("normalizeMediaSlug", () => {
  it("strips the extension and slugifies the stem", () => {
    const slug = normalizeMediaSlug("Photo Été 2026.JPG");
    expect(slug).toMatch(/^photo-ete-2026-[0-9a-f]{6}$/);
  });
  it("appends a random suffix even on already-clean names", () => {
    const a = normalizeMediaSlug("photo.jpg");
    const b = normalizeMediaSlug("photo.jpg");
    expect(a).toMatch(/^photo-[0-9a-f]{6}$/);
    expect(b).toMatch(/^photo-[0-9a-f]{6}$/);
    // Two consecutive calls almost certainly produce different suffixes.
    // Probability of collision = 1/16^6 ≈ 6e-8 — negligible for a test.
    expect(a).not.toBe(b);
  });
  it("falls back to 'media' when the stem is unslugifiable", () => {
    const slug = normalizeMediaSlug("!!!.png");
    expect(slug).toMatch(/^media-[0-9a-f]{6}$/);
  });
  it("handles names without an extension", () => {
    const slug = normalizeMediaSlug("hello world");
    expect(slug).toMatch(/^hello-world-[0-9a-f]{6}$/);
  });
});

describe("pathToPublicUrl", () => {
  it("joins base URL and path without double slashes", () => {
    expect(pathToPublicUrl("https://site.flexweg.com", "news/hello.html")).toBe(
      "https://site.flexweg.com/news/hello.html",
    );
    expect(pathToPublicUrl("https://site.flexweg.com/", "/news/hello.html")).toBe(
      "https://site.flexweg.com/news/hello.html",
    );
  });
  it("home path resolves to root url", () => {
    expect(pathToPublicUrl("https://site.flexweg.com", HOME_PATH)).toBe(
      "https://site.flexweg.com/index.html",
    );
  });
});

describe("findAvailableSlug", () => {
  it("returns the base when not used", () => {
    expect(findAvailableSlug("hello", () => false)).toBe("hello");
  });
  it("appends -2 when the base is taken", () => {
    const used = new Set(["hello"]);
    expect(findAvailableSlug("hello", (s) => used.has(s))).toBe("hello-2");
  });
  it("skips taken indexes and returns the lowest free", () => {
    const used = new Set(["hello", "hello-2", "hello-3"]);
    expect(findAvailableSlug("hello", (s) => used.has(s))).toBe("hello-4");
  });
  it("falls back to 'untitled' when the base is empty", () => {
    expect(findAvailableSlug("", () => false)).toBe("untitled");
  });
});

describe("detectPathCollision", () => {
  const posts = [
    { id: "p1", type: "post" as const, title: "Hello", slug: "hello", primaryTermId: undefined },
    { id: "p2", type: "post" as const, title: "Recap", slug: "recap", primaryTermId: "cat-news" },
  ];
  const pages = [{ id: "pg1", type: "page" as const, title: "About", slug: "about" }];
  const terms = [
    { id: "cat-news", type: "category" as const, name: "News", slug: "news" },
    { id: "tag-feat", type: "tag" as const, name: "Featured", slug: "featured" },
  ];

  it("detects a top-level post path collision", () => {
    const hit = detectPathCollision("hello.html", posts, pages, terms);
    expect(hit?.kind).toBe("post");
    expect(hit?.id).toBe("p1");
  });
  it("detects a category-prefixed post path collision", () => {
    const hit = detectPathCollision("news/recap.html", posts, pages, terms);
    expect(hit?.kind).toBe("post");
    expect(hit?.id).toBe("p2");
  });
  it("detects a page path collision", () => {
    const hit = detectPathCollision("about.html", posts, pages, terms);
    expect(hit?.kind).toBe("page");
  });
  it("detects a category archive path collision", () => {
    const hit = detectPathCollision("news/index.html", posts, pages, terms);
    expect(hit?.kind).toBe("category");
  });
  it("returns null when the path is free", () => {
    expect(detectPathCollision("brand-new.html", posts, pages, terms)).toBeNull();
  });
  it("excludes the entity being edited via ignoreId", () => {
    expect(detectPathCollision("hello.html", posts, pages, terms, "p1")).toBeNull();
  });
});

describe("detectTermSlugCollision", () => {
  const terms = [
    { id: "cat-news", type: "category" as const, name: "News", slug: "news" },
    { id: "tag-news", type: "tag" as const, name: "News", slug: "news" },
  ];
  it("detects a same-type collision", () => {
    expect(
      detectTermSlugCollision({ type: "category", slug: "news" }, terms)?.id,
    ).toBe("cat-news");
  });
  it("does not flag cross-type matches", () => {
    expect(
      detectTermSlugCollision({ type: "tag", slug: "news" }, terms, "tag-news"),
    ).toBeNull();
  });
});
