/**
 * @file barbershop_app/app/components/sections/admin/productManagementTab.tsx
 * @description This file contains the ProductManagementTab component, which displays a table of products
 * with functionality to edit or delete them.
 */

"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ProductType } from "@/app/types";

/**
 * @interface ProductManagementTabProps
 * @description Defines the properties for the ProductManagementTab component.
 * @property {ProductType[]} products - An array of product objects to display.
 * @property {(product: ProductType) => void} onEdit - Callback function to handle editing a product.
 * @property {(productId: string) => void} onDelete - Callback function to handle deleting a product.
 */
interface ProductManagementTabProps {
  products: ProductType[];
  onEdit: (product: ProductType) => void;
  onDelete: (productId: string) => void;
}

/**
 * @component ProductManagementTab
 * @description A component that renders a table of products, providing administrators
 * with options to edit or delete each product entry.
 * @param {ProductManagementTabProps} props - The props for the component.
 */
export function ProductManagementTab({
  products,
  onEdit,
  onDelete,
}: ProductManagementTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[600px]">
        {/* Table Head */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Price</th>
            <th className="p-3 sm:p-4 font-semibold">Stock</th>
            <th className="p-3 sm:p-4 font-semibold">Sold</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {products.length > 0 ? (
            // Map through the products array to render a row for each product.
            products.map((product) => (
              <tr key={product.id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{product.name}</td>
                <td className="p-3 sm:p-4">${product.price.toFixed(2)}</td>
                <td className="p-3 sm:p-4">{product.quantity}</td>
                <td className="p-3 sm:p-4">{product.soldQuantity || 0}</td>
                <td className="p-3 sm:p-4">
                  {/* Action buttons for edit and delete operations. */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
            // Display a message if no products are available.
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
