"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { GetAllWarehouses } from "@/types/warehouses";
import WarehouseCardList from "./warehouse-card-list";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";

interface Props {
  data?: GetAllWarehouses;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  forceType?: WAREHOUSE_TYPE_ENUM;
}

export function InventoryCardGrid({
  data,
  searchParams,
  forceType,
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
          <WarehouseCardList
            data={data?.data}
            searchParams={searchParams}
            forceType={forceType}
          />
        }
      />
    </>
  );
}
