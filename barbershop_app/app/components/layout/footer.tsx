import React from "react";
import Link from "next/link";

import {
  Phone,
  MapPin,
  Clock,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-barber-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif">SharpShears</h3>
            <p className="mb-4 text-sm text-gray-300">
              Premium barbershop services with skilled professionals offering
              classic cuts, hot towel shaves, and beard grooming.
            </p>
            {/* Social media icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-barber-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-barber-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-barber-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-serif">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin size={18} />
                <span>123 Barber Street, Downtown</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={18} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={18} />
                <span>info@sharpshears.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Clock size={18} />
                <span>Mon-Sat: 9am - 7pm, Sun: Closed</span>
              </li>
            </ul>
          </div>

          {/* Quick navigation links */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-serif">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-barber-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-barber-gold transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-barber-gold transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="hover:text-barber-gold transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SharpShears. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
