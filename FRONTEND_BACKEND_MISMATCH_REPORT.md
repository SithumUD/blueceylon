# 🔍 Frontend ↔ Backend Data Mismatch Report
> **BlueCeylon Project** | Generated: 2026-08-15
> Compares `frontend/src/lib/mock-data/` types with `catalog-service`, `booking-service`, and `auth-service` domain models.

---

## ⚡ Executive Summary

The frontend was built with **hand-crafted mock data** that closely reflects what was needed visually, but the backend was built with a **richer, production-grade domain model**. The two are about **70% aligned** — the core intent is the same, but there are gaps in field naming, enum values, and several backend-only fields that the frontend doesn't yet know about. The gaps fall into three categories:

| Category | Count | Action |
|----------|-------|--------|
| 🔴 **Breaking Mismatch** — Frontend sends/reads wrong field name or value, will cause API errors | 9 | Must fix before integration |
| 🟡 **Missing in Frontend** — Backend has rich data the UI doesn't display yet | 23 | Add to improve UX |
| 🟢 **Missing in Backend** — Frontend UI field doesn't exist in backend at all | 6 | Decide: add to backend or remove from UI |

---

## 📊 Section 1 — Business / Hotel Profile

### Frontend Shape (`business.ts` → `Business` interface)
```typescript
{
  id: string;
  name: string;
  category: "hotel" | "homestay" | "villa" | "tour"; // ⚠️ MISMATCH
  sltdaVerified: boolean;                              // ⚠️ MISMATCH - field doesn't exist in backend
  sltdaLicenseNumber: string;                         // ⚠️ MISMATCH - field name differs
  rating: number;                                     // ⚠️ MISMATCH - field name differs  
  reviewCount: number;
  location: {                                         // ⚠️ MISMATCH - nested object vs flat fields
    city: string;
    region: string;
    address: string;
    lat: number;
    lng: number;
  };
  priceStartFrom: number;                             // 🟢 Frontend only - no backend equivalent
  coverImage: string;                                 // ⚠️ MISMATCH - field name differs
  galleryImages: string[];                            // ⚠️ MISMATCH - field name differs
  description: string;
  amenities: string[];                                // ⚠️ MISMATCH - type differs (string[] vs Amenity[])
  rooms: RoomType[];
  dayOutPackages?: DayOutPackage[];
  nightOutPackages?: NightOutPackage[];
  tourPackages?: TourPackage[];
  host: { ... };                                      // 🟢 Frontend only - no backend equivalent
}
```

### Backend Shape (`Business.java` → `Hotel.java`)
```java
Business {
  id (UUID), name, description, tagline,
  contactEmail, contactPhone, whatsappNumber,
  socialLinks: Map<String, String>,
  website,
  ownerId,
  type: BusinessType (HOTEL, TOUR_AGENCY, TOUR_GUIDE), // ← actual enum
  status: ApprovalStatus (DRAFT, PENDING, APPROVED, REJECTED),
  rejectionReason,
  city: SriLankanCity (enum),
  region: Region (enum),
  latitude, longitude, addressLine,
  coverImagePublicId, coverImageUrl,
  galleryImageUrls: List<String>,
  videoUrl,
  verificationStatus: VerificationStatus,
  averageRating, reviewCount,
  responseTimeHours, responseRate,
  yearsInBusiness,
  sustainabilityBadges: List<SustainabilityBadge>,
  cancellationPolicy: CancellationPolicy,
  paymentMethods: List<PaymentMethod>,
  depositRequired, depositPercentage,
  translations: List<BusinessTranslation>,
  amenities: List<Amenity>,      // ← Amenity entity, not string
}
Hotel extends Business {
  starRating, totalBranches, propertyType: PropertyType,
  checkInTime, checkOutTime,
  facilities: List<Amenity>,
  diningOptions: List<DiningOption>,
  petPolicy: PetPolicy,
  childPolicy: ChildPolicy,
  totalRooms,
  offersDayOutPackages, offersNightOutPackages, offersHourlyBooking,
  rooms: List<Room>
}
```

### 🔴 Breaking Mismatches — Hotel/Business

