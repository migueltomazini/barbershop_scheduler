// app/(pages)/cart/page.tsx

import React from 'react';
import CartClientPage from '@/app/components/sections/cart/CartClientPage';

// The logic to fetch the user's session remains here,
// as it is required for rendering the page content.
async function getUserSession() {
  // In a real application, use NextAuth.js or another authentication solution.
  return {
    isAuthenticated: true, 
    user: {
      _id: "66763a81282136e3c8332f14" // EXAMPLE - USE A VALID _ID
    }
  };
}

/**
 * @page CartPage (Server Component)
 * @description This page fetches the user session and renders only the main cart component.
 * The Navbar and Footer are handled by layout.tsx.
 * 
 * @returns {JSX.Element} The main container rendering the CartClientPage
 *                        with user session data passed as props.
 */
export default async function CartPage() {
  const session = await getUserSession();

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CartClientPage 
        isAuthenticated={session.isAuthenticated}
        userId={session.user?._id}
      />
    </main>
  );
}
