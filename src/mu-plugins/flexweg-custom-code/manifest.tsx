import type { PluginManifest } from "../../plugins";
import type { BaseLayoutProps } from "../../themes/types";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import {
  CustomCodeSettingsPage,
  DEFAULT_CUSTOM_CODE_CONFIG,
  type CustomCodeConfig,
} from "./SettingsPage";
import readme from "./README.md?raw";

const PLUGIN_ID = "flexweg-custom-code";

// Reads the live config out of the publish context's settings.
// Falls back to defaults when no entry is stored yet so the filters
// emit nothing on a fresh install.
function readConfig(props: BaseLayoutProps | undefined): CustomCodeConfig {
  const stored = props?.site.settings.pluginConfigs?.[PLUGIN_ID] as
    | Partial<CustomCodeConfig>
    | undefined;
  return { ...DEFAULT_CUSTOM_CODE_CONFIG, ...(stored ?? {}) };
}

export const manifest: PluginManifest<CustomCodeConfig> = {
  id: PLUGIN_ID,
  name: "Flexweg Custom Code",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Inject site-wide HTML / CSS / JS into the <head> or before </body> of every published page. Useful for analytics, fonts, third-party widgets, custom overrides.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_CUSTOM_CODE_CONFIG,
    component: CustomCodeSettingsPage,
  },
  register(api) {
    // page.head.extra runs synchronously inside renderPageToHtml,
    // gets called for every page (post / page / archive / home /
    // 404). The string we return is concatenated with output from
    // other head.extra filters (core-seo's Twitter cards,
    // flexweg-favicon's <link>s, etc.). Empty user-config means
    // empty contribution — no extra whitespace either.
    api.addFilter<string>("page.head.extra", (current, ...rest) => {
      const props = rest[0] as BaseLayoutProps | undefined;
      const code = readConfig(props).head;
      if (!code) return current;
      return [current, code].filter(Boolean).join("\n");
    });

    // Same flow for body.end. Lives in the BaseLayout's body sentinel.
    api.addFilter<string>("page.body.end", (current, ...rest) => {
      const props = rest[0] as BaseLayoutProps | undefined;
      const code = readConfig(props).bodyEnd;
      if (!code) return current;
      return [current, code].filter(Boolean).join("\n");
    });
  },
};
