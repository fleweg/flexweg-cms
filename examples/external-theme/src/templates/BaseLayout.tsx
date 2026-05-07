// Theme BaseLayout — wraps every page. Receives `site`, the page
// title, optional description / OG image, and the rendered template
// as `children`.
//
// IMPORTANT: emit the head-extra sentinel <meta name="x-cms-head-extra" />.
// The publisher does a string-replace on this marker post-renderToStaticMarkup
// to inject plugin-contributed head markup. Without it, plugins like
// flexweg-favicon and flexweg-rss can't add their <link>/<meta> tags
// to your theme's pages.

interface BaseLayoutProps {
  site: { settings: { language?: string; title?: string } };
  pageTitle: string;
  pageDescription?: string;
  ogImage?: string;
  currentPath: string;
  extraHead?: string;
  children: React.ReactNode;
}

export function BaseLayout({
  site,
  pageTitle,
  pageDescription,
  ogImage,
  children,
}: BaseLayoutProps) {
  return (
    <html lang={site.settings.language || "en"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        {pageDescription && (
          <meta name="description" content={pageDescription} />
        )}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <link rel="stylesheet" href="/theme-assets/minimal-theme.css" />
        {/* Sentinel for plugin head-extra injection. */}
        <meta name="x-cms-head-extra" />
      </head>
      <body>
        <header>
          <nav data-cms-menu="header">
            <ul></ul>
          </nav>
          <div data-cms-brand>
            <a href="/index.html">{site.settings.title || "Site"}</a>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <nav data-cms-menu="footer">
            <ul></ul>
          </nav>
        </footer>
        {/* Body-end sentinel for plugin script injection. */}
        <script type="application/x-cms-body-end" />
      </body>
    </html>
  );
}
