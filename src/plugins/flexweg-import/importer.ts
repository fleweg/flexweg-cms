// Two-phase importer (scan + run) shared by the Flexweg-folder
// path and the drag-drop UI. Both feed the same ImportBundle, so
// every guarantee made by the dry-run is honored by the run.

import {
  parseSources,
  type ParsedEntry,
  type ParsedTerm,
  type ParseWarning,
  type SourceFile,
  type WordPressAttachment,
} from "./parsers";
import { slugify, isValidSlug, findAvailableSlug } from "../../core/slug";
import type { Media, Post, SiteSettings, Term, UserRecord } from "../../core/types";
import { uploadMedia } from "../../services/media";
import { createPost } from "../../services/posts";
import { createTerm } from "../../services/taxonomies";
import { publishPost, buildPublishContext } from "../../services/publisher";
import { buildAuthorLookup } from "../../services/users";
import {
  deleteFile,
  getFile,
  listFiles,
  publicUrlFor,
  renameFile,
  uploadFile,
} from "../../services/flexwegApi";

// ─── Public types ──────────────────────────────────────────────────

export const IMPORT_FOLDER = "_cms-import";
export const IMPORT_IMAGES_FOLDER = `${IMPORT_FOLDER}/images`;

export type StatusMode = "draft" | "from-source" | "online";

export interface ImportOptions {
  // What to do with each entry's `status` field at the end.
  statusMode: StatusMode;
  // Default category name applied when an entry has none. Empty
  // string disables the fallback (entries without a category stay
  // un-categorised).
  defaultCategory: string;
  // Folder mode only: archive imported sources to a timestamped
  // subfolder so re-clicking Import doesn't re-process them.
  moveProcessedFiles: boolean;
  // Concurrency cap for fetching WordPress attachments — protects
  // the source WP site from being hammered. Local images use the
  // same value but the bound matters less there.
  imageFetchConcurrency: number;
}

export const DEFAULT_IMPORT_OPTIONS: ImportOptions = {
  statusMode: "draft",
  defaultCategory: "",
  moveProcessedFiles: true,
  imageFetchConcurrency: 4,
};

// One file the user wants imported. The dropzone produces these
// directly; the folder lister builds them by getFile()-ing each
// .md/.xml under IMPORT_FOLDER.
export interface SourceFileInput {
  name: string; // basename, e.g. "post-1.md" or "wp-export.xml"
  content: string;
}

// In-memory image. Folder mode fills this by fetching the public
// URL of each image in IMPORT_IMAGES_FOLDER; drop mode fills it
// directly from the dropped File handles.
export interface ImageInput {
  filename: string; // basename, e.g. "cover.jpg"
  blob: Blob;
}

export interface ImportBundle {
  // Where the bundle came from. Drives the cleanup behaviour at
  // the end of the run (folder mode archives processed files;
  // drop mode skips that step).
  source: "folder" | "drop";
  markdown: SourceFileInput[];
  xml: SourceFileInput[];
  images: ImageInput[];
}

// One row in the dry-run summary table. Resolved means "this is
// the final shape we'll persist if the user confirms" — including
// auto-slugged collisions, hierarchy mappings, etc.
export interface ResolvedEntry {
  source: ParsedEntry;
  // Final slug after collision resolution against the existing
  // corpus + sibling batch entries.
  finalSlug: string;
  // True when the slug had to be suffixed (`-2`, `-3`, …).
  slugWasModified: boolean;
  // Resolved primary category (when set). references can be:
  //   - existing — points at a Term already in the corpus
  //   - new — points at one of `categoriesToCreate`
  //   - undefined — entry has no category (user picked default off)
  categoryRef?: { kind: "existing"; termId: string } | { kind: "new"; slug: string };
  // Resolved tag refs (same shape as category, one per tag).
  tagRefs: ({ kind: "existing"; termId: string } | { kind: "new"; slug: string })[];
  // Final author id (existing user) or "self" (importer's own id —
  // resolved at run-time from the importer's user record).
  authorRef: { kind: "existing"; userId: string } | { kind: "self" };
}

