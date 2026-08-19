# Blue Ceylon Frontend — Data Fields & Schema Specification Analysis

This document provides a comprehensive analysis of all data fields, interfaces, and schemas used across cards, details pages, checkout forms, reviews, and domain entities in the **Blue Ceylon** hospitality & tourism platform.

---

## 1. Domain Model Architecture & Enums

The application categorizes data into clear domain models with strong TypeScript typing aligned to the backend microservices.

### ─── Core Enums & Lookup Tables ───

| Enum Name | Possible Values | Description |
|---|---|---|
| **`BusinessType`** | `HOTEL`, `TOUR_AGENCY`, `TOUR_GUIDE` | Primary categorization of business profiles |
| **`PropertyType`** | `HOTEL`, `GUESTHOUSE`, `BOUTIQUE_HOTEL`, `RESORT`, `VILLA`, `HOSTEL` | Sub-category for hotel/accommodation properties |
| **`ApprovalStatus`** | `DRAFT`, `PENDING`, `APPROVED`, `REJECTED` | Platform moderation & listing lifecycle status |
| **`VerificationStatus`** | `PENDING`, `VERIFIED`, `REJECTED` | SLTDA license verification status |
| **`Region`** | `WESTERN`, `CENTRAL`, `SOUTHERN`, `NORTHERN`, `EASTERN`, `NORTH_WESTERN`, `NORTH_CENTRAL`, `UVA`, `SABARAGAMUWA` | 9 Sri Lankan administrative provinces |
| **`SriLankanCity`** | `COLOMBO`, `KANDY`, `GALLE`, `NUWARA_ELIYA`, `ELLA`, `NEGOMBO`, `SIGIRIYA`, `MIRISSA`, `HIKKADUWA`, `ANURADHAPURA`, `TRINCOMALEE`, `JAFFNA`, `DAMBULLA`, `POLONNARUWA`, `MATARA`, `BENTOTA` | Standardized tourism hubs |
| **`RoomType`** | `STANDARD`, `DELUXE`, `SUPERIOR`, `SUITE`, `PENTHOUSE`, `FAMILY`, `CONNECTING`, `ACCESSIBLE` | Room classification categories |
| **`ViewType`** | `LAKE_VIEW`, `MOUNTAIN_VIEW`, `GARDEN_VIEW`, `POOL_VIEW`, `OCEAN_VIEW`, `CITY_VIEW`, `NO_VIEW` | Room window / balcony views |
| **`Currency`** | `LKR`, `USD`, `EUR`, `GBP` | Monetary currency codes |
| **`PricingUnit`** | `PER_PERSON`, `PER_GROUP`, `FLAT_RATE` | Pricing structure for packages |
| **`TourCategory`** | `CULTURAL`, `ADVENTURE`, `WILDLIFE`, `BEACH`, `SPIRITUAL`, `WELLNESS`, `HISTORICAL`, `ECO`, `CULINARY` | Tour excursion themes |
| **`DifficultyLevel`** | `EASY`, `MODERATE`, `CHALLENGING`, `EXTREME` | Physical demand rating for tours |
| **`VehicleType`** | `TUK_TUK`, `CAR`, `VAN`, `SUV`, `MINIBUS`, `COACH`, `MOTORBIKE`, `NONE` | Vehicle types for transfers & tours |
| **`MealPlan`** | `NONE`, `BREAKFAST_ONLY`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE` | Included catering options |
| **`PetPolicy`** | `ALLOWED`, `NOT_ALLOWED`, `ALLOWED_ON_REQUEST` | Property pet policies |
| **`CancellationPolicy`** | `FLEXIBLE`, `MODERATE`, `STRICT`, `NON_REFUNDABLE` | Host cancellation terms |
| **`SustainabilityBadge`** | `ECO_CERTIFIED`, `SOLAR_POWERED`, `PLASTIC_FREE`, `LOCAL_SOURCING`, `CARBON_NEUTRAL` | Environmental credentials |
| **`AgencySpecialization`**| `ADVENTURE`, `CULTURAL`, `ECO`, `WELLNESS`, `BEACH`, `WILDLIFE`, `HISTORICAL`, `CULINARY`, `SPIRITUAL` | Tour agency focus areas |
| **`GuideSpecialtyArea`** | `WILDLIFE_SAFARI`, `CULTURAL_HERITAGE`, `MOUNTAIN_TREKKING`, `BIRDWATCHING`, `CULINARY_TOURS`, `PHOTOGRAPHY`, `WATER_SPORTS`, `ECO_NATURE`, `CITY_WALKS` | Guide expertise areas |
| **`LicenseType`** | `NATIONAL_TOURIST_GUIDE`, `CHAUFFEUR_GUIDE`, `SITE_GUIDE` | Official SLTDA guide license levels |
| **`BookingStatus`** | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED` | Booking lifecycle status |
| **`PaymentMethod`** | `PAYHERE`, `CASH`, `BANK_TRANSFER` | Supported payment gateways/methods |
| **`BookingItemType`** | `ROOM`, `TOUR_PACKAGE`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE`, `GUIDE` | Target item type for reservation |
| **`ReviewEntityType`** | `HOTEL`, `ROOM`, `TOUR_PACKAGE`, `TOUR_GUIDE`, `TOUR_AGENCY`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE` | Review subject entity classification |

