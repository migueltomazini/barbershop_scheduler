import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Calendar, Clock } from "lucide-react";
import { Button } from "./button";
import { ServiceType } from "../../types";

import { Scissors, Brush, ShowerHead, Sparkles, Baby } from "lucide-react";

const IconMap: { [key: string]: React.ElementType } = {
  Scissors: Scissors,
  Brush: Brush,
  ShowerHead: ShowerHead,
  Sparkles: Sparkles,
  Baby: Baby,
};

type ServiceCardProps = {
  service: ServiceType;
  variant?: "carousel" | "detailed";
  showButton?: boolean;
  icon?: React.ReactNode;
};

export const ServiceCard = ({
  service,
  variant = "carousel",
  showButton = false,
}: ServiceCardProps) => {
  const isDetailed = variant === "detailed";
  const LucideIcon = service.icon ? IconMap[service.icon] : null;

  return (
    <div
      className={`bg-white border border-barber-cream rounded-lg shadow-md ${
        isDetailed
          ? "flex flex-col md:flex-row min-h-[280px]"
          : "p-6 text-center flex flex-col items-center justify-center h-full"
      }`}
    >
      {/* Image section for detailed view */}
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
      ) : LucideIcon ? ( // Icon for carousel view
        <div className="mb-4 text-barber-gold">
          <LucideIcon className="h-16 w-16 mx-auto" />{" "}
        </div>
      ) : (
        // Fallback se não houver imagem nem ícone válido
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center text-muted-foreground">
          No Visual Available
        </div>
      )}

      {/* Content section */}
      <div
        className={`p-4 flex flex-col ${
          isDetailed ? "md:w-2/3 flex flex-col justify-between" : ""
        }`}
      >
        <h3 className="text-xl font-bold mb-2 text-barber-navy">
          {service.name}
        </h3>

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

        {/* Show booking button if required */}
        {showButton && (
          <Link href="/appointments">
            <Button className="bg-barber-brown hover:bg-barber-dark-brown">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
