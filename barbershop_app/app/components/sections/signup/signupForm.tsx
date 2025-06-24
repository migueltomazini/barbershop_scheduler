// app/components/sections/signup/signupForm.tsx
// Renders a signup form for new users, integrates password visibility toggles, and submits via server action.

"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import { signupAction } from "@/app/actions/authActions";

/**
 * SignupForm
 *
 * A React functional component providing fields for name, email, phone, password, and
 * password confirmation. Includes toggles to show/hide password inputs and a loading state.
 * Submits collected FormData to the signupAction server function and displays error toasts on failure.
 *
 * @component
 * @returns {JSX.Element} The signup form UI.
 */
export const SignupForm: React.FC = () => {
  // UI state for toggling visibility of password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Tracks whether the form submission is in progress
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSubmit
   *
   * Prevents default form submission, sets loading state,
   * collects form data, invokes the signupAction server action,
   * and handles potential error responses with toast notifications.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submission event
   */
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
      {/* Full Name Input */}
      <div>
        <Label htmlFor="signup-name">Full Name</Label>
        <Input id="signup-name" name="name" type="text" required />
      </div>

      {/* Email Input */}
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" name="email" type="email" required />
      </div>

      {/* Phone Input */}
      <div>
        <Label htmlFor="signup-phone">Phone</Label>
        <Input id="signup-phone" name="phone" type="tel" required />
      </div>

      {/* Password Input with visibility toggle */}
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
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

      {/* Confirm Password Input with visibility toggle */}
      <div>
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-barber-brown"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit Button with loading state */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
