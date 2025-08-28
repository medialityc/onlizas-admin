import { getWarehouseById } from "@/services/warehouses";
import { notFound } from "next/navigation";
import { WarehouseForm } from "../components/warehouse-form/warehouse-form";
import EditWarehouseLayout from "../components/layout/edit-warehouse-layout";
import { Suspense } from "react";

export default async function EditWarehouseContainer({ id }: { id: string }) {
  const response = await getWarehouseById(Number(id));

  if (!response?.data) {
    notFound();
  }

  return (
    <Suspense fallback={<></>}>
      <EditWarehouseLayout warehouse={response?.data}>
        <WarehouseForm warehouse={response?.data} />
      </EditWarehouseLayout>
    </Suspense>
  );
}
