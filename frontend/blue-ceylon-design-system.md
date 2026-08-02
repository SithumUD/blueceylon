# Blue Ceylon — Design System & Visual Style Guide

A consolidated design reference for the Blue Ceylon traveler discovery & booking platform, derived from the project brand mark (`logo.svg`, `blueceylon-navbar.svg`), the architecture reference, and the product README. This document exists so that every screen — homepage, search, profiles, checkout, dashboard — reads as one considered product rather than a collection of separately-styled pages.

---

## 1. Brand Foundation

**Product**: Blue Ceylon — premium traveler discovery & booking platform for Sri Lankan tourism (hotels, homestays, tour agencies, private guides).

**Brand personality**: coastal, trustworthy, understated-premium. Think boutique travel editorial, not a generic OTA (booking.com/Agoda) and not a garish tourist-brochure. The logo mark itself is a deep-navy-to-teal gradient wordmark with a small warm sunset-orange/gold accent — that pairing (cool ocean base + one warm accent) is the entire visual thesis of the brand and should be treated as scarce and intentional, echoing the reference doc's principle: *"spend your design budget on one signature element."*

**Extracted logo palette** (sampled directly from `logo.svg`):

| Swatch | Hex | Role in logo |
|---|---|---|
| 🟦 | `#003366` | Primary navy — base of wordmark gradient |
| 🟦 | `#004080` | Mid-tone navy-blue |
| 🟢 | `#008080` | Teal — gradient endpoint |
| 🩵 | `#00FFFF` | Cyan highlight — gradient sheen/specular edge |
| 🟠 | `#FF8000` | Sunset orange — small accent (sun/warmth motif) |
| 🟡 | `#FDA301` | Gold-orange — accent secondary |

This confirms and sharpens the README's stated direction ("deep ocean blues, golden sands, lush green accents") into an actual usable palette: **the blues/teals are the dominant identity color; gold-orange is a single, deliberate warm accent — not a secondary palette to build UI out of.**

---

## 2. Color System

### 2.1 Core palette (light mode)

| Token | Hex | Usage |
|---|---|---|
| `--color-navy-900` | `#001F3D` | Darkest navy — headers on dark sections, footer background |
| `--color-navy-800` | `#003366` | Primary brand color — logo navy, primary buttons, active nav states |
| `--color-navy-700` | `#004080` | Hover state for primary navy elements |
| `--color-teal-600` | `#006666` | Secondary brand color — links, icons, secondary CTAs |
| `--color-teal-500` | `#008080` | Teal — badges, highlights, chart accents |
| `--color-cyan-300` | `#5CE1E6` | Soft cyan — used sparingly for glassmorphism edges, gradient sheens |
| `--color-sand-100` | `#FDF6EC` | Warm off-white — page background instead of pure white |
| `--color-sand-200` | `#F5E8D3` | Card background alternate / section dividers |
| `--color-gold-500` | `#FDA301` | Sunset gold — verified badge, rating stars, "featured" tags only |
| `--color-gold-600` | `#E88A00` | Gold hover/pressed state |
| `--color-coral-500` | `#FF6B4A` | Rare warning/urgency accent (e.g. "2 rooms left") — used even more sparingly than gold |
| `--color-ink-900` | `#0E1B22` | Primary text |
| `--color-ink-600` | `#4A5A62` | Secondary text / captions |
| `--color-ink-300` | `#9AAAB0` | Disabled text, placeholder |
| `--color-line-200` | `#E4E9EA` | Borders, dividers on light backgrounds |
| `--color-white` | `#FFFFFF` | Cards, inputs, elevated surfaces |
| `--color-success-500` | `#1F9D6C` | Confirmed booking, availability |
| `--color-error-500` | `#D64545` | Form errors, failed payment |

### 2.2 Dark mode palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-dark` | `#081419` | App background |
| `--color-surface-dark` | `#0F252E` | Cards, modals |
| `--color-surface-dark-raised` | `#15323D` | Elevated surfaces (dropdowns, popovers) |
| `--color-navy-dark-accent` | `#2E7DB8` | Brightened navy for legibility on dark bg |
| `--color-teal-dark-accent` | `#3FCFC0` | Brightened teal on dark bg |
| `--color-gold-dark-accent` | `#FFB84D` | Brightened gold on dark bg |
| `--color-ink-dark-900` | `#EAF2F4` | Primary text on dark |
| `--color-ink-dark-600` | `#A9BCC2` | Secondary text on dark |
| `--color-line-dark-200` | `#20353D` | Borders on dark |

**Rule of thumb**: dark mode is not the light palette inverted — every accent color gets brightened/desaturated slightly so it doesn't feel muddy against near-black backgrounds (`#2E7DB8` vs `#003366`, `#3FCFC0` vs `#008080`).

