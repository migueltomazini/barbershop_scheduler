"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define more specific item types
export type ProductCartItemDetails = {
  type: 'product';
  description?: string; // Products might have descriptions
};

export type ServiceCartItemDetails = {
  type: 'service';
  duration?: string; // Services have duration
  icon?: string;     // Services might have an icon
};

// Base item structure
type BaseCartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

// Union type for CartItem
export type CartItem = BaseCartItem & (ProductCartItemDetails | ServiceCartItemDetails);

// Type for item being added (quantity is handled by addItem)
export type ItemToAdd = Omit<BaseCartItem, "quantity"> & (ProductCartItemDetails | ServiceCartItemDetails);


type CartContextType = {
  items: CartItem[];
  addItem: (item: ItemToAdd) => void; // Updated to accept the new ItemToAdd type
  removeItem: (id: number, type: 'product' | 'service') => void; // Need type to uniquely identify if IDs can overlap
  updateQuantity: (id: number, type: 'product' | 'service', quantity: number) => void; // Need type
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("barber-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage when it changes
    localStorage.setItem("barber-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (itemToAdd: ItemToAdd) => {
    setItems((prevItems) => {
      // Check if item already exists in cart (matching by id and type)
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === itemToAdd.id && i.type === itemToAdd.type
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: number, type: 'product' | 'service') => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  const updateQuantity = (id: number, type: 'product' | 'service', quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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