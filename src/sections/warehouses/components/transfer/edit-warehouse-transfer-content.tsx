import { notFound } from "next/navigation";
import { WarehouseTransfers } from "./warehouse-transfers";
import EditWarehouseLayout from "../layout/edit-warehouse-layout";
import { getWarehouseById } from "@/services/warehouses";

export default async function EditWarehouseTransfersContent({
  id,
}: {
  id: string;
}) {
  const response = await getWarehouseById(Number(id));
  if (!response?.data) {
    notFound();
  }
  const warehouse = response.data;
  return (
    <EditWarehouseLayout warehouse={warehouse}>
      <WarehouseTransfers warehouse={warehouse} />
    </EditWarehouseLayout>
  );
}
