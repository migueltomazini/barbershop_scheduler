// components/sections/cartItemsSection.tsx
import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { CartItemCard } from '../ui/cartItemCard';
import { CartItem } from '@/app/contexts/CartContext'; // Ensure this path is correct
import { Button } from '../ui/button'; // Import Button

interface CartItemsSectionProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, type: 'product' | 'service', quantity: number) => void;
  onRemoveItem: (id: number, type: 'product' | 'service') => void;
}

export const CartItemsSection: React.FC<CartItemsSectionProps> = ({ items, onUpdateQuantity, onRemoveItem }) => {
  if (items.length === 0) {
    // This case should ideally be handled by the parent page (CartPage)
    // but can be a fallback.
    return (
      <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
        <p className="text-xl text-gray-700 font-semibold mb-2">Seu carrinho está vazio.</p>
        <p className="text-md text-gray-500 mb-6">Que tal adicionar alguns produtos ou agendar um serviço?</p>
        <Link href="/shop">
          <Button className="bg-barber-gold text-white px-6 py-3 rounded-md hover:bg-barber-dark-gold transition-colors duration-300">
            Explorar Produtos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={`${item.type}-${item.id}`} // Unique key using type and id
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};