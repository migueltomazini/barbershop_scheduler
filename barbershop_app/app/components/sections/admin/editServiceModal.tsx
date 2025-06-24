/**
 * @file barbershop_app/app/components/sections/admin/editServiceModal.tsx
 * @description FINAL VERSION: Provides a modal dialog for creating new services or editing existing ones,
 * preserving any provided `_id` on save.
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
 * Props for the EditServiceModal component.
 *
 * @property {boolean} isOpen – Whether the modal is currently displayed.
 * @property {(isOpen: boolean) => void} onOpenChange – Callback to open or close the modal.
 * @property {ServiceType | null} service – The service to edit; null triggers creation mode.
 * @property {(serviceData: Partial<ServiceType>) => Promise<void>} onSave – Async handler
 *   that receives the complete service object (including `_id` when editing) to persist.
 */
interface EditServiceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: ServiceType | null;
  onSave: (serviceData: Partial<ServiceType>) => Promise<void>;
}

/**
 * EditServiceModal
 *
 * Renders a form inside a modal for creating or updating a service.  
 * - If `service` is provided, the form is pre-filled with its values.  
 * - Otherwise, fields start empty or at zero for number inputs.  
 * - Validates that name, price, and duration are supplied before saving.  
 * - Uses toast notifications for validation feedback and closes on success.
 */
export function EditServiceModal({
  isOpen,
  onOpenChange,
  service,
  onSave,
}: EditServiceModalProps) {
  // Holds the form data; uses Partial<ServiceType> to allow empty initial state.
  const [formState, setFormState] = useState<Partial<ServiceType>>({});

  /**
   * Synchronize form fields with the incoming `service` prop whenever it changes
   * or the modal is opened/closed.  
   * - If editing, spread all existing fields into state.  
   * - If creating, set defaults: blank text, zero numbers, and default type.
   */
  useEffect(() => {
    if (service) {
      setFormState({ ...service });
    } else {
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
   * Generic change handler for both text and number inputs.  
   * - Detects `type === "number"` and parses accordingly.  
   * - Updates only the changed field, preserving other state.
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
   * handleSave
   *
   * - Ensures `name` is non-empty, `price` is not null, and `duration` is positive.  
   * - On validation failure, displays an error toast.  
   * - On success, invokes `onSave` with the full `formState` (including `_id` if editing)
   *   and closes the modal.
   */
  const handleSave = async () => {
    if (!formState.name || formState.price == null || !formState.duration) {
      toast.error("Please fill all required service fields (name, price, duration).");
      return;
    }
    await onSave(formState);
    onOpenChange(false);
  };

  // Determines if the dialog is in creation mode (no existing service).
  const isNewService = !service;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isNewService ? "Create New Service" : `Edit Service: ${service?.name}`}
          </DialogTitle>
        </DialogHeader>

        {/* Main form grid */}
        <div className="grid gap-4 py-4">
          {/* Name field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceFormNameModal" className="text-right col-span-1">
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

          {/* Price field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceFormPriceModal" className="text-right col-span-1">
              Price
            </Label>
            <Input
              id="serviceFormPriceModal"
              name="price"
              type="number"
              value={formState.price ?? ""}
              onChange={handleChange}
              className="col-span-3"
              step="0.01"
              min="0"
            />
          </div>

          {/* Duration field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceFormDurationModal" className="text-right col-span-1">
              Duration (min)
            </Label>
            <Input
              id="serviceFormDurationModal"
              name="duration"
              type="number"
              value={formState.duration ?? ""}
              onChange={handleChange}
              className="col-span-3"
              min="0"
            />
          </div>

          {/* Image URL field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceFormImageModal" className="text-right col-span-1">
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

          {/* Description field */}
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

        {/* Modal actions */}
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
