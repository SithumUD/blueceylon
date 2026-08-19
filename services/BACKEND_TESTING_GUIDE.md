# 🌿 BlueCeylon Backend — Complete Testing Guide

> **Last Updated:** 2026-08-15 | **Architecture:** Spring Boot 3.2.5 Microservices + Keycloak JWT

---

## 📦 Service Port Map

| Service              | Port   | Database              | Swagger UI                              |
|----------------------|--------|-----------------------|-----------------------------------------|
| **API Gateway**      | `8080` | —                     | `http://localhost:8080/swagger-ui.html` |
| **Auth Service**     | `8081` | `PostgreSQL :5433`    | `http://localhost:8081/swagger-ui.html` |
| **Catalog Service**  | `8082` | `PostgreSQL :5433`    | `http://localhost:8082/swagger-ui.html` |
| **Booking Service**  | `8083` | `PostgreSQL :5433`    | `http://localhost:8083/swagger-ui.html` |
| **Payment Service**  | `8084` | `PostgreSQL :5433`    | `http://localhost:8084/swagger-ui.html` |
| **Notification Svc** | `8085` | —                     | —                                       |
| **Keycloak**         | `8180` | —                     | `http://localhost:8180`                 |

---

## ⚙️ Prerequisites — Start These First

Before running any service, ensure the following Docker containers are running:

```bash
# 1. PostgreSQL
docker run -d --name blueceylon-postgres -p 5433:5432 \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=blueceylon_auth postgres:15

# 2. Keycloak
docker run -d --name blueceylon-keycloak -p 8180:8080 \
  -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:25.0.4 start-dev

# 3. RabbitMQ
docker run -d --name blueceylon-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

---

## 🔐 How to Get a JWT Token for Testing

All protected endpoints require a Bearer JWT token. Get one via:

### Step 1 — Register a user
```
POST http://localhost:8081/api/auth/register
```
```json
{
  "email": "testuser@blueceylon.com",
  "password": "Test@1234",
  "firstName": "Test",
  "lastName": "User",
  "phoneNumber": "+94771234567",
  "role": "TRAVELER"
}
```
> **Roles available:** `TRAVELER`, `BUSINESS_OWNER`, `TOUR_GUIDE`

### Step 2 — Login to get JWT token
```
POST http://localhost:8081/api/auth/login
```
```json
{
  "email": "testuser@blueceylon.com",
  "password": "Test@1234"
}
```
**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "...",
  "expiresIn": 300
}
```

### Step 3 — Use the token
Add this header to every protected request:
```
Authorization: Bearer eyJhbGci...
```

> 💡 **Swagger shortcut:** Open any Swagger UI → Click the green **`Authorize 🔓`** button → Paste the token (without `Bearer `) → Click Authorize.

---

## 🛡️ Auth Service — Port `8081`

**Base URL:** `http://localhost:8081`

---

### 🔓 Public Endpoints (No Token Required)

---

#### `POST /api/auth/register`
**Purpose:** Register a new user (traveler, business owner, or tour guide) in the system. Creates a Keycloak account and stores profile in PostgreSQL.

```json
// Request Body
{
  "email": "john@example.com",
  "password": "SecurePass@123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+94771234567",
  "role": "TRAVELER"
}
```
**Response:** `201 Created` — No body

---

#### `POST /api/auth/login`
**Purpose:** Authenticate a user with email & password. Returns a Keycloak JWT access token and refresh token for use in all authenticated API calls.

