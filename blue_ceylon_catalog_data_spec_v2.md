# Blue Ceylon Catalog Data Specification (v2 — Traveler Discovery Edition)

This document extends the original Catalog Data Specification. It adds fields designed to (a) help travelers compare and choose confidently between Hotels, Tour Agencies, and Tour Guides, and (b) let providers showcase their full range of services — including new short-experience offerings for hotels: **Day Out Packages**, **Night Out Packages**, and **Hourly Room Bookings**.

Fields carried over unchanged from v1 are marked **[v1]**. New or expanded fields are marked **[NEW]**.

---

## 1. Business Profiles

Every service provider creates exactly **one** business profile of type `HOTEL`, `TOUR_AGENCY`, or `TOUR_GUIDE`.

### 1.1 Shared Data (Required for ALL profile types)

**Core identity**
- **`name`** / **`displayName`** (String) **[v1]** — Official name of the business or guide.
- **`description`** / **`bio`** (String) **[v1]** — Detailed description of services offered.
- **`tagline`** (String, ≤100 chars) **[NEW]** — Short hook shown on search/list cards (e.g., "Boutique hillside stays above Ella").
- **`contactEmail`** (String) **[v1]**
- **`contactPhone`** (String) **[v1]**
- **`whatsappNumber`** (String) **[NEW]** — Widely used for booking inquiries in Sri Lanka's tourism trade.
- **`socialLinks`** (Map: platform → URL; Instagram, Facebook, TikTok, YouTube) **[NEW]**
- **`website`** (String URL, optional) **[NEW]**

**Location**
- **`city`** (Enum: `SriLankanCity`) **[v1]**
- **`region`** (Enum: e.g., HILL_COUNTRY, SOUTH_COAST, CULTURAL_TRIANGLE, EAST_COAST, WILDLIFE_BELT) **[NEW]** — Coarser grouping travelers search by more often than exact city.
- **`addressLine`** (String) **[v1]**
- **`latitude`** / **`longitude`** (Double) **[v1]**
- **`distanceToAirportKm`** (Double) **[NEW]**
- **`distanceToBeachKm`** (Double, nullable) **[NEW]**
- **`nearbyAttractions`** (List of `{name: String, distanceKm: Double}`) **[NEW]** — Powers "near Sigiriya / near Yala" style discovery.

**Media**
- **`coverImageUrl`** / **`profileImageUrl`** (String URL) **[v1]**
- **`galleryImageUrls`** (List of Strings) **[NEW]** — Full photo gallery beyond single cover shot.
- **`videoUrl`** (String, optional) **[NEW]** — Short walkthrough/promo video.

**Trust & discovery**
- **`verificationStatus`** (Enum: `PENDING`, `VERIFIED`, `SUSPENDED`) **[NEW]** — Admin/SLTDA-backed verification badge.
- **`averageRating`** (Double, computed, 0–5) **[NEW]**
- **`reviewCount`** (Integer, computed) **[NEW]**
- **`responseTimeHours`** (Double, computed) **[NEW]** — Average reply time to inquiries.
- **`responseRate`** (Double %, computed) **[NEW]**
- **`spokenLanguages`** (List of Strings) **[NEW]** — Front-desk/agency languages (not just Tour Guide).
- **`yearsInBusiness`** (Integer) **[NEW]** — Generalized version of agency-only `yearsInOperation`.
- **`sustainabilityBadges`** (List of Enum: `ECO_CERTIFIED`, `COMMUNITY_BASED_TOURISM`, `LOCALLY_OWNED`, `PLASTIC_FREE`) **[NEW]**
- **`policies`** (Object) **[NEW]**
  - **`cancellationPolicy`** (Enum: `FLEXIBLE`, `MODERATE`, `STRICT`, or free text)
  - **`paymentMethods`** (List: `CASH`, `CARD`, `BANK_TRANSFER`, `ONLINE_GATEWAY`)
  - **`depositRequired`** (Boolean), **`depositPercentage`** (Double)

---

### 1.2 A. Hotel Profile
Shared data, plus:

