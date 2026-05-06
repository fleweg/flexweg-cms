// Corporate theme config shape. Stored at
// `settings.themeConfigs.corporate` in Firestore; merged with these
// defaults by ThemeSettingsRoute before being handed to the settings
// page.
//
// Two home composition modes coexist:
//
//   1. Static-page mode (advanced) — the admin sets
//      `settings.homeMode = "static-page"` and points the home at a
//      regular `page` whose markdown body is composed of theme blocks
//      (hero-overlay, services-grid, testimonials, cta-banner, …).
//      The HomeTemplate dumps the rendered body verbatim.
//
//   2. Out-of-the-box mode (default) — the home renders the hero
//      configured below, followed by the latest posts grid. No
//      static page wiring required, so a fresh install of the theme
//      already looks like the mockup.
//
// `home.hero` is a HeroOverlayAttrs payload reused as-is by the
// HomeTemplate calling renderHeroOverlay() at publish time. Default
// values mirror the home_desktop mockup so the first publish reads
// like a credible vitrine site.

import { DEFAULT_STYLE, type StyleOverrides } from "./style";
import type { HeroOverlayAttrs } from "./blocks/heroOverlay/render";
import type { Testimonial, TestimonialsVariant } from "./blocks/testimonials/render";

// Featured-posts source: either every online post (newest first) or
// a single category. The settings page surfaces a category dropdown
// when `category` is selected; otherwise the dropdown is hidden.
export type FeaturedPostsMode = "all" | "category";

export interface CorporateFeaturedPostsConfig {
  enabled: boolean;
  // Section heading + lede above the posts grid.
  title: string;
  subtitle: string;
  // Source filter.
  mode: FeaturedPostsMode;
  // Term id to filter by when `mode === "category"`. Empty = falls
  // back to "all" at render time so the section never renders empty
  // due to a stale id.
  categoryId: string;
  // Cards rendered. Defaults to 3 — matches the mockup's bento.
  count: number;
}

export interface CorporateTestimonialsHomeConfig {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  // Visual variant — same shape as the testimonials block (glass on
  // a light background, or a primary-colored navy section).
  variant: TestimonialsVariant;
  items: Testimonial[];
}

export interface CorporateHomeConfig {
  // Toggle the entire hero. False = HomeTemplate skips the hero and
  // renders the next section directly under the header.
  showHero: boolean;
  // Hero attrs — exact same shape as the corporate/hero-overlay
  // block so renderHeroOverlay() can consume it verbatim.
  hero: HeroOverlayAttrs;
  // Featured posts grid below the hero. Editable from the Home tab.
  featuredPosts: CorporateFeaturedPostsConfig;
  // Testimonials section below the featured posts. Editable from
  // the Home tab; defaults seed three placeholder testimonials so
  // the home looks credible on first render.
  testimonials: CorporateTestimonialsHomeConfig;
}

// Default Unsplash image used for the hero out of the box. Editors
// almost certainly want to swap it for their own; the URL is stable
// (Unsplash hosts it indefinitely) and the corporate-office subject
// matter aligns with the SaaS / vitrine aesthetic.
const DEFAULT_HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80";

export const DEFAULT_CORPORATE_HOME: CorporateHomeConfig = {
  showHero: true,
  hero: {
    imageUrl: DEFAULT_HERO_IMAGE_URL,
    imageAlt: "Modern corporate office",
    eyebrow: "Innovation & reliability",
    title: "Propel your business toward the future",
    subtitle:
      "Strategic, tailor-made solutions for SMEs seeking digital growth and operational excellence.",
    primaryCtaLabel: "Get started",
    primaryCtaHref: "/contact.html",
    secondaryCtaLabel: "See our solutions",
    secondaryCtaHref: "#services",
  },
  featuredPosts: {
    enabled: true,
    title: "Our latest insights",
    subtitle:
      "Stay ahead of the curve with strategic perspectives from our team of experts.",
    mode: "all",
    categoryId: "",
    count: 3,
  },
  testimonials: {
    enabled: true,
    eyebrow: "",
    title: "Trusted by industry leaders",
    subtitle: "More than 500 businesses accelerate their growth with us.",
    variant: "glass",
    // Placeholder content — editor replaces or removes from the
    // Home tab. The first publish reads as credible social proof
    // even before the editor curates real testimonials.
    items: [
      {
        rating: 5,
        quote:
          "Their platform completely changed our customer-service approach. We cut operational costs by 30% in six months.",
        authorName: "Jean-Pierre Dubois",
        authorTitle: "Operations Director, LogisTech",
        authorAvatarUrl: "",
        authorAvatarAlt: "",
      },
      {
        rating: 5,
        quote:
          "Exceptional strategic guidance — they truly understand the challenges modern SMEs face. An indispensable partner.",
        authorName: "Marie Leroux",
        authorTitle: "Founder, GreenPulse",
        authorAvatarUrl: "",
        authorAvatarAlt: "",
      },
      {
        rating: 5,
        quote:
          "The cloud transition was surprisingly fluid. They handled the technical complexity, letting us focus on our core business.",
        authorName: "Thomas Martin",
        authorTitle: "CTO, DataSecure",
        authorAvatarUrl: "",
        authorAvatarAlt: "",
      },
    ],
  },
};

