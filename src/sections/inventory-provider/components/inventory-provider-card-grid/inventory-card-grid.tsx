"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { GetAllInventoryProviderResponse } from "@/services/inventory-providers";
import InventoryProviderList from "../inventory-provider-card/inventory-provider-list";

interface Props {
  data?: GetAllInventoryProviderResponse;
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
        searchPlaceholder="Buscar inventario..."
        // onCreate={handleInventoryProviderCreate}
        createText="Crear inventario"
        enableColumnToggle={false}
        rightActions={<></>}
        component={
          <InventoryProviderList
            data={data?.data}
            searchParams={searchParams}
          />
        }
      />
    </>
  );
}
