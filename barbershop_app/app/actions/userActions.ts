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
 * @description
 * Server-side action to update a user's profile data in the database.
 * 
 * This function:
 * - Expects a structured data object including userId and updated profile fields.
 * - Validates that the userId is provided.
 * - Connects to MongoDB via Mongoose.
 * - Updates the user document matching the userId with the provided fields.
 * - Triggers Next.js cache revalidation for the '/profile' path to reflect updated data.
 * - Returns success status and message on completion or an error message if failed.
 * 
 * @param data - Object containing userId and profile update information including name, phone, and address.
 * @returns Object with success boolean and message string indicating result.
 */
export async function updateUserProfileAction(data: ProfileUpdateData) {
  const { userId, ...updateData } = data;

  if (!userId) {
    return { success: false, message: "User ID is missing." };
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, updateData);

    // Informs Next.js to invalidate cache for /profile page to fetch fresh data
    revalidatePath('/profile');
    
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return { success: false, message: `Failed to update profile: ${error.message}` };
  }
}
