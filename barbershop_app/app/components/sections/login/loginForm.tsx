// app/components/sections/login/loginForm.tsx
// Renders the client-side login form, handles submission via a server action, and supports redirect callbacks.

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

/**
 * LoginForm
 *
 * A React functional component rendering a login form with email/username and password fields.
 * - Toggles password visibility.
 * - Captures an optional 'redirect' query parameter for post-login navigation.
 * - Submits credentials via loginAction and displays toast notifications for errors.
 *
 * @component
 * @returns {JSX.Element} The login form UI.
 */
export const LoginForm: React.FC = () => {
  // Local UI state for password visibility and submission loading
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Read URL search parameters to capture redirect target after login
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('redirect');

  /**
   * handleSubmit
   *
   * Processes form submission:
   * 1. Prevents default HTML form behavior.
   * 2. Appends 'callbackUrl' to FormData if present.
   * 3. Calls the login server action.
   * 4. Shows error toast on failure.
   * 5. Manages loading state accordingly.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
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
      {/* Email/Username input */}
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          name="email"
          type="text"
          placeholder="Email or username"
          required
        />
      </div>

      {/* Password input with visibility toggle and forgot-password link */}
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
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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

      {/* Submit button changes label when loading */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
