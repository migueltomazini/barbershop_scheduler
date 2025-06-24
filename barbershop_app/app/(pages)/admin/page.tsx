// app/(pages)/admin/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/app/components/sections/admin/AdminDashboardClient";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Service from "@/models/Service";
import User from "@/models/User";
import Appointment from "@/models/Appointment";

// Importa a função 'cookies' diretamente
import { cookies } from "next/headers";

async function getAdminData() {
  await connectDB();
  const productsPromise = Product.find({}).sort({ createdAt: -1 }).lean();
  const servicesPromise = Service.find({}).sort({ createdAt: -1 }).lean();
  const clientsPromise = User.find({ role: 'client' }).sort({ createdAt: -1 }).lean();
  const appointmentsPromise = Appointment.find({})
    .populate('user', 'name')
    .populate('service', 'name')
    .sort({ date: -1 })
    .lean();

  const [products, services, clients, appointments] = await Promise.all([
    productsPromise,
    servicesPromise,
    clientsPromise,
    appointmentsPromise,
  ]);
  
  return JSON.parse(JSON.stringify({ products, services, clients, appointments }));
}

export default async function AdminPage() {
  // Lê o cookie de sessão diretamente no servidor
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? JSON.parse(sessionCookie) : null;

  // Lógica de autorização: se não há sessão ou o usuário não é 'admin', redireciona
  if (session?.role !== 'admin') {
    redirect('/');
  }

  const { products, services, clients, appointments } = await getAdminData();

  // Retorna apenas o conteúdo principal da página
  return (
    <main className="container mx-auto px-4 py-12 flex-grow">
      <AdminDashboardClient
        initialProducts={products}
        initialServices={services}
        initialClients={clients}
        initialAppointments={appointments}
      />
    </main>
  );
}
