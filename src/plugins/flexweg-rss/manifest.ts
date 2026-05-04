import i18n from "../../i18n";
import { buildTermUrl, pathToPublicUrl } from "../../core/slug";
import type { ResolvedMenuItem } from "../../core/menuResolver";
import type { Post } from "../../core/types";
import type { MenuFilterContext, MenuJson } from "../../services/menuPublisher";
import type { PublishContext } from "../../services/publisher";
import { updatePluginConfig } from "../../services/settings";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import {
  categoryFeedPath,
  DEFAULT_RSS_CONFIG,
  regenerateForPost,
  SITE_RSS_PATH,
  type RssConfig,
} from "./generator";
import { FlexwegRssSettingsPage } from "./SettingsPage";
import type { PluginManifest } from "../index";
import readme from "./README.md?raw";

const PLUGIN_ID = "flexweg-rss";

// Reads the plugin's effective config from anywhere settings are
// accessible (PublishContext or MenuFilterContext both carry settings).
// Always falls back to defaults so a fresh install still produces sane
// behavior without an explicit save first.
function readConfig(settings: { pluginConfigs?: Record<string, unknown> }): RssConfig {
  const stored = (settings.pluginConfigs ?? {})[PLUGIN_ID];
  return { ...DEFAULT_RSS_CONFIG, ...((stored as Partial<RssConfig>) ?? {}) };
}

// Lifecycle handler shared by publish.complete / post.unpublished /
// post.deleted. Regenerates the site feed (when relevant) and the
// matching category feed, then persists any path-bookkeeping mutations
// (lastPublishedPath updates, dropped feeds for deleted terms).
async function regenerate(post: Post, ctx: PublishContext): Promise<void> {
  if (!ctx.settings.baseUrl) {
    console.warn("[flexweg-rss] skipping regeneration — baseUrl not configured");
    return;
  }
  const config = readConfig(ctx.settings);
  // Only short-circuit when there is genuinely nothing to do; the site
  // feed alone (no category feeds) is still worth regenerating on every
  // publish.
  if (!config.site.enabled && config.categoryFeeds.length === 0) return;
  try {
    const out = await regenerateForPost({
      post,
      posts: ctx.posts,
      terms: ctx.terms,
      media: ctx.media,
      settings: ctx.settings,
      config,
    });
    if (JSON.stringify(out.nextConfig) !== JSON.stringify(config)) {
      // Persist path bookkeeping so a later slug rename or term deletion
      // can clean up correctly on its first regen pass.
      await updatePluginConfig(PLUGIN_ID, out.nextConfig);
    }
  } catch (err) {
    console.error("[flexweg-rss] regeneration failed:", err);
  }
}

// Filter handler that appends RSS feed entries to the resolved footer
// menu. Runs at upload time of /menu.json, so toggling addToFooter +
// saving is enough to push the new shape to the public site (the
// settings page calls publishMenuJson explicitly after save).
function appendFeedFooterItems(menu: MenuJson, ctx: MenuFilterContext): MenuJson {
  const config = readConfig(ctx.settings);
  const baseUrl = (ctx.settings.baseUrl || "").replace(/\/+$/, "");
  // Without a baseUrl we can't compute absolute hrefs — bail and leave
  // the menu untouched. The user will see a baseUrl warning elsewhere
  // when they try to regenerate sitemaps / feeds.
  if (!baseUrl) return menu;

  const extras: ResolvedMenuItem[] = [];
  const labels = (i18n.getResource(i18n.language, PLUGIN_ID, "footerLabels") ??
    en.footerLabels) as typeof en.footerLabels;

  if (config.site.enabled && config.site.addToFooter) {
    extras.push({
      id: `rss-site`,
      label: labels.site,
      href: pathToPublicUrl(baseUrl, SITE_RSS_PATH),
    });
  }
  for (const feed of config.categoryFeeds) {
    if (!feed.addToFooter) continue;
    const term = ctx.terms.find((t) => t.id === feed.termId && t.type === "category");
    if (!term) continue;
    const href = pathToPublicUrl(baseUrl, categoryFeedPath(term.slug));
    // Keep the term archive URL as a sibling reference if a theme ever
    // wants it — for now ResolvedMenuItem only carries the feed link
    // since that's what footer entries point to.
    void buildTermUrl(term);
    extras.push({
      id: `rss-cat-${term.id}`,
      // i18next interpolation is only available through t(), and at this
      // point we don't hold a t() instance — so a tiny manual replace
      // keeps the dependency footprint flat.
      label: labels.category.replace("{{name}}", term.name),
      href,
    });
  }

  if (extras.length === 0) return menu;
  return { ...menu, footer: [...menu.footer, ...extras] };
}

export const manifest: PluginManifest<RssConfig> = {
  id: PLUGIN_ID,
  name: "Flexweg RSS",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Generates an RSS 2.0 feed at /rss.xml plus optional per-category feeds, and can list them in the site footer.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_RSS_CONFIG,
    component: FlexwegRssSettingsPage,
  },
  register(api) {
    // Lifecycle: regenerate the impacted feeds whenever the corpus
    // changes. The publisher patches ctx.posts to reflect the post-
    // transition state before calling doAction, so the feed sees the
    // up-to-date listing without us doing any extra work.
    api.addAction("publish.complete", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
    api.addAction("post.unpublished", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
    api.addAction("post.deleted", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });

    // Footer injection: every menu.json upload runs through this filter,
    // so the public site reflects the addToFooter checkboxes without
    // requiring the user to manually edit MenusPage.
    api.addFilter<MenuJson>("menu.json.resolved", (menu, ...rest) => {
      const ctx = rest[0] as MenuFilterContext | undefined;
      if (!ctx) return menu;
      return appendFeedFooterItems(menu, ctx);
    });
  },
};
