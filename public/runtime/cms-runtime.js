// Runtime stub for "@flexweg/cms-runtime" — the public API external
// plugins and themes use to register filters, actions, blocks, and
// dashboard cards. Externals install @flexweg/cms-runtime as a dev
// dependency for the type definitions and externalize it at build
// time; the import-map then redirects each `import` here.
const R = (typeof window !== "undefined" && window.__FLEXWEG_RUNTIME__)
  ? window.__FLEXWEG_RUNTIME__
  : null;

if (!R) {
  throw new Error(
    "[flexweg] window.__FLEXWEG_RUNTIME__ is not initialised when @flexweg/cms-runtime was imported.",
  );
}

export const FLEXWEG_API_VERSION = R.apiVersion;
export const FLEXWEG_API_MIN_VERSION = R.minApiVersion;
export const pluginApi = R.pluginApi;
export const registerBlock = R.registerBlock;
export const registerDashboardCard = R.registerDashboardCard;
export const registerExternalPlugin = R.registerExternalPlugin;
export const registerExternalTheme = R.registerExternalTheme;