| # | Field | Frontend Value | Backend Value | Fix Required |
|---|-------|---------------|---------------|--------------|
| 1 | Business type discriminator | `category: "hotel" \| "homestay" \| "villa" \| "tour"` | `type: "HOTEL" \| "TOUR_AGENCY" \| "TOUR_GUIDE"` | **Replace** `category` with `type` in frontend. `homestay` and `villa` map to `HOTEL` (use `propertyType` to distinguish) |
| 2 | Cover image field name | `coverImage` | `coverImageUrl` | **Rename** `coverImage` → `coverImageUrl` in frontend |
| 3 | Gallery images field name | `galleryImages` | `galleryImageUrls` | **Rename** `galleryImages` → `galleryImageUrls` in frontend |
| 4 | Amenities type | `amenities: string[]` (e.g. `"Mountain View"`) | `amenities: Amenity[]` (object with `id`, `name`, `scope`, `iconKey`) | **Change** frontend to `amenities.map(a => a.name)` for display |
| 5 | Location object | `location: { city, region, address, lat, lng }` | Flat fields: `city`, `region`, `addressLine`, `latitude`, `longitude` | **Destructure** backend flat fields when mapping to frontend display |
| 6 | Rating field name | `rating` | `averageRating` | **Rename** to `averageRating` |
| 7 | `sltdaVerified` | `boolean` | **Does not exist** — backend uses `verificationStatus: VerificationStatus` | **Change** frontend to check `verificationStatus === "VERIFIED"` |
| 8 | `sltdaLicenseNumber` on Business | Exists on Business | `sltdaLicenseNumber` only on `TourGuideProfile` (as `sltdaLicenseNumber`) and `TourAgency` (as `licenseNumber`) | Frontend should get this from nested `licenseNumber` field, not top-level Business |
| 9 | Region values | `"HILL_COUNTRY"`, `"SOUTH_COAST"`, `"CULTURAL_TRIANGLE"`, `"Badulla District"` (free text) | Enum: `WESTERN`, `CENTRAL`, `SOUTHERN`, `NORTHERN`, `EASTERN`, `NORTH_WESTERN`, `NORTH_CENTRAL`, `UVA`, `SABARAGAMUWA` | **Replace** custom region strings with backend `Region` enum values |

### 🟡 Backend Fields Missing in Frontend UI (Hotel)

These backend fields exist and are valuable for UX — the frontend should display them:

| Field | Description | UX Recommendation |
|-------|-------------|-------------------|
| `tagline` | Short catchy tagline (100 chars) | Display below hotel name on card |
| `videoUrl` | Promo video URL | Embed in the hotel gallery section |
| `responseTimeHours` | Average response time in hours | Show "Responds in ~2 hours" badge |
| `responseRate` | % of inquiries responded to | Show host responsiveness bar |
| `sustainabilityBadges` | Eco certifications | Eco badge chip on listing card |
| `cancellationPolicy` | Cancellation policy enum | Show on checkout sidebar |
| `paymentMethods` | `PAYHERE`, `CASH`, `BANK_TRANSFER` | Show payment icons on listing |
| `depositRequired`, `depositPercentage` | Deposit info | Show on checkout: "20% deposit required" |
| `yearsInBusiness` | Years operating | Trust signal on profile |
| `contactPhone`, `whatsappNumber` | Direct contact | WhatsApp CTA button |
| `website`, `socialLinks` | External links | Social icons on profile footer |
| `checkInTime`, `checkOutTime` | Hotel check-in/out times | Show on room booking flow |
| `petPolicy` | Pet policy | Filter option + info badge |
| `offersDayOutPackages`, `offersNightOutPackages`, `offersHourlyBooking` | Package availability flags | Tab shows/hides on business profile |
| `starRating` | Hotel star rating (1–5) | Star display on hotel cards |
| `propertyType` | `HOTEL`, `VILLA`, `RESORT`, `BOUTIQUE_HOTEL` etc | Filter and badge display |

### 🟢 Frontend-Only Fields (Not in Backend)

| Field | In Frontend | Recommendation |
|-------|-------------|----------------|
| `host.name`, `host.joinedYear`, `host.superhost`, `host.avatar` | Owner info displayed on profile | **Add to backend**: add `displayName`, `joinedAt`, `avatarUrl` to `User` in auth-service, and expose via `/api/account/me`. Or derive from `ownerId` via auth-service lookup |
| `priceStartFrom` | Cheapest room price, shown on card | **Compute in backend**: add a computed/derived field in the catalog response DTO — the minimum `pricePerNight` from the hotel's rooms list |

---

## 📊 Section 2 — Room Details

### Frontend Shape (`RoomType` in `businesses.ts`)
```typescript
{
  id: string;
  name: string;            // ⚠️ MISMATCH - no "name" field in backend
  pricePerNight: number;
  capacity: number;
  bedType: string;         // ⚠️ MISMATCH - field name differs
  available: boolean;      // ⚠️ MISMATCH - backend uses date range
  image: string;           // ⚠️ MISMATCH - backend is imageUrls[]
}
```

