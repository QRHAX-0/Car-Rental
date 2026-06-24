import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  // 2. تعريف Mutations
  const loginMutation = useMutation({
    mutationFn: (data) => api.post("/auth/login", data),

    onSuccess: (response) => {
      toast.success("Welcome back to LUXE!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onClose();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data) => api.post("/auth/register", data),
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      setMode("login");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "login") {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      registerMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-slate-500">
                close
              </span>
            </button>

            <div className="p-8 pt-12">
              <div className="mb-8">
                <motion.h2
                  key={mode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight"
                >
                  {mode === "login" ? "Welcome Back" : "Join LUXE"}
                </motion.h2>
                <motion.p
                  key={`${mode}-p`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-500 dark:text-slate-400"
                >
                  {mode === "login"
                    ? "Experience the pinnacle of luxury car rentals."
                    : "Start your journey with our premium fleet."}
                </motion.p>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === "login" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === "register" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Register
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {mode === "register" && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                          person
                        </span>
                        <input
                          value={formData.name}
                          onChange={handleFormData}
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                      mail
                    </span>
                    <input
                      type="email"
                      onChange={handleFormData}
                      value={formData.email}
                      name="email"
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                      lock
                    </span>
                    <input
                      onChange={handleFormData}
                      value={formData.password}
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button" // مهمة جداً عشان ميدخلش في الـ Submit بتاع الفورم
                      onClick={() => {
                        onClose(); // نقفل المودال
                        navigate("/forgot-password"); // نروح لصفحة الاستعادة
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all active:scale-[0.98] mt-4">
                  {mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-bold">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-200"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  Google
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="ml-2 font-bold text-slate-900 dark:text-white hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-primary opacity-30" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
