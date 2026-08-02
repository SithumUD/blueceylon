# Blue Ceylon Booking Engine — Production Architecture (v2.0)

**Status:** Finalized design — race-condition-free, idempotent, resilient
**Supersedes:** v1.0 (conceptual draft)
**Scope:** `booking-service`, `catalog-service` interaction, availability engine, notification pipeline

---

## 0. What Changed From v1.0 and Why

v1.0 described a **check-then-insert** availability engine: read current bookings, compare to capacity, then separately insert the new booking. That pattern is broken under concurrency — two simultaneous requests can both read "1 of 2 units taken" and both insert, overselling the room. Everything in this document exists to close that gap and the related gaps around it (abandoned checkouts, duplicate submissions, silent notification loss, catalog-service outages).

| Problem in v1.0 | Fix in v2.0 |
|---|---|
| Check-then-insert race condition → overbooking | Atomic conditional decrement on a per-item/per-day inventory ledger (§2) |
| No checkout hold → lost inventory mid-payment | Soft-hold reservation with TTL (§3) |
| Retried requests create duplicate bookings | Idempotency-Key enforcement (§4) |
| Abandoned `PENDING` bookings lock inventory forever | Scheduled expiry sweeper (§5) |
| Notification lost if MQ is down at commit time | Transactional outbox pattern (§6) |
| `catalog-service` outage takes down all bookings | Timeout + circuit breaker + short-TTL cache (§7) |
| Price can drift between quote and submit | Server-side price re-validation + quote token (§8) |
| Multi-room cart bookings not atomic as a set | All-or-nothing cart transaction (§9) |
| No abuse protection | Rate limiting (§10) |
| No visibility into near-capacity or lock contention | Structured metrics & logging (§11) |
| Date-boundary bugs across timezones | Hotel-local date normalization (§12) |

---

## 1. High-Level Architecture

```
                         ┌─────────────────────┐
                         │   BookingController   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │   BookingApplicationService      │
                    │  (orchestrator, idempotency,     │
                    │   pricing, transaction boundary) │
                    └───────┬───────────────┬──────────┘
                            │               │
              ┌─────────────▼───┐   ┌───────▼────────────┐
              │ AvailabilityService │   │   CatalogClient      │
              │ (atomic reserve/    │   │ (resilient WebClient │
              │  release engine)    │   │  + cache + breaker)  │
              └─────────────┬────┘   └───────┬────────────┘
                            │                │
              ┌─────────────▼────┐  ┌────────▼─────────┐
              │ InventoryLedger DB │  │  catalog-service   │
              │ (Postgres, atomic  │  │  (source of truth  │
              │  UPDATE-based)     │  │  for price/units)  │
              └────────────────────┘  └───────────────────┘

                    Booking committed
                            │
              ┌─────────────▼────────────┐
              │  Outbox table (same TX)   │
              └─────────────┬────────────┘
                            │  polled by
              ┌─────────────▼────────────┐
              │  OutboxRelay → RabbitMQ    │
              │  notification.exchange     │
              └─────────────┬────────────┘
                            │
              ┌─────────────▼────────────┐
              │    notification-service    │
              │  (emails to guest + owner)  │
              └────────────────────────────┘
```

**Core principle governing every design decision below:** inventory correctness must never depend on "read, then decide, then write" happening quickly enough. It must be enforced by the database as a single atomic operation, with the database itself refusing the write if capacity is exceeded.

---

## 2. The Availability & Inventory Engine

### 2.1 Data model: the Inventory Ledger

Replace "count overlapping bookings on every request" with a **precomputed per-day ledger row** per sellable item. This is the single most important structural change from v1.0.

