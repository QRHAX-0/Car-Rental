import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Profile() {
  const queryClient = useQueryClient();

  // 1. جلب بيانات البروفايل
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

  // 2. ستيت لربط بيانات الفورم
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });

  // 3. أول ما الداتا تيجي، بنملى بيها الفورم
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

  // الميوتيشن الخاص بتحديث البيانات الشخصية
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await api.patch("/auth/profile", updatedData);
      return res.data;
    },
    onSuccess: (updatedUserData) => {
      toast.success("Profile updated successfully!");
      queryClient.setQueryData(["userProfile"], updatedUserData);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(message);
    },
  });

  // --- NEW: الميوتيشن الخاص بتغيير حالة التوثيق ---
  const toggleVerification = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/auth/toggle-verify");
      return res.data;
    },
    onSuccess: (data) => {
      // بنحدث الكاش عشان علامة الصح تظهر أو تختفي فوراً
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(
        data.isVerified ? "Account is now Verified!" : "Verification removed.",
      );
    },
    onError: () => {
      toast.error("Failed to update verification status.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <p className="text-red-500 font-bold text-lg">
          Error loading profile: {error.message}
        </p>
      </div>
    );
  }

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background px-6 font-['Plus_Jakarta_Sans']">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
            Personal Settings
          </h1>
          <p className="text-secondary text-sm mb-10">
            Manage your account details and preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="md:col-span-1 flex flex-col gap-6"
          >
            {/* الكارت الأول: كارت البيانات المختصرة والصورة */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 ambient-shadow flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center shrink-0">
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
              <h2 className="text-xl font-bold text-primary mb-1">
                {user?.name}
              </h2>
              <p className="text-sm text-secondary mb-4">{user?.email}</p>

              <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                {user?.role || "USER"}
              </span>
            </div>

            {/* --- NEW: كارت التوثيق (Account Status) --- */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 ambient-shadow flex flex-col items-center text-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 justify-center mb-2">
                Account Status
                {user?.isVerified ? (
                  <span className="material-symbols-outlined text-green-500 text-xl">
                    verified
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-amber-500 text-xl">
                    pending_actions
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {user?.isVerified
                  ? "Verified. You can book cars."
                  : "Pending. Booking restricted."}
              </p>

              <button
                onClick={() => toggleVerification.mutate()}
                disabled={toggleVerification.isPending}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                  ${
                    user?.isVerified
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                  }`}
              >
                {toggleVerification.isPending ? (
                  <span className="material-symbols-outlined animate-spin text-sm">
                    progress_activity
                  </span>
                ) : user?.isVerified ? (
                  "Revoke Verification"
                ) : (
                  "Verify Now"
                )}
              </button>
            </div>
          </motion.div>

          {/* الكارت التاني: فورم تعديل البيانات */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 ambient-shadow">
              <h3 className="text-xl font-bold text-primary mb-6">
                Account Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider flex justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      Read Only
                    </span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-5 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 outline-none transition-all text-sm font-medium cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                    placeholder="e.g. +1 234 567 890"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className={`px-8 py-4 text-white rounded-full font-label-bold text-[13px] uppercase tracking-wider transition-all shadow-xl shadow-primary/20 flex items-center gap-2
                      ${
                        updateProfileMutation.isPending
                          ? "bg-primary/70 cursor-not-allowed"
                          : "bg-primary hover:opacity-90 active:scale-95"
                      }`}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">
                          progress_activity
                        </span>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">
                          save
                        </span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
