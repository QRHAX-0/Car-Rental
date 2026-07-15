import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CarCard from "./CarCard";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function PopularCarsGrid() {
  const {
    data,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["cars", { limit: 3 }],
    queryFn: async () => {
      const res = await api.get("/cars?limit=3");
      return res.data;
    },
  });

  const featuredCars = data?.cars || [];

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
    <section className="py-[120px] max-w-7xl mx-auto px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
      >
        <div>
          <h2 className="font-h2 text-h2 text-primary mb-4">
            Our Premium Fleet
          </h2>
          <p className="font-body-lg text-body-lg text-secondary max-w-xl">
            Select from our hand-picked collection of high-performance luxury
            vehicles maintained to perfection.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/cars"
            className="w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
            title="View All Cars"
          >
            <span className="material-symbols-outlined text-primary group-hover:text-white">
              east
            </span>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {featuredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </motion.div>
    </section>
  );
}
