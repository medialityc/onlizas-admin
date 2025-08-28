"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { WarehouseInventoryCardGrid } from "../components/warehouse-inventory-card-grid/warehouse-inventory-card-grid";

import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";

interface Props {
  inventoryPromise: ApiResponse<InventoryProviderFormData[]>;
  query: SearchParams;
}

export default function WarehouseInventoryListContainer({
  inventoryPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(inventoryPromise);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {inventoryPromise.status == 401 && <SessionExpiredAlert />}
      <div className="panel flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Inventarios del Almacén
          </h2>
        </div>

        <WarehouseInventoryCardGrid
          data={inventoryPromise?.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
