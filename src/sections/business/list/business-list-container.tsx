"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllBusiness } from "@/types/business";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { BusinessList } from "./business-list";

interface BusinessListPageProps {
  businessPromise: Promise<ApiResponse<GetAllBusiness>>;
  query: SearchParams;
}

export default function BusinessListContainer({
  businessPromise,
  query,
}: BusinessListPageProps) {
  const businessResponse = use(businessPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(businessResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {businessResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Negocios
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maneja los negocios y sus datos asociados
            </p>
          </div>
        </div>

        <BusinessList
          data={businessResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
