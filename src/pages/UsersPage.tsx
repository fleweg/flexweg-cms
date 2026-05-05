import { useEffect, useState } from "react";
import { ImageIcon, Loader2, Pencil, Save, ShieldCheck, ShieldOff, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { MediaPicker } from "../components/editor/MediaPicker";
import { useCmsData } from "../context/CmsDataContext";
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
export function UsersPage() {
  const { t } = useTranslation();
  const { users } = useCmsData();
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title={t("users.title")} />
      {users.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("users.noUsers")}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {users.map((user) => (
            <UserRow key={user.id} user={user} onEdit={() => setEditingUser(user)} />
          ))}
        </div>
      )}
      {editingUser && (
        <EditProfileModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </div>
  );
}

function UserRow({ user, onEdit }: { user: UserRecord; onEdit: () => void }) {
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
            if (window.confirm(`Delete record for ${user.email}?`)) {
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
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? t("common.saving") : t("common.save")}
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
