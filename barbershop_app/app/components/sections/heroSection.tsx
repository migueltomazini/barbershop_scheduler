import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";
import { Calendar } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative bg-barber-navy text-white">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2344&q=100')] bg-cover bg-center"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Sharp Style, Perfect Cut
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Experience premium grooming services at SharpShears. Our skilled
            barbers deliver classic cuts and modern styles with precision and
            expertise.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/appointments">
              <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black font-medium px-6 py-2">
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-barber-navy font-medium px-6 py-2"
              >
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
