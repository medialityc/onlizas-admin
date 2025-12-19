"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllStores } from "@/types/stores";

import { StoresList } from "./stores-list";

interface StoresListPageProps {
  storesPromise: ApiResponse<GetAllStores>;
  query: SearchParams;
}

export default function StoresListContainer({
  storesPromise,
  query,
}: StoresListPageProps) {
  const storesResponse = storesPromise;

  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Gestión de Tiendas
            </h1>
            <p className="text-muted-foreground mt-1">
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
