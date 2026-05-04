import type { PluginManifest } from "../../plugins";
import type { BaseLayoutProps } from "../../themes/types";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import { DEFAULT_FAVICON_CONFIG, FaviconSettingsPage, type FaviconConfig } from "./SettingsPage";
import readme from "./README.md?raw";

const PLUGIN_ID = "flexweg-favicon";
const FOLDER = "favicon";

// Reads the plugin's effective config from the resolved BaseLayoutProps
// available inside head-injection filter handlers. Falls back to
// defaults when nothing is stored — keeps the filter resilient to
// fresh-install / disabled states.
function readConfig(props: BaseLayoutProps | undefined): FaviconConfig {
  const stored = props?.site.settings.pluginConfigs?.[PLUGIN_ID] as
    | Partial<FaviconConfig>
    | undefined;
  return { ...DEFAULT_FAVICON_CONFIG, ...(stored ?? {}) };
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Builds the cluster of `<link>` tags injected into every page's
// <head>. Only emits a tag when the corresponding file is recorded as
// uploaded — so a partial install (e.g. SVG never uploaded because
// the source was raster) doesn't produce broken links.
function buildHeadTags(config: FaviconConfig): string {
  if (!config.enabled) return "";
  const v = config.uploadedAt;
  const tags: string[] = [];
  if (config.hasPng96) {
    tags.push(
      `<link rel="icon" type="image/png" href="/${FOLDER}/favicon-96x96.png?v=${v}" sizes="96x96" />`,
    );
  }
  if (config.hasSvg) {
    tags.push(
      `<link rel="icon" type="image/svg+xml" href="/${FOLDER}/favicon.svg?v=${v}" />`,
    );
  }
  if (config.hasIco) {
    tags.push(`<link rel="shortcut icon" href="/${FOLDER}/favicon.ico?v=${v}" />`);
  }
  if (config.hasAppleTouch) {
    tags.push(
      `<link rel="apple-touch-icon" sizes="180x180" href="/${FOLDER}/apple-touch-icon.png?v=${v}" />`,
    );
  }
  if (config.hasManifest) {
    tags.push(`<link rel="manifest" href="/${FOLDER}/site.webmanifest?v=${v}" />`);
    // theme-color hint complements the manifest for browsers that
    // honor it directly (Safari iOS chrome, Chrome Android).
    if (config.pwaThemeColor) {
      tags.push(`<meta name="theme-color" content="${escapeAttr(config.pwaThemeColor)}" />`);
    }
  }
  return tags.join("\n");
}

export const manifest: PluginManifest<FaviconConfig> = {
  id: PLUGIN_ID,
  name: "Flexweg Favicon",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Upload one square image; the plugin generates every favicon variant (PNG, ICO, Apple touch, PWA manifest), uploads them under /favicon/ on the public site, and injects the matching <link> tags into every published page.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_FAVICON_CONFIG,
    component: FaviconSettingsPage,
  },
  register(api) {
    // Synchronous filter — runs inside the publisher's static render
    // pass via `applyFiltersSync("page.head.extra", "", baseProps)`.
    // Returning a string appends it to the <head> sentinel.
    api.addFilter<string>("page.head.extra", (current, ...rest) => {
      const props = rest[0] as BaseLayoutProps | undefined;
      const config = readConfig(props);
      const tags = buildHeadTags(config);
      if (!tags) return current;
      return [current, tags].filter(Boolean).join("\n");
    });
  },
};
