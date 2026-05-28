// Type stubs for @flexweg/cms-runtime — the public API external
// plugins use. Kept self-contained so the plugin doesn't require a
// published npm package. Mirrors what the admin's
// src/core/flexwegRuntime.ts re-exports (Flexweg API ≥ 1.2.0).

declare module "@flexweg/cms-runtime" {
  import type { ComponentType, ReactNode } from "react";

  // ── API versioning ───────────────────────────────────────────────
  export const FLEXWEG_API_VERSION: string;
  export const FLEXWEG_API_MIN_VERSION: string;

  // ── Core domain types ────────────────────────────────────────────
  // Re-declared here to minimise the type stub surface — only fields
  // the plugin actually reads.

  export interface FirestoreTimestamp {
    toMillis?: () => number;
    seconds?: number;
    nanoseconds?: number;
  }

  export interface SeoMeta {
    title?: string;
    description?: string;
    ogImage?: string;
  }

  export type PostType = "post" | "page";
  export type PostStatus = "draft" | "online";

  export interface Post {
    id: string;
    type: PostType;
    title: string;
    slug: string;
    contentMarkdown: string;
    excerpt?: string;
    heroMediaId?: string;
    authorId: string;
    termIds: string[];
    primaryTermId?: string;
    status: PostStatus;
    seo?: SeoMeta;
    createdAt?: FirestoreTimestamp;
    updatedAt?: FirestoreTimestamp;
    publishedAt?: FirestoreTimestamp;
    lastPublishedPath?: string;
    previousPublishedPaths?: string[];
    lastPublishedHash?: string;
    legacyUrl?: string;
    translations?: Record<string, unknown>;
    lastPublishedPathsByLocale?: Record<string, string>;
  }

  export type TermType = "category" | "tag";

  export interface Term {
    id: string;
    type: TermType;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    seo?: SeoMeta;
    createdAt?: FirestoreTimestamp;
    updatedAt?: FirestoreTimestamp;
    lastPublishedPath?: string;
    translations?: Record<string, unknown>;
  }

  export interface MediaVariant {
    url: string;
    width: number;
    height: number;
    bytes: number;
  }

  export interface Media {
    id: string;
    name: string;
    contentType: string;
    size: number;
    storageBase?: string;
    formats?: Record<string, MediaVariant>;
    defaultFormat?: string;
    storagePath?: string;
    url?: string;
    alt?: string;
    caption?: string;
    uploadedAt: number;
    uploadedBy: string;
  }

  export interface MenuItem {
    id: string;
    label: string;
    ref?: { kind: "post" | "term" | "home"; id?: string };
    externalUrl?: string;
    children?: MenuItem[];
    translations?: Record<string, { label?: string }>;
  }

  export interface SiteSettings {
    title: string;
    description: string;
    language: string;
    baseUrl: string;
    activeThemeId: string;
    enabledPlugins: Record<string, boolean>;
    homeMode: "latest-posts" | "static-page";
    homePageId?: string;
    postsPerPage: number;
    menus: { header: MenuItem[]; footer: MenuItem[] };
    pluginConfigs?: Record<string, unknown>;
    themeConfigs?: Record<string, unknown>;
  }

  export interface AuthorView {
    id: string;
    displayName: string;
    title?: string;
    bio?: string;
    avatar?: unknown;
    socials?: unknown;
  }

  export interface UserRecord {
    id: string;
    email: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    role: "admin" | "editor";
    disabled: boolean;
  }

  // ── Plugin / hook API ────────────────────────────────────────────
  export type FilterHandler<T> = (
    value: T,
    ...args: unknown[]
  ) => T | Promise<T>;
  export type ActionHandler = (...args: unknown[]) => void | Promise<void>;

  export interface DashboardCardManifest {
    id: string;
    priority?: number;
    component: ComponentType;
  }

  export interface InspectorTabProps {
    entity: Post;
    updateEntity: (patch: Partial<Post>) => void;
    save: () => Promise<void>;
  }

  export interface InspectorTabManifest {
    id: string;
    labelKey: string;
    namespace?: string;
    forKind?: "post" | "page" | "all";
    badge?: (entity: Post) => string | number | undefined;
    priority?: number;
    component: ComponentType<InspectorTabProps>;
  }

  export interface TermEditorSectionProps {
    term: Term;
    updateTerm: (patch: Partial<Term>) => void;
  }

  export interface TermEditorSectionManifest {
    id: string;
    termType?: "category" | "tag" | "all";
    priority?: number;
    component: ComponentType<TermEditorSectionProps>;
  }