### Backend Shape (`Room.java`)
```java
Room {
  id, hotel,
  roomNumber,              // ← the "room number" (e.g. "101")
  roomType: RoomType,      // ← enum (STANDARD, DELUXE, SUITE, etc.)
  city: SriLankanCity,
  pricePerNight,
  currency: Currency,
  capacity, bedCount, sizeSquareMeters,
  availableFrom, availableTo,  // ← date-range availability
  totalUnits,
  version,
  imageUrls: List<String>,
  amenities: List<Amenity>,
  viewType: ViewType,
  bedConfiguration,        // ← the "bedType" string equivalent
  smokingAllowed,
  isHourlyBookable
}
```

### 🔴 Breaking Mismatches — Room

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | Room name | `name: "Mountain Mist Deluxe King Suite"` (human-friendly display name) | No `name` field — backend uses `roomType` enum + `roomNumber` | **Frontend** should compose display name from `roomType + roomNumber` or add `displayName` field to backend Room |
| 2 | Bed type | `bedType: "1 King Bed"` | `bedConfiguration: "1 King Bed"` | **Rename** `bedType` → `bedConfiguration` in frontend |
| 3 | Availability | `available: boolean` | `availableFrom: LocalDate`, `availableTo: LocalDate` | **Replace** with date-range logic — check if requested dates fall within `availableFrom`/`availableTo` |
| 4 | Image | `image: string` (single URL) | `imageUrls: List<String>` (gallery) | **Update** frontend to use `imageUrls[0]` as the primary and show gallery |
| 5 | Currency | Not present | `currency: Currency` (LKR/USD/EUR/GBP) | **Add** currency display to frontend price |

### 🟡 Backend Room Fields Missing in Frontend UI

| Field | UX Value |
|-------|----------|
| `viewType` (LAKE_VIEW, MOUNTAIN_VIEW, etc.) | Filter and badge on room card |
| `sizeSquareMeters` | Room specs section |
| `bedCount` | Displayed in room specs |
| `smokingAllowed` | Room policy badge |
| `amenities` | Room-specific amenity chips |
| `isHourlyBookable` | Show "Hourly Rate Available" tag |
| `totalUnits` | "Only 3 rooms left" scarcity messaging |
| `roomType` enum | Category badge (SUITE, DELUXE, etc.) |

---

## 📊 Section 3 — Tour Packages

### Frontend Shape (`TourPackage` in `businesses.ts`)
```typescript
{
  id: string;
  title: string;
  description: string;
  duration: string;               // e.g. "Half Day (5 Hours)" — free text
  price: number;
  pricingUnit: "PER_PERSON";
  highlights: string[];           // ⚠️ MISMATCH - backend uses inclusions (Amenity[])
  includedTransport: string;      // ⚠️ MISMATCH - field name differs
  image: string;                  // ⚠️ MISMATCH - backend is imageUrls[]
}
```

### Backend Shape (`TourPackage.java`)
```java
TourPackage {
  id, title, description,
  price, currency,
  durationDays: Integer,          // ← integer days, NOT free text
  category: TourCategory,
  startingCity: SriLankanCity,
  ownerId, ownerType: OwnerType,
  minGroupSize, maxGroupSize,
  imageUrls: List<String>,
  itineraryDays: List<ItineraryDay>,  // ← full day-by-day itinerary
  pricingTiers: List<GroupPricingTier>,
  translations: List<TourPackageTranslation>,
  inclusions: List<Amenity>,          // ← amenity objects, not strings
  scheduledDepartureDates: Set<LocalDate>,
  difficultyLevel: DifficultyLevel,
  physicalRequirements,
  transportModeIncluded: VehicleType, // ← enum, not free text
  mealsIncluded: MealPlan,
  accommodationIncluded: Boolean,
  isPrivateTour: Boolean
}
```

### 🔴 Breaking Mismatches — Tour Package

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | Duration | `duration: "Half Day (5 Hours)"` (free text) | `durationDays: Integer` (e.g. `1`) | **Frontend** should derive text from integer: `durationDays === 0.5 ? "Half Day" : durationDays + " Day(s)"`. Or add `durationLabel` to backend DTO |
| 2 | Highlights/inclusions | `highlights: string[]` (free text e.g. `"Ella Rock Summit"`) | `inclusions: List<Amenity>` (objects with id/name) | **Map** `inclusions.map(a => a.name)` on frontend display |
| 3 | Transport | `includedTransport: "Tuk-Tuk Pick & Drop"` (free text) | `transportModeIncluded: VehicleType` (enum: `TUK_TUK`, `VAN`, `SUV`, etc.) | **Replace** free text with enum-based label map |
| 4 | Image | `image: string` (single) | `imageUrls: List<String>` | **Update** to use `imageUrls[0]` |
| 5 | Transport enum values mismatch | Frontend filter has `"SUV"`, `"VAN"`, `"COACH"`, `"TUKTUK"`, `"NONE"` | Backend: `TUK_TUK`, `CAR`, `VAN`, `SUV`, `MINIBUS`, `COACH`, `MOTORBIKE`, `NONE` | **Sync** frontend filter options: `TUKTUK` → `TUK_TUK`, add `MINIBUS`, `MOTORBIKE` |
| 6 | Meal Plan enum mismatch | Frontend filter has `"BREAKFAST_ONLY"` | Backend MealPlan enum: `BREAKFAST_ONLY` ✅ (this one matches!) — but frontend dropdown shows `"All Inclusive"` mapped to `"ALL_INCLUSIVE"` which matches backend ✅ | No fix needed for meal plan enum — they match |

