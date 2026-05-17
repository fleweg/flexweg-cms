// Wraps the vanilla JS + CSS assets so they're available as plain
// strings at build time. Vite inlines `?raw` imports into the bundle.
//
// The output of these getters is what gets injected into every page
// that uses at least one slider:
//   - page.head.extra → SLIDER_STYLE_TAG (a <style> block)
//   - page.body.end   → SLIDER_SCRIPT_TAG (a <script> block, idempotent
//                       via the window.__flexwegSlidersReady guard)

import cssText from "./runtime/slider.css?raw";
import jsText from "./runtime/slider.js?raw";

export const SLIDER_CSS = cssText;
export const SLIDER_JS = jsText;

export const SLIDER_STYLE_TAG = `<style data-flexweg-sliders>${cssText}</style>`;
export const SLIDER_SCRIPT_TAG = `<script data-flexweg-sliders>${jsText}</script>`;

// Side-effect helper: insert the baseline CSS into the admin document
// head exactly once so editor previews render with the same styles as
// the published page. Idempotent — repeated calls are no-ops thanks
// to the marker attribute.
export function ensureAdminSliderStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-flexweg-sliders-admin]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-flexweg-sliders-admin", "true");
  style.textContent = cssText;
  document.head.appendChild(style);
}
