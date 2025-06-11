// app/components/sections/admin/editServiceModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textArea"; // Assuming textarea component exists
import { ServiceType } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";

// Defines the props for the EditServiceModal component
interface EditServiceModalProps {
  isOpen: boolean; // Controls whether the dialog is open
  onOpenChange: (isOpen: boolean) => void; // Callback to handle dialog open/close
  service: ServiceType | null; // The service object to be edited
  onSave: (serviceData: Partial<ServiceType>) => Promise<void>; // Callback to save service changes
}

// EditServiceModal functional component
export function EditServiceModal({
  isOpen,
  onOpenChange,
  service,
  onSave,
}: EditServiceModalProps) {
  const [formState, setFormState] = useState<Partial<ServiceType>>({});

  // Effect to populate formState with current service data when the modal opens
  useEffect(() => {
    if (service) {
      setFormState({ ...service });
    } else {
      // Resets formState for creating a new service
      setFormState({
        name: "",
        price: 0,
        duration: 0,
        description: "",
        image: "",
        type: "service",
      });
    }
  }, [service, isOpen]);

  // Handles changes to form input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? name === "price"
            ? parseFloat(value) || 0
            : parseInt(value, 10) || 0
          : value,
    }));
  };

  // Handles saving the changes, validating input and calling the onSave callback
  const handleSave = async () => {
    if (!formState.name || formState.price == null || !formState.duration) {
      toast.error("Please fill all required service fields.");
      return;
    }
    await onSave(formState);
    onOpenChange(false); // Closes the modal after saving
  };

  const isNewService = !service;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isNewService
              ? "Create New Service"
              : `Edit Service: ${service?.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="serviceFormNameModal"
              className="text-right col-span-1"
            >
              Name
            </Label>
            <Input
              id="serviceFormNameModal"
              name="name"
              value={formState.name || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="serviceFormPriceModal"
              className="text-right col-span-1"
            >
              Price
            </Label>
            <Input
              id="serviceFormPriceModal"
              name="price"
              type="number"
              value={formState.price || ""}
              onChange={handleChange}
              className="col-span-3"
              step="0.01"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="serviceFormDurationModal"
              className="text-right col-span-1"
            >
              Duration (min)
            </Label>
            <Input
              id="serviceFormDurationModal"
              name="duration"
              type="number"
              value={formState.duration || ""}
              onChange={handleChange}
              className="col-span-3"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="serviceFormImageModal"
              className="text-right col-span-1"
            >
              Image URL
            </Label>
            <Input
              id="serviceFormImageModal"
              name="image"
              value={formState.image || ""}
              onChange={handleChange}
              className="col-span-3"
              placeholder="/images/services/service.jpg"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="serviceFormDescriptionModal"
              className="text-right col-span-1 mt-1"
            >
              Description
            </Label>
            <Textarea
              id="serviceFormDescriptionModal"
              name="description"
              value={formState.description || ""}
              onChange={handleChange}
              className="col-span-3 border rounded-md p-2 h-24 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="bg-barber-brown hover:bg-barber-dark-brown"
          >
            Save Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
