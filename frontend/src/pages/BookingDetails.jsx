import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { motion } from "framer-motion";

export default function BookingDetails() {
  const { id } = useParams();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const res = await api.get(`/rental/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-12 transition-colors group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
            west
          </span>
          <span className="font-label-bold text-sm uppercase tracking-wider">
            Back to my bookings
          </span>
        </Link>

        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl font-bold text-primary">Booking #{id}</h1>
            <div className="text-right bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <p className="text-secondary text-xs uppercase font-label-bold mb-1">
                Total Price
              </p>
              <p className="text-2xl font-bold text-primary">
                ${booking.totalPrice}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <p className="text-secondary text-sm uppercase font-label-bold mb-1">
                Car
              </p>
              <p className="text-lg font-bold text-primary">
                {booking.car.brand} {booking.car.model}
              </p>
              {/* --- NEW: سطر تفاصيل الشركة المنفذة --- */}
              {booking.car.agency && (
                <p className="text-xs text-secondary mt-1.5 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    storefront
                  </span>
                  Provided by {booking.car.agency.name}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <p className="text-secondary text-sm uppercase font-label-bold mb-1">
                Status
              </p>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === "ACTIVE"
                    ? "bg-blue-100 text-blue-700"
                    : booking.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                }`}
              >
                {booking.status}
              </span>
            </div>
            <div className="col-span-2">
              <p className="text-secondary text-sm uppercase font-label-bold mb-1">
                Pickup
              </p>
              <p className="font-semibold text-on-surface">
                {new Date(booking.startDate).toLocaleString()}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-secondary text-sm uppercase font-label-bold mb-1">
                Return
              </p>
              <p className="font-semibold text-on-surface">
                {new Date(booking.endDate).toLocaleString()}
              </p>
            </div>
          </div>

          {booking.notes && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-secondary text-xs font-label-bold uppercase mb-2">
                Notes & Requests
              </p>
              <p className="text-on-surface whitespace-pre-line leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
