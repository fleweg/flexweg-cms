// Vanilla JS runtime for the flexweg-sliders plugin. Inlined by the
// page.body.end filter as a single <script> tag on every page that
// uses at least one slider block. No dependencies, no framework — just
// querySelectorAll + addEventListener + a CSS transform on the track.
//
// Sliders to initialize:
//   - [data-cms-slider="image"]  → fade or slide carousel with controls
//   - [data-cms-slider="hero"]   → same logic as image, full-bleed
//   - [data-cms-slider="card"]   → multi-slide-per-view carousel
//   - [data-cms-slider="logo"]   → infinite CSS marquee (no JS state)
//
// Each slider container exposes its config through data-* attrs:
//   data-autoplay="1" data-interval="5000" data-loop="1"

(function () {
  if (typeof document === "undefined") return;
  if (window.__flexwegSlidersReady) return;
  window.__flexwegSlidersReady = true;

  // Helpers — short names chosen to avoid the dollar-sign identifier.
  // String.prototype.replace in older versions of the admin's render
  // pipeline treats certain dollar-sign sequences in replacement
  // strings as special escapes, so plugin-injected JS that uses such
  // sequences (in identifiers OR comments) can be silently rewritten.
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function attrBool(el, name) { var v = el.getAttribute(name); return v === "1" || v === "true"; }
  function attrInt(el, name, fallback) { var n = parseInt(el.getAttribute(name) || "", 10); return isNaN(n) ? fallback : n; }

  function initCarousel(root) {
    var track = q(".fws-track", root);
    if (!track) return;
    var slides = qa(".fws-slide", track);
    if (slides.length === 0) return;

    var perView = Math.max(1, attrInt(root, "data-per-view", 1));
    var loop = attrBool(root, "data-loop");
    var autoplay = attrBool(root, "data-autoplay");
    var interval = Math.max(1500, attrInt(root, "data-interval", 5000));
    var maxIndex = Math.max(0, slides.length - perView);
    var index = 0;
    var timer = null;
    var isPointerDown = false;
    var startX = 0;
    var deltaX = 0;

    var dotsHost = q(".fws-dots", root);
    var dots = dotsHost ? qa("button", dotsHost) : [];
    var prevBtn = q(".fws-prev", root);
    var nextBtn = q(".fws-next", root);

    function clamp(i) {
      if (loop) {
        if (i < 0) return maxIndex;
        if (i > maxIndex) return 0;
        return i;
      }
      return Math.max(0, Math.min(maxIndex, i));
    }

    function apply() {
      var pct = (100 / perView) * index;
      track.style.transform = "translate3d(-" + pct + "%, 0, 0)";
      slides.forEach(function (s, i) {
        var active = i >= index && i < index + perView;
        s.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (d, i) {
        if (i === index) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
      if (prevBtn) prevBtn.disabled = !loop && index <= 0;
      if (nextBtn) nextBtn.disabled = !loop && index >= maxIndex;
    }

    function go(i) {
      index = clamp(i);
      apply();
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    if (prevBtn) prevBtn.addEventListener("click", function () { stopAuto(); prev(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stopAuto(); next(); });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { stopAuto(); go(i); });
    });

    // Keyboard: left/right arrows when slider focused.
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") { stopAuto(); prev(); ev.preventDefault(); }
      else if (ev.key === "ArrowRight") { stopAuto(); next(); ev.preventDefault(); }
    });

    // Swipe (pointer events — covers touch + mouse drag).
    track.addEventListener("pointerdown", function (ev) {
      isPointerDown = true;
      startX = ev.clientX;
      deltaX = 0;
      track.style.transition = "none";
      try { track.setPointerCapture(ev.pointerId); } catch (_e) {}
    });
    track.addEventListener("pointermove", function (ev) {
      if (!isPointerDown) return;
      deltaX = ev.clientX - startX;
      var w = track.getBoundingClientRect().width || 1;
      var pct = (100 / perView) * index;
      var dragPct = (deltaX / w) * 100;
      track.style.transform = "translate3d(calc(-" + pct + "% + " + dragPct + "px), 0, 0)";
    });
    function endDrag() {
      if (!isPointerDown) return;
      isPointerDown = false;
      track.style.transition = "";
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) next(); else prev();
      } else {
        apply();
      }
      deltaX = 0;
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    function startAuto() {
      if (!autoplay || slides.length <= perView) return;
      stopAuto();
      timer = window.setInterval(next, interval);
    }
    function stopAuto() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);

    // Pause autoplay when offscreen to save CPU + battery.
    if (typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) startAuto(); else stopAuto();
        });
      }, { threshold: 0.25 });
      io.observe(root);
    } else {
      startAuto();
    }

    apply();
  }

  function initLogo(root) {
    // Logo carousel uses CSS animation; JS only duplicates the track
    // contents once so the marquee loops seamlessly. Skip if already
    // duplicated (idempotent across re-inits).
    if (root.getAttribute("data-fws-init") === "1") return;
    var track = q(".fws-logo-track", root);
    if (!track) return;
    var html = track.innerHTML;
    track.innerHTML = html + html;
    root.setAttribute("data-fws-init", "1");
  }

  function initAll() {
    qa("[data-cms-slider]").forEach(function (root) {
      var kind = root.getAttribute("data-cms-slider");
      if (kind === "logo") initLogo(root);
      else initCarousel(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
