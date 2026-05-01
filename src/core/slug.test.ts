import { describe, expect, it } from "vitest";
import {
  buildPostUrl,
  buildTermUrl,
  HOME_PATH,
  isValidSlug,
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
