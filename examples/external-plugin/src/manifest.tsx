// External plugin sample. Demonstrates:
//   - Hooking page.head.extra to inject a meta tag on every published page
//   - Subscribing to publish.complete to log activity
//   - Contributing a dashboard card with its own React component
//
// Build: `npm run build` produces ./dist/bundle.js (the runtime-loaded
// ESM module). `npm run pack` zips ./dist + manifest.json + README.md
// into ./hello-plugin.zip ready for the admin's "Install plugin" UI.

import { useEffect, useState } from "react";
import type { PluginManifest } from "@flexweg/cms-runtime";

// Tiny dashboard card showing how external plugins contribute UI.
function HelloCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="card p-4">
      <p className="text-sm font-semibold">Hello from external plugin</p>
      <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
        This card is contributed by an externally-loaded plugin. Tick:{" "}
        {tick}
      </p>
    </div>
  );
}

const manifest: PluginManifest = {
  id: "hello-plugin",
  name: "Hello Plugin",
  version: "1.0.0",
  description:
    "Sample external plugin — injects a meta tag on every published page and shows a dashboard card.",
  author: "Flexweg",
  register(api) {
    // Filter: append a meta tag to every page's <head>.
    api.addFilter<string>("page.head.extra", (head) => {
      return (
        head +
        '<meta name="x-hello-plugin" content="external" />\n'
      );
    });
    // Action: console-log every successful publish so plugin authors
    // see how to observe site-wide events.
    api.addAction("publish.complete", (post) => {
      // eslint-disable-next-line no-console
      console.log("[hello-plugin] published:", (post as { id: string }).id);
    });
    // Dashboard card — registered through pluginApi for symmetry with
    // in-tree plugins. Same registry as built-in cards.
    api.registerDashboardCard({
      id: "hello-plugin/card",
      priority: 50,
      component: HelloCard,
    });
  },
};

export default manifest;
