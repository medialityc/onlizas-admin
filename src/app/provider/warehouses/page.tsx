import { buildQueryParams } from "@/lib/request";
import MeWarehouseListContainer from "@/sections/warehouses/containers/me-warehouse-list-container";
import { getAllMeWarehouses } from "@/services/warehouses";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Warehouses | ZAS Express",
  description: "Warehouse and location management",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

function WarehousesListFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-6 bg-gray-200 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-5/6" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function WarehousesPage({ searchParams }: Props) {
  const search = await searchParams;
  const query = buildQueryParams(search);
  const meWarehousesPromise = await getAllMeWarehouses(query as any);

  return (
    <Suspense fallback={<WarehousesListFallback />}>
      <MeWarehouseListContainer
        warehousesPromise={meWarehousesPromise}
        query={search}
      />
    </Suspense>
  );
}
