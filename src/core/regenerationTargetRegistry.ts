import type { PublishContext, PublishLogEntry } from "../services/publisher";

// Regeneration target registry — surfaces "Force regenerate" actions
// owned by individual plugins (sitemaps, RSS, search, archives,
// favicon …) inside the unified Regenerate ▾ dropdown on the Themes
// page. Same lifecycle as blockRegistry's plugin channel: targets are
// registered through pluginApi.registerRegenerationTarget() during
// applyPluginRegistration(), and resetRegenerationTargets() clears
// them on every reset so the active set always matches the current
// enabled-plugin list (MU plugins re-register on every pass).
//
// Built-in regeneration entry points (Home, All HTML pages, Theme
// assets, Run everything) are hardcoded inside ThemesPage — they
// don't go through this registry because they're owned by the
// publisher core, not by a plugin.

export type PublishLogger = (entry: PublishLogEntry) => void;

export interface RegenerationTarget {
  // Stable id — by convention the plugin id, e.g. "flexweg-sitemaps".
  // Used for React keys + fallback labels when i18n lookup fails.
  id: string;
  // i18n key resolved against the plugin's own namespace
  // (`useTranslation(<plugin-id>)`). The ThemesPage looks up the
  // resolved label via i18n.t(labelKey, { ns: id }).
  labelKey: string;
  // Optional second-line description shown below the label in the
  // dropdown. Same namespace as labelKey.
  descriptionKey?: string;
  // Display order. Lower runs first. Defaults to 100 — same convention
  // as DashboardCardManifest, so a plugin can squeeze ahead with a
  // lower priority without coordination.
  priority?: number;
  // Async runner. Receives the live PublishContext (built fresh by
  // the caller via buildPublishContext) and a logger that writes into
  // the same PublishLog the dropdown surfaces above. The runner is
  // responsible for any bookkeeping persistence (lastIndexHash,
  // lastPublishedPath, …) — typically by calling updatePluginConfig
  // internally. Throws are caught + logged as `error` entries by the
  // ThemesPage; never bubble up to crash the admin.
  run: (ctx: PublishContext, log: PublishLogger) => Promise<void>;
}

const targets = new Map<string, RegenerationTarget>();
const subscribers = new Set<() => void>();

function notify(): void {
  for (const cb of subscribers) cb();
}

// Subscribe to register / reset events. ThemesPage uses this so its
// dropdown re-paints when plugins toggle on/off — registry mutations
// happen asynchronously inside applyPluginRegistration() (which runs
// after the settings Firestore snapshot lands), so a one-shot
// snapshot at mount would miss late-registered targets.
export function subscribeRegenerationTargets(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function registerRegenerationTarget(target: RegenerationTarget): void {
  if (targets.has(target.id)) {
    console.warn(`Regeneration target "${target.id}" already registered. Overwriting.`);
  }
  targets.set(target.id, target);
  notify();
}

export function listRegenerationTargets(): RegenerationTarget[] {
  return Array.from(targets.values()).sort(
    (a, b) => (a.priority ?? 100) - (b.priority ?? 100),
  );
}

export function resetRegenerationTargets(): void {
  targets.clear();
  notify();
}
