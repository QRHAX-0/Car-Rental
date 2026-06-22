import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Booking() {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    returnDate: '',
    vehicleClass: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking requested:', formData);
    alert('Thank you! We will confirm your availability shortly.');
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold w-fit mb-4 uppercase">
            Reservations
          </span>
          <h1 className="font-h1 text-h2 md:text-h1 text-primary mb-4">Reserve Your Experience</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-xl mx-auto">
            Select your dates and vehicle class. Our concierge team will ensure your luxury vehicle is prepared to your exact specifications.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] ambient-shadow border border-slate-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-bold text-sm text-on-surface uppercase tracking-wider">Pick-up Location</label>
                <input 
                  type="text" 
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="e.g. JFK Airport, Manhattan Hotel"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-bold text-sm text-on-surface uppercase tracking-wider">Drop-off Location</label>
                <input 
                  type="text" 
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  placeholder="Same as pick-up or enter new"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-bold text-sm text-on-surface uppercase tracking-wider">Pick-up Date & Time</label>
                <input 
                  type="datetime-local" 
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-bold text-sm text-on-surface uppercase tracking-wider">Return Date & Time</label>
                <input 
                  type="datetime-local" 
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-bold text-sm text-on-surface uppercase tracking-wider">Vehicle Class</label>
              <select 
                name="vehicleClass"
                value={formData.vehicleClass}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Select a vehicle class...</option>
                <option value="luxury_sedan">Luxury Sedan (e.g. Mercedes S-Class, BMW 7 Series)</option>
                <option value="sports_car">Sports Car (e.g. Porsche 911, Audi R8)</option>
                <option value="luxury_suv">Luxury SUV (e.g. Range Rover, Bentley Bentayga)</option>
                <option value="electric">Premium Electric (e.g. Porsche Taycan, Tesla Model S)</option>
              </select>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full bg-primary text-white py-5 rounded-full font-label-bold text-label-bold hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                CHECK AVAILABILITY
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