  // ── Editor variant API ───────────────────────────────────────────
  export interface EditorVariant {
    id: string;
    label: string;
    badge?: string;
    primary: boolean;
  }

  export interface VariantFields {
    title: string;
    slug: string;
    contentMarkdown: string;
    excerpt?: string;
    seo?: SeoMeta;
  }

  export interface VariantContext {
    settings: SiteSettings;
    terms: Term[];
  }

  export interface EditorVariantProvider {
    id: string;
    listVariants: (entity: Post, ctx: VariantContext) => EditorVariant[];
    loadFields: (
      entity: Post,
      variantId: string,
      ctx: VariantContext,
    ) => VariantFields | null;
    saveFields: (
      entity: Post,
      variantId: string,
      fields: VariantFields,
      ctx: VariantContext,
    ) => Promise<void>;
    getSlugPathPrefix?: (
      entity: Post,
      variantId: string,
      fields: VariantFields,
      ctx: VariantContext,
    ) => string;
    getSlugPathSuffix?: (
      entity: Post,
      variantId: string,
      fields: VariantFields,
      ctx: VariantContext,
    ) => string;
    validate?: (
      entity: Post,
      variantId: string,
      fields: VariantFields,
      ctx: VariantContext,
    ) => string | null;
    priority?: number;
  }

  export interface PluginApi {
    addFilter<T>(hook: string, handler: FilterHandler<T>, priority?: number): void;
    addAction(hook: string, handler: ActionHandler, priority?: number): void;
    registerBlock?: (manifest: unknown) => void;
    registerDashboardCard: (manifest: DashboardCardManifest) => void;
    registerInspectorTab: (manifest: InspectorTabManifest) => void;
    registerTermEditorSection: (manifest: TermEditorSectionManifest) => void;
    registerEditorVariantProvider: (manifest: EditorVariantProvider) => void;
    registerRegenerationTarget?: (manifest: unknown) => void;
  }

  export const pluginApi: PluginApi;
  export function applyFilters<T>(
    hook: string,
    value: T,
    ...args: unknown[]
  ): Promise<T>;
  export function applyFiltersSync<T>(
    hook: string,
    value: T,
    ...args: unknown[]
  ): T;
  export function doAction(hook: string, ...args: unknown[]): Promise<void>;

  // ── Settings page def ────────────────────────────────────────────
  export interface PluginSettingsPageProps<TConfig = unknown> {
    config: TConfig;
    save: (next: TConfig) => Promise<void>;
  }

  export interface PluginSettingsPageDef<TConfig = unknown> {
    navLabelKey: string;
    defaultConfig: TConfig;
    component: ComponentType<PluginSettingsPageProps<TConfig>>;
  }

  export interface PluginManifest<TConfig = unknown> {
    id: string;
    name: string;
    version: string;
    description?: string;
    author?: string;
    readme?: string;
    register: (api: PluginApi) => void;
    settings?: PluginSettingsPageDef<TConfig>;
    i18n?: Record<string, Record<string, unknown>>;
  }

  // ── Slug helpers ─────────────────────────────────────────────────
  export function slugify(s: string): string;
  export function isValidSlug(s: string): boolean;
  export function findAvailableSlug(base: string, isUsed: (s: string) => boolean): string;
  export interface BuildPostUrlInput {
    post: Pick<Post, "type" | "slug">;
    primaryTerm?: Pick<Term, "type" | "slug"> | null;
  }
  export function buildPostUrl(input: BuildPostUrlInput): string;
  export function buildTermUrl(term: Pick<Term, "type" | "slug">): string;
  export function pathToPublicUrl(baseUrl: string, path: string): string;
  export function canonicalPath(path: string): string;
  export function canonicalUrl(baseUrl: string, path: string): string;

  // ── Markdown ─────────────────────────────────────────────────────
  export function renderMarkdown(md: string): string;
  export function markdownToPlainText(md: string, maxLen?: number): string;

  // ── Flexweg Files API ────────────────────────────────────────────
  export function uploadFile(args: { path: string; content: string }): Promise<void>;
  export function deleteFile(path: string): Promise<void>;
  export function deleteFolder(path: string): Promise<void>;
  export function getFile(path: string): Promise<string | null>;
  export function publicUrlFor(baseUrl: string, path: string): string;
  export class FlexwegApiError extends Error {}

