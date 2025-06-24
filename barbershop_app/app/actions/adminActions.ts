'use server';

import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Service from "@/models/Service";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { revalidatePath } from "next/cache";
import { ProductType, ServiceType, User as UserType, Appointment as AppointmentType } from "@/app/types";

// Função genérica para criar ou atualizar
async function createOrUpdate<T>(model: any, data: Partial<T> & { _id?: string }) {
  const { _id, ...updateData } = data;
  if (_id) {
    await model.findByIdAndUpdate(_id, updateData);
  } else {
    await model.create(updateData);
  }
}

// Função genérica para deletar
async function deleteById(model: any, id: string) {
  await model.findByIdAndDelete(id);
}

// Ações específicas para cada tipo
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

export async function updateAppointment(appointmentId: string, appointmentData: Partial<AppointmentType>) {
    await connectDB();
    try {
        // Lógica para combinar data e hora, se necessário
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