```json
// Request Body
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```
**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "...",
  "expiresIn": 300,
  "tokenType": "Bearer"
}
```

---

#### `POST /api/auth/social/google`
**Purpose:** Log in or register via Google OAuth. Pass the Google ID token returned from the Google Sign-In SDK.

```json
// Request Body
{
  "token": "google-id-token-from-frontend"
}
```

---

#### `POST /api/auth/social/apple`
**Purpose:** Log in or register via Apple Sign-In. Pass the Apple identity token returned from the Apple Sign-In SDK.

```json
// Request Body
{
  "token": "apple-identity-token-from-frontend"
}
```

---

#### `POST /api/auth/forgot-password`
**Purpose:** Triggers a Keycloak password reset email to the provided email address.

```json
// Request Body
{
  "email": "john@example.com"
}
```
**Response:** `200 OK`

---

### 🔒 Authenticated Endpoints

> All require: `Authorization: Bearer <token>`

---

#### `GET /api/account/me`
**Purpose:** Retrieve the full profile of the currently logged-in user including name, email, role, phone, and creation date.

```
GET http://localhost:8081/api/account/me
Authorization: Bearer <token>
```
**Response:**
```json
{
  "id": "uuid-...",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "TRAVELER",
  "phoneNumber": "+94771234567"
}
```

---

#### `PUT /api/account/me`
**Purpose:** Update the currently logged-in user's profile details (name, phone number).

```
PUT http://localhost:8081/api/account/me
Authorization: Bearer <token>
```
```json
// Request Body
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "phoneNumber": "+94777654321"
}
```

---

#### `DELETE /api/account`
**Purpose:** Soft-delete the logged-in user's own account. Disables the account in Keycloak and marks `deleted_at` in the database. Does not permanently remove data.

```
DELETE http://localhost:8081/api/account
Authorization: Bearer <token>
```
**Response:** `200 OK`

---

### 👑 Admin Endpoints (Admin Token Required)

---

#### `GET /api/v1/auth/admin/users`
**Purpose:** List all registered users with optional search and role filtering.

```
GET http://localhost:8081/api/v1/auth/admin/users?search=john&role=TRAVELER
Authorization: Bearer <admin-token>
```

---

#### `GET /api/v1/auth/admin/users/{id}`
**Purpose:** Get detailed profile of any specific user by their ID or Keycloak subject ID.

```
GET http://localhost:8081/api/v1/auth/admin/users/uuid-of-user
Authorization: Bearer <admin-token>
```

---

#### `PUT /api/v1/auth/admin/users/{id}/role`
**Purpose:** Change a user's role (e.g., promote from TRAVELER to BUSINESS_OWNER). Optionally sets business type when promoting to BUSINESS_OWNER.

```
PUT http://localhost:8081/api/v1/auth/admin/users/uuid-of-user/role
Authorization: Bearer <admin-token>
```
```json
// Request Body
{
  "role": "BUSINESS_OWNER",
  "businessType": "HOTEL"
}
```

---

#### `DELETE /api/v1/auth/admin/users/{id}/soft-delete`
**Purpose:** Admin soft-deletes a user — disables the account in Keycloak and marks it deleted in DB without permanent removal.

```
DELETE http://localhost:8081/api/v1/auth/admin/users/uuid-of-user/soft-delete
Authorization: Bearer <admin-token>
```
**Response:** `204 No Content`

---

#### `DELETE /api/v1/auth/admin/users/{id}/hard-delete`
**Purpose:** Admin permanently deletes a user from both Keycloak and the database. **Irreversible.**

```
DELETE http://localhost:8081/api/v1/auth/admin/users/uuid-of-user/hard-delete
Authorization: Bearer <admin-token>
```
**Response:** `204 No Content`

---

#### `POST /api/v1/auth/admin/users/{id}/impersonate`
**Purpose:** Admin impersonation — generates a valid access token for any user without knowing their password. Used for debugging or troubleshooting specific user issues.

```
POST http://localhost:8081/api/v1/auth/admin/users/uuid-of-user/impersonate
Authorization: Bearer <admin-token>
```
**Response:**
```json
{
  "accessToken": "eyJhbGci... (token for the impersonated user)",
  "targetUserId": "uuid-of-user"
}
```

---

## 📚 Catalog Service — Port `8082`

**Base URL:** `http://localhost:8082`

---

### 🔓 Public Endpoints (No Token Required)

---

#### `GET /api/v1/catalog/public/business`
**Purpose:** List all approved and active business profiles (hotels, tour agencies, tour guides) publicly visible on the platform.

```
GET http://localhost:8082/api/v1/catalog/public/business
```

---

#### `GET /api/v1/catalog/public/search/businesses`
**Purpose:** Paginated search of businesses filtered by type and/or Sri Lankan city. Used to power the main discovery/browse screen.

```
GET http://localhost:8082/api/v1/catalog/public/search/businesses?type=HOTEL&city=COLOMBO&page=0&size=10
```

**Query Params:**
- `type`: `HOTEL`, `TOUR_AGENCY`, `TOUR_GUIDE`
- `city`: e.g. `COLOMBO`, `KANDY`, `GALLE`, `NUWARA_ELIYA`, `ELLA`, `NEGOMBO`
- `page`, `size`: Pagination

---

#### `GET /api/v1/catalog/public/search/business/{id}`
**Purpose:** Get full detailed profile for a single business (hotel, agency, or tour guide) by its unique ID.

```
GET http://localhost:8082/api/v1/catalog/public/search/business/uuid-of-business
```

---

#### `GET /api/v1/catalog/public/search/rooms`
**Purpose:** Paginated search for available hotel rooms filtered by city and price range.

```
GET http://localhost:8082/api/v1/catalog/public/search/rooms?city=COLOMBO&minPrice=50&maxPrice=200&page=0&size=10
```

**Query Params:**
- `city`: Sri Lankan city enum value
- `minPrice`, `maxPrice`: Price range in the room's currency
- `page`, `size`: Pagination

---

#### `GET /api/v1/catalog/public/search/tours`
**Purpose:** Paginated search for tour packages filtered by city, category, provider type, and price range.

```
GET http://localhost:8082/api/v1/catalog/public/search/tours?city=KANDY&category=CULTURAL&providerType=AGENCY&minPrice=100&maxPrice=500&page=0&size=10
```

**Query Params:**
- `city`: Sri Lankan city
- `category`: `CULTURAL`, `ADVENTURE`, `WILDLIFE`, `BEACH`, `SPIRITUAL`, `WELLNESS`, `HISTORICAL`, `ECO`, `CULINARY`
- `providerType`: `AGENCY`, `GUIDE`
- `minPrice`, `maxPrice`: Pricing filter
- `page`, `size`: Pagination

---

#### `GET /api/v1/catalog/public/items/rooms/{id}`
**Purpose:** Get full details of a specific hotel room by its ID (room type, capacity, price, images, amenities).

```
GET http://localhost:8082/api/v1/catalog/public/items/rooms/uuid-of-room
```

---

#### `GET /api/v1/catalog/public/items/day-out/{id}`
**Purpose:** Get full details of a specific day-out experience package (timing, pricing, availability days).

```
GET http://localhost:8082/api/v1/catalog/public/items/day-out/uuid-of-package
```

---

#### `GET /api/v1/catalog/public/items/night-out/{id}`
**Purpose:** Get full details of a specific night-out experience package.

```
GET http://localhost:8082/api/v1/catalog/public/items/night-out/uuid-of-package
```

