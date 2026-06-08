import { jsxs as f, Fragment as se, jsx as c } from "react/jsx-runtime";
import { i18n as le, pickPublicLocale as ce, uploadFile as pn, canonicalUrl as Ua, pickFormat as Le, buildTermUrl as fn, SocialIcon as _a, socialLabel as Lr, publishProductsJson as Va, buildSiteContext as qa, renderPageToHtml as Ja, deleteFile as Wa, useCmsData as er, logoPath as Ka, FontSelect as Rr, MediaPicker as Ga, pickMediaUrl as Ya, toast as $, buildAuthorLookup as Xa, buildPublishContext as Za, fetchAllPosts as mt, publishMenuJson as hn, uploadThemeLogo as Qa, removeThemeLogo as eo } from "@flexweg/cms-runtime";
import D, { forwardRef as tr, createElement as gt, useState as U, useRef as to, createRef as ro, memo as no, createContext as mn, version as Pr, useContext as ao } from "react";
import { useTranslation as B } from "react-i18next";
import oo, { flushSync as io } from "react-dom";
function so({ site: r }) {
  const { settings: e } = r, t = le.getFixedT(ce(e.language), "theme-storefront");
  return /* @__PURE__ */ f(se, { children: [
    /* @__PURE__ */ c("header", { className: "sticky top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 h-16", children: /* @__PURE__ */ f("div", { className: "flex justify-between items-center w-full px-gutter md:px-gutter-desktop max-w-container-max mx-auto h-full", children: [
      /* @__PURE__ */ c("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "burger-toggle text-primary",
          "aria-controls": "burger-menu",
          "aria-expanded": "false",
          "aria-label": t("publicBaked.menu"),
          children: /* @__PURE__ */ c("span", { className: "material-symbols-outlined", children: "menu" })
        }
      ) }),
      /* @__PURE__ */ c(
        "a",
        {
          className: "font-serif text-headline-sm font-bold text-primary tracking-tight",
          href: r.homePath ?? "/index.html",
          "data-cms-brand": !0,
          children: e.title
        }
      ),
      /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ c("div", { "data-cms-langswitch": "header", "aria-hidden": "true" }),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            "data-cms-search": !0,
            "aria-label": t("publicBaked.search"),
            className: "w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform",
            children: /* @__PURE__ */ c("span", { className: "material-symbols-outlined", children: "search" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ c(
      "nav",
      {
        id: "burger-menu",
        className: "burger-menu",
        "data-cms-menu": "header",
        "aria-label": t("publicBaked.primaryNavMobile"),
        children: /* @__PURE__ */ c("ul", {})
      }
    )
  ] });
}
const Ot = [
  // Surfaces
  { name: "--color-background", type: "color", group: "surfaces", labelKey: "vars.background", defaultValue: "#fcf9f8" },
  { name: "--color-surface", type: "color", group: "surfaces", labelKey: "vars.surface", defaultValue: "#fcf9f8" },
  { name: "--color-surface-container-lowest", type: "color", group: "surfaces", labelKey: "vars.surfaceLowest", defaultValue: "#ffffff" },
  { name: "--color-surface-container-low", type: "color", group: "surfaces", labelKey: "vars.surfaceLow", defaultValue: "#f6f3f2" },
  { name: "--color-surface-container", type: "color", group: "surfaces", labelKey: "vars.surfaceMid", defaultValue: "#f0eded" },
  { name: "--color-surface-container-high", type: "color", group: "surfaces", labelKey: "vars.surfaceHigh", defaultValue: "#eae7e7" },
  // Foreground
  { name: "--color-on-surface", type: "color", group: "foreground", labelKey: "vars.onSurface", defaultValue: "#1b1c1c" },
  { name: "--color-on-surface-variant", type: "color", group: "foreground", labelKey: "vars.onSurfaceVariant", defaultValue: "#444840" },
  // Outlines
  { name: "--color-outline", type: "color", group: "outlines", labelKey: "vars.outline", defaultValue: "#75786f" },
  { name: "--color-outline-variant", type: "color", group: "outlines", labelKey: "vars.outlineVariant", defaultValue: "#c5c8bd" },
  // Accent — sage primary + terracotta secondary. Defaults match the
  // catalog DESIGN.md exactly.
  { name: "--color-primary", type: "color", group: "accent", labelKey: "vars.primary", defaultValue: "#47573b" },
  { name: "--color-on-primary", type: "color", group: "accent", labelKey: "vars.onPrimary", defaultValue: "#ffffff" },
  { name: "--color-primary-container", type: "color", group: "accent", labelKey: "vars.primaryContainer", defaultValue: "#5f6f52" },
  { name: "--color-on-primary-container", type: "color", group: "accent", labelKey: "vars.onPrimaryContainer", defaultValue: "#dff1cd" },
  { name: "--color-secondary", type: "color", group: "accent", labelKey: "vars.secondary", defaultValue: "#914a36" },
  { name: "--color-on-secondary", type: "color", group: "accent", labelKey: "vars.onSecondary", defaultValue: "#ffffff" },
  { name: "--color-secondary-container", type: "color", group: "accent", labelKey: "vars.secondaryContainer", defaultValue: "#fda288" },
  { name: "--color-on-secondary-container", type: "color", group: "accent", labelKey: "vars.onSecondaryContainer", defaultValue: "#773623" }
], lo = [
  "surfaces",
  "foreground",
  "outlines",
  "accent"
], Re = {
  serif: {
    Newsreader: "Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Source Serif 4": "Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Crimson Pro": "Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Spectral: "Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "DM Serif Display": "DM+Serif+Display:ital,wght@0,400;1,400"
  },
  sans: {
    // Humanist / neutral
    Inter: "Inter:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    // Geometric / modern grotesque
    Outfit: "Outfit:wght@400;500;600;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700",
    // Condensed / narrow
    Oswald: "Oswald:wght@400;500;600;700",
    "Barlow Condensed": "Barlow+Condensed:wght@400;500;600;700",
    "Big Shoulders Display": "Big+Shoulders+Display:wght@400;500;600;700",
    // Heavy display (single weight on Google Fonts — already maximally heavy)
    Anton: "Anton",
    "Archivo Black": "Archivo+Black",
    "Bowlby One": "Bowlby+One",
    // Expressive / sci-fi geometric
    Unbounded: "Unbounded:wght@400;500;600;700"
  }
}, Pe = "Playfair Display", Fe = "Inter", gn = {
  vars: {},
  fontSerif: Pe,
  fontSans: Fe
}, bn = [
  {
    id: "botanical",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {},
    fontSerif: Pe,
    fontSans: Fe
  },
  {
    id: "monochrome",
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
      "--color-primary": "#18181b",
      "--color-on-primary": "#fafafa",
      "--color-primary-container": "#27272a",
      "--color-on-primary-container": "#d4d4d8",
      "--color-secondary": "#52525b",
      "--color-on-secondary": "#fafafa",
      "--color-secondary-container": "#e4e4e7",
      "--color-on-secondary-container": "#27272a"
    },
    fontSerif: "Source Serif 4",
    fontSans: "Inter"
  },
  {
    id: "clay",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fbf3eb",
      "--color-surface": "#fbf3eb",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f3e8db",
      "--color-surface-container": "#e9d9c7",
      "--color-surface-container-high": "#e0ccb2",
      "--color-on-surface": "#2a1810",
      "--color-on-surface-variant": "#5a3e2c",
      "--color-outline": "#8c6e58",
      "--color-outline-variant": "#cfb59d",
      "--color-primary": "#7a3220",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#a4543a",
      "--color-on-primary-container": "#fbe5d4",
      "--color-secondary": "#b8835a",
      "--color-on-secondary": "#ffffff",
      "--color-secondary-container": "#f0c89b",
      "--color-on-secondary-container": "#5a3015"
    },
    fontSerif: "Cormorant Garamond",
    fontSans: "Plus Jakarta Sans"
  },
  {
    id: "pastel",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#fbf6fa",
      "--color-surface": "#fbf6fa",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#f3ebf1",
      "--color-surface-container": "#ebdfe7",
      "--color-surface-container-high": "#e2d2dc",
      "--color-on-surface": "#251a23",
      "--color-on-surface-variant": "#4d3848",
      "--color-outline": "#7e6a78",
      "--color-outline-variant": "#c8b8c1",
      "--color-primary": "#7a4480",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#a06aa6",
      "--color-on-primary-container": "#f5dff8",
      "--color-secondary": "#d97a93",
      "--color-on-secondary": "#ffffff",
      "--color-secondary-container": "#fcd0db",
      "--color-on-secondary-container": "#5a1f30"
    },
    fontSerif: "Lora",
    fontSans: "DM Sans"
  },
  {
    id: "bold",
    swatch: ["--color-background", "--color-surface-container", "--color-primary", "--color-secondary"],
    vars: {
      "--color-background": "#f7f3ed",
      "--color-surface": "#f7f3ed",
      "--color-surface-container-lowest": "#ffffff",
      "--color-surface-container-low": "#efe9e0",
      "--color-surface-container": "#e6dfd2",
      "--color-surface-container-high": "#ddd4c4",
      "--color-on-surface": "#0a1428",
      "--color-on-surface-variant": "#283045",
      "--color-outline": "#5e6783",
      "--color-outline-variant": "#b8bfd1",
      "--color-primary": "#0f1f4a",
      "--color-on-primary": "#ffffff",
      "--color-primary-container": "#1f3068",
      "--color-on-primary-container": "#c4d0f0",
      "--color-secondary": "#c4882d",
      "--color-on-secondary": "#ffffff",
      "--color-secondary-container": "#f4c980",
      "--color-on-secondary-container": "#4a2f08"
    },
    fontSerif: "EB Garamond",
    fontSans: "Outfit"
  }
];
function yn(r, e) {
  var a;
  const t = (a = r.vars) == null ? void 0 : a[e];
  if (t && t.trim()) return t.trim();
  const n = Ot.find((o) => o.name === e);
  return n ? n.defaultValue : "";
}
function co(r) {
  var e;
  for (const t of bn) {
    if (t.fontSerif !== r.fontSerif || t.fontSans !== r.fontSans) continue;
    let n = !0;
    for (const a of Ot) {
      const o = ((e = t.vars[a.name]) == null ? void 0 : e.trim()) || a.defaultValue, i = yn(r, a.name);
      if (o !== i) {
        n = !1;
        break;
      }
    }
    if (n) return t.id;
  }
  return null;
}
function Fr(r, e) {
  const t = {
    ...Re.serif,
    ...Re.sans
  };
  return t[r] ?? t[e];
}
function uo(r, e) {
  const t = Fr(r, Pe), n = Fr(e, Fe);
  return t === n ? `https://fonts.googleapis.com/css2?family=${t}&display=swap` : `https://fonts.googleapis.com/css2?family=${t}&family=${n}&display=swap`;
}
function po() {
  return `https://fonts.googleapis.com/css2?${[
    ...Object.keys(Re.serif),
    ...Object.keys(Re.sans)
  ].map((t) => `family=${t.replace(/ /g, "+")}`).join("&")}&display=swap`;
}
function fo(r) {
  const e = r.trim(), t = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(e);
  if (!t) return e;
  const n = t[1];
  if (n.length === 3) {
    const s = parseInt(n[0] + n[0], 16), l = parseInt(n[1] + n[1], 16), d = parseInt(n[2] + n[2], 16);
    return `${s} ${l} ${d}`;
  }
  const a = parseInt(n.slice(0, 2), 16), o = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16);
  return `${a} ${o} ${i}`;
}
function $r(r) {
  return `"${r.replace(/"/g, '\\"')}"`;
}
function vn(r, e) {
  const t = {};
  for (const [p, h] of Object.entries(e.vars ?? {}))
    h && h.trim() && (t[p] = h.trim());
  const n = e.fontSerif || Pe, a = e.fontSans || Fe, o = n !== Pe || a !== Fe, i = Object.keys(t).length > 0;
  if (!o && !i) return r;
  let s = r;
  if (o) {
    const p = uo(n, a);
    s = s.replace(
      /@import\s*(?:url\(\s*)?"https:\/\/fonts\.googleapis\.com[^"]*"(?:\s*\))?\s*;/,
      `@import url("${p}");`
    );
  }
  const l = new Map(Ot.map((p) => [p.name, p])), d = Object.entries(t).map(([p, h]) => {
    const m = l.get(p), v = (m == null ? void 0 : m.type) === "color" ? fo(h) : h;
    return `${p}:${v};`;
  }).join(""), u = o ? `--font-serif:${$r(n)};--font-sans:${$r(a)};` : "";
  return s += `
:root{${u}${d}}
`, s;
}
async function ho(r) {
  const e = vn(r.baseCssText, r.style);
  await pn({
    path: "theme-assets/storefront.css",
    content: e,
    encoding: "utf-8"
  });
}
const mo = "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1920&q=80", go = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80", bo = "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=800&q=80", yo = "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80", vo = "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80", wo = "https://images.unsplash.com/photo-1490598000245-075175152d25?auto=format&fit=crop&w=1200&q=80", xo = {
  imageUrl: mo,
  imageAlt: "Curated bouquet on a soft cream backdrop",
  eyebrow: "Sustainable & seasonal",
  title: "Artistry in every",
  titleItalicTail: "living stem.",
  subtitle: "Curated seasonal arrangements and rare botanicals delivered from the garden directly to your sanctuary.",
  primaryCtaLabel: "Explore the collection",
  primaryCtaHref: "/catalog.html",
  secondaryCtaLabel: "Our story",
  secondaryCtaHref: "/about.html"
}, wn = {
  enabled: !0,
  eyebrow: "",
  title: "Curated collections",
  subtitle: "Selected by our master florists for every occasion.",
  viewAllLabel: "View all categories",
  viewAllHref: "/catalog.html",
  cards: [
    {
      imageUrl: go,
      imageAlt: "Seasonal bouquet on a marble surface",
      label: "Seasonal blooms",
      ctaLabel: "Shop now",
      ctaHref: "/seasonal/index.html",
      size: "large"
    },
    {
      imageUrl: bo,
      imageAlt: "Dried pampas grass in a terracotta vessel",
      label: "Everlasting",
      ctaLabel: "Shop now",
      ctaHref: "/dried/index.html",
      size: "small"
    },
    {
      imageUrl: yo,
      imageAlt: "Cut flowers on linen",
      label: "Floral rituals",
      ctaLabel: "Subscribe",
      ctaHref: "/subscriptions/index.html",
      size: "small"
    },
    {
      imageUrl: vo,
      imageAlt: "Rare architectural botanicals",
      label: "Rare & unusual",
      ctaLabel: "Explore",
      ctaHref: "/rare/index.html",
      size: "large"
    }
  ]
}, xn = {
  enabled: !0,
  eyebrow: "Trending now",
  title: "Staff favorites for the season",
  mode: "all",
  categoryId: "",
  count: 4
}, kn = {
  enabled: !0,
  imageUrl: wo,
  imageAlt: "Open botanical journal on a wooden table",
  eyebrow: "The journal",
  title: "Cultivating a",
  titleItalicTail: "meaningful life",
  subtitle: "From care tips for your rare botanicals to the history of floral language, our journal explores the deep connection between people and plants.",
  ctaLabel: "Read the journal",
  ctaHref: "/journal.html"
}, qt = {
  enabled: !0,
  eyebrow: "Visit us",
  title: "Our shop",
  imageUrl: "",
  imageAlt: "",
  addressLabel: "Address",
  address: `12 rue de l'Exemple
75001 Paris, France`,
  hoursLabel: "Hours",
  hours: [
    "Mon – Fri: 9:00 – 19:00",
    "Sat: 10:00 – 18:00",
    "Sun: Closed"
  ],
  ctaLabel: "Get directions",
  ctaHref: "https://maps.google.com/?q=12+rue+de+l%27Exemple+75001+Paris"
}, ko = {
  enabled: !1,
  eyebrow: "",
  title: "What our clients say",
  items: [
    {
      authorInitials: "ES",
      authorName: "Eleanor S.",
      authorRole: "Verified collector",
      rating: 5,
      text: "The bouquet arrived perfectly hydrated and lasted nearly two weeks. A true sensory experience.",
      dateLabel: ""
    },
    {
      authorInitials: "JM",
      authorName: "Julian M.",
      authorRole: "Verified collector",
      rating: 5,
      text: "Stunning arrangement. The eucalyptus smells divine. It felt like a piece of high-end art for my dining room.",
      dateLabel: ""
    }
  ]
}, Co = [], ee = {
  showHero: !0,
  hero: xo,
  bento: wn,
  trending: xn,
  categoryRows: Co,
  storeInfo: qt,
  journal: kn,
  reviews: ko
}, rr = {
  showAuthorBio: !1,
  showRelatedProducts: !0,
  relatedTitle: "",
  showCareKit: !0,
  careKitTitle: "Care kit",
  careKitDescription: "Every order includes our signature preservation packet and a curated care guide so your arrangement thrives.",
  careKitItems: [
    "Trimming guide",
    "Organic nutrient food",
    "Cold-chain transport guarantee"
  ]
}, Be = {
  currency: "EUR",
  ctaLabel: "Add to basket",
  ctaHref: "/contact.html",
  inquiryOnly: !1
}, Ce = {
  enabled: !0,
  slug: "catalog.html",
  pageTitle: "Catalog",
  pageHeading: "Our complete catalog",
  pageSubtitle: "Browse every arrangement, filter by category or stock status, and find the right botanical for your space.",
  addToMenu: !0,
  menuLabel: "Catalog",
  filters: {
    showSearch: !0,
    showCategoryFilter: !0,
    showTagFilter: !0,
    showPriceRange: !0,
    showStockFilter: !0,
    showSortBy: !0
  },
  initialColumns: 3,
  lastPublishedPath: "",
  jsonLastGeneratedAt: 0
}, Cn = {
  showSocials: !0,
  tagline: ""
}, Nn = {
  logoEnabled: !1,
  logoUpdatedAt: 0,
  style: gn,
  cssUpdatedAt: 0,
  home: ee,
  single: rr,
  productDefaults: Be,
  catalog: Ce,
  footer: Cn
};
function No({ site: r }) {
  const { settings: e } = r, t = le.getFixedT(ce(e.language), "theme-storefront"), a = (r.themeConfig ?? Nn).footer, o = a.tagline.trim() || e.description || "", i = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ c("footer", { className: "bg-surface-container-highest/40 border-t border-outline-variant/40 pt-section-gap-mobile md:pt-section-gap-desktop pb-stack-lg", children: /* @__PURE__ */ f("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-stack-lg px-gutter md:px-gutter-desktop max-w-container-max mx-auto", children: [
    /* @__PURE__ */ f("div", { className: "md:col-span-4", children: [
      /* @__PURE__ */ c("span", { className: "font-serif text-headline-sm text-primary block mb-stack-md font-bold", children: e.title }),
      o && /* @__PURE__ */ c("p", { className: "text-body-md text-on-surface-variant mb-stack-lg max-w-xs", children: o }),
      a.showSocials && /* @__PURE__ */ f("div", { className: "flex gap-3", "data-cms-footer-socials": !0, children: [
        /* @__PURE__ */ c(
          "a",
          {
            className: "w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-transparent transition-all",
            href: "#",
            "aria-label": t("publicBaked.website"),
            children: /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-[18px]", children: "public" })
          }
        ),
        /* @__PURE__ */ c(
          "a",
          {
            className: "w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-transparent transition-all",
            href: "#",
            "aria-label": t("publicBaked.share"),
            children: /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-[18px]", children: "share" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ c(
      "nav",
      {
        "data-cms-menu": "footer",
        "aria-label": t("publicBaked.footerNav"),
        className: "md:col-span-4 md:col-start-5",
        children: /* @__PURE__ */ c("ul", { className: "flex flex-wrap gap-x-8 gap-y-3 text-body-md text-on-surface-variant" })
      }
    ),
    /* @__PURE__ */ f("div", { className: "md:col-span-12 mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-stack-sm", children: [
      /* @__PURE__ */ f("p", { className: "text-body-md text-on-surface-variant opacity-70", children: [
        "© ",
        i,
        " ",
        e.title
      ] }),
      /* @__PURE__ */ c("div", { "data-cms-langswitch": "footer", "aria-hidden": "true" })
    ] })
  ] }) });
}
function Sn({
  site: r,
  pageTitle: e,
  pageDescription: t,
  ogImage: n,
  currentPath: a,
  currentLocale: o,
  children: i
}) {
  var g;
  const s = (g = r.themeConfig) == null ? void 0 : g.cssUpdatedAt, l = s ? `/${r.themeCssPath}?v=${s}` : `/${r.themeCssPath}`, d = r.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, ""), u = `/theme-assets/${d}-menu.js`, p = `/theme-assets/${d}-posts.js`, h = `/theme-assets/${d}-catalog.js`, m = r.settings.baseUrl && a ? Ua(r.settings.baseUrl, a) : void 0, v = e ? `${e} — ${r.settings.title}` : r.settings.title;
  return /* @__PURE__ */ f("html", { lang: o || r.settings.language || "en", children: [
    /* @__PURE__ */ f("head", { children: [
      /* @__PURE__ */ c("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ c("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ c("title", { children: v }),
      t && /* @__PURE__ */ c("meta", { name: "description", content: t }),
      m && /* @__PURE__ */ c("link", { rel: "canonical", href: m }),
      /* @__PURE__ */ c("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ c("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ c("link", { rel: "stylesheet", href: l }),
      /* @__PURE__ */ c("meta", { property: "og:title", content: v }),
      t && /* @__PURE__ */ c("meta", { property: "og:description", content: t }),
      n && /* @__PURE__ */ c("meta", { property: "og:image", content: n }),
      m && /* @__PURE__ */ c("meta", { property: "og:url", content: m }),
      /* @__PURE__ */ c("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ c("meta", { name: "x-cms-head-extra" })
    ] }),
    /* @__PURE__ */ f("body", { className: "bg-background text-on-surface", children: [
      /* @__PURE__ */ c(so, { site: r }),
      /* @__PURE__ */ c("main", { children: i }),
      /* @__PURE__ */ c(No, { site: r }),
      /* @__PURE__ */ c("script", { src: u, defer: !0 }),
      /* @__PURE__ */ c("script", { src: p, defer: !0 }),
      /* @__PURE__ */ c("script", { src: h, defer: !0 }),
      /* @__PURE__ */ c("script", { type: "application/x-cms-body-end" })
    ] })
  ] });
}
const So = "storefront";
function An(r) {
  if (r == null) return "";
  try {
    const e = JSON.stringify(r);
    return typeof window > "u" ? Buffer.from(e, "utf-8").toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  } catch {
    return "";
  }
}
function re(r, e) {
  if (!r || typeof r != "string") return e;
  try {
    let t;
    return typeof window > "u" ? t = Buffer.from(r, "base64").toString("utf-8") : t = decodeURIComponent(escape(window.atob(r))), JSON.parse(t);
  } catch {
    return e;
  }
}
function Tn(r) {
  return `storefront${r.charAt(0).toUpperCase()}${r.slice(1)}`;
}
function C(r) {
  return typeof r != "string" ? "" : r.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function x(r) {
  return typeof r != "string" ? "" : r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function _e(r, e, t = "en") {
  if (typeof r != "number" || Number.isNaN(r)) return "";
  try {
    return new Intl.NumberFormat(t, {
      style: "currency",
      currency: e || "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(r);
  } catch {
    return `${r.toFixed(2)} ${e || ""}`.trim();
  }
}
function En(r) {
  if (!r.title && !r.subtitle && !r.imageUrl)
    return { html: "" };
  const e = r.imageUrl ? `<img class="w-full h-full object-cover" src="${C(r.imageUrl)}" alt="${C(r.imageAlt ?? "")}" loading="eager" fetchpriority="high" />` : "", t = r.eyebrow ? `<span class="inline-block font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">${x(r.eyebrow)}</span>` : "", n = r.title ? `<h1 class="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-md leading-tight">${x(r.title)}${r.titleItalicTail ? `<br/><span class="display-italic">${x(r.titleItalicTail)}</span>` : ""}</h1>` : "", a = r.subtitle ? `<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md">${x(r.subtitle)}</p>` : "", o = r.primaryCtaLabel && r.primaryCtaHref ? `<a href="${C(r.primaryCtaHref)}" class="bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all">${x(r.primaryCtaLabel)}</a>` : "", i = r.secondaryCtaLabel && r.secondaryCtaHref ? `<a href="${C(r.secondaryCtaHref)}" class="border border-secondary text-secondary px-8 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container hover:border-transparent transition-all">${x(r.secondaryCtaLabel)}</a>` : "", s = o || i ? `<div class="flex flex-wrap gap-stack-md">${o}${i}</div>` : "";
  return {
    html: `<section class="relative min-h-[600px] md:min-h-[760px] flex items-center overflow-hidden">
<div class="absolute inset-0 z-0">${e}<div class="absolute inset-0 bg-black/10"></div></div>
<div class="relative z-10 w-full px-gutter md:px-gutter-desktop max-w-container-max mx-auto py-section-gap-mobile md:py-section-gap-desktop"><div class="max-w-2xl bg-surface/85 backdrop-blur-md p-8 md:p-12 lg:p-16 rounded-3xl border border-surface-container-high shadow-2xl">${t}${n}${a}${s}</div></div>
</section>`
  };
}
function In(r) {
  const e = Array.isArray(r.cards) ? r.cards : [];
  if (e.length === 0) return { html: "" };
  const t = r.title || r.subtitle || r.viewAllLabel ? `<div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md">
<div>${r.eyebrow ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${x(r.eyebrow)}</p>` : ""}${r.title ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface mb-2">${x(r.title)}</h2>` : ""}${r.subtitle ? `<p class="font-body-md text-body-md text-on-surface-variant max-w-xl">${x(r.subtitle)}</p>` : ""}</div>${r.viewAllLabel && r.viewAllHref ? `<a class="font-label-caps text-label-caps text-primary border-b border-primary pb-1 uppercase tracking-widest hover:text-primary-container transition-colors" href="${C(r.viewAllHref)}">${x(r.viewAllLabel)}</a>` : ""}</div>` : "", n = e.map((a) => {
    const o = a.size === "large" ? "md:col-span-8" : "md:col-span-4", i = a.ctaLabel && a.ctaHref ? `<a href="${C(a.ctaHref)}" class="font-label-caps text-label-caps text-on-primary inline-flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest">${x(a.ctaLabel)}<span class="material-symbols-outlined text-sm">arrow_forward</span></a>` : "";
    return `<div class="${o} group relative overflow-hidden rounded-3xl bg-surface-container shadow-sm hover:shadow-xl transition-all duration-500 min-h-[280px] md:min-h-0">
<img alt="${C(a.imageAlt ?? "")}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${C(a.imageUrl)}" loading="lazy" />
<div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"></div>
<div class="absolute bottom-6 left-6 right-6 text-on-primary">${a.label ? `<h3 class="display-serif text-headline-sm mb-2">${x(a.label)}</h3>` : ""}${i}</div>
</div>`;
  }).join("");
  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${t}<div class="grid grid-cols-1 md:grid-cols-12 gap-stack-md md:gap-stack-lg auto-rows-[280px] md:auto-rows-[300px]">${n}</div></section>`
  };
}
function Mn(r) {
  if (!r.title && !r.subtitle && !r.imageUrl)
    return { html: "" };
  const e = r.imageUrl ? `<div class="relative">
<div class="aspect-square rounded-3xl overflow-hidden shadow-2xl">
<img alt="${C(r.imageAlt ?? "")}" class="w-full h-full object-cover" src="${C(r.imageUrl)}" loading="lazy" />
</div>
<div class="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
</div>` : "", t = r.eyebrow ? `<p class="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">${x(r.eyebrow)}</p>` : "", n = r.title ? `<h2 class="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-md leading-tight">${x(r.title)}${r.titleItalicTail ? `<br/><span class="display-italic">${x(r.titleItalicTail)}</span>` : ""}</h2>` : "", a = r.subtitle ? `<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">${x(r.subtitle)}</p>` : "", o = r.ctaLabel && r.ctaHref ? `<a class="inline-flex items-center gap-stack-md group" href="${C(r.ctaHref)}">
<div class="w-12 h-12 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
<span class="material-symbols-outlined text-base">arrow_forward</span>
</div>
<span class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">${x(r.ctaLabel)}</span>
</a>` : "";
  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg md:gap-16 items-center">${e}<div>${t}${n}${a}${o}</div></div>
</section>`
  };
}
function Ao(r) {
  return r.split(/\r?\n/).map((e) => e.trim()).filter(Boolean).map((e) => x(e)).join("<br/>");
}
function To(r) {
  if (!(!!r.title || !!r.address || Array.isArray(r.hours) && r.hours.length > 0)) return { html: "" };
  const t = r.eyebrow ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${x(r.eyebrow)}</p>` : "", n = r.title ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface mb-stack-lg">${x(r.title)}</h2>` : "";
  let a;
  r.imageUrl ? a = `<div class="md:col-span-7 aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden bg-surface-container">
<img src="${C(r.imageUrl)}" alt="${C(r.imageAlt ?? "")}" class="w-full h-full object-cover" loading="lazy" />
</div>` : r.address && r.address.trim() ? a = `<div class="md:col-span-7 aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden bg-surface-container">
<iframe src="https://www.google.com/maps?q=${encodeURIComponent(r.address.replace(/\r?\n/g, ", ").trim())}&z=15&output=embed" class="w-full h-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${C(r.title ?? "Map")}"></iframe>
</div>` : a = `<div class="md:col-span-7 aspect-video md:aspect-auto md:min-h-[360px] bg-primary-fixed relative flex items-center justify-center overflow-hidden">
<div class="absolute inset-0 opacity-40" style="background-image: radial-gradient(rgb(var(--color-primary)) 1.5px, transparent 1.5px); background-size: 20px 20px;"></div>
<div class="relative z-10 flex flex-col items-center gap-3 text-primary">
<span class="material-symbols-outlined" style="font-size: 4rem;">location_on</span>
<span class="font-label-caps text-label-caps uppercase tracking-widest font-semibold">View map</span>
</div>
</div>`;
  const o = r.address ? Ao(r.address) : "", i = o ? `<div>
<h4 class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${x(r.addressLabel ?? "")}</h4>
<p class="font-body-lg text-on-surface leading-relaxed">${o}</p>
</div>` : "", s = (r.hours ?? []).filter(Boolean), l = s.length > 0 ? `<div>
<h4 class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${x(r.hoursLabel ?? "")}</h4>
<ul class="text-on-surface-variant text-body-md space-y-1">${s.map((u) => `<li>${x(u)}</li>`).join("")}</ul>
</div>` : "", d = r.ctaLabel && r.ctaHref ? `<a href="${C(r.ctaHref)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 self-start bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all">
<span class="material-symbols-outlined text-base">directions</span>${x(r.ctaLabel)}
</a>` : "";
  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${t}${n}
<div class="bg-surface-container-low overflow-hidden rounded-3xl border border-outline-variant/20 shadow-sm grid grid-cols-1 md:grid-cols-12">${a}
<div class="md:col-span-5 p-6 md:p-8 flex flex-col gap-stack-lg">${i}${l}${d}</div>
</div>
</section>`
  };
}
function Eo(r) {
  if (!r.eyebrow && !r.title && !r.viewAllLabel) return "";
  const e = r.eyebrow ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${x(r.eyebrow)}</p>` : "", t = r.title ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface">${x(r.title)}</h2>` : "", n = r.viewAllLabel && r.viewAllHref ? `<a class="font-label-caps text-label-caps text-primary border-b border-primary pb-1 uppercase tracking-widest hover:text-primary-container transition-colors shrink-0" href="${C(r.viewAllHref)}">${x(r.viewAllLabel)}</a>` : "";
  return !r.title && !r.viewAllLabel ? `<div class="text-center mb-stack-lg">${e}${t}</div>` : `<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md mb-stack-lg">
<div>${e}${t}</div>${n}</div>`;
}
function Io(r, e) {
  const t = r.badge ? `<span class="absolute top-3 left-3 bg-secondary/90 text-on-secondary text-label-caps font-semibold px-3 py-1 rounded-full backdrop-blur uppercase tracking-widest">${x(r.badge)}</span>` : "", n = e ? `<a href="${C(r.url)}" class="absolute bottom-0 left-0 right-0 bg-primary/90 text-on-primary text-center py-3 font-label-caps text-label-caps uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">${x(e)}</a>` : "", a = r.priceLabel ? r.promoLabel ? `<p class="font-label-caps text-label-caps"><span class="storefront-price-promo">${x(r.promoLabel)}</span><span class="storefront-price-strike">${x(r.priceLabel)}</span></p>` : `<p class="font-label-caps text-label-caps text-primary font-bold">${x(r.priceLabel)}</p>` : "";
  return `<article class="storefront-product-card flex flex-col group">
<div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-stack-md shadow-sm">
<a href="${C(r.url)}" class="block w-full h-full">${r.imageUrl ? `<img src="${C(r.imageUrl)}" alt="${C(r.imageAlt ?? r.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />` : ""}</a>${t}${n}</div>
<h3 class="display-serif text-[1.125rem] text-on-surface leading-tight mb-1"><a href="${C(r.url)}" class="hover:text-primary transition-colors">${x(r.title)}</a></h3>${r.subtitle ? `<p class="font-body-md text-body-md text-on-surface-variant mb-stack-sm">${x(r.subtitle)}</p>` : ""}${a}</article>`;
}
function Br(r) {
  const { attrs: e, cards: t, quickAddLabel: n } = r;
  if (t.length === 0) return { html: "" };
  const a = e.layout ?? "grid", i = (e.variant ?? "band") === "band" ? "bg-surface-container-low py-section-gap-mobile md:py-section-gap-desktop" : "py-section-gap-mobile md:py-section-gap-desktop", s = t.map((d) => Io(d, n)).join(""), l = a === "slider" ? `<div class="relative">
<div data-cms-row-track class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-stack-md md:gap-stack-lg storefront-no-scrollbar pb-2">${s.replace(
    /<article class="storefront-product-card/g,
    '<article class="storefront-product-card storefront-row-slide snap-start'
  )}</div>
<button type="button" data-cms-row-prev aria-label="${C(r.prevAriaLabel ?? "Previous")}" class="hidden md:flex absolute top-1/3 -left-4 w-10 h-10 rounded-full bg-surface shadow-lg border border-outline-variant text-primary items-center justify-center hover:bg-surface-container transition-colors z-10"><span class="material-symbols-outlined">chevron_left</span></button>
<button type="button" data-cms-row-next aria-label="${C(r.nextAriaLabel ?? "Next")}" class="hidden md:flex absolute top-1/3 -right-4 w-10 h-10 rounded-full bg-surface shadow-lg border border-outline-variant text-primary items-center justify-center hover:bg-surface-container transition-colors z-10"><span class="material-symbols-outlined">chevron_right</span></button>
</div>` : `<div class="grid grid-cols-2 md:grid-cols-4 gap-stack-md md:gap-stack-lg">${s}</div>`;
  return {
    html: `<section class="${i}">
<div class="max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${Eo(e)}${l}</div>
</section>`
  };
}
function Jt(r, e, t, n) {
  if (n) return { priceLabel: "", promoLabel: "", badge: "" };
  const a = Ln(r);
  if (!a) return { priceLabel: "", promoLabel: "", badge: "" };
  const { attrs: o } = a, i = o.currency || t || "EUR", s = o.priceTTC ?? 0, l = o.promoTTC ?? 0, d = l > 0 && l < s;
  return {
    priceLabel: s > 0 ? _e(s, i, e) : "",
    promoLabel: d ? _e(l, i, e) : "",
    badge: Array.isArray(o.badges) && o.badges.length > 0 ? o.badges[0] : ""
  };
}
const Mo = {
  "in-stock": "storefront-stock-in",
  "low-stock": "storefront-stock-low",
  "out-of-stock": "storefront-stock-out",
  "on-order": "storefront-stock-order"
}, On = /<div\s+([^>]*data-cms-block="storefront\/product-info"[^>]*)>\s*<\/div>/;
function Ln(r) {
  const e = r.match(On);
  if (!e) return null;
  const t = e[1].match(
    /data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/
  ), n = t ? t[1] ?? t[2] ?? t[3] ?? "" : "";
  return { attrs: re(n, st), markerMatch: e[0] };
}
function Oo(r) {
  return r.replace(On, "");
}
const st = {
  priceHT: 0,
  priceTTC: 0,
  promoTTC: 0,
  currency: "",
  stockStatus: "",
  variants: [],
  ctaPrimaryLabel: "",
  ctaPrimaryHref: "",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
  badges: []
};
function Lo(r) {
  const { attrs: e, labels: t, locale: n, defaults: a } = r, o = e.currency || a.currency || "EUR", i = a.inquiryOnly === !0, s = e.badges && e.badges.length > 0 ? `<div class="flex flex-wrap gap-2 mb-stack-md">${e.badges.map(
    (y) => `<span class="font-label-caps text-label-caps text-secondary bg-secondary-fixed/40 px-3 py-1 rounded-full uppercase tracking-widest">${x(y)}</span>`
  ).join("")}</div>` : "";
  let l = "";
  !i && e.priceTTC > 0 && (e.promoTTC > 0 && e.promoTTC < e.priceTTC ? l = `<div class="flex items-baseline gap-stack-md mb-stack-md">
<p class="display-serif text-headline-md text-secondary">${x(_e(e.promoTTC, o, n))}</p>
<p class="text-on-surface-variant line-through text-body-md">${x(_e(e.priceTTC, o, n))}</p>
</div>` : l = `<p class="display-serif text-headline-md text-primary mb-stack-md">${x(_e(e.priceTTC, o, n))}</p>`);
  const d = e.stockStatus ? `<p class="${Mo[e.stockStatus] ?? "storefront-stock-pill"} mb-stack-md storefront-stock-pill">${x(Ro(e.stockStatus, t))}</p>` : "", u = e.variants && e.variants.length > 0 ? `<div class="grid ${e.variants.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-stack-md mb-stack-md">${e.variants.map(
    (y) => `<div><label class="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">${x(y.label)}</label><select name="variant_${C(y.label.toLowerCase().replace(/\s+/g, "_"))}" class="w-full bg-surface border border-outline-variant rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none">${y.options.map((b) => `<option>${x(b)}</option>`).join("")}</select></div>`
  ).join("")}</div>` : "", p = e.ctaPrimaryLabel || a.ctaLabel, h = e.ctaPrimaryHref || a.ctaHref, m = p && h ? `<a href="${C(h)}" class="block w-full text-center bg-primary text-on-primary py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg">${x(p)}</a>` : "", v = e.ctaSecondaryLabel && e.ctaSecondaryHref ? `<a href="${C(e.ctaSecondaryHref)}" class="block w-full text-center border border-secondary text-secondary py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed hover:border-transparent transition-all">${x(e.ctaSecondaryLabel)}</a>` : "", g = m || v ? `<div class="space-y-stack-sm">${m}${v}</div>` : "";
  return [
    s,
    l,
    d,
    '<div class="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/30">',
    u,
    g,
    "</div>"
  ].join("");
}
function Ro(r, e) {
  switch (r) {
    case "in-stock":
      return e.inStock;
    case "low-stock":
      return e.lowStock;
    case "out-of-stock":
      return e.outOfStock;
    case "on-order":
      return e.onOrder;
    default:
      return "";
  }
}
function Po({
  posts: r,
  staticPage: e,
  site: t
}) {
  var N, A, R, P, L;
  const n = le.getFixedT(ce(t.settings.language), "theme-storefront");
  if (e)
    return /* @__PURE__ */ c(
      "div",
      {
        className: "storefront-static-home",
        dangerouslySetInnerHTML: { __html: e.bodyHtml }
      }
    );
  const a = t.themeConfig, o = {
    ...Be,
    ...(a == null ? void 0 : a.productDefaults) ?? {}
  }, i = t.settings.language || "en", s = {
    ...ee,
    ...(a == null ? void 0 : a.home) ?? {},
    hero: { ...ee.hero, ...((N = a == null ? void 0 : a.home) == null ? void 0 : N.hero) ?? {} },
    bento: { ...ee.bento, ...((A = a == null ? void 0 : a.home) == null ? void 0 : A.bento) ?? {} },
    trending: {
      ...ee.trending,
      ...((R = a == null ? void 0 : a.home) == null ? void 0 : R.trending) ?? {}
    },
    journal: {
      ...ee.journal,
      ...((P = a == null ? void 0 : a.home) == null ? void 0 : P.journal) ?? {}
    },
    reviews: {
      ...ee.reviews,
      ...((L = a == null ? void 0 : a.home) == null ? void 0 : L.reviews) ?? {}
    }
  }, l = s.showHero ? En(s.hero).html : "", d = s.bento.enabled ? In({
    eyebrow: s.bento.eyebrow,
    title: s.bento.title,
    subtitle: s.bento.subtitle,
    viewAllLabel: s.bento.viewAllLabel,
    viewAllHref: s.bento.viewAllHref,
    cards: s.bento.cards
  }).html : "";
  let u = r;
  if (s.trending.enabled && s.trending.mode === "category" && s.trending.categoryId) {
    const S = r.filter((z) => z.primaryTermId === s.trending.categoryId);
    S.length > 0 && (u = S);
  }
  u = u.slice(0, Math.max(1, s.trending.count));
  const p = u.map((S) => {
    var ie;
    const z = Jt(
      S.contentMarkdown ?? "",
      i,
      o.currency,
      o.inquiryOnly
    );
    return {
      url: `/${S.url}`,
      title: S.title,
      subtitle: S.excerpt ?? "",
      imageUrl: S.hero ? Le(S.hero, "medium") : "",
      imageAlt: ((ie = S.hero) == null ? void 0 : ie.alt) ?? S.title,
      priceLabel: z.priceLabel,
      promoLabel: z.promoLabel,
      badge: z.badge
    };
  }), h = s.trending.enabled && p.length > 0 ? Br({
    attrs: {
      eyebrow: s.trending.eyebrow,
      title: s.trending.title,
      variant: "band"
    },
    cards: p,
    quickAddLabel: n("publicBaked.quickAdd")
  }).html : "", v = (Array.isArray(s.categoryRows) ? s.categoryRows : []).filter((S) => S.enabled).map((S) => {
    var Ir, Mr;
    const ie = (S.categoryId ? r.filter((Y) => Y.primaryTermId === S.categoryId) : r).slice(0, Math.max(1, S.count));
    if (ie.length === 0) return "";
    const Ha = ie.map((Y) => {
      var Or;
      const Pt = Jt(
        Y.contentMarkdown ?? "",
        i,
        o.currency,
        o.inquiryOnly
      );
      return {
        url: `/${Y.url}`,
        title: Y.title,
        subtitle: Y.excerpt ?? "",
        imageUrl: Y.hero ? Le(Y.hero, "medium") : "",
        imageAlt: ((Or = Y.hero) == null ? void 0 : Or.alt) ?? Y.title,
        priceLabel: Pt.priceLabel,
        promoLabel: Pt.promoLabel,
        badge: Pt.badge
      };
    }), Er = (Mr = (Ir = ie.find((Y) => Y.category)) == null ? void 0 : Ir.category) == null ? void 0 : Mr.url, ja = S.viewAllHref || (Er ? `/${Er}` : ""), Da = S.viewAllLabel || "";
    return Br({
      attrs: {
        eyebrow: S.eyebrow,
        title: S.title,
        viewAllLabel: Da,
        viewAllHref: ja,
        layout: S.layout,
        variant: "plain"
      },
      cards: Ha,
      quickAddLabel: n("publicBaked.quickAdd"),
      prevAriaLabel: n("publicBaked.previous"),
      nextAriaLabel: n("publicBaked.next")
    }).html;
  }).filter(Boolean).join(""), g = s.storeInfo, y = g != null && g.enabled ? To({
    eyebrow: g.eyebrow,
    title: g.title,
    imageUrl: g.imageUrl,
    imageAlt: g.imageAlt,
    addressLabel: g.addressLabel,
    address: g.address,
    hoursLabel: g.hoursLabel,
    hours: g.hours,
    ctaLabel: g.ctaLabel,
    ctaHref: g.ctaHref
  }).html : "", b = s.journal.enabled ? Mn({
    imageUrl: s.journal.imageUrl,
    imageAlt: s.journal.imageAlt,
    eyebrow: s.journal.eyebrow,
    title: s.journal.title,
    titleItalicTail: s.journal.titleItalicTail,
    subtitle: s.journal.subtitle,
    ctaLabel: s.journal.ctaLabel,
    ctaHref: s.journal.ctaHref
  }).html : "";
  return /* @__PURE__ */ f(se, { children: [
    l && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: l } }),
    d && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: d } }),
    h && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: h } }),
    v && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: v } }),
    y && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: y } }),
    b && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: b } })
  ] });
}
function Fo({
  post: r,
  bodyHtml: e,
  hero: t,
  primaryTerm: n,
  tags: a,
  site: o
}) {
  const i = le.getFixedT(ce(o.settings.language), "theme-storefront"), s = o.themeConfig, l = { ...rr, ...(s == null ? void 0 : s.single) ?? {} }, d = {
    ...Be,
    ...(s == null ? void 0 : s.productDefaults) ?? {}
  };
  if (r.type === "page")
    return /* @__PURE__ */ c("article", { className: "pt-stack-md pb-section-gap-desktop", children: /* @__PURE__ */ c(
      "div",
      {
        className: "storefront-page-body",
        dangerouslySetInnerHTML: { __html: e }
      }
    ) });
  const p = Ln(e), h = p ? Oo(e) : e, m = p ? Lo({
    attrs: p.attrs,
    labels: {
      inStock: i("publicBaked.inStock"),
      lowStock: i("publicBaked.lowStock"),
      outOfStock: i("publicBaked.outOfStock"),
      onOrder: i("publicBaked.onOrder"),
      promoBadge: i("publicBaked.promoBadge"),
      priceHT: i("publicBaked.priceHT"),
      priceTTC: i("publicBaked.priceTTC")
    },
    locale: o.settings.language || "en",
    defaults: {
      currency: d.currency,
      ctaLabel: d.ctaLabel,
      ctaHref: d.ctaHref,
      inquiryOnly: d.inquiryOnly
    }
  }) : "";
  return /* @__PURE__ */ f("article", { className: "max-w-container-max mx-auto px-gutter md:px-gutter-desktop pt-stack-lg pb-section-gap-desktop", children: [
    /* @__PURE__ */ f("nav", { className: "flex items-center gap-2 mb-stack-lg text-on-surface-variant text-label-caps font-semibold uppercase tracking-widest", children: [
      /* @__PURE__ */ c("a", { className: "hover:text-primary transition-colors", href: o.homePath ?? "/index.html", children: i("publicBaked.home") }),
      /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-[14px]", children: "chevron_right" }),
      n ? /* @__PURE__ */ f(se, { children: [
        /* @__PURE__ */ c(
          "a",
          {
            className: "hover:text-primary transition-colors",
            href: `/${fn(n)}`,
            children: n.name
          }
        ),
        /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-[14px]", children: "chevron_right" })
      ] }) : null,
      /* @__PURE__ */ c("span", { className: "text-primary", children: r.title })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-stack-lg mb-section-gap-mobile lg:mb-section-gap-desktop", children: [
      /* @__PURE__ */ c("div", { className: "lg:col-span-7", children: t && /* @__PURE__ */ c("div", { className: "aspect-[4/5] overflow-hidden rounded-3xl bg-surface-container-low shadow-sm sticky top-24", children: /* @__PURE__ */ c(
        "img",
        {
          src: Le(t, "large"),
          alt: t.alt ?? r.title,
          className: "w-full h-full object-cover",
          fetchPriority: "high"
        }
      ) }) }),
      /* @__PURE__ */ f("div", { className: "lg:col-span-5 flex flex-col", children: [
        /* @__PURE__ */ c("h1", { className: "display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight", children: r.title }),
        r.excerpt && /* @__PURE__ */ c("p", { className: "text-body-lg text-on-surface-variant leading-relaxed mb-stack-lg", children: r.excerpt }),
        m && /* @__PURE__ */ c("div", { dangerouslySetInnerHTML: { __html: m } })
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-stack-lg", children: [
      /* @__PURE__ */ f("div", { className: l.showCareKit ? "lg:col-span-8" : "lg:col-span-12", children: [
        /* @__PURE__ */ c(
          "div",
          {
            className: "storefront-prose",
            dangerouslySetInnerHTML: { __html: h }
          }
        ),
        a.length > 0 && /* @__PURE__ */ c("div", { className: "mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-wrap gap-2", children: a.map((v) => /* @__PURE__ */ f(
          "span",
          {
            className: "px-3 py-1 bg-surface-container-high rounded-full text-label-caps font-semibold text-primary uppercase tracking-widest",
            children: [
              "#",
              v.name
            ]
          },
          v.id
        )) })
      ] }),
      l.showCareKit && /* @__PURE__ */ c("aside", { className: "lg:col-span-4", children: /* @__PURE__ */ f("div", { className: "lg:sticky lg:top-24 p-6 md:p-8 bg-surface-container-highest/40 rounded-3xl border border-outline-variant/30", children: [
        /* @__PURE__ */ c("h4", { className: "display-serif text-headline-sm text-primary mb-stack-sm", children: l.careKitTitle }),
        l.careKitDescription && /* @__PURE__ */ c("p", { className: "font-body-md text-on-surface-variant mb-stack-md", children: l.careKitDescription }),
        l.careKitItems && l.careKitItems.length > 0 && /* @__PURE__ */ c("ul", { className: "space-y-stack-sm", children: l.careKitItems.map((v, g) => /* @__PURE__ */ f(
          "li",
          {
            className: "flex items-center gap-stack-sm text-on-surface",
            children: [
              /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-primary text-base", children: "check_circle" }),
              /* @__PURE__ */ c("span", { className: "text-body-md", children: v })
            ]
          },
          g
        )) })
      ] }) })
    ] }),
    l.showAuthorBio && r.authorId && /* @__PURE__ */ c(
      "section",
      {
        className: "mt-section-gap-mobile lg:mt-section-gap-desktop",
        "data-cms-author-bio": !0,
        "data-cms-author-id": r.authorId,
        "data-cms-bio-label": i("publicBaked.aboutFlorist"),
        hidden: !0
      }
    ),
    l.showRelatedProducts && /* @__PURE__ */ c(
      "section",
      {
        className: "mt-section-gap-mobile lg:mt-section-gap-desktop",
        "data-cms-related": !0,
        "data-cms-current-id": r.id,
        "data-cms-term-id": r.primaryTermId ?? "",
        "data-cms-limit": "4",
        "data-cms-label": l.relatedTitle.trim() || i("publicBaked.curatedPairings"),
        "data-cms-fallback-label": l.relatedTitle.trim() || i("publicBaked.curatedPairings")
      }
    )
  ] });
}
function $o({
  term: r,
  posts: e,
  allCategories: t,
  categoryRssUrl: n,
  archivesLink: a,
  site: o
}) {
  const i = le.getFixedT(ce(o.settings.language), "theme-storefront"), s = o.themeConfig, l = {
    ...Be,
    ...(s == null ? void 0 : s.productDefaults) ?? {}
  }, d = o.settings.language || "en";
  return /* @__PURE__ */ f("main", { className: "max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-stack-lg md:py-stack-lg pb-section-gap-desktop", children: [
    /* @__PURE__ */ f("nav", { className: "flex items-center gap-2 mb-stack-lg text-on-surface-variant text-label-caps font-semibold uppercase tracking-widest", children: [
      /* @__PURE__ */ c("a", { className: "hover:text-primary transition-colors", href: o.homePath ?? "/index.html", children: i("publicBaked.home") }),
      /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-[14px]", children: "chevron_right" }),
      /* @__PURE__ */ c("span", { className: "text-primary", children: r.name })
    ] }),
    /* @__PURE__ */ f("header", { className: "mb-stack-lg", children: [
      /* @__PURE__ */ c("h1", { className: "display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight", children: r.name }),
      r.description && /* @__PURE__ */ c("p", { className: "text-body-lg text-on-surface-variant max-w-2xl", children: r.description }),
      /* @__PURE__ */ c("p", { className: "text-on-surface-variant text-body-md mt-stack-md", children: e.length === 1 ? i("publicBaked.productCountOne") : i("publicBaked.productCount", { count: e.length }) })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-stack-lg", children: [
      /* @__PURE__ */ c("aside", { className: "lg:col-span-3", children: /* @__PURE__ */ f("div", { className: "lg:sticky lg:top-24 space-y-stack-lg", children: [
        t && t.length > 0 && /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ c("h3", { className: "font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md", children: i("publicBaked.allCategories") }),
          /* @__PURE__ */ c("ul", { className: "space-y-stack-sm", children: t.map((u) => {
            const p = u.id === r.id;
            return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(
              "a",
              {
                href: `/${fn(u)}`,
                className: p ? "block py-1 text-primary font-bold border-l-2 border-primary pl-3" : "block py-1 text-on-surface-variant hover:text-primary transition-colors pl-3 border-l-2 border-transparent",
                children: u.name
              }
            ) }, u.id);
          }) })
        ] }),
        n && /* @__PURE__ */ f(
          "a",
          {
            href: n,
            className: "inline-flex items-center gap-stack-sm text-primary hover:text-secondary transition-colors text-label-caps uppercase tracking-widest",
            children: [
              /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-base", children: "rss_feed" }),
              i("publicBaked.follow")
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ f("section", { className: "lg:col-span-9", children: [
        e.length === 0 ? /* @__PURE__ */ c("p", { className: "text-on-surface-variant italic py-section-gap-mobile text-center", children: i("publicBaked.noPostsCategory") }) : /* @__PURE__ */ c("div", { className: "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-stack-md md:gap-stack-lg", children: e.map((u) => {
          const p = Jt(
            u.contentMarkdown ?? "",
            d,
            l.currency,
            l.inquiryOnly
          );
          return /* @__PURE__ */ f(
            "article",
            {
              className: "storefront-product-card flex flex-col group",
              children: [
                /* @__PURE__ */ f("div", { className: "relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-stack-md shadow-sm", children: [
                  /* @__PURE__ */ c("a", { href: `/${u.url}`, className: "block w-full h-full", children: u.hero && /* @__PURE__ */ c(
                    "img",
                    {
                      src: Le(u.hero, "medium"),
                      alt: u.hero.alt ?? u.title,
                      className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                      loading: "lazy"
                    }
                  ) }),
                  p.badge && /* @__PURE__ */ c("span", { className: "absolute top-3 left-3 bg-secondary/90 text-on-secondary text-label-caps font-semibold px-3 py-1 rounded-full backdrop-blur uppercase tracking-widest", children: p.badge })
                ] }),
                /* @__PURE__ */ c("h3", { className: "display-serif text-[1.125rem] text-on-surface leading-tight mb-1", children: /* @__PURE__ */ c(
                  "a",
                  {
                    href: `/${u.url}`,
                    className: "hover:text-primary transition-colors",
                    children: u.title
                  }
                ) }),
                u.excerpt && /* @__PURE__ */ c("p", { className: "font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-1", children: u.excerpt }),
                p.priceLabel && /* @__PURE__ */ c("p", { className: "font-label-caps text-label-caps", children: p.promoLabel ? /* @__PURE__ */ f(se, { children: [
                  /* @__PURE__ */ c("span", { className: "storefront-price-promo", children: p.promoLabel }),
                  /* @__PURE__ */ c("span", { className: "storefront-price-strike", children: p.priceLabel })
                ] }) : /* @__PURE__ */ c("span", { className: "text-primary font-bold", children: p.priceLabel }) })
              ]
            },
            u.id
          );
        }) }),
        a && /* @__PURE__ */ c("div", { className: "mt-stack-lg flex justify-center", children: /* @__PURE__ */ c("a", { className: "archives-link", href: a.href, children: a.label }) })
      ] })
    ] })
  ] });
}
function Bo({
  author: r,
  posts: e,
  site: t
}) {
  const n = le.getFixedT(ce(t.settings.language), "theme-storefront"), a = r.avatar ? Le(r.avatar, "medium") : "";
  return /* @__PURE__ */ f(se, { children: [
    /* @__PURE__ */ c("header", { className: "bg-surface-container-low py-section-gap-mobile md:py-section-gap-desktop", children: /* @__PURE__ */ c("div", { className: "max-w-container-max mx-auto px-gutter md:px-gutter-desktop", children: /* @__PURE__ */ f("div", { className: "flex flex-col items-center text-center max-w-2xl mx-auto", children: [
      a && /* @__PURE__ */ c("div", { className: "w-32 h-32 rounded-full overflow-hidden mb-stack-md ring-4 ring-surface-container-lowest", children: /* @__PURE__ */ c(
        "img",
        {
          src: a,
          alt: r.displayName,
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ c("h1", { className: "display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm", children: r.displayName }),
      r.title && /* @__PURE__ */ c("p", { className: "text-label-caps font-semibold text-secondary uppercase tracking-widest mb-stack-md", children: r.title }),
      r.bio && /* @__PURE__ */ c("p", { className: "text-body-lg text-on-surface-variant mb-stack-md max-w-xl", children: r.bio }),
      r.socials && r.socials.length > 0 && /* @__PURE__ */ c("div", { className: "flex gap-stack-sm", children: r.socials.map((o) => /* @__PURE__ */ c(
        "a",
        {
          href: o.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": Lr(o.network),
          title: Lr(o.network),
          className: "w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-transparent transition-all",
          children: /* @__PURE__ */ c(_a, { network: o.network })
        },
        o.network
      )) })
    ] }) }) }),
    /* @__PURE__ */ c("section", { className: "max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-section-gap-mobile md:py-section-gap-desktop", children: e.length === 0 ? /* @__PURE__ */ c("p", { className: "text-on-surface-variant", children: n("publicBaked.noPostsAuthor") }) : /* @__PURE__ */ f(se, { children: [
      /* @__PURE__ */ c("h2", { className: "display-serif text-headline-md md:text-display-md text-on-surface mb-stack-lg", children: n("publicBaked.signatureCollection") }),
      /* @__PURE__ */ c("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-stack-md md:gap-stack-lg", children: e.map((o) => /* @__PURE__ */ f("article", { className: "storefront-product-card flex flex-col", children: [
        o.hero && /* @__PURE__ */ c(
          "a",
          {
            href: `/${o.url}`,
            className: "block aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-stack-md",
            children: /* @__PURE__ */ c(
              "img",
              {
                src: Le(o.hero, "medium"),
                alt: o.hero.alt ?? o.title,
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ c("h3", { className: "font-serif text-headline-sm text-on-surface", children: /* @__PURE__ */ c("a", { href: `/${o.url}`, children: o.title }) })
      ] }, o.id)) })
    ] }) })
  ] });
}
function zo({
  message: r,
  site: e
}) {
  const t = le.getFixedT(ce(e.settings.language), "theme-storefront");
  return /* @__PURE__ */ c("section", { className: "max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-section-gap-mobile md:py-section-gap-desktop", children: /* @__PURE__ */ f("div", { className: "max-w-2xl mx-auto text-center", children: [
    /* @__PURE__ */ c("p", { className: "text-label-caps font-semibold text-secondary uppercase tracking-widest mb-stack-md", children: t("publicBaked.notFoundTitle") }),
    /* @__PURE__ */ c("h1", { className: "display-serif text-display-md md:text-display-lg text-on-surface mb-stack-md", children: r ?? t("publicBaked.notFoundMessage") }),
    /* @__PURE__ */ f(
      "a",
      {
        href: "/index.html",
        className: "inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all",
        children: [
          t("publicBaked.backToHome"),
          /* @__PURE__ */ c("span", { className: "material-symbols-outlined", children: "arrow_forward" })
        ]
      }
    )
  ] }) });
}
const zr = '@import"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap";@import"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--font-sans),Inter,system-ui,sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}:root{--color-primary:71 87 59;--color-on-primary:255 255 255;--color-primary-container:95 111 82;--color-on-primary-container:223 241 205;--color-primary-fixed:214 232 197;--color-primary-fixed-dim:187 204 170;--color-on-primary-fixed:18 31 9;--color-on-primary-fixed-variant:60 75 49;--color-secondary:145 74 54;--color-on-secondary:255 255 255;--color-secondary-container:253 162 136;--color-on-secondary-container:119 54 35;--color-secondary-fixed:255 219 209;--color-secondary-fixed-dim:255 181 160;--color-on-secondary-fixed:59 9 0;--color-on-secondary-fixed-variant:116 52 33;--color-tertiary:81 82 79;--color-on-tertiary:255 255 255;--color-tertiary-container:105 106 103;--color-on-tertiary-container:236 235 231;--color-tertiary-fixed:227 226 223;--color-tertiary-fixed-dim:199 199 195;--color-background:252 249 248;--color-surface:252 249 248;--color-surface-bright:252 249 248;--color-surface-dim:220 217 217;--color-surface-container-lowest:255 255 255;--color-surface-container-low:246 243 242;--color-surface-container:240 237 237;--color-surface-container-high:234 231 231;--color-surface-container-highest:228 226 225;--color-on-surface:27 28 28;--color-on-surface-variant:68 72 64;--color-outline:117 120 111;--color-outline-variant:197 200 189;--color-error:186 26 26;--color-on-error:255 255 255;--font-serif:"Playfair Display";--font-sans:"Inter"}body{background-color:rgb(var(--color-background));color:rgb(var(--color-on-surface));font-family:var(--font-sans),system-ui,sans-serif;-webkit-font-smoothing:antialiased}.container{width:100%}@media(min-width:640px){.container{max-width:640px}}@media(min-width:768px){.container{max-width:768px}}@media(min-width:1024px){.container{max-width:1024px}}@media(min-width:1280px){.container{max-width:1280px}}@media(min-width:1536px){.container{max-width:1536px}}.display-serif{font-weight:700;letter-spacing:-.02em}.display-italic,.display-serif{font-family:var(--font-serif),Georgia,serif}.display-italic{font-style:italic;font-weight:400}.storefront-prose{font-size:1rem;line-height:1.6;color:rgb(var(--color-on-surface-variant))}.storefront-prose>p{margin-bottom:1.5rem}.storefront-prose>h2{font-size:2rem;line-height:1.3;margin-top:2.5rem;margin-bottom:1rem}.storefront-prose>h2,.storefront-prose>h3{font-family:var(--font-serif),Georgia,serif;font-weight:600;color:rgb(var(--color-on-surface))}.storefront-prose>h3{font-size:1.5rem;line-height:1.4;margin-top:2rem;margin-bottom:.75rem}.storefront-prose>blockquote{margin:2rem 0;border-left:3px solid rgb(var(--color-primary));padding:.5rem 1.5rem;font-family:var(--font-serif),Georgia,serif;font-style:italic;font-size:1.125rem;color:rgb(var(--color-on-surface))}.storefront-prose>ol,.storefront-prose>ul{padding-left:1.5rem;margin-bottom:1.5rem}.storefront-prose>ul{list-style-type:disc}.storefront-prose>ol{list-style-type:decimal}.storefront-prose>ol>li,.storefront-prose>ul>li{margin-bottom:.5rem}.storefront-prose figure img,.storefront-prose img{border-radius:1rem;margin:1.5rem 0}.storefront-prose a{color:rgb(var(--color-primary));font-weight:500;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}.storefront-prose a:hover{color:rgb(var(--color-secondary))}.storefront-prose code{background:rgb(var(--color-surface-container));padding:.125rem .375rem;border-radius:.25rem;font-size:.95em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.storefront-page-body{max-width:768px;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;font-size:1rem;line-height:1.65;color:rgb(var(--color-on-surface-variant))}@media(min-width:768px){.storefront-page-body{padding-left:2rem;padding-right:2rem}}.storefront-page-body p{margin-bottom:1.5rem}.storefront-page-body h1{font-family:var(--font-serif),Georgia,serif;font-size:2.75rem;font-weight:700;line-height:1.15;letter-spacing:-.02em;color:rgb(var(--color-on-surface));margin-top:2rem;margin-bottom:1.5rem}@media(min-width:768px){.storefront-page-body h1{font-size:3.5rem}}.storefront-page-body h2{font-size:2rem;line-height:1.3;margin-top:3rem;margin-bottom:1rem}.storefront-page-body h2,.storefront-page-body h3{font-family:var(--font-serif),Georgia,serif;font-weight:600;color:rgb(var(--color-on-surface))}.storefront-page-body h3{font-size:1.5rem;line-height:1.4;margin-top:2.25rem;margin-bottom:.75rem}.storefront-page-body h4,.storefront-page-body h5,.storefront-page-body h6{font-weight:600;color:rgb(var(--color-on-surface));margin-top:1.75rem;margin-bottom:.5rem}.storefront-page-body blockquote{margin:2rem 0;border-left:3px solid rgb(var(--color-primary));padding:.5rem 1.5rem;font-family:var(--font-serif),Georgia,serif;font-style:italic;font-size:1.125rem;color:rgb(var(--color-on-surface))}.storefront-page-body ol,.storefront-page-body ul{padding-left:1.5rem;margin-bottom:1.5rem}.storefront-page-body ul{list-style-type:disc}.storefront-page-body ol{list-style-type:decimal}.storefront-page-body li{margin-bottom:.5rem}.storefront-page-body img{width:100%;height:auto;border-radius:1rem;margin:2.5rem 0;box-shadow:0 8px 24px -12px #0000002e}.storefront-page-body a{color:rgb(var(--color-primary));font-weight:500;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}.storefront-page-body a:hover{color:rgb(var(--color-secondary))}.storefront-page-body code{background:rgb(var(--color-surface-container));padding:.125rem .375rem;border-radius:.25rem;font-size:.95em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.storefront-page-body table{width:100%;border-collapse:collapse;margin:2rem 0;font-size:.9375rem}.storefront-page-body td,.storefront-page-body th{padding:.625rem .875rem;border-bottom:1px solid rgb(var(--color-outline-variant));text-align:left}.storefront-page-body th{font-weight:600;color:rgb(var(--color-on-surface));background:rgb(var(--color-surface-container-low))}.storefront-page-body hr{border:0;border-top:1px solid rgb(var(--color-outline-variant));margin:3rem 0}.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;vertical-align:middle;line-height:1}.burger-toggle{background:transparent;border:0;cursor:pointer;padding:.25rem;line-height:0}.burger-menu{position:fixed;top:0;left:0;height:100vh;width:min(360px,80vw);background:rgb(var(--color-background));border-right:1px solid rgb(var(--color-outline-variant));transform:translate(-100%);transition:transform .25s ease;z-index:60;padding:4rem 1.5rem 1.5rem;overflow-y:auto}.burger-menu.is-open{transform:translate(0)}.burger-menu ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.25rem}.burger-menu a{display:block;padding:.625rem 0;color:rgb(var(--color-on-surface));font-family:var(--font-serif),Georgia,serif;font-size:1.125rem;font-weight:500;text-decoration:none}.burger-menu a:hover{color:rgb(var(--color-primary))}.burger-menu a[aria-current=page]{color:rgb(var(--color-primary));font-weight:700}.burger-menu .menu-children{margin-left:1rem;margin-top:.25rem}.burger-menu .menu-children a{font-size:1rem;font-weight:400}.burger-close{position:absolute;top:1rem;right:1rem;background:transparent;border:0;color:rgb(var(--color-on-surface));cursor:pointer;padding:.5rem}.burger-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;background:#0006;opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:55}.burger-backdrop.is-open{opacity:1;pointer-events:auto}body.burger-open{overflow:hidden}.storefront-product-card{transition:transform .3s ease,box-shadow .3s ease}.storefront-product-card:hover{transform:translateY(-4px);box-shadow:0 8px 25px -5px #5f6f5226}.storefront-no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.storefront-no-scrollbar::-webkit-scrollbar{display:none}.storefront-row-slide{flex:0 0 calc(50% - .5rem);min-width:0}@media(min-width:768px){.storefront-row-slide{flex:0 0 calc(33.33333% - .66667rem)}}@media(min-width:1024px){.storefront-row-slide{flex:0 0 calc(25% - 1.5rem)}}.storefront-price-promo{color:rgb(var(--color-secondary));font-weight:700}.storefront-price-strike{color:rgb(var(--color-on-surface-variant));text-decoration:line-through;font-weight:400;margin-left:.5rem}.storefront-stock-pill{display:inline-flex;align-items:center;gap:.375rem;padding:.25rem .75rem;border-radius:9999px;font-size:.6875rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase}.storefront-stock-pill:before{content:"";width:.5rem;height:.5rem;border-radius:9999px;background:currentColor}.storefront-stock-in{background:rgb(var(--color-primary-fixed));color:rgb(var(--color-on-primary-fixed-variant))}.storefront-stock-low{background:rgb(var(--color-secondary-fixed));color:rgb(var(--color-on-secondary-fixed-variant))}.storefront-stock-out{background:rgb(var(--color-surface-container-high));color:rgb(var(--color-on-surface-variant))}.storefront-stock-order{background:rgb(var(--color-tertiary-fixed));color:rgb(var(--color-on-tertiary-fixed))}.storefront-catalog-tags-host{scrollbar-width:thin;scrollbar-color:rgb(var(--color-outline-variant)) transparent;-webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 1.5rem),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 1.5rem),transparent)}.storefront-catalog-tags-host::-webkit-scrollbar{width:6px}.storefront-catalog-tags-host::-webkit-scrollbar-track{background:transparent}.storefront-catalog-tags-host::-webkit-scrollbar-thumb{background:rgb(var(--color-outline-variant));border-radius:3px}.storefront-catalog-tags-host:not(.is-overflowing){-webkit-mask-image:none;mask-image:none}.storefront-catalog-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(2,minmax(0,1fr))}@media(min-width:768px){.storefront-catalog-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(min-width:1024px){.storefront-catalog-grid.is-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.storefront-catalog-grid.is-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.storefront-catalog-grid.is-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}.storefront-catalog-card{transition:transform .4s ease;will-change:transform}.storefront-catalog-card.is-hidden{display:none}.storefront-catalog-empty{grid-column:1/-1;text-align:center;padding:4rem 1rem;color:rgb(var(--color-on-surface-variant));font-style:italic}.storefront-filter-checkbox{width:1rem;height:1rem;border:1px solid rgb(var(--color-outline));border-radius:.25rem;accent-color:rgb(var(--color-primary))}.storefront-filter-chip{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:9999px;border:1px solid rgb(var(--color-outline-variant));background:rgb(var(--color-surface));color:rgb(var(--color-on-surface));font-weight:500;cursor:pointer;transition:background-color .15s ease,border-color .15s ease}.storefront-filter-chip:hover{background:rgb(var(--color-surface-container))}.storefront-filter-chip.is-active{background:rgb(var(--color-primary));color:rgb(var(--color-on-primary));border-color:rgb(var(--color-primary))}.storefront-bio-card{background:rgb(var(--color-surface-container-lowest));border:1px solid rgb(var(--color-outline-variant)/.4);border-radius:1rem;padding:2rem}.storefront-bio-eyebrow{font-size:.75rem;font-weight:600;letter-spacing:.1em;color:rgb(var(--color-primary));text-transform:uppercase;margin-bottom:1rem}.storefront-bio-row{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}.storefront-bio-avatar{width:4rem;height:4rem;border-radius:9999px;-o-object-fit:cover;object-fit:cover}.storefront-bio-name{font-family:var(--font-serif),Georgia,serif;font-size:1.25rem;font-weight:600;color:rgb(var(--color-on-surface))}.storefront-bio-title{font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.storefront-bio-bio,.storefront-bio-title{color:rgb(var(--color-on-surface-variant))}.storefront-bio-bio{font-size:.9375rem;line-height:1.6;margin-bottom:1rem}.storefront-bio-socials{display:flex;gap:.5rem}.storefront-bio-social{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:9999px;color:rgb(var(--color-on-surface-variant));transition:color .15s ease,background-color .15s ease}.storefront-bio-social:hover{color:rgb(var(--color-on-primary));background:rgb(var(--color-primary))}.storefront-related-card{background:rgb(var(--color-surface-container-highest)/.4);border:1px solid rgb(var(--color-outline-variant)/.3);border-radius:1rem;padding:2rem}.storefront-related-heading{font-family:var(--font-serif),Georgia,serif;font-size:1.5rem;font-weight:600;color:rgb(var(--color-on-surface));margin-bottom:1.5rem}.storefront-related-list{display:grid;gap:1rem;grid-template-columns:1fr 1fr}.storefront-related-item{display:block;text-decoration:none}.storefront-related-thumb{aspect-ratio:3/4;border-radius:.75rem;overflow:hidden;background:rgb(var(--color-surface-container));margin-bottom:.5rem}.storefront-related-thumb img{width:100%;height:100%;-o-object-fit:cover;object-fit:cover;transition:transform .4s ease}.storefront-related-item:hover .storefront-related-thumb img{transform:scale(1.05)}.storefront-related-title{font-family:var(--font-serif),Georgia,serif;font-size:1rem;font-weight:600;color:rgb(var(--color-on-surface));line-height:1.3}.storefront-related-price{color:rgb(var(--color-primary));font-size:.875rem;font-weight:600}.floating-label-group{position:relative}.floating-label-group input,.floating-label-group label,.floating-label-group textarea{background:rgb(var(--color-surface-container-lowest))}.floating-label-group label{position:absolute;top:1rem;left:1rem;pointer-events:none;transition:all .2s ease;color:rgb(var(--color-outline));padding:0 .25rem}.floating-label-group input:not(:-moz-placeholder)~label,.floating-label-group textarea:not(:-moz-placeholder)~label{top:-.5rem;left:.75rem;font-size:.75rem;color:rgb(var(--color-primary))}.floating-label-group input:focus~label,.floating-label-group input:not(:placeholder-shown)~label,.floating-label-group textarea:focus~label,.floating-label-group textarea:not(:placeholder-shown)~label,.floating-label-group.is-filled label{top:-.5rem;left:.75rem;font-size:.75rem;color:rgb(var(--color-primary))}.visible{visibility:visible}.invisible{visibility:hidden}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.-bottom-8{bottom:-2rem}.-left-4{left:-1rem}.-right-4{right:-1rem}.-right-8{right:-2rem}.bottom-0{bottom:0}.bottom-6{bottom:1.5rem}.left-0{left:0}.left-3{left:.75rem}.left-6{left:1.5rem}.right-0{right:0}.right-6{right:1.5rem}.top-0{top:0}.top-1\\/3{top:33.333333%}.top-24{top:6rem}.top-3{top:.75rem}.-z-10{z-index:-10}.z-0{z-index:0}.z-10{z-index:10}.z-50{z-index:50}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.\\!mb-0{margin-bottom:0!important}.-mb-px{margin-bottom:-1px}.-mt-2{margin-top:-.5rem}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-section-gap-mobile{margin-bottom:3rem}.mb-stack-lg{margin-bottom:2rem}.mb-stack-md{margin-bottom:1rem}.mb-stack-sm{margin-bottom:.5rem}.mt-1{margin-top:.25rem}.mt-3{margin-top:.75rem}.mt-section-gap-mobile{margin-top:3rem}.mt-stack-lg{margin-top:2rem}.mt-stack-md{margin-top:1rem}.mt-stack-sm{margin-top:.5rem}.line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.\\!grid{display:grid!important}.grid{display:grid}.hidden{display:none}.aspect-\\[4\\/5\\]{aspect-ratio:4/5}.aspect-square{aspect-ratio:1/1}.aspect-video{aspect-ratio:16/9}.h-10{height:2.5rem}.h-12{height:3rem}.h-16{height:4rem}.h-3\\.5{height:.875rem}.h-32{height:8rem}.h-4{height:1rem}.h-48{height:12rem}.h-5{height:1.25rem}.h-8{height:2rem}.h-full{height:100%}.max-h-24{max-height:6rem}.max-h-64{max-height:16rem}.min-h-\\[280px\\]{min-height:280px}.min-h-\\[600px\\]{min-height:600px}.w-10{width:2.5rem}.w-12{width:3rem}.w-14{width:3.5rem}.w-3\\.5{width:.875rem}.w-32{width:8rem}.w-4{width:1rem}.w-48{width:12rem}.w-5{width:1.25rem}.w-auto{width:auto}.w-full{width:100%}.min-w-0{min-width:0}.max-w-2xl{max-width:42rem}.max-w-3xl{max-width:48rem}.max-w-container-max{max-width:1280px}.max-w-md{max-width:28rem}.max-w-xl{max-width:36rem}.max-w-xs{max-width:20rem}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.translate-y-full{--tw-translate-y:100%}.transform,.translate-y-full{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(1turn)}}.animate-spin{animation:spin 1s linear infinite}.cursor-pointer{cursor:pointer}.snap-x{scroll-snap-type:x var(--tw-scroll-snap-strictness)}.snap-mandatory{--tw-scroll-snap-strictness:mandatory}.snap-start{scroll-snap-align:start}.auto-rows-\\[280px\\]{grid-auto-rows:280px}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.items-baseline{align-items:baseline}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-stack-lg{gap:2rem}.gap-stack-md{gap:1rem}.gap-stack-sm{gap:.5rem}.gap-x-8{-moz-column-gap:2rem;column-gap:2rem}.gap-y-3{row-gap:.75rem}.-space-x-1>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(-.25rem*var(--tw-space-x-reverse));margin-left:calc(-.25rem*(1 - var(--tw-space-x-reverse)))}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.25rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem*var(--tw-space-y-reverse))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem*var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem*var(--tw-space-y-reverse))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem*var(--tw-space-y-reverse))}.space-y-stack-lg>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem*var(--tw-space-y-reverse))}.space-y-stack-sm>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem*var(--tw-space-y-reverse))}.self-start{align-self:flex-start}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.scroll-smooth{scroll-behavior:smooth}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border{border-width:1px}.border-0{border-width:0}.border-y{border-top-width:1px}.border-b,.border-y{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-l-2{border-left-width:2px}.border-t{border-top-width:1px}.border-dashed{border-style:dashed}.border-amber-400{--tw-border-opacity:1;border-color:rgb(251 191 36/var(--tw-border-opacity,1))}.border-blue-600{--tw-border-opacity:1;border-color:rgb(37 99 235/var(--tw-border-opacity,1))}.border-on-primary\\/30{border-color:rgb(var(--color-on-primary)/.3)}.border-outline-variant{--tw-border-opacity:1;border-color:rgb(var(--color-outline-variant)/var(--tw-border-opacity,1))}.border-outline-variant\\/20{border-color:rgb(var(--color-outline-variant)/.2)}.border-outline-variant\\/30{border-color:rgb(var(--color-outline-variant)/.3)}.border-outline-variant\\/40{border-color:rgb(var(--color-outline-variant)/.4)}.border-primary{--tw-border-opacity:1;border-color:rgb(var(--color-primary)/var(--tw-border-opacity,1))}.border-red-300{--tw-border-opacity:1;border-color:rgb(252 165 165/var(--tw-border-opacity,1))}.border-secondary{--tw-border-opacity:1;border-color:rgb(var(--color-secondary)/var(--tw-border-opacity,1))}.border-surface-container-high{--tw-border-opacity:1;border-color:rgb(var(--color-surface-container-high)/var(--tw-border-opacity,1))}.border-transparent{border-color:transparent}.bg-amber-50{--tw-bg-opacity:1;background-color:rgb(255 251 235/var(--tw-bg-opacity,1))}.bg-background{--tw-bg-opacity:1;background-color:rgb(var(--color-background)/var(--tw-bg-opacity,1))}.bg-black\\/10{background-color:#0000001a}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255/var(--tw-bg-opacity,1))}.bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity,1))}.bg-on-primary{--tw-bg-opacity:1;background-color:rgb(var(--color-on-primary)/var(--tw-bg-opacity,1))}.bg-on-primary\\/10{background-color:rgb(var(--color-on-primary)/.1)}.bg-primary{--tw-bg-opacity:1;background-color:rgb(var(--color-primary)/var(--tw-bg-opacity,1))}.bg-primary-fixed{--tw-bg-opacity:1;background-color:rgb(var(--color-primary-fixed)/var(--tw-bg-opacity,1))}.bg-primary\\/10{background-color:rgb(var(--color-primary)/.1)}.bg-primary\\/50{background-color:rgb(var(--color-primary)/.5)}.bg-primary\\/90{background-color:rgb(var(--color-primary)/.9)}.bg-secondary-fixed\\/40{background-color:rgb(var(--color-secondary-fixed)/.4)}.bg-secondary\\/90{background-color:rgb(var(--color-secondary)/.9)}.bg-surface{--tw-bg-opacity:1;background-color:rgb(var(--color-surface)/var(--tw-bg-opacity,1))}.bg-surface-container{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container)/var(--tw-bg-opacity,1))}.bg-surface-container-high{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-high)/var(--tw-bg-opacity,1))}.bg-surface-container-highest\\/40{background-color:rgb(var(--color-surface-container-highest)/.4)}.bg-surface-container-low{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-low)/var(--tw-bg-opacity,1))}.bg-surface-container-lowest{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container-lowest)/var(--tw-bg-opacity,1))}.bg-surface\\/85{background-color:rgb(var(--color-surface)/.85)}.bg-surface\\/90{background-color:rgb(var(--color-surface)/.9)}.bg-gradient-to-t{background-image:linear-gradient(to top,var(--tw-gradient-stops))}.from-black\\/55{--tw-gradient-from:rgba(0,0,0,.55) var(--tw-gradient-from-position);--tw-gradient-to:transparent var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.via-black\\/15{--tw-gradient-to:transparent var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),rgba(0,0,0,.15) var(--tw-gradient-via-position),var(--tw-gradient-to)}.to-transparent{--tw-gradient-to:transparent var(--tw-gradient-to-position)}.object-cover{-o-object-fit:cover;object-fit:cover}.p-1{padding:.25rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.px-8{padding-left:2rem;padding-right:2rem}.px-gutter{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-section-gap-mobile{padding-top:3rem;padding-bottom:3rem}.py-stack-lg{padding-top:2rem;padding-bottom:2rem}.pb-1{padding-bottom:.25rem}.pb-2{padding-bottom:.5rem}.pb-section-gap-desktop{padding-bottom:6rem}.pb-stack-lg{padding-bottom:2rem}.pb-stack-md{padding-bottom:1rem}.pl-3{padding-left:.75rem}.pr-1{padding-right:.25rem}.pt-3{padding-top:.75rem}.pt-section-gap-mobile{padding-top:3rem}.pt-stack-lg{padding-top:2rem}.pt-stack-md{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.font-serif{font-family:var(--font-serif),Georgia,serif}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[1\\.125rem\\]{font-size:1.125rem}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[12px\\]{font-size:12px}.text-\\[14px\\]{font-size:14px}.text-\\[18px\\]{font-size:18px}.text-base{font-size:1rem;line-height:1.5rem}.text-body-lg{font-size:1.125rem;line-height:1.6}.text-body-lg,.text-body-md{letter-spacing:0;font-weight:400}.text-body-md{font-size:1rem;line-height:1.5}.text-display-md{font-size:2.25rem;line-height:1.2;letter-spacing:-.01em;font-weight:700}.text-headline-md{font-size:2rem;line-height:1.3;letter-spacing:0;font-weight:600}.text-headline-sm{font-size:1.5rem;line-height:1.4;letter-spacing:0;font-weight:600}.text-label-caps{font-size:.75rem;line-height:1;letter-spacing:.1em;font-weight:600}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.italic{font-style:italic}.leading-relaxed{line-height:1.625}.leading-tight{line-height:1.25}.tracking-tight{letter-spacing:-.025em}.tracking-wide{letter-spacing:.025em}.tracking-widest{letter-spacing:.1em}.text-amber-600{--tw-text-opacity:1;color:rgb(217 119 6/var(--tw-text-opacity,1))}.text-amber-700{--tw-text-opacity:1;color:rgb(180 83 9/var(--tw-text-opacity,1))}.text-amber-700\\/80{color:#b45309cc}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246/var(--tw-text-opacity,1))}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235/var(--tw-text-opacity,1))}.text-error{--tw-text-opacity:1;color:rgb(var(--color-error)/var(--tw-text-opacity,1))}.text-on-primary{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}.text-on-primary-fixed-variant{--tw-text-opacity:1;color:rgb(var(--color-on-primary-fixed-variant)/var(--tw-text-opacity,1))}.text-on-primary\\/80{color:rgb(var(--color-on-primary)/.8)}.text-on-primary\\/90{color:rgb(var(--color-on-primary)/.9)}.text-on-secondary{--tw-text-opacity:1;color:rgb(var(--color-on-secondary)/var(--tw-text-opacity,1))}.text-on-surface{--tw-text-opacity:1;color:rgb(var(--color-on-surface)/var(--tw-text-opacity,1))}.text-on-surface-variant{--tw-text-opacity:1;color:rgb(var(--color-on-surface-variant)/var(--tw-text-opacity,1))}.text-primary{--tw-text-opacity:1;color:rgb(var(--color-primary)/var(--tw-text-opacity,1))}.text-red-500{--tw-text-opacity:1;color:rgb(239 68 68/var(--tw-text-opacity,1))}.text-red-600{--tw-text-opacity:1;color:rgb(220 38 38/var(--tw-text-opacity,1))}.text-secondary{--tw-text-opacity:1;color:rgb(var(--color-secondary)/var(--tw-text-opacity,1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.underline{text-decoration-line:underline}.line-through{text-decoration-line:line-through}.placeholder-on-primary\\/60::-moz-placeholder{color:rgb(var(--color-on-primary)/.6)}.placeholder-on-primary\\/60::placeholder{color:rgb(var(--color-on-primary)/.6)}.accent-primary{accent-color:rgb(var(--color-primary)/1)}.opacity-40{opacity:.4}.opacity-70{opacity:.7}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-2xl{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgba(0,0,0,.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.shadow-lg,.shadow-sm{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgba(0,0,0,.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.ring-1{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring-1,.ring-2{box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-2{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring-4{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-amber-500\\/60{--tw-ring-color:rgba(245,158,11,.6)}.ring-blue-500\\/60{--tw-ring-color:rgba(59,130,246,.6)}.ring-surface-container-lowest{--tw-ring-opacity:1;--tw-ring-color:rgb(var(--color-surface-container-lowest)/var(--tw-ring-opacity,1))}.blur-3xl{--tw-blur:blur(64px)}.blur-3xl,.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur{--tw-backdrop-blur:blur(8px)}.backdrop-blur,.backdrop-blur-md{-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-md{--tw-backdrop-blur:blur(12px)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-300{transition-duration:.3s}.duration-500{transition-duration:.5s}.duration-700{transition-duration:.7s}.hover\\:gap-4:hover{gap:1rem}.hover\\:border-transparent:hover{border-color:transparent}.hover\\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity,1))}.hover\\:bg-on-primary\\/90:hover{background-color:rgb(var(--color-on-primary)/.9)}.hover\\:bg-primary:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-primary)/var(--tw-bg-opacity,1))}.hover\\:bg-primary-container:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-primary-container)/var(--tw-bg-opacity,1))}.hover\\:bg-red-50:hover{--tw-bg-opacity:1;background-color:rgb(254 242 242/var(--tw-bg-opacity,1))}.hover\\:bg-secondary-container:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary-container)/var(--tw-bg-opacity,1))}.hover\\:bg-secondary-fixed:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-secondary-fixed)/var(--tw-bg-opacity,1))}.hover\\:bg-surface-container:hover{--tw-bg-opacity:1;background-color:rgb(var(--color-surface-container)/var(--tw-bg-opacity,1))}.hover\\:text-amber-700:hover{--tw-text-opacity:1;color:rgb(180 83 9/var(--tw-text-opacity,1))}.hover\\:text-blue-700:hover{--tw-text-opacity:1;color:rgb(29 78 216/var(--tw-text-opacity,1))}.hover\\:text-on-primary:hover{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}.hover\\:text-on-primary-container:hover{--tw-text-opacity:1;color:rgb(var(--color-on-primary-container)/var(--tw-text-opacity,1))}.hover\\:text-on-secondary-container:hover{--tw-text-opacity:1;color:rgb(var(--color-on-secondary-container)/var(--tw-text-opacity,1))}.hover\\:text-primary:hover{--tw-text-opacity:1;color:rgb(var(--color-primary)/var(--tw-text-opacity,1))}.hover\\:text-primary-container:hover{--tw-text-opacity:1;color:rgb(var(--color-primary-container)/var(--tw-text-opacity,1))}.hover\\:text-red-700:hover{--tw-text-opacity:1;color:rgb(185 28 28/var(--tw-text-opacity,1))}.hover\\:text-secondary:hover{--tw-text-opacity:1;color:rgb(var(--color-secondary)/var(--tw-text-opacity,1))}.hover\\:shadow-xl:hover{--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.focus\\:border-primary:focus{--tw-border-opacity:1;border-color:rgb(var(--color-primary)/var(--tw-border-opacity,1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-2:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus\\:ring-blue-500:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(59 130 246/var(--tw-ring-opacity,1))}.focus\\:ring-primary:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(var(--color-primary)/var(--tw-ring-opacity,1))}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.disabled\\:opacity-50:disabled{opacity:.5}.group:hover .group-hover\\:translate-y-0{--tw-translate-y:0px}.group:hover .group-hover\\:scale-105,.group:hover .group-hover\\:translate-y-0{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group:hover .group-hover\\:scale-105{--tw-scale-x:1.05;--tw-scale-y:1.05}.group:hover .group-hover\\:bg-primary{--tw-bg-opacity:1;background-color:rgb(var(--color-primary)/var(--tw-bg-opacity,1))}.group:hover .group-hover\\:text-on-primary{--tw-text-opacity:1;color:rgb(var(--color-on-primary)/var(--tw-text-opacity,1))}@media(min-width:640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}}@media(min-width:768px){.md\\:col-span-12{grid-column:span 12/span 12}.md\\:col-span-4{grid-column:span 4/span 4}.md\\:col-span-5{grid-column:span 5/span 5}.md\\:col-span-7{grid-column:span 7/span 7}.md\\:col-span-8{grid-column:span 8/span 8}.md\\:col-start-5{grid-column-start:5}.md\\:flex{display:flex}.md\\:aspect-\\[16\\/10\\]{aspect-ratio:16/10}.md\\:aspect-auto{aspect-ratio:auto}.md\\:min-h-0{min-height:0}.md\\:min-h-\\[360px\\]{min-height:360px}.md\\:min-h-\\[760px\\]{min-height:760px}.md\\:auto-rows-\\[300px\\]{grid-auto-rows:300px}.md\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:items-end{align-items:flex-end}.md\\:items-center{align-items:center}.md\\:justify-between{justify-content:space-between}.md\\:gap-16{gap:4rem}.md\\:gap-stack-lg{gap:2rem}.md\\:p-12{padding:3rem}.md\\:p-8{padding:2rem}.md\\:px-gutter-desktop{padding-left:2rem;padding-right:2rem}.md\\:py-section-gap-desktop{padding-top:6rem;padding-bottom:6rem}.md\\:py-stack-lg{padding-top:2rem;padding-bottom:2rem}.md\\:pt-section-gap-desktop{padding-top:6rem}.md\\:text-display-lg{font-size:3rem;line-height:1.1;letter-spacing:-.02em;font-weight:700}.md\\:text-display-md{font-size:2.25rem;line-height:1.2;letter-spacing:-.01em;font-weight:700}}@media(min-width:1024px){.lg\\:sticky{position:sticky}.lg\\:top-24{top:6rem}.lg\\:col-span-12{grid-column:span 12/span 12}.lg\\:col-span-3{grid-column:span 3/span 3}.lg\\:col-span-4{grid-column:span 4/span 4}.lg\\:col-span-5{grid-column:span 5/span 5}.lg\\:col-span-7{grid-column:span 7/span 7}.lg\\:col-span-8{grid-column:span 8/span 8}.lg\\:col-span-9{grid-column:span 9/span 9}.lg\\:mb-section-gap-desktop{margin-bottom:6rem}.lg\\:mt-section-gap-desktop{margin-top:6rem}.lg\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:p-16{padding:4rem}}@media(min-width:1280px){.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(prefers-color-scheme:dark){.dark\\:border-amber-700{--tw-border-opacity:1;border-color:rgb(180 83 9/var(--tw-border-opacity,1))}.dark\\:border-blue-500{--tw-border-opacity:1;border-color:rgb(59 130 246/var(--tw-border-opacity,1))}.dark\\:bg-amber-950\\/30{background-color:#451a034d}.dark\\:bg-blue-950\\/30{background-color:#1725544d}.dark\\:text-amber-400{--tw-text-opacity:1;color:rgb(251 191 36/var(--tw-text-opacity,1))}.dark\\:text-amber-400\\/80{color:#fbbf24cc}}', Ho = `/**
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
    var active = samePath(a.href);
    if (active) {
      a.setAttribute("aria-current", "page");
      a.className =
        "font-label-caps text-label-caps text-primary border-b-2 border-primary uppercase tracking-widest transition-colors";
    } else {
      a.className =
        "font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors";
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
`, jo = `/**
 * Storefront theme — runtime sidebar loader.
 *
 * Populates \`[data-cms-related]\` and \`[data-cms-author-bio]\` hosts
 * from \`/data/posts.json\` and \`/data/authors.json\`. Same lifecycle
 * as the corporate / magazine / default themes.
 *
 * Differences vs corporate:
 *   - Related items render as a small product-card grid (image +
 *     name + price), not a text list. Drives the "Curated pairings"
 *     row at the bottom of the single-post template.
 *   - Newsletter / contact form wiring is the same convention
 *     (\`[data-cms-form]\`) — copied verbatim.
 */
(function () {
  "use strict";

  var SOCIAL_ICON_PATHS = {
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    website: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
  };
  function socialIconSvg(network) {
    var path = SOCIAL_ICON_PATHS[network];
    if (!path) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>';
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

  // ─── Related products ─────────────────────────────────────────────
  // DOM emitted matches the storefront single-post mockup — small grid
  // of product cards with image + name + price.
  function renderRelatedItem(entry) {
    var a = document.createElement("a");
    a.href = "/" + entry.url;
    a.className = "storefront-related-item";

    var thumb = document.createElement("div");
    thumb.className = "storefront-related-thumb";
    if (entry.heroUrl) {
      var img = document.createElement("img");
      img.src = entry.heroUrl;
      img.alt = entry.heroAlt || entry.title || "";
      img.loading = "lazy";
      thumb.appendChild(img);
    }
    a.appendChild(thumb);

    var title = document.createElement("p");
    title.className = "storefront-related-title";
    title.textContent = entry.title || "";
    a.appendChild(title);

    if (entry.priceLabel) {
      var price = document.createElement("p");
      price.className = "storefront-related-price";
      price.textContent = entry.priceLabel;
      a.appendChild(price);
    }
    return a;
  }

  function renderRelated(host, posts) {
    var termId = host.getAttribute("data-cms-term-id") || "";
    var currentId = host.getAttribute("data-cms-current-id") || "";
    var limit = parseInt(host.getAttribute("data-cms-limit") || "4", 10);
    var label = host.getAttribute("data-cms-label") || "Curated pairings";

    var matching = [];
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
    var headingEl = document.createElement("h3");
    headingEl.className = "storefront-related-heading";
    headingEl.textContent = label;
    host.appendChild(headingEl);
    var list = document.createElement("div");
    list.className = "storefront-related-list";
    matching.forEach(function (entry) {
      list.appendChild(renderRelatedItem(entry));
    });
    host.appendChild(list);
  }

  // ─── Author bio ──────────────────────────────────────────────────
  function authorAvatar(name, url) {
    if (!url) {
      var span = document.createElement("span");
      span.className = "storefront-bio-avatar";
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
    img.className = "storefront-bio-avatar";
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
    var eyebrow = document.createElement("h4");
    eyebrow.className = "storefront-bio-eyebrow";
    eyebrow.textContent = host.getAttribute("data-cms-bio-label") || "Author";
    host.appendChild(eyebrow);

    var row = document.createElement("div");
    row.className = "storefront-bio-row";
    row.appendChild(authorAvatar(entry.displayName, entry.avatar));

    var nameWrap = document.createElement("div");
    var nameEl;
    if (entry.url) {
      nameEl = document.createElement("a");
      nameEl.href = "/" + entry.url;
    } else {
      nameEl = document.createElement("p");
    }
    nameEl.className = "storefront-bio-name";
    nameEl.textContent = entry.displayName || "";
    nameWrap.appendChild(nameEl);

    if (entry.title) {
      var role = document.createElement("p");
      role.className = "storefront-bio-title";
      role.textContent = entry.title;
      nameWrap.appendChild(role);
    }
    row.appendChild(nameWrap);
    host.appendChild(row);

    if (entry.bio) {
      var bio = document.createElement("p");
      bio.className = "storefront-bio-bio";
      bio.textContent = entry.bio;
      host.appendChild(bio);
    }

    if (entry.socials && entry.socials.length) {
      var socials = document.createElement("div");
      socials.className = "storefront-bio-socials";
      for (var i = 0; i < entry.socials.length; i++) {
        var s = entry.socials[i];
        var a = document.createElement("a");
        a.className = "storefront-bio-social";
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", s.network);
        a.innerHTML = socialIconSvg(s.network);
        socials.appendChild(a);
      }
      host.appendChild(socials);
    }
    host.removeAttribute("hidden");
  }

  // ─── Newsletter / contact form wiring ────────────────────────────
  // Same contract as corporate's contact-form: \`[data-cms-form]\` with
  // mode + endpoint + mailto data attrs.
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
    var subject = data.get("subject") || "Newsletter signup";
    var lines = [];
    data.forEach(function (value, key) {
      if (key === "subject" || key === "consent") return;
      lines.push(key + ": " + value);
    });
    return (
      "mailto:" + encodeURIComponent(address) +
      "?subject=" + encodeURIComponent(String(subject)) +
      "&body=" + encodeURIComponent(lines.join("\\n\\n"))
    );
  }

  function handleFormSubmit(form, mode, endpoint, mailtoAddress, event) {
    if (mode === "mailto") {
      if (!mailtoAddress) return;
      event.preventDefault();
      window.location.href = buildMailto(form, mailtoAddress);
      return;
    }
    if (!endpoint) return;
    event.preventDefault();
    var data = new FormData(form);
    var submitButton = form.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: asUrlEncoded(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showFormStatus(form, "success");
        form.reset();
      })
      .catch(function (err) {
        console.warn("[cms] form submit failed:", err);
        showFormStatus(form, "error");
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  }

  function wireForms() {
    document.querySelectorAll("[data-cms-form]").forEach(function (form) {
      var mode = form.getAttribute("data-cms-form") || "endpoint";
      var endpoint = form.getAttribute("data-cms-form-endpoint") || "";
      var mailtoAddress = form.getAttribute("data-cms-form-mailto") || "";
      form.addEventListener("submit", function (event) {
        handleFormSubmit(form, mode, endpoint, mailtoAddress, event);
      });
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

  function paintRelated(postsBlob) {
    if (!postsBlob || !Array.isArray(postsBlob.posts)) return;
    document.querySelectorAll("[data-cms-related]").forEach(function (host) {
      renderRelated(host, postsBlob.posts);
    });
  }

  // ─── Per-category row sliders ─────────────────────────────────────
  // Wires chevron buttons emitted by renderProductGrid in slider
  // mode. Each track's [data-cms-row-track] sibling has [data-cms-
  // row-prev] and [-next] chevrons; click → scroll one card width
  // + gap. Same pattern as corporate's featured-posts chevrons.
  function wireCategoryRowChevrons() {
    document.querySelectorAll("[data-cms-row-track]").forEach(function (track) {
      var wrap = track.parentElement;
      if (!wrap) return;
      var prev = wrap.querySelector("[data-cms-row-prev]");
      var next = wrap.querySelector("[data-cms-row-next]");
      function step(dir) {
        var cards = track.children;
        if (!cards || cards.length === 0) return;
        var card = cards[0];
        var width = card.getBoundingClientRect().width;
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        track.scrollBy({ left: dir * (width + gap), behavior: "smooth" });
      }
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
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
    wireForms();
    wireCategoryRowChevrons();
    Promise.all([
      fetchWithLocaleFallback("posts.json"),
      fetchWithLocaleFallback("authors.json")
    ]).then(function (results) {
      paintRelated(results[0]);
      paintAuthorBios(results[1]);
    });
  });
})();
`, Do = `/**
 * Storefront theme — runtime catalog loader.
 *
 * Powers the catalog page (default \`/catalog.html\`). Fetches
 * /data/products.json, renders an <article> card per product into
 * [data-cms-catalog-grid], wires up the sidebar filters (search /
 * categories / tags / price range / stock / sort), and re-lays out
 * the grid via a FLIP animation when filters change.
 *
 * Pure vanilla JS, no external dependencies. The CatalogTemplate
 * ships an empty grid + empty filter widgets; this loader fills them
 * at first paint.
 */
(function () {
  "use strict";

  var SEARCH_DEBOUNCE_MS = 200;
  var EMPTY_PRICE_PAIR = "—";

  function fetchProducts() {
    return fetch("/data/products.json", { credentials: "omit", cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[cms] products.json load failed:", err);
        return null;
      });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatPrice(amount, currency, locale) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) return "";
    try {
      return new Intl.NumberFormat(locale || "en", {
        style: "currency",
        currency: currency || "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      return amount.toFixed(2) + " " + (currency || "");
    }
  }

  // ─── State ────────────────────────────────────────────────────────
  // Translated UI strings — populated at boot from the grid host's
  // \`data-cms-catalog-i18n\` attribute (encoded server-side by the
  // CatalogTemplate using t()). Keeps the loader language-agnostic.
  var i18nLabels = {
    inStock: "In stock",
    lowStock: "Low stock",
    outOfStock: "Out of stock",
    onOrder: "On order",
    productCountOne: "1 product",
    productCount: "{count} products",
    empty: "No products match your filters.",
  };

  function loadI18n(grid) {
    if (!grid) return;
    var raw = grid.getAttribute("data-cms-catalog-i18n");
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      for (var k in parsed) {
        if (parsed[k]) i18nLabels[k] = parsed[k];
      }
    } catch (e) {
      console.warn("[cms] catalog i18n parse failed:", e);
    }
  }

  var state = {
    products: [],
    visibleIds: [],
    filters: {
      search: "",
      categories: new Set(),
      tags: new Set(),
      stockStatuses: new Set(),
      priceMax: 0,
      priceMaxAvailable: 0,
      sort: "newest",
    },
    locale: document.documentElement.lang || "en",
    currency: "EUR",
  };

  // ─── Card renderer ────────────────────────────────────────────────
  function renderCard(p) {
    var article = document.createElement("article");
    article.className = "storefront-catalog-card storefront-product-card flex flex-col group";
    article.setAttribute("data-cms-catalog-id", p.id);

    var imgWrap = document.createElement("div");
    imgWrap.className = "relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-3 shadow-sm";
    if (p.imageUrl) {
      imgWrap.innerHTML =
        '<a href="/' + escapeHtml(p.url) + '" class="block w-full h-full">' +
        '<img src="' + escapeHtml(p.imageUrl) + '" alt="' + escapeHtml(p.imageAlt || p.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />' +
        "</a>";
    }
    if (p.badges && p.badges.length > 0) {
      var badgeChip = document.createElement("span");
      badgeChip.className = "absolute top-3 left-3 bg-secondary/90 text-on-secondary text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur uppercase tracking-widest";
      badgeChip.textContent = p.badges[0];
      imgWrap.appendChild(badgeChip);
    }
    article.appendChild(imgWrap);

    var h3 = document.createElement("h3");
    h3.className = "font-serif text-[1.125rem] text-on-surface leading-tight mb-1";
    var titleA = document.createElement("a");
    titleA.href = "/" + p.url;
    titleA.textContent = p.title;
    titleA.className = "hover:text-primary transition-colors";
    h3.appendChild(titleA);
    article.appendChild(h3);

    if (p.categoryName) {
      var catP = document.createElement("p");
      catP.className = "text-[12px] text-on-surface-variant uppercase tracking-widest mb-1";
      catP.textContent = p.categoryName;
      article.appendChild(catP);
    }

    if (p.priceTTC > 0) {
      var priceP = document.createElement("p");
      priceP.className = "text-label-caps font-semibold";
      var priceCurrency = p.currency || state.currency;
      if (p.promoTTC > 0 && p.promoTTC < p.priceTTC) {
        priceP.innerHTML =
          '<span class="storefront-price-promo">' +
          escapeHtml(formatPrice(p.promoTTC, priceCurrency, state.locale)) +
          '</span><span class="storefront-price-strike">' +
          escapeHtml(formatPrice(p.priceTTC, priceCurrency, state.locale)) +
          "</span>";
      } else {
        priceP.className += " text-primary";
        priceP.textContent = formatPrice(p.priceTTC, priceCurrency, state.locale);
      }
      article.appendChild(priceP);
    }

    return article;
  }

  // ─── Filtering ────────────────────────────────────────────────────
  function applyFilters() {
    var f = state.filters;
    var searchTerms = f.search
      ? f.search.toLowerCase().split(/\\s+/).filter(Boolean)
      : [];

    var matched = state.products.filter(function (p) {
      if (searchTerms.length > 0) {
        var haystack = [
          p.title,
          p.excerpt,
          p.categoryName,
          (p.tags || []).map(function (t) { return t.name; }).join(" "),
        ].join(" ").toLowerCase();
        for (var i = 0; i < searchTerms.length; i++) {
          if (haystack.indexOf(searchTerms[i]) === -1) return false;
        }
      }
      if (f.categories.size > 0 && !f.categories.has(p.categoryId)) return false;
      if (f.tags.size > 0) {
        var hit = false;
        for (var j = 0; j < (p.tags || []).length; j++) {
          if (f.tags.has(p.tags[j].id)) { hit = true; break; }
        }
        if (!hit) return false;
      }
      if (f.stockStatuses.size > 0 && !f.stockStatuses.has(p.stockStatus)) {
        return false;
      }
      if (f.priceMax > 0 && p.effectivePrice > f.priceMax) return false;
      return true;
    });

    matched.sort(function (a, b) {
      switch (f.sort) {
        case "price-asc":
          return (a.effectivePrice || Infinity) - (b.effectivePrice || Infinity);
        case "price-desc":
          return (b.effectivePrice || 0) - (a.effectivePrice || 0);
        case "newest":
        default:
          return b.createdAt - a.createdAt;
      }
    });

    state.visibleIds = matched.map(function (p) { return p.id; });
    paintGrid(matched);
    updateCount(matched.length);
  }

  // FLIP-animated paint. Records each card's old position, swaps to
  // new state, measures new positions, applies inverse transforms,
  // then animates them back to identity. Skipped on the first paint.
  var firstPaint = true;
  function paintGrid(matched) {
    var grid = document.querySelector("[data-cms-catalog-grid]");
    if (!grid) return;

    if (firstPaint) {
      grid.innerHTML = "";
      if (matched.length === 0) {
        grid.appendChild(emptyMessage());
        firstPaint = false;
        return;
      }
      var frag = document.createDocumentFragment();
      matched.forEach(function (p) { frag.appendChild(renderCard(p)); });
      grid.appendChild(frag);
      firstPaint = false;
      return;
    }

    var oldCards = Array.prototype.slice.call(
      grid.querySelectorAll(".storefront-catalog-card"),
    );
    var oldRects = {};
    oldCards.forEach(function (c) {
      var id = c.getAttribute("data-cms-catalog-id");
      oldRects[id] = c.getBoundingClientRect();
    });

    var existingById = {};
    oldCards.forEach(function (c) {
      existingById[c.getAttribute("data-cms-catalog-id")] = c;
    });

    grid.innerHTML = "";
    if (matched.length === 0) {
      grid.appendChild(emptyMessage());
      return;
    }

    var matchedFrag = document.createDocumentFragment();
    matched.forEach(function (p) {
      var node = existingById[p.id];
      if (!node) node = renderCard(p);
      matchedFrag.appendChild(node);
    });
    grid.appendChild(matchedFrag);

    var newCards = Array.prototype.slice.call(
      grid.querySelectorAll(".storefront-catalog-card"),
    );
    newCards.forEach(function (c) {
      var id = c.getAttribute("data-cms-catalog-id");
      var oldRect = oldRects[id];
      if (!oldRect) return;
      var newRect = c.getBoundingClientRect();
      var dx = oldRect.left - newRect.left;
      var dy = oldRect.top - newRect.top;
      if (dx === 0 && dy === 0) return;
      c.style.transition = "none";
      c.style.transform = "translate(" + dx + "px, " + dy + "px)";
    });
    requestAnimationFrame(function () {
      newCards.forEach(function (c) {
        c.style.transition = "transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)";
        c.style.transform = "";
      });
    });
  }

  function emptyMessage() {
    var p = document.createElement("p");
    p.className = "storefront-catalog-empty";
    p.textContent = i18nLabels.empty;
    return p;
  }

  function updateCount(n) {
    var el = document.querySelector("[data-cms-catalog-count]");
    if (!el) return;
    if (n === 1) {
      el.textContent = i18nLabels.productCountOne;
    } else {
      el.textContent = (i18nLabels.productCount || "{count} products").replace(
        "{count}",
        String(n),
      );
    }
  }

  // ─── Sidebar widgets ──────────────────────────────────────────────
  function renderCategoryFilters(facets) {
    var host = document.querySelector("[data-cms-catalog-categories-host]");
    if (!host || !facets || !Array.isArray(facets.categories)) return;
    if (facets.categories.length === 0) {
      host.parentElement && host.parentElement.setAttribute("hidden", "");
      return;
    }
    host.innerHTML = "";
    facets.categories.forEach(function (c) {
      var label = document.createElement("label");
      label.className = "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "storefront-filter-checkbox";
      input.value = c.id;
      input.addEventListener("change", function () {
        if (input.checked) state.filters.categories.add(c.id);
        else state.filters.categories.delete(c.id);
        applyFilters();
      });
      var span = document.createElement("span");
      span.textContent = c.name + " (" + c.count + ")";
      label.appendChild(input);
      label.appendChild(span);
      host.appendChild(label);
    });
  }

  function renderTagFilters(facets) {
    var host = document.querySelector("[data-cms-catalog-tags-host]");
    if (!host || !facets || !Array.isArray(facets.tags)) return;
    if (facets.tags.length === 0) {
      host.parentElement && host.parentElement.setAttribute("hidden", "");
      return;
    }
    host.innerHTML = "";
    facets.tags.forEach(function (t) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "storefront-filter-chip text-label-caps uppercase tracking-widest";
      chip.textContent = t.name;
      chip.addEventListener("click", function () {
        if (state.filters.tags.has(t.id)) {
          state.filters.tags.delete(t.id);
          chip.classList.remove("is-active");
        } else {
          state.filters.tags.add(t.id);
          chip.classList.add("is-active");
        }
        applyFilters();
      });
      host.appendChild(chip);
    });
    // Toggle the \`is-overflowing\` class so the fade mask shows only
    // when the chip cloud actually scrolls. Without this check the
    // bottom row would always look faded even on short lists.
    requestAnimationFrame(function () {
      if (host.scrollHeight > host.clientHeight + 1) {
        host.classList.add("is-overflowing");
      } else {
        host.classList.remove("is-overflowing");
      }
    });
  }

  function renderPriceRange(facets) {
    var slider = document.querySelector("[data-cms-catalog-price-slider]");
    var minEl = document.querySelector("[data-cms-catalog-price-min]");
    var maxEl = document.querySelector("[data-cms-catalog-price-max]");
    var wrap = document.querySelector("[data-cms-catalog-price]");
    if (!slider || !facets || !facets.priceRange || facets.priceRange.max <= 0) {
      wrap && wrap.setAttribute("hidden", "");
      return;
    }
    var min = facets.priceRange.min;
    var max = facets.priceRange.max;
    state.filters.priceMaxAvailable = max;
    state.filters.priceMax = max;
    slider.min = String(Math.floor(min));
    slider.max = String(Math.ceil(max));
    slider.value = String(Math.ceil(max));
    slider.step = "1";
    if (minEl) minEl.textContent = formatPrice(min, state.currency, state.locale) || EMPTY_PRICE_PAIR;
    if (maxEl) maxEl.textContent = formatPrice(max, state.currency, state.locale) || EMPTY_PRICE_PAIR;
    slider.addEventListener("input", function () {
      var v = parseFloat(slider.value);
      state.filters.priceMax = isNaN(v) ? state.filters.priceMaxAvailable : v;
      if (maxEl) maxEl.textContent = formatPrice(v, state.currency, state.locale);
      applyFilters();
    });
  }

  function stockLabel(s) {
    if (s === "in-stock") return i18nLabels.inStock;
    if (s === "low-stock") return i18nLabels.lowStock;
    if (s === "out-of-stock") return i18nLabels.outOfStock;
    if (s === "on-order") return i18nLabels.onOrder;
    return s;
  }

  function renderStockFilters(facets) {
    var host = document.querySelector("[data-cms-catalog-stock-host]");
    if (!host || !facets || !Array.isArray(facets.stockStatuses)) return;
    if (facets.stockStatuses.length === 0) {
      host.parentElement && host.parentElement.setAttribute("hidden", "");
      return;
    }
    host.innerHTML = "";
    facets.stockStatuses.forEach(function (s) {
      var label = document.createElement("label");
      label.className = "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "storefront-filter-checkbox";
      input.value = s;
      input.addEventListener("change", function () {
        if (input.checked) state.filters.stockStatuses.add(s);
        else state.filters.stockStatuses.delete(s);
        applyFilters();
      });
      var span = document.createElement("span");
      span.textContent = stockLabel(s);
      label.appendChild(input);
      label.appendChild(span);
      host.appendChild(label);
    });
  }

  function wireSearch() {
    var input = document.querySelector("[data-cms-catalog-search]");
    if (!input) return;
    var timeout = null;
    input.addEventListener("input", function () {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(function () {
        state.filters.search = input.value.trim();
        applyFilters();
      }, SEARCH_DEBOUNCE_MS);
    });
  }

  function wireSort() {
    var select = document.querySelector("[data-cms-catalog-sort]");
    if (!select) return;
    select.addEventListener("change", function () {
      state.filters.sort = select.value;
      applyFilters();
    });
  }

  // ─── Boot ─────────────────────────────────────────────────────────
  ready(function () {
    var grid = document.querySelector("[data-cms-catalog-grid]");
    if (!grid) return; // Page doesn't host the catalog UI — noop.
    loadI18n(grid);

    fetchProducts().then(function (blob) {
      if (!blob || !Array.isArray(blob.products)) {
        grid.innerHTML = "";
        grid.appendChild(emptyMessage());
        return;
      }
      state.products = blob.products;
      state.currency = blob.currency || "EUR";

      renderCategoryFilters(blob.facets);
      renderTagFilters(blob.facets);
      renderPriceRange(blob.facets);
      renderStockFilters(blob.facets);
      wireSearch();
      wireSort();

      applyFilters();
    });
  });
})();
`, Se = {
  description: "Storefront theme settings — manage your storefront appearance, home composition, single-post layout, product defaults, and catalog feature.",
  tabs: {
    home: "Home",
    single: "Product page",
    productDefaults: "Product defaults",
    catalog: "Catalog",
    footer: "Footer",
    logo: "Logo & branding",
    style: "Style"
  },
  buttons: {
    save: "Save & apply",
    saving: "Saving…",
    saved: "Saved",
    forceRegenerate: "Force regenerate",
    regenerating: "Regenerating…"
  },
  presets: {
    title: "Style preset",
    help: "Pick a graphic preset to fill every field below. You can fine-tune individual values afterwards.",
    botanical: {
      label: "Botanical",
      description: "Original storefront baseline — sage primary + terracotta accent, Playfair Display + Inter."
    },
    monochrome: {
      label: "Monochrome",
      description: "Pure white and graphite — Source Serif 4 + Inter, luxury minimal."
    },
    clay: {
      label: "Warm Clay",
      description: "Peach surfaces and brick primary — Cormorant Garamond + Plus Jakarta Sans, artisan vibe."
    },
    pastel: {
      label: "Pastel",
      description: "Lavender surfaces and soft pink — Lora + DM Sans, romantic boutique."
    },
    bold: {
      label: "Bold",
      description: "Cream surfaces with deep navy and gold accents — EB Garamond + Outfit, confident retail."
    }
  },
  vars: {
    background: "Background",
    surface: "Surface",
    surfaceLowest: "Surface — lowest",
    surfaceLow: "Surface — low",
    surfaceMid: "Surface — mid",
    surfaceHigh: "Surface — high",
    onSurface: "Foreground",
    onSurfaceVariant: "Foreground variant",
    outline: "Outline",
    outlineVariant: "Outline variant",
    primary: "Primary",
    onPrimary: "On primary",
    primaryContainer: "Primary container",
    onPrimaryContainer: "On primary container",
    secondary: "Secondary",
    onSecondary: "On secondary",
    secondaryContainer: "Secondary container",
    onSecondaryContainer: "On secondary container"
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Text",
    outlines: "Outlines",
    accent: "Accent"
  },
  font: {
    serif: "Heading font (serif)",
    sans: "Body font (sans)"
  },
  logo: {
    description: "Upload a logo to replace the wordmark in the header. Recommended ratio 4:1, transparent PNG / WebP.",
    upload: "Upload logo",
    replace: "Replace logo",
    remove: "Remove logo",
    saved: "Logo updated",
    failed: "Logo upload failed",
    invalidType: "Unsupported file type. Use JPG, PNG, or WebP.",
    removed: "Logo removed"
  },
  catalog: {
    description: "When enabled, a public catalog page is automatically published with all your online products. The page lists every product and ships with client-side filtering.",
    enabled: "Enable catalog",
    enabledHelp: "When on, the catalog page is regenerated on every publish and a link is added to the menu (configurable below).",
    slug: "Page slug",
    slugHelp: "Path on your public site, relative to the root. Example: catalog.html or shop/catalog.html.",
    pageTitle: "Page title",
    pageHeading: "Page heading",
    pageSubtitle: "Page subtitle",
    addToMenu: "Add to header menu",
    menuLabel: "Menu label",
    filtersHeading: "Filters",
    showSearch: "Show search bar",
    showCategoryFilter: "Show category filter",
    showTagFilter: "Show tag filter",
    showPriceRange: "Show price range",
    showStockFilter: "Show stock filter",
    showSortBy: "Show sort dropdown",
    initialColumns: "Default columns",
    forceRegenerate: "Force regenerate catalog & JSON",
    forceRegenerateHelp: "Re-renders the catalog page and the products.json blob. Use after large content changes if anything looks stale.",
    lastGenerated: "Last regenerated",
    never: "Never"
  },
  productDefaults: {
    description: "Site-wide defaults used when a product page doesn't specify its own values. Lets you change currency and CTA once for all products.",
    currency: "Currency code (ISO 4217)",
    ctaLabel: "CTA label",
    ctaHref: "CTA target",
    inquiryOnly: "Inquiry-only mode (hide prices)"
  },
  home: {
    description: "The storefront home page composes the hero, curated collections, trending products, and the journal feature. Each section can be toggled independently.",
    showHero: "Show hero",
    bento: {
      heading: "Curated collections (bento)",
      enabled: "Show curated collections",
      eyebrow: "Eyebrow",
      title: "Title",
      subtitle: "Subtitle",
      viewAllLabel: "View-all label",
      viewAllHref: "View-all link",
      cardsHeading: "Bento cards"
    },
    trending: {
      heading: "Trending products",
      enabled: "Show trending products",
      eyebrow: "Eyebrow",
      title: "Title",
      mode: "Source",
      modeAll: "All products (newest first)",
      modeCategory: "Single category",
      categoryId: "Category",
      count: "Number of products"
    },
    categoryRows: {
      heading: "Category rows",
      description: "Add as many per-category product rows as you want. Each surfaces N products from a single category, in a 4-col grid or a horizontal slider. Rows render in order under the trending row.",
      add: "Add row",
      remove: "Remove",
      moveUp: "Move up",
      moveDown: "Move down",
      count: "{{count}} rows",
      row: "Row {{index}}",
      enabled: "Show this row",
      eyebrow: "Eyebrow",
      title: "Title",
      allProducts: "All categories",
      layoutGrid: "Grid (4 cols)",
      layoutSlider: "Horizontal slider",
      viewAllLabel: "View-all label (optional)",
      viewAllHref: "View-all link (auto from category if empty)"
    },
    journal: {
      heading: "Journal feature",
      enabled: "Show journal feature",
      imageUrl: "Image URL",
      imageAlt: "Image alt",
      eyebrow: "Eyebrow",
      title: "Title",
      titleItalicTail: "Italic tail",
      subtitle: "Subtitle",
      ctaLabel: "CTA label",
      ctaHref: "CTA link"
    },
    storeInfo: {
      heading: "Our shop",
      enabled: "Show shop info section",
      eyebrow: "Eyebrow",
      title: "Title",
      imageUrl: "Photo URL",
      imageHelp: "Photo of your shop interior or storefront. Empty renders a stylized map placeholder.",
      imageAlt: "Image alt",
      addressLabel: "Address heading",
      address: "Address",
      addressHelp: "One line per row — line breaks render as <br>.",
      hoursLabel: "Hours heading",
      hours: "Hours",
      hoursHelp: "One opening row per line.",
      ctaLabel: "CTA label",
      ctaHref: "CTA link",
      ctaHelp: "Typically a Google Maps directions URL."
    },
    reviews: {
      heading: "Customer reviews",
      enabled: "Show reviews carousel"
    }
  },
  single: {
    description: "Single-product page layout. Toggle the related-products row, the author bio, and the care-kit sidebar.",
    showAuthorBio: "Show author bio",
    showRelatedProducts: "Show related products",
    relatedTitle: "Related products heading",
    showCareKit: "Show care kit",
    careKitTitle: "Care-kit title",
    careKitDescription: "Care-kit description",
    careKitItems: "Care-kit items"
  },
  footer: {
    description: "Footer composition.",
    showSocials: "Show socials row",
    tagline: "Brand tagline",
    taglineHelp: "Displayed under the wordmark. Empty falls back to the site description from /settings/general."
  },
  bottomNav: {
    description: "Mobile bottom navigation bar (visible only on small viewports).",
    enabled: "Show bottom nav",
    items: "Items"
  }
}, Uo = Se, _o = Se, Vo = Se, qo = Se, Jo = Se, Wo = Se, Ae = {
  unknownBlock: "Unknown block",
  heroOverlay: { title: "Hero — overlay", untitled: "(no title)" },
  categoriesBento: { title: "Curated collections (bento)", preview: "{{count}} cards" },
  productGrid: { title: "Trending products", preview: "{{count}} products" },
  journalFeature: { title: "Journal feature", untitled: "(no title)" },
  newsletter: { title: "Newsletter signup", untitled: "(empty)" },
  productInfo: {
    title: "Product info — prices, stock, variants",
    untitled: "(no data set)",
    editorHint: "Renders in the right column of the product page hero."
  },
  productGallery: { title: "Product gallery", preview: "{{count}} images" },
  productFeatures: { title: "Product feature icons", preview: "{{count}} features" },
  reviewsList: { title: "Reviews list", preview: "{{count}} reviews" }
}, Ko = {
  home: "Home",
  backToHome: "Back to home",
  notFoundTitle: "404",
  notFoundMessage: "The page you are looking for does not exist.",
  menu: "Open menu",
  primaryNav: "Primary",
  primaryNavMobile: "Primary mobile",
  footerNav: "Footer",
  search: "Search",
  cart: "Cart",
  shop: "Shop",
  favorites: "Favorites",
  website: "Website",
  share: "Share",
  allCategories: "All categories",
  noPosts: "No products yet.",
  noPostsCategory: "No products in this collection yet.",
  noPostsAuthor: "No products by this author yet.",
  productCount: "{{count}} products",
  productCountOne: "1 product",
  curatedPairings: "You may also love",
  aboutFlorist: "About the author",
  signatureCollection: "Signature collection",
  readJournal: "Read the journal",
  viewAll: "View all",
  follow: "Follow",
  quickAdd: "View details",
  addToBasket: "Add to basket",
  inquireForPrice: "Inquire for availability",
  addToWishlist: "Add to wishlist",
  inStock: "In stock",
  lowStock: "Low stock",
  outOfStock: "Out of stock",
  onOrder: "Available on order",
  priceHT: "Excl. tax",
  priceTTC: "Incl. tax",
  promoBadge: "Promo",
  catalogHeading: "Catalog",
  catalogEmpty: "No products match your filters.",
  catalogLoading: "Loading products…",
  catalogSearchPlaceholder: "Search products…",
  catalogSortNewest: "Newest first",
  catalogSortPriceAsc: "Price — low to high",
  catalogSortPriceDesc: "Price — high to low",
  catalogFilterAll: "All",
  catalogFilterCategories: "Categories",
  catalogFilterTags: "Tags",
  catalogFilterPrice: "Price range",
  catalogFilterStock: "Availability",
  previous: "Previous",
  next: "Next"
}, Go = {
  home: "Accueil",
  backToHome: "Retour à l'accueil",
  notFoundTitle: "404",
  notFoundMessage: "La page que vous cherchez n'existe pas.",
  menu: "Ouvrir le menu",
  primaryNav: "Navigation principale",
  primaryNavMobile: "Navigation mobile",
  footerNav: "Pied de page",
  search: "Rechercher",
  cart: "Panier",
  shop: "Boutique",
  favorites: "Favoris",
  website: "Site web",
  share: "Partager",
  allCategories: "Toutes les catégories",
  noPosts: "Aucun produit pour le moment.",
  noPostsCategory: "Aucun produit dans cette collection pour le moment.",
  noPostsAuthor: "Aucun produit de cet auteur pour le moment.",
  productCount: "{{count}} produits",
  productCountOne: "1 produit",
  curatedPairings: "Vous aimerez aussi",
  aboutFlorist: "À propos de l'auteur",
  signatureCollection: "Collection signature",
  readJournal: "Lire le journal",
  viewAll: "Voir tout",
  follow: "Suivre",
  quickAdd: "Voir les détails",
  addToBasket: "Ajouter au panier",
  inquireForPrice: "Demander la disponibilité",
  addToWishlist: "Ajouter aux favoris",
  inStock: "En stock",
  lowStock: "Stock limité",
  outOfStock: "Rupture de stock",
  onOrder: "Sur commande",
  priceHT: "HT",
  priceTTC: "TTC",
  promoBadge: "Promo",
  catalogHeading: "Catalogue",
  catalogEmpty: "Aucun produit ne correspond à vos filtres.",
  catalogLoading: "Chargement des produits…",
  catalogSearchPlaceholder: "Rechercher un produit…",
  catalogSortNewest: "Plus récents",
  catalogSortPriceAsc: "Prix — croissant",
  catalogSortPriceDesc: "Prix — décroissant",
  catalogFilterAll: "Tous",
  catalogFilterCategories: "Catégories",
  catalogFilterTags: "Étiquettes",
  catalogFilterPrice: "Fourchette de prix",
  catalogFilterStock: "Disponibilité",
  previous: "Précédent",
  next: "Suivant"
}, Yo = {
  home: "Startseite",
  backToHome: "Zurück zur Startseite",
  notFoundTitle: "404",
  notFoundMessage: "Die gesuchte Seite existiert nicht.",
  menu: "Menü öffnen",
  primaryNav: "Hauptnavigation",
  primaryNavMobile: "Mobile Navigation",
  footerNav: "Fußzeile",
  search: "Suchen",
  cart: "Warenkorb",
  shop: "Shop",
  favorites: "Favoriten",
  website: "Website",
  share: "Teilen",
  allCategories: "Alle Kategorien",
  noPosts: "Noch keine Produkte.",
  noPostsCategory: "Noch keine Produkte in dieser Kollektion.",
  noPostsAuthor: "Noch keine Produkte von diesem Autor.",
  productCount: "{{count}} Produkte",
  productCountOne: "1 Produkt",
  curatedPairings: "Das könnte Ihnen auch gefallen",
  aboutFlorist: "Über den Autor",
  signatureCollection: "Signature-Kollektion",
  readJournal: "Journal lesen",
  viewAll: "Alle ansehen",
  follow: "Folgen",
  quickAdd: "Details ansehen",
  addToBasket: "In den Warenkorb",
  inquireForPrice: "Verfügbarkeit anfragen",
  addToWishlist: "Zur Wunschliste",
  inStock: "Auf Lager",
  lowStock: "Geringer Bestand",
  outOfStock: "Ausverkauft",
  onOrder: "Auf Bestellung",
  priceHT: "Netto",
  priceTTC: "Brutto",
  promoBadge: "Aktion",
  catalogHeading: "Katalog",
  catalogEmpty: "Keine Produkte entsprechen Ihren Filtern.",
  catalogLoading: "Produkte werden geladen…",
  catalogSearchPlaceholder: "Produkte suchen…",
  catalogSortNewest: "Neueste zuerst",
  catalogSortPriceAsc: "Preis — aufsteigend",
  catalogSortPriceDesc: "Preis — absteigend",
  catalogFilterAll: "Alle",
  catalogFilterCategories: "Kategorien",
  catalogFilterTags: "Schlagworte",
  catalogFilterPrice: "Preisspanne",
  catalogFilterStock: "Verfügbarkeit",
  previous: "Zurück",
  next: "Weiter"
}, Xo = {
  home: "Inicio",
  backToHome: "Volver al inicio",
  notFoundTitle: "404",
  notFoundMessage: "La página que buscas no existe.",
  menu: "Abrir menú",
  primaryNav: "Navegación principal",
  primaryNavMobile: "Navegación móvil",
  footerNav: "Pie de página",
  search: "Buscar",
  cart: "Carrito",
  shop: "Tienda",
  favorites: "Favoritos",
  website: "Sitio web",
  share: "Compartir",
  allCategories: "Todas las categorías",
  noPosts: "Aún no hay productos.",
  noPostsCategory: "Aún no hay productos en esta colección.",
  noPostsAuthor: "Aún no hay productos de este autor.",
  productCount: "{{count}} productos",
  productCountOne: "1 producto",
  curatedPairings: "También te puede gustar",
  aboutFlorist: "Sobre el autor",
  signatureCollection: "Colección signature",
  readJournal: "Leer el diario",
  viewAll: "Ver todo",
  follow: "Seguir",
  quickAdd: "Ver detalles",
  addToBasket: "Añadir al carrito",
  inquireForPrice: "Consultar disponibilidad",
  addToWishlist: "Añadir a favoritos",
  inStock: "En stock",
  lowStock: "Pocas unidades",
  outOfStock: "Agotado",
  onOrder: "Bajo pedido",
  priceHT: "Sin IVA",
  priceTTC: "Con IVA",
  promoBadge: "Promo",
  catalogHeading: "Catálogo",
  catalogEmpty: "Ningún producto coincide con tus filtros.",
  catalogLoading: "Cargando productos…",
  catalogSearchPlaceholder: "Buscar productos…",
  catalogSortNewest: "Más recientes",
  catalogSortPriceAsc: "Precio — ascendente",
  catalogSortPriceDesc: "Precio — descendente",
  catalogFilterAll: "Todos",
  catalogFilterCategories: "Categorías",
  catalogFilterTags: "Etiquetas",
  catalogFilterPrice: "Rango de precio",
  catalogFilterStock: "Disponibilidad",
  previous: "Anterior",
  next: "Siguiente"
}, Zo = {
  home: "Home",
  backToHome: "Terug naar home",
  notFoundTitle: "404",
  notFoundMessage: "De pagina die u zoekt bestaat niet.",
  menu: "Menu openen",
  primaryNav: "Hoofdnavigatie",
  primaryNavMobile: "Mobiele navigatie",
  footerNav: "Voettekst",
  search: "Zoeken",
  cart: "Winkelmandje",
  shop: "Shop",
  favorites: "Favorieten",
  website: "Website",
  share: "Delen",
  allCategories: "Alle categorieën",
  noPosts: "Nog geen producten.",
  noPostsCategory: "Nog geen producten in deze collectie.",
  noPostsAuthor: "Nog geen producten van deze auteur.",
  productCount: "{{count}} producten",
  productCountOne: "1 product",
  curatedPairings: "Misschien vindt u dit ook leuk",
  aboutFlorist: "Over de auteur",
  signatureCollection: "Signature-collectie",
  readJournal: "Journaal lezen",
  viewAll: "Bekijk alles",
  follow: "Volgen",
  quickAdd: "Bekijk details",
  addToBasket: "In winkelmandje",
  inquireForPrice: "Beschikbaarheid opvragen",
  addToWishlist: "Aan verlanglijst toevoegen",
  inStock: "Op voorraad",
  lowStock: "Beperkte voorraad",
  outOfStock: "Uitverkocht",
  onOrder: "Op bestelling",
  priceHT: "Excl. btw",
  priceTTC: "Incl. btw",
  promoBadge: "Promo",
  catalogHeading: "Catalogus",
  catalogEmpty: "Geen producten voldoen aan uw filters.",
  catalogLoading: "Producten laden…",
  catalogSearchPlaceholder: "Producten zoeken…",
  catalogSortNewest: "Nieuwste eerst",
  catalogSortPriceAsc: "Prijs — laag naar hoog",
  catalogSortPriceDesc: "Prijs — hoog naar laag",
  catalogFilterAll: "Alle",
  catalogFilterCategories: "Categorieën",
  catalogFilterTags: "Tags",
  catalogFilterPrice: "Prijsklasse",
  catalogFilterStock: "Beschikbaarheid",
  previous: "Vorige",
  next: "Volgende"
}, Qo = {
  home: "Início",
  backToHome: "Voltar ao início",
  notFoundTitle: "404",
  notFoundMessage: "A página que procura não existe.",
  menu: "Abrir menu",
  primaryNav: "Navegação principal",
  primaryNavMobile: "Navegação móvel",
  footerNav: "Rodapé",
  search: "Pesquisar",
  cart: "Carrinho",
  shop: "Loja",
  favorites: "Favoritos",
  website: "Sítio Web",
  share: "Partilhar",
  allCategories: "Todas as categorias",
  noPosts: "Ainda sem produtos.",
  noPostsCategory: "Ainda sem produtos nesta coleção.",
  noPostsAuthor: "Ainda sem produtos deste autor.",
  productCount: "{{count}} produtos",
  productCountOne: "1 produto",
  curatedPairings: "Também pode gostar",
  aboutFlorist: "Sobre o autor",
  signatureCollection: "Coleção signature",
  readJournal: "Ler o diário",
  viewAll: "Ver tudo",
  follow: "Seguir",
  quickAdd: "Ver detalhes",
  addToBasket: "Adicionar ao carrinho",
  inquireForPrice: "Consultar disponibilidade",
  addToWishlist: "Adicionar aos favoritos",
  inStock: "Em stock",
  lowStock: "Pouco stock",
  outOfStock: "Esgotado",
  onOrder: "Sob encomenda",
  priceHT: "Sem IVA",
  priceTTC: "Com IVA",
  promoBadge: "Promo",
  catalogHeading: "Catálogo",
  catalogEmpty: "Nenhum produto corresponde aos seus filtros.",
  catalogLoading: "A carregar produtos…",
  catalogSearchPlaceholder: "Pesquisar produtos…",
  catalogSortNewest: "Mais recentes",
  catalogSortPriceAsc: "Preço — crescente",
  catalogSortPriceDesc: "Preço — decrescente",
  catalogFilterAll: "Todos",
  catalogFilterCategories: "Categorias",
  catalogFilterTags: "Etiquetas",
  catalogFilterPrice: "Faixa de preço",
  catalogFilterStock: "Disponibilidade",
  previous: "Anterior",
  next: "Seguinte"
}, ei = {
  home: "홈",
  backToHome: "홈으로 돌아가기",
  notFoundTitle: "404",
  notFoundMessage: "찾으시는 페이지가 존재하지 않습니다.",
  menu: "메뉴 열기",
  primaryNav: "기본 메뉴",
  primaryNavMobile: "모바일 메뉴",
  footerNav: "푸터",
  search: "검색",
  cart: "장바구니",
  shop: "쇼핑",
  favorites: "즐겨찾기",
  website: "웹사이트",
  share: "공유",
  allCategories: "전체 카테고리",
  noPosts: "아직 상품이 없습니다.",
  noPostsCategory: "이 컬렉션에 아직 상품이 없습니다.",
  noPostsAuthor: "이 작성자의 상품이 아직 없습니다.",
  productCount: "상품 {{count}}개",
  productCountOne: "상품 1개",
  curatedPairings: "함께 추천하는 상품",
  aboutFlorist: "작성자 소개",
  signatureCollection: "시그니처 컬렉션",
  readJournal: "저널 읽기",
  viewAll: "모두 보기",
  follow: "팔로우",
  quickAdd: "자세히 보기",
  addToBasket: "장바구니 담기",
  inquireForPrice: "재고 문의",
  addToWishlist: "위시리스트 추가",
  inStock: "재고 있음",
  lowStock: "재고 부족",
  outOfStock: "품절",
  onOrder: "주문 가능",
  priceHT: "세전",
  priceTTC: "세후",
  promoBadge: "프로모션",
  catalogHeading: "카탈로그",
  catalogEmpty: "필터와 일치하는 상품이 없습니다.",
  catalogLoading: "상품을 불러오는 중…",
  catalogSearchPlaceholder: "상품 검색…",
  catalogSortNewest: "최신순",
  catalogSortPriceAsc: "가격 — 낮은 순",
  catalogSortPriceDesc: "가격 — 높은 순",
  catalogFilterAll: "전체",
  catalogFilterCategories: "카테고리",
  catalogFilterTags: "태그",
  catalogFilterPrice: "가격 범위",
  catalogFilterStock: "재고 상태",
  previous: "이전",
  next: "다음"
}, ti = {
  catalog: {
    label: "Regenerate catalog",
    description: "Rebuild /data/products.json and the catalog HTML page."
  }
}, ri = {
  catalog: {
    label: "Régénérer le catalogue",
    description: "Reconstruit /data/products.json et la page HTML du catalogue."
  }
}, ni = {
  catalog: {
    label: "Katalog neu generieren",
    description: "Erstellt /data/products.json und die HTML-Katalogseite neu."
  }
}, ai = {
  catalog: {
    label: "Regenerar catálogo",
    description: "Reconstruye /data/products.json y la página HTML del catálogo."
  }
}, oi = {
  catalog: {
    label: "Catalogus regenereren",
    description: "Bouwt /data/products.json en de catalogus-HTML-pagina opnieuw op."
  }
}, ii = {
  catalog: {
    label: "Regenerar catálogo",
    description: "Reconstrói /data/products.json e a página HTML do catálogo."
  }
}, si = {
  catalog: {
    label: "카탈로그 재생성",
    description: "/data/products.json과 카탈로그 HTML 페이지를 다시 빌드합니다."
  }
}, li = { title: "Theme settings", settings: Se, publicBaked: Ko, blocks: Ae, regenerationTarget: ti }, ci = { title: "Theme settings", settings: Uo, publicBaked: Go, blocks: Ae, regenerationTarget: ri }, di = { title: "Theme settings", settings: _o, publicBaked: Yo, blocks: Ae, regenerationTarget: ni }, ui = { title: "Theme settings", settings: Vo, publicBaked: Xo, blocks: Ae, regenerationTarget: ai }, pi = { title: "Theme settings", settings: qo, publicBaked: Zo, blocks: Ae, regenerationTarget: oi }, fi = { title: "Theme settings", settings: Jo, publicBaked: Qo, blocks: Ae, regenerationTarget: ii }, hi = { title: "Theme settings", settings: Wo, publicBaked: ei, blocks: Ae, regenerationTarget: si };
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mi = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Rn = (...r) => r.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var gi = {
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
const bi = tr(
  ({
    color: r = "currentColor",
    size: e = 24,
    strokeWidth: t = 2,
    absoluteStrokeWidth: n,
    className: a = "",
    children: o,
    iconNode: i,
    ...s
  }, l) => gt(
    "svg",
    {
      ref: l,
      ...gi,
      width: e,
      height: e,
      stroke: r,
      strokeWidth: n ? Number(t) * 24 / Number(e) : t,
      className: Rn("lucide", a),
      ...s
    },
    [
      ...i.map(([d, u]) => gt(d, u)),
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
const _ = (r, e) => {
  const t = tr(
    ({ className: n, ...a }, o) => gt(bi, {
      ref: o,
      iconNode: e,
      className: Rn(`lucide-${mi(r)}`, n),
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
const yi = _("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vi = _("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pn = _("BookOpen", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fn = _("Grid3x3", [
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
const nr = _("Image", [
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
const $n = _("Images", [
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6", key: "pblm9e" }],
  ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18", key: "nf6bnh" }],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2", key: "12espp" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bt = _("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bn = _("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wi = _("Palette", [
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
const oe = _("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zn = _("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xi = _("Save", [
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
const Hn = _("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jn = _("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dn = _("Tag", [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const te = _("Trash2", [
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
const ki = _("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
function Ci({ site: r }) {
  var i;
  const e = le.getFixedT(ce(r.settings.language), "theme-storefront"), t = r.themeConfig, n = {
    ...Ce,
    ...(t == null ? void 0 : t.catalog) ?? {},
    filters: {
      ...Ce.filters,
      ...((i = t == null ? void 0 : t.catalog) == null ? void 0 : i.filters) ?? {}
    }
  }, a = JSON.stringify({
    search: n.filters.showSearch,
    category: n.filters.showCategoryFilter,
    tag: n.filters.showTagFilter,
    price: n.filters.showPriceRange,
    stock: n.filters.showStockFilter,
    sort: n.filters.showSortBy
  }), o = JSON.stringify({
    inStock: e("publicBaked.inStock"),
    lowStock: e("publicBaked.lowStock"),
    outOfStock: e("publicBaked.outOfStock"),
    onOrder: e("publicBaked.onOrder"),
    productCountOne: e("publicBaked.productCountOne"),
    productCount: e("publicBaked.productCount", { count: 0 }).replace(
      "0",
      "{count}"
    ),
    empty: e("publicBaked.catalogEmpty")
  });
  return /* @__PURE__ */ f("main", { className: "max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-stack-lg pb-section-gap-desktop", children: [
    /* @__PURE__ */ f("nav", { className: "flex items-center gap-2 mb-stack-lg text-on-surface-variant text-label-caps font-semibold uppercase tracking-widest", children: [
      /* @__PURE__ */ c("a", { className: "hover:text-primary transition-colors", href: r.homePath ?? "/index.html", children: e("publicBaked.home") }),
      /* @__PURE__ */ c("span", { className: "material-symbols-outlined text-[14px]", children: "chevron_right" }),
      /* @__PURE__ */ c("span", { className: "text-primary", children: n.pageTitle || e("publicBaked.catalogHeading") })
    ] }),
    /* @__PURE__ */ f("header", { className: "mb-stack-lg", children: [
      /* @__PURE__ */ c("h1", { className: "display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight", children: n.pageHeading || e("publicBaked.catalogHeading") }),
      n.pageSubtitle && /* @__PURE__ */ c("p", { className: "text-body-lg text-on-surface-variant max-w-2xl", children: n.pageSubtitle })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-stack-lg", children: [
      /* @__PURE__ */ c("aside", { className: "lg:col-span-3", "data-cms-catalog-sidebar": !0, children: /* @__PURE__ */ f("div", { className: "lg:sticky lg:top-24 space-y-stack-lg", children: [
        n.filters.showSearch && /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ c("label", { className: "font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-sm block", children: e("publicBaked.catalogSearchPlaceholder") }),
          /* @__PURE__ */ c(
            "input",
            {
              type: "search",
              "data-cms-catalog-search": !0,
              placeholder: e("publicBaked.catalogSearchPlaceholder"),
              className: "w-full bg-surface border border-outline-variant rounded-full px-4 py-2 focus:ring-primary focus:border-primary outline-none"
            }
          )
        ] }),
        n.filters.showCategoryFilter && /* @__PURE__ */ f("div", { "data-cms-catalog-categories": !0, children: [
          /* @__PURE__ */ c("h3", { className: "font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md", children: e("publicBaked.catalogFilterCategories") }),
          /* @__PURE__ */ c("div", { className: "space-y-2 text-body-md text-on-surface-variant", "data-cms-catalog-categories-host": !0 })
        ] }),
        n.filters.showPriceRange && /* @__PURE__ */ f("div", { "data-cms-catalog-price": !0, children: [
          /* @__PURE__ */ c("h3", { className: "font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md", children: e("publicBaked.catalogFilterPrice") }),
          /* @__PURE__ */ f("div", { className: "space-y-2", children: [
            /* @__PURE__ */ f("div", { className: "flex items-center justify-between text-body-md text-on-surface-variant", children: [
              /* @__PURE__ */ c("span", { "data-cms-catalog-price-min": !0, children: "—" }),
              /* @__PURE__ */ c("span", { "data-cms-catalog-price-max": !0, children: "—" })
            ] }),
            /* @__PURE__ */ c(
              "input",
              {
                type: "range",
                "data-cms-catalog-price-slider": !0,
                min: "0",
                max: "0",
                step: "1",
                className: "w-full accent-primary"
              }
            )
          ] })
        ] }),
        n.filters.showStockFilter && /* @__PURE__ */ f("div", { "data-cms-catalog-stock": !0, children: [
          /* @__PURE__ */ c("h3", { className: "font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md", children: e("publicBaked.catalogFilterStock") }),
          /* @__PURE__ */ c("div", { className: "space-y-2 text-body-md", "data-cms-catalog-stock-host": !0 })
        ] }),
        n.filters.showTagFilter && // Tags come last in the sidebar so a long tag list doesn't
        // push the price / category / stock filters off-screen.
        // The host is also capped at 16rem with overflow-y so
        // even dozens of tags stay inside the panel — the user
        // scrolls the chip cloud instead of the whole sidebar.
        /* @__PURE__ */ f("div", { "data-cms-catalog-tags": !0, children: [
          /* @__PURE__ */ c("h3", { className: "font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md", children: e("publicBaked.catalogFilterTags") }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "storefront-catalog-tags-host flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1",
              "data-cms-catalog-tags-host": !0
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ f("section", { className: "lg:col-span-9", children: [
        /* @__PURE__ */ f("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-stack-md mb-stack-md", children: [
          /* @__PURE__ */ c("p", { className: "text-body-md text-on-surface-variant", "data-cms-catalog-count": !0, children: e("publicBaked.catalogLoading") }),
          n.filters.showSortBy && /* @__PURE__ */ f(
            "select",
            {
              "data-cms-catalog-sort": !0,
              className: "bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary outline-none",
              children: [
                /* @__PURE__ */ c("option", { value: "newest", children: e("publicBaked.catalogSortNewest") }),
                /* @__PURE__ */ c("option", { value: "price-asc", children: e("publicBaked.catalogSortPriceAsc") }),
                /* @__PURE__ */ c("option", { value: "price-desc", children: e("publicBaked.catalogSortPriceDesc") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c(
          "div",
          {
            "data-cms-catalog-grid": !0,
            "data-cms-catalog-flags": a,
            "data-cms-catalog-i18n": o,
            "data-cms-catalog-cols": String(n.initialColumns),
            className: `storefront-catalog-grid is-cols-${n.initialColumns}`,
            children: /* @__PURE__ */ c("p", { className: "storefront-catalog-empty", children: e("publicBaked.catalogLoading") })
          }
        )
      ] })
    ] })
  ] });
}
const Hr = "storefront";
function Un(r) {
  var t;
  if (r.activeThemeId !== Hr) return null;
  const e = (t = r.themeConfigs) == null ? void 0 : t[Hr];
  return e || null;
}
async function Ni(r) {
  const e = Un(r.settings), t = {
    ...Ce,
    ...(e == null ? void 0 : e.catalog) ?? {}
  };
  if (!t.enabled) return;
  const n = (t.slug || Ce.slug).replace(/^\/+/, ""), a = qa(r), o = Ja({
    base: Sn,
    baseProps: {
      site: a,
      pageTitle: t.pageTitle,
      pageDescription: t.pageSubtitle,
      ogImage: void 0,
      currentPath: n
    },
    template: Ci,
    templateProps: { site: a }
  });
  await pn({
    path: n,
    content: o,
    encoding: "utf-8"
  });
}
async function Si(r, e) {
  if (!(!r || r === e))
    try {
      await Wa(r);
    } catch {
    }
}
async function Wt(r) {
  const e = Un(r.settings);
  if (!(e != null && e.catalog) || !e.catalog.enabled) return;
  const t = {
    ...Be,
    ...e.productDefaults ?? {}
  };
  try {
    await Va(
      r.settings,
      r.posts,
      r.pages,
      r.terms,
      r.media,
      { currency: t.currency }
    ), await Ni(r);
  } catch (n) {
    console.warn("[storefront] catalog republish failed:", n);
  }
}
const je = "storefront", Ai = 480, Ti = 144, Ei = "contain", jr = ["image/jpeg", "image/png", "image/webp"];
function Ii({
  config: r,
  save: e
}) {
  const { t } = B("theme-storefront"), [n, a] = U("home");
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300", children: t("settings.description") }),
    /* @__PURE__ */ f(
      "nav",
      {
        className: "flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800",
        "aria-label": t("title"),
        children: [
          /* @__PURE__ */ c(he, { active: n === "home", onClick: () => a("home"), label: t("settings.tabs.home") }),
          /* @__PURE__ */ c(he, { active: n === "single", onClick: () => a("single"), label: t("settings.tabs.single") }),
          /* @__PURE__ */ c(he, { active: n === "productDefaults", onClick: () => a("productDefaults"), label: t("settings.tabs.productDefaults") }),
          /* @__PURE__ */ c(he, { active: n === "catalog", onClick: () => a("catalog"), label: t("settings.tabs.catalog") }),
          /* @__PURE__ */ c(he, { active: n === "footer", onClick: () => a("footer"), label: t("settings.tabs.footer") }),
          /* @__PURE__ */ c(he, { active: n === "logo", onClick: () => a("logo"), label: t("settings.tabs.logo") }),
          /* @__PURE__ */ c(he, { active: n === "style", onClick: () => a("style"), label: t("settings.tabs.style") })
        ]
      }
    ),
    n === "home" && /* @__PURE__ */ c(Mi, { config: r, save: e }),
    n === "single" && /* @__PURE__ */ c(Pi, { config: r, save: e }),
    n === "productDefaults" && /* @__PURE__ */ c(Fi, { config: r, save: e }),
    n === "catalog" && /* @__PURE__ */ c($i, { config: r, save: e }),
    n === "footer" && /* @__PURE__ */ c(Bi, { config: r, save: e }),
    n === "logo" && /* @__PURE__ */ c(zi, { config: r, save: e }),
    n === "style" && /* @__PURE__ */ c(Hi, { config: r, save: e })
  ] });
}
function he({
  active: r,
  onClick: e,
  label: t
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      onClick: e,
      className: r ? "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-blue-600 text-surface-900 dark:text-surface-50" : "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
      children: t
    }
  );
}
function Mi({ config: r, save: e }) {
  var d, u, p, h, m, v, g, y;
  const { t } = B("theme-storefront"), { terms: n } = er(), [a, o] = U({
    ...ee,
    ...r.home ?? {},
    hero: { ...ee.hero, ...((d = r.home) == null ? void 0 : d.hero) ?? {} },
    bento: { ...wn, ...((u = r.home) == null ? void 0 : u.bento) ?? {} },
    trending: { ...xn, ...((p = r.home) == null ? void 0 : p.trending) ?? {} },
    journal: { ...kn, ...((h = r.home) == null ? void 0 : h.journal) ?? {} },
    storeInfo: {
      ...qt,
      ...((m = r.home) == null ? void 0 : m.storeInfo) ?? {},
      hours: ((g = (v = r.home) == null ? void 0 : v.storeInfo) == null ? void 0 : g.hours) ?? qt.hours
    },
    reviews: { ...ee.reviews, ...((y = r.home) == null ? void 0 : y.reviews) ?? {} }
  }), [i, s] = U(!1);
  async function l() {
    s(!0);
    try {
      await e({ ...r, home: a }), $.success(t("settings.buttons.saved"));
    } catch (b) {
      $.error(b.message);
    } finally {
      s(!1);
    }
  }
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ f(W, { title: t("settings.home.bento.heading"), children: [
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.home.bento.enabled"),
          value: a.bento.enabled,
          onChange: (b) => o({ ...a, bento: { ...a.bento, enabled: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.bento.eyebrow"),
          value: a.bento.eyebrow,
          onChange: (b) => o({ ...a, bento: { ...a.bento, eyebrow: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.bento.title"),
          value: a.bento.title,
          onChange: (b) => o({ ...a, bento: { ...a.bento, title: b } })
        }
      ),
      /* @__PURE__ */ c(
        me,
        {
          label: t("settings.home.bento.subtitle"),
          value: a.bento.subtitle,
          onChange: (b) => o({ ...a, bento: { ...a.bento, subtitle: b } })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.bento.viewAllLabel"),
            value: a.bento.viewAllLabel,
            onChange: (b) => o({ ...a, bento: { ...a.bento, viewAllLabel: b } })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.bento.viewAllHref"),
            value: a.bento.viewAllHref,
            onChange: (b) => o({ ...a, bento: { ...a.bento, viewAllHref: b } })
          }
        )
      ] }),
      /* @__PURE__ */ c(
        Oi,
        {
          cards: a.bento.cards,
          onChange: (b) => o({ ...a, bento: { ...a.bento, cards: b } })
        }
      )
    ] }),
    /* @__PURE__ */ f(W, { title: t("settings.home.trending.heading"), children: [
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.home.trending.enabled"),
          value: a.trending.enabled,
          onChange: (b) => o({ ...a, trending: { ...a.trending, enabled: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.trending.eyebrow"),
          value: a.trending.eyebrow,
          onChange: (b) => o({ ...a, trending: { ...a.trending, eyebrow: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.trending.title"),
          value: a.trending.title,
          onChange: (b) => o({ ...a, trending: { ...a.trending, title: b } })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ c("label", { className: "label", children: t("settings.home.trending.mode") }),
          /* @__PURE__ */ f(
            "select",
            {
              className: "input",
              value: a.trending.mode,
              onChange: (b) => o({ ...a, trending: { ...a.trending, mode: b.target.value } }),
              children: [
                /* @__PURE__ */ c("option", { value: "all", children: t("settings.home.trending.modeAll") }),
                /* @__PURE__ */ c("option", { value: "category", children: t("settings.home.trending.modeCategory") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c(
          Di,
          {
            label: t("settings.home.trending.count"),
            value: a.trending.count,
            onChange: (b) => o({ ...a, trending: { ...a.trending, count: b } })
          }
        )
      ] }),
      a.trending.mode === "category" && /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: t("settings.home.trending.categoryId") }),
        /* @__PURE__ */ f(
          "select",
          {
            className: "input",
            value: a.trending.categoryId,
            onChange: (b) => o({ ...a, trending: { ...a.trending, categoryId: b.target.value } }),
            children: [
              /* @__PURE__ */ c("option", { value: "", children: "—" }),
              n.filter((b) => b.type === "category").map((b) => /* @__PURE__ */ c("option", { value: b.id, children: b.name }, b.id))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f(W, { title: t("settings.home.categoryRows.heading"), children: [
      /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2", children: t("settings.home.categoryRows.description") }),
      /* @__PURE__ */ c(
        Ri,
        {
          rows: a.categoryRows ?? [],
          terms: n.filter((b) => b.type === "category"),
          onChange: (b) => o({ ...a, categoryRows: b })
        }
      )
    ] }),
    /* @__PURE__ */ f(W, { title: t("settings.home.storeInfo.heading"), children: [
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.home.storeInfo.enabled"),
          value: a.storeInfo.enabled,
          onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, enabled: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.storeInfo.eyebrow"),
          value: a.storeInfo.eyebrow,
          onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, eyebrow: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.storeInfo.title"),
          value: a.storeInfo.title,
          onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, title: b } })
        }
      ),
      /* @__PURE__ */ c(
        Kt,
        {
          label: t("settings.home.storeInfo.imageUrl"),
          value: a.storeInfo.imageUrl,
          onChange: (b, N) => o({
            ...a,
            storeInfo: {
              ...a.storeInfo,
              imageUrl: b,
              imageAlt: N && N.length > 0 ? N : a.storeInfo.imageAlt
            }
          }),
          help: t("settings.home.storeInfo.imageHelp")
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.storeInfo.imageAlt"),
          value: a.storeInfo.imageAlt,
          onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, imageAlt: b } })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.storeInfo.addressLabel"),
            value: a.storeInfo.addressLabel,
            onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, addressLabel: b } })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.storeInfo.hoursLabel"),
            value: a.storeInfo.hoursLabel,
            onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, hoursLabel: b } })
          }
        )
      ] }),
      /* @__PURE__ */ c(
        me,
        {
          label: t("settings.home.storeInfo.address"),
          value: a.storeInfo.address,
          help: t("settings.home.storeInfo.addressHelp"),
          onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, address: b } })
        }
      ),
      /* @__PURE__ */ c(
        me,
        {
          label: t("settings.home.storeInfo.hours"),
          value: (a.storeInfo.hours ?? []).join(`
`),
          help: t("settings.home.storeInfo.hoursHelp"),
          onChange: (b) => o({
            ...a,
            storeInfo: {
              ...a.storeInfo,
              hours: b.split(/\r?\n/).map((N) => N.trim()).filter(Boolean)
            }
          })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.storeInfo.ctaLabel"),
            value: a.storeInfo.ctaLabel,
            onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, ctaLabel: b } })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.storeInfo.ctaHref"),
            value: a.storeInfo.ctaHref,
            help: t("settings.home.storeInfo.ctaHelp"),
            onChange: (b) => o({ ...a, storeInfo: { ...a.storeInfo, ctaHref: b } })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f(W, { title: t("settings.home.journal.heading"), children: [
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.home.journal.enabled"),
          value: a.journal.enabled,
          onChange: (b) => o({ ...a, journal: { ...a.journal, enabled: b } })
        }
      ),
      /* @__PURE__ */ c(
        Kt,
        {
          label: t("settings.home.journal.imageUrl"),
          value: a.journal.imageUrl,
          onChange: (b, N) => o({
            ...a,
            journal: {
              ...a.journal,
              imageUrl: b,
              imageAlt: N && N.length > 0 ? N : a.journal.imageAlt
            }
          })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.journal.imageAlt"),
          value: a.journal.imageAlt,
          onChange: (b) => o({ ...a, journal: { ...a.journal, imageAlt: b } })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.home.journal.eyebrow"),
          value: a.journal.eyebrow,
          onChange: (b) => o({ ...a, journal: { ...a.journal, eyebrow: b } })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.journal.title"),
            value: a.journal.title,
            onChange: (b) => o({ ...a, journal: { ...a.journal, title: b } })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.journal.titleItalicTail"),
            value: a.journal.titleItalicTail,
            onChange: (b) => o({ ...a, journal: { ...a.journal, titleItalicTail: b } })
          }
        )
      ] }),
      /* @__PURE__ */ c(
        me,
        {
          label: t("settings.home.journal.subtitle"),
          value: a.journal.subtitle,
          onChange: (b) => o({ ...a, journal: { ...a.journal, subtitle: b } })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.journal.ctaLabel"),
            value: a.journal.ctaLabel,
            onChange: (b) => o({ ...a, journal: { ...a.journal, ctaLabel: b } })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.home.journal.ctaHref"),
            value: a.journal.ctaHref,
            onChange: (b) => o({ ...a, journal: { ...a.journal, ctaHref: b } })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ c(ze, { onSave: l, saving: i })
  ] });
}
function Oi({
  cards: r,
  onChange: e
}) {
  function t() {
    e([
      ...r,
      { imageUrl: "", imageAlt: "", label: "", ctaLabel: "Shop now", ctaHref: "", size: "small" }
    ]);
  }
  function n(o) {
    e(r.filter((i, s) => s !== o));
  }
  function a(o, i) {
    e(r.map((s, l) => l === o ? { ...s, ...i } : s));
  }
  return /* @__PURE__ */ f("div", { className: "border-t border-surface-200 pt-3 mt-3 dark:border-surface-700", children: [
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ f("span", { className: "text-sm font-semibold", children: [
        "Bento cards (",
        r.length,
        ")"
      ] }),
      /* @__PURE__ */ f("button", { type: "button", onClick: t, className: "text-xs flex items-center gap-1 text-blue-600", children: [
        /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
        " Add card"
      ] })
    ] }),
    /* @__PURE__ */ c("div", { className: "space-y-3", children: r.map((o, i) => /* @__PURE__ */ f("div", { className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ f("span", { className: "text-xs font-semibold", children: [
          "Card ",
          i + 1
        ] }),
        /* @__PURE__ */ c("button", { type: "button", onClick: () => n(i), className: "p-1 text-red-500", children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" }) })
      ] }),
      /* @__PURE__ */ c(
        Kt,
        {
          label: "Image URL",
          value: o.imageUrl,
          onChange: (s, l) => a(i, {
            imageUrl: s,
            imageAlt: l && l.length > 0 ? l : o.imageAlt
          }),
          format: "medium"
        }
      ),
      /* @__PURE__ */ c(
        "input",
        {
          className: "input",
          placeholder: "Image alt",
          value: o.imageAlt,
          onChange: (s) => a(i, { imageAlt: s.target.value })
        }
      ),
      /* @__PURE__ */ c(
        "input",
        {
          className: "input",
          placeholder: "Label",
          value: o.label,
          onChange: (s) => a(i, { label: s.target.value })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ c(
          "input",
          {
            className: "input",
            placeholder: "CTA label",
            value: o.ctaLabel,
            onChange: (s) => a(i, { ctaLabel: s.target.value })
          }
        ),
        /* @__PURE__ */ c(
          "input",
          {
            className: "input",
            placeholder: "CTA link",
            value: o.ctaHref,
            onChange: (s) => a(i, { ctaHref: s.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f(
        "select",
        {
          className: "input",
          value: o.size,
          onChange: (s) => a(i, { size: s.target.value }),
          children: [
            /* @__PURE__ */ c("option", { value: "large", children: "Large (8 cols)" }),
            /* @__PURE__ */ c("option", { value: "small", children: "Small (4 cols)" })
          ]
        }
      )
    ] }, i)) })
  ] });
}
const Li = {
  enabled: !0,
  eyebrow: "",
  title: "",
  categoryId: "",
  count: 4,
  layout: "grid",
  viewAllLabel: "",
  viewAllHref: ""
};
function Ri({
  rows: r,
  terms: e,
  onChange: t
}) {
  const { t: n } = B("theme-storefront");
  function a() {
    t([...r, { ...Li }]);
  }
  function o(l) {
    t(r.filter((d, u) => u !== l));
  }
  function i(l, d) {
    const u = l + d;
    if (u < 0 || u >= r.length) return;
    const p = r.slice();
    [p[l], p[u]] = [p[u], p[l]], t(p);
  }
  function s(l, d) {
    t(r.map((u, p) => p === l ? { ...u, ...d } : u));
  }
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ c("span", { className: "text-sm font-semibold", children: n("settings.home.categoryRows.count", { count: r.length }) }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: a,
          className: "text-xs flex items-center gap-1 text-blue-600",
          children: [
            /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
            " ",
            n("settings.home.categoryRows.add")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c("div", { className: "space-y-3", children: r.map((l, d) => /* @__PURE__ */ f(
      "div",
      {
        className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700",
        children: [
          /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ c("span", { className: "text-xs font-semibold", children: n("settings.home.categoryRows.row", { index: d + 1 }) }),
            /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => i(d, -1),
                  className: "p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400",
                  title: n("settings.home.categoryRows.moveUp"),
                  children: "↑"
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => i(d, 1),
                  className: "p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400",
                  title: n("settings.home.categoryRows.moveDown"),
                  children: "↓"
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => o(d),
                  className: "p-1 text-red-500",
                  title: n("settings.home.categoryRows.remove"),
                  children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ f("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ c(
              "input",
              {
                type: "checkbox",
                className: "h-4 w-4",
                checked: l.enabled,
                onChange: (u) => s(d, { enabled: u.target.checked })
              }
            ),
            /* @__PURE__ */ c("span", { children: n("settings.home.categoryRows.enabled") })
          ] }),
          /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ c(
              "input",
              {
                className: "input",
                placeholder: n("settings.home.categoryRows.eyebrow"),
                value: l.eyebrow,
                onChange: (u) => s(d, { eyebrow: u.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                className: "input",
                placeholder: n("settings.home.categoryRows.title"),
                value: l.title,
                onChange: (u) => s(d, { title: u.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ f(
              "select",
              {
                className: "input",
                value: l.categoryId,
                onChange: (u) => s(d, { categoryId: u.target.value }),
                children: [
                  /* @__PURE__ */ c("option", { value: "", children: n("settings.home.categoryRows.allProducts") }),
                  e.map((u) => /* @__PURE__ */ c("option", { value: u.id, children: u.name }, u.id))
                ]
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                type: "number",
                className: "input",
                min: "1",
                max: "20",
                value: l.count,
                onChange: (u) => s(d, { count: parseInt(u.target.value, 10) || 4 })
              }
            )
          ] }),
          /* @__PURE__ */ f(
            "select",
            {
              className: "input",
              value: l.layout,
              onChange: (u) => s(d, { layout: u.target.value }),
              children: [
                /* @__PURE__ */ c("option", { value: "grid", children: n("settings.home.categoryRows.layoutGrid") }),
                /* @__PURE__ */ c("option", { value: "slider", children: n("settings.home.categoryRows.layoutSlider") })
              ]
            }
          ),
          /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ c(
              "input",
              {
                className: "input",
                placeholder: n("settings.home.categoryRows.viewAllLabel"),
                value: l.viewAllLabel,
                onChange: (u) => s(d, { viewAllLabel: u.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                className: "input",
                placeholder: n("settings.home.categoryRows.viewAllHref"),
                value: l.viewAllHref,
                onChange: (u) => s(d, { viewAllHref: u.target.value })
              }
            )
          ] })
        ]
      },
      d
    )) })
  ] });
}
function Pi({ config: r, save: e }) {
  const { t } = B("theme-storefront"), [n, a] = U({
    ...rr,
    ...r.single ?? {}
  }), [o, i] = U(!1);
  async function s() {
    i(!0);
    try {
      await e({ ...r, single: n }), $.success(t("settings.buttons.saved"));
    } catch (p) {
      $.error(p.message);
    } finally {
      i(!1);
    }
  }
  function l(p, h) {
    const m = [...n.careKitItems];
    m[p] = h, a({ ...n, careKitItems: m });
  }
  function d(p) {
    a({ ...n, careKitItems: n.careKitItems.filter((h, m) => m !== p) });
  }
  function u() {
    a({ ...n, careKitItems: [...n.careKitItems, ""] });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ f(W, { title: t("settings.tabs.single"), children: [
      /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2", children: t("settings.single.description") }),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.single.showAuthorBio"),
          value: n.showAuthorBio,
          onChange: (p) => a({ ...n, showAuthorBio: p })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.single.showRelatedProducts"),
          value: n.showRelatedProducts,
          onChange: (p) => a({ ...n, showRelatedProducts: p })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.single.relatedTitle"),
          value: n.relatedTitle,
          onChange: (p) => a({ ...n, relatedTitle: p })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.single.showCareKit"),
          value: n.showCareKit,
          onChange: (p) => a({ ...n, showCareKit: p })
        }
      ),
      n.showCareKit && /* @__PURE__ */ f(se, { children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.single.careKitTitle"),
            value: n.careKitTitle,
            onChange: (p) => a({ ...n, careKitTitle: p })
          }
        ),
        /* @__PURE__ */ c(
          me,
          {
            label: t("settings.single.careKitDescription"),
            value: n.careKitDescription,
            onChange: (p) => a({ ...n, careKitDescription: p })
          }
        ),
        /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ f("span", { className: "label !mb-0", children: [
              t("settings.single.careKitItems"),
              " (",
              n.careKitItems.length,
              ")"
            ] }),
            /* @__PURE__ */ f("button", { type: "button", onClick: u, className: "text-xs flex items-center gap-1 text-blue-600", children: [
              /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
              " Add"
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "space-y-2", children: n.careKitItems.map((p, h) => /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ c(
              "input",
              {
                className: "input flex-1",
                value: p,
                onChange: (m) => l(h, m.target.value)
              }
            ),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => d(h), className: "p-1 text-red-500", children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" }) })
          ] }, h)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ c(ze, { onSave: s, saving: o })
  ] });
}
function Fi({ config: r, save: e }) {
  const { t } = B("theme-storefront"), [n, a] = U({
    ...Be,
    ...r.productDefaults ?? {}
  }), [o, i] = U(!1);
  async function s() {
    i(!0);
    try {
      await e({ ...r, productDefaults: n }), $.success(t("settings.buttons.saved"));
    } catch (l) {
      $.error(l.message);
    } finally {
      i(!1);
    }
  }
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ f(W, { title: t("settings.tabs.productDefaults"), children: [
      /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2", children: t("settings.productDefaults.description") }),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.productDefaults.currency"),
          value: n.currency,
          onChange: (l) => a({ ...n, currency: l.toUpperCase() })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.productDefaults.ctaLabel"),
            value: n.ctaLabel,
            onChange: (l) => a({ ...n, ctaLabel: l })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.productDefaults.ctaHref"),
            value: n.ctaHref,
            onChange: (l) => a({ ...n, ctaHref: l })
          }
        )
      ] }),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.productDefaults.inquiryOnly"),
          value: n.inquiryOnly,
          onChange: (l) => a({ ...n, inquiryOnly: l })
        }
      )
    ] }),
    /* @__PURE__ */ c(ze, { onSave: s, saving: o })
  ] });
}
function $i({ config: r, save: e }) {
  var g;
  const { t } = B("theme-storefront"), { settings: n, terms: a, users: o, media: i } = er(), [s, l] = U({
    ...Ce,
    ...r.catalog ?? {},
    filters: {
      ...Ce.filters,
      ...((g = r.catalog) == null ? void 0 : g.filters) ?? {}
    }
  }), [d, u] = U(!1), [p, h] = U(!1);
  async function m() {
    var y;
    u(!0);
    try {
      const b = (s.slug || "catalog.html").replace(/^\/+/, ""), N = ((y = r.catalog) == null ? void 0 : y.lastPublishedPath) ?? "", A = b, R = {
        ...s,
        slug: b,
        lastPublishedPath: A
      };
      await e({ ...r, catalog: R }), await Si(N, A);
      const [P, L] = await Promise.all([
        mt({ type: "post" }),
        mt({ type: "page" })
      ]), S = {
        ...n,
        themeConfigs: { ...n.themeConfigs, [je]: { ...r, catalog: R } }
      };
      await hn(S, P, L, a), $.success(t("settings.buttons.saved"));
    } catch (b) {
      $.error(b.message);
    } finally {
      u(!1);
    }
  }
  async function v() {
    h(!0);
    try {
      const y = Xa(o, i), b = await Za({ settings: n, terms: a, users: o, authorLookup: y });
      await Wt(b);
      const N = { ...s, jsonLastGeneratedAt: Date.now() };
      l(N), await e({ ...r, catalog: N }), $.success(t("settings.buttons.saved"));
    } catch (y) {
      $.error(y.message);
    } finally {
      h(!1);
    }
  }
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ f(W, { title: t("settings.tabs.catalog"), children: [
      /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2", children: t("settings.catalog.description") }),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.enabled"),
          value: s.enabled,
          help: t("settings.catalog.enabledHelp"),
          onChange: (y) => l({ ...s, enabled: y })
        }
      ),
      /* @__PURE__ */ c(
        T,
        {
          label: t("settings.catalog.slug"),
          value: s.slug,
          help: t("settings.catalog.slugHelp"),
          onChange: (y) => l({ ...s, slug: y })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.catalog.pageTitle"),
            value: s.pageTitle,
            onChange: (y) => l({ ...s, pageTitle: y })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.catalog.pageHeading"),
            value: s.pageHeading,
            onChange: (y) => l({ ...s, pageHeading: y })
          }
        )
      ] }),
      /* @__PURE__ */ c(
        me,
        {
          label: t("settings.catalog.pageSubtitle"),
          value: s.pageSubtitle,
          onChange: (y) => l({ ...s, pageSubtitle: y })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ c(
          j,
          {
            label: t("settings.catalog.addToMenu"),
            value: s.addToMenu,
            onChange: (y) => l({ ...s, addToMenu: y })
          }
        ),
        /* @__PURE__ */ c(
          T,
          {
            label: t("settings.catalog.menuLabel"),
            value: s.menuLabel,
            onChange: (y) => l({ ...s, menuLabel: y })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f(W, { title: t("settings.catalog.filtersHeading"), children: [
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.showSearch"),
          value: s.filters.showSearch,
          onChange: (y) => l({ ...s, filters: { ...s.filters, showSearch: y } })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.showCategoryFilter"),
          value: s.filters.showCategoryFilter,
          onChange: (y) => l({ ...s, filters: { ...s.filters, showCategoryFilter: y } })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.showTagFilter"),
          value: s.filters.showTagFilter,
          onChange: (y) => l({ ...s, filters: { ...s.filters, showTagFilter: y } })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.showPriceRange"),
          value: s.filters.showPriceRange,
          onChange: (y) => l({ ...s, filters: { ...s.filters, showPriceRange: y } })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.showStockFilter"),
          value: s.filters.showStockFilter,
          onChange: (y) => l({ ...s, filters: { ...s.filters, showStockFilter: y } })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.catalog.showSortBy"),
          value: s.filters.showSortBy,
          onChange: (y) => l({ ...s, filters: { ...s.filters, showSortBy: y } })
        }
      ),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: t("settings.catalog.initialColumns") }),
        /* @__PURE__ */ f(
          "select",
          {
            className: "input",
            value: String(s.initialColumns),
            onChange: (y) => l({ ...s, initialColumns: parseInt(y.target.value, 10) }),
            children: [
              /* @__PURE__ */ c("option", { value: "2", children: "2" }),
              /* @__PURE__ */ c("option", { value: "3", children: "3" }),
              /* @__PURE__ */ c("option", { value: "4", children: "4" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f(W, { title: t("settings.catalog.forceRegenerate"), children: [
      /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300", children: t("settings.catalog.forceRegenerateHelp") }),
      /* @__PURE__ */ f("p", { className: "text-xs text-surface-500", children: [
        t("settings.catalog.lastGenerated"),
        ":",
        " ",
        s.jsonLastGeneratedAt ? new Date(s.jsonLastGeneratedAt).toLocaleString() : t("settings.catalog.never")
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: v,
          disabled: p || !s.enabled,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-sm font-medium hover:bg-surface-container disabled:opacity-50",
          children: [
            /* @__PURE__ */ c(bt, { className: p ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ c(zn, { className: p ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ c("span", { children: t(p ? "settings.buttons.regenerating" : "settings.buttons.forceRegenerate") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c(ze, { onSave: m, saving: d })
  ] });
}
function Bi({ config: r, save: e }) {
  const { t } = B("theme-storefront"), [n, a] = U({
    ...Cn,
    ...r.footer ?? {}
  }), [o, i] = U(!1);
  async function s() {
    i(!0);
    try {
      await e({ ...r, footer: n }), $.success(t("settings.buttons.saved"));
    } catch (l) {
      $.error(l.message);
    } finally {
      i(!1);
    }
  }
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ f(W, { title: t("settings.tabs.footer"), children: [
      /* @__PURE__ */ c(
        me,
        {
          label: t("settings.footer.tagline"),
          value: n.tagline,
          help: t("settings.footer.taglineHelp"),
          onChange: (l) => a({ ...n, tagline: l })
        }
      ),
      /* @__PURE__ */ c(
        j,
        {
          label: t("settings.footer.showSocials"),
          value: n.showSocials,
          onChange: (l) => a({ ...n, showSocials: l })
        }
      )
    ] }),
    /* @__PURE__ */ c(ze, { onSave: s, saving: o })
  ] });
}
function zi({ config: r, save: e }) {
  const { t } = B("theme-storefront"), { settings: n, terms: a } = er(), [o, i] = U(!1), [s, l] = U(!1), d = to(null), u = r.logoEnabled && n.baseUrl ? `${n.baseUrl.replace(/\/+$/, "")}/${Ka(je)}?v=${r.logoUpdatedAt}` : "";
  async function p(v) {
    const g = {
      ...n,
      themeConfigs: { ...n.themeConfigs, [je]: v }
    };
    try {
      const [y, b] = await Promise.all([
        mt({ type: "post" }),
        mt({ type: "page" })
      ]);
      await hn(g, y, b, a);
    } catch (y) {
      console.error("[theme-storefront] menu.json refresh failed:", y);
    }
  }
  async function h(v) {
    if (!jr.includes(v.type)) {
      $.error(t("settings.logo.invalidType"));
      return;
    }
    i(!0);
    try {
      await Qa({ themeId: je, file: v, width: Ai, height: Ti, fit: Ei });
      const g = { ...r, logoEnabled: !0, logoUpdatedAt: Date.now() };
      await e(g), await p(g), $.success(t("settings.logo.saved"));
    } catch (g) {
      console.error("[theme-storefront] logo upload failed:", g), $.error(t("settings.logo.failed"));
    } finally {
      i(!1), d.current && (d.current.value = "");
    }
  }
  async function m() {
    l(!0);
    try {
      await eo(je);
      const v = { ...r, logoEnabled: !1, logoUpdatedAt: Date.now() };
      await e(v), await p(v), $.success(t("settings.logo.removed"));
    } catch (v) {
      $.error(v.message);
    } finally {
      l(!1);
    }
  }
  return /* @__PURE__ */ c("div", { className: "space-y-6", children: /* @__PURE__ */ f(W, { title: t("settings.tabs.logo"), children: [
    /* @__PURE__ */ c("p", { className: "text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2", children: t("settings.logo.description") }),
    u && /* @__PURE__ */ c("div", { className: "rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-900", children: /* @__PURE__ */ c("img", { src: u, alt: "Logo preview", className: "max-h-24 w-auto" }) }),
    /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ c(
        "input",
        {
          ref: d,
          type: "file",
          accept: jr.join(","),
          className: "hidden",
          onChange: (v) => {
            var y;
            const g = (y = v.target.files) == null ? void 0 : y[0];
            g && h(g);
          }
        }
      ),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: () => {
            var v;
            return (v = d.current) == null ? void 0 : v.click();
          },
          disabled: o,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50",
          children: [
            /* @__PURE__ */ c(bt, { className: o ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ c(ki, { className: o ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ c("span", { children: r.logoEnabled ? t("settings.logo.replace") : t("settings.logo.upload") })
          ]
        }
      ),
      r.logoEnabled && /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: m,
          disabled: s,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50",
          children: [
            /* @__PURE__ */ c(bt, { className: s ? "h-4 w-4 animate-spin" : "hidden" }),
            /* @__PURE__ */ c(te, { className: s ? "hidden" : "h-4 w-4" }),
            /* @__PURE__ */ c("span", { children: t("settings.logo.remove") })
          ]
        }
      )
    ] })
  ] }) });
}
function Hi({ config: r, save: e }) {
  var p;
  const { t } = B("theme-storefront"), [n, a] = U({
    ...gn,
    ...r.style ?? {},
    vars: { ...((p = r.style) == null ? void 0 : p.vars) ?? {} }
  }), [o, i] = U(!1);
  async function s() {
    i(!0);
    try {
      await e({ ...r, style: n, cssUpdatedAt: Date.now() }), await ho({
        baseCssText: wd.cssText ?? "",
        style: n
      }), $.success(t("settings.buttons.saved"));
    } catch (h) {
      $.error(h.message);
    } finally {
      i(!1);
    }
  }
  function l(h, m) {
    const v = { ...n.vars };
    m && m.trim() ? v[h] = m : delete v[h], a({ ...n, vars: v });
  }
  function d(h) {
    const m = { ...n.vars };
    delete m[h], a({ ...n, vars: m });
  }
  const u = [
    ...Object.keys(Re.serif).map((h) => ({
      name: h,
      fallback: "serif"
    })),
    ...Object.keys(Re.sans).map((h) => ({
      name: h,
      fallback: "sans-serif"
    }))
  ];
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ c(Ui, { draft: n, setDraft: a }),
    /* @__PURE__ */ f(W, { title: t("settings.tabs.style"), children: [
      /* @__PURE__ */ c("link", { rel: "stylesheet", href: po() }),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ c("label", { className: "label", children: t("settings.font.serif") }),
          /* @__PURE__ */ c(
            Rr,
            {
              options: u,
              value: n.fontSerif || Pe,
              onChange: (h) => a({ ...n, fontSerif: h })
            }
          )
        ] }),
        /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ c("label", { className: "label", children: t("settings.font.sans") }),
          /* @__PURE__ */ c(
            Rr,
            {
              options: u,
              value: n.fontSans || Fe,
              onChange: (h) => a({ ...n, fontSans: h })
            }
          )
        ] })
      ] })
    ] }),
    lo.map((h) => /* @__PURE__ */ c(W, { title: t(`settings.groups.${h}`), children: Ot.filter((m) => m.group === h).map((m) => /* @__PURE__ */ c(
      ji,
      {
        spec: m,
        value: n.vars[m.name] ?? "",
        onChange: (v) => l(m.name, v),
        onClear: () => d(m.name),
        labelText: t(`settings.${m.labelKey}`)
      },
      m.name
    )) }, h)),
    /* @__PURE__ */ c(ze, { onSave: s, saving: o })
  ] });
}
function ji({
  spec: r,
  value: e,
  onChange: t,
  onClear: n,
  labelText: a
}) {
  const o = e || r.defaultValue;
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ c("div", { className: "flex-1", children: /* @__PURE__ */ c("label", { className: "text-sm text-surface-700 dark:text-surface-300", children: a }) }),
    r.type === "color" ? /* @__PURE__ */ c(
      "input",
      {
        type: "color",
        className: "h-8 w-14 rounded border border-surface-300 dark:border-surface-700 cursor-pointer",
        value: o,
        onChange: (i) => t(i.target.value)
      }
    ) : /* @__PURE__ */ c(
      "input",
      {
        type: "text",
        className: "input flex-1 max-w-xs",
        placeholder: r.defaultValue,
        value: e,
        onChange: (i) => t(i.target.value)
      }
    ),
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        onClick: n,
        title: "Reset to default",
        className: "p-1 text-surface-400 hover:text-surface-700",
        children: /* @__PURE__ */ c(zn, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
function W({ title: r, children: e }) {
  return /* @__PURE__ */ f("section", { className: "rounded-lg border border-surface-200 dark:border-surface-800 p-4 space-y-3", children: [
    /* @__PURE__ */ c("h3", { className: "text-sm font-semibold text-surface-900 dark:text-surface-50", children: r }),
    e
  ] });
}
function Kt({
  label: r,
  value: e,
  onChange: t,
  help: n,
  format: a = "large"
}) {
  const [o, i] = U(!1);
  return /* @__PURE__ */ f(se, { children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: r }),
      /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ c(
          "input",
          {
            type: "url",
            className: "input flex-1",
            placeholder: "https://…",
            value: e,
            onChange: (s) => t(s.target.value)
          }
        ),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: () => i(!0),
            className: "inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-700 text-xs font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 shrink-0",
            title: "Pick from media library",
            children: [
              /* @__PURE__ */ c(nr, { className: "h-3.5 w-3.5" }),
              "Media"
            ]
          }
        )
      ] }),
      n && /* @__PURE__ */ c("p", { className: "text-xs text-surface-500 mt-1", children: n })
    ] }),
    o && /* @__PURE__ */ c(
      Ga,
      {
        onPick: (s) => {
          const l = Ya(s, a);
          t(l, s.alt ?? ""), i(!1);
        },
        onClose: () => i(!1)
      }
    )
  ] });
}
function j({ label: r, value: e, onChange: t, help: n }) {
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("label", { className: "flex items-center gap-2 cursor-pointer text-sm text-surface-900 dark:text-surface-50", children: [
      /* @__PURE__ */ c(
        "input",
        {
          type: "checkbox",
          className: "h-4 w-4 rounded border-surface-300",
          checked: e,
          onChange: (a) => t(a.target.checked)
        }
      ),
      /* @__PURE__ */ c("span", { children: r })
    ] }),
    n && /* @__PURE__ */ c("p", { className: "text-xs text-surface-500 mt-1", children: n })
  ] });
}
function T({ label: r, value: e, onChange: t, help: n }) {
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ c("label", { className: "label", children: r }),
    /* @__PURE__ */ c(
      "input",
      {
        type: "text",
        className: "input",
        value: e,
        onChange: (a) => t(a.target.value)
      }
    ),
    n && /* @__PURE__ */ c("p", { className: "text-xs text-surface-500 mt-1", children: n })
  ] });
}
function me({ label: r, value: e, onChange: t, help: n }) {
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ c("label", { className: "label", children: r }),
    /* @__PURE__ */ c(
      "textarea",
      {
        className: "input",
        rows: 3,
        value: e,
        onChange: (a) => t(a.target.value)
      }
    ),
    n && /* @__PURE__ */ c("p", { className: "text-xs text-surface-500 mt-1", children: n })
  ] });
}
function Di({ label: r, value: e, onChange: t }) {
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ c("label", { className: "label", children: r }),
    /* @__PURE__ */ c(
      "input",
      {
        type: "number",
        step: "any",
        className: "input",
        value: e,
        onChange: (n) => t(parseFloat(n.target.value) || 0)
      }
    )
  ] });
}
function ze({ onSave: r, saving: e }) {
  const { t } = B("theme-storefront");
  return /* @__PURE__ */ c("div", { className: "flex justify-end gap-2 pt-3 border-t border-surface-200 dark:border-surface-800", children: /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      onClick: r,
      disabled: e,
      className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50",
      children: [
        /* @__PURE__ */ c(bt, { className: e ? "h-4 w-4 animate-spin" : "hidden" }),
        /* @__PURE__ */ c(xi, { className: e ? "hidden" : "h-4 w-4" }),
        /* @__PURE__ */ c("span", { children: t(e ? "settings.buttons.saving" : "settings.buttons.save") })
      ]
    }
  ) });
}
function Ui({
  draft: r,
  setDraft: e
}) {
  const { t } = B("theme-storefront"), n = co(r);
  function a(o) {
    e({
      vars: { ...o.vars },
      fontSerif: o.fontSerif,
      fontSans: o.fontSans
    });
  }
  return /* @__PURE__ */ f(W, { title: t("settings.presets.title"), children: [
    /* @__PURE__ */ c("p", { className: "text-xs text-surface-500 dark:text-surface-400 mb-3", children: t("settings.presets.help") }),
    /* @__PURE__ */ c("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: bn.map((o) => {
      const i = o.id === n, s = {
        vars: o.vars,
        fontSerif: o.fontSerif,
        fontSans: o.fontSans
      }, l = o.swatch.map(
        (d) => yn(s, d)
      );
      return /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: () => a(o),
          className: "text-left p-3 rounded border transition focus:outline-none focus:ring-2 focus:ring-blue-500 " + (i ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30" : "border-surface-200 hover:border-surface-400 dark:border-surface-700 dark:hover:border-surface-500"),
          "aria-pressed": i,
          children: [
            /* @__PURE__ */ f("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ f("span", { className: "text-sm font-medium flex items-center gap-1.5", children: [
                /* @__PURE__ */ c(wi, { className: "h-3.5 w-3.5 text-surface-400" }),
                t(`settings.presets.${o.id}.label`)
              ] }),
              /* @__PURE__ */ c("div", { className: "flex -space-x-1", "aria-hidden": "true", children: l.map((d, u) => /* @__PURE__ */ c(
                "span",
                {
                  className: "h-4 w-4 rounded-full ring-1 ring-surface-200 dark:ring-surface-700",
                  style: { background: d }
                },
                u
              )) })
            ] }),
            /* @__PURE__ */ c("p", { className: "text-xs text-surface-500 dark:text-surface-400 line-clamp-2", children: t(`settings.presets.${o.id}.description`) })
          ]
        },
        o.id
      );
    }) })
  ] });
}
function _i(r) {
  const e = r.variant ?? "card", t = r.placeholder || "Email address", n = r.ctaLabel || "Subscribe", a = r.mode === "mailto" ? "mailto" : "endpoint", o = r.eyebrow ? `<p class="font-label-caps text-label-caps uppercase tracking-widest mb-stack-sm ${e === "banner" ? "text-on-primary/80" : "text-secondary"}">${x(r.eyebrow)}</p>` : "", i = r.title ? `<h3 class="display-serif text-headline-md md:text-display-md mb-stack-sm leading-tight ${e === "banner" ? "text-on-primary" : "text-on-surface"}">${x(r.title)}</h3>` : "", s = r.subtitle ? `<p class="font-body-md text-body-md ${e === "banner" ? "text-on-primary/80" : "text-on-surface-variant"} mb-stack-md">${x(r.subtitle)}</p>` : "", l = `<p class="text-xs ${e === "banner" ? "text-on-primary/90" : "text-primary"}" data-cms-form-success hidden>${x(r.successMessage ?? "Thanks — you're on the list.")}</p>`, d = `<p class="text-xs text-error" data-cms-form-error hidden>${x(r.errorMessage ?? "Something went wrong. Please try again.")}</p>`, u = `<form class="flex flex-col sm:flex-row gap-stack-sm" data-cms-form="${a}" data-cms-form-endpoint="${C(r.endpoint ?? "")}" data-cms-form-mailto="${C(r.mailto ?? "")}">
<input type="email" name="email" required placeholder="${C(t)}" class="${e === "banner" ? "bg-on-primary/10 border border-on-primary/30 text-on-primary placeholder-on-primary/60" : "bg-surface border border-outline-variant"} flex-1 rounded-full px-5 py-3 focus:ring-primary focus:border-primary outline-none" />
<button type="submit" class="${e === "banner" ? "bg-on-primary text-primary hover:bg-on-primary/90" : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"} px-8 py-3 rounded-full font-label-caps text-label-caps uppercase tracking-widest transition-all">${x(n)}</button>
</form>${l}${d}`;
  return e === "banner" ? {
    html: `<section class="bg-primary text-on-primary py-section-gap-mobile md:py-section-gap-desktop">
<div class="max-w-container-max mx-auto px-gutter md:px-gutter-desktop grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
<div>${o}${i}${s}</div>
<div class="space-y-stack-sm">${u}</div>
</div>
</section>`
  } : {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="max-w-3xl mx-auto bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 p-8 md:p-12 text-center">${o}${i}${s}<div class="max-w-md mx-auto space-y-stack-sm">${u}</div></div>
</section>`
  };
}
function Vi(r) {
  const e = Array.isArray(r.images) ? r.images.filter((t) => t.url) : [];
  if (e.length === 0) return { html: "" };
  if (r.primaryFeatured && e.length > 1) {
    const [t, ...n] = e;
    return {
      html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="aspect-[4/5] md:aspect-[16/10] rounded-3xl overflow-hidden bg-surface-container-low mb-stack-md shadow-sm">
<img src="${C(t.url)}" alt="${C(t.alt)}" class="w-full h-full object-cover" loading="lazy" />
</div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-stack-md">${n.map(
        (a) => `<div class="aspect-square rounded-2xl overflow-hidden bg-surface-container-low"><img src="${C(a.url)}" alt="${C(a.alt)}" class="w-full h-full object-cover" loading="lazy" /></div>`
      ).join("")}</div>
</section>`
    };
  }
  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="grid grid-cols-2 md:grid-cols-3 gap-stack-md">${e.map(
      (t) => `<div class="aspect-square rounded-2xl overflow-hidden bg-surface-container-low"><img src="${C(t.url)}" alt="${C(t.alt)}" class="w-full h-full object-cover" loading="lazy" /></div>`
    ).join("")}</div>
</section>`
  };
}
function qi(r) {
  const e = Array.isArray(r.features) ? r.features.filter((n) => n.icon || n.label) : [];
  return e.length === 0 ? { html: "" } : {
    html: `<section class="max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="grid ${e.length === 1 ? "grid-cols-1" : e.length === 2 ? "grid-cols-2" : "grid-cols-3"} gap-stack-md py-stack-lg border-y border-outline-variant/30">${e.map(
      (n) => `<div class="text-center"><span class="material-symbols-outlined text-2xl text-primary mb-stack-sm block">${C(n.icon)}</span><p class="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">${x(n.label)}</p></div>`
    ).join("")}</div>
</section>`
  };
}
function Ji(r) {
  const e = Math.max(0, Math.floor(r)), t = r - e >= 0.5, n = Math.max(0, 5 - e - (t ? 1 : 0)), a = [];
  for (let o = 0; o < e; o++)
    a.push(
      `<span class="material-symbols-outlined text-base text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>`
    );
  t && a.push(
    `<span class="material-symbols-outlined text-base text-secondary" style="font-variation-settings: 'FILL' 1;">star_half</span>`
  );
  for (let o = 0; o < n; o++)
    a.push(
      '<span class="material-symbols-outlined text-base text-on-surface-variant">star</span>'
    );
  return a.join("");
}
function Wi(r) {
  const e = Array.isArray(r.reviews) ? r.reviews.filter((a) => a.text || a.authorName) : [];
  if (e.length === 0) return { html: "" };
  const t = `<div class="flex flex-col md:flex-row md:items-end md:justify-between mb-stack-lg gap-stack-md border-b border-outline-variant/30 pb-stack-md">
<div>${r.eyebrow ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${x(r.eyebrow)}</p>` : ""}${r.title ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface">${x(r.title)}</h2>` : ""}</div>${r.writeReviewLabel && r.writeReviewHref ? `<a href="${C(r.writeReviewHref)}" class="text-primary font-label-caps text-label-caps uppercase tracking-widest underline hover:text-primary-container transition-colors">${x(r.writeReviewLabel)}</a>` : ""}</div>`, n = e.map((a) => `<article class="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30">
<div class="flex items-center justify-between mb-stack-md">
<div class="flex items-center gap-stack-sm">${a.authorAvatarUrl ? `<img src="${C(a.authorAvatarUrl)}" alt="${C(a.authorName)}" class="w-12 h-12 rounded-full object-cover" loading="lazy" />` : `<span class="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed-variant inline-flex items-center justify-center font-bold">${x(a.authorInitials || (a.authorName ? a.authorName.slice(0, 2).toUpperCase() : "?"))}</span>`}<div>${a.authorName ? `<p class="font-body-md text-body-md font-semibold text-on-surface">${x(a.authorName)}</p>` : ""}${a.authorRole ? `<p class="text-[12px] text-on-surface-variant">${x(a.authorRole)}</p>` : ""}</div></div>
<div class="flex">${Ji(a.rating)}</div>
</div>${a.text ? `<p class="font-body-md text-on-surface-variant italic leading-relaxed">"${x(a.text)}"</p>` : ""}${a.dateLabel ? `<p class="text-[12px] text-on-surface-variant mt-stack-sm">${x(a.dateLabel)}</p>` : ""}</article>`).join("");
  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${t}<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md md:gap-stack-lg">${n}</div></section>`
  };
}
const yt = /<div\s+([^>]*data-cms-block="storefront\/([\w-]+)"[^>]*)>\s*<\/div>/g;
function Ki(r, e) {
  const t = r.match(
    new RegExp(`${e}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`)
  );
  return t ? t[1] ?? t[2] ?? t[3] ?? "" : "";
}
function Gi(r) {
  const e = [];
  yt.lastIndex = 0;
  let t;
  for (; (t = yt.exec(r)) !== null; )
    e.push({
      match: t[0],
      blockId: t[2],
      attrsRaw: Ki(t[1], "data-attrs"),
      index: t.index
    });
  return e;
}
function Yi(r) {
  switch (r.blockId) {
    case "hero-overlay": {
      const e = re(r.attrsRaw, {});
      return En(e).html;
    }
    case "categories-bento": {
      const e = re(r.attrsRaw, {});
      return In(e).html;
    }
    case "journal-feature": {
      const e = re(r.attrsRaw, {});
      return Mn(e).html;
    }
    case "newsletter": {
      const e = re(r.attrsRaw, {});
      return _i(e).html;
    }
    case "product-info":
      return r.match;
    case "product-gallery": {
      const e = re(r.attrsRaw, {
        images: [],
        primaryFeatured: !0
      });
      return Vi(e).html;
    }
    case "product-features": {
      const e = re(r.attrsRaw, { features: [] });
      return qi(e).html;
    }
    case "reviews-list": {
      const e = re(r.attrsRaw, {
        eyebrow: "",
        title: "",
        writeReviewLabel: "",
        writeReviewHref: "",
        reviews: []
      });
      return Wi(e).html;
    }
    default:
      return "";
  }
}
function Xi(r, e) {
  if (!r.includes('data-cms-block="storefront/')) return r;
  const t = Gi(r);
  if (t.length === 0) return r;
  const n = /* @__PURE__ */ new Map();
  for (const s of t)
    n.set(s.index, Yi(s));
  let a = "", o = 0;
  yt.lastIndex = 0;
  let i;
  for (; (i = yt.exec(r)) !== null; )
    a += r.slice(o, i.index), a += n.get(i.index) ?? "", o = i.index + i[0].length;
  return a += r.slice(o), a;
}
function H(r) {
  this.content = r;
}
H.prototype = {
  constructor: H,
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
    return a == -1 ? o.push(t || r, e) : (o[a + 1] = e, t && (o[a] = t)), new H(o);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(r) {
    var e = this.find(r);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new H(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(r, e) {
    return new H([r, e].concat(this.remove(r).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(r, e) {
    var t = this.remove(r).content.slice();
    return t.push(r, e), new H(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(r, e, t) {
    var n = this.remove(e), a = n.content.slice(), o = n.find(r);
    return a.splice(o == -1 ? a.length : o, 0, e, t), new H(a);
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
    return r = H.from(r), r.size ? new H(r.content.concat(this.subtract(r).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(r) {
    return r = H.from(r), r.size ? new H(this.subtract(r).content.concat(r.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(r) {
    var e = this;
    r = H.from(r);
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
H.from = function(r) {
  if (r instanceof H) return r;
  var e = [];
  if (r) for (var t in r) e.push(t, r[t]);
  return new H(e);
};
function _n(r, e, t) {
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
      let i = _n(a.content, o.content, t + 1);
      if (i != null)
        return i;
    }
    t += a.nodeSize;
  }
}
function Vn(r, e, t, n) {
  for (let a = r.childCount, o = e.childCount; ; ) {
    if (a == 0 || o == 0)
      return a == o ? null : { a: t, b: n };
    let i = r.child(--a), s = e.child(--o), l = i.nodeSize;
    if (i == s) {
      t -= l, n -= l;
      continue;
    }
    if (!i.sameMarkup(s))
      return { a: t, b: n };
    if (i.isText && i.text != s.text) {
      let d = 0, u = Math.min(i.text.length, s.text.length);
      for (; d < u && i.text[i.text.length - d - 1] == s.text[s.text.length - d - 1]; )
        d++, t--, n--;
      return { a: t, b: n };
    }
    if (i.content.size || s.content.size) {
      let d = Vn(i.content, s.content, t - 1, n - 1);
      if (d)
        return d;
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
  nodesBetween(e, t, n, a = 0, o) {
    for (let i = 0, s = 0; s < t; i++) {
      let l = this.content[i], d = s + l.nodeSize;
      if (d > e && n(l, a + s, o || null, i) !== !1 && l.content.size) {
        let u = s + 1;
        l.nodesBetween(Math.max(0, e - u), Math.min(l.content.size, t - u), n, a + u);
      }
      s = d;
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
    return this.nodesBetween(e, t, (s, l) => {
      let d = s.isText ? s.text.slice(Math.max(e, l) - l, t - l) : s.isLeaf ? a ? typeof a == "function" ? a(s) : a : s.type.spec.leafText ? s.type.spec.leafText(s) : "" : "";
      s.isBlock && (s.isLeaf && d || s.isTextblock) && n && (i ? i = !1 : o += n), o += d;
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
        let s = this.content[o], l = i + s.nodeSize;
        l > e && ((i < e || l > t) && (s.isText ? s = s.cut(Math.max(0, e - i), Math.min(s.text.length, t - i)) : s = s.cut(Math.max(0, e - i - 1), Math.min(s.content.size, t - i - 1))), n.push(s), a += s.nodeSize), i = l;
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
    return _n(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, n = e.size) {
    return Vn(this, e, t, n);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return lt(0, e);
    if (e == this.size)
      return lt(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, n = 0; ; t++) {
      let a = this.child(t), o = n + a.nodeSize;
      if (o >= e)
        return o == e ? lt(t + 1, o) : lt(t, n);
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
const Ft = { index: 0, offset: 0 };
function lt(r, e) {
  return Ft.index = r, Ft.offset = e, Ft;
}
function vt(r, e) {
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
      if (!vt(r[n], e[n]))
        return !1;
  } else {
    for (let n in r)
      if (!(n in e) || !vt(r[n], e[n]))
        return !1;
    for (let n in e)
      if (!(n in r))
        return !1;
  }
  return !0;
}
class M {
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
    return this == e || this.type == e.type && vt(this.attrs, e.attrs);
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
      return M.none;
    if (e instanceof M)
      return [e];
    let t = e.slice();
    return t.sort((n, a) => n.type.rank - a.type.rank), t;
  }
}
M.none = [];
class wt extends Error {
}
class k {
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
    let n = Jn(this.content, e + this.openStart, t);
    return n && new k(n, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new k(qn(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return k.empty;
    let n = t.openStart || 0, a = t.openEnd || 0;
    if (typeof n != "number" || typeof a != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new k(w.fromJSON(e, t.content), n, a);
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
    return new k(e, n, a);
  }
}
k.empty = new k(w.empty, 0, 0);
function qn(r, e, t) {
  let { index: n, offset: a } = r.findIndex(e), o = r.maybeChild(n), { index: i, offset: s } = r.findIndex(t);
  if (a == e || o.isText) {
    if (s != t && !r.child(i).isText)
      throw new RangeError("Removing non-flat range");
    return r.cut(0, e).append(r.cut(t));
  }
  if (n != i)
    throw new RangeError("Removing non-flat range");
  return r.replaceChild(n, o.copy(qn(o.content, e - a - 1, t - a - 1)));
}
function Jn(r, e, t, n) {
  let { index: a, offset: o } = r.findIndex(e), i = r.maybeChild(a);
  if (o == e || i.isText)
    return n && !n.canReplace(a, a, t) ? null : r.cut(0, e).append(t).append(r.cut(e));
  let s = Jn(i.content, e - o - 1, t, i);
  return s && r.replaceChild(a, i.copy(s));
}
function Zi(r, e, t) {
  if (t.openStart > r.depth)
    throw new wt("Inserted content deeper than insertion position");
  if (r.depth - t.openStart != e.depth - t.openEnd)
    throw new wt("Inconsistent open depths");
  return Wn(r, e, t, 0);
}
function Wn(r, e, t, n) {
  let a = r.index(n), o = r.node(n);
  if (a == e.index(n) && n < r.depth - t.openStart) {
    let i = Wn(r, e, t, n + 1);
    return o.copy(o.content.replaceChild(a, i));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && r.depth == n && e.depth == n) {
      let i = r.parent, s = i.content;
      return xe(i, s.cut(0, r.parentOffset).append(t.content).append(s.cut(e.parentOffset)));
    } else {
      let { start: i, end: s } = Qi(t, r);
      return xe(o, Gn(r, i, s, e, n));
    }
  else return xe(o, xt(r, e, n));
}
function Kn(r, e) {
  if (!e.type.compatibleContent(r.type))
    throw new wt("Cannot join " + e.type.name + " onto " + r.type.name);
}
function Gt(r, e, t) {
  let n = r.node(t);
  return Kn(n, e.node(t)), n;
}
function we(r, e) {
  let t = e.length - 1;
  t >= 0 && r.isText && r.sameMarkup(e[t]) ? e[t] = r.withText(e[t].text + r.text) : e.push(r);
}
function Ve(r, e, t, n) {
  let a = (e || r).node(t), o = 0, i = e ? e.index(t) : a.childCount;
  r && (o = r.index(t), r.depth > t ? o++ : r.textOffset && (we(r.nodeAfter, n), o++));
  for (let s = o; s < i; s++)
    we(a.child(s), n);
  e && e.depth == t && e.textOffset && we(e.nodeBefore, n);
}
function xe(r, e) {
  return r.type.checkContent(e), r.copy(e);
}
function Gn(r, e, t, n, a) {
  let o = r.depth > a && Gt(r, e, a + 1), i = n.depth > a && Gt(t, n, a + 1), s = [];
  return Ve(null, r, a, s), o && i && e.index(a) == t.index(a) ? (Kn(o, i), we(xe(o, Gn(r, e, t, n, a + 1)), s)) : (o && we(xe(o, xt(r, e, a + 1)), s), Ve(e, t, a, s), i && we(xe(i, xt(t, n, a + 1)), s)), Ve(n, null, a, s), new w(s);
}
function xt(r, e, t) {
  let n = [];
  if (Ve(null, r, t, n), r.depth > t) {
    let a = Gt(r, e, t + 1);
    we(xe(a, xt(r, e, t + 1)), n);
  }
  return Ve(e, null, t, n), new w(n);
}
function Qi(r, e) {
  let t = e.depth - r.openStart, a = e.node(t).copy(r.content);
  for (let o = t - 1; o >= 0; o--)
    a = e.node(o).copy(w.from(a));
  return {
    start: a.resolveNoCache(r.openStart + t),
    end: a.resolveNoCache(a.content.size - r.openEnd - t)
  };
}
class tt {
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
      return M.none;
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
        return new kt(this, e, n);
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
      let { index: s, offset: l } = i.content.findIndex(o), d = o - l;
      if (n.push(i, s, a + l), !d || (i = i.child(s), i.isText))
        break;
      o = d - 1, a += l + 1;
    }
    return new tt(t, n, o);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let n = Dr.get(e);
    if (n)
      for (let o = 0; o < n.elts.length; o++) {
        let i = n.elts[o];
        if (i.pos == t)
          return i;
      }
    else
      Dr.set(e, n = new es());
    let a = n.elts[n.i] = tt.resolve(e, t);
    return n.i = (n.i + 1) % ts, a;
  }
}
class es {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const ts = 12, Dr = /* @__PURE__ */ new WeakMap();
class kt {
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
const rs = /* @__PURE__ */ Object.create(null);
let ke = class Yt {
  /**
  @internal
  */
  constructor(e, t, n, a = M.none) {
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
    return this.type == e && vt(this.attrs, t || e.defaultAttrs || rs) && M.sameSet(this.marks, n || M.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Yt(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Yt(this.type, this.attrs, this.content, e);
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
      return k.empty;
    let a = this.resolve(e), o = this.resolve(t), i = n ? 0 : a.sharedDepth(t), s = a.start(i), d = a.node(i).content.cut(a.pos - s, o.pos - s);
    return new k(d, a.depth - i, o.depth - i);
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
    return Zi(this.resolve(e), this.resolve(t), n);
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
    return tt.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return tt.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Yn(this.marks, e);
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
    for (let l = a; l < o; l++)
      if (!this.type.allowsMarks(n.child(l).marks))
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
    let e = M.none;
    for (let t = 0; t < this.marks.length; t++) {
      let n = this.marks[t];
      n.type.checkAttrs(n.attrs), e = n.addToSet(e);
    }
    if (!M.sameSet(e, this.marks))
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
ke.prototype.text = void 0;
class Ct extends ke {
  /**
  @internal
  */
  constructor(e, t, n, a) {
    if (super(e, t, null, a), !n)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = n;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Yn(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new Ct(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Ct(this.type, this.attrs, e, this.marks);
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
function Yn(r, e) {
  for (let t = r.length - 1; t >= 0; t--)
    e = r[t].type.name + "(" + e + ")";
  return e;
}
class Ne {
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
    let n = new ns(e, t);
    if (n.next == null)
      return Ne.empty;
    let a = Xn(n);
    n.next && n.err("Unexpected trailing text");
    let o = us(ds(a));
    return ps(o, n), o;
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
      let l = i.matchFragment(e, n);
      if (l && (!t || l.validEnd))
        return w.from(s.map((d) => d.createAndFill()));
      for (let d = 0; d < i.next.length; d++) {
        let { type: u, next: p } = i.next[d];
        if (!(u.isText || u.hasRequiredAttrs()) && a.indexOf(p) == -1) {
          a.push(p);
          let h = o(p, s.concat(u));
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
      let a = n.shift(), o = a.match;
      if (o.matchType(e)) {
        let i = [];
        for (let s = a; s.type; s = s.via)
          i.push(s.type);
        return i.reverse();
      }
      for (let i = 0; i < o.next.length; i++) {
        let { type: s, next: l } = o.next[i];
        !s.isLeaf && !s.hasRequiredAttrs() && !(s.name in t) && (!a.type || l.validEnd) && (n.push({ match: s.contentMatch, type: s, via: a }), t[s.name] = !0);
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
Ne.empty = new Ne(!0);
class ns {
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
function Xn(r) {
  let e = [];
  do
    e.push(as(r));
  while (r.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function as(r) {
  let e = [];
  do
    e.push(is(r));
  while (r.next && r.next != ")" && r.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function is(r) {
  let e = cs(r);
  for (; ; )
    if (r.eat("+"))
      e = { type: "plus", expr: e };
    else if (r.eat("*"))
      e = { type: "star", expr: e };
    else if (r.eat("?"))
      e = { type: "opt", expr: e };
    else if (r.eat("{"))
      e = ss(r, e);
    else
      break;
  return e;
}
function Ur(r) {
  /\D/.test(r.next) && r.err("Expected number, got '" + r.next + "'");
  let e = Number(r.next);
  return r.pos++, e;
}
function ss(r, e) {
  let t = Ur(r), n = t;
  return r.eat(",") && (r.next != "}" ? n = Ur(r) : n = -1), r.eat("}") || r.err("Unclosed braced range"), { type: "range", min: t, max: n, expr: e };
}
function ls(r, e) {
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
function cs(r) {
  if (r.eat("(")) {
    let e = Xn(r);
    return r.eat(")") || r.err("Missing closing paren"), e;
  } else if (/\W/.test(r.next))
    r.err("Unexpected token '" + r.next + "'");
  else {
    let e = ls(r, r.next).map((t) => (r.inline == null ? r.inline = t.isInline : r.inline != t.isInline && r.err("Mixing inline and block content"), { type: "name", value: t }));
    return r.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function ds(r) {
  let e = [[]];
  return a(o(r, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function n(i, s, l) {
    let d = { term: l, to: s };
    return e[i].push(d), d;
  }
  function a(i, s) {
    i.forEach((l) => l.to = s);
  }
  function o(i, s) {
    if (i.type == "choice")
      return i.exprs.reduce((l, d) => l.concat(o(d, s)), []);
    if (i.type == "seq")
      for (let l = 0; ; l++) {
        let d = o(i.exprs[l], s);
        if (l == i.exprs.length - 1)
          return d;
        a(d, s = t());
      }
    else if (i.type == "star") {
      let l = t();
      return n(s, l), a(o(i.expr, l), l), [n(l)];
    } else if (i.type == "plus") {
      let l = t();
      return a(o(i.expr, s), l), a(o(i.expr, l), l), [n(l)];
    } else {
      if (i.type == "opt")
        return [n(s)].concat(o(i.expr, s));
      if (i.type == "range") {
        let l = s;
        for (let d = 0; d < i.min; d++) {
          let u = t();
          a(o(i.expr, l), u), l = u;
        }
        if (i.max == -1)
          a(o(i.expr, l), l);
        else
          for (let d = i.min; d < i.max; d++) {
            let u = t();
            n(l, u), a(o(i.expr, l), u), l = u;
          }
        return [n(l)];
      } else {
        if (i.type == "name")
          return [n(s, void 0, i.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function Zn(r, e) {
  return e - r;
}
function _r(r, e) {
  let t = [];
  return n(e), t.sort(Zn);
  function n(a) {
    let o = r[a];
    if (o.length == 1 && !o[0].term)
      return n(o[0].to);
    t.push(a);
    for (let i = 0; i < o.length; i++) {
      let { term: s, to: l } = o[i];
      !s && t.indexOf(l) == -1 && n(l);
    }
  }
}
function us(r) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(_r(r, 0));
  function t(n) {
    let a = [];
    n.forEach((i) => {
      r[i].forEach(({ term: s, to: l }) => {
        if (!s)
          return;
        let d;
        for (let u = 0; u < a.length; u++)
          a[u][0] == s && (d = a[u][1]);
        _r(r, l).forEach((u) => {
          d || a.push([s, d = []]), d.indexOf(u) == -1 && d.push(u);
        });
      });
    });
    let o = e[n.join(",")] = new Ne(n.indexOf(r.length - 1) > -1);
    for (let i = 0; i < a.length; i++) {
      let s = a[i][1].sort(Zn);
      o.next.push({ type: a[i][0], next: e[s.join(",")] || t(s) });
    }
    return o;
  }
}
function ps(r, e) {
  for (let t = 0, n = [r]; t < n.length; t++) {
    let a = n[t], o = !a.validEnd, i = [];
    for (let s = 0; s < a.next.length; s++) {
      let { type: l, next: d } = a.next[s];
      i.push(l.name), o && !(l.isText || l.hasRequiredAttrs()) && (o = !1), n.indexOf(d) == -1 && n.push(d);
    }
    o && e.err("Only non-generatable nodes (" + i.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Qn(r) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in r) {
    let n = r[t];
    if (!n.hasDefault)
      return null;
    e[t] = n.default;
  }
  return e;
}
function ea(r, e) {
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
function ta(r, e, t, n) {
  for (let a in e)
    if (!(a in r))
      throw new RangeError(`Unsupported attribute ${a} for ${t} of type ${a}`);
  for (let a in r) {
    let o = r[a];
    o.validate && o.validate(e[a]);
  }
}
function ra(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let n in e)
      t[n] = new hs(r, n, e[n]);
  return t;
}
class Nt {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = ra(e, n.attrs), this.defaultAttrs = Qn(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == Ne.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : ea(this.attrs, e);
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
    return new ke(this, this.computeAttrs(e), w.from(t), M.setFrom(n));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, n) {
    return t = w.from(t), this.checkContent(t), new ke(this, this.computeAttrs(e), t, M.setFrom(n));
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
    return o ? new ke(this, e, t.append(o), M.setFrom(n)) : null;
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
    ta(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : M.none : e;
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
function fs(r, e, t) {
  let n = t.split("|");
  return (a) => {
    let o = a === null ? "null" : typeof a;
    if (n.indexOf(o) < 0)
      throw new RangeError(`Expected value of type ${n} for attribute ${e} on type ${r}, got ${o}`);
  };
}
class hs {
  constructor(e, t, n) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? fs(e, t, n.validate) : n.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class ar {
  /**
  @internal
  */
  constructor(e, t, n, a) {
    this.name = e, this.rank = t, this.schema = n, this.spec = a, this.attrs = ra(e, a.attrs), this.excluded = null;
    let o = Qn(this.attrs);
    this.instance = o ? new M(this, o) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new M(this, ea(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null), a = 0;
    return e.forEach((o, i) => n[o] = new ar(o, a++, t, i)), n;
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
    ta(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class ms {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let a in e)
      t[a] = e[a];
    t.nodes = H.from(e.nodes), t.marks = H.from(e.marks || {}), this.nodes = Nt.compile(this.spec.nodes, this), this.marks = ar.compile(this.spec.marks, this);
    let n = /* @__PURE__ */ Object.create(null);
    for (let a in this.nodes) {
      if (a in this.marks)
        throw new RangeError(a + " can not be both a node and a mark");
      let o = this.nodes[a], i = o.spec.content || "", s = o.spec.marks;
      if (o.contentMatch = n[i] || (n[i] = Ne.parse(i, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = o;
      }
      o.markSet = s == "_" ? null : s ? Vr(this, s.split(" ")) : s == "" || !o.inlineContent ? [] : null;
    }
    for (let a in this.marks) {
      let o = this.marks[a], i = o.spec.excludes;
      o.excluded = i == null ? [o] : i == "" ? [] : Vr(this, i.split(" "));
    }
    this.nodeFromJSON = (a) => ke.fromJSON(this, a), this.markFromJSON = (a) => M.fromJSON(this, a), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    return new Ct(n, n.defaultAttrs, e, M.setFrom(t));
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
function Vr(r, e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let a = e[n], o = r.marks[a], i = o;
    if (o)
      t.push(o);
    else
      for (let s in r.marks) {
        let l = r.marks[s];
        (a == "_" || l.spec.group && l.spec.group.split(" ").indexOf(a) > -1) && t.push(i = l);
      }
    if (!i)
      throw new SyntaxError("Unknown mark type: '" + e[n] + "'");
  }
  return t;
}
function gs(r) {
  return r.tag != null;
}
function bs(r) {
  return r.style != null;
}
class Oe {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let n = this.matchedStyles = [];
    t.forEach((a) => {
      if (gs(a))
        this.tags.push(a);
      else if (bs(a)) {
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
    let n = new Jr(this, t, !1);
    return n.addAll(e, M.none, t.from, t.to), n.finish();
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
    let n = new Jr(this, t, !0);
    return n.addAll(e, M.none, t.from, t.to), k.maxOpen(n.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, n) {
    for (let a = n ? this.tags.indexOf(n) + 1 : 0; a < this.tags.length; a++) {
      let o = this.tags[a];
      if (ws(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
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
          let l = i.getAttrs(t);
          if (l === !1)
            continue;
          i.attrs = l || void 0;
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
        n(i = Wr(i)), i.mark || i.ignore || i.clearMark || (i.mark = a);
      });
    }
    for (let a in e.nodes) {
      let o = e.nodes[a].spec.parseDOM;
      o && o.forEach((i) => {
        n(i = Wr(i)), i.node || i.ignore || i.mark || (i.node = a);
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
    return e.cached.domParser || (e.cached.domParser = new Oe(e, Oe.schemaRules(e)));
  }
}
const na = {
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
}, ys = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, aa = { ol: !0, ul: !0 }, rt = 1, Xt = 2, qe = 4;
function qr(r, e, t) {
  return e != null ? (e ? rt : 0) | (e === "full" ? Xt : 0) : r && r.whitespace == "pre" ? rt | Xt : t & ~qe;
}
class ct {
  constructor(e, t, n, a, o, i) {
    this.type = e, this.attrs = t, this.marks = n, this.solid = a, this.options = i, this.content = [], this.activeMarks = M.none, this.match = o || (i & qe ? null : e.contentMatch);
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
    if (!(this.options & rt)) {
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
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !na.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Jr {
  constructor(e, t, n) {
    this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
    let a = t.topNode, o, i = qr(null, t.preserveWhitespace, 0) | (n ? qe : 0);
    a ? o = new ct(a.type, a.attrs, M.none, !0, t.topMatch || a.type.contentMatch, i) : n ? o = new ct(null, null, M.none, !0, null, i) : o = new ct(e.schema.topNodeType, null, M.none, !0, null, i), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
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
    let n = e.nodeValue, a = this.top, o = a.options & Xt ? "full" : this.localPreserveWS || (a.options & rt) > 0, { schema: i } = this.parser;
    if (o === "full" || a.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (o)
        if (o === "full")
          n = n.replace(/\r\n?/g, `
`);
        else if (i.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(i.linebreakReplacement.create())) {
          let s = n.split(/\r?\n|\r/);
          for (let l = 0; l < s.length; l++)
            l && this.insertNode(i.linebreakReplacement.create(), t, !0), s[l] && this.insertNode(i.text(s[l]), t, !/\S/.test(s[l]));
          n = "";
        } else
          n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let s = a.content[a.content.length - 1], l = e.previousSibling;
        (!s || l && l.nodeName == "BR" || s.isText && /[ \t\r\n\u000c]$/.test(s.text)) && (n = n.slice(1));
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
    aa.hasOwnProperty(i) && this.parser.normalizeLists && vs(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, n));
    e: if (l ? l.ignore : ys.hasOwnProperty(i))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let d, u = this.needsBlock;
      if (na.hasOwnProperty(i))
        o.content.length && o.content[0].isInline && this.open && (this.open--, o = this.top), d = !0, o.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let p = l && l.skip ? t : this.readStyles(e, t);
      p && this.addAll(e, p), d && this.sync(o), this.needsBlock = u;
    } else {
      let d = this.readStyles(e, t);
      d && this.addElementByRule(e, l, d, l.consuming === !1 ? s : void 0);
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
            let l = this.parser.matchStyle(o, i, this, s);
            if (!l)
              break;
            if (l.ignore)
              return null;
            if (l.clearMark ? t = t.filter((d) => !l.clearMark(d)) : t = t.concat(this.parser.schema.marks[l.mark].create(l.attrs)), l.consuming === !1)
              s = l;
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
        let l = this.enter(i, t.attrs || null, n, t.preserveWhitespace);
        l && (o = !0, n = l);
      }
    else {
      let l = this.parser.schema.marks[t.mark];
      n = n.concat(l.create(t.attrs));
    }
    let s = this.top;
    if (i && i.isLeaf)
      this.findInside(e);
    else if (a)
      this.addElement(e, n, a);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l, n, !1));
    else {
      let l = e;
      typeof t.contentElement == "string" ? l = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? l = t.contentElement(e) : t.contentElement && (l = t.contentElement), this.findAround(e, l, !0), this.addAll(l, n), this.findAround(e, l, !1);
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
      let l = this.nodes[i], d = l.findWrapping(e);
      if (d && (!a || a.length > d.length + s) && (a = d, o = l, !d.length))
        break;
      if (l.solid) {
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
      let i = M.none;
      for (let s of a.concat(e.marks))
        (o.type ? o.type.allowsMarkType(s.type) : Kr(s.type, e.type)) && (i = s.addToSet(i));
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
    let s = qr(e, o, i.options);
    i.options & qe && i.content.length == 0 && (s |= qe);
    let l = M.none;
    return n = n.filter((d) => (i.type ? i.type.allowsMarkType(d.type) : Kr(d.type, e)) ? (l = d.addToSet(l), !1) : !0), this.nodes.push(new ct(e, t, l, a, null, s)), this.open++, n;
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
      this.localPreserveWS && (this.nodes[t].options |= rt);
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
    let t = e.split("/"), n = this.options.context, a = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), o = -(n ? n.depth + 1 : 0) + (a ? 0 : 1), i = (s, l) => {
      for (; s >= 0; s--) {
        let d = t[s];
        if (d == "") {
          if (s == t.length - 1 || s == 0)
            continue;
          for (; l >= o; l--)
            if (i(s - 1, l))
              return !0;
          return !1;
        } else {
          let u = l > 0 || l == 0 && a ? this.nodes[l].type : n && l >= o ? n.node(l - o).type : null;
          if (!u || u.name != d && !u.isInGroup(d))
            return !1;
          l--;
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
function vs(r) {
  for (let e = r.firstChild, t = null; e; e = e.nextSibling) {
    let n = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    n && aa.hasOwnProperty(n) && t ? (t.appendChild(e), e = t) : n == "li" ? t = e : n && (t = null);
  }
}
function ws(r, e) {
  return (r.matches || r.msMatchesSelector || r.webkitMatchesSelector || r.mozMatchesSelector).call(r, e);
}
function Wr(r) {
  let e = {};
  for (let t in r)
    e[t] = r[t];
  return e;
}
function Kr(r, e) {
  let t = e.schema.nodes;
  for (let n in t) {
    let a = t[n];
    if (!a.allowsMarkType(r))
      continue;
    let o = [], i = (s) => {
      o.push(s);
      for (let l = 0; l < s.edgeCount; l++) {
        let { type: d, next: u } = s.edge(l);
        if (d == e || o.indexOf(u) < 0 && i(u))
          return !0;
      }
    };
    if (i(a.contentMatch))
      return !0;
  }
}
const oa = 65535, ia = Math.pow(2, 16);
function xs(r, e) {
  return r + e * ia;
}
function Gr(r) {
  return r & oa;
}
function ks(r) {
  return (r - (r & oa)) / ia;
}
const sa = 1, la = 2, ft = 4, ca = 8;
class Yr {
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
    return (this.delInfo & ca) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (sa | ft)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (la | ft)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & ft) > 0;
  }
}
class G {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && G.empty)
      return G.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, n = Gr(e);
    if (!this.inverted)
      for (let a = 0; a < n; a++)
        t += this.ranges[a * 3 + 2] - this.ranges[a * 3 + 1];
    return this.ranges[n * 3] + t + ks(e);
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
      let l = this.ranges[s] - (this.inverted ? a : 0);
      if (l > e)
        break;
      let d = this.ranges[s + o], u = this.ranges[s + i], p = l + d;
      if (e <= p) {
        let h = d ? e == l ? -1 : e == p ? 1 : t : t, m = l + a + (h < 0 ? 0 : u);
        if (n)
          return m;
        let v = e == (t < 0 ? l : p) ? null : xs(s / 3, e - l), g = e == l ? la : e == p ? sa : ft;
        return (t < 0 ? e != l : e != p) && (g |= ca), new Yr(m, g, v);
      }
      a += u - d;
    }
    return n ? e + a : new Yr(e + a, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let n = 0, a = Gr(t), o = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let l = this.ranges[s] - (this.inverted ? n : 0);
      if (l > e)
        break;
      let d = this.ranges[s + o], u = l + d;
      if (e <= u && s == a * 3)
        return !0;
      n += this.ranges[s + i] - d;
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
      let i = this.ranges[a], s = i - (this.inverted ? o : 0), l = i + (this.inverted ? 0 : o), d = this.ranges[a + t], u = this.ranges[a + n];
      e(s, s + d, l, l + u), o += u - d;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new G(this.ranges, !this.inverted);
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
    return e == 0 ? G.empty : new G(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
G.empty = new G([]);
const $t = /* @__PURE__ */ Object.create(null);
class q {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return G.empty;
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
    let n = $t[t.stepType];
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
    if (e in $t)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return $t[e] = t, t.prototype.jsonID = e, t;
  }
}
class F {
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
    return new F(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new F(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, n, a) {
    try {
      return F.ok(e.replace(t, n, a));
    } catch (o) {
      if (o instanceof wt)
        return F.fail(o.message);
      throw o;
    }
  }
}
function or(r, e, t) {
  let n = [];
  for (let a = 0; a < r.childCount; a++) {
    let o = r.child(a);
    o.content.size && (o = o.copy(or(o.content, e, o))), o.isInline && (o = e(o, t, a)), n.push(o);
  }
  return w.fromArray(n);
}
class ge extends q {
  /**
  Create a mark step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = e.resolve(this.from), a = n.node(n.sharedDepth(this.to)), o = new k(or(t.content, (i, s) => !i.isAtom || !s.type.allowsMarkType(this.mark.type) ? i : i.mark(this.mark.addToSet(i.marks)), a), t.openStart, t.openEnd);
    return F.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new be(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new ge(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof ge && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ge(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new ge(t.from, t.to, e.markFromJSON(t.mark));
  }
}
q.jsonID("addMark", ge);
class be extends q {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = new k(or(t.content, (a) => a.mark(this.mark.removeFromSet(a.marks)), e), t.openStart, t.openEnd);
    return F.fromReplace(e, this.from, this.to, n);
  }
  invert() {
    return new ge(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new be(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof be && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new be(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new be(t.from, t.to, e.markFromJSON(t.mark));
  }
}
q.jsonID("removeMark", be);
class ye extends q {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return F.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return F.fromReplace(e, this.pos, this.pos + 1, new k(w.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let n = this.mark.addToSet(t.marks);
      if (n.length == t.marks.length) {
        for (let a = 0; a < t.marks.length; a++)
          if (!t.marks[a].isInSet(n))
            return new ye(this.pos, t.marks[a]);
        return new ye(this.pos, this.mark);
      }
    }
    return new nt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new ye(t.pos, this.mark);
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
    return new ye(t.pos, e.markFromJSON(t.mark));
  }
}
q.jsonID("addNodeMark", ye);
class nt extends q {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return F.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return F.fromReplace(e, this.pos, this.pos + 1, new k(w.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new ye(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new nt(t.pos, this.mark);
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
    return new nt(t.pos, e.markFromJSON(t.mark));
  }
}
q.jsonID("removeNodeMark", nt);
class J extends q {
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
    return this.structure && Zt(e, this.from, this.to) ? F.fail("Structure replace would overwrite content") : F.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new G([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new J(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), n = this.from == this.to && J.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return n.deletedAcross && t.deletedAcross ? null : new J(n.pos, Math.max(n.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof J) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? k.empty : new k(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new J(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? k.empty : new k(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new J(e.from, this.to, t, this.structure);
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
    return new J(t.from, t.to, k.fromJSON(e, t.slice), !!t.structure);
  }
}
J.MAP_BIAS = 1;
q.jsonID("replace", J);
class K extends q {
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
    if (this.structure && (Zt(e, this.from, this.gapFrom) || Zt(e, this.gapTo, this.to)))
      return F.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return F.fail("Gap is not a flat range");
    let n = this.slice.insertAt(this.insert, t.content);
    return n ? F.fromReplace(e, this.from, this.to, n) : F.fail("Content does not fit in gap");
  }
  getMap() {
    return new G([
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
    return new K(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1), a = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), o = this.to == this.gapTo ? n.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && n.deletedAcross || a < t.pos || o > n.pos ? null : new K(t.pos, n.pos, a, o, this.slice, this.insert, this.structure);
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
    return new K(t.from, t.to, t.gapFrom, t.gapTo, k.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
q.jsonID("replaceAround", K);
function Zt(r, e, t) {
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
function Cs(r, e, t) {
  return (e == 0 || r.canReplace(e, r.childCount)) && (t == r.childCount || r.canReplace(0, t));
}
function He(r) {
  let t = r.parent.content.cutByIndex(r.startIndex, r.endIndex);
  for (let n = r.depth, a = 0, o = 0; ; --n) {
    let i = r.$from.node(n), s = r.$from.index(n) + a, l = r.$to.indexAfter(n) - o;
    if (n < r.depth && i.canReplace(s, l, t))
      return n;
    if (n == 0 || i.type.spec.isolating || !Cs(i, s, l))
      break;
    s && (a = 1), l < i.childCount && (o = 1);
  }
  return null;
}
function da(r, e, t = null, n = r) {
  let a = Ns(r, e), o = a && Ss(n, e);
  return o ? a.map(Xr).concat({ type: e, attrs: t }).concat(o.map(Xr)) : null;
}
function Xr(r) {
  return { type: r, attrs: null };
}
function Ns(r, e) {
  let { parent: t, startIndex: n, endIndex: a } = r, o = t.contentMatchAt(n).findWrapping(e);
  if (!o)
    return null;
  let i = o.length ? o[0] : e;
  return t.canReplaceWith(n, a, i) ? o : null;
}
function Ss(r, e) {
  let { parent: t, startIndex: n, endIndex: a } = r, o = t.child(n), i = e.contentMatch.findWrapping(o.type);
  if (!i)
    return null;
  let l = (i.length ? i[i.length - 1] : e).contentMatch;
  for (let d = n; l && d < a; d++)
    l = l.matchType(t.child(d).type);
  return !l || !l.validEnd ? null : i;
}
function ae(r, e, t = 1, n) {
  let a = r.resolve(e), o = a.depth - t, i = n && n[n.length - 1] || a.parent;
  if (o < 0 || a.parent.type.spec.isolating || !a.parent.canReplace(a.index(), a.parent.childCount) || !i.type.validContent(a.parent.content.cutByIndex(a.index(), a.parent.childCount)))
    return !1;
  for (let d = a.depth - 1, u = t - 2; d > o; d--, u--) {
    let p = a.node(d), h = a.index(d);
    if (p.type.spec.isolating)
      return !1;
    let m = p.content.cutByIndex(h, p.childCount), v = n && n[u + 1];
    v && (m = m.replaceChild(0, v.type.create(v.attrs)));
    let g = n && n[u] || p;
    if (!p.canReplace(h + 1, p.childCount) || !g.type.validContent(m))
      return !1;
  }
  let s = a.indexAfter(o), l = n && n[0];
  return a.node(o).canReplaceWith(s, s, l ? l.type : a.node(o + 1).type);
}
function Te(r, e) {
  let t = r.resolve(e), n = t.index();
  return ua(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(n, n + 1);
}
function As(r, e) {
  e.content.size || r.type.compatibleContent(e.type);
  let t = r.contentMatchAt(r.childCount), { linebreakReplacement: n } = r.type.schema;
  for (let a = 0; a < e.childCount; a++) {
    let o = e.child(a), i = o.type == n ? r.type.schema.nodes.text : o.type;
    if (t = t.matchType(i), !t || !r.type.allowsMarks(o.marks))
      return !1;
  }
  return t.validEnd;
}
function ua(r, e) {
  return !!(r && e && !r.isLeaf && As(r, e));
}
function Lt(r, e, t = -1) {
  let n = r.resolve(e);
  for (let a = n.depth; ; a--) {
    let o, i, s = n.index(a);
    if (a == n.depth ? (o = n.nodeBefore, i = n.nodeAfter) : t > 0 ? (o = n.node(a + 1), s++, i = n.node(a).maybeChild(s)) : (o = n.node(a).maybeChild(s - 1), i = n.node(a + 1)), o && !o.isTextblock && ua(o, i) && n.node(a).canReplace(s, s + 1))
      return e;
    if (a == 0)
      break;
    e = t < 0 ? n.before(a) : n.after(a);
  }
}
function ir(r, e, t = e, n = k.empty) {
  if (e == t && !n.size)
    return null;
  let a = r.resolve(e), o = r.resolve(t);
  return Ts(a, o, n) ? new J(e, t, n) : new Es(a, o, n).fit();
}
function Ts(r, e, t) {
  return !t.openStart && !t.openEnd && r.start() == e.start() && r.parent.canReplace(r.index(), e.index(), t.content);
}
class Es {
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
      let d = this.findFittable();
      d ? this.placeNodes(d) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, a = this.close(e < 0 ? this.$to : n.doc.resolve(e));
    if (!a)
      return null;
    let o = this.placed, i = n.depth, s = a.depth;
    for (; i && s && o.childCount == 1; )
      o = o.firstChild.content, i--, s--;
    let l = new k(o, i, s);
    return e > -1 ? new K(n.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || n.pos != this.$to.pos ? new J(n.pos, a.pos, l) : null;
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
          let { type: l, match: d } = this.frontier[s], u, p = null;
          if (t == 1 && (i ? d.matchType(i.type) || (p = d.fillBefore(w.from(i), !1)) : o && l.compatibleContent(o.type)))
            return { sliceDepth: n, frontierDepth: s, parent: o, inject: p };
          if (t == 2 && i && (u = d.findWrapping(i.type)))
            return { sliceDepth: n, frontierDepth: s, parent: o, wrap: u };
          if (o && d.matchType(o.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, a = Bt(e, t);
    return !a.childCount || a.firstChild.isLeaf ? !1 : (this.unplaced = new k(e, t + 1, Math.max(n, a.size + t >= e.size - n ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, a = Bt(e, t);
    if (a.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + a.size;
      this.unplaced = new k(De(e, t - 1, 1), t - 1, o ? t - 1 : n);
    } else
      this.unplaced = new k(De(e, t, 1), t, n);
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
    let i = this.unplaced, s = n ? n.content : i.content, l = i.openStart - e, d = 0, u = [], { match: p, type: h } = this.frontier[t];
    if (a) {
      for (let g = 0; g < a.childCount; g++)
        u.push(a.child(g));
      p = p.matchFragment(a);
    }
    let m = s.size + e - (i.content.size - i.openEnd);
    for (; d < s.childCount; ) {
      let g = s.child(d), y = p.matchType(g.type);
      if (!y)
        break;
      d++, (d > 1 || l == 0 || g.content.size) && (p = y, u.push(pa(g.mark(h.allowedMarks(g.marks)), d == 1 ? l : 0, d == s.childCount ? m : -1)));
    }
    let v = d == s.childCount;
    v || (m = -1), this.placed = Ue(this.placed, t, w.from(u)), this.frontier[t].match = p, v && m < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let g = 0, y = s; g < m; g++) {
      let b = y.lastChild;
      this.frontier.push({ type: b.type, match: b.contentMatchAt(b.childCount) }), y = b.content;
    }
    this.unplaced = v ? e == 0 ? k.empty : new k(De(i.content, e - 1, 1), e - 1, m < 0 ? i.openEnd : e - 1) : new k(De(i.content, e, d), i.openStart, i.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !zt(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: n } = this.$to, a = this.$to.after(n);
    for (; n > 1 && a == this.$to.end(--n); )
      ++a;
    return a;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: n, type: a } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), i = zt(e, t, a, n, o);
      if (i) {
        for (let s = t - 1; s >= 0; s--) {
          let { match: l, type: d } = this.frontier[s], u = zt(e, s, d, l, !0);
          if (!u || u.childCount)
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
    t.fit.childCount && (this.placed = Ue(this.placed, t.depth, t.fit)), e = t.move;
    for (let n = t.depth + 1; n <= e.depth; n++) {
      let a = e.node(n), o = a.type.contentMatch.fillBefore(a.content, !0, e.index(n));
      this.openFrontierNode(a.type, a.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, n) {
    let a = this.frontier[this.depth];
    a.match = a.match.matchType(e), this.placed = Ue(this.placed, this.depth, w.from(e.create(t, n))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(w.empty, !0);
    t.childCount && (this.placed = Ue(this.placed, this.frontier.length, t));
  }
}
function De(r, e, t) {
  return e == 0 ? r.cutByIndex(t, r.childCount) : r.replaceChild(0, r.firstChild.copy(De(r.firstChild.content, e - 1, t)));
}
function Ue(r, e, t) {
  return e == 0 ? r.append(t) : r.replaceChild(r.childCount - 1, r.lastChild.copy(Ue(r.lastChild.content, e - 1, t)));
}
function Bt(r, e) {
  for (let t = 0; t < e; t++)
    r = r.firstChild.content;
  return r;
}
function pa(r, e, t) {
  if (e <= 0)
    return r;
  let n = r.content;
  return e > 1 && (n = n.replaceChild(0, pa(n.firstChild, e - 1, n.childCount == 1 ? t - 1 : 0))), e > 0 && (n = r.type.contentMatch.fillBefore(n).append(n), t <= 0 && (n = n.append(r.type.contentMatch.matchFragment(n).fillBefore(w.empty, !0)))), r.copy(n);
}
function zt(r, e, t, n, a) {
  let o = r.node(e), i = a ? r.indexAfter(e) : r.index(e);
  if (i == o.childCount && !t.compatibleContent(o.type))
    return null;
  let s = n.fillBefore(o.content, !0, i);
  return s && !Is(t, o.content, i) ? s : null;
}
function Is(r, e, t) {
  for (let n = t; n < e.childCount; n++)
    if (!r.allowsMarks(e.child(n).marks))
      return !0;
  return !1;
}
class Je extends q {
  /**
  Construct an attribute step.
  */
  constructor(e, t, n) {
    super(), this.pos = e, this.attr = t, this.value = n;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return F.fail("No node at attribute step's position");
    let n = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      n[o] = t.attrs[o];
    n[this.attr] = this.value;
    let a = t.type.create(n, null, t.marks);
    return F.fromReplace(e, this.pos, this.pos + 1, new k(w.from(a), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return G.empty;
  }
  invert(e) {
    return new Je(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Je(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Je(t.pos, t.attr, t.value);
  }
}
q.jsonID("attr", Je);
class St extends q {
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
    return F.ok(n);
  }
  getMap() {
    return G.empty;
  }
  invert(e) {
    return new St(this.attr, e.attrs[this.attr]);
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
    return new St(t.attr, t.value);
  }
}
q.jsonID("docAttr", St);
let at = class extends Error {
};
at = function r(e) {
  let t = Error.call(this, e);
  return t.__proto__ = r.prototype, t;
};
at.prototype = Object.create(Error.prototype);
at.prototype.constructor = at;
at.prototype.name = "TransformError";
const Ht = /* @__PURE__ */ Object.create(null);
class E {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, n) {
    this.$anchor = e, this.$head = t, this.ranges = n || [new Ms(e.min(t), e.max(t))];
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
  replace(e, t = k.empty) {
    let n = t.content.lastChild, a = null;
    for (let s = 0; s < t.openEnd; s++)
      a = n, n = n.lastChild;
    let o = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: l, $to: d } = i[s], u = e.mapping.slice(o);
      e.replaceRange(u.map(l.pos), u.map(d.pos), s ? k.empty : t), s == 0 && en(e, o, (n ? n.isInline : a && a.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let n = e.steps.length, a = this.ranges;
    for (let o = 0; o < a.length; o++) {
      let { $from: i, $to: s } = a[o], l = e.mapping.slice(n), d = l.map(i.pos), u = l.map(s.pos);
      o ? e.deleteRange(d, u) : (e.replaceRangeWith(d, u, t), en(e, n, t.isInline ? -1 : 1));
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
    let a = e.parent.inlineContent ? new O(e) : Me(e.node(0), e.parent, e.pos, e.index(), t, n);
    if (a)
      return a;
    for (let o = e.depth - 1; o >= 0; o--) {
      let i = t < 0 ? Me(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, n) : Me(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, n);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new X(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Me(e, e, 0, 0, 1) || new X(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Me(e, e, e.content.size, e.childCount, -1) || new X(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let n = Ht[t.type];
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
    if (e in Ht)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Ht[e] = t, t.prototype.jsonID = e, t;
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
    return O.between(this.$anchor, this.$head).getBookmark();
  }
}
E.prototype.visible = !0;
class Ms {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Zr = !1;
function Qr(r) {
  !Zr && !r.parent.inlineContent && (Zr = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + r.parent.type.name + ")"));
}
class O extends E {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Qr(e), Qr(t), super(e, t);
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
    return new O(a.parent.inlineContent ? a : n, n);
  }
  replace(e, t = k.empty) {
    if (super.replace(e, t), t == k.empty) {
      let n = this.$from.marksAcross(this.$to);
      n && e.ensureMarks(n);
    }
  }
  eq(e) {
    return e instanceof O && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Rt(this.anchor, this.head);
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
    return new O(e.resolve(t.anchor), e.resolve(t.head));
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
    return e.parent.inlineContent || (a == 0 ? e = t : (e = (E.findFrom(e, -n, !0) || E.findFrom(e, n, !0)).$anchor, e.pos < t.pos != a < 0 && (e = t))), new O(e, t);
  }
}
E.jsonID("text", O);
class Rt {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Rt(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return O.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class I extends E {
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
    return n ? E.near(o) : new I(o);
  }
  content() {
    return new k(w.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof I && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new sr(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new I(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new I(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
I.prototype.visible = !1;
E.jsonID("node", I);
class sr {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: n } = e.mapResult(this.anchor);
    return t ? new Rt(n, n) : new sr(n);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), n = t.nodeAfter;
    return n && I.isSelectable(n) ? new I(t) : E.near(t);
  }
}
class X extends E {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = k.empty) {
    if (t == k.empty) {
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
    return new X(e);
  }
  map(e) {
    return new X(e);
  }
  eq(e) {
    return e instanceof X;
  }
  getBookmark() {
    return Os;
  }
}
E.jsonID("all", X);
const Os = {
  map() {
    return this;
  },
  resolve(r) {
    return new X(r);
  }
};
function Me(r, e, t, n, a, o = !1) {
  if (e.inlineContent)
    return O.create(r, t);
  for (let i = n - (a > 0 ? 0 : 1); a > 0 ? i < e.childCount : i >= 0; i += a) {
    let s = e.child(i);
    if (s.isAtom) {
      if (!o && I.isSelectable(s))
        return I.create(r, t - (a < 0 ? s.nodeSize : 0));
    } else {
      let l = Me(r, s, t + a, a < 0 ? s.childCount : 0, a, o);
      if (l)
        return l;
    }
    t += s.nodeSize * a;
  }
  return null;
}
function en(r, e, t) {
  let n = r.steps.length - 1;
  if (n < e)
    return;
  let a = r.steps[n];
  if (!(a instanceof J || a instanceof K))
    return;
  let o = r.mapping.maps[n], i;
  o.forEach((s, l, d, u) => {
    i == null && (i = u);
  }), r.setSelection(E.near(r.doc.resolve(i), t));
}
function tn(r, e) {
  return !e || !r ? r : r.bind(e);
}
class dt {
  constructor(e, t, n) {
    this.name = e, this.init = tn(t.init, n), this.apply = tn(t.apply, n);
  }
}
new dt("doc", {
  init(r) {
    return r.doc || r.schema.topNodeType.createAndFill();
  },
  apply(r) {
    return r.doc;
  }
}), new dt("selection", {
  init(r, e) {
    return r.selection || E.atStart(e.doc);
  },
  apply(r) {
    return r.selection;
  }
}), new dt("storedMarks", {
  init(r) {
    return r.storedMarks || null;
  },
  apply(r, e, t, n) {
    return n.selection.$cursor ? r.storedMarks : null;
  }
}), new dt("scrollToSelection", {
  init() {
    return 0;
  },
  apply(r, e) {
    return r.scrolledIntoView ? e + 1 : e;
  }
});
function fa(r, e, t) {
  for (let n in r) {
    let a = r[n];
    a instanceof Function ? a = a.bind(e) : n == "handleDOMEvents" && (a = fa(a, e, {})), t[n] = a;
  }
  return t;
}
class Ee {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && fa(e.props, this, this.props), this.key = e.key ? e.key.key : ha("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const jt = /* @__PURE__ */ Object.create(null);
function ha(r) {
  return r in jt ? r + "$" + ++jt[r] : (jt[r] = 0, r + "$");
}
class Ie {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = ha(e);
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
const lr = (r, e) => r.selection.empty ? !1 : (e && e(r.tr.deleteSelection().scrollIntoView()), !0);
function ma(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("backward", r) : t.parentOffset > 0) ? null : t;
}
const ga = (r, e, t) => {
  let n = ma(r, t);
  if (!n)
    return !1;
  let a = cr(n);
  if (!a) {
    let i = n.blockRange(), s = i && He(i);
    return s == null ? !1 : (e && e(r.tr.lift(i, s).scrollIntoView()), !0);
  }
  let o = a.nodeBefore;
  if (Sa(r, a, e, -1))
    return !0;
  if (n.parent.content.size == 0 && ($e(o, "end") || I.isSelectable(o)))
    for (let i = n.depth; ; i--) {
      let s = ir(r.doc, n.before(i), n.after(i), k.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = r.tr.step(s);
          l.setSelection($e(o, "end") ? E.findFrom(l.doc.resolve(l.mapping.map(a.pos, -1)), -1) : I.create(l.doc, a.pos - o.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (i == 1 || n.node(i - 1).childCount > 1)
        break;
    }
  return o.isAtom && a.depth == n.depth - 1 ? (e && e(r.tr.delete(a.pos - o.nodeSize, a.pos).scrollIntoView()), !0) : !1;
}, Ls = (r, e, t) => {
  let n = ma(r, t);
  if (!n)
    return !1;
  let a = cr(n);
  return a ? ba(r, a, e) : !1;
}, Rs = (r, e, t) => {
  let n = va(r, t);
  if (!n)
    return !1;
  let a = dr(n);
  return a ? ba(r, a, e) : !1;
};
function ba(r, e, t) {
  let n = e.nodeBefore, a = n, o = e.pos - 1;
  for (; !a.isTextblock; o--) {
    if (a.type.spec.isolating)
      return !1;
    let u = a.lastChild;
    if (!u)
      return !1;
    a = u;
  }
  let i = e.nodeAfter, s = i, l = e.pos + 1;
  for (; !s.isTextblock; l++) {
    if (s.type.spec.isolating)
      return !1;
    let u = s.firstChild;
    if (!u)
      return !1;
    s = u;
  }
  let d = ir(r.doc, o, l, k.empty);
  if (!d || d.from != o || d instanceof J && d.slice.size >= l - o)
    return !1;
  if (t) {
    let u = r.tr.step(d);
    u.setSelection(O.create(u.doc, o)), t(u.scrollIntoView());
  }
  return !0;
}
function $e(r, e, t = !1) {
  for (let n = r; n; n = e == "start" ? n.firstChild : n.lastChild) {
    if (n.isTextblock)
      return !0;
    if (t && n.childCount != 1)
      return !1;
  }
  return !1;
}
const ya = (r, e, t) => {
  let { $head: n, empty: a } = r.selection, o = n;
  if (!a)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", r) : n.parentOffset > 0)
      return !1;
    o = cr(n);
  }
  let i = o && o.nodeBefore;
  return !i || !I.isSelectable(i) ? !1 : (e && e(r.tr.setSelection(I.create(r.doc, o.pos - i.nodeSize)).scrollIntoView()), !0);
};
function cr(r) {
  if (!r.parent.type.spec.isolating)
    for (let e = r.depth - 1; e >= 0; e--) {
      if (r.index(e) > 0)
        return r.doc.resolve(r.before(e + 1));
      if (r.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function va(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("forward", r) : t.parentOffset < t.parent.content.size) ? null : t;
}
const wa = (r, e, t) => {
  let n = va(r, t);
  if (!n)
    return !1;
  let a = dr(n);
  if (!a)
    return !1;
  let o = a.nodeAfter;
  if (Sa(r, a, e, 1))
    return !0;
  if (n.parent.content.size == 0 && ($e(o, "start") || I.isSelectable(o))) {
    let i = ir(r.doc, n.before(), n.after(), k.empty);
    if (i && i.slice.size < i.to - i.from) {
      if (e) {
        let s = r.tr.step(i);
        s.setSelection($e(o, "start") ? E.findFrom(s.doc.resolve(s.mapping.map(a.pos)), 1) : I.create(s.doc, s.mapping.map(a.pos))), e(s.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && a.depth == n.depth - 1 ? (e && e(r.tr.delete(a.pos, a.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, xa = (r, e, t) => {
  let { $head: n, empty: a } = r.selection, o = n;
  if (!a)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", r) : n.parentOffset < n.parent.content.size)
      return !1;
    o = dr(n);
  }
  let i = o && o.nodeAfter;
  return !i || !I.isSelectable(i) ? !1 : (e && e(r.tr.setSelection(I.create(r.doc, o.pos)).scrollIntoView()), !0);
};
function dr(r) {
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
const Ps = (r, e) => {
  let t = r.selection, n = t instanceof I, a;
  if (n) {
    if (t.node.isTextblock || !Te(r.doc, t.from))
      return !1;
    a = t.from;
  } else if (a = Lt(r.doc, t.from, -1), a == null)
    return !1;
  if (e) {
    let o = r.tr.join(a);
    n && o.setSelection(I.create(o.doc, a - r.doc.resolve(a).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, Fs = (r, e) => {
  let t = r.selection, n;
  if (t instanceof I) {
    if (t.node.isTextblock || !Te(r.doc, t.to))
      return !1;
    n = t.to;
  } else if (n = Lt(r.doc, t.to, 1), n == null)
    return !1;
  return e && e(r.tr.join(n).scrollIntoView()), !0;
}, $s = (r, e) => {
  let { $from: t, $to: n } = r.selection, a = t.blockRange(n), o = a && He(a);
  return o == null ? !1 : (e && e(r.tr.lift(a, o).scrollIntoView()), !0);
}, ka = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  return !t.parent.type.spec.code || !t.sameParent(n) ? !1 : (e && e(r.tr.insertText(`
`).scrollIntoView()), !0);
};
function ur(r) {
  for (let e = 0; e < r.edgeCount; e++) {
    let { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Bs = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  if (!t.parent.type.spec.code || !t.sameParent(n))
    return !1;
  let a = t.node(-1), o = t.indexAfter(-1), i = ur(a.contentMatchAt(o));
  if (!i || !a.canReplaceWith(o, o, i))
    return !1;
  if (e) {
    let s = t.after(), l = r.tr.replaceWith(s, s, i.createAndFill());
    l.setSelection(E.near(l.doc.resolve(s), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Ca = (r, e) => {
  let t = r.selection, { $from: n, $to: a } = t;
  if (t instanceof X || n.parent.inlineContent || a.parent.inlineContent)
    return !1;
  let o = ur(a.parent.contentMatchAt(a.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let i = (!n.parentOffset && a.index() < a.parent.childCount ? n : a).pos, s = r.tr.insert(i, o.createAndFill());
    s.setSelection(O.create(s.doc, i + 1)), e(s.scrollIntoView());
  }
  return !0;
}, Na = (r, e) => {
  let { $cursor: t } = r.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (ae(r.doc, o))
      return e && e(r.tr.split(o).scrollIntoView()), !0;
  }
  let n = t.blockRange(), a = n && He(n);
  return a == null ? !1 : (e && e(r.tr.lift(n, a).scrollIntoView()), !0);
};
function zs(r) {
  return (e, t) => {
    let { $from: n, $to: a } = e.selection;
    if (e.selection instanceof I && e.selection.node.isBlock)
      return !n.parentOffset || !ae(e.doc, n.pos) ? !1 : (t && t(e.tr.split(n.pos).scrollIntoView()), !0);
    if (!n.depth)
      return !1;
    let o = [], i, s, l = !1, d = !1;
    for (let m = n.depth; ; m--)
      if (n.node(m).isBlock) {
        l = n.end(m) == n.pos + (n.depth - m), d = n.start(m) == n.pos - (n.depth - m), s = ur(n.node(m - 1).contentMatchAt(n.indexAfter(m - 1))), o.unshift(l && s ? { type: s } : null), i = m;
        break;
      } else {
        if (m == 1)
          return !1;
        o.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof O || e.selection instanceof X) && u.deleteSelection();
    let p = u.mapping.map(n.pos), h = ae(u.doc, p, o.length, o);
    if (h || (o[0] = s ? { type: s } : null, h = ae(u.doc, p, o.length, o)), !h)
      return !1;
    if (u.split(p, o.length, o), !l && d && n.node(i).type != s) {
      let m = u.mapping.map(n.before(i)), v = u.doc.resolve(m);
      s && n.node(i - 1).canReplaceWith(v.index(), v.index() + 1, s) && u.setNodeMarkup(u.mapping.map(n.before(i)), s);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const Hs = zs(), js = (r, e) => {
  let { $from: t, to: n } = r.selection, a, o = t.sharedDepth(n);
  return o == 0 ? !1 : (a = t.before(o), e && e(r.tr.setSelection(I.create(r.doc, a))), !0);
};
function Ds(r, e, t) {
  let n = e.nodeBefore, a = e.nodeAfter, o = e.index();
  return !n || !a || !n.type.compatibleContent(a.type) ? !1 : !n.content.size && e.parent.canReplace(o - 1, o) ? (t && t(r.tr.delete(e.pos - n.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(a.isTextblock || Te(r.doc, e.pos)) ? !1 : (t && t(r.tr.join(e.pos).scrollIntoView()), !0);
}
function Sa(r, e, t, n) {
  let a = e.nodeBefore, o = e.nodeAfter, i, s, l = a.type.spec.isolating || o.type.spec.isolating;
  if (!l && Ds(r, e, t))
    return !0;
  let d = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (d && (i = (s = a.contentMatchAt(a.childCount)).findWrapping(o.type)) && s.matchType(i[0] || o.type).validEnd) {
    if (t) {
      let m = e.pos + o.nodeSize, v = w.empty;
      for (let b = i.length - 1; b >= 0; b--)
        v = w.from(i[b].create(null, v));
      v = w.from(a.copy(v));
      let g = r.tr.step(new K(e.pos - 1, m, e.pos, m, new k(v, 1, 0), i.length, !0)), y = g.doc.resolve(m + 2 * i.length);
      y.nodeAfter && y.nodeAfter.type == a.type && Te(g.doc, y.pos) && g.join(y.pos), t(g.scrollIntoView());
    }
    return !0;
  }
  let u = o.type.spec.isolating || n > 0 && l ? null : E.findFrom(e, 1), p = u && u.$from.blockRange(u.$to), h = p && He(p);
  if (h != null && h >= e.depth)
    return t && t(r.tr.lift(p, h).scrollIntoView()), !0;
  if (d && $e(o, "start", !0) && $e(a, "end")) {
    let m = a, v = [];
    for (; v.push(m), !m.isTextblock; )
      m = m.lastChild;
    let g = o, y = 1;
    for (; !g.isTextblock; g = g.firstChild)
      y++;
    if (m.canReplace(m.childCount, m.childCount, g.content)) {
      if (t) {
        let b = w.empty;
        for (let A = v.length - 1; A >= 0; A--)
          b = w.from(v[A].copy(b));
        let N = r.tr.step(new K(e.pos - v.length, e.pos + o.nodeSize, e.pos + y, e.pos + o.nodeSize - y, new k(b, v.length, 0), 0, !0));
        t(N.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Aa(r) {
  return function(e, t) {
    let n = e.selection, a = r < 0 ? n.$from : n.$to, o = a.depth;
    for (; a.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return a.node(o).isTextblock ? (t && t(e.tr.setSelection(O.create(e.doc, r < 0 ? a.start(o) : a.end(o)))), !0) : !1;
  };
}
const Us = Aa(-1), _s = Aa(1);
function Vs(r, e = null) {
  return function(t, n) {
    let { $from: a, $to: o } = t.selection, i = a.blockRange(o), s = i && da(i, r, e);
    return s ? (n && n(t.tr.wrap(i, s).scrollIntoView()), !0) : !1;
  };
}
function rn(r, e = null) {
  return function(t, n) {
    let a = !1;
    for (let o = 0; o < t.selection.ranges.length && !a; o++) {
      let { $from: { pos: i }, $to: { pos: s } } = t.selection.ranges[o];
      t.doc.nodesBetween(i, s, (l, d) => {
        if (a)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(r, e)))
          if (l.type == r)
            a = !0;
          else {
            let u = t.doc.resolve(d), p = u.index();
            a = u.parent.canReplaceWith(p, p + 1, r);
          }
      });
    }
    if (!a)
      return !1;
    if (n) {
      let o = t.tr;
      for (let i = 0; i < t.selection.ranges.length; i++) {
        let { $from: { pos: s }, $to: { pos: l } } = t.selection.ranges[i];
        o.setBlockType(s, l, r, e);
      }
      n(o.scrollIntoView());
    }
    return !0;
  };
}
function pr(...r) {
  return function(e, t, n) {
    for (let a = 0; a < r.length; a++)
      if (r[a](e, t, n))
        return !0;
    return !1;
  };
}
pr(lr, ga, ya);
pr(lr, wa, xa);
pr(ka, Ca, Na, Hs);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function qs(r, e = null) {
  return function(t, n) {
    let { $from: a, $to: o } = t.selection, i = a.blockRange(o);
    if (!i)
      return !1;
    let s = n ? t.tr : null;
    return Js(s, i, r, e) ? (n && n(s.scrollIntoView()), !0) : !1;
  };
}
function Js(r, e, t, n = null) {
  let a = !1, o = e, i = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = i.resolve(e.start - 2);
    o = new kt(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new kt(e.$from, i.resolve(e.$to.end(e.depth)), e.depth)), a = !0;
  }
  let s = da(o, t, n, e);
  return s ? (r && Ws(r, e, s, a, t), !0) : !1;
}
function Ws(r, e, t, n, a) {
  let o = w.empty;
  for (let u = t.length - 1; u >= 0; u--)
    o = w.from(t[u].type.create(t[u].attrs, o));
  r.step(new K(e.start - (n ? 2 : 0), e.end, e.start, e.end, new k(o, 0, 0), t.length, !0));
  let i = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == a && (i = u + 1);
  let s = t.length - i, l = e.start + t.length - (n ? 2 : 0), d = e.parent;
  for (let u = e.startIndex, p = e.endIndex, h = !0; u < p; u++, h = !1)
    !h && ae(r.doc, l, s) && (r.split(l, s), l += 2 * s), l += d.child(u).nodeSize;
  return r;
}
function Ks(r) {
  return function(e, t) {
    let { $from: n, $to: a } = e.selection, o = n.blockRange(a, (i) => i.childCount > 0 && i.firstChild.type == r);
    return o ? t ? n.node(o.depth - 1).type == r ? Gs(e, t, r, o) : Ys(e, t, o) : !0 : !1;
  };
}
function Gs(r, e, t, n) {
  let a = r.tr, o = n.end, i = n.$to.end(n.depth);
  o < i && (a.step(new K(o - 1, i, o, i, new k(w.from(t.create(null, n.parent.copy())), 1, 0), 1, !0)), n = new kt(a.doc.resolve(n.$from.pos), a.doc.resolve(i), n.depth));
  const s = He(n);
  if (s == null)
    return !1;
  a.lift(n, s);
  let l = a.doc.resolve(a.mapping.map(o, -1) - 1);
  return Te(a.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && a.join(l.pos), e(a.scrollIntoView()), !0;
}
function Ys(r, e, t) {
  let n = r.tr, a = t.parent;
  for (let m = t.end, v = t.endIndex - 1, g = t.startIndex; v > g; v--)
    m -= a.child(v).nodeSize, n.delete(m - 1, m + 1);
  let o = n.doc.resolve(t.start), i = o.nodeAfter;
  if (n.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let s = t.startIndex == 0, l = t.endIndex == a.childCount, d = o.node(-1), u = o.index(-1);
  if (!d.canReplace(u + (s ? 0 : 1), u + 1, i.content.append(l ? w.empty : w.from(a))))
    return !1;
  let p = o.pos, h = p + i.nodeSize;
  return n.step(new K(p - (s ? 1 : 0), h + (l ? 1 : 0), p + 1, h - 1, new k((s ? w.empty : w.from(a.copy(w.empty))).append(l ? w.empty : w.from(a.copy(w.empty))), s ? 0 : 1, l ? 0 : 1), s ? 0 : 1)), e(n.scrollIntoView()), !0;
}
function Xs(r) {
  return function(e, t) {
    let { $from: n, $to: a } = e.selection, o = n.blockRange(a, (d) => d.childCount > 0 && d.firstChild.type == r);
    if (!o)
      return !1;
    let i = o.startIndex;
    if (i == 0)
      return !1;
    let s = o.parent, l = s.child(i - 1);
    if (l.type != r)
      return !1;
    if (t) {
      let d = l.lastChild && l.lastChild.type == s.type, u = w.from(d ? r.create() : null), p = new k(w.from(r.create(null, w.from(s.type.create(null, u)))), d ? 3 : 1, 0), h = o.start, m = o.end;
      t(e.tr.step(new K(h - (d ? 3 : 1), m, h, m, p, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Ta(r) {
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
class Zs {
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
    return Object.fromEntries(Object.entries(e).map(([s, l]) => [s, (...u) => {
      const p = l(...u)(i);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && a.dispatch(o), p;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: n, editor: a, state: o } = this, { view: i } = a, s = [], l = !!e, d = e || o.tr, u = () => (!l && t && !d.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(d), s.every((h) => h === !0)), p = {
      ...Object.fromEntries(Object.entries(n).map(([h, m]) => [h, (...g) => {
        const y = this.buildProps(d, t), b = m(...g)(y);
        return s.push(b), p;
      }])),
      run: u
    };
    return p;
  }
  createCan(e) {
    const { rawCommands: t, state: n } = this, a = !1, o = e || n.tr, i = this.buildProps(o, a);
    return {
      ...Object.fromEntries(Object.entries(t).map(([l, d]) => [l, (...u) => d(...u)({ ...i, dispatch: void 0 })])),
      chain: () => this.createChain(o, a)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: n, editor: a, state: o } = this, { view: i } = a, s = {
      tr: e,
      editor: a,
      view: i,
      state: Ta({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(n).map(([l, d]) => [l, (...u) => d(...u)(s)]));
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
function Qs(r) {
  const e = r.filter((a) => a.type === "extension"), t = r.filter((a) => a.type === "node"), n = r.filter((a) => a.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: n
  };
}
function V(r, e) {
  if (typeof r == "string") {
    if (!e.nodes[r])
      throw Error(`There is no node type named '${r}'. Maybe you forgot to add the extension?`);
    return e.nodes[r];
  }
  return r;
}
function Ea(...r) {
  return r.filter((e) => !!e).reduce((e, t) => {
    const n = { ...e };
    return Object.entries(t).forEach(([a, o]) => {
      if (!n[a]) {
        n[a] = o;
        return;
      }
      if (a === "class") {
        const s = o ? String(o).split(" ") : [], l = n[a] ? n[a].split(" ") : [], d = s.filter((u) => !l.includes(u));
        n[a] = [...l, ...d].join(" ");
      } else if (a === "style") {
        const s = o ? o.split(";").map((u) => u.trim()).filter(Boolean) : [], l = n[a] ? n[a].split(";").map((u) => u.trim()).filter(Boolean) : [], d = /* @__PURE__ */ new Map();
        l.forEach((u) => {
          const [p, h] = u.split(":").map((m) => m.trim());
          d.set(p, h);
        }), s.forEach((u) => {
          const [p, h] = u.split(":").map((m) => m.trim());
          d.set(p, h);
        }), n[a] = Array.from(d.entries()).map(([u, p]) => `${u}: ${p}`).join("; ");
      } else
        n[a] = o;
    }), n;
  }, {});
}
function el(r, e) {
  return e.filter((t) => t.type === r.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(r.attrs) || {} : {
    [t.name]: r.attrs[t.name]
  }).reduce((t, n) => Ea(t, n), {});
}
function tl(r) {
  return typeof r == "function";
}
function ne(r, e = void 0, ...t) {
  return tl(r) ? e ? r.bind(e)(...t) : r(...t) : r;
}
function rl(r) {
  return Object.prototype.toString.call(r) === "[object RegExp]";
}
function nl(r) {
  return Object.prototype.toString.call(r).slice(8, -1);
}
function ut(r) {
  return nl(r) !== "Object" ? !1 : r.constructor === Object && Object.getPrototypeOf(r) === Object.prototype;
}
function fr(r, e) {
  const t = { ...r };
  return ut(r) && ut(e) && Object.keys(e).forEach((n) => {
    ut(e[n]) && ut(r[n]) ? t[n] = fr(r[n], e[n]) : t[n] = e[n];
  }), t;
}
class Q {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = ne(Z(this, "addOptions", {
      name: this.name
    }))), this.storage = ne(Z(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Q(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => fr(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new Q({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = ne(Z(t, "addOptions", {
      name: t.name
    })), t.storage = ne(Z(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function al(r, e, t) {
  const { from: n, to: a } = e, { blockSeparator: o = `

`, textSerializers: i = {} } = t || {};
  let s = "";
  return r.nodesBetween(n, a, (l, d, u, p) => {
    var h;
    l.isBlock && d > n && (s += o);
    const m = i == null ? void 0 : i[l.type.name];
    if (m)
      return u && (s += m({
        node: l,
        pos: d,
        parent: u,
        index: p,
        range: e
      })), !1;
    l.isText && (s += (h = l == null ? void 0 : l.text) === null || h === void 0 ? void 0 : h.slice(Math.max(n, d) - d, a - d));
  }), s;
}
function ol(r) {
  return Object.fromEntries(Object.entries(r.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
Q.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new Ee({
        key: new Ie("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: r } = this, { state: e, schema: t } = r, { doc: n, selection: a } = e, { ranges: o } = a, i = Math.min(...o.map((u) => u.$from.pos)), s = Math.max(...o.map((u) => u.$to.pos)), l = ol(t);
            return al(n, { from: i, to: s }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
});
const il = () => ({ editor: r, view: e }) => (requestAnimationFrame(() => {
  var t;
  r.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), sl = (r = !1) => ({ commands: e }) => e.setContent("", r), ll = () => ({ state: r, tr: e, dispatch: t }) => {
  const { selection: n } = e, { ranges: a } = n;
  return t && a.forEach(({ $from: o, $to: i }) => {
    r.doc.nodesBetween(o.pos, i.pos, (s, l) => {
      if (s.type.isText)
        return;
      const { doc: d, mapping: u } = e, p = d.resolve(u.map(l)), h = d.resolve(u.map(l + s.nodeSize)), m = p.blockRange(h);
      if (!m)
        return;
      const v = He(m);
      if (s.type.isTextblock) {
        const { defaultType: g } = p.parent.contentMatchAt(p.index());
        e.setNodeMarkup(m.start, g);
      }
      (v || v === 0) && e.lift(m, v);
    });
  }), !0;
}, cl = (r) => (e) => r(e), dl = () => ({ state: r, dispatch: e }) => Ca(r, e), ul = (r, e) => ({ editor: t, tr: n }) => {
  const { state: a } = t, o = a.doc.slice(r.from, r.to);
  n.deleteRange(r.from, r.to);
  const i = n.mapping.map(e);
  return n.insert(i, o.content), n.setSelection(new O(n.doc.resolve(Math.max(i - 1, 0)))), !0;
}, pl = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, n = t.$anchor.node();
  if (n.content.size > 0)
    return !1;
  const a = r.selection.$anchor;
  for (let o = a.depth; o > 0; o -= 1)
    if (a.node(o).type === n.type) {
      if (e) {
        const s = a.before(o), l = a.after(o);
        r.delete(s, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, fl = (r) => ({ tr: e, state: t, dispatch: n }) => {
  const a = V(r, t.schema), o = e.selection.$anchor;
  for (let i = o.depth; i > 0; i -= 1)
    if (o.node(i).type === a) {
      if (n) {
        const l = o.before(i), d = o.after(i);
        e.delete(l, d).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, hl = (r) => ({ tr: e, dispatch: t }) => {
  const { from: n, to: a } = r;
  return t && e.delete(n, a), !0;
}, ml = () => ({ state: r, dispatch: e }) => lr(r, e), gl = () => ({ commands: r }) => r.keyboardShortcut("Enter"), bl = () => ({ state: r, dispatch: e }) => Bs(r, e);
function At(r, e, t = { strict: !0 }) {
  const n = Object.keys(e);
  return n.length ? n.every((a) => t.strict ? e[a] === r[a] : rl(e[a]) ? e[a].test(r[a]) : e[a] === r[a]) : !0;
}
function Ia(r, e, t = {}) {
  return r.find((n) => n.type === e && At(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((a) => [a, n.attrs[a]])),
    t
  ));
}
function nn(r, e, t = {}) {
  return !!Ia(r, e, t);
}
function Ma(r, e, t) {
  var n;
  if (!r || !e)
    return;
  let a = r.parent.childAfter(r.parentOffset);
  if ((!a.node || !a.node.marks.some((u) => u.type === e)) && (a = r.parent.childBefore(r.parentOffset)), !a.node || !a.node.marks.some((u) => u.type === e) || (t = t || ((n = a.node.marks[0]) === null || n === void 0 ? void 0 : n.attrs), !Ia([...a.node.marks], e, t)))
    return;
  let i = a.index, s = r.start() + a.offset, l = i + 1, d = s + a.node.nodeSize;
  for (; i > 0 && nn([...r.parent.child(i - 1).marks], e, t); )
    i -= 1, s -= r.parent.child(i).nodeSize;
  for (; l < r.parent.childCount && nn([...r.parent.child(l).marks], e, t); )
    d += r.parent.child(l).nodeSize, l += 1;
  return {
    from: s,
    to: d
  };
}
function de(r, e) {
  if (typeof r == "string") {
    if (!e.marks[r])
      throw Error(`There is no mark type named '${r}'. Maybe you forgot to add the extension?`);
    return e.marks[r];
  }
  return r;
}
const yl = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  const o = de(r, n.schema), { doc: i, selection: s } = t, { $from: l, from: d, to: u } = s;
  if (a) {
    const p = Ma(l, o, e);
    if (p && p.from <= d && p.to >= u) {
      const h = O.create(i, p.from, p.to);
      t.setSelection(h);
    }
  }
  return !0;
}, vl = (r) => (e) => {
  const t = typeof r == "function" ? r(e) : r;
  for (let n = 0; n < t.length; n += 1)
    if (t[n](e))
      return !0;
  return !1;
};
function Oa(r) {
  return r instanceof O;
}
function ve(r = 0, e = 0, t = 0) {
  return Math.min(Math.max(r, e), t);
}
function wl(r, e = null) {
  if (!e)
    return null;
  const t = E.atStart(r), n = E.atEnd(r);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return n;
  const a = t.from, o = n.to;
  return e === "all" ? O.create(r, ve(0, a, o), ve(r.content.size, a, o)) : O.create(r, ve(e, a, o), ve(e, a, o));
}
function Qt() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function ot() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function xl() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
const kl = (r = null, e = {}) => ({ editor: t, view: n, tr: a, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const i = () => {
    (ot() || Qt()) && n.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (n.focus(), xl() && !ot() && !Qt() && n.dom.focus({ preventScroll: !0 }));
    });
  };
  if (n.hasFocus() && r === null || r === !1)
    return !0;
  if (o && r === null && !Oa(t.state.selection))
    return i(), !0;
  const s = wl(a.doc, r) || t.state.selection, l = t.state.selection.eq(s);
  return o && (l || a.setSelection(s), l && a.storedMarks && a.setStoredMarks(a.storedMarks), i()), !0;
}, Cl = (r, e) => (t) => r.every((n, a) => e(n, { ...t, index: a })), Nl = (r, e) => ({ tr: t, commands: n }) => n.insertContentAt({ from: t.selection.from, to: t.selection.to }, r, e), La = (r) => {
  const e = r.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const n = e[t];
    n.nodeType === 3 && n.nodeValue && /^(\n\s\s|\n)$/.test(n.nodeValue) ? r.removeChild(n) : n.nodeType === 1 && La(n);
  }
  return r;
};
function pt(r) {
  const e = `<body>${r}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return La(t);
}
function it(r, e, t) {
  if (r instanceof ke || r instanceof w)
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
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", r, "Error:", o), it("", e, t);
    }
  if (a) {
    if (t.errorOnInvalidContent) {
      let i = !1, s = "";
      const l = new ms({
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
                getAttrs: (d) => (i = !0, s = typeof d == "string" ? d : d.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? Oe.fromSchema(l).parseSlice(pt(r), t.parseOptions) : Oe.fromSchema(l).parse(pt(r), t.parseOptions), t.errorOnInvalidContent && i)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${s}`) });
    }
    const o = Oe.fromSchema(e);
    return t.slice ? o.parseSlice(pt(r), t.parseOptions).content : o.parse(pt(r), t.parseOptions);
  }
  return it("", e, t);
}
function Sl(r, e, t) {
  const n = r.steps.length - 1;
  if (n < e)
    return;
  const a = r.steps[n];
  if (!(a instanceof J || a instanceof K))
    return;
  const o = r.mapping.maps[n];
  let i = 0;
  o.forEach((s, l, d, u) => {
    i === 0 && (i = u);
  }), r.setSelection(E.near(r.doc.resolve(i), t));
}
const Al = (r) => !("type" in r), Tl = (r, e, t) => ({ tr: n, dispatch: a, editor: o }) => {
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
    const l = (y) => {
      o.emit("contentError", {
        editor: o,
        error: y,
        disableCollaboration: () => {
          o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
        }
      });
    }, d = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError)
      try {
        it(e, o.schema, {
          parseOptions: d,
          errorOnInvalidContent: !0
        });
      } catch (y) {
        l(y);
      }
    try {
      s = it(e, o.schema, {
        parseOptions: d,
        errorOnInvalidContent: (i = t.errorOnInvalidContent) !== null && i !== void 0 ? i : o.options.enableContentCheck
      });
    } catch (y) {
      return l(y), !1;
    }
    let { from: u, to: p } = typeof r == "number" ? { from: r, to: r } : { from: r.from, to: r.to }, h = !0, m = !0;
    if ((Al(s) ? s : [s]).forEach((y) => {
      y.check(), h = h ? y.isText && y.marks.length === 0 : !1, m = m ? y.isBlock : !1;
    }), u === p && m) {
      const { parent: y } = n.doc.resolve(u);
      y.isTextblock && !y.type.spec.code && !y.childCount && (u -= 1, p += 1);
    }
    let g;
    if (h) {
      if (Array.isArray(e))
        g = e.map((y) => y.text || "").join("");
      else if (e instanceof w) {
        let y = "";
        e.forEach((b) => {
          b.text && (y += b.text);
        }), g = y;
      } else typeof e == "object" && e && e.text ? g = e.text : g = e;
      n.insertText(g, u, p);
    } else
      g = s, n.replaceWith(u, p, g);
    t.updateSelection && Sl(n, n.steps.length - 1, -1), t.applyInputRules && n.setMeta("applyInputRules", { from: u, text: g }), t.applyPasteRules && n.setMeta("applyPasteRules", { from: u, text: g });
  }
  return !0;
}, El = () => ({ state: r, dispatch: e }) => Ps(r, e), Il = () => ({ state: r, dispatch: e }) => Fs(r, e), Ml = () => ({ state: r, dispatch: e }) => ga(r, e), Ol = () => ({ state: r, dispatch: e }) => wa(r, e), Ll = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = Lt(r.doc, r.selection.$from.pos, -1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Rl = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = Lt(r.doc, r.selection.$from.pos, 1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Pl = () => ({ state: r, dispatch: e }) => Ls(r, e), Fl = () => ({ state: r, dispatch: e }) => Rs(r, e);
function Ra() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function $l(r) {
  const e = r.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let n, a, o, i;
  for (let s = 0; s < e.length - 1; s += 1) {
    const l = e[s];
    if (/^(cmd|meta|m)$/i.test(l))
      i = !0;
    else if (/^a(lt)?$/i.test(l))
      n = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      a = !0;
    else if (/^s(hift)?$/i.test(l))
      o = !0;
    else if (/^mod$/i.test(l))
      ot() || Ra() ? i = !0 : a = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return n && (t = `Alt-${t}`), a && (t = `Ctrl-${t}`), i && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const Bl = (r) => ({ editor: e, view: t, tr: n, dispatch: a }) => {
  const o = $l(r).split(/-(?!$)/), i = o.find((d) => !["Alt", "Ctrl", "Meta", "Shift"].includes(d)), s = new KeyboardEvent("keydown", {
    key: i === "Space" ? " " : i,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (d) => d(t, s));
  });
  return l == null || l.steps.forEach((d) => {
    const u = d.map(n.mapping);
    u && a && n.maybeStep(u);
  }), !0;
};
function hr(r, e, t = {}) {
  const { from: n, to: a, empty: o } = r.selection, i = e ? V(e, r.schema) : null, s = [];
  r.doc.nodesBetween(n, a, (p, h) => {
    if (p.isText)
      return;
    const m = Math.max(n, h), v = Math.min(a, h + p.nodeSize);
    s.push({
      node: p,
      from: m,
      to: v
    });
  });
  const l = a - n, d = s.filter((p) => i ? i.name === p.node.type.name : !0).filter((p) => At(p.node.attrs, t, { strict: !1 }));
  return o ? !!d.length : d.reduce((p, h) => p + h.to - h.from, 0) >= l;
}
const zl = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const a = V(r, t.schema);
  return hr(t, a, e) ? $s(t, n) : !1;
}, Hl = () => ({ state: r, dispatch: e }) => Na(r, e), jl = (r) => ({ state: e, dispatch: t }) => {
  const n = V(r, e.schema);
  return Ks(n)(e, t);
}, Dl = () => ({ state: r, dispatch: e }) => ka(r, e);
function Pa(r, e) {
  return e.nodes[r] ? "node" : e.marks[r] ? "mark" : null;
}
function an(r, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(r).reduce((n, a) => (t.includes(a) || (n[a] = r[a]), n), {});
}
const Ul = (r, e) => ({ tr: t, state: n, dispatch: a }) => {
  let o = null, i = null;
  const s = Pa(typeof r == "string" ? r : r.name, n.schema);
  return s ? (s === "node" && (o = V(r, n.schema)), s === "mark" && (i = de(r, n.schema)), a && t.selection.ranges.forEach((l) => {
    n.doc.nodesBetween(l.$from.pos, l.$to.pos, (d, u) => {
      o && o === d.type && t.setNodeMarkup(u, void 0, an(d.attrs, e)), i && d.marks.length && d.marks.forEach((p) => {
        i === p.type && t.addMark(u, u + d.nodeSize, i.create(an(p.attrs, e)));
      });
    });
  }), !0) : !1;
}, _l = () => ({ tr: r, dispatch: e }) => (e && r.scrollIntoView(), !0), Vl = () => ({ tr: r, dispatch: e }) => {
  if (e) {
    const t = new X(r.doc);
    r.setSelection(t);
  }
  return !0;
}, ql = () => ({ state: r, dispatch: e }) => ya(r, e), Jl = () => ({ state: r, dispatch: e }) => xa(r, e), Wl = () => ({ state: r, dispatch: e }) => js(r, e), Kl = () => ({ state: r, dispatch: e }) => _s(r, e), Gl = () => ({ state: r, dispatch: e }) => Us(r, e);
function Yl(r, e, t = {}, n = {}) {
  return it(r, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: n.errorOnInvalidContent
  });
}
const Xl = (r, e = !1, t = {}, n = {}) => ({ editor: a, tr: o, dispatch: i, commands: s }) => {
  var l, d;
  const { doc: u } = o;
  if (t.preserveWhitespace !== "full") {
    const p = Yl(r, a.schema, t, {
      errorOnInvalidContent: (l = n.errorOnInvalidContent) !== null && l !== void 0 ? l : a.options.enableContentCheck
    });
    return i && o.replaceWith(0, u.content.size, p).setMeta("preventUpdate", !e), !0;
  }
  return i && o.setMeta("preventUpdate", !e), s.insertContentAt({ from: 0, to: u.content.size }, r, {
    parseOptions: t,
    errorOnInvalidContent: (d = n.errorOnInvalidContent) !== null && d !== void 0 ? d : a.options.enableContentCheck
  });
};
function Zl(r, e) {
  const t = de(e, r.schema), { from: n, to: a, empty: o } = r.selection, i = [];
  o ? (r.storedMarks && i.push(...r.storedMarks), i.push(...r.selection.$head.marks())) : r.doc.nodesBetween(n, a, (l) => {
    i.push(...l.marks);
  });
  const s = i.find((l) => l.type.name === t.name);
  return s ? { ...s.attrs } : {};
}
function Ql(r) {
  for (let e = 0; e < r.edgeCount; e += 1) {
    const { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function ec(r, e) {
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
function mr(r) {
  return (e) => ec(e.$from, r);
}
function ht(r, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => {
    const a = r.find((o) => o.type === e && o.name === n);
    return a ? a.attribute.keepOnSplit : !1;
  }));
}
function tc(r, e, t = {}) {
  const { empty: n, ranges: a } = r.selection, o = e ? de(e, r.schema) : null;
  if (n)
    return !!(r.storedMarks || r.selection.$from.marks()).filter((p) => o ? o.name === p.type.name : !0).find((p) => At(p.attrs, t, { strict: !1 }));
  let i = 0;
  const s = [];
  if (a.forEach(({ $from: p, $to: h }) => {
    const m = p.pos, v = h.pos;
    r.doc.nodesBetween(m, v, (g, y) => {
      if (!g.isText && !g.marks.length)
        return;
      const b = Math.max(m, y), N = Math.min(v, y + g.nodeSize), A = N - b;
      i += A, s.push(...g.marks.map((R) => ({
        mark: R,
        from: b,
        to: N
      })));
    });
  }), i === 0)
    return !1;
  const l = s.filter((p) => o ? o.name === p.mark.type.name : !0).filter((p) => At(p.mark.attrs, t, { strict: !1 })).reduce((p, h) => p + h.to - h.from, 0), d = s.filter((p) => o ? p.mark.type !== o && p.mark.type.excludes(o) : !0).reduce((p, h) => p + h.to - h.from, 0);
  return (l > 0 ? l + d : l) >= i;
}
function on(r, e) {
  const { nodeExtensions: t } = Qs(e), n = t.find((i) => i.name === r);
  if (!n)
    return !1;
  const a = {
    name: n.name,
    options: n.options,
    storage: n.storage
  }, o = ne(Z(n, "group", a));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function Fa(r, { checkChildren: e = !0, ignoreWhitespace: t = !1 } = {}) {
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
      a !== !1 && (Fa(o, { ignoreWhitespace: t, checkChildren: e }) || (a = !1));
    }), a;
  }
  return !1;
}
function rc(r, e, t) {
  var n;
  const { selection: a } = e;
  let o = null;
  if (Oa(a) && (o = a.$cursor), o) {
    const s = (n = r.storedMarks) !== null && n !== void 0 ? n : o.marks();
    return !!t.isInSet(s) || !s.some((l) => l.type.excludes(t));
  }
  const { ranges: i } = a;
  return i.some(({ $from: s, $to: l }) => {
    let d = s.depth === 0 ? r.doc.inlineContent && r.doc.type.allowsMarkType(t) : !1;
    return r.doc.nodesBetween(s.pos, l.pos, (u, p, h) => {
      if (d)
        return !1;
      if (u.isInline) {
        const m = !h || h.type.allowsMarkType(t), v = !!t.isInSet(u.marks) || !u.marks.some((g) => g.type.excludes(t));
        d = m && v;
      }
      return !d;
    }), d;
  });
}
const nc = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  const { selection: o } = t, { empty: i, ranges: s } = o, l = de(r, n.schema);
  if (a)
    if (i) {
      const d = Zl(n, l);
      t.addStoredMark(l.create({
        ...d,
        ...e
      }));
    } else
      s.forEach((d) => {
        const u = d.$from.pos, p = d.$to.pos;
        n.doc.nodesBetween(u, p, (h, m) => {
          const v = Math.max(m, u), g = Math.min(m + h.nodeSize, p);
          h.marks.find((b) => b.type === l) ? h.marks.forEach((b) => {
            l === b.type && t.addMark(v, g, l.create({
              ...b.attrs,
              ...e
            }));
          }) : t.addMark(v, g, l.create(e));
        });
      });
  return rc(n, t, l);
}, ac = (r, e) => ({ tr: t }) => (t.setMeta(r, e), !0), oc = (r, e = {}) => ({ state: t, dispatch: n, chain: a }) => {
  const o = V(r, t.schema);
  let i;
  return t.selection.$anchor.sameParent(t.selection.$head) && (i = t.selection.$anchor.parent.attrs), o.isTextblock ? a().command(({ commands: s }) => rn(o, { ...i, ...e })(t) ? !0 : s.clearNodes()).command(({ state: s }) => rn(o, { ...i, ...e })(s, n)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, ic = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, a = ve(r, 0, n.content.size), o = I.create(n, a);
    e.setSelection(o);
  }
  return !0;
}, sc = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, { from: a, to: o } = typeof r == "number" ? { from: r, to: r } : r, i = O.atStart(n).from, s = O.atEnd(n).to, l = ve(a, i, s), d = ve(o, i, s), u = O.create(n, l, d);
    e.setSelection(u);
  }
  return !0;
}, lc = (r) => ({ state: e, dispatch: t }) => {
  const n = V(r, e.schema);
  return Xs(n)(e, t);
};
function sn(r, e) {
  const t = r.storedMarks || r.selection.$to.parentOffset && r.selection.$from.marks();
  if (t) {
    const n = t.filter((a) => e == null ? void 0 : e.includes(a.type.name));
    r.tr.ensureMarks(n);
  }
}
const cc = ({ keepMarks: r = !0 } = {}) => ({ tr: e, state: t, dispatch: n, editor: a }) => {
  const { selection: o, doc: i } = e, { $from: s, $to: l } = o, d = a.extensionManager.attributes, u = ht(d, s.node().type.name, s.node().attrs);
  if (o instanceof I && o.node.isBlock)
    return !s.parentOffset || !ae(i, s.pos) ? !1 : (n && (r && sn(t, a.extensionManager.splittableMarks), e.split(s.pos).scrollIntoView()), !0);
  if (!s.parent.isBlock)
    return !1;
  const p = l.parentOffset === l.parent.content.size, h = s.depth === 0 ? void 0 : Ql(s.node(-1).contentMatchAt(s.indexAfter(-1)));
  let m = p && h ? [
    {
      type: h,
      attrs: u
    }
  ] : void 0, v = ae(e.doc, e.mapping.map(s.pos), 1, m);
  if (!m && !v && ae(e.doc, e.mapping.map(s.pos), 1, h ? [{ type: h }] : void 0) && (v = !0, m = h ? [
    {
      type: h,
      attrs: u
    }
  ] : void 0), n) {
    if (v && (o instanceof O && e.deleteSelection(), e.split(e.mapping.map(s.pos), 1, m), h && !p && !s.parentOffset && s.parent.type !== h)) {
      const g = e.mapping.map(s.before()), y = e.doc.resolve(g);
      s.node(-1).canReplaceWith(y.index(), y.index() + 1, h) && e.setNodeMarkup(e.mapping.map(s.before()), h);
    }
    r && sn(t, a.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return v;
}, dc = (r, e = {}) => ({ tr: t, state: n, dispatch: a, editor: o }) => {
  var i;
  const s = V(r, n.schema), { $from: l, $to: d } = n.selection, u = n.selection.node;
  if (u && u.isBlock || l.depth < 2 || !l.sameParent(d))
    return !1;
  const p = l.node(-1);
  if (p.type !== s)
    return !1;
  const h = o.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== s || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (a) {
      let b = w.empty;
      const N = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let z = l.depth - N; z >= l.depth - 3; z -= 1)
        b = w.from(l.node(z).copy(b));
      const A = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, R = {
        ...ht(h, l.node().type.name, l.node().attrs),
        ...e
      }, P = ((i = s.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(R)) || void 0;
      b = b.append(w.from(s.createAndFill(null, P) || void 0));
      const L = l.before(l.depth - (N - 1));
      t.replace(L, l.after(-A), new k(b, 4 - N, 0));
      let S = -1;
      t.doc.nodesBetween(L, t.doc.content.size, (z, ie) => {
        if (S > -1)
          return !1;
        z.isTextblock && z.content.size === 0 && (S = ie + 1);
      }), S > -1 && t.setSelection(O.near(t.doc.resolve(S))), t.scrollIntoView();
    }
    return !0;
  }
  const m = d.pos === l.end() ? p.contentMatchAt(0).defaultType : null, v = {
    ...ht(h, p.type.name, p.attrs),
    ...e
  }, g = {
    ...ht(h, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, d.pos);
  const y = m ? [
    { type: s, attrs: v },
    { type: m, attrs: g }
  ] : [{ type: s, attrs: v }];
  if (!ae(t.doc, l.pos, 2))
    return !1;
  if (a) {
    const { selection: b, storedMarks: N } = n, { splittableMarks: A } = o.extensionManager, R = N || b.$to.parentOffset && b.$from.marks();
    if (t.split(l.pos, 2, y).scrollIntoView(), !R || !a)
      return !0;
    const P = R.filter((L) => A.includes(L.type.name));
    t.ensureMarks(P);
  }
  return !0;
}, Dt = (r, e) => {
  const t = mr((i) => i.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (n === void 0)
    return !0;
  const a = r.doc.nodeAt(n);
  return t.node.type === (a == null ? void 0 : a.type) && Te(r.doc, t.pos) && r.join(t.pos), !0;
}, Ut = (r, e) => {
  const t = mr((i) => i.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(t.start).after(t.depth);
  if (n === void 0)
    return !0;
  const a = r.doc.nodeAt(n);
  return t.node.type === (a == null ? void 0 : a.type) && Te(r.doc, n) && r.join(n), !0;
}, uc = (r, e, t, n = {}) => ({ editor: a, tr: o, state: i, dispatch: s, chain: l, commands: d, can: u }) => {
  const { extensions: p, splittableMarks: h } = a.extensionManager, m = V(r, i.schema), v = V(e, i.schema), { selection: g, storedMarks: y } = i, { $from: b, $to: N } = g, A = b.blockRange(N), R = y || g.$to.parentOffset && g.$from.marks();
  if (!A)
    return !1;
  const P = mr((L) => on(L.type.name, p))(g);
  if (A.depth >= 1 && P && A.depth - P.depth <= 1) {
    if (P.node.type === m)
      return d.liftListItem(v);
    if (on(P.node.type.name, p) && m.validContent(P.node.content) && s)
      return l().command(() => (o.setNodeMarkup(P.pos, m), !0)).command(() => Dt(o, m)).command(() => Ut(o, m)).run();
  }
  return !t || !R || !s ? l().command(() => u().wrapInList(m, n) ? !0 : d.clearNodes()).wrapInList(m, n).command(() => Dt(o, m)).command(() => Ut(o, m)).run() : l().command(() => {
    const L = u().wrapInList(m, n), S = R.filter((z) => h.includes(z.type.name));
    return o.ensureMarks(S), L ? !0 : d.clearNodes();
  }).wrapInList(m, n).command(() => Dt(o, m)).command(() => Ut(o, m)).run();
}, pc = (r, e = {}, t = {}) => ({ state: n, commands: a }) => {
  const { extendEmptyMarkRange: o = !1 } = t, i = de(r, n.schema);
  return tc(n, i, e) ? a.unsetMark(i, { extendEmptyMarkRange: o }) : a.setMark(i, e);
}, fc = (r, e, t = {}) => ({ state: n, commands: a }) => {
  const o = V(r, n.schema), i = V(e, n.schema), s = hr(n, o, t);
  let l;
  return n.selection.$anchor.sameParent(n.selection.$head) && (l = n.selection.$anchor.parent.attrs), s ? a.setNode(i, l) : a.setNode(o, { ...l, ...t });
}, hc = (r, e = {}) => ({ state: t, commands: n }) => {
  const a = V(r, t.schema);
  return hr(t, a, e) ? n.lift(a) : n.wrapIn(a, e);
}, mc = () => ({ state: r, dispatch: e }) => {
  const t = r.plugins;
  for (let n = 0; n < t.length; n += 1) {
    const a = t[n];
    let o;
    if (a.spec.isInputRules && (o = a.getState(r))) {
      if (e) {
        const i = r.tr, s = o.transform;
        for (let l = s.steps.length - 1; l >= 0; l -= 1)
          i.step(s.steps[l].invert(s.docs[l]));
        if (o.text) {
          const l = i.doc.resolve(o.from).marks();
          i.replaceWith(o.from, o.to, r.schema.text(o.text, l));
        } else
          i.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, gc = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, { empty: n, ranges: a } = t;
  return n || e && a.forEach((o) => {
    r.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, bc = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  var o;
  const { extendEmptyMarkRange: i = !1 } = e, { selection: s } = t, l = de(r, n.schema), { $from: d, empty: u, ranges: p } = s;
  if (!a)
    return !0;
  if (u && i) {
    let { from: h, to: m } = s;
    const v = (o = d.marks().find((y) => y.type === l)) === null || o === void 0 ? void 0 : o.attrs, g = Ma(d, l, v);
    g && (h = g.from, m = g.to), t.removeMark(h, m, l);
  } else
    p.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, yc = (r, e = {}) => ({ tr: t, state: n, dispatch: a }) => {
  let o = null, i = null;
  const s = Pa(typeof r == "string" ? r : r.name, n.schema);
  return s ? (s === "node" && (o = V(r, n.schema)), s === "mark" && (i = de(r, n.schema)), a && t.selection.ranges.forEach((l) => {
    const d = l.$from.pos, u = l.$to.pos;
    let p, h, m, v;
    t.selection.empty ? n.doc.nodesBetween(d, u, (g, y) => {
      o && o === g.type && (m = Math.max(y, d), v = Math.min(y + g.nodeSize, u), p = y, h = g);
    }) : n.doc.nodesBetween(d, u, (g, y) => {
      y < d && o && o === g.type && (m = Math.max(y, d), v = Math.min(y + g.nodeSize, u), p = y, h = g), y >= d && y <= u && (o && o === g.type && t.setNodeMarkup(y, void 0, {
        ...g.attrs,
        ...e
      }), i && g.marks.length && g.marks.forEach((b) => {
        if (i === b.type) {
          const N = Math.max(y, d), A = Math.min(y + g.nodeSize, u);
          t.addMark(N, A, i.create({
            ...b.attrs,
            ...e
          }));
        }
      }));
    }), h && (p !== void 0 && t.setNodeMarkup(p, void 0, {
      ...h.attrs,
      ...e
    }), i && h.marks.length && h.marks.forEach((g) => {
      i === g.type && t.addMark(m, v, i.create({
        ...g.attrs,
        ...e
      }));
    }));
  }), !0) : !1;
}, vc = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const a = V(r, t.schema);
  return Vs(a, e)(t, n);
}, wc = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const a = V(r, t.schema);
  return qs(a, e)(t, n);
};
var xc = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: il,
  clearContent: sl,
  clearNodes: ll,
  command: cl,
  createParagraphNear: dl,
  cut: ul,
  deleteCurrentNode: pl,
  deleteNode: fl,
  deleteRange: hl,
  deleteSelection: ml,
  enter: gl,
  exitCode: bl,
  extendMarkRange: yl,
  first: vl,
  focus: kl,
  forEach: Cl,
  insertContent: Nl,
  insertContentAt: Tl,
  joinBackward: Ml,
  joinDown: Il,
  joinForward: Ol,
  joinItemBackward: Ll,
  joinItemForward: Rl,
  joinTextblockBackward: Pl,
  joinTextblockForward: Fl,
  joinUp: El,
  keyboardShortcut: Bl,
  lift: zl,
  liftEmptyBlock: Hl,
  liftListItem: jl,
  newlineInCode: Dl,
  resetAttributes: Ul,
  scrollIntoView: _l,
  selectAll: Vl,
  selectNodeBackward: ql,
  selectNodeForward: Jl,
  selectParentNode: Wl,
  selectTextblockEnd: Kl,
  selectTextblockStart: Gl,
  setContent: Xl,
  setMark: nc,
  setMeta: ac,
  setNode: oc,
  setNodeSelection: ic,
  setTextSelection: sc,
  sinkListItem: lc,
  splitBlock: cc,
  splitListItem: dc,
  toggleList: uc,
  toggleMark: pc,
  toggleNode: fc,
  toggleWrap: hc,
  undoInputRule: mc,
  unsetAllMarks: gc,
  unsetMark: bc,
  updateAttributes: yc,
  wrapIn: vc,
  wrapInList: wc
});
Q.create({
  name: "commands",
  addCommands() {
    return {
      ...xc
    };
  }
});
Q.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new Ee({
        key: new Ie("tiptapDrop"),
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
Q.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Ee({
        key: new Ie("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const kc = new Ie("focusEvents");
Q.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: r } = this;
    return [
      new Ee({
        key: kc,
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
Q.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const r = () => this.editor.commands.first(({ commands: i }) => [
      () => i.undoInputRule(),
      // maybe convert first text block node to default node
      () => i.command(({ tr: s }) => {
        const { selection: l, doc: d } = s, { empty: u, $anchor: p } = l, { pos: h, parent: m } = p, v = p.parent.isTextblock && h > 0 ? s.doc.resolve(h - 1) : p, g = v.parent.type.spec.isolating, y = p.pos - p.parentOffset, b = g && v.parent.childCount === 1 ? y === p.pos : E.atStart(d).from === h;
        return !u || !m.type.isTextblock || m.textContent.length || !b || b && p.parent.type.name === "paragraph" ? !1 : i.clearNodes();
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
    return ot() || Ra() ? o : a;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new Ee({
        key: new Ie("clearDocument"),
        appendTransaction: (r, e, t) => {
          if (r.some((g) => g.getMeta("composition")))
            return;
          const n = r.some((g) => g.docChanged) && !e.doc.eq(t.doc), a = r.some((g) => g.getMeta("preventClearDocument"));
          if (!n || a)
            return;
          const { empty: o, from: i, to: s } = e.selection, l = E.atStart(e.doc).from, d = E.atEnd(e.doc).to;
          if (o || !(i === l && s === d) || !Fa(t.doc))
            return;
          const h = t.tr, m = Ta({
            state: t,
            transaction: h
          }), { commands: v } = new Zs({
            editor: this.editor,
            state: m
          });
          if (v.clearNodes(), !!h.steps.length)
            return h;
        }
      })
    ];
  }
});
Q.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new Ee({
        key: new Ie("tiptapPaste"),
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
Q.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Ee({
        key: new Ie("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class Tt {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = ne(Z(this, "addOptions", {
      name: this.name
    }))), this.storage = ne(Z(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Tt(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => fr(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new Tt(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = ne(Z(t, "addOptions", {
      name: t.name
    })), t.storage = ne(Z(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
let Cc = class {
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
    var t, n, a, o, i, s, l;
    const { view: d } = this.editor, u = e.target, p = u.nodeType === 3 ? (t = u.parentElement) === null || t === void 0 ? void 0 : t.closest("[data-drag-handle]") : u.closest("[data-drag-handle]");
    if (!this.dom || !((n = this.contentDOM) === null || n === void 0) && n.contains(u) || !p)
      return;
    let h = 0, m = 0;
    if (this.dom !== p) {
      const N = this.dom.getBoundingClientRect(), A = p.getBoundingClientRect(), R = (a = e.offsetX) !== null && a !== void 0 ? a : (o = e.nativeEvent) === null || o === void 0 ? void 0 : o.offsetX, P = (i = e.offsetY) !== null && i !== void 0 ? i : (s = e.nativeEvent) === null || s === void 0 ? void 0 : s.offsetY;
      h = A.x - N.x + R, m = A.y - N.y + P;
    }
    const v = this.dom.cloneNode(!0);
    (l = e.dataTransfer) === null || l === void 0 || l.setDragImage(v, h, m);
    const g = this.getPos();
    if (typeof g != "number")
      return;
    const y = I.create(d.state.doc, g), b = d.state.tr.setSelection(y);
    d.dispatch(b);
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
    const { isEditable: l } = this.editor, { isDragging: d } = this, u = !!this.node.type.spec.draggable, p = I.isSelectable(this.node), h = e.type === "copy", m = e.type === "paste", v = e.type === "cut", g = e.type === "mousedown";
    if (!u && p && o && e.target === this.dom && e.preventDefault(), u && o && !d && e.target === this.dom)
      return e.preventDefault(), !1;
    if (u && l && !d && g) {
      const y = n.closest("[data-drag-handle]");
      y && (this.dom === y || this.dom.contains(y)) && (this.isDragging = !0, document.addEventListener("dragend", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("drop", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("mouseup", () => {
        this.isDragging = !1;
      }, { once: !0 }));
    }
    return !(d || i || h || m || v || g && p);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(e) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.dom.contains(e.target) && e.type === "childList" && (ot() || Qt()) && this.editor.isFocused && [
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
var $a = { exports: {} }, _t = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ln;
function Nc() {
  if (ln) return _t;
  ln = 1;
  var r = D;
  function e(p, h) {
    return p === h && (p !== 0 || 1 / p === 1 / h) || p !== p && h !== h;
  }
  var t = typeof Object.is == "function" ? Object.is : e, n = r.useState, a = r.useEffect, o = r.useLayoutEffect, i = r.useDebugValue;
  function s(p, h) {
    var m = h(), v = n({ inst: { value: m, getSnapshot: h } }), g = v[0].inst, y = v[1];
    return o(function() {
      g.value = m, g.getSnapshot = h, l(g) && y({ inst: g });
    }, [p, m, h]), a(function() {
      return l(g) && y({ inst: g }), p(function() {
        l(g) && y({ inst: g });
      });
    }, [p]), i(m), m;
  }
  function l(p) {
    var h = p.getSnapshot;
    p = p.value;
    try {
      var m = h();
      return !t(p, m);
    } catch {
      return !0;
    }
  }
  function d(p, h) {
    return h();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? d : s;
  return _t.useSyncExternalStore = r.useSyncExternalStore !== void 0 ? r.useSyncExternalStore : u, _t;
}
$a.exports = Nc();
var Ba = $a.exports;
const Sc = (...r) => (e) => {
  r.forEach((t) => {
    typeof t == "function" ? t(e) : t && (t.current = e);
  });
}, Ac = ({ contentComponent: r }) => {
  const e = Ba.useSyncExternalStore(r.subscribe, r.getSnapshot, r.getServerSnapshot);
  return D.createElement(D.Fragment, null, Object.values(e));
};
function Tc() {
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
        [t]: oo.createPortal(n.reactElement, n.element, t)
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
class Ec extends D.Component {
  constructor(e) {
    var t;
    super(e), this.editorContentRef = D.createRef(), this.initialized = !1, this.state = {
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
      }), e.contentComponent = Tc(), this.state.hasContentComponentInitialized || (this.unsubscribeToContentComponent = e.contentComponent.subscribe(() => {
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
    return D.createElement(
      D.Fragment,
      null,
      D.createElement("div", { ref: Sc(t, this.editorContentRef), ...n }),
      (e == null ? void 0 : e.contentComponent) && D.createElement(Ac, { contentComponent: e.contentComponent })
    );
  }
}
const Ic = tr((r, e) => {
  const t = D.useMemo(() => Math.floor(Math.random() * 4294967295).toString(), [r.editor]);
  return D.createElement(Ec, {
    key: t,
    innerRef: e,
    ...r
  });
});
D.memo(Ic);
var Vt = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cn;
function Mc() {
  if (cn) return Vt;
  cn = 1;
  var r = D, e = Ba;
  function t(d, u) {
    return d === u && (d !== 0 || 1 / d === 1 / u) || d !== d && u !== u;
  }
  var n = typeof Object.is == "function" ? Object.is : t, a = e.useSyncExternalStore, o = r.useRef, i = r.useEffect, s = r.useMemo, l = r.useDebugValue;
  return Vt.useSyncExternalStoreWithSelector = function(d, u, p, h, m) {
    var v = o(null);
    if (v.current === null) {
      var g = { hasValue: !1, value: null };
      v.current = g;
    } else g = v.current;
    v = s(function() {
      function b(L) {
        if (!N) {
          if (N = !0, A = L, L = h(L), m !== void 0 && g.hasValue) {
            var S = g.value;
            if (m(S, L)) return R = S;
          }
          return R = L;
        }
        if (S = R, n(A, L)) return S;
        var z = h(L);
        return m !== void 0 && m(S, z) ? S : (A = L, R = z);
      }
      var N = !1, A, R, P = p === void 0 ? null : p;
      return [function() {
        return b(u());
      }, P === null ? void 0 : function() {
        return b(P());
      }];
    }, [u, p, h, m]);
    var y = a(d, v[0], v[1]);
    return i(function() {
      g.hasValue = !0, g.value = y;
    }, [y]), l(y), y;
  }, Vt;
}
Mc();
const Oc = mn({
  editor: null
});
Oc.Consumer;
const za = mn({
  onDragStart: void 0
}), Lc = () => ao(za), ue = D.forwardRef((r, e) => {
  const { onDragStart: t } = Lc(), n = r.as || "div";
  return (
    // @ts-ignore
    D.createElement(n, { ...r, ref: e, "data-node-view-wrapper": "", onDragStart: t, style: {
      whiteSpace: "normal",
      ...r.style
    } })
  );
});
function dn(r) {
  return !!(typeof r == "function" && r.prototype && r.prototype.isReactComponent);
}
function un(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.forward_ref)" || r.$$typeof.description === "react.forward_ref"));
}
function Rc(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.memo)" || r.$$typeof.description === "react.memo"));
}
function Pc(r) {
  if (dn(r) || un(r))
    return !0;
  if (Rc(r)) {
    const e = r.type;
    if (e)
      return dn(e) || un(e);
  }
  return !1;
}
function Fc() {
  try {
    if (Pr)
      return parseInt(Pr.split(".")[0], 10) >= 19;
  } catch {
  }
  return !1;
}
class $c {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(e, { editor: t, props: n = {}, as: a = "div", className: o = "" }) {
    this.ref = null, this.id = Math.floor(Math.random() * 4294967295).toString(), this.component = e, this.editor = t, this.props = n, this.element = document.createElement(a), this.element.classList.add("react-renderer"), o && this.element.classList.add(...o.split(" ")), this.editor.isInitialized ? io(() => {
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
    const t = this.component, n = this.props, a = this.editor, o = Fc(), i = Pc(t), s = { ...n };
    s.ref && !(o || i) && delete s.ref, !s.ref && (o || i) && (s.ref = (l) => {
      this.ref = l;
    }), this.reactElement = D.createElement(t, { ...s }), (e = a == null ? void 0 : a.contentComponent) === null || e === void 0 || e.setRenderer(this.id, this);
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
class Bc extends Cc {
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
      updateAttributes: (d = {}) => this.updateAttributes(d),
      deleteNode: () => this.deleteNode(),
      ref: ro()
    };
    if (!this.component.displayName) {
      const d = (u) => u.charAt(0).toUpperCase() + u.substring(1);
      this.component.displayName = d(this.extension.name);
    }
    const a = { onDragStart: this.onDragStart.bind(this), nodeViewContentRef: (d) => {
      d && this.contentDOMElement && d.firstChild !== this.contentDOMElement && (d.hasAttribute("data-node-view-wrapper") && d.removeAttribute("data-node-view-wrapper"), d.appendChild(this.contentDOMElement));
    } }, o = this.component, i = no((d) => D.createElement(za.Provider, { value: a }, gt(o, d)));
    i.displayName = "ReactNodeView";
    let s = this.node.isInline ? "span" : "div";
    this.options.as && (s = this.options.as);
    const { className: l = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.renderer = new $c(i, {
      editor: this.editor,
      props: e,
      as: s,
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
        const t = this.editor.extensionManager.attributes, n = el(this.node, t);
        e = this.options.attrs({ node: this.node, HTMLAttributes: n });
      } else
        e = this.options.attrs;
      this.renderer.updateAttributes(e);
    }
  }
}
function zc(r, e) {
  return (t) => t.editor.contentComponent ? new Bc(r, t, e) : {};
}
function pe({
  subId: r,
  defaultAttrs: e,
  view: t
}) {
  const n = `${So}/${r}`, a = Tn(r.replace(/-([a-z])/g, (o, i) => i.toUpperCase()));
  return Tt.create({
    name: a,
    group: "block",
    atom: !0,
    selectable: !0,
    draggable: !0,
    addAttributes() {
      return {
        attrs: {
          default: e,
          parseHTML: (o) => re(o.getAttribute("data-attrs") ?? "", e),
          renderHTML: (o) => ({
            "data-attrs": An(o.attrs ?? e)
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
        Ea(o, { "data-cms-block": n })
      ];
    },
    addNodeView() {
      return zc((o) => {
        const i = o.node.attrs.attrs ?? e;
        return /* @__PURE__ */ c(t, { attrs: i, updateAttrs: (l) => {
          o.updateAttributes({ attrs: { ...i, ...l } });
        }, selected: o.selected });
      });
    }
  });
}
function fe(r) {
  return Tn(r.replace(/-([a-z])/g, (e, t) => t.toUpperCase()));
}
const gr = "hero-overlay", We = fe(gr), Et = {
  imageUrl: "",
  imageAlt: "",
  eyebrow: "",
  title: "",
  titleItalicTail: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: ""
};
function Hc({ attrs: r, selected: e }) {
  const { t } = B("theme-storefront");
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(nr, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.heroOverlay.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.heroOverlay.untitled") })
        ] })
      ] })
    }
  );
}
function jc({ editor: r }) {
  const e = r.getAttributes(We), t = { ...Et, ...e.attrs ?? {} };
  function n(a) {
    r.chain().updateAttributes(We, { attrs: { ...t, ...a } }).run();
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Background image URL" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "url",
          className: "input",
          placeholder: "https://…",
          value: t.imageUrl ?? "",
          onChange: (a) => n({ imageUrl: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Image alt" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.imageAlt ?? "",
          onChange: (a) => n({ imageAlt: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.eyebrow ?? "",
          onChange: (a) => n({ eyebrow: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Title" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.title ?? "",
            onChange: (a) => n({ title: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Italic tail" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            placeholder: "e.g. living stem.",
            value: t.titleItalicTail ?? "",
            onChange: (a) => n({ titleItalicTail: a.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Subtitle" }),
      /* @__PURE__ */ c(
        "textarea",
        {
          className: "input",
          rows: 3,
          value: t.subtitle ?? "",
          onChange: (a) => n({ subtitle: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Primary CTA label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.primaryCtaLabel ?? "",
            onChange: (a) => n({ primaryCtaLabel: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Primary CTA link" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            placeholder: "/catalog.html",
            value: t.primaryCtaHref ?? "",
            onChange: (a) => n({ primaryCtaHref: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Secondary CTA label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.secondaryCtaLabel ?? "",
            onChange: (a) => n({ secondaryCtaLabel: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Secondary CTA link" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.secondaryCtaHref ?? "",
            onChange: (a) => n({ secondaryCtaHref: a.target.value })
          }
        )
      ] })
    ] })
  ] });
}
const Dc = pe({
  subId: gr,
  defaultAttrs: Et,
  view: Hc
}), Uc = {
  id: `storefront/${gr}`,
  nodeName: We,
  titleKey: "blocks.heroOverlay.title",
  namespace: "theme-storefront",
  icon: nr,
  category: "layout",
  extensions: [Dc],
  insert: async (r, e) => {
    const t = e.pickMedia ? await e.pickMedia() : null;
    r.focus().insertContent({
      type: We,
      attrs: {
        attrs: t ? { ...Et, imageUrl: t.url, imageAlt: t.alt ?? "" } : Et
      }
    }).run();
  },
  isActive: (r) => r.isActive(We),
  inspector: (r) => /* @__PURE__ */ c(jc, { editor: r.editor })
}, br = "categories-bento", Ke = fe(br), _c = {
  imageUrl: "",
  imageAlt: "",
  label: "",
  ctaLabel: "Shop now",
  ctaHref: "",
  size: "small"
}, yr = {
  eyebrow: "",
  title: "Curated collections",
  subtitle: "",
  viewAllLabel: "",
  viewAllHref: "",
  cards: []
};
function Vc({ attrs: r, selected: e }) {
  var a;
  const { t } = B("theme-storefront"), n = ((a = r.cards) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(Fn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.categoriesBento.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50", children: t("blocks.categoriesBento.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function qc({ editor: r }) {
  const e = r.getAttributes(Ke), t = { ...yr, ...e.attrs ?? {} }, n = t.cards ?? [];
  function a(u) {
    r.chain().updateAttributes(Ke, { attrs: { ...t, ...u } }).run();
  }
  function o(u) {
    a({ cards: u });
  }
  function i() {
    o([...n, { ..._c }]);
  }
  function s(u) {
    o(n.filter((p, h) => h !== u));
  }
  function l(u, p) {
    const h = u + p;
    if (h < 0 || h >= n.length) return;
    const m = n.slice();
    [m[u], m[h]] = [m[h], m[u]], o(m);
  }
  function d(u, p) {
    o(n.map((h, m) => m === u ? { ...h, ...p } : h));
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.eyebrow ?? "",
          onChange: (u) => a({ eyebrow: u.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Title" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.title ?? "",
          onChange: (u) => a({ title: u.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Subtitle" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.subtitle ?? "",
          onChange: (u) => a({ subtitle: u.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "View-all label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.viewAllLabel ?? "",
            onChange: (u) => a({ viewAllLabel: u.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "View-all link" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.viewAllHref ?? "",
            onChange: (u) => a({ viewAllHref: u.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "border-t border-surface-200 pt-3 mt-3 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ f("span", { className: "label !mb-0", children: [
          "Bento cards (",
          n.length,
          ")"
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: i,
            className: "text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700",
            children: [
              /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
              " Add card"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "space-y-3", children: n.map((u, p) => /* @__PURE__ */ f(
        "div",
        {
          className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700",
          children: [
            /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ f("span", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: [
                "Card ",
                p + 1
              ] }),
              /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(p, -1),
                    className: "p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
                    title: "Move up",
                    children: /* @__PURE__ */ c(vi, { className: "h-3.5 w-3.5" })
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(p, 1),
                    className: "p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
                    title: "Move down",
                    children: /* @__PURE__ */ c(yi, { className: "h-3.5 w-3.5" })
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => s(p),
                    className: "p-1 text-red-500 hover:text-red-700",
                    title: "Remove",
                    children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "Image URL",
                value: u.imageUrl,
                onChange: (h) => d(p, { imageUrl: h.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "Image alt",
                value: u.imageAlt,
                onChange: (h) => d(p, { imageAlt: h.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "Label",
                value: u.label,
                onChange: (h) => d(p, { label: h.target.value })
              }
            ),
            /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ c(
                "input",
                {
                  type: "text",
                  className: "input",
                  placeholder: "CTA label",
                  value: u.ctaLabel,
                  onChange: (h) => d(p, { ctaLabel: h.target.value })
                }
              ),
              /* @__PURE__ */ c(
                "input",
                {
                  type: "text",
                  className: "input",
                  placeholder: "CTA link",
                  value: u.ctaHref,
                  onChange: (h) => d(p, { ctaHref: h.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ f(
              "select",
              {
                className: "input",
                value: u.size,
                onChange: (h) => d(p, { size: h.target.value }),
                children: [
                  /* @__PURE__ */ c("option", { value: "large", children: "Large (8 cols)" }),
                  /* @__PURE__ */ c("option", { value: "small", children: "Small (4 cols)" })
                ]
              }
            )
          ]
        },
        p
      )) })
    ] })
  ] });
}
const Jc = pe({
  subId: br,
  defaultAttrs: yr,
  view: Vc
}), Wc = {
  id: `storefront/${br}`,
  nodeName: Ke,
  titleKey: "blocks.categoriesBento.title",
  namespace: "theme-storefront",
  icon: Fn,
  category: "layout",
  extensions: [Jc],
  insert: async (r) => {
    r.focus().insertContent({ type: Ke, attrs: { attrs: yr } }).run();
  },
  isActive: (r) => r.isActive(Ke),
  inspector: (r) => /* @__PURE__ */ c(qc, { editor: r.editor })
}, vr = "journal-feature", Ge = fe(vr), It = {
  imageUrl: "",
  imageAlt: "",
  eyebrow: "",
  title: "",
  titleItalicTail: "",
  subtitle: "",
  ctaLabel: "",
  ctaHref: ""
};
function Kc({ attrs: r, selected: e }) {
  const { t } = B("theme-storefront");
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(Pn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.journalFeature.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.journalFeature.untitled") })
        ] })
      ] })
    }
  );
}
function Gc({ editor: r }) {
  const e = r.getAttributes(Ge), t = { ...It, ...e.attrs ?? {} };
  function n(a) {
    r.chain().updateAttributes(Ge, { attrs: { ...t, ...a } }).run();
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Image URL" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "url",
          className: "input",
          value: t.imageUrl ?? "",
          onChange: (a) => n({ imageUrl: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Image alt" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.imageAlt ?? "",
          onChange: (a) => n({ imageAlt: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.eyebrow ?? "",
          onChange: (a) => n({ eyebrow: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Title" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.title ?? "",
            onChange: (a) => n({ title: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Italic tail" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.titleItalicTail ?? "",
            onChange: (a) => n({ titleItalicTail: a.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Subtitle" }),
      /* @__PURE__ */ c(
        "textarea",
        {
          className: "input",
          rows: 3,
          value: t.subtitle ?? "",
          onChange: (a) => n({ subtitle: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "CTA label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaLabel ?? "",
            onChange: (a) => n({ ctaLabel: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "CTA link" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaHref ?? "",
            onChange: (a) => n({ ctaHref: a.target.value })
          }
        )
      ] })
    ] })
  ] });
}
const Yc = pe({
  subId: vr,
  defaultAttrs: It,
  view: Kc
}), Xc = {
  id: `storefront/${vr}`,
  nodeName: Ge,
  titleKey: "blocks.journalFeature.title",
  namespace: "theme-storefront",
  icon: Pn,
  category: "layout",
  extensions: [Yc],
  insert: async (r, e) => {
    const t = e.pickMedia ? await e.pickMedia() : null;
    r.focus().insertContent({
      type: Ge,
      attrs: {
        attrs: t ? { ...It, imageUrl: t.url, imageAlt: t.alt ?? "" } : It
      }
    }).run();
  },
  isActive: (r) => r.isActive(Ge),
  inspector: (r) => /* @__PURE__ */ c(Gc, { editor: r.editor })
}, wr = "newsletter", Ye = fe(wr), xr = {
  variant: "card",
  eyebrow: "",
  title: "Stay in the loop",
  subtitle: "Get exclusive arrivals and seasonal tips.",
  placeholder: "Email address",
  ctaLabel: "Subscribe",
  mode: "endpoint",
  endpoint: "",
  mailto: "",
  successMessage: "",
  errorMessage: ""
};
function Zc({ attrs: r, selected: e }) {
  const { t } = B("theme-storefront");
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(Bn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.newsletter.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r.title || t("blocks.newsletter.untitled") })
        ] })
      ] })
    }
  );
}
function Qc({ editor: r }) {
  const e = r.getAttributes(Ye), t = { ...xr, ...e.attrs ?? {} };
  function n(a) {
    r.chain().updateAttributes(Ye, { attrs: { ...t, ...a } }).run();
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Variant" }),
      /* @__PURE__ */ f(
        "select",
        {
          className: "input",
          value: t.variant ?? "card",
          onChange: (a) => n({ variant: a.target.value }),
          children: [
            /* @__PURE__ */ c("option", { value: "card", children: "Card (centered, light surface)" }),
            /* @__PURE__ */ c("option", { value: "banner", children: "Banner (full-width, primary color)" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.eyebrow ?? "",
          onChange: (a) => n({ eyebrow: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Title" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.title ?? "",
          onChange: (a) => n({ title: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Subtitle" }),
      /* @__PURE__ */ c(
        "textarea",
        {
          className: "input",
          rows: 2,
          value: t.subtitle ?? "",
          onChange: (a) => n({ subtitle: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Email placeholder" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.placeholder ?? "",
            onChange: (a) => n({ placeholder: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Submit label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaLabel ?? "",
            onChange: (a) => n({ ctaLabel: a.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Form mode" }),
      /* @__PURE__ */ f(
        "select",
        {
          className: "input",
          value: t.mode ?? "endpoint",
          onChange: (a) => n({ mode: a.target.value }),
          children: [
            /* @__PURE__ */ c("option", { value: "endpoint", children: "POST endpoint (Mailchimp / Buttondown / Formspree)" }),
            /* @__PURE__ */ c("option", { value: "mailto", children: "mailto: handler" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Endpoint URL" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "url",
          className: "input",
          placeholder: "https://…",
          value: t.endpoint ?? "",
          onChange: (a) => n({ endpoint: a.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Mailto address" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "email",
          className: "input",
          placeholder: "hello@your-shop.com",
          value: t.mailto ?? "",
          onChange: (a) => n({ mailto: a.target.value })
        }
      )
    ] })
  ] });
}
const ed = pe({
  subId: wr,
  defaultAttrs: xr,
  view: Zc
}), td = {
  id: `storefront/${wr}`,
  nodeName: Ye,
  titleKey: "blocks.newsletter.title",
  namespace: "theme-storefront",
  icon: Bn,
  category: "embed",
  extensions: [ed],
  insert: async (r) => {
    r.focus().insertContent({ type: Ye, attrs: { attrs: xr } }).run();
  },
  isActive: (r) => r.isActive(Ye),
  inspector: (r) => /* @__PURE__ */ c(Qc, { editor: r.editor })
}, kr = "product-info", Xe = fe(kr);
function rd({ attrs: r, selected: e }) {
  const { t } = B("theme-storefront"), n = [
    r.priceTTC > 0 ? `${r.priceTTC} ${r.currency || "EUR"}` : "",
    r.stockStatus
  ].filter(Boolean).join(" · ");
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-amber-400 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30 " + (e ? "ring-2 ring-amber-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(Dn, { className: "h-5 w-5 shrink-0 text-amber-600" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400", children: t("blocks.productInfo.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: n || t("blocks.productInfo.untitled") }),
          /* @__PURE__ */ c("p", { className: "text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1", children: t("blocks.productInfo.editorHint") })
        ] })
      ] })
    }
  );
}
function nd({ editor: r }) {
  var p;
  const e = r.getAttributes(Xe), t = {
    ...st,
    ...e.attrs ?? {}
  };
  function n(h) {
    r.chain().updateAttributes(Xe, { attrs: { ...t, ...h } }).run();
  }
  function a(h) {
    n({ variants: h });
  }
  function o() {
    a([...t.variants ?? [], { label: "", options: [""] }]);
  }
  function i(h) {
    a((t.variants ?? []).filter((m, v) => v !== h));
  }
  function s(h, m) {
    a((t.variants ?? []).map((v, g) => g === h ? { ...v, ...m } : v));
  }
  function l(h, m, v) {
    const y = t.variants[h].options.slice();
    y[m] = v, s(h, { options: y });
  }
  function d(h) {
    const m = t.variants[h];
    s(h, { options: [...m.options, ""] });
  }
  function u(h, m) {
    const v = t.variants[h];
    s(h, { options: v.options.filter((g, y) => y !== m) });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Price excl. tax" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "number",
            step: "0.01",
            className: "input",
            value: t.priceHT,
            onChange: (h) => n({ priceHT: parseFloat(h.target.value) || 0 })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Price incl. tax" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "number",
            step: "0.01",
            className: "input",
            value: t.priceTTC,
            onChange: (h) => n({ priceTTC: parseFloat(h.target.value) || 0 })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Promo (incl. tax)" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "number",
            step: "0.01",
            className: "input",
            value: t.promoTTC,
            onChange: (h) => n({ promoTTC: parseFloat(h.target.value) || 0 })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Currency (ISO 4217)" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            placeholder: "EUR",
            value: t.currency,
            onChange: (h) => n({ currency: h.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Stock status" }),
      /* @__PURE__ */ f(
        "select",
        {
          className: "input",
          value: t.stockStatus || "",
          onChange: (h) => n({ stockStatus: h.target.value }),
          children: [
            /* @__PURE__ */ c("option", { value: "", children: "—" }),
            /* @__PURE__ */ c("option", { value: "in-stock", children: "In stock" }),
            /* @__PURE__ */ c("option", { value: "low-stock", children: "Low stock" }),
            /* @__PURE__ */ c("option", { value: "out-of-stock", children: "Out of stock" }),
            /* @__PURE__ */ c("option", { value: "on-order", children: "On order" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Badges (comma-separated)" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          placeholder: "Limited Edition, New",
          value: (t.badges ?? []).join(", "),
          onChange: (h) => n({
            badges: h.target.value.split(",").map((m) => m.trim()).filter(Boolean)
          })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Primary CTA label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaPrimaryLabel,
            onChange: (h) => n({ ctaPrimaryLabel: h.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Primary CTA link" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaPrimaryHref,
            onChange: (h) => n({ ctaPrimaryHref: h.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Secondary CTA label" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaSecondaryLabel,
            onChange: (h) => n({ ctaSecondaryLabel: h.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: "Secondary CTA link" }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.ctaSecondaryHref,
            onChange: (h) => n({ ctaSecondaryHref: h.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "border-t border-surface-200 pt-3 mt-3 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ f("span", { className: "label !mb-0", children: [
          "Variants (",
          ((p = t.variants) == null ? void 0 : p.length) ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: o,
            className: "text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700",
            children: [
              /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
              " Add variant"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "space-y-3", children: (t.variants ?? []).map((h, m) => /* @__PURE__ */ f(
        "div",
        {
          className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700",
          children: [
            /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ c(
                "input",
                {
                  type: "text",
                  className: "input flex-1",
                  placeholder: "Label (e.g. Size)",
                  value: h.label,
                  onChange: (v) => s(m, { label: v.target.value })
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => i(m),
                  className: "p-1 text-red-500 hover:text-red-700",
                  title: "Remove variant",
                  children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ f("div", { className: "space-y-1", children: [
              h.options.map((v, g) => /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ c(
                  "input",
                  {
                    type: "text",
                    className: "input flex-1",
                    placeholder: "Option (e.g. Small)",
                    value: v,
                    onChange: (y) => l(m, g, y.target.value)
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => u(m, g),
                    className: "p-1 text-red-500 hover:text-red-700",
                    title: "Remove option",
                    children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
                  }
                )
              ] }, g)),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  onClick: () => d(m),
                  className: "text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700",
                  children: [
                    /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
                    " Add option"
                  ]
                }
              )
            ] })
          ]
        },
        m
      )) })
    ] })
  ] });
}
const ad = pe({
  subId: kr,
  defaultAttrs: st,
  view: rd
}), od = {
  id: `storefront/${kr}`,
  nodeName: Xe,
  titleKey: "blocks.productInfo.title",
  namespace: "theme-storefront",
  icon: Dn,
  category: "advanced",
  extensions: [ad],
  insert: async (r) => {
    r.focus().insertContent({ type: Xe, attrs: { attrs: st } }).run();
  },
  isActive: (r) => r.isActive(Xe),
  inspector: (r) => /* @__PURE__ */ c(nd, { editor: r.editor })
}, Cr = "product-gallery", Ze = fe(Cr), Mt = {
  images: [],
  primaryFeatured: !0
};
function id({ attrs: r, selected: e }) {
  var a;
  const { t } = B("theme-storefront"), n = ((a = r.images) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c($n, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.productGallery.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50", children: t("blocks.productGallery.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function sd({ editor: r }) {
  const e = r.getAttributes(Ze), t = { ...Mt, ...e.attrs ?? {} }, n = t.images ?? [];
  function a(d) {
    r.chain().updateAttributes(Ze, { attrs: { ...t, ...d } }).run();
  }
  function o(d) {
    a({ images: d });
  }
  function i() {
    o([...n, { url: "", alt: "" }]);
  }
  function s(d) {
    o(n.filter((u, p) => p !== d));
  }
  function l(d, u) {
    o(n.map((p, h) => h === d ? { ...p, ...u } : p));
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("label", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ c(
        "input",
        {
          type: "checkbox",
          checked: t.primaryFeatured,
          onChange: (d) => a({ primaryFeatured: d.target.checked })
        }
      ),
      /* @__PURE__ */ c("span", { children: "First image as featured (hero), rest as thumbnails" })
    ] }),
    /* @__PURE__ */ f("div", { className: "border-t border-surface-200 pt-3 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ f("span", { className: "label !mb-0", children: [
          "Images (",
          n.length,
          ")"
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: i,
            className: "text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700",
            children: [
              /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
              " Add image"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "space-y-2", children: n.map((d, u) => /* @__PURE__ */ f(
        "div",
        {
          className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700",
          children: [
            /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ f("span", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: [
                "Image ",
                u + 1
              ] }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => s(u),
                  className: "p-1 text-red-500 hover:text-red-700",
                  title: "Remove",
                  children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ c(
              "input",
              {
                type: "url",
                className: "input",
                placeholder: "Image URL",
                value: d.url,
                onChange: (p) => l(u, { url: p.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "Alt text",
                value: d.alt,
                onChange: (p) => l(u, { alt: p.target.value })
              }
            )
          ]
        },
        u
      )) })
    ] })
  ] });
}
const ld = pe({
  subId: Cr,
  defaultAttrs: Mt,
  view: id
}), cd = {
  id: `storefront/${Cr}`,
  nodeName: Ze,
  titleKey: "blocks.productGallery.title",
  namespace: "theme-storefront",
  icon: $n,
  category: "media",
  extensions: [ld],
  insert: async (r, e) => {
    const t = e.pickMedia ? await e.pickMedia() : null;
    r.focus().insertContent({
      type: Ze,
      attrs: {
        attrs: t ? { ...Mt, images: [{ url: t.url, alt: t.alt ?? "" }] } : Mt
      }
    }).run();
  },
  isActive: (r) => r.isActive(Ze),
  inspector: (r) => /* @__PURE__ */ c(sd, { editor: r.editor })
}, Nr = "product-features", Qe = fe(Nr), Sr = {
  features: [
    { icon: "local_shipping", label: "Fast delivery" },
    { icon: "eco", label: "Sustainably sourced" },
    { icon: "loyalty", label: "Quality guarantee" }
  ]
};
function dd({ attrs: r, selected: e }) {
  var a;
  const { t } = B("theme-storefront"), n = ((a = r.features) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(Hn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.productFeatures.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50", children: t("blocks.productFeatures.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function ud({ editor: r }) {
  const e = r.getAttributes(Qe), t = { ...Sr, ...e.attrs ?? {} }, n = t.features ?? [];
  function a(d) {
    r.chain().updateAttributes(Qe, { attrs: { ...t, ...d } }).run();
  }
  function o(d) {
    a({ features: d });
  }
  function i() {
    o([...n, { icon: "", label: "" }]);
  }
  function s(d) {
    o(n.filter((u, p) => p !== d));
  }
  function l(d, u) {
    o(n.map((p, h) => h === d ? { ...p, ...u } : p));
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ f("span", { className: "label !mb-0", children: [
        "Features (",
        n.length,
        ")"
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: i,
          className: "text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700",
          children: [
            /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
            " Add feature"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c("div", { className: "space-y-2", children: n.map((d, u) => /* @__PURE__ */ f(
      "div",
      {
        className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700",
        children: [
          /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ f("span", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: [
              "Feature ",
              u + 1
            ] }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                onClick: () => s(u),
                className: "p-1 text-red-500 hover:text-red-700",
                title: "Remove",
                children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ c(
            "input",
            {
              type: "text",
              className: "input",
              placeholder: "Icon (e.g. local_shipping)",
              value: d.icon,
              onChange: (p) => l(u, { icon: p.target.value })
            }
          ),
          /* @__PURE__ */ c(
            "input",
            {
              type: "text",
              className: "input",
              placeholder: "Label",
              value: d.label,
              onChange: (p) => l(u, { label: p.target.value })
            }
          )
        ]
      },
      u
    )) }),
    /* @__PURE__ */ c("p", { className: "text-xs text-surface-500", children: "Use any Material Symbols Outlined glyph name — e.g. local_shipping, eco, loyalty, verified, spa." })
  ] });
}
const pd = pe({
  subId: Nr,
  defaultAttrs: Sr,
  view: dd
}), fd = {
  id: `storefront/${Nr}`,
  nodeName: Qe,
  titleKey: "blocks.productFeatures.title",
  namespace: "theme-storefront",
  icon: Hn,
  category: "layout",
  extensions: [pd],
  insert: async (r) => {
    r.focus().insertContent({ type: Qe, attrs: { attrs: Sr } }).run();
  },
  isActive: (r) => r.isActive(Qe),
  inspector: (r) => /* @__PURE__ */ c(ud, { editor: r.editor })
}, Ar = "reviews-list", et = fe(Ar), hd = {
  authorName: "",
  authorRole: "Verified buyer",
  authorInitials: "",
  authorAvatarUrl: "",
  rating: 5,
  text: "",
  dateLabel: ""
}, Tr = {
  eyebrow: "",
  title: "Client impressions",
  writeReviewLabel: "",
  writeReviewHref: "",
  reviews: []
};
function md({ attrs: r, selected: e }) {
  var a;
  const { t } = B("theme-storefront"), n = ((a = r.reviews) == null ? void 0 : a.length) ?? 0;
  return /* @__PURE__ */ c(
    ue,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ c(jn, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ c("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.reviewsList.title") }),
          /* @__PURE__ */ c("p", { className: "text-sm text-surface-900 dark:text-surface-50", children: t("blocks.reviewsList.preview", { count: n }) })
        ] })
      ] })
    }
  );
}
function gd({ editor: r }) {
  const e = r.getAttributes(et), t = { ...Tr, ...e.attrs ?? {} }, n = t.reviews ?? [];
  function a(d) {
    r.chain().updateAttributes(et, { attrs: { ...t, ...d } }).run();
  }
  function o(d) {
    a({ reviews: d });
  }
  function i() {
    o([...n, { ...hd }]);
  }
  function s(d) {
    o(n.filter((u, p) => p !== d));
  }
  function l(d, u) {
    o(n.map((p, h) => h === d ? { ...p, ...u } : p));
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.eyebrow,
          onChange: (d) => a({ eyebrow: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ c("label", { className: "label", children: "Title" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          className: "input",
          value: t.title,
          onChange: (d) => a({ title: d.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: '"Write a review" label' }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            value: t.writeReviewLabel,
            onChange: (d) => a({ writeReviewLabel: d.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ c("label", { className: "label", children: '"Write a review" link' }),
        /* @__PURE__ */ c(
          "input",
          {
            type: "text",
            className: "input",
            placeholder: "mailto: or https://…",
            value: t.writeReviewHref,
            onChange: (d) => a({ writeReviewHref: d.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "border-t border-surface-200 pt-3 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ f("span", { className: "label !mb-0", children: [
          "Reviews (",
          n.length,
          ")"
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: i,
            className: "text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700",
            children: [
              /* @__PURE__ */ c(oe, { className: "h-3.5 w-3.5" }),
              " Add review"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "space-y-3", children: n.map((d, u) => /* @__PURE__ */ f(
        "div",
        {
          className: "rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700",
          children: [
            /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ f("span", { className: "text-xs font-semibold text-surface-600 dark:text-surface-300", children: [
                "Review ",
                u + 1
              ] }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => s(u),
                  className: "p-1 text-red-500 hover:text-red-700",
                  title: "Remove",
                  children: /* @__PURE__ */ c(te, { className: "h-3.5 w-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ c(
                "input",
                {
                  type: "text",
                  className: "input",
                  placeholder: "Author name",
                  value: d.authorName,
                  onChange: (p) => l(u, { authorName: p.target.value })
                }
              ),
              /* @__PURE__ */ c(
                "input",
                {
                  type: "text",
                  className: "input",
                  placeholder: "Role",
                  value: d.authorRole,
                  onChange: (p) => l(u, { authorRole: p.target.value })
                }
              ),
              /* @__PURE__ */ c(
                "input",
                {
                  type: "text",
                  className: "input",
                  placeholder: "Initials (auto from name)",
                  value: d.authorInitials,
                  onChange: (p) => l(u, { authorInitials: p.target.value })
                }
              ),
              /* @__PURE__ */ c(
                "input",
                {
                  type: "number",
                  step: "0.5",
                  min: "0",
                  max: "5",
                  className: "input",
                  placeholder: "Rating 0-5",
                  value: d.rating,
                  onChange: (p) => l(u, { rating: parseFloat(p.target.value) || 0 })
                }
              )
            ] }),
            /* @__PURE__ */ c(
              "input",
              {
                type: "url",
                className: "input",
                placeholder: "Avatar URL (optional)",
                value: d.authorAvatarUrl,
                onChange: (p) => l(u, { authorAvatarUrl: p.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "textarea",
              {
                className: "input",
                rows: 3,
                placeholder: "Review text",
                value: d.text,
                onChange: (p) => l(u, { text: p.target.value })
              }
            ),
            /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: "Date label (e.g. May 12, 2024)",
                value: d.dateLabel,
                onChange: (p) => l(u, { dateLabel: p.target.value })
              }
            )
          ]
        },
        u
      )) })
    ] })
  ] });
}
const bd = pe({
  subId: Ar,
  defaultAttrs: Tr,
  view: md
}), yd = {
  id: `storefront/${Ar}`,
  nodeName: et,
  titleKey: "blocks.reviewsList.title",
  namespace: "theme-storefront",
  icon: jn,
  category: "advanced",
  extensions: [bd],
  insert: async (r) => {
    r.focus().insertContent({ type: et, attrs: { attrs: Tr } }).run();
  },
  isActive: (r) => r.isActive(et),
  inspector: (r) => /* @__PURE__ */ c(gd, { editor: r.editor })
}, vd = `<div data-cms-block="storefront/product-info" data-attrs="${An(
  st
)}"></div>

`, wd = {
  id: "storefront",
  name: "Storefront",
  version: "0.1.0",
  description: "Storefront theme for storefront / e-commerce sites — Tailwind-based, sage + terracotta Material 3 palette, Playfair Display + Inter typography. Built for product catalogs with optional client-side filtering.",
  scssEntry: "theme.css",
  cssText: zr,
  jsText: Ho,
  jsTextPosts: jo,
  jsTextCatalog: Do,
  i18n: { en: li, fr: ci, de: di, es: ui, nl: pi, pt: fi, ko: hi },
  defaultPostMarkdown: {
    post: vd
  },
  settings: {
    navLabelKey: "title",
    defaultConfig: Nn,
    component: Ii
  },
  // Bakes the user's Style overrides (palette + font pair) into the
  // CSS uploaded by `Sync theme assets`.
  compileCss: (r) => vn(zr, r.style),
  // Image catalog used by the upload pipeline. Mirrors corporate +
  // magazine so a site switching between themes doesn't have to
  // re-process its media library.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      small: { width: 480, height: 600, fit: "cover" },
      medium: { width: 800, height: 1e3, fit: "cover" },
      large: { width: 1600, height: 1200, fit: "cover" }
    },
    defaultFormat: "medium"
  },
  templates: {
    base: Sn,
    home: Po,
    single: Fo,
    category: $o,
    author: Bo,
    notFound: zo
  },
  // Editor blocks. Phase 2 wires the four user-insertable home
  // blocks. Phase 4 will append productInfo, productGallery,
  // productFeatures, reviewsList. (productGrid is a render helper
  // called by HomeTemplate, not a user-insertable block.)
  blocks: [
    Uc,
    Wc,
    Xc,
    td,
    od,
    cd,
    fd,
    yd
  ],
  register(r, e) {
    var a, o, i;
    r.addFilter(
      "post.html.body",
      (s, ...l) => Xi(s, l[0])
    );
    const t = (s, ...l) => {
      const d = l[0];
      d && Wt(d);
    };
    r.addAction("publish.complete", t), r.addAction("post.unpublished", t), r.addAction("post.deleted", t), ((a = e == null ? void 0 : e.settings.themeConfigs) != null && a.storefront ? ((i = (o = (e == null ? void 0 : e.settings.themeConfigs).storefront) == null ? void 0 : o.catalog) == null ? void 0 : i.enabled) === !0 : !1) && r.registerRegenerationTarget({
      id: "storefront/catalog",
      i18nNamespace: "theme-storefront",
      labelKey: "regenerationTarget.catalog.label",
      descriptionKey: "regenerationTarget.catalog.description",
      priority: 250,
      run: async (s, l) => {
        l({ level: "info", message: "Regenerating catalog products.json + page…" }), await Wt(s), l({ level: "success", message: "Catalog regenerated." });
      }
    }), r.addFilter("menu.json.resolved", (s, ...l) => {
      var y;
      const d = l[0];
      if (!d || d.settings.activeThemeId !== "storefront") return s;
      const u = (y = d.settings.themeConfigs) == null ? void 0 : y.storefront, p = u == null ? void 0 : u.catalog;
      if (!(p != null && p.enabled) || !p.addToMenu) return s;
      const h = p.menuLabel || "Catalog", m = `/${(p.slug || "catalog.html").replace(/^\/+/, "")}`, v = {
        id: `storefront-catalog-${m}`,
        label: h,
        href: m,
        children: []
      };
      return s.header.find(
        (b) => b.href === m || b.label && b.label === h
      ) ? s : { ...s, header: [...s.header, v] };
    });
  }
};
export {
  wd as manifest
};
