# Project Overview: Justdial Business Directory Platform

## 1. Executive Summary
The **Justdial Business Directory Platform** is an enterprise-grade, All-India local search, business discovery, and verified merchant marketplace. Inspired by the core utilities of Justdial, the platform provides original modern branding, performant web interactions, secure enterprise backend architecture, and verified business data.

The system is designed from the ground up for high concurrency, low-latency search queries, multi-tenant merchant administration, and resilient data storage across Indian states, cities, and pin codes.

---

## 2. Platform Vision and Core Capabilities
The platform roadmap spans nine core pillars:

1. **Public Discovery Website**: High-speed, SEO-optimized business directory, localized category navigation, geolocation-aware search, and rich business detail pages.
2. **Customer Accounts**: Secure OTP-based authentication, user bookmarks, search history, enquiries, and rating submissions.
3. **Merchant Dashboard**: Multi-location listing management, business profile customization, working hours, catalog/menu showcase, and real-time lead analytics.
4. **Admin Management Panel**: Verification workflows, KYC validation, fraud prevention, catalog governance, and system-wide audit telemetry.
5. **Business Listings & Search Engine**: Multi-faceted filtering (location, rating, verified badge, open now, payment options), powered by full-text search with phonetic match support.
6. **Enquiries & Lead Management Engine**: Instant multi-channel notifications (SMS/WhatsApp/Email) connecting consumers with qualified local businesses.
7. **Reviews & Trust Engine**: Verified review capture, moderation pipelines, media uploads, and merchant response mechanisms.
8. **Paid Subscriptions**: Tiered merchant visibility packages (Silver, Gold, Platinum) with scheduled invoicing and automated renewal lifecycle.
9. **Sponsored Listings & Ad Engine**: Targeted search result placement, category pin banners, and cost-per-lead tracking.

---

## 3. Technology Stack & Foundation Specifications

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Monorepo Harness** | npm Workspaces | npm v12.2.1 / Node.js v26.13.0 | Centralized workspace management for apps & packages |
| **Web Frontend** | Next.js (App Router), React, TypeScript | Next.js 14.2.35, React 18.3.1, TS 5.6.3 | Server-rendered and client-hydrated responsive UI |
| **Styling & Design System**| Tailwind CSS, PostCSS, Lucide Icons | Tailwind 3.4.17, Lucide React 0.475 | Custom enterprise color tokens & accessibility |
| **API Server** | NestJS, Express, Node.js | NestJS 10.4.15 / 10.4.22, TS 5.6.3 | Modular REST API engine, Swagger OpenAPI docs, validation |
| **Database Engine** | MySQL Community Server | MySQL 8.0.46 | Relational persistence with UTF8MB4 support |
| **ORM & Data Layer** | Prisma ORM | Prisma 6.19.3 | Type-safe schema definition, migrations, query execution |
| **Validation Layer** | Zod & class-validator | Zod 3.23.8, class-validator 0.14.1 | Dual runtime boundary validation (HTTP + Models) |

---

## 4. Phase 01 Objective
The goal of **Phase 01: Project Foundation and Database Setup** is to establish the monorepo architecture, set up the Next.js frontend and NestJS API backend, configure the MySQL 8 database (`justdials-business`) with Prisma ORM, and verify live end-to-end communication and database health.
