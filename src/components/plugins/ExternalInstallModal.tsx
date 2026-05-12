import { useEffect, useState, type ChangeEvent } from "react";
import {
  AlertCircle,
  Loader2,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "../../lib/toast";
import {
  ExternalUploadError,
  installFromZip,
  listMissingBundledDefaults,
  reinstallBundledDefaults,
  uninstallExternal,
  type ExternalKind,
} from "../../services/externalUpload";

interface ExternalInstallModalProps {
  kind: ExternalKind;
  open: boolean;
  onClose: () => void;
  // Existing external entries — used to render the uninstall list.
  existing: Array<{ id: string; name?: string; version?: string }>;
}

// Modal for installing a new external plugin / theme from a ZIP file
// AND uninstalling already-installed ones. Same UX for both kinds; the
// `kind` prop just routes to the right Flexweg path.
export function ExternalInstallModal({
  kind,
  open,
  onClose,
  existing,
}: ExternalInstallModalProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uninstallingId, setUninstallingId] = useState<string | null>(null);
  // Bundled defaults the user has previously uninstalled and could
  // restore. Populated lazily when the modal opens. Filtered to the
  // current `kind` so the plugins modal only shows missing plugins.
  const [missingDefaults, setMissingDefaults] = useState<
    Array<{ id: string; version: string }>
  >([]);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listMissingBundledDefaults()
      .then((res) => {
        if (cancelled) return;
        setMissingDefaults(
          (kind === "plugins" ? res.plugins : res.themes).map((e) => ({
            id: e.id,
            version: e.version,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setMissingDefaults([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, kind]);

  if (!open) return null;

  function reset() {
    setFile(null);
    setError(null);
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
  }

  async function handleInstall() {
    if (!file || installing) return;
    setError(null);
    setInstalling(true);
    try {
      const result = await installFromZip(kind, file);
      const successKey =
        result.mode === "upgrade"
          ? "externalInstall.upgradeSuccess"
          : "externalInstall.installSuccess";
      toast.success(
        t(successKey, {
          name: result.manifest.name,
          count: result.filesUploaded,
          previousVersion: result.previousVersion ?? "",
          newVersion: result.manifest.version,
        }),
      );
      // Reload to pick up the freshly installed bundle. A no-cache
      // reload would be ideal but a regular reload suffices because
      // external.json is fetched with cache: no-store.
      window.setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      const code =
        err instanceof ExternalUploadError ? err.code : "upload-failed";
      const fallback = (err as Error).message;
      const message = t(`externalInstall.errors.${code}`, {
        defaultValue: fallback,
      });
      setError(message);
    } finally {
      setInstalling(false);
    }
  }

  async function handleUninstall(id: string) {
    if (uninstallingId) return;
    if (!window.confirm(t("externalInstall.confirmUninstall", { id }))) return;
    setUninstallingId(id);
    try {
      await uninstallExternal(kind, id);
      toast.success(t("externalInstall.uninstallSuccess", { id }));
      window.setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUninstallingId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
            {kind === "plugins"
              ? t("externalInstall.titlePlugin")
              : t("externalInstall.titleTheme")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -m-1.5 rounded-md text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-50"
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-surface-600 dark:text-surface-300">
          {t("externalInstall.intro", {
            label:
              kind === "plugins"
                ? t("externalInstall.labelPlugin")
                : t("externalInstall.labelTheme"),
          })}
        </p>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="label">{t("externalInstall.zipField")}</span>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={handleFile}
              disabled={installing}
              className="block w-full text-sm text-surface-700 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-surface-100 file:text-surface-900 file:cursor-pointer hover:file:bg-surface-200 dark:text-surface-200 dark:file:bg-surface-800 dark:file:text-surface-100"
            />
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm flex items-start gap-2 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={installing}
              className="btn-secondary"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleInstall}
              disabled={!file || installing}
              className="btn-primary"
            >
              {installing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {installing
                ? t("externalInstall.installing")
                : t("externalInstall.install")}
            </button>
          </div>
        </div>

        {missingDefaults.length > 0 && (
          <div className="mt-6 pt-5 border-t border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              {t("externalInstall.bundledDefaultsTitle")}
            </h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              {t("externalInstall.bundledDefaultsHint", {
                count: missingDefaults.length,
              })}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <ul className="text-xs text-surface-600 dark:text-surface-300 truncate">
                {missingDefaults.map((d) => d.id).join(", ")}
              </ul>
              <button
                type="button"
                disabled={restoring}
                onClick={async () => {
                  if (restoring) return;
                  setRestoring(true);
                  try {
                    const res = await reinstallBundledDefaults();
                    toast.success(
                      t("externalInstall.bundledDefaultsRestored", {
                        plugins: res.pluginsRestored,
                        themes: res.themesRestored,
                      }),
                    );
                    window.setTimeout(() => window.location.reload(), 600);
                  } catch (err) {
                    toast.error((err as Error).message);
                    setRestoring(false);
                  }
                }}
                className="btn-secondary"
              >
                {restoring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {t("externalInstall.bundledDefaultsRestore")}
              </button>
            </div>
          </div>
        )}

        {existing.length > 0 && (
          <div className="mt-6 pt-5 border-t border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              {t("externalInstall.installedTitle")}
            </h3>
            <ul className="mt-3 space-y-2">
              {existing.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900 dark:text-surface-50 truncate">
                      {entry.name ?? entry.id}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                      {entry.id}
                      {entry.version ? ` · v${entry.version}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUninstall(entry.id)}
                    disabled={uninstallingId === entry.id}
                    className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300 text-xs"
                  >
                    {uninstallingId === entry.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    {t("externalInstall.uninstall")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
