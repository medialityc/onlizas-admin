"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { GetAllInventoryProviderResponse } from "@/services/inventory-providers";
import InventoryProviderCardList from "../inventory-provider-card/inventory-provider-card-list";
import { useCallback } from "react";

interface Props {
  data?: GetAllInventoryProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function InventoryProviderCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  const handleInventoryProviderCreate = useCallback(() => {}, []);
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar inventario..."
        onCreate={handleInventoryProviderCreate}
        enableColumnToggle={false}
        rightActions={<></>}
        component={
          <InventoryProviderCardList
            data={data?.data}
            searchParams={searchParams}
          />
        }
      />
    </>
  );
}
