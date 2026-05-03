# Flexweg Favicon

Generates every favicon variant a modern browser, mobile OS or PWA installer might ask for — from a single source image.

## What it does

You upload one square image (PNG, JPG, WebP or SVG) once. The plugin processes it in the browser and uploads the following files to `/favicon/` on your Flexweg site:

- **`favicon-96x96.png`** — modern browsers' tab icon at high DPI.
- **`favicon.ico`** — classic 16/32/48 multi-size icon for legacy browsers.
- **`favicon.svg`** — only when the source is itself an SVG (the plugin can't vectorize a raster).
- **`apple-touch-icon.png`** — 180×180 home-screen icon for iOS Safari, with a white background to match Apple's masking expectations.
- **`web-app-manifest-192x192.png` and `web-app-manifest-512x512.png`** — PWA install icons referenced by the manifest.
- **`site.webmanifest`** — Progressive Web App manifest declaring the icons, name, theme color and display mode.

The plugin then injects the matching `<link>` tags into every published page's `<head>` so browsers pick everything up automatically. URLs carry a cache-busting `?v=<timestamp>` query string — replacing the source image immediately invalidates the old icons.

## Settings

Reachable via **Plugins → Configure**.

### Source image

- **Upload** — picks the image and triggers regeneration of every variant in one pass.
- **Remove** — wipes every favicon file from your Flexweg site.

The settings page shows a status grid of which variants exist on the public site so you can see at a glance whether the upload completed cleanly.

### PWA

Inputs that go straight into `site.webmanifest`:

- **Name** / **Short name** — labels shown by Android/Chrome's "Add to home screen" prompt.
- **Theme color** — color of the browser/OS chrome around your installed PWA.
- **Background color** — splash screen color shown while the app boots.
- **Display mode** — `standalone` (default, recommended), `minimal-ui`, `fullscreen`, or `browser`.

Changing PWA fields re-uploads only `site.webmanifest` — the icons don't get re-generated. Fast iteration on copy without touching the source image.

## Best practices

- **Source image**: use a square master at 1024×1024 minimum. Larger is fine, the plugin downsizes; smaller works but the larger PWA icon variant will lose sharpness.
- **SVG**: prefer SVG when possible — gets passed through as-is for the `favicon.svg` browsers, no quality loss at any zoom.
- **Background**: the source image should NOT have a transparent background if you want a clean Apple touch icon — Safari historically replaced transparent areas with black on home screens. The plugin compensates by adding a white background to the apple-touch variant only; PWA variants stay transparent.

## When to disable it

Disable if you maintain favicons by hand (e.g. you have a legacy `/favicon.ico` and prefer not to overwrite it). Disabling stops the head injection but does **not** delete already-uploaded files.
