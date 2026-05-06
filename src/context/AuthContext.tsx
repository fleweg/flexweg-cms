import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { subscribeToAuth, signIn, signOut } from "../services/auth";
import { ensureSelfUserRecord, subscribeToUserRecord, USER_ROLES } from "../services/users";
import { getAdminEmail } from "../services/firebase";
import { setActiveLocale } from "../i18n";
import type { UserRecord, UserRole } from "../core/types";

interface AuthValue {
  user: FirebaseUser | null;
  record: UserRecord | null;
  role: UserRole | null;
  isAdmin: boolean;
  disabled: boolean;
  loading: boolean;
  error: Error | null;
  signIn: typeof signIn;
  signOut: typeof signOut;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [record, setRecord] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuth(async (fbUser) => {
      setError(null);
      if (!fbUser) {
        setUser(null);
        setRecord(null);
        setLoading(false);
        return;
      }
      setUser(fbUser);
      try {
        const rec = await ensureSelfUserRecord(fbUser);
        setRecord(rec);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  // Keep `record` in sync with Firestore after the initial fetch above.
  // Without this, profile updates (admin locale, avatar, bio…) don't
  // reflect in the UI until a full reload — the local state would stay
  // pinned to the value loaded at sign-in time.
  useEffect(() => {
    if (!user) return;
    return subscribeToUserRecord(
      user.uid,
      (rec) => {
        if (rec) setRecord(rec);
      },
      (err) => setError(err),
    );
  }, [user]);

  // Apply the user's saved admin locale only once the record is committed.
  // Calling setActiveLocale inside the auth callback above would emit an
  // i18next language-change event mid-render, racing with React's commit
  // phase and producing "Node.insertBefore" DOM errors on login.
  useEffect(() => {
    if (record?.preferences?.adminLocale) {
      void setActiveLocale(record.preferences.adminLocale);
    }
  }, [record?.preferences?.adminLocale]);

  const value = useMemo<AuthValue>(() => {
    const email = (user?.email ?? "").toLowerCase();
    const isBootstrapAdmin = email !== "" && email === getAdminEmail();
    const role: UserRole | null = isBootstrapAdmin ? USER_ROLES.admin : record?.role ?? null;
    const disabled = !isBootstrapAdmin && record?.disabled === true;
    return {
      user,
      record,
      role,
      isAdmin: role === USER_ROLES.admin,
      disabled,
      loading,
      error,
      signIn,
      signOut,
    };
  }, [user, record, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// Variant for components that may render before AuthProvider is mounted
// — typically the first-run SetupForm tree, which renders before Firebase
// is configured. Returns null when no provider is in scope so callers
// can degrade gracefully instead of crashing.
export function useOptionalAuth(): AuthValue | null {
  return useContext(AuthContext);
}
