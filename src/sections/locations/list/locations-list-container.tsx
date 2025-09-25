"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllLocations } from "@/types/locations";

import { LocationsList } from "./locations-list";

interface LocationsListContainerProps {
  locationsPromise: ApiResponse<GetAllLocations>;
  query?: SearchParams;
}

export default function LocationsListContainer({
  locationsPromise,
  query,
}: LocationsListContainerProps) {
  const locationsResponse = locationsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Localizaciones
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maneja las localizaciones y sus datos asociados
            </p>
          </div>
        </div>

        <LocationsList
          data={locationsResponse.data}
          searchParams={query || {}}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
