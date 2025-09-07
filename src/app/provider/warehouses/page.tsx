import { buildQueryParams } from "@/lib/request";
import MeWarehouseListContainer from "@/sections/warehouses/containers/me-warehouse-list-container";
import { getAllMeWarehouses } from "@/services/warehouses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouses | ZAS Express",
  description: "Warehouse and location management",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type Props = {
  // params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function WarehousesPage({ searchParams }: Props) {
  const search = await searchParams;
  const query = buildQueryParams(search);
  const meWarehousesPromise = await getAllMeWarehouses(query as any);

  return (
    <MeWarehouseListContainer
      warehousesPromise={meWarehousesPromise}
      query={search}
    />
  );
}
