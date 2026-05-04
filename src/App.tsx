import { Component, type ErrorInfo, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CmsDataProvider } from "./context/CmsDataContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ErrorScreen } from "./components/ErrorScreen";
import { ToastContainer } from "./components/ui/ToastContainer";
import { FirestoreSetupGate } from "./components/FirestoreSetupGate";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PostsListPage } from "./pages/PostsListPage";
import { PostEditPage } from "./pages/PostEditPage";
import { PagesListPage } from "./pages/PagesListPage";
import { PageEditPage } from "./pages/PageEditPage";
import { TaxonomiesPage } from "./pages/TaxonomiesPage";
import { MediaLibraryPage } from "./pages/MediaLibraryPage";
import { ThemesPage } from "./pages/ThemesPage";
import { PluginsPage } from "./pages/PluginsPage";
import { MenusPage } from "./pages/MenusPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PluginSettingsRoute } from "./pages/PluginSettingsRoute";
import { SettingsLayout } from "./components/layout/SettingsLayout";
import { ThemeSettingsRoute } from "./pages/ThemeSettingsRoute";
import { UsersPage } from "./pages/UsersPage";
import { getAdminEmail, getMissingFirebaseEnvVars } from "./services/firebase";

interface BoundaryState {
  error: Error | null;
  // True while we're waiting on the auto-reset timer to clear a transient
  // DOM error. During that window the boundary renders an empty placeholder
  // instead of the full error screen so the user doesn't see a red flash.
  recovering: boolean;
  // Number of resets the boundary has performed within the current burst.
  // Resets to 0 when more than RESET_WINDOW_MS pass without a fresh error.
  resetCount: number;
  lastErrorAt: number;
}

// React 18's reconciler can throw transient "Node.insertBefore" /
// "removeChild" / "appendChild" errors when concurrent renders overlap
// imperative DOM mutations (browser extensions, contentEditable widgets,
// async state churn). The DOM is recoverable — re-rendering the whole tree
// from scratch fixes it. We auto-reset the boundary for those cases so the
// user doesn't get bounced to a global error screen for what is really a
// momentary glitch.
const TRANSIENT_DOM_PATTERNS = [
  /Node\.insertBefore/i,
  /Node\.removeChild/i,
  /Node\.appendChild/i,
  /failed to execute 'insertBefore'/i,
  /failed to execute 'removeChild'/i,
];
const MAX_AUTO_RESETS = 3;
const RESET_WINDOW_MS = 5_000;
const RESET_DELAY_MS = 80;

function isTransientDomError(err: Error | null | undefined): boolean {
  if (!err?.message) return false;
  return TRANSIENT_DOM_PATTERNS.some((re) => re.test(err.message));
}

class AppErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null, recovering: false, resetCount: 0, lastErrorAt: 0 };
  }
  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    return { error, lastErrorAt: Date.now() };
  }
  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info);
    if (!isTransientDomError(error)) return;

    const now = Date.now();
    const inBurst = now - this.state.lastErrorAt < RESET_WINDOW_MS;
    const nextCount = inBurst ? this.state.resetCount + 1 : 1;
    if (nextCount > MAX_AUTO_RESETS) {
      // Bail out of auto-recovery: error keeps firing, must be a real bug.
      console.warn(`[AppErrorBoundary] giving up after ${MAX_AUTO_RESETS} retries`);
      return;
    }
    // Mark this as "recovering" so render() returns an invisible
    // placeholder instead of the full error screen — keeps the layout
    // calm while React rebuilds the DOM after the reset timer fires.
    this.setState({ resetCount: nextCount, recovering: true });
    this.resetTimer = setTimeout(() => {
      this.setState({ error: null, recovering: false });
    }, RESET_DELAY_MS);
  }
  override componentWillUnmount() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }
  override render() {
    if (this.state.error) {
      // Transient DOM glitches (recovering === true) just hide the tree
      // for a frame; everything else is a real crash that surfaces the
      // full error screen so the user sees something actionable.
      if (this.state.recovering) {
        return <div className="min-h-full bg-surface-50 dark:bg-surface-950" aria-hidden />;
      }
      return <ErrorScreen message={this.state.error.message} />;
    }
    return this.props.children;
  }
}

function FullScreenSpinner() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-surface-400" />
    </div>
  );
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  return <>{isAdmin ? children : <Navigate to="/dashboard" replace />}</>;
}

function AuthenticatedShell() {
  const { t } = useTranslation();
  const { user, loading, disabled, error } = useAuth();

  if (loading) return <FullScreenSpinner />;
  if (!user) return <LoginPage />;

  if (error) {
    return (
      <ErrorScreen
        title={t("errors.loadAccountFailed")}
        message={`${error.message}\n\n${t("errors.loadAccountHint")}`}
      />
    );
  }
  if (disabled) {
    return (
      <ErrorScreen
        title={t("errors.accountDisabled")}
        message={t("errors.accountDisabledMessage")}
      />
    );
  }

  return (
    <FirestoreSetupGate>
      <CmsDataProvider>
        <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/posts/new" element={<PostEditPage />} />
          <Route path="/posts/:id" element={<PostEditPage />} />
          <Route path="/pages" element={<PagesListPage />} />
          <Route path="/pages/new" element={<PageEditPage />} />
          <Route path="/pages/:id" element={<PageEditPage />} />
          <Route path="/taxonomies" element={<TaxonomiesPage />} />
          <Route path="/media" element={<MediaLibraryPage />} />
          <Route path="/themes" element={<ThemesPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/menus" element={<MenusPage />} />
          <Route path="/theme-settings" element={<ThemeSettingsRoute />} />
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<SettingsPage />} />
            <Route path="plugin/:pluginId" element={<PluginSettingsRoute />} />
          </Route>
          <Route
            path="/users"
            element={
              <RequireAdmin>
                <UsersPage />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      </CmsDataProvider>
    </FirestoreSetupGate>
  );
}

export default function App() {
  const { t } = useTranslation();
  const missing = getMissingFirebaseEnvVars();
  if (missing.length > 0) {
    return (
      <ErrorScreen
        title={t("errors.firebaseNotConfigured")}
        message={t("errors.firebaseEnvMissing", { vars: missing.join("\n") })}
      />
    );
  }
  if (!getAdminEmail()) {
    return (
      <ErrorScreen
        title={t("errors.adminEmailNotConfigured")}
        message={t("errors.adminEmailMessage")}
      />
    );
  }

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AuthenticatedShell />
          {/* Toasts are mounted outside the routed shell so navigation
              never unmounts an in-flight notification. They're inside the
              error boundary too so toast emissions during a transient DOM
              error still surface once the boundary auto-recovers. */}
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
