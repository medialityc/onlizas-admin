import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import { Metadata } from "next";
import WarehouseVirtualTypeContainer from "@/sections/warehouse-virtual-type/containers/warehouse-virtual-type-containers";
import { getAllWarehousesVirtualType } from "@/services/warehouses-virtual-types";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Tipos de almacenes virtuales - ZAS Express",
  description: "Gestión de tipos de almacenes virtuales",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

function WarehousesVirtualTypeFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-6 bg-gray-200 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-5/6" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default async function WarehousesVirtualTypePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  const query = buildQueryParams(params);
  const typesPromise = await getAllWarehousesVirtualType(query as any);

  if (!typesPromise?.data) {
    notFound();
  }

  return (
    <Suspense fallback={<WarehousesVirtualTypeFallback />}>
      <WarehouseVirtualTypeContainer
        typesPromise={typesPromise}
        query={params}
      />
    </Suspense>
  );
}
