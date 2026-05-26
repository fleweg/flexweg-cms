// SQLite implementation of the users service. The Flexweg SQLite Auth
// API is the source of truth for who can log in (bcrypt-hashed
// passwords in MySQL on Flexweg). We keep a denormalized **cache** in
// the local SQLite `users` table so the UI (assignee picker, author
// info, avatars) can still be served to non-admin users (the auth
// API's `/auth/users` is admin-only).
//
// Cache population:
//   - Every successful login UPSERTs the current user (via
//     ensureSelfUserRecord, called from AuthContext on subscribeToAuth
//     emit).
//   - Admin mutations (setUserRole / setUserDisabled / deleteUser /
//     setUserProfile) call the API AND update the cache row so the
//     change is visible immediately to the calling admin.
//   - syncUsersFromApi() admin-pulls every registered user into the
//     cache. Required after AddUserModal calls registerUser so the
//     new user is visible immediately (otherwise the next poll tick
//     fixes it ~4 s later; lesson #3 of the migration doc).

import { Timestamp } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { sqlExec, sqlQuery } from "./client";
import { notifyPotentialChange, subscribeWithPolling } from "./subscriptions";
import {
  deleteUser as apiDeleteUser,
  fetchCurrentUser,
  listUsers as apiListUsers,
  updateUser as apiUpdateUser,
} from "./userAuth";
import type {
  AdminLocale,
  Media,
  SocialEntry,
  SocialNetwork,
  UserPreferences,
  UserRecord,
  UserRole,
} from "../../core/types";
import { SOCIAL_NETWORKS } from "../../core/types";
import { mediaToView } from "../../core/media";
import type { AuthorView } from "../../themes/types";

// The CMS Firebase impl uses "admin" | "editor" — we mirror that here.
// The auth API speaks "admin" | "user" — we translate at the boundary
// (editor <-> user) so the rest of the codebase sees the CMS roles.
export const USER_ROLES: { admin: UserRole; editor: UserRole } = {
  admin: "admin",
  editor: "editor",
};

// CMS role <-> auth-API role translation. The auth API doesn't know
// about "editor" — it has "admin" and "user". Non-admin in the CMS
// is just "user" on the API.
function toApiRole(role: UserRole): "admin" | "user" {
  return role === "admin" ? "admin" : "user";
}

function fromApiRole(role: "admin" | "user"): UserRole {
  return role === "admin" ? "admin" : "editor";
}

interface UserRow {
  uid: string;
  email: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  bio: string | null;
  avatar_media_id: string | null;
  socials: string | null;
  role: string;
  disabled: number;
  preferences: string | null;
  created_at: number;
  created_by: string | null;
}

function parseSocials(s: string | null): Partial<Record<SocialNetwork, SocialEntry>> | undefined {
  if (!s) return undefined;
  try {
    const v = JSON.parse(s);
    return v && typeof v === "object" ? (v as Partial<Record<SocialNetwork, SocialEntry>>) : undefined;
  } catch {
    return undefined;
  }
}

function parsePreferences(s: string | null): UserPreferences | undefined {
  if (!s) return undefined;
  try {
    const v = JSON.parse(s);
    if (v && typeof v === "object" && typeof (v as { adminLocale?: string }).adminLocale === "string") {
      return v as UserPreferences;
    }
  } catch {
    // fall through
  }
  return undefined;
}

function rowToUser(r: UserRow): UserRecord {
  const record: UserRecord = {
    id: r.uid,
    email: r.email,
    role: (r.role as UserRole) ?? "editor",
    disabled: !!r.disabled,
  };
  if (r.display_name) record.displayName = r.display_name;
  if (r.first_name) record.firstName = r.first_name;
  if (r.last_name) record.lastName = r.last_name;
  if (r.title) record.title = r.title;
  if (r.bio) record.bio = r.bio;
  if (r.avatar_media_id) record.avatarMediaId = r.avatar_media_id;
  const socials = parseSocials(r.socials);
  if (socials) record.socials = socials;
  const preferences = parsePreferences(r.preferences);
  if (preferences) record.preferences = preferences;
  if (r.created_at) record.createdAt = Timestamp.fromMillis(r.created_at);
  if (r.created_by) record.createdBy = r.created_by;
  return record;
}

