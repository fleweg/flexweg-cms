---
title: Submission Guidelines
slug: guidelines
type: page
status: draft
seoTitle: Guidelines — Flexweg CMS Marketplace
seoDescription: How to package a theme or plugin for the official Flexweg CMS marketplace.
excerpt: "How to package a theme or plugin for the official Flexweg CMS marketplace."
---

# Submission Guidelines

This page documents the contract every theme and plugin in this marketplace agrees to follow. It's not a barrier — it's a small set of practices that keep installs predictable and uninstalls clean.

## Plugin checklist

- A valid `manifest.json` with `id`, `name`, `version`, `apiVersion`, and `entry` fields.
- The bundle must externalize `react`, `react-dom`, `react-i18next`, and `@flexweg/cms-runtime` — never duplicate React in your build.
- Settings page registered via `manifest.settings`; the page is mounted at `/admin/#/settings/plugin/<id>`.
- i18n bundles via `manifest.i18n = { en, fr, … }`. English is required; other locales are encouraged.
- If the plugin uploads to Flexweg, route every write through the dispatcher exports (`uploadFile`, `deleteFile`, …) so the standard error toasts apply.

## Theme checklist

- Six templates exported from the manifest: `base`, `home`, `single`, `category`, `author`, `notFound`.
- `BaseLayout` MUST emit both sentinels: `<meta name="x-cms-head-extra" />` in `<head>` and `<script type="application/x-cms-body-end" />` before `</body>`. Plugins inject head + body content through these.
- Templates accept serializable props only — no Firestore reads, no admin context.
- Multi-language support: read `currentLocale` in `BaseLayout`, use `site.homePath` for the brand link, prefix internal hard-coded URLs with the locale, and pick per-language menu labels from `ResolvedMenuItem.labels`.

## Naming + licensing

- Use a unique kebab-case id (e.g. `acme-newsletter`) — the id is immutable after install.
- License under MIT (or any OSI-approved permissive license).
- Add a `README.md` to the bundle with install + configuration notes — admins read it from the Plugins page.
