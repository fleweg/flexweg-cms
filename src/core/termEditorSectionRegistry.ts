import type { ComponentType } from "react";
import type { Term } from "./types";

// Term editor section registry — lets plugins inject UI into the
// Categories / Tags edit modal alongside the standard name + slug
// fields. Used by plugins that store per-term opaque metadata
// (e.g. multilang stores `translations.{lang}.{slug,name,description}`).
//
// Same lifecycle as other plugin registries: reset on every
// applyPluginRegistration() pass, re-registered by each enabled
// plugin's `register()` callback.

export interface TermEditorSectionProps {
  term: Term;
  // Apply a patch on the editor's draft. Triggers a "dirty" state on
  // the host modal so the save button reflects it; the host commits
  // the patch on save.
  updateTerm: (patch: Partial<Term>) => void;
}

export interface TermEditorSectionManifest {
  // Stable, namespaced id — "<plugin-id>/<section>" by convention.
  id: string;
  // Filter for which term type this section applies to. Defaults to
  // "all" so plugins handle both categories and tags through the same
  // component unless they explicitly opt out.
  termType?: "category" | "tag" | "all";
  // Display order. Sections sort by priority ascending. Defaults to
  // 100 so plugins can squeeze sections above or below other plugins'
  // without coordination.
  priority?: number;
  component: ComponentType<TermEditorSectionProps>;
}

const sections = new Map<string, TermEditorSectionManifest>();
const subscribers = new Set<() => void>();
// Snapshot cache for useSyncExternalStore — reference-stable until
// register/reset invalidates. Without this, React enters an
// infinite render loop (error #185).
const snapshotCache = new Map<string, TermEditorSectionManifest[]>();

function notify(): void {
  snapshotCache.clear();
  for (const cb of subscribers) cb();
}

export function subscribeTermEditorSections(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function registerTermEditorSection(manifest: TermEditorSectionManifest): void {
  if (sections.has(manifest.id)) {
    console.warn(`Term editor section "${manifest.id}" already registered. Overwriting.`);
  }
  sections.set(manifest.id, manifest);
  notify();
}

export function listTermEditorSections(
  termType: "category" | "tag",
): TermEditorSectionManifest[] {
  const cached = snapshotCache.get(termType);
  if (cached) return cached;
  const out = Array.from(sections.values())
    .filter((s) => !s.termType || s.termType === "all" || s.termType === termType)
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  snapshotCache.set(termType, out);
  return out;
}

export function resetTermEditorSections(): void {
  sections.clear();
  notify();
}
