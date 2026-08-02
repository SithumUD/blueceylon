# Catalog Data Specifications

This document outlines the data requirements for all entities in the Blue Ceylon Catalog Service. This includes Business Profiles (Hotels, Tour Agencies, Tour Guides), as well as the sub-entities they manage (Rooms, Tour Packages, etc.).

---

## 1. Business Profiles

When an authenticated user wants to register as a service provider, they must create exactly **one** business profile.

### Shared Data (Required for ALL profile types)
- **`name`** / **`displayName`** (String): The official name of the business or guide.
- **`description`** / **`bio`** (String): A detailed description of the services offered.
- **`contactEmail`** (String): Official contact email.
- **`contactPhone`** (String): Official contact phone number.
- **`city`** (Enum: `SriLankanCity`): The primary city of operation (e.g., COLOMBO, KANDY, GALLE).
- **`addressLine`** (String): Physical address or primary meeting point.
- **`latitude`** / **`longitude`** (Double): Exact GPS coordinates for map display.
- **`coverImageUrl`** / **`profileImageUrl`** (String URL): A high-quality cover photo representing the business/guide.

### A. Hotel Profile
If the user selects `HOTEL`, they provide the shared data plus:
- **`starRating`** (Integer, 1-5): The official or self-declared star rating of the hotel.
- **`totalBranches`** (Integer, default 1): Number of hotel branches under this name.

### B. Tour Agency Profile
If the user selects `TOUR_AGENCY`, they provide the shared data plus:
- **`licenseNumber`** (String): The SLTDA travel agent registration number.
- **`yearsInOperation`** (Integer): How many years the agency has been operating.

### C. Tour Guide Profile
If the user selects `TOUR_GUIDE`, they provide the shared data plus:
- **`sltdaLicenseNumber`** (String): The SLTDA Tour Guide license number.
- **`licenseType`** (String): e.g., "National", "Chauffeur", "Site".
- **`languagesSpoken`** (List of Strings): Languages the guide is fluent in (e.g., ["English", "German", "Sinhala"]).
- **`yearsOfExperience`** (Integer): Years of professional guiding experience.
- **`vehicleType`** (Enum: `VehicleType`): The type of vehicle they provide (e.g., SEDAN, VAN, NONE).

---

## 2. Rooms (Managed by Hotels)

Once a Hotel is created, the owner can add `Room` configurations.

- **`roomNumber`** (String): Identifier for the room or room category.
- **`roomType`** (Enum: `RoomType`): e.g., SINGLE, DOUBLE, SUITE, FAMILY.
- **`pricePerNight`** (Double): Base price per night.
- **`currency`** (Enum: `Currency`): Default is `LKR`.
- **`capacity`** (Integer): Maximum number of guests.
- **`bedCount`** (Integer): Total number of beds.
- **`sizeSquareMeters`** (Double): Physical size of the room.
- **`availableFrom`** / **`availableTo`** (LocalDate): Seasonal availability (optional).
- **`totalUnits`** (Integer): Physical count of this exact room type available in the hotel.
- **`imageUrls`** (List of Strings): Photos of the specific room type.
- **`amenities`** (List of Amenity IDs): Specific amenities (e.g., AC, Sea View, Balcony).

---

## 3. Tour Packages (Managed by Agencies, Guides, or Hotels)

Tour Packages can be created by any approved business profile owner.

- **`title`** (String): Name of the tour.
- **`description`** (String): Detailed marketing description.
- **`price`** (Double): Base per-person price (default/fallback).
- **`currency`** (Enum: `Currency`): Default is `USD`.
- **`durationDays`** (Integer): Total days the tour lasts.
- **`category`** (Enum: `TourCategory`): e.g., ADVENTURE, WILDLIFE, CULTURAL, BEACH.
- **`startingCity`** (Enum: `SriLankanCity`): Where the tour departs from.
- **`minGroupSize`** / **`maxGroupSize`** (Integer): Group size limits.
- **`imageUrls`** (List of Strings): Promotional photos.
- **`inclusions`** (List of Amenity IDs): Things included (e.g., "Lunch", "Tickets").
- **`scheduledDepartureDates`** (List of LocalDates): For fixed-departure group tours. Empty for private/on-demand tours.

### A. Itinerary Days (Nested under Tour Package)
For multi-day tours, the itinerary is broken down day-by-day.
- **`dayNumber`** (Integer): 1, 2, 3, etc.
- **`title`** (String): Headline for the day (e.g., "Arrival and Colombo City Tour").
- **`description`** (String): Detailed activities for that day.
- **`overnightLocation`** (String): Where the guests will sleep.

### B. Group Pricing Tiers (Nested under Tour Package)
Dynamic pricing based on the number of travelers booking together.
- **`minTravelers`** (Integer): The minimum party size to unlock this tier.
- **`maxTravelers`** (Integer): The maximum party size for this tier.
- **`pricePerPerson`** (Double): The discounted rate applied per person in this tier.

---

## 4. Other Shared Entities

### Amenities
Standardized list of features/inclusions managed by Admins, attached to Rooms or Tours.
- **`name`** (String): e.g., "Free WiFi", "Breakfast Included".
- **`icon`** (String): UI Icon identifier (e.g., "fa-wifi").
- **`category`** (String): Grouping category (e.g., "ROOM_FEATURE", "TOUR_INCLUSION").

### Guide Blackout Dates
Allows Tour Guides to block their calendar for personal time or external bookings.
- **`date`** (LocalDate): The exact day the guide is unavailable.
- **`reason`** (String): Optional note (e.g., "Personal Leave").
