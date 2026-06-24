'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

// Products are server-fetched in layout.tsx via initialProducts, so this page
// renders with data immediately — no client-side fetch needed for first load.
const ITEMS_PER_PAGE = 12;

type SortKey = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function ShopPage() {
  const { products, isLoading, error } = useShop();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy]           = useState<SortKey>('newest');

  const sortedProducts = useMemo(() => {
    const result = [...products];
    switch (sortBy) {
      case 'price-low':  return result.sort((a, b) => a.price - b.price);
      case 'price-high': return result.sort((a, b) => b.price - a.price);
      case 'popular':    return result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      // BUG FIX: was using new Date(b.id) on ObjectId — now uses createdAt ISO string
      default:           return result.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    }
  }, [products, sortBy]);

  const totalPages      = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex      = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // No more early returns to allow header and filters to render immediately.

  // Page numbers to display (max 7 visible)
  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (safeCurrentPage > 3) pages.push('…');
    for (let i = Math.max(2, safeCurrentPage - 1); i <= Math.min(totalPages - 1, safeCurrentPage + 1); i++) {
      pages.push(i);
    }
    if (safeCurrentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  })();

  return (
    <div className="pb-32 px-4 lg:px-8 max-w-7xl mx-auto pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-6xl font-serif font-bold text-emerald-950">
            The Shop
          </h1>
          <p className="text-emerald-900/50 font-medium uppercase tracking-[0.2em] text-xs lg:text-sm">
            {products.length} exquisite pieces in our collection
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortKey); setCurrentPage(1); }}
            className="bg-white border border-emerald-900/10 rounded-2xl px-6 py-3 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-900/20 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-emerald-50/50 animate-pulse rounded-2xl lg:rounded-3xl border border-emerald-900/5" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-red-50/30 rounded-[3rem] border border-red-100 flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-red-400" />
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-red-900">Oops! We encountered an error</h3>
            <p className="text-red-800/60 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-red-800 transition-all shadow-lg shadow-red-900/20"
          >
            Try Again
          </button>
        </div>
      ) : currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
          {currentProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-emerald-900/50 font-serif italic text-xl">
            No products available yet.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-20 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="w-12 h-12 rounded-2xl bg-white border border-emerald-900/10 flex items-center justify-center text-emerald-900 disabled:opacity-30 hover:bg-emerald-50 hover:border-emerald-900/30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {pageNumbers.map((p, idx) =>
              p === '…' ? (
                <span key={`ellipsis-${idx}`} className="w-12 h-12 flex items-center justify-center text-emerald-900/40 font-bold">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={cn(
                    'w-12 h-12 rounded-2xl font-bold transition-all border',
                    safeCurrentPage === p
                      ? 'bg-emerald-950 text-white border-emerald-950 shadow-lg shadow-emerald-950/20'
                      : 'bg-white text-emerald-950 border-emerald-900/10 hover:border-emerald-900/30'
                  )}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className="w-12 h-12 rounded-2xl bg-white border border-emerald-900/10 flex items-center justify-center text-emerald-900 disabled:opacity-30 hover:bg-emerald-50 hover:border-emerald-900/30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
