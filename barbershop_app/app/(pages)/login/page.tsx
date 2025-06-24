/**
 * @file app/(pages)/login/page.tsx
 * @description
 * This page serves as the login interface for the application.
 * 
 * Key Responsibilities:
 * - Reads the session cookie on the server side using Next.js's built-in `cookies()` function.
 * - Redirects authenticated users away from the login screen if they already have a session cookie.
 * - Renders a responsive and styled login form, including a link to the signup page.
 * - Relies on layout.tsx to handle common UI elements such as the Navbar and Footer.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/components/sections/login/loginForm";

// 1. Import the cookies() utility from Next.js
// Allows secure access to cookies on the server side.
import { cookies } from "next/headers";

export default function LoginPage() {
  /**
   * Step 2: Read the session cookie on the server side.
   * 
   * The 'cookies()' function accesses HTTP cookies in a server component.
   * We check for the existence of a 'session' cookie to determine
   * if the user is already authenticated.
   */
  const sessionCookie = cookies().get('session')?.value;

  /**
   * If the session cookie is present, the user is considered logged in.
   * Therefore, we redirect them to the home page to prevent them
   * from seeing the login screen unnecessarily.
   */
  if (sessionCookie) {
    redirect("/");
  }

  /**
   * Render the login form.
   * 
   * This component is only shown to unauthenticated users (i.e., those without a session cookie).
   * The layout includes:
   * - A centered container for the form.
   * - A heading welcoming the user back.
   * - A <LoginForm /> component that encapsulates the actual form logic/UI.
   * - A small link for users who don’t have an account, guiding them to the signup page.
   * 
   * Styling is handled via Tailwind CSS for responsiveness and consistency with the overall theme.
   */
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-8 mb-8">
      <div className="max-w-md w-full space-y-8">
        
        {/** Heading Section */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-barber-brown">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Log in to your account to book appointments and purchase products.
          </p>
        </div>

        {/** Login Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-barber-cream">
          {/** Renders the actual login form component */}
          <LoginForm />

          {/** Link to Signup Page */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/signup">
                <span className="font-medium text-barber-brown hover:underline cursor-pointer">
                  Create one now
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
