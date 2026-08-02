# Blue Ceylon Frontend — Complete Project Reference

This is the consolidated, up-to-date guide reflecting every decision made during setup: Google Maps (not Leaflet), the BFF auth pattern with `auth-service` (not direct Keycloak redirects), and Next.js 16's `proxy.ts` convention (not `middleware.ts`).

---

## 1. Confirmed Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | React Compiler: off for now |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS | Check v3 vs v4 syntax in `globals.css` |
| Data fetching | TanStack Query | |
| Forms | React Hook Form + Zod | |
| Auth | next-auth `CredentialsProvider` → posts to `auth-service` via API Gateway | **Not** `KeycloakProvider` — see Section 3 |
| Client state | Zustand | |
| Animation | Framer Motion | |
| Maps | `@vis.gl/react-google-maps` | **Not** react-leaflet — see Section 4 |
| Dates | date-fns | |
| Icons | Lucide React | |
| Primitives | Radix UI | |
| API types | `openapi-typescript` (generated from Spring Boot's `/v3/api-docs`) | |
| Testing | Vitest + Playwright | |

---

## 2. Full Folder Structure (Updated)

```
frontend/
├── AGENTS.md                                   # Guides AI coding agents on current Next.js conventions
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                       # Homepage
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                 # Custom login form (NOT a Keycloak redirect)
│   │   │   ├── register/page.tsx              # Custom register form, posts to auth-service
│   │   │   └── layout.tsx
│   │   ├── search/
│   │   │   ├── page.tsx                       # Results grid (Server Component)
│   │   │   └── loading.tsx                    # Skeleton grid
│   │   ├── business/
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Profile page
│   │   │       ├── rooms/page.tsx
│   │   │       └── reviews/page.tsx
│   │   ├── guide/
│   │   │   └── [id]/page.tsx
│   │   ├── checkout/
│   │   │   └── [bookingType]/
│   │   │       ├── page.tsx
│   │   │       └── actions.ts                 # Server Actions for booking submit
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                     # role-guarded (BUSINESS_OWNER)
│   │   │   ├── bookings/page.tsx
│   │   │   └── reviews/page.tsx
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts     # next-auth CredentialsProvider config
│   │   ├── layout.tsx                          # Root layout: fonts, providers, <html> shell
│   │   ├── providers.tsx                       # "use client" wrapper: QueryClientProvider, SessionProvider
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                                 # Design-system primitives (Radix-based, unstyled → styled by you)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx                 # Calls next-auth signIn("credentials", ...)
│   │   │   └── register-form.tsx              # Posts to /api/auth/register, then signs in
│   │   ├── home/
│   │   │   ├── hero-map.tsx                    # Stylized SVG island illustration (signature piece — NOT Google Maps)
│   │   │   ├── universal-search-bar.tsx
│   │   │   └── verified-spotlight-rail.tsx
│   │   ├── search/
│   │   │   ├── filter-drawer.tsx
│   │   │   ├── business-card.tsx
│   │   │   └── pagination.tsx
│   │   ├── business-profile/
│   │   │   ├── gallery.tsx
│   │   │   ├── amenities-list.tsx
│   │   │   ├── location-map.tsx                # Real Google Map embed (@vis.gl/react-google-maps)
│   │   │   ├── room-list.tsx
│   │   │   └── sltda-badge.tsx
│   │   ├── booking/
│   │   │   ├── date-range-picker.tsx
│   │   │   ├── availability-calendar.tsx
│   │   │   ├── checkout-form.tsx
│   │   │   └── pay-at-property-notice.tsx
│   │   └── reviews/
│   │       ├── review-list.tsx
│   │       ├── review-form.tsx
│   │       ├── rating-stars.tsx
│   │       └── owner-response.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                       # Fetch wrapper — attaches Bearer JWT from session automatically
│   │   │   ├── catalog.ts                       # search/businesses, search/rooms, search/tours calls
│   │   │   ├── auth.ts                          # Calls to auth-service: login, register
│   │   │   ├── booking.ts
│   │   │   └── reviews.ts
│   │   ├── query/
│   │   │   ├── query-client.ts
│   │   │   └── keys.ts                          # Centralized React Query cache keys
│   │   ├── validation/
│   │   │   ├── auth-schema.ts                   # Zod schemas: login, register
│   │   │   ├── checkout-schema.ts
│   │   │   └── review-schema.ts
│   │   └── utils/
│   │       ├── format-currency.ts
│   │       ├── format-date.ts
│   │       └── cn.ts                            # classnames/tailwind-merge helper
│   │
│   ├── types/
│   │   ├── generated/
│   │   │   └── api.ts                           # openapi-typescript output — never hand-edit
│   │   ├── next-auth.d.ts                       # Extends next-auth's Session/JWT with accessToken, refreshToken
│   │   ├── business.ts
│   │   ├── booking.ts
│   │   └── review.ts
│   │
│   ├── hooks/
│   │   ├── use-business-search.ts               # React Query hook
│   │   ├── use-availability.ts
│   │   ├── use-reviews.ts
│   │   └── use-auth-session.ts
│   │
│   ├── store/
│   │   └── booking-draft-store.ts               # Zustand: in-progress checkout state (survives login redirect)
│   │
│   ├── styles/
│   │   ├── tokens.css                           # CSS variables: colors, spacing, type scale
│   │   └── fonts.ts                             # next/font config (Fraunces + Cabinet Grotesk)
│   │
│   ├── fonts/                                    # Local woff2 files for Cabinet Grotesk
│   │
│   └── proxy.ts                                  # Next.js 16 route guard (renamed from middleware.ts)
│
├── public/
│   ├── images/
│   └── icons/
│
├── tests/
│   ├── unit/
│   └── e2e/
│       └── checkout-flow.spec.ts                 # Playwright
│
├── .env.local.example
├── .env.local                                    # gitignored — real secrets/keys
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. What Each Top-Level Folder Is For

**`src/app/`** — Every route in the site. Folder = URL segment (App Router convention). `page.tsx` makes a segment publicly renderable; `layout.tsx` wraps children in shared UI; `loading.tsx` and `not-found.tsx` are optional special files Next.js picks up automatically. The `(marketing)` and `(auth)` folders use parentheses — these are **route groups**, meaning they organize files without adding a URL segment (`(auth)/login` still resolves to `/login`, not `/auth/login`).

**`src/components/`** — All UI, organized by what it belongs to rather than by component type. `ui/` holds your generic design-system primitives (button, dialog, tabs) built on Radix — these should know nothing about "bookings" or "reviews," just how to look and behave. Every other subfolder (`booking/`, `reviews/`, `business-profile/`) holds feature-specific components that compose those primitives.

**`src/lib/`** — Framework-adjacent logic that isn't a component: the API client, React Query setup, and Zod validation schemas. This is where "how do we talk to the backend" and "what counts as valid input" live, separate from "what does it look like."

**`src/types/`** — TypeScript types. `generated/api.ts` is machine-generated from your Spring Boot OpenAPI spec — treat it as read-only and regenerate rather than edit. `next-auth.d.ts` is a **module augmentation** file — it doesn't export anything itself, it just extends next-auth's built-in `Session`/`JWT` interfaces so TypeScript knows about your custom `accessToken` field.

**`src/hooks/`** — Custom React hooks, mostly thin wrappers around React Query (`useQuery`/`useMutation`) for each domain (search, availability, reviews). Keeping these separate from components means the same data-fetching logic can be reused across multiple pages without copy-pasting.

**`src/store/`** — Zustand stores for state that isn't server data and isn't local to one component — e.g. an in-progress checkout draft that needs to survive a redirect to `/login` and back.

**`src/styles/`** — Design tokens (`tokens.css`) and font loading config (`fonts.ts`). This is the one place your color palette and typography are defined — everything else (Tailwind config, components) should reference these variables rather than hardcoding hex values or font names.

**`src/fonts/`** — Local font files (Cabinet Grotesk woff2s) that aren't available via Google Fonts and need to be self-hosted.

**`src/proxy.ts`** — Next.js 16's route-guard convention (replaces the old `middleware.ts`). Runs before matched routes render — this is where you check for a valid session and redirect to `/login` if someone hits `/checkout` or `/dashboard` unauthenticated.

**`public/`** — Static assets served as-is at the root URL (e.g. `public/images/hero.jpg` → `/images/hero.jpg`).

**`tests/`** — `unit/` for Vitest component/logic tests, `e2e/` for Playwright tests that drive a real browser through flows like checkout.

**`AGENTS.md`** — Instructions for AI coding agents working in this repo, so they use current Next.js 16 patterns instead of outdated ones from their training data.

---

## 4. Key Decisions Locked In During Setup (and why)

- **React Compiler: off.** Still experimental in the Next.js scaffold; with TanStack Query + Zustand handling most state, you're not leaning on manual memoization enough to need it yet.
- **Import alias: `@/*`.** Every internal import uses this — matches the folder structure above exactly.
- **Auth is a BFF pattern, not direct Keycloak redirects.** Your Next.js app renders its own login/register UI and posts credentials to `auth-service` (via the API Gateway), which talks to Keycloak server-side and returns a JWT. next-auth uses `CredentialsProvider`, not `KeycloakProvider`, and stores that JWT in the session. Every downstream call to `catalog-service`/`booking-service` attaches it as a Bearer token.
- **Maps: Google Maps (`@vis.gl/react-google-maps`), not Leaflet.** Chosen for familiarity and richer place data. Used only on real functional maps (business profile location) — the homepage hero uses a custom illustrated SVG instead, since a live embedded Google Map in a hero reads as generic; a stylized island graphic is the actual signature design element.
- **`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed this convention; the file must export a **default function**, and requires a dev-server restart (not hot reload) when changed.

---

## 5. Recommendations for the Build Itself

1. **Get the shell running clean before writing features.** Confirm `npm run dev` boots with no terminal errors, fonts load, and Tailwind resolves — before touching search, auth, or booking logic. Every error you fix now saves you debugging it "through" a half-built page later.
2. **Build auth end-to-end early**, even with a placeholder UI. Login → session → Bearer token on an API call should work before you build the rest of the UI around it, since almost every other feature (reviews, checkout, dashboard) depends on knowing who's logged in.
3. **Generate API types from the real backend**, not by hand-writing interfaces that guess at the DTO shape — re-run `openapi-typescript` whenever the backend changes, and never hand-edit the generated file.
4. **Spend your design "budget" on one signature element** (the hero illustration) and keep the rest — cards, forms, filters — clean, consistent, and quiet. A disciplined, restrained UI reads as more senior than one with an animation on every element.
5. **Mirror the backend's actual trust model in the UI**, don't fake it — e.g. don't let a review form accept a hotel review without a real `bookingId`, since that API constraint exists for a reason (verified-stay reviews).
6. **Write the one Playwright e2e test on checkout**, not on everything — a single well-chosen test on your most complex flow (auth-gated, date-availability-checked, form-validated) demonstrates engineering maturity better than a suite of trivial snapshot tests.
7. **Keep a running note of what you changed and why** (this file is effectively that) — useful for you when writing the portfolio case-study description, and useful for anyone reviewing the repo who wants to understand your decisions rather than just reading code.
8. **Theme Keycloak's admin/login pages eventually if any Keycloak-hosted UI is still visible anywhere** — since your architecture keeps users on custom pages for login/register, this matters less now, but double check nothing in the flow still bounces a user to a default Keycloak screen unexpectedly.

---

## 6. Suggested Build Order

1. Design tokens + fonts + Navbar/Footer shell
2. Auth end-to-end (login/register forms → `auth-service` → session → Bearer token confirmed on one real API call)
3. Homepage with the hero illustration
4. Search + filters against real catalog API
5. Business/guide profile pages (including real Google Map embed)
6. Checkout flow with availability + Zod validation, gated by `proxy.ts`
7. Reviews (submit + respond)
8. Dashboard for business owners
9. Polish: reduced-motion support, keyboard focus states, one Playwright e2e test, README with a GIF of the full flow
