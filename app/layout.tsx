import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Analytics } from '@vercel/analytics/react';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models/Product';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ANNAYA DSR SAREES — Premium Handwoven Sarees',
  description:
    'Discover the finest premium handwoven sarees — Banarasi, Kanjeevaram, Organza, Linen & Designer drapes. Curated collections for the modern woman.',
  keywords: ['sarees', 'handwoven sarees', 'silk sarees', 'designer sarees', 'Banarasi silk', 'Kanjeevaram silk', 'boutique'],
  metadataBase: new URL('https://AnnayaShopping.store'),
  openGraph: {
    title: 'ANNAYA DSR SAREES — Premium Handwoven Sarees',
    description: 'Premium handwoven sarees — Banarasi, Kanjeevaram, Organza, Linen & Designer drapes.',
    url: 'https://AnnayaShopping.store',
    siteName: 'ANNAYA DSR SAREES',
    images: [{ url: '/hero.webp', width: 1536, height: 1024 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANNAYA DSR SAREES — Premium Handwoven Sarees',
    description: 'Premium handwoven sarees — Banarasi, Kanjeevaram, Organza, Linen & Designer drapes.',
    images: ['/hero.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

// Viewport is now a separate export in Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#064e3b',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ─── Server-side product fetch ────────────────────────────────────────────
  // Products are fetched HERE on the server once per request, injected as
  // initialProducts into ShopProvider. This means:
  //   1. No client-side /api/products fetch on first load (saves edge requests)
  //   2. Products are available immediately — no loading flash
  //   3. The /api/products route is only hit by direct API callers or ISR
  let initialProducts: any[] = [];
  try {
    await connectDB();
    // Projection: only fetch fields needed for listing cards — excludes
    // heavy fields like description that are only needed on detail pages.
    const products = await ProductModel.find(
      {},
      {
        name: 1, slug: 1, price: 1, originalPrice: 1, discountPercent: 1,
        category: 1, images: 1, rating: 1, reviewCount: 1, sizes: 1,
        colors: 1, stock: 1, isFeatured: 1, isNewArrival: 1, isTrending: 1,
        createdAt: 1, updatedAt: 1,
      }
    ).sort({ createdAt: -1 }).lean();
    initialProducts = JSON.parse(JSON.stringify(products)).map((p: any) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
      __v: undefined,
      createdAt: p.createdAt || null,
      updatedAt: p.updatedAt || null,
    }));
  } catch (error) {
    console.error('[RootLayout] Failed to fetch initial products:', error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ShopProvider initialProducts={initialProducts}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <BottomNav />
            <Analytics />
          </div>
        </ShopProvider>
      </body>
    </html>
  );
}
