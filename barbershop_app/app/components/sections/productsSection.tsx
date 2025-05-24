"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { ProductCard } from "../ui/productCard";
import { Input } from "../ui/input";
import { mockProducts } from "@/app/data/mockProducts";

import { useCart } from "@/app/contexts/CartContext";

import { ProductType } from "@/app/types";
import { Search, ShoppingCart, X } from "lucide-react";

type ServicesSectionProps = {
  variant?: "home" | "full";
};

export const ProductsSection = ({ variant = "home" }: ServicesSectionProps) => {
  const isHome = variant === "home";
  const servicesToShow = isHome ? mockProducts.slice(0, 4) : mockProducts;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const { addItem } = useCart();

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: ProductType) => {
    if (product.quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(`${product.name} added to your cart!`);
  };

  const handleCloseModal = () => setSelectedProduct(null);

  if (isHome) {
    return (
      <section className="bg-barber-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-serif text-barber-brown">
              Shop Premium Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Maintain your style with our selection of professional grooming products used by our barbers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesToShow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop">
              <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-barber-brown mb-4">
          Premium Barber Products
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Shop our collection of professional barber products, from styling tools to grooming essentials.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10 border-barber-cream"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-barber-cream hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Image src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-barber-navy">{product.name}</h3>
              <p className="text-barber-gold font-medium mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
              <span className="text-xs text-muted-foreground">
                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse our categories.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              <X size={20} />
            </button>
            <div className="mb-4">
              <Image src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded" />
            </div>
            <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-barber-gold font-semibold mb-2">${selectedProduct.price.toFixed(2)}</p>
            <p className="text-muted-foreground mb-4">{selectedProduct.description}</p>
            <div className="flex justify-end">
              <Button
                onClick={(e) => {
                  handleAddToCart(selectedProduct);
                  handleCloseModal();
                  e.stopPropagation();
                }}
                disabled={selectedProduct.quantity <= 0}
                className="bg-barber-navy hover:bg-barber-navy/90 text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
