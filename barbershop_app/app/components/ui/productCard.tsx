import React from "react";

import { Button } from "../ui/button";
import { ProductType } from "../../../app/types";

import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: ProductType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
