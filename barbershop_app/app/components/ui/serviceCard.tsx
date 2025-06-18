/**
 * @file barbershop_app/app/components/ui/serviceCard.tsx
 * @description This file contains the ServiceCard component, a UI element for displaying a single service,
 * supporting different layouts and content based on the context.
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./button";
import { ServiceType } from "../../types";

import {
  Calendar,
  Clock,
  Scissors,
  Brush,
  ShowerHead,
  Sparkles,
  Baby,
} from "lucide-react";

// A map to dynamically render a Lucide icon based on a string name from the data.
const IconMap: { [key: string]: React.ElementType } = {
  Scissors: Scissors,
  Brush: Brush,
  ShowerHead: ShowerHead,
  Sparkles: Sparkles,
  Baby: Baby,
};

/**
 * @type ServiceCardProps
 * @description Defines the properties for the ServiceCard component.
 * @property {ServiceType} service - The service data to display.
 * @property {'carousel' | 'detailed'} [variant] - The layout variant of the card.
 * @property {boolean} [showButton] - Whether to show the "Book Now" button.
 * @property {React.ReactNode} [icon] - An optional icon to display (used in 'carousel' variant).
 */
type ServiceCardProps = {
  service: ServiceType;
  variant?: "carousel" | "detailed";
  showButton?: boolean;
  icon?: React.ReactNode; // Note: 'icon' prop from the type is not used, the logic derives it from service.icon.
};

/**
 * @component ServiceCard
 * @description Renders a card for a single service. The 'detailed' variant shows an image and more text,
 * while the 'carousel' variant is more compact and uses an icon.
 * @param {ServiceCardProps} props - The props for the component.
 */
export const ServiceCard = ({
  service,
  variant = "carousel",
  showButton = false,
}: ServiceCardProps) => {
  const isDetailed = variant === "detailed";
  // Dynamically select the icon component from the map based on the service data.
  const LucideIcon = service.icon ? IconMap[service.icon] : null;

  return (
    <div
      className={`bg-white border border-barber-cream rounded-lg shadow-md ${
        isDetailed
          ? "flex flex-col md:flex-row min-h-[280px]"
          : "p-6 text-center flex flex-col items-center justify-center h-full"
      }`}
    >
      {/* Image section for the 'detailed' view. */}
      {isDetailed ? (
        <div className="md:w-1/3 h-48 md:h-auto max-h-[280px] bg-gray-100">
          <Image
            height={1000}
            width={1000}
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : LucideIcon ? ( // Icon section for the 'carousel' view.
        <div className="mb-4 text-barber-gold">
          <LucideIcon className="h-16 w-16 mx-auto" />
        </div>
      ) : (
        // Fallback UI if no image or icon is available.
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center text-muted-foreground">
          No Visual Available
        </div>
      )}

      {/* Content Section */}
      <div
        className={`p-4 flex flex-col ${
          isDetailed ? "md:w-2/3 flex flex-col justify-between" : ""
        }`}
      >
        <h3 className="text-xl font-bold mb-2 text-barber-navy">
          {service.name}
        </h3>

        {/* Price and Duration Details */}
        <div className="flex items-center justify-center text-barber-gold mb-3">
          <span className="text-lg font-medium">
            ${service.price.toFixed(2)}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {service.duration} min
          </span>
        </div>

        <p
          className={`text-muted-foreground mb-4 ${
            !isDetailed ? "text-sm line-clamp-3 flex-grow" : "flex-grow"
          }`}
        >
          {service.description}
        </p>

        {/* "Book Now" Button (conditionally rendered) */}
        {showButton && (
          <Link href="/appointments">
            <Button className="bg-barber-brown text-white hover:bg-barber-dark-brown">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
