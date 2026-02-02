import React from 'react'
import { assets } from '../assets/assets';
import Title from './Title';

function Testimonials() {
        const testimonials = [
        { name: "Emma Rodriguez", address: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!" },
        { name: "Liam Johnson", address: "New York, USA", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "I’m truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!" },
        { name: "Sophia Lee", address: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results." }
    ];
  return (
     <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-30">
            <Title title='What Our Customers Say' subTitle='Discover why discerning travelers choose StayVenture for their luxury accommodations around the world.' />

            <div className="flex flex-wrap items-center sm:items-start justify-center gap-10 mt-20 mb-10">
                {testimonials.map((testimonial,index) => (
                    <div key={index} className="bg-white p-6 rounded-xl max-w-[350px] hover:-translate-y-1 transition-all duration-500 shadow-lg ">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="" />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default Testimonials