---

#### `GET /api/v1/catalog/public/items/tours/{id}`
**Purpose:** Get full details of a specific tour package (itinerary, inclusions, duration, pricing).

```
GET http://localhost:8082/api/v1/catalog/public/items/tours/uuid-of-tour
```

---

#### `GET /api/v1/catalog/public/businesses/{businessId}/faqs`
**Purpose:** Get the FAQ list for a specific business, displayed on business listing pages.

```
GET http://localhost:8082/api/v1/catalog/public/businesses/uuid-of-business/faqs
```

---

#### `GET /api/v1/catalog/public/reviews`
**Purpose:** Paginated list of reviews for any entity (hotel, room, tour, etc.).

```
GET http://localhost:8082/api/v1/catalog/public/reviews?entityId=uuid-of-entity&entityType=HOTEL&page=0&size=10
```

**`entityType` values:** `HOTEL`, `ROOM`, `TOUR_PACKAGE`, `TOUR_GUIDE`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE`

---

#### `GET /api/v1/catalog/public/guides/{guideId}/blackout-dates`
**Purpose:** Get the unavailability/blocked dates for a specific tour guide. Used to show availability on the booking calendar.

```
GET http://localhost:8082/api/v1/catalog/public/guides/uuid-of-guide/blackout-dates
```

---

### 🔒 Business Owner Endpoints (Requires `BUSINESS_OWNER` or `TOUR_GUIDE` Token)

---

#### `GET /api/v1/catalog/business/me`
**Purpose:** Get the business owner's own business profile. Returns the full profile including status (DRAFT, PENDING, APPROVED).

```
GET http://localhost:8082/api/v1/catalog/business/me
Authorization: Bearer <business-owner-token>
```

---

#### `POST /api/v1/catalog/business/me/hotel/draft`
**Purpose:** Create or update a hotel/guesthouse business profile draft. The profile stays in DRAFT status until submitted for admin approval.

```
POST http://localhost:8082/api/v1/catalog/business/me/hotel/draft
Authorization: Bearer <business-owner-token>
```
```json
// Request Body
{
  "name": "Kandy View Hotel",
  "description": "A scenic 4-star hotel overlooking Kandy Lake",
  "tagline": "Where memories are made",
  "contactEmail": "info@kandyview.com",
  "contactPhone": "+94812345678",
  "whatsappNumber": "+94812345678",
  "website": "https://kandyview.com",
  "city": "KANDY",
  "region": "CENTRAL",
  "addressLine": "123 Lake Road, Kandy",
  "latitude": 7.2906,
  "longitude": 80.6337,
  "coverImageUrl": "https://res.cloudinary.com/example/image/upload/v1/cover.jpg",
  "galleryImageUrls": ["https://example.com/img1.jpg"],
  "starRating": 4,
  "totalBranches": 1,
  "propertyType": "HOTEL",
  "checkInTime": "14:00:00",
  "checkOutTime": "11:00:00",
  "petPolicy": "NOT_ALLOWED",
  "totalRooms": 50,
  "offersDayOutPackages": true,
  "offersNightOutPackages": true,
  "offersHourlyBooking": false
}
```

> **`propertyType`:** `HOTEL`, `GUESTHOUSE`, `BOUTIQUE_HOTEL`, `RESORT`, `VILLA`, `HOSTEL`
> **`petPolicy`:** `ALLOWED`, `NOT_ALLOWED`, `ALLOWED_ON_REQUEST`
> **`region`:** `WESTERN`, `CENTRAL`, `SOUTHERN`, `NORTHERN`, `EASTERN`, `NORTH_WESTERN`, `NORTH_CENTRAL`, `UVA`, `SABARAGAMUWA`

---

#### `POST /api/v1/catalog/business/me/agency/draft`
**Purpose:** Create or update a Tour Agency business profile draft.

```
POST http://localhost:8082/api/v1/catalog/business/me/agency/draft
Authorization: Bearer <business-owner-token>
```
```json
// Request Body
{
  "name": "Ceylon Adventures",
  "description": "Premium tour agency specializing in cultural and adventure tours",
  "tagline": "Explore Sri Lanka differently",
  "contactEmail": "info@ceylon-adventures.com",
  "contactPhone": "+94112345678",
  "city": "COLOMBO",
  "region": "WESTERN",
  "addressLine": "45 Galle Road, Colombo 03",
  "coverImageUrl": "https://example.com/cover.jpg",
  "licenseNumber": "TL-2024-001",
  "yearsInOperation": 10,
  "partnerNetworkSize": 25,
  "specializations": ["ADVENTURE", "CULTURAL", "ECO"],
  "fleetTypes": ["VAN", "BUS"]
}
```
> **`specializations`:** `ADVENTURE`, `CULTURAL`, `ECO`, `WELLNESS`, `BEACH`, `WILDLIFE`, `HISTORICAL`, `CULINARY`, `SPIRITUAL`
> **`fleetTypes`:** `CAR`, `VAN`, `BUS`, `JEEP`, `MOTORBIKE`, `TRIKE`, `BICYCLE`, `BOAT`

---

#### `POST /api/v1/catalog/business/me/guide/draft`
**Purpose:** Register as an individual Tour Guide. Creates a guide profile with license, languages, experience, and rates.

```
POST http://localhost:8082/api/v1/catalog/business/me/guide/draft
Authorization: Bearer <tour-guide-token>
```
```json
// Request Body
{
  "name": "Amal Perera",
  "description": "Government-certified guide with 8 years of experience in cultural heritage tours",
  "tagline": "Your trusted companion in Sri Lanka",
  "contactEmail": "amal@guide.com",
  "contactPhone": "+94771234567",
  "whatsappNumber": "+94771234567",
  "city": "KANDY",
  "region": "CENTRAL",
  "coverImageUrl": "https://example.com/amal.jpg",
  "licenseNumber": "TG-2024-KDY-001",
  "licenseType": "GOVERNMENT_CERTIFIED",
  "languagesSpoken": ["English", "Sinhala", "Tamil", "Japanese"],
  "yearsOfExperience": 8,
  "vehicleType": "CAR",
  "maxGroupSizeGuided": 8,
  "dailyRate": 120.00,
  "halfDayRate": 70.00
}
```

---

#### `POST /api/v1/catalog/business/me/submit`
**Purpose:** Submit the completed business profile draft to admin for approval. Status changes from `DRAFT` → `PENDING`. Triggers an admin review workflow.

```
POST http://localhost:8082/api/v1/catalog/business/me/submit
Authorization: Bearer <business-owner-token>
```
**Response:** Business profile with `status: "PENDING"`

---

#### `DELETE /api/v1/catalog/business/me`
**Purpose:** Business owner deletes their own business listing permanently.

```
DELETE http://localhost:8082/api/v1/catalog/business/me
Authorization: Bearer <business-owner-token>
```
**Response:** `204 No Content`

---

### 🏨 Room Management (Hotel Owner)

---

#### `POST /api/v1/catalog/business/me/rooms`
**Purpose:** Create a new room listing under the owner's hotel. Rooms are associated with the authenticated owner's hotel profile.

```
POST http://localhost:8082/api/v1/catalog/business/me/rooms
Authorization: Bearer <hotel-owner-token>
```
```json
// Request Body
{
  "roomNumber": "101",
  "roomType": "DELUXE",
  "pricePerNight": 150.00,
  "currency": "USD",
  "capacity": 2,
  "totalUnits": 5,
  "bedCount": 1,
  "sizeSquareMeters": 35.0,
  "imageUrls": ["https://example.com/room101.jpg"],
  "viewType": "LAKE_VIEW",
  "bedConfiguration": "1 King Bed",
  "smokingAllowed": false,
  "isHourlyBookable": false
}
```
> **`roomType`:** `STANDARD`, `DELUXE`, `SUPERIOR`, `SUITE`, `PENTHOUSE`, `FAMILY`, `CONNECTING`, `ACCESSIBLE`
> **`viewType`:** `LAKE_VIEW`, `MOUNTAIN_VIEW`, `GARDEN_VIEW`, `POOL_VIEW`, `OCEAN_VIEW`, `CITY_VIEW`, `NO_VIEW`
> **`currency`:** `LKR`, `USD`, `EUR`, `GBP`

---

#### `GET /api/v1/catalog/business/me/rooms`
**Purpose:** List all rooms belonging to the authenticated hotel owner.

```
GET http://localhost:8082/api/v1/catalog/business/me/rooms
Authorization: Bearer <hotel-owner-token>
```

---

#### `PUT /api/v1/catalog/business/me/rooms/{roomId}`
**Purpose:** Update details of an existing room (price, type, availability, images).

```
PUT http://localhost:8082/api/v1/catalog/business/me/rooms/uuid-of-room
Authorization: Bearer <hotel-owner-token>
```
> **Request body:** Same as `POST /rooms` above

---

#### `DELETE /api/v1/catalog/business/me/rooms/{roomId}`
**Purpose:** Delete a specific room from the hotel's listing.

```
DELETE http://localhost:8082/api/v1/catalog/business/me/rooms/uuid-of-room
Authorization: Bearer <hotel-owner-token>
```
**Response:** `204 No Content`

---

### 🎉 Experience Package Management (Hotel Owner)

---

#### `POST /api/v1/catalog/business/me/day-out-packages`
**Purpose:** Create a Day-Out experience package (e.g., poolside lunch package, spa day, adventure day).

```
POST http://localhost:8082/api/v1/catalog/business/me/day-out-packages
Authorization: Bearer <hotel-owner-token>
```
```json
// Request Body
{
  "title": "Kandy Highlights Day Out",
  "description": "Full-day package including lunch, pool access and guided temple visit",
  "price": 85.00,
  "pricingUnit": "PER_PERSON",
  "startTime": "09:00:00",
  "endTime": "18:00:00",
  "maxOccupancy": 20,
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
  "imageUrls": ["https://example.com/dayout.jpg"],
  "advanceBookingHoursRequired": 24
}
```
> **`pricingUnit`:** `PER_PERSON`, `PER_GROUP`, `FLAT_RATE`

---

#### `GET /api/v1/catalog/business/me/day-out-packages`
**Purpose:** Get all day-out packages created by the authenticated hotel owner.

```
GET http://localhost:8082/api/v1/catalog/business/me/day-out-packages
Authorization: Bearer <hotel-owner-token>
```

---

#### `PUT /api/v1/catalog/business/me/day-out-packages/{packageId}`
**Purpose:** Update an existing day-out package details.

```
PUT http://localhost:8082/api/v1/catalog/business/me/day-out-packages/uuid-of-package
Authorization: Bearer <hotel-owner-token>
```
> **Request body:** Same as POST above

---

#### `DELETE /api/v1/catalog/business/me/day-out-packages/{packageId}`
**Purpose:** Delete a day-out experience package.

```
DELETE http://localhost:8082/api/v1/catalog/business/me/day-out-packages/uuid-of-package
Authorization: Bearer <hotel-owner-token>
```
**Response:** `204 No Content`

---

#### `POST /api/v1/catalog/business/me/night-out-packages`
**Purpose:** Create a Night-Out experience package (e.g., dinner + show, rooftop party).

```
POST http://localhost:8082/api/v1/catalog/business/me/night-out-packages
Authorization: Bearer <hotel-owner-token>
```
```json
// Request Body (same structure as day-out with evening times)
{
  "title": "Signature Dinner Experience",
  "description": "5-course candlelit dinner overlooking Kandy Lake",
  "price": 120.00,
  "pricingUnit": "PER_PERSON",
  "startTime": "19:00:00",
  "endTime": "23:00:00",
  "maxOccupancy": 30,
  "availableDays": ["FRIDAY", "SATURDAY"],
  "imageUrls": ["https://example.com/nightout.jpg"],
  "advanceBookingHoursRequired": 48
}
```

---

#### `GET /api/v1/catalog/business/me/night-out-packages`
**Purpose:** Get all night-out packages for the authenticated hotel owner.

```
GET http://localhost:8082/api/v1/catalog/business/me/night-out-packages
Authorization: Bearer <hotel-owner-token>
```

---

#### `PUT /api/v1/catalog/business/me/night-out-packages/{packageId}`
**Purpose:** Update an existing night-out package.

```
PUT http://localhost:8082/api/v1/catalog/business/me/night-out-packages/uuid-of-package
Authorization: Bearer <hotel-owner-token>
```

---

#### `DELETE /api/v1/catalog/business/me/night-out-packages/{packageId}`
**Purpose:** Delete a night-out experience package.

```
DELETE http://localhost:8082/api/v1/catalog/business/me/night-out-packages/uuid-of-package
Authorization: Bearer <hotel-owner-token>
```
**Response:** `204 No Content`

---

#### `POST /api/v1/catalog/business/me/rooms/{roomId}/hourly-bookings`
**Purpose:** Add an hourly booking configuration to an existing room (e.g., day-use rooms, hourly event rooms).

```
POST http://localhost:8082/api/v1/catalog/business/me/rooms/uuid-of-room/hourly-bookings
Authorization: Bearer <hotel-owner-token>
```
```json
// Request Body
{
  "pricePerHour": 25.00,
  "minHours": 2,
  "maxHours": 8,
  "availableFrom": "08:00:00",
  "availableTo": "20:00:00"
}
```

---

### 🗺️ Tour Package Management (Agency / Guide Owner)

---

#### `POST /api/v1/catalog/business/me/tour-packages`
**Purpose:** Create a new tour package (multi-day itinerary, cultural tour, adventure trip, etc.) under the owner's agency or guide profile.

```
POST http://localhost:8082/api/v1/catalog/business/me/tour-packages
Authorization: Bearer <agency-or-guide-token>
```
```json
// Request Body
{
  "title": "5-Day Cultural Heritage Tour",
  "description": "Explore Kandy, Sigiriya, Polonnaruwa and Anuradhapura with an expert guide",
  "price": 450.00,
  "durationDays": 5,
  "category": "CULTURAL",
  "startingCity": "COLOMBO",
  "minGroupSize": 2,
  "maxGroupSize": 12,
  "imageUrls": ["https://example.com/heritage-tour.jpg"],
  "difficultyLevel": "EASY",
  "physicalRequirements": "Moderate walking required. Suitable for all fitness levels.",
  "transportModeIncluded": "VAN",
  "mealsIncluded": "FULL_BOARD",
  "accommodationIncluded": true,
  "isPrivateTour": false
}
```
> **`category`:** `CULTURAL`, `ADVENTURE`, `WILDLIFE`, `BEACH`, `SPIRITUAL`, `WELLNESS`, `HISTORICAL`, `ECO`, `CULINARY`
> **`difficultyLevel`:** `EASY`, `MODERATE`, `CHALLENGING`, `EXTREME`
> **`mealsIncluded`:** `NONE`, `BREAKFAST`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE`

