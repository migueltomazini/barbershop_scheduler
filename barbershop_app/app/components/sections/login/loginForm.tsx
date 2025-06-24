// app/components/sections/login/loginForm.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import { loginAction } from "@/app/actions/authActions";

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  
  // 1. Buscando o parâmetro com o nome correto: 'redirect'
  const callbackUrl = searchParams.get('redirect');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // 2. Adicionamos o valor ao FormData com o nome que a action espera ('callbackUrl')
    if (callbackUrl) {
      formData.append('callbackUrl', callbackUrl);
    }
    
    const result = await loginAction(formData);

    if (result?.error) {
      toast.error(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" name="email" type="text" placeholder="Email or username" required />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="login-password">Password</Label>
          <Link href="/forgot-password"><span className="text-sm text-barber-brown hover:underline cursor-pointer">Forgot password?</span></Link>
        </div>
        <div className="relative">
          <Input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-barber-brown">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
