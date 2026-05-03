import type { PluginManifest } from "../index";
import type { BaseLayoutProps } from "../../themes/types";
import { en, fr } from "./i18n";
import { PROVIDER_LIST } from "./providers";
import { createEmbedNode, embedNodeName } from "./nodes";
import { EmbedInspector } from "./EmbedInspector";
import {
  getDetectedBodyScripts,
  getDetectedHeadStyles,
  transformBodyHtml,
} from "./transforms";
import { ensureAdminEmbedStyles } from "./styles";

const PLUGIN_ID = "flexweg-embeds";

// Inject baseline embed CSS into the admin document head once at
// module load. This is idempotent and ensures iframe-based embed
// previews (YouTube, Vimeo, Spotify) get their 16:9 aspect ratio
// inside the editor, matching the published page. Safe in non-
// browser environments (publisher tests run in jsdom but ensure*
// guards against missing document).
ensureAdminEmbedStyles();

export const manifest: PluginManifest = {
  id: PLUGIN_ID,
  name: "Flexweg Embeds",
  version: "1.0.0",
  description:
    "Adds embed blocks (YouTube, Vimeo, Twitter/X, Spotify) to the post editor. Per-page detection injects each provider's runtime script at most once and only when at least one block of that kind is used.",
  i18n: { en, fr },
  register(api) {
    // Each provider becomes one block in the registry. The Tiptap
    // Node is built per-provider through the same factory so all
    // providers share parseHTML / renderHTML conventions.
    for (const provider of PROVIDER_LIST) {
      const node = createEmbedNode(provider);
      api.registerBlock({
        id: `${PLUGIN_ID}/${provider.providerId}`,
        nodeName: embedNodeName(provider.providerId),
        titleKey: provider.titleKey,
        namespace: PLUGIN_ID,
        icon: provider.icon,
        category: "embed",
        extensions: [node],
        // Inserts an empty atom node — the user fills the URL via the
        // NodeView's inline input or the Block tab inspector.
        insert: (chain) => {
          chain
            .focus()
            .insertContent({ type: embedNodeName(provider.providerId) })
            .run();
        },
        isActive: (editor) => editor.isActive(embedNodeName(provider.providerId)),
        // Inspector closes over the provider so it knows which node
        // attrs to read/write. The EditorInspector's auto-attrs
        // plumbing is bypassed (the inspector reads attrs itself via
        // editor.getAttributes(nodeName) for live sync on selection
        // change).
        inspector: (props) => <EmbedInspector editor={props.editor} provider={provider} />,
      });
    }

    // Publish-time replacement of `<div data-cms-embed=…>` markers
    // with the real embed HTML. The publisher pipeline order is
    // renderMarkdown (DOMPurify) → applyFilters("post.html.body",
    // html, post). DOMPurify's default ALLOWED_ATTR list lets `data-*`
    // attributes through, so the markers survive sanitization intact
    // and reach this filter.
    api.addFilter<string>("post.html.body", (html) => transformBodyHtml(html));

    // Head-extra injection: emits the baseline embed CSS once when at
    // least one embed appears on the page. Runs after post.html.body
    // (the publisher renders the body first, then renderPageToHtml
    // calls page.head.extra) so detection state is already populated.
    api.addFilter<string>("page.head.extra", (current, ...rest) => {
      void rest[0] as BaseLayoutProps | undefined;
      const styles = getDetectedHeadStyles();
      if (!styles) return current;
      return [current, styles].filter(Boolean).join("\n");
    });

    // Body-end injection: emits each detected provider's script tag at
    // most once. Reads the Set populated by transformBodyHtml above —
    // the publish pipeline runs the two filters back-to-back for the
    // same page, so module state is consistent.
    api.addFilter<string>("page.body.end", (current, ...rest) => {
      // Only inject for full-content pages (single posts/pages); the
      // home and archive listings don't render any body so they
      // wouldn't have markers either, but checking baseProps lets us
      // bail early for clarity.
      void rest[0] as BaseLayoutProps | undefined;
      const scripts = getDetectedBodyScripts();
      if (!scripts) return current;
      return [current, scripts].filter(Boolean).join("\n");
    });
  },
};
