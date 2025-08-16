import { getWarehouseById } from "@/services/warehouses-mock";
import { notFound } from "next/navigation";
import { WarehouseGeneralData } from "./warehouse-general-data";
import EditWarehouseLayout from "../layout/edit-warehouse-layout";

export default async function EditWarehouseContent({ id }: { id: string }) {
  const response = await getWarehouseById(Number(id));

  if (!response?.data) {
    notFound();
  }

  const warehouse = response.data;

  return (
    <EditWarehouseLayout warehouse={warehouse}>
      <WarehouseGeneralData warehouse={warehouse} />
    </EditWarehouseLayout>
  );
}