### 🟡 Backend Tour Fields Missing in Frontend UI

| Field | UX Value |
|-------|----------|
| `itineraryDays` (day-by-day breakdown) | **High priority** — show day-by-day itinerary accordion on tour detail page |
| `scheduledDepartureDates` | Calendar-based date picker for tour departure selection |
| `pricingTiers` (group pricing) | "Group of 10+: $40/pp" pricing table |
| `category` (TourCategory enum) | Category badge and filter |
| `startingCity` | "Departing from: Colombo" on tour card |
| `minGroupSize`, `maxGroupSize` | "2–12 travelers" info on listing |
| `difficultyLevel` | Difficulty badge (EASY / MODERATE / CHALLENGING) |
| `physicalRequirements` | Warning text for fitness-sensitive travelers |
| `accommodationIncluded` | "Includes overnight stay" badge |
| `isPrivateTour` | "Private Tour" badge |
| `currency` | Currency display (USD vs LKR) |

---

## 📊 Section 4 — Day-Out & Night-Out Packages

### Frontend Shape
```typescript
DayOutPackage {
  pricingUnit: "PER_PERSON" | "PER_COUPLE" | "PER_FAMILY";  // ⚠️ MISMATCH
  inclusions: string[];                                      // ⚠️ MISMATCH
}
NightOutPackage {
  pricingUnit: "PER_COUPLE" | "PER_PERSON";                 // ⚠️ MISMATCH
  includesOvernightStay: boolean;                            // 🟢 Frontend only
}
```

### Backend Shape (`DayOutPackage.java`)
```java
DayOutPackage {
  title, description, price,
  currency: Currency,
  pricingUnit: PricingUnit,         // enum: PER_PERSON, PER_GROUP, FLAT_RATE
  startTime, endTime,
  inclusions: List<Amenity>,        // objects, not strings
  maxOccupancy, dailyLimit,
  childPolicy: ChildPolicy,
  availableDays: List<DayOfWeek>,
  imageUrls: List<String>,
  advanceBookingHoursRequired,
  hotel
}
```

### 🔴 Breaking Mismatches — Day/Night Out Packages

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | `pricingUnit` values | `"PER_COUPLE"`, `"PER_FAMILY"` | Enum: `PER_PERSON`, `PER_GROUP`, `FLAT_RATE` | **Replace** `PER_COUPLE` → `PER_GROUP`, `PER_FAMILY` → `PER_GROUP`. No `PER_COUPLE` in backend |
| 2 | `inclusions` type | `inclusions: string[]` | `inclusions: List<Amenity>` | **Map** `inclusions.map(a => a.name)` for display |
| 3 | `includesOvernightStay` on NightOut | `boolean` | **Does not exist** in `NightOutPackage.java` | **Decision needed**: Either add `includesOvernightStay` to backend `NightOutPackage`, or remove from frontend |

### 🟡 Backend Day/Night Package Fields Missing in Frontend

| Field | UX Value |
|-------|----------|
| `availableDays` | "Available Mon–Fri only" |
| `advanceBookingHoursRequired` | "Book at least 24 hrs in advance" warning |
| `maxOccupancy` | "Max 20 guests" capacity chip |
| `dailyLimit` | Scarcity indicator |
| `childPolicy` | "Children allowed / Child discount" info |
| `currency` | Currency indicator |

---

## 📊 Section 5 — Tour Guide Profile

