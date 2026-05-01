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
  displayName?: string;
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

export interface Media {
  id: string;
  name: string;
  contentType: string;
  size: number;
  // Path inside the Flexweg site (e.g. "media/2026/05/photo.jpg").
  storagePath: string;
  // Public URL: `${siteUrl}/${storagePath}`.
  url: string;
  alt?: string;
  caption?: string;
  uploadedAt: number;
  uploadedBy: string;
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
}

export type AdminTheme = "dark" | "light";
