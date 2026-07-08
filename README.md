# 🏝️ Blue Ceylon

**A distributed, event-driven tourism marketplace for Sri Lanka — built on Spring Boot microservices, RabbitMQ, and AWS.**

Blue Ceylon connects hotels, tour agencies, and licensed tour guides with travelers through a single marketplace: search and booking, real-time notifications, multi-dimensional reviews, and an escrow-style payment system with monthly payouts — all running as five independently deployable services behind a single API Gateway.

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP%200--9--1-FF6600?logo=rabbitmq)](https://www.rabbitmq.com/)
[![Keycloak](https://img.shields.io/badge/Keycloak-OIDC%2FOAuth2-4D4D4D?logo=keycloak)](https://www.keycloak.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-ECS%20Fargate-232F3E?logo=amazonaws)](https://aws.amazon.com/ecs/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Microservices](#microservices)
- [Domain Model](#domain-model)
- [User Roles](#user-roles)
- [Event-Driven Design](#event-driven-design)
- [Security](#security)
- [Payments & Escrow](#payments--escrow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running with Docker Compose](#running-with-docker-compose)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment (AWS)](#deployment-aws)
- [CI/CD](#cicd)
- [Known Trade-offs & Roadmap](#known-trade-offs--roadmap)
- [Documentation](#documentation)
- [License](#license)
- [Author](#author)

---

## Why This Exists

Ceylon Trails digitizes three tourism supply verticals — **hotels**, **tour agencies**, and **freelance tour guides** — behind one marketplace, the way Booking.com or Airbnb unify supply and demand. It's built around the same primitives used in real distributed systems teams, rather than a single-service CRUD tutorial:

- **Service decomposition by business capability** (Catalog / Booking / Payment / Notification), not by technical layer.
- **Asynchronous, event-driven communication** for anything that doesn't need to block the user-facing request.
- **Delegated identity via Keycloak (OIDC)** — no hand-rolled password storage or token issuance, stateless RS256 JWTs that scale horizontally with no shared session store.
- **Database-per-service** data isolation — enforced at both the application and infrastructure level.
- **Cloud-native deployment assumptions** from day one: ephemeral containers, no local disk state, centrally managed secrets.

For the full architectural reasoning, trade-offs, and interview-depth write-up behind every decision below, see [`docs/ENGINEERING_PORTFOLIO.md`](./docs/ENGINEERING_PORTFOLIO.md).

## Architecture at a Glance

```text
                     +-------------------+  OIDC Auth Code   +------------------+
                     | NEXT.JS FRONTEND   |<----------------->|     KEYCLOAK     |
                     |  (TypeScript SSR)  |    + PKCE          | (Realm:         |
                     +---------+----------+                    | ceylontrails,  |
                               | HTTPS/REST (Axios, bearer JWT) | RS256, JWKS)   |
                               v                                +--------+-------+
+----------------------------------------------------------------------------------+
|                            SPRING CLOUD API GATEWAY                              |
|      (Route Mapping, CORS, Global JWT Validation via Keycloak JWKS)  <-----------+
+-------+--------------------+-------------------+-----------------------+---------+
        |                    |                   |                       |
        v                    v                   v                       v
+-------+-------+    +-------+-------+   +-------+-------+       +-------+-------+
| CATALOG SRV   |    | BOOKING SRV   |   | PAYMENT SRV   |       | ADMIN SERVICE |
| (Hotels/Tours)|    | (Transactions)|   | (Escrow/Payout)|      | (Moderation)  |
+-------+-------+    +-------+-------+   +-------+-------+       +-------+-------+
        |                    |                   |                       |
   [PostgreSQL]         [PostgreSQL]        [PostgreSQL]            [PostgreSQL]
   catalog_db            booking_db          payment_db               (shared/admin)
        |                    |                   |                       |
        |                    |                   +---> PayHere Gateway (charge/refund)
        |                    |                   <--- PayHere Notify Webhook
        |                    v                   v                       |
        |             +-----------------------------------------+        |
        +------------>|      RABBITMQ MESSAGE BROKER            |<-------+
                      |  Exchange: ceylontrails.exchange        |
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

Every request into the cluster passes through a single choke point — the API Gateway — where JWT validation (against Keycloak's public keys), CORS, and rate limiting live. That means a security fix or policy change is a one-service deploy, not a coordinated multi-service release. User identity itself never touches application code or a bespoke database — Keycloak owns the credential store, token issuance, and refresh-token lifecycle entirely.

**Two communication styles, used deliberately:**

| Pattern | Used For | Why |
|---|---|---|
| **Synchronous** (HTTP/REST via Gateway) | Search, login, cart, booking confirmation response | The user is actively waiting; blocking is expected. |
| **Asynchronous** (RabbitMQ pub/sub) | Emails, live notifications, analytics | The user should never wait on a third-party SMTP provider or similar side effect. |

## Microservices

| Service | Responsibility | Database | Notes |
|---|---|---|---|
| **Keycloak** (external IdP) | Registration, login, RS256 JWT issuance, refresh-token rotation, password storage | `keycloak_db` | Not application code — a managed IAM component; realm/client config is version-controlled and imported at startup |
| `ceylontrails-api-gateway` | Routing, global JWT validation (via Keycloak JWKS), CORS, rate limiting | — | Spring Cloud Gateway (WebFlux, reactive, non-blocking) |
| `ceylontrails-catalog-service` | Hotels, rooms, tours, guides, search & filter | `catalog_db` | Read-heavy; multilingual descriptions (EN/SI/TA) |
| `ceylontrails-booking-service` | Booking lifecycle, availability locking, reviews | `booking_db` | Write-heavy, transactionally critical |
| `ceylontrails-payment-service` | PayHere integration, escrow hold, payout batching, refunds | `payment_db` | Financially critical; idempotent by design |
| `ceylontrails-notification-service` | Email (Brevo) + WebSocket/STOMP push | *stateless* | Scales on queue depth, not CPU |

Full per-service technical specs are in [§4 of the engineering portfolio](./docs/ENGINEERING_PORTFOLIO.md#4-microservices-breakdown--full-technical-specification).

## Domain Model

Three supply verticals share one `Booking` abstraction with a common lifecycle state machine:

| Supply Type | Core Entity | Distinguishing Attributes |
|---|---|---|
| Hotels | `Hotel` → `Room` | Branches, room types, nightly pricing (USD/LKR), availability calendar |
| Tour Packages | `Tour` → `Itinerary Day` | Day-by-day itineraries, GPS waypoints, tiered group pricing |
| Tour Guides | `Guide` | SLTDA license verification, languages, vehicle type, blackout dates |

```text
PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT
              ↳ CANCELLED / REFUNDED (terminal side-branches)
```

Multi-tenancy is handled at the business-owner level — one owner account can operate multiple hotel branches or agencies, so authorization checks resolve *"does this JWT's user own this specific record"*, not just *"is this user a BUSINESS_OWNER."*

## User Roles

Five roles, sourced as **Keycloak realm/client roles** and carried as claims in the JWT, enforced via `@PreAuthorize` at the service layer (never trusted from the frontend):

- **Traveler** — search, book, pay, request refunds, leave multi-dimensional reviews (cleanliness / value / location).
- **Hotel Owner** — manages Rooms *and* Tour Packages; the one deliberate cross-capability grant in the permission model.
- **Tour Agency Owner** — manages Tour Packages only (no `hotel_id` to attach a room to).
- **Tour Guide (Freelancer)** — SLTDA-verified profile, self-led Tour Packages, availability calendar.
- **Admin / Super Admin** — approves business registrations & guide licenses, global analytics, platform broadcasts.

**Approval model:** a business entity and its listings can be created immediately at registration — nothing is blocked on admin approval. What's gated is *public visibility*: search APIs only surface listings whose parent entity has `status = APPROVED`. The moment a Hotel/Agency/Guide is approved, every listing already built underneath it becomes searchable — no secondary per-listing queue.

## Event-Driven Design

```java
// Booking Service — publish, don't wait
rabbitTemplate.convertAndSend(
    "ceylontrails.exchange",
    "routing.booking.confirmed",
    new BookingEventPayload(bookingId, travelerEmail, hotelName)
);
```

```java
// Notification Service — consume, act, never block the publisher
@RabbitListener(queues = "booking.notifications.queue")
public void handleBookingConfirmation(BookingEventPayload payload) {
    emailService.sendBookingConfirmation(payload);
    webSocketService.pushNotification(payload.getUserId(), "Booking Confirmed!");
}
```

- **Topic exchange** (`ceylontrails.exchange`) with routing-key patterns like `booking.*` / `payment.*`.
- **Dead-letter queue** isolates poison messages after N failed redeliveries.
- **At-least-once delivery** (AMQP), so consumers are written to be idempotent — e.g. checking whether an email for a `bookingId` was already sent before resending.
- One event, two delivery channels: RabbitMQ → Notification Service → both email (Brevo SMTP) and a live STOMP/WebSocket push, so the two channels can never disagree.

## Security

Identity is split into two deliberately separate concerns — **who a human user is** (Keycloak) and **what an AWS resource is allowed to do** (AWS IAM). Nothing about one leaks into the other.

**User identity — Keycloak (OIDC/OAuth2)**
- **Delegated identity provider** — no application code owns a password table, hashing routine, or token-signing key. Keycloak issues, rotates, and revokes tokens.
- **RS256-signed JWTs**, verified at the Gateway against Keycloak's published JWKS (public-key rotation handled automatically — no shared secret to leak or rotate manually).
- **Authorization Code Flow + PKCE** from the Next.js frontend; the frontend never sees or stores a password.
- **Refresh-token rotation** and session/token revocation are handled by Keycloak's own token lifecycle, not a custom `refresh_tokens` table.
- **Resource-ownership checks**, not just role checks — a `BUSINESS_OWNER` claim alone can't express "does this user own *this* hotel"; that check stays in each service against its own data.
- **Realm/client configuration is version-controlled** (exported JSON) and imported at container startup, rather than clicked together by hand in the admin console.

**Infrastructure identity — AWS IAM**
- **Least-privilege IAM Task Roles** per ECS container — each service can only reach the AWS resources it actually needs (its own RDS credentials via Secrets Manager, its own S3/Cloudinary config, etc.).
- **AWS Secrets Manager** for all credentials — DB passwords, Keycloak client secrets, PayHere/Brevo/Cloudinary keys — sourced at container startup, never baked into images.
- **WAF** at the edge, private-subnet-only compute and databases (including the Keycloak container and its RDS-backed `keycloak_db`).
- IAM governs *service-to-AWS-service* trust; it never sees or issues end-user tokens.

See [§8 and §15 of the portfolio](./docs/ENGINEERING_PORTFOLIO.md#8-security-architecture--distributed-jwt--iam) for the full Keycloak-vs-IAM boundary and the migration notes from the original hand-rolled auth service.

## Payments & Escrow

Ceylon Trails charges travelers synchronously through **PayHere** at checkout but never releases that money to a Hotel/Agency/Guide until the booked date has passed:

```text
INITIATED → PENDING_GATEWAY → COMPLETED → HELD → RELEASED → PAID_OUT
                                    ↳ ON_HOLD_DISPUTE → REFUNDED / HELD
```

- **Escrow hold:** funds are held until the check-out date (rooms) or last itinerary day (tours).
- **Monthly payout batch:** a scheduled job sweeps `RELEASED` payments per owner into a settlement ledger — a two-step *compute-then-disburse* process so a disbursement bug can never corrupt the payable ledger.
- **Webhook authenticity:** PayHere's server-to-server notify callback is verified by recomputing its `md5sig`; a mismatched signature is discarded regardless of claimed status.
- **Refunds are admin-mediated**, never auto-approved, since the platform is refunding money held on behalf of a third party.
- **Honest limitation:** this is an internal ledger, not a licensed escrow/trust account — see [§24.6](./docs/ENGINEERING_PORTFOLIO.md#246-honest-limitations-of-this-model) for what a production fintech implementation would additionally require.

## Tech Stack

| Layer | Technologies |
|---|---|
| Language/Runtime | Java 21 (LTS), TypeScript |
| Backend | Spring Boot 4, Spring Cloud Gateway, Spring Security 6, Spring Data JPA/Hibernate |
| Messaging | RabbitMQ (AMQP 0-9-1), STOMP over WebSocket |
| Database | PostgreSQL 15+ (database-per-service), Flyway migrations |
| Frontend | Next.js 14 (React 18), TypeScript, Axios |
| Auth / IAM | Keycloak (OIDC/OAuth2, RS256, PKCE) for user identity; AWS IAM for service/infra identity |
| Media | Cloudinary CDN |
| Email | Brevo (Sendinblue) transactional SMTP API |
| Payments | PayHere gateway, `md5sig`-verified webhooks, escrow-style holding, monthly payout batching |
| Containerization | Docker |
| Cloud | AWS: ECS Fargate, ALB, RDS PostgreSQL, Amazon MQ, Secrets Manager, IAM, VPC, WAF |
| CI/CD | GitHub Actions (matrix builds, Docker build/push to ECR) |
| API Docs | OpenAPI 3.0 / Swagger UI |

## Project Structure

```text
ceylon-trails/
├── ceylontrails-api-gateway/        # Spring Cloud Gateway — routing, Keycloak JWT filter, CORS
├── keycloak/                        # Realm export (JSON), client configs, import scripts
├── ceylontrails-catalog-service/    # Hotels, rooms, tours, guides, search
├── ceylontrails-booking-service/    # Booking lifecycle, reviews
├── ceylontrails-payment-service/    # PayHere, escrow, payouts, refunds
├── ceylontrails-notification-service/ # Email + WebSocket/STOMP push
├── ceylontrails-frontend/           # Next.js 14 + TypeScript
├── docs/
│   └── ENGINEERING_PORTFOLIO.md     # Full architectural deep-dive (this repo's design doc)
├── docker-compose.yml
└── .github/workflows/               # CI/CD pipelines
```

## Getting Started

### Prerequisites

- Java 21 (LTS)
- Node.js 18+ and npm/yarn
- Docker & Docker Compose
- PostgreSQL 15+ (or use the bundled Docker Compose service)
- A RabbitMQ instance (or use the bundled Docker Compose service)
- A Keycloak instance (bundled via Docker Compose) with the `ceylontrails` realm imported from `keycloak/realm-export.json`
- A [PayHere](https://www.payhere.lk/) sandbox account (merchant ID + secret) for payment testing
- A [Brevo](https://www.brevo.com/) account for transactional email
- A [Cloudinary](https://cloudinary.com/) account for media uploads

### Clone

```bash
git clone https://github.com/<your-username>/ceylon-trails.git
cd ceylon-trails
```

### Backend — run a single service locally

```bash
cd ceylontrails-catalog-service
./mvnw spring-boot:run
```

Repeat per service, or use Docker Compose to bring up the whole stack (see below).

### Frontend

```bash
cd ceylontrails-frontend
npm install
npm run dev
```

Runs the Next.js dev server at `http://localhost:3000`. Create a `.env.local` with at least:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

`NEXT_PUBLIC_*` variables are the only ones exposed to the browser bundle — anything the API layer needs server-side only (e.g. for SSR data fetching) should be a plain, unprefixed env var instead.

## Configuration

Each service reads its configuration from environment variables (see each service's `application.yml` for the full list). At minimum you'll need:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/catalog_db
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Keycloak (OIDC)
KEYCLOAK_ISSUER_URI=http://localhost:8180/realms/ceylontrails
KEYCLOAK_CLIENT_ID=ceylontrails-gateway
KEYCLOAK_CLIENT_SECRET=your-confidential-client-secret

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# PayHere
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_MODE=sandbox                  # sandbox | live

# Brevo
BREVO_API_KEY=your-brevo-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

In production, all of the above are sourced from **AWS Secrets Manager** at container startup rather than baked into images — see [§15](./docs/ENGINEERING_PORTFOLIO.md#15-cloud-security--iam-hardening).

## Running with Docker Compose

```bash
docker compose up --build
```

This brings up PostgreSQL, RabbitMQ, Keycloak (with the `ceylontrails` realm auto-imported), the remaining four backend services, and the API Gateway. The frontend is run separately with `npm run dev` for hot-reload during development.

| Service | Default Port |
|---|---|
| API Gateway | `8080` |
| Keycloak | `8180` |
| Catalog Service | `8082` |
| Booking Service | `8083` |
| Payment Service | `8084` |
| Notification Service | `8085` |
| RabbitMQ Management UI | `15672` |
| Frontend (dev) | `3000` |

## API Documentation

Each service exposes OpenAPI 3.0 docs via Swagger UI at `/swagger-ui.html`, aggregated through the API Gateway at:

```
http://localhost:8080/swagger-ui.html
```

Health checks are exposed at `/actuator/health` on every service (Spring Boot Actuator), used by the ECS scheduler and ALB target groups in production.

## Testing

| Level | What It Verifies |
|---|---|
| Unit | Business logic in isolation — e.g. booking state machine transitions, password matching |
| Integration | A service against a real, containerized database (Testcontainers) — Flyway migrations, soft-delete filters |
| Contract | The event payload shape one service produces matches what a consumer expects |
| End-to-end | A full user journey through the Gateway across multiple services |

```bash
# Run a single service's tests
./mvnw test

# Run the frontend test suite
cd ceylontrails-frontend && npm test
```

Message-driven flows are tested against an embedded/Testcontainers RabbitMQ instance rather than a live broker.

## Deployment (AWS)

Production deployment targets **ECS Fargate** behind an **Application Load Balancer**, with managed **RDS PostgreSQL** (one instance/schema per service) and **Amazon MQ** for RabbitMQ. See [§14–§15 of the portfolio](./docs/ENGINEERING_PORTFOLIO.md#14-cloud-infrastructure--deployment-architecture) for the full topology, IAM hardening, and network segmentation.

## CI/CD

GitHub Actions builds and pushes each service's Docker image to ECR on every push to `main`, using a build matrix so all five services build in parallel and are tagged independently by commit SHA:

```yaml
strategy:
  matrix:
    service: [api-gateway, catalog-service, booking-service, notification-service]
```

> The pipeline currently proves the build/package/push mechanics. A test-gating stage and an automated ECS deploy step are tracked in the roadmap below.

## Known Trade-offs & Roadmap

Being upfront about what isn't solved yet:

- [x] ~~Migrate JWT signing from HS256 to RS256~~ — resolved by delegating token issuance to Keycloak (RS256 by default).
- [ ] Automate Keycloak realm/client provisioning via Terraform instead of a manually-exported JSON import.
- [ ] Add a **shared pub/sub backplane** (Redis or RabbitMQ's STOMP plugin) so the Notification Service can scale past one WebSocket replica.
- [ ] Add a **test-gating stage** and automated ECS deploy job to the CI/CD pipeline.
- [ ] Differentiate **rate-limiting tiers** between anonymous and authenticated traffic.
- [ ] Extract **analytics** into its own service consuming the existing event bus.
- [ ] Automate **payout disbursement** (currently a computed ledger, not a bank transfer).
- [ ] Add a **processor-agnostic payment interface** so a second gateway can back up PayHere.
- [ ] Model **partial refunds** (currently all-or-nothing per payment).
- [ ] Extend the marketplace to additional supply verticals (Restaurants, Adventure/Activity operators) — additive by design, since `Booking` and moderation are already modeled around a generic "operator" concept.

## Documentation

The full interview-depth engineering write-up — every architectural decision, trade-off, failure mode, and the reasoning behind it — lives in [`docs/ENGINEERING_PORTFOLIO.md`](./docs/ENGINEERING_PORTFOLIO.md), including:

- Complete microservice specifications
- Fund lifecycle & escrow state machine
- Resilience and failure-mode table
- Skills-to-role mapping and interview talking points
- Full glossary of protocols and terms used throughout the system

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

**Sithum Udayanga**
Full-Stack Cloud Engineer / Backend Microservices Engineer / Platform Engineer