---

## 2. Component Data Fields — Cards

### 🏨 2.1 Hotels / Property Card Data Fields (`Business` entity summary)
Rendered in: `/hotels` page, `/search` results grid, home spotlight rails.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Unique business UUID | `"b-1"` |
| `name` | `string` | Property display name | `"Nine Arch Heritage Villa"` |
| `tagline` | `string` | Catchy single line pitch | `"Where every dawn is painted gold..."` |
| `propertyType` | `PropertyType` | Accommodation classification | `"VILLA"` |
| `city` | `SriLankanCity` | Standard city enum | `"ELLA"` |
| `region` | `Region` | Administrative region enum | `"UVA"` |
| `addressLine` | `string` | Street address | `"Demodara Road, Ella 90090"` |
| `coverImageUrl` | `string` | Main card cover image | URL string |
| `averageRating` | `number` | Aggregated rating (1.0–5.0) | `4.9` |
| `reviewCount` | `number` | Total number of reviews | `128` |
| `verificationStatus` | `VerificationStatus`| SLTDA verification flag | `"VERIFIED"` |
| `sltdaLicenseNumber` | `string` (optional)| Official SLTDA license code | `"SLTDA/B/2024/0984"` |
| `starRating` | `number` (optional)| Star rating classification | `4` |
| `priceStartFrom` | `number` | Lowest room nightly rate | `85` |
| `amenities` | `Amenity[]` | Top key property amenities | `[{ name: "Mountain View" }]` |
| `sustainabilityBadges`| `SustainabilityBadge[]` | Eco-credentials list | `["ECO_CERTIFIED"]` |

---

### 🛏️ 2.2 Rooms Card Data Fields (`Room` entity summary)
Rendered in: `/rooms` search page, Hotel profile (`/business/[id]`) offerings tab.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Unique room UUID | `"r-101"` |
| `roomNumber` | `string` | Physical room code/number | `"101"` |
| `displayName` | `string` | Descriptive room title | `"Mountain Mist Deluxe King Suite"` |
| `roomType` | `RoomType` | Category enum | `"DELUXE"` |
| `pricePerNight` | `number` | Nightly rate | `85` |
| `currency` | `Currency` | Currency code | `"USD"` |
| `capacity` | `number` | Maximum guests allowed | `2` |
| `bedCount` | `number` | Number of physical beds | `1` |
| `bedConfiguration` | `string` | Bed layout description | `"1 King Bed"` |
| `sizeSquareMeters` | `number` (optional)| Room area footprint in m² | `38` |
| `viewType` | `ViewType` | Window/balcony view enum | `"MOUNTAIN_VIEW"` |
| `smokingAllowed` | `boolean` | Smoking permission flag | `false` |
| `isHourlyBookable` | `boolean` | Layover / hourly booking flag | `false` |
| `imageUrls` | `string[]` | Thumbnail & gallery images | Array of image URLs |
| `amenities` | `Amenity[]` | Room specific features | `[{ name: "En-suite Bathroom" }]` |
| `hotelId` | `string` (denormalized)| Parent business ID | `"b-1"` |
| `hotelName` | `string` (denormalized)| Parent business name | `"Nine Arch Heritage Villa"` |

