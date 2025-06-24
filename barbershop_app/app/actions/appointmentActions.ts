// app/actions/appointmentActions.ts
'use server';

import connectDB from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

interface BookingData {
  userId: string;
  serviceId: string;
  date: string;
  time: string;
}

// Função para buscar horários ocupados
export async function getBookedTimes(date: string) {
  try {
    await connectDB();
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: startDate, $lte: endDate },
      status: 'scheduled',
    }).lean();

    return appointments.map(app => format(new Date(app.date), "HH:mm"));
  } catch (error) {
    console.error("Failed to get booked times:", error);
    return [];
  }
}

// Função para agendar
export async function bookAppointmentAction(data: BookingData) {
  const { userId, serviceId, date, time } = data;
  if (!userId || !serviceId || !date || !time) {
    return { success: false, message: "All fields are required." };
  }

  try {
    await connectDB();
    const appointmentDate = new Date(`${date}T${time}`);
    const existingAppointment = await Appointment.findOne({ date: appointmentDate, status: 'scheduled' });

    if (existingAppointment) {
      return { success: false, message: "Sorry, this time slot is no longer available." };
    }

    await Appointment.create({ user: userId, service: serviceId, date: appointmentDate, status: 'scheduled' });
    revalidatePath('/appointments');
    return { success: true, message: "Appointment booked successfully!" };
  } catch (error: any) {
    return { success: false, message: `Failed to book appointment: ${error.message}` };
  }
}

// =========================================================================
// FUNÇÕES QUE FALTAVAM ADICIONADAS AQUI
// =========================================================================

// Função para cancelar agendamento
export async function cancelAppointmentAction(appointmentId: string) {
  if (!appointmentId) {
    return { success: false, message: "Appointment ID is missing." };
  }
  try {
    await connectDB();
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'canceled' });
    revalidatePath('/appointments');
    return { success: true, message: "Appointment canceled." };
  } catch (error: any) {
    return { success: false, message: `Failed to cancel appointment: ${error.message}` };
  }
}

// Função para atualizar agendamento
export async function updateAppointmentAction(appointmentId: string, newDate: string, newTime: string) {
    if (!appointmentId || !newDate || !newTime) {
        return { success: false, message: "Missing data for update." };
    }
    try {
        await connectDB();
        const newAppointmentDate = new Date(`${newDate}T${newTime}`);
        await Appointment.findByIdAndUpdate(appointmentId, { date: newAppointmentDate });
        revalidatePath('/appointments');
        return { success: true, message: "Appointment updated successfully!" };
    } catch (error: any) {
        return { success: false, message: `Failed to update appointment: ${error.message}` };
    }
}