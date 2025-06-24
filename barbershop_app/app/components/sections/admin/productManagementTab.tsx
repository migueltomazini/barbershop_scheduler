/**
 * @file barbershop_app/app/components/sections/admin/productManagementTab.tsx
 * @description VERSÃO FINAL: Este componente agora chama a Server Action de exclusão diretamente.
 */

"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ProductType } from "@/app/types";

// 1. Importa a Server Action de exclusão
import { deleteProduct } from "@/app/actions/adminActions";

/**
 * @interface ProductManagementTabProps
 * @description As props foram simplificadas. 'onDelete' não é mais necessário.
 */
interface ProductManagementTabProps {
  products: ProductType[];
  onEdit: (product: ProductType) => void;
}

/**
 * @component ProductManagementTab
 * @description Renderiza a tabela de produtos. O botão de deletar agora tem sua própria lógica assíncrona.
 */
export function ProductManagementTab({
  products,
  onEdit,
}: ProductManagementTabProps) {
  
  // Função para lidar com a exclusão, que agora vive dentro do componente
  const handleDelete = async (productId: string, productName: string) => {
    // Pede confirmação ao usuário
    if (!confirm(`Are you sure you want to delete the product "${productName}"?`)) {
      return;
    }

    // Chama a Server Action e aguarda o resultado
    const result = await deleteProduct(productId);

    // Exibe um feedback para o usuário com base no resultado
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

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
            products.map((product) => (
              // 2. MUDANÇA: A key agora usa `_id` do MongoDB
              <tr key={product._id}>
                <td className="p-3 sm:p-4 whitespace-nowrap">{product.name}</td>
                <td className="p-3 sm:p-4">${product.price.toFixed(2)}</td>
                <td className="p-3 sm:p-4">{product.quantity}</td>
                <td className="p-3 sm:p-4">{product.soldQuantity || 0}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      // A função onEdit continua vindo das props, pois controla o modal
                      onClick={() => onEdit(product)}
                      className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      // 3. MUDANÇA: O onClick agora chama a função handleDelete local
                      onClick={() => handleDelete(product._id, product.name)}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
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