---

### 🧭 2.3 Tour Packages Card Data Fields (`TourPackage` entity summary)
Rendered in: `/tours` search page, Hotel profile offerings tab.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Tour package UUID | `"tp-101"` |
| `title` | `string` | Excursion title | `"Ella Rock & Nine Arch Sunrise Trek"` |
| `description` | `string` | Concise tour summary | `"Guided early morning trek..."` |
| `price` | `number` | Base price per person | `40` |
| `currency` | `Currency` | Currency enum | `"USD"` |
| `durationDays` | `number` | Duration in days (e.g. 0.5) | `0.5` |
| `durationLabel` | `string` | Display duration text | `"Half Day (5 Hours)"` |
| `category` | `TourCategory` | Excursion theme enum | `"ADVENTURE"` |
| `startingCity` | `SriLankanCity` | Departure location | `"ELLA"` |
| `difficultyLevel` | `DifficultyLevel` | Difficulty rating | `"MODERATE"` |
| `isPrivateTour` | `boolean` | Private vs group tour flag | `false` |
| `transportModeIncluded`| `VehicleType` | Included transfer vehicle | `"TUK_TUK"` |
| `imageUrls` | `string[]` | Cover and gallery photos | Array of image URLs |
| `inclusions` | `Amenity[]` | Key included highlights | `[{ name: "Tuk-Tuk Pick & Drop" }]` |

---

### 👨‍💼 2.4 Tour Guide Card Data Fields (`Guide` entity summary)
Rendered in: `/tour-guides` page, Search results.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Unique guide UUID | `"g-1"` |
| `name` | `string` | Full display name | `"Chaminda Perera"` |
| `tagline` | `string` | Professional headline | `"Licensed Hill Country Specialist"` |
| `description` | `string` | Short biography | `"Over 12 years experience..."` |
| `dailyRate` | `number` | Full day hire rate | `65` |
| `halfDayRate` | `number` | Half day hire rate | `38` |
| `currency` | `Currency` | Rate currency code | `"USD"` |
| `avatarUrl` | `string` | Profile portrait URL | URL string |
| `coverImageUrl` | `string` | Background cover image | URL string |
| `verificationStatus` | `VerificationStatus`| SLTDA license status | `"VERIFIED"` |
| `sltdaLicenseNumber` | `string` | Official guide license code | `"SLTDA/NTG/2022/1042"` |
| `licenseType` | `LicenseType` | License tier enum | `"NATIONAL_TOURIST_GUIDE"` |
| `averageRating` | `number` | Rating score (1.0–5.0) | `4.98` |
| `reviewCount` | `number` | Count of reviews | `164` |
| `languagesSpoken` | `string[]` | Languages spoken | `["English", "German", "Sinhala"]` |
| `specialtyAreas` | `GuideSpecialtyArea[]`| Areas of expertise | `["WILDLIFE_SAFARI", "MOUNTAIN_TREKKING"]` |
| `vehicleType` | `VehicleType` | Transport vehicle type | `"SUV"` |
| `vehicleModel` | `string` | Specific vehicle model | `"Toyota KDH Super GL (2022)"` |
| `vehicleAirConditioned`| `boolean` | Air conditioning status | `true` |
| `city` | `SriLankanCity` | Primary base location | `"ELLA"` |
| `yearsOfExperience` | `number` | Years in profession | `12` |

