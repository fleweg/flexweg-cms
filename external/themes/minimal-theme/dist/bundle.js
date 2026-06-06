import { jsxs as t, jsx as e } from "react/jsx-runtime";
const m = `/* Minimal theme stylesheet. Hand-written so the example stays
   buildable without Tailwind or SCSS. Ship whatever you like — the
   admin uploads this file verbatim to /theme-assets/<id>.css. */

:root {
  --mt-bg: #ffffff;
  --mt-fg: #1a1a1a;
  --mt-muted: #6b7280;
  --mt-accent: #2563eb;
  --mt-max-w: 720px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

body {
  margin: 0;
  background: var(--mt-bg);
  color: var(--mt-fg);
  line-height: 1.6;
}

main {
  max-width: var(--mt-max-w);
  margin: 0 auto;
  padding: 2rem 1rem;
}

a {
  color: var(--mt-accent);
}

h1,
h2,
h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.25;
}

article header h1 {
  margin-top: 0;
  font-size: 2rem;
}

.mt-meta {
  color: var(--mt-muted);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.mt-list {
  list-style: none;
  padding: 0;
}

.mt-list li {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.mt-list li:first-child {
  border-top: 0;
}
`;
function d({
  site: i,
  pageTitle: a,
  pageDescription: n,
  ogImage: l,
  children: r
}) {
  return /* @__PURE__ */ t("html", { lang: i.settings.language || "en", children: [
    /* @__PURE__ */ t("head", { children: [
      /* @__PURE__ */ e("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ e("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ e("title", { children: a }),
      n && /* @__PURE__ */ e("meta", { name: "description", content: n }),
      l && /* @__PURE__ */ e("meta", { property: "og:image", content: l }),
      /* @__PURE__ */ e("link", { rel: "stylesheet", href: "/theme-assets/minimal-theme.css" }),
      /* @__PURE__ */ e("meta", { name: "x-cms-head-extra" })
    ] }),
    /* @__PURE__ */ t("body", { children: [
      /* @__PURE__ */ t("header", { children: [
        /* @__PURE__ */ e("nav", { "data-cms-menu": "header", children: /* @__PURE__ */ e("ul", {}) }),
        /* @__PURE__ */ e("div", { "data-cms-brand": !0, children: /* @__PURE__ */ e("a", { href: "/index.html", children: i.settings.title || "Site" }) })
      ] }),
      /* @__PURE__ */ e("main", { children: r }),
      /* @__PURE__ */ e("footer", { children: /* @__PURE__ */ e("nav", { "data-cms-menu": "footer", children: /* @__PURE__ */ e("ul", {}) }) }),
      /* @__PURE__ */ e("script", { type: "application/x-cms-body-end" })
    ] })
  ] });
}
function c({ posts: i }) {
  return /* @__PURE__ */ t("article", { children: [
    /* @__PURE__ */ e("h1", { children: "Latest posts" }),
    /* @__PURE__ */ e("ul", { className: "mt-list", children: i.map((a) => /* @__PURE__ */ t("li", { children: [
      /* @__PURE__ */ e("h2", { children: /* @__PURE__ */ e("a", { href: `/${a.url}`, children: a.title }) }),
      a.dateLabel && /* @__PURE__ */ e("p", { className: "mt-meta", children: a.dateLabel }),
      a.excerpt && /* @__PURE__ */ e("p", { children: a.excerpt })
    ] }, a.id)) })
  ] });
}
function h({ post: i, bodyHtml: a, author: n }) {
  return /* @__PURE__ */ t("article", { children: [
    /* @__PURE__ */ t("header", { children: [
      /* @__PURE__ */ e("h1", { children: i.title }),
      n && /* @__PURE__ */ t("p", { className: "mt-meta", children: [
        "By ",
        n.displayName
      ] })
    ] }),
    /* @__PURE__ */ e("div", { dangerouslySetInnerHTML: { __html: a } })
  ] });
}
function s({ term: i, posts: a }) {
  return /* @__PURE__ */ t("article", { children: [
    /* @__PURE__ */ t("header", { children: [
      /* @__PURE__ */ e("h1", { children: i.name }),
      i.description && /* @__PURE__ */ e("p", { className: "mt-meta", children: i.description })
    ] }),
    /* @__PURE__ */ e("ul", { className: "mt-list", children: a.map((n) => /* @__PURE__ */ t("li", { children: [
      /* @__PURE__ */ e("h2", { children: /* @__PURE__ */ e("a", { href: `/${n.url}`, children: n.title }) }),
      n.dateLabel && /* @__PURE__ */ e("p", { className: "mt-meta", children: n.dateLabel }),
      n.excerpt && /* @__PURE__ */ e("p", { children: n.excerpt })
    ] }, n.id)) })
  ] });
}
function o({ author: i, posts: a }) {
  return /* @__PURE__ */ t("article", { children: [
    /* @__PURE__ */ t("header", { children: [
      /* @__PURE__ */ e("h1", { children: i.displayName }),
      i.bio && /* @__PURE__ */ e("p", { children: i.bio })
    ] }),
    /* @__PURE__ */ e("h2", { children: "Posts" }),
    /* @__PURE__ */ e("ul", { className: "mt-list", children: a.map((n) => /* @__PURE__ */ t("li", { children: [
      /* @__PURE__ */ e("a", { href: `/${n.url}`, children: n.title }),
      n.dateLabel && /* @__PURE__ */ t("span", { className: "mt-meta", children: [
        " — ",
        n.dateLabel
      ] })
    ] }, n.id)) })
  ] });
}
function u({ message: i }) {
  return /* @__PURE__ */ t("article", { children: [
    /* @__PURE__ */ e("h1", { children: "404 — Not found" }),
    /* @__PURE__ */ e("p", { children: i || "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ e("p", { children: /* @__PURE__ */ e("a", { href: "/index.html", children: "Back to home" }) })
  ] });
}
const p = {
  id: "minimal-theme",
  name: "Minimal Theme",
  version: "1.0.0",
  description: "Minimal external theme — single column, system fonts.",
  scssEntry: "theme.css",
  cssText: m,
  templates: {
    base: d,
    home: c,
    single: h,
    category: s,
    author: o,
    notFound: u
  }
};
export {
  p as default
};
