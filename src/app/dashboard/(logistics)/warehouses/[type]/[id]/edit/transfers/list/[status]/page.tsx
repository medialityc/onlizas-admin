import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import { getAllWarehouses } from "@/services/warehouses";
import WarehouseListContainer from "@/sections/warehouses/containers/warehouse-list-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transferencias del almacén - ZAS Express",
  description: "Gestión de transferencias de almacén",
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
  params: Promise<{ type: string; id: string; status: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function WarehousesPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = buildQueryParams(params);
  const warehousesPromise = await getAllWarehouses(query as any);

  return (
    <Suspense fallback={<WarehousesListFallback />}>
      <WarehouseListContainer
        warehousesPromise={warehousesPromise}
        query={params}
      />
    </Suspense>
  );
}
