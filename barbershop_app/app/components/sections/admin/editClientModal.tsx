"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { Client } from "@/app/types";

// Defines the props for the EditClientModal component
interface EditClientModalProps {
  isOpen: boolean; // Controls whether the dialog is open
  onOpenChange: (isOpen: boolean) => void; // Callback to handle dialog open/close
  client: Client | null; // The client object to be edited
  onSave: (clientId: string, clientData: Partial<Client>) => Promise<void>; // Callback to save client changes
}

// EditClientModal functional component
export function EditClientModal({
  isOpen,
  onOpenChange,
  client,
  onSave,
}: EditClientModalProps) {
  // State to manage form input values
  const [formState, setFormState] = useState<Partial<Client>>({});

  // Effect to populate formState when a client object is provided
  useEffect(() => {
    if (client) {
      setFormState({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        role: "client", // The role for a client is always "client" in this context
      });
    } else {
      // Sets initial state for new client creation if the modal were reused for that purpose
      setFormState({ role: "client", address: "" });
    }
  }, [client]);

  // Renders nothing if no client object is provided for editing
  if (!client) return null;

  // Handles changes to form input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handles saving the changes, validating input and calling the onSave callback
  const handleSaveChanges = async () => {
    if (!formState.name || !formState.email) {
      toast.error("Client name and email are required.");
      return;
    }
    // Ensures the 'role' is "client" when saving
    const dataToSave: Partial<Client> = {
      ...formState,
      role: "client",
    };

    await onSave(client.id, dataToSave);
    onOpenChange(false); // Closes the modal after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Client: {client.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Name Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="clientFormNameModal"
              className="text-right col-span-1"
            >
              Name
            </Label>
            <Input
              id="clientFormNameModal"
              name="name"
              value={formState.name || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          {/* Email Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="clientFormEmailModal"
              className="text-right col-span-1"
            >
              Email
            </Label>
            <Input
              id="clientFormEmailModal"
              name="email"
              type="email"
              value={formState.email || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          {/* Phone Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="clientFormPhoneModal"
              className="text-right col-span-1"
            >
              Phone
            </Label>
            <Input
              id="clientFormPhoneModal"
              name="phone"
              value={formState.phone || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          {/* Address Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="clientFormAddressModal"
              className="text-right col-span-1"
            >
              Address
            </Label>
            <Input
              id="clientFormAddressModal"
              name="address"
              value={formState.address || ""}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Client's address"
            />
          </div>
        </div>
        <DialogFooter>
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
          {/* Save Button */}
          <Button
            onClick={handleSaveChanges}
            className="bg-barber-brown hover:bg-barber-dark-brown"
          >
            Save Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
