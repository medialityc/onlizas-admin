import { buildQueryParams } from "@/lib/request";
import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import WarehouseInventoryListContainer from "@/sections/warehouses/containers/warehouse-inventory-container";

import {
  getWarehouseById,
  getAllWarehouseInventories,
} from "@/services/warehouses";

import { SearchParams } from "@/types/fetch/request";

import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Inventario de almacén - ZAS Express",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string; type: string }>;
};

export default async function EditWarehouseInventoryPage({
  params,
  searchParams,
}: PageProps) {
  const { id, type } = await params;
  const search = await searchParams;
  const query = buildQueryParams(search);

  if (!Object.keys(WAREHOUSE_TYPE_ENUM).includes(type)) {
    notFound();
  }

  /* services */
  const inventory = await getAllWarehouseInventories(id, query);
  const response = await getWarehouseById(id, type);

  if (!response?.data || !inventory?.data) {
    notFound();
  }

  const warehouse = response.data;

  return (
    <EditWarehouseLayout warehouse={warehouse}>
      <WarehouseInventoryListContainer
        inventoryPromise={inventory}
        query={query}
      />
    </EditWarehouseLayout>
  );
}
