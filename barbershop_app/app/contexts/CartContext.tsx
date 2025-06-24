/**
 * @file barbershop_app/app/contexts/CartContext.tsx
 * @description Provides a global shopping cart context for the application.
 * Manages adding, removing, and updating items in the cart, and persists the cart in localStorage.
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { CartItem } from "@/app/types";

/**
 * ItemToAdd
 * 
 * Represents the shape of an item when adding it to the cart.
 * It excludes the `quantity` because quantity is handled internally.
 */
type ItemToAdd = Omit<CartItem, 'quantity'>;

/**
 * CartContextType
 * 
 * Defines the structure of the cart context:
 * - `items`: Current items in the cart.
 * - `addItem`: Adds an item to the cart.
 * - `removeItem`: Removes an item from the cart by ID and type.
 * - `updateQuantity`: Updates the quantity of a specific item.
 * - `clearCart`: Removes all items from the cart.
 * - `totalItems`: Total number of items.
 * - `totalPrice`: Total price of all items.
 */
type CartContextType = {
  items: CartItem[];
  addItem: (item: ItemToAdd) => void;
  removeItem: (id: string, type: "product" | "service") => void;
  updateQuantity: (id: string, type: "product" | "service", newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

/**
 * CartContext
 * 
 * The React context object that holds the cart state.
 * It must be wrapped in a `CartProvider`.
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider
 * 
 * Wraps child components with the shopping cart context.
 * Initializes the cart state from localStorage and persists updates.
 * 
 * @param {Object} props - The provider props.
 * @param {ReactNode} props.children - React children nodes.
 * @returns {JSX.Element}
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("barber-cart");
      if (savedCart) setItems(JSON.parse(savedCart));
    } catch (error) {
      localStorage.removeItem("barber-cart");
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("barber-cart", JSON.stringify(items));
  }, [items]);

  /**
   * addItem
   * 
   * Adds an item to the cart or increases its quantity if it already exists.
   * Displays a toast notification.
   * 
   * @param {ItemToAdd} itemToAdd - The item to add.
   */
  const addItem = (itemToAdd: ItemToAdd) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === itemToAdd.id && i.type === itemToAdd.type
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemToAdd.id && item.type === itemToAdd.type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
    toast.success(`${itemToAdd.name} added to cart!`);
  };
  
  /**
   * updateQuantity
   * 
   * Updates the quantity of an existing item.
   * Removes the item if the new quantity is zero or less.
   * 
   * @param {string} id - Item ID.
   * @param {"product" | "service"} type - Type of item.
   * @param {number} newQuantity - New quantity.
   */
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
  
  /**
   * removeItem
   * 
   * Removes an item from the cart by its ID and type.
   * 
   * @param {string} id - Item ID.
   * @param {"product" | "service"} type - Type of item.
   */
  const removeItem = (id: string, type: "product" | "service") => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  /**
   * clearCart
   * 
   * Clears all items from the cart.
   */
  const clearCart = () => {
    setItems([]);
  };
  
  // Derived state: total items and total price
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

/**
 * useCart
 * 
 * A custom hook to access the cart context.
 * Throws an error if used outside of `CartProvider`.
 * 
 * @returns {CartContextType} The current cart context.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
