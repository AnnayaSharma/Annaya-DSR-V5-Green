'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, ShoppingCart, Info } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/utils';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Shop', icon: ShoppingBag, href: '/shop' },
  { label: 'Wishlist', icon: Heart, href: '/wishlist' },
  { label: 'Cart', icon: ShoppingCart, href: '/cart' },
  { label: 'About', icon: Info, href: '/about' },
] as const;

const BottomNav: React.FC = () => {
  const { totalItems } = useShop();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-0 right-0 z-50 lg:hidden px-4">
      <div className="glass mx-auto max-w-[440px] mb-6 rounded-[2.25rem] flex items-center justify-around py-3 px-3.5 shadow-xl shadow-emerald-900/10 border border-white/40">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center justify-center transition-all duration-500 px-3.5 py-1.25 rounded-2xl group',
                isActive
                  ? 'text-emerald-950 scale-105'
                  : 'text-emerald-900/40 hover:text-emerald-900/70'
              )}
              aria-label={label}
            >
              <div className={cn(
                'relative transition-all duration-300',
                isActive && 'scale-105'
              )}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Cart badge */}
                {href === '/cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-950 text-white text-[8.5px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  'text-[8.5px] font-bold mt-1.25 transition-all duration-300 uppercase tracking-widest',
                  isActive ? 'text-emerald-950 opacity-100' : 'text-emerald-900/40'
                )}
              >
                {label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-luxury-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
