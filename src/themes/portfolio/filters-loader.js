/**
 * Portfolio theme — runtime project filters.
 *
 * Wires the [data-cms-portfolio-filters] chip cloud on the home page
 * (and any other page that ships filterable cards). Source of truth
 * is the rendered DOM:
 *   - Every project card carries `data-cms-category="<slug>"`.
 *   - The chip cloud already has an "All" chip with
 *     `data-cms-filter="*"` baked in by the template.
 *
 * On boot we:
 *   1. Read every unique category slug present on the page.
 *   2. Append one button[data-cms-filter="<slug>"] per slug to the
 *      filter host, labelled from the first card carrying that slug
 *      via its category meta (the meta is uppercase already).
 *   3. Wire click handlers that toggle `is-active` on the buttons
 *      and show/hide cards (display:none) by matching
 *      `data-cms-category`.
 *
 * The implementation is purposefully without animation — the design
 * system rejects transitions on layout to keep the architectural
 * feel. The card list reflows instantly.
 */
(function () {
  "use strict";

  function init() {
    var host = document.querySelector("[data-cms-portfolio-filters]");
    if (!host) return;
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-cms-category]"),
    );
    if (cards.length === 0) {
      host.setAttribute("hidden", "");
      return;
    }

    // Gather unique slugs + their human label (taken from the
    // first card's `.project-card__meta` text — the "CATEGORY / 2024"
    // string. We split on " / " and use the leading word.)
    var slugToLabel = {};
    cards.forEach(function (card) {
      var slug = card.getAttribute("data-cms-category");
      if (!slug) return;
      if (slugToLabel[slug]) return;
      var metaEl = card.querySelector(".project-card__meta");
      var rawMeta = metaEl ? metaEl.textContent || "" : "";
      var label = rawMeta.split(" / ")[0].trim();
      slugToLabel[slug] = label || slug.toUpperCase();
    });

    var slugs = Object.keys(slugToLabel).sort();
    if (slugs.length === 0) {
      host.setAttribute("hidden", "");
      return;
    }

    // Append a chip button per slug. The "All" chip (data-cms-filter="*")
    // is already in the DOM from the template.
    slugs.forEach(function (slug) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "portfolio-btn-outline";
      chip.setAttribute("data-cms-filter", slug);
      chip.textContent = slugToLabel[slug];
      host.appendChild(chip);
    });

    function applyFilter(slug) {
      var showAll = slug === "*" || !slug;
      cards.forEach(function (card) {
        if (showAll) {
          card.style.display = "";
          return;
        }
        var cardSlug = card.getAttribute("data-cms-category");
        card.style.display = cardSlug === slug ? "" : "none";
      });
      // Update active state on the chips.
      host.querySelectorAll("[data-cms-filter]").forEach(function (btn) {
        var thisSlug = btn.getAttribute("data-cms-filter");
        if (thisSlug === slug || (showAll && thisSlug === "*")) {
          btn.classList.add("is-active");
        } else {
          btn.classList.remove("is-active");
        }
      });
    }

    host.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof Element)) return;
      var btn = target.closest("[data-cms-filter]");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-cms-filter"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
