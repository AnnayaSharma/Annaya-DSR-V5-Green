'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero: React.FC = () => (
  <section className="relative w-full h-[70vh] lg:h-[85vh] overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      {/* hero.webp = 155 KB vs Hero Image.png = 2,271 KB — 93% smaller */}
      <Image
        src="/hero.webp"
        alt="Luxury Fashion hero"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAFAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIBAAAQQCAgMAAAAAAAAAAAAAAQIDBBEFEiExQf/EABUBAQEAAAAAAAAAAAAAAAAAAAIE/8QAGBEAAgMAAAAAAAAAAAAAAAAAARIhMUH/2gAMAwEAAhEDEQA/AJ+YydxJiKcqXJkRkAMx1DWt8sBzWqCQADqPmtpE6dHjqUpSCpaVOSABQAAFAD//2Q=="
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-950/40 to-transparent" />
    </div>

    {/* Content */}
    <div className="relative h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-center items-start">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 w-fit px-4 py-1 rounded-full">
          <Sparkles size={14} className="text-luxury-gold" />
          <span className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-[0.3em]">
            New Collection 2026
          </span>
        </div>

        <h1 className="text-5xl lg:text-8xl font-bold text-white leading-[1.1] mb-6">
          Elegance in <br />
          <span className="text-emerald-300">Every Thread</span>
        </h1>

        <p className="text-emerald-50/80 text-sm lg:text-lg font-medium mb-10 max-w-md leading-relaxed">
          Discover our curated collection of premium handwoven sarees, designed for the
          modern woman who values heritage, drape, and luxury.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-white text-emerald-950 px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-emerald-950/20"
          >
            Shop Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/categories"
            className="w-full sm:w-auto bg-transparent text-white border border-white/30 px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-center"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </div>

    {/* Decorative label */}
    <div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-end gap-2">
      <div className="w-24 h-[1px] bg-white/30" />
      <span className="text-[10px] text-white/50 uppercase tracking-[0.5em] font-medium">
        ANNAYA DSR SAREES
      </span>
    </div>
  </section>
);

export default Hero;
