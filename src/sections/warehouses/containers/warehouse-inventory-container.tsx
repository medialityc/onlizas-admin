"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { WarehouseInventoryCardGrid } from "../components/warehouse-inventory-card-grid/warehouse-inventory-card-grid";

import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";
import { PaginatedResponse } from "@/types/common";

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
        <WarehouseInventoryCardGrid
          data={inventoryPromise?.data?.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
