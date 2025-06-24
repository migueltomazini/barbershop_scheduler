/**
 * @file app/page.tsx
 * @description FINAL AND CORRECTED VERSION: The main homepage now fetches data
 * and renders only its exclusive content, using the correct import paths.
 */

// 1. CORRECTED IMPORTS using the '@/` alias
import { HeroSection } from "@/app/components/sections/home/heroSection";
import { ServicesSection } from "@/app/components/sections/servicesSection";
import { ProductsSection } from "@/app/components/sections/productsSection";
import { CtaSection } from "@/app/components/sections/home/ctaSection";

// Utilities to fetch data from the server
import connectDB from "@/lib/mongoose";
import Service from "@/models/Service";
import Product from "@/models/Product";

/**
 * @page HomePage (Server Component)
 * @description The homepage fetches preview data and renders content sections.
 * The Navbar and Footer come from the layout.tsx component.
 */
export default async function HomePage() {
  // Connect to the database and prepare queries
  await connectDB();

  // Fetch the first 3 services for preview display
  const servicesPromise = Service.find({}).limit(3).sort({ createdAt: 1 }).lean();
  
  // Fetch all products
  const productsPromise = Product.find({}).sort({ createdAt: -1 }).lean();

  // Execute queries in parallel for performance
  const [services, products] = await Promise.all([servicesPromise, productsPromise]);
  
  // Ensure data is serializable to JSON for client transmission
  const safeServices = JSON.parse(JSON.stringify(services));
  const safeProducts = JSON.parse(JSON.stringify(products));

  // 2. CLEAN JSX: Return only the main content of the page
  return (
    <>
      <HeroSection />
      <ServicesSection variant="home" initialServices={safeServices} />
      <ProductsSection variant="full" initialProducts={safeProducts} />
      <CtaSection />
    </>
  );
}
