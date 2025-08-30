import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import WarehouseTransferContainer from "@/sections/warehouses/containers/warehouse-trasnfer-container";
import {
  getAllWarehouseProductVariants,
  getWarehouseById,
} from "@/services/warehouses";
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

  const productVariants = await getAllWarehouseProductVariants(id);

  if (!response?.data || !productVariants?.data) {
    notFound();
  }

  return (
    <EditWarehouseLayout warehouse={response.data}>
      <WarehouseTransferContainer
        warehouseId={response.data?.id as number}
        productVariants={productVariants?.data || []}
      />
    </EditWarehouseLayout>
  );
}
