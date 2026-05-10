/**
 * Storefront theme — runtime catalog loader.
 *
 * Powers the catalog page (default `/catalog.html`). Fetches
 * /data/products.json, renders an <article> card per product into
 * [data-cms-catalog-grid], wires up the sidebar filters (search /
 * categories / tags / price range / stock / sort), and re-lays out
 * the grid via a FLIP animation when filters change.
 *
 * Pure vanilla JS, no external dependencies. The CatalogTemplate
 * ships an empty grid + empty filter widgets; this loader fills them
 * at first paint.
 */
(function () {
  "use strict";

  var SEARCH_DEBOUNCE_MS = 200;
  var EMPTY_PRICE_PAIR = "—";

  function fetchProducts() {
    return fetch("/data/products.json", { credentials: "omit", cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[cms] products.json load failed:", err);
        return null;
      });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatPrice(amount, currency, locale) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) return "";
    try {
      return new Intl.NumberFormat(locale || "en", {
        style: "currency",
        currency: currency || "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      return amount.toFixed(2) + " " + (currency || "");
    }
  }

  // ─── State ────────────────────────────────────────────────────────
  // Translated UI strings — populated at boot from the grid host's
  // `data-cms-catalog-i18n` attribute (encoded server-side by the
  // CatalogTemplate using t()). Keeps the loader language-agnostic.
  var i18nLabels = {
    inStock: "In stock",
    lowStock: "Low stock",
    outOfStock: "Out of stock",
    onOrder: "On order",
    productCountOne: "1 product",
    productCount: "{count} products",
    empty: "No products match your filters.",
  };

  function loadI18n(grid) {
    if (!grid) return;
    var raw = grid.getAttribute("data-cms-catalog-i18n");
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      for (var k in parsed) {
        if (parsed[k]) i18nLabels[k] = parsed[k];
      }
    } catch (e) {
      console.warn("[cms] catalog i18n parse failed:", e);
    }
  }

  var state = {
    products: [],
    visibleIds: [],
    filters: {
      search: "",
      categories: new Set(),
      tags: new Set(),
      stockStatuses: new Set(),
      priceMax: 0,
      priceMaxAvailable: 0,
      sort: "newest",
    },
    locale: document.documentElement.lang || "en",
    currency: "EUR",
  };

  // ─── Card renderer ────────────────────────────────────────────────
  function renderCard(p) {
    var article = document.createElement("article");
    article.className = "storefront-catalog-card storefront-product-card flex flex-col group";
    article.setAttribute("data-cms-catalog-id", p.id);

    var imgWrap = document.createElement("div");
    imgWrap.className = "relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-3 shadow-sm";
    if (p.imageUrl) {
      imgWrap.innerHTML =
        '<a href="/' + escapeHtml(p.url) + '" class="block w-full h-full">' +
        '<img src="' + escapeHtml(p.imageUrl) + '" alt="' + escapeHtml(p.imageAlt || p.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />' +
        "</a>";
    }
    if (p.badges && p.badges.length > 0) {
      var badgeChip = document.createElement("span");
      badgeChip.className = "absolute top-3 left-3 bg-secondary/90 text-on-secondary text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur uppercase tracking-widest";
      badgeChip.textContent = p.badges[0];
      imgWrap.appendChild(badgeChip);
    }
    article.appendChild(imgWrap);

    var h3 = document.createElement("h3");
    h3.className = "font-serif text-[1.125rem] text-on-surface leading-tight mb-1";
    var titleA = document.createElement("a");
    titleA.href = "/" + p.url;
    titleA.textContent = p.title;
    titleA.className = "hover:text-primary transition-colors";
    h3.appendChild(titleA);
    article.appendChild(h3);

    if (p.categoryName) {
      var catP = document.createElement("p");
      catP.className = "text-[12px] text-on-surface-variant uppercase tracking-widest mb-1";
      catP.textContent = p.categoryName;
      article.appendChild(catP);
    }

    if (p.priceTTC > 0) {
      var priceP = document.createElement("p");
      priceP.className = "text-label-caps font-semibold";
      var priceCurrency = p.currency || state.currency;
      if (p.promoTTC > 0 && p.promoTTC < p.priceTTC) {
        priceP.innerHTML =
          '<span class="storefront-price-promo">' +
          escapeHtml(formatPrice(p.promoTTC, priceCurrency, state.locale)) +
          '</span><span class="storefront-price-strike">' +
          escapeHtml(formatPrice(p.priceTTC, priceCurrency, state.locale)) +
          "</span>";
      } else {
        priceP.className += " text-primary";
        priceP.textContent = formatPrice(p.priceTTC, priceCurrency, state.locale);
      }
      article.appendChild(priceP);
    }

    return article;
  }

  // ─── Filtering ────────────────────────────────────────────────────
  function applyFilters() {
    var f = state.filters;
    var searchTerms = f.search
      ? f.search.toLowerCase().split(/\s+/).filter(Boolean)
      : [];

    var matched = state.products.filter(function (p) {
      if (searchTerms.length > 0) {
        var haystack = [
          p.title,
          p.excerpt,
          p.categoryName,
          (p.tags || []).map(function (t) { return t.name; }).join(" "),
        ].join(" ").toLowerCase();
        for (var i = 0; i < searchTerms.length; i++) {
          if (haystack.indexOf(searchTerms[i]) === -1) return false;
        }
      }
      if (f.categories.size > 0 && !f.categories.has(p.categoryId)) return false;
      if (f.tags.size > 0) {
        var hit = false;
        for (var j = 0; j < (p.tags || []).length; j++) {
          if (f.tags.has(p.tags[j].id)) { hit = true; break; }
        }
        if (!hit) return false;
      }
      if (f.stockStatuses.size > 0 && !f.stockStatuses.has(p.stockStatus)) {
        return false;
      }
      if (f.priceMax > 0 && p.effectivePrice > f.priceMax) return false;
      return true;
    });

    matched.sort(function (a, b) {
      switch (f.sort) {
        case "price-asc":
          return (a.effectivePrice || Infinity) - (b.effectivePrice || Infinity);
        case "price-desc":
          return (b.effectivePrice || 0) - (a.effectivePrice || 0);
        case "newest":
        default:
          return b.createdAt - a.createdAt;
      }
    });

    state.visibleIds = matched.map(function (p) { return p.id; });
    paintGrid(matched);
    updateCount(matched.length);
  }

  // FLIP-animated paint. Records each card's old position, swaps to
  // new state, measures new positions, applies inverse transforms,
  // then animates them back to identity. Skipped on the first paint.
  var firstPaint = true;
  function paintGrid(matched) {
    var grid = document.querySelector("[data-cms-catalog-grid]");
    if (!grid) return;

    if (firstPaint) {
      grid.innerHTML = "";
      if (matched.length === 0) {
        grid.appendChild(emptyMessage());
        firstPaint = false;
        return;
      }
      var frag = document.createDocumentFragment();
      matched.forEach(function (p) { frag.appendChild(renderCard(p)); });
      grid.appendChild(frag);
      firstPaint = false;
      return;
    }

    var oldCards = Array.prototype.slice.call(
      grid.querySelectorAll(".storefront-catalog-card"),
    );
    var oldRects = {};
    oldCards.forEach(function (c) {
      var id = c.getAttribute("data-cms-catalog-id");
      oldRects[id] = c.getBoundingClientRect();
    });

    var existingById = {};
    oldCards.forEach(function (c) {
      existingById[c.getAttribute("data-cms-catalog-id")] = c;
    });

    grid.innerHTML = "";
    if (matched.length === 0) {
      grid.appendChild(emptyMessage());
      return;
    }

    var matchedFrag = document.createDocumentFragment();
    matched.forEach(function (p) {
      var node = existingById[p.id];
      if (!node) node = renderCard(p);
      matchedFrag.appendChild(node);
    });
    grid.appendChild(matchedFrag);

    var newCards = Array.prototype.slice.call(
      grid.querySelectorAll(".storefront-catalog-card"),
    );
    newCards.forEach(function (c) {
      var id = c.getAttribute("data-cms-catalog-id");
      var oldRect = oldRects[id];
      if (!oldRect) return;
      var newRect = c.getBoundingClientRect();
      var dx = oldRect.left - newRect.left;
      var dy = oldRect.top - newRect.top;
      if (dx === 0 && dy === 0) return;
      c.style.transition = "none";
      c.style.transform = "translate(" + dx + "px, " + dy + "px)";
    });
    requestAnimationFrame(function () {
      newCards.forEach(function (c) {
        c.style.transition = "transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)";
        c.style.transform = "";
      });
    });
  }

  function emptyMessage() {
    var p = document.createElement("p");
    p.className = "storefront-catalog-empty";
    p.textContent = i18nLabels.empty;
    return p;
  }

  function updateCount(n) {
    var el = document.querySelector("[data-cms-catalog-count]");
    if (!el) return;
    if (n === 1) {
      el.textContent = i18nLabels.productCountOne;
    } else {
      el.textContent = (i18nLabels.productCount || "{count} products").replace(
        "{count}",
        String(n),
      );
    }
  }

  // ─── Sidebar widgets ──────────────────────────────────────────────
  function renderCategoryFilters(facets) {
    var host = document.querySelector("[data-cms-catalog-categories-host]");
    if (!host || !facets || !Array.isArray(facets.categories)) return;
    if (facets.categories.length === 0) {
      host.parentElement && host.parentElement.setAttribute("hidden", "");
      return;
    }
    host.innerHTML = "";
    facets.categories.forEach(function (c) {
      var label = document.createElement("label");
      label.className = "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "storefront-filter-checkbox";
      input.value = c.id;
      input.addEventListener("change", function () {
        if (input.checked) state.filters.categories.add(c.id);
        else state.filters.categories.delete(c.id);
        applyFilters();
      });
      var span = document.createElement("span");
      span.textContent = c.name + " (" + c.count + ")";
      label.appendChild(input);
      label.appendChild(span);
      host.appendChild(label);
    });
  }

  function renderTagFilters(facets) {
    var host = document.querySelector("[data-cms-catalog-tags-host]");
    if (!host || !facets || !Array.isArray(facets.tags)) return;
    if (facets.tags.length === 0) {
      host.parentElement && host.parentElement.setAttribute("hidden", "");
      return;
    }
    host.innerHTML = "";
    facets.tags.forEach(function (t) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "storefront-filter-chip text-label-caps uppercase tracking-widest";
      chip.textContent = t.name;
      chip.addEventListener("click", function () {
        if (state.filters.tags.has(t.id)) {
          state.filters.tags.delete(t.id);
          chip.classList.remove("is-active");
        } else {
          state.filters.tags.add(t.id);
          chip.classList.add("is-active");
        }
        applyFilters();
      });
      host.appendChild(chip);
    });
  }

  function renderPriceRange(facets) {
    var slider = document.querySelector("[data-cms-catalog-price-slider]");
    var minEl = document.querySelector("[data-cms-catalog-price-min]");
    var maxEl = document.querySelector("[data-cms-catalog-price-max]");
    var wrap = document.querySelector("[data-cms-catalog-price]");
    if (!slider || !facets || !facets.priceRange || facets.priceRange.max <= 0) {
      wrap && wrap.setAttribute("hidden", "");
      return;
    }
    var min = facets.priceRange.min;
    var max = facets.priceRange.max;
    state.filters.priceMaxAvailable = max;
    state.filters.priceMax = max;
    slider.min = String(Math.floor(min));
    slider.max = String(Math.ceil(max));
    slider.value = String(Math.ceil(max));
    slider.step = "1";
    if (minEl) minEl.textContent = formatPrice(min, state.currency, state.locale) || EMPTY_PRICE_PAIR;
    if (maxEl) maxEl.textContent = formatPrice(max, state.currency, state.locale) || EMPTY_PRICE_PAIR;
    slider.addEventListener("input", function () {
      var v = parseFloat(slider.value);
      state.filters.priceMax = isNaN(v) ? state.filters.priceMaxAvailable : v;
      if (maxEl) maxEl.textContent = formatPrice(v, state.currency, state.locale);
      applyFilters();
    });
  }

  function stockLabel(s) {
    if (s === "in-stock") return i18nLabels.inStock;
    if (s === "low-stock") return i18nLabels.lowStock;
    if (s === "out-of-stock") return i18nLabels.outOfStock;
    if (s === "on-order") return i18nLabels.onOrder;
    return s;
  }

  function renderStockFilters(facets) {
    var host = document.querySelector("[data-cms-catalog-stock-host]");
    if (!host || !facets || !Array.isArray(facets.stockStatuses)) return;
    if (facets.stockStatuses.length === 0) {
      host.parentElement && host.parentElement.setAttribute("hidden", "");
      return;
    }
    host.innerHTML = "";
    facets.stockStatuses.forEach(function (s) {
      var label = document.createElement("label");
      label.className = "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "storefront-filter-checkbox";
      input.value = s;
      input.addEventListener("change", function () {
        if (input.checked) state.filters.stockStatuses.add(s);
        else state.filters.stockStatuses.delete(s);
        applyFilters();
      });
      var span = document.createElement("span");
      span.textContent = stockLabel(s);
      label.appendChild(input);
      label.appendChild(span);
      host.appendChild(label);
    });
  }

  function wireSearch() {
    var input = document.querySelector("[data-cms-catalog-search]");
    if (!input) return;
    var timeout = null;
    input.addEventListener("input", function () {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(function () {
        state.filters.search = input.value.trim();
        applyFilters();
      }, SEARCH_DEBOUNCE_MS);
    });
  }

  function wireSort() {
    var select = document.querySelector("[data-cms-catalog-sort]");
    if (!select) return;
    select.addEventListener("change", function () {
      state.filters.sort = select.value;
      applyFilters();
    });
  }

  // ─── Boot ─────────────────────────────────────────────────────────
  ready(function () {
    var grid = document.querySelector("[data-cms-catalog-grid]");
    if (!grid) return; // Page doesn't host the catalog UI — noop.
    loadI18n(grid);

    fetchProducts().then(function (blob) {
      if (!blob || !Array.isArray(blob.products)) {
        grid.innerHTML = "";
        grid.appendChild(emptyMessage());
        return;
      }
      state.products = blob.products;
      state.currency = blob.currency || "EUR";

      renderCategoryFilters(blob.facets);
      renderTagFilters(blob.facets);
      renderPriceRange(blob.facets);
      renderStockFilters(blob.facets);
      wireSearch();
      wireSort();

      applyFilters();
    });
  });
})();
