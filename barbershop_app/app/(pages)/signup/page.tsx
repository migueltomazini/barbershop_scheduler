/**
 * @file app/(pages)/signup/page.tsx
 * @description
 * This file defines the Signup page, which serves as the registration interface for new users.
 * 
 * Key Features:
 * - Client-facing page for user account creation.
 * - Uses a clean, centered layout with Tailwind CSS for styling.
 * - Includes a reusable <SignupForm /> component to encapsulate form logic and validation.
 * - Encourages account creation while providing a link to the login page for returning users.
 * - Navbar and Footer were intentionally removed, as they are globally handled by layout.tsx.
 * 
 * Notes:
 * This page is a React Server Component using the Next.js App Router.
 */

import React from 'react';
// import { Navbar } from '@/app/components/layout/navbar'; // <-- REMOVED: Layout now handled globally
// import { Footer } from '@/app/components/layout/footer'; // <-- REMOVED: Layout now handled globally
import { SignupForm } from '@/app/components/sections/signup/signupForm';
import Link from 'next/link';

/**
 * SignupPage (Server Component)
 * -----------------------------
 * Main component responsible for rendering the signup interface.
 * 
 * Structure:
 * - Uses a full-height centered layout (`min-h-[80vh]`) to vertically center content on the page.
 * - Contains a single white card with rounded corners and shadow for modern UI appearance.
 * - The signup form is placed within the card using the reusable <SignupForm /> component.
 * - A footer message provides a link to the login page for users who already have an account.
 * 
 * @returns {JSX.Element} A responsive, styled registration page for new users.
 */
export default function SignupPage() {
  // The return now excludes the Navbar, Footer, or external wrapping divs,
  // since those are handled by the root layout.tsx in the app/ directory.

  return (
    <main className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-barber-cream">
        
        {/** Page Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-barber-brown">Create Your Account</h1>
          <p className="text-muted-foreground">
            Join us and book your next appointment with ease.
          </p>
        </div>

        {/** Signup Form Component */}
        <SignupForm />

        {/** Login Redirect Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <span className="font-semibold text-barber-brown hover:underline">
                Log in
              </span>
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
