'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatPrice, WHATSAPP_NUMBER } from '@/utils';
import CartItemRow from '@/components/CartItemRow';
import EmptyState from '@/components/EmptyState';
import { motion } from 'motion/react';

export default function CartPage() {
  const { cart, totalPrice } = useShop();

  const grandTotal  = totalPrice;

  const handleCheckout = () => {
    const waLines = cart
      .map(
        (item) =>
          `• ${item.name} (${item.selectedSize}) ×${item.quantity} — ${formatPrice(item.price * item.quantity)}`
      )
      .join('\n');

    const waMessage = [
      "Hello! I'd like to place an order:\n",
      waLines,
      `\n*Total: ${formatPrice(grandTotal)}*`,
      "\n\nPlease confirm availability and share payment details. Thank you!",
    ].join('');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\s+/g, '')}?text=${encodeURIComponent(waMessage)}`;
    const opened = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      // Fallback if popup was blocked
      window.location.href = waUrl;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="Looks like you haven't added anything yet. Explore our latest collections and find something you love."
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pb-32 max-w-3xl mx-auto px-4 lg:px-0 lg:pt-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/shop" className="p-2 text-emerald-950 lg:hidden">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-emerald-950">
          Shopping Bag
        </h1>
        <span className="text-sm font-bold text-emerald-700/60 bg-emerald-50 px-3 py-1 rounded-full ml-2">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4">
        {cart.map((item, idx) => (
          <motion.div
            key={`${item.id}-${item.selectedSize}-${item.selectedColor ?? 'default'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <CartItemRow item={item} />
          </motion.div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-10 p-8 bg-emerald-950 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-950/30">
        <h2 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4">
          Order Summary
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-sm font-medium uppercase tracking-wider">Subtotal</span>
            <span className="font-bold">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-white/70">
            <span className="text-sm font-medium uppercase tracking-wider">Delivery</span>
            <span className="font-bold text-emerald-400">
              3-4 Days Delivery
            </span>
          </div>
          <div className="h-[1px] bg-white/10 my-2" />
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="font-serif">Total Amount</span>
            <span className="text-luxury-gold">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-white text-emerald-950 h-16 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          <MessageCircle size={20} className="fill-emerald-950" />
          Order via WhatsApp
        </button>

        <p className="text-center text-[10px] text-white/40 mt-6 uppercase tracking-widest font-medium">
          Secure Checkout • No Payment Required Now
        </p>
      </div>

    </div>
  );
}