export function subscribeToUsers(
  onChange: (users: UserRecord[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    async () => {
      const { rows } = await sqlQuery<UserRow>(
        "SELECT * FROM users ORDER BY email ASC",
        [],
      );
      return rows.map(rowToUser);
    },
    onChange,
    onError,
  );
}

export async function getUserRecord(uid: string): Promise<UserRecord | null> {
  const { rows } = await sqlQuery<UserRow>(
    "SELECT * FROM users WHERE uid = ?",
    [uid],
  );
  return rows.length > 0 ? rowToUser(rows[0]) : null;
}

// Live single-record subscription. Used by AuthContext to keep the
// signed-in user's record fresh — so updates to e.g. `adminLocale`
// reflect in the admin UI without a reload. Polls the cache (which
// gets refreshed on login + admin mutations).
export function subscribeToUserRecord(
  uid: string,
  onChange: (record: UserRecord | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    async () => getUserRecord(uid),
    onChange,
    onError,
  );
}

// Called from AuthContext on each successful login. The auth API has
// already vouched for this user — we just UPSERT them into the local
// cache so the assignee picker / avatars find them. Pulls fresh role
// + disabled from /auth/me so the cache reflects any admin change
// that happened between sessions.
export async function ensureSelfUserRecord(authUser: FirebaseUser): Promise<UserRecord> {
  let role: UserRole = USER_ROLES.editor;
  let disabled = false;
  try {
    const me = await fetchCurrentUser();
    if (me) {
      role = fromApiRole(me.role);
      disabled = me.disabled;
    }
  } catch {
    // Network blip / partial outage. Use the existing cached row if any.
    const existing = await getUserRecord(authUser.uid);
    if (existing) {
      role = existing.role;
      disabled = existing.disabled;
    }
  }

  const now = Date.now();
  const email = (authUser.email ?? "").toLowerCase();
  const defaultPrefs: UserPreferences = { adminLocale: "en" as AdminLocale };
  // SQLite >= 3.24 ON CONFLICT — atomic upsert. Preserves CMS-only
  // columns (firstName, lastName, title, bio, avatar_media_id, socials,
  // preferences) on conflict — only auth-relevant fields are refreshed.
  await sqlExec(
    `INSERT INTO users (
      uid, email, display_name, role, disabled, preferences,
      created_at, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(uid) DO UPDATE SET
       email = excluded.email,
       role = excluded.role,
       disabled = excluded.disabled`,
    [
      authUser.uid,
      email,
      authUser.displayName ?? null,
      role,
      disabled ? 1 : 0,
      JSON.stringify(defaultPrefs),
      now,
      authUser.uid,
    ],
  );
  notifyPotentialChange();
  const refreshed = await getUserRecord(authUser.uid);
  if (refreshed) return refreshed;
  // Fallback (shouldn't happen — we just upserted): construct from inputs.
  return {
    id: authUser.uid,
    email,
    role,
    disabled,
    preferences: defaultPrefs,
    createdAt: Timestamp.fromMillis(now),
    createdBy: authUser.uid,
  };
}

function uidToApiId(uid: string): number {
  const n = parseInt(uid, 10);
  if (Number.isNaN(n)) {
    throw new Error(`Cannot map uid "${uid}" to a numeric Flexweg user id.`);
  }
  return n;
}

// Admin-only — calls the auth API first (source of truth), then
// updates the local cache so the admin sees the change without
// waiting for the next /auth/me round trip from each user.
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  if (role !== USER_ROLES.admin && role !== USER_ROLES.editor) {
    throw new Error("Invalid role.");
  }
  await apiUpdateUser(uidToApiId(uid), { role: toApiRole(role) });
  await sqlExec("UPDATE users SET role = ? WHERE uid = ?", [role, uid]);
  notifyPotentialChange();
}

export async function setUserDisabled(uid: string, disabled: boolean): Promise<void> {
  await apiUpdateUser(uidToApiId(uid), { disabled });
  await sqlExec("UPDATE users SET disabled = ? WHERE uid = ?", [disabled ? 1 : 0, uid]);
  notifyPotentialChange();
}

// Merge into preferences blob (JSON column). Read → patch → write.
export async function setUserPreferences(uid: string, prefs: Partial<UserPreferences>): Promise<void> {
  const { rows } = await sqlQuery<{ preferences: string | null }>(
    "SELECT preferences FROM users WHERE uid = ?",
    [uid],
  );
  if (rows.length === 0) return;
  const current = parsePreferences(rows[0].preferences) ?? { adminLocale: "en" as AdminLocale };
  const next: UserPreferences = {
    ...current,
    ...(prefs.adminLocale ? { adminLocale: prefs.adminLocale } : {}),
  };
  await sqlExec("UPDATE users SET preferences = ? WHERE uid = ?", [JSON.stringify(next), uid]);
  notifyPotentialChange();
}

// Mirrors firebase/users.ts.UserProfilePatch — empty strings / null
// translate to NULL in SQL (i.e. cleared field).
export interface UserProfilePatch {
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  bio?: string | null;
  avatarMediaId?: string | null;
  socials?: Partial<Record<SocialNetwork, SocialEntry>> | null;
}

const PROFILE_FIELD_TO_COLUMN: Record<keyof Omit<UserProfilePatch, "socials">, string> = {
  firstName: "first_name",
  lastName: "last_name",
  title: "title",
  bio: "bio",
  avatarMediaId: "avatar_media_id",
};

