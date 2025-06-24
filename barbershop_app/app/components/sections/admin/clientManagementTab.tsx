/**
 * @file barbershop_app/app/components/sections/admin/clientManagementTab.tsx
 * @description VERSÃO FINAL: Corrigido para usar _id como a key e nos botões de ação.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { User as Client } from "@/app/types"; // Renomeando o tipo para clareza
import { Address } from "@/app/types";

const formatAddress = (address: Address | undefined | null): string => {
  if (!address || !address.street) { // Verifica se o endereço ou a rua existem
    return "N/A";
  }
  return `${address.street}, ${address.city} - ${address.state}, ${address.zip}`;
};

interface ClientManagementTabProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

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
              // MUDANÇA 1: Usando client._id para a key
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
                      // MUDANÇA 2: Passando client._id para a função de deletar
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