// Single-post page (SingleTemplate) sidebar toggles. Lets admins
// keep the layout terse — opt-in for the author bio (off by
// default — many corporate sites skip per-author bylines on
// individual posts) and opt-out for the Popular articles card.
export interface CorporateSingleConfig {
  // Render the author bio card in the right sidebar. Off by default
  // — only flip on when the site has rich author profiles worth
  // surfacing (display name + bio + socials).
  showAuthorBio: boolean;
  // Render the popular articles card in the right sidebar. On by
  // default; backed by /data/posts.json and posts-loader.js.
  showPopularArticles: boolean;
  // Heading rendered above the popular-articles list. Empty falls
  // back to the localised default ("Popular articles").
  popularArticlesTitle: string;
  // Render the navy CTA card in the right sidebar. On by default —
  // the lead-gen flow benefits from a recurring contact prompt on
  // every post page.
  showCta: boolean;
  // Card heading. Empty falls back to either `settings.title` (when
  // `settings.description` is set) or the localised "Get Started".
  ctaTitle: string;
  // Button label. Empty falls back to the localised "Get Started".
  ctaButtonLabel: string;
  // Button click target. Empty falls back to "/contact.html" (the
  // theme's hardcoded contact-page convention).
  ctaButtonHref: string;
}

export interface CorporateThemeConfig {
  // Whether a logo has been uploaded. The header swaps the text
  // wordmark for the image when this is true.
  logoEnabled: boolean;
  // Milliseconds since epoch of the last logo upload — used as a
  // cache-bust query in the public-side logo URL.
  logoUpdatedAt: number;
  // CSS variable overrides + chosen Google Font. Empty / defaults
  // leave the baseline CSS untouched; custom values produce a
  // regenerated `theme-assets/corporate.css` with an override `:root`
  // block appended and the right Google Fonts URL imported.
  style: StyleOverrides;
  // Out-of-the-box home configuration. Consumed by HomeTemplate when
  // no static page is wired (the canonical mode). When the user
  // switches to homeMode === "static-page" the home config is
  // ignored — the page body becomes the source of truth.
  home: CorporateHomeConfig;
  // Single-post sidebar toggles. Consumed by SingleTemplate.
  single: CorporateSingleConfig;
}

export const DEFAULT_CORPORATE_SINGLE: CorporateSingleConfig = {
  // Off by default — many corporate / vitrine sites don't surface
  // per-author bylines individually. Flip on when authors have full
  // profiles (display name + bio + socials) worth showing.
  showAuthorBio: false,
  showPopularArticles: true,
  // Empty = SingleTemplate falls back to the localised default
  // (`publicBaked.popularArticles`).
  popularArticlesTitle: "",
  showCta: true,
  // Empty = the template falls back to either site.settings.title or
  // the localised "Get Started" (depending on whether
  // settings.description is set).
  ctaTitle: "",
  ctaButtonLabel: "",
  ctaButtonHref: "",
};

export const DEFAULT_CORPORATE_CONFIG: CorporateThemeConfig = {
  logoEnabled: false,
  logoUpdatedAt: 0,
  style: DEFAULT_STYLE,
  home: DEFAULT_CORPORATE_HOME,
  single: DEFAULT_CORPORATE_SINGLE,
};
