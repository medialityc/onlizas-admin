"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { GetAllWarehouses } from "@/types/warehouses";
import WarehouseCardList from "./warehouse-card-list";

interface Props {
  data?: GetAllWarehouses;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function InventoryCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar almacén..."
        enableColumnToggle={false}
        component={
          <WarehouseCardList data={data?.data} searchParams={searchParams} />
        }
      />
    </>
  );
}
