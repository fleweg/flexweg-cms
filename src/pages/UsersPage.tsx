import { useEffect, useState, type FormEvent } from "react";
import {
  ImageIcon,
  Loader2,
  Pencil,
  Save,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { MediaPicker } from "../components/editor/MediaPicker";
import { useCmsData } from "../context/CmsDataContext";
import { useAuth } from "../context/AuthContext";
import { pickMediaUrl } from "../core/media";
import { ADMIN_PREVIEW_KEY, ADMIN_THUMB_KEY } from "../services/imageFormats";
import { publishAuthorsJson } from "../services/authorsJsonPublisher";
import { fetchAllPosts } from "../services/posts";
import {
  buildPublishContext,
  publishAuthorArchive,
  type PublishLogEntry,
} from "../services/publisher";
import {
  buildAuthorLookup,
  deleteUserRecord,
  resolveDisplayName,
  setUserDisabled,
  setUserProfile,
  setUserRole,
} from "../services/users";
import { authErrorKey } from "../services/auth";
import { getBackendKind } from "../lib/runtimeConfig";
import { registerUser } from "../services/flexweg-sqlite/userAuth";
import { syncUsersFromApi } from "../services/flexweg-sqlite/users";
import { toast } from "../lib/toast";
import type { SocialEntry, SocialNetwork, UserRecord } from "../core/types";
import { SOCIAL_NETWORKS } from "../core/types";

// Display labels for the curated social networks. Proper nouns —
// not translated. Keep in sync with SOCIAL_NETWORKS.
const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  mastodon: "Mastodon",
  bluesky: "Bluesky",
  github: "GitHub",
  website: "Website",
};

const SOCIAL_PLACEHOLDERS: Record<SocialNetwork, string> = {
  twitter: "https://twitter.com/your-handle",
  linkedin: "https://linkedin.com/in/your-handle",
  instagram: "https://instagram.com/your-handle",
  mastodon: "https://mastodon.social/@your-handle",
  bluesky: "https://bsky.app/profile/your-handle",
  github: "https://github.com/your-handle",
  website: "https://your-site.com",
};

// Admin-only page (gated by `<RequireAdmin>` in App.tsx). Lists every
// known user record and lets the admin manage roles, disabled status,
// and now also edit each user's public profile (firstName / lastName /
// bio / avatar). Non-admin users edit their own profile via
// Settings → Profile, which exposes the same setUserProfile service.
//
// In SQLite mode, also exposes a "+ Add user" button that calls the
// Flexweg SQLite Auth API directly — Firebase mode users still need to
// be created through the Firebase Console first.
export function UsersPage() {
  const { t } = useTranslation();
  const { users } = useCmsData();
  const { isAdmin } = useAuth();
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const isSqlite = getBackendKind() === "flexweg-sqlite";

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title={t("users.title")} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {isSqlite ? t("users.descriptionSqlite") : t("users.descriptionFirebase")}
        </p>
        {isSqlite && isAdmin && (
          <button
            type="button"
            className="btn-primary text-xs"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            {t("users.addUser")}
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <div className="card p-8 text-center space-y-2">
          <p className="text-sm font-medium text-surface-700 dark:text-surface-200">
            {t("users.empty.title")}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {isSqlite ? t("users.empty.descriptionSqlite") : t("users.empty.descriptionFirebase")}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSqlite={isSqlite}
              onEdit={() => setEditingUser(user)}
            />
          ))}
        </div>
      )}

      <div className="card p-4 bg-surface-50/40 dark:bg-surface-950/40">
        <h3 className="text-sm font-semibold mb-2">{t("users.help.title")}</h3>
        {isSqlite ? (
          <ol className="text-sm text-surface-600 space-y-1.5 list-decimal pl-5 dark:text-surface-300">
            <li>{t("users.help.sqlite.step1")}</li>
            <li>{t("users.help.sqlite.step2")}</li>
            <li>{t("users.help.sqlite.step3")}</li>
          </ol>
        ) : (
          <ol className="text-sm text-surface-600 space-y-1.5 list-decimal pl-5 dark:text-surface-300">
            <li>{t("users.help.firebase.step1")}</li>
            <li>{t("users.help.firebase.step2")}</li>
            <li>{t("users.help.firebase.step3")}</li>
          </ol>
        )}
      </div>

      {editingUser && (
        <EditProfileModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
      {addOpen && (
        <AddUserModal
          onClose={() => setAddOpen(false)}
          onCreated={async (email) => {
            setAddOpen(false);
            // Refresh the local cache so the new user appears immediately
            // (the polling tick would also catch it, but this is snappier
            // and avoids a confusing 409 on re-submit — lesson #3).
            try {
              await syncUsersFromApi();
            } catch (err) {
              console.warn("syncUsersFromApi failed", err);
            }
            toast.success(t("users.addUserSuccess", { email }));
          }}
        />
      )}
    </div>
  );
}

