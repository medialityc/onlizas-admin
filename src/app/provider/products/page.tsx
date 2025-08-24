import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import { getAllProductsBySupplier, getAllProducts } from "@/services/products";
import { fetchUserMe, getUserById } from "@/services/users";
import { useAuth } from "@/auth-sso/hooks/use-auth";
import ProductsListProviderContainer from "@/sections/provider-management/products/containers/products-list-container";

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
  const query = buildQueryParams(params);

  // Server-side: fetch current user and load products for that supplier.
  // Avoid using client hooks (useQuery) in this server component.
  let productsPromise;

  const userRes = await getUserById(106);
  const user = userRes?.data;
  productsPromise = getAllProductsBySupplier(user?.id ?? 0,query);

  return (
    <Suspense fallback={<ProductsListFallback />}>
      <ProductsListProviderContainer
        productsPromise={productsPromise}
        query={params} // <-- Solo parámetros planos, nunca el objeto con pagination
      />
    </Suspense>
  );
}
