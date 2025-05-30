"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "../ui/button";
import { ServiceCard } from "../ui/serviceCard";

import { ServiceType } from "@/app/types";

type ServicesSectionProps = {
  variant?: "home" | "full";
};

export const ServicesSection = ({ variant = "home" }: ServicesSectionProps) => {
  const isHome = variant === "home";

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch services from local JSON server
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/services");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ServiceType[] = await response.json();
        setServices(data);
      } catch (e: any) {
        setError(e.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const servicesToShow = isHome ? services.slice(0, 3) : services; // Limit services if on home page

  if (loading) {
    // Show loading message while fetching
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-barber-brown text-lg">Loading services...</p>
      </section>
    );
  }

  if (error) {
    // Show error message if fetch fails
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
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

      {/* Featured Services Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-barber-brown mb-8">
          Featured Services
        </h2>

        <div
          className={`grid gap-6 ${
            isHome
              ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {/* Render service cards */}
          {servicesToShow.map((service) => (
            <Link key={service.id} href="/services" className="block">
              <ServiceCard
                service={service}
                variant={isHome ? "carousel" : "detailed"}
                icon={isHome ? service.icon : undefined}
                showButton={!isHome}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Conditional footer content depending on page */}
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
            experience? Contact us to discuss your needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact">
              <Button className="bg-barber-navy hover:bg-barber-navy/90 text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
