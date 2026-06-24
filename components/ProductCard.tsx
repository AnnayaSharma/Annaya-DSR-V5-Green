'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { formatPrice, cn } from '@/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist, addToCart } = useShop();
  const isWishlisted = wishlist.includes(product.id);

  // BUG FIX: guard against empty sizes array before accessing [0]
  const defaultSize = product.sizes?.[0] ?? 'Free Size';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-emerald-900/5"
    >
      {/* Image & Overlay Area */}
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer group/image">
        <Link
          href={`/products/${product.slug}`}
          prefetch={false}
          className="relative w-full h-full block"
        >
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            />
          ) : (
            <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300">
              No image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="bg-emerald-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                New
              </span>
            )}
            {(product.isTrending || product.rating >= 4.8) && (
              <span className="bg-luxury-gold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Trending
              </span>
            )}
          </div>

          <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Link>
        
        {/* Quick Actions (OUTSIDE of Link to prevent bubbling/navigation) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              toggleWishlist(product.id); 
            }}
            className={cn(
              'p-2.5 rounded-full shadow-lg transition-colors',
              isWishlisted
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-900 hover:bg-emerald-50'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              addToCart(product, defaultSize); 
            }}
            className="p-2.5 bg-white text-emerald-900 rounded-full shadow-lg hover:bg-emerald-50 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-medium text-emerald-700/60 uppercase tracking-widest">
            {product.category}
          </p>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-luxury-gold text-luxury-gold" />
            <span className="text-xs font-bold text-emerald-900">{product.rating}</span>
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          prefetch={false}
          className="text-lg font-serif font-semibold text-emerald-950 mb-2 block hover:text-emerald-700 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-emerald-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
