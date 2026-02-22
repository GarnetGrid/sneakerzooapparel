# 🏪 SNEAKER ZOO & APPAREL — SALES READINESS CHECKLIST

> **Date**: February 22, 2026  
> **Purpose**: Complete audit to ensure every funnel step works before going live for sales.  
> **Domain**: `sneakerzooapparel.com`

---

## TABLE OF CONTENTS

1. [Sales Funnel Walkthrough](#1-sales-funnel-walkthrough)
2. [Checkout & Payment](#2-checkout--payment)
3. [Product Catalog / Inventory](#3-product-catalog--inventory)
4. [Account System](#4-account-system)
5. [Contact & Support](#5-contact--support)
6. [Legal & Compliance](#6-legal--compliance)
7. [SEO & Discoverability](#7-seo--discoverability)
8. [Mobile Responsiveness](#8-mobile-responsiveness)
9. [Branding & Content](#9-branding--content)
10. [Infrastructure & Deployment](#10-infrastructure--deployment)
11. [Critical Bugs & Blockers](#11-critical-bugs--blockers)
12. [Pre-Launch Action Items](#12-pre-launch-action-items)

---

## 1. SALES FUNNEL WALKTHROUGH

The end-to-end customer journey:

| Step | Page | Status | Notes |
|------|------|--------|-------|
| 1. Landing | `index.html` | ✅ Working | Hero text + "ENTER ARCHIVE" CTA |
| 2. Browse Catalog | `showcase.html` | ✅ Working | Dynamic grid from `data.js`, filter buttons (ALL / FOOTWEAR / APPAREL / OBJECTS) |
| 3. Product Detail | `product.html?id=xxx` | ✅ Working | 3D hologram (Three.js), product info, "ADD TO CART" button |
| 4. Cart / Checkout | `checkout.html` | ⚠️ Partial | Cart renders from localStorage, form exists, **but submit does nothing** |
| 5. Order Confirmation | N/A | ❌ Missing | No confirmation page / success state after checkout |
| 6. Account | `account.html` | ✅ Working (Mock) | Login / Register / Dashboard all mock (localStorage) |

### Funnel Checklist

- [ ] **Click through full funnel** — Landing → Archive → Product → Add to Cart → Checkout → Submit
- [ ] **Test empty cart state** — Go directly to `checkout.html` with no items
- [ ] **Test "ACQUIRE ASSETS" link** — Empty cart should link back to `showcase.html`
- [ ] **Test all 12 inventory items** — Click each product card, verify data populates on product page
- [ ] **Test filter buttons** — ALL, FOOTWEAR, APPAREL, OBJECTS each filter correctly
- [ ] **Test "Remove" in cart** — Add items, go to checkout, remove one, verify totals update

---

## 2. CHECKOUT & PAYMENT

> [!CAUTION]
> **THE CHECKOUT FORM DOES NOT PROCESS PAYMENTS.** There is no `onsubmit` handler on the checkout form. Stripe keys exist in `.env` but are not wired into the frontend. This is the **#1 blocker** for going live.

### Current State

- **Stripe keys in `.env`**: ✅ Test + Live keys present
- **Stripe.js loaded on page**: ❌ Not loaded
- **Checkout form submit handler**: ❌ No `onsubmit` — clicking "INITIATE TRANSFER" does default form submit (page reload)
- **Payment processing backend**: ❌ No server-side API (this is a static site on GitHub Pages/Vercel)
- **Order confirmation**: ❌ No success page or toast after purchase
- **Email receipt**: ❌ Not implemented
- **Tax calculation**: ❌ No tax line shown (subtotal = total currently)
- **Shipping cost**: ❌ No shipping line shown
- **Quantity selection**: ❌ Cart does not support quantities — each add = new line item
- **Size selection**: ⚠️ Product page has a text input for size, but it is not persisted to cart

### Checkout Checklist

- [ ] **ADD Stripe.js** — Load `<script src="https://js.stripe.com/v3/"></script>` on checkout page
- [ ] **WIRE checkout form** to Stripe Checkout Session or Payment Intent
- [ ] **DECIDE**: Use Stripe Checkout (hosted page) vs. embedded Payment Element
  - Stripe Checkout (recommended for static sites): redirects to Stripe's hosted page, requires server-side session creation
  - Alternative: Stripe Payment Links (zero code, paste a link)
- [ ] **CREATE Stripe Products** — Each inventory item needs a Stripe Product + Price object
- [ ] **ADD order confirmation** — After successful payment, show confirmation page or redirect
- [ ] **ADD email receipt** — Stripe can handle this automatically if enabled in dashboard
- [ ] **ADD tax calculation** — Stripe Tax or manual line item
- [ ] **ADD shipping cost** — Flat rate or calculated line item
- [ ] **FIX size selection** — Persist selected size to cart item object
- [ ] **ADD quantity support** — Allow incrementing quantity instead of duplicate line items
- [ ] **VALIDATE credit card fields** — Currently plain text inputs with no validation/masking

---

## 3. PRODUCT CATALOG / INVENTORY

### Current Inventory (`data.js` — 12 items)

| ID | Name | Category | Price | Image Source |
|--------|------|----------|-------|------|
| fz_01 | JORDAN 1 - Lost & Found | FOOTWEAR | $450 | Discord CDN |
| fz_02 | YEEZY 350 - Pirate Black | FOOTWEAR | $380 | GOAT CDN |
| fz_03 | JORDAN 4 - Military Black | FOOTWEAR | $320 | GOAT CDN |
| fz_04 | OFF-WHITE DUNK - Lot 1 | FOOTWEAR | $1,200 | GOAT CDN |
| fz_05 | RICK OWENS - Geobasket | FOOTWEAR | $950 | GOAT CDN |
| ap_01 | VINTAGE TEE - Akira | APPAREL | $650 | GOAT CDN |
| ap_02 | WORK JACKET - Detroit Duck | APPAREL | $220 | GOAT CDN |
| ap_03 | HOODIE - Essentials Void | APPAREL | $110 | GOAT CDN |
| ap_04 | SUPREME TEE - Box Logo | APPAREL | $180 | GOAT CDN |
| ob_01 | KUBRICK - 1000% Bearbrick | OBJECTS | $800 | GOAT CDN |
| ob_02 | CHROME - Hearts Ring | OBJECTS | $550 | GOAT CDN |

### Product Checklist

- [ ] **VERIFY all 12 product images load** — Discord CDN and GOAT CDN links may break over time
- [ ] **REPLACE hotlinked images** with self-hosted copies in `/assets/images/products/`
- [ ] **CHECK prices are accurate** — Confirm with store owner that all 12 prices are correct
- [ ] **ADD real product images** — Current showcase uses emoji icons (👟👕🗿), not product photos
- [ ] **ADD product sizes/availability** — No size data exists in `data.js`; the size field on product page is a raw text input
- [ ] **ADD stock quantity** — No concept of stock/out-of-stock in the data model
- [ ] **UPDATE data with owner's actual inventory** — Current items may not match what the store actually sells
- [ ] **CONSIDER: product descriptions** — Current descriptions are marketing copy; confirm with owner

---

## 4. ACCOUNT SYSTEM

### Current State

- **Registration**: ✅ Works (mock — saves to localStorage)
- **Login**: ✅ Works (mock — accepts any password)
- **Dashboard**: ✅ Shows greeting + hardcoded mock orders
- **Logout**: ✅ Works (clears localStorage)
- **Password hashing**: ❌ None (mock system)
- **Email verification**: ❌ None
- **Persistent backend**: ❌ None — all data lost on clearing browser

### Account Checklist

- [ ] **DECIDE**: Is account system needed for launch?
  - If YES → Need backend (Supabase, Firebase, etc.)
  - If NO → Remove or clearly label as "Coming Soon"
- [ ] **REMOVE mock order history** — Currently shows fake orders (SZ-9021, SZ-8810) that never happened
- [ ] **FIX password field** — Login sends any password as `'***'` (hardcoded)
- [ ] **ADD real authentication** if going live with accounts

---

## 5. CONTACT & SUPPORT

### Current State

- **Contact page** (`contact.html`): ✅ Form present, sleek design
- **Form backend**: ❌ Form just shows "SIGNAL RECEIVED" after 1.5s — **no actual email/data sent**
- **Formspree ID in `.env`**: `xdalgqdp` — exists but NOT wired to the form
- **FAQ page** (`faq.html`): ✅ Accordion works, 4 questions
- **Support email shown**: `support@sneakerzoo.com`
- **Physical address shown**: 2481 Richmond Rd, Staten Island, NY 10306
- **Hours shown**: DAILY // 11:00 — 19:00 EST

### Contact Checklist

- [ ] **WIRE contact form to Formspree** — Use the form ID `xdalgqdp` from `.env`
- [ ] **VERIFY email address** — Does `support@sneakerzoo.com` actually exist/receive mail?
- [ ] **VERIFY physical address** — Is 2481 Richmond Rd correct for the store?
- [ ] **VERIFY hours** — Are daily 11-7 EST the actual hours?
- [ ] **ADD phone number** — Not currently listed anywhere
- [ ] **ADD social media links** — Instagram, etc. (critical for sneaker culture)
- [ ] **UPDATE FAQ** — Only 4 questions; may need more for real customers
- [ ] **CONTACT.JS is orphaned** — A 203-line `contact.js` exists but is NOT loaded by `contact.html`

---

## 6. LEGAL & COMPLIANCE

### Current State

- **Privacy Policy** (`privacy.html`): ⚠️ Extremely minimal — 3 short paragraphs, no skip-link
- **Terms of Service** (`terms.html`): ⚠️ Extremely minimal — 3 paragraphs with joke content
- **Cookie consent banner**: ❌ Missing
- **Refund policy**: ⚠️ Mentioned in FAQ ("14 days") but no dedicated page
- **Shipping policy**: ⚠️ Mentioned in FAQ ("48-72 hours domestic") but no dedicated page
- **ADA / Accessibility**: ✅ Skip links, `sr-only`, ARIA attributes on forms, `prefers-reduced-motion`

### Legal Checklist

- [ ] **EXPAND Privacy Policy** — Needs GDPR/CCPA-compliant sections (what data, how long, cookies, third parties, rights)
- [ ] **EXPAND Terms of Service** — Need real legal language, not joke content ("not liable for reality distortion caused by excessive drip")
- [ ] **ADD skip-link to privacy.html** — Missing unlike other pages
- [ ] **ADD skip-link to terms.html** — Missing unlike other pages
- [ ] **ADD data.js script to privacy.html** — Not currently loaded (header won't inject properly without it)
- [ ] **ADD data.js script to terms.html** — Same issue
- [ ] **CREATE Refund/Return Policy page** — FAQ mentions 14-day return but no dedicated page
- [ ] **CREATE Shipping Policy page** — FAQ mentions timeframes but no dedicated page
- [ ] **ADD cookie consent banner** if using Google Analytics or any tracking
- [ ] **REVIEW all legal content with a lawyer** before live sales

---

## 7. SEO & DISCOVERABILITY

### Current State

- **robots.txt**: ✅ Present, allows all crawling, points to sitemap
- **sitemap.xml**: ⚠️ Present but incomplete — only 5 URLs (missing `about.html`, `faq.html`, `account.html`, `product.html`)
- **Meta descriptions**: ✅ Present on most pages
- **Favicon**: ⚠️ Only referenced in `404.html` — missing from all other pages
- **Open Graph / Social**: ❌ No OG tags on any page
- **Google Analytics**: `.env` has GA4 ID `G-EPXY5VQ39S` but **NOT loaded on any page**
- **Canonical URLs**: ❌ Not set on any page

### SEO Checklist

- [ ] **ADD favicon link** to all pages (currently only in `404.html`)
- [ ] **ADD Open Graph tags** — `og:title`, `og:description`, `og:image`, `og:url` on all pages
- [ ] **UPDATE sitemap.xml** — Add `about.html`, `faq.html`, `account.html`
- [ ] **ADD Google Analytics script** to all pages using the GA4 ID
- [ ] **ADD canonical URLs** to each page
- [ ] **ADD Twitter Card meta tags** for social sharing
- [ ] **CREATE `og-image.jpg`** — Social share preview image

---

## 8. MOBILE RESPONSIVENESS

### Current State

- **CSS media queries**: ✅ Breakpoint at 768px for header, buttons, grid
- **product.html**: ⚠️ Uses `grid-template-columns: 1fr 1fr` with `overflow: hidden` — may not stack on mobile
- **checkout.html**: ⚠️ Uses `grid-column: 2 / span 5` / `8 / span 4` — relies on 12-column grid that may break on mobile
- **account.html**: ⚠️ Same grid-column issue as checkout
- **privacy.html / terms.html**: ⚠️ `padding: 20vh 20vw` — 20vw padding will crush content on narrow screens

### Mobile Checklist

- [ ] **TEST all pages at 375px width** (iPhone SE)
- [ ] **TEST all pages at 414px width** (iPhone 12)
- [ ] **FIX product.html** — Add responsive breakpoint to stack hologram above info panel
- [ ] **FIX checkout.html** — Add responsive grid for mobile (single column)
- [ ] **FIX account.html** — Same grid fix needed
- [ ] **FIX privacy.html / terms.html** — Reduce horizontal padding on mobile
- [ ] **TEST checkout form** on mobile — Ensure all fields are usable with virtual keyboard
- [ ] **TEST cart interaction** on mobile — Add/remove items, verify touch targets

---

## 9. BRANDING & CONTENT

### Current State

- **Consistent brand**: ✅ "Sneaker Zoo" / "SZ" used consistently
- **Color palette**: ✅ Deep Void (#050505) + Hologram Silver (#E0E0E0) + Accent Red (#FF3333)
- **Typography**: ✅ Syne + Plus Jakarta Sans loaded via Google Fonts
- **Logo**: ✅ Animated SVG kinetic sneaker in header
- **About page**: ✅ Scrollytelling with team cards

### Branding Checklist

- [ ] **VERIFY brand name spelling** — Footer says "SNEAK ZOO" (missing 'ER') in `index.html` line 40
- [ ] **VERIFY team info with owner** — "Anonymous", "Unit 734", "Viper" — are these real or fictional?
- [ ] **ADD real store photos** — Currently no actual product photography
- [ ] **ADD Instagram feed / social proof** — Critical for sneaker boutique credibility
- [ ] **REVIEW "About" page copy** — "containment facility for the rarest kinetic footwear" may not match owner's vision
- [ ] **FIX `vercel.json` name** — Still says `"garnet-grid-consulting"` (legacy name)

---

## 10. INFRASTRUCTURE & DEPLOYMENT

### Current State

- **Hosting**: GitHub Pages (CNAME → `sneakerzooapparel.com`) + Vercel config present
- **CNAME**: ✅ Set to `sneakerzooapparel.com`
- **SSL/HTTPS**: ✅ Automatic via GitHub Pages
- **`.env` security**: ✅ `.gitignore` excludes `.env`
- **404 page**: ✅ Custom branded page exists

### Infrastructure Checklist

- [ ] **VERIFY domain is active** — Check `sneakerzooapparel.com` resolves correctly
- [ ] **VERIFY DNS records** — CNAME or A record pointing to GitHub Pages / Vercel
- [ ] **VERIFY SSL certificate** — HTTPS should work with no mixed content warnings
- [ ] **DECIDE hosting** — GitHub Pages OR Vercel (both configured, need to pick one)
- [ ] **FIX vercel.json** — Name still says "garnet-grid-consulting"
- [ ] **REMOVE LinkedIn data** — `LinkedIn.zip` (42MB) and `linkedin_data/` (435 files) are in the repo — these should NOT be in a live website repo
- [ ] **REMOVE parse scripts** — `parse_linkedin.py`, `parsed_data*.txt`, `experience_line.txt` are development artifacts
- [ ] **REMOVE legacy markdown files** — `OPTIMIZATION_REPORT.md`, `OUTCOMES_ENHANCEMENT.md`, `PERFORMANCE_OPTIMIZATION.md`, etc.
- [ ] **CLEAN assets directory** — Currently has `assets/css/` and `assets/js/` but content unknown

---

## 11. CRITICAL BUGS & BLOCKERS

### 🔴 BLOCKERS (Must fix before ANY sale)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 1 | **Checkout form has no submit handler** | `script.js` | ❌ Cannot complete a purchase |
| 2 | **No payment processor integration** | N/A | ❌ No way to accept money |
| 3 | **Product images are hotlinked from GOAT/Discord** | `data.js` | ❌ Will break when CDN links change |

### 🟡 HIGH PRIORITY (Should fix before launch)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 4 | Contact form doesn't actually send messages | `contact.html` | Users can't reach you |
| 5 | Footer typo: "SNEAK ZOO" instead of "SNEAKER ZOO" | `index.html` L40 | Looks unprofessional |
| 6 | Privacy/Terms pages are placeholder-quality | `privacy.html`, `terms.html` | Legal liability |
| 7 | GA4 not loaded on any page | All pages | No analytics data |
| 8 | Favicon not linked on most pages | All except `404.html` | No brand in browser tab |
| 9 | LinkedIn data (42MB) in repo | `LinkedIn.zip` | Sensitive data exposure risk |
| 10 | No social media links anywhere | All pages | Missing social proof |

### 🟢 NICE TO HAVE (Post-launch)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 11 | No quantity support in cart | `script.js` | Duplicate line items instead |
| 12 | Size not saved to cart | `script.js` | Size selection lost at checkout |
| 13 | Mock account system | `script.js` | Not real persistence |
| 14 | Showcase uses emoji icons, not product photos | `script.js` | Less premium feel |
| 15 | `contact.js` (203 lines) is never loaded | `contact.js` | Dead code |

---

## 12. PRE-LAUNCH ACTION ITEMS

### Owner Meeting Discussion Points

1. **Payment method** — Stripe Checkout (hosted), Stripe Payment Links, Square, or cash-only with website as catalog?
2. **Real inventory** — Do these 12 items match what's actually in stock?
3. **Pricing confirmation** — Are all 12 prices correct?
4. **Product images** — Do you have actual photos of the products?
5. **Contact info** — Phone number? Correct address? Email working?
6. **Social media** — Instagram handle? Other platforms?
7. **Team page** — Real names or keep fictional?
8. **Hosting preference** — GitHub Pages (free) or Vercel (free tier)?
9. **Account system** — Needed for launch or disable?
10. **Legal pages** — Will you have a lawyer review?

### Quick Wins (Can do today)

- [ ] Fix "SNEAK ZOO" → "SNEAKER ZOO" typo
- [ ] Add favicon to all pages
- [ ] Wire contact form to Formspree
- [ ] Update sitemap.xml
- [ ] Remove LinkedIn data and legacy files from repo
- [ ] Fix vercel.json project name
- [ ] Add Google Analytics

### Medium Effort (1-2 days)

- [ ] Self-host all product images
- [ ] Fix mobile responsiveness on product/checkout/account pages
- [ ] Expand privacy policy and terms of service
- [ ] Add social media links to footer
- [ ] Add Open Graph tags

### Requires Decision/Backend (Discuss with owner)

- [ ] Payment processing solution
- [ ] Real account system (or disable)
- [ ] Actual inventory management
- [ ] Order fulfillment workflow
- [ ] Shipping policy and rates

---

> **Bottom line**: The website is visually polished and the browsing experience is excellent. The **single biggest blocker** is that the checkout form does not process payments — no money can change hands. Everything else is fixable in order of priority.
