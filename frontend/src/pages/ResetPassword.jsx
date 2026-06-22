import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query"; // استيراد الميوتيشن

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // بناء الميوتيشن
  const resetPasswordMutation = useMutation({
    mutationFn: async (resetData) => {
      const res = await api.post("/auth/reset-password", resetData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      // توجيه اليوزر لصفحة الرئيسية عشان يسجل دخول بالجديد
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Link invalid or expired.";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    // تشغيل الميوتيشن وبعت الداتا كـ Object
    resetPasswordMutation.mutate({
      email,
      token,
      newPassword,
    });
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
            Reset Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please enter your new secure password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className={`w-full py-4 text-white rounded-full font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2
              ${resetPasswordMutation.isPending ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:opacity-90 active:scale-95"}`}
          >
            {resetPasswordMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
                Updating Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
