---
title: Flexweg RSS
slug: flexweg-rss-plugin
type: post
status: draft
category: Plugins
tags: [plugin, rss, feeds, syndication]
heroImage: 07-rss.jpg
author: team@flexweg.com
excerpt: "Generates an RSS 2.0 feed at /rss.xml plus optional per-category feeds. Auto-injects entries in the site footer."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9mbGV3ZWcvZmxleHdlZy1jbXMvcmVsZWFzZXMvZG93bmxvYWQvZmxleHdlZy1yc3MtdjEuMC4wL2ZsZXh3ZWctcnNzLnppcCIsInByZXZpZXdVcmwiOiJodHRwczovL3Jzcy5kZW1vLmZsZXh3ZWcuY29tIiwiZG93bmxvYWRMYWJlbCI6IkRvd25sb2FkIiwicHJldmlld0xhYmVsIjoiTGl2ZSBQcmV2aWV3IiwiZnJlZUxhYmVsIjoiRnJlZSIsImNyZWF0b3IiOiJGbGV4d2VnIiwiY3JlYXRvclByZWZpeCI6ImJ5In0="></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOlt7InVybCI6IjA3LXJzcy5qcGciLCJhbHQiOiJGbGV4d2VnIFJTUyJ9XX0="></div>

## Description

A first-class RSS pipeline for static sites. RSS generates:

- A site-wide `/rss.xml` feed listing every published post
- Optional per-category feeds at `/<category>/<category>.xml`
- `<enclosure>` tags pointing at each post's hero image variant
- A styled XSL stylesheet so subscribers who open the feed in a browser see a readable HTML view

The plugin auto-attaches footer entries for every feed where `addToFooter === true` — no MenusPage tweaking required. Saves a feed every publish, but skips when nothing changes.

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjoiU3BlY2lmaWNhdGlvbnMiLCJyb3dzIjpbeyJsYWJlbCI6IlZlcnNpb24iLCJ2YWx1ZSI6IjEuMC4wIn0seyJsYWJlbCI6IkxpY2Vuc2UiLCJ2YWx1ZSI6Ik1JVCJ9LHsibGFiZWwiOiJMYXN0IFVwZGF0ZWQiLCJ2YWx1ZSI6IlRoaXMgd2VlayJ9LHsibGFiZWwiOiJSZXF1aXJlcyBGbGV4d2VnIiwidmFsdWUiOiLiiaUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjoiS2V5IEZlYXR1cmVzIiwiaXRlbXMiOlt7Imljb24iOiJyc3NfZmVlZCIsInRpdGxlIjoiUlNTIDIuMCBmZWVkIn0seyJpY29uIjoiY2F0ZWdvcnkiLCJ0aXRsZSI6IlBlci1jYXRlZ29yeSBmZWVkcyJ9LHsiaWNvbiI6ImF0dGFjaF9maWxlIiwidGl0bGUiOiJFbmNsb3N1cmUgdGFncyJ9LHsiaWNvbiI6ImJvb2ttYXJrIiwidGl0bGUiOiJBdXRvIGZvb3RlciBlbnRyaWVzIn1dfQ=="></div>
