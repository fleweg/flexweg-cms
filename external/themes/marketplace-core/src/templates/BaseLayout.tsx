import type { BaseLayoutProps } from "@flexweg/cms-runtime";
import { canonicalUrl } from "@flexweg/cms-runtime";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { resolveLocale } from "../lib/locale";

// Shell. Sticky top header + persistent left sidebar (lg+) + main
// canvas. Mobile gets a bottom nav in place of the sidebar.
//
// `currentLocale` is set per-page by the publisher (and by the
// flexweg-multilang plugin's per-locale renders). It wins over the
// site-wide language for the `<html lang>` attribute and for every
// i18n lookup inside the shell components — so a French archive
// page renders the breadcrumb / nav / placeholder strings in French
// without needing per-locale theme settings.
//
// `canonicalUrl` strips the trailing `/index.html` so directory
// landings (home, /<lang>/, category archives) emit the clean form
// `<link rel="canonical" href="https://site.com/fr/" />` matching
// what multilang's hreflang link tags use — keeps Google's canonical
// + hreflang cluster in lockstep.
export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  currentPath,
  currentLocale,
  children,
}: BaseLayoutProps) {
  const cssHref = `/${site.themeCssPath}`;
  const lang = resolveLocale(currentLocale, site.settings.language);
  const canonical =
    site.settings.baseUrl && currentPath
      ? canonicalUrl(site.settings.baseUrl, currentPath)
      : undefined;
  // Compose the document title. Convention: append the site title
  // unless the author already baked it into `pageTitle` (typical on a
  // home page whose `seoTitle` reads "Flexweg CMS — A modern static
  // CMS"). The `includes` check is a pragmatic guard — it covers both
  // brand-first ("Flexweg — Hello") and brand-last ("Hello — Flexweg")
  // patterns without us having to expose a per-page "no-suffix" flag.
  const siteTitle = site.settings.title || "";
  const alreadyBranded =
    !!pageTitle && !!siteTitle && pageTitle.includes(siteTitle);
  const fullTitle = pageTitle
    ? alreadyBranded
      ? pageTitle
      : `${pageTitle} — ${siteTitle}`
    : siteTitle;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        {canonical && <link rel="canonical" href={canonical} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={cssHref} />
        <meta property="og:title" content={fullTitle} />
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:type" content="website" />
        {/* Sentinel consumed by renderPageToHtml — do not remove. */}
        <meta name="x-cms-head-extra" />
      </head>
      <body>
        <div className="mp-app">
          <Header site={site} currentPath={currentPath} currentLocale={lang} />
          <div className="mp-layout">
            <Sidebar site={site} currentPath={currentPath} currentLocale={lang} />
            <main className="mp-main">{children}</main>
          </div>
          <Footer site={site} currentLocale={lang} />
        </div>
        <BottomNav site={site} currentPath={currentPath} currentLocale={lang} />
        {/* Hide-on-scroll for `.mp-header` + `.mp-bottom-nav`.
            Standard pattern: track scroll direction with rAF
            throttling, toggle `.is-hidden` past a small per-tick
            threshold (avoid jitter on micro-bursts), always show
            within ~80px of the top. `passive: true` keeps the
            handler off the main scroll thread. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=document.querySelector('.mp-header'),n=document.querySelector('.mp-bottom-nav');if(!h&&!n)return;var lastY=window.scrollY,ticking=false;function update(){var y=window.scrollY,d=y-lastY;if(y<80){if(h)h.classList.remove('is-hidden');if(n)n.classList.remove('is-hidden');}else if(d>6){if(h)h.classList.add('is-hidden');if(n)n.classList.add('is-hidden');}else if(d<-6){if(h)h.classList.remove('is-hidden');if(n)n.classList.remove('is-hidden');}lastY=y;ticking=false;}window.addEventListener('scroll',function(){if(!ticking){window.requestAnimationFrame(update);ticking=true;}},{passive:true});})();`,
          }}
        />
        {/* Copy-button wiring for documentation code blocks.
            Delegated click handler so dynamic content (theme blocks
            that inject more code blocks at runtime, if any) keeps
            working. On copy success, swaps the label to the localised
            "Copied" string for 1.5 s and adds an `is-copied` class
            for the visual confirmation. The default + done labels are
            read off the button's data attributes, baked per-locale by
            the docTransforms `post.html.body` filter. Falls back to
            execCommand('copy') when the modern Clipboard API isn't
            available (older browsers / http:// origins). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.addEventListener('click',function(e){var btn=e.target&&e.target.closest&&e.target.closest('[data-cms-copy]');if(!btn)return;var block=btn.closest('.mp-codeblock');var code=block&&block.querySelector('pre code');if(!code)return;var text=code.textContent||'';var label=btn.querySelector('[data-cms-copy-label]');var defaultLabel=btn.getAttribute('data-cms-copy-label-default')||'Copy';var doneLabel=btn.getAttribute('data-cms-copy-label-done')||'Copied';function done(){btn.classList.add('is-copied');if(label)label.textContent=doneLabel;setTimeout(function(){btn.classList.remove('is-copied');if(label)label.textContent=defaultLabel;},1500);}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(function(){fallback();});}else{fallback();}function fallback(){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done();}catch(_){}document.body.removeChild(ta);}});})();`,
          }}
        />
        {/* Sentinel consumed by renderPageToHtml — do not remove. */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
