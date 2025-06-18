/**
 * @file barbershop_app/app/components/sections/cart/paymentDetails.tsx
 * @description This component contains the payment form for the checkout process.
 * It handles user authentication checks and credit card input fields.
 */

"use client";

import React from "react";
import Link from "next/link";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

import { CreditCard, LogIn } from "lucide-react";

/**
 * @interface PaymentFormProps
 * @description Defines the properties for the PaymentForm component.
 * @property {boolean} isAuthenticated - Indicates if the user is logged in.
 * @property {string} cardName - The value for the cardholder name input.
 * @property {(value: string) => void} setCardName - State setter for cardholder name.
 * @property {string} cardNumber - The value for the card number input.
 * @property {(value: string) => void} setCardNumber - State setter for card number.
 * @property {string} cardExpiry - The value for the card expiration date input.
 * @property {(value: string) => void} setCardExpiry - State setter for card expiration date.
 * @property {string} cardCVC - The value for the card CVC input.
 * @property {(value: string) => void} setCardCVC - State setter for card CVC.
 * @property {boolean} isProcessing - Indicates if the payment is currently being processed.
 * @property {(e: React.FormEvent) => void} handleCheckout - Callback function to handle form submission.
 * @property {number} totalPrice - The total price to be paid.
 * @property {boolean} cartIsEmpty - Indicates if the cart is empty.
 */
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
  totalPrice: number;
  cartIsEmpty: boolean;
}

/**
 * @component PaymentForm
 * @description Renders the payment details form. If the user is not authenticated, it shows a login prompt instead.
 * @param {PaymentFormProps} props - The props for the component.
 */
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
      {/* If the user is not authenticated, show a login prompt. */}
      {!isAuthenticated ? (
        <div className="text-center py-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-4">
            Please log in to complete your purchase.
          </p>
          {/* This link redirects to the login page and includes a query parameter to return the user to the cart after logging in. */}
          <Link href="/login?redirect=/cart">
            <Button className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Login to Continue
            </Button>
          </Link>
        </div>
      ) : (
        // If authenticated, show the payment form.
        <form onSubmit={handleCheckout}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Payment Details
          </h2>
          <div className="space-y-4">
            {/* Cardholder Name Input */}
            <div>
              <Label
                htmlFor="payment-cardName"
                className="text-sm font-medium text-gray-700"
              >
                Name on Card
              </Label>
              <Input
                id="payment-cardName"
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold"
                required
                autoComplete="cc-name"
              />
            </div>

            {/* Card Number Input */}
            <div>
              <Label
                htmlFor="payment-cardNumber"
                className="text-sm font-medium text-gray-700"
              >
                Card Number
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

            {/* Expiration Date and CVC inputs, arranged side-by-side. */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="payment-cardExpiry"
                  className="text-sm font-medium text-gray-700"
                >
                  Expiration Date
                </Label>
                <Input
                  id="payment-cardExpiry"
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold"
                  required
                  autoComplete="cc-exp"
                />
              </div>
              <div>
                <Label
                  htmlFor="payment-cardCVC"
                  className="text-sm font-medium text-gray-700"
                >
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

            {/* Submit Payment Button with dynamic text and disabled state. */}
            <Button
              type="submit"
              className="w-full bg-barber-gold hover:bg-barber-dark-gold text-black py-3 text-lg font-semibold mt-4"
              disabled={isProcessing || cartIsEmpty}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ${totalPrice.toFixed(2)}
                </>
              )}
            </Button>

            {/* A small disclaimer for the user. */}
            <p className="text-xs text-muted-foreground text-center mt-2">
              For demonstration purposes only. No actual payment will be
              processed.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
