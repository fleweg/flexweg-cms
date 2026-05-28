// Shared RSS 2.0 XML builder. Used by flexweg-rss for the site/category
// feeds and by flexweg-multilang for the per-language variants. Kept
// minimal and stateless — callers prepare the items + channel metadata,
// this module just serialises them.
//
// Exposed on @flexweg/cms-runtime so external plugins can build their
// own RSS feeds without re-implementing the boilerplate.

export interface RssEnclosure {
  url: string;
  // 0 means "size unknown" (legacy uploads without per-variant byte
  // counts); modern readers tolerate that.
  length: number;
  type: string;
}

export interface RssItem {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDateMs: number;
  category?: string;
  enclosure?: RssEnclosure;
}

export interface RssChannel {
  title: string;
  link: string;
  description: string;
  feedUrl: string;
  // BCP-47 tag for the feed's language (e.g. "en", "fr"). Falls back
  // to "en" when undefined.
  language: string;
  items: RssItem[];
  // Absolute URL of the XSL stylesheet referenced by the feed's
  // xml-stylesheet PI for browser viewing. Optional — when omitted no
  // stylesheet PI is emitted.
  xslHref?: string;
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });
}

// CDATA blocks can't contain "]]>" — split any occurrence so the
// closing sequence appears outside CDATA. Standard pattern used by
// every RSS generator that embeds rich content.
function escapeCdata(value: string): string {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

function rfc822(ms: number): string {
  return new Date(ms).toUTCString();
}

// Serialises an RSS 2.0 channel + its items to a complete XML
// document (preamble + optional xml-stylesheet PI + <rss> envelope).
// Returns the raw XML string ready to upload via the Flexweg Files
// API.
export function buildRssFeedXml(channel: RssChannel): string {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
  if (channel.xslHref) {
    lines.push(`<?xml-stylesheet type="text/xsl" href="${escapeXml(channel.xslHref)}"?>`);
  }
  lines.push('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
  lines.push("  <channel>");
  lines.push(`    <title>${escapeXml(channel.title)}</title>`);
  lines.push(`    <link>${escapeXml(channel.link)}</link>`);
  lines.push(`    <description>${escapeXml(channel.description)}</description>`);
  lines.push(`    <language>${escapeXml(channel.language || "en")}</language>`);
  lines.push(`    <lastBuildDate>${rfc822(Date.now())}</lastBuildDate>`);
  lines.push(
    `    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml"/>`,
  );
  for (const item of channel.items) {
    lines.push("    <item>");
    lines.push(`      <title>${escapeXml(item.title)}</title>`);
    lines.push(`      <link>${escapeXml(item.link)}</link>`);
    lines.push(`      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`);
    if (item.category) {
      lines.push(`      <category>${escapeXml(item.category)}</category>`);
    }
    lines.push(
      `      <description><![CDATA[${escapeCdata(item.description)}]]></description>`,
    );
    lines.push(`      <pubDate>${rfc822(item.pubDateMs)}</pubDate>`);
    if (item.enclosure) {
      lines.push(
        `      <enclosure url="${escapeXml(item.enclosure.url)}" length="${
          item.enclosure.length
        }" type="${escapeXml(item.enclosure.type)}"/>`,
      );
    }
    lines.push("    </item>");
  }
  lines.push("  </channel>");
  lines.push("</rss>");
  return lines.join("\n");
}
