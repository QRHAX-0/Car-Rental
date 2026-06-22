import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

const getStatusStyles = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "ACTIVE":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PENDING":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "CANCELLED":
      return "bg-slate-100 text-slate-500 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export default function BookingCard({ booking }) {
  const { id, startDate, endDate, totalPrice, status, car } = booking;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const carName = `${car.brand} ${car.model}`;
  const image =
    car.images?.length > 0
      ? car.images[0].image
      : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80";

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch(`/rental/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries(["myBookings"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to cancel booking";
      toast.error(message);
    },
  });

  const handleCancel = () => {
    if (
      window.confirm(
        `Are you sure you want to cancel your booking for ${carName}?`,
      )
    ) {
      cancelMutation.mutate();
    }
  };

  const handleDetailsClick = () => {
    navigate(`/my-bookings/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 flex flex-col md:flex-row gap-8 ambient-shadow hover:shadow-xl transition-all duration-500 group"
    >
      <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden rounded-2xl shrink-0">
        <img
          src={image}
          alt={carName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="flex flex-col justify-between flex-grow py-2">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(status)} mb-4`}
          >
            {status.toLowerCase()}
          </span>
          <h3 className="font-h3 text-2xl text-slate-900 dark:text-white mb-1">
            {carName}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">
            {car.category} • {car.year}
          </p>
          {/* --- NEW: إضافة اسم الشركة المنفذة --- */}
          {car.agency && (
            <p className="text-xs text-primary/80 dark:text-primary/60 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">
                storefront
              </span>
              {car.agency.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-6 md:mt-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Duration
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatDateTime(startDate)}{" "}
              <span className="mx-2 text-slate-300">→</span>{" "}
              {formatDateTime(endDate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Total Price
            </span>
            <span className="text-lg font-bold text-primary">
              ${Number(totalPrice).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3 shrink-0 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-10">
        {status === "PENDING" && (
          <button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className={`w-full md:px-8 py-4 rounded-full font-label-bold text-[13px] uppercase tracking-wider transition-all flex items-center justify-center gap-2
              ${
                cancelMutation.isPending
                  ? "text-slate-400 bg-slate-50 cursor-not-allowed"
                  : "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
              }`}
          >
            {cancelMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">
                  progress_activity
                </span>
                Cancelling
              </>
            ) : (
              "Cancel"
            )}
          </button>
        )}

        <button
          onClick={handleDetailsClick}
          className="w-full md:px-8 py-4 rounded-full font-label-bold text-[13px] uppercase tracking-wider bg-primary text-white hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          Details
        </button>
      </div>
    </motion.div>
  );
}
