// app/(pages)/signup/page.tsx
import React from 'react';
// import { Navbar } from '@/app/components/layout/navbar'; // <-- REMOVIDO
// import { Footer } from '@/app/components/layout/footer'; // <-- REMOVIDO
import { SignupForm } from '@/app/components/sections/signup/signupForm';
import Link from 'next/link';

export default function SignupPage() {
  // O return agora não tem mais a Navbar, o Footer, ou a div externa
  return (
    <main className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-barber-cream">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-barber-brown">Create Your Account</h1>
          <p className="text-muted-foreground">Join us and book your next appointment with ease.</p>
        </div>
        
        <SignupForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <span className="font-semibold text-barber-brown hover:underline">Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
