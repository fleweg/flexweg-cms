import { Component, type ErrorInfo, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CmsDataProvider } from "./context/CmsDataContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ErrorScreen } from "./components/ErrorScreen";
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
import { UsersPage } from "./pages/UsersPage";
import { getAdminEmail, getMissingFirebaseEnvVars } from "./services/firebase";

interface BoundaryState {
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }
  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info);
  }
  override render() {
    if (this.state.error) {
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
          <Route path="/settings" element={<SettingsPage />} />
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
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
