// app/(pages)/profile/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import ProfileFormClient from '@/app/components/sections/profile/ProfileFormClient';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

// 1. Importa a função 'cookies' diretamente
import { cookies } from 'next/headers';

async function getServerSideUser() {
  // 2. Lê o cookie diretamente aqui
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  const session = JSON.parse(sessionCookie);
  if (!session?.userId) return null;

  await connectDB();
  const user = await User.findById(session.userId).lean();
  return user;
}

export default async function ProfilePage() {
  const user = await getServerSideUser();

  // Se não houver usuário logado, redireciona
  if (!user) {
    redirect('/login?redirect=/profile');
  }

  const safeUser = JSON.parse(JSON.stringify(user));

  // Retorna apenas o conteúdo principal da página
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-serif text-barber-brown">
        My Profile
      </h1>
      <ProfileFormClient initialUser={safeUser} />
    </div>
  );
}
