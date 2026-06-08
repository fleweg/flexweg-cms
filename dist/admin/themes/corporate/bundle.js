import { jsxs as p, Fragment as Se, jsx as l } from "react/jsx-runtime";
import { i18n as Ee, pickPublicLocale as Le, canonicalUrl as Ea, uploadFile as La, pickFormat as Qe, buildTermUrl as nn, SocialIcon as Ma, socialLabel as Sr, useCmsData as an, MediaPicker as Ia, pickMediaUrl as Ha, logoPath as Oa, FontSelect as Pa, toast as J, uploadThemeLogo as Ra, removeThemeLogo as za, fetchAllPosts as Nr, publishMenuJson as Ba } from "@flexweg/cms-runtime";
import j, { forwardRef as Xt, createElement as vt, useState as Q, useRef as $a, createRef as Fa, memo as Ua, createContext as on, version as Ar, useContext as ja } from "react";
import { useTranslation as H } from "react-i18next";
import Da, { flushSync as Va } from "react-dom";
function qa({ site: r }) {
  const { settings: e } = r, t = Ee.getFixedT(Le(e.language), "theme-corporate");
  return /* @__PURE__ */ p(Se, { children: [
    /* @__PURE__ */ l(
      "header",
      {
        className: "fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20",
        children: /* @__PURE__ */ p("div", { className: "flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-full", children: [
          /* @__PURE__ */ p("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "burger-toggle text-primary",
                "aria-controls": "burger-menu",
                "aria-expanded": "false",
                "aria-label": t("publicBaked.menu"),
                children: /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "menu" })
              }
            ),
            /* @__PURE__ */ l(
              "a",
              {
                className: "text-h3 font-bold text-primary tracking-tight",
                href: r.homePath ?? "/index.html",
                "data-cms-brand": !0,
                children: e.title
              }
            )
          ] }),
          /* @__PURE__ */ l(
            "nav",
            {
              className: "hidden md:flex items-center gap-8",
              "data-cms-menu": "header",
              "data-cms-menu-inline": !0,
              "aria-label": "Primary"
            }
          ),
          /* @__PURE__ */ p("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ l("div", { "data-cms-langswitch": "header", "aria-hidden": "true" }),
            /* @__PURE__ */ l(
              "a",
              {
                href: "/contact.html",
                className: "bg-secondary text-on-secondary px-6 py-2 rounded-lg text-button font-semibold hover:opacity-90 active:opacity-80 transition-all",
                children: t("publicBaked.getStarted")
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ l(
      "nav",
      {
        id: "burger-menu",
        className: "burger-menu",
        "data-cms-menu": "header",
        "aria-label": "Primary mobile",
        children: /* @__PURE__ */ l("ul", {})
      }
    )
  ] });
}
function _a({ site: r }) {
  const { settings: e } = r, t = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ p("footer", { className: "bg-primary text-on-primary border-t border-on-primary-fixed-variant/20", children: [
    /* @__PURE__ */ p("div", { className: "w-full px-gutter py-section-padding max-w-container-max mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-stack-lg", children: [
      /* @__PURE__ */ p("div", { className: "max-w-sm", children: [
        /* @__PURE__ */ l("span", { className: "text-h3 font-bold text-secondary-fixed block mb-stack-md", children: e.title }),
        e.description && /* @__PURE__ */ l("p", { className: "text-body-md text-on-primary-container/80", children: e.description })
      ] }),
      /* @__PURE__ */ l(
        "nav",
        {
          "data-cms-menu": "footer",
          "aria-label": "Footer",
          className: "flex-1 md:max-w-md",
          children: /* @__PURE__ */ l("ul", { className: "flex flex-wrap gap-x-8 gap-y-3 text-body-md text-on-primary-container/80" })
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { className: "max-w-container-max mx-auto px-gutter pb-8", children: /* @__PURE__ */ p("div", { className: "flex flex-wrap items-center justify-between gap-stack-sm border-t border-on-primary-fixed-variant/10 pt-8", children: [
      /* @__PURE__ */ p("p", { className: "text-on-primary-container/60 text-label-caps font-semibold uppercase tracking-wider", children: [
        "© ",
        t,
        " ",
        e.title
      ] }),
      /* @__PURE__ */ l("div", { "data-cms-langswitch": "footer", "aria-hidden": "true" })
    ] }) })
  ] });
}
function Ga({
  site: r,
  pageTitle: e,
  pageDescription: t,
  ogImage: n,
  currentPath: a,
  currentLocale: o,
  children: i
}) {
  var b;
  const s = (b = r.themeConfig) == null ? void 0 : b.cssUpdatedAt, c = s ? `/${r.themeCssPath}?v=${s}` : `/${r.themeCssPath}`, u = r.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, ""), d = `/theme-assets/${u}-menu.js`, h = `/theme-assets/${u}-posts.js`, m = r.settings.baseUrl && a ? Ea(r.settings.baseUrl, a) : void 0, f = e ? `${e} — ${r.settings.title}` : r.settings.title;
  return /* @__PURE__ */ p("html", { lang: o || r.settings.language || "en", children: [
    /* @__PURE__ */ p("head", { children: [
      /* @__PURE__ */ l("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ l("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ l("title", { children: f }),
      t && /* @__PURE__ */ l("meta", { name: "description", content: t }),
      m && /* @__PURE__ */ l("link", { rel: "canonical", href: m }),
      /* @__PURE__ */ l("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ l("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ l("link", { rel: "stylesheet", href: c }),
      /* @__PURE__ */ l("meta", { property: "og:title", content: f }),
      t && /* @__PURE__ */ l("meta", { property: "og:description", content: t }),
      n && /* @__PURE__ */ l("meta", { property: "og:image", content: n }),
      m && /* @__PURE__ */ l("meta", { property: "og:url", content: m }),
      /* @__PURE__ */ l("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ l("meta", { name: "x-cms-head-extra" })
    ] }),
    /* @__PURE__ */ p("body", { className: "bg-background text-on-surface", children: [
      /* @__PURE__ */ l(qa, { site: r }),
      /* @__PURE__ */ l("main", { className: "pt-20", children: i }),
      /* @__PURE__ */ l(_a, { site: r }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          "data-cms-search": !0,
          "aria-label": "Search",
          className: "fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40",
          children: /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "search" })
        }
      ),
      /* @__PURE__ */ l("script", { src: d, defer: !0 }),
      /* @__PURE__ */ l("script", { src: h, defer: !0 }),
      /* @__PURE__ */ l("script", { type: "application/x-cms-body-end" })
    ] })
  ] });
}
const Ja = "corporate";
function Wa(r) {
  if (r == null) return "";
  try {
    const e = JSON.stringify(r);
    return typeof window > "u" ? Buffer.from(e, "utf-8").toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  } catch {
    return "";
  }
}
function Y(r, e) {
  if (!r || typeof r != "string") return e;
  try {
    let t;
    return typeof window > "u" ? t = Buffer.from(r, "base64").toString("utf-8") : t = decodeURIComponent(escape(window.atob(r))), JSON.parse(t);
  } catch {
    return e;
  }
}
function sn(r) {
  return `corporate${r.charAt(0).toUpperCase()}${r.slice(1)}`;
}
function N(r) {
  return typeof r != "string" ? "" : r.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function k(r) {
  return typeof r != "string" ? "" : r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ln(r) {
  if (!r.title && !r.subtitle && !r.imageUrl)
    return { html: "" };
  const e = r.imageUrl ? `<img class="w-full h-full object-cover" src="${N(r.imageUrl)}" alt="${N(r.imageAlt ?? "")}" loading="eager" fetchpriority="high" />` : "", t = r.imageUrl ? "absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30 md:to-transparent" : "absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary-container", n = r.eyebrow ? `<span class="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-fixed text-label-caps font-semibold uppercase tracking-wider mb-6 border border-secondary/30">${k(r.eyebrow)}</span>` : "", a = r.title ? `<h1 class="text-h1 font-bold mb-stack-lg leading-tight">${k(r.title)}</h1>` : "", o = r.subtitle ? `<p class="text-body-lg mb-10 text-on-primary-container">${k(r.subtitle)}</p>` : "", i = r.primaryCtaLabel && r.primaryCtaHref ? `<a href="${N(r.primaryCtaHref)}" class="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-button font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2">${k(r.primaryCtaLabel)}<span class="material-symbols-outlined">arrow_forward</span></a>` : "", s = r.secondaryCtaLabel && r.secondaryCtaHref ? `<a href="${N(r.secondaryCtaHref)}" class="border border-on-primary/30 text-on-primary px-8 py-4 rounded-xl text-button font-semibold hover:bg-white/10 transition-colors">${k(r.secondaryCtaLabel)}</a>` : "", c = i || s ? `<div class="flex flex-wrap gap-4">${i}${s}</div>` : "";
  return {
    html: `<section class="relative min-h-[600px] md:min-h-[760px] flex items-center overflow-hidden">
<div class="absolute inset-0 z-0">${e}<div class="${t}"></div></div>
<div class="relative z-10 w-full px-gutter max-w-container-max mx-auto py-section-padding"><div class="max-w-2xl text-on-primary">${n}${a}${o}${c}</div></div>
</section>`
  };
}
const Ka = {
  rating: 5,
  quote: "",
  authorName: "",
  authorTitle: "",
  authorAvatarUrl: "",
  authorAvatarAlt: ""
};
function Ya(r, e) {
  const t = Math.max(0, Math.min(5, Math.round(r))), n = e ? "text-secondary-fixed" : "text-secondary";
  let a = "";
  for (let o = 0; o < 5; o++) {
    const i = o < t;
    a += `<span class="material-symbols-outlined text-[18px] ${n}" style="font-variation-settings: 'FILL' ${i ? 1 : 0};">star</span>`;
  }
  return `<div class="flex gap-1 mb-stack-md">${a}</div>`;
}
function Za(r) {
  if (!r) return "?";
  const e = r.trim().split(/\s+/);
  return e.length === 1 ? e[0].slice(0, 2).toUpperCase() : `${e[0][0] ?? ""}${e[e.length - 1][0] ?? ""}`.toUpperCase();
}
function Qa(r, e) {
  const t = { ...Ka, ...r };
  if (!t.quote && !t.authorName) return "";
  const n = e ? "bg-primary-container p-8 rounded-xl border border-on-primary-fixed-variant/20" : "glass-card p-8 rounded-xl shadow-sm relative", a = e ? "material-symbols-outlined text-secondary-fixed text-4xl mb-stack-md" : "material-symbols-outlined text-secondary/20 text-[64px] absolute top-4 right-4", o = e ? "text-body-lg mb-stack-lg italic" : "text-on-surface mb-stack-lg italic", i = e ? "font-bold text-on-primary" : "font-bold text-primary", s = e ? "text-label-caps font-semibold text-on-primary-container uppercase tracking-wider" : "text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider", c = t.authorAvatarUrl ? `<img class="w-12 h-12 rounded-full object-cover" src="${N(t.authorAvatarUrl)}" alt="${N(t.authorAvatarAlt ?? t.authorName)}" loading="lazy" />` : `<span class="w-12 h-12 rounded-full inline-flex items-center justify-center bg-secondary-fixed text-secondary font-bold" aria-hidden="true">${k(Za(t.authorName))}</span>`;
  return `<div class="${n}">
<span class="${a}" style="font-variation-settings: 'FILL' 1;">format_quote</span>
${Ya(t.rating ?? 5, e)}
<p class="${o}">${k(t.quote)}</p>
<div class="flex items-center gap-stack-md">${c}<div><p class="${i}">${k(t.authorName)}</p>${t.authorTitle ? `<p class="${s}">${k(t.authorTitle)}</p>` : ""}</div></div>
</div>`;
}
function cn(r) {
  const e = (r.testimonials ?? []).filter((f) => f && (f.quote || f.authorName));
  if (e.length === 0 && !r.title) return { html: "" };
  const t = r.variant === "navy", n = t ? "px-gutter py-section-padding bg-primary text-on-primary overflow-hidden relative" : "bg-surface-container-low py-section-padding overflow-hidden", a = r.eyebrow ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block ${t ? "text-secondary-fixed" : "text-secondary"}">${k(r.eyebrow)}</span>` : "", o = t ? "text-h2 font-bold mb-4" : "text-h2 font-bold text-primary", i = t ? "text-on-primary-container text-body-lg mt-4" : "text-on-surface-variant text-body-md mt-4", s = r.title ? `<h2 class="${o}">${k(r.title)}</h2>` : "", c = r.subtitle ? `<p class="${i}">${k(r.subtitle)}</p>` : "", u = a || s || c ? `<div class="text-center mb-section-padding max-w-2xl mx-auto">${a}${s}${c}</div>` : "", d = e.length >= 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : e.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1", h = e.map((f) => Qa(f, t)).join("");
  return {
    html: `<section class="${n}">
<div class="px-gutter max-w-container-max mx-auto relative z-10">
${u}
<div class="grid ${d} gap-stack-lg">${h}</div>
</div>
${t ? '<div class="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>' : ""}
</section>`
  };
}
const Ht = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#f7f9fb" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#f7f9fb" },
  { name: "--color-surface-container-lowest", type: "color", group: "surfaces", labelKey: "vars.surfaceLowest", defaultValue: "#ffffff" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f2f4f6" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#eceef0" },
  { name: "--color-surface-container-high", type: "color", group: "surfaces", labelKey: "vars.surfaceHigh", defaultValue: "#e6e8ea" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#191c1e" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#45474c" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#75777d" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c5c6cd" },
  // Accent — the navy primary + indigo secondary + sky tertiary triple
  // is the heart of the corporate identity. Defaults match
  // DESIGN.md / Stitch mockup exactly.
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#091426" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-primary-container", type: "color", group: "accent", labelKey: "vars.primaryContainer", defaultValue: "#1e293b" },
  { name: "--color-on-primary-container", type: "color", group: "accent", labelKey: "vars.onPrimaryContainer", defaultValue: "#8590a6" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#4b41e1" },
  { name: "--color-on-secondary", type: "color", group: "accent", labelKey: "vars.onSecondary", defaultValue: "#ffffff" },
  { name: "--color-tertiary", type: "color", group: "accent", labelKey: "vars.tertiary", defaultValue: "#001624" },
  { name: "--color-tertiary-container", type: "color", group: "accent", labelKey: "vars.tertiaryContainer", defaultValue: "#002c42" }
], Xa = [
  "surfaces",
  "foreground",
  "outlines",
  "accent"
], yt = {
  sans: {
    Inter: "Inter:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700"
  }
}, Ne = "Inter", Pe = {
  vars: {},
  fontSans: Ne
}, dn = [
  {
    id: "classic",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {},
    fontSans: Ne
  },
  {
    id: "tech",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fafafa",
      "--color-surface": "#fafafa",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f4f4f5",
      "--color-surface-container": "#e9e9eb",
      "--color-surface-container-high": "#dededf",
      "--color-on-surface": "#0a0a0a",
      "--color-on-surface-variant": "#3f3f46",
      "--color-outline": "#71717a",
      "--color-outline-variant": "#d4d4d8",
      "--color-primary": "#0a0a0a",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#262626",
      "--color-on-primary-container": "#a1a1aa",
      "--color-secondary": "#06b6d4",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#000000",
      "--color-tertiary-container": "#1a1a1a"
    },
    fontSans: "Plus Jakarta Sans"
  },
  {
    id: "trust",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#f7f4ed",
      "--color-surface": "#f7f4ed",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#efebe1",
      "--color-surface-container": "#e6e1d4",
      "--color-surface-container-high": "#ddd7c8",
      "--color-on-surface": "#1a1612",
      "--color-on-surface-variant": "#46403a",
      "--color-outline": "#8a8478",
      "--color-outline-variant": "#cfc8b8",
      "--color-primary": "#1e3a5f",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#2d4d7a",
      "--color-on-primary-container": "#a8bcd4",
      "--color-secondary": "#c4882d",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#172a45",
      "--color-tertiary-container": "#1e3a5f"
    },
    fontSans: "IBM Plex Sans"
  },
  {
    id: "vibrant",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fdfcfb",
      "--color-surface": "#fdfcfb",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f7f3f1",
      "--color-surface-container": "#f0eae7",
      "--color-surface-container-high": "#e8e0dc",
      "--color-on-surface": "#1a0a0a",
      "--color-on-surface-variant": "#3a2828",
      "--color-outline": "#7a5a5a",
      "--color-outline-variant": "#cdb5b5",
      "--color-primary": "#e91e63",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#c2185b",
      "--color-on-primary-container": "#ffd4e3",
      "--color-secondary": "#f97316",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#9c1a4a",
      "--color-tertiary-container": "#c2185b"
    },
    fontSans: "DM Sans"
  },
  {
    id: "executive",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fbf9f6",
      "--color-surface": "#fbf9f6",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f3f0ea",
      "--color-surface-container": "#ebe7df",
      "--color-surface-container-high": "#e3ddd3",
      "--color-on-surface": "#1c1626",
      "--color-on-surface-variant": "#3f3a4d",
      "--color-outline": "#7c7790",
      "--color-outline-variant": "#cac4d8",
      "--color-primary": "#3b1f5b",
      "--color-on-primary": "#fbf9f6",
      "--color-primary-container": "#5a3b87",
      "--color-on-primary-container": "#d4c4ec",
      "--color-secondary": "#a87c2c",
      "--color-on-secondary": "#ffffff",
      "--color-tertiary": "#2a1846",
      "--color-tertiary-container": "#3b1f5b"
    },
    fontSans: "Manrope"
  }
];
function un(r, e) {
  var a;
  const t = (a = r.vars) == null ? void 0 : a[e];
  if (t && t.trim()) return t.trim();
  const n = Ht.find((o) => o.name === e);
  return n ? n.defaultValue : "";
}
function eo(r) {
  var e;
  for (const t of dn) {
    if (t.fontSans !== r.fontSans) continue;
    let n = !0;
    for (const a of Ht) {
      const o = ((e = t.vars[a.name]) == null ? void 0 : e.trim()) || a.defaultValue, i = un(r, a.name);
      if (o !== i) {
        n = !1;
        break;
      }
    }
    if (n) return t.id;
  }
  return null;
}
function to(r) {
  return `https://fonts.googleapis.com/css2?family=${yt.sans[r] ?? yt.sans[Ne]}&display=swap`;
}
function ro() {
  return `https://fonts.googleapis.com/css2?${Object.keys(yt.sans).map((t) => `family=${t.replace(/ /g, "+")}`).join("&")}&display=swap`;
}
function no(r) {
  const e = r.trim(), t = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(e);
  if (!t) return e;
  const n = t[1];
  if (n.length === 3) {
    const s = parseInt(n[0] + n[0], 16), c = parseInt(n[1] + n[1], 16), u = parseInt(n[2] + n[2], 16);
    return `${s} ${c} ${u}`;
  }
  const a = parseInt(n.slice(0, 2), 16), o = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16);
  return `${a} ${o} ${i}`;
}
function ao(r) {
  return `"${r.replace(/"/g, '\\"')}"`;
}
function pn(r, e) {
  const t = {};
  for (const [d, h] of Object.entries(e.vars ?? {}))
    h && h.trim() && (t[d] = h.trim());
  const n = e.fontSans || Ne, a = n !== Ne, o = Object.keys(t).length > 0;
  if (!a && !o) return r;
  let i = r;
  if (a) {
    const d = to(n);
    i = i.replace(
      /@import\s*(?:url\(\s*)?"https:\/\/fonts\.googleapis\.com[^"]*"(?:\s*\))?\s*;/,
      `@import url("${d}");`
    );
  }
  const s = new Map(Ht.map((d) => [d.name, d])), c = Object.entries(t).map(([d, h]) => {
    const m = s.get(d), f = (m == null ? void 0 : m.type) === "color" ? no(h) : h;
    return `${d}:${f};`;
  }).join(""), u = a ? `--font-sans:${ao(n)};` : "";
  return i += `
:root{${u}${c}}
`, i;
}
async function Tr(r) {
  const e = pn(r.baseCssText, r.style);
  await La({
    path: "theme-assets/corporate.css",
    content: e,
    encoding: "utf-8"
  });
}
const oo = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80", ee = {
  showHero: !0,
  hero: {
    imageUrl: oo,
    imageAlt: "Modern corporate office",
    eyebrow: "Innovation & reliability",
    title: "Propel your business toward the future",
    subtitle: "Strategic, tailor-made solutions for SMEs seeking digital growth and operational excellence.",
    primaryCtaLabel: "Get started",
    primaryCtaHref: "/contact.html",
    secondaryCtaLabel: "See our solutions",
    secondaryCtaHref: "#services"
  },
  featuredPosts: {
    enabled: !0,
    title: "Our latest insights",
    subtitle: "Stay ahead of the curve with strategic perspectives from our team of experts.",
    mode: "all",
    categoryId: "",
    count: 3
  },
  testimonials: {
    enabled: !0,
    eyebrow: "",
    title: "Trusted by industry leaders",
    subtitle: "More than 500 businesses accelerate their growth with us.",
    variant: "glass",
    // Placeholder content — editor replaces or removes from the
    // Home tab. The first publish reads as credible social proof
    // even before the editor curates real testimonials.
    items: [
      {
        rating: 5,
        quote: "Their platform completely changed our customer-service approach. We cut operational costs by 30% in six months.",
        authorName: "Jean-Pierre Dubois",
        authorTitle: "Operations Director, LogisTech",
        authorAvatarUrl: "",
        authorAvatarAlt: ""
      },
      {
        rating: 5,
        quote: "Exceptional strategic guidance — they truly understand the challenges modern SMEs face. An indispensable partner.",
        authorName: "Marie Leroux",
        authorTitle: "Founder, GreenPulse",
        authorAvatarUrl: "",
        authorAvatarAlt: ""
      },
      {
        rating: 5,
        quote: "The cloud transition was surprisingly fluid. They handled the technical complexity, letting us focus on our core business.",
        authorName: "Thomas Martin",
        authorTitle: "CTO, DataSecure",
        authorAvatarUrl: "",
        authorAvatarAlt: ""
      }
    ]
  }
}, er = {
  // Off by default — many corporate / vitrine sites don't surface
  // per-author bylines individually. Flip on when authors have full
  // profiles (display name + bio + socials) worth showing.
  showAuthorBio: !1,
  showPopularArticles: !0,
  // Empty = SingleTemplate falls back to the localised default
  // (`publicBaked.popularArticles`).
  popularArticlesTitle: "",
  showCta: !0,
  // Empty = the template falls back to either site.settings.title or
  // the localised "Get Started" (depending on whether
  // settings.description is set).
  ctaTitle: "",
  ctaButtonLabel: "",
  ctaButtonHref: ""
}, io = {
  logoEnabled: !1,
  logoUpdatedAt: 0,
  style: Pe,
  cssUpdatedAt: 0,
  home: ee,
  single: er
};
function so({
  posts: r,
  staticPage: e,
  archivesLink: t,
  site: n
}) {
  var h, m, f;
  const a = Ee.getFixedT(Le(n.settings.language), "theme-corporate");
  if (e)
    return /* @__PURE__ */ l(
      "div",
      {
        className: "corporate-static-home",
        dangerouslySetInnerHTML: { __html: e.bodyHtml }
      }
    );
  const o = n.themeConfig, i = {
    ...ee,
    ...(o == null ? void 0 : o.home) ?? {},
    hero: { ...ee.hero, ...((h = o == null ? void 0 : o.home) == null ? void 0 : h.hero) ?? {} },
    featuredPosts: {
      ...ee.featuredPosts,
      ...((m = o == null ? void 0 : o.home) == null ? void 0 : m.featuredPosts) ?? {}
    },
    testimonials: {
      ...ee.testimonials,
      ...((f = o == null ? void 0 : o.home) == null ? void 0 : f.testimonials) ?? {}
    }
  }, s = i.showHero ? ln(i.hero).html : "", c = i.featuredPosts;
  let u = r;
  if (c.enabled && c.mode === "category" && c.categoryId) {
    const b = r.filter((g) => g.primaryTermId === c.categoryId);
    b.length > 0 && (u = b);
  }
  u = u.slice(0, Math.max(1, c.count));
  const d = i.testimonials.enabled ? cn({
    eyebrow: i.testimonials.eyebrow,
    title: i.testimonials.title,
    subtitle: i.testimonials.subtitle,
    variant: i.testimonials.variant,
    testimonials: i.testimonials.items
  }).html : "";
  return /* @__PURE__ */ p(Se, { children: [
    s && /* @__PURE__ */ l("div", { dangerouslySetInnerHTML: { __html: s } }),
    c.enabled && u.length > 0 && /* @__PURE__ */ l("section", { className: "px-gutter py-section-padding", id: "featured", children: /* @__PURE__ */ p("div", { className: "max-w-container-max mx-auto", children: [
      /* @__PURE__ */ p("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between mb-stack-lg gap-stack-md", children: [
        /* @__PURE__ */ p("div", { className: "max-w-xl", children: [
          c.title && /* @__PURE__ */ l("h2", { className: "text-h2 font-bold text-primary mb-2", children: c.title }),
          c.subtitle && /* @__PURE__ */ l("p", { className: "text-on-surface-variant text-body-md", children: c.subtitle })
        ] }),
        /* @__PURE__ */ p("div", { className: "flex gap-2 shrink-0", children: [
          /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              "data-cms-featured-prev": !0,
              "aria-label": a("publicBaked.previous"),
              className: "p-3 rounded-full border border-outline hover:bg-surface-container transition-colors",
              children: /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "chevron_left" })
            }
          ),
          /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              "data-cms-featured-next": !0,
              "aria-label": a("publicBaked.next"),
              className: "p-3 rounded-full border border-outline hover:bg-surface-container transition-colors",
              children: /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "chevron_right" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l(
        "div",
        {
          "data-cms-featured-track": !0,
          className: "flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-stack-lg corporate-no-scrollbar",
          children: u.map((b) => /* @__PURE__ */ p(
            "article",
            {
              className: "snap-start corporate-slide bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col group",
              children: [
                b.hero && /* @__PURE__ */ l("a", { href: `/${b.url}`, className: "block aspect-video overflow-hidden", children: /* @__PURE__ */ l(
                  "img",
                  {
                    src: Qe(b.hero, "medium"),
                    alt: b.hero.alt ?? b.title,
                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  }
                ) }),
                /* @__PURE__ */ p("div", { className: "p-6 flex flex-col flex-1", children: [
                  b.category && /* @__PURE__ */ l("p", { className: "text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2", children: b.category.name }),
                  b.dateLabel && /* @__PURE__ */ l("p", { className: "text-label-caps font-semibold text-on-surface-variant mb-2", children: b.dateLabel }),
                  /* @__PURE__ */ l("h3", { className: "text-h3 font-semibold text-primary mb-3 group-hover:text-secondary transition-colors", children: /* @__PURE__ */ l("a", { href: `/${b.url}`, children: b.title }) }),
                  b.excerpt && /* @__PURE__ */ l("p", { className: "text-body-md text-on-surface-variant mb-6 flex-1", children: b.excerpt }),
                  /* @__PURE__ */ p(
                    "a",
                    {
                      href: `/${b.url}`,
                      className: "inline-flex items-center gap-2 text-button font-semibold text-secondary",
                      children: [
                        a("publicBaked.readMore"),
                        /* @__PURE__ */ l("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
                      ]
                    }
                  )
                ] })
              ]
            },
            b.id
          ))
        }
      ),
      t && /* @__PURE__ */ l("div", { className: "mt-stack-lg", children: /* @__PURE__ */ l("a", { className: "archives-link", href: t.href, children: t.label }) })
    ] }) }),
    d && /* @__PURE__ */ l("div", { dangerouslySetInnerHTML: { __html: d } })
  ] });
}
function lo({
  post: r,
  bodyHtml: e,
  author: t,
  hero: n,
  primaryTerm: a,
  tags: o,
  site: i
}) {
  var x, S, A, R, O, M;
  const s = Ee.getFixedT(Le(i.settings.language), "theme-corporate"), c = r.type === "page", u = i.themeConfig, d = {
    ...er,
    ...(u == null ? void 0 : u.single) ?? {}
  }, h = d.popularArticlesTitle.trim() || s("publicBaked.popularArticles"), m = d.ctaTitle.trim() || (i.settings.description ? i.settings.title : s("publicBaked.getStarted")), f = d.ctaButtonLabel.trim() || s("publicBaked.getStarted"), b = d.ctaButtonHref.trim() || "/contact.html", g = ((S = (x = r.publishedAt) == null ? void 0 : x.toMillis) == null ? void 0 : S.call(x)) ?? ((R = (A = r.updatedAt) == null ? void 0 : A.toMillis) == null ? void 0 : R.call(A)) ?? ((M = (O = r.createdAt) == null ? void 0 : O.toMillis) == null ? void 0 : M.call(O));
  let v;
  if (g)
    try {
      v = new Intl.DateTimeFormat(i.settings.language || "en", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(g));
    } catch {
      v = new Date(g).toDateString();
    }
  return c ? /* @__PURE__ */ l("article", { className: "pt-stack-md pb-section-padding", children: /* @__PURE__ */ l(
    "div",
    {
      className: "corporate-page-body",
      dangerouslySetInnerHTML: { __html: e }
    }
  ) }) : /* @__PURE__ */ p("article", { children: [
    n && /* @__PURE__ */ l("div", { className: "relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden", children: /* @__PURE__ */ l(
      "img",
      {
        src: Qe(n, "large"),
        alt: n.alt ?? "",
        className: "w-full h-full object-cover",
        fetchPriority: "high"
      }
    ) }),
    /* @__PURE__ */ l("div", { className: "px-gutter mt-stack-lg pb-stack-lg max-w-container-max mx-auto", children: /* @__PURE__ */ l("div", { className: "lg:grid lg:grid-cols-12 lg:gap-stack-lg", children: /* @__PURE__ */ p("header", { className: "lg:col-span-8 max-w-3xl", children: [
      /* @__PURE__ */ p("div", { className: "flex flex-wrap items-center gap-stack-md mb-stack-md", children: [
        a && /* @__PURE__ */ l(
          "a",
          {
            href: `/${nn(a)}`,
            className: "bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity",
            children: a.name
          }
        ),
        v && /* @__PURE__ */ p("div", { className: "flex items-center text-on-surface-variant text-body-md", children: [
          /* @__PURE__ */ l("span", { className: "material-symbols-outlined text-[18px] mr-1", children: "calendar_today" }),
          /* @__PURE__ */ l("span", { children: v })
        ] }),
        t && /* @__PURE__ */ p("div", { className: "flex items-center text-on-surface-variant text-body-md", children: [
          /* @__PURE__ */ l("span", { className: "material-symbols-outlined text-[18px] mr-1", children: "person" }),
          /* @__PURE__ */ l("span", { children: t.displayName })
        ] })
      ] }),
      /* @__PURE__ */ l("h1", { className: "text-h2 md:text-h1 font-bold text-primary leading-tight", children: r.title })
    ] }) }) }),
    /* @__PURE__ */ p("div", { className: "px-gutter pb-section-padding max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-stack-lg", children: [
      /* @__PURE__ */ p("div", { className: "lg:col-span-8 max-w-3xl", children: [
        /* @__PURE__ */ l(
          "div",
          {
            className: "corporate-prose",
            dangerouslySetInnerHTML: { __html: e }
          }
        ),
        o.length > 0 && /* @__PURE__ */ l("div", { className: "mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-wrap gap-2", children: o.map((z) => /* @__PURE__ */ p(
          "span",
          {
            className: "px-3 py-1 bg-surface-container-high rounded-full text-label-caps font-semibold text-primary",
            children: [
              "#",
              z.name
            ]
          },
          z.id
        )) }),
        /* @__PURE__ */ p("div", { className: "mt-section-padding pt-stack-lg border-t border-outline-variant/50", children: [
          /* @__PURE__ */ l("h4", { className: "text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider mb-stack-md", children: s("publicBaked.shareThisArticle") }),
          /* @__PURE__ */ p("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                "data-cms-share": "native",
                className: "w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary transition-all hover:bg-secondary hover:text-on-secondary",
                children: /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "share" })
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                "data-cms-share": "copy",
                className: "w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary transition-all hover:bg-secondary hover:text-on-secondary",
                children: /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "link" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ p("aside", { className: "lg:col-span-4 space-y-stack-lg", children: [
        d.showAuthorBio && r.authorId && /* @__PURE__ */ l(
          "section",
          {
            className: "corporate-bio-card",
            "data-cms-author-bio": !0,
            "data-cms-author-id": r.authorId,
            "data-cms-bio-label": s("publicBaked.author"),
            hidden: !0
          }
        ),
        d.showPopularArticles && /* @__PURE__ */ l(
          "section",
          {
            className: "corporate-related-card",
            "data-cms-related": !0,
            "data-cms-current-id": r.id,
            "data-cms-term-id": r.primaryTermId ?? "",
            "data-cms-limit": "3",
            "data-cms-label": h,
            "data-cms-fallback-label": h
          }
        ),
        d.showCta && /* @__PURE__ */ l("div", { className: "corporate-cta-card", children: /* @__PURE__ */ p("div", { className: "relative z-10", children: [
          /* @__PURE__ */ l("h4", { className: "text-h2 font-bold mb-stack-sm", children: m }),
          i.settings.description && /* @__PURE__ */ l("p", { className: "text-body-md opacity-80 mb-stack-lg", children: i.settings.description }),
          /* @__PURE__ */ l(
            "a",
            {
              href: b,
              className: "block w-full text-center bg-secondary text-on-secondary py-3 rounded-lg text-button font-semibold hover:bg-secondary/90 transition-all shadow-lg",
              children: f
            }
          )
        ] }) })
      ] })
    ] })
  ] });
}
function co({
  term: r,
  posts: e,
  categoryRssUrl: t,
  archivesLink: n,
  allCategories: a,
  site: o
}) {
  const i = Ee.getFixedT(Le(o.settings.language), "theme-corporate");
  return /* @__PURE__ */ p(Se, { children: [
    /* @__PURE__ */ p("section", { className: "relative overflow-hidden bg-primary py-section-padding", children: [
      /* @__PURE__ */ l("div", { className: "absolute inset-0 opacity-20", children: /* @__PURE__ */ l("div", { className: "absolute inset-0 bg-gradient-to-br from-secondary to-transparent" }) }),
      /* @__PURE__ */ p("div", { className: "max-w-container-max mx-auto px-gutter relative z-10", children: [
        /* @__PURE__ */ p("nav", { className: "flex items-center gap-2 mb-6 text-on-primary-container text-label-caps font-semibold uppercase tracking-wider", children: [
          /* @__PURE__ */ l("a", { className: "hover:text-secondary-fixed", href: o.homePath ?? "/index.html", children: i("publicBaked.home") }),
          /* @__PURE__ */ l("span", { className: "material-symbols-outlined text-[14px]", children: "chevron_right" }),
          /* @__PURE__ */ l("span", { className: "text-secondary-fixed", children: r.name })
        ] }),
        /* @__PURE__ */ p("div", { className: "max-w-3xl", children: [
          /* @__PURE__ */ l("h1", { className: "text-h1 font-bold text-on-primary mb-6", children: r.name }),
          r.description && /* @__PURE__ */ l("p", { className: "text-body-lg text-on-primary-container leading-relaxed", children: r.description }),
          t && /* @__PURE__ */ p(
            "a",
            {
              href: t,
              className: "inline-flex items-center gap-2 mt-stack-md text-secondary-fixed hover:text-on-primary",
              children: [
                /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "rss_feed" }),
                i("publicBaked.follow")
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ l("section", { className: "max-w-container-max mx-auto px-gutter py-16", children: /* @__PURE__ */ p("div", { className: "flex flex-col lg:flex-row gap-12", children: [
      /* @__PURE__ */ p("div", { className: "flex-1", children: [
        e.length === 0 ? /* @__PURE__ */ l("p", { className: "text-on-surface-variant", children: i("publicBaked.noPostsCategory") }) : /* @__PURE__ */ l("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-lg", children: e.map((s) => /* @__PURE__ */ p(
          "article",
          {
            className: "bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col group",
            children: [
              s.hero && /* @__PURE__ */ p(
                "a",
                {
                  href: `/${s.url}`,
                  className: "relative aspect-video overflow-hidden block",
                  children: [
                    /* @__PURE__ */ l(
                      "img",
                      {
                        src: Qe(s.hero, "medium"),
                        alt: s.hero.alt ?? s.title,
                        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      }
                    ),
                    /* @__PURE__ */ l("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ l("span", { className: "bg-secondary/90 text-on-secondary text-label-caps font-semibold px-3 py-1 rounded-full backdrop-blur", children: r.name }) })
                  ]
                }
              ),
              /* @__PURE__ */ p("div", { className: "p-6 flex flex-col flex-1", children: [
                s.dateLabel && /* @__PURE__ */ l("span", { className: "text-label-caps font-semibold text-on-primary-container mb-2", children: s.dateLabel }),
                /* @__PURE__ */ l("h3", { className: "text-h3 font-semibold text-primary mb-3 group-hover:text-secondary transition-colors", children: /* @__PURE__ */ l("a", { href: `/${s.url}`, children: s.title }) }),
                s.excerpt && /* @__PURE__ */ l("p", { className: "text-body-md text-on-surface-variant mb-6 flex-1", children: s.excerpt }),
                /* @__PURE__ */ p(
                  "a",
                  {
                    href: `/${s.url}`,
                    className: "inline-flex items-center gap-2 text-button font-semibold text-secondary group-hover:gap-3 transition-all",
                    children: [
                      i("publicBaked.readMore"),
                      /* @__PURE__ */ l("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
                    ]
                  }
                )
              ] })
            ]
          },
          s.id
        )) }),
        n && /* @__PURE__ */ l("div", { className: "mt-stack-lg flex justify-center", children: /* @__PURE__ */ l("a", { className: "archives-link", href: n.href, children: n.label }) })
      ] }),
      /* @__PURE__ */ l("aside", { className: "w-full lg:w-80 shrink-0 space-y-stack-lg", children: a && a.length > 0 && /* @__PURE__ */ p("div", { className: "bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm", children: [
        /* @__PURE__ */ l("h4", { className: "text-h3 font-semibold text-primary mb-stack-md", children: i("publicBaked.section") }),
        /* @__PURE__ */ l("ul", { className: "space-y-3", children: a.map((s) => {
          const c = s.id === r.id;
          return /* @__PURE__ */ l("li", { children: /* @__PURE__ */ l(
            "a",
            {
              href: `/${nn(s)}`,
              className: "flex justify-between items-center group",
              children: /* @__PURE__ */ l(
                "span",
                {
                  className: c ? "text-secondary font-bold" : "text-on-surface-variant group-hover:text-secondary transition-colors",
                  children: s.name
                }
              )
            }
          ) }, s.id);
        }) })
      ] }) })
    ] }) })
  ] });
}
function uo({
  author: r,
  posts: e,
  site: t
}) {
  const n = Ee.getFixedT(Le(t.settings.language), "theme-corporate"), a = r.avatar ? Qe(r.avatar, "medium") : "";
  return /* @__PURE__ */ p(Se, { children: [
    /* @__PURE__ */ l("header", { className: "bg-surface-container-low py-section-padding", children: /* @__PURE__ */ l("div", { className: "max-w-container-max mx-auto px-gutter", children: /* @__PURE__ */ p("div", { className: "flex flex-col md:flex-row items-center md:items-start gap-stack-lg", children: [
      /* @__PURE__ */ l("div", { className: "w-48 h-48 rounded-xl overflow-hidden shadow-xl flex-shrink-0 bg-surface-container-high", children: a && /* @__PURE__ */ l(
        "img",
        {
          src: a,
          alt: r.displayName,
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ p("div", { className: "flex-grow text-center md:text-left", children: [
        /* @__PURE__ */ p("div", { className: "flex flex-col md:flex-row md:items-center gap-4 mb-4", children: [
          /* @__PURE__ */ l("h1", { className: "text-h1 font-bold text-primary", children: r.displayName }),
          r.title && /* @__PURE__ */ l("span", { className: "bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps font-semibold inline-block self-center md:self-auto", children: r.title })
        ] }),
        r.bio && /* @__PURE__ */ l("p", { className: "text-body-lg text-on-surface-variant max-w-3xl mb-stack-lg", children: r.bio }),
        r.socials && r.socials.length > 0 && /* @__PURE__ */ l("div", { className: "flex justify-center md:justify-start gap-stack-md", children: r.socials.map((o) => /* @__PURE__ */ l(
          "a",
          {
            href: o.url,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": Sr(o.network),
            title: Sr(o.network),
            className: "w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary hover:text-on-secondary transition-all",
            children: /* @__PURE__ */ l(Ma, { network: o.network })
          },
          o.network
        )) })
      ] }),
      /* @__PURE__ */ p("div", { className: "bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center min-w-[200px]", children: [
        /* @__PURE__ */ l("span", { className: "text-h2 font-bold text-secondary", children: e.length }),
        /* @__PURE__ */ l("span", { className: "text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider", children: n("publicBaked.articlesPublished") })
      ] })
    ] }) }) }),
    /* @__PURE__ */ l("section", { className: "max-w-container-max mx-auto px-gutter py-section-padding", children: e.length === 0 ? /* @__PURE__ */ l("p", { className: "text-on-surface-variant", children: n("publicBaked.noPostsAuthor") }) : /* @__PURE__ */ l("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-stack-md", children: e.map((o) => /* @__PURE__ */ p(
      "article",
      {
        className: "bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 hover:shadow-lg transition-all group",
        children: [
          o.hero && /* @__PURE__ */ l("a", { href: `/${o.url}`, className: "block h-48 overflow-hidden", children: /* @__PURE__ */ l(
            "img",
            {
              src: Qe(o.hero, "medium"),
              alt: o.hero.alt ?? o.title,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ) }),
          /* @__PURE__ */ p("div", { className: "p-6", children: [
            /* @__PURE__ */ p("div", { className: "flex items-center gap-2 mb-3", children: [
              o.category && /* @__PURE__ */ l("span", { className: "text-label-caps font-semibold text-secondary", children: o.category.name }),
              o.dateLabel && /* @__PURE__ */ p(Se, { children: [
                /* @__PURE__ */ l("span", { className: "text-on-surface-variant", children: "•" }),
                /* @__PURE__ */ l("span", { className: "text-label-caps font-semibold text-on-surface-variant", children: o.dateLabel })
              ] })
            ] }),
            /* @__PURE__ */ l("h3", { className: "text-h3 font-semibold text-primary mb-3 group-hover:text-secondary transition-colors", children: /* @__PURE__ */ l("a", { href: `/${o.url}`, children: o.title }) }),
            o.excerpt && /* @__PURE__ */ l("p", { className: "text-body-md text-on-surface-variant mb-stack-md line-clamp-3", children: o.excerpt }),
            /* @__PURE__ */ p(
              "a",
              {
                href: `/${o.url}`,
                className: "inline-flex items-center gap-2 text-button font-semibold text-secondary group-hover:underline",
                children: [
                  n("publicBaked.readArticle"),
                  /* @__PURE__ */ l("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
                ]
              }
            )
          ] })
        ]
      },
      o.id
    )) }) })
  ] });
}
function po({
  message: r,
  site: e
}) {
  const t = Ee.getFixedT(Le(e.settings.language), "theme-corporate");
  return /* @__PURE__ */ l("section", { className: "max-w-container-max mx-auto px-gutter py-section-padding", children: /* @__PURE__ */ p("div", { className: "max-w-2xl mx-auto text-center", children: [
    /* @__PURE__ */ l("p", { className: "text-label-caps font-semibold text-secondary uppercase tracking-wider mb-stack-md", children: t("publicBaked.notFoundTitle") }),
    /* @__PURE__ */ l("h1", { className: "text-h1 font-bold text-primary mb-stack-md", children: r ?? t("publicBaked.notFoundMessage") }),
    /* @__PURE__ */ p(
      "a",
      {
        href: "/index.html",
        className: "inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-xl text-button font-semibold hover:bg-secondary/90 transition-all shadow-lg",
        children: [
          t("publicBaked.backToHome"),
          /* @__PURE__ */ l("span", { className: "material-symbols-outlined", children: "arrow_forward" })
        ]
      }
    )
  ] }) });
}
const Er = '@import"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";@import"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--font-sans),Inter,system-ui,sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}:root{--color-primary:9 20 38;--color-on-primary:255 255 255;--color-primary-container:30 41 59;--color-on-primary-container:133 144 166;--color-primary-fixed:216 227 251;--color-primary-fixed-dim:188 199 222;--color-on-primary-fixed:17 28 45;--color-on-primary-fixed-variant:60 71 90;--color-secondary:75 65 225;--color-on-secondary:255 255 255;--color-secondary-container:100 94 251;--color-on-secondary-container:255 251 255;--color-secondary-fixed:226 223 255;--color-secondary-fixed-dim:195 192 255;--color-tertiary:0 22 36;--color-on-tertiary:255 255 255;--color-tertiary-container:0 44 66;--color-on-tertiary-container:0 153 217;--color-tertiary-fixed:201 230 255;--color-tertiary-fixed-dim:137 206 255;--color-background:247 249 251;--color-surface:247 249 251;--color-surface-bright:247 249 251;--color-surface-container-lowest:255 255 255;--color-surface-container-low:242 244 246;--color-surface-container:236 238 240;--color-surface-container-high:230 232 234;--color-surface-container-highest:224 227 229;--color-on-surface:25 28 30;--color-on-surface-variant:69 71 76;--color-outline:117 119 125;--color-outline-variant:197 198 205;--color-error:186 26 26;--color-on-error:255 255 255;--font-sans:"Inter"}body{background-color:rgb(var(--color-background));color:rgb(var(--color-on-surface));font-family:var(--font-sans),system-ui,sans-serif;-webkit-font-smoothing:antialiased}.container{width:100%}@media(min-width:640px){.container{max-width:640px}}@media(min-width:768px){.container{max-width:768px}}@media(min-width:1024px){.container{max-width:1024px}}@media(min-width:1280px){.container{max-width:1280px}}@media(min-width:1536px){.container{max-width:1536px}}.corporate-prose{font-size:1.125rem;line-height:1.75;color:rgb(var(--color-on-surface-variant))}.corporate-prose>p{margin-bottom:1.5rem}.corporate-prose>h2{font-size:2.25rem;font-weight:700;line-height:1.3;letter-spacing:-.01em;color:rgb(var(--color-primary));margin-top:2.5rem;margin-bottom:1rem}.corporate-prose>h3{font-size:1.5rem;font-weight:600;line-height:1.4;color:rgb(var(--color-primary));margin-top:2rem;margin-bottom:.75rem}.corporate-prose>blockquote{margin:2rem 0;border-left:4px solid rgb(var(--color-secondary));padding:1rem 1.5rem;font-style:italic;color:rgb(var(--color-primary));background:rgb(var(--color-surface-container-low));border-radius:0 .5rem .5rem 0}.corporate-prose>ol,.corporate-prose>ul{padding-left:1.5rem;margin-bottom:1.5rem}.corporate-prose>ul{list-style-type:disc}.corporate-prose>ol{list-style-type:decimal}.corporate-prose>ol>li,.corporate-prose>ul>li{margin-bottom:.5rem}.corporate-prose figure img,.corporate-prose img{border-radius:.75rem;margin:1.5rem 0;box-shadow:0 4px 6px -1px #00000014}.corporate-prose a{color:rgb(var(--color-secondary));font-weight:500;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}.corporate-prose a:hover{text-decoration-thickness:2px}.corporate-prose code{background:rgb(var(--color-surface-container));padding:.125rem .375rem;border-radius:.25rem;font-size:.95em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.corporate-prose pre{background:rgb(var(--color-primary));color:rgb(var(--color-on-primary));padding:1rem 1.25rem;border-radius:.75rem;overflow-x:auto;margin:1.5rem 0}.corporate-prose pre code{background:transparent;padding:0;color:inherit}.corporate-no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.corporate-no-scrollbar::-webkit-scrollbar{display:none}.corporate-slide{flex:0 0 100%;min-width:0}@media(min-width:768px){.corporate-slide{flex:0 0 calc(33.33333% - 1.33333rem)}}.glass-card{background:#ffffffb3;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(226,232,240,.5)}.burger-toggle{background:transparent;border:0;cursor:pointer;padding:.25rem;line-height:0}.burger-menu{position:fixed;top:0;left:0;height:100vh;width:min(360px,80vw);background:rgb(var(--color-background));border-right:1px solid rgb(var(--color-outline-variant));transform:translate(-100%);transition:transform .25s ease;z-index:60;padding:4rem 1.5rem 1.5rem;overflow-y:auto}.burger-menu.is-open{transform:translate(0)}.burger-menu ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.25rem}.burger-menu a{display:block;padding:.625rem 0;color:rgb(var(--color-on-surface));font-size:1.125rem;font-weight:500;text-decoration:none}.burger-menu a:hover{color:rgb(var(--color-secondary))}.burger-menu a[aria-current=page]{color:rgb(var(--color-secondary));font-weight:700}.burger-menu .menu-children{margin-left:1rem;margin-top:.25rem}.burger-menu .menu-children a{font-size:1rem;font-weight:400}.burger-close{position:absolute;top:1rem;right:1rem;background:transparent;border:0;color:rgb(var(--color-on-surface));cursor:pointer;padding:.5rem}.burger-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;background:#0006;opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:55}.burger-backdrop.is-open{opacity:1;pointer-events:auto}body.burger-open{overflow:hidden}.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;vertical-align:middle;line-height:1}.floating-label-group{position:relative}.floating-label-group input,.floating-label-group label,.floating-label-group select,.floating-label-group textarea{background:rgb(var(--color-surface-container-lowest))}.floating-label-group label{position:absolute;top:1rem;left:1rem;pointer-events:none;transition:all .2s ease;color:rgb(var(--color-outline));padding:0 .25rem}.floating-label-group input:not(:-moz-placeholder)~label,.floating-label-group textarea:not(:-moz-placeholder)~label{top:-.5rem;left:.75rem;font-size:.75rem;color:rgb(var(--color-secondary))}.floating-label-group input:focus~label,.floating-label-group input:not(:placeholder-shown)~label,.floating-label-group textarea:focus~label,.floating-label-group textarea:not(:placeholder-shown)~label,.floating-label-group.is-filled label{top:-.5rem;left:.75rem;font-size:.75rem;color:rgb(var(--color-secondary))}.corporate-bio-card{background:rgb(var(--color-surface-container-lowest));border:1px solid rgb(var(--color-outline-variant)/.4);border-radius:.75rem;padding:2rem;box-shadow:0 1px 3px #0000000f}.corporate-bio-eyebrow{font-size:.75rem;font-weight:600;letter-spacing:.05em;color:rgb(var(--color-secondary));text-transform:uppercase;margin-bottom:1rem}.corporate-bio-row{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}.corporate-bio-avatar{width:4rem;height:4rem;border-radius:9999px;-o-object-fit:cover;object-fit:cover}.corporate-bio-name{font-size:1.5rem;font-weight:600;line-height:1.3;color:rgb(var(--color-primary))}.corporate-bio-title{font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase}.corporate-bio-bio,.corporate-bio-title{color:rgb(var(--color-on-surface-variant))}.corporate-bio-bio{font-size:1rem;line-height:1.6;margin-bottom:1rem}.corporate-bio-socials{display:flex;gap:.5rem}.corporate-bio-social{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:9999px;color:rgb(var(--color-on-surface-variant));transition:color .15s ease,background-color .15s ease}.corporate-bio-social:hover{color:rgb(var(--color-secondary));background:rgb(var(--color-secondary-fixed))}.corporate-related-card{background:rgb(var(--color-surface-container-lowest));border:1px solid rgb(var(--color-outline-variant)/.3);border-radius:.75rem;padding:1.5rem}.corporate-related-heading{font-size:1.5rem;font-weight:600;color:rgb(var(--color-primary));margin-bottom:1.5rem}.corporate-related-list{display:flex;flex-direction:column;gap:1rem}.corporate-related-item{display:block;padding:.75rem 0}.corporate-related-item+.corporate-related-item{border-top:1px solid rgb(var(--color-outline-variant)/.2)}.corporate-related-eyebrow{font-size:.75rem;font-weight:600;letter-spacing:.05em;color:rgb(var(--color-secondary));text-transform:uppercase;margin-bottom:.25rem}.corporate-related-title{font-size:.875rem;font-weight:600;line-height:1.4;color:rgb(var(--color-primary));transition:color .15s ease;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.corporate-related-item:hover .corporate-related-title{color:rgb(var(--color-secondary))}.corporate-related-meta{font-size:.75rem;font-weight:600;letter-spacing:.05em;color:rgb(var(--color-on-surface-variant));margin-top:.25rem}.corporate-cta-card{background:rgb(var(--color-primary));color:rgb(var(--color-on-primary));border-radius:.75rem;padding:2rem;position:relative;overflow:hidden;box-shadow:0 10px 25px -5px #0003}.corporate-cta-card:after{content:"";position:absolute;bottom:-2.5rem;right:-2.5rem;width:10rem;height:10rem;background:rgb(var(--color-secondary));border-radius:9999px;filter:blur(80px);opacity:.2;pointer-events:none}.archives{max-width:56rem;margin:0 auto;padding:2.5rem 0}.archives__header{margin-bottom:2.5rem;padding-bottom:1.5rem;border-bottom:1px solid rgb(var(--color-outline-variant)/.5)}.archives__title{font-size:3rem;font-weight:700;line-height:1.2;letter-spacing:-.02em;color:rgb(var(--color-primary))}.archives__subtitle{font-size:1.125rem;color:rgb(var(--color-on-surface-variant));margin-top:.75rem}.archives__groups,.archives__years{display:flex;flex-direction:column;gap:2.5rem}.archives__year{border-radius:.75rem;background:rgb(var(--color-surface-container-lowest));border:1px solid rgb(var(--color-outline-variant)/.3);padding:1.5rem 2rem;box-shadow:0 1px 3px #0000000a}.archives__group-heading,.archives__year-heading{font-size:1.5rem;font-weight:600;color:rgb(var(--color-primary));margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid rgb(var(--color-outline-variant)/.4)}.archives__group-link,.archives__year-link{color:inherit;text-decoration:none}.archives__group-link:hover,.archives__year-link:hover{color:rgb(var(--color-secondary))}.archives__list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem}.archives__item{display:flex;align-items:baseline;gap:.75rem;padding:.5rem 0}.archives__item+.archives__item{border-top:1px solid rgb(var(--color-outline-variant)/.2)}.archives__item-date{flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.05em;color:rgb(var(--color-on-surface-variant));text-transform:uppercase;min-width:5rem}.archives__item-link{color:rgb(var(--color-on-surface));text-decoration:none;font-weight:500;transition:color .15s ease}.archives__item-link:hover{color:rgb(var(--color-secondary))}.archives__count{color:rgb(var(--color-on-surface-variant));font-size:.875rem;font-weight:400;margin-left:.5rem}.archives__drilldown{list-style:none;padding:0;margin:1rem 0 0;display:flex;flex-wrap:wrap;gap:.5rem}.archives__drilldown-item{list-style:none}.archives__drilldown-link{display:inline-block;padding:.375rem .875rem;background:rgb(var(--color-surface-container-low));border:1px solid rgb(var(--color-outline-variant)/.4);border-radius:9999px;color:rgb(var(--color-on-surface));text-decoration:none;font-size:.875rem;font-weight:500;transition:background-color .15s ease,color .15s ease}.archives__drilldown-link:hover{background:rgb(var(--color-secondary));color:rgb(var(--color-on-secondary))}.archives__back{display:inline-flex;align-items:center;gap:.375rem;color:rgb(var(--color-secondary));text-decoration:none;font-size:.875rem;font-weight:600;margin-bottom:1rem}.archives__back:hover{text-decoration:underline}.archives__empty{color:rgb(var(--color-on-surface-variant));font-style:italic;padding:2rem 0;text-align:center}.archives-link{display:inline-flex;align-items:center;gap:.375rem;margin-top:1.5rem;color:rgb(var(--color-secondary));text-decoration:none;font-weight:600}.archives-link:hover{text-decoration:underline}.pointer-events-none{pointer-events:none}.visible{visibility:visible}.invisible{visibility:hidden}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.-bottom-20{bottom:-5rem}.-right-20{right:-5rem}.bottom-0{bottom:0}.bottom-8{bottom:2rem}.left-0{left:0}.left-4{left:1rem}.right-0{right:0}.right-4{right:1rem}.right-8{right:2rem}.top-0{top:0}.top-1\\/2{top:50%}.top-4{top:1rem}.-z-0,.z-0{z-index:0}.z-10{z-index:10}.z-40{z-index:40}.z-50{z-index:50}.col-span-2{grid-column:span 2/span 2}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.-mb-px{margin-bottom:-1px}.mb-10{margin-bottom:2.5rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mb-section-padding{margin-bottom:5rem}.mb-stack-lg{margin-bottom:2rem}.mb-stack-md{margin-bottom:1rem}.mb-stack-sm{margin-bottom:.5rem}.ml-6{margin-left:1.5rem}.mr-1{margin-right:.25rem}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-section-padding{margin-top:5rem}.mt-stack-lg{margin-top:2rem}.mt-stack-md{margin-top:1rem}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-2,.line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical}.line-clamp-3{-webkit-line-clamp:3}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.aspect-\\[16\\/10\\]{aspect-ratio:16/10}.aspect-\\[21\\/9\\]{aspect-ratio:21/9}.aspect-video{aspect-ratio:16/9}.h-10{height:2.5rem}.h-12{height:3rem}.h-14{height:3.5rem}.h-16{height:4rem}.h-20{height:5rem}.h-3{height:.75rem}.h-4{height:1rem}.h-48{height:12rem}.h-5{height:1.25rem}.h-64{height:16rem}.h-8{height:2rem}.h-96{height:24rem}.h-full{height:100%}.min-h-\\[600px\\]{min-height:600px}.w-10{width:2.5rem}.w-12{width:3rem}.w-14{width:3.5rem}.w-24{width:6rem}.w-3{width:.75rem}.w-4{width:1rem}.w-40{width:10rem}.w-48{width:12rem}.w-5{width:1.25rem}.w-64{width:16rem}.w-96{width:24rem}.w-auto{width:auto}.w-full{width:100%}.min-w-0{min-width:0}.min-w-\\[200px\\]{min-width:200px}.max-w-2xl{max-width:42rem}.max-w-3xl{max-width:48rem}.max-w-4xl{max-width:56rem}.max-w-\\[240px\\]{max-width:240px}.max-w-container-max{max-width:1280px}.max-w-sm{max-width:24rem}.max-w-xl{max-width:36rem}.flex-1{flex:1 1 0%}.flex-shrink-0,.shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.-translate-x-1\\/2{--tw-translate-x:-50%}.-translate-x-1\\/2,.-translate-y-1\\/2{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y:-50%}.translate-x-1\\/2{--tw-translate-x:50%}.translate-x-1\\/2,.translate-y-1\\/2{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-y-1\\/2{--tw-translate-y:50%}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(1turn)}}.animate-spin{animation:spin 1s linear infinite}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.snap-x{scroll-snap-type:x var(--tw-scroll-snap-strictness)}.snap-mandatory{--tw-scroll-snap-strictness:mandatory}.snap-start{scroll-snap-align:start}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-\\[1fr_2fr_auto\\]{grid-template-columns:1fr 2fr auto}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-12{gap:3rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-8,.gap-stack-lg{gap:2rem}.gap-stack-md{gap:1rem}.gap-stack-sm{gap:.5rem}.gap-x-8{-moz-column-gap:2rem;column-gap:2rem}.gap-y-3{row-gap:.75rem}.-space-x-1>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(-.25rem*var(--tw-space-x-reverse));margin-left:calc(-.25rem*(1 - var(--tw-space-x-reverse)))}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.25rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem*var(--tw-space-y-reverse))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem*var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem*var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem*var(--tw-space-y-reverse))}.space-y-section-padding>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(5rem*var(--tw-space-y-reverse))}.space-y-stack-lg>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem*var(--tw-space-y-reverse))}.space-y-stack-md>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.self-center{align-self:center}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.scroll-smooth{scroll-behavior:smooth}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-t{border-top-width:1px}.border-dashed{border-style:dashed}.border-blue-600{--tw-border-opacity:1;border-color:rgb(37 99 235/var(--tw-border-opacity,1))}.border-on-primary-fixed-variant\\/10{border-color:rgb(var(--color-on-primary-fixed-variant)/.1)}.border-on-primary-fixed-variant\\/20{border-color:rgb(var(--color-on-primary-fixed-variant)/.2)}.border-on-primary\\/30{border-color:rgb(var(--color-on-primary)/.3)}.border-outline{--tw-border-opacity:1;border-color:rgb(var(--color-outline)/var(--tw-border-opacity,1))}.border-outline-variant\\/10{border-color:rgb(var(--color-outline-variant)/.1)}.border-outline-variant\\/20{border-color:rgb(var(--color-outline-variant)/.2)}.border-outline-variant\\/30{border-color:rgb(var(--color-outline-variant)/.3)}.border-outline-variant\\/50{border-color:rgb(var(--color-outline-variant)/.5)}.border-secondary\\/30{border-color:rgb(var(--color-secondary)/.3)}.border-transparent{border-color:transparent}.border-white\\/30{border-color:#ffffff4d}.bg-background{--tw-bg-opacity:1;background-color:rgb(var(--color-background)/var(--tw-bg-opacity,1))}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255/var(--tw-bg-opacity,1))}.bg-primary{--tw-bg-opacity:1;background-color:rgb(var(--color-primary)/var(--tw-bg-opacity,1))}.bg-primary-container{--tw-bg-opacity:1;background-color:rgb(var(--color-primary-container)/var(--tw-bg-opacity,1))}.bg-primary\\/50{background-color:rgb(var(--color-primary)/.5)}.bg-secondary{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary)/var(--tw-bg-opacity,1))}.bg-secondary-container{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary-container)/var(--tw-bg-opacity,1))}.bg-secondary-fixed{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary-fixed)/var(--tw-bg-opacity,1))}.bg-secondary\\/10{background-color:rgb(var(--color-secondary)/.1)}.bg-secondary\\/20{background-color:rgb(var(--color-secondary)/.2)}.bg-secondary\\/90{background-color:rgb(var(--color-secondary)/.9)}.bg-surface-bright{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-bright)/var(--tw-bg-opacity,1))}.bg-surface-container{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container)/var(--tw-bg-opacity,1))}.bg-surface-container-high{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-high)/var(--tw-bg-opacity,1))}.bg-surface-container-low{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-low)/var(--tw-bg-opacity,1))}.bg-surface-container-lowest{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-lowest)/var(--tw-bg-opacity,1))}.bg-surface\\/80{background-color:rgb(var(--color-surface)/.8)}.bg-tertiary-fixed-dim\\/5{background-color:rgb(var(--color-tertiary-fixed-dim)/.05)}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.bg-white\\/10{background-color:#ffffff1a}.bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}.from-primary{--tw-gradient-from:rgb(var(--color-primary)/1) var(--tw-gradient-from-position);--tw-gradient-to:rgb(var(--color-primary)/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.from-primary\\/95{--tw-gradient-from:rgb(var(--color-primary)/.95) var(--tw-gradient-from-position);--tw-gradient-to:rgb(var(--color-primary)/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.from-secondary{--tw-gradient-from:rgb(var(--color-secondary)/1) var(--tw-gradient-from-position);--tw-gradient-to:rgb(var(--color-secondary)/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.via-primary{--tw-gradient-to:rgb(var(--color-primary)/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),rgb(var(--color-primary)/1) var(--tw-gradient-via-position),var(--tw-gradient-to)}.via-primary\\/80{--tw-gradient-to:rgb(var(--color-primary)/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),rgb(var(--color-primary)/.8) var(--tw-gradient-via-position),var(--tw-gradient-to)}.to-primary-container{--tw-gradient-to:rgb(var(--color-primary-container)/1) var(--tw-gradient-to-position)}.to-primary\\/30{--tw-gradient-to:rgb(var(--color-primary)/.3) var(--tw-gradient-to-position)}.to-transparent{--tw-gradient-to:transparent var(--tw-gradient-to-position)}.object-contain{-o-object-fit:contain;object-fit:contain}.object-cover{-o-object-fit:cover;object-fit:cover}.p-12{padding:3rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8,.p-stack-lg{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.px-8{padding-left:2rem;padding-right:2rem}.px-gutter{padding-left:1.5rem;padding-right:1.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-16{padding-top:4rem;padding-bottom:4rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-5{padding-top:1.25rem;padding-bottom:1.25rem}.py-section-padding{padding-top:5rem;padding-bottom:5rem}.pb-8{padding-bottom:2rem}.pb-section-padding{padding-bottom:5rem}.pb-stack-lg{padding-bottom:2rem}.pr-10{padding-right:2.5rem}.pt-2{padding-top:.5rem}.pt-20{padding-top:5rem}.pt-3{padding-top:.75rem}.pt-6{padding-top:1.5rem}.pt-8,.pt-stack-lg{padding-top:2rem}.pt-stack-md{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-\\[1\\.25rem\\]{font-size:1.25rem}.text-\\[120px\\]{font-size:120px}.text-\\[14px\\]{font-size:14px}.text-\\[18px\\]{font-size:18px}.text-\\[64px\\]{font-size:64px}.text-body-lg{font-size:1.125rem;line-height:1.75}.text-body-lg,.text-body-md{letter-spacing:0;font-weight:400}.text-body-md{font-size:1rem;line-height:1.6}.text-button{font-size:.875rem;line-height:1.25;letter-spacing:0;font-weight:600}.text-h1{font-size:3rem;line-height:1.2;letter-spacing:-.02em;font-weight:700}.text-h2{font-size:2.25rem;line-height:1.3;letter-spacing:-.01em;font-weight:700}.text-h3{font-size:1.5rem;line-height:1.4;letter-spacing:0;font-weight:600}.text-label-caps{font-size:.75rem;line-height:1;letter-spacing:.05em;font-weight:600}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.italic{font-style:italic}.leading-relaxed{line-height:1.625}.leading-tight{line-height:1.25}.tracking-tight{letter-spacing:-.025em}.tracking-wide{letter-spacing:.025em}.tracking-wider{letter-spacing:.05em}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246/var(--tw-text-opacity,1))}.text-error{--tw-text-opacity:1;color:rgb(var(--color-error)/var(--tw-text-opacity,1))}.text-on-primary{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}.text-on-primary-container{--tw-text-opacity:1;color:rgb(var(--color-on-primary-container)/var(--tw-text-opacity,1))}.text-on-primary-container\\/60{color:rgb(var(--color-on-primary-container)/.6)}.text-on-primary-container\\/80{color:rgb(var(--color-on-primary-container)/.8)}.text-on-secondary{--tw-text-opacity:1;color:rgb(var(--color-on-secondary)/var(--tw-text-opacity,1))}.text-on-secondary-container{--tw-text-opacity:1;color:rgb(var(--color-on-secondary-container)/var(--tw-text-opacity,1))}.text-on-surface{--tw-text-opacity:1;color:rgb(var(--color-on-surface)/var(--tw-text-opacity,1))}.text-on-surface-variant{--tw-text-opacity:1;color:rgb(var(--color-on-surface-variant)/var(--tw-text-opacity,1))}.text-outline{--tw-text-opacity:1;color:rgb(var(--color-outline)/var(--tw-text-opacity,1))}.text-primary{--tw-text-opacity:1;color:rgb(var(--color-primary)/var(--tw-text-opacity,1))}.text-red-600{--tw-text-opacity:1;color:rgb(220 38 38/var(--tw-text-opacity,1))}.text-secondary{--tw-text-opacity:1;color:rgb(var(--color-secondary)/var(--tw-text-opacity,1))}.text-secondary-fixed{--tw-text-opacity:1;color:rgb(var(--color-secondary-fixed)/var(--tw-text-opacity,1))}.text-secondary\\/20{color:rgb(var(--color-secondary)/.2)}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.underline{text-decoration-line:underline}.opacity-10{opacity:.1}.opacity-20{opacity:.2}.opacity-60{opacity:.6}.opacity-80{opacity:.8}.opacity-90{opacity:.9}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-2xl{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgba(0,0,0,.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.shadow-lg,.shadow-sm{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgba(0,0,0,.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-xl{--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-secondary\\/20{--tw-shadow-color:rgb(var(--color-secondary)/.2);--tw-shadow:var(--tw-shadow-colored)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.ring{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring,.ring-1{box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-1{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring-2{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-blue-500\\/60{--tw-ring-color:rgba(59,130,246,.6)}.blur{--tw-blur:blur(8px)}.blur,.blur-3xl{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.blur-3xl{--tw-blur:blur(64px)}.grayscale{--tw-grayscale:grayscale(100%)}.filter,.grayscale{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur{--tw-backdrop-blur:blur(8px)}.backdrop-blur,.backdrop-blur-md{-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-md{--tw-backdrop-blur:blur(12px)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-500{transition-duration:.5s}.hover\\:-translate-y-1:hover{--tw-translate-y:-.25rem}.hover\\:-translate-y-1:hover,.hover\\:translate-y-\\[-2px\\]:hover{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:translate-y-\\[-2px\\]:hover{--tw-translate-y:-2px}.hover\\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05}.hover\\:scale-105:hover,.hover\\:scale-110:hover{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:scale-110:hover{--tw-scale-x:1.1;--tw-scale-y:1.1}.hover\\:gap-3:hover{gap:.75rem}.hover\\:bg-secondary:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary)/var(--tw-bg-opacity,1))}.hover\\:bg-secondary-fixed:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary-fixed)/var(--tw-bg-opacity,1))}.hover\\:bg-secondary\\/90:hover{background-color:rgb(var(--color-secondary)/.9)}.hover\\:bg-surface-container:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container)/var(--tw-bg-opacity,1))}.hover\\:bg-surface-container-low:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-low)/var(--tw-bg-opacity,1))}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}.hover\\:bg-white\\/20:hover{background-color:#fff3}.hover\\:text-on-primary:hover{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}.hover\\:text-on-secondary:hover{--tw-text-opacity:1;color:rgb(var(--color-on-secondary)/var(--tw-text-opacity,1))}.hover\\:text-secondary:hover{--tw-text-opacity:1;color:rgb(var(--color-secondary)/var(--tw-text-opacity,1))}.hover\\:text-secondary-fixed:hover{--tw-text-opacity:1;color:rgb(var(--color-secondary-fixed)/var(--tw-text-opacity,1))}.hover\\:opacity-100:hover{opacity:1}.hover\\:opacity-90:hover{opacity:.9}.hover\\:shadow-lg:hover{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.hover\\:shadow-lg:hover,.hover\\:shadow-xl:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-xl:hover{--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color)}.hover\\:grayscale-0:hover{--tw-grayscale:grayscale(0);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.focus\\:border-secondary:focus{--tw-border-opacity:1;border-color:rgb(var(--color-secondary)/var(--tw-border-opacity,1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-2:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus\\:ring-blue-500:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(59 130 246/var(--tw-ring-opacity,1))}.focus\\:ring-secondary:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(var(--color-secondary)/var(--tw-ring-opacity,1))}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95}.active\\:scale-95:active,.active\\:scale-\\[0\\.98\\]:active{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.active\\:scale-\\[0\\.98\\]:active{--tw-scale-x:.98;--tw-scale-y:.98}.active\\:opacity-80:active{opacity:.8}.group:hover .group-hover\\:translate-x-1{--tw-translate-x:.25rem}.group:hover .group-hover\\:scale-105,.group:hover .group-hover\\:translate-x-1{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group:hover .group-hover\\:scale-105{--tw-scale-x:1.05;--tw-scale-y:1.05}.group:hover .group-hover\\:gap-3{gap:.75rem}.group:hover .group-hover\\:text-secondary{--tw-text-opacity:1;color:rgb(var(--color-secondary)/var(--tw-text-opacity,1))}.group:hover .group-hover\\:underline{text-decoration-line:underline}@media(min-width:640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}}@media(min-width:768px){.md\\:flex{display:flex}.md\\:aspect-\\[21\\/9\\]{aspect-ratio:21/9}.md\\:h-10{height:2.5rem}.md\\:min-h-\\[760px\\]{min-height:760px}.md\\:w-1\\/2{width:50%}.md\\:w-auto{width:auto}.md\\:max-w-md{max-width:28rem}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:items-start{align-items:flex-start}.md\\:items-end{align-items:flex-end}.md\\:items-center{align-items:center}.md\\:justify-start{justify-content:flex-start}.md\\:justify-between{justify-content:space-between}.md\\:self-auto{align-self:auto}.md\\:to-transparent{--tw-gradient-to:transparent var(--tw-gradient-to-position)}.md\\:p-16{padding:4rem}.md\\:p-20{padding:5rem}.md\\:text-left{text-align:left}.md\\:text-h1{font-size:3rem;line-height:1.2;letter-spacing:-.02em;font-weight:700}}@media(min-width:1024px){.lg\\:col-span-4{grid-column:span 4/span 4}.lg\\:col-span-8{grid-column:span 8/span 8}.lg\\:grid{display:grid}.lg\\:w-80{width:20rem}.lg\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:flex-row{flex-direction:row}.lg\\:gap-stack-lg{gap:2rem}.lg\\:p-12{padding:3rem}}@media(min-width:1280px){.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(prefers-color-scheme:dark){.dark\\:border-blue-500{--tw-border-opacity:1;border-color:rgb(59 130 246/var(--tw-border-opacity,1))}.dark\\:bg-blue-950\\/30{background-color:#1725544d}}@media(min-width:768px){.md\\:\\[\\&\\>\\:first-child\\]\\:order-2>:first-child{order:2}}', ho = `/**
 * Corporate theme — runtime menu loader.
 *
 * Same contract as the default + magazine themes: fetches /data/menu.json
 * and paints every \`[data-cms-menu]\` container on the page. The corporate
 * header ships TWO such containers — the inline horizontal nav (visible
 * md+) and the off-canvas burger overlay (always present, opens on
 * burger-toggle click). Both get populated from the same menu data,
 * styled differently by their parent classes.
 *
 * Differences vs magazine:
 *   - The injected logo \`<img>\` gets utility classes that fit the
 *     corporate header height (\`h-8 w-auto\`).
 *   - Inline nav links carry the corporate hover styling via
 *     \`data-cms-menu-inline\` rendering — see the \`paint\` function
 *     branch below.
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

  // Burger / off-canvas list item: simple <a> with optional nested <ul>
  // for children. Kept identical to the magazine theme so the styling
  // in \`.burger-menu\` works without extra branches.
  function renderBurgerItem(item) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = item.href || "#";
    a.textContent = pickLabel(item);
    if (samePath(a.href)) {
      a.setAttribute("aria-current", "page");
    }
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

  // Inline header nav: horizontal flex of <a> elements. The active
  // page gets \`text-secondary font-bold\`; siblings get the default
  // \`text-on-surface-variant\` + hover-to-secondary state. We don't
  // render children (a corporate top nav stays one level deep).
  function renderInlineItem(item) {
    var a = document.createElement("a");
    a.href = item.href || "#";
    a.textContent = pickLabel(item);
    var active = samePath(a.href);
    if (active) {
      a.setAttribute("aria-current", "page");
      a.className = "text-secondary font-bold transition-colors";
    } else {
      a.className =
        "text-on-surface-variant font-medium hover:text-secondary transition-colors";
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
        // Replace direct children with horizontal links. The host
        // itself is the \`<nav>\` flex container.
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
      if (items.length === 0 && !isBurgerMenu) {
        host.setAttribute("hidden", "");
      } else {
        host.removeAttribute("hidden");
      }
    });
    // Hide the burger TOGGLE button when the header menu has no
    // items — otherwise users see a button that opens an empty
    // off-canvas panel and conclude "the burger is broken".
    var headerItems = (menu && menu.header) || [];
    document.querySelectorAll(".burger-toggle").forEach(function (toggle) {
      if (headerItems.length === 0) {
        toggle.setAttribute("hidden", "");
      } else {
        toggle.removeAttribute("hidden");
      }
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
      // Comfortable height for the corporate header bar (h-20 / 5rem).
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
    close.addEventListener("click", function () {
      setOpen(false);
    });
    backdrop.addEventListener("click", function () {
      setOpen(false);
    });
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
`, mo = `/**
 * Corporate theme — runtime sidebar loader.
 *
 * Populates \`[data-cms-related]\` and \`[data-cms-author-bio]\` hosts
 * from \`/data/posts.json\` and \`/data/authors.json\`. Same lifecycle as
 * the magazine + default themes: fetched once on DOMContentLoaded;
 * paint passes are independent and tolerate each other's failure.
 *
 * The injected DOM uses corporate-specific class names
 * (\`corporate-bio-*\`, \`corporate-related-*\`) — matching CSS rules
 * live in \`theme.css\` under \`@layer components\`.
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

  // ─── Related / popular articles ───────────────────────────────────
  //
  // DOM emitted matches the corporate single-post mockup — a card with
  // a heading and a list of items; each item is an <a> with a colored
  // category eyebrow, line-clamped title, and a small date meta line.
  //
  //   <div class="corporate-related-card">
  //     <h4 class="corporate-related-heading">Articles populaires</h4>
  //     <div class="corporate-related-list">
  //       <a class="corporate-related-item" href="/...">
  //         <p class="corporate-related-eyebrow">Category</p>
  //         <p class="corporate-related-title">Title</p>
  //         <p class="corporate-related-meta">Jan 12 • 5 min read</p>
  //       </a>
  //       …
  //     </div>
  //   </div>
  //
  // The card chrome (background/border/padding) lives in the host
  // element itself via \`.corporate-related-card\` — see the
  // SingleTemplate sidebar markup.

  function renderRelatedItem(entry) {
    var a = document.createElement("a");
    a.href = "/" + entry.url;
    a.className = "corporate-related-item";
    if (entry.category && entry.category.name) {
      var eyebrow = document.createElement("p");
      eyebrow.className = "corporate-related-eyebrow";
      eyebrow.textContent = entry.category.name;
      a.appendChild(eyebrow);
    }
    var title = document.createElement("p");
    title.className = "corporate-related-title";
    title.textContent = entry.title || "";
    a.appendChild(title);
    if (entry.dateLabel) {
      var meta = document.createElement("p");
      meta.className = "corporate-related-meta";
      meta.textContent = entry.dateLabel;
      a.appendChild(meta);
    }
    return a;
  }

  function renderRelated(host, posts) {
    var termId = host.getAttribute("data-cms-term-id") || "";
    var currentId = host.getAttribute("data-cms-current-id") || "";
    var limit = parseInt(host.getAttribute("data-cms-limit") || "3", 10);
    var label = host.getAttribute("data-cms-label") || "Popular articles";
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
    headingEl.className = "corporate-related-heading";
    headingEl.textContent = heading;
    host.appendChild(headingEl);
    var list = document.createElement("div");
    list.className = "corporate-related-list";
    matching.forEach(function (entry) {
      list.appendChild(renderRelatedItem(entry));
    });
    host.appendChild(list);
  }

  // ─── Author bio ───────────────────────────────────────────────────
  //
  // DOM emitted (matches the corporate single-post sidebar mockup —
  // round avatar + name in headline weight + label-caps title +
  // bio paragraph + circular social icon row):
  //
  //   <h4 class="corporate-bio-eyebrow">Author</h4>
  //   <div class="corporate-bio-row">
  //     <img class="corporate-bio-avatar" />
  //     <div>
  //       <p class="corporate-bio-name">…</p>
  //       <p class="corporate-bio-title">Senior Strategist</p>
  //     </div>
  //   </div>
  //   <p class="corporate-bio-bio">…</p>
  //   <div class="corporate-bio-socials">
  //     <a href="…" class="corporate-bio-social"> [icon] </a>
  //   </div>

  function authorAvatar(name, url) {
    if (!url) {
      // Fallback initials box — same color tokens as the avatar
      // when the author hasn't uploaded an image.
      var span = document.createElement("span");
      span.className = "corporate-bio-avatar";
      span.style.display = "inline-flex";
      span.style.alignItems = "center";
      span.style.justifyContent = "center";
      span.style.background = "rgb(var(--color-secondary-fixed))";
      span.style.color = "rgb(var(--color-secondary))";
      span.style.fontWeight = "700";
      span.setAttribute("aria-hidden", "true");
      span.textContent = (function () {
        if (!name) return "?";
        var parts = name.trim().split(/\\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
      })();
      return span;
    }
    var img = document.createElement("img");
    img.className = "corporate-bio-avatar";
    img.src = url;
    img.alt = name || "";
    img.loading = "lazy";
    return img;
  }

  function renderAuthorBio(host, authors) {
    var authorId = host.getAttribute("data-cms-author-id") || "";
    if (!authorId) return;
    var entry = authors[authorId];
    if (!entry) return;

    host.innerHTML = "";

    // Eyebrow label — "Author" or whatever the host configured. The
    // host can override it via data-cms-bio-label for i18n.
    var eyebrow = document.createElement("h4");
    eyebrow.className = "corporate-bio-eyebrow";
    eyebrow.textContent = host.getAttribute("data-cms-bio-label") || "Author";
    host.appendChild(eyebrow);

    var row = document.createElement("div");
    row.className = "corporate-bio-row";
    row.appendChild(authorAvatar(entry.displayName, entry.avatar));

    var nameWrap = document.createElement("div");
    var nameEl;
    if (entry.url) {
      nameEl = document.createElement("a");
      nameEl.href = "/" + entry.url;
    } else {
      nameEl = document.createElement("p");
    }
    nameEl.className = "corporate-bio-name";
    nameEl.textContent = entry.displayName || "";
    nameWrap.appendChild(nameEl);

    if (entry.title) {
      var role = document.createElement("p");
      role.className = "corporate-bio-title";
      role.textContent = entry.title;
      nameWrap.appendChild(role);
    }
    row.appendChild(nameWrap);
    host.appendChild(row);

    if (entry.bio) {
      var bio = document.createElement("p");
      bio.className = "corporate-bio-bio";
      bio.textContent = entry.bio;
      host.appendChild(bio);
    }

    // Visible socials — already filtered server-side. Each entry
    // produces an icon link to the user's external profile, opened in
    // a new tab with rel=noopener noreferrer.
    if (entry.socials && entry.socials.length) {
      var socials = document.createElement("div");
      socials.className = "corporate-bio-socials";
      for (var i = 0; i < entry.socials.length; i++) {
        var s = entry.socials[i];
        var a = document.createElement("a");
        a.className = "corporate-bio-social";
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

  // ─── Share buttons ────────────────────────────────────────────────
  //
  // Wires up \`[data-cms-share]\` buttons in the body. The single-post
  // template emits two: \`data-cms-share="native"\` (Web Share API
  // fallback to copy-link when unsupported) and \`data-cms-share="copy"\`
  // (clipboard write of the page URL). Visual feedback is a brief
  // text/title swap so the user knows the click registered without
  // needing a toast library.

  function showFlash(button, glyphName) {
    var icon = button.querySelector(".material-symbols-outlined");
    if (!icon) return;
    var original = icon.textContent;
    icon.textContent = glyphName;
    setTimeout(function () {
      icon.textContent = original;
    }, 1400);
  }

  function copyLink(button) {
    var url = window.location.href;
    var done = function () { showFlash(button, "check"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () {
        // Fallback when the clipboard write is denied (e.g. insecure
        // context) — select-and-copy the URL via a temporary textarea.
        legacyCopy(url);
        done();
      });
    } else {
      legacyCopy(url);
      done();
    }
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {
      console.warn("[cms] clipboard copy failed:", e);
    }
  }

  function shareNative(button) {
    var url = window.location.href;
    var title = document.title || "";
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {
        // User cancelled or the share sheet failed — silent.
      });
    } else {
      copyLink(button);
    }
  }

  function wireShareButtons() {
    document.querySelectorAll("[data-cms-share]").forEach(function (button) {
      var mode = button.getAttribute("data-cms-share");
      button.addEventListener("click", function () {
        if (mode === "copy") copyLink(button);
        else shareNative(button);
      });
    });
  }

  // ─── Contact form ─────────────────────────────────────────────────
  //
  // Intercepts submit on every \`[data-cms-form]\` form. Two modes are
  // surfaced in the contact-form block's inspector:
  //   - "endpoint" (default) → POST a JSON body to a third-party
  //     form service (Formspree, Web3Forms, etc.). Success / error
  //     messages from \`[data-cms-form-success]\` / \`[data-cms-form-error]\`
  //     toggle visibility based on the response status.
  //   - "mailto" → build a \`mailto:\` URL with the subject + body
  //     pre-filled, then \`window.location.href\` to it. No JS-only
  //     state to manage.
  // When the form has neither a configured endpoint nor a mailto
  // address (most likely during initial setup), submit is left to
  // the browser's default behavior so the user notices the missing
  // configuration.

  function asUrlEncoded(formData) {
    var pairs = [];
    formData.forEach(function (value, key) {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return pairs.join("&");
  }

  function showFormStatus(form, kind) {
    ["success", "error"].forEach(function (k) {
      var el = form.querySelector("[data-cms-form-" + k + "]");
      if (el) {
        if (k === kind) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      }
    });
  }

  function buildMailto(form, address) {
    var data = new FormData(form);
    var subject = data.get("subject") || "Contact form submission";
    var lines = [];
    data.forEach(function (value, key) {
      if (key === "subject" || key === "consent") return;
      lines.push(key + ": " + value);
    });
    return (
      "mailto:" +
      encodeURIComponent(address) +
      "?subject=" +
      encodeURIComponent(String(subject)) +
      "&body=" +
      encodeURIComponent(lines.join("\\n\\n"))
    );
  }

  function handleFormSubmit(form, mode, endpoint, mailtoAddress, event) {
    if (mode === "mailto") {
      if (!mailtoAddress) return; // No config — let the browser handle.
      event.preventDefault();
      window.location.href = buildMailto(form, mailtoAddress);
      return;
    }
    if (!endpoint) return; // No endpoint configured — fall through.
    event.preventDefault();
    var data = new FormData(form);
    var submitButton = form.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: asUrlEncoded(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showFormStatus(form, "success");
        form.reset();
      })
      .catch(function (err) {
        console.warn("[cms] contact form submit failed:", err);
        showFormStatus(form, "error");
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  }

  // ─── Featured posts chevrons ──────────────────────────────────────
  //
  // The home's featured-posts section ships decorative prev/next
  // chevrons (matching the mockup). On md+ the layout is a static
  // 3-col grid — the chevrons scroll smoothly to the next/previous
  // card slot. On mobile (single column with horizontal overflow if
  // the grid is repurposed as a slider in a future iteration), they
  // page through one card width at a time.
  function wireFeaturedChevrons() {
    var track = document.querySelector("[data-cms-featured-track]");
    if (!track) return;
    var prev = document.querySelector("[data-cms-featured-prev]");
    var next = document.querySelector("[data-cms-featured-next]");
    function step(dir) {
      var cards = track.children;
      if (!cards || cards.length === 0) return;
      var card = cards[0];
      var width = card.getBoundingClientRect().width;
      // Read the actual computed gap from the flex container so the
      // scroll step matches the visual rhythm. The \`gap\` shorthand
      // resolves to a px value in the computed style (e.g. "32px"
      // when Tailwind's gap-stack-lg = 2rem at 16px root font-size).
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      track.scrollBy({ left: dir * (width + gap), behavior: "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
  }

  function wireContactForms() {
    document.querySelectorAll("[data-cms-form]").forEach(function (form) {
      var mode = form.getAttribute("data-cms-form") || "endpoint";
      var endpoint = form.getAttribute("data-cms-form-endpoint") || "";
      var mailtoAddress = form.getAttribute("data-cms-form-mailto") || "";
      form.addEventListener("submit", function (event) {
        handleFormSubmit(form, mode, endpoint, mailtoAddress, event);
      });
      // Marks each input as filled so the floating-label CSS keeps
      // the label in its raised position even when the field has a
      // pre-filled value (browser autofill, back-button restore).
      form.querySelectorAll("input, textarea, select").forEach(function (input) {
        function update() {
          var group = input.closest(".floating-label-group");
          if (!group) return;
          if (input.value && input.value.length > 0) group.classList.add("is-filled");
          else group.classList.remove("is-filled");
        }
        input.addEventListener("input", update);
        input.addEventListener("change", update);
        update();
      });
    });
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
    wireShareButtons();
    wireContactForms();
    wireFeaturedChevrons();
    Promise.all([
      fetchWithLocaleFallback("posts.json"),
      fetchWithLocaleFallback("authors.json"),
    ]).then(function (results) {
      paintRelated(results[0]);
      paintAuthorBios(results[1]);
    });
  });
})();
`, fo = {
  description: "Customize the active theme. Changes affect every published page on the next load (browsers may cache the CSS — hard-refresh once to see the update).",
  tabs: { logo: "Logo", style: "Style", home: "Home", single: "Single post" },
  single: {
    help: "Configure the single-post page sidebar. Changes apply to every post on the next regeneration.",
    save: "Save",
    saving: "Saving…",
    saved: "Single-post settings saved. Republish posts to apply.",
    failed: "Save failed.",
    sidebarHeading: "Sidebar",
    showAuthorBio: "Show author bio card",
    showAuthorBioHelp: "Renders the author's avatar, name, role, bio and social links. Off by default — many corporate sites prefer to keep posts free of per-author bylines.",
    showPopular: "Show popular articles card",
    showPopularHelp: "Lists 3 related posts (same category first, then latest as fallback). Populated at runtime from /data/posts.json.",
    popularTitle: "Popular articles title",
    popularTitleHelp: "Customize the heading shown above the list. Empty falls back to the localised default.",
    showCta: 'Show "Get started" CTA card',
    showCtaHelp: "Dark navy lead-gen card at the bottom of the sidebar. Useful on lead-gen sites; turn off for content-only blogs.",
    ctaTitle: "CTA title",
    ctaTitleHelp: 'Heading shown at the top of the card. Empty falls back to the site title or "Get started".',
    ctaButtonLabel: "Button label",
    ctaButtonHref: "Button link"
  },
  home: {
    help: 'Configure the home hero section. Out-of-the-box, the home renders this hero followed by a latest-posts grid. Switch to a fully custom layout by setting Settings → General → Home mode to "Static page" and pointing it at a page composed of theme blocks.',
    save: "Save",
    saving: "Saving…",
    saved: "Home saved. Republish or wait for the next publish to apply.",
    failed: "Save failed.",
    showHero: "Show hero on home",
    showHeroHelp: "When off, the home opens directly with the latest-posts grid (useful for a more austere editorial feel).",
    heroHeading: "Hero content",
    heroImage: "Background image URL",
    heroImageHelp: "Pick from your Media library, paste any external URL, or leave empty for a solid navy hero. Default points at an Unsplash corporate-office photo.",
    heroImagePick: "Choose from media library",
    heroImageClear: "Clear",
    heroImageAlt: "Image alt text",
    heroEyebrow: "Eyebrow label",
    heroTitle: "Headline",
    heroSubtitle: "Lede / subtitle",
    primaryCtaLabel: "Primary CTA label",
    primaryCtaHref: "Primary CTA link",
    secondaryCtaLabel: "Secondary CTA label",
    secondaryCtaHref: "Secondary CTA link",
    featuredHeading: "Featured posts section",
    featuredEnabled: "Show the featured posts section on home",
    featuredHelp: "A grid of post cards below the hero. Pick a category or pull from every post — order is most-recent first.",
    featuredTitle: "Section title",
    featuredSubtitle: "Section subtitle",
    featuredMode: "Source",
    featuredModes: { all: "All posts (newest first)", category: "Single category" },
    featuredCount: "Number of cards",
    featuredCategory: "Category",
    featuredCategoryPlaceholder: "— Pick a category —",
    featuredCategoryEmpty: "No categories yet. Create one in Categories first.",
    testimonialsHeading: "Testimonials section",
    testimonialsEnabled: "Show the testimonials section on home",
    testimonialsHelp: "Customer quotes with star rating + author. Each is a card; the layout adapts to 1 / 2 / 3+ items.",
    testimonialsVariant: "Visual variant",
    testimonialsVariants: { glass: "Glass cards on light surface", navy: "Navy section" },
    testimonialsEyebrow: "Eyebrow label (optional)",
    testimonialsTitle: "Section title",
    testimonialsSubtitle: "Section subtitle",
    testimonialsItemsHeading: "Testimonials",
    testimonialsAdd: "Add testimonial",
    testimonialsItemIndex: "Testimonial {{index}}",
    testimonialsQuote: "Quote",
    testimonialsAuthorName: "Author name",
    testimonialsAuthorTitle: "Author title (e.g. CEO, Acme)",
    testimonialsAvatarUrl: "Avatar URL",
    testimonialsRating: "Rating (1–5)"
  },
  logo: {
    help: "Upload a logo to replace the text wordmark in the header. Recommended dimensions: {{width}}×{{height}} px. Image is resized and stored as WebP.",
    none: "No logo set",
    upload: "Upload logo",
    uploading: "Uploading…",
    change: "Change logo",
    remove: "Remove logo",
    removing: "Removing…",
    saved: "Logo updated. Reload published pages to see the change.",
    removed: "Logo removed.",
    failed: "Logo upload failed.",
    invalidType: "Pick a JPG, PNG or WebP image."
  },
  style: {
    help: "Tweak design tokens to customize colors and typography. Save & apply pushes a regenerated theme CSS to your site.",
    save: "Save & apply",
    saving: "Applying…",
    saved: "Style applied. Hard-refresh published pages to see the changes.",
    failed: "Style update failed.",
    reset: "Reset to defaults",
    resetting: "Resetting…"
  },
  presets: {
    title: "Style preset",
    help: "Pick a graphic preset to fill every field below. You can fine-tune individual values afterwards.",
    classic: {
      label: "Classic",
      description: "Original corporate baseline — Inter on slate-blue surfaces, navy primary."
    },
    tech: {
      label: "Tech",
      description: "Crisp neutral surfaces with electric cyan accent — Plus Jakarta Sans, modern SaaS feel."
    },
    trust: {
      label: "Trust",
      description: "Warm cream and deep navy with amber accent — IBM Plex Sans, banking / advisory vibe."
    },
    vibrant: {
      label: "Vibrant",
      description: "Pink and orange punch — DM Sans, energetic startup feel."
    },
    executive: {
      label: "Executive",
      description: "Deep purple and gold on cream — Manrope, premium consulting / luxury services."
    }
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Foreground",
    outlines: "Outlines",
    accent: "Brand & Accent",
    typography: "Typography"
  },
  vars: {
    background: "Page background",
    surface: "Surface",
    surfaceLow: "Surface — low",
    surfaceMid: "Surface — mid",
    surfaceHigh: "Surface — high",
    surfaceLowest: "Card surface",
    onSurface: "Body text",
    onSurfaceVariant: "Secondary text",
    outline: "Outline",
    outlineVariant: "Outline — subtle",
    primary: "Primary (navy)",
    onPrimary: "Text on primary",
    primaryContainer: "Primary container",
    onPrimaryContainer: "Text on primary container",
    secondary: "Secondary (CTA / links)",
    onSecondary: "Text on secondary",
    tertiary: "Tertiary",
    tertiaryContainer: "Tertiary container"
  },
  fonts: {
    sans: "Sans-serif (entire UI)",
    help: "The corporate theme uses one font for everything. Loaded via Google Fonts; the CSS @import line is rewritten on save."
  }
}, go = {
  description: "Personnalisez le thème actif. Les modifications s'appliquent à chaque page publiée au prochain chargement (le navigateur peut mettre en cache le CSS — un Cmd+Maj+R suffit).",
  tabs: { logo: "Logo", style: "Style", home: "Accueil", single: "Article" },
  single: {
    help: "Configurez la barre latérale des pages d'article. Les changements s'appliquent à chaque article à la prochaine régénération.",
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Réglages article enregistrés. Republiez les articles pour les appliquer.",
    failed: "Échec de l'enregistrement.",
    sidebarHeading: "Barre latérale",
    showAuthorBio: "Afficher la carte auteur",
    showAuthorBioHelp: "Affiche l'avatar, le nom, le rôle, la bio et les liens sociaux de l'auteur. Désactivé par défaut — beaucoup de sites corporate préfèrent ne pas afficher l'auteur sur chaque article.",
    showPopular: "Afficher la carte « Articles populaires »",
    showPopularHelp: "Liste 3 articles liés (même catégorie d'abord, puis les plus récents en fallback). Rempli au runtime depuis /data/posts.json.",
    popularTitle: "Titre « Articles populaires »",
    popularTitleHelp: "Personnalisez le titre affiché au-dessus de la liste. Vide = libellé localisé par défaut.",
    showCta: "Afficher la carte CTA « Démarrer »",
    showCtaHelp: "Carte navy de lead-gen en bas de la sidebar. Utile pour les sites lead-gen ; désactivez pour un blog purement éditorial.",
    ctaTitle: "Titre du CTA",
    ctaTitleHelp: "En-tête affiché en haut de la carte. Vide = titre du site ou « Démarrer ».",
    ctaButtonLabel: "Libellé du bouton",
    ctaButtonHref: "Lien du bouton"
  },
  home: {
    help: "Configurez le hero de la page d'accueil. Par défaut, l'accueil affiche ce hero suivi d'une grille des derniers articles. Pour un layout entièrement personnalisé, passez en mode « Page statique » dans Réglages → Général et pointez vers une page composée de blocs.",
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Accueil enregistré. Republiez ou attendez la prochaine publication pour l'appliquer.",
    failed: "Échec de l'enregistrement.",
    showHero: "Afficher le hero en accueil",
    showHeroHelp: "Désactivé, l'accueil s'ouvre directement sur la grille des derniers articles (utile pour un rendu plus sobre).",
    heroHeading: "Contenu du hero",
    heroImage: "URL de l'image de fond",
    heroImageHelp: "Choisissez depuis la médiathèque, collez une URL externe, ou laissez vide pour un hero navy uni. Par défaut : photo de bureau corporate sur Unsplash.",
    heroImagePick: "Choisir dans la médiathèque",
    heroImageClear: "Effacer",
    heroImageAlt: "Texte alternatif",
    heroEyebrow: "Étiquette",
    heroTitle: "Titre",
    heroSubtitle: "Accroche / sous-titre",
    primaryCtaLabel: "Libellé CTA principal",
    primaryCtaHref: "Lien CTA principal",
    secondaryCtaLabel: "Libellé CTA secondaire",
    secondaryCtaHref: "Lien CTA secondaire",
    featuredHeading: "Section articles à la une",
    featuredEnabled: "Afficher la section articles à la une",
    featuredHelp: "Grille de cartes d'articles sous le hero. Choisissez une catégorie ou tirez depuis tous les articles — ordre du plus récent au plus ancien.",
    featuredTitle: "Titre de la section",
    featuredSubtitle: "Sous-titre de la section",
    featuredMode: "Source",
    featuredModes: { all: "Tous les articles (plus récents d'abord)", category: "Une seule catégorie" },
    featuredCount: "Nombre de cartes",
    featuredCategory: "Catégorie",
    featuredCategoryPlaceholder: "— Choisir une catégorie —",
    featuredCategoryEmpty: "Aucune catégorie. Créez-en une dans Catégories d'abord.",
    testimonialsHeading: "Section témoignages",
    testimonialsEnabled: "Afficher la section témoignages",
    testimonialsHelp: "Citations clients avec note d'étoiles + auteur. Chaque entrée est une carte ; le layout s'adapte à 1 / 2 / 3+ éléments.",
    testimonialsVariant: "Variante visuelle",
    testimonialsVariants: { glass: "Cartes glass sur fond clair", navy: "Section navy" },
    testimonialsEyebrow: "Étiquette (optionnel)",
    testimonialsTitle: "Titre de la section",
    testimonialsSubtitle: "Sous-titre de la section",
    testimonialsItemsHeading: "Témoignages",
    testimonialsAdd: "Ajouter un témoignage",
    testimonialsItemIndex: "Témoignage {{index}}",
    testimonialsQuote: "Citation",
    testimonialsAuthorName: "Nom de l'auteur",
    testimonialsAuthorTitle: "Titre de l'auteur (ex. CEO, Acme)",
    testimonialsAvatarUrl: "URL de l'avatar",
    testimonialsRating: "Note (1–5)"
  },
  logo: {
    help: "Uploadez un logo pour remplacer le wordmark texte dans l'en-tête. Dimensions recommandées : {{width}}×{{height}} px. L'image est redimensionnée et stockée en WebP.",
    none: "Pas de logo",
    upload: "Uploader un logo",
    uploading: "Envoi en cours…",
    change: "Changer le logo",
    remove: "Supprimer le logo",
    removing: "Suppression…",
    saved: "Logo mis à jour. Rechargez les pages publiées pour voir le changement.",
    removed: "Logo supprimé.",
    failed: "Échec de l'upload du logo.",
    invalidType: "Choisissez une image JPG, PNG ou WebP."
  },
  style: {
    help: "Personnalisez les jetons design pour ajuster les couleurs et la typographie. « Enregistrer & appliquer » envoie un CSS régénéré sur votre site.",
    save: "Enregistrer & appliquer",
    saving: "Application…",
    saved: "Style appliqué. Faites Cmd+Maj+R sur les pages publiées pour voir les changements.",
    failed: "Échec de la mise à jour du style.",
    reset: "Réinitialiser",
    resetting: "Réinitialisation…"
  },
  presets: {
    title: "Préréglage de style",
    help: "Choisissez un préréglage graphique pour pré-remplir tous les champs ci-dessous. Vous pourrez ensuite affiner valeur par valeur.",
    classic: {
      label: "Classique",
      description: "Look corporate d'origine — Inter sur surfaces bleu ardoise, primaire navy."
    },
    tech: {
      label: "Tech",
      description: "Surfaces neutres nettes avec accent cyan électrique — Plus Jakarta Sans, look SaaS moderne."
    },
    trust: {
      label: "Confiance",
      description: "Crème chaud et navy profond avec accent ambre — IBM Plex Sans, vibe banque / conseil."
    },
    vibrant: {
      label: "Vibrant",
      description: "Punch rose et orange — DM Sans, look startup énergique."
    },
    executive: {
      label: "Executive",
      description: "Violet profond et or sur crème — Manrope, conseil premium / services de luxe."
    }
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Texte",
    outlines: "Bordures",
    accent: "Marque & accent",
    typography: "Typographie"
  },
  vars: {
    background: "Fond de page",
    surface: "Surface",
    surfaceLow: "Surface — basse",
    surfaceMid: "Surface — moyenne",
    surfaceHigh: "Surface — haute",
    surfaceLowest: "Surface des cartes",
    onSurface: "Texte du corps",
    onSurfaceVariant: "Texte secondaire",
    outline: "Bordure",
    outlineVariant: "Bordure — subtile",
    primary: "Primaire (navy)",
    onPrimary: "Texte sur primaire",
    primaryContainer: "Conteneur primaire",
    onPrimaryContainer: "Texte sur conteneur primaire",
    secondary: "Secondaire (CTA / liens)",
    onSecondary: "Texte sur secondaire",
    tertiary: "Tertiaire",
    tertiaryContainer: "Conteneur tertiaire"
  },
  fonts: {
    sans: "Sans-serif (toute l'interface)",
    help: "Le thème corporate utilise une seule police pour tout. Chargée via Google Fonts ; la ligne @import est régénérée à l'enregistrement."
  }
}, bo = {
  description: "Passen Sie das aktive Theme an. Änderungen wirken sich beim nächsten Laden auf alle veröffentlichten Seiten aus (Browser können das CSS cachen — einmal hart neu laden).",
  tabs: { logo: "Logo", style: "Stil", home: "Startseite", single: "Beitrag" },
  single: {
    help: "Konfigurieren Sie die Seitenleiste der Beitragsseiten. Änderungen werden bei der nächsten Regenerierung auf jeden Beitrag angewendet.",
    save: "Speichern",
    saving: "Speichern…",
    saved: "Beitrags-Einstellungen gespeichert. Beiträge erneut veröffentlichen.",
    failed: "Speichern fehlgeschlagen.",
    sidebarHeading: "Seitenleiste",
    showAuthorBio: "Autor-Karte anzeigen",
    showAuthorBioHelp: "Zeigt Avatar, Name, Rolle, Bio und Social-Links des Autors. Standardmäßig aus — viele Corporate-Seiten bevorzugen es, Beiträge ohne pro-Autor-Bylines zu halten.",
    showPopular: 'Karte „Beliebte Beiträge" anzeigen',
    showPopularHelp: "Listet 3 verwandte Beiträge (gleiche Kategorie zuerst, dann neueste als Fallback). Zur Laufzeit aus /data/posts.json befüllt.",
    popularTitle: 'Titel „Beliebte Beiträge"',
    popularTitleHelp: "Passen Sie die Überschrift über der Liste an. Leer = lokalisierter Standardtext.",
    showCta: 'CTA-Karte „Loslegen" anzeigen',
    showCtaHelp: "Dunkle Navy-Lead-Gen-Karte unten in der Seitenleiste. Nützlich für Lead-Gen-Seiten; ausschalten für rein redaktionelle Blogs.",
    ctaTitle: "CTA-Titel",
    ctaTitleHelp: 'Überschrift oben auf der Karte. Leer = Seitentitel oder „Loslegen".',
    ctaButtonLabel: "Button-Text",
    ctaButtonHref: "Button-Link"
  },
  home: {
    help: 'Konfigurieren Sie den Hero-Bereich der Startseite. Standardmäßig zeigt die Startseite diesen Hero gefolgt von einem Raster der neuesten Beiträge. Wechseln Sie zu einem vollständig benutzerdefinierten Layout, indem Sie Einstellungen → Allgemein → Startseiten-Modus auf „Statische Seite" setzen.',
    save: "Speichern",
    saving: "Speichern…",
    saved: "Startseite gespeichert. Erneut veröffentlichen oder auf die nächste Veröffentlichung warten.",
    failed: "Speichern fehlgeschlagen.",
    showHero: "Hero auf Startseite anzeigen",
    showHeroHelp: "Wenn aus, beginnt die Startseite direkt mit dem Beitragsraster (nützlich für einen redaktionelleren Eindruck).",
    heroHeading: "Hero-Inhalt",
    heroImage: "Hintergrundbild-URL",
    heroImageHelp: "Wählen Sie aus Ihrer Medienbibliothek, fügen Sie eine externe URL ein oder lassen Sie es leer für einen einfarbigen Navy-Hero. Standardmäßig: Unsplash-Büro-Foto.",
    heroImagePick: "Aus Medienbibliothek wählen",
    heroImageClear: "Löschen",
    heroImageAlt: "Bild-Alt-Text",
    heroEyebrow: "Eyebrow-Label",
    heroTitle: "Überschrift",
    heroSubtitle: "Untertitel",
    primaryCtaLabel: "Primärer CTA-Text",
    primaryCtaHref: "Primärer CTA-Link",
    secondaryCtaLabel: "Sekundärer CTA-Text",
    secondaryCtaHref: "Sekundärer CTA-Link",
    featuredHeading: "Featured-Posts-Sektion",
    featuredEnabled: "Featured-Posts-Sektion auf Startseite anzeigen",
    featuredHelp: "Raster mit Beitragskarten unter dem Hero. Wählen Sie eine Kategorie oder ziehen Sie aus allen Beiträgen — neueste zuerst.",
    featuredTitle: "Sektionstitel",
    featuredSubtitle: "Sektion-Untertitel",
    featuredMode: "Quelle",
    featuredModes: { all: "Alle Beiträge (neueste zuerst)", category: "Einzelne Kategorie" },
    featuredCount: "Anzahl der Karten",
    featuredCategory: "Kategorie",
    featuredCategoryPlaceholder: "— Kategorie auswählen —",
    featuredCategoryEmpty: "Noch keine Kategorien. Erstellen Sie zuerst eine in Kategorien.",
    testimonialsHeading: "Testimonials-Sektion",
    testimonialsEnabled: "Testimonials-Sektion auf Startseite anzeigen",
    testimonialsHelp: "Kundenzitate mit Sternebewertung + Autor. Jeder Eintrag ist eine Karte; das Layout passt sich an 1 / 2 / 3+ Elemente an.",
    testimonialsVariant: "Visuelle Variante",
    testimonialsVariants: { glass: "Glas-Karten auf hellem Hintergrund", navy: "Navy-Sektion" },
    testimonialsEyebrow: "Eyebrow-Label (optional)",
    testimonialsTitle: "Sektionstitel",
    testimonialsSubtitle: "Sektion-Untertitel",
    testimonialsItemsHeading: "Testimonials",
    testimonialsAdd: "Testimonial hinzufügen",
    testimonialsItemIndex: "Testimonial {{index}}",
    testimonialsQuote: "Zitat",
    testimonialsAuthorName: "Name des Autors",
    testimonialsAuthorTitle: "Titel des Autors (z. B. CEO, Acme)",
    testimonialsAvatarUrl: "Avatar-URL",
    testimonialsRating: "Bewertung (1–5)"
  },
  logo: {
    help: "Laden Sie ein Logo hoch, um den Text-Wordmark im Header zu ersetzen. Empfohlene Maße: {{width}}×{{height}} px. Bild wird verkleinert und als WebP gespeichert.",
    none: "Kein Logo",
    upload: "Logo hochladen",
    uploading: "Wird hochgeladen…",
    change: "Logo ändern",
    remove: "Logo entfernen",
    removing: "Wird entfernt…",
    saved: "Logo aktualisiert. Veröffentlichte Seiten neu laden, um die Änderung zu sehen.",
    removed: "Logo entfernt.",
    failed: "Logo-Upload fehlgeschlagen.",
    invalidType: "Wählen Sie ein JPG-, PNG- oder WebP-Bild."
  },
  style: {
    help: 'Passen Sie Design-Tokens an, um Farben und Typografie zu personalisieren. „Speichern & anwenden" lädt ein neu generiertes Theme-CSS auf Ihre Seite hoch.',
    save: "Speichern & anwenden",
    saving: "Wird angewendet…",
    saved: "Stil angewendet. Hart-Refresh auf veröffentlichten Seiten, um die Änderungen zu sehen.",
    failed: "Stil-Aktualisierung fehlgeschlagen.",
    reset: "Auf Standards zurücksetzen",
    resetting: "Wird zurückgesetzt…"
  },
  presets: {
    title: "Stil-Voreinstellung",
    help: "Wählen Sie eine grafische Voreinstellung, um alle Felder unten zu befüllen. Sie können Werte danach einzeln feinjustieren.",
    classic: {
      label: "Klassisch",
      description: "Originale Corporate-Basis — Inter auf schieferblauen Flächen, marineblaue Primärfarbe."
    },
    tech: {
      label: "Tech",
      description: "Knackige neutrale Flächen mit elektrischem Cyan-Akzent — Plus Jakarta Sans, moderner SaaS-Look."
    },
    trust: {
      label: "Vertrauen",
      description: "Warmes Creme und tiefes Marineblau mit Amber-Akzent — IBM Plex Sans, Banking-/Beratungs-Vibe."
    },
    vibrant: {
      label: "Vibrant",
      description: "Rosa und Orange mit Punch — DM Sans, energiegeladenes Startup-Gefühl."
    },
    executive: {
      label: "Executive",
      description: "Tiefes Lila und Gold auf Creme — Manrope, Premium-Consulting / Luxusdienstleistungen."
    }
  },
  groups: {
    surfaces: "Oberflächen",
    foreground: "Vordergrund",
    outlines: "Konturen",
    accent: "Marke & Akzent",
    typography: "Typografie"
  },
  vars: {
    background: "Seitenhintergrund",
    surface: "Oberfläche",
    surfaceLow: "Oberfläche — niedrig",
    surfaceMid: "Oberfläche — mittel",
    surfaceHigh: "Oberfläche — hoch",
    surfaceLowest: "Karten-Oberfläche",
    onSurface: "Fließtext",
    onSurfaceVariant: "Sekundärtext",
    outline: "Kontur",
    outlineVariant: "Kontur — subtil",
    primary: "Primär (Navy)",
    onPrimary: "Text auf Primär",
    primaryContainer: "Primär-Container",
    onPrimaryContainer: "Text auf Primär-Container",
    secondary: "Sekundär (CTA / Links)",
    onSecondary: "Text auf Sekundär",
    tertiary: "Tertiär",
    tertiaryContainer: "Tertiär-Container"
  },
  fonts: {
    sans: "Sans-Serif (gesamte Oberfläche)",
    help: "Das Corporate-Theme verwendet eine Schriftart für alles. Über Google Fonts geladen; die @import-Zeile wird beim Speichern neu generiert."
  }
}, vo = {
  description: "Personaliza el tema activo. Los cambios afectan a todas las páginas publicadas en la próxima carga (los navegadores pueden cachear el CSS — recarga forzada una vez).",
  tabs: { logo: "Logo", style: "Estilo", home: "Inicio", single: "Artículo" },
  single: {
    help: "Configura la barra lateral de las páginas de artículo. Los cambios se aplican a cada artículo en la próxima regeneración.",
    save: "Guardar",
    saving: "Guardando…",
    saved: "Ajustes de artículo guardados. Republica los artículos para aplicarlos.",
    failed: "Error al guardar.",
    sidebarHeading: "Barra lateral",
    showAuthorBio: "Mostrar tarjeta de autor",
    showAuthorBioHelp: "Muestra el avatar, nombre, rol, biografía y enlaces sociales del autor. Desactivado por defecto — muchos sitios corporativos prefieren no mostrar el autor en cada artículo.",
    showPopular: "Mostrar la tarjeta «Artículos populares»",
    showPopularHelp: "Lista 3 artículos relacionados (misma categoría primero, luego los más recientes como fallback). Rellenado en runtime desde /data/posts.json.",
    popularTitle: "Título «Artículos populares»",
    popularTitleHelp: "Personaliza el título mostrado encima de la lista. Vacío = etiqueta localizada por defecto.",
    showCta: "Mostrar tarjeta CTA «Empezar»",
    showCtaHelp: "Tarjeta navy de lead-gen al final de la barra lateral. Útil en sitios lead-gen; desactívala para blogs solo editoriales.",
    ctaTitle: "Título del CTA",
    ctaTitleHelp: "Encabezado mostrado en la parte superior de la tarjeta. Vacío = título del sitio o «Empezar».",
    ctaButtonLabel: "Texto del botón",
    ctaButtonHref: "Enlace del botón"
  },
  home: {
    help: "Configura la sección hero de la página de inicio. Por defecto, el inicio muestra este hero seguido de una cuadrícula de últimas entradas. Para un layout totalmente personalizado, pasa a modo «Página estática» en Ajustes → General y apunta a una página compuesta de bloques.",
    save: "Guardar",
    saving: "Guardando…",
    saved: "Inicio guardado. Vuelve a publicar o espera la próxima publicación para aplicarlo.",
    failed: "Error al guardar.",
    showHero: "Mostrar hero en inicio",
    showHeroHelp: "Desactivado, el inicio se abre directamente con la cuadrícula de últimas entradas (útil para un aspecto más sobrio).",
    heroHeading: "Contenido del hero",
    heroImage: "URL de la imagen de fondo",
    heroImageHelp: "Elige desde tu biblioteca de medios, pega una URL externa, o déjalo vacío para un hero navy sólido. Por defecto: foto de oficina corporativa en Unsplash.",
    heroImagePick: "Elegir desde la biblioteca",
    heroImageClear: "Borrar",
    heroImageAlt: "Texto alternativo",
    heroEyebrow: "Etiqueta",
    heroTitle: "Titular",
    heroSubtitle: "Subtítulo / lede",
    primaryCtaLabel: "Texto del CTA principal",
    primaryCtaHref: "Enlace del CTA principal",
    secondaryCtaLabel: "Texto del CTA secundario",
    secondaryCtaHref: "Enlace del CTA secundario",
    featuredHeading: "Sección de artículos destacados",
    featuredEnabled: "Mostrar la sección de artículos destacados en el inicio",
    featuredHelp: "Cuadrícula de tarjetas de artículos bajo el hero. Elige una categoría o extrae de todos los artículos — orden más reciente primero.",
    featuredTitle: "Título de sección",
    featuredSubtitle: "Subtítulo de sección",
    featuredMode: "Fuente",
    featuredModes: { all: "Todos los artículos (más recientes primero)", category: "Una sola categoría" },
    featuredCount: "Número de tarjetas",
    featuredCategory: "Categoría",
    featuredCategoryPlaceholder: "— Elegir una categoría —",
    featuredCategoryEmpty: "Aún no hay categorías. Crea una en Categorías primero.",
    testimonialsHeading: "Sección de testimonios",
    testimonialsEnabled: "Mostrar la sección de testimonios en el inicio",
    testimonialsHelp: "Citas de clientes con calificación + autor. Cada entrada es una tarjeta; el layout se adapta a 1 / 2 / 3+ elementos.",
    testimonialsVariant: "Variante visual",
    testimonialsVariants: { glass: "Tarjetas glass sobre fondo claro", navy: "Sección navy" },
    testimonialsEyebrow: "Etiqueta (opcional)",
    testimonialsTitle: "Título de sección",
    testimonialsSubtitle: "Subtítulo de sección",
    testimonialsItemsHeading: "Testimonios",
    testimonialsAdd: "Añadir testimonio",
    testimonialsItemIndex: "Testimonio {{index}}",
    testimonialsQuote: "Cita",
    testimonialsAuthorName: "Nombre del autor",
    testimonialsAuthorTitle: "Cargo del autor (p. ej. CEO, Acme)",
    testimonialsAvatarUrl: "URL del avatar",
    testimonialsRating: "Calificación (1–5)"
  },
  logo: {
    help: "Sube un logo para reemplazar la marca textual en el encabezado. Dimensiones recomendadas: {{width}}×{{height}} px. La imagen se redimensiona y se guarda como WebP.",
    none: "Sin logo",
    upload: "Subir logo",
    uploading: "Subiendo…",
    change: "Cambiar logo",
    remove: "Eliminar logo",
    removing: "Eliminando…",
    saved: "Logo actualizado. Recarga las páginas publicadas para ver el cambio.",
    removed: "Logo eliminado.",
    failed: "Error al subir el logo.",
    invalidType: "Elige una imagen JPG, PNG o WebP."
  },
  style: {
    help: "Ajusta los tokens de diseño para personalizar colores y tipografía. «Guardar y aplicar» envía un CSS de tema regenerado a tu sitio.",
    save: "Guardar y aplicar",
    saving: "Aplicando…",
    saved: "Estilo aplicado. Recarga forzada en las páginas publicadas para ver los cambios.",
    failed: "Error al actualizar el estilo.",
    reset: "Restablecer valores predeterminados",
    resetting: "Restableciendo…"
  },
  presets: {
    title: "Preset de estilo",
    help: "Elige un preset gráfico para rellenar todos los campos. Puedes ajustar valor por valor después.",
    classic: {
      label: "Clásico",
      description: "Look corporate original — Inter sobre superficies azul pizarra, primario azul marino."
    },
    tech: {
      label: "Tech",
      description: "Superficies neutras nítidas con acento cian eléctrico — Plus Jakarta Sans, look SaaS moderno."
    },
    trust: {
      label: "Confianza",
      description: "Crema cálido y azul marino profundo con acento ámbar — IBM Plex Sans, banca / asesoría."
    },
    vibrant: {
      label: "Vibrante",
      description: "Toque rosa y naranja — DM Sans, look startup enérgico."
    },
    executive: {
      label: "Executive",
      description: "Púrpura profundo y oro sobre crema — Manrope, consultoría premium / servicios de lujo."
    }
  },
  groups: {
    surfaces: "Superficies",
    foreground: "Texto",
    outlines: "Bordes",
    accent: "Marca y acento",
    typography: "Tipografía"
  },
  vars: {
    background: "Fondo de página",
    surface: "Superficie",
    surfaceLow: "Superficie — baja",
    surfaceMid: "Superficie — media",
    surfaceHigh: "Superficie — alta",
    surfaceLowest: "Superficie de tarjetas",
    onSurface: "Texto del cuerpo",
    onSurfaceVariant: "Texto secundario",
    outline: "Borde",
    outlineVariant: "Borde — sutil",
    primary: "Primario (navy)",
    onPrimary: "Texto sobre primario",
    primaryContainer: "Contenedor primario",
    onPrimaryContainer: "Texto sobre contenedor primario",
    secondary: "Secundario (CTA / enlaces)",
    onSecondary: "Texto sobre secundario",
    tertiary: "Terciario",
    tertiaryContainer: "Contenedor terciario"
  },
  fonts: {
    sans: "Sans-serif (toda la interfaz)",
    help: "El tema corporativo usa una sola fuente para todo. Cargada vía Google Fonts; la línea @import se regenera al guardar."
  }
}, yo = {
  description: "Pas het actieve thema aan. Wijzigingen gelden voor elke gepubliceerde pagina bij de volgende keer laden (browsers kunnen CSS cachen — eenmaal hard verversen).",
  tabs: { logo: "Logo", style: "Stijl", home: "Home", single: "Post" },
  single: {
    help: "Configureer de zijbalk van post-pagina's. Wijzigingen worden toegepast op elke post bij de volgende regeneratie.",
    save: "Opslaan",
    saving: "Opslaan…",
    saved: "Post-instellingen opgeslagen. Posts opnieuw publiceren om toe te passen.",
    failed: "Opslaan mislukt.",
    sidebarHeading: "Zijbalk",
    showAuthorBio: "Auteurskaart tonen",
    showAuthorBioHelp: "Toont avatar, naam, rol, biografie en sociale links van de auteur. Standaard uit — veel corporate sites tonen liever geen auteur per post.",
    showPopular: 'Kaart "Populaire artikelen" tonen',
    showPopularHelp: "Toont 3 gerelateerde posts (zelfde categorie eerst, dan nieuwste als fallback). Runtime gevuld vanuit /data/posts.json.",
    popularTitle: 'Titel "Populaire artikelen"',
    popularTitleHelp: "Pas de kop boven de lijst aan. Leeg = gelokaliseerde standaardtekst.",
    showCta: 'CTA-kaart "Aan de slag" tonen',
    showCtaHelp: "Donkere navy lead-gen kaart onderaan de zijbalk. Nuttig voor lead-gen sites; uitschakelen voor puur editoriale blogs.",
    ctaTitle: "CTA-titel",
    ctaTitleHelp: 'Kop bovenaan de kaart. Leeg = sitetitel of "Aan de slag".',
    ctaButtonLabel: "Knop-tekst",
    ctaButtonHref: "Knop-link"
  },
  home: {
    help: 'Configureer de hero-sectie van de homepage. Standaard toont de home deze hero gevolgd door een raster met laatste posts. Schakel over naar een volledig aangepaste layout door Instellingen → Algemeen → Home-modus op "Statische pagina" te zetten.',
    save: "Opslaan",
    saving: "Opslaan…",
    saved: "Home opgeslagen. Publiceer opnieuw of wacht op de volgende publicatie.",
    failed: "Opslaan mislukt.",
    showHero: "Hero op home tonen",
    showHeroHelp: "Uit, opent de home direct met het posts-raster (nuttig voor een soberder uiterlijk).",
    heroHeading: "Hero-inhoud",
    heroImage: "Achtergrondafbeelding URL",
    heroImageHelp: "Kies uit je Mediabibliotheek, plak een externe URL of laat leeg voor een effen navy hero. Standaard: Unsplash kantoorfoto.",
    heroImagePick: "Kies uit mediabibliotheek",
    heroImageClear: "Wissen",
    heroImageAlt: "Alt-tekst",
    heroEyebrow: "Eyebrow-label",
    heroTitle: "Kop",
    heroSubtitle: "Subtitel / lede",
    primaryCtaLabel: "Primaire CTA-tekst",
    primaryCtaHref: "Primaire CTA-link",
    secondaryCtaLabel: "Secundaire CTA-tekst",
    secondaryCtaHref: "Secundaire CTA-link",
    featuredHeading: "Uitgelichte posts-sectie",
    featuredEnabled: "Uitgelichte posts-sectie op home tonen",
    featuredHelp: "Raster van post-kaarten onder de hero. Kies een categorie of trek uit alle posts — nieuwste eerst.",
    featuredTitle: "Sectietitel",
    featuredSubtitle: "Sectie-ondertitel",
    featuredMode: "Bron",
    featuredModes: { all: "Alle posts (nieuwste eerst)", category: "Eén categorie" },
    featuredCount: "Aantal kaarten",
    featuredCategory: "Categorie",
    featuredCategoryPlaceholder: "— Kies een categorie —",
    featuredCategoryEmpty: "Nog geen categorieën. Maak er eerst een aan in Categorieën.",
    testimonialsHeading: "Testimonials-sectie",
    testimonialsEnabled: "Testimonials-sectie op home tonen",
    testimonialsHelp: "Klantcitaten met sterbeoordeling + auteur. Elke entry is een kaart; de layout past zich aan 1 / 2 / 3+ items aan.",
    testimonialsVariant: "Visuele variant",
    testimonialsVariants: { glass: "Glaskaarten op lichte achtergrond", navy: "Navy-sectie" },
    testimonialsEyebrow: "Eyebrow-label (optioneel)",
    testimonialsTitle: "Sectietitel",
    testimonialsSubtitle: "Sectie-ondertitel",
    testimonialsItemsHeading: "Testimonials",
    testimonialsAdd: "Testimonial toevoegen",
    testimonialsItemIndex: "Testimonial {{index}}",
    testimonialsQuote: "Citaat",
    testimonialsAuthorName: "Naam van auteur",
    testimonialsAuthorTitle: "Titel van auteur (bv. CEO, Acme)",
    testimonialsAvatarUrl: "Avatar-URL",
    testimonialsRating: "Beoordeling (1–5)"
  },
  logo: {
    help: "Upload een logo om het tekstwordmark in de header te vervangen. Aanbevolen afmetingen: {{width}}×{{height}} px. Afbeelding wordt verkleind en opgeslagen als WebP.",
    none: "Geen logo ingesteld",
    upload: "Logo uploaden",
    uploading: "Uploaden…",
    change: "Logo wijzigen",
    remove: "Logo verwijderen",
    removing: "Verwijderen…",
    saved: "Logo bijgewerkt. Herlaad gepubliceerde pagina's om de wijziging te zien.",
    removed: "Logo verwijderd.",
    failed: "Logo upload mislukt.",
    invalidType: "Kies een JPG-, PNG- of WebP-afbeelding."
  },
  style: {
    help: 'Pas design-tokens aan om kleuren en typografie te personaliseren. "Opslaan & toepassen" stuurt een opnieuw gegenereerde theme-CSS naar je site.',
    save: "Opslaan & toepassen",
    saving: "Toepassen…",
    saved: "Stijl toegepast. Hard verversen op gepubliceerde pagina's om de wijzigingen te zien.",
    failed: "Stijl bijwerken mislukt.",
    reset: "Terug naar standaard",
    resetting: "Resetten…"
  },
  presets: {
    title: "Stijl-preset",
    help: "Kies een grafische preset om alle velden hieronder in te vullen. Je kunt waarden daarna individueel verfijnen.",
    classic: {
      label: "Klassiek",
      description: "Originele corporate baseline — Inter op leiblauwe oppervlakken, marineblauwe primaire."
    },
    tech: {
      label: "Tech",
      description: "Krachtige neutrale oppervlakken met elektrisch cyaan-accent — Plus Jakarta Sans, moderne SaaS-look."
    },
    trust: {
      label: "Vertrouwen",
      description: "Warm crème en diep marineblauw met amber-accent — IBM Plex Sans, banking / advies vibe."
    },
    vibrant: {
      label: "Vibrant",
      description: "Roze en oranje punch — DM Sans, energiek startup-gevoel."
    },
    executive: {
      label: "Executive",
      description: "Diep paars en goud op crème — Manrope, premium consulting / luxe diensten."
    }
  },
  groups: {
    surfaces: "Oppervlakken",
    foreground: "Tekst",
    outlines: "Randen",
    accent: "Merk & accent",
    typography: "Typografie"
  },
  vars: {
    background: "Pagina-achtergrond",
    surface: "Oppervlak",
    surfaceLow: "Oppervlak — laag",
    surfaceMid: "Oppervlak — midden",
    surfaceHigh: "Oppervlak — hoog",
    surfaceLowest: "Kaartoppervlak",
    onSurface: "Bodytekst",
    onSurfaceVariant: "Secundaire tekst",
    outline: "Rand",
    outlineVariant: "Rand — subtiel",
    primary: "Primair (navy)",
    onPrimary: "Tekst op primair",
    primaryContainer: "Primaire container",
    onPrimaryContainer: "Tekst op primaire container",
    secondary: "Secundair (CTA / links)",
    onSecondary: "Tekst op secundair",
    tertiary: "Tertiair",
    tertiaryContainer: "Tertiaire container"
  },
  fonts: {
    sans: "Sans-serif (volledige interface)",
    help: "Het corporate-thema gebruikt één lettertype voor alles. Geladen via Google Fonts; de @import-regel wordt opnieuw gegenereerd bij opslaan."
  }
}, xo = {
  description: "Personalize o tema ativo. As alterações afetam todas as páginas publicadas no próximo carregamento (os navegadores podem fazer cache do CSS — recarregue forçado uma vez).",
  tabs: { logo: "Logo", style: "Estilo", home: "Início", single: "Artigo" },
  single: {
    help: "Configure a barra lateral das páginas de artigo. As alterações são aplicadas a cada artigo na próxima regeneração.",
    save: "Salvar",
    saving: "Salvando…",
    saved: "Configurações de artigo salvas. Republique os artigos para aplicar.",
    failed: "Falha ao salvar.",
    sidebarHeading: "Barra lateral",
    showAuthorBio: "Mostrar cartão do autor",
    showAuthorBioHelp: "Mostra avatar, nome, cargo, biografia e links sociais do autor. Desativado por padrão — muitos sites corporativos preferem não mostrar o autor em cada artigo.",
    showPopular: "Mostrar cartão «Artigos populares»",
    showPopularHelp: "Lista 3 artigos relacionados (mesma categoria primeiro, depois os mais recentes como fallback). Preenchido em runtime de /data/posts.json.",
    popularTitle: "Título «Artigos populares»",
    popularTitleHelp: "Personalize o título mostrado acima da lista. Vazio = rótulo localizado padrão.",
    showCta: "Mostrar cartão CTA «Começar»",
    showCtaHelp: "Cartão navy de lead-gen no final da barra lateral. Útil para sites lead-gen; desative para blogs apenas editoriais.",
    ctaTitle: "Título do CTA",
    ctaTitleHelp: "Cabeçalho mostrado no topo do cartão. Vazio = título do site ou «Começar».",
    ctaButtonLabel: "Texto do botão",
    ctaButtonHref: "Link do botão"
  },
  home: {
    help: "Configure a seção hero da página inicial. Por padrão, a página inicial exibe este hero seguido de uma grade dos últimos artigos. Para um layout totalmente personalizado, mude para o modo «Página estática» em Configurações → Geral.",
    save: "Salvar",
    saving: "Salvando…",
    saved: "Início salvo. Republique ou aguarde a próxima publicação.",
    failed: "Falha ao salvar.",
    showHero: "Mostrar hero na página inicial",
    showHeroHelp: "Quando desativado, a página inicial abre diretamente com a grade dos últimos artigos (útil para uma apresentação mais sóbria).",
    heroHeading: "Conteúdo do hero",
    heroImage: "URL da imagem de fundo",
    heroImageHelp: "Escolha da sua Biblioteca de mídia, cole uma URL externa ou deixe vazio para um hero navy sólido. Por padrão: foto de escritório corporativo do Unsplash.",
    heroImagePick: "Escolher da biblioteca",
    heroImageClear: "Limpar",
    heroImageAlt: "Texto alternativo",
    heroEyebrow: "Etiqueta",
    heroTitle: "Manchete",
    heroSubtitle: "Lede / subtítulo",
    primaryCtaLabel: "Texto do CTA principal",
    primaryCtaHref: "Link do CTA principal",
    secondaryCtaLabel: "Texto do CTA secundário",
    secondaryCtaHref: "Link do CTA secundário",
    featuredHeading: "Seção de artigos em destaque",
    featuredEnabled: "Mostrar a seção de artigos em destaque na página inicial",
    featuredHelp: "Grade de cartões de artigos abaixo do hero. Escolha uma categoria ou puxe de todos os artigos — mais recentes primeiro.",
    featuredTitle: "Título da seção",
    featuredSubtitle: "Subtítulo da seção",
    featuredMode: "Fonte",
    featuredModes: { all: "Todos os artigos (mais recentes primeiro)", category: "Uma única categoria" },
    featuredCount: "Número de cartões",
    featuredCategory: "Categoria",
    featuredCategoryPlaceholder: "— Escolher uma categoria —",
    featuredCategoryEmpty: "Ainda não há categorias. Crie uma em Categorias primeiro.",
    testimonialsHeading: "Seção de depoimentos",
    testimonialsEnabled: "Mostrar a seção de depoimentos na página inicial",
    testimonialsHelp: "Citações de clientes com classificação + autor. Cada entrada é um cartão; o layout adapta-se a 1 / 2 / 3+ itens.",
    testimonialsVariant: "Variante visual",
    testimonialsVariants: { glass: "Cartões glass sobre fundo claro", navy: "Seção navy" },
    testimonialsEyebrow: "Etiqueta (opcional)",
    testimonialsTitle: "Título da seção",
    testimonialsSubtitle: "Subtítulo da seção",
    testimonialsItemsHeading: "Depoimentos",
    testimonialsAdd: "Adicionar depoimento",
    testimonialsItemIndex: "Depoimento {{index}}",
    testimonialsQuote: "Citação",
    testimonialsAuthorName: "Nome do autor",
    testimonialsAuthorTitle: "Cargo do autor (ex. CEO, Acme)",
    testimonialsAvatarUrl: "URL do avatar",
    testimonialsRating: "Classificação (1–5)"
  },
  logo: {
    help: "Envie um logo para substituir a marca textual no cabeçalho. Dimensões recomendadas: {{width}}×{{height}} px. A imagem é redimensionada e armazenada como WebP.",
    none: "Sem logo",
    upload: "Enviar logo",
    uploading: "Enviando…",
    change: "Alterar logo",
    remove: "Remover logo",
    removing: "Removendo…",
    saved: "Logo atualizado. Recarregue as páginas publicadas para ver a alteração.",
    removed: "Logo removido.",
    failed: "Falha no envio do logo.",
    invalidType: "Escolha uma imagem JPG, PNG ou WebP."
  },
  style: {
    help: "Ajuste os tokens de design para personalizar cores e tipografia. «Salvar e aplicar» envia um CSS de tema regenerado para seu site.",
    save: "Salvar e aplicar",
    saving: "Aplicando…",
    saved: "Estilo aplicado. Recarga forçada nas páginas publicadas para ver as alterações.",
    failed: "Falha na atualização do estilo.",
    reset: "Restaurar padrões",
    resetting: "Restaurando…"
  },
  presets: {
    title: "Predefinição de estilo",
    help: "Escolha uma predefinição gráfica para preencher todos os campos abaixo. Pode ajustar valor a valor depois.",
    classic: {
      label: "Clássico",
      description: "Look corporate original — Inter sobre superfícies azul-ardósia, primária navy."
    },
    tech: {
      label: "Tech",
      description: "Superfícies neutras nítidas com acento ciano elétrico — Plus Jakarta Sans, look SaaS moderno."
    },
    trust: {
      label: "Confiança",
      description: "Creme quente e navy profundo com acento âmbar — IBM Plex Sans, banca / consultoria."
    },
    vibrant: {
      label: "Vibrante",
      description: "Toque rosa e laranja — DM Sans, look startup enérgico."
    },
    executive: {
      label: "Executive",
      description: "Roxo profundo e ouro sobre creme — Manrope, consultoria premium / serviços de luxo."
    }
  },
  groups: {
    surfaces: "Superfícies",
    foreground: "Texto",
    outlines: "Bordas",
    accent: "Marca e acento",
    typography: "Tipografia"
  },
  vars: {
    background: "Fundo da página",
    surface: "Superfície",
    surfaceLow: "Superfície — baixa",
    surfaceMid: "Superfície — média",
    surfaceHigh: "Superfície — alta",
    surfaceLowest: "Superfície dos cards",
    onSurface: "Texto do corpo",
    onSurfaceVariant: "Texto secundário",
    outline: "Borda",
    outlineVariant: "Borda — sutil",
    primary: "Primário (navy)",
    onPrimary: "Texto sobre primário",
    primaryContainer: "Container primário",
    onPrimaryContainer: "Texto sobre container primário",
    secondary: "Secundário (CTA / links)",
    onSecondary: "Texto sobre secundário",
    tertiary: "Terciário",
    tertiaryContainer: "Container terciário"
  },
  fonts: {
    sans: "Sans-serif (toda a interface)",
    help: "O tema corporate usa uma única fonte para tudo. Carregada via Google Fonts; a linha @import é regenerada ao salvar."
  }
}, wo = {
  description: "활성 테마를 사용자 정의합니다. 변경사항은 다음 로드 시 모든 게시된 페이지에 적용됩니다 (브라우저가 CSS를 캐시할 수 있습니다 — 한 번 강제 새로고침).",
  tabs: { logo: "로고", style: "스타일", home: "홈", single: "게시물" },
  single: {
    help: "단일 게시물 페이지 사이드바를 구성합니다. 변경사항은 다음 재생성 시 모든 게시물에 적용됩니다.",
    save: "저장",
    saving: "저장 중…",
    saved: "단일 게시물 설정이 저장되었습니다. 적용하려면 게시물을 다시 게시하세요.",
    failed: "저장 실패.",
    sidebarHeading: "사이드바",
    showAuthorBio: "작성자 약력 카드 표시",
    showAuthorBioHelp: "작성자의 아바타, 이름, 역할, 약력 및 소셜 링크를 표시합니다. 기본적으로 꺼짐 — 많은 기업 사이트는 게시물별 작성자 표시를 선호하지 않습니다.",
    showPopular: "「인기 기사」 카드 표시",
    showPopularHelp: "3개의 관련 게시물을 나열합니다 (같은 카테고리 우선, 그 다음 최신순). 런타임에 /data/posts.json에서 채워집니다.",
    popularTitle: "「인기 기사」 제목",
    popularTitleHelp: "목록 위에 표시되는 제목을 사용자 정의하세요. 비어있음 = 현지화된 기본값.",
    showCta: "「시작하기」 CTA 카드 표시",
    showCtaHelp: "사이드바 하단의 어두운 네이비 리드-젠 카드. 리드-젠 사이트에 유용; 순수 편집 블로그의 경우 끄세요.",
    ctaTitle: "CTA 제목",
    ctaTitleHelp: "카드 상단에 표시되는 헤더. 비어있음 = 사이트 제목 또는 「시작하기」.",
    ctaButtonLabel: "버튼 텍스트",
    ctaButtonHref: "버튼 링크"
  },
  home: {
    help: '홈 히어로 섹션을 구성합니다. 기본적으로 홈은 이 히어로와 최신 글 그리드를 표시합니다. 완전히 사용자 정의된 레이아웃으로 전환하려면 설정 → 일반 → 홈 모드를 "정적 페이지"로 설정하세요.',
    save: "저장",
    saving: "저장 중…",
    saved: "홈이 저장되었습니다. 다시 게시하거나 다음 게시를 기다리세요.",
    failed: "저장 실패.",
    showHero: "홈에 히어로 표시",
    showHeroHelp: "꺼지면 홈이 최신 글 그리드로 바로 열립니다 (더 차분한 표현에 유용).",
    heroHeading: "히어로 콘텐츠",
    heroImage: "배경 이미지 URL",
    heroImageHelp: "미디어 라이브러리에서 선택하거나 외부 URL을 붙여넣거나 단색 네이비 히어로를 위해 비워 두세요. 기본값: Unsplash 기업 사무실 사진.",
    heroImagePick: "미디어 라이브러리에서 선택",
    heroImageClear: "지우기",
    heroImageAlt: "이미지 대체 텍스트",
    heroEyebrow: "아이브로 라벨",
    heroTitle: "헤드라인",
    heroSubtitle: "서브타이틀",
    primaryCtaLabel: "기본 CTA 텍스트",
    primaryCtaHref: "기본 CTA 링크",
    secondaryCtaLabel: "보조 CTA 텍스트",
    secondaryCtaHref: "보조 CTA 링크",
    featuredHeading: "추천 게시물 섹션",
    featuredEnabled: "홈에 추천 게시물 섹션 표시",
    featuredHelp: "히어로 아래의 게시물 카드 그리드. 카테고리를 선택하거나 모든 게시물에서 가져옵니다 — 가장 최근 순.",
    featuredTitle: "섹션 제목",
    featuredSubtitle: "섹션 부제",
    featuredMode: "출처",
    featuredModes: { all: "모든 게시물 (최신순)", category: "단일 카테고리" },
    featuredCount: "카드 수",
    featuredCategory: "카테고리",
    featuredCategoryPlaceholder: "— 카테고리 선택 —",
    featuredCategoryEmpty: "카테고리가 아직 없습니다. 카테고리에서 먼저 만드세요.",
    testimonialsHeading: "추천사 섹션",
    testimonialsEnabled: "홈에 추천사 섹션 표시",
    testimonialsHelp: "별점 평가 + 작성자가 있는 고객 인용문. 각 항목은 카드입니다; 레이아웃은 1 / 2 / 3+ 항목에 맞춰집니다.",
    testimonialsVariant: "시각적 변형",
    testimonialsVariants: { glass: "밝은 배경 위 글래스 카드", navy: "네이비 섹션" },
    testimonialsEyebrow: "아이브로 라벨 (선택사항)",
    testimonialsTitle: "섹션 제목",
    testimonialsSubtitle: "섹션 부제",
    testimonialsItemsHeading: "추천사",
    testimonialsAdd: "추천사 추가",
    testimonialsItemIndex: "추천사 {{index}}",
    testimonialsQuote: "인용문",
    testimonialsAuthorName: "작성자 이름",
    testimonialsAuthorTitle: "작성자 직함 (예: CEO, Acme)",
    testimonialsAvatarUrl: "아바타 URL",
    testimonialsRating: "평점 (1–5)"
  },
  logo: {
    help: "헤더의 텍스트 워드마크를 대체할 로고를 업로드하세요. 권장 크기: {{width}}×{{height}} px. 이미지는 크기 조정되어 WebP로 저장됩니다.",
    none: "로고 없음",
    upload: "로고 업로드",
    uploading: "업로드 중…",
    change: "로고 변경",
    remove: "로고 제거",
    removing: "제거 중…",
    saved: "로고가 업데이트되었습니다. 변경사항을 보려면 게시된 페이지를 다시 로드하세요.",
    removed: "로고가 제거되었습니다.",
    failed: "로고 업로드 실패.",
    invalidType: "JPG, PNG 또는 WebP 이미지를 선택하세요."
  },
  style: {
    help: '디자인 토큰을 조정하여 색상과 타이포그래피를 사용자 정의합니다. "저장 및 적용"은 재생성된 테마 CSS를 사이트에 푸시합니다.',
    save: "저장 및 적용",
    saving: "적용 중…",
    saved: "스타일이 적용되었습니다. 게시된 페이지에서 강제 새로고침하여 변경사항을 확인하세요.",
    failed: "스타일 업데이트 실패.",
    reset: "기본값으로 재설정",
    resetting: "재설정 중…"
  },
  presets: {
    title: "스타일 프리셋",
    help: "그래픽 프리셋을 선택하면 아래 모든 필드가 자동으로 채워집니다. 이후에 값을 개별적으로 조정할 수 있습니다.",
    classic: {
      label: "클래식",
      description: "원본 코퍼레이트 기본 — 슬레이트 블루 표면 위 Inter, 네이비 프라이머리."
    },
    tech: {
      label: "테크",
      description: "선명한 중성 표면과 일렉트릭 시안 강조색 — Plus Jakarta Sans, 모던 SaaS 룩."
    },
    trust: {
      label: "신뢰",
      description: "따뜻한 크림과 진한 네이비, 앰버 강조색 — IBM Plex Sans, 금융 / 컨설팅 분위기."
    },
    vibrant: {
      label: "비비드",
      description: "핑크와 오렌지의 펀치 — DM Sans, 에너지 넘치는 스타트업 룩."
    },
    executive: {
      label: "이그제큐티브",
      description: "딥 퍼플과 골드, 크림 베이스 — Manrope, 프리미엄 컨설팅 / 럭셔리 서비스."
    }
  },
  groups: {
    surfaces: "표면",
    foreground: "텍스트",
    outlines: "외곽선",
    accent: "브랜드 및 강조",
    typography: "타이포그래피"
  },
  vars: {
    background: "페이지 배경",
    surface: "표면",
    surfaceLow: "표면 — 낮음",
    surfaceMid: "표면 — 중간",
    surfaceHigh: "표면 — 높음",
    surfaceLowest: "카드 표면",
    onSurface: "본문 텍스트",
    onSurfaceVariant: "보조 텍스트",
    outline: "외곽선",
    outlineVariant: "외곽선 — 부드러움",
    primary: "기본 (네이비)",
    onPrimary: "기본 위 텍스트",
    primaryContainer: "기본 컨테이너",
    onPrimaryContainer: "기본 컨테이너 위 텍스트",
    secondary: "보조 (CTA / 링크)",
    onSecondary: "보조 위 텍스트",
    tertiary: "3차",
    tertiaryContainer: "3차 컨테이너"
  },
  fonts: {
    sans: "산세리프 (전체 인터페이스)",
    help: "코퍼레이트 테마는 모든 것에 하나의 글꼴을 사용합니다. Google Fonts를 통해 로드되며 저장 시 @import 라인이 재생성됩니다."
  }
}, ko = {
  title: "Theme settings",
  settings: fo,
  publicBaked: {
    home: "Home",
    backToHome: "Back to home",
    notFoundTitle: "404",
    notFoundMessage: "The page you are looking for does not exist.",
    section: "Section",
    author: "Author",
    noPostsCategory: "No posts in this category yet.",
    noPostsAuthor: "No posts by this author yet.",
    follow: "Follow",
    follow404: "RSS feed for {{name}}",
    search: "Search",
    menu: "Open menu",
    getStarted: "Get Started",
    readMore: "Read more",
    readArticle: "Read article",
    learnMore: "Learn more",
    minRead: "{{minutes}} min read",
    popularArticles: "Popular articles",
    relatedFromSite: "Latest from {{site}}",
    shareThisArticle: "Share this article",
    backToInsights: "Back to {{name}}",
    pageOf: "Page {{current}} of {{total}}",
    previous: "Previous",
    next: "Next",
    articlesPublished: "Articles published",
    monthlyReaders: "Monthly readers"
  },
  blocks: {
    unknownPost: "Unknown post",
    heroOverlay: {
      title: "Hero — overlay",
      untitled: "(no title)",
      imageUrl: "Background image URL",
      imageUrlHelp: "Paste the URL of an image hosted on your site (Media library) or anywhere else.",
      imageAlt: "Alt text",
      eyebrow: "Eyebrow label",
      heading: "Headline",
      subtitle: "Lede / subtitle",
      primaryCtaLabel: "Primary CTA label",
      primaryCtaHref: "Primary CTA link",
      secondaryCtaLabel: "Secondary CTA label",
      secondaryCtaHref: "Secondary CTA link"
    },
    heroSplit: {
      title: "Hero — split",
      untitled: "(no title)",
      eyebrow: "Eyebrow label",
      heading: "Headline",
      subtitle: "Lede / subtitle",
      decorImageUrl: "Decorative image URL",
      decorImageHelp: "Faded into the right half of the hero. Optional — leave empty for a clean text-only variant."
    },
    servicesGrid: {
      title: "Services grid",
      preview: "{{count}} services",
      eyebrow: "Eyebrow label",
      heading: "Section heading",
      subtitle: "Section subtitle",
      servicesHeading: "Service cards",
      addService: "Add service",
      removeService: "Remove",
      moveUp: "Move up",
      moveDown: "Move down",
      serviceIndex: "Service {{index}}",
      icon: "Icon",
      iconHelp: "Use any Material Symbols Outlined glyph name — e.g. analytics, cloud_sync, security.",
      accent: "Accent (dark navy)",
      serviceTitle: "Title",
      serviceDescription: "Description",
      ctaLabel: "CTA label",
      ctaHref: "CTA link"
    },
    ctaBanner: {
      title: "CTA banner",
      untitled: "(no title)",
      variant: "Variant",
      variants: {
        navy: "Navy with accent glows",
        indigo: "Solid indigo card"
      },
      heading: "Headline",
      subtitle: "Subtitle"
    },
    testimonials: {
      title: "Testimonials",
      preview: "{{count}} testimonials",
      variant: "Variant",
      variants: { glass: "Glass cards on light surface", navy: "Navy section" },
      eyebrow: "Eyebrow label",
      heading: "Section heading",
      subtitle: "Section subtitle",
      itemsHeading: "Testimonials",
      addItem: "Add testimonial",
      itemIndex: "Testimonial {{index}}",
      quote: "Quote",
      authorName: "Author name",
      authorTitle: "Author title (e.g. CEO, Acme)",
      avatarUrl: "Avatar URL",
      rating: "Rating (1–5)"
    },
    trustBar: {
      title: "Trust bar (logos)",
      preview: "{{count}} logos",
      label: "Section label",
      labelPlaceholder: "Trusted by industry leaders",
      logosHeading: "Logos",
      addLogo: "Add logo",
      logoIndex: "Logo {{index}}",
      imageUrl: "Logo image URL",
      imageAlt: "Alt text",
      href: "Click target (optional)"
    },
    statsGrid: {
      title: "Stats grid",
      preview: "{{count}} stats",
      eyebrow: "Eyebrow label",
      heading: "Section heading",
      subtitle: "Section subtitle",
      statsHeading: "Stat items",
      addItem: "Add stat",
      itemIndex: "Stat {{index}}",
      value: "Value (e.g. 500+, 30%)",
      itemLabel: "Label (e.g. Clients)"
    },
    featureStack: {
      title: "Feature stack",
      preview: "{{count}} features",
      eyebrow: "Eyebrow label",
      heading: "Section heading",
      subtitle: "Section subtitle",
      alternate: "Alternate image side per row",
      featuresHeading: "Features",
      addFeature: "Add feature",
      itemIndex: "Feature {{index}}",
      icon: "Icon (Material Symbols)",
      eyebrowField: "Row eyebrow",
      featureTitle: "Title",
      featureDescription: "Description",
      ctaLabel: "CTA label",
      ctaHref: "CTA link",
      imageUrl: "Image URL",
      imagePosition: "Image side (override)",
      imagePositions: { auto: "Auto (alternates)", left: "Left", right: "Right" }
    },
    contactInfo: {
      title: "Contact info",
      preview: "{{lines}} info lines",
      heading: "Card heading",
      headingPlaceholder: "Contact information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      multilineHelp: "Use new lines to break onto multiple display lines.",
      socialsLabel: "Socials section label",
      socials: "Social links",
      addSocial: "Add social link",
      socialIcon: "Material Symbol icon",
      socialHref: "Link target"
    },
    contactForm: {
      title: "Contact form",
      preview: "Form ({{mode}})",
      heading: "Form heading",
      subtitle: "Form subtitle",
      mode: "Submit mode",
      modes: {
        endpoint: "Third-party endpoint (Formspree, Web3Forms, …)",
        mailto: "Mailto: link (no JS)"
      },
      modeHelp: "Endpoint mode posts a JSON body to the URL you configure. Mailto opens the visitor's mail client with the form pre-filled.",
      endpointUrl: "Endpoint URL",
      endpointHelp: `Paste the endpoint from your form provider (e.g. Formspree's "forms/abcdefg" URL).`,
      mailtoAddress: "Recipient email address",
      fieldLabels: "Field labels",
      labelName: "Name",
      labelEmail: "Email",
      labelCompany: "Company",
      labelSubject: "Subject",
      labelMessage: "Message",
      subjectOptions: "Subject dropdown options",
      subjectOptionsHelp: "One option per line. Empty = no subject dropdown.",
      submitLabel: "Submit button label",
      privacyHeading: "Consent",
      privacyText: "Consent line",
      privacyHelp: "Wrap any portion of the text with [link]…[/link] to turn it into a hyperlink (target set below).",
      privacyHref: "Privacy page URL",
      feedback: "Submission feedback",
      successMessage: "Success message",
      errorMessage: "Error message"
    }
  }
}, Co = {
  title: "Paramètres du thème",
  settings: go,
  publicBaked: {
    home: "Accueil",
    backToHome: "Retour à l'accueil",
    notFoundTitle: "404",
    notFoundMessage: "La page que vous cherchez n'existe pas.",
    section: "Rubrique",
    author: "Auteur",
    noPostsCategory: "Aucun article dans cette rubrique pour l'instant.",
    noPostsAuthor: "Aucun article de cet auteur pour l'instant.",
    follow: "Suivre",
    follow404: "Flux RSS pour {{name}}",
    search: "Rechercher",
    menu: "Ouvrir le menu",
    getStarted: "Démarrer",
    readMore: "Lire la suite",
    readArticle: "Lire l'article",
    learnMore: "En savoir plus",
    minRead: "{{minutes}} min de lecture",
    popularArticles: "Articles populaires",
    relatedFromSite: "À lire sur {{site}}",
    shareThisArticle: "Partager cet article",
    backToInsights: "Retour à {{name}}",
    pageOf: "Page {{current}} sur {{total}}",
    previous: "Précédent",
    next: "Suivant",
    articlesPublished: "Articles publiés",
    monthlyReaders: "Lecteurs mensuels"
  },
  blocks: {
    unknownPost: "Article inconnu",
    heroOverlay: {
      title: "Hero — superposition",
      untitled: "(sans titre)",
      imageUrl: "URL de l'image de fond",
      imageUrlHelp: "Collez l'URL d'une image hébergée sur votre site (Médiathèque) ou ailleurs.",
      imageAlt: "Texte alternatif",
      eyebrow: "Étiquette",
      heading: "Titre",
      subtitle: "Accroche / sous-titre",
      primaryCtaLabel: "Libellé CTA principal",
      primaryCtaHref: "Lien CTA principal",
      secondaryCtaLabel: "Libellé CTA secondaire",
      secondaryCtaHref: "Lien CTA secondaire"
    },
    heroSplit: {
      title: "Hero — split",
      untitled: "(sans titre)",
      eyebrow: "Étiquette",
      heading: "Titre",
      subtitle: "Accroche / sous-titre",
      decorImageUrl: "URL de l'image décorative",
      decorImageHelp: "Estompée dans la moitié droite du hero. Optionnelle — laissez vide pour une variante texte uniquement."
    },
    servicesGrid: {
      title: "Grille de services",
      preview: "{{count}} services",
      eyebrow: "Étiquette",
      heading: "Titre de section",
      subtitle: "Sous-titre de section",
      servicesHeading: "Cartes services",
      addService: "Ajouter un service",
      removeService: "Supprimer",
      moveUp: "Monter",
      moveDown: "Descendre",
      serviceIndex: "Service {{index}}",
      icon: "Icône",
      iconHelp: "Utilisez n'importe quel nom de glyphe Material Symbols Outlined — ex. analytics, cloud_sync, security.",
      accent: "Accent (navy foncé)",
      serviceTitle: "Titre",
      serviceDescription: "Description",
      ctaLabel: "Libellé CTA",
      ctaHref: "Lien CTA"
    },
    ctaBanner: {
      title: "Bannière CTA",
      untitled: "(sans titre)",
      variant: "Variante",
      variants: {
        navy: "Navy avec lumières d'accent",
        indigo: "Carte indigo pleine"
      },
      heading: "Titre",
      subtitle: "Sous-titre"
    },
    testimonials: {
      title: "Témoignages",
      preview: "{{count}} témoignages",
      variant: "Variante",
      variants: { glass: "Cartes glass sur fond clair", navy: "Section navy" },
      eyebrow: "Étiquette",
      heading: "Titre de section",
      subtitle: "Sous-titre de section",
      itemsHeading: "Témoignages",
      addItem: "Ajouter un témoignage",
      itemIndex: "Témoignage {{index}}",
      quote: "Citation",
      authorName: "Nom de l'auteur",
      authorTitle: "Titre de l'auteur (ex. CEO, Acme)",
      avatarUrl: "URL de l'avatar",
      rating: "Note (1–5)"
    },
    trustBar: {
      title: "Bandeau de confiance (logos)",
      preview: "{{count}} logos",
      label: "Libellé de section",
      labelPlaceholder: "Ils nous font confiance",
      logosHeading: "Logos",
      addLogo: "Ajouter un logo",
      logoIndex: "Logo {{index}}",
      imageUrl: "URL de l'image du logo",
      imageAlt: "Texte alternatif",
      href: "Lien (optionnel)"
    },
    statsGrid: {
      title: "Grille de stats",
      preview: "{{count}} stats",
      eyebrow: "Étiquette",
      heading: "Titre de section",
      subtitle: "Sous-titre de section",
      statsHeading: "Statistiques",
      addItem: "Ajouter une statistique",
      itemIndex: "Stat {{index}}",
      value: "Valeur (ex. 500+, 30%)",
      itemLabel: "Libellé (ex. Clients)"
    },
    featureStack: {
      title: "Pile de fonctionnalités",
      preview: "{{count}} fonctionnalités",
      eyebrow: "Étiquette",
      heading: "Titre de section",
      subtitle: "Sous-titre de section",
      alternate: "Alterner le côté image à chaque ligne",
      featuresHeading: "Fonctionnalités",
      addFeature: "Ajouter une fonctionnalité",
      itemIndex: "Fonctionnalité {{index}}",
      icon: "Icône (Material Symbols)",
      eyebrowField: "Étiquette de la ligne",
      featureTitle: "Titre",
      featureDescription: "Description",
      ctaLabel: "Libellé CTA",
      ctaHref: "Lien CTA",
      imageUrl: "URL de l'image",
      imagePosition: "Côté image (forcé)",
      imagePositions: { auto: "Auto (alterne)", left: "Gauche", right: "Droite" }
    },
    contactInfo: {
      title: "Coordonnées",
      preview: "{{lines}} lignes d'info",
      heading: "Titre de la carte",
      headingPlaceholder: "Coordonnées",
      address: "Adresse",
      phone: "Téléphone",
      email: "E-mail",
      multilineHelp: "Utilisez des sauts de ligne pour afficher sur plusieurs lignes.",
      socialsLabel: "Libellé section sociale",
      socials: "Liens sociaux",
      addSocial: "Ajouter un lien social",
      socialIcon: "Icône Material Symbol",
      socialHref: "Lien cible"
    },
    contactForm: {
      title: "Formulaire de contact",
      preview: "Formulaire ({{mode}})",
      heading: "Titre du formulaire",
      subtitle: "Sous-titre du formulaire",
      mode: "Mode d'envoi",
      modes: {
        endpoint: "Endpoint tiers (Formspree, Web3Forms, …)",
        mailto: "Lien mailto: (sans JS)"
      },
      modeHelp: "Le mode endpoint envoie un POST JSON à l'URL configurée. Mailto ouvre le client mail du visiteur avec le formulaire pré-rempli.",
      endpointUrl: "URL de l'endpoint",
      endpointHelp: "Collez l'endpoint de votre prestataire (ex. URL « forms/abcdefg » de Formspree).",
      mailtoAddress: "Adresse e-mail destinataire",
      fieldLabels: "Libellés des champs",
      labelName: "Nom",
      labelEmail: "E-mail",
      labelCompany: "Entreprise",
      labelSubject: "Sujet",
      labelMessage: "Message",
      subjectOptions: "Options du menu Sujet",
      subjectOptionsHelp: "Une option par ligne. Vide = pas de menu Sujet.",
      submitLabel: "Libellé du bouton d'envoi",
      privacyHeading: "Consentement",
      privacyText: "Ligne de consentement",
      privacyHelp: "Encadrez une portion du texte avec [link]…[/link] pour en faire un lien hypertexte (URL ci-dessous).",
      privacyHref: "URL de la page Confidentialité",
      feedback: "Retour utilisateur",
      successMessage: "Message de succès",
      errorMessage: "Message d'erreur"
    }
  }
}, So = {
  title: "Theme-Einstellungen",
  settings: bo,
  publicBaked: {
    home: "Startseite",
    backToHome: "Zurück zur Startseite",
    notFoundTitle: "404",
    notFoundMessage: "Die gesuchte Seite existiert nicht.",
    section: "Bereich",
    author: "Autor",
    noPostsCategory: "Noch keine Beiträge in dieser Kategorie.",
    noPostsAuthor: "Noch keine Beiträge von diesem Autor.",
    follow: "Folgen",
    follow404: "RSS-Feed für {{name}}",
    search: "Suchen",
    menu: "Menü öffnen",
    getStarted: "Loslegen",
    readMore: "Mehr lesen",
    readArticle: "Artikel lesen",
    learnMore: "Mehr erfahren",
    minRead: "{{minutes}} Min. Lesezeit",
    popularArticles: "Beliebte Artikel",
    relatedFromSite: "Neueste auf {{site}}",
    shareThisArticle: "Diesen Artikel teilen",
    backToInsights: "Zurück zu {{name}}",
    pageOf: "Seite {{current}} von {{total}}",
    previous: "Zurück",
    next: "Weiter",
    articlesPublished: "Veröffentlichte Artikel",
    monthlyReaders: "Monatliche Leser"
  },
  blocks: {
    unknownPost: "Unbekannter Beitrag",
    heroOverlay: {
      title: "Hero — Overlay",
      untitled: "(ohne Titel)",
      imageUrl: "URL des Hintergrundbilds",
      imageUrlHelp: "Fügen Sie die URL eines Bildes ein, das auf Ihrer Seite (Medienbibliothek) oder anderswo gehostet wird.",
      imageAlt: "Alternativtext",
      eyebrow: "Eyebrow-Label",
      heading: "Überschrift",
      subtitle: "Untertitel",
      primaryCtaLabel: "Primärer CTA-Text",
      primaryCtaHref: "Primärer CTA-Link",
      secondaryCtaLabel: "Sekundärer CTA-Text",
      secondaryCtaHref: "Sekundärer CTA-Link"
    },
    heroSplit: {
      title: "Hero — Split",
      untitled: "(ohne Titel)",
      eyebrow: "Eyebrow-Label",
      heading: "Überschrift",
      subtitle: "Untertitel",
      decorImageUrl: "URL des Dekorationsbilds",
      decorImageHelp: "In die rechte Hero-Hälfte eingeblendet. Optional — leer lassen für eine reine Textvariante."
    },
    servicesGrid: {
      title: "Service-Raster",
      preview: "{{count}} Leistungen",
      eyebrow: "Eyebrow-Label",
      heading: "Abschnittsüberschrift",
      subtitle: "Abschnittsuntertitel",
      servicesHeading: "Service-Karten",
      addService: "Service hinzufügen",
      removeService: "Entfernen",
      moveUp: "Nach oben",
      moveDown: "Nach unten",
      serviceIndex: "Service {{index}}",
      icon: "Symbol",
      iconHelp: "Verwenden Sie einen beliebigen Material-Symbols-Outlined-Glyphnamen — z. B. analytics, cloud_sync, security.",
      accent: "Akzent (dunkles Navy)",
      serviceTitle: "Titel",
      serviceDescription: "Beschreibung",
      ctaLabel: "CTA-Text",
      ctaHref: "CTA-Link"
    },
    ctaBanner: {
      title: "CTA-Banner",
      untitled: "(ohne Titel)",
      variant: "Variante",
      variants: {
        navy: "Navy mit Akzent-Glows",
        indigo: "Vollflächige Indigo-Karte"
      },
      heading: "Überschrift",
      subtitle: "Untertitel"
    },
    testimonials: {
      title: "Testimonials",
      preview: "{{count}} Testimonials",
      variant: "Variante",
      variants: { glass: "Glas-Karten auf hellem Hintergrund", navy: "Navy-Sektion" },
      eyebrow: "Eyebrow-Label",
      heading: "Abschnittsüberschrift",
      subtitle: "Abschnittsuntertitel",
      itemsHeading: "Testimonials",
      addItem: "Testimonial hinzufügen",
      itemIndex: "Testimonial {{index}}",
      quote: "Zitat",
      authorName: "Name des Autors",
      authorTitle: "Titel des Autors (z. B. CEO, Acme)",
      avatarUrl: "Avatar-URL",
      rating: "Bewertung (1–5)"
    },
    trustBar: {
      title: "Trust-Bar (Logos)",
      preview: "{{count}} Logos",
      label: "Abschnittslabel",
      labelPlaceholder: "Vertrauensvolle Branchenführer",
      logosHeading: "Logos",
      addLogo: "Logo hinzufügen",
      logoIndex: "Logo {{index}}",
      imageUrl: "Logo-URL",
      imageAlt: "Alternativtext",
      href: "Klickziel (optional)"
    },
    statsGrid: {
      title: "Statistik-Raster",
      preview: "{{count}} Statistiken",
      eyebrow: "Eyebrow-Label",
      heading: "Abschnittsüberschrift",
      subtitle: "Abschnittsuntertitel",
      statsHeading: "Statistik-Einträge",
      addItem: "Statistik hinzufügen",
      itemIndex: "Statistik {{index}}",
      value: "Wert (z. B. 500+, 30%)",
      itemLabel: "Label (z. B. Kunden)"
    },
    featureStack: {
      title: "Feature-Stack",
      preview: "{{count}} Features",
      eyebrow: "Eyebrow-Label",
      heading: "Abschnittsüberschrift",
      subtitle: "Abschnittsuntertitel",
      alternate: "Bildseite pro Reihe abwechseln",
      featuresHeading: "Features",
      addFeature: "Feature hinzufügen",
      itemIndex: "Feature {{index}}",
      icon: "Symbol (Material Symbols)",
      eyebrowField: "Reihen-Eyebrow",
      featureTitle: "Titel",
      featureDescription: "Beschreibung",
      ctaLabel: "CTA-Text",
      ctaHref: "CTA-Link",
      imageUrl: "Bild-URL",
      imagePosition: "Bildseite (Override)",
      imagePositions: { auto: "Auto (wechselnd)", left: "Links", right: "Rechts" }
    },
    contactInfo: {
      title: "Kontaktinformationen",
      preview: "{{lines}} Info-Zeilen",
      heading: "Karten-Überschrift",
      headingPlaceholder: "Kontaktinformationen",
      address: "Adresse",
      phone: "Telefon",
      email: "E-Mail",
      multilineHelp: "Verwenden Sie Zeilenumbrüche, um auf mehreren Zeilen anzuzeigen.",
      socialsLabel: "Label für Social-Sektion",
      socials: "Soziale Links",
      addSocial: "Sozialen Link hinzufügen",
      socialIcon: "Material-Symbol-Icon",
      socialHref: "Linkziel"
    },
    contactForm: {
      title: "Kontaktformular",
      preview: "Formular ({{mode}})",
      heading: "Formular-Überschrift",
      subtitle: "Formular-Untertitel",
      mode: "Senden-Modus",
      modes: {
        endpoint: "Drittanbieter-Endpunkt (Formspree, Web3Forms, …)",
        mailto: "Mailto:-Link (ohne JS)"
      },
      modeHelp: "Endpoint-Modus sendet einen JSON-Body an die konfigurierte URL. Mailto öffnet den E-Mail-Client des Besuchers mit vorausgefülltem Formular.",
      endpointUrl: "Endpoint-URL",
      endpointHelp: `Fügen Sie den Endpoint Ihres Form-Providers ein (z. B. Formspree's „forms/abcdefg"-URL).`,
      mailtoAddress: "Empfänger-E-Mail-Adresse",
      fieldLabels: "Feldbeschriftungen",
      labelName: "Name",
      labelEmail: "E-Mail",
      labelCompany: "Firma",
      labelSubject: "Betreff",
      labelMessage: "Nachricht",
      subjectOptions: "Betreff-Dropdown-Optionen",
      subjectOptionsHelp: "Eine Option pro Zeile. Leer = kein Betreff-Dropdown.",
      submitLabel: "Senden-Button-Text",
      privacyHeading: "Einwilligung",
      privacyText: "Einwilligungstext",
      privacyHelp: "Umschließen Sie einen Textteil mit [link]…[/link], um daraus einen Hyperlink zu machen (URL unten).",
      privacyHref: "URL der Datenschutzseite",
      feedback: "Einreich-Feedback",
      successMessage: "Erfolgsnachricht",
      errorMessage: "Fehlermeldung"
    }
  }
}, No = {
  title: "Configuración del tema",
  settings: vo,
  publicBaked: {
    home: "Inicio",
    backToHome: "Volver al inicio",
    notFoundTitle: "404",
    notFoundMessage: "La página que buscas no existe.",
    section: "Sección",
    author: "Autor",
    noPostsCategory: "Aún no hay artículos en esta categoría.",
    noPostsAuthor: "Aún no hay artículos de este autor.",
    follow: "Seguir",
    follow404: "Feed RSS para {{name}}",
    search: "Buscar",
    menu: "Abrir menú",
    getStarted: "Comenzar",
    readMore: "Leer más",
    readArticle: "Leer artículo",
    learnMore: "Saber más",
    minRead: "{{minutes}} min de lectura",
    popularArticles: "Artículos populares",
    relatedFromSite: "Lo último de {{site}}",
    shareThisArticle: "Compartir este artículo",
    backToInsights: "Volver a {{name}}",
    pageOf: "Página {{current}} de {{total}}",
    previous: "Anterior",
    next: "Siguiente",
    articlesPublished: "Artículos publicados",
    monthlyReaders: "Lectores mensuales"
  },
  blocks: {
    unknownPost: "Artículo desconocido",
    heroOverlay: {
      title: "Hero — superposición",
      untitled: "(sin título)",
      imageUrl: "URL de la imagen de fondo",
      imageUrlHelp: "Pega la URL de una imagen alojada en tu sitio (Biblioteca de medios) o en otro lugar.",
      imageAlt: "Texto alternativo",
      eyebrow: "Etiqueta",
      heading: "Titular",
      subtitle: "Subtítulo / lede",
      primaryCtaLabel: "Texto del CTA principal",
      primaryCtaHref: "Enlace del CTA principal",
      secondaryCtaLabel: "Texto del CTA secundario",
      secondaryCtaHref: "Enlace del CTA secundario"
    },
    heroSplit: {
      title: "Hero — split",
      untitled: "(sin título)",
      eyebrow: "Etiqueta",
      heading: "Titular",
      subtitle: "Subtítulo / lede",
      decorImageUrl: "URL de la imagen decorativa",
      decorImageHelp: "Difuminada en la mitad derecha del hero. Opcional — déjalo vacío para una variante solo de texto."
    },
    servicesGrid: {
      title: "Cuadrícula de servicios",
      preview: "{{count}} servicios",
      eyebrow: "Etiqueta",
      heading: "Título de sección",
      subtitle: "Subtítulo de sección",
      servicesHeading: "Tarjetas de servicio",
      addService: "Añadir servicio",
      removeService: "Eliminar",
      moveUp: "Mover arriba",
      moveDown: "Mover abajo",
      serviceIndex: "Servicio {{index}}",
      icon: "Icono",
      iconHelp: "Usa cualquier nombre de glifo Material Symbols Outlined — p. ej. analytics, cloud_sync, security.",
      accent: "Acento (navy oscuro)",
      serviceTitle: "Título",
      serviceDescription: "Descripción",
      ctaLabel: "Texto del CTA",
      ctaHref: "Enlace del CTA"
    },
    ctaBanner: {
      title: "Banner CTA",
      untitled: "(sin título)",
      variant: "Variante",
      variants: {
        navy: "Navy con destellos de acento",
        indigo: "Tarjeta indigo sólida"
      },
      heading: "Titular",
      subtitle: "Subtítulo"
    },
    testimonials: {
      title: "Testimonios",
      preview: "{{count}} testimonios",
      variant: "Variante",
      variants: { glass: "Tarjetas glass sobre fondo claro", navy: "Sección navy" },
      eyebrow: "Etiqueta",
      heading: "Título de sección",
      subtitle: "Subtítulo de sección",
      itemsHeading: "Testimonios",
      addItem: "Añadir testimonio",
      itemIndex: "Testimonio {{index}}",
      quote: "Cita",
      authorName: "Nombre del autor",
      authorTitle: "Cargo del autor (p. ej. CEO, Acme)",
      avatarUrl: "URL del avatar",
      rating: "Calificación (1–5)"
    },
    trustBar: {
      title: "Barra de confianza (logos)",
      preview: "{{count}} logos",
      label: "Etiqueta de sección",
      labelPlaceholder: "Confían en nosotros",
      logosHeading: "Logos",
      addLogo: "Añadir logo",
      logoIndex: "Logo {{index}}",
      imageUrl: "URL del logo",
      imageAlt: "Texto alternativo",
      href: "Enlace (opcional)"
    },
    statsGrid: {
      title: "Cuadrícula de estadísticas",
      preview: "{{count}} estadísticas",
      eyebrow: "Etiqueta",
      heading: "Título de sección",
      subtitle: "Subtítulo de sección",
      statsHeading: "Estadísticas",
      addItem: "Añadir estadística",
      itemIndex: "Estadística {{index}}",
      value: "Valor (p. ej. 500+, 30%)",
      itemLabel: "Etiqueta (p. ej. Clientes)"
    },
    featureStack: {
      title: "Pila de características",
      preview: "{{count}} características",
      eyebrow: "Etiqueta",
      heading: "Título de sección",
      subtitle: "Subtítulo de sección",
      alternate: "Alternar lado de imagen por fila",
      featuresHeading: "Características",
      addFeature: "Añadir característica",
      itemIndex: "Característica {{index}}",
      icon: "Icono (Material Symbols)",
      eyebrowField: "Etiqueta de la fila",
      featureTitle: "Título",
      featureDescription: "Descripción",
      ctaLabel: "Texto del CTA",
      ctaHref: "Enlace del CTA",
      imageUrl: "URL de la imagen",
      imagePosition: "Lado de imagen (forzar)",
      imagePositions: { auto: "Auto (alterna)", left: "Izquierda", right: "Derecha" }
    },
    contactInfo: {
      title: "Información de contacto",
      preview: "{{lines}} líneas de info",
      heading: "Título de la tarjeta",
      headingPlaceholder: "Información de contacto",
      address: "Dirección",
      phone: "Teléfono",
      email: "Email",
      multilineHelp: "Usa saltos de línea para mostrar en varias líneas.",
      socialsLabel: "Etiqueta de la sección social",
      socials: "Enlaces sociales",
      addSocial: "Añadir enlace social",
      socialIcon: "Icono Material Symbol",
      socialHref: "Enlace destino"
    },
    contactForm: {
      title: "Formulario de contacto",
      preview: "Formulario ({{mode}})",
      heading: "Título del formulario",
      subtitle: "Subtítulo del formulario",
      mode: "Modo de envío",
      modes: {
        endpoint: "Endpoint de terceros (Formspree, Web3Forms, …)",
        mailto: "Enlace mailto: (sin JS)"
      },
      modeHelp: "El modo endpoint envía un POST JSON a la URL configurada. Mailto abre el cliente de correo del visitante con el formulario rellenado.",
      endpointUrl: "URL del endpoint",
      endpointHelp: "Pega el endpoint de tu proveedor (p. ej. URL «forms/abcdefg» de Formspree).",
      mailtoAddress: "Dirección de email destinataria",
      fieldLabels: "Etiquetas de campos",
      labelName: "Nombre",
      labelEmail: "Email",
      labelCompany: "Empresa",
      labelSubject: "Asunto",
      labelMessage: "Mensaje",
      subjectOptions: "Opciones del menú Asunto",
      subjectOptionsHelp: "Una opción por línea. Vacío = sin menú Asunto.",
      submitLabel: "Texto del botón de envío",
      privacyHeading: "Consentimiento",
      privacyText: "Línea de consentimiento",
      privacyHelp: "Envuelve una parte del texto con [link]…[/link] para convertirla en un enlace (URL abajo).",
      privacyHref: "URL de la página de privacidad",
      feedback: "Feedback del envío",
      successMessage: "Mensaje de éxito",
      errorMessage: "Mensaje de error"
    }
  }
}, Ao = {
  title: "Thema-instellingen",
  settings: yo,
  publicBaked: {
    home: "Home",
    backToHome: "Terug naar home",
    notFoundTitle: "404",
    notFoundMessage: "De pagina die je zoekt bestaat niet.",
    section: "Sectie",
    author: "Auteur",
    noPostsCategory: "Nog geen artikelen in deze categorie.",
    noPostsAuthor: "Nog geen artikelen van deze auteur.",
    follow: "Volgen",
    follow404: "RSS-feed voor {{name}}",
    search: "Zoeken",
    menu: "Menu openen",
    getStarted: "Aan de slag",
    readMore: "Lees meer",
    readArticle: "Artikel lezen",
    learnMore: "Meer info",
    minRead: "{{minutes}} min leestijd",
    popularArticles: "Populaire artikelen",
    relatedFromSite: "Nieuwste van {{site}}",
    shareThisArticle: "Deel dit artikel",
    backToInsights: "Terug naar {{name}}",
    pageOf: "Pagina {{current}} van {{total}}",
    previous: "Vorige",
    next: "Volgende",
    articlesPublished: "Gepubliceerde artikelen",
    monthlyReaders: "Maandelijkse lezers"
  },
  blocks: {
    unknownPost: "Onbekende post",
    heroOverlay: {
      title: "Hero — overlay",
      untitled: "(geen titel)",
      imageUrl: "URL achtergrondafbeelding",
      imageUrlHelp: "Plak de URL van een afbeelding die op je site (Mediabibliotheek) of elders gehost wordt.",
      imageAlt: "Alt-tekst",
      eyebrow: "Eyebrow-label",
      heading: "Kop",
      subtitle: "Subtitel / lede",
      primaryCtaLabel: "Primaire CTA-tekst",
      primaryCtaHref: "Primaire CTA-link",
      secondaryCtaLabel: "Secundaire CTA-tekst",
      secondaryCtaHref: "Secundaire CTA-link"
    },
    heroSplit: {
      title: "Hero — split",
      untitled: "(geen titel)",
      eyebrow: "Eyebrow-label",
      heading: "Kop",
      subtitle: "Subtitel / lede",
      decorImageUrl: "URL decoratieve afbeelding",
      decorImageHelp: "Verzacht in de rechterhelft van de hero. Optioneel — leeg laten voor alleen-tekst variant."
    },
    servicesGrid: {
      title: "Diensten-raster",
      preview: "{{count}} diensten",
      eyebrow: "Eyebrow-label",
      heading: "Sectiekop",
      subtitle: "Sectie-ondertitel",
      servicesHeading: "Dienstkaarten",
      addService: "Dienst toevoegen",
      removeService: "Verwijderen",
      moveUp: "Omhoog",
      moveDown: "Omlaag",
      serviceIndex: "Dienst {{index}}",
      icon: "Icoon",
      iconHelp: "Gebruik elke Material Symbols Outlined glyph-naam — bv. analytics, cloud_sync, security.",
      accent: "Accent (donker navy)",
      serviceTitle: "Titel",
      serviceDescription: "Beschrijving",
      ctaLabel: "CTA-tekst",
      ctaHref: "CTA-link"
    },
    ctaBanner: {
      title: "CTA-banner",
      untitled: "(geen titel)",
      variant: "Variant",
      variants: {
        navy: "Navy met accent-glows",
        indigo: "Effen indigo kaart"
      },
      heading: "Kop",
      subtitle: "Subtitel"
    },
    testimonials: {
      title: "Testimonials",
      preview: "{{count}} testimonials",
      variant: "Variant",
      variants: { glass: "Glaskaarten op lichte achtergrond", navy: "Navy-sectie" },
      eyebrow: "Eyebrow-label",
      heading: "Sectiekop",
      subtitle: "Sectie-ondertitel",
      itemsHeading: "Testimonials",
      addItem: "Testimonial toevoegen",
      itemIndex: "Testimonial {{index}}",
      quote: "Citaat",
      authorName: "Naam van auteur",
      authorTitle: "Titel van auteur (bv. CEO, Acme)",
      avatarUrl: "Avatar-URL",
      rating: "Beoordeling (1–5)"
    },
    trustBar: {
      title: "Trust-bar (logo's)",
      preview: "{{count}} logo's",
      label: "Sectielabel",
      labelPlaceholder: "Vertrouwd door industrieleiders",
      logosHeading: "Logo's",
      addLogo: "Logo toevoegen",
      logoIndex: "Logo {{index}}",
      imageUrl: "Logo-URL",
      imageAlt: "Alt-tekst",
      href: "Klikdoel (optioneel)"
    },
    statsGrid: {
      title: "Statistieken-raster",
      preview: "{{count}} statistieken",
      eyebrow: "Eyebrow-label",
      heading: "Sectiekop",
      subtitle: "Sectie-ondertitel",
      statsHeading: "Statistieken",
      addItem: "Statistiek toevoegen",
      itemIndex: "Statistiek {{index}}",
      value: "Waarde (bv. 500+, 30%)",
      itemLabel: "Label (bv. Klanten)"
    },
    featureStack: {
      title: "Feature-stack",
      preview: "{{count}} features",
      eyebrow: "Eyebrow-label",
      heading: "Sectiekop",
      subtitle: "Sectie-ondertitel",
      alternate: "Beeldzijde per rij afwisselen",
      featuresHeading: "Features",
      addFeature: "Feature toevoegen",
      itemIndex: "Feature {{index}}",
      icon: "Icoon (Material Symbols)",
      eyebrowField: "Rij-eyebrow",
      featureTitle: "Titel",
      featureDescription: "Beschrijving",
      ctaLabel: "CTA-tekst",
      ctaHref: "CTA-link",
      imageUrl: "Afbeeldings-URL",
      imagePosition: "Beeldzijde (forceer)",
      imagePositions: { auto: "Auto (wisselt af)", left: "Links", right: "Rechts" }
    },
    contactInfo: {
      title: "Contactgegevens",
      preview: "{{lines}} info-regels",
      heading: "Kaarttitel",
      headingPlaceholder: "Contactgegevens",
      address: "Adres",
      phone: "Telefoon",
      email: "E-mail",
      multilineHelp: "Gebruik regeleinden om over meerdere regels weer te geven.",
      socialsLabel: "Label sociale sectie",
      socials: "Sociale links",
      addSocial: "Sociale link toevoegen",
      socialIcon: "Material Symbol-icoon",
      socialHref: "Linkdoel"
    },
    contactForm: {
      title: "Contactformulier",
      preview: "Formulier ({{mode}})",
      heading: "Formuliertitel",
      subtitle: "Formulier-ondertitel",
      mode: "Verzendmodus",
      modes: {
        endpoint: "Endpoint van derden (Formspree, Web3Forms, …)",
        mailto: "Mailto:-link (zonder JS)"
      },
      modeHelp: "Endpoint-modus verzendt een JSON-body naar de geconfigureerde URL. Mailto opent de e-mailclient van de bezoeker met het formulier vooringevuld.",
      endpointUrl: "Endpoint-URL",
      endpointHelp: `Plak de endpoint van je formulierprovider (bv. Formspree's "forms/abcdefg"-URL).`,
      mailtoAddress: "E-mailadres van ontvanger",
      fieldLabels: "Veldlabels",
      labelName: "Naam",
      labelEmail: "E-mail",
      labelCompany: "Bedrijf",
      labelSubject: "Onderwerp",
      labelMessage: "Bericht",
      subjectOptions: "Onderwerp-dropdown opties",
      subjectOptionsHelp: "Eén optie per regel. Leeg = geen onderwerp-dropdown.",
      submitLabel: "Tekst van verzendknop",
      privacyHeading: "Toestemming",
      privacyText: "Toestemmingsregel",
      privacyHelp: "Wikkel een deel van de tekst met [link]…[/link] om er een hyperlink van te maken (URL hieronder).",
      privacyHref: "URL van privacypagina",
      feedback: "Verzend-feedback",
      successMessage: "Succesbericht",
      errorMessage: "Foutbericht"
    }
  }
}, To = {
  title: "Configurações do tema",
  settings: xo,
  publicBaked: {
    home: "Início",
    backToHome: "Voltar ao início",
    notFoundTitle: "404",
    notFoundMessage: "A página que você procura não existe.",
    section: "Seção",
    author: "Autor",
    noPostsCategory: "Ainda não há artigos nesta categoria.",
    noPostsAuthor: "Ainda não há artigos deste autor.",
    follow: "Seguir",
    follow404: "Feed RSS para {{name}}",
    search: "Pesquisar",
    menu: "Abrir menu",
    getStarted: "Começar",
    readMore: "Leia mais",
    readArticle: "Ler artigo",
    learnMore: "Saiba mais",
    minRead: "{{minutes}} min de leitura",
    popularArticles: "Artigos populares",
    relatedFromSite: "Mais recentes em {{site}}",
    shareThisArticle: "Compartilhar este artigo",
    backToInsights: "Voltar para {{name}}",
    pageOf: "Página {{current}} de {{total}}",
    previous: "Anterior",
    next: "Próximo",
    articlesPublished: "Artigos publicados",
    monthlyReaders: "Leitores mensais"
  },
  blocks: {
    unknownPost: "Artigo desconhecido",
    heroOverlay: {
      title: "Hero — sobreposição",
      untitled: "(sem título)",
      imageUrl: "URL da imagem de fundo",
      imageUrlHelp: "Cole a URL de uma imagem hospedada no seu site (Biblioteca de mídia) ou em outro lugar.",
      imageAlt: "Texto alternativo",
      eyebrow: "Etiqueta",
      heading: "Manchete",
      subtitle: "Lede / subtítulo",
      primaryCtaLabel: "Texto do CTA principal",
      primaryCtaHref: "Link do CTA principal",
      secondaryCtaLabel: "Texto do CTA secundário",
      secondaryCtaHref: "Link do CTA secundário"
    },
    heroSplit: {
      title: "Hero — split",
      untitled: "(sem título)",
      eyebrow: "Etiqueta",
      heading: "Manchete",
      subtitle: "Lede / subtítulo",
      decorImageUrl: "URL da imagem decorativa",
      decorImageHelp: "Esmaecida na metade direita do hero. Opcional — deixe vazio para uma variante apenas de texto."
    },
    servicesGrid: {
      title: "Grade de serviços",
      preview: "{{count}} serviços",
      eyebrow: "Etiqueta",
      heading: "Título da seção",
      subtitle: "Subtítulo da seção",
      servicesHeading: "Cartões de serviço",
      addService: "Adicionar serviço",
      removeService: "Remover",
      moveUp: "Mover para cima",
      moveDown: "Mover para baixo",
      serviceIndex: "Serviço {{index}}",
      icon: "Ícone",
      iconHelp: "Use qualquer nome de glifo Material Symbols Outlined — ex. analytics, cloud_sync, security.",
      accent: "Acento (navy escuro)",
      serviceTitle: "Título",
      serviceDescription: "Descrição",
      ctaLabel: "Texto do CTA",
      ctaHref: "Link do CTA"
    },
    ctaBanner: {
      title: "Banner CTA",
      untitled: "(sem título)",
      variant: "Variante",
      variants: {
        navy: "Navy com brilhos de acento",
        indigo: "Cartão indigo sólido"
      },
      heading: "Manchete",
      subtitle: "Subtítulo"
    },
    testimonials: {
      title: "Depoimentos",
      preview: "{{count}} depoimentos",
      variant: "Variante",
      variants: { glass: "Cartões glass sobre fundo claro", navy: "Seção navy" },
      eyebrow: "Etiqueta",
      heading: "Título da seção",
      subtitle: "Subtítulo da seção",
      itemsHeading: "Depoimentos",
      addItem: "Adicionar depoimento",
      itemIndex: "Depoimento {{index}}",
      quote: "Citação",
      authorName: "Nome do autor",
      authorTitle: "Cargo do autor (ex. CEO, Acme)",
      avatarUrl: "URL do avatar",
      rating: "Classificação (1–5)"
    },
    trustBar: {
      title: "Barra de confiança (logos)",
      preview: "{{count}} logos",
      label: "Etiqueta da seção",
      labelPlaceholder: "Confiado por líderes do setor",
      logosHeading: "Logos",
      addLogo: "Adicionar logo",
      logoIndex: "Logo {{index}}",
      imageUrl: "URL do logo",
      imageAlt: "Texto alternativo",
      href: "Link (opcional)"
    },
    statsGrid: {
      title: "Grade de estatísticas",
      preview: "{{count}} estatísticas",
      eyebrow: "Etiqueta",
      heading: "Título da seção",
      subtitle: "Subtítulo da seção",
      statsHeading: "Estatísticas",
      addItem: "Adicionar estatística",
      itemIndex: "Estatística {{index}}",
      value: "Valor (ex. 500+, 30%)",
      itemLabel: "Etiqueta (ex. Clientes)"
    },
    featureStack: {
      title: "Pilha de recursos",
      preview: "{{count}} recursos",
      eyebrow: "Etiqueta",
      heading: "Título da seção",
      subtitle: "Subtítulo da seção",
      alternate: "Alternar lado da imagem por linha",
      featuresHeading: "Recursos",
      addFeature: "Adicionar recurso",
      itemIndex: "Recurso {{index}}",
      icon: "Ícone (Material Symbols)",
      eyebrowField: "Etiqueta da linha",
      featureTitle: "Título",
      featureDescription: "Descrição",
      ctaLabel: "Texto do CTA",
      ctaHref: "Link do CTA",
      imageUrl: "URL da imagem",
      imagePosition: "Lado da imagem (forçar)",
      imagePositions: { auto: "Auto (alterna)", left: "Esquerda", right: "Direita" }
    },
    contactInfo: {
      title: "Informações de contato",
      preview: "{{lines}} linhas de info",
      heading: "Título do cartão",
      headingPlaceholder: "Informações de contato",
      address: "Endereço",
      phone: "Telefone",
      email: "E-mail",
      multilineHelp: "Use quebras de linha para exibir em várias linhas.",
      socialsLabel: "Etiqueta da seção social",
      socials: "Links sociais",
      addSocial: "Adicionar link social",
      socialIcon: "Ícone Material Symbol",
      socialHref: "Link de destino"
    },
    contactForm: {
      title: "Formulário de contato",
      preview: "Formulário ({{mode}})",
      heading: "Título do formulário",
      subtitle: "Subtítulo do formulário",
      mode: "Modo de envio",
      modes: {
        endpoint: "Endpoint de terceiros (Formspree, Web3Forms, …)",
        mailto: "Link mailto: (sem JS)"
      },
      modeHelp: "O modo endpoint envia um POST JSON para a URL configurada. Mailto abre o cliente de e-mail do visitante com o formulário pré-preenchido.",
      endpointUrl: "URL do endpoint",
      endpointHelp: "Cole o endpoint do seu provedor (ex. URL «forms/abcdefg» do Formspree).",
      mailtoAddress: "Endereço de e-mail destinatário",
      fieldLabels: "Etiquetas dos campos",
      labelName: "Nome",
      labelEmail: "E-mail",
      labelCompany: "Empresa",
      labelSubject: "Assunto",
      labelMessage: "Mensagem",
      subjectOptions: "Opções do menu Assunto",
      subjectOptionsHelp: "Uma opção por linha. Vazio = sem menu Assunto.",
      submitLabel: "Texto do botão de envio",
      privacyHeading: "Consentimento",
      privacyText: "Linha de consentimento",
      privacyHelp: "Envolva uma parte do texto com [link]…[/link] para transformá-la em um hyperlink (URL abaixo).",
      privacyHref: "URL da página de privacidade",
      feedback: "Feedback do envio",
      successMessage: "Mensagem de sucesso",
      errorMessage: "Mensagem de erro"
    }
  }
}, Eo = {
  title: "테마 설정",
  settings: wo,
  publicBaked: {
    home: "홈",
    backToHome: "홈으로 돌아가기",
    notFoundTitle: "404",
    notFoundMessage: "찾으시는 페이지가 존재하지 않습니다.",
    section: "섹션",
    author: "작성자",
    noPostsCategory: "이 카테고리에 아직 게시물이 없습니다.",
    noPostsAuthor: "이 작성자의 게시물이 아직 없습니다.",
    follow: "팔로우",
    follow404: "{{name}}의 RSS 피드",
    search: "검색",
    menu: "메뉴 열기",
    getStarted: "시작하기",
    readMore: "더 읽기",
    readArticle: "기사 읽기",
    learnMore: "자세히 알아보기",
    minRead: "{{minutes}}분 읽기",
    popularArticles: "인기 기사",
    relatedFromSite: "{{site}}의 최신 글",
    shareThisArticle: "이 글 공유하기",
    backToInsights: "{{name}}(으)로 돌아가기",
    pageOf: "{{total}} 중 {{current}} 페이지",
    previous: "이전",
    next: "다음",
    articlesPublished: "게시된 기사",
    monthlyReaders: "월간 독자"
  },
  blocks: {
    unknownPost: "알 수 없는 게시물",
    heroOverlay: {
      title: "히어로 — 오버레이",
      untitled: "(제목 없음)",
      imageUrl: "배경 이미지 URL",
      imageUrlHelp: "사이트 (미디어 라이브러리) 또는 다른 곳에 호스팅된 이미지의 URL을 붙여넣으세요.",
      imageAlt: "대체 텍스트",
      eyebrow: "아이브로 라벨",
      heading: "헤드라인",
      subtitle: "서브타이틀",
      primaryCtaLabel: "기본 CTA 텍스트",
      primaryCtaHref: "기본 CTA 링크",
      secondaryCtaLabel: "보조 CTA 텍스트",
      secondaryCtaHref: "보조 CTA 링크"
    },
    heroSplit: {
      title: "히어로 — 분할",
      untitled: "(제목 없음)",
      eyebrow: "아이브로 라벨",
      heading: "헤드라인",
      subtitle: "서브타이틀",
      decorImageUrl: "장식 이미지 URL",
      decorImageHelp: "히어로의 오른쪽 절반에 페이드인. 선택사항 — 텍스트 전용 변형은 비워두세요."
    },
    servicesGrid: {
      title: "서비스 그리드",
      preview: "서비스 {{count}}개",
      eyebrow: "아이브로 라벨",
      heading: "섹션 제목",
      subtitle: "섹션 부제",
      servicesHeading: "서비스 카드",
      addService: "서비스 추가",
      removeService: "제거",
      moveUp: "위로",
      moveDown: "아래로",
      serviceIndex: "서비스 {{index}}",
      icon: "아이콘",
      iconHelp: "Material Symbols Outlined 글리프 이름을 사용하세요 — 예: analytics, cloud_sync, security.",
      accent: "강조 (어두운 네이비)",
      serviceTitle: "제목",
      serviceDescription: "설명",
      ctaLabel: "CTA 텍스트",
      ctaHref: "CTA 링크"
    },
    ctaBanner: {
      title: "CTA 배너",
      untitled: "(제목 없음)",
      variant: "변형",
      variants: {
        navy: "강조 글로우가 있는 네이비",
        indigo: "단색 인디고 카드"
      },
      heading: "헤드라인",
      subtitle: "서브타이틀"
    },
    testimonials: {
      title: "추천사",
      preview: "추천사 {{count}}개",
      variant: "변형",
      variants: { glass: "밝은 배경 위 글래스 카드", navy: "네이비 섹션" },
      eyebrow: "아이브로 라벨",
      heading: "섹션 제목",
      subtitle: "섹션 부제",
      itemsHeading: "추천사",
      addItem: "추천사 추가",
      itemIndex: "추천사 {{index}}",
      quote: "인용문",
      authorName: "작성자 이름",
      authorTitle: "작성자 직함 (예: CEO, Acme)",
      avatarUrl: "아바타 URL",
      rating: "평점 (1–5)"
    },
    trustBar: {
      title: "신뢰 바 (로고)",
      preview: "로고 {{count}}개",
      label: "섹션 라벨",
      labelPlaceholder: "업계 리더들이 신뢰함",
      logosHeading: "로고",
      addLogo: "로고 추가",
      logoIndex: "로고 {{index}}",
      imageUrl: "로고 이미지 URL",
      imageAlt: "대체 텍스트",
      href: "클릭 대상 (선택사항)"
    },
    statsGrid: {
      title: "통계 그리드",
      preview: "통계 {{count}}개",
      eyebrow: "아이브로 라벨",
      heading: "섹션 제목",
      subtitle: "섹션 부제",
      statsHeading: "통계 항목",
      addItem: "통계 추가",
      itemIndex: "통계 {{index}}",
      value: "값 (예: 500+, 30%)",
      itemLabel: "라벨 (예: 고객)"
    },
    featureStack: {
      title: "기능 스택",
      preview: "기능 {{count}}개",
      eyebrow: "아이브로 라벨",
      heading: "섹션 제목",
      subtitle: "섹션 부제",
      alternate: "행마다 이미지 측면 교차",
      featuresHeading: "기능",
      addFeature: "기능 추가",
      itemIndex: "기능 {{index}}",
      icon: "아이콘 (Material Symbols)",
      eyebrowField: "행 아이브로",
      featureTitle: "제목",
      featureDescription: "설명",
      ctaLabel: "CTA 텍스트",
      ctaHref: "CTA 링크",
      imageUrl: "이미지 URL",
      imagePosition: "이미지 측면 (강제)",
      imagePositions: { auto: "자동 (교차)", left: "왼쪽", right: "오른쪽" }
    },
    contactInfo: {
      title: "연락처 정보",
      preview: "정보 줄 {{lines}}개",
      heading: "카드 제목",
      headingPlaceholder: "연락처 정보",
      address: "주소",
      phone: "전화",
      email: "이메일",
      multilineHelp: "여러 줄로 표시하려면 줄바꿈을 사용하세요.",
      socialsLabel: "소셜 섹션 라벨",
      socials: "소셜 링크",
      addSocial: "소셜 링크 추가",
      socialIcon: "Material Symbol 아이콘",
      socialHref: "링크 대상"
    },
    contactForm: {
      title: "연락 양식",
      preview: "양식 ({{mode}})",
      heading: "양식 제목",
      subtitle: "양식 부제",
      mode: "전송 모드",
      modes: {
        endpoint: "타사 엔드포인트 (Formspree, Web3Forms, …)",
        mailto: "Mailto: 링크 (JS 없음)"
      },
      modeHelp: "엔드포인트 모드는 구성된 URL로 JSON 본문을 POST합니다. Mailto는 양식이 미리 채워진 상태로 방문자의 메일 클라이언트를 엽니다.",
      endpointUrl: "엔드포인트 URL",
      endpointHelp: '양식 제공업체의 엔드포인트를 붙여넣으세요 (예: Formspree의 "forms/abcdefg" URL).',
      mailtoAddress: "수신자 이메일 주소",
      fieldLabels: "필드 라벨",
      labelName: "이름",
      labelEmail: "이메일",
      labelCompany: "회사",
      labelSubject: "제목",
      labelMessage: "메시지",
      subjectOptions: "제목 드롭다운 옵션",
      subjectOptionsHelp: "한 줄에 하나의 옵션. 비어있음 = 제목 드롭다운 없음.",
      submitLabel: "전송 버튼 텍스트",
      privacyHeading: "동의",
      privacyText: "동의 텍스트",
      privacyHelp: "텍스트 일부를 [link]…[/link]로 감싸면 하이퍼링크가 됩니다 (URL은 아래에 설정).",
      privacyHref: "개인정보 처리방침 페이지 URL",
      feedback: "제출 피드백",
      successMessage: "성공 메시지",
      errorMessage: "오류 메시지"
    }
  }
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lo = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), hn = (...r) => r.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Mo = {
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
const Io = Xt(
  ({
    color: r = "currentColor",
    size: e = 24,
    strokeWidth: t = 2,
    absoluteStrokeWidth: n,
    className: a = "",
    children: o,
    iconNode: i,
    ...s
  }, c) => vt(
    "svg",
    {
      ref: c,
      ...Mo,
      width: e,
      height: e,
      stroke: r,
      strokeWidth: n ? Number(t) * 24 / Number(e) : t,
      className: hn("lucide", a),
      ...s
    },
    [
      ...i.map(([u, d]) => vt(u, d)),
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
const F = (r, e) => {
  const t = Xt(
    ({ className: n, ...a }, o) => vt(Io, {
      ref: o,
      iconNode: e,
      className: hn(`lucide-${Lo(r)}`, n),
      ...a
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
const Me = F("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ie = F("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mn = F("ChartColumn", [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fn = F("Grid3x3", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xe = F("Image", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gn = F("Layers", [
  [
    "path",
    {
      d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
      key: "8b97xw"
    }
  ],
  ["path", { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", key: "dd6zsq" }],
  ["path", { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65", key: "ep9fru" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bn = F("LayoutPanelLeft", [
  ["rect", { width: "7", height: "18", x: "3", y: "3", rx: "1", key: "2obqm" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ae = F("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vn = F("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yn = F("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xn = F("Megaphone", [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ho = F("Palette", [
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  [
    "path",
    {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
      key: "12rzf8"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ve = F("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wn = F("Quote", [
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
const kn = F("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tr = F("Save", [
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
const Cn = F("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ie = F("Trash2", [
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
const Oo = F("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]), st = "corporate", Lr = 480, Mr = 144, Po = "contain", Ir = ["image/jpeg", "image/png", "image/webp"];
function Ro({
  config: r,
  save: e
}) {
  const { t } = H("theme-corporate"), [n, a] = Q("home");
  return /* @__PURE__ */ p("div", { className: "space-y-6", children: [
    /* @__PURE__ */ l("p", { className: "text-sm text-surface-600 dark:text-surface-300", children: t("settings.description") }),
    /* @__PURE__ */ p(
      "nav",
      {
        className: "flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800",
        "aria-label": t("title"),
        children: [
          /* @__PURE__ */ l(
            lt,
            {
              active: n === "home",
              onClick: () => a("home"),
              label: t("settings.tabs.home")
            }
          ),
          /* @__PURE__ */ l(
            lt,
            {
              active: n === "single",
              onClick: () => a("single"),
              label: t("settings.tabs.single")
            }
          ),
          /* @__PURE__ */ l(
            lt,
            {
              active: n === "logo",
              onClick: () => a("logo"),
              label: t("settings.tabs.logo")
            }
          ),
          /* @__PURE__ */ l(
            lt,
            {
              active: n === "style",
              onClick: () => a("style"),
              label: t("settings.tabs.style")
            }
          )
        ]
      }
    ),
    n === "home" && /* @__PURE__ */ l(Fo, { config: r, save: e }),
    n === "single" && /* @__PURE__ */ l(Uo, { config: r, save: e }),
    n === "logo" && /* @__PURE__ */ l(zo, { config: r, save: e }),
    n === "style" && /* @__PURE__ */ l(Bo, { config: r, save: e })
  ] });
}
function lt({
  active: r,
  onClick: e,
  label: t
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      onClick: e,
      className: r ? "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-blue-600 text-surface-900 dark:text-surface-50" : "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
      children: t
    }
  );
}
function zo({
  config: r,
  save: e
}) {
  const { t } = H("theme-corporate"), { settings: n, terms: a } = an(), [o, i] = Q(!1), [s, c] = Q(!1), u = $a(null), d = r.logoEnabled && n.baseUrl ? `${n.baseUrl.replace(/\/+$/, "")}/${Oa(st)}?v=${r.logoUpdatedAt}` : "";
  async function h(b) {
    const g = {
      ...n,
      themeConfigs: { ...n.themeConfigs, [st]: b }
    };
    try {
      const [v, x] = await Promise.all([
        Nr({ type: "post" }),
        Nr({ type: "page" })
      ]);
      await Ba(g, v, x, a);
    } catch (v) {
      console.error("[theme-corporate] menu.json refresh failed:", v);
    }
  }
  async function m(b) {
    if (!Ir.includes(b.type)) {
      J.error(t("settings.logo.invalidType"));
      return;
    }
    i(!0);
    try {
      await Ra({
        themeId: st,
        file: b,
        width: Lr,
        height: Mr,
        fit: Po
      });
      const g = {
        ...r,
        logoEnabled: !0,
        logoUpdatedAt: Date.now()
      };
      await e(g), await h(g), J.success(t("settings.logo.saved"));
    } catch (g) {
      console.error("[theme-corporate] logo upload failed:", g), J.error(t("settings.logo.failed"));
    } finally {
      i(!1), u.current && (u.current.value = "");
    }
  }
  async function f() {
    c(!0);
    try {
      await za(st);
      const b = {
        ...r,
        logoEnabled: !1,
        logoUpdatedAt: 0
      };
      await e(b), await h(b), J.success(t("settings.logo.removed"));
    } catch (b) {
      console.error("[theme-corporate] logo remove failed:", b), J.error(t("settings.logo.failed"));
    } finally {
      c(!1);
    }
  }
  return /* @__PURE__ */ p("section", { className: "card p-4 space-y-4", children: [
    /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.logo.help", { width: Lr, height: Mr }) }),
    /* @__PURE__ */ p("div", { className: "flex items-center gap-4", children: [
      d ? /* @__PURE__ */ l(
        "img",
        {
          src: d,
          alt: "",
          className: "h-20 w-auto max-w-[240px] rounded bg-white p-2 ring-1 ring-surface-200 object-contain dark:ring-surface-700"
        }
      ) : /* @__PURE__ */ l("div", { className: "h-20 w-40 rounded bg-surface-100 flex items-center justify-center text-surface-400 text-xs dark:bg-surface-800", children: t("settings.logo.none") }),
      /* @__PURE__ */ p("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ l(
          "input",
          {
            ref: u,
            type: "file",
            accept: Ir.join(","),
            className: "hidden",
            onChange: (b) => {
              var v;
              const g = (v = b.target.files) == null ? void 0 : v[0];
              g && m(g);
            }
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "btn-secondary",
            onClick: () => {
              var b;
              return (b = u.current) == null ? void 0 : b.click();
            },
            disabled: o || s,
            children: /* @__PURE__ */ p("span", { className: "inline-flex items-center justify-center gap-1.5", children: [
              /* @__PURE__ */ l(Ae, { className: "h-4 w-4 animate-spin " + (o ? "" : "hidden") }),
              /* @__PURE__ */ l(Xe, { className: "h-4 w-4 " + (!o && r.logoEnabled ? "" : "hidden") }),
              /* @__PURE__ */ l(Oo, { className: "h-4 w-4 " + (!o && !r.logoEnabled ? "" : "hidden") }),
              /* @__PURE__ */ l("span", { children: o ? t("settings.logo.uploading") : r.logoEnabled ? t("settings.logo.change") : t("settings.logo.upload") })
            ] })
          }
        ),
        r.logoEnabled && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "btn-ghost",
            onClick: f,
            disabled: o || s,
            children: /* @__PURE__ */ p("span", { className: "inline-flex items-center justify-center gap-1.5", children: [
              /* @__PURE__ */ l(Ae, { className: "h-4 w-4 animate-spin " + (s ? "" : "hidden") }),
              /* @__PURE__ */ l(ie, { className: "h-4 w-4 " + (s ? "hidden" : "") }),
              /* @__PURE__ */ l("span", { children: t(s ? "settings.logo.removing" : "settings.logo.remove") })
            ] })
          }
        )
      ] })
    ] })
  ] });
}
function Bo({
  config: r,
  save: e
}) {
  const { t } = H("theme-corporate"), [n, a] = Q(r.style ?? Pe), [o, i] = Q(!1), [s, c] = Q(!1);
  function u(v, x) {
    a((S) => ({ ...S, vars: { ...S.vars, [v]: x } }));
  }
  function d(v) {
    a((x) => {
      const S = { ...x.vars };
      return delete S[v], { ...x, vars: S };
    });
  }
  async function h() {
    i(!0);
    try {
      await Tr({
        baseCssText: rn.cssText,
        style: n
      });
      const v = {
        ...r,
        style: n,
        cssUpdatedAt: Date.now()
      };
      await e(v), J.success(t("settings.style.saved"));
    } catch (v) {
      console.error("[theme-corporate] style save failed:", v), J.error(t("settings.style.failed"));
    } finally {
      i(!1);
    }
  }
  async function m() {
    c(!0);
    try {
      await Tr({
        baseCssText: rn.cssText,
        style: Pe
      });
      const v = {
        ...r,
        style: Pe,
        cssUpdatedAt: Date.now()
      };
      await e(v), a(Pe), J.success(t("settings.style.saved"));
    } catch (v) {
      console.error("[theme-corporate] style reset failed:", v), J.error(t("settings.style.failed"));
    } finally {
      c(!1);
    }
  }
  const f = /* @__PURE__ */ new Map();
  for (const v of Ht) {
    const x = f.get(v.group) ?? [];
    x.push(v), f.set(v.group, x);
  }
  const b = ro(), g = Object.keys(yt.sans).map((v) => ({
    name: v,
    fallback: "sans-serif"
  }));
  return /* @__PURE__ */ p("div", { className: "space-y-6", children: [
    /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.style.help") }),
    /* @__PURE__ */ l(jo, { draft: n, setDraft: a }),
    /* @__PURE__ */ p("section", { className: "card p-4 space-y-4", children: [
      /* @__PURE__ */ l("h2", { className: "font-semibold", children: t("settings.groups.typography") }),
      /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.fonts.help") }),
      /* @__PURE__ */ l("link", { rel: "stylesheet", href: b }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: t("settings.fonts.sans") }),
        /* @__PURE__ */ l(
          Pa,
          {
            options: g,
            value: n.fontSans || Ne,
            onChange: (v) => a((x) => ({ ...x, fontSans: v }))
          }
        )
      ] })
    ] }),
    Xa.map((v) => {
      const x = f.get(v) ?? [];
      return x.length === 0 ? null : /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
        /* @__PURE__ */ l("h2", { className: "font-semibold", children: t(`settings.groups.${v}`) }),
        /* @__PURE__ */ l("div", { className: "grid sm:grid-cols-2 gap-3", children: x.map((S) => /* @__PURE__ */ l(
          $o,
          {
            spec: S,
            value: n.vars[S.name] ?? "",
            onChange: (A) => u(S.name, A),
            onClear: () => d(S.name),
            label: t(`settings.${S.labelKey}`)
          },
          S.name
        )) })
      ] }, v);
    }),
    /* @__PURE__ */ p("div", { className: "card p-4 flex flex-wrap gap-3 justify-end", children: [
      /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "btn-ghost",
          onClick: m,
          disabled: o || s,
          children: [
            /* @__PURE__ */ l(Ae, { className: s ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ l(kn, { className: s ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ l("span", { children: t(s ? "settings.style.resetting" : "settings.style.reset") })
          ]
        }
      ),
      /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "btn-primary",
          onClick: h,
          disabled: o || s,
          children: [
            /* @__PURE__ */ l(Ae, { className: o ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ l(tr, { className: o ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ l("span", { children: t(o ? "settings.style.saving" : "settings.style.save") })
          ]
        }
      )
    ] })
  ] });
}
function $o({
  spec: r,
  value: e,
  onChange: t,
  onClear: n,
  label: a
}) {
  const o = e || r.defaultValue;
  return /* @__PURE__ */ p("div", { children: [
    /* @__PURE__ */ p("label", { className: "label flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ l("span", { children: a }),
      e && /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "text-xs text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
          onClick: n,
          title: "Reset to default",
          children: /* @__PURE__ */ l(kn, { className: "h-3 w-3" })
        }
      )
    ] }),
    r.type === "color" ? /* @__PURE__ */ p("div", { className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ l(
        "input",
        {
          type: "color",
          value: o,
          onChange: (i) => t(i.target.value),
          className: "h-8 w-12 cursor-pointer rounded border border-surface-200 dark:border-surface-700"
        }
      ),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          value: e,
          placeholder: r.defaultValue,
          onChange: (i) => t(i.target.value),
          className: "input flex-1 font-mono text-xs"
        }
      )
    ] }) : /* @__PURE__ */ l(
      "input",
      {
        type: "text",
        value: e,
        placeholder: r.defaultValue,
        onChange: (i) => t(i.target.value),
        className: "input font-mono text-xs"
      }
    )
  ] });
}
function Fo({
  config: r,
  save: e
}) {
  var O, M, z, _, it;
  const { t } = H("theme-corporate"), { terms: n } = an(), a = n.filter((y) => y.type === "category"), o = {
    ...ee,
    ...r.home ?? {},
    hero: { ...ee.hero, ...((O = r.home) == null ? void 0 : O.hero) ?? {} },
    featuredPosts: {
      ...ee.featuredPosts,
      ...((M = r.home) == null ? void 0 : M.featuredPosts) ?? {}
    },
    testimonials: {
      ...ee.testimonials,
      ...((z = r.home) == null ? void 0 : z.testimonials) ?? {},
      // Items are an array — explicitly fall back to defaults when
      // the stored config has none (rather than spreading undefined).
      items: ((it = (_ = r.home) == null ? void 0 : _.testimonials) == null ? void 0 : it.items) ?? ee.testimonials.items
    }
  }, [i, s] = Q(o), [c, u] = Q(!1), [d, h] = Q(!1);
  function m(y) {
    s((T) => ({ ...T, ...y }));
  }
  function f(y) {
    s((T) => ({ ...T, hero: { ...T.hero, ...y } }));
  }
  function b(y) {
    s((T) => ({ ...T, featuredPosts: { ...T.featuredPosts, ...y } }));
  }
  function g(y) {
    s((T) => ({ ...T, testimonials: { ...T.testimonials, ...y } }));
  }
  function v(y, T) {
    s(($) => ({
      ...$,
      testimonials: {
        ...$.testimonials,
        items: $.testimonials.items.map(
          (se, ce) => ce === y ? { ...se, ...T } : se
        )
      }
    }));
  }
  function x() {
    s((y) => ({
      ...y,
      testimonials: {
        ...y.testimonials,
        items: [
          ...y.testimonials.items,
          {
            rating: 5,
            quote: "",
            authorName: "",
            authorTitle: "",
            authorAvatarUrl: "",
            authorAvatarAlt: ""
          }
        ]
      }
    }));
  }
  function S(y) {
    s((T) => ({
      ...T,
      testimonials: {
        ...T.testimonials,
        items: T.testimonials.items.filter(($, se) => se !== y)
      }
    }));
  }
  function A(y, T) {
    const $ = y + T;
    $ < 0 || $ >= i.testimonials.items.length || s((se) => {
      const ce = [...se.testimonials.items];
      return [ce[y], ce[$]] = [ce[$], ce[y]], { ...se, testimonials: { ...se.testimonials, items: ce } };
    });
  }
  async function R() {
    u(!0);
    try {
      const y = { ...r, home: i };
      await e(y), J.success(t("settings.home.saved"));
    } catch (y) {
      console.error("[theme-corporate] home save failed:", y), J.error(t("settings.home.failed"));
    } finally {
      u(!1);
    }
  }
  return /* @__PURE__ */ p(Se, { children: [
    /* @__PURE__ */ p("div", { className: "space-y-6", children: [
      /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.home.help") }),
      /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
        /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: i.showHero,
              onChange: (y) => m({ showHero: y.target.checked })
            }
          ),
          t("settings.home.showHero")
        ] }),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.home.showHeroHelp") })
      ] }),
      /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
        /* @__PURE__ */ l("h2", { className: "font-semibold", children: t("settings.home.heroHeading") }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.heroImage") }),
          /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
            i.hero.imageUrl ? /* @__PURE__ */ l(
              "img",
              {
                src: i.hero.imageUrl,
                alt: "",
                className: "h-16 w-24 rounded object-cover ring-1 ring-surface-200 shrink-0 dark:ring-surface-700",
                onError: (y) => {
                  y.currentTarget.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ l("div", { className: "h-16 w-24 rounded bg-surface-100 flex items-center justify-center text-surface-400 shrink-0 dark:bg-surface-800", children: /* @__PURE__ */ l(Xe, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ p("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ l(
                "input",
                {
                  type: "url",
                  className: "input",
                  placeholder: "https://…",
                  value: i.hero.imageUrl ?? "",
                  onChange: (y) => f({ imageUrl: y.target.value })
                }
              ),
              /* @__PURE__ */ p("div", { className: "flex flex-wrap gap-2", children: [
                /* @__PURE__ */ p(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-sm flex items-center gap-1",
                    onClick: () => h(!0),
                    children: [
                      /* @__PURE__ */ l(Xe, { className: "h-3 w-3" }),
                      t("settings.home.heroImagePick")
                    ]
                  }
                ),
                i.hero.imageUrl && /* @__PURE__ */ p(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-sm flex items-center gap-1 text-red-600",
                    onClick: () => f({ imageUrl: "" }),
                    children: [
                      /* @__PURE__ */ l(ie, { className: "h-3 w-3" }),
                      t("settings.home.heroImageClear")
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-2 dark:text-surface-400", children: t("settings.home.heroImageHelp") })
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.heroImageAlt") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: i.hero.imageAlt ?? "",
              onChange: (y) => f({ imageAlt: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.heroEyebrow") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: i.hero.eyebrow ?? "",
              onChange: (y) => f({ eyebrow: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.heroTitle") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: i.hero.title ?? "",
              onChange: (y) => f({ title: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.heroSubtitle") }),
          /* @__PURE__ */ l(
            "textarea",
            {
              className: "input",
              rows: 3,
              value: i.hero.subtitle ?? "",
              onChange: (y) => f({ subtitle: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.primaryCtaLabel") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "input",
                value: i.hero.primaryCtaLabel ?? "",
                onChange: (y) => f({ primaryCtaLabel: y.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.primaryCtaHref") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "/contact.html",
                value: i.hero.primaryCtaHref ?? "",
                onChange: (y) => f({ primaryCtaHref: y.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.secondaryCtaLabel") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "input",
                value: i.hero.secondaryCtaLabel ?? "",
                onChange: (y) => f({ secondaryCtaLabel: y.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.secondaryCtaHref") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "input",
                value: i.hero.secondaryCtaHref ?? "",
                onChange: (y) => f({ secondaryCtaHref: y.target.value })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
        /* @__PURE__ */ l("h2", { className: "font-semibold", children: t("settings.home.featuredHeading") }),
        /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: i.featuredPosts.enabled,
              onChange: (y) => b({ enabled: y.target.checked })
            }
          ),
          t("settings.home.featuredEnabled")
        ] }),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.home.featuredHelp") }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.featuredTitle") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: i.featuredPosts.title,
              onChange: (y) => b({ title: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.featuredSubtitle") }),
          /* @__PURE__ */ l(
            "textarea",
            {
              className: "input",
              rows: 2,
              value: i.featuredPosts.subtitle,
              onChange: (y) => b({ subtitle: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.featuredMode") }),
            /* @__PURE__ */ p(
              "select",
              {
                className: "input",
                value: i.featuredPosts.mode,
                onChange: (y) => b({ mode: y.target.value }),
                children: [
                  /* @__PURE__ */ l("option", { value: "all", children: t("settings.home.featuredModes.all") }),
                  /* @__PURE__ */ l("option", { value: "category", children: t("settings.home.featuredModes.category") })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.featuredCount") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "number",
                min: 1,
                max: 12,
                className: "input",
                value: i.featuredPosts.count,
                onChange: (y) => b({ count: Math.max(1, Number(y.target.value) || 3) })
              }
            )
          ] })
        ] }),
        i.featuredPosts.mode === "category" && /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.featuredCategory") }),
          /* @__PURE__ */ p(
            "select",
            {
              className: "input",
              value: i.featuredPosts.categoryId,
              onChange: (y) => b({ categoryId: y.target.value }),
              children: [
                /* @__PURE__ */ l("option", { value: "", children: t("settings.home.featuredCategoryPlaceholder") }),
                a.map((y) => /* @__PURE__ */ l("option", { value: y.id, children: y.name }, y.id))
              ]
            }
          ),
          a.length === 0 && /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: t("settings.home.featuredCategoryEmpty") })
        ] })
      ] }),
      /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
        /* @__PURE__ */ l("h2", { className: "font-semibold", children: t("settings.home.testimonialsHeading") }),
        /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: i.testimonials.enabled,
              onChange: (y) => g({ enabled: y.target.checked })
            }
          ),
          t("settings.home.testimonialsEnabled")
        ] }),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.home.testimonialsHelp") }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.testimonialsVariant") }),
          /* @__PURE__ */ p(
            "select",
            {
              className: "input",
              value: i.testimonials.variant,
              onChange: (y) => g({ variant: y.target.value }),
              children: [
                /* @__PURE__ */ l("option", { value: "glass", children: t("settings.home.testimonialsVariants.glass") }),
                /* @__PURE__ */ l("option", { value: "navy", children: t("settings.home.testimonialsVariants.navy") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.testimonialsEyebrow") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: i.testimonials.eyebrow,
              onChange: (y) => g({ eyebrow: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.testimonialsTitle") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: i.testimonials.title,
              onChange: (y) => g({ title: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.home.testimonialsSubtitle") }),
          /* @__PURE__ */ l(
            "textarea",
            {
              className: "input",
              rows: 2,
              value: i.testimonials.subtitle,
              onChange: (y) => g({ subtitle: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { className: "space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700", children: [
          /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("settings.home.testimonialsItemsHeading") }),
            /* @__PURE__ */ p(
              "button",
              {
                type: "button",
                className: "btn-ghost btn-sm flex items-center gap-1",
                onClick: x,
                children: [
                  /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
                  t("settings.home.testimonialsAdd")
                ]
              }
            )
          ] }),
          i.testimonials.items.map((y, T) => /* @__PURE__ */ p(
            "div",
            {
              className: "rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800",
              children: [
                /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ l("p", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: t("settings.home.testimonialsItemIndex", { index: T + 1 }) }),
                  /* @__PURE__ */ p("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ l(
                      "button",
                      {
                        type: "button",
                        className: "btn-ghost btn-icon",
                        onClick: () => A(T, -1),
                        disabled: T === 0,
                        children: /* @__PURE__ */ l(Ie, { className: "h-3 w-3" })
                      }
                    ),
                    /* @__PURE__ */ l(
                      "button",
                      {
                        type: "button",
                        className: "btn-ghost btn-icon",
                        onClick: () => A(T, 1),
                        disabled: T === i.testimonials.items.length - 1,
                        children: /* @__PURE__ */ l(Me, { className: "h-3 w-3" })
                      }
                    ),
                    /* @__PURE__ */ l(
                      "button",
                      {
                        type: "button",
                        className: "btn-ghost btn-icon text-red-600",
                        onClick: () => S(T),
                        children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ p("div", { children: [
                  /* @__PURE__ */ l("label", { className: "label text-xs", children: t("settings.home.testimonialsQuote") }),
                  /* @__PURE__ */ l(
                    "textarea",
                    {
                      className: "input",
                      rows: 3,
                      value: y.quote,
                      onChange: ($) => v(T, { quote: $.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ p("div", { children: [
                    /* @__PURE__ */ l("label", { className: "label text-xs", children: t("settings.home.testimonialsAuthorName") }),
                    /* @__PURE__ */ l(
                      "input",
                      {
                        type: "text",
                        className: "input",
                        value: y.authorName,
                        onChange: ($) => v(T, { authorName: $.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ p("div", { children: [
                    /* @__PURE__ */ l("label", { className: "label text-xs", children: t("settings.home.testimonialsAuthorTitle") }),
                    /* @__PURE__ */ l(
                      "input",
                      {
                        type: "text",
                        className: "input",
                        value: y.authorTitle ?? "",
                        onChange: ($) => v(T, { authorTitle: $.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ p("div", { children: [
                    /* @__PURE__ */ l("label", { className: "label text-xs", children: t("settings.home.testimonialsAvatarUrl") }),
                    /* @__PURE__ */ l(
                      "input",
                      {
                        type: "url",
                        className: "input",
                        placeholder: "https://…",
                        value: y.authorAvatarUrl ?? "",
                        onChange: ($) => v(T, { authorAvatarUrl: $.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ p("div", { children: [
                    /* @__PURE__ */ l("label", { className: "label text-xs", children: t("settings.home.testimonialsRating") }),
                    /* @__PURE__ */ l(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        max: 5,
                        className: "input",
                        value: y.rating ?? 5,
                        onChange: ($) => v(T, { rating: Number($.target.value) || 5 })
                      }
                    )
                  ] })
                ] })
              ]
            },
            T
          ))
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "card p-4 flex flex-wrap gap-3 justify-end", children: /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "btn-primary",
          onClick: R,
          disabled: c,
          children: [
            /* @__PURE__ */ l(Ae, { className: c ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ l(tr, { className: c ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ l("span", { children: t(c ? "settings.home.saving" : "settings.home.save") })
          ]
        }
      ) })
    ] }),
    d && /* @__PURE__ */ l(
      Ia,
      {
        onPick: (y) => {
          const T = Ha(y, "large");
          f({ imageUrl: T, imageAlt: y.alt ?? "" }), h(!1);
        },
        onClose: () => h(!1)
      }
    )
  ] });
}
function Uo({
  config: r,
  save: e
}) {
  const { t } = H("theme-corporate"), n = {
    ...er,
    ...r.single ?? {}
  }, [a, o] = Q(n), [i, s] = Q(!1);
  function c(d) {
    o((h) => ({ ...h, ...d }));
  }
  async function u() {
    s(!0);
    try {
      const d = { ...r, single: a };
      await e(d), J.success(t("settings.single.saved"));
    } catch (d) {
      console.error("[theme-corporate] single save failed:", d), J.error(t("settings.single.failed"));
    } finally {
      s(!1);
    }
  }
  return /* @__PURE__ */ p("div", { className: "space-y-6", children: [
    /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.single.help") }),
    /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
      /* @__PURE__ */ l("h2", { className: "font-semibold", children: t("settings.single.sidebarHeading") }),
      /* @__PURE__ */ p("div", { className: "space-y-1", children: [
        /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: a.showAuthorBio,
              onChange: (d) => c({ showAuthorBio: d.target.checked })
            }
          ),
          t("settings.single.showAuthorBio")
        ] }),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 ml-6 dark:text-surface-400", children: t("settings.single.showAuthorBioHelp") })
      ] }),
      /* @__PURE__ */ p("div", { className: "space-y-1 pt-2 border-t border-surface-200 dark:border-surface-700", children: [
        /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200 mt-3", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: a.showPopularArticles,
              onChange: (d) => c({ showPopularArticles: d.target.checked })
            }
          ),
          t("settings.single.showPopular")
        ] }),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 ml-6 dark:text-surface-400", children: t("settings.single.showPopularHelp") })
      ] }),
      a.showPopularArticles && /* @__PURE__ */ p("div", { className: "ml-6 mt-2", children: [
        /* @__PURE__ */ l("label", { className: "label", children: t("settings.single.popularTitle") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            placeholder: t("publicBaked.popularArticles"),
            value: a.popularArticlesTitle,
            onChange: (d) => c({ popularArticlesTitle: d.target.value })
          }
        ),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: t("settings.single.popularTitleHelp") })
      ] }),
      /* @__PURE__ */ p("div", { className: "space-y-1 pt-2 border-t border-surface-200 dark:border-surface-700", children: [
        /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200 mt-3", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: a.showCta,
              onChange: (d) => c({ showCta: d.target.checked })
            }
          ),
          t("settings.single.showCta")
        ] }),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 ml-6 dark:text-surface-400", children: t("settings.single.showCtaHelp") })
      ] }),
      a.showCta && /* @__PURE__ */ p("div", { className: "ml-6 mt-2 space-y-3", children: [
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label", children: t("settings.single.ctaTitle") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              placeholder: t("publicBaked.getStarted"),
              value: a.ctaTitle,
              onChange: (d) => c({ ctaTitle: d.target.value })
            }
          ),
          /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: t("settings.single.ctaTitleHelp") })
        ] }),
        /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.single.ctaButtonLabel") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: t("publicBaked.getStarted"),
                value: a.ctaButtonLabel,
                onChange: (d) => c({ ctaButtonLabel: d.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ p("div", { children: [
            /* @__PURE__ */ l("label", { className: "label", children: t("settings.single.ctaButtonHref") }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "/contact.html",
                value: a.ctaButtonHref,
                onChange: (d) => c({ ctaButtonHref: d.target.value })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ l("div", { className: "card p-4 flex flex-wrap gap-3 justify-end", children: /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "btn-primary",
        onClick: u,
        disabled: i,
        children: [
          /* @__PURE__ */ l(Ae, { className: i ? "h-4 w-4 animate-spin" : "hidden" }),
          /* @__PURE__ */ l(tr, { className: i ? "hidden" : "h-4 w-4" }),
          /* @__PURE__ */ l("span", { children: t(i ? "settings.single.saving" : "settings.single.save") })
        ]
      }
    ) })
  ] });
}
function jo({
  draft: r,
  setDraft: e
}) {
  const { t } = H("theme-corporate"), n = eo(r);
  function a(o) {
    e({
      vars: { ...o.vars },
      fontSans: o.fontSans
    });
  }
  return /* @__PURE__ */ p("section", { className: "card p-4 space-y-3", children: [
    /* @__PURE__ */ p("header", { className: "space-y-1", children: [
      /* @__PURE__ */ p("h2", { className: "font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ l(Ho, { className: "h-4 w-4 text-surface-400" }),
        t("settings.presets.title")
      ] }),
      /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.presets.help") })
    ] }),
    /* @__PURE__ */ l("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: dn.map((o) => {
      const i = o.id === n, s = {
        vars: o.vars,
        fontSans: o.fontSans
      }, c = o.swatch.map(
        (u) => un(s, u)
      );
      return /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          onClick: () => a(o),
          className: "text-left p-3 rounded border transition focus:outline-none focus:ring-2 focus:ring-blue-500 " + (i ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30" : "border-surface-200 hover:border-surface-400 dark:border-surface-700 dark:hover:border-surface-500"),
          "aria-pressed": i,
          children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ l("span", { className: "text-sm font-medium", children: t(`settings.presets.${o.id}.label`) }),
              /* @__PURE__ */ l("div", { className: "flex -space-x-1", "aria-hidden": "true", children: c.map((u, d) => /* @__PURE__ */ l(
                "span",
                {
                  className: "h-4 w-4 rounded-full ring-1 ring-surface-200 dark:ring-surface-700",
                  style: { background: u }
                },
                d
              )) })
            ] }),
            /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400 line-clamp-2", children: t(`settings.presets.${o.id}.description`) })
          ]
        },
        o.id
      );
    }) })
  ] });
}
function U(r) {
  this.content = r;
}
U.prototype = {
  constructor: U,
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
    var n = t && t != r ? this.remove(t) : this, a = n.find(r), o = n.content.slice();
    return a == -1 ? o.push(t || r, e) : (o[a + 1] = e, t && (o[a] = t)), new U(o);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(r) {
    var e = this.find(r);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new U(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(r, e) {
    return new U([r, e].concat(this.remove(r).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(r, e) {
    var t = this.remove(r).content.slice();
    return t.push(r, e), new U(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(r, e, t) {
    var n = this.remove(e), a = n.content.slice(), o = n.find(r);
    return a.splice(o == -1 ? a.length : o, 0, e, t), new U(a);
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
    return r = U.from(r), r.size ? new U(r.content.concat(this.subtract(r).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(r) {
    return r = U.from(r), r.size ? new U(this.subtract(r).content.concat(r.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(r) {
    var e = this;
    r = U.from(r);
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
U.from = function(r) {
  if (r instanceof U) return r;
  var e = [];
  if (r) for (var t in r) e.push(t, r[t]);
  return new U(e);
};
function Sn(r, e, t) {
  for (let n = 0; ; n++) {
    if (n == r.childCount || n == e.childCount)
      return r.childCount == e.childCount ? null : t;
    let a = r.child(n), o = e.child(n);
    if (a == o) {
      t += a.nodeSize;
      continue;
    }
    if (!a.sameMarkup(o))
      return t;
    if (a.isText && a.text != o.text) {
      for (let i = 0; a.text[i] == o.text[i]; i++)
        t++;
      return t;
    }
    if (a.content.size || o.content.size) {
      let i = Sn(a.content, o.content, t + 1);
      if (i != null)
        return i;
    }
    t += a.nodeSize;
  }
}
function Nn(r, e, t, n) {
  for (let a = r.childCount, o = e.childCount; ; ) {
    if (a == 0 || o == 0)
      return a == o ? null : { a: t, b: n };
    let i = r.child(--a), s = e.child(--o), c = i.nodeSize;
    if (i == s) {
      t -= c, n -= c;
      continue;
    }
    if (!i.sameMarkup(s))
      return { a: t, b: n };
    if (i.isText && i.text != s.text) {
      let u = 0, d = Math.min(i.text.length, s.text.length);
      for (; u < d && i.text[i.text.length - u - 1] == s.text[s.text.length - u - 1]; )
        u++, t--, n--;
      return { a: t, b: n };
    }
    if (i.content.size || s.content.size) {
      let u = Nn(i.content, s.content, t - 1, n - 1);
      if (u)
        return u;
    }
    t -= c, n -= c;
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
  nodesBetween(e, t, n, a = 0, o) {
    for (let i = 0, s = 0; s < t; i++) {
      let c = this.content[i], u = s + c.nodeSize;
      if (u > e && n(c, a + s, o || null, i) !== !1 && c.content.size) {
        let d = s + 1;
        c.nodesBetween(Math.max(0, e - d), Math.min(c.content.size, t - d), n, a + d);
      }
      s = u;
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
  textBetween(e, t, n, a) {
    let o = "", i = !0;
    return this.nodesBetween(e, t, (s, c) => {
      let u = s.isText ? s.text.slice(Math.max(e, c) - c, t - c) : s.isLeaf ? a ? typeof a == "function" ? a(s) : a : s.type.spec.leafText ? s.type.spec.leafText(s) : "" : "";
      s.isBlock && (s.isLeaf && u || s.isTextblock) && n && (i ? i = !1 : o += n), o += u;
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
    let t = this.lastChild, n = e.firstChild, a = this.content.slice(), o = 0;
    for (t.isText && t.sameMarkup(n) && (a[a.length - 1] = t.withText(t.text + n.text), o = 1); o < e.content.length; o++)
      a.push(e.content[o]);
    return new w(a, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let n = [], a = 0;
    if (t > e)
      for (let o = 0, i = 0; i < t; o++) {
        let s = this.content[o], c = i + s.nodeSize;
        c > e && ((i < e || c > t) && (s.isText ? s = s.cut(Math.max(0, e - i), Math.min(s.text.length, t - i)) : s = s.cut(Math.max(0, e - i - 1), Math.min(s.content.size, t - i - 1))), n.push(s), a += s.nodeSize), i = c;
      }
    return new w(n, a);
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
    let a = this.content.slice(), o = this.size + t.nodeSize - n.nodeSize;
    return a[e] = t, new w(a, o);
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
      let a = this.content[t];
      e(a, n, t), n += a.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return Sn(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, n = e.size) {
    return Nn(this, e, t, n);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return ct(0, e);
    if (e == this.size)
      return ct(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, n = 0; ; t++) {
      let a = this.child(t), o = n + a.nodeSize;
      if (o >= e)
        return o == e ? ct(t + 1, o) : ct(t, n);
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
    for (let a = 0; a < e.length; a++) {
      let o = e[a];
      n += o.nodeSize, a && o.isText && e[a - 1].sameMarkup(o) ? (t || (t = e.slice(0, a)), t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)) : t && t.push(o);
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
const Rt = { index: 0, offset: 0 };
function ct(r, e) {
  return Rt.index = r, Rt.offset = e, Rt;
}
function xt(r, e) {
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
      if (!xt(r[n], e[n]))
        return !1;
  } else {
    for (let n in r)
      if (!(n in e) || !xt(r[n], e[n]))
        return !1;
    for (let n in e)
      if (!(n in r))
        return !1;
  }
  return !0;
}
class I {
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
    for (let a = 0; a < e.length; a++) {
      let o = e[a];
      if (this.eq(o))
        return e;
      if (this.type.excludes(o.type))
        t || (t = e.slice(0, a));
      else {
        if (o.type.excludes(this.type))
          return e;
        !n && o.type.rank > this.type.rank && (t || (t = e.slice(0, a)), t.push(this), n = !0), t && t.push(o);
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
    return this == e || this.type == e.type && xt(this.attrs, e.attrs);
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
    let a = n.create(t.attrs);
    return n.checkAttrs(a.attrs), a;
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
      return I.none;
    if (e instanceof I)
      return [e];
    let t = e.slice();
    return t.sort((n, a) => n.type.rank - a.type.rank), t;
  }
}
I.none = [];
class wt extends Error {
}
class C {
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
    let n = Tn(this.content, e + this.openStart, t);
    return n && new C(n, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new C(An(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return C.empty;
    let n = t.openStart || 0, a = t.openEnd || 0;
    if (typeof n != "number" || typeof a != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new C(w.fromJSON(e, t.content), n, a);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let n = 0, a = 0;
    for (let o = e.firstChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.firstChild)
      n++;
    for (let o = e.lastChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.lastChild)
      a++;
    return new C(e, n, a);
  }
}
C.empty = new C(w.empty, 0, 0);
function An(r, e, t) {
  let { index: n, offset: a } = r.findIndex(e), o = r.maybeChild(n), { index: i, offset: s } = r.findIndex(t);
  if (a == e || o.isText) {
    if (s != t && !r.child(i).isText)
      throw new RangeError("Removing non-flat range");
    return r.cut(0, e).append(r.cut(t));
  }
  if (n != i)
    throw new RangeError("Removing non-flat range");
  return r.replaceChild(n, o.copy(An(o.content, e - a - 1, t - a - 1)));
}
function Tn(r, e, t, n) {
  let { index: a, offset: o } = r.findIndex(e), i = r.maybeChild(a);
  if (o == e || i.isText)
    return n && !n.canReplace(a, a, t) ? null : r.cut(0, e).append(t).append(r.cut(e));
  let s = Tn(i.content, e - o - 1, t, i);
  return s && r.replaceChild(a, i.copy(s));
}
function Do(r, e, t) {
  if (t.openStart > r.depth)
    throw new wt("Inserted content deeper than insertion position");
  if (r.depth - t.openStart != e.depth - t.openEnd)
    throw new wt("Inconsistent open depths");
  return En(r, e, t, 0);
}
function En(r, e, t, n) {
  let a = r.index(n), o = r.node(n);
  if (a == e.index(n) && n < r.depth - t.openStart) {
    let i = En(r, e, t, n + 1);
    return o.copy(o.content.replaceChild(a, i));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && r.depth == n && e.depth == n) {
      let i = r.parent, s = i.content;
      return fe(i, s.cut(0, r.parentOffset).append(t.content).append(s.cut(e.parentOffset)));
    } else {
      let { start: i, end: s } = Vo(t, r);
      return fe(o, Mn(r, i, s, e, n));
    }
  else return fe(o, kt(r, e, n));
}
function Ln(r, e) {
  if (!e.type.compatibleContent(r.type))
    throw new wt("Cannot join " + e.type.name + " onto " + r.type.name);
}
function Jt(r, e, t) {
  let n = r.node(t);
  return Ln(n, e.node(t)), n;
}
function me(r, e) {
  let t = e.length - 1;
  t >= 0 && r.isText && r.sameMarkup(e[t]) ? e[t] = r.withText(e[t].text + r.text) : e.push(r);
}
function Fe(r, e, t, n) {
  let a = (e || r).node(t), o = 0, i = e ? e.index(t) : a.childCount;
  r && (o = r.index(t), r.depth > t ? o++ : r.textOffset && (me(r.nodeAfter, n), o++));
  for (let s = o; s < i; s++)
    me(a.child(s), n);
  e && e.depth == t && e.textOffset && me(e.nodeBefore, n);
}
function fe(r, e) {
  return r.type.checkContent(e), r.copy(e);
}
function Mn(r, e, t, n, a) {
  let o = r.depth > a && Jt(r, e, a + 1), i = n.depth > a && Jt(t, n, a + 1), s = [];
  return Fe(null, r, a, s), o && i && e.index(a) == t.index(a) ? (Ln(o, i), me(fe(o, Mn(r, e, t, n, a + 1)), s)) : (o && me(fe(o, kt(r, e, a + 1)), s), Fe(e, t, a, s), i && me(fe(i, kt(t, n, a + 1)), s)), Fe(n, null, a, s), new w(s);
}
function kt(r, e, t) {
  let n = [];
  if (Fe(null, r, t, n), r.depth > t) {
    let a = Jt(r, e, t + 1);
    me(fe(a, kt(r, e, t + 1)), n);
  }
  return Fe(e, null, t, n), new w(n);
}
function Vo(r, e) {
  let t = e.depth - r.openStart, a = e.node(t).copy(r.content);
  for (let o = t - 1; o >= 0; o--)
    a = e.node(o).copy(w.from(a));
  return {
    start: a.resolveNoCache(r.openStart + t),
    end: a.resolveNoCache(a.content.size - r.openEnd - t)
  };
}
class et {
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
    let n = this.pos - this.path[this.path.length - 1], a = e.child(t);
    return n ? e.child(t).cut(n) : a;
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
    let n = this.path[t * 3], a = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++)
      a += n.child(o).nodeSize;
    return a;
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
      return I.none;
    if (this.textOffset)
      return e.child(t).marks;
    let n = e.maybeChild(t - 1), a = e.maybeChild(t);
    if (!n) {
      let s = n;
      n = a, a = s;
    }
    let o = n.marks;
    for (var i = 0; i < o.length; i++)
      o[i].type.spec.inclusive === !1 && (!a || !o[i].isInSet(a.marks)) && (o = o[i--].removeFromSet(o));
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
    let n = t.marks, a = e.parent.maybeChild(e.index());
    for (var o = 0; o < n.length; o++)
      n[o].type.spec.inclusive === !1 && (!a || !n[o].isInSet(a.marks)) && (n = n[o--].removeFromSet(n));
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
        return new Ct(this, e, n);
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
    let n = [], a = 0, o = t;
    for (let i = e; ; ) {
      let { index: s, offset: c } = i.content.findIndex(o), u = o - c;
      if (n.push(i, s, a + c), !u || (i = i.child(s), i.isText))
        break;
      o = u - 1, a += c + 1;
    }
    return new et(t, n, o);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let n = Hr.get(e);
    if (n)
      for (let o = 0; o < n.elts.length; o++) {
        let i = n.elts[o];
        if (i.pos == t)
          return i;
      }
    else
      Hr.set(e, n = new qo());
    let a = n.elts[n.i] = et.resolve(e, t);
    return n.i = (n.i + 1) % _o, a;
  }
}
class qo {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const _o = 12, Hr = /* @__PURE__ */ new WeakMap();
class Ct {
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
const Go = /* @__PURE__ */ Object.create(null);
let ge = class Wt {
  /**
  @internal
  */
  constructor(e, t, n, a = I.none) {
    this.type = e, this.attrs = t, this.marks = a, this.content = n || w.empty;
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
  nodesBetween(e, t, n, a = 0) {
    this.content.nodesBetween(e, t, n, a, this);
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
  textBetween(e, t, n, a) {
    return this.content.textBetween(e, t, n, a);
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
    return this.type == e && xt(this.attrs, t || e.defaultAttrs || Go) && I.sameSet(this.marks, n || I.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Wt(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Wt(this.type, this.attrs, this.content, e);
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
      return C.empty;
    let a = this.resolve(e), o = this.resolve(t), i = n ? 0 : a.sharedDepth(t), s = a.start(i), u = a.node(i).content.cut(a.pos - s, o.pos - s);
    return new C(u, a.depth - i, o.depth - i);
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
    return Do(this.resolve(e), this.resolve(t), n);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: n, offset: a } = t.content.findIndex(e);
      if (t = t.maybeChild(n), !t)
        return null;
      if (a == e || t.isText)
        return t;
      e -= a + 1;
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
    let a = this.content.child(t - 1);
    return { node: a, index: t - 1, offset: n - a.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return et.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return et.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, n) {
    let a = !1;
    return t > e && this.nodesBetween(e, t, (o) => (n.isInSet(o.marks) && (a = !0), !a)), a;
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), In(this.marks, e);
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
  canReplace(e, t, n = w.empty, a = 0, o = n.childCount) {
    let i = this.contentMatchAt(e).matchFragment(n, a, o), s = i && i.matchFragment(this.content, t);
    if (!s || !s.validEnd)
      return !1;
    for (let c = a; c < o; c++)
      if (!this.type.allowsMarks(n.child(c).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, n, a) {
    if (a && !this.type.allowsMarks(a))
      return !1;
    let o = this.contentMatchAt(e).matchType(n), i = o && o.matchFragment(this.content, t);
    return i ? i.validEnd : !1;
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
    let e = I.none;
    for (let t = 0; t < this.marks.length; t++) {
      let n = this.marks[t];
      n.type.checkAttrs(n.attrs), e = n.addToSet(e);
    }
    if (!I.sameSet(e, this.marks))
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
    let a = w.fromJSON(e, t.content), o = e.nodeType(t.type).create(t.attrs, a, n);
    return o.type.checkAttrs(o.attrs), o;
  }
};
ge.prototype.text = void 0;
class St extends ge {
  /**
  @internal
  */
  constructor(e, t, n, a) {
    if (super(e, t, null, a), !n)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = n;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : In(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new St(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new St(this.type, this.attrs, e, this.marks);
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
function In(r, e) {
  for (let t = r.length - 1; t >= 0; t--)
    e = r[t].type.name + "(" + e + ")";
  return e;
}
class be {
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
    let n = new Jo(e, t);
    if (n.next == null)
      return be.empty;
    let a = Hn(n);
    n.next && n.err("Unexpected trailing text");
    let o = ei(Xo(a));
    return ti(o, n), o;
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
    let a = this;
    for (let o = t; a && o < n; o++)
      a = a.matchType(e.child(o).type);
    return a;
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
    let a = [this];
    function o(i, s) {
      let c = i.matchFragment(e, n);
      if (c && (!t || c.validEnd))
        return w.from(s.map((u) => u.createAndFill()));
      for (let u = 0; u < i.next.length; u++) {
        let { type: d, next: h } = i.next[u];
        if (!(d.isText || d.hasRequiredAttrs()) && a.indexOf(h) == -1) {
          a.push(h);
          let m = o(h, s.concat(d));
          if (m)
            return m;
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
      let a = n.shift(), o = a.match;
      if (o.matchType(e)) {
        let i = [];
        for (let s = a; s.type; s = s.via)
          i.push(s.type);
        return i.reverse();
      }
      for (let i = 0; i < o.next.length; i++) {
        let { type: s, next: c } = o.next[i];
        !s.isLeaf && !s.hasRequiredAttrs() && !(s.name in t) && (!a.type || c.validEnd) && (n.push({ match: s.contentMatch, type: s, via: a }), t[s.name] = !0);
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
      for (let a = 0; a < n.next.length; a++)
        e.indexOf(n.next[a].next) == -1 && t(n.next[a].next);
    }
    return t(this), e.map((n, a) => {
      let o = a + (n.validEnd ? "*" : " ") + " ";
      for (let i = 0; i < n.next.length; i++)
        o += (i ? ", " : "") + n.next[i].type.name + "->" + e.indexOf(n.next[i].next);
      return o;
    }).join(`
`);
  }
}
be.empty = new be(!0);
class Jo {
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
function Hn(r) {
  let e = [];
  do
    e.push(Wo(r));
  while (r.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Wo(r) {
  let e = [];
  do
    e.push(Ko(r));
  while (r.next && r.next != ")" && r.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Ko(r) {
  let e = Qo(r);
  for (; ; )
    if (r.eat("+"))
      e = { type: "plus", expr: e };
    else if (r.eat("*"))
      e = { type: "star", expr: e };
    else if (r.eat("?"))
      e = { type: "opt", expr: e };
    else if (r.eat("{"))
      e = Yo(r, e);
    else
      break;
  return e;
}
function Or(r) {
  /\D/.test(r.next) && r.err("Expected number, got '" + r.next + "'");
  let e = Number(r.next);
  return r.pos++, e;
}
function Yo(r, e) {
  let t = Or(r), n = t;
  return r.eat(",") && (r.next != "}" ? n = Or(r) : n = -1), r.eat("}") || r.err("Unclosed braced range"), { type: "range", min: t, max: n, expr: e };
}
function Zo(r, e) {
  let t = r.nodeTypes, n = t[e];
  if (n)
    return [n];
  let a = [];
  for (let o in t) {
    let i = t[o];
    i.isInGroup(e) && a.push(i);
  }
  return a.length == 0 && r.err("No node type or group '" + e + "' found"), a;
}
function Qo(r) {
  if (r.eat("(")) {
    let e = Hn(r);
    return r.eat(")") || r.err("Missing closing paren"), e;
  } else if (/\W/.test(r.next))
    r.err("Unexpected token '" + r.next + "'");
  else {
    let e = Zo(r, r.next).map((t) => (r.inline == null ? r.inline = t.isInline : r.inline != t.isInline && r.err("Mixing inline and block content"), { type: "name", value: t }));
    return r.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Xo(r) {
  let e = [[]];
  return a(o(r, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function n(i, s, c) {
    let u = { term: c, to: s };
    return e[i].push(u), u;
  }
  function a(i, s) {
    i.forEach((c) => c.to = s);
  }
  function o(i, s) {
    if (i.type == "choice")
      return i.exprs.reduce((c, u) => c.concat(o(u, s)), []);
    if (i.type == "seq")
      for (let c = 0; ; c++) {
        let u = o(i.exprs[c], s);
        if (c == i.exprs.length - 1)
          return u;
        a(u, s = t());
      }
    else if (i.type == "star") {
      let c = t();
      return n(s, c), a(o(i.expr, c), c), [n(c)];
    } else if (i.type == "plus") {
      let c = t();
      return a(o(i.expr, s), c), a(o(i.expr, c), c), [n(c)];
    } else {
      if (i.type == "opt")
        return [n(s)].concat(o(i.expr, s));
      if (i.type == "range") {
        let c = s;
        for (let u = 0; u < i.min; u++) {
          let d = t();
          a(o(i.expr, c), d), c = d;
        }
        if (i.max == -1)
          a(o(i.expr, c), c);
        else
          for (let u = i.min; u < i.max; u++) {
            let d = t();
            n(c, d), a(o(i.expr, c), d), c = d;
          }
        return [n(c)];
      } else {
        if (i.type == "name")
          return [n(s, void 0, i.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function On(r, e) {
  return e - r;
}
function Pr(r, e) {
  let t = [];
  return n(e), t.sort(On);
  function n(a) {
    let o = r[a];
    if (o.length == 1 && !o[0].term)
      return n(o[0].to);
    t.push(a);
    for (let i = 0; i < o.length; i++) {
      let { term: s, to: c } = o[i];
      !s && t.indexOf(c) == -1 && n(c);
    }
  }
}
function ei(r) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Pr(r, 0));
  function t(n) {
    let a = [];
    n.forEach((i) => {
      r[i].forEach(({ term: s, to: c }) => {
        if (!s)
          return;
        let u;
        for (let d = 0; d < a.length; d++)
          a[d][0] == s && (u = a[d][1]);
        Pr(r, c).forEach((d) => {
          u || a.push([s, u = []]), u.indexOf(d) == -1 && u.push(d);
        });
      });
    });
    let o = e[n.join(",")] = new be(n.indexOf(r.length - 1) > -1);
    for (let i = 0; i < a.length; i++) {
      let s = a[i][1].sort(On);
      o.next.push({ type: a[i][0], next: e[s.join(",")] || t(s) });
    }
    return o;
  }
}
function ti(r, e) {
  for (let t = 0, n = [r]; t < n.length; t++) {
    let a = n[t], o = !a.validEnd, i = [];
    for (let s = 0; s < a.next.length; s++) {
      let { type: c, next: u } = a.next[s];
      i.push(c.name), o && !(c.isText || c.hasRequiredAttrs()) && (o = !1), n.indexOf(u) == -1 && n.push(u);
    }
    o && e.err("Only non-generatable nodes (" + i.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Pn(r) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in r) {
    let n = r[t];
    if (!n.hasDefault)
      return null;
    e[t] = n.default;
  }
  return e;
}
function Rn(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let n in r) {
    let a = e && e[n];
    if (a === void 0) {
      let o = r[n];
      if (o.hasDefault)
        a = o.default;
      else
        throw new RangeError("No value supplied for attribute " + n);
    }
    t[n] = a;
  }
  return t;
}
function zn(r, e, t, n) {
  for (let a in e)
    if (!(a in r))
      throw new RangeError(`Unsupported attribute ${a} for ${t} of type ${a}`);
  for (let a in r) {
    let o = r[a];
    o.validate && o.validate(e[a]);
  }
}
function Bn(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let n in e)
      t[n] = new ni(r, n, e[n]);
  return t;
}
class Nt {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = Bn(e, n.attrs), this.defaultAttrs = Pn(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == be.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Rn(this.attrs, e);
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
    return new ge(this, this.computeAttrs(e), w.from(t), I.setFrom(n));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, n) {
    return t = w.from(t), this.checkContent(t), new ge(this, this.computeAttrs(e), t, I.setFrom(n));
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
      let i = this.contentMatch.fillBefore(t);
      if (!i)
        return null;
      t = i.append(t);
    }
    let a = this.contentMatch.matchFragment(t), o = a && a.fillBefore(w.empty, !0);
    return o ? new ge(this, e, t.append(o), I.setFrom(n)) : null;
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
    zn(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : I.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null);
    e.forEach((o, i) => n[o] = new Nt(o, t, i));
    let a = t.spec.topNode || "doc";
    if (!n[a])
      throw new RangeError("Schema is missing its top node type ('" + a + "')");
    if (!n.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let o in n.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return n;
  }
}
function ri(r, e, t) {
  let n = t.split("|");
  return (a) => {
    let o = a === null ? "null" : typeof a;
    if (n.indexOf(o) < 0)
      throw new RangeError(`Expected value of type ${n} for attribute ${e} on type ${r}, got ${o}`);
  };
}
class ni {
  constructor(e, t, n) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? ri(e, t, n.validate) : n.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class rr {
  /**
  @internal
  */
  constructor(e, t, n, a) {
    this.name = e, this.rank = t, this.schema = n, this.spec = a, this.attrs = Bn(e, a.attrs), this.excluded = null;
    let o = Pn(this.attrs);
    this.instance = o ? new I(this, o) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new I(this, Rn(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null), a = 0;
    return e.forEach((o, i) => n[o] = new rr(o, a++, t, i)), n;
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
    zn(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class ai {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let a in e)
      t[a] = e[a];
    t.nodes = U.from(e.nodes), t.marks = U.from(e.marks || {}), this.nodes = Nt.compile(this.spec.nodes, this), this.marks = rr.compile(this.spec.marks, this);
    let n = /* @__PURE__ */ Object.create(null);
    for (let a in this.nodes) {
      if (a in this.marks)
        throw new RangeError(a + " can not be both a node and a mark");
      let o = this.nodes[a], i = o.spec.content || "", s = o.spec.marks;
      if (o.contentMatch = n[i] || (n[i] = be.parse(i, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = o;
      }
      o.markSet = s == "_" ? null : s ? Rr(this, s.split(" ")) : s == "" || !o.inlineContent ? [] : null;
    }
    for (let a in this.marks) {
      let o = this.marks[a], i = o.spec.excludes;
      o.excluded = i == null ? [o] : i == "" ? [] : Rr(this, i.split(" "));
    }
    this.nodeFromJSON = (a) => ge.fromJSON(this, a), this.markFromJSON = (a) => I.fromJSON(this, a), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, n, a) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Nt) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, n, a);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let n = this.nodes.text;
    return new St(n, n.defaultAttrs, e, I.setFrom(t));
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
function Rr(r, e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let a = e[n], o = r.marks[a], i = o;
    if (o)
      t.push(o);
    else
      for (let s in r.marks) {
        let c = r.marks[s];
        (a == "_" || c.spec.group && c.spec.group.split(" ").indexOf(a) > -1) && t.push(i = c);
      }
    if (!i)
      throw new SyntaxError("Unknown mark type: '" + e[n] + "'");
  }
  return t;
}
function oi(r) {
  return r.tag != null;
}
function ii(r) {
  return r.style != null;
}
class Ce {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let n = this.matchedStyles = [];
    t.forEach((a) => {
      if (oi(a))
        this.tags.push(a);
      else if (ii(a)) {
        let o = /[^=]*/.exec(a.style)[0];
        n.indexOf(o) < 0 && n.push(o), this.styles.push(a);
      }
    }), this.normalizeLists = !this.tags.some((a) => {
      if (!/^(ul|ol)\b/.test(a.tag) || !a.node)
        return !1;
      let o = e.nodes[a.node];
      return o.contentMatch.matchType(o);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let n = new Br(this, t, !1);
    return n.addAll(e, I.none, t.from, t.to), n.finish();
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
    let n = new Br(this, t, !0);
    return n.addAll(e, I.none, t.from, t.to), C.maxOpen(n.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, n) {
    for (let a = n ? this.tags.indexOf(n) + 1 : 0; a < this.tags.length; a++) {
      let o = this.tags[a];
      if (ci(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
        if (o.getAttrs) {
          let i = o.getAttrs(e);
          if (i === !1)
            continue;
          o.attrs = i || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, n, a) {
    for (let o = a ? this.styles.indexOf(a) + 1 : 0; o < this.styles.length; o++) {
      let i = this.styles[o], s = i.style;
      if (!(s.indexOf(e) != 0 || i.context && !n.matchesContext(i.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      s.length > e.length && (s.charCodeAt(e.length) != 61 || s.slice(e.length + 1) != t))) {
        if (i.getAttrs) {
          let c = i.getAttrs(t);
          if (c === !1)
            continue;
          i.attrs = c || void 0;
        }
        return i;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function n(a) {
      let o = a.priority == null ? 50 : a.priority, i = 0;
      for (; i < t.length; i++) {
        let s = t[i];
        if ((s.priority == null ? 50 : s.priority) < o)
          break;
      }
      t.splice(i, 0, a);
    }
    for (let a in e.marks) {
      let o = e.marks[a].spec.parseDOM;
      o && o.forEach((i) => {
        n(i = $r(i)), i.mark || i.ignore || i.clearMark || (i.mark = a);
      });
    }
    for (let a in e.nodes) {
      let o = e.nodes[a].spec.parseDOM;
      o && o.forEach((i) => {
        n(i = $r(i)), i.node || i.ignore || i.mark || (i.node = a);
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
    return e.cached.domParser || (e.cached.domParser = new Ce(e, Ce.schemaRules(e)));
  }
}
const $n = {
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
}, si = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Fn = { ol: !0, ul: !0 }, tt = 1, Kt = 2, Ue = 4;
function zr(r, e, t) {
  return e != null ? (e ? tt : 0) | (e === "full" ? Kt : 0) : r && r.whitespace == "pre" ? tt | Kt : t & ~Ue;
}
class dt {
  constructor(e, t, n, a, o, i) {
    this.type = e, this.attrs = t, this.marks = n, this.solid = a, this.options = i, this.content = [], this.activeMarks = I.none, this.match = o || (i & Ue ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(w.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let n = this.type.contentMatch, a;
        return (a = n.findWrapping(e.type)) ? (this.match = n, a) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & tt)) {
      let n = this.content[this.content.length - 1], a;
      if (n && n.isText && (a = /[ \t\r\n\u000c]+$/.exec(n.text))) {
        let o = n;
        n.text.length == a[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - a[0].length));
      }
    }
    let t = w.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(w.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !$n.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Br {
  constructor(e, t, n) {
    this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
    let a = t.topNode, o, i = zr(null, t.preserveWhitespace, 0) | (n ? Ue : 0);
    a ? o = new dt(a.type, a.attrs, I.none, !0, t.topMatch || a.type.contentMatch, i) : n ? o = new dt(null, null, I.none, !0, null, i) : o = new dt(e.schema.topNodeType, null, I.none, !0, null, i), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
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
    let n = e.nodeValue, a = this.top, o = a.options & Kt ? "full" : this.localPreserveWS || (a.options & tt) > 0, { schema: i } = this.parser;
    if (o === "full" || a.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (o)
        if (o === "full")
          n = n.replace(/\r\n?/g, `
`);
        else if (i.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(i.linebreakReplacement.create())) {
          let s = n.split(/\r?\n|\r/);
          for (let c = 0; c < s.length; c++)
            c && this.insertNode(i.linebreakReplacement.create(), t, !0), s[c] && this.insertNode(i.text(s[c]), t, !/\S/.test(s[c]));
          n = "";
        } else
          n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let s = a.content[a.content.length - 1], c = e.previousSibling;
        (!s || c && c.nodeName == "BR" || s.isText && /[ \t\r\n\u000c]$/.test(s.text)) && (n = n.slice(1));
      }
      n && this.insertNode(i.text(n), t, !/\S/.test(n)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, n) {
    let a = this.localPreserveWS, o = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let i = e.nodeName.toLowerCase(), s;
    Fn.hasOwnProperty(i) && this.parser.normalizeLists && li(e);
    let c = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, n));
    e: if (c ? c.ignore : si.hasOwnProperty(i))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!c || c.skip || c.closeParent) {
      c && c.closeParent ? this.open = Math.max(0, this.open - 1) : c && c.skip.nodeType && (e = c.skip);
      let u, d = this.needsBlock;
      if ($n.hasOwnProperty(i))
        o.content.length && o.content[0].isInline && this.open && (this.open--, o = this.top), u = !0, o.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let h = c && c.skip ? t : this.readStyles(e, t);
      h && this.addAll(e, h), u && this.sync(o), this.needsBlock = d;
    } else {
      let u = this.readStyles(e, t);
      u && this.addElementByRule(e, c, u, c.consuming === !1 ? s : void 0);
    }
    this.localPreserveWS = a;
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
      for (let a = 0; a < this.parser.matchedStyles.length; a++) {
        let o = this.parser.matchedStyles[a], i = n.getPropertyValue(o);
        if (i)
          for (let s = void 0; ; ) {
            let c = this.parser.matchStyle(o, i, this, s);
            if (!c)
              break;
            if (c.ignore)
              return null;
            if (c.clearMark ? t = t.filter((u) => !c.clearMark(u)) : t = t.concat(this.parser.schema.marks[c.mark].create(c.attrs)), c.consuming === !1)
              s = c;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, n, a) {
    let o, i;
    if (t.node)
      if (i = this.parser.schema.nodes[t.node], i.isLeaf)
        this.insertNode(i.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
      else {
        let c = this.enter(i, t.attrs || null, n, t.preserveWhitespace);
        c && (o = !0, n = c);
      }
    else {
      let c = this.parser.schema.marks[t.mark];
      n = n.concat(c.create(t.attrs));
    }
    let s = this.top;
    if (i && i.isLeaf)
      this.findInside(e);
    else if (a)
      this.addElement(e, n, a);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((c) => this.insertNode(c, n, !1));
    else {
      let c = e;
      typeof t.contentElement == "string" ? c = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? c = t.contentElement(e) : t.contentElement && (c = t.contentElement), this.findAround(e, c, !0), this.addAll(c, n), this.findAround(e, c, !1);
    }
    o && this.sync(s) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, n, a) {
    let o = n || 0;
    for (let i = n ? e.childNodes[n] : e.firstChild, s = a == null ? null : e.childNodes[a]; i != s; i = i.nextSibling, ++o)
      this.findAtPoint(e, o), this.addDOM(i, t);
    this.findAtPoint(e, o);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, n) {
    let a, o;
    for (let i = this.open, s = 0; i >= 0; i--) {
      let c = this.nodes[i], u = c.findWrapping(e);
      if (u && (!a || a.length > u.length + s) && (a = u, o = c, !u.length))
        break;
      if (c.solid) {
        if (n)
          break;
        s += 2;
      }
    }
    if (!a)
      return null;
    this.sync(o);
    for (let i = 0; i < a.length; i++)
      t = this.enterInner(a[i], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, n) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let o = this.textblockFromContext();
      o && (t = this.enterInner(o, null, t));
    }
    let a = this.findPlace(e, t, n);
    if (a) {
      this.closeExtra();
      let o = this.top;
      o.match && (o.match = o.match.matchType(e.type));
      let i = I.none;
      for (let s of a.concat(e.marks))
        (o.type ? o.type.allowsMarkType(s.type) : Fr(s.type, e.type)) && (i = s.addToSet(i));
      return o.content.push(e.mark(i)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, n, a) {
    let o = this.findPlace(e.create(t), n, !1);
    return o && (o = this.enterInner(e, t, n, !0, a)), o;
  }
  // Open a node of the given type
  enterInner(e, t, n, a = !1, o) {
    this.closeExtra();
    let i = this.top;
    i.match = i.match && i.match.matchType(e);
    let s = zr(e, o, i.options);
    i.options & Ue && i.content.length == 0 && (s |= Ue);
    let c = I.none;
    return n = n.filter((u) => (i.type ? i.type.allowsMarkType(u.type) : Fr(u.type, e)) ? (c = u.addToSet(c), !1) : !0), this.nodes.push(new dt(e, t, c, a, null, s)), this.open++, n;
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
      this.localPreserveWS && (this.nodes[t].options |= tt);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let n = this.nodes[t].content;
      for (let a = n.length - 1; a >= 0; a--)
        e += n[a].nodeSize;
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
      for (let a = 0; a < this.find.length; a++)
        this.find[a].pos == null && e.nodeType == 1 && e.contains(this.find[a].node) && t.compareDocumentPosition(this.find[a].node) & (n ? 2 : 4) && (this.find[a].pos = this.currentPos);
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
    let t = e.split("/"), n = this.options.context, a = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), o = -(n ? n.depth + 1 : 0) + (a ? 0 : 1), i = (s, c) => {
      for (; s >= 0; s--) {
        let u = t[s];
        if (u == "") {
          if (s == t.length - 1 || s == 0)
            continue;
          for (; c >= o; c--)
            if (i(s - 1, c))
              return !0;
          return !1;
        } else {
          let d = c > 0 || c == 0 && a ? this.nodes[c].type : n && c >= o ? n.node(c - o).type : null;
          if (!d || d.name != u && !d.isInGroup(u))
            return !1;
          c--;
        }
      }
      return !0;
    };
    return i(t.length - 1, this.open);
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
function li(r) {
  for (let e = r.firstChild, t = null; e; e = e.nextSibling) {
    let n = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    n && Fn.hasOwnProperty(n) && t ? (t.appendChild(e), e = t) : n == "li" ? t = e : n && (t = null);
  }
}
function ci(r, e) {
  return (r.matches || r.msMatchesSelector || r.webkitMatchesSelector || r.mozMatchesSelector).call(r, e);
}
function $r(r) {
  let e = {};
  for (let t in r)
    e[t] = r[t];
  return e;
}
function Fr(r, e) {
  let t = e.schema.nodes;
  for (let n in t) {
    let a = t[n];
    if (!a.allowsMarkType(r))
      continue;
    let o = [], i = (s) => {
      o.push(s);
      for (let c = 0; c < s.edgeCount; c++) {
        let { type: u, next: d } = s.edge(c);
        if (u == e || o.indexOf(d) < 0 && i(d))
          return !0;
      }
    };
    if (i(a.contentMatch))
      return !0;
  }
}
const Un = 65535, jn = Math.pow(2, 16);
function di(r, e) {
  return r + e * jn;
}
function Ur(r) {
  return r & Un;
}
function ui(r) {
  return (r - (r & Un)) / jn;
}
const Dn = 1, Vn = 2, mt = 4, qn = 8;
class jr {
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
    return (this.delInfo & qn) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Dn | mt)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Vn | mt)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & mt) > 0;
  }
}
class W {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && W.empty)
      return W.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, n = Ur(e);
    if (!this.inverted)
      for (let a = 0; a < n; a++)
        t += this.ranges[a * 3 + 2] - this.ranges[a * 3 + 1];
    return this.ranges[n * 3] + t + ui(e);
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
    let a = 0, o = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let c = this.ranges[s] - (this.inverted ? a : 0);
      if (c > e)
        break;
      let u = this.ranges[s + o], d = this.ranges[s + i], h = c + u;
      if (e <= h) {
        let m = u ? e == c ? -1 : e == h ? 1 : t : t, f = c + a + (m < 0 ? 0 : d);
        if (n)
          return f;
        let b = e == (t < 0 ? c : h) ? null : di(s / 3, e - c), g = e == c ? Vn : e == h ? Dn : mt;
        return (t < 0 ? e != c : e != h) && (g |= qn), new jr(f, g, b);
      }
      a += d - u;
    }
    return n ? e + a : new jr(e + a, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let n = 0, a = Ur(t), o = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let c = this.ranges[s] - (this.inverted ? n : 0);
      if (c > e)
        break;
      let u = this.ranges[s + o], d = c + u;
      if (e <= d && s == a * 3)
        return !0;
      n += this.ranges[s + i] - u;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
    for (let a = 0, o = 0; a < this.ranges.length; a += 3) {
      let i = this.ranges[a], s = i - (this.inverted ? o : 0), c = i + (this.inverted ? 0 : o), u = this.ranges[a + t], d = this.ranges[a + n];
      e(s, s + u, c, c + d), o += d - u;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new W(this.ranges, !this.inverted);
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
    return e == 0 ? W.empty : new W(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
W.empty = new W([]);
const zt = /* @__PURE__ */ Object.create(null);
class V {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return W.empty;
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
    let n = zt[t.stepType];
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
    if (e in zt)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return zt[e] = t, t.prototype.jsonID = e, t;
  }
}
class B {
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
    return new B(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new B(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, n, a) {
    try {
      return B.ok(e.replace(t, n, a));
    } catch (o) {
      if (o instanceof wt)
        return B.fail(o.message);
      throw o;
    }
  }
}
function nr(r, e, t) {
  let n = [];
  for (let a = 0; a < r.childCount; a++) {
    let o = r.child(a);
    o.content.size && (o = o.copy(nr(o.content, e, o))), o.isInline && (o = e(o, t, a)), n.push(o);
  }
  return w.fromArray(n);
}
class de extends V {
  /**
  Create a mark step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = e.resolve(this.from), a = n.node(n.sharedDepth(this.to)), o = new C(nr(t.content, (i, s) => !i.isAtom || !s.type.allowsMarkType(this.mark.type) ? i : i.mark(this.mark.addToSet(i.marks)), a), t.openStart, t.openEnd);
    return B.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new ue(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new de(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof de && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new de(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new de(t.from, t.to, e.markFromJSON(t.mark));
  }
}
V.jsonID("addMark", de);
class ue extends V {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = new C(nr(t.content, (a) => a.mark(this.mark.removeFromSet(a.marks)), e), t.openStart, t.openEnd);
    return B.fromReplace(e, this.from, this.to, n);
  }
  invert() {
    return new de(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new ue(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof ue && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ue(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new ue(t.from, t.to, e.markFromJSON(t.mark));
  }
}
V.jsonID("removeMark", ue);
class pe extends V {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return B.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return B.fromReplace(e, this.pos, this.pos + 1, new C(w.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let n = this.mark.addToSet(t.marks);
      if (n.length == t.marks.length) {
        for (let a = 0; a < t.marks.length; a++)
          if (!t.marks[a].isInSet(n))
            return new pe(this.pos, t.marks[a]);
        return new pe(this.pos, this.mark);
      }
    }
    return new rt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new pe(t.pos, this.mark);
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
    return new pe(t.pos, e.markFromJSON(t.mark));
  }
}
V.jsonID("addNodeMark", pe);
class rt extends V {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return B.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return B.fromReplace(e, this.pos, this.pos + 1, new C(w.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new pe(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new rt(t.pos, this.mark);
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
    return new rt(t.pos, e.markFromJSON(t.mark));
  }
}
V.jsonID("removeNodeMark", rt);
class q extends V {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, n, a = !1) {
    super(), this.from = e, this.to = t, this.slice = n, this.structure = a;
  }
  apply(e) {
    return this.structure && Yt(e, this.from, this.to) ? B.fail("Structure replace would overwrite content") : B.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new W([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new q(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), n = this.from == this.to && q.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return n.deletedAcross && t.deletedAcross ? null : new q(n.pos, Math.max(n.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof q) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? C.empty : new C(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new q(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? C.empty : new C(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new q(e.from, this.to, t, this.structure);
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
    return new q(t.from, t.to, C.fromJSON(e, t.slice), !!t.structure);
  }
}
q.MAP_BIAS = 1;
V.jsonID("replace", q);
class G extends V {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, n, a, o, i, s = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = a, this.slice = o, this.insert = i, this.structure = s;
  }
  apply(e) {
    if (this.structure && (Yt(e, this.from, this.gapFrom) || Yt(e, this.gapTo, this.to)))
      return B.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return B.fail("Gap is not a flat range");
    let n = this.slice.insertAt(this.insert, t.content);
    return n ? B.fromReplace(e, this.from, this.to, n) : B.fail("Content does not fit in gap");
  }
  getMap() {
    return new W([
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
    return new G(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1), a = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), o = this.to == this.gapTo ? n.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && n.deletedAcross || a < t.pos || o > n.pos ? null : new G(t.pos, n.pos, a, o, this.slice, this.insert, this.structure);
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
    return new G(t.from, t.to, t.gapFrom, t.gapTo, C.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
V.jsonID("replaceAround", G);
function Yt(r, e, t) {
  let n = r.resolve(e), a = t - e, o = n.depth;
  for (; a > 0 && o > 0 && n.indexAfter(o) == n.node(o).childCount; )
    o--, a--;
  if (a > 0) {
    let i = n.node(o).maybeChild(n.indexAfter(o));
    for (; a > 0; ) {
      if (!i || i.isLeaf)
        return !0;
      i = i.firstChild, a--;
    }
  }
  return !1;
}
function pi(r, e, t) {
  return (e == 0 || r.canReplace(e, r.childCount)) && (t == r.childCount || r.canReplace(0, t));
}
function He(r) {
  let t = r.parent.content.cutByIndex(r.startIndex, r.endIndex);
  for (let n = r.depth, a = 0, o = 0; ; --n) {
    let i = r.$from.node(n), s = r.$from.index(n) + a, c = r.$to.indexAfter(n) - o;
    if (n < r.depth && i.canReplace(s, c, t))
      return n;
    if (n == 0 || i.type.spec.isolating || !pi(i, s, c))
      break;
    s && (a = 1), c < i.childCount && (o = 1);
  }
  return null;
}
function _n(r, e, t = null, n = r) {
  let a = hi(r, e), o = a && mi(n, e);
  return o ? a.map(Dr).concat({ type: e, attrs: t }).concat(o.map(Dr)) : null;
}
function Dr(r) {
  return { type: r, attrs: null };
}
function hi(r, e) {
  let { parent: t, startIndex: n, endIndex: a } = r, o = t.contentMatchAt(n).findWrapping(e);
  if (!o)
    return null;
  let i = o.length ? o[0] : e;
  return t.canReplaceWith(n, a, i) ? o : null;
}
function mi(r, e) {
  let { parent: t, startIndex: n, endIndex: a } = r, o = t.child(n), i = e.contentMatch.findWrapping(o.type);
  if (!i)
    return null;
  let c = (i.length ? i[i.length - 1] : e).contentMatch;
  for (let u = n; c && u < a; u++)
    c = c.matchType(t.child(u).type);
  return !c || !c.validEnd ? null : i;
}
function oe(r, e, t = 1, n) {
  let a = r.resolve(e), o = a.depth - t, i = n && n[n.length - 1] || a.parent;
  if (o < 0 || a.parent.type.spec.isolating || !a.parent.canReplace(a.index(), a.parent.childCount) || !i.type.validContent(a.parent.content.cutByIndex(a.index(), a.parent.childCount)))
    return !1;
  for (let u = a.depth - 1, d = t - 2; u > o; u--, d--) {
    let h = a.node(u), m = a.index(u);
    if (h.type.spec.isolating)
      return !1;
    let f = h.content.cutByIndex(m, h.childCount), b = n && n[d + 1];
    b && (f = f.replaceChild(0, b.type.create(b.attrs)));
    let g = n && n[d] || h;
    if (!h.canReplace(m + 1, h.childCount) || !g.type.validContent(f))
      return !1;
  }
  let s = a.indexAfter(o), c = n && n[0];
  return a.node(o).canReplaceWith(s, s, c ? c.type : a.node(o + 1).type);
}
function ye(r, e) {
  let t = r.resolve(e), n = t.index();
  return Gn(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(n, n + 1);
}
function fi(r, e) {
  e.content.size || r.type.compatibleContent(e.type);
  let t = r.contentMatchAt(r.childCount), { linebreakReplacement: n } = r.type.schema;
  for (let a = 0; a < e.childCount; a++) {
    let o = e.child(a), i = o.type == n ? r.type.schema.nodes.text : o.type;
    if (t = t.matchType(i), !t || !r.type.allowsMarks(o.marks))
      return !1;
  }
  return t.validEnd;
}
function Gn(r, e) {
  return !!(r && e && !r.isLeaf && fi(r, e));
}
function Ot(r, e, t = -1) {
  let n = r.resolve(e);
  for (let a = n.depth; ; a--) {
    let o, i, s = n.index(a);
    if (a == n.depth ? (o = n.nodeBefore, i = n.nodeAfter) : t > 0 ? (o = n.node(a + 1), s++, i = n.node(a).maybeChild(s)) : (o = n.node(a).maybeChild(s - 1), i = n.node(a + 1)), o && !o.isTextblock && Gn(o, i) && n.node(a).canReplace(s, s + 1))
      return e;
    if (a == 0)
      break;
    e = t < 0 ? n.before(a) : n.after(a);
  }
}
function ar(r, e, t = e, n = C.empty) {
  if (e == t && !n.size)
    return null;
  let a = r.resolve(e), o = r.resolve(t);
  return gi(a, o, n) ? new q(e, t, n) : new bi(a, o, n).fit();
}
function gi(r, e, t) {
  return !t.openStart && !t.openEnd && r.start() == e.start() && r.parent.canReplace(r.index(), e.index(), t.content);
}
class bi {
  constructor(e, t, n) {
    this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = w.empty;
    for (let a = 0; a <= e.depth; a++) {
      let o = e.node(a);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(a))
      });
    }
    for (let a = e.depth; a > 0; a--)
      this.placed = w.from(e.node(a).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let u = this.findFittable();
      u ? this.placeNodes(u) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, a = this.close(e < 0 ? this.$to : n.doc.resolve(e));
    if (!a)
      return null;
    let o = this.placed, i = n.depth, s = a.depth;
    for (; i && s && o.childCount == 1; )
      o = o.firstChild.content, i--, s--;
    let c = new C(o, i, s);
    return e > -1 ? new G(n.pos, e, this.$to.pos, this.$to.end(), c, t) : c.size || n.pos != this.$to.pos ? new q(n.pos, a.pos, c) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, n = 0, a = this.unplaced.openEnd; n < e; n++) {
      let o = t.firstChild;
      if (t.childCount > 1 && (a = 0), o.type.spec.isolating && a <= n) {
        e = n;
        break;
      }
      t = o.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
        let a, o = null;
        n ? (o = Bt(this.unplaced.content, n - 1).firstChild, a = o.content) : a = this.unplaced.content;
        let i = a.firstChild;
        for (let s = this.depth; s >= 0; s--) {
          let { type: c, match: u } = this.frontier[s], d, h = null;
          if (t == 1 && (i ? u.matchType(i.type) || (h = u.fillBefore(w.from(i), !1)) : o && c.compatibleContent(o.type)))
            return { sliceDepth: n, frontierDepth: s, parent: o, inject: h };
          if (t == 2 && i && (d = u.findWrapping(i.type)))
            return { sliceDepth: n, frontierDepth: s, parent: o, wrap: d };
          if (o && u.matchType(o.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, a = Bt(e, t);
    return !a.childCount || a.firstChild.isLeaf ? !1 : (this.unplaced = new C(e, t + 1, Math.max(n, a.size + t >= e.size - n ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, a = Bt(e, t);
    if (a.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + a.size;
      this.unplaced = new C(Re(e, t - 1, 1), t - 1, o ? t - 1 : n);
    } else
      this.unplaced = new C(Re(e, t, 1), t, n);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: a, wrap: o }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (o)
      for (let g = 0; g < o.length; g++)
        this.openFrontierNode(o[g]);
    let i = this.unplaced, s = n ? n.content : i.content, c = i.openStart - e, u = 0, d = [], { match: h, type: m } = this.frontier[t];
    if (a) {
      for (let g = 0; g < a.childCount; g++)
        d.push(a.child(g));
      h = h.matchFragment(a);
    }
    let f = s.size + e - (i.content.size - i.openEnd);
    for (; u < s.childCount; ) {
      let g = s.child(u), v = h.matchType(g.type);
      if (!v)
        break;
      u++, (u > 1 || c == 0 || g.content.size) && (h = v, d.push(Jn(g.mark(m.allowedMarks(g.marks)), u == 1 ? c : 0, u == s.childCount ? f : -1)));
    }
    let b = u == s.childCount;
    b || (f = -1), this.placed = ze(this.placed, t, w.from(d)), this.frontier[t].match = h, b && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let g = 0, v = s; g < f; g++) {
      let x = v.lastChild;
      this.frontier.push({ type: x.type, match: x.contentMatchAt(x.childCount) }), v = x.content;
    }
    this.unplaced = b ? e == 0 ? C.empty : new C(Re(i.content, e - 1, 1), e - 1, f < 0 ? i.openEnd : e - 1) : new C(Re(i.content, e, u), i.openStart, i.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !$t(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: n } = this.$to, a = this.$to.after(n);
    for (; n > 1 && a == this.$to.end(--n); )
      ++a;
    return a;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: n, type: a } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), i = $t(e, t, a, n, o);
      if (i) {
        for (let s = t - 1; s >= 0; s--) {
          let { match: c, type: u } = this.frontier[s], d = $t(e, s, u, c, !0);
          if (!d || d.childCount)
            continue e;
        }
        return { depth: t, fit: i, move: o ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = ze(this.placed, t.depth, t.fit)), e = t.move;
    for (let n = t.depth + 1; n <= e.depth; n++) {
      let a = e.node(n), o = a.type.contentMatch.fillBefore(a.content, !0, e.index(n));
      this.openFrontierNode(a.type, a.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, n) {
    let a = this.frontier[this.depth];
    a.match = a.match.matchType(e), this.placed = ze(this.placed, this.depth, w.from(e.create(t, n))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(w.empty, !0);
    t.childCount && (this.placed = ze(this.placed, this.frontier.length, t));
  }
}
function Re(r, e, t) {
  return e == 0 ? r.cutByIndex(t, r.childCount) : r.replaceChild(0, r.firstChild.copy(Re(r.firstChild.content, e - 1, t)));
}
function ze(r, e, t) {
  return e == 0 ? r.append(t) : r.replaceChild(r.childCount - 1, r.lastChild.copy(ze(r.lastChild.content, e - 1, t)));
}
function Bt(r, e) {
  for (let t = 0; t < e; t++)
    r = r.firstChild.content;
  return r;
}
function Jn(r, e, t) {
  if (e <= 0)
    return r;
  let n = r.content;
  return e > 1 && (n = n.replaceChild(0, Jn(n.firstChild, e - 1, n.childCount == 1 ? t - 1 : 0))), e > 0 && (n = r.type.contentMatch.fillBefore(n).append(n), t <= 0 && (n = n.append(r.type.contentMatch.matchFragment(n).fillBefore(w.empty, !0)))), r.copy(n);
}
function $t(r, e, t, n, a) {
  let o = r.node(e), i = a ? r.indexAfter(e) : r.index(e);
  if (i == o.childCount && !t.compatibleContent(o.type))
    return null;
  let s = n.fillBefore(o.content, !0, i);
  return s && !vi(t, o.content, i) ? s : null;
}
function vi(r, e, t) {
  for (let n = t; n < e.childCount; n++)
    if (!r.allowsMarks(e.child(n).marks))
      return !0;
  return !1;
}
class je extends V {
  /**
  Construct an attribute step.
  */
  constructor(e, t, n) {
    super(), this.pos = e, this.attr = t, this.value = n;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return B.fail("No node at attribute step's position");
    let n = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      n[o] = t.attrs[o];
    n[this.attr] = this.value;
    let a = t.type.create(n, null, t.marks);
    return B.fromReplace(e, this.pos, this.pos + 1, new C(w.from(a), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return W.empty;
  }
  invert(e) {
    return new je(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new je(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new je(t.pos, t.attr, t.value);
  }
}
V.jsonID("attr", je);
class At extends V {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let a in e.attrs)
      t[a] = e.attrs[a];
    t[this.attr] = this.value;
    let n = e.type.create(t, e.content, e.marks);
    return B.ok(n);
  }
  getMap() {
    return W.empty;
  }
  invert(e) {
    return new At(this.attr, e.attrs[this.attr]);
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
    return new At(t.attr, t.value);
  }
}
V.jsonID("docAttr", At);
let nt = class extends Error {
};
nt = function r(e) {
  let t = Error.call(this, e);
  return t.__proto__ = r.prototype, t;
};
nt.prototype = Object.create(Error.prototype);
nt.prototype.constructor = nt;
nt.prototype.name = "TransformError";
const Ft = /* @__PURE__ */ Object.create(null);
class E {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, n) {
    this.$anchor = e, this.$head = t, this.ranges = n || [new yi(e.min(t), e.max(t))];
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
  replace(e, t = C.empty) {
    let n = t.content.lastChild, a = null;
    for (let s = 0; s < t.openEnd; s++)
      a = n, n = n.lastChild;
    let o = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: c, $to: u } = i[s], d = e.mapping.slice(o);
      e.replaceRange(d.map(c.pos), d.map(u.pos), s ? C.empty : t), s == 0 && _r(e, o, (n ? n.isInline : a && a.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let n = e.steps.length, a = this.ranges;
    for (let o = 0; o < a.length; o++) {
      let { $from: i, $to: s } = a[o], c = e.mapping.slice(n), u = c.map(i.pos), d = c.map(s.pos);
      o ? e.deleteRange(u, d) : (e.replaceRangeWith(u, d, t), _r(e, n, t.isInline ? -1 : 1));
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
    let a = e.parent.inlineContent ? new P(e) : ke(e.node(0), e.parent, e.pos, e.index(), t, n);
    if (a)
      return a;
    for (let o = e.depth - 1; o >= 0; o--) {
      let i = t < 0 ? ke(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, n) : ke(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, n);
      if (i)
        return i;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new K(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return ke(e, e, 0, 0, 1) || new K(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return ke(e, e, e.content.size, e.childCount, -1) || new K(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let n = Ft[t.type];
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
    if (e in Ft)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Ft[e] = t, t.prototype.jsonID = e, t;
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
    return P.between(this.$anchor, this.$head).getBookmark();
  }
}
E.prototype.visible = !0;
class yi {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Vr = !1;
function qr(r) {
  !Vr && !r.parent.inlineContent && (Vr = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + r.parent.type.name + ")"));
}
class P extends E {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    qr(e), qr(t), super(e, t);
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
      return E.near(n);
    let a = e.resolve(t.map(this.anchor));
    return new P(a.parent.inlineContent ? a : n, n);
  }
  replace(e, t = C.empty) {
    if (super.replace(e, t), t == C.empty) {
      let n = this.$from.marksAcross(this.$to);
      n && e.ensureMarks(n);
    }
  }
  eq(e) {
    return e instanceof P && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Pt(this.anchor, this.head);
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
    return new P(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, n = t) {
    let a = e.resolve(t);
    return new this(a, n == t ? a : e.resolve(n));
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
    let a = e.pos - t.pos;
    if ((!n || a) && (n = a >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let o = E.findFrom(t, n, !0) || E.findFrom(t, -n, !0);
      if (o)
        t = o.$head;
      else
        return E.near(t, n);
    }
    return e.parent.inlineContent || (a == 0 ? e = t : (e = (E.findFrom(e, -n, !0) || E.findFrom(e, n, !0)).$anchor, e.pos < t.pos != a < 0 && (e = t))), new P(e, t);
  }
}
E.jsonID("text", P);
class Pt {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Pt(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return P.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class L extends E {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, n), this.node = t;
  }
  map(e, t) {
    let { deleted: n, pos: a } = t.mapResult(this.anchor), o = e.resolve(a);
    return n ? E.near(o) : new L(o);
  }
  content() {
    return new C(w.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof L && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new or(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new L(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new L(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
L.prototype.visible = !1;
E.jsonID("node", L);
class or {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: n } = e.mapResult(this.anchor);
    return t ? new Pt(n, n) : new or(n);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), n = t.nodeAfter;
    return n && L.isSelectable(n) ? new L(t) : E.near(t);
  }
}
class K extends E {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = C.empty) {
    if (t == C.empty) {
      e.delete(0, e.doc.content.size);
      let n = E.atStart(e.doc);
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
    return new K(e);
  }
  map(e) {
    return new K(e);
  }
  eq(e) {
    return e instanceof K;
  }
  getBookmark() {
    return xi;
  }
}
E.jsonID("all", K);
const xi = {
  map() {
    return this;
  },
  resolve(r) {
    return new K(r);
  }
};
function ke(r, e, t, n, a, o = !1) {
  if (e.inlineContent)
    return P.create(r, t);
  for (let i = n - (a > 0 ? 0 : 1); a > 0 ? i < e.childCount : i >= 0; i += a) {
    let s = e.child(i);
    if (s.isAtom) {
      if (!o && L.isSelectable(s))
        return L.create(r, t - (a < 0 ? s.nodeSize : 0));
    } else {
      let c = ke(r, s, t + a, a < 0 ? s.childCount : 0, a, o);
      if (c)
        return c;
    }
    t += s.nodeSize * a;
  }
  return null;
}
function _r(r, e, t) {
  let n = r.steps.length - 1;
  if (n < e)
    return;
  let a = r.steps[n];
  if (!(a instanceof q || a instanceof G))
    return;
  let o = r.mapping.maps[n], i;
  o.forEach((s, c, u, d) => {
    i == null && (i = d);
  }), r.setSelection(E.near(r.doc.resolve(i), t));
}
function Gr(r, e) {
  return !e || !r ? r : r.bind(e);
}
class ut {
  constructor(e, t, n) {
    this.name = e, this.init = Gr(t.init, n), this.apply = Gr(t.apply, n);
  }
}
new ut("doc", {
  init(r) {
    return r.doc || r.schema.topNodeType.createAndFill();
  },
  apply(r) {
    return r.doc;
  }
}), new ut("selection", {
  init(r, e) {
    return r.selection || E.atStart(e.doc);
  },
  apply(r) {
    return r.selection;
  }
}), new ut("storedMarks", {
  init(r) {
    return r.storedMarks || null;
  },
  apply(r, e, t, n) {
    return n.selection.$cursor ? r.storedMarks : null;
  }
}), new ut("scrollToSelection", {
  init() {
    return 0;
  },
  apply(r, e) {
    return r.scrolledIntoView ? e + 1 : e;
  }
});
function Wn(r, e, t) {
  for (let n in r) {
    let a = r[n];
    a instanceof Function ? a = a.bind(e) : n == "handleDOMEvents" && (a = Wn(a, e, {})), t[n] = a;
  }
  return t;
}
class xe {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Wn(e.props, this, this.props), this.key = e.key ? e.key.key : Kn("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Ut = /* @__PURE__ */ Object.create(null);
function Kn(r) {
  return r in Ut ? r + "$" + ++Ut[r] : (Ut[r] = 0, r + "$");
}
class we {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Kn(e);
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
const ir = (r, e) => r.selection.empty ? !1 : (e && e(r.tr.deleteSelection().scrollIntoView()), !0);
function Yn(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("backward", r) : t.parentOffset > 0) ? null : t;
}
const Zn = (r, e, t) => {
  let n = Yn(r, t);
  if (!n)
    return !1;
  let a = sr(n);
  if (!a) {
    let i = n.blockRange(), s = i && He(i);
    return s == null ? !1 : (e && e(r.tr.lift(i, s).scrollIntoView()), !0);
  }
  let o = a.nodeBefore;
  if (ia(r, a, e, -1))
    return !0;
  if (n.parent.content.size == 0 && (Te(o, "end") || L.isSelectable(o)))
    for (let i = n.depth; ; i--) {
      let s = ar(r.doc, n.before(i), n.after(i), C.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let c = r.tr.step(s);
          c.setSelection(Te(o, "end") ? E.findFrom(c.doc.resolve(c.mapping.map(a.pos, -1)), -1) : L.create(c.doc, a.pos - o.nodeSize)), e(c.scrollIntoView());
        }
        return !0;
      }
      if (i == 1 || n.node(i - 1).childCount > 1)
        break;
    }
  return o.isAtom && a.depth == n.depth - 1 ? (e && e(r.tr.delete(a.pos - o.nodeSize, a.pos).scrollIntoView()), !0) : !1;
}, wi = (r, e, t) => {
  let n = Yn(r, t);
  if (!n)
    return !1;
  let a = sr(n);
  return a ? Qn(r, a, e) : !1;
}, ki = (r, e, t) => {
  let n = ea(r, t);
  if (!n)
    return !1;
  let a = lr(n);
  return a ? Qn(r, a, e) : !1;
};
function Qn(r, e, t) {
  let n = e.nodeBefore, a = n, o = e.pos - 1;
  for (; !a.isTextblock; o--) {
    if (a.type.spec.isolating)
      return !1;
    let d = a.lastChild;
    if (!d)
      return !1;
    a = d;
  }
  let i = e.nodeAfter, s = i, c = e.pos + 1;
  for (; !s.isTextblock; c++) {
    if (s.type.spec.isolating)
      return !1;
    let d = s.firstChild;
    if (!d)
      return !1;
    s = d;
  }
  let u = ar(r.doc, o, c, C.empty);
  if (!u || u.from != o || u instanceof q && u.slice.size >= c - o)
    return !1;
  if (t) {
    let d = r.tr.step(u);
    d.setSelection(P.create(d.doc, o)), t(d.scrollIntoView());
  }
  return !0;
}
function Te(r, e, t = !1) {
  for (let n = r; n; n = e == "start" ? n.firstChild : n.lastChild) {
    if (n.isTextblock)
      return !0;
    if (t && n.childCount != 1)
      return !1;
  }
  return !1;
}
const Xn = (r, e, t) => {
  let { $head: n, empty: a } = r.selection, o = n;
  if (!a)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", r) : n.parentOffset > 0)
      return !1;
    o = sr(n);
  }
  let i = o && o.nodeBefore;
  return !i || !L.isSelectable(i) ? !1 : (e && e(r.tr.setSelection(L.create(r.doc, o.pos - i.nodeSize)).scrollIntoView()), !0);
};
function sr(r) {
  if (!r.parent.type.spec.isolating)
    for (let e = r.depth - 1; e >= 0; e--) {
      if (r.index(e) > 0)
        return r.doc.resolve(r.before(e + 1));
      if (r.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function ea(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("forward", r) : t.parentOffset < t.parent.content.size) ? null : t;
}
const ta = (r, e, t) => {
  let n = ea(r, t);
  if (!n)
    return !1;
  let a = lr(n);
  if (!a)
    return !1;
  let o = a.nodeAfter;
  if (ia(r, a, e, 1))
    return !0;
  if (n.parent.content.size == 0 && (Te(o, "start") || L.isSelectable(o))) {
    let i = ar(r.doc, n.before(), n.after(), C.empty);
    if (i && i.slice.size < i.to - i.from) {
      if (e) {
        let s = r.tr.step(i);
        s.setSelection(Te(o, "start") ? E.findFrom(s.doc.resolve(s.mapping.map(a.pos)), 1) : L.create(s.doc, s.mapping.map(a.pos))), e(s.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && a.depth == n.depth - 1 ? (e && e(r.tr.delete(a.pos, a.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, ra = (r, e, t) => {
  let { $head: n, empty: a } = r.selection, o = n;
  if (!a)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", r) : n.parentOffset < n.parent.content.size)
      return !1;
    o = lr(n);
  }
  let i = o && o.nodeAfter;
  return !i || !L.isSelectable(i) ? !1 : (e && e(r.tr.setSelection(L.create(r.doc, o.pos)).scrollIntoView()), !0);
};
function lr(r) {
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
const Ci = (r, e) => {
  let t = r.selection, n = t instanceof L, a;
  if (n) {
    if (t.node.isTextblock || !ye(r.doc, t.from))
      return !1;
    a = t.from;
  } else if (a = Ot(r.doc, t.from, -1), a == null)
    return !1;
  if (e) {
    let o = r.tr.join(a);
    n && o.setSelection(L.create(o.doc, a - r.doc.resolve(a).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, Si = (r, e) => {
  let t = r.selection, n;
  if (t instanceof L) {
    if (t.node.isTextblock || !ye(r.doc, t.to))
      return !1;
    n = t.to;
  } else if (n = Ot(r.doc, t.to, 1), n == null)
    return !1;
  return e && e(r.tr.join(n).scrollIntoView()), !0;
}, Ni = (r, e) => {
  let { $from: t, $to: n } = r.selection, a = t.blockRange(n), o = a && He(a);
  return o == null ? !1 : (e && e(r.tr.lift(a, o).scrollIntoView()), !0);
}, na = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  return !t.parent.type.spec.code || !t.sameParent(n) ? !1 : (e && e(r.tr.insertText(`
`).scrollIntoView()), !0);
};
function cr(r) {
  for (let e = 0; e < r.edgeCount; e++) {
    let { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Ai = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  if (!t.parent.type.spec.code || !t.sameParent(n))
    return !1;
  let a = t.node(-1), o = t.indexAfter(-1), i = cr(a.contentMatchAt(o));
  if (!i || !a.canReplaceWith(o, o, i))
    return !1;
  if (e) {
    let s = t.after(), c = r.tr.replaceWith(s, s, i.createAndFill());
    c.setSelection(E.near(c.doc.resolve(s), 1)), e(c.scrollIntoView());
  }
  return !0;
}, aa = (r, e) => {
  let t = r.selection, { $from: n, $to: a } = t;
  if (t instanceof K || n.parent.inlineContent || a.parent.inlineContent)
    return !1;
  let o = cr(a.parent.contentMatchAt(a.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let i = (!n.parentOffset && a.index() < a.parent.childCount ? n : a).pos, s = r.tr.insert(i, o.createAndFill());
    s.setSelection(P.create(s.doc, i + 1)), e(s.scrollIntoView());
  }
  return !0;
}, oa = (r, e) => {
  let { $cursor: t } = r.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (oe(r.doc, o))
      return e && e(r.tr.split(o).scrollIntoView()), !0;
  }
  let n = t.blockRange(), a = n && He(n);
  return a == null ? !1 : (e && e(r.tr.lift(n, a).scrollIntoView()), !0);
};
function Ti(r) {
  return (e, t) => {
    let { $from: n, $to: a } = e.selection;
    if (e.selection instanceof L && e.selection.node.isBlock)
      return !n.parentOffset || !oe(e.doc, n.pos) ? !1 : (t && t(e.tr.split(n.pos).scrollIntoView()), !0);
    if (!n.depth)
      return !1;
    let o = [], i, s, c = !1, u = !1;
    for (let f = n.depth; ; f--)
      if (n.node(f).isBlock) {
        c = n.end(f) == n.pos + (n.depth - f), u = n.start(f) == n.pos - (n.depth - f), s = cr(n.node(f - 1).contentMatchAt(n.indexAfter(f - 1))), o.unshift(c && s ? { type: s } : null), i = f;
        break;
      } else {
        if (f == 1)
          return !1;
        o.unshift(null);
      }
    let d = e.tr;
    (e.selection instanceof P || e.selection instanceof K) && d.deleteSelection();
    let h = d.mapping.map(n.pos), m = oe(d.doc, h, o.length, o);
    if (m || (o[0] = s ? { type: s } : null, m = oe(d.doc, h, o.length, o)), !m)
      return !1;
    if (d.split(h, o.length, o), !c && u && n.node(i).type != s) {
      let f = d.mapping.map(n.before(i)), b = d.doc.resolve(f);
      s && n.node(i - 1).canReplaceWith(b.index(), b.index() + 1, s) && d.setNodeMarkup(d.mapping.map(n.before(i)), s);
    }
    return t && t(d.scrollIntoView()), !0;
  };
}
const Ei = Ti(), Li = (r, e) => {
  let { $from: t, to: n } = r.selection, a, o = t.sharedDepth(n);
  return o == 0 ? !1 : (a = t.before(o), e && e(r.tr.setSelection(L.create(r.doc, a))), !0);
};
function Mi(r, e, t) {
  let n = e.nodeBefore, a = e.nodeAfter, o = e.index();
  return !n || !a || !n.type.compatibleContent(a.type) ? !1 : !n.content.size && e.parent.canReplace(o - 1, o) ? (t && t(r.tr.delete(e.pos - n.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(a.isTextblock || ye(r.doc, e.pos)) ? !1 : (t && t(r.tr.join(e.pos).scrollIntoView()), !0);
}
function ia(r, e, t, n) {
  let a = e.nodeBefore, o = e.nodeAfter, i, s, c = a.type.spec.isolating || o.type.spec.isolating;
  if (!c && Mi(r, e, t))
    return !0;
  let u = !c && e.parent.canReplace(e.index(), e.index() + 1);
  if (u && (i = (s = a.contentMatchAt(a.childCount)).findWrapping(o.type)) && s.matchType(i[0] || o.type).validEnd) {
    if (t) {
      let f = e.pos + o.nodeSize, b = w.empty;
      for (let x = i.length - 1; x >= 0; x--)
        b = w.from(i[x].create(null, b));
      b = w.from(a.copy(b));
      let g = r.tr.step(new G(e.pos - 1, f, e.pos, f, new C(b, 1, 0), i.length, !0)), v = g.doc.resolve(f + 2 * i.length);
      v.nodeAfter && v.nodeAfter.type == a.type && ye(g.doc, v.pos) && g.join(v.pos), t(g.scrollIntoView());
    }
    return !0;
  }
  let d = o.type.spec.isolating || n > 0 && c ? null : E.findFrom(e, 1), h = d && d.$from.blockRange(d.$to), m = h && He(h);
  if (m != null && m >= e.depth)
    return t && t(r.tr.lift(h, m).scrollIntoView()), !0;
  if (u && Te(o, "start", !0) && Te(a, "end")) {
    let f = a, b = [];
    for (; b.push(f), !f.isTextblock; )
      f = f.lastChild;
    let g = o, v = 1;
    for (; !g.isTextblock; g = g.firstChild)
      v++;
    if (f.canReplace(f.childCount, f.childCount, g.content)) {
      if (t) {
        let x = w.empty;
        for (let A = b.length - 1; A >= 0; A--)
          x = w.from(b[A].copy(x));
        let S = r.tr.step(new G(e.pos - b.length, e.pos + o.nodeSize, e.pos + v, e.pos + o.nodeSize - v, new C(x, b.length, 0), 0, !0));
        t(S.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function sa(r) {
  return function(e, t) {
    let n = e.selection, a = r < 0 ? n.$from : n.$to, o = a.depth;
    for (; a.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return a.node(o).isTextblock ? (t && t(e.tr.setSelection(P.create(e.doc, r < 0 ? a.start(o) : a.end(o)))), !0) : !1;
  };
}
const Ii = sa(-1), Hi = sa(1);
function Oi(r, e = null) {
  return function(t, n) {
    let { $from: a, $to: o } = t.selection, i = a.blockRange(o), s = i && _n(i, r, e);
    return s ? (n && n(t.tr.wrap(i, s).scrollIntoView()), !0) : !1;
  };
}
function Jr(r, e = null) {
  return function(t, n) {
    let a = !1;
    for (let o = 0; o < t.selection.ranges.length && !a; o++) {
      let { $from: { pos: i }, $to: { pos: s } } = t.selection.ranges[o];
      t.doc.nodesBetween(i, s, (c, u) => {
        if (a)
          return !1;
        if (!(!c.isTextblock || c.hasMarkup(r, e)))
          if (c.type == r)
            a = !0;
          else {
            let d = t.doc.resolve(u), h = d.index();
            a = d.parent.canReplaceWith(h, h + 1, r);
          }
      });
    }
    if (!a)
      return !1;
    if (n) {
      let o = t.tr;
      for (let i = 0; i < t.selection.ranges.length; i++) {
        let { $from: { pos: s }, $to: { pos: c } } = t.selection.ranges[i];
        o.setBlockType(s, c, r, e);
      }
      n(o.scrollIntoView());
    }
    return !0;
  };
}
function dr(...r) {
  return function(e, t, n) {
    for (let a = 0; a < r.length; a++)
      if (r[a](e, t, n))
        return !0;
    return !1;
  };
}
dr(ir, Zn, Xn);
dr(ir, ta, ra);
dr(na, aa, oa, Ei);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Pi(r, e = null) {
  return function(t, n) {
    let { $from: a, $to: o } = t.selection, i = a.blockRange(o);
    if (!i)
      return !1;
    let s = n ? t.tr : null;
    return Ri(s, i, r, e) ? (n && n(s.scrollIntoView()), !0) : !1;
  };
}
function Ri(r, e, t, n = null) {
  let a = !1, o = e, i = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let c = i.resolve(e.start - 2);
    o = new Ct(c, c, e.depth), e.endIndex < e.parent.childCount && (e = new Ct(e.$from, i.resolve(e.$to.end(e.depth)), e.depth)), a = !0;
  }
  let s = _n(o, t, n, e);
  return s ? (r && zi(r, e, s, a, t), !0) : !1;
}
function zi(r, e, t, n, a) {
  let o = w.empty;
  for (let d = t.length - 1; d >= 0; d--)
    o = w.from(t[d].type.create(t[d].attrs, o));
  r.step(new G(e.start - (n ? 2 : 0), e.end, e.start, e.end, new C(o, 0, 0), t.length, !0));
  let i = 0;
  for (let d = 0; d < t.length; d++)
    t[d].type == a && (i = d + 1);
  let s = t.length - i, c = e.start + t.length - (n ? 2 : 0), u = e.parent;
  for (let d = e.startIndex, h = e.endIndex, m = !0; d < h; d++, m = !1)
    !m && oe(r.doc, c, s) && (r.split(c, s), c += 2 * s), c += u.child(d).nodeSize;
  return r;
}
function Bi(r) {
  return function(e, t) {
    let { $from: n, $to: a } = e.selection, o = n.blockRange(a, (i) => i.childCount > 0 && i.firstChild.type == r);
    return o ? t ? n.node(o.depth - 1).type == r ? $i(e, t, r, o) : Fi(e, t, o) : !0 : !1;
  };
}
function $i(r, e, t, n) {
  let a = r.tr, o = n.end, i = n.$to.end(n.depth);
  o < i && (a.step(new G(o - 1, i, o, i, new C(w.from(t.create(null, n.parent.copy())), 1, 0), 1, !0)), n = new Ct(a.doc.resolve(n.$from.pos), a.doc.resolve(i), n.depth));
  const s = He(n);
  if (s == null)
    return !1;
  a.lift(n, s);
  let c = a.doc.resolve(a.mapping.map(o, -1) - 1);
  return ye(a.doc, c.pos) && c.nodeBefore.type == c.nodeAfter.type && a.join(c.pos), e(a.scrollIntoView()), !0;
}
function Fi(r, e, t) {
  let n = r.tr, a = t.parent;
  for (let f = t.end, b = t.endIndex - 1, g = t.startIndex; b > g; b--)
    f -= a.child(b).nodeSize, n.delete(f - 1, f + 1);
  let o = n.doc.resolve(t.start), i = o.nodeAfter;
  if (n.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let s = t.startIndex == 0, c = t.endIndex == a.childCount, u = o.node(-1), d = o.index(-1);
  if (!u.canReplace(d + (s ? 0 : 1), d + 1, i.content.append(c ? w.empty : w.from(a))))
    return !1;
  let h = o.pos, m = h + i.nodeSize;
  return n.step(new G(h - (s ? 1 : 0), m + (c ? 1 : 0), h + 1, m - 1, new C((s ? w.empty : w.from(a.copy(w.empty))).append(c ? w.empty : w.from(a.copy(w.empty))), s ? 0 : 1, c ? 0 : 1), s ? 0 : 1)), e(n.scrollIntoView()), !0;
}
function Ui(r) {
  return function(e, t) {
    let { $from: n, $to: a } = e.selection, o = n.blockRange(a, (u) => u.childCount > 0 && u.firstChild.type == r);
    if (!o)
      return !1;
    let i = o.startIndex;
    if (i == 0)
      return !1;
    let s = o.parent, c = s.child(i - 1);
    if (c.type != r)
      return !1;
    if (t) {
      let u = c.lastChild && c.lastChild.type == s.type, d = w.from(u ? r.create() : null), h = new C(w.from(r.create(null, w.from(s.type.create(null, d)))), u ? 3 : 1, 0), m = o.start, f = o.end;
      t(e.tr.step(new G(m - (u ? 3 : 1), f, m, f, h, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function la(r) {
  const { state: e, transaction: t } = r;
  let { selection: n } = t, { doc: a } = t, { storedMarks: o } = t;
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
      return a;
    },
    get tr() {
      return n = t.selection, a = t.doc, o = t.storedMarks, t;
    }
  };
}
class ji {
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
    const { rawCommands: e, editor: t, state: n } = this, { view: a } = t, { tr: o } = n, i = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([s, c]) => [s, (...d) => {
      const h = c(...d)(i);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && a.dispatch(o), h;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: n, editor: a, state: o } = this, { view: i } = a, s = [], c = !!e, u = e || o.tr, d = () => (!c && t && !u.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(u), s.every((m) => m === !0)), h = {
      ...Object.fromEntries(Object.entries(n).map(([m, f]) => [m, (...g) => {
        const v = this.buildProps(u, t), x = f(...g)(v);
        return s.push(x), h;
      }])),
      run: d
    };
    return h;
  }
  createCan(e) {
    const { rawCommands: t, state: n } = this, a = !1, o = e || n.tr, i = this.buildProps(o, a);
    return {
      ...Object.fromEntries(Object.entries(t).map(([c, u]) => [c, (...d) => u(...d)({ ...i, dispatch: void 0 })])),
      chain: () => this.createChain(o, a)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: n, editor: a, state: o } = this, { view: i } = a, s = {
      tr: e,
      editor: a,
      view: i,
      state: la({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(n).map(([c, u]) => [c, (...d) => u(...d)(s)]));
      }
    };
    return s;
  }
}
function Z(r, e, t) {
  return r.config[e] === void 0 && r.parent ? Z(r.parent, e, t) : typeof r.config[e] == "function" ? r.config[e].bind({
    ...t,
    parent: r.parent ? Z(r.parent, e, t) : null
  }) : r.config[e];
}
function Di(r) {
  const e = r.filter((a) => a.type === "extension"), t = r.filter((a) => a.type === "node"), n = r.filter((a) => a.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: n
  };
}
function D(r, e) {
  if (typeof r == "string") {
    if (!e.nodes[r])
      throw Error(`There is no node type named '${r}'. Maybe you forgot to add the extension?`);
    return e.nodes[r];
  }
  return r;
}
function ca(...r) {
  return r.filter((e) => !!e).reduce((e, t) => {
    const n = { ...e };
    return Object.entries(t).forEach(([a, o]) => {
      if (!n[a]) {
        n[a] = o;
        return;
      }
      if (a === "class") {
        const s = o ? String(o).split(" ") : [], c = n[a] ? n[a].split(" ") : [], u = s.filter((d) => !c.includes(d));
        n[a] = [...c, ...u].join(" ");
      } else if (a === "style") {
        const s = o ? o.split(";").map((d) => d.trim()).filter(Boolean) : [], c = n[a] ? n[a].split(";").map((d) => d.trim()).filter(Boolean) : [], u = /* @__PURE__ */ new Map();
        c.forEach((d) => {
          const [h, m] = d.split(":").map((f) => f.trim());
          u.set(h, m);
        }), s.forEach((d) => {
          const [h, m] = d.split(":").map((f) => f.trim());
          u.set(h, m);
        }), n[a] = Array.from(u.entries()).map(([d, h]) => `${d}: ${h}`).join("; ");
      } else
        n[a] = o;
    }), n;
  }, {});
}
function Vi(r, e) {
  return e.filter((t) => t.type === r.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(r.attrs) || {} : {
    [t.name]: r.attrs[t.name]
  }).reduce((t, n) => ca(t, n), {});
}
function qi(r) {
  return typeof r == "function";
}
function ae(r, e = void 0, ...t) {
  return qi(r) ? e ? r.bind(e)(...t) : r(...t) : r;
}
function _i(r) {
  return Object.prototype.toString.call(r) === "[object RegExp]";
}
function Gi(r) {
  return Object.prototype.toString.call(r).slice(8, -1);
}
function pt(r) {
  return Gi(r) !== "Object" ? !1 : r.constructor === Object && Object.getPrototypeOf(r) === Object.prototype;
}
function ur(r, e) {
  const t = { ...r };
  return pt(r) && pt(e) && Object.keys(e).forEach((n) => {
    pt(e[n]) && pt(r[n]) ? t[n] = ur(r[n], e[n]) : t[n] = e[n];
  }), t;
}
class X {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = ae(Z(this, "addOptions", {
      name: this.name
    }))), this.storage = ae(Z(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new X(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => ur(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new X({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = ae(Z(t, "addOptions", {
      name: t.name
    })), t.storage = ae(Z(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Ji(r, e, t) {
  const { from: n, to: a } = e, { blockSeparator: o = `

`, textSerializers: i = {} } = t || {};
  let s = "";
  return r.nodesBetween(n, a, (c, u, d, h) => {
    var m;
    c.isBlock && u > n && (s += o);
    const f = i == null ? void 0 : i[c.type.name];
    if (f)
      return d && (s += f({
        node: c,
        pos: u,
        parent: d,
        index: h,
        range: e
      })), !1;
    c.isText && (s += (m = c == null ? void 0 : c.text) === null || m === void 0 ? void 0 : m.slice(Math.max(n, u) - u, a - u));
  }), s;
}
function Wi(r) {
  return Object.fromEntries(Object.entries(r.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
X.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new xe({
        key: new we("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: r } = this, { state: e, schema: t } = r, { doc: n, selection: a } = e, { ranges: o } = a, i = Math.min(...o.map((d) => d.$from.pos)), s = Math.max(...o.map((d) => d.$to.pos)), c = Wi(t);
            return Ji(n, { from: i, to: s }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: c
            });
          }
        }
      })
    ];
  }
});
const Ki = () => ({ editor: r, view: e }) => (requestAnimationFrame(() => {
  var t;
  r.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), Yi = (r = !1) => ({ commands: e }) => e.setContent("", r), Zi = () => ({ state: r, tr: e, dispatch: t }) => {
  const { selection: n } = e, { ranges: a } = n;
  return t && a.forEach(({ $from: o, $to: i }) => {
    r.doc.nodesBetween(o.pos, i.pos, (s, c) => {
      if (s.type.isText)
        return;
      const { doc: u, mapping: d } = e, h = u.resolve(d.map(c)), m = u.resolve(d.map(c + s.nodeSize)), f = h.blockRange(m);
      if (!f)
        return;
      const b = He(f);
      if (s.type.isTextblock) {
        const { defaultType: g } = h.parent.contentMatchAt(h.index());
        e.setNodeMarkup(f.start, g);
      }
      (b || b === 0) && e.lift(f, b);
    });
  }), !0;
}, Qi = (r) => (e) => r(e), Xi = () => ({ state: r, dispatch: e }) => aa(r, e), es = (r, e) => ({ editor: t, tr: n }) => {
  const { state: a } = t, o = a.doc.slice(r.from, r.to);
  n.deleteRange(r.from, r.to);
  const i = n.mapping.map(e);
  return n.insert(i, o.content), n.setSelection(new P(n.doc.resolve(Math.max(i - 1, 0)))), !0;
}, ts = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, n = t.$anchor.node();
  if (n.content.size > 0)
    return !1;
  const a = r.selection.$anchor;
  for (let o = a.depth; o > 0; o -= 1)
    if (a.node(o).type === n.type) {
      if (e) {
        const s = a.before(o), c = a.after(o);
        r.delete(s, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, rs = (r) => ({ tr: e, state: t, dispatch: n }) => {
  const a = D(r, t.schema), o = e.selection.$anchor;
  for (let i = o.depth; i > 0; i -= 1)
    if (o.node(i).type === a) {
      if (n) {
        const c = o.before(i), u = o.after(i);
        e.delete(c, u).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, ns = (r) => ({ tr: e, dispatch: t }) => {
  const { from: n, to: a } = r;
  return t && e.delete(n, a), !0;
}, as = () => ({ state: r, dispatch: e }) => ir(r, e), is = () => ({ commands: r }) => r.keyboardShortcut("Enter"), ss = () => ({ state: r, dispatch: e }) => Ai(r, e);
function Tt(r, e, t = { strict: !0 }) {
  const n = Object.keys(e);
  return n.length ? n.every((a) => t.strict ? e[a] === r[a] : _i(e[a]) ? e[a].test(r[a]) : e[a] === r[a]) : !0;
}
function da(r, e, t = {}) {
  return r.find((n) => n.type === e && Tt(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((a) => [a, n.attrs[a]])),
    t
  ));
}
function Wr(r, e, t = {}) {
  return !!da(r, e, t);
}
function ua(r, e, t) {
  var n;
  if (!r || !e)
    return;
  let a = r.parent.childAfter(r.parentOffset);
  if ((!a.node || !a.node.marks.some((d) => d.type === e)) && (a = r.parent.childBefore(r.parentOffset)), !a.node || !a.node.marks.some((d) => d.type === e) || (t = t || ((n = a.node.marks[0]) === null || n === void 0 ? void 0 : n.attrs), !da([...a.node.marks], e, t)))
    return;
  let i = a.index, s = r.start() + a.offset, c = i + 1, u = s + a.node.nodeSize;
  for (; i > 0 && Wr([...r.parent.child(i - 1).marks], e, t); )
    i -= 1, s -= r.parent.child(i).nodeSize;
  for (; c < r.parent.childCount && Wr([...r.parent.child(c).marks], e, t); )
    u += r.parent.child(c).nodeSize, c += 1;
  return {
    from: s,
    to: u
  };
}
function le(r, e) {
  if (typeof r == "string") {
    if (!e.marks[r])
      throw Error(`There is no mark type named '${r}'. Maybe you forgot to add the extension?`);
    return e.marks[r];
  }
  return r;
}
const ls = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  const o = le(r, n.schema), { doc: i, selection: s } = t, { $from: c, from: u, to: d } = s;
  if (a) {
    const h = ua(c, o, e);
    if (h && h.from <= u && h.to >= d) {
      const m = P.create(i, h.from, h.to);
      t.setSelection(m);
    }
  }
  return !0;
}, cs = (r) => (e) => {
  const t = typeof r == "function" ? r(e) : r;
  for (let n = 0; n < t.length; n += 1)
    if (t[n](e))
      return !0;
  return !1;
};
function pa(r) {
  return r instanceof P;
}
function he(r = 0, e = 0, t = 0) {
  return Math.min(Math.max(r, e), t);
}
function ds(r, e = null) {
  if (!e)
    return null;
  const t = E.atStart(r), n = E.atEnd(r);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return n;
  const a = t.from, o = n.to;
  return e === "all" ? P.create(r, he(0, a, o), he(r.content.size, a, o)) : P.create(r, he(e, a, o), he(e, a, o));
}
function Zt() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function at() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function us() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
const ps = (r = null, e = {}) => ({ editor: t, view: n, tr: a, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const i = () => {
    (at() || Zt()) && n.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (n.focus(), us() && !at() && !Zt() && n.dom.focus({ preventScroll: !0 }));
    });
  };
  if (n.hasFocus() && r === null || r === !1)
    return !0;
  if (o && r === null && !pa(t.state.selection))
    return i(), !0;
  const s = ds(a.doc, r) || t.state.selection, c = t.state.selection.eq(s);
  return o && (c || a.setSelection(s), c && a.storedMarks && a.setStoredMarks(a.storedMarks), i()), !0;
}, hs = (r, e) => (t) => r.every((n, a) => e(n, { ...t, index: a })), ms = (r, e) => ({ tr: t, commands: n }) => n.insertContentAt({ from: t.selection.from, to: t.selection.to }, r, e), ha = (r) => {
  const e = r.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const n = e[t];
    n.nodeType === 3 && n.nodeValue && /^(\n\s\s|\n)$/.test(n.nodeValue) ? r.removeChild(n) : n.nodeType === 1 && ha(n);
  }
  return r;
};
function ht(r) {
  const e = `<body>${r}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return ha(t);
}
function ot(r, e, t) {
  if (r instanceof ge || r instanceof w)
    return r;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const n = typeof r == "object" && r !== null, a = typeof r == "string";
  if (n)
    try {
      if (Array.isArray(r) && r.length > 0)
        return w.fromArray(r.map((s) => e.nodeFromJSON(s)));
      const i = e.nodeFromJSON(r);
      return t.errorOnInvalidContent && i.check(), i;
    } catch (o) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: o });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", r, "Error:", o), ot("", e, t);
    }
  if (a) {
    if (t.errorOnInvalidContent) {
      let i = !1, s = "";
      const c = new ai({
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
                getAttrs: (u) => (i = !0, s = typeof u == "string" ? u : u.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? Ce.fromSchema(c).parseSlice(ht(r), t.parseOptions) : Ce.fromSchema(c).parse(ht(r), t.parseOptions), t.errorOnInvalidContent && i)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${s}`) });
    }
    const o = Ce.fromSchema(e);
    return t.slice ? o.parseSlice(ht(r), t.parseOptions).content : o.parse(ht(r), t.parseOptions);
  }
  return ot("", e, t);
}
function fs(r, e, t) {
  const n = r.steps.length - 1;
  if (n < e)
    return;
  const a = r.steps[n];
  if (!(a instanceof q || a instanceof G))
    return;
  const o = r.mapping.maps[n];
  let i = 0;
  o.forEach((s, c, u, d) => {
    i === 0 && (i = d);
  }), r.setSelection(E.near(r.doc.resolve(i), t));
}
const gs = (r) => !("type" in r), bs = (r, e, t) => ({ tr: n, dispatch: a, editor: o }) => {
  var i;
  if (a) {
    t = {
      parseOptions: o.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let s;
    const c = (v) => {
      o.emit("contentError", {
        editor: o,
        error: v,
        disableCollaboration: () => {
          o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
        }
      });
    }, u = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError)
      try {
        ot(e, o.schema, {
          parseOptions: u,
          errorOnInvalidContent: !0
        });
      } catch (v) {
        c(v);
      }
    try {
      s = ot(e, o.schema, {
        parseOptions: u,
        errorOnInvalidContent: (i = t.errorOnInvalidContent) !== null && i !== void 0 ? i : o.options.enableContentCheck
      });
    } catch (v) {
      return c(v), !1;
    }
    let { from: d, to: h } = typeof r == "number" ? { from: r, to: r } : { from: r.from, to: r.to }, m = !0, f = !0;
    if ((gs(s) ? s : [s]).forEach((v) => {
      v.check(), m = m ? v.isText && v.marks.length === 0 : !1, f = f ? v.isBlock : !1;
    }), d === h && f) {
      const { parent: v } = n.doc.resolve(d);
      v.isTextblock && !v.type.spec.code && !v.childCount && (d -= 1, h += 1);
    }
    let g;
    if (m) {
      if (Array.isArray(e))
        g = e.map((v) => v.text || "").join("");
      else if (e instanceof w) {
        let v = "";
        e.forEach((x) => {
          x.text && (v += x.text);
        }), g = v;
      } else typeof e == "object" && e && e.text ? g = e.text : g = e;
      n.insertText(g, d, h);
    } else
      g = s, n.replaceWith(d, h, g);
    t.updateSelection && fs(n, n.steps.length - 1, -1), t.applyInputRules && n.setMeta("applyInputRules", { from: d, text: g }), t.applyPasteRules && n.setMeta("applyPasteRules", { from: d, text: g });
  }
  return !0;
}, vs = () => ({ state: r, dispatch: e }) => Ci(r, e), ys = () => ({ state: r, dispatch: e }) => Si(r, e), xs = () => ({ state: r, dispatch: e }) => Zn(r, e), ws = () => ({ state: r, dispatch: e }) => ta(r, e), ks = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = Ot(r.doc, r.selection.$from.pos, -1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Cs = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = Ot(r.doc, r.selection.$from.pos, 1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Ss = () => ({ state: r, dispatch: e }) => wi(r, e), Ns = () => ({ state: r, dispatch: e }) => ki(r, e);
function ma() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function As(r) {
  const e = r.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let n, a, o, i;
  for (let s = 0; s < e.length - 1; s += 1) {
    const c = e[s];
    if (/^(cmd|meta|m)$/i.test(c))
      i = !0;
    else if (/^a(lt)?$/i.test(c))
      n = !0;
    else if (/^(c|ctrl|control)$/i.test(c))
      a = !0;
    else if (/^s(hift)?$/i.test(c))
      o = !0;
    else if (/^mod$/i.test(c))
      at() || ma() ? i = !0 : a = !0;
    else
      throw new Error(`Unrecognized modifier name: ${c}`);
  }
  return n && (t = `Alt-${t}`), a && (t = `Ctrl-${t}`), i && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const Ts = (r) => ({ editor: e, view: t, tr: n, dispatch: a }) => {
  const o = As(r).split(/-(?!$)/), i = o.find((u) => !["Alt", "Ctrl", "Meta", "Shift"].includes(u)), s = new KeyboardEvent("keydown", {
    key: i === "Space" ? " " : i,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), c = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (u) => u(t, s));
  });
  return c == null || c.steps.forEach((u) => {
    const d = u.map(n.mapping);
    d && a && n.maybeStep(d);
  }), !0;
};
function pr(r, e, t = {}) {
  const { from: n, to: a, empty: o } = r.selection, i = e ? D(e, r.schema) : null, s = [];
  r.doc.nodesBetween(n, a, (h, m) => {
    if (h.isText)
      return;
    const f = Math.max(n, m), b = Math.min(a, m + h.nodeSize);
    s.push({
      node: h,
      from: f,
      to: b
    });
  });
  const c = a - n, u = s.filter((h) => i ? i.name === h.node.type.name : !0).filter((h) => Tt(h.node.attrs, t, { strict: !1 }));
  return o ? !!u.length : u.reduce((h, m) => h + m.to - m.from, 0) >= c;
}
const Es = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const a = D(r, t.schema);
  return pr(t, a, e) ? Ni(t, n) : !1;
}, Ls = () => ({ state: r, dispatch: e }) => oa(r, e), Ms = (r) => ({ state: e, dispatch: t }) => {
  const n = D(r, e.schema);
  return Bi(n)(e, t);
}, Is = () => ({ state: r, dispatch: e }) => na(r, e);
function fa(r, e) {
  return e.nodes[r] ? "node" : e.marks[r] ? "mark" : null;
}
function Kr(r, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(r).reduce((n, a) => (t.includes(a) || (n[a] = r[a]), n), {});
}
const Hs = (r, e) => ({ tr: t, state: n, dispatch: a }) => {
  let o = null, i = null;
  const s = fa(typeof r == "string" ? r : r.name, n.schema);
  return s ? (s === "node" && (o = D(r, n.schema)), s === "mark" && (i = le(r, n.schema)), a && t.selection.ranges.forEach((c) => {
    n.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      o && o === u.type && t.setNodeMarkup(d, void 0, Kr(u.attrs, e)), i && u.marks.length && u.marks.forEach((h) => {
        i === h.type && t.addMark(d, d + u.nodeSize, i.create(Kr(h.attrs, e)));
      });
    });
  }), !0) : !1;
}, Os = () => ({ tr: r, dispatch: e }) => (e && r.scrollIntoView(), !0), Ps = () => ({ tr: r, dispatch: e }) => {
  if (e) {
    const t = new K(r.doc);
    r.setSelection(t);
  }
  return !0;
}, Rs = () => ({ state: r, dispatch: e }) => Xn(r, e), zs = () => ({ state: r, dispatch: e }) => ra(r, e), Bs = () => ({ state: r, dispatch: e }) => Li(r, e), $s = () => ({ state: r, dispatch: e }) => Hi(r, e), Fs = () => ({ state: r, dispatch: e }) => Ii(r, e);
function Us(r, e, t = {}, n = {}) {
  return ot(r, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: n.errorOnInvalidContent
  });
}
const js = (r, e = !1, t = {}, n = {}) => ({ editor: a, tr: o, dispatch: i, commands: s }) => {
  var c, u;
  const { doc: d } = o;
  if (t.preserveWhitespace !== "full") {
    const h = Us(r, a.schema, t, {
      errorOnInvalidContent: (c = n.errorOnInvalidContent) !== null && c !== void 0 ? c : a.options.enableContentCheck
    });
    return i && o.replaceWith(0, d.content.size, h).setMeta("preventUpdate", !e), !0;
  }
  return i && o.setMeta("preventUpdate", !e), s.insertContentAt({ from: 0, to: d.content.size }, r, {
    parseOptions: t,
    errorOnInvalidContent: (u = n.errorOnInvalidContent) !== null && u !== void 0 ? u : a.options.enableContentCheck
  });
};
function Ds(r, e) {
  const t = le(e, r.schema), { from: n, to: a, empty: o } = r.selection, i = [];
  o ? (r.storedMarks && i.push(...r.storedMarks), i.push(...r.selection.$head.marks())) : r.doc.nodesBetween(n, a, (c) => {
    i.push(...c.marks);
  });
  const s = i.find((c) => c.type.name === t.name);
  return s ? { ...s.attrs } : {};
}
function Vs(r) {
  for (let e = 0; e < r.edgeCount; e += 1) {
    const { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function qs(r, e) {
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
function hr(r) {
  return (e) => qs(e.$from, r);
}
function ft(r, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => {
    const a = r.find((o) => o.type === e && o.name === n);
    return a ? a.attribute.keepOnSplit : !1;
  }));
}
function _s(r, e, t = {}) {
  const { empty: n, ranges: a } = r.selection, o = e ? le(e, r.schema) : null;
  if (n)
    return !!(r.storedMarks || r.selection.$from.marks()).filter((h) => o ? o.name === h.type.name : !0).find((h) => Tt(h.attrs, t, { strict: !1 }));
  let i = 0;
  const s = [];
  if (a.forEach(({ $from: h, $to: m }) => {
    const f = h.pos, b = m.pos;
    r.doc.nodesBetween(f, b, (g, v) => {
      if (!g.isText && !g.marks.length)
        return;
      const x = Math.max(f, v), S = Math.min(b, v + g.nodeSize), A = S - x;
      i += A, s.push(...g.marks.map((R) => ({
        mark: R,
        from: x,
        to: S
      })));
    });
  }), i === 0)
    return !1;
  const c = s.filter((h) => o ? o.name === h.mark.type.name : !0).filter((h) => Tt(h.mark.attrs, t, { strict: !1 })).reduce((h, m) => h + m.to - m.from, 0), u = s.filter((h) => o ? h.mark.type !== o && h.mark.type.excludes(o) : !0).reduce((h, m) => h + m.to - m.from, 0);
  return (c > 0 ? c + u : c) >= i;
}
function Yr(r, e) {
  const { nodeExtensions: t } = Di(e), n = t.find((i) => i.name === r);
  if (!n)
    return !1;
  const a = {
    name: n.name,
    options: n.options,
    storage: n.storage
  }, o = ae(Z(n, "group", a));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function ga(r, { checkChildren: e = !0, ignoreWhitespace: t = !1 } = {}) {
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
    let a = !0;
    return r.content.forEach((o) => {
      a !== !1 && (ga(o, { ignoreWhitespace: t, checkChildren: e }) || (a = !1));
    }), a;
  }
  return !1;
}
function Gs(r, e, t) {
  var n;
  const { selection: a } = e;
  let o = null;
  if (pa(a) && (o = a.$cursor), o) {
    const s = (n = r.storedMarks) !== null && n !== void 0 ? n : o.marks();
    return !!t.isInSet(s) || !s.some((c) => c.type.excludes(t));
  }
  const { ranges: i } = a;
  return i.some(({ $from: s, $to: c }) => {
    let u = s.depth === 0 ? r.doc.inlineContent && r.doc.type.allowsMarkType(t) : !1;
    return r.doc.nodesBetween(s.pos, c.pos, (d, h, m) => {
      if (u)
        return !1;
      if (d.isInline) {
        const f = !m || m.type.allowsMarkType(t), b = !!t.isInSet(d.marks) || !d.marks.some((g) => g.type.excludes(t));
        u = f && b;
      }
      return !u;
    }), u;
  });
}
const Js = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  const { selection: o } = t, { empty: i, ranges: s } = o, c = le(r, n.schema);
  if (a)
    if (i) {
      const u = Ds(n, c);
      t.addStoredMark(c.create({
        ...u,
        ...e
      }));
    } else
      s.forEach((u) => {
        const d = u.$from.pos, h = u.$to.pos;
        n.doc.nodesBetween(d, h, (m, f) => {
          const b = Math.max(f, d), g = Math.min(f + m.nodeSize, h);
          m.marks.find((x) => x.type === c) ? m.marks.forEach((x) => {
            c === x.type && t.addMark(b, g, c.create({
              ...x.attrs,
              ...e
            }));
          }) : t.addMark(b, g, c.create(e));
        });
      });
  return Gs(n, t, c);
}, Ws = (r, e) => ({ tr: t }) => (t.setMeta(r, e), !0), Ks = (r, e = {}) => ({ state: t, dispatch: n, chain: a }) => {
  const o = D(r, t.schema);
  let i;
  return t.selection.$anchor.sameParent(t.selection.$head) && (i = t.selection.$anchor.parent.attrs), o.isTextblock ? a().command(({ commands: s }) => Jr(o, { ...i, ...e })(t) ? !0 : s.clearNodes()).command(({ state: s }) => Jr(o, { ...i, ...e })(s, n)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Ys = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, a = he(r, 0, n.content.size), o = L.create(n, a);
    e.setSelection(o);
  }
  return !0;
}, Zs = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, { from: a, to: o } = typeof r == "number" ? { from: r, to: r } : r, i = P.atStart(n).from, s = P.atEnd(n).to, c = he(a, i, s), u = he(o, i, s), d = P.create(n, c, u);
    e.setSelection(d);
  }
  return !0;
}, Qs = (r) => ({ state: e, dispatch: t }) => {
  const n = D(r, e.schema);
  return Ui(n)(e, t);
};
function Zr(r, e) {
  const t = r.storedMarks || r.selection.$to.parentOffset && r.selection.$from.marks();
  if (t) {
    const n = t.filter((a) => e == null ? void 0 : e.includes(a.type.name));
    r.tr.ensureMarks(n);
  }
}
const Xs = ({ keepMarks: r = !0 } = {}) => ({ tr: e, state: t, dispatch: n, editor: a }) => {
  const { selection: o, doc: i } = e, { $from: s, $to: c } = o, u = a.extensionManager.attributes, d = ft(u, s.node().type.name, s.node().attrs);
  if (o instanceof L && o.node.isBlock)
    return !s.parentOffset || !oe(i, s.pos) ? !1 : (n && (r && Zr(t, a.extensionManager.splittableMarks), e.split(s.pos).scrollIntoView()), !0);
  if (!s.parent.isBlock)
    return !1;
  const h = c.parentOffset === c.parent.content.size, m = s.depth === 0 ? void 0 : Vs(s.node(-1).contentMatchAt(s.indexAfter(-1)));
  let f = h && m ? [
    {
      type: m,
      attrs: d
    }
  ] : void 0, b = oe(e.doc, e.mapping.map(s.pos), 1, f);
  if (!f && !b && oe(e.doc, e.mapping.map(s.pos), 1, m ? [{ type: m }] : void 0) && (b = !0, f = m ? [
    {
      type: m,
      attrs: d
    }
  ] : void 0), n) {
    if (b && (o instanceof P && e.deleteSelection(), e.split(e.mapping.map(s.pos), 1, f), m && !h && !s.parentOffset && s.parent.type !== m)) {
      const g = e.mapping.map(s.before()), v = e.doc.resolve(g);
      s.node(-1).canReplaceWith(v.index(), v.index() + 1, m) && e.setNodeMarkup(e.mapping.map(s.before()), m);
    }
    r && Zr(t, a.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return b;
}, el = (r, e = {}) => ({ tr: t, state: n, dispatch: a, editor: o }) => {
  var i;
  const s = D(r, n.schema), { $from: c, $to: u } = n.selection, d = n.selection.node;
  if (d && d.isBlock || c.depth < 2 || !c.sameParent(u))
    return !1;
  const h = c.node(-1);
  if (h.type !== s)
    return !1;
  const m = o.extensionManager.attributes;
  if (c.parent.content.size === 0 && c.node(-1).childCount === c.indexAfter(-1)) {
    if (c.depth === 2 || c.node(-3).type !== s || c.index(-2) !== c.node(-2).childCount - 1)
      return !1;
    if (a) {
      let x = w.empty;
      const S = c.index(-1) ? 1 : c.index(-2) ? 2 : 3;
      for (let _ = c.depth - S; _ >= c.depth - 3; _ -= 1)
        x = w.from(c.node(_).copy(x));
      const A = c.indexAfter(-1) < c.node(-2).childCount ? 1 : c.indexAfter(-2) < c.node(-3).childCount ? 2 : 3, R = {
        ...ft(m, c.node().type.name, c.node().attrs),
        ...e
      }, O = ((i = s.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(R)) || void 0;
      x = x.append(w.from(s.createAndFill(null, O) || void 0));
      const M = c.before(c.depth - (S - 1));
      t.replace(M, c.after(-A), new C(x, 4 - S, 0));
      let z = -1;
      t.doc.nodesBetween(M, t.doc.content.size, (_, it) => {
        if (z > -1)
          return !1;
        _.isTextblock && _.content.size === 0 && (z = it + 1);
      }), z > -1 && t.setSelection(P.near(t.doc.resolve(z))), t.scrollIntoView();
    }
    return !0;
  }
  const f = u.pos === c.end() ? h.contentMatchAt(0).defaultType : null, b = {
    ...ft(m, h.type.name, h.attrs),
    ...e
  }, g = {
    ...ft(m, c.node().type.name, c.node().attrs),
    ...e
  };
  t.delete(c.pos, u.pos);
  const v = f ? [
    { type: s, attrs: b },
    { type: f, attrs: g }
  ] : [{ type: s, attrs: b }];
  if (!oe(t.doc, c.pos, 2))
    return !1;
  if (a) {
    const { selection: x, storedMarks: S } = n, { splittableMarks: A } = o.extensionManager, R = S || x.$to.parentOffset && x.$from.marks();
    if (t.split(c.pos, 2, v).scrollIntoView(), !R || !a)
      return !0;
    const O = R.filter((M) => A.includes(M.type.name));
    t.ensureMarks(O);
  }
  return !0;
}, jt = (r, e) => {
  const t = hr((i) => i.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (n === void 0)
    return !0;
  const a = r.doc.nodeAt(n);
  return t.node.type === (a == null ? void 0 : a.type) && ye(r.doc, t.pos) && r.join(t.pos), !0;
}, Dt = (r, e) => {
  const t = hr((i) => i.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(t.start).after(t.depth);
  if (n === void 0)
    return !0;
  const a = r.doc.nodeAt(n);
  return t.node.type === (a == null ? void 0 : a.type) && ye(r.doc, n) && r.join(n), !0;
}, tl = (r, e, t, n = {}) => ({ editor: a, tr: o, state: i, dispatch: s, chain: c, commands: u, can: d }) => {
  const { extensions: h, splittableMarks: m } = a.extensionManager, f = D(r, i.schema), b = D(e, i.schema), { selection: g, storedMarks: v } = i, { $from: x, $to: S } = g, A = x.blockRange(S), R = v || g.$to.parentOffset && g.$from.marks();
  if (!A)
    return !1;
  const O = hr((M) => Yr(M.type.name, h))(g);
  if (A.depth >= 1 && O && A.depth - O.depth <= 1) {
    if (O.node.type === f)
      return u.liftListItem(b);
    if (Yr(O.node.type.name, h) && f.validContent(O.node.content) && s)
      return c().command(() => (o.setNodeMarkup(O.pos, f), !0)).command(() => jt(o, f)).command(() => Dt(o, f)).run();
  }
  return !t || !R || !s ? c().command(() => d().wrapInList(f, n) ? !0 : u.clearNodes()).wrapInList(f, n).command(() => jt(o, f)).command(() => Dt(o, f)).run() : c().command(() => {
    const M = d().wrapInList(f, n), z = R.filter((_) => m.includes(_.type.name));
    return o.ensureMarks(z), M ? !0 : u.clearNodes();
  }).wrapInList(f, n).command(() => jt(o, f)).command(() => Dt(o, f)).run();
}, rl = (r, e = {}, t = {}) => ({ state: n, commands: a }) => {
  const { extendEmptyMarkRange: o = !1 } = t, i = le(r, n.schema);
  return _s(n, i, e) ? a.unsetMark(i, { extendEmptyMarkRange: o }) : a.setMark(i, e);
}, nl = (r, e, t = {}) => ({ state: n, commands: a }) => {
  const o = D(r, n.schema), i = D(e, n.schema), s = pr(n, o, t);
  let c;
  return n.selection.$anchor.sameParent(n.selection.$head) && (c = n.selection.$anchor.parent.attrs), s ? a.setNode(i, c) : a.setNode(o, { ...c, ...t });
}, al = (r, e = {}) => ({ state: t, commands: n }) => {
  const a = D(r, t.schema);
  return pr(t, a, e) ? n.lift(a) : n.wrapIn(a, e);
}, ol = () => ({ state: r, dispatch: e }) => {
  const t = r.plugins;
  for (let n = 0; n < t.length; n += 1) {
    const a = t[n];
    let o;
    if (a.spec.isInputRules && (o = a.getState(r))) {
      if (e) {
        const i = r.tr, s = o.transform;
        for (let c = s.steps.length - 1; c >= 0; c -= 1)
          i.step(s.steps[c].invert(s.docs[c]));
        if (o.text) {
          const c = i.doc.resolve(o.from).marks();
          i.replaceWith(o.from, o.to, r.schema.text(o.text, c));
        } else
          i.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, il = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, { empty: n, ranges: a } = t;
  return n || e && a.forEach((o) => {
    r.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, sl = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  var o;
  const { extendEmptyMarkRange: i = !1 } = e, { selection: s } = t, c = le(r, n.schema), { $from: u, empty: d, ranges: h } = s;
  if (!a)
    return !0;
  if (d && i) {
    let { from: m, to: f } = s;
    const b = (o = u.marks().find((v) => v.type === c)) === null || o === void 0 ? void 0 : o.attrs, g = ua(u, c, b);
    g && (m = g.from, f = g.to), t.removeMark(m, f, c);
  } else
    h.forEach((m) => {
      t.removeMark(m.$from.pos, m.$to.pos, c);
    });
  return t.removeStoredMark(c), !0;
}, ll = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  let o = null, i = null;
  const s = fa(typeof r == "string" ? r : r.name, n.schema);
  return s ? (s === "node" && (o = D(r, n.schema)), s === "mark" && (i = le(r, n.schema)), a && t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let h, m, f, b;
    t.selection.empty ? n.doc.nodesBetween(u, d, (g, v) => {
      o && o === g.type && (f = Math.max(v, u), b = Math.min(v + g.nodeSize, d), h = v, m = g);
    }) : n.doc.nodesBetween(u, d, (g, v) => {
      v < u && o && o === g.type && (f = Math.max(v, u), b = Math.min(v + g.nodeSize, d), h = v, m = g), v >= u && v <= d && (o && o === g.type && t.setNodeMarkup(v, void 0, {
        ...g.attrs,
        ...e
      }), i && g.marks.length && g.marks.forEach((x) => {
        if (i === x.type) {
          const S = Math.max(v, u), A = Math.min(v + g.nodeSize, d);
          t.addMark(S, A, i.create({
            ...x.attrs,
            ...e
          }));
        }
      }));
    }), m && (h !== void 0 && t.setNodeMarkup(h, void 0, {
      ...m.attrs,
      ...e
    }), i && m.marks.length && m.marks.forEach((g) => {
      i === g.type && t.addMark(f, b, i.create({
        ...g.attrs,
        ...e
      }));
    }));
  }), !0) : !1;
}, cl = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const a = D(r, t.schema);
  return Oi(a, e)(t, n);
}, dl = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const a = D(r, t.schema);
  return Pi(a, e)(t, n);
};
var ul = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Ki,
  clearContent: Yi,
  clearNodes: Zi,
  command: Qi,
  createParagraphNear: Xi,
  cut: es,
  deleteCurrentNode: ts,
  deleteNode: rs,
  deleteRange: ns,
  deleteSelection: as,
  enter: is,
  exitCode: ss,
  extendMarkRange: ls,
  first: cs,
  focus: ps,
  forEach: hs,
  insertContent: ms,
  insertContentAt: bs,
  joinBackward: xs,
  joinDown: ys,
  joinForward: ws,
  joinItemBackward: ks,
  joinItemForward: Cs,
  joinTextblockBackward: Ss,
  joinTextblockForward: Ns,
  joinUp: vs,
  keyboardShortcut: Ts,
  lift: Es,
  liftEmptyBlock: Ls,
  liftListItem: Ms,
  newlineInCode: Is,
  resetAttributes: Hs,
  scrollIntoView: Os,
  selectAll: Ps,
  selectNodeBackward: Rs,
  selectNodeForward: zs,
  selectParentNode: Bs,
  selectTextblockEnd: $s,
  selectTextblockStart: Fs,
  setContent: js,
  setMark: Js,
  setMeta: Ws,
  setNode: Ks,
  setNodeSelection: Ys,
  setTextSelection: Zs,
  sinkListItem: Qs,
  splitBlock: Xs,
  splitListItem: el,
  toggleList: tl,
  toggleMark: rl,
  toggleNode: nl,
  toggleWrap: al,
  undoInputRule: ol,
  unsetAllMarks: il,
  unsetMark: sl,
  updateAttributes: ll,
  wrapIn: cl,
  wrapInList: dl
});
X.create({
  name: "commands",
  addCommands() {
    return {
      ...ul
    };
  }
});
X.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new xe({
        key: new we("tiptapDrop"),
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
X.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new xe({
        key: new we("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const pl = new we("focusEvents");
X.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: r } = this;
    return [
      new xe({
        key: pl,
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
X.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const r = () => this.editor.commands.first(({ commands: i }) => [
      () => i.undoInputRule(),
      // maybe convert first text block node to default node
      () => i.command(({ tr: s }) => {
        const { selection: c, doc: u } = s, { empty: d, $anchor: h } = c, { pos: m, parent: f } = h, b = h.parent.isTextblock && m > 0 ? s.doc.resolve(m - 1) : h, g = b.parent.type.spec.isolating, v = h.pos - h.parentOffset, x = g && b.parent.childCount === 1 ? v === h.pos : E.atStart(u).from === m;
        return !d || !f.type.isTextblock || f.textContent.length || !x || x && h.parent.type.name === "paragraph" ? !1 : i.clearNodes();
      }),
      () => i.deleteSelection(),
      () => i.joinBackward(),
      () => i.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: i }) => [
      () => i.deleteSelection(),
      () => i.deleteCurrentNode(),
      () => i.joinForward(),
      () => i.selectNodeForward()
    ]), n = {
      Enter: () => this.editor.commands.first(({ commands: i }) => [
        () => i.newlineInCode(),
        () => i.createParagraphNear(),
        () => i.liftEmptyBlock(),
        () => i.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: r,
      "Mod-Backspace": r,
      "Shift-Backspace": r,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, a = {
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
    return at() || ma() ? o : a;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new xe({
        key: new we("clearDocument"),
        appendTransaction: (r, e, t) => {
          if (r.some((g) => g.getMeta("composition")))
            return;
          const n = r.some((g) => g.docChanged) && !e.doc.eq(t.doc), a = r.some((g) => g.getMeta("preventClearDocument"));
          if (!n || a)
            return;
          const { empty: o, from: i, to: s } = e.selection, c = E.atStart(e.doc).from, u = E.atEnd(e.doc).to;
          if (o || !(i === c && s === u) || !ga(t.doc))
            return;
          const m = t.tr, f = la({
            state: t,
            transaction: m
          }), { commands: b } = new ji({
            editor: this.editor,
            state: f
          });
          if (b.clearNodes(), !!m.steps.length)
            return m;
        }
      })
    ];
  }
});
X.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new xe({
        key: new we("tiptapPaste"),
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
X.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new xe({
        key: new we("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class Et {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = ae(Z(this, "addOptions", {
      name: this.name
    }))), this.storage = ae(Z(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Et(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => ur(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new Et(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = ae(Z(t, "addOptions", {
      name: t.name
    })), t.storage = ae(Z(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
let hl = class {
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
    var t, n, a, o, i, s, c;
    const { view: u } = this.editor, d = e.target, h = d.nodeType === 3 ? (t = d.parentElement) === null || t === void 0 ? void 0 : t.closest("[data-drag-handle]") : d.closest("[data-drag-handle]");
    if (!this.dom || !((n = this.contentDOM) === null || n === void 0) && n.contains(d) || !h)
      return;
    let m = 0, f = 0;
    if (this.dom !== h) {
      const S = this.dom.getBoundingClientRect(), A = h.getBoundingClientRect(), R = (a = e.offsetX) !== null && a !== void 0 ? a : (o = e.nativeEvent) === null || o === void 0 ? void 0 : o.offsetX, O = (i = e.offsetY) !== null && i !== void 0 ? i : (s = e.nativeEvent) === null || s === void 0 ? void 0 : s.offsetY;
      m = A.x - S.x + R, f = A.y - S.y + O;
    }
    const b = this.dom.cloneNode(!0);
    (c = e.dataTransfer) === null || c === void 0 || c.setDragImage(b, m, f);
    const g = this.getPos();
    if (typeof g != "number")
      return;
    const v = L.create(u.state.doc, g), x = u.state.tr.setSelection(v);
    u.dispatch(x);
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
    const o = e.type.startsWith("drag"), i = e.type === "drop";
    if ((["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(n.tagName) || n.isContentEditable) && !i && !o)
      return !0;
    const { isEditable: c } = this.editor, { isDragging: u } = this, d = !!this.node.type.spec.draggable, h = L.isSelectable(this.node), m = e.type === "copy", f = e.type === "paste", b = e.type === "cut", g = e.type === "mousedown";
    if (!d && h && o && e.target === this.dom && e.preventDefault(), d && o && !u && e.target === this.dom)
      return e.preventDefault(), !1;
    if (d && c && !u && g) {
      const v = n.closest("[data-drag-handle]");
      v && (this.dom === v || this.dom.contains(v)) && (this.isDragging = !0, document.addEventListener("dragend", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("drop", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("mouseup", () => {
        this.isDragging = !1;
      }, { once: !0 }));
    }
    return !(u || i || m || f || b || g && h);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(e) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.dom.contains(e.target) && e.type === "childList" && (at() || Zt()) && this.editor.isFocused && [
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
var ba = { exports: {} }, Vt = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qr;
function ml() {
  if (Qr) return Vt;
  Qr = 1;
  var r = j;
  function e(h, m) {
    return h === m && (h !== 0 || 1 / h === 1 / m) || h !== h && m !== m;
  }
  var t = typeof Object.is == "function" ? Object.is : e, n = r.useState, a = r.useEffect, o = r.useLayoutEffect, i = r.useDebugValue;
  function s(h, m) {
    var f = m(), b = n({ inst: { value: f, getSnapshot: m } }), g = b[0].inst, v = b[1];
    return o(function() {
      g.value = f, g.getSnapshot = m, c(g) && v({ inst: g });
    }, [h, f, m]), a(function() {
      return c(g) && v({ inst: g }), h(function() {
        c(g) && v({ inst: g });
      });
    }, [h]), i(f), f;
  }
  function c(h) {
    var m = h.getSnapshot;
    h = h.value;
    try {
      var f = m();
      return !t(h, f);
    } catch {
      return !0;
    }
  }
  function u(h, m) {
    return m();
  }
  var d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? u : s;
  return Vt.useSyncExternalStore = r.useSyncExternalStore !== void 0 ? r.useSyncExternalStore : d, Vt;
}
ba.exports = ml();
var va = ba.exports;
const fl = (...r) => (e) => {
  r.forEach((t) => {
    typeof t == "function" ? t(e) : t && (t.current = e);
  });
}, gl = ({ contentComponent: r }) => {
  const e = va.useSyncExternalStore(r.subscribe, r.getSnapshot, r.getServerSnapshot);
  return j.createElement(j.Fragment, null, Object.values(e));
};
function bl() {
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
        [t]: Da.createPortal(n.reactElement, n.element, t)
      }, r.forEach((a) => a());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(t) {
      const n = { ...e };
      delete n[t], e = n, r.forEach((a) => a());
    }
  };
}
class vl extends j.Component {
  constructor(e) {
    var t;
    super(e), this.editorContentRef = j.createRef(), this.initialized = !1, this.state = {
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
      }), e.contentComponent = bl(), this.state.hasContentComponentInitialized || (this.unsubscribeToContentComponent = e.contentComponent.subscribe(() => {
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
    return j.createElement(
      j.Fragment,
      null,
      j.createElement("div", { ref: fl(t, this.editorContentRef), ...n }),
      (e == null ? void 0 : e.contentComponent) && j.createElement(gl, { contentComponent: e.contentComponent })
    );
  }
}
const yl = Xt((r, e) => {
  const t = j.useMemo(() => Math.floor(Math.random() * 4294967295).toString(), [r.editor]);
  return j.createElement(vl, {
    key: t,
    innerRef: e,
    ...r
  });
});
j.memo(yl);
var qt = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xr;
function xl() {
  if (Xr) return qt;
  Xr = 1;
  var r = j, e = va;
  function t(u, d) {
    return u === d && (u !== 0 || 1 / u === 1 / d) || u !== u && d !== d;
  }
  var n = typeof Object.is == "function" ? Object.is : t, a = e.useSyncExternalStore, o = r.useRef, i = r.useEffect, s = r.useMemo, c = r.useDebugValue;
  return qt.useSyncExternalStoreWithSelector = function(u, d, h, m, f) {
    var b = o(null);
    if (b.current === null) {
      var g = { hasValue: !1, value: null };
      b.current = g;
    } else g = b.current;
    b = s(function() {
      function x(M) {
        if (!S) {
          if (S = !0, A = M, M = m(M), f !== void 0 && g.hasValue) {
            var z = g.value;
            if (f(z, M)) return R = z;
          }
          return R = M;
        }
        if (z = R, n(A, M)) return z;
        var _ = m(M);
        return f !== void 0 && f(z, _) ? z : (A = M, R = _);
      }
      var S = !1, A, R, O = h === void 0 ? null : h;
      return [function() {
        return x(d());
      }, O === null ? void 0 : function() {
        return x(O());
      }];
    }, [d, h, m, f]);
    var v = a(u, b[0], b[1]);
    return i(function() {
      g.hasValue = !0, g.value = v;
    }, [v]), c(v), v;
  }, qt;
}
xl();
const wl = on({
  editor: null
});
wl.Consumer;
const ya = on({
  onDragStart: void 0
}), kl = () => ja(ya), te = j.forwardRef((r, e) => {
  const { onDragStart: t } = kl(), n = r.as || "div";
  return (
    // @ts-ignore
    j.createElement(n, { ...r, ref: e, "data-node-view-wrapper": "", onDragStart: t, style: {
      whiteSpace: "normal",
      ...r.style
    } })
  );
});
function en(r) {
  return !!(typeof r == "function" && r.prototype && r.prototype.isReactComponent);
}
function tn(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.forward_ref)" || r.$$typeof.description === "react.forward_ref"));
}
function Cl(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.memo)" || r.$$typeof.description === "react.memo"));
}
function Sl(r) {
  if (en(r) || tn(r))
    return !0;
  if (Cl(r)) {
    const e = r.type;
    if (e)
      return en(e) || tn(e);
  }
  return !1;
}
function Nl() {
  try {
    if (Ar)
      return parseInt(Ar.split(".")[0], 10) >= 19;
  } catch {
  }
  return !1;
}
class Al {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(e, { editor: t, props: n = {}, as: a = "div", className: o = "" }) {
    this.ref = null, this.id = Math.floor(Math.random() * 4294967295).toString(), this.component = e, this.editor = t, this.props = n, this.element = document.createElement(a), this.element.classList.add("react-renderer"), o && this.element.classList.add(...o.split(" ")), this.editor.isInitialized ? Va(() => {
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
    const t = this.component, n = this.props, a = this.editor, o = Nl(), i = Sl(t), s = { ...n };
    s.ref && !(o || i) && delete s.ref, !s.ref && (o || i) && (s.ref = (c) => {
      this.ref = c;
    }), this.reactElement = j.createElement(t, { ...s }), (e = a == null ? void 0 : a.contentComponent) === null || e === void 0 || e.setRenderer(this.id, this);
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
class Tl extends hl {
  constructor(e, t, n) {
    if (super(e, t, n), !this.node.isLeaf) {
      this.options.contentDOMElementTag ? this.contentDOMElement = document.createElement(this.options.contentDOMElementTag) : this.contentDOMElement = document.createElement(this.node.isInline ? "span" : "div"), this.contentDOMElement.dataset.nodeViewContentReact = "", this.contentDOMElement.dataset.nodeViewWrapper = "", this.contentDOMElement.style.whiteSpace = "inherit";
      const a = this.dom.querySelector("[data-node-view-content]");
      if (!a)
        return;
      a.appendChild(this.contentDOMElement);
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
      updateAttributes: (u = {}) => this.updateAttributes(u),
      deleteNode: () => this.deleteNode(),
      ref: Fa()
    };
    if (!this.component.displayName) {
      const u = (d) => d.charAt(0).toUpperCase() + d.substring(1);
      this.component.displayName = u(this.extension.name);
    }
    const a = { onDragStart: this.onDragStart.bind(this), nodeViewContentRef: (u) => {
      u && this.contentDOMElement && u.firstChild !== this.contentDOMElement && (u.hasAttribute("data-node-view-wrapper") && u.removeAttribute("data-node-view-wrapper"), u.appendChild(this.contentDOMElement));
    } }, o = this.component, i = Ua((u) => j.createElement(ya.Provider, { value: a }, vt(o, u)));
    i.displayName = "ReactNodeView";
    let s = this.node.isInline ? "span" : "div";
    this.options.as && (s = this.options.as);
    const { className: c = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.renderer = new Al(i, {
      editor: this.editor,
      props: e,
      as: s,
      className: `node-${this.node.type.name} ${c}`.trim()
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
    const a = (o) => {
      this.renderer.updateProps(o), typeof this.options.attrs == "function" && this.updateElementAttributes();
    };
    if (e.type !== this.node.type)
      return !1;
    if (typeof this.options.update == "function") {
      const o = this.node, i = this.decorations, s = this.innerDecorations;
      return this.node = e, this.decorations = t, this.innerDecorations = n, this.options.update({
        oldNode: o,
        oldDecorations: i,
        newNode: e,
        newDecorations: t,
        oldInnerDecorations: s,
        innerDecorations: n,
        updateProps: () => a({ node: e, decorations: t, innerDecorations: n })
      });
    }
    return e === this.node && this.decorations === t && this.innerDecorations === n || (this.node = e, this.decorations = t, this.innerDecorations = n, a({ node: e, decorations: t, innerDecorations: n })), !0;
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
        const t = this.editor.extensionManager.attributes, n = Vi(this.node, t);
        e = this.options.attrs({ node: this.node, HTMLAttributes: n });
      } else
        e = this.options.attrs;
      this.renderer.updateAttributes(e);
    }
  }
}
function El(r, e) {
  return (t) => t.editor.contentComponent ? new Tl(r, t, e) : {};
}
function re({
  subId: r,
  defaultAttrs: e,
  view: t
}) {
  const n = `${Ja}/${r}`, a = sn(r.replace(/-([a-z])/g, (o, i) => i.toUpperCase()));
  return Et.create({
    name: a,
    group: "block",
    atom: !0,
    selectable: !0,
    draggable: !0,
    addAttributes() {
      return {
        attrs: {
          default: e,
          parseHTML: (o) => Y(o.getAttribute("data-attrs") ?? "", e),
          renderHTML: (o) => ({
            "data-attrs": Wa(o.attrs ?? e)
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
        ca(o, { "data-cms-block": n })
      ];
    },
    addNodeView() {
      return El((o) => {
        const i = o.node.attrs.attrs ?? e;
        return /* @__PURE__ */ l(t, { attrs: i, updateAttrs: (c) => {
          o.updateAttributes({ attrs: { ...i, ...c } });
        }, selected: o.selected });
      });
    }
  });
}
function ne(r) {
  return sn(r.replace(/-([a-z])/g, (e, t) => t.toUpperCase()));
}
const mr = "hero-overlay", De = ne(mr), Lt = {
  imageUrl: "",
  imageAlt: "",
  eyebrow: "",
  title: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: ""
};
function Ll({ attrs: r, selected: e }) {
  const { t } = H("theme-corporate");
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(Xe, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.heroOverlay.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.heroOverlay.untitled") })
        ] })
      ] })
    }
  );
}
function Ml({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(De), n = { ...Lt, ...t.attrs ?? {} };
  function a(o) {
    r.chain().updateAttributes(De, { attrs: { ...n, ...o } }).run();
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.imageUrl") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "url",
          className: "input",
          placeholder: "https://…",
          value: n.imageUrl ?? "",
          onChange: (o) => a({ imageUrl: o.target.value })
        }
      ),
      /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.heroOverlay.imageUrlHelp") })
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.imageAlt") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.imageAlt ?? "",
          onChange: (o) => a({ imageAlt: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.eyebrow") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.eyebrow ?? "",
          onChange: (o) => a({ eyebrow: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (o) => a({ title: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 3,
          value: n.subtitle ?? "",
          onChange: (o) => a({ subtitle: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.primaryCtaLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.primaryCtaLabel ?? "",
            onChange: (o) => a({ primaryCtaLabel: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.primaryCtaHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            placeholder: "/contact.html",
            value: n.primaryCtaHref ?? "",
            onChange: (o) => a({ primaryCtaHref: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.secondaryCtaLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.secondaryCtaLabel ?? "",
            onChange: (o) => a({ secondaryCtaLabel: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.secondaryCtaHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.secondaryCtaHref ?? "",
            onChange: (o) => a({ secondaryCtaHref: o.target.value })
          }
        )
      ] })
    ] })
  ] });
}
const Il = re({
  subId: mr,
  defaultAttrs: Lt,
  view: Ll
}), Hl = {
  id: `corporate/${mr}`,
  nodeName: De,
  titleKey: "blocks.heroOverlay.title",
  namespace: "theme-corporate",
  icon: Xe,
  category: "layout",
  extensions: [Il],
  // Insert with a media-picker prompt when one is wired (the post
  // editor provides it). The user can still skip and paste a URL by
  // hand from the inspector.
  insert: async (r, e) => {
    const t = e.pickMedia ? await e.pickMedia() : null;
    r.focus().insertContent({
      type: De,
      attrs: {
        attrs: t ? { ...Lt, imageUrl: t.url, imageAlt: t.alt ?? "" } : Lt
      }
    }).run();
  },
  isActive: (r) => r.isActive(De),
  inspector: (r) => /* @__PURE__ */ l(Ml, { editor: r.editor })
}, fr = "hero-split", Ve = ne(fr), Mt = {
  eyebrow: "",
  title: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  imageUrl: "",
  imageAlt: ""
};
function Ol({ attrs: r, selected: e }) {
  const { t } = H("theme-corporate");
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(bn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.heroSplit.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.heroSplit.untitled") })
        ] })
      ] })
    }
  );
}
function Pl({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(Ve), n = { ...Mt, ...t.attrs ?? {} };
  function a(o) {
    r.chain().updateAttributes(Ve, { attrs: { ...n, ...o } }).run();
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroSplit.eyebrow") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.eyebrow ?? "",
          onChange: (o) => a({ eyebrow: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroSplit.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (o) => a({ title: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroSplit.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 3,
          value: n.subtitle ?? "",
          onChange: (o) => a({ subtitle: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.primaryCtaLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.primaryCtaLabel ?? "",
            onChange: (o) => a({ primaryCtaLabel: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.primaryCtaHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.primaryCtaHref ?? "",
            onChange: (o) => a({ primaryCtaHref: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.secondaryCtaLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.secondaryCtaLabel ?? "",
            onChange: (o) => a({ secondaryCtaLabel: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.secondaryCtaHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.secondaryCtaHref ?? "",
            onChange: (o) => a({ secondaryCtaHref: o.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroSplit.decorImageUrl") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "url",
          className: "input",
          placeholder: "https://…",
          value: n.imageUrl ?? "",
          onChange: (o) => a({ imageUrl: o.target.value })
        }
      ),
      /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.heroSplit.decorImageHelp") })
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.imageAlt") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.imageAlt ?? "",
          onChange: (o) => a({ imageAlt: o.target.value })
        }
      )
    ] })
  ] });
}
const Rl = re({
  subId: fr,
  defaultAttrs: Mt,
  view: Ol
}), zl = {
  id: `corporate/${fr}`,
  nodeName: Ve,
  titleKey: "blocks.heroSplit.title",
  namespace: "theme-corporate",
  icon: bn,
  category: "layout",
  extensions: [Rl],
  insert: async (r, e) => {
    const t = e.pickMedia ? await e.pickMedia() : null;
    r.focus().insertContent({
      type: Ve,
      attrs: {
        attrs: t ? { ...Mt, imageUrl: t.url, imageAlt: t.alt ?? "" } : Mt
      }
    }).run();
  },
  isActive: (r) => r.isActive(Ve),
  inspector: (r) => /* @__PURE__ */ l(Pl, { editor: r.editor })
}, gr = "services-grid", qe = ne(gr), gt = {
  icon: "auto_awesome",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  accent: !1
}, xa = {
  eyebrow: "",
  title: "",
  subtitle: "",
  // Seed with 3 empty cards mirroring the mockup's bento layout. The
  // middle card carries the accent flag by convention; users can flip
  // it on any other card if they want a different rhythm.
  services: [
    { ...gt },
    { ...gt, accent: !0 },
    { ...gt }
  ]
};
function Bl({ attrs: r, selected: e }) {
  var a;
  const { t } = H("theme-corporate"), n = ((a = r.services) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(fn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.servicesGrid.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.servicesGrid.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function $l({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(qe), n = { ...xa, ...t.attrs ?? {} }, a = n.services ?? [];
  function o(d) {
    r.chain().updateAttributes(qe, { attrs: { ...n, ...d } }).run();
  }
  function i(d, h) {
    const m = a.map((f, b) => b === d ? { ...f, ...h } : f);
    o({ services: m });
  }
  function s() {
    o({ services: [...a, { ...gt }] });
  }
  function c(d) {
    o({ services: a.filter((h, m) => m !== d) });
  }
  function u(d, h) {
    const m = d + h;
    if (m < 0 || m >= a.length) return;
    const f = [...a];
    [f[d], f[m]] = [f[m], f[d]], o({ services: f });
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.servicesGrid.eyebrow") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.eyebrow ?? "",
          onChange: (d) => o({ eyebrow: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.servicesGrid.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (d) => o({ title: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.servicesGrid.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.subtitle ?? "",
          onChange: (d) => o({ subtitle: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700", children: [
      /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.servicesGrid.servicesHeading") }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "btn-ghost btn-sm flex items-center gap-1",
            onClick: s,
            children: [
              /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
              e("blocks.servicesGrid.addService")
            ]
          }
        )
      ] }),
      a.map((d, h) => /* @__PURE__ */ p(
        "div",
        {
          className: "rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800",
          children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ l("p", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: e("blocks.servicesGrid.serviceIndex", { index: h + 1 }) }),
              /* @__PURE__ */ p("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, -1),
                    disabled: h === 0,
                    title: e("blocks.servicesGrid.moveUp"),
                    children: /* @__PURE__ */ l(Ie, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, 1),
                    disabled: h === a.length - 1,
                    title: e("blocks.servicesGrid.moveDown"),
                    children: /* @__PURE__ */ l(Me, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon text-red-600",
                    onClick: () => c(h),
                    title: e("blocks.servicesGrid.removeService"),
                    children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.servicesGrid.icon") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    placeholder: "analytics",
                    value: d.icon ?? "",
                    onChange: (m) => i(h, { icon: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "flex items-end", children: /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-xs text-surface-700 dark:text-surface-200", children: [
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "checkbox",
                    checked: !!d.accent,
                    onChange: (m) => i(h, { accent: m.target.checked })
                  }
                ),
                e("blocks.servicesGrid.accent")
              ] }) })
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.servicesGrid.serviceTitle") }),
              /* @__PURE__ */ l(
                "input",
                {
                  type: "text",
                  className: "input",
                  value: d.title ?? "",
                  onChange: (m) => i(h, { title: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.servicesGrid.serviceDescription") }),
              /* @__PURE__ */ l(
                "textarea",
                {
                  className: "input",
                  rows: 2,
                  value: d.description ?? "",
                  onChange: (m) => i(h, { description: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.servicesGrid.ctaLabel") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.ctaLabel ?? "",
                    onChange: (m) => i(h, { ctaLabel: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.servicesGrid.ctaHref") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.ctaHref ?? "",
                    onChange: (m) => i(h, { ctaHref: m.target.value })
                  }
                )
              ] })
            ] })
          ]
        },
        h
      ))
    ] }),
    /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: e("blocks.servicesGrid.iconHelp") })
  ] });
}
const Fl = re({
  subId: gr,
  defaultAttrs: xa,
  view: Bl
}), Ul = {
  id: `corporate/${gr}`,
  nodeName: qe,
  titleKey: "blocks.servicesGrid.title",
  namespace: "theme-corporate",
  icon: fn,
  category: "layout",
  extensions: [Fl],
  insert: (r) => {
    r.focus().insertContent({ type: qe }).run();
  },
  isActive: (r) => r.isActive(qe),
  inspector: (r) => /* @__PURE__ */ l($l, { editor: r.editor })
}, br = "cta-banner", _e = ne(br), wa = {
  variant: "navy",
  title: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: ""
};
function jl({ attrs: r, selected: e }) {
  const { t } = H("theme-corporate");
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(xn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.ctaBanner.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.ctaBanner.untitled") })
        ] })
      ] })
    }
  );
}
function Dl({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(_e), n = { ...wa, ...t.attrs ?? {} };
  function a(o) {
    r.chain().updateAttributes(_e, { attrs: { ...n, ...o } }).run();
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.ctaBanner.variant") }),
      /* @__PURE__ */ p(
        "select",
        {
          className: "input",
          value: n.variant ?? "navy",
          onChange: (o) => a({ variant: o.target.value }),
          children: [
            /* @__PURE__ */ l("option", { value: "navy", children: e("blocks.ctaBanner.variants.navy") }),
            /* @__PURE__ */ l("option", { value: "indigo", children: e("blocks.ctaBanner.variants.indigo") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.ctaBanner.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (o) => a({ title: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.ctaBanner.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 3,
          value: n.subtitle ?? "",
          onChange: (o) => a({ subtitle: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.primaryCtaLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.primaryCtaLabel ?? "",
            onChange: (o) => a({ primaryCtaLabel: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.primaryCtaHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.primaryCtaHref ?? "",
            onChange: (o) => a({ primaryCtaHref: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.secondaryCtaLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.secondaryCtaLabel ?? "",
            onChange: (o) => a({ secondaryCtaLabel: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.heroOverlay.secondaryCtaHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.secondaryCtaHref ?? "",
            onChange: (o) => a({ secondaryCtaHref: o.target.value })
          }
        )
      ] })
    ] })
  ] });
}
const Vl = re({
  subId: br,
  defaultAttrs: wa,
  view: jl
}), ql = {
  id: `corporate/${br}`,
  nodeName: _e,
  titleKey: "blocks.ctaBanner.title",
  namespace: "theme-corporate",
  icon: xn,
  category: "layout",
  extensions: [Vl],
  insert: (r) => {
    r.focus().insertContent({ type: _e }).run();
  },
  isActive: (r) => r.isActive(_e),
  inspector: (r) => /* @__PURE__ */ l(Dl, { editor: r.editor })
}, vr = "testimonials", Ge = ne(vr), bt = {
  rating: 5,
  quote: "",
  authorName: "",
  authorTitle: "",
  authorAvatarUrl: "",
  authorAvatarAlt: ""
}, ka = {
  eyebrow: "",
  title: "",
  subtitle: "",
  variant: "glass",
  testimonials: [{ ...bt }, { ...bt }, { ...bt }]
};
function _l({ attrs: r, selected: e }) {
  var a;
  const { t } = H("theme-corporate"), n = ((a = r.testimonials) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(wn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.testimonials.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.testimonials.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function Gl({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(Ge), n = { ...ka, ...t.attrs ?? {} }, a = n.testimonials ?? [];
  function o(d) {
    r.chain().updateAttributes(Ge, { attrs: { ...n, ...d } }).run();
  }
  function i(d, h) {
    o({ testimonials: a.map((m, f) => f === d ? { ...m, ...h } : m) });
  }
  function s() {
    o({ testimonials: [...a, { ...bt }] });
  }
  function c(d) {
    o({ testimonials: a.filter((h, m) => m !== d) });
  }
  function u(d, h) {
    const m = d + h;
    if (m < 0 || m >= a.length) return;
    const f = [...a];
    [f[d], f[m]] = [f[m], f[d]], o({ testimonials: f });
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.testimonials.variant") }),
      /* @__PURE__ */ p(
        "select",
        {
          className: "input",
          value: n.variant ?? "glass",
          onChange: (d) => o({ variant: d.target.value }),
          children: [
            /* @__PURE__ */ l("option", { value: "glass", children: e("blocks.testimonials.variants.glass") }),
            /* @__PURE__ */ l("option", { value: "navy", children: e("blocks.testimonials.variants.navy") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.testimonials.eyebrow") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.eyebrow ?? "",
          onChange: (d) => o({ eyebrow: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.testimonials.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (d) => o({ title: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.testimonials.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.subtitle ?? "",
          onChange: (d) => o({ subtitle: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700", children: [
      /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.testimonials.itemsHeading") }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "btn-ghost btn-sm flex items-center gap-1",
            onClick: s,
            children: [
              /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
              e("blocks.testimonials.addItem")
            ]
          }
        )
      ] }),
      a.map((d, h) => /* @__PURE__ */ p(
        "div",
        {
          className: "rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800",
          children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ l("p", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: e("blocks.testimonials.itemIndex", { index: h + 1 }) }),
              /* @__PURE__ */ p("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, -1),
                    disabled: h === 0,
                    children: /* @__PURE__ */ l(Ie, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, 1),
                    disabled: h === a.length - 1,
                    children: /* @__PURE__ */ l(Me, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon text-red-600",
                    onClick: () => c(h),
                    children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.testimonials.quote") }),
              /* @__PURE__ */ l(
                "textarea",
                {
                  className: "input",
                  rows: 3,
                  value: d.quote ?? "",
                  onChange: (m) => i(h, { quote: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.testimonials.authorName") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.authorName ?? "",
                    onChange: (m) => i(h, { authorName: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.testimonials.authorTitle") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.authorTitle ?? "",
                    onChange: (m) => i(h, { authorTitle: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.testimonials.avatarUrl") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "url",
                    className: "input",
                    placeholder: "https://…",
                    value: d.authorAvatarUrl ?? "",
                    onChange: (m) => i(h, { authorAvatarUrl: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.testimonials.rating") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "number",
                    min: 1,
                    max: 5,
                    className: "input",
                    value: d.rating ?? 5,
                    onChange: (m) => i(h, { rating: Number(m.target.value) })
                  }
                )
              ] })
            ] })
          ]
        },
        h
      ))
    ] })
  ] });
}
const Jl = re({
  subId: vr,
  defaultAttrs: ka,
  view: _l
}), Wl = {
  id: `corporate/${vr}`,
  nodeName: Ge,
  titleKey: "blocks.testimonials.title",
  namespace: "theme-corporate",
  icon: wn,
  category: "layout",
  extensions: [Jl],
  insert: (r) => {
    r.focus().insertContent({ type: Ge }).run();
  },
  isActive: (r) => r.isActive(Ge),
  inspector: (r) => /* @__PURE__ */ l(Gl, { editor: r.editor })
}, yr = "trust-bar", Je = ne(yr), Be = { imageUrl: "", imageAlt: "", href: "" }, Ca = {
  label: "",
  logos: [{ ...Be }, { ...Be }, { ...Be }, { ...Be }]
};
function Kl({ attrs: r, selected: e }) {
  var a;
  const { t } = H("theme-corporate"), n = ((a = r.logos) == null ? void 0 : a.filter((o) => o.imageUrl).length) ?? 0;
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(Cn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.trustBar.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: t("blocks.trustBar.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function Yl({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(Je), n = { ...Ca, ...t.attrs ?? {} }, a = n.logos ?? [];
  function o(d) {
    r.chain().updateAttributes(Je, { attrs: { ...n, ...d } }).run();
  }
  function i(d, h) {
    o({ logos: a.map((m, f) => f === d ? { ...m, ...h } : m) });
  }
  function s() {
    o({ logos: [...a, { ...Be }] });
  }
  function c(d) {
    o({ logos: a.filter((h, m) => m !== d) });
  }
  function u(d, h) {
    const m = d + h;
    if (m < 0 || m >= a.length) return;
    const f = [...a];
    [f[d], f[m]] = [f[m], f[d]], o({ logos: f });
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.trustBar.label") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          placeholder: e("blocks.trustBar.labelPlaceholder"),
          value: n.label ?? "",
          onChange: (d) => o({ label: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700", children: [
      /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.trustBar.logosHeading") }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "btn-ghost btn-sm flex items-center gap-1",
            onClick: s,
            children: [
              /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
              e("blocks.trustBar.addLogo")
            ]
          }
        )
      ] }),
      a.map((d, h) => /* @__PURE__ */ p(
        "div",
        {
          className: "rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800",
          children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ l("p", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: e("blocks.trustBar.logoIndex", { index: h + 1 }) }),
              /* @__PURE__ */ p("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, -1),
                    disabled: h === 0,
                    children: /* @__PURE__ */ l(Ie, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, 1),
                    disabled: h === a.length - 1,
                    children: /* @__PURE__ */ l(Me, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon text-red-600",
                    onClick: () => c(h),
                    children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.trustBar.imageUrl") }),
              /* @__PURE__ */ l(
                "input",
                {
                  type: "url",
                  className: "input",
                  placeholder: "https://…",
                  value: d.imageUrl ?? "",
                  onChange: (m) => i(h, { imageUrl: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.trustBar.imageAlt") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.imageAlt ?? "",
                    onChange: (m) => i(h, { imageAlt: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.trustBar.href") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "url",
                    className: "input",
                    placeholder: "https://…",
                    value: d.href ?? "",
                    onChange: (m) => i(h, { href: m.target.value })
                  }
                )
              ] })
            ] })
          ]
        },
        h
      ))
    ] })
  ] });
}
const Zl = re({
  subId: yr,
  defaultAttrs: Ca,
  view: Kl
}), Ql = {
  id: `corporate/${yr}`,
  nodeName: Je,
  titleKey: "blocks.trustBar.title",
  namespace: "theme-corporate",
  icon: Cn,
  category: "layout",
  extensions: [Zl],
  insert: (r) => {
    r.focus().insertContent({ type: Je }).run();
  },
  isActive: (r) => r.isActive(Je),
  inspector: (r) => /* @__PURE__ */ l(Yl, { editor: r.editor })
}, xr = "stats-grid", We = ne(xr), $e = { value: "", label: "" }, Sa = {
  eyebrow: "",
  title: "",
  subtitle: "",
  stats: [{ ...$e }, { ...$e }, { ...$e }, { ...$e }]
};
function Xl({ attrs: r, selected: e }) {
  var a;
  const { t } = H("theme-corporate"), n = ((a = r.stats) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(mn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.statsGrid.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.statsGrid.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function ec({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(We), n = { ...Sa, ...t.attrs ?? {} }, a = n.stats ?? [];
  function o(d) {
    r.chain().updateAttributes(We, { attrs: { ...n, ...d } }).run();
  }
  function i(d, h) {
    o({ stats: a.map((m, f) => f === d ? { ...m, ...h } : m) });
  }
  function s() {
    o({ stats: [...a, { ...$e }] });
  }
  function c(d) {
    o({ stats: a.filter((h, m) => m !== d) });
  }
  function u(d, h) {
    const m = d + h;
    if (m < 0 || m >= a.length) return;
    const f = [...a];
    [f[d], f[m]] = [f[m], f[d]], o({ stats: f });
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.statsGrid.eyebrow") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.eyebrow ?? "",
          onChange: (d) => o({ eyebrow: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.statsGrid.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (d) => o({ title: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.statsGrid.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.subtitle ?? "",
          onChange: (d) => o({ subtitle: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700", children: [
      /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.statsGrid.statsHeading") }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "btn-ghost btn-sm flex items-center gap-1",
            onClick: s,
            children: [
              /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
              e("blocks.statsGrid.addItem")
            ]
          }
        )
      ] }),
      a.map((d, h) => /* @__PURE__ */ p(
        "div",
        {
          className: "rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800",
          children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ l("p", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: e("blocks.statsGrid.itemIndex", { index: h + 1 }) }),
              /* @__PURE__ */ p("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, -1),
                    disabled: h === 0,
                    children: /* @__PURE__ */ l(Ie, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, 1),
                    disabled: h === a.length - 1,
                    children: /* @__PURE__ */ l(Me, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon text-red-600",
                    onClick: () => c(h),
                    children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.statsGrid.value") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    placeholder: "500+",
                    value: d.value ?? "",
                    onChange: (m) => i(h, { value: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.statsGrid.itemLabel") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    placeholder: "Clients",
                    value: d.label ?? "",
                    onChange: (m) => i(h, { label: m.target.value })
                  }
                )
              ] })
            ] })
          ]
        },
        h
      ))
    ] })
  ] });
}
const tc = re({
  subId: xr,
  defaultAttrs: Sa,
  view: Xl
}), rc = {
  id: `corporate/${xr}`,
  nodeName: We,
  titleKey: "blocks.statsGrid.title",
  namespace: "theme-corporate",
  icon: mn,
  category: "layout",
  extensions: [tc],
  insert: (r) => {
    r.focus().insertContent({ type: We }).run();
  },
  isActive: (r) => r.isActive(We),
  inspector: (r) => /* @__PURE__ */ l(ec, { editor: r.editor })
}, wr = "feature-stack", Ke = ne(wr), Qt = {
  icon: "auto_awesome",
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  imageAlt: "",
  imagePosition: void 0
}, Na = {
  eyebrow: "",
  title: "",
  subtitle: "",
  alternate: !0,
  features: [{ ...Qt }, { ...Qt }]
};
function nc({ attrs: r, selected: e }) {
  var a;
  const { t } = H("theme-corporate"), n = ((a = r.features) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(gn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.featureStack.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.featureStack.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function ac({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(Ke), n = { ...Na, ...t.attrs ?? {} }, a = n.features ?? [];
  function o(d) {
    r.chain().updateAttributes(Ke, { attrs: { ...n, ...d } }).run();
  }
  function i(d, h) {
    o({ features: a.map((m, f) => f === d ? { ...m, ...h } : m) });
  }
  function s() {
    o({ features: [...a, { ...Qt }] });
  }
  function c(d) {
    o({ features: a.filter((h, m) => m !== d) });
  }
  function u(d, h) {
    const m = d + h;
    if (m < 0 || m >= a.length) return;
    const f = [...a];
    [f[d], f[m]] = [f[m], f[d]], o({ features: f });
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.featureStack.eyebrow") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.eyebrow ?? "",
          onChange: (d) => o({ eyebrow: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.featureStack.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.title ?? "",
          onChange: (d) => o({ title: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.featureStack.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.subtitle ?? "",
          onChange: (d) => o({ subtitle: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200", children: [
      /* @__PURE__ */ l(
        "input",
        {
          type: "checkbox",
          checked: n.alternate !== !1,
          onChange: (d) => o({ alternate: d.target.checked })
        }
      ),
      e("blocks.featureStack.alternate")
    ] }),
    /* @__PURE__ */ p("div", { className: "space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700", children: [
      /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.featureStack.featuresHeading") }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "btn-ghost btn-sm flex items-center gap-1",
            onClick: s,
            children: [
              /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
              e("blocks.featureStack.addFeature")
            ]
          }
        )
      ] }),
      a.map((d, h) => /* @__PURE__ */ p(
        "div",
        {
          className: "rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800",
          children: [
            /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ l("p", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: e("blocks.featureStack.itemIndex", { index: h + 1 }) }),
              /* @__PURE__ */ p("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, -1),
                    disabled: h === 0,
                    children: /* @__PURE__ */ l(Ie, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon",
                    onClick: () => u(h, 1),
                    disabled: h === a.length - 1,
                    children: /* @__PURE__ */ l(Me, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "btn-ghost btn-icon text-red-600",
                    onClick: () => c(h),
                    children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.icon") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    placeholder: "rocket_launch",
                    value: d.icon ?? "",
                    onChange: (m) => i(h, { icon: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.eyebrowField") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.eyebrow ?? "",
                    onChange: (m) => i(h, { eyebrow: m.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.featureTitle") }),
              /* @__PURE__ */ l(
                "input",
                {
                  type: "text",
                  className: "input",
                  value: d.title ?? "",
                  onChange: (m) => i(h, { title: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.featureDescription") }),
              /* @__PURE__ */ l(
                "textarea",
                {
                  className: "input",
                  rows: 2,
                  value: d.description ?? "",
                  onChange: (m) => i(h, { description: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.imageUrl") }),
              /* @__PURE__ */ l(
                "input",
                {
                  type: "url",
                  className: "input",
                  placeholder: "https://…",
                  value: d.imageUrl ?? "",
                  onChange: (m) => i(h, { imageUrl: m.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.ctaLabel") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.ctaLabel ?? "",
                    onChange: (m) => i(h, { ctaLabel: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { children: [
                /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.ctaHref") }),
                /* @__PURE__ */ l(
                  "input",
                  {
                    type: "text",
                    className: "input",
                    value: d.ctaHref ?? "",
                    onChange: (m) => i(h, { ctaHref: m.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.featureStack.imagePosition") }),
              /* @__PURE__ */ p(
                "select",
                {
                  className: "input",
                  value: d.imagePosition ?? "",
                  onChange: (m) => i(h, {
                    imagePosition: m.target.value || void 0
                  }),
                  children: [
                    /* @__PURE__ */ l("option", { value: "", children: e("blocks.featureStack.imagePositions.auto") }),
                    /* @__PURE__ */ l("option", { value: "left", children: e("blocks.featureStack.imagePositions.left") }),
                    /* @__PURE__ */ l("option", { value: "right", children: e("blocks.featureStack.imagePositions.right") })
                  ]
                }
              )
            ] })
          ]
        },
        h
      ))
    ] })
  ] });
}
const oc = re({
  subId: wr,
  defaultAttrs: Na,
  view: nc
}), ic = {
  id: `corporate/${wr}`,
  nodeName: Ke,
  titleKey: "blocks.featureStack.title",
  namespace: "theme-corporate",
  icon: gn,
  category: "layout",
  extensions: [oc],
  insert: (r) => {
    r.focus().insertContent({ type: Ke }).run();
  },
  isActive: (r) => r.isActive(Ke),
  inspector: (r) => /* @__PURE__ */ l(ac, { editor: r.editor })
}, kr = "contact-info", Ye = ne(kr), sc = { icon: "share", href: "", ariaLabel: "" }, Aa = {
  heading: "",
  addressLines: "",
  phoneLines: "",
  emailLines: "",
  socialsLabel: "",
  socials: []
};
function lc({ attrs: r, selected: e }) {
  const { t } = H("theme-corporate"), n = [r.addressLines, r.phoneLines, r.emailLines].filter(Boolean).length;
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(yn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.contactInfo.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.heading || t("blocks.contactInfo.preview", { lines: n }) })
        ] })
      ] })
    }
  );
}
function cc({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(Ye), n = { ...Aa, ...t.attrs ?? {} }, a = n.socials ?? [];
  function o(s) {
    r.chain().updateAttributes(Ye, { attrs: { ...n, ...s } }).run();
  }
  function i(s, c) {
    o({ socials: a.map((u, d) => d === s ? { ...u, ...c } : u) });
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactInfo.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          placeholder: e("blocks.contactInfo.headingPlaceholder"),
          value: n.heading ?? "",
          onChange: (s) => o({ heading: s.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactInfo.address") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.addressLines ?? "",
          onChange: (s) => o({ addressLines: s.target.value })
        }
      ),
      /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.contactInfo.multilineHelp") })
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactInfo.phone") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.phoneLines ?? "",
          onChange: (s) => o({ phoneLines: s.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactInfo.email") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.emailLines ?? "",
          onChange: (s) => o({ emailLines: s.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "pt-3 border-t border-surface-200 dark:border-surface-700 space-y-3", children: [
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactInfo.socialsLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.socialsLabel ?? "",
            onChange: (s) => o({ socialsLabel: s.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.contactInfo.socials") }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "btn-ghost btn-sm flex items-center gap-1",
            onClick: () => o({ socials: [...a, { ...sc }] }),
            children: [
              /* @__PURE__ */ l(ve, { className: "h-3 w-3" }),
              e("blocks.contactInfo.addSocial")
            ]
          }
        )
      ] }),
      a.map((s, c) => /* @__PURE__ */ p(
        "div",
        {
          className: "rounded-md border border-surface-200 bg-surface-50 p-2 grid grid-cols-[1fr_2fr_auto] gap-2 items-end dark:border-surface-700 dark:bg-surface-800",
          children: [
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactInfo.socialIcon") }),
              /* @__PURE__ */ l(
                "input",
                {
                  type: "text",
                  className: "input",
                  placeholder: "share",
                  value: s.icon ?? "",
                  onChange: (u) => i(c, { icon: u.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ p("div", { children: [
              /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactInfo.socialHref") }),
              /* @__PURE__ */ l(
                "input",
                {
                  type: "url",
                  className: "input",
                  placeholder: "https://…",
                  value: s.href ?? "",
                  onChange: (u) => i(c, { href: u.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "btn-ghost btn-icon text-red-600",
                onClick: () => o({ socials: a.filter((u, d) => d !== c) }),
                children: /* @__PURE__ */ l(ie, { className: "h-3 w-3" })
              }
            )
          ]
        },
        c
      ))
    ] })
  ] });
}
const dc = re({
  subId: kr,
  defaultAttrs: Aa,
  view: lc
}), uc = {
  id: `corporate/${kr}`,
  nodeName: Ye,
  titleKey: "blocks.contactInfo.title",
  namespace: "theme-corporate",
  icon: yn,
  category: "layout",
  extensions: [dc],
  insert: (r) => {
    r.focus().insertContent({ type: Ye }).run();
  },
  isActive: (r) => r.isActive(Ye),
  inspector: (r) => /* @__PURE__ */ l(cc, { editor: r.editor })
}, Cr = "contact-form", Ze = ne(Cr), Ta = {
  heading: "",
  subtitle: "",
  mode: "endpoint",
  endpointUrl: "",
  mailtoAddress: "",
  labelName: "Full name",
  labelEmail: "Work email",
  labelCompany: "Company",
  labelSubject: "Subject",
  labelMessage: "Message",
  subjectOptions: "",
  submitLabel: "Send inquiry",
  privacyText: "",
  privacyHref: "",
  successMessage: "",
  errorMessage: ""
};
function pc({ attrs: r, selected: e }) {
  const { t } = H("theme-corporate");
  return /* @__PURE__ */ l(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ p("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ l(vn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.contactForm.title") }),
          /* @__PURE__ */ l("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.heading || t("blocks.contactForm.preview", { mode: r.mode ?? "endpoint" }) })
        ] })
      ] })
    }
  );
}
function hc({ editor: r }) {
  const { t: e } = H("theme-corporate"), t = r.getAttributes(Ze), n = { ...Ta, ...t.attrs ?? {} };
  function a(o) {
    r.chain().updateAttributes(Ze, { attrs: { ...n, ...o } }).run();
  }
  return /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactForm.heading") }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "input",
          value: n.heading ?? "",
          onChange: (o) => a({ heading: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { children: [
      /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactForm.subtitle") }),
      /* @__PURE__ */ l(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: n.subtitle ?? "",
          onChange: (o) => a({ subtitle: o.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "pt-3 border-t border-surface-200 dark:border-surface-700 space-y-3", children: [
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactForm.mode") }),
        /* @__PURE__ */ p(
          "select",
          {
            className: "input",
            value: n.mode ?? "endpoint",
            onChange: (o) => a({ mode: o.target.value }),
            children: [
              /* @__PURE__ */ l("option", { value: "endpoint", children: e("blocks.contactForm.modes.endpoint") }),
              /* @__PURE__ */ l("option", { value: "mailto", children: e("blocks.contactForm.modes.mailto") })
            ]
          }
        ),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.contactForm.modeHelp") })
      ] }),
      n.mode !== "mailto" ? /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactForm.endpointUrl") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "url",
            className: "input",
            placeholder: "https://formspree.io/f/abcdefg",
            value: n.endpointUrl ?? "",
            onChange: (o) => a({ endpointUrl: o.target.value })
          }
        ),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.contactForm.endpointHelp") })
      ] }) : /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label", children: e("blocks.contactForm.mailtoAddress") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "email",
            className: "input",
            placeholder: "hello@example.com",
            value: n.mailtoAddress ?? "",
            onChange: (o) => a({ mailtoAddress: o.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ p("div", { className: "pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2", children: [
      /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.contactForm.fieldLabels") }),
      /* @__PURE__ */ p("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.labelName") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: n.labelName ?? "",
              onChange: (o) => a({ labelName: o.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.labelEmail") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: n.labelEmail ?? "",
              onChange: (o) => a({ labelEmail: o.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.labelCompany") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: n.labelCompany ?? "",
              onChange: (o) => a({ labelCompany: o.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { children: [
          /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.labelSubject") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: n.labelSubject ?? "",
              onChange: (o) => a({ labelSubject: o.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ p("div", { className: "col-span-2", children: [
          /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.labelMessage") }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "input",
              value: n.labelMessage ?? "",
              onChange: (o) => a({ labelMessage: o.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.subjectOptions") }),
        /* @__PURE__ */ l(
          "textarea",
          {
            className: "input",
            rows: 4,
            value: n.subjectOptions ?? "",
            onChange: (o) => a({ subjectOptions: o.target.value })
          }
        ),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.contactForm.subjectOptionsHelp") })
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.submitLabel") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.submitLabel ?? "",
            onChange: (o) => a({ submitLabel: o.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ p("div", { className: "pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2", children: [
      /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.contactForm.privacyHeading") }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.privacyText") }),
        /* @__PURE__ */ l(
          "textarea",
          {
            className: "input",
            rows: 2,
            value: n.privacyText ?? "",
            onChange: (o) => a({ privacyText: o.target.value })
          }
        ),
        /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: e("blocks.contactForm.privacyHelp") })
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.privacyHref") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "url",
            className: "input",
            placeholder: "/privacy.html",
            value: n.privacyHref ?? "",
            onChange: (o) => a({ privacyHref: o.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ p("div", { className: "pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2", children: [
      /* @__PURE__ */ l("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: e("blocks.contactForm.feedback") }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.successMessage") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.successMessage ?? "",
            onChange: (o) => a({ successMessage: o.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ p("div", { children: [
        /* @__PURE__ */ l("label", { className: "label text-xs", children: e("blocks.contactForm.errorMessage") }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "text",
            className: "input",
            value: n.errorMessage ?? "",
            onChange: (o) => a({ errorMessage: o.target.value })
          }
        )
      ] })
    ] })
  ] });
}
const mc = re({
  subId: Cr,
  defaultAttrs: Ta,
  view: pc
}), fc = {
  id: `corporate/${Cr}`,
  nodeName: Ze,
  titleKey: "blocks.contactForm.title",
  namespace: "theme-corporate",
  icon: vn,
  category: "layout",
  extensions: [mc],
  insert: (r) => {
    r.focus().insertContent({ type: Ze }).run();
  },
  isActive: (r) => r.isActive(Ze),
  inspector: (r) => /* @__PURE__ */ l(hc, { editor: r.editor })
};
function gc(r) {
  if (!r.title && !r.subtitle) return { html: "" };
  const e = r.eyebrow ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider">${k(r.eyebrow)}</span>` : "", t = r.title ? `<h1 class="text-h1 font-bold text-primary max-w-2xl leading-tight">${k(r.title)}</h1>` : "", n = r.subtitle ? `<p class="text-body-lg text-on-surface-variant max-w-xl">${k(r.subtitle)}</p>` : "", a = r.primaryCtaLabel && r.primaryCtaHref ? `<a href="${N(r.primaryCtaHref)}" class="text-button font-semibold bg-secondary text-on-secondary px-8 py-4 rounded-xl shadow-lg shadow-secondary/20 hover:translate-y-[-2px] transition-all inline-flex items-center gap-2">${k(r.primaryCtaLabel)}</a>` : "", o = r.secondaryCtaLabel && r.secondaryCtaHref ? `<a href="${N(r.secondaryCtaHref)}" class="text-button font-semibold border border-outline text-primary px-8 py-4 rounded-xl hover:bg-surface-container-low transition-all">${k(r.secondaryCtaLabel)}</a>` : "", i = a || o ? `<div class="flex flex-wrap gap-4">${a}${o}</div>` : "", s = r.imageUrl ? `<div class="absolute top-0 right-0 w-full md:w-1/2 h-full -z-0 opacity-10 pointer-events-none"><img class="w-full h-full object-cover" src="${N(r.imageUrl)}" alt="${N(r.imageAlt ?? "")}" loading="lazy" /></div>` : "";
  return {
    html: `<section class="relative px-gutter py-section-padding overflow-hidden">
<div class="max-w-container-max mx-auto flex flex-col gap-stack-lg relative z-10">
<div class="flex flex-col gap-stack-sm">${e}${t}${n}</div>
${i}
</div>
${s}
</section>`
  };
}
const bc = {
  icon: "auto_awesome",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  accent: !1
};
function vc(r) {
  const e = { ...bc, ...r }, t = !!e.accent, n = t ? "bg-primary p-8 rounded-xl shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full text-on-primary" : "bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full", a = t ? "w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mb-6" : "w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-6", o = t ? "text-on-secondary text-h3" : "text-secondary text-h3", i = t ? "text-h3 font-semibold mb-4" : "text-h3 font-semibold text-primary mb-4", s = t ? "text-on-primary-container mb-8 flex-grow" : "text-on-surface-variant mb-8 flex-grow", c = t ? "text-secondary-fixed font-semibold text-button flex items-center gap-2 group" : "text-secondary font-semibold text-button flex items-center gap-2 group", u = e.icon ? `<div class="${a}"><span class="material-symbols-outlined ${o}">${k(e.icon)}</span></div>` : "", d = e.ctaLabel && e.ctaHref ? `<a class="${c}" href="${N(e.ctaHref)}">${k(e.ctaLabel)}<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">trending_flat</span></a>` : "";
  return `<div class="${n}">${u}<h3 class="${i}">${k(e.title)}</h3><p class="${s}">${k(e.description)}</p>${d}</div>`;
}
function yc(r) {
  const e = (r.services ?? []).filter((s) => s && (s.title || s.description));
  if (e.length === 0 && !r.title) return { html: "" };
  const t = r.eyebrow ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${k(r.eyebrow)}</span>` : "", n = r.title ? `<h2 class="text-h2 font-bold text-primary mb-4">${k(r.title)}</h2>` : "", a = r.subtitle ? `<p class="text-on-surface-variant text-body-md max-w-xl">${k(r.subtitle)}</p>` : "", o = t || n || a ? `<div class="mb-stack-lg max-w-xl">${t}${n}${a}</div>` : "", i = e.map(vc).join("");
  return {
    html: `<section class="py-section-padding px-gutter max-w-container-max mx-auto">
${o}
<div class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">${i}</div>
</section>`
  };
}
function xc(r) {
  if (!r.title && !r.subtitle) return { html: "" };
  const e = r.variant === "indigo" ? "indigo" : "navy", t = r.title ? `<h2 class="text-h2 font-bold mb-stack-md">${k(r.title)}</h2>` : "", n = r.subtitle ? `<p class="text-body-lg mb-stack-lg ${e === "navy" ? "text-on-primary-container" : "opacity-90"} max-w-2xl mx-auto">${k(r.subtitle)}</p>` : "", a = "bg-secondary text-on-secondary px-10 py-5 rounded-xl text-button font-semibold hover:scale-105 transition-transform", o = "bg-white/10 text-on-primary px-10 py-5 rounded-xl text-button font-semibold hover:bg-white/20 transition-colors", i = "bg-white text-secondary px-10 py-4 rounded-xl text-button font-semibold hover:bg-secondary-fixed transition-colors", s = "border border-white/30 text-white px-10 py-4 rounded-xl text-button font-semibold hover:bg-white/10 transition-colors", c = e === "navy" ? a : i, u = e === "navy" ? o : s, d = r.primaryCtaLabel && r.primaryCtaHref ? `<a href="${N(r.primaryCtaHref)}" class="${c}">${k(r.primaryCtaLabel)}</a>` : "", h = r.secondaryCtaLabel && r.secondaryCtaHref ? `<a href="${N(r.secondaryCtaHref)}" class="${u}">${k(r.secondaryCtaLabel)}</a>` : "", m = d || h ? `<div class="flex flex-col sm:flex-row gap-4 justify-center">${d}${h}</div>` : "";
  return e === "indigo" ? {
    html: `<section class="px-gutter py-section-padding bg-surface-bright">
<div class="max-w-4xl mx-auto bg-secondary rounded-2xl p-12 md:p-16 text-center text-on-secondary shadow-2xl relative overflow-hidden">
<div class="relative z-10">${t}${n}${m}</div>
<div class="absolute top-0 right-0 p-4 opacity-10"><span class="material-symbols-outlined text-[120px]">bolt</span></div>
</div>
</section>`
  } : {
    html: `<section class="py-section-padding px-gutter">
<div class="max-w-container-max mx-auto bg-primary rounded-3xl p-12 md:p-20 relative overflow-hidden text-center text-on-primary">
<div class="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
<div class="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-fixed-dim/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
<div class="relative z-10 max-w-2xl mx-auto">${t}${n}${m}</div>
</div>
</section>`
  };
}
function wc(r) {
  const e = (r.logos ?? []).filter((a) => a && a.imageUrl);
  if (e.length === 0) return { html: "" };
  const t = r.label ? `<p class="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider w-full text-center mb-stack-md">${k(r.label)}</p>` : "", n = e.map((a) => {
    const o = `<img src="${N(a.imageUrl)}" alt="${N(a.imageAlt ?? "")}" class="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all" loading="lazy" />`;
    return a.href ? `<a href="${N(a.href)}" class="inline-flex items-center justify-center" target="_blank" rel="noopener noreferrer">${o}</a>` : o;
  }).join("");
  return {
    html: `<section class="px-gutter py-section-padding">
<div class="max-w-container-max mx-auto p-stack-lg flex flex-wrap items-center justify-center gap-stack-lg">${t}${n}</div>
</section>`
  };
}
function kc(r) {
  const e = (r.stats ?? []).filter((c) => c && (c.value || c.label));
  if (e.length === 0 && !r.title) return { html: "" };
  const t = r.eyebrow ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${k(r.eyebrow)}</span>` : "", n = r.title ? `<h2 class="text-h2 font-bold text-primary mb-4">${k(r.title)}</h2>` : "", a = r.subtitle ? `<p class="text-on-surface-variant text-body-md max-w-xl mx-auto">${k(r.subtitle)}</p>` : "", o = t || n || a ? `<div class="text-center max-w-2xl mx-auto mb-stack-lg">${t}${n}${a}</div>` : "", i = e.length >= 4 ? "grid-cols-2 md:grid-cols-4" : e.length === 3 ? "grid-cols-1 md:grid-cols-3" : e.length === 2 ? "grid-cols-2" : "grid-cols-1", s = e.map(
    (c) => `<div class="text-center"><span class="text-h1 font-bold text-secondary block">${k(c.value)}</span><span class="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider mt-2 block">${k(c.label)}</span></div>`
  ).join("");
  return {
    html: `<section class="py-section-padding px-gutter">
<div class="max-w-container-max mx-auto">
${o}
<div class="grid ${i} gap-stack-lg bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-stack-lg shadow-sm">${s}</div>
</div>
</section>`
  };
}
const Cc = {
  icon: "auto_awesome",
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  imageAlt: ""
};
function Sc(r, e, t) {
  const n = { ...Cc, ...r };
  if (!n.title && !n.description) return "";
  const a = t ? e % 2 === 1 : !1, o = n.imagePosition === "left" || n.imagePosition !== "right" && a, i = n.icon ? `<div class="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-stack-md"><span class="material-symbols-outlined text-secondary text-h3">${k(n.icon)}</span></div>` : "", s = n.eyebrow ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${k(n.eyebrow)}</span>` : "", c = `<h3 class="text-h2 font-bold text-primary mb-stack-md">${k(n.title)}</h3>`, u = `<p class="text-body-lg text-on-surface-variant mb-stack-md">${k(n.description)}</p>`, d = n.ctaLabel && n.ctaHref ? `<a href="${N(n.ctaHref)}" class="inline-flex items-center gap-2 text-button font-semibold text-secondary hover:gap-3 transition-all">${k(n.ctaLabel)}<span class="material-symbols-outlined text-[18px]">trending_flat</span></a>` : "", h = `<div class="flex flex-col justify-center">${i}${s}${c}${u}${d}</div>`, m = n.imageUrl ? `<div class="rounded-2xl overflow-hidden shadow-xl aspect-video bg-surface-container-low"><img src="${N(n.imageUrl)}" alt="${N(n.imageAlt ?? n.title)}" class="w-full h-full object-cover" loading="lazy" /></div>` : "";
  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg ${o ? "md:[&>:first-child]:order-2" : ""}">${h}${m}</div>`;
}
function Nc(r) {
  const e = (r.features ?? []).filter((c) => c && (c.title || c.description));
  if (e.length === 0 && !r.title) return { html: "" };
  const t = r.eyebrow ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${k(r.eyebrow)}</span>` : "", n = r.title ? `<h2 class="text-h2 font-bold text-primary mb-4">${k(r.title)}</h2>` : "", a = r.subtitle ? `<p class="text-on-surface-variant text-body-md max-w-xl mx-auto">${k(r.subtitle)}</p>` : "", o = t || n || a ? `<div class="text-center max-w-2xl mx-auto mb-section-padding">${t}${n}${a}</div>` : "", i = r.alternate !== !1, s = e.map((c, u) => Sc(c, u, i)).join("");
  return {
    html: `<section class="py-section-padding px-gutter">
<div class="max-w-container-max mx-auto">
${o}
<div class="space-y-section-padding">${s}</div>
</div>
</section>`
  };
}
function _t(r, e, t) {
  return `<div class="flex items-start gap-4">
<div class="bg-secondary-fixed p-3 rounded-lg shrink-0">
<span class="material-symbols-outlined text-secondary">${k(r)}</span>
</div>
<div><p class="font-bold text-primary">${k(e)}</p><p class="text-on-surface-variant">${t}</p></div>
</div>`;
}
function Gt(r) {
  return r ? k(r).replace(/\n/g, "<br/>") : "";
}
function Ac(r) {
  const e = !!r.addressLines, t = !!r.phoneLines, n = !!r.emailLines, a = (r.socials ?? []).filter((c) => c && (c.icon || c.href));
  if (!e && !t && !n && a.length === 0)
    return { html: "" };
  const o = r.heading ? `<h3 class="text-h3 font-semibold text-primary mb-stack-md">${k(r.heading)}</h3>` : "", i = [];
  e && i.push(_t("location_on", "Address", Gt(r.addressLines))), t && i.push(_t("call", "Phone", Gt(r.phoneLines))), n && i.push(_t("mail", "Email", Gt(r.emailLines)));
  const s = a.length > 0 ? `<div class="mt-stack-lg pt-stack-lg border-t border-outline-variant/20">
${r.socialsLabel ? `<p class="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider mb-stack-md">${k(r.socialsLabel)}</p>` : ""}
<div class="flex gap-4">
${a.map(
    (c) => `<a class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-colors" href="${N(c.href ?? "#")}" target="_blank" rel="noopener noreferrer" aria-label="${N(c.ariaLabel ?? "")}"><span class="material-symbols-outlined text-[1.25rem]">${k(c.icon ?? "share")}</span></a>`
  ).join("")}
</div>
</div>` : "";
  return {
    html: `<div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/20">
${o}
<div class="space-y-stack-lg">${i.join("")}</div>
${s}
</div>`
  };
}
function Oe(r, e, t, n = !0, a) {
  const o = 'class="w-full h-14 px-4 pt-2 border border-outline rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-surface-container-lowest"';
  if (t === "textarea")
    return `<div class="floating-label-group">
<textarea id="${N(r)}" name="${N(r)}" rows="5" placeholder=" "${n ? " required" : ""} class="w-full px-4 pt-6 border border-outline rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none bg-surface-container-lowest"></textarea>
<label for="${N(r)}">${k(e)}</label>
</div>`;
  if (t === "select") {
    const i = (a ?? []).map((s) => `<option value="${N(s)}">${k(s)}</option>`).join("");
    return `<div class="floating-label-group">
<select id="${N(r)}" name="${N(r)}"${n ? " required" : ""} class="w-full h-14 px-4 pt-2 pr-10 border border-outline rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all appearance-none bg-surface-container-lowest">
<option value="" disabled selected hidden></option>
${i}
</select>
<label for="${N(r)}">${k(e)}</label>
<div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
<span class="material-symbols-outlined text-outline">expand_more</span>
</div>
</div>`;
  }
  return `<div class="floating-label-group">
<input type="${N(t)}" id="${N(r)}" name="${N(r)}" placeholder=" "${n ? " required" : ""} ${o} />
<label for="${N(r)}">${k(e)}</label>
</div>`;
}
function Tc(r, e) {
  if (!r) return "";
  const t = k(r);
  return `<div class="flex items-start gap-3 py-2">
<input class="w-5 h-5 mt-0.5 text-secondary border-outline rounded focus:ring-secondary" id="cms-form-consent" name="consent" type="checkbox" required />
<label class="text-body-md text-on-surface-variant" for="cms-form-consent">${e ? t.replace(
    /\[link\](.*?)\[\/link\]/g,
    `<a class="text-secondary font-medium underline" href="${N(e)}" target="_blank" rel="noopener noreferrer">$1</a>`
  ) : t.replace(/\[link\](.*?)\[\/link\]/g, "$1")}</label>
</div>`;
}
function Ec(r) {
  const e = r.heading ?? "", t = r.subtitle ?? "", n = r.mode === "mailto" ? "mailto" : "endpoint", a = r.labelName ?? "Full name", o = r.labelEmail ?? "Email", i = r.labelCompany ?? "Company", s = r.labelSubject ?? "Subject", c = r.labelMessage ?? "Message", u = r.submitLabel ?? "Send inquiry", d = r.successMessage ?? "Thanks — we'll get back to you within 24 business hours.", h = r.errorMessage ?? "Something went wrong. Please try again or email us directly.", m = (r.subjectOptions ?? "").split(`
`).map((z) => z.trim()).filter(Boolean), f = m.length > 0, b = e ? `<h3 class="text-h3 font-semibold text-primary mb-2">${k(e)}</h3>` : "", g = t ? `<p class="text-body-md text-on-surface-variant mb-stack-lg">${k(t)}</p>` : "", v = `<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">${Oe("name", a, "text")}${Oe("email", o, "email")}</div>`, x = [Oe("company", i, "text", !1)];
  f && x.push(Oe("subject", s, "select", !0, m));
  const S = `<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">${x.join("")}</div>`, A = Oe("message", c, "textarea"), R = Tc(r.privacyText ?? "", r.privacyHref), O = `<button type="submit" class="w-full md:w-auto px-10 py-4 bg-secondary text-on-secondary rounded-lg text-button font-semibold shadow-lg shadow-secondary/20 hover:bg-secondary/90 hover:shadow-xl transition-all active:scale-[0.98] inline-flex items-center gap-2">${k(u)}<span class="material-symbols-outlined">send</span></button>`, M = `<div class="cms-form-status mt-stack-md text-body-md" data-cms-form-success hidden>${k(d)}</div>
<div class="cms-form-status mt-stack-md text-body-md text-error" data-cms-form-error hidden>${k(h)}</div>`;
  return {
    html: `<div class="bg-surface-container-lowest p-8 lg:p-12 rounded-xl shadow-xl border border-outline-variant/10">
${b}${g}
<form data-cms-form="${N(n)}" data-cms-form-endpoint="${N(r.endpointUrl ?? "")}" data-cms-form-mailto="${N(r.mailtoAddress ?? "")}" class="space-y-stack-md" action="${n === "mailto" && r.mailtoAddress ? `mailto:${N(r.mailtoAddress)}` : "#"}" method="post" novalidate>
${v}
${S}
${A}
${R}
${O}
${M}
</form>
</div>`
  };
}
const It = /<div\s+([^>]*data-cms-block="corporate\/([\w-]+)"[^>]*)>\s*<\/div>/g;
function Lc(r, e) {
  const t = r.match(
    new RegExp(`${e}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`)
  );
  return t ? t[1] ?? t[2] ?? t[3] ?? "" : "";
}
function Mc(r) {
  const e = [];
  It.lastIndex = 0;
  let t;
  for (; (t = It.exec(r)) !== null; )
    e.push({
      match: t[0],
      blockId: t[2],
      attrsRaw: Lc(t[1], "data-attrs"),
      index: t.index
    });
  return e;
}
function Ic(r) {
  switch (r.blockId) {
    case "hero-overlay": {
      const e = Y(r.attrsRaw, {});
      return ln(e).html;
    }
    case "hero-split": {
      const e = Y(r.attrsRaw, {});
      return gc(e).html;
    }
    case "services-grid": {
      const e = Y(r.attrsRaw, {});
      return yc(e).html;
    }
    case "cta-banner": {
      const e = Y(r.attrsRaw, {});
      return xc(e).html;
    }
    case "testimonials": {
      const e = Y(r.attrsRaw, {});
      return cn(e).html;
    }
    case "trust-bar": {
      const e = Y(r.attrsRaw, {});
      return wc(e).html;
    }
    case "stats-grid": {
      const e = Y(r.attrsRaw, {});
      return kc(e).html;
    }
    case "feature-stack": {
      const e = Y(r.attrsRaw, {});
      return Nc(e).html;
    }
    case "contact-info": {
      const e = Y(r.attrsRaw, {});
      return Ac(e).html;
    }
    case "contact-form": {
      const e = Y(r.attrsRaw, {});
      return Ec(e).html;
    }
    default:
      return "";
  }
}
function Hc(r, e) {
  if (!r.includes('data-cms-block="corporate/')) return r;
  const t = Mc(r);
  if (t.length === 0) return r;
  const n = /* @__PURE__ */ new Map();
  for (const s of t)
    n.set(s.index, Ic(s));
  let a = "", o = 0;
  It.lastIndex = 0;
  let i;
  for (; (i = It.exec(r)) !== null; )
    a += r.slice(o, i.index), a += n.get(i.index) ?? "", o = i.index + i[0].length;
  return a += r.slice(o), a;
}
const rn = {
  id: "corporate",
  name: "Corporate",
  version: "0.1.0",
  description: "Modern corporate / SaaS showcase theme — Tailwind-based, navy + indigo Material 3 palette, Inter typography. Built for vitrine sites, lead-gen, and content marketing.",
  // Convention name used by build-themes.mjs only as a fallback when
  // `theme.compiled.css` is missing. The corporate theme uses
  // Tailwind (compiled by build-theme-tailwind.mjs), so this entry is
  // never reached in practice.
  scssEntry: "theme.css",
  cssText: Er,
  jsText: ho,
  jsTextPosts: mo,
  i18n: { en: ko, fr: Co, de: So, es: No, nl: Ao, pt: To, ko: Eo },
  settings: {
    navLabelKey: "title",
    defaultConfig: io,
    component: Ro
  },
  // Bakes the user's Style overrides (color palette, font) into the
  // CSS uploaded by `Sync theme assets`. Without this hook, syncing
  // would push the bundled CSS verbatim and erase the customizations
  // until the next Save & apply from Theme Settings.
  compileCss: (r) => pn(Er, r.style),
  // Image catalog used by the upload pipeline. Mirrors the magazine
  // theme so a site switching between corporate and magazine doesn't
  // have to re-process its media library.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      small: { width: 480, height: 480, fit: "cover" },
      medium: { width: 800, height: 800, fit: "cover" },
      large: { width: 1600, height: 900, fit: "cover" }
    },
    defaultFormat: "medium"
  },
  templates: {
    base: Ga,
    home: so,
    single: lo,
    category: co,
    author: uo,
    notFound: po
  },
  // Editor blocks contributed by the corporate theme. Each ships a
  // Tiptap node + inspector + render.ts producer. The post.html.body
  // filter below glues them together at publish time — see
  // blocks/transforms.ts for the marker → HTML pipeline.
  // Phase 4 (testimonials, trust-bar, stats-grid, feature-stack) and
  // phase 5 (contact-info, contact-form) will append to this list.
  blocks: [
    Hl,
    zl,
    Ul,
    ql,
    Wl,
    Ql,
    rc,
    ic,
    uc,
    fc
  ],
  register(r) {
    r.addFilter(
      "post.html.body",
      (e, ...t) => Hc(e, t[0])
    );
  }
};
export {
  rn as manifest
};
