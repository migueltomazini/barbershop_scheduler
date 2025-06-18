/**
 * @file barbershop_app/app/components/sections/cart/orderSummary.tsx
 * @description This component displays a summary of the order, including subtotal, shipping, and total price.
 */

"use client";

import React from "react";

/**
 * @interface OrderSummaryProps
 * @description Defines the properties for the OrderSummary component.
 * @property {number} totalPrice - The total price of all items in the cart.
 * @property {number} totalItems - The total number of items in the cart.
 */
interface OrderSummaryProps {
  totalPrice: number;
  totalItems: number;
}

/**
 * @component OrderSummary
 * @description A component that displays a summarized breakdown of the cart's contents and total cost.
 * @param {OrderSummaryProps} props - The props for the component.
 */
export const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalPrice,
  totalItems,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-barber-cream p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
      <div className="space-y-2 mb-4">
        {/* Subtotal row, dynamically displays the number of items. */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>

        {/* Shipping row, currently hardcoded as free. */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-semibold">Free</span>
        </div>

        {/* Final total display after a separator. */}
        <div className="border-t pt-3 mt-3 border-barber-cream">
          <div className="flex justify-between font-bold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-barber-gold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
