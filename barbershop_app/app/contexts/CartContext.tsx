/**
 * @file barbershop_app/app/contexts/CartContext.tsx
 * @description This file defines the context for the shopping cart. It manages the state of cart items,
 * provides functions to add, remove, and update items, and handles the checkout process including stock updates.
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define more specific types for cart items to distinguish between products and services.
export type ProductCartItemDetails = {
  type: "product";
  description?: string;
};

export type ServiceCartItemDetails = {
  type: "service";
  duration?: number;
  icon?: string;
};

// Base structure for any item in the cart.
type BaseCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

// A union type that represents either a product or a service in the cart.
export type CartItem = BaseCartItem &
  (ProductCartItemDetails | ServiceCartItemDetails);

// The type for an item before it's added to the cart (quantity is handled internally).
export type ItemToAdd = Omit<BaseCartItem, "quantity"> &
  (ProductCartItemDetails | ServiceCartItemDetails);

/**
 * @type CartContextType
 * @description Defines the shape of the data and functions provided by the CartContext.
 */
type CartContextType = {
  items: CartItem[];
  addItem: (item: ItemToAdd) => void;
  removeItem: (id: string, type: "product" | "service") => void;
  updateQuantity: (
    id: string,
    type: "product" | "service",
    newQuantity: number
  ) => void;
  clearCart: () => void;
  processCheckout: () => Promise<boolean>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * @component CartProvider
 * @description A provider component that manages the shopping cart state and makes it available
 * to all child components via the `useCart` hook.
 * @param {{ children: React.ReactNode }} props - The child components to be rendered.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // On initial load, retrieve the cart from localStorage.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("barber-cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem("barber-cart");
    }
  }, []);

  // Whenever the cart `items` state changes, save it to localStorage.
  useEffect(() => {
    localStorage.setItem("barber-cart", JSON.stringify(items));
  }, [items]);

  /**
   * @function addItem
   * @description Adds an item to the cart or increments its quantity if it already exists.
   * For products, it checks available stock before adding.
   * @param {ItemToAdd} itemToAdd - The item to be added.
   */
  const addItem = async (itemToAdd: ItemToAdd) => {
    // For products, perform a stock check against the mock API.
    if (itemToAdd.type === "product") {
      try {
        const response = await fetch(
          `http://localhost:3001/products/${itemToAdd.id}`
        );
        if (!response.ok) throw new Error("Product not found for stock check.");
        const productInDb = await response.json();

        const existingCartItem = items.find(
          (i) => i.id === itemToAdd.id && i.type === "product"
        );
        const currentCartQuantity = existingCartItem
          ? existingCartItem.quantity
          : 0;

        if (productInDb.quantity < currentCartQuantity + 1) {
          toast.error(
            `Sorry, only ${productInDb.quantity} of ${itemToAdd.name} in stock. You have ${currentCartQuantity} in cart.`
          );
          return;
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not verify product stock."
        );
        return;
      }
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === itemToAdd.id && i.type === itemToAdd.type
      );
      if (existingItemIndex >= 0) {
        // If item exists, increment quantity.
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Otherwise, add the new item with quantity 1.
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
    toast.success(`${itemToAdd.name} added to cart!`);
  };

  /**
   * @function removeItem
   * @description Removes an item completely from the cart.
   * @param {string} id - The ID of the item to remove.
   * @param {'product' | 'service'} type - The type of the item to remove.
   */
  const removeItem = (id: string, type: "product" | "service") => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  /**
   * @function updateQuantity
   * @description Updates the quantity of a specific item in the cart.
   * For products, it checks stock before updating. If quantity reaches 0, the item is removed.
   * @param {string} id - The ID of the item.
   * @param {'product' | 'service'} type - The type of the item.
   * @param {number} newQuantity - The new quantity for the item.
   */
  const updateQuantity = async (
    id: string,
    type: "product" | "service",
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      removeItem(id, type);
      return;
    }

    // Perform stock check for products.
    if (type === "product") {
      try {
        const response = await fetch(`http://localhost:3001/products/${id}`);
        if (!response.ok) throw new Error("Product not found for stock check.");
        const productInDb = await response.json();

        if (productInDb.quantity < newQuantity) {
          toast.error(
            `Sorry, only ${productInDb.quantity} of this item in stock.`
          );
          return;
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not verify product stock."
        );
        return;
      }
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  /**
   * @function processCheckout
   * @description Simulates the checkout process. For products in the cart, it sends PATCH requests
   * to the mock API to update the stock and sold quantity.
   * @returns {Promise<boolean>} True if checkout is successful, false otherwise.
   */
  const processCheckout = async (): Promise<boolean> => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    try {
      // Create an array of promises for all product stock updates.
      const updatePromises = items
        .filter((item) => item.type === "product")
        .map(async (cartItem) => {
          const productResponse = await fetch(
            `http://localhost:3001/products/${cartItem.id}`
          );
          if (!productResponse.ok)
            throw new Error(
              `Failed to fetch product ${cartItem.name} for stock update.`
            );
          const productData = await productResponse.json();

          const newStock = productData.quantity - cartItem.quantity;
          const newSoldQuantity =
            (productData.soldQuantity || 0) + cartItem.quantity;

          if (newStock < 0)
            throw new Error(
              `Not enough stock for ${cartItem.name}. Purchase cannot be completed.`
            );

          // Send the PATCH request to update the product.
          return fetch(`http://localhost:3001/products/${cartItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: newStock,
              soldQuantity: newSoldQuantity,
            }),
          });
        });

      // Wait for all update requests to complete.
      const responses = await Promise.all(updatePromises);
      // Check if any of the updates failed.
      if (responses.some((res) => !res.ok)) {
        throw new Error("One or more products failed to update stock.");
      }

      clearCart();
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during checkout."
      );
      console.error("Checkout processing error:", error);
      return false;
    }
  };

  // Derived state: Calculate total items and price from the `items` array.
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
        processCheckout,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * @hook useCart
 * @description A custom hook to easily access the CartContext from any component within the CartProvider.
 * @returns {CartContextType} The cart context.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
