# Flexweg Custom Code

Inject site-wide HTML / CSS / JS into the `<head>` or just before `</body>` of every published page. Useful for analytics tags, fonts, third-party widgets and inline overrides without having to rebuild the theme.

## What it does

The plugin adds a **Custom code** tab to admin Settings with two free-form code editors:

- **Head** — appended at the bottom of every page's `<head>`. Drop tracking pixels, Google Tag Manager, OpenGraph overrides, custom `<style>` blocks here.
- **Body end** — appended just before `</body>`. Best place for deferred scripts that need the DOM to be parsed (chat widgets, late-loaded analytics, custom JS handlers).

Each zone runs through a CodeMirror editor with HTML/CSS/JS syntax highlighting, line numbers, bracket matching and an Expand button for full-screen editing.

## How it integrates

Code is injected on **every published page** via the publisher's `page.head.extra` and `page.body.end` hooks. No transformation, no sanitisation — what you save is what visitors get.

Empty zones produce zero output (no extra whitespace, no empty `<style>` tags, no comments). Only zones with content actually emit anything on the published page.

## Common use cases

- **Google Analytics 4** — paste the GA snippet in **Head**.
- **Plausible / Fathom / Umami** — single `<script>` in **Head**.
- **Custom font from your own CDN** — `<link rel="stylesheet">` + a `<style>` overriding `font-family` in **Head**.
- **Cookie banner** — `<script>` in **Body end** (so the DOM is ready before it tries to inject UI).
- **Live chat widget** — Crisp / Intercom / Tidio script in **Body end**.
- **A/B testing tool** — bootstrap script in **Head** (most A/B vendors require this).

## Security note

Anything you paste here runs as-is on every visitor's browser. **There is no sanitisation**. Don't paste code from untrusted sources, and review carefully before saving — a malformed `<script>` can break every page on the site at once.

The plugin doesn't have rollback or version history. If you want a safety net, copy the previous content elsewhere before saving a big change.

## When to disable it

Disable if your site ships everything through theme assets and you want a tighter Settings tab list. Disabling stops the head / body-end injection on the next publish. Already-published pages keep whatever code they were built with until they're republished.
