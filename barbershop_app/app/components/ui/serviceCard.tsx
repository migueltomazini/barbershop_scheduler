import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { ServiceType } from "../../types";

type ServiceCardProps = {
  service: ServiceType;
  variant?: "carousel" | "detailed";
  showButton?: boolean;
  icon?: React.ReactNode; // Optional icon element for carousel version
};

export const ServiceCard = ({
  service,
  variant = "carousel",
  showButton = false,
  icon,
}: ServiceCardProps) => {
  const isDetailed = variant === "detailed";

  return (
    <div
      className={`bg-white border border-barber-cream rounded-lg shadow-md ${
        isDetailed
          ? "flex flex-col md:flex-row"
          : "p-6 text-center flex flex-col items-center justify-center"
      }`}
    >
      {/* Image section for detailed view */}
      {isDetailed && (
        <div className="md:w-1/3 h-48 md:h-auto bg-gray-100">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content section */}
      <div className={`p-4 ${isDetailed ? "md:w-2/3" : ""}`}>
        {/* Optional icon for carousel */}
        {!isDetailed && icon && (
          <div className="mb-4 text-barber-gold">{icon}</div>
        )}

        <h3 className="text-xl font-bold mb-2 text-barber-navy">{service.name}</h3>

        <div className="flex items-center justify-center text-barber-gold mb-3">
          <span className="text-lg font-medium">${service.price.toFixed(2)}</span>
          <span className="mx-2">•</span>
          <span className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {service.duration} min
          </span>
        </div>

        <p className={`text-muted-foreground mb-4 ${!isDetailed ? "text-sm" : ""}`}>
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
