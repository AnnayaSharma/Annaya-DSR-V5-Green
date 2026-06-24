'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Rss as Pinterest,
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { formatPhoneDisplay } from '@/utils';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-emerald-50/90 pt-4 pb-24 lg:pb-12 border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="space-y-6">
          <Link href="/" className="flex flex-col items-start">
            <span className="text-2xl font-serif font-bold tracking-widest text-white uppercase">
              ANNAYA
            </span>
            <span className="text-xs tracking-[0.3em] font-medium text-luxury-gold -mt-1 uppercase">
              DSR SAREES
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-emerald-100/60">
            Discover the timeless elegance of premium handwoven sarees with a modern touch.
            Our curated collections bring you the finest Banarasi silks, Kanjeevarams,
            and lightweight designer drapes for every occasion.
          </p>
          <div className="space-y-3 text-xs leading-relaxed text-emerald-100/50 border-t border-emerald-900/40 pt-4 mt-4">
            <p className="flex items-start gap-2">
              <span className="shrink-0">📦</span>
              <span><strong>Shipping Charges:</strong> ₹100 extra</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="shrink-0">👚</span>
              <span><strong>Blouse Option:</strong> If you want the saree with a blouse, an additional ₹150 will be charged.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="shrink-0">✅</span>
              <span><strong>Order Confirmation:</strong> Full payment in a single transaction is mandatory to confirm your order.</span>
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            {[
              { Icon: Instagram, href: 'https://instagram.com/', label: 'Instagram' },
              { Icon: Facebook, href: 'https://facebook.com/', label: 'Facebook' },
              { Icon: Pinterest, href: 'https://pinterest.com/', label: 'Pinterest' },
              { Icon: Twitter, href: 'https://twitter.com/', label: 'Twitter' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-emerald-800/50 flex items-center justify-center hover:bg-luxury-gold hover:text-emerald-950 hover:border-luxury-gold transition-all duration-300 group"
                aria-label={label}
              >
                <Icon size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-luxury-gold font-bold tracking-wider uppercase text-sm mb-6">
            Quick Links
          </h4>
          <ul className="space-y-4 text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: 'Categories', href: '/categories' },
              { label: 'About Us', href: '/about' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-luxury-gold transition-colors block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-luxury-gold font-bold tracking-wider uppercase text-sm mb-6">
            Categories
          </h4>
          <ul className="space-y-4 text-sm">
            {CATEGORIES.filter((c) => c.name !== 'All')
              .slice(0, 5)
              .map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/categories?cat=${encodeURIComponent(cat.name)}`}
                    className="hover:text-luxury-gold transition-colors block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <h4 className="text-luxury-gold font-bold tracking-wider uppercase text-sm mb-6">
            Contact Us
          </h4>
          <div className="space-y-4">
            {[
              { Icon: Phone, label: 'Call Us', value: formatPhoneDisplay() },
              { Icon: Mail, label: 'Email Us', value: 'Annayadsrsareebussiness@gmail.com' },
              { Icon: MapPin, label: 'Visit Us', value: 'Mumbai, Maharashtra, India' },
              { Icon: Clock, label: 'Hours', value: 'Mon – Sun: 7am – 10pm' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={18} className="text-luxury-gold mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-emerald-100/40 uppercase tracking-tighter mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 pt-8 border-t border-emerald-900/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider text-emerald-100/30 uppercase font-medium">
          <p>© {year} ANNAYA DSR SAREES. All Rights Reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/about" className="hover:text-luxury-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-luxury-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
