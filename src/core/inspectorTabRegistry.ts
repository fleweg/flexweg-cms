import type { ComponentType } from "react";
import type { Post } from "./types";

// Inspector tab registry — lets plugins contribute additional tabs to
// the post/page editor's right-side Inspector (next to the built-in
// Document and Block tabs). Used by extensions that want first-class
// editing surfaces tied to a specific Post (e.g. translations,
// per-post SEO overrides, A/B experiment variants).
//
// Same lifecycle as dashboardCardRegistry: tabs are registered through
// pluginApi.registerInspectorTab() during applyPluginRegistration()
// and resetInspectorTabs() clears them on every reset so the active
// set always matches the current enabled plugins.
//
// Component contract: the tab receives the live Post entity, a patch
// helper that updates the in-memory draft, and a save helper that
// persists the current draft to the backend. Plugins read/write a
// specific Post field (e.g. `post.translations`) and use save() to
// flush — the host page is unaware of the tab's internal state.

export interface InspectorTabProps {
  entity: Post;
  // Apply an in-memory patch on the editor's draft. Triggers a "dirty"
  // state on the host page so the standard save button reflects it.
  // The host commits the patch on save; the tab does NOT need to call
  // save() itself unless it wants an explicit save (e.g. autosave on
  // every keystroke).
  updateEntity: (patch: Partial<Post>) => void;
  // Force a save right now. The host page resolves this once the
  // backend write completes (or rejects on error). Tabs that update
  // the entity through `updateEntity` and rely on the host's standard
  // save button don't need to call this — it's there for tabs that
  // need a "Save" action of their own.
  save: () => Promise<void>;
}

export interface InspectorTabManifest {
  // Stable, namespaced id — "<plugin-id>/<tab>" by convention.
  id: string;
  // i18n key resolved against the manifest's `namespace` (or the
  // global namespace when undefined).
  labelKey: string;
  namespace?: string;
  // Filter for which entity types this tab is relevant to. Tabs that
  // only make sense for blog posts can set "post"; tabs that work on
  // both posts and pages use "all" (default).
  forKind?: "post" | "page" | "all";
  // Optional badge label / count rendered next to the tab label
  // (e.g. "2/3" for partial translations). Called with the live
  // entity; return undefined to hide the badge.
  badge?: (entity: Post) => string | number | undefined;
  // Display order. Tabs sort by priority ascending. Defaults to 100
  // so plugins can squeeze tabs above (< 100) or below (> 100) others
  // without coordination.
  priority?: number;
  component: ComponentType<InspectorTabProps>;
}

const tabs = new Map<string, InspectorTabManifest>();
const subscribers = new Set<() => void>();
// Cached snapshots returned to React's useSyncExternalStore. Must be
// reference-stable between calls when nothing changed — otherwise
// React enters an infinite render loop (error #185). Invalidated on
// register/reset.
const snapshotCache = new Map<string, InspectorTabManifest[]>();

function notify(): void {
  snapshotCache.clear();
  for (const cb of subscribers) cb();
}

// Subscribe to register / reset events. Components consume this via
// the useInspectorTabs hook so the inspector re-renders when plugins
// register their tabs — the registry is populated asynchronously
// during applyPluginRegistration() (which runs after the settings
// Firestore snapshot lands), so a one-shot snapshot at mount would
// miss the tabs on first paint.
export function subscribeInspectorTabs(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function registerInspectorTab(manifest: InspectorTabManifest): void {
  if (tabs.has(manifest.id)) {
    console.warn(`Inspector tab "${manifest.id}" already registered. Overwriting.`);
  }
  tabs.set(manifest.id, manifest);
  notify();
}

export function listInspectorTabs(forKind: "post" | "page"): InspectorTabManifest[] {
  const cached = snapshotCache.get(forKind);
  if (cached) return cached;
  const out = Array.from(tabs.values())
    .filter((t) => !t.forKind || t.forKind === "all" || t.forKind === forKind)
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  snapshotCache.set(forKind, out);
  return out;
}

export function resetInspectorTabs(): void {
  tabs.clear();
  notify();
}
