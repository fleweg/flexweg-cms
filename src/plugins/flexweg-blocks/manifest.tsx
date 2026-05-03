import type { PluginManifest } from "../index";
import type { BaseLayoutProps } from "../../themes/types";
import { en, fr } from "./i18n";
import { columnsBlock } from "./columns/manifest";
import {
  getDetectedColumnsStyles,
  transformColumnsHtml,
} from "./columns/transforms";
import { ensureAdminColumnsStyles } from "./styles";
import readme from "./README.md?raw";

const PLUGIN_ID = "flexweg-blocks";

// Inject baseline columns CSS into the admin document head once at
// module load. Keeps the editor's columns layout in sync with the
// published version — same idempotency pattern as flexweg-embeds.
ensureAdminColumnsStyles();

export const manifest: PluginManifest = {
  id: PLUGIN_ID,
  name: "Flexweg Blocks",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Layout primitives for the post editor. Currently ships a Columns block (2-4 columns, mobile-stacking).",
  readme,
  i18n: { en, fr },
  register(api) {
    // Make the Columns block available in the editor's inserter.
    api.registerBlock(columnsBlock);

    // Publish-time replacement. Priority 5 = runs BEFORE the
    // default theme's filter (priority 10) and flexweg-embeds'
    // filter — our pass replaces the columns wrappers with their
    // CSS classes but leaves nested block markers untouched, so
    // the later filters can still process them inside the columns.
    api.addFilter<string>(
      "post.html.body",
      (html) => transformColumnsHtml(html),
      5,
    );

    // Head-extra injection: emits the baseline columns CSS exactly
    // once when at least one columns block appears on the page.
    // Mirrors flexweg-embeds' getDetectedHeadStyles flow.
    api.addFilter<string>("page.head.extra", (current, ...rest) => {
      void rest[0] as BaseLayoutProps | undefined;
      const styles = getDetectedColumnsStyles();
      if (!styles) return current;
      return [current, styles].filter(Boolean).join("\n");
    });
  },
};
