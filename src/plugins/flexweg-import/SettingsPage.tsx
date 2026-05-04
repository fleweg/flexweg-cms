// Settings UI for the import plugin. Wires together:
//   • a Source toggle (Flexweg folder vs drag-drop)
//   • the file listing + DropZone
//   • Scan → DryRunSummary table
//   • Confirm → runImport with progress log
//   • Defaults form (status mode, default category, etc.)
//
// The import pipeline (importer.ts) is fully isolated so this file
// is just glue + layout. UI strings come from the
// "flexweg-import" namespace.

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  FolderPlus,
  Info,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCmsData } from "../../context/CmsDataContext";
import { listAllMedia } from "../../services/media";
import { fetchAllPosts } from "../../services/posts";
import { toast } from "../../lib/toast";
import { DropZone, type DroppedBundle } from "./DropZone";
import {
  buildBundleFromFolder,
  DEFAULT_IMPORT_OPTIONS,
  IMPORT_FOLDER,
  initializeFolder,
  listImportFolder,
  runImport,
  scanBundle,
  type DryRunSummary,
  type ImageInput,
  type ImportBundle,
  type ImportOptions,
  type RunResult,
  type SourceFileInput,
  type StatusMode,
} from "./importer";
import type { PluginSettingsPageProps } from "../index";

export interface ImportConfig {
  options: ImportOptions;
}

export const DEFAULT_IMPORT_CONFIG: ImportConfig = {
  options: DEFAULT_IMPORT_OPTIONS,
};

type Source = "folder" | "drop";

interface FolderState {
  initialised: boolean;
  markdown: number;
  xml: number;
  images: number;
}

interface DropState {
  markdown: SourceFileInput[];
  xml: SourceFileInput[];
  images: ImageInput[];
  ignored: string[];
}

const EMPTY_DROP: DropState = { markdown: [], xml: [], images: [], ignored: [] };

