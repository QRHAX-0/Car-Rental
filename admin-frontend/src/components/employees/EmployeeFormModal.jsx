import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function EmployeeFormModal({ onClose, employeeToEdit }) {
  const queryClient = useQueryClient();
  const isEditing = !!employeeToEdit;

  // هنفترض إن الـ Endpoints بتاعتك كده
  const endpoint = "/agency-admin/staff";

  const [formData, setFormData] = useState({
    name: employeeToEdit?.name || "",
    email: employeeToEdit?.email || "",
    password: "", // الباسورد فاضي دايماً، بنملاه في حالة الإضافة بس
    phoneNumber: employeeToEdit?.phoneNumber || "",
    role: employeeToEdit?.role || "AGENT",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        return await api.patch(`${endpoint}/${employeeToEdit.id}`, payload);
      } else {
        return await api.post(endpoint, payload);
      }
    },
    onSuccess: () => {
      toast.success(
        `Employee ${isEditing ? "updated" : "added"} successfully!`,
      );
      queryClient.invalidateQueries({ queryKey: ["agencyEmployees"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };
    // لو بنعدل ومكتبش باسورد جديد، نمسحه من الـ payload عشان منغيروش
    if (isEditing && !payload.password) {
      delete payload.password;
    }

    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 z-10 flex flex-col"
      >
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {isEditing ? "Edit Employee" : "Add New Employee"}
              </h2>
              <p className="text-sm text-slate-500">
                Manage access and roles for your agency team.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-slate-50 dark:bg-slate-800/50"
            >
              <span className="material-symbols-outlined text-slate-500">
                close
              </span>
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto">
          <form
            id="employee-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {isEditing
                  ? "New Password (leave empty to keep current)"
                  : "Password"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
              >
                <option value="AGENT">Agent (Process Bookings)</option>
                <option value="ADMIN">Admin (Full Access)</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="submit"
            form="employee-form"
            disabled={mutation.isPending}
            className={`w-full py-4 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 ${mutation.isPending ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:opacity-90 active:scale-95"}`}
          >
            {mutation.isPending ? (
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined">save</span>
            )}
            {mutation.isPending
              ? "Saving..."
              : isEditing
                ? "Update Employee"
                : "Add Employee"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
