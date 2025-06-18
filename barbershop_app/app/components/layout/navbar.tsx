/**
 * @file barbershop_app/app/components/layout/navbar.tsx
 * @description This file contains the Navbar component, which serves as the main navigation for the site.
 * It is responsive and adapts its content based on the user's authentication status (logged in, logged out, admin).
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Scissors,
  CalendarCheck2,
  ShieldCheck,
} from "lucide-react";

/**
 * @component Navbar
 * @description Renders the main site navigation bar. It handles responsive layout for desktop and mobile,
 * displays user-specific content, and provides access to the shopping cart.
 */
export function Navbar() {
  // Destructure data and functions from authentication and cart contexts.
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  // State to manage the visibility of the mobile menu.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-barber-cream shadow-sm">
      <div className="container mx-auto py-3">
        <div className="flex items-center justify-between">
          {/* Logo with a link to the homepage. */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="SharpShears Home"
          >
            <Scissors className="h-8 w-8 text-barber-brown" />
            <span className="text-xl font-bold font-serif text-barber-brown">
              SharpShears
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center md:space-x-3 lg:space-x-6"
            aria-label="Primary Navigation"
          >
            <Link
              href="/"
              className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors"
            >
              Services
            </Link>
            <Link
              href="/shop"
              className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors"
            >
              Shop
            </Link>
            {/* Show "Appointments" link only to authenticated users. */}
            {isAuthenticated && (
              <Link
                href="/appointments"
                className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors flex items-center gap-1"
              >
                Appointments
              </Link>
            )}
          </nav>

          {/* User Actions and Cart for Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              // If authenticated, show a user dropdown menu.
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5 text-barber-navy" />
                    {/* Display a personalized greeting with the user's first name. */}
                    <span>Hello, {user?.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profilePage" passHref>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/appointments?tab=manage" passHref>
                    <DropdownMenuItem className="cursor-pointer">
                      <CalendarCheck2 className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                    </DropdownMenuItem>
                  </Link>
                  {/* Show "Admin Dashboard" link only to admin users. */}
                  {isAdmin && (
                    <Link href="/admin" passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // If not authenticated, show a login button.
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-barber-navy text-barber-navy hover:bg-barber-navy hover:text-white flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login / Sign Up
                </Button>
              </Link>
            )}

            {/* Shopping Cart button with item count badge. */}
            <Link href="/cart" className="relative" aria-label="View Cart">
              <Button
                variant="outline"
                className="border-barber-navy text-barber-navy hover:bg-barber-navy hover:text-white"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-barber-gold text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger Button and Cart Icon */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="mr-4 relative" aria-label="View Cart">
              <ShoppingCart className="h-6 w-6 text-barber-navy" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-barber-gold text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-barber-navy hover:text-barber-brown focus:outline-none focus:ring-2 focus:ring-barber-brown rounded"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (conditionally rendered) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-barber-cream animate-in fade-in-50 slide-in-from-top-2">
          <nav
            className="flex flex-col divide-y divide-barber-cream"
            aria-label="Mobile Navigation"
          >
            {/* Map over navigation links for cleaner code. */}
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/shop", label: "Shop" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-6 py-3 text-barber-navy hover:bg-barber-cream"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/appointments"
                className="px-6 py-3 text-barber-navy hover:bg-barber-cream"
                onClick={() => setMobileMenuOpen(false)}
              >
                Appointments
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-3 text-barber-navy hover:bg-barber-cream"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {/* User-specific links for mobile menu */}
            <div className="pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profilePage"
                    className="px-6 py-3 text-barber-navy hover:bg-barber-cream flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <div
                    className="px-6 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-3 text-barber-navy hover:bg-barber-cream flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Login / Sign Up</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
