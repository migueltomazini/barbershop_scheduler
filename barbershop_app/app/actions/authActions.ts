/**
 * @file app/actions/authActions.ts
 * @description
 * Server-side authentication actions for login, signup, and logout.
 * 
 * This file handles:
 * - User login with session cookie creation
 * - User registration with validations
 * - User logout by clearing the session cookie
 * 
 * Key points:
 * - Uses Mongoose to connect and query MongoDB.
 * - Manages authentication state via HTTP-only cookies.
 * - Redirects users after actions using Next.js navigation utilities.
 * - Includes basic security measures such as cookie flags and validation.
 */

'use server';

import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'; // Used to read and set cookies

/**
 * loginAction
 * ----------------------
 * Handles user login by verifying email and password.
 * On success, creates a HTTP-only cookie with session data.
 * Redirects user to a callback URL or home page.
 * 
 * @param formData - FormData containing email, password, and optional callbackUrl.
 * @returns An error object on failure or performs redirect on success.
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string;

  try {
    await connectDB();
    // Find user and explicitly select password field (usually excluded by default)
    const user = await User.findOne({ email }).select('+password');

    // Basic credential check; no hashing in this example, consider adding it in real apps
    if (!user || password !== user.password) {
      return { error: "Invalid credentials." };
    }

    // Successful login: create session object
    const sessionData = { 
      userId: user._id.toString(), 
      name: user.name, 
      role: user.role 
    };

    // Set secure, HTTP-only session cookie with 1-day expiration
    cookies().set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }

  // Redirect to callbackUrl or root after successful login
  redirect(callbackUrl || '/');
}

/**
 * signupAction
 * ----------------------
 * Handles user registration by validating inputs, checking for existing users,
 * creating a new user document with role 'client', and then redirecting to login.
 * 
 * @param formData - FormData containing name, email, phone, password, confirmPassword.
 * @returns An error object on validation or creation failure, or redirects on success.
 */
export async function signupAction(formData: FormData) {
  // Extract form values
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Basic validation for presence and password confirmation
  if (!name || !email || !password || !confirmPassword) {
    return { error: "Please fill in all required fields." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    await connectDB();

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Create new user with default role 'client'
    await User.create({ name, email, password, phone, role: 'client' });
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
  
  // Redirect to login page with a success query param
  redirect('/login?signup=success');
}

/**
 * logoutAction
 * ----------------------
 * Clears the user's session by expiring the 'session' cookie immediately.
 * Then redirects the user to the login page.
 */
export async function logoutAction() {
  // Clear session cookie by setting expiration date to the past
  cookies().set('session', '', { expires: new Date(0), path: '/' });
  redirect('/login');
}
