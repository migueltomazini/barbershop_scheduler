/**
 * @file barbershop_app/app/components/sections/admin/editClientModal.tsx
 * @description This file contains the EditClientModal component, a dialog for editing user/client details.
 */

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
import { User } from "@/app/types";

/**
 * @interface EditClientModalProps
 * @description Defines the properties for the EditClientModal component.
 * @property {boolean} isOpen - Controls the visibility of the dialog.
 * @property {(isOpen: boolean) => void} onOpenChange - Callback function to handle dialog open/close.
 * @property {User | null} client - The user object to be edited.
 * @property {(userId: string, userData: Partial<User>) => Promise<void>} onSave - Async callback to save user changes.
 */
interface EditClientModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  client: User | null;
  onSave: (userId: string, userData: Partial<User>) => Promise<void>;
}

// Regex for basic phone number validation, allowing digits, spaces, and common symbols.
const PHONE_REGEX = /^[0-9\s-()+]*$/;

/**
 * @component EditClientModal
 * @description A modal dialog for editing user details such as name, email, phone, and role.
 * @param {EditClientModalProps} props - The props for the component.
 */
export function EditClientModal({
  isOpen,
  onOpenChange,
  client,
  onSave,
}: EditClientModalProps) {
  // State to manage the form inputs for the user data.
  const [formState, setFormState] = useState<Partial<User>>({});

  // Populates the form state when a client object is provided.
  useEffect(() => {
    if (client) {
      setFormState({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        role: client.role,
      });
    }
  }, [client]);

  // If no client is provided, the modal will not render.
  if (!client) return null;

  /**
   * @function handleChange
   * @description Handles changes in form inputs and updates the component's state.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Explicitly typing `prev` solves potential TypeScript errors with implicit 'any'.
    setFormState((prev: Partial<User>) => ({ ...prev, [name]: value }));
  };

  /**
   * @function handleSaveChanges
   * @description Validates form data and calls the onSave prop to persist changes.
   */
  const handleSaveChanges = async () => {
    // Basic validation for required fields.
    if (!formState.name || !formState.email) {
      toast.error("User name and email are required.");
      return;
    }
    // Validates phone number format.
    if (formState.phone && !PHONE_REGEX.test(formState.phone)) {
      toast.error("Phone number contains invalid characters.");
      return;
    }

    const dataToSave: Partial<User> = {
      ...formState,
      email: formState.email.trim(),
    };

    await onSave(client.id, dataToSave);
    onOpenChange(false); // Closes modal after saving.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit User: {client.name}</DialogTitle>
        </DialogHeader>
        {/* Form fields for editing user details */}
        <div className="grid gap-4 py-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="clientFormRoleModal"
              className="text-right col-span-1"
            >
              Role
            </Label>
            <select
              id="clientFormRoleModal"
              name="role"
              value={formState.role || "client"}
              onChange={handleChange}
              className="col-span-3 border-input rounded-md p-2 h-10 w-full bg-transparent border"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSaveChanges}
            className="bg-barber-brown text-white hover:bg-barber-dark-brown"
          >
            Save User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
