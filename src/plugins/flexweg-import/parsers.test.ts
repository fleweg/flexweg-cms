// @vitest-environment jsdom
// The WordPress parser needs DOMParser + getElementsByTagNameNS for
// XML — jsdom implements both faithfully where happy-dom doesn't.
// The markdown tests are pure logic but jsdom adds negligible
// overhead, so the whole file shares the directive.

import { describe, expect, it } from "vitest";
import { splitFrontmatter, parseMarkdownFile } from "./parsers/markdown";
import { parseWordPressXml } from "./parsers/wordpress";

describe("markdown frontmatter parser", () => {
  it("splits frontmatter and body when fence is present", () => {
    const text = "---\ntitle: Hello\n---\n\nBody here.";
    const { frontmatter, body } = splitFrontmatter(text);
    expect(frontmatter.title).toBe("Hello");
    // Leading blank line after the closing fence is consumed —
    // typical YAML frontmatter convention so the body starts clean.
    expect(body).toBe("Body here.");
  });

  it("treats text without fence as body-only", () => {
    const { frontmatter, body } = splitFrontmatter("Just body, no fence.");
    expect(frontmatter).toEqual({});
    expect(body).toBe("Just body, no fence.");
  });

  it("treats unclosed fence as body-only (does not throw)", () => {
    const text = "---\ntitle: Hello\n\nBody never closes the fence.";
    const result = splitFrontmatter(text);
    expect(result.frontmatter).toEqual({});
  });

  it("decodes scalar types: strings, numbers, booleans", () => {
    const text = "---\ntitle: Hello\ncount: 42\nactive: true\nname: 'quoted'\n---\nbody";
    const { frontmatter } = splitFrontmatter(text);
    expect(frontmatter.title).toBe("Hello");
    expect(frontmatter.count).toBe(42);
    expect(frontmatter.active).toBe(true);
    expect(frontmatter.name).toBe("quoted");
  });

  it("parses inline arrays", () => {
    const text = "---\ntags: [a, b, c]\n---\n";
    const { frontmatter } = splitFrontmatter(text);
    expect(frontmatter.tags).toEqual(["a", "b", "c"]);
  });

  it("parses inline arrays with quoted entries", () => {
    const text = `---\ntags: ['a, with comma', "b"]\n---\n`;
    const { frontmatter } = splitFrontmatter(text);
    expect(frontmatter.tags).toEqual(["a, with comma", "b"]);
  });

  it("parses block arrays", () => {
    const text = "---\ntags:\n  - first\n  - second\n  - third\n---\n";
    const { frontmatter } = splitFrontmatter(text);
    expect(frontmatter.tags).toEqual(["first", "second", "third"]);
  });

  it("strips comments outside quoted strings", () => {
    const text = "---\ntitle: hello # this is a comment\nname: 'has # inside quotes'\n---\n";
    const { frontmatter } = splitFrontmatter(text);
    expect(frontmatter.title).toBe("hello");
    expect(frontmatter.name).toBe("has # inside quotes");
  });

  it("preserves slug-like values that look numeric (leading zeros)", () => {
    const text = "---\nslug: 01-intro\n---\n";
    const { frontmatter } = splitFrontmatter(text);
    expect(frontmatter.slug).toBe("01-intro");
  });
});

describe("parseMarkdownFile", () => {
  it("returns an error when title is missing", () => {
    const result = parseMarkdownFile("---\nslug: hello\n---\n", "test.md");
    expect(result.entry).toBeNull();
    expect(result.warnings[0]?.level).toBe("error");
    expect(result.warnings[0]?.message).toMatch(/title/i);
  });

  it("uses sensible defaults when only title is given", () => {
    const result = parseMarkdownFile("---\ntitle: My Post\n---\nbody", "test.md");
    expect(result.entry?.type).toBe("post");
    expect(result.entry?.status).toBe("draft");
    expect(result.entry?.slug).toBe("");
    expect(result.entry?.title).toBe("My Post");
  });

  it("respects type=page", () => {
    const result = parseMarkdownFile(
      "---\ntitle: About\ntype: page\n---\n",
      "about.md",
    );
    expect(result.entry?.type).toBe("page");
  });

  it("warns on invalid publishedAt and falls through", () => {
    const result = parseMarkdownFile(
      "---\ntitle: Hello\npublishedAt: not-a-date\n---\n",
      "test.md",
    );
    expect(result.entry).not.toBeNull();
    expect(result.entry?.publishedAt).toBeUndefined();
    expect(result.warnings.some((w) => w.message.match(/publishedAt/))).toBe(true);
  });

  it("captures parentCategory when present", () => {
    const result = parseMarkdownFile(
      "---\ntitle: Sports article\ncategory: Sports\nparentCategory: News\n---\n",
      "test.md",
    );
    expect(result.entry?.categoryName).toBe("Sports");
    expect(result.entry?.parentCategoryName).toBe("News");
  });
});

