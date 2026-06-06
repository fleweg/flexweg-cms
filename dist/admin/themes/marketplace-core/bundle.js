import { jsx as d, jsxs as f, Fragment as ai } from "react/jsx-runtime";
import { i18n as K, pickPublicLocale as se, canonicalUrl as si, pickFormat as ae, FontSelect as mn, MediaPicker as li, pickMediaUrl as Ct } from "@flexweg/cms-runtime";
import R, { forwardRef as Vt, createElement as lt, useState as he, createRef as ci, memo as di, createContext as Gn, version as gn, useContext as pi, useRef as ui, useEffect as bn, useMemo as hi } from "react";
import { useTranslation as ee } from "react-i18next";
import fi, { flushSync as mi } from "react-dom";
const yn = `/* Marketplace Core — hand-written theme stylesheet (no Tailwind
   build for the external scaffold to keep \`npm install\` light). All
   rules use CSS variables for the Material 3 palette, so the
   Theme Settings → Style tab can swap them at upload time via
   compileCss. */
@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

:root {
  --color-background: 249 249 255;
  --color-surface: 249 249 255;
  --color-surface-container-lowest: 255 255 255;
  --color-surface-container-low: 241 243 255;
  --color-surface-container: 233 237 255;
  --color-surface-container-high: 227 232 249;
  --color-surface-container-highest: 221 226 243;
  --color-on-surface: 22 28 40;
  --color-on-surface-variant: 67 70 85;
  --color-outline: 116 118 134;
  --color-outline-variant: 196 197 215;
  --color-primary: 0 55 176;
  --color-on-primary: 255 255 255;
  --color-primary-container: 29 78 216;
  --color-on-primary-container: 202 211 255;
  --color-secondary: 70 72 212;
  --color-on-secondary: 255 255 255;
  --color-tertiary: 101 0 174;
  --color-on-tertiary: 255 255 255;
  --color-success: 46 125 50;
  --color-success-container: 232 245 233;
  --font-headline: "Hanken Grotesk";
  --font-body: "Inter";
}

/* ───── Reset / base ───── */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: rgb(var(--color-background));
  color: rgb(var(--color-on-surface));
  font-family: var(--font-body), Inter, system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; height: auto; }
button {
  font-family: inherit;
  cursor: pointer;
  border: 0;
  background: transparent;
  padding: 0;
}

/* ───── Material Symbols ───── */
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  vertical-align: middle;
  line-height: 1;
  font-size: 24px;
}

/* ───── Typography helpers ───── */
.font-headline {
  font-family: var(--font-headline), "Hanken Grotesk", system-ui, sans-serif;
}
.text-display-lg {
  font-size: 48px; line-height: 1.1; font-weight: 800; letter-spacing: -0.02em;
}
.text-headline-lg { font-size: 32px; line-height: 1.2; font-weight: 700; letter-spacing: -0.01em; }
.text-headline-md { font-size: 24px; line-height: 1.3; font-weight: 600; }
.text-body-lg { font-size: 18px; line-height: 1.6; }
.text-body-md { font-size: 16px; line-height: 1.5; }
.text-label-md { font-size: 14px; font-weight: 600; line-height: 1; letter-spacing: 0.02em; }
@media (max-width: 768px) {
  .text-display-lg { font-size: 36px; }
  .text-headline-lg { font-size: 28px; }
}

/* ───── Layout shell ───── */
.mp-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.mp-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(var(--color-surface));
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  /* Scroll-hide: the inline script in BaseLayout toggles
     \`.is-hidden\` based on scroll direction (down → hide, up or
     near top → show). We use translateY rather than display so
     the transition runs smoothly. \`will-change\` hints the
     browser to keep this on a compositing layer. */
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.mp-header.is-hidden {
  transform: translateY(-100%);
  box-shadow: none;
}
.mp-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  gap: 24px;
}
.mp-brand {
  font-family: var(--font-headline);
  font-size: 28px;
  font-weight: 800;
  color: rgb(var(--color-primary));
  letter-spacing: -0.01em;
}
.mp-header__nav {
  display: none;
  align-items: center;
  gap: 24px;
}
.mp-nav-link {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-on-surface-variant));
  padding: 8px 12px;
  border-radius: 9999px;
  transition: background 0.2s, color 0.2s;
}
.mp-nav-link:hover { background: rgb(var(--color-surface-container)); color: rgb(var(--color-on-surface)); }
.mp-nav-link.is-active { background: rgb(var(--color-primary)); color: rgb(var(--color-on-primary)); }
.mp-header__langswitch {
  /* Sits between the nav and the search input. Collapsed when
     the multilang plugin hasn't injected entries yet (empty
     attribute) so it doesn't push spacing around. */
  --cms-langswitch-on: rgb(var(--color-on-primary));
  color: rgb(var(--color-on-surface-variant));
  margin-left: 8px;
}
.mp-header__langswitch[data-cms-langswitch-empty] { display: none; }
.mp-header__langswitch .cms-langswitch__current { background: rgb(var(--color-primary)); }
.mp-footer__langswitch {
  --cms-langswitch-on: rgb(var(--color-on-primary));
  color: rgb(var(--color-on-surface-variant));
  margin-right: 12px;
}
.mp-footer__langswitch[data-cms-langswitch-empty] { display: none; }
.mp-footer__langswitch .cms-langswitch__current { background: rgb(var(--color-primary)); }

.mp-header__search {
  flex: 1;
  max-width: 480px;
  display: none;
}
.mp-search-input {
  width: 100%;
  background: rgb(var(--color-surface-container));
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: rgb(var(--color-on-surface));
  outline: none;
  cursor: pointer;
  text-overflow: ellipsis;
}
.mp-search-input:hover {
  background: rgb(var(--color-surface-container-high));
}
.mp-search-input:focus {
  border-color: rgb(var(--color-primary));
  background: rgb(var(--color-surface-container-lowest));
}
@media (min-width: 768px) {
  .mp-header__nav { display: flex; }
  .mp-header__search { display: block; }
}

.mp-layout {
  display: flex;
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  gap: 24px;
}
@media (min-width: 768px) {
  .mp-layout { padding: 0 24px; }
}

.mp-sidebar {
  display: none;
  width: 280px;
  flex-shrink: 0;
  padding-top: 24px;
}
@media (min-width: 1024px) {
  .mp-sidebar {
    display: block;
    position: sticky;
    top: 88px;
    height: calc(100vh - 88px);
    overflow-y: auto;
  }
}
.mp-sidebar__heading {
  font-family: var(--font-headline);
  font-size: 24px;
  font-weight: 700;
  color: rgb(var(--color-on-surface));
  margin: 0 0 16px 8px;
}
.mp-sidebar__group { margin-bottom: 24px; }
.mp-sidebar__label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--color-on-surface-variant));
  padding: 0 12px;
  margin-bottom: 8px;
}
.mp-sidebar__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--color-on-surface-variant));
  transition: background 0.15s, color 0.15s;
}
.mp-sidebar__link:hover { background: rgb(var(--color-surface-container)); color: rgb(var(--color-on-surface)); }
.mp-sidebar__link.is-active { background: rgb(var(--color-primary-container)); color: rgb(var(--color-on-primary-container)); }
.mp-sidebar__link .material-symbols-outlined { font-size: 20px; }

.mp-main {
  flex: 1;
  min-width: 0;
  padding: 24px 0 64px;
}

/* ───── Cards (product card — Level 1 elevation) ───── */
.mp-card {
  background: rgb(var(--color-surface-container-lowest));
  border-radius: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: block;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.mp-card:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
.mp-card__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: rgb(var(--color-surface-container));
  object-fit: cover;
}
.mp-card__body { padding: 20px 24px 24px; }
.mp-card__category {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--color-primary));
  margin-bottom: 6px;
}
.mp-card__title {
  font-family: var(--font-headline);
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--color-on-surface));
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}
.mp-card__excerpt {
  font-size: 14px;
  color: rgb(var(--color-on-surface-variant));
  margin: 0 0 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mp-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.mp-card__author {
  font-size: 13px;
  color: rgb(var(--color-on-surface-variant));
  display: flex;
  align-items: center;
  gap: 8px;
}
.mp-badge-free {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--color-success));
  background: rgb(var(--color-success-container));
  padding: 4px 10px;
  border-radius: 9999px;
}

/* ───── Grid layouts ───── */
.mp-grid { display: grid; gap: 24px; }
.mp-grid--3 { grid-template-columns: 1fr; }
@media (min-width: 640px) { .mp-grid--3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .mp-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.mp-grid--2 { grid-template-columns: 1fr; }
@media (min-width: 768px) { .mp-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

.mp-section { margin-bottom: 64px; }
.mp-section__heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}
.mp-section__heading h2 {
  font-family: var(--font-headline);
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}
.mp-section__see-all {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-primary));
}

/* ───── Hero banner ───── */
.mp-hero {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-tertiary)) 100%);
  border-radius: 32px;
  overflow: hidden;
  padding: 56px 48px;
  color: rgb(var(--color-on-primary));
  margin-bottom: 64px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.mp-hero__eyebrow {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 12px;
}
.mp-hero h1 {
  font-family: var(--font-headline);
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  max-width: 680px;
}
@media (min-width: 768px) {
  .mp-hero h1 { font-size: 48px; }
}
.mp-hero p {
  font-size: 18px;
  line-height: 1.6;
  max-width: 580px;
  opacity: 0.95;
  margin: 0 0 24px;
}

/* ───── Buttons ───── */
.mp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 9999px;
  padding: 14px 28px;
  transition: opacity 0.15s, transform 0.1s, box-shadow 0.2s;
  min-height: 48px;
}
.mp-btn:active { transform: scale(0.98); }
a.mp-btn { text-decoration: none; }
.mp-btn.mp-btn--primary {
  background: rgb(var(--color-primary));
  color: rgb(var(--color-on-primary));
  box-shadow: 0 6px 20px rgba(0, 55, 176, 0.25);
}
.mp-btn.mp-btn--primary:hover { opacity: 0.92; color: rgb(var(--color-on-primary)); }
.mp-btn.mp-btn--secondary {
  background: rgb(var(--color-surface-container));
  color: rgb(var(--color-primary));
  border: 1px solid rgb(var(--color-outline-variant));
}
.mp-btn.mp-btn--secondary:hover { background: rgb(var(--color-surface-container-high)); }
.mp-btn.mp-btn--ghost {
  background: rgb(var(--color-surface));
  color: rgb(var(--color-on-surface));
}
.mp-btn.mp-btn--ghost:hover { background: rgb(var(--color-surface-container)); }

/* ───── Single page ───── */
.mp-product {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 64px;
}
@media (min-width: 1024px) {
  .mp-product { grid-template-columns: 7fr 5fr; }
}
.mp-product__gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mp-product__hero-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: rgb(var(--color-surface-container));
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}
.mp-product__thumbs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.mp-product__thumb {
  aspect-ratio: 1 / 1;
  background: rgb(var(--color-surface-container));
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}
.mp-product__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mp-product__thumb:hover, .mp-product__thumb.is-active { border-color: rgb(var(--color-primary)); }
.mp-product__hero-image { cursor: zoom-in; }

.mp-product__info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mp-product__category {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--color-primary));
}
.mp-product__title {
  font-family: var(--font-headline);
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}
.mp-product__author {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgb(var(--color-on-surface-variant));
  font-size: 14px;
}
.mp-product__author img {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  object-fit: cover;
  background: rgb(var(--color-surface-container));
}
.mp-product__excerpt {
  font-size: 18px;
  line-height: 1.6;
  color: rgb(var(--color-on-surface-variant));
}
.mp-product__cta-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.mp-product__cta-row .mp-btn { flex: 1; }

/* ───── Sections inside single (description, body prose) ───── */
.mp-section-heading {
  font-family: var(--font-headline);
  font-size: 24px;
  font-weight: 700;
  border-bottom: 1px solid rgb(var(--color-outline-variant));
  padding-bottom: 16px;
  margin: 48px 0 24px;
}
.mp-prose {
  font-size: 16px;
  line-height: 1.7;
  color: rgb(var(--color-on-surface));
  max-width: 720px;
}
.mp-prose p { margin: 0 0 16px; }
.mp-prose h2 {
  font-family: var(--font-headline);
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 16px;
}
.mp-prose h3 {
  font-family: var(--font-headline);
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
}
.mp-prose ul, .mp-prose ol { padding-left: 24px; margin: 0 0 16px; }
.mp-prose ul { list-style: disc; }
.mp-prose ol { list-style: decimal; }
.mp-prose li { margin-bottom: 6px; }
.mp-prose a {
  color: rgb(var(--color-primary));
  text-decoration: underline;
  text-underline-offset: 3px;
}
.mp-prose img {
  border-radius: 16px;
  margin: 24px 0;
}
.mp-prose code {
  background: rgb(var(--color-surface-container));
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: ui-monospace, Menlo, monospace;
}
.mp-prose pre {
  background: rgb(var(--color-surface-container));
  padding: 16px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 16px 0;
}

/* ───── Specs block ───── */
.mp-specs {
  background: rgb(var(--color-surface-container-lowest));
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}
.mp-specs__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
}
@media (max-width: 640px) {
  .mp-specs__grid { grid-template-columns: 1fr; }
}
.mp-specs__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mp-specs__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--color-on-surface-variant));
}
.mp-specs__value {
  font-size: 16px;
  color: rgb(var(--color-on-surface));
  font-weight: 500;
}

/* ───── Features bento ───── */
.mp-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .mp-features { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.mp-features__item {
  background: rgb(var(--color-surface-container-lowest));
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mp-features__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgb(var(--color-primary-container));
  color: rgb(var(--color-on-primary-container));
  display: flex;
  align-items: center;
  justify-content: center;
}
.mp-features__icon .material-symbols-outlined { font-size: 28px; color: rgb(var(--color-on-primary));}
.mp-features__title {
  font-family: var(--font-headline);
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

/* ───── Author profile card ───── */
.mp-author-card {
  background: rgb(var(--color-surface-container-lowest));
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
}
@media (min-width: 768px) {
  .mp-author-card { flex-direction: row; align-items: flex-start; }
}
.mp-author-card__avatar {
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  background: rgb(var(--color-surface-container));
  object-fit: cover;
  flex-shrink: 0;
}
.mp-author-card__info { flex: 1; text-align: center; }
@media (min-width: 768px) { .mp-author-card__info { text-align: left; } }
.mp-author-card__name {
  font-family: var(--font-headline);
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
}
.mp-author-card__title {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-primary));
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mp-author-card__bio { color: rgb(var(--color-on-surface-variant)); margin: 0; }

/* ───── Breadcrumb ───── */
.mp-breadcrumb {
  font-size: 13px;
  color: rgb(var(--color-on-surface-variant));
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.mp-breadcrumb a:hover { color: rgb(var(--color-primary)); }
.mp-breadcrumb__sep { opacity: 0.6; }

/* ───── Footer ───── */
.mp-footer {
  background: rgb(var(--color-surface));
  padding: 48px 24px 32px;
  border-top: 1px solid rgb(var(--color-outline-variant));
}
.mp-footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@media (min-width: 768px) {
  .mp-footer__inner { flex-direction: row; align-items: center; justify-content: space-between; }
}
.mp-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.mp-footer__nav a {
  font-size: 14px;
  color: rgb(var(--color-on-surface-variant));
}
.mp-footer__nav a:hover { color: rgb(var(--color-primary)); }
.mp-footer__copyright {
  font-size: 13px;
  color: rgb(var(--color-on-surface-variant));
}

/* ───── Mobile bottom nav ───── */
.mp-bottom-nav {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(var(--color-surface));
  border-top: 1px solid rgb(var(--color-outline-variant));
  z-index: 40;
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  /* Scroll-hide: paired with \`.mp-header\` via the same script.
     Slides off the bottom of the viewport when the user scrolls
     down, slides back when they reverse or land near the top. */
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.mp-bottom-nav.is-hidden {
  transform: translateY(100%);
}
@media (min-width: 1024px) { .mp-bottom-nav { display: none; } }
.mp-bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: rgb(var(--color-on-surface-variant));
  padding: 8px 4px;
}
.mp-bottom-nav__item.is-active { color: rgb(var(--color-primary)); }
.mp-bottom-nav__item .material-symbols-outlined { font-size: 24px; }

/* Add bottom padding on mobile main canvas so content doesn't sit
   under the bottom nav. */
@media (max-width: 1023px) {
  .mp-app { padding-bottom: 72px; }
}

/* ───── Filter tabs ───── */
.mp-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgb(var(--color-outline-variant));
  overflow-x: auto;
}
.mp-tabs__tab {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-on-surface-variant));
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.mp-tabs__tab.is-active {
  color: rgb(var(--color-primary));
  border-bottom-color: rgb(var(--color-primary));
}

/* ───── 404 ───── */
.mp-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 96px 24px;
  gap: 16px;
}
.mp-404 .material-symbols-outlined {
  font-size: 80px;
  color: rgb(var(--color-primary));
}
.mp-404 h1 {
  font-family: var(--font-headline);
  font-size: 48px;
  font-weight: 800;
  margin: 0;
}

/* ───── Static page body ───── */
.mp-page-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 0;
}
.mp-page-body h1 {
  font-family: var(--font-headline);
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 32px;
}

/* ───── Lightbox (gallery zoom) ───── */
.mp-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  padding: 24px;
  animation: mp-lightbox-fade 0.18s ease-out;
}
.mp-lightbox[hidden] { display: none; }
@keyframes mp-lightbox-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.mp-lightbox__stage {
  position: relative;
  max-width: min(1200px, 100%);
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mp-lightbox__image {
  max-width: 100%;
  max-height: calc(100vh - 96px);
  width: auto;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  object-fit: contain;
  user-select: none;
}
.mp-lightbox__close,
.mp-lightbox__prev,
.mp-lightbox__next {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  backdrop-filter: blur(8px);
}
.mp-lightbox__close:hover,
.mp-lightbox__prev:hover,
.mp-lightbox__next:hover {
  background: rgba(255, 255, 255, 0.22);
}
.mp-lightbox__close:active,
.mp-lightbox__prev:active,
.mp-lightbox__next:active {
  transform: scale(0.94);
}
.mp-lightbox__close {
  top: 20px;
  right: 20px;
}
.mp-lightbox__prev {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.mp-lightbox__next {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.mp-lightbox__prev:active { transform: translateY(-50%) scale(0.94); }
.mp-lightbox__next:active { transform: translateY(-50%) scale(0.94); }
.mp-lightbox__prev .material-symbols-outlined,
.mp-lightbox__next .material-symbols-outlined,
.mp-lightbox__close .material-symbols-outlined {
  font-size: 28px;
}
.mp-lightbox__counter {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}
@media (max-width: 640px) {
  .mp-lightbox { padding: 12px; }
  .mp-lightbox__close,
  .mp-lightbox__prev,
  .mp-lightbox__next {
    width: 40px;
    height: 40px;
  }
  .mp-lightbox__close { top: 12px; right: 12px; }
  .mp-lightbox__prev { left: 12px; }
  .mp-lightbox__next { right: 12px; }
  .mp-lightbox__image { max-height: calc(100vh - 72px); }
}

/* ─────────────────────────────────────────────────────────────────
   Landing surfaces (v1.3.0) — used by the marketplace home page.
   All blocks: full-width sections, max-width inner column, generous
   vertical padding that breathes on desktop and condenses on mobile.
   ────────────────────────────────────────────────────────────────── */

/* Shared section primitives */
.mp-section-heading {
  font-family: var(--font-headline);
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgb(var(--color-on-surface));
  margin: 0 0 12px;
  text-align: center;
}
.mp-section-sub {
  font-size: 16px;
  color: rgb(var(--color-on-surface-variant));
  margin: 0 auto 40px;
  text-align: center;
  max-width: 640px;
  line-height: 1.55;
}

/* ── Landing hero ───────────────────────────────────────────────── */
/* Single-column on every viewport: copy on top, visual below.
   padding-top: 0 keeps the hero flush against the header so the
   first thing the visitor sees is the headline, not whitespace. */
.mp-hero-x {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: center;
  padding: 0 0 56px;
  margin-bottom: 24px;
}
@media (min-width: 900px) {
  .mp-hero-x {
    gap: 48px;
    padding: 0 0 96px;
  }
}
.mp-hero-x__eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: rgb(var(--color-primary));
  margin: 0 0 16px;
}
.mp-hero-x__headline {
  font-family: var(--font-headline);
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgb(var(--color-on-surface));
  margin: 0 0 20px;
}
.mp-hero-x__sub {
  font-size: clamp(16px, 1.2vw, 19px);
  color: rgb(var(--color-on-surface-variant));
  line-height: 1.55;
  margin: 0 0 28px;
  max-width: 540px;
}
.mp-hero-x__ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.mp-hero-x__visual {
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 30px 60px -20px rgb(0 0 0 / 25%),
    0 0 0 1px rgb(var(--color-surface-container));
  background: rgb(var(--color-surface-container));
}
.mp-hero-x__visual img {
  display: block;
  width: 100%;
  height: auto;
}

/* ── Stats bar ──────────────────────────────────────────────────── */
.mp-stats {
  padding: 24px 0;
  margin: 8px 0 16px;
}
.mp-stats__row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 28px 32px;
  background: rgb(var(--color-surface-container-low));
  border: 1px solid rgb(var(--color-surface-container));
  border-radius: 16px;
}
@media (min-width: 720px) {
  .mp-stats__row {
    grid-template-columns: repeat(4, 1fr);
  }
}
.mp-stats__cell { text-align: center; }
.mp-stats__value {
  font-family: var(--font-headline);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgb(var(--color-on-surface));
  margin: 0 0 4px;
}
.mp-stats__label {
  font-size: 13px;
  color: rgb(var(--color-on-surface-variant));
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Feature grid (3-col cards) ─────────────────────────────────── */
.mp-grid-feat {
  padding: 64px 0;
}
.mp-grid-feat__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 720px) {
  .mp-grid-feat__row { grid-template-columns: repeat(3, 1fr); }
}
.mp-grid-feat__card {
  padding: 28px;
  background: rgb(var(--color-surface-container-low));
  border: 1px solid rgb(var(--color-surface-container));
  border-radius: 16px;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
}
.mp-grid-feat__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px -16px rgb(0 0 0 / 30%);
  border-color: rgb(var(--color-primary) / 30%);
}
.mp-grid-feat__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgb(var(--color-primary) / 12%);
  color: rgb(var(--color-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.mp-grid-feat__icon .material-symbols-outlined {
  font-size: 28px;
}
.mp-grid-feat__title {
  font-family: var(--font-headline);
  font-size: 19px;
  font-weight: 700;
  color: rgb(var(--color-on-surface));
  margin: 0 0 8px;
}
.mp-grid-feat__body {
  font-size: 15px;
  color: rgb(var(--color-on-surface-variant));
  margin: 0;
  line-height: 1.55;
}

/* ── Feature row (text on top, image below) ────────────────────── */
/* Stacked single-column on every viewport. The DOM has the image
   first for legacy reasons (kept for backward compat with v1.3.0
   exports); CSS \`order\` flips it so the copy always reads above
   the visual — matches the mobile-style flow the design specifies
   even on desktop. The \`imagePosition\` attribute is preserved on
   the wrapper for any future visual treatment but doesn't affect
   layout anymore. */
.mp-row-feat {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: stretch;
  padding: 56px 0;
}
.mp-row-feat__copy { order: 0; }
.mp-row-feat__visual { order: 1; }
.mp-row-feat__eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: rgb(var(--color-primary));
  margin: 0 0 14px;
}
.mp-row-feat__headline {
  font-family: var(--font-headline);
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgb(var(--color-on-surface));
  margin: 0 0 16px;
}
.mp-row-feat__body {
  font-size: 16px;
  color: rgb(var(--color-on-surface-variant));
  line-height: 1.6;
  margin: 0 0 20px;
}
.mp-row-feat__bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}
.mp-row-feat__bullets li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  font-size: 15px;
  color: rgb(var(--color-on-surface));
}
.mp-row-feat__bullets .material-symbols-outlined {
  color: rgb(var(--color-primary));
  font-size: 20px;
  margin-top: 2px;
  flex-shrink: 0;
}
.mp-row-feat__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgb(var(--color-primary));
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
}
.mp-row-feat__cta:hover { opacity: 0.85; text-decoration: none; }
/* Belt-and-braces — explicitly suppress underline on every landing-
   block button. \`a.mp-btn\` already declares \`text-decoration: none\`
   globally, but some user-agent stylesheets (Safari mainly) re-add
   it on hover or focus, so we pin it here per surface. */
.mp-hero-x .mp-btn,
.mp-hero-x .mp-btn:hover,
.mp-hero-x .mp-btn:focus,
.mp-row-feat__cta,
.mp-row-feat__cta:hover,
.mp-row-feat__cta:focus,
.mp-cta-banner .mp-btn,
.mp-cta-banner .mp-btn:hover,
.mp-cta-banner .mp-btn:focus { text-decoration: none; }
.mp-row-feat__visual {
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 50px -20px rgb(0 0 0 / 20%),
    0 0 0 1px rgb(var(--color-surface-container));
  background: rgb(var(--color-surface-container));
}
.mp-row-feat__visual img {
  display: block;
  width: 100%;
  height: auto;
}

/* ── CTA banner ─────────────────────────────────────────────────── */
.mp-cta-banner {
  padding: 56px 0;
}
.mp-cta-banner__inner {
  padding: 56px 32px;
  background:
    linear-gradient(135deg,
      rgb(var(--color-primary) / 92%),
      rgb(var(--color-primary-container) / 75%));
  border-radius: 24px;
  text-align: center;
  color: rgb(var(--color-on-primary));
}
.mp-cta-banner__headline {
  font-family: var(--font-headline);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  color: rgb(var(--color-on-primary));
}
.mp-cta-banner__body {
  font-size: 16px;
  opacity: 0.92;
  margin: 0 auto 28px;
  max-width: 560px;
  line-height: 1.55;
}
.mp-cta-banner__ctas {
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.mp-cta-banner .mp-btn--primary {
  background: rgb(var(--color-on-primary));
  color: rgb(var(--color-primary));
}
.mp-cta-banner .mp-btn--primary:hover { opacity: 0.92; }
.mp-cta-banner .mp-btn--ghost {
  background: transparent;
  color: rgb(var(--color-on-primary));
  border: 1px solid rgb(var(--color-on-primary) / 50%);
}
.mp-cta-banner .mp-btn--ghost:hover {
  background: rgb(var(--color-on-primary) / 12%);
}

/* ─────────────────────────────────────────────────────────────────
 * No-image card variant — used by ProductCard when card.hero is
 * absent (typical for imported docs). Drops the 16:10 image slot,
 * adds top padding to compensate, hides the Free-badge footer.
 * The category line becomes more prominent so the card still feels
 * intentional rather than a stripped-down product card.
 * ───────────────────────────────────────────────────────────────── */
.mp-card--no-image .mp-card__image { display: none; }
.mp-card--no-image .mp-card__body { padding: 28px 24px; }
.mp-card--no-image .mp-card__category {
  font-size: 12px;
  margin-bottom: 10px;
}
.mp-card--no-image .mp-card__title {
  font-size: 20px;
  margin-bottom: 8px;
}
.mp-card--no-image .mp-card__excerpt {
  -webkit-line-clamp: 3;
  margin: 0;
}
.mp-card--no-image .mp-card__footer { display: none; }

/* ─────────────────────────────────────────────────────────────────
 * Documentation single-post layout — used when the post has no
 * hero image. Centered reading column, no product chrome (no
 * download/CTA slot, no gallery, no Free badge). Includes a
 * breadcrumb at the top and prev/next sibling navigation at the
 * bottom.
 * ───────────────────────────────────────────────────────────────── */
.mp-doc {
  max-width: 760px;
  margin: 0 auto;
  padding: 8px 0 64px;
}
.mp-doc__header {
  margin: 24px 0 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgb(var(--color-outline-variant));
}
.mp-doc__title {
  font-family: var(--font-headline);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: rgb(var(--color-on-surface));
  margin: 0 0 12px;
}
.mp-doc__excerpt {
  font-size: 17px;
  line-height: 1.55;
  color: rgb(var(--color-on-surface-variant));
  margin: 0;
}
.mp-doc__body { margin-top: 8px; }

/* Prev / Next sibling pager at the bottom of a doc page. Two-cell
 * grid on desktop; stacks on mobile. The non-existing side (e.g.
 * "no previous post on the first page") gets a placeholder <span/>
 * so the grid stays balanced and the next button keeps its right
 * alignment. */
.mp-doc__pagerow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 56px;
  padding-top: 28px;
  border-top: 1px solid rgb(var(--color-outline-variant));
}
.mp-doc__pager {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 22px;
  border-radius: 16px;
  background: rgb(var(--color-surface-container-lowest));
  border: 1px solid rgb(var(--color-outline-variant));
  text-decoration: none;
  color: rgb(var(--color-on-surface));
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.mp-doc__pager:hover {
  background: rgb(var(--color-surface-container-low));
  border-color: rgb(var(--color-primary) / 40%);
  transform: translateY(-1px);
}
.mp-doc__pager--next {
  text-align: right;
  align-items: flex-end;
}
.mp-doc__pager-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgb(var(--color-primary));
}
.mp-doc__pager-title {
  font-family: var(--font-headline);
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--color-on-surface));
  line-height: 1.35;
}
@media (max-width: 600px) {
  .mp-doc__pagerow {
    grid-template-columns: 1fr;
  }
  .mp-doc__pager--next { text-align: left; align-items: flex-start; }
}

/* ─────────────────────────────────────────────────────────────────
 * Documentation prose enhancements — applied to .mp-prose content
 * inside .mp-doc (the no-hero doc layout). Three pieces:
 *   - Admonition boxes (rewritten from blockquote-with-strong)
 *   - Code blocks (chrome + dark background + copy button)
 *   - Tables (proper borders, header bg, zebra rows)
 * ───────────────────────────────────────────────────────────────── */

/* ── Admonitions ──────────────────────────────────────────────── */
.mp-admonition {
  margin: 24px 0;
  border-radius: 12px;
  padding: 16px 18px;
  border-left: 4px solid;
  background: rgb(var(--color-surface-container-low));
  color: rgb(var(--color-on-surface));
  display: block;
}
.mp-admonition__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 8px;
  letter-spacing: -0.005em;
}
.mp-admonition__icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
  opacity: 0.18;
  position: relative;
}
.mp-admonition__icon::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: currentColor;
  opacity: 1;
  transform: scale(0.35);
}
.mp-admonition__body {
  font-size: 15px;
  line-height: 1.6;
}
.mp-admonition__body > :first-child { margin-top: 0; }
.mp-admonition__body > :last-child { margin-bottom: 0; }

/* Per-kind colors. Borders + title color shift; body stays neutral
 * so the box doesn't fight for attention with the surrounding prose. */
.mp-admonition--info {
  border-left-color: rgb(60 130 246);
  background: rgb(60 130 246 / 6%);
}
.mp-admonition--info .mp-admonition__title { color: rgb(30 80 200); }
.mp-admonition--tip {
  border-left-color: rgb(34 156 99);
  background: rgb(34 156 99 / 6%);
}
.mp-admonition--tip .mp-admonition__title { color: rgb(22 110 70); }
.mp-admonition--warning {
  border-left-color: rgb(217 134 23);
  background: rgb(217 134 23 / 8%);
}
.mp-admonition--warning .mp-admonition__title { color: rgb(160 92 0); }
.mp-admonition--danger {
  border-left-color: rgb(225 67 67);
  background: rgb(225 67 67 / 7%);
}
.mp-admonition--danger .mp-admonition__title { color: rgb(166 38 38); }
.mp-admonition--note {
  border-left-color: rgb(110 90 200);
  background: rgb(110 90 200 / 6%);
}
.mp-admonition--note .mp-admonition__title { color: rgb(80 60 175); }

/* Dark-mode adjustments: lift the title color toward the lighter
 * end of the swatch so contrast against the dark background stays
 * comfortable. Backgrounds keep their tinted look. */
@media (prefers-color-scheme: dark) {
  .mp-admonition { background: rgb(255 255 255 / 4%); }
  .mp-admonition--info .mp-admonition__title { color: rgb(140 175 255); }
  .mp-admonition--tip .mp-admonition__title { color: rgb(120 200 160); }
  .mp-admonition--warning .mp-admonition__title { color: rgb(245 190 100); }
  .mp-admonition--danger .mp-admonition__title { color: rgb(250 140 140); }
  .mp-admonition--note .mp-admonition__title { color: rgb(180 165 245); }
}

/* ── Code blocks ──────────────────────────────────────────────── */
.mp-codeblock {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgb(20 23 32);
  border: 1px solid rgb(36 40 52);
}
.mp-codeblock__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: rgb(28 32 44);
  border-bottom: 1px solid rgb(40 44 60);
}
.mp-codeblock__lang {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgb(160 168 190);
  text-transform: uppercase;
}
.mp-codeblock__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgb(60 65 82);
  color: rgb(200 205 220);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;
}
.mp-codeblock__copy:hover {
  background: rgb(40 44 60);
  border-color: rgb(90 95 115);
}
.mp-codeblock__copy:active { transform: translateY(1px); }
.mp-codeblock__copy.is-copied {
  background: rgb(34 156 99 / 18%);
  border-color: rgb(34 156 99);
  color: rgb(160 220 195);
}
.mp-codeblock__copy-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: currentColor;
  opacity: 0.7;
  position: relative;
}
.mp-codeblock__copy-icon::before {
  content: "";
  position: absolute;
  inset: -3px -3px 3px 3px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  background: transparent;
  opacity: 0.5;
}
.mp-codeblock > pre {
  margin: 0;
  padding: 16px 18px;
  background: transparent;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, "Cascadia Code", monospace;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgb(225 228 240);
}
.mp-codeblock > pre > code {
  background: transparent;
  padding: 0;
  font-family: inherit;
  color: inherit;
}

/* Inline code (NOT inside pre) — kept light + neutral so it pops
 * against the body text without competing with the code-block chrome. */
.mp-prose :not(pre) > code,
.mp-prose code:not(pre code) {
  background: rgb(0 0 0 / 6%);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.92em;
  color: rgb(180 60 110);
}
@media (prefers-color-scheme: dark) {
  .mp-prose :not(pre) > code,
  .mp-prose code:not(pre code) {
    background: rgb(255 255 255 / 8%);
    color: rgb(245 145 185);
  }
}

/* ── Tables ───────────────────────────────────────────────────── */
.mp-prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 14.5px;
  background: rgb(var(--color-surface-container-lowest));
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgb(var(--color-outline-variant));
}
.mp-prose thead {
  background: rgb(var(--color-surface-container-low));
}
.mp-prose thead th {
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  padding: 12px 14px;
  color: rgb(var(--color-on-surface));
  border-bottom: 1px solid rgb(var(--color-outline-variant));
}
.mp-prose tbody td {
  padding: 11px 14px;
  vertical-align: top;
  color: rgb(var(--color-on-surface));
  border-bottom: 1px solid rgb(var(--color-outline-variant));
}
.mp-prose tbody tr:last-child td { border-bottom: 0; }
.mp-prose tbody tr:nth-child(even) {
  background: rgb(var(--color-surface-container-low) / 50%);
}
.mp-prose tbody tr:hover {
  background: rgb(var(--color-primary) / 4%);
}
.mp-prose table code {
  font-size: 0.88em;
}

/* Responsive overflow — narrow viewports get a horizontal scroll
 * around the table instead of mangled wrapping. The .mp-prose
 * wrapper already has overflow:auto on small screens via the
 * existing rule, but we add a safety here for direct table
 * children too. */
@media (max-width: 720px) {
  .mp-prose table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  .mp-prose tbody td { white-space: normal; }
}
`;
function Jt(n) {
  if (!n) return "";
  const e = n.replace(/^\/+/, "").replace(/\/?index\.html?$/i, "");
  return e ? `/${e}` : "";
}
function gi(n, e) {
  return n || e || "en";
}
function Kn(n, e) {
  if (!e || !n.labels) return n.label;
  if (n.labels[e]) return n.labels[e];
  const t = e.includes("-") ? e.split("-")[0] : null;
  return t && n.labels[t] ? n.labels[t] : n.label;
}
function bi({
  site: n,
  currentPath: e,
  currentLocale: t
}) {
  var u;
  const { settings: r, resolvedMenus: i } = n, o = K.getFixedT(
    se(t || r.language),
    "theme-marketplace-core"
  ), a = n.themeConfig, s = ((u = a == null ? void 0 : a.brand.wordmark) == null ? void 0 : u.trim()) || r.title, l = i.header.slice(0, 5), c = n.homePath ?? "/index.html";
  function p(h) {
    if (!e) return !1;
    const m = ("/" + e).replace(/\/index\.html$/, "/"), b = h.replace(/\/index\.html$/, "/");
    return m === b;
  }
  return /* @__PURE__ */ d("header", { className: "mp-header", children: /* @__PURE__ */ f("div", { className: "mp-header__inner", children: [
    /* @__PURE__ */ d("a", { className: "mp-brand font-headline", href: c, children: s }),
    /* @__PURE__ */ d("nav", { className: "mp-header__nav", "aria-label": "Primary", children: l.map((h) => /* @__PURE__ */ d(
      "a",
      {
        className: `mp-nav-link${p(h.href) ? " is-active" : ""}`,
        href: h.href,
        children: Kn(h, t)
      },
      h.id
    )) }),
    /* @__PURE__ */ d(
      "div",
      {
        className: "mp-header__langswitch",
        "data-cms-langswitch": "header",
        "data-cms-langswitch-empty": !0
      }
    ),
    /* @__PURE__ */ d("div", { className: "mp-header__search", children: /* @__PURE__ */ d(
      "input",
      {
        type: "search",
        className: "mp-search-input",
        placeholder: o("publicBaked.nav.themes") + " · " + o("publicBaked.nav.plugins"),
        "aria-label": "Search",
        "data-cms-search": !0,
        readOnly: !0,
        role: "button"
      }
    ) })
  ] }) });
}
function yi({
  site: n,
  currentLocale: e
}) {
  var s, l;
  const { settings: t, resolvedMenus: r } = n, i = n.themeConfig, o = ((s = i == null ? void 0 : i.footer.copyright) == null ? void 0 : s.trim()) || `© ${(/* @__PURE__ */ new Date()).getFullYear()} ${t.title}.`, a = n.homePath ?? "/index.html";
  return /* @__PURE__ */ d("footer", { className: "mp-footer", children: /* @__PURE__ */ f("div", { className: "mp-footer__inner", children: [
    /* @__PURE__ */ d("a", { className: "mp-brand font-headline", href: a, children: ((l = i == null ? void 0 : i.brand.wordmark) == null ? void 0 : l.trim()) || t.title }),
    /* @__PURE__ */ d("nav", { className: "mp-footer__nav", "aria-label": "Footer", children: r.footer.map((c) => /* @__PURE__ */ d("a", { href: c.href, children: Kn(c, e) }, c.id)) }),
    /* @__PURE__ */ d(
      "div",
      {
        className: "mp-footer__langswitch",
        "data-cms-langswitch": "footer",
        "data-cms-langswitch-empty": !0
      }
    ),
    /* @__PURE__ */ d("p", { className: "mp-footer__copyright", children: o })
  ] }) });
}
const Yn = {
  heroEyebrow: "FLEXWEG MARKETPLACE",
  heroHeadline: "Modern assets for professional creators.",
  heroIntro: "Curated themes and plugins for your Flexweg CMS site. Free, open-source, and ready to install.",
  featuredCategorySlug: "plugins",
  featuredHeading: "Featured Plugins",
  featuredCount: 2,
  newCategorySlug: "themes",
  newHeading: "New Themes",
  newCount: 6,
  showRecentlyUpdated: !1,
  recentlyUpdatedHeading: "Recently Updated",
  recentlyUpdatedCount: 6
}, xi = {
  descriptionLabel: "Description",
  specificationsLabel: "Specifications",
  featuresLabel: "Key Features",
  downloadLabel: "Download",
  previewLabel: "Live Preview",
  freeBadgeLabel: "Free",
  showSpecs: !0,
  showFeatures: !0
}, Xn = {
  heading: "Discover",
  headingTranslations: {
    fr: {
      heading: "Découvrir",
      categoriesHeading: "Catégories",
      docsHeading: "Documentation"
    }
  },
  topItems: [
    { icon: "auto_awesome", label: "Featured", href: "/index.html" },
    { icon: "fiber_new", label: "New", href: "/new.html" },
    { icon: "trending_up", label: "Top Rated", href: "/top.html" }
  ],
  categoriesHeading: "Categories",
  categoriesItems: [
    {
      icon: "palette",
      label: "Themes",
      href: "/themes/index.html",
      translations: { fr: { label: "Thèmes" } }
    },
    { icon: "extension", label: "Plugins", href: "/plugins/index.html" },
    { icon: "shopping_bag", label: "E-commerce", href: "/e-commerce/index.html" },
    { icon: "analytics", label: "Analytics", href: "/analytics/index.html" },
    { icon: "lock", label: "Authentication", href: "/authentication/index.html" }
  ],
  docsHeading: "Documentation",
  docsItems: [
    {
      icon: "rocket_launch",
      label: "Get Started",
      href: "/get-started/index.html",
      translations: { fr: { label: "Démarrer", href: "/demarrer/index.html" } }
    },
    {
      icon: "download",
      label: "Install",
      href: "/install/index.html",
      translations: { fr: { label: "Installer", href: "/installer/index.html" } }
    },
    {
      icon: "edit_note",
      label: "Use",
      href: "/use/index.html",
      translations: { fr: { label: "Utiliser", href: "/utiliser/index.html" } }
    },
    {
      icon: "code",
      label: "Develop",
      href: "/develop/index.html",
      translations: { fr: { label: "Développer", href: "/developper/index.html" } }
    },
    {
      icon: "extension",
      label: "Extend",
      href: "/extend/index.html",
      translations: { fr: { label: "Étendre", href: "/etendre/index.html" } }
    }
  ]
}, vi = {
  copyright: ""
}, wi = {
  wordmark: ""
}, X = {
  vars: {},
  fontHeadline: "Hanken Grotesk",
  fontBody: "Inter"
}, ie = {
  home: Yn,
  single: xi,
  sidebar: Xn,
  footer: vi,
  brand: wi,
  style: X
};
function ki({
  site: n,
  currentPath: e,
  currentLocale: t
}) {
  var u;
  const r = n.themeConfig, i = { ...Xn, ...(r == null ? void 0 : r.sidebar) ?? {} }, o = Jt(n.homePath), a = t ?? "", s = a ? (u = i.headingTranslations) == null ? void 0 : u[a] : void 0;
  function l(h) {
    var b;
    const m = a ? (b = h.translations) == null ? void 0 : b[a] : void 0;
    return {
      label: (m == null ? void 0 : m.label) ?? h.label,
      href: (m == null ? void 0 : m.href) ?? h.href
    };
  }
  function c(h) {
    return !h || /^[a-z]+:/i.test(h) || !h.startsWith("/") ? h : o ? `${o}${h}` : h;
  }
  function p(h) {
    if (!e) return !1;
    const m = ("/" + e).replace(/\/index\.html$/, "/"), b = h.replace(/\/index\.html$/, "/");
    return m === b;
  }
  return /* @__PURE__ */ f("aside", { className: "mp-sidebar", "aria-label": "Sidebar", children: [
    /* @__PURE__ */ d("h2", { className: "mp-sidebar__heading font-headline", children: (s == null ? void 0 : s.heading) ?? i.heading }),
    i.topItems.length > 0 && /* @__PURE__ */ d("div", { className: "mp-sidebar__group", children: i.topItems.map((h, m) => {
      const { label: b, href: g } = l(h), y = c(g);
      return /* @__PURE__ */ f(
        "a",
        {
          className: `mp-sidebar__link${p(y) ? " is-active" : ""}`,
          href: y,
          children: [
            h.icon && /* @__PURE__ */ d("span", { className: "material-symbols-outlined", children: h.icon }),
            /* @__PURE__ */ d("span", { children: b })
          ]
        },
        `top-${m}`
      );
    }) }),
    i.categoriesItems.length > 0 && /* @__PURE__ */ f("div", { className: "mp-sidebar__group", children: [
      /* @__PURE__ */ d("span", { className: "mp-sidebar__label", children: (s == null ? void 0 : s.categoriesHeading) ?? i.categoriesHeading }),
      i.categoriesItems.map((h, m) => {
        const { label: b, href: g } = l(h), y = c(g);
        return /* @__PURE__ */ f(
          "a",
          {
            className: `mp-sidebar__link${p(y) ? " is-active" : ""}`,
            href: y,
            children: [
              h.icon && /* @__PURE__ */ d("span", { className: "material-symbols-outlined", children: h.icon }),
              /* @__PURE__ */ d("span", { children: b })
            ]
          },
          `cat-${m}`
        );
      })
    ] }),
    i.docsItems && i.docsItems.length > 0 && /* @__PURE__ */ f("div", { className: "mp-sidebar__group", children: [
      /* @__PURE__ */ d("span", { className: "mp-sidebar__label", children: (s == null ? void 0 : s.docsHeading) ?? i.docsHeading }),
      i.docsItems.map((h, m) => {
        const { label: b, href: g } = l(h), y = c(g);
        return /* @__PURE__ */ f(
          "a",
          {
            className: `mp-sidebar__link${p(y) ? " is-active" : ""}`,
            href: y,
            children: [
              h.icon && /* @__PURE__ */ d("span", { className: "material-symbols-outlined", children: h.icon }),
              /* @__PURE__ */ d("span", { children: b })
            ]
          },
          `doc-${m}`
        );
      })
    ] })
  ] });
}
function _i({
  site: n,
  currentPath: e,
  currentLocale: t
}) {
  const r = K.getFixedT(
    se(t || n.settings.language),
    "theme-marketplace-core"
  ), i = Jt(n.homePath), o = [
    { icon: "home", label: r("publicBaked.nav.home"), href: `${i}/index.html` },
    { icon: "palette", label: r("publicBaked.nav.themes"), href: `${i}/themes/index.html` },
    { icon: "extension", label: r("publicBaked.nav.plugins"), href: `${i}/plugins/index.html` }
  ];
  function a(s) {
    if (!e) return !1;
    const l = ("/" + e).replace(/\/index\.html$/, "/"), c = s.replace(/\/index\.html$/, "/");
    return l === c || s === `${i}/index.html` && l === `${i || ""}/`;
  }
  return /* @__PURE__ */ d("nav", { className: "mp-bottom-nav", "aria-label": "Mobile navigation", children: o.map((s) => /* @__PURE__ */ f(
    "a",
    {
      className: `mp-bottom-nav__item${a(s.href) ? " is-active" : ""}`,
      href: s.href,
      children: [
        /* @__PURE__ */ d("span", { className: "material-symbols-outlined", children: s.icon }),
        /* @__PURE__ */ d("span", { children: s.label })
      ]
    },
    s.href
  )) });
}
function Ni({
  site: n,
  pageTitle: e,
  pageDescription: t,
  ogImage: r,
  currentPath: i,
  currentLocale: o,
  children: a
}) {
  const s = `/${n.themeCssPath}`, l = gi(o, n.settings.language), c = n.settings.baseUrl && i ? si(n.settings.baseUrl, i) : void 0, p = n.settings.title || "", u = !!e && !!p && e.includes(p), h = e ? u ? e : `${e} — ${p}` : p;
  return /* @__PURE__ */ f("html", { lang: l, children: [
    /* @__PURE__ */ f("head", { children: [
      /* @__PURE__ */ d("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ d("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ d("title", { children: h }),
      t && /* @__PURE__ */ d("meta", { name: "description", content: t }),
      c && /* @__PURE__ */ d("link", { rel: "canonical", href: c }),
      /* @__PURE__ */ d("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ d("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ d("link", { rel: "stylesheet", href: s }),
      /* @__PURE__ */ d("meta", { property: "og:title", content: h }),
      t && /* @__PURE__ */ d("meta", { property: "og:description", content: t }),
      r && /* @__PURE__ */ d("meta", { property: "og:image", content: r }),
      c && /* @__PURE__ */ d("meta", { property: "og:url", content: c }),
      /* @__PURE__ */ d("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ d("meta", { name: "x-cms-head-extra" })
    ] }),
    /* @__PURE__ */ f("body", { children: [
      /* @__PURE__ */ f("div", { className: "mp-app", children: [
        /* @__PURE__ */ d(bi, { site: n, currentPath: i, currentLocale: l }),
        /* @__PURE__ */ f("div", { className: "mp-layout", children: [
          /* @__PURE__ */ d(ki, { site: n, currentPath: i, currentLocale: l }),
          /* @__PURE__ */ d("main", { className: "mp-main", children: a })
        ] }),
        /* @__PURE__ */ d(yi, { site: n, currentLocale: l })
      ] }),
      /* @__PURE__ */ d(_i, { site: n, currentPath: i, currentLocale: l }),
      /* @__PURE__ */ d(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: "(function(){var h=document.querySelector('.mp-header'),n=document.querySelector('.mp-bottom-nav');if(!h&&!n)return;var lastY=window.scrollY,ticking=false;function update(){var y=window.scrollY,d=y-lastY;if(y<80){if(h)h.classList.remove('is-hidden');if(n)n.classList.remove('is-hidden');}else if(d>6){if(h)h.classList.add('is-hidden');if(n)n.classList.add('is-hidden');}else if(d<-6){if(h)h.classList.remove('is-hidden');if(n)n.classList.remove('is-hidden');}lastY=y;ticking=false;}window.addEventListener('scroll',function(){if(!ticking){window.requestAnimationFrame(update);ticking=true;}},{passive:true});})();"
          }
        }
      ),
      /* @__PURE__ */ d(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: "(function(){document.addEventListener('click',function(e){var btn=e.target&&e.target.closest&&e.target.closest('[data-cms-copy]');if(!btn)return;var block=btn.closest('.mp-codeblock');var code=block&&block.querySelector('pre code');if(!code)return;var text=code.textContent||'';var label=btn.querySelector('[data-cms-copy-label]');var defaultLabel=btn.getAttribute('data-cms-copy-label-default')||'Copy';var doneLabel=btn.getAttribute('data-cms-copy-label-done')||'Copied';function done(){btn.classList.add('is-copied');if(label)label.textContent=doneLabel;setTimeout(function(){btn.classList.remove('is-copied');if(label)label.textContent=defaultLabel;},1500);}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(function(){fallback();});}else{fallback();}function fallback(){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done();}catch(_){}document.body.removeChild(ta);}});})();"
          }
        }
      ),
      /* @__PURE__ */ d("script", { type: "application/x-cms-body-end" })
    ] })
  ] });
}
function Oe({ card: n, site: e }) {
  var l;
  const t = K.getFixedT(se(e.settings.language), "theme-marketplace-core"), r = !!n.hero, i = r ? ae(n.hero, "large") || ae(n.hero, "medium") || ae(n.hero) : "", o = ((l = n.hero) == null ? void 0 : l.alt) ?? n.title, a = n.url.startsWith("/") ? n.url : `/${n.url}`;
  return /* @__PURE__ */ f("a", { className: r ? "mp-card" : "mp-card mp-card--no-image", href: a, children: [
    r && /* @__PURE__ */ d("img", { className: "mp-card__image", src: i, alt: o, loading: "lazy" }),
    /* @__PURE__ */ f("div", { className: "mp-card__body", children: [
      n.category && /* @__PURE__ */ d("span", { className: "mp-card__category", children: n.category.name }),
      /* @__PURE__ */ d("h3", { className: "mp-card__title", children: n.title }),
      n.excerpt && /* @__PURE__ */ d("p", { className: "mp-card__excerpt", children: n.excerpt }),
      r && /* @__PURE__ */ d("div", { className: "mp-card__footer", children: /* @__PURE__ */ d("span", { className: "mp-badge-free", children: t("publicBaked.free") }) })
    ] })
  ] });
}
function Ci({
  posts: n,
  staticPage: e,
  site: t
}) {
  const r = K.getFixedT(
    se(t.settings.language),
    "theme-marketplace-core"
  ), i = t.themeConfig, o = { ...Yn, ...(i == null ? void 0 : i.home) ?? {} }, a = Jt(t.homePath);
  if (e)
    return /* @__PURE__ */ d("article", { className: "mp-page-body", children: /* @__PURE__ */ d(
      "div",
      {
        className: "mp-prose",
        dangerouslySetInnerHTML: { __html: e.bodyHtml }
      }
    ) });
  function s(u, h) {
    return !u || h <= 0 ? [] : n.filter((m) => m.category ? m.category.url.replace(/^\/+/, "").split("/")[0] === u : !1).slice(0, h);
  }
  const l = s(o.featuredCategorySlug, o.featuredCount), c = s(o.newCategorySlug, o.newCount), p = o.showRecentlyUpdated ? n.slice(0, o.recentlyUpdatedCount) : [];
  return /* @__PURE__ */ f("div", { children: [
    (o.heroHeadline || o.heroIntro) && /* @__PURE__ */ f("section", { className: "mp-hero", children: [
      o.heroEyebrow && /* @__PURE__ */ d("p", { className: "mp-hero__eyebrow", children: o.heroEyebrow }),
      o.heroHeadline && /* @__PURE__ */ d("h1", { children: o.heroHeadline }),
      o.heroIntro && /* @__PURE__ */ d("p", { children: o.heroIntro })
    ] }),
    l.length > 0 && /* @__PURE__ */ f("section", { className: "mp-section", children: [
      /* @__PURE__ */ f("div", { className: "mp-section__heading", children: [
        /* @__PURE__ */ d("h2", { children: o.featuredHeading }),
        o.featuredCategorySlug && /* @__PURE__ */ f(
          "a",
          {
            className: "mp-section__see-all",
            href: `${a}/${o.featuredCategorySlug}/index.html`,
            children: [
              r("publicBaked.seeAll"),
              " →"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ d("div", { className: "mp-grid mp-grid--2", children: l.map((u) => /* @__PURE__ */ d(Oe, { card: u, site: t }, u.id)) })
    ] }),
    c.length > 0 && /* @__PURE__ */ f("section", { className: "mp-section", children: [
      /* @__PURE__ */ f("div", { className: "mp-section__heading", children: [
        /* @__PURE__ */ d("h2", { children: o.newHeading }),
        o.newCategorySlug && /* @__PURE__ */ f(
          "a",
          {
            className: "mp-section__see-all",
            href: `${a}/${o.newCategorySlug}/index.html`,
            children: [
              r("publicBaked.seeAll"),
              " →"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ d("div", { className: "mp-grid mp-grid--3", children: c.map((u) => /* @__PURE__ */ d(Oe, { card: u, site: t }, u.id)) })
    ] }),
    p.length > 0 && /* @__PURE__ */ f("section", { className: "mp-section", children: [
      /* @__PURE__ */ d("div", { className: "mp-section__heading", children: /* @__PURE__ */ d("h2", { children: o.recentlyUpdatedHeading }) }),
      /* @__PURE__ */ d("div", { className: "mp-grid mp-grid--3", children: p.map((u) => /* @__PURE__ */ d(Oe, { card: u, site: t }, u.id)) })
    ] })
  ] });
}
function Si({
  post: n,
  bodyHtml: e,
  hero: t,
  primaryTerm: r,
  site: i,
  docSiblings: o
}) {
  if (n.type === "page")
    return /* @__PURE__ */ f("article", { className: "mp-page-body", children: [
      /* @__PURE__ */ d("h1", { children: n.title }),
      /* @__PURE__ */ d("div", { className: "mp-prose", dangerouslySetInnerHTML: { __html: e } })
    ] });
  if (!t)
    return /* @__PURE__ */ d(
      Ei,
      {
        post: n,
        bodyHtml: e,
        primaryTerm: r,
        site: i,
        siblings: o ?? []
      }
    );
  const s = ae(t, "large") || ae(t, "medium") || ae(t);
  return /* @__PURE__ */ f("article", { children: [
    /* @__PURE__ */ f("section", { className: "mp-product", children: [
      /* @__PURE__ */ f("div", { className: "mp-product__gallery", children: [
        /* @__PURE__ */ d("img", { className: "mp-product__hero-image", src: s, alt: t.alt ?? n.title }),
        /* @__PURE__ */ d("div", { className: "mp-product__thumbs", "data-cms-mp-thumbs": !0, hidden: !0 })
      ] }),
      /* @__PURE__ */ f("div", { className: "mp-product__info", children: [
        r && /* @__PURE__ */ d("span", { className: "mp-product__category", children: r.name }),
        /* @__PURE__ */ d("h1", { className: "mp-product__title", children: n.title }),
        /* @__PURE__ */ d("div", { "data-cms-mp-byline-slot": !0 }),
        n.excerpt && /* @__PURE__ */ d("p", { className: "mp-product__excerpt", children: n.excerpt }),
        /* @__PURE__ */ d("div", { "data-cms-mp-cta-slot": !0 })
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: "mp-prose", dangerouslySetInnerHTML: { __html: e } })
  ] });
}
function Ei({
  post: n,
  bodyHtml: e,
  primaryTerm: t,
  site: r,
  siblings: i
}) {
  const o = K.getFixedT(
    se(r.settings.language),
    "theme-marketplace-core"
  ), a = r.homePath ?? "/index.html", s = i.findIndex((p) => p.id === n.id), l = s > 0 ? i[s - 1] : null, c = s >= 0 && s < i.length - 1 ? i[s + 1] : null;
  return /* @__PURE__ */ f("article", { className: "mp-doc", children: [
    /* @__PURE__ */ f("nav", { className: "mp-breadcrumb", "aria-label": "Breadcrumb", children: [
      /* @__PURE__ */ d("a", { href: a, children: o("publicBaked.home") }),
      t && /* @__PURE__ */ f(ai, { children: [
        /* @__PURE__ */ d("span", { className: "mp-breadcrumb__sep", children: "/" }),
        /* @__PURE__ */ d("a", { href: St(`${t.slug}/index.html`), children: t.name })
      ] }),
      /* @__PURE__ */ d("span", { className: "mp-breadcrumb__sep", children: "/" }),
      /* @__PURE__ */ d("span", { children: n.title })
    ] }),
    /* @__PURE__ */ f("header", { className: "mp-doc__header", children: [
      /* @__PURE__ */ d("h1", { className: "mp-doc__title", children: n.title }),
      n.excerpt && /* @__PURE__ */ d("p", { className: "mp-doc__excerpt", children: n.excerpt })
    ] }),
    /* @__PURE__ */ d("div", { className: "mp-doc__body mp-prose", dangerouslySetInnerHTML: { __html: e } }),
    (l || c) && /* @__PURE__ */ f("nav", { className: "mp-doc__pagerow", "aria-label": o("publicBaked.docPager.aria"), children: [
      l ? /* @__PURE__ */ f("a", { className: "mp-doc__pager mp-doc__pager--prev", href: St(l.url), children: [
        /* @__PURE__ */ f("span", { className: "mp-doc__pager-label", children: [
          "← ",
          o("publicBaked.docPager.prev")
        ] }),
        /* @__PURE__ */ d("span", { className: "mp-doc__pager-title", children: l.title })
      ] }) : /* @__PURE__ */ d("span", {}),
      c ? /* @__PURE__ */ f("a", { className: "mp-doc__pager mp-doc__pager--next", href: St(c.url), children: [
        /* @__PURE__ */ f("span", { className: "mp-doc__pager-label", children: [
          o("publicBaked.docPager.next"),
          " →"
        ] }),
        /* @__PURE__ */ d("span", { className: "mp-doc__pager-title", children: c.title })
      ] }) : /* @__PURE__ */ d("span", {})
    ] })
  ] });
}
function St(n) {
  return n ? n.startsWith("/") ? n : `/${n}` : "/";
}
function Ai({
  term: n,
  posts: e,
  site: t
}) {
  const r = K.getFixedT(
    se(t.settings.language),
    "theme-marketplace-core"
  ), i = t.homePath ?? "/index.html";
  return /* @__PURE__ */ f("article", { children: [
    /* @__PURE__ */ f("nav", { className: "mp-breadcrumb", "aria-label": "Breadcrumb", children: [
      /* @__PURE__ */ d("a", { href: i, children: r("publicBaked.home") }),
      /* @__PURE__ */ d("span", { className: "mp-breadcrumb__sep", children: "/" }),
      /* @__PURE__ */ d("span", { children: n.name })
    ] }),
    /* @__PURE__ */ f("header", { className: "mp-section", children: [
      /* @__PURE__ */ d("h1", { className: "text-display-lg font-headline", children: n.name }),
      n.description && /* @__PURE__ */ d("p", { className: "text-body-lg", style: { color: "rgb(var(--color-on-surface-variant))", maxWidth: "640px", marginTop: 8 }, children: n.description })
    ] }),
    /* @__PURE__ */ d("section", { className: "mp-section", children: /* @__PURE__ */ d("div", { className: "mp-grid mp-grid--3", children: e.map((o) => /* @__PURE__ */ d(Oe, { card: o, site: t }, o.id)) }) })
  ] });
}
function Mi({
  author: n,
  posts: e,
  site: t
}) {
  const r = K.getFixedT(se(t.settings.language), "theme-marketplace-core"), i = n.avatar ? ae(n.avatar, "medium") || ae(n.avatar) : "", o = /* @__PURE__ */ new Map();
  return e.forEach((a) => {
    if (!a.category) return;
    const s = a.category.url.replace(/^\/+/, "").split("/")[0];
    s && !o.has(s) && o.set(s, a.category.name);
  }), /* @__PURE__ */ f("article", { children: [
    /* @__PURE__ */ f("section", { className: "mp-author-card", children: [
      i ? /* @__PURE__ */ d("img", { className: "mp-author-card__avatar", src: i, alt: n.displayName }) : /* @__PURE__ */ d("div", { className: "mp-author-card__avatar" }),
      /* @__PURE__ */ f("div", { className: "mp-author-card__info", children: [
        /* @__PURE__ */ d("h1", { className: "mp-author-card__name", children: n.displayName }),
        n.title && /* @__PURE__ */ d("p", { className: "mp-author-card__title", children: n.title }),
        n.bio && /* @__PURE__ */ d("p", { className: "mp-author-card__bio", children: n.bio })
      ] })
    ] }),
    o.size > 1 && /* @__PURE__ */ f("div", { className: "mp-tabs", "data-cms-author-tabs": !0, role: "tablist", children: [
      /* @__PURE__ */ d("button", { type: "button", className: "mp-tabs__tab is-active", "data-cms-author-tab": "*", children: r("publicBaked.seeAll") }),
      Array.from(o.entries()).map(([a, s]) => /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "mp-tabs__tab",
          "data-cms-author-tab": a,
          children: s
        },
        a
      ))
    ] }),
    /* @__PURE__ */ d("div", { className: "mp-grid mp-grid--3", children: e.map((a) => {
      const s = a.category ? a.category.url.replace(/^\/+/, "").split("/")[0] : "";
      return /* @__PURE__ */ d("div", { "data-cms-author-card": s, children: /* @__PURE__ */ d(Oe, { card: a, site: t }) }, a.id);
    }) }),
    /* @__PURE__ */ d(
      "script",
      {
        dangerouslySetInnerHTML: {
          __html: "(function(){var t=document.querySelector('[data-cms-author-tabs]');if(!t)return;t.addEventListener('click',function(e){var b=e.target.closest('[data-cms-author-tab]');if(!b)return;var s=b.getAttribute('data-cms-author-tab');t.querySelectorAll('[data-cms-author-tab]').forEach(function(x){x.classList.toggle('is-active',x===b)});document.querySelectorAll('[data-cms-author-card]').forEach(function(c){var ok=s==='*'||c.getAttribute('data-cms-author-card')===s;c.style.display=ok?'':'none'})});})();"
        }
      }
    )
  ] });
}
function Ii({ site: n }) {
  const e = K.getFixedT(se(n.settings.language), "theme-marketplace-core"), t = n.homePath ?? "/index.html";
  return /* @__PURE__ */ f("div", { className: "mp-404", children: [
    /* @__PURE__ */ d("span", { className: "material-symbols-outlined", children: "search_off" }),
    /* @__PURE__ */ d("h1", { children: "404" }),
    /* @__PURE__ */ d("p", { className: "text-body-lg", style: { color: "rgb(var(--color-on-surface-variant))" }, children: e("publicBaked.notFound") }),
    /* @__PURE__ */ d("a", { href: t, className: "mp-btn mp-btn--primary", children: e("publicBaked.backHome") })
  ] });
}
const Se = {
  title: "Theme settings",
  settings: {
    description: "Marketplace Core — app-store style theme for listing your themes and plugins. Wide cards, soft shadows, big rounded corners.",
    tabs: {
      home: "Home",
      single: "Product page",
      sidebar: "Sidebar",
      footer: "Footer",
      style: "Style & branding"
    },
    buttons: {
      save: "Save & apply",
      saving: "Saving…",
      saved: "Saved"
    }
  },
  publicBaked: {
    free: "Free",
    download: "Download",
    livePreview: "Live Preview",
    description: "Description",
    specifications: "Specifications",
    keyFeatures: "Key Features",
    nav: {
      home: "Home",
      themes: "Themes",
      plugins: "Plugins",
      authors: "Authors"
    },
    seeAll: "See all",
    by: "by",
    notFound: "Page not found",
    backHome: "Back to home",
    home: "Home",
    docPager: {
      aria: "Documentation navigation",
      prev: "Previous",
      next: "Next"
    },
    codeBlock: {
      copy: "Copy",
      copied: "Copied"
    }
  },
  blocks: {
    headerButtons: { title: "Download / Preview buttons", untitled: "(no URLs)" },
    gallery: { title: "Screenshot gallery", count: "{{n}} images" },
    specs: { title: "Specifications table", untitled: "Empty specs" },
    features: { title: "Key features bento", count: "{{n}} features" },
    landingHero: { title: "Landing hero", empty: "(no headline)" },
    featureGrid: { title: "Feature grid", count: "{{n}} items" },
    featureRow: { title: "Feature row", empty: "(no headline)" },
    statsBar: { title: "Stats bar", count: "{{n}} stats" },
    ctaBanner: { title: "CTA banner", empty: "(no headline)" }
  }
}, Ti = {
  title: "Réglages du thème",
  settings: {
    description: "Marketplace Core — thème app-store pour répertorier vos thèmes et plugins. Cartes larges, ombres douces, coins arrondis XL.",
    tabs: {
      home: "Accueil",
      single: "Page produit",
      sidebar: "Sidebar",
      footer: "Pied de page",
      style: "Style & branding"
    },
    buttons: {
      save: "Enregistrer et appliquer",
      saving: "Enregistrement…",
      saved: "Enregistré"
    }
  },
  publicBaked: {
    free: "Gratuit",
    download: "Télécharger",
    livePreview: "Démo en ligne",
    description: "Description",
    specifications: "Spécifications",
    keyFeatures: "Fonctionnalités clés",
    nav: {
      home: "Accueil",
      themes: "Thèmes",
      plugins: "Plugins",
      authors: "Auteurs"
    },
    seeAll: "Voir tout",
    by: "par",
    notFound: "Page introuvable",
    backHome: "Retour à l'accueil",
    home: "Accueil",
    docPager: {
      aria: "Navigation dans la documentation",
      prev: "Précédent",
      next: "Suivant"
    },
    codeBlock: {
      copy: "Copier",
      copied: "Copié"
    }
  },
  blocks: {
    headerButtons: { title: "Boutons Télécharger / Démo", untitled: "(aucune URL)" },
    gallery: { title: "Galerie captures d'écran", count: "{{n}} images" },
    specs: { title: "Tableau de spécifications", untitled: "Vide" },
    features: { title: "Fonctionnalités clés", count: "{{n}} fonctionnalités" },
    landingHero: { title: "Hero landing", empty: "(aucun titre)" },
    featureGrid: { title: "Grille de fonctionnalités", count: "{{n}} éléments" },
    featureRow: { title: "Bandeau fonctionnalité", empty: "(aucun titre)" },
    statsBar: { title: "Barre de stats", count: "{{n}} stats" },
    ctaBanner: { title: "Bandeau CTA", empty: "(aucun titre)" }
  }
}, Oi = Se, Ri = Se, $i = Se, Bi = Se, zi = Se, Li = "marketplace-core";
function Me(n) {
  if (n == null) return "";
  try {
    const e = JSON.stringify(n);
    return typeof window > "u" ? Buffer.from(e, "utf-8").toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  } catch {
    return "";
  }
}
function Y(n, e) {
  if (!n || typeof n != "string") return e;
  try {
    const t = typeof window > "u" ? Buffer.from(n, "base64").toString("utf-8") : decodeURIComponent(escape(window.atob(n)));
    return JSON.parse(t);
  } catch {
    return e;
  }
}
function q(n) {
  return typeof n != "string" ? "" : n.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function k(n) {
  return typeof n != "string" ? "" : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Qn(n) {
  return `marketplace${n.charAt(0).toUpperCase()}${n.slice(1)}`;
}
const Xe = {
  downloadUrl: "",
  previewUrl: "",
  downloadLabel: "Download",
  previewLabel: "Live Preview",
  freeLabel: "Free",
  creator: "",
  creatorPrefix: "by"
};
function Fi(n) {
  var u;
  const e = !!(n.downloadUrl || n.previewUrl), t = !!((u = n.creator) != null && u.trim());
  if (!e && !t) return "";
  const r = t ? `<div class="mp-product__author"><span>${k(n.creatorPrefix || "by")} <strong>${k(n.creator)}</strong></span></div>` : "", i = e ? `<span class="mp-badge-free">${k(n.freeLabel)}</span>` : "", o = n.downloadUrl ? `<a class="mp-btn mp-btn--primary" href="${q(n.downloadUrl)}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">download</span>${k(n.downloadLabel)}</a>` : "", a = n.previewUrl ? `<a class="mp-btn mp-btn--secondary" href="${q(n.previewUrl)}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">open_in_new</span>${k(n.previewLabel)}</a>` : "", s = e ? `${i}<div class="mp-product__cta-row">${o}${a}</div>` : "", l = r ? `<template data-cms-mp-headerbuttons-byline>${r}</template>` : "", c = s ? `<template data-cms-mp-headerbuttons-cta>${s}</template>` : "";
  return `${l}${c}<script>(function(){
function move(srcSel, dstSel){
  var tpl = document.querySelector(srcSel);
  if (!tpl) return;
  var dst = document.querySelector(dstSel);
  if (!dst) return;
  while (tpl.content.firstChild) dst.appendChild(tpl.content.firstChild);
  tpl.remove();
}
move('[data-cms-mp-headerbuttons-byline]','[data-cms-mp-byline-slot]');
move('[data-cms-mp-headerbuttons-cta]','[data-cms-mp-cta-slot]');
})();<\/script>`;
}
const Pi = /<div\s+([^>]*data-cms-block="marketplace-core\/header-buttons"[^>]*)>\s*<\/div>/g;
function Di(n) {
  return n.replace(Pi, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, Xe);
    return Fi(o) || "";
  });
}
const Qe = { images: [] };
function Hi(n) {
  const e = (n.images ?? []).filter((i) => i && i.url);
  return e.length === 0 ? "" : `<template data-cms-mp-gallery>${JSON.stringify({ images: e }).replace(/</g, "\\u003c")}</template>` + `<script>(function(){
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
})();<\/script>`;
}
const ji = /<div\s+([^>]*data-cms-block="marketplace-core\/gallery"[^>]*)>\s*<\/div>/g;
function Ui(n) {
  return n.replace(ji, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, Qe);
    return Hi(o) || "";
  });
}
const Ze = {
  heading: "Specifications",
  rows: [
    { label: "Version", value: "1.0.0" },
    { label: "License", value: "MIT" },
    { label: "Last Updated", value: "" },
    { label: "Requires Flexweg", value: "≥ 1.0.0" }
  ]
};
function Vi(n) {
  const e = (n.rows ?? []).filter((i) => i.label || i.value);
  if (e.length === 0) return "";
  const t = e.map(
    (i) => `<div class="mp-specs__row"><span class="mp-specs__label">${k(i.label)}</span><span class="mp-specs__value">${k(i.value)}</span></div>`
  ).join("");
  return `${n.heading ? `<h3 class="mp-section-heading">${k(n.heading)}</h3>` : ""}<section class="mp-specs"><div class="mp-specs__grid">${t}</div></section>`;
}
const Ji = /<div\s+([^>]*data-cms-block="marketplace-core\/specs"[^>]*)>\s*<\/div>/g;
function qi(n) {
  return n.replace(Ji, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, Ze);
    return Vi(o) || "";
  });
}
const et = {
  heading: "Key Features",
  items: []
};
function Wi(n) {
  const e = (n.items ?? []).filter((i) => i.title);
  if (e.length === 0) return "";
  const t = e.map(
    (i) => `<div class="mp-features__item"><div class="mp-features__icon"><span class="material-symbols-outlined">${k(i.icon || "bolt")}</span></div><h4 class="mp-features__title">${k(i.title)}</h4></div>`
  ).join("");
  return `${n.heading ? `<h3 class="mp-section-heading">${k(n.heading)}</h3>` : ""}<div class="mp-features">${t}</div>`;
}
const Gi = /<div\s+([^>]*data-cms-block="marketplace-core\/features"[^>]*)>\s*<\/div>/g;
function Ki(n) {
  return n.replace(Gi, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, et);
    return Wi(o) || "";
  });
}
const yt = {
  eyebrow: "",
  headline: "",
  subhead: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  imageUrl: "",
  imageAlt: ""
};
function Yi(n) {
  var a, s, l, c, p, u, h, m;
  if (!((a = n.headline) != null && a.trim())) return "";
  const e = (s = n.eyebrow) != null && s.trim() ? `<p class="mp-hero-x__eyebrow">${k(n.eyebrow)}</p>` : "", t = (l = n.subhead) != null && l.trim() ? `<p class="mp-hero-x__sub">${k(n.subhead)}</p>` : "", r = [
    (c = n.primaryCta) != null && c.label && ((p = n.primaryCta) != null && p.href) ? `<a class="mp-btn mp-btn--primary" href="${q(n.primaryCta.href)}">${k(n.primaryCta.label)}</a>` : "",
    (u = n.secondaryCta) != null && u.label && ((h = n.secondaryCta) != null && h.href) ? `<a class="mp-btn mp-btn--secondary" href="${q(n.secondaryCta.href)}">${k(n.secondaryCta.label)}</a>` : ""
  ].filter(Boolean).join(""), i = r ? `<div class="mp-hero-x__ctas">${r}</div>` : "", o = (m = n.imageUrl) != null && m.trim() ? `<div class="mp-hero-x__visual"><img src="${q(n.imageUrl)}" alt="${q(n.imageAlt || n.headline)}" loading="eager"/></div>` : "";
  return `<section class="mp-hero-x">
  <div class="mp-hero-x__copy">
    ${e}
    <h1 class="mp-hero-x__headline">${k(n.headline)}</h1>
    ${t}
    ${i}
  </div>
  ${o}
</section>`;
}
const Xi = /<div\s+([^>]*data-cms-block="marketplace-core\/landing-hero"[^>]*)>\s*<\/div>/g;
function Qi(n) {
  return n.replace(Xi, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, yt);
    return Yi(o) || "";
  });
}
const xt = {
  heading: "",
  subhead: "",
  items: []
};
function Zi(n) {
  var o, a;
  const e = (n.items ?? []).filter((s) => s.title);
  if (e.length === 0) return "";
  const t = e.map(
    (s) => `<div class="mp-grid-feat__card">
      <div class="mp-grid-feat__icon"><span class="material-symbols-outlined">${k(s.icon || "bolt")}</span></div>
      <h3 class="mp-grid-feat__title">${k(s.title)}</h3>
      ${s.body ? `<p class="mp-grid-feat__body">${k(s.body)}</p>` : ""}
    </div>`
  ).join(""), r = (o = n.heading) != null && o.trim() ? `<h2 class="mp-section-heading">${k(n.heading)}</h2>` : "", i = (a = n.subhead) != null && a.trim() ? `<p class="mp-section-sub">${k(n.subhead)}</p>` : "";
  return `<section class="mp-grid-feat">
  ${r}
  ${i}
  <div class="mp-grid-feat__row">${t}</div>
</section>`;
}
const eo = /<div\s+([^>]*data-cms-block="marketplace-core\/feature-grid"[^>]*)>\s*<\/div>/g;
function to(n) {
  return n.replace(eo, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, xt);
    return Zi(o) || "";
  });
}
const vt = {
  imagePosition: "right",
  eyebrow: "",
  headline: "",
  body: "",
  bullets: [],
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  imageAlt: ""
};
function no(n) {
  var l, c, p, u, h, m;
  if (!((l = n.headline) != null && l.trim())) return "";
  const e = (c = n.eyebrow) != null && c.trim() ? `<p class="mp-row-feat__eyebrow">${k(n.eyebrow)}</p>` : "", t = (p = n.body) != null && p.trim() ? `<p class="mp-row-feat__body">${k(n.body)}</p>` : "", r = (n.bullets ?? []).filter((b) => b == null ? void 0 : b.trim()), i = r.length > 0 ? `<ul class="mp-row-feat__bullets">${r.map((b) => `<li><span class="material-symbols-outlined">check_circle</span>${k(b)}</li>`).join("")}</ul>` : "", o = (u = n.ctaLabel) != null && u.trim() && ((h = n.ctaHref) != null && h.trim()) ? `<a class="mp-row-feat__cta" href="${q(n.ctaHref)}">${k(n.ctaLabel)} <span aria-hidden="true">→</span></a>` : "", a = (m = n.imageUrl) != null && m.trim() ? `<div class="mp-row-feat__visual"><img src="${q(n.imageUrl)}" alt="${q(n.imageAlt || n.headline)}" loading="lazy"/></div>` : "";
  return `<section class="mp-row-feat ${n.imagePosition === "left" ? "mp-row-feat--image-left" : "mp-row-feat--image-right"}">
  ${a}
  <div class="mp-row-feat__copy">
    ${e}
    <h2 class="mp-row-feat__headline">${k(n.headline)}</h2>
    ${t}
    ${i}
    ${o}
  </div>
</section>`;
}
const ro = /<div\s+([^>]*data-cms-block="marketplace-core\/feature-row"[^>]*)>\s*<\/div>/g;
function io(n) {
  return n.replace(ro, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, vt);
    return no(o) || "";
  });
}
const wt = {
  items: []
};
function oo(n) {
  const e = (n.items ?? []).filter((r) => r.value || r.label);
  return e.length === 0 ? "" : `<section class="mp-stats"><div class="mp-stats__row">${e.map(
    (r) => `<div class="mp-stats__cell">
      <p class="mp-stats__value">${k(r.value)}</p>
      <p class="mp-stats__label">${k(r.label)}</p>
    </div>`
  ).join("")}</div></section>`;
}
const ao = /<div\s+([^>]*data-cms-block="marketplace-core\/stats-bar"[^>]*)>\s*<\/div>/g;
function so(n) {
  return n.replace(ao, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, wt);
    return oo(o) || "";
  });
}
const kt = {
  headline: "",
  body: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" }
};
function lo(n) {
  var i, o, a, s, l, c;
  if (!((i = n.headline) != null && i.trim())) return "";
  const e = (o = n.body) != null && o.trim() ? `<p class="mp-cta-banner__body">${k(n.body)}</p>` : "", t = [
    (a = n.primaryCta) != null && a.label && ((s = n.primaryCta) != null && s.href) ? `<a class="mp-btn mp-btn--primary" href="${q(n.primaryCta.href)}">${k(n.primaryCta.label)}</a>` : "",
    (l = n.secondaryCta) != null && l.label && ((c = n.secondaryCta) != null && c.href) ? `<a class="mp-btn mp-btn--ghost" href="${q(n.secondaryCta.href)}">${k(n.secondaryCta.label)}</a>` : ""
  ].filter(Boolean).join(""), r = t ? `<div class="mp-cta-banner__ctas">${t}</div>` : "";
  return `<section class="mp-cta-banner">
  <div class="mp-cta-banner__inner">
    <h2 class="mp-cta-banner__headline">${k(n.headline)}</h2>
    ${e}
    ${r}
  </div>
</section>`;
}
const co = /<div\s+([^>]*data-cms-block="marketplace-core\/cta-banner"[^>]*)>\s*<\/div>/g;
function po(n) {
  return n.replace(co, (e, t) => {
    const r = t.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/), i = r ? r[1] ?? r[2] ?? r[3] ?? "" : "", o = Y(i, kt);
    return lo(o) || "";
  });
}
const uo = /<blockquote>\s*<p><strong>([^<]+)<\/strong><\/p>\s*([\s\S]*?)<\/blockquote>/g;
function ho(n) {
  const e = n.toLowerCase();
  return /(danger|critical|important)/.test(e) ? "danger" : /(warning|caution|attention|gotcha)/.test(e) ? "warning" : /(tip|astuce)/.test(e) ? "tip" : /(note|remarque)/.test(e) ? "note" : "info";
}
function fo(n) {
  return n.replace(uo, (e, t, r) => {
    const i = ho(t), o = r.trim();
    return `<aside class="mp-admonition mp-admonition--${i}" role="note"><div class="mp-admonition__title"><span class="mp-admonition__icon" aria-hidden="true"></span><span>${oe(t)}</span></div><div class="mp-admonition__body">${o}</div></aside>`;
  });
}
function oe(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const mo = /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;
function go(n, e, t) {
  return n.replace(mo, (r, i, o) => {
    const a = i ? i.toUpperCase() : "";
    return `<div class="mp-codeblock"${i ? ` data-lang="${oe(i)}"` : ""}><div class="mp-codeblock__bar"><span class="mp-codeblock__lang">${oe(a)}</span><button type="button" class="mp-codeblock__copy" data-cms-copy data-cms-copy-label-default="${oe(e)}" data-cms-copy-label-done="${oe(t)}" aria-label="${oe(e)}"><span class="mp-codeblock__copy-icon" aria-hidden="true"></span><span class="mp-codeblock__copy-label" data-cms-copy-label>${oe(e)}</span></button></div><pre><code${i ? ` class="language-${oe(i)}"` : ""}>${o}</code></pre></div>`;
  });
}
function bo(n, e = "Copy", t = "Copied") {
  let r = n;
  return r = fo(r), r = go(r, e, t), r;
}
function yo(n, e, t) {
  let r = n;
  return r = Di(r), r = Ui(r), r = qi(r), r = Ki(r), r = Qi(r), r = to(r), r = io(r), r = so(r), r = po(r), r = bo(r, e, t), r;
}
function xo(n) {
  const e = n.trim(), t = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(e);
  if (!t) return e;
  const r = t[1];
  if (r.length === 3) {
    const s = parseInt(r[0] + r[0], 16), l = parseInt(r[1] + r[1], 16), c = parseInt(r[2] + r[2], 16);
    return `${s} ${l} ${c}`;
  }
  const i = parseInt(r.slice(0, 2), 16), o = parseInt(r.slice(2, 4), 16), a = parseInt(r.slice(4, 6), 16);
  return `${i} ${o} ${a}`;
}
function xn(n) {
  return `"${n.replace(/"/g, '\\"')}"`;
}
const Ne = {
  sans: {
    "Hanken Grotesk": "Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400",
    Inter: "Inter:wght@400;500;600;700",
    Manrope: "Manrope:wght@400;500;600;700",
    "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    Outfit: "Outfit:wght@400;500;600;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
    "DM Sans": "DM+Sans:wght@400;500;600;700",
    "Work Sans": "Work+Sans:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700",
    Oswald: "Oswald:wght@400;500;600;700",
    "Barlow Condensed": "Barlow+Condensed:wght@400;500;600;700",
    "Big Shoulders Display": "Big+Shoulders+Display:wght@400;500;600;700",
    Anton: "Anton",
    "Archivo Black": "Archivo+Black",
    "Bowlby One": "Bowlby+One",
    Unbounded: "Unbounded:wght@400;500;600;700"
  },
  serif: {
    Newsreader: "Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700",
    Lora: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Playfair Display": "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "EB Garamond": "EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Source Serif 4": "Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "Crimson Pro": "Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    Spectral: "Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700",
    "DM Serif Display": "DM+Serif+Display:ital,wght@0,400;1,400"
  }
};
function vn(n, e) {
  const t = {
    ...Ne.sans,
    ...Ne.serif
  };
  return t[n] ?? t[e];
}
function vo(n, e) {
  const t = vn(n, "Hanken Grotesk"), r = vn(e, "Inter");
  return t === r ? `https://fonts.googleapis.com/css2?family=${t}&display=swap` : `https://fonts.googleapis.com/css2?family=${t}&family=${r}&display=swap`;
}
function wo() {
  return `https://fonts.googleapis.com/css2?${[
    ...Object.keys(Ne.sans),
    ...Object.keys(Ne.serif)
  ].map((t) => `family=${t.replace(/ /g, "+")}`).join("&")}&display=swap`;
}
function ko(n, e) {
  const t = {
    vars: { ...X.vars, ...e.vars },
    fontHeadline: e.fontHeadline || X.fontHeadline,
    fontBody: e.fontBody || X.fontBody
  }, r = t.fontHeadline !== X.fontHeadline || t.fontBody !== X.fontBody, i = Object.entries(t.vars).filter(([, l]) => l && l.trim());
  if (!r && i.length === 0) return n;
  let o = n;
  if (r) {
    const l = vo(t.fontHeadline, t.fontBody);
    o = o.replace(
      /@import\s+url\(\s*"https:\/\/fonts\.googleapis\.com\/css2[^"]*"\s*\)\s*;/,
      `@import url("${l}");`
    );
  }
  const a = i.map(([l, c]) => {
    const p = l.startsWith("--color-");
    return `${l}:${p ? xo(c) : c};`;
  }).join(""), s = r ? `--font-headline:${xn(t.fontHeadline)};--font-body:${xn(t.fontBody)};` : "";
  return o += `
:root{${s}${a}}
`, o;
}
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _o = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Zn = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var No = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Co = Vt(
  ({
    color: n = "currentColor",
    size: e = 24,
    strokeWidth: t = 2,
    absoluteStrokeWidth: r,
    className: i = "",
    children: o,
    iconNode: a,
    ...s
  }, l) => lt(
    "svg",
    {
      ref: l,
      ...No,
      width: e,
      height: e,
      stroke: n,
      strokeWidth: r ? Number(t) * 24 / Number(e) : t,
      className: Zn("lucide", i),
      ...s
    },
    [
      ...a.map(([c, p]) => lt(c, p)),
      ...Array.isArray(o) ? o : [o]
    ]
  )
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z = (n, e) => {
  const t = Vt(
    ({ className: r, ...i }, o) => lt(Co, {
      ref: o,
      iconNode: e,
      className: Zn(`lucide-${_o(n)}`, r),
      ...i
    })
  );
  return t.displayName = `${n}`, t;
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const So = z("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eo = z("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const er = z("ChartColumn", [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tr = z("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qt = z("ImagePlus", [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nr = z("LayoutGrid", [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rr = z("ListChecks", [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ao = z("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ir = z("Megaphone", [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ee = z("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const or = z("Rocket", [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ar = z("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mo = z("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sr = z("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lr = z("SquareSplitVertical", [
  ["path", { d: "M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3", key: "1pi83i" }],
  ["path", { d: "M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3", key: "ido5k7" }],
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ye = z("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
function Io({
  config: n,
  save: e
}) {
  const t = {
    ...ie,
    ...n,
    home: { ...ie.home, ...n.home ?? {} },
    single: { ...ie.single, ...n.single ?? {} },
    sidebar: { ...ie.sidebar, ...n.sidebar ?? {} },
    footer: { ...ie.footer, ...n.footer ?? {} },
    brand: { ...ie.brand, ...n.brand ?? {} },
    style: { ...ie.style, ...n.style ?? {} }
  }, [r, i] = he(t), [o, a] = he("home"), [s, l] = he(!1);
  async function c() {
    l(!0);
    try {
      await e(r);
    } finally {
      l(!1);
    }
  }
  return /* @__PURE__ */ f("div", { className: "space-y-6", children: [
    /* @__PURE__ */ d("p", { className: "text-sm text-surface-600 dark:text-surface-300", children: "Marketplace Core — app-store style theme for listing your themes and plugins." }),
    /* @__PURE__ */ d(
      "nav",
      {
        className: "flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800",
        "aria-label": "Marketplace settings tabs",
        children: [
          { id: "home", label: "Home" },
          { id: "single", label: "Product page" },
          { id: "sidebar", label: "Sidebar" },
          { id: "footer", label: "Footer" },
          { id: "style", label: "Style" }
        ].map((u) => /* @__PURE__ */ d(
          zo,
          {
            active: o === u.id,
            onClick: () => a(u.id),
            label: u.label
          },
          u.id
        ))
      }
    ),
    o === "home" && /* @__PURE__ */ d(To, { home: r.home, onChange: (u) => i({ ...r, home: u }) }),
    o === "single" && /* @__PURE__ */ d(
      Oo,
      {
        single: r.single,
        onChange: (u) => i({ ...r, single: u })
      }
    ),
    o === "sidebar" && /* @__PURE__ */ d(
      Ro,
      {
        sidebar: r.sidebar,
        onChange: (u) => i({ ...r, sidebar: u })
      }
    ),
    o === "footer" && /* @__PURE__ */ d(
      $o,
      {
        copyright: r.footer.copyright,
        wordmark: r.brand.wordmark,
        onChange: (u, h) => i({
          ...r,
          footer: { ...r.footer, ...u },
          brand: { ...r.brand, ...h }
        })
      }
    ),
    o === "style" && /* @__PURE__ */ d(Bo, { style: r.style, onChange: (u) => i({ ...r, style: u }) }),
    /* @__PURE__ */ f("div", { className: "card p-4 flex flex-wrap gap-3 justify-end", children: [
      o === "style" && (() => {
        const u = r.style.fontHeadline !== X.fontHeadline || r.style.fontBody !== X.fontBody || Object.keys(r.style.vars ?? {}).length > 0;
        return /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: () => i({ ...r, style: { ...X } }),
            disabled: !u,
            className: "btn-ghost disabled:opacity-40 disabled:cursor-not-allowed",
            title: "Reset fonts and palette to their defaults",
            children: [
              /* @__PURE__ */ d(ar, { className: "h-4 w-4" }),
              "Reset to defaults"
            ]
          }
        );
      })(),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          onClick: c,
          disabled: s,
          className: "btn-primary disabled:opacity-60 disabled:cursor-wait",
          children: [
            s ? /* @__PURE__ */ d(Ao, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ d(Mo, { className: "h-4 w-4" }),
            s ? "Saving…" : "Save & apply"
          ]
        }
      )
    ] })
  ] });
}
function To({
  home: n,
  onChange: e
}) {
  return /* @__PURE__ */ f("div", { className: "space-y-4", children: [
    /* @__PURE__ */ f(D, { title: "Hero", children: [
      /* @__PURE__ */ d(S, { label: "Eyebrow", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.heroEyebrow,
          onChange: (t) => e({ ...n, heroEyebrow: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Headline", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.heroHeadline,
          onChange: (t) => e({ ...n, heroHeadline: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Intro", children: /* @__PURE__ */ d(
        "textarea",
        {
          className: "input",
          rows: 3,
          value: n.heroIntro,
          onChange: (t) => e({ ...n, heroIntro: t.target.value })
        }
      ) })
    ] }),
    /* @__PURE__ */ d(D, { title: "Featured section", children: /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ d(S, { label: "Category slug", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.featuredCategorySlug,
          onChange: (t) => e({ ...n, featuredCategorySlug: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Heading", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.featuredHeading,
          onChange: (t) => e({ ...n, featuredHeading: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Item count", children: /* @__PURE__ */ d(
        "input",
        {
          type: "number",
          min: 0,
          className: "input",
          value: n.featuredCount,
          onChange: (t) => e({ ...n, featuredCount: parseInt(t.target.value, 10) || 0 })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ d(D, { title: "New section", children: /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ d(S, { label: "Category slug", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.newCategorySlug,
          onChange: (t) => e({ ...n, newCategorySlug: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Heading", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.newHeading,
          onChange: (t) => e({ ...n, newHeading: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Item count", children: /* @__PURE__ */ d(
        "input",
        {
          type: "number",
          min: 0,
          className: "input",
          value: n.newCount,
          onChange: (t) => e({ ...n, newCount: parseInt(t.target.value, 10) || 0 })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ f(D, { title: "Recently Updated", children: [
      /* @__PURE__ */ d(
        Ft,
        {
          label: "Show this section",
          value: n.showRecentlyUpdated,
          onChange: (t) => e({ ...n, showRecentlyUpdated: t })
        }
      ),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ d(S, { label: "Heading", children: /* @__PURE__ */ d(
          "input",
          {
            className: "input",
            value: n.recentlyUpdatedHeading,
            onChange: (t) => e({ ...n, recentlyUpdatedHeading: t.target.value })
          }
        ) }),
        /* @__PURE__ */ d(S, { label: "Item count", children: /* @__PURE__ */ d(
          "input",
          {
            type: "number",
            min: 0,
            className: "input",
            value: n.recentlyUpdatedCount,
            onChange: (t) => e({ ...n, recentlyUpdatedCount: parseInt(t.target.value, 10) || 0 })
          }
        ) })
      ] })
    ] })
  ] });
}
function Oo({
  single: n,
  onChange: e
}) {
  return /* @__PURE__ */ f("div", { className: "space-y-4", children: [
    /* @__PURE__ */ d(D, { title: "Section labels", children: /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ d(S, { label: "Description", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.descriptionLabel,
          onChange: (t) => e({ ...n, descriptionLabel: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Specifications", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.specificationsLabel,
          onChange: (t) => e({ ...n, specificationsLabel: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Features", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.featuresLabel,
          onChange: (t) => e({ ...n, featuresLabel: t.target.value })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ d(D, { title: "Call-to-action labels", children: /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ d(S, { label: "Download button", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.downloadLabel,
          onChange: (t) => e({ ...n, downloadLabel: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Preview button", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.previewLabel,
          onChange: (t) => e({ ...n, previewLabel: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Free badge", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.freeBadgeLabel,
          onChange: (t) => e({ ...n, freeBadgeLabel: t.target.value })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ f(D, { title: "Block visibility", children: [
      /* @__PURE__ */ d(
        Ft,
        {
          label: "Show specs block when present in body",
          value: n.showSpecs,
          onChange: (t) => e({ ...n, showSpecs: t })
        }
      ),
      /* @__PURE__ */ d(
        Ft,
        {
          label: "Show features block when present in body",
          value: n.showFeatures,
          onChange: (t) => e({ ...n, showFeatures: t })
        }
      )
    ] })
  ] });
}
function Ro({
  sidebar: n,
  onChange: e
}) {
  return /* @__PURE__ */ f("div", { className: "space-y-4", children: [
    /* @__PURE__ */ f(D, { title: "Top section", children: [
      /* @__PURE__ */ d(S, { label: "Heading", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.heading,
          onChange: (t) => e({ ...n, heading: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(
        Et,
        {
          items: n.topItems,
          onChange: (t) => e({ ...n, topItems: t })
        }
      )
    ] }),
    /* @__PURE__ */ f(D, { title: "Categories", children: [
      /* @__PURE__ */ d(S, { label: "Heading", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.categoriesHeading,
          onChange: (t) => e({ ...n, categoriesHeading: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(
        Et,
        {
          items: n.categoriesItems,
          onChange: (t) => e({ ...n, categoriesItems: t })
        }
      )
    ] }),
    /* @__PURE__ */ f(D, { title: "Documentation", children: [
      /* @__PURE__ */ d(S, { label: "Heading", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n.docsHeading ?? "",
          onChange: (t) => e({ ...n, docsHeading: t.target.value })
        }
      ) }),
      /* @__PURE__ */ d(
        Et,
        {
          items: n.docsItems ?? [],
          onChange: (t) => e({ ...n, docsItems: t })
        }
      )
    ] })
  ] });
}
function $o({
  copyright: n,
  wordmark: e,
  onChange: t
}) {
  return /* @__PURE__ */ f("div", { className: "space-y-4", children: [
    /* @__PURE__ */ d(D, { title: "Brand", children: /* @__PURE__ */ f(S, { label: "Wordmark", children: [
      /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: e,
          onChange: (r) => t({ copyright: n }, { wordmark: r.target.value })
        }
      ),
      /* @__PURE__ */ d("p", { className: "text-xs text-surface-500 mt-1", children: "Leave empty to fall back to the site title." })
    ] }) }),
    /* @__PURE__ */ d(D, { title: "Footer", children: /* @__PURE__ */ f(S, { label: "Copyright line", children: [
      /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: n,
          onChange: (r) => t({ copyright: r.target.value }, { wordmark: e })
        }
      ),
      /* @__PURE__ */ f("p", { className: "text-xs text-surface-500 mt-1", children: [
        "Empty falls back to ",
        /* @__PURE__ */ d("code", { children: "© <year> <site title>." })
      ] })
    ] }) })
  ] });
}
function Bo({
  style: n,
  onChange: e
}) {
  const t = [
    { name: "--color-primary", label: "Primary (action color)" },
    { name: "--color-secondary", label: "Secondary" },
    { name: "--color-tertiary", label: "Tertiary" },
    { name: "--color-background", label: "Background" },
    { name: "--color-on-surface", label: "Text" }
  ], r = [
    ...Object.keys(Ne.sans).map((a) => ({
      name: a,
      fallback: "sans-serif"
    })),
    ...Object.keys(Ne.serif).map((a) => ({
      name: a,
      fallback: "serif"
    }))
  ];
  function i(a, s) {
    const l = { ...n.vars };
    s && s.trim() ? l[a] = s : delete l[a], e({ ...n, vars: l });
  }
  function o(a) {
    const s = { ...n.vars };
    delete s[a], e({ ...n, vars: s });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-4", children: [
    /* @__PURE__ */ d("link", { rel: "stylesheet", href: wo() }),
    /* @__PURE__ */ d(D, { title: "Typography", children: /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ d(S, { label: "Headline font", children: /* @__PURE__ */ d(
        mn,
        {
          options: r,
          value: n.fontHeadline,
          onChange: (a) => e({ ...n, fontHeadline: a }),
          ariaLabel: "Headline font"
        }
      ) }),
      /* @__PURE__ */ d(S, { label: "Body font", children: /* @__PURE__ */ d(
        mn,
        {
          options: r,
          value: n.fontBody,
          onChange: (a) => e({ ...n, fontBody: a }),
          ariaLabel: "Body font"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ f(D, { title: "Palette overrides", children: [
      /* @__PURE__ */ d("p", { className: "text-xs text-surface-500", children: "Leave a field empty to keep the bundled default. Click ↺ to clear an override." }),
      /* @__PURE__ */ d("div", { className: "space-y-2", children: t.map((a) => /* @__PURE__ */ d(
        Lo,
        {
          label: a.label,
          value: n.vars[a.name] ?? "",
          onChange: (s) => i(a.name, s),
          onClear: () => o(a.name)
        },
        a.name
      )) })
    ] })
  ] });
}
function zo({
  active: n,
  onClick: e,
  label: t
}) {
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      onClick: e,
      className: n ? "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-blue-600 text-surface-900 dark:text-surface-50" : "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100",
      children: t
    }
  );
}
function D({ title: n, children: e }) {
  return /* @__PURE__ */ f("section", { className: "card p-4 space-y-3", children: [
    /* @__PURE__ */ d("h3", { className: "text-sm font-semibold text-surface-900 dark:text-surface-50", children: n }),
    e
  ] });
}
function S({ label: n, children: e }) {
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ d("label", { className: "label", children: n }),
    e
  ] });
}
function Ft({
  label: n,
  value: e,
  onChange: t
}) {
  return /* @__PURE__ */ f("label", { className: "flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer", children: [
    /* @__PURE__ */ d(
      "input",
      {
        type: "checkbox",
        checked: e,
        onChange: (r) => t(r.target.checked),
        className: "h-4 w-4 rounded border-surface-300 text-blue-600 focus:ring-blue-500"
      }
    ),
    /* @__PURE__ */ d("span", { children: n })
  ] });
}
function Lo({
  label: n,
  value: e,
  onChange: t,
  onClear: r
}) {
  const i = !!e;
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ d(
      "input",
      {
        type: "color",
        value: /^#/.test(e) ? e : "#0037b0",
        onChange: (o) => t(o.target.value),
        className: "h-8 w-10 rounded border border-surface-300 dark:border-surface-700 cursor-pointer shrink-0"
      }
    ),
    /* @__PURE__ */ d("span", { className: "flex-1 text-sm text-surface-700 dark:text-surface-300", children: n }),
    /* @__PURE__ */ d("code", { className: "text-xs text-surface-500 tabular-nums", children: e || "default" }),
    /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        onClick: r,
        disabled: !i,
        className: "p-1 rounded text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed",
        title: "Clear override",
        "aria-label": "Clear override",
        children: /* @__PURE__ */ d(ar, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
function Et({
  items: n,
  onChange: e
}) {
  const [t, r] = he(/* @__PURE__ */ new Set());
  function i(c, p) {
    const u = [...n];
    u[c] = { ...u[c], ...p }, e(u);
  }
  function o(c, p, u) {
    var A;
    const h = n[c], b = { ...((A = h.translations) == null ? void 0 : A[p]) ?? {}, ...u }, g = {};
    b.label && b.label.trim() !== "" && (g.label = b.label), b.href && b.href.trim() !== "" && (g.href = b.href);
    const y = { ...h.translations ?? {} };
    Object.keys(g).length === 0 ? delete y[p] : y[p] = g;
    const v = [...n];
    v[c] = {
      ...h,
      translations: Object.keys(y).length === 0 ? void 0 : y
    }, e(v);
  }
  function a(c) {
    e(n.filter((p, u) => u !== c)), r((p) => {
      const u = /* @__PURE__ */ new Set();
      for (const h of p)
        h < c ? u.add(h) : h > c && u.add(h - 1);
      return u;
    });
  }
  function s() {
    e([...n, { icon: "", label: "", href: "" }]);
  }
  function l(c) {
    r((p) => {
      const u = new Set(p);
      return u.has(c) ? u.delete(c) : u.add(c), u;
    });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-2", children: [
    n.length === 0 && /* @__PURE__ */ d("p", { className: "text-xs text-surface-500", children: "No items yet." }),
    n.map((c, p) => {
      var b;
      const u = t.has(p), h = (b = c.translations) == null ? void 0 : b.fr, m = !!(h != null && h.label || h != null && h.href);
      return /* @__PURE__ */ f(
        "div",
        {
          className: "p-2 rounded border border-surface-200 dark:border-surface-800 space-y-2",
          children: [
            /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_2fr_3fr_auto_auto] gap-2 items-center", children: [
              /* @__PURE__ */ d(
                "input",
                {
                  className: "input text-xs",
                  placeholder: "Icon",
                  value: c.icon,
                  onChange: (g) => i(p, { icon: g.target.value })
                }
              ),
              /* @__PURE__ */ d(
                "input",
                {
                  className: "input text-xs",
                  placeholder: "Label",
                  value: c.label,
                  onChange: (g) => i(p, { label: g.target.value })
                }
              ),
              /* @__PURE__ */ d(
                "input",
                {
                  className: "input text-xs",
                  placeholder: "/path/to/page.html",
                  value: c.href,
                  onChange: (g) => i(p, { href: g.target.value })
                }
              ),
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => l(p),
                  className: "px-2 py-1 rounded text-[10px] font-semibold tracking-wider uppercase border " + (m ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "border-surface-300 text-surface-500 dark:border-surface-700 dark:text-surface-400"),
                  "aria-label": m ? "Edit FR translation" : "Add FR translation",
                  title: m ? "FR translation present — click to edit" : "Add FR translation",
                  children: "FR"
                }
              ),
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => a(p),
                  className: "p-1.5 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30",
                  "aria-label": "Remove item",
                  title: "Remove item",
                  children: /* @__PURE__ */ d(ye, { className: "h-3.5 w-3.5" })
                }
              )
            ] }),
            u && /* @__PURE__ */ f("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_2fr_3fr] gap-2 pt-2 border-t border-surface-200 dark:border-surface-800", children: [
              /* @__PURE__ */ d("span", { className: "text-[10px] font-semibold tracking-wider uppercase text-surface-500 self-center", children: "FR" }),
              /* @__PURE__ */ d(
                "input",
                {
                  className: "input text-xs",
                  placeholder: `Label FR (default: ${c.label || "—"})`,
                  value: (h == null ? void 0 : h.label) ?? "",
                  onChange: (g) => o(p, "fr", { label: g.target.value })
                }
              ),
              /* @__PURE__ */ d(
                "input",
                {
                  className: "input text-xs",
                  placeholder: `Href FR (default: ${c.href || "—"})`,
                  value: (h == null ? void 0 : h.href) ?? "",
                  onChange: (g) => o(p, "fr", { href: g.target.value })
                }
              )
            ] })
          ]
        },
        p
      );
    }),
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        onClick: s,
        className: "btn-secondary text-xs",
        children: [
          /* @__PURE__ */ d(Ee, { className: "h-3.5 w-3.5" }),
          "Add item"
        ]
      }
    )
  ] });
}
function O(n) {
  this.content = n;
}
O.prototype = {
  constructor: O,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), o = r.content.slice();
    return i == -1 ? o.push(t || n, e) : (o[i + 1] = e, t && (o[i] = t)), new O(o);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new O(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new O([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new O(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), o = r.find(n);
    return i.splice(o == -1 ? i.length : o, 0, e, t), new O(i);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = O.from(n), n.size ? new O(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = O.from(n), n.size ? new O(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = O.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
O.from = function(n) {
  if (n instanceof O) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new O(e);
};
function cr(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), o = e.child(r);
    if (i == o) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(o))
      return t;
    if (i.isText && i.text != o.text) {
      for (let a = 0; i.text[a] == o.text[a]; a++)
        t++;
      return t;
    }
    if (i.content.size || o.content.size) {
      let a = cr(i.content, o.content, t + 1);
      if (a != null)
        return a;
    }
    t += i.nodeSize;
  }
}
function dr(n, e, t, r) {
  for (let i = n.childCount, o = e.childCount; ; ) {
    if (i == 0 || o == 0)
      return i == o ? null : { a: t, b: r };
    let a = n.child(--i), s = e.child(--o), l = a.nodeSize;
    if (a == s) {
      t -= l, r -= l;
      continue;
    }
    if (!a.sameMarkup(s))
      return { a: t, b: r };
    if (a.isText && a.text != s.text) {
      let c = 0, p = Math.min(a.text.length, s.text.length);
      for (; c < p && a.text[a.text.length - c - 1] == s.text[s.text.length - c - 1]; )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (a.content.size || s.content.size) {
      let c = dr(a.content, s.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= l, r -= l;
  }
}
class x {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, i = 0, o) {
    for (let a = 0, s = 0; s < t; a++) {
      let l = this.content[a], c = s + l.nodeSize;
      if (c > e && r(l, i + s, o || null, a) !== !1 && l.content.size) {
        let p = s + 1;
        l.nodesBetween(Math.max(0, e - p), Math.min(l.content.size, t - p), r, i + p);
      }
      s = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, i) {
    let o = "", a = !0;
    return this.nodesBetween(e, t, (s, l) => {
      let c = s.isText ? s.text.slice(Math.max(e, l) - l, t - l) : s.isLeaf ? i ? typeof i == "function" ? i(s) : i : s.type.spec.leafText ? s.type.spec.leafText(s) : "" : "";
      s.isBlock && (s.isLeaf && c || s.isTextblock) && r && (a ? a = !1 : o += r), o += c;
    }, 0), o;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), o = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), o = 1); o < e.content.length; o++)
      i.push(e.content[o]);
    return new x(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let o = 0, a = 0; a < t; o++) {
        let s = this.content[o], l = a + s.nodeSize;
        l > e && ((a < e || l > t) && (s.isText ? s = s.cut(Math.max(0, e - a), Math.min(s.text.length, t - a)) : s = s.cut(Math.max(0, e - a - 1), Math.min(s.content.size, t - a - 1))), r.push(s), i += s.nodeSize), a = l;
      }
    return new x(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? x.empty : e == 0 && t == this.content.length ? this : new x(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let i = this.content.slice(), o = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new x(i, o);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new x([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new x(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return cr(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return dr(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return tt(0, e);
    if (e == this.size)
      return tt(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), o = r + i.nodeSize;
      if (o >= e)
        return o == e ? tt(t + 1, o) : tt(t, r);
      r = o;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return x.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new x(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return x.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      r += o.nodeSize, i && o.isText && e[i - 1].sameMarkup(o) ? (t || (t = e.slice(0, i)), t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)) : t && t.push(o);
    }
    return new x(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return x.empty;
    if (e instanceof x)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new x([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
x.empty = new x([], 0);
const At = { index: 0, offset: 0 };
function tt(n, e) {
  return At.index = n, At.offset = e, At;
}
function ct(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!ct(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !ct(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class C {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if (this.eq(o))
        return e;
      if (this.type.excludes(o.type))
        t || (t = e.slice(0, i));
      else {
        if (o.type.excludes(this.type))
          return e;
        !r && o.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(o);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && ct(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = r.create(t.attrs);
    return r.checkAttrs(i.attrs), i;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return C.none;
    if (e instanceof C)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
}
C.none = [];
class dt extends Error {
}
class w {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = ur(this.content, e + this.openStart, t);
    return r && new w(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new w(pr(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return w.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new w(x.fromJSON(e, t.content), r, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let o = e.firstChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.firstChild)
      r++;
    for (let o = e.lastChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.lastChild)
      i++;
    return new w(e, r, i);
  }
}
w.empty = new w(x.empty, 0, 0);
function pr(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), o = n.maybeChild(r), { index: a, offset: s } = n.findIndex(t);
  if (i == e || o.isText) {
    if (s != t && !n.child(a).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != a)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, o.copy(pr(o.content, e - i - 1, t - i - 1)));
}
function ur(n, e, t, r) {
  let { index: i, offset: o } = n.findIndex(e), a = n.maybeChild(i);
  if (o == e || a.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let s = ur(a.content, e - o - 1, t, a);
  return s && n.replaceChild(i, a.copy(s));
}
function Fo(n, e, t) {
  if (t.openStart > n.depth)
    throw new dt("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new dt("Inconsistent open depths");
  return hr(n, e, t, 0);
}
function hr(n, e, t, r) {
  let i = n.index(r), o = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let a = hr(n, e, t, r + 1);
    return o.copy(o.content.replaceChild(i, a));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let a = n.parent, s = a.content;
      return me(a, s.cut(0, n.parentOffset).append(t.content).append(s.cut(e.parentOffset)));
    } else {
      let { start: a, end: s } = Po(t, n);
      return me(o, mr(n, a, s, e, r));
    }
  else return me(o, pt(n, e, r));
}
function fr(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new dt("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Pt(n, e, t) {
  let r = n.node(t);
  return fr(r, e.node(t)), r;
}
function fe(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Re(n, e, t, r) {
  let i = (e || n).node(t), o = 0, a = e ? e.index(t) : i.childCount;
  n && (o = n.index(t), n.depth > t ? o++ : n.textOffset && (fe(n.nodeAfter, r), o++));
  for (let s = o; s < a; s++)
    fe(i.child(s), r);
  e && e.depth == t && e.textOffset && fe(e.nodeBefore, r);
}
function me(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function mr(n, e, t, r, i) {
  let o = n.depth > i && Pt(n, e, i + 1), a = r.depth > i && Pt(t, r, i + 1), s = [];
  return Re(null, n, i, s), o && a && e.index(i) == t.index(i) ? (fr(o, a), fe(me(o, mr(n, e, t, r, i + 1)), s)) : (o && fe(me(o, pt(n, e, i + 1)), s), Re(e, t, i, s), a && fe(me(a, pt(t, r, i + 1)), s)), Re(r, null, i, s), new x(s);
}
function pt(n, e, t) {
  let r = [];
  if (Re(null, n, t, r), n.depth > t) {
    let i = Pt(n, e, t + 1);
    fe(me(i, pt(n, e, t + 1)), r);
  }
  return Re(e, null, t, r), new x(r);
}
function Po(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let o = t - 1; o >= 0; o--)
    i = e.node(o).copy(x.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Je {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++)
      i += r.child(o).nodeSize;
    return i;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return C.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let s = r;
      r = i, i = s;
    }
    let o = r.marks;
    for (var a = 0; a < o.length; a++)
      o[a].type.spec.inclusive === !1 && (!i || !o[a].isInSet(i.marks)) && (o = o[a--].removeFromSet(o));
    return o;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var o = 0; o < r.length; o++)
      r[o].type.spec.inclusive === !1 && (!i || !r[o].isInSet(i.marks)) && (r = r[o--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new ut(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], i = 0, o = t;
    for (let a = e; ; ) {
      let { index: s, offset: l } = a.content.findIndex(o), c = o - l;
      if (r.push(a, s, i + l), !c || (a = a.child(s), a.isText))
        break;
      o = c - 1, i += l + 1;
    }
    return new Je(t, r, o);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = wn.get(e);
    if (r)
      for (let o = 0; o < r.elts.length; o++) {
        let a = r.elts[o];
        if (a.pos == t)
          return a;
      }
    else
      wn.set(e, r = new Do());
    let i = r.elts[r.i] = Je.resolve(e, t);
    return r.i = (r.i + 1) % Ho, i;
  }
}
class Do {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const Ho = 12, wn = /* @__PURE__ */ new WeakMap();
class ut {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const jo = /* @__PURE__ */ Object.create(null);
let ge = class Dt {
  /**
  @internal
  */
  constructor(e, t, r, i = C.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || x.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && ct(this.attrs, t || e.defaultAttrs || jo) && C.sameSet(this.marks, r || C.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Dt(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Dt(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return w.empty;
    let i = this.resolve(e), o = this.resolve(t), a = r ? 0 : i.sharedDepth(t), s = i.start(a), c = i.node(a).content.cut(i.pos - s, o.pos - s);
    return new w(c, i.depth - a, o.depth - a);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return Fo(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return Je.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Je.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (o) => (r.isInSet(o.marks) && (i = !0), !i)), i;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), gr(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = x.empty, i = 0, o = r.childCount) {
    let a = this.contentMatchAt(e).matchFragment(r, i, o), s = a && a.matchFragment(this.content, t);
    if (!s || !s.validEnd)
      return !1;
    for (let l = i; l < o; l++)
      if (!this.type.allowsMarks(r.child(l).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let o = this.contentMatchAt(e).matchType(r), a = o && o.matchFragment(this.content, t);
    return a ? a.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = C.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!C.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = x.fromJSON(e, t.content), o = e.nodeType(t.type).create(t.attrs, i, r);
    return o.type.checkAttrs(o.attrs), o;
  }
};
ge.prototype.text = void 0;
class ht extends ge {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : gr(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new ht(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new ht(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function gr(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class be {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new Uo(e, t);
    if (r.next == null)
      return be.empty;
    let i = br(r);
    r.next && r.err("Unexpected trailing text");
    let o = Yo(Ko(i));
    return Xo(o, r), o;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let o = t; i && o < r; o++)
      i = i.matchType(e.child(o).type);
    return i;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function o(a, s) {
      let l = a.matchFragment(e, r);
      if (l && (!t || l.validEnd))
        return x.from(s.map((c) => c.createAndFill()));
      for (let c = 0; c < a.next.length; c++) {
        let { type: p, next: u } = a.next[c];
        if (!(p.isText || p.hasRequiredAttrs()) && i.indexOf(u) == -1) {
          i.push(u);
          let h = o(u, s.concat(p));
          if (h)
            return h;
        }
      }
      return null;
    }
    return o(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(), o = i.match;
      if (o.matchType(e)) {
        let a = [];
        for (let s = i; s.type; s = s.via)
          a.push(s.type);
        return a.reverse();
      }
      for (let a = 0; a < o.next.length; a++) {
        let { type: s, next: l } = o.next[a];
        !s.isLeaf && !s.hasRequiredAttrs() && !(s.name in t) && (!i.type || l.validEnd) && (r.push({ match: s.contentMatch, type: s, via: i }), t[s.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let o = i + (r.validEnd ? "*" : " ") + " ";
      for (let a = 0; a < r.next.length; a++)
        o += (a ? ", " : "") + r.next[a].type.name + "->" + e.indexOf(r.next[a].next);
      return o;
    }).join(`
`);
  }
}
be.empty = new be(!0);
class Uo {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function br(n) {
  let e = [];
  do
    e.push(Vo(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Vo(n) {
  let e = [];
  do
    e.push(Jo(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Jo(n) {
  let e = Go(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = qo(n, e);
    else
      break;
  return e;
}
function kn(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function qo(n, e) {
  let t = kn(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = kn(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function Wo(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let o in t) {
    let a = t[o];
    a.isInGroup(e) && i.push(a);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function Go(n) {
  if (n.eat("(")) {
    let e = br(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Wo(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Ko(n) {
  let e = [[]];
  return i(o(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(a, s, l) {
    let c = { term: l, to: s };
    return e[a].push(c), c;
  }
  function i(a, s) {
    a.forEach((l) => l.to = s);
  }
  function o(a, s) {
    if (a.type == "choice")
      return a.exprs.reduce((l, c) => l.concat(o(c, s)), []);
    if (a.type == "seq")
      for (let l = 0; ; l++) {
        let c = o(a.exprs[l], s);
        if (l == a.exprs.length - 1)
          return c;
        i(c, s = t());
      }
    else if (a.type == "star") {
      let l = t();
      return r(s, l), i(o(a.expr, l), l), [r(l)];
    } else if (a.type == "plus") {
      let l = t();
      return i(o(a.expr, s), l), i(o(a.expr, l), l), [r(l)];
    } else {
      if (a.type == "opt")
        return [r(s)].concat(o(a.expr, s));
      if (a.type == "range") {
        let l = s;
        for (let c = 0; c < a.min; c++) {
          let p = t();
          i(o(a.expr, l), p), l = p;
        }
        if (a.max == -1)
          i(o(a.expr, l), l);
        else
          for (let c = a.min; c < a.max; c++) {
            let p = t();
            r(l, p), i(o(a.expr, l), p), l = p;
          }
        return [r(l)];
      } else {
        if (a.type == "name")
          return [r(s, void 0, a.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function yr(n, e) {
  return e - n;
}
function _n(n, e) {
  let t = [];
  return r(e), t.sort(yr);
  function r(i) {
    let o = n[i];
    if (o.length == 1 && !o[0].term)
      return r(o[0].to);
    t.push(i);
    for (let a = 0; a < o.length; a++) {
      let { term: s, to: l } = o[a];
      !s && t.indexOf(l) == -1 && r(l);
    }
  }
}
function Yo(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(_n(n, 0));
  function t(r) {
    let i = [];
    r.forEach((a) => {
      n[a].forEach(({ term: s, to: l }) => {
        if (!s)
          return;
        let c;
        for (let p = 0; p < i.length; p++)
          i[p][0] == s && (c = i[p][1]);
        _n(n, l).forEach((p) => {
          c || i.push([s, c = []]), c.indexOf(p) == -1 && c.push(p);
        });
      });
    });
    let o = e[r.join(",")] = new be(r.indexOf(n.length - 1) > -1);
    for (let a = 0; a < i.length; a++) {
      let s = i[a][1].sort(yr);
      o.next.push({ type: i[a][0], next: e[s.join(",")] || t(s) });
    }
    return o;
  }
}
function Xo(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], o = !i.validEnd, a = [];
    for (let s = 0; s < i.next.length; s++) {
      let { type: l, next: c } = i.next[s];
      a.push(l.name), o && !(l.isText || l.hasRequiredAttrs()) && (o = !1), r.indexOf(c) == -1 && r.push(c);
    }
    o && e.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function xr(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function vr(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let o = n[r];
      if (o.hasDefault)
        i = o.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function wr(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let o = n[i];
    o.validate && o.validate(e[i]);
  }
}
function kr(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new Zo(n, r, e[r]);
  return t;
}
class ft {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = kr(e, r.attrs), this.defaultAttrs = xr(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == be.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : vr(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new ge(this, this.computeAttrs(e), x.from(t), C.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = x.from(t), this.checkContent(t), new ge(this, this.computeAttrs(e), t, C.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = x.from(t), t.size) {
      let a = this.contentMatch.fillBefore(t);
      if (!a)
        return null;
      t = a.append(t);
    }
    let i = this.contentMatch.matchFragment(t), o = i && i.fillBefore(x.empty, !0);
    return o ? new ge(this, e, t.append(o), C.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    wr(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : C.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((o, a) => r[o] = new ft(o, t, a));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let o in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
}
function Qo(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let o = i === null ? "null" : typeof i;
    if (r.indexOf(o) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${o}`);
  };
}
class Zo {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? Qo(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Wt {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = kr(e, i.attrs), this.excluded = null;
    let o = xr(this.attrs);
    this.instance = o ? new C(this, o) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new C(this, vr(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((o, a) => r[o] = new Wt(o, i++, t, a)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    wr(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class ea {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = O.from(e.nodes), t.marks = O.from(e.marks || {}), this.nodes = ft.compile(this.spec.nodes, this), this.marks = Wt.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let o = this.nodes[i], a = o.spec.content || "", s = o.spec.marks;
      if (o.contentMatch = r[a] || (r[a] = be.parse(a, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = o;
      }
      o.markSet = s == "_" ? null : s ? Nn(this, s.split(" ")) : s == "" || !o.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let o = this.marks[i], a = o.spec.excludes;
      o.excluded = a == null ? [o] : a == "" ? [] : Nn(this, a.split(" "));
    }
    this.nodeFromJSON = (i) => ge.fromJSON(this, i), this.markFromJSON = (i) => C.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof ft) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new ht(r, r.defaultAttrs, e, C.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Nn(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], o = n.marks[i], a = o;
    if (o)
      t.push(o);
    else
      for (let s in n.marks) {
        let l = n.marks[s];
        (i == "_" || l.spec.group && l.spec.group.split(" ").indexOf(i) > -1) && t.push(a = l);
      }
    if (!a)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function ta(n) {
  return n.tag != null;
}
function na(n) {
  return n.style != null;
}
class _e {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (ta(i))
        this.tags.push(i);
      else if (na(i)) {
        let o = /[^=]*/.exec(i.style)[0];
        r.indexOf(o) < 0 && r.push(o), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let o = e.nodes[i.node];
      return o.contentMatch.matchType(o);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Sn(this, t, !1);
    return r.addAll(e, C.none, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Sn(this, t, !0);
    return r.addAll(e, C.none, t.from, t.to), w.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let o = this.tags[i];
      if (oa(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
        if (o.getAttrs) {
          let a = o.getAttrs(e);
          if (a === !1)
            continue;
          o.attrs = a || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, i) {
    for (let o = i ? this.styles.indexOf(i) + 1 : 0; o < this.styles.length; o++) {
      let a = this.styles[o], s = a.style;
      if (!(s.indexOf(e) != 0 || a.context && !r.matchesContext(a.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      s.length > e.length && (s.charCodeAt(e.length) != 61 || s.slice(e.length + 1) != t))) {
        if (a.getAttrs) {
          let l = a.getAttrs(t);
          if (l === !1)
            continue;
          a.attrs = l || void 0;
        }
        return a;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let o = i.priority == null ? 50 : i.priority, a = 0;
      for (; a < t.length; a++) {
        let s = t[a];
        if ((s.priority == null ? 50 : s.priority) < o)
          break;
      }
      t.splice(a, 0, i);
    }
    for (let i in e.marks) {
      let o = e.marks[i].spec.parseDOM;
      o && o.forEach((a) => {
        r(a = En(a)), a.mark || a.ignore || a.clearMark || (a.mark = i);
      });
    }
    for (let i in e.nodes) {
      let o = e.nodes[i].spec.parseDOM;
      o && o.forEach((a) => {
        r(a = En(a)), a.node || a.ignore || a.mark || (a.node = i);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new _e(e, _e.schemaRules(e)));
  }
}
const _r = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, ra = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Nr = { ol: !0, ul: !0 }, qe = 1, Ht = 2, $e = 4;
function Cn(n, e, t) {
  return e != null ? (e ? qe : 0) | (e === "full" ? Ht : 0) : n && n.whitespace == "pre" ? qe | Ht : t & ~$e;
}
class nt {
  constructor(e, t, r, i, o, a) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = a, this.content = [], this.activeMarks = C.none, this.match = o || (a & $e ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(x.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & qe)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let o = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - i[0].length));
      }
    }
    let t = x.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(x.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !_r.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Sn {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, o, a = Cn(null, t.preserveWhitespace, 0) | (r ? $e : 0);
    i ? o = new nt(i.type, i.attrs, C.none, !0, t.topMatch || i.type.contentMatch, a) : r ? o = new nt(null, null, C.none, !0, null, a) : o = new nt(e.schema.topNodeType, null, C.none, !0, null, a), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let r = e.nodeValue, i = this.top, o = i.options & Ht ? "full" : this.localPreserveWS || (i.options & qe) > 0, { schema: a } = this.parser;
    if (o === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(r)) {
      if (o)
        if (o === "full")
          r = r.replace(/\r\n?/g, `
`);
        else if (a.linebreakReplacement && /[\r\n]/.test(r) && this.top.findWrapping(a.linebreakReplacement.create())) {
          let s = r.split(/\r?\n|\r/);
          for (let l = 0; l < s.length; l++)
            l && this.insertNode(a.linebreakReplacement.create(), t, !0), s[l] && this.insertNode(a.text(s[l]), t, !/\S/.test(s[l]));
          r = "";
        } else
          r = r.replace(/\r?\n|\r/g, " ");
      else if (r = r.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(r) && this.open == this.nodes.length - 1) {
        let s = i.content[i.content.length - 1], l = e.previousSibling;
        (!s || l && l.nodeName == "BR" || s.isText && /[ \t\r\n\u000c]$/.test(s.text)) && (r = r.slice(1));
      }
      r && this.insertNode(a.text(r), t, !/\S/.test(r)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, r) {
    let i = this.localPreserveWS, o = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let a = e.nodeName.toLowerCase(), s;
    Nr.hasOwnProperty(a) && this.parser.normalizeLists && ia(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : ra.hasOwnProperty(a))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, p = this.needsBlock;
      if (_r.hasOwnProperty(a))
        o.content.length && o.content[0].isInline && this.open && (this.open--, o = this.top), c = !0, o.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let u = l && l.skip ? t : this.readStyles(e, t);
      u && this.addAll(e, u), c && this.sync(o), this.needsBlock = p;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, l, c, l.consuming === !1 ? s : void 0);
    }
    this.localPreserveWS = i;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let r = e.style;
    if (r && r.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let o = this.parser.matchedStyles[i], a = r.getPropertyValue(o);
        if (a)
          for (let s = void 0; ; ) {
            let l = this.parser.matchStyle(o, a, this, s);
            if (!l)
              break;
            if (l.ignore)
              return null;
            if (l.clearMark ? t = t.filter((c) => !l.clearMark(c)) : t = t.concat(this.parser.schema.marks[l.mark].create(l.attrs)), l.consuming === !1)
              s = l;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r, i) {
    let o, a;
    if (t.node)
      if (a = this.parser.schema.nodes[t.node], a.isLeaf)
        this.insertNode(a.create(t.attrs), r, e.nodeName == "BR") || this.leafFallback(e, r);
      else {
        let l = this.enter(a, t.attrs || null, r, t.preserveWhitespace);
        l && (o = !0, r = l);
      }
    else {
      let l = this.parser.schema.marks[t.mark];
      r = r.concat(l.create(t.attrs));
    }
    let s = this.top;
    if (a && a.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, r, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l, r, !1));
    else {
      let l = e;
      typeof t.contentElement == "string" ? l = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? l = t.contentElement(e) : t.contentElement && (l = t.contentElement), this.findAround(e, l, !0), this.addAll(l, r), this.findAround(e, l, !1);
    }
    o && this.sync(s) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r, i) {
    let o = r || 0;
    for (let a = r ? e.childNodes[r] : e.firstChild, s = i == null ? null : e.childNodes[i]; a != s; a = a.nextSibling, ++o)
      this.findAtPoint(e, o), this.addDOM(a, t);
    this.findAtPoint(e, o);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, r) {
    let i, o;
    for (let a = this.open, s = 0; a >= 0; a--) {
      let l = this.nodes[a], c = l.findWrapping(e);
      if (c && (!i || i.length > c.length + s) && (i = c, o = l, !c.length))
        break;
      if (l.solid) {
        if (r)
          break;
        s += 2;
      }
    }
    if (!i)
      return null;
    this.sync(o);
    for (let a = 0; a < i.length; a++)
      t = this.enterInner(i[a], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, r) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let o = this.textblockFromContext();
      o && (t = this.enterInner(o, null, t));
    }
    let i = this.findPlace(e, t, r);
    if (i) {
      this.closeExtra();
      let o = this.top;
      o.match && (o.match = o.match.matchType(e.type));
      let a = C.none;
      for (let s of i.concat(e.marks))
        (o.type ? o.type.allowsMarkType(s.type) : An(s.type, e.type)) && (a = s.addToSet(a));
      return o.content.push(e.mark(a)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r, i) {
    let o = this.findPlace(e.create(t), r, !1);
    return o && (o = this.enterInner(e, t, r, !0, i)), o;
  }
  // Open a node of the given type
  enterInner(e, t, r, i = !1, o) {
    this.closeExtra();
    let a = this.top;
    a.match = a.match && a.match.matchType(e);
    let s = Cn(e, o, a.options);
    a.options & $e && a.content.length == 0 && (s |= $e);
    let l = C.none;
    return r = r.filter((c) => (a.type ? a.type.allowsMarkType(c.type) : An(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new nt(e, t, l, i, null, s)), this.open++, r;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= qe);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), o = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), a = (s, l) => {
      for (; s >= 0; s--) {
        let c = t[s];
        if (c == "") {
          if (s == t.length - 1 || s == 0)
            continue;
          for (; l >= o; l--)
            if (a(s - 1, l))
              return !0;
          return !1;
        } else {
          let p = l > 0 || l == 0 && i ? this.nodes[l].type : r && l >= o ? r.node(l - o).type : null;
          if (!p || p.name != c && !p.isInGroup(c))
            return !1;
          l--;
        }
      }
      return !0;
    };
    return a(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
}
function ia(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Nr.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function oa(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function En(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function An(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let o = [], a = (s) => {
      o.push(s);
      for (let l = 0; l < s.edgeCount; l++) {
        let { type: c, next: p } = s.edge(l);
        if (c == e || o.indexOf(p) < 0 && a(p))
          return !0;
      }
    };
    if (a(i.contentMatch))
      return !0;
  }
}
const Cr = 65535, Sr = Math.pow(2, 16);
function aa(n, e) {
  return n + e * Sr;
}
function Mn(n) {
  return n & Cr;
}
function sa(n) {
  return (n - (n & Cr)) / Sr;
}
const Er = 1, Ar = 2, at = 4, Mr = 8;
class In {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Mr) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Er | at)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Ar | at)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & at) > 0;
  }
}
class U {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && U.empty)
      return U.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Mn(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + sa(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0, o = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let l = this.ranges[s] - (this.inverted ? i : 0);
      if (l > e)
        break;
      let c = this.ranges[s + o], p = this.ranges[s + a], u = l + c;
      if (e <= u) {
        let h = c ? e == l ? -1 : e == u ? 1 : t : t, m = l + i + (h < 0 ? 0 : p);
        if (r)
          return m;
        let b = e == (t < 0 ? l : u) ? null : aa(s / 3, e - l), g = e == l ? Ar : e == u ? Er : at;
        return (t < 0 ? e != l : e != u) && (g |= Mr), new In(m, g, b);
      }
      i += p - c;
    }
    return r ? e + i : new In(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Mn(t), o = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let l = this.ranges[s] - (this.inverted ? r : 0);
      if (l > e)
        break;
      let c = this.ranges[s + o], p = l + c;
      if (e <= p && s == i * 3)
        return !0;
      r += this.ranges[s + a] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, o = 0; i < this.ranges.length; i += 3) {
      let a = this.ranges[i], s = a - (this.inverted ? o : 0), l = a + (this.inverted ? 0 : o), c = this.ranges[i + t], p = this.ranges[i + r];
      e(s, s + c, l, l + p), o += p - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new U(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? U.empty : new U(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
U.empty = new U([]);
const Mt = /* @__PURE__ */ Object.create(null);
class L {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return U.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = Mt[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in Mt)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Mt[e] = t, t.prototype.jsonID = e, t;
  }
}
class I {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new I(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new I(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return I.ok(e.replace(t, r, i));
    } catch (o) {
      if (o instanceof dt)
        return I.fail(o.message);
      throw o;
    }
  }
}
function Gt(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let o = n.child(i);
    o.content.size && (o = o.copy(Gt(o.content, e, o))), o.isInline && (o = e(o, t, i)), r.push(o);
  }
  return x.fromArray(r);
}
class ce extends L {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), o = new w(Gt(t.content, (a, s) => !a.isAtom || !s.type.allowsMarkType(this.mark.type) ? a : a.mark(this.mark.addToSet(a.marks)), i), t.openStart, t.openEnd);
    return I.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new de(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new ce(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ce && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ce(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new ce(t.from, t.to, e.markFromJSON(t.mark));
  }
}
L.jsonID("addMark", ce);
class de extends L {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new w(Gt(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return I.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new ce(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new de(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof de && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new de(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new de(t.from, t.to, e.markFromJSON(t.mark));
  }
}
L.jsonID("removeMark", de);
class pe extends L {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return I.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return I.fromReplace(e, this.pos, this.pos + 1, new w(x.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new pe(this.pos, t.marks[i]);
        return new pe(this.pos, this.mark);
      }
    }
    return new We(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new pe(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new pe(t.pos, e.markFromJSON(t.mark));
  }
}
L.jsonID("addNodeMark", pe);
class We extends L {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return I.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return I.fromReplace(e, this.pos, this.pos + 1, new w(x.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new pe(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new We(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new We(t.pos, e.markFromJSON(t.mark));
  }
}
L.jsonID("removeNodeMark", We);
class P extends L {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && jt(e, this.from, this.to) ? I.fail("Structure replace would overwrite content") : I.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new U([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new P(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), r = this.from == this.to && P.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return r.deletedAcross && t.deletedAcross ? null : new P(r.pos, Math.max(r.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof P) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? w.empty : new w(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new P(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? w.empty : new w(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new P(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new P(t.from, t.to, w.fromJSON(e, t.slice), !!t.structure);
  }
}
P.MAP_BIAS = 1;
L.jsonID("replace", P);
class H extends L {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, i, o, a, s = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = o, this.insert = a, this.structure = s;
  }
  apply(e) {
    if (this.structure && (jt(e, this.from, this.gapFrom) || jt(e, this.gapTo, this.to)))
      return I.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return I.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? I.fromReplace(e, this.from, this.to, r) : I.fail("Content does not fit in gap");
  }
  getMap() {
    return new U([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new H(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), o = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || o > r.pos ? null : new H(t.pos, r.pos, i, o, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new H(t.from, t.to, t.gapFrom, t.gapTo, w.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
L.jsonID("replaceAround", H);
function jt(n, e, t) {
  let r = n.resolve(e), i = t - e, o = r.depth;
  for (; i > 0 && o > 0 && r.indexAfter(o) == r.node(o).childCount; )
    o--, i--;
  if (i > 0) {
    let a = r.node(o).maybeChild(r.indexAfter(o));
    for (; i > 0; ) {
      if (!a || a.isLeaf)
        return !0;
      a = a.firstChild, i--;
    }
  }
  return !1;
}
function la(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Ae(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, o = 0; ; --r) {
    let a = n.$from.node(r), s = n.$from.index(r) + i, l = n.$to.indexAfter(r) - o;
    if (r < n.depth && a.canReplace(s, l, t))
      return r;
    if (r == 0 || a.type.spec.isolating || !la(a, s, l))
      break;
    s && (i = 1), l < a.childCount && (o = 1);
  }
  return null;
}
function Ir(n, e, t = null, r = n) {
  let i = ca(n, e), o = i && da(r, e);
  return o ? i.map(Tn).concat({ type: e, attrs: t }).concat(o.map(Tn)) : null;
}
function Tn(n) {
  return { type: n, attrs: null };
}
function ca(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, o = t.contentMatchAt(r).findWrapping(e);
  if (!o)
    return null;
  let a = o.length ? o[0] : e;
  return t.canReplaceWith(r, i, a) ? o : null;
}
function da(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, o = t.child(r), a = e.contentMatch.findWrapping(o.type);
  if (!a)
    return null;
  let l = (a.length ? a[a.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : a;
}
function Z(n, e, t = 1, r) {
  let i = n.resolve(e), o = i.depth - t, a = r && r[r.length - 1] || i.parent;
  if (o < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !a.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, p = t - 2; c > o; c--, p--) {
    let u = i.node(c), h = i.index(c);
    if (u.type.spec.isolating)
      return !1;
    let m = u.content.cutByIndex(h, u.childCount), b = r && r[p + 1];
    b && (m = m.replaceChild(0, b.type.create(b.attrs)));
    let g = r && r[p] || u;
    if (!u.canReplace(h + 1, u.childCount) || !g.type.validContent(m))
      return !1;
  }
  let s = i.indexAfter(o), l = r && r[0];
  return i.node(o).canReplaceWith(s, s, l ? l.type : i.node(o + 1).type);
}
function xe(n, e) {
  let t = n.resolve(e), r = t.index();
  return Tr(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function pa(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let o = e.child(i), a = o.type == r ? n.type.schema.nodes.text : o.type;
    if (t = t.matchType(a), !t || !n.type.allowsMarks(o.marks))
      return !1;
  }
  return t.validEnd;
}
function Tr(n, e) {
  return !!(n && e && !n.isLeaf && pa(n, e));
}
function _t(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let o, a, s = r.index(i);
    if (i == r.depth ? (o = r.nodeBefore, a = r.nodeAfter) : t > 0 ? (o = r.node(i + 1), s++, a = r.node(i).maybeChild(s)) : (o = r.node(i).maybeChild(s - 1), a = r.node(i + 1)), o && !o.isTextblock && Tr(o, a) && r.node(i).canReplace(s, s + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function Kt(n, e, t = e, r = w.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), o = n.resolve(t);
  return ua(i, o, r) ? new P(e, t, r) : new ha(i, o, r).fit();
}
function ua(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class ha {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = x.empty;
    for (let i = 0; i <= e.depth; i++) {
      let o = e.node(i);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = x.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let o = this.placed, a = r.depth, s = i.depth;
    for (; a && s && o.childCount == 1; )
      o = o.firstChild.content, a--, s--;
    let l = new w(o, a, s);
    return e > -1 ? new H(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new P(r.pos, i.pos, l) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, i = this.unplaced.openEnd; r < e; r++) {
      let o = t.firstChild;
      if (t.childCount > 1 && (i = 0), o.type.spec.isolating && i <= r) {
        e = r;
        break;
      }
      t = o.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i, o = null;
        r ? (o = It(this.unplaced.content, r - 1).firstChild, i = o.content) : i = this.unplaced.content;
        let a = i.firstChild;
        for (let s = this.depth; s >= 0; s--) {
          let { type: l, match: c } = this.frontier[s], p, u = null;
          if (t == 1 && (a ? c.matchType(a.type) || (u = c.fillBefore(x.from(a), !1)) : o && l.compatibleContent(o.type)))
            return { sliceDepth: r, frontierDepth: s, parent: o, inject: u };
          if (t == 2 && a && (p = c.findWrapping(a.type)))
            return { sliceDepth: r, frontierDepth: s, parent: o, wrap: p };
          if (o && c.matchType(o.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = It(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new w(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = It(e, t);
    if (i.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + i.size;
      this.unplaced = new w(Ie(e, t - 1, 1), t - 1, o ? t - 1 : r);
    } else
      this.unplaced = new w(Ie(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: o }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (o)
      for (let g = 0; g < o.length; g++)
        this.openFrontierNode(o[g]);
    let a = this.unplaced, s = r ? r.content : a.content, l = a.openStart - e, c = 0, p = [], { match: u, type: h } = this.frontier[t];
    if (i) {
      for (let g = 0; g < i.childCount; g++)
        p.push(i.child(g));
      u = u.matchFragment(i);
    }
    let m = s.size + e - (a.content.size - a.openEnd);
    for (; c < s.childCount; ) {
      let g = s.child(c), y = u.matchType(g.type);
      if (!y)
        break;
      c++, (c > 1 || l == 0 || g.content.size) && (u = y, p.push(Or(g.mark(h.allowedMarks(g.marks)), c == 1 ? l : 0, c == s.childCount ? m : -1)));
    }
    let b = c == s.childCount;
    b || (m = -1), this.placed = Te(this.placed, t, x.from(p)), this.frontier[t].match = u, b && m < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let g = 0, y = s; g < m; g++) {
      let v = y.lastChild;
      this.frontier.push({ type: v.type, match: v.contentMatchAt(v.childCount) }), y = v.content;
    }
    this.unplaced = b ? e == 0 ? w.empty : new w(Ie(a.content, e - 1, 1), e - 1, m < 0 ? a.openEnd : e - 1) : new w(Ie(a.content, e, c), a.openStart, a.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Tt(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = Tt(e, t, i, r, o);
      if (a) {
        for (let s = t - 1; s >= 0; s--) {
          let { match: l, type: c } = this.frontier[s], p = Tt(e, s, c, l, !0);
          if (!p || p.childCount)
            continue e;
        }
        return { depth: t, fit: a, move: o ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = Te(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), o = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Te(this.placed, this.depth, x.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(x.empty, !0);
    t.childCount && (this.placed = Te(this.placed, this.frontier.length, t));
  }
}
function Ie(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Ie(n.firstChild.content, e - 1, t)));
}
function Te(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Te(n.lastChild.content, e - 1, t)));
}
function It(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Or(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Or(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(x.empty, !0)))), n.copy(r);
}
function Tt(n, e, t, r, i) {
  let o = n.node(e), a = i ? n.indexAfter(e) : n.index(e);
  if (a == o.childCount && !t.compatibleContent(o.type))
    return null;
  let s = r.fillBefore(o.content, !0, a);
  return s && !fa(t, o.content, a) ? s : null;
}
function fa(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
class Be extends L {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return I.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      r[o] = t.attrs[o];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return I.fromReplace(e, this.pos, this.pos + 1, new w(x.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return U.empty;
  }
  invert(e) {
    return new Be(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Be(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Be(t.pos, t.attr, t.value);
  }
}
L.jsonID("attr", Be);
class mt extends L {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return I.ok(r);
  }
  getMap() {
    return U.empty;
  }
  invert(e) {
    return new mt(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new mt(t.attr, t.value);
  }
}
L.jsonID("docAttr", mt);
let Ge = class extends Error {
};
Ge = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
Ge.prototype = Object.create(Error.prototype);
Ge.prototype.constructor = Ge;
Ge.prototype.name = "TransformError";
const Ot = /* @__PURE__ */ Object.create(null);
class _ {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new ma(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = w.empty) {
    let r = t.content.lastChild, i = null;
    for (let s = 0; s < t.openEnd; s++)
      i = r, r = r.lastChild;
    let o = e.steps.length, a = this.ranges;
    for (let s = 0; s < a.length; s++) {
      let { $from: l, $to: c } = a[s], p = e.mapping.slice(o);
      e.replaceRange(p.map(l.pos), p.map(c.pos), s ? w.empty : t), s == 0 && $n(e, o, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      let { $from: a, $to: s } = i[o], l = e.mapping.slice(r), c = l.map(a.pos), p = l.map(s.pos);
      o ? e.deleteRange(c, p) : (e.replaceRangeWith(c, p, t), $n(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent ? new E(e) : ke(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let o = e.depth - 1; o >= 0; o--) {
      let a = t < 0 ? ke(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, r) : ke(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, r);
      if (a)
        return a;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new V(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return ke(e, e, 0, 0, 1) || new V(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return ke(e, e, e.content.size, e.childCount, -1) || new V(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Ot[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in Ot)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Ot[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return E.between(this.$anchor, this.$head).getBookmark();
  }
}
_.prototype.visible = !0;
class ma {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let On = !1;
function Rn(n) {
  !On && !n.parent.inlineContent && (On = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class E extends _ {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Rn(e), Rn(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return _.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new E(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = w.empty) {
    if (super.replace(e, t), t == w.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof E && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Nt(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new E(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let o = _.findFrom(t, r, !0) || _.findFrom(t, -r, !0);
      if (o)
        t = o.$head;
      else
        return _.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (_.findFrom(e, -r, !0) || _.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new E(e, t);
  }
}
_.jsonID("text", E);
class Nt {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Nt(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return E.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class N extends _ {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), o = e.resolve(i);
    return r ? _.near(o) : new N(o);
  }
  content() {
    return new w(x.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof N && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Yt(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new N(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new N(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
N.prototype.visible = !1;
_.jsonID("node", N);
class Yt {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Nt(r, r) : new Yt(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && N.isSelectable(r) ? new N(t) : _.near(t);
  }
}
class V extends _ {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = w.empty) {
    if (t == w.empty) {
      e.delete(0, e.doc.content.size);
      let r = _.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new V(e);
  }
  map(e) {
    return new V(e);
  }
  eq(e) {
    return e instanceof V;
  }
  getBookmark() {
    return ga;
  }
}
_.jsonID("all", V);
const ga = {
  map() {
    return this;
  },
  resolve(n) {
    return new V(n);
  }
};
function ke(n, e, t, r, i, o = !1) {
  if (e.inlineContent)
    return E.create(n, t);
  for (let a = r - (i > 0 ? 0 : 1); i > 0 ? a < e.childCount : a >= 0; a += i) {
    let s = e.child(a);
    if (s.isAtom) {
      if (!o && N.isSelectable(s))
        return N.create(n, t - (i < 0 ? s.nodeSize : 0));
    } else {
      let l = ke(n, s, t + i, i < 0 ? s.childCount : 0, i, o);
      if (l)
        return l;
    }
    t += s.nodeSize * i;
  }
  return null;
}
function $n(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof P || i instanceof H))
    return;
  let o = n.mapping.maps[r], a;
  o.forEach((s, l, c, p) => {
    a == null && (a = p);
  }), n.setSelection(_.near(n.doc.resolve(a), t));
}
function Bn(n, e) {
  return !e || !n ? n : n.bind(e);
}
class rt {
  constructor(e, t, r) {
    this.name = e, this.init = Bn(t.init, r), this.apply = Bn(t.apply, r);
  }
}
new rt("doc", {
  init(n) {
    return n.doc || n.schema.topNodeType.createAndFill();
  },
  apply(n) {
    return n.doc;
  }
}), new rt("selection", {
  init(n, e) {
    return n.selection || _.atStart(e.doc);
  },
  apply(n) {
    return n.selection;
  }
}), new rt("storedMarks", {
  init(n) {
    return n.storedMarks || null;
  },
  apply(n, e, t, r) {
    return r.selection.$cursor ? n.storedMarks : null;
  }
}), new rt("scrollToSelection", {
  init() {
    return 0;
  },
  apply(n, e) {
    return n.scrolledIntoView ? e + 1 : e;
  }
});
function Rr(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Rr(i, e, {})), t[r] = i;
  }
  return t;
}
class ve {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Rr(e.props, this, this.props), this.key = e.key ? e.key.key : $r("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Rt = /* @__PURE__ */ Object.create(null);
function $r(n) {
  return n in Rt ? n + "$" + ++Rt[n] : (Rt[n] = 0, n + "$");
}
class we {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = $r(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Xt = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Br(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const zr = (n, e, t) => {
  let r = Br(n, t);
  if (!r)
    return !1;
  let i = Qt(r);
  if (!i) {
    let a = r.blockRange(), s = a && Ae(a);
    return s == null ? !1 : (e && e(n.tr.lift(a, s).scrollIntoView()), !0);
  }
  let o = i.nodeBefore;
  if (Jr(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (Ce(o, "end") || N.isSelectable(o)))
    for (let a = r.depth; ; a--) {
      let s = Kt(n.doc, r.before(a), r.after(a), w.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(Ce(o, "end") ? _.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : N.create(l.doc, i.pos - o.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (a == 1 || r.node(a - 1).childCount > 1)
        break;
    }
  return o.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - o.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, ba = (n, e, t) => {
  let r = Br(n, t);
  if (!r)
    return !1;
  let i = Qt(r);
  return i ? Lr(n, i, e) : !1;
}, ya = (n, e, t) => {
  let r = Pr(n, t);
  if (!r)
    return !1;
  let i = Zt(r);
  return i ? Lr(n, i, e) : !1;
};
function Lr(n, e, t) {
  let r = e.nodeBefore, i = r, o = e.pos - 1;
  for (; !i.isTextblock; o--) {
    if (i.type.spec.isolating)
      return !1;
    let p = i.lastChild;
    if (!p)
      return !1;
    i = p;
  }
  let a = e.nodeAfter, s = a, l = e.pos + 1;
  for (; !s.isTextblock; l++) {
    if (s.type.spec.isolating)
      return !1;
    let p = s.firstChild;
    if (!p)
      return !1;
    s = p;
  }
  let c = Kt(n.doc, o, l, w.empty);
  if (!c || c.from != o || c instanceof P && c.slice.size >= l - o)
    return !1;
  if (t) {
    let p = n.tr.step(c);
    p.setSelection(E.create(p.doc, o)), t(p.scrollIntoView());
  }
  return !0;
}
function Ce(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Fr = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, o = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    o = Qt(r);
  }
  let a = o && o.nodeBefore;
  return !a || !N.isSelectable(a) ? !1 : (e && e(n.tr.setSelection(N.create(n.doc, o.pos - a.nodeSize)).scrollIntoView()), !0);
};
function Qt(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Pr(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Dr = (n, e, t) => {
  let r = Pr(n, t);
  if (!r)
    return !1;
  let i = Zt(r);
  if (!i)
    return !1;
  let o = i.nodeAfter;
  if (Jr(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (Ce(o, "start") || N.isSelectable(o))) {
    let a = Kt(n.doc, r.before(), r.after(), w.empty);
    if (a && a.slice.size < a.to - a.from) {
      if (e) {
        let s = n.tr.step(a);
        s.setSelection(Ce(o, "start") ? _.findFrom(s.doc.resolve(s.mapping.map(i.pos)), 1) : N.create(s.doc, s.mapping.map(i.pos))), e(s.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, Hr = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, o = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    o = Zt(r);
  }
  let a = o && o.nodeAfter;
  return !a || !N.isSelectable(a) ? !1 : (e && e(n.tr.setSelection(N.create(n.doc, o.pos)).scrollIntoView()), !0);
};
function Zt(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const xa = (n, e) => {
  let t = n.selection, r = t instanceof N, i;
  if (r) {
    if (t.node.isTextblock || !xe(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = _t(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let o = n.tr.join(i);
    r && o.setSelection(N.create(o.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, va = (n, e) => {
  let t = n.selection, r;
  if (t instanceof N) {
    if (t.node.isTextblock || !xe(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = _t(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, wa = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), o = i && Ae(i);
  return o == null ? !1 : (e && e(n.tr.lift(i, o).scrollIntoView()), !0);
}, jr = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function en(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const ka = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), o = t.indexAfter(-1), a = en(i.contentMatchAt(o));
  if (!a || !i.canReplaceWith(o, o, a))
    return !1;
  if (e) {
    let s = t.after(), l = n.tr.replaceWith(s, s, a.createAndFill());
    l.setSelection(_.near(l.doc.resolve(s), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Ur = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof V || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let o = en(i.parent.contentMatchAt(i.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let a = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, s = n.tr.insert(a, o.createAndFill());
    s.setSelection(E.create(s.doc, a + 1)), e(s.scrollIntoView());
  }
  return !0;
}, Vr = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (Z(n.doc, o))
      return e && e(n.tr.split(o).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && Ae(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function _a(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof N && e.selection.node.isBlock)
      return !r.parentOffset || !Z(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let o = [], a, s, l = !1, c = !1;
    for (let m = r.depth; ; m--)
      if (r.node(m).isBlock) {
        l = r.end(m) == r.pos + (r.depth - m), c = r.start(m) == r.pos - (r.depth - m), s = en(r.node(m - 1).contentMatchAt(r.indexAfter(m - 1))), o.unshift(l && s ? { type: s } : null), a = m;
        break;
      } else {
        if (m == 1)
          return !1;
        o.unshift(null);
      }
    let p = e.tr;
    (e.selection instanceof E || e.selection instanceof V) && p.deleteSelection();
    let u = p.mapping.map(r.pos), h = Z(p.doc, u, o.length, o);
    if (h || (o[0] = s ? { type: s } : null, h = Z(p.doc, u, o.length, o)), !h)
      return !1;
    if (p.split(u, o.length, o), !l && c && r.node(a).type != s) {
      let m = p.mapping.map(r.before(a)), b = p.doc.resolve(m);
      s && r.node(a - 1).canReplaceWith(b.index(), b.index() + 1, s) && p.setNodeMarkup(p.mapping.map(r.before(a)), s);
    }
    return t && t(p.scrollIntoView()), !0;
  };
}
const Na = _a(), Ca = (n, e) => {
  let { $from: t, to: r } = n.selection, i, o = t.sharedDepth(r);
  return o == 0 ? !1 : (i = t.before(o), e && e(n.tr.setSelection(N.create(n.doc, i))), !0);
};
function Sa(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, o = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(o - 1, o) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(i.isTextblock || xe(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Jr(n, e, t, r) {
  let i = e.nodeBefore, o = e.nodeAfter, a, s, l = i.type.spec.isolating || o.type.spec.isolating;
  if (!l && Sa(n, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (a = (s = i.contentMatchAt(i.childCount)).findWrapping(o.type)) && s.matchType(a[0] || o.type).validEnd) {
    if (t) {
      let m = e.pos + o.nodeSize, b = x.empty;
      for (let v = a.length - 1; v >= 0; v--)
        b = x.from(a[v].create(null, b));
      b = x.from(i.copy(b));
      let g = n.tr.step(new H(e.pos - 1, m, e.pos, m, new w(b, 1, 0), a.length, !0)), y = g.doc.resolve(m + 2 * a.length);
      y.nodeAfter && y.nodeAfter.type == i.type && xe(g.doc, y.pos) && g.join(y.pos), t(g.scrollIntoView());
    }
    return !0;
  }
  let p = o.type.spec.isolating || r > 0 && l ? null : _.findFrom(e, 1), u = p && p.$from.blockRange(p.$to), h = u && Ae(u);
  if (h != null && h >= e.depth)
    return t && t(n.tr.lift(u, h).scrollIntoView()), !0;
  if (c && Ce(o, "start", !0) && Ce(i, "end")) {
    let m = i, b = [];
    for (; b.push(m), !m.isTextblock; )
      m = m.lastChild;
    let g = o, y = 1;
    for (; !g.isTextblock; g = g.firstChild)
      y++;
    if (m.canReplace(m.childCount, m.childCount, g.content)) {
      if (t) {
        let v = x.empty;
        for (let M = b.length - 1; M >= 0; M--)
          v = x.from(b[M].copy(v));
        let A = n.tr.step(new H(e.pos - b.length, e.pos + o.nodeSize, e.pos + y, e.pos + o.nodeSize - y, new w(v, b.length, 0), 0, !0));
        t(A.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function qr(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, o = i.depth;
    for (; i.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return i.node(o).isTextblock ? (t && t(e.tr.setSelection(E.create(e.doc, n < 0 ? i.start(o) : i.end(o)))), !0) : !1;
  };
}
const Ea = qr(-1), Aa = qr(1);
function Ma(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: o } = t.selection, a = i.blockRange(o), s = a && Ir(a, n, e);
    return s ? (r && r(t.tr.wrap(a, s).scrollIntoView()), !0) : !1;
  };
}
function zn(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let o = 0; o < t.selection.ranges.length && !i; o++) {
      let { $from: { pos: a }, $to: { pos: s } } = t.selection.ranges[o];
      t.doc.nodesBetween(a, s, (l, c) => {
        if (i)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(n, e)))
          if (l.type == n)
            i = !0;
          else {
            let p = t.doc.resolve(c), u = p.index();
            i = p.parent.canReplaceWith(u, u + 1, n);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let o = t.tr;
      for (let a = 0; a < t.selection.ranges.length; a++) {
        let { $from: { pos: s }, $to: { pos: l } } = t.selection.ranges[a];
        o.setBlockType(s, l, n, e);
      }
      r(o.scrollIntoView());
    }
    return !0;
  };
}
function tn(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
tn(Xt, zr, Fr);
tn(Xt, Dr, Hr);
tn(jr, Ur, Vr, Na);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Ia(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: o } = t.selection, a = i.blockRange(o);
    if (!a)
      return !1;
    let s = r ? t.tr : null;
    return Ta(s, a, n, e) ? (r && r(s.scrollIntoView()), !0) : !1;
  };
}
function Ta(n, e, t, r = null) {
  let i = !1, o = e, a = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = a.resolve(e.start - 2);
    o = new ut(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new ut(e.$from, a.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let s = Ir(o, t, r, e);
  return s ? (n && Oa(n, e, s, i, t), !0) : !1;
}
function Oa(n, e, t, r, i) {
  let o = x.empty;
  for (let p = t.length - 1; p >= 0; p--)
    o = x.from(t[p].type.create(t[p].attrs, o));
  n.step(new H(e.start - (r ? 2 : 0), e.end, e.start, e.end, new w(o, 0, 0), t.length, !0));
  let a = 0;
  for (let p = 0; p < t.length; p++)
    t[p].type == i && (a = p + 1);
  let s = t.length - a, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let p = e.startIndex, u = e.endIndex, h = !0; p < u; p++, h = !1)
    !h && Z(n.doc, l, s) && (n.split(l, s), l += 2 * s), l += c.child(p).nodeSize;
  return n;
}
function Ra(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, o = r.blockRange(i, (a) => a.childCount > 0 && a.firstChild.type == n);
    return o ? t ? r.node(o.depth - 1).type == n ? $a(e, t, n, o) : Ba(e, t, o) : !0 : !1;
  };
}
function $a(n, e, t, r) {
  let i = n.tr, o = r.end, a = r.$to.end(r.depth);
  o < a && (i.step(new H(o - 1, a, o, a, new w(x.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new ut(i.doc.resolve(r.$from.pos), i.doc.resolve(a), r.depth));
  const s = Ae(r);
  if (s == null)
    return !1;
  i.lift(r, s);
  let l = i.doc.resolve(i.mapping.map(o, -1) - 1);
  return xe(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function Ba(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let m = t.end, b = t.endIndex - 1, g = t.startIndex; b > g; b--)
    m -= i.child(b).nodeSize, r.delete(m - 1, m + 1);
  let o = r.doc.resolve(t.start), a = o.nodeAfter;
  if (r.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let s = t.startIndex == 0, l = t.endIndex == i.childCount, c = o.node(-1), p = o.index(-1);
  if (!c.canReplace(p + (s ? 0 : 1), p + 1, a.content.append(l ? x.empty : x.from(i))))
    return !1;
  let u = o.pos, h = u + a.nodeSize;
  return r.step(new H(u - (s ? 1 : 0), h + (l ? 1 : 0), u + 1, h - 1, new w((s ? x.empty : x.from(i.copy(x.empty))).append(l ? x.empty : x.from(i.copy(x.empty))), s ? 0 : 1, l ? 0 : 1), s ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function za(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, o = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!o)
      return !1;
    let a = o.startIndex;
    if (a == 0)
      return !1;
    let s = o.parent, l = s.child(a - 1);
    if (l.type != n)
      return !1;
    if (t) {
      let c = l.lastChild && l.lastChild.type == s.type, p = x.from(c ? n.create() : null), u = new w(x.from(n.create(null, x.from(s.type.create(null, p)))), c ? 3 : 1, 0), h = o.start, m = o.end;
      t(e.tr.step(new H(h - (c ? 3 : 1), m, h, m, u, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Wr(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: o } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return o;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, o = t.storedMarks, t;
    }
  };
}
class La {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: r } = this, { view: i } = t, { tr: o } = r, a = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([s, l]) => [s, (...p) => {
      const u = l(...p)(a);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(o), u;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: a } = i, s = [], l = !!e, c = e || o.tr, p = () => (!l && t && !c.getMeta("preventDispatch") && !this.hasCustomState && a.dispatch(c), s.every((h) => h === !0)), u = {
      ...Object.fromEntries(Object.entries(r).map(([h, m]) => [h, (...g) => {
        const y = this.buildProps(c, t), v = m(...g)(y);
        return s.push(v), u;
      }])),
      run: p
    };
    return u;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, i = !1, o = e || r.tr, a = this.buildProps(o, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([l, c]) => [l, (...p) => c(...p)({ ...a, dispatch: void 0 })])),
      chain: () => this.createChain(o, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: a } = i, s = {
      tr: e,
      editor: i,
      view: a,
      state: Wr({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([l, c]) => [l, (...p) => c(...p)(s)]));
      }
    };
    return s;
  }
}
function W(n, e, t) {
  return n.config[e] === void 0 && n.parent ? W(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? W(n.parent, e, t) : null
  }) : n.config[e];
}
function Fa(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function B(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function Gr(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, o]) => {
      if (!r[i]) {
        r[i] = o;
        return;
      }
      if (i === "class") {
        const s = o ? String(o).split(" ") : [], l = r[i] ? r[i].split(" ") : [], c = s.filter((p) => !l.includes(p));
        r[i] = [...l, ...c].join(" ");
      } else if (i === "style") {
        const s = o ? o.split(";").map((p) => p.trim()).filter(Boolean) : [], l = r[i] ? r[i].split(";").map((p) => p.trim()).filter(Boolean) : [], c = /* @__PURE__ */ new Map();
        l.forEach((p) => {
          const [u, h] = p.split(":").map((m) => m.trim());
          c.set(u, h);
        }), s.forEach((p) => {
          const [u, h] = p.split(":").map((m) => m.trim());
          c.set(u, h);
        }), r[i] = Array.from(c.entries()).map(([p, u]) => `${p}: ${u}`).join("; ");
      } else
        r[i] = o;
    }), r;
  }, {});
}
function Pa(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => Gr(t, r), {});
}
function Da(n) {
  return typeof n == "function";
}
function Q(n, e = void 0, ...t) {
  return Da(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Ha(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function ja(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function it(n) {
  return ja(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function nn(n, e) {
  const t = { ...n };
  return it(n) && it(e) && Object.keys(e).forEach((r) => {
    it(e[r]) && it(n[r]) ? t[r] = nn(n[r], e[r]) : t[r] = e[r];
  }), t;
}
class G {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Q(W(this, "addOptions", {
      name: this.name
    }))), this.storage = Q(W(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new G(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => nn(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new G({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = Q(W(t, "addOptions", {
      name: t.name
    })), t.storage = Q(W(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Ua(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: o = `

`, textSerializers: a = {} } = t || {};
  let s = "";
  return n.nodesBetween(r, i, (l, c, p, u) => {
    var h;
    l.isBlock && c > r && (s += o);
    const m = a == null ? void 0 : a[l.type.name];
    if (m)
      return p && (s += m({
        node: l,
        pos: c,
        parent: p,
        index: u,
        range: e
      })), !1;
    l.isText && (s += (h = l == null ? void 0 : l.text) === null || h === void 0 ? void 0 : h.slice(Math.max(r, c) - c, i - c));
  }), s;
}
function Va(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
G.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new ve({
        key: new we("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: o } = i, a = Math.min(...o.map((p) => p.$from.pos)), s = Math.max(...o.map((p) => p.$to.pos)), l = Va(t);
            return Ua(r, { from: a, to: s }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
});
const Ja = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), qa = (n = !1) => ({ commands: e }) => e.setContent("", n), Wa = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: o, $to: a }) => {
    n.doc.nodesBetween(o.pos, a.pos, (s, l) => {
      if (s.type.isText)
        return;
      const { doc: c, mapping: p } = e, u = c.resolve(p.map(l)), h = c.resolve(p.map(l + s.nodeSize)), m = u.blockRange(h);
      if (!m)
        return;
      const b = Ae(m);
      if (s.type.isTextblock) {
        const { defaultType: g } = u.parent.contentMatchAt(u.index());
        e.setNodeMarkup(m.start, g);
      }
      (b || b === 0) && e.lift(m, b);
    });
  }), !0;
}, Ga = (n) => (e) => n(e), Ka = () => ({ state: n, dispatch: e }) => Ur(n, e), Ya = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, o = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const a = r.mapping.map(e);
  return r.insert(a, o.content), r.setSelection(new E(r.doc.resolve(Math.max(a - 1, 0)))), !0;
}, Xa = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === r.type) {
      if (e) {
        const s = i.before(o), l = i.after(o);
        n.delete(s, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Qa = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = B(n, t.schema), o = e.selection.$anchor;
  for (let a = o.depth; a > 0; a -= 1)
    if (o.node(a).type === i) {
      if (r) {
        const l = o.before(a), c = o.after(a);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Za = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, es = () => ({ state: n, dispatch: e }) => Xt(n, e), ts = () => ({ commands: n }) => n.keyboardShortcut("Enter"), ns = () => ({ state: n, dispatch: e }) => ka(n, e);
function gt(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : Ha(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function Kr(n, e, t = {}) {
  return n.find((r) => r.type === e && gt(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Ln(n, e, t = {}) {
  return !!Kr(n, e, t);
}
function Yr(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((p) => p.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((p) => p.type === e) || (t = t || ((r = i.node.marks[0]) === null || r === void 0 ? void 0 : r.attrs), !Kr([...i.node.marks], e, t)))
    return;
  let a = i.index, s = n.start() + i.offset, l = a + 1, c = s + i.node.nodeSize;
  for (; a > 0 && Ln([...n.parent.child(a - 1).marks], e, t); )
    a -= 1, s -= n.parent.child(a).nodeSize;
  for (; l < n.parent.childCount && Ln([...n.parent.child(l).marks], e, t); )
    c += n.parent.child(l).nodeSize, l += 1;
  return {
    from: s,
    to: c
  };
}
function le(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const rs = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const o = le(n, r.schema), { doc: a, selection: s } = t, { $from: l, from: c, to: p } = s;
  if (i) {
    const u = Yr(l, o, e);
    if (u && u.from <= c && u.to >= p) {
      const h = E.create(a, u.from, u.to);
      t.setSelection(h);
    }
  }
  return !0;
}, is = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Xr(n) {
  return n instanceof E;
}
function ue(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function as(n, e = null) {
  if (!e)
    return null;
  const t = _.atStart(n), r = _.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, o = r.to;
  return e === "all" ? E.create(n, ue(0, i, o), ue(n.content.size, i, o)) : E.create(n, ue(e, i, o), ue(e, i, o));
}
function Ut() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Ke() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function ss() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
const ls = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const a = () => {
    (Ke() || Ut()) && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), ss() && !Ke() && !Ut() && r.dom.focus({ preventScroll: !0 }));
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (o && n === null && !Xr(t.state.selection))
    return a(), !0;
  const s = as(i.doc, n) || t.state.selection, l = t.state.selection.eq(s);
  return o && (l || i.setSelection(s), l && i.storedMarks && i.setStoredMarks(i.storedMarks), a()), !0;
}, cs = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), ds = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Qr = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Qr(r);
  }
  return n;
};
function ot(n) {
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Qr(t);
}
function Ye(n, e, t) {
  if (n instanceof ge || n instanceof x)
    return n;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const r = typeof n == "object" && n !== null, i = typeof n == "string";
  if (r)
    try {
      if (Array.isArray(n) && n.length > 0)
        return x.fromArray(n.map((s) => e.nodeFromJSON(s)));
      const a = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && a.check(), a;
    } catch (o) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: o });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", o), Ye("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let a = !1, s = "";
      const l = new ea({
        topNode: e.spec.topNode,
        marks: e.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: e.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (c) => (a = !0, s = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? _e.fromSchema(l).parseSlice(ot(n), t.parseOptions) : _e.fromSchema(l).parse(ot(n), t.parseOptions), t.errorOnInvalidContent && a)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${s}`) });
    }
    const o = _e.fromSchema(e);
    return t.slice ? o.parseSlice(ot(n), t.parseOptions).content : o.parse(ot(n), t.parseOptions);
  }
  return Ye("", e, t);
}
function ps(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof P || i instanceof H))
    return;
  const o = n.mapping.maps[r];
  let a = 0;
  o.forEach((s, l, c, p) => {
    a === 0 && (a = p);
  }), n.setSelection(_.near(n.doc.resolve(a), t));
}
const us = (n) => !("type" in n), hs = (n, e, t) => ({ tr: r, dispatch: i, editor: o }) => {
  var a;
  if (i) {
    t = {
      parseOptions: o.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let s;
    const l = (y) => {
      o.emit("contentError", {
        editor: o,
        error: y,
        disableCollaboration: () => {
          o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
        }
      });
    }, c = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError)
      try {
        Ye(e, o.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (y) {
        l(y);
      }
    try {
      s = Ye(e, o.schema, {
        parseOptions: c,
        errorOnInvalidContent: (a = t.errorOnInvalidContent) !== null && a !== void 0 ? a : o.options.enableContentCheck
      });
    } catch (y) {
      return l(y), !1;
    }
    let { from: p, to: u } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, h = !0, m = !0;
    if ((us(s) ? s : [s]).forEach((y) => {
      y.check(), h = h ? y.isText && y.marks.length === 0 : !1, m = m ? y.isBlock : !1;
    }), p === u && m) {
      const { parent: y } = r.doc.resolve(p);
      y.isTextblock && !y.type.spec.code && !y.childCount && (p -= 1, u += 1);
    }
    let g;
    if (h) {
      if (Array.isArray(e))
        g = e.map((y) => y.text || "").join("");
      else if (e instanceof x) {
        let y = "";
        e.forEach((v) => {
          v.text && (y += v.text);
        }), g = y;
      } else typeof e == "object" && e && e.text ? g = e.text : g = e;
      r.insertText(g, p, u);
    } else
      g = s, r.replaceWith(p, u, g);
    t.updateSelection && ps(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: p, text: g }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: p, text: g });
  }
  return !0;
}, fs = () => ({ state: n, dispatch: e }) => xa(n, e), ms = () => ({ state: n, dispatch: e }) => va(n, e), gs = () => ({ state: n, dispatch: e }) => zr(n, e), bs = () => ({ state: n, dispatch: e }) => Dr(n, e), ys = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = _t(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, xs = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = _t(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, vs = () => ({ state: n, dispatch: e }) => ba(n, e), ws = () => ({ state: n, dispatch: e }) => ya(n, e);
function Zr() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function ks(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, o, a;
  for (let s = 0; s < e.length - 1; s += 1) {
    const l = e[s];
    if (/^(cmd|meta|m)$/i.test(l))
      a = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      o = !0;
    else if (/^mod$/i.test(l))
      Ke() || Zr() ? a = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), a && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const _s = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const o = ks(n).split(/-(?!$)/), a = o.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), s = new KeyboardEvent("keydown", {
    key: a === "Space" ? " " : a,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, s));
  });
  return l == null || l.steps.forEach((c) => {
    const p = c.map(r.mapping);
    p && i && r.maybeStep(p);
  }), !0;
};
function rn(n, e, t = {}) {
  const { from: r, to: i, empty: o } = n.selection, a = e ? B(e, n.schema) : null, s = [];
  n.doc.nodesBetween(r, i, (u, h) => {
    if (u.isText)
      return;
    const m = Math.max(r, h), b = Math.min(i, h + u.nodeSize);
    s.push({
      node: u,
      from: m,
      to: b
    });
  });
  const l = i - r, c = s.filter((u) => a ? a.name === u.node.type.name : !0).filter((u) => gt(u.node.attrs, t, { strict: !1 }));
  return o ? !!c.length : c.reduce((u, h) => u + h.to - h.from, 0) >= l;
}
const Ns = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = B(n, t.schema);
  return rn(t, i, e) ? wa(t, r) : !1;
}, Cs = () => ({ state: n, dispatch: e }) => Vr(n, e), Ss = (n) => ({ state: e, dispatch: t }) => {
  const r = B(n, e.schema);
  return Ra(r)(e, t);
}, Es = () => ({ state: n, dispatch: e }) => jr(n, e);
function ei(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Fn(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
const As = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, a = null;
  const s = ei(typeof n == "string" ? n : n.name, r.schema);
  return s ? (s === "node" && (o = B(n, r.schema)), s === "mark" && (a = le(n, r.schema)), i && t.selection.ranges.forEach((l) => {
    r.doc.nodesBetween(l.$from.pos, l.$to.pos, (c, p) => {
      o && o === c.type && t.setNodeMarkup(p, void 0, Fn(c.attrs, e)), a && c.marks.length && c.marks.forEach((u) => {
        a === u.type && t.addMark(p, p + c.nodeSize, a.create(Fn(u.attrs, e)));
      });
    });
  }), !0) : !1;
}, Ms = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), Is = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new V(n.doc);
    n.setSelection(t);
  }
  return !0;
}, Ts = () => ({ state: n, dispatch: e }) => Fr(n, e), Os = () => ({ state: n, dispatch: e }) => Hr(n, e), Rs = () => ({ state: n, dispatch: e }) => Ca(n, e), $s = () => ({ state: n, dispatch: e }) => Aa(n, e), Bs = () => ({ state: n, dispatch: e }) => Ea(n, e);
function zs(n, e, t = {}, r = {}) {
  return Ye(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
const Ls = (n, e = !1, t = {}, r = {}) => ({ editor: i, tr: o, dispatch: a, commands: s }) => {
  var l, c;
  const { doc: p } = o;
  if (t.preserveWhitespace !== "full") {
    const u = zs(n, i.schema, t, {
      errorOnInvalidContent: (l = r.errorOnInvalidContent) !== null && l !== void 0 ? l : i.options.enableContentCheck
    });
    return a && o.replaceWith(0, p.content.size, u).setMeta("preventUpdate", !e), !0;
  }
  return a && o.setMeta("preventUpdate", !e), s.insertContentAt({ from: 0, to: p.content.size }, n, {
    parseOptions: t,
    errorOnInvalidContent: (c = r.errorOnInvalidContent) !== null && c !== void 0 ? c : i.options.enableContentCheck
  });
};
function Fs(n, e) {
  const t = le(e, n.schema), { from: r, to: i, empty: o } = n.selection, a = [];
  o ? (n.storedMarks && a.push(...n.storedMarks), a.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    a.push(...l.marks);
  });
  const s = a.find((l) => l.type.name === t.name);
  return s ? { ...s.attrs } : {};
}
function Ps(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function Ds(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function on(n) {
  return (e) => Ds(e.$from, n);
}
function st(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const i = n.find((o) => o.type === e && o.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function Hs(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, o = e ? le(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((u) => o ? o.name === u.type.name : !0).find((u) => gt(u.attrs, t, { strict: !1 }));
  let a = 0;
  const s = [];
  if (i.forEach(({ $from: u, $to: h }) => {
    const m = u.pos, b = h.pos;
    n.doc.nodesBetween(m, b, (g, y) => {
      if (!g.isText && !g.marks.length)
        return;
      const v = Math.max(m, y), A = Math.min(b, y + g.nodeSize), M = A - v;
      a += M, s.push(...g.marks.map(($) => ({
        mark: $,
        from: v,
        to: A
      })));
    });
  }), a === 0)
    return !1;
  const l = s.filter((u) => o ? o.name === u.mark.type.name : !0).filter((u) => gt(u.mark.attrs, t, { strict: !1 })).reduce((u, h) => u + h.to - h.from, 0), c = s.filter((u) => o ? u.mark.type !== o && u.mark.type.excludes(o) : !0).reduce((u, h) => u + h.to - h.from, 0);
  return (l > 0 ? l + c : l) >= a;
}
function Pn(n, e) {
  const { nodeExtensions: t } = Fa(e), r = t.find((a) => a.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, o = Q(W(r, "group", i));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function ti(n, { checkChildren: e = !0, ignoreWhitespace: t = !1 } = {}) {
  var r;
  if (t) {
    if (n.type.name === "hardBreak")
      return !0;
    if (n.isText)
      return /^\s*$/m.test((r = n.text) !== null && r !== void 0 ? r : "");
  }
  if (n.isText)
    return !n.text;
  if (n.isAtom || n.isLeaf)
    return !1;
  if (n.content.childCount === 0)
    return !0;
  if (e) {
    let i = !0;
    return n.content.forEach((o) => {
      i !== !1 && (ti(o, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
function js(n, e, t) {
  var r;
  const { selection: i } = e;
  let o = null;
  if (Xr(i) && (o = i.$cursor), o) {
    const s = (r = n.storedMarks) !== null && r !== void 0 ? r : o.marks();
    return !!t.isInSet(s) || !s.some((l) => l.type.excludes(t));
  }
  const { ranges: a } = i;
  return a.some(({ $from: s, $to: l }) => {
    let c = s.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(s.pos, l.pos, (p, u, h) => {
      if (c)
        return !1;
      if (p.isInline) {
        const m = !h || h.type.allowsMarkType(t), b = !!t.isInSet(p.marks) || !p.marks.some((g) => g.type.excludes(t));
        c = m && b;
      }
      return !c;
    }), c;
  });
}
const Us = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: o } = t, { empty: a, ranges: s } = o, l = le(n, r.schema);
  if (i)
    if (a) {
      const c = Fs(r, l);
      t.addStoredMark(l.create({
        ...c,
        ...e
      }));
    } else
      s.forEach((c) => {
        const p = c.$from.pos, u = c.$to.pos;
        r.doc.nodesBetween(p, u, (h, m) => {
          const b = Math.max(m, p), g = Math.min(m + h.nodeSize, u);
          h.marks.find((v) => v.type === l) ? h.marks.forEach((v) => {
            l === v.type && t.addMark(b, g, l.create({
              ...v.attrs,
              ...e
            }));
          }) : t.addMark(b, g, l.create(e));
        });
      });
  return js(r, t, l);
}, Vs = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), Js = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const o = B(n, t.schema);
  let a;
  return t.selection.$anchor.sameParent(t.selection.$head) && (a = t.selection.$anchor.parent.attrs), o.isTextblock ? i().command(({ commands: s }) => zn(o, { ...a, ...e })(t) ? !0 : s.clearNodes()).command(({ state: s }) => zn(o, { ...a, ...e })(s, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, qs = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = ue(n, 0, r.content.size), o = N.create(r, i);
    e.setSelection(o);
  }
  return !0;
}, Ws = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: o } = typeof n == "number" ? { from: n, to: n } : n, a = E.atStart(r).from, s = E.atEnd(r).to, l = ue(i, a, s), c = ue(o, a, s), p = E.create(r, l, c);
    e.setSelection(p);
  }
  return !0;
}, Gs = (n) => ({ state: e, dispatch: t }) => {
  const r = B(n, e.schema);
  return za(r)(e, t);
};
function Dn(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
const Ks = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: o, doc: a } = e, { $from: s, $to: l } = o, c = i.extensionManager.attributes, p = st(c, s.node().type.name, s.node().attrs);
  if (o instanceof N && o.node.isBlock)
    return !s.parentOffset || !Z(a, s.pos) ? !1 : (r && (n && Dn(t, i.extensionManager.splittableMarks), e.split(s.pos).scrollIntoView()), !0);
  if (!s.parent.isBlock)
    return !1;
  const u = l.parentOffset === l.parent.content.size, h = s.depth === 0 ? void 0 : Ps(s.node(-1).contentMatchAt(s.indexAfter(-1)));
  let m = u && h ? [
    {
      type: h,
      attrs: p
    }
  ] : void 0, b = Z(e.doc, e.mapping.map(s.pos), 1, m);
  if (!m && !b && Z(e.doc, e.mapping.map(s.pos), 1, h ? [{ type: h }] : void 0) && (b = !0, m = h ? [
    {
      type: h,
      attrs: p
    }
  ] : void 0), r) {
    if (b && (o instanceof E && e.deleteSelection(), e.split(e.mapping.map(s.pos), 1, m), h && !u && !s.parentOffset && s.parent.type !== h)) {
      const g = e.mapping.map(s.before()), y = e.doc.resolve(g);
      s.node(-1).canReplaceWith(y.index(), y.index() + 1, h) && e.setNodeMarkup(e.mapping.map(s.before()), h);
    }
    n && Dn(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return b;
}, Ys = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: o }) => {
  var a;
  const s = B(n, r.schema), { $from: l, $to: c } = r.selection, p = r.selection.node;
  if (p && p.isBlock || l.depth < 2 || !l.sameParent(c))
    return !1;
  const u = l.node(-1);
  if (u.type !== s)
    return !1;
  const h = o.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== s || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (i) {
      let v = x.empty;
      const A = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let J = l.depth - A; J >= l.depth - 3; J -= 1)
        v = x.from(l.node(J).copy(v));
      const M = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, $ = {
        ...st(h, l.node().type.name, l.node().attrs),
        ...e
      }, F = ((a = s.contentMatch.defaultType) === null || a === void 0 ? void 0 : a.createAndFill($)) || void 0;
      v = v.append(x.from(s.createAndFill(null, F) || void 0));
      const T = l.before(l.depth - (A - 1));
      t.replace(T, l.after(-M), new w(v, 4 - A, 0));
      let j = -1;
      t.doc.nodesBetween(T, t.doc.content.size, (J, oi) => {
        if (j > -1)
          return !1;
        J.isTextblock && J.content.size === 0 && (j = oi + 1);
      }), j > -1 && t.setSelection(E.near(t.doc.resolve(j))), t.scrollIntoView();
    }
    return !0;
  }
  const m = c.pos === l.end() ? u.contentMatchAt(0).defaultType : null, b = {
    ...st(h, u.type.name, u.attrs),
    ...e
  }, g = {
    ...st(h, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const y = m ? [
    { type: s, attrs: b },
    { type: m, attrs: g }
  ] : [{ type: s, attrs: b }];
  if (!Z(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: v, storedMarks: A } = r, { splittableMarks: M } = o.extensionManager, $ = A || v.$to.parentOffset && v.$from.marks();
    if (t.split(l.pos, 2, y).scrollIntoView(), !$ || !i)
      return !0;
    const F = $.filter((T) => M.includes(T.type.name));
    t.ensureMarks(F);
  }
  return !0;
}, $t = (n, e) => {
  const t = on((a) => a.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && xe(n.doc, t.pos) && n.join(t.pos), !0;
}, Bt = (n, e) => {
  const t = on((a) => a.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && xe(n.doc, r) && n.join(r), !0;
}, Xs = (n, e, t, r = {}) => ({ editor: i, tr: o, state: a, dispatch: s, chain: l, commands: c, can: p }) => {
  const { extensions: u, splittableMarks: h } = i.extensionManager, m = B(n, a.schema), b = B(e, a.schema), { selection: g, storedMarks: y } = a, { $from: v, $to: A } = g, M = v.blockRange(A), $ = y || g.$to.parentOffset && g.$from.marks();
  if (!M)
    return !1;
  const F = on((T) => Pn(T.type.name, u))(g);
  if (M.depth >= 1 && F && M.depth - F.depth <= 1) {
    if (F.node.type === m)
      return c.liftListItem(b);
    if (Pn(F.node.type.name, u) && m.validContent(F.node.content) && s)
      return l().command(() => (o.setNodeMarkup(F.pos, m), !0)).command(() => $t(o, m)).command(() => Bt(o, m)).run();
  }
  return !t || !$ || !s ? l().command(() => p().wrapInList(m, r) ? !0 : c.clearNodes()).wrapInList(m, r).command(() => $t(o, m)).command(() => Bt(o, m)).run() : l().command(() => {
    const T = p().wrapInList(m, r), j = $.filter((J) => h.includes(J.type.name));
    return o.ensureMarks(j), T ? !0 : c.clearNodes();
  }).wrapInList(m, r).command(() => $t(o, m)).command(() => Bt(o, m)).run();
}, Qs = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: o = !1 } = t, a = le(n, r.schema);
  return Hs(r, a, e) ? i.unsetMark(a, { extendEmptyMarkRange: o }) : i.setMark(a, e);
}, Zs = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const o = B(n, r.schema), a = B(e, r.schema), s = rn(r, o, t);
  let l;
  return r.selection.$anchor.sameParent(r.selection.$head) && (l = r.selection.$anchor.parent.attrs), s ? i.setNode(a, l) : i.setNode(o, { ...l, ...t });
}, el = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = B(n, t.schema);
  return rn(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, tl = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let o;
    if (i.spec.isInputRules && (o = i.getState(n))) {
      if (e) {
        const a = n.tr, s = o.transform;
        for (let l = s.steps.length - 1; l >= 0; l -= 1)
          a.step(s.steps[l].invert(s.docs[l]));
        if (o.text) {
          const l = a.doc.resolve(o.from).marks();
          a.replaceWith(o.from, o.to, n.schema.text(o.text, l));
        } else
          a.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, nl = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((o) => {
    n.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, rl = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var o;
  const { extendEmptyMarkRange: a = !1 } = e, { selection: s } = t, l = le(n, r.schema), { $from: c, empty: p, ranges: u } = s;
  if (!i)
    return !0;
  if (p && a) {
    let { from: h, to: m } = s;
    const b = (o = c.marks().find((y) => y.type === l)) === null || o === void 0 ? void 0 : o.attrs, g = Yr(c, l, b);
    g && (h = g.from, m = g.to), t.removeMark(h, m, l);
  } else
    u.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, il = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, a = null;
  const s = ei(typeof n == "string" ? n : n.name, r.schema);
  return s ? (s === "node" && (o = B(n, r.schema)), s === "mark" && (a = le(n, r.schema)), i && t.selection.ranges.forEach((l) => {
    const c = l.$from.pos, p = l.$to.pos;
    let u, h, m, b;
    t.selection.empty ? r.doc.nodesBetween(c, p, (g, y) => {
      o && o === g.type && (m = Math.max(y, c), b = Math.min(y + g.nodeSize, p), u = y, h = g);
    }) : r.doc.nodesBetween(c, p, (g, y) => {
      y < c && o && o === g.type && (m = Math.max(y, c), b = Math.min(y + g.nodeSize, p), u = y, h = g), y >= c && y <= p && (o && o === g.type && t.setNodeMarkup(y, void 0, {
        ...g.attrs,
        ...e
      }), a && g.marks.length && g.marks.forEach((v) => {
        if (a === v.type) {
          const A = Math.max(y, c), M = Math.min(y + g.nodeSize, p);
          t.addMark(A, M, a.create({
            ...v.attrs,
            ...e
          }));
        }
      }));
    }), h && (u !== void 0 && t.setNodeMarkup(u, void 0, {
      ...h.attrs,
      ...e
    }), a && h.marks.length && h.marks.forEach((g) => {
      a === g.type && t.addMark(m, b, a.create({
        ...g.attrs,
        ...e
      }));
    }));
  }), !0) : !1;
}, ol = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = B(n, t.schema);
  return Ma(i, e)(t, r);
}, al = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = B(n, t.schema);
  return Ia(i, e)(t, r);
};
var sl = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Ja,
  clearContent: qa,
  clearNodes: Wa,
  command: Ga,
  createParagraphNear: Ka,
  cut: Ya,
  deleteCurrentNode: Xa,
  deleteNode: Qa,
  deleteRange: Za,
  deleteSelection: es,
  enter: ts,
  exitCode: ns,
  extendMarkRange: rs,
  first: is,
  focus: ls,
  forEach: cs,
  insertContent: ds,
  insertContentAt: hs,
  joinBackward: gs,
  joinDown: ms,
  joinForward: bs,
  joinItemBackward: ys,
  joinItemForward: xs,
  joinTextblockBackward: vs,
  joinTextblockForward: ws,
  joinUp: fs,
  keyboardShortcut: _s,
  lift: Ns,
  liftEmptyBlock: Cs,
  liftListItem: Ss,
  newlineInCode: Es,
  resetAttributes: As,
  scrollIntoView: Ms,
  selectAll: Is,
  selectNodeBackward: Ts,
  selectNodeForward: Os,
  selectParentNode: Rs,
  selectTextblockEnd: $s,
  selectTextblockStart: Bs,
  setContent: Ls,
  setMark: Us,
  setMeta: Vs,
  setNode: Js,
  setNodeSelection: qs,
  setTextSelection: Ws,
  sinkListItem: Gs,
  splitBlock: Ks,
  splitListItem: Ys,
  toggleList: Xs,
  toggleMark: Qs,
  toggleNode: Zs,
  toggleWrap: el,
  undoInputRule: tl,
  unsetAllMarks: nl,
  unsetMark: rl,
  updateAttributes: il,
  wrapIn: ol,
  wrapInList: al
});
G.create({
  name: "commands",
  addCommands() {
    return {
      ...sl
    };
  }
});
G.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new ve({
        key: new we("tiptapDrop"),
        props: {
          handleDrop: (n, e, t, r) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: e,
              slice: t,
              moved: r
            });
          }
        }
      })
    ];
  }
});
G.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new ve({
        key: new we("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const ll = new we("focusEvents");
G.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new ve({
        key: ll,
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
});
G.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: a }) => [
      () => a.undoInputRule(),
      // maybe convert first text block node to default node
      () => a.command(({ tr: s }) => {
        const { selection: l, doc: c } = s, { empty: p, $anchor: u } = l, { pos: h, parent: m } = u, b = u.parent.isTextblock && h > 0 ? s.doc.resolve(h - 1) : u, g = b.parent.type.spec.isolating, y = u.pos - u.parentOffset, v = g && b.parent.childCount === 1 ? y === u.pos : _.atStart(c).from === h;
        return !p || !m.type.isTextblock || m.textContent.length || !v || v && u.parent.type.name === "paragraph" ? !1 : a.clearNodes();
      }),
      () => a.deleteSelection(),
      () => a.joinBackward(),
      () => a.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: a }) => [
      () => a.deleteSelection(),
      () => a.deleteCurrentNode(),
      () => a.joinForward(),
      () => a.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: a }) => [
        () => a.newlineInCode(),
        () => a.createParagraphNear(),
        () => a.liftEmptyBlock(),
        () => a.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...r
    }, o = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Ke() || Zr() ? o : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new ve({
        key: new we("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((g) => g.getMeta("composition")))
            return;
          const r = n.some((g) => g.docChanged) && !e.doc.eq(t.doc), i = n.some((g) => g.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: o, from: a, to: s } = e.selection, l = _.atStart(e.doc).from, c = _.atEnd(e.doc).to;
          if (o || !(a === l && s === c) || !ti(t.doc))
            return;
          const h = t.tr, m = Wr({
            state: t,
            transaction: h
          }), { commands: b } = new La({
            editor: this.editor,
            state: m
          });
          if (b.clearNodes(), !!h.steps.length)
            return h;
        }
      })
    ];
  }
});
G.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new ve({
        key: new we("tiptapPaste"),
        props: {
          handlePaste: (n, e, t) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: e,
              slice: t
            });
          }
        }
      })
    ];
  }
});
G.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new ve({
        key: new we("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class bt {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Q(W(this, "addOptions", {
      name: this.name
    }))), this.storage = Q(W(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new bt(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => nn(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new bt(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = Q(W(t, "addOptions", {
      name: t.name
    })), t.storage = Q(W(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
let cl = class {
  constructor(e, t, r) {
    this.isDragging = !1, this.component = e, this.editor = t.editor, this.options = {
      stopEvent: null,
      ignoreMutation: null,
      ...r
    }, this.extension = t.extension, this.node = t.node, this.decorations = t.decorations, this.innerDecorations = t.innerDecorations, this.view = t.view, this.HTMLAttributes = t.HTMLAttributes, this.getPos = t.getPos, this.mount();
  }
  mount() {
  }
  get dom() {
    return this.editor.view.dom;
  }
  get contentDOM() {
    return null;
  }
  onDragStart(e) {
    var t, r, i, o, a, s, l;
    const { view: c } = this.editor, p = e.target, u = p.nodeType === 3 ? (t = p.parentElement) === null || t === void 0 ? void 0 : t.closest("[data-drag-handle]") : p.closest("[data-drag-handle]");
    if (!this.dom || !((r = this.contentDOM) === null || r === void 0) && r.contains(p) || !u)
      return;
    let h = 0, m = 0;
    if (this.dom !== u) {
      const A = this.dom.getBoundingClientRect(), M = u.getBoundingClientRect(), $ = (i = e.offsetX) !== null && i !== void 0 ? i : (o = e.nativeEvent) === null || o === void 0 ? void 0 : o.offsetX, F = (a = e.offsetY) !== null && a !== void 0 ? a : (s = e.nativeEvent) === null || s === void 0 ? void 0 : s.offsetY;
      h = M.x - A.x + $, m = M.y - A.y + F;
    }
    const b = this.dom.cloneNode(!0);
    (l = e.dataTransfer) === null || l === void 0 || l.setDragImage(b, h, m);
    const g = this.getPos();
    if (typeof g != "number")
      return;
    const y = N.create(c.state.doc, g), v = c.state.tr.setSelection(y);
    c.dispatch(v);
  }
  stopEvent(e) {
    var t;
    if (!this.dom)
      return !1;
    if (typeof this.options.stopEvent == "function")
      return this.options.stopEvent({ event: e });
    const r = e.target;
    if (!(this.dom.contains(r) && !(!((t = this.contentDOM) === null || t === void 0) && t.contains(r))))
      return !1;
    const o = e.type.startsWith("drag"), a = e.type === "drop";
    if ((["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(r.tagName) || r.isContentEditable) && !a && !o)
      return !0;
    const { isEditable: l } = this.editor, { isDragging: c } = this, p = !!this.node.type.spec.draggable, u = N.isSelectable(this.node), h = e.type === "copy", m = e.type === "paste", b = e.type === "cut", g = e.type === "mousedown";
    if (!p && u && o && e.target === this.dom && e.preventDefault(), p && o && !c && e.target === this.dom)
      return e.preventDefault(), !1;
    if (p && l && !c && g) {
      const y = r.closest("[data-drag-handle]");
      y && (this.dom === y || this.dom.contains(y)) && (this.isDragging = !0, document.addEventListener("dragend", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("drop", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("mouseup", () => {
        this.isDragging = !1;
      }, { once: !0 }));
    }
    return !(c || a || h || m || b || g && u);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(e) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.dom.contains(e.target) && e.type === "childList" && (Ke() || Ut()) && this.editor.isFocused && [
      ...Array.from(e.addedNodes),
      ...Array.from(e.removedNodes)
    ].every((r) => r.isContentEditable) ? !1 : this.contentDOM === e.target && e.type === "attributes" ? !0 : !this.contentDOM.contains(e.target);
  }
  /**
   * Update the attributes of the prosemirror node.
   */
  updateAttributes(e) {
    this.editor.commands.command(({ tr: t }) => {
      const r = this.getPos();
      return typeof r != "number" ? !1 : (t.setNodeMarkup(r, void 0, {
        ...this.node.attrs,
        ...e
      }), !0);
    });
  }
  /**
   * Delete the node.
   */
  deleteNode() {
    const e = this.getPos();
    if (typeof e != "number")
      return;
    const t = e + this.node.nodeSize;
    this.editor.commands.deleteRange({ from: e, to: t });
  }
};
var ni = { exports: {} }, zt = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hn;
function dl() {
  if (Hn) return zt;
  Hn = 1;
  var n = R;
  function e(u, h) {
    return u === h && (u !== 0 || 1 / u === 1 / h) || u !== u && h !== h;
  }
  var t = typeof Object.is == "function" ? Object.is : e, r = n.useState, i = n.useEffect, o = n.useLayoutEffect, a = n.useDebugValue;
  function s(u, h) {
    var m = h(), b = r({ inst: { value: m, getSnapshot: h } }), g = b[0].inst, y = b[1];
    return o(function() {
      g.value = m, g.getSnapshot = h, l(g) && y({ inst: g });
    }, [u, m, h]), i(function() {
      return l(g) && y({ inst: g }), u(function() {
        l(g) && y({ inst: g });
      });
    }, [u]), a(m), m;
  }
  function l(u) {
    var h = u.getSnapshot;
    u = u.value;
    try {
      var m = h();
      return !t(u, m);
    } catch {
      return !0;
    }
  }
  function c(u, h) {
    return h();
  }
  var p = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : s;
  return zt.useSyncExternalStore = n.useSyncExternalStore !== void 0 ? n.useSyncExternalStore : p, zt;
}
ni.exports = dl();
var ri = ni.exports;
const pl = (...n) => (e) => {
  n.forEach((t) => {
    typeof t == "function" ? t(e) : t && (t.current = e);
  });
}, ul = ({ contentComponent: n }) => {
  const e = ri.useSyncExternalStore(n.subscribe, n.getSnapshot, n.getServerSnapshot);
  return R.createElement(R.Fragment, null, Object.values(e));
};
function hl() {
  const n = /* @__PURE__ */ new Set();
  let e = {};
  return {
    /**
     * Subscribe to the editor instance's changes.
     */
    subscribe(t) {
      return n.add(t), () => {
        n.delete(t);
      };
    },
    getSnapshot() {
      return e;
    },
    getServerSnapshot() {
      return e;
    },
    /**
     * Adds a new NodeView Renderer to the editor.
     */
    setRenderer(t, r) {
      e = {
        ...e,
        [t]: fi.createPortal(r.reactElement, r.element, t)
      }, n.forEach((i) => i());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(t) {
      const r = { ...e };
      delete r[t], e = r, n.forEach((i) => i());
    }
  };
}
class fl extends R.Component {
  constructor(e) {
    var t;
    super(e), this.editorContentRef = R.createRef(), this.initialized = !1, this.state = {
      hasContentComponentInitialized: !!(!((t = e.editor) === null || t === void 0) && t.contentComponent)
    };
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    this.init();
  }
  init() {
    const e = this.props.editor;
    if (e && !e.isDestroyed && e.options.element) {
      if (e.contentComponent)
        return;
      const t = this.editorContentRef.current;
      t.append(...e.options.element.childNodes), e.setOptions({
        element: t
      }), e.contentComponent = hl(), this.state.hasContentComponentInitialized || (this.unsubscribeToContentComponent = e.contentComponent.subscribe(() => {
        this.setState((r) => r.hasContentComponentInitialized ? r : {
          hasContentComponentInitialized: !0
        }), this.unsubscribeToContentComponent && this.unsubscribeToContentComponent();
      })), e.createNodeViews(), this.initialized = !0;
    }
  }
  componentWillUnmount() {
    const e = this.props.editor;
    if (!e || (this.initialized = !1, e.isDestroyed || e.view.setProps({
      nodeViews: {}
    }), this.unsubscribeToContentComponent && this.unsubscribeToContentComponent(), e.contentComponent = null, !e.options.element.firstChild))
      return;
    const t = document.createElement("div");
    t.append(...e.options.element.childNodes), e.setOptions({
      element: t
    });
  }
  render() {
    const { editor: e, innerRef: t, ...r } = this.props;
    return R.createElement(
      R.Fragment,
      null,
      R.createElement("div", { ref: pl(t, this.editorContentRef), ...r }),
      (e == null ? void 0 : e.contentComponent) && R.createElement(ul, { contentComponent: e.contentComponent })
    );
  }
}
const ml = Vt((n, e) => {
  const t = R.useMemo(() => Math.floor(Math.random() * 4294967295).toString(), [n.editor]);
  return R.createElement(fl, {
    key: t,
    innerRef: e,
    ...n
  });
});
R.memo(ml);
var Lt = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jn;
function gl() {
  if (jn) return Lt;
  jn = 1;
  var n = R, e = ri;
  function t(c, p) {
    return c === p && (c !== 0 || 1 / c === 1 / p) || c !== c && p !== p;
  }
  var r = typeof Object.is == "function" ? Object.is : t, i = e.useSyncExternalStore, o = n.useRef, a = n.useEffect, s = n.useMemo, l = n.useDebugValue;
  return Lt.useSyncExternalStoreWithSelector = function(c, p, u, h, m) {
    var b = o(null);
    if (b.current === null) {
      var g = { hasValue: !1, value: null };
      b.current = g;
    } else g = b.current;
    b = s(function() {
      function v(T) {
        if (!A) {
          if (A = !0, M = T, T = h(T), m !== void 0 && g.hasValue) {
            var j = g.value;
            if (m(j, T)) return $ = j;
          }
          return $ = T;
        }
        if (j = $, r(M, T)) return j;
        var J = h(T);
        return m !== void 0 && m(j, J) ? j : (M = T, $ = J);
      }
      var A = !1, M, $, F = u === void 0 ? null : u;
      return [function() {
        return v(p());
      }, F === null ? void 0 : function() {
        return v(F());
      }];
    }, [p, u, h, m]);
    var y = i(c, b[0], b[1]);
    return a(function() {
      g.hasValue = !0, g.value = y;
    }, [y]), l(y), y;
  }, Lt;
}
gl();
const bl = Gn({
  editor: null
});
bl.Consumer;
const ii = Gn({
  onDragStart: void 0
}), yl = () => pi(ii), te = R.forwardRef((n, e) => {
  const { onDragStart: t } = yl(), r = n.as || "div";
  return (
    // @ts-ignore
    R.createElement(r, { ...n, ref: e, "data-node-view-wrapper": "", onDragStart: t, style: {
      whiteSpace: "normal",
      ...n.style
    } })
  );
});
function Un(n) {
  return !!(typeof n == "function" && n.prototype && n.prototype.isReactComponent);
}
function Vn(n) {
  return !!(typeof n == "object" && n.$$typeof && (n.$$typeof.toString() === "Symbol(react.forward_ref)" || n.$$typeof.description === "react.forward_ref"));
}
function xl(n) {
  return !!(typeof n == "object" && n.$$typeof && (n.$$typeof.toString() === "Symbol(react.memo)" || n.$$typeof.description === "react.memo"));
}
function vl(n) {
  if (Un(n) || Vn(n))
    return !0;
  if (xl(n)) {
    const e = n.type;
    if (e)
      return Un(e) || Vn(e);
  }
  return !1;
}
function wl() {
  try {
    if (gn)
      return parseInt(gn.split(".")[0], 10) >= 19;
  } catch {
  }
  return !1;
}
class kl {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(e, { editor: t, props: r = {}, as: i = "div", className: o = "" }) {
    this.ref = null, this.id = Math.floor(Math.random() * 4294967295).toString(), this.component = e, this.editor = t, this.props = r, this.element = document.createElement(i), this.element.classList.add("react-renderer"), o && this.element.classList.add(...o.split(" ")), this.editor.isInitialized ? mi(() => {
      this.render();
    }) : queueMicrotask(() => {
      this.render();
    });
  }
  /**
   * Render the React component.
   */
  render() {
    var e;
    const t = this.component, r = this.props, i = this.editor, o = wl(), a = vl(t), s = { ...r };
    s.ref && !(o || a) && delete s.ref, !s.ref && (o || a) && (s.ref = (l) => {
      this.ref = l;
    }), this.reactElement = R.createElement(t, { ...s }), (e = i == null ? void 0 : i.contentComponent) === null || e === void 0 || e.setRenderer(this.id, this);
  }
  /**
   * Re-renders the React component with new props.
   */
  updateProps(e = {}) {
    this.props = {
      ...this.props,
      ...e
    }, this.render();
  }
  /**
   * Destroy the React component.
   */
  destroy() {
    var e;
    const t = this.editor;
    (e = t == null ? void 0 : t.contentComponent) === null || e === void 0 || e.removeRenderer(this.id);
  }
  /**
   * Update the attributes of the element that holds the React component.
   */
  updateAttributes(e) {
    Object.keys(e).forEach((t) => {
      this.element.setAttribute(t, e[t]);
    });
  }
}
class _l extends cl {
  constructor(e, t, r) {
    if (super(e, t, r), !this.node.isLeaf) {
      this.options.contentDOMElementTag ? this.contentDOMElement = document.createElement(this.options.contentDOMElementTag) : this.contentDOMElement = document.createElement(this.node.isInline ? "span" : "div"), this.contentDOMElement.dataset.nodeViewContentReact = "", this.contentDOMElement.dataset.nodeViewWrapper = "", this.contentDOMElement.style.whiteSpace = "inherit";
      const i = this.dom.querySelector("[data-node-view-content]");
      if (!i)
        return;
      i.appendChild(this.contentDOMElement);
    }
  }
  /**
   * Setup the React component.
   * Called on initialization.
   */
  mount() {
    const e = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: !1,
      extension: this.extension,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (c = {}) => this.updateAttributes(c),
      deleteNode: () => this.deleteNode(),
      ref: ci()
    };
    if (!this.component.displayName) {
      const c = (p) => p.charAt(0).toUpperCase() + p.substring(1);
      this.component.displayName = c(this.extension.name);
    }
    const i = { onDragStart: this.onDragStart.bind(this), nodeViewContentRef: (c) => {
      c && this.contentDOMElement && c.firstChild !== this.contentDOMElement && (c.hasAttribute("data-node-view-wrapper") && c.removeAttribute("data-node-view-wrapper"), c.appendChild(this.contentDOMElement));
    } }, o = this.component, a = di((c) => R.createElement(ii.Provider, { value: i }, lt(o, c)));
    a.displayName = "ReactNodeView";
    let s = this.node.isInline ? "span" : "div";
    this.options.as && (s = this.options.as);
    const { className: l = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.renderer = new kl(a, {
      editor: this.editor,
      props: e,
      as: s,
      className: `node-${this.node.type.name} ${l}`.trim()
    }), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.updateElementAttributes();
  }
  /**
   * Return the DOM element.
   * This is the element that will be used to display the node view.
   */
  get dom() {
    var e;
    if (this.renderer.element.firstElementChild && !(!((e = this.renderer.element.firstElementChild) === null || e === void 0) && e.hasAttribute("data-node-view-wrapper")))
      throw Error("Please use the NodeViewWrapper component for your node view.");
    return this.renderer.element;
  }
  /**
   * Return the content DOM element.
   * This is the element that will be used to display the rich-text content of the node.
   */
  get contentDOM() {
    return this.node.isLeaf ? null : this.contentDOMElement;
  }
  /**
   * On editor selection update, check if the node is selected.
   * If it is, call `selectNode`, otherwise call `deselectNode`.
   */
  handleSelectionUpdate() {
    const { from: e, to: t } = this.editor.state.selection, r = this.getPos();
    if (typeof r == "number")
      if (e <= r && t >= r + this.node.nodeSize) {
        if (this.renderer.props.selected)
          return;
        this.selectNode();
      } else {
        if (!this.renderer.props.selected)
          return;
        this.deselectNode();
      }
  }
  /**
   * On update, update the React component.
   * To prevent unnecessary updates, the `update` option can be used.
   */
  update(e, t, r) {
    const i = (o) => {
      this.renderer.updateProps(o), typeof this.options.attrs == "function" && this.updateElementAttributes();
    };
    if (e.type !== this.node.type)
      return !1;
    if (typeof this.options.update == "function") {
      const o = this.node, a = this.decorations, s = this.innerDecorations;
      return this.node = e, this.decorations = t, this.innerDecorations = r, this.options.update({
        oldNode: o,
        oldDecorations: a,
        newNode: e,
        newDecorations: t,
        oldInnerDecorations: s,
        innerDecorations: r,
        updateProps: () => i({ node: e, decorations: t, innerDecorations: r })
      });
    }
    return e === this.node && this.decorations === t && this.innerDecorations === r || (this.node = e, this.decorations = t, this.innerDecorations = r, i({ node: e, decorations: t, innerDecorations: r })), !0;
  }
  /**
   * Select the node.
   * Add the `selected` prop and the `ProseMirror-selectednode` class.
   */
  selectNode() {
    this.renderer.updateProps({
      selected: !0
    }), this.renderer.element.classList.add("ProseMirror-selectednode");
  }
  /**
   * Deselect the node.
   * Remove the `selected` prop and the `ProseMirror-selectednode` class.
   */
  deselectNode() {
    this.renderer.updateProps({
      selected: !1
    }), this.renderer.element.classList.remove("ProseMirror-selectednode");
  }
  /**
   * Destroy the React component instance.
   */
  destroy() {
    this.renderer.destroy(), this.editor.off("selectionUpdate", this.handleSelectionUpdate), this.contentDOMElement = null;
  }
  /**
   * Update the attributes of the top-level element that holds the React component.
   * Applying the attributes defined in the `attrs` option.
   */
  updateElementAttributes() {
    if (this.options.attrs) {
      let e = {};
      if (typeof this.options.attrs == "function") {
        const t = this.editor.extensionManager.attributes, r = Pa(this.node, t);
        e = this.options.attrs({ node: this.node, HTMLAttributes: r });
      } else
        e = this.options.attrs;
      this.renderer.updateAttributes(e);
    }
  }
}
function Nl(n, e) {
  return (t) => t.editor.contentComponent ? new _l(n, t, e) : {};
}
function ne({
  subId: n,
  defaultAttrs: e,
  view: t
}) {
  const r = `${Li}/${n}`, i = Qn(
    n.replace(/-([a-z])/g, (o, a) => a.toUpperCase())
  );
  return bt.create({
    name: i,
    group: "block",
    atom: !0,
    selectable: !0,
    draggable: !0,
    addAttributes() {
      return {
        attrs: {
          default: e,
          parseHTML: (o) => Y(o.getAttribute("data-attrs") ?? "", e),
          renderHTML: (o) => ({
            "data-attrs": Me(o.attrs ?? e)
          })
        }
      };
    },
    parseHTML() {
      return [{ tag: `div[data-cms-block="${r}"]` }];
    },
    renderHTML({ HTMLAttributes: o }) {
      return [
        "div",
        Gr(o, { "data-cms-block": r })
      ];
    },
    addNodeView() {
      return Nl((o) => {
        const a = o.node.attrs.attrs ?? e;
        return /* @__PURE__ */ d(t, { attrs: a, updateAttrs: (l) => {
          o.updateAttributes({ attrs: { ...a, ...l } });
        }, selected: o.selected });
      });
    }
  });
}
function re(n) {
  return Qn(n.replace(/-([a-z])/g, (e, t) => t.toUpperCase()));
}
const an = "header-buttons", ze = re(an);
function Cl({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core"), r = !!(n.downloadUrl || n.previewUrl);
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(tr, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.headerButtons.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r ? [n.downloadUrl, n.previewUrl].filter(Boolean).join(" · ") : t("blocks.headerButtons.untitled") })
        ] })
      ] })
    }
  );
}
function Sl({ editor: n }) {
  const e = n.getAttributes(ze), t = { ...Xe, ...e.attrs ?? {} };
  function r(i) {
    n.chain().updateAttributes(ze, { attrs: { ...t, ...i } }).run();
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { className: "grid grid-cols-[1fr_2fr] gap-2", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Byline prefix" }),
        /* @__PURE__ */ d(
          "input",
          {
            className: "input",
            placeholder: "by",
            value: t.creatorPrefix,
            onChange: (i) => r({ creatorPrefix: i.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Created by" }),
        /* @__PURE__ */ d(
          "input",
          {
            className: "input",
            placeholder: "Brad Frost",
            value: t.creator,
            onChange: (i) => r({ creator: i.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Download URL" }),
      /* @__PURE__ */ d(
        "input",
        {
          type: "url",
          className: "input",
          placeholder: "https://github.com/example/your-project/releases/latest",
          value: t.downloadUrl,
          onChange: (i) => r({ downloadUrl: i.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Live Preview URL" }),
      /* @__PURE__ */ d(
        "input",
        {
          type: "url",
          className: "input",
          placeholder: "https://demo.example.com",
          value: t.previewUrl,
          onChange: (i) => r({ previewUrl: i.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Download label" }),
        /* @__PURE__ */ d(
          "input",
          {
            className: "input",
            value: t.downloadLabel,
            onChange: (i) => r({ downloadLabel: i.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Preview label" }),
        /* @__PURE__ */ d(
          "input",
          {
            className: "input",
            value: t.previewLabel,
            onChange: (i) => r({ previewLabel: i.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Free badge label" }),
      /* @__PURE__ */ d(
        "input",
        {
          className: "input",
          value: t.freeLabel,
          onChange: (i) => r({ freeLabel: i.target.value })
        }
      )
    ] })
  ] });
}
const El = ne({
  subId: an,
  defaultAttrs: Xe,
  view: Cl
}), Al = {
  id: `marketplace-core/${an}`,
  nodeName: ze,
  titleKey: "blocks.headerButtons.title",
  namespace: "theme-marketplace-core",
  icon: tr,
  category: "layout",
  extensions: [El],
  insert: (n) => {
    n.focus().insertContent({ type: ze, attrs: { attrs: Xe } }).run();
  },
  isActive: (n) => n.isActive(ze),
  inspector: (n) => /* @__PURE__ */ d(Sl, { editor: n.editor })
}, sn = "gallery", Le = re(sn);
function Ml({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(qt, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.gallery.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: t("blocks.gallery.count", { n: n.images.length }) })
        ] })
      ] })
    }
  );
}
function Il({ editor: n }) {
  const e = n.getAttributes(Le), t = { ...Qe, ...e.attrs ?? {} }, [r, i] = he(!1);
  function o(c) {
    n.chain().updateAttributes(Le, { attrs: { ...t, ...c } }).run();
  }
  function a(c, p) {
    const u = [...t.images];
    u[c] = p, o({ images: u });
  }
  function s(c) {
    o({ images: t.images.filter((p, u) => u !== c) });
  }
  function l(c, p) {
    const u = c + p;
    if (u < 0 || u >= t.images.length) return;
    const h = [...t.images];
    [h[c], h[u]] = [h[u], h[c]], o({ images: h });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    t.images.length === 0 && /* @__PURE__ */ d("p", { className: "text-xs text-surface-500", children: 'No images yet — click "Add image" to pick from the media library.' }),
    t.images.map((c, p) => /* @__PURE__ */ f(
      "div",
      {
        className: "flex items-start gap-2 rounded border border-surface-200 p-2 dark:border-surface-700",
        children: [
          c.url && /* @__PURE__ */ d("img", { src: c.url, alt: c.alt, className: "h-16 w-16 object-cover rounded" }),
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ d(
              "input",
              {
                className: "input text-xs",
                placeholder: "Image alt",
                value: c.alt,
                onChange: (u) => a(p, { ...c, alt: u.target.value })
              }
            ),
            /* @__PURE__ */ d("p", { className: "text-[10px] text-surface-500 mt-1 truncate", title: c.url, children: c.url })
          ] }),
          /* @__PURE__ */ f("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => l(p, -1),
                disabled: p === 0,
                className: "btn-ghost p-1",
                title: "Move up",
                children: /* @__PURE__ */ d(Eo, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => l(p, 1),
                disabled: p === t.images.length - 1,
                className: "btn-ghost p-1",
                title: "Move down",
                children: /* @__PURE__ */ d(So, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => s(p),
                className: "btn-ghost p-1 text-red-600",
                title: "Remove",
                children: /* @__PURE__ */ d(ye, { className: "h-3 w-3" })
              }
            )
          ] })
        ]
      },
      p
    )),
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        onClick: () => i(!0),
        className: "btn-secondary text-xs w-full",
        children: [
          /* @__PURE__ */ d(qt, { className: "h-3.5 w-3.5" }),
          "Add image from library"
        ]
      }
    ),
    r && /* @__PURE__ */ d(
      li,
      {
        onClose: () => i(!1),
        onPick: (c) => {
          i(!1);
          const p = Ct(c, "large") || Ct(c, "medium") || Ct(c);
          p && o({ images: [...t.images, { url: p, alt: c.alt ?? "" }] });
        }
      }
    )
  ] });
}
const Tl = ne({
  subId: sn,
  defaultAttrs: Qe,
  view: Ml
}), Ol = {
  id: `marketplace-core/${sn}`,
  nodeName: Le,
  titleKey: "blocks.gallery.title",
  namespace: "theme-marketplace-core",
  icon: qt,
  category: "media",
  extensions: [Tl],
  insert: (n) => {
    n.focus().insertContent({ type: Le, attrs: { attrs: Qe } }).run();
  },
  isActive: (n) => n.isActive(Le),
  inspector: (n) => /* @__PURE__ */ d(Il, { editor: n.editor })
}, ln = "specs", Fe = re(ln);
function Rl({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core"), r = n.rows.map((i) => i.label).filter(Boolean).slice(0, 3).join(" · ");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(rr, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.specs.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: r || t("blocks.specs.untitled") })
        ] })
      ] })
    }
  );
}
function $l({ editor: n }) {
  const e = n.getAttributes(Fe), t = { ...Ze, ...e.attrs ?? {} };
  function r(s) {
    n.chain().updateAttributes(Fe, { attrs: { ...t, ...s } }).run();
  }
  function i(s, l, c) {
    const p = [...t.rows];
    p[s] = { ...p[s], [l]: c }, r({ rows: p });
  }
  function o() {
    r({ rows: [...t.rows, { label: "", value: "" }] });
  }
  function a(s) {
    r({ rows: t.rows.filter((l, c) => c !== s) });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Section heading" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.heading, onChange: (s) => r({ heading: s.target.value }) })
    ] }),
    t.rows.map((s, l) => /* @__PURE__ */ f("div", { className: "space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ f("span", { className: "text-xs font-semibold uppercase text-surface-500", children: [
          "Row ",
          l + 1
        ] }),
        /* @__PURE__ */ d("button", { type: "button", onClick: () => a(l), className: "btn-ghost p-1 text-red-600", children: /* @__PURE__ */ d(ye, { className: "h-3 w-3" }) })
      ] }),
      /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ d("label", { className: "label", children: "Label" }),
          /* @__PURE__ */ d(
            "input",
            {
              className: "input text-xs",
              value: s.label,
              onChange: (c) => i(l, "label", c.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ f("div", { children: [
          /* @__PURE__ */ d("label", { className: "label", children: "Value" }),
          /* @__PURE__ */ d(
            "input",
            {
              className: "input text-xs",
              value: s.value,
              onChange: (c) => i(l, "value", c.target.value)
            }
          )
        ] })
      ] })
    ] }, l)),
    /* @__PURE__ */ f("button", { type: "button", onClick: o, className: "btn-secondary text-xs w-full", children: [
      /* @__PURE__ */ d(Ee, { className: "h-3.5 w-3.5" }),
      "Add row"
    ] })
  ] });
}
const Bl = ne({
  subId: ln,
  defaultAttrs: Ze,
  view: Rl
}), zl = {
  id: `marketplace-core/${ln}`,
  nodeName: Fe,
  titleKey: "blocks.specs.title",
  namespace: "theme-marketplace-core",
  icon: rr,
  category: "layout",
  extensions: [Bl],
  insert: (n) => {
    n.focus().insertContent({ type: Fe, attrs: { attrs: Ze } }).run();
  },
  isActive: (n) => n.isActive(Fe),
  inspector: (n) => /* @__PURE__ */ d($l, { editor: n.editor })
}, Jn = [
  "dashboard",
  "analytics",
  "monitoring",
  "trending_up",
  "insights",
  "bolt",
  "rocket_launch",
  "auto_awesome",
  "star",
  "favorite",
  "shopping_bag",
  "shopping_cart",
  "credit_card",
  "payments",
  "sell",
  "lock",
  "security",
  "shield",
  "verified_user",
  "key",
  "settings",
  "tune",
  "build",
  "construction",
  "extension",
  "palette",
  "brush",
  "format_paint",
  "color_lens",
  "design_services",
  "code",
  "terminal",
  "data_object",
  "developer_mode",
  "integration_instructions",
  "cloud",
  "cloud_upload",
  "cloud_download",
  "storage",
  "database",
  "search",
  "filter_alt",
  "sort",
  "view_module",
  "view_list",
  "mail",
  "send",
  "chat",
  "forum",
  "notifications",
  "person",
  "group",
  "groups",
  "manage_accounts",
  "support_agent",
  "download",
  "upload",
  "file_download",
  "file_upload",
  "save",
  "language",
  "translate",
  "public",
  "globe",
  "travel_explore",
  "speed",
  "memory",
  "bar_chart",
  "pie_chart",
  "show_chart",
  "shopping_basket",
  "store",
  "inventory",
  "package_2",
  "local_shipping",
  "smartphone",
  "devices",
  "tablet_mac",
  "laptop_mac",
  "tv",
  "schedule",
  "today",
  "event",
  "calendar_month",
  "timer",
  "help",
  "info",
  "question_mark",
  "lightbulb",
  "tips_and_updates",
  "check_circle",
  "task_alt",
  "verified",
  "done",
  "thumb_up",
  "warning",
  "error",
  "block",
  "report",
  "priority_high"
], qn = "mp-icon-picker-font", Ll = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0";
function Fl() {
  if (typeof document > "u" || document.getElementById(qn)) return;
  const n = document.createElement("link");
  n.id = qn, n.rel = "stylesheet", n.href = Ll, document.head.appendChild(n);
}
const Wn = {
  fontFamily: '"Material Symbols Outlined"',
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: 24,
  lineHeight: 1,
  letterSpacing: "normal",
  textTransform: "none",
  display: "inline-block",
  whiteSpace: "nowrap",
  wordWrap: "normal",
  direction: "ltr",
  WebkitFontSmoothing: "antialiased",
  fontVariationSettings: '"FILL" 0'
};
function Pl({
  value: n,
  onChange: e,
  placeholder: t = "e.g. dashboard, security, bolt"
}) {
  const [r, i] = he(!1), [o, a] = he(""), s = ui(null);
  bn(() => {
    Fl();
  }, []), bn(() => {
    if (!r) return;
    const c = (p) => {
      s.current && (s.current.contains(p.target) || i(!1));
    };
    return document.addEventListener("mousedown", c), () => document.removeEventListener("mousedown", c);
  }, [r]);
  const l = hi(() => {
    const c = o.trim().toLowerCase();
    return c ? Jn.filter((p) => p.includes(c)) : Jn;
  }, [o]);
  return /* @__PURE__ */ f("div", { ref: s, className: "relative", children: [
    /* @__PURE__ */ f("div", { className: "flex items-stretch gap-2", children: [
      /* @__PURE__ */ d(
        "input",
        {
          className: "input text-xs flex-1",
          value: n,
          placeholder: t,
          onChange: (c) => e(c.target.value),
          onFocus: () => i(!0)
        }
      ),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: () => i((c) => !c),
          className: "flex items-center justify-center w-10 rounded border border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800 shrink-0",
          "aria-label": "Pick icon",
          title: n || "No icon selected",
          children: /* @__PURE__ */ d("span", { style: Wn, children: n || "image" })
        }
      )
    ] }),
    r && /* @__PURE__ */ f("div", { className: "absolute z-20 mt-1 w-full rounded border border-surface-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-900", children: [
      /* @__PURE__ */ d("div", { className: "border-b border-surface-100 p-2 dark:border-surface-800", children: /* @__PURE__ */ d(
        "input",
        {
          className: "input text-xs w-full",
          placeholder: "Search icons…",
          value: o,
          onChange: (c) => a(c.target.value),
          autoFocus: !0
        }
      ) }),
      /* @__PURE__ */ d("div", { className: "max-h-60 overflow-y-auto p-2", children: l.length === 0 ? /* @__PURE__ */ d("p", { className: "text-center text-xs text-surface-500 py-4", children: "No match — keep typing in the field above to use it anyway." }) : /* @__PURE__ */ d("div", { className: "grid grid-cols-6 gap-1", children: l.map((c) => /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          title: c,
          onClick: () => {
            e(c), i(!1), a("");
          },
          className: "flex flex-col items-center justify-center gap-1 rounded p-2 text-[10px] " + (c === n ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "hover:bg-surface-100 text-surface-700 dark:hover:bg-surface-800 dark:text-surface-300"),
          children: [
            /* @__PURE__ */ d("span", { style: Wn, children: c }),
            /* @__PURE__ */ d("span", { className: "truncate w-full text-center", children: c })
          ]
        },
        c
      )) }) })
    ] })
  ] });
}
const cn = "features", Pe = re(cn);
function Dl({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(sr, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.features.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: t("blocks.features.count", { n: n.items.length }) })
        ] })
      ] })
    }
  );
}
function Hl({ editor: n }) {
  const e = n.getAttributes(Pe), t = { ...et, ...e.attrs ?? {} };
  function r(s) {
    n.chain().updateAttributes(Pe, { attrs: { ...t, ...s } }).run();
  }
  function i(s, l, c) {
    const p = [...t.items];
    p[s] = { ...p[s], [l]: c }, r({ items: p });
  }
  function o() {
    r({
      items: [...t.items, { icon: "bolt", title: "" }]
    });
  }
  function a(s) {
    r({ items: t.items.filter((l, c) => c !== s) });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Section heading" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.heading, onChange: (s) => r({ heading: s.target.value }) })
    ] }),
    t.items.map((s, l) => /* @__PURE__ */ f("div", { className: "space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ f("span", { className: "text-xs font-semibold uppercase text-surface-500", children: [
          "Feature ",
          l + 1
        ] }),
        /* @__PURE__ */ d("button", { type: "button", onClick: () => a(l), className: "btn-ghost p-1 text-red-600", children: /* @__PURE__ */ d(ye, { className: "h-3 w-3" }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Icon" }),
        /* @__PURE__ */ d(
          Pl,
          {
            value: s.icon,
            onChange: (c) => i(l, "icon", c)
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Title" }),
        /* @__PURE__ */ d(
          "input",
          {
            className: "input text-xs",
            value: s.title,
            onChange: (c) => i(l, "title", c.target.value)
          }
        )
      ] })
    ] }, l)),
    /* @__PURE__ */ f("button", { type: "button", onClick: o, className: "btn-secondary text-xs w-full", children: [
      /* @__PURE__ */ d(Ee, { className: "h-3.5 w-3.5" }),
      "Add feature"
    ] })
  ] });
}
const jl = ne({
  subId: cn,
  defaultAttrs: et,
  view: Dl
}), Ul = {
  id: `marketplace-core/${cn}`,
  nodeName: Pe,
  titleKey: "blocks.features.title",
  namespace: "theme-marketplace-core",
  icon: sr,
  category: "layout",
  extensions: [jl],
  insert: (n) => {
    n.focus().insertContent({ type: Pe, attrs: { attrs: et } }).run();
  },
  isActive: (n) => n.isActive(Pe),
  inspector: (n) => /* @__PURE__ */ d(Hl, { editor: n.editor })
}, dn = "landing-hero", De = re(dn);
function Vl({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(or, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.landingHero.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: n.headline || t("blocks.landingHero.empty") })
        ] })
      ] })
    }
  );
}
function Jl({ editor: n }) {
  const e = n.getAttributes(De), t = { ...yt, ...e.attrs ?? {} };
  function r(i) {
    n.chain().updateAttributes(De, { attrs: { ...t, ...i } }).run();
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.eyebrow, onChange: (i) => r({ eyebrow: i.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Headline" }),
      /* @__PURE__ */ d("textarea", { className: "input min-h-[60px]", value: t.headline, onChange: (i) => r({ headline: i.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Subhead" }),
      /* @__PURE__ */ d("textarea", { className: "input min-h-[60px]", value: t.subhead, onChange: (i) => r({ subhead: i.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Primary CTA label" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.primaryCta.label, onChange: (i) => r({ primaryCta: { ...t.primaryCta, label: i.target.value } }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Primary CTA URL" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.primaryCta.href, onChange: (i) => r({ primaryCta: { ...t.primaryCta, href: i.target.value } }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Secondary CTA label" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.secondaryCta.label, onChange: (i) => r({ secondaryCta: { ...t.secondaryCta, label: i.target.value } }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Secondary CTA URL" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.secondaryCta.href, onChange: (i) => r({ secondaryCta: { ...t.secondaryCta, href: i.target.value } }) })
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Image URL" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.imageUrl, onChange: (i) => r({ imageUrl: i.target.value }), placeholder: "home-hero-admin.jpg or /media/…" })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Image alt text" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.imageAlt, onChange: (i) => r({ imageAlt: i.target.value }) })
    ] })
  ] });
}
const ql = ne({
  subId: dn,
  defaultAttrs: yt,
  view: Vl
}), Wl = {
  id: `marketplace-core/${dn}`,
  nodeName: De,
  titleKey: "blocks.landingHero.title",
  namespace: "theme-marketplace-core",
  icon: or,
  category: "layout",
  extensions: [ql],
  insert: (n) => {
    n.focus().insertContent({ type: De, attrs: { attrs: yt } }).run();
  },
  isActive: (n) => n.isActive(De),
  inspector: (n) => /* @__PURE__ */ d(Jl, { editor: n.editor })
}, pn = "feature-grid", He = re(pn);
function Gl({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(nr, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.featureGrid.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: t("blocks.featureGrid.count", { n: n.items.length }) })
        ] })
      ] })
    }
  );
}
function Kl({ editor: n }) {
  const e = n.getAttributes(He), t = { ...xt, ...e.attrs ?? {} };
  function r(s) {
    n.chain().updateAttributes(He, { attrs: { ...t, ...s } }).run();
  }
  function i(s, l, c) {
    const p = [...t.items];
    p[s] = { ...p[s], [l]: c }, r({ items: p });
  }
  function o() {
    r({ items: [...t.items, { icon: "bolt", title: "", body: "" }] });
  }
  function a(s) {
    r({ items: t.items.filter((l, c) => c !== s) });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Heading" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.heading, onChange: (s) => r({ heading: s.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Subhead" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.subhead, onChange: (s) => r({ subhead: s.target.value }) })
    ] }),
    t.items.map((s, l) => /* @__PURE__ */ f("div", { className: "space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ f("span", { className: "text-xs font-semibold uppercase text-surface-500", children: [
          "Item ",
          l + 1
        ] }),
        /* @__PURE__ */ d("button", { type: "button", onClick: () => a(l), className: "btn-ghost p-1 text-red-600", children: /* @__PURE__ */ d(ye, { className: "h-3 w-3" }) })
      ] }),
      /* @__PURE__ */ d("input", { className: "input text-xs", placeholder: "Material icon (bolt, language, …)", value: s.icon, onChange: (c) => i(l, "icon", c.target.value) }),
      /* @__PURE__ */ d("input", { className: "input text-xs", placeholder: "Title", value: s.title, onChange: (c) => i(l, "title", c.target.value) }),
      /* @__PURE__ */ d("textarea", { className: "input text-xs min-h-[60px]", placeholder: "Body", value: s.body, onChange: (c) => i(l, "body", c.target.value) })
    ] }, l)),
    /* @__PURE__ */ f("button", { type: "button", onClick: o, className: "btn-secondary text-xs w-full", children: [
      /* @__PURE__ */ d(Ee, { className: "h-3.5 w-3.5" }),
      "Add item"
    ] })
  ] });
}
const Yl = ne({
  subId: pn,
  defaultAttrs: xt,
  view: Gl
}), Xl = {
  id: `marketplace-core/${pn}`,
  nodeName: He,
  titleKey: "blocks.featureGrid.title",
  namespace: "theme-marketplace-core",
  icon: nr,
  category: "layout",
  extensions: [Yl],
  insert: (n) => {
    n.focus().insertContent({ type: He, attrs: { attrs: xt } }).run();
  },
  isActive: (n) => n.isActive(He),
  inspector: (n) => /* @__PURE__ */ d(Kl, { editor: n.editor })
}, un = "feature-row", je = re(un);
function Ql({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(lr, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.featureRow.title") }),
          /* @__PURE__ */ f("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: [
            n.headline || t("blocks.featureRow.empty"),
            " ·",
            " ",
            /* @__PURE__ */ d("span", { className: "text-surface-500", children: n.imagePosition === "left" ? "← image" : "image →" })
          ] })
        ] })
      ] })
    }
  );
}
function Zl({ editor: n }) {
  const e = n.getAttributes(je), t = { ...vt, ...e.attrs ?? {} };
  function r(s) {
    n.chain().updateAttributes(je, { attrs: { ...t, ...s } }).run();
  }
  function i(s, l) {
    const c = [...t.bullets];
    c[s] = l, r({ bullets: c });
  }
  function o() {
    r({ bullets: [...t.bullets, ""] });
  }
  function a(s) {
    r({ bullets: t.bullets.filter((l, c) => c !== s) });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Image position" }),
      /* @__PURE__ */ f(
        "select",
        {
          className: "input",
          value: t.imagePosition,
          onChange: (s) => r({ imagePosition: s.target.value }),
          children: [
            /* @__PURE__ */ d("option", { value: "left", children: "Image on the left" }),
            /* @__PURE__ */ d("option", { value: "right", children: "Image on the right" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Eyebrow" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.eyebrow, onChange: (s) => r({ eyebrow: s.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Headline" }),
      /* @__PURE__ */ d("textarea", { className: "input min-h-[60px]", value: t.headline, onChange: (s) => r({ headline: s.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Body" }),
      /* @__PURE__ */ d("textarea", { className: "input min-h-[80px]", value: t.body, onChange: (s) => r({ body: s.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Bullets" }),
      /* @__PURE__ */ f("div", { className: "space-y-2", children: [
        t.bullets.map((s, l) => /* @__PURE__ */ f("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ d("input", { className: "input text-xs flex-1", value: s, onChange: (c) => i(l, c.target.value) }),
          /* @__PURE__ */ d("button", { type: "button", onClick: () => a(l), className: "btn-ghost p-1 text-red-600", children: /* @__PURE__ */ d(ye, { className: "h-3 w-3" }) })
        ] }, l)),
        /* @__PURE__ */ f("button", { type: "button", onClick: o, className: "btn-secondary text-xs w-full", children: [
          /* @__PURE__ */ d(Ee, { className: "h-3.5 w-3.5" }),
          "Add bullet"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "CTA label" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.ctaLabel, onChange: (s) => r({ ctaLabel: s.target.value }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "CTA URL" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.ctaHref, onChange: (s) => r({ ctaHref: s.target.value }) })
      ] })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Image URL" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.imageUrl, onChange: (s) => r({ imageUrl: s.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Image alt" }),
      /* @__PURE__ */ d("input", { className: "input", value: t.imageAlt, onChange: (s) => r({ imageAlt: s.target.value }) })
    ] })
  ] });
}
const ec = ne({
  subId: un,
  defaultAttrs: vt,
  view: Ql
}), tc = {
  id: `marketplace-core/${un}`,
  nodeName: je,
  titleKey: "blocks.featureRow.title",
  namespace: "theme-marketplace-core",
  icon: lr,
  category: "layout",
  extensions: [ec],
  insert: (n) => {
    n.focus().insertContent({ type: je, attrs: { attrs: vt } }).run();
  },
  isActive: (n) => n.isActive(je),
  inspector: (n) => /* @__PURE__ */ d(Zl, { editor: n.editor })
}, hn = "stats-bar", Ue = re(hn);
function nc({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(er, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.statsBar.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: t("blocks.statsBar.count", { n: n.items.length }) })
        ] })
      ] })
    }
  );
}
function rc({ editor: n }) {
  const e = n.getAttributes(Ue), t = { ...wt, ...e.attrs ?? {} };
  function r(s) {
    n.chain().updateAttributes(Ue, { attrs: { ...t, ...s } }).run();
  }
  function i(s, l, c) {
    const p = [...t.items];
    p[s] = { ...p[s], [l]: c }, r({ items: p });
  }
  function o() {
    r({ items: [...t.items, { value: "", label: "" }] });
  }
  function a(s) {
    r({ items: t.items.filter((l, c) => c !== s) });
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    t.items.map((s, l) => /* @__PURE__ */ f("div", { className: "space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700", children: [
      /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ f("span", { className: "text-xs font-semibold uppercase text-surface-500", children: [
          "Stat ",
          l + 1
        ] }),
        /* @__PURE__ */ d("button", { type: "button", onClick: () => a(l), className: "btn-ghost p-1 text-red-600", children: /* @__PURE__ */ d(ye, { className: "h-3 w-3" }) })
      ] }),
      /* @__PURE__ */ d("input", { className: "input text-xs", placeholder: "Value (10, MIT, ∞)", value: s.value, onChange: (c) => i(l, "value", c.target.value) }),
      /* @__PURE__ */ d("input", { className: "input text-xs", placeholder: "Label", value: s.label, onChange: (c) => i(l, "label", c.target.value) })
    ] }, l)),
    /* @__PURE__ */ f("button", { type: "button", onClick: o, className: "btn-secondary text-xs w-full", children: [
      /* @__PURE__ */ d(Ee, { className: "h-3.5 w-3.5" }),
      "Add stat"
    ] })
  ] });
}
const ic = ne({
  subId: hn,
  defaultAttrs: wt,
  view: nc
}), oc = {
  id: `marketplace-core/${hn}`,
  nodeName: Ue,
  titleKey: "blocks.statsBar.title",
  namespace: "theme-marketplace-core",
  icon: er,
  category: "layout",
  extensions: [ic],
  insert: (n) => {
    n.focus().insertContent({ type: Ue, attrs: { attrs: wt } }).run();
  },
  isActive: (n) => n.isActive(Ue),
  inspector: (n) => /* @__PURE__ */ d(rc, { editor: n.editor })
}, fn = "cta-banner", Ve = re(fn);
function ac({ attrs: n, selected: e }) {
  const { t } = ee("theme-marketplace-core");
  return /* @__PURE__ */ d(
    te,
    {
      contentEditable: !1,
      className: "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " + (e ? "ring-2 ring-blue-500/60" : ""),
      children: /* @__PURE__ */ f("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ d(ir, { className: "h-5 w-5 shrink-0 text-blue-500" }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d("p", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: t("blocks.ctaBanner.title") }),
          /* @__PURE__ */ d("p", { className: "text-sm text-surface-900 dark:text-surface-50 truncate", children: n.headline || t("blocks.ctaBanner.empty") })
        ] })
      ] })
    }
  );
}
function sc({ editor: n }) {
  const e = n.getAttributes(Ve), t = { ...kt, ...e.attrs ?? {} };
  function r(i) {
    n.chain().updateAttributes(Ve, { attrs: { ...t, ...i } }).run();
  }
  return /* @__PURE__ */ f("div", { className: "space-y-3", children: [
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Headline" }),
      /* @__PURE__ */ d("textarea", { className: "input min-h-[60px]", value: t.headline, onChange: (i) => r({ headline: i.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ d("label", { className: "label", children: "Body" }),
      /* @__PURE__ */ d("textarea", { className: "input min-h-[60px]", value: t.body, onChange: (i) => r({ body: i.target.value }) })
    ] }),
    /* @__PURE__ */ f("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Primary CTA label" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.primaryCta.label, onChange: (i) => r({ primaryCta: { ...t.primaryCta, label: i.target.value } }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Primary CTA URL" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.primaryCta.href, onChange: (i) => r({ primaryCta: { ...t.primaryCta, href: i.target.value } }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Secondary CTA label" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.secondaryCta.label, onChange: (i) => r({ secondaryCta: { ...t.secondaryCta, label: i.target.value } }) })
      ] }),
      /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ d("label", { className: "label", children: "Secondary CTA URL" }),
        /* @__PURE__ */ d("input", { className: "input", value: t.secondaryCta.href, onChange: (i) => r({ secondaryCta: { ...t.secondaryCta, href: i.target.value } }) })
      ] })
    ] })
  ] });
}
const lc = ne({
  subId: fn,
  defaultAttrs: kt,
  view: ac
}), cc = {
  id: `marketplace-core/${fn}`,
  nodeName: Ve,
  titleKey: "blocks.ctaBanner.title",
  namespace: "theme-marketplace-core",
  icon: ir,
  category: "layout",
  extensions: [lc],
  insert: (n) => {
    n.focus().insertContent({ type: Ve, attrs: { attrs: kt } }).run();
  },
  isActive: (n) => n.isActive(Ve),
  inspector: (n) => /* @__PURE__ */ d(sc, { editor: n.editor })
}, dc = [
  `<div data-cms-block="marketplace-core/header-buttons" data-attrs="${Me(Xe)}"></div>`,
  `<div data-cms-block="marketplace-core/gallery" data-attrs="${Me(Qe)}"></div>`,
  `<div data-cms-block="marketplace-core/specs" data-attrs="${Me(Ze)}"></div>`,
  `<div data-cms-block="marketplace-core/features" data-attrs="${Me(et)}"></div>`,
  "",
  "## Description",
  "",
  "Write the long-form description of your theme or plugin here. Markdown is supported.",
  ""
].join(`

`), yc = {
  id: "marketplace-core",
  name: "Marketplace Core",
  version: "1.3.2",
  description: "App-store style theme for listing themes / plugins. Modern Corporate aesthetic with ambient shadows and rounded XL corners.",
  scssEntry: "theme.css",
  cssText: yn,
  i18n: { en: Se, fr: Ti, de: Oi, es: Ri, nl: $i, pt: Bi, ko: zi },
  defaultPostMarkdown: { post: dc },
  settings: {
    navLabelKey: "title",
    defaultConfig: ie,
    component: Io
  },
  compileCss: (n) => ko(yn, n.style),
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: "webp",
    quality: 82,
    formats: {
      small: { width: 480, height: 300, fit: "cover" },
      medium: { width: 800, height: 500, fit: "cover" },
      large: { width: 1600, height: 1e3, fit: "cover" }
    },
    defaultFormat: "medium"
  },
  templates: {
    base: Ni,
    home: Ci,
    single: Si,
    category: Ai,
    author: Mi,
    notFound: Ii
  },
  blocks: [
    // Product blocks — used on single product pages.
    Al,
    Ol,
    zl,
    Ul,
    // Landing blocks — used on home / about / marketing pages
    // (added in v1.3.0).
    Wl,
    Xl,
    tc,
    oc,
    cc
  ],
  register(n) {
    n.addFilter("post.html.body", (e, t, r) => {
      var l;
      const i = r, o = (((l = i == null ? void 0 : i.settings) == null ? void 0 : l.language) || "en").toLowerCase().split("-")[0], a = K.getResource(o, "theme-marketplace-core", "publicBaked.codeBlock.copy") ?? "Copy", s = K.getResource(o, "theme-marketplace-core", "publicBaked.codeBlock.copied") ?? "Copied";
      return yo(e, a, s);
    }), n.addFilter("post.template.props", (e, t, r) => {
      const i = r, o = t;
      if (o.heroMediaId || !o.primaryTermId) return e;
      const a = pc(i, o.id, o.primaryTermId);
      return {
        ...e,
        docSiblings: a
      };
    });
  }
};
function pc(n, e, t) {
  if (!(n != null && n.posts)) return [];
  const r = n.terms.find((i) => i.id === t);
  return r ? n.posts.filter(
    (i) => i.type === "post" && i.primaryTermId === t && (i.id === e || i.status === "online")
  ).sort((i, o) => {
    var l, c, p, u;
    const a = ((c = (l = i.createdAt) == null ? void 0 : l.toMillis) == null ? void 0 : c.call(l)) ?? 0, s = ((u = (p = o.createdAt) == null ? void 0 : p.toMillis) == null ? void 0 : u.call(p)) ?? 0;
    return a - s;
  }).map((i) => ({
    id: i.id,
    title: i.title,
    url: `${r.slug}/${i.slug}.html`
  })) : [];
}
export {
  yc as default
};
