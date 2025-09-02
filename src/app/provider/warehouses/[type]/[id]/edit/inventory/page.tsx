import { buildQueryParams } from "@/lib/request";
import EditWarehouseLayout from "@/sections/warehouses/components/layout/edit-warehouse-layout";
import { meWarehouseTabs } from "@/sections/warehouses/constants/warehouse-tabs";
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
  params: Promise<{ id: string }>;
};

export default async function EditWarehouseInventoryPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const query = buildQueryParams(search);

  /* services */
  const inventory = await getAllWarehouseInventories(id, query);
  const response = await getWarehouseById(
    Number(id),
    WAREHOUSE_TYPE_ENUM.virtual
  );

  if (!response?.data || !inventory?.data) {
    notFound();
  }

  const warehouse = response.data;

  return (
    <EditWarehouseLayout warehouse={warehouse} onTabs={meWarehouseTabs}>
      <WarehouseInventoryListContainer
        inventoryPromise={inventory}
        query={query}
      />
    </EditWarehouseLayout>
  );
}
