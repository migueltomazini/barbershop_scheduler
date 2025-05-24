
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";

import { CheckCircle, Calendar, ShoppingBag } from "lucide-react";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md border border-barber-cream p-8">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
          
          <h1 className="text-2xl font-bold mb-4 font-serif text-barber-brown">
            Payment Successful!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been processed and will be on its way soon.
          </p>
          
          <div className="flex flex-col gap-4">
            <Link href="/shop">
              <Button className="w-full bg-barber-navy hover:bg-barber-navy/90">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/appointments">
              <Button variant="outline" className="w-full border-barber-brown text-barber-brown hover:bg-barber-brown hover:text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Book an Appointment
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
