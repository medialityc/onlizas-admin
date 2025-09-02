"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import InventoryProviderList from "../inventory-provider-card/inventory-provider-list";
import { GetAllInventoryProviderResponse } from "@/types/inventory";

interface Props {
  data?: GetAllInventoryProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  onCreate: VoidFunction;
}

export function InventoryCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
  onCreate,
}: Props) {
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar inventario..."
        onCreate={onCreate}
        createText="Crear inventario"
        enableColumnToggle={false}
        component={
          <InventoryProviderList
            data={data?.data as any[]}
            searchParams={searchParams}
          />
        }
      />
    </>
  );
}
