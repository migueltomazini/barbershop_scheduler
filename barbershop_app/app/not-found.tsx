/**
 * @file barbershop_app/app/not-found.tsx
 * @description Defines the custom 404 Not Found page for SharpShears Barbershop.
 * This page is rendered automatically by Next.js whenever a user navigates to a route that does not exist.
 */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * @component NotFound
 * @description Displays a user-friendly 404 error page with a message, the error code,
 * and a link to redirect back to the homepage. It also logs the requested invalid path to the console for debugging.
 */
const NotFound = () => {
  const pathname = usePathname();

  // Logs the invalid URL path to the console whenever this component is mounted.
  useEffect(() => {
    console.warn(
      `404 Not Found: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found.</p>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
