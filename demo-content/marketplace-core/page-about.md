---
title: About the Marketplace
slug: about
type: page
status: draft
seoTitle: About — Flexweg CMS Marketplace
seoDescription: The official directory of first-party themes and plugins for Flexweg CMS.
excerpt: "The official directory of first-party themes and plugins for Flexweg CMS."
---

# About this marketplace

This is the official Flexweg CMS marketplace — a directory of first-party themes and plugins published and maintained by the Flexweg team. Everything listed here is free, open source, and follows the documented Flexweg CMS API contract.

## What's listed

Two categories, both shipped by Flexweg:

- **Themes** — install via the admin's *Themes → Install theme* modal (drag-and-drop a `.zip`)
- **Plugins** — install via *Plugins → Install plugin* the same way

Every listing points at a GitHub release URL for download and a hosted demo URL for previewing.

## Versioning

Each plugin and theme version is tracked in this repository under its own folder:

- Plugins: `external/plugins/<id>/<id>.zip`
- Themes: `external/themes/<id>/<id>.zip`

The download URLs in this marketplace resolve to GitHub release assets tagged `<id>-vX.Y.Z`, so you can pin a specific version if you need stability across deployments.

## Support

Bug reports, feature requests, and contributions all happen on the main repository: [github.com/fleweg/flexweg-cms](https://github.com/fleweg/flexweg-cms). The repo issue tracker is the canonical channel — please don't email individual maintainers.
