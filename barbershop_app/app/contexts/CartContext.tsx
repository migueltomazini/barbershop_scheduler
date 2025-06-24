// app/contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { CartItem } from "@/app/types";

// O tipo ItemToAdd agora é mais simples
type ItemToAdd = Omit<CartItem, 'quantity'>;

type CartContextType = {
  items: CartItem[];
  addItem: (item: ItemToAdd) => void;
  removeItem: (id: string, type: "product" | "service") => void;
  updateQuantity: (id: string, type: "product" | "service", newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("barber-cart");
      if (savedCart) setItems(JSON.parse(savedCart));
    } catch (error) {
      localStorage.removeItem("barber-cart");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("barber-cart", JSON.stringify(items));
  }, [items]);

  // FUNÇÃO 'addItem' SIMPLIFICADA - SEM FETCH
  const addItem = (itemToAdd: ItemToAdd) => {
    // A verificação de estoque agora deve ser feita no servidor, dentro da checkoutAction
    // para garantir a segurança. Aqui, apenas adicionamos ao carrinho.
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === itemToAdd.id && i.type === itemToAdd.type
      );
      if (existingItem) {
        // Se o item já existe, apenas incrementa a quantidade
        return prevItems.map((item) =>
          item.id === itemToAdd.id && item.type === itemToAdd.type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Se não existe, adiciona com quantidade 1
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
    toast.success(`${itemToAdd.name} added to cart!`);
  };
  
  // FUNÇÃO 'updateQuantity' SIMPLIFICADA - SEM FETCH
  const updateQuantity = (id: string, type: "product" | "service", newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id, type);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const removeItem = (id: string, type: "product" | "service") => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  const clearCart = () => {
    setItems([]);
  };
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
