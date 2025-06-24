// app/components/sections/ServicesClientComponent.tsx

"use client"; // Directive enabling client-side rendering

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { ServiceCard } from "../ui/serviceCard";
import { ServiceType } from "@/app/types";

/**
 * Props for the ServicesClientComponent.
 *
 * @property {ServiceType[]} initialServices - The list of services to display.
 * @property {"home" | "full"} [variant="home"] - Display mode:
 *   "home" shows a limited preview; "full" renders the complete list.
 */
type ServicesClientProps = {
  initialServices: ServiceType[];
  variant?: "home" | "full";
};

/**
 * ServicesClientComponent
 *
 * Manages and renders the client-facing services section.
 * - In 'home' mode: shows a 3-item preview grid and a CTA to view all services.
 * - In 'full' mode: displays all services with detailed cards and additional info.
 * Utilizes Next.js router for navigation and adapts layout based on variant.
 *
 * @param {ServicesClientProps} props - Component properties.
 * @returns {JSX.Element} The rendered services section.
 */
export default function ServicesClientComponent({
  initialServices,
  variant = "home",
}: ServicesClientProps) {
  // Determine if rendering preview or full view
  const isHome = variant === "home";
  const router = useRouter();

  // Local state initialized from props
  const [services] = useState<ServiceType[]>(initialServices);

  // Select subset or full list based on variant
  const servicesToShow = isHome ? services.slice(0, 3) : services;

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Section header with dynamic description */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 font-serif text-barber-brown">
          Our Premium Services
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isHome
            ? "From classic haircuts to luxury grooming treatments, our professional barbers provide exceptional service for the modern gentleman."
            : "Experience the finest in barbering with our range of expert services, from classic cuts to luxury treatments."}
        </p>
      </div>

      {/* Services grid: layout adjusts for preview vs full */}
      <div
        className={`grid gap-6 ${
          isHome
            ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {servicesToShow.map((service) => (
          <div
            key={service._id}
            className="cursor-pointer block"
            onClick={() => router.push("/appointments")}
          >
            {/* ServiceCard adapts variant and icon based on context */}
            <ServiceCard
              service={service}
              variant={isHome ? "carousel" : "detailed"}
              icon={isHome ? (service as any).icon : undefined}
              showButton={!isHome}
            />
          </div>
        ))}
      </div>

      {/* Conditional footer: preview CTA or full-mode contact prompt */}
      {isHome ? (
        <div className="text-center mt-10">
          <Link href="/services">
            <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white">
              View All Services
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-16 bg-barber-cream rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 font-serif text-barber-brown">
            Need a Special Service?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Have specific requirements or looking for a custom grooming
            experience? Contact us by email or phone to discuss your needs.
          </p>
        </div>
      )}
    </section>
  );
};
