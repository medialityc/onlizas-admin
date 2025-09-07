import { buildQueryParams } from "@/lib/request";
import { Metadata } from "next";
import WarehouseVirtualTypeContainer from "@/sections/warehouse-virtual-type/containers/warehouse-virtual-type-containers";
import { getAllWarehousesVirtualType } from "@/services/warehouses-virtual-types";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Tipos de almacenes virtuales - ZAS Express",
  description: "Gestión de tipos de almacenes virtuales",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default async function WarehousesVirtualTypePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  const query = buildQueryParams(params);
  const typesPromise = await getAllWarehousesVirtualType(query as any);

  if (!typesPromise?.data) {
    notFound();
  }

  return (
    <WarehouseVirtualTypeContainer typesPromise={typesPromise} query={params} />
  );
}