### 2.3 Semantic color mapping

| Purpose | Light mode | Dark mode |
|---|---|---|
| Page background | `--color-sand-100` | `--color-bg-dark` |
| Card / surface | `--color-white` | `--color-surface-dark` |
| Primary button | `--color-navy-800` → hover `--color-navy-700` | `--color-navy-dark-accent` |
| Secondary button | outline, `--color-teal-600` border/text | outline, `--color-teal-dark-accent` |
| Links | `--color-teal-600` | `--color-teal-dark-accent` |
| Verified badge | `--color-gold-500` fill, navy icon | `--color-gold-dark-accent` |
| Star ratings | `--color-gold-500` | `--color-gold-dark-accent` |
| Price text | `--color-navy-800`, semibold | `--color-ink-dark-900` |
| Error/urgency | `--color-coral-500` / `--color-error-500` | brightened equivalents |

### 2.4 Gradients (used sparingly — hero and signature moments only)

```css
--gradient-ocean: linear-gradient(135deg, #003366 0%, #008080 100%);
--gradient-sunset: linear-gradient(120deg, #FF8000 0%, #FDA301 100%);
--gradient-glass: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%);
```

`--gradient-ocean` mirrors the logo's own gradient exactly (navy → teal) and should be the *only* large-surface gradient in the product — reserved for the homepage hero backdrop and perhaps the checkout success state. `--gradient-sunset` is reserved for the "Verified"/spotlight rail per the README's spotlight feature. Do not combine both gradients in the same viewport.

---

## 3. Typography

Per the README and reference doc: clean sans-serif for UI, with **Fraunces** (serif, per `fonts.ts` in the folder structure) reserved for editorial/display moments, and **Cabinet Grotesk** (self-hosted woff2, per `src/fonts/`) as the primary UI typeface.

| Token | Font | Weight | Usage |
|---|---|---|---|
| `--font-display` | Fraunces | 500–600, optical size "display" | Hero headline, business name on profile page, section titles like "Verified Stays in Ella" |
| `--font-sans` | Cabinet Grotesk | 400–700 | All UI: nav, buttons, cards, forms, body copy |
| `--font-mono` (optional) | ui-monospace fallback | 400 | Booking reference codes, SLTDA license numbers |

### Type scale

| Token | Size / Line-height | Weight | Use |
|---|---|---|---|
| `--text-display-xl` | 56px / 60px | 600 (Fraunces) | Homepage hero headline |
| `--text-display-lg` | 40px / 46px | 600 (Fraunces) | Section headers ("Explore Sri Lanka") |
| `--text-h1` | 32px / 38px | 700 (Cabinet Grotesk) | Business/guide profile name |
| `--text-h2` | 24px / 30px | 700 | Card section titles, dashboard headers |
| `--text-h3` | 20px / 26px | 600 | Sub-sections, modal titles |
| `--text-body-lg` | 17px / 26px | 400 | Business descriptions, review text |
| `--text-body` | 15px / 22px | 400 | Default UI copy |
| `--text-caption` | 13px / 18px | 500 | Metadata, timestamps, helper text |
| `--text-label` | 12px / 16px, uppercase, tracked +0.04em | 600 | Filter labels, badges, form labels |

**Pairing rule**: Fraunces never appears in components smaller than an H3 equivalent, and never in interactive elements (buttons, inputs, nav links) — it is a display face for moments of arrival (hero, profile name, empty states), Cabinet Grotesk runs everything functional.

---

## 4. Spacing, Radius & Elevation

### Spacing scale (4px base unit)
`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 20px` · `--space-6: 24px` · `--space-8: 32px` · `--space-10: 40px` · `--space-12: 48px` · `--space-16: 64px` · `--space-20: 80px`

### Border radius
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Inputs, chips, small buttons |
| `--radius-md` | 12px | Cards, dropdowns |
| `--radius-lg` | 20px | Modals, large image containers, filter drawer |
| `--radius-pill` | 999px | Search bar, badges, tags |

Corners lean soft/rounded — never sharp 0px — to keep the coastal, approachable feel; but never past `20px` on large surfaces, or the UI starts reading juvenile rather than premium.

### Elevation (shadow)
```css
--shadow-sm: 0 1px 2px rgba(14,27,34,0.06);
--shadow-md: 0 4px 12px rgba(14,27,34,0.08);
--shadow-lg: 0 12px 32px rgba(14,27,34,0.12);
--shadow-glow-gold: 0 0 0 3px rgba(253,163,1,0.18); /* verified badge focus ring only */
```
Shadows are tinted with `--color-ink-900` at low opacity, never pure black — keeps shadows feeling warm rather than harsh.

