/**
 * @file barbershop_app/app/components/sections/productsSection.tsx
 * @description This component is responsible for displaying a list of products. It can be rendered in two variants:
 * a limited preview on the homepage ('home') or a full, searchable catalog on the shop page ('full').
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "../ui/button";
import { ProductCard } from "../ui/productCard";
import { Input } from "../ui/input";

import { useCart } from "@/app/contexts/CartContext";

import { ProductType } from "@/app/types";
import { Search, ShoppingCart, X } from "lucide-react";

/**
 * @type ProductsSectionProps
 * @description Defines the properties for the ProductsSection component.
 * @property {'home' | 'full'} [variant] - Determines the layout and content. 'home' shows a preview, 'full' shows a complete catalog.
 */
type ProductsSectionProps = {
  variant?: "home" | "full";
};

/**
 * @component ProductsSection
 * @description A component that fetches and displays products. It supports different layouts, a search filter,
 * and a modal for viewing product details.
 * @param {ProductsSectionProps} props - The props for the component.
 */
export const ProductsSection = ({ variant = "home" }: ProductsSectionProps) => {
  const isHome = variant === "home";

  // State for products, loading status, and errors.
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for the full-page variant features.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const { addItem } = useCart();

  // Fetches product data from the API on component mount.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProductType[] = await response.json();
        setProducts(data);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "An unknown error occurred.";
        setError(`Failed to fetch products. ${message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Determines which products to display based on the variant.
  const productsToDisplay = isHome ? products.slice(0, 4) : products;

  // Filters products based on the search term for the 'full' variant.
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * @function handleAddToCart
   * @description Adds a specified product to the shopping cart using the CartContext.
   * @param {ProductType} product - The product to add.
   */
  const handleAddToCart = (product: ProductType) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
      description: product.description,
    });
  };

  const handleCloseModal = () => setSelectedProduct(null);

  // Loading state UI.
  if (loading) {
    return (
      <section className="bg-barber-cream py-16 text-center">
        <div className="container mx-auto px-4">
          <p className="text-barber-brown text-lg">Loading products...</p>
        </div>
      </section>
    );
  }

  // Error state UI.
  if (error) {
    return (
      <section className="bg-barber-cream py-16 text-center">
        <div className="container mx-auto px-4">
          <p className="text-red-500 text-lg">{error}</p>
          <p className="text-muted-foreground">
            Please ensure your JSON-Server is running on http://localhost:3001.
          </p>
        </div>
      </section>
    );
  }

  // Renders the 'home' variant with a title, a grid of 4 products, and a "Browse All" button.
  if (isHome) {
    return (
      <section className="bg-barber-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-serif text-barber-brown">
              Shop Premium Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Maintain your style with our selection of professional grooming
              products used by our barbers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsToDisplay.map((product) => (
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

  // Renders the 'full' variant with a search bar and a grid of all filtered products.
  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-barber-brown mb-4">
          Premium Barber Products
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Shop our collection of professional barber products, from styling
          tools to grooming essentials.
        </p>
      </div>

      {/* Search input field. */}
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

      {/* Grid of filtered products. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
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
                {product.quantity > 0
                  ? `${product.quantity} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message displayed when no products match the search term. */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse our categories.
          </p>
        </div>
      )}

      {/* Modal for displaying product details. */}
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
            <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-barber-gold font-semibold mb-2">
              ${selectedProduct.price.toFixed(2)}
            </p>
            <p className="text-muted-foreground mb-4">
              {selectedProduct.description}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the outer div's onClick from firing.
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
