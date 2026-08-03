# Intern API - Orders & Authentication

REST API for authentication and order management using Node.js, Express.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod
- Helmet
- express-rate-limit
- ESLint
- Prettier

---

## Setup

```bash
git clone <repository-url>
cd intern-api
pnpm install
```

Create `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/intern_api"
JWT_SECRET="your-secret-key"
PORT=3001
```

---

## Database

```bash
pnpm prisma migrate dev
pnpm prisma generate
pnpm prisma db seed
```

### Seed Users

**Admin**

- Email: `admin@example.com`
- Password: `admin123`

**Customer**

- Email: `customer@example.com`
- Password: `customer123`

---

## Run

Development

```bash
pnpm dev
```

Build

```bash
pnpm build
```

Start

```bash
pnpm start
```

---

## API Routes

### Auth

```
POST /api/auth/signup
POST /api/auth/login
```

### Users

```
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Orders

```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

---

## Authentication

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Features

- JWT authentication
- Role-based authorization
- Password hashing with bcrypt
- Zod request validation
- Environment variable validation
- Helmet security headers
- Rate limiting for authentication routes
- Request body size limit
- Prisma ORM with PostgreSQL
- User and Order management
- Server-side order total calculation
- Pagination for Users and Admin Orders
- Reusable `requireOwnerOrAdmin` middleware
- Global error handling with custom `HttpError`
- Prisma error handling
- Async controller wrapper (`asyncHandler`)
- CORS enabled
- ESLint and Prettier configured

---

## Code Quality

```bash
pnpm lint
pnpm format
```