---

### 🎟️ 2.5 Extra Packages Card Data Fields (`DayOutPackage` & `NightOutPackage`)
Rendered in: `/extra-packages` search page, Hotel profile experience tabs.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Package UUID | `"do-101"` / `"no-101"` |
| `title` | `string` | Experience package title | `"Ella Infinity Pool & Scenic Lunch Pass"` |
| `description` | `string` | Full experience narrative | `"Full daytime access (09:00–18:00)..."` |
| `price` | `number` | Experience package rate | `35` |
| `currency` | `Currency` | Currency code | `"USD"` |
| `pricingUnit` | `PricingUnit` | Pricing model enum | `"PER_PERSON"` / `"PER_GROUP"` |
| `startTime` | `string` | Daily start time | `"09:00"` / `"19:00"` |
| `endTime` | `string` | Daily end time | `"18:00"` / `"23:00"` |
| `includesOvernightStay`| `boolean` (NightOut) | Overnight room flag | `false` |
| `maxOccupancy` | `number` | Capacity limit | `20` |
| `availableDays` | `string[]` | Available days of week | `["MONDAY", "FRIDAY", "SATURDAY"]` |
| `imageUrls` | `string[]` | Package photos | Array of image URLs |
| `inclusions` | `Amenity[]` | Included services/perks | `[{ name: "3-Course Organic Lunch" }]` |
| `advanceBookingHoursRequired`| `number` | Required advance notice | `12` hours |

---

### 🏢 2.6 Tour Agency Card Data Fields (`TourAgency` entity summary)
Rendered in: `/tour-agencies` listing page.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Agency UUID | `"agency-1"` |
| `name` | `string` | Company display name | `"Ceylon Heritage Safaris & Expeditions"` |
| `tagline` | `string` | Corporate tagline | `"Accredited wildlife safaris..."` |
| `description` | `string` | Business overview | `"Premier SLTDA registered travel operator..."` |
| `city` | `SriLankanCity` | Primary city location | `"COLOMBO"` |
| `region` | `Region` | Administrative region | `"WESTERN"` |
| `sltdaLicenseNumber` | `string` | Travel agency license | `"SLTDA/TA/2026/0411"` |
| `verificationStatus` | `VerificationStatus`| Platform verification flag| `"VERIFIED"` |
| `yearsInBusiness` | `number` | Operating history years | `8` |
| `averageRating` | `number` | Average review rating | `4.95` |
| `reviewCount` | `number` | Total agency reviews | `142` |
| `coverImageUrl` | `string` | Main cover photo | URL string |
| `specializations` | `AgencySpecialization[]`| Core focus categories | `["WILDLIFE", "ADVENTURE", "ECO"]` |
| `fleetTypes` | `VehicleType[]` | Fleet vehicle types | `["SUV", "VAN", "COACH"]` |
| `partnerNetworkSize` | `number` (optional)| Number of hotel partners | `34` |
| `featuredPackage` | `FeaturedPackage` | Signature tour package | `{ title: "7-Day Signature Circuit", price: 850 }` |

---

## 3. Details Pages Data Fields

### 🏨 3.1 Hotel Details Page Data Fields (`/business/[id]`)

Combines full property profile, host profile, room catalog, package offerings, and verified traveler reviews.

