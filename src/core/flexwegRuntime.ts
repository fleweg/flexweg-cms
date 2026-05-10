// FlexwegRuntime — the bridge between the admin bundle and externally
// loaded plugins/themes.
//
// External bundles cannot import React, ReactDOM, react-i18next or our
// internal API directly: they would each ship their own copy, hooks
// would crash on a "two Reacts" mismatch, and i18next state would not
// be shared.
//
// The fix is import-maps in index.html that redirect bare specifiers
// (e.g. `react`, `@flexweg/cms-runtime`) to small stub files in
// /admin/runtime/. Each stub reads the live module instances off
// `window.__FLEXWEG_RUNTIME__` — populated here, side-effect imported
// by main.tsx **before** any other admin code runs.
//
// External plugin / theme authors install our @flexweg/cms-runtime
// package as a dev dependency, externalize it in their Vite config,
// and write `import { uploadFile, pluginApi } from "@flexweg/cms-runtime"`.
// At runtime the import-map redirects to /admin/runtime/cms-runtime.js
// which re-exports from this same global.
//
// **In-tree plugins/themes** also use this same API surface — a TS
// path alias in tsconfig resolves `@flexweg/cms-runtime` to this file
// during development and prod builds. At prod build time, each in-tree
// plugin/theme gets compiled into its own ESM bundle that externalizes
// `@flexweg/cms-runtime`, identical to a third-party external bundle.

// Re-export types so TS users (path alias `@flexweg/cms-runtime`) can
// `import type { Post, Term, ... } from "@flexweg/cms-runtime"`.
// Types are erased at compile time so they don't need to live on the
// runtime global — the runtime stub at public/runtime/cms-runtime.js
// only re-exports the values below, not the types.
export type {
  AdminLocale,
  ImageFormatConfig,
  Media,
  MenuItem,
  Post,
  PostStatus,
  PostType,
  SiteSettings,
  SocialNetwork,
  Term,
  UserRecord,
  UserRole,
} from "./types";
export type {
  AuthorView,
  AuthorSocial,
  BaseLayoutProps,
  CardPost,
  CategoryTemplateProps,
  AuthorTemplateProps,
  HomeTemplateProps,
  MediaView,
  NotFoundTemplateProps,
  SingleTemplateProps,
  SiteContext,
  ThemeManifest,
  ThemeSettingsPageDef,
  ThemeSettingsPageProps,
  ArchivesLink,
} from "../themes/types";
export type {
  PluginManifest,
  PluginSettingsPageDef,
  PluginSettingsPageProps,
} from "../plugins";
export type { PluginApi } from "./pluginRegistry";
export type { RegenerationTarget } from "./regenerationTargetRegistry";
export type { BlockManifest } from "./blockRegistry";
export type { DashboardCardManifest } from "./dashboardCardRegistry";
export type { ResolvedMenuItem } from "./menuResolver";
export type { PublishContext, PublishLogger, PublishLogEntry } from "../services/publisher";
export type { MenuFilterContext, MenuJson } from "../services/menuPublisher";
export type { ListItem, ListResponse, UploadFileOptions, StorageLimitsResponse } from "../services/flexwegApi";

import * as React from "react";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as ReactI18next from "react-i18next";
import { pluginApi } from "./pluginRegistry";
import { registerBlock } from "./blockRegistry";
import { registerDashboardCard } from "./dashboardCardRegistry";
import {
  registerExternalPlugin,
  registerExternalTheme,
} from "../services/externalRegistry";

// core/slug — URL building + slug validation
import {
  slugify,
  isValidSlug,
  findAvailableSlug,
  buildPostUrl,
  buildTermUrl,
  pathToPublicUrl,
  detectPathCollision,
  detectTermSlugCollision,
  normalizeMediaSlug,
} from "./slug";

// core/media — variant helpers
import { mediaToView, pickFormat, pickMediaUrl } from "./media";

// core/markdown — body rendering / extraction
import { markdownToPlainText, renderMarkdown } from "./markdown";

// core/socialIcons — author social rendering
import { SocialIcon, socialLabel } from "./socialIcons";

// core/postSort — date helper used by themes
import { postSortMillis } from "./postSort";

