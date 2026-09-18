import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios"; // 👈 توحيد مسار الـ API

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordMutation = useMutation({
    mutationFn: async (resetData) => {
      const res = await api.post("/auth/reset-password", resetData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      // 👈 التوجيه الصح هنا للـ login مش الروت
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Link invalid or expired.";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token || !email) {
      return toast.error("Invalid password reset link.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    resetPasswordMutation.mutate({
      email,
      token,
      newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative flex items-center justify-center p-4 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Premium Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 z-10"
      >
        <div className="p-8 pt-12">
          <div className="mb-8 text-center">
            {/* أيقونة الأمان */}
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">
                enhanced_encryption
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Create New Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Please enter your new secure password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  lock
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  lock_check
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* التوجيه لصفحة اللوجين لو حب يرجع */}
          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Premium Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-primary opacity-50" />
      </motion.div>
    </div>
  );
}
