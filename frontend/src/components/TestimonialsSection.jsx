import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    role: "CEO, TechFlow",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    text: "The Porsche 911 was in pristine condition. Delivery to my hotel was seamless, and the concierge service exceeded all expectations.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Creative Director",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    text: "Renting the BMW i4 for our weekend getaway was the best decision. The vehicle was stunning and the process was incredibly smooth.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Ross",
    role: "Architect",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    text: "I rely on Luxe for all my business trips to New York. The Tesla Model S is always charged and ready exactly when I need it.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-[120px] bg-surface-container-low max-w-7xl mx-auto px-6 rounded-[2.5rem] my-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold w-fit mb-4 uppercase">
          Client Experiences
        </span>
        <h2 className="font-h2 text-h2 text-primary mb-4">
          What Our Clients Say
        </h2>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
          Don't just take our word for it. Read about the premium experiences of
          our distinguished clientele.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            variants={fadeInUp}
            className="bg-white p-8 rounded-2xl ambient-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-on-surface-variant italic mb-8">
                "{testimonial.text}"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
              />
              <div>
                <h4 className="font-bold text-primary text-sm">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-secondary">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
