import { getWarehouseById } from "@/services/warehouses-mock";
import { notFound } from "next/navigation";
import { WarehouseInventory } from "./warehouse-inventory";
import EditWarehouseLayout from "../layout/edit-warehouse-layout";

export default async function EditWarehouseInventoryContent({
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
      <WarehouseInventory />
    </EditWarehouseLayout>
  );
}
