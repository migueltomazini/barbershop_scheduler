"use client"

import React, { useState, useEffect } from "react"; // Adicione useEffect
import Link from "next/link";

import { Button } from "../ui/button";
import { ServiceCard } from "../ui/serviceCard";

import { ServiceType } from "@/app/types"; // Supondo que você tenha ServiceType

type ServicesSectionProps = {
  variant?: "home" | "full";
};

export const ServicesSection = ({ variant = "home" }: ServicesSectionProps) => { // Corrigindo a tipagem aqui também
  const isHome = variant === "home";

  const [services, setServices] = useState<ServiceType[]>([]); // Estado para os serviços
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Novo useEffect para buscar os serviços
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/services"); // URL do JSON-Server
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
  }, []); // Array de dependências vazio para rodar apenas uma vez

  const servicesToShow = isHome ? services.slice(0, 3) : services; // Agora usa o estado 'services'

  // Adicione estados de loading/error na UI
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-barber-brown text-lg">Loading services...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <p className="text-muted-foreground">Please ensure your JSON-Server is running on http://localhost:3001.</p>
      </section>
    );
  }

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