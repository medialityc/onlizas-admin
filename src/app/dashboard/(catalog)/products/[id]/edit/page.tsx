import { Suspense } from 'react';
import { getProductById } from '@/services/products-mock';
import { ProductForm } from '@/sections/products/product-form';
import { notFound } from 'next/navigation';

function EditProductFallback () {
  return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-96 bg-gray-200 rounded" />
    </div>
  );
}

async function EditProductContent ({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();
  return <ProductForm product={response.data} />;
}

export default async function EditProductPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // params es Promesa en Next 15
  return (
    <Suspense fallback={<EditProductFallback />}>
      <EditProductContent id={id} />
    </Suspense>
  );
}