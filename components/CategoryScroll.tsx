'use client';

import React from 'react';
import { CATEGORIES } from '@/data/categories';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/utils';
import {
  Sparkles, Flower2 as Flower, Star, ShoppingBag, Crown, Leaf, Gem,
  type LucideIcon,
} from 'lucide-react';

// Static map of category icon names → components (avoids importing the entire library)
const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Flower,
  Star,
  ShoppingBag,
  Crown,
  Leaf,
  Gem,
};

interface CategoryScrollProps {
  active?: string;
  // eslint-disable-next-line no-unused-vars
  onSelect?: (name: string) => void;
}

const CategoryScroll: React.FC<CategoryScrollProps> = ({
  active = 'All',
  onSelect,
}) => {
  const { products } = useShop();

  // Dynamically calculate active categories
  const activeCategories = React.useMemo(() => {
    const uniqueCatNames = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    
    // Map existing CATEGORIES to their icons, and filter for those present in DB
    const categoriesWithProducts = CATEGORIES.map(cat => ({
      ...cat,
      exists: cat.name === 'All' || uniqueCatNames.some(name => name.toLowerCase() === cat.name.toLowerCase())
    })).filter(cat => cat.exists);

    // Add any categories from DB that are NOT in the hardcoded list
    uniqueCatNames.forEach(dbCat => {
      if (!categoriesWithProducts.find(c => c.name.toLowerCase() === dbCat.toLowerCase())) {
        categoriesWithProducts.push({
          name: dbCat,
          icon: 'Sparkles', // Default icon for unknown categories
          exists: true
        });
      }
    });

    return categoriesWithProducts;
  }, [products]);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4">
      <div className="flex items-center gap-4 px-4 lg:px-8 min-w-max">
        {activeCategories.map((cat) => {
          const isActive = active?.toLowerCase() === cat.name.toLowerCase();
          const IconComponent = ICON_MAP[cat.icon];

          return (
            <button
              key={cat.name}
              onClick={() => onSelect?.(cat.name)}
              className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 border',
                isActive
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/20 scale-105'
                  : 'bg-white text-emerald-900 border-emerald-900/10 hover:border-emerald-900/30'
              )}
            >
              {IconComponent && (
                <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
              )}
              <span className="text-sm font-semibold tracking-wide uppercase">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScroll;
