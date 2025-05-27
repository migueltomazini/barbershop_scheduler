"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/contexts/AuthContext";

import { LoginForm } from "@/app/components/sections/loginForm";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/";
      toast.info("You are already logged in.");
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);

  // Handle login form submission
  const handleLoginSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful!");
        const redirectPath = searchParams.get("redirect") || "/";
        router.push(redirectPath);
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // User is already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Redirecting...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Default login page render
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-barber-brown">
              Welcome Back!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Log in to your account to book appointments and purchase products.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-barber-cream">
            <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

            {/* Link to signup page */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link href="/signup">
                  <span className="font-medium text-barber-brown hover:underline cursor-pointer">
                    Create one now
                  </span>
                </Link>
              </p>
            </div>

            {/* Demo credentials for testing */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="text-xs text-muted-foreground mb-2 text-center">
                For demonstration:
              </div>
              <div className="text-xs bg-gray-100 p-3 rounded-md text-gray-600 space-y-1">
                <p>
                  Admin User: email <strong>admin</strong> / password{" "}
                  <strong>admin</strong>
                </p>
                <p>
                  Client User: email <strong>client@example.com</strong> /
                  password <strong>password</strong>
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
