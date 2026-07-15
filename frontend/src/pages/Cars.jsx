import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import CarCard from "../components/CarCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

const categories = ["ALL", "LUXURY", "ELECTRIC", "SPORT"];

export default function Cars() {
  const location = useLocation();

  const incomingCategory = location.state?.selectedCategory || "ALL";
  const savedPickupLocation = location.state?.pickupLocation || "";

  const [activeCategory, setActiveCategory] = useState(incomingCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setActiveCategory(location.state.selectedCategory);
      setCurrentPage(1);
    }
  }, [location.state]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); 
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["cars", currentPage, activeCategory],
    queryFn: async () => {
      const categoryParam =
        activeCategory !== "ALL" ? `&category=${activeCategory}` : "";
      const res = await api.get(
        `/cars?page=${currentPage}&limit=${itemsPerPage}${categoryParam}`,
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const carsList = data?.cars || [];
  const totalPages = data?.totalPages || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isLoading && carsList.length === 0) {
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
              onClick={() => handleCategoryChange(category)}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${activeCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {carsList.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                savedLocation={savedPickupLocation}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Square Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-label-bold transition-all ${
                currentPage === 1
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-transparent"
                  : "bg-white border border-slate-200 text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              Prev
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-bold transition-all ${
                  currentPage === number
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white border border-slate-200 text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-label-bold transition-all ${
                currentPage === totalPages
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-transparent"
                  : "bg-white border border-slate-200 text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {carsList.length === 0 && (
          <div className="text-center py-20 text-secondary font-body-lg">
            No vehicles found in this category.
          </div>
        )}
      </div>
    </main>
  );
}
