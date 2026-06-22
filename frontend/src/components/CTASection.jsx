import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-[120px]">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="bg-slate-950 rounded-2xl p-16 relative overflow-hidden flex flex-col items-center text-center"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img className="w-full h-full object-cover" alt="Car Grill Background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm51lFYMGKOgON5nWSKjaGcV3E7UP0s2Ti9l802vunIyKsiFWVjmhzA__VYU8TR8XlbF-AntdhyPlBZfZGqrCqwJXwk_2Dsb0_tfuFvQteMAWPxegov6tfd59bab637rMFhcGkFfz7QsFlL9CA6TQF7YRL1IKwf-uQOcmkEI1rhdbnfiR-VnroajHJ2leuOGuyzjiTDlsKAYuhU38qmmLSWrvKx5Pdn7OMr4B3qQqti_fkcuNFCEXv2ZkWP6Sbbl66S5NT3mjI_GY"/>
        </div>
        <h2 className="font-h2 text-h2 text-white mb-6 relative z-10">Ready to drive your dream?</h2>
        <p className="font-body-lg text-body-lg text-slate-400 mb-10 max-w-2xl relative z-10">
          Join over 10,000 satisfied clients who trust Luxe for their high-end transportation needs in New York.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link to="/booking" className="bg-white text-slate-950 px-10 py-4 rounded-full font-label-bold text-label-bold hover:bg-slate-100 transition-all active:scale-95 inline-block text-center">
            RESERVE NOW
          </Link>
          <button className="border border-white/20 text-white px-10 py-4 rounded-full font-label-bold text-label-bold hover:bg-white/10 transition-all active:scale-95">
            CONTACT AGENT
          </button>
        </div>
      </motion.div>
    </section>
  );
}
