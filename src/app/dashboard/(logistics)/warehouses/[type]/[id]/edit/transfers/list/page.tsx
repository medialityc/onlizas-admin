import { buildQueryParams } from "@/lib/request";
import { Suspense } from "react";
import { Metadata } from "next";
import { getAllTransfers } from "@/services/warehouses-transfers";
import WarehouseTransferListContainer from "@/sections/warehouses/containers/warehouse-transfer-list-container";
import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { getWarehouseById } from "@/services/warehouses";
import { notFound } from "next/navigation";

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
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function WarehousesPage({ searchParams, params }: Props) {
  const search = await searchParams;
  const { id: warehouseId, type } = await params;
  const query = buildQueryParams(search);
  const warehousesTransferPromise = await getAllTransfers({
    ...query,
    warehouseId: warehouseId,
    direction: "Both", // Obtener todas las transferencias (enviadas y recibidas)
  });

  const response = await getWarehouseById(warehouseId, type);

  if (!response?.data) {
    notFound();
  }

  return (
    <EditWarehouseLayout warehouse={response.data}>
      <Suspense fallback={<WarehousesListFallback />}>
        <WarehouseTransferListContainer
          warehousesTransferPromise={warehousesTransferPromise}
          query={search}
          currentWarehouseId={Number(warehouseId)}
        />
      </Suspense>
    </EditWarehouseLayout>
  );
}