// core/render — HTML rendering helper
import { renderPageToHtml } from "./render";

// services/flexwegApi — HTTP client for the Flexweg Files API
import {
  uploadFile,
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder,
  createFolder,
  getFile,
  listFiles,
  publicUrlFor,
  fileToBase64,
  getStorageLimits,
  FlexwegApiError,
} from "../services/flexwegApi";

// services/posts — Firestore CRUD
import { fetchAllPosts, createPost, updatePost } from "../services/posts";

// services/media — image upload pipeline
import { uploadMedia } from "../services/media";

// services/taxonomies — term CRUD
import { createTerm } from "../services/taxonomies";

// services/users — author resolution
import { buildAuthorLookup } from "../services/users";

// services/publisher — page rendering + publishing
import {
  publishPost,
  buildPublishContext,
  buildSiteContext,
} from "../services/publisher";

// services/menuPublisher — /menu.json upload
import { publishMenuJson } from "../services/menuPublisher";

// services/catalogPublisher — /data/products.json upload (storefront theme)
import { publishProductsJson, deleteProductsJson } from "../services/catalogPublisher";

// services/settings — plugin/theme config storage
import { updatePluginConfig, updateThemeConfig } from "../services/settings";

// lib/toast — global notification queue
import { toast } from "../lib/toast";

// lib/utils — small utilities
import { sha256Hex, formatDateTime, cn } from "../lib/utils";

// React contexts plugins/themes consume via hooks. Imported types-and-
// values so the hook calls land on the SAME React instance as the admin.
import { useCmsData } from "../context/CmsDataContext";
import { useAuth } from "../context/AuthContext";

// i18n helpers — locale resolution for public-side rendering
import i18nInstance, { pickPublicLocale, setActiveLocale } from "../i18n";

// UI primitives plugins use in their settings pages. Re-exposed so
// plugin authors don't have to redo a combobox / autocomplete from
// scratch — just the bare minimum for parity with what in-tree plugins
// historically used.
import { EntityCombobox } from "../components/ui/EntityCombobox";

// Active theme resolution — plugins like flexweg-archives need to
// render archive pages through the active theme's BaseLayout.
import { getActiveTheme } from "../themes";

// Hooks used by theme blocks at edit time
import { useAllPosts } from "../hooks/useAllPosts";

// Theme-side block transforms read the current publish context to
// resolve cross-post lookups at publish time.
import { getCurrentPublishContext } from "../services/publishContext";

// FontSelect component — used by theme settings pages with font pickers.
import { FontSelect } from "../components/ui/FontSelect";

// MediaPicker — admin media library modal, used by theme settings
// pages that let admins pick logo / hero / banner images from the
// media library instead of pasting URLs.
import { MediaPicker } from "../components/editor/MediaPicker";

// Theme logo helpers — shared across themes that ship a configurable
// logo (default, magazine, corporate). Lives in services/themeLogo.ts
// to avoid forcing themes to cross-reference one another.
import { logoPath, uploadThemeLogo, removeThemeLogo } from "../services/themeLogo";

declare global {
  interface Window {
    __FLEXWEG_RUNTIME__?: FlexwegRuntime;
  }
}

// Bumped whenever the API contract changes in a breaking way. The
// external loader checks `manifest.apiVersion` against this constant
// and refuses to load anything outside [MIN_API, CURRENT_API].
//
// 1.0.0 — first stable contract: pluginApi (filters/actions/blocks/cards),
// theme manifest shape, runtime React/i18n exports.
// 1.1.0 — expanded surface: core helpers (slug, media, markdown,
// socialIcons, postSort, render), Flexweg Files API, post/media/term/
// publisher services, menuPublisher, settings, toast, lib/utils. This
// is what every in-tree plugin/theme has historically used; exposing
// it formally lets them all be packaged as external bundles at build
// time. Backwards compatible — 1.0.0 bundles still load.
export const FLEXWEG_API_VERSION = "1.1.0";
export const FLEXWEG_API_MIN_VERSION = "1.0.0";

