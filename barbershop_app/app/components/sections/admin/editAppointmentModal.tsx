/**
 * @file barbershop_app/app/components/sections/admin/editAppointmentModal.tsx
 * @description This file contains the EditAppointmentModal component, a dialog for editing the details of an existing appointment.
 */

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

/**
 * @interface EditAppointmentModalProps
 * @description Defines the properties for the EditAppointmentModal component.
 * @property {boolean} isOpen - Controls the visibility of the dialog.
 * @property {(isOpen: boolean) => void} onOpenChange - Callback function to handle the dialog's open/close state.
 * @property {Appointment | null} appointment - The appointment object to be edited.
 * @property {(appointmentId: string, appointmentData: Partial<Appointment>) => Promise<void>} onSave - Async callback function to save appointment changes.
 */
interface EditAppointmentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  appointment: Appointment | null;
  onSave: (
    appointmentId: string,
    appointmentData: Partial<Appointment>
  ) => Promise<void>;
}

/**
 * @function capitalize
 * @description Helper function to capitalize the first letter of a string.
 * @param {string} s - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * @component EditAppointmentModal
 * @description A modal dialog component for editing an appointment's date, time, and status.
 * @param {EditAppointmentModalProps} props - The props for the component.
 */
export function EditAppointmentModal({
  isOpen,
  onOpenChange,
  appointment,
  onSave,
}: EditAppointmentModalProps) {
  // Manages the state of the form inputs. Status is capitalized for the select input UI.
  const [formState, setFormState] = useState({
    date: "",
    time: "",
    status: "Scheduled",
  });

  // Populates the form with the current appointment data whenever the 'appointment' prop changes.
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

  // If there is no appointment data, the modal does not render.
  if (!appointment) return null;

  /**
   * @function handleChange
   * @description Updates the form state when an input value changes.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @function handleSave
   * @description Validates the form, prepares the data, and calls the onSave prop to persist the changes.
   */
  const handleSave = async () => {
    if (!formState.date || !formState.time || !formState.status) {
      toast.error("Date, time, and status are required.");
      return;
    }

    // Prepares the data payload for saving, converting status back to lowercase for consistency.
    const saveData: Partial<Appointment> = {
      date: formState.date,
      time: formState.time,
      status: formState.status.toLowerCase() as Appointment["status"],
    };

    await onSave(appointment.id, saveData);
    onOpenChange(false); // Closes the modal on successful save.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Edit Appointment for {appointment.clientName}
          </DialogTitle>
        </DialogHeader>
        {/* Form fields for editing appointment details */}
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
