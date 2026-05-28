import type { Post, SeoMeta, SiteSettings, Term } from "./types";

// Editor variant registry — lets plugins contribute "draft variants"
// to the post / page editor. The host page renders a tab strip at the
// top of the editor (above title + slug + WYSIWYG) and swaps the
// entire editor state when the user switches tabs.
//
// Designed for multilang first but reusable for any per-entity branch:
// A/B testing variants, draft versions, multi-author drafts, etc.
//
// Contract: at most ONE provider should return > 1 variant at a time —
// multiple competing variant providers would race for the same tab
// strip. If two providers both return >1, the lower-priority one wins.
//
// The host page provides the WYSIWYG, slug input, title input, hero
// picker etc. exactly once and reuses the same instance across variant
// switches. Providers only define WHAT data each variant carries +
// HOW it's persisted; the chrome is the host's responsibility.

// One tab in the variant strip. `primary: true` means "this is the
// entity's native fields" — saving goes through the host's standard
// updatePost flow. `primary: false` means "this is a side-stored
// variant" — saving goes through the provider's saveFields callback.
export interface EditorVariant {
  id: string;
  label: string;
  // Optional small badge label (e.g. "EN", "1/3", "draft"). Rendered
  // next to the label in a muted pill. Undefined hides the badge.
  badge?: string;
  primary: boolean;
}

// The per-variant data the host page edits. Mirrors the subset of Post
// fields that meaningfully differ across variants — categories, hero,
// tags etc. are shared across all variants and stay on the entity.
export interface VariantFields {
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt?: string;
  seo?: SeoMeta;
}

// Context the host passes to every provider callback. Carries the
// live admin data the provider needs — settings (for reading the
// plugin's own config + checking enabled languages), terms (for
// per-language category slug lookup). Both are sourced from
// `useCmsData()` in the host page.
export interface VariantContext {
  settings: SiteSettings;
  terms: Term[];
}

export interface EditorVariantProvider {
  // Stable id, "<plugin-id>" by convention. The host uses this to
  // distinguish providers if multiple are registered.
  id: string;
  // Reactive enumeration of variants for this entity. The host
  // re-evaluates on every render — keep this O(1).
  listVariants: (entity: Post, ctx: VariantContext) => EditorVariant[];
  // Returns the variant's stored fields, or null when nothing has
  // been saved yet (host renders an empty draft + signals it's empty
  // via the variant's `badge`). Not called for the primary variant
  // (host uses entity's native fields directly).
  loadFields: (
    entity: Post,
    variantId: string,
    ctx: VariantContext,
  ) => VariantFields | null;
  // Persists the variant's fields. Called by the host when the user
  // clicks Save while a non-primary variant is active. Should throw
  // on failure so the host can surface an error toast.
  saveFields: (
    entity: Post,
    variantId: string,
    fields: VariantFields,
    ctx: VariantContext,
  ) => Promise<void>;
  // Optional: returns the URL prefix shown before the editable slug
  // in the inline permalink strip (e.g. "fr/actualites/"). Used so
  // the user sees "fr/actualites/bonjour.html" while editing the FR
  // variant of a categorised post. Falls back to the primary's
  // prefix when undefined.
  getSlugPathPrefix?: (
    entity: Post,
    variantId: string,
    fields: VariantFields,
    ctx: VariantContext,
  ) => string;
  // Optional: returns the URL suffix (typically ".html"). Defaults to
  // ".html" — only override if your variant lives at a different
  // extension.
  getSlugPathSuffix?: (
    entity: Post,
    variantId: string,
    fields: VariantFields,
    ctx: VariantContext,
  ) => string;
  // Optional: validates the variant's draft before save. Returns an
  // i18n-ready error string or null when valid. The host disables
  // the Save button and shows the message inline.
  validate?: (
    entity: Post,
    variantId: string,
    fields: VariantFields,
    ctx: VariantContext,
  ) => string | null;
  priority?: number;
}

const providers = new Map<string, EditorVariantProvider>();
const subscribers = new Set<() => void>();
// Cached snapshot — reference-stable until register/reset.
let snapshotCache: EditorVariantProvider[] | null = null;

function notify(): void {
  snapshotCache = null;
  for (const cb of subscribers) cb();
}

export function subscribeEditorVariantProviders(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function registerEditorVariantProvider(manifest: EditorVariantProvider): void {
  if (providers.has(manifest.id)) {
    console.warn(`Editor variant provider "${manifest.id}" already registered. Overwriting.`);
  }
  providers.set(manifest.id, manifest);
  notify();
}

export function listEditorVariantProviders(): EditorVariantProvider[] {
  if (snapshotCache) return snapshotCache;
  snapshotCache = Array.from(providers.values()).sort(
    (a, b) => (a.priority ?? 100) - (b.priority ?? 100),
  );
  return snapshotCache;
}

export function resetEditorVariantProviders(): void {
  providers.clear();
  notify();
}
