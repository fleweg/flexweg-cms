// External plugin entry: registers four slider blocks (image, hero,
// card, logo carousel) and wires the three publish-time hooks that
// turn marker <div>s into rich HTML + inject runtime assets only on
// pages that use a slider.
//
// Build: `npm run build` → ./dist/bundle.js → packed into
// ./flexweg-sliders.zip ready for upload via the admin's "Install
// plugin" UI.

import type { PluginManifest } from "@flexweg/cms-runtime";
import type { Editor } from "@tiptap/core";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import { createSliderNode, sliderNodeName } from "./nodes";
import { SLIDERS, SLIDER_LIST, type SliderKind } from "./sliders";
import { SliderInspector } from "./SliderInspector";
import {
  getDetectedScripts,
  getDetectedStyles,
  transformBodyHtml,
} from "./transforms";
import { ensureAdminSliderStyles } from "./runtime";
import { CardSliderIcon, HeroSliderIcon, ImageSliderIcon, LogoCarouselIcon } from "./icons";

const PLUGIN_ID = "flexweg-sliders";

// Inject the baseline CSS into the admin document head at module load
// so editor previews render with the same look as the published page.
// Idempotent: safe to call repeatedly across HMR / re-imports.
ensureAdminSliderStyles();

const ICONS: Record<SliderKind, () => JSX.Element> = {
  image: ImageSliderIcon,
  hero: HeroSliderIcon,
  card: CardSliderIcon,
  logo: LogoCarouselIcon,
};

const manifest: PluginManifest = {
  id: PLUGIN_ID,
  name: "Flexweg Sliders",
  version: "1.0.2",
  author: "Flexweg",
  description:
    "Four slider blocks (image, hero, cards, logo carousel) for the post/page editor. Self-contained: bundles its own vanilla-JS carousel runtime and CSS, injected per-page only when at least one slider is used.",
  i18n: { en, fr, de, es, nl, pt, ko },
  register(api) {
    for (const def of SLIDER_LIST) {
      const node = createSliderNode(def);
      const Icon = ICONS[def.kind];
      api.registerBlock({
        id: def.id,
        nodeName: sliderNodeName(def.kind),
        titleKey: `blocks.${def.kind}.title`,
        namespace: PLUGIN_ID,
        icon: Icon,
        category: "media",
        extensions: [node],
        // Insert an empty slider; the user adds slides via the
        // Block-tab Inspector. We don't bootstrap with a placeholder
        // slide because an empty slider renders nothing and avoids
        // dangling images from default URLs.
        insert: (chain) => {
          (chain as { focus: () => { insertContent: (c: unknown) => { run: () => void } } })
            .focus()
            .insertContent({ type: sliderNodeName(def.kind), attrs: { attrs: def.defaults } })
            .run();
        },
        isActive: (editor) => (editor as Editor).isActive(sliderNodeName(def.kind)),
        // The EditorInspector's auto-attrs plumbing is bypassed —
        // SliderInspector reads attrs itself off the editor on every
        // render so it picks up updates from other paths (e.g.
        // undo/redo) live.
        inspector: ({ editor }) => (
          <SliderInspector editor={editor as Editor} kind={def.kind} />
        ),
      });
    }

    // Publish-time marker → HTML expansion. Hooks in after
    // DOMPurify-rendered markdown (DOMPurify lets data-* attrs
    // through, so our markers survive sanitization intact).
    api.addFilter<string>("post.html.body", (html) => transformBodyHtml(html));

    // Head: inject the baseline CSS once per page that uses any
    // slider. transforms.ts tracks per-page detection in a module-
    // level boolean, so the publish pipeline order
    // (post.html.body → page.head.extra → page.body.end) keeps the
    // state consistent within one page render.
    api.addFilter<string>("page.head.extra", (current) => {
      const styles = getDetectedStyles();
      if (!styles) return current;
      return [current, styles].filter(Boolean).join("\n");
    });

    // Body end: emits the vanilla-JS runtime once per page.
    api.addFilter<string>("page.body.end", (current) => {
      const script = getDetectedScripts();
      if (!script) return current;
      return [current, script].filter(Boolean).join("\n");
    });
  },
};

// Re-export the slider registry so consumers writing custom demo
// content (or other plugins reaching into this one) can compute the
// marker payload without re-implementing the schema. Not part of the
// public contract — bundled side-effect-free for compatibility.
export { SLIDERS };
export default manifest;
