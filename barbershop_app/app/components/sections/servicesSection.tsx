import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";
import { ServiceCard } from "../ui/serviceCard";
import { mockServices } from "@/app/data/mockServices";

type ServicesSectionProps = {
  variant?: "home" | "full";
};

export const ServicesSection = ({ variant = "home" }: ServicesSectionProps) => {
  const isHome = variant === "home";
  const servicesToShow = isHome ? mockServices.slice(0, 3) : mockServices;

  return (
    <section className="container mx-auto px-4 py-16">
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
          {servicesToShow.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant={isHome ? "carousel" : "detailed"}
              icon={isHome ? service.icon : undefined}
              showButton={!isHome}
            />
          ))}
        </div>
      </section>

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
