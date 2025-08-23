"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllStores } from "@/types/stores";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { StoresList } from "./stores-list";

interface StoresListPageProps {
  storesPromise: Promise<ApiResponse<GetAllStores>>;
  query: SearchParams;
}

export default function StoresListContainer({
  storesPromise,
  query,
}: StoresListPageProps) {
  const storesResponse = use(storesPromise);

  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(storesResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {storesResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Tiendas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra las tiendas del sistema y sus datos asociados
            </p>
          </div>
        </div>

        <StoresList
          data={storesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
