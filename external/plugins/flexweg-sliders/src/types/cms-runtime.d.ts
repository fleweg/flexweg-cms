// Minimal stub for @flexweg/cms-runtime — the public API surface this
// external plugin consumes. Tiptap types are pulled from the bundled
// @tiptap/core / @tiptap/react packages (not externalized) so we don't
// need to re-declare them.

declare module "@flexweg/cms-runtime" {
  import type { ComponentType, ReactNode } from "react";

  export const FLEXWEG_API_VERSION: string;
  export const FLEXWEG_API_MIN_VERSION: string;

  export type FilterHandler<T> = (
    value: T,
    ...args: unknown[]
  ) => T | Promise<T>;
  export type ActionHandler = (...args: unknown[]) => void | Promise<void>;

  export interface BlockManifest<TAttrs = unknown> {
    id: string;
    nodeName?: string;
    titleKey: string;
    namespace?: string;
    icon?: ComponentType;
    category?: "text" | "media" | "layout" | "embed" | "advanced" | string;
    extensions?: unknown[];
    insert: (chain: unknown, ctx?: unknown) => void | Promise<void>;
    isActive?: (editor: unknown) => boolean;
    inspector?: (props: {
      editor: unknown;
      attrs?: TAttrs;
      updateAttrs?: (next: Partial<TAttrs>) => void;
    }) => ReactNode;
  }

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
    registerBlock: (manifest: BlockManifest) => void;
    registerDashboardCard: (manifest: DashboardCardManifest) => void;
  }

  export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description?: string;
    author?: string;
    readme?: string;
    register: (api: PluginApi) => void;
    i18n?: Record<string, Record<string, unknown>>;
  }

  export const pluginApi: PluginApi;

  // MediaPicker — admin-side modal mounted by block inspectors so users
  // can pick images from the media library without leaving the editor.
  export interface PickedMedia {
    id: string;
    name: string;
    alt?: string;
    url?: string;
    formats?: Record<string, { url: string }>;
  }
  export interface MediaPickerProps {
    onPick: (media: PickedMedia) => void;
    onClose: () => void;
  }
  export const MediaPicker: ComponentType<MediaPickerProps>;

  export function pickMediaUrl(media: unknown, name?: string): string;
}
