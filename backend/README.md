# 🚗 Car Rental Backend API

A modern, scalable backend API for a car rental platform built with **NestJS**, **Prisma**, and **PostgreSQL**.

---

## 📋 Project Overview

A production-ready backend service for managing car inventory and rental operations. Built with enterprise-grade patterns including JWT authentication, OAuth integration, and role-based access control (RBAC). The API provides complete CRUD operations for vehicles and rental transactions with secure, efficient data management.

---

## ✨ Features

- **🔐 Advanced Authentication** – JWT-based auth utilizing `httpOnly`, `secure`, and `sameSite` cookies to prevent XSS & CSRF attacks. Includes automated Refresh Token rotation.
- **🔑 Google OAuth 2.0** – Seamless social login integration mapped directly to the database user profiles.
- **👥 Role-Based Access Control** – Fine-grained permissions using Custom Guards & Decorators (Admin, User).
- **🚙 Fleet Management** – Full CRUD operations for vehicle inventory with image upload handling.
- **📝 Rental Operations** – Create, update, and track rentals with conflict validation to prevent double-booking.
- **📊 Database Integrity** – Type-safe operations utilizing Prisma ORM with structured relational schemas.
- **✅ Clean Architecture** – Modular structure, DTO validation using `class-validator`, and centralized error handling.

---

## 🛠️ Tech Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| **Runtime**        | Node.js                            |
| **Framework**      | NestJS 11+                         |
| **Language**       | TypeScript                         |
| **ORM**            | Prisma 7+                          |
| **Database**       | PostgreSQL                         |
| **Authentication** | JWT, Passport.js, Google OAuth     |
| **Validation**     | class-validator, class-transformer |
| **Testing**        | Jest                               |
| **Linting**        | ESLint, Prettier                   |

---

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/car_rental

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Server
NODE_ENV=development
PORT=3000
```

---

## 📦 Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

---

## ▶️ Running the App

```bash
# Development mode (with auto-reload)
npm run start:dev

# Watch mode for debugging
npm run start:debug

# Production build
npm run build

# Production mode
npm run start:prod
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 📂 Project Structure

```
src/
├── auth/          # JWT & OAuth authentication
├── cars/          # Car management module
├── rental/        # Rental booking module
├── common/        # Shared utilities & decorators
├── prisma/        # Database service
└── main.ts        # Application entry point
```

---

## 🔑 API Endpoints Overview

### 🔐 Authentication Routes

| Method | Endpoint                | Description                               | Auth Required |
| ------ | ----------------------- | ----------------------------------------- | ------------- |
| `POST` | `/auth/register`        | Register a new user with optional image   | 🌐 Public     |
| `POST` | `/auth/login`           | Login and set secure cookies              | 🌐 Public     |
| `GET`  | `/auth/google`          | Trigger Google OAuth flow                 | 🌐 Public     |
| `GET`  | `/auth/google/callback` | Google OAuth callback & token generation  | 🌐 Public     |
| `POST` | `/auth/refresh`         | Issue new access token via refresh cookie | 🍪 Refresh    |
| `POST` | `/auth/logout`          | Clear cookies & invalidate session        | 🛡️ JWT        |
| `GET`  | `/auth/profile`         | Get authenticated user profile            | 🛡️ JWT        |

### 🚗 Car Management Routes

| Method | Endpoint                    | Description                  | Auth Required |
| ------ | --------------------------- | ---------------------------- | ------------- |
| `GET`  | `/cars`                     | Get all cars                 | 🌐 Public     |
| `GET`  | `/cars/:id`                 | Get car details by ID        | 🌐 Public     |
| `GET`  | `/cars/agency/:agencyId`    | Get cars by agency ID        | 🌐 Public     |
| `POST` | `/cars/add-car`             | Add new car with images      | 🛡️ Admin      |
| `PATCH`| `/cars/:carId/edit`         | Update car details/images    | 🛡️ Admin      |
| `DELETE`| `/cars/:carId/delete`       | Delete a car                 | 🛡️ Admin      |
| `DELETE`| `/cars/:carId/images/:imageId` | Delete specific car image  | 🛡️ Admin      |

### 📝 Rental Management Routes

| Method | Endpoint             | Description                       | Auth Required |
| ------ | -------------------- | --------------------------------- | ------------- |
| `POST` | `/rental/book`       | Book a car for rental             | 🛡️ User       |
| `PATCH`| `/rental/:id/pickup` | Mark rental as picked up          | 🛡️ Admin/Agent |
| `PATCH`| `/rental/:id/return` | Record car return                 | 🛡️ Admin/Agent |
| `PATCH`| `/rental/:id/cancel` | Cancel a rental                   | 🛡️ Admin/Agent |
| `POST` | `/rental/search`     | Search available cars by dates    | 🛡️ User       |

---

## 📝 License

MIT
