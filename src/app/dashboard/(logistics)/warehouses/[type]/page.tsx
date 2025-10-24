import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import WarehouseListContainer from "@/sections/warehouses/containers/warehouse-list-container";
import { getAllWarehousesByType } from "@/services/warehouses";
import {
  WAREHOUSE_TYPE_ENUM,
  WAREHOUSE_TYPE_ROUTE_ENUM,
} from "@/sections/warehouses/constants/warehouse-type";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ type: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { type } = await params;
  const typeName =
    type === WAREHOUSE_TYPE_ROUTE_ENUM.physical ? "Físicos" : "Virtual";
  return {
    title: `Almacenes ${typeName} - Onlizas`,
    description: "Gestión de almacenes físicos del sistema.",
    icons: {
      icon: "/assets/images/NEWZAS.svg",
    },
  };
};

async function WarehousesPhysicalPage({ searchParams, params }: PageProps) {
  const _searchParams = await searchParams;
  const { type } = await params;
  const query: IQueryable = buildQueryParams(_searchParams);
  const warehousesPromise = await getAllWarehousesByType(
    query,
    WAREHOUSE_TYPE_ROUTE_ENUM[type as keyof typeof WAREHOUSE_TYPE_ROUTE_ENUM]
  );

  if (!Object.keys(WAREHOUSE_TYPE_ROUTE_ENUM).includes(type)) {
    notFound();
  }

  return (
    <WarehouseListContainer
      warehousesPromise={warehousesPromise}
      query={query}
    />
  );
}

export default WarehousesPhysicalPage;