| Data Section | Field Name | Type | Description |
|---|---|---|---|
| **Header** | `name`, `tagline`, `propertyType`, `city`, `region`, `addressLine`, `averageRating`, `reviewCount`, `verificationStatus`, `sltdaLicenseNumber` | `Business` fields | Property headline, verification badges, location address & rating aggregate |
| **Gallery** | `coverImageUrl`, `galleryImageUrls` | `string[]` | 4-column dynamic grid mosaic of hotel images |
| **Host Profile** | `host.displayName`, `host.avatarUrl`, `host.joinedYear`, `host.isSuperhost` | `HostInfo` | Profile of host derived from `auth-service` |
| **Quick Specs** | `checkInTime`, `checkOutTime`, `petPolicy`, `responseTimeHours`, `yearsInBusiness` | Various | Policy operational metrics bar |
| **Overview** | `description` | `string` | Comprehensive editorial property narrative |
| **Badges** | `sustainabilityBadges` | `SustainabilityBadge[]` | Sustainability commitments (Eco Certified, Solar Powered, Plastic-Free, etc.) |
| **Policies** | `cancellationPolicy`, `depositRequired`, `depositPercentage`, `paymentMethods` | Various | Cancellation terms, required deposit %, accepted gateways |
| **Amenities** | `amenities` | `Amenity[]` | Full grid checklist of property facilities with icons |
| **Offerings Tabs**| `rooms`, `dayOutPackages`, `nightOutPackages`, `tourPackages` | Sub-arrays | Interactive tabbed catalog for overnight rooms, day passes, candlelit dinners, and tours |
| **Reviews** | `MOCK_REVIEWS` filtered by `entityId` & `entityType === "HOTEL"` | `Review[]` | Verified traveler reviews with ratings, dates, and owner responses |
| **Sidebar CTA** | `priceStartFrom`, `starRating`, `contactPhone`, `whatsappNumber` | Various | Instant reservation widget with direct WhatsApp/Phone contact |

---

### 🛏️ 3.2 Room Details Page Data Fields (`/rooms/[id]`)

Focuses on specific room unit specifications, capacity limits, amenities, and real-time date availability checker.

| Data Section | Field Name | Type | Description |
|---|---|---|---|
| **Header / Hero** | `displayName`, `roomType`, `imageUrls[0]`, `sltdaVerified`, `hotelId`, `hotelName`, `hotelCity`, `hotelRegion`, `hotelRating` | Various | High-impact hero image banner with room & parent hotel metadata |
| **Specifications**| `capacity` | `number` | Max guest occupancy limit |
| | `bedCount`, `bedConfiguration` | `number`, `string` | Bed breakdown (e.g., "1x 1 King Four-Poster Bed") |
| | `sizeSquareMeters` | `number` | Room area (m²) |
| | `viewType` | `ViewType` | Window View (Ocean, Mountain, City, etc.) |
| | `smokingAllowed` | `boolean` | Non-Smoking / Smoking allowed status |
| | `isHourlyBookable` | `boolean` | Short-stay / layover eligibility flag |
| **Description** | Custom narrative derived from `displayName` & `hotelName` | `string` | Detailed space description |
| **Amenities** | `amenities` | `Amenity[]` | Grid list of included room amenities with green check icons |
| **Booking Box** | `pricePerNight`, `currency`, `checkIn`, `checkOut`, `guests` | Various | Date-range picker, guest count selector (`-`/`+`), and total calculation widget |

---

### 🧭 3.3 Tour Package Details Page Data Fields (`/tours/[id]`)

Displays detailed day-by-day itineraries, group pricing tiers, transport inclusions, and provider credentials.

| Data Section | Field Name | Type | Description |
|---|---|---|---|
| **Banner** | `title`, `durationLabel`, `coverImageUrl`, `price`, `currency`, `providerName`, `providerType`, `location`, `sltdaVerified` | Various | Panoramic header banner with price per traveler and duration badge |
| **Overview** | `description` | `string` | Full itinerary & excursion scope summary |
| **Inclusions** | `inclusions` | `Amenity[]` | Checkmarked highlight list (guides, meals, entrance passes) |
| **Day Itinerary** | `itineraryDays` | `ItineraryDay[]` | Timeline timeline listing `dayNumber`, `title`, `description`, and `destinations[]` badges |
| **Transport** | `transportModeIncluded` | `VehicleType` | Chauffeur transfer vehicle details (e.g. Tuk-Tuk, SUV, AC Van) |
| **Sidebar CTA** | `price`, `currency`, `durationLabel`, Checkout route | Various | Direct tour booking widget routing to `/checkout/tour` |

---

