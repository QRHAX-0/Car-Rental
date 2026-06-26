# LUXE Car Rental Frontend

A modern React client for the LUXE Car Rental System. This minimal, dark-themed UI is built with Vite, Tailwind CSS, and Axios to provide a polished rental experience while communicating securely with the NestJS backend.

---

## 📋 Project Overview

LUXE is a lightweight and elegant frontend for browsing cars, booking rentals, and managing customer profiles. The UI emphasizes a clean, minimalist dark aesthetic with intuitive navigation and responsive layout.

Key client features:

- Home and car discovery with a modern visual experience.
- Booking and rental management flows.
- Authentication and profile pages.
- Integrated notifications and feedback.

---

## 🛠️ Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| UI Framework     | React                        |
| Build Tool       | Vite                         |
| Styling          | Tailwind CSS                 |
| HTTP Client      | Axios                        |
| State Management | React Query (TanStack Query) |
| Routing          | React Router DOM             |
| Animation        | Framer Motion                |

---

## ⚡ Data Fetching & Server State

The frontend uses React Query to manage API requests, cache responses, and keep the UI in sync with backend state.

- `QueryClientProvider` is initialized in `src/main.jsx` to provide React Query across the app.
- `useQuery` is used to fetch data such as car listings, rental details, and the authenticated user's profile.
- `useMutation` is used for login, registration, profile updates, password actions, and rental changes.
- After successful mutations, the app either invalidates queries or updates cached data directly.

Example workflow:

- Logging in triggers a mutation in `AuthModal.jsx`.
- On success, `queryClient.invalidateQueries({ queryKey: ["userProfile"] })` refreshes profile data.
- Updating the profile in `Profile.jsx` uses `queryClient.setQueryData(["userProfile"], updatedUserData)` to instantly update the UI without a full page reload.

This approach delivers a seamless user experience by keeping auth and profile state fresh while minimizing unnecessary network requests.

---

## 🔌 Backend Integration

The frontend connects to the NestJS backend using Axios with a shared API instance configured for cross-origin credentials.

The API client is defined in `src/utils/api.js`:

```js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

This ensures that browser requests include cookies, enabling secure JWT authentication and refresh flows when the backend is on a different domain.

### Auth & Session Handling

- `withCredentials: true` allows the frontend to send and receive cookies from the backend.
- The backend may issue `access_token` and `refresh_token` cookies after login.
- The frontend reuses the same Axios instance for authenticated requests.

---

## 🚀 Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app will typically start at `http://localhost:5174`.

### 3. Environment variables

If the project uses a `.env` file, configure your backend API URL:

```env
VITE_API_URL=http://localhost:3000
```

---

## ☁️ Deployment on Vercel

This frontend is configured for Vercel deployment with a fallback route so client-side routing works correctly.

The `vercel.json` file includes a catch-all rewrite:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Vercel Deployment Notes

- Set `VITE_API_URL` in Vercel environment variables to point to the deployed backend.
- Ensure the backend allows CORS for the deployed frontend origin.
- `withCredentials: true` must be supported by both frontend and backend domains.

---

## 📂 Project Structure

```
src/
├── components/    # reusable UI components
├── layouts/       # shared layout components
├── pages/         # route-based views
├── utils/         # API client and utilities
├── App.jsx        # app routes and initialization
├── main.jsx       # entry point
└── index.css      # global styles
```

---

## 📌 Notes

- The frontend uses Tailwind CSS for rapid styling and responsive layouts.
- The app is designed to work with a NestJS backend that issues secure cookies and supports cross-origin requests.
- For production, make sure both frontend and backend are served over HTTPS.
