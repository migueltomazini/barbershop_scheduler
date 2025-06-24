/**
 * @file barbershop_app/app/components/sections/admin/serviceManagementTab.tsx
 * @description FINAL VERSION: Provides a table listing all services, using MongoDB `_id` for keys and action handlers.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ServiceType } from "@/app/types";

/**
 * Props for the ServiceManagementTab component.
 *
 * @interface ServiceManagementTabProps
 * @property {ServiceType[]} services - Array of services to display.
 * @property {(service: ServiceType) => void} onEdit - Callback invoked with the selected service for editing.
 * @property {(serviceId: string) => void} onDelete - Callback invoked with the service's `_id` to delete it.
 */
interface ServiceManagementTabProps {
  services: ServiceType[];
  onEdit: (service: ServiceType) => void;
  onDelete: (serviceId: string) => void;
}

/**
 * ServiceManagementTab
 *
 * Renders a responsive table that lists each service's name, price, and duration,
 * along with action buttons for edit and delete operations. Each row uses the
 * service's unique `_id` for React keys and delete callback.
 *
 * @param {ServiceManagementTabProps} props - Component properties.
 * @returns {JSX.Element} The rendered table of services.
 */
export function ServiceManagementTab({
  services,
  onEdit,
  onDelete,
}: ServiceManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[500px]">
        {/* Table header with column labels */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Price</th>
            <th className="p-3 sm:p-4 font-semibold">Duration (min)</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>

        {/* Table body iterating over services */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {services.length > 0 ? (
            services.map((service) => (
              <tr key={service._id}>
                {/* Service name cell, prevents wrapping for consistency */}
                <td className="p-3 sm:p-4 whitespace-nowrap">{service.name}</td>
                {/* Price formatted as fixed two decimals with dollar sign */}
                <td className="p-3 sm:p-4">${service.price.toFixed(2)}</td>
                {/* Duration in minutes */}
                <td className="p-3 sm:p-4">{service.duration}</td>
                {/* Action buttons for editing or deleting this service */}
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(service)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                      aria-label={`Edit service ${service.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(service._id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      aria-label={`Delete service ${service.name}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Render a fallback row when no services are available
            <tr>
              <td colSpan={4} className="text-center p-8 text-muted-foreground">
                No services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