function UserRow({
  user,
  isSqlite,
  onEdit,
}: {
  user: UserRecord;
  isSqlite: boolean;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  const { media } = useCmsData();
  const isAdmin = user.role === "admin";
  const displayName = resolveDisplayName(user);
  // Resolve avatar via the existing media catalog so the row preview
  // uses the same admin-thumb variant as the rest of the admin UI.
  const avatarMedia = user.avatarMediaId
    ? media.find((m) => m.id === user.avatarMediaId)
    : undefined;
  const avatarUrl = avatarMedia ? pickMediaUrl(avatarMedia, ADMIN_THUMB_KEY) : "";
  const showName = displayName !== user.email;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-1 ring-surface-200 dark:ring-surface-700 shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 dark:bg-surface-800 shrink-0">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {showName ? displayName : user.email}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
            {showName ? user.email : null}
            {showName ? " · " : ""}
            {isAdmin ? t("common.administrator") : t("common.editor")}
            {user.disabled ? ` · ${t("users.disabled")}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          className="btn-ghost"
          onClick={onEdit}
          title={t("users.actions.editProfile")}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setUserRole(user.id, isAdmin ? "editor" : "admin")}
          title={isAdmin ? t("users.actions.demote") : t("users.actions.promote")}
        >
          <ShieldCheck className={isAdmin ? "h-4 w-4 text-emerald-500" : "h-4 w-4"} />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setUserDisabled(user.id, !user.disabled)}
          title={user.disabled ? t("users.actions.enable") : t("users.actions.disable")}
        >
          <ShieldOff className={user.disabled ? "h-4 w-4 text-red-500" : "h-4 w-4"} />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            const msg = isSqlite
              ? t("users.removeConfirmSqlite", { email: user.email })
              : t("users.removeConfirmFirebase", { email: user.email });
            if (window.confirm(msg)) {
              void deleteUserRecord(user.id);
            }
          }}
          title={t("users.actions.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Modal that mirrors the Settings → Profile form. Admins use this to
// edit any user's public profile (name / bio / avatar). The same
// `setUserProfile` service runs underneath, so Firestore rules treat
// the write identically to a self-edit — except admins are allowed to
// patch ANY user record while non-admins are restricted to their own.
function EditProfileModal({ user, onClose }: { user: UserRecord; onClose: () => void }) {
  const { t } = useTranslation();
  const { media, users, terms, settings } = useCmsData();

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [title, setTitle] = useState(user.title ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarMediaId, setAvatarMediaId] = useState<string | undefined>(user.avatarMediaId);
  // Per-network draft. Keys mirror SocialNetwork; values carry the
  // editable URL + visibility toggle. We always render every network
  // so the user sees the full set of options — entries with empty
  // URLs are dropped at save time.
  const [socials, setSocials] = useState<Partial<Record<SocialNetwork, SocialEntry>>>(
    () => user.socials ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Re-hydrate when the underlying record echoes back changes (rare,
  // but keeps the modal honest when an external write lands while it's
  // open — same pattern as Settings → Profile and MenusPage).
  useEffect(() => {
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setTitle(user.title ?? "");
    setBio(user.bio ?? "");
    setAvatarMediaId(user.avatarMediaId);
    setSocials(user.socials ?? {});
  }, [user]);

  function patchSocial(network: SocialNetwork, patch: Partial<SocialEntry>): void {
    setSocials((prev) => {
      const current = prev[network] ?? { url: "", visible: false };
      return { ...prev, [network]: { ...current, ...patch } };
    });
  }

  const avatarMedia = avatarMediaId
    ? media.find((m) => m.id === avatarMediaId)
    : undefined;
  const avatarPreviewUrl = avatarMedia ? pickMediaUrl(avatarMedia, ADMIN_PREVIEW_KEY) : "";

  async function handleSave() {
    setSaving(true);
    try {
      const profilePatch = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        title: title.trim(),
        bio: bio.trim(),
        avatarMediaId: avatarMediaId ?? null,
        // setUserProfile drops entries with empty URLs and writes the
        // map atomically — pass the raw form state, the service
        // sanitises.
        socials: socials,
      };
      await setUserProfile(user.id, profilePatch);
      // Refresh /authors.json on the public site so the AuthorBio
      // sidebar block reflects the new bio/avatar/name without
      // requiring a republish of every post the author wrote. The
      // Firestore subscription hasn't echoed back yet, so we
      // optimistically merge the patch onto the local users array.
      // Apply the same cleaning the service does — drop empty-URL
      // entries — so the optimistic copy mirrors what's about to land
      // in Firestore.
      const cleanedSocials: Partial<Record<SocialNetwork, SocialEntry>> = {};
      for (const [network, entry] of Object.entries(socials) as Array<[SocialNetwork, SocialEntry]>) {
        if (entry && typeof entry.url === "string" && entry.url.trim()) {
          cleanedSocials[network] = { url: entry.url.trim(), visible: !!entry.visible };
        }
      }
      const optimisticUsers = users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              firstName: profilePatch.firstName || undefined,
              lastName: profilePatch.lastName || undefined,
              title: profilePatch.title || undefined,
              bio: profilePatch.bio || undefined,
              avatarMediaId: profilePatch.avatarMediaId ?? undefined,
              socials: Object.keys(cleanedSocials).length > 0 ? cleanedSocials : undefined,
            }
          : u,
      );
      // The publisher refresh below needs the full post + page corpus
      // to (a) update authors.json post counts and (b) decide whether
      // an author archive page even exists for this user. Fetch on
      // demand from the cache-backed helper instead of relying on a
      // global subscription.
      const [allPosts, allPages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      try {
        await publishAuthorsJson(optimisticUsers, media, allPosts, allPages);
      } catch (err) {
        // Surface failure but keep the local Firestore write — the
        // next post publish (or another profile save) will retry.
        console.error("[users] authors.json refresh failed:", err);
      }
      // Re-render the author's archive page (header reflects the new
      // bio/avatar/name; post grid stays the same since posts didn't
      // change). Skipped silently when the user has no online posts —
      // there's no archive to refresh in that case.
      const hasOnlinePosts = [...allPosts, ...allPages].some(
        (p) => p.status === "online" && p.authorId === user.id,
      );
      if (hasOnlinePosts) {
        try {
          const ctx = await buildPublishContext({
            terms,
            settings,
            users: optimisticUsers,
            authorLookup: buildAuthorLookup(optimisticUsers, media),
          });
          const noopLog = (_entry: PublishLogEntry) => {};
          await publishAuthorArchive(user.id, ctx, noopLog);
        } catch (err) {
          console.error("[users] author archive refresh failed:", err);
        }
      }
      toast.success(t("users.profileSaved"));
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
        <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
          <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-4 py-3 dark:border-surface-700">
            <h2 className="text-sm font-semibold">
              {t("users.editProfileTitle", { email: user.email })}
            </h2>
            <button type="button" className="btn-ghost" onClick={onClose} aria-label={t("common.close")}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 space-y-4">
            <div>
              <label className="label">{t("settings.profile.avatar")}</label>
              <div className="flex items-center gap-4">
                {avatarPreviewUrl ? (
                  <img
                    src={avatarPreviewUrl}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover ring-1 ring-surface-200 dark:ring-surface-700"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 dark:bg-surface-800">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAvatarPicker(true)}
                  >
                    <ImageIcon className="h-4 w-4" />
                    {avatarMediaId
                      ? t("settings.profile.changeAvatar")
                      : t("settings.profile.pickAvatar")}
                  </button>
                  {avatarMediaId && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setAvatarMediaId(undefined)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("settings.profile.removeAvatar")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label">{t("settings.profile.firstName")}</label>
                <input
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="label">{t("settings.profile.lastName")}</label>
                <input
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">{t("settings.profile.headline")}</label>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("settings.profile.headlinePlaceholder")}
              />
              <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
                {t("settings.profile.headlineHelp")}
              </p>
            </div>

            <div>
              <label className="label">{t("settings.profile.bio")}</label>
              <textarea
                className="input min-h-[120px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t("settings.profile.bioPlaceholder")}
              />
              <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
                {t("settings.profile.bioHelp")}
              </p>
            </div>

            <div>
              <label className="label">{t("settings.profile.socials")}</label>
              <p className="text-xs text-surface-500 mb-2 dark:text-surface-400">
                {t("settings.profile.socialsHelp")}
              </p>
              <div className="space-y-2">
                {SOCIAL_NETWORKS.map((network) => {
                  const entry = socials[network] ?? { url: "", visible: false };
                  const hasUrl = entry.url.trim().length > 0;
                  return (
                    <div key={network} className="flex items-center gap-2">
                      <span className="text-xs font-medium w-24 shrink-0 text-surface-700 dark:text-surface-200">
                        {SOCIAL_LABELS[network]}
                      </span>
                      <input
                        type="url"
                        className="input flex-1"
                        placeholder={SOCIAL_PLACEHOLDERS[network]}
                        value={entry.url}
                        onChange={(e) => patchSocial(network, { url: e.target.value })}
                      />
                      <label
                        className={
                          "flex items-center gap-1 text-xs whitespace-nowrap " +
                          (hasUrl
                            ? "text-surface-700 dark:text-surface-200 cursor-pointer"
                            : "text-surface-400 dark:text-surface-500 cursor-not-allowed")
                        }
                        title={t("settings.profile.socialsShowHelp")}
                      >
                        <input
                          type="checkbox"
                          checked={!!entry.visible}
                          onChange={(e) => patchSocial(network, { visible: e.target.checked })}
                          disabled={!hasUrl}
                        />
                        {t("settings.profile.socialsShow")}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-surface-200 px-4 py-3 dark:border-surface-700">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
              {t("common.cancel")}
            </button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {/* Lesson #4: always render the icons, toggle via className.
                  Stable DOM prevents `Node.insertBefore` crashes when a
                  browser extension has injected nodes inside the form. */}
              <span className="inline-flex items-center justify-center gap-1.5">
                <Loader2 className={"h-4 w-4 animate-spin " + (saving ? "" : "hidden")} />
                <Save className={"h-4 w-4 " + (saving ? "hidden" : "")} />
                <span>{saving ? t("common.saving") : t("common.save")}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      {showAvatarPicker && (
        <MediaPicker
          onPick={(m) => {
            setAvatarMediaId(m.id);
            setShowAvatarPicker(false);
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </>
  );
}

// Modal exposed only when the active backend is `flexweg-sqlite` and
// the signed-in user is admin. Calls the Flexweg SQLite Auth API
// (`/auth/register`) — the first user in an empty pool gets role
// `admin` automatically; subsequent ones default to `editor`.
//
// On success, the parent calls `syncUsersFromApi()` to refresh the
// local cache so the new user appears immediately in the list
// (otherwise the polling tick takes ~4 s and re-submitting the form
// would return 409 EMAIL_ALREADY_REGISTERED — lesson #3).
interface AddUserModalProps {
  onClose: () => void;
  onCreated: (email: string) => void;
}

function AddUserModal({ onClose, onCreated }: AddUserModalProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/.+@.+\..+/.test(cleanEmail)) {
      setError(t("identity.errors.invalidEmail"));
      return;
    }
    if (password.length < 8) {
      setError(t("identity.errors.passwordTooShort"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await registerUser({
        email: cleanEmail,
        password,
        displayName: displayName.trim() || undefined,
      });
      onCreated(cleanEmail);
    } catch (err) {
      // Translate known auth-error codes via the i18n keys; fall back
      // to the raw error message for unknowns.
      const key = authErrorKey(err);
      setError(t(key, { defaultValue: (err as Error).message }));
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-surface-900 dark:text-surface-50">
            {t("users.addUserModal.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
            aria-label={t("common.cancel")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-surface-500 mb-4 dark:text-surface-400">
          {t("users.addUserModal.intro")}
        </p>
        {/* Lesson #4: data-form-type="other" discourages aggressive
            autofill from major password managers (1Password, Bitwarden,
            Grammarly, Honey…) which otherwise inject DOM into the form
            and trigger `Node.insertBefore` crashes when React rerenders
            the submit button. */}
        <form onSubmit={handleSubmit} className="space-y-4" data-form-type="other">
          <div>
            <label className="label" htmlFor="add-user-name">
              {t("identity.fields.name")}
            </label>
            <input
              id="add-user-name"
              type="text"
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("identity.fields.namePlaceholder")}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="label" htmlFor="add-user-email">
              {t("identity.fields.email")}
            </label>
            <input
              id="add-user-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@company.com"
              required
              autoComplete="off"
              autoFocus
            />
          </div>
          <div>
            <label className="label" htmlFor="add-user-password">
              {t("identity.fields.password")}
            </label>
            <input
              id="add-user-password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <p className="text-[11px] text-surface-500 mt-1 dark:text-surface-400">
              {t("identity.fields.passwordHint")}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 justify-center"
              disabled={submitting}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
              disabled={submitting}
            >
              <span className="inline-flex items-center justify-center gap-1.5">
                <Loader2
                  className={
                    "h-4 w-4 animate-spin " + (submitting ? "" : "hidden")
                  }
                />
                <span>
                  {submitting
                    ? t("users.addUserModal.submitting")
                    : t("users.addUserModal.submit")}
                </span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
