'use client';

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/utils';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useShop();

  return (
    <div className="flex gap-4 p-4 bg-white rounded-3xl border border-emerald-900/5 shadow-sm">
      {/* Thumbnail */}
      <div className="relative w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0">
        {item.images?.[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full bg-emerald-50" />
        )}
      </div>

      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-base font-serif font-bold text-emerald-950 line-clamp-1 pr-2">
              {item.name}
            </h3>
            <button
              onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
              className="text-emerald-900/40 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <p className="text-xs text-emerald-700/60 font-medium uppercase tracking-wider mt-1">
            Size: {item.selectedSize} {item.selectedColor && `• Color: ${item.selectedColor}`}
          </p>
          <p className="text-lg font-bold text-emerald-900 mt-1">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 bg-emerald-50 rounded-full px-3 py-1.5 border border-emerald-100">
            <button
              onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, -1)}
              className="text-emerald-900 hover:text-emerald-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="text-sm font-bold text-emerald-950 min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
              className="text-emerald-900 hover:text-emerald-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <p className="text-base font-bold text-emerald-950">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