describe("parseWordPressXml", () => {
  // Minimal but realistic WXR fixture covering the fields the
  // parser actually reads. Keeping it inline here makes the test
  // self-contained — no separate fixture file to chase.
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:wp="http://wordpress.org/export/1.2/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Sample Site</title>
    <wp:category>
      <wp:term_id>1</wp:term_id>
      <wp:category_nicename>news</wp:category_nicename>
      <wp:cat_name>News</wp:cat_name>
      <wp:category_parent></wp:category_parent>
    </wp:category>
    <wp:category>
      <wp:term_id>2</wp:term_id>
      <wp:category_nicename>sports</wp:category_nicename>
      <wp:cat_name>Sports</wp:cat_name>
      <wp:category_parent>news</wp:category_parent>
    </wp:category>
    <wp:tag>
      <wp:term_id>10</wp:term_id>
      <wp:tag_slug>football</wp:tag_slug>
      <wp:tag_name>Football</wp:tag_name>
    </wp:tag>

    <item>
      <title>World cup recap</title>
      <link>https://old.example.com/2026/01/cup-recap/</link>
      <dc:creator>jane@example.com</dc:creator>
      <content:encoded><![CDATA[<p>The <strong>final</strong> was wild.</p><img src="https://old.example.com/wp-content/uploads/2026/01/photo.jpg" alt="Photo" />]]></content:encoded>
      <wp:post_id>100</wp:post_id>
      <wp:post_date_gmt>2026-01-15 10:00:00</wp:post_date_gmt>
      <wp:post_name>cup-recap</wp:post_name>
      <wp:status>publish</wp:status>
      <wp:post_type>post</wp:post_type>
      <category domain="category" nicename="sports"><![CDATA[Sports]]></category>
      <category domain="post_tag" nicename="football"><![CDATA[Football]]></category>
      <wp:postmeta>
        <wp:meta_key>_thumbnail_id</wp:meta_key>
        <wp:meta_value>200</wp:meta_value>
      </wp:postmeta>
    </item>

    <item>
      <title>photo.jpg</title>
      <wp:post_id>200</wp:post_id>
      <wp:post_type>attachment</wp:post_type>
      <wp:attachment_url>https://old.example.com/wp-content/uploads/2026/01/photo.jpg</wp:attachment_url>
      <wp:post_parent>100</wp:post_parent>
    </item>
  </channel>
</rss>`;

  it("extracts posts and skips revision-y types", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    expect(result.entries).toHaveLength(1);
    const post = result.entries[0];
    expect(post.title).toBe("World cup recap");
    expect(post.slug).toBe("cup-recap");
    expect(post.type).toBe("post");
    expect(post.status).toBe("online"); // mapped from publish
  });

  it("converts HTML body to markdown via turndown", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    const post = result.entries[0];
    // turndown maps <strong> to **
    expect(post.contentBody).toMatch(/\*\*final\*\*/);
  });

  it("captures categories with hierarchy", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    const sports = result.terms.find((t) => t.slug === "sports");
    expect(sports?.parentSlug).toBe("news");
    const news = result.terms.find((t) => t.slug === "news");
    expect(news?.parentSlug).toBeUndefined();
  });

  it("resolves the parent category name on the post entry", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    const post = result.entries[0];
    expect(post.categoryName).toBe("Sports");
    expect(post.parentCategoryName).toBe("News");
  });

  it("collects attachments and resolves hero image via _thumbnail_id", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    expect(result.attachments).toHaveLength(1);
    expect(result.attachments[0].url).toBe(
      "https://old.example.com/wp-content/uploads/2026/01/photo.jpg",
    );
    expect(result.entries[0].heroImage).toBe(
      "https://old.example.com/wp-content/uploads/2026/01/photo.jpg",
    );
  });

  it("extracts inline image URLs from the original HTML", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    expect(result.entries[0].inlineImages).toContain(
      "https://old.example.com/wp-content/uploads/2026/01/photo.jpg",
    );
  });

  it("preserves the original post link as legacyUrl", () => {
    const result = parseWordPressXml(sampleXml, "wp.xml");
    expect(result.entries[0].legacyUrl).toBe(
      "https://old.example.com/2026/01/cup-recap/",
    );
  });

  it("maps non-publish statuses to draft with a warning", () => {
    const xml = sampleXml.replace("<wp:status>publish</wp:status>", "<wp:status>pending</wp:status>");
    const result = parseWordPressXml(xml, "wp.xml");
    expect(result.entries[0].status).toBe("draft");
    expect(result.warnings.some((w) => /pending/.test(w.message))).toBe(true);
  });

  it("returns a fatal error on malformed XML", () => {
    const result = parseWordPressXml("<not really xml>", "broken.xml");
    expect(result.entries).toHaveLength(0);
    expect(result.warnings[0]?.level).toBe("error");
  });
});
