# 🗺️ Blue Ceylon — Frontend-to-Backend Full Integration Roadmap

> **Authoritative Step-by-Step Guide** for replacing frontend mock data with real backend microservice APIs (`auth-service`, `catalog-service`, `booking-service`).

---

## ⚡ Executive Strategy & Integration Architecture

The Blue Ceylon platform is powered by a **distributed microservices architecture** operating behind a unified **Spring Cloud API Gateway (`http://localhost:8080`)**:

```
                              ┌──────────────────────────────────┐
                              │    Next.js 16 Frontend App      │
                              │    (http://localhost:3000)       │
                              └────────────────┬─────────────────┘
                                               │
                                 API Gateway (`http://localhost:8080`)
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
    ┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
    │    auth-service    │          │  catalog-service   │          │  booking-service   │
    │    (Port 8081)     │          │    (Port 8082)     │          │    (Port 8083)     │
    └────────────────────┘          └────────────────────┘          └────────────────────┘
```

### Key Integration Principles
1. **Incremental Replacement**: Migrate public read-only discovery views first, followed by transactional write flows, provider onboarding, admin moderation, and reviews.
2. **State & Auth Token Persistence**: Use `useAuthStore` (Zustand) and `apiFetch` (`src/lib/api/client.ts`) to automatically append JWT Bearer tokens (`Authorization: Bearer <token>`).
3. **Data Model 100% Compliance**: All DTO requests and responses follow `BLUE_CEYLON_BACKEND_FIELD_SPECIFICATION.md` exact enum definitions (`SriLankanCity`, `Region`, `BusinessType`, `VehicleType`, `RoomType`, `PaymentMethod`).

---

## 🧭 Prioritized Integration Phases

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Public Search & Discovery (Read-Only Catalog)                             │
│ └── Connect Hotels, Rooms, Tours, Agencies, Guides & Extra Packages to Backend     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Booking Engine & Traveler Checkout Flow                                      │
│ └── Connect Date Availability, Price Calculation, Booking Submission & My Bookings   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Provider Onboarding & Business Owner Dashboard                                │
│ └── Connect Provider Registration Drafts, Rooms/Packages Management & Owner Bookings  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Admin Moderation Portal                                                       │
│ └── Connect Pending Provider Approvals, Listing Actions & Admin User Control           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Verified Reviews & Ratings System                                            │
│ └── Connect Verified-Stay Review Submissions, Public Reviews List & Provider Replies   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 6: User Account Profile & Settings                                              │
│ └── Connect Account Info, Password Reset, and Avatar Updates                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Phase-by-Phase Integration Plan

### 🔹 Phase 1: Public Search & Catalog Discovery (Read-Only)
*Goal: Replace static mock listings on all public pages with live backend responses from `catalog-service`.*

#### 1.1 Stays & Room Search
* **Target Pages**: [`src/app/(public)/rooms/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/rooms/page.tsx), [`src/app/(public)/rooms/[id]/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/rooms/[id]/page.tsx)
* **API Endpoints**: 
  * `GET /api/v1/catalog/public/search/rooms` (`searchRooms`)
  * `GET /api/v1/catalog/public/items/rooms/{id}` (`getRoomById`)
* **Action Items**:
  * Replace `MOCK_BUSINESSES` room filtering with `searchRooms({ city, minPrice, maxPrice, page, size })`.
  * Wire room detail page to fetch via `getRoomById(id)`.

#### 1.2 Tour Packages Search
* **Target Pages**: [`src/app/(public)/tours/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/tours/page.tsx), [`src/app/(public)/tours/[id]/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/tours/[id]/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/catalog/public/search/tours` (`searchTours`)
  * `GET /api/v1/catalog/public/items/tours/{id}` (`getTourById`)
* **Action Items**:
  * Wire tour filtering dropdowns (Category, City, Provider Type, Price) to `searchTours()`.
  * Display day-by-day itinerary accordions directly from backend `itineraryDays` array.

#### 1.3 Tour Agencies & Guides Directory
* **Target Pages**: [`src/app/(public)/tour-agencies/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/tour-agencies/page.tsx), [`src/app/(public)/tour-guides/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/tour-guides/page.tsx), [`src/app/(public)/guide/[id]/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/guide/[id]/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/catalog/public/search/businesses?type=TOUR_AGENCY`
  * `GET /api/v1/catalog/public/search/businesses?type=TOUR_GUIDE`
  * `GET /api/v1/catalog/public/guides/{id}/blackout-dates`
* **Action Items**:
  * Connect agency and guide lists to backend business search endpoints.
  * Render guide blackout dates calendar from real backend availability.

#### 1.4 Extra Packages (Day Out & Night Out)
* **Target Pages**: [`src/app/(public)/extra-packages/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/extra-packages/page.tsx), [`src/app/(public)/extra-packages/[id]/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/extra-packages/[id]/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/catalog/public/items/day-out/{id}` (`getDayOutPackageById`)
  * `GET /api/v1/catalog/public/items/night-out/{id}` (`getNightOutPackageById`)

#### 1.5 Hotel / Business Profile Pages
* **Target Page**: [`src/app/(public)/business/[id]/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/business/[id]/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/catalog/public/search/business/{id}` (`getBusinessById`)
  * `GET /api/v1/catalog/public/businesses/{id}/faqs` (`getBusinessFaqs`)
* **Action Items**:
  * Fetch complete business profile (cover image, gallery, amenities, sustainability badges, host info).

---

### 🔹 Phase 2: Booking Engine & Traveler Checkout Flow
*Goal: Connect the checkout page and traveler dashboard to `booking-service`.*

#### 2.1 Checkout Submission
* **Target Page**: [`src/app/(public)/checkout/[bookingType]/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/checkout/[bookingType]/page.tsx)
* **API Endpoints**:
  * `POST /api/v1/bookings` (`createBooking`)
* **Action Items**:
  * Connect checkout form to `createBooking({ businessId, itemType, itemId, checkInDate, checkOutDate, paymentMethod, guestCount })`.
  * Handle response status and redirect to booking confirmation page.

#### 2.2 Traveler Bookings Dashboard
* **Target Page**: [`src/app/dashboard/bookings/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/dashboard/bookings/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/bookings/me` (`getMyBookings`)
  * `PUT /api/v1/bookings/{id}/cancel` (`cancelBooking`)
* **Action Items**:
  * Load traveler's active and past bookings.
  * Enable cancellation button connected to `cancelBooking(id)`.

---

### 🔹 Phase 3: Provider Onboarding & Business Owner Dashboard
*Goal: Enable supply-side onboarding and listing management via `catalog-service` and `booking-service`.*

#### 3.1 Provider Business Registration & Draft Submission
* **Target Pages**: Provider onboarding / registration forms
* **API Endpoints**:
  * `POST /api/v1/catalog/business/me/hotel/draft` (`createHotelDraft`)
  * `POST /api/v1/catalog/business/me/agency/draft` (`createAgencyDraft`)
  * `POST /api/v1/catalog/business/me/guide/draft` (`createGuideDraft`)
  * `POST /api/v1/catalog/business/me/submit` (`submitBusiness`)
* **Action Items**:
  * Form step submission to create draft business profiles.
  * Submit profile for admin verification (`status: PENDING`).

#### 3.2 Owner Listing Management (Rooms, Tours, Packages)
* **Target Pages**: Owner dashboard sub-pages
* **API Endpoints**:
  * `POST /api/v1/catalog/business/me/rooms` (`createRoom`)
  * `POST /api/v1/catalog/business/me/tour-packages` (`createTourPackage`)
  * `POST /api/v1/catalog/business/me/day-out-packages` (`createDayOutPackage`)
  * `POST /api/v1/catalog/business/me/night-out-packages` (`createNightOutPackage`)
* **Action Items**:
  * Wire management forms to backend POST/PUT/DELETE endpoints.

#### 3.3 Provider Incoming Bookings Overview
* **Target Page**: [`src/app/dashboard/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/dashboard/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/bookings/business/{businessId}` (`getBusinessBookings`)
  * `PUT /api/v1/bookings/{id}/status` (`updateBookingStatus`)
* **Action Items**:
  * Display incoming customer bookings for the owner's property.
  * Enable status updates (`CONFIRMED`, `CANCELLED`).

---

### 🔹 Phase 4: Admin Moderation Portal
*Goal: Connect platform administration pages to backend moderation APIs.*

#### 4.1 Pending Provider Verifications & Moderation Actions
* **Target Pages**: [`src/app/admin/verifications/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/admin/verifications/page.tsx), [`src/app/admin/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/admin/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/catalog/admin/business/pending` (`getPendingVerifications`)
  * `POST /api/v1/catalog/admin/business/{id}/approve` (`approveBusiness`)
  * `POST /api/v1/catalog/admin/business/{id}/reject` (`rejectBusiness`)
* **Action Items**:
  * Load pending business profiles awaiting SLTDA approval review.
  * Connect "Approve" button to `approveBusiness(id)` and "Reject" modal to `rejectBusiness(id, reason)`.

#### 4.2 Admin Business & User Management
* **Target Pages**: [`src/app/admin/hotels/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/admin/hotels/page.tsx), [`src/app/admin/agencies/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/admin/agencies/page.tsx), [`src/app/admin/guides/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/admin/guides/page.tsx), [`src/app/admin/users/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/admin/users/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/auth/admin/users`
  * `PUT /api/v1/auth/admin/users/{id}/role`
  * `DELETE /api/v1/auth/admin/users/{id}/soft-delete`
* **Action Items**:
  * Connect administrative management views to real backend user and catalog endpoints.

---

### 🔹 Phase 5: Verified Reviews & Ratings System
*Goal: Connect post-stay feedback collection and review responses.*

#### 5.1 Public Reviews & Rating Display
* **Target Pages**: [`src/app/(public)/business/[id]/reviews/page.tsx`](file:///c:/Users/sithu/OneDrive/Documents/GitHub/blueceylon/frontend/src/app/(public)/business/[id]/reviews/page.tsx)
* **API Endpoints**:
  * `GET /api/v1/catalog/public/reviews` (`getReviews`)
* **Action Items**:
  * Display paginated reviews filtered by `entityId` and `entityType`.

#### 5.2 Review Submission & Owner Response
* **Target Components**: Review submission form / modal, owner response UI
* **API Endpoints**:
  * `POST /api/v1/catalog/reviews` (`submitReview`)
  * `PUT /api/v1/catalog/reviews/{reviewId}/respond` (`respondToReview`)
* **Action Items**:
  * Wire traveler review form (enforces `bookingId` for hotel stays).
  * Wire owner reply box to `respondToReview(reviewId, text)`.

---

### 🔹 Phase 6: User Account Profile & Settings
*Goal: Connect user self-service settings.*

* **Target Page**: User account settings page
* **API Endpoints**:
  * `GET /api/account/me`
  * `PUT /api/account/me`
* **Action Items**:
  * Fetch and update traveler/owner profile details, contact numbers, and profile photo.

---

## 🧪 Verification Strategy per Phase

At the completion of each phase:
1. **Static Type Safety**: Run `npx tsc --noEmit` to verify 0 compilation errors.
2. **API Endpoint Verification**: Verify request and response payloads against the API Gateway (`http://localhost:8080`).
3. **UI State Verification**: Ensure loading skeletons, error toasts, and empty state fallbacks render gracefully.