---

#### `GET /api/v1/catalog/business/me/tour-packages`
**Purpose:** List all tour packages created by the authenticated owner.

```
GET http://localhost:8082/api/v1/catalog/business/me/tour-packages
Authorization: Bearer <agency-or-guide-token>
```

---

#### `PUT /api/v1/catalog/business/me/tour-packages/{packageId}`
**Purpose:** Update an existing tour package.

```
PUT http://localhost:8082/api/v1/catalog/business/me/tour-packages/uuid-of-package
Authorization: Bearer <agency-or-guide-token>
```
> **Request body:** Same as POST above

---

#### `DELETE /api/v1/catalog/business/me/tour-packages/{packageId}`
**Purpose:** Delete a tour package from the listing.

```
DELETE http://localhost:8082/api/v1/catalog/business/me/tour-packages/uuid-of-package
Authorization: Bearer <agency-or-guide-token>
```
**Response:** `204 No Content`

---

### 📅 Guide Calendar / Blackout Dates

---

#### `POST /api/v1/catalog/business/me/blackout-dates`
**Purpose:** Tour guide marks specific dates as unavailable (holidays, personal commitments, other bookings). These dates are shown on the public-facing booking calendar.

```
POST http://localhost:8082/api/v1/catalog/business/me/blackout-dates
Authorization: Bearer <tour-guide-token>
```
```json
// Request Body
{
  "date": "2026-09-15",
  "reason": "National holiday"
}
```

