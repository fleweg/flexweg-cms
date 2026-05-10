/**
 * Storefront theme — runtime sidebar loader.
 *
 * Populates `[data-cms-related]` and `[data-cms-author-bio]` hosts
 * from `/data/posts.json` and `/data/authors.json`. Same lifecycle
 * as the corporate / magazine / default themes.
 *
 * Differences vs corporate:
 *   - Related items render as a small product-card grid (image +
 *     name + price), not a text list. Drives the "Curated pairings"
 *     row at the bottom of the single-post template.
 *   - Newsletter / contact form wiring is the same convention
 *     (`[data-cms-form]`) — copied verbatim.
 */
(function () {
  "use strict";

  var SOCIAL_ICON_PATHS = {
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    website: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
  };
  function socialIconSvg(network) {
    var path = SOCIAL_ICON_PATHS[network];
    if (!path) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>';
  }

  function fetchJson(path) {
    return fetch(path, { credentials: "omit" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[cms] " + path + " load failed:", err);
        return null;
      });
  }

  // ─── Related products ─────────────────────────────────────────────
  // DOM emitted matches the storefront single-post mockup — small grid
  // of product cards with image + name + price.
  function renderRelatedItem(entry) {
    var a = document.createElement("a");
    a.href = "/" + entry.url;
    a.className = "storefront-related-item";

    var thumb = document.createElement("div");
    thumb.className = "storefront-related-thumb";
    if (entry.heroUrl) {
      var img = document.createElement("img");
      img.src = entry.heroUrl;
      img.alt = entry.heroAlt || entry.title || "";
      img.loading = "lazy";
      thumb.appendChild(img);
    }
    a.appendChild(thumb);

    var title = document.createElement("p");
    title.className = "storefront-related-title";
    title.textContent = entry.title || "";
    a.appendChild(title);

    if (entry.priceLabel) {
      var price = document.createElement("p");
      price.className = "storefront-related-price";
      price.textContent = entry.priceLabel;
      a.appendChild(price);
    }
    return a;
  }

  function renderRelated(host, posts) {
    var termId = host.getAttribute("data-cms-term-id") || "";
    var currentId = host.getAttribute("data-cms-current-id") || "";
    var limit = parseInt(host.getAttribute("data-cms-limit") || "4", 10);
    var label = host.getAttribute("data-cms-label") || "Curated pairings";

    var matching = [];
    if (termId) {
      for (var i = 0; i < posts.length && matching.length < limit; i++) {
        var p = posts[i];
        if (p.id === currentId) continue;
        if (p.type !== "post") continue;
        if (p.primaryTermId !== termId) continue;
        matching.push(p);
      }
    }
    if (matching.length === 0) {
      for (var j = 0; j < posts.length && matching.length < limit; j++) {
        var pp = posts[j];
        if (pp.id === currentId) continue;
        if (pp.type !== "post") continue;
        matching.push(pp);
      }
    }
    if (matching.length === 0) {
      host.setAttribute("hidden", "");
      return;
    }

    host.removeAttribute("hidden");
    host.innerHTML = "";
    var headingEl = document.createElement("h3");
    headingEl.className = "storefront-related-heading";
    headingEl.textContent = label;
    host.appendChild(headingEl);
    var list = document.createElement("div");
    list.className = "storefront-related-list";
    matching.forEach(function (entry) {
      list.appendChild(renderRelatedItem(entry));
    });
    host.appendChild(list);
  }

  // ─── Author bio ──────────────────────────────────────────────────
  function authorAvatar(name, url) {
    if (!url) {
      var span = document.createElement("span");
      span.className = "storefront-bio-avatar";
      span.style.display = "inline-flex";
      span.style.alignItems = "center";
      span.style.justifyContent = "center";
      span.style.background = "rgb(var(--color-secondary-fixed))";
      span.style.color = "rgb(var(--color-secondary))";
      span.style.fontWeight = "700";
      span.setAttribute("aria-hidden", "true");
      span.textContent = (function () {
        if (!name) return "?";
        var parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
      })();
      return span;
    }
    var img = document.createElement("img");
    img.className = "storefront-bio-avatar";
    img.src = url;
    img.alt = name || "";
    img.loading = "lazy";
    return img;
  }

  function renderAuthorBio(host, authors) {
    var authorId = host.getAttribute("data-cms-author-id") || "";
    if (!authorId) return;
    var entry = authors[authorId];
    if (!entry) return;

    host.innerHTML = "";
    var eyebrow = document.createElement("h4");
    eyebrow.className = "storefront-bio-eyebrow";
    eyebrow.textContent = host.getAttribute("data-cms-bio-label") || "Author";
    host.appendChild(eyebrow);

    var row = document.createElement("div");
    row.className = "storefront-bio-row";
    row.appendChild(authorAvatar(entry.displayName, entry.avatar));

    var nameWrap = document.createElement("div");
    var nameEl;
    if (entry.url) {
      nameEl = document.createElement("a");
      nameEl.href = "/" + entry.url;
    } else {
      nameEl = document.createElement("p");
    }
    nameEl.className = "storefront-bio-name";
    nameEl.textContent = entry.displayName || "";
    nameWrap.appendChild(nameEl);

    if (entry.title) {
      var role = document.createElement("p");
      role.className = "storefront-bio-title";
      role.textContent = entry.title;
      nameWrap.appendChild(role);
    }
    row.appendChild(nameWrap);
    host.appendChild(row);

    if (entry.bio) {
      var bio = document.createElement("p");
      bio.className = "storefront-bio-bio";
      bio.textContent = entry.bio;
      host.appendChild(bio);
    }

    if (entry.socials && entry.socials.length) {
      var socials = document.createElement("div");
      socials.className = "storefront-bio-socials";
      for (var i = 0; i < entry.socials.length; i++) {
        var s = entry.socials[i];
        var a = document.createElement("a");
        a.className = "storefront-bio-social";
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", s.network);
        a.innerHTML = socialIconSvg(s.network);
        socials.appendChild(a);
      }
      host.appendChild(socials);
    }
    host.removeAttribute("hidden");
  }

  // ─── Newsletter / contact form wiring ────────────────────────────
  // Same contract as corporate's contact-form: `[data-cms-form]` with
  // mode + endpoint + mailto data attrs.
  function asUrlEncoded(formData) {
    var pairs = [];
    formData.forEach(function (value, key) {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return pairs.join("&");
  }

  function showFormStatus(form, kind) {
    ["success", "error"].forEach(function (k) {
      var el = form.querySelector("[data-cms-form-" + k + "]");
      if (el) {
        if (k === kind) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      }
    });
  }

  function buildMailto(form, address) {
    var data = new FormData(form);
    var subject = data.get("subject") || "Newsletter signup";
    var lines = [];
    data.forEach(function (value, key) {
      if (key === "subject" || key === "consent") return;
      lines.push(key + ": " + value);
    });
    return (
      "mailto:" + encodeURIComponent(address) +
      "?subject=" + encodeURIComponent(String(subject)) +
      "&body=" + encodeURIComponent(lines.join("\n\n"))
    );
  }

  function handleFormSubmit(form, mode, endpoint, mailtoAddress, event) {
    if (mode === "mailto") {
      if (!mailtoAddress) return;
      event.preventDefault();
      window.location.href = buildMailto(form, mailtoAddress);
      return;
    }
    if (!endpoint) return;
    event.preventDefault();
    var data = new FormData(form);
    var submitButton = form.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: asUrlEncoded(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showFormStatus(form, "success");
        form.reset();
      })
      .catch(function (err) {
        console.warn("[cms] form submit failed:", err);
        showFormStatus(form, "error");
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  }

  function wireForms() {
    document.querySelectorAll("[data-cms-form]").forEach(function (form) {
      var mode = form.getAttribute("data-cms-form") || "endpoint";
      var endpoint = form.getAttribute("data-cms-form-endpoint") || "";
      var mailtoAddress = form.getAttribute("data-cms-form-mailto") || "";
      form.addEventListener("submit", function (event) {
        handleFormSubmit(form, mode, endpoint, mailtoAddress, event);
      });
      form.querySelectorAll("input, textarea, select").forEach(function (input) {
        function update() {
          var group = input.closest(".floating-label-group");
          if (!group) return;
          if (input.value && input.value.length > 0) group.classList.add("is-filled");
          else group.classList.remove("is-filled");
        }
        input.addEventListener("input", update);
        input.addEventListener("change", update);
        update();
      });
    });
  }

  function paintRelated(postsBlob) {
    if (!postsBlob || !Array.isArray(postsBlob.posts)) return;
    document.querySelectorAll("[data-cms-related]").forEach(function (host) {
      renderRelated(host, postsBlob.posts);
    });
  }

  // ─── Per-category row sliders ─────────────────────────────────────
  // Wires chevron buttons emitted by renderProductGrid in slider
  // mode. Each track's [data-cms-row-track] sibling has [data-cms-
  // row-prev] and [-next] chevrons; click → scroll one card width
  // + gap. Same pattern as corporate's featured-posts chevrons.
  function wireCategoryRowChevrons() {
    document.querySelectorAll("[data-cms-row-track]").forEach(function (track) {
      var wrap = track.parentElement;
      if (!wrap) return;
      var prev = wrap.querySelector("[data-cms-row-prev]");
      var next = wrap.querySelector("[data-cms-row-next]");
      function step(dir) {
        var cards = track.children;
        if (!cards || cards.length === 0) return;
        var card = cards[0];
        var width = card.getBoundingClientRect().width;
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        track.scrollBy({ left: dir * (width + gap), behavior: "smooth" });
      }
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
    });
  }

  function paintAuthorBios(authorsBlob) {
    if (!authorsBlob || !authorsBlob.authors) return;
    document.querySelectorAll("[data-cms-author-bio]").forEach(function (host) {
      renderAuthorBio(host, authorsBlob.authors);
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    wireForms();
    wireCategoryRowChevrons();
    Promise.all([
      fetchJson("/data/posts.json"),
      fetchJson("/data/authors.json")
    ]).then(function (results) {
      paintRelated(results[0]);
      paintAuthorBios(results[1]);
    });
  });
})();
