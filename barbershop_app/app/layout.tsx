/**
 * @file barbershop_app/app/layout.tsx
 * @description This is the global Root Layout component for the SharpShears Barbershop app.
 * It sets up global providers, persistent layout structure (Navbar, Footer),
 * and handles session parsing from cookies.
 */

import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "sonner";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { cookies } from "next/headers";

/**
 * @constant metadata
 * @description Defines default SEO metadata for the entire app.
 */
export const metadata: Metadata = {
  title: "SharpShears Barbershop",
  description: "Premium grooming services",
};

/**
 * @component RootLayout
 * @description The top-level layout for the entire application.
 * It wraps all pages with Auth and Cart providers, shows the Navbar and Footer,
 * parses the session cookie, and renders page content inside a <main> tag.
 *
 * @param {React.ReactNode} children - The child pages or components to render inside the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Extracts the session cookie from request headers.
  const sessionCookie = cookies().get('session')?.value;
  let session = null;

  // Parses the session JSON if available.
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie);
    } catch (error) {
      session = null;
    }
  }

  return (
    <html lang="en">
      <body>
        {/* Provide authentication context with session data */}
        <AuthProvider serverSession={session}>
          {/* Provide cart context for shopping cart state */}
          <CartProvider>
            {/* Persistent navigation bar, always visible */}
            <Navbar session={session} />
            {/* Main page content */}
            <main className="flex-grow">{children}</main>
            {/* Persistent footer */}
            <Footer />
            {/* Global toast notifications */}
            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
