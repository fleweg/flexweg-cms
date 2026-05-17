# Flexweg Sliders

External plugin for Flexweg CMS. Adds four slider/carousel blocks to the post & page editor:

| Block | Use case |
|---|---|
| **Image slider** | Photo galleries, screenshot showcases — captions, optional links, configurable aspect ratio |
| **Hero slider** | Full-bleed hero banners — background image + headline + CTA per slide |
| **Card slider** | Service cards, testimonials, related articles — multi-card-per-view with arrows + dots |
| **Logo carousel** | Partners / press logos — infinite CSS marquee, no controls |

## Install

1. Run `npm install --legacy-peer-deps` once.
2. `npm run build` — outputs `flexweg-sliders.zip`.
3. In Flexweg admin → **Plugins** → **Install plugin** → drop the zip → enable.

## How it works

Each block emits a single marker in the markdown body:

```html
<div data-cms-block="flexweg-sliders/<kind>" data-attrs="<base64-json>"></div>
```

At publish time the `post.html.body` filter expands every marker into rich HTML. A second pair of filters (`page.head.extra` / `page.body.end`) injects the runtime CSS + vanilla-JS carousel exactly once per page — only on pages that actually use a slider.

Each slider container exposes its options via `data-*` attributes (`data-autoplay`, `data-interval`, `data-loop`, `data-per-view`, …) so the runtime stays small and easy to inspect.

## Authoring

Insert from the `/` block menu in the editor — sliders appear under the **Media** category. Open the right-hand **Block** tab to add / reorder / remove slides and tweak per-slider options (autoplay, dots, arrows, aspect ratio, etc.). Images are picked from the regular media library via `MediaPicker`.

## Theme integration

The plugin ships its own baseline CSS in a single `<style data-flexweg-sliders>` tag, scoped to `.fws*` class names. Themes can override any rule with higher-specificity selectors (e.g. `.fws-card .fws-card-title` for typography, `.fws-arrows .fws-prev` for control appearance).

## Runtime details

- Carousel JS guard: `window.__flexwegSlidersReady` prevents double-initialization if a page accidentally embeds the script twice.
- Autoplay pauses when the slider is offscreen (`IntersectionObserver`) or hovered/focused.
- Swipe gestures use Pointer Events (works on touch + mouse drag).
- Keyboard: ← / → navigate when the slider has focus.
- Reduced motion: `prefers-reduced-motion: reduce` disables both the carousel transition and the logo marquee animation.

## Development

```
npm install --legacy-peer-deps
npm run build      # vite build + zip
npm run pack       # zip only (after a build)
```

Hot-reload while developing: rebuild + reinstall the zip. The admin's runtime loader appends `?v=<version>` so bumping `manifest.json`'s `version` invalidates the browser cache. For unmodified versions, hard-refresh the admin (Cmd+Shift+R).
