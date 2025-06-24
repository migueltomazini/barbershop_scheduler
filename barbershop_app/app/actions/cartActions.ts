/**
 * @file app/actions/cartActions.ts
 * @description
 * Server-side action to process the checkout of items in the user's cart.
 * Supports booking appointments for services and purchasing products with stock validation.
 * 
 * Key features:
 * - Validates user authentication and cart content.
 * - For each cart item:
 *    - Creates an appointment if item is a service with date/time.
 *    - Validates stock and updates product quantity and sold count if item is a product.
 * - Uses Mongoose to interact with MongoDB.
 * - Revalidates caches for affected pages after successful checkout.
 * - Redirects to a checkout success page upon completion.
 */

'use server';

import connectDB from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import Product from "@/models/Product"; // Product model
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CartItem } from "@/app/contexts/CartContext";

/**
 * checkoutAction
 * -----------------------------------------
 * Processes the checkout of cart items for a logged-in user.
 * 
 * @param items - Array of cart items, each can be a product or a service.
 * @param userId - The ID of the authenticated user performing the checkout.
 * 
 * Behavior:
 * - If user is not authenticated, returns an error.
 * - If cart is empty, returns an error.
 * - For service items:
 *    - Creates scheduled appointments with the provided date and time.
 * - For product items:
 *    - Validates available stock on the server.
 *    - Throws an error if stock is insufficient.
 *    - Updates product stock and sold quantity atomically.
 * - Revalidates cache for /appointments, /shop, and /admin pages.
 * - Redirects to the checkout success page if all operations succeed.
 * 
 * @returns Object with success status and message if checkout fails.
 */
export async function checkoutAction(items: CartItem[], userId: string | undefined) {
  if (!userId) {
    return { success: false, message: "User is not authenticated." };
  }
  if (!items || items.length === 0) {
    return { success: false, message: "Your cart is empty." };
  }

  await connectDB();

  try {
    for (const item of items) {
      // Service item: create appointment if date and time are provided
      if (item.type === 'service' && item.date && item.time) {
        const appointmentDate = new Date(`${item.date}T${item.time}`);
        await Appointment.create({
          user: userId,
          service: item.id,
          date: appointmentDate,
          status: 'scheduled',
        });
      }

      // =========================================================================
      // Product item logic
      // =========================================================================
      if (item.type === 'product') {
        // 1. Fetch product from DB to check real stock
        const productInDb = await Product.findById(item.id);

        if (!productInDb) {
          throw new Error(`Product "${item.name}" not found in database.`);
        }

        // 2. Server-side stock validation
        if (productInDb.quantity < item.quantity) {
          throw new Error(`Sorry, there is not enough stock for "${item.name}".`);
        }

        // 3. Calculate updated stock and sold quantity
        const newStock = productInDb.quantity - item.quantity;
        const newSoldQuantity = (productInDb.soldQuantity || 0) + item.quantity;

        // 4. Update product stock and sold count in DB
        await Product.findByIdAndUpdate(item.id, {
          quantity: newStock,
          soldQuantity: newSoldQuantity,
        });
      }
    }

    // After success, clear cache for affected pages to show updated data
    revalidatePath('/appointments');
    revalidatePath('/shop'); // Refresh shop stock display
    revalidatePath('/admin'); // Refresh admin panel data

  } catch (error: any) {
    // On any failure (e.g., stock shortage), abort checkout with error message
    return { success: false, message: `Checkout failed: ${error.message}` };
  }
  
  // Redirect to success confirmation page after successful checkout
  redirect('/checkoutSuccess');
}
