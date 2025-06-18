/**
 * @file barbershop_app/app/components/sections/home/ctaSection.tsx
 * @description This file contains the Call-to-Action (CTA) section, which is used on the homepage
 * to encourage users to book an appointment.
 */

import React from "react";
import Link from "next/link";

import { Button } from "../../ui/button";

/**
 * @component CtaSection
 * @description Renders a visually distinct section with a headline, a short message,
 * and a prominent button that links to the appointments page.
 */
export const CtaSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 text-center rounded-lg bg-barber-gold/10 mb-10">
      <h2 className="text-3xl font-bold mb-6 font-serif text-barber-brown">
        Ready for a Fresh Look?
      </h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
        Book your appointment today and experience the SharpShears difference.
        Our skilled barbers are ready to help you look and feel your best.
      </p>

      {/* The main call-to-action button. */}
      <Link href="/appointments">
        <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black font-medium px-8 py-2 text-lg">
          Book Your Appointment
        </Button>
      </Link>
    </section>
  );
};
