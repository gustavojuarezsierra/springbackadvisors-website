# Springback Website — Changelog

Full history of every change made to the site, in order. This log is included with every packaged delivery from this point forward.

---

## Foundation — Multi-Page Site Build
- Converted the original single-page site into a 17-page architecture: `index.html`, `about.html`, `pricing.html`, `contact.html`, and 13 individual service pages
- Built shared `header.html` / `footer.html` partials so nav/footer changes only need to happen in one place
- Set up a Python build script (`build_all.py` + generator modules) that assembles every page from shared partials + page-specific content
- Added per-page SEO: unique titles, meta descriptions, canonical tags, Open Graph tags, one H1 per page, proper heading hierarchy
- Added JSON-LD structured data: Organization + WebSite schema (site-wide), Service + BreadcrumbList (service pages), FAQPage + ItemList (homepage), AboutPage, ContactPage, OfferCatalog (pricing)
- Reordered services with **Managed IT Services (MSP)** as the flagship, all others ranked by relatedness to it
- Merged "SaaS Management" + "Workspace Management" into one service (avoided overlapping/thin content)
- Broadened "Microsoft Dynamics" into "Implementations" (covers Dynamics, Google Workspace, M365, Entra ID)
- Added DNS/domain/registrar scope (Cloudflare, GoDaddy, DNS records) to Cloud Infrastructure service
- Added "Customization" as its own service (folds in Custom Forms & Workflows, WordPress/Shopify customization)
- Added real EN/ES bilingual copy throughout, including MSP flagship rewrite, example technologies per service, and a "don't see what you need? ask us" note on every service page

## Logo & Branding Fixes
- Fixed header/footer logo: was using an incomplete/wrong SVG path
- Replaced with the complete, correct 3-shape logo (wordmark + hummingbird icon + tagline text) from the official brand SVG, mapped to theme CSS variables for light/dark mode

## Technical / Deployment Fixes
- Fixed all internal links from root-relative (`/about.html`) to properly relative paths, so the site works whether deployed at the domain root or in a subfolder (e.g. `/test/`)
- Removed all `index.html` references from every link, canonical tag, and JSON-LD URL site-wide — links now resolve to clean directory URLs (e.g. `springbackadvisors.com/` instead of `.../index.html`)
- Added cache-busting version parameters to `style.css` and `main.js` so browsers can't serve stale cached assets after an update
- Generated `sitemap.xml` (auto-updates to include new pages, including blog posts) and advised on Google Search Console submission/reindexing

