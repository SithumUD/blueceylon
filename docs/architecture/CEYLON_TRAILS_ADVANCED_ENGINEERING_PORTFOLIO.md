# Blue Ceylon — Advanced Full-Stack Cloud Engineering Portfolio
### An In-Depth Technical Dossier of a Distributed, Event-Driven Tourism Marketplace

> **Author:** Sithum Udayanga
> **Role Target:** Full-Stack Cloud Engineer / Backend Microservices Engineer / Platform Engineer
> **Core Stack:** Java 21 (LTS) · Spring Boot 4 · Spring Cloud Gateway · Spring Security 6 · Spring Data JPA/Hibernate · RabbitMQ (AMQP 0-9-1) · PostgreSQL 15+ · Flyway · React 18/TypeScript · Axios · STOMP over WebSocket · Keycloak (IAM) · PayHere Payment Gateway · Docker · AWS (ECS Fargate, RDS, CloudAMQP, ALB, WAF, Secrets Manager, IAM, VPC) · GitHub Actions
> **Domain:** Sri Lanka Tourism Marketplace (multi-tenant, multi-role, multi-currency)
> **Document Purpose:** Provide a rigorous, interview-ready explanation of every architectural decision, protocol, pattern, and trade-off in the system — written at the depth expected of a senior backend/cloud engineering discussion, not a marketing summary.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Domain Model & Business Context](#2-domain-model--business-context)
3. [User Roles, Permissions & Journeys](#3-user-roles-permissions--journeys)
4. [Microservices Breakdown — Full Technical Specification](#4-microservices-breakdown--full-technical-specification)
5. [System Architecture Diagrams](#5-system-architecture-diagrams)
6. [Inter-Service Communication Patterns](#6-inter-service-communication-patterns)
7. [Event-Driven Architecture Deep-Dive (RabbitMQ)](#7-event-driven-architecture-deep-dive-rabbitmq)
8. [Security Architecture — Distributed JWT & IAM](#8-security-architecture--distributed-jwt--iam)
9. [Data Architecture & Persistence Patterns](#9-data-architecture--persistence-patterns)
10. [Real-Time Systems — WebSocket/STOMP Notification Layer](#10-real-time-systems--websocketstomp-notification-layer)
11. [Resilience, Fault Tolerance & Failure Modes](#11-resilience-fault-tolerance--failure-modes)
12. [Observability — Logging, Metrics & Tracing](#12-observability--logging-metrics--tracing)
13. [Frontend Engineering Deep-Dive](#13-frontend-engineering-deep-dive)
14. [Cloud Infrastructure & Deployment Architecture](#14-cloud-infrastructure--deployment-architecture)
15. [Cloud Security & IAM Hardening](#15-cloud-security--iam-hardening)
16. [CI/CD Pipeline — Build, Test & Release](#16-cicd-pipeline--build-test--release)
17. [Testing Strategy](#17-testing-strategy)
18. [Scalability & Performance Considerations](#18-scalability--performance-considerations)
19. [Known Trade-offs, Limitations & Roadmap](#19-known-trade-offs-limitations--roadmap)
20. [Skills Demonstrated — Mapped to Industry Roles](#20-skills-demonstrated--mapped-to-industry-roles)
21. [Interview Playbook — Talking Points & Likely Questions](#21-interview-playbook--talking-points--likely-questions)
22. [Glossary of Terms & Protocols](#22-glossary-of-terms--protocols)
23. [Quick Reference — Technology Inventory](#23-quick-reference--technology-inventory)
24. [Payment Architecture — PayHere Integration & Escrow-Style Fund Holding](#24-payment-architecture--payhere-integration--escrow-style-fund-holding)

---

## 1. Executive Summary

**Blue Ceylon** is a production-grade, full-stack digital tourism marketplace built on a **distributed microservices architecture**. Functionally, it solves the same class of problem as platforms like Booking.com or Airbnb: connecting supply (hotels, tour agencies, freelance guides) with demand (travelers), while handling authentication, catalog search, transactional booking workflows, payments, reviews, and real-time notifications — each as an independently deployable service.

What separates this project from a typical tutorial-grade CRUD application is that it is engineered around the same architectural primitives used in real distributed systems teams:

- **Service decomposition by business capability**, not by technical layer (i.e., not "controller service / repository service" but "Auth / Catalog / Booking / Notification").
- **Asynchronous, event-driven communication** for anything that doesn't need to block the user-facing request path.
- **Stateless authentication** that scales horizontally without a shared session store.
- **Database-per-service** data isolation, which is the single hardest constraint to retrofit into a system later and the clearest signal of deliberate architectural design.
- **Cloud-native deployment assumptions** baked in from day one (ephemeral containers, no local disk state, centrally managed secrets).

This document exists to explain **why** each of these choices was made, **what problem it solves**, **what it costs**, and **how to defend it** in a technical interview — not just to describe what exists.

---

## 2. Domain Model & Business Context

Blue Ceylon digitizes three supply-side verticals simultaneously, which is what makes the catalog domain non-trivial:

| Supply Type | Core Entity | Distinguishing Attributes |
|---|---|---|
| Hotels | `Hotel` → `Room` | Branches, room types, nightly pricing (USD/LKR), availability calendar, amenities |
| Tour Packages | `Tour` → `Itinerary Day` | Day-by-day itineraries, GPS waypoints, multi-tier group pricing, seasonal pricing |
| Tour Guides | `Guide` | SLTDA license number & verification status, spoken languages, vehicle type, blackout/availability dates |

The **booking** domain has to unify three very different fulfillment models (a room-night, a scheduled group tour, a guide's calendar day) behind a single `Booking` abstraction with a common lifecycle state machine (see §4.4). This is a deliberately chosen complexity: it forces the schema and service boundary to answer "what is the smallest shared contract between three different products?" — a real modeling problem, not a toy one.

**Multi-tenancy** is handled at the business-owner level: a single Business Owner account can operate multiple hotel branches or multiple tour agencies, each with its own inventory, staff, and analytics — meaning authorization checks must resolve "does this JWT's user own **this specific** hotel/tour/guide record" rather than just "is this user a BUSINESS_OWNER."

### 2.1 MVP Scope vs. Future Verticals

The startup (v1) scope is **deliberately constrained to three supply verticals — Hotels, Tour Agencies, and Tour Guides.** This is a conscious product decision, not a technical limitation: the domain model, catalog schema, and approval workflow are all designed so that adding a fourth vertical later (Restaurants) or a fifth (Adventure/Activity operators — e.g., whitewater rafting, safari operators, surf schools) means **adding a new entity type and a new moderation queue, not re-architecting the platform.** Because `Booking`, approval status, and the messaging system (§10.4) are already modeled around a generic "operator" concept rather than being hardcoded to "hotel" and "agency," extending the marketplace is additive, not disruptive. See §19.1 for the phased roadmap.

---

## 3. User Roles, Permissions & Journeys

The platform supports **5 distinct roles**, each with a dedicated dashboard and a distinct permission set enforced via Spring Security's `@PreAuthorize` at the service layer (never trusted from the frontend alone):

### 3.1 Traveler (End User)
- Search/browse hotels, rooms, tour packages, and certified guides.
- Add items to a cart, request custom quotes, finalize bookings, and pay via **PayHere** at checkout.
- Can submit a **refund request form** against a paid, not-yet-released booking; Admin investigates before any money moves (§24.5).
- Receive real-time WebSocket notifications *and* asynchronous email confirmations (two delivery channels, one event).
- Leave **multi-dimensional reviews** — separate numeric scores for cleanliness, value, and location rather than a single star rating, which requires a slightly richer review schema (`review_scores` as a value object, not a single column).

### 3.2 Business Owner — Hotel Owner
- Registers a **Hotel** business entity (one account can operate multiple branches).
- Once registered, can immediately begin adding **Rooms** — pricing, availability calendars, amenities — *without waiting for admin approval* (see §3.5).
- Can **also create Tour Packages** attached to their Hotel entity (e.g., a hotel that bundles a day-safari with a room booking). This is the one deliberate cross-capability grant in the permission model: owning a Hotel entitles the owner to both `Room` and `Tour` creation.
- Responds to traveler inquiries and reviews (owner-response pattern — a reply is attached to, not a replacement for, the traveler's review).
- Views per-property analytics and revenue dashboards, including a payout ledger showing which bookings' payments are still held, which are released, and which have already been paid out in the monthly batch (§24.3).

### 3.3 Business Owner — Tour Agency Owner
- Registers a **Tour Agency** business entity.
- Can create **Tour Packages** — day-by-day itineraries, GPS waypoints, group pricing — without waiting for admin approval (see §3.5).
- **Cannot create Rooms.** Room inventory is a capability scoped exclusively to the Hotel entity type; a Tour Agency has no `hotel_id` to attach a room to, and the authorization layer rejects any attempt to call the room-creation endpoint without an owned Hotel record. This is an intentional asymmetry, not an oversight — it keeps "accommodation supply" and "tour supply" as cleanly separable concerns even though both can produce a `Tour` row.
- Same inquiry/review-response and analytics capabilities as a Hotel Owner.

### 3.4 Tour Guide (Freelancer)
- Builds a professional profile that must eventually be verified against the **Sri Lanka Tourism Development Authority (SLTDA)** license — an external-authority verification workflow with a pending/approved/rejected state, not a simple boolean flag.
- Can create **Tour Packages** tied to their own guide profile (their personally-led tours), under the same create-before-approval rule as Hotels and Agencies (§3.5) — but **cannot create Rooms**, for the same reason a Tour Agency can't.
- Declares spoken languages, vehicle type, and specialty tour types.
- Blocks out already-booked availability so the Booking Service can't double-book a guide across two simultaneous tours.

### 3.5 Business Onboarding, Approval & Public Visibility Workflow

This is the core moderation rule governing the entire supply side, and it applies identically to Hotels, Tour Agencies, and Guide profiles:

> **A business entity — and any listing under it — can be created at any time, immediately after registration. Nothing is blocked on admin approval. What *is* gated by admin approval is public visibility.**

Concretely:
1. A user registers a Hotel, Tour Agency, or Guide profile → the entity is created with `status = PENDING_APPROVAL`.
2. The owner can immediately start adding child listings — Rooms (Hotel only), Tour Packages (Hotel, Agency, or Guide) — while the parent entity is still pending. This lets an owner fully build out their catalog during the review period instead of sitting idle.
3. **Search/browse APIs in the Catalog Service filter on `parent.status = 'APPROVED'`** — so none of this in-progress inventory is visible to travelers yet, regardless of how complete it is.
4. An Admin reviews the business entity (and, for Guides, the SLTDA license) and sets `status = APPROVED` or `REJECTED`.
5. The moment a Hotel/Agency/Guide flips to `APPROVED`, **every listing already created underneath it becomes publicly searchable immediately** — there is no secondary per-listing approval queue. Approval is enforced once, at the parent level, and cascades to all children.

**Why gate at the parent instead of per-listing:** a per-listing approval queue would force an admin to review every single room or tour package one-by-one, which doesn't scale and duplicates a check that's really about *"is this a legitimate business," not "is this specific room description acceptable."* Gating visibility at the parent keeps moderation proportional to the actual trust decision being made, while giving owners a frictionless, ungated catalog-building experience from day one.

**Ownership → Capability Matrix**

| Entity Owned | Can Create Rooms? | Can Create Tour Packages? | Gated by Parent Approval? |
|---|---|---|---|
| Hotel | ✅ Yes | ✅ Yes (hotel-attached tours) | ✅ Yes |
| Tour Agency | ❌ No | ✅ Yes | ✅ Yes |
| Guide Profile | ❌ No | ✅ Yes (self-led tours) | ✅ Yes (SLTDA + admin) |

### 3.6 Admin & Super Admin
- Moderate the platform: approve/reject Hotel and Tour Agency registrations, and Guide license applications (§3.5).
- Global analytics across all services.
- Platform-wide broadcast notifications (a fan-out case that reuses the same RabbitMQ notification pipeline, but targets "all connected sessions" instead of a single `userId`).

**Why this matters technically:** five roles with overlapping-but-distinct permission surfaces — plus an asymmetric capability grant (Hotel Owners get Rooms *and* Tours; Agency Owners and Guides get Tours only) — is exactly the scenario where a *centralized* authorization model (claims embedded in a signed JWT, checked identically at every service, combined with a resource-ownership check against the specific entity being modified) outperforms a per-service ad hoc permission table. It's one of the strongest practical arguments for the JWT design in §8.

---

## 4. Microservices Breakdown — Full Technical Specification

### 4.1 API Gateway (`blueceylon-api-gateway`)
**Technology:** Spring Cloud Gateway (WebFlux-based, reactive, non-blocking I/O).

| Responsibility | Detail |
|---|---|
| Routing | Declarative route predicates (path, header) map `/api/auth/**`, `/api/catalog/**`, `/api/bookings/**`, `/api/notifications/**` to their respective service's internal DNS name/service discovery entry. |
| Global security filter | A custom `GlobalFilter` intercepts every request **before** it leaves the gateway, parses the `Authorization: Bearer <token>` header, verifies the JWT signature against **Keycloak's public keys (JWKS endpoint, RS256)** — cached locally and refreshed on a TTL, not fetched per-request — and rejects with `401` on failure — internal services never see an unauthenticated request. |
| CORS | Single point of CORS configuration, so five services don't need five duplicated CORS configs (and can't drift out of sync). |
| Rate limiting | Per-IP/per-user request throttling to blunt brute-force login attempts and API abuse before it reaches compute. |

**Why a gateway at all?** Without it, the React app would need to know the network address of five separate services, CORS would need to be configured five times, and JWT validation logic would be duplicated five times — a classic distributed-systems anti-pattern. The gateway centralizes cross-cutting concerns exactly once.

### 4.2 Auth Service (`blueceylon-auth-service`) + Keycloak (Identity Provider)
**Database:** `auth_db` — `user_profiles`, `role_assignments` (app-facing profile data, keyed by Keycloak's `sub` claim). **Identity store:** Keycloak owns `keycloak_db` — realm config, credentials, sessions.

Application-level identity (**"who is this person, what can they do"**) is delegated to **Keycloak**, run as its own containerized service inside the same VPC, rather than hand-rolled inside the Auth Service. This is a deliberately different concern from **AWS IAM** (§15), which governs *infrastructure* permissions (what an ECS task is allowed to touch in AWS) — the two IAMs never overlap in scope, and the doc is explicit about which is which wherever both appear.

- Registration flows differentiated by role (Traveler / Business Owner / Guide): the Auth Service calls **Keycloak's Admin REST API** to create the user in the `blueceylon` realm with the appropriate realm role, then creates the corresponding profile row in `auth_db` keyed by Keycloak's `sub` (subject) claim — Keycloak owns the credential, Auth Service owns the app-facing profile. A Guide registration also creates a pending `GuideProfile` row in `catalog_db` via an event, not a direct cross-database write.
- **Login is a delegated Keycloak token exchange:** the client still calls the Auth Service's own `/api/auth/login` endpoint (so the frontend never needs to know Keycloak exists), but internally the Auth Service exchanges the credentials with Keycloak's token endpoint (Resource Owner Password Credentials grant) and relays back Keycloak's **JWT Access Token** and **Refresh Token** — short-lived access token (~15 min), long-lived rotated refresh token, both **RS256-signed** by Keycloak's realm key rather than a shared HMAC secret (see §8.3 — this is the RS256 migration that section calls out as the "next hardening step," now implemented via Keycloak rather than hand-rolled).
- Password hashing, credential storage, brute-force lockout policy, and reset-token generation are **entirely Keycloak's responsibility** — the Auth Service never sees or stores a raw or hashed password.
- **"Forgot Password" flow hardened against email enumeration:** the Auth Service's endpoint returns an identical `200 OK` whether or not the email exists, regardless of what Keycloak's underlying response reveals — enumeration-safety is enforced at the Auth Service facade, not left to the identity provider's default behavior.
- Publishes a `UserRegisteredEvent` to RabbitMQ so the Notification Service — not the Auth Service — is responsible for sending the welcome email. This keeps Auth Service's write path (and its response latency to the client) free of any dependency on the email provider's uptime.
- **Why front Keycloak with a thin Auth Service instead of pointing the React app straight at Keycloak?** Two reasons: (1) the frontend's API surface stays uniform — every domain is `/api/<domain>/**` through the same gateway, rather than one special-cased OIDC redirect flow; (2) it gives the Auth Service a seam to enrich the response (e.g., attach role-specific onboarding status from `auth_db`) without that logic leaking into Keycloak's realm configuration.

### 4.3 Catalog Service (`blueceylon-catalog-service`)
**Database:** `catalog_db` — `hotels`, `rooms`, `tours`, `guides`, `amenities`, `itinerary_days`. **Read-heavy** service; optimized accordingly.

- **Hotel Management:** Full CRUD for properties/rooms/pricing/availability, with **multilingual descriptions** (English, Sinhala, Tamil) stored as a translation table (`hotel_translations(hotel_id, locale, description)`), not as denormalized columns — this is the only schema shape that scales past 2 languages without a migration.
- **Tour Management:** Day-by-day itinerary entities, GPS coordinates per destination stop, and multi-tier group pricing (e.g., price breaks at 2, 4, 6+ travelers).
- **Guide Management:** SLTDA license verification status tracking, availability calendar.
- **Search & Filter:** The core read-path API — filter by city, date range, price band, and star rating. Composite indexes on `(city, available_from, available_to, nightly_price)` are what keep this fast at scale rather than falling back to full table scans.

### 4.4 Booking Service (`blueceylon-booking-service`)
**Database:** `booking_db` — `bookings`, `payments`, `reviews`. **Write-heavy** and **transactionally critical** — this is the service where a bug costs real money or a double-booked room.

- **Booking lifecycle state machine:**
  `PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT` (with `CANCELLED` and `REFUNDED` as terminal side-branches from `PENDING`/`CONFIRMED`).
- **Transactional integrity:** Confirming a booking and decrementing room availability happen inside a single database transaction with row-level locking (`SELECT ... FOR UPDATE` or an optimistic-locking `@Version` column) so two concurrent requests can't both confirm the last available room.
- Handles traveler inquiries → quote generation → booking conversion as a distinct funnel, separate from instant-book flows.
- Collects post-trip reviews plus the owner-response pattern described in §3.2.
- **Event publisher:** On confirmation, publishes `BookingConfirmedEvent` to RabbitMQ instead of calling the email provider synchronously — the single most important latency decision in the whole system (see §7).

### 4.5 Notification Service (`blueceylon-notification-service`)
**Database:** None — intentionally **stateless**.

- Continuously consumes `notifications.email.queue` and `notifications.ws.queue`.
- Sends transactional email via the **Brevo (Sendinblue) SMTP API** — booking confirmations, password resets, welcome emails.
- Maintains live **STOMP-over-WebSocket** sessions with the React frontend, keyed by `userId`.
- Pushes real-time in-app alerts (e.g., *"A Business Owner replied to your inquiry"*) without a page refresh.
- Because it holds no database and no durable state of its own, it can be scaled to zero-to-N replicas purely based on queue depth — a textbook case for horizontal autoscaling.

### 4.6 Payment Service (`blueceylon-payment-service`)
**Database:** `payment_db` — `payments`, `payment_holds`, `payout_batches`, `payout_items`, `refund_requests`. **Financially critical** — every write is either idempotent or wrapped in a transaction, because this is the one service where a duplicated event equals real duplicated money.

- Integrates with **PayHere** (Sri Lanka's PCI-DSS-compliant local payment gateway, supporting cards and local bank/wallet rails) as the v1 payment processor for both **room bookings** and **tour bookings**.
- Owns the full **fund lifecycle**, not just "charge the card": a completed PayHere payment does **not** move directly into a Hotel Owner's or Tour Agency's account. It is deliberately **held in escrow inside the platform** until the booked date/service window has passed, then released and swept into a **monthly payout batch** — see §24 for the full design, state machine, and rationale.
- Owns the **refund request workflow**: a traveler can submit a refund form while their payment is still held; Admin investigates and approves/rejects; approved refunds are reversed via PayHere's refund API before that money is ever released to the owner.
- Publishes payment-lifecycle events (`PaymentCompletedEvent`, `PaymentHeldEvent`, `PaymentReleasedEvent`, `PayoutProcessedEvent`, `RefundRequestedEvent`, `RefundCompletedEvent`) to the same RabbitMQ exchange used everywhere else, so the Notification Service — not the Payment Service — is responsible for emailing/WebSocket-pushing travelers and owners. This keeps the payment write path free of any dependency on the notification channel, for exactly the same latency-isolation reason described in §7.
- Deliberately **decoupled from the Booking Service** rather than folded into it: `booking_db.payments` (referenced in §4.4) holds only the booking-facing summary (amount, status, currency) needed for the booking lifecycle UI, while `payment_db` owns the full gateway/escrow/payout bookkeeping. The two stay in sync via the same event bus, not a shared table — keeping the database-per-service boundary intact even between two services that are this tightly related.

---

## 5. System Architecture Diagrams

### 5.1 Request/Event Flow

```text
                               +-------------------+
                               |  REACT FRONTEND    |
                               |  (TypeScript SPA)  |
                               +---------+----------+
                                         | HTTPS/REST (Axios)
                                         v
+----------------------------------------------------------------------------------+
|                            SPRING CLOUD API GATEWAY                              |
|                    (Route Mapping, CORS, Global JWT Validation)                  |
+-------+--------------------+-------------------+-----------------------+---------+
        |                    |                   |                       |
        v                    v                   v                       v
+-------+-------+    +-------+-------+   +-------+-------+       +-------+-------+
|  AUTH SERVICE |    | CATALOG SRV   |   | BOOKING SRV   |       | ADMIN SERVICE |
| (JWT Issuer)  |    | (Hotels/Tours)|   | (Transactions)|       | (Moderation)  |
+-------+-------+    +-------+-------+   +-------+-------+       +-------+-------+
        |                    |                   |                       |
   [PostgreSQL]         [PostgreSQL]        [PostgreSQL]            [PostgreSQL]
   auth_db              catalog_db          booking_db                (shared/admin)
        |                    |                   |                       |
        |                    |                   v                       |
        |                    |          +-------+-------+                |
        |                    |          | PAYMENT SRV   | ---> PayHere Gateway (charge/refund)
        |                    |          | (Escrow/Payout)|<--- PayHere Notify Webhook
        |                    |          +-------+-------+
        |                    |                   |
        |                    |             [PostgreSQL]
        |                    |             payment_db
        |                    v                   v                       |
        |             +-----------------------------------------+        |
        +------------>|      RABBITMQ MESSAGE BROKER            |<-------+
                      |  Exchange: blueceylon.exchange        |
                      |  Routing keys: user.registered,         |
                      |  booking.confirmed, payment.held,       |
                      |  payment.released, payout.processed,    |
                      |  refund.requested, review.posted, ...   |
                      +------------------+----------------------+
                                         |
                                         v
                                 +-------+-------+
                                 | NOTIFICATION  | ---> Brevo SMTP (Emails)
                                 |   SERVICE     | ---> WebSocket/STOMP (Live updates)
                                 +---------------+
```

### 5.2 Why the Gateway Sits in Front of Everything

Every arrow into the internal cluster passes through exactly one choke point. That single choke point is where JWT validation, CORS, and rate limiting live — meaning a security fix or policy change is a **one-service deploy**, not a five-service coordinated release. This is the architectural payoff of the API Gateway pattern and is worth stating explicitly in an interview, because "why not just let the frontend call each service directly?" is a common follow-up question.

---

## 6. Inter-Service Communication Patterns

Two distinct communication styles are used deliberately, not interchangeably:

| Pattern | Used For | Why |
|---|---|---|
| **Synchronous (HTTP/REST via Gateway)** | Anything the caller needs an immediate answer to — search results, login, cart contents, booking confirmation response to the user | The user is actively waiting; blocking is acceptable and expected here. |
| **Asynchronous (RabbitMQ pub/sub)** | Anything that is a *side effect* of a successful action — sending an email, pushing a live notification, updating analytics | The user should never wait on a third-party SMTP provider, and a temporary outage of that provider shouldn't cause the primary transaction to fail. |

This is the core engineering judgment call of the whole system: **know which parts of a request are "must complete before responding" versus "can complete eventually."** Conflating the two is the most common mistake in junior-level distributed system designs — routing everything synchronously, then wondering why checkout latency is 4 seconds because it's waiting on SMTP.

---

## 7. Event-Driven Architecture Deep-Dive (RabbitMQ)

### 7.1 The Core Pattern

```java
// Inside Booking Service — publish, don't wait
rabbitTemplate.convertAndSend(
    "blueceylon.exchange",
    "routing.booking.confirmed",
    new BookingEventPayload(bookingId, travelerEmail, hotelName)
);
```

```java
// Inside Notification Service — consume, act, never block the publisher
@RabbitListener(queues = "booking.notifications.queue")
public void handleBookingConfirmation(BookingEventPayload payload) {
    emailService.sendBookingConfirmation(payload);
    webSocketService.pushNotification(payload.getUserId(), "Booking Confirmed!");
}
```

### 7.2 What This Actually Buys You

1. **Latency isolation** — the Booking Service's HTTP response to the traveler returns as soon as the DB transaction commits and the message is published (millisecond-scale), regardless of how slow Brevo's SMTP endpoint happens to be at that moment.
2. **Durability & retry** — if the Notification Service is down, or Brevo's API times out, RabbitMQ retains the message (backed by a durable queue + persistent messages) and redelivers it — no confirmation email is silently lost.
3. **Decoupled scaling** — the Notification Service can run 1 replica at 2am and auto-scale to 10 replicas during a flash-sale traffic spike, entirely independent of how many Booking Service instances are running.
4. **Producer/consumer independence** — the Booking Service knows nothing about *how* notifications get delivered (email vs. WebSocket vs., someday, SMS). It only knows "an event happened." New notification channels can be added by adding a new consumer, with zero changes to the Booking Service.

### 7.3 Exchange/Queue Topology

- **Exchange type:** Topic exchange (`blueceylon.exchange`), allowing routing-key patterns like `booking.*` or `user.*` rather than a single fixed queue per event.
- **Dead-letter queue (DLQ):** Messages that fail processing after N redelivery attempts are routed to a DLQ for manual inspection — preventing a single malformed payload from blocking the entire queue (a "poison message").
- **Idempotency consideration:** Because AMQP guarantees *at-least-once* delivery (not exactly-once), the consumer's `handleBookingConfirmation` should be idempotent — e.g., checking whether an email for this `bookingId` has already been sent before resending, so a redelivered message after a consumer crash doesn't double-email the traveler.

---

## 8. Security Architecture — Distributed JWT & IAM

### 8.0 Two IAMs, Two Different Jobs

This document uses "IAM" for two genuinely different systems, and keeps them intentionally separate rather than blurring them into one "security layer":

| | **Keycloak** (Application IAM) | **AWS IAM** (Infrastructure IAM) |
|---|---|---|
| Answers | "Who is this person, and what role do they hold?" | "What is this ECS task/container allowed to touch in AWS?" |
| Scope | End users: travelers, hotel owners, agencies, guides, admins | Infrastructure: task roles, Secrets Manager access, RDS/MQ permissions |
| Lives | Its own containerized service inside the VPC, backed by `keycloak_db` | AWS control plane — not a service the app calls, a set of permissions attached to it |
| Detailed in | §8.1–§8.3 | §15 |

### 8.1 Why Stateless JWT Instead of Server-Side Sessions

A traditional session-based auth model requires a shared session store (e.g., Redis) that every service must query on every request — an extra network hop and a single point of failure. Blue Ceylon instead uses **stateless JSON Web Tokens**, trading a small amount of revocation flexibility for significant horizontal scalability: any service instance, on any node, can validate a token with zero calls to a central store.

### 8.2 The Flow

1. **Keycloak** verifies credentials (via the Auth Service's facade, §4.2) against its own user store and signs a JWT (**RS256**) embedding the user's ID (`sub`) and realm-role claims — the private signing key never leaves Keycloak.
2. **API Gateway** intercepts every incoming request and verifies the JWT signature using **Keycloak's public key**, fetched once from its JWKS endpoint and cached — no shared secret exists anywhere outside Keycloak itself — and only then forwards the request downstream.
3. **Downstream services** (Catalog, Booking, etc.) *trust* the request because it already passed the Gateway's signature check. They extract role claims from a forwarded header and enforce fine-grained authorization locally with `@PreAuthorize("hasRole('BUSINESS_OWNER')")` — and, critically, also check *resource ownership* (does this business owner ID actually own this hotel row?), which a role check alone cannot express.

### 8.3 HS256 vs RS256 — Why Keycloak, Not a Hand-Rolled Shared Secret

A hand-rolled JWT scheme has to choose between HS256 (symmetric) — every verifying service holds the same secret, so a single compromised service can also *forge* tokens — and RS256 (asymmetric) — only the issuer holds the private key, everyone else holds only a public key. Rather than build and operate that key-management discipline by hand, Blue Ceylon delegates issuance to **Keycloak**, which signs RS256 by default and exposes its public keys over a standard JWKS endpoint: the Gateway (and any future service) verifies tokens without ever being trusted with a signing key, and rotating Keycloak's realm key doesn't require redeploying every microservice. This was the previously-documented "next hardening step" from a custom HS256 implementation — adopting Keycloak is that step, not a replacement for it.

### 8.4 Additional Hardening Present in the Design
- Refresh tokens are stored hashed (never in plaintext) and rotated on each use, so a leaked refresh token can only be replayed once before detection.
- Password reset responses are enumeration-safe (§4.2).
- BCrypt with a tunable work factor for password storage.

---

## 9. Data Architecture & Persistence Patterns

### 9.1 Database-per-Service

```
auth_db      → users, roles, oauth_profiles, refresh_tokens
catalog_db   → hotels, rooms, tours, guides, amenities, itinerary_days
booking_db   → bookings, payments, reviews
```

No service is permitted to reach into another service's schema directly. Cross-service data needs (e.g., "show the hotel name on a booking") are satisfied either by **denormalizing a snapshot** at write time (storing `hotelName` on the `Booking` row at creation) or by an API call through the Gateway — never a cross-database JOIN. 

*Portfolio Cost Optimization Note:* To minimize AWS costs for this portfolio deployment, all 4 databases run as isolated logical databases (`CREATE DATABASE...`) inside a **single AWS RDS Micro instance**. The services use separate credentials and cannot perform cross-database queries. This enforces the exact same microservices constraints at the logical layer without the cost of 4 physical database servers.

### 9.2 Soft-Delete Pattern

```java
@SQLDelete(sql = "UPDATE hotels SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
```

Every `hotelRepository.delete()` call becomes an `UPDATE`, not a `DELETE`, and Hibernate transparently appends `deleted_at IS NULL` to *every* query against that entity — including ones a developer might forget to filter manually. Records are never physically destroyed, which enables:
- Data recovery from accidental deletion.
- Audit trails for compliance/dispute resolution (a traveler disputing a booking against a hotel that was later delisted).
- Referential integrity for historical bookings that reference now-delisted rooms.

### 9.3 Schema Versioning — Flyway

All schema changes are checked-in, versioned SQL migration files (`V1__init.sql`, `V2__add_review_scores.sql`, …) applied automatically at service startup. This guarantees every environment (local, staging, production) converges on an identical, reproducible schema history — no manual `ALTER TABLE` runs against production.

### 9.4 Cloud Media — Cloudinary

Images are stored and served from Cloudinary's global CDN (200+ Points of Presence); the database only ever stores the `public_id` and `secure_url` returned from the upload API. This is a direct consequence of the containers-are-ephemeral assumption: an ECS Fargate task can be killed and rescheduled onto different hardware at any moment, so anything written to local disk is lost — media, therefore, cannot live there.

---

## 10. Real-Time Systems — WebSocket/STOMP Notification Layer

- The Notification Service exposes a `/ws` endpoint using **STOMP over WebSocket** (Simple Text Oriented Messaging Protocol — gives pub/sub-style topic semantics on top of raw WebSocket frames).
- Each authenticated client subscribes to a **user-scoped destination** (e.g., `/user/{userId}/queue/notifications`), so a push event is only delivered to the session(s) belonging to that user.
- The trigger chain is: **RabbitMQ event → Notification Service consumer → STOMP broker relay → browser**, meaning the real-time layer is fed by the same event bus as email, not a separate signal path — one event, two delivery channels, guaranteed consistency between what the email says and what the live UI shows.
- Because WebSocket connections are stateful (unlike the stateless HTTP/JWT model elsewhere), a horizontally scaled Notification Service needs a shared relay (e.g., a STOMP broker relay to RabbitMQ's STOMP plugin, or a Redis pub/sub backplane) so a notification for a user connected to *replica B* still reaches them even if the triggering event was consumed by *replica A*. This is a known scaling seam and is discussed candidly in §19.

---

## 11. Resilience, Fault Tolerance & Failure Modes

| Failure Scenario | System Behavior | Why |
|---|---|---|
| Brevo SMTP API is down | Email delivery retried automatically by RabbitMQ's redelivery mechanism; booking flow is completely unaffected | Async decoupling (§7) |
| Notification Service crashes mid-message | Message is not ack'd, remains in queue, redelivered to next available consumer instance | AMQP at-least-once delivery guarantee |
| Two travelers try to book the last room simultaneously | Row-level lock / optimistic version check in Booking Service ensures only one transaction commits; the other receives a conflict response | Transactional integrity (§4.4) |
| API Gateway receives a forged/expired JWT | Rejected with `401` at the perimeter; request never reaches internal services | Global JWT validation filter (§4.1) |
| A single microservice instance dies | ECS Fargate's service scheduler detects the failed health check and replaces the task automatically | Cloud-native self-healing (§14) |
| Malformed message poisons a queue | Routed to a Dead-Letter Queue after max retries instead of blocking the queue indefinitely | DLQ pattern (§7.3) |

---

## 12. Observability — Logging, Metrics & Tracing

For a system spanning five independently deployed services, a request or event failure needs to be traceable end-to-end without SSH-ing into five separate containers. The design assumes:

- **Structured, correlated logging:** a `correlationId`/`traceId` generated at the Gateway and propagated through headers (HTTP) and message properties (RabbitMQ), so a single booking-confirmation flow can be reconstructed across Booking Service → RabbitMQ → Notification Service log lines.
- **Centralized log aggregation:** container stdout/stderr shipped to a log aggregation layer (e.g., CloudWatch Logs on AWS) rather than living only on ephemeral container disk.
- **Health check endpoints:** each Spring Boot service exposes Spring Boot Actuator's `/actuator/health`, used by the ECS service scheduler and the ALB target group to determine liveness/readiness.
- **Queue depth as an autoscaling signal:** RabbitMQ queue length for `notifications.email.queue` is a natural metric to autoscale Notification Service replica count on, since it's a direct measure of backlog.

---

## 13. Frontend Engineering Deep-Dive

### 13.1 Centralized TypeScript API Client

Rather than scattering `fetch()`/`axios()` calls throughout components, the frontend defines a single **Axios-based API client layer**, organized into **27 domain-specific modules** (e.g., `authApi.ts`, `hotelsApi.ts`, `bookingsApi.ts`) — one module per bounded business capability, mirroring the backend's service boundaries so the frontend's mental model matches the backend's.

### 13.2 Token Lifecycle via Axios Interceptors

- **Request interceptor:** transparently injects the current JWT access token into the `Authorization` header of every outgoing request.
- **Response interceptor:** on a `401`, transparently calls the Auth Service's refresh endpoint, obtains a new access token, retries the original failed request once, and only surfaces a logout/redirect if the refresh itself fails.
- **Net effect:** the user never sees a raw "session expired" error mid-task — token renewal is invisible, and the original in-flight action (e.g., "confirm booking") completes as if nothing happened.

### 13.3 Real-Time Integration
The frontend maintains a persistent STOMP client connection (see §10) alongside its REST API layer, subscribing to the current user's notification channel on login and tearing it down cleanly on logout — avoiding orphaned WebSocket connections that would otherwise leak server-side resources.

---

## 14. Cloud Infrastructure & Deployment Architecture

```text
+--------------------------------------------------------------+
|                    AWS CLOUD ENVIRONMENT                      |
|                                                                |
|  +--------------------------------------------------------+  |
|  | AWS Application Load Balancer (ALB, public subnet)      |  |
|  +---------------------------+----------------------------+  |
|                              |                               |
|  +---------------------------v----------------------------+  |
|  | Amazon ECS Fargate (serverless container cluster)       |  |
|  |  (private subnets)                                      |  |
|  |  [API Gateway]  [Auth Srv]  [Catalog Srv] [Booking Srv]  |  |
|  |  [Notification Srv]                                     |  |
|  +---------------------------+----------------------------+  |
|                              |                               |
|  +---------------------------v----------------------------+  |
|  | Managed Services (private subnets)                      |  |
|  |  - Amazon RDS PostgreSQL (Single instance, 4 logical DBs)  |  |
|  |  - CloudAMQP (managed RabbitMQ)                         |  |
|  |  - AWS Secrets Manager (DB creds, JWT signing key)       |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+
```

**Why Fargate over EC2-backed ECS/self-managed Kubernetes?** Fargate removes the operational burden of patching, scaling, and securing the underlying EC2 host fleet — each task gets its own isolated compute allocation. For a project of this scope, that operational simplicity is a deliberate trade against the finer-grained control (and lower per-vCPU cost at very large scale) that EC2-backed or EKS clusters offer — worth naming explicitly as a "we chose simplicity over maximal cost efficiency at this scale" decision if asked.

**Why one single RDS instance with 4 logical schemas instead of separate shared databases?** Directly enforces the database-per-service boundary from §9.1 at the network layer — a service literally cannot query another's tables even by mistake, because they use separate connection URLs and credentials. It proves the architectural constraint while keeping personal cloud costs at zero/minimal tier.

---

## 15. Cloud Security & IAM Hardening

> **Note:** this section is **AWS IAM** — infrastructure permissions for ECS tasks and AWS resources. It is a different system from **Keycloak**, which handles application-level user identity (§8.0, §8.2). A "Keycloak IAM Task Role" and "a user's Keycloak role" are two unrelated things that happen to share the word "role."

- **Least-privilege execution:** each microservice container — including Keycloak itself — runs under a dedicated **AWS IAM Task Role** scoped to only the resources it needs — e.g., the Notification Service's task role grants access to RabbitMQ and the email-provider secret, and nothing else, so a compromise of that one container cannot pivot into, say, the Booking database's credentials.
- **AWS Secrets Manager:** database credentials, the Keycloak admin client secret, and the PayHere merchant secret are fetched at container startup via IAM-authenticated API calls, never baked into images or set as plain environment variables — removing an entire class of "secret leaked via `docker inspect` or a logged env dump" incidents.
- **VPC & subnet segmentation:** all microservices and all databases live in **private subnets** with no route to the public internet; only the ALB (and, by extension, the API Gateway behind it) is internet-facing.
- **AWS WAF (Web Application Firewall):** sits in front of the ALB, filtering common attack signatures (SQL injection, XSS payloads) and providing DDoS protection before traffic ever reaches application code.

---

## 16. CI/CD Pipeline — Build, Test & Release

```yaml
name: Microservices CI/CD
on:
  push:
    branches: [main]
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [api-gateway, auth-service, catalog-service, booking-service, notification-service]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
      - run: cd ${{ matrix.service }} && ./mvnw package -DskipTests
      - run: |
          docker build -t blueceylon/${{ matrix.service }}:${{ github.sha }} ./${{ matrix.service }}
          docker push $ECR_REGISTRY/blueceylon/${{ matrix.service }}:${{ github.sha }}
```

**Design notes worth explaining out loud:**
- A **build matrix** builds all five services in parallel jobs from a single workflow trigger — each service is versioned/tagged independently by Git SHA, so a rollback of one service never requires rolling back the others.
- Images are tagged by commit SHA (`github.sha`), not `latest` — giving every deployed artifact a traceable, immutable link back to the exact source commit that produced it, which is essential once you need to answer "which code is actually running in production right now?"
- The natural next step (called out honestly in §19) is adding a **test-and-gate** stage before the Docker build, and a separate **deploy** job that updates the ECS service's task definition — this pipeline currently proves the build/package/push mechanics, not a full test-gated release train.

---

## 17. Testing Strategy

A distributed system's correctness needs to be verified at multiple levels, not just "does the endpoint return 200":

| Level | What It Verifies | Example |
|---|---|---|
| **Unit tests** | Business logic in isolation (mocked repositories/clients) | Booking state machine transition rules; BCrypt password matching |
| **Integration tests** | A service's behavior against a real (containerized) database | Flyway migrations apply cleanly; soft-delete filter actually excludes deleted rows |
| **Contract tests** | The shape of the JSON a service sends/expects doesn't silently break its consumers | Booking Service's event payload matches what Notification Service expects to deserialize |
| **End-to-end tests** | A full user journey through the Gateway across multiple services | Register → login → search hotel → book room → receive confirmation event |

Testing a message-driven flow specifically requires a **test double for RabbitMQ** (e.g., an embedded broker or a Testcontainers RabbitMQ instance) so that publish/consume behavior is verified without depending on a live broker in CI.

---

## 18. Scalability & Performance Considerations

- **Read/write asymmetry drives independent scaling:** Catalog Service (read-heavy) and Booking Service (write-heavy, transactional) have fundamentally different scaling profiles — Catalog can lean on read replicas and caching; Booking cannot, without careful cache-invalidation design, because stale availability data directly causes double-bookings.
- **Composite indexing on the search hot path:** `(city, available_from, available_to, nightly_price)` avoids full table scans on the single most frequently hit query in the system.
- **Stateless services scale horizontally without coordination:** because JWT validation requires no shared session store, any number of Gateway/Auth/Catalog/Booking replicas can be added behind the ALB without a sticky-session requirement.
- **Notification Service scales on queue depth, not CPU:** the natural autoscaling signal for a consumer-only service is backlog size, not compute utilization, since the workload is I/O-bound (SMTP calls, WebSocket pushes) rather than CPU-bound.
- **Caching candidate:** Catalog search results are a strong candidate for a read-through cache (e.g., Redis) keyed by search parameters, given how much more frequently inventory is searched than it is updated.

---

## 19. Known Trade-offs, Limitations & Roadmap

Being able to name what *isn't* solved yet is often more credible in an interview than only describing what is:

- **HS256 shared-secret JWT has been superseded by Keycloak-issued RS256 tokens** (§8.3) — noted here to show the evolution: the trade-off was identified, then actually addressed, rather than left as a permanent asterisk.
- **Keycloak itself is a single instance with no documented HA/clustering setup in this design** — a production hardening step would be running it as a clustered deployment (or evaluating AWS Cognito as a managed alternative) so identity isn't a single point of failure.
- **WebSocket horizontal scaling** needs a shared relay/backplane once the Notification Service runs more than one replica (see §10) — currently a single-instance assumption.
- **CI pipeline builds and pushes images but doesn't yet gate on automated tests or perform the deploy step** (see §16) — the natural next iteration is a test stage plus an ECS `update-service` deploy job.
- **No API rate-limiting tier differentiation yet** between anonymous search traffic and authenticated booking traffic — currently a single global policy at the Gateway.
- **Analytics** are described as a routing key/queue topic in the architecture but not yet fleshed out as a dedicated service — a natural sixth microservice (`analytics-service`) consuming the same event bus.
- **Payout disbursement (§24) is currently a batch job that produces a payable ledger, not a fully automated bank transfer** — the natural next iteration is integrating a disbursement/mass-payment API (or PayHere's payout channel, once commercially available for the account) so the monthly settlement to owners doesn't require a manual transfer step.
- **PayHere is a single, non-redundant payment processor** — there is no automatic failover to a second gateway if PayHere has an outage; a documented next hardening step is a processor-agnostic `PaymentProvider` interface so a second gateway (e.g., Stripe for international cards) could be added without touching the escrow/payout logic in §24.
- **Escrow/holding of customer funds inside the platform's own database is a simplification of what a production fintech system would need** — at real scale this crosses into regulated territory (holding client money typically requires a licensed trust/escrow account structure, not just an internal ledger flag), which is called out explicitly rather than glossed over (see §24.6).

---

## 20. Skills Demonstrated — Mapped to Industry Roles

### Cloud / Microservices Engineer
- Decomposition of a single business domain into 5 independently deployable services with clear bounded contexts.
- Event-driven design via RabbitMQ topic exchanges, routing keys, and dead-letter handling.
- API Gateway pattern for centralized routing, security, and cross-cutting policy enforcement.
- Database-per-service enforced at both the application and infrastructure (separate RDS instances/schemas) level.
- Containerization and serverless container orchestration via Docker + ECS Fargate.

### Backend Engineer / Java Engineer
- Java 21 LTS, Spring Boot 4, Spring Cloud, Spring Security 6, Spring Data JPA/Hibernate.
- Stateless JWT authentication distributed across independently deployed services.
- Flyway-driven schema versioning; soft-delete via Hibernate `@SQLDelete`/`@SQLRestriction`.
- Transactional integrity under concurrency (locking strategy to prevent double-booking).

### Full-Stack Engineer
- Domain-modular TypeScript API client (27 modules) mirroring backend service boundaries.
- Axios interceptor-based transparent JWT refresh lifecycle.
- STOMP/WebSocket real-time client integration fed by a backend event bus.
- Cloudinary CDN integration for stateless, container-agnostic media delivery.

### Cloud Security Engineer
- Least-privilege IAM task roles per service.
- Centralized secrets management (no plaintext credentials in images or env vars).
- Network segmentation (public ALB, private compute/data subnets) and WAF-based edge protection.

---

## 21. Interview Playbook — Talking Points & Likely Questions

### 21.1 The 60-Second Pitch
"I architected Blue Ceylon as a distributed microservices platform using Spring Boot and Spring Cloud. An API Gateway handles routing and global JWT validation — verified against Keycloak's public keys rather than a hand-rolled shared secret — in front of independent services for Auth, Catalog, Bookings, Payments, and Notifications. To keep the booking flow fast and resilient, I used an event-driven architecture with RabbitMQ — when a booking is confirmed, the Booking Service publishes an event, and the Notification Service consumes it asynchronously to trigger email via Brevo and a live WebSocket push, so the traveler's checkout response never waits on a third-party SMTP provider. Each service owns its own PostgreSQL database, and the whole stack is containerized for deployment on AWS ECS Fargate behind an ALB, with secrets managed centrally, least-privilege AWS IAM roles per service, and Keycloak handling application-level identity as its own dedicated service."

### 21.2 Likely Follow-Up Questions and How to Answer Them
- **"Why not just call the email API directly from Booking Service?"** → Because that couples the booking transaction's success to a third-party's uptime and latency; async decoupling via RabbitMQ isolates that risk (§7.2).
- **"What happens if RabbitMQ itself goes down?"** → Honest answer: the publish call would fail/block; the mitigation is Amazon MQ's built-in high-availability broker configuration plus a local outbox pattern (persist the event to the database in the same transaction as the booking, with a separate poller publishing it) as a more advanced hardening step — a good place to show awareness of the *next* level of resilience even if not yet implemented.
- **"How do you prevent double-booking the last room?"** → Row-level locking or optimistic versioning inside a single DB transaction in the Booking Service (§4.4, §11).
- **"Why database-per-service instead of one shared schema?"** → Prevents hidden coupling through shared tables, which is what turns a "microservices" system back into a distributed monolith in practice (§9.1).
- **"How would you scale the WebSocket layer?"** → Introduce a shared pub/sub backplane (Redis or RabbitMQ's STOMP plugin) so a notification triggered on one replica reaches a user connected to a different replica (§10, §19).
- **"What would you change about the JWT design?"** → This was originally documented as HS256 → RS256 migration; it's now addressed by delegating token issuance to Keycloak, which signs RS256 by default, so no service other than Keycloak ever holds a private key (§8.3).
- **"Why Keycloak instead of just building OAuth2/JWT yourself?"** → Identity is a solved, security-critical problem — password policy, brute-force lockout, token rotation, and key management are exactly the kind of thing you don't want to be the first person to get subtly wrong. Keycloak is battle-tested for that narrow job, which frees the Auth Service to focus on Blue Ceylon-specific logic (role-based onboarding, profile enrichment) instead of reimplementing OIDC (§4.2, §8.0).
- **"Isn't Keycloak also 'IAM'? How is that different from the AWS IAM you mentioned?"** → Same word, two unrelated systems: Keycloak decides what an end user (traveler, hotel owner, admin) is allowed to do in the product; AWS IAM decides what an ECS task is allowed to touch inside AWS. Neither can be used to reason about the other (§8.0, §15).
- **"Why not pay the hotel/agency the moment the traveler's card is charged?"** → Because the service hasn't been delivered yet — the traveler could still cancel, dispute, or request a refund, and the marketplace (not the owner) is the party that absorbs that risk if the money has already left the platform. Holding funds until the booked date passes is what makes refunds possible without chasing money back from an owner's bank account (§24.2).
- **"How do you know a PayHere payment notification is real and not forged?"** → PayHere's server-to-server notify callback includes an `md5sig` computed from the merchant secret; the Payment Service recomputes that hash independently and rejects the callback if it doesn't match, so a forged POST to the notify URL can never mark a payment as completed (§24.4).
- **"What stops a refund being paid out twice, or a payout sweeping up a payment that's mid-refund-review?"** → The payout batch job only selects payments in the `RELEASED` state; the moment a `RefundRequest` is opened, the linked payment is pinned to `ON_HOLD_DISPUTE` and excluded from that query — the refund and payout code paths are mutually exclusive by state, not by a manual check (§24.3).

---

## 22. Glossary of Terms & Protocols

| Term | Meaning |
|---|---|
| **AMQP** | Advanced Message Queuing Protocol — the wire protocol RabbitMQ implements; guarantees at-least-once delivery semantics. |
| **STOMP** | Simple Text Oriented Messaging Protocol — a lightweight text protocol layered over WebSocket to provide topic/queue pub-sub semantics to browser clients. |
| **JWT** | JSON Web Token — a signed, self-contained token carrying claims (user ID, roles) that can be verified without a database lookup. |
| **HS256 / RS256** | JWT signing algorithms — HS256 is symmetric (one shared secret signs and verifies); RS256 is asymmetric (private key signs, public key verifies). Blue Ceylon uses RS256 via Keycloak (§8.3). |
| **Keycloak** | Open-source Identity and Access Management (IAM) server — issues OIDC/OAuth2 tokens, stores user credentials and realm roles, exposes a JWKS endpoint for public-key verification. The application-level IAM in this system (§8.0, §4.2) — distinct from AWS IAM below. |
| **Idempotency** | A property where processing the same message/request more than once has the same effect as processing it once — required for safely handling at-least-once delivery. |
| **Dead-Letter Queue (DLQ)** | A queue that receives messages which failed processing after repeated retries, isolating "poison messages" from blocking the main queue. |
| **Database-per-Service** | A microservices pattern where each service owns an isolated database schema/instance that no other service may query directly. |
| **Soft Delete** | A deletion pattern where rows are flagged as deleted (e.g., `deleted_at` timestamp) rather than physically removed. |
| **ECS Fargate** | AWS's serverless container compute engine — runs containers without managing the underlying EC2 host fleet. |
| **IAM Task Role** | An **AWS IAM** role attached to a specific ECS task, scoping exactly which AWS resources that container is permitted to access — infrastructure-level, not to be confused with a user's Keycloak realm role. |
| **WAF** | Web Application Firewall — filters malicious HTTP traffic (SQLi, XSS, DDoS patterns) before it reaches application servers. |
| **PayHere** | A Sri Lanka-based, PCI-DSS-compliant payment gateway supporting local and international cards plus local bank/wallet rails — the v1 payment processor for Blue Ceylon (§24). |
| **Escrow Hold** | The period during which a completed payment is retained by the platform (not yet released to the Hotel/Agency/Guide) until the booked date has passed, so a refund can be issued without recovering funds after the fact (§24.2). |
| **Payout Batch** | A scheduled (monthly) job that aggregates every `RELEASED` payment per owner into a single settlement record for disbursement (§24.3). |
| **`md5sig` Verification** | PayHere's webhook-authenticity mechanism — a hash computed from order details and the merchant secret, recomputed server-side to confirm a payment notification genuinely originated from PayHere (§24.4). |
| **Refund Investigation Window** | The period between a traveler submitting a refund form and Admin resolving it, during which the linked payment is excluded from payout eligibility (§24.5). |

---

## 23. Quick Reference — Technology Inventory

| Layer | Technologies |
|---|---|
| Language/Runtime | Java 21 (LTS), TypeScript |
| Backend Framework | Spring Boot 4, Spring Cloud Gateway, Spring Security 6, Spring Data JPA/Hibernate |
| Messaging | RabbitMQ (AMQP 0-9-1), STOMP over WebSocket |
| Database | PostgreSQL 15+ (database-per-service), Flyway migrations |
| Frontend | React 18, TypeScript, Axios |
| Auth | Keycloak (OIDC/OAuth2, RS256 JWT, realm roles), BCrypt (managed by Keycloak), refresh-token rotation |
| Identity vs. Infra IAM | Keycloak = application IAM (users/roles) · AWS IAM = infrastructure IAM (ECS task permissions) — see §8.0 |
| Media | Cloudinary CDN |
| Email | Brevo (Sendinblue) transactional SMTP API |
| Payments | PayHere gateway (charge + refund API, `md5sig`-verified webhooks), escrow-style fund holding, monthly payout batching (§24) |
| Containerization | Docker |
| Cloud Platform | AWS: ECS Fargate, ALB, RDS PostgreSQL, CloudAMQP, Secrets Manager, IAM, VPC, WAF |
| CI/CD | GitHub Actions (matrix builds, Docker build/push to ECR) |
| API Documentation | OpenAPI 3.0 / Swagger UI, aggregated across all microservices |

---

## 24. Payment Architecture — PayHere Integration & Escrow-Style Fund Holding

### 24.1 Why This Section Exists

Payments are the one part of the system where a design mistake isn't a bug ticket — it's a support call from someone who wants to know where their money is. The payment architecture is deliberately conservative: **charge synchronously through PayHere at checkout, but never move that money onward to a Hotel Owner, Tour Agency, or Guide until the booked service has actually happened.** Everything in this section is a consequence of that one rule.

**Business rule, stated plainly:**
> A traveler's payment for a room booking or tour booking is collected upfront via PayHere. That money is *held by the platform*, not paid out immediately. Once the booked date has passed, the held amount becomes eligible for payout, and payouts to Hotel/Agency/Guide owners are swept and disbursed **once a month**. At any point before a payment is paid out, the traveler can submit a refund request; Admin investigates it, and only after that investigation does money move — either back to the traveler (refund) or onward to the owner (payout).

### 24.2 Fund Lifecycle State Machine

```text
INITIATED --(PayHere checkout redirect)--> PENDING_GATEWAY
   PENDING_GATEWAY --(notify webhook: success, md5sig verified)--> COMPLETED
   PENDING_GATEWAY --(notify webhook: failure / cancel)--> FAILED

COMPLETED --(funds captured, booking confirmed)--> HELD
   HELD --(booked date / checkout date passes, no open refund request)--> RELEASED
   HELD --(traveler submits refund form)--> ON_HOLD_DISPUTE

ON_HOLD_DISPUTE --(Admin investigates, approves)--> REFUNDED
ON_HOLD_DISPUTE --(Admin investigates, rejects)--> HELD   (re-enters normal hold, resumes countdown to RELEASED)

RELEASED --(monthly payout batch job)--> PAID_OUT
```

The key design decision is that **`HELD` and `ON_HOLD_DISPUTE` are the only two states a payment can be in while the money is still "at rest" inside the platform**, and `RELEASED` is a strict gate: a payment cannot enter `RELEASED` (and therefore cannot enter a payout batch) while an open refund request exists against it. This makes "can this money be paid out to the owner" a single-column state check (`WHERE status = 'RELEASED'`) rather than a query that has to separately join against an open-disputes table — which is exactly the kind of small schema decision that prevents a race condition between "refund just got approved" and "payout batch just ran" from ever occurring.

### 24.3 Escrow Hold & Monthly Payout Batch

- **Hold trigger:** for a room booking, the hold-release date is the room's **check-out date**; for a tour booking, it's the **tour's last itinerary day**. This is stored per-payment as `held_until` at the moment the booking is confirmed — not computed dynamically at payout time — so a later change to a tour's itinerary can't silently move money that's already mid-hold.
- **Release job:** a scheduled job (`@Scheduled` cron, daily) sweeps `HELD` payments whose `held_until` has passed and flips them to `RELEASED`, **provided no `refund_requests` row referencing that payment is still `PENDING` or `UNDER_REVIEW`.**
- **Payout batch job:** a separate scheduled job runs **once a month** (e.g., 1st of the month, 00:05 local time), groups every `RELEASED` payment by owner (Hotel/Agency/Guide), and produces a `payout_batches` row per owner with the itemized `payout_items` that compose it. This is intentionally a **two-step process — compute the payable ledger, then disburse** — rather than one job that both calculates and transfers money in a single pass, so a bug in disbursement can never corrupt the source-of-truth ledger of what was owed.
- **Idempotency:** both jobs are safe to re-run. The release job only ever moves a row forward from `HELD`; the payout job only selects rows still in `RELEASED` and marks them `PAID_OUT` inside the same transaction that creates the `payout_items` row, so a job restart after a partial failure can't double-count or double-pay a booking.

```java
// Payment Service — nightly release sweep (simplified)
@Scheduled(cron = "0 15 0 * * *") // 00:15 daily
@Transactional
public void releaseMaturedHolds() {
    List<Payment> matured = paymentRepository
        .findByStatusAndHeldUntilBeforeAndNoOpenRefund(HELD, Instant.now());
    matured.forEach(p -> {
        p.setStatus(RELEASED);
        eventPublisher.publish("routing.payment.released",
            new PaymentReleasedEvent(p.getId(), p.getOwnerId(), p.getNetAmount()));
    });
}

// Payment Service — monthly payout batch (simplified)
@Scheduled(cron = "0 5 0 1 * *") // 00:05 on the 1st of each month
@Transactional
public void runMonthlyPayoutBatch() {
    Map<UUID, List<Payment>> releasedByOwner = paymentRepository
        .findByStatus(RELEASED).stream()
        .collect(Collectors.groupingBy(Payment::getOwnerId));

    releasedByOwner.forEach((ownerId, payments) -> {
        PayoutBatch batch = payoutBatchRepository.save(new PayoutBatch(ownerId, payments));
        payments.forEach(p -> p.setStatus(PAID_OUT));
        eventPublisher.publish("routing.payout.processed",
            new PayoutProcessedEvent(ownerId, batch.getId(), batch.getTotalAmount()));
    });
}
```

### 24.4 PayHere Checkout & Webhook Integration

- **Checkout initiation:** the frontend never talks to PayHere directly with a raw amount. The Payment Service generates a signed checkout request server-side — order ID, amount, currency, and a hash computed from `merchant_id + order_id + amount + currency + merchant_secret` (MD5) — so the amount charged can never be tampered with in the browser before the redirect to PayHere's hosted checkout page.
- **Return URLs:** `return_url` (success redirect back to the app), `cancel_url` (traveler abandoned checkout) — these control the *user's browser experience* only and are never trusted as proof of payment, because a return-URL hit can be spoofed or simply never fire if the user closes the tab.
- **Notify URL (the actual source of truth):** PayHere calls this **server-to-server**, independent of whether the traveler's browser ever returns to the app. The Payment Service verifies the callback by recomputing the `md5sig` from the payload and merchant secret and comparing it to the signature PayHere sent — **a callback with a mismatched signature is discarded and never transitions a payment's status**, regardless of what `status_code` it claims.
- **At-least-once webhook delivery:** PayHere retries the notify callback if the endpoint doesn't respond `200 OK`. The handler is written to be idempotent on `order_id` — a duplicate "success" notification for a payment already `COMPLETED` is acknowledged with `200 OK` and does nothing further, rather than re-firing the confirmation event a second time.
- **Sandbox vs. live mode:** merchant ID/secret and the checkout endpoint are environment-specific values pulled from **AWS Secrets Manager** (§15) alongside every other credential in the system — not hardcoded per environment, so promoting a build from staging to production never means editing payment code.

### 24.5 Refund Request Workflow

1. A traveler whose payment is currently `HELD` submits a **refund request form** (reason, supporting detail) from their booking history.
2. This creates a `refund_requests` row with `status = PENDING` and immediately flips the linked payment to `ON_HOLD_DISPUTE` — which, per §24.2, pulls it out of eligibility for the next payout sweep even if its `held_until` date has already passed.
3. An Admin reviews the request (`UNDER_REVIEW`) — this is a manual investigation step by design; refunds are not auto-approved, because the platform is refunding money it is currently holding on behalf of a third-party owner, not its own float.
4. **Approved:** the Payment Service calls PayHere's refund API (or, for payments settled through a rail PayHere can't programmatically reverse, a manual bank transfer) — the payment moves to `REFUNDED`, and a `RefundCompletedEvent` notifies the traveler.
5. **Rejected:** the payment reverts to `HELD` and resumes its normal countdown to `RELEASED` — the dispute doesn't reset or extend the hold clock, it only pauses it.

**Why this has to be admin-mediated rather than self-service auto-refund:** an instant, unconditional refund button on money that's earmarked for a hotel or agency creates an obvious abuse vector (stay at the hotel, then refund the booking after the fact) — the investigation step exists specifically to check the refund reason against the booking's actual lifecycle state (§4.4) before money moves.

### 24.6 Honest Limitations of This Model

This design intentionally mirrors what a real travel marketplace needs, while being upfront about where it's a simplification rather than a production-grade fintech implementation:

- **This is an internal ledger, not a licensed escrow/trust account.** A real business holding third-party client funds at this scale would typically need a legally separate trust/escrow account structure (and the accompanying regulatory registration), not just a `status` column in `payment_db`. Naming this gap explicitly is more credible in an interview than presenting an internal hold flag as if it were regulatory-grade escrow (see §19).
- **Single payment processor, no failover** — if PayHere has an extended outage, checkout has no automatic fallback gateway (§19).
- **Payout disbursement is currently a computed ledger, not an automated bank transfer** — the batch job in §24.3 produces exactly what is owed to whom, but wiring that into an automated mass-payment/bank API is the next iteration, not yet built (§19).
- **Partial refunds are not modeled** — the state machine in §24.2 treats a refund as all-or-nothing per payment; splitting a single payment into "refund 40%, release 60%" would need `payment_holds` to track sub-amounts rather than a single row per payment.

---

*Generated: July 2026 | Blue Ceylon — Advanced Full-Stack Cloud Engineering Portfolio | Author: Sithum Udayanga*

