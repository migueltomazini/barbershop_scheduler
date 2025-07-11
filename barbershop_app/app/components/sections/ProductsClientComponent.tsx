// app/components/sections/ProductsClientComponent.tsx
// Provides a versatile products UI, supporting both a homepage preview and a full shop view,
// with search filtering, detailed modal popups, and integration with the cart context.

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ProductCard } from "../ui/productCard";
import { Input } from "../ui/input";
import { useCart } from "@/app/contexts/CartContext";
import { ProductType } from "@/app/types";
import { Search, ShoppingCart, X } from "lucide-react";

/**
 * Props for the ProductsClientComponent.
 *
 * @property {ProductType[]} initialProducts - The complete list of products to render.
 * @property {"home" | "full"} [variant="home"] - Determines layout: a 4-item home preview or the full catalogue.
 */
type ProductsClientProps = {
  initialProducts: ProductType[];
  variant?: "home" | "full";
};

/**
 * ProductsClientComponent
 *
 * Renders a grid of product cards. In 'home' mode, displays a brief preview
 * with a CTA button linking to the full shop. In 'full' mode, provides a
 * searchable gallery, product detail modal, and "Add to Cart" functionality.
 */
export default function ProductsClientComponent({
  initialProducts,
  variant = "home",
}: ProductsClientProps) {
  const isHome = variant === "home";

  // Products state initialized from props
  const [products] = useState<ProductType[]>(initialProducts);
  // Search term state for filtering products
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Currently selected product for modal display
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  // Cart context for adding items
  const { addItem } = useCart();

  // Determine which subset to render based on variant
  const productsToDisplay = isHome ? products.slice(0, 4) : products;

  // Filter products matching search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Adds a product to the shopping cart context.
   * @param product - The product to add.
   */
  const handleAddToCart = (product: ProductType) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
      description: product.description,
    });
  };

  /**
   * Closes the product detail modal.
   */
  const handleCloseModal = () => setSelectedProduct(null);

  // Homepage variant: preview section
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
            {productsToDisplay.map((product) => (
              <ProductCard key={product._id} product={product} />
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

  // Full shop variant: search and modal functionality
  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Header and description */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-barber-brown mb-4">
          Premium Barber Products
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Shop our collection of professional barber products, from styling tools to grooming essentials.
        </p>
      </div>

      {/* Search input with icon */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10 border-barber-cream"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-barber-cream hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="h-full w-full object-cover"
                width={1000}
                height={1000}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-barber-navy">
                {product.name}
              </h3>
              <p className="text-barber-gold font-medium mb-2">
                ${product.price.toFixed(2)}
              </p>
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

      {/* No results fallback */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse our categories.
          </p>
        </div>
      )}

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <div className="mb-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded"
                width={1000}
                height={1000}
              />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {selectedProduct.name}
            </h2>
            <p className="text-barber-gold font-semibold mb-2">
              ${selectedProduct.price.toFixed(2)}
            </p>
            <p className="text-muted-foreground mb-4">
              {selectedProduct.description}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(selectedProduct);
                  handleCloseModal();
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
