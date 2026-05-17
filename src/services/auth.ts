import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { collections, configDocs, getAuthClient, getDb } from "./firebase";

export function subscribeToAuth(onChange: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(getAuthClient(), onChange);
}

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(getAuthClient(), email.trim(), password);
  return cred.user;
}

export async function signOut(): Promise<void> {
  return fbSignOut(getAuthClient());
}

export async function sendResetEmail(email: string): Promise<void> {
  return sendPasswordResetEmail(getAuthClient(), email.trim());
}

// Probes whether the currently-signed-in user is the bootstrap admin
// by attempting to read `config/admin` — a doc whose Firestore rules
// grant read ONLY to the user whose email matches the rules-pinned
// bootstrap admin email.
//
// Why this exists: it lets the client identify the bootstrap admin
// without carrying the admin email in the public `/admin/config.js`.
// The rules stay the source of truth; the client is just asking
// "am I that user?" via a permission probe.
//
// Returns true on read success, false on permission-denied. Other
// errors (network, etc.) propagate so callers can decide whether to
// retry — we don't silently treat them as "not admin" because that
// would mask transient failures and degrade UX.
export async function probeBootstrapAdmin(): Promise<boolean> {
  try {
    await getDoc(doc(getDb(), collections.config, configDocs.admin));
    return true;
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    if (code === "permission-denied") return false;
    throw err;
  }
}

// Maps Firebase Auth error codes to translation keys consumed by the admin UI.
// Returning a key (not a translated string) lets callers run i18next with the
// active locale at render time.
export function authErrorKey(err: unknown): string {
  const e = err as { code?: string; message?: string } | null;
  const code = e?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "auth.errors.invalidEmail";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "auth.errors.invalidCredentials";
    case "auth/too-many-requests":
      return "auth.errors.tooManyRequests";
    case "auth/user-disabled":
      return "auth.errors.userDisabled";
    case "auth/network-request-failed":
      return "auth.errors.networkFailed";
    default:
      return "auth.errors.generic";
  }
}
