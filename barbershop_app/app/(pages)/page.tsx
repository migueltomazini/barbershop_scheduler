import React from "react";

// Component imports
import { Navbar } from "../components/layout/navbar";
import { HeroSection } from "../components/sections/home/heroSection";
import { ServicesSection } from "../components/sections/servicesSection";
import { ProductsSection } from "../components/sections/productsSection";
import { CtaSection } from "../components/sections/home/ctaSection";
import { Footer } from "../components/layout/footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection />
      <ServicesSection variant="home"/>
      <ProductsSection variant="full"/>
      <CtaSection />
      <Footer />
    </div>
  );
}
