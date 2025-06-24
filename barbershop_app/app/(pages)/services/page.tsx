/**
 * @file barbershop_app/app/(pages)/services/page.tsx
 * @description VERSÃO FINAL: Esta página busca os dados e retorna APENAS o conteúdo principal.
 * A Navbar e o Footer são gerenciados pelo layout.tsx.
 */

// A importação de React não é estritamente necessária em Server Components
// import React from "react";

// Apenas o componente de conteúdo da página é importado
import { ServicesSection } from "@/app/components/sections/servicesSection";

// Ferramentas para buscar dados no servidor
import connectDB from "@/lib/mongoose";
import Service from "@/models/Service";

/**
 * @page ServicesPage (Server Component)
 * @description Busca todos os serviços no servidor antes de renderizar a página.
 */
export default async function ServicesPage() {
  
  // 1. A lógica de busca de dados continua a mesma e está correta
  await connectDB();
  const servicesData = await Service.find({}).sort({ createdAt: 1 }).lean();
  const services = JSON.parse(JSON.stringify(servicesData));

  // 2. O retorno agora é apenas o componente principal da página,
  // recebendo os dados que foram buscados aqui.
  return (
      <ServicesSection variant="full" initialServices={services} />
  );
}
