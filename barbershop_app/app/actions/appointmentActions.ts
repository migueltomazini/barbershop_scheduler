/**
 * @file app/actions/appointmentActions.ts
 * @description
 * Server-side actions for managing user appointments in the barbershop application.
 * Includes booking, canceling, updating appointments, and retrieving occupied time slots.
 * 
 * Features:
 * - All actions are declared as server functions using `'use server'`.
 * - Uses Mongoose for database operations (CRUD) with MongoDB.
 * - Applies `revalidatePath()` from Next.js to update static pages after mutations.
 * - Includes validation and error handling for each function.
 */

'use server';

import connectDB from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

interface BookingData {
  userId: string;
  serviceId: string;
  date: string; // Format: 'YYYY-MM-DD'
  time: string; // Format: 'HH:mm'
}

/**
 * getBookedTimes
 * ----------------------------------
 * Fetches all booked time slots for a specific day.
 * 
 * Converts the input date to a full UTC range (00:00:00 to 23:59:59),
 * then queries for appointments scheduled on that day with status 'scheduled'.
 * 
 * @param date - The selected date in ISO format (e.g., "2025-06-01")
 * @returns An array of strings (e.g., ["10:00", "14:30"]) representing occupied time slots.
 */
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

/**
 * bookAppointmentAction
 * ----------------------------------
 * Books a new appointment if the selected time slot is available.
 * 
 * Performs:
 * - Validation of all input fields.
 * - Conflict check to ensure the time slot is not already booked.
 * - Creation of a new appointment with 'scheduled' status.
 * - Revalidates the `/appointments` route for updated display.
 * 
 * @param data - Booking data including userId, serviceId, date, and time.
 * @returns A success/failure object with a status message.
 */
export async function bookAppointmentAction(data: BookingData) {
  const { userId, serviceId, date, time } = data;
  if (!userId || !serviceId || !date || !time) {
    return { success: false, message: "All fields are required." };
  }

  try {
    await connectDB();
    const appointmentDate = new Date(`${date}T${time}`);

    const existingAppointment = await Appointment.findOne({
      date: appointmentDate,
      status: 'scheduled',
    });

    if (existingAppointment) {
      return { success: false, message: "Sorry, this time slot is no longer available." };
    }

    await Appointment.create({
      user: userId,
      service: serviceId,
      date: appointmentDate,
      status: 'scheduled',
    });

    revalidatePath('/appointments');
    return { success: true, message: "Appointment booked successfully!" };
  } catch (error: any) {
    return { success: false, message: `Failed to book appointment: ${error.message}` };
  }
}

/**
 * cancelAppointmentAction
 * ----------------------------------
 * Cancels an existing appointment by updating its status to 'canceled'.
 * 
 * @param appointmentId - The ID of the appointment to be canceled.
 * @returns A success/failure object with a message.
 */
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

/**
 * updateAppointmentAction
 * ----------------------------------
 * Updates the date and time of an existing appointment.
 * The new date and time are combined into a new Date object.
 * 
 * @param appointmentId - The ID of the appointment to update.
 * @param newDate - New date in 'YYYY-MM-DD' format.
 * @param newTime - New time in 'HH:mm' format.
 * @returns A success/failure object with a message.
 */
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
