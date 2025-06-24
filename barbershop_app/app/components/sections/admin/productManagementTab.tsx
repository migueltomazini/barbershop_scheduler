/**
 * @file barbershop_app/app/components/sections/admin/productManagementTab.tsx
 * @description FINAL VERSION: Lists all products with full CRUD support; integrates server-side deletion via a dedicated Server Action.
 */

"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ProductType } from "@/app/types";

// Import the server-side action responsible for product deletion
import { deleteProduct } from "@/app/actions/adminActions";

/**
 * Props for the ProductManagementTab component.
 *
 * @interface ProductManagementTabProps
 * @property {ProductType[]} products - Array of products to display in the table.
 * @property {(product: ProductType) => void} onEdit - Callback invoked when the Edit button is clicked;
 *   typically opens an edit modal populated with the selected product.
 */
interface ProductManagementTabProps {
  products: ProductType[];
  onEdit: (product: ProductType) => void;
}

/**
 * ProductManagementTab
 *
 * Renders a responsive table of products with columns for name, price, stock, sold quantity,
 * and action buttons for editing or deleting each entry. Deletion is handled inline via a
 * server action, providing confirmation prompts and toast feedback based on success or failure.
 *
 * @param {ProductManagementTabProps} props - The component properties.
 * @returns {JSX.Element} The rendered product management table.
 */
export function ProductManagementTab({
  products,
  onEdit,
}: ProductManagementTabProps) {
  /**
   * handleDelete
   *
   * Asynchronously deletes a product by its identifier.
   * Presents a confirmation dialog to the user, then invokes the server action.
   * Displays success or error toasts based on the returned result.
   *
   * @param {string} productId - The unique MongoDB `_id` of the product to delete.
   * @param {string} productName - The human-readable name of the product, used in the confirmation prompt.
   */
  const handleDelete = async (productId: string, productName: string) => {
    // Prompt the user to confirm deletion to prevent accidental removals
    if (!confirm(`Are you sure you want to delete the product "${productName}"?`)) {
      return;
    }

    try {
      // Invoke the server-side deletion action and wait for the response
      const result = await deleteProduct(productId);

      // Provide user feedback: success or failure
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      // Handle unexpected errors gracefully
      toast.error("An unexpected error occurred while deleting the product.");
      console.error("deleteProduct error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[600px]">
        {/* Table header defines column labels and styling */}
        <thead className="bg-barber-cream text-left text-sm text-gray-700">
          <tr>
            <th className="p-3 sm:p-4 font-semibold">Name</th>
            <th className="p-3 sm:p-4 font-semibold">Price</th>
            <th className="p-3 sm:p-4 font-semibold">Stock</th>
            <th className="p-3 sm:p-4 font-semibold">Sold</th>
            <th className="p-3 sm:p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        {/* Table body iterates over each product, rendering a row with data and action buttons */}
        <tbody className="divide-y divide-barber-cream text-sm">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                {/* Product name cell, non-wrapping to maintain table layout */}
                <td className="p-3 sm:p-4 whitespace-nowrap">{product.name}</td>
                {/* Price formatted to two decimal places */}
                <td className="p-3 sm:p-4">${product.price.toFixed(2)}</td>
                {/* Current stock level */}
                <td className="p-3 sm:p-4">{product.quantity}</td>
                {/* Total sold quantity, defaulting to zero if undefined */}
                <td className="p-3 sm:p-4">{product.soldQuantity || 0}</td>
                {/* Action buttons for edit and delete operations */}
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                      aria-label={`Edit product ${product.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product._id, product.name)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      aria-label={`Delete product ${product.name}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Renders a graceful empty state when no products are available
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
