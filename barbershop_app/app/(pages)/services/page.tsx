import React from "react";

// Component imports
import { Navbar } from "@/app/components/layout/navbar";
import { ServicesSection } from "@/app/components/sections/servicesSection";
import { Footer } from "@/app/components/layout/footer";

export default function Services() {
  return (
    <div>
      <Navbar />
      <ServicesSection variant="full" />
      <Footer />
    </div>
  );
}
