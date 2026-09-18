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

export default function BookingActionModal({ onClose, booking }) {
  const queryClient = useQueryClient();
  const endpoint = "/agency-admin/rentals";

  // State for Pickup (PENDING -> ACTIVE)
  // خلينا القيمة المبدئية FULL بالكابيتال
  const [pickupData, setPickupData] = useState({
    currentMileage: "",
    fuelLevel: "FULL",
  });

  // State for Return (ACTIVE -> COMPLETED)
  // خلينا القيمة المبدئية EMPTY بالكابيتال
  const [returnData, setReturnData] = useState({
    endMileage: "",
    fuelLevel: "EMPTY",
    additionalCharges: 0,
    notes: "",
  });

  // 1. Pickup Mutation (Approve)
  const pickupMutation = useMutation({
    mutationFn: async () =>
      await api.patch(`${endpoint}/${booking.id}/pickup`, {
        currentMileage: Number(pickupData.currentMileage),
        fuelLevel: pickupData.fuelLevel,
      }),
    onSuccess: () => {
      toast.success("Car handover completed. Status is now ACTIVE.");
      queryClient.invalidateQueries({ queryKey: ["agencyBookings"] });
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to process pickup"),
  });

  // 2. Return Mutation (Complete)
  const returnMutation = useMutation({
    mutationFn: async () =>
      await api.patch(`${endpoint}/${booking.id}/return`, {
        endMileage: Number(returnData.endMileage),
        fuelLevel: returnData.fuelLevel,
        additionalCharges: Number(returnData.additionalCharges),
        notes: returnData.notes,
      }),
    onSuccess: () => {
      toast.success("Car returned successfully. Booking COMPLETED.");
      queryClient.invalidateQueries({ queryKey: ["agencyBookings"] });
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to process return"),
  });

  // 3. Cancel Mutation (Reject)
  const cancelMutation = useMutation({
    mutationFn: async () => await api.patch(`${endpoint}/${booking.id}/cancel`),
    onSuccess: () => {
      toast.success("Booking has been CANCELLED.");
      queryClient.invalidateQueries({ queryKey: ["agencyBookings"] });
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to cancel booking"),
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 shrink-0 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Booking Details
              </h2>
              <span
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border 
                ${booking.status === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-200" : ""}
                ${booking.status === "ACTIVE" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
                ${booking.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}
                ${booking.status === "CANCELLED" ? "bg-red-100 text-red-700 border-red-200" : ""}`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Ref: #{booking.id.toString().padStart(5, "0")}
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

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto no-scrollbar space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Customer
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {booking.customer.name}
              </p>
              <p className="text-sm text-slate-500">{booking.customer.email}</p>
              <p className="text-sm text-slate-500">
                {booking.customer.phoneNumber}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Vehicle
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-sm text-slate-500">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </p>
              <p className="text-sm font-bold text-primary mt-1">
                Total: ${booking.totalPrice}
              </p>
            </div>
          </div>

          {/* Conditional Actions based on Status */}

          {/* 1. PENDING -> Needs Pickup Info */}
          {booking.status === "PENDING" && (
            <div className="p-5 rounded-2xl border-2 border-amber-100 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Handover Checklist (Pickup)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    Current Mileage
                  </label>
                  <input
                    type="number"
                    required
                    value={pickupData.currentMileage}
                    onChange={(e) =>
                      setPickupData({
                        ...pickupData,
                        currentMileage: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="e.g. 15000"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    Fuel Level
                  </label>
                  {/* هنا التعديل: ضفنا الـ value لكل أوبشن */}
                  <select
                    value={pickupData.fuelLevel}
                    onChange={(e) =>
                      setPickupData({
                        ...pickupData,
                        fuelLevel: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="FULL">Full</option>
                    <option value="THREE_QUARTERS">3/4</option>
                    <option value="HALF">Half</option>
                    <option value="QUARTER">1/4</option>
                    <option value="EMPTY">Empty</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. ACTIVE -> Needs Return Info */}
          {booking.status === "ACTIVE" && (
            <div className="p-5 rounded-2xl border-2 border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Return Checklist
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    End Mileage
                  </label>
                  <input
                    type="number"
                    required
                    value={returnData.endMileage}
                    onChange={(e) =>
                      setReturnData({
                        ...returnData,
                        endMileage: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. 15500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    Fuel Level
                  </label>
                  {/* وهنا كمان التعديل: ضفنا الـ value */}
                  <select
                    value={returnData.fuelLevel}
                    onChange={(e) =>
                      setReturnData({
                        ...returnData,
                        fuelLevel: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="FULL">Full</option>
                    <option value="THREE_QUARTERS">3/4</option>
                    <option value="HALF">Half</option>
                    <option value="QUARTER">1/4</option>
                    <option value="EMPTY">Empty</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    Additional Charges ($)
                  </label>
                  <input
                    type="number"
                    value={returnData.additionalCharges}
                    onChange={(e) =>
                      setReturnData({
                        ...returnData,
                        additionalCharges: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    Notes (Damages, etc.)
                  </label>
                  <input
                    type="text"
                    value={returnData.notes}
                    onChange={(e) =>
                      setReturnData({ ...returnData, notes: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Any remarks..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 flex gap-3">
          {booking.status === "PENDING" && (
            <>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="flex-1 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-bold transition-all"
              >
                Cancel / Reject
              </button>
              <button
                onClick={() => pickupMutation.mutate()}
                disabled={
                  pickupMutation.isPending || !pickupData.currentMileage
                }
                className="flex-[2] py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                Confirm Pickup (Handover)
              </button>
            </>
          )}

          {booking.status === "ACTIVE" && (
            <button
              onClick={() => returnMutation.mutate()}
              disabled={returnMutation.isPending || !returnData.endMileage}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              Mark as Returned & Completed
            </button>
          )}

          {(booking.status === "COMPLETED" ||
            booking.status === "CANCELLED") && (
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
