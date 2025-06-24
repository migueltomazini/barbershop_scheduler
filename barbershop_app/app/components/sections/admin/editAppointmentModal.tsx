/**
 * @file barbershop_app/app/components/sections/admin/editAppointmentModal.tsx
 * @description FINAL VERSION: The 'capitalize' utility is now safe for undefined and null values.
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
 * Props definition for the EditAppointmentModal component.
 *
 * @property {boolean} isOpen - Controls the visibility of the modal.
 * @property {(isOpen: boolean) => void} onOpenChange - Callback to toggle the modal state.
 * @property {Appointment | null} appointment - The appointment being edited.
 * @property {(appointmentId: string, appointmentData: Partial<Appointment>) => Promise<void>} onSave - Async function to save the updated appointment.
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

// =========================================================================
// IMPROVED: 'capitalize' now safely handles empty, null, or undefined input.
// =========================================================================

/**
 * Converts the first character of a string to uppercase.
 * If the input is nullish or empty, returns an empty string instead.
 *
 * @param {string | undefined | null} s - The input string.
 * @returns {string} The capitalized string.
 */
const capitalize = (s: string | undefined | null): string => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Modal component for editing an existing appointment.
 *
 * Displays a form with pre-filled appointment data,
 * allows the admin to modify date, time, or status,
 * validates input fields, and submits changes via the onSave callback.
 * Automatically resets form fields when reopened.
 *
 * @param {EditAppointmentModalProps} props - Component props.
 * @returns {JSX.Element | null} The edit modal UI, or null if no appointment is selected.
 */
export function EditAppointmentModal({
  isOpen,
  onOpenChange,
  appointment,
  onSave,
}: EditAppointmentModalProps) {
  // Local state to store the form inputs for date, time, and status.
  const [formState, setFormState] = useState({
    date: "",
    time: "",
    status: "Scheduled",
  });

  /**
   * Effect to initialize or reset form fields whenever
   * the selected appointment changes or the modal is opened.
   */
  useEffect(() => {
    if (appointment) {
      const formDate = appointment.date
        ? format(parseISO(appointment.date), "yyyy-MM-dd")
        : "";
      const formTime = appointment.date
        ? format(parseISO(appointment.date), "HH:mm")
        : "";
      setFormState({
        date: formDate,
        time: formTime,
        status: capitalize(appointment.status),
      });
    }
  }, [appointment, isOpen]);

  // If no appointment is selected, render nothing.
  if (!appointment) return null;

  /**
   * Handles updates to form input fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Change event.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validates inputs and submits the updated appointment.
   * Displays an error toast if required fields are missing.
   * Closes the modal after a successful save.
   */
  const handleSave = async () => {
    if (!formState.date || !formState.time || !formState.status) {
      toast.error("Date, time, and status are required.");
      return;
    }

    const saveData: Partial<Appointment> = {
      date: formState.date,
      time: formState.time, // Server will combine date and time if needed.
      status: formState.status.toLowerCase() as Appointment["status"],
    };

    await onSave(appointment._id, saveData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Edit Appointment for {(appointment.user as any)?.name || '...'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Client</Label>
            <p className="col-span-3 font-medium">{(appointment.user as any)?.name || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Service</Label>
            <p className="col-span-3 font-medium">{(appointment.service as any)?.name || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apptFormDateModal" className="text-right col-span-1">Date</Label>
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
            <Label htmlFor="apptFormTimeModal" className="text-right col-span-1">Time</Label>
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
            <Label htmlFor="apptFormStatusModal" className="text-right col-span-1">Status</Label>
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
