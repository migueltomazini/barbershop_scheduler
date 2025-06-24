/**
 * @file app/actions/adminActions.ts
 * @description
 * Server-side actions used in the Admin Panel to perform CRUD operations on
 * products, services, users, and appointments. These functions use Mongoose
 * to interact with a MongoDB database and revalidate static paths using Next.js 13+ cache utilities.
 * 
 * Key Features:
 * - Database connection via `connectDB()`.
 * - Generalized helpers (`createOrUpdate`, `deleteById`) for code reuse.
 * - Uses `revalidatePath('/admin')` to ensure the UI stays updated after any data change.
 * - Error handling and typed return values for safe async operations.
 */

'use server';

import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Service from "@/models/Service";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { revalidatePath } from "next/cache";
import { ProductType, ServiceType, User as UserType, Appointment as AppointmentType } from "@/app/types";

/**
 * createOrUpdate
 * ----------------------
 * A generic helper function to either create a new document or update an existing one
 * based on whether the `_id` field is present in the provided data.
 * 
 * @param model - The Mongoose model (e.g., Product, Service)
 * @param data - The data to insert or update, optionally containing `_id`
 */
async function createOrUpdate<T>(model: any, data: Partial<T> & { _id?: string }) {
  const { _id, ...updateData } = data;
  if (_id) {
    await model.findByIdAndUpdate(_id, updateData);
  } else {
    await model.create(updateData);
  }
}

/**
 * deleteById
 * ----------------------
 * A generic helper to delete a document by its ID from a given Mongoose model.
 * 
 * @param model - The Mongoose model to operate on
 * @param id - The document's ID
 */
async function deleteById(model: any, id: string) {
  await model.findByIdAndDelete(id);
}

/**
 * saveProduct
 * ----------------------
 * Saves (creates or updates) a product in the database.
 * Triggers a revalidation of the /admin path to update cached data.
 */
export async function saveProduct(productData: Partial<ProductType>) {
  try {
    await connectDB();
    await createOrUpdate(Product, productData);
    revalidatePath("/admin");
    return { success: true, message: "Product saved successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * deleteProduct
 * ----------------------
 * Deletes a product by ID and triggers revalidation.
 */
export async function deleteProduct(productId: string) {
  try {
    await connectDB();
    await deleteById(Product, productId);
    revalidatePath("/admin");
    return { success: true, message: "Product deleted." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * saveService
 * ----------------------
 * Saves (creates or updates) a service in the database.
 * Triggers revalidation of the admin path.
 */
export async function saveService(serviceData: Partial<ServiceType>) {
  try {
    await connectDB();
    await createOrUpdate(Service, serviceData);
    revalidatePath("/admin");
    return { success: true, message: "Service saved successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * deleteService
 * ----------------------
 * Deletes a service by ID and revalidates the admin page.
 */
export async function deleteService(serviceId: string) {
  try {
    await connectDB();
    await deleteById(Service, serviceId);
    revalidatePath("/admin");
    return { success: true, message: "Service deleted." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * updateUser
 * ----------------------
 * Updates a user document based on its ID.
 * Used for role changes, contact updates, etc.
 */
export async function updateUser(userId: string, userData: Partial<UserType>) {
  await connectDB();
  try {
    await User.findByIdAndUpdate(userId, userData);
    revalidatePath('/admin');
    return { success: true, message: 'User updated successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * deleteUser
 * ----------------------
 * Deletes a user account by ID and triggers revalidation.
 */
export async function deleteUser(userId: string) {
  await connectDB();
  try {
    await User.findByIdAndDelete(userId);
    revalidatePath('/admin');
    return { success: true, message: 'User deleted.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * updateAppointment
 * ----------------------
 * Updates an appointment record.
 * If both date and time are provided, they are merged into a single `Date` object.
 */
export async function updateAppointment(appointmentId: string, appointmentData: Partial<AppointmentType>) {
  await connectDB();
  try {
    // Merge date and time fields if both are present
    if (appointmentData.date && appointmentData.time) {
      (appointmentData as any).date = new Date(`${appointmentData.date}T${appointmentData.time}`);
    }

    await Appointment.findByIdAndUpdate(appointmentId, appointmentData);
    revalidatePath('/admin');
    return { success: true, message: 'Appointment updated successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * deleteAppointment
 * ----------------------
 * Deletes an appointment by its ID and revalidates the admin page.
 */
export async function deleteAppointment(appointmentId: string) {
  await connectDB();
  try {
    await Appointment.findByIdAndDelete(appointmentId);
    revalidatePath('/admin');
    return { success: true, message: 'Appointment deleted.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
