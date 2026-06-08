import { canonicalUrl, type BaseLayoutProps } from "@flexweg/cms-runtime";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { MagazineThemeConfig } from "../config";

// HTML shell shared by every magazine template. Two sentinels are
// emitted (head + body-end) so plugins can inject markup post-render via
// `page.head.extra` / `page.body.end` filters — see core/render.tsx for
// the string-replace logic.
//
// Fonts (Newsreader + Work Sans + Material Symbols Outlined) are loaded
// inside theme.css via `@import url(...)`, so the regenerated CSS pushed
// by Theme Settings → Style can swap font pairs without touching this
// HTML. The `preconnect` links here just warm DNS / TLS for those font
// requests.
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
  // → Style are picked up by visitors on their next page load. Bumped
  // on every Save & apply / Reset in the theme settings page.
  const cssUpdatedAt = (site.themeConfig as MagazineThemeConfig | undefined)?.cssUpdatedAt;
  const cssHref = cssUpdatedAt
    ? `/${site.themeCssPath}?v=${cssUpdatedAt}`
    : `/${site.themeCssPath}`;
  const themeId = site.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, "");
  const jsHref = `/theme-assets/${themeId}-menu.js`;
  const jsHrefPosts = `/theme-assets/${themeId}-posts.js`;
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
      <body className="bg-background text-on-surface font-sans">
        <Header site={site} />
        <main className="pt-24 pb-section-gap">{children}</main>
        <Footer site={site} />
        <script src={jsHref} defer />
        <script src={jsHrefPosts} defer />
        {/* Sentinel consumed by renderPageToHtml — do not remove. */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
