// app/contexts/CartContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define more specific item types
export type ProductCartItemDetails = {
  type: "product";
  description?: string;
};

export type ServiceCartItemDetails = {
  type: "service";
  duration?: number;
  icon?: string;
};

// Base item structure - Changed id to string
type BaseCartItem = {
  id: string; // <--- MUDANÇA PRINCIPAL AQUI
  name: string;
  price: number;
  quantity: number;
  image: string;
};

// Union type for CartItem
export type CartItem = BaseCartItem &
  (ProductCartItemDetails | ServiceCartItemDetails);

// Type for item being added (quantity is handled by addItem)
export type ItemToAdd = Omit<BaseCartItem, "quantity"> &
  (ProductCartItemDetails | ServiceCartItemDetails);

type CartContextType = {
  items: CartItem[];
  addItem: (item: ItemToAdd) => void;
  removeItem: (id: string, type: "product" | "service") => void; // <--- MUDANÇA AQUI
  updateQuantity: (
    id: string, // <--- MUDANÇA AQUI
    type: "product" | "service",
    cartQuantity: number
  ) => void;
  clearCart: () => void;
  processCheckout: () => Promise<boolean>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("barber-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage when it changes
    localStorage.setItem("barber-cart", JSON.stringify(items));
  }, [items]);

  const addItem = async (itemToAdd: ItemToAdd) => {
    // Made async to check stock
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
      } catch (error: unknown) {
        let message = "Could not verify product stock.";
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        }
        toast.error(message);
        return;
      }
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === itemToAdd.id && i.type === itemToAdd.type
      );
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
    toast.success(`${itemToAdd.name} added to cart!`);
  };

  const removeItem = (id: string, type: "product" | "service") => { // <-- id is now string
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  const updateQuantity = async (
    id: string, // <-- id is now string
    type: "product" | "service",
    newCartQuantity: number
  ) => {
    if (type === "product" && newCartQuantity > 0) {
      try {
        const response = await fetch(`http://localhost:3001/products/${id}`);
        if (!response.ok) throw new Error("Product not found for stock check.");
        const productInDb = await response.json();

        if (productInDb.quantity < newCartQuantity) {
          toast.error(
            `Sorry, only ${productInDb.quantity} of this item in stock.`
          );
          return;
        }
      } catch (error: unknown) {
        let message = "Could not verify product stock.";
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        }
        toast.error(message);
        return;
      }
    }

    if (newCartQuantity <= 0) {
      removeItem(id, type);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: newCartQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Function to process checkout and update stock
  const processCheckout = async (): Promise<boolean> => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    try {
      const updatePromises = items
        .filter((item) => item.type === "product")
        .map(async (cartItem) => {
          // Fetch current product data from server
          const productResponse = await fetch(
            `http://localhost:3001/products/${cartItem.id}`
          );
          if (!productResponse.ok) {
            throw new Error(
              `Failed to fetch product ${cartItem.name} for stock update.`
            );
          }
          const productData = await productResponse.json();

          // Calculate new stock and sold quantity
          const newStock = productData.quantity - cartItem.quantity;
          const newSoldQuantity =
            (productData.soldQuantity || 0) + cartItem.quantity;

          if (newStock < 0) {
            throw new Error(
              `Not enough stock for ${cartItem.name}. Purchase cannot be completed.`
            );
          }

          // Update product on the server
          const updateResponse = await fetch(
            `http://localhost:3001/products/${cartItem.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                quantity: newStock,
                soldQuantity: newSoldQuantity,
              }),
            }
          );

          if (!updateResponse.ok) {
            throw new Error(`Failed to update stock for ${cartItem.name}.`);
          }
          return updateResponse.json();
        });

      await Promise.all(updatePromises);

      clearCart();
      return true;
    } catch (error: unknown) {
      let message = "An error occurred during checkout.";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      toast.error(message);
      console.error("Checkout processing error:", error);
      return false;
    }
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
        processCheckout,
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