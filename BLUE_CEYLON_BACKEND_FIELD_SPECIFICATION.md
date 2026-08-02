# Blue Ceylon — 100% Backend Field Alignment & API Specification Document

This document provides a comprehensive, field-by-field mapping of all backend data structures, Request DTOs, and Entity models across Blue Ceylon's microservices (`auth-service` and `catalog-service`). 

It is designed as the **authoritative reference for Frontend Developers** to ensure 100% field alignment between Next.js forms/pages and Spring Boot backend endpoints.

---

## Table of Contents
1. [Authentication & User Accounts Specification (`auth-service`)](#0-authentication--user-accounts-specification-auth-service)
   - 0.1 Traveler Account Registration (`RegisterRequest`)
   - 0.2 Traveler Account Sign In (`LoginRequest`)
   - 0.3 Auth Response & User Profile Payload (`AuthResponse` & `UserProfileDto`)
   - 0.4 Password Reset & Social Login (`ForgotPasswordRequest` & `SocialLoginRequest`)
2. [Hotel Provider Specification (`catalog-service`)](#1-hotel-provider-specification)
   - 1.1 Hotel Profile Registration (`HotelDraftRequest`)
   - 1.2 Room Creation (`RoomRequest`)
   - 1.3 Tour Package Creation by Hotel (`TourPackageRequest`)
   - 1.4 Extra Package Creation (`DayOutPackageRequest` & `NightOutPackageRequest`)
3. [Tour Agency Provider Specification](#2-tour-agency-provider-specification)
   - 2.1 Tour Agency Profile Registration (`TourAgencyDraftRequest`)
   - 2.2 Tour Package Creation by Tour Agency (`TourPackageRequest`)
4. [Tour Guide Provider Specification](#3-tour-guide-provider-specification)
   - 3.1 Tour Guide Profile Registration (`TourGuideDraftRequest`)
   - 3.2 Tour Package Creation by Tour Guide (`TourPackageRequest`)
5. [Complete Enum Reference Dictionary](#4-complete-enum-reference-dictionary)

---

# 0. Authentication & User Accounts Specification (`auth-service`)

Backend Microservice: `auth-service`

## 0.1 Traveler Account Registration (`RegisterRequest`)
Backend Endpoint Target: `POST /api/v1/auth/register`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Email Address | `email` | `String` | Required (`@NotBlank`, `@Email`) | User's primary email address |
| Password | `password` | `String` | Required (`@NotBlank`) | Account password |
| First Name | `firstName` | `String` | Required (`@NotBlank`) | Given name |
| Last Name | `lastName` | `String` | Required (`@NotBlank`) | Family name |
| Phone Number | `phoneNumber` | `String` | Optional (`Tel` format) | Mobile telephone number |
| User Role | `role` | `Enum` | Required (`@NotNull`) (`TRAVELER`, `BUSINESS_OWNER`, `TOUR_GUIDE`) | Role identifier (`TRAVELER` for normal traveler) |

---

## 0.2 Traveler Account Sign In (`LoginRequest`)
Backend Endpoint Target: `POST /api/v1/auth/login`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Email Address | `email` | `String` | Required (`@NotBlank`) | User's registered email |
| Password | `password` | `String` | Required (`@NotBlank`) | Account password |
| OTP Code | `otp` | `String` | Optional (2FA verification code) | One-time password for 2FA |

---

## 0.3 Auth Response Payload (`AuthResponse` & `UserProfileDto`)
Returned from: `POST /api/v1/auth/login` and `POST /api/v1/auth/register`

### `AuthResponse` Structure
| Response Key | Data Type | Description |
|---|---|---|
| `accessToken` | `String` | Keycloak JWT Bearer Access Token |
| `refreshToken` | `String` | Keycloak Refresh Token |
| `expiresIn` | `int` | Token expiration lifetime in seconds |
| `user` | `Object` | Nested `UserProfileDto` object |

### Nested `user` (`UserProfileDto`) Structure
| Response Key | Data Type | Description |
|---|---|---|
| `id` | `UUID` / `String` | Database primary key ID |
| `keycloakSub` | `String` | Keycloak IAM unique subject Identifier (`sub` claim) |
| `email` | `String` | Verified user email |
| `firstName` | `String` | User first name |
| `lastName` | `String` | User last name |
| `phoneNumber` | `String` | User telephone number |
| `profileImageUrl` | `String` | Avatar photo URL |
| `role` | `Enum` | `UserRole` (`TRAVELER`, `BUSINESS_OWNER`, `TOUR_GUIDE`, `ADMIN`) |
| `businessType` | `String` | Optional business type (`"HOTEL"`, `"TOUR_AGENCY"`, `"TOUR_GUIDE"`) |

---

## 0.4 Password Reset & Social Login Requests

### 0.4.A Forgot Password (`ForgotPasswordRequest`)
Backend Endpoint Target: `POST /api/v1/auth/forgot-password`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Registered Email | `email` | `String` | Required (`@NotBlank`, `@Email`) | Target email for password reset link |

### 0.4.B Social Login (`SocialLoginRequest`)
Backend Endpoint Target: `POST /api/v1/auth/social`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Provider | `provider` | `String` | `"GOOGLE"`, `"FACEBOOK"`, `"APPLE"` | OAuth Identity Provider |
| ID Token | `idToken` | `String` | Required OAuth ID Token | Token issued by OAuth provider |

---

## 0.5 Admin User Management Specification (`auth-service`)

Backend Microservice: `auth-service`

### 0.5.A Get All Users / Search Users
Backend Endpoint Target: `GET /api/v1/auth/admin/users`
- Query Parameters: `search` (String, optional), `role` (`TRAVELER`, `BUSINESS_OWNER`, `TOUR_GUIDE`, `ADMIN`, optional)
- Returns: `List<UserProfileDto>`

### 0.5.B Get Single User Profile
Backend Endpoint Target: `GET /api/v1/auth/admin/users/{id}`
- Returns: `UserProfileDto`

### 0.5.C Update User Role / Promote to Admin
Backend Endpoint Target: `PUT /api/v1/auth/admin/users/{id}/role`
- Request Body (`UpdateUserRoleRequest`): `{ "role": "ADMIN", "businessType": null }`
- Behavior: Updates role in PostgreSQL DB and updates Realm Role level in Keycloak.
- Returns: Updated `UserProfileDto`

### 0.5.D Soft Delete User
Backend Endpoint Target: `DELETE /api/v1/auth/admin/users/{id}/soft-delete`
- Behavior: Sets `enabled = false` in Keycloak, sets `deleted_at = NOW()` in PostgreSQL DB.
- Returns: `204 No Content`

### 0.5.E Hard Delete User
Backend Endpoint Target: `DELETE /api/v1/auth/admin/users/{id}/hard-delete`
- Behavior: Permanently deletes user from Keycloak realm via Keycloak Admin REST API, and executes native SQL `DELETE FROM user_profiles` in DB.
- Returns: `204 No Content`

### 0.5.F Admin User Impersonation ("Login as User")
Backend Endpoint Target: `POST /api/v1/auth/admin/users/{id}/impersonate`
- Behavior: Issues an OAuth2 Token Exchange (`urn:ietf:params:oauth:grant-type:token-exchange`) against Keycloak for the target user ID without requiring their password.
- Returns: `ImpersonateResponse` (`accessToken`, `refreshToken`, `expiresIn`, `impersonatedUser`, `impersonatedByAdminSub`)

---

# 1. Hotel Provider Specification (`catalog-service`)

Backend Endpoint Target: `POST /api/v1/owner/businesses/hotel`

## 1.1 Hotel Profile Registration (`HotelDraftRequest`)
*Inherits core fields from `BaseBusinessDraftRequest`*

### Core Identity & Contact
| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Property Name | `name` | `String` | Required | Official business name |
| Tagline | `tagline` | `String` | Max 100 chars | Hook shown on search cards |
| Description | `description` | `String` | Required | Detailed description |
| Contact Email | `contactEmail` | `String` | Valid Email | Primary email |
| Contact Phone | `contactPhone` | `String` | Tel format | Primary telephone |
| WhatsApp Line | `whatsappNumber` | `String` | Tel format | Booking inquiries |
| Website URL | `website` | `String` | Valid URL | Optional website |
| Social Links | `socialLinks` | `Map<String, String>` | Key-Value pairs | `instagram`, `facebook`, `tiktok`, `youtube` |

### Location & Regional Geo-Data
| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| City / Town | `city` | `Enum` | `SriLankanCity` (e.g. `ELLA`, `GALLE`, `SIGIRIYA`) | Main city |
| Tourism Region | `region` | `Enum` | `Region` (`HILL_COUNTRY`, `SOUTH_COAST`, `CULTURAL_TRIANGLE`, `WESTERN_PROVINCE`, `WILDLIFE_BELT`) | Regional grouping |
| Address Line | `addressLine` | `String` | Required | Street address |
| Latitude | `latitude` | `Double` | Decimal coordinate | GPS Latitude |
| Longitude | `longitude` | `Double` | Decimal coordinate | GPS Longitude |

### Property Specifications & Policies
| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Star Rating | `starRating` | `Integer` | `1` to `5` | Official star rating |
| Total Branches | `totalBranches` | `Integer` | Default `1` | Number of branches |
| Property Type | `propertyType` | `Enum` | `HOTEL`, `RESORT`, `BOUTIQUE`, `VILLA`, `HOMESTAY`, `ECO_LODGE`, `GUESTHOUSE` | Accommodation type |
| Check-In Time | `checkInTime` | `String (HH:mm)` | `LocalTime` (e.g., `"14:00"`) | Standard check-in |
| Check-Out Time | `checkOutTime` | `String (HH:mm)` | `LocalTime` (e.g., `"11:00"`) | Standard check-out |
| Pet Policy | `petPolicy` | `Enum` | `ALLOWED`, `NOT_ALLOWED`, `ON_REQUEST` | Pet rules |
| Total Rooms | `totalRooms` | `Integer` | Computed / Specified | Room inventory count |
| Offers Day Out Passes | `offersDayOutPackages` | `Boolean` | `true`/`false` | Enables Day Out pass tab |
| Offers Night Out Passes | `offersNightOutPackages` | `Boolean` | `true`/`false` | Enables Evening packages |
| Offers Hourly Stay | `offersHourlyBooking` | `Boolean` | `true`/`false` | Enables Layover bookings |

### Media Assets
| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Cover Image URL | `coverImageUrl` | `String` | Valid Image URL | Main hero image |
| Cover Image Public ID | `coverImagePublicId` | `String` | Cloudinary / S3 ID | Storage asset ID |
| Gallery Image URLs | `galleryImageUrls` | `List<String>` | Array of Image URLs | Photo gallery |
| Promo Video URL | `videoUrl` | `String` | Valid Video URL | Walkthrough video |

---

## 1.2 Room Creation (`RoomRequest`)
Backend Endpoint Target: `POST /api/v1/owner/rooms`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Room Number / Code | `roomNumber` | `String` | Required (e.g., `"SUITE-101"`) | Unit reference |
| Room Category | `roomType` | `Enum` | `SINGLE`, `DOUBLE`, `SUITE`, `FAMILY` | Standard room category |
| Nightly Rate | `pricePerNight` | `Double` | Required (> 0) | Rate per night |
| Currency | `currency` | `Enum` | `USD`, `LKR`, `EUR` (default `USD`) | Pricing currency |
| Guest Capacity | `capacity` | `Integer` | Max guest count | Guest limit |
| Total Available Units | `totalUnits` | `Integer` | Inventory count | Physical room units |
| Bed Count | `bedCount` | `Integer` | Total beds | Bed count |
| Size (Square Meters) | `sizeSquareMeters` | `Double` | Room area in $m^2$ | Floor size |
| Room Photos | `imageUrls` | `List<String>` | Array of Image URLs | Room photos |
| View Type | `viewType` | `Enum` | `SEA_VIEW`, `GARDEN_VIEW`, `MOUNTAIN_VIEW`, `POOL_VIEW`, `CITY_VIEW`, `NONE` | Room view |
| Bed Configuration | `bedConfiguration` | `String` | Free text (e.g. `"1 King Bed & 1 Daybed"`) | Bed arrangement |
| Smoking Allowed | `smokingAllowed` | `Boolean` | `true`/`false` | Smoking policy |
| Hourly Layover Eligible | `isHourlyBookable` | `Boolean` | `true`/`false` | Short-stay eligible |

---

## 1.3 Tour Package Creation by Hotel (`TourPackageRequest`)
Backend Endpoint Target: `POST /api/v1/owner/tours`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Tour Title | `title` | `String` | Required | Name of excursion |
| Description | `description` | `String` | Required | Full tour overview |
| Price per Person | `price` | `Double` | Required (> 0) | Tour rate |
| Duration (Days) | `durationDays` | `Integer` | Required (e.g. `1` for 1-day) | Length of excursion |
| Tour Category | `category` | `Enum` | `ADVENTURE`, `WILDLIFE`, `CULTURAL`, `BEACH` | Tour genre |
| Starting City | `startingCity` | `Enum` | `SriLankanCity` (e.g. `ELLA`) | Departure location |
| Min Travelers | `minGroupSize` | `Integer` | Minimum group | Min group size |
| Max Travelers | `maxGroupSize` | `Integer` | Maximum group | Max group size |
| Image Gallery | `imageUrls` | `List<String>` | Array of Image URLs | Excursion photos |
| Difficulty Level | `difficultyLevel` | `Enum` | `EASY`, `MODERATE`, `CHALLENGING` | Physical difficulty |
| Physical Requirements | `physicalRequirements` | `String` | Free text | Trekking requirements |
| Included Transport | `transportModeIncluded` | `Enum` | `VehicleType` (`SUV`, `VAN`, `COACH`, `TUKTUK`) | Vehicle provided |
| Included Meals | `mealsIncluded` | `Enum` | `NONE`, `BREAKFAST_ONLY`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE` | Food inclusions |
| Accommodation Included | `accommodationIncluded` | `Boolean` | `true`/`false` | Includes overnight stay |
| Private Excursion | `isPrivateTour` | `Boolean` | `true`/`false` | Private vs Shared |

---

## 1.4 Extra Package Creation (Day Out & Night Out)

### 1.4.A Day Out Package Request (`DayOutPackageRequest`)
Backend Endpoint Target: `POST /api/v1/owner/experiences/day-out`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Package Title | `title` | `String` | Required (e.g. `"Pool & Lunch Day Pass"`) | Package name |
| Description | `description` | `String` | Required | Full experience summary |
| Price | `price` | `Double` | Required (> 0) | Rate per pass |
| Pricing Unit | `pricingUnit` | `Enum` | `PER_PERSON`, `PER_COUPLE`, `PER_FAMILY` | Pricing tier |
| Access Start Time | `startTime` | `String (HH:mm)` | `LocalTime` (e.g., `"09:00"`) | Access window start |
| Access End Time | `endTime` | `String (HH:mm)` | `LocalTime` (e.g., `"18:00"`) | Access window end |
| Max Daily Occupancy | `maxOccupancy` | `Integer` | Visitor cap | Capacity limit |
| Available Days of Week | `availableDays` | `List<DayOfWeek>` | `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY` | Operational days |
| Package Photos | `imageUrls` | `List<String>` | Array of Image URLs | Photos |
| Advance Notice (Hours) | `advanceBookingHoursRequired` | `Integer` | Hours (e.g. `12`) | Minimum lead time |

### 1.4.B Night Out Package Request (`NightOutPackageRequest`)
Backend Endpoint Target: `POST /api/v1/owner/experiences/night-out`

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Package Title | `title` | `String` | Required (e.g. `"Candlelight Dinner & Gala"`) | Package name |
| Description | `description` | `String` | Required | Event details |
| Price | `price` | `Double` | Required (> 0) | Package rate |
| Pricing Unit | `pricingUnit` | `Enum` | `PER_PERSON`, `PER_COUPLE`, `PER_GROUP` | Pricing unit |
| Event Start Time | `startTime` | `String (HH:mm)` | `LocalTime` (e.g., `"19:00"`) | Event start |
| Event End Time | `endTime` | `String (HH:mm)` | `LocalTime` (e.g., `"23:00"`) | Event end |
| Includes Room Night | `includesOvernightStay` | `Boolean` | `true`/`false` | Room included |
| Occasion Tags | `occasionTags` | `List<OccasionTag>` | `ROMANTIC`, `ANNIVERSARY`, `NEW_YEAR`, `BIRTHDAY`, `CULTURAL_SHOW` | Celebration tags |
| Max Guests | `maxOccupancy` | `Integer` | Guest cap | Visitor limit |
| Gallery Images | `imageUrls` | `List<String>` | Array of Image URLs | Package photos |
| Advance Notice (Hours) | `advanceBookingHoursRequired` | `Integer` | Hours (e.g. `24`) | Required lead time |

---

# 2. Tour Agency Provider Specification

Backend Endpoint Target: `POST /api/v1/owner/businesses/tour-agency`

## 2.1 Tour Agency Profile Registration (`TourAgencyDraftRequest`)
*Inherits core fields from `BaseBusinessDraftRequest`*

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Official Agency Name | `name` | `String` | Required | Registered agency name |
| SLTDA License No. | `licenseNumber` | `String` | Required (`"SLTDA/TA/YYYY/XXXX"`) | SLTDA Travel Agent No. |
| Tagline | `tagline` | `String` | Max 100 chars | Hook line |
| Overview & Bio | `description` | `String` | Required | Agency profile bio |
| Contact Email | `contactEmail` | `String` | Valid Email | Primary email |
| Contact Phone | `contactPhone` | `String` | Tel format | Office phone |
| WhatsApp Line | `whatsappNumber` | `String` | Tel format | Inquiries line |
| Website URL | `website` | `String` | Valid URL | Agency site |
| Social Media Links | `socialLinks` | `Map<String, String>` | Key-Value pairs | `instagram`, `facebook`, etc. |
| Primary City | `city` | `Enum` | `SriLankanCity` (e.g. `COLOMBO`) | Head office city |
| Tourism Region | `region` | `Enum` | `Region` (`WESTERN_PROVINCE`, `HILL_COUNTRY`, etc.) | Main region |
| Street Address | `addressLine` | `String` | Required | Head office address |
| Latitude / Longitude | `latitude` / `longitude` | `Double` / `Double` | Coordinates | Head office GPS |
| Years in Operation | `yearsInOperation` | `Integer` | Required (> 0) | Operating experience |
| Network Partner Size | `partnerNetworkSize` | `Integer` | Optional (e.g. `500`) | Hotel partners count |
| Agency Specializations | `specializations` | `List<AgencySpecialization>` | `WILDLIFE_SAFARI`, `HILL_COUNTRY_TREKKING`, `CULTURAL_TRIANGLE`, `HONEYMOON`, `FAMILY`, `PILGRIMAGE`, `ADVENTURE`, `LUXURY`, `BUDGET_BACKPACKER` | Tour specialties |
| Vehicle Fleet Types | `fleetTypes` | `List<VehicleType>` | `SUV`, `VAN`, `COACH`, `TUKTUK`, `SEDAN` | Transport capabilities |
| Cover Photo URL | `coverImageUrl` | `String` | Valid Image URL | Hero cover image |
| Cover Image Public ID | `coverImagePublicId` | `String` | Storage asset ID | Storage reference |
| Gallery Photo URLs | `galleryImageUrls` | `List<String>` | Array of Image URLs | Office/fleet photos |
| Promo Video URL | `videoUrl` | `String` | Valid Video URL | Promo video |

---

## 2.2 Tour Package Creation by Tour Agency (`TourPackageRequest`)
*(Same shared structure as Section 1.3)*

---

# 3. Tour Guide Provider Specification

Backend Endpoint Target: `POST /api/v1/owner/businesses/tour-guide`

## 3.1 Tour Guide Profile Registration (`TourGuideDraftRequest`)

| Frontend Form Field | Backend JSON Field | Data Type | Validation / Allowed Values | Description |
|---|---|---|---|---|
| Guide Full Name | `name` | `String` | Required | Official guide name |
| Tagline / Professional Title | `tagline` | `String` | Max 100 chars (e.g. `"Hill Country Specialist"`) | Guide title |
| Bio & Philosophy | `description` | `String` | Required | Professional bio |
| Contact Email | `contactEmail` | `String` | Valid Email | Guide email |
| Contact Phone | `contactPhone` | `String` | Tel format | Mobile phone |
| WhatsApp Line | `whatsappNumber` | `String` | Tel format | Direct WhatsApp |
| Base City | `city` | `Enum` | `SriLankanCity` (e.g. `ELLA`, `KANDY`) | Primary base city |
| Region | `region` | `Enum` | `Region` (`HILL_COUNTRY`, `CULTURAL_TRIANGLE`) | Coverage region |
| Cover Profile Image URL | `coverImageUrl` | `String` | Valid Image URL | Guide avatar / cover photo |
| SLTDA License No. | `licenseNumber` | `String` | Required (`"SLTDA/NTG/YYYY/XXXX"`) | SLTDA Tourist Guide No. |
| License Classification | `licenseType` | `String` | `"National"`, `"Chauffeur"`, `"Site"` | License category |
| Spoken Languages | `languagesSpoken` | `List<String>` | Array (e.g. `["English", "German", "Sinhala"]`) | Spoken languages |
| Years of Experience | `yearsOfExperience` | `Integer` | Required (> 0) | Guiding experience |
| Primary Vehicle Type | `vehicleType` | `Enum` | `VehicleType` (`SUV`, `VAN`, `SEDAN`, `TUKTUK`, `NONE`) | Guiding vehicle |
| Max Group Size Guided | `maxGroupSizeGuided` | `Integer` | Group limit (e.g. `12`) | Max travelers led |
| Full-Day Rate (USD) | `dailyRate` | `Double` | Required (> 0) | Full day rate |
| Half-Day Rate (USD) | `halfDayRate` | `Double` | Required (> 0) | Half day rate |

---

## 3.2 Tour Package Creation by Tour Guide (`TourPackageRequest`)
*(Same shared structure as Section 1.3)*

---

# 4. Complete Enum Reference Dictionary

For complete frontend schema validation, use these exact string values:

### `UserRole`
`TRAVELER`, `BUSINESS_OWNER`, `TOUR_GUIDE`, `ADMIN`

### `PropertyType`
`HOTEL`, `RESORT`, `BOUTIQUE`, `VILLA`, `HOMESTAY`, `ECO_LODGE`, `GUESTHOUSE`

### `Region`
`HILL_COUNTRY`, `SOUTH_COAST`, `CULTURAL_TRIANGLE`, `WESTERN_PROVINCE`, `WILDLIFE_BELT`, `EAST_COAST`, `NORTH`

### `SriLankanCity`
`COLOMBO`, `KANDY`, `GALLE`, `ELLA`, `SIGIRIYA`, `MIRISSA`, `NUWARA_ELIYA`, `YALA`, `TRINCOMALEE`, `NEGOMBO`, `ANURADHAPURA`

### `PetPolicy`
`ALLOWED`, `NOT_ALLOWED`, `ON_REQUEST`

### `RoomType`
`SINGLE`, `DOUBLE`, `SUITE`, `FAMILY`

### `Currency`
`USD`, `LKR`, `EUR`, `GBP`

### `ViewType`
`SEA_VIEW`, `GARDEN_VIEW`, `MOUNTAIN_VIEW`, `POOL_VIEW`, `CITY_VIEW`, `NONE`

### `PricingUnit`
`PER_PERSON`, `PER_COUPLE`, `PER_FAMILY`, `PER_GROUP`

### `OccasionTag`
`ROMANTIC`, `ANNIVERSARY`, `NEW_YEAR`, `BIRTHDAY`, `CULTURAL_SHOW`

### `TourCategory`
`ADVENTURE`, `WILDLIFE`, `CULTURAL`, `BEACH`

### `DifficultyLevel`
`EASY`, `MODERATE`, `CHALLENGING`

### `VehicleType`
`SUV`, `VAN`, `COACH`, `TUKTUK`, `SEDAN`, `NONE`

### `MealPlan`
`NONE`, `BREAKFAST_ONLY`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE`

### `AgencySpecialization`
`WILDLIFE_SAFARI`, `HILL_COUNTRY_TREKKING`, `CULTURAL_TRIANGLE`, `HONEYMOON`, `FAMILY`, `PILGRIMAGE`, `ADVENTURE`, `LUXURY`, `BUDGET_BACKPACKER`
