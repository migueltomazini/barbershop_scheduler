"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Context imports
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
// Component imports
import { Button } from "@/app/components/ui/button";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";

import { CheckCircle, Calendar, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { clearCart, items } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not authenticated.
    // This is a safeguard; normally unauthorized users shouldn't reach checkout success page.
    if (!isAuthenticated) {
      toast.error("Unauthorized access. Please log in.");
      router.push("/login");
      return;
    }

    // Clear cart only if it still contains items
    if (items.length > 0) {
      clearCart();
    }
  }, [isAuthenticated, router, clearCart, items]);

  // Show redirecting message while redirecting unauthorized users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <p>Redirecting...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-2xl w-1000 text-center">
          <div className="bg-white rounded-lg shadow-xl border border-barber-cream p-8 sm:p-10">
            {/* Success icon */}
            <CheckCircle className="text-green-500 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6" />

            {/* Message */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-serif text-barber-brown">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              Thank you for your purchase. Your order has been processed and a
              confirmation email has been sent (simulated).
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button className="w-full bg-barber-navy hover:bg-barber-navy/90 text-white px-6 py-3 text-base">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/appointments" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-barber-brown text-barber-brown hover:bg-barber-brown hover:text-white px-6 py-3 text-base"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule an Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
