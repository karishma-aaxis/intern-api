# Intern API - Orders & Authentication

A RESTful API built with **Node.js**, **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL** for user authentication and order management.

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Zod
- ESLint
- Prettier

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to the project

```bash
cd intern-api
```

Install dependencies

```bash
pnpm install
```

---

# Environment Variables

Create a `.env` file.

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/intern_api"
JWT_SECRET="your-secret-key"
PORT=3001
```

---

# Database Setup

Run migrations

```bash
pnpm prisma migrate dev
```

Generate Prisma Client

```bash
pnpm prisma generate
```

Seed the database

```bash
pnpm prisma db seed
```

---

# Seed Users

## Admin

Email

```
admin@example.com
```

Password

```
admin123
```

---

## Customer

Email

```
customer@example.com
```

Password

```
customer123
```

> Replace these credentials if your `prisma/seed.ts` uses different values.

---

# Run the Project

Development

```bash
pnpm dev
```

Build

```bash
pnpm build
```

Start Production

```bash
pnpm start
```

---

# Code Quality

Run ESLint

```bash
pnpm lint
```

Format code

```bash
pnpm format
```

---

# API Endpoints

## Authentication

### Signup

```
POST /api/auth/signup
```

### Login

```
POST /api/auth/login
```

---

## Users

### Get All Users (Admin)

```
GET /api/users
```

### Get User By ID

```
GET /api/users/:id
```

### Update User

```
PATCH /api/users/:id
```

### Delete User (Admin)

```
DELETE /api/users/:id
```

---

## Orders

### Create Order

```
POST /api/orders
```

### Get Orders

```
GET /api/orders
```

### Get Order By ID

```
GET /api/orders/:id
```

### Update Order Status (Admin)

```
PATCH /api/orders/:id/status
```

### Delete Order (Admin)

```
DELETE /api/orders/:id
```

---

# Authentication

Protected routes require the Authorization header.

Example:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Authorization Rules

### Admin

- View all users
- Delete users
- View all orders
- Update order status
- Delete orders

### Customer

- View own profile
- Update own profile
- Create orders
- View own orders

---

# Validation

Request validation is implemented using **Zod**.

Invalid requests return HTTP 400.

---

# Password Security

- Passwords are hashed using bcrypt.
- Password hashes are never returned in API responses.

---

# Order Logic

The server calculates `totalAmount` from the submitted items.

Client-provided totals are ignored.

---

# Delete User Behavior

Users with existing orders **cannot be deleted**.

The API returns:

```
409 Conflict
```

This project uses the **Block** strategy instead of cascade deletion.

---

# Project Structure

```
intern-api
│
├── prisma
│   ├── schema.prisma
│   └── seed.ts
│
├── src
│   ├── lib
│   ├── middleware
│   ├── modules
│   │   ├── auth
│   │   ├── users
│   │   └── orders
│   └── index.ts
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# Features

- User Authentication
- JWT Authorization
- Role-based Access Control
- User Management
- Order Management
- Zod Validation
- Prisma ORM
- PostgreSQL
- TypeScript
- ESLint
- Prettier