"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import WarehouseCardList from "../warehouse-card-list/warehouse-card-list";
import { GetAllWarehouses } from "@/types/warehouses";

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
        rightActions={<></>}
        component={
          <WarehouseCardList data={data?.data} searchParams={searchParams} />
        }
      />
    </>
  );
}
