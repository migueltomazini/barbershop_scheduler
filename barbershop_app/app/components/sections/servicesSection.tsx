// app/components/sections/servicesSection.tsx

import React from "react";
import connectDB from "@/lib/mongoose";
import Service from "@/models/Service";
import ServicesClientComponent from "./ServicesClientComponent"; // Client-side rendering of services list

/**
 * Props for the ServicesSection server component.
 *
 * @property {"home" | "full"} [variant="home"] - Determines display mode:
 *   "home" renders a limited preview of services, while "full" renders the complete set.
 */
type ServicesSectionProps = {
  variant?: "home" | "full";
};

/**
 * ServicesSection (Server Component)
 *
 * This async server component is responsible for:
 * 1. Establishing a connection to the MongoDB database via connectDB().
 * 2. Querying the Service model for all service documents, sorted by creation date.
 * 3. Converting Mongoose documents to plain JavaScript objects.
 * 4. Passing the fully serializable `initialServices` array and `variant` prop
 *    to the client-side ServicesClientComponent for rendering.
 *
 * In case of any database errors, it logs the error server-side and renders
 * a fallback UI indicating that loading the services failed.
 *
 * @param {ServicesSectionProps} props - Contains the optional display variant.
 * @returns {Promise<JSX.Element>} The rendered ServicesClientComponent or an error message section.
 */
export const ServicesSection = async ({
  variant = "home",
}: ServicesSectionProps) => {
  try {
    // 1. Connect to MongoDB if not already connected
    await connectDB();

    // 2. Fetch all services from the database, sorted oldest to newest
    const servicesData = await Service.find({}).sort({ createdAt: 1 }).lean();

    // 3. Serialize Mongoose documents into plain objects
    const services: ServiceType[] = JSON.parse(JSON.stringify(servicesData));

    // 4. Render the client component with fetched data
    return (
      <ServicesClientComponent
        initialServices={services}
        variant={variant}
      />
    );
  } catch (error) {
    // Log the error for server-side diagnostics
    console.error("Failed to fetch services:", error);

    // Render a user-friendly error message in the UI
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">
          Failed to load services from the database.
        </p>
      </section>
    );
  }
};
