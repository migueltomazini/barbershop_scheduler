// appointmentManagementTab.tsx

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/app/types";

// Defines the props for the AppointmentManagementTab component
interface AppointmentManagementTabProps {
  appointments: Appointment[]; // Array of appointment objects
  onEdit: (appointment: Appointment) => void; // Callback for editing an appointment
  onDelete: (appointmentId: string) => void; // Callback for deleting an appointment
}

// AppointmentManagementTab functional component
export function AppointmentManagementTab({
  appointments,
  onEdit,
  onDelete,
}: AppointmentManagementTabProps) {
  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeB.getTime() - dateTimeA.getTime(); // Sort descending
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[600px]">
        {/* Table header */}
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
        {/* Table body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {sortedAppointments.length > 0 ? (
            // Maps through sorted appointments to render each row
            sortedAppointments.map((appt) => (
              <tr key={appt.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {appt.clientName}
                </td>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {appt.serviceName}
                </td>
                <td className="p-3 sm:p-4">
                  {format(parseISO(appt.date), "MM/dd/yyyy")}
                </td>
                <td className="p-3 sm:p-4">{appt.time}</td>
                <td className="p-3 sm:p-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appt.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : appt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
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
                      onClick={() => onDelete(appt.id)}
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
