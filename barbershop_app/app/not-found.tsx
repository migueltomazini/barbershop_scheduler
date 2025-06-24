/**
 * @file barbershop_app/app/not-found.tsx
 * @description This file defines the custom 404 Not Found page for the application.
 * It's displayed whenever a user navigates to a route that does not exist.
 */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * @component NotFound
 * @description A component that renders the 404 page, including a message and a link back to the homepage.
 * It also logs the non-existent path for debugging purposes.
 */
const NotFound = () => {
  const pathname = usePathname();

  // Effect to log the path that resulted in a 404 error.
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
