'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/utils';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
];

const Header: React.FC = () => {
  const { totalItems, wishlist } = useShop();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          {/* Left — logo + mobile menu toggle */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-emerald-900"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex flex-col items-center justify-center">
              <span className="text-xl lg:text-2xl font-serif font-bold tracking-widest text-emerald-950 uppercase">
                ANNAYA
              </span>
              <span className="text-[10px] lg:text-xs tracking-[0.3em] font-medium text-emerald-700/60 -mt-1 uppercase">
                DSR SAREES
              </span>
            </Link>
          </div>

          {/* Centre — desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium uppercase tracking-wider transition-colors',
                  pathname === link.href
                    ? 'text-emerald-950 border-b-2 border-emerald-900 pb-0.5'
                    : 'text-emerald-900/70 hover:text-emerald-950'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — icons */}
          <div className="flex items-center gap-3 lg:gap-6">

            <Link
              href="/wishlist"
              className="relative text-emerald-900/70 hover:text-emerald-950 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative text-emerald-900/70 hover:text-emerald-950 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-16 inset-x-0 z-30 glass border-b border-emerald-900/10 shadow-lg">
          <nav className="flex flex-col py-4 px-6 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'py-3 text-sm font-semibold uppercase tracking-widest transition-colors border-b border-emerald-100 last:border-0',
                  pathname === link.href
                    ? 'text-emerald-950'
                    : 'text-emerald-900/60 hover:text-emerald-950'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
