/**
 * @file barbershop_app/app/components/layout/navbar.tsx
 * @description
 * This file contains the Navbar component, which is rendered at the top of all pages.
 * It adapts its layout and options based on authentication state and screen size.
 *
 * Key features:
 * - Responsive design with a mobile menu toggle.
 * - Shows navigation links to main sections (Home, Services, Shop, Appointments).
 * - Displays user menu when logged in, with links to profile, appointments, admin dashboard (if admin), and logout.
 * - Shows login/signup button if not authenticated.
 * - Shopping cart icon with badge showing total items.
 * 
 * The component receives the user session as a prop for stateless rendering.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";
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
  ShoppingCart, Menu, X, User, LogOut, Scissors, CalendarCheck2, ShieldCheck
} from "lucide-react";
import { logoutAction } from "@/app/actions/authActions";
import { SessionType } from "@/app/types";

interface NavbarProps {
  session: SessionType | null;
}

/**
 * Navbar component
 * @param session - The current user session or null if unauthenticated
 * @returns JSX.Element
 */
export function Navbar({ session }: NavbarProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine authentication and role status
  const isAuthenticated = !!session;
  const isAdmin = session?.role === 'admin';
  const userName = session?.name || "User";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-barber-cream shadow-sm">
      <div className="container mx-auto py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="SharpShears Home">
            <Scissors className="h-8 w-8 text-barber-brown" />
            <span className="text-xl font-bold font-serif text-barber-brown">SharpShears</span>
          </Link>

          {/* Desktop navigation links */}
          <nav className="hidden md:flex items-center md:space-x-3 lg:space-x-6" aria-label="Primary Navigation">
            <Link href="/" className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors">Home</Link>
            <Link href="/services" className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors">Services</Link>
            <Link href="/shop" className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors">Shop</Link>
            {isAuthenticated && (
              <Link href="/appointments" className="md:text-sm lg:text-base text-barber-navy hover:text-barber-brown transition-colors">Appointments</Link>
            )}
          </nav>

          {/* User actions and cart (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-barber-navy" />
                    <span>Hello, {userName.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile" passHref>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/appointments" passHref>
                    <DropdownMenuItem className="cursor-pointer">
                      <CalendarCheck2 className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <form action={logoutAction} className="w-full">
                    <button type="submit" className="w-full text-left">
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-barber-navy text-barber-navy hover:bg-barber-navy hover:text-white flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Login / Sign Up</span>
                </Button>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <Link href="/cart" className="relative" aria-label="View Cart">
              <Button variant="outline" className="border-barber-navy text-barber-navy hover:bg-barber-navy hover:text-white">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-barber-gold text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle and cart icon */}
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
              className="text-barber-navy"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu content */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-barber-cream">
          <nav className="flex flex-col divide-y divide-barber-cream">
            {[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }, { href: "/shop", label: "Shop" }].map(({ href, label }) => (
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
            <div className="pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="px-6 py-3 text-barber-navy hover:bg-barber-cream flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <form action={logoutAction} className="w-full">
                    <button
                      type="submit"
                      className="w-full text-left"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="px-6 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </form>
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