```sql
CREATE TABLE inventory_ledger (
    item_type       VARCHAR(20)  NOT NULL,        -- 'ROOM' | 'DAY_OUT' | 'NIGHT_OUT'
    item_id         BIGINT       NOT NULL,
    stay_date       DATE         NOT NULL,         -- one row per calendar day (hotel-local)
    max_capacity    INT          NOT NULL,         -- totalUnits / dailyLimit, synced from catalog-service
    booked_units    INT          NOT NULL DEFAULT 0,
    held_units      INT          NOT NULL DEFAULT 0,  -- soft-holds in progress (see §3)
    version         BIGINT       NOT NULL DEFAULT 0,   -- optimistic lock fallback / audit
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    PRIMARY KEY (item_type, item_id, stay_date),
    CONSTRAINT capacity_not_exceeded
        CHECK (booked_units + held_units <= max_capacity),
    CONSTRAINT non_negative
        CHECK (booked_units >= 0 AND held_units >= 0)
);

CREATE INDEX idx_ledger_item_date ON inventory_ledger (item_type, item_id, stay_date);
```

For a multi-night room booking, one row exists **per night** of the stay. A 3-night booking touches 3 ledger rows. This trades a small amount of storage for the ability to do a single atomic `UPDATE` per date instead of a range-overlap scan — and it makes partial-date availability queries trivial and fast (index-only scan).

Rows are created lazily (upserted with `max_capacity` from `catalog-service`) the first time a date is touched, or pre-materialized by a nightly job for the next N days (recommended — avoids a cold-start upsert race on the very first booking for a new date).

### 2.2 The atomic reserve operation

This single SQL statement **is** the availability check. There is no separate "check" step — the check and the write are the same atomic operation, so no race window exists.

```sql
UPDATE inventory_ledger
SET held_units  = held_units + :requestedQuantity,
    version     = version + 1,
    updated_at  = now()
WHERE item_type = :itemType
  AND item_id   = :itemId
  AND stay_date = :date
  AND booked_units + held_units + :requestedQuantity <= max_capacity;
```

- If the row's remaining capacity is sufficient, the `WHERE` clause matches, the row updates, and the driver reports **1 row affected**.
- If capacity is insufficient, the `WHERE` clause matches zero rows — the update simply does nothing, and the driver reports **0 rows affected**.

```java
@Transactional
public HoldResult tryReserve(ItemType itemType, Long itemId, LocalDate date, int quantity) {
    int rowsUpdated = inventoryLedgerRepository.atomicIncrementHeld(itemType, itemId, date, quantity);
    return rowsUpdated == 1 ? HoldResult.success() : HoldResult.insufficientCapacity();
}
```

For a multi-night stay, every date's atomic update runs **inside one database transaction**. If any single date fails (returns 0 rows), the whole transaction rolls back and every date's held units revert — the guest gets a clean "not available" response instead of a partially-reserved stay.

```java
@Transactional
public HoldResult reserveDateRange(ItemType itemType, Long itemId,
                                    LocalDate checkIn, LocalDate checkOut, int quantity) {
    for (LocalDate date = checkIn; date.isBefore(checkOut); date = date.plusDays(1)) {
        int rows = inventoryLedgerRepository.atomicIncrementHeld(itemType, itemId, date, quantity);
        if (rows == 0) {
            throw new InsufficientInventoryException(itemType, itemId, date);
            // @Transactional rolls back all prior increments in this loop automatically
        }
    }
    return HoldResult.success();
}
```

**Why this beats row-level locking (`SELECT ... FOR UPDATE`):** no lock is held across application logic or network calls — the row lock exists only for the microseconds of the `UPDATE` itself. This scales far better under contention than pessimistic locking, and there's no deadlock risk from lock ordering across multiple date rows, since each `UPDATE` is independently atomic and short-lived.

### 2.3 Guest capacity validation (unchanged principle, clarified)

This check has no concurrency risk — it doesn't touch shared state — so it stays a simple pre-check, run **before** attempting any reservation to fail fast and avoid unnecessary ledger writes.

```java
int maxGuestsAllowed = catalogItem.getCapacity() * request.getQuantity();
if (request.getGuestCount() > maxGuestsAllowed) {
    throw new GuestCapacityExceededException(maxGuestsAllowed, request.getGuestCount());
}
```

### 2.4 Converting a hold into a confirmed booking

Once payment/confirmation succeeds, the hold is converted — `held_units` decreases, `booked_units` increases, by the same amount, atomically:

