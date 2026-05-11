import type { ComponentType, ReactNode } from "react";
import type {
  AdminLocale,
  ImageFormatConfig,
  Media,
  MenuItem,
  Post,
  SiteSettings,
  SocialNetwork,
  Term,
} from "../core/types";
import type { ResolvedMenuItem } from "../core/menuResolver";
import type { BlockManifest } from "../core/blockRegistry";

// Re-export so theme components can keep importing from "../types".
export type { ResolvedMenuItem };

// Public-side resolved social link. The publisher filters out
// invisible entries before populating AuthorView, so themes only
// ever see what the user opted to surface.
export interface AuthorSocial {
  network: SocialNetwork;
  url: string;
}

// Author metadata exposed to themes. Resolved by the publisher at
// publish time — theme components never reach back into Firestore.
// `displayName` is the canonical label used in templates; the
// publisher's authorLookup derives it from firstName + lastName when
// available, falling back to the legacy displayName field, then email
// (admin-only — email itself is not surfaced here).
// `title` is the job / role label shown publicly under the name
// (e.g. "Journaliste"). `socials` carries only the visible entries.
// Avatar (when present) is a fully resolved MediaView so templates
// can `pickFormat(avatar, "small")` like they do for hero images.
export interface AuthorView {
  id: string;
  displayName: string;
  title?: string;
  bio?: string;
  avatar?: MediaView;
  socials?: AuthorSocial[];
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
  // Active theme's resolved config (manifest defaults merged with what
  // the user saved in /theme-settings). Typed as `unknown` here because
  // each theme owns its own config shape — theme components cast as
  // needed. Falls back to the manifest defaults when nothing is stored.
  themeConfig?: unknown;
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

// Optional "See full archives →" link injected by the flexweg-archives
// plugin when enabled. Resolved at publish time by the publisher and
// rendered by the theme as a footer-style link below the post list.
// Themes that want to ignore it can simply not destructure the prop.
export interface ArchivesLink {
  href: string;
  label: string;
}

export interface HomeTemplateProps {
  // List of posts to display on the home page (already paginated).
  // Used by themes that render their own card grid; the default
  // theme ignores this and consumes `heroHtml` + `listHtml` instead.
  posts: CardPost[];
  staticPage?: { post: Post; bodyHtml: string };
  archivesLink?: ArchivesLink;
  // Pre-rendered HTML strings produced by the active theme's Hero
  // and Posts list block render functions. The publisher resolves
  // them by reading the theme config (variant choices) before
  // mounting the template, so the home page picks up the same
  // visual variants the editor exposes for content blocks.
  // Themes that don't want this delegation can simply ignore the
  // props and render from `posts` directly.
  heroHtml?: string;
  listHtml?: string;
  // Optional sidebar widgets contributed by themes that lay out a
  // dedicated home sidebar (e.g. the magazine theme). Themes that
  // render a single-column home ignore them. Both are pre-rendered
  // HTML strings produced by the active theme's block renderers,
  // so the template stays a pure props consumer.
  mostReadHtml?: string;
  promoCardHtml?: string;
}

export interface CategoryTemplateProps {
  term: Term;
  posts: CardPost[];
  // Absolute URL of the per-category RSS feed, when one is enabled in the
  // flexweg-rss plugin config. Lets the template render a "Follow"
  // button. Undefined when no feed exists for this category.
  categoryRssUrl?: string;
  archivesLink?: ArchivesLink;
  // All categories on the site, so themes that render a sidebar
  // navigation (magazine theme) can list every section with the
  // current one highlighted. Default theme ignores this. Order
  // follows whatever the publisher chose (alphabetical at the moment).
  allCategories?: Term[];
  // Popular tags resolved by the publisher (top N tags by usage
  // count). Themes that render a "Popular Tags" widget consume this;
  // others ignore it.
  popularTags?: Term[];
}

export interface AuthorTemplateProps {
  author: AuthorView;
  posts: CardPost[];
}

export interface NotFoundTemplateProps {
  message?: string;
}

// Settings page exposed by a theme via `ThemeManifest.settings`. Mirrors
// the plugin settings convention so admins get a consistent surface for
// per-theme configuration (logos, color overrides, layout toggles).
// Storage lives under `settings.themeConfigs[<theme-id>]` in Firestore.
export interface ThemeSettingsPageDef<TConfig = unknown> {
  // i18n key resolved against the theme's i18n namespace (or the
  // global namespace when the theme ships no translations). Used for
  // the sidebar entry label and the page heading.
  navLabelKey: string;
  // Defaults merged with the stored value before the page renders, so
  // a fresh install behaves predictably without an explicit save first.
  defaultConfig: TConfig;
  // The page is rendered inside the standard admin layout. The admin
  // hands it `{ config, save, theme }` — same shape as PluginSettingsPage.
  component: ComponentType<ThemeSettingsPageProps<TConfig>>;
}

export interface ThemeSettingsPageProps<TConfig = unknown> {
  config: TConfig;
  save: (next: TConfig) => Promise<void>;
}

export interface ThemeManifest<TConfig = unknown> {
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
  // Optional seed markdown for new posts / pages. When set, the
  // PostEditPage initializes the editor with this content the first
  // time a new post / page is created — the user can still edit or
  // delete the seeded blocks. Lets themes tied to a specific shape
  // (e.g. a storefront seeding a product-info block) ship a
  // sensible starting state without coupling the editor to theme
  // internals.
  defaultPostMarkdown?: {
    post?: string;
    page?: string;
  };
  templates: {
    base: ComponentType<BaseLayoutProps>;
    home: ComponentType<HomeTemplateProps & { site: SiteContext }>;
    single: ComponentType<SingleTemplateProps & { site: SiteContext }>;
    category: ComponentType<CategoryTemplateProps & { site: SiteContext }>;
    author: ComponentType<AuthorTemplateProps & { site: SiteContext }>;
    notFound: ComponentType<NotFoundTemplateProps & { site: SiteContext }>;
  };
  // Optional configuration page reachable at /theme-settings when this
  // theme is active. Mirrors the plugin settings convention so the
  // admin gets a consistent surface for per-theme configuration
  // (logos, color overrides, layout toggles).
  settings?: ThemeSettingsPageDef<TConfig>;
  // Optional bundled translations. Loaded into a dedicated i18next
  // namespace named `theme-<id>` so the settings page calls
  // `useTranslation("theme-<id>")` without colliding with admin keys.
  i18n?: Partial<Record<AdminLocale, Record<string, unknown>>>;
  // Optional CSS transformer. When defined, `Sync theme assets` and
  // any other code path that uploads `theme-assets/<id>.css` calls
  // this with the resolved theme config and uploads the result
  // instead of the raw `cssText`. Themes use this to bake user
  // overrides (color palette, fonts, etc.) into the published CSS so
  // the customizations survive every sync cycle.
  compileCss?: (config: TConfig) => string;
  // Editor blocks contributed by this theme. Registered into the
  // global block registry whenever the theme becomes active and reset
  // on theme switch (the next theme's blocks replace them). Allows
  // theme-specific layout primitives (Hero, Posts list, …) that rely
  // on the theme's own CSS without polluting the registry when an
  // unrelated theme is active.
  blocks?: BlockManifest[];
  // Optional registration callback invoked when the theme becomes
  // active. Mirrors the plugin pattern — a theme uses this to hook
  // its own filters (e.g. `post.html.body` to render its block
  // markers) without scattering side effects through the codebase.
  // Called AFTER the theme's blocks have been registered, so handlers
  // can rely on registry availability if needed.
  //
  // The optional `ctx.settings` argument exposes the current
  // SiteSettings so a theme can conditionally register targets that
  // depend on its own config (e.g. only surface a "Force regenerate
  // catalog" entry when the storefront's catalog feature is enabled).
  // Themes that don't need settings can ignore the second argument.
  register?: (
    api: import("../core/pluginRegistry").PluginApi,
    ctx?: { settings: SiteSettings },
  ) => void;
}

// Re-exported so theme code only needs one import statement.
export type { Media, Post, Term, MenuItem, SiteSettings };
