/**
 * Corporate theme — runtime sidebar loader.
 *
 * Populates `[data-cms-related]` and `[data-cms-author-bio]` hosts
 * from `/data/posts.json` and `/data/authors.json`. Same lifecycle as
 * the magazine + default themes: fetched once on DOMContentLoaded;
 * paint passes are independent and tolerate each other's failure.
 *
 * The injected DOM uses corporate-specific class names
 * (`corporate-bio-*`, `corporate-related-*`) — matching CSS rules
 * live in `theme.css` under `@layer components`.
 *
 * Failure is silent: missing data leaves the host hidden (related)
 * or untouched (author-bio's host stays `hidden` from publish time).
 */
(function () {
  "use strict";

  // ─── Social icons ─────────────────────────────────────────────────
  // Brand SVG paths + display labels for the curated SocialNetwork
  // list. Mirror in core/socialIcons.tsx (and each other theme's
  // posts-loader.js) when adding a network.
  var SOCIAL_ICON_PATHS = {
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    mastodon: "M23.193 7.88c0-5.207-3.411-6.733-3.411-6.733C18.062.357 15.108.025 12.041 0h-.076c-3.068.025-6.02.357-7.74 1.147 0 0-3.412 1.526-3.412 6.733 0 1.193-.023 2.619.015 4.13.124 5.092.934 10.11 5.641 11.355 2.17.574 4.034.695 5.535.612 2.722-.151 4.25-.972 4.25-.972l-.09-1.975s-1.945.613-4.129.539c-2.165-.074-4.449-.233-4.799-2.891a5.499 5.499 0 0 1-.048-.745s2.125.52 4.817.643c1.646.075 3.19-.097 4.758-.283 3.007-.359 5.625-2.212 5.954-3.905.52-2.667.477-6.508.477-6.508zm-4.024 6.709h-2.497V8.469c0-1.29-.543-1.944-1.628-1.944-1.2 0-1.802.776-1.802 2.312v3.349h-2.484v-3.35c0-1.536-.601-2.312-1.802-2.312-1.085 0-1.628.655-1.628 1.945v6.119H4.831V8.285c0-1.29.328-2.313.987-3.07.68-.756 1.57-1.144 2.674-1.144 1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.04c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.388 2.674 1.144.658.757.986 1.78.986 3.07v6.304z",
    bluesky: "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.137-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.952 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z",
    github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    website: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z",
  };
  var SOCIAL_ICON_LABELS = {
    twitter: "Twitter / X",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    mastodon: "Mastodon",
    bluesky: "Bluesky",
    github: "GitHub",
    website: "Website",
  };
  function socialIconSvg(network) {
    var path = SOCIAL_ICON_PATHS[network];
    if (!path) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>';
  }
  function socialIconLabel(network) {
    return SOCIAL_ICON_LABELS[network] || network;
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

  // ─── Related / popular articles ───────────────────────────────────
  //
  // DOM emitted matches the corporate single-post mockup — a card with
  // a heading and a list of items; each item is an <a> with a colored
  // category eyebrow, line-clamped title, and a small date meta line.
  //
  //   <div class="corporate-related-card">
  //     <h4 class="corporate-related-heading">Articles populaires</h4>
  //     <div class="corporate-related-list">
  //       <a class="corporate-related-item" href="/...">
  //         <p class="corporate-related-eyebrow">Category</p>
  //         <p class="corporate-related-title">Title</p>
  //         <p class="corporate-related-meta">Jan 12 • 5 min read</p>
  //       </a>
  //       …
  //     </div>
  //   </div>
  //
  // The card chrome (background/border/padding) lives in the host
  // element itself via `.corporate-related-card` — see the
  // SingleTemplate sidebar markup.

  function renderRelatedItem(entry) {
    var a = document.createElement("a");
    a.href = "/" + entry.url;
    a.className = "corporate-related-item";
    if (entry.category && entry.category.name) {
      var eyebrow = document.createElement("p");
      eyebrow.className = "corporate-related-eyebrow";
      eyebrow.textContent = entry.category.name;
      a.appendChild(eyebrow);
    }
    var title = document.createElement("p");
    title.className = "corporate-related-title";
    title.textContent = entry.title || "";
    a.appendChild(title);
    if (entry.dateLabel) {
      var meta = document.createElement("p");
      meta.className = "corporate-related-meta";
      meta.textContent = entry.dateLabel;
      a.appendChild(meta);
    }
    return a;
  }

  function renderRelated(host, posts) {
    var termId = host.getAttribute("data-cms-term-id") || "";
    var currentId = host.getAttribute("data-cms-current-id") || "";
    var limit = parseInt(host.getAttribute("data-cms-limit") || "3", 10);
    var label = host.getAttribute("data-cms-label") || "Popular articles";
    var fallbackLabel =
      host.getAttribute("data-cms-fallback-label") || "Latest articles";

    var matching = [];
    var heading = label;

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
      heading = fallbackLabel;
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
    var headingEl = document.createElement("h4");
    headingEl.className = "corporate-related-heading";
    headingEl.textContent = heading;
    host.appendChild(headingEl);
    var list = document.createElement("div");
    list.className = "corporate-related-list";
    matching.forEach(function (entry) {
      list.appendChild(renderRelatedItem(entry));
    });
    host.appendChild(list);
  }

  // ─── Author bio ───────────────────────────────────────────────────
  //
  // DOM emitted (matches the corporate single-post sidebar mockup —
  // round avatar + name in headline weight + label-caps title +
  // bio paragraph + circular social icon row):
  //
  //   <h4 class="corporate-bio-eyebrow">Author</h4>
  //   <div class="corporate-bio-row">
  //     <img class="corporate-bio-avatar" />
  //     <div>
  //       <p class="corporate-bio-name">…</p>
  //       <p class="corporate-bio-title">Senior Strategist</p>
  //     </div>
  //   </div>
  //   <p class="corporate-bio-bio">…</p>
  //   <div class="corporate-bio-socials">
  //     <a href="…" class="corporate-bio-social"> [icon] </a>
  //   </div>

  function authorAvatar(name, url) {
    if (!url) {
      // Fallback initials box — same color tokens as the avatar
      // when the author hasn't uploaded an image.
      var span = document.createElement("span");
      span.className = "corporate-bio-avatar";
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
    img.className = "corporate-bio-avatar";
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

    // Eyebrow label — "Author" or whatever the host configured. The
    // host can override it via data-cms-bio-label for i18n.
    var eyebrow = document.createElement("h4");
    eyebrow.className = "corporate-bio-eyebrow";
    eyebrow.textContent = host.getAttribute("data-cms-bio-label") || "Author";
    host.appendChild(eyebrow);

    var row = document.createElement("div");
    row.className = "corporate-bio-row";
    row.appendChild(authorAvatar(entry.displayName, entry.avatar));

    var nameWrap = document.createElement("div");
    var nameEl;
    if (entry.url) {
      nameEl = document.createElement("a");
      nameEl.href = "/" + entry.url;
    } else {
      nameEl = document.createElement("p");
    }
    nameEl.className = "corporate-bio-name";
    nameEl.textContent = entry.displayName || "";
    nameWrap.appendChild(nameEl);

    if (entry.title) {
      var role = document.createElement("p");
      role.className = "corporate-bio-title";
      role.textContent = entry.title;
      nameWrap.appendChild(role);
    }
    row.appendChild(nameWrap);
    host.appendChild(row);

    if (entry.bio) {
      var bio = document.createElement("p");
      bio.className = "corporate-bio-bio";
      bio.textContent = entry.bio;
      host.appendChild(bio);
    }

    // Visible socials — already filtered server-side. Each entry
    // produces an icon link to the user's external profile, opened in
    // a new tab with rel=noopener noreferrer.
    if (entry.socials && entry.socials.length) {
      var socials = document.createElement("div");
      socials.className = "corporate-bio-socials";
      for (var i = 0; i < entry.socials.length; i++) {
        var s = entry.socials[i];
        var a = document.createElement("a");
        a.className = "corporate-bio-social";
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", socialIconLabel(s.network));
        a.title = socialIconLabel(s.network);
        a.innerHTML = socialIconSvg(s.network);
        socials.appendChild(a);
      }
      host.appendChild(socials);
    }

    host.removeAttribute("hidden");
  }

  // ─── Share buttons ────────────────────────────────────────────────
  //
  // Wires up `[data-cms-share]` buttons in the body. The single-post
  // template emits two: `data-cms-share="native"` (Web Share API
  // fallback to copy-link when unsupported) and `data-cms-share="copy"`
  // (clipboard write of the page URL). Visual feedback is a brief
  // text/title swap so the user knows the click registered without
  // needing a toast library.

  function showFlash(button, glyphName) {
    var icon = button.querySelector(".material-symbols-outlined");
    if (!icon) return;
    var original = icon.textContent;
    icon.textContent = glyphName;
    setTimeout(function () {
      icon.textContent = original;
    }, 1400);
  }

  function copyLink(button) {
    var url = window.location.href;
    var done = function () { showFlash(button, "check"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () {
        // Fallback when the clipboard write is denied (e.g. insecure
        // context) — select-and-copy the URL via a temporary textarea.
        legacyCopy(url);
        done();
      });
    } else {
      legacyCopy(url);
      done();
    }
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {
      console.warn("[cms] clipboard copy failed:", e);
    }
  }

  function shareNative(button) {
    var url = window.location.href;
    var title = document.title || "";
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {
        // User cancelled or the share sheet failed — silent.
      });
    } else {
      copyLink(button);
    }
  }

  function wireShareButtons() {
    document.querySelectorAll("[data-cms-share]").forEach(function (button) {
      var mode = button.getAttribute("data-cms-share");
      button.addEventListener("click", function () {
        if (mode === "copy") copyLink(button);
        else shareNative(button);
      });
    });
  }

  // ─── Contact form ─────────────────────────────────────────────────
  //
  // Intercepts submit on every `[data-cms-form]` form. Two modes are
  // surfaced in the contact-form block's inspector:
  //   - "endpoint" (default) → POST a JSON body to a third-party
  //     form service (Formspree, Web3Forms, etc.). Success / error
  //     messages from `[data-cms-form-success]` / `[data-cms-form-error]`
  //     toggle visibility based on the response status.
  //   - "mailto" → build a `mailto:` URL with the subject + body
  //     pre-filled, then `window.location.href` to it. No JS-only
  //     state to manage.
  // When the form has neither a configured endpoint nor a mailto
  // address (most likely during initial setup), submit is left to
  // the browser's default behavior so the user notices the missing
  // configuration.

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
    var subject = data.get("subject") || "Contact form submission";
    var lines = [];
    data.forEach(function (value, key) {
      if (key === "subject" || key === "consent") return;
      lines.push(key + ": " + value);
    });
    return (
      "mailto:" +
      encodeURIComponent(address) +
      "?subject=" +
      encodeURIComponent(String(subject)) +
      "&body=" +
      encodeURIComponent(lines.join("\n\n"))
    );
  }

  function handleFormSubmit(form, mode, endpoint, mailtoAddress, event) {
    if (mode === "mailto") {
      if (!mailtoAddress) return; // No config — let the browser handle.
      event.preventDefault();
      window.location.href = buildMailto(form, mailtoAddress);
      return;
    }
    if (!endpoint) return; // No endpoint configured — fall through.
    event.preventDefault();
    var data = new FormData(form);
    var submitButton = form.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: asUrlEncoded(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showFormStatus(form, "success");
        form.reset();
      })
      .catch(function (err) {
        console.warn("[cms] contact form submit failed:", err);
        showFormStatus(form, "error");
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  }

  // ─── Featured posts chevrons ──────────────────────────────────────
  //
  // The home's featured-posts section ships decorative prev/next
  // chevrons (matching the mockup). On md+ the layout is a static
  // 3-col grid — the chevrons scroll smoothly to the next/previous
  // card slot. On mobile (single column with horizontal overflow if
  // the grid is repurposed as a slider in a future iteration), they
  // page through one card width at a time.
  function wireFeaturedChevrons() {
    var track = document.querySelector("[data-cms-featured-track]");
    if (!track) return;
    var prev = document.querySelector("[data-cms-featured-prev]");
    var next = document.querySelector("[data-cms-featured-next]");
    function step(dir) {
      var cards = track.children;
      if (!cards || cards.length === 0) return;
      var card = cards[0];
      var width = card.getBoundingClientRect().width;
      // Read the actual computed gap from the flex container so the
      // scroll step matches the visual rhythm. The `gap` shorthand
      // resolves to a px value in the computed style (e.g. "32px"
      // when Tailwind's gap-stack-lg = 2rem at 16px root font-size).
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      track.scrollBy({ left: dir * (width + gap), behavior: "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
  }

  function wireContactForms() {
    document.querySelectorAll("[data-cms-form]").forEach(function (form) {
      var mode = form.getAttribute("data-cms-form") || "endpoint";
      var endpoint = form.getAttribute("data-cms-form-endpoint") || "";
      var mailtoAddress = form.getAttribute("data-cms-form-mailto") || "";
      form.addEventListener("submit", function (event) {
        handleFormSubmit(form, mode, endpoint, mailtoAddress, event);
      });
      // Marks each input as filled so the floating-label CSS keeps
      // the label in its raised position even when the field has a
      // pre-filled value (browser autofill, back-button restore).
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

  // ─── Paint passes ─────────────────────────────────────────────────

  function paintRelated(postsBlob) {
    if (!postsBlob || !Array.isArray(postsBlob.posts)) return;
    document.querySelectorAll("[data-cms-related]").forEach(function (host) {
      renderRelated(host, postsBlob.posts);
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
    wireShareButtons();
    wireContactForms();
    wireFeaturedChevrons();
    Promise.all([
      fetchJson("/data/posts.json"),
      fetchJson("/data/authors.json"),
    ]).then(function (results) {
      paintRelated(results[0]);
      paintAuthorBios(results[1]);
    });
  });
})();