### Frontend Shape (`Guide` interface in `guides.ts`)
```typescript
Guide {
  id: string;
  name: string;
  title: string;              // ⚠️ MISMATCH - "Licensed Hill Country Specialist" — backend has `tagline`
  languages: string[];        // ⚠️ MISMATCH - field name differs
  rating: number;             // ⚠️ MISMATCH - backend uses `averageRating`
  reviewCount: number;
  sltdaVerified: boolean;     // ⚠️ MISMATCH - backend uses `verificationStatus`
  sltdaLicenseNumber: string; // ✅ Exists in backend as `sltdaLicenseNumber`
  dailyRateUSD: number;       // ⚠️ MISMATCH - field name
  avatar: string;             // 🟢 Frontend only
  coverImage: string;         // ⚠️ MISMATCH - field name
  bio: string;                // ⚠️ MISMATCH - field name
  specialties: string[];      // ⚠️ MISMATCH - backend uses enum specialtyAreas
  vehicle: {                  // ⚠️ MISMATCH - backend is VehicleType enum
    type: string;
    model: string;
    airConditioned: boolean;
  };
}
```

### Backend Shape (`TourGuideProfile.java`)
```java
TourGuideProfile {
  userId, name,
  description,              // ← the "bio"
  tagline,                  // ← the "title" on the card
  contactEmail, contactPhone, whatsappNumber,
  socialLinks, website,
  status: ApprovalStatus,
  city, region, latitude, longitude, addressLine,
  coverImageUrl,            // ← "coverImage" in frontend
  galleryImageUrls,
  videoUrl,
  verificationStatus,       // ← sltdaVerified equivalent
  averageRating,            // ← "rating"
  reviewCount,
  responseTimeHours, responseRate,
  yearsInBusiness,
  sustainabilityBadges, cancellationPolicy,
  paymentMethods, depositRequired, depositPercentage,
  sltdaLicenseNumber,
  licenseType,
  languagesSpoken: List<String>,  // ← "languages"
  yearsOfExperience,
  vehicleType: VehicleType,  // ← enum only, no model/airCon info
  specialtyAreas: List<GuideSpecialtyArea>,  // ← enum, not string[]
  coverageRegions: List<Region>,
  dailyRate, halfDayRate,    // ← "dailyRateUSD" (currency not specified in field name)
  certifications: List<String>,
  maxGroupSizeGuided,
  blackoutDates: List<GuideBlackoutDate>
}
```

### 🔴 Breaking Mismatches — Tour Guide

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | Bio/description | `bio` | `description` | **Rename** `bio` → `description` |
| 2 | Cover image | `coverImage` | `coverImageUrl` | **Rename** `coverImage` → `coverImageUrl` |
| 3 | Languages | `languages` | `languagesSpoken` | **Rename** `languages` → `languagesSpoken` |
| 4 | Rating | `rating` | `averageRating` | **Rename** `rating` → `averageRating` |
| 5 | Specialties | `specialties: string[]` (free text) | `specialtyAreas: List<GuideSpecialtyArea>` (enum) | **Map** `specialtyAreas.map(s => s.toString())` or use enum labels |
| 6 | Vehicle | `vehicle: { type, model, airConditioned }` | `vehicleType: VehicleType` (enum only — no model or airConditioned) | **Decision**: Either add `vehicleModel` and `vehicleAirConditioned` to backend `TourGuideProfile`, or remove model/airCon display from frontend |
| 7 | Daily rate field name | `dailyRateUSD` | `dailyRate` (currency implied by context) | **Rename** to `dailyRate`; show currency label separately |

### 🟡 Backend Guide Fields Missing in Frontend UI

| Field | UX Value |
|-------|----------|
| `halfDayRate` | "Half Day: $40" pricing option |
| `certifications` | Credentials list on guide profile |
| `coverageRegions` | "Covers: Central, Southern" map regions |
| `maxGroupSizeGuided` | "Max group: 8 people" |
| `blackoutDates` | Availability calendar |
| `licenseType` | "Government Certified" badge type |
| `yearsOfExperience` | "8 Years Experience" trust signal |
| `responseTimeHours` | "Responds within 1 hour" |
| `tagline` | Short sell line under name |

---

## 📊 Section 6 — Tour Agency

### Frontend Shape (`TourAgency` in `agencies.ts`)
```typescript
TourAgency {
  agencyName: string;          // ⚠️ MISMATCH - backend uses `name`
  city: string;                // Frontend: "Colombo" (free text) vs backend enum
  region: string;              // Frontend: "WESTERN_PROVINCE" vs backend: "WESTERN"
  sltdaVerified: boolean;      // ⚠️ MISMATCH - backend uses verificationStatus
  yearsInOperation: number;    // ⚠️ MISMATCH - backend uses `yearsInBusiness`
  fleetTypes: string[];        // ⚠️ MISMATCH - backend is VehicleType enum list
  specializations: string[];   // ⚠️ MISMATCH - backend is AgencySpecialization enum list
  featuredPackage: { ... };    // 🟢 Frontend only - computed UI field
}
```

