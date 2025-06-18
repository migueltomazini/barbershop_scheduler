/**
 * @file barbershop_app/app/components/sections/login/loginForm.tsx
 * @description This file contains the reusable LoginForm component, which includes fields for email and password,
 * a password visibility toggle, and a submit button with a loading state.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

import { Eye, EyeOff } from "lucide-react";

/**
 * @interface LoginFormProps
 * @description Defines the properties for the LoginForm component.
 * @property {(email: string, password: string) => Promise<void>} onSubmit - The async function to call when the form is submitted.
 * @property {boolean} isLoading - A boolean to indicate if the form is in a loading state (e.g., waiting for API response).
 */
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * @component LoginForm
 * @description A form component for user login. It manages its own internal state for email, password,
 * and password visibility, and calls a parent-provided onSubmit function.
 * @param {LoginFormProps} props - The props for the component.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  // State for the form's input fields.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to toggle password visibility.
  const [showPassword, setShowPassword] = useState(false);

  /**
   * @function handleSubmit
   * @description Prevents default form submission and calls the parent's onSubmit handler.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email input field. */}
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="text"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="username"
        />
      </div>

      {/* Password input field with visibility toggle and a "Forgot password?" link. */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="login-password">Password</Label>
          <Link href="/forgot-password">
            <span className="text-sm text-barber-brown hover:underline cursor-pointer">
              Forgot password?
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
            className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown pr-10"
            autoComplete="current-password"
          />
          {/* Button to toggle password visibility. */}
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

      {/* Submit button, disabled during loading state. */}
      <Button
        type="submit"
        className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white py-3 text-lg"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
