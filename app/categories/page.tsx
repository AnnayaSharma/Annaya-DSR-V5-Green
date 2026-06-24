'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

function CategoriesContent() {
  const searchParams = useSearchParams();
  const { products, isLoading } = useShop();
  const catParam = searchParams.get('cat');

  // BUG FIX: activeCategory now derives from products to support dynamic categories
  const activeCategory = React.useMemo(() => {
    if (!catParam) return null;
    // Find if the category exists in any product (case-insensitive for URL robustness)
    const found = products.find(p => p.category?.toLowerCase() === catParam.toLowerCase());
    return found ? found.category : null;
  }, [catParam, products]);

  const filtered = React.useMemo(() => {
    if (!activeCategory) return [];
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  // Dynamically calculate which categories are active BASED ON PRODUCTS IN DATABASE
  const displayedCategories = React.useMemo(() => {
    // 1. Get all unique category strings from products
    const uniqueCatNames = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    
    // 2. Map them to their data
    return uniqueCatNames.map(catName => {
      const categoryProducts = products.filter(p => p.category === catName);
      const count = categoryProducts.length;
      
      // Look up extra metadata (like custom images if needed) from CATEGORIES
      const meta = CATEGORIES.find(c => c.name.toLowerCase() === catName.toLowerCase());
      
      // Thumbnail: pick from the first product
      const thumbnail = categoryProducts[0]?.images?.[0] || ''; 

      return {
        name: catName,
        count,
        thumbnail,
        icon: meta?.icon || 'Sparkles'
      };
    }).sort((a, b) => b.count - a.count); // Show categories with more items first
  }, [products]);

  // No early return for isLoading to allow the header to render immediately.

  // ── Detail view when a category is selected ────────────────────────────────
  if (activeCategory) {
    return (
      <div className="pb-32 max-w-7xl mx-auto px-4 lg:px-8 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/categories"
            prefetch={false}
            className="text-sm font-medium text-emerald-700/60 hover:text-emerald-900 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight size={16} className="text-emerald-700/40" />
          <span className="text-sm font-bold text-emerald-950">{activeCategory}</span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-emerald-950 mb-10">
          {activeCategory}
          {!isLoading && (
            <span className="ml-4 text-lg font-medium text-emerald-700/60">
              ({filtered.length} items)
            </span>
          )}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-emerald-50/50 animate-pulse rounded-2xl lg:rounded-3xl border border-emerald-900/5" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-24 text-emerald-900/50 font-serif italic text-xl">
            No products in this category yet.
          </p>
        )}
      </div>
    );
  }

  // ── Category listing ───────────────────────────────────────────────────────

  return (
    <div className="pb-32 max-w-7xl mx-auto px-4 lg:px-8 pt-10">
      <div className="space-y-2 mb-12 text-center lg:text-left">
        <h1 className="text-4xl lg:text-7xl font-serif font-bold text-emerald-950">
          Categories
        </h1>
        <p className="text-emerald-900/50 font-medium uppercase tracking-[0.3em] text-xs lg:text-sm">
          Explore our exquisite collections
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group relative aspect-[16/10] lg:aspect-square rounded-[2.5rem] bg-emerald-50/50 animate-pulse border border-emerald-900/5" />
          ))}
        </div>
      ) : displayedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories?cat=${encodeURIComponent(cat.name)}`}
              prefetch={false}
              className="group relative aspect-[16/10] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
            >
              {/* Image */}
              <Image
                src={cat.thumbnail}
                alt={cat.name}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2 tracking-wide">
                    {cat.name}
                  </h2>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <p className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em]">
                      {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                    </p>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle badge */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Collection
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-emerald-50/30 rounded-[3rem] border border-emerald-900/5">
          <p className="text-emerald-900/50 font-serif italic text-xl">
            Our collections are coming soon. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoriesContent />
    </Suspense>
  );
}
