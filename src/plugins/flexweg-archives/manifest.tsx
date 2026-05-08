import type {
  PluginManifest,
  Post,
  PublishContext,
} from "@flexweg/cms-runtime";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import {
  type ArchivesConfig,
  DEFAULT_ARCHIVES_CONFIG,
  forceRegenerate,
  PLUGIN_ID,
  regenerateForPost,
} from "./generator";
import { ArchivesSettingsPage } from "./SettingsPage";
import readme from "./README.md?raw";

// Lifecycle hook handler. Called from publish.complete /
// post.unpublished / post.deleted with the touched post and the
// just-patched PublishContext (where ctx.posts reflects the new
// state of the post). Re-derives the affected periods, regenerates
// or deletes the corresponding archive pages, and re-renders the
// top-level index.
async function regenerate(post: Post, ctx: PublishContext): Promise<void> {
  try {
    await regenerateForPost({
      post,
      posts: ctx.posts,
      pages: ctx.pages,
      terms: ctx.terms,
      settings: ctx.settings,
    });
  } catch (err) {
    // Best-effort: a failed archive regen shouldn't take down the
    // surrounding publish/unpublish action. The flexwegApi error
    // funnel already toasted the underlying HTTP error; we log here
    // so the user can correlate via devtools if they investigate.
    console.error("[flexweg-archives] regeneration failed:", err);
  }
}

export const manifest: PluginManifest<ArchivesConfig> = {
  id: PLUGIN_ID,
  name: "Flexweg Archives",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Generates static archive pages grouped by year (and optionally month or ISO week) and adds a 'See full archives' link to home / category listings — a static-friendly alternative to pagination.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_ARCHIVES_CONFIG,
    component: ArchivesSettingsPage,
  },
  register(api) {
    api.addAction("publish.complete", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
    api.addAction("post.unpublished", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });
    api.addAction("post.deleted", async (postRaw, ctxRaw) => {
      await regenerate(postRaw as Post, ctxRaw as PublishContext);
    });

    // Themes ▸ Regenerate ▾ entry. Wipes /archives/ and rebuilds
    // every period page + the index. Same payload as the SettingsPage's
    // Force regenerate button — minus the SettingsPage draft state.
    api.registerRegenerationTarget({
      id: PLUGIN_ID,
      labelKey: "regenerationTarget.label",
      descriptionKey: "regenerationTarget.description",
      priority: 230,
      run: async (ctx, log) => {
        log({ level: "info", message: "Regenerating archive pages…" });
        const result = await forceRegenerate({
          posts: ctx.posts,
          pages: ctx.pages,
          terms: ctx.terms,
          settings: ctx.settings,
        });
        log({
          level: "success",
          message: `Archives: ${result.uploaded.length} uploaded, ${result.deleted.length} removed.`,
        });
      },
    });
  },
};
