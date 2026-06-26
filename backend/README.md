# LUXE Car Rental Backend API

A professional NestJS backend for the LUXE Car Rental Management System. This API powers vehicle inventory management, rental workflows, authentication, and user profile handling.

---

## 📋 Project Overview

The LUXE backend is built with NestJS and Prisma to provide a modular, maintainable service for rental operations. It handles:

- Car inventory management with CRUD endpoints and image handling.
- Booking lifecycle workflows for pickup, return, and cancellation.
- Local and Google OAuth authentication with secure JWT cookie handling.
- Role-based access control for Admin and User permissions.
- Cross-origin deployment compatibility for isolated frontend/backend hosting.

### Architecture

- **Modules:** `auth`, `cars`, `rental`, `prisma`, and shared `common` utilities.
- **Auth Layer:** Passport strategies for local login, JWT access/refresh tokens, and Google OAuth.
- **Database Layer:** Prisma ORM for type-safe schema and query generation.
- **Deployment:** backend configured for secure cross-site cookies and Vercel-compatible frontend integration.

---

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Runtime        | Node.js                            |
| Framework      | NestJS                             |
| Language       | TypeScript                         |
| ORM            | Prisma                             |
| Database       | PostgreSQL (Neon DB)               |
| Authentication | Passport.js, JWT, Google OAuth     |
| Validation     | class-validator, class-transformer |
| Testing        | Jest                               |
| Linting        | ESLint, Prettier                   |

---

## 🔐 Authentication Details

### Google OAuth 2.0 Flow

Google sign-in is implemented using Passport's `passport-google-oauth20` strategy.

1. The frontend redirects the user to `GET /auth/google`.
2. Passport sends the user to Google's consent screen.
3. Google returns authorization data to `/auth/google/callback`.
4. `GoogleStrategy` validates the profile and constructs a user payload.
5. The backend issues `access_token` and `refresh_token` cookies.
6. The user is redirected back to the frontend.

This flow allows user login via Google while keeping authentication state managed server-side.

### Cross-Origin Cookie Support

Cookies are configured in `src/auth/auth.controller.ts` with:

- `httpOnly: true` — prevents JavaScript access.
- `secure: true` — only sent over HTTPS.
- `sameSite: 'none'` — allows cookies in cross-origin requests.
- `path` set explicitly for `/` and `/auth/refresh`.

This configuration is required for isolated deployments where the frontend and backend are hosted on separate domains, such as Vercel-hosted frontend and a separate backend origin.

---

## 📦 Local Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Add a `.env` file in the backend root using the variables below.

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Push schema to Neon DB

```bash
npx prisma db push
```

For migration-based workflows:

```bash
npx prisma migrate deploy
```

### 5. Start the server

```bash
npm run start:dev
```

Open `http://localhost:3000` to confirm the backend is running.

---

## 🌍 Environment Variables

Use the following dummy values in your `.env` file:

| Variable               | Description                              | Example                                             |
| ---------------------- | ---------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL`         | Neon PostgreSQL connection string        | `postgresql://user:password@db.neon.tech:5432/luxe` |
| `JWT_SECRET`           | Secret for signing JWT access tokens     | `supersecret_jwt_key`                               |
| `JWT_EXPIRATION`       | Access token lifetime in seconds         | `900`                                               |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                   | `12345-abcdef.apps.googleusercontent.com`           |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret               | `GOOGLE_SECRET_VALUE`                               |
| `BACKEND_URL`          | Backend origin for OAuth callback        | `https://api.luxe.example.com`                      |
| `FRONTEND_URL`         | Frontend origin for redirect after login | `https://luxe.example.com`                          |
| `NODE_ENV`             | Application runtime environment          | `development`                                       |
| `PORT`                 | HTTP port for the NestJS server          | `3000`                                              |

Example `.env`:

```env
DATABASE_URL=postgresql://user:password@db.neon.tech:5432/luxe
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRATION=900
GOOGLE_CLIENT_ID=12345-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOOGLE_SECRET_VALUE
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
PORT=3000
```

---

## ▶️ Running the Application

```bash
npm run start:dev
```

Other useful scripts:

```bash
npm run build
npm run start:prod
npm run lint
npm run test
npm run test:e2e
```

---

## 📂 Project Structure

```text
src/
├── auth/          # authentication controllers, guards, strategies, dtos
├── cars/          # car inventory module, controller, service, dtos
├── rental/        # rental workflow module and business logic
├── common/        # shared decorators, guards, interfaces, utils
├── prisma/        # Prisma integration service
├── app.module.ts  # root module wiring the application
└── main.ts        # app bootstrap and CORS configuration
```

---

## 🔑 API Overview

### Authentication

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| `GET`  | `/auth/google`          | Start Google OAuth flow                 |
| `GET`  | `/auth/google/callback` | Handle Google OAuth response            |
| `POST` | `/auth/register`        | Register user and set auth cookies      |
| `POST` | `/auth/login`           | Login and set auth cookies              |
| `POST` | `/auth/refresh`         | Refresh access token via refresh cookie |
| `POST` | `/auth/logout`          | Clear auth cookies and logout           |
| `GET`  | `/auth/profile`         | Fetch authenticated user profile        |

### Car Management

| Method   | Endpoint                       | Description                      |
| -------- | ------------------------------ | -------------------------------- |
| `GET`    | `/cars`                        | List all available cars          |
| `GET`    | `/cars/:id`                    | Get car details by ID            |
| `GET`    | `/cars/agency/:agencyId`       | List cars by agency              |
| `POST`   | `/cars/add-car`                | Add a new car (admin only)       |
| `PATCH`  | `/cars/:carId/edit`            | Update car data (admin only)     |
| `DELETE` | `/cars/:carId/delete`          | Delete a car record (admin only) |
| `DELETE` | `/cars/:carId/images/:imageId` | Delete a car image (admin only)  |

### Rental Management

| Method  | Endpoint             | Description                    |
| ------- | -------------------- | ------------------------------ |
| `POST`  | `/rental/book`       | Book a car rental              |
| `PATCH` | `/rental/:id/pickup` | Mark rental as picked up       |
| `PATCH` | `/rental/:id/return` | Mark rental as returned        |
| `PATCH` | `/rental/:id/cancel` | Cancel a rental order          |
| `POST`  | `/rental/search`     | Search available cars by dates |

---

## 📌 Notes

- CORS is enabled for the local frontend and deployed Vercel frontend origins.
- The backend uses `SameSite=None` and `Secure=true` cookie settings to support cross-domain auth.
- Neon DB is the recommended PostgreSQL service for production hosting.

---

## 📝 License

MIT