- **`starRating`** (Integer, 1–5) **[v1]**
- **`totalBranches`** (Integer, default 1) **[v1]**
- **`propertyType`** (Enum: `HOTEL`, `RESORT`, `BOUTIQUE`, `VILLA`, `HOMESTAY`, `ECO_LODGE`, `GUESTHOUSE`) **[NEW]** — Sri Lanka's market is driven heavily by boutique/villa/eco-lodge stays, not just "hotel."
- **`checkInTime`** / **`checkOutTime`** (LocalTime) **[NEW]**
- **`facilities`** (List of Amenity IDs, property-level: pool, spa, restaurant, bar, Ayurveda center, gym, airport shuttle, parking, EV charging, co-working space) **[NEW]** — Distinct from room-level amenities.
- **`diningOptions`** (List of `{name, cuisineType, mealsServed}`) **[NEW]**
- **`petPolicy`** (Enum: `ALLOWED`, `NOT_ALLOWED`, `ON_REQUEST`) **[NEW]**
- **`childPolicy`** (Object: `freeStayAgeLimit`, `extraBedFee`) **[NEW]**
- **`totalRooms`** (Integer, computed from Rooms) **[NEW]**
- **`offersDayOutPackages`** (Boolean, computed) **[NEW]**
- **`offersNightOutPackages`** (Boolean, computed) **[NEW]**
- **`offersHourlyBooking`** (Boolean, computed) **[NEW]**

### 1.3 B. Tour Agency Profile
Shared data, plus:

- **`licenseNumber`** (String) **[v1]** — SLTDA travel agent registration number.
- **`yearsInOperation`** (Integer) **[v1]**
- **`specializations`** (List of Enum: `WILDLIFE_SAFARI`, `HILL_COUNTRY_TREKKING`, `CULTURAL_TRIANGLE`, `HONEYMOON`, `FAMILY`, `PILGRIMAGE`, `ADVENTURE`, `LUXURY`, `BUDGET_BACKPACKER`) **[NEW]**
- **`fleetTypes`** (List of `VehicleType`) **[NEW]** — In-house vs. subcontracted transport.
- **`officeLocations`** (List of `{city, addressLine}`) **[NEW]** — Beyond primary `addressLine`.
- **`partnerNetworkSize`** (Integer, optional) **[NEW]** — e.g., "500+ hotel partners" trust signal.

### 1.4 C. Tour Guide Profile
Shared data, plus:

- **`sltdaLicenseNumber`** (String) **[v1]**
- **`licenseType`** (String: "National", "Chauffeur", "Site") **[v1]**
- **`languagesSpoken`** (List of Strings) **[v1]**
- **`yearsOfExperience`** (Integer) **[v1]**
- **`vehicleType`** (Enum: `VehicleType`) **[v1]**
- **`specialtyAreas`** (List of Enum: `BIRDWATCHING`, `HISTORY_ARCHAEOLOGY`, `CULINARY`, `PHOTOGRAPHY`, `HIKING`, `WILDLIFE_TRACKING`, `SURFING`, `TEA_CULTURE`) **[NEW]**
- **`coverageRegions`** (List of `region`/`SriLankanCity`) **[NEW]** — A Kandy-based guide may not cover Yala.
- **`dailyRate`** / **`halfDayRate`** (Double, `Currency`) **[NEW]** — Guides commonly price per day, not just per package.
- **`certifications`** (List of Strings: First Aid, Wildlife Tracking Cert, Water Safety) **[NEW]**
- **`maxGroupSizeGuided`** (Integer) **[NEW]**

---

## 2. Rooms (Managed by Hotels)

- **`roomNumber`** (String) **[v1]**
- **`roomType`** (Enum: `SINGLE`, `DOUBLE`, `SUITE`, `FAMILY`) **[v1]**
- **`pricePerNight`** (Double) **[v1]**
- **`currency`** (Enum: `Currency`, default `LKR`) **[v1]**
- **`capacity`** (Integer) **[v1]**
- **`bedCount`** (Integer) **[v1]**
- **`sizeSquareMeters`** (Double) **[v1]**
- **`availableFrom`** / **`availableTo`** (LocalDate, optional) **[v1]**
- **`totalUnits`** (Integer) **[v1]**
- **`imageUrls`** (List of Strings) **[v1]**
- **`amenities`** (List of Amenity IDs) **[v1]**
- **`viewType`** (Enum: `SEA_VIEW`, `GARDEN_VIEW`, `MOUNTAIN_VIEW`, `POOL_VIEW`, `CITY_VIEW`, `NONE`) **[NEW]**
- **`bedConfiguration`** (String, e.g., "1 King" / "2 Twin") **[NEW]**
- **`smokingAllowed`** (Boolean) **[NEW]**
- **`isHourlyBookable`** (Boolean, default false) **[NEW]** — Flags this room as eligible for short-stay bookings (Section 3.3).

---

## 3. Hotel Experience Packages **[NEW]**

Beyond standard nightly room bookings, hotels can publish short-format offerings that convert day-trippers, transit travelers, and local guests. These sit alongside `Room` and `TourPackage` as bookable hotel products.

### 3.1 Day Out Packages
Daytime access packages (typically 9am–6pm) sold without an overnight stay — pool/beach access, lunch, spa, etc.

