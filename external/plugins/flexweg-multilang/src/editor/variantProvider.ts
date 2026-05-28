import {
  isValidSlug,
  toast,
  updatePost,
  type EditorVariant,
  type EditorVariantProvider,
  type Post,
  type Term,
  type VariantFields,
} from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import type { PostTranslation, TermTranslation } from "../types";

// VariantContext (from the runtime) shape we consume — typed inline to
// avoid having to add it to the stub d.ts file. The host always passes
// `{ settings, terms }` to every callback.
interface VariantCtx {
  settings: import("@flexweg/cms-runtime").SiteSettings;
  terms: Term[];
}

function fieldsFromEntity(
  entity: Post,
  language: string,
  isPrimary: boolean,
): VariantFields | null {
  if (isPrimary) {
    return {
      title: entity.title,
      slug: entity.slug,
      contentMarkdown: entity.contentMarkdown,
      excerpt: entity.excerpt,
      seo: entity.seo,
    };
  }
  const map = entity.translations as Record<string, PostTranslation> | undefined;
  const t = map?.[language];
  if (!t || !t.title) return null;
  return {
    title: t.title ?? "",
    slug: t.slug ?? "",
    contentMarkdown: t.contentMarkdown ?? "",
    excerpt: t.excerpt,
    seo: t.seo,
  };
}

// Small dot-character badge for the tab strip — "★" for primary,
// nothing for filled (host renders a green dot), "○" for empty.
function variantBadge(entity: Post, language: string, isPrimary: boolean): string {
  if (isPrimary) return "★";
  const f = fieldsFromEntity(entity, language, false);
  return f && f.slug && f.title ? "" : "○";
}

export const variantProvider: EditorVariantProvider = {
  id: "flexweg-multilang/languages",
  priority: 50,

  listVariants(entity: Post, ctx: VariantCtx): EditorVariant[] {
    const config = getMultilangConfig(ctx.settings);
    if (config.enabledLanguages.length === 0) return [];
    const out: EditorVariant[] = [];
    const seen = new Set<string>();
    // Primary first, always.
    out.push({
      id: config.primaryLanguage,
      label: config.primaryLanguage.toUpperCase(),
      badge: variantBadge(entity, config.primaryLanguage, true),
      primary: true,
    });
    seen.add(config.primaryLanguage);
    for (const lang of config.enabledLanguages) {
      if (seen.has(lang)) continue;
      seen.add(lang);
      out.push({
        id: lang,
        label: lang.toUpperCase(),
        badge: variantBadge(entity, lang, false),
        primary: false,
      });
    }
    return out;
  },

  loadFields(entity: Post, variantId: string, ctx: VariantCtx): VariantFields | null {
    const config = getMultilangConfig(ctx.settings);
    const primary = isPrimaryLanguage(config, variantId);
    return fieldsFromEntity(entity, variantId, primary);
  },

  validate(
    _entity: Post,
    variantId: string,
    draft: VariantFields,
    ctx: VariantCtx,
  ): string | null {
    const config = getMultilangConfig(ctx.settings);
    if (isPrimaryLanguage(config, variantId)) return null;
    if (!draft.title.trim()) return `Title required for ${variantId.toUpperCase()}.`;
    if (!isValidSlug(draft.slug)) return `Invalid slug for ${variantId.toUpperCase()}.`;
    return null;
  },

  async saveFields(
    entity: Post,
    variantId: string,
    draft: VariantFields,
    ctx: VariantCtx,
  ): Promise<void> {
    const config = getMultilangConfig(ctx.settings);
    if (isPrimaryLanguage(config, variantId)) {
      // Primary variant should never route here — the host saves it
      // via the standard updatePost path.
      return;
    }
    const existing = (entity.translations as Record<string, PostTranslation> | undefined) ?? {};
    // Firestore rejects `undefined` field values, so build the
    // translation object by only including defined keys. The shared
    // PostTranslation type makes excerpt + seo optional, so an empty
    // excerpt simply omits the property instead of carrying undefined.
    const entry: PostTranslation = {
      title: draft.title,
      slug: draft.slug,
      contentMarkdown: draft.contentMarkdown,
    };
    if (draft.excerpt) entry.excerpt = draft.excerpt;
    if (draft.seo) {
      const cleanedSeo: PostTranslation["seo"] = {};
      if (draft.seo.title) cleanedSeo!.title = draft.seo.title;
      if (draft.seo.description) cleanedSeo!.description = draft.seo.description;
      if (draft.seo.ogImage) cleanedSeo!.ogImage = draft.seo.ogImage;
      if (Object.keys(cleanedSeo!).length > 0) entry.seo = cleanedSeo;
    }
    const next: Record<string, PostTranslation> = { ...existing, [variantId]: entry };
    try {
      await updatePost(entity.id, { translations: next });
    } catch (err) {
      toast.error((err as Error).message);
      throw err;
    }
  },

  getSlugPathPrefix(
    entity: Post,
    variantId: string,
    _draft: VariantFields,
    ctx: VariantCtx,
  ): string {
    const config = getMultilangConfig(ctx.settings);
    const langPrefix = isPrimaryLanguage(config, variantId) ? "" : `${variantId}/`;
    // Pages don't carry a category, so the prefix is just the
    // language code.
    if (entity.type !== "post") return langPrefix;
    if (!entity.primaryTermId) return langPrefix;
    const term = ctx.terms.find((t) => t.id === entity.primaryTermId);
    if (!term) return langPrefix;
    // Localised category slug when available; falls back to the
    // primary-language slug. A mixed-locale URL would result if a
    // post is translated but its category isn't — surface that
    // visually by keeping the primary slug.
    const translations = term.translations as
      | Record<string, TermTranslation>
      | undefined;
    const localisedSlug =
      !isPrimaryLanguage(config, variantId) && translations?.[variantId]?.slug;
    const categorySlug = localisedSlug || term.slug;
    return `${langPrefix}${categorySlug}/`;
  },
};
