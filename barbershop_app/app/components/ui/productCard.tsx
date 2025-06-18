/**
 * @file barbershop_app/app/components/ui/productCard.tsx
 * @description This file contains the ProductCard component, a UI element for displaying a single product
 * in a grid or list format.
 */

import React from "react";

import { Button } from "../ui/button";
import { ProductType } from "../../../app/types";

import { ShoppingBag } from "lucide-react";

/**
 * @interface ProductCardProps
 * @description Defines the properties for the ProductCard component.
 * @property {ProductType} product - The product data to display.
 */
interface ProductCardProps {
  product: ProductType;
}

/**
 * @component ProductCard
 * @description Renders a card for a single product, showing its image, name, price, and an "Add to Cart" button.
 * @param {ProductCardProps} props - The props for the component.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Product Image Section */}
      <div
        className="h-48 bg-gray-200"
        style={
          product.image
            ? {
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      ></div>
      {/* Product Details Section */}
      <div className="p-4">
        <h3 className="font-bold mb-1 text-barber-navy">{product.name}</h3>
        <p className="text-barber-gold font-medium">
          ${product.price.toFixed(2)}
        </p>
        <Button className="w-full mt-3 text-white bg-barber-navy hover:bg-barber-navy/90">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
