/**
 * @file barbershop_app/app/(pages)/checkoutSuccess/page.tsx
 * @description
 * This is the final version of the Checkout Success page.
 * It is responsible for rendering a confirmation message after a successful purchase.
 * 
 * Key features of this page:
 * - Performs server-side session validation by reading cookies directly using Next.js built-in tools.
 * - If no session cookie is found, the user is redirected to the login page.
 * - Clears the user's cart using the <ClearCartTrigger /> component.
 * - Displays a success message with two action buttons:
 *   1. Continue shopping (navigates to /shop).
 *   2. View appointments (navigates to /appointments).
 * - Relies on the layout.tsx file to wrap the content with consistent layout elements (e.g., Navbar, Footer).
 */

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ClearCartTrigger } from "@/app/components/sections/cart/ClearCartTrigger";
import { CheckCircle, Calendar, ShoppingBag } from "lucide-react";

// 1. Server-side cookie access
// This import allows reading cookies in a server component using Next.js 13+ "app" directory.
import { cookies } from "next/headers";

export default function CheckoutSuccessPage() {
  /**
   * Step 2: Session Validation
   * 
   * We access the cookies on the server using `cookies()` and attempt to retrieve the 'session' cookie.
   * This is a simplified simulation of user authentication — in a real app, NextAuth.js or another
   * authentication mechanism should be used to ensure security and manage session state.
   */
  const sessionCookie = cookies().get('session')?.value;

  /**
   * Redirect Handling:
   * If the session cookie is not found, the user is not authenticated.
   * In this case, the user is immediately redirected to the login page using Next.js's
   * built-in `redirect()` function from `next/navigation`.
   */
  if (!sessionCookie) {
    redirect("/login");
  }

  /**
   * UI Rendering:
   * If the session is valid, we proceed to render the success message along with the cart-clearing trigger.
   * The layout is centered and styled using Tailwind CSS utility classes.
   */
  return (
    <>
      {/**
       * ClearCartTrigger:
       * This component is responsible for resetting or clearing the shopping cart state
       * (e.g., after a successful checkout). It may handle context updates, local storage cleanup,
       * or server-side state depending on how it's implemented.
       */}
      <ClearCartTrigger />

      {/**
       * Main Container:
       * Uses responsive padding and flexbox to center the content both vertically and horizontally.
       */}
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-lg shadow-xl border border-barber-cream p-8 sm:p-10">
            
            {/**
             * Success Icon:
             * A checkmark icon displayed in green to indicate successful payment.
             */}
            <CheckCircle className="text-green-500 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6" />

            {/**
             * Heading:
             * Prominently displays the "Payment Successful!" message.
             */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-serif text-barber-brown">
              Payment Successful!
            </h1>

            {/**
             * Description Text:
             * Provides a short confirmation message to the user.
             */}
            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              Thank you for your purchase. Your order has been processed and a
              confirmation email has been sent (simulated).
            </p>

            {/**
             * Action Buttons:
             * Two main actions are provided to the user:
             * 1. Continue Shopping → navigates back to the shop.
             * 2. View Appointments → takes the user to their appointment page.
             * The buttons are responsive and stacked on small screens.
             */}
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
