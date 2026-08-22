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
│   │   │   ├── rateLimiter.middleware.js # Redis-backed rate limiting (5 attempts/15m)
│   │   │   ├── requestLogger.middleware.js # Pino HTTP logger
│   │   │   └── error.middleware.js       # Global error catcher (no leaked stack traces)
│   │   └── utils/
│   │       ├── salaryEngine.js           # Ported Indian payroll calculation engine
│   │       ├── idGenerator.js            # Automatic Login ID & initial password generator
│   │       ├── statusDerivation.js       # 3-state employee status derivation
│   │       ├── pdfGenerator.js           # PDF payslip generator using PDFKit
│   │       └── emailService.js           # Nodemailer email sender
│   ├── modules/
│   │   ├── auth/               # Register, Login, Refresh, Verify OTP, Reset Password
│   │   ├── employee/           # CRUD, Search, Field-level RBAC restrictions
│   │   ├── attendance/         # Check-in, Check-out, Overtime computation
│   │   ├── leave/              # Leave application & Atomic approval transactions
│   │   ├── payroll/            # Idempotent batch processing, PDF payslip streaming
│   │   └── notification/       # User & admin notification alerts
│   ├── jobs/
│   │   ├── queues.js           # BullMQ asynchronous queue
│   │   └── cron.js             # Automated monthly payroll cron
│   ├── sockets/
│   │   └── socket.server.js    # Socket.io /notifications namespace with JWT
│   ├── prisma/
│   │   └── seed.js             # Seeder with 5 demo employees
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
- **Login Rate Limiter**: Maximum 5 attempts per 15 minutes per IP (backed by Redis).
- **Role-Based Access Control**:
  - `ADMIN`: Full access to employee profiles, salary structures, payroll processing, leave approvals.
  - `HR`: Management access to attendance, employee profiles, leave reviews, and payroll views.
  - `EMPLOYEE`: Access to personal profile (restricted editable fields), own attendance, own leave requests, and own payslips.

---

## 📡 API Route Catalog

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new account and send OTP |
| `POST` | `/login` | Public | Sign in with email/loginId & password |
| `POST` | `/refresh` | Public | Rotate refresh token and get new access token |
| `POST` | `/logout` | Authenticated | Revoke refresh token and clear cookies |
| `POST` | `/verify-email` | Public | Verify registration OTP (10m TTL) |
| `POST` | `/forgot-password` | Public | Request password reset OTP |
| `POST` | `/reset-password` | Public | Reset password using verified OTP |
| `GET` | `/me` | Authenticated | Get current authenticated user profile |

### Employees (`/api/v1/employees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Authenticated | List employees with pagination, search & department filter |
| `GET` | `/:id` | Authenticated | Get employee profile by ID |
| `POST` | `/` | Admin / HR | Create new employee profile |
| `PATCH` | `/:id` | Admin full / Employee limited | Update profile (field-level permission enforced) |
| `DELETE` | `/:id` | Admin only | Delete employee record |

### Attendance (`/api/v1/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/check-in` | Employee | Clock in for the workday |
| `POST` | `/check-out` | Employee | Clock out, calculate work hours & overtime |
| `GET` | `/my` | Employee | Retrieve personal attendance history |
| `GET` | `/?date=` | Admin / HR | View attendance records for all employees on a date |

### Leave Management (`/api/v1/leaves`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Employee | Apply for time off (emits real-time notification) |
| `GET` | `/my` | Employee | Retrieve personal leave history |
| `GET` | `/` | Admin / HR | List all leave requests |
| `PATCH` | `/:id/review` | Admin / HR | Approve/Reject leave with **atomic Attendance creation** |

### Payroll (`/api/v1/payroll`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/process` | Admin / HR | Trigger **idempotent monthly payroll batch** |
| `GET` | `/my` | Employee | View personal monthly payslips |
| `GET` | `/` | Admin / HR | View all employee payroll records |
| `GET` | `/:id/slip` | Authenticated | Stream/download clean PDF payslip |

### Notifications (`/api/v1/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Authenticated | List recent notifications |
| `PATCH` | `/:id/read` | Authenticated | Mark notification as read |
| `PATCH` | `/read-all` | Authenticated | Mark all notifications as read |
| `DELETE` | `/:id` | Authenticated | Delete notification |

---

## 🧪 Testing

Run all unit & integration test suites:
```bash
npm test
```

Run unit tests only:
```bash
npm run test:unit
```

---

## 👥 Demo Seed Accounts

| Role | Login ID / Email | Password |
|---|---|---|
| **Admin** | `admin@dayflow.internal` | `Dayflow@123` |
| **Lead Frontend** | `alex.johnson@dayflow.internal` | `Dayflow@123` |
| **HR Specialist** | `priya.sharma@dayflow.internal` | `Dayflow@123` |
| **Product Manager** | `marcus.chen@dayflow.internal` | `Dayflow@123` |
| **VP Eng & HR** | `sarah.williams@dayflow.internal` | `Dayflow@123` |
| **UX Designer** | `david.kim@dayflow.internal` | `Dayflow@123` |
