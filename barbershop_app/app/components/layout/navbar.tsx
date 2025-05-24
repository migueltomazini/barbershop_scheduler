"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../ui/button";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Scissors
} from 'lucide-react'

export function Navbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { totalItems } =  useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
    <header className="sticky top-0 z-50 bg-white border-b border-barber-cream shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-barber-brown" />
            <span className="text-xl font-bold font-serif text-barber-brown">
              SharpShears
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-barber-navy hover:text-barber-brown transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-barber-navy hover:text-barber-brown transition-colors">
              Services
            </Link>
            <Link href="/shop" className="text-barber-navy hover:text-barber-brown transition-colors">
              Shop
            </Link>
            {isAuthenticated && (
              <Link
                href="/appointments"
                className="text-barber-navy hover:text-barber-brown transition-colors flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                <span>Appointments</span>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-barber-navy hover:text-barber-brown transition-colors">
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <Link href="/login">
                <Button variant="outline" className="border-barber-navy text-barber-navy hover:bg-barber-navy hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">Hello, {user?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-barber-navy hover:bg-barber-navy/10"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
            <Link href="/cart" className="relative">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="mr-4 relative">
              <ShoppingCart className="h-6 w-6 text-barber-navy" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-barber-gold text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-barber-navy hover:text-barber-brown"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-barber-cream animate-fade-in">
          <nav className="flex flex-col divide-y divide-barber-cream">
            <Link href="/" className="px-6 py-3 text-barber-navy hover:bg-barber-cream" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/services" className="px-6 py-3 text-barber-navy hover:bg-barber-cream" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/shop" className="px-6 py-3 text-barber-navy hover:bg-barber-cream" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            {isAuthenticated && (
              <Link
                href="/appointments"
                className="px-6 py-3 text-barber-navy hover:bg-barber-cream flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                <span>Appointments</span>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="px-6 py-3 text-barber-navy hover:bg-barber-cream" onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="px-6 py-3 text-barber-navy hover:bg-barber-cream flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            ) : (
              <div className="px-6 py-3 flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Hello, {user?.name}</span>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center text-barber-navy gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}