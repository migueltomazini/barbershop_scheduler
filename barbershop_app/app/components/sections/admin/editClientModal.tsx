// app/components/sections/admin/editClientModal.tsx

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

// Defines the props for the EditClientModal component
interface EditClientModalProps {
  isOpen: boolean; // Controls whether the dialog is open
  onOpenChange: (isOpen: boolean) => void; // Callback to handle dialog open/close
  client: User | null; // The user object to be edited
  onSave: (userId: string, userData: Partial<User>) => Promise<void>; // Callback to save changes
}

const PHONE_REGEX = /^[0-9\s-()+]*$/;

// EditClientModal functional component
export function EditClientModal({
  isOpen,
  onOpenChange,
  client,
  onSave,
}: EditClientModalProps) {
  const [formState, setFormState] = useState<Partial<User>>({});

  // Effect to populate formState when a client object is provided
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

  if (!client) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Explicitly type `prev` to solve the implicit 'any' error
    setFormState((prev: Partial<User>) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!formState.name || !formState.email) {
      toast.error("User name and email are required.");
      return;
    }
    if (formState.phone && !PHONE_REGEX.test(formState.phone)) {
      toast.error("Phone number contains invalid characters.");
      return;
    }

    const dataToSave: Partial<User> = {
      ...formState,
      email: formState.email.trim(),
    };

    await onSave(client.id, dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit User: {client.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientFormNameModal" className="text-right col-span-1">Name</Label>
            <Input id="clientFormNameModal" name="name" value={formState.name || ""} onChange={handleChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientFormEmailModal" className="text-right col-span-1">Email</Label>
            <Input id="clientFormEmailModal" name="email" type="email" value={formState.email || ""} onChange={handleChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientFormPhoneModal" className="text-right col-span-1">Phone</Label>
            <Input id="clientFormPhoneModal" name="phone" value={formState.phone || ""} onChange={handleChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientFormAddressModal" className="text-right col-span-1">Address</Label>
            <Input id="clientFormAddressModal" name="address" value={formState.address || ""} onChange={handleChange} className="col-span-3" placeholder="User's address"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientFormRoleModal" className="text-right col-span-1">Role</Label>
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
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSaveChanges} className="bg-barber-brown text-white hover:bg-barber-dark-brown">Save User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}