### 👨‍💼 3.4 Tour Guide Details Page Data Fields (`/guide/[id]`)

Details individual guide credentials, SLTDA licensing tier, spoken languages, and vehicle specifications.

| Data Section | Field Name | Type | Description |
|---|---|---|---|
| **Header Banner**| `name`, `tagline`, `avatarUrl`, `coverImageUrl`, `averageRating`, `reviewCount`, `dailyRate`, `currency`, `verificationStatus` | Various | Hero profile banner with avatar, rating score, and daily hire rate |
| **Accreditation** | `licenseType`, `sltdaLicenseNumber` | `LicenseType`, `string` | SLTDA official license level card (National Tourist Guide, Chauffeur Guide, Site Guide) |
| **Biography** | `description` | `string` | Personal guide history and guiding philosophy |
| **Languages** | `languagesSpoken` | `string[]` | Language badges (e.g. English, German, French, Sinhala) |
| **Certifications**| `certifications` | `string[]` | Professional badges (First Aid, Wildlife Tracking, Culinary Heritage) |
| **Vehicle Info** | `vehicleType`, `vehicleModel`, `vehicleAirConditioned` | `VehicleType`, `string`, `boolean` | Dedicated tourist transport vehicle details |
| **Sidebar CTA** | `dailyRate`, `halfDayRate`, `currency` | Various | Daily & Half-day pricing breakdown with book guide CTA button |

---

### 🎟️ 3.5 Extra Package Details Page Data Fields (`/extra-packages/[id]`)

Covers Day Out passes and Night Out romantic dining packages hosted at partner hotels.

| Data Section | Field Name | Type | Description |
|---|---|---|---|
| **Header Banner**| `title`, `startTime`, `endTime`, `coverImageUrl`, `price`, `currency`, `hotelName`, `city`, `sltdaVerified` | Various | Experience title, access time slot (e.g., 09:00 - 18:00), host hotel name |
| **Overview** | `description` | `string` | Detailed itinerary for pool pass, high tea, or candlelight dinner |
| **Inclusions** | `inclusions` | `Amenity[]` | Inclusions checklist (pool access, 3-course lunch, wine bottle) |
| **Host Hotel** | `hotelName`, `hotelId`, `address` | Various | Host hotel profile preview card |
| **Sidebar CTA** | `startTime`, `endTime`, `price`, `pricingUnit` | Various | Reservation card with pricing unit (PER_PERSON vs PER_GROUP) |

---

## 4. Checkout, Booking & Review Data Fields

### 💳 4.1 Dashboard & Checkout Booking Fields (`DashboardBooking` entity)

Used in checkout submission forms (`/checkout/[bookingType]`) and business owner dashboards (`/dashboard/bookings`).

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Booking UUID | `"bk-1"` |
| `bookingReference` | `string` | Human-readable ref code | `"BC-2026-8819"` |
| `guestName` | `string` | Guest full name | `"Charlotte Miller"` |
| `guestEmail` | `string` | Guest email address | `"charlotte.m@example.com"` |
| `propertyName` | `string` | Denormalized business name | `"Nine Arch Heritage Villa"` |
| `itemType` | `BookingItemType` | Booked item type | `"ROOM"`, `"TOUR_PACKAGE"`, etc. |
| `itemName` | `string` | Denormalized item title | `"Mountain Mist Deluxe King Suite"` |
| `checkIn` | `string` (ISO date) | Arrival / Experience date | `"2026-08-10"` |
| `checkOut` | `string` (ISO date, optional)| Departure date | `"2026-08-14"` |
| `status` | `BookingStatus` | Booking state enum | `"CONFIRMED"` |
| `totalPrice` | `number` | Total price | `340` |
| `currency` | `Currency` | Payment currency code | `"USD"` |
| `paymentMethod` | `PaymentMethod` | Chosen gateway/method | `"PAYHERE"` / `"CASH"` / `"BANK_TRANSFER"` |
| `guestCount` | `number` (optional)| Total guest count | `2` |

