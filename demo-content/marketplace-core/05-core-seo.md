---
title: Core SEO
slug: flexweg-core-seo
type: post
status: draft
category: Plugins
tags: [plugin, seo, meta, open-graph, twitter-cards]
heroImage: 05-seo.jpg
author: team@flexweg.com
excerpt: "Adds Twitter Cards, Open Graph metadata, and a generator hint to every published page. Zero configuration — drop it in and forget it."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vZmxld2VnL2ZsZXh3ZWctY21zL3JlbGVhc2VzL2Rvd25sb2FkL2NvcmUtc2VvLXYxLjAuMC9jb3JlLXNlby56aXAiLCAicHJldmlld1VybCI6ICJodHRwczovL2NvcmUtc2VvLmRlbW8uZmxleHdlZy5jb20iLCAiZG93bmxvYWRMYWJlbCI6ICJEb3dubG9hZCIsICJwcmV2aWV3TGFiZWwiOiAiTGl2ZSBQcmV2aWV3IiwgImZyZWVMYWJlbCI6ICJGcmVlIiwgImNyZWF0b3IiOiAiRmxleHdlZyIsICJjcmVhdG9yUHJlZml4IjogImJ5In0="></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOiBbeyJ1cmwiOiAiMDUtc2VvLmpwZyIsICJhbHQiOiAiQ29yZSBTRU8ifV19"></div>

## Description

**Core SEO** is the minimum-viable social + crawler metadata layer for any Flexweg site. Every published page receives:

- `<meta name="twitter:card" content="summary_large_image" />` plus the matching `twitter:image`, `twitter:title`, `twitter:description` derived from each post's frontmatter and hero image
- A complete Open Graph block (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) so links shared on Slack, Discord, Facebook, LinkedIn render with a proper preview card
- `<meta name="generator" content="Flexweg CMS" />` so site-monitoring tools and security scanners can detect the platform

Built-in. No settings page. Toggle the plugin on and forget about it — the next regenerate pushes the new tags to every page.

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjogIlNwZWNpZmljYXRpb25zIiwgInJvd3MiOiBbeyJsYWJlbCI6ICJWZXJzaW9uIiwgInZhbHVlIjogIjEuMC4wIn0sIHsibGFiZWwiOiAiTGljZW5zZSIsICJ2YWx1ZSI6ICJNSVQifSwgeyJsYWJlbCI6ICJMYXN0IFVwZGF0ZWQiLCAidmFsdWUiOiAiVGhpcyByZWxlYXNlIn0sIHsibGFiZWwiOiAiUmVxdWlyZXMgRmxleHdlZyIsICJ2YWx1ZSI6ICJcdTIyNjUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjogIktleSBGZWF0dXJlcyIsICJpdGVtcyI6IFt7Imljb24iOiAic2hhcmUiLCAidGl0bGUiOiAiVHdpdHRlciBDYXJkIHRhZ3MifSwgeyJpY29uIjogInB1YmxpYyIsICJ0aXRsZSI6ICJPcGVuIEdyYXBoIG1ldGFkYXRhIn0sIHsiaWNvbiI6ICJkZXNjcmlwdGlvbiIsICJ0aXRsZSI6ICJNZXRhIGRlc2NyaXB0aW9uIn0sIHsiaWNvbiI6ICJ0YWciLCAidGl0bGUiOiAiR2VuZXJhdG9yIGhpbnQifV19"></div>
