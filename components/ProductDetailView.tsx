'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Star, Heart, ShoppingBag,
  Share2, ShieldCheck, Truck, RotateCcw,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatPrice, cn, WHATSAPP_NUMBER } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface ProductDetailViewProps {
  initialProduct: Product;
}

export default function ProductDetailView({ initialProduct }: ProductDetailViewProps) {
  const router = useRouter();
  const { products, addToCart, toggleWishlist, wishlist } = useShop();

  const product = products.find(p => p.id === initialProduct.id) || initialProduct;
  const [selectedSize, setSelectedSize] = useState(initialProduct.sizes?.[0] ?? 'Free Size');
  const [selectedColor, setSelectedColor] = useState(initialProduct.colors?.[0]?.name ?? 'Any Colour');
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch {
      // Silently ignore if user cancels share or clipboard is denied
    }
  };

  const handleWhatsAppOrder = () => {
    const waMessage = `Hello!\n\nI'm interested in ordering the *${product.name}*.\n\nSize: ${selectedSize}\nPrice: ${formatPrice(product.price)}\n\nPlease confirm availability and share payment details. Thank you!`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\s+/g, '')}?text=${encodeURIComponent(waMessage)}`;
    const opened = window.open(waUrl, '_blank');
    if (!opened) {
      // Fallback if popup was blocked
      window.location.href = waUrl;
    }
  };

  return (
    <div className="pb-32 bg-white min-h-screen">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 lg:hidden glass flex items-center justify-between px-4 h-16">
        <button onClick={() => router.back()} className="p-2 text-emerald-950">
          <ArrowLeft size={24} />
        </button>
        <span className="font-serif font-bold text-emerald-950 tracking-widest uppercase text-sm">
          Details
        </span>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="p-2 text-emerald-950">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto lg:pt-10 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] overflow-hidden lg:rounded-[2.5rem]">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  'absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm border shadow-sm',
                  isWishlisted ? 'text-emerald-600 border-emerald-100' : 'text-emerald-950 border-white/50 hover:bg-white'
                )}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  {product.images?.[activeImage] ? (
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300">
                      No image
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        activeImage === idx ? 'bg-white w-6' : 'bg-white/40 w-2'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'relative w-24 h-32 rounded-2xl overflow-hidden border-2 transition-all',
                    activeImage === idx
                      ? 'border-emerald-600 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 lg:px-0 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  <Star size={14} className="fill-luxury-gold text-luxury-gold" />
                  <span className="text-sm font-bold text-emerald-950">{product.rating}</span>
                  <span className="text-xs text-emerald-900/40 font-medium">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <h1 className="text-3xl lg:text-5xl font-serif font-bold text-emerald-950 mt-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-2xl lg:text-3xl font-bold text-emerald-900">
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-lg text-emerald-900/40 line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
                {product.discountPercent && (
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <p className="text-emerald-900/70 text-sm lg:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-widest">
                  Colours Available
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border-2 shadow-md transition-all",
                          selectedColor === color.name ? "border-emerald-600 scale-110" : "border-white hover:border-emerald-200"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                      <span className={cn(
                        "text-[10px] font-medium transition-colors",
                        selectedColor === color.name ? "text-emerald-700" : "text-emerald-900/50 group-hover:text-emerald-900/80"
                      )}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-widest">
                    Select Size
                  </h3>
                  <button className="text-xs font-bold text-emerald-700 border-b border-emerald-700/30 hover:border-emerald-700 transition-all">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[56px] h-12 px-4 rounded-2xl flex items-center justify-center font-bold text-sm transition-all border',
                        selectedSize === size
                          ? 'bg-emerald-950 text-white border-emerald-950 shadow-lg shadow-emerald-950/20'
                          : 'bg-white text-emerald-950 border-emerald-900/10 hover:border-emerald-900/30'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
              <p className="text-sm font-bold text-amber-600">
                Only {product.stock} left in stock!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-sm font-bold text-red-500">Out of Stock</p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={cn(
                    'flex-grow h-16 rounded-full font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl',
                    addedToCart
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : product.stock === 0
                        ? 'bg-emerald-200 text-emerald-500 cursor-not-allowed'
                        : 'bg-emerald-950 text-white hover:bg-emerald-900 shadow-emerald-950/20'
                  )}
                >
                  <ShoppingBag size={20} />
                  {addedToCart ? 'Added to Bag!' : 'Add to Shopping Bag'}
                </button>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full h-16 rounded-full border-2 border-emerald-900/20 text-emerald-950 font-bold tracking-widest bg-green-300 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600"><FontAwesomeIcon icon={faWhatsapp} /></span>
                </div>
                Order on Whatsapp
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-emerald-900/5">
              {[
                { icon: Truck, title: '3-4 Days Delivery', sub: 'Standard Shipping' },
                { icon: RotateCcw, title: 'Easy Returns', sub: '7 days return policy' },
                { icon: ShieldCheck, title: 'Secure Payment', sub: '100% secure checkout' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider">{title}</p>
                    <p className="text-[10px] text-emerald-900/50">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

