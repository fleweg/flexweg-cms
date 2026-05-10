// Runtime stub for "@flexweg/cms-runtime" — the public API external
// plugins and themes use to register filters, actions, blocks, dashboard
// cards AND to call admin services (Flexweg Files API, Firestore CRUD,
// publishing, slug helpers, markdown utilities, …).
//
// External bundles install @flexweg/cms-runtime as a dev dependency
// for type definitions and externalize it at build time. The import-map
// in /admin/index.html redirects each `import` here. We read the live
// admin instances off window.__FLEXWEG_RUNTIME__ (populated by
// src/core/flexwegRuntime.ts on admin boot) and re-export them so the
// bundle gets the same module instances the admin itself uses —
// required for Firebase / i18next / React state to be coherent.
const R = (typeof window !== "undefined" && window.__FLEXWEG_RUNTIME__)
  ? window.__FLEXWEG_RUNTIME__
  : null;

if (!R) {
  throw new Error(
    "[flexweg] window.__FLEXWEG_RUNTIME__ is not initialised when @flexweg/cms-runtime was imported.",
  );
}

// API versioning
export const FLEXWEG_API_VERSION = R.apiVersion;
export const FLEXWEG_API_MIN_VERSION = R.minApiVersion;

// CMS plugin API + registries
export const pluginApi = R.pluginApi;
export const registerBlock = R.registerBlock;
export const registerDashboardCard = R.registerDashboardCard;
export const registerExternalPlugin = R.registerExternalPlugin;
export const registerExternalTheme = R.registerExternalTheme;

// core/slug
export const slugify = R.slugify;
export const isValidSlug = R.isValidSlug;
export const findAvailableSlug = R.findAvailableSlug;
export const buildPostUrl = R.buildPostUrl;
export const buildTermUrl = R.buildTermUrl;
export const pathToPublicUrl = R.pathToPublicUrl;
export const detectPathCollision = R.detectPathCollision;
export const detectTermSlugCollision = R.detectTermSlugCollision;
export const normalizeMediaSlug = R.normalizeMediaSlug;

// core/media
export const mediaToView = R.mediaToView;
export const pickFormat = R.pickFormat;
export const pickMediaUrl = R.pickMediaUrl;

// core/markdown
export const markdownToPlainText = R.markdownToPlainText;
export const renderMarkdown = R.renderMarkdown;

// core/socialIcons
export const SocialIcon = R.SocialIcon;
export const socialLabel = R.socialLabel;

// core/postSort
export const postSortMillis = R.postSortMillis;

// core/render
export const renderPageToHtml = R.renderPageToHtml;

// services/flexwegApi — Flexweg Files API client
export const uploadFile = R.uploadFile;
export const deleteFile = R.deleteFile;
export const deleteFolder = R.deleteFolder;
export const renameFile = R.renameFile;
export const renameFolder = R.renameFolder;
export const createFolder = R.createFolder;
export const getFile = R.getFile;
export const listFiles = R.listFiles;
export const publicUrlFor = R.publicUrlFor;
export const fileToBase64 = R.fileToBase64;
export const getStorageLimits = R.getStorageLimits;
export const FlexwegApiError = R.FlexwegApiError;

// services/posts — post Firestore CRUD
export const fetchAllPosts = R.fetchAllPosts;
export const createPost = R.createPost;
export const updatePost = R.updatePost;

// services/media — image upload pipeline
export const uploadMedia = R.uploadMedia;

// services/taxonomies — term CRUD
export const createTerm = R.createTerm;

// services/users — author resolution
export const buildAuthorLookup = R.buildAuthorLookup;

// services/publisher — page rendering / publishing
export const publishPost = R.publishPost;
export const buildPublishContext = R.buildPublishContext;
export const buildSiteContext = R.buildSiteContext;

// services/menuPublisher — /menu.json upload
export const publishMenuJson = R.publishMenuJson;

// services/catalogPublisher — /data/products.json upload (storefront theme)
export const publishProductsJson = R.publishProductsJson;
export const deleteProductsJson = R.deleteProductsJson;

// services/settings — plugin/theme config storage
export const updatePluginConfig = R.updatePluginConfig;
export const updateThemeConfig = R.updateThemeConfig;

// lib/toast — global notification queue
export const toast = R.toast;

// lib/utils
export const sha256Hex = R.sha256Hex;
export const formatDateTime = R.formatDateTime;
export const cn = R.cn;

// React hooks — context access for plugin / theme settings pages
export const useCmsData = R.useCmsData;
export const useAuth = R.useAuth;

// i18n
export const i18n = R.i18n;
export const pickPublicLocale = R.pickPublicLocale;
export const setActiveLocale = R.setActiveLocale;

// UI components
export const EntityCombobox = R.EntityCombobox;

// Themes registry
export const getActiveTheme = R.getActiveTheme;

// Theme block authoring helpers
export const useAllPosts = R.useAllPosts;
export const getCurrentPublishContext = R.getCurrentPublishContext;
export const FontSelect = R.FontSelect;
export const MediaPicker = R.MediaPicker;

// Theme logo helpers
export const logoPath = R.logoPath;
export const uploadThemeLogo = R.uploadThemeLogo;
export const removeThemeLogo = R.removeThemeLogo;
