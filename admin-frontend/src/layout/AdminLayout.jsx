import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  // السايدبار مقفول كديفولت في الموبايل، ومفتوح في الديسكتوب
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // داخل AdminLayout.jsx
  const navLinks = [
    { name: "Overview", path: "/", icon: "dashboard" },
    { name: "Fleet Management", path: "/fleet", icon: "directions_car" },
    { name: "Rentals & Bookings", path: "/rentals", icon: "car_rental" },
    // الـ Staff يظهر للأدمن فقط
    ...(user?.role === "ADMIN"
      ? [{ name: "Staff & Agents", path: "/staff", icon: "badge" }]
      : []),
    // الـ Agencies يظهر للسوبر أدمن فقط
    ...(user?.role === "SUPER_ADMIN"
      ? [{ name: "Agencies", path: "/agencies", icon: "corporate_fare" }]
      : []),
  ];

  // دالة لقفل السايدبار في الموبايل فقط لما تضغط على لينك
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-['Plus_Jakarta_Sans'] overflow-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* Mobile Overlay (Unmounts, so it needs AnimatePresence) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Premium Sidebar - Pure Tailwind Responsive Logic */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full z-50 flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 ease-in-out shrink-0
          ${
            isSidebarOpen
              ? "translate-x-0 w-[280px]"
              : "-translate-x-full md:translate-x-0 md:w-[88px]"
          }
        `}
      >
        <div className="h-24 flex items-center px-8 border-b border-slate-100 dark:border-slate-800/50 overflow-hidden shrink-0">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3 shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">
              workspace_premium
            </span>
          </div>
          <span
            className={`text-xl font-bold tracking-tighter text-slate-900 dark:text-white whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen ? "md:opacity-0 md:hidden" : "opacity-100"}`}
          >
            LUXE<span className="text-primary">.</span>Admin
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          <p
            className={`text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-4 ${!isSidebarOpen && "md:text-center"}`}
          >
            {isSidebarOpen ? (
              "Main Menu"
            ) : (
              <span className="md:hidden">Main Menu</span>
            )}
            {!isSidebarOpen && <span className="hidden md:inline">Menu</span>}
          </p>

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={handleLinkClick}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-colors duration-300 group overflow-hidden
                ${
                  isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-white/10"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }
              `}
            >
              <span
                className={`material-symbols-outlined text-xl shrink-0 ${!isSidebarOpen && "md:mx-auto"}`}
              >
                {link.icon}
              </span>
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen ? "md:opacity-0 md:hidden" : "opacity-100"}`}
              >
                {link.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 shrink-0">
          <Link
            to="/profile"
            onClick={handleLinkClick}
            className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md cursor-pointer group overflow-hidden ${!isSidebarOpen && "md:justify-center md:p-2"}`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-105">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div
              className={`flex-1 text-left whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen ? "md:opacity-0 md:hidden" : "opacity-100"}`}
            >
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 font-medium truncate">
                {user?.email}
              </p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <header className="h-24 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10 shrink-0 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-xl leading-none">
                menu_open
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
                System Online
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full font-bold text-sm transition-colors border border-slate-200/50 dark:border-slate-800/50 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