// Snapshot of the public runtime API. Each named property is
// re-exported by /admin/runtime/cms-runtime.js so external bundles
// `import { uploadFile } from "@flexweg/cms-runtime"` resolve through
// the import-map to live admin instances.
export interface FlexwegRuntime {
  apiVersion: string;
  minApiVersion: string;
  // React + family
  react: typeof React;
  reactJsxRuntime: typeof ReactJsxRuntime;
  reactDom: typeof ReactDOM;
  reactDomClient: typeof ReactDOMClient;
  reactI18next: typeof ReactI18next;
  // CMS plugin API
  pluginApi: typeof pluginApi;
  registerBlock: typeof registerBlock;
  registerDashboardCard: typeof registerDashboardCard;
  registerExternalPlugin: typeof registerExternalPlugin;
  registerExternalTheme: typeof registerExternalTheme;
  // core/slug
  slugify: typeof slugify;
  isValidSlug: typeof isValidSlug;
  findAvailableSlug: typeof findAvailableSlug;
  buildPostUrl: typeof buildPostUrl;
  buildTermUrl: typeof buildTermUrl;
  pathToPublicUrl: typeof pathToPublicUrl;
  detectPathCollision: typeof detectPathCollision;
  detectTermSlugCollision: typeof detectTermSlugCollision;
  normalizeMediaSlug: typeof normalizeMediaSlug;
  // core/media
  mediaToView: typeof mediaToView;
  pickFormat: typeof pickFormat;
  pickMediaUrl: typeof pickMediaUrl;
  // core/markdown
  markdownToPlainText: typeof markdownToPlainText;
  renderMarkdown: typeof renderMarkdown;
  // core/socialIcons
  SocialIcon: typeof SocialIcon;
  socialLabel: typeof socialLabel;
  // core/postSort
  postSortMillis: typeof postSortMillis;
  // core/render
  renderPageToHtml: typeof renderPageToHtml;
  // services/flexwegApi
  uploadFile: typeof uploadFile;
  deleteFile: typeof deleteFile;
  deleteFolder: typeof deleteFolder;
  renameFile: typeof renameFile;
  renameFolder: typeof renameFolder;
  createFolder: typeof createFolder;
  getFile: typeof getFile;
  listFiles: typeof listFiles;
  publicUrlFor: typeof publicUrlFor;
  fileToBase64: typeof fileToBase64;
  getStorageLimits: typeof getStorageLimits;
  FlexwegApiError: typeof FlexwegApiError;
  // services/posts
  fetchAllPosts: typeof fetchAllPosts;
  createPost: typeof createPost;
  updatePost: typeof updatePost;
  // services/media
  uploadMedia: typeof uploadMedia;
  // services/taxonomies
  createTerm: typeof createTerm;
  // services/users
  buildAuthorLookup: typeof buildAuthorLookup;
  // services/publisher
  publishPost: typeof publishPost;
  buildPublishContext: typeof buildPublishContext;
  buildSiteContext: typeof buildSiteContext;
  // services/menuPublisher
  publishMenuJson: typeof publishMenuJson;
  // services/catalogPublisher
  publishProductsJson: typeof publishProductsJson;
  deleteProductsJson: typeof deleteProductsJson;
  // services/settings
  updatePluginConfig: typeof updatePluginConfig;
  updateThemeConfig: typeof updateThemeConfig;
  // lib/toast
  toast: typeof toast;
  // lib/utils
  sha256Hex: typeof sha256Hex;
  formatDateTime: typeof formatDateTime;
  cn: typeof cn;
  // React hooks — context access for plugin / theme settings pages.
  useCmsData: typeof useCmsData;
  useAuth: typeof useAuth;
  // i18n
  i18n: typeof i18nInstance;
  pickPublicLocale: typeof pickPublicLocale;
  setActiveLocale: typeof setActiveLocale;
  // UI components
  EntityCombobox: typeof EntityCombobox;
  // Themes registry helpers
  getActiveTheme: typeof getActiveTheme;
  // Theme block authoring helpers
  useAllPosts: typeof useAllPosts;
  getCurrentPublishContext: typeof getCurrentPublishContext;
  FontSelect: typeof FontSelect;
  MediaPicker: typeof MediaPicker;
  // Theme logo helpers
  logoPath: typeof logoPath;
  uploadThemeLogo: typeof uploadThemeLogo;
  removeThemeLogo: typeof removeThemeLogo;
}

