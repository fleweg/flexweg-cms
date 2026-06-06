import {
  updatePost,
  type AdditionalRender,
  type Post,
  type PublishContext,
} from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  buildLocalizedPostUrl,
  getPostTranslation,
  getTermTranslation,
} from "../core/urls";
import { renderLocalizedSingle } from "./render";
import { refreshAlternatesCache, refreshPathRegistry } from "../core/pathRegistry";

// Handler for the `publish.additional` filter. Returns one
// AdditionalRender per enabled secondary language that has a usable
// translation. Publisher uploads each + tracks orphans by diffing
// `lastPublishedPathsByLocale` against this output.
//
// After publish, persists the resulting paths back to
// `post.lastPublishedPathsByLocale` so the next publish's orphan
// detection has accurate state.
export async function computeAdditional(
  existing: AdditionalRender[],
  post: Post,
  ctx: PublishContext,
): Promise<AdditionalRender[]> {
  const config = getMultilangConfig(ctx.settings);
  if (config.enabledLanguages.length === 0) return existing;

  // Refresh the path / alternates caches synchronously before any
  // rendering. The `page.head.extra` filter (which injects hreflang
  // tags) runs DURING renderLocalizedSingle below and reads from this
  // cache — without a refresh here, the very first publish of a new
  // translation would produce a page without hreflang because the
  // cache hasn't been touched since the last publish.complete.
  refreshPathRegistry(ctx.posts, ctx.pages, ctx.terms, ctx.settings, config);
  refreshAlternatesCache(ctx.posts, ctx.pages, ctx.terms, config);

  const out: AdditionalRender[] = [...existing];
  const newPaths: Record<string, string> = {};
  const primaryTerm = post.primaryTermId
    ? ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;

  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    const trans = getPostTranslation(post, language);
    if (!trans) continue;
    // A post with a category but no category translation in this
    // language is skipped — translating the post but leaving the
    // category untranslated would produce mixed-locale URLs.
    const termTrans = primaryTerm ? getTermTranslation(primaryTerm, language) : undefined;
    if (primaryTerm && !termTrans) continue;

    const path = buildLocalizedPostUrl({
      post,
      trans,
      primaryTermTrans: termTrans ?? undefined,
      primaryTermSlug: primaryTerm?.slug,
      language,
      config,
    });
    const html = await renderLocalizedSingle({
      post,
      trans,
      termTrans: termTrans ?? undefined,
      language,
      ctx,
      config,
    });
    out.push({ path, html });
    newPaths[language] = path;
  }

  // Persist the new map of `language → path` back on the post so the
  // publisher's orphan-cleanup on the next publish has the correct
  // baseline. Fire-and-forget — a failure here only delays cleanup
  // by one publish (the orphan will still be detected on the
  // subsequent publish through `previousPublishedPaths`).
  try {
    await updatePost(post.id, { lastPublishedPathsByLocale: newPaths });
  } catch {
    // Ignore — orphan detection is best-effort across boundary failures.
  }

  return out;
}
