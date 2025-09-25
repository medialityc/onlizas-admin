"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllRegions } from "@/types/regions";

import { RegionList } from "./components/region-list";

interface RegionListContainerProps {
  regionsPromise: ApiResponse<GetAllRegions>;
  query: SearchParams;
}

export default function RegionListContainer({
  regionsPromise,
  query,
}: RegionListContainerProps) {
  const regionsResponse = regionsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  // Convert ApiResponse to PaginatedResponse format expected by DataGrid
  const paginatedData = regionsResponse.data || undefined;

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Regiones
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maneja las regiones y sus configuraciones asociadas
            </p>
          </div>
        </div>

        <RegionList
          data={paginatedData}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