### 🔴 Breaking Mismatches — Tour Agency

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | `agencyName` | `agencyName` | `name` (inherited from `Business`) | **Rename** `agencyName` → `name` in frontend |
| 2 | `yearsInOperation` | `yearsInOperation: 8` | `yearsInBusiness: Integer` | **Rename** `yearsInOperation` → `yearsInBusiness` |
| 3 | `region` values | `"WESTERN_PROVINCE"`, `"SOUTH_COAST"`, `"CULTURAL_TRIANGLE"` | Enum: `WESTERN`, `CENTRAL`, `SOUTHERN`, etc. | **Map** custom values to backend Region enum |
| 4 | `fleetTypes` | `string[]` e.g. `"4x4 Luxury SUVs"`, `"AC Passenger Vans"` | `VehicleType[]` enum: `TUK_TUK`, `VAN`, `SUV`, `COACH`, etc. | **Map** to enum values; display labels for users |
| 5 | `specializations` | `string[]` e.g. `"Wildlife Safaris"` | `AgencySpecialization[]` enum | **Map** to enum values |

---

## 📊 Section 7 — Reviews

### Frontend Shape (`Review` in `reviews.ts`)
```typescript
Review {
  id: string;
  businessId: string;           // ⚠️ MISMATCH - backend uses entityId + entityType
  guestName: string;            // ⚠️ MISMATCH - backend field name
  guestCountry: string;         // 🟢 Frontend only
  rating: number;
  date: string;                 // ⚠️ MISMATCH - format and field name
  verifiedStay: boolean;        // ⚠️ MISMATCH - field name
  bookingRef: string;           // ⚠️ MISMATCH - backend uses bookingId (UUID)
  comment: string;
  ownerResponse?: {             // ⚠️ MISMATCH - structure differs
    date: string;
    comment: string;
  };
}
```

### Backend Shape (`Review.java`)
```java
Review {
  id,
  reviewerUserId,
  reviewerName,                // ← "guestName"
  rating,
  comment,
  entityType: ReviewEntityType, // ← HOTEL, ROOM, TOUR_PACKAGE, TOUR_GUIDE, etc.
  entityId,                    // ← "businessId" in frontend (but more flexible — can be a room or tour)
  stayOrTourDate,              // ← LocalDate (not the review creation date)
  verified: Boolean,           // ← "verifiedStay"
  bookingId: String,           // ← UUID, not a human-readable "BC-2026-XXXX" ref
  providerResponse: String     // ← "ownerResponse.comment" (no separate date field)
}
```

### 🔴 Breaking Mismatches — Reviews

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | Entity reference | `businessId` | `entityId` + `entityType` | **Replace** `businessId` with `entityId`; add `entityType` selector to review form |
| 2 | Guest name | `guestName` | `reviewerName` | **Rename** `guestName` → `reviewerName` |
| 3 | Verified flag | `verifiedStay` | `verified` | **Rename** `verifiedStay` → `verified` |
| 4 | Booking reference | `bookingRef: "BC-2026-8819"` (human-readable) | `bookingId: UUID` | **Use UUID** for API; display the human-readable `bookingRef` label separately (or generate it in the frontend from the UUID) |
| 5 | Owner response | `ownerResponse: { date, comment }` | `providerResponse: String` only (no date) | **Remove** `ownerResponse.date` display — or add `providerResponseAt` to backend |
| 6 | Review date | `date: "July 12, 2026"` (human-readable string) | `stayOrTourDate: LocalDate` (ISO date: `2026-07-12`) | **Format** `stayOrTourDate` with `date-fns` to display `"July 12, 2026"` |

### 🟢 Frontend-Only Review Fields
| Field | Recommendation |
|-------|----------------|
| `guestCountry` | **Add** to backend `Review` entity for richer social proof (e.g. "Charlotte M. from UK") — or store in auth-service user profile |

---

## 📊 Section 8 — Booking

### Frontend Shape (`DashboardBooking` in `bookings.ts`)
```typescript
DashboardBooking {
  id: string;
  bookingRef: string;              // 🟢 Frontend only (human-readable)
  guestName: string;
  guestEmail: string;
  propertyName: string;            // 🟢 Frontend only (denormalized display)
  roomName: string;                // 🟢 Frontend only (denormalized display)
  checkIn: string;
  checkOut: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  totalPriceUSD: number;           // ⚠️ MISMATCH - assumes USD only
  paymentMethod: "PAY_AT_PROPERTY" | "CREDIT_CARD"; // ⚠️ MISMATCH - enum values differ
}
```

