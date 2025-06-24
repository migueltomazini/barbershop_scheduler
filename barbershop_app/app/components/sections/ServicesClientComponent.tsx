// app/components/sections/ServicesClientComponent.tsx
"use client"; // A diretiva agora está no topo!

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { ServiceCard } from "../ui/serviceCard";
import { ServiceType } from "@/app/types";

type ServicesClientProps = {
  initialServices: ServiceType[];
  variant?: "home" | "full";
};

/**
 * @component ServicesClientComponent
 * @description Gerencia a exibição e interações do cliente com os serviços.
 */
export default function ServicesClientComponent({ initialServices, variant = "home" }: ServicesClientProps) {
  const isHome = variant === "home";
  const router = useRouter();
  
  const [services] = useState<ServiceType[]>(initialServices);
  
  const servicesToShow = isHome ? services.slice(0, 3) : services;

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
            <ServiceCard
              service={service}
              variant={isHome ? "carousel" : "detailed"}
              icon={isHome ? (service as any).icon : undefined}
              showButton={!isHome}
            />
          </div>
        ))}
      </div>

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