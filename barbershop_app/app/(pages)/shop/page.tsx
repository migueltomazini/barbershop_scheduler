/**
 * @file barbershop_app/app/(pages)/shop/page.tsx
 * @description This file contains the dedicated "Shop" page, which displays a full list of all available products for sale.
 */

import React from "react";

// Component imports
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { ProductsSection } from "@/app/components/sections/productsSection";

export default function Shop() {
  return (
    <div>
      <Navbar />
      {/* The ProductsSection is rendered in its "full" variant to display all items. */}
      <ProductsSection variant="full" />
      <Footer />
    </div>
  );
}
