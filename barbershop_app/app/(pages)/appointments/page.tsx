// app/(pages)/appointments/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import AppointmentClientPage from '@/app/components/sections/appointments/AppointmentClientPage';
import connectDB from '@/lib/mongoose';
import Service from '@/models/Service';
import Appointment from '@/models/Appointment';

// 1. Importa a função 'cookies' diretamente
import { cookies } from 'next/headers';

async function getPageData(userId: string | undefined) {
  if (!userId) {
    return { services: [], initialAppointments: [] };
  }
  await connectDB();
  const servicesPromise = Service.find({}).sort({ name: 1 }).lean();
  const appointmentsPromise = Appointment.find({ user: userId })
    .sort({ date: -1 })
    .populate('service', 'name')
    .lean();
  
  const [services, initialAppointments] = await Promise.all([
    servicesPromise, 
    appointmentsPromise
  ]);
  
  return JSON.parse(JSON.stringify({ services, initialAppointments }));
}

export default async function AppointmentsPage() {
  // 2. Lê o cookie diretamente no servidor
  const sessionCookie = cookies().get('session')?.value;

  // Se não houver cookie, redireciona para o login
  if (!sessionCookie) {
    redirect('/login?redirect=/appointments');
  }

  // Se o cookie existir, converte seus dados para um objeto
  const session = JSON.parse(sessionCookie);
  
  const { services, initialAppointments } = await getPageData(session.userId);

  // Prepara os dados da sessão para enviar ao componente de cliente
  const clientSession = { 
    isAuthenticated: true, 
    user: { _id: session.userId, name: session.name } 
  };

  // A página retorna apenas o seu conteúdo principal
  return (
    <AppointmentClientPage
      services={services}
      initialAppointments={initialAppointments}
      session={clientSession}
    />
  );
}
