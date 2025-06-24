/**
 * @file app/components/sections/cart/CartClientPage.tsx
 * @description Client-facing component for displaying, managing, and checking out the shopping cart.
 * Integrates context-driven cart state, item operations, and a server action for checkout processing.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/app/contexts/CartContext";

// UI sections for rendering cart items, order summary, and payment details
import { CartItemsSection } from "./cartItemsSection";
import { OrderSummary } from "./orderSummary";
import { PaymentForm } from "./paymentDetails";
import { Button } from "@/app/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";

// Server Action responsible for processing the checkout
import { checkoutAction } from "@/app/actions/cartActions";

/**
 * Props for the CartClientPage component.
 *
 * @interface CartClientPageProps
 * @property {boolean} isAuthenticated - Indicates if the user is currently logged in.
 * @property {string | undefined} userId - Unique identifier for the authenticated user.
 */
interface CartClientPageProps {
  isAuthenticated: boolean;
  userId: string | undefined;
}

/**
 * CartClientPage
 *
 * Renders the shopping cart interface:
 * - Displays an empty state with a prompt to explore products when no items exist.
 * - Shows cart items with controls for quantity updates and removal.
 * - Provides a clear-cart button with confirmation feedback.
 * - Renders order summary and a payment form when items are in the cart.
 * - Handles checkout validation and delegates processing to a server action.
 *
 * @param {CartClientPageProps} props - Component properties.
 * @returns {JSX.Element} The rendered cart UI.
 */
export default function CartClientPage({ isAuthenticated, userId }: CartClientPageProps) {
  // Extract cart state and operations from context
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  // Local state for payment form inputs and processing status
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * handleCheckout
   *
   * Validates cart contents and payment fields,
   * displays a loading toast, invokes the checkout server action,
   * clears the cart on success, and handles errors with toasts.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent checkout if cart is empty
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Ensure all payment fields are filled
    if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
      toast.error("Please fill in all payment details.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Processing your order...", { id: "checkout-toast" });

    try {
      // Execute server-side checkout; redirection happens on success
      const result = await checkoutAction(cartItems, userId);
      if (result?.success === false) {
        throw new Error(result.message);
      }

      // Clear local cart state after successful checkout
      clearCart();
    } catch (error: any) {
      // Dismiss loading toast and show error
      toast.dismiss("checkout-toast");
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Page title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900">
        Your Shopping Cart
      </h1>

      {/* Render empty state when cartItems is empty */}
      {cartItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md border border-barber-cream">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link href="/shop">
            <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white px-8 py-3 text-lg">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        /* Display cart items and order summary/payment form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {/* Section listing all cart items with update and remove controls */}
            <CartItemsSection
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
            {/* Button to clear the entire cart */}
            <div className="mt-6 text-right">
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  toast.info("Your cart has been cleared.");
                }}
                className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                aria-label="Clear cart"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order summary and payment details */}
          <div className="lg:col-span-1 space-y-6">
            <OrderSummary totalPrice={totalPrice} totalItems={totalItems} />
            <PaymentForm
              isAuthenticated={isAuthenticated}
              cardName={cardName}
              setCardName={setCardName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCVC={cardCVC}
              setCardCVC={setCardCVC}
              isProcessing={isProcessing}
              handleCheckout={handleCheckout}
              totalPrice={totalPrice}
              cartIsEmpty={cartItems.length === 0}
            />
          </div>
        </div>
      )}
    </>
  );
}