## Hero Floating Icon
- Identified the animated hero icon was using a truncated/incomplete path
- Attempted a custom-built connector between the two shapes; found and fixed a winding-direction bug causing visible "holes" at the seams (opposite-wound overlapping shapes cancel out under SVG's fill rule)
- Per your direction, reverted to the original coil/spring icon rather than the newer square icon variant

## Homepage Structure — Multiple Rounds of Reorganization
- Merged "Trusted Platforms" + "Technologies & Platforms We Work With" into a single section, renamed **"Technology We Work With"** to avoid implying it was a service list
- Consolidated Pillars, Philosophy, and How We Work: moved all three in full to the About page; homepage now shows a condensed "Our Approach" section (2×2 card grid + summary paragraph) linking to the full content
- Final homepage section order: Hero → Brand Story → What We Do → Our Approach → Latest Blog + Case Study → Technology We Work With → Why Springback → Investment → FAQ → Contact
- Removed dollar amounts from the homepage "Investment" teaser (kept on the dedicated Pricing page)
- Fixed hero stats: resolved a layout bug (uneven wrapping), briefly restored a 5th "8+ years serving US clients" stat, then removed it again to match the About page's 4-stat layout for consistency
- Swapped hero's second button from "Our Approach" to **"What We Do"** (2 buttons total, reduces decision friction)
- Added, then removed, a standalone "Built For" ICP statement band — ultimately folded into the end of the hero paragraph instead
- Added, then reverted (per your request), an embedded lead-capture form in the homepage Contact section — restored to the simple CTA teaser

## Navigation Fixes
- Fixed a real bug: nav's "Our Approach" link was pointing to the brand-story section instead of the actual "Our Approach" content section
- Renamed the brand-story anchor from `#philosophy` to `#story` to remove the naming collision
- Reordered nav: moved **About** to the first position, removed "Our Approach" from the nav entirely (it's a homepage section, not a standalone page)

## Trust & Positioning Copy
- Added a new FAQ entry: "Will you try to upsell me on things I don't need?" with the concrete "$50 fix vs. $5,000 project" example
- Sharpened "Partners, Not Vendors" wording from "even if it's not what we sell" to **"even if it costs us the sale"**
- Added the "Built For" ICP statement (growing businesses, corporations, and government institutions across Mexico and the US) — folded into the hero paragraph

## Case Study
- Added a Microsoft Dynamics 365 "building in public" case study — homepage teaser card + full detail section on the Implementations service page
- Written in past tense per your direction, but deliberately factual/general (no invented metrics or outcomes) since the actual sandbox implementation isn't finished yet — ready to be updated with real specifics once it is

## Blog System
- Built a full blog architecture: `/blog/` index page + individual article pages, matching the site's shared header/footer/theme
- **Correction made**: initial build used hardcoded Python data instead of actual Markdown files, which didn't match what was agreed in a prior conversation — rebuilt properly using real `.md` files with frontmatter (title, date, category, meta description, excerpt) as the source of truth, parsed at build time
- Published first article: "What Is a Managed Service Provider (MSP), and Does Your Business Actually Need One?" (EN/ES)
- Added "Blog" to nav (header + footer)
- Added a "Recent Posts" widget to article pages (auto-populates from other posts, gracefully shows nothing when there's only one post)
- Added a dynamic "Latest From the Blog" card to the homepage (auto-updates to whichever post is newest)

## Lead Generation — Phase 1 (CTA Sharpening)
- Renamed hero primary button and About page CTA to **"Book a Free Discovery Call"**
- Renamed all 13 service-page sidebar CTAs to **"Free Discovery Call"**
- Left the persistent nav CTA as "Let's Talk" (generic always-available access point, not a first-touch offer)
- Left Pricing page tier buttons ("Get Started" / "Request Quote") unchanged — they're correctly transactional for paid tiers, not the free-call offer
- Added a one-line discovery-call explanation to the Contact page intro so the promise made by the buttons is actually delivered on

## Competitive Research
- Diagnosed a competitor site (Silverback Consulting) and produced 6 prioritized recommendations: ICP statement, blog/content marketing, embedded lead magnet, segmented intake funnels, explainer video, trust badges
- Researched current (2026) live-chat tool pricing (Tawk.to, Crisp, Tidio) — recommended Tawk.to as a genuinely free starting point

## Package 2 — Lead Generation: CTA Sharpening + First Gated Resource
- **Phase 1 (CTA sharpening)**: renamed hero primary button and About page CTA to "Book a Free Discovery Call"; renamed all 13 service-page sidebar CTAs to "Free Discovery Call"; added a one-line discovery-call explanation to the Contact page intro so the promise is actually delivered on; left the persistent nav CTA and Pricing page tier buttons unchanged (reasoning: nav is a generic access point, pricing buttons are correctly transactional for paid tiers)
- **Phase 2 (downloadable resource)**: researched and rated 5 candidate topics by real search-demand/competition signals; built "How to Choose a Managed Service Provider" — an 18-question, 6-category checklist as a branded PDF (reportlab-generated, verified by text-extraction and visual render)
- **Email gate**: built a reusable gated-download mechanism (any future resource just needs the same form class + a data attribute — no new code required per resource); replaced the original ungated direct-download link with this email-gated version, per your decision that email capture is worth the small added friction
- Added `data-i18n-placeholder` support to the translation engine (needed for the gated form's email field to translate correctly)
- Diagnosed a competitor site (Silverback Consulting) for adoptable ideas; researched and rated live-chat tool pricing (Tawk.to recommended — genuinely free)
- Fixed a real discrepancy: homepage hero showed 5 stats, About page showed 4 — removed "Markets Served" from the homepage to match About's 4-stat version
- Delivered (separately from the site): an MSP service-delivery playbook (internal operational reference, not site content) and a fully rewritten TODO list with a "benefit to visitor / benefit to Springback" filter applied to every open item
- Ranked 3 candidate interactive-quiz topics by search-demand signal for future Phase 3 work (not yet built)

## Still Open
See `TODO.md` for the full current list with benefit-to-visitor / benefit-to-Springback reasoning for each item.

## Package 5 — Quiz Fixes + Business Central Specificity
- Fixed a real bug on the security quiz: the "Email Me My Results" capture promised automated email delivery that the underlying mechanism (Web3Forms notification) doesn't actually provide. Rewrote the copy to be honest — "Request a Follow-Up" — matching what actually happens (a personal follow-up from Springback, not an automated email). Fixed the same false promise in the shared form-handler code so it can't resurface on any future gated form.
- Expanded the security quiz from 5 to 10 questions (added: phishing/social engineering training, patch management cadence, Wi-Fi network segmentation, third-party vendor access tracking, incident response readiness) and rescaled the scoring/result bands proportionally (0–8 / 9–20 / 21–40 out of a new max of 40, computed dynamically rather than hardcoded)
- Read and OCR'd a 10-page PDF (a prior Gemini research conversation about Microsoft Dynamics 365) to ground a real decision: Business Central vs. D365 Sales/Customer Service as the specific implementation focus
- Researched current adoption data to support the recommendation: Business Central is Microsoft's fastest-growing Dynamics 365 product (55,000+ customers), riding a real forced-migration wave off Dynamics NAV (NAV 2016 support already ended; NAV 2018 ends January 2028) — chosen over the CRM side specifically because it fits Springback's existing operations-focused service lineup better and avoids direct competition with Salesforce
- Updated the Implementations service page, case study (homepage + service page), homepage badge, and examples list to all specifically reference Business Central rather than generic "Dynamics 365"
- Added "Microsoft Dynamics 365 certification decision (MB-800 vs. MB-280)" to the TODO list as a personal/business decision, separate from website content

## Package 4 — Blog Search + Cybersecurity Quiz
- Built blog search: Fuse.js-powered, works on both the blog index page (filters the card grid live) and every article page (dropdown results) — caught and fixed a subfolder-deployment path bug in the dynamically-generated result links before it shipped
- Built the "How Secure Is Your Business?" cybersecurity self-assessment quiz — 5 questions, instant client-side scoring, 3 tailored result bands, fully bilingual (caught and fixed a real bug where questions weren't wired into the translation system before it shipped)
- Added an optional, skippable post-result email capture to the quiz — reused and generalized the existing gated-form mechanism (download step is now conditional, so the same code handles both "capture + download a file" and "capture only")
- Added a "🎁 Free Resource Inside" chip (MSP) and "🔒 Free Assessment Inside" chip (Cybersecurity) to their respective homepage service cards
- Added a "Not ready to talk yet? Take our free security assessment first" line to the Contact page
- Compiled and queued: 2 remaining quiz topic ideas, 4 remaining checklist topic ideas, and 5 ranked future blog topic ideas — all in `TODO.md` with the same search-demand-based reasoning used for the resources that were actually built
- Added "Create social media accounts" to the TODO list with platform recommendations (LinkedIn priority #1, Facebook #2 for the Mexico market) and an honest breakdown of what can/can't be automated for posting

## Package 3 — Homepage Visibility for the Checklist
- Added a "🎁 Free Resource Inside" chip to the MSP service card on the homepage, linking through to the MSP page (not a direct homepage download) — keeps the resource matched to visitor intent while still giving it homepage visibility
- Confirmed and documented: the checklist email-gate currently only does an instant client-side download + a lead notification to Springback — no automated email-to-visitor with the PDF, no follow-up sequence. Logged as a new TODO rather than silently assumed to exist.


## V2 (in progress) — Step 1: Homepage
- New `assets/v2.css` override layer (loads after style.css) using Brand Manual palette; new `assets/v2.js` gentle scroll reveal (respects reduced-motion).
- Hero: padlock + password-bar artwork with translucent glass squares and slow shine; stat cards; gradient CTA.
- Cards: rounded bordered cards, Managed IT featured as gradient card; partners section as gradient band.
- Only index.html links v2.css so far; inner pages convert one by one.
- Step 1b: homepage rebuilt to the template layout (platforms band, About block with tabs, centered service cards, Our Approach list, free-resources block replacing pricing cards with "See Full Pricing" kept, blog/case-study cards with gradient thumbs, CTA band). Platforms wording changed to experience-only (no partnership/certification claim). Glass squares: sweep + synced glow + pointer parallax.
- Step 1c: hero artwork replaced with "connected hub": glass spring core + 5 clickable glass cards (CRM+AI, AI agents, Websites, Managed IT, Cybersecurity) linked to existing service pages (to be re-pointed to landing pages), pulses along lines, hover/focus labels (always visible on touch/mobile), reduced-motion safe.
- Step 1d: hero artwork changed to a combined glossy scene (browser+shield, server stack, CRM card, chat bubbles, brand spring, glass squares) matching the original illustration style; hub removed from hero.
- Step 1e (decision, no code): owner generated two Gemini 3D hero images (laptop version recommended for hero, servers version for About/Approach); placement awaiting go-ahead. Interim vector scene remains in the hero.
- Strategy session: five campaigns defined (website fixes, co-managed IT, CRM + AI, AI agents and automation, public-sector cybersecurity review); free-offer qualification, weekly cap and tracking plan documented in `CAMPAIGN-STRATEGY.md`.

## Project migration kit (Nov 11, 2026)
- Created the Claude Project kit: `PROJECT-INSTRUCTIONS.md`, `PROJECT-BRIEF.md`, `CAMPAIGN-STRATEGY.md`, `TODO.md`, this changelog, `README-START-HERE.md`, tools, and three proposed skills.
- New tools (because the Python generator was lost): `tools/validate_site.py` (links, i18n parity and coverage, h1, meta, JSON-LD, sitemap) and `tools/sync_chrome.py` (propagates nav and footer to all pages).
- Fixed: blog article was missing the `blog.breadcrumb` i18n key in EN and ES (found by the validator). Validator now reports 0 errors across 20 pages.
- Archived the V1 stable package at `archive/springback-website-v1-stable.zip`; the working copy is `site/`.

---

## V2 Step 2 — Theme refresh (Nov 12, 2026)
Styling from the owner's ChatGPT/Gemini mockups, adapted to the existing page structure (no sections removed or reordered).
- **Hero:** 4 glass tiles linked to their service pages (AI-Powered Intelligence → AI Solutions, Systems & Integrations → Integrations, Cybersecurity Advisory → Cybersecurity, Managed IT & Advisory → MSP), EN/ES; 2×2 on mobile.
- **Hero artwork:** temporary steel-coil illustration (`assets/img/hero-coil-temp.webp`, 50 KB, cut from the mockup) shown in the light theme; the dark theme keeps the interim vector scene until the transparent render arrives. Loads eagerly (largest element), bilingual alt text.
- **Type:** hero headline second line in brand gradient; uppercase eyebrow labels with a hairline on every section and inner-page hero.
- **Buttons:** filled CTA uses brand blues `#1A79E2 → #0057C8` (white text passes WCAG AA in both themes), pill shape + arrow; secondary link with circled arrow; header "Let's Talk" as an outline pill.
- **Colors:** dark-theme accent set to the manual's `#38A8F0`; platforms band, featured cards and highlight gradients moved to brand blues (removed off-palette purple).
- **Icons:** all emoji icons on the homepage (13 service cards, approach list, free resources, About points) replaced with consistent line icons in the accent color.
- **Cards:** service cards left-aligned glass style; hero stats as equal glass tiles; blog/case-study cards with a category pill on the thumbnail.
- **About split:** vertical hairline between artwork and text (horizontal on mobile).
- **CTA band:** horizontal glass panel, text left and button right.
- **Footer:** LinkedIn/YouTube/Instagram/Facebook icon block added as an HTML comment, hidden until real profile URLs are provided; synced to all pages.
- **Site-wide:** all 19 inner pages now load `v2.css` + `v2.js` (they pick up colors, buttons, labels, cards and footer).
- **i18n:** `main.js` supports `data-i18n-alt` for translated image alt text; `validate_site.py` checks those keys too.
- Cache-busting bumped to `?v=2.2`. Validator: 0 errors, 0 warnings.

## V2 Step 2b — Body font (Nov 12, 2026)
- Owner decision: **Poppins** (300–600) for body text and the menu; **Outfit** stays on all headings, hero title and stats; Lora italic stays on the tagline. Poppins added to the Google Fonts link on all 20 pages; `v2.css` bumped to `?v=2.3`.

## V2 Step 2c — Menu, glass tiles, buttons (Nov 12, 2026)
- Menu links and "Let's Talk" in title case (no all-caps), Poppins 500.
- Hero tiles: frosted blue "mist" fill with a light highlight top-left and a shining gradient edge; dark-theme equivalent.
- Primary button: brighter left-to-right blue gradient with top sheen and glow; real SVG arrow; text Poppins 500 at 1rem. Gradient starts at `#1A79E2` (not cyan) so white text stays WCAG AA.
- Secondary link: darker text, 40 px circle with a centred thin SVG arrow.
- `v2.css` bumped to `?v=2.4`. Validator: 0 errors.

## V2 Step 2d — Homepage package 003-007 (Nov 13, 2026)
- 003: Stats (15+ / 8+ / 13 / EN/ES) moved out of the hero into a centered band right below it: line icon + number + label, thin dividers; 2x2 grid on mobile.
- 004: "Platforms we work with" is now a scrolling strip of 7 platforms (HubSpot, Microsoft Dynamics, Claude / Anthropic, ChatGPT / OpenAI, Make.com, n8n, AWS). Each shows a small white logo plus the name; on hover the logo shows its real colors on a white tile and the strip pauses. Reduced-motion: static wrapped row. Logos in `assets/img/logos/`. Azure and Cloudflare removed from the strip. Experience-only note kept. New i18n keys `par.ai`, `par.auto` (EN/ES).
- 005: Badges cut to one row: Microsoft 365, Google Workspace, Zapier, WordPress, Shopify, Stripe, Mercado Pago.
- 006: About tabs (Our Story / Why Us / Our Approach) restyled as pill buttons; active tab filled #0057c8 (AA contrast).
- 007: FAQ accordion items use the page background (border kept). Applies to every page using v2.css.
- Brief rule updated by owner decision: small official logos allowed next to platform names, experience-only wording, no partnership implied.
- v2.css cache-bust bumped to 2.5. Validator: 0 errors.

## Compliance package 001-006 (Nov 13, 2026)
- 001: New **Privacy Notice** page (`privacy.html`, EN/ES), written for Mexico's 2025 LFPDPPP plus US basics (CalOPPA): responsible party (Gustavo Juárez Sierra, operating as Springback Technology Advisors, Argentina 124, Cd. Mante, Tamaulipas), data per form, primary vs consent-based purposes, processors (Web3Forms, email, hosting, Google Analytics if accepted), cookies section (`#cookies`), retention, ARCO rights via privacy@springbackadvisors.com, security, minors, changes. WebPage + BreadcrumbList JSON-LD. **Needs review by a Mexican attorney before production.**
- 002: Short privacy note with link under all 3 forms (contact, MSP checklist, security assessment follow-up).
- 003: New **Terms of Use** page (`terms.html`, EN/ES): information not advice, services only under written agreement (any price shown is a reference), free resources as-is, platform names = experience only, IP, acceptable use, liability, Mexican law.
- 004: **Cookie consent.** Google Analytics (G-5C07PH8H24) was loading on every page without consent; removed from all 20 pages. It now loads only after "Accept analytics" (banner with equal Reject/Accept buttons, non-blocking, EN/ES, AA contrast both themes). Choice stored 12 months; "Cookie settings" in the footer reopens it; rejecting deletes `_ga` cookies; Global Privacy Control is honored as a refusal. Logic lives in `main.js` (no extra file, no third-party consent tool).
- 005: **Self-hosted fonts** (`assets/fonts/`, latin subset, `font-display:swap`, Poppins 400 + Outfit preloaded). Removes the Google Fonts request (visitor IPs no longer sent to Google) and 2 extra connections. Only weights in use are shipped (Lora italic only). Fuse.js self-hosted in `assets/vendor/` (no cdnjs).
- 006: Footer legal row (Privacy Notice · Terms of Use · Cookies · Cookie settings) synced to all 22 pages; privacy and terms added to `sitemap.xml`.
- Also: removed the first-visit IP-geolocation calls (ipwho.is, ipapi.co, country.is) that sent visitor IPs to 3 third parties and delayed the language switch; language now comes from the saved choice or the browser language (Spanish browsers get Spanish). Fixed root-relative paths that broke in `/test/`: MSP checklist download URL and the blog search index/result links. Shared strings now live in `TC` in `main.js` (page `T` overrides it); `validate_site.py` reads `TC` too. Cache-bust: style.css 3.0, v2.css 2.6, main.js 2.3, blog-search.js 1.1 (contact.html had a stale v2.css 2.4).
- Checked in Chromium under `/test/`: no third-party requests before consent, GA loads only after Accept, reject clears cookies, banner reopens, ES/EN switching, blog search works, no 404s. Validator: 0 errors, 0 warnings.

---

## Versioning (from Nov 18, 2026)
Each package is now a version, MAJOR.MINOR.PATCH (MAJOR = redesign or structural change, MINOR = normal package, PATCH = quick fixes). Each version gets a heading here, a Git tag, a zip named `springback-site-vX.Y.Z.zip`, and a hidden `<!-- Springback site vX.Y.Z -->` comment at the top of every page. **v0.9.0** = the site as of the Compliance package above. v1.0.0 is reserved for the official launch.

## v0.10.0 (Nov 18, 2026)
- 001: Experience strip redesigned as a contained panel: soft blue gradient from the theme blues (light and dark), thin border, shadow; numbers 1.55rem → 2rem, icons 38 → 42px, labels in normal case and larger. Data and EN/ES text unchanged; mobile 2×2 kept.
- 002: Less space between the hero and the strip (hero bottom padding 80px → 24px; strip top padding 34px → 8px).
- 003: Google Antigravity added to the platforms logo strip after ChatGPT / OpenAI, in both copies of the loop (`assets/img/logos/antigravity.svg`, internal IDs renamed). Reuses the "AI Agents & Assistants" / "Agentes y asistentes de IA" label. Means experience with the tool, not a partnership.
- 004: `v2.css` cache version 2.6 → 2.7 on all pages; version comment added to every page.
- Preview: GitHub Pages (Actions workflow publishes `site/` on every push to `main`). Repo is public only until launch.

## v0.11.0 (Nov 20, 2026)
- 001: Menu hover: an animated brand-blue line (#1a79e2) grows under top-level menu items without a dropdown (About, Pricing, Blog, FAQ, Contact). Not on Services (has a dropdown) or the "Let's Talk" button. Only on devices with hover; no animation with reduced motion. All pages (shared `v2.css`).
- 002: Hero simplified: removed the "Flexible under pressure. Instant recovery. · Technology Advisors" line (keys `h.tagline`, `h.arch` removed). New sub-headline. EN: "We design, integrate, secure, and manage intelligent technology solutions that help you meet compliance requirements, operate smarter, scale confidently, and stay ahead." ES: "Diseñamos, integramos, protegemos y administramos soluciones tecnológicas inteligentes que te ayudan a cumplir con la normativa, operar de forma más inteligente, crecer con confianza y mantenerte a la vanguardia." Owner chose "help you meet compliance requirements" over "ensure compliance".
- 003: Hero glass tiles restyled to match the owner's sample: frosted white (light) / faint translucent white (dark), backdrop blur, thinner bright edge, softer shadow, regular-weight text, thinner icon strokes.
- 004: Experience strip: background now runs the full page width (like the logo strip), with thin top/bottom lines; content keeps the same size, centering and layout (desktop row, mobile 2×2). Gap before the logo strip removed.
- 005: `v2.css` cache version 2.7 → 2.8 on all pages; version comment v0.11.0 on every page.
- Checked in Chromium at 1440px and 390px. Validator: 0 errors, 0 warnings.

## v0.11.1 (Nov 20, 2026)
- 001: Menu "Let's Talk" button now uses the primary button style (blue gradient, sheen and glow like "Book a Free Discovery Call"), sized for the menu. All pages.
- 002: Language switch colors swapped: selected language on light blue with blue text; unselected on white (transparent in the dark theme).
- 003: `v2.css` cache version 2.8 → 2.9; version comment v0.11.1 on every page. Validator: 0 errors, 0 warnings.
