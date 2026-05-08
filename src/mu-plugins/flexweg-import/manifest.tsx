import type { PluginManifest } from "../../plugins";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import {
  DEFAULT_IMPORT_CONFIG,
  ImportSettingsPage,
  type ImportConfig,
} from "./SettingsPage";
import readme from "./README.md?raw";

export const manifest: PluginManifest<ImportConfig> = {
  id: "flexweg-import",
  name: "Flexweg Import",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Bulk-imports posts and pages from markdown (with YAML frontmatter) or WordPress XML exports. Auto-creates categories / tags (with hierarchy), uploads referenced images, rewrites image URLs in the body, and matches authors to existing CMS users.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_IMPORT_CONFIG,
    component: ImportSettingsPage,
  },
  // No lifecycle hooks — the plugin is purely on-demand. The user
  // clicks Confirm import in the settings page and that's the
  // entire surface; there's nothing the publish/unpublish flow
  // needs to react to.
  register() {
    // No-op.
  },
};