```sql
UPDATE inventory_ledger
SET held_units  = held_units - :quantity,
    booked_units = booked_units + :quantity,
    version      = version + 1
WHERE item_type = :itemType AND item_id = :itemId AND stay_date = :date
  AND held_units >= :quantity;
```

### 2.5 Releasing a hold (cancellation, expiry, or failed payment)

```sql
UPDATE inventory_ledger
SET held_units = held_units - :quantity,
    version     = version + 1
WHERE item_type = :itemType AND item_id = :itemId AND stay_date = :date
  AND held_units >= :quantity;
```

Both operations above are idempotent-safe when combined with the booking's own state machine (§3) — a hold can only be converted or released once, enforced by checking the `Booking.status` transition in the same transaction.

### 2.6 Why the ledger replaces the old overlap query entirely

The v1.0 `SELECT ... WHERE checkIn < :checkOut AND checkOut > :checkIn` overlap query is no longer needed for availability enforcement — the ledger's `CHECK` constraint enforces correctness at the database level regardless of application logic bugs, retries, or bypassed service layers. It remains useful only as a **read-side query** for calendar/search views (e.g., "show me open dates this month"), where it can run against a read replica without any locking concerns.

---

## 3. Soft-Hold / Checkout Reservation

Real booking platforms never let a user pass availability and then risk losing the room during payment entry. A hold is created the moment checkout begins and expires automatically if not completed.

### 3.1 Booking state machine

```
        reserve()                 confirm()
INITIATED ────────► HELD ──────────────────► CONFIRMED
                      │                            │
                      │ expire() / cancel()         │ cancel() / refund()
                      ▼                            ▼
                  EXPIRED / CANCELLED         CANCELLED / REFUNDED
```

| Status | Counts toward inventory? | Set by |
|---|---|---|
| `INITIATED` | No | Booking row created, before ledger touched |
| `HELD` | Yes (`held_units`) | Successful atomic reserve (§2.2) |
| `CONFIRMED` | Yes (`booked_units`) | `PAY_AT_PROPERTY`/`BANK_TRANSFER` immediately, or payment webhook |
| `EXPIRED` | No | Scheduled sweeper (§5) after TTL |
| `CANCELLED` | No | Guest/host cancellation |
| `REFUNDED` | No | Refund completion |

### 3.2 Hold TTL

- Default: **15 minutes** from `HELD` timestamp — long enough for checkout form completion, short enough to keep inventory liquid.
- `PAY_AT_PROPERTY` / `BANK_TRANSFER` bookings skip the hold window entirely and go straight to `HELD → CONFIRMED` within the same request, since no external payment confirmation is awaited.
- Online-payment bookings sit in `HELD` until the payment webhook fires or the TTL expires, whichever comes first.

```java
@Column(name = "hold_expires_at")
private Instant holdExpiresAt; // set to now() + 15min when status becomes HELD
```

---

## 4. Idempotency

Every booking-creation request must carry a client-generated `Idempotency-Key` header. Network retries, double-taps, and mobile timeouts must never create duplicate bookings or double-reserve inventory.

```sql
CREATE TABLE idempotency_keys (
    idempotency_key   VARCHAR(64)  PRIMARY KEY,
    request_hash      VARCHAR(64)  NOT NULL,   -- hash of request body, detects key reuse with different payload
    response_status   INT,
    response_body     JSONB,
    booking_id        BIGINT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```java
@PostMapping("/bookings")
public ResponseEntity<BookingResponse> createBooking(
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @RequestBody BookingRequest request) {

    Optional<IdempotencyRecord> existing = idempotencyService.find(idempotencyKey);
    if (existing.isPresent()) {
        if (!existing.get().matchesHash(request)) {
            throw new IdempotencyKeyConflictException(); // same key, different payload → 409
        }
        return existing.get().replayResponse(); // exact same result as the original call
    }

    BookingResponse response = bookingApplicationService.createBooking(request);
    idempotencyService.record(idempotencyKey, request, response);
    return ResponseEntity.ok(response);
}
```

Keys expire after 24 hours (sufficient to cover realistic retry windows; cleaned up by the same sweeper job as §5).

---

## 5. Scheduled Expiry Sweeper

A background job runs every minute to reclaim inventory from abandoned checkouts and stale idempotency records.

```java
@Scheduled(fixedRate = 60_000)
@Transactional
public void expireStaleHolds() {
    List<Booking> expired = bookingRepository
        .findByStatusAndHoldExpiresAtBefore(BookingStatus.HELD, Instant.now());

    for (Booking booking : expired) {
        availabilityService.releaseHold(booking);   // §2.5, atomic per date
        booking.setStatus(BookingStatus.EXPIRED);
        bookingRepository.save(booking);
        outboxService.enqueue(NotificationEvent.holdExpired(booking)); // optional: notify guest
    }
}