export function ImportSettingsPage({ config, save }: PluginSettingsPageProps<ImportConfig>) {
  const { t } = useTranslation("flexweg-import");
  const { user } = useAuth();
  const cms = useCmsData();

  // ─── Persisted defaults form ────────────────────────────────────
  const opts = config.options ?? DEFAULT_IMPORT_OPTIONS;
  const [defaults, setDefaults] = useState<ImportOptions>(opts);
  useEffect(() => setDefaults(opts), [opts]);
  const [savingDefaults, setSavingDefaults] = useState(false);

  // ─── Source / file state ────────────────────────────────────────
  const [source, setSource] = useState<Source>("folder");
  const [folderState, setFolderState] = useState<FolderState | null>(null);
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderInitialising, setFolderInitialising] = useState(false);
  const [drop, setDrop] = useState<DropState>(EMPTY_DROP);

  // ─── Scan / run state ───────────────────────────────────────────
  const [summary, setSummary] = useState<DryRunSummary | null>(null);
  const [scanning, setScanning] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  // Capture the bundle used for the most recent scan so the run
  // works against the same data the user just confirmed.
  const lastBundleRef = useRef<ImportBundle | null>(null);

  // ─── Bootstrap: folder listing on first render of folder mode ───
  useEffect(() => {
    if (source !== "folder") return;
    void refreshFolder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  async function refreshFolder(): Promise<void> {
    setFolderLoading(true);
    try {
      const listing = await listImportFolder();
      setFolderState({
        initialised: true,
        markdown: listing.markdownFiles.length,
        xml: listing.xmlFiles.length,
        images: listing.imageFiles.length,
      });
    } catch {
      // Either folder doesn't exist or API failed. Treat the
      // common case (404) as "not initialised yet".
      setFolderState({ initialised: false, markdown: 0, xml: 0, images: 0 });
    } finally {
      setFolderLoading(false);
    }
  }

  async function handleInitialize(): Promise<void> {
    setFolderInitialising(true);
    try {
      await initializeFolder();
      toast.success(t("folder.initialized"));
      await refreshFolder();
    } catch (err) {
      toast.error(t("folder.initFailed"));
      console.error("[flexweg-import] init folder failed:", err);
    } finally {
      setFolderInitialising(false);
    }
  }

  function handleDropped(bundle: DroppedBundle): void {
    // Accumulate across drops — the user can drop .md files first
    // then images afterward, or vice versa.
    setDrop((prev) => ({
      markdown: [...prev.markdown, ...bundle.markdown],
      xml: [...prev.xml, ...bundle.xml],
      images: [...prev.images, ...bundle.images],
      ignored: [...prev.ignored, ...bundle.ignored],
    }));
    // Invalidate any stale summary the moment new files come in.
    setSummary(null);
    setResult(null);
  }

  function clearDrop(): void {
    setDrop(EMPTY_DROP);
    setSummary(null);
    setResult(null);
  }

  // ─── Scan ───────────────────────────────────────────────────────
  async function handleScan(): Promise<void> {
    setScanning(true);
    setSummary(null);
    setResult(null);
    try {
      const bundle =
        source === "folder"
          ? await buildBundleFromFolder()
          : ({
              source: "drop",
              markdown: drop.markdown,
              xml: drop.xml,
              images: drop.images,
            } satisfies ImportBundle);
      if (
        bundle.markdown.length === 0 &&
        bundle.xml.length === 0
      ) {
        toast.error(t("scan.noSources"));
        return;
      }
      lastBundleRef.current = bundle;
      // Need a fresh media listing — useCmsData doesn't carry it.
      // posts + pages are also fetched on demand now that the global
      // subscription is gone.
      const [media, posts, pages] = await Promise.all([
        listAllMedia(),
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const dry = scanBundle(
        bundle,
        {
          posts,
          pages,
          terms: cms.terms,
          media,
          users: cms.users,
          importerUserId: user?.uid ?? "",
        },
        defaults,
      );
      setSummary(dry);
    } catch (err) {
      toast.error(t("scan.failed", { error: (err as Error).message }));
      console.error("[flexweg-import] scan failed:", err);
    } finally {
      setScanning(false);
    }
  }

  // ─── Run ────────────────────────────────────────────────────────
  async function handleRun(): Promise<void> {
    if (!summary || !lastBundleRef.current) return;
    setRunning(true);
    setResult(null);
    setLogLines([]);
    try {
      const [media, posts, pages] = await Promise.all([
        listAllMedia(),
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const out = await runImport({
        ctx: {
          posts,
          pages,
          terms: cms.terms,
          media,
          users: cms.users,
          importerUserId: user?.uid ?? "",
        },
        options: defaults,
        bundle: lastBundleRef.current,
        summary,
        settings: cms.settings,
        onProgress: (msg) => setLogLines((prev) => [...prev, msg]),
      });
      setResult(out);
      if (out.errors.length > 0) {
        toast.error(t("confirm.failed"));
      } else {
        toast.success(
          t("confirm.success", {
            posts: out.createdPostIds.length,
            pages: 0,
            terms: out.createdTermIds.length,
            media: out.uploadedMediaIds.length,
          }),
        );
      }
      // Folder mode: re-list to reflect the moved-to-archive files.
      if (source === "folder") void refreshFolder();
      else clearDrop();
    } catch (err) {
      toast.error((err as Error).message);
      console.error("[flexweg-import] run failed:", err);
    } finally {
      setRunning(false);
    }
  }

  async function handleSaveDefaults(): Promise<void> {
    setSavingDefaults(true);
    try {
      await save({ options: defaults });
      toast.success(t("defaults.saved"));
    } finally {
      setSavingDefaults(false);
    }
  }

  // ─── Derived rendering values ───────────────────────────────────
  const errorCount = summary?.warnings.filter((w) => w.level === "error").length ?? 0;
  const warningCount = summary?.warnings.filter((w) => w.level === "warning").length ?? 0;
  const blockedByErrors = errorCount > 0;
  const hasFiles =
    source === "folder"
      ? !!folderState?.initialised && (folderState.markdown + folderState.xml) > 0
      : drop.markdown.length + drop.xml.length > 0;

  return (
    <div className="space-y-4">
      <header className="card p-4 space-y-1">
        <h2 className="font-semibold">{t("title")}</h2>
        <p className="text-sm text-surface-600 dark:text-surface-300">{t("description")}</p>
      </header>

      {/* ─── Source selector ─────────────────────────────────────── */}
      <section className="card p-4 space-y-3">
        <h3 className="font-medium">{t("source.label")}</h3>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-start gap-2 text-sm">
            <input
              type="radio"
              checked={source === "folder"}
              onChange={() => setSource("folder")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">{t("source.folder")}</span>
              <span className="block text-xs text-surface-500 dark:text-surface-400">
                {t("source.folderHelp")}
              </span>
            </span>
          </label>
          <label className="inline-flex items-start gap-2 text-sm">
            <input
              type="radio"
              checked={source === "drop"}
              onChange={() => setSource("drop")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">{t("source.drop")}</span>
              <span className="block text-xs text-surface-500 dark:text-surface-400">
                {t("source.dropHelp")}
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* ─── Folder state OR Drop zone ───────────────────────────── */}
      {source === "folder" ? (
        <section className="card p-4 space-y-3">
          {folderLoading && !folderState ? (
            <p className="text-sm text-surface-500">
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
              {t("scan.scanning")}
            </p>
          ) : !folderState?.initialised ? (
            <div className="space-y-3">
              <p className="text-sm text-surface-600 dark:text-surface-300">
                {t("folder.notInitialized")}
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleInitialize}
                disabled={folderInitialising}
              >
                {folderInitialising ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FolderPlus className="h-4 w-4" />
                )}
                {folderInitialising ? t("folder.initializing") : t("folder.initialize")}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                <code className="text-xs px-1 py-0.5 rounded bg-surface-100 dark:bg-surface-800">
                  /{IMPORT_FOLDER}/
                </code>
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-300">
                {folderState.markdown + folderState.xml + folderState.images === 0
                  ? t("folder.empty")
                  : t("folder.countLine", {
                      md: folderState.markdown,
                      xml: folderState.xml,
                      img: folderState.images,
                    })}
              </p>
              <button
                type="button"
                className="btn-ghost"
                onClick={refreshFolder}
                disabled={folderLoading}
              >
                {folderLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {t("folder.refresh")}
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="card p-4 space-y-3">
          <DropZone onDropped={handleDropped} disabled={running} />
          {(drop.markdown.length > 0 || drop.xml.length > 0 || drop.images.length > 0) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-600 dark:text-surface-300">
                {t("drop.countLine", {
                  md: drop.markdown.length,
                  xml: drop.xml.length,
                  img: drop.images.length,
                  ignored: drop.ignored.length,
                })}
              </span>
              <button type="button" className="btn-ghost" onClick={clearDrop} disabled={running}>
                <Trash2 className="h-4 w-4" />
                {t("drop.clear")}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ─── Scan + Confirm buttons ──────────────────────────────── */}
      <section className="card p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleScan}
            disabled={scanning || running || !hasFiles}
          >
            {scanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {scanning ? t("scan.scanning") : t("scan.button")}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleRun}
            disabled={running || scanning || !summary || blockedByErrors || (summary.entries.length === 0)}
            title={blockedByErrors ? t("confirm.blockedByErrors") : undefined}
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {running ? t("confirm.running") : t("confirm.button")}
          </button>
        </div>

        {/* Dry-run summary */}
        {summary && (
          <SummaryView
            summary={summary}
            warningCount={warningCount}
            errorCount={errorCount}
            showDetails={showSummaryDetails}
            onToggleDetails={() => setShowSummaryDetails((s) => !s)}
          />
        )}

        {/* Run result */}
        {result && (
          <div className="rounded-md bg-surface-50 dark:bg-surface-900 p-3 text-sm space-y-1">
            <p className="font-medium flex items-center gap-2">
              {result.errors.length > 0 ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              {t("confirm.summary", {
                posts: result.createdPostIds.length,
                pages: 0,
                terms: result.createdTermIds.length,
                media: result.uploadedMediaIds.length,
                published: result.publishedPostIds.length,
              })}
            </p>
          </div>
        )}
      </section>

      {/* ─── Activity log (per-step progress messages) ───────────── */}
      {logLines.length > 0 && (
        <section className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{t("log.title")}</h3>
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => {
                void navigator.clipboard.writeText(logLines.join("\n"));
                toast.success(t("log.copied"));
              }}
            >
              <ClipboardCopy className="h-3.5 w-3.5" />
              {t("log.copy")}
            </button>
          </div>
          <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all rounded bg-surface-50 dark:bg-surface-900 p-3 max-h-[280px] overflow-auto font-mono">
            {logLines.join("\n")}
          </pre>
        </section>
      )}

      {/* ─── Defaults form ───────────────────────────────────────── */}
      <section className="card p-4 space-y-4">
        <h3 className="font-medium">{t("defaults.title")}</h3>

        {/* Status mode radios */}
        <div>
          <label className="label">{t("defaults.statusMode")}</label>
          <div className="flex flex-col gap-2 text-sm">
            {(["draft", "from-source", "online"] as StatusMode[]).map((mode) => (
              <label key={mode} className="inline-flex items-start gap-2">
                <input
                  type="radio"
                  checked={defaults.statusMode === mode}
                  onChange={() => setDefaults((d) => ({ ...d, statusMode: mode }))}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">
                    {t(
                      mode === "draft"
                        ? "defaults.statusDraft"
                        : mode === "from-source"
                          ? "defaults.statusFromSource"
                          : "defaults.statusOnline",
                    )}
                  </span>
                  <span className="block text-xs text-surface-500 dark:text-surface-400">
                    {t(
                      mode === "draft"
                        ? "defaults.statusDraftHelp"
                        : mode === "from-source"
                          ? "defaults.statusFromSourceHelp"
                          : "defaults.statusOnlineHelp",
                    )}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Default category */}
        <div>
          <label className="label" htmlFor="import-default-category">
            {t("defaults.defaultCategory")}
          </label>
          <select
            id="import-default-category"
            className="input max-w-xs"
            value={defaults.defaultCategory}
            onChange={(e) =>
              setDefaults((d) => ({ ...d, defaultCategory: e.target.value }))
            }
          >
            <option value="">{t("defaults.defaultCategoryNone")}</option>
            {cms.categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("defaults.defaultCategoryHelp")}
          </p>
        </div>

        {/* Move processed toggle */}
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={defaults.moveProcessedFiles}
              onChange={(e) =>
                setDefaults((d) => ({ ...d, moveProcessedFiles: e.target.checked }))
              }
            />
            <span>{t("defaults.moveProcessed")}</span>
          </label>
        </div>

        {/* Image fetch concurrency */}
        <div>
          <label className="label" htmlFor="import-concurrency">
            {t("defaults.imageConcurrency")}
          </label>
          <input
            id="import-concurrency"
            type="number"
            min={1}
            max={16}
            className="input max-w-[100px]"
            value={defaults.imageFetchConcurrency}
            onChange={(e) =>
              setDefaults((d) => ({
                ...d,
                imageFetchConcurrency: Math.max(1, Math.min(16, Number(e.target.value) || 4)),
              }))
            }
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("defaults.imageConcurrencyHelp")}
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSaveDefaults}
            disabled={savingDefaults}
          >
            {savingDefaults ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {t("defaults.save")}
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-component: dry-run summary ────────────────────────────────

interface SummaryViewProps {
  summary: DryRunSummary;
  warningCount: number;
  errorCount: number;
  showDetails: boolean;
  onToggleDetails: () => void;
}

function SummaryView({
  summary,
  warningCount,
  errorCount,
  showDetails,
  onToggleDetails,
}: SummaryViewProps) {
  const { t } = useTranslation("flexweg-import");
  const postCount = summary.entries.filter((e) => e.source.type === "post").length;
  const pageCount = summary.entries.filter((e) => e.source.type === "page").length;
  const hierarchicalCategories = summary.categoriesToCreate.filter((c) => c.parentSlug).length;

  if (summary.entries.length === 0 && errorCount === 0) {
    return (
      <p className="text-sm text-surface-500 italic">{t("summary.noEntries")}</p>
    );
  }

  return (
    <div className="rounded-md border border-surface-200 dark:border-surface-700 p-3 text-sm space-y-2">
      <h4 className="font-medium">{t("summary.title")}</h4>
      <ul className="space-y-1">
        {postCount > 0 && (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            {t("summary.posts", { count: postCount })}
          </li>
        )}
        {pageCount > 0 && (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            {t("summary.pages", { count: pageCount })}
          </li>
        )}
        {summary.categoriesToCreate.length > 0 && (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            {t("summary.categoriesNew", { count: summary.categoriesToCreate.length })}
            {hierarchicalCategories > 0 && (
              <span className="text-surface-500">
                {" "}
                {t("summary.categoriesHierarchy", { count: hierarchicalCategories })}
              </span>
            )}
          </li>
        )}
        {summary.tagsToCreate.length > 0 && (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            {t("summary.tagsNew", { count: summary.tagsToCreate.length })}
          </li>
        )}
        {summary.imagesToUpload.length > 0 && (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            {t("summary.imagesLocal", { count: summary.imagesToUpload.length })}
          </li>
        )}
        {summary.wpAttachmentsToFetch.length > 0 && (
          <li className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500 shrink-0" />
            {t("summary.imagesRemote", { count: summary.wpAttachmentsToFetch.length })}
          </li>
        )}
        {warningCount > 0 && (
          <li className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {t("summary.warnings", { count: warningCount })}
          </li>
        )}
        {errorCount > 0 && (
          <li className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="h-4 w-4 shrink-0" />
            {t("summary.errors", { count: errorCount })}
          </li>
        )}
      </ul>

      <button
        type="button"
        className="btn-ghost text-xs"
        onClick={onToggleDetails}
      >
        {showDetails ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {showDetails ? t("summary.hideDetails") : t("summary.showDetails")}
      </button>

      {showDetails && (
        <div className="mt-2 space-y-2 text-xs">
          <SummaryDetailsList summary={summary} />
        </div>
      )}
    </div>
  );
}

function SummaryDetailsList({ summary }: { summary: DryRunSummary }) {
  return (
    <>
      {summary.entries.length > 0 && (
        <ul className="space-y-0.5 max-h-[180px] overflow-auto rounded bg-surface-50 dark:bg-surface-900 p-2">
          {summary.entries.slice(0, 200).map((e) => (
            <li key={`${e.source.sourceName}-${e.finalSlug}`}>
              <span className="font-mono text-surface-500">[{e.source.type}]</span>{" "}
              {e.source.title} →{" "}
              <span className="font-mono">/{e.finalSlug}</span>
              {e.slugWasModified && (
                <span className="text-amber-600 dark:text-amber-400"> (renamed)</span>
              )}
            </li>
          ))}
          {summary.entries.length > 200 && (
            <li className="text-surface-500 italic">… and {summary.entries.length - 200} more</li>
          )}
        </ul>
      )}
      {summary.warnings.length > 0 && (
        <ul className="space-y-0.5 max-h-[180px] overflow-auto rounded bg-surface-50 dark:bg-surface-900 p-2">
          {summary.warnings.map((w, i) => (
            <li
              key={i}
              className={
                w.level === "error"
                  ? "text-red-600 dark:text-red-400"
                  : "text-amber-700 dark:text-amber-400"
              }
            >
              <span className="font-mono text-surface-500">[{w.source}]</span> {w.message}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
