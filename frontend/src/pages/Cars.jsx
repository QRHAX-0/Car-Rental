import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom"; // --- NEW: استيراد useLocation ---
import CarCard from "../components/CarCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

const categories = ["ALL", "LUXURY", "ELECTRIC", "SPORT"];

export default function Cars() {
  const location = useLocation(); // --- NEW: سحب الداتا من الرابط ---

  // --- NEW: استلام الفئة واللوكيشن من الصفحة الرئيسية ---
  const incomingCategory = location.state?.selectedCategory || "ALL";
  const savedPickupLocation = location.state?.pickupLocation || "";

  // الستيت بتاخد القيمة اللي جاية من بره كقيمة مبدئية
  const [activeCategory, setActiveCategory] = useState(incomingCategory);

  // --- NEW: تحديث الستيت لو اليوزر داس بحث تاني وهو جوه الصفحة ---
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setActiveCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  const {
    data: cars = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await api.get("/cars");
      return res.data;
    },
  });

  // فلترة ذكية بتتجاهل حالة الحروف والمسافات
  const filteredCars =
    activeCategory === "ALL"
      ? cars
      : cars.filter((car) => {
          if (!car.category) return false;

          const normalizedDbCategory = car.category.toUpperCase().trim();
          const normalizedActiveCategory = activeCategory.toUpperCase().trim();

          return normalizedDbCategory === normalizedActiveCategory;
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

  if (isError) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <p className="text-red-500 font-body-lg">
          Failed to load cars from the server.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-h1 text-h2 md:text-h1 text-primary mb-4">
            Our Complete Fleet
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-xl mx-auto">
            Browse our entire collection of premium vehicles. Filter by category
            to find your perfect match.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-label-bold text-sm tracking-wider uppercase transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-white text-secondary border border-slate-200 hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                {/* --- NEW: بنمرر اللوكيشن للكارت عشان يكمل الرحلة --- */}
                <CarCard car={car} savedLocation={savedPickupLocation} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20 text-secondary font-body-lg">
            No vehicles found in this category.
          </div>
        )}
      </div>
    </main>
  );
}
