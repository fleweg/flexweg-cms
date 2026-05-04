import type { ComponentType } from "react";

// Dashboard card registry — lets plugins contribute self-contained
// cards that render under the stat-card row on the admin dashboard.
//
// Same lifecycle as blockRegistry's plugin channel: cards are
// registered through pluginApi.registerDashboardCard() during
// applyPluginRegistration(), and resetDashboardCards() clears them on
// every reset so the active set always matches the current enabled
// plugins (MU plugins re-register on every pass).
//
// Cards are dumb components — they get no props. Each card is
// responsible for fetching its own data and managing its loading /
// error / empty states. This keeps the registry trivial and means a
// card can decide for itself whether to refresh on mount, on focus,
// or never.

export interface DashboardCardManifest {
  // Stable, namespaced id — "<plugin-id>/<card>" by convention.
  id: string;
  // Display order. Lower runs first. Defaults to 100 so plugins can
  // squeeze cards above (priority < 100) or below (> 100) others
  // without coordination.
  priority?: number;
  component: ComponentType;
}

const cards = new Map<string, DashboardCardManifest>();

export function registerDashboardCard(manifest: DashboardCardManifest): void {
  if (cards.has(manifest.id)) {
    console.warn(`Dashboard card "${manifest.id}" already registered. Overwriting.`);
  }
  cards.set(manifest.id, manifest);
}

export function listDashboardCards(): DashboardCardManifest[] {
  return Array.from(cards.values()).sort(
    (a, b) => (a.priority ?? 100) - (b.priority ?? 100),
  );
}

export function resetDashboardCards(): void {
  cards.clear();
}
