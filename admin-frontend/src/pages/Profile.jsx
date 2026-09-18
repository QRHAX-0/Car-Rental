import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios"; // مسار الـ axios في مشروع الأدمن

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Profile() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get("/auth/profile"); 
      return res.data;
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await api.patch("/auth/profile", updatedData);
      return res.data;
    },
    onSuccess: (updatedUserData) => {
      toast.success("Admin profile updated successfully!");
      queryClient.setQueryData(["userProfile"], updatedUserData);
      // بنعمل ريفريش للـ AuthContext كمان عشان الاسم يتحدث في الـ Sidebar
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500 font-bold text-lg bg-red-50 p-6 rounded-2xl">
          Error loading profile: {error.message}
        </p>
      </div>
    );
  }

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Admin Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">
          Manage your workspace preferences and personal details.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          {/* Admin Info Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 ambient-shadow flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-primary/10 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {avatarInitial}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {user?.name || "Admin"}
            </h2>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900">
              {user?.role?.replace("_", " ")}
            </span>
          </div>

          {/* Admin Status Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 ambient-shadow flex flex-col items-center text-center">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 justify-center mb-2">
              Workspace Access
              <span className="material-symbols-outlined text-emerald-500 text-xl">
                verified_user
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Your administrative privileges are active and secured.
            </p>

            <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Security Level
              </p>
              <p className="font-bold text-primary text-sm flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  lock
                </span>
                {user?.role === "SUPER_ADMIN"
                  ? "Level 1 (Unrestricted)"
                  : "Level 2 (Agency)"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Update Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 ambient-shadow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Account Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Email Address</span>
                  <span className="text-[9px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    Read Only
                  </span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    mail
                  </span>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none text-slate-500 outline-none transition-all text-sm font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    call
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                    placeholder="e.g. +1 234 567 890"
                  />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className={`px-8 py-4 text-white rounded-2xl font-bold text-[13px] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2
                    ${updateProfileMutation.isPending ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:opacity-90 active:scale-95"}`}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        progress_activity
                      </span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        save
                      </span>
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
