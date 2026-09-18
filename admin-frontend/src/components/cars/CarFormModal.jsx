import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

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

export default function CarFormModal({ onClose, carToEdit }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!carToEdit;

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const endpoint = isSuperAdmin ? "/super-admin/cars" : "/agency-admin/cars";

  const { data: agencies } = useQuery({
    queryKey: ["allAgencies"],
    queryFn: async () => (await api.get("/super-admin/agencies")).data,
    enabled: isSuperAdmin,
  });

  const [formData, setFormData] = useState({
    brand: carToEdit?.brand || "",
    model: carToEdit?.model || "",
    year: carToEdit?.year || new Date().getFullYear(),
    category: carToEdit?.category || "SEDAN",
    seatingCapacity: carToEdit?.seatingCapacity || 5,
    fuelType: carToEdit?.fuelType || "Petrol",
    transmission: carToEdit?.transmission || "AUTOMATIC",
    mileage: carToEdit?.mileage || 0,
    pricePerDay: carToEdit?.pricePerDay || "",
    location: carToEdit?.location || "",
    description: carToEdit?.description || "",
    isAvailable: carToEdit?.isAvailable ?? true,
    agencyId: carToEdit?.agencyId || "",
  });

  // الـ State الجديدة الخاصة بالصور
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // دوال التعامل مع الصور
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      // بما إننا بنبعت صور، لازم نحدد الـ Headers عشان Axios يفهم إنه بيرفع ملفات
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEditing) {
        return await api.patch(`${endpoint}/${carToEdit.id}`, payload, config);
      } else {
        return await api.post(endpoint, payload, config);
      }
    },
    onSuccess: () => {
      toast.success(`Vehicle ${isEditing ? "updated" : "added"} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["fleetCars"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSuperAdmin && !formData.agencyId) {
      return toast.error("Please select an agency for this vehicle.");
    }

    // تجهيز الـ FormData عشان نشيل الداتا والصور مع بعض
    const submitData = new FormData();
    submitData.append("brand", formData.brand);
    submitData.append("model", formData.model);
    submitData.append("year", Number(formData.year));
    submitData.append("category", formData.category);
    submitData.append("seatingCapacity", Number(formData.seatingCapacity));
    submitData.append("fuelType", formData.fuelType);
    submitData.append("transmission", formData.transmission);
    submitData.append("mileage", Number(formData.mileage));
    submitData.append("pricePerDay", Number(formData.pricePerDay));
    submitData.append("location", formData.location);
    submitData.append("description", formData.description);
    submitData.append("isAvailable", formData.isAvailable); // هتبعت كـ String "true" أو "false"

    if (isSuperAdmin) {
      submitData.append("agencyId", Number(formData.agencyId));
    }

    // رفع الصور (لو اختار صور)
    selectedFiles.forEach((file) => {
      submitData.append("images", file);
    });

    mutation.mutate(submitData);
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
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {isEditing ? "Edit Vehicle Details" : "Add New Vehicle"}
              </h2>
              <p className="text-sm text-slate-500">
                Provide all necessary specifications and photos.
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

        {/* Scrollable Form Body */}
        <div className="p-8 overflow-y-auto no-scrollbar">
          <form id="car-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Agency Selection */}
            {isSuperAdmin && (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-6">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2 block">
                  Assign to Agency *
                </label>
                <select
                  name="agencyId"
                  value={formData.agencyId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="" disabled>
                    Select Agency...
                  </option>
                  {agencies?.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Year & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="LUXURY">Luxury</option>
                  <option value="SPORTS">Sports</option>
                  <option value="VAN">Van</option>
                </select>
              </div>
            </div>

            {/* Transmission & Fuel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Fuel Type
                </label>
                <input
                  type="text"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Capacity & Mileage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Mileage (KM)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Price Per Day ($)
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white resize-none"
              ></textarea>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 accent-primary cursor-pointer rounded-md"
              />
              <label
                htmlFor="isAvailable"
                className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer select-none"
              >
                Available for Booking
              </label>
            </div>

            {/* Image Upload UI */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Vehicle Images
              </label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                  cloud_upload
                </span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Click or drag images here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <button
            type="submit"
            form="car-form"
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
                ? "Save Changes"
                : "Add Vehicle"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
