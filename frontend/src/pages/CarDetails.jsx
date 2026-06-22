import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"; // --- NEW: useLocation ---
import { motion } from "framer-motion";
import { api } from "@/utils/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// --- NEW: دالة عشان تمنع اختيار تاريخ في الماضي بتوقيت اليوزر المحلي ---
const getLocalMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // --- NEW ---

  // --- NEW: استلام اللوكيشن المحفوظ لو موجود ---
  const savedPickupLocation = location.state?.pickupLocation || "";

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const res = await api.get(`/cars/${id}`);
      return res.data;
    },
  });

  // --- NEW: ضفنا الـ pickupLocation للستيت ---
  const [bookingData, setBookingData] = useState({
    pickupLocation: savedPickupLocation,
    pickupDate: "",
    returnDate: "",
    notes: "",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!car || !car.images || car.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [car]);

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const bookMutation = useMutation({
    mutationFn: async (newBooking) => {
      const res = await api.post("/rental/book", newBooking);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking confirmed successfully!");
      navigate("/my-bookings");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to create booking. Please try again.";
      toast.error(message);
    },
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // --- NEW: دمج اللوكيشن جوه الملاحظات عشان الباك إند يقبلها ---
    const finalNotes = bookingData.pickupLocation
      ? `Pick-up Location: ${bookingData.pickupLocation}\n--- \n${bookingData.notes}`
      : bookingData.notes;

    const payload = {
      carId: Number(id),
      startDate: new Date(bookingData.pickupDate).toISOString(),
      endDate: new Date(bookingData.returnDate).toISOString(),
      notes: finalNotes,
    };

    bookMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <p className="text-red-500 font-body-lg">Failed to load car details.</p>
      </div>
    );
  }

  const carName = `${car.brand} ${car.model}`;
  const images =
    car.images && car.images.length > 0
      ? car.images.map((img) => img.image)
      : [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80",
        ];

  // --- NEW: حساب التكلفة الديناميكية بناءً على التواريخ ---
  let calculatedDays = 0;
  let totalPrice = 0;
  if (bookingData.pickupDate && bookingData.returnDate) {
    const start = new Date(bookingData.pickupDate);
    const end = new Date(bookingData.returnDate);
    if (end > start) {
      // حساب عدد الأيام (على الأقل يوم واحد)
      calculatedDays = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
      );
      totalPrice = calculatedDays * Number(car.pricePerDay);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-12 transition-colors group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
            west
          </span>
          <span className="font-label-bold text-sm uppercase tracking-wider">
            Back to Fleet
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            {/* ... حاوية الصور زي ما هي بالظبط ... */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-[2.5rem] overflow-hidden ambient-shadow bg-slate-50 mb-12 relative aspect-[16/10]"
            >
              {images.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`${carName} - View ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    idx === currentImageIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                />
              ))}

              {images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx === currentImageIndex
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* ... التفاصيل والمواصفات زي ما هي ... */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-8"
            >
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold mb-4 uppercase">
                  {car.category}
                </span>
                <h1 className="font-h1 text-h2 md:text-h1 text-primary mb-2">
                  {carName}
                </h1>
                <p className="text-xl text-secondary">
                  {car.year} • {car.location}
                </p>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* --- NEW: كارت بيانات الشركة (Agency) --- */}
              {car.agency && (
                <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 ambient-shadow flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl uppercase">
                    {/* بناخد أول حرف من اسم الشركة كلوجو مبدئي */}
                    {car.agency.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase font-label-bold mb-1 tracking-wider">
                      Vehicle Provided By
                    </p>
                    <p className="font-bold text-primary text-lg">
                      {car.agency.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 ambient-shadow text-center">
                  <span className="material-symbols-outlined text-primary mb-2">
                    local_gas_station
                  </span>
                  <p className="text-xs text-secondary uppercase font-label-bold mb-1">
                    Fuel
                  </p>
                  <p className="font-bold text-primary">{car.fuelType}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 ambient-shadow text-center">
                  <span className="material-symbols-outlined text-primary mb-2">
                    speed
                  </span>
                  <p className="text-xs text-secondary uppercase font-label-bold mb-1">
                    Mileage
                  </p>
                  <p className="font-bold text-primary">{car.mileage} mi</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 ambient-shadow text-center">
                  <span className="material-symbols-outlined text-primary mb-2">
                    settings_suggest
                  </span>
                  <p className="text-xs text-secondary uppercase font-label-bold mb-1">
                    Trans
                  </p>
                  <p className="font-bold text-primary">{car.transmission}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 ambient-shadow text-center">
                  <span className="material-symbols-outlined text-primary mb-2">
                    person
                  </span>
                  <p className="text-xs text-secondary uppercase font-label-bold mb-1">
                    Seats
                  </p>
                  <p className="font-bold text-primary">
                    {car.seatingCapacity}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 rounded-[2.5rem] ambient-shadow border border-slate-100 sticky top-32"
            >
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <p className="text-secondary text-sm uppercase font-label-bold mb-1">
                    Price Per Day
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-h2 text-primary font-bold">
                      ${car.pricePerDay}
                    </span>
                  </div>
                </div>

                {/* --- NEW: عرض السعر الإجمالي لو اليوزر اختار تواريخ --- */}
                {totalPrice > 0 && (
                  <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <p className="text-xs text-secondary font-label-bold mb-1">
                      Total for {calculatedDays} days
                    </p>
                    <p className="text-xl font-bold text-primary">
                      ${totalPrice}
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* --- NEW: حقل اللوكيشن بيعرض اللي اتسحب من الـ Home --- */}
                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider">
                    Pick-up Location
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={bookingData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="e.g. Airport, Hotel..."
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider">
                    Pick-up Date
                  </label>
                  <input
                    type="datetime-local"
                    name="pickupDate"
                    min={getLocalMinDateTime()} // --- NEW: قفل التواريخ القديمة ---
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider">
                    Return Date
                  </label>
                  <input
                    type="datetime-local"
                    name="returnDate"
                    min={bookingData.pickupDate || getLocalMinDateTime()} // --- NEW: قفل تاريخ العودة قبل تاريخ الاستلام ---
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-xs text-on-surface uppercase tracking-wider">
                    Special Requests
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Concierge delivery, specific car color..."
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-sm resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={bookMutation.isPending}
                    className={`w-full text-white py-5 rounded-full font-label-bold text-label-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20
                      ${
                        bookMutation.isPending
                          ? "bg-primary/70 cursor-not-allowed"
                          : "bg-primary hover:opacity-90 active:scale-[0.98]"
                      }`}
                  >
                    {bookMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">
                          progress_activity
                        </span>
                        PROCESSING...
                      </>
                    ) : (
                      `BOOK ${carName.toUpperCase()}`
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-secondary uppercase tracking-widest font-medium">
                  Instant confirmation for members
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
