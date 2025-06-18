/**
 * @file barbershop_app/app/layout.tsx
 * @description This is the root layout for the entire application. It wraps all pages with essential context providers
 * (AuthProvider, CartProvider) and includes the Toaster component for notifications.
 */

import "./globals.css";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "sonner"; // Component for displaying toast notifications.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* The AuthProvider makes authentication state available to the entire app. */}
        <AuthProvider>
          {/* The CartProvider makes shopping cart state available to the entire app. */}
          <CartProvider>
            {/* The `children` prop represents the current page being rendered. */}
            {children}
            {/* The Toaster component is positioned here to be available on all pages. */}
            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
