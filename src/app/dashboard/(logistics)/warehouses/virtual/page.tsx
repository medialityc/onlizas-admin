import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import WarehouseListContainer from "@/sections/warehouses/containers/warehouse-list-container";
import { getAllWarehouses } from "@/services/warehouses";

export const metadata: Metadata = {
  title: "Almacenes Virtuales - Onlizas",
  description: "Gestión de almacenes virtuales del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function WarehousesListSkeleton() {
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
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

async function WarehousesVirtualPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // Aseguramos que el tipo sea "virtual" para esta página
  const queryParams = { ...params, type: "virtual" };
  const query: IQueryable = buildQueryParams(queryParams);
  const warehousesPromise = await getAllWarehouses(query);

  return (
    <Suspense fallback={<WarehousesListSkeleton />}>
      <WarehouseListContainer
        warehousesPromise={warehousesPromise}
        query={params}
      />
    </Suspense>
  );
}

export default WarehousesVirtualPage;
