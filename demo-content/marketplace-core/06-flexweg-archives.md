---
title: Flexweg Archives
slug: flexweg-archives-plugin
type: post
status: draft
category: Plugins
tags: [plugin, archives, navigation, static]
heroImage: 06-archives.jpg
author: team@flexweg.com
excerpt: "Generates static archive pages grouped by year, month, or ISO week. Adds a 'See full archives' link to the home and category listings — a static-friendly alternative to infinite scroll."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vZmxld2VnL2ZsZXh3ZWctY21zL3JlbGVhc2VzL2Rvd25sb2FkL2ZsZXh3ZWctYXJjaGl2ZXMtdjEuMC4wL2ZsZXh3ZWctYXJjaGl2ZXMuemlwIiwgInByZXZpZXdVcmwiOiAiaHR0cHM6Ly9hcmNoaXZlcy5kZW1vLmZsZXh3ZWcuY29tIiwgImRvd25sb2FkTGFiZWwiOiAiRG93bmxvYWQiLCAicHJldmlld0xhYmVsIjogIkxpdmUgUHJldmlldyIsICJmcmVlTGFiZWwiOiAiRnJlZSIsICJjcmVhdG9yIjogIkZsZXh3ZWciLCAiY3JlYXRvclByZWZpeCI6ICJieSJ9"></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOiBbeyJ1cmwiOiAiMDYtYXJjaGl2ZXMuanBnIiwgImFsdCI6ICJGbGV4d2VnIEFyY2hpdmVzIn1dfQ=="></div>

## Description

**Flexweg Archives** rebuilds the WordPress archive widget on top of static publishing. Choose a granularity (year, month, ISO week) and the plugin generates `/archives/<period>/index.html` pages listing every post that falls in that window. The pages are linked from a sticky "Archives" hub at `/archives/index.html` and surfaced via a "See full archives" CTA on the home + every category archive.

Multilang-aware: when the flexweg-multilang plugin is enabled, each archive page is rendered per locale under `/<lang>/archives/…`, with localized period labels (e.g. "May 2026" vs "mai 2026") sourced from each theme's i18n bundle.

Why use it: large blogs and publications need a navigable history that doesn't depend on JavaScript scroll or expensive search. Static archive pages get indexed by Google, deep-link cleanly, and survive any host.

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjogIlNwZWNpZmljYXRpb25zIiwgInJvd3MiOiBbeyJsYWJlbCI6ICJWZXJzaW9uIiwgInZhbHVlIjogIjEuMC4wIn0sIHsibGFiZWwiOiAiTGljZW5zZSIsICJ2YWx1ZSI6ICJNSVQifSwgeyJsYWJlbCI6ICJMYXN0IFVwZGF0ZWQiLCAidmFsdWUiOiAiVGhpcyByZWxlYXNlIn0sIHsibGFiZWwiOiAiUmVxdWlyZXMgRmxleHdlZyIsICJ2YWx1ZSI6ICJcdTIyNjUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjogIktleSBGZWF0dXJlcyIsICJpdGVtcyI6IFt7Imljb24iOiAiY2FsZW5kYXJfbW9udGgiLCAidGl0bGUiOiAiWWVhciAvIG1vbnRoIC8gd2VlayBncmFudWxhcml0eSJ9LCB7Imljb24iOiAiaGlzdG9yeSIsICJ0aXRsZSI6ICJTdGF0aWMsIGluZGV4YWJsZSBwYWdlcyJ9LCB7Imljb24iOiAidHJhbnNsYXRlIiwgInRpdGxlIjogIk11bHRpbGFuZy1hd2FyZSJ9LCB7Imljb24iOiAibGluayIsICJ0aXRsZSI6ICJBdXRvLWxpbmtlZCBmcm9tIGhvbWUgKyBjYXRlZ29yaWVzIn1dfQ=="></div>
