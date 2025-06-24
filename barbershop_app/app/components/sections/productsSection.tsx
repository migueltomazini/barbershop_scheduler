// app/components/sections/productsSection.tsx

import React from "react";
// NOTE: Removed server-side data fetching and Product model import;
// data lookup is now handled at the page level.
import ProductsClientComponent from "./ProductsClientComponent";
import { ProductType } from "@/app/types";

/**
 * Props for the ProductsSection component.
 *
 * @property {ProductType[]} initialProducts - Array of products to render.
 * @property {"home" | "full"} [variant="home"] - Display mode: 
 *   "home" shows a 4-item preview, "full" shows the entire collection.
 */
interface ProductsSectionProps {
  initialProducts: ProductType[];
  variant?: "home" | "full";
}

/**
 * ProductsSection
 *
 * A pass-through wrapper component that forwards its props
 * to the client-side ProductsClientComponent. It no longer
 * performs any data fetching or error handling; that responsibility
 * now belongs to the page that imports this section.
 *
 * @param {ProductsSectionProps} props - Component props.
 * @returns {JSX.Element} The ProductsClientComponent with the given data.
 */
export const ProductsSection = ({
  initialProducts,
  variant = "home",
}: ProductsSectionProps) => {
  return (
    <ProductsClientComponent
      initialProducts={initialProducts}
      variant={variant}
    />
  );
};
