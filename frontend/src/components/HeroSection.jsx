import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // --- NEW ---

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

export default function HeroSection() {
  const navigate = useNavigate(); // --- NEW ---

  // --- NEW: ستيت عشان نخزن فيها اللوكيشن والفئة ---
  const [formData, setFormData] = useState({
    pickupLocation: "JFK International Airport",
    vehicleClass: "ALL",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // بننقله لصفحة العربيات ونبعت معاه البيانات في الـ state
    navigate("/cars", {
      state: {
        selectedCategory: formData.vehicleClass,
        pickupLocation: formData.pickupLocation,
      },
    });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full object-cover opacity-10"
          alt="Luxury Car Background"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjqwpPTZTezzpXmYrdIhA146YVrEpl_s-JyXjuE970ruTVaO17vNOOop7d0pN8bGanHYBjMb_3Rq2O8mxHXQRnG9smZfZ4bwEzUFd2MH5AM13kybDZBiu_CDLfp6fTfdu8ZEaXhKRjzumS9sUXQoQMiYBlGd-d5GxOC4zUL6E_SH1FTof-fKAJlpGZP2zgEpBTr4C5BiGOZZwtLsJbrkwrImLsHDCkhp_ppUkBg4emYEbUMB5pDV8pjSVlYu5l49A0N2u3tOFRtRc"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold w-fit mb-6 uppercase"
          >
            Elite Fleet 2026
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="font-h1 text-h1 text-primary mb-8 max-w-2xl"
          >
            Premium Car Rental in New York
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="font-body-lg text-body-lg text-secondary mb-10 max-w-xl"
          >
            Experience the peak of automotive excellence. Our curated fleet
            offers the perfect blend of performance, luxury, and sophistication
            for your Manhattan journey.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex items-center gap-6">
            {/* ربطت زرار Explore كمان عشان يودي لصفحة العربيات */}
            <button
              onClick={() => navigate("/cars")}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-bold text-label-bold hover:opacity-90 transition-all active:scale-95"
            >
              EXPLORE FLEET
            </button>
            <button className="flex items-center gap-2 font-label-bold text-label-bold text-primary group">
              VIEW SPECIAL OFFERS
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-5 flex items-center"
        >
          <div className="glass-card ambient-shadow rounded-xl p-8 w-full border border-white/40">
            <h3 className="font-h3 text-h3 text-primary mb-6">
              Book Your Ride
            </h3>

            {/* --- NEW: ضفنا form بدل الـ div عشان يقدر يعمل submit --- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-label-bold text-label-bold block mb-2 text-on-surface-variant">
                  PICK-UP LOCATION
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    location_on
                  </span>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-4 focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Enter location..."
                  />
                </div>
              </div>

              {/* --- NEW: شلنا التواريخ وحطينا الـ Category بدالها --- */}
              <div>
                <label className="font-label-bold text-label-bold block mb-2 text-on-surface-variant">
                  VEHICLE CLASS
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline z-10 pointer-events-none">
                    directions_car
                  </span>
                  <select
                    name="vehicleClass"
                    value={formData.vehicleClass}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-10 py-4 focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="LUXURY">Luxury Sedan</option>
                    <option value="SPORT">Sports Car</option>
                    <option value="ELECTRIC">Premium Electric</option>
                  </select>
                  {/* سهم صغنون كده للـ select عشان شكله يبقى أحلى */}
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-5 rounded-full font-label-bold text-label-bold mt-4 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                SEARCH AVAILABLE CARS
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
