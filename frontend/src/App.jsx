import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import RootLayout from "./layouts/RootLayout";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingDetails from "./pages/BookingDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cars", element: <Cars /> },
      { path: "cars/:id", element: <CarDetails /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        element: <ProtectedRoute />, // البواب بيحرس أي حاجة جواه
        children: [
          { path: "profile", element: <Profile /> },
          { path: "my-bookings", element: <MyBookings /> },
          { path: "my-bookings/:id", element: <BookingDetails /> },
        ],
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
