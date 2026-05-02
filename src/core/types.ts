import type { FieldValue, Timestamp } from "firebase/firestore";

// Anything Firestore returns as a date is a Timestamp; anything we *write* as
// "now" is the serverTimestamp() sentinel (a FieldValue). Read sites use
// Timestamp; write payloads use this union so callers can hand off either.
export type FirestoreTime = Timestamp | FieldValue;

export type AdminLocale = "en" | "fr";
export type UserRole = "admin" | "editor";

export interface UserPreferences {
  adminLocale: AdminLocale;
}

export interface UserRecord {
  id: string;
  email: string;
  // Legacy free-form display name. Kept for back-compat with records
  // created before firstName/lastName landed; new profiles set the
  // split fields and derive the display name from them.
  displayName?: string;
  // Author profile fields — surfaced on public-site templates
  // (AuthorBio sidebar, single-post author strip, author archive page).
  // All optional: a fresh user can publish posts before filling them in.
  firstName?: string;
  lastName?: string;
  bio?: string;
  // Reference to a media entry used as the author's profile picture.
  // Resolved through the same media pipeline as post hero images
  // (multi-variant, falls back gracefully through pickFormat).
  avatarMediaId?: string;
  role: UserRole;
  disabled: boolean;
  preferences?: UserPreferences;
  createdAt?: Timestamp;
  createdBy?: string;
}

export type PostType = "post" | "page";
export type PostStatus = "draft" | "online";

export interface SeoMeta {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt?: string;
  heroMediaId?: string;
  authorId: string;
  // Tags + at most one category. The category is denormalized into
  // `primaryTermId` because it determines the URL and we want to read it
  // without fetching the term document just to know that.
  termIds: string[];
  primaryTermId?: string;
  status: PostStatus;
  seo?: SeoMeta;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  publishedAt?: Timestamp;
  // The Flexweg path the post is currently live at. Lets the publisher
  // delete the old file when the slug or category changes.
  lastPublishedPath?: string;
  // Paths that *should* have been deleted on a previous publish but
  // weren't (e.g. transient API failure). The publisher retries cleaning
  // them on every subsequent publish, so a one-off API hiccup doesn't
  // leave permanent orphans on the public site. Cleared once the cleanup
  // succeeds.
  previousPublishedPaths?: string[];
  // Hash of the rendered HTML — skip re-upload when nothing changed.
  lastPublishedHash?: string;
}

export type TermType = "category" | "tag";

export interface Term {
  id: string;
  type: TermType;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastPublishedPath?: string;
}

// One pre-rendered variant of an uploaded image. Each Media doc owns N
// variants (thumbnail, medium, large, …) — every variant lives at a stable
// public URL on Flexweg.
export interface MediaVariant {
  url: string;
  width: number;
  height: number;
  bytes: number;
}

export interface Media {
  id: string;
  // Original uploaded filename, kept for display (e.g. "Photo Été.JPG").
  name: string;
  // Output content-type after processing (e.g. "image/webp").
  contentType: string;
  // Sum of every variant's size in bytes.
  size: number;
  // Folder path on Flexweg holding all the variants of this asset, e.g.
  // "media/2026/05/photo-ete-a3f7b2". Deleting the asset = deleting this
  // folder via the Files API. Always normalized + suffixed for uniqueness.
  storageBase?: string;
  // Map of format name (matching the active theme's imageFormats keys plus
  // ADMIN_FORMATS keys) to the concrete uploaded variant.
  formats?: Record<string, MediaVariant>;
  // Default format name used when a caller doesn't specify one (e.g.
  // "medium"). Falls back to the first available format if missing.
  defaultFormat?: string;

  // ──────────────────────────────────────────────────────────────────────
  // Legacy fields, kept for backward compatibility with media uploaded
  // before the multi-variant pipeline. Reads anywhere in the codebase
  // should fall back to these when `formats` is missing.
  // ──────────────────────────────────────────────────────────────────────
  storagePath?: string;
  url?: string;

  alt?: string;
  caption?: string;
  uploadedAt: number;
  uploadedBy: string;
}

// Per-format processing rules. `cover` crops to fill the box; `contain`
// fits inside without cropping (and preserves the aspect ratio of the
// source — output dimensions are bounded by width/height but may be
// smaller on the short axis).
export type ImageFit = "cover" | "contain";

export interface ImageFormat {
  width: number;
  height: number;
  fit?: ImageFit;
}

// Output configuration for the image-processing pipeline. Declared by a
// theme (so each theme can ship its own size catalog) and merged with
// ADMIN_FORMATS at upload time so the media library always has its own
// thumbnails regardless of theme.
export interface ImageFormatConfig {
  inputFormats: string[];
  outputFormat: "webp" | "jpeg" | "png";
  // Quality on a 0..100 scale; mapped internally to the canvas API's 0..1.
  quality: number;
  formats: Record<string, ImageFormat>;
  defaultFormat: string;
}

export interface MenuItem {
  id: string;
  label: string;
  // Either an internal ref (post / term / page) or an absolute URL.
  ref?: { kind: "post" | "term" | "home"; id?: string };
  externalUrl?: string;
  children?: MenuItem[];
}

export interface SiteSettings {
  title: string;
  description: string;
  // BCP-47 language tag for the public site, injected as <html lang="...">.
  // Independent of the admin UI locale.
  language: string;
  // Public base URL of the site, e.g. "https://example.flexweg.com".
  baseUrl: string;
  activeThemeId: string;
  enabledPlugins: Record<string, boolean>;
  homeMode: "latest-posts" | "static-page";
  homePageId?: string;
  postsPerPage: number;
  menus: {
    header: MenuItem[];
    footer: MenuItem[];
  };
  // Per-plugin configuration blobs, keyed by plugin id. Plugins are free
  // to define their own shape; the registry only enforces that values are
  // JSON-serializable so Firestore can store them. Stored alongside the
  // global site settings so a single subscription keeps everything live.
  pluginConfigs?: Record<string, unknown>;
}

export type AdminTheme = "dark" | "light";
