import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Database,
  Download,
  Flame,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { useAllPosts } from "../hooks/useAllPosts";
import { setActiveLocale, SUPPORTED_LOCALES, LOCALE_LABELS, pickPublicLocale } from "../i18n";
import {
  DEFAULT_FLEXWEG_API_BASE_URL,
  getFlexwegConfig,
  setFlexwegConfig,
  type FlexwegConfig,
} from "../services/flexwegConfig";
import { updateSettings } from "../services/settings";
import { setUserPreferences } from "../services/users";
import { invalidateCachedReady } from "../services/firestoreSetup";
import { toast } from "../lib/toast";
import {
  getBackendKind,
  getRuntimeConfig,
  resetRuntimeConfigCache,
} from "../lib/runtimeConfig";
import { EDITOR_FONT_OPTIONS, DEFAULT_EDITOR_SIZES, SYSTEM_FONT_NAME } from "../core/editorFonts";
import { FontSelect } from "../components/ui/FontSelect";
import type { AdminLocale, EditorStyle, PaginationMode } from "../core/types";

// Renders the "General" tab inside <SettingsLayout />. Outer page chrome
// (title + tab strip) lives in the layout, so this component is just the
// content sections.
export function SettingsPage() {
  const { t } = useTranslation();
  const { user, record, isAdmin } = useAuth();
  const { settings } = useCmsData();
  const backend = getBackendKind();
  // The home-page picker needs the full pages list. Loaded on mount
  // — the picker is the only place this list is needed on this page.
  const { posts: pages } = useAllPosts("page");

  // Site
  const [title, setTitle] = useState(settings.title);
  const [description, setDescription] = useState(settings.description);
  const [language, setLanguage] = useState(settings.language);
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [postsPerPage, setPostsPerPage] = useState(settings.postsPerPage);
  const [homeMode, setHomeMode] = useState(settings.homeMode);
  const [homePageId, setHomePageId] = useState(settings.homePageId ?? "");
  const [discourageIndexing, setDiscourageIndexing] = useState(
    settings.discourageIndexing === true,
  );
  const [savingSite, setSavingSite] = useState(false);

  // Sync local edits when the underlying doc changes (other admins editing,
  // first load, etc.).
  useEffect(() => {
    setTitle(settings.title);
    setDescription(settings.description);
    setLanguage(settings.language);
    setBaseUrl(settings.baseUrl);
    setPostsPerPage(settings.postsPerPage);
    setHomeMode(settings.homeMode);
    setHomePageId(settings.homePageId ?? "");
    setDiscourageIndexing(settings.discourageIndexing === true);
  }, [settings]);

  async function saveSite() {
    setSavingSite(true);
    const indexingChanged = (settings.discourageIndexing === true) !== discourageIndexing;
    try {
      await updateSettings({
        title,
        description,
        language,
        baseUrl,
        postsPerPage,
        homeMode,
        homePageId: homeMode === "static-page" ? homePageId || undefined : undefined,
        discourageIndexing,
      });
      // Toggling the indexing gate requires re-rendering every
      // online page (the `<meta name="robots">` is baked at publish
      // time) AND the robots.txt. Surface a strong call-to-action
      // toast so the user knows to run "Regenerate all" in
      // /admin/#/themes — auto-triggering it here would be a heavy
      // side effect of a settings save and is undesirable on big
      // sites without an explicit user click.
      if (indexingChanged) {
        toast.info(t("settings.site.discourageRegenerateHint"));
      }
    } finally {
      setSavingSite(false);
    }
  }

  // Flexweg API config — loaded separately from the settings doc.
  const [apiKey, setApiKey] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_FLEXWEG_API_BASE_URL);
  const [savingFw, setSavingFw] = useState(false);

  useEffect(() => {
    void getFlexwegConfig().then((c) => {
      if (!c) return;
      setApiKey(c.apiKey);
      setSiteUrl(c.siteUrl);
      setApiBaseUrl(c.apiBaseUrl);
    });
  }, []);

  async function saveFlexweg() {
    setSavingFw(true);
    try {
      const next: FlexwegConfig = { apiKey, siteUrl, apiBaseUrl };
      await setFlexwegConfig(next);
    } finally {
      setSavingFw(false);
    }
  }

  // Profile (admin language for *this* user)
  async function changeAdminLocale(locale: AdminLocale) {
    await setActiveLocale(locale);
    if (user && record) await setUserPreferences(user.uid, { adminLocale: locale });
  }

  // Performance — choose how the admin loads posts / pages. The
  // default "global" requires NO Firestore composite indexes; the
  // "paginated" opt-in requires the (type, createdAt) and (type,
  // status, createdAt) indexes documented in the README.
  const [paginationMode, setPaginationMode] = useState<PaginationMode>(
    settings.paginationMode ?? "global",
  );
  const [savingPagination, setSavingPagination] = useState(false);

  useEffect(() => {
    setPaginationMode(settings.paginationMode ?? "global");
  }, [settings.paginationMode]);

  async function savePagination() {
    setSavingPagination(true);
    try {
      // The cached "indexes ready" flag is only meaningful for paginated
      // mode. Wipe it on every save so the gate re-pings with fresh
      // truth — particularly important when the user flips to paginated
      // for the first time.
      invalidateCachedReady();
      await updateSettings({ paginationMode });
      toast.info(t("settings.performance.savedReload"));
    } finally {
      setSavingPagination(false);
    }
  }

  // Editor typography. Stored alongside other site settings so the
  // hook that injects the styles into the post editor reads them
  // through the same Firestore subscription that drives CmsDataContext
  // — changes propagate without needing a refresh.
  const [editorStyle, setEditorStyle] = useState<EditorStyle>(settings.editorStyle ?? {});
  const [savingEditor, setSavingEditor] = useState(false);

  useEffect(() => {
    setEditorStyle(settings.editorStyle ?? {});
  }, [settings.editorStyle]);

  function patchEditorStyle(patch: Partial<EditorStyle>) {
    setEditorStyle((prev) => ({ ...prev, ...patch }));
  }

  async function saveEditorStyle() {
    setSavingEditor(true);
    try {
      // Trim empties to undefined so the doc stays clean (no
      // "fontFamily: ''" leftovers). Defaults kick in via the hook.
      const clean: EditorStyle = {};
      if (editorStyle.fontFamily) clean.fontFamily = editorStyle.fontFamily;
      if (editorStyle.bodySize?.trim()) clean.bodySize = editorStyle.bodySize.trim();
      if (editorStyle.h1Size?.trim()) clean.h1Size = editorStyle.h1Size.trim();
      if (editorStyle.h2Size?.trim()) clean.h2Size = editorStyle.h2Size.trim();
      if (editorStyle.h3Size?.trim()) clean.h3Size = editorStyle.h3Size.trim();
      await updateSettings({
        editorStyle: Object.keys(clean).length > 0 ? clean : undefined,
      });
    } finally {
      setSavingEditor(false);
    }
  }

  function resetEditorStyle() {
    setEditorStyle({});
  }

  return (
    <div className="space-y-6">
      {/* Profile section is intentionally minimal — name / bio / avatar
          live on /users (per-row Edit modal), where admins can manage
          any user and non-admins manage their own. The admin language
          stays here because it's a per-user *UI* preference, not a
          public profile field. */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.profile.title")}</h2>
        <div>
          <label className="label">{t("settings.profile.adminLocale")}</label>
          <select
            className="input max-w-xs"
            value={record?.preferences?.adminLocale ?? "en"}
            onChange={(e) => changeAdminLocale(e.target.value as AdminLocale)}
          >
            {SUPPORTED_LOCALES.map((locale) => (
              <option key={locale} value={locale}>
                {LOCALE_LABELS[locale]}
              </option>
            ))}
          </select>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.profile.adminLocaleHelp")}
          </p>
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.site.title")}</h2>
        <div>
          <label className="label">{t("settings.site.siteTitle")}</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("settings.site.siteDescription")}</label>
          <textarea
            className="input min-h-[60px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t("settings.site.siteLanguage")}</label>
          <input
            className="input max-w-xs"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="en, fr, fr-FR…"
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.site.siteLanguageHelp")}
          </p>
          {/* Live preview: shows which translation bundle the public-side
              labels (sitemap viewer, RSS viewer, theme baked-in strings)
              will resolve to. Helps the user understand that `fr-CA`
              picks the `fr` bundle, while an unsupported locale falls
              back to `en`. */}
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.site.siteLanguageResolved", {
              label: LOCALE_LABELS[pickPublicLocale(language)],
            })}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.site.baseUrl")}</label>
          <input
            className="input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-site.flexweg.com"
          />
        </div>
        <div>
          <label className="label">{t("settings.site.postsPerPage")}</label>
          <input
            className="input max-w-xs"
            type="number"
            min={1}
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(Number.parseInt(e.target.value, 10) || 1)}
          />
        </div>
        <div>
          <label className="label">{t("settings.site.homeMode")}</label>
          <select className="input max-w-xs" value={homeMode} onChange={(e) => setHomeMode(e.target.value as typeof homeMode)}>
            <option value="latest-posts">{t("settings.site.homeLatest")}</option>
            <option value="static-page">{t("settings.site.homeStatic")}</option>
          </select>
        </div>
        {homeMode === "static-page" && (
          <div>
            <label className="label">{t("settings.site.homePage")}</label>
            <select
              className="input max-w-xs"
              value={homePageId}
              onChange={(e) => setHomePageId(e.target.value)}
            >
              <option value="">—</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-2">
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={discourageIndexing}
              onChange={(e) => setDiscourageIndexing(e.target.checked)}
            />
            <span>
              <span className="font-medium">
                {t("settings.site.discourageIndexing")}
              </span>
              <span className="block text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                {t("settings.site.discourageIndexingHelp")}
              </span>
            </span>
          </label>
        </div>
        <button type="button" className="btn-primary" onClick={saveSite} disabled={savingSite}>
          <span className="inline-flex items-center justify-center gap-1.5">
            <Loader2 className={"h-4 w-4 animate-spin " + (savingSite ? "" : "hidden")} />
            <span>{savingSite ? t("common.saving") : t("common.save")}</span>
          </span>
        </button>
      </section>

      {/* Performance / pagination toggle is Firestore-specific —
          it controls whether posts/pages lists run live `onSnapshot`
          subscriptions on the whole collection (global) or cursor-
          paginated queries with composite indexes (paginated). SQLite
          mode polls a single `/version` endpoint regardless, so the
          choice has no effect there. Hide the section to avoid
          surfacing a no-op control. */}
      {backend !== "flexweg-sqlite" && (
        <section className="card p-4 space-y-3">
          <h2 className="font-semibold">{t("settings.performance.title")}</h2>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("settings.performance.help")}
          </p>
          <div>
            <label className="label">{t("settings.performance.mode")}</label>
            <select
              className="input max-w-md"
              value={paginationMode}
              onChange={(e) => setPaginationMode(e.target.value as PaginationMode)}
            >
              <option value="global">{t("settings.performance.modeGlobal")}</option>
              <option value="paginated">{t("settings.performance.modePaginated")}</option>
            </select>
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {paginationMode === "global"
                ? t("settings.performance.globalHelp")
                : t("settings.performance.paginatedHelp")}
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={savePagination}
            disabled={savingPagination || paginationMode === (settings.paginationMode ?? "global")}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Loader2 className={"h-4 w-4 animate-spin " + (savingPagination ? "" : "hidden")} />
              <span>{savingPagination ? t("common.saving") : t("common.save")}</span>
            </span>
          </button>
        </section>
      )}

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.editor.title")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.editor.help")}
        </p>
        <div className="max-w-xs">
          <label className="label">{t("settings.editor.fontFamily")}</label>
          <FontSelect
            value={editorStyle.fontFamily ?? SYSTEM_FONT_NAME}
            onChange={(name) =>
              patchEditorStyle({
                // Storing SYSTEM_FONT_NAME explicitly is fine but we
                // prefer leaving the field undefined when on default
                // — keeps the doc clean and lets the hook short-
                // circuit to its own fallback path.
                fontFamily: name === SYSTEM_FONT_NAME ? undefined : name,
              })
            }
            options={EDITOR_FONT_OPTIONS}
            ariaLabel={t("settings.editor.fontFamily")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <div>
            <label className="label">{t("settings.editor.bodySize")}</label>
            <input
              className="input"
              value={editorStyle.bodySize ?? ""}
              onChange={(e) => patchEditorStyle({ bodySize: e.target.value })}
              placeholder={DEFAULT_EDITOR_SIZES.body}
            />
          </div>
          <div>
            <label className="label">{t("settings.editor.h1Size")}</label>
            <input
              className="input"
              value={editorStyle.h1Size ?? ""}
              onChange={(e) => patchEditorStyle({ h1Size: e.target.value })}
              placeholder={DEFAULT_EDITOR_SIZES.h1}
            />
          </div>
          <div>
            <label className="label">{t("settings.editor.h2Size")}</label>
            <input
              className="input"
              value={editorStyle.h2Size ?? ""}
              onChange={(e) => patchEditorStyle({ h2Size: e.target.value })}
              placeholder={DEFAULT_EDITOR_SIZES.h2}
            />
          </div>
          <div>
            <label className="label">{t("settings.editor.h3Size")}</label>
            <input
              className="input"
              value={editorStyle.h3Size ?? ""}
              onChange={(e) => patchEditorStyle({ h3Size: e.target.value })}
              placeholder={DEFAULT_EDITOR_SIZES.h3}
            />
          </div>
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.editor.sizeHelp")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={saveEditorStyle}
            disabled={savingEditor}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Loader2 className={"h-4 w-4 animate-spin " + (savingEditor ? "" : "hidden")} />
              <span>{savingEditor ? t("common.saving") : t("common.save")}</span>
            </span>
          </button>
          <button type="button" className="btn-ghost" onClick={resetEditorStyle}>
            {t("settings.editor.reset")}
          </button>
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.flexweg.title")}</h2>
        {/* Storage location depends on the active backend — the
            dispatcher routes both reads and writes. Same admin-only
            posture in both modes. */}
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {backend === "flexweg-sqlite"
            ? t("settings.flexweg.storageHelpSqlite")
            : t("settings.flexweg.storageHelpFirebase")}
        </p>
        <div>
          <label className="label">{t("settings.flexweg.apiKey")}</label>
          <input
            className="input font-mono"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.flexweg.apiKeyHelp")}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.flexweg.siteUrl")}</label>
          <input
            className="input"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://your-site.flexweg.com"
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.flexweg.siteUrlHelp")}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.flexweg.apiBaseUrl")}</label>
          <input
            className="input"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
          />
        </div>
        <button type="button" className="btn-primary" onClick={saveFlexweg} disabled={savingFw}>
          <span className="inline-flex items-center justify-center gap-1.5">
            <Loader2 className={"h-4 w-4 animate-spin " + (savingFw ? "" : "hidden")} />
            <span>{savingFw ? t("common.saving") : t("common.save")}</span>
          </span>
        </button>
      </section>

      {isAdmin && <BackendSettings backend={backend} />}
    </div>
  );
}