---

#### `DELETE /api/v1/catalog/business/me/blackout-dates/{id}`
**Purpose:** Remove a previously blocked date, making the guide available again on that date.

```
DELETE http://localhost:8082/api/v1/catalog/business/me/blackout-dates/uuid-of-blackout
Authorization: Bearer <tour-guide-token>
```
**Response:** `204 No Content`

---

### ❓ FAQ Management

---

#### `POST /api/v1/catalog/business/me/faqs`
**Purpose:** Add a frequently asked question to the business profile. FAQs help travelers get quick answers about policies, services, and facilities.

```
POST http://localhost:8082/api/v1/catalog/business/me/faqs
Authorization: Bearer <business-owner-token>
```
```json
// Request Body
{
  "question": "Do you offer airport transfers?",
  "answer": "Yes, we offer complimentary airport transfers for bookings over 3 nights."
}
```

---

#### `DELETE /api/v1/catalog/business/me/faqs/{faqId}`
**Purpose:** Delete an FAQ entry from the business profile.

```
DELETE http://localhost:8082/api/v1/catalog/business/me/faqs/uuid-of-faq
Authorization: Bearer <business-owner-token>
```
**Response:** `204 No Content`

---

### ⭐ Reviews

---

#### `POST /api/v1/catalog/reviews`
**Purpose:** Submit a review for any catalogued entity. Hotel-related reviews require a `bookingId`. Tour/guide reviews do not require `bookingId`.