- **`title`** (String) — e.g., "Pool & Lunch Day Pass."
- **`description`** (String)
- **`price`** (Double) / **`currency`** (Enum: `Currency`)
- **`pricingUnit`** (Enum: `PER_PERSON`, `PER_COUPLE`, `PER_FAMILY`)
- **`startTime`** / **`endTime`** (LocalTime) — Access window (e.g., 09:00–18:00).
- **`inclusions`** (List of Amenity IDs) — e.g., pool access, welcome drink, buffet lunch, beach chairs, WiFi.
- **`maxOccupancy`** (Integer)
- **`childPolicy`** (Object: age-based pricing/free entry)
- **`availableDays`** (List of DayOfWeek) — Some packages run weekends only.
- **`imageUrls`** (List of Strings)
- **`advanceBookingHoursRequired`** (Integer)

### 3.2 Night Out Packages
Overnight-adjacent evening experiences — dinner + entertainment, romantic evening setups, single-night celebration packages — that may or may not include a room.

- **`title`** (String) — e.g., "Beachside Candlelight Dinner," "New Year's Eve Gala Package."
- **`description`** (String)
- **`price`** (Double) / **`currency`** (Enum: `Currency`)
- **`pricingUnit`** (Enum: `PER_PERSON`, `PER_COUPLE`, `PER_GROUP`)
- **`startTime`** / **`endTime`** (LocalTime) — e.g., 19:00–23:00.
- **`includesOvernightStay`** (Boolean) — If true, links to a `Room` for that night.
- **`inclusions`** (List of Amenity IDs) — e.g., dinner, live music, fireworks, decor, welcome cocktail.
- **`occasionTags`** (List of Enum: `ROMANTIC`, `ANNIVERSARY`, `NEW_YEAR`, `BIRTHDAY`, `CULTURAL_SHOW`) **[NEW]**
- **`maxOccupancy`** (Integer)
- **`imageUrls`** (List of Strings)
- **`seasonalAvailability`** (List of LocalDate ranges) — For event-specific packages (e.g., NYE).
- **`advanceBookingHoursRequired`** (Integer)

### 3.3 Hourly / Short-Stay Room Bookings
Lets hotels monetize day-use of a room in short blocks (common for transit travelers, layovers, and day-use rest).

- **`roomId`** (Reference to `Room`, must have `isHourlyBookable = true`)
- **`minimumHours`** (Integer, e.g., 3) — Minimum bookable block.
- **`maximumHours`** (Integer, e.g., 8) — Cap before it converts to a full night rate.
- **`hourlyRate`** (Double) / **`currency`** (Enum: `Currency`)
- **`extraHourRate`** (Double) — Rate for hours beyond the minimum block.
- **`availableSlots`** (List of `{startTime, endTime}` per day) — e.g., blocked out around standard check-in/out to avoid conflicts with nightly guests.
- **`maxOccupancy`** (Integer)
- **`cleaningBufferMinutes`** (Integer) — Turnaround time blocked between bookings.
- **`idVerificationRequired`** (Boolean) — Common requirement for short-stay bookings.

---

## 4. Tour Packages (Managed by Agencies, Guides, or Hotels)

