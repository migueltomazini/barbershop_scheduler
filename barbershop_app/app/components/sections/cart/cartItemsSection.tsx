/**
 * @file barbershop_app/app/components/sections/cart/cartItemsSection.tsx
 * @description This component renders the list of items currently in the shopping cart.
 * It handles the display for both an empty cart and a cart with items.
 */

import React from "react";
import Link from "next/link";

import { CartItemCard } from "../../ui/cartItemCard";
import { CartItem } from "@/app/contexts/CartContext";
import { Button } from "../../ui/button";

/**
 * @interface CartItemsSectionProps
 * @description Defines the properties for the CartItemsSection component.
 * @property {CartItem[]} items - The array of items in the cart.
 * @property {(id: string, type: "product" | "service", quantity: number) => void} onUpdateQuantity - Callback to update an item's quantity.
 * @property {(id: string, type: "product" | "service") => void} onRemoveItem - Callback to remove an item from the cart.
 */
interface CartItemsSectionProps {
  items: CartItem[];
  onUpdateQuantity: (
    id: string,
    type: "product" | "service",
    quantity: number
  ) => void;
  onRemoveItem: (id: string, type: "product" | "service") => void;
}

/**
 * @component CartItemsSection
 * @description A section that displays a list of items in the user's shopping cart.
 * It uses the CartItemCard component for each item.
 * @param {CartItemsSectionProps} props - The props for the component.
 */
export const CartItemsSection: React.FC<CartItemsSectionProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  // If the cart is empty, display a message and a link to the shop.
  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
        <p className="text-xl text-gray-700 font-semibold mb-2">
          Your cart is empty.
        </p>
        <p className="text-md text-gray-500 mb-6">
          How about adding some products or scheduling a service?
        </p>
        <Link href="/shop">
          <Button className="bg-barber-gold text-black px-6 py-3 rounded-md hover:bg-barber-dark-gold transition-colors duration-300">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  // If there are items, map over them and render a CartItemCard for each one.
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={`${item.type}-${item.id}`}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};
