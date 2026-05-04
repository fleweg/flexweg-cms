---
title: About this site
slug: about
type: page
category: About
seoTitle: About — Flexweg CMS demo
seoDescription: Information about the site, the team, and how to get in touch.
---

# About

Pages are imported with `type: page` instead of `post`. They share most of the schema with posts but show up in the **Pages** admin section and don't appear in chronological listings (home, category archives, RSS feeds).

## Common page use cases

- About / Team / Contact
- Privacy policy / Terms of service
- Landing pages bound to the home (configurable in **Settings → Site → Home content**)

The default category resolution still works on pages — handy if you want to group statics under a "Legal" category in the admin without exposing them in archives.

## What this page tests

Two things: (1) `type: page` actually produces a Page (not a Post) in your CMS, and (2) the slug `/about.html` is reachable after publish.
