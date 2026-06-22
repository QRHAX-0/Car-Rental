import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// 1. استقبلنا الـ savedLocation هنا كـ prop جاية من صفحة الـ Cars
export default function CarCard({ car, savedLocation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images =
    car.images && car.images.length > 0
      ? car.images.map((img) => img.image)
      : [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80",
        ];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const carName = `${car.brand} ${car.model}`;

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-xl overflow-hidden ambient-shadow border border-slate-100 group flex flex-col h-full"
    >
      {/* 2. حاوية الصور اتحولت لـ Link ذكي بيباصي الـ location في الـ state */}
      <Link
        to={`/cars/${car.id}`}
        state={{ pickupLocation: savedLocation }}
        className="car-image-container relative overflow-hidden bg-slate-50 h-56 block cursor-pointer"
      >
        {images.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`${carName} - view ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase text-primary">
            {car.category}
          </span>
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-grow">
        {/* جوه الـ div اللي كلاسه p-8 flex flex-col flex-grow */}
        <div className="flex justify-between items-start mb-6">
          <div>
            {/* --- NEW: التاج بتاع اسم الشركة --- */}
            {car.agency && (
              <p className="text-[10px] font-label-bold tracking-widest text-secondary uppercase mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  storefront
                </span>
                {car.agency.name} {/* شيلنا كلمة Provided by خالص */}
              </p>
            )}
            <h3 className="font-h3 text-[24px] text-primary mb-1">{carName}</h3>
            <p className="text-secondary text-sm">{car.year}</p>
          </div>

          {/* باقي الكود بتاع السعر زي ما هو */}
          <div className="text-right shrink-0">
            <span className="font-price-display text-price-display text-primary">
              ${car.pricePerDay}
            </span>
            <span className="block text-xs text-secondary font-medium">
              / DAY
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-y border-slate-100 mb-8 mt-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-lg">
              local_gas_station
            </span>
            <span className="font-label-bold text-xs uppercase text-on-surface-variant">
              {car.fuelType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-lg">
              settings
            </span>
            <span className="font-label-bold text-xs uppercase text-on-surface-variant">
              {car.transmission}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-lg">
              person
            </span>
            <span className="font-label-bold text-xs uppercase text-on-surface-variant">
              {car.seatingCapacity} Seats
            </span>
          </div>
        </div>

        {/* 3. دمجنا الزرارين في زرار واحد بريميوم وعريض بيمرر الـ state */}
        <div className="w-full">
          <Link
            to={`/cars/${car.id}`}
            state={{ pickupLocation: savedLocation }}
            className="block w-full bg-primary text-white py-4 rounded-full font-label-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all text-center shadow-lg shadow-primary/10"
          >
            EXPLORE & BOOK
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
