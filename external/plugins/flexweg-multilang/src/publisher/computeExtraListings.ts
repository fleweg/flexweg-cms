import type { AdditionalListingRender, PublishContext } from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  buildLocalizedHomePath,
  buildLocalizedTermUrl,
  getTermTranslation,
} from "../core/urls";
import { renderLocalizedCategory, renderLocalizedHome } from "./render";
import { refreshAlternatesCache, refreshPathRegistry } from "../core/pathRegistry";

// Handler for `publish.extraListings` — returns per-language homes +
// category archives so the publisher uploads them alongside the
// primary listings on every `regenerateListings` pass. Per-language
// listings are cheap because they're driven by the same in-memory
// posts list; the heavy lifting is the per-post single rendering
// already handled by `publish.additional`.
export async function computeExtraListings(
  existing: AdditionalListingRender[],
  ctx: PublishContext,
): Promise<AdditionalListingRender[]> {
  const config = getMultilangConfig(ctx.settings);
  if (config.enabledLanguages.length === 0) return existing;

  // Same registry refresh as `computeAdditional` — `page.head.extra`
  // reads from this cache during the home / category render below.
  refreshPathRegistry(ctx.posts, ctx.pages, ctx.terms, ctx.settings, config);
  refreshAlternatesCache(ctx.posts, ctx.pages, ctx.terms, config);

  const out: AdditionalListingRender[] = [...existing];

  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    // Home — async because the publisher's renderHome is async.
    const homePath = buildLocalizedHomePath(language, config);
    const homeHtml = await renderLocalizedHome({ language, ctx, config });
    out.push({ path: homePath, html: homeHtml });

    // Category archives — one per category that has a translation
    // for this language.
    for (const term of ctx.terms) {
      if (term.type !== "category") continue;
      const termTrans = getTermTranslation(term, language);
      if (!termTrans) continue;
      const path = buildLocalizedTermUrl(term, termTrans, language, config);
      const html = renderLocalizedCategory({ term, termTrans, language, ctx, config });
      out.push({ path, html });
    }
  }

  return out;
}
