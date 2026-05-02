import {
  collection,
  deleteField,
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
import type { AdminLocale, Media, UserPreferences, UserRecord, UserRole } from "../core/types";
import { mediaToView } from "../core/media";
import type { AuthorView } from "../themes/types";

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

// Persists the editable author profile fields. Empty strings are
// translated to deleteField() so clearing a value via the UI removes
// the Firestore entry instead of leaving an empty placeholder around.
// Called from Settings → Profile by the user editing their own record.
export interface UserProfilePatch {
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarMediaId?: string | null;
}

export async function setUserProfile(uid: string, patch: UserProfilePatch): Promise<void> {
  const update: Record<string, unknown> = {};
  for (const key of ["firstName", "lastName", "bio", "avatarMediaId"] as const) {
    if (!(key in patch)) continue;
    const value = patch[key];
    if (value === null || value === undefined || value === "") {
      update[key] = deleteField();
    } else {
      update[key] = value;
    }
  }
  if (Object.keys(update).length === 0) return;
  return updateDoc(userDoc(uid), update);
}

// Best-effort display name for templates / admin lists. Order:
//   1. firstName + lastName (when at least one is set)
//   2. legacy displayName field
//   3. email
//   4. literal id (last resort, never blank)
export function resolveDisplayName(record: Pick<UserRecord, "firstName" | "lastName" | "displayName" | "email" | "id">): string {
  const full = [record.firstName, record.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (record.displayName && record.displayName.trim()) return record.displayName.trim();
  if (record.email) return record.email;
  return record.id;
}

export async function deleteUserRecord(uid: string): Promise<void> {
  return deleteDoc(userDoc(uid));
}

// Builds an `authorLookup` resolver suitable for `buildPublishContext`.
// Hits the in-memory users array (subscribed via CmsDataContext) so it
// works for posts authored by any admin — not just the currently
// authenticated user. Resolves the author's avatar through the same
// media catalog the publisher already has in hand, so theme components
// can `pickFormat(avatar, "small")` like they do for hero images.
export function buildAuthorLookup(
  users: UserRecord[],
  media: Media[] | Map<string, Media>,
): (id: string) => AuthorView | undefined {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const mediaMap = media instanceof Map ? media : new Map(media.map((m) => [m.id, m]));
  return (id: string) => {
    const record = userMap.get(id);
    if (!record) return undefined;
    const avatar = record.avatarMediaId
      ? mediaToView(mediaMap.get(record.avatarMediaId))
      : undefined;
    return {
      id: record.id,
      displayName: resolveDisplayName(record),
      email: record.email,
      bio: record.bio,
      avatar,
    };
  };
}
