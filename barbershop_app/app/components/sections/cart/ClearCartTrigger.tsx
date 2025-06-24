// app/components/sections/cart/ClearCartTrigger.tsx
// A hidden trigger component that automatically clears the cart context upon mounting if items exist.

"use client";

import { useEffect } from 'react';
import { useCart } from '@/app/contexts/CartContext';

/**
 * ClearCartTrigger
 *
 * A client-only React component with no visible UI. On mount, it checks
 * the cart context for existing items and invokes clearCart() if any are present.
 * This ensures the cart is reset safely without duplicate operations.
 *
 * @component
 * @returns {null} Does not render any DOM elements.
 */
export function ClearCartTrigger() {
  const { clearCart, items } = useCart();

  useEffect(() => {
    // Only clear when there are items to avoid unnecessary context updates
    if (items.length > 0) {
      clearCart();
    }
  }, [clearCart, items]);

  return null;
}
