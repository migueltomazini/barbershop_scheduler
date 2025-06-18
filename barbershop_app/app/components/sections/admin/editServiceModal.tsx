/**
 * @file barbershop_app/app/components/sections/admin/editServiceModal.tsx
 * @description This file contains the EditServiceModal component, a dialog for creating a new service or editing an existing one.
 */

"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textArea";
import { ServiceType } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";

/**
 * @interface EditServiceModalProps
 * @description Defines the properties for the EditServiceModal component.
 * @property {boolean} isOpen - Controls whether the dialog is open.
 * @property {(isOpen: boolean) => void} onOpenChange - Callback to handle dialog open/close.
 * @property {ServiceType | null} service - The service object to edit, or null to create a new one.
 * @property {(serviceData: Partial<ServiceType>) => Promise<void>} onSave - Async callback to save service changes.
 */
interface EditServiceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: ServiceType | null;
  onSave: (serviceData: Partial<ServiceType>) => Promise<void>;
}

/**
 * @component EditServiceModal
 * @description A modal dialog for creating or editing service details like name, price, and duration.
 * @param {EditServiceModalProps} props - The props for the component.
 */
export function EditServiceModal({
  isOpen,
  onOpenChange,
  service,
  onSave,
}: EditServiceModalProps) {
  // State to manage the form inputs for the service data.
  const [formState, setFormState] = useState<Partial<ServiceType>>({});

  // Populates form with existing data when editing, or resets it for a new service.
  useEffect(() => {
    if (service) {
      setFormState({ ...service });
    } else {
      // Resets form state for creating a new service.
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

  /**
   * @function handleChange
   * @description Updates the form state on input change, parsing number values correctly.
   */
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

  /**
   * @function handleSave
   * @description Validates form fields and triggers the onSave callback.
   */
  const handleSave = async () => {
    if (!formState.name || formState.price == null || !formState.duration) {
      toast.error("Please fill all required service fields.");
      return;
    }
    await onSave(formState);
    onOpenChange(false); // Closes the modal after saving.
  };

  // Flag to determine if creating a new service for UI adjustments.
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
            className="bg-barber-brown text-white hover:bg-barber-dark-brown"
          >
            Save Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