```
POST http://localhost:8082/api/v1/catalog/reviews
Authorization: Bearer <traveler-token>
```
```json
// Review for a hotel (bookingId required)
{
  "reviewerName": "John Doe",
  "rating": 5,
  "comment": "Excellent service and stunning views. Highly recommended!",
  "entityType": "HOTEL",
  "entityId": "uuid-of-hotel",
  "stayOrTourDate": "2026-08-10",
  "bookingId": "uuid-of-completed-booking"
}

// Review for a tour package (bookingId not required)
{
  "reviewerName": "Jane Smith",
  "rating": 4,
  "comment": "Amazing cultural experience!",
  "entityType": "TOUR_PACKAGE",
  "entityId": "uuid-of-tour-package",
  "stayOrTourDate": "2026-07-25"
}
```

---

#### `PUT /api/v1/catalog/reviews/{reviewId}/respond`
**Purpose:** Business owner responds to a traveler's review (e.g., thank you message, addressing a complaint).

```
PUT http://localhost:8082/api/v1/catalog/reviews/uuid-of-review/respond
Authorization: Bearer <business-owner-token>
```
```json
// Request Body
{
  "response": "Thank you for your wonderful feedback! We look forward to welcoming you again."
}
```

---

### 👑 Admin Catalog Endpoints

---

#### `GET /api/v1/catalog/admin/business/pending`
**Purpose:** Admin retrieves all business profiles that have been submitted and are awaiting approval review.

```
GET http://localhost:8082/api/v1/catalog/admin/business/pending
Authorization: Bearer <admin-token>
```

---

#### `POST /api/v1/catalog/admin/business/{id}/approve`
**Purpose:** Admin approves a business listing. Status changes to `APPROVED` and the business becomes publicly visible. Triggers an approval notification email via RabbitMQ → Notification Service.

```
POST http://localhost:8082/api/v1/catalog/admin/business/uuid-of-business/approve
Authorization: Bearer <admin-token>
```

---

#### `POST /api/v1/catalog/admin/business/{id}/reject`
**Purpose:** Admin rejects a business listing with a reason. Status changes to `REJECTED`. Triggers a rejection email via RabbitMQ → Notification Service.

```
POST http://localhost:8082/api/v1/catalog/admin/business/uuid-of-business/reject
Authorization: Bearer <admin-token>
```
```json
// Request Body
{
  "reason": "Incomplete documentation submitted. Please provide your valid business registration certificate."
}
```

---

## 📅 Booking Service — Port `8083`

**Base URL:** `http://localhost:8083`

---

### 🔒 All Booking Endpoints Require Authentication

---

#### `POST /api/v1/bookings`
**Purpose:** Create a new booking (hotel room, day-out, night-out, or tour package). Creates a soft hold (ledger unit reservation) for 15 minutes, after which it auto-expires if payment is not completed.

> Supports idempotency via the optional `Idempotency-Key` header to prevent duplicate bookings on network retries.

```
POST http://localhost:8083/api/v1/bookings
Authorization: Bearer <traveler-token>
Idempotency-Key: unique-key-per-request-abc123
```
```json
// Booking a hotel room
{
  "businessId": "uuid-of-hotel",
  "itemType": "ROOM",
  "itemId": "uuid-of-room",
  "checkInDate": "2026-09-01",
  "checkOutDate": "2026-09-04",
  "guestCount": 2,
  "paymentMethod": "PAYHERE"
}

// Booking a tour package
{
  "businessId": "uuid-of-agency",
  "itemType": "TOUR_PACKAGE",
  "itemId": "uuid-of-tour",
  "checkInDate": "2026-10-05",
  "quantity": 3,
  "guestCount": 3,
  "paymentMethod": "PAYHERE"
}

// Booking a day-out package
{
  "businessId": "uuid-of-hotel",
  "itemType": "DAY_OUT_PACKAGE",
  "itemId": "uuid-of-dayout",
  "checkInDate": "2026-08-20",
  "guestCount": 4,
  "paymentMethod": "CASH"
}
```

