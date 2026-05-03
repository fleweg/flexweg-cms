import type { ChainedCommands, Editor, Extensions } from "@tiptap/core";
import type { ComponentType } from "react";

// Block registry — the source of truth for every editor block the user
// can insert. Two registration channels exist:
//
//   • Core blocks: registered once at module import time via
//     registerCoreBlock(). They are persistent — resetBlocks() never
//     clears them, so toggling a plugin can never strip the basics.
//
//   • Plugin blocks: registered through pluginApi.registerBlock() during
//     applyPluginRegistration(). These get cleared on every reset so
//     the active set always matches the current enabled-plugin list.
//
// Block manifests are inert data; the editor reads them at mount time
// to:
//   1. Compose its Tiptap extension list (StarterKit + plugin extensions).
//   2. Populate the floating "+" inserter and (later) the slash menu.
//   3. Resolve the active block in the inspector's Block tab.

export type BlockCategory = "text" | "media" | "layout" | "embed" | "advanced";

// Context handed to a block's `insert` callback. Lets blocks request
// resources owned by the page (e.g. the media picker) without having
// to thread props through the editor.
export interface BlockInsertContext {
  pickMedia?: () => Promise<{ url: string; alt?: string } | null>;
}

export interface BlockInspectorProps<TAttrs = Record<string, unknown>> {
  attrs: TAttrs;
  updateAttrs: (next: Partial<TAttrs>) => void;
  editor: Editor;
}

export interface BlockManifest<TAttrs = Record<string, unknown>> {
  // Stable, namespaced id — "core/paragraph", "<plugin-id>/<block>".
  id: string;
  // i18n key for the block's display name in the inserter / inspector.
  titleKey: string;
  // i18n namespace — when undefined, the global namespace is used.
  // Plugin blocks should pass their plugin id (the same namespace
  // their PluginManifest.i18n bundles target).
  namespace?: string;
  // Lucide-style icon component. Renders next to the title in the
  // inserter and inspector.
  icon: ComponentType<{ className?: string }>;
  category: BlockCategory;
  // Insertion command. Receives the chained editor commands plus a
  // context of resources from the host page. May be async (e.g. to
  // await a media-picker promise before inserting). The implementation
  // is responsible for calling .run() on the chain when ready.
  insert: (chain: ChainedCommands, ctx: BlockInsertContext) => Promise<void> | void;
  // Optional Tiptap extensions to register on the editor for this
  // block. Core blocks rely on StarterKit and omit this; plugin blocks
  // bring their custom Node / Mark / Extension here. Picked up at
  // editor mount time — toggling a plugin requires reopening the
  // editor for new extensions to take effect.
  extensions?: Extensions;
  // Predicate that returns true when this block is the "active" block
  // at the editor's current cursor position. Used by the Block tab in
  // the inspector to decide which manifest to render.
  isActive?: (editor: Editor) => boolean;
  // Optional inspector component shown in the Block tab when this
  // block is active. Receives the resolved attrs and an updater that
  // writes them back into the underlying Tiptap node.
  inspector?: ComponentType<BlockInspectorProps<TAttrs>>;
}

const blocks = new Map<string, BlockManifest<unknown>>();
const coreIds = new Set<string>();
let version = 0;

export function registerCoreBlock<TAttrs>(manifest: BlockManifest<TAttrs>): void {
  if (blocks.has(manifest.id) && !coreIds.has(manifest.id)) {
    console.warn(`Block "${manifest.id}" already registered as a non-core block. Overwriting.`);
  }
  blocks.set(manifest.id, manifest as BlockManifest<unknown>);
  coreIds.add(manifest.id);
  version++;
}

export function registerBlock<TAttrs>(manifest: BlockManifest<TAttrs>): void {
  if (coreIds.has(manifest.id)) {
    console.warn(`Block "${manifest.id}" collides with a core block. Plugin block ignored.`);
    return;
  }
  if (blocks.has(manifest.id)) {
    console.warn(`Block "${manifest.id}" is already registered. Overwriting.`);
  }
  blocks.set(manifest.id, manifest as BlockManifest<unknown>);
  version++;
}

export function listBlocks(): BlockManifest[] {
  return Array.from(blocks.values()) as BlockManifest[];
}

export function getBlock(id: string): BlockManifest | undefined {
  return blocks.get(id) as BlockManifest | undefined;
}

// Clears every plugin-registered block while leaving core blocks in
// place. Mirrors resetRegistry() in pluginRegistry.ts and is invoked
// from applyPluginRegistration() so plugin block registrations always
// match the current enabled set.
export function resetBlocks(): void {
  for (const id of Array.from(blocks.keys())) {
    if (!coreIds.has(id)) blocks.delete(id);
  }
  version++;
}

// Monotonically increasing counter incremented on every registry
// mutation. Components can use this as a React `key` to force a
// re-mount of the editor when the block set changes (e.g. after a
// plugin toggle), so freshly registered Tiptap extensions take effect.
export function getRegistryVersion(): number {
  return version;
}

// Returns the manifest of the block currently active at the editor's
// cursor. Iterates in registration order; the first manifest whose
// `isActive` predicate returns true wins, so more specific blocks
// (plugin overrides) should be registered after the generic ones they
// extend.
export function findActiveBlock(editor: Editor): BlockManifest | undefined {
  for (const manifest of blocks.values()) {
    if (manifest.isActive?.(editor)) return manifest as BlockManifest;
  }
  return undefined;
}
