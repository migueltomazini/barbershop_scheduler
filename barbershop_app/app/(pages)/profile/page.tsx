/**
 * @file app/(pages)/profile/page.tsx
 * @description
 * This page renders the authenticated user's profile page.
 * 
 * Key Features:
 * - Server-side session validation via cookies using Next.js's native support.
 * - Securely connects to the MongoDB database via Mongoose.
 * - Fetches the current authenticated user's data.
 * - Redirects unauthenticated users to the login page (with redirect back to profile).
 * - Renders the ProfileFormClient component with pre-filled user data.
 * 
 * Note:
 * This is a Server Component and relies on layout.tsx to provide common UI elements.
 */

import React from 'react';
import { redirect } from 'next/navigation';
import ProfileFormClient from '@/app/components/sections/profile/ProfileFormClient';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

// 1. Directly import the 'cookies' utility from Next.js
// Allows secure server-side access to HTTP cookies.
import { cookies } from 'next/headers';

/**
 * getServerSideUser
 * -----------------
 * This async helper function performs the following:
 * - Reads the 'session' cookie from the request.
 * - Parses the session to extract the userId.
 * - Connects to the MongoDB database using Mongoose.
 * - Queries the user by ID and returns the user document in plain JS format.
 * 
 * @returns {Object|null} The user document (plain object) or null if unauthenticated.
 */
async function getServerSideUser() {
  // 2. Read the session cookie from the server headers.
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  // Attempt to parse the session cookie to extract session data
  const session = JSON.parse(sessionCookie);
  if (!session?.userId) return null;

  // Connect to the MongoDB database before querying
  await connectDB();

  // Fetch the user by ID and return a plain JavaScript object
  const user = await User.findById(session.userId).lean();
  return user;
}

/**
 * ProfilePage
 * -----------
 * This is the main component responsible for rendering the profile page content.
 * It:
 * - Uses `getServerSideUser()` to verify session and fetch the user data.
 * - Redirects to the login page if no valid session/user is found.
 * - Serializes the user object to safely pass it to the client-side form component.
 * - Renders a heading and the <ProfileFormClient /> with the user's data.
 * 
 * @returns {JSX.Element} The rendered profile page.
 */
export default async function ProfilePage() {
  // Fetch the user from the server based on session cookie
  const user = await getServerSideUser();

  /**
   * Redirect Handling:
   * If the user is not logged in or session is invalid,
   * redirect them to the login page with a redirect query param.
   */
  if (!user) {
    redirect('/login?redirect=/profile');
  }

  /**
   * Data Serialization:
   * Converts the MongoDB user document to a JSON-safe object.
   * This ensures compatibility with React props and avoids serialization errors.
   */
  const safeUser = JSON.parse(JSON.stringify(user));

  /**
   * UI Rendering:
   * Displays a heading and a client-side form pre-filled with the user's profile data.
   */
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-serif text-barber-brown">
        My Profile
      </h1>
      <ProfileFormClient initialUser={safeUser} />
    </div>
  );
}
