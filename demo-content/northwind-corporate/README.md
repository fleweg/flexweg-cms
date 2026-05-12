# Northwind Consulting — corporate theme demo content

A complete demo site for the **corporate** theme: 4 fully-composed pages (home, services, about, contact) using the theme's 10 lead-gen blocks, plus 5 long-form blog posts / case studies. Written in English. Ready to import via the **Flexweg Import** plugin.

Designed as a realistic B2B vitrine site for a fictional sustainability consultancy, **Northwind Consulting**. Demonstrates how the corporate theme's blocks compose into a complete marketing site rather than a simple blog.

## What's in it

```
demo-content/northwind-corporate/
├── README.md
├── images/                                       7 topic-matched hero photos
├── page-home.md                                  ↘
├── page-services.md                              │  4 block-composed pages
├── page-about.md                                 │  (home, services, about, contact)
├── page-contact.md                              ↗
├── 01-welcome-northwind-insights.md             ↘
├── 02-five-scope-3-mistakes.md                   │  5 blog posts / case studies
├── 03-csrd-mid-market-guide.md                   │  (800–2000 words each)
├── 04-case-study-mercato-materials.md            │
└── 05-net-zero-pledges-falling-apart.md         ↗
```

### Block compositions per page

| Page | Blocks used |
|---|---|
| **Home** | hero-overlay · services-grid (3 services) · stats-grid (4 stats) · testimonials (3 quotes, glass variant) · cta-banner (navy variant) |
| **Services** | hero-split · feature-stack (3 detailed services, alternating layout) · cta-banner (indigo variant) |
| **About** | hero-split · stats-grid · testimonials (2 quotes) · cta-banner |
| **Contact** | hero-overlay · contact-info (address, phone, email, socials) · contact-form (mailto mode) |

Each block carries a base64-encoded attrs payload in the markdown body. The corporate theme's `post.html.body` filter expands the markers into rendered HTML at publish time — no extra setup required.

### Categories + tag set (blog posts only)

| Category | Posts |
|---|---|
| **Insights** | Welcome to Northwind Insights |
| **Methodology** | Five Scope 3 mistakes |
| **Regulation** | CSRD reporting guide |
| **Case Studies** | Mercato Materials (Scope 1 reduction) |
| **Editorial** | Why most net-zero pledges will fail |

Tags cover: `intro`, `editorial`, `scope-3`, `ghg-protocol`, `methodology`, `measurement`, `csrd`, `regulation`, `esg-reporting`, `europe`, `case-study`, `manufacturing`, `scope-1`, `reduction`, `net-zero`, `sbti`, `credibility`.

### Author

All posts signed by `team@northwind-consulting.example` (fictional). The about page describes Northwind as a Berlin-based specialist consultancy founded 2018, serving mid-market industrials.

## How to use

1. **Make sure the corporate theme is active** at `/admin/#/themes`
2. **Enable Flexweg Import** in `/admin/#/plugins`
3. Open `/admin/#/settings/plugin/flexweg-import` → Drag and drop mode
4. Drag the whole `northwind-corporate/` folder (including `images/`) into the drop zone
5. Click **Scan** → 5 posts + 4 pages, 5 categories, ~17 tags, 7 images
6. Pick a status mode (recommended: **Always import as draft** so you can review before going live)
7. Click **Confirm import**
8. Review entities in `/admin/#/pages` and `/admin/#/posts`

### Setting up the homepage

After import, **set `page-home` as the static home**:

1. `/admin/#/settings/general` → Home settings
2. Mode: **Static page**
3. Home page: select **Northwind Consulting — Sustainability work for mid-market industrials**
4. Save

Then bulk-publish the 4 pages and the 5 blog posts. The home page should now render with the full block layout.

### Configuring the contact form

The contact page is pre-configured in **mailto** mode pointing at `team@northwind-consulting.example`. To switch to a real endpoint (Formspree, your own backend, etc.):

1. Open `page-contact.md` in the editor
2. Click on the contact-form block to open its inspector
3. Switch mode to **endpoint**
4. Paste your endpoint URL
5. Save and republish

## Images

The 7 images in `images/` are **actual relevant photos** sourced from [Unsplash](https://unsplash.com/) under the [Unsplash License](https://unsplash.com/license) (free for commercial and non-commercial use, no attribution required). Each photo was hand-picked and verified to match its post or page subject — wind turbines for the home hero of a sustainability firm, an EU Parliament shot for the CSRD regulation piece, an actual factory production line for the manufacturing case study, etc.

```
01-home-hero.jpg               home + contact pages (wind turbines + desert)
02-about-team.jpg              services + about pages (creative office space)
03-welcome-team.jpg            welcome post (team around a meeting table)
04-scope3-supply-chain.jpg     Scope 3 post (warehouse with stacked pallets)
05-csrd-europe.jpg             CSRD post (European Parliament building + EU flag)
06-case-manufacturing.jpg      case study (real production line with workers)
07-netzero-solar.jpg           net-zero post (solar panel farm under blue sky)
```

To swap any image, drop a replacement at the same filename. Corporate theme uses wide aspect ratios for hero blocks; 1600 px wide minimum, 1920 px ideal. The bundled photos are 1600–1920 px wide.

## A note on the content

The pages and posts read like a real boutique consultancy site because that's what makes a useful demo. **Northwind Consulting** is fictional, as are the author bylines, case study clients (Mercato Materials, Aalborg Industries, Northgate Foods, Pacific Steel Group, Verge Materials), and the testimonial quotes.

The factual content about sustainability frameworks (GHG Protocol, CSRD, SBTi, Scope 3 methodology) is broadly accurate as of writing date but **has not been individually fact-checked for this demo**. Treat the editorial opinions in the net-zero piece as plausible analyst perspective rather than received truth. If you intend to publish any of this for a real audience, give each piece a fact-check pass first.

## Customising before import

Quick search-and-replace targets to make this content your own:

- Author email: `team@northwind-consulting.example` → your real CMS user email
- Company name: `Northwind Consulting` (appears throughout)
- Office address: `Friedrichstraße 68, 10117 Berlin, Germany` (in contact-info block)
- Phone: `+49 30 1234 5678`
- Mailto address in the contact form: `team@northwind-consulting.example`
- Block-level URLs: every CTA links to `/contact.html` — adjust as needed
- Publish dates: posts have `publishedAt` April–May 2026; pages have no publish date by default
