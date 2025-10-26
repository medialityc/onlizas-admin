import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
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

  const warehouse = await getWarehouseById(id, type);

  if (!warehouse?.data) {
    notFound();
  }

  return (
    <EditWarehouseLayout warehouse={warehouse.data}>
      <WarehouseTransferContainer warehouse={warehouse.data} />
    </EditWarehouseLayout>
  );
}
