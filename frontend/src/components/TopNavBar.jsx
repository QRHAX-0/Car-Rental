import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TopNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: userProfile, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get("/auth/profile");
      return res.data;
    },
    retry: false,
  });

  const user = !isError && userProfile ? userProfile : null;

  const openLogin = () => {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); 
  };

  const openRegister = () => {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      queryClient.setQueryData(["userProfile"], null);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    setIsAuthModalOpen(false);
    setIsMobileMenuOpen(false);
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

          {/* أخفينا الجزء ده في الموبايل عشان هيتحط في القائمة */}
          <div className="hidden md:flex items-center gap-6">
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

         
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-600 dark:text-slate-300 p-2 focus:outline-none"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                <Link
                  className={`font-semibold py-2 transition-all duration-300 ${currentPath === "/" ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className={`font-semibold py-2 transition-all duration-300 ${currentPath === "/cars" ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  to="/cars"
                >
                  Fleet
                </Link>
                <Link
                  className={`font-semibold py-2 transition-all duration-300 ${currentPath === "/my-bookings" ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  to="/my-bookings"
                >
                  My Bookings
                </Link>

                <div className="h-px bg-slate-200/50 dark:bg-slate-800/50 my-2"></div>

                {user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/profile"
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
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
                      className="flex items-center justify-center gap-2 px-4 py-2 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">
                        logout
                      </span>
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={openLogin}
                      className="w-full text-slate-700 dark:text-slate-300 font-medium px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={openRegister}
                      className="w-full bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/10"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
