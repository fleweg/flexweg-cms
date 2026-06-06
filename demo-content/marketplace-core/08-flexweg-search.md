---
title: Flexweg Search
slug: flexweg-search-plugin
type: post
status: draft
category: Plugins
tags: [plugin, search, client-side, modal, ux]
heroImage: 08-search.jpg
author: team@flexweg.com
excerpt: "Client-side fuzzy search. Pre-builds an index at publish time, opens a Cmd/Ctrl-K modal on click, results jump to the matching post — no backend, no API key, no external service."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vZmxld2VnL2ZsZXh3ZWctY21zL3JlbGVhc2VzL2Rvd25sb2FkL2ZsZXh3ZWctc2VhcmNoLXYxLjAuMC9mbGV4d2VnLXNlYXJjaC56aXAiLCAicHJldmlld1VybCI6ICJodHRwczovL3NlYXJjaC5kZW1vLmZsZXh3ZWcuY29tIiwgImRvd25sb2FkTGFiZWwiOiAiRG93bmxvYWQiLCAicHJldmlld0xhYmVsIjogIkxpdmUgUHJldmlldyIsICJmcmVlTGFiZWwiOiAiRnJlZSIsICJjcmVhdG9yIjogIkZsZXh3ZWciLCAiY3JlYXRvclByZWZpeCI6ICJieSJ9"></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOiBbeyJ1cmwiOiAiMDgtc2VhcmNoLmpwZyIsICJhbHQiOiAiRmxleHdlZyBTZWFyY2gifV19"></div>

## Description

**Flexweg Search** ships a complete search experience that runs entirely in the visitor's browser. At publish time the plugin builds a compact JSON index at `/search-index.json` containing every post's title, excerpt, and category. Any element on the page with `data-cms-search` (every theme's search input qualifies) attaches a click handler that opens a centered modal — Cmd/Ctrl + K also triggers it from anywhere on the site.

The modal does fuzzy matching against the index with sensible defaults: matches on title weighted higher than excerpt, primary term shown next to each result, keyboard nav (↑/↓ + Enter) wired up. Clicking a result navigates to the post.

Because the index is fetched once and cached, search stays instant even on slow connections. The plugin never phones home, never embeds a third-party widget, and never needs an API key — perfect for sites that care about privacy and self-hosting.

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjogIlNwZWNpZmljYXRpb25zIiwgInJvd3MiOiBbeyJsYWJlbCI6ICJWZXJzaW9uIiwgInZhbHVlIjogIjEuMC4wIn0sIHsibGFiZWwiOiAiTGljZW5zZSIsICJ2YWx1ZSI6ICJNSVQifSwgeyJsYWJlbCI6ICJMYXN0IFVwZGF0ZWQiLCAidmFsdWUiOiAiVGhpcyByZWxlYXNlIn0sIHsibGFiZWwiOiAiUmVxdWlyZXMgRmxleHdlZyIsICJ2YWx1ZSI6ICJcdTIyNjUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjogIktleSBGZWF0dXJlcyIsICJpdGVtcyI6IFt7Imljb24iOiAic2VhcmNoIiwgInRpdGxlIjogIkNtZC9DdHJsLUsgbW9kYWwifSwgeyJpY29uIjogImJvbHQiLCAidGl0bGUiOiAiUHJlLWJ1aWx0IHN0YXRpYyBpbmRleCJ9LCB7Imljb24iOiAia2V5Ym9hcmQiLCAidGl0bGUiOiAiRnVsbCBrZXlib2FyZCBuYXZpZ2F0aW9uIn0sIHsiaWNvbiI6ICJsb2NrIiwgInRpdGxlIjogIlByaXZhY3ktZnJpZW5kbHkgKG5vIEFQSSkifV19"></div>
