"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { WarehouseInventoryCardGrid } from "../components/warehouse-inventory-card-grid/warehouse-inventory-card-grid";

import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";
import { PaginatedResponse } from "@/types/common";
import { WarehouseInventoryExportActions } from "../components/warehouse-inventory-export-actions";
import { InventoryProvider } from "@/types/inventory";

interface Props {
  inventoryPromise: ApiResponse<PaginatedResponse<InventoryProviderFormData>>;
  query: SearchParams;
}

export default function WarehouseInventoryListContainer({
  inventoryPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Inventario del Almacén
          </h2>
          <WarehouseInventoryExportActions
            items={
              (inventoryPromise?.data
                ?.data as unknown as InventoryProvider[]) ?? []
            }
          />
        </div>
        <WarehouseInventoryCardGrid
          data={inventoryPromise?.data?.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
