"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ServiceType } from "@/app/types";

// Defines the props for the ServiceManagementTab component
interface ServiceManagementTabProps {
  services: ServiceType[]; // Array of service objects
  onEdit: (service: ServiceType) => void; // Callback for editing a service
  onDelete: (serviceId: number) => void; // Callback for deleting a service
}

// ServiceManagementTab functional component
export function ServiceManagementTab({
  services,
  onEdit,
  onDelete,
}: ServiceManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[500px]">
        {/* Table header */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Price</th>
            <th className="p-3 sm:p-4 font-semibold">Duration</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {services.length > 0 ? (
            // Maps through services to render each row
            services.map((service) => (
              <tr key={service.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{service.name}</td>
                <td className="p-3 sm:p-4">${service.price.toFixed(2)}</td>
                <td className="p-3 sm:p-4">{service.duration}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    {/* Edit button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(service)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Delete button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(service.id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Displays a message if no services are found
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