const runtime: FlexwegRuntime = {
  apiVersion: FLEXWEG_API_VERSION,
  minApiVersion: FLEXWEG_API_MIN_VERSION,
  react: React,
  reactJsxRuntime: ReactJsxRuntime,
  reactDom: ReactDOM,
  reactDomClient: ReactDOMClient,
  reactI18next: ReactI18next,
  pluginApi,
  registerBlock,
  registerDashboardCard,
  registerExternalPlugin,
  registerExternalTheme,
  slugify,
  isValidSlug,
  findAvailableSlug,
  buildPostUrl,
  buildTermUrl,
  pathToPublicUrl,
  detectPathCollision,
  detectTermSlugCollision,
  normalizeMediaSlug,
  mediaToView,
  pickFormat,
  pickMediaUrl,
  markdownToPlainText,
  renderMarkdown,
  SocialIcon,
  socialLabel,
  postSortMillis,
  renderPageToHtml,
  uploadFile,
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder,
  createFolder,
  getFile,
  listFiles,
  publicUrlFor,
  fileToBase64,
  getStorageLimits,
  FlexwegApiError,
  fetchAllPosts,
  createPost,
  updatePost,
  uploadMedia,
  createTerm,
  buildAuthorLookup,
  publishPost,
  buildPublishContext,
  buildSiteContext,
  publishMenuJson,
  publishProductsJson,
  deleteProductsJson,
  updatePluginConfig,
  updateThemeConfig,
  toast,
  sha256Hex,
  formatDateTime,
  cn,
  useCmsData,
  useAuth,
  i18n: i18nInstance,
  pickPublicLocale,
  setActiveLocale,
  EntityCombobox,
  getActiveTheme,
  useAllPosts,
  getCurrentPublishContext,
  FontSelect,
  MediaPicker,
  logoPath,
  uploadThemeLogo,
  removeThemeLogo,
};

if (typeof window !== "undefined") {
  window.__FLEXWEG_RUNTIME__ = runtime;
}

// Re-export every value as a top-level named export so the TS path
// alias `@flexweg/cms-runtime` → this file can resolve plugin imports
// like `import { uploadFile, slugify } from "@flexweg/cms-runtime"`.
export {
  pluginApi,
  registerBlock,
  registerDashboardCard,
  registerExternalPlugin,
  registerExternalTheme,
  slugify,
  isValidSlug,
  findAvailableSlug,
  buildPostUrl,
  buildTermUrl,
  pathToPublicUrl,
  detectPathCollision,
  detectTermSlugCollision,
  normalizeMediaSlug,
  mediaToView,
  pickFormat,
  pickMediaUrl,
  markdownToPlainText,
  renderMarkdown,
  SocialIcon,
  socialLabel,
  postSortMillis,
  renderPageToHtml,
  uploadFile,
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder,
  createFolder,
  getFile,
  listFiles,
  publicUrlFor,
  fileToBase64,
  getStorageLimits,
  FlexwegApiError,
  fetchAllPosts,
  createPost,
  updatePost,
  uploadMedia,
  createTerm,
  buildAuthorLookup,
  publishPost,
  buildPublishContext,
  buildSiteContext,
  publishMenuJson,
  publishProductsJson,
  deleteProductsJson,
  updatePluginConfig,
  updateThemeConfig,
  toast,
  sha256Hex,
  formatDateTime,
  cn,
  useCmsData,
  useAuth,
  i18nInstance as i18n,
  pickPublicLocale,
  setActiveLocale,
  EntityCombobox,
  getActiveTheme,
  useAllPosts,
  getCurrentPublishContext,
  FontSelect,
  MediaPicker,
  logoPath,
  uploadThemeLogo,
  removeThemeLogo,
};

// Type-only re-export for ComboboxOption — needed by plugin settings
// pages that pass options to <EntityCombobox>.
export type { ComboboxOption } from "../components/ui/EntityCombobox";

// Type-only re-export for FontOption — used by theme settings pages
// that pass options to <FontSelect>.
export type { FontOption } from "../components/ui/FontSelect";

export default runtime;