- **`title`** (String) **[v1]**
- **`description`** (String) **[v1]**
- **`price`** (Double) **[v1]**
- **`currency`** (Enum: `Currency`, default `USD`) **[v1]**
- **`durationDays`** (Integer) **[v1]**
- **`category`** (Enum: `TourCategory` — ADVENTURE, WILDLIFE, CULTURAL, BEACH) **[v1]**
- **`startingCity`** (Enum: `SriLankanCity`) **[v1]**
- **`minGroupSize`** / **`maxGroupSize`** (Integer) **[v1]**
- **`imageUrls`** (List of Strings) **[v1]**
- **`inclusions`** (List of Amenity IDs) **[v1]**
- **`scheduledDepartureDates`** (List of LocalDates) **[v1]**
- **`difficultyLevel`** (Enum: `EASY`, `MODERATE`, `CHALLENGING`) **[NEW]** — Important for trekking/adventure tours.
- **`physicalRequirements`** (String, optional) **[NEW]**
- **`transportModeIncluded`** (Enum: `VehicleType`, nullable) **[NEW]**
- **`mealsIncluded`** (Enum: `NONE`, `BREAKFAST_ONLY`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE`) **[NEW]**
- **`accommodationIncluded`** (Boolean) **[NEW]**
- **`isPrivateTour`** (Boolean) **[NEW]** — Distinguishes from fixed-departure group tours.

### 4.A Itinerary Days (Nested under Tour Package)
- **`dayNumber`** (Integer) **[v1]**
- **`title`** (String) **[v1]**
- **`description`** (String) **[v1]**
- **`overnightLocation`** (String) **[v1]**
- **`meals`** (List of Enum: `BREAKFAST`, `LUNCH`, `DINNER`) **[NEW]**
- **`activityDurationHours`** (Double, optional) **[NEW]**

### 4.B Group Pricing Tiers (Nested under Tour Package)
- **`minTravelers`** (Integer) **[v1]**
- **`maxTravelers`** (Integer) **[v1]**
- **`pricePerPerson`** (Double) **[v1]**

---

## 5. Other Shared Entities

### 5.1 Amenities
- **`name`** (String) **[v1]**
- **`icon`** (String) **[v1]**
- **`category`** (String: `ROOM_FEATURE`, `TOUR_INCLUSION`, `PROPERTY_FACILITY`, `DAY_OUT_INCLUSION`, `NIGHT_OUT_INCLUSION`) **[v1, expanded]**

### 5.2 Guide Blackout Dates
- **`date`** (LocalDate) **[v1]**
- **`reason`** (String, optional) **[v1]**

### 5.3 Reviews **[NEW]**
Enables the `averageRating` / `reviewCount` fields on Business Profiles.
- **`reviewerName`** (String)
- **`rating`** (Integer, 1–5)
- **`comment`** (String)
- **`entityType`** (Enum: `HOTEL`, `TOUR_AGENCY`, `TOUR_GUIDE`, `ROOM`, `TOUR_PACKAGE`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE`)
- **`entityId`** (Reference)
- **`stayOrTourDate`** (LocalDate) — When the reviewed experience occurred.
- **`providerResponse`** (String, optional) — Public reply from the business.

### 5.4 FAQ Entries **[NEW]**
Lets providers pre-answer common traveler questions directly on their profile.
- **`question`** (String)
- **`answer`** (String)
- **`entityId`** (Reference to Business Profile)

---

## 6. Traveler Search & Filter Mapping

Quick reference for how the new fields translate into discovery filters:

| Traveler intent | Fields used |
|---|---|
| "Beachfront boutique hotel near Galle, pet-friendly" | `propertyType`, `distanceToBeachKm`, `petPolicy`, `city` |
| "English + German speaking guide for wildlife in Yala" | `languagesSpoken`, `specialtyAreas`, `coverageRegions` |
| "Verified agency specializing in honeymoon packages" | `verificationStatus`, `specializations` |
| "Eco-certified hotel, budget, free cancellation" | `sustainabilityBadges`, `pricePerNight`, `cancellationPolicy` |
| "Day pass with pool + lunch near the airport" | Day Out Package `inclusions`, `distanceToAirportKm` |
| "Romantic dinner package for anniversary" | Night Out Package `occasionTags` |
| "Room for a few hours during a layover" | `isHourlyBookable`, `minimumHours`, `availableSlots` |

---

## 7. Suggested Enum Additions Summary

For implementation reference, new enums introduced above:
- `PropertyType`: HOTEL, RESORT, BOUTIQUE, VILLA, HOMESTAY, ECO_LODGE, GUESTHOUSE
- `Region`: HILL_COUNTRY, SOUTH_COAST, CULTURAL_TRIANGLE, EAST_COAST, WILDLIFE_BELT, WEST_COAST, NORTH
- `VerificationStatus`: PENDING, VERIFIED, SUSPENDED
- `SustainabilityBadge`: ECO_CERTIFIED, COMMUNITY_BASED_TOURISM, LOCALLY_OWNED, PLASTIC_FREE
- `CancellationPolicy`: FLEXIBLE, MODERATE, STRICT
- `AgencySpecialization`: WILDLIFE_SAFARI, HILL_COUNTRY_TREKKING, CULTURAL_TRIANGLE, HONEYMOON, FAMILY, PILGRIMAGE, ADVENTURE, LUXURY, BUDGET_BACKPACKER
- `GuideSpecialtyArea`: BIRDWATCHING, HISTORY_ARCHAEOLOGY, CULINARY, PHOTOGRAPHY, HIKING, WILDLIFE_TRACKING, SURFING, TEA_CULTURE
- `ViewType`: SEA_VIEW, GARDEN_VIEW, MOUNTAIN_VIEW, POOL_VIEW, CITY_VIEW, NONE
- `PricingUnit`: PER_PERSON, PER_COUPLE, PER_FAMILY, PER_GROUP
- `OccasionTag`: ROMANTIC, ANNIVERSARY, NEW_YEAR, BIRTHDAY, CULTURAL_SHOW
- `DifficultyLevel`: EASY, MODERATE, CHALLENGING
- `MealPlan`: NONE, BREAKFAST_ONLY, HALF_BOARD, FULL_BOARD, ALL_INCLUSIVE
