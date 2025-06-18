/**
 * @file barbershop_app/app/components/sections/servicesSection.tsx
 * @description This component fetches and displays a list of services. It supports two variants: a 'home'
 * preview and a 'full' catalog for the dedicated services page.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "../ui/button";
import { ServiceCard } from "../ui/serviceCard";

import { ServiceType } from "@/app/types";

/**
 * @type ServicesSectionProps
 * @description Defines the properties for the ServicesSection component.
 * @property {'home' | 'full'} [variant] - 'home' for a limited preview, 'full' for the complete list.
 */
type ServicesSectionProps = {
  variant?: "home" | "full";
};

/**
 * @component ServicesSection
 * @description A component that fetches and displays barbershop services. It adapts its layout
 * and content based on the provided variant.
 * @param {ServicesSectionProps} props - The props for the component.
 */
export const ServicesSection = ({ variant = "home" }: ServicesSectionProps) => {
  const isHome = variant === "home";
  const router = useRouter();

  // State for services, loading status, and errors.
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches service data from the API on component mount.
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/services");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ServiceType[] = await response.json();
        setServices(data);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "An unknown error occurred.";
        setError(`Failed to fetch services. ${message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Limit the number of services displayed on the home page.
  const servicesToShow = isHome ? services.slice(0, 3) : services;

  // Display a loading message while data is being fetched.
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-barber-brown text-lg">Loading services...</p>
      </section>
    );
  }

  // Display an error message if the fetch fails.
  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <p className="text-muted-foreground">
          Please ensure your JSON-Server is running on http://localhost:3001.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Section Header */}
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

      {/* Grid of Service Cards */}
      <div
        className={`grid gap-6 ${
          isHome
            ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {servicesToShow.map((service) => (
          // Make the entire card clickable, navigating to the appointments page.
          <div
            key={service.id}
            className="cursor-pointer block"
            onClick={() => router.push("/appointments")}
          >
            <ServiceCard
              service={service}
              variant={isHome ? "carousel" : "detailed"}
              icon={isHome ? service.icon : undefined}
              showButton={!isHome}
            />
          </div>
        ))}
      </div>

      {/* Conditional footer content based on the variant. */}
      {isHome ? (
        // On the homepage, show a button to view all services.
        <div className="text-center mt-10">
          <Link href="/services">
            <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white">
              View All Services
            </Button>
          </Link>
        </div>
      ) : (
        // On the full services page, show a contact prompt.
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
