// app/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { CartItemsSection } from "@/app/components/sections/cartItemsSection";
import { OrderSummary } from "@/app/components/sections/orderSummary";
import { PaymentForm } from "@/app/components/sections/paymentDetails";
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from "@/app/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems
  } = useCart();

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // State for payment form fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Authentication and cart checks remain crucial
    if (!isAuthenticated) {
      toast.error("Por favor, faça login para completar sua compra.");
      router.push("/login?redirect=/cart"); // Redirect to login, then back to cart
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio. Adicione alguns itens antes de finalizar.");
      return;
    }

    // Form validation for payment details
    if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
      toast.error("Por favor, preencha todos os detalhes do pagamento.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Processando seu pedido...", { id: "processing-toast" });

    // Simulate payment processing
    setTimeout(() => {
      toast.dismiss("processing-toast");
      toast.success("Pagamento realizado com sucesso! Redirecionando...");
      // The cart will be cleared on the checkout-success page
      router.push("/checkoutSuccess");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900">
          Seu Carrinho de Compras
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md border border-barber-cream">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6">
              Parece que você ainda não adicionou nenhum produto ao seu carrinho.
            </p>
            <Link href="/shop">
              <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white px-8 py-3 text-lg">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        ) : (
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
                            toast.info("Seu carrinho foi esvaziado.");
                        }}
                        className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                        aria-label="Limpar carrinho"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar Carrinho
                    </Button>
                </div>
              )}
            </div>

            {/* Order Summary and Payment Form Column */}
            <div className="lg:col-span-1 space-y-6">
              <OrderSummary
                totalPrice={totalPrice}
                totalItems={totalItems}
              />
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