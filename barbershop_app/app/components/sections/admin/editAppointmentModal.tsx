"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
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
import { Appointment } from "@/app/types";

// Defines the props for the EditAppointmentModal component
interface EditAppointmentModalProps {
  isOpen: boolean; // Controls whether the dialog is open
  onOpenChange: (isOpen: boolean) => void; // Callback to handle dialog open/close
  appointment: Appointment | null; // The appointment object to be edited
  // Callback function to save the updated appointment data
  onSave: (
    appointmentId: string,
    appointmentData: {
      clientId: number;
      serviceId: number;
      date: string;
      time: string;
      status: "scheduled" | "completed" | "cancelled" | "pending";
      notes?: string;
      clientName?: string;
      serviceName?: string;
    }
  ) => Promise<void>;
}

// EditAppointmentModal functional component
export function EditAppointmentModal({
  isOpen,
  onOpenChange,
  appointment,
  onSave,
}: EditAppointmentModalProps) {
  // State to manage form input values
  const [formState, setFormState] = useState<Partial<Appointment>>({});

  // Effect to populate formState when a new appointment is provided or when the modal opens
  useEffect(() => {
    if (appointment) {
      // Formats the date to 'yyyy-MM-dd' for the date input field
      const formDate = appointment.date
        ? format(parseISO(appointment.date), "yyyy-MM-dd")
        : "";
      setFormState({
        ...appointment,
        date: formDate,
        time: appointment.time || (appointment as any).time,
      });
    } else {
      // Clears formState if no appointment is provided
      setFormState({});
    }
  }, [appointment]);

  // Renders nothing if no appointment object is provided
  if (!appointment) return null;

  // Handles changes to form input fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the save action, validating input and calling the onSave callback
  const handleSave = async () => {
    if (!formState.date || !formState.time || !formState.status) {
      toast.error("Date, time, and status are required for appointments.");
      return;
    }
    // Calls the onSave callback with the appointment ID and updated data
    await onSave(appointment.id, {
      date: formState.date,
      time: formState.time,
      status: formState.status as Appointment["status"],
      // Preserves original IDs and names as they are not editable in this modal
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
    });
    // Closes the modal after saving
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Edit Appointment for {appointment.clientName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Client Name Field (read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Client</Label>
            <p className="col-span-3 font-medium">
              {formState.clientName || appointment.clientName}
            </p>
          </div>
          {/* Service Name Field (read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Service</Label>
            <p className="col-span-3 font-medium">
              {formState.serviceName || appointment.serviceName}
            </p>
          </div>
          {/* Date Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="apptFormDateModal"
              className="text-right col-span-1"
            >
              Date
            </Label>
            <Input
              id="apptFormDateModal"
              name="date"
              type="date"
              value={formState.date || ""}
              onChange={handleChange}
              className="col-span-3 border-barber-cream"
            />
          </div>
          {/* Time Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="apptFormTimeModal"
              className="text-right col-span-1"
            >
              Time
            </Label>
            <Input
              id="apptFormTimeModal"
              name="time"
              type="time"
              value={formState.time || ""}
              onChange={handleChange}
              className="col-span-3 border-barber-cream"
            />
          </div>
          {/* Status Select Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="apptFormStatusModal"
              className="text-right col-span-1"
            >
              Status
            </Label>
            <select
              id="apptFormStatusModal"
              name="status"
              value={formState.status || ""}
              onChange={handleChange}
              className="col-span-3 border-barber-cream rounded-md p-2 h-10 focus:ring-barber-gold focus:border-barber-gold"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
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
            onClick={handleSave}
            className="bg-barber-brown hover:bg-barber-dark-brown"
          >
            Save Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
