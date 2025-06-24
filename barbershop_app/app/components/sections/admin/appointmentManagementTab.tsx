/**
 * @file barbershop_app/app/components/sections/admin/appointmentManagementTab.tsx
 * @description Final version of the AppointmentManagementTab component.
 * This component displays a sortable list of appointments, showing client and service information,
 * formatted date and time, status indicators, and action buttons to edit or delete each appointment.
 * It is designed to handle nested populated data and uses the MongoDB _id as the unique key.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/app/types";

/**
 * Defines the props accepted by the AppointmentManagementTab component.
 * @interface
 * @property {Appointment[]} appointments - The list of appointments to display.
 * @property {(appointment: Appointment) => void} onEdit - Callback for handling the edit action.
 * @property {(appointmentId: string) => void} onDelete - Callback for handling the delete action.
 */
interface AppointmentManagementTabProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

/**
 * AppointmentManagementTab component.
 *
 * This component renders a table that lists all appointments.
 * It displays the client name, service name, formatted date and time,
 * status with a color-coded badge, and action buttons to edit or delete each appointment.
 * The appointments are sorted by date in descending order (most recent first).
 * If no appointments are available, an empty state message is shown.
 *
 * @param {AppointmentManagementTabProps} props - The props object.
 * @returns {JSX.Element} A responsive table with appointment data and actions.
 */
export function AppointmentManagementTab({
  appointments,
  onEdit,
  onDelete,
}: AppointmentManagementTabProps) {
  // Create a sorted copy of the appointments array, ordered by descending date.
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
              // Use MongoDB _id as a stable key for each row.
              <tr key={appt._id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {/* Safely access the populated user name; fallback if missing */}
                  {(appt.user as any)?.name || "Client not found"}
                </td>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {/* Safely access the populated service name; fallback if missing */}
                  {(appt.service as any)?.name || "Service not found"}
                </td>
                <td className="p-3 sm:p-4">
                  {/* Format appointment date as MM/dd/yyyy */}
                  {format(parseISO(appt.date), "MM/dd/yyyy")}
                </td>
                <td className="p-3 sm:p-4">
                  {/* Format appointment time as HH:mm */}
                  {format(parseISO(appt.date), "HH:mm")}
                </td>
                <td className="p-3 sm:p-4">
                  {/* Display status with dynamic styling based on status value */}
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
                  {/* Action buttons: Edit and Delete with accessible labels */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(appt)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                      aria-label={`Edit appointment for ${(appt.user as any)?.name || "client"}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(appt._id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      aria-label={`Delete appointment for ${(appt.user as any)?.name || "client"}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Render fallback row if there are no appointments.
            <tr>
              <td
                colSpan={6}
                className="text-center p-8 text-muted-foreground"
                aria-live="polite"
              >
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
