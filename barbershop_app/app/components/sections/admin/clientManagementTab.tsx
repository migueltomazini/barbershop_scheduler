/**
 * @file barbershop_app/app/components/sections/admin/clientManagementTab.tsx
 * @description FINAL VERSION: Corrected to use _id as the React key and for action buttons.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { User as Client } from "@/app/types"; // Renamed for clarity within this file
import { Address } from "@/app/types";

/**
 * Formats an address object into a single string.
 * If the address or its street is missing, returns "N/A".
 *
 * @param {Address | undefined | null} address - The address to format.
 * @returns {string} The formatted address string.
 */
const formatAddress = (address: Address | undefined | null): string => {
  if (!address || !address.street) {
    return "N/A";
  }
  return `${address.street}, ${address.city} - ${address.state}, ${address.zip}`;
};

/**
 * Defines the props accepted by the ClientManagementTab component.
 *
 * @interface
 * @property {Client[]} clients - List of clients to display.
 * @property {(client: Client) => void} onEdit - Handler to edit a specific client.
 * @property {(clientId: string) => void} onDelete - Handler to delete a specific client by ID.
 */
interface ClientManagementTabProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

/**
 * ClientManagementTab component.
 *
 * This component renders a table that lists all registered clients,
 * including name, email, phone, and formatted address.
 * It also provides action buttons to edit or delete each client.
 * Uses the MongoDB _id as the unique React key for each row and for identifying the client in callbacks.
 * Handles the empty state gracefully.
 *
 * @param {ClientManagementTabProps} props - The props object.
 * @returns {JSX.Element} A responsive table displaying client data and actions.
 */
export function ClientManagementTab({
  clients,
  onEdit,
  onDelete,
}: ClientManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Email</th>
            <th className="p-3 sm:p-4 font-semibold">Phone</th>
            <th className="p-3 sm:p-4 font-semibold">Address</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-barber-cream text-sm">
          {clients.length > 0 ? (
            clients.map((client) => (
              // Uses client._id as a unique key to ensure stable rendering.
              <tr key={client._id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{client.name}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">{client.email}</td>
                <td className="p-3 sm:p-4">{client.phone}</td>
                <td className="p-3 sm:p-4">{formatAddress(client.address)}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(client)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      // Uses client._id for deletion to uniquely identify the client.
                      onClick={() => onDelete(client._id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Displays a fallback row when there are no clients to list.
            <tr>
              <td colSpan={5} className="text-center p-8 text-muted-foreground">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
