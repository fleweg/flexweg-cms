import type { BaseLayoutProps } from "../../types";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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
  children,
}: BaseLayoutProps) {
  const cssHref = `/${site.themeCssPath}`;
  // Sibling JS file shipped by the theme. Same naming convention as the
  // CSS: theme-assets/<theme-id>-menu.js. Loaded with `defer` so it runs
  // after the document parsed but before DOMContentLoaded — the loader
  // listens for that event itself if it happens to land later.
  const themeId = site.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, "");
  const jsHref = `/theme-assets/${themeId}-menu.js`;
  const canonical =
    site.settings.baseUrl && currentPath
      ? `${site.settings.baseUrl.replace(/\/+$/, "")}/${currentPath.replace(/^\/+/, "")}`
      : undefined;
  const fullTitle = pageTitle
    ? `${pageTitle} — ${site.settings.title}`
    : site.settings.title;

  return (
    <html lang={site.settings.language || "en"}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        {canonical && <link rel="canonical" href={canonical} />}
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
      </body>
    </html>
  );
}
