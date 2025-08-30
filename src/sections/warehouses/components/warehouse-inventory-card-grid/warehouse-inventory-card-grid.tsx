"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import WarehouseInventoryCardList from "./warehouse-inventory-card-list";
import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";
import { InventoryProvider } from "@/types/inventory";

interface Props {
  data?: InventoryProviderFormData[];
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function WarehouseInventoryCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  return (
    <>
      <DataGridCard
        data={{
          data: [],
          totalCount: data?.length || 0,
          page: 1,
          pageSize: data?.length || 10,
          hasNext: false,
          hasPrevious: false,
        }}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar inventario de almacén..."
        enableColumnToggle={false}
        enableSearch={false}
        component={
          <WarehouseInventoryCardList
            data={(data as unknown as InventoryProvider[]) || []}
            searchParams={searchParams}
          />
        }
      />
    </>
  );
}
