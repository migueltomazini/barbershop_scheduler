/**
 * @file barbershop_app/app/components/sections/admin/editProductModal.tsx
 * @description FINAL VERSION: Ensures that the product’s MongoDB `_id` is preserved when updating existing records.
 */

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
import { Textarea } from "@/app/components/ui/textArea";
import { toast } from "sonner";
import { ProductType } from "@/app/types";

/**
 * Props for the EditProductModal component.
 *
 * - isOpen: Controls whether the modal dialog is displayed.
 * - onOpenChange: Callback invoked when the dialog is opened or closed, 
 *   allowing the parent component to update its state accordingly.
 * - product: The product object being edited; if null, the modal is used to create a new product.
 * - onSave: Asynchronous handler to persist the form data. Expects the full product shape,
 *   including `_id` when editing an existing item.
 */
interface EditProductModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: ProductType | null;
  onSave: (productData: Partial<ProductType>) => Promise<void>;
}

/**
 * EditProductModal component
 *
 * Renders a dialog containing a form for creating or updating product details:
 * name, description, price, stock quantity, and image URL.  
 * - When `product` is provided, pre-fills the form with existing values.
 * - When `product` is null, initializes an empty form for a new product.
 * - Validates that the name is non-empty, price is positive, and quantity is zero or greater.
 * - Uses toast notifications to inform the user of validation errors.
 * - On successful validation, calls `onSave` with the complete form state, including `_id` if present.
 */
export function EditProductModal({
  isOpen,
  onOpenChange,
  product,
  onSave,
}: EditProductModalProps) {
  // Form state holds all modifiable fields, plus `_id` for updates.
  const [formState, setFormState] = useState({
    _id: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: "",
    soldQuantity: 0,
  });

  /**
   * useEffect: Synchronize the form state with the `product` prop.
   *
   * - Runs whenever the `product` object changes or the modal is opened.
   * - If `product` exists, populates each field from the object.
   * - Otherwise, resets to blank defaults, preparing for creation of a new product.
   */
  useEffect(() => {
    if (product) {
      setFormState({
        _id: product._id,             // Persist existing identifier for update operations
        name: product.name,           // Current product name
        description: product.description || "",  // Optional description or empty string
        price: product.price,         // Numeric price, expected positive
        quantity: product.quantity,   // Stock count, expected zero or greater
        image: product.image || "",   // URL or empty placeholder
        soldQuantity: product.soldQuantity || 0, // Historical sales data
      });
    } else {
      // Reset to empty fields when no product is provided
      setFormState({
        _id: "",
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        image: "",
        soldQuantity: 0,
      });
    }
  }, [product, isOpen]);

  /**
   * handleChange
   *
   * Universal change handler for text inputs and number inputs.
   * - Detects the input `type`; for number fields, parses the value to a number.
   * - Ensures non-numeric inputs do not break the form state.
   * - Updates the corresponding field in formState via shallow merge.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? name === "price"
            ? parseFloat(value) || 0   // Parse decimals for price
            : parseInt(value, 10) || 0 // Parse integers for quantity
          : value                      // Plain text for name, description, image
    }));
  };

  /**
   * handleSaveChanges
   *
   * - Validates that `name` is provided, `price` > 0, and `quantity` >= 0.
   * - If validation fails, shows an error toast with specific guidance.
   * - If validation passes, invokes `onSave` with the entire form state object,
   *   ensuring that `_id` remains available for backend update operations.
   */
  const handleSaveChanges = async () => {
    // Business rules: all products must have a name, positive price, non-negative quantity
    if (!formState.name || formState.price <= 0 || formState.quantity < 0) {
      toast.error("Name, a positive price, and a non-negative quantity are required.");
      return;
    }

    // Submit the full formState, including `_id` for updates or empty for new
    await onSave(formState);
  };

  // Determine whether this modal represents a "create" or "edit" operation
  const isNewProduct = !product;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isNewProduct ? "Create New Product" : `Edit Product: ${product?.name}`}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable form area with consistent spacing */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Product Name Field */}
          <div className="space-y-1">
            <Label htmlFor="productName">Name</Label>
            <Input
              id="productName"
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          </div>
          
          {/* Product Description Field */}
          <div className="space-y-1">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              name="description"
              value={formState.description}
              onChange={handleChange}
            />
          </div>
          
          {/* Product Price Field */}
          <div className="space-y-1">
            <Label htmlFor="productPrice">Price</Label>
            <Input
              id="productPrice"
              name="price"
              type="number"
              value={formState.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Stock Quantity Field */}
          <div className="space-y-1">
            <Label htmlFor="productQuantity">Stock Quantity</Label>
            <Input
              id="productQuantity"
              name="quantity"
              type="number"
              value={formState.quantity}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          {/* Image URL Field */}
          <div className="space-y-1">
            <Label htmlFor="productImage">Image URL</Label>
            <Input
              id="productImage"
              name="image"
              value={formState.image}
              onChange={handleChange}
              placeholder="/images/products/new-product.jpg"
            />
          </div>
        </div>

        <DialogFooter>
          {/* Cancel closes the modal without saving */}
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {/* Save button triggers validation and persistence */}
          <Button
            onClick={handleSaveChanges}
            className="bg-barber-brown text-white hover:bg-barber-dark-brown"
          >
            Save {isNewProduct ? "Product" : "Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
