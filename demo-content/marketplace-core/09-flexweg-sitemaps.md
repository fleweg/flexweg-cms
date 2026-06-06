---
title: Flexweg Sitemaps
slug: flexweg-sitemaps-plugin
type: post
status: draft
category: Plugins
tags: [plugin, sitemaps, seo, robots, news]
heroImage: 09-sitemaps.jpg
author: team@flexweg.com
excerpt: "Generates yearly sitemaps, a sitemap index, an optional Google News sitemap, and a configurable robots.txt. Incremental — only the touched year regenerates on each publish."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vZmxld2VnL2ZsZXh3ZWctY21zL3JlbGVhc2VzL2Rvd25sb2FkL2ZsZXh3ZWctc2l0ZW1hcHMtdjEuMC4wL2ZsZXh3ZWctc2l0ZW1hcHMuemlwIiwgInByZXZpZXdVcmwiOiAiaHR0cHM6Ly9zaXRlbWFwcy5kZW1vLmZsZXh3ZWcuY29tIiwgImRvd25sb2FkTGFiZWwiOiAiRG93bmxvYWQiLCAicHJldmlld0xhYmVsIjogIkxpdmUgUHJldmlldyIsICJmcmVlTGFiZWwiOiAiRnJlZSIsICJjcmVhdG9yIjogIkZsZXh3ZWciLCAiY3JlYXRvclByZWZpeCI6ICJieSJ9"></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOiBbeyJ1cmwiOiAiMDktc2l0ZW1hcHMuanBnIiwgImFsdCI6ICJGbGV4d2VnIFNpdGVtYXBzIn1dfQ=="></div>

## Description

**Flexweg Sitemaps** writes Google-compliant XML sitemaps to `/sitemaps/sitemap-<year>.xml`, a top-level `sitemaps/sitemap-index.xml` referencing each year, and — optionally — a Google News sitemap covering the last 1–30 days of articles. A configurable `robots.txt` at the site root advertises the sitemap index to crawlers.

Two XSL stylesheets transform the raw XML into clean HTML tables when opened in a browser, so the sitemaps are usable for both humans and bots. Per-locale variants are emitted automatically when the flexweg-multilang plugin is enabled.

Performance: the plugin runs incrementally on every publish — only the year sitemap containing the touched post + the index regenerate, not the whole catalog. Years that empty out have their sitemap deleted from the public site so the index never points at stale files.

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjogIlNwZWNpZmljYXRpb25zIiwgInJvd3MiOiBbeyJsYWJlbCI6ICJWZXJzaW9uIiwgInZhbHVlIjogIjEuMC4wIn0sIHsibGFiZWwiOiAiTGljZW5zZSIsICJ2YWx1ZSI6ICJNSVQifSwgeyJsYWJlbCI6ICJMYXN0IFVwZGF0ZWQiLCAidmFsdWUiOiAiVGhpcyByZWxlYXNlIn0sIHsibGFiZWwiOiAiUmVxdWlyZXMgRmxleHdlZyIsICJ2YWx1ZSI6ICJcdTIyNjUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjogIktleSBGZWF0dXJlcyIsICJpdGVtcyI6IFt7Imljb24iOiAiYWNjb3VudF90cmVlIiwgInRpdGxlIjogIlllYXJseSBzaXRlbWFwcyArIGluZGV4In0sIHsiaWNvbiI6ICJuZXdzcGFwZXIiLCAidGl0bGUiOiAiR29vZ2xlIE5ld3Mgc2l0ZW1hcCAob3B0aW9uYWwpIn0sIHsiaWNvbiI6ICJzbWFydF90b3kiLCAidGl0bGUiOiAiRWRpdGFibGUgcm9ib3RzLnR4dCJ9LCB7Imljb24iOiAidHJhbnNsYXRlIiwgInRpdGxlIjogIlBlci1sb2NhbGUgdmFyaWFudHMgKG11bHRpbGFuZykifV19"></div>
