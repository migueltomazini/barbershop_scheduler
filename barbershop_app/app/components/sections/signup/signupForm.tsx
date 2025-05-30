"use client";

import React, { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

import { Eye, EyeOff } from "lucide-react";

// Define the shape of the form data
interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  onSubmit: (formData: SignupFormData) => Promise<void>;
  isLoading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="signup-name">Nome Completo</Label>
        <Input
          id="signup-name"
          type="text"
          name="name"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="name"
        />
      </div>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          name="email"
          placeholder="seuemail@exemplo.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="signup-phone">Telefone (opcional)</Label>
        <Input
          id="signup-phone"
          type="tel"
          name="phone"
          placeholder="(XX) XXXXX-XXXX"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="tel"
        />
      </div>
      <div>
        <Label htmlFor="signup-password">Senha</Label>
        <div className="relative mt-1">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Pelo menos 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            required
            className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-barber-brown"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div>
        <Label htmlFor="signup-confirmPassword">Confirmar Senha</Label>
        <div className="relative mt-1">
          <Input
            id="signup-confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repita sua senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-barber-brown"
            aria-label={
              showConfirmPassword ? "Esconder senha" : "Mostrar senha"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white py-3 text-lg"
        disabled={isLoading}
      >
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
};
