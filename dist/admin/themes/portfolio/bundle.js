import { jsxs as y, Fragment as _r, jsx as u } from "react/jsx-runtime";
import { i18n as $e, pickPublicLocale as Ue, canonicalUrl as Wr, pickFormat as pe, uploadFile as Gr, useCmsData as qr, logoPath as Kr, FontSelect as en, toast as R, uploadThemeLogo as Yr, removeThemeLogo as Xr, fetchAllPosts as tn, publishMenuJson as Qr } from "@flexweg/cms-runtime";
import L, { forwardRef as Lt, createElement as Qe, useState as F, useRef as Zr, createRef as ei, memo as ti, createContext as jn, version as nn, useContext as ni } from "react";
import { useTranslation as H } from "react-i18next";
import ri, { flushSync as ii } from "react-dom";
function oi({ site: r }) {
  var o;
  const { settings: e } = r, t = $e.getFixedT(Ue(e.language), "theme-portfolio"), n = r.themeConfig, i = ((o = n == null ? void 0 : n.brand.wordmark) == null ? void 0 : o.trim()) || e.title.toUpperCase();
  return /* @__PURE__ */ y(_r, { children: [
    /* @__PURE__ */ u("header", { className: "sticky top-0 z-50 bg-surface border-b border-primary", children: /* @__PURE__ */ y("div", { className: "max-w-container-max mx-auto flex items-center justify-between px-margin-edge-mobile md:px-margin-edge py-6", children: [
      /* @__PURE__ */ y("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "md:hidden burger-toggle text-primary",
            "aria-controls": "burger-menu",
            "aria-expanded": "false",
            "aria-label": t("publicBaked.menu"),
            children: /* @__PURE__ */ u("span", { className: "material-symbols-outlined", children: "menu" })
          }
        ),
        /* @__PURE__ */ u(
          "a",
          {
            className: "font-serif text-headline-md text-primary tracking-tight",
            href: r.homePath ?? "/index.html",
            "data-cms-brand": !0,
            children: i
          }
        )
      ] }),
      /* @__PURE__ */ u(
        "nav",
        {
          className: "hidden md:flex items-center gap-12",
          "data-cms-menu": "header",
          "data-cms-menu-inline": !0,
          "aria-label": t("publicBaked.primaryNavMobile")
        }
      ),
      /* @__PURE__ */ y("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ u("div", { "data-cms-langswitch": "header", "aria-hidden": "true" }),
        /* @__PURE__ */ u(
          "a",
          {
            href: "/contact.html",
            className: "hidden md:inline-flex portfolio-btn-outline",
            children: t("publicBaked.contact")
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ u(
      "nav",
      {
        id: "burger-menu",
        className: "burger-menu",
        "data-cms-menu": "header",
        "aria-label": t("publicBaked.primaryNavMobile"),
        children: /* @__PURE__ */ u("ul", {})
      }
    )
  ] });
}
function si({ site: r }) {
  var s, a;
  const { settings: e } = r, t = $e.getFixedT(Ue(e.language), "theme-portfolio"), n = r.themeConfig, i = ((s = n == null ? void 0 : n.brand.wordmark) == null ? void 0 : s.trim()) || e.title.toUpperCase(), o = ((a = n == null ? void 0 : n.footer.copyright) == null ? void 0 : a.trim()) || `© ${(/* @__PURE__ */ new Date()).getFullYear()} ${e.title}. ${t("publicBaked.rightsReserved")}`;
  return /* @__PURE__ */ u("footer", { className: "border-t border-primary bg-surface", children: /* @__PURE__ */ y("div", { className: "max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-12", children: [
    /* @__PURE__ */ u(
      "a",
      {
        className: "font-serif text-headline-md text-primary tracking-tight",
        href: r.homePath ?? "/index.html",
        children: i
      }
    ),
    /* @__PURE__ */ u(
      "nav",
      {
        className: "flex flex-wrap items-center justify-center gap-8",
        "data-cms-menu": "footer",
        "data-cms-menu-inline": !0,
        "aria-label": "Footer"
      }
    ),
    /* @__PURE__ */ y("div", { className: "flex flex-col items-center md:items-end gap-2", children: [
      /* @__PURE__ */ u("p", { className: "font-sans text-label-sm uppercase tracking-widest text-secondary text-center md:text-right", children: o }),
      /* @__PURE__ */ u("div", { "data-cms-langswitch": "footer", "aria-hidden": "true" })
    ] })
  ] }) });
}
function ai({
  site: r,
  pageTitle: e,
  pageDescription: t,
  ogImage: n,
  currentPath: i,
  currentLocale: o,
  children: s
}) {
  const a = `/${r.themeCssPath}`, l = r.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, ""), c = `/theme-assets/${l}-menu.js`, d = `/theme-assets/${l}-posts.js`, f = `/theme-assets/${l}-filters.js`, h = r.settings.baseUrl && i ? Wr(r.settings.baseUrl, i) : void 0, p = e ? `${e} — ${r.settings.title}` : r.settings.title;
  return /* @__PURE__ */ y("html", { lang: o || r.settings.language || "en", children: [
    /* @__PURE__ */ y("head", { children: [
      /* @__PURE__ */ u("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ u("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ u("title", { children: p }),
      t && /* @__PURE__ */ u("meta", { name: "description", content: t }),
      h && /* @__PURE__ */ u("link", { rel: "canonical", href: h }),
      /* @__PURE__ */ u("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ u("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ u("link", { rel: "stylesheet", href: a }),
      /* @__PURE__ */ u("meta", { property: "og:title", content: p }),
      t && /* @__PURE__ */ u("meta", { property: "og:description", content: t }),
      n && /* @__PURE__ */ u("meta", { property: "og:image", content: n }),
      h && /* @__PURE__ */ u("meta", { property: "og:url", content: h }),
      /* @__PURE__ */ u("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ u("meta", { name: "x-cms-head-extra" })
    ] }),
    /* @__PURE__ */ y("body", { className: "bg-background text-on-surface font-sans", children: [
      /* @__PURE__ */ u(oi, { site: r }),
      /* @__PURE__ */ u("main", { children: s }),
      /* @__PURE__ */ u(si, { site: r }),
      /* @__PURE__ */ u("script", { src: c, defer: !0 }),
      /* @__PURE__ */ u("script", { src: d, defer: !0 }),
      /* @__PURE__ */ u("script", { src: f, defer: !0 }),
      /* @__PURE__ */ u("script", { type: "application/x-cms-body-end" })
    ] })
  ] });
}
function Pt({ card: r }) {
  var l, c, d, f, h, p, g, m;
  const e = r.hero ? pe(r.hero, "portrait") || pe(r.hero) : "", t = ((l = r.hero) == null ? void 0 : l.alt) ?? r.title, n = ((d = (c = r.publishedAt) == null ? void 0 : c.toMillis) == null ? void 0 : d.call(c)) ?? ((h = (f = r.createdAt) == null ? void 0 : f.toMillis) == null ? void 0 : h.call(f)) ?? null, i = n ? new Date(n).getUTCFullYear() : "", s = [((g = (p = r.category) == null ? void 0 : p.name) == null ? void 0 : g.toUpperCase()) ?? "", i ? String(i) : ""].filter(Boolean).join(" / "), a = (m = r.category) != null && m.url ? r.category.url.replace(/^\/+/, "").split("/")[0] : "";
  return /* @__PURE__ */ y(
    "a",
    {
      className: "project-card group",
      href: r.url,
      "data-cms-category": a,
      children: [
        /* @__PURE__ */ u("div", { className: "project-card__image aspect-[4/5]", children: e ? /* @__PURE__ */ u("img", { src: e, alt: t, loading: "lazy" }) : /* @__PURE__ */ u("div", { className: "w-full h-full" }) }),
        /* @__PURE__ */ u("h3", { className: "project-card__title", children: r.title }),
        s ? /* @__PURE__ */ u("p", { className: "project-card__meta", children: s }) : null
      ]
    }
  );
}
const Fn = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#fdf8f8" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#fdf8f8" },
  { name: "--color-surface-container-lowest", type: "color", group: "surfaces", labelKey: "vars.surfaceLowest", defaultValue: "#ffffff" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f7f3f2" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#f1edec" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#1c1b1b" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#444748" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#747878" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c4c7c7" },
  // Accent
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#000000" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#5d5f5f" },
  { name: "--color-error", type: "color", group: "accent", labelKey: "vars.accent", defaultValue: "#e11d48" }
], li = [
  "surfaces",
  "foreground",
  "outlines",
  "accent"
], me = {
  serif: {
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Newsreader: "Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Source Serif 4": "Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Crimson Pro": "Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Spectral: "Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "DM Serif Display": "DM+Serif+Display:ital,wght@0,400;1,400"
  },
  sans: {
    Inter: "Inter:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    Outfit: "Outfit:wght@400;500;600;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700"
  }
}, Oe = "Playfair Display", Re = "Inter", ve = {
  vars: {},
  fontSerif: Oe,
  fontSans: Re
};
function rn(r, e) {
  const t = {
    ...me.serif,
    ...me.sans
  };
  return t[r] ?? t[e];
}
function ci(r, e) {
  const t = rn(r, Oe), n = rn(e, Re);
  return t === n ? `https://fonts.googleapis.com/css2?family=${t}&display=swap` : `https://fonts.googleapis.com/css2?family=${t}&family=${n}&display=swap`;
}
function di() {
  return `https://fonts.googleapis.com/css2?${[
    ...Object.keys(me.serif),
    ...Object.keys(me.sans)
  ].map((t) => `family=${t.replace(/ /g, "+")}`).join("&")}&display=swap`;
}
function ui(r) {
  const e = r.trim(), t = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(e);
  if (!t) return e;
  const n = t[1];
  if (n.length === 3) {
    const a = parseInt(n[0] + n[0], 16), l = parseInt(n[1] + n[1], 16), c = parseInt(n[2] + n[2], 16);
    return `${a} ${l} ${c}`;
  }
  const i = parseInt(n.slice(0, 2), 16), o = parseInt(n.slice(2, 4), 16), s = parseInt(n.slice(4, 6), 16);
  return `${i} ${o} ${s}`;
}
function on(r) {
  return `"${r.replace(/"/g, '\\"')}"`;
}
function Dn(r, e) {
  const t = {};
  for (const [f, h] of Object.entries(e.vars ?? {}))
    h && h.trim() && (t[f] = h.trim());
  const n = e.fontSerif || Oe, i = e.fontSans || Re, o = n !== Oe || i !== Re, s = Object.keys(t).length > 0;
  if (!o && !s) return r;
  let a = r;
  if (o) {
    const f = ci(n, i);
    a = a.replace(
      /@import\s*(?:url\(\s*)?"https:\/\/fonts\.googleapis\.com[^"]*"(?:\s*\))?\s*;/,
      `@import url("${f}");`
    );
  }
  const l = new Map(Fn.map((f) => [f.name, f])), c = Object.entries(t).map(([f, h]) => {
    const p = l.get(f), g = (p == null ? void 0 : p.type) === "color" ? ui(h) : h;
    return `${f}:${g};`;
  }).join(""), d = o ? `--font-serif:${on(n)};--font-sans:${on(i)};` : "";
  return a += `
:root{${d}${c}}
`, a;
}
async function sn(r) {
  const e = Dn(r.baseCssText, r.style);
  await Gr({
    path: "theme-assets/portfolio.css",
    content: e,
    encoding: "utf-8"
  });
}
const ct = {
  heroHeadline: "Curated space for architectural photography and experimental design.",
  heroIntro: "A boutique studio specializing in the intersection of physical space and digital identity. Quiet, confident experiences for brands that value structural integrity and timeless aesthetics.",
  variant: "staggered",
  cardLimit: 12,
  showFilters: !1
}, Bt = {
  showHero: !0,
  showNextProject: !0,
  defaultServicesLabel: "SERVICES",
  defaultYearLabel: "YEAR",
  defaultAwardsLabel: "AWARDS"
}, jt = {
  showExperience: !0,
  showRecognition: !0
}, $n = {
  copyright: ""
}, Un = {
  wordmark: "",
  logoEnabled: !1,
  logoUpdatedAt: 0
}, fi = {
  home: ct,
  single: Bt,
  author: jt,
  footer: $n,
  brand: Un,
  style: ve
};
function hi({
  posts: r,
  staticPage: e,
  site: t
}) {
  const { settings: n } = t, i = $e.getFixedT(Ue(n.language), "theme-portfolio"), o = t.themeConfig, s = { ...ct, ...(o == null ? void 0 : o.home) ?? {} };
  if (e)
    return /* @__PURE__ */ u("article", { className: "pt-section-gap-mobile md:pt-section-gap pb-section-gap-mobile md:pb-section-gap", children: /* @__PURE__ */ u(
      "div",
      {
        className: "portfolio-page-body",
        dangerouslySetInnerHTML: { __html: e.bodyHtml }
      }
    ) });
  const a = s.cardLimit > 0 ? r.slice(0, s.cardLimit) : r, l = s.variant === "masonry" ? "portfolio-masonry" : s.variant === "staggered" ? "portfolio-staggered grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter";
  return /* @__PURE__ */ y("div", { className: "max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge", children: [
    (s.heroHeadline || s.heroIntro) && /* @__PURE__ */ u("section", { className: "py-section-gap-mobile md:py-section-gap flex flex-col justify-center min-h-[40vh]", children: /* @__PURE__ */ y("div", { className: "max-w-4xl", children: [
      s.heroHeadline && /* @__PURE__ */ u("h1", { className: "font-serif text-display-lg-mobile md:text-display-lg text-on-surface mb-8 display-serif", children: s.heroHeadline }),
      s.heroIntro && /* @__PURE__ */ u("p", { className: "font-sans text-body-lg text-secondary max-w-2xl", children: s.heroIntro })
    ] }) }),
    s.showFilters && /* @__PURE__ */ u("section", { className: "pb-12", children: /* @__PURE__ */ u(
      "div",
      {
        className: "flex flex-wrap gap-2",
        "data-cms-portfolio-filters": !0,
        "aria-label": "Project filters",
        children: /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "portfolio-btn-outline is-active",
            "data-cms-filter": "*",
            children: i("publicBaked.all")
          }
        )
      }
    ) }),
    /* @__PURE__ */ u("section", { className: "pb-section-gap-mobile md:pb-section-gap", children: /* @__PURE__ */ u("div", { className: l, children: a.map((c) => /* @__PURE__ */ u(Pt, { card: c }, c.id)) }) })
  ] });
}
function pi({
  post: r,
  bodyHtml: e,
  hero: t,
  primaryTerm: n,
  site: i
}) {
  var g, m, b, x, A;
  const { settings: o } = i, s = $e.getFixedT(Ue(o.language), "theme-portfolio"), a = i.themeConfig, l = { ...Bt, ...(a == null ? void 0 : a.single) ?? {} };
  if (r.type === "page")
    return /* @__PURE__ */ u("article", { className: "pt-section-gap-mobile md:pt-section-gap pb-section-gap-mobile md:pb-section-gap", children: /* @__PURE__ */ u(
      "div",
      {
        className: "portfolio-page-body",
        dangerouslySetInnerHTML: { __html: e }
      }
    ) });
  const d = t ? pe(t, "hero") || pe(t) : "", f = ((m = (g = r.publishedAt) == null ? void 0 : g.toMillis) == null ? void 0 : m.call(g)) ?? ((x = (b = r.createdAt) == null ? void 0 : b.toMillis) == null ? void 0 : x.call(b)) ?? null, h = f ? new Date(f).getUTCFullYear() : "", p = [(A = n == null ? void 0 : n.name) == null ? void 0 : A.toUpperCase(), h ? String(h) : ""].filter(Boolean).join(" / ");
  return /* @__PURE__ */ y("article", { children: [
    l.showHero && d && /* @__PURE__ */ y("section", { className: "w-full relative h-[60vh] md:h-[80vh] overflow-hidden", children: [
      /* @__PURE__ */ u(
        "img",
        {
          src: d,
          alt: (t == null ? void 0 : t.alt) ?? r.title,
          className: "w-full h-full object-cover grayscale"
        }
      ),
      /* @__PURE__ */ u("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end px-margin-edge-mobile md:px-margin-edge pb-section-gap-mobile md:pb-section-gap", children: /* @__PURE__ */ y("div", { className: "max-w-container-max mx-auto w-full", children: [
        p && /* @__PURE__ */ u("p", { className: "font-sans text-label-sm uppercase tracking-[0.2em] text-on-primary/80 mb-4", children: p }),
        /* @__PURE__ */ u("h1", { className: "font-serif text-display-lg-mobile md:text-display-lg text-on-primary max-w-4xl display-serif", children: r.title })
      ] }) })
    ] }),
    /* @__PURE__ */ y("section", { className: "max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap grid grid-cols-12 gap-gutter", children: [
      /* @__PURE__ */ y("aside", { className: "col-span-12 md:col-span-4 flex flex-col gap-8", children: [
        n && /* @__PURE__ */ y("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ u("span", { className: "font-sans text-label-sm uppercase text-secondary", children: s("publicBaked.servicesLabel") }),
          /* @__PURE__ */ u("p", { className: "font-sans text-body-md text-on-surface", children: n.name })
        ] }),
        h && /* @__PURE__ */ y("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ u("span", { className: "font-sans text-label-sm uppercase text-secondary", children: s("publicBaked.yearLabel") }),
          /* @__PURE__ */ u("p", { className: "font-sans text-body-md text-on-surface", children: h })
        ] })
      ] }),
      /* @__PURE__ */ y("div", { className: "col-span-12 md:col-span-8", children: [
        r.excerpt && /* @__PURE__ */ u("h2", { className: "font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8", children: r.excerpt }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "portfolio-prose",
            dangerouslySetInnerHTML: { __html: e }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u(
      "section",
      {
        className: "max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge pb-section-gap-mobile md:pb-section-gap",
        "data-cms-related": !0,
        "data-cms-related-count": "3",
        hidden: !0
      }
    )
  ] });
}
function mi({
  term: r,
  posts: e,
  site: t
}) {
  const n = t.themeConfig, i = { ...ct, ...(n == null ? void 0 : n.home) ?? {} }, o = i.variant === "masonry" ? "portfolio-masonry" : i.variant === "staggered" ? "portfolio-staggered grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter";
  return /* @__PURE__ */ y("div", { className: "max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap", children: [
    /* @__PURE__ */ y("header", { className: "flex flex-col md:flex-row justify-between items-end mb-16 gap-8", children: [
      /* @__PURE__ */ u("h1", { className: "font-serif text-display-lg-mobile md:text-display-lg text-on-surface leading-none display-serif", children: r.name }),
      r.description && /* @__PURE__ */ u("p", { className: "font-sans text-body-md text-secondary max-w-md", children: r.description })
    ] }),
    /* @__PURE__ */ u("section", { className: `${o} pb-section-gap-mobile md:pb-section-gap`, children: e.map((s) => /* @__PURE__ */ u(Pt, { card: s }, s.id)) })
  ] });
}
function gi({
  author: r,
  posts: e,
  site: t
}) {
  const { settings: n } = t, i = $e.getFixedT(Ue(n.language), "theme-portfolio"), o = t.themeConfig, s = { ...jt, ...(o == null ? void 0 : o.author) ?? {} }, a = r.avatar ? pe(r.avatar, "portrait") || pe(r.avatar) : "";
  return /* @__PURE__ */ y("article", { className: "max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap", children: [
    /* @__PURE__ */ y("section", { className: "grid grid-cols-12 gap-gutter mb-section-gap-mobile md:mb-section-gap", children: [
      /* @__PURE__ */ u("aside", { className: "col-span-12 md:col-span-4", children: a && /* @__PURE__ */ u(
        "img",
        {
          src: a,
          alt: r.displayName,
          className: "w-full aspect-[4/5] object-cover",
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ y("div", { className: "col-span-12 md:col-span-8 flex flex-col", children: [
        /* @__PURE__ */ u("h1", { className: "font-serif text-display-lg-mobile md:text-display-lg text-on-surface mb-12 display-serif", children: r.displayName }),
        r.title && /* @__PURE__ */ u("p", { className: "font-sans text-label-sm uppercase tracking-widest text-secondary mb-6", children: r.title }),
        r.bio && /* @__PURE__ */ u("div", { className: "portfolio-prose", children: /* @__PURE__ */ u("p", { children: r.bio }) }),
        s.showExperience && /* @__PURE__ */ u("section", { className: "mt-16", children: /* @__PURE__ */ u("h2", { className: "font-sans text-label-sm uppercase tracking-widest text-secondary mb-6", children: i("publicBaked.selectExperience") }) }),
        s.showRecognition && /* @__PURE__ */ u("section", { className: "mt-16", children: /* @__PURE__ */ u("h2", { className: "font-sans text-label-sm uppercase tracking-widest text-secondary mb-6", children: i("publicBaked.recognition") }) })
      ] })
    ] }),
    e.length > 0 && /* @__PURE__ */ u("section", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter", children: e.map((l) => /* @__PURE__ */ u(Pt, { card: l }, l.id)) })
  ] });
}
function yi(r) {
  return /* @__PURE__ */ y("article", { className: "max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap min-h-[60vh] flex flex-col items-center justify-center text-center gap-12", children: [
    /* @__PURE__ */ u("h1", { className: "font-serif text-[120px] md:text-[200px] text-on-surface leading-none display-serif", children: "404" }),
    /* @__PURE__ */ u("p", { className: "font-sans text-body-lg text-secondary max-w-md", children: "This page does not exist. The page may have moved, or you typed an address that was never published here." }),
    /* @__PURE__ */ u("a", { href: "/index.html", className: "portfolio-btn-outline", children: "Return home" })
  ] });
}
const an = '@import"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap";@import"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--font-sans),Inter,system-ui,sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}:root{--color-background:253 248 248;--color-surface:253 248 248;--color-surface-container-lowest:255 255 255;--color-surface-container-low:247 243 242;--color-surface-container:241 237 236;--color-on-surface:28 27 27;--color-on-surface-variant:68 71 72;--color-outline:116 120 120;--color-outline-variant:196 199 199;--color-primary:0 0 0;--color-on-primary:255 255 255;--color-secondary:93 95 95;--color-on-secondary:255 255 255;--color-secondary-container:223 224 224;--color-on-secondary-container:97 99 99;--color-error:225 29 72;--font-serif:"Playfair Display";--font-sans:"Inter"}body,html{background-color:rgb(var(--color-background));color:rgb(var(--color-on-surface));font-family:var(--font-sans),"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.display-serif{font-family:var(--font-serif),"Playfair Display",Georgia,serif;font-weight:700;letter-spacing:-.02em}.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;vertical-align:middle;line-height:1}.nav-link{position:relative;font-family:var(--font-sans),Inter,sans-serif;font-size:12px;font-weight:600;line-height:1;letter-spacing:.05em;text-transform:uppercase;color:rgb(var(--color-secondary));transition:color .2s}.nav-link.is-active,.nav-link:hover{color:rgb(var(--color-on-surface))}.nav-link.is-active:after{content:"";position:absolute;left:50%;bottom:-10px;transform:translate(-50%);width:4px;height:4px;background:rgb(var(--color-error));border-radius:0}.portfolio-btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.625rem 1.5rem;border:1px solid rgb(var(--color-primary));font-family:var(--font-sans),Inter,sans-serif;font-size:12px;font-weight:600;line-height:1;letter-spacing:.05em;text-transform:uppercase;color:rgb(var(--color-on-surface));background:transparent;transition:background .3s,color .3s;cursor:pointer}.portfolio-btn-outline:hover{background:rgb(var(--color-primary));color:rgb(var(--color-on-primary))}.project-card{cursor:pointer;display:block;color:inherit;text-decoration:none}.project-card__image{overflow:hidden;background:rgb(var(--color-surface-container));margin-bottom:1rem}.project-card__image img{display:block;width:100%;height:auto;transition:transform .7s ease}.project-card:hover .project-card__image img{transform:scale(1.02)}.project-card__title{font-family:var(--font-serif),"Playfair Display",Georgia,serif;font-size:24px;line-height:1.3;font-weight:500;color:rgb(var(--color-on-surface));margin-bottom:.25rem}.project-card__meta{font-family:var(--font-sans),Inter,sans-serif;font-size:12px;font-weight:600;line-height:1;letter-spacing:.1em;text-transform:uppercase;color:rgb(var(--color-secondary))}@media (min-width:768px){.portfolio-staggered>:nth-child(2){margin-top:3rem}.portfolio-staggered>:nth-child(4){margin-top:6rem}.portfolio-staggered>:nth-child(6){margin-top:-3rem}.portfolio-staggered>:nth-child(8){margin-top:4.5rem}.portfolio-staggered>:nth-child(10){margin-top:-1.5rem}}.portfolio-masonry{-moz-column-count:1;column-count:1;-moz-column-gap:2rem;column-gap:2rem}@media (min-width:768px){.portfolio-masonry{-moz-column-count:3;column-count:3}}@media (min-width:1024px){.portfolio-masonry{-moz-column-count:4;column-count:4}}.portfolio-masonry>*{-moz-column-break-inside:avoid;break-inside:avoid;margin-bottom:3rem}.burger-menu{position:fixed;top:0;right:0;bottom:0;left:0;background:rgb(var(--color-surface));z-index:60;display:none;padding:4rem 2.5rem}.burger-menu ul,.burger-menu.is-open{display:flex;flex-direction:column;gap:2rem}.burger-menu ul{list-style:none;padding:0;margin:0}.burger-menu a{font-family:var(--font-serif),"Playfair Display",Georgia,serif;font-size:32px;font-weight:500;text-decoration:none}.burger-menu a,.portfolio-prose{color:rgb(var(--color-on-surface))}.portfolio-prose{font-family:var(--font-sans),Inter,sans-serif;font-size:18px;line-height:1.7;max-width:700px}.portfolio-prose p{margin-bottom:1.5rem}.portfolio-prose h2{font-size:32px;font-weight:600;line-height:1.3;margin-top:3rem;margin-bottom:1rem}.portfolio-prose h2,.portfolio-prose h3{font-family:var(--font-serif),"Playfair Display",Georgia,serif}.portfolio-prose h3{font-size:24px;font-weight:500;margin-top:2rem;margin-bottom:.5rem}.portfolio-prose ol,.portfolio-prose ul{padding-left:1.5rem;margin-bottom:1.5rem}.portfolio-prose ul{list-style:disc}.portfolio-prose ol{list-style:decimal}.portfolio-prose blockquote{border-left:1px solid rgb(var(--color-primary));padding-left:1.5rem;margin:2rem 0;font-family:var(--font-serif),"Playfair Display",Georgia,serif;font-style:italic;font-size:24px}.portfolio-prose a{color:rgb(var(--color-on-surface));text-decoration:underline;text-underline-offset:4px}.portfolio-prose a:hover{color:rgb(var(--color-error))}.portfolio-prose img{display:block;width:100%;height:auto;margin:2rem 0}.portfolio-page-body{max-width:800px;margin:0 auto;padding:0 1.25rem;font-family:var(--font-sans),Inter,sans-serif;font-size:18px;line-height:1.7;color:rgb(var(--color-on-surface))}@media (min-width:768px){.portfolio-page-body{padding:0 2.5rem}}.portfolio-page-body p{margin-bottom:1.5rem}.portfolio-page-body h1{font-family:var(--font-serif),"Playfair Display",Georgia,serif;font-size:48px;line-height:1.2;letter-spacing:-.01em;font-weight:700;margin-top:2rem;margin-bottom:2rem}@media (min-width:768px){.portfolio-page-body h1{font-size:80px;line-height:1.1;letter-spacing:-.02em}}.portfolio-page-body h2{font-size:32px;font-weight:600;line-height:1.3;margin-top:4rem;margin-bottom:1rem}.portfolio-page-body h2,.portfolio-page-body h3{font-family:var(--font-serif),"Playfair Display",Georgia,serif}.portfolio-page-body h3{font-size:24px;font-weight:500;margin-top:2.5rem;margin-bottom:.5rem}.portfolio-page-body img{width:100%;height:auto;margin:3rem 0}.portfolio-page-body ol,.portfolio-page-body ul{padding-left:1.5rem;margin-bottom:1.5rem}.portfolio-page-body ul{list-style:disc}.portfolio-page-body ol{list-style:decimal}.portfolio-page-body a{color:rgb(var(--color-on-surface));text-decoration:underline;text-underline-offset:4px}.portfolio-page-body a:hover{color:rgb(var(--color-error))}.visible{visibility:visible}.invisible{visibility:hidden}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.top-0{top:0}.z-10{z-index:10}.z-50{z-index:50}.col-span-12{grid-column:span 12/span 12}.col-span-4{grid-column:span 4/span 4}.col-span-8{grid-column:span 8/span 8}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.-mb-px{margin-bottom:-1px}.mb-1{margin-bottom:.25rem}.mb-12{margin-bottom:3rem}.mb-16{margin-bottom:4rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mb-section-gap-mobile{margin-bottom:4rem}.mt-1{margin-top:.25rem}.mt-16{margin-top:4rem}.mt-8{margin-top:2rem}.mt-section-gap-mobile{margin-top:4rem}.block{display:block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.aspect-\\[4\\/5\\]{aspect-ratio:4/5}.h-1\\/2{height:50%}.h-10{height:2.5rem}.h-16{height:4rem}.h-20{height:5rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-8{height:2rem}.h-\\[600px\\]{height:600px}.h-\\[60vh\\]{height:60vh}.h-full{height:100%}.min-h-\\[40vh\\]{min-height:40vh}.min-h-\\[60vh\\]{min-height:60vh}.w-4{width:1rem}.w-40{width:10rem}.w-5{width:1.25rem}.w-auto{width:auto}.w-full{width:100%}.min-w-0{min-width:0}.max-w-2xl{max-width:42rem}.max-w-4xl{max-width:56rem}.max-w-\\[240px\\]{max-width:240px}.max-w-container-max{max-width:1440px}.max-w-md{max-width:28rem}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(1turn)}}.animate-spin{animation:spin 1s linear infinite}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-12{gap:3rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-8,.gap-gutter{gap:2rem}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem*var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem*var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem*var(--tw-space-y-reverse))}.overflow-hidden,.truncate{overflow:hidden}.truncate{text-overflow:ellipsis;white-space:nowrap}.rounded,.rounded-lg{border-radius:0}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-t{border-top-width:1px}.border-dashed{border-style:dashed}.border-blue-600{--tw-border-opacity:1;border-color:rgb(37 99 235/var(--tw-border-opacity,1))}.border-outline-variant{--tw-border-opacity:1;border-color:rgb(var(--color-outline-variant)/var(--tw-border-opacity,1))}.border-primary{--tw-border-opacity:1;border-color:rgb(var(--color-primary)/var(--tw-border-opacity,1))}.border-transparent{border-color:transparent}.bg-background{--tw-bg-opacity:1;background-color:rgb(var(--color-background)/var(--tw-bg-opacity,1))}.bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity,1))}.bg-surface{--tw-bg-opacity:1;background-color:rgb(var(--color-surface)/var(--tw-bg-opacity,1))}.bg-surface-container{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container)/var(--tw-bg-opacity,1))}.bg-surface-container-lowest{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-lowest)/var(--tw-bg-opacity,1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.bg-gradient-to-t{background-image:linear-gradient(to top,var(--tw-gradient-stops))}.from-black\\/40{--tw-gradient-from:rgba(0,0,0,.4) var(--tw-gradient-from-position);--tw-gradient-to:transparent var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.to-transparent{--tw-gradient-to:transparent var(--tw-gradient-to-position)}.object-contain{-o-object-fit:contain;object-fit:contain}.object-cover{-o-object-fit:cover;object-fit:cover}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-4{padding:1rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-margin-edge-mobile{padding-left:1.25rem;padding-right:1.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-section-gap-mobile{padding-top:4rem;padding-bottom:4rem}.pb-12{padding-bottom:3rem}.pb-section-gap-mobile{padding-bottom:4rem}.pr-0{padding-right:0}.pt-3{padding-top:.75rem}.pt-4{padding-top:1rem}.pt-section-gap-mobile{padding-top:4rem}.text-center{text-align:center}.font-sans{font-family:var(--font-sans),Inter,system-ui,sans-serif}.font-serif{font-family:var(--font-serif),Playfair Display,Georgia,serif}.text-\\[120px\\]{font-size:120px}.text-body-lg{font-size:18px;line-height:1.7;font-weight:400}.text-body-md{font-size:16px;line-height:1.6;font-weight:400}.text-display-lg-mobile{font-size:48px;line-height:1.2;letter-spacing:-.01em;font-weight:700}.text-headline-lg-mobile{font-size:32px;line-height:1.3;font-weight:600}.text-headline-md{font-size:32px;line-height:1.3;font-weight:500}.text-label-sm{font-size:12px;line-height:1;letter-spacing:.05em;font-weight:600}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.italic{font-style:italic}.leading-none{line-height:1}.tracking-\\[0\\.2em\\]{letter-spacing:.2em}.tracking-\\[0\\.3em\\]{letter-spacing:.3em}.tracking-tight{letter-spacing:-.025em}.tracking-wide{letter-spacing:.025em}.tracking-widest{letter-spacing:.1em}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246/var(--tw-text-opacity,1))}.text-error{--tw-text-opacity:1;color:rgb(var(--color-error)/var(--tw-text-opacity,1))}.text-on-primary{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}.text-on-primary\\/80{color:rgb(var(--color-on-primary)/.8)}.text-on-surface{--tw-text-opacity:1;color:rgb(var(--color-on-surface)/var(--tw-text-opacity,1))}.text-on-surface-variant{--tw-text-opacity:1;color:rgb(var(--color-on-surface-variant)/var(--tw-text-opacity,1))}.text-primary{--tw-text-opacity:1;color:rgb(var(--color-primary)/var(--tw-text-opacity,1))}.text-red-600{--tw-text-opacity:1;color:rgb(220 38 38/var(--tw-text-opacity,1))}.text-secondary{--tw-text-opacity:1;color:rgb(var(--color-secondary)/var(--tw-text-opacity,1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.shadow{--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline{outline-style:solid}.ring-1{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring-1,.ring-2{box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-2{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring-blue-500\\/60{--tw-ring-color:rgba(59,130,246,.6)}.grayscale{--tw-grayscale:grayscale(100%)}.filter,.grayscale{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-500{transition-duration:.5s}.hover\\:scale-\\[1\\.02\\]:hover{--tw-scale-x:1.02;--tw-scale-y:1.02;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity,1))}.hover\\:bg-primary:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-primary)/var(--tw-bg-opacity,1))}.hover\\:bg-red-50:hover{--tw-bg-opacity:1;background-color:rgb(254 242 242/var(--tw-bg-opacity,1))}.hover\\:underline:hover{text-decoration-line:underline}.disabled\\:opacity-50:disabled{opacity:.5}.group:hover .group-hover\\:text-on-primary{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}.group:hover .group-hover\\:text-on-primary\\/60{color:rgb(var(--color-on-primary)/.6)}@media (min-width:640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:768px){.md\\:col-span-12{grid-column:span 12/span 12}.md\\:col-span-4{grid-column:span 4/span 4}.md\\:col-span-6{grid-column:span 6/span 6}.md\\:col-span-8{grid-column:span 8/span 8}.md\\:mb-section-gap{margin-bottom:8rem}.md\\:mt-0{margin-top:0}.md\\:mt-section-gap{margin-top:8rem}.md\\:flex{display:flex}.md\\:inline-flex{display:inline-flex}.md\\:hidden{display:none}.md\\:h-\\[800px\\]{height:800px}.md\\:h-\\[80vh\\]{height:80vh}.md\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:items-end{align-items:flex-end}.md\\:items-center{align-items:center}.md\\:px-margin-edge{padding-left:2.5rem;padding-right:2.5rem}.md\\:py-12{padding-top:3rem;padding-bottom:3rem}.md\\:py-section-gap{padding-top:8rem}.md\\:pb-section-gap,.md\\:py-section-gap{padding-bottom:8rem}.md\\:pr-16{padding-right:4rem}.md\\:pt-section-gap{padding-top:8rem}.md\\:text-right{text-align:right}.md\\:text-\\[200px\\]{font-size:200px}.md\\:text-display-lg{font-size:80px;line-height:1.1;letter-spacing:-.02em;font-weight:700}.md\\:text-headline-lg{font-size:48px;line-height:1.2;font-weight:600}}@media (min-width:1024px){.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}}', bi = `/**
 * Storefront theme — runtime menu loader.
 *
 * Same contract as default / magazine / corporate: fetches /data/menu.json
 * and paints every \`[data-cms-menu]\` container on the page. The storefront
 * header ships TWO such containers — the inline horizontal nav (visible
 * md+) and the off-canvas burger overlay (always present, opens on
 * burger-toggle click). The storefront bottom-nav links also pick up the
 * \`aria-current="page"\` state via the same \`samePath\` helper.
 *
 * Differences vs corporate:
 *   - Branding logo gets \`h-8 w-auto\` to fit the storefront header (h-16).
 *   - Burger menu links use the editorial serif + sage active color.
 */
(function () {
  "use strict";

  function fetchMenu() {
    return fetch("/data/menu.json", { credentials: "omit" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[cms] menu.json load failed:", err);
        return null;
      });
  }

  function samePath(href) {
    try {
      var url = new URL(href, window.location.origin);
      var here = window.location.pathname.replace(/\\/index\\.html$/, "/");
      var there = url.pathname.replace(/\\/index\\.html$/, "/");
      return here === there;
    } catch (e) {
      return false;
    }
  }

  // Picks the per-language label from item.labels (set by the admin
  // in the menu builder) based on <html lang>, with a region-stripped
  // fallback so "en-US" matches "en". Mono-lingual sites just return
  // item.label.
  function pickLabel(item) {
    var lang = (document.documentElement.getAttribute("lang") || "").trim();
    if (lang && item.labels && typeof item.labels[lang] === "string" && item.labels[lang]) {
      return item.labels[lang];
    }
    if (lang && lang.indexOf("-") > 0) {
      var base = lang.split("-")[0];
      if (item.labels && typeof item.labels[base] === "string" && item.labels[base]) {
        return item.labels[base];
      }
    }
    return item.label || "";
  }

  function renderBurgerItem(item) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = item.href || "#";
    a.textContent = pickLabel(item);
    if (samePath(a.href)) a.setAttribute("aria-current", "page");
    li.appendChild(a);
    if (item.children && item.children.length) {
      var sub = document.createElement("ul");
      sub.className = "menu-children";
      item.children.forEach(function (child) {
        sub.appendChild(renderBurgerItem(child));
      });
      li.appendChild(sub);
    }
    return li;
  }

  function renderInlineItem(item) {
    var a = document.createElement("a");
    a.href = item.href || "#";
    a.textContent = pickLabel(item);
    // Portfolio nav uses the \`nav-link\` component class declared in
    // theme.css — the active-state pink dot lives there. No
    // Tailwind-specific styling per link here so the theme can change
    // typography without rebuilding the loader.
    a.className = "nav-link";
    var active = samePath(a.href);
    if (active) {
      a.setAttribute("aria-current", "page");
      a.classList.add("is-active");
    }
    return a;
  }

  function paint(menu) {
    if (!menu) return;
    document.querySelectorAll("[data-cms-menu]").forEach(function (host) {
      var key = host.getAttribute("data-cms-menu");
      var items = (menu && menu[key]) || [];
      var inline = host.hasAttribute("data-cms-menu-inline");

      if (inline) {
        host.innerHTML = "";
        items.forEach(function (item) {
          host.appendChild(renderInlineItem(item));
        });
      } else {
        var list = host.querySelector("ul");
        if (!list) return;
        list.innerHTML = "";
        items.forEach(function (item) {
          list.appendChild(renderBurgerItem(item));
        });
      }

      // Hide empty inline / footer hosts so they don't reserve
      // whitespace. Skip #burger-menu: it's \`position: fixed\` (no
      // layout impact) AND any \`hidden\` attribute would \`display:
      // none\` the panel, which the \`.burger-menu.is-open { transform:
      // translate(0) }\` rule can never override — the burger toggle
      // would open an invisible panel. Visibility of the burger UI is
      // gated by the burger TOGGLE button below instead.
      var isBurgerMenu = host.id === "burger-menu";
      if (items.length === 0 && !isBurgerMenu) host.setAttribute("hidden", "");
      else host.removeAttribute("hidden");
    });
    // Hide the burger TOGGLE button when the header menu has no
    // items — otherwise users see a button that opens an empty
    // off-canvas panel and conclude "the burger is broken".
    var headerItems = (menu && menu.header) || [];
    document.querySelectorAll(".burger-toggle").forEach(function (toggle) {
      if (headerItems.length === 0) toggle.setAttribute("hidden", "");
      else toggle.removeAttribute("hidden");
    });
    paintBranding(menu);
  }

  // Swap the wordmark for an <img> when the theme has a logo
  // configured. Falls back to the static text in every other case.
  function paintBranding(menu) {
    var branding = menu && menu.branding;
    var logoUrl = branding && branding.logoUrl;
    if (!logoUrl) return;
    document.querySelectorAll("[data-cms-brand]").forEach(function (host) {
      var alt = host.textContent || "";
      var img = document.createElement("img");
      img.src = logoUrl;
      img.alt = alt;
      img.className = "h-8 w-auto";
      img.loading = "lazy";
      host.innerHTML = "";
      host.appendChild(img);
    });
  }

  function ensureCloseButton(menu) {
    if (menu.querySelector(".burger-close")) return menu.querySelector(".burger-close");
    var close = document.createElement("button");
    close.type = "button";
    close.className = "burger-close";
    close.setAttribute("aria-label", "Close menu");
    close.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    menu.insertBefore(close, menu.firstChild);
    return close;
  }

  function ensureBackdrop() {
    var existing = document.querySelector(".burger-backdrop");
    if (existing) return existing;
    var backdrop = document.createElement("div");
    backdrop.className = "burger-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function wireBurger() {
    var toggle = document.querySelector(".burger-toggle");
    var menu = document.getElementById("burger-menu");
    if (!toggle || !menu) return;
    var close = ensureCloseButton(menu);
    var backdrop = ensureBackdrop();
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      document.body.classList.toggle("burger-open", open);
    }
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });
    close.addEventListener("click", function () { setOpen(false); });
    backdrop.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("pointerdown", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (menu.contains(e.target)) return;
      if (toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    wireBurger();
    fetchMenu().then(paint);
  });
})();
`, wi = `/**
 * Magazine theme — runtime sidebar loader.
 *
 * Populates \`[data-cms-related]\` and \`[data-cms-author-bio]\` hosts
 * from \`/data/posts.json\` and \`/data/authors.json\` respectively. Same
 * lifecycle as default's posts-loader: fetched once on
 * DOMContentLoaded, paint passes are independent and tolerate each
 * other's failure.
 *
 * The injected DOM uses magazine-specific class names
 * (\`magazine-related-*\`, \`magazine-bio-*\`) — matching CSS rules live
 * in \`theme.css\` under \`@layer components\`. The author-bio host
 * provides its own card chrome (background / border / padding /
 * radius) via Tailwind utilities in \`SingleTemplate.tsx\`; the
 * related host carries no chrome (just a section heading + bordered
 * list).
 *
 * Failure is silent: missing data leaves the host hidden (related)
 * or untouched (author-bio's host stays \`hidden\` from publish time).
 */
(function () {
  "use strict";

  // ─── Social icons ─────────────────────────────────────────────────
  // Brand SVG paths + display labels for the curated SocialNetwork
  // list. Mirror in core/socialIcons.tsx (and each other theme's
  // posts-loader.js) when adding a network.
  var SOCIAL_ICON_PATHS = {
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    mastodon: "M23.193 7.88c0-5.207-3.411-6.733-3.411-6.733C18.062.357 15.108.025 12.041 0h-.076c-3.068.025-6.02.357-7.74 1.147 0 0-3.412 1.526-3.412 6.733 0 1.193-.023 2.619.015 4.13.124 5.092.934 10.11 5.641 11.355 2.17.574 4.034.695 5.535.612 2.722-.151 4.25-.972 4.25-.972l-.09-1.975s-1.945.613-4.129.539c-2.165-.074-4.449-.233-4.799-2.891a5.499 5.499 0 0 1-.048-.745s2.125.52 4.817.643c1.646.075 3.19-.097 4.758-.283 3.007-.359 5.625-2.212 5.954-3.905.52-2.667.477-6.508.477-6.508zm-4.024 6.709h-2.497V8.469c0-1.29-.543-1.944-1.628-1.944-1.2 0-1.802.776-1.802 2.312v3.349h-2.484v-3.35c0-1.536-.601-2.312-1.802-2.312-1.085 0-1.628.655-1.628 1.945v6.119H4.831V8.285c0-1.29.328-2.313.987-3.07.68-.756 1.57-1.144 2.674-1.144 1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.04c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.388 2.674 1.144.658.757.986 1.78.986 3.07v6.304z",
    bluesky: "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.137-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.952 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z",
    github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    website: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z",
  };
  var SOCIAL_ICON_LABELS = {
    twitter: "Twitter / X",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    mastodon: "Mastodon",
    bluesky: "Bluesky",
    github: "GitHub",
    website: "Website",
  };
  function socialIconSvg(network) {
    var path = SOCIAL_ICON_PATHS[network];
    if (!path) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>';
  }
  function socialIconLabel(network) {
    return SOCIAL_ICON_LABELS[network] || network;
  }

  function fetchJson(path) {
    return fetch(path, { credentials: "omit" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[cms] " + path + " load failed:", err);
        return null;
      });
  }

  // ─── Related posts ────────────────────────────────────────────────
  //
  // DOM emitted (matches the editorial mockup — small-caps section
  // heading + flex-column list with top-bordered items):
  //
  //   <h4 class="magazine-related-heading">Latest from {{site}}</h4>
  //   <div class="magazine-related-list">
  //     <a class="magazine-related-link group" href="/...">
  //       <span class="magazine-related-eyebrow">Category</span>
  //       <h5 class="magazine-related-title">Title</h5>
  //       <time class="magazine-related-date">Nov 12, 2024</time>
  //     </a>
  //     ...
  //   </div>

  function renderRelatedItem(entry) {
    var a = document.createElement("a");
    a.href = "/" + entry.url;
    a.className = "magazine-related-link";
    if (entry.category && entry.category.name) {
      var eyebrow = document.createElement("span");
      eyebrow.className = "magazine-related-eyebrow";
      eyebrow.textContent = entry.category.name;
      a.appendChild(eyebrow);
    }
    var title = document.createElement("h5");
    title.className = "magazine-related-title";
    title.textContent = entry.title || "";
    a.appendChild(title);
    if (entry.dateLabel) {
      var date = document.createElement("time");
      date.className = "magazine-related-date";
      date.textContent = entry.dateLabel;
      a.appendChild(date);
    }
    return a;
  }

  function renderRelated(host, posts) {
    var termId = host.getAttribute("data-cms-term-id") || "";
    var currentId = host.getAttribute("data-cms-current-id") || "";
    var limit = parseInt(host.getAttribute("data-cms-limit") || "3", 10);
    var label = host.getAttribute("data-cms-label") || "Continue reading";
    var fallbackLabel =
      host.getAttribute("data-cms-fallback-label") || "Latest articles";

    var matching = [];
    var heading = label;

    if (termId) {
      for (var i = 0; i < posts.length && matching.length < limit; i++) {
        var p = posts[i];
        if (p.id === currentId) continue;
        if (p.type !== "post") continue;
        if (p.primaryTermId !== termId) continue;
        matching.push(p);
      }
    }

    if (matching.length === 0) {
      heading = fallbackLabel;
      for (var j = 0; j < posts.length && matching.length < limit; j++) {
        var pp = posts[j];
        if (pp.id === currentId) continue;
        if (pp.type !== "post") continue;
        matching.push(pp);
      }
    }

    if (matching.length === 0) {
      host.setAttribute("hidden", "");
      return;
    }

    host.removeAttribute("hidden");
    host.innerHTML = "";
    var headingEl = document.createElement("h4");
    headingEl.className = "magazine-related-heading";
    headingEl.textContent = heading;
    host.appendChild(headingEl);
    var list = document.createElement("div");
    list.className = "magazine-related-list";
    matching.forEach(function (entry) {
      list.appendChild(renderRelatedItem(entry));
    });
    host.appendChild(list);
  }

  // ─── Author bio ───────────────────────────────────────────────────
  //
  // DOM emitted (matches the mockup — square rounded avatar, name in
  // serif headline, role-style eyebrow underneath, bio paragraph,
  // optional mailto icon link):
  //
  //   <div class="magazine-bio-head">
  //     <div class="magazine-bio-avatar-wrap">
  //       <img class="magazine-bio-avatar-img" />
  //       OR <span class="magazine-bio-avatar-initials">JV</span>
  //     </div>
  //     <div class="magazine-bio-name-wrap">
  //       <h4 class="magazine-bio-name">…</h4>
  //       <p class="magazine-bio-role">…</p>
  //     </div>
  //   </div>
  //   <p class="magazine-bio-text">…</p>
  //   <div class="magazine-bio-socials">
  //     <a href="mailto:…" class="magazine-bio-social-link">
  //       <span class="material-symbols-outlined">alternate_email</span>
  //     </a>
  //   </div>

  function authorInitials(name) {
    if (!name) return "?";
    var parts = name.trim().split(/\\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    var first = parts[0][0] || "";
    var last = parts[parts.length - 1][0] || "";
    return (first + last).toUpperCase();
  }

  function authorAvatar(name, url) {
    var wrap = document.createElement("div");
    wrap.className = "magazine-bio-avatar-wrap";
    if (url) {
      var img = document.createElement("img");
      img.className = "magazine-bio-avatar-img";
      img.src = url;
      img.alt = name || "";
      img.loading = "lazy";
      wrap.appendChild(img);
    } else {
      var span = document.createElement("span");
      span.className = "magazine-bio-avatar-initials";
      span.setAttribute("aria-hidden", "true");
      span.textContent = authorInitials(name);
      wrap.appendChild(span);
    }
    return wrap;
  }

  function renderAuthorBio(host, authors) {
    var authorId = host.getAttribute("data-cms-author-id") || "";
    if (!authorId) return;
    var entry = authors[authorId];
    if (!entry) return;

    host.innerHTML = "";

    // Header row — avatar + name + role-style eyebrow.
    var head = document.createElement("div");
    head.className = "magazine-bio-head";
    head.appendChild(authorAvatar(entry.displayName, entry.avatar));

    var nameWrap = document.createElement("div");
    nameWrap.className = "magazine-bio-name-wrap";

    // Author name — clickable when /authors.json carries a profile URL,
    // otherwise a plain <h4>. Mirrors the default theme's behavior so
    // archive links keep working transparently.
    var nameEl;
    if (entry.url) {
      nameEl = document.createElement("a");
      nameEl.href = "/" + entry.url;
    } else {
      nameEl = document.createElement("h4");
    }
    nameEl.className = "magazine-bio-name";
    nameEl.textContent = entry.displayName || "";
    nameWrap.appendChild(nameEl);

    // Title (e.g. "Journaliste") sits under the name as a label-caps
    // role line. Replaces the legacy email-as-role line — email is
    // admin-only data and never reaches the public site.
    if (entry.title) {
      var role = document.createElement("p");
      role.className = "magazine-bio-role";
      role.textContent = entry.title;
      nameWrap.appendChild(role);
    }
    head.appendChild(nameWrap);
    host.appendChild(head);

    if (entry.bio) {
      var bio = document.createElement("p");
      bio.className = "magazine-bio-text";
      bio.textContent = entry.bio;
      host.appendChild(bio);
    }

    // Visible socials — already filtered server-side. Each entry
    // produces an icon link to the user's external profile, opened in
    // a new tab with rel=noopener noreferrer.
    if (entry.socials && entry.socials.length) {
      var socials = document.createElement("div");
      socials.className = "magazine-bio-socials";
      for (var i = 0; i < entry.socials.length; i++) {
        var s = entry.socials[i];
        var a = document.createElement("a");
        a.className = "magazine-bio-social-link";
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", socialIconLabel(s.network));
        a.title = socialIconLabel(s.network);
        a.innerHTML = socialIconSvg(s.network);
        socials.appendChild(a);
      }
      host.appendChild(socials);
    }

    host.removeAttribute("hidden");
  }

  // ─── Paint passes ─────────────────────────────────────────────────

  function paintRelated(postsBlob) {
    if (!postsBlob || !Array.isArray(postsBlob.posts)) return;
    document.querySelectorAll("[data-cms-related]").forEach(function (host) {
      renderRelated(host, postsBlob.posts);
    });
  }

  function paintAuthorBios(authorsBlob) {
    if (!authorsBlob || !authorsBlob.authors) return;
    document.querySelectorAll("[data-cms-author-bio]").forEach(function (host) {
      renderAuthorBio(host, authorsBlob.authors);
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Multi-language helper — same locale prefix detection as the
  // other themes (see default/posts-loader.js for the rationale).
  function detectLocalePrefix() {
    var path = window.location.pathname.replace(/^\\/+/, "");
    var first = path.split("/")[0];
    if (!first) return null;
    if (/^[a-z]{2}(-[a-z]{2})?$/.test(first.toLowerCase())) return first.toLowerCase();
    return null;
  }
  function fetchWithLocaleFallback(filename) {
    var locale = detectLocalePrefix();
    if (!locale) return fetchJson("/data/" + filename);
    return fetchJson("/" + locale + "/data/" + filename).then(function (data) {
      if (data) return data;
      return fetchJson("/data/" + filename);
    });
  }

  ready(function () {
    Promise.all([
      fetchWithLocaleFallback("posts.json"),
      fetchWithLocaleFallback("authors.json"),
    ]).then(function (results) {
      paintRelated(results[0]);
      paintAuthorBios(results[1]);
    });
  });
})();
`, xi = `/**
 * Portfolio theme — runtime project filters.
 *
 * Wires the [data-cms-portfolio-filters] chip cloud on the home page
 * (and any other page that ships filterable cards). Source of truth
 * is the rendered DOM:
 *   - Every project card carries \`data-cms-category="<slug>"\`.
 *   - The chip cloud already has an "All" chip with
 *     \`data-cms-filter="*"\` baked in by the template.
 *
 * On boot we:
 *   1. Read every unique category slug present on the page.
 *   2. Append one button[data-cms-filter="<slug>"] per slug to the
 *      filter host, labelled from the first card carrying that slug
 *      via its category meta (the meta is uppercase already).
 *   3. Wire click handlers that toggle \`is-active\` on the buttons
 *      and show/hide cards (display:none) by matching
 *      \`data-cms-category\`.
 *
 * The implementation is purposefully without animation — the design
 * system rejects transitions on layout to keep the architectural
 * feel. The card list reflows instantly.
 */
(function () {
  "use strict";

  function init() {
    var host = document.querySelector("[data-cms-portfolio-filters]");
    if (!host) return;
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-cms-category]"),
    );
    if (cards.length === 0) {
      host.setAttribute("hidden", "");
      return;
    }

    // Gather unique slugs + their human label (taken from the
    // first card's \`.project-card__meta\` text — the "CATEGORY / 2024"
    // string. We split on " / " and use the leading word.)
    var slugToLabel = {};
    cards.forEach(function (card) {
      var slug = card.getAttribute("data-cms-category");
      if (!slug) return;
      if (slugToLabel[slug]) return;
      var metaEl = card.querySelector(".project-card__meta");
      var rawMeta = metaEl ? metaEl.textContent || "" : "";
      var label = rawMeta.split(" / ")[0].trim();
      slugToLabel[slug] = label || slug.toUpperCase();
    });

    var slugs = Object.keys(slugToLabel).sort();
    if (slugs.length === 0) {
      host.setAttribute("hidden", "");
      return;
    }

    // Append a chip button per slug. The "All" chip (data-cms-filter="*")
    // is already in the DOM from the template.
    slugs.forEach(function (slug) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "portfolio-btn-outline";
      chip.setAttribute("data-cms-filter", slug);
      chip.textContent = slugToLabel[slug];
      host.appendChild(chip);
    });

    function applyFilter(slug) {
      var showAll = slug === "*" || !slug;
      cards.forEach(function (card) {
        if (showAll) {
          card.style.display = "";
          return;
        }
        var cardSlug = card.getAttribute("data-cms-category");
        card.style.display = cardSlug === slug ? "" : "none";
      });
      // Update active state on the chips.
      host.querySelectorAll("[data-cms-filter]").forEach(function (btn) {
        var thisSlug = btn.getAttribute("data-cms-filter");
        if (thisSlug === slug || (showAll && thisSlug === "*")) {
          btn.classList.add("is-active");
        } else {
          btn.classList.remove("is-active");
        }
      });
    }

    host.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof Element)) return;
      var btn = target.closest("[data-cms-filter]");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-cms-filter"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
`, vi = {
  work: "WORK",
  about: "ABOUT",
  journal: "JOURNAL",
  contact: "CONTACT",
  process: "PROCESS",
  menu: "Menu",
  primaryNavMobile: "Primary navigation",
  all: "ALL",
  // Single-post chrome
  servicesLabel: "SERVICES",
  yearLabel: "YEAR",
  awardsLabel: "AWARDS",
  nextProject: "NEXT PROJECT",
  viewCaseStudy: "VIEW CASE STUDY",
  // Author archive
  selectExperience: "Select Experience",
  recognition: "Recognition",
  // Pagination / loading
  loadMore: "LOAD MORE",
  // Footer
  rightsReserved: "ALL RIGHTS RESERVED."
}, ki = {
  projectMeta: {
    title: "Project meta",
    untitled: "Untitled meta"
  },
  storytelling: {
    title: "Storytelling section",
    untitled: "(no headline)"
  },
  bentoGallery: {
    title: "Bento gallery",
    imagesFilled: "images filled"
  },
  nextProject: {
    title: "Next project teaser",
    untitled: "(no title)"
  }
}, Si = {
  description: "Strong-minimalism portfolio theme. Editorial canvas for designers, photographers and artists — charcoal-on-warm-white, sharp corners, zero shadows.",
  tabs: {
    home: "Home",
    single: "Project page",
    author: "Author archive",
    footer: "Footer",
    logo: "Logo & branding",
    style: "Style"
  },
  buttons: {
    save: "Save & apply",
    saving: "Saving…",
    reset: "Reset to defaults",
    resetting: "Resetting…",
    saved: "Saved"
  },
  vars: {
    background: "Background",
    surface: "Surface",
    surfaceLowest: "Surface — lowest",
    surfaceLow: "Surface — low",
    surfaceMid: "Surface — mid",
    onSurface: "Foreground",
    onSurfaceVariant: "Foreground variant",
    outline: "Outline",
    outlineVariant: "Outline variant",
    primary: "Primary (charcoal)",
    onPrimary: "On primary",
    secondary: "Secondary (mid-grey)",
    accent: "Accent (rose)"
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Text",
    outlines: "Outlines",
    accent: "Accent"
  },
  font: {
    serif: "Heading font",
    sans: "Body font"
  },
  home: {
    description: "Hero text section + project grid. Three layout variants available.",
    heroHeadline: "Hero headline",
    heroIntro: "Hero introduction paragraph",
    variant: "Grid layout",
    variantStaggered: "Staggered (offset rhythm)",
    variantMasonry: "Masonry (asymmetric)",
    variantStandard: "Standard (uniform grid)",
    cardLimit: "Maximum cards on home",
    cardLimitHelp: "0 = show all online posts.",
    showFilters: "Show category filter chips",
    showFiltersHelp: "Source filters from your categories. Empty when no posts are categorized."
  },
  single: {
    description: "Single-project layout. Hero + meta + body + next-project teaser.",
    showHero: "Show full-bleed hero image",
    showNextProject: "Show next-project teaser at the bottom",
    defaultServicesLabel: "Services label",
    defaultYearLabel: "Year label",
    defaultAwardsLabel: "Awards label"
  },
  author: {
    description: "Author / studio page composition.",
    showExperience: "Show Select Experience list",
    showRecognition: "Show Recognition list"
  },
  footer: {
    description: "Footer composition.",
    copyright: "Copyright line",
    copyrightHelp: "Empty falls back to '© <year> <site title>. All rights reserved.'"
  },
  logo: {
    description: "Header wordmark. Defaults to your site title in uppercase. Upload a logo image to replace the text.",
    wordmark: "Wordmark text",
    wordmarkHelp: "Empty falls back to your site title in uppercase.",
    upload: "Upload logo",
    replace: "Replace logo",
    remove: "Remove logo"
  }
}, be = {
  title: "Theme settings",
  settings: Si,
  publicBaked: vi,
  blocks: ki
}, Ci = {
  work: "PROJETS",
  about: "À PROPOS",
  journal: "JOURNAL",
  contact: "CONTACT",
  process: "MÉTHODE",
  menu: "Menu",
  primaryNavMobile: "Navigation principale",
  all: "TOUS",
  servicesLabel: "SERVICES",
  yearLabel: "ANNÉE",
  awardsLabel: "RÉCOMPENSES",
  nextProject: "PROJET SUIVANT",
  viewCaseStudy: "VOIR L'ÉTUDE DE CAS",
  selectExperience: "Expérience choisie",
  recognition: "Distinctions",
  loadMore: "VOIR PLUS",
  rightsReserved: "TOUS DROITS RÉSERVÉS."
}, Ei = {
  projectMeta: { title: "Métadonnées du projet", untitled: "Sans titre" },
  storytelling: { title: "Section narrative", untitled: "(pas de titre)" },
  bentoGallery: { title: "Galerie bento", imagesFilled: "images remplies" },
  nextProject: { title: "Annonce projet suivant", untitled: "(pas de titre)" }
}, Ni = {
  description: "Thème portfolio strong-minimalism. Toile éditoriale pour designers, photographes et artistes — charbon sur blanc chaud, angles vifs, zéro ombre.",
  tabs: {
    home: "Accueil",
    single: "Page projet",
    author: "Archive auteur",
    footer: "Pied de page",
    logo: "Logo & branding",
    style: "Style"
  },
  buttons: {
    save: "Enregistrer et appliquer",
    saving: "Enregistrement…",
    reset: "Réinitialiser",
    resetting: "Réinitialisation…",
    saved: "Enregistré"
  },
  vars: {
    background: "Arrière-plan",
    surface: "Surface",
    surfaceLowest: "Surface — la plus basse",
    surfaceLow: "Surface — basse",
    surfaceMid: "Surface — moyenne",
    onSurface: "Texte",
    onSurfaceVariant: "Texte variante",
    outline: "Contour",
    outlineVariant: "Contour variante",
    primary: "Primaire (charbon)",
    onPrimary: "Sur primaire",
    secondary: "Secondaire (gris)",
    accent: "Accent (rose)"
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Texte",
    outlines: "Contours",
    accent: "Accent"
  },
  font: {
    serif: "Police des titres",
    sans: "Police du corps"
  },
  home: {
    description: "Section d'introduction + grille de projets. Trois variantes disponibles.",
    heroHeadline: "Titre d'accueil",
    heroIntro: "Paragraphe d'introduction",
    variant: "Disposition de la grille",
    variantStaggered: "Décalée (rythme alterné)",
    variantMasonry: "Masonry (asymétrique)",
    variantStandard: "Standard (grille uniforme)",
    cardLimit: "Nombre maximum de cartes",
    cardLimitHelp: "0 = afficher tous les projets publiés.",
    showFilters: "Afficher les filtres par catégorie",
    showFiltersHelp: "Les filtres sont générés depuis vos catégories. Vide tant qu'aucun projet n'est catégorisé."
  },
  single: {
    description: "Page projet — hero + métadonnées + corps + annonce du suivant.",
    showHero: "Afficher l'image hero en pleine largeur",
    showNextProject: "Afficher l'annonce du projet suivant en bas",
    defaultServicesLabel: "Libellé Services",
    defaultYearLabel: "Libellé Année",
    defaultAwardsLabel: "Libellé Récompenses"
  },
  author: {
    description: "Composition de la page auteur / studio.",
    showExperience: "Afficher la liste Expérience choisie",
    showRecognition: "Afficher la liste Distinctions"
  },
  footer: {
    description: "Composition du pied de page.",
    copyright: "Ligne de copyright",
    copyrightHelp: "Vide retombe sur '© <année> <titre du site>. Tous droits réservés.'"
  },
  logo: {
    description: "Wordmark du header. Par défaut le titre du site en majuscules. Téléversez un logo pour remplacer le texte.",
    wordmark: "Texte du wordmark",
    wordmarkHelp: "Vide retombe sur le titre du site en majuscules.",
    upload: "Téléverser un logo",
    replace: "Remplacer le logo",
    remove: "Supprimer le logo"
  }
}, Ai = {
  title: "Réglages du thème",
  settings: Ni,
  publicBaked: Ci,
  blocks: Ei
}, Ti = be, Ii = be, Mi = be, Oi = be, Ri = be;
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zi = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Vn = (...r) => r.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Li = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pi = Lt(
  ({
    color: r = "currentColor",
    size: e = 24,
    strokeWidth: t = 2,
    absoluteStrokeWidth: n,
    className: i = "",
    children: o,
    iconNode: s,
    ...a
  }, l) => Qe(
    "svg",
    {
      ref: l,
      ...Li,
      width: e,
      height: e,
      stroke: r,
      strokeWidth: n ? Number(t) * 24 / Number(e) : t,
      className: Vn("lucide", i),
      ...a
    },
    [
      ...s.map(([c, d]) => Qe(c, d)),
      ...Array.isArray(o) ? o : [o]
    ]
  )
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y = (r, e) => {
  const t = Lt(
    ({ className: n, ...i }, o) => Qe(Pi, {
      ref: o,
      iconNode: e,
      className: Vn(`lucide-${zi(r)}`, n),
      ...i
    })
  );
  return t.displayName = `${r}`, t;
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hn = Y("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jn = Y("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _n = Y("LayoutGrid", [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ze = Y("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wn = Y("Quote", [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ln = Y("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bi = Y("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ji = Y("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fi = Y("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]), He = "portfolio", cn = 480, dn = 144, Di = "contain", un = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
function $i({
  config: r,
  save: e
}) {
  const { t } = H("theme-portfolio"), [n, i] = F("home");
  return /* @__PURE__ */ y("div", { className: "space-y-6", children: [
    /* @__PURE__ */ u("p", { className: "text-sm text-surface-600 dark:text-surface-300", children: t("settings.description") }),
    /* @__PURE__ */ y(
      "nav",
      {
        className: "flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800",
        "aria-label": t("title"),
        children: [
          /* @__PURE__ */ u(de, { active: n === "home", onClick: () => i("home"), label: t("settings.tabs.home") }),
          /* @__PURE__ */ u(de, { active: n === "single", onClick: () => i("single"), label: t("settings.tabs.single") }),
          /* @__PURE__ */ u(de, { active: n === "author", onClick: () => i("author"), label: t("settings.tabs.author") }),
          /* @__PURE__ */ u(de, { active: n === "footer", onClick: () => i("footer"), label: t("settings.tabs.footer") }),
          /* @__PURE__ */ u(de, { active: n === "logo", onClick: () => i("logo"), label: t("settings.tabs.logo") }),
          /* @__PURE__ */ u(de, { active: n === "style", onClick: () => i("style"), label: t("settings.tabs.style") })
        ]
      }
    ),
    n === "home" && /* @__PURE__ */ u(Hi, { config: r, save: e }),
    n === "single" && /* @__PURE__ */ u(Ji, { config: r, save: e }),
    n === "author" && /* @__PURE__ */ u(_i, { config: r, save: e }),
    n === "footer" && /* @__PURE__ */ u(Wi, { config: r, save: e }),
    n === "logo" && /* @__PURE__ */ u(Gi, { config: r, save: e }),
    n === "style" && /* @__PURE__ */ u(qi, { config: r, save: e })
  ] });
}
function de({ active: r, onClick: e, label: t }) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      onClick: e,
      className: r ? "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-blue-600 text-surface-900 dark:text-surface-50" : "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
      children: t
    }
  );
}
function X({ title: r, children: e }) {
  return /* @__PURE__ */ y("section", { className: "card p-4 space-y-3", children: [
    /* @__PURE__ */ u("h3", { className: "font-semibold", children: r }),
    e
  ] });
}
function fe({ label: r, value: e, onChange: t, help: n, placeholder: i }) {
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ u("label", { className: "label", children: r }),
    /* @__PURE__ */ u(
      "input",
      {
        type: "text",
        className: "input",
        value: e,
        onChange: (o) => t(o.target.value),
        placeholder: i
      }
    ),
    n && /* @__PURE__ */ u("p", { className: "text-xs text-surface-500 mt-1", children: n })
  ] });
}
function Ui({ label: r, value: e, onChange: t, help: n, rows: i = 3 }) {
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ u("label", { className: "label", children: r }),
    /* @__PURE__ */ u(
      "textarea",
      {
        className: "input",
        rows: i,
        value: e,
        onChange: (o) => t(o.target.value)
      }
    ),
    n && /* @__PURE__ */ u("p", { className: "text-xs text-surface-500 mt-1", children: n })
  ] });
}
function Vi({ label: r, value: e, onChange: t, help: n, min: i = 0 }) {
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ u("label", { className: "label", children: r }),
    /* @__PURE__ */ u(
      "input",
      {
        type: "number",
        className: "input",
        min: i,
        value: e,
        onChange: (o) => t(parseInt(o.target.value, 10) || 0)
      }
    ),
    n && /* @__PURE__ */ u("p", { className: "text-xs text-surface-500 mt-1", children: n })
  ] });
}
function ze({ label: r, value: e, onChange: t, help: n }) {
  return /* @__PURE__ */ y("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ u(
      "input",
      {
        type: "checkbox",
        checked: e,
        onChange: (i) => t(i.target.checked),
        className: "mt-1"
      }
    ),
    /* @__PURE__ */ y("div", { className: "flex-1", children: [
      /* @__PURE__ */ u("label", { className: "block text-sm", children: r }),
      n && /* @__PURE__ */ u("p", { className: "text-xs text-surface-500", children: n })
    ] })
  ] });
}
function we({ onSave: r, saving: e }) {
  const { t } = H("theme-portfolio");
  return /* @__PURE__ */ u("div", { className: "flex justify-end gap-2 pt-3 border-t border-surface-200 dark:border-surface-800", children: /* @__PURE__ */ y(
    "button",
    {
      type: "button",
      onClick: r,
      disabled: e,
      className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50",
      children: [
        /* @__PURE__ */ u(Ze, { className: e ? "h-4 w-4 animate-spin" : "hidden" }),
        /* @__PURE__ */ u(Bi, { className: e ? "hidden" : "h-4 w-4" }),
        /* @__PURE__ */ u("span", { children: t(e ? "settings.buttons.saving" : "settings.buttons.save") })
      ]
    }
  ) });
}
function Hi({ config: r, save: e }) {
  const { t } = H("theme-portfolio"), [n, i] = F({ ...ct, ...r.home }), [o, s] = F(!1);
  async function a() {
    s(!0);
    try {
      await e({ ...r, home: n }), R.success(t("settings.buttons.saved"));
    } catch (l) {
      R.error(l.message);
    } finally {
      s(!1);
    }
  }
  return /* @__PURE__ */ y("div", { className: "space-y-4", children: [
    /* @__PURE__ */ y(X, { title: t("settings.home.description"), children: [
      /* @__PURE__ */ u(
        fe,
        {
          label: t("settings.home.heroHeadline"),
          value: n.heroHeadline,
          onChange: (l) => i({ ...n, heroHeadline: l })
        }
      ),
      /* @__PURE__ */ u(
        Ui,
        {
          label: t("settings.home.heroIntro"),
          value: n.heroIntro,
          onChange: (l) => i({ ...n, heroIntro: l }),
          rows: 4
        }
      ),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: t("settings.home.variant") }),
        /* @__PURE__ */ y(
          "select",
          {
            className: "input",
            value: n.variant,
            onChange: (l) => i({ ...n, variant: l.target.value }),
            children: [
              /* @__PURE__ */ u("option", { value: "staggered", children: t("settings.home.variantStaggered") }),
              /* @__PURE__ */ u("option", { value: "masonry", children: t("settings.home.variantMasonry") }),
              /* @__PURE__ */ u("option", { value: "standard", children: t("settings.home.variantStandard") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u(
        Vi,
        {
          label: t("settings.home.cardLimit"),
          value: n.cardLimit,
          onChange: (l) => i({ ...n, cardLimit: l }),
          help: t("settings.home.cardLimitHelp")
        }
      ),
      /* @__PURE__ */ u(
        ze,
        {
          label: t("settings.home.showFilters"),
          value: n.showFilters,
          onChange: (l) => i({ ...n, showFilters: l }),
          help: t("settings.home.showFiltersHelp")
        }
      )
    ] }),
    /* @__PURE__ */ u(we, { onSave: a, saving: o })
  ] });
}
function Ji({ config: r, save: e }) {
  const { t } = H("theme-portfolio"), [n, i] = F({ ...Bt, ...r.single }), [o, s] = F(!1);
  async function a() {
    s(!0);
    try {
      await e({ ...r, single: n }), R.success(t("settings.buttons.saved"));
    } catch (l) {
      R.error(l.message);
    } finally {
      s(!1);
    }
  }
  return /* @__PURE__ */ y("div", { className: "space-y-4", children: [
    /* @__PURE__ */ y(X, { title: t("settings.single.description"), children: [
      /* @__PURE__ */ u(
        ze,
        {
          label: t("settings.single.showHero"),
          value: n.showHero,
          onChange: (l) => i({ ...n, showHero: l })
        }
      ),
      /* @__PURE__ */ u(
        ze,
        {
          label: t("settings.single.showNextProject"),
          value: n.showNextProject,
          onChange: (l) => i({ ...n, showNextProject: l })
        }
      ),
      /* @__PURE__ */ y("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ u(
          fe,
          {
            label: t("settings.single.defaultServicesLabel"),
            value: n.defaultServicesLabel,
            onChange: (l) => i({ ...n, defaultServicesLabel: l })
          }
        ),
        /* @__PURE__ */ u(
          fe,
          {
            label: t("settings.single.defaultYearLabel"),
            value: n.defaultYearLabel,
            onChange: (l) => i({ ...n, defaultYearLabel: l })
          }
        ),
        /* @__PURE__ */ u(
          fe,
          {
            label: t("settings.single.defaultAwardsLabel"),
            value: n.defaultAwardsLabel,
            onChange: (l) => i({ ...n, defaultAwardsLabel: l })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u(we, { onSave: a, saving: o })
  ] });
}
function _i({ config: r, save: e }) {
  const { t } = H("theme-portfolio"), [n, i] = F({ ...jt, ...r.author }), [o, s] = F(!1);
  async function a() {
    s(!0);
    try {
      await e({ ...r, author: n }), R.success(t("settings.buttons.saved"));
    } catch (l) {
      R.error(l.message);
    } finally {
      s(!1);
    }
  }
  return /* @__PURE__ */ y("div", { className: "space-y-4", children: [
    /* @__PURE__ */ y(X, { title: t("settings.author.description"), children: [
      /* @__PURE__ */ u(
        ze,
        {
          label: t("settings.author.showExperience"),
          value: n.showExperience,
          onChange: (l) => i({ ...n, showExperience: l })
        }
      ),
      /* @__PURE__ */ u(
        ze,
        {
          label: t("settings.author.showRecognition"),
          value: n.showRecognition,
          onChange: (l) => i({ ...n, showRecognition: l })
        }
      )
    ] }),
    /* @__PURE__ */ u(we, { onSave: a, saving: o })
  ] });
}
function Wi({ config: r, save: e }) {
  const { t } = H("theme-portfolio"), [n, i] = F({ ...$n, ...r.footer }), [o, s] = F(!1);
  async function a() {
    s(!0);
    try {
      await e({ ...r, footer: n }), R.success(t("settings.buttons.saved"));
    } catch (l) {
      R.error(l.message);
    } finally {
      s(!1);
    }
  }
  return /* @__PURE__ */ y("div", { className: "space-y-4", children: [
    /* @__PURE__ */ u(X, { title: t("settings.footer.description"), children: /* @__PURE__ */ u(
      fe,
      {
        label: t("settings.footer.copyright"),
        value: n.copyright,
        onChange: (l) => i({ ...n, copyright: l }),
        help: t("settings.footer.copyrightHelp")
      }
    ) }),
    /* @__PURE__ */ u(we, { onSave: a, saving: o })
  ] });
}
function Gi({ config: r, save: e }) {
  const { t } = H("theme-portfolio"), { settings: n, terms: i } = qr(), [o, s] = F({ ...Un, ...r.brand }), [a, l] = F(!1), [c, d] = F(!1), [f, h] = F(!1), p = Zr(null), g = o.logoEnabled && n.baseUrl ? `${n.baseUrl.replace(/\/+$/, "")}/${Kr(He)}?v=${o.logoUpdatedAt}` : "";
  async function m(k) {
    const E = {
      ...n,
      themeConfigs: {
        ...n.themeConfigs,
        [He]: { ...r, brand: k }
      }
    };
    try {
      const [I, M] = await Promise.all([
        tn({ type: "post" }),
        tn({ type: "page" })
      ]);
      await Qr(E, I, M, i);
    } catch (I) {
      console.error("[theme-portfolio] menu.json refresh failed:", I);
    }
  }
  async function b() {
    l(!0);
    try {
      await e({ ...r, brand: o }), R.success(t("settings.buttons.saved"));
    } catch (k) {
      R.error(k.message);
    } finally {
      l(!1);
    }
  }
  async function x(k) {
    if (!un.includes(k.type)) {
      R.error("Unsupported file type. Use JPG, PNG, WebP, or SVG.");
      return;
    }
    d(!0);
    try {
      await Yr({
        themeId: He,
        file: k,
        width: cn,
        height: dn,
        fit: Di
      });
      const E = {
        ...o,
        logoEnabled: !0,
        logoUpdatedAt: Date.now()
      };
      s(E), await e({ ...r, brand: E }), await m(E), R.success("Logo uploaded.");
    } catch (E) {
      console.error("[theme-portfolio] logo upload failed:", E), R.error("Logo upload failed.");
    } finally {
      d(!1), p.current && (p.current.value = "");
    }
  }
  async function A() {
    h(!0);
    try {
      await Xr(He);
      const k = {
        ...o,
        logoEnabled: !1,
        logoUpdatedAt: 0
      };
      s(k), await e({ ...r, brand: k }), await m(k), R.success("Logo removed.");
    } catch (k) {
      console.error("[theme-portfolio] logo remove failed:", k), R.error("Logo remove failed.");
    } finally {
      h(!1);
    }
  }
  return /* @__PURE__ */ y("div", { className: "space-y-4", children: [
    /* @__PURE__ */ u(X, { title: t("settings.logo.description"), children: /* @__PURE__ */ u(
      fe,
      {
        label: t("settings.logo.wordmark"),
        value: o.wordmark,
        onChange: (k) => s({ ...o, wordmark: k }),
        help: t("settings.logo.wordmarkHelp"),
        placeholder: "ARCHIVE"
      }
    ) }),
    /* @__PURE__ */ y(X, { title: "Logo image (optional)", children: [
      /* @__PURE__ */ y("p", { className: "text-xs text-surface-500", children: [
        "Recommended ",
        cn,
        "×",
        dn,
        ", transparent PNG / WebP / SVG. When set, the wordmark text is replaced by the image in the header."
      ] }),
      /* @__PURE__ */ y("div", { className: "flex items-center gap-4", children: [
        g ? /* @__PURE__ */ u(
          "img",
          {
            src: g,
            alt: "",
            className: "h-20 w-auto max-w-[240px] bg-white p-2 ring-1 ring-surface-200 object-contain dark:ring-surface-700"
          }
        ) : /* @__PURE__ */ u("div", { className: "h-20 w-40 bg-surface-100 flex items-center justify-center text-surface-400 text-xs dark:bg-surface-800", children: "No logo" }),
        /* @__PURE__ */ y("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ u(
            "input",
            {
              ref: p,
              type: "file",
              accept: un.join(","),
              className: "hidden",
              onChange: (k) => {
                var I;
                const E = (I = k.target.files) == null ? void 0 : I[0];
                E && x(E);
              }
            }
          ),
          /* @__PURE__ */ y(
            "button",
            {
              type: "button",
              className: "btn-secondary",
              onClick: () => {
                var k;
                return (k = p.current) == null ? void 0 : k.click();
              },
              disabled: c || f,
              children: [
                /* @__PURE__ */ u(Ze, { className: c ? "h-4 w-4 animate-spin" : "hidden" }),
                /* @__PURE__ */ u(Fi, { className: c ? "hidden" : "h-4 w-4" }),
                /* @__PURE__ */ u("span", { children: o.logoEnabled ? t("settings.logo.replace") : t("settings.logo.upload") })
              ]
            }
          ),
          o.logoEnabled && /* @__PURE__ */ y(
            "button",
            {
              type: "button",
              className: "btn-ghost text-red-600 hover:bg-red-50",
              onClick: A,
              disabled: c || f,
              children: [
                /* @__PURE__ */ u(Ze, { className: f ? "h-4 w-4 animate-spin" : "hidden" }),
                /* @__PURE__ */ u(ji, { className: f ? "hidden" : "h-4 w-4" }),
                /* @__PURE__ */ u("span", { children: t("settings.logo.remove") })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u(we, { onSave: b, saving: a })
  ] });
}
function qi({ config: r, save: e }) {
  const { t } = H("theme-portfolio"), [n, i] = F({ ...ve, ...r.style }), [o, s] = F(!1);
  async function a() {
    s(!0);
    try {
      await e({ ...r, style: n }), await sn({
        baseCssText: Bn.cssText ?? "",
        style: n
      }), R.success(t("settings.buttons.saved"));
    } catch (h) {
      R.error(h.message);
    } finally {
      s(!1);
    }
  }
  async function l() {
    s(!0);
    try {
      i(ve), await e({ ...r, style: ve }), await sn({
        baseCssText: Bn.cssText ?? "",
        style: ve
      }), R.success(t("settings.buttons.saved"));
    } catch (h) {
      R.error(h.message);
    } finally {
      s(!1);
    }
  }
  function c(h, p) {
    i({ ...n, vars: { ...n.vars, [h]: p } });
  }
  function d(h) {
    const p = { ...n.vars };
    delete p[h], i({ ...n, vars: p });
  }
  const f = [
    ...Object.keys(me.serif).map((h) => ({ name: h, fallback: "serif" })),
    ...Object.keys(me.sans).map((h) => ({ name: h, fallback: "sans-serif" }))
  ];
  return /* @__PURE__ */ y("div", { className: "space-y-4", children: [
    /* @__PURE__ */ y(X, { title: t("settings.tabs.style"), children: [
      /* @__PURE__ */ u("link", { rel: "stylesheet", href: di() }),
      /* @__PURE__ */ y("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ y("div", { children: [
          /* @__PURE__ */ u("label", { className: "label", children: t("settings.font.serif") }),
          /* @__PURE__ */ u(
            en,
            {
              options: f,
              value: n.fontSerif || Oe,
              onChange: (h) => i({ ...n, fontSerif: h })
            }
          )
        ] }),
        /* @__PURE__ */ y("div", { children: [
          /* @__PURE__ */ u("label", { className: "label", children: t("settings.font.sans") }),
          /* @__PURE__ */ u(
            en,
            {
              options: f,
              value: n.fontSans || Re,
              onChange: (h) => i({ ...n, fontSans: h })
            }
          )
        ] })
      ] })
    ] }),
    li.map((h) => /* @__PURE__ */ u(X, { title: t(`settings.groups.${h}`), children: /* @__PURE__ */ u("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: Fn.filter((p) => p.group === h).map((p) => {
      const g = n.vars[p.name] ?? p.defaultValue, m = n.vars[p.name] !== void 0;
      return /* @__PURE__ */ y("div", { className: "flex items-end gap-2", children: [
        /* @__PURE__ */ y("div", { className: "flex-1", children: [
          /* @__PURE__ */ u("label", { className: "label", children: t(`settings.${p.labelKey}`) }),
          p.type === "color" ? /* @__PURE__ */ u(
            "input",
            {
              type: "color",
              value: /^#/.test(g) ? g : p.defaultValue,
              onChange: (b) => c(p.name, b.target.value),
              className: "input h-10 p-1"
            }
          ) : /* @__PURE__ */ u(
            "input",
            {
              type: "text",
              value: g,
              onChange: (b) => c(p.name, b.target.value),
              className: "input"
            }
          )
        ] }),
        m && /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            onClick: () => d(p.name),
            className: "p-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-100",
            title: t("settings.buttons.reset"),
            children: /* @__PURE__ */ u(ln, { className: "h-4 w-4" })
          }
        )
      ] }, p.name);
    }) }) }, h)),
    /* @__PURE__ */ y("div", { className: "flex justify-end gap-2 pt-3 border-t border-surface-200 dark:border-surface-800", children: [
      /* @__PURE__ */ y(
        "button",
        {
          type: "button",
          onClick: l,
          disabled: o,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-200 dark:bg-surface-800 text-sm font-medium hover:bg-surface-300 dark:hover:bg-surface-700 disabled:opacity-50",
          children: [
            /* @__PURE__ */ u(Ze, { className: o ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ u(ln, { className: o ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ u("span", { children: t(o ? "settings.buttons.resetting" : "settings.buttons.reset") })
          ]
        }
      ),
      /* @__PURE__ */ u(we, { onSave: a, saving: o })
    ] })
  ] });
}
const Ki = "portfolio";
function Yi(r) {
  if (r == null) return "";
  try {
    const e = JSON.stringify(r);
    return typeof window > "u" ? Buffer.from(e, "utf-8").toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  } catch {
    return "";
  }
}
function Ve(r, e) {
  if (!r || typeof r != "string") return e;
  try {
    let t;
    return typeof window > "u" ? t = Buffer.from(r, "base64").toString("utf-8") : t = decodeURIComponent(escape(window.atob(r))), JSON.parse(t);
  } catch {
    return e;
  }
}
function Gn(r) {
  return `portfolio${r.charAt(0).toUpperCase()}${r.slice(1)}`;
}
function ge(r) {
  return typeof r != "string" ? "" : r.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function G(r) {
  return typeof r != "string" ? "" : r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const dt = {
  rows: [
    { label: "SERVICES", value: `Creative Direction
Art Direction` },
    { label: "YEAR", value: "2024" },
    { label: "AWARDS", value: "Gold Design Circle" }
  ]
};
function Xi(r) {
  const e = (r.rows ?? []).filter((n) => n.label || n.value);
  if (e.length === 0) return { html: "" };
  const t = e.map((n) => {
    const i = n.value.split(/\r?\n/).map((o) => o.trim()).filter(Boolean).map((o) => G(o)).join("<br/>");
    return `<div class="flex flex-col gap-2"><span class="font-sans text-label-sm uppercase tracking-widest text-secondary">${G(n.label)}</span><p class="font-sans text-body-md text-on-surface">${i}</p></div>`;
  }).join("");
  return {
    html: `<aside class="portfolio-project-meta max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap grid grid-cols-1 md:grid-cols-${Math.min(e.length, 4)} gap-gutter" data-attrs="${ge("")}">${t}</aside>`
  };
}
const Qi = /<div\s+([^>]*data-cms-block="portfolio\/project-meta"[^>]*)>\s*<\/div>/g;
function Zi(r) {
  return r.replace(Qi, (e, t) => {
    const n = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = n ? n[1] ?? n[2] ?? n[3] ?? "" : "", o = Ve(i, dt);
    return Xi(o).html || e;
  });
}
const ut = {
  eyebrow: "THE PROCESS",
  headline: "Silence is the ultimate luxury.",
  body: "In a world of constant visual noise, we chose to embrace the void. Our curation process for the exhibition involved removing over 80% of the initial content to find the singular heart of the project.",
  step1Label: "01. RESEARCH",
  step1Text: "Deep architectural auditing and site mapping.",
  step2Label: "02. EXECUTION",
  step2Text: "High-precision photographic capture over 6 months.",
  imageUrl: "",
  imageAlt: ""
};
function eo(r) {
  if (!!!(r.headline || r.body) && !r.imageUrl) return { html: "" };
  const t = r.eyebrow ? `<span class="font-sans text-label-sm uppercase tracking-widest text-error mb-4 block">${G(r.eyebrow)}</span>` : "", n = r.headline ? `<h3 class="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 italic">${G(r.headline)}</h3>` : "", i = r.body ? `<p class="font-sans text-body-lg text-on-surface mb-8">${G(r.body)}</p>` : "", o = (c, d) => c || d ? `<div class="border-t border-outline-variant pt-4"><span class="font-sans text-label-sm uppercase tracking-widest text-on-surface block mb-1">${G(c)}</span><p class="font-sans text-body-md text-on-surface-variant">${G(d)}</p></div>` : "", s = r.step1Label || r.step1Text || r.step2Label || r.step2Text ? `<div class="grid grid-cols-2 gap-4">${o(r.step1Label, r.step1Text)}${o(r.step2Label, r.step2Text)}</div>` : "", a = r.imageUrl ? `<div class="col-span-12 md:col-span-6"><img src="${ge(r.imageUrl)}" alt="${ge(r.imageAlt)}" class="w-full aspect-[4/5] object-cover" loading="lazy"/></div>` : "";
  return {
    html: `<section class="portfolio-storytelling max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap grid grid-cols-12 gap-gutter items-center">${`<div class="col-span-12 md:col-span-6 pr-0 md:pr-16">${t}${n}${i}${s}</div>`}${a}</section>`
  };
}
const to = /<div\s+([^>]*data-cms-block="portfolio\/storytelling"[^>]*)>\s*<\/div>/g;
function no(r) {
  return r.replace(to, (e, t) => {
    const n = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = n ? n[1] ?? n[2] ?? n[3] ?? "" : "", o = Ve(i, ut);
    return eo(o).html || e;
  });
}
const ft = {
  mainImageUrl: "",
  mainImageAlt: "",
  subTopImageUrl: "",
  subTopImageAlt: "",
  subTopGrayscale: !0,
  subBottomImageUrl: "",
  subBottomImageAlt: "",
  wideImageUrl: "",
  wideImageAlt: ""
};
function Je(r, e, t, n = !1) {
  return r ? `<img src="${ge(r)}" alt="${ge(e)}" class="${t}${n ? " grayscale" : ""}" loading="lazy"/>` : `<div class="${t} bg-surface-container"></div>`;
}
function ro(r) {
  if (!(r.mainImageUrl || r.subTopImageUrl || r.subBottomImageUrl || r.wideImageUrl)) return { html: "" };
  const t = `<div class="md:col-span-8 h-[600px]">${Je(r.mainImageUrl, r.mainImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]")}</div>`, n = `<div class="md:col-span-4 h-[600px] flex flex-col gap-8"><div class="h-1/2">${Je(r.subTopImageUrl, r.subTopImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]", r.subTopGrayscale)}</div><div class="h-1/2">${Je(r.subBottomImageUrl, r.subBottomImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]")}</div></div>`, i = r.wideImageUrl ? `<div class="md:col-span-12 h-[600px] md:h-[800px]">${Je(r.wideImageUrl, r.wideImageAlt, "w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]")}</div>` : "";
  return {
    html: `<section class="portfolio-bento px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap bg-surface-container-lowest"><div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">${t}${n}${i}</div></section>`
  };
}
const io = /<div\s+([^>]*data-cms-block="portfolio\/bento-gallery"[^>]*)>\s*<\/div>/g;
function oo(r) {
  return r.replace(io, (e, t) => {
    const n = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = n ? n[1] ?? n[2] ?? n[3] ?? "" : "", o = Ve(i, ft);
    return ro(o).html || e;
  });
}
const ht = {
  eyebrow: "NEXT PROJECT",
  title: "",
  href: "",
  ctaLabel: "VIEW CASE STUDY"
};
function so(r) {
  if (!r.title) return { html: "" };
  const e = r.href || "#";
  return {
    html: `<section class="portfolio-next-project border-t border-primary mt-section-gap-mobile md:mt-section-gap"><a class="group flex flex-col md:flex-row justify-between items-start md:items-center w-full px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap max-w-container-max mx-auto hover:bg-primary transition-colors duration-500 overflow-hidden relative" href="${ge(e)}"><div class="z-10 flex flex-col gap-2"><span class="font-sans text-label-sm uppercase tracking-[0.3em] text-secondary group-hover:text-on-primary/60 transition-colors">${G(r.eyebrow)}</span><h2 class="font-serif text-display-lg-mobile md:text-display-lg group-hover:text-on-primary transition-colors display-serif">${G(r.title)}</h2></div><div class="z-10 mt-8 md:mt-0 flex items-center gap-4 text-primary group-hover:text-on-primary transition-colors"><span class="font-sans text-label-sm uppercase tracking-widest">${G(r.ctaLabel)}</span><span class="material-symbols-outlined">arrow_forward</span></div></a></section>`
  };
}
const ao = /<div\s+([^>]*data-cms-block="portfolio\/next-project"[^>]*)>\s*<\/div>/g;
function lo(r) {
  return r.replace(ao, (e, t) => {
    const n = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = n ? n[1] ?? n[2] ?? n[3] ?? "" : "", o = Ve(i, ht);
    return so(o).html || e;
  });
}
function co(r) {
  let e = r;
  return e = Zi(e), e = no(e), e = oo(e), e = lo(e), e;
}
function z(r) {
  this.content = r;
}
z.prototype = {
  constructor: z,
  find: function(r) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === r) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(r) {
    var e = this.find(r);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(r, e, t) {
    var n = t && t != r ? this.remove(t) : this, i = n.find(r), o = n.content.slice();
    return i == -1 ? o.push(t || r, e) : (o[i + 1] = e, t && (o[i] = t)), new z(o);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(r) {
    var e = this.find(r);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new z(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(r, e) {
    return new z([r, e].concat(this.remove(r).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(r, e) {
    var t = this.remove(r).content.slice();
    return t.push(r, e), new z(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(r, e, t) {
    var n = this.remove(e), i = n.content.slice(), o = n.find(r);
    return i.splice(o == -1 ? i.length : o, 0, e, t), new z(i);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(r) {
    for (var e = 0; e < this.content.length; e += 2)
      r(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(r) {
    return r = z.from(r), r.size ? new z(r.content.concat(this.subtract(r).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(r) {
    return r = z.from(r), r.size ? new z(this.subtract(r).content.concat(r.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(r) {
    var e = this;
    r = z.from(r);
    for (var t = 0; t < r.content.length; t += 2)
      e = e.remove(r.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var r = {};
    return this.forEach(function(e, t) {
      r[e] = t;
    }), r;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
z.from = function(r) {
  if (r instanceof z) return r;
  var e = [];
  if (r) for (var t in r) e.push(t, r[t]);
  return new z(e);
};
function qn(r, e, t) {
  for (let n = 0; ; n++) {
    if (n == r.childCount || n == e.childCount)
      return r.childCount == e.childCount ? null : t;
    let i = r.child(n), o = e.child(n);
    if (i == o) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(o))
      return t;
    if (i.isText && i.text != o.text) {
      for (let s = 0; i.text[s] == o.text[s]; s++)
        t++;
      return t;
    }
    if (i.content.size || o.content.size) {
      let s = qn(i.content, o.content, t + 1);
      if (s != null)
        return s;
    }
    t += i.nodeSize;
  }
}
function Kn(r, e, t, n) {
  for (let i = r.childCount, o = e.childCount; ; ) {
    if (i == 0 || o == 0)
      return i == o ? null : { a: t, b: n };
    let s = r.child(--i), a = e.child(--o), l = s.nodeSize;
    if (s == a) {
      t -= l, n -= l;
      continue;
    }
    if (!s.sameMarkup(a))
      return { a: t, b: n };
    if (s.isText && s.text != a.text) {
      let c = 0, d = Math.min(s.text.length, a.text.length);
      for (; c < d && s.text[s.text.length - c - 1] == a.text[a.text.length - c - 1]; )
        c++, t--, n--;
      return { a: t, b: n };
    }
    if (s.content.size || a.content.size) {
      let c = Kn(s.content, a.content, t - 1, n - 1);
      if (c)
        return c;
    }
    t -= l, n -= l;
  }
}
class w {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let n = 0; n < e.length; n++)
        this.size += e[n].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, n, i = 0, o) {
    for (let s = 0, a = 0; a < t; s++) {
      let l = this.content[s], c = a + l.nodeSize;
      if (c > e && n(l, i + a, o || null, s) !== !1 && l.content.size) {
        let d = a + 1;
        l.nodesBetween(Math.max(0, e - d), Math.min(l.content.size, t - d), n, i + d);
      }
      a = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, n, i) {
    let o = "", s = !0;
    return this.nodesBetween(e, t, (a, l) => {
      let c = a.isText ? a.text.slice(Math.max(e, l) - l, t - l) : a.isLeaf ? i ? typeof i == "function" ? i(a) : i : a.type.spec.leafText ? a.type.spec.leafText(a) : "" : "";
      a.isBlock && (a.isLeaf && c || a.isTextblock) && n && (s ? s = !1 : o += n), o += c;
    }, 0), o;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, n = e.firstChild, i = this.content.slice(), o = 0;
    for (t.isText && t.sameMarkup(n) && (i[i.length - 1] = t.withText(t.text + n.text), o = 1); o < e.content.length; o++)
      i.push(e.content[o]);
    return new w(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let n = [], i = 0;
    if (t > e)
      for (let o = 0, s = 0; s < t; o++) {
        let a = this.content[o], l = s + a.nodeSize;
        l > e && ((s < e || l > t) && (a.isText ? a = a.cut(Math.max(0, e - s), Math.min(a.text.length, t - s)) : a = a.cut(Math.max(0, e - s - 1), Math.min(a.content.size, t - s - 1))), n.push(a), i += a.nodeSize), s = l;
      }
    return new w(n, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? w.empty : e == 0 && t == this.content.length ? this : new w(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let n = this.content[e];
    if (n == t)
      return this;
    let i = this.content.slice(), o = this.size + t.nodeSize - n.nodeSize;
    return i[e] = t, new w(i, o);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new w([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new w(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, n = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, n, t), n += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return qn(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, n = e.size) {
    return Kn(this, e, t, n);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return _e(0, e);
    if (e == this.size)
      return _e(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, n = 0; ; t++) {
      let i = this.child(t), o = n + i.nodeSize;
      if (o >= e)
        return o == e ? _e(t + 1, o) : _e(t, n);
      n = o;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return w.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new w(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return w.empty;
    let t, n = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      n += o.nodeSize, i && o.isText && e[i - 1].sameMarkup(o) ? (t || (t = e.slice(0, i)), t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)) : t && t.push(o);
    }
    return new w(t || e, n);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return w.empty;
    if (e instanceof w)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new w([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
w.empty = new w([], 0);
const wt = { index: 0, offset: 0 };
function _e(r, e) {
  return wt.index = r, wt.offset = e, wt;
}
function et(r, e) {
  if (r === e)
    return !0;
  if (!(r && typeof r == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(r);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (r.length != e.length)
      return !1;
    for (let n = 0; n < r.length; n++)
      if (!et(r[n], e[n]))
        return !1;
  } else {
    for (let n in r)
      if (!(n in e) || !et(r[n], e[n]))
        return !1;
    for (let n in e)
      if (!(n in r))
        return !1;
  }
  return !0;
}
class N {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, n = !1;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if (this.eq(o))
        return e;
      if (this.type.excludes(o.type))
        t || (t = e.slice(0, i));
      else {
        if (o.type.excludes(this.type))
          return e;
        !n && o.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), n = !0), t && t.push(o);
      }
    }
    return t || (t = e.slice()), n || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && et(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let n = e.marks[t.type];
    if (!n)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = n.create(t.attrs);
    return n.checkAttrs(i.attrs), i;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let n = 0; n < e.length; n++)
      if (!e[n].eq(t[n]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return N.none;
    if (e instanceof N)
      return [e];
    let t = e.slice();
    return t.sort((n, i) => n.type.rank - i.type.rank), t;
  }
}
N.none = [];
class tt extends Error {
}
class v {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, n) {
    this.content = e, this.openStart = t, this.openEnd = n;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let n = Xn(this.content, e + this.openStart, t);
    return n && new v(n, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new v(Yn(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return v.empty;
    let n = t.openStart || 0, i = t.openEnd || 0;
    if (typeof n != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new v(w.fromJSON(e, t.content), n, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let n = 0, i = 0;
    for (let o = e.firstChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.firstChild)
      n++;
    for (let o = e.lastChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.lastChild)
      i++;
    return new v(e, n, i);
  }
}
v.empty = new v(w.empty, 0, 0);
function Yn(r, e, t) {
  let { index: n, offset: i } = r.findIndex(e), o = r.maybeChild(n), { index: s, offset: a } = r.findIndex(t);
  if (i == e || o.isText) {
    if (a != t && !r.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return r.cut(0, e).append(r.cut(t));
  }
  if (n != s)
    throw new RangeError("Removing non-flat range");
  return r.replaceChild(n, o.copy(Yn(o.content, e - i - 1, t - i - 1)));
}
function Xn(r, e, t, n) {
  let { index: i, offset: o } = r.findIndex(e), s = r.maybeChild(i);
  if (o == e || s.isText)
    return n && !n.canReplace(i, i, t) ? null : r.cut(0, e).append(t).append(r.cut(e));
  let a = Xn(s.content, e - o - 1, t, s);
  return a && r.replaceChild(i, s.copy(a));
}
function uo(r, e, t) {
  if (t.openStart > r.depth)
    throw new tt("Inserted content deeper than insertion position");
  if (r.depth - t.openStart != e.depth - t.openEnd)
    throw new tt("Inconsistent open depths");
  return Qn(r, e, t, 0);
}
function Qn(r, e, t, n) {
  let i = r.index(n), o = r.node(n);
  if (i == e.index(n) && n < r.depth - t.openStart) {
    let s = Qn(r, e, t, n + 1);
    return o.copy(o.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && r.depth == n && e.depth == n) {
      let s = r.parent, a = s.content;
      return ie(s, a.cut(0, r.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: s, end: a } = fo(t, r);
      return ie(o, er(r, s, a, e, n));
    }
  else return ie(o, nt(r, e, n));
}
function Zn(r, e) {
  if (!e.type.compatibleContent(r.type))
    throw new tt("Cannot join " + e.type.name + " onto " + r.type.name);
}
function It(r, e, t) {
  let n = r.node(t);
  return Zn(n, e.node(t)), n;
}
function re(r, e) {
  let t = e.length - 1;
  t >= 0 && r.isText && r.sameMarkup(e[t]) ? e[t] = r.withText(e[t].text + r.text) : e.push(r);
}
function Ce(r, e, t, n) {
  let i = (e || r).node(t), o = 0, s = e ? e.index(t) : i.childCount;
  r && (o = r.index(t), r.depth > t ? o++ : r.textOffset && (re(r.nodeAfter, n), o++));
  for (let a = o; a < s; a++)
    re(i.child(a), n);
  e && e.depth == t && e.textOffset && re(e.nodeBefore, n);
}
function ie(r, e) {
  return r.type.checkContent(e), r.copy(e);
}
function er(r, e, t, n, i) {
  let o = r.depth > i && It(r, e, i + 1), s = n.depth > i && It(t, n, i + 1), a = [];
  return Ce(null, r, i, a), o && s && e.index(i) == t.index(i) ? (Zn(o, s), re(ie(o, er(r, e, t, n, i + 1)), a)) : (o && re(ie(o, nt(r, e, i + 1)), a), Ce(e, t, i, a), s && re(ie(s, nt(t, n, i + 1)), a)), Ce(n, null, i, a), new w(a);
}
function nt(r, e, t) {
  let n = [];
  if (Ce(null, r, t, n), r.depth > t) {
    let i = It(r, e, t + 1);
    re(ie(i, nt(r, e, t + 1)), n);
  }
  return Ce(e, null, t, n), new w(n);
}
function fo(r, e) {
  let t = e.depth - r.openStart, i = e.node(t).copy(r.content);
  for (let o = t - 1; o >= 0; o--)
    i = e.node(o).copy(w.from(i));
  return {
    start: i.resolveNoCache(r.openStart + t),
    end: i.resolveNoCache(i.content.size - r.openEnd - t)
  };
}
class Le {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let n = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return n ? e.child(t).cut(n) : i;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let n = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++)
      i += n.child(o).nodeSize;
    return i;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return N.none;
    if (this.textOffset)
      return e.child(t).marks;
    let n = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!n) {
      let a = n;
      n = i, i = a;
    }
    let o = n.marks;
    for (var s = 0; s < o.length; s++)
      o[s].type.spec.inclusive === !1 && (!i || !o[s].isInSet(i.marks)) && (o = o[s--].removeFromSet(o));
    return o;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let n = t.marks, i = e.parent.maybeChild(e.index());
    for (var o = 0; o < n.length; o++)
      n[o].type.spec.inclusive === !1 && (!i || !n[o].isInSet(i.marks)) && (n = n[o--].removeFromSet(n));
    return n;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--)
      if (e.pos <= this.end(n) && (!t || t(this.node(n))))
        return new rt(this, e, n);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let n = [], i = 0, o = t;
    for (let s = e; ; ) {
      let { index: a, offset: l } = s.content.findIndex(o), c = o - l;
      if (n.push(s, a, i + l), !c || (s = s.child(a), s.isText))
        break;
      o = c - 1, i += l + 1;
    }
    return new Le(t, n, o);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let n = fn.get(e);
    if (n)
      for (let o = 0; o < n.elts.length; o++) {
        let s = n.elts[o];
        if (s.pos == t)
          return s;
      }
    else
      fn.set(e, n = new ho());
    let i = n.elts[n.i] = Le.resolve(e, t);
    return n.i = (n.i + 1) % po, i;
  }
}
class ho {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const po = 12, fn = /* @__PURE__ */ new WeakMap();
class rt {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, n) {
    this.$from = e, this.$to = t, this.depth = n;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const mo = /* @__PURE__ */ Object.create(null);
let oe = class Mt {
  /**
  @internal
  */
  constructor(e, t, n, i = N.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = n || w.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, n, i = 0) {
    this.content.nodesBetween(e, t, n, i, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, n, i) {
    return this.content.textBetween(e, t, n, i);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, n) {
    return this.type == e && et(this.attrs, t || e.defaultAttrs || mo) && N.sameSet(this.marks, n || N.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Mt(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Mt(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, n = !1) {
    if (e == t)
      return v.empty;
    let i = this.resolve(e), o = this.resolve(t), s = n ? 0 : i.sharedDepth(t), a = i.start(s), c = i.node(s).content.cut(i.pos - a, o.pos - a);
    return new v(c, i.depth - s, o.depth - s);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, n) {
    return uo(this.resolve(e), this.resolve(t), n);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: n, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(n), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: n } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: n };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: n } = this.content.findIndex(e);
    if (n < e)
      return { node: this.content.child(t), index: t, offset: n };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: n - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return Le.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Le.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, n) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (o) => (n.isInSet(o.marks) && (i = !0), !i)), i;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), tr(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, n = w.empty, i = 0, o = n.childCount) {
    let s = this.contentMatchAt(e).matchFragment(n, i, o), a = s && s.matchFragment(this.content, t);
    if (!a || !a.validEnd)
      return !1;
    for (let l = i; l < o; l++)
      if (!this.type.allowsMarks(n.child(l).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, n, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let o = this.contentMatchAt(e).matchType(n), s = o && o.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = N.none;
    for (let t = 0; t < this.marks.length; t++) {
      let n = this.marks[t];
      n.type.checkAttrs(n.attrs), e = n.addToSet(e);
    }
    if (!N.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let n;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      n = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, n);
    }
    let i = w.fromJSON(e, t.content), o = e.nodeType(t.type).create(t.attrs, i, n);
    return o.type.checkAttrs(o.attrs), o;
  }
};
oe.prototype.text = void 0;
class it extends oe {
  /**
  @internal
  */
  constructor(e, t, n, i) {
    if (super(e, t, null, i), !n)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = n;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : tr(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new it(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new it(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function tr(r, e) {
  for (let t = r.length - 1; t >= 0; t--)
    e = r[t].type.name + "(" + e + ")";
  return e;
}
class se {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let n = new go(e, t);
    if (n.next == null)
      return se.empty;
    let i = nr(n);
    n.next && n.err("Unexpected trailing text");
    let o = So(ko(i));
    return Co(o, n), o;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, n = e.childCount) {
    let i = this;
    for (let o = t; i && o < n; o++)
      i = i.matchType(e.child(o).type);
    return i;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let n = 0; n < e.next.length; n++)
        if (this.next[t].type == e.next[n].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, n = 0) {
    let i = [this];
    function o(s, a) {
      let l = s.matchFragment(e, n);
      if (l && (!t || l.validEnd))
        return w.from(a.map((c) => c.createAndFill()));
      for (let c = 0; c < s.next.length; c++) {
        let { type: d, next: f } = s.next[c];
        if (!(d.isText || d.hasRequiredAttrs()) && i.indexOf(f) == -1) {
          i.push(f);
          let h = o(f, a.concat(d));
          if (h)
            return h;
        }
      }
      return null;
    }
    return o(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let n = 0; n < this.wrapCache.length; n += 2)
      if (this.wrapCache[n] == e)
        return this.wrapCache[n + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), n = [{ match: this, type: null, via: null }];
    for (; n.length; ) {
      let i = n.shift(), o = i.match;
      if (o.matchType(e)) {
        let s = [];
        for (let a = i; a.type; a = a.via)
          s.push(a.type);
        return s.reverse();
      }
      for (let s = 0; s < o.next.length; s++) {
        let { type: a, next: l } = o.next[s];
        !a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!i.type || l.validEnd) && (n.push({ match: a.contentMatch, type: a, via: i }), t[a.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(n) {
      e.push(n);
      for (let i = 0; i < n.next.length; i++)
        e.indexOf(n.next[i].next) == -1 && t(n.next[i].next);
    }
    return t(this), e.map((n, i) => {
      let o = i + (n.validEnd ? "*" : " ") + " ";
      for (let s = 0; s < n.next.length; s++)
        o += (s ? ", " : "") + n.next[s].type.name + "->" + e.indexOf(n.next[s].next);
      return o;
    }).join(`
`);
  }
}
se.empty = new se(!0);
class go {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function nr(r) {
  let e = [];
  do
    e.push(yo(r));
  while (r.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function yo(r) {
  let e = [];
  do
    e.push(bo(r));
  while (r.next && r.next != ")" && r.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function bo(r) {
  let e = vo(r);
  for (; ; )
    if (r.eat("+"))
      e = { type: "plus", expr: e };
    else if (r.eat("*"))
      e = { type: "star", expr: e };
    else if (r.eat("?"))
      e = { type: "opt", expr: e };
    else if (r.eat("{"))
      e = wo(r, e);
    else
      break;
  return e;
}
function hn(r) {
  /\D/.test(r.next) && r.err("Expected number, got '" + r.next + "'");
  let e = Number(r.next);
  return r.pos++, e;
}
function wo(r, e) {
  let t = hn(r), n = t;
  return r.eat(",") && (r.next != "}" ? n = hn(r) : n = -1), r.eat("}") || r.err("Unclosed braced range"), { type: "range", min: t, max: n, expr: e };
}
function xo(r, e) {
  let t = r.nodeTypes, n = t[e];
  if (n)
    return [n];
  let i = [];
  for (let o in t) {
    let s = t[o];
    s.isInGroup(e) && i.push(s);
  }
  return i.length == 0 && r.err("No node type or group '" + e + "' found"), i;
}
function vo(r) {
  if (r.eat("(")) {
    let e = nr(r);
    return r.eat(")") || r.err("Missing closing paren"), e;
  } else if (/\W/.test(r.next))
    r.err("Unexpected token '" + r.next + "'");
  else {
    let e = xo(r, r.next).map((t) => (r.inline == null ? r.inline = t.isInline : r.inline != t.isInline && r.err("Mixing inline and block content"), { type: "name", value: t }));
    return r.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function ko(r) {
  let e = [[]];
  return i(o(r, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function n(s, a, l) {
    let c = { term: l, to: a };
    return e[s].push(c), c;
  }
  function i(s, a) {
    s.forEach((l) => l.to = a);
  }
  function o(s, a) {
    if (s.type == "choice")
      return s.exprs.reduce((l, c) => l.concat(o(c, a)), []);
    if (s.type == "seq")
      for (let l = 0; ; l++) {
        let c = o(s.exprs[l], a);
        if (l == s.exprs.length - 1)
          return c;
        i(c, a = t());
      }
    else if (s.type == "star") {
      let l = t();
      return n(a, l), i(o(s.expr, l), l), [n(l)];
    } else if (s.type == "plus") {
      let l = t();
      return i(o(s.expr, a), l), i(o(s.expr, l), l), [n(l)];
    } else {
      if (s.type == "opt")
        return [n(a)].concat(o(s.expr, a));
      if (s.type == "range") {
        let l = a;
        for (let c = 0; c < s.min; c++) {
          let d = t();
          i(o(s.expr, l), d), l = d;
        }
        if (s.max == -1)
          i(o(s.expr, l), l);
        else
          for (let c = s.min; c < s.max; c++) {
            let d = t();
            n(l, d), i(o(s.expr, l), d), l = d;
          }
        return [n(l)];
      } else {
        if (s.type == "name")
          return [n(a, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function rr(r, e) {
  return e - r;
}
function pn(r, e) {
  let t = [];
  return n(e), t.sort(rr);
  function n(i) {
    let o = r[i];
    if (o.length == 1 && !o[0].term)
      return n(o[0].to);
    t.push(i);
    for (let s = 0; s < o.length; s++) {
      let { term: a, to: l } = o[s];
      !a && t.indexOf(l) == -1 && n(l);
    }
  }
}
function So(r) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(pn(r, 0));
  function t(n) {
    let i = [];
    n.forEach((s) => {
      r[s].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let d = 0; d < i.length; d++)
          i[d][0] == a && (c = i[d][1]);
        pn(r, l).forEach((d) => {
          c || i.push([a, c = []]), c.indexOf(d) == -1 && c.push(d);
        });
      });
    });
    let o = e[n.join(",")] = new se(n.indexOf(r.length - 1) > -1);
    for (let s = 0; s < i.length; s++) {
      let a = i[s][1].sort(rr);
      o.next.push({ type: i[s][0], next: e[a.join(",")] || t(a) });
    }
    return o;
  }
}
function Co(r, e) {
  for (let t = 0, n = [r]; t < n.length; t++) {
    let i = n[t], o = !i.validEnd, s = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      s.push(l.name), o && !(l.isText || l.hasRequiredAttrs()) && (o = !1), n.indexOf(c) == -1 && n.push(c);
    }
    o && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function ir(r) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in r) {
    let n = r[t];
    if (!n.hasDefault)
      return null;
    e[t] = n.default;
  }
  return e;
}
function or(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let n in r) {
    let i = e && e[n];
    if (i === void 0) {
      let o = r[n];
      if (o.hasDefault)
        i = o.default;
      else
        throw new RangeError("No value supplied for attribute " + n);
    }
    t[n] = i;
  }
  return t;
}
function sr(r, e, t, n) {
  for (let i in e)
    if (!(i in r))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in r) {
    let o = r[i];
    o.validate && o.validate(e[i]);
  }
}
function ar(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let n in e)
      t[n] = new No(r, n, e[n]);
  return t;
}
class ot {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = ar(e, n.attrs), this.defaultAttrs = ir(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == se.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : or(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, n) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new oe(this, this.computeAttrs(e), w.from(t), N.setFrom(n));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, n) {
    return t = w.from(t), this.checkContent(t), new oe(this, this.computeAttrs(e), t, N.setFrom(n));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, n) {
    if (e = this.computeAttrs(e), t = w.from(t), t.size) {
      let s = this.contentMatch.fillBefore(t);
      if (!s)
        return null;
      t = s.append(t);
    }
    let i = this.contentMatch.matchFragment(t), o = i && i.fillBefore(w.empty, !0);
    return o ? new oe(this, e, t.append(o), N.setFrom(n)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let n = 0; n < e.childCount; n++)
      if (!this.allowsMarks(e.child(n).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    sr(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let n = 0; n < e.length; n++)
      this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t || (t = e.slice(0, n));
    return t ? t.length ? t : N.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null);
    e.forEach((o, s) => n[o] = new ot(o, t, s));
    let i = t.spec.topNode || "doc";
    if (!n[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!n.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let o in n.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return n;
  }
}
function Eo(r, e, t) {
  let n = t.split("|");
  return (i) => {
    let o = i === null ? "null" : typeof i;
    if (n.indexOf(o) < 0)
      throw new RangeError(`Expected value of type ${n} for attribute ${e} on type ${r}, got ${o}`);
  };
}
class No {
  constructor(e, t, n) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? Eo(e, t, n.validate) : n.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Ft {
  /**
  @internal
  */
  constructor(e, t, n, i) {
    this.name = e, this.rank = t, this.schema = n, this.spec = i, this.attrs = ar(e, i.attrs), this.excluded = null;
    let o = ir(this.attrs);
    this.instance = o ? new N(this, o) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new N(this, or(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((o, s) => n[o] = new Ft(o, i++, t, s)), n;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    sr(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Ao {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = z.from(e.nodes), t.marks = z.from(e.marks || {}), this.nodes = ot.compile(this.spec.nodes, this), this.marks = Ft.compile(this.spec.marks, this);
    let n = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let o = this.nodes[i], s = o.spec.content || "", a = o.spec.marks;
      if (o.contentMatch = n[s] || (n[s] = se.parse(s, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = o;
      }
      o.markSet = a == "_" ? null : a ? mn(this, a.split(" ")) : a == "" || !o.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let o = this.marks[i], s = o.spec.excludes;
      o.excluded = s == null ? [o] : s == "" ? [] : mn(this, s.split(" "));
    }
    this.nodeFromJSON = (i) => oe.fromJSON(this, i), this.markFromJSON = (i) => N.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, n, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof ot) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, n, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let n = this.nodes.text;
    return new it(n, n.defaultAttrs, e, N.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function mn(r, e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let i = e[n], o = r.marks[i], s = o;
    if (o)
      t.push(o);
    else
      for (let a in r.marks) {
        let l = r.marks[a];
        (i == "_" || l.spec.group && l.spec.group.split(" ").indexOf(i) > -1) && t.push(s = l);
      }
    if (!s)
      throw new SyntaxError("Unknown mark type: '" + e[n] + "'");
  }
  return t;
}
function To(r) {
  return r.tag != null;
}
function Io(r) {
  return r.style != null;
}
class he {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let n = this.matchedStyles = [];
    t.forEach((i) => {
      if (To(i))
        this.tags.push(i);
      else if (Io(i)) {
        let o = /[^=]*/.exec(i.style)[0];
        n.indexOf(o) < 0 && n.push(o), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let o = e.nodes[i.node];
      return o.contentMatch.matchType(o);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let n = new yn(this, t, !1);
    return n.addAll(e, N.none, t.from, t.to), n.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let n = new yn(this, t, !0);
    return n.addAll(e, N.none, t.from, t.to), v.maxOpen(n.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, n) {
    for (let i = n ? this.tags.indexOf(n) + 1 : 0; i < this.tags.length; i++) {
      let o = this.tags[i];
      if (Ro(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
        if (o.getAttrs) {
          let s = o.getAttrs(e);
          if (s === !1)
            continue;
          o.attrs = s || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, n, i) {
    for (let o = i ? this.styles.indexOf(i) + 1 : 0; o < this.styles.length; o++) {
      let s = this.styles[o], a = s.style;
      if (!(a.indexOf(e) != 0 || s.context && !n.matchesContext(s.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
        if (s.getAttrs) {
          let l = s.getAttrs(t);
          if (l === !1)
            continue;
          s.attrs = l || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function n(i) {
      let o = i.priority == null ? 50 : i.priority, s = 0;
      for (; s < t.length; s++) {
        let a = t[s];
        if ((a.priority == null ? 50 : a.priority) < o)
          break;
      }
      t.splice(s, 0, i);
    }
    for (let i in e.marks) {
      let o = e.marks[i].spec.parseDOM;
      o && o.forEach((s) => {
        n(s = bn(s)), s.mark || s.ignore || s.clearMark || (s.mark = i);
      });
    }
    for (let i in e.nodes) {
      let o = e.nodes[i].spec.parseDOM;
      o && o.forEach((s) => {
        n(s = bn(s)), s.node || s.ignore || s.mark || (s.node = i);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new he(e, he.schemaRules(e)));
  }
}
const lr = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, Mo = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, cr = { ol: !0, ul: !0 }, Pe = 1, Ot = 2, Ee = 4;
function gn(r, e, t) {
  return e != null ? (e ? Pe : 0) | (e === "full" ? Ot : 0) : r && r.whitespace == "pre" ? Pe | Ot : t & ~Ee;
}
class We {
  constructor(e, t, n, i, o, s) {
    this.type = e, this.attrs = t, this.marks = n, this.solid = i, this.options = s, this.content = [], this.activeMarks = N.none, this.match = o || (s & Ee ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(w.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let n = this.type.contentMatch, i;
        return (i = n.findWrapping(e.type)) ? (this.match = n, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Pe)) {
      let n = this.content[this.content.length - 1], i;
      if (n && n.isText && (i = /[ \t\r\n\u000c]+$/.exec(n.text))) {
        let o = n;
        n.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - i[0].length));
      }
    }
    let t = w.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(w.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !lr.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class yn {
  constructor(e, t, n) {
    this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, o, s = gn(null, t.preserveWhitespace, 0) | (n ? Ee : 0);
    i ? o = new We(i.type, i.attrs, N.none, !0, t.topMatch || i.type.contentMatch, s) : n ? o = new We(null, null, N.none, !0, null, s) : o = new We(e.schema.topNodeType, null, N.none, !0, null, s), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let n = e.nodeValue, i = this.top, o = i.options & Ot ? "full" : this.localPreserveWS || (i.options & Pe) > 0, { schema: s } = this.parser;
    if (o === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (o)
        if (o === "full")
          n = n.replace(/\r\n?/g, `
`);
        else if (s.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(s.linebreakReplacement.create())) {
          let a = n.split(/\r?\n|\r/);
          for (let l = 0; l < a.length; l++)
            l && this.insertNode(s.linebreakReplacement.create(), t, !0), a[l] && this.insertNode(s.text(a[l]), t, !/\S/.test(a[l]));
          n = "";
        } else
          n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let a = i.content[i.content.length - 1], l = e.previousSibling;
        (!a || l && l.nodeName == "BR" || a.isText && /[ \t\r\n\u000c]$/.test(a.text)) && (n = n.slice(1));
      }
      n && this.insertNode(s.text(n), t, !/\S/.test(n)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, n) {
    let i = this.localPreserveWS, o = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let s = e.nodeName.toLowerCase(), a;
    cr.hasOwnProperty(s) && this.parser.normalizeLists && Oo(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (a = this.parser.matchTag(e, this, n));
    e: if (l ? l.ignore : Mo.hasOwnProperty(s))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, d = this.needsBlock;
      if (lr.hasOwnProperty(s))
        o.content.length && o.content[0].isInline && this.open && (this.open--, o = this.top), c = !0, o.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let f = l && l.skip ? t : this.readStyles(e, t);
      f && this.addAll(e, f), c && this.sync(o), this.needsBlock = d;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, l, c, l.consuming === !1 ? a : void 0);
    }
    this.localPreserveWS = i;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let n = e.style;
    if (n && n.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let o = this.parser.matchedStyles[i], s = n.getPropertyValue(o);
        if (s)
          for (let a = void 0; ; ) {
            let l = this.parser.matchStyle(o, s, this, a);
            if (!l)
              break;
            if (l.ignore)
              return null;
            if (l.clearMark ? t = t.filter((c) => !l.clearMark(c)) : t = t.concat(this.parser.schema.marks[l.mark].create(l.attrs)), l.consuming === !1)
              a = l;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, n, i) {
    let o, s;
    if (t.node)
      if (s = this.parser.schema.nodes[t.node], s.isLeaf)
        this.insertNode(s.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
      else {
        let l = this.enter(s, t.attrs || null, n, t.preserveWhitespace);
        l && (o = !0, n = l);
      }
    else {
      let l = this.parser.schema.marks[t.mark];
      n = n.concat(l.create(t.attrs));
    }
    let a = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, n, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l, n, !1));
    else {
      let l = e;
      typeof t.contentElement == "string" ? l = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? l = t.contentElement(e) : t.contentElement && (l = t.contentElement), this.findAround(e, l, !0), this.addAll(l, n), this.findAround(e, l, !1);
    }
    o && this.sync(a) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, n, i) {
    let o = n || 0;
    for (let s = n ? e.childNodes[n] : e.firstChild, a = i == null ? null : e.childNodes[i]; s != a; s = s.nextSibling, ++o)
      this.findAtPoint(e, o), this.addDOM(s, t);
    this.findAtPoint(e, o);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, n) {
    let i, o;
    for (let s = this.open, a = 0; s >= 0; s--) {
      let l = this.nodes[s], c = l.findWrapping(e);
      if (c && (!i || i.length > c.length + a) && (i = c, o = l, !c.length))
        break;
      if (l.solid) {
        if (n)
          break;
        a += 2;
      }
    }
    if (!i)
      return null;
    this.sync(o);
    for (let s = 0; s < i.length; s++)
      t = this.enterInner(i[s], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, n) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let o = this.textblockFromContext();
      o && (t = this.enterInner(o, null, t));
    }
    let i = this.findPlace(e, t, n);
    if (i) {
      this.closeExtra();
      let o = this.top;
      o.match && (o.match = o.match.matchType(e.type));
      let s = N.none;
      for (let a of i.concat(e.marks))
        (o.type ? o.type.allowsMarkType(a.type) : wn(a.type, e.type)) && (s = a.addToSet(s));
      return o.content.push(e.mark(s)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, n, i) {
    let o = this.findPlace(e.create(t), n, !1);
    return o && (o = this.enterInner(e, t, n, !0, i)), o;
  }
  // Open a node of the given type
  enterInner(e, t, n, i = !1, o) {
    this.closeExtra();
    let s = this.top;
    s.match = s.match && s.match.matchType(e);
    let a = gn(e, o, s.options);
    s.options & Ee && s.content.length == 0 && (a |= Ee);
    let l = N.none;
    return n = n.filter((c) => (s.type ? s.type.allowsMarkType(c.type) : wn(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new We(e, t, l, i, null, a)), this.open++, n;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= Pe);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let n = this.nodes[t].content;
      for (let i = n.length - 1; i >= 0; i--)
        e += n[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let n = 0; n < this.find.length; n++)
        this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, n) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (n ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), n = this.options.context, i = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), o = -(n ? n.depth + 1 : 0) + (i ? 0 : 1), s = (a, l) => {
      for (; a >= 0; a--) {
        let c = t[a];
        if (c == "") {
          if (a == t.length - 1 || a == 0)
            continue;
          for (; l >= o; l--)
            if (s(a - 1, l))
              return !0;
          return !1;
        } else {
          let d = l > 0 || l == 0 && i ? this.nodes[l].type : n && l >= o ? n.node(l - o).type : null;
          if (!d || d.name != c && !d.isInGroup(c))
            return !1;
          l--;
        }
      }
      return !0;
    };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (n && n.isTextblock && n.defaultAttrs)
          return n;
      }
    for (let t in this.parser.schema.nodes) {
      let n = this.parser.schema.nodes[t];
      if (n.isTextblock && n.defaultAttrs)
        return n;
    }
  }
}
function Oo(r) {
  for (let e = r.firstChild, t = null; e; e = e.nextSibling) {
    let n = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    n && cr.hasOwnProperty(n) && t ? (t.appendChild(e), e = t) : n == "li" ? t = e : n && (t = null);
  }
}
function Ro(r, e) {
  return (r.matches || r.msMatchesSelector || r.webkitMatchesSelector || r.mozMatchesSelector).call(r, e);
}
function bn(r) {
  let e = {};
  for (let t in r)
    e[t] = r[t];
  return e;
}
function wn(r, e) {
  let t = e.schema.nodes;
  for (let n in t) {
    let i = t[n];
    if (!i.allowsMarkType(r))
      continue;
    let o = [], s = (a) => {
      o.push(a);
      for (let l = 0; l < a.edgeCount; l++) {
        let { type: c, next: d } = a.edge(l);
        if (c == e || o.indexOf(d) < 0 && s(d))
          return !0;
      }
    };
    if (s(i.contentMatch))
      return !0;
  }
}
const dr = 65535, ur = Math.pow(2, 16);
function zo(r, e) {
  return r + e * ur;
}
function xn(r) {
  return r & dr;
}
function Lo(r) {
  return (r - (r & dr)) / ur;
}
const fr = 1, hr = 2, Ye = 4, pr = 8;
class vn {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.pos = e, this.delInfo = t, this.recover = n;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & pr) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (fr | Ye)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (hr | Ye)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Ye) > 0;
  }
}
class U {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && U.empty)
      return U.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, n = xn(e);
    if (!this.inverted)
      for (let i = 0; i < n; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[n * 3] + t + Lo(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, n) {
    let i = 0, o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? i : 0);
      if (l > e)
        break;
      let c = this.ranges[a + o], d = this.ranges[a + s], f = l + c;
      if (e <= f) {
        let h = c ? e == l ? -1 : e == f ? 1 : t : t, p = l + i + (h < 0 ? 0 : d);
        if (n)
          return p;
        let g = e == (t < 0 ? l : f) ? null : zo(a / 3, e - l), m = e == l ? hr : e == f ? fr : Ye;
        return (t < 0 ? e != l : e != f) && (m |= pr), new vn(p, m, g);
      }
      i += d - c;
    }
    return n ? e + i : new vn(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let n = 0, i = xn(t), o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? n : 0);
      if (l > e)
        break;
      let c = this.ranges[a + o], d = l + c;
      if (e <= d && a == i * 3)
        return !0;
      n += this.ranges[a + s] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
    for (let i = 0, o = 0; i < this.ranges.length; i += 3) {
      let s = this.ranges[i], a = s - (this.inverted ? o : 0), l = s + (this.inverted ? 0 : o), c = this.ranges[i + t], d = this.ranges[i + n];
      e(a, a + c, l, l + d), o += d - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new U(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? U.empty : new U(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
U.empty = new U([]);
const xt = /* @__PURE__ */ Object.create(null);
class B {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return U.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let n = xt[t.stepType];
    if (!n)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return n.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in xt)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return xt[e] = t, t.prototype.jsonID = e, t;
  }
}
class O {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new O(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new O(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, n, i) {
    try {
      return O.ok(e.replace(t, n, i));
    } catch (o) {
      if (o instanceof tt)
        return O.fail(o.message);
      throw o;
    }
  }
}
function Dt(r, e, t) {
  let n = [];
  for (let i = 0; i < r.childCount; i++) {
    let o = r.child(i);
    o.content.size && (o = o.copy(Dt(o.content, e, o))), o.isInline && (o = e(o, t, i)), n.push(o);
  }
  return w.fromArray(n);
}
class Z extends B {
  /**
  Create a mark step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = e.resolve(this.from), i = n.node(n.sharedDepth(this.to)), o = new v(Dt(t.content, (s, a) => !s.isAtom || !a.type.allowsMarkType(this.mark.type) ? s : s.mark(this.mark.addToSet(s.marks)), i), t.openStart, t.openEnd);
    return O.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new ee(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new Z(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof Z && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Z(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Z(t.from, t.to, e.markFromJSON(t.mark));
  }
}
B.jsonID("addMark", Z);
class ee extends B {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = new v(Dt(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return O.fromReplace(e, this.from, this.to, n);
  }
  invert() {
    return new Z(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new ee(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof ee && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ee(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new ee(t.from, t.to, e.markFromJSON(t.mark));
  }
}
B.jsonID("removeMark", ee);
class te extends B {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return O.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return O.fromReplace(e, this.pos, this.pos + 1, new v(w.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let n = this.mark.addToSet(t.marks);
      if (n.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(n))
            return new te(this.pos, t.marks[i]);
        return new te(this.pos, this.mark);
      }
    }
    return new Be(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new te(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new te(t.pos, e.markFromJSON(t.mark));
  }
}
B.jsonID("addNodeMark", te);
class Be extends B {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return O.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return O.fromReplace(e, this.pos, this.pos + 1, new v(w.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new te(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Be(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new Be(t.pos, e.markFromJSON(t.mark));
  }
}
B.jsonID("removeNodeMark", Be);
class j extends B {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, n, i = !1) {
    super(), this.from = e, this.to = t, this.slice = n, this.structure = i;
  }
  apply(e) {
    return this.structure && Rt(e, this.from, this.to) ? O.fail("Structure replace would overwrite content") : O.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new U([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new j(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), n = this.from == this.to && j.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return n.deletedAcross && t.deletedAcross ? null : new j(n.pos, Math.max(n.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof j) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? v.empty : new v(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new j(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? v.empty : new v(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new j(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new j(t.from, t.to, v.fromJSON(e, t.slice), !!t.structure);
  }
}
j.MAP_BIAS = 1;
B.jsonID("replace", j);
class D extends B {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, n, i, o, s, a = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = i, this.slice = o, this.insert = s, this.structure = a;
  }
  apply(e) {
    if (this.structure && (Rt(e, this.from, this.gapFrom) || Rt(e, this.gapTo, this.to)))
      return O.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return O.fail("Gap is not a flat range");
    let n = this.slice.insertAt(this.insert, t.content);
    return n ? O.fromReplace(e, this.from, this.to, n) : O.fail("Content does not fit in gap");
  }
  getMap() {
    return new U([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new D(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), o = this.to == this.gapTo ? n.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && n.deletedAcross || i < t.pos || o > n.pos ? null : new D(t.pos, n.pos, i, o, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new D(t.from, t.to, t.gapFrom, t.gapTo, v.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
B.jsonID("replaceAround", D);
function Rt(r, e, t) {
  let n = r.resolve(e), i = t - e, o = n.depth;
  for (; i > 0 && o > 0 && n.indexAfter(o) == n.node(o).childCount; )
    o--, i--;
  if (i > 0) {
    let s = n.node(o).maybeChild(n.indexAfter(o));
    for (; i > 0; ) {
      if (!s || s.isLeaf)
        return !0;
      s = s.firstChild, i--;
    }
  }
  return !1;
}
function Po(r, e, t) {
  return (e == 0 || r.canReplace(e, r.childCount)) && (t == r.childCount || r.canReplace(0, t));
}
function xe(r) {
  let t = r.parent.content.cutByIndex(r.startIndex, r.endIndex);
  for (let n = r.depth, i = 0, o = 0; ; --n) {
    let s = r.$from.node(n), a = r.$from.index(n) + i, l = r.$to.indexAfter(n) - o;
    if (n < r.depth && s.canReplace(a, l, t))
      return n;
    if (n == 0 || s.type.spec.isolating || !Po(s, a, l))
      break;
    a && (i = 1), l < s.childCount && (o = 1);
  }
  return null;
}
function mr(r, e, t = null, n = r) {
  let i = Bo(r, e), o = i && jo(n, e);
  return o ? i.map(kn).concat({ type: e, attrs: t }).concat(o.map(kn)) : null;
}
function kn(r) {
  return { type: r, attrs: null };
}
function Bo(r, e) {
  let { parent: t, startIndex: n, endIndex: i } = r, o = t.contentMatchAt(n).findWrapping(e);
  if (!o)
    return null;
  let s = o.length ? o[0] : e;
  return t.canReplaceWith(n, i, s) ? o : null;
}
function jo(r, e) {
  let { parent: t, startIndex: n, endIndex: i } = r, o = t.child(n), s = e.contentMatch.findWrapping(o.type);
  if (!s)
    return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let c = n; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : s;
}
function K(r, e, t = 1, n) {
  let i = r.resolve(e), o = i.depth - t, s = n && n[n.length - 1] || i.parent;
  if (o < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !s.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, d = t - 2; c > o; c--, d--) {
    let f = i.node(c), h = i.index(c);
    if (f.type.spec.isolating)
      return !1;
    let p = f.content.cutByIndex(h, f.childCount), g = n && n[d + 1];
    g && (p = p.replaceChild(0, g.type.create(g.attrs)));
    let m = n && n[d] || f;
    if (!f.canReplace(h + 1, f.childCount) || !m.type.validContent(p))
      return !1;
  }
  let a = i.indexAfter(o), l = n && n[0];
  return i.node(o).canReplaceWith(a, a, l ? l.type : i.node(o + 1).type);
}
function ae(r, e) {
  let t = r.resolve(e), n = t.index();
  return gr(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(n, n + 1);
}
function Fo(r, e) {
  e.content.size || r.type.compatibleContent(e.type);
  let t = r.contentMatchAt(r.childCount), { linebreakReplacement: n } = r.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let o = e.child(i), s = o.type == n ? r.type.schema.nodes.text : o.type;
    if (t = t.matchType(s), !t || !r.type.allowsMarks(o.marks))
      return !1;
  }
  return t.validEnd;
}
function gr(r, e) {
  return !!(r && e && !r.isLeaf && Fo(r, e));
}
function pt(r, e, t = -1) {
  let n = r.resolve(e);
  for (let i = n.depth; ; i--) {
    let o, s, a = n.index(i);
    if (i == n.depth ? (o = n.nodeBefore, s = n.nodeAfter) : t > 0 ? (o = n.node(i + 1), a++, s = n.node(i).maybeChild(a)) : (o = n.node(i).maybeChild(a - 1), s = n.node(i + 1)), o && !o.isTextblock && gr(o, s) && n.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? n.before(i) : n.after(i);
  }
}
function $t(r, e, t = e, n = v.empty) {
  if (e == t && !n.size)
    return null;
  let i = r.resolve(e), o = r.resolve(t);
  return Do(i, o, n) ? new j(e, t, n) : new $o(i, o, n).fit();
}
function Do(r, e, t) {
  return !t.openStart && !t.openEnd && r.start() == e.start() && r.parent.canReplace(r.index(), e.index(), t.content);
}
class $o {
  constructor(e, t, n) {
    this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = w.empty;
    for (let i = 0; i <= e.depth; i++) {
      let o = e.node(i);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = w.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, i = this.close(e < 0 ? this.$to : n.doc.resolve(e));
    if (!i)
      return null;
    let o = this.placed, s = n.depth, a = i.depth;
    for (; s && a && o.childCount == 1; )
      o = o.firstChild.content, s--, a--;
    let l = new v(o, s, a);
    return e > -1 ? new D(n.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || n.pos != this.$to.pos ? new j(n.pos, i.pos, l) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, n = 0, i = this.unplaced.openEnd; n < e; n++) {
      let o = t.firstChild;
      if (t.childCount > 1 && (i = 0), o.type.spec.isolating && i <= n) {
        e = n;
        break;
      }
      t = o.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
        let i, o = null;
        n ? (o = vt(this.unplaced.content, n - 1).firstChild, i = o.content) : i = this.unplaced.content;
        let s = i.firstChild;
        for (let a = this.depth; a >= 0; a--) {
          let { type: l, match: c } = this.frontier[a], d, f = null;
          if (t == 1 && (s ? c.matchType(s.type) || (f = c.fillBefore(w.from(s), !1)) : o && l.compatibleContent(o.type)))
            return { sliceDepth: n, frontierDepth: a, parent: o, inject: f };
          if (t == 2 && s && (d = c.findWrapping(s.type)))
            return { sliceDepth: n, frontierDepth: a, parent: o, wrap: d };
          if (o && c.matchType(o.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, i = vt(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new v(e, t + 1, Math.max(n, i.size + t >= e.size - n ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, i = vt(e, t);
    if (i.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + i.size;
      this.unplaced = new v(ke(e, t - 1, 1), t - 1, o ? t - 1 : n);
    } else
      this.unplaced = new v(ke(e, t, 1), t, n);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: i, wrap: o }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (o)
      for (let m = 0; m < o.length; m++)
        this.openFrontierNode(o[m]);
    let s = this.unplaced, a = n ? n.content : s.content, l = s.openStart - e, c = 0, d = [], { match: f, type: h } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        d.push(i.child(m));
      f = f.matchFragment(i);
    }
    let p = a.size + e - (s.content.size - s.openEnd);
    for (; c < a.childCount; ) {
      let m = a.child(c), b = f.matchType(m.type);
      if (!b)
        break;
      c++, (c > 1 || l == 0 || m.content.size) && (f = b, d.push(yr(m.mark(h.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? p : -1)));
    }
    let g = c == a.childCount;
    g || (p = -1), this.placed = Se(this.placed, t, w.from(d)), this.frontier[t].match = f, g && p < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, b = a; m < p; m++) {
      let x = b.lastChild;
      this.frontier.push({ type: x.type, match: x.contentMatchAt(x.childCount) }), b = x.content;
    }
    this.unplaced = g ? e == 0 ? v.empty : new v(ke(s.content, e - 1, 1), e - 1, p < 0 ? s.openEnd : e - 1) : new v(ke(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !kt(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: n } = this.$to, i = this.$to.after(n);
    for (; n > 1 && i == this.$to.end(--n); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: n, type: i } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), s = kt(e, t, i, n, o);
      if (s) {
        for (let a = t - 1; a >= 0; a--) {
          let { match: l, type: c } = this.frontier[a], d = kt(e, a, c, l, !0);
          if (!d || d.childCount)
            continue e;
        }
        return { depth: t, fit: s, move: o ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = Se(this.placed, t.depth, t.fit)), e = t.move;
    for (let n = t.depth + 1; n <= e.depth; n++) {
      let i = e.node(n), o = i.type.contentMatch.fillBefore(i.content, !0, e.index(n));
      this.openFrontierNode(i.type, i.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, n) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Se(this.placed, this.depth, w.from(e.create(t, n))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(w.empty, !0);
    t.childCount && (this.placed = Se(this.placed, this.frontier.length, t));
  }
}
function ke(r, e, t) {
  return e == 0 ? r.cutByIndex(t, r.childCount) : r.replaceChild(0, r.firstChild.copy(ke(r.firstChild.content, e - 1, t)));
}
function Se(r, e, t) {
  return e == 0 ? r.append(t) : r.replaceChild(r.childCount - 1, r.lastChild.copy(Se(r.lastChild.content, e - 1, t)));
}
function vt(r, e) {
  for (let t = 0; t < e; t++)
    r = r.firstChild.content;
  return r;
}
function yr(r, e, t) {
  if (e <= 0)
    return r;
  let n = r.content;
  return e > 1 && (n = n.replaceChild(0, yr(n.firstChild, e - 1, n.childCount == 1 ? t - 1 : 0))), e > 0 && (n = r.type.contentMatch.fillBefore(n).append(n), t <= 0 && (n = n.append(r.type.contentMatch.matchFragment(n).fillBefore(w.empty, !0)))), r.copy(n);
}
function kt(r, e, t, n, i) {
  let o = r.node(e), s = i ? r.indexAfter(e) : r.index(e);
  if (s == o.childCount && !t.compatibleContent(o.type))
    return null;
  let a = n.fillBefore(o.content, !0, s);
  return a && !Uo(t, o.content, s) ? a : null;
}
function Uo(r, e, t) {
  for (let n = t; n < e.childCount; n++)
    if (!r.allowsMarks(e.child(n).marks))
      return !0;
  return !1;
}
class Ne extends B {
  /**
  Construct an attribute step.
  */
  constructor(e, t, n) {
    super(), this.pos = e, this.attr = t, this.value = n;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return O.fail("No node at attribute step's position");
    let n = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      n[o] = t.attrs[o];
    n[this.attr] = this.value;
    let i = t.type.create(n, null, t.marks);
    return O.fromReplace(e, this.pos, this.pos + 1, new v(w.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return U.empty;
  }
  invert(e) {
    return new Ne(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ne(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Ne(t.pos, t.attr, t.value);
  }
}
B.jsonID("attr", Ne);
class st extends B {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let n = e.type.create(t, e.content, e.marks);
    return O.ok(n);
  }
  getMap() {
    return U.empty;
  }
  invert(e) {
    return new st(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new st(t.attr, t.value);
  }
}
B.jsonID("docAttr", st);
let je = class extends Error {
};
je = function r(e) {
  let t = Error.call(this, e);
  return t.__proto__ = r.prototype, t;
};
je.prototype = Object.create(Error.prototype);
je.prototype.constructor = je;
je.prototype.name = "TransformError";
const St = /* @__PURE__ */ Object.create(null);
class S {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, n) {
    this.$anchor = e, this.$head = t, this.ranges = n || [new Vo(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = v.empty) {
    let n = t.content.lastChild, i = null;
    for (let a = 0; a < t.openEnd; a++)
      i = n, n = n.lastChild;
    let o = e.steps.length, s = this.ranges;
    for (let a = 0; a < s.length; a++) {
      let { $from: l, $to: c } = s[a], d = e.mapping.slice(o);
      e.replaceRange(d.map(l.pos), d.map(c.pos), a ? v.empty : t), a == 0 && En(e, o, (n ? n.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let n = e.steps.length, i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      let { $from: s, $to: a } = i[o], l = e.mapping.slice(n), c = l.map(s.pos), d = l.map(a.pos);
      o ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), En(e, n, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, n = !1) {
    let i = e.parent.inlineContent ? new T(e) : ue(e.node(0), e.parent, e.pos, e.index(), t, n);
    if (i)
      return i;
    for (let o = e.depth - 1; o >= 0; o--) {
      let s = t < 0 ? ue(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, n) : ue(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, n);
      if (s)
        return s;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new V(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return ue(e, e, 0, 0, 1) || new V(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return ue(e, e, e.content.size, e.childCount, -1) || new V(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let n = St[t.type];
    if (!n)
      throw new RangeError(`No selection type ${t.type} defined`);
    return n.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in St)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return St[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return T.between(this.$anchor, this.$head).getBookmark();
  }
}
S.prototype.visible = !0;
class Vo {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Sn = !1;
function Cn(r) {
  !Sn && !r.parent.inlineContent && (Sn = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + r.parent.type.name + ")"));
}
class T extends S {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Cn(e), Cn(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let n = e.resolve(t.map(this.head));
    if (!n.parent.inlineContent)
      return S.near(n);
    let i = e.resolve(t.map(this.anchor));
    return new T(i.parent.inlineContent ? i : n, n);
  }
  replace(e, t = v.empty) {
    if (super.replace(e, t), t == v.empty) {
      let n = this.$from.marksAcross(this.$to);
      n && e.ensureMarks(n);
    }
  }
  eq(e) {
    return e instanceof T && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new mt(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new T(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, n = t) {
    let i = e.resolve(t);
    return new this(i, n == t ? i : e.resolve(n));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, n) {
    let i = e.pos - t.pos;
    if ((!n || i) && (n = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let o = S.findFrom(t, n, !0) || S.findFrom(t, -n, !0);
      if (o)
        t = o.$head;
      else
        return S.near(t, n);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (S.findFrom(e, -n, !0) || S.findFrom(e, n, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new T(e, t);
  }
}
S.jsonID("text", T);
class mt {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new mt(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return T.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class C extends S {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, n), this.node = t;
  }
  map(e, t) {
    let { deleted: n, pos: i } = t.mapResult(this.anchor), o = e.resolve(i);
    return n ? S.near(o) : new C(o);
  }
  content() {
    return new v(w.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof C && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Ut(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new C(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new C(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
C.prototype.visible = !1;
S.jsonID("node", C);
class Ut {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: n } = e.mapResult(this.anchor);
    return t ? new mt(n, n) : new Ut(n);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), n = t.nodeAfter;
    return n && C.isSelectable(n) ? new C(t) : S.near(t);
  }
}
class V extends S {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = v.empty) {
    if (t == v.empty) {
      e.delete(0, e.doc.content.size);
      let n = S.atStart(e.doc);
      n.eq(e.selection) || e.setSelection(n);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new V(e);
  }
  map(e) {
    return new V(e);
  }
  eq(e) {
    return e instanceof V;
  }
  getBookmark() {
    return Ho;
  }
}
S.jsonID("all", V);
const Ho = {
  map() {
    return this;
  },
  resolve(r) {
    return new V(r);
  }
};
function ue(r, e, t, n, i, o = !1) {
  if (e.inlineContent)
    return T.create(r, t);
  for (let s = n - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let a = e.child(s);
    if (a.isAtom) {
      if (!o && C.isSelectable(a))
        return C.create(r, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = ue(r, a, t + i, i < 0 ? a.childCount : 0, i, o);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function En(r, e, t) {
  let n = r.steps.length - 1;
  if (n < e)
    return;
  let i = r.steps[n];
  if (!(i instanceof j || i instanceof D))
    return;
  let o = r.mapping.maps[n], s;
  o.forEach((a, l, c, d) => {
    s == null && (s = d);
  }), r.setSelection(S.near(r.doc.resolve(s), t));
}
function Nn(r, e) {
  return !e || !r ? r : r.bind(e);
}
class Ge {
  constructor(e, t, n) {
    this.name = e, this.init = Nn(t.init, n), this.apply = Nn(t.apply, n);
  }
}
new Ge("doc", {
  init(r) {
    return r.doc || r.schema.topNodeType.createAndFill();
  },
  apply(r) {
    return r.doc;
  }
}), new Ge("selection", {
  init(r, e) {
    return r.selection || S.atStart(e.doc);
  },
  apply(r) {
    return r.selection;
  }
}), new Ge("storedMarks", {
  init(r) {
    return r.storedMarks || null;
  },
  apply(r, e, t, n) {
    return n.selection.$cursor ? r.storedMarks : null;
  }
}), new Ge("scrollToSelection", {
  init() {
    return 0;
  },
  apply(r, e) {
    return r.scrolledIntoView ? e + 1 : e;
  }
});
function br(r, e, t) {
  for (let n in r) {
    let i = r[n];
    i instanceof Function ? i = i.bind(e) : n == "handleDOMEvents" && (i = br(i, e, {})), t[n] = i;
  }
  return t;
}
class le {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && br(e.props, this, this.props), this.key = e.key ? e.key.key : wr("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Ct = /* @__PURE__ */ Object.create(null);
function wr(r) {
  return r in Ct ? r + "$" + ++Ct[r] : (Ct[r] = 0, r + "$");
}
class ce {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = wr(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Vt = (r, e) => r.selection.empty ? !1 : (e && e(r.tr.deleteSelection().scrollIntoView()), !0);
function xr(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("backward", r) : t.parentOffset > 0) ? null : t;
}
const vr = (r, e, t) => {
  let n = xr(r, t);
  if (!n)
    return !1;
  let i = Ht(n);
  if (!i) {
    let s = n.blockRange(), a = s && xe(s);
    return a == null ? !1 : (e && e(r.tr.lift(s, a).scrollIntoView()), !0);
  }
  let o = i.nodeBefore;
  if (Mr(r, i, e, -1))
    return !0;
  if (n.parent.content.size == 0 && (ye(o, "end") || C.isSelectable(o)))
    for (let s = n.depth; ; s--) {
      let a = $t(r.doc, n.before(s), n.after(s), v.empty);
      if (a && a.slice.size < a.to - a.from) {
        if (e) {
          let l = r.tr.step(a);
          l.setSelection(ye(o, "end") ? S.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : C.create(l.doc, i.pos - o.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (s == 1 || n.node(s - 1).childCount > 1)
        break;
    }
  return o.isAtom && i.depth == n.depth - 1 ? (e && e(r.tr.delete(i.pos - o.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Jo = (r, e, t) => {
  let n = xr(r, t);
  if (!n)
    return !1;
  let i = Ht(n);
  return i ? kr(r, i, e) : !1;
}, _o = (r, e, t) => {
  let n = Cr(r, t);
  if (!n)
    return !1;
  let i = Jt(n);
  return i ? kr(r, i, e) : !1;
};
function kr(r, e, t) {
  let n = e.nodeBefore, i = n, o = e.pos - 1;
  for (; !i.isTextblock; o--) {
    if (i.type.spec.isolating)
      return !1;
    let d = i.lastChild;
    if (!d)
      return !1;
    i = d;
  }
  let s = e.nodeAfter, a = s, l = e.pos + 1;
  for (; !a.isTextblock; l++) {
    if (a.type.spec.isolating)
      return !1;
    let d = a.firstChild;
    if (!d)
      return !1;
    a = d;
  }
  let c = $t(r.doc, o, l, v.empty);
  if (!c || c.from != o || c instanceof j && c.slice.size >= l - o)
    return !1;
  if (t) {
    let d = r.tr.step(c);
    d.setSelection(T.create(d.doc, o)), t(d.scrollIntoView());
  }
  return !0;
}
function ye(r, e, t = !1) {
  for (let n = r; n; n = e == "start" ? n.firstChild : n.lastChild) {
    if (n.isTextblock)
      return !0;
    if (t && n.childCount != 1)
      return !1;
  }
  return !1;
}
const Sr = (r, e, t) => {
  let { $head: n, empty: i } = r.selection, o = n;
  if (!i)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", r) : n.parentOffset > 0)
      return !1;
    o = Ht(n);
  }
  let s = o && o.nodeBefore;
  return !s || !C.isSelectable(s) ? !1 : (e && e(r.tr.setSelection(C.create(r.doc, o.pos - s.nodeSize)).scrollIntoView()), !0);
};
function Ht(r) {
  if (!r.parent.type.spec.isolating)
    for (let e = r.depth - 1; e >= 0; e--) {
      if (r.index(e) > 0)
        return r.doc.resolve(r.before(e + 1));
      if (r.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Cr(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("forward", r) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Er = (r, e, t) => {
  let n = Cr(r, t);
  if (!n)
    return !1;
  let i = Jt(n);
  if (!i)
    return !1;
  let o = i.nodeAfter;
  if (Mr(r, i, e, 1))
    return !0;
  if (n.parent.content.size == 0 && (ye(o, "start") || C.isSelectable(o))) {
    let s = $t(r.doc, n.before(), n.after(), v.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let a = r.tr.step(s);
        a.setSelection(ye(o, "start") ? S.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : C.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == n.depth - 1 ? (e && e(r.tr.delete(i.pos, i.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, Nr = (r, e, t) => {
  let { $head: n, empty: i } = r.selection, o = n;
  if (!i)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", r) : n.parentOffset < n.parent.content.size)
      return !1;
    o = Jt(n);
  }
  let s = o && o.nodeAfter;
  return !s || !C.isSelectable(s) ? !1 : (e && e(r.tr.setSelection(C.create(r.doc, o.pos)).scrollIntoView()), !0);
};
function Jt(r) {
  if (!r.parent.type.spec.isolating)
    for (let e = r.depth - 1; e >= 0; e--) {
      let t = r.node(e);
      if (r.index(e) + 1 < t.childCount)
        return r.doc.resolve(r.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const Wo = (r, e) => {
  let t = r.selection, n = t instanceof C, i;
  if (n) {
    if (t.node.isTextblock || !ae(r.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = pt(r.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let o = r.tr.join(i);
    n && o.setSelection(C.create(o.doc, i - r.doc.resolve(i).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, Go = (r, e) => {
  let t = r.selection, n;
  if (t instanceof C) {
    if (t.node.isTextblock || !ae(r.doc, t.to))
      return !1;
    n = t.to;
  } else if (n = pt(r.doc, t.to, 1), n == null)
    return !1;
  return e && e(r.tr.join(n).scrollIntoView()), !0;
}, qo = (r, e) => {
  let { $from: t, $to: n } = r.selection, i = t.blockRange(n), o = i && xe(i);
  return o == null ? !1 : (e && e(r.tr.lift(i, o).scrollIntoView()), !0);
}, Ar = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  return !t.parent.type.spec.code || !t.sameParent(n) ? !1 : (e && e(r.tr.insertText(`
`).scrollIntoView()), !0);
};
function _t(r) {
  for (let e = 0; e < r.edgeCount; e++) {
    let { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Ko = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  if (!t.parent.type.spec.code || !t.sameParent(n))
    return !1;
  let i = t.node(-1), o = t.indexAfter(-1), s = _t(i.contentMatchAt(o));
  if (!s || !i.canReplaceWith(o, o, s))
    return !1;
  if (e) {
    let a = t.after(), l = r.tr.replaceWith(a, a, s.createAndFill());
    l.setSelection(S.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Tr = (r, e) => {
  let t = r.selection, { $from: n, $to: i } = t;
  if (t instanceof V || n.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let o = _t(i.parent.contentMatchAt(i.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let s = (!n.parentOffset && i.index() < i.parent.childCount ? n : i).pos, a = r.tr.insert(s, o.createAndFill());
    a.setSelection(T.create(a.doc, s + 1)), e(a.scrollIntoView());
  }
  return !0;
}, Ir = (r, e) => {
  let { $cursor: t } = r.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (K(r.doc, o))
      return e && e(r.tr.split(o).scrollIntoView()), !0;
  }
  let n = t.blockRange(), i = n && xe(n);
  return i == null ? !1 : (e && e(r.tr.lift(n, i).scrollIntoView()), !0);
};
function Yo(r) {
  return (e, t) => {
    let { $from: n, $to: i } = e.selection;
    if (e.selection instanceof C && e.selection.node.isBlock)
      return !n.parentOffset || !K(e.doc, n.pos) ? !1 : (t && t(e.tr.split(n.pos).scrollIntoView()), !0);
    if (!n.depth)
      return !1;
    let o = [], s, a, l = !1, c = !1;
    for (let p = n.depth; ; p--)
      if (n.node(p).isBlock) {
        l = n.end(p) == n.pos + (n.depth - p), c = n.start(p) == n.pos - (n.depth - p), a = _t(n.node(p - 1).contentMatchAt(n.indexAfter(p - 1))), o.unshift(l && a ? { type: a } : null), s = p;
        break;
      } else {
        if (p == 1)
          return !1;
        o.unshift(null);
      }
    let d = e.tr;
    (e.selection instanceof T || e.selection instanceof V) && d.deleteSelection();
    let f = d.mapping.map(n.pos), h = K(d.doc, f, o.length, o);
    if (h || (o[0] = a ? { type: a } : null, h = K(d.doc, f, o.length, o)), !h)
      return !1;
    if (d.split(f, o.length, o), !l && c && n.node(s).type != a) {
      let p = d.mapping.map(n.before(s)), g = d.doc.resolve(p);
      a && n.node(s - 1).canReplaceWith(g.index(), g.index() + 1, a) && d.setNodeMarkup(d.mapping.map(n.before(s)), a);
    }
    return t && t(d.scrollIntoView()), !0;
  };
}
const Xo = Yo(), Qo = (r, e) => {
  let { $from: t, to: n } = r.selection, i, o = t.sharedDepth(n);
  return o == 0 ? !1 : (i = t.before(o), e && e(r.tr.setSelection(C.create(r.doc, i))), !0);
};
function Zo(r, e, t) {
  let n = e.nodeBefore, i = e.nodeAfter, o = e.index();
  return !n || !i || !n.type.compatibleContent(i.type) ? !1 : !n.content.size && e.parent.canReplace(o - 1, o) ? (t && t(r.tr.delete(e.pos - n.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(i.isTextblock || ae(r.doc, e.pos)) ? !1 : (t && t(r.tr.join(e.pos).scrollIntoView()), !0);
}
function Mr(r, e, t, n) {
  let i = e.nodeBefore, o = e.nodeAfter, s, a, l = i.type.spec.isolating || o.type.spec.isolating;
  if (!l && Zo(r, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (s = (a = i.contentMatchAt(i.childCount)).findWrapping(o.type)) && a.matchType(s[0] || o.type).validEnd) {
    if (t) {
      let p = e.pos + o.nodeSize, g = w.empty;
      for (let x = s.length - 1; x >= 0; x--)
        g = w.from(s[x].create(null, g));
      g = w.from(i.copy(g));
      let m = r.tr.step(new D(e.pos - 1, p, e.pos, p, new v(g, 1, 0), s.length, !0)), b = m.doc.resolve(p + 2 * s.length);
      b.nodeAfter && b.nodeAfter.type == i.type && ae(m.doc, b.pos) && m.join(b.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let d = o.type.spec.isolating || n > 0 && l ? null : S.findFrom(e, 1), f = d && d.$from.blockRange(d.$to), h = f && xe(f);
  if (h != null && h >= e.depth)
    return t && t(r.tr.lift(f, h).scrollIntoView()), !0;
  if (c && ye(o, "start", !0) && ye(i, "end")) {
    let p = i, g = [];
    for (; g.push(p), !p.isTextblock; )
      p = p.lastChild;
    let m = o, b = 1;
    for (; !m.isTextblock; m = m.firstChild)
      b++;
    if (p.canReplace(p.childCount, p.childCount, m.content)) {
      if (t) {
        let x = w.empty;
        for (let k = g.length - 1; k >= 0; k--)
          x = w.from(g[k].copy(x));
        let A = r.tr.step(new D(e.pos - g.length, e.pos + o.nodeSize, e.pos + b, e.pos + o.nodeSize - b, new v(x, g.length, 0), 0, !0));
        t(A.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Or(r) {
  return function(e, t) {
    let n = e.selection, i = r < 0 ? n.$from : n.$to, o = i.depth;
    for (; i.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return i.node(o).isTextblock ? (t && t(e.tr.setSelection(T.create(e.doc, r < 0 ? i.start(o) : i.end(o)))), !0) : !1;
  };
}
const es = Or(-1), ts = Or(1);
function ns(r, e = null) {
  return function(t, n) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o), a = s && mr(s, r, e);
    return a ? (n && n(t.tr.wrap(s, a).scrollIntoView()), !0) : !1;
  };
}
function An(r, e = null) {
  return function(t, n) {
    let i = !1;
    for (let o = 0; o < t.selection.ranges.length && !i; o++) {
      let { $from: { pos: s }, $to: { pos: a } } = t.selection.ranges[o];
      t.doc.nodesBetween(s, a, (l, c) => {
        if (i)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(r, e)))
          if (l.type == r)
            i = !0;
          else {
            let d = t.doc.resolve(c), f = d.index();
            i = d.parent.canReplaceWith(f, f + 1, r);
          }
      });
    }
    if (!i)
      return !1;
    if (n) {
      let o = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let { $from: { pos: a }, $to: { pos: l } } = t.selection.ranges[s];
        o.setBlockType(a, l, r, e);
      }
      n(o.scrollIntoView());
    }
    return !0;
  };
}
function Wt(...r) {
  return function(e, t, n) {
    for (let i = 0; i < r.length; i++)
      if (r[i](e, t, n))
        return !0;
    return !1;
  };
}
Wt(Vt, vr, Sr);
Wt(Vt, Er, Nr);
Wt(Ar, Tr, Ir, Xo);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function rs(r, e = null) {
  return function(t, n) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o);
    if (!s)
      return !1;
    let a = n ? t.tr : null;
    return is(a, s, r, e) ? (n && n(a.scrollIntoView()), !0) : !1;
  };
}
function is(r, e, t, n = null) {
  let i = !1, o = e, s = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = s.resolve(e.start - 2);
    o = new rt(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new rt(e.$from, s.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let a = mr(o, t, n, e);
  return a ? (r && ss(r, e, a, i, t), !0) : !1;
}
function ss(r, e, t, n, i) {
  let o = w.empty;
  for (let d = t.length - 1; d >= 0; d--)
    o = w.from(t[d].type.create(t[d].attrs, o));
  r.step(new D(e.start - (n ? 2 : 0), e.end, e.start, e.end, new v(o, 0, 0), t.length, !0));
  let s = 0;
  for (let d = 0; d < t.length; d++)
    t[d].type == i && (s = d + 1);
  let a = t.length - s, l = e.start + t.length - (n ? 2 : 0), c = e.parent;
  for (let d = e.startIndex, f = e.endIndex, h = !0; d < f; d++, h = !1)
    !h && K(r.doc, l, a) && (r.split(l, a), l += 2 * a), l += c.child(d).nodeSize;
  return r;
}
function as(r) {
  return function(e, t) {
    let { $from: n, $to: i } = e.selection, o = n.blockRange(i, (s) => s.childCount > 0 && s.firstChild.type == r);
    return o ? t ? n.node(o.depth - 1).type == r ? ls(e, t, r, o) : cs(e, t, o) : !0 : !1;
  };
}
function ls(r, e, t, n) {
  let i = r.tr, o = n.end, s = n.$to.end(n.depth);
  o < s && (i.step(new D(o - 1, s, o, s, new v(w.from(t.create(null, n.parent.copy())), 1, 0), 1, !0)), n = new rt(i.doc.resolve(n.$from.pos), i.doc.resolve(s), n.depth));
  const a = xe(n);
  if (a == null)
    return !1;
  i.lift(n, a);
  let l = i.doc.resolve(i.mapping.map(o, -1) - 1);
  return ae(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function cs(r, e, t) {
  let n = r.tr, i = t.parent;
  for (let p = t.end, g = t.endIndex - 1, m = t.startIndex; g > m; g--)
    p -= i.child(g).nodeSize, n.delete(p - 1, p + 1);
  let o = n.doc.resolve(t.start), s = o.nodeAfter;
  if (n.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let a = t.startIndex == 0, l = t.endIndex == i.childCount, c = o.node(-1), d = o.index(-1);
  if (!c.canReplace(d + (a ? 0 : 1), d + 1, s.content.append(l ? w.empty : w.from(i))))
    return !1;
  let f = o.pos, h = f + s.nodeSize;
  return n.step(new D(f - (a ? 1 : 0), h + (l ? 1 : 0), f + 1, h - 1, new v((a ? w.empty : w.from(i.copy(w.empty))).append(l ? w.empty : w.from(i.copy(w.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(n.scrollIntoView()), !0;
}
function ds(r) {
  return function(e, t) {
    let { $from: n, $to: i } = e.selection, o = n.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == r);
    if (!o)
      return !1;
    let s = o.startIndex;
    if (s == 0)
      return !1;
    let a = o.parent, l = a.child(s - 1);
    if (l.type != r)
      return !1;
    if (t) {
      let c = l.lastChild && l.lastChild.type == a.type, d = w.from(c ? r.create() : null), f = new v(w.from(r.create(null, w.from(a.type.create(null, d)))), c ? 3 : 1, 0), h = o.start, p = o.end;
      t(e.tr.step(new D(h - (c ? 3 : 1), p, h, p, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Rr(r) {
  const { state: e, transaction: t } = r;
  let { selection: n } = t, { doc: i } = t, { storedMarks: o } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return o;
    },
    get selection() {
      return n;
    },
    get doc() {
      return i;
    },
    get tr() {
      return n = t.selection, i = t.doc, o = t.storedMarks, t;
    }
  };
}
class us {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: n } = this, { view: i } = t, { tr: o } = n, s = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([a, l]) => [a, (...d) => {
      const f = l(...d)(s);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(o), f;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: n, editor: i, state: o } = this, { view: s } = i, a = [], l = !!e, c = e || o.tr, d = () => (!l && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c), a.every((h) => h === !0)), f = {
      ...Object.fromEntries(Object.entries(n).map(([h, p]) => [h, (...m) => {
        const b = this.buildProps(c, t), x = p(...m)(b);
        return a.push(x), f;
      }])),
      run: d
    };
    return f;
  }
  createCan(e) {
    const { rawCommands: t, state: n } = this, i = !1, o = e || n.tr, s = this.buildProps(o, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([l, c]) => [l, (...d) => c(...d)({ ...s, dispatch: void 0 })])),
      chain: () => this.createChain(o, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: n, editor: i, state: o } = this, { view: s } = i, a = {
      tr: e,
      editor: i,
      view: s,
      state: Rr({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(n).map(([l, c]) => [l, (...d) => c(...d)(a)]));
      }
    };
    return a;
  }
}
function _(r, e, t) {
  return r.config[e] === void 0 && r.parent ? _(r.parent, e, t) : typeof r.config[e] == "function" ? r.config[e].bind({
    ...t,
    parent: r.parent ? _(r.parent, e, t) : null
  }) : r.config[e];
}
function fs(r) {
  const e = r.filter((i) => i.type === "extension"), t = r.filter((i) => i.type === "node"), n = r.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: n
  };
}
function P(r, e) {
  if (typeof r == "string") {
    if (!e.nodes[r])
      throw Error(`There is no node type named '${r}'. Maybe you forgot to add the extension?`);
    return e.nodes[r];
  }
  return r;
}
function zr(...r) {
  return r.filter((e) => !!e).reduce((e, t) => {
    const n = { ...e };
    return Object.entries(t).forEach(([i, o]) => {
      if (!n[i]) {
        n[i] = o;
        return;
      }
      if (i === "class") {
        const a = o ? String(o).split(" ") : [], l = n[i] ? n[i].split(" ") : [], c = a.filter((d) => !l.includes(d));
        n[i] = [...l, ...c].join(" ");
      } else if (i === "style") {
        const a = o ? o.split(";").map((d) => d.trim()).filter(Boolean) : [], l = n[i] ? n[i].split(";").map((d) => d.trim()).filter(Boolean) : [], c = /* @__PURE__ */ new Map();
        l.forEach((d) => {
          const [f, h] = d.split(":").map((p) => p.trim());
          c.set(f, h);
        }), a.forEach((d) => {
          const [f, h] = d.split(":").map((p) => p.trim());
          c.set(f, h);
        }), n[i] = Array.from(c.entries()).map(([d, f]) => `${d}: ${f}`).join("; ");
      } else
        n[i] = o;
    }), n;
  }, {});
}
function hs(r, e) {
  return e.filter((t) => t.type === r.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(r.attrs) || {} : {
    [t.name]: r.attrs[t.name]
  }).reduce((t, n) => zr(t, n), {});
}
function ps(r) {
  return typeof r == "function";
}
function q(r, e = void 0, ...t) {
  return ps(r) ? e ? r.bind(e)(...t) : r(...t) : r;
}
function ms(r) {
  return Object.prototype.toString.call(r) === "[object RegExp]";
}
function gs(r) {
  return Object.prototype.toString.call(r).slice(8, -1);
}
function qe(r) {
  return gs(r) !== "Object" ? !1 : r.constructor === Object && Object.getPrototypeOf(r) === Object.prototype;
}
function Gt(r, e) {
  const t = { ...r };
  return qe(r) && qe(e) && Object.keys(e).forEach((n) => {
    qe(e[n]) && qe(r[n]) ? t[n] = Gt(r[n], e[n]) : t[n] = e[n];
  }), t;
}
class W {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = q(_(this, "addOptions", {
      name: this.name
    }))), this.storage = q(_(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new W(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Gt(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new W({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = q(_(t, "addOptions", {
      name: t.name
    })), t.storage = q(_(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function ys(r, e, t) {
  const { from: n, to: i } = e, { blockSeparator: o = `

`, textSerializers: s = {} } = t || {};
  let a = "";
  return r.nodesBetween(n, i, (l, c, d, f) => {
    var h;
    l.isBlock && c > n && (a += o);
    const p = s == null ? void 0 : s[l.type.name];
    if (p)
      return d && (a += p({
        node: l,
        pos: c,
        parent: d,
        index: f,
        range: e
      })), !1;
    l.isText && (a += (h = l == null ? void 0 : l.text) === null || h === void 0 ? void 0 : h.slice(Math.max(n, c) - c, i - c));
  }), a;
}
function bs(r) {
  return Object.fromEntries(Object.entries(r.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
W.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ce("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: r } = this, { state: e, schema: t } = r, { doc: n, selection: i } = e, { ranges: o } = i, s = Math.min(...o.map((d) => d.$from.pos)), a = Math.max(...o.map((d) => d.$to.pos)), l = bs(t);
            return ys(n, { from: s, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
});
const ws = () => ({ editor: r, view: e }) => (requestAnimationFrame(() => {
  var t;
  r.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), xs = (r = !1) => ({ commands: e }) => e.setContent("", r), vs = () => ({ state: r, tr: e, dispatch: t }) => {
  const { selection: n } = e, { ranges: i } = n;
  return t && i.forEach(({ $from: o, $to: s }) => {
    r.doc.nodesBetween(o.pos, s.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: d } = e, f = c.resolve(d.map(l)), h = c.resolve(d.map(l + a.nodeSize)), p = f.blockRange(h);
      if (!p)
        return;
      const g = xe(p);
      if (a.type.isTextblock) {
        const { defaultType: m } = f.parent.contentMatchAt(f.index());
        e.setNodeMarkup(p.start, m);
      }
      (g || g === 0) && e.lift(p, g);
    });
  }), !0;
}, ks = (r) => (e) => r(e), Ss = () => ({ state: r, dispatch: e }) => Tr(r, e), Cs = (r, e) => ({ editor: t, tr: n }) => {
  const { state: i } = t, o = i.doc.slice(r.from, r.to);
  n.deleteRange(r.from, r.to);
  const s = n.mapping.map(e);
  return n.insert(s, o.content), n.setSelection(new T(n.doc.resolve(Math.max(s - 1, 0)))), !0;
}, Es = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, n = t.$anchor.node();
  if (n.content.size > 0)
    return !1;
  const i = r.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === n.type) {
      if (e) {
        const a = i.before(o), l = i.after(o);
        r.delete(a, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Ns = (r) => ({ tr: e, state: t, dispatch: n }) => {
  const i = P(r, t.schema), o = e.selection.$anchor;
  for (let s = o.depth; s > 0; s -= 1)
    if (o.node(s).type === i) {
      if (n) {
        const l = o.before(s), c = o.after(s);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, As = (r) => ({ tr: e, dispatch: t }) => {
  const { from: n, to: i } = r;
  return t && e.delete(n, i), !0;
}, Ts = () => ({ state: r, dispatch: e }) => Vt(r, e), Is = () => ({ commands: r }) => r.keyboardShortcut("Enter"), Ms = () => ({ state: r, dispatch: e }) => Ko(r, e);
function at(r, e, t = { strict: !0 }) {
  const n = Object.keys(e);
  return n.length ? n.every((i) => t.strict ? e[i] === r[i] : ms(e[i]) ? e[i].test(r[i]) : e[i] === r[i]) : !0;
}
function Lr(r, e, t = {}) {
  return r.find((n) => n.type === e && at(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, n.attrs[i]])),
    t
  ));
}
function Tn(r, e, t = {}) {
  return !!Lr(r, e, t);
}
function Pr(r, e, t) {
  var n;
  if (!r || !e)
    return;
  let i = r.parent.childAfter(r.parentOffset);
  if ((!i.node || !i.node.marks.some((d) => d.type === e)) && (i = r.parent.childBefore(r.parentOffset)), !i.node || !i.node.marks.some((d) => d.type === e) || (t = t || ((n = i.node.marks[0]) === null || n === void 0 ? void 0 : n.attrs), !Lr([...i.node.marks], e, t)))
    return;
  let s = i.index, a = r.start() + i.offset, l = s + 1, c = a + i.node.nodeSize;
  for (; s > 0 && Tn([...r.parent.child(s - 1).marks], e, t); )
    s -= 1, a -= r.parent.child(s).nodeSize;
  for (; l < r.parent.childCount && Tn([...r.parent.child(l).marks], e, t); )
    c += r.parent.child(l).nodeSize, l += 1;
  return {
    from: a,
    to: c
  };
}
function Q(r, e) {
  if (typeof r == "string") {
    if (!e.marks[r])
      throw Error(`There is no mark type named '${r}'. Maybe you forgot to add the extension?`);
    return e.marks[r];
  }
  return r;
}
const Os = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  const o = Q(r, n.schema), { doc: s, selection: a } = t, { $from: l, from: c, to: d } = a;
  if (i) {
    const f = Pr(l, o, e);
    if (f && f.from <= c && f.to >= d) {
      const h = T.create(s, f.from, f.to);
      t.setSelection(h);
    }
  }
  return !0;
}, Rs = (r) => (e) => {
  const t = typeof r == "function" ? r(e) : r;
  for (let n = 0; n < t.length; n += 1)
    if (t[n](e))
      return !0;
  return !1;
};
function Br(r) {
  return r instanceof T;
}
function ne(r = 0, e = 0, t = 0) {
  return Math.min(Math.max(r, e), t);
}
function zs(r, e = null) {
  if (!e)
    return null;
  const t = S.atStart(r), n = S.atEnd(r);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return n;
  const i = t.from, o = n.to;
  return e === "all" ? T.create(r, ne(0, i, o), ne(r.content.size, i, o)) : T.create(r, ne(e, i, o), ne(e, i, o));
}
function zt() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Fe() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function Ls() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
const Ps = (r = null, e = {}) => ({ editor: t, view: n, tr: i, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const s = () => {
    (Fe() || zt()) && n.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (n.focus(), Ls() && !Fe() && !zt() && n.dom.focus({ preventScroll: !0 }));
    });
  };
  if (n.hasFocus() && r === null || r === !1)
    return !0;
  if (o && r === null && !Br(t.state.selection))
    return s(), !0;
  const a = zs(i.doc, r) || t.state.selection, l = t.state.selection.eq(a);
  return o && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), s()), !0;
}, Bs = (r, e) => (t) => r.every((n, i) => e(n, { ...t, index: i })), js = (r, e) => ({ tr: t, commands: n }) => n.insertContentAt({ from: t.selection.from, to: t.selection.to }, r, e), jr = (r) => {
  const e = r.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const n = e[t];
    n.nodeType === 3 && n.nodeValue && /^(\n\s\s|\n)$/.test(n.nodeValue) ? r.removeChild(n) : n.nodeType === 1 && jr(n);
  }
  return r;
};
function Ke(r) {
  const e = `<body>${r}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return jr(t);
}
function De(r, e, t) {
  if (r instanceof oe || r instanceof w)
    return r;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const n = typeof r == "object" && r !== null, i = typeof r == "string";
  if (n)
    try {
      if (Array.isArray(r) && r.length > 0)
        return w.fromArray(r.map((a) => e.nodeFromJSON(a)));
      const s = e.nodeFromJSON(r);
      return t.errorOnInvalidContent && s.check(), s;
    } catch (o) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: o });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", r, "Error:", o), De("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let s = !1, a = "";
      const l = new Ao({
        topNode: e.spec.topNode,
        marks: e.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: e.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (c) => (s = !0, a = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? he.fromSchema(l).parseSlice(Ke(r), t.parseOptions) : he.fromSchema(l).parse(Ke(r), t.parseOptions), t.errorOnInvalidContent && s)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${a}`) });
    }
    const o = he.fromSchema(e);
    return t.slice ? o.parseSlice(Ke(r), t.parseOptions).content : o.parse(Ke(r), t.parseOptions);
  }
  return De("", e, t);
}
function Fs(r, e, t) {
  const n = r.steps.length - 1;
  if (n < e)
    return;
  const i = r.steps[n];
  if (!(i instanceof j || i instanceof D))
    return;
  const o = r.mapping.maps[n];
  let s = 0;
  o.forEach((a, l, c, d) => {
    s === 0 && (s = d);
  }), r.setSelection(S.near(r.doc.resolve(s), t));
}
const Ds = (r) => !("type" in r), $s = (r, e, t) => ({ tr: n, dispatch: i, editor: o }) => {
  var s;
  if (i) {
    t = {
      parseOptions: o.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let a;
    const l = (b) => {
      o.emit("contentError", {
        editor: o,
        error: b,
        disableCollaboration: () => {
          o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
        }
      });
    }, c = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError)
      try {
        De(e, o.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (b) {
        l(b);
      }
    try {
      a = De(e, o.schema, {
        parseOptions: c,
        errorOnInvalidContent: (s = t.errorOnInvalidContent) !== null && s !== void 0 ? s : o.options.enableContentCheck
      });
    } catch (b) {
      return l(b), !1;
    }
    let { from: d, to: f } = typeof r == "number" ? { from: r, to: r } : { from: r.from, to: r.to }, h = !0, p = !0;
    if ((Ds(a) ? a : [a]).forEach((b) => {
      b.check(), h = h ? b.isText && b.marks.length === 0 : !1, p = p ? b.isBlock : !1;
    }), d === f && p) {
      const { parent: b } = n.doc.resolve(d);
      b.isTextblock && !b.type.spec.code && !b.childCount && (d -= 1, f += 1);
    }
    let m;
    if (h) {
      if (Array.isArray(e))
        m = e.map((b) => b.text || "").join("");
      else if (e instanceof w) {
        let b = "";
        e.forEach((x) => {
          x.text && (b += x.text);
        }), m = b;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      n.insertText(m, d, f);
    } else
      m = a, n.replaceWith(d, f, m);
    t.updateSelection && Fs(n, n.steps.length - 1, -1), t.applyInputRules && n.setMeta("applyInputRules", { from: d, text: m }), t.applyPasteRules && n.setMeta("applyPasteRules", { from: d, text: m });
  }
  return !0;
}, Us = () => ({ state: r, dispatch: e }) => Wo(r, e), Vs = () => ({ state: r, dispatch: e }) => Go(r, e), Hs = () => ({ state: r, dispatch: e }) => vr(r, e), Js = () => ({ state: r, dispatch: e }) => Er(r, e), _s = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = pt(r.doc, r.selection.$from.pos, -1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Ws = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = pt(r.doc, r.selection.$from.pos, 1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Gs = () => ({ state: r, dispatch: e }) => Jo(r, e), qs = () => ({ state: r, dispatch: e }) => _o(r, e);
function Fr() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Ks(r) {
  const e = r.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let n, i, o, s;
  for (let a = 0; a < e.length - 1; a += 1) {
    const l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      s = !0;
    else if (/^a(lt)?$/i.test(l))
      n = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      o = !0;
    else if (/^mod$/i.test(l))
      Fe() || Fr() ? s = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return n && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), s && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const Ys = (r) => ({ editor: e, view: t, tr: n, dispatch: i }) => {
  const o = Ks(r).split(/-(?!$)/), s = o.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
    key: s === "Space" ? " " : s,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, a));
  });
  return l == null || l.steps.forEach((c) => {
    const d = c.map(n.mapping);
    d && i && n.maybeStep(d);
  }), !0;
};
function qt(r, e, t = {}) {
  const { from: n, to: i, empty: o } = r.selection, s = e ? P(e, r.schema) : null, a = [];
  r.doc.nodesBetween(n, i, (f, h) => {
    if (f.isText)
      return;
    const p = Math.max(n, h), g = Math.min(i, h + f.nodeSize);
    a.push({
      node: f,
      from: p,
      to: g
    });
  });
  const l = i - n, c = a.filter((f) => s ? s.name === f.node.type.name : !0).filter((f) => at(f.node.attrs, t, { strict: !1 }));
  return o ? !!c.length : c.reduce((f, h) => f + h.to - h.from, 0) >= l;
}
const Xs = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const i = P(r, t.schema);
  return qt(t, i, e) ? qo(t, n) : !1;
}, Qs = () => ({ state: r, dispatch: e }) => Ir(r, e), Zs = (r) => ({ state: e, dispatch: t }) => {
  const n = P(r, e.schema);
  return as(n)(e, t);
}, ea = () => ({ state: r, dispatch: e }) => Ar(r, e);
function Dr(r, e) {
  return e.nodes[r] ? "node" : e.marks[r] ? "mark" : null;
}
function In(r, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(r).reduce((n, i) => (t.includes(i) || (n[i] = r[i]), n), {});
}
const ta = (r, e) => ({ tr: t, state: n, dispatch: i }) => {
  let o = null, s = null;
  const a = Dr(typeof r == "string" ? r : r.name, n.schema);
  return a ? (a === "node" && (o = P(r, n.schema)), a === "mark" && (s = Q(r, n.schema)), i && t.selection.ranges.forEach((l) => {
    n.doc.nodesBetween(l.$from.pos, l.$to.pos, (c, d) => {
      o && o === c.type && t.setNodeMarkup(d, void 0, In(c.attrs, e)), s && c.marks.length && c.marks.forEach((f) => {
        s === f.type && t.addMark(d, d + c.nodeSize, s.create(In(f.attrs, e)));
      });
    });
  }), !0) : !1;
}, na = () => ({ tr: r, dispatch: e }) => (e && r.scrollIntoView(), !0), ra = () => ({ tr: r, dispatch: e }) => {
  if (e) {
    const t = new V(r.doc);
    r.setSelection(t);
  }
  return !0;
}, ia = () => ({ state: r, dispatch: e }) => Sr(r, e), oa = () => ({ state: r, dispatch: e }) => Nr(r, e), sa = () => ({ state: r, dispatch: e }) => Qo(r, e), aa = () => ({ state: r, dispatch: e }) => ts(r, e), la = () => ({ state: r, dispatch: e }) => es(r, e);
function ca(r, e, t = {}, n = {}) {
  return De(r, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: n.errorOnInvalidContent
  });
}
const da = (r, e = !1, t = {}, n = {}) => ({ editor: i, tr: o, dispatch: s, commands: a }) => {
  var l, c;
  const { doc: d } = o;
  if (t.preserveWhitespace !== "full") {
    const f = ca(r, i.schema, t, {
      errorOnInvalidContent: (l = n.errorOnInvalidContent) !== null && l !== void 0 ? l : i.options.enableContentCheck
    });
    return s && o.replaceWith(0, d.content.size, f).setMeta("preventUpdate", !e), !0;
  }
  return s && o.setMeta("preventUpdate", !e), a.insertContentAt({ from: 0, to: d.content.size }, r, {
    parseOptions: t,
    errorOnInvalidContent: (c = n.errorOnInvalidContent) !== null && c !== void 0 ? c : i.options.enableContentCheck
  });
};
function ua(r, e) {
  const t = Q(e, r.schema), { from: n, to: i, empty: o } = r.selection, s = [];
  o ? (r.storedMarks && s.push(...r.storedMarks), s.push(...r.selection.$head.marks())) : r.doc.nodesBetween(n, i, (l) => {
    s.push(...l.marks);
  });
  const a = s.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function fa(r) {
  for (let e = 0; e < r.edgeCount; e += 1) {
    const { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function ha(r, e) {
  for (let t = r.depth; t > 0; t -= 1) {
    const n = r.node(t);
    if (e(n))
      return {
        pos: t > 0 ? r.before(t) : 0,
        start: r.start(t),
        depth: t,
        node: n
      };
  }
}
function Kt(r) {
  return (e) => ha(e.$from, r);
}
function Xe(r, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => {
    const i = r.find((o) => o.type === e && o.name === n);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function pa(r, e, t = {}) {
  const { empty: n, ranges: i } = r.selection, o = e ? Q(e, r.schema) : null;
  if (n)
    return !!(r.storedMarks || r.selection.$from.marks()).filter((f) => o ? o.name === f.type.name : !0).find((f) => at(f.attrs, t, { strict: !1 }));
  let s = 0;
  const a = [];
  if (i.forEach(({ $from: f, $to: h }) => {
    const p = f.pos, g = h.pos;
    r.doc.nodesBetween(p, g, (m, b) => {
      if (!m.isText && !m.marks.length)
        return;
      const x = Math.max(p, b), A = Math.min(g, b + m.nodeSize), k = A - x;
      s += k, a.push(...m.marks.map((E) => ({
        mark: E,
        from: x,
        to: A
      })));
    });
  }), s === 0)
    return !1;
  const l = a.filter((f) => o ? o.name === f.mark.type.name : !0).filter((f) => at(f.mark.attrs, t, { strict: !1 })).reduce((f, h) => f + h.to - h.from, 0), c = a.filter((f) => o ? f.mark.type !== o && f.mark.type.excludes(o) : !0).reduce((f, h) => f + h.to - h.from, 0);
  return (l > 0 ? l + c : l) >= s;
}
function Mn(r, e) {
  const { nodeExtensions: t } = fs(e), n = t.find((s) => s.name === r);
  if (!n)
    return !1;
  const i = {
    name: n.name,
    options: n.options,
    storage: n.storage
  }, o = q(_(n, "group", i));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function $r(r, { checkChildren: e = !0, ignoreWhitespace: t = !1 } = {}) {
  var n;
  if (t) {
    if (r.type.name === "hardBreak")
      return !0;
    if (r.isText)
      return /^\s*$/m.test((n = r.text) !== null && n !== void 0 ? n : "");
  }
  if (r.isText)
    return !r.text;
  if (r.isAtom || r.isLeaf)
    return !1;
  if (r.content.childCount === 0)
    return !0;
  if (e) {
    let i = !0;
    return r.content.forEach((o) => {
      i !== !1 && ($r(o, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
function ma(r, e, t) {
  var n;
  const { selection: i } = e;
  let o = null;
  if (Br(i) && (o = i.$cursor), o) {
    const a = (n = r.storedMarks) !== null && n !== void 0 ? n : o.marks();
    return !!t.isInSet(a) || !a.some((l) => l.type.excludes(t));
  }
  const { ranges: s } = i;
  return s.some(({ $from: a, $to: l }) => {
    let c = a.depth === 0 ? r.doc.inlineContent && r.doc.type.allowsMarkType(t) : !1;
    return r.doc.nodesBetween(a.pos, l.pos, (d, f, h) => {
      if (c)
        return !1;
      if (d.isInline) {
        const p = !h || h.type.allowsMarkType(t), g = !!t.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(t));
        c = p && g;
      }
      return !c;
    }), c;
  });
}
const ga = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  const { selection: o } = t, { empty: s, ranges: a } = o, l = Q(r, n.schema);
  if (i)
    if (s) {
      const c = ua(n, l);
      t.addStoredMark(l.create({
        ...c,
        ...e
      }));
    } else
      a.forEach((c) => {
        const d = c.$from.pos, f = c.$to.pos;
        n.doc.nodesBetween(d, f, (h, p) => {
          const g = Math.max(p, d), m = Math.min(p + h.nodeSize, f);
          h.marks.find((x) => x.type === l) ? h.marks.forEach((x) => {
            l === x.type && t.addMark(g, m, l.create({
              ...x.attrs,
              ...e
            }));
          }) : t.addMark(g, m, l.create(e));
        });
      });
  return ma(n, t, l);
}, ya = (r, e) => ({ tr: t }) => (t.setMeta(r, e), !0), ba = (r, e = {}) => ({ state: t, dispatch: n, chain: i }) => {
  const o = P(r, t.schema);
  let s;
  return t.selection.$anchor.sameParent(t.selection.$head) && (s = t.selection.$anchor.parent.attrs), o.isTextblock ? i().command(({ commands: a }) => An(o, { ...s, ...e })(t) ? !0 : a.clearNodes()).command(({ state: a }) => An(o, { ...s, ...e })(a, n)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, wa = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, i = ne(r, 0, n.content.size), o = C.create(n, i);
    e.setSelection(o);
  }
  return !0;
}, xa = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, { from: i, to: o } = typeof r == "number" ? { from: r, to: r } : r, s = T.atStart(n).from, a = T.atEnd(n).to, l = ne(i, s, a), c = ne(o, s, a), d = T.create(n, l, c);
    e.setSelection(d);
  }
  return !0;
}, va = (r) => ({ state: e, dispatch: t }) => {
  const n = P(r, e.schema);
  return ds(n)(e, t);
};
function On(r, e) {
  const t = r.storedMarks || r.selection.$to.parentOffset && r.selection.$from.marks();
  if (t) {
    const n = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    r.tr.ensureMarks(n);
  }
}
const ka = ({ keepMarks: r = !0 } = {}) => ({ tr: e, state: t, dispatch: n, editor: i }) => {
  const { selection: o, doc: s } = e, { $from: a, $to: l } = o, c = i.extensionManager.attributes, d = Xe(c, a.node().type.name, a.node().attrs);
  if (o instanceof C && o.node.isBlock)
    return !a.parentOffset || !K(s, a.pos) ? !1 : (n && (r && On(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const f = l.parentOffset === l.parent.content.size, h = a.depth === 0 ? void 0 : fa(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let p = f && h ? [
    {
      type: h,
      attrs: d
    }
  ] : void 0, g = K(e.doc, e.mapping.map(a.pos), 1, p);
  if (!p && !g && K(e.doc, e.mapping.map(a.pos), 1, h ? [{ type: h }] : void 0) && (g = !0, p = h ? [
    {
      type: h,
      attrs: d
    }
  ] : void 0), n) {
    if (g && (o instanceof T && e.deleteSelection(), e.split(e.mapping.map(a.pos), 1, p), h && !f && !a.parentOffset && a.parent.type !== h)) {
      const m = e.mapping.map(a.before()), b = e.doc.resolve(m);
      a.node(-1).canReplaceWith(b.index(), b.index() + 1, h) && e.setNodeMarkup(e.mapping.map(a.before()), h);
    }
    r && On(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return g;
}, Sa = (r, e = {}) => ({ tr: t, state: n, dispatch: i, editor: o }) => {
  var s;
  const a = P(r, n.schema), { $from: l, $to: c } = n.selection, d = n.selection.node;
  if (d && d.isBlock || l.depth < 2 || !l.sameParent(c))
    return !1;
  const f = l.node(-1);
  if (f.type !== a)
    return !1;
  const h = o.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== a || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (i) {
      let x = w.empty;
      const A = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let J = l.depth - A; J >= l.depth - 3; J -= 1)
        x = w.from(l.node(J).copy(x));
      const k = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, E = {
        ...Xe(h, l.node().type.name, l.node().attrs),
        ...e
      }, I = ((s = a.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(E)) || void 0;
      x = x.append(w.from(a.createAndFill(null, I) || void 0));
      const M = l.before(l.depth - (A - 1));
      t.replace(M, l.after(-k), new v(x, 4 - A, 0));
      let $ = -1;
      t.doc.nodesBetween(M, t.doc.content.size, (J, Jr) => {
        if ($ > -1)
          return !1;
        J.isTextblock && J.content.size === 0 && ($ = Jr + 1);
      }), $ > -1 && t.setSelection(T.near(t.doc.resolve($))), t.scrollIntoView();
    }
    return !0;
  }
  const p = c.pos === l.end() ? f.contentMatchAt(0).defaultType : null, g = {
    ...Xe(h, f.type.name, f.attrs),
    ...e
  }, m = {
    ...Xe(h, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const b = p ? [
    { type: a, attrs: g },
    { type: p, attrs: m }
  ] : [{ type: a, attrs: g }];
  if (!K(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: x, storedMarks: A } = n, { splittableMarks: k } = o.extensionManager, E = A || x.$to.parentOffset && x.$from.marks();
    if (t.split(l.pos, 2, b).scrollIntoView(), !E || !i)
      return !0;
    const I = E.filter((M) => k.includes(M.type.name));
    t.ensureMarks(I);
  }
  return !0;
}, Et = (r, e) => {
  const t = Kt((s) => s.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (n === void 0)
    return !0;
  const i = r.doc.nodeAt(n);
  return t.node.type === (i == null ? void 0 : i.type) && ae(r.doc, t.pos) && r.join(t.pos), !0;
}, Nt = (r, e) => {
  const t = Kt((s) => s.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(t.start).after(t.depth);
  if (n === void 0)
    return !0;
  const i = r.doc.nodeAt(n);
  return t.node.type === (i == null ? void 0 : i.type) && ae(r.doc, n) && r.join(n), !0;
}, Ca = (r, e, t, n = {}) => ({ editor: i, tr: o, state: s, dispatch: a, chain: l, commands: c, can: d }) => {
  const { extensions: f, splittableMarks: h } = i.extensionManager, p = P(r, s.schema), g = P(e, s.schema), { selection: m, storedMarks: b } = s, { $from: x, $to: A } = m, k = x.blockRange(A), E = b || m.$to.parentOffset && m.$from.marks();
  if (!k)
    return !1;
  const I = Kt((M) => Mn(M.type.name, f))(m);
  if (k.depth >= 1 && I && k.depth - I.depth <= 1) {
    if (I.node.type === p)
      return c.liftListItem(g);
    if (Mn(I.node.type.name, f) && p.validContent(I.node.content) && a)
      return l().command(() => (o.setNodeMarkup(I.pos, p), !0)).command(() => Et(o, p)).command(() => Nt(o, p)).run();
  }
  return !t || !E || !a ? l().command(() => d().wrapInList(p, n) ? !0 : c.clearNodes()).wrapInList(p, n).command(() => Et(o, p)).command(() => Nt(o, p)).run() : l().command(() => {
    const M = d().wrapInList(p, n), $ = E.filter((J) => h.includes(J.type.name));
    return o.ensureMarks($), M ? !0 : c.clearNodes();
  }).wrapInList(p, n).command(() => Et(o, p)).command(() => Nt(o, p)).run();
}, Ea = (r, e = {}, t = {}) => ({ state: n, commands: i }) => {
  const { extendEmptyMarkRange: o = !1 } = t, s = Q(r, n.schema);
  return pa(n, s, e) ? i.unsetMark(s, { extendEmptyMarkRange: o }) : i.setMark(s, e);
}, Na = (r, e, t = {}) => ({ state: n, commands: i }) => {
  const o = P(r, n.schema), s = P(e, n.schema), a = qt(n, o, t);
  let l;
  return n.selection.$anchor.sameParent(n.selection.$head) && (l = n.selection.$anchor.parent.attrs), a ? i.setNode(s, l) : i.setNode(o, { ...l, ...t });
}, Aa = (r, e = {}) => ({ state: t, commands: n }) => {
  const i = P(r, t.schema);
  return qt(t, i, e) ? n.lift(i) : n.wrapIn(i, e);
}, Ta = () => ({ state: r, dispatch: e }) => {
  const t = r.plugins;
  for (let n = 0; n < t.length; n += 1) {
    const i = t[n];
    let o;
    if (i.spec.isInputRules && (o = i.getState(r))) {
      if (e) {
        const s = r.tr, a = o.transform;
        for (let l = a.steps.length - 1; l >= 0; l -= 1)
          s.step(a.steps[l].invert(a.docs[l]));
        if (o.text) {
          const l = s.doc.resolve(o.from).marks();
          s.replaceWith(o.from, o.to, r.schema.text(o.text, l));
        } else
          s.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, Ia = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, { empty: n, ranges: i } = t;
  return n || e && i.forEach((o) => {
    r.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, Ma = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  var o;
  const { extendEmptyMarkRange: s = !1 } = e, { selection: a } = t, l = Q(r, n.schema), { $from: c, empty: d, ranges: f } = a;
  if (!i)
    return !0;
  if (d && s) {
    let { from: h, to: p } = a;
    const g = (o = c.marks().find((b) => b.type === l)) === null || o === void 0 ? void 0 : o.attrs, m = Pr(c, l, g);
    m && (h = m.from, p = m.to), t.removeMark(h, p, l);
  } else
    f.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, Oa = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  let o = null, s = null;
  const a = Dr(typeof r == "string" ? r : r.name, n.schema);
  return a ? (a === "node" && (o = P(r, n.schema)), a === "mark" && (s = Q(r, n.schema)), i && t.selection.ranges.forEach((l) => {
    const c = l.$from.pos, d = l.$to.pos;
    let f, h, p, g;
    t.selection.empty ? n.doc.nodesBetween(c, d, (m, b) => {
      o && o === m.type && (p = Math.max(b, c), g = Math.min(b + m.nodeSize, d), f = b, h = m);
    }) : n.doc.nodesBetween(c, d, (m, b) => {
      b < c && o && o === m.type && (p = Math.max(b, c), g = Math.min(b + m.nodeSize, d), f = b, h = m), b >= c && b <= d && (o && o === m.type && t.setNodeMarkup(b, void 0, {
        ...m.attrs,
        ...e
      }), s && m.marks.length && m.marks.forEach((x) => {
        if (s === x.type) {
          const A = Math.max(b, c), k = Math.min(b + m.nodeSize, d);
          t.addMark(A, k, s.create({
            ...x.attrs,
            ...e
          }));
        }
      }));
    }), h && (f !== void 0 && t.setNodeMarkup(f, void 0, {
      ...h.attrs,
      ...e
    }), s && h.marks.length && h.marks.forEach((m) => {
      s === m.type && t.addMark(p, g, s.create({
        ...m.attrs,
        ...e
      }));
    }));
  }), !0) : !1;
}, Ra = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const i = P(r, t.schema);
  return ns(i, e)(t, n);
}, za = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const i = P(r, t.schema);
  return rs(i, e)(t, n);
};
var La = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: ws,
  clearContent: xs,
  clearNodes: vs,
  command: ks,
  createParagraphNear: Ss,
  cut: Cs,
  deleteCurrentNode: Es,
  deleteNode: Ns,
  deleteRange: As,
  deleteSelection: Ts,
  enter: Is,
  exitCode: Ms,
  extendMarkRange: Os,
  first: Rs,
  focus: Ps,
  forEach: Bs,
  insertContent: js,
  insertContentAt: $s,
  joinBackward: Hs,
  joinDown: Vs,
  joinForward: Js,
  joinItemBackward: _s,
  joinItemForward: Ws,
  joinTextblockBackward: Gs,
  joinTextblockForward: qs,
  joinUp: Us,
  keyboardShortcut: Ys,
  lift: Xs,
  liftEmptyBlock: Qs,
  liftListItem: Zs,
  newlineInCode: ea,
  resetAttributes: ta,
  scrollIntoView: na,
  selectAll: ra,
  selectNodeBackward: ia,
  selectNodeForward: oa,
  selectParentNode: sa,
  selectTextblockEnd: aa,
  selectTextblockStart: la,
  setContent: da,
  setMark: ga,
  setMeta: ya,
  setNode: ba,
  setNodeSelection: wa,
  setTextSelection: xa,
  sinkListItem: va,
  splitBlock: ka,
  splitListItem: Sa,
  toggleList: Ca,
  toggleMark: Ea,
  toggleNode: Na,
  toggleWrap: Aa,
  undoInputRule: Ta,
  unsetAllMarks: Ia,
  unsetMark: Ma,
  updateAttributes: Oa,
  wrapIn: Ra,
  wrapInList: za
});
W.create({
  name: "commands",
  addCommands() {
    return {
      ...La
    };
  }
});
W.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ce("tiptapDrop"),
        props: {
          handleDrop: (r, e, t, n) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: e,
              slice: t,
              moved: n
            });
          }
        }
      })
    ];
  }
});
W.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ce("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const Pa = new ce("focusEvents");
W.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: r } = this;
    return [
      new le({
        key: Pa,
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              r.isFocused = !0;
              const n = r.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(n), !1;
            },
            blur: (e, t) => {
              r.isFocused = !1;
              const n = r.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(n), !1;
            }
          }
        }
      })
    ];
  }
});
W.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const r = () => this.editor.commands.first(({ commands: s }) => [
      () => s.undoInputRule(),
      // maybe convert first text block node to default node
      () => s.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: d, $anchor: f } = l, { pos: h, parent: p } = f, g = f.parent.isTextblock && h > 0 ? a.doc.resolve(h - 1) : f, m = g.parent.type.spec.isolating, b = f.pos - f.parentOffset, x = m && g.parent.childCount === 1 ? b === f.pos : S.atStart(c).from === h;
        return !d || !p.type.isTextblock || p.textContent.length || !x || x && f.parent.type.name === "paragraph" ? !1 : s.clearNodes();
      }),
      () => s.deleteSelection(),
      () => s.joinBackward(),
      () => s.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: s }) => [
      () => s.deleteSelection(),
      () => s.deleteCurrentNode(),
      () => s.joinForward(),
      () => s.selectNodeForward()
    ]), n = {
      Enter: () => this.editor.commands.first(({ commands: s }) => [
        () => s.newlineInCode(),
        () => s.createParagraphNear(),
        () => s.liftEmptyBlock(),
        () => s.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: r,
      "Mod-Backspace": r,
      "Shift-Backspace": r,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...n
    }, o = {
      ...n,
      "Ctrl-h": r,
      "Alt-Backspace": r,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Fe() || Fr() ? o : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new le({
        key: new ce("clearDocument"),
        appendTransaction: (r, e, t) => {
          if (r.some((m) => m.getMeta("composition")))
            return;
          const n = r.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = r.some((m) => m.getMeta("preventClearDocument"));
          if (!n || i)
            return;
          const { empty: o, from: s, to: a } = e.selection, l = S.atStart(e.doc).from, c = S.atEnd(e.doc).to;
          if (o || !(s === l && a === c) || !$r(t.doc))
            return;
          const h = t.tr, p = Rr({
            state: t,
            transaction: h
          }), { commands: g } = new us({
            editor: this.editor,
            state: p
          });
          if (g.clearNodes(), !!h.steps.length)
            return h;
        }
      })
    ];
  }
});
W.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ce("tiptapPaste"),
        props: {
          handlePaste: (r, e, t) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: e,
              slice: t
            });
          }
        }
      })
    ];
  }
});
W.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ce("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class lt {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = q(_(this, "addOptions", {
      name: this.name
    }))), this.storage = q(_(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new lt(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Gt(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new lt(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = q(_(t, "addOptions", {
      name: t.name
    })), t.storage = q(_(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
let Ba = class {
  constructor(e, t, n) {
    this.isDragging = !1, this.component = e, this.editor = t.editor, this.options = {
      stopEvent: null,
      ignoreMutation: null,
      ...n
    }, this.extension = t.extension, this.node = t.node, this.decorations = t.decorations, this.innerDecorations = t.innerDecorations, this.view = t.view, this.HTMLAttributes = t.HTMLAttributes, this.getPos = t.getPos, this.mount();
  }
  mount() {
  }
  get dom() {
    return this.editor.view.dom;
  }
  get contentDOM() {
    return null;
  }
  onDragStart(e) {
    var t, n, i, o, s, a, l;
    const { view: c } = this.editor, d = e.target, f = d.nodeType === 3 ? (t = d.parentElement) === null || t === void 0 ? void 0 : t.closest("[data-drag-handle]") : d.closest("[data-drag-handle]");
    if (!this.dom || !((n = this.contentDOM) === null || n === void 0) && n.contains(d) || !f)
      return;
    let h = 0, p = 0;
    if (this.dom !== f) {
      const A = this.dom.getBoundingClientRect(), k = f.getBoundingClientRect(), E = (i = e.offsetX) !== null && i !== void 0 ? i : (o = e.nativeEvent) === null || o === void 0 ? void 0 : o.offsetX, I = (s = e.offsetY) !== null && s !== void 0 ? s : (a = e.nativeEvent) === null || a === void 0 ? void 0 : a.offsetY;
      h = k.x - A.x + E, p = k.y - A.y + I;
    }
    const g = this.dom.cloneNode(!0);
    (l = e.dataTransfer) === null || l === void 0 || l.setDragImage(g, h, p);
    const m = this.getPos();
    if (typeof m != "number")
      return;
    const b = C.create(c.state.doc, m), x = c.state.tr.setSelection(b);
    c.dispatch(x);
  }
  stopEvent(e) {
    var t;
    if (!this.dom)
      return !1;
    if (typeof this.options.stopEvent == "function")
      return this.options.stopEvent({ event: e });
    const n = e.target;
    if (!(this.dom.contains(n) && !(!((t = this.contentDOM) === null || t === void 0) && t.contains(n))))
      return !1;
    const o = e.type.startsWith("drag"), s = e.type === "drop";
    if ((["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(n.tagName) || n.isContentEditable) && !s && !o)
      return !0;
    const { isEditable: l } = this.editor, { isDragging: c } = this, d = !!this.node.type.spec.draggable, f = C.isSelectable(this.node), h = e.type === "copy", p = e.type === "paste", g = e.type === "cut", m = e.type === "mousedown";
    if (!d && f && o && e.target === this.dom && e.preventDefault(), d && o && !c && e.target === this.dom)
      return e.preventDefault(), !1;
    if (d && l && !c && m) {
      const b = n.closest("[data-drag-handle]");
      b && (this.dom === b || this.dom.contains(b)) && (this.isDragging = !0, document.addEventListener("dragend", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("drop", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("mouseup", () => {
        this.isDragging = !1;
      }, { once: !0 }));
    }
    return !(c || s || h || p || g || m && f);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(e) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.dom.contains(e.target) && e.type === "childList" && (Fe() || zt()) && this.editor.isFocused && [
      ...Array.from(e.addedNodes),
      ...Array.from(e.removedNodes)
    ].every((n) => n.isContentEditable) ? !1 : this.contentDOM === e.target && e.type === "attributes" ? !0 : !this.contentDOM.contains(e.target);
  }
  /**
   * Update the attributes of the prosemirror node.
   */
  updateAttributes(e) {
    this.editor.commands.command(({ tr: t }) => {
      const n = this.getPos();
      return typeof n != "number" ? !1 : (t.setNodeMarkup(n, void 0, {
        ...this.node.attrs,
        ...e
      }), !0);
    });
  }
  /**
   * Delete the node.
   */
  deleteNode() {
    const e = this.getPos();
    if (typeof e != "number")
      return;
    const t = e + this.node.nodeSize;
    this.editor.commands.deleteRange({ from: e, to: t });
  }
};
var Ur = { exports: {} }, At = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rn;
function ja() {
  if (Rn) return At;
  Rn = 1;
  var r = L;
  function e(f, h) {
    return f === h && (f !== 0 || 1 / f === 1 / h) || f !== f && h !== h;
  }
  var t = typeof Object.is == "function" ? Object.is : e, n = r.useState, i = r.useEffect, o = r.useLayoutEffect, s = r.useDebugValue;
  function a(f, h) {
    var p = h(), g = n({ inst: { value: p, getSnapshot: h } }), m = g[0].inst, b = g[1];
    return o(function() {
      m.value = p, m.getSnapshot = h, l(m) && b({ inst: m });
    }, [f, p, h]), i(function() {
      return l(m) && b({ inst: m }), f(function() {
        l(m) && b({ inst: m });
      });
    }, [f]), s(p), p;
  }
  function l(f) {
    var h = f.getSnapshot;
    f = f.value;
    try {
      var p = h();
      return !t(f, p);
    } catch {
      return !0;
    }
  }
  function c(f, h) {
    return h();
  }
  var d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : a;
  return At.useSyncExternalStore = r.useSyncExternalStore !== void 0 ? r.useSyncExternalStore : d, At;
}
Ur.exports = ja();
var Vr = Ur.exports;
const Fa = (...r) => (e) => {
  r.forEach((t) => {
    typeof t == "function" ? t(e) : t && (t.current = e);
  });
}, Da = ({ contentComponent: r }) => {
  const e = Vr.useSyncExternalStore(r.subscribe, r.getSnapshot, r.getServerSnapshot);
  return L.createElement(L.Fragment, null, Object.values(e));
};
function $a() {
  const r = /* @__PURE__ */ new Set();
  let e = {};
  return {
    /**
     * Subscribe to the editor instance's changes.
     */
    subscribe(t) {
      return r.add(t), () => {
        r.delete(t);
      };
    },
    getSnapshot() {
      return e;
    },
    getServerSnapshot() {
      return e;
    },
    /**
     * Adds a new NodeView Renderer to the editor.
     */
    setRenderer(t, n) {
      e = {
        ...e,
        [t]: ri.createPortal(n.reactElement, n.element, t)
      }, r.forEach((i) => i());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(t) {
      const n = { ...e };
      delete n[t], e = n, r.forEach((i) => i());
    }
  };
}
class Ua extends L.Component {
  constructor(e) {
    var t;
    super(e), this.editorContentRef = L.createRef(), this.initialized = !1, this.state = {
      hasContentComponentInitialized: !!(!((t = e.editor) === null || t === void 0) && t.contentComponent)
    };
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    this.init();
  }
  init() {
    const e = this.props.editor;
    if (e && !e.isDestroyed && e.options.element) {
      if (e.contentComponent)
        return;
      const t = this.editorContentRef.current;
      t.append(...e.options.element.childNodes), e.setOptions({
        element: t
      }), e.contentComponent = $a(), this.state.hasContentComponentInitialized || (this.unsubscribeToContentComponent = e.contentComponent.subscribe(() => {
        this.setState((n) => n.hasContentComponentInitialized ? n : {
          hasContentComponentInitialized: !0
        }), this.unsubscribeToContentComponent && this.unsubscribeToContentComponent();
      })), e.createNodeViews(), this.initialized = !0;
    }
  }
  componentWillUnmount() {
    const e = this.props.editor;
    if (!e || (this.initialized = !1, e.isDestroyed || e.view.setProps({
      nodeViews: {}
    }), this.unsubscribeToContentComponent && this.unsubscribeToContentComponent(), e.contentComponent = null, !e.options.element.firstChild))
      return;
    const t = document.createElement("div");
    t.append(...e.options.element.childNodes), e.setOptions({
      element: t
    });
  }
  render() {
    const { editor: e, innerRef: t, ...n } = this.props;
    return L.createElement(
      L.Fragment,
      null,
      L.createElement("div", { ref: Fa(t, this.editorContentRef), ...n }),
      (e == null ? void 0 : e.contentComponent) && L.createElement(Da, { contentComponent: e.contentComponent })
    );
  }
}
const Va = Lt((r, e) => {
  const t = L.useMemo(() => Math.floor(Math.random() * 4294967295).toString(), [r.editor]);
  return L.createElement(Ua, {
    key: t,
    innerRef: e,
    ...r
  });
});
L.memo(Va);
var Tt = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zn;
function Ha() {
  if (zn) return Tt;
  zn = 1;
  var r = L, e = Vr;
  function t(c, d) {
    return c === d && (c !== 0 || 1 / c === 1 / d) || c !== c && d !== d;
  }
  var n = typeof Object.is == "function" ? Object.is : t, i = e.useSyncExternalStore, o = r.useRef, s = r.useEffect, a = r.useMemo, l = r.useDebugValue;
  return Tt.useSyncExternalStoreWithSelector = function(c, d, f, h, p) {
    var g = o(null);
    if (g.current === null) {
      var m = { hasValue: !1, value: null };
      g.current = m;
    } else m = g.current;
    g = a(function() {
      function x(M) {
        if (!A) {
          if (A = !0, k = M, M = h(M), p !== void 0 && m.hasValue) {
            var $ = m.value;
            if (p($, M)) return E = $;
          }
          return E = M;
        }
        if ($ = E, n(k, M)) return $;
        var J = h(M);
        return p !== void 0 && p($, J) ? $ : (k = M, E = J);
      }
      var A = !1, k, E, I = f === void 0 ? null : f;
      return [function() {
        return x(d());
      }, I === null ? void 0 : function() {
        return x(I());
      }];
    }, [d, f, h, p]);
    var b = i(c, g[0], g[1]);
    return s(function() {
      m.hasValue = !0, m.value = b;
    }, [b]), l(b), b;
  }, Tt;
}
Ha();
const Ja = jn({
  editor: null
});
Ja.Consumer;
const Hr = jn({
  onDragStart: void 0
}), _a = () => ni(Hr), gt = L.forwardRef((r, e) => {
  const { onDragStart: t } = _a(), n = r.as || "div";
  return (
    // @ts-ignore
    L.createElement(n, { ...r, ref: e, "data-node-view-wrapper": "", onDragStart: t, style: {
      whiteSpace: "normal",
      ...r.style
    } })
  );
});
function Ln(r) {
  return !!(typeof r == "function" && r.prototype && r.prototype.isReactComponent);
}
function Pn(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.forward_ref)" || r.$$typeof.description === "react.forward_ref"));
}
function Wa(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.memo)" || r.$$typeof.description === "react.memo"));
}
function Ga(r) {
  if (Ln(r) || Pn(r))
    return !0;
  if (Wa(r)) {
    const e = r.type;
    if (e)
      return Ln(e) || Pn(e);
  }
  return !1;
}
function qa() {
  try {
    if (nn)
      return parseInt(nn.split(".")[0], 10) >= 19;
  } catch {
  }
  return !1;
}
class Ka {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(e, { editor: t, props: n = {}, as: i = "div", className: o = "" }) {
    this.ref = null, this.id = Math.floor(Math.random() * 4294967295).toString(), this.component = e, this.editor = t, this.props = n, this.element = document.createElement(i), this.element.classList.add("react-renderer"), o && this.element.classList.add(...o.split(" ")), this.editor.isInitialized ? ii(() => {
      this.render();
    }) : queueMicrotask(() => {
      this.render();
    });
  }
  /**
   * Render the React component.
   */
  render() {
    var e;
    const t = this.component, n = this.props, i = this.editor, o = qa(), s = Ga(t), a = { ...n };
    a.ref && !(o || s) && delete a.ref, !a.ref && (o || s) && (a.ref = (l) => {
      this.ref = l;
    }), this.reactElement = L.createElement(t, { ...a }), (e = i == null ? void 0 : i.contentComponent) === null || e === void 0 || e.setRenderer(this.id, this);
  }
  /**
   * Re-renders the React component with new props.
   */
  updateProps(e = {}) {
    this.props = {
      ...this.props,
      ...e
    }, this.render();
  }
  /**
   * Destroy the React component.
   */
  destroy() {
    var e;
    const t = this.editor;
    (e = t == null ? void 0 : t.contentComponent) === null || e === void 0 || e.removeRenderer(this.id);
  }
  /**
   * Update the attributes of the element that holds the React component.
   */
  updateAttributes(e) {
    Object.keys(e).forEach((t) => {
      this.element.setAttribute(t, e[t]);
    });
  }
}
class Ya extends Ba {
  constructor(e, t, n) {
    if (super(e, t, n), !this.node.isLeaf) {
      this.options.contentDOMElementTag ? this.contentDOMElement = document.createElement(this.options.contentDOMElementTag) : this.contentDOMElement = document.createElement(this.node.isInline ? "span" : "div"), this.contentDOMElement.dataset.nodeViewContentReact = "", this.contentDOMElement.dataset.nodeViewWrapper = "", this.contentDOMElement.style.whiteSpace = "inherit";
      const i = this.dom.querySelector("[data-node-view-content]");
      if (!i)
        return;
      i.appendChild(this.contentDOMElement);
    }
  }
  /**
   * Setup the React component.
   * Called on initialization.
   */
  mount() {
    const e = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: !1,
      extension: this.extension,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (c = {}) => this.updateAttributes(c),
      deleteNode: () => this.deleteNode(),
      ref: ei()
    };
    if (!this.component.displayName) {
      const c = (d) => d.charAt(0).toUpperCase() + d.substring(1);
      this.component.displayName = c(this.extension.name);
    }
    const i = { onDragStart: this.onDragStart.bind(this), nodeViewContentRef: (c) => {
      c && this.contentDOMElement && c.firstChild !== this.contentDOMElement && (c.hasAttribute("data-node-view-wrapper") && c.removeAttribute("data-node-view-wrapper"), c.appendChild(this.contentDOMElement));
    } }, o = this.component, s = ti((c) => L.createElement(Hr.Provider, { value: i }, Qe(o, c)));
    s.displayName = "ReactNodeView";
    let a = this.node.isInline ? "span" : "div";
    this.options.as && (a = this.options.as);
    const { className: l = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.renderer = new Ka(s, {
      editor: this.editor,
      props: e,
      as: a,
      className: `node-${this.node.type.name} ${l}`.trim()
    }), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.updateElementAttributes();
  }
  /**
   * Return the DOM element.
   * This is the element that will be used to display the node view.
   */
  get dom() {
    var e;
    if (this.renderer.element.firstElementChild && !(!((e = this.renderer.element.firstElementChild) === null || e === void 0) && e.hasAttribute("data-node-view-wrapper")))
      throw Error("Please use the NodeViewWrapper component for your node view.");
    return this.renderer.element;
  }
  /**
   * Return the content DOM element.
   * This is the element that will be used to display the rich-text content of the node.
   */
  get contentDOM() {
    return this.node.isLeaf ? null : this.contentDOMElement;
  }
  /**
   * On editor selection update, check if the node is selected.
   * If it is, call `selectNode`, otherwise call `deselectNode`.
   */
  handleSelectionUpdate() {
    const { from: e, to: t } = this.editor.state.selection, n = this.getPos();
    if (typeof n == "number")
      if (e <= n && t >= n + this.node.nodeSize) {
        if (this.renderer.props.selected)
          return;
        this.selectNode();
      } else {
        if (!this.renderer.props.selected)
          return;
        this.deselectNode();
      }
  }
  /**
   * On update, update the React component.
   * To prevent unnecessary updates, the `update` option can be used.
   */
  update(e, t, n) {
    const i = (o) => {
      this.renderer.updateProps(o), typeof this.options.attrs == "function" && this.updateElementAttributes();
    };
    if (e.type !== this.node.type)
      return !1;
    if (typeof this.options.update == "function") {
      const o = this.node, s = this.decorations, a = this.innerDecorations;
      return this.node = e, this.decorations = t, this.innerDecorations = n, this.options.update({
        oldNode: o,
        oldDecorations: s,
        newNode: e,
        newDecorations: t,
        oldInnerDecorations: a,
        innerDecorations: n,
        updateProps: () => i({ node: e, decorations: t, innerDecorations: n })
      });
    }
    return e === this.node && this.decorations === t && this.innerDecorations === n || (this.node = e, this.decorations = t, this.innerDecorations = n, i({ node: e, decorations: t, innerDecorations: n })), !0;
  }
  /**
   * Select the node.
   * Add the `selected` prop and the `ProseMirror-selectednode` class.
   */
  selectNode() {
    this.renderer.updateProps({
      selected: !0
    }), this.renderer.element.classList.add("ProseMirror-selectednode");
  }
  /**
   * Deselect the node.
   * Remove the `selected` prop and the `ProseMirror-selectednode` class.
   */
  deselectNode() {
    this.renderer.updateProps({
      selected: !1
    }), this.renderer.element.classList.remove("ProseMirror-selectednode");
  }
  /**
   * Destroy the React component instance.
   */
  destroy() {
    this.renderer.destroy(), this.editor.off("selectionUpdate", this.handleSelectionUpdate), this.contentDOMElement = null;
  }
  /**
   * Update the attributes of the top-level element that holds the React component.
   * Applying the attributes defined in the `attrs` option.
   */
  updateElementAttributes() {
    if (this.options.attrs) {
      let e = {};
      if (typeof this.options.attrs == "function") {
        const t = this.editor.extensionManager.attributes, n = hs(this.node, t);
        e = this.options.attrs({ node: this.node, HTMLAttributes: n });
      } else
        e = this.options.attrs;
      this.renderer.updateAttributes(e);
    }
  }
}
function Xa(r, e) {
  return (t) => t.editor.contentComponent ? new Ya(r, t, e) : {};
}
function yt({
  subId: r,
  defaultAttrs: e,
  view: t
}) {
  const n = `${Ki}/${r}`, i = Gn(r.replace(/-([a-z])/g, (o, s) => s.toUpperCase()));
  return lt.create({
    name: i,
    group: "block",
    atom: !0,
    selectable: !0,
    draggable: !0,
    addAttributes() {
      return {
        attrs: {
          default: e,
          parseHTML: (o) => Ve(o.getAttribute("data-attrs") ?? "", e),
          renderHTML: (o) => ({
            "data-attrs": Yi(o.attrs ?? e)
          })
        }
      };
    },
    parseHTML() {
      return [{ tag: `div[data-cms-block="${n}"]` }];
    },
    renderHTML({ HTMLAttributes: o }) {
      return [
        "div",
        zr(o, { "data-cms-block": n })
      ];
    },
    addNodeView() {
      return Xa((o) => {
        const s = o.node.attrs.attrs ?? e;
        return /* @__PURE__ */ u(t, { attrs: s, updateAttrs: (l) => {
          o.updateAttributes({ attrs: { ...s, ...l } });
        }, selected: o.selected });
      });
    }
  });
}
function bt(r) {
  return Gn(r.replace(/-([a-z])/g, (e, t) => t.toUpperCase()));
}
const Yt = "project-meta", Ae = bt(Yt);
function Qa({ attrs: r, selected: e }) {
  const { t } = H("theme-portfolio"), n = r.rows.map((i) => i.label).filter(Boolean).join(" · ");
  return /* @__PURE__ */ u(
    gt,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ y("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ u(Jn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ y("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ u("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.projectMeta.title") }),
          /* @__PURE__ */ u("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: n || t("blocks.projectMeta.untitled") })
        ] })
      ] })
    }
  );
}
function Za({ editor: r }) {
  const e = r.getAttributes(Ae), t = { ...dt, ...e.attrs ?? {} };
  function n(a) {
    r.chain().updateAttributes(Ae, { attrs: { ...t, ...a } }).run();
  }
  function i(a, l, c) {
    const d = [...t.rows];
    d[a] = { ...d[a], [l]: c }, n({ rows: d });
  }
  function o() {
    n({ rows: [...t.rows, { label: "", value: "" }] });
  }
  function s(a) {
    n({ rows: t.rows.filter((l, c) => c !== a) });
  }
  return /* @__PURE__ */ y("div", { className: "space-y-3", children: [
    t.rows.map((a, l) => /* @__PURE__ */ y("div", { className: "space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700", children: [
      /* @__PURE__ */ y("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ y("span", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500", children: [
          "Row ",
          l + 1
        ] }),
        /* @__PURE__ */ u("button", { type: "button", onClick: () => s(l), className: "text-xs text-red-600 hover:underline", children: "Remove" })
      ] }),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: "Label" }),
        /* @__PURE__ */ u("input", { className: "input", value: a.label, onChange: (c) => i(l, "label", c.target.value) })
      ] }),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: "Value (one item per line)" }),
        /* @__PURE__ */ u("textarea", { className: "input", rows: 3, value: a.value, onChange: (c) => i(l, "value", c.target.value) })
      ] })
    ] }, l)),
    /* @__PURE__ */ u("button", { type: "button", onClick: o, className: "btn-secondary text-xs", children: "Add row" })
  ] });
}
const el = yt({
  subId: Yt,
  defaultAttrs: dt,
  view: Qa
}), tl = {
  id: `portfolio/${Yt}`,
  nodeName: Ae,
  titleKey: "blocks.projectMeta.title",
  namespace: "theme-portfolio",
  icon: Jn,
  category: "layout",
  extensions: [el],
  insert: (r) => {
    r.focus().insertContent({
      type: Ae,
      attrs: { attrs: dt }
    }).run();
  },
  isActive: (r) => r.isActive(Ae),
  inspector: (r) => /* @__PURE__ */ u(Za, { editor: r.editor })
}, Xt = "storytelling", Te = bt(Xt);
function nl({ attrs: r, selected: e }) {
  const { t } = H("theme-portfolio");
  return /* @__PURE__ */ u(
    gt,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ y("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ u(Wn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ y("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ u("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.storytelling.title") }),
          /* @__PURE__ */ u("p", { className: "text-sm italic text-surface-900 dark:text-surface-50 truncate", children: r.headline || t("blocks.storytelling.untitled") })
        ] })
      ] })
    }
  );
}
function rl({ editor: r }) {
  const e = r.getAttributes(Te), t = { ...ut, ...e.attrs ?? {} };
  function n(i) {
    r.chain().updateAttributes(Te, { attrs: { ...t, ...i } }).run();
  }
  return /* @__PURE__ */ y("div", { className: "space-y-3", children: [
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.eyebrow, onChange: (i) => n({ eyebrow: i.target.value }) })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Headline (italic)" }),
      /* @__PURE__ */ u("textarea", { className: "input", rows: 2, value: t.headline, onChange: (i) => n({ headline: i.target.value }) })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Body paragraph" }),
      /* @__PURE__ */ u("textarea", { className: "input", rows: 4, value: t.body, onChange: (i) => n({ body: i.target.value }) })
    ] }),
    /* @__PURE__ */ y("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: "Step 1 label" }),
        /* @__PURE__ */ u("input", { className: "input", value: t.step1Label, onChange: (i) => n({ step1Label: i.target.value }) })
      ] }),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: "Step 2 label" }),
        /* @__PURE__ */ u("input", { className: "input", value: t.step2Label, onChange: (i) => n({ step2Label: i.target.value }) })
      ] }),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: "Step 1 text" }),
        /* @__PURE__ */ u("input", { className: "input", value: t.step1Text, onChange: (i) => n({ step1Text: i.target.value }) })
      ] }),
      /* @__PURE__ */ y("div", { children: [
        /* @__PURE__ */ u("label", { className: "label", children: "Step 2 text" }),
        /* @__PURE__ */ u("input", { className: "input", value: t.step2Text, onChange: (i) => n({ step2Text: i.target.value }) })
      ] })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Image URL" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.imageUrl, onChange: (i) => n({ imageUrl: i.target.value }), placeholder: "https://…" })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Image alt" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.imageAlt, onChange: (i) => n({ imageAlt: i.target.value }) })
    ] })
  ] });
}
const il = yt({
  subId: Xt,
  defaultAttrs: ut,
  view: nl
}), ol = {
  id: `portfolio/${Xt}`,
  nodeName: Te,
  titleKey: "blocks.storytelling.title",
  namespace: "theme-portfolio",
  icon: Wn,
  category: "layout",
  extensions: [il],
  insert: (r) => {
    r.focus().insertContent({
      type: Te,
      attrs: { attrs: ut }
    }).run();
  },
  isActive: (r) => r.isActive(Te),
  inspector: (r) => /* @__PURE__ */ u(rl, { editor: r.editor })
}, Qt = "bento-gallery", Ie = bt(Qt);
function sl({ attrs: r, selected: e }) {
  const { t } = H("theme-portfolio"), n = [
    r.mainImageUrl,
    r.subTopImageUrl,
    r.subBottomImageUrl,
    r.wideImageUrl
  ].filter(Boolean).length;
  return /* @__PURE__ */ u(
    gt,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ y("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ u(_n, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ y("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ u("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.bentoGallery.title") }),
          /* @__PURE__ */ y("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: [
            n,
            "/4 ",
            t("blocks.bentoGallery.imagesFilled")
          ] })
        ] })
      ] })
    }
  );
}
function al({ editor: r }) {
  const e = r.getAttributes(Ie), t = { ...ft, ...e.attrs ?? {} };
  function n(o) {
    r.chain().updateAttributes(Ie, { attrs: { ...t, ...o } }).run();
  }
  function i(o, s, a) {
    return /* @__PURE__ */ y("div", { className: "space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700", children: [
      /* @__PURE__ */ u("span", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500", children: a }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "input",
          value: t[o] ?? "",
          onChange: (l) => n({ [o]: l.target.value }),
          placeholder: "https://…"
        }
      ),
      /* @__PURE__ */ u(
        "input",
        {
          className: "input",
          value: t[s] ?? "",
          onChange: (l) => n({ [s]: l.target.value }),
          placeholder: "Image alt"
        }
      )
    ] });
  }
  return /* @__PURE__ */ y("div", { className: "space-y-3", children: [
    i("mainImageUrl", "mainImageAlt", "Main image (col-span-8, 600px)"),
    i("subTopImageUrl", "subTopImageAlt", "Sub top image (col-span-4, top half)"),
    /* @__PURE__ */ y("label", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ u(
        "input",
        {
          type: "checkbox",
          checked: t.subTopGrayscale,
          onChange: (o) => n({ subTopGrayscale: o.target.checked })
        }
      ),
      /* @__PURE__ */ u("span", { className: "text-sm", children: "Grayscale the top sub image" })
    ] }),
    i("subBottomImageUrl", "subBottomImageAlt", "Sub bottom image (col-span-4, bottom half)"),
    i("wideImageUrl", "wideImageAlt", "Wide image (col-span-12, 800px)")
  ] });
}
const ll = yt({
  subId: Qt,
  defaultAttrs: ft,
  view: sl
}), cl = {
  id: `portfolio/${Qt}`,
  nodeName: Ie,
  titleKey: "blocks.bentoGallery.title",
  namespace: "theme-portfolio",
  icon: _n,
  category: "media",
  extensions: [ll],
  insert: (r) => {
    r.focus().insertContent({
      type: Ie,
      attrs: { attrs: ft }
    }).run();
  },
  isActive: (r) => r.isActive(Ie),
  inspector: (r) => /* @__PURE__ */ u(al, { editor: r.editor })
}, Zt = "next-project", Me = bt(Zt);
function dl({ attrs: r, selected: e }) {
  const { t } = H("theme-portfolio");
  return /* @__PURE__ */ u(
    gt,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ y("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ u(Hn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ y("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ u("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.nextProject.title") }),
          /* @__PURE__ */ u("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.nextProject.untitled") })
        ] })
      ] })
    }
  );
}
function ul({ editor: r }) {
  const e = r.getAttributes(Me), t = { ...ht, ...e.attrs ?? {} };
  function n(i) {
    r.chain().updateAttributes(Me, { attrs: { ...t, ...i } }).run();
  }
  return /* @__PURE__ */ y("div", { className: "space-y-3", children: [
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.eyebrow, onChange: (i) => n({ eyebrow: i.target.value }) })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Project title" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.title, onChange: (i) => n({ title: i.target.value }) })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "Link target" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.href, onChange: (i) => n({ href: i.target.value }), placeholder: "/category/project.html" })
    ] }),
    /* @__PURE__ */ y("div", { children: [
      /* @__PURE__ */ u("label", { className: "label", children: "CTA label" }),
      /* @__PURE__ */ u("input", { className: "input", value: t.ctaLabel, onChange: (i) => n({ ctaLabel: i.target.value }) })
    ] })
  ] });
}
const fl = yt({
  subId: Zt,
  defaultAttrs: ht,
  view: dl
}), hl = {
  id: `portfolio/${Zt}`,
  nodeName: Me,
  titleKey: "blocks.nextProject.title",
  namespace: "theme-portfolio",
  icon: Hn,
  category: "layout",
  extensions: [fl],
  insert: (r) => {
    r.focus().insertContent({
      type: Me,
      attrs: { attrs: ht }
    }).run();
  },
  isActive: (r) => r.isActive(Me),
  inspector: (r) => /* @__PURE__ */ u(ul, { editor: r.editor })
}, Bn = {
  id: "portfolio",
  name: "Portfolio",
  version: "0.1.0",
  description: "The Minimalist Portfolio System — editorial canvas for designers, photographers and artists. Charcoal-on-warm-white, Playfair Display + Inter, sharp corners, zero shadows, rose accent for active state only.",
  // Tailwind pipeline — the Sass entry isn't reached because
  // theme.compiled.css exists.
  scssEntry: "theme.css",
  cssText: an,
  jsText: bi,
  jsTextPosts: wi,
  jsTextFilters: xi,
  i18n: { en: be, fr: Ai, de: Ti, es: Ii, nl: Mi, pt: Oi, ko: Ri },
  settings: {
    navLabelKey: "title",
    defaultConfig: fi,
    component: $i
  },
  compileCss: (r) => Dn(an, r.style),
  // Image catalog tuned for photography/portfolio work — higher
  // quality (85 vs 80 default) because the audience is artists who
  // care about fidelity. Portrait 4:5 is the canonical card aspect;
  // square 1:1 covers bento sub-images; wide / hero cover full-bleed
  // sections.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: "webp",
    quality: 85,
    formats: {
      portrait: { width: 800, height: 1e3, fit: "cover" },
      square: { width: 800, height: 800, fit: "cover" },
      wide: { width: 1600, height: 900, fit: "cover" },
      hero: { width: 2400, height: 1500, fit: "cover" }
    },
    defaultFormat: "portrait"
  },
  templates: {
    base: ai,
    home: hi,
    single: pi,
    category: mi,
    author: gi,
    notFound: yi
  },
  blocks: [
    tl,
    ol,
    cl,
    hl
  ],
  register(r) {
    r.addFilter("post.html.body", (e) => co(e));
  }
};
export {
  Bn as manifest
};
