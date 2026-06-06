import { canonicalUrl as _, getActiveTheme as G, renderMarkdown as ve, applyFilters as Se, markdownToPlainText as se, renderPageToHtml as ae, renderHome as Te, updatePost as re, pathToPublicUrl as B, deleteFile as X, publishPostsJson as xe, publishAuthorsJson as Pe, useCmsData as ie, toast as J, isValidSlug as oe, fetchAllPosts as K } from "@flexweg/cms-runtime";
import { jsxs as v, jsx as m } from "react/jsx-runtime";
import { useState as Y } from "react";
import { useTranslation as le } from "react-i18next";
const $e = { title: "Multi-language", intro: "Configure additional languages. Each enabled language gets its own URL prefix and per-post translations.", save: "Save settings", saving: "Saving…", saved: "Saved.", primaryLanguage: { title: "Primary language", help: "Pages in this language live at the root URL (no language prefix). All other languages render under /<lang>/.", siteHint: 'Site language is currently "{{lang}}".' }, enabledLanguages: { title: "Additional languages", help: "Click a language to toggle it. Enabled languages appear in the editor's Translations tab + on the public site under /<lang>/." }, homePages: { title: "Home page per language", help: "Optional: pick a static page (in the corresponding language) to render at /<lang>/. Leave empty for a basic latest-posts list.", none: "— Latest posts —" }, switcher: { title: "Language switcher", help: "Show a language switcher on the public site. Themes must include a [data-cms-langswitch] container in their Header / Footer for the switcher to appear (built-in themes already do).", header: "Show switcher in the site header", footer: "Show switcher in the site footer" } }, Me = { label: "Translations", noLanguages: "No additional languages are configured for this site.", configureLanguages: "Configure languages", editPrimaryInMain: "Edit the primary language in the main editor (title, slug, content above).", save: "Save translations", saving: "Saving…", saved: "Translations saved.", duplicate: "Duplicate from primary", invalidSlug: "Invalid slug for {{lang}}.", fields: { title: "Title", slug: "Slug", slugHelp: "Lower-case ASCII + dashes only.", excerpt: "Excerpt", content: "Content (Markdown)", contentHelp: "Plain Markdown. Theme blocks (Hero, embeds, etc.) embedded in the primary language do NOT replicate automatically — paste your translated body here.", seo: "SEO", seoTitle: "SEO title", seoDescription: "Meta description" } }, ke = { title: "Translations", name: "Name", slug: "Slug", invalidSlug: "Invalid slug", seoTitle: "SEO meta title", seoDescription: "SEO meta description", noLanguages: "Enable secondary languages in the Multi-language plugin settings to translate this term." }, Ce = {
  settings: $e,
  tab: Me,
  termSection: ke
}, Ne = { title: "Multilingue", intro: "Configurez les langues supplémentaires. Chaque langue activée obtient son préfixe d'URL et des traductions par contenu.", save: "Sauvegarder", saving: "Sauvegarde…", saved: "Sauvegardé.", primaryLanguage: { title: "Langue principale", help: "Les pages dans cette langue se trouvent à la racine du site (sans préfixe). Les autres langues sont sous /<lang>/.", siteHint: "La langue du site est actuellement « {{lang}} »." }, enabledLanguages: { title: "Langues supplémentaires", help: "Cliquez une langue pour l'activer. Les langues activées apparaissent dans l'onglet Traductions de l'éditeur et sur le site public sous /<lang>/." }, homePages: { title: "Page d'accueil par langue", help: "Optionnel : choisissez une page statique (dans la langue correspondante) pour servir d'accueil à /<lang>/. Sinon, une liste des derniers articles est rendue.", none: "— Derniers articles —" }, switcher: { title: "Sélecteur de langue", help: "Affiche un sélecteur de langue sur le site public. Les thèmes doivent intégrer un conteneur [data-cms-langswitch] dans leur Header / Footer pour que le sélecteur apparaisse (les thèmes intégrés le font déjà).", header: "Afficher le sélecteur dans l'en-tête du site", footer: "Afficher le sélecteur dans le pied de page du site" } }, Ie = { label: "Traductions", noLanguages: "Aucune langue supplémentaire n'est configurée.", configureLanguages: "Configurer les langues", editPrimaryInMain: "Modifiez la langue principale dans l'éditeur (titre, slug, contenu ci-dessus).", save: "Sauvegarder les traductions", saving: "Sauvegarde…", saved: "Traductions sauvegardées.", duplicate: "Dupliquer depuis la langue principale", invalidSlug: "Slug invalide pour {{lang}}.", fields: { title: "Titre", slug: "Slug", slugHelp: "Caractères ASCII minuscules + tirets uniquement.", excerpt: "Extrait", content: "Contenu (Markdown)", contentHelp: "Markdown simple. Les blocs de thème (Hero, embeds, etc.) intégrés dans la langue principale ne sont PAS répliqués automatiquement — collez votre contenu traduit ici.", seo: "SEO", seoTitle: "Titre SEO", seoDescription: "Méta description" } }, Ae = { title: "Traductions", name: "Nom", slug: "Slug", invalidSlug: "Slug invalide", seoTitle: "Titre meta SEO", seoDescription: "Description meta SEO", noLanguages: "Activez des langues secondaires dans les réglages du plugin Multilingue pour traduire ce terme." }, Ee = {
  settings: Ne,
  tab: Ie,
  termSection: Ae
}, H = {
  primaryLanguage: "en",
  enabledLanguages: [],
  homePages: {},
  menuTranslations: {},
  showHeaderSwitcher: !0,
  showFooterSwitcher: !1
}, Ue = "flexweg-multilang";
function b(n) {
  var t;
  const e = (t = n.pluginConfigs) == null ? void 0 : t[Ue];
  return {
    ...H,
    // Default the primary language to the site's BCP-47 language tag
    // so a fresh install picks the right value without manual setup.
    primaryLanguage: (e == null ? void 0 : e.primaryLanguage) || (n.language || "en").split("-")[0],
    enabledLanguages: (e == null ? void 0 : e.enabledLanguages) ?? [],
    homePages: (e == null ? void 0 : e.homePages) ?? {},
    menuTranslations: (e == null ? void 0 : e.menuTranslations) ?? {},
    showHeaderSwitcher: (e == null ? void 0 : e.showHeaderSwitcher) ?? H.showHeaderSwitcher,
    showFooterSwitcher: (e == null ? void 0 : e.showFooterSwitcher) ?? H.showFooterSwitcher
  };
}
function y(n, e) {
  return n.primaryLanguage === e;
}
function F(n) {
  const { post: e, trans: t, primaryTermTrans: s, primaryTermSlug: a, language: r, config: o } = n, i = y(o, r) ? "" : `${r}/`;
  if (e.type === "page")
    return `${i}${t.slug}.html`;
  const l = (s == null ? void 0 : s.slug) ?? a;
  return l ? `${i}${l}/${t.slug}.html` : `${i}${t.slug}.html`;
}
function V(n, e, t, s) {
  if (n.type !== "category")
    throw new Error(`buildLocalizedTermUrl: term type "${n.type}" is not supported (categories only).`);
  return `${y(s, t) ? "" : `${t}/`}${e.slug}/index.html`;
}
function z(n, e) {
  return y(e, n) ? "index.html" : `${n}/index.html`;
}
function C(n, e) {
  const t = n.translations, s = t == null ? void 0 : t[e];
  return !s || !s.slug || !s.title ? null : s;
}
function $(n, e) {
  const t = n.translations, s = t == null ? void 0 : t[e];
  return !s || !s.slug || !s.name ? null : s;
}
function O(n) {
  return {
    slug: n.slug,
    title: n.title,
    contentMarkdown: n.contentMarkdown,
    excerpt: n.excerpt,
    seo: n.seo
  };
}
function R(n) {
  return {
    slug: n.slug,
    name: n.name,
    description: n.description,
    seo: n.seo
  };
}
function Q(n) {
  const e = n.replace("-", "_");
  return e.includes("_") ? e : {
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
    de: "de_DE",
    nl: "nl_NL",
    pt: "pt_PT",
    ko: "ko_KR",
    it: "it_IT",
    ja: "ja_JP"
  }[e] ?? `${e}_${e.toUpperCase()}`;
}
function k(n) {
  return n.replace(/[&<>"']/g, (e) => {
    switch (e) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });
}
function j(n, e, t) {
  const s = e.replace(/\/+$/, "");
  if (!s) return "";
  const a = [];
  for (const o of n.alternates) {
    const i = _(s, o.path);
    a.push(
      `<link rel="alternate" hreflang="${k(o.language)}" href="${k(i)}" />`
    );
  }
  const r = n.alternates.find((o) => o.language === t.primaryLanguage);
  if (r) {
    const o = _(s, r.path);
    a.push(`<link rel="alternate" hreflang="x-default" href="${k(o)}" />`);
  }
  a.push(
    `<meta property="og:locale" content="${k(Q(n.current.language))}" />`
  );
  for (const o of n.alternates)
    o.language !== n.current.language && a.push(
      `<meta property="og:locale:alternate" content="${k(Q(o.language))}" />`
    );
  return a.join(`
`);
}
function ce(n, e, t) {
  const s = e.replace(/\/+$/, "");
  if (!s || n.alternates.length === 0) return "";
  const a = [];
  for (const o of n.alternates) {
    const i = _(s, o.path);
    a.push(
      `    <xhtml:link rel="alternate" hreflang="${k(o.language)}" href="${k(i)}"/>`
    );
  }
  const r = n.alternates.find((o) => o.language === t.primaryLanguage);
  if (r) {
    const o = _(s, r.path);
    a.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${k(o)}"/>`
    );
  }
  return a.join(`
`);
}
function q(n, e, t) {
  const s = [];
  for (const a of [t.primaryLanguage, ...t.enabledLanguages]) {
    if (s.some((c) => c.language === a)) continue;
    const r = a === t.primaryLanguage ? O(n) : C(n, a);
    if (!r) continue;
    const o = n.primaryTermId ? e.find((c) => c.id === n.primaryTermId) : void 0, i = o ? a === t.primaryLanguage ? R(o) : $(o, a) ?? void 0 : void 0;
    if (o && !i && !y(t, a)) continue;
    const l = F({
      post: n,
      trans: r,
      primaryTermTrans: i,
      primaryTermSlug: o == null ? void 0 : o.slug,
      language: a,
      config: t
    });
    s.push({ language: a, path: l });
  }
  return s;
}
function ue(n, e) {
  const t = [];
  for (const s of [e.primaryLanguage, ...e.enabledLanguages]) {
    if (t.some((r) => r.language === s)) continue;
    const a = s === e.primaryLanguage ? R(n) : $(n, s);
    a && n.type === "category" && t.push({ language: s, path: V(n, a, s, e) });
  }
  return t;
}
function ge(n) {
  const e = [];
  for (const t of [n.primaryLanguage, ...n.enabledLanguages])
    e.some((s) => s.language === t) || e.push({ language: t, path: z(t, n) });
  return e;
}
function W(n) {
  return (n.baseUrl || "").replace(/\/+$/, "");
}
const U = /* @__PURE__ */ new Map();
function I(n, e, t, s, a) {
  U.clear();
  const r = W(s);
  if (!r) return;
  for (const i of [...n, ...e]) {
    if (i.status !== "online") continue;
    const l = q(i, t, a);
    if (l.length !== 0)
      for (const c of l) {
        const g = j(
          { current: { path: c.path, language: c.language }, alternates: l },
          r,
          a
        );
        U.set(c.path, g);
      }
  }
  for (const i of t) {
    if (i.type !== "category") continue;
    const l = ue(i, a);
    if (l.length !== 0)
      for (const c of l) {
        const g = j(
          { current: { path: c.path, language: c.language }, alternates: l },
          r,
          a
        );
        U.set(c.path, g);
      }
  }
  const o = ge(a);
  for (const i of o) {
    const l = j(
      { current: { path: i.path, language: i.language }, alternates: o },
      r,
      a
    );
    U.set(i.path, l);
  }
}
function De(n) {
  const e = n.replace(/^\/+/, "");
  return U.get(e) ?? U.get(`/${e}`) ?? "";
}
const D = /* @__PURE__ */ new Map();
function A(n, e, t, s) {
  D.clear();
  for (const r of [...n, ...e]) {
    if (r.status !== "online") continue;
    const o = q(r, t, s);
    if (o.length !== 0)
      for (const i of o)
        D.set(i.path, { language: i.language, alternates: o });
  }
  for (const r of t) {
    if (r.type !== "category") continue;
    const o = ue(r, s);
    if (o.length !== 0)
      for (const i of o)
        D.set(i.path, { language: i.language, alternates: o });
  }
  const a = ge(s);
  for (const r of a)
    D.set(r.path, { language: r.language, alternates: a });
}
function Fe(n) {
  const e = n.replace(/^\/+/, "");
  return D.get(e) ?? D.get(`/${e}`) ?? null;
}
function de(n) {
  var s;
  const e = G(n.settings.activeThemeId);
  if (!e.settings) return;
  const t = (s = n.settings.themeConfigs) == null ? void 0 : s[e.id];
  return {
    ...e.settings.defaultConfig,
    ...t ?? {}
  };
}
function He(n, e, t) {
  const s = y(t, e), a = s ? "" : `${e}/`, r = { ...n.settings, language: e }, o = n.terms.map((g) => {
    if (g.type !== "category") return g;
    const d = s ? R(g) : $(g, e);
    return d ? {
      ...g,
      name: d.name,
      // Prefix with language code so buildPostUrl produces
      // <lang>/<term-slug>/<post-slug>.html for posts and
      // <lang>/<term-slug>/index.html for the archive itself.
      slug: `${a}${d.slug}`,
      description: d.description
    } : g;
  }), i = (g) => {
    const d = s ? O(g) : C(g, e);
    if (!d) return null;
    const p = g.type !== "post" || !g.primaryTermId;
    return {
      ...g,
      title: d.title,
      slug: p ? `${a}${d.slug}` : d.slug,
      contentMarkdown: d.contentMarkdown,
      excerpt: d.excerpt,
      seo: d.seo
    };
  }, l = n.posts.map(i).filter((g) => g !== null), c = n.pages.map(i).filter((g) => g !== null);
  return {
    ...n,
    settings: r,
    posts: l,
    pages: c,
    terms: o
  };
}
async function _e(n) {
  var i;
  const { language: e, ctx: t, config: s } = n, a = (i = s.homePages) == null ? void 0 : i[e], r = a ? { ...t.settings, homeMode: "static-page", homePageId: a } : t.settings, o = He({ ...t, settings: r }, e, s);
  return Te(o, {
    homePath: z(e, s),
    currentLocale: e
  });
}
async function ze(n) {
  var x, P, T, N, M;
  const { post: e, trans: t, termTrans: s, language: a, ctx: r, config: o } = n, i = G(r.settings.activeThemeId), l = {
    settings: { ...r.settings, language: a },
    resolvedMenus: { header: [], footer: [] },
    themeCssPath: `theme-assets/${r.settings.activeThemeId}.css`,
    themeConfig: de(r),
    homePath: y(o, a) ? "/index.html" : `/${a}/index.html`
  };
  let c = ve(t.contentMarkdown);
  c = await Se("post.html.body", c, e);
  const g = r.terms.filter((E) => e.termIds.includes(E.id) && E.type === "tag"), d = e.primaryTermId ? r.terms.find((E) => E.id === e.primaryTermId && E.type === "category") : void 0, p = r.authorLookup(e.authorId), u = e.heroMediaId ? r.media.get(e.heroMediaId) : void 0, f = ((x = t.seo) == null ? void 0 : x.description) ?? se(t.contentMarkdown, 160);
  let h = d;
  if (d && s) {
    const Le = y(o, a) ? "" : `${a}/`;
    h = {
      ...d,
      name: s.name,
      slug: `${Le}${s.slug}`,
      description: s.description
    };
  }
  const S = F({
    post: e,
    trans: t,
    primaryTermTrans: s,
    primaryTermSlug: d == null ? void 0 : d.slug,
    language: a,
    config: o
  }), L = {
    site: l,
    post: {
      ...e,
      title: t.title,
      slug: t.slug,
      contentMarkdown: t.contentMarkdown,
      excerpt: t.excerpt,
      seo: t.seo
    },
    bodyHtml: c,
    author: p,
    hero: u ? {
      alt: u.alt,
      caption: u.caption,
      default: ((T = (P = u.formats) == null ? void 0 : P[u.defaultFormat ?? ""]) == null ? void 0 : T.url) ?? u.url ?? "",
      formats: u.formats ?? {}
    } : void 0,
    primaryTerm: h,
    tags: g
  }, w = {
    site: l,
    pageTitle: ((N = t.seo) == null ? void 0 : N.title) ?? t.title,
    pageDescription: f || void 0,
    ogImage: (M = t.seo) == null ? void 0 : M.ogImage,
    currentPath: S,
    currentLocale: a
  };
  return ae({
    base: i.templates.base,
    baseProps: w,
    template: i.templates.single,
    templateProps: L
  });
}
function Oe(n) {
  var h, S, L;
  const { term: e, termTrans: t, language: s, ctx: a, config: r } = n, o = G(a.settings.activeThemeId), i = {
    settings: { ...a.settings, language: s },
    resolvedMenus: { header: [], footer: [] },
    themeCssPath: `theme-assets/${a.settings.activeThemeId}.css`,
    themeConfig: de(a),
    homePath: y(r, s) ? "/index.html" : `/${s}/index.html`
  }, l = {
    ...e,
    name: t.name,
    slug: t.slug,
    description: t.description
  }, c = y(r, s), g = c ? "" : `${s}/`, d = a.posts.filter((w) => w.status === "online" && w.primaryTermId === e.id).filter((w) => c ? !0 : C(w, s) !== null).map((w) => {
    var N, M;
    const x = c ? O(w) : C(w, s), P = F({
      post: w,
      trans: x,
      primaryTermTrans: t,
      primaryTermSlug: e.slug,
      language: s,
      config: r
    }), T = w.heroMediaId ? a.media.get(w.heroMediaId) : void 0;
    return {
      ...w,
      title: x.title,
      slug: x.slug,
      excerpt: x.excerpt,
      url: P,
      hero: T ? {
        alt: T.alt,
        caption: T.caption,
        default: ((M = (N = T.formats) == null ? void 0 : N[T.defaultFormat ?? ""]) == null ? void 0 : M.url) ?? T.url ?? "",
        formats: T.formats ?? {}
      } : void 0,
      category: {
        name: t.name,
        url: `/${g}${t.slug}/index.html`
      }
    };
  }), p = {
    site: i,
    term: l,
    posts: d,
    categoryRssUrl: void 0,
    archivesLink: void 0,
    allCategories: [],
    popularTags: []
  }, u = V(e, t, s, r), f = {
    site: i,
    pageTitle: ((h = t.seo) == null ? void 0 : h.title) || t.name,
    pageDescription: ((S = t.seo) == null ? void 0 : S.description) || t.description,
    ogImage: (L = t.seo) == null ? void 0 : L.ogImage,
    currentPath: u,
    currentLocale: s
  };
  return ae({
    base: o.templates.base,
    baseProps: f,
    template: o.templates.category,
    templateProps: p
  });
}
async function Re(n, e, t) {
  const s = b(t.settings);
  if (s.enabledLanguages.length === 0) return n;
  I(t.posts, t.pages, t.terms, t.settings, s), A(t.posts, t.pages, t.terms, s);
  const a = [...n], r = {}, o = e.primaryTermId ? t.terms.find((i) => i.id === e.primaryTermId && i.type === "category") : void 0;
  for (const i of s.enabledLanguages) {
    if (y(s, i)) continue;
    const l = C(e, i);
    if (!l) continue;
    const c = o ? $(o, i) : void 0;
    if (o && !c) continue;
    const g = F({
      post: e,
      trans: l,
      primaryTermTrans: c ?? void 0,
      primaryTermSlug: o == null ? void 0 : o.slug,
      language: i,
      config: s
    }), d = await ze({
      post: e,
      trans: l,
      termTrans: c ?? void 0,
      language: i,
      ctx: t,
      config: s
    });
    a.push({ path: g, html: d }), r[i] = g;
  }
  try {
    await re(e.id, { lastPublishedPathsByLocale: r });
  } catch {
  }
  return a;
}
async function qe(n, e) {
  const t = b(e.settings);
  if (t.enabledLanguages.length === 0) return n;
  I(e.posts, e.pages, e.terms, e.settings, t), A(e.posts, e.pages, e.terms, t);
  const s = [...n];
  for (const a of t.enabledLanguages) {
    if (y(t, a)) continue;
    const r = z(a, t), o = await _e({ language: a, ctx: e, config: t });
    s.push({ path: r, html: o });
    for (const i of e.terms) {
      if (i.type !== "category") continue;
      const l = $(i, a);
      if (!l) continue;
      const c = V(i, l, a, t), g = Oe({ term: i, termTrans: l, language: a, ctx: e, config: t });
      s.push({ path: c, html: g });
    }
  }
  return s;
}
function je(n) {
  return { ...n, "xmlns:xhtml": "http://www.w3.org/1999/xhtml" };
}
function Je(n, e) {
  if (!e.entity) return n;
  const t = We(), s = Xe();
  if (!t || !s) return n;
  const a = q(e.entity, s, t);
  if (a.length === 0) return n;
  const r = e.baseUrl.replace(/\/+$/, "");
  return n + ce(
    { current: { path: e.path, language: t.primaryLanguage }, alternates: a },
    r,
    t
  ) + `
`;
}
function Ge(n, e) {
  var r, o, i, l, c, g;
  const t = b(e.settings);
  if (t.enabledLanguages.length === 0) return n;
  const s = W(e.settings);
  if (!s) return n;
  const a = [...n];
  for (const d of [...e.posts, ...e.pages]) {
    if (d.status !== "online") continue;
    const p = ((o = (r = d.createdAt) == null ? void 0 : r.toMillis) == null ? void 0 : o.call(r)) ?? ((l = (i = d.publishedAt) == null ? void 0 : i.toMillis) == null ? void 0 : l.call(i)) ?? Date.now();
    if (new Date(p).getUTCFullYear() !== e.year) continue;
    const u = q(d, e.terms, t);
    if (u.length !== 0)
      for (const f of u)
        y(t, f.language) || a.push({
          path: f.path,
          lastmodMs: ((g = (c = d.updatedAt) == null ? void 0 : c.toMillis) == null ? void 0 : g.call(c)) ?? p,
          extraInnerXml: ce(
            { current: { path: f.path, language: f.language }, alternates: u },
            s,
            t
          )
        });
  }
  return a;
}
function Be(n, e) {
  var r;
  const t = (r = e.settings.pluginConfigs) == null ? void 0 : r["flexweg-sitemaps"];
  if (!(t != null && t.newsEnabled)) return n;
  const s = b(e.settings);
  if (s.enabledLanguages.length === 0) return n;
  const a = [...n];
  for (const o of s.enabledLanguages)
    y(s, o) || a.push({ path: `sitemaps/sitemap-news-${o}.xml` });
  return a;
}
function Ve(n, e) {
  var i, l, c, g, d, p, u, f;
  const t = b(e.settings);
  if (t.enabledLanguages.length === 0 || !W(e.settings)) return n;
  const a = e.config.newsWindowDays || 2, r = Date.now() - a * 24 * 60 * 60 * 1e3, o = [...n];
  for (const h of t.enabledLanguages) {
    if (y(t, h)) continue;
    const S = [];
    for (const L of [...e.posts, ...e.pages]) {
      if (L.status !== "online") continue;
      const w = ((l = (i = L.updatedAt) == null ? void 0 : i.toMillis) == null ? void 0 : l.call(i)) ?? ((g = (c = L.publishedAt) == null ? void 0 : c.toMillis) == null ? void 0 : g.call(c)) ?? ((p = (d = L.createdAt) == null ? void 0 : d.toMillis) == null ? void 0 : p.call(d)) ?? Date.now();
      if (w < r) continue;
      const x = C(L, h);
      if (!x) continue;
      const P = L.primaryTermId ? e.terms.find((M) => M.id === L.primaryTermId && M.type === "category") : void 0, T = P ? $(P, h) ?? void 0 : void 0, N = F({
        post: L,
        trans: x,
        primaryTermTrans: T,
        primaryTermSlug: P == null ? void 0 : P.slug,
        language: h,
        config: t
      });
      S.push({
        path: N,
        title: x.title,
        createdAtMs: ((f = (u = L.createdAt) == null ? void 0 : u.toMillis) == null ? void 0 : f.call(u)) ?? w,
        updatedAtMs: w
      });
    }
    o.push({
      language: h,
      path: `sitemaps/sitemap-news-${h}.xml`,
      entities: S
    });
  }
  return o;
}
let pe = null, me = null;
function fe(n) {
  pe = n;
}
function he(n) {
  me = n;
}
function We() {
  return pe;
}
function Xe() {
  return me;
}
const Ke = 20;
function Ye(n) {
  return `${n}/rss.xml`;
}
function Qe(n) {
  return `${n}/feed.xml`;
}
function Ze(n, e) {
  return `${n}/${e}/${e}.xml`;
}
function et(n) {
  const e = b(n.settings);
  if (e.enabledLanguages.length === 0) return [];
  const t = [];
  for (const s of e.enabledLanguages) {
    if (y(e, s)) continue;
    const a = tt(n.posts, n.terms, s, e, n.baseUrl);
    t.push({
      language: s,
      path: Ye(s),
      channelTitle: `${n.settings.title || "Site"} — ${s.toUpperCase()}`,
      channelLink: B(n.baseUrl, z(s, e)),
      channelDescription: n.settings.description || n.settings.title || "",
      items: a
    });
  }
  return t;
}
async function ye(n) {
  const e = b(n.settings);
  for (const t of e.enabledLanguages)
    if (!y(e, t)) {
      try {
        await X(Qe(t));
      } catch {
      }
      for (const s of n.terms) {
        if (s.type !== "category") continue;
        const a = $(s, t);
        if (a)
          try {
            await X(Ze(t, a.slug));
          } catch {
          }
      }
    }
}
function tt(n, e, t, s, a) {
  return n.filter((r) => r.status === "online").map((r) => nt(r, e, t, s, a)).filter((r) => r !== null).sort((r, o) => o.pubDateMs - r.pubDateMs).slice(0, Ke);
}
function nt(n, e, t, s, a) {
  var p, u, f, h, S, L;
  const r = C(n, t);
  if (!r) return null;
  const o = n.primaryTermId ? e.find((w) => w.id === n.primaryTermId && w.type === "category") : void 0, i = o ? $(o, t) : void 0;
  if (o && !i) return null;
  const l = F({
    post: n,
    trans: r,
    primaryTermTrans: i ?? void 0,
    primaryTermSlug: o == null ? void 0 : o.slug,
    language: t,
    config: s
  }), c = B(a, l), g = (r.excerpt && r.excerpt.trim().length > 0 ? r.excerpt : se(r.contentMarkdown, 300)).trim(), d = ((u = (p = n.publishedAt) == null ? void 0 : p.toMillis) == null ? void 0 : u.call(p)) ?? ((h = (f = n.updatedAt) == null ? void 0 : f.toMillis) == null ? void 0 : h.call(f)) ?? ((L = (S = n.createdAt) == null ? void 0 : S.toMillis) == null ? void 0 : L.call(S)) ?? Date.now();
  return {
    title: r.title,
    link: c,
    guid: c,
    description: g,
    pubDateMs: d,
    category: i == null ? void 0 : i.name
  };
}
function st(n, e, t) {
  const s = y(t, e), a = s ? "" : `${e}/`, r = n.terms.map((i) => {
    if (i.type !== "category") return i;
    const l = s ? R(i) : $(i, e);
    return l ? {
      ...i,
      name: l.name,
      slug: `${a}${l.slug}`,
      description: l.description
    } : i;
  }), o = (i) => {
    const l = s ? O(i) : C(i, e);
    if (!l) return null;
    const c = i.type !== "post" || !i.primaryTermId;
    return {
      ...i,
      title: l.title,
      slug: c ? `${a}${l.slug}` : l.slug,
      contentMarkdown: l.contentMarkdown,
      excerpt: l.excerpt,
      seo: l.seo
    };
  };
  return {
    posts: n.posts.map(o).filter((i) => i !== null),
    pages: n.pages.map(o).filter((i) => i !== null),
    terms: r
  };
}
async function we(n) {
  const e = b(n.settings);
  if (e.enabledLanguages.length !== 0)
    for (const t of e.enabledLanguages) {
      if (y(e, t)) continue;
      const s = st(n, t, e), a = { ...n.settings, language: t }, r = `${t}/data/posts.json`, o = `${t}/data/authors.json`;
      try {
        await xe(
          a,
          s.posts,
          s.pages,
          s.terms,
          n.media,
          r
        );
      } catch {
      }
      try {
        await Pe(
          n.users,
          n.media,
          s.posts,
          s.pages,
          o
        );
      } catch {
      }
    }
}
const Z = ["en", "fr", "de", "es", "nl", "pt", "ko"];
function at({ config: n, save: e }) {
  const { t } = le("flexweg-multilang"), { settings: s, pages: a } = ie(), [r, o] = Y({
    ...H,
    ...n
  }), [i, l] = Y(!1);
  async function c() {
    l(!0);
    try {
      await e(r), J.success(t("settings.saved"));
    } catch (u) {
      J.error(u.message || "Save failed");
    } finally {
      l(!1);
    }
  }
  function g(u) {
    o((f) => {
      const S = f.enabledLanguages.includes(u) ? f.enabledLanguages.filter((L) => L !== u) : [...f.enabledLanguages, u];
      return { ...f, enabledLanguages: S };
    });
  }
  function d(u, f) {
    o((h) => ({
      ...h,
      homePages: { ...h.homePages ?? {}, [u]: f || "" }
    }));
  }
  const p = (s.language || "en").split("-")[0];
  return /* @__PURE__ */ v("div", { className: "space-y-6", children: [
    /* @__PURE__ */ v("div", { children: [
      /* @__PURE__ */ m("h2", { className: "font-semibold text-lg", children: t("settings.title") }),
      /* @__PURE__ */ m("p", { className: "text-sm text-surface-500 dark:text-surface-400", children: t("settings.intro") })
    ] }),
    /* @__PURE__ */ v("section", { className: "card p-4 space-y-3", children: [
      /* @__PURE__ */ m("h3", { className: "font-medium", children: t("settings.primaryLanguage.title") }),
      /* @__PURE__ */ m("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.primaryLanguage.help") }),
      /* @__PURE__ */ v("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ m(
          "select",
          {
            className: "input max-w-[200px]",
            value: r.primaryLanguage,
            onChange: (u) => o({ ...r, primaryLanguage: u.target.value }),
            children: Z.map((u) => /* @__PURE__ */ m("option", { value: u, children: u.toUpperCase() }, u))
          }
        ),
        /* @__PURE__ */ m("span", { className: "text-[11px] text-surface-500 self-center", children: t("settings.primaryLanguage.siteHint", { lang: p }) })
      ] })
    ] }),
    /* @__PURE__ */ v("section", { className: "card p-4 space-y-3", children: [
      /* @__PURE__ */ m("h3", { className: "font-medium", children: t("settings.enabledLanguages.title") }),
      /* @__PURE__ */ m("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.enabledLanguages.help") }),
      /* @__PURE__ */ m("div", { className: "flex flex-wrap gap-2", children: Z.filter((u) => u !== r.primaryLanguage).map((u) => {
        const f = r.enabledLanguages.includes(u);
        return /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            onClick: () => g(u),
            className: "text-xs px-3 py-1.5 rounded uppercase font-medium " + (f ? "bg-surface-900 text-surface-50 dark:bg-surface-100 dark:text-surface-900" : "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300"),
            children: u
          },
          u
        );
      }) })
    ] }),
    r.enabledLanguages.length > 0 && /* @__PURE__ */ v("section", { className: "card p-4 space-y-3", children: [
      /* @__PURE__ */ m("h3", { className: "font-medium", children: t("settings.homePages.title") }),
      /* @__PURE__ */ m("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.homePages.help") }),
      /* @__PURE__ */ m("div", { className: "space-y-2", children: r.enabledLanguages.map((u) => {
        var f;
        return /* @__PURE__ */ v("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ m("span", { className: "text-[10px] uppercase font-semibold w-8", children: u }),
          /* @__PURE__ */ v(
            "select",
            {
              className: "input flex-1",
              value: ((f = r.homePages) == null ? void 0 : f[u]) ?? "",
              onChange: (h) => d(u, h.target.value),
              children: [
                /* @__PURE__ */ m("option", { value: "", children: t("settings.homePages.none") }),
                a.filter((h) => h.status === "online").map((h) => /* @__PURE__ */ m("option", { value: h.id, children: h.title }, h.id))
              ]
            }
          )
        ] }, u);
      }) })
    ] }),
    r.enabledLanguages.length > 0 && /* @__PURE__ */ v("section", { className: "card p-4 space-y-3", children: [
      /* @__PURE__ */ m("h3", { className: "font-medium", children: t("settings.switcher.title") }),
      /* @__PURE__ */ m("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("settings.switcher.help") }),
      /* @__PURE__ */ v("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ m(
          "input",
          {
            type: "checkbox",
            checked: r.showHeaderSwitcher ?? !0,
            onChange: (u) => o({ ...r, showHeaderSwitcher: u.target.checked })
          }
        ),
        /* @__PURE__ */ m("span", { children: t("settings.switcher.header") })
      ] }),
      /* @__PURE__ */ v("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ m(
          "input",
          {
            type: "checkbox",
            checked: r.showFooterSwitcher ?? !1,
            onChange: (u) => o({ ...r, showFooterSwitcher: u.target.checked })
          }
        ),
        /* @__PURE__ */ m("span", { children: t("settings.switcher.footer") })
      ] })
    ] }),
    /* @__PURE__ */ m("div", { className: "flex gap-2", children: /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "btn-primary",
        onClick: c,
        disabled: i,
        children: t(i ? "settings.saving" : "settings.save")
      }
    ) })
  ] });
}
function rt({ term: n, updateTerm: e }) {
  const { t } = le("flexweg-multilang"), { settings: s } = ie(), a = b(s);
  if (a.enabledLanguages.length === 0)
    return /* @__PURE__ */ m("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: t("termSection.noLanguages") });
  const r = n.translations ?? {};
  function o(i, l) {
    const c = {
      ...r,
      [i]: { ...r[i] ?? ee(), ...l }
    };
    e({ translations: c });
  }
  return /* @__PURE__ */ v("div", { className: "space-y-2", children: [
    /* @__PURE__ */ m("p", { className: "text-[11px] uppercase tracking-wide font-semibold text-surface-500 dark:text-surface-400", children: t("termSection.title") }),
    a.enabledLanguages.map((i) => {
      const l = r[i] ?? ee(), c = l.slug && !oe(l.slug), g = l.seo ?? {};
      function d(p) {
        o(i, { seo: { ...g, ...p } });
      }
      return /* @__PURE__ */ v("div", { className: "space-y-2 border-t border-surface-200 dark:border-surface-700 pt-2 first:border-t-0 first:pt-0", children: [
        /* @__PURE__ */ v("div", { className: "flex flex-wrap items-start gap-2", children: [
          /* @__PURE__ */ m("span", { className: "text-[10px] uppercase font-semibold w-8 pt-2 text-surface-500", children: i }),
          /* @__PURE__ */ m(
            "input",
            {
              type: "text",
              className: "input flex-1 min-w-[120px]",
              placeholder: t("termSection.name"),
              value: l.name,
              onChange: (p) => o(i, { name: p.target.value })
            }
          ),
          /* @__PURE__ */ v("div", { className: "flex-1 min-w-[120px]", children: [
            /* @__PURE__ */ m(
              "input",
              {
                type: "text",
                className: "input",
                placeholder: t("termSection.slug"),
                value: l.slug,
                onChange: (p) => o(i, { slug: p.target.value })
              }
            ),
            c && /* @__PURE__ */ m("p", { className: "text-[10px] text-red-600 mt-0.5", children: t("termSection.invalidSlug") })
          ] })
        ] }),
        /* @__PURE__ */ v("div", { className: "pl-10 space-y-1", children: [
          /* @__PURE__ */ m(
            "input",
            {
              type: "text",
              className: "input w-full",
              placeholder: t("termSection.seoTitle"),
              value: g.title ?? "",
              onChange: (p) => d({ title: p.target.value })
            }
          ),
          /* @__PURE__ */ m(
            "textarea",
            {
              className: "input w-full min-h-[60px] resize-y",
              placeholder: t("termSection.seoDescription"),
              value: g.description ?? "",
              onChange: (p) => d({ description: p.target.value })
            }
          )
        ] })
      ] }, i);
    })
  ] });
}
function ee() {
  return { slug: "", name: "", description: "" };
}
function be(n, e, t) {
  if (t)
    return {
      title: n.title,
      slug: n.slug,
      contentMarkdown: n.contentMarkdown,
      excerpt: n.excerpt,
      seo: n.seo
    };
  const s = n.translations, a = s == null ? void 0 : s[e];
  return !a || !a.title ? null : {
    title: a.title ?? "",
    slug: a.slug ?? "",
    contentMarkdown: a.contentMarkdown ?? "",
    excerpt: a.excerpt,
    seo: a.seo
  };
}
function te(n, e, t) {
  if (t) return "★";
  const s = be(n, e, !1);
  return s && s.slug && s.title ? "" : "○";
}
const it = {
  id: "flexweg-multilang/languages",
  priority: 50,
  listVariants(n, e) {
    const t = b(e.settings);
    if (t.enabledLanguages.length === 0) return [];
    const s = [], a = /* @__PURE__ */ new Set();
    s.push({
      id: t.primaryLanguage,
      label: t.primaryLanguage.toUpperCase(),
      badge: te(n, t.primaryLanguage, !0),
      primary: !0
    }), a.add(t.primaryLanguage);
    for (const r of t.enabledLanguages)
      a.has(r) || (a.add(r), s.push({
        id: r,
        label: r.toUpperCase(),
        badge: te(n, r, !1),
        primary: !1
      }));
    return s;
  },
  loadFields(n, e, t) {
    const s = b(t.settings), a = y(s, e);
    return be(n, e, a);
  },
  validate(n, e, t, s) {
    const a = b(s.settings);
    return y(a, e) ? null : t.title.trim() ? oe(t.slug) ? null : `Invalid slug for ${e.toUpperCase()}.` : `Title required for ${e.toUpperCase()}.`;
  },
  async saveFields(n, e, t, s) {
    const a = b(s.settings);
    if (y(a, e))
      return;
    const r = n.translations ?? {}, o = {
      title: t.title,
      slug: t.slug,
      contentMarkdown: t.contentMarkdown
    };
    if (t.excerpt && (o.excerpt = t.excerpt), t.seo) {
      const l = {};
      t.seo.title && (l.title = t.seo.title), t.seo.description && (l.description = t.seo.description), t.seo.ogImage && (l.ogImage = t.seo.ogImage), Object.keys(l).length > 0 && (o.seo = l);
    }
    const i = { ...r, [e]: o };
    try {
      await re(n.id, { translations: i });
    } catch (l) {
      throw J.error(l.message), l;
    }
  },
  getSlugPathPrefix(n, e, t, s) {
    var g;
    const a = b(s.settings), r = y(a, e) ? "" : `${e}/`;
    if (n.type !== "post" || !n.primaryTermId) return r;
    const o = s.terms.find((d) => d.id === n.primaryTermId);
    if (!o) return r;
    const i = o.translations, c = !y(a, e) && ((g = i == null ? void 0 : i[e]) == null ? void 0 : g.slug) || o.slug;
    return `${r}${c}/`;
  }
}, ot = `
.cms-langswitch{display:inline-flex;align-items:center;gap:6px;font-size:12px;line-height:1;letter-spacing:0.05em;}
.cms-langswitch a,.cms-langswitch span{padding:4px 8px;border-radius:4px;text-decoration:none;color:inherit;text-transform:uppercase;font-weight:600;}
.cms-langswitch a{opacity:0.55;}
.cms-langswitch a:hover{opacity:1;}
.cms-langswitch__current{background:currentColor;color:transparent;position:relative;}
.cms-langswitch__current::after{content:attr(data-label);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--cms-langswitch-on,white);mix-blend-mode:difference;}
`.replace(/\s+/g, " ").trim();
function lt(n) {
  return n.replace(/[<>&\u2028\u2029]/g, (e) => e === "<" ? "\\u003c" : e === ">" ? "\\u003e" : e === "&" ? "\\u0026" : e === "\u2028" ? "\\u2028" : "\\u2029");
}
function ct(n) {
  const { config: e, settings: t, currentPath: s } = n;
  if (e.enabledLanguages.length === 0 || !e.showHeaderSwitcher && !e.showFooterSwitcher) return "";
  const a = Fe(s);
  if (!a || a.alternates.length < 2) return "";
  const r = (t.baseUrl || "").replace(/\/+$/, ""), o = a.alternates.map((p) => ({
    lang: p.language,
    label: p.language.toUpperCase(),
    href: r ? B(r, p.path) : `/${p.path.replace(/^\/+/, "")}`
  })), i = a.language, l = e.primaryLanguage, c = {
    current: i,
    primary: l,
    items: o,
    showHeader: e.showHeaderSwitcher !== !1,
    showFooter: e.showFooterSwitcher === !0
  };
  return `<script>${`
(function(){
  try {
    var D = ${lt(JSON.stringify(c))};
    function render(host) {
      var html = '<div class="cms-langswitch" role="navigation" aria-label="Language">';
      for (var i = 0; i < D.items.length; i++) {
        var it = D.items[i];
        if (it.lang === D.current) {
          html += '<span class="cms-langswitch__current" data-label="' + it.label + '" aria-current="true">' + it.label + '</span>';
        } else {
          html += '<a href="' + it.href + '" hreflang="' + it.lang + '" rel="alternate">' + it.label + '</a>';
        }
      }
      html += '</div>';
      host.innerHTML = html;
      host.removeAttribute('data-cms-langswitch-empty');
    }
    function paint() {
      if (D.showHeader) {
        var h = document.querySelector('[data-cms-langswitch="header"]');
        if (h) render(h);
      }
      if (D.showFooter) {
        var f = document.querySelector('[data-cms-langswitch="footer"]');
        if (f) render(f);
      }
      var s = document.createElement('style');
      s.setAttribute('data-cms-langswitch-css', '');
      s.textContent = ${JSON.stringify(ot)};
      document.head.appendChild(s);
    }
    if (document.readyState !== 'loading') paint();
    else document.addEventListener('DOMContentLoaded', paint);
  } catch (e) {}
})();`}<\/script>`;
}
async function ut(n, e) {
  const t = b(e.settings);
  fe(t), he(e.terms), I(e.posts, e.pages, e.terms, e.settings, t), A(e.posts, e.pages, e.terms, t), await ye(e), await we(e);
}
async function ne(n, e) {
  const t = b(e.settings);
  fe(t), he(e.terms), I(e.posts, e.pages, e.terms, e.settings, t), A(e.posts, e.pages, e.terms, t), await ye(e), await we(e);
}
async function gt() {
  try {
    const n = window, e = n == null ? void 0 : n.__FLEXWEG_LIVE_SETTINGS__;
    if (!e) return;
    const t = b(e);
    if (t.enabledLanguages.length === 0) return;
    const [s, a] = await Promise.all([
      K({ type: "post" }),
      K({ type: "page" })
    ]);
    I(s, a, [], e, t), A(s, a, [], t);
  } catch {
  }
}
const ht = {
  id: "flexweg-multilang",
  name: "Multi-language",
  version: "1.0.0",
  description: "Multi-language site support — translated posts/pages/terms, hreflang SEO, per-language sitemap entries, per-language RSS feeds.",
  author: "Flexweg",
  i18n: { en: Ce, fr: Ee },
  settings: {
    navLabelKey: "settings.title",
    defaultConfig: H,
    component: at
  },
  register(n) {
    n.addFilter("publish.additional", async (e, t, s) => Re(
      e,
      t,
      s
    )), n.addFilter("publish.extraListings", async (e, t) => qe(
      e,
      t
    )), n.addAction("publish.before", async (e, t) => {
      const s = t, a = b(s.settings);
      I(s.posts, s.pages, s.terms, s.settings, a), A(s.posts, s.pages, s.terms, a);
    }), n.addAction("regenerate.listings.before", async (e) => {
      const t = e, s = b(t.settings);
      I(t.posts, t.pages, t.terms, t.settings, s), A(t.posts, t.pages, t.terms, s);
    }), n.addAction("publish.complete", async (e, t) => {
      await ut(e, t);
    }), n.addAction("post.unpublished", async (e, t) => {
      await ne(e, t);
    }), n.addAction("post.deleted", async (e, t) => {
      await ne(e, t);
    }), n.addFilter("page.head.extra", (e, ...t) => {
      const s = t[0];
      if (!(s != null && s.currentPath)) return e;
      const a = De(s.currentPath);
      return a ? e + (e ? `
` : "") + a : e;
    }), n.addFilter("page.body.end", (e, ...t) => {
      var o;
      const s = t[0];
      if (!(s != null && s.currentPath) || !((o = s == null ? void 0 : s.site) != null && o.settings)) return e;
      const a = b(s.site.settings), r = ct({
        config: a,
        settings: s.site.settings,
        currentPath: s.currentPath
      });
      return r ? e + (e ? `
` : "") + r : e;
    }), n.addFilter(
      "sitemap.urlset.namespaces",
      (e) => je(e)
    ), n.addFilter("sitemap.url.entry", (e, ...t) => {
      const s = t[0];
      return Je(e, s);
    }), n.addFilter("sitemap.urls.extra", (e, ...t) => {
      const s = t[0];
      return Ge(
        e,
        s
      );
    }), n.addFilter("sitemap.index.extra", (e, ...t) => {
      const s = t[0];
      return Be(
        e,
        s
      );
    }), n.addFilter("sitemap.news.locales", (e, ...t) => {
      const s = t[0];
      return Ve(
        e,
        s
      );
    }), n.addFilter("rss.site.locales", (e, ...t) => {
      const s = t[0];
      return s ? [
        ...e,
        ...et(s)
      ] : e;
    }), n.registerEditorVariantProvider(it), n.registerTermEditorSection({
      id: "flexweg-multilang/term-translations",
      termType: "all",
      priority: 50,
      component: rt
    }), gt();
  }
};
export {
  ht as default
};
