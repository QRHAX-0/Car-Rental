import React, { useState } from "react";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; // استيراد الميوتيشن

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  // بناء الميوتيشن
  const forgotPasswordMutation = useMutation({
    mutationFn: async (userEmail) => {
      const res = await api.post("/auth/forgot-password", { email: userEmail });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent to your email!");
      setEmail(""); // تفريغ الخانة بعد النجاح
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // تشغيل الميوتيشن
    forgotPasswordMutation.mutate(email);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 font-['Plus_Jakarta_Sans']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Forgot Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending} // استخدام isPending
            className={`w-full py-4 text-white rounded-full font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2
              ${forgotPasswordMutation.isPending ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:opacity-90 active:scale-95"}`}
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
