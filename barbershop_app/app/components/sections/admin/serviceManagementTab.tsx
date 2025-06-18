/**
 * @file barbershop_app/app/components/sections/admin/serviceManagementTab.tsx
 * @description This file contains the ServiceManagementTab component, which displays a table of services
 * with functionality to edit or delete them.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ServiceType } from "@/app/types";

/**
 * @interface ServiceManagementTabProps
 * @description Defines the properties for the ServiceManagementTab component.
 * @property {ServiceType[]} services - An array of service objects to display.
 * @property {(service: ServiceType) => void} onEdit - Callback function to handle editing a service.
 * @property {(serviceId: string) => void} onDelete - Callback function to handle deleting a service.
 */
interface ServiceManagementTabProps {
  services: ServiceType[];
  onEdit: (service: ServiceType) => void;
  onDelete: (serviceId: string) => void;
}

/**
 * @component ServiceManagementTab
 * @description A component that renders a table of services, allowing administrators
 * to manage them by providing edit and delete actions.
 * @param {ServiceManagementTabProps} props - The props for the component.
 */
export function ServiceManagementTab({
  services,
  onEdit,
  onDelete,
}: ServiceManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[500px]">
        {/* Table Head */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Price</th>
            <th className="p-3 sm:p-4 font-semibold">Duration (min)</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {services.length > 0 ? (
            // Map through the services array to render a row for each service.
            services.map((service) => (
              <tr key={service.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{service.name}</td>
                <td className="p-3 sm:p-4">${service.price.toFixed(2)}</td>
                <td className="p-3 sm:p-4">{service.duration}</td>
                <td className="p-3 sm:p-4">
                  {/* Action buttons for edit and delete operations. */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(service)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
            // Display a message if no services are available.
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
