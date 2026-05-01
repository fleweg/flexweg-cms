import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { getAuthClient } from "./firebase";

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
