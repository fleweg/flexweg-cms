import type { ComponentType, ReactNode } from "react";
import type { ImageFormatConfig, Media, MenuItem, Post, SiteSettings, Term } from "../core/types";
import type { ResolvedMenuItem } from "../core/menuResolver";

// Re-export so theme components can keep importing from "../types".
export type { ResolvedMenuItem };

// Author metadata exposed to themes. Resolved by the publisher at
// publish time — theme components never reach back into Firestore.
// `displayName` is the canonical label used in templates; the
// publisher's authorLookup derives it from firstName + lastName when
// available, falling back to the legacy displayName field, then email.
// Avatar (when present) is a fully resolved MediaView so templates can
// `pickFormat(avatar, "small")` like they do for hero images.
export interface AuthorView {
  id: string;
  displayName: string;
  email?: string;
  bio?: string;
  avatar?: MediaView;
}

// Resolved media reference for theme consumption. The publisher resolves
// `heroMediaId` to this shape so templates don't need to do any lookups.
//
// `formats` carries every available variant; `default` is the fallback
// format name. Templates pick a specific size with `pickFormat(view, "large")`
// (see `core/media.ts`) which gracefully falls back to the closest variant
// when the requested size isn't available — important for old media that
// predates the active theme's size catalog.
export interface MediaView {
  alt?: string;
  caption?: string;
  default: string;
  formats: Record<string, { url: string; width: number; height: number }>;
}

export interface SiteContext {
  // Site-wide settings, including the language used in <html lang="...">.
  settings: SiteSettings;
  // Resolved menus with hrefs already filled in (no raw post/term refs).
  resolvedMenus: {
    header: ResolvedMenuItem[];
    footer: ResolvedMenuItem[];
  };
  // Path on Flexweg of the active theme's CSS, e.g. "theme-assets/default.css".
  themeCssPath: string;
}

export interface BaseLayoutProps {
  site: SiteContext;
  // Page-specific <title> and <meta description> for the head.
  pageTitle: string;
  pageDescription?: string;
  ogImage?: string;
  // Path the page is being rendered at (e.g. "news/article.html"). Used by
  // themes to compute canonical URLs and active nav state.
  currentPath: string;
  // Plugins can inject additional <head> markup here via filters.
  extraHead?: string;
  children: ReactNode;
}

// Post enriched with everything theme cards need to render without doing
// any lookups themselves: resolved hero media, computed public URL,
// optional category info (name + URL of the archive), and a pre-formatted
// date label (locale-aware via settings.language).
export type CardPost = Post & {
  url: string;
  hero?: MediaView;
  category?: { name: string; url: string };
  dateLabel?: string;
};

export interface SingleTemplateProps {
  post: Post;
  // Post body already rendered to safe HTML by core/markdown.ts.
  bodyHtml: string;
  author?: AuthorView;
  hero?: MediaView;
  primaryTerm?: Term;
  tags: Term[];
}

export interface HomeTemplateProps {
  // List of posts to display on the home page (already paginated).
  posts: CardPost[];
  staticPage?: { post: Post; bodyHtml: string };
}

export interface CategoryTemplateProps {
  term: Term;
  posts: CardPost[];
  // Absolute URL of the per-category RSS feed, when one is enabled in the
  // flexweg-rss plugin config. Lets the template render a "Follow"
  // button. Undefined when no feed exists for this category.
  categoryRssUrl?: string;
}

export interface AuthorTemplateProps {
  author: AuthorView;
  posts: CardPost[];
}

export interface NotFoundTemplateProps {
  message?: string;
}

export interface ThemeManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  // Image catalog the theme expects. Used by the media upload pipeline to
  // decide which variants to generate, and by templates when calling
  // pickFormat(view, "large"). Optional — themes that opt out get only the
  // ADMIN_FORMATS variants for media library display.
  imageFormats?: ImageFormatConfig;
  // Path of the SCSS entrypoint, relative to the theme directory. The build
  // script reads this to know what to compile.
  scssEntry: string;
  // Compiled CSS embedded in the admin bundle (via a Vite `?inline` import
  // in the manifest file). The "Sync theme assets" button uploads this
  // string to Flexweg, so the admin always pushes the CSS that was built
  // alongside it — no chicken-and-egg with /theme-assets/ being uploaded
  // first.
  cssText: string;
  // Optional companion JS shipped with the theme. Embedded the same way
  // as cssText (Vite `?raw` import in the manifest). Currently used by
  // the default theme's `menu-loader.js` which fetches /menu.json and
  // populates `[data-cms-menu]` containers in the layout — but any theme
  // can supply its own runtime behavior here. Uploaded as
  // `theme-assets/<id>-menu.js` and referenced by BaseLayout's <script>.
  jsText?: string;
  // Second optional companion JS, used by the default theme's
  // `posts-loader.js` to fetch /posts.json and populate sidebar widgets
  // ([data-cms-related] today, more later). Same lifecycle as jsText —
  // uploaded as `theme-assets/<id>-posts.js`. Themes that have no
  // dynamic posts widget leave it undefined and get one fewer script
  // tag in their HTML output.
  jsTextPosts?: string;
  templates: {
    base: ComponentType<BaseLayoutProps>;
    home: ComponentType<HomeTemplateProps & { site: SiteContext }>;
    single: ComponentType<SingleTemplateProps & { site: SiteContext }>;
    category: ComponentType<CategoryTemplateProps & { site: SiteContext }>;
    author: ComponentType<AuthorTemplateProps & { site: SiteContext }>;
    notFound: ComponentType<NotFoundTemplateProps & { site: SiteContext }>;
  };
}

// Re-exported so theme code only needs one import statement.
export type { Media, Post, Term, MenuItem, SiteSettings };
