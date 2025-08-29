"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { IUser, IUserResponseMe } from "@/types/users";
import { GetAllInventoryProviderResponse } from "@/types/inventory";
import { InventoryProviderCardGrid } from "./inventory-provider-card-grid";

interface Props {
  inventories: Promise<ApiResponse<GetAllInventoryProviderResponse>>;
  query: SearchParams;
  provider?: IUser | IUserResponseMe;
}

export default function InventoryProviderCardListContainer({
  inventories,
  query,
  provider,
}: Props) {
  const inventoriesResponse = use(inventories);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(inventoriesResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    <div className="space-y-6">
      {inventoriesResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-start gap-2">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Inventario - <span className="font-bold"> {provider?.name}</span>
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestione el inventario de sus productos -{" "}
              <span className="font-bold"> {provider?.name}</span>
            </p>
          </div>
        </div>

        <InventoryProviderCardGrid
          data={inventoriesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          provider={provider}
        />
      </div>
    </div>
  );
}
