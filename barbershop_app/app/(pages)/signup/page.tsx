"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth, SignupData } from "@/app/contexts/AuthContext";

import { SignupForm } from "@/app/components/sections/signupForm";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/";
      toast.info("Você já está logado.");
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);

  // Handle signup form submission
  const handleSignupSubmit = async (formData: SignupData) => {
    const { name, email, phone, password, confirmPassword } =
      formData as SignupData & { confirmPassword?: string };

    if (!name || !email || !password) {
      toast.error("Por favor, preencha nome, email e senha.");
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password && password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // Call the signup function from AuthContext
      const result = await signup({ name, email, phone, password });

      if (result.success) {
        toast.success("Conta criada e login realizado com sucesso!");
        const redirectPath = searchParams.get("redirect") || "/";
        router.push(redirectPath);
      } else {
        toast.error(result.message || "Não foi possível criar a conta.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao criar a conta. Tente mais tarde.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Default signup page render
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-barber-brown">
              Crie sua Conta
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Junte-se a nós para agendar seus horários e comprar produtos
              exclusivos.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-barber-cream">
            <SignupForm onSubmit={handleSignupSubmit} isLoading={isLoading} />

            {/* Link to login page */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login">
                  <span className="font-medium text-barber-brown hover:underline cursor-pointer">
                    Faça login aqui
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