// Backend switcher (admin-only). Surfaces the active backend, a
// download link to the SQLite file (in SQLite mode), and a "Switch
// backend…" button that wipes the in-browser runtime config + reloads
// so the SetupForm shows up and the user can pick the other backend.
//
// **Data is NOT migrated** — the previous backend's data stays where
// it was (Firestore or the .sqlite file on Flexweg) but won't be read
// until the user switches back.
function BackendSettings({ backend }: { backend: ReturnType<typeof getBackendKind> }) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const config = getRuntimeConfig();
  const isFirebase = backend === "firebase";
  const isSqlite = backend === "flexweg-sqlite";
  const backupHref =
    config && config.backend === "flexweg-sqlite"
      ? `${config.flexweg.siteUrl.replace(/\/+$/, "")}/${config.flexweg.sqlitePath.replace(/^\/+/, "")}`
      : null;

  function switchBackend() {
    if (typeof window !== "undefined") {
      window.__FLEXWEG_CONFIG__ = null;
      resetRuntimeConfigCache();
      window.location.reload();
    }
  }

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-surface-500 dark:text-surface-400" />
        <h2 className="font-semibold">{t("settings.backend.title")}</h2>
      </div>

      <p className="text-sm text-surface-600 dark:text-surface-300">
        {t("settings.backend.active")}{" "}
        <span className="inline-flex items-center gap-1.5 font-medium text-surface-900 dark:text-surface-50">
          {isFirebase ? (
            <>
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              Firebase
            </>
          ) : isSqlite ? (
            <>
              <Database className="h-3.5 w-3.5 text-emerald-500" />
              Flexweg SQLite
            </>
          ) : (
            "—"
          )}
        </span>
      </p>

      {isSqlite && backupHref && (
        <p className="text-xs text-surface-500 dark:text-surface-400">
          <a
            href={backupHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:underline dark:text-blue-400"
          >
            <Download className="h-3.5 w-3.5" />
            {t("settings.backend.downloadBackup")}
          </a>{" "}
          — {t("settings.backend.downloadBackupHelp")}
        </p>
      )}

      {!confirming ? (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setConfirming(true)}
        >
          {t("settings.backend.switchButton")}
        </button>
      ) : (
        <div className="rounded-lg bg-amber-50 ring-1 ring-amber-200 p-4 dark:bg-amber-900/20 dark:ring-amber-700/40">
          <div className="flex gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">{t("settings.backend.confirmTitle")}</p>
              <p className="mt-1 text-xs leading-relaxed">
                {t("settings.backend.confirmBody")}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="btn-danger text-xs"
                  onClick={switchBackend}
                >
                  {t("settings.backend.confirmYes")}
                </button>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() => setConfirming(false)}
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
