import type { BaseLayoutProps } from "../../types";
import { canonicalUrl } from "../../../core/slug";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { DefaultThemeConfig } from "../config";

// HTML shell shared by every template. The `extraHead` prop is intentionally
// not consumed here — `core/render.tsx` injects it post-render with a
// string replacement against a sentinel comment placed inside <head>. This
// avoids an awkward dangerouslySetInnerHTML inside <head>, which React
// cannot represent without an intrinsic-element hack.
export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  currentPath,
  currentLocale,
  children,
}: BaseLayoutProps) {
  // Cache-bust the theme CSS so style changes pushed via Theme Settings
  // → Style are picked up by visitors on their next page load. `0`
  // means the CSS has never been re-uploaded — keep the URL clean.
  // The value is bumped on every Save & apply / Reset to defaults in
  // the theme settings page. Existing already-published pages keep
  // their stale ?v= until they're republished (Regenerate everything
  // pushes the new bust to every page in one pass).
  const cssUpdatedAt = (site.themeConfig as DefaultThemeConfig | undefined)?.cssUpdatedAt;
  const cssHref = cssUpdatedAt
    ? `/${site.themeCssPath}?v=${cssUpdatedAt}`
    : `/${site.themeCssPath}`;
  // Sibling JS files shipped by the theme. Same naming convention as
  // the CSS: theme-assets/<theme-id>-menu.js (header / burger menu) and
  // theme-assets/<theme-id>-posts.js (sidebar widgets fed by
  // /posts.json). Both loaded with `defer` so they run after the
  // document parses but before DOMContentLoaded — each loader listens
  // for that event itself if it happens to land later.
  const themeId = site.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, "");
  const jsHref = `/theme-assets/${themeId}-menu.js`;
  const jsHrefPosts = `/theme-assets/${themeId}-posts.js`;
  // canonicalUrl() strips the trailing `index.html` so directory
  // landings (home, /<lang>/, category archives) get a clean canonical
  // ending in `/` rather than `/index.html`. Both resolve to the same
  // file on the host but the clean form is the SEO-preferred one.
  const canonical =
    site.settings.baseUrl && currentPath
      ? canonicalUrl(site.settings.baseUrl, currentPath)
      : undefined;
  const fullTitle = pageTitle
    ? `${pageTitle} — ${site.settings.title}`
    : site.settings.title;

  return (
    <html lang={currentLocale || site.settings.language || "en"}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        {canonical && <link rel="canonical" href={canonical} />}
        {/* Fonts are loaded inside the theme CSS itself (via
            `@import url(...)`), so the regenerated CSS pushed by
            Theme Settings → Style can swap the Google Fonts URL
            without touching this HTML. We keep the preconnects to
            warm the DNS / TLS for the foreseeable font requests. */}
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
        <Header site={site} />
        <main className="site-main">{children}</main>
        <Footer site={site} />
        <script src={jsHref} defer />
        <script src={jsHrefPosts} defer />
        {/* Sentinel consumed by renderPageToHtml — do not remove.
            Plugins can register a `page.body.end` filter and have
            their HTML injected here right before </body>. The
            `<script>` element is valid in body, takes no rendering
            space, and survives serialization with a stable shape
            we can string-match against. */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
