/**
 * @file barbershop_app/app/components/sections/admin/editProductModal.tsx
 * @description This file contains the EditProductModal component, a dialog for creating a new product or editing an existing one.
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
 * @interface EditProductModalProps
 * @description Defines the properties for the EditProductModal component.
 * @property {boolean} isOpen - Controls the visibility of the dialog.
 * @property {(isOpen: boolean) => void} onOpenChange - Callback to handle dialog open/close.
 * @property {ProductType | null} product - The product to edit, or null to create a new one.
 * @property {(productData: Omit<ProductType, "type">) => Promise<void>} onSave - Async callback to save the product data.
 */
interface EditProductModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: ProductType | null;
  onSave: (productData: Omit<ProductType, "type">) => Promise<void>;
}

/**
 * @component EditProductModal
 * @description A modal dialog for creating or editing product details.
 * It adapts its title and behavior based on whether a product is being created or edited.
 * @param {EditProductModalProps} props - The props for the component.
 */
export function EditProductModal({
  isOpen,
  onOpenChange,
  product,
  onSave,
}: EditProductModalProps) {
  // State to manage the form inputs for product data.
  const [formState, setFormState] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: "",
    soldQuantity: 0,
  });

  // Effect to either populate the form with existing product data or reset it for a new product.
  // It runs when the modal is opened or the product prop changes.
  useEffect(() => {
    if (product) {
      setFormState({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        soldQuantity: product.soldQuantity || 0,
      });
    } else {
      // Reset form for creating a new product.
      setFormState({
        id: "",
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
   * @function handleChange
   * @description Handles changes in form inputs, parsing numbers where appropriate.
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
            ? parseFloat(value) || 0
            : parseInt(value, 10) || 0
          : value,
    }));
  };

  /**
   * @function handleSaveChanges
   * @description Validates form data and calls the onSave prop to persist changes.
   */
  const handleSaveChanges = async () => {
    if (!formState.name || formState.price <= 0 || formState.quantity < 0) {
      toast.error(
        "Name, a positive price, and a non-negative quantity are required."
      );
      return;
    }

    // The onSave function receives the complete form state.
    await onSave(formState);
  };

  // Determines if the modal is for creating a new product to adjust UI text.
  const isNewProduct = !product;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isNewProduct
              ? "Create New Product"
              : `Edit Product: ${product?.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-1">
            <Label htmlFor="productName">Name</Label>
            <Input
              id="productName"
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              name="description"
              value={formState.description}
              onChange={handleChange}
            />
          </div>
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
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
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
