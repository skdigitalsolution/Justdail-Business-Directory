# Architecture Specification: Justdial Business Directory Platform

## 1. Monorepo Structure

The project uses a clean npm workspaces monorepo structure with distinct separation between `frontend/` and `backend/`:

```text
justdial-business-directory/
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- (public)/
|   |   |   |   |-- page.tsx
|   |   |   |   |-- search/
|   |   |   |   |-- categories/
|   |   |   |   |-- business/
|   |   |   |   |-- add-business/
|   |   |   |   |-- pricing/
|   |   |   |   |-- about/
|   |   |   |   |-- contact/
|   |   |   |
|   |   |   |-- (auth)/
|   |   |   |   |-- login/
|   |   |   |   |-- verify-otp/
|   |   |   |
|   |   |   |-- customer/
|   |   |   |   |-- dashboard/
|   |   |   |   |-- saved/
|   |   |   |   |-- reviews/
|   |   |   |   |-- enquiries/
|   |   |   |   |-- profile/
|   |   |   |
|   |   |   |-- merchant/
|   |   |   |   |-- dashboard/
|   |   |   |   |-- businesses/
|   |   |   |   |-- leads/
|   |   |   |   |-- reviews/
|   |   |   |   |-- verification/
|   |   |   |   |-- plans/
|   |   |   |   |-- settings/
|   |   |   |
|   |   |   |-- admin/
|   |   |   |   |-- dashboard/
|   |   |   |   |-- businesses/
|   |   |   |   |-- categories/
|   |   |   |   |-- locations/
|   |   |   |   |-- users/
|   |   |   |   |-- verification/
|   |   |   |   |-- leads/
|   |   |   |   |-- reviews/
|   |   |   |   |-- plans/
|   |   |   |   |-- payments/
|   |   |   |   |-- banners/
|   |   |   |   |-- reports/
|   |   |   |   |-- settings/
|   |   |   |
|   |   |   |-- layout.tsx
|   |   |   |-- globals.css
|   |   |
|   |   |-- components/
|   |   |   |-- Header.tsx
|   |   |   |-- Footer.tsx
|   |   |   |-- SearchBar.tsx
|   |   |   |-- BusinessCard.tsx
|   |   |   |-- CategoryCard.tsx
|   |   |   |-- DashboardLayout.tsx
|   |   |
|   |   |-- lib/
|   |   |   |-- api.ts
|   |   |   |-- auth.ts
|   |   |   |-- utils.ts
|   |   |
|   |   |-- types/
|   |       |-- index.ts
|   |
|   |-- public/
|   |   |-- images/
|   |   |   |-- banners/
|   |   |   |-- categories/
|   |   |   |-- placeholders/
|   |   |-- logo.svg
|   |
|   |-- .env.example
|   |-- package.json
|   |-- next.config.ts
|   |-- tsconfig.json
|
|-- backend/
|   |-- src/
|   |   |-- main.ts
|   |   |-- app.module.ts
|   |   |-- auth/
|   |   |-- users/
|   |   |-- roles/
|   |   |-- businesses/
|   |   |-- categories/
|   |   |-- locations/
|   |   |-- search/
|   |   |-- leads/
|   |   |-- reviews/
|   |   |-- verification/
|   |   |-- media/
|   |   |-- plans/
|   |   |-- payments/
|   |   |-- banners/
|   |   |-- reports/
|   |   |-- notifications/
|   |   |-- admin/
|   |   |-- common/
|   |   |   |-- filters/
|   |   |   |-- interceptors/
|   |   |-- prisma/
|   |   |-- health/
|   |
|   |-- prisma/
|   |   |-- schema.prisma
|   |   |-- migrations/
|   |   |-- seed.ts
|   |
|   |-- .env.example
|   |-- package.json
|   |-- tsconfig.json
|
|-- docs/
|-- .gitignore
|-- package.json
|-- README.md
```

---

## 2. User Roles Architecture (9 Roles)

The platform architecture plans for nine distinct roles across public, merchant, and administrative access planes:

| Role | Access Plane | Primary Permissions & Responsibilities |
| :--- | :--- | :--- |
| **1. Visitor** | Public Website | Unauthenticated discovery, search listings, browse categories, read reviews |
| **2. Registered Consumer** | `customer/*` | Save favorites, submit reviews & ratings, post enquiries, manage profile |
| **3. Business Owner** | `merchant/*` | Add/claim listings, view incoming customer leads, manage profile, upgrade plans |
| **4. Merchant Staff** | `merchant/*` | Respond to leads, update hours/photos, view customer enquiries (scoped) |
| **5. Content Moderator** | `admin/*` | Review moderation, listing content hygiene, abuse reports |
| **6. Verification Officer** | `admin/*` | KYC verification, physical/phone verification badge audits, trust scores |
| **7. Sales / Support Agent** | `admin/*` | Merchant onboarding assistance, sponsored package upsells, ticket resolution |
| **8. Finance Manager** | `admin/*` | Manage subscriptions, view Razorpay payouts, invoices, revenue telemetry |
| **9. Super Administrator** | `admin/*` (Full) | System-wide configuration, RBAC permissions, audit trails, database health |

> **Security Rule**: Role-based access control (RBAC) will be enforced at the NestJS backend API layer through Guards and Decorators, not merely by hiding frontend UI controls.

---

## 3. Design Tokens & Visual Hierarchy

The frontend incorporates the defined color tokens:

- **Deep Navy (`#0B1830`)**: Dominant typography, headers, dark UI framing.
- **Primary Blue (`#2563EB`)**: Main call-to-actions, active links, primary badges, search buttons.
- **Soft Background (`#F5F7FB`)**: Clean canvas tint for reduced eye fatigue and contrast separation.
- **Amber Accent (`#F59E0B`)**: Rating stars, featured indicators, attention badges, warnings.
- **White (`#FFFFFF`)**: Card surfaces, modal containers, crisp contrast sections.

---

## 4. Backend Architecture & Security Safeguards

1. **Global Prefix**: All REST endpoints are prefixed with `/api/v1`.
2. **CORS Policy**: Configured strictly for `http://localhost:3000` with credential support.
3. **Global Input Sanitization**: NestJS `ValidationPipe` with whitelist and automatic type transformation.
4. **Structured Telemetry**: `LoggingInterceptor` captures execution time, route, and HTTP response code.
5. **Global Exception Shield**: `AllExceptionsFilter` catches unhandled exceptions, sanitizing internal server stack traces while preserving structured JSON errors.
6. **OpenAPI / Swagger**: Documentation available at `/api/docs`.

---

## 5. MySQL & Prisma Setup

- **Database**: `justdials-business` (MySQL 8.0.46) on `127.0.0.1:3306`.
- **Connector**: Prisma MySQL provider inside `backend/prisma/schema.prisma`.
- **Credential Storage**: Kept strictly in `backend/.env` (omitted from Git).
- **Health Verification**: Real-time query `SELECT VERSION() as version;` executed via Prisma `$queryRaw` returning status, latency, and database version without leaking credentials.
