import { useState } from "react";
import { Loader2, Send, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../../context/CmsDataContext";
import {
  buildPublishContext,
  publishPost,
  unpublishPost,
  type PublishLogEntry,
} from "../../services/publisher";
import { buildAuthorLookup } from "../../services/users";
import type { Post } from "../../core/types";

interface PublishButtonProps {
  post: Post;
  onLog: (entry: PublishLogEntry) => void;
}

// Single button that toggles the post between draft and online. Wraps the
// publisher pipeline and routes log entries to the parent component for
// inline display under the editor.
export function PublishButton({ post, onLog }: PublishButtonProps) {
  const { t } = useTranslation();
  const { terms, settings, users, media } = useCmsData();
  const [busy, setBusy] = useState(false);

  async function withCtx() {
    return buildPublishContext({
      terms,
      settings,
      users,
      // Resolves any post's authorId — not just the current user — so
      // AuthorBio renders correctly on posts authored by other admins.
      authorLookup: buildAuthorLookup(users, media),
    });
  }

  async function handlePublish() {
    setBusy(true);
    try {
      const ctx = await withCtx();
      await publishPost(post.id, ctx, onLog);
    } catch (err) {
      onLog({ level: "error", message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function handleUnpublish() {
    setBusy(true);
    try {
      const ctx = await withCtx();
      await unpublishPost(post.id, ctx, onLog);
    } catch (err) {
      onLog({ level: "error", message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  if (post.status === "online") {
    return (
      <button type="button" className="btn-secondary" disabled={busy} onClick={handleUnpublish}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />}
        {busy ? t("posts.edit.unpublishing") : t("posts.edit.unpublish")}
      </button>
    );
  }
  return (
    <button type="button" className="btn-primary" disabled={busy} onClick={handlePublish}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      {busy ? t("posts.edit.publishing") : t("posts.edit.publish")}
    </button>
  );
}
