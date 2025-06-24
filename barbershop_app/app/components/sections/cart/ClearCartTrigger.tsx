// app/components/sections/cart/ClearCartTrigger.tsx
"use client";

import { useEffect } from 'react';
import { useCart } from '@/app/contexts/CartContext';

/**
 * @component ClearCartTrigger
 * @description Um componente de cliente sem UI, cuja única função é
 * chamar a função clearCart() do contexto quando ele é montado.
 */
export function ClearCartTrigger() {
  const { clearCart, items } = useCart();

  useEffect(() => {
    // Garante que a limpeza só aconteça se houver itens,
    // tornando a operação segura para ser chamada múltiplas vezes.
    if (items.length > 0) {
      clearCart();
    }
  }, [clearCart, items]); // Executa quando o componente é montado

  // Este componente não renderiza nada na tela.
  return null;
}