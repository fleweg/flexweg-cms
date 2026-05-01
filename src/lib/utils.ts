import clsx, { type ClassValue } from "clsx";
import type { Timestamp } from "firebase/firestore";

export const cn = (...args: ClassValue[]) => clsx(...args);

type DateLike = Timestamp | Date | string | number | null | undefined;

function toDate(value: DateLike): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "object" && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  const date = new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

// Locale-aware date formatting. Pass the active admin locale so the UI matches
// whatever the user picked (en/fr).
export function formatDate(value: DateLike, locale = "en"): string {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: DateLike, locale = "en"): string {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatBytes(bytes: number | null | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

// SHA-256 hash of a string, returned as hex. Used by the publisher to skip
// re-uploads when the rendered HTML is byte-identical to the previous version.
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