---

## 5. Glassmorphism Guidelines

The README calls for glassmorphism — apply it as a **rare accent on the hero and floating elements only**, never on content-dense surfaces like search result cards or dashboard tables (glass over dense text hurts readability and looks dated fast).

**Appropriate uses:**
- Sticky filter drawer header while scrolling
- Floating "book now" summary bar on mobile checkout
- Navbar when scrolled over the hero image (transparent → glass transition)

```css
.glass-surface {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```
On dark mode, drop the white tint to `rgba(15,37,46,0.5)` with the same blur.

**Never**: glass on top of glass, glass behind long-form text (reviews, descriptions), or glass as a default card style — it's a hero/navbar technique, not a component-library default.

---

## 6. Motion

Per the README ("subtle micro-animations") and reference doc ("keep the rest quiet"):

| Interaction | Motion |
|---|---|
| Card hover | `translateY(-4px)`, shadow-sm → shadow-md, 180ms ease-out |
| Page/route transition | 220ms fade + 8px slide-up (Framer Motion `AnimatePresence`) |
| Skeleton → content (search results) | 300ms crossfade, staggered 40ms per card |
| Filter drawer open | 260ms ease spring, slide from right (desktop) / bottom sheet (mobile) |
| Button press | scale to 0.98, 100ms |
| Verified badge on profile load | single subtle 400ms fade+scale-in, once — not looping |
| Toast/notification | slide-in from top-right, 240ms, auto-dismiss 4s |

**Hard rule**: nothing loops or auto-plays continuously (no perpetual shimmer, no idle pulsing badges) — motion always resolves to a rest state. Always respect `prefers-reduced-motion` by dropping to opacity-only transitions, per the reference doc's build-order item #9.

---

## 7. Iconography & Imagery

- **Icon set**: Lucide React exclusively — 1.5px stroke weight, no filled icons except for the star rating and the verified checkmark (which are brand-colored fills, not line icons, to read as trust signals at a glance).
- **Photography treatment**: cover images (hotel covers, gallery) get a very subtle warm-up filter (+3% saturation, +2% warmth) so imagery across different photographers/properties feels visually consistent — avoid a hard preset/Instagram-filter look.
- **The hero illustration** (`components/home/hero-map.tsx`) is the one signature illustrated asset — a stylized SVG island graphic in the ocean gradient (`--gradient-ocean`) with gold accent points marking regions (Ella, Galle, Sigiriya, etc). This is explicitly *not* a live Google Map — real maps are reserved for the business-profile location component only, per the locked-in decision in the reference doc.
- **Empty/loading states**: use Fraunces display type + a simple line-icon, not illustration-heavy empty states — keeps the "quiet" design budget rule intact.

---

## 8. Core Components

### 8.1 Buttons
| Variant | Style |
|---|---|
| Primary | `--color-navy-800` fill, white text, `--radius-sm`, hover → `--color-navy-700`, active → scale 0.98 |
| Secondary | transparent fill, 1.5px `--color-teal-600` border, teal text |
| Gold/CTA (rare) | `--color-gold-500` fill, navy text — reserved for "Verified" filter toggle or spotlight CTAs only, never the default action button |
| Ghost | no border/fill, `--color-ink-600` text, used in nav/table rows |
| Destructive | `--color-error-500` text/border, fill on hover |

### 8.2 Cards (`business-card.tsx`)
- White surface, `--radius-md`, `--shadow-sm` at rest → `--shadow-md` on hover with the -4px lift
- Cover image: 4:3, top-rounded to match card radius
- Verified badge: small gold-filled pill, top-left of image, navy checkmark icon
- Price: bottom-right, `--text-h3` weight 700, `--color-navy-800`
- Rating: gold star icon + `--text-caption`, next to review count

### 8.3 Search bar / Filter drawer
- Universal search bar: `--radius-pill`, `--shadow-md`, sits directly on the hero gradient — white/glass fill depending on scroll position
- Filter drawer: `--radius-lg` on the leading edge only, sticky header uses `.glass-surface` when the page is scrolled

### 8.4 Badges
- **Verified (SLTDA)**: gold fill, navy check icon, `--text-label` — the single most important trust element in the product, per README §1; never reuse gold for anything else on the same screen so it doesn't get diluted
- **Booking status**: pill badges using semantic colors (`success`/`error`/`--color-ink-300` for pending)

