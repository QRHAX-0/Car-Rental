# LUXE Car Rental Management System

LUXE is a full-stack car rental platform designed to modernize the way customers discover, book, and manage rentals through a polished digital experience. The project solves the challenge of bringing together a responsive customer-facing interface, a secure authentication layer, and a robust backend for vehicle and booking management in a single, cohesive product.

As a portfolio project, LUXE demonstrates end-to-end product engineering: from a React-driven frontend and a NestJS API to a relational PostgreSQL database and production-ready deployment considerations.

---

## 🌐 Project Overview

The LUXE platform provides a complete rental experience for users and administrators. Customers can browse vehicles, explore listings, sign in with Google, and manage their account, while the backend ensures that rental records, inventory data, and auth sessions stay consistent and secure.

This system is built to reflect the real-world needs of a modern SaaS-style application: clean UX, secure session handling, scalable API structure, and maintainable database design.

---

## 🏗️ Architecture Overview

LUXE follows a modern three-tier architecture:

- Frontend: React + Vite + Tailwind CSS
- Backend: NestJS + TypeScript + Prisma
- Database: PostgreSQL (Neon DB)

### Flow

1. The React frontend renders the user interface and handles client-side interactions.
2. The NestJS backend exposes RESTful API endpoints for authentication, cars, and rentals.
3. Prisma connects the application to PostgreSQL and ensures type-safe database access.
4. Secure cookies and JWT-based session handling allow authenticated users to stay signed in across cross-origin deployments.

---

## ✨ Key Features

- Google OAuth authentication for fast, secure sign-in.
- Local authentication with JWT access and refresh tokens.
- Protected routes and role-based access control.
- Car inventory management with image support.
- Rental workflows including booking, pickup, return, and cancellation.
- Prisma-powered database schema with relational modeling for users, cars, rentals, and agencies.
- Responsive, minimalist UI with a dark, premium aesthetic.

---

## 🔧 Technical Highlights

### Cross-Origin Session Management

One of the most important engineering challenges in this project was enabling secure authentication across separate frontend and backend deployments. The application uses cookie-based auth with `SameSite=None` and `Secure=true` so that sessions work correctly when the React client and NestJS API are hosted on different origins, including Vercel deployments.

### React Query for Client State

The frontend uses React Query (TanStack Query) for efficient server-state handling. It provides:

- Caching for API results
- Background refetching and query invalidation
- Seamless UI updates after authentication and profile changes

### Prisma + PostgreSQL Data Layer

The backend uses Prisma ORM to define and evolve a structured database schema. This improves maintainability, type safety, and developer productivity while keeping relational data modeling clear and consistent.

---

## 📁 Repository Structure

```text
LUXE/
├── frontend/   # React + Vite client application
└── backend/    # NestJS API and Prisma data layer
```

---

## 📚 Documentation

For detailed setup and implementation guides, please visit:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

---

## 🚀 Live Deployments

- Frontend: https://luxe-car-rental.vercel.app/
- Backend API: https://luxe-car-rental-api.vercel.app/

---

## 🧠 Summary

LUXE represents a full-stack product built with modern web technologies, secure authentication, and a maintainable architecture. It reflects a strong focus on user experience, backend reliability, and deployment-minded engineering decisions.
