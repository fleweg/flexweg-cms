// XSL stylesheet for RSS 2.0 feeds — gives a styled HTML rendering when
// a human opens /rss.xml or /<category>/<category>.xml in a browser.
// Real RSS readers ignore the xml-stylesheet PI and parse the XML
// directly, so SEO / aggregator behavior is unaffected.
//
// Labels are baked at upload time from settings.language. Re-upload after
// changing the public site language (or click Force regenerate which
// re-uploads everything). Uses the shared `pickPublicLocale` helper so a
// BCP-47 tag with a region suffix (e.g. `pt-BR`, `fr-CA`) maps to the
// underlying base locale's label set.

import { pickPublicLocale, type AdminLocale } from "@flexweg/cms-runtime";

export const RSS_XSL_PATH = "rss.xsl";

interface XslLabels {
  pageTitle: string;
  heading: string;
  meta: string;
  countBefore: string;
  countAfter: string;
  columnTitle: string;
  columnPubdate: string;
  columnDescription: string;
}

const LABELS: Record<AdminLocale, XslLabels> = {
  en: {
    pageTitle: "RSS feed",
    heading: "RSS feed",
    meta: "This RSS feed is meant for RSS readers. Subscribe by copying this page's URL into your reader.",
    countBefore: "This feed contains ",
    countAfter: " articles.",
    columnTitle: "Title",
    columnPubdate: "Published",
    columnDescription: "Description",
  },
  fr: {
    pageTitle: "Flux RSS",
    heading: "Flux RSS",
    meta: "Ce flux RSS est destiné aux lecteurs RSS. Abonnez-vous en copiant l'URL de cette page dans votre lecteur.",
    countBefore: "Ce flux contient ",
    countAfter: " articles.",
    columnTitle: "Titre",
    columnPubdate: "Publié",
    columnDescription: "Description",
  },
  de: {
    pageTitle: "RSS-Feed",
    heading: "RSS-Feed",
    meta: "Dieser RSS-Feed ist für RSS-Reader gedacht. Abonnieren Sie ihn, indem Sie die URL dieser Seite in Ihren Reader kopieren.",
    countBefore: "Dieser Feed enthält ",
    countAfter: " Artikel.",
    columnTitle: "Titel",
    columnPubdate: "Veröffentlicht",
    columnDescription: "Beschreibung",
  },
  es: {
    pageTitle: "Feed RSS",
    heading: "Feed RSS",
    meta: "Este feed RSS está destinado a los lectores RSS. Suscríbete copiando la URL de esta página en tu lector.",
    countBefore: "Este feed contiene ",
    countAfter: " artículos.",
    columnTitle: "Título",
    columnPubdate: "Publicado",
    columnDescription: "Descripción",
  },
  nl: {
    pageTitle: "RSS-feed",
    heading: "RSS-feed",
    meta: "Deze RSS-feed is bedoeld voor RSS-lezers. Abonneer door de URL van deze pagina in je lezer te kopiëren.",
    countBefore: "Deze feed bevat ",
    countAfter: " artikelen.",
    columnTitle: "Titel",
    columnPubdate: "Gepubliceerd",
    columnDescription: "Beschrijving",
  },
  pt: {
    pageTitle: "Feed RSS",
    heading: "Feed RSS",
    meta: "Este feed RSS destina-se a leitores RSS. Subscreve copiando o URL desta página para o teu leitor.",
    countBefore: "Este feed contém ",
    countAfter: " artigos.",
    columnTitle: "Título",
    columnPubdate: "Publicado",
    columnDescription: "Descrição",
  },
  ko: {
    pageTitle: "RSS 피드",
    heading: "RSS 피드",
    meta: "이 RSS 피드는 RSS 리더를 위한 것입니다. 이 페이지의 URL을 리더에 복사하여 구독하세요.",
    countBefore: "이 피드에는 ",
    countAfter: "개의 기사가 포함되어 있습니다.",
    columnTitle: "제목",
    columnPubdate: "게시일",
    columnDescription: "설명",
  },
};

function pickLocale(language: string): AdminLocale {
  return pickPublicLocale(language);
}

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
.title { width: 40%; }
.pubdate { white-space: nowrap; color: #4b5563; width: 200px; }
.description { color: #4b5563; }
`;

export function buildRssXsl(language: string): string {
  const locale = pickLocale(language);
  const L = LABELS[locale];
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="${locale}">
      <head>
        <title>${L.pageTitle} — <xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="utf-8"/>
        <meta name="robots" content="noindex,follow"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">${COMMON_CSS}</style>
      </head>
      <body>
        <main>
          <h1>${L.heading} — <xsl:value-of select="/rss/channel/title"/></h1>
          <p class="meta">${L.meta}</p>
          <p class="count">${L.countBefore}<xsl:value-of select="count(/rss/channel/item)"/>${L.countAfter}</p>
          <table>
            <thead>
              <tr>
                <th class="title">${L.columnTitle}</th>
                <th class="pubdate">${L.columnPubdate}</th>
                <th class="description">${L.columnDescription}</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="/rss/channel/item">
                <tr>
                  <td class="title"><a href="{link}"><xsl:value-of select="title"/></a></td>
                  <td class="pubdate"><xsl:value-of select="pubDate"/></td>
                  <td class="description"><xsl:value-of select="description"/></td>
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
