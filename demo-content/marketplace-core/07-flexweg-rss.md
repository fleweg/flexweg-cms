---
title: Flexweg RSS
slug: flexweg-rss-plugin
type: post
status: draft
category: Plugins
tags: [plugin, rss, syndication, feeds]
heroImage: 07-rss.jpg
author: team@flexweg.com
excerpt: "RSS 2.0 feed generator. Site-wide feed plus optional per-category feeds, with hero image enclosures and an XSL stylesheet that renders the feed beautifully in a browser."
---
<div data-cms-block="marketplace-core/header-buttons" data-attrs="eyJkb3dubG9hZFVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vZmxld2VnL2ZsZXh3ZWctY21zL3JlbGVhc2VzL2Rvd25sb2FkL2ZsZXh3ZWctcnNzLXYxLjAuMC9mbGV4d2VnLXJzcy56aXAiLCAicHJldmlld1VybCI6ICJodHRwczovL3Jzcy5kZW1vLmZsZXh3ZWcuY29tIiwgImRvd25sb2FkTGFiZWwiOiAiRG93bmxvYWQiLCAicHJldmlld0xhYmVsIjogIkxpdmUgUHJldmlldyIsICJmcmVlTGFiZWwiOiAiRnJlZSIsICJjcmVhdG9yIjogIkZsZXh3ZWciLCAiY3JlYXRvclByZWZpeCI6ICJieSJ9"></div>
<div data-cms-block="marketplace-core/gallery" data-attrs="eyJpbWFnZXMiOiBbeyJ1cmwiOiAiMDctcnNzLmpwZyIsICJhbHQiOiAiRmxleHdlZyBSU1MifV19"></div>

## Description

**Flexweg RSS** publishes a clean RSS 2.0 feed at `/rss.xml` plus optional per-category feeds at `/<category>/<category>.xml`. Each item carries the post's title, excerpt (or a 300-character preview of the body), publication date, and — when a hero image is set — a `<enclosure>` element so RSS readers like Feedly, Inoreader, NetNewsWire, and Reeder render a thumbnail.

A shared XSL stylesheet transforms the raw XML into a styled HTML table when a human opens the feed URL in a browser, making the feed self-describing for new visitors who don't already use an RSS reader. Per-language feeds are emitted automatically when the flexweg-multilang plugin is enabled.

Footer integration: each enabled feed can be added to the site footer with one checkbox. The label is auto-generated ("RSS", "RSS — Tutorials", …).

<div data-cms-block="marketplace-core/specs" data-attrs="eyJoZWFkaW5nIjogIlNwZWNpZmljYXRpb25zIiwgInJvd3MiOiBbeyJsYWJlbCI6ICJWZXJzaW9uIiwgInZhbHVlIjogIjEuMC4wIn0sIHsibGFiZWwiOiAiTGljZW5zZSIsICJ2YWx1ZSI6ICJNSVQifSwgeyJsYWJlbCI6ICJMYXN0IFVwZGF0ZWQiLCAidmFsdWUiOiAiVGhpcyByZWxlYXNlIn0sIHsibGFiZWwiOiAiUmVxdWlyZXMgRmxleHdlZyIsICJ2YWx1ZSI6ICJcdTIyNjUgMS4wLjAifV19"></div>

<div data-cms-block="marketplace-core/features" data-attrs="eyJoZWFkaW5nIjogIktleSBGZWF0dXJlcyIsICJpdGVtcyI6IFt7Imljb24iOiAicnNzX2ZlZWQiLCAidGl0bGUiOiAiU2l0ZSArIHBlci1jYXRlZ29yeSBmZWVkcyJ9LCB7Imljb24iOiAiaW1hZ2UiLCAidGl0bGUiOiAiSGVybyBpbWFnZSBlbmNsb3N1cmVzIn0sIHsiaWNvbiI6ICJwcmV2aWV3IiwgInRpdGxlIjogIlhTTCBwcmV2aWV3IGluIGJyb3dzZXIifSwgeyJpY29uIjogInRyYW5zbGF0ZSIsICJ0aXRsZSI6ICJQZXItbG9jYWxlIGZlZWRzICh3aXRoIG11bHRpbGFuZykifV19"></div>
