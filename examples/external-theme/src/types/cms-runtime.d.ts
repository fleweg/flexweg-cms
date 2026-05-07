// Minimal type stub for @flexweg/cms-runtime — the public API external
// plugins use. In a production setup these types would ship as an npm
// package (`@flexweg/cms-runtime`); for the example we keep them inline
// so the scaffold is self-contained.
//
// Keep this in sync with src/core/pluginRegistry.ts on the admin side.

declare module "@flexweg/cms-runtime" {
  import type { ComponentType } from "react";

  export const FLEXWEG_API_VERSION: string;
  export const FLEXWEG_API_MIN_VERSION: string;

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

  export interface PluginApi {
    addFilter<T>(hook: string, handler: FilterHandler<T>, priority?: number): void;
    addAction(hook: string, handler: ActionHandler, priority?: number): void;
    applyFilters<T>(hook: string, value: T, ...args: unknown[]): Promise<T>;
    applyFiltersSync<T>(hook: string, value: T, ...args: unknown[]): T;
    doAction(hook: string, ...args: unknown[]): Promise<void>;
    registerBlock?: (manifest: unknown) => void;
    registerDashboardCard: (manifest: DashboardCardManifest) => void;
  }

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

  export const pluginApi: PluginApi;
  export function registerExternalPlugin(manifest: PluginManifest): void;
  export function registerExternalTheme(manifest: unknown): void;
}
