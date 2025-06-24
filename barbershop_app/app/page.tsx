/**
 * @file app/page.tsx
 * @description VERSÃO FINAL E CORRIGIDA: A página principal agora busca os dados
 * e renderiza apenas seu conteúdo exclusivo, usando os caminhos de importação corretos.
 */

// 1. IMPORTS CORRIGIDOS com o alias '@/'
import { HeroSection } from "@/app/components/sections/home/heroSection";
import { ServicesSection } from "@/app/components/sections/servicesSection";
import { ProductsSection } from "@/app/components/sections/productsSection";
import { CtaSection } from "@/app/components/sections/home/ctaSection";

// Ferramentas para buscar dados no servidor
import connectDB from "@/lib/mongoose";
import Service from "@/models/Service";
import Product from "@/models/Product";

/**
 * @page HomePage (Server Component)
 * @description A página principal busca os dados de pré-visualização
 * e renderiza as seções de conteúdo. A Navbar e o Footer vêm do layout.tsx.
 */
export default async function HomePage() {
  // Conecta ao banco e prepara as buscas
  await connectDB();

  // Busca os 3 primeiros serviços para a pré-visualização
  const servicesPromise = Service.find({}).limit(3).sort({ createdAt: 1 }).lean();
  
  // Busca todos os produtos
  const productsPromise = Product.find({}).sort({ createdAt: -1 }).lean();

  // Executa as buscas em paralelo
  const [services, products] = await Promise.all([servicesPromise, productsPromise]);
  
  // Garante que os dados sejam serializáveis
  const safeServices = JSON.parse(JSON.stringify(services));
  const safeProducts = JSON.parse(JSON.stringify(products));

  // 2. JSX LIMPO: Retorna apenas o conteúdo da página
  return (
    <>
      <HeroSection />
      <ServicesSection variant="home" initialServices={safeServices} />
      <ProductsSection variant="full" initialProducts={safeProducts} />
      <CtaSection />
    </>
  );
}
