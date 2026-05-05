import type { BaseLayoutProps } from "../../themes/types";
import type { Post } from "../../core/types";
import type { PublishContext } from "../../services/publisher";
import { updatePluginConfig } from "../../services/settings";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import {
  DEFAULT_SEARCH_CONFIG,
  PLUGIN_ID,
  SEARCH_RUNTIME_PATH,
  type SearchConfig,
} from "./config";
import { ensureRuntime, regenerateIndex } from "./generator";
import { FlexwegSearchSettingsPage } from "./SettingsPage";
import type { PluginManifest } from "../index";
import readme from "./README.md?raw";

// Resolves the live config from a publish-time context. Falls back to
// defaults so a fresh install still produces a sane index without an
// explicit save first.
function readConfig(settings: { pluginConfigs?: Record<string, unknown> }): SearchConfig {
  const stored = (settings.pluginConfigs ?? {})[PLUGIN_ID];
  return { ...DEFAULT_SEARCH_CONFIG, ...((stored as Partial<SearchConfig>) ?? {}) };
}

// Lifecycle handler — regenerates the search index on every publish
// transition and (the first time, then whenever the bundle changes the
// runtime JS) re-uploads /search.js. Persists the resulting hashes back
// to Firestore so the next pass can skip the upload when nothing changed.
//
// Errors are logged + swallowed: a failed search regen must not abort
// the publish action chain that triggered it.
async function regenerate(_post: Post, ctx: PublishContext): Promise<void> {
  if (!ctx.settings.baseUrl) {
    console.warn("[flexweg-search] skipping regeneration — baseUrl not configured");
    return;
  }
  let config = readConfig(ctx.settings);
  try {
    const runtimePass = await ensureRuntime(config);
    config = runtimePass.nextConfig;
    const indexPass = await regenerateIndex({
      posts: ctx.posts,
      pages: ctx.pages,
      terms: ctx.terms,
      settings: ctx.settings,
      config,
    });
    config = indexPass.nextConfig;
    if (runtimePass.uploaded || indexPass.uploaded) {
      await updatePluginConfig(PLUGIN_ID, config);
    }
  } catch (err) {
    console.error("[flexweg-search] regeneration failed:", err);
  }
}

export const manifest: PluginManifest<SearchConfig> = {
  id: PLUGIN_ID,
  name: "Flexweg Search",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Generates /search-index.json + a search runtime that opens a modal anywhere a [data-cms-search] trigger is present in your theme.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_SEARCH_CONFIG,
    component: FlexwegSearchSettingsPage,
  },
  register(api) {
    // Lifecycle: keep search-index.json in sync with every corpus
    // mutation. The publisher patches ctx.posts to reflect the post-
    // transition state before doAction fires, so the index sees the
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

    // Inject the runtime <script> on every page. We don't gate on
    // `lastRuntimeHash` — the very first publish uploads the runtime
    // file right after the page itself, and subsequent loads find it.
    // The brief between-uploads window in which a visitor could 404
    // on /search.js is acceptable: the page itself stays valid (the
    // browser ignores the failing script) and the next reload works.
    api.addFilter<string>("page.body.end", (current, ...rest) => {
      const props = rest[0] as BaseLayoutProps | undefined;
      void props;
      const tag = `<script src="/${SEARCH_RUNTIME_PATH}" defer></script>`;
      return [current, tag].filter(Boolean).join("");
    });
  },
};
