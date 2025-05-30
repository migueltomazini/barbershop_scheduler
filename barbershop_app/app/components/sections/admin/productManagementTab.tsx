"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ProductType } from "@/app/types";

// Defines the props for the ProductManagementTab component
interface ProductManagementTabProps {
  products: ProductType[]; // Array of product objects
  onEdit: (product: ProductType) => void; // Callback for editing a product
  onDelete: (productId: number) => void; // Callback for deleting a product
}

// ProductManagementTab functional component
export function ProductManagementTab({
  products,
  onEdit,
  onDelete,
}: ProductManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[600px]">
        {/* Table header */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Price</th>
            <th className="p-3 sm:p-4 font-semibold">Stock</th>
            <th className="p-3 sm:p-4 font-semibold">Sold</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {products.length > 0 ? (
            // Maps through products to render each row
            products.map((product) => (
              <tr key={product.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{product.name}</td>
                <td className="p-3 sm:p-4">${product.price.toFixed(2)}</td>
                <td className="p-3 sm:p-4">{product.quantity}</td>
                <td className="p-3 sm:p-4">{product.soldQuantity || 0}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    {/* Edit button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Delete button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(product.id)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Displays a message if no products are found
            <tr>
              <td colSpan={5} className="text-center p-8 text-muted-foreground">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
