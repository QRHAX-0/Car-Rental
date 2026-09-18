import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: async (userEmail) => {
      const res = await api.post("/auth/forgot-password", { email: userEmail });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent to your email!");
      setEmail("");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative flex items-center justify-center p-4 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Premium Background Elements (عشان تبقى شبه صفحة اللوجين) */}
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
            {/* أيقونة متناسقة مع الأدمين بانل */}
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">
                lock_reset
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Reset Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your email and we'll send you a secure reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Admin Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luxe.com"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* 👈 التوجيه لصفحة اللوجين */}
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
