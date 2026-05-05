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
import type {
  AdminLocale,
  Media,
  SocialEntry,
  SocialNetwork,
  UserPreferences,
  UserRecord,
  UserRole,
} from "../core/types";
import { SOCIAL_NETWORKS } from "../core/types";
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

// Live subscription to a single user's record. AuthContext uses this to
// keep the signed-in user's record fresh after the initial load — so
// settings like adminLocale change immediately in the UI when the user
// updates them, without waiting for a reload.
export function subscribeToUserRecord(
  uid: string,
  onChange: (record: UserRecord | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return onSnapshot(
    userDoc(uid),
    (snap) => {
      onChange(snap.exists() ? ({ id: snap.id, ...snap.data() } as UserRecord) : null);
    },
    onError,
  );
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
  // Job / role title shown publicly under the name in author cards.
  // Empty / null clears the field entirely (deleteField).
  title?: string | null;
  bio?: string | null;
  avatarMediaId?: string | null;
  // Social profiles map. When set, replaces the whole `socials`
  // object — the form sends the full state on every save so we
  // don't have to merge per-network. Pass `null` to clear all.
  socials?: Partial<Record<SocialNetwork, SocialEntry>> | null;
}

export async function setUserProfile(uid: string, patch: UserProfilePatch): Promise<void> {
  const update: Record<string, unknown> = {};
  for (const key of ["firstName", "lastName", "title", "bio", "avatarMediaId"] as const) {
    if (!(key in patch)) continue;
    const value = patch[key];
    if (value === null || value === undefined || value === "") {
      update[key] = deleteField();
    } else {
      update[key] = value;
    }
  }
  if ("socials" in patch) {
    const value = patch.socials;
    if (value === null || value === undefined) {
      update.socials = deleteField();
    } else {
      // Drop entries with empty URLs — keeping them would persist
      // half-configured networks across saves and surface as
      // "configured but invisible" in subsequent reads. Empty URL =
      // user cleared the field, so we treat it as "remove this
      // network entirely".
      const cleaned: Partial<Record<SocialNetwork, SocialEntry>> = {};
      for (const [network, entry] of Object.entries(value) as Array<[SocialNetwork, SocialEntry]>) {
        if (entry && typeof entry.url === "string" && entry.url.trim().length > 0) {
          cleaned[network] = { url: entry.url.trim(), visible: !!entry.visible };
        }
      }
      update.socials = Object.keys(cleaned).length > 0 ? cleaned : deleteField();
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

// Filters the user's stored socials map down to the entries that are
// (a) present, (b) marked visible, and (c) carry a non-empty URL.
// Order follows SOCIAL_NETWORKS so the public output is stable.
function visibleSocials(record: UserRecord): { network: SocialNetwork; url: string }[] {
  const stored = record.socials;
  if (!stored) return [];
  const out: { network: SocialNetwork; url: string }[] = [];
  for (const network of SOCIAL_NETWORKS) {
    const entry = stored[network];
    if (!entry || !entry.visible) continue;
    if (typeof entry.url !== "string" || !entry.url.trim()) continue;
    out.push({ network, url: entry.url.trim() });
  }
  return out;
}

// Builds an `authorLookup` resolver suitable for `buildPublishContext`.
// Hits the in-memory users array (subscribed via CmsDataContext) so it
// works for posts authored by any admin — not just the currently
// authenticated user. Resolves the author's avatar through the same
// media catalog the publisher already has in hand, so theme components
// can `pickFormat(avatar, "small")` like they do for hero images.
//
// Email is intentionally NOT carried over to AuthorView — it's
// admin-only data. Templates that previously read `author.email` for
// a fallback should fall through to `bio` or stay silent.
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
    const socials = visibleSocials(record);
    return {
      id: record.id,
      displayName: resolveDisplayName(record),
      title: record.title,
      bio: record.bio,
      avatar,
      socials: socials.length > 0 ? socials : undefined,
    };
  };
}
