// components/ui/CartItemCard.tsx
import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, Clock } from 'lucide-react';
import { CartItem, ServiceCartItemDetails, ProductCartItemDetails } from '@/app/contexts/CartContext'; // Adjusted path

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, type: 'product' | 'service', quantity: number) => void;
  onRemoveItem: (id: number, type: 'product' | 'service') => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const isService = item.type === 'service';

  return (
    <div className="p-4 flex items-start sm:items-center bg-white rounded-lg shadow-sm border border-gray-200 flex-col sm:flex-row">
      <div className="h-24 w-24 sm:h-20 sm:w-20 bg-gray-100 rounded-md mr-0 sm:mr-4 mb-3 sm:mb-0 overflow-hidden relative flex-shrink-0">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        )}
      </div>
      <div className="flex-grow mb-3 sm:mb-0">
        <h3 className="font-medium text-lg text-gray-800">{item.name}</h3>
        <p className="text-barber-gold font-semibold">${item.price.toFixed(2)}</p>
        {isService && (item as CartItem & ServiceCartItemDetails).duration && ( // Type assertion for service details
          <p className="text-gray-500 text-sm flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {(item as CartItem & ServiceCartItemDetails).duration}
          </p>
        )}
        {item.type === 'product' && (item as CartItem & ProductCartItemDetails).description && ( // Type assertion for product details
             <p className="text-gray-500 text-sm mt-1 truncate max-w-xs">
                {(item as CartItem & ProductCartItemDetails).description}
             </p>
        )}
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0 mb-3 sm:mb-0 sm:mx-4">
        <button
          onClick={() => onUpdateQuantity(item.id, item.type, item.quantity - 1)}
          className="p-1.5 rounded-full hover:bg-barber-cream transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4 text-gray-700" />
        </button>
        <span className="w-8 text-center font-medium text-gray-800 tabular-nums">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.type, item.quantity + 1)}
          className="p-1.5 rounded-full hover:bg-barber-cream transition-colors duration-200"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      <div className="ml-0 sm:ml-auto text-left sm:text-right flex-shrink-0">
        <p className="font-semibold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemoveItem(item.id, item.type)}
          className="text-red-500 hover:text-red-700 mt-1 flex items-center text-sm transition-colors duration-200 group"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
          Remover
        </button>
      </div>
    </div>
  );
};