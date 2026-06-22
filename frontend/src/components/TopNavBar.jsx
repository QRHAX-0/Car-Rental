import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/utils/api";

// إعدادات الـ API عشان نكلم الباك إند ونبعت الكوكيز

const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TopNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const queryClient = useQueryClient();

  // 1. جلب بيانات اليوزر من الباك إند
  const { data: userProfile, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get("/auth/profile");
      return res.data;
    },
    retry: false, // لو مش مسجل دخول، متعملش ريكويستات تانية
  });

  // تحديد هل اليوزر موجود فعلاً ولا لأ
  const user = !isError && userProfile ? userProfile : null;

  const openLogin = () => {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
  };

  // 2. دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // بنكلم مسار الـ logout في الباك
      queryClient.setQueryData(["userProfile"], null); // بنفضي الكاش فوراً
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close modal on navigation
  useEffect(() => {
    setIsAuthModalOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center font-['Plus_Jakarta_Sans'] tracking-tight">
          <div className="flex items-center gap-12">
            <Link
              className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-slate-50"
              to="/"
            >
              LUXE
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                className={`font-semibold pb-1 hover:opacity-90 transition-all duration-300 ${currentPath === "/" ? "text-slate-900 dark:text-slate-50 border-b-2 border-slate-900 dark:border-slate-50" : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"}`}
                to="/"
              >
                Home
              </Link>
              <Link
                className={`font-semibold pb-1 hover:opacity-90 transition-all duration-300 ${currentPath === "/cars" ? "text-slate-900 dark:text-slate-50 border-b-2 border-slate-900 dark:border-slate-50" : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"}`}
                to="/cars"
              >
                Fleet
              </Link>
              <Link
                className={`font-semibold pb-1 hover:opacity-90 transition-all duration-300 ${currentPath === "/my-bookings" ? "text-slate-900 dark:text-slate-50 border-b-2 border-slate-900 dark:border-slate-50" : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"}`}
                to="/my-bookings"
              >
                My Bookings
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* 3. اللوجيك الديناميكي بتاع عرض الزراير أو البروفايل */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">
                      person
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {user.name || "Profile"}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all flex items-center justify-center"
                    title="Logout"
                  >
                    <span className="material-symbols-outlined text-xl">
                      logout
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium px-4 py-2 transition-colors active:scale-95"
                  >
                    Login
                  </button>
                  <button
                    onClick={openRegister}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
