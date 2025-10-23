import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { WarehouseForm } from "@/sections/warehouses/components/warehouse-form/warehouse-form";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import { getWarehouseById } from "@/services/warehouses";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Editar almacén - ZAS Express",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type Props = {
  params: Promise<{ id: string; type: string }>;
};
export default async function EditWarehousePage({ params }: Props) {
  const { id, type } = await params;

  if (!Object.keys(WAREHOUSE_TYPE_ENUM).includes(type)) {
    notFound();
  }

  /* services */
  const response = await getWarehouseById(id, type);

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
