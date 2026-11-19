# Justdial Business Directory Platform

An All-India business discovery, verified merchant directory, and lead generation platform built with Next.js, NestJS, Prisma, and MySQL 8.

---

## Architecture & Monorepo Structure

```text
justdial-business-directory/
|
|-- frontend/                 # Next.js 14 App Router (Port 3000)
|   |-- src/
|   |   |-- app/              # (public), (auth), customer, merchant, admin routes
|   |   |-- components/       # Header, Footer, SearchBar, BusinessCard, CategoryCard, DashboardLayout
|   |   |-- lib/              # api.ts, auth.ts, utils.ts
|   |   |-- types/            # TypeScript contracts & role definitions
|   |-- public/               # logo.svg, images (banners, categories, placeholders)
|   |-- package.json
|   |-- next.config.ts
|   |-- tsconfig.json
|
|-- backend/                  # NestJS v10 REST API (Port 4000)
|   |-- src/
|   |   |-- auth/, users/, roles/, businesses/, categories/, locations/, search/,
|   |   |   leads/, reviews/, verification/, media/, plans/, payments/, banners/,
|   |   |   reports/, notifications/, admin/, common/, prisma/, health/
|   |-- prisma/               # schema.prisma, migrations, seed.ts
|   |-- .env.example
|   |-- package.json
|   |-- tsconfig.json
|
|-- docs/                     # Architecture & Project Overviews
|-- .gitignore
|-- package.json              # Monorepo workspaces configuration
└── README.md
```

---

## Prerequisites

- **Node.js**: `v20.x` or later (tested on `v26.13.0`)
- **npm**: `v10.x` or later (tested on `v12.2.1`)
- **MySQL Server**: `v8.0.x` running on `127.0.0.1:3306` with database `justdials-business`

---

## Getting Started

### 1. Configure Environment

Ensure `backend/.env` is configured with your local MySQL credentials:

```bash
cp backend/.env.example backend/.env
```

Example `backend/.env`:

```env
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1
CORS_ORIGIN=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=justdials-business

DATABASE_URL="mysql://root:your_local_password@127.0.0.1:3306/justdials-business"
```

Configure `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_NAME="Justdial Business Directory"
```

> **Security Note**: Never commit `.env` files to version control. The repository `.gitignore` automatically excludes all `.env` files.

---

### 2. Install Dependencies

Install all dependencies across the monorepo:

```bash
npm install
```

---

### 3. Generate Prisma Client

Generate the Prisma Client inside the backend:

```bash
npm run prisma:generate
```

---

### 4. Start Development Servers

To start both the Frontend and Backend concurrently:

```bash
npm run dev
```

Or run each service individually:

- **Backend API**: `npm run dev:backend` (available at `http://localhost:4000/api/v1`)
- **Frontend Web**: `npm run dev:frontend` (available at `http://localhost:3000`)
- **Swagger Docs**: Available at `http://localhost:4000/api/docs`

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts both Backend (`:4000`) and Frontend (`:3000`) in parallel |
| `npm run dev:backend` | Starts only the NestJS API server with TypeScript execution |
| `npm run dev:frontend` | Starts only the Next.js development server |
| `npm run build` | Compiles Prisma client, builds Backend API, and builds Frontend Web |
| `npm run lint` | Runs ESLint across backend and frontend workspaces |
| `npm run test` | Executes Jest test suites across backend |
| `npm run prisma:validate` | Validates Prisma schema integrity |
| `npm run prisma:generate` | Generates `@prisma/client` types |
| `npm run prisma:studio` | Launches visual Prisma Studio database manager |

---

## Health Check & Verification Endpoints

- **Backend Status**: `GET http://localhost:4000/api/v1/health`
- **Database Status**: `GET http://localhost:4000/api/v1/health/database`
- **Frontend Dashboard**: Open `http://localhost:3000` to view the live health status dashboard

---

## Documentation

For full architectural specifications, refer to:
- [docs/PROJECT_OVERVIEW.md](file:///c:/Users/Home/Desktop/Justdail%20Business%20Directory/docs/PROJECT_OVERVIEW.md)
- [docs/ARCHITECTURE.md](file:///c:/Users/Home/Desktop/Justdail%20Business%20Directory/docs/ARCHITECTURE.md)
- [docs/PHASE_01_REPORT.md](file:///c:/Users/Home/Desktop/Justdail%20Business%20Directory/docs/PHASE_01_REPORT.md)
