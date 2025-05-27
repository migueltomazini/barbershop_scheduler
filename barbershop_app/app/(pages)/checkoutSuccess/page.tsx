"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Context imports
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';
// Component imports
import { Button } from "@/app/components/ui/button";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";  

import { CheckCircle, Calendar, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { clearCart, items } = useCart(); // Get items to check if cart was already cleared
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login.
    // This is a good practice, though the cart page should prevent unauth checkout.
    if (!isAuthenticated) {
      toast.error("Acesso não autorizado. Por favor, faça login.");
      router.push("/login");
      return;
    }

    // Clear the cart only if it hasn't been cleared yet by this session on this page
    // This prevents multiple clearCart calls if the component re-renders for other reasons
    // or if the user navigates back and forth quickly.
    if (items.length > 0) {
      clearCart();
      // You might want to notify the user, but the success message is usually enough.
      // toast.info("Seu carrinho foi esvaziado após a compra.");
    }
  }, [isAuthenticated, router, clearCart, items]); // Add items to dependency array

  // If user is not authenticated and somehow reaches here,
  // the effect above will redirect. Can add a loading/placeholder.
  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
                <p>Redirecionando...</p>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar /> {/* Included for consistent layout */}
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-lg shadow-xl border border-barber-cream p-8 sm:p-10">
            <CheckCircle className="text-green-500 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6" />

            <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-serif text-barber-brown">
              Pagamento Realizado com Sucesso!
            </h1>

            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              Obrigado pela sua compra. Seu pedido foi processado e um e-mail de confirmação foi enviado (simulação).
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button className="w-full bg-barber-navy hover:bg-barber-navy/90 text-white px-6 py-3 text-base">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Continuar Comprando
                </Button>
              </Link>

              <Link href="/appointments" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-barber-brown text-barber-brown hover:bg-barber-brown hover:text-white px-6 py-3 text-base"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar um Horário
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