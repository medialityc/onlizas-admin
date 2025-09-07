import { buildQueryParams } from "@/lib/request";

import { getAllWarehouses } from "@/services/warehouses";
import WarehouseListContainer from "@/sections/warehouses/containers/warehouse-list-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almacenes General - ZAS Express",
  description: "Gestión de almacenes del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default async function WarehousesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  const query = buildQueryParams(params);
  const warehousesPromise = await getAllWarehouses(query as any);

  return (
    <WarehouseListContainer
      warehousesPromise={warehousesPromise}
      query={params}
    />
  );
}
