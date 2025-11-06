import ProductsListPermissionWrapper from "@/sections/products/containers/products-list-permission-wrapper";
import { PermissionGate } from "@/components/permission/permission-gate";
import React from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  return (
    <PermissionGate
      loadingFallback={
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      }
      // Mostrar igual para supplier; el wrapper ya decide vista
      keepFallbackIfMissing={false}
    >
      <ProductsListPermissionWrapper query={params} />
    </PermissionGate>
  );
}
