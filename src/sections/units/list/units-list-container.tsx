"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllUnits } from "@/types/units";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { UnitsList } from "./units-list";

interface UnitsListPageProps {
  unitsPromise: Promise<ApiResponse<GetAllUnits>>;
  query: SearchParams;
}

export default function UnitsListContainer({
  unitsPromise,
  query,
}: UnitsListPageProps) {
  const unitsResponse = use(unitsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(unitsResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {unitsResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Unidades
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra las unidades del sistema y sus datos asociados
            </p>
          </div>
        </div>

        <UnitsList
          data={unitsResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