> **`itemType`:** `ROOM`, `TOUR_PACKAGE`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE`, `HOURLY_ROOM_BOOKING`
> **`paymentMethod`:** `PAYHERE`, `CASH`, `BANK_TRANSFER`

---

#### `GET /api/v1/bookings/me`
**Purpose:** Get all bookings made by the currently authenticated traveler, ordered by most recent.

```
GET http://localhost:8083/api/v1/bookings/me
Authorization: Bearer <traveler-token>
```
**Response:** Array of booking objects with status, dates, and item details.

---

#### `GET /api/v1/bookings/business/{businessId}`
**Purpose:** Get all bookings received by a specific business. Used by business owners to manage their incoming bookings dashboard.

```
GET http://localhost:8083/api/v1/bookings/business/uuid-of-business
Authorization: Bearer <business-owner-token>
```

---

#### `PUT /api/v1/bookings/{id}/cancel`
**Purpose:** Traveler cancels their own booking. Atomically releases the held ledger units so the inventory becomes available again for other travelers.

```
PUT http://localhost:8083/api/v1/bookings/uuid-of-booking/cancel
Authorization: Bearer <traveler-token>
```

---

#### `PUT /api/v1/bookings/{id}/status`
**Purpose:** Business owner updates the status of an incoming booking (e.g., confirm it, mark as completed, reject it).

```
PUT http://localhost:8083/api/v1/bookings/uuid-of-booking/status
Authorization: Bearer <business-owner-token>
```
```json
// Request Body
{
  "status": "CONFIRMED"
}
```
> **`status`:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED`

---

### 📨 Inquiry Endpoints

---

#### `POST /api/v1/inquiries`
**Purpose:** Traveler sends a direct inquiry to a business (question about availability, custom tour requirements, group discounts, etc.) without committing to a booking.

```
POST http://localhost:8083/api/v1/inquiries
Authorization: Bearer <traveler-token>
```
```json
// Request Body
{
  "businessId": "uuid-of-business",
  "message": "Do you offer a customized 7-day family tour package for 5 adults and 2 children?",
  "preferredDate": "2026-12-20",
  "guestCount": 7
}
```

---

#### `GET /api/v1/inquiries/me`
**Purpose:** Get all inquiries submitted by the currently logged-in traveler.

```
GET http://localhost:8083/api/v1/inquiries/me
Authorization: Bearer <traveler-token>
```

---

#### `GET /api/v1/inquiries/business/{businessId}`
**Purpose:** Get all inquiries received by a specific business. Business owners use this to respond to customer queries.

```
GET http://localhost:8083/api/v1/inquiries/business/uuid-of-business
Authorization: Bearer <business-owner-token>
```

---

## 💳 Payment Service — Port `8084`

**Base URL:** `http://localhost:8084`

---

### 🔒 Authenticated Endpoints

---

#### `POST /api/v1/payment/checkout`
**Purpose:** Initiate a payment for an existing booking. Generates PayHere payment parameters (hash, merchant ID, amount) that the frontend uses to redirect the user to the PayHere payment gateway.

```
POST http://localhost:8084/api/v1/payment/checkout
Authorization: Bearer <traveler-token>
```
```json
// Request Body
{
  "bookingId": "uuid-of-booking",
  "amount": 450.00,
  "currency": "LKR"
}
```
**Response:**
```json
{
  "merchantId": "...",
  "orderId": "uuid-of-booking",
  "amount": "450.00",
  "currency": "LKR",
  "hash": "...",
  "returnUrl": "...",
  "notifyUrl": "http://localhost:8084/api/v1/payment/payhere/notify"
}
```
> Use the returned parameters to initialize PayHere checkout on the frontend.

---

### 🔓 Public/Webhook Endpoints

---

#### `POST /api/v1/payment/payhere/notify`
**Purpose:** PayHere payment gateway webhook. Called by PayHere servers after a payment is completed (success or failure). Updates the `PaymentTransaction` record in the database.

> ⚠️ **This is called by PayHere servers, NOT by the frontend.** For local testing, you can simulate it manually.

```
POST http://localhost:8084/api/v1/payment/payhere/notify
Content-Type: application/x-www-form-urlencoded
```
```
// Form Parameters (URL-encoded)
merchant_id=1234567
order_id=uuid-of-booking
payment_id=320023456789
payhere_amount=450.00
payhere_currency=LKR
status_code=2
md5sig=...
```
> `status_code=2` = Success | `status_code=0` = Pending | `status_code=-1` = Cancelled | `status_code=-2` = Failed | `status_code=-3` = Chargedback

---

## 🔄 Complete End-to-End Testing Flow

Follow this step-by-step flow to test the entire system:

### 1️⃣ Register & Login
```
POST /api/auth/register → role: TRAVELER
POST /api/auth/login    → get accessToken
```

### 2️⃣ Register a Business Owner
```
POST /api/auth/register → role: BUSINESS_OWNER
POST /api/auth/login    → get businessOwnerToken
```

### 3️⃣ Create & Submit Hotel Profile
```
POST /api/v1/catalog/business/me/hotel/draft  (businessOwnerToken)
POST /api/v1/catalog/business/me/submit       (businessOwnerToken)
```

