import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // ─── Bypass Vercel's paid image optimization ──────────────────────────────
    // Shopify CDN already serves optimized images. Using Vercel's /_next/image
    // pipeline causes 402 PAYMENT_REQUIRED errors when the free tier is exceeded.
    unoptimized: true,

    // ─── CRITICAL: Cache optimized images for 30 days (default is 60s!) ───────
    // This means a given image+size variant is only processed ONCE per month.
    // Without this, every repeat visitor re-triggers a /_next/image edge request.
    minimumCacheTTL: 2592000, // 30 days in seconds

    // ─── Serve modern formats: AVIF (smaller) → WebP → JPEG fallback ─────────
    formats: ['image/avif', 'image/webp'],

    // ─── Only generate widths that your layout actually uses ─────────────────
    // Fewer breakpoints = fewer unique image variants = fewer edge requests
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 128, 256, 384],

    // ─── Allowed remote image hosts ──────────────────────────────────────────
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'www.AnnayaShopping.store',
      },
      {
        protocol: 'https',
        hostname: 'AnnayaShopping.store',
      },
    ],
  },

  // ─── HTTP Cache-Control headers ──────────────────────────────────────────
  // These make browsers cache assets locally so they never hit Vercel again
  // on repeat visits — dramatically reducing your monthly edge request count.
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const securityHeaders = isProd
      ? [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://cdn.shopify.com https://www.AnnayaShopping.store https://AnnayaShopping.store",
              "connect-src 'self' https://va.vercel-scripts.com",
              "frame-ancestors 'none'",
            ].join('; ') + ';',
          },
        ]
      : [];

    const list = [
      {
        // Next.js static assets (JS, CSS chunks) — immutable, never change
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Optimized images — cache in browser for 30 days
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Public static files (hero.webp, image2.webp, etc.) — 7 days
        source: '/(.+\\.(?:webp|jpg|jpeg|png|gif|ico|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Fonts — immutable (content-hashed by Next.js)
        source: '/(.+\\.(?:woff|woff2|ttf|otf|eot))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];

    if (securityHeaders.length > 0) {
      list.push({
        // ─── Security headers for all routes ──────────────────────────────
        source: '/(.*)',
        headers: securityHeaders,
      });
    }

    return list;
  },
};

export default nextConfig;
