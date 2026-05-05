/**
 * Magazine theme — runtime menu loader.
 *
 * Same contract as the default theme's menu-loader. Differences:
 *   - The injected logo `<img>` gets Tailwind utility classes
 *     (`h-8 w-auto`) so it sizes correctly inside the magazine
 *     header's flex layout without needing a theme-specific CSS rule.
 *   - The burger overlay uses `[data-cms-menu="header"]` containers
 *     and a separate `#burger-menu` overlay, both rendered by
 *     templates/BaseLayout.tsx.
 */
(function () {
  "use strict";

  function fetchMenu() {
    return fetch("/data/menu.json", { credentials: "omit" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[cms] menu.json load failed:", err);
        return null;
      });
  }

  function renderItem(item) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = item.href || "#";
    a.textContent = item.label || "";
    if (samePath(a.href)) {
      a.setAttribute("aria-current", "page");
    }
    li.appendChild(a);
    if (item.children && item.children.length) {
      var sub = document.createElement("ul");
      sub.className = "menu-children";
      item.children.forEach(function (child) {
        sub.appendChild(renderItem(child));
      });
      li.appendChild(sub);
    }
    return li;
  }

  function samePath(href) {
    try {
      var url = new URL(href, window.location.origin);
      var here = window.location.pathname.replace(/\/index\.html$/, "/");
      var there = url.pathname.replace(/\/index\.html$/, "/");
      return here === there;
    } catch (e) {
      return false;
    }
  }

  function paint(menu) {
    if (!menu) return;
    document.querySelectorAll("[data-cms-menu]").forEach(function (host) {
      var key = host.getAttribute("data-cms-menu");
      var items = (menu && menu[key]) || [];
      var list = host.querySelector("ul");
      if (!list) return;
      list.innerHTML = "";
      items.forEach(function (item) {
        list.appendChild(renderItem(item));
      });
      if (items.length === 0) {
        host.setAttribute("hidden", "");
      } else {
        host.removeAttribute("hidden");
      }
    });
    paintBranding(menu);
  }

  // Swap the wordmark for an <img> when the theme has a logo
  // configured. Falls back to the static text in every other case.
  function paintBranding(menu) {
    var branding = menu && menu.branding;
    var logoUrl = branding && branding.logoUrl;
    if (!logoUrl) return;
    document.querySelectorAll("[data-cms-brand]").forEach(function (host) {
      var alt = host.textContent || "";
      var img = document.createElement("img");
      img.src = logoUrl;
      img.alt = alt;
      // Tailwind utilities — keeps the logo a comfortable height
      // and proportional width without per-theme CSS rules.
      img.className = "h-8 w-auto";
      img.loading = "lazy";
      host.innerHTML = "";
      host.appendChild(img);
    });
  }

  function ensureCloseButton(menu) {
    if (menu.querySelector(".burger-close")) return menu.querySelector(".burger-close");
    var close = document.createElement("button");
    close.type = "button";
    close.className = "burger-close";
    close.setAttribute("aria-label", "Close menu");
    close.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    menu.insertBefore(close, menu.firstChild);
    return close;
  }

  function ensureBackdrop() {
    var existing = document.querySelector(".burger-backdrop");
    if (existing) return existing;
    var backdrop = document.createElement("div");
    backdrop.className = "burger-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function wireBurger() {
    var toggle = document.querySelector(".burger-toggle");
    var menu = document.getElementById("burger-menu");
    if (!toggle || !menu) return;

    var close = ensureCloseButton(menu);
    var backdrop = ensureBackdrop();

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      document.body.classList.toggle("burger-open", open);
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });
    close.addEventListener("click", function () {
      setOpen(false);
    });
    backdrop.addEventListener("click", function () {
      setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("pointerdown", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (menu.contains(e.target)) return;
      if (toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    wireBurger();
    fetchMenu().then(paint);
  });
})();
