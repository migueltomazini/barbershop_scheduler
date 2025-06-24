// app/components/sections/signup/signupForm.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import { signupAction } from "@/app/actions/authActions";

export const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signupAction(formData);

    if (result?.error) {
      toast.error(result.error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... Seu JSX do formulário de signup continua aqui, sem alterações ... */}
      <div><Label>Full Name</Label><Input name="name" required /></div>
      <div><Label>Email</Label><Input name="email" type="email" required /></div>
      <div><Label>Phone</Label><Input name="phone" type="tel" required /></div>
      <div>
        <Label>Password</Label>
        <div className="relative"><Input name="password" type={showPassword ? "text" : "password"} required /><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <EyeOff/> : <Eye/>}</button></div>
      </div>
      <div>
        <Label>Confirm Password</Label>
        <div className="relative"><Input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required /><button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff/> : <Eye/>}</button></div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
