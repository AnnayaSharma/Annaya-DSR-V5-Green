import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models/Product';
import { rateLimit } from '@/lib/rate-limit';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: Request) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const { success, remaining } = rateLimit(ip, 60, 60_000); // 60 req/min

  if (!success) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  }

  try {
    await connectDB();
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();

    // Normalise _id → id for every document
    const serialised = products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
      __v: undefined,
      createdAt: p.createdAt?.toISOString?.() ?? null,
      updatedAt: p.updatedAt?.toISOString?.() ?? null,
    }));

    return NextResponse.json(serialised, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error) {
    console.error('[GET /api/products]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
