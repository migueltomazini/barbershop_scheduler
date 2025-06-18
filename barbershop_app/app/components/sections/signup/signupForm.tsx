/**
 * @file barbershop_app/app/components/sections/signup/signupForm.tsx
 * @description This file contains the reusable SignupForm component, which includes fields for name, email, phone, password,
 * and confirm password, with password visibility toggles and a submit button with a loading state.
 */

"use client";

import React, { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

import { Eye, EyeOff } from "lucide-react";

/**
 * @interface SignupFormData
 * @description Defines the shape of the data for the signup form.
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address.
 * @property {string} phone - The user's phone number (optional).
 * @property {string} password - The user's chosen password.
 * @property {string} confirmPassword - The confirmation of the user's chosen password.
 */
interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/**
 * @interface SignupFormProps
 * @description Defines the properties for the SignupForm component.
 * @property {(formData: SignupFormData) => Promise<void>} onSubmit - The async function to call when the form is submitted,
 * receiving all form data.
 * @property {boolean} isLoading - A boolean to indicate if the form is in a loading state (e.g., waiting for API response).
 */
interface SignupFormProps {
  onSubmit: (formData: SignupFormData) => Promise<void>;
  isLoading: boolean;
}

/**
 * @component SignupForm
 * @description A form component for user registration. It manages its own internal state for all input fields
 * (name, email, phone, password, confirm password) and their respective visibility toggles,
 * calling a parent-provided onSubmit function with all form data upon submission.
 * @param {SignupFormProps} props - The props for the component.
 */
export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  // State for all form's input fields, initialized with empty strings.
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  // State to toggle the visibility of the password field.
  const [showPassword, setShowPassword] = useState(false);
  // State to toggle the visibility of the confirm password field.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * @function handleChange
   * @description Updates the form data state based on changes in input fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @function handleSubmit
   * @description Prevents default form submission and calls the parent's onSubmit handler
   * with the current form data.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name input field. */}
      <div>
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          name="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="name"
        />
      </div>
      {/* Email input field. */}
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          name="email"
          placeholder="youremail@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 border-barber-cream focus:border-barber-brown focus:ring-barber-brown"
          autoComplete="email"
        />
      </div>
      {/* Phone number input field (optional). */}
      <div>
        <Label htmlFor="signup-phone">Phone (optional)</Label>
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
      {/* Password input field with visibility toggle. */}
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative mt-1">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown pr-10"
            autoComplete="new-password"
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
      {/* Confirm Password input field with visibility toggle. */}
      <div>
        <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
        <div className="relative mt-1">
          <Input
            id="signup-confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border-barber-cream focus:border-barber-brown focus:ring-barber-brown pr-10"
            autoComplete="new-password"
          />
          {/* Button to toggle confirm password visibility. */}
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

      {/* Submit button, disabled during loading state. */}
      <Button
        type="submit"
        className="w-full bg-barber-brown hover:bg-barber-dark-brown text-white py-3 text-lg"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
