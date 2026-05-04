import type { PluginManifest } from "../../plugins";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import { StorageCard } from "./StorageCard";
import { FirestoreCard } from "./FirestoreCard";
import readme from "./README.md?raw";

const PLUGIN_ID = "flexweg-metrics";

export const manifest: PluginManifest = {
  id: PLUGIN_ID,
  name: "Flexweg Metrics",
  version: "1.0.0",
  author: "Flexweg",
  description:
    "Adds two cards to the admin dashboard: Flexweg storage usage (with upgrade CTA when near the plan limit) and Firestore document counts.",
  readme,
  i18n: { en, fr, de, es, nl, pt, ko },
  register(api) {
    api.registerDashboardCard({
      id: `${PLUGIN_ID}/storage`,
      priority: 10,
      component: StorageCard,
    });
    api.registerDashboardCard({
      id: `${PLUGIN_ID}/firestore`,
      priority: 20,
      component: FirestoreCard,
    });
  },
};
