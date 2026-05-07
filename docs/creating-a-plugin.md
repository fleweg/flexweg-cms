# Creating an external plugin

This guide walks through authoring a plugin distributed as a `.zip` and loaded at runtime by Flexweg CMS — no rebuild of the admin required.

## When to write an external plugin (vs. in-tree)

Pick **external** when:

- You're shipping the plugin to multiple admins you don't control (clients, customers, public marketplace).
- You don't want to rebuild + redeploy the admin SPA every time you change the plugin.
- You want admins to install / remove your plugin with a one-click upload.

Pick **in-tree** when:

- The plugin only ships with your own admin, and a code change there is fine.
- You want full TypeScript checking against the live admin sources.
- You don't need install / uninstall UX.

The hook API (`api.addFilter`, `api.addAction`, blocks, dashboard cards, settings pages) is **identical** across both. You can prototype as in-tree first and graduate to external later — the manifest shape doesn't change.

## Anatomy of an external plugin

```
my-plugin/
├── manifest.json          ← installation metadata (read by the admin BEFORE the bundle)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── scripts/pack.mjs       ← zips dist/ + manifest + README into <id>.zip
├── src/
│   ├── manifest.tsx       ← entry — default-exports a PluginManifest
│   └── types/
│       └── cms-runtime.d.ts ← types for the externalised @flexweg/cms-runtime
└── README.md              ← shown in the plugins list when an admin clicks "Learn more"
```

The published artifact is a single `.zip` containing `manifest.json`, `bundle.js`, optional `README.md`. Anything else inside the ZIP is uploaded to `/admin/plugins/<id>/` on Flexweg too (icons, sub-images, additional assets).

## manifest.json (installation metadata)

```json
{
  "id": "hello-plugin",
  "name": "Hello Plugin",
  "version": "1.0.0",
  "apiVersion": "1.0.0",
  "entry": "bundle.js"
}
```

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique identifier. Lower-case ASCII + dash. Used as the folder name on Flexweg. |
| `name` | yes | Display name shown during install. |
| `version` | yes | Semver of the plugin itself. Free-form — surfaced in the admin's plugin list. |
| `apiVersion` | yes | Runtime API version this bundle was built against. The admin refuses to load if outside `[FLEXWEG_API_MIN_VERSION, FLEXWEG_API_VERSION]`. Read from `@flexweg/cms-runtime`. |
| `entry` | no | Path of the bundle relative to the package root. Defaults to `bundle.js`. |

The admin reads this file during install + at every boot to decide what to import. **`id` is immutable** — changing it after install creates a different plugin.

## bundle.js (the runtime payload)

`src/manifest.tsx` is the entry point. It must default-export a `PluginManifest` object — same shape as in-tree plugins:

```tsx
import type { PluginManifest } from "@flexweg/cms-runtime";

const manifest: PluginManifest = {
  id: "hello-plugin",
  name: "Hello Plugin",
  version: "1.0.0",
  description: "Adds a meta tag and a dashboard card.",
  author: "Acme Inc.",
  register(api) {
    api.addFilter<string>("page.head.extra", (head) => {
      return head + '<meta name="x-hello-plugin" content="external" />\n';
    });
    api.addAction("publish.complete", (post) => {
      console.log("[hello-plugin] published:", post);
    });
  },
};

export default manifest;
```

Everything you can do from an in-tree plugin works here: `addFilter`, `addAction`, `applyFilters`, `applyFiltersSync`, `doAction`, `registerBlock`, `registerDashboardCard`. See [runtime-api-reference.md](./runtime-api-reference.md) for the full hook list.

### Settings pages

Plugins that need a configuration UI declare a `settings` field on the manifest exactly like in-tree plugins. The admin renders the settings component at `/settings/plugin/<your-id>` and stores the config under `settings.pluginConfigs.<your-id>` in Firestore.

```tsx
import type { PluginManifest, PluginSettingsPageProps } from "@flexweg/cms-runtime";
import { useTranslation } from "react-i18next";

interface Config {
  greeting: string;
}

function SettingsPage({ config, save }: PluginSettingsPageProps<Config>) {
  const { t } = useTranslation("hello-plugin");
  return (
    <input
      value={config.greeting}
      onChange={(e) => save({ ...config, greeting: e.target.value })}
      placeholder={t("greetingPlaceholder")}
    />
  );
}

const manifest: PluginManifest<Config> = {
  id: "hello-plugin",
  // ...
  settings: {
    navLabelKey: "title",
    defaultConfig: { greeting: "hello" },
    component: SettingsPage,
  },
  i18n: {
    en: { title: "Hello Plugin", greetingPlaceholder: "Type a greeting…" },
    fr: { title: "Plugin Bonjour", greetingPlaceholder: "Tapez un message…" },
  },
};
```

