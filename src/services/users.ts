import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { collections, getDb } from "./firebase";
import type { AdminLocale, UserPreferences, UserRecord, UserRole } from "../core/types";

export const USER_ROLES: { admin: UserRole; editor: UserRole } = {
  admin: "admin",
  editor: "editor",
};

const usersCollection = () => collection(getDb(), collections.users);
const userDoc = (uid: string) => doc(getDb(), collections.users, uid);

export function subscribeToUsers(
  onChange: (users: UserRecord[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(usersCollection(), orderBy("email", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserRecord);
      onChange(users);
    },
    onError,
  );
}

export async function getUserRecord(uid: string): Promise<UserRecord | null> {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as UserRecord) : null;
}

// Self-create record on first login. New users default to the editor role
// and English admin locale. Bootstrap admin status is derived from the env
// var, not from this record (so the very first login has admin powers even
// before this record exists).
export async function ensureSelfUserRecord(authUser: FirebaseUser): Promise<UserRecord> {
  const ref = userDoc(authUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as UserRecord;
  const data = {
    email: (authUser.email ?? "").toLowerCase(),
    role: USER_ROLES.editor,
    disabled: false,
    preferences: { adminLocale: "en" as AdminLocale },
    createdAt: serverTimestamp(),
    createdBy: authUser.uid,
  };
  await setDoc(ref, data);
  return { id: authUser.uid, ...data } as unknown as UserRecord;
}

export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  if (role !== USER_ROLES.admin && role !== USER_ROLES.editor) {
    throw new Error("Invalid role.");
  }
  return updateDoc(userDoc(uid), { role });
}

export async function setUserDisabled(uid: string, disabled: boolean): Promise<void> {
  return updateDoc(userDoc(uid), { disabled: Boolean(disabled) });
}

export async function setUserPreferences(uid: string, prefs: Partial<UserPreferences>): Promise<void> {
  // Merge under `preferences.*` rather than overwriting the whole map so
  // future preference fields don't get clobbered by partial updates.
  const update: Record<string, unknown> = {};
  if (prefs.adminLocale) update["preferences.adminLocale"] = prefs.adminLocale;
  if (Object.keys(update).length === 0) return;
  return updateDoc(userDoc(uid), update);
}

export async function deleteUserRecord(uid: string): Promise<void> {
  return deleteDoc(userDoc(uid));
}
