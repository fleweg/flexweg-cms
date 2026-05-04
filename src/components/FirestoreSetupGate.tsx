// Top-level gate that runs the ping helper on first admin boot
// and blocks the routes until either:
//   • All indexes resolve OK → renders children.
//   • Indexes are missing → renders a setup screen with one-click
//     create links (Firebase Console auto-suggest URLs).
//   • A non-precondition error came back (network, rules) → renders
//     a generic error with retry.
//
// On subsequent reloads of the same browser, the cache short-circuits
// the ping — the gate renders children directly. Cache is invalidated
// only when the user clicks "Retry" after creating an index.

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import {
  getCachedReady,
  invalidateCachedReady,
  pingPaginatedQueries,
  type FirestoreSetupResult,
} from "../services/firestoreSetup";

interface FirestoreSetupGateProps {
  children: ReactNode;
}

export function FirestoreSetupGate({ children }: FirestoreSetupGateProps) {
  const { t } = useTranslation();
  const [result, setResult] = useState<FirestoreSetupResult | null>(
    // If the indexes were proven ready in a previous session,
    // skip the ping entirely — saves the 2 reads + the 100 ms or
    // so of round-trip on every admin reload.
    getCachedReady() ? { ready: true, missingIndexes: [] } : null,
  );
  const [running, setRunning] = useState(!getCachedReady());

  const runPing = useCallback(async () => {
    setRunning(true);
    try {
      invalidateCachedReady();
      const r = await pingPaginatedQueries();
      setResult(r);
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    if (!result) void runPing();
  }, [result, runPing]);

  if (result?.ready) return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-6">
      <div className="card w-full max-w-2xl p-6 space-y-5">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
            {t("firestoreSetup.title")}
          </h1>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t("firestoreSetup.intro")}
          </p>
        </header>

        {running && !result && (
          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("firestoreSetup.checking")}
          </div>
        )}

        {result?.unexpectedError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            <p className="font-medium">{t("firestoreSetup.unexpectedTitle")}</p>
            <p className="mt-1 text-xs font-mono break-all">
              [{result.unexpectedError.code}] {result.unexpectedError.message}
            </p>
            <p className="mt-2 text-xs">{t("firestoreSetup.unexpectedHint")}</p>
          </div>
        )}

        {result?.missingIndexes && result.missingIndexes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-surface-700 dark:text-surface-200">
              {t("firestoreSetup.missingCount", {
                count: result.missingIndexes.length,
              })}
            </p>
            <ol className="space-y-2 text-sm">
              {result.missingIndexes.map((idx, i) => (
                <li
                  key={idx.label}
                  className="rounded-md border border-surface-200 dark:border-surface-700 p-3 space-y-2"
                >
                  <div>
                    <span className="font-medium">{i + 1}.</span> {idx.label}
                    <code className="ml-2 text-xs px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-mono">
                      {idx.fields}
                    </code>
                  </div>
                  {idx.createUrl ? (
                    <a
                      href={idx.createUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("firestoreSetup.openConsole")}
                    </a>
                  ) : (
                    <p className="text-xs text-surface-500 italic">
                      {t("firestoreSetup.noUrl")}
                    </p>
                  )}
                </li>
              ))}
            </ol>
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium">{t("firestoreSetup.howItWorks")}</p>
              <ol className="mt-1 list-decimal list-inside space-y-0.5">
                <li>{t("firestoreSetup.step1")}</li>
                <li>{t("firestoreSetup.step2")}</li>
                <li>{t("firestoreSetup.step3")}</li>
              </ol>
            </div>
          </div>
        )}

        {/* Retry — re-runs the ping. Once both queries succeed, the
            gate flips to "ready" and the admin proceeds. */}
        {result && !result.ready && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={runPing}
              disabled={running}
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {running ? t("firestoreSetup.retrying") : t("firestoreSetup.retry")}
            </button>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {t("firestoreSetup.buildHint")}
            </p>
          </div>
        )}

        {result?.ready && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {t("firestoreSetup.allReady")}
          </div>
        )}
      </div>
    </div>
  );
}
