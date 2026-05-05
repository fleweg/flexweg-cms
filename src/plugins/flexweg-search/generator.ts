// Search index + runtime generator for flexweg-search.
//
// Public regeneration entry points:
//   - regenerateIndex   — rebuilds search-index.json from the corpus
//                         and uploads it. Hash-checked: skips upload
//                         when the freshly built JSON matches the
//                         previously uploaded one.
//   - ensureRuntime     — uploads search.js if its hash has changed
//                         since the last upload (or if never uploaded).
//                         Called on first publish + Force regenerate.
//   - regenerateAll     — both, used by the SettingsPage Force button.
//
// All helpers take the live config and return the next config so the
// caller can persist `lastIndexHash`, `lastRuntimeHash` and
// `lastIndexedAt` to Firestore. The manifest does that on every
// successful regeneration.

import i18n, { pickPublicLocale } from "../../i18n";
import { buildPostUrl } from "../../core/slug";
import { markdownToPlainText } from "../../core/markdown";
import { sha256Hex } from "../../lib/utils";
import { uploadFile } from "../../services/flexwegApi";
import type { Post, SiteSettings, Term } from "../../core/types";
import {
  DEFAULT_SEARCH_CONFIG,
  PLUGIN_ID,
  SEARCH_INDEX_PATH,
  SEARCH_RUNTIME_PATH,
  type SearchConfig,
} from "./config";
import { en } from "./i18n";
// Embedded at bundle time; uploaded verbatim to /search.js. Re-bundling
// the admin produces a new string here, lastRuntimeHash detects the
// change on the next regeneration pass.
import searchRuntimeJs from "./search-runtime.js?raw";

export interface IndexItem {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  // Epoch ms — used by clients that want to display "Most recent first".
  publishedAt?: number;
}

export interface IndexMeta {
  minQueryLength: number;
  maxResults: number;
  // UI strings baked into the JSON so the runtime JS doesn't need an
  // i18n library on the public side. Resolved through pickPublicLocale
  // → the matching plugin i18n bundle.
  placeholder: string;
  close: string;
  noResults: string;
  dialogLabel: string;
  // Generation timestamp — useful for debugging cache issues.
  generatedAt: number;
}

export interface SearchIndexFile {
  meta: IndexMeta;
  items: IndexItem[];
}

interface BuildIndexEnv {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  settings: SiteSettings;
  config: SearchConfig;
}

type RuntimeStrings = Pick<IndexMeta, "placeholder" | "close" | "noResults" | "dialogLabel">;

// Picks the localised runtime strings from the plugin's i18n bundle.
// Falls back to the English defaults if a key is missing for the chosen
// locale (impossible in practice — we guarantee parity in i18n.ts —
// but kept so a future bundle desync doesn't break public-side strings).
function readRuntimeStrings(language: string | undefined): RuntimeStrings {
  const locale = pickPublicLocale(language);
  const ns = PLUGIN_ID;
  const fallback = en.runtime;
  return {
    placeholder:
      (i18n.getResource(locale, ns, "runtime.placeholder") as string | undefined) ??
      fallback.placeholder,
    close:
      (i18n.getResource(locale, ns, "runtime.close") as string | undefined) ??
      fallback.close,
    noResults:
      (i18n.getResource(locale, ns, "runtime.noResults") as string | undefined) ??
      fallback.noResults,
    dialogLabel:
      (i18n.getResource(locale, ns, "runtime.dialogLabel") as string | undefined) ??
      fallback.dialogLabel,
  };
}

// Builds the in-memory index from the corpus. Pure — no IO, easy to
// unit-test if needed later.
export function buildIndex(env: BuildIndexEnv): SearchIndexFile {
  const { posts, pages, terms, settings, config } = env;
  const excluded = new Set(config.excludedTermIds);
  const sources: Post[] = [];
  for (const p of posts) {
    if (p.status !== "online") continue;
    if (p.primaryTermId && excluded.has(p.primaryTermId)) continue;
    sources.push(p);
  }
  if (config.includePages) {
    for (const p of pages) {
      if (p.status !== "online") continue;
      sources.push(p);
    }
  }

  // Newest first — clients can rely on this ordering for
  // "recently published" affordances without re-sorting.
  sources.sort((a, b) => {
    const bms = b.publishedAt?.toMillis?.() ?? b.updatedAt?.toMillis?.() ?? 0;
    const ams = a.publishedAt?.toMillis?.() ?? a.updatedAt?.toMillis?.() ?? 0;
    return bms - ams;
  });

  const termById = new Map<string, Term>();
  for (const t of terms) termById.set(t.id, t);

  const items: IndexItem[] = sources.map((p) => {
    const primary = p.primaryTermId ? termById.get(p.primaryTermId) : undefined;
    const item: IndexItem = {
      id: p.id,
      title: p.title,
      url: buildPostUrl({ post: p, primaryTerm: primary?.type === "category" ? primary : undefined }),
    };
    if (config.indexExcerpt) {
      // Fall back to a 200-char plain-text rendering of the body when
      // the post has no explicit excerpt — better signal than dropping
      // the field entirely.
      const excerpt = (p.excerpt && p.excerpt.trim()) ||
        markdownToPlainText(p.contentMarkdown ?? "", 200);
      if (excerpt) item.excerpt = excerpt;
    }
    if (config.indexCategory && primary?.type === "category") {
      item.category = primary.name;
    }
    if (config.indexTags && p.termIds && p.termIds.length) {
      const tagNames: string[] = [];
      for (const id of p.termIds) {
        const t = termById.get(id);
        if (t && t.type === "tag") tagNames.push(t.name);
      }
      if (tagNames.length) item.tags = tagNames;
    }
    const ms = p.publishedAt?.toMillis?.() ?? p.updatedAt?.toMillis?.();
    if (typeof ms === "number") item.publishedAt = ms;
    return item;
  });

  const meta: IndexMeta = {
    minQueryLength: config.minQueryLength,
    maxResults: config.maxResults,
    ...readRuntimeStrings(settings.language),
    generatedAt: Date.now(),
  };

  return { meta, items };
}

