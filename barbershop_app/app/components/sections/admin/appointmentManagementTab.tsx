/**
 * @file barbershop_app/app/components/sections/admin/appointmentManagementTab.tsx
 * @description VERSÃO FINAL: Corrigido para usar _id como key e para acessar os dados populados de user e service.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/app/types"; // Supondo que seu tipo Appointment foi atualizado

interface AppointmentManagementTabProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export function AppointmentManagementTab({
  appointments,
  onEdit,
  onDelete,
}: AppointmentManagementTabProps) {
  // A lógica de ordenação pode ser movida para o servidor para melhor performance,
  // mas por enquanto pode ficar aqui.
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Client</th>
            <th className="p-3 sm:p-4 font-semibold">Service</th>
            <th className="p-3 sm:p-4 font-semibold">Date</th>
            <th className="p-3 sm:p-4 font-semibold">Time</th>
            <th className="p-3 sm:p-4 font-semibold">Status</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-barber-cream text-sm">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appt) => (
              // MUDANÇA 1: Usando appt._id para a key
              <tr key={appt._id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {/* MUDANÇA 2: Acessando o nome do usuário aninhado */}
                  {(appt.user as any)?.name || 'Client not found'}
                </td>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {/* MUDANÇA 3: Acessando o nome do serviço aninhado */}
                  {(appt.service as any)?.name || 'Service not found'}
                </td>
                <td className="p-3 sm:p-4">
                  {format(parseISO(appt.date), "MM/dd/yyyy")}
                </td>
                <td className="p-3 sm:p-4">{format(parseISO(appt.date), "HH:mm")}</td>
                <td className="p-3 sm:p-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      appt.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : appt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(appt)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      // MUDANÇA 4: Passando o _id para a função de deletar
                      onClick={() => onDelete(appt._id)}
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
              <td colSpan={6} className="text-center p-8 text-muted-foreground">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
