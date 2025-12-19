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
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Gestión de Regiones
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra las regiones del sistema y sus configuraciones
              asociadas
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