### 8.5 Forms
- Inputs: `--radius-sm`, `--color-line-200` border at rest, `--color-teal-600` border + `--shadow-glow-gold`-style focus ring (but teal-tinted, not gold — gold stays reserved for verification) on focus
- Validation errors inline below field, `--color-error-500`, `--text-caption`
- Date range picker & availability calendar: available dates in `--color-teal-500`-tinted background, unavailable in `--color-ink-300` strikethrough, selected range filled `--color-navy-800`

---

## 9. Layout Principles

- **Grid**: 12-column, max content width `1280px`, gutter `24px` desktop / `16px` mobile
- **Breakpoints**: mobile `<640px`, tablet `640–1024px`, desktop `>1024px`
- **Card grids**: 1 col mobile → 2 col tablet → 3–4 col desktop, per README §5.2
- **Vertical rhythm**: sections separated by `--space-16`–`--space-20`, never less than `--space-12` between major page sections
- **Restraint principle** (from reference doc §5.4): only the homepage hero and one signature illustration get the "full" design treatment (gradient, motion, glass) — search, cards, forms, dashboard stay clean, consistent, and quiet so the product reads as senior/considered rather than over-decorated

---

## 10. Trust & Verification Visual Language

Since verified trust is a core pillar (SLTDA badges + verified-stay reviews), trust signals get a **consistent, exclusive visual vocabulary** so users learn to recognize them instantly:

- Gold (`--color-gold-500`) is used **only** for: verified badges, star ratings, and the SLTDA license display on profiles — nowhere else in the UI
- Verified-stay reviews get a small teal "Verified Stay" tag distinct from the gold badge (gold = business verified by SLTDA, teal = this specific review is tied to a real booking) — keeping these two trust concepts visually distinct matters, since they answer different questions
- Owner responses to reviews are visually indented/boxed in `--color-sand-200` to differentiate provider voice from traveler voice

---

## 11. Quick Reference: CSS Variables Block

```css
:root {
  /* Brand */
  --color-navy-900: #001F3D;
  --color-navy-800: #003366;
  --color-navy-700: #004080;
  --color-teal-600: #006666;
  --color-teal-500: #008080;
  --color-cyan-300: #5CE1E6;
  --color-gold-500: #FDA301;
  --color-gold-600: #E88A00;
  --color-coral-500: #FF6B4A;

  /* Neutrals */
  --color-sand-100: #FDF6EC;
  --color-sand-200: #F5E8D3;
  --color-ink-900: #0E1B22;
  --color-ink-600: #4A5A62;
  --color-ink-300: #9AAAB0;
  --color-line-200: #E4E9EA;
  --color-white: #FFFFFF;

  /* Semantic */
  --color-success-500: #1F9D6C;
  --color-error-500: #D64545;

  /* Type */
  --font-display: "Fraunces", serif;
  --font-sans: "Cabinet Grotesk", sans-serif;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(14,27,34,0.06);
  --shadow-md: 0 4px 12px rgba(14,27,34,0.08);
  --shadow-lg: 0 12px 32px rgba(14,27,34,0.12);

  /* Gradients */
  --gradient-ocean: linear-gradient(135deg, #003366 0%, #008080 100%);
  --gradient-sunset: linear-gradient(120deg, #FF8000 0%, #FDA301 100%);
}

[data-theme="dark"] {
  --color-bg-dark: #081419;
  --color-surface-dark: #0F252E;
  --color-surface-dark-raised: #15323D;
  --color-navy-dark-accent: #2E7DB8;
  --color-teal-dark-accent: #3FCFC0;
  --color-gold-dark-accent: #FFB84D;
  --color-ink-dark-900: #EAF2F4;
  --color-ink-dark-600: #A9BCC2;
  --color-line-dark-200: #20353D;
}
```

---

## 12. How This Maps to the Existing Architecture

- `src/styles/tokens.css` → should contain exactly the CSS variable block in §11 (this is the single source of truth referenced in §2 of the reference doc — Tailwind config and components pull from here, never hardcode hex values)
- `src/styles/fonts.ts` → loads Fraunces (Google Fonts or self-hosted) + Cabinet Grotesk from `src/fonts/` woff2s, per §2
- `components/home/hero-map.tsx` → implements `--gradient-ocean` + the illustrated SVG island (see §7)
- `components/business-profile/sltda-badge.tsx` → implements the gold verified badge from §10
- `components/ui/*` (Radix primitives) → get styled per §8, stay generic/feature-agnostic per the reference doc's component philosophy in §3
- Dark mode toggle (`components/layout/theme-toggle.tsx`) → switches `data-theme` attribute, pulling the §2.2 palette

---

*This guide is intended to sit alongside `blue-ceylon-complete-reference.md` and `README.md` as the third leg of the project's living documentation — update it whenever a real design decision is made (new component, new color usage) rather than letting the UI drift from what's written here.*
