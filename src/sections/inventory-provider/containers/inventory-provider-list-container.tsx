"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { GetAllCurrencies } from "@/services/currencies";
import { InventoryProviderList } from "../components/inventory-prvider-list/inventory-prvider-list";

interface InventoryProviderListPageProps {
  inventories: Promise<ApiResponse<GetAllCurrencies>>;
  query: SearchParams;
}

export default function InventoryProviderListContainer({
  inventories,
  query,
}: InventoryProviderListPageProps) {
  const inventoryResponse = use(inventories);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(inventoryResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {inventoryResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Inventario por Proveedores
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona el inventario de cada proveedor
            </p>
          </div>
        </div>

        <InventoryProviderList
          data={inventoryResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
