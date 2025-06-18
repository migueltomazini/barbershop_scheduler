/**
 * @file barbershop_app/app/components/sections/admin/clientManagementTab.tsx
 * @description This file contains the ClientManagementTab component, which displays a table of clients
 * with functionality to edit or delete them.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Client } from "@/app/types";
import { Address } from "@/app/types";

/**
 * @function formatAddress
 * @description Formats an address object into a single, human-readable string.
 * @param {Address | undefined | null} address - The address object to format.
 * @returns {string} A formatted address string or "N/A" if the address is not provided.
 */
const formatAddress = (address: Address | undefined | null): string => {
  if (!address) {
    return "N/A";
  }
  return `${address.street}, ${address.city} - ${address.state}, ${address.zip}`;
};

/**
 * @interface ClientManagementTabProps
 * @description Defines the properties for the ClientManagementTab component.
 * @property {Client[]} clients - An array of client objects to display.
 * @property {(client: Client) => void} onEdit - Callback function triggered when editing a client.
 * @property {(clientId: string) => void} onDelete - Callback function triggered when deleting a client.
 */
interface ClientManagementTabProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

/**
 * @component ClientManagementTab
 * @description A component that displays a table of clients with options to edit or delete them.
 * @param {ClientManagementTabProps} props - The props for the component.
 */
export function ClientManagementTab({
  clients,
  onEdit,
  onDelete,
}: ClientManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[700px]">
        {/* Table Head */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Email</th>
            <th className="p-3 sm:p-4 font-semibold">Phone</th>
            <th className="p-3 sm:p-4 font-semibold">Address</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {clients.length > 0 ? (
            // Map through the clients to render each row.
            clients.map((client) => (
              <tr key={client.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{client.name}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">{client.email}</td>
                <td className="p-3 sm:p-4">{client.phone}</td>
                <td className="p-3 sm:p-4">{formatAddress(client.address)}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    {/* Button to trigger the edit client modal. */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(client)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Button to trigger the delete client action. */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(client.id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Renders a message if there are no clients to display.
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
