/**
 * @file barbershop_app/app/components/sections/cart/paymentDetails.tsx
 * @description This component contains the payment form for the checkout process.
 * It handles user authentication, credit card input formatting, and strict field validation before submission.
 */

"use client";

import React, { useState } from "react";
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
 * @interface PaymentFormErrors
 * @description Defines the structure for storing validation error messages for the payment form.
 */
interface PaymentFormErrors {
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
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
  /**
   * @state errors
   * @description Holds the validation error messages for the form fields.
   */
  const [errors, setErrors] = useState<PaymentFormErrors>({});

  /**
   * @function validateForm
   * @description Performs a comprehensive validation of the payment form fields.
   * @returns {boolean} - Returns `true` if the form is valid, otherwise `false`.
   */
  const validateForm = (): boolean => {
    const newErrors: PaymentFormErrors = {};

    // 1. Validate Cardholder Name
    if (!cardName.trim()) {
      newErrors.cardName = "Cardholder name is required.";
    } else if (/\d/.test(cardName)) {
      newErrors.cardName = "Name should not contain numbers.";
    }

    // 2. Validate Card Number
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }

    // 3. Validate CVC
    const cleanedCVC = cardCVC.replace(/\D/g, "");
    if (cleanedCVC.length !== 3) {
      newErrors.cardCVC = "CVC must be 3 digits.";
    }

    // 4. Validate Expiration Date
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = "Invalid format. Use MM/YY.";
    } else {
      const [month, year] = cardExpiry.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.cardExpiry = "Invalid month.";
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.cardExpiry = "Card has expired.";
      }
    }

    setErrors(newErrors);
    // The form is valid if the newErrors object has no keys.
    return Object.keys(newErrors).length === 0;
  };

  /**
   * @function handleFormSubmit
   * @description A wrapper for the form's `onSubmit` event. It first validates the form.
   * If the form is valid, it proceeds with the `handleCheckout` function provided in props.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleCheckout(e);
    }
  };

  /**
   * @function handleInputChange
   * @description A generic handler to update state and clear the corresponding error message upon user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @param {(value: string) => void} setter - The state setter function for the field.
   * @param {keyof PaymentFormErrors} errorKey - The key for the field in the errors state object.
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
    errorKey: keyof PaymentFormErrors
  ) => {
    setter(e.target.value);
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  // Handlers for input formatting remain the same.
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = cleanedValue.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formattedValue);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let cleanedValue = value.replace(/\D/g, "").slice(0, 4);
    if (cleanedValue.length > 2) {
      cleanedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`;
    }
    setCardExpiry(cleanedValue);
    if (errors.cardExpiry) {
      setErrors((prev) => ({ ...prev, cardExpiry: undefined }));
    }
  };

  const handleCardCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\D/g, "").slice(0, 3); // CVC is 3 digits
    setCardCVC(cleanedValue);
    if (errors.cardCVC) {
      setErrors((prev) => ({ ...prev, cardCVC: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-barber-cream p-6">
      {!isAuthenticated ? (
        <div className="text-center py-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-4">
            Please log in to complete your purchase.
          </p>
          <Link href="/login?redirect=/cart">
            <Button className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Login to Continue
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
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
                onChange={(e) => handleInputChange(e, setCardName, "cardName")}
                className={`mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold ${
                  errors.cardName ? "border-red-500" : ""
                }`}
                autoComplete="cc-name"
              />
              {errors.cardName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
              )}
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
                onChange={handleCardNumberChange}
                className={`mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold ${
                  errors.cardNumber ? "border-red-500" : ""
                }`}
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiration Date and CVC inputs */}
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
                  onChange={handleCardExpiryChange}
                  className={`mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold ${
                    errors.cardExpiry ? "border-red-500" : ""
                  }`}
                  autoComplete="cc-exp"
                  maxLength={5}
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardExpiry}
                  </p>
                )}
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
                  onChange={handleCardCVCChange}
                  className={`mt-1 border-barber-cream focus:ring-barber-gold focus:border-barber-gold ${
                    errors.cardCVC ? "border-red-500" : ""
                  }`}
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength={3}
                />
                {errors.cardCVC && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-barber-gold hover:bg-barber-dark-gold text-black py-3 text-lg font-semibold mt-4"
              disabled={isProcessing || cartIsEmpty}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  {" "}
                  <CreditCard className="h-5 w-5 mr-2" /> Pay $
                  {totalPrice.toFixed(2)}
                </>
              )}
            </Button>

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