@Scheduled(cron = "0 0 3 * * *") // daily at 3am
public void purgeOldIdempotencyKeys() {
    idempotencyRepository.deleteByCreatedAtBefore(Instant.now().minus(Duration.ofHours(24)));
}
```

This job is what makes `PENDING`/`HELD` correctly count toward inventory (blocking abuse via cart-spamming) **without** permanently locking out real guests when a payment is abandoned.

---

## 6. Transactional Outbox for Notifications

Publishing directly to RabbitMQ *after* the database commit creates a window where the booking exists but the notification is silently lost if the app crashes or the broker is unreachable at that exact moment. The outbox pattern removes that window by making the notification durable in the **same transaction** as the booking.

```sql
CREATE TABLE outbox_events (
    id              BIGSERIAL PRIMARY KEY,
    aggregate_type  VARCHAR(50) NOT NULL,   -- 'BOOKING'
    aggregate_id    BIGINT      NOT NULL,
    event_type      VARCHAR(50) NOT NULL,   -- 'BOOKING_CONFIRMED', 'HOLD_EXPIRED', etc.
    payload         JSONB       NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING | PUBLISHED | FAILED
    retry_count     INT         NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at    TIMESTAMPTZ
);

CREATE INDEX idx_outbox_pending ON outbox_events (status, created_at) WHERE status = 'PENDING';
```

```java
@Transactional
public BookingResponse confirmBooking(Booking booking) {
    booking.setStatus(BookingStatus.CONFIRMED);
    bookingRepository.save(booking);                       // same TX
    outboxRepository.save(OutboxEvent.bookingConfirmed(booking)); // same TX — commits or rolls back together
    return BookingResponse.from(booking);
}
```

A separate poller (or Debezium/CDC in higher-scale setups) reads `PENDING` rows and publishes to RabbitMQ, marking rows `PUBLISHED` on ack:

```java
@Scheduled(fixedRate = 2_000)
public void relayOutboxEvents() {
    List<OutboxEvent> batch = outboxRepository.findTop50ByStatusOrderByCreatedAt(PENDING);
    for (OutboxEvent event : batch) {
        try {
            rabbitTemplate.convertAndSend("notification.exchange", "email.routing.key", event.getPayload());
            event.markPublished();
        } catch (Exception e) {
            event.incrementRetry(); // exponential backoff via retry_count; dead-letter after N attempts
        }
        outboxRepository.save(event);
    }
}
```

**Guarantee:** at-least-once delivery. The `notification-service` should already be idempotent on `bookingId + eventType` (recommended) since retries can theoretically redeliver.

---

## 7. Resilient `catalog-service` Integration

The v1.0 synchronous WebClient call had no timeout, retry, or fallback — a slow or down `catalog-service` would hang or fail every booking. Fix with three layers:

```java
@Bean
public WebClient catalogWebClient() {
    return WebClient.builder()
        .baseUrl(catalogServiceUrl)
        .clientConnector(new ReactorClientHttpConnector(
            HttpClient.create().responseTimeout(Duration.ofMillis(800))))
        .build();
}

@CircuitBreaker(name = "catalogService", fallbackMethod = "getCachedCatalogItem")
@Retry(name = "catalogService")
@Cacheable(value = "catalogItems", key = "#itemType + '-' + #itemId", unless = "#result == null")
public CatalogItemDto getCatalogItem(ItemType itemType, Long itemId) {
    return catalogClient.fetch(itemType, itemId);
}

