'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionLabel = 'Start Shopping',
  actionHref = '/shop',
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
      <Icon size={40} className="text-emerald-700/40" strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl font-serif font-bold text-emerald-950 mb-3">{title}</h2>
    <p className="text-emerald-900/60 text-sm max-w-xs mb-10 leading-relaxed">
      {description}
    </p>
    <Link
      href={actionHref}
      className="bg-emerald-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
    >
      {actionLabel}
    </Link>
  </div>
);

export default EmptyState;
