/**
 * @file barbershop_app/app/components/sections/admin/serviceManagementTab.tsx
 * @description VERSÃO FINAL: Corrigido para usar _id como a key e nos botões de ação.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ServiceType } from "@/app/types";

interface ServiceManagementTabProps {
  services: ServiceType[];
  onEdit: (service: ServiceType) => void;
  onDelete: (serviceId: string) => void;
}

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
            services.map((service) => (
              // MUDANÇA 1: Usando service._id para a key
              <tr key={service._id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{service.name}</td>
                <td className="p-3 sm:p-4">${service.price.toFixed(2)}</td>
                <td className="p-3 sm:p-4">{service.duration}</td>
                <td className="p-3 sm:p-4">
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
                      // MUDANÇA 2: Passando service._id para a função de deletar
                      onClick={() => onDelete(service._id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
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
