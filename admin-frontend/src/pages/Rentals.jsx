import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/axios";
import { useState } from "react";
import BookingActionModal from "../components/bookings/BookingActionModal";
import { useAuth } from "../context/AuthContext"; // 👈 استدعاء الـ Auth

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Rentals() {
  const { user } = useAuth(); // 👈 جلب بيانات اليوزر الحالي

  // 👈 تحديد المسار بناءً على الصلاحية
  const endpoint =
    user?.role === "SUPER_ADMIN"
      ? "/super-admin/rentals"
      : "/agency-admin/rentals";

  const [selectedBooking, setSelectedBooking] = useState(null);

  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings", user?.role],
    queryFn: async () => (await api.get(endpoint)).data,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "ACTIVE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']"
      >
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Bookings
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage rentals, handovers, and returns.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 ambient-shadow overflow-hidden p-2"
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                progress_activity
              </span>
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500 font-bold bg-red-50 dark:bg-red-500/10 rounded-3xl m-4">
              Failed to load bookings.
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Ref ID
                    </th>
                    {/* 👈 عمود الشركة يظهر للـ Super Admin بس */}
                    {user?.role === "SUPER_ADMIN" && (
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Agency
                      </th>
                    )}
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Vehicle
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Dates
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {bookings?.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="px-6 py-4 font-bold text-slate-500">
                        #{booking.id.toString().padStart(5, "0")}
                      </td>

                      {/* 👈 عرض اسم الشركة للـ Super Admin */}
                      {user?.role === "SUPER_ADMIN" && (
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">
                            {booking.car.agency?.name || "N/A"}
                          </span>
                        </td>
                      )}

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {booking.customer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.customer.phoneNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                        {booking.car.brand} {booking.car.model}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                        {formatDate(booking.startDate)}{" "}
                        <span className="text-slate-300 mx-1">→</span>{" "}
                        {formatDate(booking.endDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!bookings || bookings.length === 0) && (
                    <tr>
                      <td
                        colSpan={user?.role === "SUPER_ADMIN" ? "7" : "6"}
                        className="p-16 text-center"
                      >
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-4xl text-slate-400">
                            calendar_today
                          </span>
                        </div>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          No bookings yet
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingActionModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
