// app/components/auth/LoginForm.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link"; // Use Next.js Link
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // For password visibility

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>; // The submission handler from the parent
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password); // Call the passed onSubmit function
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label> {/* Unique ID */}
        <Input
          id="login-email"
          type="text" // Changed from email to text to allow "admin" as username as per mock
          placeholder="Email ou nome de usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="username"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="login-password">Senha</Label> {/* Unique ID */}
          <Link href="/forgot-password"> {/* Placeholder link */}
            <span className="text-sm text-barber-brown hover:underline cursor-pointer">
              Esqueceu a senha?
            </span>
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown pr-10" // Add padding for icon
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-barber-brown"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white py-3 text-lg"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};