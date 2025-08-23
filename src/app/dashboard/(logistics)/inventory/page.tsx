import { buildQueryParams } from "@/lib/request";
import InventoryProviderListContainer from "@/sections/inventory-provider/containers/inventory-provider-list-container";
import { getAllInventoryProvider } from "@/services/inventory-providers";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Inventario por Proveedores - ZAS Express",
  description: "Gestiona el inventario de los proveedores",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function InventoryProviderSkeleton() {
  return (
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-40 col-span-1 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}

async function InventoryProviderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const inventories = getAllInventoryProvider(query);

  return (
    <Suspense fallback={<InventoryProviderSkeleton />}>
      <InventoryProviderListContainer
        inventories={inventories}
        query={params}
      />
    </Suspense>
  );
}

export default InventoryProviderPage;
