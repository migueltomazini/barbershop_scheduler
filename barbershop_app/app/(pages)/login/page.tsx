// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Next.js routing
import { useAuth } from "@/app/contexts/AuthContext";
import { LoginForm } from "@/app/components/sections/loginForm";
import { Navbar } from "@/app/components/layout/navbar"; // Assuming you want Navbar
import { Footer } from "@/app/components/layout/footer";   // Assuming you want Footer
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // To get query parameters like 'redirect'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/"; // Default to home if no redirect specified
      toast.info("Você já está logado.");
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);


  const handleLoginSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Por favor, insira o email e a senha.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password); // login function from AuthContext

      if (success) {
        toast.success("Login bem-sucedido!");
        const redirectPath = searchParams.get("redirect") || "/"; // Get redirect path or default to home
        router.push(redirectPath);
      } else {
        toast.error("Email ou senha inválidos. Por favor, tente novamente.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro durante o login. Tente mais tarde.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, show a loading/redirecting message or nothing
  if (isAuthenticated) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Redirecionando...</p>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-barber-brown">
              Bem-vindo de Volta!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Faça login na sua conta para agendar horários e comprar produtos.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-barber-cream">
            <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/signup"> {/* Placeholder link for signup */}
                  <span className="font-medium text-barber-brown hover:underline cursor-pointer">
                    Crie uma agora
                  </span>
                </Link>
              </p>
            </div>

            {/* Demonstration Credentials */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="text-xs text-muted-foreground mb-2 text-center">
                Para demonstração:
              </div>
              <div className="text-xs bg-gray-100 p-3 rounded-md text-gray-600 space-y-1">
                <p>
                  Usuário Admin: email <strong>admin</strong> / senha <strong>admin</strong>
                </p>
                <p>
                  Usuário Cliente: email <strong>client@example.com</strong> / senha <strong>password</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}