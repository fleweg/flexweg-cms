# Flexweg CMS — Documentation

Authoring guides for **external** plugins and themes — packages that get distributed as a ZIP, dropped into the admin via the **Install** UI (or directly into Flexweg under `/admin/plugins/<id>/` or `/admin/themes/<id>/`), and loaded at runtime.

External authoring lives alongside the existing in-tree authoring (folders under `src/plugins/` and `src/themes/` — see the main `README.md`). Both styles share the same hook API and theme manifest shape; the difference is purely about how the bundle reaches the admin:

| | In-tree | External |
|---|---|---|
| Location | `src/plugins/<id>/` or `src/themes/<id>/` in this repo | Anywhere, packaged as a `.zip` |
| Build | Bundled into `dist/admin/` by the admin's `npm run build` | The author runs their own `npm run build`; the admin loads the result via `import()` |
| Distribution | Source code committed to this repo | A `.zip` distributed independently of the admin |
| Add / remove | Code change + redeploy of the admin | Upload the ZIP from the admin, or drop the folder directly via Flexweg |

## Reading order

1. **[creating-a-plugin.md](./creating-a-plugin.md)** — how to author, build, and ship an external plugin.
2. **[creating-a-theme.md](./creating-a-theme.md)** — same, for themes.
3. **[runtime-api-reference.md](./runtime-api-reference.md)** — the public surface external bundles use (`@flexweg/cms-runtime` exports, hook list, manifest shapes).

## Working examples

Ready-to-build scaffolds live under `external/` in the main repo. External themes are grouped under `external/themes/<id>/` and external plugins under `external/plugins/<id>/`, where `<id>` matches each bundle's `manifest.id`:

- `external/plugins/hello-plugin/` — minimal plugin: head meta tag + dashboard card.
- `external/themes/minimal-theme/` — minimal theme: six templates + a hand-written stylesheet.
- `external/themes/marketplace-core/` — full theme: app-store style marketplace listing themes + plugins, with custom blocks, settings page, font + palette overrides.

All follow the conventions described in the docs and are good copy-from-here starting points.

## AI authoring skill

For developers using Claude Code (or any AI assistant that supports skill files), this repo ships a self-contained skill at [`.claude/skills/flexweg/SKILL.md`](../.claude/skills/flexweg/SKILL.md). It packages the most important Flexweg constraints (externalize React, BaseLayout sentinels, manifest shapes, hook reference, common gotchas) into a single document — useful both as a Claude Code skill (auto-loads when working in this repo, invokable via `/flexweg`) and as a portable reference you can paste into any other AI assistant.

To use it in your own project outside this repo, copy the entire `.claude/skills/flexweg/` folder (including its `SKILL.md`) into your project's `.claude/skills/` directory, or into `~/.claude/skills/` for global availability across every project.