export async function setUserProfile(uid: string, patch: UserProfilePatch): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [];
  for (const key of ["firstName", "lastName", "title", "bio", "avatarMediaId"] as const) {
    if (!(key in patch)) continue;
    const value = patch[key];
    sets.push(`${PROFILE_FIELD_TO_COLUMN[key]} = ?`);
    if (value === null || value === undefined || value === "") {
      params.push(null);
    } else {
      params.push(value);
    }
  }
  if ("socials" in patch) {
    const value = patch.socials;
    if (value === null || value === undefined) {
      sets.push("socials = ?");
      params.push(null);
    } else {
      // Drop entries with empty URLs (mirror firebase/users.ts cleanup).
      const cleaned: Partial<Record<SocialNetwork, SocialEntry>> = {};
      for (const [network, entry] of Object.entries(value) as Array<[SocialNetwork, SocialEntry]>) {
        if (entry && typeof entry.url === "string" && entry.url.trim().length > 0) {
          cleaned[network] = { url: entry.url.trim(), visible: !!entry.visible };
        }
      }
      sets.push("socials = ?");
      params.push(Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : null);
    }
  }
  if (sets.length === 0) return;
  params.push(uid);
  await sqlExec(`UPDATE users SET ${sets.join(", ")} WHERE uid = ?`, params);
  notifyPotentialChange();
}

// Admin-facing resolver. Email/id fallbacks are acceptable in admin
// UI (the team knows who's who). For public-facing surfaces use
// resolvePublicDisplayName below.
export function resolveDisplayName(
  record: Pick<UserRecord, "firstName" | "lastName" | "displayName" | "email" | "id">,
): string {
  const full = [record.firstName, record.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (record.displayName && record.displayName.trim()) return record.displayName.trim();
  if (record.email) return record.email;
  return record.id;
}

// Strict public-facing resolver. Never leaks email / id. Returns ""
// when no name is set — callers should treat that as "no author info".
export function resolvePublicDisplayName(
  record: Pick<UserRecord, "firstName" | "lastName" | "displayName">,
): string {
  const full = [record.firstName, record.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (record.displayName && record.displayName.trim()) return record.displayName.trim();
  return "";
}

export async function deleteUserRecord(uid: string): Promise<void> {
  // Call auth API first (source of truth), then drop the cache row.
  // 404 from the API means the user was already gone there — fine,
  // proceed with the local cleanup so the cache doesn't keep a ghost.
  try {
    await apiDeleteUser(uidToApiId(uid));
  } catch (err) {
    const e = err as { status?: number };
    if (e?.status !== 404) throw err;
  }
  await sqlExec("DELETE FROM users WHERE uid = ?", [uid]);
  notifyPotentialChange();
}

// Filters the user's stored socials map down to (a) present, (b)
// visible, (c) non-empty URL. Order follows SOCIAL_NETWORKS so the
// public output is stable.
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

export function buildAuthorLookup(
  users: UserRecord[],
  media: Media[] | Map<string, Media>,
): (id: string) => AuthorView | undefined {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const mediaMap = media instanceof Map ? media : new Map(media.map((m) => [m.id, m]));
  return (id: string) => {
    const record = userMap.get(id);
    if (!record) return undefined;
    const displayName = resolvePublicDisplayName(record);
    if (!displayName) return undefined;
    const avatar = record.avatarMediaId
      ? mediaToView(mediaMap.get(record.avatarMediaId))
      : undefined;
    const socials = visibleSocials(record);
    return {
      id: record.id,
      displayName,
      title: record.title,
      bio: record.bio,
      avatar,
      socials: socials.length > 0 ? socials : undefined,
    };
  };
}

// Admin convenience: pull every registered user from the auth API
// into the local cache. CMS-only columns (firstName, lastName, title,
// bio, avatarMediaId, socials, preferences) are preserved on conflict
// — the auth API doesn't carry those fields.
//
// REQUIRED after AddUserModal calls registerUser — otherwise the new
// user is invisible for ~4 s and re-submitting returns 409
// EMAIL_ALREADY_REGISTERED (lesson #3 of the migration doc).
export async function syncUsersFromApi(): Promise<UserRecord[]> {
  const remote = await apiListUsers();
  const now = Date.now();
  const defaultPrefs: UserPreferences = { adminLocale: "en" as AdminLocale };
  for (const u of remote) {
    const role = fromApiRole(u.role);
    await sqlExec(
      `INSERT INTO users (
        uid, email, display_name, role, disabled, preferences,
        created_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(uid) DO UPDATE SET
         email = excluded.email,
         role = excluded.role,
         disabled = excluded.disabled`,
      [
        String(u.id),
        u.email.toLowerCase(),
        u.displayName ?? null,
        role,
        u.disabled ? 1 : 0,
        JSON.stringify(defaultPrefs),
        now,
        String(u.id),
      ],
    );
  }
  notifyPotentialChange();
  // Read back from the cache so we return the canonical UserRecord
  // shape (with any CMS-only columns merged in).
  const { rows } = await sqlQuery<UserRow>(
    "SELECT * FROM users ORDER BY email ASC",
    [],
  );
  return rows.map(rowToUser);
}
