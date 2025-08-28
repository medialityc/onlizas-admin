import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import WarehouseListContainer from "@/sections/warehouses/containers/warehouse-list-container";
import { getAllWarehousesByType } from "@/services/warehouses";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ type: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { type } = await params;
  const typeName =
    type === WAREHOUSE_TYPE_ENUM.physical ? "Físicos" : "Virtual";
  return {
    title: `Almacenes ${typeName} - Onlizas`,
    description: "Gestión de almacenes físicos del sistema",
    icons: {
      icon: "/assets/images/NEWZAS.svg",
    },
  };
};

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

async function WarehousesPhysicalPage({ searchParams, params }: PageProps) {
  const _searchParams = await searchParams;
  const { type } = await params;
  const query: IQueryable = buildQueryParams(_searchParams);
  const warehousesPromise = await getAllWarehousesByType(query, type);

  if (!Object.keys(WAREHOUSE_TYPE_ENUM).includes(type)) {
    notFound();
  }

  return (
    <Suspense fallback={<WarehousesListSkeleton />}>
      <WarehouseListContainer
        warehousesPromise={warehousesPromise}
        query={query}
      />
    </Suspense>
  );
}

export default WarehousesPhysicalPage;
