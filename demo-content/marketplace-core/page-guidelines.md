---
title: Compatibility & Versioning
slug: guidelines
type: page
status: draft
seoTitle: Compatibility & Versioning — Flexweg CMS Marketplace
seoDescription: How Flexweg's first-party themes and plugins are versioned and kept compatible with the CMS.
excerpt: "How Flexweg's themes and plugins are versioned and kept compatible with the CMS."
---

# Compatibility & versioning

Everything in this marketplace is shipped by Flexweg and lives in the same repository as the CMS itself: [github.com/fleweg/flexweg-cms](https://github.com/fleweg/flexweg-cms). This page covers how versions, compatibility windows, and upgrades are handled.

## API contract

Each theme and plugin declares an `apiVersion` in its `manifest.json`. The admin validates it against `[FLEXWEG_API_MIN_VERSION, FLEXWEG_API_VERSION]` at install time AND on every boot — incompatible bundles are skipped with a console warning instead of crashing the admin.

## Versioning scheme

We follow semver:

- **Major** — breaking API change (e.g. a hook signature removed); listings ship a new major when migrating
- **Minor** — additive features (new blocks, new settings tabs)
- **Patch** — bug fixes only

The current Flexweg CMS API range is exposed at runtime via the `FLEXWEG_API_VERSION` and `FLEXWEG_API_MIN_VERSION` constants — see [docs/runtime-api-reference.md](https://github.com/fleweg/flexweg-cms/blob/master/docs/runtime-api-reference.md).

## Release artifacts

Each release on the main repository tags a version-specific asset:

- Plugins: `https://github.com/fleweg/flexweg-cms/releases/download/<plugin-id>-vX.Y.Z/<plugin-id>.zip`
- Themes: `https://github.com/fleweg/flexweg-cms/releases/download/<theme-id>-vX.Y.Z/<theme-id>.zip`

The **Download** button on every listing points at the latest tag. Pin a specific version by replacing the tag in the URL.

## Upgrade flow

1. Download the new `.zip` from the listing
2. Drag it into the admin's **Install** modal — the in-place upgrade flow auto-detects the existing install, replaces the bundle, and preserves your settings
3. Click **Sync theme assets** on themes (themes ship their CSS separately at `/theme-assets/<id>.css`)
4. Republish affected posts if the upgrade includes template changes

## Maintenance commitment

The Flexweg team maintains every listing in this marketplace. We:

- Update themes/plugins within 30 days of a CMS API bump
- Respond to issues on the main repository within 5 working days
- Honor a 60-day deprecation window before removing any public API

Major version bumps are communicated through the [releases page](https://github.com/fleweg/flexweg-cms/releases) and the changelog post on this marketplace.
