// app/components/sections/productsSection.tsx

import React from "react";
// REMOVIDO: Não precisa mais de connectDB ou do modelo Product aqui.
import ProductsClientComponent from "./ProductsClientComponent";
import { ProductType } from "@/app/types";

// A props interface agora precisa incluir os produtos
interface ProductsSectionProps {
  initialProducts: ProductType[];
  variant?: "home" | "full";
}

/**
 * @component ProductsSection (Agora é um componente "pass-through")
 * @description Este componente agora apenas recebe os produtos e os repassa
 * para o componente de cliente apropriado.
 */
export const ProductsSection = ({ initialProducts, variant = "home" }: ProductsSectionProps) => {
  // A lógica de try/catch e busca de dados foi removida.
  // A página que usa esta seção é agora 100% responsável por buscar os dados.
  return <ProductsClientComponent initialProducts={initialProducts} variant={variant} />;
};
