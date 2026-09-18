import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Overview from "./pages/Overview";
import FleetList from "./pages/FleetList";
import Agencies from "./pages/Agencies";
import Profile from "./pages/Profile";

import EmployeesList from "./components/employees/EmployeesList";
import Rentals from "./pages/Rentals";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// 2. هيكلة الـ Router بالمعايير اللي إنت طلبتها
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "SUPER_ADMIN"]} />
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: "fleet", element: <FleetList /> },
          { path: "rentals", element: <Rentals /> },
          { path: "staff", element: <EmployeesList /> },
          { path: "agencies", element: <Agencies /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <div className="p-8 text-center text-red-500 font-h3">
        Unauthorized Access!
      </div>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl",
            duration: 4000,
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: "600",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
