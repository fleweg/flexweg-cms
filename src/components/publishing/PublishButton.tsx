import { useState } from "react";
import { Loader2, Send, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useCmsData } from "../../context/CmsDataContext";
import {
  buildPublishContext,
  publishPost,
  unpublishPost,
  type PublishLogEntry,
} from "../../services/publisher";
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
  const { user, record } = useAuth();
  const { posts, pages, terms, settings } = useCmsData();
  const [busy, setBusy] = useState(false);

  async function withCtx() {
    return buildPublishContext({
      posts,
      pages,
      terms,
      settings,
      authorLookup: (id) => {
        if (!user || user.uid !== id) return undefined;
        return { id, displayName: record?.displayName ?? user.email ?? "", email: user.email ?? undefined };
      },
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