export interface DryRunSummary {
  entries: ResolvedEntry[];
  // Categories that will be created. Keyed by final slug — that's
  // unique. Includes already-existing parents collapsed via the
  // hierarchy resolver (the parent might be new or existing).
  categoriesToCreate: ParsedTerm[];
  tagsToCreate: ParsedTerm[];
  // Number of unique image filenames the run will upload. Includes
  // dedup against existing media docs.
  imagesToUpload: { filename: string; bytes: number; remote: boolean }[];
  // WP attachments referenced by entries (heroImage, inline images)
  // that match an entry in attachments[]. URL-keyed.
  wpAttachmentsToFetch: WordPressAttachment[];
  // Errors from parsers + resolution.  Errors are blocking;
  // warnings are not.
  warnings: ParseWarning[];
}

export interface RunResult {
  createdPostIds: string[];
  createdTermIds: string[];
  uploadedMediaIds: string[];
  publishedPostIds: string[];
  warnings: ParseWarning[];
  errors: ParseWarning[];
}

// ─── Folder loader ─────────────────────────────────────────────────

export interface FolderListing {
  markdownFiles: { path: string; name: string }[];
  xmlFiles: { path: string; name: string }[];
  imageFiles: { path: string; name: string; bytes: number }[];
}

// Walks the Flexweg `_cms-import/` folder via listFiles() pagination
// and returns the discovered files grouped by kind. Image files at
// any depth under IMAGES_FOLDER count; everything else stays at the
// root of IMPORT_FOLDER (we do NOT recurse into processed-* archives).
export async function listImportFolder(): Promise<FolderListing> {
  const markdownFiles: FolderListing["markdownFiles"] = [];
  const xmlFiles: FolderListing["xmlFiles"] = [];
  const imageFiles: FolderListing["imageFiles"] = [];

  // Pagination through every page until empty. listFiles returns
  // the entire site contents; we filter by path prefix.
  let page = 1;
  for (;;) {
    const res = await listFiles(page, 100);
    if (res.items.length === 0) break;
    for (const item of res.items) {
      if (item.type !== "file") continue;
      if (!item.path.startsWith(`${IMPORT_FOLDER}/`)) continue;
      // Skip anything inside a processed-<timestamp>/ archive.
      const rel = item.path.slice(IMPORT_FOLDER.length + 1);
      if (rel.startsWith("processed-")) continue;
      const name = rel.split("/").pop() ?? rel;
      const ext = name.split(".").pop()?.toLowerCase() ?? "";
      if (rel.startsWith("images/") && /^(jpe?g|png|webp|svg|gif)$/i.test(ext)) {
        imageFiles.push({ path: item.path, name, bytes: item.size ?? 0 });
      } else if (ext === "md" && !rel.includes("/")) {
        // Skip README/readme files — they're documentation that
        // users routinely drop alongside the actual content (and
        // the importer's own example bundle ships one).
        if (/^readme\.md$/i.test(name)) continue;
        markdownFiles.push({ path: item.path, name });
      } else if (ext === "xml" && !rel.includes("/")) {
        xmlFiles.push({ path: item.path, name });
      }
    }
    if (res.items.length < (res.per_page ?? 100)) break;
    page++;
  }

  return { markdownFiles, xmlFiles, imageFiles };
}

// Builds an ImportBundle from the Flexweg folder. Downloads each
// .md/.xml as text and each image as a Blob.
export async function buildBundleFromFolder(): Promise<ImportBundle> {
  const listing = await listImportFolder();
  const markdown = await Promise.all(
    listing.markdownFiles.map(async (f) => ({
      name: f.name,
      content: await getFile(f.path),
    })),
  );
  const xml = await Promise.all(
    listing.xmlFiles.map(async (f) => ({
      name: f.name,
      content: await getFile(f.path),
    })),
  );
  // Images come down via the public URL, not getFile() — getFile
  // reads as text, which corrupts binary data.
  const images = await Promise.all(
    listing.imageFiles.map(async (f) => {
      const url = await publicUrlFor(f.path);
      const res = await fetch(url);
      const blob = await res.blob();
      return { filename: f.name, blob };
    }),
  );
  return { source: "folder", markdown, xml, images };
}

// ─── Scan (dry-run) ────────────────────────────────────────────────

export interface ScanContext {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  media: Media[];
  users: UserRecord[];
  importerUserId: string;
}

