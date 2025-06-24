// app/components/sections/servicesSection.tsx
import React from "react";
import connectDB from "@/lib/mongoose";
import Service from "@/models/Service";
import ServicesClientComponent from "./ServicesClientComponent"; // Importa o novo componente de cliente

type ServicesSectionProps = {
  variant?: "home" | "full";
};

/**
 * @component ServicesSection (Server Component)
 * @description Busca os dados dos serviços do banco e passa para o componente de cliente.
 */
export const ServicesSection = async ({ variant = "home" }: ServicesSectionProps) => {
  try {
    await connectDB();
    const servicesData = await Service.find({}).sort({ createdAt: 1 }).lean();
    const services = JSON.parse(JSON.stringify(servicesData));

    // Renderiza o componente de cliente, passando os dados prontos.
    return <ServicesClientComponent initialServices={services} variant={variant} />;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">Failed to load services from the database.</p>
      </section>
    );
  }
};
