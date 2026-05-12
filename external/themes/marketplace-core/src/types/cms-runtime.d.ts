// Local stub for @flexweg/cms-runtime — the public API surface the
// external theme consumes. In a future packaged release these would
// ship as a proper npm package; here we keep them inline so the
// scaffold has no extra dependency.

declare module "@flexweg/cms-runtime" {
  import type { ComponentType, ReactNode } from "react";

  export const FLEXWEG_API_VERSION: string;
  export const FLEXWEG_API_MIN_VERSION: string;

  // ───── Core data types ─────
  export interface AuthorView {
    id: string;
    displayName: string;
    title?: string;
    bio?: string;
    avatar?: MediaView;
    socials?: { network: string; url: string }[];
  }
  export interface MediaVariant {
    url: string;
    width: number;
    height: number;
    bytes: number;
  }
  export interface MediaView {
    id: string;
    name: string;
    alt?: string;
    caption?: string;
    formats: Record<string, MediaVariant>;
    defaultFormat?: string;
  }
  export interface Term {
    id: string;
    name: string;
    slug: string;
    type: "category" | "tag";
    description?: string;
    parentId?: string;
  }
  export interface Post {
    id: string;
    type: "post" | "page";
    title: string;
    slug: string;
    contentMarkdown: string;
    excerpt?: string;
    heroMediaId?: string;
    authorId: string;
    termIds: string[];
    primaryTermId?: string;
    status: "draft" | "online";
    seo?: { title?: string; description?: string; ogImage?: string };
    createdAt?: { toMillis?: () => number };
    updatedAt?: { toMillis?: () => number };
    publishedAt?: { toMillis?: () => number };
  }
  export type CardPost = Post & {
    url: string;
    hero?: MediaView;
    category?: { name: string; url: string };
    dateLabel?: string;
  };
  export interface SiteSettings {
    title: string;
    description?: string;
    language?: string;
    baseUrl?: string;
    activeThemeId: string;
    themeConfigs?: Record<string, unknown>;
  }
  export interface ResolvedMenuItem {
    id: string;
    label: string;
    href: string;
    children?: ResolvedMenuItem[];
  }
  export interface SiteContext {
    settings: SiteSettings;
    resolvedMenus: {
      header: ResolvedMenuItem[];
      footer: ResolvedMenuItem[];
    };
    themeCssPath: string;
    themeConfig?: unknown;
  }

  // ───── Template props ─────
  export interface BaseLayoutProps {
    site: SiteContext;
    pageTitle: string;
    pageDescription?: string;
    ogImage?: string;
    currentPath?: string;
    children?: ReactNode;
    extraHead?: ReactNode;
  }
  export interface HomeTemplateProps {
    posts: CardPost[];
    staticPage?: { post: Post; bodyHtml: string };
    archivesLink?: { label: string; href: string };
    heroHtml?: string;
    listHtml?: string;
    mostReadHtml?: string;
    promoCardHtml?: string;
  }
  export interface SingleTemplateProps {
    post: Post;
    bodyHtml: string;
    author?: AuthorView;
    hero?: MediaView;
    primaryTerm?: Term;
    tags: Term[];
  }
  export interface CategoryTemplateProps {
    term: Term;
    posts: CardPost[];
    categoryRssUrl?: string;
    archivesLink?: { label: string; href: string };
  }
  export interface AuthorTemplateProps {
    author: AuthorView;
    posts: CardPost[];
  }
  export interface NotFoundTemplateProps {
    message?: string;
  }

  // ───── Theme settings ─────
  export interface ThemeSettingsPageProps<TConfig = unknown> {
    config: TConfig;
    save: (next: TConfig) => Promise<void>;
  }
  export interface ThemeSettingsPageDef<TConfig = unknown> {
    navLabelKey: string;
    defaultConfig: TConfig;
    component: ComponentType<ThemeSettingsPageProps<TConfig>>;
  }

  // ───── Plugin API (for block registration via theme) ─────
  export interface BlockManifest<TAttrs = unknown> {
    id: string;
    nodeName?: string;
    titleKey: string;
    namespace?: string;
    icon?: ComponentType;
    category?: string;
    extensions?: unknown[];
    insert: (chain: unknown, ctx?: unknown) => void | Promise<void>;
    isActive?: (editor: unknown) => boolean;
    inspector?: (props: { editor: unknown }) => ReactNode;
  }
  export interface PluginApi {
    addFilter<T>(hook: string, handler: (v: T, ...args: unknown[]) => T | Promise<T>, priority?: number): void;
    addAction(hook: string, handler: (...args: unknown[]) => void | Promise<void>, priority?: number): void;
    applyFiltersSync<T>(hook: string, value: T, ...args: unknown[]): T;
    applyFilters<T>(hook: string, value: T, ...args: unknown[]): Promise<T>;
    registerBlock?: (manifest: BlockManifest) => void;
  }

  // ───── Helpers ─────
  export function pickFormat(view: MediaView | undefined, name?: string): string;
  export function pickMediaUrl(media: unknown, name?: string): string;
  export function buildPostUrl(args: { post: Post; primaryTerm?: Term }): string;
  export function buildTermUrl(term: Term): string;
  export function pickPublicLocale(language?: string): string;

  // ───── UI components (admin-side only — used by block inspectors) ─────
  // MediaPicker is rendered inside Tiptap block inspectors so authors
  // can choose images from the media library without leaving the
  // editor. Conditionally mounted by the host component, dismissed
  // via onClose, returns the picked Media object via onPick.
  export interface MediaPickerProps {
    onPick: (media: { id: string; url?: string; formats?: Record<string, { url: string }>; alt?: string; name: string }) => void;
    onClose: () => void;
  }
  export const MediaPicker: ComponentType<MediaPickerProps>;

  export const i18n: {
    getFixedT(locale: string, namespace?: string): (key: string, opts?: unknown) => string;
    addResourceBundle(
      locale: string,
      namespace: string,
      resources: unknown,
      deep?: boolean,
      overwrite?: boolean,
    ): void;
  };

  export interface ThemeManifest<TConfig = unknown> {
    id: string;
    name: string;
    version: string;
    description?: string;
    scssEntry?: string;
    cssText?: string;
    i18n?: Record<string, unknown>;
    settings?: ThemeSettingsPageDef<TConfig>;
    compileCss?: (config: TConfig) => string;
    imageFormats?: unknown;
    templates: {
      base: ComponentType<BaseLayoutProps>;
      home: ComponentType<HomeTemplateProps & { site: SiteContext }>;
      single: ComponentType<SingleTemplateProps & { site: SiteContext }>;
      category: ComponentType<CategoryTemplateProps & { site: SiteContext }>;
      author: ComponentType<AuthorTemplateProps & { site: SiteContext }>;
      notFound: ComponentType<NotFoundTemplateProps & { site: SiteContext }>;
    };
    blocks?: BlockManifest[];
    register?: (api: PluginApi, ctx?: { settings: SiteSettings }) => void;
  }
}
