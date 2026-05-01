import type { PluginManifest } from "../index";
import type { Post } from "../../core/types";
import type { PublishContext } from "../../services/publisher";
import { en, fr } from "./i18n";
import {
  DEFAULT_SITEMAPS_CONFIG,
  regenerateForPost,
  type SitemapsConfig,
} from "./generator";
import { SitemapsSettingsPage } from "./SettingsPage";

// Reads the plugin's effective config out of the publish context's settings.
// Always falls back to the manifest defaults so a fresh install (no entry
// in pluginConfigs yet) still produces sensible output instead of throwing.
function readConfig(ctx: PublishContext): SitemapsConfig {
  const stored = (ctx.settings.pluginConfigs as Record<string, unknown> | undefined)?.[
    "flexweg-sitemaps"
  ];
  return { ...DEFAULT_SITEMAPS_CONFIG, ...((stored as Partial<SitemapsConfig>) ?? {}) };
}

// Common handler shared by publish.complete / post.unpublished / post.deleted.
// All three of these events change the corpus from a sitemap point of view,
// so the response is identical: regenerate the year sitemap + index +
// news. Failures are caught and logged so a Flexweg hiccup never aborts
// the surrounding publish flow (regenerateForPost itself surfaces the
// error via the global toast funnel inside flexwegApi).
async function regenerate(post: Post, ctx: PublishContext): Promise<void> {
  if (!ctx.settings.baseUrl) {
    console.warn("[flexweg-sitemaps] skipping regeneration — baseUrl not configured");
    return;
  }
  try {
    await regenerateForPost({
      post,
      posts: ctx.posts,
      pages: ctx.pages,
      terms: ctx.terms,
      settings: ctx.settings,
      config: readConfig(ctx),
    });
  } catch (err) {
    console.error("[flexweg-sitemaps] regeneration failed:", err);
  }
}

export const manifest: PluginManifest<SitemapsConfig> = {
  id: "flexweg-sitemaps",
  name: "Flexweg Sitemaps",
  version: "1.0.0",
  description:
    "Generates sitemap-index.xml, per-year sitemaps, an optional Google News sitemap, and a robots.txt that points to them.",
  i18n: { en, fr },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_SITEMAPS_CONFIG,
    component: SitemapsSettingsPage,
  },
  register(api) {
    // All three lifecycle events drive the same regeneration. The publisher
    // patches ctx.posts/pages with the post-transition state before calling
    // doAction, so the corpus we read here always matches what the public
    // site will look like once this hook returns.
    api.addAction("publish.complete", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
    api.addAction("post.unpublished", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
    api.addAction("post.deleted", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
  },
};
