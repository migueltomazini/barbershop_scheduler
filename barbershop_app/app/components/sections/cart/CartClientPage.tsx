// app/components/sections/cart/CartClientPage.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/app/contexts/CartContext";

// Seus componentes de UI
import { CartItemsSection } from "./cartItemsSection";
import { OrderSummary } from "./orderSummary";
import { PaymentForm } from "./paymentDetails";
import { Button } from "@/app/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";

// A Server Action
import { checkoutAction } from "@/app/actions/cartActions";

interface CartClientPageProps {
  isAuthenticated: boolean;
  userId: string | undefined;
}

export default function CartClientPage({ isAuthenticated, userId }: CartClientPageProps) {
  // Hooks para o carrinho (como no seu código original)
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  // Estado para o formulário de pagamento
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * @function handleCheckout
   * @description A função de checkout agora chama a Server Action.
   */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Your cart is empty.");

    // Validação do formulário de pagamento... (pode ser mantida aqui)
    if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
      return toast.error("Please fill in all payment details.");
    }
    
    setIsProcessing(true);
    toast.loading("Processing your order...", { id: "checkout-toast" });

    try {
      // Chamando a Server Action de forma segura
      const result = await checkoutAction(cartItems, userId);

      // A Server Action agora lida com o redirecionamento em caso de sucesso.
      // Apenas precisamos tratar o caso de erro.
      if (result?.success === false) {
        throw new Error(result.message);
      }
      
      // O redirect na action vai acontecer, mas limpamos o carrinho por aqui.
      clearCart();

    } catch (error: any) {
      toast.dismiss("checkout-toast");
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  // O seu JSX permanece praticamente o mesmo
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900">
        Your Shopping Cart
      </h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <CartItemsSection
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
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