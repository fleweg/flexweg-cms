import { decodeAttrs, escapeAttr } from "../util";

export interface GalleryAttrs {
  images: { url: string; alt: string }[];
}

export const DEFAULT_GALLERY: GalleryAttrs = { images: [] };

// Renders the gallery payload + a hydration script. The marker
// itself is replaced by NOTHING visible in the body — the loader
// finds the SingleTemplate's `[data-cms-mp-thumbs]` slot (under
// the hero image, by the gallery column) and populates it from a
// hidden <template> data island. Click on any thumb or the hero
// opens a lightbox slider with prev/next arrows + Esc to close.
export function renderGallery(attrs: GalleryAttrs): string {
  const imgs = (attrs.images ?? []).filter((i) => i && i.url);
  if (imgs.length === 0) return "";

  // Hidden <template> carrying the gallery JSON. We pick <template>
  // because its content stays inert (no requests, no rendering)
  // until the loader reads it. Escaping innerHTML twice (JSON +
  // entities) is enough — DOMPurify keeps <template> intact.
  const payload = `<template data-cms-mp-gallery>${JSON.stringify({ images: imgs }).replace(/</g, "\\u003c")}</template>`;

  // Loader script — populates the thumb strip, swaps the hero on
  // thumb click, builds + wires the lightbox. Self-contained:
  // appends the lightbox markup itself, no template-side wiring
  // needed beyond the existing `[data-cms-mp-thumbs]` slot.
  const script = `<script>(function(){
var tpl = document.querySelector('[data-cms-mp-gallery]');
if (!tpl) return;
var data; try { data = JSON.parse(tpl.innerHTML); } catch(e) { return; }
var galleryImgs = (data.images || []).filter(function(i){return i && i.url;});
if (galleryImgs.length === 0) return;

var hero = document.querySelector('.mp-product__hero-image');
var thumbsHost = document.querySelector('[data-cms-mp-thumbs]');

// Combine hero (slide 0) + gallery images (slides 1..n) for the
// lightbox slider. Allows clicking the hero to also open the
// zoom view.
var all = [];
if (hero && hero.src) all.push({ url: hero.src, alt: hero.alt || '' });
galleryImgs.forEach(function(g){ all.push({ url: g.url, alt: g.alt || '' }); });

// Populate the thumb strip — one per gallery image (the hero
// is its own visible image, no need to thumbnail it).
if (thumbsHost) {
  thumbsHost.removeAttribute('hidden');
  thumbsHost.innerHTML = '';
  galleryImgs.forEach(function(img, i){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mp-product__thumb';
    b.setAttribute('data-mp-lightbox-index', String(i + 1));
    var im = document.createElement('img');
    im.src = img.url;
    im.alt = img.alt;
    im.loading = 'lazy';
    b.appendChild(im);
    thumbsHost.appendChild(b);
  });
}

// Build the lightbox markup once and append to body. Idempotent —
// if a previous run already injected it (e.g. script re-evaluated
// in dev), we reuse the existing nodes.
var box = document.querySelector('.mp-lightbox');
if (!box) {
  box = document.createElement('div');
  box.className = 'mp-lightbox';
  box.setAttribute('hidden', '');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="mp-lightbox__close" aria-label="Close">' +
    '<span class="material-symbols-outlined">close</span></button>' +
    '<button class="mp-lightbox__prev" aria-label="Previous">' +
    '<span class="material-symbols-outlined">chevron_left</span></button>' +
    '<button class="mp-lightbox__next" aria-label="Next">' +
    '<span class="material-symbols-outlined">chevron_right</span></button>' +
    '<div class="mp-lightbox__stage"><img class="mp-lightbox__image" alt=""/></div>' +
    '<div class="mp-lightbox__counter"></div>';
  document.body.appendChild(box);
}

var lbImg = box.querySelector('.mp-lightbox__image');
var lbCounter = box.querySelector('.mp-lightbox__counter');
var current = 0;

function show(i){
  if (i < 0) i = all.length - 1;
  if (i >= all.length) i = 0;
  current = i;
  lbImg.src = all[i].url;
  lbImg.alt = all[i].alt || '';
  lbCounter.textContent = (i + 1) + ' / ' + all.length;
}
function open(i){
  show(i);
  box.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}
function close(){
  box.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

box.addEventListener('click', function(e){
  if (e.target === box) close();
});
box.querySelector('.mp-lightbox__close').addEventListener('click', close);
box.querySelector('.mp-lightbox__prev').addEventListener('click', function(){ show(current - 1); });
box.querySelector('.mp-lightbox__next').addEventListener('click', function(){ show(current + 1); });

document.addEventListener('keydown', function(e){
  if (box.hasAttribute('hidden')) return;
  if (e.key === 'Escape') close();
  else if (e.key === 'ArrowLeft') show(current - 1);
  else if (e.key === 'ArrowRight') show(current + 1);
});

// Wire openers — hero image + every thumb.
if (hero) {
  hero.style.cursor = 'zoom-in';
  hero.addEventListener('click', function(){ open(0); });
}
if (thumbsHost) {
  thumbsHost.addEventListener('click', function(e){
    var btn = e.target.closest('[data-mp-lightbox-index]');
    if (!btn) return;
    var i = parseInt(btn.getAttribute('data-mp-lightbox-index'), 10);
    if (!isNaN(i)) open(i);
  });
}
})();</script>`;

  return payload + script;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/gallery"[^>]*)>\s*<\/div>/g;

export function transformGallery(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<GalleryAttrs>(enc, DEFAULT_GALLERY);
    return renderGallery(attrs) || "";
  });
}

// Suppress unused warning — escapeAttr is no longer needed in this
// file but kept imported for symmetry with siblings.
escapeAttr;
