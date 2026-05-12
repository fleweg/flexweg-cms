---
title: Flexweg Search
slug: flexweg-search-plugin
type: post
status: draft
category: Plugins
tags: [plugin, search, client-side, static]
heroImage: 08-search.jpg
author: team@flexweg.com
excerpt: "Generates a static search index + a 5 KB runtime that opens a search modal anywhere your theme exposes a [data-cms-search] trigger. No backend."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9mbGV3ZWcvZmxleHdlZy1jbXMvcmVsZWFzZXMvZG93bmxvYWQvZmxleHdlZy1zZWFyY2gtdjEuMC4wL2ZsZXh3ZWctc2VhcmNoLnppcCIsInByZXZpZXdVcmwiOiJodHRwczovL3NlYXJjaC5kZW1vLmZsZXh3ZWcuY29tIiwiZG93bmxvYWRMYWJlbCI6IkRvd25sb2FkIiwicHJldmlld0xhYmVsIjoiTGl2ZSBQcmV2aWV3IiwiZnJlZUxhYmVsIjoiRnJlZSIsImNyZWF0b3IiOiJGbGV4d2VnIiwiY3JlYXRvclByZWZpeCI6ImJ5In0="></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOlt7InVybCI6IjA4LXNlYXJjaC5qcGciLCJhbHQiOiJGbGV4d2VnIFNlYXJjaCJ9XX0="></div>

## Description

Search without a server. The plugin builds `/search-index.json` over your published content (title always; excerpt / category / tags opt-in) and ships a tiny runtime (`/search.js`, ~5 KB) that opens a modal when a user clicks any `[data-cms-search]` element.

Pure client-side substring matching with multi-token weighting (title hits rank higher). The index is regenerated on every publish; the runtime is only re-uploaded when its bundle hash changes — so subsequent publishes only rewrite the JSON.

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjoiU3BlY2lmaWNhdGlvbnMiLCJyb3dzIjpbeyJsYWJlbCI6IlZlcnNpb24iLCJ2YWx1ZSI6IjEuMC4wIn0seyJsYWJlbCI6IkxpY2Vuc2UiLCJ2YWx1ZSI6Ik1JVCJ9LHsibGFiZWwiOiJMYXN0IFVwZGF0ZWQiLCJ2YWx1ZSI6IlRoaXMgd2VlayJ9LHsibGFiZWwiOiJSZXF1aXJlcyBGbGV4d2VnIiwidmFsdWUiOiLiiaUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjoiS2V5IEZlYXR1cmVzIiwiaXRlbXMiOlt7Imljb24iOiJzZWFyY2giLCJ0aXRsZSI6IkNsaWVudC1zaWRlIHNlYXJjaCJ9LHsiaWNvbiI6ImJvbHQiLCJ0aXRsZSI6IlN1Yi0xMDBtcyByZXN1bHRzIn0seyJpY29uIjoiZmluZF9pbl9wYWdlIiwidGl0bGUiOiJUaXRsZSArIGV4Y2VycHQgaW5kZXgifSx7Imljb24iOiJ2aWV3X2NvbXBhY3QiLCJ0aXRsZSI6Ik1vZGFsIFVJIn1dfQ=="></div>
