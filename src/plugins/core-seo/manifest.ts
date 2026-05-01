import type { PluginManifest } from "../index";
import type { BaseLayoutProps } from "../../themes/types";

// Built-in SEO plugin. Scope is intentionally tiny — it adds extra
// <head> markup not already covered by the default BaseLayout (most of
// which is OG/canonical/title/description). Bigger SEO concerns (sitemap,
// schema.org JSON-LD, robots.txt) belong in their own plugins.

function generatorMetaTag(): string {
  return '<meta name="generator" content="Flexweg CMS" />';
}

function twitterCardTags(props: BaseLayoutProps): string {
  const description = props.pageDescription
    ? `<meta name="twitter:description" content="${escapeAttr(props.pageDescription)}" />`
    : "";
  const image = props.ogImage
    ? `<meta name="twitter:image" content="${escapeAttr(props.ogImage)}" />`
    : "";
  return [
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttr(props.pageTitle ?? "")}" />`,
    description,
    image,
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const manifest: PluginManifest = {
  id: "core-seo",
  name: "SEO",
  version: "1.0.0",
  description: "Adds Twitter card meta tags and a generator hint to every published page.",
  register(api) {
    api.addFilter<string>("page.head.extra", (current, ...rest) => {
      const props = rest[0] as BaseLayoutProps | undefined;
      if (!props) return current;
      return [current, generatorMetaTag(), twitterCardTags(props)].filter(Boolean).join("\n");
    });
  },
};
