# Dayflow HRMS — Production-Grade REST API Backend

> Production-ready Node.js REST API for Dayflow Human Resource Management System built with strict **N-Layer Architecture**, **PostgreSQL 15**, **Prisma ORM**, **Redis 7**, **JWT Authentication**, **Socket.io**, and **Docker**.

---

## 🏛️ Architecture Overview (Strict N-Layer)

```
┌──────────────────────────────────────────────────────────────┐
│  Router        (Route definitions & parameter binding)       │
├──────────────────────────────────────────────────────────────┤
│  Middleware    (JWT Auth, RBAC, Zod Validation, Error Catch) │
├──────────────────────────────────────────────────────────────┤
│  Controller    (HTTP Req/Res extraction & status mapping)    │
├──────────────────────────────────────────────────────────────┤
│  Service       (Pure business logic, transactions & rules)   │
├──────────────────────────────────────────────────────────────┤
│  Repository    (PostgreSQL database & Prisma client access)  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Directory Structure

```
backend/
├── docker-compose.yml          # PostgreSQL 15 + Redis 7 services
├── .env.example                # Environment variables template
├── package.json                # Dependencies & script definitions
├── prisma/
│   └── schema.prisma           # Prisma relational schema with constraints
├── src/
│   ├── config/
│   │   ├── env.js              # Zod-validated environment config
│   │   ├── db.js               # PostgreSQL pool & Prisma singleton with auto-DDL
│   │   ├── redis.js            # Redis client with resilient in-memory fallback
│   │   ├── logger.js           # Pino structured JSON logger
│   │   └── swagger.js          # OpenAPI specification
│   ├── shared/
│   │   ├── errors/
│   │   │   └── AppError.js     # Custom error hierarchy (ValidationError, UnauthorizedError, etc.)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js        # JWT access token & cookie verification
│   │   │   ├── role.middleware.js        # RBAC role enforcement (ADMIN, HR, EMPLOYEE)
│   │   │   ├── validate.middleware.js    # Zod body/query/params validation
│   │   │   ├── rateLimiter.middleware.js # Redis-backed rate limiting (10 attempts/15m)
│   │   │   ├── requestLogger.middleware.js # Pino HTTP logger
│   │   │   └── error.middleware.js       # Global error catcher (no leaked stack traces)
│   │   └── utils/
│   │       ├── salaryEngine.js           # Ported Indian payroll calculation engine
│   │       ├── idGenerator.js            # Automatic Login ID & initial password generator
│   │       ├── statusDerivation.js       # 3-state employee status derivation
│   │       ├── pdfGenerator.js           # PDF payslip generator using PDFKit
│   │       └── emailService.js           # Brevo / Nodemailer email sender
│   ├── modules/
│   │   ├── auth/               # Register, Login, Refresh, Verify OTP, Reset Password
│   │   ├── employee/           # CRUD, Search, Field-level RBAC restrictions, Salary, Documents
│   │   ├── attendance/         # Check-in, Check-out, Today summary, Overtime computation
│   │   ├── leave/              # Leave application & Atomic approval transactions
│   │   ├── payroll/            # Idempotent batch processing, PDF payslip streaming
│   │   ├── notification/       # User & admin notification alerts
│   │   └── analytics/          # KPI metrics, Attendance, Leave & Payroll analytics
│   ├── jobs/
│   │   ├── queues.js           # BullMQ asynchronous queue
│   │   └── cron.js             # Automated monthly payroll cron
│   ├── sockets/
│   │   └── socket.server.js    # Socket.io /notifications namespace with JWT
│   ├── prisma/
│   │   └── seed.js             # Seeder with Indian Tamil named employees
│   ├── app.js                  # Express application setup
│   └── server.js               # Server bootstrap & graceful shutdown
└── tests/
    ├── unit/
    │   ├── salaryEngine.test.js
    │   └── idGenerator.test.js
    └── integration/
        ├── auth.test.js
        ├── employee.test.js
        └── payroll.test.js
```

---

## 🚀 Quick Start & Installation

### 1. Start Infrastructure (PostgreSQL 15 + Redis 7)
```bash
docker compose up -d
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Install Dependencies & Seed Database
```bash
npm install
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The server will be available at:
- **API Server**: `http://localhost:5000`
- **Interactive Swagger Docs**: `http://localhost:5000/api-docs`
- **Real-Time WebSocket**: `ws://localhost:5000/notifications`

---

## 🔑 Authentication & Security

- **Password Hashing**: `bcryptjs` with cost factor 12.
- **Dual-Token System**:
  - `Access Token`: 15-minute validity, passed in `Authorization: Bearer <token>` or `accessToken` cookie.
  - `Refresh Token`: 7-day validity, persisted in database and issued via `httpOnly`, `sameSite: 'lax'` cookie.
- **Login Rate Limiter**: Maximum 10 attempts per 15 minutes per IP (backed by Redis).
- **Role-Based Access Control**:
  - `ADMIN`: Full access to employee profiles, salary structures, payroll processing, leave approvals.
  - `HR`: Management access to attendance, employee profiles, leave reviews, and payroll views.
  - `EMPLOYEE`: Access to personal profile (restricted editable fields), own attendance, own leave requests, and own payslips.

---

## 👥 Seeded Indian Tamil Employee Accounts

| Role | Name | Login ID / Email | Location | Password |
|---|---|---|---|---|
| **Admin / HR Officer** | Kavitha Balasubramanian | `admin@dayflow.internal` | Chennai HQ, Taramani | `Dayflow@123` or `admin123` |
| **Lead Frontend Architect** | Karthik Sundaram | `karthik.sundaram@dayflow.internal` / `OITKASU0220001` | Chennai Tech Hub | `Dayflow@123` or `employee123` |
| **People Operations Specialist** | Ananya Ramaswamy | `ananya.ramaswamy@dayflow.internal` / `OITANRA0220002` | Chennai Tech Hub | `Dayflow@123` or `employee123` |
| **Senior Product Manager** | Senthil Murugan | `senthil.murugan@dayflow.internal` / `OITSEMU0220003` | Coimbatore Innovation Hub | `Dayflow@123` or `employee123` |
| **Principal UX Designer** | Dinesh Rajendran | `dinesh.rajendran@dayflow.internal` / `OITDIRA0220005` | Madurai Digital Campus | `Dayflow@123` or `employee123` |
