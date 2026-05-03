import type { ChainedCommands, Editor, Extensions } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
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
  // Underlying Tiptap node name. The inspector reads/writes attrs
  // against this name. Optional — when omitted, the registry falls
  // back to a heuristic (`core/foo-bar` → `foobar`, otherwise the id
  // verbatim). Plugin blocks whose id contains a slash MUST set this
  // explicitly because slashes aren't valid in Tiptap node names.
  nodeName?: string;
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
// cursor. Implements a depth-walk + prefer-inspector strategy:
//
//   1. Build the chain of ProseMirror node types from the deepest
//      ancestor (or selection.node for a NodeSelection) up to the
//      first non-doc level.
//   2. First pass — walk deepest-first, return the first manifest
//      that matches AND has its own inspector. Means a paragraph
//      inside a column inside a Columns container surfaces the
//      Columns inspector (paragraph has no inspector → skipped).
//   3. Second pass — same walk but accept any match regardless of
//      inspector. Lets the Block tab still display a "no settings"
//      label for blocks like core/paragraph.
//
// Heading levels (manifest ids `core/heading-2`, `core/heading-3`)
// derive a node-name like "heading2" / "heading3" that doesn't match
// Tiptap's actual node type "heading". Matched explicitly via the
// /^heading([1-6])$/ regex + the `level` attr on the node.
export function findActiveBlock(editor: Editor): BlockManifest | undefined {
  const all = Array.from(blocks.values()) as BlockManifest[];

  // Defensive: when called with a non-real editor (tests, transient
  // states pre-mount) fall back to the legacy isActive-based scan.
  // Returns the first manifest whose predicate is truthy — same
  // behaviour as the original implementation, which the unit tests
  // depend on.
  const $from = editor?.state?.selection?.$from;
  if (!$from) {
    for (const manifest of all) {
      if (manifest.isActive?.(editor)) return manifest;
    }
    return undefined;
  }

  const { selection } = editor.state;

  // Chain of node frames, deepest-first.
  type Frame = { typeName: string; attrs: Record<string, unknown> };
  const chain: Frame[] = [];
  if (selection instanceof NodeSelection) {
    chain.push({
      typeName: selection.node.type.name,
      attrs: selection.node.attrs as Record<string, unknown>,
    });
  }
  for (let depth = $from.depth; depth >= 1; depth--) {
    const node = $from.node(depth);
    chain.push({
      typeName: node.type.name,
      attrs: node.attrs as Record<string, unknown>,
    });
  }

  function manifestNodeName(m: BlockManifest): string {
    if (m.nodeName) return m.nodeName;
    // Legacy core blocks omit nodeName — derive from id ("core/foo-bar"
    // → "foobar"). Matches the same heuristic used in EditorInspector
    // for the BlockInspectorRenderer's attrs lookup.
    if (m.id.startsWith("core/")) {
      return m.id.slice("core/".length).replace(/-/g, "");
    }
    return m.id;
  }

  function matchesFrame(m: BlockManifest, frame: Frame): boolean {
    const name = manifestNodeName(m);
    const headingMatch = name.match(/^heading([1-6])$/);
    if (headingMatch) {
      const level = Number.parseInt(headingMatch[1], 10);
      return frame.typeName === "heading" && frame.attrs.level === level;
    }
    return name === frame.typeName;
  }

  // First pass: deepest manifest WITH an inspector wins.
  for (const frame of chain) {
    const matched = all.find((m) => matchesFrame(m, frame));
    if (matched && matched.inspector) return matched;
  }
  // Second pass: deepest manifest period — so the Block tab can
  // render its "no settings" placeholder for blocks without one.
  for (const frame of chain) {
    const matched = all.find((m) => matchesFrame(m, frame));
    if (matched) return matched;
  }
  return undefined;
}
