/**
 * @file barbershop_app/app/(pages)/services/page.tsx
 * @description
 * FINAL VERSION: This page is responsible for displaying the list of services offered.
 * 
 * Key Characteristics:
 * - Server Component that fetches service data before rendering.
 * - Database interaction is handled using Mongoose and MongoDB.
 * - Renders only the core content section (`<ServicesSection />`), as common layout elements
 *   (such as the Navbar and Footer) are managed by `layout.tsx`.
 * 
 * Notes:
 * - The import of React is optional in Server Components using the app/ directory in Next.js 13+.
 * - The data fetching is performed entirely server-side for performance and security.
 */

// The import of React is not strictly necessary in Server Components.
// import React from "react";

// Only the content-specific section of the page is imported.
import { ServicesSection } from "@/app/components/sections/servicesSection";

// Utilities for database access
import connectDB from "@/lib/mongoose";
import Service from "@/models/Service";

/**
 * @page ServicesPage (Server Component)
 * @description
 * This Server Component fetches all available service documents from the database,
 * then renders the <ServicesSection /> component by passing the service data as props.
 * 
 * This ensures that:
 * - Data is fetched and rendered on the server, avoiding the need for client-side API calls.
 * - The page is fast, secure, and SEO-friendly.
 * 
 * @returns {JSX.Element} A rendered list of services within the ServicesSection component.
 */
export default async function ServicesPage() {

  /**
   * Step 1: Connect to MongoDB.
   * 
   * Uses the `connectDB` utility to establish a database connection via Mongoose.
   * This ensures that the connection is ready before querying.
   */
  await connectDB();

  /**
   * Step 2: Query the services collection.
   * 
   * Fetches all service documents, sorted by the `createdAt` field in ascending order.
   * The `.lean()` method returns plain JavaScript objects instead of Mongoose documents,
   * which improves performance and ensures easier serialization.
   */
  const servicesData = await Service.find({}).sort({ createdAt: 1 }).lean();

  /**
   * Step 3: Serialize the data.
   * 
   * Converts the fetched documents into JSON-serializable data using JSON methods.
   * This is important to ensure compatibility when passing the data as props.
   */
  const services = JSON.parse(JSON.stringify(servicesData));

  /**
   * Step 4: Render the page content.
   * 
   * Returns only the main component of the page, `<ServicesSection />`, and passes the fetched
   * service data as the `initialServices` prop.
   * The layout wrapper (Navbar, Footer, etc.) is applied by the global layout.tsx.
   */
  return (
      <ServicesSection variant="full" initialServices={services} />
  );
}
