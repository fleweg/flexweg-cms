/**
 * Default theme — runtime sidebar loader.
 *
 * Contract:
 *   - Templates declare empty (or fallback-rendered) containers via
 *     `data-cms-*` attributes.
 *   - This script fetches `/data/posts.json` AND `/data/authors.json`
 *     once on DOMContentLoaded and populates each container with the
 *     right slice of data — so editing a post sibling list, an author
 *     bio, or an author avatar takes effect on every existing post
 *     HTML without re-publishing.
 *   - Failure is silent: if a fetch fails (404 because no publish has
 *     happened yet, or transient network), the container either stays
 *     hidden (related) or keeps its publish-time fallback content
 *     (author bio).
 *
 * Currently supports:
 *   [data-cms-related] — list of posts in the same category as the
 *     current one, with a "latest articles" fallback when the category
 *     has no other matches.
 *     Reads:
 *       data-cms-current-id      current post id (excluded from list)
 *       data-cms-term-id         primary term id to filter by
 *       data-cms-limit           max items (default 3)
 *       data-cms-label           heading when category match exists
 *       data-cms-fallback-label  heading when falling back to latest
 *
 *   [data-cms-author-bio] — overrides the publish-time-rendered author
 *     bio block with the current /authors.json data, so editing the
 *     bio / name / avatar in /users updates every post sidebar
 *     immediately on the next page load.
 *     Reads:
 *       data-cms-author-id   user id to look up in authors.json
 *       data-cms-eyebrow     section eyebrow ("About the author")
 *
 * Adding a new widget: query for its `[data-cms-*]` selector, render
 * into the host, and add a paint pass below.
 */
(function () {
  "use strict";

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

  // ─── Related posts ────────────────────────────────────────────────

  function renderRelatedItem(entry) {
    var li = document.createElement("li");
    li.className = "related-posts__item";
    var a = document.createElement("a");
    a.href = "/" + entry.url;
    if (entry.category && entry.category.name) {
      var eyebrow = document.createElement("p");
      eyebrow.className = "related-posts__eyebrow";
      eyebrow.textContent = entry.category.name;
      a.appendChild(eyebrow);
    }
    var title = document.createElement("p");
    title.className = "related-posts__title-line";
    title.textContent = entry.title || "";
    a.appendChild(title);
    if (entry.dateLabel) {
      var date = document.createElement("p");
      date.className = "related-posts__date";
      date.textContent = entry.dateLabel;
      a.appendChild(date);
    }
    li.appendChild(a);
    return li;
  }

  // Populates a `[data-cms-related]` container. Strategy:
  //   1. If `data-cms-term-id` is set, try same-category siblings first
  //      and label the section with `data-cms-label` ("Continue reading").
  //   2. If that yields zero matches (fresh category, only-post case,
  //      or no term-id at all), fall back to the most-recent posts and
  //      label with `data-cms-fallback-label` ("Latest articles").
  //   3. If even the fallback is empty (truly empty corpus), hide.
  // Pages are skipped in both passes — sidebar widgets target article
  // flow content, not timeless pages (About, Contact).
  function renderRelated(host, posts) {
    var termId = host.getAttribute("data-cms-term-id") || "";
    var currentId = host.getAttribute("data-cms-current-id") || "";
    var limit = parseInt(host.getAttribute("data-cms-limit") || "3", 10);
    var label = host.getAttribute("data-cms-label") || "Continue reading";
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
    headingEl.className = "related-posts__title";
    headingEl.textContent = heading;
    host.appendChild(headingEl);
    var list = document.createElement("ul");
    list.className = "related-posts__list";
    matching.forEach(function (entry) {
      list.appendChild(renderRelatedItem(entry));
    });
    host.appendChild(list);
  }

  // ─── Author bio ───────────────────────────────────────────────────

  function authorInitials(name) {
    if (!name) return "?";
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    var first = parts[0][0] || "";
    var last = parts[parts.length - 1][0] || "";
    return (first + last).toUpperCase();
  }

  // Builds the avatar element. Renders an <img> when a URL is given,
  // otherwise a typographic initials placeholder — same shape and
  // class chain that AuthorAvatar.tsx produces at publish time, so the
  // existing CSS applies seamlessly.
  function authorAvatar(name, url) {
    if (url) {
      var img = document.createElement("img");
      img.className = "author-avatar author-avatar--lg author-avatar--image";
      img.src = url;
      img.alt = name || "";
      return img;
    }
    var span = document.createElement("span");
    span.className = "author-avatar author-avatar--lg";
    span.setAttribute("aria-hidden", "true");
    span.textContent = authorInitials(name);
    return span;
  }

  // Replaces a `[data-cms-author-bio]` host with the current author
  // data. The host is rendered with `hidden` at publish time and gets
  // its content (and visibility) restored here — so missing data
  // (user deleted, /authors.json unreachable) leaves the section
  // invisible rather than showing an empty card.
  function renderAuthorBio(host, authors) {
    var authorId = host.getAttribute("data-cms-author-id") || "";
    if (!authorId) return;
    var entry = authors[authorId];
    if (!entry) return;

    var eyebrowText = host.getAttribute("data-cms-eyebrow") || "About the author";

    host.innerHTML = "";

    var eyebrow = document.createElement("p");
    eyebrow.className = "author-bio__eyebrow";
    eyebrow.textContent = eyebrowText;
    host.appendChild(eyebrow);

    var head = document.createElement("div");
    head.className = "author-bio__head";
    head.appendChild(authorAvatar(entry.displayName, entry.avatar));
    var nameWrap = document.createElement("div");
    // Author name is rendered as an <a> linking to the author's
    // archive page (/author/<slug>.html) when a URL is available.
    // Falls back to a non-clickable <p> if the entry doesn't carry
    // one — e.g. the JSON pre-dates this feature.
    var nameEl;
    if (entry.url) {
      nameEl = document.createElement("a");
      nameEl.href = "/" + entry.url;
    } else {
      nameEl = document.createElement("p");
    }
    nameEl.className = "author-bio__name";
    nameEl.textContent = entry.displayName || "";
    nameWrap.appendChild(nameEl);
    if (entry.email) {
      var role = document.createElement("p");
      role.className = "author-bio__role";
      role.textContent = entry.email;
      nameWrap.appendChild(role);
    }
    head.appendChild(nameWrap);
    host.appendChild(head);

    if (entry.bio) {
      var bio = document.createElement("p");
      bio.className = "author-bio__bio";
      bio.textContent = entry.bio;
      host.appendChild(bio);
    }

    host.removeAttribute("hidden");
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
    // Parallel fetches — both files live at the same site root and
    // are independent. Each paint pass tolerates the other's failure.
    Promise.all([
      fetchJson("/data/posts.json"),
      fetchJson("/data/authors.json"),
    ]).then(
      function (results) {
        paintRelated(results[0]);
        paintAuthorBios(results[1]);
      },
    );
  });
})();
