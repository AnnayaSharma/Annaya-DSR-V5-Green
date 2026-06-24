import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models/Product';
import { rateLimit } from '@/lib/rate-limit';

export const revalidate = 3600; // Cache for 1 hour

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const { slug } = await params;

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const { success, remaining } = rateLimit(ip, 120, 60_000); // 120 req/min (individual slugs)

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
    const product = await ProductModel.findOne({ slug }).lean() as any;

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const serialised = {
      ...product,
      id: product._id.toString(),
      _id: undefined,
      __v: undefined,
      createdAt: product.createdAt?.toISOString?.() ?? null,
      updatedAt: product.updatedAt?.toISOString?.() ?? null,
    };

    return NextResponse.json(serialised, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error) {
    console.error(`[GET /api/products/${slug}]`, error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
