"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { GetAllInventoryProviderResponse } from "@/services/inventory-providers";
import InventoryProviderCardList from "../inventory-provider-card/inventory-provider-card-list";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props {
  data?: GetAllInventoryProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  provider: number;
}

export function InventoryProviderCardGrid({
  data,
  searchParams,
  provider,
  onSearchParamsChange,
}: Props) {
  const { push } = useRouter();
  const handleInventoryProviderCreate = useCallback(
    () => push(`/dashboard/inventory/${provider}/inventory/new`),
    [provider, push]
  );
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar inventario..."
        onCreate={handleInventoryProviderCreate}
        createText="Crear inventario"
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
