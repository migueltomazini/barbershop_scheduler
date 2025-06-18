/**
 * @file barbershop_app/app/(pages)/signup/page.tsx
 * @description This file contains the user registration (signup) page. It includes a form for new users
 * to create an account with their personal details, address, and password.
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/contexts/AuthContext";

import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

// Regular expressions for form validation.
const PHONE_REGEX = /^[0-9\s-()+]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const ZIP_CODE_REGEX = /^(?:[0-9]{5}(?:-[0-9]{4})?|[0-9]{5}-?[0-9]{3})$/;

// Type definition for the form errors state object.
type FormErrors = {
  [key: string]: string | null;
};

export default function SignupPage() {
  // State for form data, including address fields.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirects the user to the home page if they are already authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in.");
      router.push("/");
    }
  }, [isAuthenticated, router]);

  /**
   * @function handleChange
   * @description Updates form data on input change and clears any existing error for that field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error message for the field being edited.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    // Also clear confirmPassword error if the password field is changed.
    if (name === "password" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  /**
   * @function validateForm
   * @description Validates all form fields and sets the errors state.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      street,
      city,
      state,
      zip,
      country,
    } = formData;

    // Validate personal information.
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!EMAIL_REGEX.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (!PHONE_REGEX.test(phone))
      newErrors.phone = "Phone number contains invalid characters.";
    if (password.length < PASSWORD_MIN_LENGTH)
      newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    // Validate address information.
    if (!street.trim()) newErrors.street = "Street address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!state.trim()) newErrors.state = "State / Province is required.";
    if (!zip.trim()) {
      newErrors.zip = "ZIP / Postal code is required.";
    } else if (!ZIP_CODE_REGEX.test(zip)) {
      newErrors.zip = "Please enter a valid ZIP / Postal code.";
    }
    if (!country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);

    const errorMessages = Object.values(newErrors).filter(
      (msg) => msg !== null
    );
    if (errorMessages.length > 0) {
      toast.error("Please correct the following errors:", {
        description: (
          <ul className="list-disc list-inside">
            {errorMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ),
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  /**
   * @function handleSignupSubmit
   * @description Handles the signup form submission. It validates the form, then calls the
   * signup function from the AuthContext with the user's data.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Constructs the data object for the signup function, including the nested address.
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          country: formData.zip.trim(),
        },
      });

      if (result.success) {
        toast.success("Account created successfully! Welcome.");
        router.push("/");
      } else {
        toast.error(result.message || "Failed to create account.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render the page content if the user is already logged in (will be redirected).
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-barber-brown">
              Create an Account
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Join us to easily book appointments and manage your profile.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-barber-cream">
            <form
              onSubmit={handleSignupSubmit}
              className="space-y-6"
              noValidate
            >
              {/* --- Personal Information Section --- */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Personal Information
                </h3>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                </div>
              </div>

              {/* --- Shipping Address Section --- */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Shipping Address
                </h3>
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    type="text"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className={errors.street ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    type="text"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                    className={errors.zip ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className={errors.country ? "border-red-500" : ""}
                  />
                </div>
              </div>

              {/* --- Password Section --- */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Password
                </h3>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
                    className={errors.password ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full text-white bg-barber-brown hover:bg-barber-dark-brown"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-barber-brown hover:underline"
                >
                  Log in
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
