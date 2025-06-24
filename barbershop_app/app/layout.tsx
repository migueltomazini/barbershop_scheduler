// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "sonner";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "SharpShears Barbershop",
  description: "Premium grooming services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionCookie = cookies().get('session')?.value;
  let session = null;
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
        <AuthProvider serverSession={session}>
          <CartProvider>
            {/* O layout apenas CHAMA o componente Navbar */}
            <Navbar session={session} />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
