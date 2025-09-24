"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { PaginatedResponse } from "@/types/common";
import { SystemConfiguration } from "@/types/system-configuration";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { ConfigurationsList } from "./configurations-list";

interface ConfigurationsListPageProps {
  configurationsPromise: ApiResponse<PaginatedResponse<SystemConfiguration>>;
  query: SearchParams;
}

export default function ConfigurationsListContainer({
  configurationsPromise,
  query,
}: ConfigurationsListPageProps) {
  const response = configurationsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();

  useFetchError(response);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {response.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Configuraciones del Sistema
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra las configuraciones por país y tipo
            </p>
          </div>
        </div>

        <ConfigurationsList
          data={response.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
