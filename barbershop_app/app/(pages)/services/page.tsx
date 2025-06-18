/**
 * @file barbershop_app/app/(pages)/services/page.tsx
 * @description This file contains the dedicated "Services" page, which displays a full list of all available services.
 */

import React from "react";

// Component imports
import { Navbar } from "@/app/components/layout/navbar";
import { ServicesSection } from "@/app/components/sections/servicesSection";
import { Footer } from "@/app/components/layout/footer";

export default function Services() {
  return (
    <div>
      <Navbar />
      {/* The ServicesSection is rendered in its "full" variant to display all items. */}
      <ServicesSection variant="full" />
      <Footer />
    </div>
  );
}
