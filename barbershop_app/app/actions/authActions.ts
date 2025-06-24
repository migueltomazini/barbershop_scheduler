// app/actions/authActions.ts
'use server';

import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'; // Importa a função de cookies

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string;

  try {
    await connectDB();
    const user = await User.findOne({ email }).select('+password');
    if (!user || password !== user.password) {
      return { error: "Invalid credentials." };
    }

    // SUCESSO! CRIA A SESSÃO AQUI
    const sessionData = { 
      userId: user._id.toString(), 
      name: user.name, 
      role: user.role 
    };

    cookies().set('session', JSON.stringify(sessionData), {
      httpOnly: true, // O cookie não pode ser acessado por JavaScript no navegador
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // Duração de 1 dia
      path: '/',
    });
    
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }

  redirect(callbackUrl || '/');
}

export async function signupAction(formData: FormData) {
  // ... sua signupAction continua aqui, sem alterações ...
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Please fill in all required fields." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }
    await User.create({ name, email, password, phone, role: 'client' });
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
  
  redirect('/login?signup=success');
}


// NOVA AÇÃO DE LOGOUT
export async function logoutAction() {
  // Apaga o cookie de sessão definindo uma data de expiração no passado
  cookies().set('session', '', { expires: new Date(0), path: '/' });
  redirect('/login');
}