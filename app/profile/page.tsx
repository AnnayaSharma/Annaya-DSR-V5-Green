'use client';

import React from 'react';
import {
  User, Settings, Package, MapPin,
  CreditCard, LogOut, ChevronRight,
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: Package,    label: 'My Orders',          description: 'Track and manage your orders'      },
  { icon: MapPin,     label: 'Shipping Addresses',  description: 'Manage your delivery locations'    },
  { icon: CreditCard, label: 'Payment Methods',     description: 'Manage your saved cards'           },
  { icon: Settings,   label: 'Account Settings',    description: 'Update your profile information'   },
] as const;

export default function ProfilePage() {
  return (
    <div className="pb-32 max-w-2xl mx-auto px-4 lg:px-0 lg:pt-10">
      <h1 className="text-3xl font-serif font-bold text-emerald-950 mb-8">
        My Profile
      </h1>

      {/* Avatar card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-900/5 mb-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
          <User size={40} className="text-emerald-800" />
        </div>
        <h2 className="text-xl font-serif font-bold text-emerald-950">Ananya Sharma</h2>
        <p className="text-emerald-900/50 text-sm font-medium">ananya.sharma@example.com</p>
        <button className="mt-6 px-6 py-2 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">
          Edit Profile
        </button>
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-3">
        {MENU_ITEMS.map(({ icon: Icon, label, description }) => (
          <button
            key={label}
            className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-emerald-900/5 shadow-sm hover:shadow-md transition-all group text-left"
          >
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700 group-hover:bg-emerald-900 group-hover:text-white transition-all">
              <Icon size={20} />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-emerald-950 uppercase tracking-wider">{label}</p>
              <p className="text-xs text-emerald-900/40 font-medium">{description}</p>
            </div>
            <ChevronRight size={18} className="text-emerald-900/20 group-hover:text-emerald-900 transition-all" />
          </button>
        ))}

        {/* Sign Out */}
        <button className="flex items-center gap-4 p-5 bg-red-50 rounded-3xl border border-red-100 shadow-sm hover:bg-red-100 transition-all text-left mt-4">
          <div className="p-3 bg-white rounded-2xl text-red-600 shadow-sm">
            <LogOut size={20} />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Sign Out</p>
            <p className="text-xs text-red-600/60 font-medium">Log out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
