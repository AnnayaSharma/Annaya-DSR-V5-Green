'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import CategoryScroll from '@/components/CategoryScroll';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Testimonials from '@/components/Testimonials';
import { useShop } from '@/context/ShopContext';
import { Sparkles, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const { products, isLoading, error } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');

  // No more early returns for isLoading and error to allow Hero/Categories to render immediately.

  // BUG FIX: Category filter now actually filters products (case-insensitive for robustness)
  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 6);
  const trending = products.filter((p) => p.isTrending || p.rating >= 4.8).slice(0, 6);

  return (
    <div className="pb-32">
      <Hero />

      <div className="max-w-7xl mx-auto">
        {/* Categories */}
        <div className="mt-12 mb-6 px-4 lg:px-8 flex items-center justify-between">
          <h2 className="text-2xl lg:text-4xl font-serif font-bold text-emerald-950 flex items-center gap-3">
            <Sparkles className="text-luxury-gold" size={28} />
            Categories
          </h2>
          <Link
            href="/categories"
            className="text-xs font-bold text-emerald-700 uppercase tracking-widest border-b border-emerald-700/30 hover:border-emerald-700 transition-all"
          >
            View All
          </Link>
        </div>

        {/* BUG FIX: onSelect wired to state — categories now filter products */}
        <CategoryScroll active={activeCategory} onSelect={setActiveCategory} />

        {/* Filtered results (Always visible, show 'Our Collections' if All is active) */}
        <section className="mt-10 px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-xs font-bold text-emerald-700 uppercase tracking-widest border-b border-emerald-700/30 hover:border-emerald-700 transition-all font-sans"
              >
                Clear filter
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 flex flex-col items-center gap-2">
              <AlertCircle size={32} />
              <p>{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8 pb-8">
              <div className="flex gap-6 lg:gap-10 min-w-max">
                {filteredProducts.slice(0, 6).map((p) => (
                  <div key={p.id} className="w-[280px] lg:w-[350px]">
                    <ProductCard product={p} />
                  </div>
                ))}

                {/* SHOW ALL Link */}
                {filteredProducts.length > 6 && (
                  <Link
                    href="/shop"
                    prefetch={false}
                    className="w-[200px] lg:w-[250px] aspect-[3/4] flex flex-col items-center justify-center bg-emerald-50/30 rounded-[2.5rem] border-2 border-dashed border-emerald-950/10 group hover:border-emerald-900/30 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-emerald-950 shadow-sm group-hover:scale-110 transition-transform mb-4">
                      <ArrowRight size={24} />
                    </div>
                    <span className="text-sm font-bold text-emerald-950 uppercase tracking-widest">Show All</span>
                    <span className="text-[10px] font-medium text-emerald-900/40 mt-1 uppercase tracking-widest text-center px-4">
                      Explore {filteredProducts.length - 6} more {activeCategory === 'All' ? 'pieces' : activeCategory}
                    </span>
                  </Link>
                )}

                {filteredProducts.length === 0 && (
                  <p className="text-center py-16 text-emerald-900/50 font-serif italic w-full">
                    No products found in this category yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Second Promotional Banner */}
        <section className="mt-12 px-4 lg:px-8">
          <div className="relative h-64 lg:h-96 rounded-[2.5rem] overflow-hidden group">
            <Image
              src="/hero.webp"
              alt="Bridal Collection"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1280px) 100vw, 1280px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/90 via-emerald-950/40 to-transparent flex flex-col justify-center items-end px-8 lg:px-16 text-right">
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
                Signature Collection
              </span>
              <h2 className="text-3xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                Timeless Bridal <br /> Masterpieces
              </h2>
              <Link
                href="/shop"
                prefetch={false}
                className="w-fit bg-white text-emerald-950 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl font-sans"
              >
                Shop Bridal
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mt-16 px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl lg:text-4xl font-serif font-bold text-emerald-950">
                New Arrivals
              </h2>
              <p className="text-xs lg:text-sm font-medium text-emerald-700/60 uppercase tracking-[0.2em]">
                Freshly curated for you
              </p>
            </div>
            <Link
              href="/shop"
              prefetch={false}
              className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest group"
            >
              Explore More
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="overflow-x-auto no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8 pb-8">
              <div className="flex gap-6 lg:gap-10 min-w-max">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-[280px] lg:w-[350px] aspect-[3/4] bg-emerald-50/50 animate-pulse rounded-3xl border border-emerald-900/5" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="py-12 bg-red-50/30 rounded-[2.5rem] text-center text-red-800 border border-red-100 p-8 mx-4 lg:mx-8">
              <p className="font-medium">Could not load new arrivals</p>
              <p className="text-sm opacity-70 mt-1">{error}</p>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8 pb-8">
              <div className="flex gap-6 lg:gap-10 min-w-max">
                {newArrivals.map((p) => (
                  <div key={p.id} className="w-[280px] lg:w-[350px]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center py-12 text-emerald-900/50 italic">Check back soon for new arrivals!</p>
          )}
        </section>

        {/* Mid-page Banner */}
        <section className="mt-20 px-4 lg:px-8">
          <div className="relative h-64 lg:h-96 rounded-[2.5rem] overflow-hidden group">
            <Image
              src="/image2.webp"
              alt="Luxury Collection"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1280px) 100vw, 1280px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/40 to-transparent flex flex-col justify-center px-8 lg:px-16">
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
                Limited Edition
              </span>
              <h2 className="text-3xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                The Royal <br /> Emerald Collection
              </h2>
              <Link
                href="/shop"
                prefetch={false}
                className="w-fit bg-white text-emerald-950 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl"
              >
                Discover Now
              </Link>
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="mt-20 px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl lg:text-4xl font-serif font-bold text-emerald-950 flex items-center gap-3">
                <TrendingUp className="text-emerald-600" size={28} />
                Trending Now
              </h2>
              <p className="text-xs lg:text-sm font-medium text-emerald-700/60 uppercase tracking-[0.2em]">
                Most loved by our clients
              </p>
            </div>
            <Link
              href="/shop"
              prefetch={false}
              className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest group"
            >
              View All
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="overflow-x-auto no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8 pb-8">
              <div className="flex gap-6 lg:gap-10 min-w-max">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-[280px] lg:w-[350px] aspect-[3/4] bg-emerald-50/50 animate-pulse rounded-3xl border border-emerald-900/5" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="py-12 bg-emerald-50/30 rounded-[2.5rem] text-center text-emerald-800 border border-emerald-100/50 p-8 mx-4 lg:mx-8">
              <p className="font-medium opacity-60 italic">Trending items unavailable right now</p>
            </div>
          ) : trending.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8 pb-8">
              <div className="flex gap-6 lg:gap-10 min-w-max">
                {trending.map((p) => (
                  <div key={p.id} className="w-[280px] lg:w-[350px]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center py-12 text-emerald-900/50 italic">Stay tuned for trending styles!</p>
          )}
        </section>

        {/* Empty state when DB has no products yet */}
        {activeCategory === 'All' && !isLoading && !error && products.length === 0 && (
          <div className="mt-20 text-center py-20">
            <p className="text-emerald-900/50 font-serif italic text-xl">
              Our collection is being curated. Check back soon!
            </p>
          </div>
        )}
        <Testimonials />
      </div>
    </div>
  );
}
