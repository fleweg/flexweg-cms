import type { BaseLayoutProps } from "@flexweg/cms-runtime";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";

// Shell. Sticky top header + persistent left sidebar (lg+) +
// main canvas. Mobile gets a bottom nav in place of the sidebar.
// Page chrome sentinels for plugin head/body filters are emitted
// at the right spots.
export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  currentPath,
  children,
}: BaseLayoutProps) {
  const cssHref = `/${site.themeCssPath}`;
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={cssHref} />
        <meta property="og:title" content={fullTitle} />
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:type" content="website" />
        <meta name="x-cms-head-extra" />
      </head>
      <body>
        <div className="mp-app">
          <Header site={site} currentPath={currentPath} />
          <div className="mp-layout">
            <Sidebar site={site} currentPath={currentPath} />
            <main className="mp-main">{children}</main>
          </div>
          <Footer site={site} />
        </div>
        <BottomNav site={site} currentPath={currentPath} />
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