// Hashes the JSON without the volatile `generatedAt` so we don't
// re-upload on every publish just because of the timestamp. Two
// regeneration passes producing the same logical index will hash to
// the same value and skip the upload.
function hashIndex(file: SearchIndexFile): Promise<string> {
  const stable = {
    meta: { ...file.meta, generatedAt: 0 },
    items: file.items,
  };
  return sha256Hex(JSON.stringify(stable));
}

interface RegenerateResult {
  // The config the caller should persist after a successful pass.
  // Always returned, even when the upload was skipped — captures the
  // hash + timestamp updates.
  nextConfig: SearchConfig;
  // True when at least one file was actually uploaded. The settings
  // page uses this to decide between a "regenerated" toast and a
  // quieter "already up to date".
  uploaded: boolean;
}

export interface RegenerateIndexInput {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  settings: SiteSettings;
  config: SearchConfig;
}

export async function regenerateIndex(input: RegenerateIndexInput): Promise<RegenerateResult> {
  const file = buildIndex({
    posts: input.posts,
    pages: input.pages,
    terms: input.terms,
    settings: input.settings,
    config: input.config,
  });
  const nextHash = await hashIndex(file);
  const merged = { ...DEFAULT_SEARCH_CONFIG, ...input.config };
  if (merged.lastIndexHash === nextHash) {
    // Skip the upload — keep the previous timestamp untouched so
    // "last indexed" reflects the actual last write, not a no-op.
    return { nextConfig: merged, uploaded: false };
  }
  await uploadFile({
    path: SEARCH_INDEX_PATH,
    content: JSON.stringify(file),
    encoding: "utf-8",
  });
  return {
    nextConfig: { ...merged, lastIndexHash: nextHash, lastIndexedAt: Date.now() },
    uploaded: true,
  };
}

// Uploads /search.js when its bundle-time hash has changed since the
// last upload. Keeps the runtime in sync with admin redeploys without
// re-uploading on every publish.
export async function ensureRuntime(config: SearchConfig): Promise<RegenerateResult> {
  const nextHash = await sha256Hex(searchRuntimeJs);
  const merged = { ...DEFAULT_SEARCH_CONFIG, ...config };
  if (merged.lastRuntimeHash === nextHash) {
    return { nextConfig: merged, uploaded: false };
  }
  await uploadFile({
    path: SEARCH_RUNTIME_PATH,
    content: searchRuntimeJs,
    encoding: "utf-8",
  });
  return { nextConfig: { ...merged, lastRuntimeHash: nextHash }, uploaded: true };
}

// Force pass used by the Force regenerate button: always uploads both
// files. Useful when the admin wants to push fresh runtime strings
// (e.g. after switching `settings.language`) or when the user has
// reason to suspect the public site is out of sync.
export async function regenerateAll(input: RegenerateIndexInput): Promise<RegenerateResult> {
  const file = buildIndex({
    posts: input.posts,
    pages: input.pages,
    terms: input.terms,
    settings: input.settings,
    config: input.config,
  });
  const nextIndexHash = await hashIndex(file);
  const nextRuntimeHash = await sha256Hex(searchRuntimeJs);
  await uploadFile({
    path: SEARCH_INDEX_PATH,
    content: JSON.stringify(file),
    encoding: "utf-8",
  });
  await uploadFile({
    path: SEARCH_RUNTIME_PATH,
    content: searchRuntimeJs,
    encoding: "utf-8",
  });
  return {
    nextConfig: {
      ...DEFAULT_SEARCH_CONFIG,
      ...input.config,
      lastIndexHash: nextIndexHash,
      lastRuntimeHash: nextRuntimeHash,
      lastIndexedAt: Date.now(),
    },
    uploaded: true,
  };
}