public CatalogItemDto getCachedCatalogItem(ItemType itemType, Long itemId, Throwable t) {
    return catalogCacheRepository.getLastKnownGood(itemType, itemId)
        .orElseThrow(() -> new CatalogUnavailableException(itemType, itemId));
}
```

**resilience4j.yml:**
```yaml
resilience4j:
  circuitbreaker:
    instances:
      catalogService:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10s
        sliding-window-size: 20
  retry:
    instances:
      catalogService:
        max-attempts: 3
        wait-duration: 200ms
        exponential-backoff-multiplier: 2
```

- **Timeout** prevents a hung `catalog-service` from hanging booking requests.
- **Retry** absorbs transient blips.
- **Circuit breaker** stops hammering a genuinely down service.
- **Short-TTL cache** (60–120s, matched with cache eviction on catalog price/capacity change events if available) lets bookings continue in degraded mode using last-known-good price/capacity rather than failing outright — with the tradeoff that `max_capacity` sync to the ledger should still be treated as authoritative from `catalog-service`, so cache TTL should be short enough that oversell risk from a stale `maxCapacity` is negligible.

---

## 8. Price Integrity

To prevent price drift between what a guest sees and what they're charged:

1. **Server-side re-validation on submit** — never trust a price sent from the client. Always re-fetch from `catalog-service` (or its cache) at booking time and recompute `Total Amount = price * quantity * multiplier` server-side.
2. **Optional quote token** for higher-value bookings: when the guest views the price, issue a short-lived signed token (`itemId`, `price`, `expiresAt`, HMAC signature) valid for e.g. 10 minutes. On submit, validate the token's signature and expiry; if expired, re-quote before allowing checkout to proceed. This gives guests price stability during checkout without trusting client-supplied prices.

---

## 9. Multi-Item Cart Atomicity

If a single checkout spans multiple rooms/items, the entire cart must succeed or fail as one unit — never partially book.

```java
@Transactional
public CartBookingResponse createCartBooking(CartBookingRequest cart) {
    List<Booking> bookings = new ArrayList<>();
    for (CartLineItem item : cart.getItems()) {
        availabilityService.reserveDateRange(               // throws on any failure (§2.2)
            item.getItemType(), item.getItemId(),
            item.getCheckIn(), item.getCheckOut(), item.getQuantity());
        bookings.add(bookingFactory.createHeldBooking(item, cart.getGuestId()));
    }
    bookingRepository.saveAll(bookings);
    // @Transactional: if any reserveDateRange() call throws, the whole method rolls back —
    // all prior atomic ledger increments in this cart are reverted, no partial cart is ever persisted.
    return CartBookingResponse.from(bookings);
}
```

---

## 10. Rate Limiting & Abuse Protection

```yaml
# Example: Bucket4j / API Gateway config
booking-endpoint:
  capacity: 10
  refill: 10 tokens / 60s
  key: "{userId | ipAddress}"
availability-check-endpoint:
  capacity: 30
  refill: 30 tokens / 60s
  key: "{ipAddress}"