export function scanBundle(bundle: ImportBundle, ctx: ScanContext, options: ImportOptions): DryRunSummary {
  const sources: SourceFile[] = [
    ...bundle.markdown.map<SourceFile>((m) => ({
      kind: "markdown",
      name: m.name,
      content: m.content,
    })),
    ...bundle.xml.map<SourceFile>((x) => ({
      kind: "wordpress",
      name: x.name,
      content: x.content,
    })),
  ];
  const parsed = parseSources(sources);
  const warnings: ParseWarning[] = [...parsed.warnings];

  // ─── Resolve categories: hierarchy + new vs existing ────────────
  const existingCategoryBySlug = new Map<string, Term>();
  const existingTagBySlug = new Map<string, Term>();
  for (const t of ctx.terms) {
    if (t.type === "category") existingCategoryBySlug.set(t.slug, t);
    else existingTagBySlug.set(t.slug, t);
  }

  // Markdown entries don't preregister terms — we discover them per
  // entry as we resolve. WP entries DO arrive with a parsed.terms
  // list (declared up-front in the channel). Merge: parsed.terms
  // become the seed; markdown adds on top.
  const allParsedTerms = new Map<string, ParsedTerm>();
  for (const t of parsed.terms) {
    allParsedTerms.set(`${t.type}:${t.slug}`, t);
  }
  // Walk markdown entries to discover categories + tags they
  // reference but parsed.terms didn't list.
  for (const entry of parsed.entries) {
    if (entry.sourceFormat !== "markdown") continue;
    if (entry.categoryName) {
      const slug = slugify(entry.categoryName);
      const key = `category:${slug}`;
      if (!allParsedTerms.has(key) && !existingCategoryBySlug.has(slug)) {
        const parentSlug = entry.parentCategoryName
          ? slugify(entry.parentCategoryName)
          : undefined;
        allParsedTerms.set(key, {
          slug,
          name: entry.categoryName,
          parentSlug,
          type: "category",
        });
        // Also register the parent if not already known.
        if (parentSlug && !allParsedTerms.has(`category:${parentSlug}`) &&
            !existingCategoryBySlug.has(parentSlug)) {
          allParsedTerms.set(`category:${parentSlug}`, {
            slug: parentSlug,
            name: entry.parentCategoryName!,
            type: "category",
          });
        }
      }
    }
    for (const tag of entry.tags) {
      const slug = slugify(tag);
      const key = `tag:${slug}`;
      if (!allParsedTerms.has(key) && !existingTagBySlug.has(slug)) {
        allParsedTerms.set(key, { slug, name: tag, type: "tag" });
      }
    }
  }

  // Default category fallback. When the user set one in options and
  // an entry has no category, we treat it as that category — which
  // may need creating itself.
  const defaultCategorySlug = options.defaultCategory
    ? slugify(options.defaultCategory)
    : "";
  if (defaultCategorySlug) {
    const key = `category:${defaultCategorySlug}`;
    if (!allParsedTerms.has(key) && !existingCategoryBySlug.has(defaultCategorySlug)) {
      allParsedTerms.set(key, {
        slug: defaultCategorySlug,
        name: options.defaultCategory,
        type: "category",
      });
    }
  }

  // Detect parent cycles inside the to-be-created set. Cycles can
  // only form between new terms — existing terms are already
  // internally consistent (Firestore enforces no orphaned ids
  // through the admin UI). Walk the new-terms parent chain only;
  // bail out as soon as we leave the new set.
  const categoriesToCreate: ParsedTerm[] = [];
  const tagsToCreate: ParsedTerm[] = [];
  for (const term of allParsedTerms.values()) {
    if (term.type === "tag") {
      tagsToCreate.push(term);
      continue;
    }
    if (term.parentSlug) {
      const seen = new Set<string>([term.slug]);
      let cursor: string | undefined = term.parentSlug;
      let cycle = false;
      while (cursor) {
        if (seen.has(cursor)) {
          cycle = true;
          break;
        }
        seen.add(cursor);
        const parent = allParsedTerms.get(`category:${cursor}`);
        if (!parent) break; // hit an existing term — chain can't loop back
        cursor = parent.parentSlug;
      }
      if (cycle) {
        warnings.push({
          level: "warning",
          source: term.slug,
          message: `Category hierarchy cycle detected — flattening "${term.name}" to top level.`,
        });
        categoriesToCreate.push({ ...term, parentSlug: undefined });
        continue;
      }
    }
    categoriesToCreate.push(term);
  }

  // ─── Slug collision: existing posts + sibling batch ─────────────
  const existingSlugs = new Set<string>([
    ...ctx.posts.map((p) => p.slug),
    ...ctx.pages.map((p) => p.slug),
  ]);
  // Include slugs we're about to add this batch so two same-titled
  // entries in the same import don't collide silently.
  const usedSlugsInBatch = new Set<string>();

  // ─── Resolve entries ────────────────────────────────────────────
  const entries: ResolvedEntry[] = [];
  for (const entry of parsed.entries) {
    if (!entry.title) continue; // already produced an error warning

    // Slug. findAvailableSlug expects isUsed(slug) to return TRUE
    // when the slug is taken — invert here would loop the whole
    // 1..1000 attempt range and dead-end on a Date.now() fallback.
    const requested = entry.slug && isValidSlug(entry.slug) ? entry.slug : slugify(entry.title);
    const taken = new Set([...existingSlugs, ...usedSlugsInBatch]);
    const finalSlug = findAvailableSlug(requested, (s) => taken.has(s));
    usedSlugsInBatch.add(finalSlug);
    const slugWasModified = finalSlug !== requested;
    if (slugWasModified) {
      warnings.push({
        level: "warning",
        source: entry.sourceName,
        message: `Slug "${requested}" already in use — saved as "${finalSlug}".`,
      });
    }

    // Category resolution
    let categoryRef: ResolvedEntry["categoryRef"];
    const catName = entry.categoryName || options.defaultCategory;
    if (catName) {
      const catSlug = slugify(catName);
      const existing = existingCategoryBySlug.get(catSlug);
      if (existing) {
        categoryRef = { kind: "existing", termId: existing.id };
      } else if (allParsedTerms.has(`category:${catSlug}`)) {
        categoryRef = { kind: "new", slug: catSlug };
      }
    }

    // Tag resolution
    const tagRefs: ResolvedEntry["tagRefs"] = [];
    for (const tag of entry.tags) {
      const tagSlug = slugify(tag);
      const existing = existingTagBySlug.get(tagSlug);
      if (existing) tagRefs.push({ kind: "existing", termId: existing.id });
      else if (allParsedTerms.has(`tag:${tagSlug}`))
        tagRefs.push({ kind: "new", slug: tagSlug });
    }

    // Author resolution
    let authorRef: ResolvedEntry["authorRef"] = { kind: "self" };
    if (entry.authorRef) {
      const ref = entry.authorRef.toLowerCase();
      const match = ctx.users.find(
        (u) =>
          u.email.toLowerCase() === ref ||
          (u.displayName ?? "").toLowerCase() === ref,
      );
      if (match) authorRef = { kind: "existing", userId: match.id };
      else
        warnings.push({
          level: "warning",
          source: entry.sourceName,
          message: `Author "${entry.authorRef}" not matched — falling back to importer.`,
        });
    }

    entries.push({
      source: entry,
      finalSlug,
      slugWasModified,
      categoryRef,
      tagRefs,
      authorRef,
    });
  }

  // ─── Image discovery ────────────────────────────────────────────
  const imagesToUpload: DryRunSummary["imagesToUpload"] = [];
  const seenLocalNames = new Set<string>();
  const existingMediaByName = new Map<string, Media>();
  for (const m of ctx.media) existingMediaByName.set(m.name, m);

  for (const entry of parsed.entries) {
    if (entry.sourceFormat !== "markdown") continue;
    const refs = new Set<string>();
    if (entry.heroImage && !/^https?:\/\//.test(entry.heroImage)) refs.add(entry.heroImage);
    // Inline image scan: ![alt](filename)
    for (const m of entry.contentBody.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const url = m[1];
      if (/^https?:\/\//.test(url)) continue;
      refs.add(url);
    }
    for (const ref of refs) {
      if (seenLocalNames.has(ref)) continue;
      const blob = bundle.images.find((i) => i.filename === ref);
      if (!blob) {
        warnings.push({
          level: "warning",
          source: entry.sourceName,
          message: `Image not found in bundle: "${ref}".`,
        });
        continue;
      }
      // Dedup against existing media: same name + roughly same
      // bytes → reuse.
      const existing = existingMediaByName.get(ref);
      if (existing && Math.abs((existing.size ?? 0) - blob.blob.size) < 1024) continue;
      imagesToUpload.push({
        filename: ref,
        bytes: blob.blob.size,
        remote: false,
      });
      seenLocalNames.add(ref);
    }
  }

  // ─── WP attachments referenced by entries ───────────────────────
  const wpAttachmentsToFetch: WordPressAttachment[] = [];
  const referencedWpUrls = new Set<string>();
  for (const entry of parsed.entries) {
    if (entry.sourceFormat !== "wordpress") continue;
    if (entry.heroImage) referencedWpUrls.add(entry.heroImage);
    if (entry.inlineImages) {
      for (const url of entry.inlineImages) referencedWpUrls.add(url);
    }
  }
  for (const att of parsed.attachments) {
    if (referencedWpUrls.has(att.url)) {
      wpAttachmentsToFetch.push(att);
    }
  }

  return {
    entries,
    categoriesToCreate,
    tagsToCreate,
    imagesToUpload,
    wpAttachmentsToFetch,
    warnings,
  };
}

// ─── Run (actual import) ───────────────────────────────────────────

interface RunDeps {
  ctx: ScanContext;
  options: ImportOptions;
  bundle: ImportBundle;
  summary: DryRunSummary;
  settings: SiteSettings;
  // Progress callback: called whenever a meaningful step finishes.
  onProgress?: (msg: string) => void;
}

export async function runImport(deps: RunDeps): Promise<RunResult> {
  const { ctx, options, bundle, summary, settings, onProgress } = deps;
  const result: RunResult = {
    createdPostIds: [],
    createdTermIds: [],
    uploadedMediaIds: [],
    publishedPostIds: [],
    warnings: [],
    errors: [],
  };
  const log = (msg: string) => onProgress?.(msg);

  // ─── 1. Upload images ───────────────────────────────────────────
  // mediaByName: filename → Media (for markdown-style refs).
  // mediaByWpUrl: original WP attachment URL → Media.
  const mediaByName = new Map<string, Media>();
  const mediaByWpUrl = new Map<string, Media>();

  // Pre-populate with existing media so dedup works at run time too.
  for (const m of ctx.media) mediaByName.set(m.name, m);

  // Local images (markdown mode + drop mode local images).
  for (const img of summary.imagesToUpload) {
    const blob = bundle.images.find((i) => i.filename === img.filename);
    if (!blob) continue;
    try {
      const file = blobToFile(blob.blob, img.filename);
      log(`Uploading image: ${img.filename}`);
      const media = await uploadMedia(file, ctx.importerUserId, settings);
      mediaByName.set(img.filename, media);
      result.uploadedMediaIds.push(media.id);
    } catch (err) {
      result.warnings.push({
        level: "warning",
        source: img.filename,
        message: `Image upload failed: ${(err as Error).message}`,
      });
    }
    await sleep(75);
  }

  // WordPress remote attachments — concurrency-limited.
  await runConcurrent(
    summary.wpAttachmentsToFetch,
    options.imageFetchConcurrency,
    async (att) => {
      try {
        log(`Fetching WP attachment: ${att.filename}`);
        const res = await fetch(att.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const file = blobToFile(blob, att.filename);
        const media = await uploadMedia(file, ctx.importerUserId, settings);
        mediaByWpUrl.set(att.url, media);
        mediaByName.set(att.filename, media);
        result.uploadedMediaIds.push(media.id);
      } catch (err) {
        result.warnings.push({
          level: "warning",
          source: att.url,
          message: `WP attachment fetch failed: ${(err as Error).message}`,
        });
      }
    },
  );

  // ─── 2. Create categories (parent-first) + tags ─────────────────
  // Slug → newly-created term id, for child terms to reference.
  const newCategoryIds = new Map<string, string>();
  for (const cat of topologicalSort(summary.categoriesToCreate)) {
    let parentId: string | undefined;
    if (cat.parentSlug) {
      // Either parent is in newCategoryIds (we just created it) or
      // it's an existing term. Fall back to undefined when neither.
      parentId =
        newCategoryIds.get(cat.parentSlug) ??
        ctx.terms.find((t) => t.type === "category" && t.slug === cat.parentSlug)?.id;
    }
    try {
      log(`Creating category: ${cat.name}`);
      const id = await createTerm({
        type: "category",
        name: cat.name,
        slug: cat.slug,
        parentId,
      });
      newCategoryIds.set(cat.slug, id);
      result.createdTermIds.push(id);
    } catch (err) {
      result.warnings.push({
        level: "warning",
        source: cat.slug,
        message: `Failed to create category "${cat.name}": ${(err as Error).message}`,
      });
    }
  }

  const newTagIds = new Map<string, string>();
  for (const tag of summary.tagsToCreate) {
    try {
      log(`Creating tag: ${tag.name}`);
      const id = await createTerm({
        type: "tag",
        name: tag.name,
        slug: tag.slug,
      });
      newTagIds.set(tag.slug, id);
      result.createdTermIds.push(id);
    } catch (err) {
      result.warnings.push({
        level: "warning",
        source: tag.slug,
        message: `Failed to create tag "${tag.name}": ${(err as Error).message}`,
      });
    }
  }

  // ─── 3. Create posts ────────────────────────────────────────────
  for (const resolved of summary.entries) {
    const entry = resolved.source;
    log(`Creating ${entry.type}: ${entry.title}`);

    // Resolve category id
    let primaryTermId: string | undefined;
    if (resolved.categoryRef) {
      primaryTermId =
        resolved.categoryRef.kind === "existing"
          ? resolved.categoryRef.termId
          : newCategoryIds.get(resolved.categoryRef.slug);
    }
    const tagIds: string[] = [];
    for (const ref of resolved.tagRefs) {
      const id = ref.kind === "existing" ? ref.termId : newTagIds.get(ref.slug);
      if (id) tagIds.push(id);
    }
    const termIds = primaryTermId ? [primaryTermId, ...tagIds] : tagIds;

    // Author id
    const authorId =
      resolved.authorRef.kind === "existing"
        ? resolved.authorRef.userId
        : ctx.importerUserId;

    // Hero media id
    let heroMediaId: string | undefined;
    if (entry.heroImage) {
      // WP url first, then local filename.
      heroMediaId =
        mediaByWpUrl.get(entry.heroImage)?.id ?? mediaByName.get(entry.heroImage)?.id;
    }

    // Body rewrite: replace local filenames + WP URLs with the
    // resolved media URLs. Inline images that we couldn't import
    // stay as-is so the user can fix them after.
    const body = rewriteImageRefs(entry.contentBody, mediaByName, mediaByWpUrl);

    let postId: string;
    try {
      postId = await createPost({
        type: entry.type,
        title: entry.title,
        slug: resolved.finalSlug,
        contentMarkdown: body,
        excerpt: entry.excerpt,
        heroMediaId,
        authorId,
        termIds,
        primaryTermId,
        seo:
          entry.seoTitle || entry.seoDescription
            ? { title: entry.seoTitle, description: entry.seoDescription }
            : undefined,
      });
    } catch (err) {
      result.errors.push({
        level: "error",
        source: entry.sourceName,
        message: `Create failed: ${(err as Error).message}`,
      });
      continue;
    }
    result.createdPostIds.push(postId);

    // Optional publish based on the chosen StatusMode.
    const shouldPublish =
      options.statusMode === "online" ||
      (options.statusMode === "from-source" && entry.status === "online");
    if (shouldPublish) {
      try {
        log(`Publishing: ${entry.title}`);
        // buildPublishContext is an async helper; we rebuild per
        // post so the ctx reflects all newly-created posts/terms.
        const publishCtx = await buildPublishContext({
          posts: ctx.posts,
          pages: ctx.pages,
          terms: ctx.terms,
          users: ctx.users,
          settings,
          authorLookup: buildAuthorLookup(ctx.users, ctx.media),
        });
        // Patch in our newly-created post so publishPost can find
        // it. We don't have a Firestore subscription update yet at
        // this point — the caller will get one moments later.
        const synthetic: Post = {
          id: postId,
          type: entry.type,
          title: entry.title,
          slug: resolved.finalSlug,
          contentMarkdown: body,
          authorId,
          termIds,
          primaryTermId,
          status: "draft",
        } as Post;
        if (entry.type === "post") publishCtx.posts = [...publishCtx.posts, synthetic];
        else publishCtx.pages = [...publishCtx.pages, synthetic];
        await publishPost(postId, publishCtx, () => {});
        result.publishedPostIds.push(postId);
      } catch (err) {
        result.warnings.push({
          level: "warning",
          source: entry.sourceName,
          message: `Publish failed: ${(err as Error).message} — left as draft.`,
        });
      }
    }
    await sleep(75);
  }

  // ─── 4. Move processed files (folder mode only) ─────────────────
  if (bundle.source === "folder" && options.moveProcessedFiles) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const archive = `${IMPORT_FOLDER}/processed-${stamp}`;
    log(`Archiving processed files to ${archive}/`);
    for (const m of bundle.markdown) {
      const oldPath = `${IMPORT_FOLDER}/${m.name}`;
      const newPath = `${archive}/${m.name}`;
      try {
        await renameFile(oldPath, newPath);
      } catch (err) {
        result.warnings.push({
          level: "warning",
          source: m.name,
          message: `Failed to archive: ${(err as Error).message}`,
        });
      }
    }
    for (const x of bundle.xml) {
      try {
        await renameFile(`${IMPORT_FOLDER}/${x.name}`, `${archive}/${x.name}`);
      } catch (err) {
        result.warnings.push({
          level: "warning",
          source: x.name,
          message: `Failed to archive: ${(err as Error).message}`,
        });
      }
    }
    // Images: archive only the ones we actually used.
    for (const img of summary.imagesToUpload) {
      try {
        await renameFile(
          `${IMPORT_IMAGES_FOLDER}/${img.filename}`,
          `${archive}/images/${img.filename}`,
        );
      } catch {
        // 404 fine — the image may have lived elsewhere or already
        // been deleted; not worth bubbling.
      }
    }
  }

  return result;
}

// ─── Helpers ───────────────────────────────────────────────────────

function blobToFile(blob: Blob, filename: string): File {
  // File extends Blob; constructing one preserves the blob bytes
  // and adds the filename + lastModified the upload pipeline needs.
  return new File([blob], filename, { type: blob.type });
}

function rewriteImageRefs(
  body: string,
  byName: Map<string, Media>,
  byUrl: Map<string, Media>,
): string {
  return body.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (full, open, ref, close) => {
    const isUrl = /^https?:\/\//.test(ref);
    const media = isUrl ? byUrl.get(ref) : byName.get(ref);
    if (!media) return full; // leave as-is, user can fix manually
    // Legacy media docs (created before the multi-variant pipeline)
    // have no `formats` map but expose `url` directly.
    const formats = media.formats;
    if (!formats) {
      const legacyUrl = (media as Media & { url?: string }).url;
      return legacyUrl ? `${open}${legacyUrl}${close}` : full;
    }
    const variant =
      (media.defaultFormat ? formats[media.defaultFormat] : undefined) ??
      Object.values(formats)[0];
    if (!variant) return full;
    return `${open}${variant.url}${close}`;
  });
}

// Parent-first ordering. Terms whose parentSlug references another
// new term must be created after. Cycles are already filtered by
// scanBundle, so this is a plain topological sort.
function topologicalSort(terms: ParsedTerm[]): ParsedTerm[] {
  const bySlug = new Map(terms.map((t) => [t.slug, t]));
  const visited = new Set<string>();
  const sorted: ParsedTerm[] = [];

  function visit(term: ParsedTerm): void {
    if (visited.has(term.slug)) return;
    visited.add(term.slug);
    if (term.parentSlug) {
      const parent = bySlug.get(term.parentSlug);
      if (parent) visit(parent);
    }
    sorted.push(term);
  }

  for (const term of terms) visit(term);
  return sorted;
}

async function runConcurrent<T>(
  items: T[],
  concurrency: number,
  task: (item: T) => Promise<void>,
): Promise<void> {
  if (items.length === 0) return;
  const queue = items.slice();
  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
    workers.push(
      (async () => {
        while (queue.length > 0) {
          const next = queue.shift();
          if (next) await task(next);
        }
      })(),
    );
  }
  await Promise.all(workers);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Folder bootstrap (creates the `_cms-import/` folder + README) ─

const README_SEED = `flexweg-import — drop your content here

Markdown files (.md) live at the root of this folder. Images
referenced by them go in ./images/.

WordPress XML exports (.xml) also live at the root.

After dropping your files, open the admin > Plugins > Flexweg
Import settings page and click Scan + Confirm import.

Imported files are archived to processed-<timestamp>/ subfolders.
You can delete those archives whenever you want — they're a
safety net, not active data.

See the plugin README for the markdown frontmatter spec and the
WordPress import behaviour.
`;

export async function initializeFolder(): Promise<void> {
  // The Flexweg API doesn't expose a folder-only create that we
  // need (uploadFile creates parent folders implicitly), so we
  // just upload the README — that materialises both the folder
  // and the file in one shot.
  await uploadFile({
    path: `${IMPORT_FOLDER}/README.txt`,
    content: README_SEED,
  });
}

// Removes the folder entirely. Exposed for the admin UI as "Reset
// import folder" — primarily for testing.
export async function resetFolder(): Promise<void> {
  await deleteFile(`${IMPORT_FOLDER}/README.txt`).catch(() => {});
}
