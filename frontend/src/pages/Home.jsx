import React from 'react';
import HeroSection from '../components/HeroSection';
import PopularCarsGrid from '../components/PopularCarsGrid';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PopularCarsGrid />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
