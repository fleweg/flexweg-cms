// XSL stylesheets uploaded alongside the sitemap XML files. When a browser
// loads /sitemap-index.xml, /sitemap-<year>.xml or /sitemap-news.xml,
// the stylesheet referenced in the file's <?xml-stylesheet?> processing
// instruction transforms the raw XML into a styled HTML table — much
// nicer to look at than a raw-XML dump for SEO checks and dev work.
//
// The labels embedded in the XSL are baked at upload time from the site's
// public language (settings.language). When the user changes that
// language, they re-click "Upload stylesheets" to refresh the labels —
// same trigger as for any other static asset on the public site.

export const SITEMAP_XSL_PATH = "sitemap.xsl";
export const SITEMAP_NEWS_XSL_PATH = "sitemap-news.xsl";

interface XslLabels {
  pageTitle: string;
  heading: string;
  meta: string;
  // Count line is split before/after the count value because XSL inserts
  // the dynamic count via <xsl:value-of/> in the middle of the sentence.
  indexCountBefore: string;
  indexCountAfter: string;
  urlCountBefore: string;
  urlCountAfter: string;
  newsCountBefore: string;
  newsCountAfter: string;
  newsHeading: string;
  newsPageTitle: string;
  columnSitemap: string;
  columnUrl: string;
  columnLastmod: string;
  columnTitle: string;
  columnPubdate: string;
}

type XslLocale = "en" | "fr" | "de" | "es" | "nl" | "pt" | "ko";

const LABELS: Record<XslLocale, XslLabels> = {
  en: {
    pageTitle: "XML Sitemap",
    heading: "XML Sitemap",
    meta: "This XML sitemap is meant for consumption by search engines.",
    indexCountBefore: "This index references ",
    indexCountAfter: " sitemaps.",
    urlCountBefore: "This sitemap contains ",
    urlCountAfter: " URLs.",
    newsCountBefore: "This News sitemap contains ",
    newsCountAfter: " articles.",
    newsHeading: "XML News Sitemap",
    newsPageTitle: "XML News Sitemap",
    columnSitemap: "Sitemap URL",
    columnUrl: "URL",
    columnLastmod: "Last modified",
    columnTitle: "Title",
    columnPubdate: "Publication date",
  },
  fr: {
    pageTitle: "Plan du site XML",
    heading: "Plan du site XML",
    meta: "Ce sitemap XML est destiné aux moteurs de recherche.",
    indexCountBefore: "Cet index référence ",
    indexCountAfter: " sitemaps.",
    urlCountBefore: "Ce sitemap contient ",
    urlCountAfter: " URLs.",
    newsCountBefore: "Ce sitemap News contient ",
    newsCountAfter: " articles.",
    newsHeading: "Plan du site XML News",
    newsPageTitle: "Plan du site XML News",
    columnSitemap: "URL du sitemap",
    columnUrl: "URL",
    columnLastmod: "Dernière modification",
    columnTitle: "Titre",
    columnPubdate: "Date de publication",
  },
  de: {
    pageTitle: "XML-Sitemap",
    heading: "XML-Sitemap",
    meta: "Diese XML-Sitemap ist für Suchmaschinen bestimmt.",
    indexCountBefore: "Dieser Index verweist auf ",
    indexCountAfter: " Sitemaps.",
    urlCountBefore: "Diese Sitemap enthält ",
    urlCountAfter: " URLs.",
    newsCountBefore: "Diese News-Sitemap enthält ",
    newsCountAfter: " Artikel.",
    newsHeading: "XML News-Sitemap",
    newsPageTitle: "XML News-Sitemap",
    columnSitemap: "Sitemap-URL",
    columnUrl: "URL",
    columnLastmod: "Zuletzt geändert",
    columnTitle: "Titel",
    columnPubdate: "Veröffentlichungsdatum",
  },
  es: {
    pageTitle: "Sitemap XML",
    heading: "Sitemap XML",
    meta: "Este sitemap XML está destinado a los motores de búsqueda.",
    indexCountBefore: "Este índice referencia ",
    indexCountAfter: " sitemaps.",
    urlCountBefore: "Este sitemap contiene ",
    urlCountAfter: " URLs.",
    newsCountBefore: "Este sitemap News contiene ",
    newsCountAfter: " artículos.",
    newsHeading: "Sitemap XML News",
    newsPageTitle: "Sitemap XML News",
    columnSitemap: "URL del sitemap",
    columnUrl: "URL",
    columnLastmod: "Última modificación",
    columnTitle: "Título",
    columnPubdate: "Fecha de publicación",
  },
  nl: {
    pageTitle: "XML-sitemap",
    heading: "XML-sitemap",
    meta: "Deze XML-sitemap is bedoeld voor gebruik door zoekmachines.",
    indexCountBefore: "Deze index verwijst naar ",
    indexCountAfter: " sitemaps.",
    urlCountBefore: "Deze sitemap bevat ",
    urlCountAfter: " URLs.",
    newsCountBefore: "Deze News-sitemap bevat ",
    newsCountAfter: " artikelen.",
    newsHeading: "XML News-sitemap",
    newsPageTitle: "XML News-sitemap",
    columnSitemap: "Sitemap-URL",
    columnUrl: "URL",
    columnLastmod: "Laatst gewijzigd",
    columnTitle: "Titel",
    columnPubdate: "Publicatiedatum",
  },
  pt: {
    pageTitle: "Sitemap XML",
    heading: "Sitemap XML",
    meta: "Este sitemap XML destina-se aos motores de busca.",
    indexCountBefore: "Este índice referencia ",
    indexCountAfter: " sitemaps.",
    urlCountBefore: "Este sitemap contém ",
    urlCountAfter: " URLs.",
    newsCountBefore: "Este sitemap News contém ",
    newsCountAfter: " artigos.",
    newsHeading: "Sitemap XML News",
    newsPageTitle: "Sitemap XML News",
    columnSitemap: "URL do sitemap",
    columnUrl: "URL",
    columnLastmod: "Última modificação",
    columnTitle: "Título",
    columnPubdate: "Data de publicação",
  },
  ko: {
    pageTitle: "XML 사이트맵",
    heading: "XML 사이트맵",
    meta: "이 XML 사이트맵은 검색 엔진을 위한 것입니다.",
    indexCountBefore: "이 인덱스는 ",
    indexCountAfter: "개의 사이트맵을 참조합니다.",
    urlCountBefore: "이 사이트맵에는 ",
    urlCountAfter: "개의 URL이 포함되어 있습니다.",
    newsCountBefore: "이 News 사이트맵에는 ",
    newsCountAfter: "개의 기사가 포함되어 있습니다.",
    newsHeading: "XML News 사이트맵",
    newsPageTitle: "XML News 사이트맵",
    columnSitemap: "사이트맵 URL",
    columnUrl: "URL",
    columnLastmod: "마지막 수정일",
    columnTitle: "제목",
    columnPubdate: "게시일",
  },
};

