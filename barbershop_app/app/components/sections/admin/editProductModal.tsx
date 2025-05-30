"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { ProductType } from "@/app/types";

// Defines the props for the EditProductModal component
interface EditProductModalProps {
  isOpen: boolean; // Controls whether the dialog is open
  onOpenChange: (isOpen: boolean) => void; // Callback to handle dialog open/close
  product: ProductType | null; // The product object to be edited
  // Callback to save product changes, including new stock and price
  onSave: (
    productId: number,
    newStock: number,
    newPrice: number,
    currentSoldQuantity?: number
  ) => Promise<void>;
}

// EditProductModal functional component
export function EditProductModal({
  isOpen,
  onOpenChange,
  product,
  onSave,
}: EditProductModalProps) {
  // State for the new stock quantity
  const [newStock, setNewStock] = useState<number>(0);
  // State for the new product price
  const [newPrice, setNewPrice] = useState<number>(0);

  // Effect to initialize the state with current product data when the modal opens
  useEffect(() => {
    if (product) {
      setNewStock(product.quantity);
      setNewPrice(product.price);
    } else {
      // Resets state if no product is provided
      setNewStock(0);
      setNewPrice(0);
    }
  }, [product]);

  // Renders nothing if no product object is provided for editing
  if (!product) return null;

  // Handles saving the changes, including validation
  const handleSaveChanges = async () => {
    if (newPrice < 0) {
      toast.error("Price cannot be negative.");
      return;
    }
    if (newStock < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }
    try {
      await onSave(product.id, newStock, newPrice, product.soldQuantity);
      onOpenChange(false); // Closes the modal after successful save
    } catch (error) {
      console.error("Failed to save product changes from modal:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* New Stock Quantity Field */}
          <div>
            <Label htmlFor="productStockModalInput" className="block mb-1">
              New Stock Quantity:
            </Label>
            <Input
              id="productStockModalInput"
              type="number"
              value={newStock}
              onChange={(e) =>
                setNewStock(Math.max(0, parseInt(e.target.value, 10) || 0))
              }
              className="border-barber-cream"
              min="0"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Current stock: {product.quantity}
            </p>
          </div>

          {/* New Price Field */}
          <div>
            <Label htmlFor="productPriceModalInput" className="block mb-1">
              New Price:
            </Label>
            <Input
              id="productPriceModalInput"
              type="number"
              value={newPrice}
              onChange={(e) =>
                setNewPrice(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="border-barber-cream"
              min="0"
              step="0.01"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Current price: ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
        <DialogFooter>
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
          {/* Save Changes Button */}
          <Button
            onClick={handleSaveChanges}
            className="bg-barber-brown hover:bg-barber-dark-brown"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
