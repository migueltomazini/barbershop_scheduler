// app/actions/cartActions.ts
'use server';

import connectDB from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import Product from "@/models/Product"; // Importa o modelo de Produto
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CartItem } from "@/app/contexts/CartContext";

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
      // Lógica para SERVIÇOS (criar agendamento)
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
      // LÓGICA DE PRODUTO ADICIONADA AQUI
      // =========================================================================
      if (item.type === 'product') {
        // 1. Encontra o produto no banco para verificar o estoque real
        const productInDb = await Product.findById(item.id);

        if (!productInDb) {
          throw new Error(`Product "${item.name}" not found in database.`);
        }

        // 2. Validação de segurança no servidor
        if (productInDb.quantity < item.quantity) {
          throw new Error(`Sorry, there is not enough stock for "${item.name}".`);
        }

        // 3. Calcula o novo estoque e a quantidade vendida
        const newStock = productInDb.quantity - item.quantity;
        const newSoldQuantity = (productInDb.soldQuantity || 0) + item.quantity;

        // 4. Atualiza o produto no banco de dados
        await Product.findByIdAndUpdate(item.id, {
          quantity: newStock,
          soldQuantity: newSoldQuantity,
        });
      }
    }

    // Após o sucesso, limpa o cache das páginas relevantes
    revalidatePath('/appointments');
    revalidatePath('/shop'); // Limpa o cache da loja para mostrar o novo estoque
    revalidatePath('/admin'); // Limpa o cache do painel de admin

  } catch (error: any) {
    // Se qualquer item falhar (ex: falta de estoque), a transação inteira para.
    return { success: false, message: `Checkout failed: ${error.message}` };
  }
  
  redirect('/checkoutSuccess');
}