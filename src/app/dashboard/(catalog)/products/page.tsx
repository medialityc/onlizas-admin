import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import ProductsListContainer from "@/sections/products/containers/products-list-container";
import { getAllProducts } from "@/services/products";
import { IQueryable } from "@/types/fetch/request";

function ProductsListFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-6 bg-gray-200 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-5/6" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const productsPromise = await getAllProducts(query);

  return (
    <Suspense fallback={<ProductsListFallback />}>
      <ProductsListContainer productsPromise={productsPromise} query={params} />
    </Suspense>
  );
}
