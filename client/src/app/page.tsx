"use client";

import { HeroSection } from "@/components/hero-section";
import ProductCards from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-l from-blue-50 to-white">
      <main>
        <HeroSection />
        <ProductCards />
      </main>
    </div>
  );
}
