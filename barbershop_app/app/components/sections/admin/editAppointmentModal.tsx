/**
 * @file barbershop_app/app/components/sections/admin/editAppointmentModal.tsx
 * @description VERSÃO FINAL: A função 'capitalize' foi corrigida para ser mais segura.
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
// CORREÇÃO AQUI: Função 'capitalize' agora é segura
// =========================================================================
const capitalize = (s: string | undefined | null): string => {
  // Se 's' for nulo, undefined ou uma string vazia, retorna uma string vazia.
  if (!s) return "";
  // Caso contrário, capitaliza normalmente.
  return s.charAt(0).toUpperCase() + s.slice(1);
};


export function EditAppointmentModal({
  isOpen,
  onOpenChange,
  appointment,
  onSave,
}: EditAppointmentModalProps) {
  const [formState, setFormState] = useState({
    date: "",
    time: "",
    status: "Scheduled",
  });

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
        status: capitalize(appointment.status), // Agora esta chamada é segura
      });
    }
  }, [appointment, isOpen]); // Adicionado isOpen para resetar ao reabrir

  if (!appointment) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formState.date || !formState.time || !formState.status) {
      toast.error("Date, time, and status are required.");
      return;
    }

    const saveData: Partial<Appointment> = {
      date: formState.date,
      time: formState.time, // O backend irá combinar data e hora
      status: formState.status.toLowerCase() as Appointment["status"],
    };

    await onSave(appointment._id, saveData); // Usa _id do MongoDB
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
            <Input id="apptFormDateModal" name="date" type="date" value={formState.date} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apptFormTimeModal" className="text-right col-span-1">Time</Label>
            <Input id="apptFormTimeModal" name="time" type="time" value={formState.time} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apptFormStatusModal" className="text-right col-span-1">Status</Label>
            <select id="apptFormStatusModal" name="status" value={formState.status} onChange={handleChange} className="col-span-3 border-input rounded-md p-2 h-10 w-full bg-transparent border">
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSave} className="bg-barber-brown text-white hover:bg-barber-dark-brown">
            Save Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