---

### ⭐ 4.2 Review Data Fields (`Review` entity)

Rendered in entity review lists (`/business/[id]/reviews`, `/dashboard/reviews`).

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `id` | `string` | Review UUID | `"rev-1"` |
| `entityId` | `string` | Subject entity UUID | `"b-1"` (Hotel/Room/Tour/Guide ID) |
| `entityType` | `ReviewEntityType` | Subject type classification| `"HOTEL"` |
| `reviewerName` | `string` | Traveler name | `"Charlotte Miller"` |
| `reviewerCountry` | `string` (optional)| Traveler origin country | `"United Kingdom"` |
| `rating` | `number` | Numerical score (1 to 5) | `5` |
| `stayOrTourDate` | `string` (ISO date) | Date of stay/experience | `"2026-07-12"` |
| `verified` | `boolean` | Verified booking flag | `true` |
| `bookingId` | `string` (optional)| Backend booking UUID | `"bk-uuid-8819"` |
| `bookingReference` | `string` (optional)| Human display reference | `"BC-2026-8819"` |
| `comment` | `string` | Review text comment | `"Absolutely breathtaking view..."` |
| `providerResponse` | `string` (optional)| Host/Owner reply text | `"Thank you so much Charlotte!..."` |
| `providerResponseAt`| `string` (ISO datetime)| Timestamp of host response| `"2026-07-13T09:30:00Z"` |

---

### 👤 4.3 Host Info Data Fields (`HostInfo` interface)

Embedded inside business entities to credit hosts and display trust indicators.

| Field Name | Type | Description | Example / Value |
|---|---|---|---|
| `displayName` | `string` | Host display name | `"Kasun Jayawardena"` |
| `avatarUrl` | `string` | Host profile avatar image | URL string |
| `joinedYear` | `string` | Year host joined platform | `"2021"` |
| `isSuperhost` | `boolean` | Superhost status badge | `true` |

---

## 5. Summary Matrix of All Pages vs Data Fields

| Route / Page | Main Entity Used | Key Cards Rendered | Unique Data Fields Introduced |
|---|---|---|---|
| **`/hotels`** | `Business[]` | Hotel Cards | City & Region filter dropdown options, sustainability badges filter |
| **`/rooms`** | `Room[]` | Room Cards | Nightly rate, bed configuration, square meters, view type |
| **`/tours`** | `TourPackage[]` | Tour Cards | Duration label, starting city, difficulty level, transport mode |
| **`/tour-guides`**| `Guide[]` | Tour Guide Cards | Daily/half-day rates, SLTDA guide license type, languages, vehicle model |
| **`/extra-packages`**| `DayOutPackage[]`, `NightOutPackage[]` | Extra Package Cards | Time slots (startTime - endTime), pricing unit (PER_PERSON/PER_GROUP), advance hours required |
| **`/tour-agencies`**| `TourAgency[]` | Agency Cards | Agency specializations, vehicle fleet types, partner network size, featured package |
| **`/business/[id]`**| `Business`, `Room[]`, `Review[]`, `HostInfo` | Hotel Details & Offering Cards | Interactive tabs (Rooms, Day Out, Night Out, Tours), host superhost badge, review responses |
| **`/rooms/[id]`** | `Room` + `Business` summary | Room Details | Interactive date range picker, capacity stepper, full room spec grid |
| **`/tours/[id]`** | `TourPackage` | Tour Details | Timeline itinerary days array (`dayNumber`, `destinations[]`), transport pick & drop |
| **`/guide/[id]`** | `Guide` | Guide Details | SLTDA license badge, certifications list, vehicle AC status |
| **`/extra-packages/[id]`**| `DayOutPackage` / `NightOutPackage` | Package Details | Time slot badge, inclusions checklist, host hotel profile card |
| **`/checkout/[type]`**| `DashboardBooking` draft | Checkout Form | Guest credentials, payment gateway selection (PayHere/Cash/Bank Transfer), deposit calculation |

