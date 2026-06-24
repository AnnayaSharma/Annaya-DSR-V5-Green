import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models/Product';
import ProductDetailView from '@/components/ProductDetailView';

export const revalidate = 3600; // Cache for 1 hour

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-render all product paths at build time to maximize edge performance.
 */
export async function generateStaticParams() {
  await connectDB();
  const products = await ProductModel.find({}, { slug: 1 }).lean();
  return products.map((p: any) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  await connectDB();
  const rawProduct = await ProductModel.findOne({ slug }).lean() as any;

  if (!rawProduct) {
    return notFound();
  }

  // Serialise for props - ensure all nested objects are plain JS objects
  const product = {
    ...rawProduct,
    id: rawProduct._id.toString(),
    _id: undefined,
    __v: undefined,
    createdAt: rawProduct.createdAt?.toISOString?.() ?? null,
    updatedAt: rawProduct.updatedAt?.toISOString?.() ?? null,
    // Explicitly map nested arrays that might contain non-serializable BSON types
    colors: rawProduct.colors?.map((c: any) => ({
      name: c.name,
      hex: c.hex,
    })) ?? [],
  };

  return <ProductDetailView initialProduct={product} />;
}