  // ── Post CRUD ────────────────────────────────────────────────────
  export interface UpdatePostInput {
    title?: string;
    slug?: string;
    contentMarkdown?: string;
    excerpt?: string | null;
    heroMediaId?: string | null;
    termIds?: string[];
    primaryTermId?: string | null;
    seo?: SeoMeta;
    translations?: Record<string, unknown> | null;
    lastPublishedPathsByLocale?: Record<string, string> | null;
  }
  export function updatePost(id: string, patch: UpdatePostInput): Promise<void>;
  export function fetchAllPosts(opts: { type: PostType }): Promise<Post[]>;

  // ── Term CRUD ────────────────────────────────────────────────────
  export function updateTerm(
    id: string,
    patch: Partial<Pick<Term, "name" | "slug" | "description" | "parentId" | "translations">>,
  ): Promise<void>;

  // ── Settings ─────────────────────────────────────────────────────
  export function updatePluginConfig<T>(id: string, patch: Partial<T>): Promise<void>;

  // ── Lib ──────────────────────────────────────────────────────────
  export const toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };

  // ── Publisher types ──────────────────────────────────────────────
  export interface PublishContext {
    posts: Post[];
    pages: Post[];
    terms: Term[];
    media: Map<string, Media>;
    settings: SiteSettings;
    users: UserRecord[];
    authorLookup: (id: string) => AuthorView | undefined;
  }

  export interface AdditionalRender {
    path: string;
    html: string;
  }
  export type AdditionalListingRender = AdditionalRender;

  // ── Rendering ────────────────────────────────────────────────────
  export interface BaseLayoutProps {
    site: SiteContext;
    pageTitle: string;
    pageDescription?: string;
    ogImage?: string;
    currentPath: string;
    currentLocale?: string;
    extraHead?: string;
    children: ReactNode;
  }

  export interface SiteContext {
    settings: SiteSettings;
    resolvedMenus: { header: unknown[]; footer: unknown[] };
    themeCssPath: string;
    themeConfig?: unknown;
  }

  export interface ThemeManifest {
    id: string;
    name: string;
    version: string;
    templates: {
      base: ComponentType<BaseLayoutProps>;
      home: ComponentType<unknown>;
      single: ComponentType<unknown>;
      category: ComponentType<unknown>;
      author: ComponentType<unknown>;
      notFound: ComponentType<unknown>;
    };
  }

  export interface RenderPageOptions<TInner extends object> {
    base: ComponentType<BaseLayoutProps>;
    baseProps: Omit<BaseLayoutProps, "children" | "extraHead">;
    template: ComponentType<TInner>;
    templateProps: TInner;
  }
  export function renderPageToHtml<TInner extends object>(
    opts: RenderPageOptions<TInner>,
  ): string;
  export function getActiveTheme(themeId: string): ThemeManifest;

  export interface RenderHomeOptions {
    homePath?: string;
    currentLocale?: string;
  }
  export function renderHome(
    ctx: PublishContext,
    options?: RenderHomeOptions,
  ): Promise<string>;

  // ── Hooks ────────────────────────────────────────────────────────
  export function useCmsData(): {
    settings: SiteSettings;
    categories: Term[];
    tags: Term[];
    posts: Post[];
    pages: Post[];
    media: Media[];
    users: UserRecord[];
  };

  // ── Posts / Authors JSON publishers ──────────────────────────────
  export function publishPostsJson(
    settings: SiteSettings,
    posts: Post[],
    pages: Post[],
    terms: Term[],
    media: Map<string, Media> | Media[],
    pathOverride?: string,
  ): Promise<void>;
  export function publishAuthorsJson(
    users: UserRecord[],
    media: Map<string, Media> | Media[],
    posts: Post[],
    pages: Post[],
    pathOverride?: string,
  ): Promise<void>;

  // ── RSS helper ───────────────────────────────────────────────────
  export interface RssEnclosure {
    url: string;
    length: number;
    type: string;
  }
  export interface RssItem {
    title: string;
    link: string;
    guid: string;
    description: string;
    pubDateMs: number;
    category?: string;
    enclosure?: RssEnclosure;
  }
  export interface RssChannel {
    title: string;
    link: string;
    description: string;
    feedUrl: string;
    language: string;
    items: RssItem[];
    xslHref?: string;
  }
  export function buildRssFeedXml(channel: RssChannel): string;

  // ── Sitemap hook payloads ────────────────────────────────────────
  export interface SitemapExtraUrl {
    path: string;
    lastmodMs?: number;
    extraInnerXml?: string;
  }
  export interface SitemapIndexExtraEntry {
    path: string;
    lastmodMs?: number;
  }
}
