import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import {
  probeBootstrapAdmin,
  signIn,
  signOut,
  subscribeToAuth,
} from "../services/auth";
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
  // Result of the rules-based bootstrap-admin probe. `null` means
  // "not yet probed" (or signed-out); after the probe runs once for a
  // given session, this stays sticky so we don't re-probe on every
  // user-record change.
  const [probeResult, setProbeResult] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuth(async (fbUser) => {
      setError(null);
      if (!fbUser) {
        setUser(null);
        setRecord(null);
        setProbeResult(null);
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

  // Probe the rules-protected `config/admin` doc once per signed-in
  // session. This is the new (no-email-in-config.js) bootstrap-admin
  // detection: rules grant read only to the user whose token matches
  // `bootstrapAdminEmail()` AND has `email_verified == true`.
  // Permission-denied = "not bootstrap admin" (recorded as false).
  // Anything else (network) is logged + treated as "unknown" (left
  // null) so the legacy email-comparison fallback in the value memo
  // can still take over for backward-compat deployments.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    probeBootstrapAdmin()
      .then((isBootstrap) => {
        if (!cancelled) setProbeResult(isBootstrap);
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("[auth] bootstrap-admin probe failed:", err);
          setProbeResult(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

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
    // Bootstrap-admin detection prefers the rules probe (no email in
    // config.js, fully server-side). Falls back to the legacy
    // email-comparison only when an `adminEmail` is still present in
    // the runtime config — covers existing deployments mid-migration.
    // The probe is sticky: once it resolves true/false we trust it; we
    // only consider the legacy path while the probe is null (not yet
    // run, or threw a non-permission error).
    const legacyAdminEmail = getAdminEmail();
    const legacyMatches =
      legacyAdminEmail !== "" && email !== "" && email === legacyAdminEmail;
    const isBootstrapAdmin =
      probeResult === true || (probeResult === null && legacyMatches);
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
  }, [user, record, loading, error, probeResult]);

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
