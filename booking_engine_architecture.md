# Booking Engine & Availability Architecture

This document provides a comprehensive breakdown of the Blue Ceylon Booking Engine, detailing exactly how the `booking-service` coordinates with the `catalog-service` to ensure accurate inventory management, prevent double-bookings, and enforce guest capacity limits.

---

## 1. High-Level Architecture

The **Booking Engine** operates within the `booking-service` microservice. It is designed to be highly independent but relies on the `catalog-service` as the source of truth for pricing and total inventory size.

When a user submits a booking request, the flow traverses the following components:
1. **`BookingController`**: Receives the incoming HTTP request.
2. **`BookingApplicationService`**: The orchestrator. It calculates prices, creates the booking record, and triggers notifications.
3. **`AvailabilityService`**: The gatekeeper. It strictly blocks any booking that violates inventory or guest limits.
4. **`CatalogClient`**: A synchronous WebClient that fetches real-time data from the `catalog-service`.
5. **`BookingNotificationPublisher`**: Asynchronously pushes events to RabbitMQ for the `notification-service`.

---

## 2. The Availability Engine (`AvailabilityService.java`)

The availability engine is the most critical part of the system. It ensures that a hotel never receives more bookings than it has physical units for, and that guests do not over-pack a room.

The check happens in four distinct phases:

### Phase A: Fetching the Source of Truth
The engine makes a network call to the `catalog-service` (via `CatalogClient`) to fetch the requested item (Room, Day Out, Night Out). It extracts two crucial metrics:
- **`maxCapacity` (Physical Units)**: Derived from `totalUnits` (for rooms) or `dailyLimit` (for packages). This represents how many *instances* of this item the hotel can sell per day. If a hotel didn't specify this, it strictly defaults to `1`.
- **`capacity` (Guest Limit)**: Represents the maximum number of people that can fit into a single unit.

### Phase B: Guest Capacity Validation
Before checking dates, the engine immediately validates the guest count to prevent API abuse (e.g., booking 1 room for 5 people when the room only holds 2).

**The Formula:**
`Max Guests Allowed = item.capacity * requestedQuantity`

If the user's `request.getGuestCount()` exceeds `Max Guests Allowed`, the booking is instantly rejected. 

> [!CAUTION]
> This protects hotels from users trying to bypass the frontend search filters by directly interacting with the Booking API.

### Phase C: The Optimized Overlap Query
The engine must determine how many units are *already booked* for the requested dates. It does this by querying the `BookingRepository`.

To guarantee maximum database performance, it does not fetch all bookings and filter them in memory. Instead, it runs a highly optimized JPA `@Query`:

```sql
SELECT b FROM Booking b 
WHERE b.itemType = :itemType 
  AND b.itemId = :itemId 
  AND (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate) 
  AND b.status IN ('PENDING', 'CONFIRMED')
```

**Why this query works perfectly:**
The logic `(existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn)` is the standard mathematical formula to detect any overlapping date ranges. It accurately catches:
- Bookings that are fully inside the requested dates.
- Bookings that partially overlap the beginning or end.
- Bookings that completely envelop the requested dates.
It strictly ignores `CANCELLED` or `REFUNDED` bookings.

### Phase D: The Final Inventory Check
Once the overlapping bookings are fetched, the engine sums up the `quantity` of all those bookings to find the `currentlyBooked` metric.

**The Formula:**
`if (currentlyBooked + requestedQuantity > maxCapacity) -> THROW EXCEPTION`

If the requested quantity fits within the remaining inventory, the engine allows the flow to proceed.

---

## 3. The Booking Process (`BookingApplicationService.java`)

Once the `AvailabilityService` gives the green light, the `BookingApplicationService` takes over to finalize the transaction.

### Step 1: Dynamic Pricing
The service pulls the `price` (or `pricePerNight`) from the `CatalogItemDto`. 
It then calculates the multiplier:
- **For Rooms**: `Multiplier = Days between Check-In and Check-Out`.
- **For Packages**: `Multiplier = 1` (since packages are typically single-day events).

**Total Amount =** `price * request.quantity * multiplier`

### Step 2: Status Assignment
The MVP relies heavily on the `PAY_AT_PROPERTY` and `BANK_TRANSFER` payment methods. 
- If the payment method is `PAY_AT_PROPERTY` or `BANK_TRANSFER`, the booking is instantly marked as **`CONFIRMED`**.
- If it is an online payment (to be integrated later), it is marked as **`PENDING`** until a webhook from the payment gateway confirms the transaction.

### Step 3: Persistence
The Booking entity is saved to the PostgreSQL `blueceylon_booking` database.

### Step 4: Asynchronous Notifications
Once the database commits the transaction, the `BookingNotificationPublisher` is invoked.
It constructs two `NotificationEvent` objects containing dynamic variables (Booking ID, Total Amount, Quantity, etc.).
These events are fired into the **RabbitMQ** `notification.exchange` with the routing key `email.routing.key`.

The `booking-service` immediately returns the successful response to the user, not waiting for the emails to actually send. In the background, the `notification-service` consumes the RabbitMQ queue and dispatches the customized HTML emails to the traveler and the hotel owner.