### Backend Shape (`BookingRequest.java` / Booking entity)
```java
Booking {
  businessId,
  itemType: ItemType,        // ROOM, TOUR_PACKAGE, DAY_OUT_PACKAGE, etc.
  itemId,
  checkInDate, checkOutDate,
  startTime, endTime,
  quantity,
  guestCount,
  paymentMethod: PaymentMethod  // PAYHERE, CASH, BANK_TRANSFER
}
BookingStatus: PENDING, CONFIRMED, CANCELLED, COMPLETED, EXPIRED
```

### 🔴 Breaking Mismatches — Booking

| # | Field | Frontend | Backend | Fix |
|---|-------|----------|---------|-----|
| 1 | Payment method values | `"PAY_AT_PROPERTY"`, `"CREDIT_CARD"` | `"PAYHERE"`, `"CASH"`, `"BANK_TRANSFER"` | **Replace** frontend enum with backend values. `PAY_AT_PROPERTY` → `CASH`, `CREDIT_CARD` → `PAYHERE` |
| 2 | Booking status | `"CONFIRMED"`, `"PENDING"`, `"CANCELLED"` (3 values) | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED` (5 values) | **Add** `COMPLETED` and `EXPIRED` status handling in frontend dashboard |
| 3 | Total price currency | `totalPriceUSD` (assumes USD) | Multi-currency backend | **Rename** to `totalPrice` + add `currency` field display |

---

## 📊 Section 9 — Enums Comparison Summary

| Enum | Frontend Values | Backend Values | Status |
|------|----------------|----------------|--------|
| **Business Category** | `"hotel"`, `"homestay"`, `"villa"`, `"tour"` | `HOTEL`, `TOUR_AGENCY`, `TOUR_GUIDE` | 🔴 Mismatch |
| **Region** | `"HILL_COUNTRY"`, `"SOUTH_COAST"`, `"CULTURAL_TRIANGLE"`, `"Badulla District"` | `WESTERN`, `CENTRAL`, `SOUTHERN`, `NORTHERN`, `EASTERN`, `NORTH_WESTERN`, `NORTH_CENTRAL`, `UVA`, `SABARAGAMUWA` | 🔴 Mismatch |
| **Vehicle Type** | `"SUV"`, `"VAN"`, `"COACH"`, `"TUKTUK"`, `"NONE"`, `"Luxury SUV / Van"` | `TUK_TUK`, `CAR`, `VAN`, `SUV`, `MINIBUS`, `COACH`, `MOTORBIKE`, `NONE` | 🔴 Mismatch |
| **Meal Plan** | `"BREAKFAST_ONLY"`, `"HALF_BOARD"`, `"FULL_BOARD"`, `"ALL_INCLUSIVE"`, `"NONE"` | `NONE`, `BREAKFAST_ONLY`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE` | ✅ Match |
| **Difficulty Level** | `"EASY"`, `"MODERATE"`, `"CHALLENGING"` (missing `EXTREME`) | `EASY`, `MODERATE`, `CHALLENGING`, `EXTREME` | 🟡 Partial |
| **Pricing Unit** | `"PER_PERSON"`, `"PER_COUPLE"`, `"PER_FAMILY"` | `PER_PERSON`, `PER_GROUP`, `FLAT_RATE` | 🔴 Mismatch |
| **Payment Method** | `"PAY_AT_PROPERTY"`, `"CREDIT_CARD"` | `PAYHERE`, `CASH`, `BANK_TRANSFER` | 🔴 Mismatch |
| **Booking Status** | `"CONFIRMED"`, `"PENDING"`, `"CANCELLED"` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED` | 🟡 Partial |
| **Tour Category** | `"ADVENTURE"`, `"WILDLIFE"`, `"CULTURAL"`, `"BEACH"` | `CULTURAL`, `ADVENTURE`, `WILDLIFE`, `BEACH`, `SPIRITUAL`, `WELLNESS`, `HISTORICAL`, `ECO`, `CULINARY` | 🟡 Partial (frontend has subset) |

---

## 🎯 Recommendations

### Priority 1 — Fix Before Any Real API Integration (Breaking)

These will cause runtime errors the moment you wire up the real API:

1. **Rename all image fields** across the app: `coverImage` → `coverImageUrl`, `galleryImages` → `galleryImageUrls`, `image` → `imageUrls[0]`
2. **Replace `sltdaVerified: boolean`** with `verificationStatus === "VERIFIED"` check
3. **Fix the business `category` enum** — use `type: "HOTEL" | "TOUR_AGENCY" | "TOUR_GUIDE"` and use `propertyType` for villa/homestay distinction
4. **Fix the `location` object** — flatten to match backend: `city`, `region`, `addressLine`, `latitude`, `longitude`
5. **Sync all enum values**: Region, VehicleType, PricingUnit, PaymentMethod
6. **Fix `amenities` and `inclusions`** — map `Amenity[]` to `string[]` via `.map(a => a.name)` in API client layer
7. **Fix review fields**: `businessId` → `entityId` + `entityType`, `guestName` → `reviewerName`, `verifiedStay` → `verified`
8. **Fix booking payment methods**: remove `PAY_AT_PROPERTY`, `CREDIT_CARD`; add `PAYHERE`, `CASH`, `BANK_TRANSFER`

### Priority 2 — Keep Backend Data Set (Add to Frontend UI)

The backend has richer data. **Keep the backend data model — it is the source of truth.** Extend the frontend UI to use these backend-only fields for a more premium experience:

- **Hotel cards**: Add `tagline`, `starRating`, `sustainabilityBadges`, `responseTimeHours`, payment method icons
- **Tour detail pages**: Add `itineraryDays` day-by-day accordion — this is the biggest UX gap
- **Tour cards**: Add `difficultyLevel` badge, `scheduledDepartureDates` picker, group size info
- **Guide profiles**: Add `halfDayRate`, `certifications`, `coverageRegions`, `yearsOfExperience`
- **Booking dashboard**: Add `COMPLETED` and `EXPIRED` status tabs

### Priority 3 — Decide: Add to Backend or Remove from Frontend

These frontend UI elements have **no backend equivalent** — you must decide:

| Frontend Field | Recommendation |
|----------------|----------------|
| `host.avatar` (profile photo of hotel owner) | ✅ **Add to auth-service** — add `avatarUrl` to User profile. Worth it for trust signals. |
| `host.name` (owner display name on listing) | ✅ **Add to auth-service** — expose `displayName` from User. |
| `host.superhost` | ✅ **Add to Business** — `isSuperhost: boolean` or compute from `responseRate >= 90% && averageRating >= 4.8` |
| `host.joinedYear` | ✅ **Derive** from `Business.createdAt` — no new field needed |
| `priceStartFrom` on hotel card | ✅ **Compute in backend DTO** — return `min(rooms.pricePerNight)` in the business list response |
| `vehicle.model`, `vehicle.airConditioned` on guide | ⚠️ **Add to backend** only if guide vehicle quality is a key differentiator. Otherwise just display the `VehicleType` enum label ("SUV", "Van") |
| `guestCountry` on review | ⚠️ **Optional** — could come from user profile. Only add if the "from UK" social proof is important to your UX |
| `bookingRef` (human-readable BC-2026-XXXX) | ✅ **Generate in backend** — add a `bookingReference` string field to the Booking entity |
| `NightOutPackage.includesOvernightStay` | ✅ **Add to backend** `NightOutPackage` — this is a genuinely useful field |
| `ownerResponse.date` on review | ✅ **Add `providerResponseAt: LocalDateTime`** to backend `Review` — useful for showing "Responded 2 days ago" |

---

## 🗺️ Integration Roadmap

```
Phase 1: Field Name Fixes (1–2 days)
  ├── Create src/lib/api/mappers.ts — transform backend response to frontend types
  ├── Fix all image field names
  ├── Fix amenity type mapping
  ├── Fix rating/reviewCount field names
  └── Fix sltdaVerified → verificationStatus

Phase 2: Enum Sync (1 day)
  ├── Update all filter dropdowns with backend enum values
  ├── Create src/lib/enums/ — centralized enum value ↔ display label maps
  └── Fix region, vehicle, payment method, pricing unit values

Phase 3: UI Enrichment (3–5 days)
  ├── Add itinerary accordion to tour detail page
  ├── Add sustainability badge chips to hotel cards
  ├── Add departure date calendar to tour booking
  ├── Add guide rates (half-day) and certifications
  └── Add hotel check-in/out times + deposit info to checkout

Phase 4: Backend Additions (1–2 days in backend)
  ├── Add bookingReference (human-readable) to Booking entity
  ├── Add priceStartFrom computed field to business list DTO
  ├── Add providerResponseAt to Review entity
  ├── Add includesOvernightStay to NightOutPackage
  └── Add avatarUrl/displayName to auth-service User profile
```

---

> **Key Decision**: The backend domain model is richer and more production-ready. The recommended approach is to **treat the backend as the source of truth** and create a thin **API-to-Frontend mapper layer** in `src/lib/api/mappers.ts` that transforms backend responses into the shapes the UI components currently expect — then progressively enrich the UI to expose the backend's richer data fields.
