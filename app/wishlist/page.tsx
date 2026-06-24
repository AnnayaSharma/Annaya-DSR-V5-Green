'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { motion } from 'motion/react';

export default function WishlistPage() {
  // BUG FIX: was filtering the static empty PRODUCTS[] — now uses wishlistedProducts
  // from context which filters the live products fetched from DB
  const { wishlist, wishlistedProducts } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favourite items and they'll appear here. Start exploring our luxury collections."
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pb-32 max-w-7xl mx-auto px-4 lg:px-8 lg:pt-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/shop" className="p-2 text-emerald-950 lg:hidden">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-emerald-950">
          My Wishlist
        </h1>
        <span className="text-sm font-bold text-emerald-700/60 bg-emerald-50 px-3 py-1 rounded-full ml-2">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10">
        {wishlistedProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
