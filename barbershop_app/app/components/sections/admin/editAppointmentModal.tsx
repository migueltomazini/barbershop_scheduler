// app/components/sections/admin/editAppointmentModal.tsx

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
  onSave: (
    appointmentId: string,
    appointmentData: Partial<Appointment>
  ) => Promise<void>;
}

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// EditAppointmentModal functional component
export function EditAppointmentModal({
  isOpen,
  onOpenChange,
  appointment,
  onSave,
}: EditAppointmentModalProps) {
  // State to manage form input values, status is managed as a capitalized string for the select input
  const [formState, setFormState] = useState({
    date: "",
    time: "",
    status: "Scheduled", // Default capitalized value
  });

  // Effect to populate formState when a new appointment is provided or when the modal opens
  useEffect(() => {
    if (appointment) {
      const formDate = appointment.date
        ? format(parseISO(appointment.date), "yyyy-MM-dd")
        : "";
      setFormState({
        date: formDate,
        time: appointment.time || "",
        status: capitalize(appointment.status),
      });
    }
  }, [appointment]);

  // Renders nothing if no appointment object is provided
  if (!appointment) return null;

  // Handles changes to form input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the save action, validating input and calling the onSave callback
  const handleSave = async () => {
    if (!formState.date || !formState.time || !formState.status) {
      toast.error("Date, time, and status are required.");
      return;
    }

    // Create the payload for onSave, converting status back to lowercase
    const saveData: Partial<Appointment> = {
      date: formState.date,
      time: formState.time,
      status: formState.status.toLowerCase() as Appointment["status"],
    };

    await onSave(appointment.id, saveData);
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Client</Label>
            <p className="col-span-3 font-medium">{appointment.clientName}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Service</Label>
            <p className="col-span-3 font-medium">{appointment.serviceName}</p>
          </div>
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
              value={formState.date}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
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
              value={formState.time}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
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
              value={formState.status}
              onChange={handleChange}
              className="col-span-3 border-input rounded-md p-2 h-10 w-full bg-transparent border"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
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
            Save Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
