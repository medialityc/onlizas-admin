import { buildQueryParams } from "@/lib/request";
import { Metadata } from "next";
import { getAllTransfers } from "@/services/warehouses-transfers";
import WarehouseTransferListContainer from "@/sections/warehouses/containers/warehouse-transfer-list-container";
import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { getWarehouseById } from "@/services/warehouses";
import { notFound } from "next/navigation";
import { meWarehouseTabs } from "@/sections/warehouses/constants/warehouse-tabs";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";

export const metadata: Metadata = {
  title: "Transferencias del almacén - ZAS Express",
  description: "Gestión de transferencias de almacén",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function WarehousesPage({ searchParams, params }: Props) {
  const search = await searchParams;
  const { id: warehouseId } = await params;
  const query = buildQueryParams(search);
  const warehousesTransferPromise = await getAllTransfers({
    ...query,
    warehouseId,
  });

  const response = await getWarehouseById(
    Number(warehouseId),
    WAREHOUSE_TYPE_ENUM.virtual
  );

  if (!response?.data) {
    notFound();
  }

  return (
    <EditWarehouseLayout warehouse={response.data} onTabs={meWarehouseTabs}>
      <WarehouseTransferListContainer
        warehousesTransferPromise={warehousesTransferPromise}
        query={search}
      />
    </EditWarehouseLayout>
  );
}
