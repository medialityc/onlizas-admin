import { Suspense } from "react";
import { getProductById } from "@/services/products";
import { notFound } from "next/navigation";
import ProductEditContainer from "@/sections/provider-management/products/containers/product-edit-container";
import { productTransformData } from "@/sections/provider-management/products/utils/product-transform-data";

// Esqueleto de carga
function ProductEditFallback() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15 params es una Promesa
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();

  const product = response.data;

  return (
    <Suspense fallback={<ProductEditFallback />}>
      <ProductEditContainer product={productTransformData(product)} />
    </Suspense>
  );
}
