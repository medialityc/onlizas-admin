import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { WarehouseForm } from "@/sections/warehouses/components/warehouse-form/warehouse-form";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import { getWarehouseById } from "@/services/warehouses";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Editar almacén - Onlizas",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type Props = {
  params: Promise<{ id: string; type: string }>;
};
export default async function EditWarehousePage({ params }: Props) {
  const { id, type } = await params;

  /* services */
  const warehouse = await getWarehouseById(id, type);

  if (!warehouse?.data) {
    notFound();
  }

  return (
    <Suspense fallback={<></>}>
      <EditWarehouseLayout warehouse={warehouse?.data}>
        <WarehouseForm warehouse={warehouse?.data} />
      </EditWarehouseLayout>
    </Suspense>
  );
}