```

Applied per-user (authenticated) and per-IP (anonymous) at the gateway or via a Spring filter, protecting both the booking-creation endpoint (prevents cart-spam inventory locking, even with the TTL in §3/§5 as a backstop) and any availability-check/search endpoints from scraping.

---

## 11. Observability

Minimum required metrics (Micrometer / Prometheus):

| Metric | Type | Purpose |
|---|---|---|
| `booking.reserve.success` / `booking.reserve.rejected` | Counter, tagged by `itemType`, `itemId` | Detect near-capacity items, demand spikes |
| `booking.reserve.latency` | Timer | Detect lock contention or DB slowness |
| `booking.hold.expired.count` | Counter | Abandoned-checkout rate — signals UX friction if high |
| `catalog.circuitbreaker.state` | Gauge | Alert when catalog-service degrades |
| `outbox.pending.count` / `outbox.publish.failures` | Gauge / Counter | Detect notification pipeline backlog |
| `idempotency.key.conflict.count` | Counter | Detect client bugs or replay attacks |

Structured logs should include `bookingId`, `itemId`, `stayDate`, and `idempotencyKey` on every booking-lifecycle log line to make incident tracing trivial. Alert thresholds should be set on `booking.reserve.rejected` spikes (possible overselling attempts or high demand worth surfacing to ops) and any sustained open circuit breaker state.

---

## 12. Timezone & Date Handling

- All `stay_date` values in the ledger and all check-in/check-out comparisons are normalized to the **property's local timezone**, not UTC and not the guest's browser timezone. Each catalog item carries a `timezone` (IANA identifier, e.g. `Asia/Colombo`) synced from `catalog-service`.
- Convert incoming check-in/check-out date-times to the property's local calendar date at the API boundary, before any ledger or overlap logic runs.
- Store `stay_date` as a plain `DATE` (no time component) — this eliminates an entire class of off-by-one and DST-boundary bugs that arise from comparing timestamps across timezones.

---

## 13. End-to-End Booking Flow (Sequence)

```
Guest              BookingController      BookingApplicationService     AvailabilityService     InventoryLedger     CatalogClient      Outbox/RabbitMQ
 │  POST /bookings          │                        │                          │                    │                  │                  │
 │  (Idempotency-Key)       │                        │                          │                    │                  │                  │
 ├─────────────────────────►│                        │                          │                    │                  │                  │
 │                          │  check idempotency key  │                          │                    │                  │                  │
 │                          ├───────────────────────►│                          │                    │                  │                  │
 │                          │                        │  fetch price/capacity    │                    │                  │                  │
 │                          │                        ├─────────────────────────┼────────────────────┼─────────────────►│                  │
 │                          │                        │◄─────────────────────────┼────────────────────┼──────────────────┤                  │
 │                          │                        │  validate guest capacity │                    │                  │                  │
 │                          │                        │  reserveDateRange()      │                    │                  │                  │
 │                          │                        ├─────────────────────────►│  atomic UPDATE      │                  │                  │
 │                          │                        │                          ├───────────────────►│                  │                  │
 │                          │                        │                          │◄───────────────────┤  (1 row = OK)     │                  │
 │                          │                        │◄─────────────────────────┤                    │                  │                  │
 │                          │                        │  create Booking (HELD)    │                    │                  │                  │
 │                          │                        │  compute price, persist   │                    │                  │                  │
 │                          │                        │  [PAY_AT_PROPERTY → CONFIRMED, same TX]         │                  │                  │
 │                          │                        │  write outbox event (same TX)                    │                  │                  │
 │                          │                        ├────────────────────────────────────────────────┼──────────────────┼─────────────────►│
 │                          │  200 OK (booking)       │                          │                    │                  │                  │
 │◄─────────────────────────┤◄───────────────────────┤                          │                    │                  │                  │
 │                          │                        │                          │                    │      poller relays outbox → RabbitMQ  │
 │                          │                        │                          │                    │                  │      notification-service sends emails
```

---

## 14. Summary: Guarantees This Design Provides

1. **No overbooking under concurrency** — enforced by an atomic conditional `UPDATE` with a database `CHECK` constraint as the final backstop, not by application-level timing.
2. **No lost inventory from abandoned checkouts** — soft-hold TTL + sweeper job.
3. **No duplicate bookings from retries** — idempotency key enforcement.
4. **No silent notification loss** — transactional outbox, at-least-once delivery.
5. **No cascading failure from catalog-service outages** — timeout, retry, circuit breaker, cached fallback.
6. **No price drift exploitation** — server-side price re-validation.
7. **No partial multi-room cart bookings** — single transaction boundary across the whole cart.
8. **No date-boundary bugs across timezones** — property-local date normalization.
9. **Full traceability** — structured metrics and logs on every state transition.

This is the same allotment-based model used by major OTAs and hotel PMS systems (Booking.com, Expedia, Cloudbeds-style channel managers): a fixed per-day inventory pool, atomically decremented, with short-lived holds during checkout and asynchronous reconciliation for everything that doesn't need to block the guest-facing response.
