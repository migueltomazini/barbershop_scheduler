"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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
  onSave: (
    serviceId: number,
    serviceData: Partial<ServiceType>
  ) => Promise<void>; // Callback to save service changes
}

// EditServiceModal functional component
export function EditServiceModal({
  isOpen,
  onOpenChange,
  service,
  onSave,
}: EditServiceModalProps) {
  // State to manage form input values for the service
  const [formState, setFormState] = useState<Partial<ServiceType>>({});

  // Effect to populate formState with current service data when the modal opens
  useEffect(() => {
    if (service) {
      setFormState({
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description,
      });
    } else {
      // Resets formState if no service is provided
      setFormState({ name: "", price: 0, duration: 0, description: "" });
    }
  }, [service]);

  // Renders nothing if no service object is provided for editing
  if (!service) return null;

  // Handles changes to form input fields, converting price to a float
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handles saving the changes, validating input and calling the onSave callback
  const handleSave = async () => {
    if (!formState.name || formState.price == null || !formState.duration) {
      toast.error("Please fill all required service fields.");
      return;
    }
    // Calls the onSave callback with the service ID and updated data
    await onSave(service.id, {
      name: formState.name,
      price: Number(formState.price), // Ensures price is a number
      duration: formState.duration,
      description: formState.description || "",
    });
    onOpenChange(false); // Closes the modal after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service: {service.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Service Name Input Field */}
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
              className="col-span-3 border-barber-cream"
            />
          </div>
          {/* Service Price Input Field */}
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
              className="col-span-3 border-barber-cream"
              step="0.01"
              min="0"
            />
          </div>
          {/* Service Duration Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="serviceFormDurationModal"
              className="text-right col-span-1"
            >
              Duration
            </Label>
            <Input
              id="serviceFormDurationModal"
              name="duration"
              value={formState.duration || ""}
              onChange={handleChange}
              className="col-span-3 border-barber-cream"
              placeholder="e.g., 45 min"
            />
          </div>
          {/* Service Description Textarea Field */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="serviceFormDescriptionModal"
              className="text-right col-span-1 mt-1"
            >
              Description
            </Label>
            <textarea
              id="serviceFormDescriptionModal"
              name="description"
              value={formState.description || ""}
              onChange={handleChange}
              className="col-span-3 border-barber-cream rounded-md p-2 h-24 resize-none"
              placeholder="Service description (optional)"
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
          {/* Save Service Button */}
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
