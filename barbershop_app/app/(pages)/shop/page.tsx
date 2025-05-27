import React from "react";

// Component imports
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { ProductsSection } from "@/app/components/sections/productsSection";

export default function Shop() {
  return (
    <div>
      <Navbar />
      <ProductsSection variant="full" />
      <Footer />
    </div>
  );
}
