import { pathToPublicUrl, type SiteSettings } from "@flexweg/cms-runtime";
import type { MultilangConfig } from "../types";
import { getMultilangConfig, isPrimaryLanguage } from "./config";
import { lookupAlternates } from "./pathRegistry";

// Minimal scoped CSS for the switcher. Themes can override via their
// own `.cms-langswitch` rules if they want a custom look. Kept tiny
// to minimise the per-page byte cost.
const SWITCHER_CSS = `
.cms-langswitch{display:inline-flex;align-items:center;gap:6px;font-size:12px;line-height:1;letter-spacing:0.05em;}
.cms-langswitch a,.cms-langswitch span{padding:4px 8px;border-radius:4px;text-decoration:none;color:inherit;text-transform:uppercase;font-weight:600;}
.cms-langswitch a{opacity:0.55;}
.cms-langswitch a:hover{opacity:1;}
.cms-langswitch__current{background:currentColor;color:transparent;position:relative;}
.cms-langswitch__current::after{content:attr(data-label);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--cms-langswitch-on,white);mix-blend-mode:difference;}
`.replace(/\s+/g, " ").trim();

function escapeJson(value: string): string {
  return value.replace(/[<>&\u2028\u2029]/g, (c) => {
    if (c === "<") return "\\u003c";
    if (c === ">") return "\\u003e";
    if (c === "&") return "\\u0026";
    if (c === "\u2028") return "\\u2028";
    return "\\u2029";
  });
}

// Builds the `<script>` block injected via `page.body.end`. The
// script reads inline data + DOM containers and populates them on
// load. Plays well with the theme's existing posts-loader.js
// (they share no globals).
export function buildSwitcherScript(args: {
  config: MultilangConfig;
  settings: SiteSettings;
  currentPath: string;
}): string {
  const { config, settings, currentPath } = args;

  // No secondary languages → no switcher to render. Skip entirely
  // (don't even emit a script tag). The corresponding requirement
  // from the settings UI: "render only when at least one language
  // other than the primary is defined".
  if (config.enabledLanguages.length === 0) return "";
  if (!config.showHeaderSwitcher && !config.showFooterSwitcher) return "";

  const alts = lookupAlternates(currentPath);
  if (!alts || alts.alternates.length < 2) return "";

  const baseUrl = (settings.baseUrl || "").replace(/\/+$/, "");
  // Emit hrefs as ABSOLUTE site-rooted paths (leading slash) so
  // they're resolved against the site root, not the current
  // page's URL. Without the slash, /fr/news/hello.html → click
  // FR → href "fr/index.html" would resolve to /fr/news/fr/...
  const items = alts.alternates.map((alt) => ({
    lang: alt.language,
    label: alt.language.toUpperCase(),
    href: baseUrl
      ? pathToPublicUrl(baseUrl, alt.path)
      : `/${alt.path.replace(/^\/+/, "")}`,
  }));

  const currentLang = alts.language;
  const primary = config.primaryLanguage;

  const data = {
    current: currentLang,
    primary,
    items,
    showHeader: config.showHeaderSwitcher !== false,
    showFooter: config.showFooterSwitcher === true,
  };
  const dataJson = escapeJson(JSON.stringify(data));

  // The runtime hydrator. ES5 syntax + var to be safe on the public
  // side regardless of the theme's JS toolchain. CSS is appended
  // once per page; if the theme already styles `.cms-langswitch`,
  // its rules take precedence via specificity / order.
  const runtime = `
(function(){
  try {
    var D = ${dataJson};
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
      s.textContent = ${JSON.stringify(SWITCHER_CSS)};
      document.head.appendChild(s);
    }
    if (document.readyState !== 'loading') paint();
    else document.addEventListener('DOMContentLoaded', paint);
  } catch (e) {}
})();`;

  return `<script>${runtime}</script>`;
}

// Quick helper to read current path's alternates count without
// running the script — used internally to short-circuit emission
// when there's nothing to switch to.
export function shouldEmitSwitcher(settings: SiteSettings, currentPath: string): boolean {
  const config = getMultilangConfig(settings);
  if (config.enabledLanguages.length === 0) return false;
  if (!isPrimaryLanguage(config, config.primaryLanguage)) return true;
  const alts = lookupAlternates(currentPath);
  return Boolean(alts && alts.alternates.length >= 2);
}
