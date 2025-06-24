/**
 * @file barbershop_app/app/components/sections/admin/editProductModal.tsx
 * @description VERSÃO FINAL: Corrigido para usar `_id` em vez de `id`.
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

interface EditProductModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: ProductType | null;
  // A função onSave agora espera dados que podem conter um _id
  onSave: (productData: Partial<ProductType>) => Promise<void>;
}

export function EditProductModal({
  isOpen,
  onOpenChange,
  product,
  onSave,
}: EditProductModalProps) {
  // MUDANÇA 1: O estado inicial agora usa _id
  const [formState, setFormState] = useState({
    _id: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: "",
    soldQuantity: 0,
  });

  useEffect(() => {
    if (product) {
      setFormState({
        // MUDANÇA 2: Popula o formulário com `_id`
        _id: product._id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        quantity: product.quantity,
        image: product.image || "",
        soldQuantity: product.soldQuantity || 0,
      });
    } else {
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

  const handleSaveChanges = async () => {
    if (!formState.name || formState.price <= 0 || formState.quantity < 0) {
      toast.error("Name, a positive price, and a non-negative quantity are required.");
      return;
    }

    // Agora o onSave envia o objeto de estado completo, incluindo o _id (se houver)
    await onSave(formState);
  };

  const isNewProduct = !product;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isNewProduct ? "Create New Product" : `Edit Product: ${product?.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* O JSX do formulário continua o mesmo */}
            <div className="space-y-1"><Label htmlFor="productName">Name</Label><Input id="productName" name="name" value={formState.name} onChange={handleChange} /></div>
            <div className="space-y-1"><Label htmlFor="productDescription">Description</Label><Textarea id="productDescription" name="description" value={formState.description} onChange={handleChange} /></div>
            <div className="space-y-1"><Label htmlFor="productPrice">Price</Label><Input id="productPrice" name="price" type="number" value={formState.price} onChange={handleChange} min="0" step="0.01" /></div>
            <div className="space-y-1"><Label htmlFor="productQuantity">Stock Quantity</Label><Input id="productQuantity" name="quantity" type="number" value={formState.quantity} onChange={handleChange} min="0" /></div>
            <div className="space-y-1"><Label htmlFor="productImage">Image URL</Label><Input id="productImage" name="image" value={formState.image} onChange={handleChange} placeholder="/images/products/new-product.jpg" /></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSaveChanges} className="bg-barber-brown text-white hover:bg-barber-dark-brown">
            Save {isNewProduct ? "Product" : "Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