### 4️⃣ Admin Approves the Business
```
GET  /api/v1/catalog/admin/business/pending  (adminToken)
POST /api/v1/catalog/admin/business/{id}/approve (adminToken)
```

### 5️⃣ Business Owner Adds Rooms
```
POST /api/v1/catalog/business/me/rooms       (businessOwnerToken)
```

### 6️⃣ Traveler Searches & Browses
```
GET  /api/v1/catalog/public/search/businesses?type=HOTEL&city=KANDY
GET  /api/v1/catalog/public/search/business/{id}
GET  /api/v1/catalog/public/items/rooms/{id}
```

### 7️⃣ Traveler Books a Room
```
POST /api/v1/bookings          (travelerToken)
GET  /api/v1/bookings/me       (travelerToken)
```

### 8️⃣ Initiate Payment
```
POST /api/v1/payment/checkout  (travelerToken)
```

### 9️⃣ Simulate Payment Confirmation (Webhook)
```
POST /api/v1/payment/payhere/notify (form data, no auth)
```

### 🔟 Business Owner Confirms Booking
```
PUT /api/v1/bookings/{id}/status → {"status": "CONFIRMED"} (businessOwnerToken)
```

### 1️⃣1️⃣ Traveler Leaves a Review
```
POST /api/v1/catalog/reviews   (travelerToken)
GET  /api/v1/catalog/public/reviews?entityId={id}&entityType=HOTEL
```

---

## 🔁 Valid Enum Reference

| Enum | Values |
|------|--------|
| `UserRole` | `TRAVELER`, `BUSINESS_OWNER`, `TOUR_GUIDE`, `ADMIN` |
| `BusinessType` | `HOTEL`, `TOUR_AGENCY`, `TOUR_GUIDE` |
| `SriLankanCity` | `COLOMBO`, `KANDY`, `GALLE`, `NUWARA_ELIYA`, `ELLA`, `NEGOMBO`, `TRINCOMALEE`, `JAFFNA`, `BENTOTA`, `MIRISSA`, `HIKKADUWA`, `SIGIRIYA`, `POLONNARUWA`, `ANURADHAPURA`, `DAMBULLA`, `MATARA`, `BADULLA`, `RATNAPURA`, `BATTICALOA`, `VAVUNIYA` |
| `Region` | `WESTERN`, `CENTRAL`, `SOUTHERN`, `NORTHERN`, `EASTERN`, `NORTH_WESTERN`, `NORTH_CENTRAL`, `UVA`, `SABARAGAMUWA` |
| `TourCategory` | `CULTURAL`, `ADVENTURE`, `WILDLIFE`, `BEACH`, `SPIRITUAL`, `WELLNESS`, `HISTORICAL`, `ECO`, `CULINARY` |
| `DifficultyLevel` | `EASY`, `MODERATE`, `CHALLENGING`, `EXTREME` |
| `RoomType` | `STANDARD`, `DELUXE`, `SUPERIOR`, `SUITE`, `PENTHOUSE`, `FAMILY`, `CONNECTING`, `ACCESSIBLE` |
| `PropertyType` | `HOTEL`, `GUESTHOUSE`, `BOUTIQUE_HOTEL`, `RESORT`, `VILLA`, `HOSTEL` |
| `PetPolicy` | `ALLOWED`, `NOT_ALLOWED`, `ALLOWED_ON_REQUEST` |
| `ItemType` (Booking) | `ROOM`, `TOUR_PACKAGE`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE`, `HOURLY_ROOM_BOOKING` |
| `PaymentMethod` | `PAYHERE`, `CASH`, `BANK_TRANSFER` |
| `BookingStatus` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED` |
| `ReviewEntityType` | `HOTEL`, `ROOM`, `TOUR_PACKAGE`, `TOUR_GUIDE`, `DAY_OUT_PACKAGE`, `NIGHT_OUT_PACKAGE` |
| `VehicleType` | `CAR`, `VAN`, `BUS`, `JEEP`, `MOTORBIKE`, `TRIKE`, `BICYCLE`, `BOAT` |
| `MealPlan` | `NONE`, `BREAKFAST`, `HALF_BOARD`, `FULL_BOARD`, `ALL_INCLUSIVE` |
| `PricingUnit` | `PER_PERSON`, `PER_GROUP`, `FLAT_RATE` |
| `ViewType` | `LAKE_VIEW`, `MOUNTAIN_VIEW`, `GARDEN_VIEW`, `POOL_VIEW`, `OCEAN_VIEW`, `CITY_VIEW`, `NO_VIEW` |

---

## 🛠️ Recommended Testing Tools

| Tool | Usage |
|------|-------|
| **Swagger UI** | `http://localhost:{port}/swagger-ui.html` — Best for interactive testing |
| **Postman** | Import manual requests, save environments with token variables |
| **curl** | Command-line quick testing |
| **IntelliJ HTTP Client** | `.http` files in project for version-controlled requests |

---

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Missing or expired JWT | Get a fresh token via `POST /api/auth/login` |
| `403 Forbidden` | User lacks required role | Use the correct token (admin/business/traveler) |
| `409 Conflict` on booking | Idempotency key reused with different payload | Use a new unique `Idempotency-Key` |
| `FlywayException` on startup | Non-empty schema, no history table | `spring.flyway.baseline-on-migrate: true` (already fixed) |
| Service won't start on port | Port already in use | Kill the existing process in IntelliJ or use `Stop-Process` |
| Swagger shows blank page | Swagger endpoints not permitted | Already fixed in `SecurityConfig.java` for all services |
