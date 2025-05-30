"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Client } from "@/app/types";

// Defines the props for the ClientManagementTab component
interface ClientManagementTabProps {
  clients: Client[]; // Array of client objects
  onEdit: (client: Client) => void; // Callback for editing a client
  onDelete: (clientId: string) => void; // Callback for deleting a client
}

// ClientManagementTab functional component
export function ClientManagementTab({
  clients,
  onEdit,
  onDelete,
}: ClientManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[700px]">
        {/* Table header */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Email</th>
            <th className="p-3 sm:p-4 font-semibold">Phone</th>
            <th className="p-3 sm:p-4 font-semibold">Address</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {clients.length > 0 ? (
            // Maps through clients to render each row
            clients.map((client) => (
              <tr key={client.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{client.name}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">{client.email}</td>
                <td className="p-3 sm:p-4">{client.phone}</td>
                <td className="p-3 sm:p-4">{client.address || "N/A"}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    {/* Edit button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(client)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Delete button */}
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
            // Displays a message if no clients are found
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
