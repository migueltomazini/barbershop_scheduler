// app/actions/userActions.ts
'use server';

import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

interface ProfileUpdateData {
  userId: string;
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

/**
 * @action updateUserProfileAction
 * @description Atualiza os dados de perfil de um usuário no banco de dados.
 */
export async function updateUserProfileAction(data: ProfileUpdateData) {
  const { userId, ...updateData } = data;

  if (!userId) {
    return { success: false, message: "User ID is missing." };
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, updateData);

    // Diz ao Next.js para limpar o cache desta página, forçando a busca de novos dados
    revalidatePath('/profile');
    
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return { success: false, message: `Failed to update profile: ${error.message}` };
  }
}