// FlexwegRuntime — the bridge between the admin bundle and externally
// loaded plugins/themes.
//
// External bundles cannot import React, ReactDOM, react-i18next, or our
// internal API directly: they would each ship their own copy, hooks
// would crash on a "two Reacts" mismatch, and i18next state would not
// be shared.
//
// The fix is import-maps in index.html that redirect bare specifiers
// (e.g. `react`) to small stub files in /admin/runtime/. Each stub
// reads the live module instances off `window.__FLEXWEG_RUNTIME__` —
// which is populated here, side-effect imported by main.tsx **before**
// any other admin code runs.
//
// External plugin authors install our @flexweg/cms-runtime package as a
// dev dependency, externalize it in their Vite config, and write
// `import { pluginApi, type PluginManifest } from "@flexweg/cms-runtime"`.
// At runtime the import-map redirects to /admin/runtime/cms-runtime.js
// which re-exports from this same global.

import * as React from "react";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as ReactI18next from "react-i18next";
import { pluginApi } from "./pluginRegistry";
import { registerBlock } from "./blockRegistry";
import { registerDashboardCard } from "./dashboardCardRegistry";
import { registerExternalPlugin } from "../services/externalRegistry";
import { registerExternalTheme } from "../services/externalRegistry";

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
export const FLEXWEG_API_VERSION = "1.0.0";
export const FLEXWEG_API_MIN_VERSION = "1.0.0";

export interface FlexwegRuntime {
  // Version metadata so external bundles can guard against incompatible
  // admin versions at runtime (the loader also checks before importing).
  apiVersion: string;
  minApiVersion: string;
  // React + family. Re-exported through /admin/runtime/*.js stubs so
  // external bundles load the same module instance as the admin.
  react: typeof React;
  reactJsxRuntime: typeof ReactJsxRuntime;
  reactDom: typeof ReactDOM;
  reactDomClient: typeof ReactDOMClient;
  reactI18next: typeof ReactI18next;
  // The CMS plugin API — filters/actions/blocks/cards/regen targets.
  // External plugins call this exactly like in-tree plugins do.
  pluginApi: typeof pluginApi;
  // Block + dashboard registries. Convenience exposure so plugins can
  // register without going through pluginApi.
  registerBlock: typeof registerBlock;
  registerDashboardCard: typeof registerDashboardCard;
  // Self-registration helpers an external bundle calls after evaluating
  // its manifest. The loader also handles registration when the
  // manifest is the default export, but exposing these lets plugin
  // authors write self-registering bundles if they prefer.
  registerExternalPlugin: typeof registerExternalPlugin;
  registerExternalTheme: typeof registerExternalTheme;
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
};

if (typeof window !== "undefined") {
  window.__FLEXWEG_RUNTIME__ = runtime;
}

export default runtime;
