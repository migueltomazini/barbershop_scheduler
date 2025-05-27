// app/components/cart/PaymentForm.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "../ui/label";
import { CreditCard, LogIn } from "lucide-react";

interface PaymentFormProps {
  isAuthenticated: boolean;
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCVC: string;
  setCardCVC: (value: string) => void;
  isProcessing: boolean;
  handleCheckout: (e: React.FormEvent) => void;
  totalPrice: number; // Needed for the "Pay $" button
  cartIsEmpty: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  isAuthenticated,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCVC,
  setCardCVC,
  isProcessing,
  handleCheckout,
  totalPrice,
  cartIsEmpty,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-barber-cream p-6">
      {!isAuthenticated ? (
        <div className="text-center py-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Login Necessário</h2>
          <p className="text-muted-foreground mb-4">
            Por favor, faça login para completar sua compra.
          </p>
          <Link href="/login?redirect=/cart">
            <Button className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Fazer Login para Continuar
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleCheckout}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Detalhes do Pagamento</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-cardName" className="text-sm font-medium text-gray-700">
                Nome no Cartão
              </Label>
              <Input
                id="payment-cardName" // Unique ID if Label is also outside a shared parent
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold"
                required
                autoComplete="cc-name"
              />
            </div>
            <div>
              <Label htmlFor="payment-cardNumber" className="text-sm font-medium text-gray-700">
                Número do Cartão
              </Label>
              <Input
                id="payment-cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold"
                required
                autoComplete="cc-number"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-cardExpiry" className="text-sm font-medium text-gray-700">
                  Validade
                </Label>
                <Input
                  id="payment-cardExpiry"
                  type="text"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold"
                  required
                  autoComplete="cc-exp"
                />
              </div>
              <div>
                <Label htmlFor="payment-cardCVC" className="text-sm font-medium text-gray-700">
                  CVC
                </Label>
                <Input
                  id="payment-cardCVC"
                  type="text"
                  placeholder="123"
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value)}
                  className="mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold"
                  required
                  autoComplete="cc-csc"
                  inputMode="numeric"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-barber-gold hover:bg-barber-dark-gold text-white py-3 text-lg font-semibold mt-4"
              disabled={isProcessing || cartIsEmpty}
            >
              {isProcessing ? (
                "Processando..."
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pagar ${totalPrice.toFixed(2)}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Apenas para fins de demonstração. Nenhum pagamento real será processado.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};