### React, hooks, i18next

External bundles import `react`, `react-i18next`, `react-dom`, `react/jsx-runtime` and `@flexweg/cms-runtime` like normal — but they must be **externalised** at build time so they don't ship a duplicate React. See the Vite config below.

At runtime, the admin's `index.html` declares an [import-map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) that redirects each bare specifier to a tiny stub file under `/admin/runtime/` which hands back the live admin instance. This guarantees one React copy across admin and plugin (required for hooks integrity) and one i18next state (so `useTranslation` calls reach the same store as the admin).

## Build configuration

`package.json`:

```json
{
  "name": "my-plugin",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build && node scripts/pack.mjs",
    "pack": "node scripts/pack.mjs"
  },
  "devDependencies": {
    "@types/react": "^18.3.28",
    "@vitejs/plugin-react": "^4.3.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^15.2.0",
    "typescript": "^6.0.3",
    "vite": "^5.4.10"
  }
}
```

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/manifest.tsx",
      formats: ["es"],
      fileName: () => "bundle.js",
    },
    outDir: "dist",
    rollupOptions: {
      // CRITICAL: every bare specifier the admin's import-map covers
      // must be external. Otherwise Rollup would pull React + family
      // into bundle.js and you'd ship a second React → hooks crash.
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "react-i18next",
        "@flexweg/cms-runtime",
      ],
      output: {
        // Collapse any code-split chunks back into bundle.js. The admin
        // only loads bundle.js — separate chunks would 404.
        inlineDynamicImports: true,
      },
    },
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src"]
}
```

`scripts/pack.mjs` (zips `dist/bundle.js` + `manifest.json` + `README.md` into `<id>.zip`):

```js
import { createWriteStream, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf-8"));

const zip = new JSZip();
zip.file("manifest.json", readFileSync(resolve(root, "manifest.json")));
zip.file("bundle.js", readFileSync(resolve(root, "dist/bundle.js")));
const readme = resolve(root, "README.md");
if (existsSync(readme)) zip.file("README.md", readFileSync(readme));

zip
  .generateNodeStream({ type: "nodebuffer", streamFiles: true })
  .pipe(createWriteStream(resolve(root, `${manifest.id}.zip`)))
  .on("finish", () => console.log(`Packed: ${manifest.id}.zip`));
```

Install JSZip as a dev dep: `npm install -D jszip`.

## Build + install

```bash
npm install
npm run build
```

Outputs `<id>.zip`. Then in the admin: **Plugins** → **Install plugin** → pick the zip. The admin uploads the contents to `/admin/plugins/<id>/` on Flexweg, appends an entry to `/admin/external.json`, and reloads. Your plugin runs from then on — same lifecycle as in-tree plugins (toggle from /plugins, configure from /settings/plugin/<id>, etc.).

## Manual install (without the upload UI)

You can also drop the package directly via Flexweg's file manager:

1. Unzip your `.zip` into a folder named `<id>/`.
2. Upload the folder into Flexweg under `/admin/plugins/<id>/` (so the structure becomes `/admin/plugins/<id>/manifest.json`, `/admin/plugins/<id>/bundle.js`, etc.).
3. Edit `/admin/external.json` (or create it with `{ "plugins": [], "themes": [] }`) and append:
   ```json
   {
     "id": "<id>",
     "version": "1.0.0",
     "apiVersion": "1.0.0",
     "entryPath": "plugins/<id>/bundle.js"
   }
   ```
4. Reload `/admin/`. The plugin loads.

## Uninstall

In **Plugins** → **Install plugin**, the modal lists every installed external plugin with an **Uninstall** button. Clicking it deletes `/admin/plugins/<id>/` from Flexweg and removes the entry from `/admin/external.json`. The admin reloads.

## Troubleshooting

- **"plugin failed to import" in the console** — open `/admin/plugins/<id>/bundle.js` in the browser; a parse error (e.g. accidentally bundled the wrong React import) shows up in DevTools.
- **"plugin apiVersion outside supported range"** — the admin was upgraded since you built the plugin. Update `apiVersion` in your `manifest.json` after re-checking compatibility.
- **Hooks crash with "Invalid hook call. Hooks can only be called inside…"** — your bundle is shipping its own React. Double-check `external` in vite.config.ts.
- **Translations show the raw key** — confirm the manifest's `i18n` field is populated AND `useTranslation('<id>')` uses the same id as the manifest (the namespace is the plugin id).
