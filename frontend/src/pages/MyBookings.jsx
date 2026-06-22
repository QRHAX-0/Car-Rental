import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BookingCard from "../components/BookingCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api"; // مسار الـ api بتاعك

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function MyBookings() {
  // جلب حجوزات اليوزر من الباك إند
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      // ملحوظة: اتأكد إن المسار ده موجود في NestJS وبيعرض حجوزات اليوزر اللي عامل لوجين
      const res = await api.get("/rental/my-bookings");
      return res.data;
    },
  });

  // شاشة التحميل عشان مفيش حاجة تضرب
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  // في حالة حصول خطأ
  if (isError) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
        <p className="text-red-500 font-body-lg mb-4">
          Failed to load your bookings.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#f8fafc] dark:bg-slate-950 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-primary font-bold text-[11px] uppercase tracking-wider mb-4 border border-emerald-100 dark:border-emerald-900/30">
            Account Activity
          </span>
          <h1 className="font-h1 text-4xl md:text-5xl text-slate-900 dark:text-white mb-4 tracking-tight">
            My Bookings
          </h1>
          <p className="font-body-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Manage your current and upcoming luxury experiences. Review details,
            track status, or modify your reservations here.
          </p>
        </motion.div>

        {/* لو فيه حجوزات نعرضها، لو مفيش نعرض الـ Empty State */}
        {bookings.length > 0 ? (
          <div className="space-y-6 mb-16">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-3xl">
                  calendar_today
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                You have no bookings yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Looking for your next adventure? Explore our curated fleet of
                world-class vehicles.
              </p>
              <Link
                to="/cars"
                className="inline-block bg-primary text-white px-10 py-4 rounded-full font-label-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Explore Fleet
              </Link>

              <div className="flex flex-wrap justify-center gap-6 mt-12 opacity-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    24/7 Concierge
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    verified_user
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Fully Insured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    local_shipping
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Doorstep Delivery
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
