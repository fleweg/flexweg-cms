import type { BaseLayoutProps } from "@flexweg/cms-runtime";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// HTML shell shared by every corporate template. Two sentinels are
// emitted (head + body-end) so plugins can inject markup post-render
// via `page.head.extra` / `page.body.end` filters — see core/render.tsx
// for the string-replace logic.
//
// Inter is loaded inside theme.css via `@import url(...)`, so the
// regenerated CSS pushed by Theme Settings → Style can swap fonts
// without touching this HTML. The `preconnect` links here just warm
// DNS / TLS for those font requests.
export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  currentPath,
  children,
}: BaseLayoutProps) {
  const cssHref = `/${site.themeCssPath}`;
  const themeId = site.themeCssPath.replace(/^theme-assets\//, "").replace(/\.css$/, "");
  const jsHref = `/theme-assets/${themeId}-menu.js`;
  const jsHrefPosts = `/theme-assets/${themeId}-posts.js`;
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
        {/* Sentinel consumed by renderPageToHtml — do not remove. */}
        <meta name="x-cms-head-extra" />
      </head>
      <body className="bg-background text-on-surface">
        <Header site={site} />
        <main className="pt-20">{children}</main>
        <Footer site={site} />
        {/* Floating search FAB — paired with the flexweg-search
            plugin, which scans `[data-cms-search]` triggers and opens
            its modal on click. When the plugin is disabled the
            button renders inert (no-op click); admins can hide it
            entirely from /theme-settings in a later phase if needed. */}
        <button
          type="button"
          data-cms-search
          aria-label="Search"
          className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <script src={jsHref} defer />
        <script src={jsHrefPosts} defer />
        {/* Sentinel consumed by renderPageToHtml — do not remove. */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
