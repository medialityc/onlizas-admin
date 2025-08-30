import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { WarehouseTransfers } from "@/sections/warehouses/components/transfer/warehouse-transfers";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import WarehouseTransferContainer from "@/sections/warehouses/containers/warehouse-trasnfer-container";
import { getWarehouseById } from "@/services/warehouses";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Transferencia de almacén - ZAS Express",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type PageProps = {
  params: Promise<{ id: string; type: string }>;
};

export default async function EditWarehouseTransfersPage({
  params,
}: PageProps) {
  const { id, type } = await params;

  if (!Object.keys(WAREHOUSE_TYPE_ENUM).includes(type)) {
    notFound();
  }

  const response = await getWarehouseById(Number(id), type);

  if (!response?.data) {
    notFound();
  }

  return (
    <EditWarehouseLayout warehouse={response.data}>
      <WarehouseTransferContainer warehouseId={response.data?.id as number} />
      <WarehouseTransfers warehouse={response.data} />
    </EditWarehouseLayout>
  );
}