function pickLocale(language: string): XslLocale {
  const prefix = (language || "").split("-")[0]?.toLowerCase();
  if (prefix && prefix in LABELS) return prefix as XslLocale;
  return "en";
}

// Embedded CSS shared by both stylesheets. Sober palette aligned with the
// admin (gray + blue accent) rather than mimicking any third-party look.
const COMMON_CSS = `
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #1f2937; margin: 0; padding: 32px 16px; background: #ffffff; }
main { max-width: 1024px; margin: 0 auto; }
h1 { font-size: 22px; margin: 0 0 8px; font-weight: 600; }
.meta { color: #6b7280; font-size: 13px; margin: 0 0 24px; }
.count { color: #6b7280; font-size: 13px; margin: 0 0 16px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; padding: 10px 12px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937; }
td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
tr:nth-child(even) td { background: #fafafa; }
tr:hover td { background: #f3f4f6; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
.url { word-break: break-all; }
.lastmod, .pubdate { white-space: nowrap; color: #4b5563; width: 220px; }
`;

// Generic sitemap stylesheet — handles BOTH <sitemapindex> and <urlset>
// roots via xsl:choose. Used for sitemap-index.xml and every yearly file.
export function buildSitemapXsl(language: string): string {
  const locale = pickLocale(language);
  const L = LABELS[locale];
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="${locale}">
      <head>
        <title>${L.pageTitle}</title>
        <meta charset="utf-8"/>
        <meta name="robots" content="noindex,follow"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">${COMMON_CSS}</style>
      </head>
      <body>
        <main>
          <h1>${L.heading}</h1>
          <p class="meta">${L.meta}</p>
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <p class="count">${L.indexCountBefore}<xsl:value-of select="count(s:sitemapindex/s:sitemap)"/>${L.indexCountAfter}</p>
              <table>
                <thead><tr><th>${L.columnSitemap}</th><th>${L.columnLastmod}</th></tr></thead>
                <tbody>
                  <xsl:for-each select="s:sitemapindex/s:sitemap">
                    <tr>
                      <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td class="lastmod"><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
            <xsl:when test="s:urlset">
              <p class="count">${L.urlCountBefore}<xsl:value-of select="count(s:urlset/s:url)"/>${L.urlCountAfter}</p>
              <table>
                <thead><tr><th>${L.columnUrl}</th><th>${L.columnLastmod}</th></tr></thead>
                <tbody>
                  <xsl:for-each select="s:urlset/s:url">
                    <tr>
                      <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td class="lastmod"><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
          </xsl:choose>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

// News-specific stylesheet — pulls news:title and news:publication_date
// out of the Google News namespace.
export function buildNewsSitemapXsl(language: string): string {
  const locale = pickLocale(language);
  const L = LABELS[locale];
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:n="http://www.google.com/schemas/sitemap-news/0.9"
  exclude-result-prefixes="s n">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="${locale}">
      <head>
        <title>${L.newsPageTitle}</title>
        <meta charset="utf-8"/>
        <meta name="robots" content="noindex,follow"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">${COMMON_CSS}</style>
      </head>
      <body>
        <main>
          <h1>${L.newsHeading}</h1>
          <p class="meta">${L.meta}</p>
          <p class="count">${L.newsCountBefore}<xsl:value-of select="count(s:urlset/s:url)"/>${L.newsCountAfter}</p>
          <table>
            <thead><tr><th>${L.columnTitle}</th><th>${L.columnPubdate}</th></tr></thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="url"><a href="{s:loc}"><xsl:value-of select="n:news/n:title"/></a></td>
                  <td class="pubdate"><xsl:value-of select="n:news/n:publication_date"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}
