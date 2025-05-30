"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { CartItemsSection } from "@/app/components/sections/cart/cartItemsSection";
import { OrderSummary } from "@/app/components/sections/cart/orderSummary";
import { PaymentForm } from "@/app/components/sections/cart/paymentDetails";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";

import { ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    processCheckout,
    totalPrice,
    totalItems
  } = useCart();

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // State variables to hold payment form inputs
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handler for form submission (checkout)
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in before proceeding
    if (!isAuthenticated) {
      toast.error("Please log in to complete your purchase.");
      router.push("/login?redirect=/cart");
      return;
    }

    // Check if cart is empty before proceeding
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add some items before checkout.");
      return;
    }

    // Validate that all payment fields are filled
    if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
      toast.error("Please fill in all payment details.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Processing your order...", { id: "processing-toast" });

    const checkoutSuccessful = await processCheckout();

    toast.dismiss("processing-toast"); 

    if (checkoutSuccessful) {
      toast.success("Payment successful and stock updated! Redirecting...");
      router.push("/checkoutSuccess");
    } else {
      toast.error("Checkout failed. Please try again or contact support.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          // Display this when cart is empty
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
          // Show cart items and payment summary when cart has items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <CartItemsSection
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
              {cartItems.length > 0 && (
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
              )}
            </div>

            {/* Order Summary and Payment Form Column */}
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
      </main>
      <Footer />
    </div>
  );
}
