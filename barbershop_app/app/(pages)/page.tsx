/**
 * @file barbershop_app/app/(pages)/page.tsx
 * @description This file contains the main Home page component for the application. It serves as the landing page
 * and is composed of several distinct sections to showcase the barbershop's offerings.
 */

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
      <Navbar />
      <HeroSection />
      {/* ServicesSection is used with the "home" variant to show a limited preview. */}
      <ServicesSection variant="home" />
      {/* ProductsSection is used with the "full" variant to display all products. */}
      <ProductsSection variant="full" />
      <CtaSection />
      <Footer />
    </div>
  );
}
