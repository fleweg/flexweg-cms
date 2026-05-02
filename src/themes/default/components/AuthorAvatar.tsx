import type { MediaView } from "../../types";
import { pickFormat } from "../../../core/media";

// Renders an author avatar. When a real image is provided through the
// resolved MediaView, it's shown as a circle (or 3:4 portrait at xl).
// Otherwise the component falls back to a typographic placeholder built
// from the author's initials — same shape and palette so layouts stay
// consistent regardless of whether a profile picture is set.
//
// Three sizes:
//   - default (40px circle) — inline next to a name
//   - lg (56px circle) — author bio sidebar card
//   - xl (3:4 portrait, ~280px wide) — author archive page hero

interface AuthorAvatarProps {
  name: string;
  avatar?: MediaView;
  size?: "default" | "lg" | "xl";
}

function initials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  const first = parts[0]![0] ?? "";
  const last = parts[parts.length - 1]![0] ?? "";
  return (first + last).toUpperCase();
}

export function AuthorAvatar({ name, avatar, size = "default" }: AuthorAvatarProps) {
  const cls = ["author-avatar"];
  if (size === "lg") cls.push("author-avatar--lg");
  if (size === "xl") cls.push("author-avatar--xl");

  // Pick the smallest variant that still looks crisp at the rendered
  // size. Falls back through pickFormat's chain for old uploads that
  // don't have every variant.
  if (avatar) {
    const variant = size === "xl" ? "large" : size === "lg" ? "medium" : "small";
    const url = pickFormat(avatar, variant);
    if (url) {
      cls.push("author-avatar--image");
      return (
        <img
          className={cls.join(" ")}
          src={url}
          alt={avatar.alt ?? name}
        />
      );
    }
  }

  return (
    <span className={cls.join(" ")} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
