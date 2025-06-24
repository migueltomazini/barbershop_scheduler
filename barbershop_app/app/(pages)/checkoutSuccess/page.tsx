/**
 * @file barbershop_app/app/(pages)/checkoutSuccess/page.tsx
 * @description VERSÃO FINAL: Esta página agora verifica a sessão diretamente
 * lendo os cookies no servidor, sem depender de um arquivo externo.
 */

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ClearCartTrigger } from "@/app/components/sections/cart/ClearCartTrigger";
import { CheckCircle, Calendar, ShoppingBag } from "lucide-react";

// 1. Importa a função 'cookies' diretamente
import { cookies } from "next/headers";

export default function CheckoutSuccessPage() {
  // 2. A verificação de segurança agora é feita diretamente aqui
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    // Se não houver cookie, redireciona para o login.
    redirect("/login");
  }

  return (
    // O return não precisa mais do layout externo, pois o layout.tsx já cuida disso.
    <>
      <ClearCartTrigger />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-lg shadow-xl border border-barber-cream p-8 sm:p-10">
            <CheckCircle className="text-green-500 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-serif text-barber-brown">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              Thank you for your purchase. Your order has been processed and a
              confirmation email has been sent (simulated).
            </p>
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
                  View Appointments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
